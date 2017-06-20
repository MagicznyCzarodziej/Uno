var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var Deck = require('./Deck.js');
var Clients = require('./Clients.js');
app.use(express.static('public'));
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/Uno.html");
})


Deck.setup();
Deck.shuffle();

var turnPlayer = "";
var op;
var lastCard = Deck.take();
const START_CARDS = 7;

io.on("connection", function (socket) {
  //Send ID
  socket.emit('id', socket.id);

  //Add player
  socket.on('set nickname', function (nickname) {
    //Add client to the clients list
    socket.nickname = nickname;
    socket.cards = START_CARDS;
    Clients.addClient(socket);
    console.log(`Client ${socket.id} connected.`);

    //Set op
    if(Clients.getAmount() == 1){
      op = socket.id;
      socket.emit('set op');
      turnPlayer = socket.id;
    }

    //Send initial deck
    let clientDeck = Deck.take(START_CARDS);
    socket.emit("initial deck", clientDeck);
    socket.emit("users list", Clients.getList());
    socket.emit("start card", lastCard);
    socket.broadcast.emit("new player", {id: socket.id, nickname: nickname, cards: START_CARDS});

    //Put card to stack
    socket.on("put card", function (card) {
      console.log(`Card to stack (${card.symbol} ${card.color})`);
      lastCard = card;
      socket.broadcast.emit("card to stack", card);
      Deck.put(card); // Return card to the bottom of the deck
      Clients.takeCard(socket);
      socket.broadcast.emit('other cards change', {id: socket.id, amount: Clients.getCards(socket)});
    });

    //Take card from deck
    socket.on("take card", function () {
      let card = Deck.take();
      Clients.addCard(socket);
      socket.emit("get card", card);
      socket.broadcast.emit('other cards change', {id: socket.id, amount: Clients.getCards(socket)});
    });

    //Next turn
    socket.on("next turn", function () {
      let nextPlayer = Clients.getNextPlayer(socket);
      console.log(`Next turn: ${nextPlayer.id}`);
      io.sockets.emit('next turn', nextPlayer.id);
    });
  });

	//Disconnect client
  socket.on("disconnect", function () {
		//Delete client from clients list
    Clients.removeClient(socket);
    console.log(`Client ${socket.id} disconnected.`);
  });
});


http.listen(3000, function(){
  console.log("listening on *:3000");
});

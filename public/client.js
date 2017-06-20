var socket = io.connect('http://8938f262.ngrok.io/');
var myID = "";
var op = false;
var myTurn = false;
var lastCard = "";
var canTake = false;
//Get ID
socket.on('id', function (id) {
  myID = id;
});

//Set nickname
let nickname = prompt("Nick: ", "Gracz") || "Gracz";
socket.emit("set nickname", nickname);

//Get start cards
socket.on('initial deck', function (deck) {
  for(let card of deck){
    addCard(card);
  }
});

//OP
socket.on('set op', function () {
  op = true;
  myTurn = true;
  $('#controls').addClass("op");
  $('#controls').append('<div id="game-start">START</div>');
});

//Other player connected
socket.on('new player', function (player) {
  drawPlayer(player);
});

//Draw users
socket.on('users list', function (users) {
  for (let i = 0; i < users.length; i++){
    if(users[i].id != myID) drawPlayer(users[i]);
  }
});

//First card
socket.on('start card', function (card) {
  putCard(card);
})

//Take card from deck
socket.on('get card', function (card) {
  addCard(card);
  if(card.symbol == lastCard.symbol || card.color == lastCard.color || card.color == "black" || lastCard.color == "black"){
    $('#controls').prepend('<div id="next-turn">POMIN</div>');
  }else{
    socket.emit('next turn');
    myTurn = false;
  }
});

//New card on stack
socket.on('card to stack', function (card) {
  putCard(card);
});

//Change other player cards amount
socket.on('other cards change', function (data) {
  changeCardsAmount(data.id, data.amount);
});

socket.on('next turn', function (id) {
  if(id == myID){
    myTurn = true;
    canTake = true;
  }
})

function changeCardsAmount(playerID, amount) {
  let div = $(`.player[data-id=${playerID}] .player-cards`);
  $(div).html("");
  for(let i = 0; i < amount; i++) $(div).append('<div class="back"></div>');
}

function drawPlayer(player) {
  let id = player.id;
  let nickname = player.nickname;
  let amount = player.cards;
  let playerDiv = $(`<div class="player" data-id="${id}"></div>`);
  playerDiv.append(`<div class="player-name">${nickname}</div>`);
  playerDiv.append('<div class="player-cards"></div>');
  $("#players").append(playerDiv);
  changeCardsAmount(id, amount);
}

function putCard(card) {
  lastCard = card;
  let symbol = card.symbol;
  let color = card.color;
  let cardDiv = $(`<div class="stack-card ${color}" style="transform: rotate(${(Math.random() * 140)-70}deg) translate(${(Math.random() * 30)-15}px, ${(Math.random() * 30)-15}px);"><div class="card-text">${symbol}</div> <div class="card-symbol">${symbol}</div></div>`)
  $('#stack').append(cardDiv);
}

function addCard(card) {
  $('#myCards').append(`<div class="card ${card.color}" data-color="${card.color}" data-symbol="${card.symbol}"><span class="card-text">${card.symbol}</span><span class="card-symbol">${card.symbol}</span></div>`);
}

$(function () {
  $("#controls").on("click", "#game-start", function(){
    //TODO: Game start
	});

  //Skip turn
  $("#controls").on("click", "#next-turn", function(){
    socket.emit('next turn');
    myTurn = false;
    $(this).remove();
	});

  //Take card from deck
  $("body").on("click", "#deck", function(){
    if(myTurn && canTake){
      canTake = false;
      socket.emit('take card');
    }
	});

  $("#myCards").on("click", ".card", function(){
    $("#next-turn").remove();
    if(myTurn){
      let symbol = $(this).attr("data-symbol");
      let color = $(this).attr("data-color");
      if(symbol == lastCard.symbol || color == lastCard.color || color == "black" || lastCard.color == "black"){
        myTurn = false;
        putCard({symbol: symbol, color: color});
        $(this).remove();
        socket.emit('put card', {symbol: symbol, color: color});
        socket.emit('next turn');
      }
    }
	});
});

var Clients = (function () {
  var addClient = function (socket) {
    if(!this.clients) this.clients = [];
    this.clients.push(socket);
  }
  var getList = function () {
    let players = [];
    for (let i = 0; i < this.clients.length; i++){
      let id = this.clients[i].id;
      let nickname = this.clients[i].nickname;
      let amount = this.clients[i].cards;
      players.push({id: id, nickname: nickname, cards: amount});
    }
    return players;
  }
  var removeClient = function (socket) {
    let i = this.clients.indexOf(socket);
    this.clients.splice(i, 1);
  }
  var getAmount = function () {
    return this.clients.length;
  }
  var changeCards = function (socket, amount) {
    let i = this.clients.indexOf(socket);
    this.clients[i].cards = amount;
  }
  var addCard = function (socket) {
    let i = this.clients.indexOf(socket);
    this.clients[i].cards++;
  }
  var takeCard = function (socket) {
    let i = this.clients.indexOf(socket);
    this.clients[i].cards--;
  }
  var getCards = function (socket) {
    let i = this.clients.indexOf(socket);
    return this.clients[i].cards;
  }
  var getNextPlayer = function (socket) {
    let i = this.clients.indexOf(socket);
    if(i == this.clients.length - 1) return this.clients[0];
    else return this.clients[i+1];
  }
  return {
    addClient: addClient,
    getList: getList,
    removeClient: removeClient,
    getAmount : getAmount,
    changeCards: changeCards,
    getCards: getCards,
    addCard: addCard,
    takeCard: takeCard,
    getNextPlayer: getNextPlayer
  }
})();

module.exports = Clients;

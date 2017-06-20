var Deck = (function(){
  this.symbols = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "S", "+2", "L"];
  this.colors = ["red", "blue", "yellow", "green"];

  var setup = function () {
    this.cards = [];
    for (let i in colors){
    	for(let j in symbols){
        this.cards.push({symbol: symbols[j], color: colors[i]});
        this.cards.push({symbol: symbols[j], color: colors[i]});
      }
    }

    for (let i = 0; i < 4; i++) this.cards.push({symbol: "+4", color: "black"});
    for (let i = 0; i < 4; i++) this.cards.push({symbol: "C", color: "black"});
  }

  var shuffle = function () {
    let j, x, i;
    for (i = this.cards.length; i; i--) {
        j = Math.floor(Math.random() * i);
        x = this.cards[i - 1];
        this.cards[i - 1] = this.cards[j];
        this.cards[j] = x;
    }
  }

  var take = function (howMany) {
    howMany = howMany || 1;
    if(howMany > 1){
      takenCards = [];
      for (let i = 0; i < howMany; i++) takenCards.push(this.cards.pop());
      return takenCards;
    }else{
      return this.cards.pop()
    }
  }

  var put = function (card) {
    let index = Math.random() * this.cards.length-10;
    this.cards.splice(index, 0, card); //Put card in random place in deck
  }

  return {
    shuffle: shuffle,
    setup: setup,
    take: take,
    put: put
  }
})();

module.exports = Deck;

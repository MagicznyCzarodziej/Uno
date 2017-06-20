var cards = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "S", "+2", "L"];
var colors = ["red", "blue", "yellow", "green"];

var deck = []; //temp 0
for(var i in colors){
	for(var j in cards){
		deck.push({symbol: cards[j], color: colors[i]});
	}
}
deck.push({symbol: "+4", color: "black"});
deck.push({symbol: "+4", color: "black"});
deck.push({symbol: "+4", color: "black"});
deck.push({symbol: "+4", color: "black"});

deck.push({symbol: "C", color: "black"});
deck.push({symbol: "C", color: "black"});
deck.push({symbol: "C", color: "black"});
deck.push({symbol: "C", color: "black"});

function shuffle(a) {
    var j, x, i;
    for (i = a.length; i; i--) {
        j = Math.floor(Math.random() * i);
        x = a[i - 1];
        a[i - 1] = a[j];
        a[j] = x;
    }
}

shuffle(deck);

$(document).ready(function(){
	var myDeck = [];
	for(var i = 0; i < 10; i++){
		myDeck[i] = deck.pop();
		console.log(myDeck[i].symbol + " " + myDeck[i].color);
	}

	for(var i in myDeck){
		$('#myCards').append('<div class="card ' + myDeck[i].color + '"><span class="card-text">' + myDeck[i].symbol + '</span><span class="card-symbol">' + myDeck[i].symbol + '</span></div>');
	}

});

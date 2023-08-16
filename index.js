// /*
//     In blackjack 1 can be chosen by player to be 1 or 11
//     and 12, 13, 14 are seen as 10
// */

let cards = [];
let cardSrcs = [];
let firstCard = '';
let secondCard = '';
let drawnCard;
let cardValueFromAPI;
let sum = 0;
let hasBlackJack = false;
let isAlive = false;
let isOneChosen = false;
let flag = false;
let isNewCardDrawn = false;
let firstCardStilAce = false;
let secondCardStilAce = false;
let drawnCardIsAce = false;
let message = '';
let player = {
    name: 'Nemanja',
    money: 0
};
let playerMoneyParagraph = document.getElementById('player-money');
playerMoneyParagraph.textContent = player.name + ': $' + player.money;
let messageParagraph = document.getElementById('message');
let sumParagraph = document.querySelector('#sum');
let cardsParagraph = document.getElementById('cards');

function handleOne() {

    if (secondCardStilAce) {
        secondCard = 1;

        sum = firstCard + secondCard;

        reRenderGame();
        document.querySelector('.player-choice-div').style.display = 'none';

    } else if (drawnCardIsAce) {
        let newCardChosen = 1;

        cards.push(newCardChosen);

        sum += newCardChosen;

        reRenderGame();
        document.querySelector('.player-choice-div').style.display = 'none';

        drawnCardIsAce = false;
    } else {
        firstCard = 1;

        sum = firstCard + secondCard;

        reRenderGame();
        document.querySelector('.player-choice-div').style.display = 'none';

    }

}

function handleEleven() {

    if (secondCardStilAce) {
        secondCard = 11;

        sum = firstCard + secondCard;

        reRenderGame();
        document.querySelector('.player-choice-div').style.display = 'none';

    } else if (drawnCardIsAce) {
        let newCardChosen = 11;

        cards.push(newCardChosen);

        sum += newCardChosen;

        reRenderGame();
        document.querySelector('.player-choice-div').style.display = 'none';

        drawnCardIsAce = false;
    } else {
        firstCard = 11;

        sum = firstCard + secondCard;

        reRenderGame();
        document.querySelector('.player-choice-div').style.display = 'none';

    }
}

function startGame() {
    isAlive = true;
    renderGame();

    document.querySelector('#start-game-button').style.display = 'none';
}


async function renderGame() {
    let img1Src = await getCardImageUrl();
    let img2Src = await getCardImageUrl();

    //when API loads imgs and sets values of first and second card render them...
    if (img1Src !== '' && img1Src !== null && img2Src !== '' && img2Src !== null) {
        cardSrcs.push(img1Src);
        cardSrcs.push(img2Src);

        cards = [firstCard, secondCard];
        sum = firstCard + secondCard;

        if (typeof firstCard !== 'number') {
            firstCardStilAce = true;
            document.querySelector('.player-choice-div').style.display = 'block';
            sum = '';
        } else if (typeof secondCard !== 'number') {
            secondCardStilAce = true;
            document.querySelector('.player-choice-div').style.display = 'block';
            sum = '';
        }

        cardsParagraph.textContent = 'Cards: ';
        const cardsContainer = document.createElement('div');
        cardsContainer.classList.add('cards-container');

        for (let i = 0; i < cardSrcs.length; i++) {
            let cardImage = document.createElement('img');

            cardImage.src = cardSrcs[i];
            cardImage.classList.add('card-image'); // Add the card-image class

            cardsContainer.appendChild(cardImage);
        }

        cardsParagraph.appendChild(cardsContainer);

        sumParagraph.textContent = 'Sum: ' + sum;

        if (sum <= 20) {
            message = 'Do you want to draw a new card?';
        } else if (sum === 21) {
            document.querySelector('#win-img').style.display = 'block';
            addPlayerMoney(1000);
            message = '';
            hasBlackJack = true;
            document.querySelector('#new-game-button').style.display = 'block';
        } else {
            if (firstCardStilAce || secondCardStilAce) {
                console.log('dont lose')
            } else {
                document.querySelector('#lose-img').style.display = 'block';
                message = '';
                isAlive = false;
                document.querySelector('#new-game-button').style.display = 'block';
            }
        }

        messageParagraph.textContent = message;
    }

}

function reRenderGame() {

    //check if one card is still an Ace
    if (typeof secondCard !== 'number') {
        secondCardStilAce = true;
        document.querySelector('.player-choice-div').style.display = 'block';
    }

    cardsParagraph.textContent = 'Cards: ';
    const cardsContainer = document.createElement('div');
    cardsContainer.classList.add('cards-container');

    for (let i = 0; i < cardSrcs.length; i++) {
        let cardImage = document.createElement('img');

        cardImage.src = cardSrcs[i];
        cardImage.classList.add('card-image'); // Add the card-image class

        cardsContainer.appendChild(cardImage);
    }

    cardsParagraph.appendChild(cardsContainer);

    sumParagraph.textContent = 'Sum: ' + sum;

    if (sum <= 20) {
        message = 'Do you want to draw a new card?';
    } else if (sum === 21) {
        document.querySelector('#win-img').style.display = 'block';
        addPlayerMoney(500);
        message = '';
        hasBlackJack = true;
        document.querySelector('#new-game-button').style.display = 'block';
    } else {
        document.querySelector('#lose-img').style.display = 'block';
        takePlayerMoney(50);
        message = '';
        isAlive = false;
        document.querySelector('#new-game-button').style.display = 'block';
    }

    messageParagraph.textContent = message;
}

async function getCardImageUrl() {
    const response = await fetch(`https://deckofcardsapi.com/api/deck/new/draw/?count=1`);
    const data = await response.json();
    cardValueFromAPI = getCardValue(data.cards[0].value);

    // if new card is drawn set drawnCard value if not set first and second
    if (isNewCardDrawn) {
        drawnCard = cardValueFromAPI;
    } else {
        if (!flag) {
            firstCard = cardValueFromAPI;
            flag = true;
        } else if (flag) {
            secondCard = cardValueFromAPI;
        }
    }

    return data.cards[0].image;
}

function getCardValue(value) {
    if (value === 'ACE') {
        // ace chosen, this 'if' is needed so that player can see choice bettween 1 or 11
    } else if (value === 'KING' || value === 'QUEEN' || value === 'JACK') {
        return 10;
    } else {
        return parseInt(value);
    }
}

async function newCard() {
    isNewCardDrawn = true;
    if (isAlive && !hasBlackJack) {
        let newCardSrc = await getCardImageUrl();
        if (newCardSrc !== '' && newCardSrc !== null) {
            if (typeof drawnCard !== 'number') {
                cardSrcs.push(newCardSrc);
                drawnCardIsAce = true;
                document.querySelector('.player-choice-div').style.display = 'block';
            } else {
                cardSrcs.push(newCardSrc);
                cards.push(drawnCard);
                sum += drawnCard;
                reRenderGame();
            }

            reRenderGame();

        }

    }
}

function resetGame() {
    cards = [];
    cardSrcs = [];
    firstCard = '';
    secondCard = '';
    drawnCard = '';
    sum = 0;
    cardValueFromAPI = 0;
    hasBlackJack = false;
    isAlive = false;
    isOneChosen = false;
    isNewCardDrawn = false;
    firstCardStilAce = false;
    secondCardStilAce = false;
    drawnCardIsAce = false;
    flag = false;
    message = '';
    document.querySelector('#win-img').style.display = 'none';
    document.querySelector('#lose-img').style.display = 'none';
    document.querySelector('.player-choice-div').style.display = 'none';
    document.querySelector('#start-game-button').style.display = 'block';
    document.querySelector('#new-game-button').style.display = 'none';
    messageParagraph.textContent = message;
    cardsParagraph.textContent = 'Cards: ';
    sumParagraph.textContent = 'Sum: ';
}

function addPlayerMoney(amount) {
    player.money += amount;
    playerMoneyParagraph.textContent = player.name + ': $ ' + player.money;
}

function takePlayerMoney(amount) {
    player.money -= amount;
    playerMoneyParagraph.textContent = player.name + ': $ ' + player.money;
}

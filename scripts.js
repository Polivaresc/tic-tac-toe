
const gameboardModule = ((cellFactory) => {
    const gameboard = []

    const createBoard = function () {
        const container = document.querySelector('.container')
        for (i = 0; i<3*3; i++) {
            const cell = document.createElement('div')
            cell.setAttribute('id', i)
            cell.setAttribute('class', 'cell')
            container.appendChild(cell)

            const Cell = Object.assign({}, cellFactory, {id: cell.id})
            gameboard.push(Cell)
        }
    }
    
    return {createBoard}
})();


gameboardModule.createBoard()


const playerModule = ((playerFactory) => {

    const player1 = Object.assign({}, playerFactory, {symbol: 'X'})
    const player2 = Object.assign({}, playerFactory, {symbol: 'O'})

    function play() {
        if (player1.round <= player2.round) {
            const cell = document.querySelector('.cell')
            cell.addEventListener('click', () => {
                if (!cell.textContent)
                cell.textContent = player1.symbol
            })
        }
    }

        // play: play() {
        // player click a cell, take the cell id; 
        // if the cell has a symbol already player must click another cell
        // if the cell is empty put the player's symbol in that cell (change styles)
    // }

    return {play}

})();


// each cell has = {id, empty: true (if no player has clicked it yet), symbol: null if it's empty, X if it's one player, O if it's the other player}
const cellFactory = {
    symbol: function symbol(player) {
        return player.symbol
    },
    empty: function isEmpty(symbol) {
        if (!symbol) {
            return true
        }
    }
}

const playerFactory = (name) => {
    let score = 0
    let round = 0
    const getName = () => name

    const win = () => {
    
    }

    return {getName, win}
}


// const results = {firstLine: [O, O, O], secondLine: [O, O, O], thirdLine: [O, O, O]}

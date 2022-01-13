
const gameboardModule = (() => {
    const gameboard = []

    const createBoard = () => {
        const container = document.querySelector('.container')
        for (i = 0; i<3*3; i++) {
            const domCell = document.createElement('div')
            domCell.setAttribute('id', 'cell-' + i)
            domCell.classList = 'cell unmarked'
            container.appendChild(domCell)

            domCell.addEventListener('click', () => {
                const cell = gameboard.find(c => c.id === domCell.id)
                game.mark(cell)
            })

            gameboard.push({id: domCell.id, player: null})
        }
    }

    const addSymbol = (cell) => {
        const domCell = document.querySelector('#' + cell.id)
        domCell.textContent = cell.player.getSymbol()
        domCell.style.color = cell.player.getColor()
        domCell.classList.remove('unmarked')
    }

    const getGameboard = () => gameboard
    
    return {createBoard, addSymbol, getGameboard}
})();


// const playerInfo = document.querySelector('#submit-players')
//     playerInfo.addEventListener('submit', (e) => {
//     e.preventDefault
//     const player1 = {name: document.querySelector('#player1-name').value, color: document.querySelector('#color-select1').value}
//     const player2 = {name: document.querySelector('#player2-name').value, color: document.querySelector('#color-select2').value}

    
//     return {player1, player2}
//     })


const playerFactory = (name, color, symbol) => {

    const getName = () => name
    const getColor = () => color
    
    const getSymbol = () => symbol

    const win = () => {
        alert(`Player ${getName()} is the winner`)
        location.reload()
    }

    return {getName, getColor, getSymbol, win}
}

const game = (() => {
    const player1 = playerFactory('Nyx', '#FF3855', 'X')
    const player2 = playerFactory('Seitan', '#00CC99', 'O')
    let currentPlayer = player1

    const start = () => {
        gameboardModule.createBoard()
        announcePlayer()
    }

    const mark = (cell) => {
        if (cell.player) {
            alert('That cell is not available')
            return
        }

        cell.player = currentPlayer
        gameboardModule.addSymbol(cell)
        if (checkWinner(currentPlayer)) {
            currentPlayer.win()
        } else {
            const board = gameboardModule.getGameboard()

            if (!board.find(c => c.player === null)) {
                alert('Draw')
                location.reload()
            }
            nextPlayer()
        }
    }

    const nextPlayer = () => {
        currentPlayer = ((currentPlayer === player1) ? player2 : player1)
        announcePlayer()
    }

    const announcePlayer = () => {
        const announcement = document.querySelector('#player-announce')
        announcement.textContent = `${currentPlayer.getName()}'s turn!`
        announcement.style.color = currentPlayer.getColor()
    }

    const checkWinner = (player) => {
        const horizontal = [0, 3, 6].map(i => [i, i+1, i+2]);
        const vertical = [0, 1, 2].map(i => [i, i+3, i+6]);
        const diagonal = [[0, 4, 8], [2, 4, 6]];

        const allWins = [].concat(horizontal).concat(vertical).concat(diagonal);
        const board = gameboardModule.getGameboard()
        
        return allWins.some(indices => { 
            const wins = board[indices[0]].player === player && board[indices[1]].player === player && board[indices[2]].player === player
            if (wins) {
                console.log(board[indices[0]])
                console.log(board[indices[1]])
                console.log(board[indices[2]])
            }
            return wins
        })
    }

    return {start, mark}
    
})();

game.start()


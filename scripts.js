
const gameboardModule = (() => {
    const gameboard = []

    const createBoard = () => {
        const container = document.querySelector('#container')
        container.innerHTML = ''
        
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

        container.classList.replace('starting', 'container')
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

const playerFactory = (name, color, symbol) => {

    const getName = () => name
    const getColor = () => color
    
    const getSymbol = () => symbol

    return {getName, getColor, getSymbol}
}

const game = (() => {
    let player1
    let player2
    let currentPlayer

    const start = (inputPlayer1, inputPlayer2) => {
        player1 = inputPlayer1
        player2 = inputPlayer2
        currentPlayer = player1
        gameboardModule.createBoard()
        announcePlayer()
    }

    const end = (winner) => {
        const modal = document.querySelector('.modal')
        modal.style.display = 'flex'

        if (winner) {
            document.querySelector('#end-message').textContent = `The winner is ${winner}!`
        } else {
            document.querySelector('#end-message').textContent = `It's a tie!`
        }

        document.querySelector('#ok-button').addEventListener('click', () => {
            document.querySelectorAll('input').forEach(i => i.value = '')
            location.reload()
        }) 
    }

    const mark = (cell) => {
        if (cell.player) {
            alert('That cell is not available')
            return
        }

        cell.player = currentPlayer
        gameboardModule.addSymbol(cell)
        if (checkWinner(currentPlayer)) {
            end(currentPlayer.getName())
        } else {
            const board = gameboardModule.getGameboard()

            if (!board.find(c => c.player === null)) {
                end()
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

const player1colors = document.querySelectorAll('#player1-form .color-picker div')
player1colors.forEach(c => {
    c.addEventListener('click', () => {
        document.querySelector('#player1-color').setAttribute('value', c.style['background-color'])
        document.querySelector('#player1-form .square.selected')?.classList.remove('selected')
        c.classList.add('selected')
    })
})

const player2colors = document.querySelectorAll('#player2-form .color-picker div')
player2colors.forEach(c => {
    c.addEventListener('click', () => {
        document.querySelector('#player2-color').setAttribute('value', c.style['background-color'])
        document.querySelector('#player2-form .square.selected')?.classList.remove('selected')
        c.classList.add('selected')
    })
})

const playerForm = document.querySelector('form')

playerForm.addEventListener('submit', (e) => {
    e.preventDefault()
    const inputData = new FormData(playerForm);

    const player1 = playerFactory(inputData.get('player1-name'), inputData.get('player1-color'), 'X')
    const player2 = playerFactory(inputData.get('player2-name'), inputData.get('player2-color'), 'O')

    game.start(player1, player2)

    document.querySelectorAll('input').forEach(i => i.setAttribute('disabled', true))
    document.querySelectorAll('.square').forEach(s => s.style.pointerEvents = 'none')
    document.querySelector('#submit-players').style.display = 'none'

    return null
})


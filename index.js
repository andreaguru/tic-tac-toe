// tic-tac-toe.js

class TicTacToe {
    constructor() {
        this.board = Array(9).fill(null);
        this.currentPlayer = 'X';
        this.gameOver = false;
        this.boardElements = document.querySelectorAll('.cell');
        this.statusDisplay = document.querySelector('.status');
        this.opponentSelect = document.querySelector('#opponent');
        this.undoButton = document.querySelector('#backToPrevState');
        this.history = [];
        
        this.loadSettings();
        this.initEventListeners();
    }

    initEventListeners() {
        this.boardElements.forEach(cell => {
            cell.addEventListener('click', () => this.makeMove(cell.dataset.index));
        });
        
        this.opponentSelect.addEventListener('change', (event) => {
            this.aiEnabled = event.target.value === 'computer';
            localStorage.setItem('opponent', event.target.value);
            this.undoButton.disabled = this.aiEnabled;
            this.resetGame();
        });
        
        document.getElementById('backToPrevState').addEventListener('click', () => this.undoMove());
    }

    loadSettings() {
        const savedOpponent = localStorage.getItem('opponent');
        if (savedOpponent) {
            this.opponentSelect.value = savedOpponent;
            this.aiEnabled = savedOpponent === 'computer';
            this.undoButton.disabled = this.aiEnabled;
        }
    }

    makeMove(index) {
        index = parseInt(index);
        if (!this.board[index] && !this.gameOver) {
            this.history.push([...this.board]); // Save current state before move
            this.board[index] = this.currentPlayer;
            this.boardElements[index].innerText = this.currentPlayer;
            this.checkWinner();
            if (!this.gameOver) {
                this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
                this.updateStatus();
                if (this.aiEnabled && this.currentPlayer === 'O') {
                    setTimeout(() => this.aiMove(), 500);
                }
            }
        }
    }

    undoMove() {
        if (this.history.length > 0) {
            this.board = this.history.pop();
            this.boardElements.forEach((cell, index) => {
                cell.innerText = this.board[index] || '';
            });
            this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
            this.gameOver = false;
            this.updateStatus();
        }
    }

    checkWinner() {
        // list all the possible winning combinations in the table
        const winningCombinations = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];
        
        for (let combo of winningCombinations) {
            const [a, b, c] = combo;
            if (this.board[a] && this.board[a] === this.board[b] && this.board[a] === this.board[c]) {
                this.gameOver = true;
                this.updateStatus(`Player ${this.board[a]} wins!`);
                this.statusDisplay.classList.add("endgame");
                return;
            }
        }

        if (!this.board.includes(null)) {
            this.gameOver = true;
            this.updateStatus("It's a draw!");
        }
    }

    aiMove() {
        let emptyIndices = this.board.map((val, index) => val === null ? index : null).filter(val => val !== null);
        if (emptyIndices.length > 0) {
            let randomIndex = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
            this.makeMove(randomIndex);
        }
    }

    updateStatus(message = `Player ${this.currentPlayer}'s turn`) {
        this.statusDisplay.innerText = message;
    }

    resetGame() {
        this.board.fill(null);
        this.history = [];
        this.boardElements.forEach(cell => (cell.innerText = ''));
        this.currentPlayer = 'X';
        this.gameOver = false;
        this.updateStatus();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new TicTacToe();
});

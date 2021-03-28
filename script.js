
const Gameboard = (() => {
  let boardArray = ['','','','','','','','',''];
  const gameBoard = document.querySelector('#board');
  const spaces = Array.from(document.querySelectorAll('.play-btn'));
  let winner = null;

  const render = () => {
    boardArray.forEach((marker, num) => {
      spaces[num].textContent = boardArray[num];
    });
  };

  const reset = () => {
    boardArray = ['','','','','','','','',''];
  }

  const checkWin = () => {
    const winningMoves = [
      [0,1,2],
      [3,4,5],
      [6,7,8],
      [0,3,6],
      [1,4,7],
      [2,5,8],
      [0,4,8],
      [2,4,6],
    ];

    winningMoves.forEach((win) => {
      if (boardArray[win[0]] && boardArray[win[0]] === boardArray[win[1]] && boardArray[win[0]] === boardArray[win[2]]) {
        console.log(boardArray[win[0]],boardArray[win[1]],boardArray[win[2]]);
        winner = 'current';
      }
    });
    return winner || (boardArray.includes('') ? null : 'Tie');
  };
  return {
    render, gameBoard, spaces, boardArray, checkWin, reset,
  }
})();

const Players = (marker) => {
  const playTurn = (board, space) => {
    const num = board.spaces.findIndex(position => position === space);
    if (board.boardArray[num] === '') {
      board.render();
      return num;
    }
    return null;
  };
  return { marker, playTurn };
}

const Gameflow = (() => {
  const gameBoard = document.querySelector('.board');
  const resetButton = document.querySelector('.rst-btn');
  const playButton = document.querySelector('.play-btn');
  const playSelectiosn = document.querySelectorAll('.choice-btn');
  const results = document.querySelector('.winner');
  let currentPlayer;
  let playerX = {marker: 'X'};
  let playerO = {marker: 'O'};

  const newTurn = () => {
    currentPlayer = (currentPlayer === playerX) ? playerO : playerX;
  };

  const gameRound = () => {
    const _board = Gameboard;
    const playersTurn = Array.from(document.querySelectorAll('.players p'));

    if (currentPlayer === playerX) {
      playersTurn[0].classList.remove('active');
      playersTurn[1].classList.add('active');
    } else {
      playersTurn[1].classList.remove('active');
      playersTurn[0].classList.add('active');
    };

    _board.spaces.addEventListener('click', (e) => {
      console.log(e);
      e.preventDefault();
      const play = currentPlayer.playTurn(_board, e.target);
      if (play !== null) {
        _board.boardArray[play] = `${currentPlayer.marker}`;
        _board.render();
        const winStatus = _board.checkWin();
        if (winStatus === "Tie") {
          results.classList.style = 'block';
          results.firstChild.textConent = 'Tie';
        } else if (winStatus = null) {
          newTurn();
        } else {
          results.classList.style = 'block';
          results.firstChild.textConent = `${currentPlayer.marker} Wins`;
          _board.reset();
          _board.render();
        }
      }
    })
  }

  const gameStart = () => {
    gameRound();
  }

  playButton.addEventListener('click', (e) => {
    console.log(e);
    start.classList.add('hidden');
    gameRound();
  })

  resetButton.addEventListener('click', (e) => {
    window.location.reload();
  })
})();

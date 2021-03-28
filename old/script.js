'use strict';

const PlayerFactory = (marker) => {
  this.marker = marker;

  const getMarker = () => {
    return marker;
  }

  return { marker };
};

const gameBoard = (() => {
  const board = ['','','','','','','','',''];

  const setPlay = (idx, marker) => {
    board[idx] = marker;
  };

  const getPlay = (idx) => {
    return board[idx];
  };

  const reset = () => {
    board.forEach(i => board[i] = '');
  };

  return { setPlay, getPlay, reset, board };
})();;

const displayController = (() => {
  const boardGame = Array.from(document.querySelectorAll('.play-btn'));
  const resetButton = document.querySelector('.rst-btn');
  const gameWon = document.querySelector('.winner');
  const endMessage = document.querySelector('.endMessage');
  const playDisplay = Array.from(document.querySelectorAll('.players'));

  boardGame.forEach((element) =>
    element.addEventListener('click', (e) => {
      if (e.target.textConent !== '') return;
      gameFlow.playTurn(parseInt(e.target.dataset.index));
      setGameBoard();
    })
  );

  resetButton.addEventListener('click', (e) => {
    gameBoard.reset();
    gameFlow.reset();
    setGameBoard();
    gameWon.classList.style.display = 'none';
  });

  const setGameBoard = () => {
    for (let i = 0; i < boardGame.length; i++) {
      boardGame[i].textConent = gameBoard.getPlay(i);
    }
  };

  const gameResults = (winner) => {
    if (winner === 'Tie') {
      gameWon.classList.style.display = 'block';
      endMessage.textConent = 'Tie!';
    } else {
      gameWon.classList.style.display = 'block';
      endMessage.textConent = `${winner} Wins!`;
    }
  };

  const showPlayer = () => {
    if (playDisplay[0].classList.contains('active')) {
      playDisplay[0].classList.remove('active');
      playDisplay[1].classList.add('active');
    } else {
      playDisplay[0].classList.add('active');
      playDisplay[1].classList.remove('active');
    }
  };

  return { gameResults, showPlayer }
})();

const gameFlow = (() => {
  const playerX = PlayerFactory('X');
  const playerO = PlayerFactory('O');
  let currentPlayer = playerX;

  const playTurn = (idx) => {
    gameBoard.setPlay(idx, getPlayerMarker());
    if (checkWin()) {
      displayController.gameResults(getPlayerMarker());
      return;
    } else if (!checkWin() && !gameBoard.board.includes('')) {
      displayController.gameResults('Tie');
      return;
    }
    displayController.showPlayer();
  };

  const getPlayerMarker = () => {
    currentPlayer = (currentPlayer === playerX) ? playerO : playerX;
    return currentPlayer.getMarker();
  }

  const reset = () => {
    window.location.reload();
  }

  return { playTurn, reset };
})();

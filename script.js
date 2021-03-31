const Gameboard = (() => {
  let boardArray = ['','','','','','','','',''];
  // let boardArray = ['X','O','X','O','X','O','O','X','O'];

  const reset = () => {
    boardArray = ['','','','','','','','',''];
    winner = null;
  }

  const getMove = (index) => {
    return boardArray[index];
  };

  const setMove = (index, marker) => {
    boardArray[index] = marker;
  };

  const winCheck = () => {
    const winCombos = [
      [0,1,2],
      [3,4,5],
      [6,7,8],
      [0,3,6],
      [1,4,7],
      [2,5,8],
      [0,4,8],
      [2,4,6]
    ];

    let winner = null;

    winCombos.forEach(combo => {
      if (boardArray[combo[0]] !== '' &&
          boardArray[combo[0]] === boardArray[combo[1]] &&
          boardArray[combo[0]] === boardArray[combo[2]]) {
          winner = 'currentPlayer';
        }
    });

    if (!boardArray.includes('') && winner === null) winner = 'Tie';
    return winner;
  };

  return { setMove, getMove, boardArray, winCheck, reset };
})();

const Players = (marker) => {
  const type = '';
  return { marker, type }
};

const displayController = (() => {
  const playerOne = Players('X');
  const playerTwo = Players('O');
  let currentPlayer = playerOne;
  const playing = Array.from(document.querySelectorAll('.players p'));
  const gameOver = document.querySelector('.winner');
  const endMessage = document.querySelector('.endMessage');
  const spaces = Array.from(document.querySelectorAll('.play-btn'));
  const resetButton = document.querySelector('.rst-btn');
  const startButton = document.querySelector('#start-btn');
  const choices = Array.from(document.querySelectorAll('.choice-btn'));
  const selection = document.querySelector('.selection');
  resetButton.style.display = 'none';
  let isDone = false;

  const activate = (e) => {
    let choice = e.target.id;
    if (choice === 'p1hum') {
      choices[0].classList.add('activated');
      choices[1].classList.remove('activated');
    } else if (choice === 'p1ai') {
      choices[1].classList.add('activated');
      choices[0].classList.remove('activated');
    } else if (choice === 'p2hum') {
      choices[2].classList.add('activated');
      choices[3].classList.remove('activated');
    } else if (choice === 'p2ai') {
      choices[3].classList.add('activated');
      choices[2].classList.remove('activated');
    }
    return choices;
  }

  const start = () => {
    startButton.style.display = 'none';
    resetButton.style.display = 'block';
    selection.style.display = 'none';
    if (choices[1].classList.contains('activated')) {
      playerOne.type = 'ai';
    } else {
      playerOne.type = 'human';
    }
    if (choices[3].classList.contains('activated')) {
      playerTwo.type = 'ai';
    } else {
      playerTwo.type = 'human';
    }
    aiMoves();
  }

  const playerSwitch = () => {
    if (isDone === true) return;
    currentPlayer = (currentPlayer === playerOne) ? playerTwo : playerOne;
    console.log(currentPlayer);
    playerDisplay();
  }

  const aiMoves = () => {
    if (currentPlayer.type === 'human') return;
    if (gameEnd()) return;
    let played;
    for (let i = 0; i < 9; i++) {
      if (Gameboard.getMove(i) === '' && played !== currentPlayer.marker) {
        Gameboard.setMove(i, currentPlayer.marker);
        spaces[i].textContent = currentPlayer.marker;
        played = currentPlayer.marker;
        gameOverMessage();
        playerSwitch();
        aiMoves();
        return;
      }
    }
  }

  const updateBoard = (e) => {
    if (gameEnd()) return;
    let index = e.target.id;
    Gameboard.setMove(index, currentPlayer.marker);
    spaces[index].textContent = currentPlayer.marker;
    gameOverMessage();
    playerSwitch();
    aiMoves();
  };

  const playerDisplay = () => {
    playing.forEach(player => {
      if (player.classList.contains('active')) {
        player.classList.remove('active');
      } else {
        player.classList.add('active');
      }
    })
  }

  const gameOverMessage = () => {
    let winner = Gameboard.winCheck();
    if (winner === 'Tie') {
      gameOver.style.display = 'block';
      endMessage.textContent = 'The game is a draw!';
    } else if (winner === 'currentPlayer') {
      gameOver.style.display = 'block';
      endMessage.textContent = `${currentPlayer.marker} Wins!`;
    } else {
      gameOver.style.display = 'none';
      endMessage.textContent = '';
    };
    gameEnd(winner);
  };

  const gameEnd = (winner) => {
    if (winner === 'Tie' || winner === 'currentPlayer') {
      isDone = true;
    }
    return isDone;
  }

  const reset = () => {
    Gameboard.reset();
    if (currentPlayer === playerTwo) playerDisplay();
    currentPlayer = playerOne;
    gameOver.style.display = 'none';
    endMessage.textContent = '';
    for (let i = 0; i < spaces.length; i++) {
      spaces[i].textContent = '';
    }
    isDone = false;
    aiMoves();
  }

  spaces.forEach(space => space.addEventListener('click', updateBoard));
  choices.forEach(choice => choice.addEventListener('click', activate));
  resetButton.addEventListener('click', reset);
  startButton.addEventListener('click', start);

  return { updateBoard, gameOverMessage, reset, currentPlayer, aiMoves }
})();

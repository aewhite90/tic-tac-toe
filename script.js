const Gameboard = (() => {
  let boardArray = ['','','','','','','','',''];
  // let boardArray = ['X','O','X','O','X','O','O','X','O'];

  const reset = () => {
    boardArray = ['','','','','','','','',''];
    winner = null;
  }

  // const getMove = (index) => {
  //   return boardArray[index];
  // };

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
    console.log('Gameboard: ', winner);
    return winner;
  };

  return { setMove, boardArray, winCheck, reset };
})();

const Players = (marker) => {
  return { marker }
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
  let isDone = false;

  const updateBoard = (e) => {
    console.log(gameEnd());
    if (gameEnd()) return;
    let index = e.target.id;
    Gameboard.setMove(index, currentPlayer.marker);
    spaces[index].textContent = currentPlayer.marker;
    gameOverMessage();
    currentPlayer = (currentPlayer === playerOne) ? playerTwo : playerOne;
    playerDisplay();
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
    console.log('displayController: ', winner);
    if (winner === 'Tie') {
      gameOver.style.display = 'block';
      endMessage.textContent = 'The game is a draw!';
    } else if (winner === 'currentPlayer') {
      gameOver.style.display = 'block';
      endMessage.textContent = `${currentPlayer.marker} Wins!`;
    } else {
      console.log(endMessage)
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
  }

  spaces.forEach(space => space.addEventListener('click', updateBoard));
  resetButton.addEventListener('click',reset);

  return { updateBoard, gameOverMessage, reset }
})();

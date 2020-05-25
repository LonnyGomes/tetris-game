const GRID_WIDTH = 10;

// The tetrominoes
const lTetromino = [
    [1, GRID_WIDTH + 1, GRID_WIDTH * 2 + 1, 2],
    [GRID_WIDTH, GRID_WIDTH + 1, GRID_WIDTH + 2, GRID_WIDTH * 2 + 2],
    [1, GRID_WIDTH + 1, GRID_WIDTH * 2 + 1, GRID_WIDTH * 2],
    [GRID_WIDTH, GRID_WIDTH * 2, GRID_WIDTH * 2 + 1, GRID_WIDTH * 2 + 2],
];

const zTetromino = [
    [0, GRID_WIDTH, GRID_WIDTH + 1, GRID_WIDTH * 2 + 1],
    [GRID_WIDTH + 1, GRID_WIDTH + 2, GRID_WIDTH * 2, GRID_WIDTH * 2 + 1],
    [0, GRID_WIDTH, GRID_WIDTH + 1, GRID_WIDTH * 2 + 1],
    [GRID_WIDTH + 1, GRID_WIDTH + 2, GRID_WIDTH * 2, GRID_WIDTH * 2 + 1],
];

const tTetromino = [
    [1, GRID_WIDTH, GRID_WIDTH + 1, GRID_WIDTH + 2],
    [1, GRID_WIDTH + 1, GRID_WIDTH + 2, GRID_WIDTH * 2 + 1],
    [GRID_WIDTH, GRID_WIDTH + 1, GRID_WIDTH + 2, GRID_WIDTH * 2 + 1],
    [1, GRID_WIDTH, GRID_WIDTH + 1, GRID_WIDTH * 2 + 1],
];

const oTetromino = [
    [0, 1, GRID_WIDTH, GRID_WIDTH + 1],
    [0, 1, GRID_WIDTH, GRID_WIDTH + 1],
    [0, 1, GRID_WIDTH, GRID_WIDTH + 1],
    [0, 1, GRID_WIDTH, GRID_WIDTH + 1],
];

const iTetromino = [
    [1, GRID_WIDTH + 1, GRID_WIDTH * 2 + 1, GRID_WIDTH * 3 + 1],
    [GRID_WIDTH, GRID_WIDTH + 1, GRID_WIDTH + 2, GRID_WIDTH + 3],
    [1, GRID_WIDTH + 1, GRID_WIDTH * 2 + 1, GRID_WIDTH * 3 + 1],
    [GRID_WIDTH, GRID_WIDTH + 1, GRID_WIDTH + 2, GRID_WIDTH + 3],
];
const tetrominoState = {
    currentPosition: 4,
    currentRotation: 0,
    current: [],
    squares: [],
};

const init = () => {
    tetrominoState.squares = Array.from(document.querySelectorAll('.grid div'));
    const genRandShape = (tetrominoes, state) => {
        const { currentRotation } = state;

        const random = Math.floor(Math.random() * tetrominoes[0].length);

        // update state information
        tetrominoState.currentPosition = 4;
        tetrominoState.current = tetrominoes[random][currentRotation];
    };
    const drawLogic = (state, isUndraw = false) => {
        const { current, currentPosition, squares } = state;

        current.forEach((index) => {
            const curSquare = squares[currentPosition + index];

            if (isUndraw) {
                curSquare.classList.remove('tetromino');
            } else {
                curSquare.classList.add('tetromino');
            }
        });
    };
    const isTaken = (state, offset = 0) => {
        const { current, currentPosition, squares } = state;

        return current.some((index) =>
            squares[currentPosition + index + offset].classList.contains(
                'taken'
            )
        )
            ? true
            : false;
    };
    const draw = (state) => drawLogic(state);
    const undraw = (state) => drawLogic(state, true);
    const freeze = (state) => {
        const { current, currentPosition, squares } = state;
        // if the text row has any taken elements freeze movement
        if (isTaken(state, GRID_WIDTH)) {
            current.forEach((subIndex) =>
                squares[currentPosition + subIndex].classList.add('taken')
            );
            genRandShape(theTetrominoes, state);
        }
    };
    const updatePosition = (state, offset) => {
        state.currentPosition += offset;
    };
    const keyUpHandler = (e) => {
        switch (e.keyCode) {
            case 37:
                moveLeft();
                break;
            case 38:
                //rotate
                break;
            case 39:
                moveRight();
                break;
            case 40:
                moveDown();
                break;
        }
    };
    const moveDown = () => {
        undraw(tetrominoState);
        updatePosition(tetrominoState, GRID_WIDTH);
        draw(tetrominoState);
        freeze(tetrominoState);
    };
    const moveLeft = () => {
        undraw(tetrominoState);
        const isAtLeftEdge = tetrominoState.current.some(
            (index) =>
                (tetrominoState.currentPosition + index) % GRID_WIDTH === 0
        );

        if (!isAtLeftEdge) {
            updatePosition(tetrominoState, -1);
        }

        // check if there are any taken squares in the new location
        if (isTaken(tetrominoState)) {
            // if so, undo our move
            updatePosition(tetrominoState, 1);
        }

        // re-drawn now that position has been computed
        draw(tetrominoState);
    };
    const moveRight = () => {
        undraw(tetrominoState);
        const isAtRightEdge = tetrominoState.current.some(
            (index) =>
                (tetrominoState.currentPosition + index) % GRID_WIDTH ===
                GRID_WIDTH - 1
        );

        if (!isAtRightEdge) {
            updatePosition(tetrominoState, 1);
        }

        // check if there are any taken squares in the new location
        if (isTaken(tetrominoState)) {
            // if so, undo our move
            updatePosition(tetrominoState, -1);
        }

        // re-drawn now that position has been computed
        draw(tetrominoState);
    };

    // listen for keyboard events
    document.addEventListener('keyup', keyUpHandler);

    // start interval that refreshes the screen
    const timerId = setInterval(moveDown, 1000);

    const theTetrominoes = [
        lTetromino,
        zTetromino,
        tTetromino,
        oTetromino,
        iTetromino,
    ];

    genRandShape(theTetrominoes, tetrominoState);
    draw(tetrominoState);
};

init();

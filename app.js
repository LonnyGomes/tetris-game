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
    currentShapeIdx: 0,
    tetrominoes: [],
    current: [],
    squares: [],
};

const genRandShape = (state) => {
    const { tetrominoes } = state;

    const randomShapeIdx = Math.floor(Math.random() * tetrominoes[0].length);

    // update state information
    state.currentShapeIdx = randomShapeIdx;
    state.currentPosition = 4;
    state.currentRotation = 0;
    state.current = tetrominoes[randomShapeIdx][0];
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
        squares[currentPosition + index + offset].classList.contains('taken')
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
        genRandShape(state);
    }
};

const updatePosition = (state, offset) => {
    state.currentPosition += offset;
};

const updateRotation = (state, isForward = true) => {
    const { currentRotation, currentShapeIdx, tetrominoes } = state;
    const curShape = tetrominoes[currentShapeIdx];
    let newRotation = isForward ? currentRotation + 1 : currentRotation - 1;

    // loop index if the rotation exceeds the bounds
    if (newRotation < 0) {
        newRotation = curShape.length;
    } else if (newRotation >= curShape.length) {
        newRotation = 0;
    }

    // update the state with the new rotations and shape
    state.currentRotation = newRotation;
    state.current = tetrominoes[currentShapeIdx][newRotation];
};

const moveDown = (state) => {
    undraw(state);
    updatePosition(state, GRID_WIDTH);
    draw(state);
    freeze(state);
};

const moveLeft = (state) => {
    const { current, currentPosition } = state;
    undraw(state);
    const isAtLeftEdge = current.some(
        (index) => (currentPosition + index) % GRID_WIDTH === 0
    );

    if (!isAtLeftEdge) {
        updatePosition(state, -1);
    }

    // check if there are any taken squares in the new location
    if (isTaken(state)) {
        // if so, undo our move
        updatePosition(state, 1);
    }

    // re-drawn now that position has been computed
    draw(state);
};

const moveRight = (state) => {
    undraw(state);
    const isAtRightEdge = state.current.some(
        (index) =>
            (state.currentPosition + index) % GRID_WIDTH === GRID_WIDTH - 1
    );

    if (!isAtRightEdge) {
        updatePosition(state, 1);
    }

    // check if there are any taken squares in the new location
    if (isTaken(state)) {
        // if so, undo our move
        updatePosition(state, -1);
    }

    // re-drawn now that position has been computed
    draw(state);
};

const rotate = (state) => {
    undraw(state);

    updateRotation(state);

    if (isTaken(state)) {
        updateRotation(state, false);
    }

    draw(state);
};

const init = (state) => {
    const keyUpHandler = (e) => {
        switch (e.keyCode) {
            case 37:
                moveLeft(state);
                break;
            case 38:
                rotate(state);
                break;
            case 39:
                moveRight(state);
                break;
            case 40:
                moveDown(state);
                break;
        }
    };

    // listen for keyboard events
    document.addEventListener('keyup', keyUpHandler);

    // start interval that refreshes the screen
    const moveDownIntervalFunc = moveDown.bind(this, state);
    const timerId = setInterval(moveDownIntervalFunc, 1000);

    const theTetrominoes = [
        lTetromino,
        zTetromino,
        tTetromino,
        oTetromino,
        iTetromino,
    ];

    state.squares = Array.from(document.querySelectorAll('.grid div'));
    state.tetrominoes = theTetrominoes;

    genRandShape(state);
    draw(state);
};

init(tetrominoState);

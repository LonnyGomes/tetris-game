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
};

const init = () => {
    let squares = Array.from(document.querySelectorAll('.grid div'));
    const genRandShape = (tetrominoes, state) => {
        const { currentRotation } = state;

        const random = Math.floor(Math.random() * tetrominoes[0].length);

        // update state information
        tetrominoState.currentPosition = 4;
        tetrominoState.current = tetrominoes[random][currentRotation];
    };
    const drawLogic = (state, isUndraw = false) => {
        const { current, currentPosition } = state;

        current.forEach((index) => {
            const curSquare = squares[currentPosition + index];

            if (isUndraw) {
                curSquare.classList.remove('tetromino');
            } else {
                curSquare.classList.add('tetromino');
            }
        });
    };
    const draw = (state) => drawLogic(state);
    const undraw = (state) => drawLogic(state, true);
    const freeze = (state) => {
        const { current, currentPosition } = state;
        // if the text row has any taken elements freeze movement
        if (
            current.some((index) =>
                squares[
                    currentPosition + index + GRID_WIDTH
                ].classList.contains('taken')
            )
        ) {
            current.forEach((subIndex) =>
                squares[currentPosition + index].classList.add('taken')
            );
        }
    };
    const updatePosition = (state, offset) => {
        state.currentPosition += offset;
    };
    const moveDown = () => {
        undraw(tetrominoState);
        updatePosition(tetrominoState, GRID_WIDTH);
        draw(tetrominoState);
        freeze(tetrominoState);
    };

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

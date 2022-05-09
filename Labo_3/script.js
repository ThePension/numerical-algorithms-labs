/**
 * @author Nicolas Aubert, Lucas Gosteli, Vincent Jeannin, Théo Vuilliomenet
 * @brief HE-Arc 2022 Mathématiques spécifiques 2 (algorithmes numériques) Labo 3
 */

'use strict'

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *\
|*                              GLOBALS                              *|
\* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

var equationSystem;

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *\
|*                             UTILITIES                             *|
\* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

/**
 * @brief Gets an HTML element by its ID
 * @param {String} id The id
 * @returns {HTMLElement} The element
 */
function $(id) {
    return document.getElementById(id);
}

/**
 * @brief Main function, when the button is clicked
 */
async function readFile(event) {
    const jsonFile = event.target.files.item(0);

    if (jsonFile) {
        const strText = await jsonFile.text();

        const jsonObj = JSON.parse(strText);

        const size = jsonObj.n[0];
        const matrixA = jsonObj.A;
        const matrixB = jsonObj.B;

        const labelInfo = $('info');
        const result = $('result');

        if (!size || !matrixA || !matrixB) {
            return labelInfo.innerText = 'Error while parsing';
        }

        labelInfo.innerText = 'System loaded';
        result.innerHTML = null;

        equationSystem = new GaussSystem(size, matrixA, matrixB);
    }
}

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *\
|*                           MAIN PROGRAM                            *|
\* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

/**
 * @brief Display the equation system
 */
function displayButton() {
    const label = $('display');
    const result = $('result');

    if (!equationSystem) {
        return window.alert('System not loaded, reload the file');
    }

    label.innerHTML = equationSystem.display();
    result.innerHTML = null;
}

/**
 * @brief Resolve the equation system
 */
function resolveButton() {
    const label = $('display');
    const result = $('result');

    if (!equationSystem) {
        return window.alert('System not loaded, please reload the file');
    }

    equationSystem.resolve();

    const solutions = equationSystem.solutions;

    if (solutions.length === 0) {
        label.innerText = 'This equation has no solutions.';
        result.innerHTML = null;
    } else {
        label.innerText = `This equation has ${solutions.length} solution(s)\nTime elapsed : ${equationSystem.elapsedTime} ms`;

        let nbX = 1;

        let table = '<table><tr><th>X</th><th>Value</th></tr>';

        solutions.forEach(res => {
            table += `<tr><td>x<sub>${nbX++}</sub></td><td>${res}</td></tr>`;
        });

        table += '</table>';

        result.innerHTML = table;
    }
}

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *\
|*                           GAUSS SYSTEM                            *|
\* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

/**
 * @brief Represents the system and the Gauss algorithm
 */
class GaussSystem {

    /* * * * * * * * * * * * * * * * * * *\
    |*            ATTRIBUTES             *|
    \* * * * * * * * * * * * * * * * * * */

    #initialSystem;

    #matrix;
    #solutions;

    #nbColumns;
    #nbRows;

    #ran;
    #solved;

    #elapsedTime;

    /* * * * * * * * * * * * * * * * * * *\
    |*            CONSTRUCTOR            *|
    \* * * * * * * * * * * * * * * * * * */

    /**
     * @brief Constructor of the system
     * @param {Number} size The system' size
     * @param {Array<Number>} matrixA The matrix A
     * @param {Array<Number>} matrixB The matrix B
     */
    constructor(size, matrixA, matrixB) {
        this.#matrix = [];
        this.#solutions = [];

        this.#nbRows = size;
        this.#nbColumns = size + 1;

        this.#ran = false;
        this.#solved = false;

        this.#elapsedTime = null;

        for (let row = 0; row < size; row++) {
            this.#matrix.push(new Array());

            for (let col = 0; col < size; col++) {
                this.#matrix[row].push(matrixA[row * size + col]);
            }

            this.#matrix[row][size] = matrixB[row];
        }

        /* Deep copy of array */
        this.#initialSystem = [...this.#matrix.map(row => [...row])];
    }

    /* * * * * * * * * *\
    |*       GET       *|
    \* * * * * * * * * */

    /**
     * @brief Gets the system's determinant
     * @info Works only when the matrix is triangular, after Gauss algorithm
     * @returns {Number | null} The determinant
     */
    get determinant() {
        if (!this.#ran) return null;

        let det = 1;

        for (let row = 0, col = 0; row < this.#nbRows; row++, col++) {
            det *= this.#matrix[row][col];
        }

        return det;
    }

    /**
     * @brief Gets the elapsed time for resolution
     * @returns {Number | null} The time in milliseconds
     */
    get elapsedTime() {
        return this.#elapsedTime;
    }

    /**
     * @brief Gets the system' solutions
     * @returns {Array<Number> | null} The solutions
     */
    get solutions() {
        if (!this.#solved) return;

        return this.#solutions;
    }

    /* * * * * * * * * * * * * * * * * * *\
    |*          PRIVATE METHODS          *|
    \* * * * * * * * * * * * * * * * * * */

    /**
     * @brief Gets the indice of max element in the array
     * @param {Number} start The starting row
     * @param {Number} colPivot The pivot column
     * @returns {Number} The indice
     */
    #argMax(start, colPivot) {
        let iMax = 0;
        let maxValue = 0;

        for (let i = start; i < this.#nbRows; i++) {
            if (Math.abs(this.#matrix[i][colPivot]) > maxValue) {
                maxValue = Math.abs(this.#matrix[i][colPivot]);
                iMax = i;
            }
        }

        return iMax;
    }

    /**
     * @brief Runs the algorithm of Gauss
     * @ref https://en.wikipedia.org/wiki/Gaussian_elimination
     */
    #runGaussEliminationAlgorithm() {
        if (this.#ran) return window.alert('Algorithm already ran');

        let rowPivot = 0;
        let colPivot = 0;

        while (rowPivot < this.#nbRows && colPivot < this.#nbColumns - 1) {
            const iMax = this.#argMax(rowPivot, colPivot);

            if (this.#matrix[iMax][colPivot] === 0) {
                /* No pivot in this column, go to next */
                colPivot++;
            } else {
                this.#swapRows(rowPivot, iMax);

                /* For all rows below pivot */
                for (let i = rowPivot + 1; i < this.#nbRows; i++) {
                    const factor = this.#matrix[i][colPivot] / this.#matrix[rowPivot][colPivot];

                    /* Fill with zero */
                    this.#matrix[i][colPivot] = 0;

                    /* For all remaining elements in current row */
                    for (let j = colPivot + 1; j < this.#nbColumns; j++) {
                        this.#matrix[i][j] -= this.#matrix[rowPivot][j] * factor;
                    }
                }

                /* Increase pivots */
                rowPivot++;
                colPivot++;
            }
        }

        this.#ran = true;
    }

    /**
     * @brief Solves the system and adds the solutions to the array
     */
    #solve() {
        if (!this.#ran) return window.alert('There was a problem while executing the Gauss elimination Algorithm');
        if (this.#solved) return;

        this.#solutions = [];

        /* If determinant is null, the system hasn't any solution */
        if (this.determinant === 0) return;

        let row = this.#nbRows - 1;
        let col = this.#nbColumns - 2;

        /* The matrix is triangular, start from the bottom */
        for (row, col; row >= 0 && col >= 0; row--, col--) {
            const val = this.#matrix[row][this.#nbColumns - 1] / this.#matrix[row][col];

            for (let k = row - 1; k >= 0; k--) {
                this.#matrix[k][this.#nbColumns - 1] -= this.#matrix[k][col] * val;
            }
        }

        row = 0;
        col = 0;

        /* Extract the solutions */
        for (row, col; row < this.#nbRows && col < this.#nbColumns; row++, col++) {
            if (this.#matrix[row][col] != 1) {
                this.#matrix[row][this.#nbColumns - 1] /= this.#matrix[row][col];
            }

            this.#solutions.push(this.#matrix[row][this.#nbColumns - 1]);
        }
    }

    /**
     * @brief Swap rows i and j
     * @param {Number} i Row i
     * @param {Number} j Row j
     */
    #swapRows(i, j) {
        const copy = this.#matrix[i];
        this.#matrix[i] = this.#matrix[j];
        this.#matrix[j] = copy;
    }

    /* * * * * * * * * * * * * * * * * * *\
    |*          PUBLIC METHODS           *|
    \* * * * * * * * * * * * * * * * * * */

    /**
     * @brief Displays the system
     * @returns {String} The system as string
     */
    display() {
        let list = '<ul>';

        for (let row = 0; row < this.#nbRows; row++) {
            list += '<li>';

            for (let col = 0; col < this.#nbColumns - 1; col++) {
                const value = (this.#matrix[row][col]).toFixed(2);

                list += `${(value < 0 ? "" : "+") + value}x<sub>${col + 1}</sub> `;
            }

            list += ` = ${(this.#matrix[row][this.#nbColumns - 1]).toFixed(2)}</li>`;
        }

        list += '</ul>';

        return list;
    }

    /**
     * @brief Runs the resolution
     */
    resolve() {
        if (this.#solved) return window.alert('The system has already been solved\nHere\'s the previous result');

        const startTime = new Date();

        this.#runGaussEliminationAlgorithm();
        this.#solve();

        const endTime = new Date();

        this.#elapsedTime = endTime.getTime() - startTime.getTime();
        this.#solved = true;
    }
}
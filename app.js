document.addEventListener('DOMContentLoaded', () => {
    const gridDisplay = document.querySelector('.grid')
    const scoreDisplay = document.querySelector('#score')
    let bestScoreDisplay
    let resultDisplay
    const width = 4
    let squares = []
    let score = 0
    let bestScore = localStorage.getItem("bestScore") || 0

    // Add best score and result section dynamically
    const info = document.querySelector(".info")
    const bestScoreBox = document.createElement("div")
    bestScoreBox.classList.add("score-container")
    bestScoreBox.innerHTML = `<p class="score-title">Best</p><h2 id="best-score">${bestScore}</h2>`
    info.appendChild(bestScoreBox)

    resultDisplay = document.createElement("div")
    resultDisplay.setAttribute("id", "result")
    resultDisplay.style.marginTop = "15px"
    resultDisplay.style.fontSize = "22px"
    resultDisplay.style.fontWeight = "bold"
    resultDisplay.style.textAlign = "center"
    document.querySelector(".container").appendChild(resultDisplay)

    bestScoreDisplay = document.querySelector("#best-score")

    //create the playing board
    function createBoard() {
        for (let i = 0; i < width * width; i++) {
            const square = document.createElement('div')
            square.innerHTML = 0
            gridDisplay.appendChild(square)
            squares.push(square)
        }
        generate()
        generate()
    }
    createBoard()

    //generate a new number
    function generate() {
        const randomNumber = Math.floor(Math.random() * squares.length)
        if (squares[randomNumber].innerHTML == 0) {
            squares[randomNumber].innerHTML = 2
            checkForGameOver()
        } else generate()
    }

    // move right
    function moveRight() {
        for (let i = 0; i < 16; i++) {
            if (i % 4 === 0) {
                let row = [
                    parseInt(squares[i].innerHTML),
                    parseInt(squares[i + 1].innerHTML),
                    parseInt(squares[i + 2].innerHTML),
                    parseInt(squares[i + 3].innerHTML)
                ]
                let filteredRow = row.filter(num => num)
                let missing = 4 - filteredRow.length
                let zeros = Array(missing).fill(0)
                let newRow = zeros.concat(filteredRow)

                for (let j = 0; j < 4; j++) {
                    squares[i + j].innerHTML = newRow[j]
                }
            }
        }
    }

    // move left
    function moveLeft() {
        for (let i = 0; i < 16; i++) {
            if (i % 4 === 0) {
                let row = [
                    parseInt(squares[i].innerHTML),
                    parseInt(squares[i + 1].innerHTML),
                    parseInt(squares[i + 2].innerHTML),
                    parseInt(squares[i + 3].innerHTML)
                ]
                let filteredRow = row.filter(num => num)
                let missing = 4 - filteredRow.length
                let zeros = Array(missing).fill(0)
                let newRow = filteredRow.concat(zeros)

                for (let j = 0; j < 4; j++) {
                    squares[i + j].innerHTML = newRow[j]
                }
            }
        }
    }

    // move up
    function moveUp() {
        for (let i = 0; i < 4; i++) {
            let column = [
                parseInt(squares[i].innerHTML),
                parseInt(squares[i + width].innerHTML),
                parseInt(squares[i + width * 2].innerHTML),
                parseInt(squares[i + width * 3].innerHTML)
            ]
            let filteredColumn = column.filter(num => num)
            let missing = 4 - filteredColumn.length
            let zeros = Array(missing).fill(0)
            let newColumn = filteredColumn.concat(zeros)

            for (let j = 0; j < 4; j++) {
                squares[i + width * j].innerHTML = newColumn[j]
            }
        }
    }

    // move down
    function moveDown() {
        for (let i = 0; i < 4; i++) {
            let column = [
                parseInt(squares[i].innerHTML),
                parseInt(squares[i + width].innerHTML),
                parseInt(squares[i + width * 2].innerHTML),
                parseInt(squares[i + width * 3].innerHTML)
            ]
            let filteredColumn = column.filter(num => num)
            let missing = 4 - filteredColumn.length
            let zeros = Array(missing).fill(0)
            let newColumn = zeros.concat(filteredColumn)

            for (let j = 0; j < 4; j++) {
                squares[i + width * j].innerHTML = newColumn[j]
            }
        }
    }

    // combine row
    function combineRow() {
        for (let i = 0; i < 15; i++) {
            if (squares[i].innerHTML === squares[i + 1].innerHTML) {
                let combinedTotal = parseInt(squares[i].innerHTML) + parseInt(squares[i + 1].innerHTML)
                squares[i].innerHTML = combinedTotal
                squares[i + 1].innerHTML = 0
                score += combinedTotal
                scoreDisplay.innerHTML = score

                if (score > bestScore) {
                    bestScore = score
                    bestScoreDisplay.innerHTML = bestScore
                    localStorage.setItem("bestScore", bestScore)
                }
            }
        }
    }

    // combine column
    function combineColumn() {
        for (let i = 0; i < 12; i++) {
            if (squares[i].innerHTML === squares[i + width].innerHTML) {
                let combinedTotal = parseInt(squares[i].innerHTML) + parseInt(squares[i + width].innerHTML)
                squares[i].innerHTML = combinedTotal
                squares[i + width].innerHTML = 0
                score += combinedTotal
                scoreDisplay.innerHTML = score

                if (score > bestScore) {
                    bestScore = score
                    bestScoreDisplay.innerHTML = bestScore
                    localStorage.setItem("bestScore", bestScore)
                }
            }
        }
    }

    // key controls
    function control(e) {
        if (e.key === 'ArrowLeft') keyLeft()
        else if (e.key === 'ArrowRight') keyRight()
        else if (e.key === 'ArrowUp') keyUp()
        else if (e.key === 'ArrowDown') keyDown()
    }
    document.addEventListener('keydown', control)

    function keyLeft() {
        moveLeft()
        combineRow()
        moveLeft()
        generate()
    }

    function keyRight() {
        moveRight()
        combineRow()
        moveRight()
        generate()
    }

    function keyUp() {
        moveUp()
        combineColumn()
        moveUp()
        generate()
    }

    function keyDown() {
        moveDown()
        combineColumn()
        moveDown()
        generate()
    }

    // check game over
    function checkForGameOver() {
        let zeros = 0
        for (let i = 0; i < squares.length; i++) {
            if (squares[i].innerHTML == 0) {
                zeros++
            }
        }
        if (zeros === 0) {
            resultDisplay.innerHTML = 'YOU LOSE! 😢'
            document.removeEventListener('keydown', control)
        }
    }

    // add colors
    function addColors() {
        for (let i = 0; i < squares.length; i++) {
            let val = parseInt(squares[i].innerHTML)
            squares[i].style.backgroundColor =
                val === 0 ? '#afa192' :
                val === 2 ? '#eee3da' :
                val === 4 ? '#ede0c8' :
                val === 8 ? '#f2b179' :
                val === 16 ? '#ffcea4' :
                val === 32 ? '#e8c064' :
                val === 64 ? '#ffab6e' :
                val === 128 ? '#fd9982' :
                val === 256 ? '#ead79c' :
                val === 512 ? '#76daff' :
                val === 1024 ? '#beeaa5' :
                val === 2048 ? '#d7d4f0' : '#3c3a32'
        }
    }
    addColors()
    setInterval(addColors, 50)
})

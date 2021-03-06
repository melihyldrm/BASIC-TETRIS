document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid')
    let squares = Array.from(document.querySelectorAll('.grid div'))
    const scoreDisplay = document.querySelector("#score")
    const startBtn = document.querySelector("#start-button")
    const width= 10
    let nextRandom = 0
    let timerId
    let score = 0
    

    //The Tetrominos
    const lTetromino = [
        [1, width+1, width*2+1, 2],
        [width, width+1, width+2, width*2+2],
        [1, width+1, width*2+1, width*2],
        [width, width*2, width*2+1, width*2+2],
    ]

    const zTetromino = [
        [0, width, width + 1, width * 2 + 1],
        [width + 1, width + 2, width * 2, width * 2 + 1],
        [0, width, width + 1, width * 2 + 1],
        [width + 1, width + 2, width * 2, width * 2 + 1]
      ]
    
      const tTetromino = [
        [1, width, width + 1, width + 2],
        [1, width + 1, width + 2, width * 2 + 1],
        [width, width + 1, width + 2, width * 2 + 1],
        [1, width, width + 1, width * 2 + 1]
      ]
    
      const oTetromino = [
        [0, 1, width, width + 1],
        [0, 1, width, width + 1],
        [0, 1, width, width + 1],
        [0, 1, width, width + 1]
      ]
    
      const iTetromino = [
        [1, width + 1, width * 2 + 1, width * 3 + 1],
        [width, width + 1, width + 2, width + 3],
        [1, width + 1, width * 2 + 1, width * 3 + 1],
        [width, width + 1, width + 2, width + 3]
      ]

      const theTetrominoes = [lTetromino, zTetromino, tTetromino,oTetromino, iTetromino]

      let currentPosition = 4;
      let currentRotation = 0;

      //randomly select a tetromino and its first rotation
      let random = Math.floor(Math.random()*theTetrominoes.length)
      console.log(random)
      let current = theTetrominoes[random][0];
      console.log(theTetrominoes[random][0]);


      function draw(){
          current.forEach(index => {
              squares[currentPosition + index].classList.add('tetromino')
          })
      }

      function undraw() {
          current.forEach(index => {
              squares[currentPosition + index].classList.remove('tetromino')
          })
      }

      //down every second

     // timerId = setInterval(moveDown, 100)

      //assing function to keyCodes
      function control(e){
          if(e.keyCode === 37){
              moveLeft()
          }else if (e.keyCode === 38){
              rotate()
          }else if (e.keyCode === 39){
              moveRight()
          }else if(e.keyCode === 40){
              moveDown()
          }
      }

      document.addEventListener('keyup', control)

      //move down function

      function moveDown() {
          undraw()
          currentPosition += width
          draw()
          freeze()
         
      }

      //freeze function

      function freeze(){
      if (current.some(index => squares[currentPosition+index+width].classList.contains('taken'))){
          current.forEach(index => squares[currentPosition+index].classList.add('taken'))
          random = nextRandom
          nextRandom = Math.floor(Math.random()* theTetrominoes.length)
          current = theTetrominoes[random][currentRotation]
          currentPosition = 4
          draw()
          displayShape()
          addScore()
          gameOver()
      }

      }

      //move the tetromino left, unless is at the edge or there is a blocks

      function moveLeft(){
        undraw()
        const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0)

        if(!isAtLeftEdge) currentPosition -= 1

        if(current.some(index => squares[currentPosition+index].classList.contains('taken'))) {
            currentPosition += 1
        }

        draw()

      }

      //move the tetromino left, unless is at the edge or there is a blocks

      function moveRight(){
        undraw()
        const isAtRightEdge = current.some(index => (currentPosition + index) % width === width -1)

        if(!isAtRightEdge) currentPosition +=1

        if(current.some(index => squares[currentPosition+index].classList.contains('taken'))) {
            currentPosition -=1
        }

        draw()

    }

    //rotate the tetromino
    function rotate(){
        undraw()
        currentRotation ++
        if(currentRotation === current.length){ //if the current rotation gets to 4, make it go back to 0
            currentRotation = 0
        }
        current = theTetrominoes[random][currentRotation]
        draw()
    }

    //show up-next tetromino in mini-grid display

    const displaySquares = document.querySelectorAll('.mini-grid div')
    const displayWidth = 4
    let displayIndex = 0
    

    //the tetromineso without rotations
    const upNextTetrominoes = [
        [1, displayWidth+1, displayWidth*2+1, 2], //l
        [0, displayWidth, displayWidth+1, displayWidth*2+1], //z
        [1, displayWidth, displayWidth+1, displayWidth+2], //t
        [0, 1, displayWidth, displayWidth+1], //o
        [1, displayWidth+1, displayWidth*2+1, displayWidth*3+1] //i

    ]

    //display the shape in the mini grid display
    function displayShape() {
        //remove any trace of a tetromino
        displaySquares.forEach(square => {
            square.classList.remove('tetromino')
        })
        upNextTetrominoes[nextRandom].forEach( index => {
            displaySquares[displayIndex + index].classList.add('tetromino')
        })
    }

    //add functionality to the buttoon
    startBtn.addEventListener('click', () =>{
        if (timerId) {
            clearInterval(timerId)
            timerId=null
        } else {
            draw()
            timerId = setInterval(moveDown, 100)
            nextRandom=Math.floor(Math.random()*theTetrominoes.length)
        }
    })

    //add score
    function addScore(){
        for (let i=0; i<199; i += width){
            const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9]

            if (row.every(index => squares[index].classList.contains('taken'))){
                score += 10
                scoreDisplay.innerHTML = score
                row.forEach(index => {
                    squares[index].classList.remove('taken')
                    squares[index].classList.remove('tetromino')
                })
                const squaresRemoved = squares.splice(i, width)
                squares = squaresRemoved.concat(squares)
                squares.forEach(cell => grid.appendChild(cell))
            }
        }
    }

        //game over func

    function gameOver(){
        if(current.some(index => squares[currentPosition+index].classList.contains('taken'))){
            scoreDisplay.innerHTML = "end"
            clearInterval(timerId)
        }

    }


})


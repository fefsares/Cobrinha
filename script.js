const canvas = document.querySelector("canvas")
const ctx = canvas.getContext('2d')

const score = document.querySelector(".score--value")
const menu = document.querySelector(".menu-screen")
const button = document.querySelector(".btn-play")

const size = 30

let direction = ""
let loopId 

let snake = [
    {x: 0, y: 0}, //index = 0
    {x: 30, y: 0}, //index = 1
    {x: 60, y: 0}, //index = 2
]
const randomNumber = (min, max) =>{
    return Math.round(Math.random() * (max - min) + min) //máximo 600, minímo 30, buscando números aleatórios para a posição da comida
}
const randomPosition = () => {
    const number = randomNumber(0, canvas.width - size)
    return Math.round(number/30) * 30
}
const food = {
    x: randomPosition(0, 570),
    y: randomPosition(0, 570),
    color: "yellow"
}
const drawFood = () =>{

    const {x, y, color} = food

    ctx.shadowColor = color
    ctx.shadowBlur = 6
    ctx.fillStyle = color
    ctx.fillRect (x, y, size, size)
    ctx.shadowBlur = 0
}
const drawSnake = () => {
    ctx.fillStyle = "#ddd"
    
    snake.forEach((position, index) => { //chama os elementos (positions) e os index

        if (index == snake.length - 1){
            ctx.fillStyle = 'blue' //se o index for o tamanho do array -1, todos a partir do elemento final -1 serão azuis
        }

        ctx.fillRect(position.x, position.y, size, size) //gera novos quadrados de acordo com os elementos do array
    })
}
const checkColision = () =>{
    const head = snake[snake.length - 1]

    const neckIndex = snake.length - 2

    const canvasLimit = canvas.width - size

    const wallColision = head.x <0 || head.x > canvasLimit || head.y < 0 || head.y > canvasLimit

    const selfColision = snake.find((position, index)=> {
        return index < neckIndex && position.x == head.x && position.y == head.y
    }) 

    if(wallColision || selfColision){
        gameOver()
    }
}
const incrementScore = () =>{
    //score.innerText  = parseInt(score.innerText) + 1
    score.innerText  = +score.innerText + 1
}
const gameOver = () => {
    direction = undefined

    menu.style.display = "flex"
    canvas.style.filter = 'blur(2px)'
}
const moveSnake = () => {
    if (!direction) return //se não tiver nada, ele ignora a função 

    snake.shift() //remove o primeiro elemento do array

    const head = snake[snake.length - 1]

    if (direction == "right") {
        snake.push({x: head.x + size, y: head.y})
    }
    if (direction == "left") {
        snake.push({x: head.x - size, y: head.y})
    }
    if (direction == "down") {
        snake.push({x: head.x, y: head.y + size,})
    }
    if (direction == "up") {
        snake.push({x: head.x, y: head.y - size,})
    }
}
const drawGrid = () =>{
    ctx.lineWidth = 1 //definir a largura da grid
    ctx.strokeStyle = 'white' //cor das linhas da grid

    for(let i = 30; i < canvas.width; i+= 30){

        ctx.beginPath() //para sempre começar do inicio
        ctx.lineTo(i, 0) //nossa linha começa com X e Y posição
        ctx.lineTo(i, 600) //até aqui
        ctx.stroke() //desenha a linha

        ctx.beginPath() //para sempre começar do inicio
        ctx.lineTo(0, i) //nossa linha começa com X e Y posição
        ctx.lineTo(600, i) //até aqui
        ctx.stroke() //desenha a linha
    }
}
const checkIt = () =>{
    const head = snake[snake.length - 1]

    if (head.x == food.x && head.y == food.y){
        snake.push(head) //adicionar um novo elemento ao array da cobrinha
        
        let x = randomPosition()
        let y = randomPosition()

        while(snake.find((position)=>position.x == x && position.y == y)){
            x = randomPosition()
            y = randomPosition()
        }

        food.x = x
        food.y = y
        incrementScore()
    }
}
const gameLoop = () =>{
    clearInterval(loopId)
    ctx.clearRect(0, 0, 600, 600) //limpa o canva, e gera novos quadrados com drawSnake() 

    moveSnake()
    drawSnake()
    drawGrid()
    drawFood()
    checkIt()
    checkColision()

    loopId = setTimeout(() =>{
        gameLoop()
    },70)
}

gameLoop()

document.addEventListener("keydown", ({key}) =>{

    key = key.toLowerCase();

    if (direction != undefined){
        if (key == "d" && direction != "left"){
            direction = "right"
        }
        if (key == "a" && direction != "right"){
            direction = "left"
        }
        if (key == "w" && direction != "down"){
            direction = "up"
        }
        if (key == "s" && direction != "up"){
            direction = "down"
        }
    }
})
button.addEventListener("click", () => {
    score.innerText = "00"
    menu.style.display = "none"
    canvas.style.filter = "none"
    direction = ''
    food.x = randomPosition (0, 570)
    food.y = randomPosition (0, 570)

    snake = [
        {x: 0, y: 0}, //index = 0
        {x: 30, y: 0}, //index = 1
        {x: 60, y: 0}, //index = 2
    ]
})


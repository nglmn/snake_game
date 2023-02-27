const canvas = document.querySelector('#game');
const ctx = canvas.getContext('2d');

const bg = new Image();
bg.src = 'img/bg.png';

const foodImg = new Image();
foodImg.src = 'img/carrot.png'; // 32*32 px

let box = 32; //размер поля
let score = 0; // очки начинаются с 0
let food = {
    x: Math.floor((Math.random() * 17 + 1)) * box, //рандомно появляется еда в пределах 17 ячеек, но начинается с 1 квадратика, умножаем на бокс, что бы еда появлялась в пределах нашей коробки, мас флур округляет значения к целым числам ( по бокам мы пропускаем по 1му квадратику)
    y: Math.floor((Math.random() * 15 + 3)) * box, //(по высоте - 3 квадратика)
};
let snake = [];
snake[0] = {
    x: 9 * box,
    y: 10 * box,
}; // змейка как объект, и первый ее объект [0] всегда появляется в центре на 9 и 10 кубиках 

document.addEventListener('keydown',direction); //перебираем клавиши на клавиатуре
let dir;

function direction(event){
    if(event.keyCode == 37 && dir != 'right')// 37 - код стрелочки влево (если мы нажимаем стрелку в одну сторону, то мы не можем резко развернуть ее в обратную, для этого используется команда && )
        dir = 'left';
    else if( event.keyCode == 38 && dir != 'down')
        dir = 'up';
    else if( event.keyCode == 39 && dir != 'left')
        dir = 'right';
    else if( event.keyCode == 40 && dir != 'up')
        dir = 'down';
}

function eatTail(head, arr){
    for( let i = 0; i < arr.length; i++){
        if(head.x == arr[i].x && head.y == arr[i].y)
        clearInterval(game);
    }
}

function drawGame(){
    ctx.drawImage(bg, 0, 0); //рисуем бг с нулевых координатов
    ctx.drawImage(foodImg, food.x, food.y);//рисуем морковку в любом месте поля

    for(let i = 0; i < snake.length; i++){
        ctx.fillStyle = i == 0 ? 'green' : 'yellow' ;
        ctx.fillRect(snake[i].x, snake[i].y, box, box);//прямоугольник с начальными координатами 
    }
    ctx.fillStyle ='white';
    ctx.font = '40px Roboto';
    ctx.fillText(score, box * 2.3, box * 1.6);

    //рисуем перемещение змейки 
    let snakeX = snake[0].x; //создаем значения которые будут хранить координаты змейки 
    let snakeY = snake[0].y;

    if(snakeX == food.x && snakeY == food.y){ // когда кушаем еду, добавляется 1 очко и еда появляется в новом месте 
        score++;
        food = {
            x: Math.floor((Math.random() * 17 + 1)) * box, 
            y: Math.floor((Math.random() * 15 + 3)) * box, 
        }; 
    } else 
        snake.pop(); // удаляет последний элемент в массиве  

    if(snakeX < box || snakeX > box * 17 || snakeY < 3 * box || snakeY > box * 17){
        ctx.fillStyle = 'red' ;
        clearInterval(game);
    }
        

    if(dir == 'left') snakeX -= box; // перемещается змейка на одно значение влево отностиельно коробки 
    if(dir == 'right') snakeX += box;
    if(dir == 'up') snakeY -= box;
    if(dir == 'down') snakeY += box;

    let newHead ={   // новая голова змейки заменяется на предыдущую, когда она есть 
        x: snakeX,
        y: snakeY
    };

    eatTail(newHead, snake);
    snake.unshift(newHead); 
}

let game = setInterval(drawGame, 100);//каждые 100мл сек обновляется картинка, так нужно что бы ее показывать на экране 
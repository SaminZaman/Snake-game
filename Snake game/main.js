//Play the Snake Game

//Global Variables
let score = 0;
let highscore = 0;
let box = 20;
let snake = []
    snake[0] = {x: 9 * box, y: 10* box};
    snake[1] = {x: 8 * box, y: 10* box};
let food = {
    x: Math.floor(Math.random() * 45) * box,
    y: Math.floor(Math.random() * 24) * box};
let poison = {
    x: Math.floor(Math.random() * 45) * box,
    y: Math.floor(Math.random() * 24) * box};
let whichWay;
let game;
let startover = false;
let scoreMultiplier;
let inplay = false;
let maybeposion = false;
let eatsound = new Audio();
    eatsound.src = "media/sound.mp3";
let deathsound = new Audio();
    deathsound.src = "media/death.mp3";
let poisonsound = new Audio();
    poisonsound.src = "media/poison.mp3";
    poisonsound.volume = 0.7;
let foodPic = new Image;
    foodPic.src = "media/apple.jpeg";
let poisonPic = new Image;
    poisonPic.src = "media/poison.jpg";
let letMove;


//Event Listeners
document.addEventListener("keydown", direction);
document.getElementById("easy").addEventListener("click", easymode);
document.getElementById("medium").addEventListener("click", mediummode);
document.getElementById("hard").addEventListener("click", hardmode);
document.getElementById("insane").addEventListener("click", insanemode);

//Setup canvas and the graphics context
let cnv = document.getElementById("canvas");
let ctx = cnv.getContext("2d");
cnv.width = 900;
cnv.height = 500;

//Event Functions
function easymode() {
    if (inplay == false) {
        inplay = true;
        whichWay='RIGHT';
        scoreMultiplier = 1;
        clearInterval(game);
        game = setInterval(gamePlay, 300);
        
        setInterval(keepScore, 1);
        score = 0;
        startover = false;
        //Make this button stand out
        document.getElementById("easy").classList.add("active");

        //Make other buttons fade a bit
        document.getElementById("medium").classList.add("inactive");
        document.getElementById("hard").classList.add("inactive");
        document.getElementById("insane").classList.add("inactive");

        //Remove buttons hover property
        document.getElementById("insane").classList.remove("normal");
        document.getElementById("medium").classList.remove("normal");
        document.getElementById("hard").classList.remove("normal");
        document.getElementById("easy").classList.remove("normal");
        
        //no poison
        maybeposion = false;
    }    
}
function mediummode() {
    if (inplay == false) {
        inplay = true;
        whichWay='RIGHT';
        scoreMultiplier = 2;
        clearInterval(game);
        score = 0;
        game = setInterval(gamePlay, 150);
        setInterval(keepScore, 1);
        startover = false;
        //Make this button stand out
        document.getElementById("medium").classList.add("active");

        //Make other buttons fade a bit
        document.getElementById("easy").classList.add("inactive");
        document.getElementById("hard").classList.add("inactive");
        document.getElementById("insane").classList.add("inactive");
        
        //Remove buttons hover property
        document.getElementById("insane").classList.remove("normal");
        document.getElementById("medium").classList.remove("normal");
        document.getElementById("hard").classList.remove("normal");
        document.getElementById("easy").classList.remove("normal");

        //no poison
        maybeposion = false;
    }
}
function hardmode() {
    if (inplay == false) {
        inplay = true;
        whichWay='RIGHT';
        scoreMultiplier = 3;
        clearInterval(game);
        score = 0;
        game = setInterval(gamePlay, 75);
        setInterval(keepScore, 1);
        startover = false;
        //Make this button stand out
        document.getElementById("hard").classList.add("active");

        //Make other buttons fade a bit
        document.getElementById("medium").classList.add("inactive");
        document.getElementById("easy").classList.add("inactive");
        document.getElementById("insane").classList.add("inactive");
        
        //Remove buttons hover property
        document.getElementById("insane").classList.remove("normal");
        document.getElementById("medium").classList.remove("normal");
        document.getElementById("hard").classList.remove("normal");
        document.getElementById("easy").classList.remove("normal");

        //yes poison
        maybeposion = true;
    }
}
function insanemode() {
    if (inplay == false) {
        inplay = true;
        whichWay='RIGHT';
        scoreMultiplier = 10;
        clearInterval(game);
        score = 0;
        game = setInterval(gamePlay, 20);
        setInterval(keepScore, 1);
        startover = false;
        //Make Button stand out
        document.getElementById("insane").classList.add("active");

        //Make other buttons fade a bit
        document.getElementById("medium").classList.add("inactive");
        document.getElementById("hard").classList.add("inactive");
        document.getElementById("easy").classList.add("inactive");
        
        //Remove buttons hover property
        document.getElementById("insane").classList.remove("normal");
        document.getElementById("medium").classList.remove("normal");
        document.getElementById("hard").classList.remove("normal");
        document.getElementById("easy").classList.remove("normal");
    
        //yes poison
        maybeposion = true;
    }
}


function keepScore () {
    document.getElementById("score").innerHTML = score;
    if (score < 0) {
        score = 0;
    }
    if (score >= highscore) {
        highscore = score;
        document.getElementById("highscore").innerHTML = highscore;
    }
}


function direction(event) { //Controls
    if ((event.keyCode == 37 || event.keyCode == 65) && whichWay != "RIGHT" && letMove) {
        whichWay = "LEFT";
        letMove = false;
    }
    else if ((event.keyCode == 38 || event.keyCode == 87) && whichWay != "DOWN" && letMove) {
        whichWay = "UP";
        letMove = false;
    }
    else if ((event.keyCode == 39 || event.keyCode == 68) && whichWay != "LEFT" && letMove) {
        whichWay = "RIGHT";
        letMove = false;
    }
    else if ((event.keyCode == 40 || event.keyCode == 83) && whichWay != "UP" && letMove) {
        whichWay = "DOWN";
        letMove = false;
    }
}


function setup () { //setup the game
    //Draw background
    ctx.fillStyle= "white";
    ctx.fillRect(0, 0, cnv.width, cnv.height);

    //Snake
    for (let i = 0; i < snake.length; i++){
        ctx.fillStyle = "green";
        ctx.fillRect(snake[i].x,snake[i].y,box,box);
        ctx.strokeStyle= "black";
        ctx.strokeRect(snake[i].x,snake[i].y, box, box);
    }

    //Food
    ctx.drawImage(foodPic, food.x,food.y);


    //Poison
    if (maybeposion) {    
        ctx.drawImage(poisonPic, poison.x, poison.y);
    }
}


function gamePlay() { //playing the game
    
    //Set how often they can move
    letMove = true;

    if (startover == false){


        //Previous Head Position
        let snakeX = snake[0].x;
        let snakeY = snake[0].y;

        //Which direction
        if (whichWay =="LEFT") {snakeX -= box;}
        if (whichWay == "RIGHT") {snakeX += box;}
        if (whichWay == "UP") {snakeY -= box;}
        if (whichWay == "DOWN") {snakeY += box;}

        //add new head
        let newHead = {
            x:snakeX,
            y:snakeY
        }
        snake.unshift(newHead); 

        


        //When they get the food, just add a new head, don't remove the tail
        if (snakeX == food.x && snakeY == food.y){
            score += scoreMultiplier;
            let safeToDropFood = false;
            eatsound.play();
            let tryFoodX = Math.floor(Math.random() * 45) * box;
            let tryFoodY = Math.floor(Math.random() * 25) * box;
            for (let i = 0; i < snake.length; i++) {
                if (snake[i].x == tryFoodX && snake[i].y == tryFoodY){
                    safeToDropFood = false;
                    break;
                } else {
                    safeToDropFood = true;
                }
            }
            if (safeToDropFood){
                food = {
                    x: tryFoodX ,
                    y: tryFoodY
                };
                safeToDropFood = false;
            }
        }

            else {
                    snake.pop();
            }

        if (snakeX <= 0 || snakeY <= 0) {
        console.log("1 - snakeX is " + snakeX);
        console.log("1 - snakeY is " + snakeY);
        }

        //If the snake eats poison
        if (maybeposion) {
            if (snakeX == poison.x && snakeY == poison.y){
                score -= scoreMultiplier;
                
                poisonsound.play();

                poison = {
                    x: Math.floor(Math.random() * 45) * box,
                    y: Math.floor(Math.random() * 25) * box
                };
                snake.pop();
            
            }
        }
        
        //Draw everything
        setup();
        
        // The game ends
        if (snakeX < 0 || snakeX >= cnv.width || snakeY < 0 || snakeY >= cnv.height || dead(newHead, snake)) {
            console.log("2 - snakeX is " + snakeX);
            console.log("2 - snakeY is " + snakeY);
            deathsound.play();
            
            //Draw game over screen
            ctx.fillStyle= 'rgb(29, 28, 27)';
            ctx.fillRect(0, 0, cnv.width, cnv.height);
            ctx.font = "60px Comic Sans MS";
            ctx.fillStyle = "white";
            ctx.textAlign = "center";
            ctx.fillText("GAME OVER", canvas.width/2, canvas.height/2); 
            ctx.font = "20px Comic Sans MS";
            ctx.fillText("Select a difficulty and try again!", canvas.width/2, canvas.height/2 +50); 
            
            //Redefine variables so that game can be played again
            startover = true;
            snake = []
            snake[0] = {x: 9 * box, y: 10 * box};
            snake[1] = {x: 8 * box, y: 10 * box};
            whichWay = "";
            inplay = false;

            //Remove the 'stand out' class from whatever button it is on
            document.getElementById("insane").classList.remove("active");
            document.getElementById("medium").classList.remove("active");
            document.getElementById("hard").classList.remove("active");
            document.getElementById("easy").classList.remove("active");

            //Remove the "fade out" class from rest
            document.getElementById("insane").classList.remove("inactive");
            document.getElementById("medium").classList.remove("inactive");
            document.getElementById("hard").classList.remove("inactive");
            document.getElementById("easy").classList.remove("inactive");

            //Give them back their normal classes
            document.getElementById("easy").classList.add("normal");
            document.getElementById("medium").classList.add("normal");
            document.getElementById("hard").classList.add("normal");
            document.getElementById("insane").classList.add("normal");
        }
        
    }
}


function dead (head, array) { //if snake hits itself or poisons itself out of existence
    if (snake.length == 0) {
        return true
        }
    for (let i = 2; i < array.length; i++){
        if (head.x == array[i].x && head.y == array[i].y) {
            return true;
        }
    }
    return false;
}

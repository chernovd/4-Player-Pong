class Vector
{
    constructor(x = 0, y = 0)
    {
        this.x = x;
        this.y = y;
    }
    get len()
    {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }
    set len(value) {
        const f = value / this.len;
        this.x *= f;
        this.y *= f;
    }
}

class Rectangle
{
    constructor(x, y, width, heigth)
    {
        this.pos = new Vector(x, y);
        this.size = new Vector(width, heigth);
        
    }
    get left()
    {
        return this.pos.x - this.size.x / 2;
    }
    get right()
    {
        return this.pos.x + this.size.x / 2;
    }
    get top()
    {
        return this.pos.y - this.size.y / 2;
    }
    get bottom()
    {
        return this.pos.y + this.size.y / 2;
    }
}
class Circle 
{
    constructor(x,y,radius)
    {
        this.pos = new Vector(x, y);
        this.radius = radius;
    }
   get area()
    {
        return Math.pow(this.radius, 2) * Math.PI;
    }
}

class Ball extends Circle
{
    constructor()
    {
        super(canvasWidth / 2,canvasHeight / 2, 10);
        this.vel = new Vector;
        this.initialSpeed = 7; // the initial speed of the ball
        this.isOnFire = false; // fire ball
        this.resetB = false; // if the ball out of bounds
        this.hit = '-'; // last hit
     
    }
    update() 
    {
        this.pos.x += this.vel.x;
        this.pos.y += this.vel.y;   
    }
    reset()
    {
        //start = true;
        this.hit = '-';
        this.pos.x = canvasWidth / 2;
        this.pos.y = canvasHeight / 2;

        // random angle
        this.vel.x = (Math.random() > .5 ? 1 : -1);
        this.vel.y = (Math.random() * 2 - 1);
        this.vel.len = this.initialSpeed;
        
    }
    render(color)
    {
        fill(color);
        ellipse(this.pos.x, this.pos.y, this.radius*2);
    }
    
    // collission with blue paddle
    collideLeft(player3, player2)
    {  

        if (this.pos.x < (player3.pos.x + player3.size.x)
        && this.pos.y + this.radius > (player3.pos.y)
        && this.pos.y - this.radius < (player3.pos.y + player3.size.y))
        {
            this.vel.x += -2.2 * this.vel.x;
            this.hit = 'l';

            // check if the ball is on fire and collison with the paddle to update the score
            if(player2.ability.fireBullet)
            {
                player2.ability.fireBullet = false;
                scoreboard.score[1]++;
                this.reset();
            }
        }
    }

    // collission with orange paddle
    collideRight(player4, player2)
    {

        if (this.pos.x > (player4.pos.x - player4.size.x/2)
        && this.pos.y + this.radius > (player4.pos.y)
        && this.pos.y - this.radius < (player4.pos.y + player4.size.y))
        {
            this.vel.x += -2.2 * this.vel.x;
            this.hit = 'r';

            // check if the ball is on fire and collison with the paddle to update the score
            if(player2.ability.fireBullet)
            {
                player2.ability.fireBullet = false;
                scoreboard.score[1]++;
                this.reset();
            }
        }
        
    }

    // bounce off the shield 
    collideShield(player1)
    {
        if(player1.ability.shield)
        {
            if(this.pos.y < 5)
            {
                player1.ability.shield = false;   
                this.vel.y += -2 * this.vel.y;
            }
        }
        
    }

    // collission with green paddle
    collideUp(player1, player2)
    {
        if (this.pos.x  - this.radius < (player1.pos.x + player1.size.x/2)
            && this.pos.x + this.radius > (player1.pos.x)
            && this.pos.y < (player1.pos.y + player1.size.y/2))
        {
            this.vel.y += -2 * this.vel.y;
            this.hit = 'u';

            // check if the ball is on fire and collison with the paddle to update the score
            if(player2.ability.fireBullet)
            {
                player2.ability.fireBullet = false;
                scoreboard.score[1]++;
                this.reset();
            }
        }
    }

    // collission with yellow paddle
    collideBottom(player2)
    {
        if (this.pos.x + this.radius > (player2.pos.x)
        && this.pos.x - this.radius < (player2.pos.x + player2.size.x)
        && this.pos.y > (player2.pos.y - player2.size.y/2))
        {
            this.vel.y += -2 * this.vel.y;
            this.hit = 'd';
        }
    }

    // ball is on fire
    fireOn() 
        {
            this.render('red');
        }
}

class Player extends Rectangle
{
    constructor(x, y, width, height, color, ability) 
    {
        super(x, y, width, height);
        this.vel = new Vector;
        this.color = color;
        this.ability = ability;

        this.abilityEnabled = true;  
        this.pressed = false;
    
    }
    render()
    {
        fill(this.color);
        rectMode(TOP);
        strokeWeight(2);
        rect(this.pos.x, this.pos.y, this.size.x, this.size.y);
        fill(255);
    }
}

class Ability 
{
    constructor(name)
    {
        this.name = name;
        this.fireBullet = false;
        this.froze = false;
        this.shield = false;
        this.steal = false;

        this.counter = 3;
        
    }
    // shield ON
    shieldOn()
    {
        fill('green');
        rectMode(TOP);
        rect(0, 0, canvasWidth, 10);
        fill(255);
    }

    //freeze the paddles
    freeze(index)
    {
        fill('blue');
        rectMode(TOP);
        strokeWeight(2);
        rect(players[index].pos.x, players[index].pos.y, players[index].size.x, players[index].size.y);
        fill(255);
    }

    // draw counter for players
    drawCounter(color, index, x, y)
    {
        fill(color);
        textSize("25px Arial");
        text(players[index].ability.counter, x, y);
    }

    // check if the ability was triggered 
    abilityReady(index)
    {    
        if(players[index].ability.name == 'shield')
        {
            if(players[index].pressed)
            {
                if(players[index].abilityEnabled)
                { 
                    players[index].ability.shield = true;  
                }           
            } 
             // if the ball is out of bounds, reset ability
            if(ball.resetB)
            {
                players[index].ability.shield = false;

            }
        }
    
        if(players[index].ability.name == 'fireBall')
        { 
            if(players[index].pressed)
            { 
                if(players[index].abilityEnabled)
                {    
                    players[index].ability.fireBullet = true;
                    players[index].abilityEnabled = false; 
                }             
            }
             // if the ball is out of bounds, reset ability
             if(ball.resetB)
             {

                players[index].ability.fireBullet = false;
                 
             }
        }

        if(players[index].ability.name == 'freeze')
        { 
            if(players[index].pressed)
            {   
                if(players[index].abilityEnabled)
                {  
                    players[index].ability.froze = true;
                    players[index].abilityEnabled = false; 
                }                 
            }
             // if the ball is out of bounds, reset ability
             if(ball.resetB)
             {
                players[index].ability.froze = false;
                 
             }
        } 

        if(players[index].ability.name == 'steal')
        {   
            if(players[index].pressed)
            {            
                if(players[index].abilityEnabled)
                {  
                    players[index].ability.steal = true;
                    var random = Math.floor(Math.random() * (3));
                    scoreboard.score[random]--;        
                    players[index].abilityEnabled = false; 
                }                       
            }
        }       
    }
}

class ScoreBoard
{
    constructor()
    {
        this.score = [0, 0, 0, 0];
        this.isOver = [false, '-'];
    }
    render(index)
    {
        fill("red");
        textSize("25px Arial");
        
        if(index < 2)
        {
            text(this.score[index], players[index].pos.x + 43, players[index].pos.y + 23);
        }
        else{
            text(this.score[index], players[index].pos.x + 8, players[index].pos.y + 55);
        }
    }

    gameOver()
    {
        fill(this.isOver[1]);
        textSize("50px Arial");
        text(this.isOver[1] + " is a winner!", canvasWidth/2 - 190, canvasHeight/2);
    }
}


// register movement for paddles
function paddlesMovement() {
   
    for (var key in keysDown) 
    {
        var value = Number(key);
        if (value == 82) 
        {
            // check if the paddle is frozen so it can't move 
            if(!players[2].ability.froze) 
            {
                players[0].pos.x -= 10;
            }
        }
        else if (value == 84) 
        {
             // check if the paddle is frozen so it can't move 
            if(!players[2].ability.froze)
            {
                players[0].pos.x += 10;
            }      
        }
     
        else if (value == 86) 
        {
             // check if the paddle is frozen so it can't move 
            if(!players[2].ability.froze) 
            {
                players[1].pos.x -= 10;
            }   
        }
        else if (value == 66) 
        {
             // check if the paddle is frozen so it can't move 
            if(!players[2].ability.froze) 
            {
                players[1].pos.x += 10;
            }      
        }
        else if (value == 65) 
        {
             // check if the paddle is frozen so it can't move 
            if(!players[2].ability.froze) 
            {
                players[2].pos.y -= 10;
            }     
        }
        else if (value == 90) 
        {
             // check if the paddle is frozen so it can't move 
            if(!players[2].ability.froze) 
            {
                players[2].pos.y += 10;
            }     
        }
        else if (value == 75) 
        {
             // check if the paddle is frozen so it can't move 
            if(!players[2].ability.froze) 
            {
                players[3].pos.y -= 10;
            }     
        }
        else if (value == 77) 
        {
             // check if the paddle is frozen so it can't move 
            if(!players[2].ability.froze) 
            {
                players[3].pos.y += 10;
            }       
        }

        // allows paddles to appear on the other side of game screen 
        if(players[0].pos.x > canvasWidth)
        {
            players[0].pos.x = -10;
        }
        else if(players[0].pos.x < 0)
        {
            players[0].pos.x = canvasWidth + 10;
        }
        if(players[1].pos.x > canvasWidth)
        {
            players[1].pos.x = -10;
        }
        else if(players[1].pos.x < 0)
        {
            players[1].pos.x = canvasWidth + 10;
        }
        if(players[2].pos.y > canvasHeight)
        {
            players[2].pos.y = -10;
        }
        else if(players[2].pos.y < 0)
        {
            players[2].pos.y = canvasHeight + 10;
        }
        if(players[3].pos.y > canvasHeight)
        {
            players[3].pos.y = -10;
        }
        else if(players[3].pos.y < 0)
        {
            players[3].pos.y = canvasHeight + 10;
        }
    }
  
}

// reset the ball, register the hit, update the score
function reset()
{
    if(ball.pos.x > canvasWidth)
    {
        if(ball.hit == 'u')
        {    
            scoreboard.score[0]++;
        }
        else if(ball.hit == 'l')
        {
            scoreboard.score[2]++;
        }
        else if(ball.hit == 'd')
        {
            scoreboard.score[1]++;
        }
        else if(ball.hit == 'r')
        {
            scoreboard.score[3]++;
        }

        ball.reset();
        ball.resetB = true;
    }
    if(ball.pos.x < 0)
    {
        if(ball.hit == 'u')
        {
            scoreboard.score[0]++;
        }
        else if(ball.hit == 'r')
        {
            scoreboard.score[3]++;
        }
        else if(ball.hit == 'd')
        {
            scoreboard.score[1]++;
        }
        else if(ball.hit == 'l')
        {
            scoreboard.score[2]++;
        }

        ball.reset();
        ball.resetB = true;
    }
    if(ball.pos.y > canvasHeight)
    {
        if(ball.hit == 'u')
        {
            scoreboard.score[0]++;
        }
        else if(ball.hit == 'l')
        {
            scoreboard.score[2]++;
        }
        else if(ball.hit == 'r')
        {
            scoreboard.score[3]++;
        }
        else if(ball.hit == 'd')
        {
            scoreboard.score[1]++;
        }
        ball.reset();
        ball.resetB = true;
    }
    if(ball.pos.y < 0)
    {
        if(ball.hit == 'l')
        {
            scoreboard.score[2]++;
        }
        else if(ball.hit == 'r')
        {
            scoreboard.score[3]++;
        }
        else if(ball.hit == 'd')
        {
            scoreboard.score[1]++;
        }
        else if(ball.hit == 'u')
        {
            scoreboard.score[0]++;
        }
        ball.reset();
        ball.resetB = true;
    }

    // register the winner
    if(scoreboard.score[0] > 6)
    {
        scoreboard.isOver = [true, players[0].color];
    }
    if(scoreboard.score[1] > 6)
    {
        scoreboard.isOver = [true, players[1].color];
    }
    if(scoreboard.score[2] > 6)
    {
        scoreboard.isOver = [true, players[2].color];
    }
    if(scoreboard.score[3] > 6)
    {
        scoreboard.isOver = [true, players[3].color];
    }
}

// register if the ability button was pressed
function abilitiesHandler(e) {
    switch(e.keyCode)
    {
    case 89: 
        if(players[0].ability.counter > 0)
        {
            players[0].pressed = true;
            players[0].abilityEnabled = true; 
            setTimeout(function() 
            {
            players[0].abilityEnabled = false; 
            players[0].pressed = false;
            players[0].ability.shield = false;
                    
            }, 2000);
            players[0].ability.counter--;
        }
        
        break;  
    case 78:
        if(players[1].ability.counter > 0)
        {
            players[1].pressed = true;
            players[1].abilityEnabled = true;
            players[1].ability.counter--;
        }
        
        break;
    case 83:
        if(players[2].ability.counter > 0)
        {
            players[2].pressed = true;
            players[2].abilityEnabled = true;
            setTimeout(function() 
            {
                players[2].ability.froze = false; 
            }, 2000);  
            players[2].ability.counter--;
        }
        
        break;
    case 76:
        if(players[3].ability.counter > 0)
        {
            players[3].pressed = true; 
            players[3].abilityEnabled = true;  
            players[3].ability.counter--;
        }    
        break;
    default:
        break;               
    }
}

function clickToStart() 
{
    // draw
    fill('white');
    textSize("75px Bold");
    text("Click to start!", canvasWidth/2 - 200, canvasHeight/2);

    // play the ball
    canvas.addEventListener('click', function() 
    {
        ball.reset();
        start = true;
    }, false);
}

function draw() 
{
  background('black');
    
  // game is over
  if(scoreboard.isOver[0])
  {

    scoreboard.gameOver();
     
  }
  else
  {
    // click to start 
    if(!start)
    {
    
        clickToStart();
    }
    else
    {
        // if the ball out of bounds, reset();
        reset();
        
        ball.update();
        
        //draw abilities counter for players
        players[0].ability.drawCounter(players[0].color, 0, 20, 45);
        players[2].ability.drawCounter(players[2].color, 2, 20, canvasHeight - 20);
        players[1].ability.drawCounter(players[1].color, 1, canvasWidth - 35, canvasHeight - 20);
        players[3].ability.drawCounter(players[3].color, 3, canvasWidth - 35, 40);

        //collision with paddles
        ball.collideLeft(players[2], players[1]);
        ball.collideRight(players[3], players[1]);
        ball.collideUp(players[0], players[1]);
        ball.collideBottom(players[1]);
        ball.collideShield(players[0]);

        // movement for paddles
        paddlesMovement();

        // check if ability is ready 
        players[0].ability.abilityReady(0);
        players[1].ability.abilityReady(1);
        players[2].ability.abilityReady(2);
        players[3].ability.abilityReady(3);

        // trigger the fire bullet 
        if(players[1].ability.fireBullet)
        {
            ball.fireOn(); 
        } 
        else
        {
            ball.render('white');
            ball.resetB = false;
        }

        // enable shield
        if(players[0].ability.shield)
        {
            players[0].ability.shieldOn(canvasWidth, 5);
        }

        // freeze paddles
        if(players[2].ability.froze)
        {
            players[0].ability.freeze(0);
            players[1].ability.freeze(1);
            players[3].ability.freeze(3);
        }
        else
        {
            players[0].render();
            players[1].render();       
            players[3].render();
        } 
        players[2].render();

        //score for each player
        scoreboard.render(0);
        scoreboard.render(1);
        scoreboard.render(2);
        scoreboard.render(3);
    
    }
  }
}
function setup()
{ 
    let myCanvas = createCanvas(canvasWidth, canvasHeight);
    myCanvas.parent('container');
    players = 
    [        
        new Player(canvasWidth / 2 - 50, 20, 100, 30, 'Green', new Ability('shield')),
        new Player(canvasWidth / 2 - 50, canvasHeight - 40, 100, 30, 'Yellow', new Ability('fireBall')),
        new Player(15, canvasHeight / 2 - 50, 30, 100, 'Blue', new Ability('freeze')),
        new Player(canvasWidth - 45, canvasHeight / 2 - 50, 30, 100, 'Orange', new Ability('steal'))
    ];
    scoreboard = new ScoreBoard();
    ball = new Ball();


}
var start = false; 
let canvasWidth = 800;
let canvasHeight = 800;

keysDown = {};

window.addEventListener("keydown", function (event) {
    keysDown[event.keyCode] = true;
});

window.addEventListener("keyup", function (event) {
    delete keysDown[event.keyCode];
});

window.addEventListener("keyup", abilitiesHandler, false);


console.log("TEST INITIAL");

// Canvas Load
let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
// Prevents text from being highlighted on a canvas double click
canvas.onselectstart = function () {
    return false;
}
// HTML Elements
let collisionCounter = document.getElementById("collisionDisplay");
let destructionCounter = document.getElementById("destroyedDisplay");
// Event Listeners
document.addEventListener('keydown', downInator);
document.addEventListener('keyup', upInator);
document.getElementById("canvas").addEventListener("click", doThingClick);

// Variables //
let keysPressed = [];

let block;
let blockColor = "red";
let blockSize = 90;
let blockHealth = 100000;
let blockSpeed = 0.3;
let blockArray = [];

let mana = 100;
let manaCostDefault = 2;
let manaColor = "skyblue";
let manaCap = 200;
let manaRegen = 2;
let manaOverload = false;
let manaBar;

let bubble;
let bubbleColor = "pink";
let bubbleSpeedx;
let bubbleWackyness = 2;
let bubbleSpeedy = 3;
let bubbleSize = 10;
let bubbleDamage = 1;
let manaCost = manaCostDefault;
let bubbleArray = [];

let collisions = 0;
let destructions = 0;

let homingSpeed = 0.3;

let explosion;
let explosionColor = 'orange'
let expansionCap = 20;
let explosionDamage = 20;
let expansionVelocity = blockSpeed * 1.2;
let explosionSize = 10;
let explosionArray = [];

//Assigned via downInator
let bouncy = false;
let homing = false;
let explosive = false;
let digit4 = false;
// Debugger Variables
let bubbleCount = 0;

// Functions //
function downInator(event) {
    //  creates an object "event" within keysPressed array that has the name of the key pressed and gives it the value "true" effectivly defining it. Without the added "true" bit it would just blink out of existence.
    keysPressed[event.code] = true;

    if (event.code == 'Digit1') {
        bouncy = true;
    }
    if (event.code == 'Digit2') {
        homing = true;
    }
    if (event.code == 'Digit3') {
        explosive = true;
    }
    if (event.code == 'Digit4') {
        digit4 = true;
    }
    //(keysPressed['Control'] && event.key == 'a')
}

function upInator(event) {
    //  finds the id of the key released in the keyPressed array and deletes it.
    // console.log(keysPressed);
    delete keysPressed[event.code]
    if (event.code == 'Digit1') {
        bouncy = false;
    }
    if (event.code == 'Digit2') {
        homing = false;
    }
    if (event.code == 'Digit3') {
        explosive = false;
    }
    if (event.code == 'Digit4') {
        digit4 = false;
    }
}

function doThingClick(event) {
    bubbleSpeedx = (Math.random() * (bubbleWackyness + blockSpeed)) - (Math.random() * (bubbleWackyness + blockSpeed));
    bubbleColor = "white"
    if (bouncy == true && explosive == true && homing == false) {
        bubbleColor = "purple";
        manaCost = 20
    } else {
        if (bouncy == true) {
            bubbleColor = "blue"
            manaCost = 15
            if (homing == true) {
                bubbleColor = "green";
                manaCost = 20
                if (explosive == true) {
                    bubbleColor = "black";
                    manaCost = 70
                }
            }
        } else if (homing == true) {
            bubbleColor = "yellow";
            manaCost = 5
            if (explosive == true) {
                bubbleColor = "orange";
                manaCost = 15
            }
        } else if (explosive == true) {
            bubbleColor = "red";
            manaCost = 25
        }
    }
    if (keysPressed['ShiftLeft']) {
        block = new Block("red", event.clientX - canvas.getBoundingClientRect().x, event.clientY - canvas.getBoundingClientRect().y, blockSize, blockSize, blockHealth, blockSpeed, bouncy, homing, explosive);
        blockArray.splice(blockArray.length, 0, block);
    } else {
        if (manaCost >= mana) {
            manaColor = 'red';
            manaOverload = true;
            setTimeout(manaOverloadReset, 500)
        }
        if (manaOverload == false) {
            bubbleMaker(event, bubbleSpeedx);
            mana -= manaCost;
        }

    }
}

function manaOverloadReset() {
    manaOverload = false;
}

function bubbleMaker(event, speedx) {
    bubbleCount++;
    //Make new bubble
    bubble = new Projectile(bubbleColor, bubbleCount, speedx, bubbleSpeedy, bubbleSize, event.clientX - canvas.getBoundingClientRect().x, event.clientY - canvas.getBoundingClientRect().y, bubbleDamage, manaCost, bouncy, homing, explosive);

    bubbleArray.splice(bubbleArray.length, 0, bubble);
    bubble.drawBubble();
}

updateGlobal();
function updateGlobal() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); //Clear first
    bubbleFunction();
    blockDestroyedCheck();
    counterUpdate();
    manaBarUpdate();
    requestAnimationFrame(updateGlobal);
  
}

function bubbleFunction() {
    for (let a = 0; a < bubbleArray.length; a++) {
        bubbleArray[a].update();
        if (offScreenCheck(a) == true) {
            break;
        }
        for (let i = 0; i < blockArray.length; i++) {
            if (collisionCheck(a, i) == true) {
                break
            }
            homingCheck(a, i);
        }
    }
}

function blockDestroyedCheck() {
    for (i = 0; i < blockArray.length; i++) {
        blockArray[i].update();
        if (blockArray[i].numb <= 0) {
            destructions++;
            blockArray.splice(i, 1);
        }
    }
}

function counterUpdate() {
    collisionCounter.innerHTML = collisions;
    destructionCounter.innerHTML = destructions;
}

function manaBarUpdate() {
    if (manaOverload == false) {
        manaColor = 'skyblue'
        if (mana <= manaCap) {
            mana += manaRegen;
        }
    }
    manaBar = new Block(manaColor, canvas.width - 50, canvas.height, 50, -(mana * 5), mana, 0);
    manaBar.update();
    manaCost = manaCostDefault;
}

//////////////////////////////////// This is where the fun begins ////////////////////////////////////////////

function offScreenCheck(a) {
    if (this.homing == false || blockArray.length == 0) {
        if (bubbleArray[a].offScreenCheck() == true) {
            bubbleArray.splice(a, 1)
            // Debugger stat
            bubbleCount--;
        }
    }
    return false;
}

function collisionCheck(a, i) {
    if (bubbleArray[a].collisionCheck(blockArray[i].x, blockArray[i].y, blockArray[i].width, blockArray[i].height) == true) {
        explosiveCheck(a);
        bouncyCheck(a, i);
        // Increase Collision Co
        collisions++;
        // Remove hp from block hit
        blockArray[i].numb -= bubbleArray[a].damage;
        // Debugger stat
        bubbleCount--;
        // Remove bubble LAST if bounce = false
        if (bubbleArray[a].bouncy == false) {
            bubbleArray.splice(a, 1);
        }
        return true;
    }
}



function bouncyCheck(a, i) {
    if (bubbleArray[a].bouncy == true) {
        if ((bubbleArray[a].y - bubbleArray[a].radius) >= (blockArray[i].y + blockArray[i].height - bubbleArray[a].speedy) ||
            (bubbleArray[a].y + bubbleArray[a].radius) <= (blockArray[i].y - bubbleArray[a].speedy)) {
            bubbleArray[a].speedy = -bubbleArray[a].speedy;
        } else {
            bubbleArray[a].speedx = -bubbleArray[a].speedx;
        }
    }
}

function homingCheck(a, i) {
    if (bubbleArray[a].homing == true) {
        if (bubbleArray[a].x < blockArray[i].heartx) {
            bubbleArray[a].speedx -= homingSpeed;
        } else if (bubbleArray[a].x > blockArray[i].heartx) {
            bubbleArray[a].speedx += homingSpeed
        }
        if (bubbleArray[a].y < blockArray[i].hearty) {
            bubbleArray[a].speedy -= homingSpeed;
        } else if (bubbleArray[a].y > blockArray[i].hearty) {
            bubbleArray[a].speedy += homingSpeed
        }
    }
}

function explosionMaker(x,y){
    explosion = new Explosion(explosionColor,x,y, expansionVelocity, explosionDamage);

    explosionArray.splice(explosionArray.length, 0, explosion);
}
function explosiveCheck(a) {
    if (bubbleArray[a].explosive == true){
        explosionMaker(bubbleArray[a].x,bubbleArray[a].y)
    }
    for (let e = 0; e < explosionArray.length; e++){
        if (explosionArray[e].cycles < expansionCap){
            explosionArray[e].update;
            explosionArray[e].cycles ++;
        } else {
            explosionArray.splice(e,1)
        }
    }
}

// Explosions


// Homing
if (bubbleArray[a].homing==true){
    if (bubbleArray[a].speedy <= speedLimit && bubbleArray[a].speedx <= speedLimit){
        if (bubbleArray[a].x < blockArray[i].heartx){
            bubbleArray[a].speedx +=homingSpeed;
        } else if (bubbleArray[a].x > blockArray[i].heartx){
            bubbleArray[a].speedx +=homingSpeed
        }
    } 
}


// Multiple Keys pressed //Implemented

let keysPressed = {};

document.addEventListener('keydown', downInator);
document.addEventListener('keyup', upInator);

function downInator(event){
   //  creates an object "event" within keysPressed array that has the name of the key pressed and gives it the value "true" effectivly defining it. Without the added "true" bit it would just blink out of existence.
   keysPressed[event.key] = true;

   // checks pre-existing buttons being held down then the new event.. Ctrl+a and not a+Ctrl
   if (keysPressed['Control'] && event.key == 'a') {
       alert("Wowza");
   }
   // console.log(event.key);
    console.log(event.code);
   // console.log(keysPressed[event.key]);
   // console.log(keysPressed);
}

function upInator(event){
   //  finds the id of the key released in the keyPressed array and deletes it.
   delete keysPressed[event.key]
}


import locationsArray from '../location.js';
import {isInsideQuad} from "./location-quad.js";

let colorElement1 = document.getElementById("status1");
let colorElement2 = document.getElementById("status2");
let device, location;

function main() {
    console.log('Page is fully loaded');
}

window.addEventListener('load', main);
colorElement1.addEventListener('click', onClickSquareBox1);
colorElement1.addEventListener('touch', onClickSquareBox1);
colorElement2.addEventListener('click', onClickSquareBox2);
colorElement2.addEventListener('touch', onClickSquareBox2);


async function onClickSquareBox1() {
    location = locationsArray[0];
    let confirmation = "Treasure ready: " + location.name;
    document.getElementById("status1").innerHTML = confirmation;
    let utterance = new SpeechSynthesisUtterance(confirmation);
    speechSynthesis.speak(utterance);
}

async function onClickSquareBox2() {
    device = await getLocation();

    let isInside = isInsideQuad(device, location);
    let status;
    let speak;
    status = "Device Coordinates are: " + "<br>";
    status += "Latitude: " + device.coords.latitude + "<br>";
    status += "Longitude: " + device.coords.longitude + "<br>";
    if (isInside) {
        status += "Congratulations!! You have reached the Quest: " + location.name;
        speak = "Congratulations!! You have reached the Quest: " + location.name;
    } else {
        status += "You haven't reached the quest";
        speak = "You haven't reached the quest";
    }
    document.getElementById("status2").innerHTML = status;
    let utterance = new SpeechSynthesisUtterance(speak);
    speechSynthesis.speak(utterance);

}

// collects current location
async function getLocation() {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
    }).then(position => {
        return position;
    });
}
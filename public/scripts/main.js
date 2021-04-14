import locationsArray from "./init-locations.js";
import { isInsideQuad,getLocationDirections } from "./location-quad.js";
import {	
  getDistanceFromLatLonInm,	

} from "./locations-point.js";



let colorElement1 = document.getElementById("status1");
let colorElement2 = document.getElementById("status2");
let resetButton = document.getElementById("reset-button");

let device, location;

function main() {
  console.log("Page is fully loaded");
}

window.addEventListener("load", main);
colorElement1.addEventListener("click", onClickSquareBox1);
colorElement1.addEventListener("touch", onClickSquareBox1);
colorElement2.addEventListener("click", onClickSquareBox2);
colorElement2.addEventListener("touch", onClickSquareBox2);

resetButton.addEventListener("click", resetScavenger);

async function onClickSquareBox1() {
 /* Ajax to get a random location from the database when the first box is clicked */	
 $.ajax({	
  type: "GET",	
  url: "/location/get-a-random-location",	
  success: function (coord) {	
    location = {	
      name: coord.locationName,	
      type: "quad",	
      coordinates: coord.coordinate,	
    };	
    let confirmation = "Your target location is " set"+"\n"+"Start finding it!!";	
    colorElement1.innerHTML = confirmation;	
    let utterance = new SpeechSynthesisUtterance(confirmation);	
    speechSynthesis.speak(utterance);	
  },	
});
}
async function onClickSquareBox2() {
  if (!location) {
    /* Error handling and a timed popup notification if no location is selected but the players clicks on the second box. */
    let timerInterval;
    Swal.fire({
      title: "Please select a location first!",
      html: "I will close in <b></b> milliseconds.",
      timer: 2000,
      timerProgressBar: true,
      didOpen: () => {
        Swal.showLoading();
        timerInterval = setInterval(() => {
          const content = Swal.getContent();
          if (content) {
            const b = content.querySelector("b");
            if (b) {
              b.textContent = Swal.getTimerLeft();
            }
          }
        }, 100);
      },
      willClose: () => {
        clearInterval(timerInterval);
      },
    });
    return;
  }
  device = await getLocation();

  let isInside = isInsideQuad(device, location);
  let [status, speak] = ["", ""];	
  status = `Your location (lat,long): <br> (${device.coords.latitude.toFixed(	
    4	
  )}, ${device.coords.longitude.toFixed(4)})`;	
  if (isInside) {	
    /* Displays a popup indicating the player have discovered the quest	
       An option is also given to play again */	
    swal	
      .fire({	
        title: "Congratulations, you have solved your quest!",	
        text:	
          "It looks like you enjoyed your quest, wanna double the enjoyment and play again?",	
        width: 600,	
        padding: "3em",	
        background: "#fff url(/images/trees.png)",	
        backdrop: `	
        rgba(0,0,123,0.4)	
        url("/images/cat.gif")	
        left top	
        no-repeat	
      `,	
        showCloseButton: true,	
        showCancelButton: true,	
        focusConfirm: true,	
        confirmButtonText: '<i class="fa fa-thumbs-up"></i> Great!',	
        confirmButtonAriaLabel: "Thumbs up, great!",	
        cancelButtonText: '<i class="fa fa-thumbs-down"></i>',	
        cancelButtonAriaLabel: "Thumbs down",	
      })	
      .then((result) => {	
        if (result.isConfirmed) {	
          resetScavenger();	
          onClickSquareBox1();	
        }	
      });	
    status += "<br> Congratulations!! You have reached Quest: " + location.name;	
    speak = "Congratulations!! You have reached Quest: " + location.name;	
  } else {	
    // Calculating minimum distance from location point to polygon points	
    let distanceArray = [];	
    location.coordinates.map((loc) => {	
      distanceArray.push(	
        Math.floor(	
          getDistanceFromLatLonInm(	
            loc.latitude,	
            loc.longitude,	
            device.coords.latitude,	
            device.coords.longitude	
          )	
        )	
      );	
    });	
    distanceArray.sort((a, b) => a - b);	
    let directionsArray = getLocationDirections(device, location);	
    let directionsString = ` Please head ~${distanceArray[0]} meters towards ${	
      directionsArray.length === 2	
        ? directionsArray[0] + " " + directionsArray[1]	
        : directionsArray[0]	
    }.`;	
    status += "<br> You haven't reached the quest yet.";	
    status += directionsString;	
    speak = "You haven't reached the quest yet. " + directionsString;	
  }	
  colorElement2.innerHTML = status;	
  let utterance = new SpeechSynthesisUtterance(speak);	
  speechSynthesis.speak(utterance);	
}	
// collects current location	
async function getLocation() {	
  return new Promise((resolve, reject) => {	
    navigator.geolocation.getCurrentPosition(resolve, reject);	
  }).then((position) => {	
    return {	
      coords: {	
        latitude: position.coords.latitude,	
        longitude: position.coords.longitude,	
      },	
    };	
  });	
}	
function resetScavenger() {
  colorElement1.innerHTML = "";
  colorElement2.innerHTML = "";
  location = null;
}
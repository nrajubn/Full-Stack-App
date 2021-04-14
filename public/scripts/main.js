import locationsArray from "./init-locations.js";
import { isInsideQuad,getLocationDirections } from "./location-quad.js";



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
    let confirmation = "Your target location is set"+"\n"+"Start finding it!!";	
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
  console.log(isInside);
  let status;
  let speak;
  status = "Device Coordinates: " + "<br>";
  status += "Latitude: " + device.coords.latitude + "<br>";
  status += "Longitude: " + device.coords.longitude + "<br>";
  if (isInside) {
    status += "Congratulations!! You have reached Quest: " + location.name;
    speak = "Congratulations!! You have reached Quest: " + location.name;
  
  Swal.fire({	
    title: "Congratulations!",	
    text: status,	
    icon: "sucess",	
    confirmButtonText: "Cool",	
  });	
    }
    else {	
      let directionsArray = getLocationDirections(device, location);	
      let directionsString = ` Please head ${	
        directionsArray.length === 2	
          ? directionsArray[0] + " " + directionsArray[1]	
          : directionsArray[0]	
      }.`;	
    
      status += "You haven't reached the quest yet.";	
      status += directionsString;	
      speak = "You haven't reached the quest yet. " + directionsString;	
    }
  
  document.getElementById("status2").innerHTML = status;
  let utterance = new SpeechSynthesisUtterance(speak);
  speechSynthesis.speak(utterance);
}

// collects current location
async function getLocation() {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  }).then((position) => {
    return position;
  });
}
function isValid(coordinates) {
    let lat = coordinates.latitude;
    let lon = coordinates.longitude;
  
    if (lat < -90 || lat > 90 || lon < -180 || lon > 180) return false;
    else return true;
  }
  
  function isValidDevice(device) {
    let deviceCoordinates = {};
    deviceCoordinates["latitude"] = device.coords.latitude;
    deviceCoordinates["longitude"] = device.coords.longitude;
  
    if (isValid(deviceCoordinates)) return true;
    else throw "Invalid Device";
  }
  
  function isValidType(location) {
    if (location.type === "quad") return true;
    else throw "Invalid Location Type";
  }
  
  function isValidCoordinates(coordinates) {
    if (coordinates.length != 4) return false;
  
    coordinates.forEach(function (coordinate, index) {
      if (!isValid(coordinate)) return false;
    });
  
    return true;
  }
  
  function isValidLocation(location) {
    if (
      location.name.length > 0 &&
      isValidType(location) &&
      isValidCoordinates(location.coordinates)
    )
      return true;
    else throw "Invalid Location";
  }
  
  function isValidArguments(device, location) {
    if (device == null || location == null)
      throw "Two valid arguments are needed";
    else return true;
  }
  
  export function isInsideQuad(device, location) {
    try {
      let checkValid =
        isValidArguments(device, location) &&
        isValidDevice(device) &&
        isValidType(location) &&
        isValidLocation(location);
      if (checkValid) {
        let x = device.coords.latitude;
        let y = device.coords.longitude;
  
        let inside = false;
        let coordinates = location.coordinates;
        for (
          let i = 0, j = coordinates.length - 1;
          i < coordinates.length;
          j = i++
        ) {
          let xi = coordinates[i]["latitude"],
            yi = coordinates[i]["longitude"];
          let xj = coordinates[j]["latitude"],
            yj = coordinates[j]["longitude"];
  
          let intersect =
            yi > y != yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
          if (intersect) inside = !inside;
        }
        return inside;
      }
    } catch (err) {
      console.log("Exception: " + err);
    }
  }
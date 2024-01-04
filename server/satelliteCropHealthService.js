// Import necessary modules
var grpc = require("@grpc/grpc-js");
var protoLoader = require("@grpc/proto-loader");

// Load the protobuf definition
var PROTO_PATH = __dirname + "/../protos/cropHealth.proto";
var packageDefinition = protoLoader.loadSync(PROTO_PATH, { keepCase: true });
var cropHealth_proto = grpc.loadPackageDefinition(packageDefinition).farming;

// Create a gRPC server
var server = new grpc.Server();

// Implement the RPC method AnalyzeCropHealth as defined in the proto file
server.addService(cropHealth_proto.SatelliteCropHealthMonitoring.service, {
  AnalyzeCropHealth,
  MonitorBugInfestation,
  MonitorSunlightExposure,
});

// Define the AnalyzeCropHealth RPC method
function AnalyzeCropHealth(call, callback) {
  console.log("Function started!"); // Log to check if the function is started

  if (!call.request) {
    console.error("Request is undefined!"); // Log an error if there is no request made
    callback({
      code: grpc.status.INVALID_ARGUMENT,
      details: "Invalid request data",
    });
    return;
  }

  console.log("Request exists:", call.request); // Log the request
  console.log("Request Location:", call.request.location); // Log the location
  console.log("Request Crop Type:", call.request.crop_type); // Log the crop type

  //if the request is missing required data, then throw error
  if (!call.request || !call.request.location || !call.request.crop_type) {
    // Handle the case where required data is missing
    console.error("Invalid request:", call.request);
    callback({
      code: grpc.status.INVALID_ARGUMENT,
      details: "Invalid request data",
    });
    return;
  }

  //if location and crop type are not valid, then throw error
  if (
    !["A", "B"].includes(call.request.location.toUpperCase()) ||
    !["Rice", "Wheat", "Corn"].includes(call.request.crop_type)
  ) {
    console.error("Invalid request, please check entered data:", call.request);
    callback({
      code: grpc.status.INVALID_ARGUMENT,
      details: "Invalid request data",
    });
    return;
  }

  var location = call.request.location;
  var crop_type = call.request.crop_type;

  // some logic to determine health status based on location and crop type
  var health_status;

  switch (location) {
    //if location is A
    case "A":
      //if crop type is rice then healthy else if crop type is wheat or corn (not rice) then unhealthy
      health_status = crop_type === "Rice" ? "Healthy" : "Unhealthy";
      break;
    //if location is B
    case "B":
      //if crop type is rice or corn then unhealthy else if crop type is wheat then healthy
      if (crop_type === "Rice" || crop_type === "Corn") {
        health_status = "Unhealthy";
      } else if (crop_type === "Wheat") {
        health_status = "Healthy";
      }
      break;
    default:
      console.log(
        "You did not choose valid data, please choose A or B for location and Rice, Wheat, or Corn for crop type "
      );
  }

  // Log the health status in the server console
  console.log("Health Status:", health_status);

  // Respond with health status
  var response = { health_status: health_status }; // Create the response
  console.log("Server Response:", response); // Log the response to be sent to the client
  callback(null, response); // Send the response
}

function MonitorBugInfestation(call, callback) {
  console.log("Received request:", call.request); // Log the request

  var location = call.request.location;
  var crop_type = call.request.crop_type;

  // some logic to determine bug infestation based on location and crop type
  //only one location + crop type combination has bug infestation
  if (location == "B" && crop_type == "Rice") {
    var bug_infestation = "True";
  } else var bug_infestation = "False";

  //respond with bug infestation
  var response = { has_bug_infestation: bug_infestation };
  console.log("Response: ", response); // Log the response to be sent to the client
  callback(null, response); // Send the response back to the client
}

function MonitorSunlightExposure(call, callback) {
  console.log("Received request:", call.request); // Log the request to check that server is receiving the request

  var location = call.request.location;
  var direction = call.request.direction;

  // some logic to determine sunlight exposure based on location and orientation
  //this is just random data
  if (location == "A" && direction == "North") {
    var sunlight_exposure = Math.floor(Math.random() * 10) + 1; //random number between 1 and 10
  } else if (location == "B" && direction == "South") {
    var sunlight_exposure = Math.floor(Math.random() * 10) + 1;
  } else {
    //ending the ifs here, as there is no need to check for the other two combinations, since the result is just random
    var sunlight_exposure = Math.floor(Math.random() * 10) + 1;
  }

  // respond with sunlight exposure
  var response = { sunlight_exposure };
  console.log("Response:", response); // Log the response to be sent to the client
  callback(null, response); // Send the response back to the client
}

// Export the service methods. Th is so that we can access the methods from a client using the require statement
module.exports = {
  AnalyzeCropHealth,
  MonitorBugInfestation,
  MonitorSunlightExposure,
};

//I want to try to start the server from the app.js file instead, so I will comment out the code below for now
// // Start the server
// server.bindAsync(
//   "0.0.0.0:40000",
//   grpc.ServerCredentials.createInsecure(),
//   function () {
//     console.log("Server running successfully at 40000");
//     server.start();
//   }
// );

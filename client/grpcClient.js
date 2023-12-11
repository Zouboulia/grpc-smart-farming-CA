// Import necessary modules
var readlineSync = require("readline-sync");
var grpc = require("@grpc/grpc-js");
var protoLoader = require("@grpc/proto-loader");

// Load the protobuf definition
var PROTO_PATH = __dirname + "/../protos/cropHealth.proto";
var packageDefinition = protoLoader.loadSync(PROTO_PATH, { keepCase: true });
var cropHealth_proto = grpc.loadPackageDefinition(packageDefinition).farming;

// Create the gRPC client
var client = new cropHealth_proto.SatelliteCropHealthMonitoring(
  "localhost:40000",
  grpc.credentials.createInsecure()
);

// Create switch to handle different cases based on services in the proto file (MonitorSunlightExposure, BugInfestationRequest, AnalyzeCropHealth)
var service = readlineSync.question(
  "Enter the service you want to use: (AnalyzeCropHealth = 1 ,BugInfestationRequest = 2 , MonitorSunlightExposure = 3)"
);

switch (service) {
  case "1": {
    // Get the location and crop type from the user
    var location = readlineSync.question(
      "Choose location of the crop field: A or B: "
    );
    var crop_type = readlineSync.question(
      "Enter the type of crop:  Rice, Wheat, or Corn: "
    );

    // Create the request payload in order to make the gRPC call
    var payload = {
      location,
      crop_type,
    };

    // Make the gRPC call
    client.AnalyzeCropHealth(payload, function (err, response) {
      if (err) {
        console.error(err);
        return;
      }
      console.log(response);
    });

    break; // Break to exit the switch
  }
  case "2": {
    // Get the location and crop type from the user
    var location = readlineSync.question(
      "Please choose the location of the crop field: A or B: "
    );
    var crop_type = readlineSync.question(
      "Enter the type of crop:  Rice, Wheat, or Corn: "
    );

    // Create the request payload in order to make the gRPC call
    var payload = {
      location,
      crop_type,
    };

    // Make the gRPC call
    client.MonitorBugInfestation(payload, function (err, response) {
      //if there is an error then log it in the server console
      if (err) {
        console.error(err);
        return;
      } //otherwise log the response in the console
      console.log(response);
    });
    break;
  }
  case "3": {
    // Get the location and direction from the user
    var location = readlineSync.question(
      "Please choose the location of the crop field: A or B: "
    );
    var direction = readlineSync.question(
      "Enter the direction of the field: North, South, East, or West: "
    );

    // Create the request payload in order to make the gRPC call
    var payload = {
      location,
      direction,
    };

    // Make the gRPC call
    client.MonitorSunlightExposure(payload, function (err, response) {
      //if there is an error then log it in the server console
      if (err) {
        console.error(err);
        return;
      }
      //otherwise log the response in the console
      console.log(response);
    });
    break;
  }

  default: {
    console.log("Invalid service");
  }
}

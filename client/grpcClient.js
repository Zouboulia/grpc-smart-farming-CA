// Import necessary modules
var readlineSync = require("readline-sync");
var grpc = require("@grpc/grpc-js");
var protoLoader = require("@grpc/proto-loader");

// Load the protobuf definition
var SATELLITE_PROTO_PATH = __dirname + "/../protos/cropHealth.proto";
var SOIL_PROTO_PATH = __dirname + "/../protos/soilPH.proto";

var SatpackageDefinition = protoLoader.loadSync(SATELLITE_PROTO_PATH, {
  keepCase: true,
});
var cropHealth_proto = grpc.loadPackageDefinition(SatpackageDefinition).farming;

var SoilPHpackageDefinition = protoLoader.loadSync(SOIL_PROTO_PATH, {
  keepCase: true,
});
var soilPH_proto = grpc.loadPackageDefinition(SoilPHpackageDefinition).farming;

// Create the gRPC client
var client = new cropHealth_proto.SatelliteCropHealthMonitoring(
  "localhost:40000",
  grpc.credentials.createInsecure()
);

// Create a function to run SatelliteCropHealthMonitoring service (nested switches were giving me errors)
function startSatelliteCropHealthService() {
  //if user chose SatelliteCropHealthMonitoring service from first level switch
  var service = readlineSync.question(
    "Enter the service you want to use: (AnalyzeCropHealth = 1 ,BugInfestationRequest = 2 , MonitorSunlightExposure = 3): "
  );

  switch (
    service //switch for the services from SatelliteCropHealthMonitoring service
  ) {
    case "1": {
      // User chose AnalyzeCropHealth service
      var location = readlineSync.question(
        "Choose location of the crop field: A or B: "
      );
      var crop_type = readlineSync.question(
        "Enter the type of crop: Rice, Wheat, or Corn: "
      );

      var payload = {
        location,
        crop_type,
      };
      //call the AnalyzeCropHealth function from ptoto
      client.AnalyzeCropHealth(payload, function (err, response) {
        if (err) {
          console.error(err);
          return;
        }
        console.log(response);
      });
      break;
    }
    case "2": {
      // User chose BugInfestationRequest service
      var location = readlineSync.question(
        "Please choose the location of the crop field: A or B: "
      );
      var crop_type = readlineSync.question(
        "Enter the type of crop: Rice, Wheat, or Corn: "
      );

      var payload = {
        location,
        crop_type,
      };

      //call the MonitorBugInfestation function from proto
      client.MonitorBugInfestation(payload, function (err, response) {
        if (err) {
          console.error(err);
          return;
        }
        console.log(response);
      });
      break;
    }
    case "3": {
      // User chose MonitorSunlightExposure service
      var location = readlineSync.question(
        //ask user to choose location of the crop field
        "Please choose the location of the crop field: A or B: "
      );
      var direction = readlineSync.question(
        //ask user to choose direction of the crop field
        "Enter the direction of the field: North, South, East, or West: "
      );

      var payload = {
        location,
        direction,
      };

      //call the MonitorSunlightExposure function from the proto file
      client.MonitorSunlightExposure(payload, function (err, response) {
        if (err) {
          //if error, log it to the console
          console.error(err);
          return;
        }
        console.log(response); //if no error, log the response to the console
      });
      break;
    }

    //this is the default case if the user enters an invalid service
    default: {
      console.log("You did not choose a valid service. Please try again.");
    }
  }
}

// create another function to run the pHMonitoring service
function startPHMonitoringService() {
  var clientPH = new soilPH_proto.pHMonitorService(
    "localhost:40000",
    grpc.credentials.createInsecure()
  );

  var location = readlineSync.question(
    "Please choose the location of the crop field: A or B: "
  );
  var crop_type = readlineSync.question(
    "Enter the type of crop: Rice, Wheat, or Corn: "
  );

  var payload = {
    location,
    crop_type,
  };

  clientPH.MonitorSoilpH(payload).on("data", function (response) {
    console.log(response);
  });
}

//I will add here another function to run the UVLightMonitoring service which will be a bidirectional streaming service

// Create first level switch to choose between different services from first level
var service = readlineSync.question(
  "Enter the service you want to use: (SatelliteCropHealthMonitoring = 1 ,pHMonitoring = 2 , UVLightMonitoring = 3): "
);

//switch for the services
switch (service) {
  case "1":
    startSatelliteCropHealthService();
    break;
  case "2":
    startPHMonitoringService();
    break;
  // I will add here a third case for UVLightMonitoring service
  default:
    console.log("The service you entered is invalid. Please try again.");
    break;
}

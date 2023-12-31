// Import necessary modules
var readlineSync = require("readline-sync");
var readline = require("readline");
var grpc = require("@grpc/grpc-js");
var protoLoader = require("@grpc/proto-loader");

// Load the protobuf definitions

//proto file paths
var SATELLITE_PROTO_PATH = __dirname + "/../protos/cropHealth.proto";
var SOIL_PROTO_PATH = __dirname + "/../protos/soilPH.proto";
var UV_PROTO_PATH = __dirname + "/../protos/uvLight.proto";

//loading the proto files for all the services
//using keepCase: true because I was getting errors due to proto parameters having "_" in them, even though this is the standard naming convention in proto files
var SatpackageDefinition = protoLoader.loadSync(SATELLITE_PROTO_PATH, {
  keepCase: true,
});
var cropHealth_proto = grpc.loadPackageDefinition(SatpackageDefinition).farming;

var SoilPHpackageDefinition = protoLoader.loadSync(SOIL_PROTO_PATH, {
  keepCase: true,
});
var soilPH_proto = grpc.loadPackageDefinition(SoilPHpackageDefinition).farming;

var UVLightpackageDefinition = protoLoader.loadSync(UV_PROTO_PATH, {
  keepCase: true,
});

var uvLight_proto = grpc.loadPackageDefinition(
  UVLightpackageDefinition
).farming;

//first service: SatelliteCropHealthMonitoring service

// Create the gRPC client
var client = new cropHealth_proto.SatelliteCropHealthMonitoring(
  "localhost:40000",
  grpc.credentials.createInsecure()
);

// Create a function to run SatelliteCropHealthMonitoring service (as nested switches were giving me errors)
function startSatelliteCropHealthService() {
  //if user chose SatelliteCropHealthMonitoring service from first level switch down at the bottom of the file
  //second level switch for the services from SatelliteCropHealthMonitoring service
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

      //check that user enters correct input for location
      if (!["A", "B"].includes(location.toUpperCase())) {
        //if user enters anything other than A or B, throw an error
        throw new Error(
          "The location you entered is not valid. Please enter 'A' or 'B' "
        );
      }

      var crop_type = readlineSync.question(
        "Enter the type of crop: Rice, Wheat, or Corn: "
      );

      //check that user enters correct input for crop_type
      if (!["Rice", "Wheat", "Corn"].includes(crop_type)) {
        //if user enters anything other than Rice, Wheat, or Corn, throw an error
        throw new Error(
          "The crop type you entered is not valid. Please enter 'Rice', 'Wheat', or 'Corn' "
        );
      }

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
      //check that user enters correct input for location
      if (!["A", "B"].includes(location.toUpperCase())) {
        //if user enters anything other than A or B, throw an error
        throw new Error(
          "The location you entered is not valid. Please enter 'A' or 'B' "
        );
      }

      var crop_type = readlineSync.question(
        "Enter the type of crop: Rice, Wheat, or Corn: "
      );

      //check that user enters correct input for crop_type
      if (!["Rice", "Wheat", "Corn"].includes(crop_type)) {
        //if user enters anything other than Rice, Wheat, or Corn, throw an error
        throw new Error(
          "The crop type you entered is not valid. Please enter 'Rice', 'Wheat', or 'Corn' "
        );
      }

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

      //check that user enters correct input for location
      if (!["A", "B"].includes(location.toUpperCase())) {
        //if user enters anything other than A or B, throw an error
        throw new Error(
          "The location you entered is not valid. Please enter 'A' or 'B' "
        );
      }

      var direction = readlineSync.question(
        //ask user to choose direction of the crop field
        "Enter the direction of the field: North, South, East, or West: "
      );

      //check that user enters correct input for direction
      if (!["North", "South", "East", "West"].includes(direction)) {
        //if user enters anything other than North, South, East, or West, throw an error
        throw new Error(
          "The direction you entered is not valid. Please enter 'North', 'South', 'East', or 'West' "
        );
      }

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
      console.log(
        "You did not choose a valid service. Please choose between 1, 2, or 3 "
      );
    }
  }
}

//second service: pHMonitoring service

// Create a gRPC client for pHMonitoring service (second service)
var clientPH = new soilPH_proto.pHMonitorService(
  "localhost:40000",
  grpc.credentials.createInsecure()
);

// create another function to run the pHMonitoring service
function startPHMonitoringService() {
  var location = readlineSync.question(
    "Please choose the location of the crop field: A or B: "
  );

  // check that user enters correct input for location
  if (!["A", "B"].includes(location.toUpperCase())) {
    //if user enters anything other than A or B, throw an error
    throw new Error(
      "The location you entered is not valid. Please enter 'A' or 'B' "
    );
  }

  var crop_type = readlineSync.question(
    "Enter the type of crop: Rice, Wheat, or Corn: "
  );

  // check that user enters correct input for crop_type
  if (!["Rice", "Wheat", "Corn"].includes(crop_type)) {
    //if user enters anything other than Rice, Wheat, or Corn, throw an error
    throw new Error(
      "The crop type you entered is not valid. Please enter 'Rice', 'Wheat', or 'Corn' "
    );
  }

  var payload = {
    location,
    crop_type,
  };

  // Call MonitorSoilpH function
  clientPH.MonitorSoilpH(payload).on("data", function (response) {
    console.log(response);
  });

  // Call AdjustSoilpH function
  var adjustment_instructions = readlineSync.question(
    "Do you want to adjust the soil pH? (yes or no): "
  );

  // check that user enters correct input for adjustment_instructions
  if (!["yes", "no"].includes(adjustment_instructions)) {
    //if user enters anything other than yes or no, throw an error
    throw new Error(
      "The adjustment instructions you entered are not valid. Please enter 'yes' or 'no' "
    );
  }

  // Create a writable stream for sending data to the server
  const stream = clientPH.AdjustSoilpH(function (err, response) {
    if (err) {
      console.error(err);
      return;
    }
    console.log(response);
  });

  // Send the adjustment instructions to the server
  stream.write({ adjustment_instructions });

  // Signal the end of the stream
  stream.end();
}

//third service: UVLightMonitoring service

// Create the gRPC client for UVLightMonitoring service (third service)
var clientUV = new uvLight_proto.UvLightMonitoringService(
  "localhost:40000",
  grpc.credentials.createInsecure()
);

// Function to run UVLightMonitoring service
function startUVLightMonitoringService() {
  var location = readlineSync.question(
    "Please choose the location of the crop field: A or B: "
  );

  // check that user enters correct input for location
  if (!["A", "B"].includes(location.toUpperCase())) {
    //if user enters anything other than A or B, throw an error
    throw new Error(
      "The location you entered is not valid. Please enter 'A' or 'B' "
    );
  }

  var crop_type = readlineSync.question(
    "Enter the type of crop: Rice, Wheat, or Corn: "
  );

  // check that user enters correct input for crop_type
  if (!["Rice", "Wheat", "Corn"].includes(crop_type)) {
    //if user enters anything other than Rice, Wheat, or Corn, throw an error
    throw new Error(
      "The crop type you entered is not valid. Please enter 'Rice', 'Wheat', or 'Corn' "
    );
  }

  var payload = {
    location,
    crop_type,
  };

  // Call MonitorUvLight function
  var call = clientUV.MonitorUvLight(payload);

  // listen for UV Light updates from the server
  call.on("data", (response) => {
    console.log("Received UV Light response from server: ", response);
  });

  //listen for end of stream from the server
  call.on("end", () => {
    console.log("Server ended UV Light monitoring stream");
  });

  //listen for errors
  call.on("error", (err) => {
    console.error(err);
  });

  var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.on("line", (input) => {
    if (input.toLowerCase() === "quit") {
      call.end();
      rl.close();
    } else {
      // Send the message to the server
      call.write({ message: input });
    }
  });
}

// Create first level switch to choose between different services from first level
var service = readlineSync.question(
  "Enter the service you want to use: (SatelliteCropHealthMonitoring = 1 ,pHMonitoring = 2 , UVLightMonitoring = 3): "
);

//switch for the services (first level switch)
switch (service) {
  case "1":
    startSatelliteCropHealthService();
    break;
  case "2":
    startPHMonitoringService();
    break;
  case "3":
    startUVLightMonitoringService();
    break;
  default:
    console.log(
      "The service you entered is not valid. Please choose between 1, 2, or 3 "
    ); //log error message to console if user enters invalid service
    break;
}

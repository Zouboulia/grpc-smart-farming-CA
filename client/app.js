// Import necessary modules
var readlineSync = require("readline-sync");
var grpc = require("@grpc/grpc-js");
var protoLoader = require("@grpc/proto-loader");

// Load the protobuf definition
var PROTO_PATH = __dirname + "/protos/cropHealth.proto";
var packageDefinition = protoLoader.loadSync(PROTO_PATH);
var cropHealth_proto = grpc.loadPackageDefinition(packageDefinition).farming;

// Create a gRPC client
var client = new cropHealth_proto.SatelliteCropHealthMonitoring(
  "localhost:40000",
  grpc.credentials.createInsecure()
);

// Get the location and crop type from the user
var location = readlineSync.question("Enter the location of the crop field: ");
var cropType = readlineSync.question("Enter the type of crop: ");

// Create the request payload in order to make the gRPC call
var payload = {
  location: location,
  crop_type: cropType,
};

// Make the gRPC call
client.AnalyzeCropHealth(payload, function (err, response) {
  // Callback function to receive the response from the server
  if (err) {
    // If an error occurs, log the error
    console.error(err);
  } else {
    console.log(response); // Log the response from the server
  }
});

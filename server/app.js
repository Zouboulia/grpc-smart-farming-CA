// Import necessary modules
var grpc = require("@grpc/grpc-js");
var protoLoader = require("@grpc/proto-loader");

// Load the protobuf definition
var PROTO_PATH = __dirname + "/protos/cropHealth.proto";
var packageDefinition = protoLoader.loadSync(PROTO_PATH);
var cropHealth_proto = grpc.loadPackageDefinition(packageDefinition).farming;

// Create a gRPC server
var server = new grpc.Server();

// Implement the RPC method AnalyzeCropHealth as defined in the proto file
server.addService(cropHealth_proto.SatelliteCropHealthMonitoring.service, {
  AnalyzeCropHealth: analyzeCropHealth,
});

// Define the AnalyzeCropHealth RPC method
function analyzeCropHealth(call, callback) {
  console.log("Received request:", call.request); // Log the request

  var location = call.request.location;
  var cropType = call.request.crop_type;

  // For testing, crop always healthy
  var healthStatus = "Healthy";

  // Respond with health status
  var response = { healthStatus: healthStatus };
  console.log("Server Response:", response); // Log the response
  callback(null, response);
}

// Start the server
server.bindAsync(
  "0.0.0.0:40000",
  grpc.ServerCredentials.createInsecure(),
  function () {
    console.log("Server running successfully at 40000");
    server.start();
  }
);

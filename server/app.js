// Import necessary modules
var grpc = require("@grpc/grpc-js");
var protoLoader = require("@grpc/proto-loader");

//this basically will require the functions from the satelliteCropHealthService.js file and import them here
var {
  AnalyzeCropHealth,
  MonitorBugInfestation,
  MonitorSunlightExposure,
} = require("./satelliteCropHealthService.js");

// Load the protobuf definition
var PROTO_PATH = __dirname + "/../protos/cropHealth.proto";
var packageDefinition = protoLoader.loadSync(PROTO_PATH, { keepCase: true });
var cropHealth_proto = grpc.loadPackageDefinition(packageDefinition).farming;

// Create a gRPC server
var server = new grpc.Server();

// Add SatelliteCropHealthService
server.addService(cropHealth_proto.SatelliteCropHealthMonitoring.service, {
  AnalyzeCropHealth,
  MonitorBugInfestation,
  MonitorSunlightExposure,
});

// here I will add other services as I create then (uvLight and soilPH, from proto files)

// Start the server
server.bindAsync(
  "0.0.0.0:40000",
  grpc.ServerCredentials.createInsecure(),
  function () {
    console.log("Server running successfully at 40000");
    server.start();
  }
);

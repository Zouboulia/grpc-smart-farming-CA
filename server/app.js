// Import necessary modules
var grpc = require("@grpc/grpc-js");
var protoLoader = require("@grpc/proto-loader");

//this basically will require the functions from the satelliteCropHealthService.js file and import them here
var {
  AnalyzeCropHealth,
  MonitorBugInfestation,
  MonitorSunlightExposure,
} = require("./satelliteCropHealthService.js");

//require the second service: pHMonitorService.js
var { MonitorSoilpH } = require("./pHMonitorService.js");

//require the third service: uvLightService.js

// Load the protobuf definition
var SATELLITE_PROTO_PATHPROTO_PATH = __dirname + "/../protos/cropHealth.proto";
var SOIL_PROTO_PATH = __dirname + "/../protos/soilPH.proto"; //second proto file for pHMonitoring service
var SatpackageDefinition = protoLoader.loadSync(
  SATELLITE_PROTO_PATHPROTO_PATH,
  { keepCase: true }
);
var cropHealth_proto = grpc.loadPackageDefinition(SatpackageDefinition).farming;

//add second proto file for pHMonitoring service
var SoilPHpackageDefinition = protoLoader.loadSync(SOIL_PROTO_PATH, {
  keepCase: true,
});
var soilPH_proto = grpc.loadPackageDefinition(SoilPHpackageDefinition).farming;

// Create a gRPC server
var server = new grpc.Server();

// here I will add services as I create then (uvLight and soilPH, from proto files)

// Add SatelliteCropHealthService
server.addService(cropHealth_proto.SatelliteCropHealthMonitoring.service, {
  AnalyzeCropHealth,
  MonitorBugInfestation,
  MonitorSunlightExposure,
});

//add pHMonitorService
server.addService(soilPH_proto.pHMonitorService.service, {
  MonitorSoilpH, //fundtion from pHMonitorService.js
});

// Start the server. This starts the server for all services since they are required above
server.bindAsync(
  "0.0.0.0:40000",
  grpc.ServerCredentials.createInsecure(),
  function () {
    console.log("Server running successfully at 40000");
    server.start();
  }
);

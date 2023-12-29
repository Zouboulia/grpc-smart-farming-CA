// Import necessary modules
var grpc = require("@grpc/grpc-js");
var protoLoader = require("@grpc/proto-loader");

//this  will require the functions from the satelliteCropHealthService.js file and import them here
var {
  AnalyzeCropHealth,
  MonitorBugInfestation,
  MonitorSunlightExposure,
} = require("./satelliteCropHealthService.js");

//require the second service: pHMonitorService.js
var { MonitorSoilpH } = require("./pHMonitorService.js");

//require the third service: uvLightService.js
var { MonitorUvLight } = require("./uVLightService.js");

//load paths to the proto files
var SATELLITE_PROTO_PATH = __dirname + "/../protos/cropHealth.proto";
var SOIL_PROTO_PATH = __dirname + "/../protos/soilPH.proto"; //second proto file for pHMonitoring service
var UV_PROTO_PATH = __dirname + "/../protos/uvLight.proto"; //third proto file for uvLightService

//load the proto definitions
var SatpackageDefinition = protoLoader.loadSync(SATELLITE_PROTO_PATH, {
  keepCase: true,
});

var UVLightpackageDefinition = protoLoader.loadSync(UV_PROTO_PATH, {
  keepCase: true,
});

var SoilPHpackageDefinition = protoLoader.loadSync(SOIL_PROTO_PATH, {
  keepCase: true,
});

//load the gRPC packages
var cropHealth_proto = grpc.loadPackageDefinition(SatpackageDefinition).farming;

var soilPH_proto = grpc.loadPackageDefinition(SoilPHpackageDefinition).farming;

var uvLight_proto = grpc.loadPackageDefinition(
  UVLightpackageDefinition
).farming;

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

//add UvLightMonitoringService
server.addService(uvLight_proto.UvLightMonitoringService.service, {
  MonitorUvLight, //function from uvLightService.js
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

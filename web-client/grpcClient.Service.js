// Import necessary modules
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

// Create the gRPC client
var client = new cropHealth_proto.SatelliteCropHealthMonitoring(
  "localhost:40000",
  grpc.credentials.createInsecure()
);

var clientPH = new soilPH_proto.pHMonitorService(
  "localhost:40000",
  grpc.credentials.createInsecure()
);

var clientUV = new uvLight_proto.UvLightMonitoringService(
  "localhost:40000",
  grpc.credentials.createInsecure()
);

module.exports = {
  client,
  clientPH,
  clientUV,
};

// Import necessary modules
var readlineSync = require("readline-sync");
var grpc = require("@grpc/grpc-js");
var protoLoader = require("@grpc/proto-loader");

// Load the protobuf definition
var PROTO_PATH = __dirname + "/protos/cropHealth.proto";
var packageDefinition = protoLoader.loadSync(PROTO_PATH);
var cropHealth_proto = grpc.loadPackageDefinition(packageDefinition).cropHealth;

// Create a gRPC client
var client = new proto.CalcService(
  "0.0.0.0:40000",
  grpc.credentials.createInsecure()
);

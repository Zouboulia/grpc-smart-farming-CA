var express = require("express");
var router = express.Router();
var grpc = require("@grpc/grpc-js");
var protoLoader = require("@grpc/proto-loader");

// Create a gRPC server
var server = new grpc.Server();

//require the functions from the satelliteCropHealthService.js file and import them here
var {
  AnalyzeCropHealth,
  MonitorBugInfestation,
  MonitorSunlightExposure,
} = require("../../satelliteCropHealthService");

//load paths to the proto files
var SATELLITE_PROTO_PATH = __dirname + "/../protos/cropHealth.proto";

//load the proto definitions
var SatpackageDefinition = protoLoader.loadSync(SATELLITE_PROTO_PATH, {
  keepCase: true,
});

//load the gRPC packages
var cropHealth_proto = grpc.loadPackageDefinition(SatpackageDefinition).farming;

// Add SatelliteCropHealthService
server.addService(cropHealth_proto.SatelliteCropHealthMonitoring.service, {
  AnalyzeCropHealth,
  MonitorBugInfestation,
  MonitorSunlightExposure,
});

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Smart Farming Application" });
});

// get analyze crop health page and call function
router.get("/analyzeCropHealth", (req, res) => {
  res.render("cropHealth", { title: "Analyze Crop Health" });
});

// separating the routes so that I can add the post request for the analyze crop health page
router.post("/analyzeCropHealthData", function (req, res) {
  const { location, crop_type } = req.body;
  console.log(req.body); //log the request to see if it is working

  // Call AnalyzeCropHealth method
  AnalyzeCropHealth(location, crop_type) //arguments are location and crop type
    .then((result) => {
      // Send result as JSON
      res.json(result);
    })
    .catch((error) => {
      // Handle errors
      console.error("Error:", error);
      res.status(500).json({ error: "An error occured" }); //error if status is 500
    });
});

router.get("/monitorSoilPH", async (req, res) => {
  res.render("soilPH", { title: "Monitor Soil pH" });
});

router.post("/monitorSoilPHData", function (req, res) {
  const { location, crop_type } = req.body;

  // Call MonitorSoilpH method
  MonitorSoilpH(location, crop_type)
    .then((result) => {
      // Send result as JSON
      res.json(result);
    })
    .catch((error) => {
      // Handle errors
      console.error("Error:", error);
      res.status(500).json({ error: "An error occured" });
    });
});

router.get("/monitorUVLight", async (req, res) => {
  res.render("UvLight", { title: "Monitor UV Light" });
});

router.post("/monitorUVLightData", function (req, res) {
  const { location, crop_type } = req.body;

  // Call MonitorUvLight method
  MonitorUvLight(location, crop_type)
    .then((result) => {
      // Send result as JSON
      res.json(result);
    })
    .catch((error) => {
      // Handle errors
      console.error("Error:", error);
      res.status(500).json({ error: "An error occured" });
    });
});

// export the router
module.exports = router;

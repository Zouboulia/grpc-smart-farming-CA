var express = require("express");
var router = express.Router();
var { client, clientPH, clientUV } = require("../grpcClient.Service");

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
  client.AnalyzeCropHealth(
    {
      location: location,
      crop_type: crop_type,
    },
    (err, response) => {
      if (err) {
        console.error("Error:", err);
        res.status(500).json({
          error: "An error occured, please make sure to enter valid data",
        });
      } else {
        console.log("Response:", response);
        res.json(response);
      }
    }
  );
});

//call monitor bug infestation

router.post("/monitorBugInfestationData", function (req, res) {
  const { location, crop_type } = req.body;
  client.MonitorBugInfestation(
    {
      location: location,
      crop_type: crop_type,
    },
    (err, response) => {
      if (err) {
        console.error("Error:", err);
        res.status(500).json({
          error: "An error occured, please make sure to enter valid data",
        });
      } else {
        console.log("Response:", response);
        res.json(response);
      }
    }
  );
});

router.post("/monitorSunlightExposureData", function (req, res) {
  const { location, crop_type } = req.body;
  client.MonitorSunlightExposure(
    {
      location: location,
      crop_type: crop_type,
    },
    (err, response) => {
      if (err) {
        console.error("Error:", err);
        res.status(500).json({
          error: "An error occured, please make sure to enter valid data",
        });
      } else {
        console.log("Response:", response);
        res.json(response);
      }
    }
  );
});

// get monitor bug infestation page and call function
router.get("/monitorSoilPH", async (req, res) => {
  res.render("soilPH", { title: "Monitor Soil pH" });
});

router.post("/monitorSoilPHData", function (req, res) {
  const { location, crop_type } = req.body;

  clientPH
    .MonitorSoilpH({
      location: location,
      crop_type: crop_type,
    })
    .on("data", (response) => {
      console.log("Response: ", response); //if no error, log the response to the console
      res.json(response);
    })
    // handle errors
    .on("error", (err) => {
      console.error("Error:", err);
      res.status(500).json({
        error: "An error occurred",
      });
    })
    // handle end of stream
    .on("end", () => {
      console.log("Stream ended");
      res.end();
    });

  // //call adjust soil pH function and send data to client
  // clientPH.AdjustSoilpH({ adjustment_instructions: "yes" }, (err, response) => {
  //   if (err) {
  //     console.error("Error:", err);
  //     res.status(500).json({
  //       error: "An error occured, please make sure to enter valid data",
  //     });
  //   } else {
  //     console.log("Response:", response);
  //     res.json(response);
  //   }
  // });
});

// get monitor sunlight exposure page and call function

router.get("/monitorUVLight", async (req, res) => {
  res.render("UvLight", { title: "Monitor UV Light" });
});

router.post("/monitorUVLightData", function (req, res) {
  const { location, crop_type } = req.body;

  clientUV
    .MonitorUvLight({
      location: location,
      crop_type: crop_type,
    })
    .on("data", (response) => {
      console.log("Response: ", response); //if no error, log the response to the console
      res.json(response);
    })
    //handle errors
    .on("error", (err) => {
      console.error("Error: ", err);
      res.status(500).json({
        error: "An error occurred",
      });
    })
    //handle end of stream
    .on("end", () => {
      console.log("Stream ended");
      res.end();
    });
});

// export the router
module.exports = router;

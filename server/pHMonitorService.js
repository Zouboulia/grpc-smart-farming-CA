// Implement RPC method MonitorSoilpH
function MonitorSoilpH(call) {
  console.log("Starting soil pH monitoring service"); // Log when the client calls the method

  //creating a setInterval function to simulate soil pH changes every 5 seconds
  setInterval(() => {
    var soil_pH = Math.random() * 10; //use Math.random() to generate a random number between 0 and 10
    var pH_change_info = " ";

    if (soil_pH > 5) {
      pH_change_info =
        "The soil pH is too high. Please add more fertilizer to the soil.";
    } else if (soil_pH < 5) {
      pH_change_info = "The soil pH is fine.";
    }

    //use call.write to send the new soil_pH and pH_change_info to the client
    call.write({ soil_pH, pH_change_info });
  }, 5000); //this will run every 5 seconds

  // Set up event listener for client cancellation
  call.on("Service cancelled", () => {
    //if client cancells the request by pressing control + c, then log the message in the server console
    console.log("Client cancelled soil pH monitoring service"); //log this as well to indicate that the client cancelled the request
    call.end();
    // If the client ends the call, clear the interval to stop sending updates
    clearInterval(uvInterval);
  });
}

function AdjustSoilpH(call, callback) {
  console.log("Starting soil pH adjustment service");

  // Process client requests
  call.on("data", function (adjustmentRequest) {
    var soil_pH = Math.random() * 10;

    if (adjustmentRequest.adjustment_instructions == "yes") {
      console.log("Adding fertilizer to the soil");
    } else {
      console.log("No adjustment needed");
    }

    // Send the new soil_pH to the client
    call.write({ soil_pH });
  });

  // Handle client cancellation
  call.on("end", function () {
    console.log("Client cancelled soil pH adjustment service");
    call.end();
  });
}

// Export the service method so it can be used in the server
module.exports = {
  MonitorSoilpH,
  AdjustSoilpH,
};

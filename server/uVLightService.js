// Implement RPC method MonitorUvLight
function MonitorUvLight(call) {
  console.log("Starting UV Light monitoring service"); // Log when the client calls the method

  //set up event listener for client requests
  call.on("data", (request) => {
    console.log("Received message from client:", request.message);
  });

  // Create random UV Light numbers between 0 and 11 to simulate UV index changes
  const uvInterval = setInterval(() => {
    const uv_level = Math.random() * 11; // Simulate UV Light level between 0 and 11
    const is_uv_sufficient = uv_level > 5; // Simulate whether the UV level is sufficient based on a threshold

    // Send UV Light update to the client
    call.write({ uv_level, is_uv_sufficient });
  }, 5000); // Update every 5 seconds

  call.on("error", (err) => {
    console.error(err); // Log errors
  });

  // Set up event listener for client cancellation
  call.on("end", function () {
    // If client cancels the request by pressing control + c, then log the message in the server console
    console.log("Client cancelled UV Light monitoring service"); // Log this as well to indicate that the client cancelled the request
    clearInterval(uvInterval); // If the client ends the call, clear the interval to stop sending updates
  });
}

// Export the service method so it can be used in the server
module.exports = {
  MonitorUvLight,
};

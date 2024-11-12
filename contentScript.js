
console.log("content script intialized");



var iskeyProcessed = false, isIVProcessed = false, isUrlProcessed = false;
var currStatus = ""


var interval = setInterval(()=>{
  chrome.runtime.sendMessage("get-status", (response) => {

    if (response.message === currStatus)return;

    currStatus = response.message;
      // 3. Got an asynchronous response with the data from the service worker
      console.log("Message from background worker", response.message);

  console.log(response.message);
  console.log(response.body);

// sendMessageToPopup(response.message);


  // if(response.message==="data_generated"){
  //   clearInterval(interval)
  // }

})},500);


// function sendMessageToPopup(message) {
//   chrome.runtime.sendMessage(
//     { from: "content", message: message },
//     function (response) {
//       console.log("Response from popup:", response);
//     }
//   );
// }

// Example of sending a message




// contentScript.js



// function listener(event) {
//   // Check if the message is from the injected script
//  // console.log("content script", event.data.type);
  
//   if (event.source !== window || !event.data || event.data.type !== 'FROM_INJECTED_SCRIPT') {
//     return;
//   }
//   console.log("once reacher here");

//   // Process the received message
//   console.log('iv: ', event.data.payload);
//   isIVProcessed = true;
//   window.removeEventListener("message", listener);
// }

// // Function to handle messages from the injected script
// window.addEventListener("message", listener);

// Send a message to the injected script
// function sendMessageToInjectedScript(message) {
//   window.postMessage({ type: 'FROM_CONTENT_SCRIPT', payload: message }, '*');
// }

// Example usage

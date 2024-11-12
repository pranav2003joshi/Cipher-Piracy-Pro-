

const STATUS = Object.freeze({
  SEARCHING_VIDEO: "searching_video",
  DATA_GENERTAED: "data_generated",
  GENERATING_KEY: "generating_key",
  GENERATING_IV: "generating_iv",
  GENERATING_VIDEO_URL: "generating_video_url",
});

var currStatus = STATUS.SEARCHING_VIDEO,
  ke="",
  iv="",
  videoUrl="";

function changeStatus(status){
  currStatus = status;
}

function setData(key,iv,url){
  self.key = key;
  self.iv = iv;
  self.videoUrl = url;
}

function performFetchRequest() {
  var cache = {};
  return async function (url) {
    if (cache.hasOwnProperty(url) && cache) return cache[url];

    var fetchResponse = await fetch(url);
    var json = await fetchResponse.text();
    cache[url] = json;
    return json;
  };
}

function getprops(text) {
  var startIndex = text.indexOf("props") - 2; // include start of json
  var endIndex = text.length - "</script></body></html>".length; // last chracters not needed

  var propsJson = text.substring(startIndex, endIndex);

  console.log(propsJson);

  return JSON.parse(propsJson).props;
}


async function generateHash(inputString, additionalString) {

    console.log(inputString, " ", additionalString);
  // Extract the last 4 characters from the input string
  const lastFourChars = inputString.slice(-4);

  // Extract individual components from the last 4 characters
  const char1 = parseInt(lastFourChars.charAt(0), 10); // First character (as number)
  const char2and3 = parseInt(lastFourChars.substring(1, 3), 10); // Concatenation of the second and third characters (as number)
  const lastChar = lastFourChars.charAt(3); // Fourth character

  // Slice a portion of the additional string based on extracted characters
  const slicedAdditionalString = additionalString.slice(char1, char2and3);

  // Concatenate the input string with the sliced portion
  const concatenatedString = inputString + slicedAdditionalString;

  // Convert the concatenated string to an ArrayBuffer
  const encoder = new TextEncoder();
  const data = encoder.encode(concatenatedString);

  // Create a SHA-256 hash of the concatenated string
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);

  // Convert the hash buffer to a Uint8Array
  const hashArray = new Uint8Array(hashBuffer);

  // Return a portion of the hash based on the last character
  let resultArray;
  if (lastChar === "6") {
    resultArray = hashArray.slice(0, 16);
  } else if (lastChar === "7") {
    resultArray = hashArray.slice(0, 24);
  } else {
    resultArray = hashArray;
  }

  // Convert the result array to Base64
  const base64String = arrayBufferToBase64(resultArray);
  return base64String;
}

// Helper function to convert Uint8Array to Base64
function arrayBufferToBase64(arrayBuffer) {
  let binary = "";
  const bytes = new Uint8Array(arrayBuffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function convertfrombase64(base64String) {
  return atob(base64String);
}

function textToUint8(base64Text) {
  const text = convertfrombase64(base64Text),
    arrayBuff = new ArrayBuffer(text["length"]),
    uIntArray = new Uint8Array(arrayBuff);
  for (let i = 0x0; i < text["length"]; i++) {
    uIntArray[i] = text["charCodeAt"](i);
  }
  return arrayBuff;
}



async function decryptAESCBC(encryptedBase64, keyBase64, ivBase64, keyLength) {
  // Convert base64-encoded inputs to Uint8Array


  console.log("before base 64 decoding")

  const decodeBase64 = (base64) =>
    Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));

  const keyBuffer = decodeBase64(keyBase64);
  const ivBuffer = decodeBase64(ivBase64);
  const encryptedDataBuffer = decodeBase64(encryptedBase64);

    console.log("before decrypting key");

console.log("keyBuffer ", keyBuffer);
console.log("ivBuffer ", ivBuffer);
console.log("encryptedDataBuffer ", encryptedDataBuffer);
  // Import the key
  const key = await crypto.subtle.importKey(
    "raw",
    keyBuffer,
    { name: "AES-CBC" },
    false,
    ["decrypt"]
  );
console.log("before decrypting Buffer");

  // Decrypt the data
  const decryptedBuffer = await crypto.subtle.decrypt(
    { name: "AES-CBC", iv: ivBuffer },
    key,
    encryptedDataBuffer
  );

  // Convert the decrypted buffer to a UTF-8 string
  const decoder = new TextDecoder("utf-8");
  return decoder.decode(decryptedBuffer);
}

function processIV(ivString) {
  // Remove the '0x' prefix if it exists
  if (ivString.startsWith("0x")) {
    ivString = ivString.slice(2);
  }

  // Split the string into 8-character segments
  const ivSegments = ivString.match(/.{8}/g);

  // Convert each segment from hexadecimal to an integer
  const ivArray = ivSegments.map((segment) => parseInt(segment, 16));

  // Return as Uint32Array
  return new Uint32Array(ivArray);
}
function processKey(tempKey){
  var tempUIntArray = textToUint8(tempKey);
  var dateView = new DataView(tempUIntArray);
  var keyBytes = new Uint32Array([
    dateView.getUint32(0x0), // Read 4 bytes from offset 0
    dateView.getUint32(0x4), // Read 4 bytes from offset 4
    dateView.getUint32(0x8), // Read 4 bytes from offset 8
    dateView.getUint32(0xc), // Read 4 bytes from offset 12
  ]);

  return keyBytes;
}
function processM3U8(tempData) {
  var data = tempData.split('\n');
  var iv,url;
  for(let i = 0 ;i<data.length;i++){
    if (data[i].includes("#EXT-X-KEY")) {
      iv = data[i].split(",").slice(-1)[0].substring(3);
    } else if (data[i].includes("#EXTINF")) {
      url = data[i+1];
      break;
    }
  }

  return {iv:iv,url:url};
}

function processUrl(tempUrl){
  var lastIndex = tempUrl.lastIndexOf('-');
  var requiredString = tempUrl.substring(0, lastIndex);
  var url = requiredString+".m3u8";
  return url;
}

async function generateKey (token,datetime,kstr,ivb6,jstr){

    var hash = (await generateHash(datetime,token)).split(":")[0];

    // console.log("hash",hash);
    changeStatus(STATUS.GENERATING_KEY);


    var tempKey = await decryptAESCBC(kstr, hash, ivb6, datetime.charAt(datetime.length-1));
    var key = processKey(tempKey).toString();
    
    changeStatus(STATUS.GENERATING_IV);
    var tempData = await decryptAESCBC(
      jstr,
      hash,
      ivb6,
      datetime.charAt(datetime.length - 1)
    );
    // console.log("tempData",tempData);
    // console.log("tempKey",tempKey);

    var {iv:tempIV,url:tempUrl} = processM3U8(tempData);
    
    var iv = processIV(tempIV).toString();

    changeStatus(STATUS.GENERATING_VIDEO_URL);
    var videoUrl = processUrl(tempUrl);
    

    // console.log("tempIV",tempIV);
    // console.log("tempUrl", tempUrl);

    // console.log("ivBytes", iv);
    // console.log("videoUrl", videoUrl);
    // console.log("keyBytes", key);

    changeStatus(STATUS.DATA_GENERTAED);




    return {key,iv,videoUrl};


}


var fetchController = performFetchRequest();

async function  handleTokenRequest(url){
    var props =getprops(await fetchController(url));
    var token = props.pageProps.token;
    var datetime = props.pageProps.datetime;

   
    console.log(datetime);
    var kstr = props.pageProps.urls[0].kstr;
    var jstr = props.pageProps.urls[0].jstr;
    var ivb6 = props.pageProps.ivb6;

    var {key,iv,videoUrl} = await generateKey(token,datetime,kstr,ivb6,jstr);

    setData(key, iv, videoUrl);

    





    
    
}
function requestHandler(request) {
//  console.log(req);

  if (
    request.url.includes("secure-player") && 
    request.url.includes("token")
  ) {
    


    

    handleTokenRequest(request.url)
  }

}
function setListeners() {
  chrome.webRequest.onCompleted.addListener(requestHandler, {
    urls: ["<all_urls>"],
  });
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // 2. A page requested user data, respond with a copy of `user`
  if (message === "get-status") {

    var body = {}

    if(currStatus===STATUS.DATA_GENERTAED){
      body = self.videoUrl +"|"+self.key+"|"+ self.iv

      
      // body = { key: self.key, iv: self.iv, videoUrl: self.videoUrl };
   

    }

   
    sendResponse({message:currStatus,body:body});

    if (currStatus === STATUS.DATA_GENERTAED) {
      currStatus = STATUS.SEARCHING_VIDEO;
      delete self.key;
      delete self.iv;
      delete self.videoUrl;
    }
    


   
  }
});

}
function removeListeners() {
  chrome.webRequest.onCompleted.removeListener(requestHandler);
}

setListeners();




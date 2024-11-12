
const fs = require("fs");
const transformUtils = require("./transformUtils");
const utils = require("./utils");
const decryption = require("./decryptWorker");


// fs.readFile("master-8019247.419610704-4.tsb", "utf8", (err, fileData) => {
//   if (err) {
//     console.error("Error reading .tsb file:", err);
//     return;
//   }

//   processData

//   // Get the file type from the URI
//   const filename = "master-8019247.419610704-4.tsb";
//   const fileType = getFileExtension(filename);

//   var decodedData = null;
//   var responseType = "text";

//   console.log(fileType);

//   // Decode the response based on the file type
//   switch (fileType) {
//     case "tsa":
//       decodedData = decodeBase64(transform1(fileData));
//       break;
//     case "tsb":
//       decodedData = decodeBase64(transform5(fileData));
//       break;
//     case "tsc":
//       decodedData = decodeBase64(transform4(fileData));
//       break;
//     case "tsd":
//       decodedData = decodeBase64(transform3(fileData));
//       break;
//     case "tse":
//       decodedData = decodeBase64(transform2(fileData));
//       break;
//     default:
//       responseType = fileData;
//       break;
//   }

//   var finalArrayBuffer = stringToArrayBuffer(decodedData.substring(0));

//   encryptedBytes = new Uint8Array(finalArrayBuffer);

//   keyArray = {
//     0: 3876093240,
//     1: 223660916,
//     2: 2603960656,
//     3: 290082971,
//   };
//   ivArray = { 0: 1206003123, 1: 788511586, 2: 972559823, 3: 2758859426 };
//   const key = convertToUint32Array(keyArray);
//   const iv = convertToUint32Array(ivArray);

//   performDecryption(encryptedBytes, key, iv);
// });
 function processFile(fileData,fileType, keyString, ivString,filename) {

    // const fileData = await fs.readFile(filename, "utf8");

    // // Get the file type from the URI
    // const fileType = getFileExtension(filename);

    // console.log(fileType)

    let decodedData = null;
    let responseType = "text";

    let resultFilePath = "./" + folder + "/processed_" + filename;

    // console.log(fileData);

    // console.log(fileType);

    // Decode the response based on the file type
    switch (fileType) {
      case "tsa":
        decodedData = transformUtils.decodeBase64(transformUtils.transform1(fileData));
        break;
      case "tsb":
        decodedData = transformUtils.decodeBase64(
          transformUtils.transform5(fileData)
        );
        break;
      case "tsc":
        decodedData = transformUtils.decodeBase64(
          transformUtils.transform4(fileData)
        );
        break;
      case "tsd":
        decodedData = transformUtils.decodeBase64(
          transformUtils.transform3(fileData)
        );
        break;
      case "tse":
        decodedData = transformUtils.decodeBase64(
          transformUtils.transform2(fileData)
        );
        break;
      default:
        responseType = fileData;
        break;
    }

    const finalArrayBuffer = utils.stringToArrayBuffer(decodedData.substring(0));

    const encryptedBytes = new Uint8Array(finalArrayBuffer);



    const key = utils.convertStringtoUint32Array(keyString);
    const iv = utils.convertStringtoUint32Array(ivString);

    // console.log("main: processFile:",resultFileName);

   decryption.performDecryption(encryptedBytes, key, iv, resultFilePath);



}

// Call the function with your file name

const keyObject = {
  0: 1554270100,
  1: 1101312216,
  2: 3205259090,
  3: 4252591166,
};
const ivObject = {
  0: 2302478233,
  1: 353435504,
  2: 1699817314,
  3: 1239968444,
};

const args = process.argv.slice(2); // Exclude the first two default args (node and script path)

// Check if we have exactly two arguments
if (args.length !== 4) {
  console.error("Please provide exactly four arguments.");
  process.exit(1);
}

// Extract the two strings
const [folder,filename,keyString,ivString] = args;

// console.log(filename);

// console.log("reached here");




fs.readFile(`./${folder}/${filename}`, "utf8", (err, fileData) => {
  if (err) {
    console.log("Error reading  file:", err);
    return;
  }

  const fileType = filename.substring(filename.lastIndexOf('.')+1);



  processFile(fileData, fileType, keyString, ivString, filename);
})




// // function async (filename) {}
// async function readFile(filename) {
//     await fs.readFile(filename, "utf8", (err, fileData) => {
//   if (err) {
//     console.error("Error reading .tsb file:", err);
//     return;
//   }

//   return fileData;
// })
// }

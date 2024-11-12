 function getFileExtension(url) {
  try {
    const regex = /\.\w+$/;
    const match = url.match(regex);
    return match ? match[0].substring(1) : null;
  } catch (error) {
    return null;
  }
}

 function convertToUint8Array(obj) {
     // Create an array to hold the 8-bit values
     const uint8Array = new Uint8Array(Object.keys(obj).length);

     // Fill the array with the values from the object
     Object.keys(obj).forEach((key, index) => {
       uint8Array[index] = obj[key];
     });

     // Create the Uint32Array, assuming the length is a multiple of 4

     return uint8Array;
   }

  function convertStringtoUint32Array(str){
    var array = str.split(',')
    const uint32Array = new Uint32Array(array.length);

    // Fill the array with the values from the object
    array.forEach((value,index)=>{
      uint32Array[index]  = value;
    })

    return uint32Array;
   }
 function convertToUint32Array(obj) {
     // Create an array to hold the 8-bit values
     const uint32Array = new Uint32Array(Object.keys(obj).length);

     // Fill the array with the values from the object
     Object.keys(obj).forEach((key, index) => {
       uint32Array[index] = obj[key];
     });

     return uint32Array;
   }

   function stringToArrayBuffer(input) {
     // Create a new Uint8Array with the same length as the input string
     var uint8Array = new Uint8Array(new ArrayBuffer(input.length));

     // Iterate through the string and set each character's char code in the Uint8Array
     for (var i = 0; i < input.length; i++) {
       uint8Array[i] = input.charCodeAt(i);
     }

     // Return the underlying ArrayBuffer of the Uint8Array
     return uint8Array.buffer;
   }

  module.exports = {
    getFileExtension,
    convertToUint8Array,
    convertToUint32Array,
    stringToArrayBuffer,
    convertStringtoUint32Array,
  };
   
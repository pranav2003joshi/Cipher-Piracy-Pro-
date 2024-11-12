function transform1(input) {
    const shiftValue = 10;
    let result = '';
    for (let i = 0; i < input.length; i++) {
        const charCode = input.charCodeAt(i);
        const newCharCode = charCode - 2 * shiftValue;
        result += String.fromCharCode(newCharCode);
    }
    return result;
}

// Function 2: XORs each char code with 42 and shifts the result right by 3 bits
function transform2(input) {
    const xorValue = 42;
    const shiftBits = 3;
    let result = '';
    for (let i = 0; i < input.length; i++) {
        const charCode = input.charCodeAt(i);
        const xorCharCode = charCode ^ xorValue;
        const newCharCode = xorCharCode >> shiftBits;
        result += String.fromCharCode(newCharCode);
    }
    return result;
}

// Function 3: Shifts each char code right by 2 bits
function transform3(input) {
    const shiftBits = 2;
    let result = '';
    for (let i = 0; i < input.length; i++) {
        const charCode = input.charCodeAt(i);
        const newCharCode = charCode >> shiftBits;
        result += String.fromCharCode(newCharCode);
    }
    return result;
}

// Function 4: Subtracts 10 from each char code
function transform4(input) {
    const subtractValue = 10;
    let result = '';
    for (let i = 0; i < input.length; i++) {
        const charCode = input.charCodeAt(i);
        const newCharCode = charCode - subtractValue;
        result += String.fromCharCode(newCharCode);
    }
    return result;
}

// Function 5: Shifts each char code right by 3 bits and XORs the result with 42
function transform5(input) {
    const shiftBits = 3;
    const xorValue = 42;
    let result = '';
    for (let i = 0; i < input.length; i++) {
        const charCode = input.charCodeAt(i);
        const shiftedCharCode = charCode >> shiftBits;
        const newCharCode = shiftedCharCode ^ xorValue;
        result += String.fromCharCode(newCharCode);
    }
    return result;
}
function decodeBase64(input) {
    if (typeof window !== "undefined" && window.atob) {
      // Use the browser's atob function if available
      return window.atob(input);
    } else {
      // Use Node.js Buffer to decode Base64 if in a Node.js environment
      return Buffer.from(input, "base64").toString("binary");
    }
  }

  module.exports = {
    transform1,
    transform2,
    transform3,
    transform4,
    transform5,
    decodeBase64
  };
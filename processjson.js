const args = process.argv.slice(2); // Exclude the first two default args (node and script path)

// Check if we have exactly two arguments
if (args.length !== 1) {
  console.error("Please provide exactly one arguments.");
  process.exit(1);
}

// Extract the two strings
const [filedata] = args;

// console.log(filename);

// console.log("reached here");

fs.readFile(`./${folder}/${filename}`, "utf8", (err, fileData) => {
  if (err) {
    console.log("Error reading  file:", err);
    return;
  }


});

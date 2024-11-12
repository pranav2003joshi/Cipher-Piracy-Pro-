const fs = require("fs");
const args = process.argv.slice(2); // Exclude the first two default args (node and script path)

// Check if we have exactly two arguments
if (args.length !== 1) {
  console.error("Please provide exactly one arguments.");
  process.exit(1);
}

// Extract the two strings
const [folder] = args;

fs.readFile(`./${folder}/segments.txt`, "utf8", (err, fileData) => {
  if (err) {
    console.log("Error reading  file:", err);
    return;
  }

  //   file '/Users/divyanshbansal/Downloads/video/new_video_download/download_appx_video/processed_master-8019247.419610704-0.tsb'
  // file '/Users/divyanshbansal/Downloads/video/new_video_download/download_appx_video/processed_master-8019247.419610704-1.tsb'

  var files = fileData.split("\n");

  var newfiles = files.sort(comparetorFunc);

  //console.log(newfiles);

  fileData = files.join("\n");
  var a = files[0]

  // console.log(a.substring(a.lastIndexOf("-") + 1, a.length - 5));

  fs.writeFile(`./${folder}/segments.txt}`, fileData, (err) => {
    if (err) {
      console.error("Error writing segment file:", err);
    } else {
      // console.log(
      //   "Successfully wrote segment file to",
      //   `./${folder}/segments.txt`
      // );
    }
  });

  //   const fileType = filename.substring(filename.lastIndexOf(".") + 1);

  //   processFile(fileData, fileType, keyString, ivString, filename);
});

function comparetorFunc(a, b) {
  index1 = parseInt(a.substring(a.lastIndexOf("-") + 1, a.length - 5));
  index2 = parseInt(b.substring(b.lastIndexOf("-") + 1, b.length - 5));

  //console.log(index1, index2);

  if (index1 < index2) {
    return -1;
  } else if (index1 === index2) {
    return 0;
  } else {
    return 1;
  }

//   return index1 > index2;
}

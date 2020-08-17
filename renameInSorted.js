const fs = require("fs");
const path = require("path");
const { exit } = require("process");

async function writeLogs(logs) {
   return new Promise((resolve, reject) => {
    fs.writeFile(`logs_.json`, JSON.stringify({logs}), (err) => {
        // throws an error, you could also catch it here
        if (err) {
            console.log(err);
            reject(err);
        }
        // success case, the file was saved
        console.log('Saved!');
        resolve();
    }); 
   }) 
}
async function writeLocalPaths(localPaths) {
    return new Promise((resolve, reject) => {
        fs.writeFile(`localPaths.json`, JSON.stringify({localPaths}), (err) => {
            // throws an error, you could also catch it here
            if (err) {
                console.log(err);
                reject(err);
            }
            // success case, the file was saved
            console.log('Saved!');
            resolve();
        }); 
    });
    
}

async function renameFile(buildFolderPath, outputFolderPath) {
    return new Promise((resolve, reject) => {
      fs.rename(buildFolderPath, outputFolderPath, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve("Successfully built!");
        }
      });
    });
}
const logs = [];
const localPaths = [];

fs.readFile("links.json",  async function(err, buf) {
    const matches = JSON.parse(buf.toString())['matches'];
    for(let  i = 0; i < matches.length; i++) {
        const name = matches[i].replace(/^http[s]?:\/\//, "").replace(/[\/ | \. | -]/g, "_") + ".pdf";
        const pdfPath = path.resolve(__dirname, `./pdf/${name}`);
        const pdfNewPath = path.resolve(__dirname, `./pdf/${i+1}_${name}`);

        localPaths.push(`pdf/${i+1}_${name}`);

        let result = "pdf path doesn't exist";
        if (fs.existsSync(pdfPath)) {
            if (fs.existsSync(pdfNewPath)) {
              result = "_exists";
            } else {
               result = await renameFile(pdfPath, pdfNewPath);
            }
        }

        logs.push({
            pdfPath,
            pdfNewPath,
            result
        });
    }
    await writeLogs(logs);
    await writeLocalPaths(localPaths);
    exit();
    // console.log({matches})
});
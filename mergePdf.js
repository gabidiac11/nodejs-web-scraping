const PDFMerge = require('pdf-merge');

const fs = require('fs');

// async function recursiveMergin(subArr, subArr2, arr) {
//     return 
// }

fs.readFile("localPaths.json",  async function(err, buf) {
    const files = JSON.parse(buf.toString())['localPaths'].map(
        (link) => 
            `${__dirname}/${link}`,
        
    );
    
    //Save as new file
    PDFMerge(files, {output: `${__dirname}/merged_files.pdf`})
    .then((buffer) => {
        // console.log({buffer});
    }, (err) => {
        // console.log({err});
    });
});

 

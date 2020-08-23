const PDFMerge = require('pdf-merge');

const fs = require('fs');

// async function recursiveMergin(subArr, subArr2, arr) {
//     return 
// }
async function combineTwoPdf(first, second, output) {
    //Save as new file
    return PDFMerge([first, second], {output});
}

fs.readFile("localPaths.json",  async function(err, buf) {
    const files = JSON.parse(buf.toString())['localPaths'].map(
        (link) => 
            `${__dirname}/${link}`,
        
    );
    let  output = `${__dirname}/merged_76.pdf`;
    let first = `${__dirname}/merged_74.pdf`;
    for(let i = 75; i < files.length; i++) {
        await combineTwoPdf(first, files[i], output);
        first = output;
        output = `${__dirname}/merged_${i}.pdf`;
    }

});

 

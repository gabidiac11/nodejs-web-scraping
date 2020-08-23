const fs = require("fs");
const path = require('path');
const { exit } = require("process");
const { 
  SESSION_NAME,
  outputFolderPDF,
  outputFolderHTML
} = require("./constants");

async function htmlToPdf() {
  console.log("\nStarting converting htmls to pdf...");
  
  if (!fs.existsSync(outputFolderHTML)) {
    console.log(`\nNo output html folder for this session ('${SESSION_NAME}')`);
    exit();
  }
  if (!fs.existsSync(outputFolderPDF)) {
    fs.mkdirSync(outputFolderPDF);
  }

  const pdf = require("html-pdf");
  const options = { format: "Letter" };

  const files = fs.readdirSync(outputFolderHTML);
  if(files.length === 0) {
    console.log(`\nNo output html files for this session ('${SESSION_NAME}')`);
    exit();
  }
  for(let index = 0; index < files.length; index++){
      const htmlPath = path.join(outputFolderHTML, files[index]);
      const stat = fs.lstatSync(htmlPath);

      if (stat.isFile() && path.extname(htmlPath) === ".html") {
        const html = fs.readFileSync(htmlPath, "utf8");
        const pdfOutputPath = `${outputFolderPDF}/pdf_${index}.pdf`;
        await (async () => {
          return new Promise((resolve, reject) => {
            pdf.create(html, options).toFile(pdfOutputPath, function (err, res) {
              if (err) {
                reject(err);
                return;
              }
              resolve();
            });
          }).catch((err) => {
            return new Promise((resolve, reject) => reject(err));
          });
        })().then(
          () => {
            console.log(`OK: ${pdfOutputPath}`);
          },
          (err) => {
            console.log(`NotOk: ${htmlPath}, '${JSON.stringify({ err })}'`);
          }
        );
      } else {
        console.log(`NotOk: ${htmlPath} doesn't exists`);
      }
  };
}
exports.htmlToPdf = htmlToPdf;
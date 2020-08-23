const { exit } = require("process");

function getConstants() {
  const fs = require("fs");
  let BASEURL = "";
  let SESSION_NAME = "";
  const relBase = __dirname + "\\..\\";
  const buf = fs.readFileSync(relBase + "resource\\constants.xml", {
    encoding: "utf8"
  });
  const string = buf.toString();
  BASEURL = string.match(/((<BASEURL>)(.*)(<\/BASEURL>))/);
  if (!BASEURL || !BASEURL.length) {
    console.log("ERROR: No base url in source xml \n");
    exit();
  }
  BASEURL = BASEURL[0].replace(/<([\/]?)BASEURL>/g, "");

  SESSION_NAME = string.match(/((<SESSION_NAME>)(.*)(<\/SESSION_NAME>))/);
  if (!SESSION_NAME || !SESSION_NAME.length) {
    console.log("ERROR: No session name in source xml \n");
    exit();
  }
  SESSION_NAME = SESSION_NAME[0]
    .replace(/<([\/]?)SESSION_NAME>/g, "")
    .replace(/\s/g, "_");

  console.log(`\nYour baseurl: ${BASEURL}`);
  console.log(`Your session: ${SESSION_NAME}\n`);



  return {
    relBase,
    BASEURL,
    SESSION_NAME,
  };
}

const {
  relBase,
  BASEURL,
  SESSION_NAME
} = getConstants();
const outputFolder = relBase + "/output/" + SESSION_NAME;
const outputFolderHTML = outputFolder + "/html";
const outputFolderPDF = outputFolder + "/pdf";
const outputFolderJSON = outputFolder + "/json";
const outputFolderTEXT = outputFolder + "/text";
const outputLinksJSON = outputFolder + "/json/links.json";
const outputLinksTEXT = outputFolder + "/text/links.txt";

exports.BASEURL = BASEURL;
exports.SESSION_NAME = SESSION_NAME;
exports.relBase = relBase;
exports.outputFolder = outputFolder;
exports.outputFolderHTML = outputFolderHTML;
exports.outputFolderPDF = outputFolderPDF;
exports.outputFolderJSON = outputFolderJSON;
exports.outputFolderTEXT = outputFolderTEXT;
exports.outputLinksJSON = outputLinksJSON;
exports.outputLinksTEXT = outputLinksTEXT;

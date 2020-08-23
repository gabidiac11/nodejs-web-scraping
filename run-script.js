const { BASEURL,
  outputFolderJSON,
  outputFolderTEXT,
  outputLinksJSON,
  outputLinksTEXT,
  outputFolder
} = require("./app/constants");
const { downloadHtml } = require("./app/downloadHtml");
const { htmlToPdf } = require("./app/htmlToPdf");
const { exit } = require("process");

/**
 * Reads from source xml and collects all href tag values, preppends the base url form <BASEURL></BASEURL> from xml, then move the list to a json
 */
async function runMyProccess() {
  const fs = require("fs");

  let buf = fs.readFileSync("resource/source.xml", {
    encoding: "utf8",
    flag: "r",
  });
  const matches = buf
    .toString()
    .match(/(href=")([^"]*)(")/g)
    .map(
      (cStr) => `${BASEURL}/${cStr.replace(/^href="/, "").replace(/"/, "")}`
    );
  const textResult = matches.reduce(
    (str, cStr) => str + (str ? "\r" : "") + cStr,
    ""
  );
  if(!fs.existsSync("output")) {
    fs.mkdirSync("output");
  }
  if(!fs.existsSync(outputFolder)) {
    fs.mkdirSync(outputFolder);
  }
  if(!fs.existsSync(outputFolderJSON)) {
    fs.mkdirSync(outputFolderJSON);
  }
  if(!fs.existsSync(outputFolderTEXT)) {
    fs.mkdirSync(outputFolderTEXT);
  }
  fs.writeFileSync(outputLinksTEXT, textResult, (err) => {
    if (err) console.log(err);
    console.log("Result text doc links saved!");
  });
  fs.writeFileSync(
    outputLinksJSON,
    JSON.stringify({ matches }),
    async (err) => {
      if (err) {
        console.log(`NotOk: ${outputLinksJSON}, ${JSON.stringify({ err })}`);
        exit();
      }
      console.log(`Json saved!`);
    }
  );
  await downloadHtml();
  await htmlToPdf();
  exit("\n ok");
}
runMyProccess();

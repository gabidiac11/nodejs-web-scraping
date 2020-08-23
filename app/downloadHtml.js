const puppeteer = require("puppeteer");
const fs = require("fs");
const { exit } = require("process");
const { BASEURL,
  outputFolderHTML,
  outputFolder,
  relBase,
  outputLinksJSON
} = require("./constants");

async function createFileWithBuffer(myPath, buffer) {
  return new Promise((resolve, reject) => {
    fs.writeFile(myPath, buffer, (err) => {
      if (err) {
        reject(`${JSON.stringify(err)}`);
      } else {
        resolve(`${myPath} saved!`);
      }
    });
  }).catch((err) => {
    return new Promise((resolve, reject) => reject(`${JSON.stringify(err)}`));
  });
}
async function pullLoadedPageHtmlContent(url) {
  return puppeteer
    .launch()
    .then(function (browser) {
      return browser.newPage();
    })
    .then(function (page) {
      return page.goto(url).then(function () {
        return page.content();
      });
    })
    .then(function (html) {
      return new Promise((resolve) => resolve(html));
    })
    .catch(function (err) {
      return new Promise((resolve, reject) => reject(`ERROR: at url ${url}, ${JSON.stringify(err)}`));
    });
}
async function downloadHtml() {
  let buf = fs.readFileSync(outputLinksJSON);
  let matches = [];
  try {
    matches = JSON.parse(buf.toString())["matches"];
  } catch (err) {
    console.log(`ERROR: while reading json links, at '${outputLinksJSON}', with error ${JSON.stringify({ err })}`);
    exit();
  }

  if (!fs.existsSync(outputFolder)){
    fs.mkdirSync(outputFolder);
  }
  if (!fs.existsSync(outputFolderHTML)){
    fs.mkdirSync(outputFolderHTML);
  }

  buf = fs.readFileSync(relBase + "resource\\style.css", {
    encoding: "utf8",
  });
  let style = buf.toString();
  for (let index = 0; index < matches.length; index++) {
    let html = await pullLoadedPageHtmlContent(matches[index]);
    if (typeof html === "string") {
      //patch relative refs
      html = html.replace(/href="\//g, `href="${BASEURL}/`);
      //append style from resource folder
      if (style) {
        const indexOfHeadTag = html.indexOf("</head>");
        if (indexOfHeadTag > -1) {
          html =
            html.slice(0, indexOfHeadTag) +
            `<style>${style}</style>` +
            html.slice(indexOfHeadTag, html.length);
        }
      }
      await createFileWithBuffer(`${outputFolderHTML}/html_${index}.html`, html).then(
        (ok) => {
          console.log(ok);
        },
        (notOk) => {
          console.log(`notOk: ${notOk}`);
        }
      );
    }
  }
  return matches.length;
}
exports.downloadHtml = downloadHtml;

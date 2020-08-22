const fs = require("fs");
var puppeteer = require("puppeteer");
const PDFMerge = require('pdf-merge');

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
      return new Promise((resolve, reject) => reject(err));
    });
}
async function createFileWithBuffer(myPath, buffer) {
  return new Promise((resolve, reject) => {
    fs.writeFile(myPath, buffer, (err) => {
      if (err) {
        reject(`${JSON.stringify(err)}`)
      } else {
        resolve(`${myPath} saved!`);
      }
    });
  }).catch((err) => {
    return new Promise((resolve, reject) => reject(`${JSON.stringify(err)}`));
  });
}
async function retrieveHtmlLinks(BASEURL) {
  fs.readFile("jsons/links.json", async function (err, buf) {
    const matches = JSON.parse(buf.toString())["matches"];
    for (let index = 0; index < matches.length; index++) {
      let html = await pullLoadedPageHtmlContent(matches[index]);
      if (typeof html === "string") {
        //patch relative refs
        html = html
        .replace(/href="\//g, `href="${BASEURL}/`);
        // .replace(/(<footer)(.*)(<\/footer>)/, "")
        // .replace(/(<section class="newsletter-container")(.*)(<\/section>)/, "")
        // .replace(/(<div id="sidebar-quicklinks")/, '<div style="display:none" id="sidebar-quicklinks"')
        // .replace(/(<div class="wiki-left-present)/, '<div style="display:block;" class="wiki-left-present')
        // .replace(/(<aside)(.*)(<\/aside>)/, "")
        // .replace(/(<header)(.*)(<\/header>)/, "")

        const indexOfHeadTag = html.indexOf("</head>");
        if(indexOfHeadTag > -1) {
          html = html.slice(0, indexOfHeadTag) + 
              '<link href="./YourStyleSheet.css" rel="stylesheet" type="text/css">' +
              html.slice(indexOfHeadTag, html.length);
        }
        // console.log({ html });
        await createFileWithBuffer(
          `html/html_${index}.html`,
          html
        ).then(ok => {
          console.log({ok});
        }, (notOk) => {
          console.log({notOk})
        });
      }
    }
  });
}
async function combineTwoPdf(first, second, output) {
    //Save as new file
    return PDFMerge([first, second], {output});
}
async function htmlToPdf() {
  const pdf = require('html-pdf');
  
  const html = fs.readFileSync('./test/businesscard.html', 'utf8');
  const options = { format: 'Letter' };
  
  pdf.create(html, options).toFile('./businesscard.pdf', function(err, res) {
    if (err) return console.log(err);
    console.log(res); // { filename: '/app/businesscard.pdf' }
  });
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
/**
 * Reads from source xml and collects all href tag values, preppends the base url form <BASEURL></BASEURL> from xml, then move the list to a json
 */
function runMyProccess() {
  fs.readFile("xmls/source.xml", function (err, buf) {
    const string = buf.toString();
    let BASEURL = string.match(/^((<BASEURL>)(.*)(<\/BASEURL>))/);
    if (!BASEURL.length) {
      console.log("No base url in source xml");
      return;
    }
    BASEURL = BASEURL[0].replace(/<([\/]?)BASEURL>/g, "");
    const matches = string
      .match(/(href=")([^"]*)(")/g)
      .map(
        (cStr) => `${BASEURL}/${cStr.replace(/^href="/, "").replace(/"/, "")}`
      );

    const textResult = matches.reduce(
      (str, cStr) => str + (str ? "\r" : "") + cStr,
      ""
    );

    fs.writeFile("txts/result_links.txt", textResult, (err) => {
      if (err) console.log(err);
      console.log("Result text doc links saved!");
    });
    fs.writeFile(`jsons/links.json`, JSON.stringify({ matches }), (err) => {
      if (err) console.log(err, "here");
      console.log(`Json saved!`);
      retrieveHtmlLinks(BASEURL);
    });
  });
}
runMyProccess();


const fs = require("fs");

var request = require("request");
var puppeteer = require("puppeteer");
const { exit } = require("process");
const { resolve } = require("path");

async function pullCodeFromConsole(url) {
    return puppeteer
    .launch()
    .then(function(browser) {
        return browser.newPage();
    })
    .then(function(page) {
        return page.goto(url).then(function() {
            return page.content();
        });
    })
    .then(function(html) {
        return new Promise((resolve) => resolve(html))
    })
    .catch(function(err) {
        return new Promise((resolve, reject) => reject(err));
    });
}

function extracHrefAttrFromFileToJson() {
    fs.readFile("som.xml", function(err, buf) {
    const string = buf.toString();
    
    const matches = string.match(/(href=")([^"]*)(")/g).map(cStr => `https://angular.io/${cStr.replace(/^href="/, "").replace(/"/, "")}`);
    
    const lyrics = matches.reduce((str, cStr) => (str + (str ? "\r" : "") + cStr), "");
    // write to a new file named 2pac.txt
    fs.writeFile('2pac.txt', lyrics, (err) => {
        // throws an error, you could also catch it here
        if (err) console.log(err);
        // success case, the file was saved
        console.log('Lyric saved!');
    }); 
    fs.writeFile(`links.json`, JSON.stringify({matches}), (err) => {
            // throws an error, you could also catch it here
            if (err) console.log(err, "here");
            // success case, the file was saved
            console.log(`Json saved!`);
        });
    }); 
}

async function createFileWithBuffer(pathname, buffer) {
    return new Promise((resolve, reject) => {
        fs.writeFile(pathname, buffer, (err) => {
            if (err) return reject(`${pathname} poo poo!`);
            return resolve(`${pathname} saved!`);
        });
    })  
}

async function makeThis() {
    fs.readFile("links.json",  async function(err, buf) {
        const matches = JSON.parse(buf.toString())['matches'];
        for(let  i = 0; i < matches.length && i < 3; i++) {
            let html = pullCodeFromConsole(matches[i]);
            if(typeof html === "string") {
                html = html.replace(/href="styles/g, 'href="https://angular.io/styles');
                const resultFile = await createFileWithBuffer(`files/file_${index}.html`, html);
                console.log({resultFile});
            }
        }
        exit()
        // console.log({matches})
    });
}
async function see(link) {
    let html = await pullCodeFromConsole(link);
    console.log({
        html    
    });
    if(typeof html === "string") {
        html = html.replace(/href="styles/g, 'href="https://angular.io/styles');
    }
    const resultFile = await createFileWithBuffer(`files/file_${1}.html`, html);
    console.log({resultFile});

}
// makeThis();
// pullCodeFromConsole("https://angular.io/docs").then(html => {
//     console.log({html});
// });
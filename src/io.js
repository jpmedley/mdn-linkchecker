/*
	I/O module
	Copyright (c) 2018 Epistemex
	www.epistemex.com
*/

const
  fs = require("fs"),
  path = require("path"),
  https = require("https"),
  ANSI = require("./ansi");

let inPrompt = false;

module.exports = {

  testURL: function(url, callback, followRedirects) {
    if (!url.startsWith("https://developer.mozilla.org/en-US/docs/")) return;

    const
      { URL } = require('url'),
      url2 = new URL(url),
      options = {
        method: "HEAD",
        host: url2.hostname,
        port: url2.port,
        path: url2.pathname
      };

    let req = https.request(options, res => {
      if ([301, 302, 307, 308].includes(res.statusCode)) {
        if (followRedirects) {
          this.testURL(res.headers.location, callback, followRedirects);
        }
        else {
          callback({
            statusCode: res.statusCode,
            location: res.headers.location
          })
        }
      }
      else callback({statusCode: res.statusCode, location: url});
    });

    req.on("error", e => {
      if (inPrompt) return;
      inPrompt = true;
      this.prompt(`\x1b[37;1mAn error occurred (${e.toString()}).\nContinue ?`, ["y"], resp => {
        inPrompt = false;
        if (resp.valid) callback({statusCode: 0, location: url, error: e.toString()});
        else process.exit(1)
      })
    });

    req.end();
  },

  loadTextFile: function(filename) {
    let result = null;
    try {
      result = fs.readFileSync(path.resolve(filename));
      if (result) result = ("" + result).replace(/\r/gm, "");
    }
    catch(err) {}
    return result
  },

  saveTextFile: function(filename, data) {
    try {
      fs.writeFileSync(path.resolve(filename), data);
    }
    catch(err) {
      log(`Could not save log file: ${err.message}`)
    }
  },

  prompt: function(q, options, callback) {
    const
      readLine = require("readline"),
      rl = readLine.createInterface({
        input: process.stdin,
        output: process.stdout
      });

    rl.question(q + ` ${ANSI.white}(${ANSI.green}${options.join(",")}${ANSI.white})${ANSI.reset}\n`, resp => {
      rl.close();
      callback({valid: options.includes(resp), response: resp});
    });

  }

};
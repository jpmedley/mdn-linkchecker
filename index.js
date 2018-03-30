/*
  mdn-linkchecker
  Copyright (c) Epistemex 2018
  License: MIT
*/

if (typeof String.prototype.padEnd === "undefined") {
  console.log("This program needs Node v. 8+ to run.");
  process.exit()
}

const
  version = require("./package.json").version,
  options = require("commander"),
  log = console.log.bind(console),
  lf = "\r\n";

options
  .version(version, "-v, --version")
  .usage("[options]")
  .description("Check MDN documentation link based on BCD." + lf + "  Version: " + version + lf + "  (c) 2018 epistemex.com")
  .option("-i, --init", "Initialize. This will check every link in the BCD.")
  .option("-b, --batch <requests>", "Batch size. Number of requests per batch", 10)
  .option("-s, --start <index>", "Start from this index in link list", 0)
  .option("-l, --length <index>", "Number of items from start to process. -1=all", -1)
  .option("-e, --end <index>", "End at this index (instead of using --length)")
  .option("-d, --delay <milliseconds>", "Delay in milliseconds between each fully processed batch", 1200)
  .option("-w, --width <chars>", "Total line width for progress bars", 72)
  .option("-y, --idelay <milliseconds>", "Inter-delay in milliseconds between each request in a batch", 10)
  .option("--no-save", "Don't save to log file.")
  .on("--help", () => log())
  .parse(process.argv);

// clamp
options.batch = Math.max(1, Math.min(200, options.batch|0));
options.delay = Math.max(10, Math.min(60000, options.delay|0));
options.idelay = Math.max(0, Math.min(1000, options.idelay|0));

// Init link list
let links = require(options.init ? "./src/getAllLinks" : "./src/getLogLinks")();
require("./src/checker.js")(options, links);

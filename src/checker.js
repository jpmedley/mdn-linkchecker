/*
	Init module
	Copyright (c) 2018 Epistemex
	www.epistemex.com
*/

const
  log = console.log.bind(console),
  io = require("./io");

module.exports = (options, links) => {

  if (!links || !links.length) {
    log("No links to check. If this is first run use the option --init. Use --help for more options.");
    return
  }

  let
    startTime = Date.now(),
    save = options.save ? "" : " No save.",
    start = Math.max(0, Math.min(links.length - 1, options.start)) | 0,
    end = Math.min(links.length, Math.max(start, options.end ? options.end : start + (options.length >>> 0))) | 0,
    length,
    current = 0,
    loaded = 0,
    batches = 1,
    batch = options.batch,
    total = Math.ceil((end - start) / batch),
    report404 = new Set();

  if (start > end) start = end;
  length = end - start;

  log(`Range: ${start}-${end} (${length}) batch: ${options.batch} batch-delay: ${options.delay}ms idelay: ${options.idelay}ms${save}`);

  const prog = new (require("./dualprog").Bar)({
    width   : options.width,
    current2: start,
    total1  : batch,
    total2  : end - start
  });

  // Init CLI
  prog.render();

  // Start process
  function nextLink() {
    prog.current1a = current % batch;
    io.testURL(links[start + current++], _callback);
    prog.render();
    if (current && (current % batch) && start + current < end) setTimeout(nextLink, options.idelay);
  }

  function _callback(res) {

    if (!res.statusCode) {
      log(`An error occurred: ${res.err}`);
      if (options.save) {
        if (report404.size) {
          log("Saving partial log...");
          io.saveTextFile("./errors_404_interrupted.log", Array.from(report404).join("\n"));
        }
        else {
          log("Nothing to save.")
        }
      }
      else {
        log("Saving disabled.")
      }
      //process.exit(1);
    }
    else if (res.statusCode === 404) {
      report404.add(res.location);
      prog.markError();
    }

    prog.current1b = loaded % batch;
    prog.current2 = ++loaded;
    prog.render(`Batch ${batches}/${total}: awaiting response ${prog.current1b} of ${prog.total1}`);

    if (start + loaded >= end) done();
    else if (!(loaded % batch)) {
      batches++;
      prog.render(`Delaying before batch ${batches}/${total}  0xDEADBEEF: ${report404.size}  Est: ${calcEst()}`);
      setTimeout(nextLink, options.delay);
    }
  }

  nextLink();

  function calcEst() {
    let
      avg = (Date.now() - startTime) / loaded,
      est = (length - loaded) * avg * 0.001;

    if (est >= 3600)
      return (est / 3600).toFixed(1) + " hr";

    if (est >= 60)
      return (est / 60).toFixed(1) + " min";

    return (est).toFixed(1) + " sec";
  }

  function done() {
    let
      list404 = Array.from(report404),
      save = options.save ? "See \"errors_404.log\" for details." : "Save disabled.";

    prog.clear(`FINISHED. Errors: ${list404.length}. ${save}`);

    if (options.save) {
      io.saveTextFile("./errors_404.log", list404.join("\n"));
    }
  }

};
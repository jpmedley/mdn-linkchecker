/*
	Dual progress bars
	Copyright (c) 2018 Epistemex
	www.epistemex.com
*/

const
  log = process.stdout.write.bind(process.stdout),
  lf = "\r\n",
  ANSI = require("./ansi");

module.exports = {Bar: Bar};

function Bar(options) {

  const me = this;

  options = Object.assign({
    "text1": "Batch",
    "text2": "Total",
    total1: 100,
    total2: 100,
    width: 72
  }, options);

  options.width = Math.max(60, options.width);

  let
    ref,
    column1 = Math.max(options.text1.length, options.text2.length) + 1,
    column2 = options.width - column1,
    barWidth = column2 - 7,
    init = true;

  me._errors = new Uint8Array(barWidth);
  me._errPos = 0;

  function render(status) {
//    clearTimeout(ref);
//    ref = setTimeout(() => {
      if (!init) cursorUp(3);
      clearLine();
      if (status) me.status = status;
      showStatus();
      log(options.text1.padEnd(column1) + getBar(0) + lf);
      log(options.text2.padEnd(column1) + getBar(1) + lf);
      init = false;
//    }, 1000/30);
  }

  function showStatus() {
    log(ANSI.cyan + me.status + ANSI.reset + lf);
  }

  function clear(status) {
    if (status) me.status = status;
    clearTimeout(ref);
    cursorUp(4);
    clearLine();
    log(lf + ANSI.white + "-".repeat(options.width) + lf);
    clearLine();
    showStatus();
    log(ANSI.white + "-".repeat(options.width) + lf + ANSI.reset + lf);
  }

  function clearLine() {
    log("\x1b[2K\r")
  }

  function cursorUp(n) {
    log(`\x1b[${n || 1}A`)
  }

  function getBar(n) {
    let w1, w2, p1, p2;
    if (n) {
      p1 = me.current2 / me.total2;
      w1 = me._errPos = Math.round(p1 * barWidth);
      return ANSI.white + "[" + _getMainBar() + ANSI.white + "]" + ANSI.reset + (Math.round(p1 * 100) + "%").padStart(5);
    }
    else {
      p1 = me.current1a / (me.total1 - 1);
      p2 = me.current1b / (me.total1 - 1);
      w1 = Math.round(p1 * barWidth);   // yellow req
      w2 = Math.round(p2 * barWidth);   // green  res
      if (w1 > w2) {
        let bar = ("<".repeat(w2) + ">".repeat(Math.max(0, w1 - w2))).padEnd(barWidth);
        bar = bar.replace(">", ANSI.yellow + ">").replace("<", ANSI.blue + "<");
        return ANSI.white + "[" + bar + ANSI.white + "]" + ANSI.reset + (Math.round(p2 * 100) + "%").padStart(5);
      }
      else {
        return ANSI.white + "[" + ANSI.blue + "<".repeat(w2).padEnd(barWidth) + ANSI.white + "]" + ANSI.reset + (Math.round(p2 * 100) + "%").padStart(5);
      }
    }

    function _getMainBar() {
      let i = 0, bar = "", last = -1, v;
      while(i < me._errPos) {
        v = me._errors[i];
        if (v !== last) {
          bar += v ? ANSI.red : ANSI.green;
          last = v;
        }
        bar += "#";
        i++;
      }
      return bar + " ".repeat(barWidth - me._errPos)
    }
  }

  function markError() {
    me._errors[me._errPos] = 1;
  }

  // Public methods
  this.render = render;
  this.clear = clear;
  this.markError = markError;

  // Public properties
  this.status = "Initializing...";
  this.current1a = 0;   // requests
  this.current1b = 0;   // responses
  this.current2 = 0;    // of total
  this.total1 = options.total1;
  this.total2 = options.total2;
};


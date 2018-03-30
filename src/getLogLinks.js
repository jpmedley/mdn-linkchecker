/*
  getLog
	Copyright (c) 2018 Epistemex
	www.epistemex.com
*/

const io = require("./io");

module.exports = () => {
  let
    links = [],
    log = io.loadTextFile("./errors_404.log");

  if (log) {
    log = log.trim();
    if (log.length) links = log.split("\n");
  }

  return links
};
/*
  getAll
	Copyright (c) 2018 Epistemex
	www.epistemex.com
*/

const mdn = require("mdn-browser-compat-data");

module.exports = () => {

  let links = [];

  function iterate(branch) {
    for(let key of Object.keys(branch)) {
      let feat = branch[key];
      if (feat && key !== "__compat") {
        feat = feat.__compat;
        if (feat && feat.mdn_url && feat.mdn_url.length && !feat.mdn_url.includes("#")) {
          links.push(feat.mdn_url.replace("mozilla.org/", "mozilla.org/en-US/"));
        }
        iterate(branch[key]);
      }
    }
  }

  for (let section of Object.keys(mdn)) {
    if (section !== "browsers") iterate(mdn[section]);
  }

  return links
};


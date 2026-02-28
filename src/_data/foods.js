const fs = require("fs");
const path = require("path");

function parseList(filename) {
  const filePath = path.join(__dirname, "../../", filename);
  const content = fs.readFileSync(filePath, "utf8");
  return content
    .trim()
    .split("\n")
    .filter((line) => line.trim())
    .map((line) => {
      const colonIdx = line.indexOf(":");
      if (colonIdx === -1) return { name: line.trim(), description: "" };
      return {
        name: line.substring(0, colonIdx).trim(),
        description: line.substring(colonIdx + 1).trim(),
      };
    });
}

module.exports = {
  whitelist: parseList("WHITELIST.txt"),
  blacklist: parseList("BLACKLIST.txt"),
};

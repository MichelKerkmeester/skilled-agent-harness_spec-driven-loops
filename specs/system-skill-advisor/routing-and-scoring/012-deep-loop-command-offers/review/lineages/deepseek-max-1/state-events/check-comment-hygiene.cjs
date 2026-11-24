const fs = require("fs");
const L = "specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/review/lineages/deepseek-max-1";
const files = fs.readFileSync(L + "/review-scope-files.txt", "utf8").split("\n").filter((f) => /\.(ts|cjs|mjs|py|js)$/.test(f));
const bad = [];
let scanned = 0;
for (const f of files) {
  if (!fs.existsSync(f)) continue;
  scanned++;
  const lines = fs.readFileSync(f, "utf8").split("\n");
  lines.forEach((line, i) => {
    const t = line.trim();
    const comment = t.startsWith("//") || t.startsWith("*") || t.startsWith("/*") || t.startsWith("#") || t.startsWith('"""') || /^\|\s/.test(t);
    if (!comment) return;
    if (/\b(REQ-\d|AC-\d|ADR-\d|CHK-|T0\d\d|specs\/system-skill-advisor|iteration-[0-9]{3}|review\/lineages)\b/.test(t)) {
      bad.push([f + ":" + (i + 1), t.slice(0, 110)]);
    }
  });
}
console.log("code files scanned:", scanned, "comments with ephemeral labels:", bad.length);
for (const b of bad) console.log("  " + b[0] + " :: " + b[1]);

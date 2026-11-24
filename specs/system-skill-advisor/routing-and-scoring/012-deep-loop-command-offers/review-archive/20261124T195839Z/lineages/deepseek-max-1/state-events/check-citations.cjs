const fs = require("fs"), path = require("path");
const PKT = "specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers";
const docs = ["spec.md", "tasks.md", "acceptance-criteria.md", "implementation-summary.md", "decision-record.md", "plan.md", "timeline.md"];
const cache = new Map();
function lines(p) {
  if (!cache.has(p)) cache.set(p, fs.readFileSync(p, "utf8").split("\n"));
  return cache.get(p);
}
function resolve(p) {
  if (fs.existsSync(p)) return p;
  const alt = path.join(PKT, p);
  if (fs.existsSync(alt)) return alt;
  return null;
}
let total = 0;
const problems = [];
for (const d of docs) {
  const rows = lines(path.join(PKT, d));
  rows.forEach((line, i) => {
    for (const m of line.matchAll(/`([A-Za-z0-9_./-]+\.(?:md|ts|json|jsonl|yaml|txt|cjs|mjs|py)):(\d+)(?:-(\d+))?`/g)) {
      total++;
      const p = resolve(m[1]);
      const n = Number(m[2]);
      if (!p) { problems.push([d, i + 1, "missing file", m[1]]); continue; }
      const len = lines(p).length;
      if (n > len) problems.push([d, i + 1, "line past end (" + len + ")", m[1] + ":" + n]);
    }
  });
}
console.log("citations checked:", total, "problems:", problems.length);
for (const p of problems) console.log(" ", p[0] + ":" + p[1], p[2], p[3]);

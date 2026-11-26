const fs = require("fs"), path = require("path");
const PKT = "specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers";
const ADV = ".skilled/skills/system-skill-advisor/runtime";
const DLR = ".skilled/skills/system-deep-loop/runtime";
const files = [];
function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) { if (e.name !== "node_modules" && e.name !== "dist") walk(p); }
    else if (/\.(vitest\.ts|test\.cjs)$/.test(e.name)) files.push(p);
  }
}
walk(ADV + "/tests");
walk(DLR + "/tests");
const blob = files.map((f) => fs.readFileSync(f, "utf8")).join("\n");
const tasks = fs.readFileSync(PKT + "/tasks.md", "utf8");
const titles = new Set();
for (const m of tasks.matchAll(/\b(?:it|describe)\s*(?:\.each\([^)]*\)\()?\s*(?:"([^"]{8,90})"|'([^']{8,90})')/g)) {
  titles.add((m[1] || m[2]).replace(/\\"/g, '"'));
}
const missing = [...titles].filter((t) => {
  const probe = t.replace(/%[sd]/g, "").slice(0, 24);
  if (probe.length < 8) return false;
  return !blob.includes(probe);
});
console.log("test titles cited in tasks.md:", titles.size, "not found in any test file:", missing.length);
for (const t of missing) console.log("  -", t);

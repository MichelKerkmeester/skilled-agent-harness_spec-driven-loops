const fs = require("fs"), path = require("path");
const PKT = "specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers";
const L = PKT + "/review/lineages/deepseek-max-1";
const scope = fs.readFileSync(L + "/review-scope-files.txt", "utf8").split("\n").filter(Boolean);
const inScope = (p) => scope.some((s) => p === s || p.startsWith(s.replace(/\/$/, "") + "/"));

// 1. Files to Change table paths in spec.md
const specLines = fs.readFileSync(PKT + "/spec.md", "utf8").split("\n");
const declared = new Set();
for (const l of specLines) {
  const m = l.match(/^\| (`[^|]+`) \| /);
  if (!m) continue;
  for (const tok of m[1].matchAll(/`([^`]+)`/g)) {
    const p = tok[1].trim();
    if (p.includes("/") && !p.includes(" ")) declared.add(p.replace(/,$/, ""));
  }
}

// 2. Acceptance evidence paths
const acLines = fs.readFileSync(PKT + "/acceptance-criteria.md", "utf8").split("\n");
const evidence = new Set();
for (const l of acLines) {
  if (!/^\| AC-\d+ \|/.test(l)) continue;
  const ev = l.indexOf("Evidence:");
  if (ev < 0) continue;
  const rm = l.slice(ev).match(/^Evidence: `([^`]+?):\d+`/);
  if (!rm) continue;
  let p = rm[1];
  evidence.add(p);
}
const norm = (p) => {
  if (fs.existsSync(p)) return p;
  if (fs.existsSync(path.join(PKT, p))) return path.join(PKT, p);
  return p;
};
const outDeclared = [...declared].map(norm).filter((p) => !inScope(p));
const outEvidence = [...evidence].map(norm).filter((p) => !inScope(p));
console.log("scope entries:", scope.length);
console.log("declared change-set paths:", declared.size, "outside scope:", outDeclared.length);
for (const p of outDeclared) console.log("  D", p);
console.log("acceptance evidence paths:", evidence.size, "outside scope:", outEvidence.length);
for (const p of [...new Set(outEvidence)]) console.log("  E", p);

const fs = require("fs"), path = require("path");
const PKT = "specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers";
const load = (p) => (fs.existsSync(p) ? fs.readFileSync(p, "utf8").split("\n") : null);
const resolve = (p) => {
  const cands = [p, path.join(PKT, p), path.join(".skilled/skills/system-skill-advisor/runtime", p), path.join(".skilled/skills/system-deep-loop/runtime", p)];
  for (const c of cands) if (fs.existsSync(c)) return c;
  return null;
};
const lines = fs.readFileSync(PKT + "/tasks.md", "utf8").split("\n");
let refs = 0, anchored = 0;
const problems = [];
lines.forEach((line, i) => {
  if (!/^- \[.\] (T|CHK)/.test(line)) return;
  for (const m of line.matchAll(/`([A-Za-z0-9_./-]+\.(?:md|ts|json|jsonl|yaml|txt|cjs|mjs|py|sh)):(\d+)`(?:\s*\(`?([^`)]+)`?\))?/g)) {
    refs++;
    const p = resolve(m[1]);
    if (!p) { problems.push([i + 1, "missing file", m[1]]); continue; }
    const src = load(p);
    const n = Number(m[2]);
    if (n > src.length) { problems.push([i + 1, "line past end", m[1] + ":" + n + " (" + src.length + ")"]); continue; }
    if (m[3]) {
      anchored++;
      const anchor = m[3].trim();
      if (!src[n - 1].includes(anchor)) problems.push([i + 1, "anchor not on line", m[1] + ":" + n + " want " + JSON.stringify(anchor.slice(0, 40)) + " got " + JSON.stringify(src[n - 1].slice(0, 60))]);
    }
  }
});
console.log("task/chk line refs:", refs, "anchored:", anchored, "problems:", problems.length);
for (const p of problems) console.log("  tasks.md:" + p[0], p[1], p[2]);

const fs = require("fs");
const PKT = "specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers";
const ADV = ".skilled/skills/system-skill-advisor/runtime";
const spec = fs.readFileSync(PKT + "/spec.md", "utf8").split("\n");
const fixture = JSON.parse(fs.readFileSync(ADV + "/tests/fixtures/deep-loop-offer-cases.json", "utf8"));
const norm = (s) => s.replace(/[\u2018\u2019]/g, "'").replace(/[\u201C\u201D]/g, '"').replace(/\s+/g, " ").trim().toLowerCase();
const prompts = fixture.cases.map((c) => norm(c.prompt));
const inFixture = (p) => prompts.some((f) => f === p || f.includes(p) || p.includes(f) && p.length > 20);

const missing = [];
for (const line of spec) {
  const m = line.match(/^\| (REQ-\d+) \| (.*) \|$/);
  if (!m) continue;
  const [, id, body] = m;
  const quoted = [...body.matchAll(/"([^"]{12,})"/g)].map((x) => x[1]);
  for (const q of quoted) {
    if (!/\s/.test(q)) continue;
    const p = norm(q);
    if (!inFixture(p)) missing.push([id, q]);
  }
}
const byReq = {};
for (const [id, q] of missing) (byReq[id] = byReq[id] || []).push(q);
console.log("requirements with quoted prompts not found in the shared fixture:", Object.keys(byReq).length);
for (const [id, list] of Object.entries(byReq)) {
  console.log(id, "missing", list.length);
  for (const q of list) console.log("   -", q);
}

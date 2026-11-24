const fs = require("fs"), path = require("path");
const PKT = "specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers";
const ADV = ".skilled/skills/system-skill-advisor/runtime";
const fixture = JSON.parse(fs.readFileSync(ADV + "/tests/fixtures/deep-loop-offer-cases.json", "utf8"));
const ids = new Set(fixture.cases.map((c) => c.id));
const ac = fs.readFileSync(PKT + "/acceptance-criteria.md", "utf8").split("\n");
const tasks = fs.readFileSync(PKT + "/tasks.md", "utf8").split("\n");

const documents = [["acceptance-criteria.md", ac], ["tasks.md", tasks]];
const missingRows = [], missingFiles = [];
let rowRefs = 0, fileRefs = 0;
for (const [doc, lines] of documents) {
  lines.forEach((line, i) => {
    for (const m of line.matchAll(/row `([a-z0-9-]{3,})`/g)) {
      rowRefs++;
      if (!ids.has(m[1])) missingRows.push([doc, i + 1, m[1]]);
    }
    for (const m of line.matchAll(/`((?:tests|runtime|lib|handlers|scripts)\/[A-Za-z0-9_./-]+\.(?:ts|cjs|mjs|py|json))`/g)) {
      fileRefs++;
      const candidates = [path.join(ADV, m[1]), m[1]];
      if (!candidates.some((c) => fs.existsSync(c))) missingFiles.push([doc, i + 1, m[1]]);
    }
  });
}
const status = { Met: 0, Unmet: 0, Waived: 0, Superseded: 0 };
for (const l of ac) {
  const m = l.match(/^\| (AC-\d+) \|.*\| (Met|Unmet|Waived|Superseded) \| (ADR-\d+|-)? ?\|$/);
  if (m) status[m[2]]++;
}
const tasksTicked = tasks.filter((l) => /^- \[x\] T/.test(l)).length;
const tasksOpen = tasks.filter((l) => /^- \[ \] T/.test(l)).length;
const chk = tasks.filter((l) => /^- \[.\] CHK/.test(l));
const chkOpen = chk.filter((l) => /^- \[ \] CHK/.test(l));
console.log("fixture row refs:", rowRefs, "missing:", missingRows.length);
for (const m of missingRows) console.log("  row", m[0] + ":" + m[1], m[2]);
console.log("advisor file refs:", fileRefs, "missing:", missingFiles.length);
for (const m of missingFiles) console.log("  file", m[0] + ":" + m[1], m[2]);
console.log("AC statuses:", JSON.stringify(status), "total", Object.values(status).reduce((a, b) => a + b, 0));
console.log("tasks ticked", tasksTicked, "open", tasksOpen, "CHK", chk.length, "CHK open", chkOpen.length);

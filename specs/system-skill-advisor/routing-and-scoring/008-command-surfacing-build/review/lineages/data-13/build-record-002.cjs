const fs = require("fs");
const crypto = require("crypto");
const base = "specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/review/lineages/data-13";
const now = new Date();
const files = [
  ".skilled/skills/system-skill-advisor/graph-metadata.json:96-110",
  ".skilled/skills/system-skill-advisor/manual-testing-playbook/cli-hooks-and-plugin/brief-command-policy-word.md:60-198",
  "specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/040-final-alignment-loop/decision-record.md:30-38",
  "specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/040-final-alignment-loop/scratch/probes.json:79-135",
  ".skilled/skills/system-skill-advisor/runtime/tests/scorer/declared-phrase-specificity.vitest.ts:30-200",
  ".skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:4200-4215",
  ".skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/derive-command-bridges.cjs:1-60",
  ".skilled/skills/system-skill-advisor/runtime/scripts/measure-brief-cost.mjs:20-130",
  ".skilled/skills/system-skill-advisor/runtime/scripts/skill-graph.json",
  ".skilled/skills/system-skill-advisor/manual-testing-playbook/manual-testing-playbook.md:196",
  "specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/review/lineages/data-13/deep-review-findings-registry.json",
  "specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/review/lineages/data-13/deep-review-strategy.md"
];
const findings = [
  {
    id: "F003",
    severity: "P2",
    title: "The declared-phrase contract holds in one scorer and not the other",
    dimension: "maintainability",
    file: ".skilled/skills/system-skill-advisor/runtime/tests/scorer/declared-phrase-specificity.vitest.ts:169",
    evidence: "the arena is clean now returns system-skill-advisor 0.82 natively and no skill in the Python fallback; clean arena seating chart for the stadium puts the advisor first natively and sk-design first in Python.",
    disposition: "active",
    findingClass: "test-coverage",
    scopeProof: "Ran the Python fallback in-process with the committed skill-graph.json signals and no SQLite graph, and compared its top-1 with scoreAdvisorPrompt for the same prompts; the divergence reproduces and the two phrases the test pins do not diverge.",
    affectedSurfaceHints: [
      ".skilled/skills/system-skill-advisor/runtime/tests/scorer/declared-phrase-specificity.vitest.ts",
      ".skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py",
      ".skilled/skills/system-skill-advisor/graph-metadata.json"
    ],
    recommendation: "Add ordinary-sense prompts as cross-scorer fixtures once the phrase-scoring fix lands."
  }
];
const slug = (p) => {
  const h = crypto.createHash("sha1").update(p).digest("hex").slice(0, 6);
  const s = p.replace(/[^a-zA-Z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40);
  return s + "-" + h;
};
const paths = [...new Set(files.map((f) => f.split(":")[0]))];
const nodes = [
  { type: "node", id: "d-security", kind: "DIMENSION", label: "security" },
  { type: "node", id: "d-maintainability", kind: "DIMENSION", label: "maintainability" }
];
const fileId = new Map();
for (const p of paths) {
  const id = "file-" + slug(p);
  fileId.set(p, id);
  nodes.push({ type: "node", id, kind: "FILE", label: p });
}
for (const f of findings) nodes.push({ type: "node", id: "f-" + f.id, kind: "FINDING", label: f.title });
nodes.push({ type: "node", id: "ev-F003", kind: "EVIDENCE", label: ".skilled/skills/system-skill-advisor/runtime/tests/scorer/declared-phrase-specificity.vitest.ts:169-200" });
const edges = [];
let ec = 0;
for (const p of paths) {
  const id = fileId.get(p);
  edges.push({ type: "edge", id: "e-cov-s-" + (++ec), source: "d-security", target: id, relation: "COVERS" });
  edges.push({ type: "edge", id: "e-cov-m-" + (++ec), source: "d-maintainability", target: id, relation: "COVERS" });
}
for (const f of findings) {
  edges.push({ type: "edge", id: "e-in-dim-" + f.id, source: "f-" + f.id, target: "d-maintainability", relation: "IN_DIMENSION" });
  edges.push({ type: "edge", id: "e-in-file-" + f.id, source: "f-" + f.id, target: fileId.get(f.file.split(":")[0]), relation: "IN_FILE" });
  edges.push({ type: "edge", id: "e-ev-" + f.id, source: "ev-" + f.id, target: "f-" + f.id, relation: "EVIDENCE_FOR" });
}
const record = {
  type: "iteration",
  iteration: 2,
  run: 2,
  mode: "review",
  target_agent: "deep-review",
  agent_definition_loaded: true,
  resolved_route: "Resolved route: mode=review target_agent=deep-review",
  status: "complete",
  focus: "security and maintainability - holdout hygiene, playbook instruction surface and cross-scorer phrase specificity",
  dimensions: ["security", "maintainability"],
  filesReviewed: files,
  findingsCount: 1,
  findingsSummary: { P0: 0, P1: 0, P2: 1 },
  findingsNew: { P0: 0, P1: 0, P2: 1 },
  findingDetails: findings,
  traceabilityChecks: {
    results: [
      { protocolId: "skill_agent", status: "pass", gateClass: "soft", applicable: true, evidence: [".skilled/skills/system-skill-advisor/graph-metadata.json:101-107", ".skilled/skills/system-skill-advisor/runtime/scripts/skill-graph.json"], summary: "Author metadata and the compiled graph carry the identical seven strings; the projection exposes the same intentSignals." },
      { protocolId: "agent_cross_runtime", status: "notApplicable", gateClass: "soft", applicable: false, evidence: [], summary: "No agent file is defined in this area; the only runtime-specific artifact is the unchanged Claude hook the CL-009 playbook drives." },
      { protocolId: "playbook_capability", status: "pass", gateClass: "soft", applicable: true, evidence: [".skilled/skills/system-skill-advisor/manual-testing-playbook/cli-hooks-and-plugin/brief-command-policy-word.md:148", ".skilled/skills/system-skill-advisor/manual-testing-playbook/cli-hooks-and-plugin/brief-command-policy-word.md:160-161"], summary: "The rendered parent and child labels match the playbook expected lines." }
    ]
  },
  newFindingsRatio: 0.1429,
  noveltyJustification: "One new P2 against six weighted units already open is 1/7; the iteration adds a cross-scorer coverage finding rather than re-reporting F001.",
  sessionId: "fanout-data-13-1794865302020-qunumz",
  generation: 1,
  lineageMode: "new",
  timestamp: now.toISOString(),
  durationMs: 480000,
  graphEvents: [...nodes, ...edges]
};
fs.writeFileSync(base + "/iter-002.record.json", JSON.stringify(record, null, 1));
fs.writeFileSync(base + "/iter-002.nodes.json", JSON.stringify(nodes.map(({ id, kind, label }) => ({ id, kind, label }))));
fs.writeFileSync(base + "/iter-002.edges.json", JSON.stringify(edges.map(({ id, source, target, relation }) => ({ id, source, target, relation }))));
console.log("record", record.findingsCount, "files", paths.length, "nodes", nodes.length, "edges", edges.length, record.timestamp);

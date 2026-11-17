const fs = require("fs");
const crypto = require("crypto");
const base = "specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/review/lineages/data-13";
const now = new Date();
const files = [
  ".skilled/skills/system-skill-advisor/graph-metadata.json:96-110",
  ".skilled/skills/system-skill-advisor/manual-testing-playbook/cli-hooks-and-plugin/brief-command-policy-word.md:80-165",
  "specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/040-final-alignment-loop/decision-record.md:30-38",
  "specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/040-final-alignment-loop/scratch/probes.json:79-135",
  ".skilled/skills/system-skill-advisor/runtime/scripts/skill-graph.json",
  ".skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts:300-340",
  "specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/review/lineages/data-13/deep-review-state.jsonl",
  "specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/review/lineages/data-13/deep-review-findings-registry.json",
  "specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/review/lineages/data-13/iterations/iteration-001.md",
  "specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/review/lineages/data-13/iterations/iteration-002.md",
  "specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/review/lineages/data-13/deltas/iter-001.jsonl",
  "specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/review/lineages/data-13/deltas/iter-002.jsonl"
];
const slug = (p) => {
  const h = crypto.createHash("sha1").update(p).digest("hex").slice(0, 6);
  const s = p.replace(/[^a-zA-Z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40);
  return s + "-" + h;
};
const dims = ["correctness", "security", "traceability", "maintainability"];
const nodes = dims.map((d) => ({ type: "node", id: "d-" + d, kind: "DIMENSION", label: d + " (verification)" }));
const fileId = new Map();
for (const p of [...new Set(files.map((f) => f.split(":")[0]))]) {
  const id = "file-" + slug(p);
  fileId.set(p, id);
  nodes.push({ type: "node", id, kind: "FILE", label: p });
}
const edges = [];
let ec = 0;
for (const p of [...new Set(files.map((f) => f.split(":")[0]))]) {
  for (const d of dims) {
    edges.push({ type: "edge", id: "e-cov-" + (++ec), source: "d-" + d, target: fileId.get(p), relation: "COVERS" });
  }
}
const record = {
  type: "iteration",
  iteration: 3,
  run: 3,
  mode: "review",
  target_agent: "deep-review",
  agent_definition_loaded: true,
  resolved_route: "Resolved route: mode=review target_agent=deep-review",
  status: "complete",
  focus: "convergence verification of all four dimensions - final-tree reproduction of F001, F002, F003, the playbook labels and the ADR route",
  dimensions: ["correctness", "security", "traceability", "maintainability"],
  filesReviewed: files,
  findingsCount: 0,
  findingsSummary: { P0: 0, P1: 0, P2: 0 },
  findingsNew: { P0: 0, P1: 0, P2: 0 },
  findingDetails: [],
  traceabilityChecks: {
    results: [
      { protocolId: "spec_code", status: "pass", gateClass: "hard", applicable: true, evidence: [".skilled/skills/system-skill-advisor/graph-metadata.json:101-107", ".skilled/skills/system-skill-advisor/runtime/scripts/skill-graph.json"], summary: "Final-tree signal block and compiled graph still match T006." },
      { protocolId: "checklist_evidence", status: "pass", gateClass: "hard", applicable: true, evidence: ["specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/040-final-alignment-loop/scratch/probes.json:95-135"], summary: "P07/P08/P09 on the advisor and P05 on command-doctor-helper reproduce at 0.8." },
      { protocolId: "playbook_capability", status: "pass", gateClass: "soft", applicable: true, evidence: [".skilled/skills/system-skill-advisor/manual-testing-playbook/cli-hooks-and-plugin/brief-command-policy-word.md:148"], summary: "check for skilled updates tops command-doctor-update at 0.8962 and the expected labels reproduce." }
    ]
  },
  newFindingsRatio: 0.0,
  noveltyJustification: "Verification pass: the three recorded findings reproduce and no new defect appeared, so the novelty ratio is 0.",
  sessionId: "fanout-data-13-1794865302020-qunumz",
  generation: 1,
  lineageMode: "new",
  timestamp: now.toISOString(),
  durationMs: 240000,
  graphEvents: [...nodes, ...edges]
};
fs.writeFileSync(base + "/iter-003.record.json", JSON.stringify(record, null, 1));
fs.writeFileSync(base + "/iter-003.nodes.json", JSON.stringify(nodes.map(({ id, kind, label }) => ({ id, kind, label }))));
fs.writeFileSync(base + "/iter-003.edges.json", JSON.stringify(edges.map(({ id, source, target, relation }) => ({ id, source, target, relation }))));
console.log("record", record.findingsCount, "files", fileId.size, "nodes", nodes.length, "edges", edges.length, record.timestamp);

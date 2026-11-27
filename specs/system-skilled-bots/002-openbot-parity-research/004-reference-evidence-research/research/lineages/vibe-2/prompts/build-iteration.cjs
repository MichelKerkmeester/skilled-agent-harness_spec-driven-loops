// Generic per-iteration artifact builder.
// Reads prompts/iter-<NNN>-spec.json and writes:
//   deltas/iter-<NNN>.jsonl   (iteration record + finding rows + frontier proposals)
//   prompts/iter-<NNN>-event.json (the single-record file handed to the gateway)
// Usage: node prompts/build-iteration.cjs <iterationNumber>
const fs = require("fs");
const path = require("path");

const dir = path.resolve(__dirname, "..");
const n = Number(process.argv[2]);
if (!Number.isInteger(n) || n < 1) {
  console.error("usage: build-iteration.cjs <iterationNumber>");
  process.exit(2);
}
const pad = String(n).padStart(3, "0");
const spec = JSON.parse(fs.readFileSync(path.join(dir, "prompts", `iter-${pad}-spec.json`), "utf8"));
const SID = "fanout-vibe-2-1795763950430-ek4gqy";

const findings = spec.findings || [];
const record = {
  type: "iteration",
  iteration: n,
  runId: SID,
  sessionId: SID,
  lineageId: SID,
  mode: "research",
  target_agent: "deep-research",
  agent_definition_loaded: true,
  resolved_route: "Resolved route: mode=research target_agent=deep-research",
  run: n,
  status: spec.status,
  focus: spec.focus,
  findingsCount: findings.length,
  newInfoRatio: spec.newInfoRatio,
  noveltyJustification: spec.noveltyJustification,
  keyQuestions: spec.keyQuestions || [spec.focus],
  answeredQuestions: spec.answeredQuestions || [],
  ruledOut: spec.ruledOut || [],
  focusTrack: spec.focusTrack,
  edgeCase: spec.edgeCase || "none",
  toolsUsed: spec.toolsUsed || ["Read", "Grep", "Bash"],
  sourcesQueried: spec.sourcesQueried || [],
  graphEvents: spec.graphEvents || [],
};

const lines = [JSON.stringify(record)];
for (const f of findings) {
  lines.push(JSON.stringify({ type: "finding", id: f.id, label: f.label, iteration: n, sources: f.sources }));
}
for (const p of spec.proposals || []) {
  lines.push(JSON.stringify({ type: "frontier_proposal", parentId: p.parentId, question: p.question, scope: p.scope, evidence: p.evidence }));
}

fs.writeFileSync(path.join(dir, "deltas", `iter-${pad}.jsonl`), lines.join("\n") + "\n");
fs.writeFileSync(path.join(dir, "prompts", `iter-${pad}-event.json`), JSON.stringify(record) + "\n");
console.log(`iter-${pad}: findings=${findings.length} proposals=${(spec.proposals || []).length} deltaLines=${lines.length}`);

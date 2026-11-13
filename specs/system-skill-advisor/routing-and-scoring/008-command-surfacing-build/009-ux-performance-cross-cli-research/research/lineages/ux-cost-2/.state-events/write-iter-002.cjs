const fs = require("fs");
const path = require("path");

const L = process.argv[2];
const sid = "fanout-ux-cost-2-1794539443568-6stapj";
const now = new Date();
const ts = now.toISOString();
const start = Date.parse("2026-11-13T03:23:20.000Z");
const dur = Math.max(0, now.getTime() - start);

const kq = [
  "KQ1: Which words in the delivered brief and its policy definition reach the model, and which reach only AGENTS.md?",
  "KQ2: What does the brief cost per prompt after phase 005, and which repeated bytes can move to once per session?",
  "KQ3: What must an external repository install do so a plain request gets an offered command with a usable policy?",
  "KQ4: Should the semantic embedder be kept warm, and at what memory and latency cost against the 750 ms deadline?",
  "KQ5: Which ranked changes raise started-when-useful per unit of risk without lowering any floor?",
];

const record = {
  type: "iteration",
  iteration: 2,
  run: 2,
  runId: sid,
  sessionId: sid,
  lineageId: sid,
  mode: "research",
  target_agent: "deep-research",
  agent_definition_loaded: true,
  resolved_route: "Resolved route: mode=research target_agent=deep-research",
  status: "complete",
  focus: "KQ3: the external-repository install path, the two instruction-file shapes, and the install's final status against measured brief delivery",
  findingsCount: 7,
  newInfoRatio: 0.72,
  noveltyJustification: "4 of 7 findings are fully new (the asymmetric check, the green-zero setup, the two measured install shapes and their match), and 3 combine existing files into a repair path.",
  keyQuestions: kq,
  answeredQuestions: [kq[2]],
  ruledOut: [
    "Write the operator's global ~/.claude/CLAUDE.md",
    "Keep a full CLAUDE.md copy from embed",
    "Leave the Codex signal to /doctor:runtime-mirrors",
  ],
  focusTrack: "install-setup",
  edgeCase: "ambiguous-input",
  toolsUsed: ["Read", "Grep", "Bash"],
  sourcesQueried: [
    "INSTALL-SKILLED.md",
    ".skilled/commands/doctor/assets/doctor-agents-md-embed.yaml",
    ".skilled/commands/doctor/assets/agents-md-manifest.json",
    ".skilled/commands/doctor/assets/symlink-manifest.json",
    ".skilled/commands/doctor/assets/doctor-setup.yaml",
    ".skilled/commands/doctor/assets/doctor-runtime-mirrors.yaml",
    ".skilled/commands/doctor/assets/doctor-symlink-check.yaml",
    ".skilled/commands/doctor/scripts/agents-md-check.cjs",
    ".skilled/commands/doctor/scripts/codex-hook-approval-check.cjs",
    "specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/goal.md",
  ],
  timestamp: ts,
  durationMs: dur,
  executor: {
    kind: "cli-opencode",
    model: "opencode-go/deepseek-v4.1-flash",
    reasoningEffort: "max",
    sandboxMode: "danger-full-access",
  },
  graphEvents: [],
};

const findings = [
  {
    id: "f-iter002-001",
    label: "The install's link shape creates a CLAUDE.md symlink while the embed shape removes a project CLAUDE.md, so the two choices leave Claude Code with opposite instruction-file states.",
    sources: [".skilled/commands/doctor/assets/symlink-manifest.json", ".skilled/commands/doctor/assets/doctor-agents-md-embed.yaml"],
  },
  {
    id: "f-iter002-002",
    label: "The agents-md check names a claude-only state for CLAUDE.md without AGENTS.md but has no state for the reverse, and A10 accepts an absent CLAUDE.md, so an embed install passes with no Claude instruction file.",
    sources: [".skilled/commands/doctor/scripts/agents-md-check.cjs", ".skilled/commands/doctor/assets/agents-md-manifest.json"],
  },
  {
    id: "f-iter002-003",
    label: "The install's final /doctor:setup runs six component legs and none reports brief delivery or hook approval; the Codex approval check runs only under /doctor:runtime-mirrors and hook wiring only under /doctor:symlink check.",
    sources: [".skilled/commands/doctor/assets/doctor-setup.yaml", ".skilled/commands/doctor/assets/doctor-runtime-mirrors.yaml", ".skilled/commands/doctor/assets/doctor-symlink-check.yaml"],
  },
  {
    id: "f-iter002-004",
    label: "The measured after arm lands on those shapes: Codex delivered 0 of 24 briefs and Claude 0 of 24 Gate 2 bullets, so two of six runtimes finish a successful install with either no brief or no policy definition.",
    sources: ["specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/goal.md"],
  },
  {
    id: "f-iter002-005",
    label: "A one-line @AGENTS.md pointer satisfies both readings of Claude instruction loading, costs 12 bytes, cannot double-load, and the manifest already lists pointer as an expected CLAUDE.md state.",
    sources: [".skilled/commands/doctor/assets/agents-md-manifest.json"],
  },
  {
    id: "f-iter002-006",
    label: "The install guide never says that embed removes CLAUDE.md or that Claude depends on it, so the person cannot see the runtime-specific cost of the choice.",
    sources: ["INSTALL-SKILLED.md"],
  },
  {
    id: "f-iter002-007",
    label: "Both repairs are display and file-authoring only: one pointer at embed time, one check row, and one setup line that calls the two existing read-only checks.",
    sources: [".skilled/commands/doctor/assets/doctor-agents-md-embed.yaml", ".skilled/commands/doctor/assets/doctor-setup.yaml"],
  },
];

const deltaLines = [
  record,
  ...findings.map((f) => ({ type: "finding", id: f.id, label: f.label, iteration: 2, sources: f.sources })),
];

fs.writeFileSync(path.join(L, "deltas", "iter-002.jsonl"), deltaLines.map((l) => JSON.stringify(l)).join("\n") + "\n");
fs.writeFileSync(path.join(L, ".state-events", "iter-002.json"), JSON.stringify(record));
console.log(JSON.stringify({ timestamp: ts, durationMs: dur, findings: findings.length }));

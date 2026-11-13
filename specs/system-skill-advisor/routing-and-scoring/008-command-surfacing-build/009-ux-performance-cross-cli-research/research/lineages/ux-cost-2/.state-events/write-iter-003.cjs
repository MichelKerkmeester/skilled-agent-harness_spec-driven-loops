const fs = require("fs");
const path = require("path");

const L = process.argv[2];
const sid = "fanout-ux-cost-2-1794539443568-6stapj";
const now = new Date();
const ts = now.toISOString();
const start = Date.parse("2026-11-13T03:24:35.000Z");
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
  iteration: 3,
  run: 3,
  runId: sid,
  sessionId: sid,
  lineageId: sid,
  mode: "research",
  target_agent: "deep-research",
  agent_definition_loaded: true,
  resolved_route: "Resolved route: mode=research target_agent=deep-research",
  status: "complete",
  focus: "KQ4 and KQ5: the embedder cold start and keep-alive decision, and the five-item ranking by expected gain per unit of risk",
  findingsCount: 11,
  newInfoRatio: 0.6,
  noveltyJustification: "3 of 11 findings are fully new measurements (the request payload, the abandon-then-warm race, the setup disclosure gap), 6 are partial, and 2 synthesize the ranking.",
  keyQuestions: kq,
  answeredQuestions: [kq[3], kq[4]],
  ruledOut: [
    "Extend keep_alive to hold the model all day",
    "Add a policy gloss to every brief head",
    "Remove the confidence/uncertainty pair",
    "Treat the cold daemon measurement as the embedder decision",
  ],
  focusTrack: "embedder-cost",
  edgeCase: "missing-dependency",
  toolsUsed: ["Read", "Grep", "Bash"],
  sourcesQueried: [
    ".skilled/skills/system-spec-kit/shared/embeddings/adapters/ollama.ts",
    ".skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/semantic-shadow.ts",
    ".skilled/skills/system-skill-advisor/runtime/scripts/measure-embedder-cost.mjs",
    ".skilled/commands/doctor/assets/doctor-skill-advisor-embedder.yaml",
    ".skilled/commands/doctor/assets/doctor-setup.yaml",
    ".skilled/commands/doctor/assets/doctor-runtime-mirrors.yaml",
    ".skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts",
    "AGENTS.md",
    "specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/008-embedder-setup-and-cost/scratch/measured-2026-11-12.txt",
    "specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/goal.md",
    "specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/010-reachability-and-attribution/implementation-summary.md",
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
    id: "f-iter003-001",
    label: "The embed request sends only model and input with no keep_alive, so the model's warmth is Ollama's default idle timer, not a session-scoped keep-alive.",
    sources: [".skilled/skills/system-spec-kit/shared/embeddings/adapters/ollama.ts", "specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/008-embedder-setup-and-cost/scratch/measured-2026-11-12.txt"],
  },
  {
    id: "f-iter003-002",
    label: "The cold first call is 538.53 ms against a 750 ms deadline versus 6.57 ms warm median, so it fits the deadline and costs latency on one prompt rather than losing the lane.",
    sources: [".skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/semantic-shadow.ts", "specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/008-embedder-setup-and-cost/scratch/measured-2026-11-12.txt"],
  },
  {
    id: "f-iter003-003",
    label: "The race abandons the embedding at 750 ms while the adapter request continues to 5000 ms, so an over-deadline cold load still warms the server for the next prompt and only one prompt per idle window degrades.",
    sources: [".skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/semantic-shadow.ts", ".skilled/skills/system-spec-kit/shared/embeddings/adapters/ollama.ts"],
  },
  {
    id: "f-iter003-004",
    label: "That one prompt is worth five tune rows (14 of 45 real-embedding against 9 of 45 phrase-only) and the memory bill is 261.6 MiB on disk and 320.2 MiB loaded in api/ps.",
    sources: ["specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/008-embedder-setup-and-cost/scratch/measured-2026-11-12.txt", "specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/goal.md"],
  },
  {
    id: "f-iter003-005",
    label: "The embedder setup plan discloses the disk size and warm per-prompt cost but not the loaded footprint or the cold first call.",
    sources: [".skilled/commands/doctor/assets/doctor-skill-advisor-embedder.yaml"],
  },
  {
    id: "f-iter003-006",
    label: "Extending keep_alive is declined: it saves one 538 ms call per idle window while holding about 320 MB resident, and the measured cold call already fits the deadline.",
    sources: ["specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/008-embedder-setup-and-cost/scratch/measured-2026-11-12.txt"],
  },
  {
    id: "f-iter003-007",
    label: "Rank 1: leave a Claude instruction pointer on the embed install (agents-md-embed.cjs, agents-md-check.cjs, INSTALL-SKILLED.md), so the Gate 2 policy definition reaches Claude on the branch where the after arm delivered it 0 of 24 times; low risk, A10 already accepts pointer.",
    sources: [".skilled/commands/doctor/assets/agents-md-manifest.json", ".skilled/commands/doctor/assets/doctor-agents-md-embed.yaml"],
  },
  {
    id: "f-iter003-008",
    label: "Rank 2: make /doctor:setup report brief delivery per installed runtime (doctor-setup.yaml, presentation, the two existing read-only checks), so a fresh Codex install stops printing STATUS=OK with 0 of 24 briefs; low risk.",
    sources: [".skilled/commands/doctor/assets/doctor-setup.yaml", ".skilled/commands/doctor/assets/doctor-runtime-mirrors.yaml"],
  },
  {
    id: "f-iter003-009",
    label: "Rank 3: label a deferring hub as needing a mode (command-attach.ts, render.ts, golden heads) instead of showing a bare skill, targeting the deep-review row where pi and opencode improvise and devin loops without init; medium risk.",
    sources: ["specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/goal.md", ".skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts"],
  },
  {
    id: "f-iter003-010",
    label: "Rank 4: add one Gate 2 clause for a brief that names a skill but no command (AGENTS.md, manifest pin, Cursor rule), covering the 11 of 16 plain tune rows with no offer; medium risk because the bullet is operator-approved and only 292 bytes are free.",
    sources: ["AGENTS.md", "specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/006-gate-2-binding-and-runtime-pointers/implementation-summary.md"],
  },
  {
    id: "f-iter003-011",
    label: "Rank 5: warm the embedder once at session start under the 750 ms bound instead of holding it warm all day, protecting the first prompt's semantic lane; medium risk because it reuses the SessionStart mechanism the daemon warm-up declined.",
    sources: ["specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/010-reachability-and-attribution/implementation-summary.md", ".skilled/skills/system-skill-advisor/runtime/scripts/measure-embedder-cost.mjs"],
  },
];

const deltaLines = [
  record,
  ...findings.map((f) => ({ type: "finding", id: f.id, label: f.label, iteration: 3, sources: f.sources })),
];

fs.writeFileSync(path.join(L, "deltas", "iter-003.jsonl"), deltaLines.map((l) => JSON.stringify(l)).join("\n") + "\n");
fs.writeFileSync(path.join(L, ".state-events", "iter-003.json"), JSON.stringify(record));
console.log(JSON.stringify({ timestamp: ts, durationMs: dur, findings: findings.length }));

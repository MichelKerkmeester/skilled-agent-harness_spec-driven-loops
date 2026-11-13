const fs = require("fs");
const path = require("path");

const L = process.argv[2];
const sid = "fanout-ux-cost-2-1794539443568-6stapj";
const now = new Date();
const ts = now.toISOString();
const start = Date.parse("2026-11-13T03:18:00.000Z");
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
  iteration: 1,
  run: 1,
  runId: sid,
  sessionId: sid,
  lineageId: sid,
  mode: "research",
  target_agent: "deep-research",
  agent_definition_loaded: true,
  resolved_route: "Resolved route: mode=research target_agent=deep-research",
  status: "complete",
  focus: "KQ1 and KQ2: the brief words and bytes, where the run/start/ask definition lives, and what the constant block costs per prompt",
  findingsCount: 8,
  newInfoRatio: 0.62,
  noveltyJustification: "2 of 8 findings are fully new (the emitted-bytes asymmetry and the Claude instruction-file state), 4 are partially new measurements and 2 correct segment-one readings.",
  keyQuestions: kq,
  answeredQuestions: [kq[0], kq[1]],
  ruledOut: [
    "Trim the comment-hygiene directive",
    "Emit the route-only brief after first delivery",
    "Replace the confidence/uncertainty pair with prose",
  ],
  focusTrack: "ux-cost",
  edgeCase: "contradictory-evidence",
  toolsUsed: ["Read", "Grep", "Bash"],
  sourcesQueried: [
    ".skilled/skills/system-skill-advisor/runtime/lib/render.ts",
    ".skilled/skills/system-skill-advisor/runtime/lib/policy-plan.ts",
    ".skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts",
    "AGENTS.md",
    ".skilled/commands/doctor/assets/agents-md-manifest.json",
    "~/.claude/CLAUDE.md",
    "specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/goal.md",
    "specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/research.md",
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
    id: "f-iter001-001",
    label: "The delivered brief is 285-327 bytes per prompt (median 298): a 67-109 byte head plus a 218-byte constant block that is 73% of the median brief.",
    sources: [
      ".skilled/skills/system-skill-advisor/runtime/lib/render.ts",
      ".skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts",
    ],
  },
  {
    id: "f-iter001-002",
    label: "The constant directive block is appended to every brief; the route-only plan that would shrink it to 43 bytes is measurement-only and never emitted.",
    sources: [".skilled/skills/system-skill-advisor/runtime/lib/render.ts"],
  },
  {
    id: "f-iter001-003",
    label: "Segment one's claim that the directive is suppressed after the first message contradicts the renderer, which appends it to every returned brief.",
    sources: [
      "specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/research.md",
      ".skilled/skills/system-skill-advisor/runtime/lib/render.ts",
    ],
  },
  {
    id: "f-iter001-004",
    label: "The head names run/start/ask but never defines them; the only definition is the 463-byte Gate 2 bullet, which the brief does not carry.",
    sources: ["AGENTS.md", ".skilled/skills/system-skill-advisor/runtime/lib/render.ts"],
  },
  {
    id: "f-iter001-005",
    label: "This worktree has no project CLAUDE.md and the global ~/.claude/CLAUDE.md symlinks to the main checkout's AGENTS.md, so the after-arm Claude rows never received the Gate 2 bullet.",
    sources: [
      "specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/goal.md",
      "~/.claude/CLAUDE.md",
    ],
  },
  {
    id: "f-iter001-006",
    label: "The agents-md manifest says Claude reads the root document directly while the measured after arm shows AGENTS.md alone did not reach Claude; a one-line pointer satisfies both readings.",
    sources: [
      ".skilled/commands/doctor/assets/agents-md-manifest.json",
      "specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/goal.md",
    ],
  },
  {
    id: "f-iter001-007",
    label: "Head room is 107 of 320 characters at the longest row; a 40-byte addition costs 13% of the median brief and a 110-byte clause costs 37%.",
    sources: [
      ".skilled/skills/system-skill-advisor/runtime/lib/render.ts",
      ".skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts",
    ],
  },
  {
    id: "f-iter001-008",
    label: "The two score numbers in the head cost about 14 bytes per prompt and have no reader inside the brief.",
    sources: [".skilled/skills/system-skill-advisor/runtime/lib/render.ts"],
  },
];

const deltaLines = [
  record,
  ...findings.map((f) => ({ type: "finding", id: f.id, label: f.label, iteration: 1, sources: f.sources })),
];

fs.writeFileSync(path.join(L, "deltas", "iter-001.jsonl"), deltaLines.map((l) => JSON.stringify(l)).join("\n") + "\n");
fs.writeFileSync(path.join(L, ".state-events", "iter-001.json"), JSON.stringify(record));
console.log(JSON.stringify({ timestamp: ts, durationMs: dur, findings: findings.length }));

const fs = require("fs");
const dir = "specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/lineages/performance";
const S = "fanout-performance-1794523629654-v541y3";
const ts = new Date().toISOString();
const graphEvents = [
  { type: "node", id: "q-tokens", kind: "QUESTION", label: "Token cost of command surfacing" },
  { type: "node", id: "c-brief-small", kind: "CLAIM", label: "The brief is 64 to 71 tokens" },
  { type: "node", id: "c-doc-read-dominates", kind: "CLAIM", label: "A started command read costs about 1,131 tokens median" },
  { type: "node", id: "f-ask-turn", kind: "FINDING", label: "The ask policy adds one model turn" },
  { type: "edge", id: "e-005", source: "c-brief-small", target: "q-tokens", relation: "ANSWERS" },
  { type: "edge", id: "e-006", source: "c-doc-read-dominates", target: "c-brief-small", relation: "CONTRADICTS" },
  { type: "edge", id: "e-007", source: "f-ask-turn", target: "q-tokens", relation: "SUPPORTS" },
];
const rec = {
  type: "iteration",
  iteration: 3,
  mode: "research",
  run: 3,
  target_agent: "deep-research",
  agent_definition_loaded: true,
  resolved_route: "Resolved route: mode=research target_agent=deep-research",
  runId: S,
  sessionId: S,
  lineageId: S,
  status: "complete",
  focus: "Token cost of the brief, the command read and the ask turn",
  findingsCount: 6,
  newInfoRatio: 0.90,
  noveltyJustification: "5 of 6 findings are newly measured and 1 is a synthesis that reverses the assumed optimization target.",
  keyQuestions: ["What does command surfacing cost in tokens per prompt, per session and per started command, and where is the largest avoidable cost?"],
  answeredQuestions: ["What does command surfacing cost in tokens per prompt, per session and per started command, and where is the largest avoidable cost?"],
  ruledOut: ["Trim the brief head or directive block as a token saving", "A per-prompt token budget mechanism", "Cache rendered briefs to save tokens", "Follow the p95-tail pointer again"],
  focusTrack: "performance",
  edgeCase: "ambiguous-input",
  toolsUsed: ["Read", "Grep", "Bash"],
  sourcesQueried: [
    ".skilled/skills/system-skill-advisor/runtime/lib/render.ts:100,162,557",
    ".skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts:373-427",
    "specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/005-recommendation-contract-and-brief/plan.md:67-79",
    "specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/006-gate-2-binding-and-runtime-pointers/spec.md:94",
    "Command output: 44 command docs median 4524 B p95 12573 B max 13682 B",
  ],
  timestamp: ts,
  durationMs: 420000,
  graphEvents,
};
const rows = [
  { type: "finding", id: "f-iter003-001", label: "The shipped renderer produces a 257-character brief: a 41-character head plus a 216-character directive block, 64 tokens at 4 chars per token and 84% of it constant.", iteration: 3, sources: [".skilled/skills/system-skill-advisor/runtime/lib/render.ts:100", ".skilled/skills/system-skill-advisor/runtime/lib/render.ts:162", ".skilled/skills/system-skill-advisor/runtime/lib/render.ts:557"] },
  { type: "finding", id: "f-iter003-002", label: "Phase 005's command head grows a brief from 64 to 71 tokens, and a 40-prompt session from about 466 to about 734 tokens, a 268-token delta or 0.37% of a 200k context.", iteration: 3, sources: ["specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/005-recommendation-contract-and-brief/plan.md:71", ".skilled/skills/system-skill-advisor/runtime/lib/render.ts:557"] },
  { type: "finding", id: "f-iter003-003", label: "One started command costs about 1,131 tokens at the median document size, 3,143 at p95 and 3,421 at the maximum, so three starts cost 4.6 times a whole session's brief.", iteration: 3, sources: [".skilled/commands/deep/research.md:1", ".skilled/commands/speckit/handoff.md:1", ".skilled/commands/doctor/overlay.md:1", ".skilled/commands/speckit/save.md:1"] },
  { type: "finding", id: "f-iter003-004", label: "The 84% directive-block saving is already built by the lifecycle dedup, which delivers the full brief on the first message and after a boundary, then keeps the head only.", iteration: 3, sources: [".skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts:373", ".skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts:397"] },
  { type: "finding", id: "f-iter003-005", label: "The policy mix is 20 start, 17 ask and 7 run, and an ask costs one extra model turn; phase 007 counts COMMAND states but not turns, so that cost stays invisible.", iteration: 3, sources: ["specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/006-gate-2-binding-and-runtime-pointers/spec.md:94", "specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/007-per-runtime-behaviour-proof/plan.md:68"] },
  { type: "finding", id: "f-iter003-006", label: "Token cost is not a performance problem here: the brief is 64 to 71 tokens, the dedup already removes 84% of it, and the command read dominates at about 1,131 tokens, so the only guard worth building is visibility of the read cost.", iteration: 3, sources: [".skilled/skills/system-skill-advisor/runtime/lib/render.ts:557", ".skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts:373"] },
  { type: "ruled_out", id: "ro-iter003-001", direction: "Trim the brief head or directive block as a token saving", reason: "The ceiling is 54 tokens per session because the block is already suppressed on repeats.", iteration: 3 },
  { type: "ruled_out", id: "ro-iter003-002", direction: "A per-prompt token budget mechanism", reason: "The 80-token cap binds and the measured brief is 64 tokens.", iteration: 3 },
  { type: "ruled_out", id: "ro-iter003-003", direction: "Cache rendered briefs to save tokens", reason: "Rendering is sub-millisecond and tokens are charged for context, not render time.", iteration: 3 },
  { type: "ruled_out", id: "ro-iter003-004", direction: "Follow the p95-tail pointer again", reason: "Iteration 2 answered it with a bounded variance claim.", iteration: 3 },
];
fs.writeFileSync(`${dir}/.gateway-events/iteration-003.json`, JSON.stringify(rec));
fs.writeFileSync(`${dir}/deltas/iter-003.jsonl`, `${[rec, ...rows].map((r) => JSON.stringify(r)).join("\n")}\n`);
console.log("wrote", ts);

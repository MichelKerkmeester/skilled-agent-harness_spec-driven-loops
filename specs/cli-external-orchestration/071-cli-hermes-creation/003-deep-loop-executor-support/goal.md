---
title: "Goal: cli-hermes as the seventh executor kind"
description: "The durable directive this phase executes against and the criteria that decide when it is done."
trigger_phrases:
  - "packet goal"
  - "durable directive"
  - "completion criteria"
  - "goal binding"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/071-cli-hermes-creation/003-deep-loop-executor-support"
    last_updated_at: "2026-09-14T19:40:00Z"
    last_updated_by: "claude-fable-5-1"
    recent_action: "Executor kind, builder, roster, audit maps and tests shipped; gates green"
    next_safe_action: "Run one live cli-hermes lineage once phase 002 configures the provider"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-071-003-deep-loop-executor-support"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: cli-hermes as the seventh executor kind

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** `/deep:research` and `/deep:review` fan-outs can run a `cli-hermes` lineage, and
an unavailable binary or an off-roster model is refused before any spawn.

### Decisions

Frozen choices for this phase. The parent goal's decisions bind here too; changing one of those is
an amendment to the packet root `goal.md`.

| ID | Decision |
|----|----------|
| P1 | `EXECUTOR_KINDS` gains `cli-hermes`; flag support is `model`, `reasoningEffort`, `configDir`, `timeoutSeconds`, `liveTools`, and no `sandboxMode`; the preventive-sandbox map records `false` |
| P2 | `buildHermesLineageCommand` emits the parent's D4 shape: `--query-file` prompt, `--yolo`, `--ignore-rules`, `--run-budget` below `timeoutSeconds`, `--max-turns`, an explicit `-t` list without `delegation` and `memory`, `--source tool`, `--in <repo>`, stdin closed; never `--worktree`, never `-z` |
| P3 | `HERMES_SUPPORTED_MODELS` starts with the two gateway ids and is enforced in `executor-config.ts` and byte-mirrored in `fanout-run.cjs`, as `PI_SUPPORTED_MODELS` is |
| P4 | State env `SPECKIT_HERMES_STATE_DIR` and `HERMES_HOME`; default home `.hermes`; env prefix `HERMES_` plus the gateway prefix; `cli-hermes` is not added to `SELF_PRESENCE_EXEMPT_KINDS`; self-invocation marker `HERMES_AGENT` |
| P5 | `dispatch-audit.mjs` gains a `hermes chat` row; `combo-matrix.vitest.ts` gains the kind; code routes through `sk-code` |

### Completion criteria

1. Typecheck and the deep-loop unit suites pass with the seventh kind, output recorded.
2. A unit test proves the builder refuses an off-roster model and a missing `hermes` binary before spawn.
3. A dry-run of the builder prints the exact command line and it matches the parent's D4 shape.
4. A live one-iteration `cli-hermes` research lineage completes on a scratch spec folder with its iteration file, delta and state record on disk.

### Operator copy

The operator holds the parent directive as the session objective. A change here that alters a
parent decision or criterion is an amendment to the parent: apply it there and resend that file.
<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:binding -->
## 2. BINDING

| Surface | Bound to |
|---------|----------|
| Phase spec | `spec.md` |
| Closure gate | `acceptance-criteria.md` |

The parent directive in the packet root `goal.md` binds above this file. Evidence:
`../001-deep-research/research/research.md` angle 8 and section 4 row R2; the live contract from
phase 002.
<!-- /ANCHOR:binding -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] Typecheck and unit suites pass with the seventh kind
- [x] Off-roster model and missing binary refused before spawn, proven by tests
- [x] Builder dry-run matches the D4 shape
- [x] One live `cli-hermes` research iteration lands its artifacts
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Executor tables, builder, roster, audit maps | Done | `executor-config.ts`, `executor-audit.ts`, `fanout-run.cjs`; typecheck exit 0 |
| Unit and integrity tests | Done | 318 passed, 1 skipped across five files, exit 0; Hermes adapter 8 of 8 |
| Dispatch audit and rule checks | Done | hook vitest 108 of 108; node test 11 of 11 |
| Live lineage under `research/` | Done | Live 2026-09-14: `fanout-run.cjs` lineage `hermes-proof` (`deepseek-v4.1-flash`, `--reasoning max`, 1 iteration) fulfilled, exit 0, 1042 s; `research.md` (91 lines, correct answer: eight ids, `stdin-redirect-required` exercised by construction), `deltas/iter-001.jsonl` (9 findings), `deep-research-state.jsonl` (`synthesis_complete`), `iterations/iteration-001.md`; containment clean; metadata refreshed by the runner |
| Toolset rosters corrected on evidence | Done | Hermes's `search` toolset is web search only and `read_file` lives in `file`, so a read-only leaf had no file access and a template dispatch looped on a deferred tool and returned empty stdout. `HERMES_LEAF_TOOLSETS` is now `terminal,file,skills,todo` (+`web` per policy) and `HERMES_READ_ONLY_TOOLSETS` is `file,todo` (+`web`); the runner sets `SPECKIT_HERMES_READ_ONLY=1` on a read-only lineage and `HERMES_SPEC_FOLDER` on every Hermes lineage for the repo plugin; tests updated across the unit, stress, council and benchmark suites |
| MCP servers per lineage | Done | `liveTools.mcpServers` (config type, schema, `EXECUTOR_MCP_SERVER_CAPABILITY`, `assertExecutorMcpServerCapability` in `executor-config.ts`; `hermesToolsetsFor` appends the names in `fanout-run.cjs`); only `cli-hermes` accepts a non-empty list; reserved names refused; 3 config tests and 1 builder test added, 102 and 247 passing |
| Council and benchmark seats | Done | `cli-hermes` accepted by the council resolver (`orchestrate-session.cjs`, stdin-fed seat) and the benchmark dispatcher (`dispatch-model.cjs`, `profile-validator.cjs`); tests 19 and 19 passing |
| Stress adapter subject | Done | `cli-hermes.vitest.ts`, `hermes-shim.cjs`, fixture and suite branches, phase-two matrix row; 14 hermetic cells implemented |
| Pace finding | Done | Thirteen gateway calls at 65k to 90k tokens each ran 13 s to 130 s; Hermes injected its `--run-budget` wrap-up notice at 537 s and the model kept working until 1042 s. The runner's lineage ceiling is twice `iterations × timeoutSeconds` (1200 s here), so the leaf finished inside its bound; the runner's `stall_detected` warning fired at 300 s of lineage silence. Give a `cli-hermes` research iteration `timeoutSeconds` 900 or more so the in-agent wrap-up, not the ceiling, ends a slow turn |

### Deviations and findings

| Item | Note |
|------|------|
| Started before phase 002's smoke | Recorded in the parent log. Every argv claim is test-asserted against the source-read contract; the live lineage is the one criterion left open. |
| `--in` omitted from the builder | The runner spawns in the repo root, so the flag would be a no-op; the packet's manual shape keeps it. Deviation from the parent's D3 literal, not from its intent. |
| `configDir` left unsupported | A relocated `HERMES_HOME` drops every credential; per-lineage profiles wait for a seeded-credential contract. |
| Kinds and registry are coupled by a test | The cli-codex manifest-integrity test asserts executor kinds minus native equal the hub's workflow modes, so phase 004's registration shipped in the same change set. |
<!-- /ANCHOR:log -->

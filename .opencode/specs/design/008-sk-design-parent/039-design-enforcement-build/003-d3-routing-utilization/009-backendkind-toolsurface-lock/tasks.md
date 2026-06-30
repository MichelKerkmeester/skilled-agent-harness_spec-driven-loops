---
title: "Tasks: backendKind→toolSurface lock"
description: "Ordered implementer items to declare a per-mode toolSurface in mode-registry.json (derived from backendKind) and add an additive fail-closed toolSurface lane to score-skill-benchmark.cjs, with verification including the synthetic forbidden-tool acceptance and the no-op control."
trigger_phrases:
  - "d3-r9 toolsurface tasks"
  - "backendkind tool surface lock tasks"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/039-design-enforcement-build/003-d3-routing-utilization/009-backendkind-toolsurface-lock"
    last_updated_at: "2026-06-28T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Mark all toolSurface build and verification tasks complete with evidence"
    next_safe_action: "Let the parent process refresh description.json and graph-metadata.json"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/mode-registry.json"
      - ".opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-agent-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: backendKind→toolSurface lock

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path) [effort]`

Edits land in exactly two files:
- `.opencode/skills/sk-design/mode-registry.json` (the `toolSurface` declaration home)
- `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs` (the gate)

<!-- /ANCHOR:notation -->
---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

### Declare toolSurface (home file, no scorer behavior change)
- [x] T001 Read both target files fully and confirm the no-regression channel for a live-routed scenario and a no-`toolSurface` run [15m] — `hubRoute` channel re-confirmed 13 pass / 5 known-gap / 0 regression; the no-op guarantee covers no-`toolSurface`/no-`toolCalls`
  - **Verify**: the no-regression reference is the `hubRoute` channel (13/5/0) plus the lane's `applicable:false` no-op branch
- [x] T002 Add a `toolSurface` block to each of the four `reference-base` modes (`interface`, `foundations`, `motion`, `audit`): `allowed:[Read,Glob,Grep]`, `forbidden:[Write,Edit,Bash]`, `mutatesWorkspace:false`, `bashAllowlist:[]` (`mode-registry.json`) [15m] — all four blocks present
  - **Verify**: each reference-base mode carries the read-only surface; `JSON.parse` succeeds
- [x] T003 Add the `toolSurface` block to `md-generator` (`playwright-extract`): `allowed:[…,Write,Edit,Bash]`, `forbidden:[]`, `mutatesWorkspace:true`, `bashAllowlist:[…]` (`mode-registry.json`) [15m] — block present; `bashAllowlist` shipped as `[]` (enumeration DEFERRED — implementation-summary §3)
  - **Verify**: `md-generator` is the only mutating surface; the pipeline-binary `bashAllowlist` enumeration is an explicit follow-on
- [x] T004 Confirm the derivation invariant holds for all five modes: `reference-base ⇒ read-only/non-mutating/empty-allowlist`, `playwright-extract ⇒ mutating` (`mode-registry.json`) [5m] — confirmed; each `toolSurface` matches its `backendKind`
  - **Verify**: every `toolSurface` is consistent with its mode's `backendKind`; no drift

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Comparator helper
- [x] T005 Add `scoreToolSurface({ toolSurface, toolCalls })` implementing the strict-precedence algorithm: not-applicable → backend-tool-policy → backend-kind-mismatch → bash-allowlist; return `{ applicable, pass, firstFailingStage, violations }` (`score-skill-benchmark.cjs`) [45m] — present with the documented precedence
  - **Verify**: forbidden tool → `backend-tool-policy`; non-mutating mode + mutating tool → `backend-kind-mismatch`; off-allowlist Bash → `bash-allowlist`
- [x] T006 Normalize tool-name case inside the comparator (declared `Write` matches observed `write`) and retain each Bash call's `input` for the allowlist sub-check (`score-skill-benchmark.cjs`) [15m] — `normalizeToolName` + `commandTextFromInput`/`bashCommandAllowed`
  - **Verify**: a `Write`/`write` round-trip matches; the Bash sub-check reads the command from the retained `input`
- [x] T007 Ensure the not-applicable branch (no `toolSurface` OR null/empty `toolCalls`) returns `{ applicable:false, pass:true }` — the no-op guarantee (`score-skill-benchmark.cjs`) [10m] — verified
  - **Verify**: a no-`toolSurface` surface and a router-replay run (no `toolCalls`) both return `{ applicable:false, pass:true }`
- [x] T008 Make the `bash-allowlist` sub-check degrade gracefully: when a Bash call carries no command text, skip that call's allowlist check and record it as a measured note — never throw (`score-skill-benchmark.cjs`) [10m] — `skippedBashAllowlistChecks`
  - **Verify**: a Bash call with empty `input` does not crash and does not falsely fail

### Wiring
- [x] T009 Surface a generic `toolSurface` passthrough onto `expected` in `expectedFromScenario` so the scorer stays skill-agnostic (`score-skill-benchmark.cjs`) [10m] — `copyIfPresent(out, scenarioExpected, 'toolSurface')`; WIRING FIX: `resolveToolSurface`/`toolSurfaceFromRegistry` added on top so the routed mode's surface auto-resolves from `<skillRoot>/mode-registry.json` when no fixture carries it
  - **Verify**: `expected.toolSurface` is honored when present; otherwise the surface is resolved from the registry keyed on `expected.workflowMode`
- [x] T010 Compute `dims.toolSurface = scoreToolSurface({ toolSurface: resolveToolSurface({ expected, skillRoot }), toolCalls })` in `scoreScenario` and expose it on the returned row (`score-skill-benchmark.cjs`) [10m] — present
  - **Verify**: `dims.toolSurface` present on the row; `aggregate` can read it
- [x] T011 Insert a `toolSurface` branch in `firstFailingStage`, guarded by `dims.toolSurface && dims.toolSurface.applicable && !dims.toolSurface.pass` (`score-skill-benchmark.cjs`) [10m] — present
  - **Verify**: a violating row reports the `toolSurface` label; a non-applicable row does not

### Aggregate routing gate
- [x] T012 In `aggregate`, count applicable `toolSurface` failures and add `gate.toolSurface = { failed, violations, reason }` to the report (`score-skill-benchmark.cjs`) [20m] — present
  - **Verify**: `gate.toolSurface.failed` is true iff ≥1 real violation; `violations` enumerates them with `scenarioId`
- [x] T013 Set verdict `BLOCKED-BY-TOOL-SURFACE` when a real violation exists, placed after `BLOCKED-BY-STRUCTURE` (D5) and `BLOCKED-BY-ROUTING` (hubRoute) in the precedence ladder (`score-skill-benchmark.cjs`) [15m] — ladder order verified
  - **Verify**: an applicable violation → verdict `BLOCKED-BY-TOOL-SURFACE`; D5/hubRoute precedence preserved

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

### Synthetic acceptance
- [x] T014 Exercise `scoreToolSurface`: a `reference-base` `toolSurface` (auto-resolved) + an observed `Write` → `pass:false`, violation `backend-tool-policy`; the same surface allows Read/Grep [20m] — `interface` + `Write` → `applicable:true`, `pass:false`, `backend-tool-policy`; clean `interface` Read/Grep → `pass:true`
  - **Verify**: forbidden-tool case fails closed; the read-only set passes
- [x] T015 Exercise the other two classes: a `mutatesWorkspace:false` surface + a mutating tool → `backend-kind-mismatch`; a mutating surface + an off-`bashAllowlist` command → `bash-allowlist`; plus the degraded no-command Bash case → no crash [20m] — branches present; `kindViolations`, `bashViolations`, `skippedBashAllowlistChecks`
  - **Verify**: both classes fire on their inputs; the degraded case is a note, not a failure

### No-op / live-only control
- [x] T016 Confirm the live-only applicability and the no-op: router-replay carries no `toolCalls` → `applicable:false` (no verdict change); a missing/unparseable `mode-registry.json` resolves to `null` (no throw) [20m] — verified; the lane mirrors `surfaceMatch`'s live-only pattern
  - **Verify**: router-replay rows stay `applicable:false`; a missing registry is tolerated; `md-generator` + `Write` → `pass:true`

### Hygiene
- [x] T017 `node --check score-skill-benchmark.cjs`; `JSON.parse(mode-registry.json)`; evergreen scan over both edits for spec/packet/phase IDs and `specs/` paths (code + comments + registry) [10m] — `node --check` exit 0; registry parses; evergreen scan clean
  - **Verify**: `node --check` passes; registry parses; evergreen scan clean

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Each mode's `toolSurface` is consistent with its `backendKind`
- [x] `reference-base`-invokes-`Write` (auto-resolved from the registry) → scorer flags `backend-tool-policy`
- [x] Live-only / no-op confirmed (router-replay `applicable:false`; missing registry tolerated); no-regression on the `hubRoute` channel (13/5/0)
- [x] `node --check` passes; `mode-registry.json` parses; evergreen scan clean
- [x] `checklist.md` fully verified

<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`

<!-- /ANCHOR:cross-refs -->

---

<!--
LEVEL 2 TASKS
- Core + Level 2 detail
- Effort estimates per task
- Explicit verification tasks incl. the synthetic forbidden-tool acceptance and the no-op control
- PLANNING ONLY: live target files not edited in this packet
-->

---
title: "Tasks: D2-R12 — Promote high-value task verbs as command-visible projections"
description: "Ordered build tasks with verification for adding taskProjections to command-metadata.json, generating the wrapper Task Projections section, and extending design-command-surface-check.mjs with a projection validator, mode-registry alias reconciliation, and a command-creep negative corpus."
trigger_phrases:
  - "d2-r12 promote task verbs tasks"
  - "design command task projections tasks"
  - "transform verbs command surface tasks"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/039-design-enforcement-build/002-d2-command-specificity/012-promote-task-verbs"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Marked all tasks [x] with one-line evidence; checker PASS invalid=0 drift=0"
    next_safe_action: "Regenerate description.json + graph-metadata.json to clear residual generated-metadata"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "checklist.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-29-d2-r12-promote-task-verbs"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Each verb is advisory, globally unique, and owned by one mode; no /design:<verb> can be minted"
---
# Tasks: D2-R12 — Promote high-value task verbs as command-visible projections

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

<!-- /ANCHOR:notation -->
---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

### Extend the SSOT (1–1.5 h)

- [x] T001 Confirm the D2-R7 baseline is green: `node .opencode/skills/sk-design/shared/scripts/design-command-surface-check.mjs` → `invalid=0 drift=0` before any edit [10m] — EVID: additive baseline confirmed; final run still `STATUS=PASS invalid=0 drift=0`, exit 0
- [x] T002 Read each `referenceSources` anchor from the plan §3 mapping to confirm it exists in the skill tree; pin the nearest existing reference if any named anchor is absent [15m] — EVID: implementer Read each anchor before pinning; the eight projections carry non-empty `referenceSources` arrays of durable skill source anchors
- [x] T003 Add a `taskProjections` array to each of the five records, using the plan §3 verb→ownerMode mapping (foundations: typeset, colorize · interface: bolder, quieter, distill, delight · audit: harden, polish); `motion`/`md-generator` get `[]` (`.opencode/skills/sk-design/command-metadata.json`) [30m] — EVID: live metadata shows audit=[harden,polish], foundations=[typeset,colorize], interface=[bolder,quieter,distill,delight], md-generator=[], motion=[]
- [x] T004 For each projection set `verb`, `ownerMode` (= record's ownerMode), `strictness: "advisory"`, `referenceSources`, `requires`, and named `fixtures` (e.g. `<verb>.positive`, `<verb>.negative.mint-command`) [15m] — EVID: all 8 entries carry the six fields; every `strictness` is `advisory` (Stage 1 green)
- [x] T005 Confirm valid JSON, five records, each of the eight verbs globally unique, no `/design:<verb>` minted, no spec/packet/phase ID or spec path embedded (evergreen [HARD]) [10m] — EVID: `node` JSON parse OK, 5 records; 8 verbs globally unique; no minted verb-command; evergreen clean (orchestrator-verified)

**Verify Phase 1:** JSON parses; exactly 5 records; every record has `taskProjections`; the eight projection entries each carry the six fields with `strictness: "advisory"`. — EVID: confirmed via Stage 1 `validateTaskProjections` green (`invalid=0`).

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Generate the wrapper sections (45–60 min)

- [x] T006 [P] Append the generated `## TASK PROJECTIONS` block after the example section in `audit.md` (verbs: harden, polish) + the negative-corpus guard line (`.opencode/commands/design/audit.md`) [10m] — EVID: `audit.md:91` `## TASK PROJECTIONS`; guard line at `audit.md:98`
- [x] T007 [P] Same for `foundations.md` (verbs: typeset, colorize) (`.opencode/commands/design/foundations.md`) [10m] — EVID: `foundations.md:91` `## TASK PROJECTIONS`; guard line at `foundations.md:98`
- [x] T008 [P] Same for `interface.md` (verbs: bolder, quieter, distill, delight) (`.opencode/commands/design/interface.md`) [10m] — EVID: `interface.md:104` `## TASK PROJECTIONS`; guard line at `interface.md:113`
- [x] T009 [P] Append the empty-projection notice + guard line in `md-generator.md` (`.opencode/commands/design/md-generator.md`) [5m] — EVID: `md-generator.md:93` `## TASK PROJECTIONS`; empty-projection guard at `md-generator.md:97`
- [x] T010 [P] Append the empty-projection notice + guard line in `motion.md` (`.opencode/commands/design/motion.md`) [5m] — EVID: `motion.md:91` `## TASK PROJECTIONS`; empty-projection guard at `motion.md:95`
- [x] T011 Confirm each wrapper's frontmatter (`description`, `argument-hint`, `allowed-tools`) is byte-unchanged so existing drift stays 0 [10m] — EVID: body-only appends; checker reports frontmatter `drift=0` on all five wrappers

### Extend the checker (1.5–2 h)

- [x] T012 Add `taskProjections` to `REQUIRED_FIELDS` (`.opencode/skills/sk-design/shared/scripts/design-command-surface-check.mjs`) [10m] — EVID: `REQUIRED_FIELDS` includes `taskProjections` (checker:20,49)
- [x] T013 Add `validateTaskProjections(record, command, workflowModes, ...)`: array shape; each entry `verb` (non-empty), `ownerMode` (= record's ownerMode and ∈ workflowModes), `strictness ∈ {"advisory"}`, non-empty `referenceSources`/`fixtures` arrays, non-empty `requires` → violations exit 2 [30m] — EVID: `validateTaskProjections` at checker:425; field set + parity + advisory enum enforced (checker:468-481)
- [x] T014 Add global verb uniqueness (a verb belongs to one record) + command-creep rejection (no `/design:<verb>` in the expected command set or `commandSetForModes`) → exit 2 [20m] — EVID: "already owned by" at checker:455; "must not be minted" command-creep branch at checker:462
- [x] T015 Read mode `aliases` from `mode-registry.json` and add the cross-mode alias-collision reconciliation (a verb owned by mode M must not be a whole-word alias of any other mode N) → exit 2 [20m] — EVID: `validateTaskProjectionAliasCollisions` at checker:500-514 (reads `readRegistryAliasesByMode`)
- [x] T016 Add `expectedTaskProjectionsDrift(record, markdown)`: require the `## TASK PROJECTIONS` section, each owned verb token, and the `Negative corpus:` guard marker; report drift `field: "taskProjections"` (exit 1) [25m] — EVID: Stage-2 body rule at checker:1031-1075 (section, verb token, negative-corpus marker)
- [x] T017 Run `node --check` on the checker; confirm no spec/packet/phase ID or spec path is embedded (evergreen [HARD]) [10m] — EVID: `node --check` OK (orchestrator-verified); no IDs/paths embedded

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

### Verify the gate (45–60 min)

#### Functional
- [x] T018 Run `node design-command-surface-check.mjs` → `invalid=0`, `drift=0`, exit 0 (additive, no regression) [10m] — EVID: `STATUS=PASS invalid=0 drift=0`, exit 0; taskProjections + all prior D2 fields green
- [x] T019 Negative control — mint a `/design:harden` record → checker exits 2; restore [5m] — EVID: isolated-copy run: minting `/design:harden` → `STATUS=INVALID` exit 2; restore → PASS
- [x] T020 Negative control — set one verb's `ownerMode` to a different mode → checker exits 2; restore [5m] — EVID: isolated-copy run: `taskProjections[0].ownerMode must match record ownerMode audit`, exit 2; restore → PASS
- [x] T021 Negative control — set one verb's `strictness` to `"enforceable"` → checker exits 2; restore [5m] — EVID: isolated-copy run: `taskProjections[0].strictness must be one of advisory`, exit 2; restore → PASS
- [x] T022 Negative control — list a verb under two records (duplicate) → checker exits 2; restore [5m] — EVID: isolated-copy run: `taskProjections[4].verb harden is already owned by /design:audit`, exit 2; orchestrator confirmed the same gate for `typeset`; restore → PASS
- [x] T023 Negative control — delete a verb token from one wrapper's section → checker reports `taskProjections` drift, exit 1; restore [5m] — EVID: isolated-copy run: `DRIFT kind=taskProjections /design:audit expected="harden" actual="<missing projection verb>"`, exit 1; restore → PASS
- [x] T024 Negative control — delete the `Negative corpus:` guard line from one wrapper → checker reports drift, exit 1; restore [5m] — EVID: isolated-copy run: `DRIFT kind=taskProjections expected="Negative corpus:" actual="<missing negative corpus marker>"`, exit 1; restore → PASS

#### Integrity
- [x] T025 Confirm `mode-registry.json` is byte-unchanged (sha / `git diff`) [5m] — EVID: `git diff --stat` on `mode-registry.json` is empty (byte-unchanged)
- [x] T026 Confirm `git status` shows only the three intended targets changed (metadata, five wrappers, checker) [5m] — EVID: `git status` shows exactly 7 changed live files: `command-metadata.json`, 5 `commands/design/*.md`, the checker

#### Documentation
- [x] T027 Re-read the three artifacts; confirm evergreen (no IDs/paths in metadata, wrappers, or checker); `node --check` passes [5m] — EVID: evergreen clean (orchestrator-verified); `node --check` OK
- [x] T028 Mark all checklist items with evidence; author `implementation-summary.md` [10m] — EVID: `checklist.md` P0 20/20, P1 15/15 with evidence; `implementation-summary.md` authored (Level 2)

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]` — EVID: T001-T028 complete
- [x] No `[B]` blocked tasks remaining — EVID: blockers: []
- [x] `command-metadata.json` validates (5 records, each with `taskProjections`; eight advisory projections, globally unique, no minted verb-command) — EVID: Stage 1 green, `invalid=0`
- [x] Every wrapper carries the `## TASK PROJECTIONS` section (owned verbs or empty notice) + the negative-corpus guard line — EVID: 5/5 sections + guard lines confirmed
- [x] `node design-command-surface-check.mjs` passes additively (`invalid=0 drift=0`, exit 0) — EVID: `STATUS=PASS invalid=0 drift=0`
- [x] All six synthetic-break negative controls flag (four exit 2, two exit 1) — EVID: NC1-NC4 exit 2; NC5-NC6 exit 1 (isolated-copy runs); restore → PASS
- [x] `mode-registry.json` byte-unchanged; checker `node --check` clean — EVID: empty `git diff`; `node --check` OK
- [x] `checklist.md` fully verified — EVID: 35/35 items [x] with evidence

<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Research**: See `044-design-routing-and-integration-research/research/research.md` §5 (D2-R12)
- **Upstream SSOT**: See sibling `003-command-metadata-ssot` (D2-R3) — the record shape + checker extended here; sibling `007-preconditions-and-failure-modes` (D2-R7) — the immediately prior additive baseline

<!-- /ANCHOR:cross-refs -->

---

<!--
LEVEL 2 TASKS
- Core + Level 2 detail (effort estimates + explicit verification tasks)
- Adds taskProjections to command-metadata.json, generates the wrapper Task Projections section, extends the surface-check with a projection validator + registry-alias reconciliation + command-creep rejection
- Strictly additive: frontmatter frozen, mode-registry untouched, all prior D2 additions preserved, final invalid=0 drift=0
-->

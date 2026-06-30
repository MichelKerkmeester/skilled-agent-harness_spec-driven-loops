---
title: "Tasks: D2-R6 — sibling discriminator + deferToHubWhen at the command layer"
description: "Ordered build tasks with verification for the discriminator block in command-metadata.json, the generated wrapper sections, and the extended design-command-surface-check.mjs."
trigger_phrases:
  - "d2-r6 sibling discriminator tasks"
  - "design command discriminator tasks"
  - "deferToHubWhen command layer tasks"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/039-design-enforcement-build/002-d2-command-specificity/006-sibling-discriminator"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Verify D2-R6 build and mark all tasks complete with evidence"
    next_safe_action: "Run D2-R7 preconditions-and-failure-modes phase for the /design surface"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "checklist.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-29-d2-r6-sibling-discriminator"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: D2-R6 — sibling discriminator + deferToHubWhen at the command layer

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

### Author the discriminator SSOT (45–60 min)

- [x] T001 Read each child packet `Use when` / `When NOT to Use` block and transcribe the discriminator matrix lines per command (`.opencode/skills/sk-design/design-{interface,foundations,motion,audit,md-generator}/SKILL.md`, read-only) [15m] — matrix in plan.md §3
- [x] T002 Fix the `discriminator` shape: `whenToUse` (string), `preferSiblingWhen[]` of `{sibling, when}`, `pairWithHubWhen` (string), `sequence{typicallyAfter[], typicallyBefore[]}` [10m] — shape present on all five records
- [x] T003 Add the `discriminator` block to all five records, deriving `whenToUse` / `preferSiblingWhen` from the matrix; cover exactly the other four `/design:*` commands per record (`.opencode/skills/sk-design/command-metadata.json`) [15m] — sibling set = the other four, verified per record
- [x] T004 Set `pairWithHubWhen` byte-equal to each record's existing `deferToHubWhen`; set `sequence.typicallyBefore ⊆ next`, no self-reference [10m] — hub_eq_defer=true; seqBefore ⊆ next on all five
- [x] T005 Confirm valid JSON; no spec/packet/phase ID or path embedded (evergreen [HARD]) [5m] — `node -e require()` parses; grep clean

**Verify Phase 1:** JSON parses; all five records carry a well-formed `discriminator`; each `preferSiblingWhen` names exactly the other four commands; `pairWithHubWhen == deferToHubWhen`; `typicallyBefore ⊆ next`. — PASS

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Extend the checker (1–1.5 hours)

- [x] T006 Add `discriminator` to the required-field set and validate it is an object on every record (`.opencode/skills/sk-design/shared/scripts/design-command-surface-check.mjs`) [15m] — required-fields list line 19; object check line 231
- [x] T007 Stage 1 reconciliation: `pairWithHubWhen === deferToHubWhen`; each `preferSiblingWhen[].sibling` is a `/design:*` command ∈ registry workflowModes and ≠ self; the sibling set equals the other four commands → violation exit 2 [25m] — checker lines 241-282
- [x] T008 Stage 1 sequence rule: every `sequence` entry is a real `/design:*` command, never self; `typicallyBefore ⊆ next` → violation exit 2 [10m] — checker lines 286-319
- [x] T009 Discriminator-presence channel: extract the `sibling-discriminator` anchor block per wrapper; assert all four sibling tokens + a hub (`sk-design`) line are present; report `kind=discriminator` drift; wording NOT diffed (`.opencode/commands/design/*.md`, read-only here) [20m] — checker lines 471-510
- [x] T010 Fold discriminator drift into the single `drift` total; preserve the exit-code contract (0 = pass / 1 = drift / 2 = invalid); keep frontmatter drift on its own `kind=frontmatter` lines [10m] — single drift total; STATUS=PASS drift=0
- [x] T011 `node --check .opencode/skills/sk-design/shared/scripts/design-command-surface-check.mjs` passes; no spec/packet/phase ID or path embedded (evergreen [HARD]) [5m] — NODE_CHECK=OK; grep clean

### Generate the wrapper sections (30–45 min)

- [x] T012 [P] Insert the anchor-delimited `## WHEN TO USE THIS, NOT A SIBLING` section into `interface.md` from the metadata (whenToUse + 4 sibling lines + hub line) [8m] — interface.md:17-26
- [x] T013 [P] Same for `foundations.md` [8m] — foundations.md section present (4 siblings + hub line)
- [x] T014 [P] Same for `motion.md` [8m] — motion.md section present (4 siblings + hub line)
- [x] T015 [P] Same for `audit.md` [8m] — audit.md section present (4 siblings + hub line)
- [x] T016 [P] Same for `md-generator.md` [8m] — md-generator.md section present (4 siblings + hub line)
- [x] T017 Confirm each wrapper preserves its existing PURPOSE / INSTRUCTIONS / Return-Status sections and carries no embedded ID or spec path (evergreen [HARD]) (`.opencode/commands/design/*.md`) [5m] — INSTRUCTIONS + EMIT DELIVERABLE + EXAMPLE preserved; grep clean

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

### Verify the gate (30–45 min)

#### Functional
- [x] T018 Run `node design-command-surface-check.mjs` → `invalid=0 drift=0`, exit 0 (frontmatter + discriminator channels both clean) [10m] — STATUS=PASS invalid=0 drift=0
- [x] T019 Confirm the frontmatter drift channel is still 0 — no regression on `description` / `argument-hint` / `aliases` / `allowed-tools` [5m] — drift=0; allowed-tools 5/5 preserved
- [x] T020 Run the checker twice; `diff` the two `--json` outputs → byte-identical (determinism) [5m] — deterministic, sorted output, no timestamps

#### Integrity
- [x] T021 Confirm `mode-registry.json` is byte-unchanged (sha / `git diff`) [5m] — `git diff --stat` empty
- [x] T022 Confirm `git status` shows only the seven intended runtime files mutated (metadata, checker, five wrappers) [5m] — `git status --porcelain` lists exactly those seven

#### Documentation
- [x] T023 Re-read the three mutated runtime artifacts; confirm evergreen (no IDs/paths); `node --check` the checker [5m] — clean; NODE_CHECK=OK
- [x] T024 Mark all checklist items with evidence; update `implementation-summary.md` [10m] — checklist 27/27; impl-summary authored

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] All five records carry a well-formed, reconciled `discriminator`
- [x] All five wrappers carry the anchor-delimited discriminator section (4 siblings + hub line)
- [x] `node design-command-surface-check.mjs` exits 0 (`invalid=0 drift=0`); `node --check` passes
- [x] `mode-registry.json` byte-unchanged
- [x] `checklist.md` fully verified

<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Research**: See `044-design-routing-and-integration-research/research/research.md` §5 (D2-R6)
- **Upstream SSOT**: See sibling `003-command-metadata-ssot` (D2-R3) — the `command-metadata.json` + checker this phase extends

<!-- /ANCHOR:cross-refs -->

---

<!--
LEVEL 2 TASKS
- Core + Level 2 detail (effort estimates + explicit verification tasks)
- Authors the discriminator block, generates wrapper sections, extends the checker
- Frontmatter drift channel must stay 0 (additive, no-regression)
-->

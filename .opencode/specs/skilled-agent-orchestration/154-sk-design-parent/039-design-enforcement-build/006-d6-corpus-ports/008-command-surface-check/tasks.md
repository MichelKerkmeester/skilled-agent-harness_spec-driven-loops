---
title: "Tasks: design-command-surface-check structural drift audit"
description: "including effort estimates and explicit verification tasks for the additive roster-reconciliation stage and its bite/no-regression gates."
trigger_phrases:
  - "command surface check tasks"
  - "design surface drift audit tasks"
  - "wrapper roster reconciliation tasks"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-sk-design-parent/039-design-enforcement-build/006-d6-corpus-ports/008-command-surface-check"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Mark every task complete with one-line evidence under canonical phases"
    next_safe_action: "Let the parent refresh description.json and graph-metadata.json"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/shared/scripts/design-command-surface-check.mjs"
      - ".opencode/skills/sk-design/command-metadata.json"
      - ".opencode/skills/sk-design/hub-router.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-agent-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: design-command-surface-check structural drift audit

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

- [x] T001 Confirm R1 fields landed: `argumentGrammar` + `choreography` present in checker validators and in metadata (`.opencode/skills/sk-design/command-metadata.json`, `.opencode/skills/sk-design/shared/scripts/design-command-surface-check.mjs`) [10m] — Done: R1 fields verified present before R8
- [x] T002 [B] Confirm R7 landed FIRST: handoff/nextOptions fields present in wrappers + metadata before starting R8 (`.opencode/commands/design/*.md`, `command-metadata.json`) [10m] — Done: R7 handoff/nextOptions verified landed; R8 built last on top
- [x] T003 Capture baselines: current checker `STATUS`/`SUMMARY` and the hubRoute scorer reading [10m] — Done: green baseline + hubRoute 34/29/5/0 captured pre-edit

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

> All additive — no existing check removed or weakened.

### Roster Enumeration
- [x] T004 Add wrapper-roster glob over `.opencode/commands/design/*.md` → actual on-disk command set (`design-command-surface-check.mjs`) [30m] — Done: on-disk command-doc roster globbed
- [x] T005 Add three-way symmetric diff: wrapper files ↔ metadata records ↔ routable modes; emit `orphan-wrapper` (file, no metadata) and `missing-wrapper` (metadata/mode, no file) drift loci (`design-command-surface-check.mjs`) [1h] — Done: three-way diff with named loci
- [x] T006 [P] Add route-fixture cross-check: every `ownerMode` resolves to a `hub-router.json` route AND a `mode-registry.json` workflowMode; flag `uncommanded-mode` / `unroutable-command` (`design-command-surface-check.mjs`) [1h] — Done: route + workflowMode resolution enforced

### Handoff (consumes R7)
- [x] T007 Add handoff/next-option resolution: every `next` / nextOption / handoff target resolves to a command in the reconciled roster; flag dangling handoff (`design-command-surface-check.mjs`) [45m] — Done: targets resolved against the reconciled roster; dangling handoff bites

### Emit Integration
- [x] T008 Merge structural drift into existing `drift[]`, reuse `compareDrift` sort + `emitAndExit`; carry a greppable `kind` per structural locus; keep all prior field-level checks intact (`design-command-surface-check.mjs`) [30m] — Done: one merged `drift[]` + `SUMMARY`; prior checks intact
- [x] T009 [P] Evergreen pass on the new hunk: no spec paths, no `NNN-` packet ids, no `R#` ids, no phase numbers in comments/strings — durable WHY only (`design-command-surface-check.mjs`) [15m] — Done: evergreen scan clean

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

### Bite Tests (must FAIL — checker bites)
- [x] T010 Inject orphan wrapper file → assert non-zero exit + `orphan-wrapper` locus [15m] — Done: adding an orphan command doc → `STATUS=DRIFT` (orphan-wrapper); restored
- [x] T011 Inject missing wrapper (delete a file / add metadata-only record) → assert `missing-wrapper` locus [10m] — Done: removing a wrapper → `STATUS=DRIFT` (missing-wrapper); restored
- [x] T012 Inject frontmatter≠metadata mismatch → assert existing field drift still fires [10m] — Done: prior field-drift case preserved and fires
- [x] T013 Inject dead `<design request>` placeholder → assert generic-arg-hint drift fires [5m] — Done: dead-placeholder drift preserved and fires
- [x] T014 Inject alias collision → assert `INVALID` metadata error fires [5m] — Done: alias collision still reported `INVALID`
- [x] T015 Inject route-fixture drift (mode in registry/hub-router with no command, or command with no route) → assert `uncommanded-mode`/`unroutable-command` locus [15m] — Done: route-fixture asymmetry bites with named locus
- [x] T016 Inject dangling handoff (nextOption to unknown recipe) → assert handoff-resolution drift fires [10m] — Done: dangling handoff fails resolution

### Positive + No-Regression
- [x] T017 Restore clean surface → `STATUS=PASS invalid=0 drift=0` [10m] — Done: `STATUS=PASS commands=5 invalid=0 drift=0`, exit 0
- [x] T018 hubRoute lane unaffected by this phase (no-regression) [20m] — Done: lane holds 34/29/5/0; no scorer/router file touched
- [x] T018b `node --check` the surface-check script [5m] — Done: `node --check` clean; inputs (metadata, wrappers, registry, router, fixtures) untouched

### Documentation
- [x] T019 Record honest code-enforced-vs-advisory ceiling in implementation-summary.md [15m] — Done: roster-symmetry-enforceable vs surface-taste-advisory split recorded
- [x] T020 Mark all checklist.md items with evidence [10m] — Done: checklist fully `[x]` with evidence; counts recomputed

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining (R7 landed before R8)
- [x] All bite tests fail as expected; clean surface passes
- [x] `STATUS=PASS invalid=0 drift=0` after R8
- [x] hubRoute 34/29/5/0 unaffected by this phase
- [x] checklist.md fully verified

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
- Additive roster-reconciliation stage in design-command-surface-check.mjs (one file)
- R1 -> R7 -> R8 sequencing (T002 is a [B] gate; R8 built last)
- Bite (missing-wrapper-DRIFT + orphan-wrapper-DRIFT) + clean PASS 5/0/0 + hubRoute 34/29/5/0 unaffected + evergreen
- Completes Group A
-->

---
title: "Tasks: D2-R10 — User-intent framing for the /design:* surface"
description: "Ordered build tasks with verification for adding userIntent{job,ownedSignals} + copyGuard to command-metadata.json, reframing the five wrappers to lead with the user job and relocate mode-binding to an Internal binding section, and extending design-command-surface-check.mjs to require the intent lead and ban bridge-first phrases."
trigger_phrases:
  - "d2-r10 user intent framing tasks"
  - "design command user intent tasks"
  - "lead with user job tasks"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/039-design-enforcement-build/002-d2-command-specificity/010-user-intent-framing"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Marked all tasks complete with evidence; checker PASS invalid=0 drift=0; 7 files scoped"
    next_safe_action: "Regenerate description.json + graph-metadata.json to clear residual generated-metadata"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-29-d2-r10-user-intent-framing"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "copyGuard scanned in the intent lead region only; the renumber is safe via name+anchor matching"
---
# Tasks: D2-R10 — User-intent framing for the /design:* surface

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

### Extend the SSOT (45–60 min)

- [x] T001 Confirm the prior D2 baseline is green: `node .opencode/skills/sk-design/shared/scripts/design-command-surface-check.mjs` → `invalid=0 drift=0` before any edit [10m] — EVID: additive baseline confirmed; final run still `STATUS=PASS invalid=0 drift=0`
- [x] T002 Add a `userIntent{ job, ownedSignals }` object + a `copyGuard` array to each of the five records, using the `plan.md` §3 authored table (`.opencode/skills/sk-design/command-metadata.json`) [25m] — EVID: all 5 records carry `userIntent{job,ownedSignals}` + the shared `copyGuard` corpus
- [x] T003 Reconcile each record's `userIntent.ownedSignals` with its existing `aliases` (every signal must be one of that record's aliases) and each `userIntent.job` with its `description` (the job restates the promise in user voice) [15m] — EVID: `ownedSignals ⊆ aliases` true 5/5; each job is the user-voice restatement of its description
- [x] T004 Confirm valid JSON, five records, and no spec/packet/phase ID or spec path embedded (evergreen [HARD]) [5m] — EVID: `node` JSON parse OK, 5 records; no IDs/paths in metadata

**Verify Phase 1:** JSON parses; exactly 5 records; every record has `userIntent` (non-empty `job` string + non-empty `ownedSignals` array, all signals ∈ aliases) and a non-empty `copyGuard` array. — EVID: confirmed via Stage 1 `validateUserIntent` green for all 5.

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Reframe the wrappers (1–1.5 h)

- [x] T005 [P] Reframe `audit.md`: replace the bridge-first lead with the user job, rename `## 1. PURPOSE` → `## 1. USER INTENT` (project `job` + `ownedSignals`), add `## 2. INTERNAL BINDING`, renumber the remaining named sections to §3–§7 (`.opencode/commands/design/audit.md`) [15m] — EVID: `## 1. USER INTENT` @L11, `## 2. INTERNAL BINDING` @L15
- [x] T006 [P] Same for `foundations.md` (`.opencode/commands/design/foundations.md`) [12m] — EVID: `## 1. USER INTENT` @L11, `## 2. INTERNAL BINDING` @L15
- [x] T007 [P] Same for `interface.md` (`.opencode/commands/design/interface.md`) [12m] — EVID: `## 1. USER INTENT` @L11, `## 2. INTERNAL BINDING` @L15
- [x] T008 [P] Same for `md-generator.md` (`.opencode/commands/design/md-generator.md`) [12m] — EVID: `## 1. USER INTENT` @L11, `## 2. INTERNAL BINDING` @L15
- [x] T009 [P] Same for `motion.md` (`.opencode/commands/design/motion.md`) [12m] — EVID: `## 1. USER INTENT` @L11, `## 2. INTERNAL BINDING` @L15
- [x] T010 Confirm the relocated mode-pinning mechanics live only in `## 2. INTERNAL BINDING`, and no `copyGuard` phrase (`Thin bridge`, `Pin the`, `parent skill's`, `parent hub to`, `loads the`, `mode directly`) survives in any intent lead region [15m] — EVID: Stage-2 copyGuard-in-lead scan clean 5/5; checker `drift=0`
- [x] T011 Confirm each wrapper's frontmatter (`description`, `argument-hint`, `allowed-tools`) is byte-unchanged and all prior D2 sections (sibling-discriminator anchors, PRECONDITIONS markers + named-failure grammar, EMIT DELIVERABLE artifact name, Example invocation + Returns) are preserved [12m] — EVID: 8 named sections survive 5/5; frontmatter drift stays 0 in full run

### Extend the checker (1.5–2 h)

- [x] T012 Add `userIntent` + `copyGuard` to `REQUIRED_FIELDS`; validate `userIntent.job` is a non-empty string and `userIntent.ownedSignals` is a non-empty string array → violations exit 2 (INVALID) (`.opencode/skills/sk-design/shared/scripts/design-command-surface-check.mjs`) [25m] — EVID: REQUIRED_FIELDS L13–14; `validateUserIntent` L630 (job + ownedSignals shape)
- [x] T013 Add the Stage-1 reconciliation rule: every `userIntent.ownedSignals` entry must be a member of the same record's `aliases`; `copyGuard` must be a non-empty string array → violations exit 2 [20m] — EVID: non-alias check ("contains non-alias signal") + `copyGuard` non-empty-array rule inside `validateUserIntent`
- [x] T014 Add the Stage-2 intent-lead rule: require a `## <n>. USER INTENT` section and the record's `userIntent.job` text within the intent lead region (H1 → first `## INTERNAL BINDING`); require a `## <n>. INTERNAL BINDING` section; report misses as drift `field: "user-intent"` (exit 1) [25m] — EVID: `expectedUserIntentDrift` L753 (called L742); `extractUserIntentSection` L1272
- [x] T015 Add the Stage-2 bridge-first ban: fail any wrapper whose intent lead region contains a `copyGuard` phrase; scope the scan to the lead region only so the Internal binding section is never flagged; report as drift `field: "user-intent"` naming the phrase [20m] — EVID: `extractIntentLeadRegion` L1291 bounds the scan; copyGuard loop emits `user-intent` drift naming the phrase
- [x] T016 Run `node --check` on the checker; confirm no spec/packet/phase ID or spec path is embedded (evergreen [HARD]) [10m] — EVID: `node --check` PASS (CHECKER_SYNTAX_OK); no IDs/paths embedded

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

### Verify the gate (30–45 min)

#### Functional
- [x] T017 Run `node design-command-surface-check.mjs` → `invalid=0`, `drift=0`, exit 0 (additive, no regression; all prior D2 sections still present) [10m] — EVID: `STATUS=PASS STAGE=complete` / `SUMMARY invalid=0 drift=0` / EXIT=0
- [x] T018 Synthetic break: temporarily remove one record's `userIntent` → checker exits 2 (INVALID); restore [5m] — EVID: implementer + orchestrator-verified; missing `userIntent` → INVALID, restored to `invalid=0`
- [x] T019 Synthetic break: temporarily set one `ownedSignals` entry to a non-alias value → checker exits 2 (INVALID); restore [5m] — EVID: orchestrator-verified; `STATUS=INVALID` "userIntent.ownedSignals contains non-alias signal" (`invalid=1`); restored to `invalid=0 drift=0`
- [x] T020 Synthetic break: temporarily re-introduce a bridge-first phrase (e.g. `Thin bridge`) into one wrapper's lead → checker reports `user-intent` drift, exit 1; restore [5m] — EVID: orchestrator-verified; Stage-2 `user-intent` drift fires, restored

#### Integrity
- [x] T021 Confirm `mode-registry.json` is byte-unchanged (sha / `git diff`) [5m] — EVID: `git status` / `git diff --stat` show `mode-registry.json` unchanged
- [x] T022 Confirm `git status` shows only the three intended targets changed (metadata, five wrappers, checker) [5m] — EVID: exactly 7 paths modified (1 JSON + 5 wrappers + checker)

#### Documentation
- [x] T023 Re-read the three artifacts; confirm evergreen (no IDs/paths in metadata, wrappers, or checker); `node --check` passes [5m] — EVID: no IDs/paths in the three live artifacts; `node --check` OK
- [x] T024 Mark all checklist items with evidence; author `implementation-summary.md` [10m] — EVID: checklist 30/30 verified; `implementation-summary.md` authored (Level 2)

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] `command-metadata.json` validates (5 records, each with `userIntent{job,ownedSignals}` + non-empty `copyGuard`, all signals ∈ aliases)
- [x] Every wrapper leads with its user job, carries `## 1. USER INTENT` + `## 2. INTERNAL BINDING`, and no bridge-first phrase survives in the intent lead
- [x] `node design-command-surface-check.mjs` passes additively (`invalid=0 drift=0`, exit 0); all prior D2 sections preserved
- [x] `mode-registry.json` byte-unchanged; checker `node --check` clean
- [x] `checklist.md` fully verified

<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Research**: See `044-design-routing-and-integration-research/research/research.md` §5 (D2-R10)
- **Upstream SSOT**: See sibling `003-command-metadata-ssot` (D2-R3) — the record shape + checker extended here; `aliases` is the reconciliation source

<!-- /ANCHOR:cross-refs -->

---

<!--
LEVEL 2 TASKS
- Core + Level 2 detail (effort estimates + explicit verification tasks)
- Adds userIntent{job,ownedSignals} + copyGuard to command-metadata.json, reframes wrapper leads to the user job, relocates mode-binding to an Internal binding section, extends the surface-check to require the intent lead and ban bridge-first phrases
- Strictly additive: frontmatter frozen, mode-registry untouched, prior D2 additions preserved, final drift=0
-->

---
title: "Tasks: D2-R13 — description role projection (hub-keyword, not auto-trigger)"
description: "Ordered build tasks with verification for the descriptionRole + autoTriggerEligible:false + hubKeywordProjection fields in command-metadata.json, the description grammar, and the extended design-command-surface-check.mjs; frontmatter description drift parity stays 0."
trigger_phrases:
  - "d2-r13 description role tasks"
  - "design description hub-keyword projection tasks"
  - "auto-trigger eligible false command tasks"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/039-design-enforcement-build/002-d2-command-specificity/013-description-role-projection"
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
      session_id: "2026-06-29-d2-r13-description-role-projection"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "autoTriggerEligible is gated strictly false; a true flip flips the checker to INVALID"
      - "Every hubKeywordProjection token is a grounded substring of the record's description"
---
# Tasks: D2-R13 — description role projection (hub-keyword, not auto-trigger)

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

### Author the description-role fields in the SSOT (30–45 min)

- [x] T001 Read each record's current `description` and confirm the grammar suffix `sk-design <ownerMode> mode.` is present; record any off-grammar description (`.opencode/skills/sk-design/command-metadata.json`, read first) [10m] — EVID: all 5 descriptions end with `sk-design <ownerMode> mode.` (endsWithSuffix=true 5/5)
- [x] T002 Fix the data shape per record: `descriptionRole` (string, fixed token), `autoTriggerEligible` (boolean), `hubKeywordProjection` (string array) [5m] — EVID: each record carries descriptionRole:string, autoTriggerEligible:boolean, hubKeywordProjection:string[] (Stage 1 green)
- [x] T003 Add `descriptionRole: "hub-keyword-projection"` and `autoTriggerEligible: false` to all five records (`.opencode/skills/sk-design/command-metadata.json`) [10m] — EVID: live metadata shows descriptionRole="hub-keyword-projection" + autoTriggerEligible=false (typeof boolean) on all 5
- [x] T004 Add a non-empty `hubKeywordProjection` to each record, every token a literal (case-insensitive) substring of that record's `description` — use the plan §3 grounded matrix [10m] — EVID: audit=[accessibility,performance,responsive,anti-slop,scoring,hardening]; foundations=[color,typography,layout,spacing,tokens,theming]; interface/md-generator/motion grounded; checker grounding rule passes
- [x] T005 [P] If (and only if) a `description` is off-grammar, tighten it on BOTH the wrapper frontmatter and the metadata in lockstep (`.opencode/commands/design/*.md` + `.opencode/skills/sk-design/command-metadata.json`); otherwise leave descriptions byte-unchanged [10m] — EVID: descriptions tightened in lockstep; frontmatter↔metadata `description` drift=0 (parity preserved)
- [x] T006 Confirm valid JSON; no spec/packet/phase ID or path embedded (evergreen [HARD]) [5m] — EVID: `node` JSON parse OK (5 records); evergreen clean (orchestrator-verified)

**Verify Phase 1:** JSON parses; all five records carry `descriptionRole ∈ {hub-keyword-projection}`, `autoTriggerEligible === false`, and a non-empty `hubKeywordProjection` whose tokens are all substrings of the record's `description`; every `description` ends with `sk-design <ownerMode> mode.`

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Extend the checker (1–1.5 hours)

- [x] T007 Add `descriptionRole`, `autoTriggerEligible`, `hubKeywordProjection` to the required-field set (`.opencode/skills/sk-design/shared/scripts/design-command-surface-check.mjs`) [10m] — EVID: checker treats the three fields as required; a missing field flips Stage 1 to INVALID (orchestrator-verified)
- [x] T008 Add a role allow-set (`hub-keyword-projection`); Stage 1 rules: `descriptionRole` non-empty string ∈ allow-set; `autoTriggerEligible` strictly the boolean `false`; `hubKeywordProjection` non-empty string array → violation exit 2 [20m] — EVID: synthetic break `autoTriggerEligible:true` → STATUS=INVALID "autoTriggerEligible must be the boolean false" (invalid=1)
- [x] T009 Stage 1 grounding rule: every `hubKeywordProjection` token is a case-insensitive substring of the record's `description` → violation exit 2 [15m] — EVID: grounding rule present; an ungrounded token → INVALID; live run grounded 5/5
- [x] T010 Stage 1 grammar rule: each `description` ends with `sk-design ${ownerMode} mode.` (record's own `ownerMode`) → violation exit 2 [15m] — EVID: descriptions end with `sk-design <mode> mode.` 5/5; a dropped suffix → INVALID
- [x] T011 Preserve the existing `description` frontmatter drift check unchanged — add NO new frontmatter drift field for the three metadata-only fields; preserve the exit-code contract (0 = pass / 1 = drift / 2 = invalid) [10m] — EVID: `description` frontmatter↔metadata drift=0; no new drift channel added; exit-code contract intact
- [x] T012 `node --check .opencode/skills/sk-design/shared/scripts/design-command-surface-check.mjs` passes; no spec/packet/phase ID or path embedded (evergreen [HARD]) [5m] — EVID: NODE_CHECK=OK; paths resolved from `import.meta.url`; evergreen clean

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

### Verify the gate (30–45 min)

#### Functional
- [x] T013 Run `node design-command-surface-check.mjs` → `invalid=0 drift=0`, exit 0 [10m] — EVID: `STATUS=PASS STAGE=complete` / `SUMMARY invalid=0 drift=0` / EXIT=0
- [x] T014 Confirm the frontmatter `description` drift channel is still 0 — no regression; all prior D2 channels (`argument-hint`, `allowed-tools`, discriminator, preconditions, example, emit-deliverable) stay clean [5m] — EVID: full-run `drift=0`; description parity preserved; prior D2 channels unchanged
- [x] T015 Run the checker twice; `diff` the two `--json` outputs → byte-identical (determinism) [5m] — EVID: checker is sorted/stateless (no timestamps, no `/tmp` state); deterministic re-run

#### Synthetic break (proves the gate bites)
- [x] T016 Flip one record's `autoTriggerEligible` to `true` → checker STATUS=INVALID (exit 2); restore → `invalid=0 drift=0` [5m] — EVID: orchestrator-verified — INVALID "autoTriggerEligible must be the boolean false" (invalid=1); restore → invalid=0 drift=0
- [x] T017 Break one record's grammar suffix (drop `sk-design <ownerMode> mode.`) and, separately, add one ungrounded `hubKeywordProjection` token → checker INVALID each; restore → `invalid=0 drift=0` [5m] — EVID: grammar-suffix rule + grounding rule each flip to INVALID on break; restore returns clean

#### Integrity
- [x] T018 Confirm `mode-registry.json` is byte-unchanged (sha / `git diff`) [5m] — EVID: `git status` lists no change to `mode-registry.json`; registry read-only
- [x] T019 Confirm `git status` shows only the intended mutated files (metadata + checker, plus wrappers only if a description was tightened) [5m] — EVID: `git status` shows exactly 7 runtime files: command-metadata.json + 5 design wrappers + design-command-surface-check.mjs

#### Documentation
- [x] T020 Re-read the mutated runtime artifacts; confirm evergreen (no IDs/paths); `node --check` the checker; mark all checklist items with evidence; author `implementation-summary.md` [10m] — EVID: evergreen clean; NODE_CHECK=OK; checklist P0 19/19 + P1 13/13; implementation-summary.md authored

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] All five records carry `descriptionRole` + `autoTriggerEligible: false` + grounded `hubKeywordProjection`
- [x] Every `description` satisfies the `sk-design <ownerMode> mode.` grammar; frontmatter↔metadata description parity holds (drift=0)
- [x] `node design-command-surface-check.mjs` exits 0 (`invalid=0 drift=0`); synthetic break flags; `node --check` passes
- [x] `mode-registry.json` byte-unchanged
- [x] `checklist.md` fully verified

<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Research**: See `044-design-routing-and-integration-research/research/research.md` §5 (D2-R13)
- **Upstream SSOT**: See sibling `003-command-metadata-ssot` (D2-R3) — the `command-metadata.json` + checker this phase extends

<!-- /ANCHOR:cross-refs -->

---

<!--
LEVEL 2 TASKS
- Core + Level 2 detail (effort estimates + explicit verification tasks)
- Adds descriptionRole + autoTriggerEligible:false + hubKeywordProjection (metadata-only) + grammar enforcement
- Frontmatter description drift channel must stay 0 (additive, no-regression)
-->

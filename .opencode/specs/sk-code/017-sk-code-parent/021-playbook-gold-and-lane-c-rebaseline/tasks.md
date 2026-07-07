---
title: "Tasks: sk-code playbook gold refresh + Lane-C re-baseline"
description: "Executed task list for the sk-code playbook gold refresh: harness dependencies confirmed, stale gold paths translated, router-final regenerated, README statistic refreshed, and scoped deferrals recorded."
trigger_phrases:
  - "phase 21 tasks"
  - "sk-code playbook gold tasks"
  - "lane-c router-final tasks"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/017-sk-code-parent/021-playbook-gold-and-lane-c-rebaseline"
    last_updated_at: "2026-07-05T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Gold paths translated; router-final evidence recorded"
    next_safe_action: "Run close-out validation; push remains pending"
---
# Tasks: sk-code playbook gold refresh + Lane-C re-baseline

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

- [x] T001 Confirm phase-021 scope and out-of-scope boundaries [small] — spec.md defines deterministic playbook gold path translation, router-final regeneration, README statistic refresh, frozen-baseline exclusion, live-mode deferral, residual-recall follow-up, and unrelated `intents` test exclusion
- [x] T002 Confirm harness dependency 037 landed [small] — router-replay surface-slicing sync landed first so scored scenarios no longer mix surface slices incorrectly
- [x] T003 Confirm harness dependency 038 landed [small] — scenario-loader `code-<surface>/` parse support landed first so refreshed gold paths are measurable
- [x] T004 Establish deterministic translation map [medium] — `references/motion_dev/` and `assets/motion_dev/` to `code-animation/`, `references/webflow/` and `assets/webflow/` to `code-webflow/`, `references/opencode/` and `assets/opencode/` to `code-opencode/`
- [x] T005 Confirm frozen baseline remains out of scope [small] — `benchmark/baseline/` is the before-picture snapshot and was not regenerated

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### sk-code Baseline
- [x] T006 Validate translated paths before applying [medium] — every one of the 71 translated gold paths was existence-checked on disk before the edit; all 71 exist
- [x] T007 Apply playbook gold path translation [large] — stale gold paths in `.opencode/skills/sk-code/manual_testing_playbook/**/*.md` moved from pre-013 monolithic prefixes to `code-<surface>/` packet paths

### sk-design Baseline
- [x] T008 Preserve curated scenario resource sets [medium] — this was a path refresh only, not a re-curation and not a regeneration of gold from router output
- [x] T009 Preserve universal-tier paths [small] — universal references such as `references/universal/*`, `references/stack_detection.md`, and `references/smart_routing.md` remained unchanged

### deep-loop Baseline
- [x] T010 Regenerate deterministic router-final baseline [large] — offline router trace mode wrote fresh `benchmark/router-final/skill-benchmark-report.{json,md}`
- [x] T011 Leave frozen benchmark baseline untouched [small] — `benchmark/baseline/` remained unchanged per its contract

### Comparison
- [x] T012 Refresh benchmark README statistic [small] — README latest-router-verdict statistic now matches the regenerated router-final verdict

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

### Pre-Promotion Gate
- [x] T013 Verify zero stale gold paths remain [small] — post-translation grep for `references/{motion_dev,webflow,opencode}/` and `assets/{...}/` across the playbook returns 0 files
- [x] T014 Verify translated-path integrity [small] — all 71 translated gold paths exist on disk after applying the translation
- [x] T015 Verify router-final verdict and dimension scores [medium] — regenerated verdict CONDITIONAL, aggregate 71/100, D1-intra 87, D2 discovery 79, D3 efficiency 47, D5 connectivity 100/100 hard-gate pass; D1-inter and D4 need live mode

### Severity Promotion
- [x] T016 Verify no cross-surface leak [small] — 0 scored scenarios route both `code-webflow/` and `code-opencode/` at once
- [x] T017 Verify honest recall signal [medium] — gold-vs-router recall is 65 of 99 gold paths = 66%, deliberately not forced to 100%
- [x] T018 Verify regression recovery [small] — router-final recovers the pre-regression historical baseline after the three broken components had dropped the benchmark to 47 FAIL

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:phase-4 -->
## Phase 4: Parent Rollup and Optional Catalogs

### Parent Rollup
- [x] T019 Record residual recall gap as separate signal [small] — DEFERRED WITH REASON; per-scenario re-curation is out of scope for this path-refresh packet
- [x] T020 Record live-mode re-baseline deferral [small] — DEFERRED WITH REASON; live mode needs a configured provider, while router mode is the deterministic CI gate
- [x] T021 Record unrelated harness `intents` test failure [small] — OUT OF SCOPE; pre-existing failure surfaced during 037/038 and belongs to a separate subsystem

### Optional Feature Catalogs
- [x] T022 [P] Per-scenario gold re-curation [medium] — DEFERRED; optional follow-up if the team wants the 34-path curated-gold-vs-router gap reviewed scenario by scenario
- [x] T023 [P] Live-mode benchmark report [medium] — DEFERRED; requires provider configuration and is not required for the deterministic CI gate
- [x] T024 [P] Harness `intents` subsystem repair [medium] — SKIPPED; separate subsystem and not touched by this packet

<!-- /ANCHOR:phase-4 -->
---

<!-- ANCHOR:phase-5 -->
## Phase 5: Verification and Documentation

- [x] T025 Record verification evidence in checklist.md [small] — every item is checked with evidence grounded in the packet facts
- [x] T026 Record Files Changed and Deviations in implementation-summary.md [medium] — includes spec.md, playbook scenarios, router-final reports, benchmark README, close-out docs, metadata files, and scoped deviations
- [x] T027 Cross-reference spec.md, plan.md, and checklist.md [small]
- [x] T028 Self-verify close-out docs [small] — frontmatter, anchors, checkboxes, evidence, no invented commit SHAs, recall 66%, and verdict CONDITIONAL 71 reviewed

<!-- /ANCHOR:phase-5 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] Harness dependencies 037 and 038 confirmed landed before the gold refresh work.
- [x] All stale playbook gold paths translated to `code-<surface>/` packet paths with 71/71 existence checks passing and 0 stale-path files remaining.
- [x] Deterministic router-final regenerated: CONDITIONAL, aggregate 71/100, D5 100/100 hard-gate pass, and no cross-surface leak.
- [x] Honest recall recorded as 65/99 = 66%, with the residual 34-path gap deferred as optional re-curation rather than hidden.
- [x] Benchmark README statistic refreshed, frozen baseline untouched, and close-out docs cross-reference spec/plan/checklist.

<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`

<!-- /ANCHOR:cross-refs -->

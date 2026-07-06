---
title: "Tasks: Router-replay surface-slice sync to code-<surface> layout"
description: "Executed task list for the Lane-C router-replay surface-slicing fix: diagnose prefix drift, repair three prefix sites, add regression guard tests, prove leak elimination, and record scoped deferrals."
trigger_phrases:
  - "router replay surface slice tasks"
  - "surface slice sync tasks"
  - "code surface router replay tasks"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-router-replay-surface-slice-sync"
    last_updated_at: "2026-07-06T08:41:30.282Z"
    last_updated_by: "claude-opus"
    recent_action: "Surface-slicing drift diagnosed; prefix sync and guard tests completed"
    next_safe_action: "Run close-out validation and push; continue gold alignment in the follow-up packet"
---
# Tasks: Router-replay surface-slice sync to code-<surface> layout

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

- [x] T001 Confirm packet-037 scope and branch [small] — spec.md fixes the existing `system-deep-loop/036-router-replay-surface-slice-sync` packet on branch `system-speckit/028-memory-search-intelligence`
- [x] T002 Diagnose Lane-C router-replay surface-slicing drift [medium] — `router-replay.cjs` still keyed slicing on bare `webflow/`, `opencode/`, and `animation/` prefixes after sk-code moved to `code-*` packet folders
- [x] T003 Confirm root cause across the rename boundary [medium] — the sk-code folder rename updated packet folders and `smart_routing.md` `RESOURCE_MAP`, but not the deep-improvement harness string-literal slicing constants in a different tree
- [x] T004 Capture pre-fix leak diagnostic [small] — before the fix, 13 of 21 scored non-browser scenarios routed both `code-webflow/` and `code-opencode/` at once
- [x] T005 Capture baseline harness Vitest state [small] — baseline was 1 failed / 100 passed across 101 tests in 6 files, with the known `res.intents` expectation failure

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### sk-code Baseline
- [x] T006 Update `SURFACE_PREFIXES` in `router-replay.cjs` [small] — WEBFLOW, OPENCODE, and MOTION now reference `code-webflow/`, `code-opencode/`, and `code-animation/`
- [x] T007 Update `hasSurfaceLayout` detection [small] — detection now requires the current `code-webflow/references/` and `code-opencode/references/` prefixes that exist in the sk-code map

### sk-design Baseline
- [x] T008 Update OpenCode language sub-slice regex [small] — regex now matches `code-opencode/references/([^/]+)/` so language narrowing follows the renamed packet folder
- [x] T009 Leave prompt-token detectors unchanged [small] — `detectSurface` and `detectOpencodeLanguage` key on task text, not resource-folder names, so changing them would be scope drift

### deep-loop Baseline
- [x] T010 Add surface-slice regression guard file [medium] — `tests/surface-slice-sync.vitest.ts` adds four tests for single-surface slicing and corpus-wide no-over-routing
- [x] T011 Lock WEBFLOW and OPENCODE single-surface behavior [small] — guard asserts WEBFLOW keeps `code-webflow` and drops `code-opencode`; OPENCODE keeps `code-opencode` and drops `code-webflow`

### Comparison
- [x] T012 Lock UNKNOWN Motion overlay behavior and corpus invariant [medium] — guard asserts UNKNOWN Motion keeps `code-animation` while dropping both surfaces, and no scenario over-routes both surfaces corpus-wide

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

### Pre-Promotion Gate
- [x] T013 Re-run post-fix leak diagnostic [small] — after the fix, 0 of 21 scored non-browser scenarios routed both `code-webflow/` and `code-opencode/`
- [x] T014 Confirm named spot checks [small] — SD-001 routes `code-webflow` and no `code-opencode`; CS-004 keeps `code-animation` and drops both surfaces; LS-001 routes `code-opencode` only
- [x] T015 Run new regression guard tests [small] — the four added `surface-slice-sync.vitest.ts` tests pass

### Severity Promotion
- [x] T016 Re-run full harness Vitest suite [medium] — post-fix suite is 1 failed / 104 passed across 105 tests in 7 files; +4 tests are the new guard tests and all pass
- [x] T017 Compare failure identity to baseline [medium] — the single failure is the same pre-existing, out-of-scope `skill-benchmark.vitest.ts` `res.intents` assertion for a Webflow task returning `['code-webflow']` instead of containing `implement`

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:phase-4 -->
## Phase 4: Parent Rollup and Optional Catalogs

### Parent Rollup
- [x] T018 Capture post-slicing sk-code router-mode benchmark baseline [small] — scratch output recorded aggregate 48, D1-intra 68, D2 52, D3 25, D5 100, hard gate pass
- [x] T019 Classify the benchmark aggregate honestly [small] — the aggregate remains gold-limited because playbook gold still uses pre-rename paths and is not packet-037 success evidence
- [x] T020 Document sk-code gold alignment deferral [small] — alignment to the corrected router and `benchmark/router-final/` regeneration are deferred to `124-sk-code-parent/021-playbook-gold-and-lane-c-rebaseline`

### Optional Feature Catalogs
- [x] T021 [P] Hub-router intent-projection expectation sync [small] — DEFERRED; the pre-existing `res.intents` failure is an intent/mode-projection expectation, not surface-slicing
- [x] T022 [P] Broader benchmark gold rewrite [medium] — DEFERRED; operator directed a two-packet split to keep the harness fix clean
- [x] T023 [P] Commit SHA recording [small] — SKIPPED; no commit SHA exists at authoring time, with validate and push pending at close-out

<!-- /ANCHOR:phase-4 -->
---

<!-- ANCHOR:phase-5 -->
## Phase 5: Verification and Documentation

- [x] T024 Record verification evidence in checklist.md [small] — every checklist item has an evidence tag grounded in leak, Vitest, deferral, or close-out facts
- [x] T025 Record Files Changed and Deviations in implementation-summary.md [medium] — includes spec.md, router script, guard test, four close-out docs, metadata files, validation status, and scoped deviations
- [x] T026 Cross-reference spec.md, plan.md, and checklist.md [small]
- [x] T027 Self-verify close-out docs [small] — frontmatter, anchors, checked boxes, no invented commit SHAs, and no contradiction of evidence reviewed

<!-- /ANCHOR:phase-5 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] Root cause diagnosed: harness prefix constants drifted from the `code-*` packet layout while the documented router contract expected slicing to remain enforced.
- [x] Three-site fix applied in `router-replay.cjs`: `SURFACE_PREFIXES`, `hasSurfaceLayout`, and the OpenCode language regex now match the live layout.
- [x] Regression guard added and passing: four new tests lock single-surface slicing and corpus-wide no-over-routing.
- [x] Leak eliminated: 13/21 before fix to 0/21 after fix across scored non-browser scenarios.
- [x] No new harness regression introduced: suite remains at one pre-existing out-of-scope failure while passing count rises from 100 to 104.
- [x] Gold alignment, router-final regeneration, and pre-existing intents expectation sync documented as deferred/out of scope.

<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`

<!-- /ANCHOR:cross-refs -->

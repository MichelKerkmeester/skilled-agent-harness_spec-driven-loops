---
title: "Tasks: Scenario loader code-<surface> path parsing sync"
description: "Executed task list for the Lane-C scenario loader and live-result parser fix: diagnose truncation, sweep path matchers, repair four regex prefixes, export forbidden-prefix parsing, add regression guards, prove unblock, and record scoped deferrals."
trigger_phrases:
  - "scenario loader code surface tasks"
  - "code surface path parse tasks"
  - "load playbook code prefix tasks"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/038-scenario-loader-code-surface-sync"
    last_updated_at: "2026-07-05T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Loader truncation diagnosed; four prefix fixes, export, and guard tests completed"
    next_safe_action: "Validate and push; continue gold re-baseline follow-up"
---
# Tasks: Scenario loader code-<surface> path parsing sync

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

- [x] T001 Confirm packet-038 scope and branch [small] — spec.md fixes the existing `system-deep-loop/038-scenario-loader-code-surface-sync` packet on branch `system-speckit/028-memory-search-intelligence`
- [x] T002 Diagnose Lane-C scenario loader path truncation [medium] — loader and live-result parser recognized only `references/`, `assets/`, and `../shared/` prefixes after sk-code moved surface resources under `code-*` packet folders
- [x] T003 Confirm concrete truncation symptom [small] — a gold entry like `code-animation/references/decision_matrix.md` was parsed as `references/decision_matrix.md`, which neither exists nor matches the corrected router output
- [x] T004 Capture baseline harness Vitest state [small] — baseline was 1 failed / 104 passed across 105 tests in 7 files, with the known `res.intents` expectation failure
- [x] T005 Confirm follow-up boundary [small] — sk-code playbook gold translation and `benchmark/router-final/` regeneration are owned by `124-sk-code-parent/021-playbook-gold-and-lane-c-rebaseline`

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### sk-code Baseline
- [x] T006 Sweep harness for code-*-blind path matchers [medium] — found exactly four in-scope sites: `load-playbook-scenarios.cjs` `extractPaths` line 135 and `extractForbiddenPrefixes` line 152; `live-executor.cjs` prose-fallback line 265 and observed-reads line 296
- [x] T007 Exclude router-doc finder deliberately [small] — `router-replay.cjs` line 222 locates the router doc under `references/`, not surface gold, and is not on the sk-code hub path

### sk-design Baseline
- [x] T008 Update `extractPaths` in `load-playbook-scenarios.cjs` [small] — added the `code-[a-z]+/` alternative so `code-webflow`, `code-opencode`, and `code-animation` paths parse whole
- [x] T009 Update and export `extractForbiddenPrefixes` in `load-playbook-scenarios.cjs` [small] — forbidden-prefix parsing now captures `code-<surface>/` glob prefixes and is unit-testable

### deep-loop Baseline
- [x] T010 Update live-executor prose-fallback parser [small] — prose fallback now recognizes `code-[a-z]+/` packet paths whole alongside universal tiers
- [x] T011 Update live-executor observed-reads parser [small] — observed reads now recognize `code-[a-z]+/` packet paths whole alongside universal tiers

### Comparison
- [x] T012 Preserve universal-tier behavior [small] — `references/`, `assets/`, and `../shared/` gold parse exactly as before because the change is additive

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

### Pre-Promotion Gate
- [x] T013 Add code-surface path parse regression guard [medium] — `tests/code-surface-path-parse.vitest.ts` adds two tests for whole-path extraction and forbidden-prefix extraction
- [x] T014 Prove whole-path extraction directly [small] — `extractPaths("- code-animation/references/decision_matrix.md ...")` returns `code-animation/references/decision_matrix.md` and does not emit `references/decision_matrix.md`
- [x] T015 Run new regression guard tests [small] — the two added `code-surface-path-parse.vitest.ts` tests pass

### Severity Promotion
- [x] T016 Re-run full harness Vitest suite [medium] — post-fix suite is 1 failed / 106 passed across 107 tests in 8 files; +2 tests are the new guard tests and both pass
- [x] T017 Compare failure identity to baseline [medium] — the single failure is the same pre-existing, out-of-scope `skill-benchmark.vitest.ts` `res.intents` assertion for a Webflow task returning `['code-webflow']` instead of containing `implement`

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:phase-4 -->
## Phase 4: Parent Rollup and Optional Catalogs

### Parent Rollup
- [x] T018 Temporarily translate sk-code gold for unblock proof [small] — gold was translated to code-<surface>/ paths only long enough to measure the corrected loader and router together
- [x] T019 Capture end-to-end recall proof [small] — with loader fixed and gold translated, gold-router recall rose from ~0 to 66% (65 of 99 gold paths)
- [x] T020 Capture router-mode verdict recovery [small] — verdict recovered from 47 FAIL to 71 CONDITIONAL, with D1-intra 87, D2 79, D3 47, D5 100, matching the pre-regression historical baseline
- [x] T021 Revert temporary gold translation [small] — playbook returned remote-clean so the follow-up packet owns the gold translation and re-baseline

### Optional Feature Catalogs
- [x] T022 [P] sk-code playbook gold translation and router-final regeneration [medium] — DEFERRED; operator directed keeping harness fixes separate from `124-sk-code-parent/021-playbook-gold-and-lane-c-rebaseline`
- [x] T023 [P] Hub-router intent-projection expectation sync [small] — DEFERRED; the pre-existing `res.intents` failure is an intent/mode-projection expectation, not path parsing
- [x] T024 [P] Commit SHA recording [small] — SKIPPED; no commit SHA exists at authoring time, with validate and push pending at close-out

<!-- /ANCHOR:phase-4 -->
---

<!-- ANCHOR:phase-5 -->
## Phase 5: Verification and Documentation

- [x] T025 Record verification evidence in checklist.md [small] — every checklist item has an evidence tag grounded in parser proof, Vitest baseline/post-fix results, end-to-end proof, or scoped deferrals
- [x] T026 Record Files Changed and Deviations in implementation-summary.md [medium] — includes spec.md, two harness scripts, guard test, four close-out docs, metadata files, validation status, and scoped deviations
- [x] T027 Cross-reference spec.md, plan.md, and checklist.md [small]
- [x] T028 Self-verify close-out docs [small] — frontmatter, anchors, checked boxes, no invented commit SHAs, and no contradiction of evidence reviewed

<!-- /ANCHOR:phase-5 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] Root cause diagnosed: loader and live-parser path regexes truncated `code-<surface>/` packet paths to universal-tier suffixes.
- [x] Completeness sweep completed: exactly four in-scope code-*-blind path matchers found; router-doc finder excluded for a documented reason.
- [x] Four prefix fixes applied: `extractPaths`, `extractForbiddenPrefixes`, live prose fallback, and live observed reads now accept `code-[a-z]+/` paths.
- [x] `extractForbiddenPrefixes` exported for direct unit coverage.
- [x] Regression guard added and passing: two new tests lock whole-path parse behavior and forbidden-prefix parse behavior.
- [x] Whole-path parse proven: `code-animation/references/decision_matrix.md` is returned intact and `references/decision_matrix.md` is not emitted.
- [x] No new harness regression introduced: suite remains at one pre-existing out-of-scope failure while passing count rises from 104 to 106.
- [x] End-to-end unblock proven with temporary gold translation, then reverted so gold translation and re-baseline remain in the follow-up packet.

<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`

<!-- /ANCHOR:cross-refs -->

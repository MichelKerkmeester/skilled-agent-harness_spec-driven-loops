---
title: "Tasks: Phase 11: full-page-capture"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "task breakdown"
  - "implementation tasks"
  - "verification checklist"
  - "task dependencies"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 11: full-page-capture

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 [P] Confirm 009's `assets/diagrams/` merge and 007's fixes to dp-integration, venn, template-full and the swimlane HANDOFF mask are actually on disk — read directly, not trusted from either phase's own checkbox state — and record which of the four content findings are still open, since the CAP-001 rerun (T013) must state this honestly either way (REQ-007) (goal.md) — executor: DeepSeek-V4.1-Flash max via cli-pi (llmgateway) — evidence: corpus layout and content-fix state as read at execution time
- [ ] T002 [P] Re-read `.opencode/skills/sk-design/shared/scripts/render-screenshots.cjs` end to end (`WIDTH`/`HEIGHT` constants, `captureOnce`, `capture`, `htmlFilesUnder`, `destinationFor`, `main`) and confirm both `sk-design-diagram/README.md` and `sk-design-chart/README.md` call it with the same two positional arguments, so REQ-003's byte-identity proof targets the correct shared seam (D12) (.opencode/skills/sk-design/shared/scripts/render-screenshots.cjs) — executor: DeepSeek-V4.1-Flash max via cli-pi (llmgateway) — evidence: confirmed shared call sites; no third caller
- [ ] T003 [P] Re-measure the corpus's tall forms against the execution-time state of `assets/diagrams/` (or its pre-merge equivalent) using the temp-copy `--dump-dom` technique validated in this phase's authoring pass; confirm the baseline set — `template-full` 1364px, `example-sequence-oauth` 1004px, `example-sequence-oauth-full` 1411px, `example-sequence-oauth-dark` 1004px, `example-loop-terminal` 1039px, `example-quadrant-consultant` 1342px — still holds or record what changed (spec.md §2) — executor: DeepSeek-V4.1-Flash max via cli-pi (llmgateway) — evidence: measured heights for all six forms, reconciled against this spec's authoring-time baseline
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Add the `--full-page` CLI flag to `render-screenshots.cjs`'s argument parsing, defaulting to off, so `sk-design-chart`'s unflagged invocation is untouched (REQ-001) (.opencode/skills/sk-design/shared/scripts/render-screenshots.cjs) — executor: DeepSeek-V4.1-Flash max via cli-pi (llmgateway) — evidence: `grep -n -- "--full-page"` finds the flag parse
- [ ] T005 Add `measureContentHeight(src)`: copy `src` to an OS temp file, append a `<script>` before `</body>` that sets a `<meta name="rs-measured-height">` to `Math.ceil(document.documentElement.getBoundingClientRect().height)` after `load` plus a short settle, run Chrome with `--dump-dom --virtual-time-budget=${SETTLE_MS}` against the temp file, regex-parse the meta value, delete the temp file in a `finally`, and return `null` (never throw) when parsing fails or the value is non-positive (REQ-002) (.opencode/skills/sk-design/shared/scripts/render-screenshots.cjs) — executor: DeepSeek-V4.1-Flash max via cli-pi (llmgateway) — evidence: function present; a manual run against `template-full.html` returns `1364`
- [ ] T006 Document the measurement technique in a comment directly above `measureContentHeight`: name `document.documentElement.getBoundingClientRect().height` as the source of truth and state why a temp copy is measured rather than the live source (never capture from the modified copy) (REQ-002) (.opencode/skills/sk-design/shared/scripts/render-screenshots.cjs) — executor: DeepSeek-V4.1-Flash max via cli-pi (llmgateway) — evidence: `grep -n "getBoundingClientRect"` finds the comment
- [ ] T007 Thread the flag through `capture`/`captureOnce` so the real capture — always on the pristine original file, never the temp copy — uses `--window-size=${WIDTH},${measuredHeight}` when `--full-page` is set and falls back to `${WIDTH},${HEIGHT}` when measurement returned `null`, printing a warning naming the fallen-back file (REQ-001, REQ-002) (.opencode/skills/sk-design/shared/scripts/render-screenshots.cjs) — executor: DeepSeek-V4.1-Flash max via cli-pi (llmgateway) — evidence: `captureOnce` accepts a height parameter; the unflagged path calls it with the unchanged fixed `HEIGHT`
- [ ] T008 Re-run `sk-design-chart`'s exact documented capture command (`node ../shared/scripts/render-screenshots.cjs ./assets ./screenshots`, no flag) into a scratch directory and `diff -rq` it against the committed `sk-design-chart/screenshots/`; confirm empty output (REQ-003) (.opencode/skills/sk-design/sk-design-chart/screenshots/) — executor: DeepSeek-V4.1-Flash max via cli-pi (llmgateway) — evidence: `diff -rq` output is empty
- [ ] T009 Run `render-screenshots.cjs ./assets ./screenshots --full-page` from `sk-design-diagram/`, covering `assets/diagrams/` and `assets/icons.html`; remove the now-orphaned `screenshots/examples/` and `screenshots/templates/` directories as superseded 1:1 by `screenshots/diagrams/` (REQ-004) (.opencode/skills/sk-design/sk-design-diagram/screenshots/) — executor: DeepSeek-V4.1-Flash max via cli-pi (llmgateway) — evidence: `screenshots/diagrams/*.png` covers every source under `assets/diagrams/`; old directories removed
- [ ] T010 For every regenerated PNG, compare its pixel height (`sips -g pixelHeight`) against its source's independently measured content height; report zero mismatches, or name and fix any that disagree before proceeding (REQ-005) (.opencode/skills/sk-design/sk-design-diagram/screenshots/diagrams/) — executor: DeepSeek-V4.1-Flash max via cli-pi (llmgateway) — evidence: per-file height comparison table, zero mismatches
- [ ] T011 [P] Update `sk-design-diagram/README.md`'s regeneration snippet to include `--full-page`; confirm `sk-design-chart/README.md`'s snippet is untouched (REQ-009, D12) (.opencode/skills/sk-design/sk-design-diagram/README.md) — executor: DeepSeek-V4.1-Flash max via cli-pi (llmgateway) — evidence: `grep -n -- "--full-page"` finds it in the diagram README only; `git diff` over the chart README is empty
- [ ] T012 [P] Add the note that a capture review reads full-page images to `manual-testing-playbook.md`'s CAP-001 section or `capture-review/capture-review.md`, naming S10 as the reason (REQ-008) (.opencode/skills/sk-design/sk-design-diagram/manual-testing-playbook/capture-review/capture-review.md) — executor: DeepSeek-V4.1-Flash max via cli-pi (llmgateway) — evidence: note present, citing S10
- [ ] T013 Re-run CAP-001: `node .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-manual-playbook-scenario.cjs --skill .opencode/skills/sk-design/sk-design-diagram --scenario CAP-001 --variant capture-review --outcome-json <path>`, with the outcome JSON's reason addressing all five prior findings by name and `executionContext.supersedes` naming `2026-09-11--manual-testing-playbook--capture-review` (REQ-006, REQ-007) (.opencode/skills/sk-design/sk-design-diagram/benchmark/reports/) — executor: human review, two fresh readers (matching CAP-001's own methodology) — evidence: new report folder, `skill-benchmark-report.json` with `scenarioId: "CAP-001"` and all five findings addressed
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T014 Read the new report's `skill-benchmark-report.md`/`.json` in full: confirm no finding is left with an empty reason, any `SKIP` names its blocker, and the file was produced by the runner, not hand-edited (REQ-006, REQ-007) (.opencode/skills/sk-design/sk-design-diagram/benchmark/reports/) — executor: human review — evidence: report read line by line; no empty-reason SKIP; all five findings addressed
- [ ] T015 Run `node .opencode/skills/sk-design/sk-design-diagram/scripts/check-diagram-corpus.cjs` and confirm `RESULT: PASSED` still holds after the reshoot — a regression guard, since the reshoot touches only `screenshots/`, never `assets/` (.opencode/skills/sk-design/sk-design-diagram/scripts/check-diagram-corpus.cjs) — executor: human review — evidence: `RESULT: PASSED`
- [ ] T016 Open the six previously-cropped forms plus two short forms (e.g. `example-bar.html`) from `screenshots/diagrams/` and visually confirm no legend, footer or info card is cut off, and that the shrunk-short forms still read cleanly (spec.md Edge Cases) (.opencode/skills/sk-design/sk-design-diagram/screenshots/diagrams/) — executor: human review — evidence: eight-file visual spot-check, no crop observed
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Requirements documented in spec.md — REQ-001 through REQ-009 present
- [ ] CHK-002 [P0] Technical approach defined in plan.md — measurement technique, affected-surfaces table and rollback plan present
- [ ] CHK-003 [P1] Dependencies identified and available — `render-screenshots.cjs` read in full, 009/007 state to be re-checked at execution time (T001), `run-manual-playbook-scenario.cjs` confirmed working via the first CAP-001 report
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] `render-screenshots.cjs` still runs clean with no syntax errors after the flag is added
- [ ] CHK-011 [P0] No console errors or warnings from either the flagged or unflagged capture path, beyond the intentional fallback-file warning
- [ ] CHK-012 [P1] Measurement failures degrade to the fixed-height fallback rather than throwing
- [ ] CHK-013 [P1] The new code follows the file's existing style — no dependency added, `execFileSync` against the system Chrome binary only
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria in `acceptance-criteria.md` met
- [ ] CHK-021 [P0] Manual testing complete: byte-diff proof (T008), per-file height comparison (T010), CAP-001 rerun (T013), visual spot-check (T016)
- [ ] CHK-022 [P1] Edge cases tested: a short form (`example-bar.html`) shrinks correctly; a measurement failure falls back correctly
- [ ] CHK-023 [P1] Error scenarios validated: `--dump-dom` failure path exercised against at least one file
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Finding class: this phase is `class-of-bug` (the fixed viewport crops every tall form corpus-wide, not one instance) with a `cross-consumer` dimension (the fix lives in a script shared with `sk-design-chart`).
- [ ] CHK-FIX-002 [P0] Same-class producer inventory completed: `grep -rn "render-screenshots.cjs"` confirms exactly two call sites (plan.md §Affected Surfaces).
- [ ] CHK-FIX-003 [P0] Consumer inventory completed: `sk-design-diagram/README.md`, `sk-design-chart/README.md`, `sk-design-chart/screenshots/*.png`, `.github/workflows/diagram-corpus.yml` — all listed with their action or non-action in plan.md §Affected Surfaces.
- [ ] CHK-FIX-004 [P0] Not applicable — no path/redaction/parser/security surface is touched by this phase.
- [ ] CHK-FIX-005 [P1] Matrix axes listed before completion: `{flag present|absent} x {measurement succeeds|falls back}` (plan.md §Affected Surfaces).
- [ ] CHK-FIX-006 [P1] Not applicable — no process-wide or hostile-env state is read by this change.
- [ ] CHK-FIX-007 [P1] Evidence for the byte-diff and height-comparison proofs is pinned to the fix commit, not a moving branch-relative range.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets
- [ ] CHK-031 [P0] No new external reachability — the measurement pass renders a local temp copy of an already-local file only
- [ ] CHK-032 [P1] Not applicable — no auth/authz surface in this phase
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks/acceptance-criteria/goal synchronized with the final state
- [ ] CHK-041 [P1] Code comments adequate — the measurement technique is documented beside its implementation (T006)
- [ ] CHK-042 [P2] `sk-design-diagram/README.md` regeneration snippet updated (T011)
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files in scratch/ only — the measurement pass's own temp copies live in an OS temp directory, never under this packet's `scratch/` or the skill tree, and are removed on every run including error paths
- [ ] CHK-051 [P1] scratch/ cleaned before completion
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 13 | [ ]/13 |
| P1 Items | 10 | [ ]/10 |
| P2 Items | 1 | [ ]/1 |

**Verification Date**: 2026-09-11
<!-- /ANCHOR:summary -->

---

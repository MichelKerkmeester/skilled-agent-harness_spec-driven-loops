---
title: "Implementation Summary: stop free text hijacking Next Focus in research and review"
description: "Research no longer carries status sentences or answered questions forward as open questions, reads the leaf's Recommended Next Focus, and review names the first uncovered dimension over free leaf text."
trigger_phrases:
  - "focus hijack fix"
  - "carried forward question filter"
  - "first uncovered dimension next focus"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/004-focus-hijack-fix"
    last_updated_at: "2026-11-20T20:01:08Z"
    last_updated_by: "generate-context"
    recent_action: "Fixed the focus chain on both loops; DR-066, DRV-073 and the phase changelog written"
    next_safe_action: "None for this phase; the full runtime suite runs at the integration merge gate"
    packet_purpose: "Purpose: Next Focus on both loops comes from an open, unanswered question or an uncovered dimension, and the leaf's recommendation is read at one stated place in each chain instead of leaking in through free text."
    blockers: []
    key_files:
      - ".skilled/skills/system-deep-loop/runtime/lib/deep-loop/continuity-thread.cjs"
      - ".skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs"
      - ".skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs"
    session_ref:
      runtime: "claude"
      sessionId: "91021a9f-dca3-4cb7-9743-2973efffa465"
      workspace: "/Users/michelkerkmeester/worktrees/public/455-expansive-depth-integration"
      savedAt: "2026-11-20T20:01:08Z"
      locatorKind: "transcript_path"
      version: 1
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 004-focus-hijack-fix |
| **Completed** | 2026-11-17, code and tests; the playbook scenarios and changelog entry were added at integration (see Known Limitations) |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Stale free text no longer steers Next Focus on either loop.

On research, `buildCarriedForwardOpenQuestions` now carries an item forward only when it is question-shaped, meaning it ends in `?` or equals a registry question, and drops any item that equals an answered or resolved question. `buildRegistry` passes it the registry questions and the resolved ones, so every consumer of the persisted list sees the filtered set: the registry field, the metric, strategy section 11A and the suppressed-candidate builder. The leaf's `## Recommended Next Focus` now has a reader. `deriveNextFocusFromContinuity` returns it ahead of the carried-forward thread when at least one machine question is open, unless it equals a resolved question or matches a rejected next-focus pattern. It never overrides the terminal sentinel.

On review, `pickReviewBaseFocus` serves both the strategy `11. NEXT FOCUS` block and the dashboard. It keeps a leaf focus only when it names an uncovered required dimension, or when every dimension is covered. Otherwise it returns the first uncovered dimension. Pivot focus and blocked-stop recovery keep their precedence on both loops.

**Default-path change.** Next Focus and the carried-forward open-question list change on normal research and review runs, not only under a flag. The changelog entry for this phase must name both changes.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/continuity-thread.cjs` | Modified | Question-shape and answered filter in `buildCarriedForwardOpenQuestions`; leaf-recommendation step in `deriveNextFocusFromContinuity` |
| `.skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs` | Modified | `buildRegistry` passes registry and resolved questions; `resolveNextFocus` passes the latest leaf `nextFocus` (rejected-pattern filtered) and the resolved questions |
| `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs` | Modified | `pickReviewBaseFocus` replaces the strategy base pick and its dashboard twin |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/continuity-thread.vitest.ts` | Modified | Six cases: question shape, registry-question keep, answered drop, leaf ahead of thread, resolved leaf skipped, terminal sentinel |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/deep-research-reduce-state.vitest.ts` | Modified | Resolved question listed as remaining, status sentence, leaf reader with resolved skip, rejected leaf pattern |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/deep-review-state-reducer.vitest.ts` | Modified | First uncovered dimension outranks free leaf text in strategy and dashboard |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Seven one-change DeepSeek V4.1 Flash dispatches on the Pi lane: three test briefs first, then the continuity filter, the review pick, the leaf step, the research call sites and the rejected-pattern guard. The orchestrator read each diff and reran each check. Briefs and results are in `scratch/dispatch/`, and the baseline and fail-before output are in `scratch/baseline.txt`.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Rationale |
|----------|-----------|
| Carried text must end in `?` or equal a registry question | Accepted planning call, ADR-001 |
| The filter lives in the shared helper, fed from `buildRegistry` | Every reader of the persisted list sees the same filtered set |
| A leaf recommendation passes the rejected-pattern suppression | Added beyond the spec. Without it, the new reader would let a focus the operator rejected come back through the leaf. A case shows it failing without the guard |
| Review keeps a leaf focus that names an uncovered dimension | REQ-003 outranks only free text that names no uncovered dimension; a leaf that points at real uncovered work keeps its wording |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Test Type | Status | Notes |
|-----------|--------|-------|
| Baseline | Recorded | Three suites: 57 passed, exit 0 (`scratch/baseline.txt`) |
| Fail before (SC-001) | Pass | After the test briefs and before any source edit: 7 failed, 60 passed. All seven failures are the new P0 cases. The rejected-pattern case failed with its guard line removed (1 failed, 36 passed), and the line was restored |
| Three suites (SC-002, REQ-006) | Pass | `npx vitest run tests/unit/deep-research-reduce-state.vitest.ts tests/unit/continuity-thread.vitest.ts tests/unit/deep-review-state-reducer.vitest.ts`: 3 files, 68 passed, exit 0 |
| Existing cases unchanged (REQ-004) | Pass | `git diff` on the research and review reducer suites removes no line |
| Leaf reader (REQ-002) | Pass | `rg -n "\.nextFocus"` on the research reducer prints the read in `resolveNextFocus` at line 2458, outside the parser |
| Related suites | Pass | Ten unit suites that read next focus, ledgers or the prompt pack: 308 passed. `deep-research-postflip-fanout`: 4 passed |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Playbook scenarios (T011) and changelog entry (T012)** were written at integration: DR-066 and DRV-073 in the playbooks, and `changelog/v2.1.3.0.md`.
2. **Imperative items without a question mark** are no longer carried forward, for example `Investigate the review twin`. Such an item still reaches Next Focus as the leaf's `## Recommended Next Focus`, and a continuity case pins the rule.
3. **Full runtime suite** runs once at merge in the integration worktree, not here.
<!-- /ANCHOR:limitations -->

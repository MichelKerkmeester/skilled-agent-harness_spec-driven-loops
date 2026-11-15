---
title: "Implementation Summary"
description: "Open with a hook: what changed and why it matters. One paragraph, impact first."
trigger_phrases:
  - "runtime council removal implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/loop-architecture/004-workflow-logic-hardening/006-ai-council-mode-deprecation/003-runtime-council-removal"
    last_updated_at: "2026-11-15T01:30:00Z"
    last_updated_by: "claude-code"
    recent_action: "Closed child 003 with every acceptance row Met"
    next_safe_action: "Close child 004"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-003-runtime-council-removal"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata
<!-- FILL: Fill the folder name, the completion date and the level. Use the real date. GOOD: `004-rotate-logs-keep`. Completed 2026-10-24. Level 1. WEAK: Folder: TBD. -->

| Field | Value |
|-------|-------|
| **Spec Folder** | 003-runtime-council-removal |
| **Completed** | 2026-11-15 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built
<!-- FILL: Open with the user-visible change in two sentences, then list each changed file. GOOD: `--keep 3` leaves three archives in `logs/archive`. A plain run leaves all ten. WEAK: Implemented the feature. -->

The runtime no longer has a council loop type. `convergence.cjs`, `upsert.cjs`, `query.cjs` and `status.cjs` accept research, review and context, and 51 council files are deleted.

### Phase 3: runtime-council-removal

With the mode gone, nothing drove the council graph, ledger, reducers or sealed artifacts. Keeping them meant every shared library carried a third member that no run could reach. They are removed, and `--loop-type council` now fails with an input validation error instead of running dead code.

One council file stays. The divergent pivot in research and review convenes three seats when a run stalls, and it calls `runtime/lib/council/multi-seat-dispatch.cjs`. That file, its test and every pivot field are unchanged.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `runtime/scripts/convergence.cjs`, `upsert.cjs`, `query.cjs`, `status.cjs` | Modified | Three loop types. `convergence.cjs` drops `--round-id` |
| `runtime/scripts/append-mode-event.cjs`, `check-projection-coverage.cjs` | Modified | No council mode |
| `runtime/lib/council/` except `multi-seat-dispatch.cjs` | Deleted | Council graph, convergence, scoring, cost guards and round state |
| `runtime/lib/deep-ai-council-ledger-schema/`, `-reducers/`, `-sealed-artifacts/` | Deleted | The council ledger libraries |
| `runtime/lib/legacy-projections/deep-ai-council-config-state-contract.ts` | Deleted | The council legacy contract |
| Shared libraries under `runtime/lib/` | Modified | Adjudication, the write-set conflict graph, locks, path coverage, stopping clocks and the ledger adapter lose their council member |
| `runtime/scripts/check-documentation-drift.cjs` | Modified | Expects two mode families and no council playbook |
| `.skilled/commands/doctor/deep-loop.md` and its assets | Modified | `--scope=research\|review\|both\|all` |
| Runtime READMEs, references, catalog and playbook | Modified | Describe what is left |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered
<!-- FILL: Name the commands that proved it and the order they ran. GOOD: Ran `--keep 3` and a plain run, then the suite. All three passed. WEAK: Tested and shipped. -->

Three DeepSeek dispatches did the scripts, the shared libraries and the docs. Each diff was read, then the typecheck and the runtime suite were run. The first suite run had 2900 passed and 4 failed on stale contract digests. Both contracts were recompiled and the affected files rerun green. The work is commit `5a9e04f242`, after the commit that holds children 002 and 004.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions
<!-- FILL: Write one decision per row. Give the reason, not the label. GOOD: Option over environment variable: one run can pick a different count without editing config. WEAK: Used the best approach. -->

| Decision | Why |
|----------|-----|
| The conflict graph's independence check compares research with review | It used to compare a loop with the council. Two real loop types keep the check meaningful. |
| `LegacyCouncilBridge` became `LegacyConvergenceBridge` | The type now serves research and review only, and the old name would mislead the next reader. |
| `--round-id` is removed | Only the council branch read it. A flag nothing reads hides typos. |
| `runtime/database/council-graph.sqlite` stays on disk | It is a tracked data file. The docs call it legacy and say no script reads or writes it. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification
<!-- FILL: Write one check per row with the exact output. GOOD: `ls logs/archive | wc -l` after `--keep 3`: 3. After a plain run: 10. Suite: PASSED. WEAK: All tests pass. -->

| Check | Result |
|-------|--------|
| `node runtime/scripts/convergence.cjs --loop-type council` | `INPUT_VALIDATION`, `loopType must be "research", "review", or "context"`, exit 3 |
| `npm run typecheck` in the runtime | 0 errors |
| Runtime vitest suite at close | 172 files passed, 2904 passed, 8 skipped |
| Divergent pivot and multi-seat dispatch tests | 2 files passed, 21 tests |
| `node runtime/scripts/check-documentation-drift.cjs` | `"errors": []` |
| `validate.sh` on this folder with `--strict` | `RESULT: PASSED` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations
<!-- FILL: Name one real limit and the workaround. GOOD: `--keep` deletes the older archives for good. Copy `logs/archive/` aside first when a run may cut too deep. WEAK: No limitations. -->

1. **A script that passes `--loop-type council` now fails.** The error names the three accepted values. A council run goes through `/speckit:ai-council`, which uses no runtime script.
2. **The legacy council graph file is unused.** Deleting it is a separate change, because it is tracked data and nothing here proves no outside tool opens it.
<!-- /ANCHOR:limitations -->

---



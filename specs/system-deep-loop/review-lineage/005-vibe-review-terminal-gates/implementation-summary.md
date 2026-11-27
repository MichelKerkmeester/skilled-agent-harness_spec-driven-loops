---
title: "Implementation Summary"
description: "A fan-out review lineage is now told to record its terminal gates before synthesis and is stopped at close-out when it did not, and the append gateway refuses a lineage row that names the root run or a closeout staged by another run."
trigger_phrases:
  - "vibe review terminal gates implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/review-lineage/005-vibe-review-terminal-gates"
    last_updated_at: "2026-11-27T12:10:00Z"
    last_updated_by: "builder"
    recent_action: "Built the prompt lines, the gateway refusal, the close-out refusal and their tests"
    next_safe_action: "Rerun a Vibe review fan-out to see the gate recorded live"
    blockers: []
    key_files:
      - ".skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs"
      - ".skilled/skills/system-deep-loop/runtime/scripts/append-mode-event.cjs"
      - ".skilled/skills/system-deep-loop/runtime/scripts/synthesis-closeout.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "builder-005-vibe-review-terminal-gates"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 005-vibe-review-terminal-gates |
| **Completed** | 2026-11-27 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A review lineage that reaches its iteration cap is now told to run the terminal gates before synthesis, and the close-out refuses it while it can still do so. A lineage row that names the root run, or a closeout event staged by another run, is refused at the gateway before it reaches the ledger.

### Two causes, two fixes

The missing gate row had one cause. The lineage prompt said to loop "until config.maxIterations is reached" and called the synthesis row the terminal record, and it never named `record_terminal_gates`. That step lives only inside the stop branch of `step_handle_convergence`, and both Vibe lineages counted to ten and went straight to synthesis without running `convergence.cjs` or `terminal-gates.cjs` once. The prompt now carries the gate command and its event for every review lineage. `synthesis-closeout.cjs` now refuses a review lineage close-out whose state log holds no `terminal_gates` row.

The root session id had a second cause. vibe-1 wrote its config with `cfg.sessionId=root.sessionId`, copying the root config from the parent folder, and the close-out reads the id from that config. The prompt now pins the lineage session id and forbids that copy. The gateway now refuses any row in `lineages/<label>/` whose scope names the root config's session id. The research stray row in pi-2 is the same class: vibe-1 kept its event folder path in the fixed file `/tmp/event-dir.txt` and never removed the folder, and pi-2's gateway appended that staged vibe-1 event. The gateway now refuses a lineage closeout event whose run id differs from the lineage config's own.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` | Modified | Stop gate and run identity lines in the lineage prompt |
| `.skilled/skills/system-deep-loop/runtime/scripts/append-mode-event.cjs` | Modified | `lineageScopeRefusal` runs before every append |
| `.skilled/skills/system-deep-loop/runtime/scripts/synthesis-closeout.cjs` | Modified | `assertReviewLineageStopGate` runs before any event is staged |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/fanout-lineage-run-identity.vitest.ts` | Created | 9 tests over the three changes |
| `.skilled/skills/system-deep-loop/runtime/tests/fixtures/golden-review-default/lineage-prompt.txt` | Modified | Regenerated |
| `.skilled/skills/system-deep-loop/runtime/tests/fixtures/golden-research-default/lineage-prompt.txt` | Modified | Regenerated |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The causes were proved from the run folders before any edit: zero `terminal_gates` hits in every ledger frame, zero executed `terminal-gates.cjs` and `convergence.cjs` commands in either Vibe session, and the vibe-1 config command that copied the root id. The clean baseline ran with the edited scripts set aside. The new tests ran against the unchanged scripts, where 5 of 9 failed, and then with the change, where 9 of 9 passed.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Keep the runner's completion check as it is | It is the check that caught a lineage which skipped its gate |
| Refuse at close-out instead of recording the gates there | A close-out that wrote the gate row itself would let a lineage that skipped its stop gate pass, and the verdict was already bound before the close-out runs |
| Key the gateway rule on the `lineages/<label>/` folder and the root config | It needs no environment variable, which was not shown to reach the Vibe shell |
| Compare only the research `runId` with the root | A research row's `lineageId` names the root as its parent on purpose |
| Leave `runScope` reading the config | Reading the id from the config beside the state log was an earlier decision, and the fix belongs where the wrong id enters |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `fanout-lineage-run-identity.vitest.ts` with the unchanged scripts | FAIL as intended: 5 of 9 fail, the 4 that pass are the positive controls and the research prompt case |
| `fanout-lineage-run-identity.vitest.ts` with the change | PASS: 9 of 9 |
| Runtime suite before | PASS: 225 files, 4,071 passed, 11 skipped |
| Runtime suite after | PASS: 226 files, 4,080 passed, 11 skipped. The +9 are the new file |
| `npm run typecheck` | PASS: exit 0 |
| Scan of three recent fan-outs for lineage rows carrying the root id | 0 rows in 11 lineages |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **No live rerun.** The prompt lines depend on the model following them, and no Vibe fan-out has run since the change. The close-out and gateway refusals hold either way, so a lineage that ignores the prompt now fails in session with a named reason instead of at the runner.
2. **The pi-2 path is inferred.** pi-2 left no session log, so the read of `/tmp/event-dir.txt` by pi-2 is not shown directly. The staged vibe-1 file is still on disk with the exact content of the stray row.
<!-- /ANCHOR:limitations -->

---

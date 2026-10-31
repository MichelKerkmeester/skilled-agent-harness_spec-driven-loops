---
title: "Implementation Summary"
description: "The goal-file manifest check no longer waits on fsmonitor, which had held one CLI suite run for 853 s, and the speed loop now rebuilds a dirty sandbox before the next round instead of dropping that variant for the rest of the run."
trigger_phrases:
  - "follow up fixes implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/054-weak-model-spec-authoring/019-follow-up-fixes"
    last_updated_at: "2026-10-26T19:30:00Z"
    last_updated_by: "phase-doc-writer"
    recent_action: "Filled the phase docs for both fixes, the review and its remediation"
    next_safe_action: "None: phase complete"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "054-019-follow-up-fixes"
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
<!-- FILL: Fill the folder name, the completion date and the level. Use the real date. GOOD: `004-rotate-logs-keep`. Completed 2026-10-24. Level 1. WEAK: Folder: TBD. -->

| Field | Value |
|-------|-------|
| **Spec Folder** | 019-follow-up-fixes |
| **Completed** | 2026-10-26 on `worktrees/217-weak-model-spec-authoring`, not committed |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built
<!-- FILL: Open with the user-visible change in two sentences, then list each changed file. GOOD: `--keep 3` leaves three archives in `logs/archive`. A plain run leaves all ten. WEAK: Implemented the feature. -->

`recursive-child-manifest.vitest.ts` now passes in 615 ms, where a full CLI suite run had held it for 853305 ms on fsmonitor. A speed-loop sandbox that turns dirty is now rebuilt before the next round, so a stray vitest run costs that variant one round instead of every round left.

### Phase 19: follow-up-fixes

The manifest check runs both of its git calls with `-c core.fsmonitor=false`, and one comment says why: an index read can block for minutes on the fsmonitor hook. The file keeps mode 100755 and still fails closed with exit 2 when git is missing.

Before each round after the first, the loop runs `prepare.sh` for any sandbox marked `DIRTY` or still holding the packet track. This happens before the round's start time is taken, so the rebuild never counts toward a timed step. You keep the rebuild only when its `head=` matches the head recorded at the start of the run and, for a task with a terms file, its `task_term_refs=` is 0; otherwise the loop prints the refusal reason, marks the sandbox `DIRTY` again and that variant's steps abort. A dry run calls `prepare.sh --dry-run` and skips the round-start plan for any variant the start-of-run block already planned to prepare.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `specs/system-deep-loop/036-deep-loop-innovation/004-gate-closeout-and-drift/001-whole-system-gate/check-goal-file-manifest.sh` | Modified | fsmonitor off on `rev-parse` and `ls-files`, one comment line |
| `../011-authoring-speed-research/scratch/speed-loop/loop.sh` | Modified | `ready_field` and `reprepare` helpers, the start-of-run head record, `PREPPED`, `REFUSED`, and the round-start call |
| `../011-authoring-speed-research/scratch/speed-loop/README.md` | Modified | "Re-prepare between rounds" section |
| `scratch/review.md` | Created | Review verdict, findings and remediation status |
| `scratch/test/reprepare-harness.sh` | Created | Runs the extracted `reprepare` against a stub `prepare.sh`; output in `reprepare-harness.txt` |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered
<!-- FILL: Name the commands that proved it and the order they ran. GOOD: Ran `--keep 3` and a plain run, then the suite. All three passed. WEAK: Tested and shipped. -->

DeepSeek V4.1 Flash made change A through cli-pi from `scratch/briefs/brief-A.txt` (output `scratch/runs/A.out`), exiting 0 on the first dispatch. Its content edit was right, but it changed the file mode to 100644. Opus made change B. A review found that mode change as the one P1 and three optional P2s in `loop.sh`. A remediation pass restored the executable bit and fixed the dry-run P2. The conductor then made a refusal final, so a refused variant is no longer rebuilt every remaining round, and ran the real re-prepare paths through `scratch/test/reprepare-harness.sh` with a stub `prepare.sh`. On 2026-10-26 the closing checks were rerun in this order: `bash -n` on both scripts, `git diff` on the manifest script, the fail-closed probe, the vitest file, the harness, then the loop dry run.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Turn fsmonitor off per call with `-c`, not through the test's environment | The script is also run by hand and by the gate; a per-call flag protects every caller, and the test needs no change |
| Require `task_term_refs=0` only when the task has a terms file | It matches the start-of-run leak gate; the quiet task always records `NA` and would otherwise refuse every re-prepare |
| Refuse a rebuild whose head differs from the start of the run | A moved head means the worktree changed, and keeping it would mix two trees in one run |
| Make a refusal final for the rest of the run | The same tree or the same failure would only cost another 50 to 140 s build every round |
| Leave the orphan-directory P2 open | A failed `prepare.sh` is rare, the orphan sits outside the map, and no recorded result changes |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `bash -n` on `check-goal-file-manifest.sh` and `loop.sh` | PASS: both exit 0 |
| `git diff` on the manifest script | PASS: `index c5fe8d9871c..56da9621a05 100755`, no mode lines, two `-c core.fsmonitor=false` insertions and one comment line |
| `SPECKIT_MANIFEST_GIT_BIN=missing-git-command bash <manifest script>` | PASS: `FAIL CLOSED: git is unavailable`, exit 2 |
| `npx vitest run --project cli tests/recursive-child-manifest.vitest.ts` | PASS: exit 0, `Test Files  1 passed (1)`, `Tests  2 passed (2)`, 615 ms |
| `loop.sh --task minpct --variants pre054,main-no054 --runs 2 --dry-run --reuse-refined` | PASS: exit 0, 158 lines, `+ reuse sandbox` for both variants, no `prepare.sh` line, results folder 8 entries before and after |
| Em dash count in the three changed files | PASS: `rg -c` finds none |
| `/bin/bash scratch/test/reprepare-harness.sh` | PASS: exit 0; same head is kept, a moved head, a failed prepare and `task_term_refs=3` are each refused and left `DIRTY`, round 3 prints nothing for them, and a variant dirtied again is re-prepared in round 4 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The re-prepare paths ran against a stub, not a real sandbox.** The harness proves the decisions in `reprepare`; no real run has rebuilt a dirty sandbox yet, because a real run dispatches paid model runs. The next real run that dirties a sandbox will print `== round <r>: re-prepared <v> (head unchanged)` or a refusal line, which confirms it end to end.
2. **A failed `prepare.sh` can leave a half-built directory.** It sits under the sandbox root with an id the map never names; remove it by hand. This is the one review P2 left open.
<!-- /ANCHOR:limitations -->

---

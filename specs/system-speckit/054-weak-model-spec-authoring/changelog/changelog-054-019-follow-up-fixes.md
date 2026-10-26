---
title: "Changelog: Phase 19: follow-up-fixes [054-weak-model-spec-authoring/019-follow-up-fixes]"
description: "Chronological changelog for the Phase 19: follow-up-fixes phase."
trigger_phrases:
  - "weak model spec authoring follow up fixes changelog"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-10-26

> Spec folder: `specs/system-speckit/054-weak-model-spec-authoring/019-follow-up-fixes` (Level 1)
> Parent packet: `specs/system-speckit/054-weak-model-spec-authoring`

### Summary

Phase 019 fixes the two follow-ups the 054 closeout named. The goal-file manifest check ran `git ls-files` with fsmonitor on, and in this checkout that call hung for 853 s in a full CLI suite run, so `recursive-child-manifest` was the one failing test. Both of the script's git calls now turn fsmonitor off, and the test passes. The speed loop dropped main-no054 for rounds 3 to 5 of its main run, because one author step ran vitest inside the sandbox and the loop only rebuilt dirty sandboxes when a run started. It now rebuilds a dirty sandbox before each later round and keeps the rebuild only when its snapshot head matches the head the run started with.

### Fixed

- `check-goal-file-manifest.sh` passes `-c core.fsmonitor=false` to `rev-parse` and `ls-files`, with a one-line comment giving the reason. The fail-closed exits are unchanged, and the file stays executable.
- `loop.sh` runs `prepare.sh` before every round after the first for any sandbox marked `DIRTY` or still holding the packet track, outside every timed step. A rebuild is kept only when its `head=` matches the run-start head and, for a task with a terms file, its `ready` reads `task_term_refs=0`. Otherwise the variant is refused once and stays out for the rest of the run.

### Changed

- A dry run plans a round-start rebuild only for a variant the start-of-run block did not already plan to prepare.
- The speed-loop `README.md` gains a "Re-prepare between rounds" section.

### Verification

- `recursive-child-manifest.vitest.ts`: `Tests  2 passed (2)`, against the 853305 ms failure in the phase 017 suite run
- `SPECKIT_MANIFEST_GIT_BIN=missing-git-command bash check-goal-file-manifest.sh` prints `FAIL CLOSED: git is unavailable` and exits 2
- `scratch/test/reprepare-harness.sh` runs the extracted `reprepare` against a stub `prepare.sh`: the same head is kept, a moved head, a failed prepare and a leak are each refused, and a refused variant is skipped in the next round
- The `loop.sh` dry run exits 0, reuses both sandboxes and writes no results folder
- One fresh Opus medium review: one P1 (the edit dropped the executable bit) and three P2s; the P1 and two P2s are fixed

### Deviations

- DeepSeek V4.1 Flash made the manifest edit through cli-pi and wrote the file back as mode 100644; the remediation restored 100755.
- The leak check on a rebuild applies only when the task has a terms file, as the start-of-run gate does, because the quiet task always records `NA`.
- No real speed-loop run rebuilt a sandbox, since a real run dispatches paid model runs; the harness covers the decision paths.
- One P2 stays open: a failed `prepare.sh` can leave a half-built directory that the sandbox map never names.

### Files Changed

| File | Action | What changed |
|---|---|---|
| `specs/system-deep-loop/036-deep-loop-innovation/004-gate-closeout-and-drift/001-whole-system-gate/check-goal-file-manifest.sh` | Modified | fsmonitor off on both git calls |
| `specs/system-speckit/054-weak-model-spec-authoring/011-authoring-speed-research/scratch/speed-loop/loop.sh` | Modified | Between-round rebuild with the head and leak checks |
| `specs/system-speckit/054-weak-model-spec-authoring/011-authoring-speed-research/scratch/speed-loop/README.md` | Modified | "Re-prepare between rounds" section |
| `specs/system-speckit/054-weak-model-spec-authoring/019-follow-up-fixes/` | Created | Phase docs, review, brief, harness |

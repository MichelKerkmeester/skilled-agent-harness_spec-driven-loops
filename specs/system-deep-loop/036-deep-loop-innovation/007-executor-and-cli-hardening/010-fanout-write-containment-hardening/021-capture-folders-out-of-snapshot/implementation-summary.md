---
title: "Implementation Summary: Capture Folders out of the Containment Snapshot"
description: "Containment capture output is out of every later run's baseline and out of violation detection. All 24,582 capture files are untracked and a worktree of the fixed tree removes with plain git worktree remove again."
trigger_phrases:
  - "containment capture snapshot"
  - "capture folders untracked"
  - "worktree remove path limit"
  - "fanout write containment"
  - "capture baseline nesting"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/007-executor-and-cli-hardening/010-fanout-write-containment-hardening/021-capture-folders-out-of-snapshot"
    last_updated_at: "2026-09-23T20:30:00Z"
    last_updated_by: "cli-pi-mimo-v2.6-pro"
    recent_action: "Closed the packet with every acceptance criterion met"
    next_safe_action: "None. The packet is complete"
    blockers: []
    key_files:
      - ".skilled/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts"
      - "write-containment.vitest.ts"
      - ".gitignore"
      - ".skilled/skills/sk-doc/scripts/tests/code-folder/baseline-readme-verdicts.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-021-capture-folders-out-of-snapshot"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: Capture Folders out of the Containment Snapshot

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 021-capture-folders-out-of-snapshot |
| **Completed** | 2026-09-23 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Containment's own capture output no longer nests itself one level deeper on every run. The fan-out snapshot and the violation detection now skip capture folders, all 24,582 capture files are untracked, and a worktree of the fixed tree removes again with plain `git worktree remove`. This matters because tracked capture paths had reached 971 characters and broke worktree removal on macOS with "File name too long".

### Phase 1: capture-folders-out-of-snapshot

You get a containment check that stops polluting itself. A fan-out snapshot copies every untracked path outside a lane into the containment baseline folder, and it used to copy the captures earlier runs had left in the tree. Now the snapshot loop skips capture paths after the unattributable skip, so a capture never copies a capture. The detection loop skips capture paths before the baseline lookup, so an earlier run's captures never show up as new violations. The guard matches capture folders by path segment anywhere in the path, whichever run wrote them.

Stopping the self copy was not enough on its own, so the capture output also left the index. Commit 3351de5c303 had tracked two research trees' lineage capture output and later captures took it to 24,582 files under nine roots. Those files are now untracked with `git rm --cached` and both capture kinds are ignored in `.gitignore`, and the content stays in history. The longest tracked path fell from 971 to 353 characters.

Each requirement is met. REQ-001 (P0) with AC-001 is met because the snapshot never copies a capture folder. REQ-002 (P0) with AC-002 is met because detection never reports an earlier run's capture as a new violation. REQ-003 (P0) with AC-003 is met because no capture output is tracked and both capture kinds are ignored. REQ-004 (P1) with AC-004 is met because a worktree of the fixed tree removes with plain `git worktree remove`. REQ-005 (P1) with AC-005 is met because the sk-doc README verdict baseline stays in parity. REQ-006 (P1) with AC-006 is met because each guard has a test that failed before it.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts` | Modified | A CAPTURE_DIRS list and the isContainmentCapturePath helper, with the snapshot loop and the detection loop skipping capture paths |
| `write-containment.vitest.ts` | Modified | Two tests in the "baseline content capture" group, one for the snapshot guard and one for the detection guard, both red before their guard |
| `.gitignore` | Modified | Two patterns, `specs/**/containment/baseline/` and `specs/**/containment/quarantine/`, with a comment on why |
| The 24,582 capture files under the nine capture roots | Deleted from the index | Untracked with `git rm --cached` so no capture output stays tracked, with the content kept in history |
| `.skilled/skills/sk-doc/scripts/tests/code-folder/baseline-readme-verdicts.json` | Modified | The 246 capture READMEs dropped from 1,304 entries to 1,058, with every other entry unchanged |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The implementation executor was cli-pi with MiMo v2.6 pro through the llmgateway provider. It made the code, test and `.gitignore` edits in briefs wu1 to wu5 with raw output in evidence/dispatch/. The orchestrator wrote the briefs, reviewed every diff and ran every check, and it ran the two mechanical steps itself, the git untrack and the scripted prune of the sk-doc README baseline.

The tests were red first. T002 wrote the snapshot test and T004 wrote the detection test, and both failed before their guard. T003 added the snapshot guard and T005 added the detection guard, and both tests passed after. T001 read the snapshot and detection code first, then T006 added the gitignore rules, T007 untracked the captures, T008 pruned the sk-doc baseline, T009 ran the suites and typecheck, T010 ran the live removal proof and T011 wrote the packet docs and parent rows. All tasks are done.

The work landed in two commits on branch worktrees/066-ci-cleanup-follow-ups rebased onto origin/main. Commit 1c6f97a004 is fix(deep-loop): keep containment captures out of the snapshot and detection. Commit 8a932df0ab is chore(specs): untrack the containment capture output and ignore it.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Guard both functions, not only the snapshot | Detection subtracts the baseline, so a snapshot-only guard would report an earlier run's captures as new violations |
| Match capture folders by path segment anywhere in the path | Whichever run wrote the capture it must stay out of the checks, not only the current run's captures |
| Untrack every capture folder rather than only the deepest | Any tracked capture is copied by the next run. The operator chose "All capture folders" on 2026-09-23 |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `write-containment.vitest.ts` | PASS. 79 passed |
| `write-containment.vitest.ts` rerun on the tree rebased onto origin/main | PASS. 79 passed |
| The six containment-related test files | PASS. 395 passed, 1 skipped |
| Runtime typecheck | PASS. exit 0 |
| `git ls-files` under both capture kinds | PASS. 0 files. Longest tracked path 971 before and 353 after, rechecked after rebase |
| `test_readme_verdict_parity.py` | PASS. PARITY PASS, 1,058 files, 0 diffs |
| Live removal proof at the final HEAD | PASS. `git worktree add --detach` of a fresh worktree with 115,878 tracked files and longest absolute path 448 characters, then plain `git worktree remove`, both exit 0, folder gone, no worktree entry left |
| sk-code drift guards | PASS. all 2 guards passed, 0 errors |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **One remediation plan cites now untracked quarantine generations.** `specs/cli-orca/002-consolidate-official-orca-skills/review/synthesis-remediation-plan.md` at line 452 cites five quarantine generations under `review/containment/quarantine/`, which are now untracked. The content stays in history.

2. **One CI exclude no longer matches anything.** `.github/workflows/dispatch-enforcement-guard.yml` excludes `"**/review/containment/**"` from the dispatch audit suite. With the tray untracked the exclude no longer matches anything in CI. It is harmless and left in place.

3. **Filesystem walkers still read the disk.** Walkers such as the trigger-index generator read the disk and not git, so ignored captures still on a local disk can be picked up by a local regeneration.
<!-- /ANCHOR:limitations -->

---



# Phase 021 evidence pack (orchestrator-verified facts, the only source for packet docs)

Every fact below was observed by the orchestrator in worktree 066 on 2026-09-23.
Do not invent any fact that is not here. If a template section has no fact here, write
"N/A - insufficient source context" rather than guessing.

## Identity
- Packet: specs/system-deep-loop/036-deep-loop-innovation/007-executor-and-cli-hardening/010-fanout-write-containment-hardening/021-capture-folders-out-of-snapshot, Level 2.
- Title: "Capture folders out of the containment snapshot".
- Parent: 010-fanout-write-containment-hardening (the fan-out write-containment hardening packet), phase 21 of 21.
  Predecessor 020-direct-append-sites-through-gateway. Successor none.
- Created 2026-09-23. Work ran 2026-09-23. Status: Complete.
- Worktree .worktrees/066-ci-cleanup-follow-ups, branch worktrees/066-ci-cleanup-follow-ups.
- Implementation executor: cli-pi with MiMo v2.6 pro through the llmgateway provider made the code, test and
  .gitignore edits (briefs wu1 to wu5 with raw output in evidence/dispatch/). The orchestrator wrote the briefs,
  reviewed every diff, ran every check, and ran the two mechanical steps itself: the git untrack and the scripted
  prune of the sk-doc README baseline.

## Problem
- A fan-out snapshot (snapshotOutOfScopeDirtyPaths in
  .skilled/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts) copies every untracked path outside
  a lane into <lineageDir>/containment/baseline/. That included the captures earlier runs had left in the tree, so
  each run nested the previous captures one level deeper.
- Commit 3351de5c303 had tracked two research trees' lineage capture output. Later captures took it to 24,582 files
  under nine roots, with tracked paths up to 971 characters.
- Inside a worktree those paths pass macOS's 1,024-character path limit. git worktree remove failed with
  "File name too long" on worktree 061 on 2026-09-23 and left the folder behind, which had to be removed by hand.
- Detection (detectNewOutOfScopeViolations) subtracts the baseline. Skipping captures only in the snapshot would have
  made detection report an earlier run's captures as new violations, so both functions need the guard.

## Purpose
- Keep containment's own capture output out of every later run's baseline and out of violation detection, and stop
  tracking capture output so a worktree can be removed again.

## What changed
1. write-containment.ts: a CAPTURE_DIRS list (containment/baseline and the pass quarantine dir) and a helper
   isContainmentCapturePath(path). The snapshot loop skips capture paths after the unattributable skip. The detection
   forward loop skips capture paths before the baseline lookup.
2. write-containment.vitest.ts: two tests in the "baseline content capture" group.
   "skips capture folders an earlier run left in the tree, so a capture never copies a capture" and
   "does not report capture folders an earlier run left in the tree as new violations".
   Both failed before their guard and pass after it.
3. .gitignore: two patterns, specs/**/containment/baseline/ and specs/**/containment/quarantine/, with a comment on why.
4. Untracked all 24,582 capture files (git rm --cached). The content stays in history.
5. .skilled/skills/sk-doc/scripts/tests/code-folder/baseline-readme-verdicts.json: dropped the 246 capture READMEs
   (1,304 entries to 1,058). Every other entry is unchanged.

## Commits (on branch worktrees/066-ci-cleanup-follow-ups, rebased onto origin/main)
- 162a3bd816 fix(deep-loop): keep containment captures out of the snapshot and detection
- b7648ec0b0 chore(specs): untrack the containment capture output and ignore it

## Verification (all observed)
- write-containment.vitest.ts: 79 passed.
- The six containment-related test files: 395 passed, 1 skipped.
- Runtime typecheck: exit 0.
- git ls-files under both capture kinds: 0 files. Longest tracked path: 971 before, 353 after (rechecked after rebase).
- test_readme_verdict_parity.py: PARITY PASS, 1,058 files, 0 diffs.
- Live removal proof at the final HEAD: git worktree add --detach of a fresh worktree (115,878 tracked files,
  longest absolute path 448 characters) then plain git worktree remove, both exit 0, folder gone, no worktree entry left.
- sk-code drift guards: all 2 guards passed, 0 errors.
- Rerun on the tree rebased onto origin/main: write-containment.vitest.ts 79 passed.

## Requirement and acceptance ids (use exactly these)
- REQ-001 (P0): the snapshot never copies a capture folder. AC-001. Met. Evidence: the snapshot test, 79 passed.
- REQ-002 (P0): detection never reports an earlier run's capture as a new violation. AC-002. Met. Evidence: the
  detection test, 79 passed.
- REQ-003 (P0): no capture output is tracked, and both capture kinds are ignored. AC-003. Met. Evidence: git ls-files 0,
  longest tracked path 353.
- REQ-004 (P1): a worktree of the fixed tree removes with plain git worktree remove. AC-004. Met. Evidence: the live
  removal proof above.
- REQ-005 (P1): the sk-doc README verdict baseline stays in parity. AC-005. Met. Evidence: PARITY PASS 1,058 files.
- REQ-006 (P1): each guard has a test that failed before it. AC-006. Met. Evidence: both new tests red before their guard.
- Tasks: T001 read the snapshot and detection code, T002 snapshot test (red), T003 snapshot guard, T004 detection test
  (red), T005 detection guard, T006 gitignore rules, T007 untrack the captures, T008 prune the sk-doc baseline,
  T009 run the suites and typecheck, T010 live removal proof, T011 packet docs and parent rows. All done.

## Decisions
- Guard both functions, not only the snapshot, because detection subtracts the baseline.
- Match capture folders by path segment anywhere in the path, whichever run wrote them, not only the current run's.
- Untrack every capture folder rather than only the deepest, because any tracked capture is copied by the next run.
  The operator chose "All capture folders" on 2026-09-23.

## Known limitations (record, do not fix)
- specs/cli-orca/002-consolidate-official-orca-skills/review/synthesis-remediation-plan.md (line 452) cites five
  quarantine generations under review/containment/quarantine/, which are now untracked. The content stays in history.
- .github/workflows/dispatch-enforcement-guard.yml excludes "**/review/containment/**" from the dispatch audit suite.
  With the tray untracked the exclude no longer matches anything in CI. It is harmless and left in place.
- Filesystem walkers such as the trigger-index generator read the disk, not git, so ignored captures still on a local
  disk can be picked up by a local regeneration.

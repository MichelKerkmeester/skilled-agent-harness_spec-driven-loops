---
title: "Implementation Summary"
description: "Two audits of v4.2.0.0, then fixes: every defect in the second audit's sections 2, 4 and 12 is fixed at its source in worktree 545, each with a regression test."
trigger_phrases:
  - "v4 2 0 0 release audit research implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/runtime-and-release/007-v4-2-0-0-release-audit-research"
    last_updated_at: "2026-11-26T14:49:39Z"
    last_updated_by: "generate-context"
    recent_action: "Recorded the fix-all decisions and handed off"
    next_safe_action: "Create the worktree and amend spec.md scope for the fixes"
    packet_purpose: "Purpose: One synthesis that lists, with a commit hash and a `file:line` for each, every user-visible change the notes miss, every note the code contradicts and every bug found in code shipped in the window."
    blockers: []
    key_files:
      - "research/research.md"
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:e807d048f73878d398fc994ade5851e085035134424b2eba4b54a58aa733e05e"
      session_id: "scaffold-007-v4-2-0-0-release-audit-research"
      parent_session_id: null
    session_ref:
      runtime: "claude"
      sessionId: "012507d7-ddbb-4b4f-9a7c-222cd8523a30"
      workspace: "/Users/michelkerkmeester/MEGA/Development/Skilled"
      savedAt: "2026-11-26T14:49:39Z"
      locatorKind: "transcript_path"
      version: 1
    completion_pct: 95
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
| **Spec Folder** | 007-v4-2-0-0-release-audit-research |
| **Completed** | 2026-11-25 |
| **Level** | 1 |
| **Status** | Complete |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built
<!-- FILL: Open with the user-visible change in two sentences, then list each changed file. GOOD: `--keep 3` leaves three archives in `logs/archive`. A plain run leaves all ten. WEAK: Implemented the feature. -->

Two audits ran, and the second one's defects are now fixed. The first audit changed only the release notes and one overlay guard. Its synthesis, archived under `research_archive/20261125T162358Z/`, lists 16 confirmed findings against the v4.2.0.0 notes: 9 missing entries, 5 drifted claims and 2 bugs. Three are P1: the unannounced Stop-hook answer recording, the Bladebro install line without `--ignore-scripts`, and `worktree-naming.sh` losing its executable bit.

### The audit

Two lineages, cli-codex and cli-devin, read the same window and packet list and proposed 26 distinct candidates. The orchestrator re-checked each one in the repository and rejected 10, with the deciding check named in the synthesis.

### The fixes

The second audit, `research_archive/20261126T112816Z/research.md`, found 3 P2 and 14 P3 defects in the v4.2.0.0 logic, four more from its independent verifier and six older ones. On the operator's "fix all", every one of them except the two REQ-004 names was fixed in worktree `545-v4-2-audit-fixes`, along with three nearby defects the operator chose. `acceptance-criteria.md` maps each finding to its regression test. Workers ran on cli-mistral-vibe with `deepseek-flash`, three at a time. The orchestrator reviewed each diff and reran each suite.

- **Deep-loop runtime:** a runner stopped by a signal now ends a child whose row has no start time, and `--stop` on win32 names its remedy. An untrusted lineage's frontier nodes claim no coverage, in the merge and in the stop decision. The `--extend` warning counts only open questions. Option B of the pre-synthesis gate ends a fan-out run in both `deep-research.yaml` and `deep-review.yaml`.
- **Claude Stop hook:** a path that ends at a JSON escape resolves to the child packet. The write takes the canonical save lock and leaves answers pending while a save holds it. A written row is never reported as skipped, a hand-edited row survives a later Stop, and one `systemMessage` line tells the operator the outcome.
- **Overlay engine:** a destination that changes shape and letter case at once is planned as the engine's own, now also in the skill-root replace loop in both directions. A layout link never replaces a distinct user entry whose bytes match. The rollback remedy pastes, a relayout prints its restore and relink lines with the tree root, stray words are refused, `--json` errors come back as JSON and `--rollback` refuses a path changed after the run.
- **Skill advisor:** a slash command the prompt refuses or only asks about no longer anchors its hub, so "please do not run /deep:review, just review the parser once" ranks sk-code first. The routing baseline was regenerated, and only `sv-05` moved.
- **Operator UX:** `create.sh` prints the remedy for a refused sub-track, the `skilled-loop` goal-hop warning is true and names both remedies, and provisioning rebuilds an empty skill-graph database and prints the scan's own error.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `scratch/window-commits.txt` | Created | The 1084 non-merge commits in the window |
| `scratch/recent-packets.txt` | Created | The 21 recently touched packets |
| `research/` | Created | Lineage state, merged registry, resource map and the synthesis `research.md` |
| `spec.md` | Modified | The generated findings fence under Open Questions |
| `.skilled/commands/doctor/scripts/overlay-engine.cjs` | Modified | `isUnderRootSkilled` lowercases before comparing, so `root/Skilled/...` is refused |
| `.skilled/commands/doctor/scripts/tests/overlay-engine-strict-writes.test.cjs` | Modified | One test for a case-variant source |
| `worktree-naming.sh`, `worktree-naming.test.sh`, `skill_advisor.py` | Mode 100644 to 100755 | Restores the executable bit two window commits dropped |
| `.skilled/changelog/skilled/v4.2.0.0.md` | Modified | Nine missing entries, the Bladebro install line, two counts, the component list, the fallback caveat and six spec folders |
| `decision-record.md` | Created by the Claude Stop hook | The operator's loop choice, recorded unasked. Kept as evidence for finding M1 |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered
<!-- FILL: Name the commands that proved it and the order they ran. GOOD: Ran `--keep 3` and a plain run, then the suite. All three passed. WEAK: Tested and shipped. -->

`fanout-run.cjs` ran both lineages in the background (exit 0, codex 76 minutes, devin 15 minutes, both stopped at the 10-iteration cap). `fanout-merge.cjs` merged them, `reduce-state.cjs` emitted the resource map, and the orchestrator verified each candidate with notes greps, cited-line reads and read-only commands before writing `research.md`. `synthesis-closeout.cjs` then recorded `synthesis_complete` through the append gateway.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions
<!-- FILL: Write one decision per row. Give the reason, not the label. GOOD: Option over environment variable: one run can pick a different count without editing config. WEAK: Used the best approach. -->

| Decision | Why |
|----------|-----|
| Same topic for both lineages, default depth | Two model families on the same questions give a second lens, and the operator approved a convergence stop that expansive depth would change |
| Per-iteration timeout 1,800 s instead of 900 s | xhigh iterations on this repository could pass 15 minutes. None timed out |
| Severity of the Python fallback drift set by reach, not tally | The fallback serves only when the advisor daemon is unreachable, so it is P2 although one lineage said P1 |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification
<!-- FILL: Write one check per row with the exact output. GOOD: `ls logs/archive | wc -l` after `--keep 3`: 3. After a plain run: 10. Suite: PASSED. WEAK: All tests pass. -->

| Check | Result |
|-------|--------|
| Fan-out run | `status: ok`, 2 of 2 lineages succeeded, every failure class 0 |
| Route proof | 10 of 10 state rows per lineage carry `target_agent: "deep-research"` |
| Containment | `git status` shows no write outside this packet beyond the pre-existing `graph-metadata.json` change |
| Python scorer count (D3) | `python3 -I test_skill_advisor.py` prints `pass=134, fail=0` |
| Overlay guard count (D4) | `node --test` prints `tests 21`, `pass 21` |
| Exec bit (B1) | `git diff --summary v4.1.0.0 HEAD` prints `mode change 100755 => 100644` |
| `typed` bug rejection | three `--force-local` probes returned `typed=True` |
| B2 regression test | Fails without the fix (`fail 1`), passes with it (`pass 1`) |
| Overlay engine suites | Two-suite baseline 113 of 113, after the fix 114 of 114. All 12 suites: 539 of 539 |
| sk-git naming suite | `PASS=190 FAIL=0` |
| Exec bits | `git ls-files -s` prints `100755` for all three, and the script runs directly |
| Quality gate | `quality-gate.cjs --files` on both changed files: 0 P0, 0 P1, 0 P2 |
| Release notes | `check_changelog_shape.py` PASS (baseline FAIL on 3 sentences and a 10.2 mean), `hvr_scan.py` 0 hard blockers (baseline 2), `validate_document.py` VALID, every glance anchor and all 16 spec folders resolve |
| Packet validation | `validate.sh --strict` prints `RESULT: PASSED` |

### Fix verification

Every touched suite reran in worktree 545 from the final state, one suite at a time, and each exited 0. The before count is the worktree at `5c8aeff2c1b` before any fix.

| Suite | Before | After |
|-------|--------|-------|
| Overlay engine, 12 suites plus the overlay contract | 548 of 548 | 559 of 559 |
| sk-git `worktree-naming.test.sh` | `PASS=190 FAIL=0` | `PASS=194 FAIL=0` |
| Deep-loop runtime unit tests | 3638 passed, 2 skipped | 3643 passed, 2 skipped |
| Claude Stop hook files | 48 of 48 | 52 of 52 |
| Spec-kit CLI tests | 60 of 60 in 4 files | 101 of 101 in 6 files. The rerun added two existing test files the fixes touch |
| Skill advisor vitest | 3530 passed, 4 skipped | 3532 passed, 4 skipped |
| Skill advisor Python | `pass=134, fail=0` | `pass=134, fail=0` |
| Session handover, run with `AI_SESSION_CHILD` unset | 1079 of 1079 | 1079 of 1079 |

| Check | Result |
|-------|--------|
| Fail before the fix | With each fixed source put back to its HEAD bytes, every new regression test failed. The overlay suite against the HEAD engine failed 12 tests. The follow-up swap failed the scorer, deep-review, both skill-root directions and the skilled-loop test. The fixed bytes were restored and `cmp` matched |
| Routing baseline | A fresh `capture-command-routing-baseline.mjs` run without `--write` matches the regenerated file. Only `capturedAtSha` and `sv-05.top` moved, from `system-deep-loop` to `cli-external-orchestration` |
| Compiled contracts | `check-contract-drift.cjs` prints `[CONTRACT DRIFT] OK commands=2`, exit 0 |
| Quality gate | `quality-gate.cjs --worktree --lines changed`: 0 P0, 0 P1, 0 P2, exit 0 |
| Reverse skill-root case | A hand probe showed the first case-fold fix aborting a folder-to-file change with exit 2. The follow-up fix and its test close it |

### Follow-up on main

A second pass on `main` closed the last open drift after the merge.

| Check | Result |
|-------|--------|
| Stop-decision frontier fix | `convergence.cjs` now counts only trusted frontier nodes in both the research and the review stop facts. The new test fails with the HEAD file swapped in (1 failed, 132 passed) and passes with the fix (133 of 133) |
| Deep-loop runtime suite on `main` | Before: 225 files, 4066 passed, 11 skipped. After: 225 files, 4067 passed, 11 skipped, exit 0 |
| Quality gate | `quality-gate.cjs --files` on both changed files: `NO_BLOCKER_FOUND`, 0 P0, 0 P1, 0 P2 |
| Dist rebuild | `npm run build` in `runtime/cli` and `runtime` exit 0. `hook-session-stop.vitest.ts` 32 of 32. The compiled hook imports and `acquireCanonicalSaveLock` resolves as a function |
| Release notes | `check_changelog_shape.py` PASS, `hvr_scan.py` 0 hard blockers with the same soft count as before the edit, `validate_document.py` VALID |

### Dependabot and CI pass on main

The operator asked to fix Dependabot before the tag moved again. That covered the alerts, PR 108, and the three CI checks that already failed on `main`.

| Check | Result |
|-------|--------|
| hono alerts | hono 4.13.22 in both lockfiles. `npm ci` under Node 24 (the code-mode server's engine) installs, and the server answers `initialize` with 8 tools. The spec-kit typecheck exits 0 |
| Pip alerts | The 12 `uv.lock` manifests are untracked since `00c5a5b1a25`, so they were dismissed as not used rather than edited |
| PR 108 | Its base `7226b913e47` failed the same provisioning on `main`. Merged onto current `main`, the walk prints `0 failed`, `tsc -p tsconfig.pi.json` exits 0, the hook node:test suites pass 1989 of 1989, and both Pi extensions pass (120 and 81). Neither extension changes `render()` output in place, so the pi-coding-agent 1.6.0 break does not apply |
| Gate Inputs | The pre-push fixture repository took git's default branch name. Named `main` at init, it passes 59 of 59 with `init.defaultBranch=master`, where it failed 57/2 |
| sk-doc walk | Three benchmark report folders were missing from the frozen README manifest. `test_readme_manifest.py --write` regenerated it, and both walk tests pass |
| Spec-kit CLI shard 1 | The contract test rejected the word `extend` anywhere in the completed-session branch, which now advises `--extend=N`. It now rejects only routing to the extend step, and a temporary route in the YAML makes it fail |
| Spec-kit CLI shard 3 | The upgrade-legacy copies stamped their dist with a whole-millisecond `Date`, while mtimes are finer, so a source written in the same millisecond read newer and the validator exited 3. The dist keeps `now` and the copied sources are dated one second back. 20000 of 20000 trials stay fresh, and an edit afterwards still reads stale |
| Spec-kit CLI project | 210 files passed, 2725 tests passed, 0 failed. One file first failed only because the packet docs were edited during the run, and it passes 4 of 4 on its own |
| Quality gate | `quality-gate.cjs --files` on the six changed test files: `NO_BLOCKER_FOUND`, 0 open findings |
### Generation-3 fix pass

The operator said "FIX ALL" for the seven generation-3 findings. The fixes landed in worktree `547-v4-2-gen3-audit-fixes`. Each suite ran on `main` at `1bbebef885e` for the before count and in the worktree for the after count.

| Suite | Before, on `main` | After, in the worktree |
|-------|-------------------|------------------------|
| Bin tests, `node --test .skilled/bin/tests/*.test.cjs` | 219 passed | 221 passed, 1 skipped, 0 failed. The skip is the runtime-written `.gitignore` a fresh worktree lacks |
| sk-create-skill tests | 112 of 112 | 112 of 112 |
| sk-doc Python tests | 462 passed | 462 passed |
| Deep-loop runtime | 4064 passed, 3 failed, 11 skipped | 4066 passed, the same 3 failed, 11 skipped |
| Skill advisor runtime | 3546 passed, 1 failed, 4 skipped | 3548 passed, 0 failed, 4 skipped |
| Spec-kit runtime core | 1377 passed, 11 skipped | 1378 passed, 11 skipped |
| Spec-kit runtime CLI | 2724 passed, 1 failed, 20 skipped | 2724 passed, the same 1 failed, 20 skipped |
| Spec-kit spec validation | passed | passed |
| `pre-commit.test.sh` | not run | exit 0 |

The failures on both sides predate this pass. The three deep-loop failures read `.skilled/specs/...` paths that commit `035c9dd6bdd` removed. The advisor failure on `main` is a local `system-skilled-bots` skill with an empty description, which the worktree does not hold. The spec-kit CLI failure is `canonical-save-validation.vitest.ts:220`, exit 3 on both sides.

| Check | Result |
|-------|--------|
| Negative controls | Each new test failed with its fix taken out: the front-door file tests 3 of 4, the stop test, the Pi test, the continuity test and the reducer test |
| Compiled routing | All eight hub manifests re-minted with `compiled-route-manifest.cjs refresh` and copied to their authored copies. `compiled-route-guard.cjs` reads all hubs fresh, and `compiled-route-status.cjs --all` reads `compiled-serving` for all eight. A `--prompt-file` replay routes `sk-code`, `sk-doc`, `system-deep-loop` and `sk-design` |
| Deep command contracts | Recompiled after the `system-deep-loop/SKILL.md` edit. `check-contract-drift.cjs` prints `OK commands=2` |
| Hub checks | `parent-skill-check.cjs` and `generate-leaf-manifest.cjs --check` pass for all eight hubs. Two hubs first went past the 180-word SMART ROUTING limit, and the wording was cut |
| sk-code drift guards | The same 2 errors as on `main`, both in a review lineage under `specs/` |
| Quality gate | `quality-gate.cjs --worktree --lines changed`: 0 P0, 0 P1, 0 P2 |
| Docs | `check_changelog_shape.py` PASS and `validate_document.py` VALID for both changelogs. Every other changed `.md` validates the same as on `main` |
| Builds | The advisor and spec-kit runtime dists were rebuilt in the worktree. Both are gitignored, so `main` needs the same rebuild after the merge |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations
<!-- FILL: Name one real limit and the workaround. GOOD: `--keep` deletes the older archives for good. Copy `logs/archive/` aside first when a run may cut too deep. WEAK: No limitations. -->

1. **The audit is not exhaustive.** Both lineages stopped at the iteration cap, not on convergence, and only 5 of 26 candidates were found by both. A further `--extend` round, or a pass over the components line 823 does not name, would likely find more.
2. **Every other checkout rebuilds its own dists.** `runtime/cli/dist` and the runtime `dist` are gitignored. The primary checkout was rebuilt after the merge, and the compiled Stop hook loads `acquireCanonicalSaveLock` from it. Another checkout runs the old Stop hook until both dists are rebuilt there: `npm run build` in `runtime/cli`, then in `runtime`.
3. **One timing test can flake.** `fanout-pool.vitest.ts:679` failed once for a worker under load and passed on rerun. No change was made to it.
4. **Not fixed on purpose.** f-iter005-003 is pinned by design in `deep-loop-offer-cases.json:123`, and f-iter009-003 has no shown consequence.
5. **Three pre-existing failures stay open.** The deep-loop suite reads three fixtures under `.skilled/specs/`, which commit `035c9dd6bdd` removed, and `canonical-save-validation.vitest.ts:220` fails on `main` too. Neither belongs to this pass.
6. **Without `ps`, a stopped lineage reads as a survivor.** The runner signals it but cannot confirm the exit, so the next run sees it as open until its pid is gone.
<!-- /ANCHOR:limitations -->

---



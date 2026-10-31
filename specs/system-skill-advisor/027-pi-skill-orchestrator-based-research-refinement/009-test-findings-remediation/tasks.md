---
title: "Tasks: Remediating the Cross-CLI Test Findings"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "test findings remediation tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Remediating the Cross-CLI Test Findings

<!-- SPECKIT_LEVEL: 1 -->

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

- [x] T001 Verify each phase 8 finding against code or a rerun and record it in `spec.md`. Evidence: F1 to F18 and the CL-005 gap in section 3, with the F12 fix moved to the scenario command after the orchestrator confirmed Pi loads the import through its symlink.
- [x] T002 Write an implementer and a verifier brief per code finding, with disjoint file sets and base commit `fa4f76d881`. Evidence: 13 brief pairs and an index of parallel groups.
- [x] T003 Regenerate the stale compiled `deep/review` contract (`.skilled/commands/deep/assets/compiled/deep-review.contract.md`). Evidence: `render-command-contract.vitest.ts` 32 of 32.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 [P] F10: the plugin exports only its default factory, helpers move to `.opencode/plugins/lib/skill-advisor-render.js`. Evidence: the loader-rule replay prints `exports=["default"]` with exit 0; plugin tests 30 of 30, plugin vitest 70 of 70, stress 6 of 6; the base module fails the new export test. Luna's scope objection named sibling brief files, checked against the brief index.
- [x] T005 F15: restore the `.opencode/bin` symlink, after T004 verifies. Evidence: `readlink .opencode/bin` prints `../.skilled/bin`; plugin tests 31 of 31; with the link moved aside the new test fails on `advisor CLI missing at .../.opencode/bin/skill-advisor.cjs`.
- [x] T006 [P] F11: the Pi debug test expects `fallback(headless)` (`.skilled/hooks/dispatch/pi/directive-dedup.test.ts`). Evidence: 15 of 15 with the fix, 1 failed of 15 against the base test, file restored byte for byte.
- [x] T007 [P] F14: the Pi preflight test blocks a missing stdin redirect and advises on a warn rule (`.skilled/hooks/dispatch/pi/dispatch-preflight-lint.test.ts`). Evidence: 35 of 35; the base test fails `advises without blocking when a permitted dispatch omits the stdin redirect`.
- [x] T008 [P] F12: scenario 457 step 4 runs the Pi suite under its config (`directive-lifecycle-dedup.md`). Evidence: the documented command `cd .skilled && npx --no-install vitest run --config hooks/vitest.config.ts --dir hooks/dispatch/pi` gives 2 files and 50 tests passed; the old command reports `Cannot find module`. The root-level form was dropped because vitest is installed only under `.skilled/node_modules`.
- [x] T009 [P] F13: the 457 harness spawns the current dist tree (`run-registered-adapter-cadence.mjs`, `deterministic-advisor-target.mjs`). Evidence: `summary.json` `passed: true` for claude, codex, cursor and devin; the base scripts exit 1 on `ENOENT`.
- [x] T010 [P] F3: a sandboxed daemon writes its generation file under its override (`runtime/lib/freshness/generation.ts`). Evidence: typecheck exit 0, five files 52 tests passed; both new state-containment tests fail against the base resolver.
- [x] T011 [P] F3: a sandboxed watcher opens its own quarantine database (`runtime/lib/daemon/watcher.ts`). Evidence: 21 of 21, the new test fails at base. The orchestrator changed `if (override)` to `if (override != null)` after Luna showed an explicit empty path no longer won, matching the base `??` semantics.
- [x] T012 [P] F3: a sandboxed launcher keeps its state file and model server inside the sandbox (`.skilled/bin/system-skill-advisor-launcher.cjs`). Evidence: the four launcher files 44 of 44 outside the Codex sandbox, whose socket `listen` returns EPERM; the three new tests fail against the base launcher; the live generation and launcher state files are byte-identical before and after.
- [x] T013 [P] F7: the disabled reason names the flag that is set (`runtime/handlers/advisor-recommend.ts`). Evidence: typecheck exit 0, 22 of 22; the legacy-flag test fails against the base handler.
- [x] T014 F17: the daemon child reaches the model server the launcher arms (`.skilled/bin/system-skill-advisor-launcher.cjs`), after T012 verifies. Evidence: launcher tests 38 of 38 with two new; with the new block removed, 4 tests fail.
- [x] T015 F5: the repository writer of the duplicate Codex hook entries, or the exact entries handed to the operator. Evidence: the writer is `.skilled/bin/install-codex-hooks.mjs` in write mode, which copies all 18 project entries into `~/.codex/hooks.json`. Changing it to remove-only reverses a documented contract, so it waited for the operator. The operator chose the removal-only installer on 2026-09-27, built in T024 and T025.
- [x] T016 F18: scenario 457 step 6 and the stale doc references, each checked before it is changed. Evidence: step 6 records verdicts by hand and cites MTP-005; three false statements fixed in `.state/advisor/README.md`; five fixed in the Codex hook parity playbook; no advisor or spec-kit doc links into the deleted `.opencode/changelog` tree. The sandbox override is now documented in five advisor docs. All validators report 0 issues.
- [x] T022 F21: a second launcher never reclaims a live, heartbeating owner for its parent pid (`.skilled/bin/system-skill-advisor-launcher.cjs`, `runtime/tests/launcher-reap-pid-reuse.vitest.ts`). Evidence: the four launcher test files 47 of 47 outside the Codex sandbox; with the base launcher restored, the new test fails on `ownerLeaseReclaimed: ppid-1-orphan` and `expected true to be false`; the test's sleeper has parent pid 1. The isolated two-launcher reproduction killed the incumbent by t+25 s before the fix and kept it alive through t+60 s after it, with the live launcher pid and live files unchanged. Luna's diff, caller and test-shape checks passed. Its gate hit the Codex sandbox's socket and `ps` limits, so the orchestrator ran that gate.
- [x] T023 [P] F21 scenario half and F22: scenario 433 sandboxes its database and stops its own launcher, and CL-005 names the observable brief freshness instead of the internal route label (`cli-hook-transport-down-fail-open.md`, `opencode-plugin-bridge.md`). Evidence: `validate_document.py` 0 issues on both; the 433 Commands block parses under `bash -n`; the teardown is CP-004's block with the lease under `$SANDBOX/db`.
- [x] T024 F5, as the operator chose on 2026-09-27: the installer only removes repo-owned copies and orphans from `~/.codex/hooks.json`, keeps third-party entries and never adds (`.skilled/bin/install-codex-hooks.mjs`, `.skilled/bin/tests/install-codex-hooks-source-root.test.cjs`). Evidence under `evidence/f5/`: `node --test` 19 of 19 (21 before: three respelling tests became one); against the pre-change installer the new tests fail 13 and pass 6; temp-target probes print `structure=1` for an empty group, and an install drops an event left empty, keeps an already empty event and a third-party entry, and backs up once; against the real `~/.codex/hooks.json`, `--check` prints `DRIFT (duplicate=18)` and `--dry-run` removes 18, finds 0 orphans and keeps 26 third-party entries, with the file byte-identical before and after. Luna's verify: PASS, confidence HIGH.
- [x] T025 [P] F5 docs: eleven docs now say Codex reads the trusted checkout's `.codex/hooks.json` and the installer removes copies of it from the global file (`.codex/SYNC.md`, `.codex/hooks/README.md`, `.skilled/bin/README.md`, `.skilled/hooks/README.md`, `hook-install/README.md`, `codex-watchdog/README.md`, cli-codex `README.md`, `references/hook-contract.md`, CX-016, its index row and `codex-hook-parity.md`). Evidence: `validate_document.py` 0 issues on all eleven; a list of 24 stale phrases matches the old text in every file at HEAD and nothing now; the rewritten parity step 4 ran live from the checkout (`evidence/f5/parity-step4-live.txt`). Luna's first docs verify failed on two true points: the `.skilled/`-only orphan wording in `hook-install/README.md`, and a step 4 `find` that hid the state file's path. Both are fixed. Luna's re-check confirmed both fixes against the installer and `find(1)`, with all eleven validators at 0 issues and the stale grep empty. It could not date the other edits without a snapshot, so it reported BLOCKED. The orchestrator's diff totals from before and after the fixes show the three lines are the only change (`evidence/f5/docs-recheck-reconciliation.txt`).
- [x] T026 Delete the stale jcode SessionStart entry from `~/.codex/hooks.json`, as the operator asked on 2026-09-27. Evidence in `evidence/f5/jcode-removal.txt`: the backup is `~/.codex/hooks.json.bak-jcode-2026-09-27T05-48-23Z` and the diff removes only the jcode group; `--check` still prints `DRIFT (duplicate=18)` and `--dry-run` removes 18 and keeps 25; a plain `codex exec` from the checkout ran UserPromptSubmit 7 of 7 and Stop 9 of 9 as before, and SessionStart 6 of 6 where 16 ran before, because Codex keys hook trust by position and the global SessionStart groups moved up; a temp-copy run shows the installer moves none of the 25 hooks it keeps.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T017 Rebuild the advisor dist and run the advisor suite and typecheck, the plugin tests, the Pi dispatch suite, the stress pair and the 457 harness, serially. Evidence, from the final state after F21: typecheck exit 0; advisor suite 127 files, 959 passed, 6 skipped, 0 failed; plugin tests 31 of 31; Pi dispatch 50 of 50; spec-kit hook files 236 passed, 7 skipped, 0 failed; stress 6 of 6; the 457 harness `passed: true` for claude, codex, cursor and devin. The live generation and launcher state files were byte-identical before and after each run.
- [x] T018 Prove OpenCode loads the plugin: no `failed to load plugin` line and `spec_kit_skill_advisor_status` listed. Evidence: CL-005 step 4 in all five CLIs ran `opencode run` with exit 0, the load-failure grep printed nothing and the answer listed `spec_kit_skill_advisor_status` (`evidence/reports/*-CL-005.md`).
- [x] T019 Rerun CL-001, CL-005, CL-006, CP-003, CP-004, NC-001, NC-004, 433 and 457 in all five CLIs (`evidence/`). Evidence: 45 of 45 PASS in `evidence/reports/`. Superseded runs are listed in `evidence/excluded-windows.tsv` with their reports under `evidence/reports/superseded/`: three Codex CL-005 runs (the pinned count, a 30 s Codex command timeout, the unobservable route label) and the Pi and OpenCode 433 runs made before 433 sandboxed its database. Scenario 457 step 6 is recorded by hand in `.skilled/skills/system-spec-kit/benchmark/reports/2026-09-26--manual-testing-playbook--directive-lifecycle-dedup-five-cli/`.
- [x] T020 Confirm the live generation file is unchanged after the sandboxed CP-004 runs. Evidence: the teardown check in all five CP-004 reruns printed `live generation file unchanged`. Pi's tester also saw one later write, after teardown, labeled `advisor-server-watcher-reindex` by the live daemon's own watcher. The full advisor suite, the gate suites and the fixed two-launcher reproduction left the live generation and launcher state files byte-identical.
- [x] T021 Run `validate.sh --strict --recursive` on the packet and require `RESULT: PASSED`. Evidence: 10 folders, each `RESULT: PASSED` with 0 errors and 0 warnings, after `repair-derived --apply` on 009, 008 and the parent.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

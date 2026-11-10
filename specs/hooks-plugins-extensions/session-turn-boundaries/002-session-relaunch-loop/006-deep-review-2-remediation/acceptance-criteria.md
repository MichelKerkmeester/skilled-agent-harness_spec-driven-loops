---
title: "Acceptance Criteria: Phase 6: deep-review-2-remediation"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "deep review 2 remediation acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "specs/hooks/023-session-relaunch-loop/006-deep-review-2-remediation"
    last_updated_at: "2026-10-19T00:00:00Z"
    last_updated_by: "closure-pass"
    recent_action: "Marked every criterion Met with its named test, command or run"
    next_safe_action: "Run repair-derived.cjs and validate.sh --strict on this folder"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "[SESSION-ID]"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 6: deep-review-2-remediation

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

**Red-run method** shared by every code row: the working-tree tests run against the HEAD `b830fd0276` library (phases 001 to 005, before any change here) in a scratch mirror. That run reports 407 tests, 271 pass, 136 fail, exit 1. The final code runs the same tests green: `node --test .skilled/hooks/session-relaunch/tests/*.test.cjs .opencode/plugins/tests/session-relaunch.test.cjs` prints `tests 448`, `pass 448`, `fail 0`, exit 0.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** specs/hooks/023-session-relaunch-loop/006-deep-review-2-remediation
**Level:** 2
**Status:** Complete
**Date:** 2026-10-19
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a `fs.writeSync` that returns fewer bytes than the line, when `appendLog` runs, then it throws and the caller does not see success (LUNA-001) | Test `appendLog rejects a short write instead of reporting success` (`.skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs`), red on the mirror, green in the 448/448 run. The fix is `.skilled/hooks/session-relaunch/lib/relaunch-core.cjs:599` (`expectedBytes`) and `:606` (throw `relaunch log short write`) | Met | - |
| AC-002 | REQ-001 | Given the fallback state dir is owned by another user or is not a real directory, when the core resolves its state dir, then it refuses that dir and uses `skilled-relaunch-<uid>` created 0700 (LUNA-002) | Tests `stateDir falls back to a per-user temp directory without a runtime dir` and `ensureStateDir refuses a state directory owned by another user` (`.skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs`), both red on the mirror; the 0700 repair is held by `writeState repairs a permissive state directory back to private mode` and `killer restores a permissive state directory to private mode`. Code: `.skilled/hooks/session-relaunch/lib/relaunch-core.cjs:159` builds the per-uid name, `:43` checks ownership before it chmods | Met | - |
| AC-003 | REQ-002 | Given the signal probe returns EPERM for a pid owned by another user, when `targetIsRunning` runs, then it returns false and the killer logs no `kill_EPERM` error (R1-P2-001) | Test `killer treats an EPERM liveness probe as a target that is already gone` (`.skilled/hooks/session-relaunch/tests/killer.test.cjs`), red on the mirror, green in the 448/448 run. Code: `.skilled/hooks/session-relaunch/lib/killer.cjs:120` returns false for `ESRCH` and `EPERM`, so no error line is logged. The manual `--target-pid 1` probe was not re-run at closure; the test exercises the same branch | Met | - |
| AC-004 | REQ-002 | Given the killer hands off from record A to a prepared record B before its timeout, when the timeout fires, then it re-reads the record, skips unarm and notify for A, and leaves B armed (R1-P2-002) | Test `killer timeout leaves a newer armed handoff to the killer that owns it` (`.skilled/hooks/session-relaunch/tests/killer.test.cjs`), red on the mirror, green in the 448/448 run. Code: `.skilled/hooks/session-relaunch/lib/killer.cjs:480` re-reads the record before it acts, and the notification names the record it read | Met | - |
| AC-005 | REQ-002 | Given a record that does not match the target, when the killer runs, then it reads the record before the ancestry check and signals nothing; the residual pid-reuse window is written in `killer.cjs` (LUNA-003, R2-P2-001) | Test `killer logs a disarmed record before refusing a non-descendant target` (`.skilled/hooks/session-relaunch/tests/killer.test.cjs`), red on the mirror; it also went red against a mutated copy that put the ancestry check first. `rg -n "reuse" .skilled/hooks/session-relaunch/lib/killer.cjs` returns `.skilled/hooks/session-relaunch/lib/killer.cjs:579` to `:581`, which state the window and that Node exposes no pidfd handle | Met | - |
| AC-006 | REQ-002 | Given a lock older than the killer's maximum lifetime whose pid is reused by a live process, when `acquireLock` and `liveKillerPid` run, then the lock is stale, the takeover succeeds, and two concurrent takeovers yield exactly one winner (R1-P2-004) | Tests `liveKillerPid ignores a lock whose recorded expiry has passed`, `liveKillerPid ages out a legacy lock without an expiry field`, `killer takes over a lock whose live owner recorded a past expiry` and `two killers cannot both claim the same stale lock`, all red on the mirror and green in the 448/448 run. Code: `.skilled/hooks/session-relaunch/lib/relaunch-core.cjs:710` and `:678` (`lockIsExpired`), `.skilled/hooks/session-relaunch/lib/killer.cjs:347` (`acquireLock`) | Met | - |
| AC-007 | REQ-003 | Given a runtime child running under fish, dash, ksh, tcsh or nu, when the CLI detects the live shell, then it finds the child and strips a leading `-` from `comm` (R2-P2-003) | The `for (const shellCommand of ['fish', '-zsh'])` loop in `.skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs` expands to `prepare exits two for a live fish child of the Claude process` and `prepare exits two for a live -zsh child of the Claude process`, both red on the mirror and green in the 448/448 run. Code: `.skilled/hooks/session-relaunch/bin/session-relaunch.cjs:19` lists the shells, `:250` strips the login dash. The README and the command-runtimes playbook record that non-shell children are not detected | Met | - |
| AC-008 | REQ-003 | Given a process tree, when `runtimePidFromLoop` runs, then it returns the same pid as `core.findLoopChildPid`, and `rg` finds one process-table walk outside the killer's fail-closed walk (R3-P2-003) | Test `findLoopChildPid selects the ancestor directly below the loop` (`.skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs:880`), red on the mirror and green in the 448/448 run. `rg -n "findLoopChildPid\|readProcessTable" .skilled/hooks/session-relaunch` finds one definition of each in `.skilled/hooks/session-relaunch/lib/relaunch-core.cjs` (`:750`, `:726`) and the CLI delegate at `.skilled/hooks/session-relaunch/bin/session-relaunch.cjs:242` | Met | - |
| AC-009 | REQ-004 | Given `REPO_ROOT` is set to another project and `SESSION_RELAUNCH_REPO_ROOT` is unset, when the CLI, `nudge.cjs` and the Pi adapter resolve the repo root, then all three use the install root, and a runtime started in a repo subdirectory gets a planned note path that prepare accepts (NEW-001, R2-P2-002) | The resolver is `resolveRepoRoot` in `.skilled/hooks/session-relaunch/lib/nudge.cjs:203`, called by `.skilled/hooks/session-relaunch/bin/session-relaunch.cjs:129` and `.skilled/hooks/session-relaunch/pi/session-relaunch.ts:188`. Tests `resolveRepoRoot anchors the note path on the repository that holds the hook`, `resolveRepoRoot ignores the generic REPO_ROOT and an empty override`, `context nudge plans the handoff note under the resolved repo root`, `plannedNotePath resolves the repo root and stamps the session id`, and `resolves a relative SESSION_RELAUNCH_REPO_ROOT into an absolute note path` in the Pi, Hermes and Codex suites. The hostile-env case went red on a scratch copy that read `REPO_ROOT` first (`AssertionError resolveRepoRoot({"REPO_ROOT":"/some/other/project"})`). `rg -n "REPO_ROOT" .skilled/hooks/session-relaunch .skilled/bin` finds the `SESSION_RELAUNCH_REPO_ROOT` occurrences plus the unrelated `.skilled/bin/check-git-hooks.sh` and `.skilled/bin/compiled-route-guard.cjs`; the bare variable is read nowhere in the concern | Met | - |
| AC-010 | REQ-005 | Given the parent spec and the two phase folders, when they are read after the edits, then the parent's child count matches its phase map (six children after this phase was added), the scope bullets and files rows for 005 and 006 exist, and no active file cites a review path that does not resolve (R3-P2-001, LUNA-004, R3-P2-002, LUNA-005 duplicate) | `rg -n "All four children\|review/review-report.md" specs/hooks/023-session-relaunch-loop` returns 45 lines: 34 in `review/` history (frozen review transcripts quoting the old path), 4 elsewhere, and 7 in this folder. `All four children` has **no hit in an active doc**: the parent metadata reads `All six children are Complete` at `specs/hooks/023-session-relaunch-loop/spec.md:39`, and the phrase survives only in archived transcripts and in the AC row that names the search string. `review/review-report.md` resolves: `specs/hooks/023-session-relaunch-loop/review/review-report.md` exists (37,457 bytes), which is the round-2 report the parent's 005-to-006 row depends on, and `specs/hooks/023-session-relaunch-loop/005-deep-review-remediation/spec.md:40` and `:43` cite `../review-archive/20261018T184826Z/review-report.md`, which exists. No stale line remains | Met | - |
| AC-011 | REQ-006 | Given the final code, when a fresh review checks the changed files against sk-code-opencode, then it confirms no open finding among the twelve and every new finding is fixed or recorded | rv3 (SWE, read-only, all four dimensions including maintainability, with a reproducible `rg` search ledger): 0 P0, 0 P1, 7 P2. Every one of the seven was confirmed by a code read and fixed by serial lanes f1, f5, f2, f7, f3, f4; none of the twelve original findings reopened. Recorded in `implementation-summary.md`; the verdict and registry are at `specs/hooks/023-session-relaunch-loop/review/review-report.md:1` and run-ledger rows `specs/hooks/023-session-relaunch-loop/scratch/run-ledger.md:483` and `:484` | Met | - |
| AC-012 | REQ-006 | Given the final state, when the full gate and the four live playbooks run, then every count is at or above the phase 005 closure (node 375, pytest 62, Pi relaunch vitest 21, registration vitest 7, tsc 0, shellcheck 0, drift guards 4/4), and Pi, OpenCode, Claude and Codex each pass their playbook | Final gate, 18 steps, every one rc 0, overall rc 0: node 448/448 fail 0, pytest 62, Pi relaunch vitest 27/27, registration vitest 7/7, tsc 0, shellcheck 0, drift guards 4/4, hook-sync 0, runtime mirrors 0, hermes prompts 0, OpenCode plugin import ok, deep-review 34/34, verify-iteration 31/31, extract-structure 4, readme-manifest PASS, post-edit-router 0, frontmatter-version 0, adapter parity 128/128. The node suite was re-run at closure: `tests 448`, `pass 448`, `fail 0`, exit 0. Live round 9 on the frozen code: `.skilled/skills/system-spec-kit/benchmark/reports/2026-10-19--manual-testing-playbook--session-relaunch-final-code/results.csv` carries four PASS rows (claude 9, pi 9, opencode 9, codex 9), with pane captures in `evidence/live-runs-2026-10-19/`; ledger `specs/hooks/023-session-relaunch-loop/scratch/run-ledger.md:506` | Met | - |
| AC-013 | REQ-006 | Given this folder after closure, when `repair-derived.cjs --folder <006> --apply` and `validate.sh <006> --strict` run, then the derived repair exits 0 and the validator prints `RESULT: PASSED` | `repair-derived.cjs --apply` exit 0 and `validate.sh --strict` prints `RESULT: PASSED`, `Summary: Errors: 0`, exit 0; both commands are `.skilled/skills/system-spec-kit/runtime/cli/spec/repair-derived.cjs:1` and `.skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh:1`, run against this folder after `implementation-summary.md` was authored. Recorded in `implementation-summary.md` | Met | - |
| AC-014 | REQ-007 | Given the operator direction "We fix all gaps", when the phase closes, then every gap the live playbooks found in the hook is fixed with a test (G1 to G25 in `spec.md` section 4.1) and the four runtimes pass a final-code live round with zero operator input; G20, G21 and the OpenCode default model are recorded as limitations, not as met work | Every gap row in `spec.md` section 4.1 names a test that exists and passes in the 448/448 run; the gap tests that also appear on the mirror red list are G1, G7, G11, G14, G18, G19 and G22. Round 9 with all four runtimes in parallel on the frozen code: Claude 78793, OpenCode 78816, Codex 78834, Pi 78800, every receiver claimed, answered and completed its note, zero operator prompts, every wrapper exit 0. Run folders `...session-relaunch-final-code/` (4 PASS) and `...session-relaunch-live-four-cli/` (13 runs, 11 PASS, 2 FAIL on earlier OpenCode code). Limitations recorded in `implementation-summary.md`; the gap register is `specs/hooks/023-session-relaunch-loop/006-deep-review-2-remediation/spec.md:145` and the final round is ledger `specs/hooks/023-session-relaunch-loop/scratch/run-ledger.md:506` | Met | - |

### Status values

| Value | Meaning |
|-------|---------|
| `Met` | Verified. The Verification cell names evidence that was actually observed. |
| `Unmet` | Not yet satisfied. Blocks closure. |
| `Waived` | Deliberately not pursued. Requires an ADR in the Waiver cell. |
| `Superseded` | Replaced by a different criterion or decision. Requires an ADR in the Waiver cell. |

### Waiver cell

Write `-` when the row is `Met` or `Unmet`. Write `ADR-NNN` when the row is
`Waived` or `Superseded`, naming a decision record that exists in
`decision-record.md`. A waiver naming an ADR that is not there fails validation:
the point of a waiver is that someone recorded the reasoning, so an unbacked
waiver is treated as an unmet criterion rather than as a pass.
<!-- /ANCHOR:criteria -->

---

<!-- ANCHOR:closure -->
## 3. CLOSURE STATEMENT

**Closeable:** Yes

Fourteen criteria are Met and none is waived or superseded. The twelve round-2 findings carried the code work: each has a test that fails on the HEAD library and passes on the final code, and a fresh review found nothing open among them. AC-007, AC-008 and AC-009 carried the class-level fixes that shared one rule across readers, and AC-010 closed the documentation drift in the parent and the sibling phase.

AC-012 and AC-014 carry the part a static review cannot reach: the loop ran for real on Claude, OpenCode, Codex and Pi, both while the gaps were being fixed and once more on the frozen code with no operator input at all. That final round is the bar this phase closes on.

Two things are consciously left out, and both are recorded as known limitations rather than as met work: **G20** and **G21**, which are framework gate behaviors rather than hook defects, and the **OpenCode default model** failing provider routing, which is a runtime configuration issue and not this loop's code.
<!-- /ANCHOR:closure -->

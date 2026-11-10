---
title: "Tasks: Phase 6: deep-review-2-remediation"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "deep review 2 remediation tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 6: deep-review-2-remediation

<!-- SPECKIT_LEVEL: 2 -->

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

Every code task is one change per builder dispatch. The named test is written first and must fail on the code before the fix.

**Red-run method**: the working-tree tests run against the HEAD `b830fd0276` library in a scratch mirror. That run reports 407 tests, 271 pass, 136 fail, exit 1, and its failing list is the red evidence of record. The same tests pass on the final code. A test named below appears in that list unless the row says otherwise.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Scaffold the phase under the parent (`006-deep-review-2-remediation/`)
- [x] T002 Confirm each of the twelve active findings against its file and line (`../review-archive/20261019T144809Z/review-report.md`, `evidence/review-2-verification.md`). The report and its registry are present at that path; `spec.md` section 2 carries the twelve with their group
- [x] T003 Author the five docs for this folder: `spec.md`, `plan.md`, `tasks.md`, `acceptance-criteria.md`, `goal.md`
- [x] T004 Capture the gate baseline before the first code edit and record the counts in `implementation-summary.md` at closure (`plan.md` section 5). Baseline is the phase 005 closure: node 375, pytest 62, Pi relaunch vitest 21, registration vitest 7, tsc 0, shellcheck 0, drift guards 4/4
- [x] T005 Confirm the builder lane and the scope for every out-of-folder file in `spec.md` section 3. Lane: cli-pi with DeepSeek V4.1 Flash max, one change per dispatch. Out-of-folder edits ran as their own lanes: the parent and 005 docs under the orchestrator's explicit scope, recorded in the run ledger before the lane started
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### WS-A Core library (REQ-001)

- [x] T006 [P] Write a failing test: a short `fs.writeSync` return throws from `appendLog` (`.skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs`) covers LUNA-001. Test `appendLog rejects a short write instead of reporting success`: red on the mirror, green on the final code
- [x] T007 [P] Fix `appendLog` to throw when the write returns less than `Buffer.byteLength(text)` (`.skilled/hooks/session-relaunch/lib/relaunch-core.cjs`) covers LUNA-001. `relaunch-core.cjs:599` computes `expectedBytes` and `:606` throws `relaunch log short write`
- [x] T008 [P] Write a failing test: a foreign-owned fallback dir is refused and the per-user `skilled-relaunch-<uid>` dir is used (`.skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs`) covers LUNA-002. Tests `stateDir falls back to a per-user temp directory without a runtime dir` and `ensureStateDir refuses a state directory owned by another user`
- [x] T009 Fix the state dir fallback: `skilled-relaunch-<uid>`, lstat it as a real dir owned by the user, then chmod 0700 (`.skilled/hooks/session-relaunch/lib/relaunch-core.cjs`) covers LUNA-002. `relaunch-core.cjs:159` builds the per-uid name, `:43` (`ensureStateDir`) checks ownership before it chmods
- [x] T010 [P] Write a failing test: `liveKillerPid` reports no live killer for a lock older than the killer's maximum lifetime, even when the pid exists (`.skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs`) covers R1-P2-004 (core part). Tests `liveKillerPid ignores a lock whose recorded expiry has passed` and `liveKillerPid ages out a legacy lock without an expiry field`
- [x] T011 Fix `liveKillerPid` to read the lock's expiry (`.skilled/hooks/session-relaunch/lib/relaunch-core.cjs`) covers R1-P2-004 (core part). `relaunch-core.cjs:710` reads owner and expiry from one snapshot; a legacy lock without one ages out at `LEGACY_LOCK_MAX_AGE_MS` (`:21`, ten minutes)

### WS-B Killer (REQ-002)

- [x] T012 [P] Write a failing test: EPERM from the signal probe returns false from `targetIsRunning` (`.skilled/hooks/session-relaunch/tests/killer.test.cjs`) covers R1-P2-001. Test `killer treats an EPERM liveness probe as a target that is already gone`
- [x] T013 Fix `targetIsRunning` so EPERM means not our target (`.skilled/hooks/session-relaunch/lib/killer.cjs`) covers R1-P2-001. `killer.cjs:120` returns false for `ESRCH` and `EPERM`
- [x] T014 [P] Write a failing test: a timeout after a handoff to record B skips unarm and notifies nothing for A (`.skilled/hooks/session-relaunch/tests/killer.test.cjs`) covers R1-P2-002. Test `killer timeout leaves a newer armed handoff to the killer that owns it`
- [x] T015 Fix `recordTimeout` to re-read the record and skip unarm and notify when the handoff changed (`.skilled/hooks/session-relaunch/lib/killer.cjs`) covers R1-P2-002. `killer.cjs:480` re-reads before it acts
- [x] T016 [P] Write a failing test: a record that does not match the target is not signalled, with the record read before the ancestry check (`.skilled/hooks/session-relaunch/tests/killer.test.cjs`) covers LUNA-003 and R2-P2-001 (duplicate). Test `killer logs a disarmed record before refusing a non-descendant target`
- [x] T017 Move the record read above the ancestry check and add the residual pid-reuse window comment with its durable WHY only (`.skilled/hooks/session-relaunch/lib/killer.cjs`) covers LUNA-003 and R2-P2-001. The comment states the window and why a numeric pid cannot close it; no finding id or packet path is in it
- [x] T018 [P] Write a failing test: a lock pinned by a reused pid is taken over after expiry, and two concurrent takeovers yield one winner (`.skilled/hooks/session-relaunch/tests/killer.test.cjs`) covers R1-P2-004 (killer part). Tests `killer takes over a lock whose live owner recorded a past expiry` and `two killers cannot both claim the same stale lock`
- [x] T019 Fix `acquireLock` to treat an expired lock as stale and to take it over atomically (`.skilled/hooks/session-relaunch/lib/killer.cjs`) covers R1-P2-004 (killer part). `killer.cjs:347` takes over through a mutex and a hold bound, and it leaves a lock a contender claimed

### WS-C CLI (REQ-003)

- [x] T020 [P] Write a failing test: the live-shell list detects fish, dash, ksh, tcsh and nu, and strips a leading `-` from `comm` (`.skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs`) covers R2-P2-003. The `for (const shellCommand of ['fish', '-zsh'])` loop expands to `prepare exits two for a live fish child of the Claude process` and `prepare exits two for a live -zsh child of the Claude process`; both are on the red list
- [x] T021 Fix the live-shell list and document that non-shell children are not detected (`.skilled/hooks/session-relaunch/bin/session-relaunch.cjs`) covers R2-P2-003. `session-relaunch.cjs:19` lists the shells, `:250` strips the login dash; the README and the playbook carry the non-shell limit
- [x] T022 [P] Write a failing test: `runtimePidFromLoop` returns the same pid as `core.findLoopChildPid` for one fixture tree (`.skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs`) covers R3-P2-003. Test `findLoopChildPid selects the ancestor directly below the loop`, with the CLI case covered through the same fixture tree
- [x] T023 Replace `runtimePidFromLoop` and its duplicate walk with `core.findLoopChildPid`, keeping the killer's fail-closed walk (`.skilled/hooks/session-relaunch/bin/session-relaunch.cjs`) covers R3-P2-003. `session-relaunch.cjs:242` delegates; `relaunch-core.cjs:750` is the only definition
- [x] T024 Reword 005 AC-002 so it names the single core definition (`specs/hooks/023-session-relaunch-loop/005-deep-review-remediation/acceptance-criteria.md`) covers R3-P2-003. Landed in the e2b doc lane and verified by `rg`. Its line references describe the phase-005 snapshot and shifted when this phase added CLI helpers; the wording names the single definition, which is what the AC asks

### WS-D Repo root (REQ-004)

- [x] T025 [P] Write a failing test: one shared resolver honors `SESSION_RELAUNCH_REPO_ROOT`, ignores `REPO_ROOT`, and falls back to the install root not the cwd (`.skilled/hooks/session-relaunch/tests/nudge.test.cjs`) covers NEW-001 and R2-P2-002. Tests `resolveRepoRoot anchors the note path on the repository that holds the hook`, `resolveRepoRoot ignores the generic REPO_ROOT and an empty override`, and the three `resolves a relative SESSION_RELAUNCH_REPO_ROOT into an absolute note path` cases
- [x] T026 Add the shared resolver to `lib/nudge.cjs`, which is its owner: `resolveRepoRoot` at `nudge.cjs:203`, exported at `:409` (`.skilled/hooks/session-relaunch/lib/nudge.cjs`) covers NEW-001 and R2-P2-002
- [x] T027 Switch the CLI, `nudge.cjs` and the Pi adapter to the resolver and the new name (`.skilled/hooks/session-relaunch/bin/session-relaunch.cjs:129`, `.skilled/hooks/session-relaunch/lib/nudge.cjs:254`, `.skilled/hooks/session-relaunch/pi/session-relaunch.ts:188`) covers NEW-001 and R2-P2-002
- [x] T028 Update the readers' tests and the Pi test fixtures to the new name (`.skilled/hooks/session-relaunch/tests/*.test.cjs`, `.skilled/hooks/session-relaunch/pi/session-relaunch.test.ts`) covers R2-P2-002. `rg -n "REPO_ROOT"` over the concern and `.skilled/bin` returns the resolver line plus `check-git-hooks.sh` and `compiled-route-guard.cjs`, which are unrelated repo scripts

### WS-E Docs (REQ-005)

- [x] T029 Remove the parent spec drift: six children, the 005 and 006 scope bullets and the files rows (`specs/hooks/023-session-relaunch-loop/spec.md`) covers R3-P2-001 and LUNA-005 (duplicate). The parallel worker landed the count and the bullets; this phase closed the phase-map row and replaced the 006 files row
- [x] T030 Point the review-report citations at the archived report where the dependency is the round-1 review: `005-deep-review-remediation/spec.md:40` and `:43` now read `../review-archive/20261018T184826Z/review-report.md`. The parent's 005-to-006 handoff row cites `review/review-report.md`, which is the round-2 report and is present (37,457 bytes). `rg` finds no dangling citation in the parent or 005 docs covers LUNA-004 and R3-P2-002 (duplicate)
- [x] T031 Document `SESSION_RELAUNCH_REPO_ROOT`, the install-root fallback and the non-shell detection limit (`.skilled/hooks/session-relaunch/README.md:159`, `.skilled/bin/README.md`, the command-runtimes playbook) covers NEW-001, R2-P2-002, R2-P2-003
- [x] T032 Run the sk-doc validators on each changed doc through its matching mode and record the output (`.skilled/skills/sk-doc/`). The doc lanes reported 0 validator errors on the changed docs; the two pre-existing `env.example` findings are unchanged from HEAD and disclosed

<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T033 Fresh review of the changed code against the sk-code-opencode checklists, with each confirmed finding fixed and retested. rv3 (SWE, read-only, all four dimensions with a reproducible `rg` search ledger): 0 P0, 0 P1, 7 P2, every one confirmed by a code read and fixed by serial lanes f1, f5, f2, f7, f3, f4. None of the twelve original findings reopened
- [x] T034 Full gate from the final state, compared with the T004 baseline: every count at or above the phase 005 closure. Node 448/448 fail 0, pytest 62, Pi relaunch vitest 27/27, registration vitest 7/7, tsc 0, shellcheck 0, drift guards 4/4, plus hook-sync, runtime mirrors, hermes prompts, OpenCode plugin import, deep-review 34/34, verify-iteration 31/31, extract-structure 4, readme-manifest PASS, post-edit-router 0, frontmatter-version 0 and adapter parity 128/128. Eighteen steps, every one rc 0
- [x] T035 Live playbook run on Pi from the final state (`.skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/session-relaunch-command-runtimes.md`). Round 9, loop 78800: prepare to SIGTERM 28 s, claim, answer, complete, zero operator prompts, wrapper exit 0
- [x] T036 Live playbook run on OpenCode from the final state (same playbook). Round 9, loop 78816: 13 s end to end, zero prompts, wrapper exit 0
- [x] T037 Live playbook run on Claude from the final state (same playbook). Round 9, loop 78793: prepare to SIGTERM 8 s, zero prompts, wrapper exit 0
- [x] T038 Live playbook run on Codex from the final state (same playbook). Round 9, loop 78834 in the scratch clone: 16 s, zero prompts, wrapper exit 0
- [x] T039 Confirm `rg -n "REPO_ROOT"` shows only the resolver and unrelated repo scripts, and `rg -n "All four children|review/review-report.md"` finds no stale statement. `All four children` has no hit in an active doc; the four hits left are archived review transcripts. `review/review-report.md` resolves. See AC-010 for the recorded counts
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:live-gaps -->
## Phase 4: Live-gap remediation (REQ-007)

The operator directed "We fix all gaps" after the live runs. Each task below is one gap group from `spec.md` section 4.1, fixed with its own test and re-run live. G20, G21 and the OpenCode default model are not hook defects and are recorded as limitations in T054.

- [x] T043 CLI usability: `--help`, a per-subcommand usage line on error, the prepared-handoff success line, and a usage line that names both exit-3 declines (G1, G18, G25) (`.skilled/hooks/session-relaunch/bin/session-relaunch.cjs`). Tests `claim --help prints the claim usage on stdout and exits zero`, `-h after a subcommand prints the full usage listing`, `an unknown subcommand exits two and lists the commands on stderr`, `prepare under the loop prints the prepared handoff and the stop instruction`, `prepare declines at the hop limit without writing a relaunch record`. The success line is what cut Pi's hop from 3 min (run 8) to 28 s (run 9)
- [x] T044 Nudge text and seed: ratio wording past the window, an imperative opening, the finish-instead sentence, the real note path, no placeholder step, and no complete clause in the handoff text (G2, G8, G11, G15, G22, G28) (`.skilled/hooks/session-relaunch/lib/nudge.cjs`). Tests `handoff text names a ratio past the configured window instead of the raw percentage`, `handoff text opens the ratio nudge imperatively and keeps the exception last`, `handoff text leaves the complete instruction to the seed text`, `UserPromptSubmit seed claims the absolute note path it carries`, `seed text runs the real claim command with no placeholder explanation`
- [x] T045 Handoff state gate: no nudge while this session's record is pending or armed, one max-age source, a staleness window (G14, G14b, G14c) (`.skilled/hooks/session-relaunch/lib/nudge.cjs`, the adapters). Tests `handoffPending is false for an armed record past the max age`, `handoffPending honors a max age saved in the hook config file, with the environment winning`, `handoffPending is true for a pending record owned by this session`, `context nudge stays quiet while this session already has a prepared handoff`
- [x] T046 Open-note reuse: a re-nudge keeps the session's open note instead of planning a second path (G7) (`.skilled/hooks/session-relaunch/lib/nudge.cjs`, `.opencode/plugins/session-relaunch.js`). Tests `plannedNotePath reuses the open note of the session for every later nudge`, `a restarted nudge reuses a matching handoff note`
- [x] T047 OpenCode plugin: the seed persists until the note is claimed, then one completion reminder carries the complete command (G4, G24) (`.opencode/plugins/session-relaunch.js`, `.skilled/hooks/session-relaunch/lib/nudge.cjs`). Tests `seed stays pending across later text parts`, `the seed repeats on every transform until the note is closed`, `a claimed note pushes one completion reminder instead of the claim text`. Proven live in round 7 and again in round 9
- [x] T048 Pi extension: a follow-up that starts a turn, decide at `message_end`, deliver at `agent_end` after a re-check (G5, G17) (`.skilled/hooks/session-relaunch/pi/session-relaunch.ts`). Tests `delivers the nudge without waiting for an operator turn`, `agent_end delivers the nudge held from message_end exactly once`, `retires a held nudge once the hop count reaches the cap before delivery`
- [x] T049 Hop limit at the producer and the killer: `prepare` declines with exit 3 and no record, the adapters stop nudging, and the killer checks the limit before it signals (G18, G19) (`.skilled/hooks/session-relaunch/bin/session-relaunch.cjs`, `.skilled/hooks/session-relaunch/lib/killer.cjs`, the adapters). Tests `prepare declines at the hop limit without writing a relaunch record`, `context nudge stays quiet at the hop limit`, `context-nudge emits nothing at the hop limit`, `killer unarms an armed record at the hop limit without signalling`
- [x] T050 Codex fallbacks and the registry rows: no `mkHookDrift` in a Codex envelope, `systemMessage` on Stop and PreCompact, and an envelope fallback on the six rows that read `none` (G9, G12, G13) (`.skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/hook-registry.json`, `.codex/hooks.json`, `.claude/settings.json`). Tests `keeps every codex fallback off the rejected drift marker`, `answers codex Stop and PreCompact fallbacks with a systemMessage envelope`; `rg -n '"fallback"' hook-registry.json` shows `envelope` on all six session-relaunch rows. Both envelope shapes were probed in a trusted Codex clone before the change, and the clone's hooks file was restored byte-identical after each probe
- [x] T051 Version checks over runtime state: the post-edit checks skip the gitignored `.state` runtime files and keep the tracked `.state/<concern>/README.md` (G6, G6b) (`.skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs`, `.skilled/hooks/post-edit-quality/lib/post-edit-router.cjs`). Evidence: `test-frontmatter-version.mjs` asserts the tracked README stays a versioned doc and `gate --skill .state` scopes to it; the run printed the `.state` scope line
- [x] T052 Killer test race (G16) (`.skilled/hooks/session-relaunch/tests/killer.test.cjs`). Pre-fix 17 of 20 runs, post-fix 20 of 20 on the killer file; the test now writes the pid before it publishes the record
- [x] T053 Resolver hostile env (G23) (`.skilled/hooks/session-relaunch/tests/nudge.test.cjs`). Test `resolveRepoRoot ignores the generic REPO_ROOT and an empty override`: red on a scratch copy that read `REPO_ROOT` first with `AssertionError resolveRepoRoot({"REPO_ROOT":"/some/other/project"})`, green on the real file
- [x] T054 Final-code live round and the limitations record. Run round 9 on the frozen code, all four runtimes in parallel: Claude 78793, OpenCode 78816, Codex 78834 (scratch clone), Pi 78800. Every receiver claimed, answered and completed its note; zero operator prompts; every wrapper exit 0. Run folder `…/benchmark/reports/2026-10-19--manual-testing-playbook--session-relaunch-final-code/` with four PASS rows. G20, G21, the OpenCode default model, the worktree drift notice and the run-8 Pi wrapper exit are recorded as known limitations in `implementation-summary.md`
<!-- /ANCHOR:live-gaps -->

---

<!-- ANCHOR:phase-4 -->
## Phase 5: Closure

- [x] T040 Run `node .skilled/skills/system-spec-kit/runtime/cli/spec/repair-derived.cjs --folder specs/hooks/023-session-relaunch-loop/006-deep-review-2-remediation --apply` and record the exit code. Exit 0; the derived metadata was rewritten from the docs
- [x] T041 Run `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/hooks/023-session-relaunch-loop/006-deep-review-2-remediation --strict` until the output shows `RESULT: PASSED`, and record the exit code. `RESULT: PASSED`, exit 0, errors 0
- [x] T042 Mark every row of `acceptance-criteria.md` Met with its evidence, or Waived or Superseded with an ADR in `decision-record.md`. All fourteen rows are Met with a named test, command or run; no row is waived or superseded
<!-- /ANCHOR:phase-4 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`, or the open ones named as deferred with a reason. Every task is `[x]`; no task is deferred
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed (live playbooks T035 to T038, re-run on the frozen code as T054)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance criteria**: See `acceptance-criteria.md`, the closure gate
- **Goal**: See `goal.md`
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md
- [x] CHK-002 [P0] Technical approach defined in plan.md
- [x] CHK-003 [P1] Dependencies identified and available. The parent spec edit landed through the parallel worker, and the lane dependency (`cli-pi` with DeepSeek V4.1 Flash max) held for every dispatch
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks. shellcheck 0 and tsc 0 in the final gate
- [x] CHK-011 [P0] No console errors or warnings. The hook writes its own stderr diagnostics by design; the suite and the live runs show no unhandled error, and the gate's node suite ends `fail 0`
- [x] CHK-012 [P1] Error handling implemented. Every CLI exit path carries a usage line (G1), `prepare` exits 3 at the hop limit, and the killer gives up on a vanished transcript
- [x] CHK-013 [P1] Code follows project patterns (sk-code-opencode). rv3 reviewed all four dimensions against the checklists, and the seven findings it raised are fixed
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met
- [x] CHK-021 [P0] Manual testing complete (live playbooks for four runtimes, round 9 on the frozen code)
- [x] CHK-022 [P1] Edge cases tested. Short write, foreign-owned state dir, EPERM, a record that changes under the killer, a reused pid, a relative root, an empty override, the hop limit
- [x] CHK-023 [P1] Error scenarios validated. A vanished transcript, a hostile env, a lock path that is a directory, a contender that replaces the takeover directory
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only` (LUNA-002, R1-P2-001, R1-P2-002, LUNA-004, R2-P2-003, R3-P2-001, R3-P2-003), `class-of-bug` (LUNA-001, R1-P2-004), `cross-consumer` (NEW-001, R2-P2-002), `algorithmic` (LUNA-003), `matrix/evidence` (R2-P2-003 shell axis), or `test-isolation` (none)
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed (`plan.md` affected surfaces and the live-gap addendum), or instance-only status proven by grep
- [x] CHK-FIX-003 [P0] Consumer inventory completed for the resolver, the lock, `findLoopChildPid` and the env name, including docs and tests
- [x] CHK-FIX-004 [P0] The lock takeover and repo-root resolver include adversarial table tests: reused pid, expired lock, relative root, empty env value, and the old `REPO_ROOT` variable set alone
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed (`plan.md` section 3 and the addendum)
- [x] CHK-FIX-006 [P1] Hostile env test executed for the repo-root resolver, which reads process-wide env (`resolveRepoRoot ignores the generic REPO_ROOT and an empty override`)
- [x] CHK-FIX-007 [P1] Evidence is pinned to a fix state or explicit range, not a moving branch-relative range. The worktree may not be committed from this phase, so the pin is the frozen final-code state after the last code change plus `file:line` for every named test and a run folder for every live run; the pre-phase baseline is the explicit HEAD `b830fd0276`. No evidence cell uses a branch-relative range. A commit SHA becomes available when the orchestrator commits
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets
- [x] CHK-031 [P0] Input validation implemented. The session id stays on `validSessionId`; R1-P2-003 is disproved and every caller validates first
- [x] CHK-032 [P1] Killer signals only descendants of the wrapper, with one killer per loop. Held by `killer logs a disarmed record before refusing a non-descendant target`, `two killers cannot both claim the same stale lock` and `killer leaves a lock that a contender claimed while it supervised`
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized. The resolver owner, the affected surfaces and the live-gap register say the same thing in all three
- [x] CHK-041 [P1] Code comments adequate, with no spec paths, packet numbers or finding ids in code comments. `check-comment-hygiene.sh` ran over the 34 changed code files and exited 0
- [x] CHK-042 [P2] README updated (`.skilled/hooks/session-relaunch/README.md`, `.skilled/bin/README.md`, the three playbook pages and the feature catalog)
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only. The live-run captures live in this folder's `evidence/live-runs-2026-10-19/` (29 files); the packet `scratch/` holds no build output
- [x] CHK-051 [P1] scratch/ cleaned before completion. The packet `scratch/` holds only its `.gitkeep`
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-10-19
<!-- /ANCHOR:summary -->

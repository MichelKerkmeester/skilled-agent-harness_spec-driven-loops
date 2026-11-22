---
title: "Tasks: Phase 3: manual-runner"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "manual runner tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 3: manual-runner

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

`H` is `.skilled/skills/system-skilled-bots/`. `DL` is `.skilled/skills/system-deep-loop/runtime/lib/`. `SR` is the test state root that phase 1's layout defines, pointed at a temp folder in tests. `RF` is the test run-folder root, standing in for `<skilled tree>/.skilled/skills/.state/system-skilled-bots/<identity key>/runs/`, also a temp folder in tests. `NY` is `SR/<identity key>/needs-you/`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Confirm phase 1 is closed and read its record schema and state-root layout (`../001-contracts-and-state-root/spec.md`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-skilled-bots/001-headless-bots-first-build/001-contracts-and-state-root --strict` prints `RESULT: PASSED`.
- [ ] T002 [P] Read the lease, heartbeat and reclaim rule (`DL/deep-loop/loop-lock.ts`). Verify: `rg -n 'export function (acquireLoopLock|releaseLoopLock|startHeartbeat)' DL/deep-loop/loop-lock.ts` prints three or more lines.
- [ ] T003 [P] Read the executor kinds, `sandboxMode` mapping and `timeoutSeconds` bound (`DL/deep-loop/executor-config.ts`). Verify: `rg -n 'timeoutSeconds' DL/deep-loop/executor-config.ts` prints the `max(3600)` line.
- [ ] T004 [P] Read the environment allowlist, recursion guard and dispatch receipts (`DL/deep-loop/executor-audit.ts`). Verify: `rg -n 'RECURSION_GUARD_EXIT_CODE = 3' DL/deep-loop/executor-audit.ts` prints one line.
- [ ] T005 [P] Read the append gateway contract (`DL/mode-append-gateway/append-mode-event.ts`). Verify: `rg -n 'export async function appendModeEvent' DL/mode-append-gateway/append-mode-event.ts` prints one line.
- [ ] T033 [P] Take the deep-loop suite baseline before any edit (`.skilled/skills/system-deep-loop/runtime/`). Verify: `npx vitest run` in that folder prints a pass count, recorded in this task line.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T006 Create the `bots` CLI with `run`, `disable`, `enable`, `pause`, `resume` and `inbox`, exiting 2 on an unknown option. Phase 5 adds `answer` (`.skilled/bin/bots.cjs`). Verify: `node .skilled/bin/bots.cjs run --bogus` exits 2 and prints usage.
- [ ] T007 Create the switch writer and reader under the state root (`H/runtime/lib/switches.ts`). Verify: `bots disable <id>` creates the disable file under `SR` and `git status --porcelain` shows no new path in the checkout.
- [ ] T008 Create the posture matrix for the nine executor kinds and the refusal of `isolation: worktree` (`H/runtime/lib/posture.ts`). Verify: the posture unit test exits 0 with one row per kind.
- [ ] T009 Create the environment allowlist builder and the three secret refusals, exporting the body-secret predicate (`H/runtime/lib/dispatch.ts`). Verify: the dispatch unit test shows a planted non-allowlisted key absent from the child environment and a body with a secret literal refused, and `rg -n '^export' H/runtime/lib/dispatch.ts` lists the predicate.
- [ ] T010 Create headless dispatch with `AI_SESSION_CHILD=1`, the exemption and bound spec folder in the prompt, `timeoutSeconds` and budget classing (`H/runtime/lib/dispatch.ts`). Verify: the dispatch unit test reads the exemption line and the spec folder in the built prompt.
- [ ] T011 Create the runner in the §8 order with the lease on `loop-lock` keyed by workflow, repository and spec target, released in a `finally` path (`H/runtime/lib/runner.ts`). Verify: the runner unit test asserts the call order and that the lease key holds no worktree path.
- [ ] T012 Write the terminal record to `SR/<identity key>/records/<run id>.json` with the request join, honored posture, failure class beside the raw reason, `null` cost when unknown, delivery `not-attempted` and the five evidence pointers, each resolving inside the run folder `RF/<run id>/` (`H/runtime/lib/runner.ts`). Verify: the record test validates a happy-path record under `SR` against the phase 1 schema, its pointers resolve under `RF/<run id>/`, and a pointer to a deleted run folder is reported as missing without a throw.
- [ ] T013 Parse the `[NEEDS-DECISION]` marker and route it to exit `awaiting-decision`, stop reason `blockedStop` and class `operator`, per ADR-001 (`H/runtime/lib/dispatch.ts`, `H/runtime/lib/runner.ts`). The first marker wins. An empty question is a run failure classed `author`. A timeout or budget stop keeps its class. Verify: the parser unit test covers one marker, two markers, an empty question, a marker on exit 0 and a marker after a timeout, and a fixture child that prints the marker and exits 0 ends with `awaiting-decision` and the distinct CLI exit code.
- [ ] T014 Wire retry to ledger replay through the append gateway only (`H/runtime/lib/runner.ts`). Verify: re-sending the same result event leaves one stored event and one dispatch receipt pair.
- [ ] T024 Return a refusal outcome apart from a run failure, by CLI exit code and by the runner function, for disabled, paused, failing precheck, `[SILENT]` precheck, malformed definition, refused posture and held lease (`H/runtime/lib/runner.ts`). Verify: the outcome test shows a refusal exit code different from the run-failure exit code and a paused run with stop reason `userPaused`.
- [ ] T025 Set `SKILLED_BOT_RUN_ID` on the child and add it to `EXECUTOR_COMMON_ENV_ALLOWLIST` per ADR-005, which the operator accepted (`H/runtime/lib/dispatch.ts`, `DL/deep-loop/executor-audit.ts`). Owner `system-deep-loop`. Callers `dispatch-iteration.cjs`, `fanout-run.cjs`, `deep-review.yaml` and `deep-research.yaml` stay unchanged. Verify: before the entry, a fixture child's `env` lacks the key, which is the observed failure. After it, the child prints the run id, and a non-bot dispatch shows no key.
- [ ] T026 Write the generation stamp under `<state root>/<repository identity>/` by temp file and rename after each terminal record and each needs-you item, and export the writer for phase 5's `bots answer` (`H/runtime/lib/runner.ts`, `H/runtime/lib/needs-you.ts`). Verify: after two fixture runs and one item write, the stamp value has changed three times and no temp file remains.
- [ ] T027 Write one needs-you item per parked run under `NY` by temp file and rename, with run id, bot id, question, options, `created_at`, the dispatched prompt and the evidence pointers, then release the lease (`H/runtime/lib/needs-you.ts`, `H/runtime/lib/runner.ts`). Verify: after the marker fixture, `NY` holds one item file and the lease file for the bot is gone.
- [ ] T028 Add `bots inbox`, listing open and expired items. An item's `expiresAt` comes from `needsYou.expiryDays`, default 7 (operator decision D10), and the state is derived, never written (`.skilled/bin/bots.cjs`, `H/runtime/lib/needs-you.ts`). Verify: with a fixture item whose `created_at` is 8 days old and the default expiry, `bots inbox` prints it as `expired`, and its file is unchanged and holds no answer.
- [ ] T029 Build the resumed prompt when the runner gets a `resume` request: the item's prompt, the question and the answer, bound to the same spec folder (`H/runtime/lib/needs-you.ts`, `H/runtime/lib/runner.ts`). The body-secret predicate runs over the question and the answer before dispatch. Verify: a direct runner call with a `resume` request for a fixture answered item starts a new run id joined to the item. The built prompt holds the question, the answer and the original spec folder. A planted secret in the fixture answer is refused naming the key.
- [ ] T034 Add the hold check before dispatch: while the bot has an open needs-you item, refuse the run with the cause `awaiting-decision-hold`, naming the item id and pointing at `bots inbox`, and take no lease. A hand-typed `bots run <id>` is held too (D13). A `resume` request for an answered item passes (`H/runtime/lib/runner.ts`, `H/runtime/lib/needs-you.ts`). Verify: with one open fixture item, `bots run <id>` exits with the refusal code, the record names `awaiting-decision-hold` and the item id, and no dispatch receipt exists. With the item answered, and again with its `expiresAt` passed, the same run dispatches.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T015 Run the manual fixture bot end to end (`H/runtime/tests/`). Every fixture `BOT.md` declares `isolation: shared` explicitly, except a fixture that tests the worktree refusal, and the fixture `bots/config.json` sets no `defaultIsolation`, because phase 1 ADR-007 refuses an undeclared isolation. Verify: `rg -L --glob 'BOT.md' '^isolation: ' H/runtime/tests` prints no file, and `bots run <fixture-id>` exits 0 and `SR` holds one new terminal record with the request join, posture and evidence locations filled.
- [ ] T016 Run the disabled, paused, failing-precheck and `[SILENT]` fixtures (`H/runtime/tests/`). Verify: each ends with no dispatch receipt and one record naming its reason.
- [ ] T017 Run the unhonorable-posture and concurrent-run fixtures (`H/runtime/tests/`). Verify: both are refused before dispatch, and the second concurrent run's record names the held lease.
- [ ] T018 Kill a running fixture with SIGKILL and rerun (`H/runtime/tests/`). Verify: the lease is reclaimed by the pid, nonce and heartbeat rule, and the first record reads `unknown` only after the owner pid is gone.
- [ ] T019 Run the stuck-invocation and budget fixtures (`H/runtime/tests/`). Verify: the timeout record and the budget record carry two different classes.
- [ ] T020 Prove the switches and the needs-you items are out of the checkout's reach (`H/runtime/tests/`). Verify: a child with checkout write access fails to change the disable file or create an item under `NY`, and the test exits 0.
- [ ] T021 Search every runner log for the fixture prompt and a planted environment value (`H/runtime/tests/`). Verify: `rg -F '<planted value>' <runner log dir>` prints nothing.
- [ ] T022 Check that no scheduler call exists (`H/`). Verify: `rg -n 'launchctl|\.plist' .skilled/skills/system-skilled-bots/ .skilled/bin/bots.cjs` prints nothing.
- [ ] T023 Run the deep-loop suite to show the imports and the one allowlist entry changed nothing else (`.skilled/skills/system-deep-loop/runtime/`). Verify: `npx vitest run` in that folder reports the same pass count as the T033 baseline.
- [ ] T031 Run the decision fixture end to end (`H/runtime/tests/`). Verify: `bots run <marker-fixture>` exits with the `awaiting-decision` code, `bots inbox` lists one open item, and the record reads stop reason `blockedStop`, class `operator`.
- [ ] T032 Prove run folders are gitignored in the real tree (repository root). Verify: `git check-ignore -v .skilled/skills/.state/system-skilled-bots/x/runs/y/ledger.jsonl` prints the `.skilled/skills/.state/*/*` rule.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
- [ ] Every row in `acceptance-criteria.md` is `Met`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Decisions**: See `decision-record.md`
- **Closure gate**: See `acceptance-criteria.md`
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

A task stays `[B]` only with the blocking fact written beside it. A `[B]` task blocks close.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Requirements documented in spec.md
- [ ] CHK-002 [P0] Technical approach defined in plan.md
- [ ] CHK-003 [P1] Dependencies identified and available: phase 1 validates with `RESULT: PASSED`
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Code passes lint/format checks: `npx tsc --noEmit` in the skill runtime exits 0
- [ ] CHK-011 [P0] No console errors or warnings in a fixture run
- [ ] CHK-012 [P1] Error handling implemented: every exit path releases the lease
- [ ] CHK-013 [P1] Code follows project patterns: the only deep-loop path in `git diff --name-only` is `executor-audit.ts`, and its diff is the one allowlist entry
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met
- [ ] CHK-021 [P0] Manual testing complete: one real manual bot ran on one admitted kind
- [ ] CHK-022 [P1] Edge cases tested: no id, unknown id, timeout, recursion refusal
- [ ] CHK-023 [P1] Error scenarios validated: killed run, held lease, refused posture
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets, and the body-secret refusal fixture is refused
- [ ] CHK-031 [P0] Input validation implemented: unknown options and unhonorable postures are refused
- [ ] CHK-032 [P1] Child environment holds only allowlisted keys, and no log holds a command line or value
- [ ] CHK-033 [P1] Needs-you items are owner-only and unreachable from the checkout, and question and answer pass the body-secret predicate
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks synchronized
- [ ] CHK-041 [P1] Code comments carry the durable why and no packet or requirement id
- [ ] CHK-042 [P2] README updated (if applicable)
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files in scratch/ only
- [ ] CHK-051 [P1] scratch/ cleaned before completion
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 10 | 0/10 |
| P1 Items | 21 | 0/21 |
| P2 Items | 9 | 0/9 |

**Verification Date**: Not yet verified. Nothing is built.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: Architecture Verification

- [ ] CHK-100 [P0] ADR-001 and ADR-005 are followed: T013, T027 to T029 and T034 for the queue and the hold, T025 for the allowlist entry
- [ ] CHK-101 [P1] All ADRs in `decision-record.md` carry a status
- [ ] CHK-102 [P1] Each ADR lists its alternatives with a rejection reason
- [ ] CHK-103 [P2] N/A: no migration, every path is new except one allowlist entry
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: Performance Verification

- [ ] CHK-110 [P1] NFR-P01: the runner's work before dispatch takes under 2 seconds in a timed fixture run, excluding the precheck
- [ ] CHK-111 [P1] NFR-P02: N/A for throughput, a second run is refused at the lease (T017)
- [ ] CHK-112 [P2] N/A: no load test, one run handles one bot
- [ ] CHK-113 [P2] The timed fixture run's numbers are written in `implementation-summary.md`
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: Deployment Readiness

- [ ] CHK-120 [P0] Rollback tested in a copy: removing the phase's paths and the allowlist entry leaves the deep-loop suite at the T033 count
- [ ] CHK-121 [P1] No scheduler is installed by this phase (T022)
- [ ] CHK-123 [P1] The skill's docs say how to disable, pause, list and answer a bot
- [ ] CHK-124 [P2] The operator has read those docs
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: Compliance Verification

- [ ] CHK-130 [P1] Security review of the secret refusals, the allowlist entry and the item paths completed
- [ ] CHK-131 [P1] No new dependency is added, so no license changes
- [ ] CHK-132 [P2] N/A: no web surface for OWASP Top 10
- [ ] CHK-133 [P2] Items and run folders hold no value of a non-allowlisted key
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: Documentation Verification

- [ ] CHK-140 [P1] `spec.md`, `plan.md`, `tasks.md` and `decision-record.md` agree on the run-folder path, the item path and `SKILLED_BOT_RUN_ID`
- [ ] CHK-141 [P1] The `bots` CLI usage text lists all six verbs this phase adds
- [ ] CHK-142 [P2] Phase 1's layout table names the needs-you folder and the run-folder root
- [ ] CHK-143 [P2] Phase 5's spec names the `resume` request kind this runner accepts and owns `bots answer`
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: Sign-Off

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Operator | Owner of the bots program, accepts the phase | [ ] Approved | |
<!-- /ANCHOR:sign-off -->

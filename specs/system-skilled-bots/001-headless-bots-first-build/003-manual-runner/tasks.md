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

- [x] T001 Confirm phase 1 is closed and read its record schema and state-root layout (`../001-contracts-and-state-root/spec.md`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-skilled-bots/001-headless-bots-first-build/001-contracts-and-state-root --strict` prints `RESULT: PASSED`. Evidence: phase 1 `validate.sh --strict` printed `RESULT: PASSED` on 2026-11-22.
- [x] T002 [P] Read the lease, heartbeat and reclaim rule (`DL/deep-loop/loop-lock.ts`). Verify: `rg -n 'export function (acquireLoopLock|releaseLoopLock|startHeartbeat)' DL/deep-loop/loop-lock.ts` prints three or more lines. Evidence: read `acquireLoopLock`, `refreshLoopLock`, `startHeartbeat`, `releaseLoopLock` and `isStaleLoopLock`.
- [x] T003 [P] Read the executor kinds, `sandboxMode` mapping and `timeoutSeconds` bound (`DL/deep-loop/executor-config.ts`). Verify: `rg -n 'timeoutSeconds' DL/deep-loop/executor-config.ts` prints the `max(3600)` line. Evidence: `timeoutSeconds` is `max(3600)` and `EXECUTOR_PREVENTIVE_SANDBOX_CAPABILITY` is per kind.
- [x] T004 [P] Read the environment allowlist, recursion guard and dispatch receipts (`DL/deep-loop/executor-audit.ts`). Verify: `rg -n 'RECURSION_GUARD_EXIT_CODE = 3' DL/deep-loop/executor-audit.ts` prints one line. Evidence: `RECURSION_GUARD_EXIT_CODE = 3`, the allowlist and receipts read.
- [x] T005 [P] Read the append gateway contract (`DL/mode-append-gateway/append-mode-event.ts`). Verify: `rg -n 'export async function appendModeEvent' DL/mode-append-gateway/append-mode-event.ts` prints one line. Evidence: read `appendModeEvent`. It needs a per-mode event registry, a transition policy, an authority root and a cutover binding (see T014).
- [x] T033 [P] Take the deep-loop suite baseline before any edit (`.skilled/skills/system-deep-loop/runtime/`). Verify: `npx vitest run` in that folder prints a pass count, recorded in this task line. Evidence: clean baseline `scratch/deep-loop-baseline.txt`: 222 files, 4039 passed, 11 skipped, exit 0. A first run overlapped an early edit and is kept as `scratch/deep-loop-baseline-contaminated.txt`, not used.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T006 Create the `bots` CLI with `run`, `disable`, `enable`, `pause`, `resume` and `inbox`, exiting 2 on an unknown option. Phase 5 adds `answer` (`.skilled/bin/bots.cjs`). Verify: `node .skilled/bin/bots.cjs run --bogus` exits 2 and prints usage. Evidence: `node .skilled/bin/bots.cjs run --bogus` printed usage and exited 2.
- [x] T007 Create the switch writer and reader under the state root (`H/runtime/lib/switches.ts`). Verify: `bots disable <id>` creates the disable file under `SR` and `git status --porcelain` shows no new path in the checkout. Evidence: `.skilled/skills/system-skilled-bots/runtime/tests/switches.vitest.ts:15` passes; switch files sit under the state root.
- [x] T008 Create the posture matrix for the nine executor kinds and the refusal of `isolation: worktree` (`H/runtime/lib/posture.ts`). Verify: the posture unit test exits 0 with one row per kind. Evidence: `.skilled/skills/system-skilled-bots/runtime/tests/posture.vitest.ts:37` passes with one row per kind.
- [x] T009 Create the environment allowlist builder and the three secret refusals, exporting the body-secret predicate (`H/runtime/lib/dispatch.ts`). Verify: the dispatch unit test shows a planted non-allowlisted key absent from the child environment and a body with a secret literal refused, and `rg -n '^export' H/runtime/lib/dispatch.ts` lists the predicate. Evidence: `.skilled/skills/system-skilled-bots/runtime/tests/dispatch.vitest.ts:24` and `.skilled/skills/system-skilled-bots/runtime/tests/runner.vitest.ts:138` pass; `findSecretLiteral` and `collectKnownSecrets` are exported.
- [x] T010 Create headless dispatch with `AI_SESSION_CHILD=1`, the exemption and bound spec folder in the prompt, `timeoutSeconds` and budget classing (`H/runtime/lib/dispatch.ts`). Verify: the dispatch unit test reads the exemption line and the spec folder in the built prompt. Evidence: `.skilled/skills/system-skilled-bots/runtime/tests/dispatch.vitest.ts:58` passes.
- [x] T011 Create the runner in the §8 order with the lease on `loop-lock` keyed by workflow, repository and spec target, released in a `finally` path (`H/runtime/lib/runner.ts`). Verify: the runner unit test asserts the call order and that the lease key holds no worktree path. Evidence: `.skilled/skills/system-skilled-bots/runtime/tests/runner.vitest.ts:513` passes; the key holds no checkout path. The lease is released in a `finally` block.
- [x] T012 Write the terminal record to `SR/<identity key>/records/<run id>.json` with the request join, honored posture, failure class beside the raw reason, `null` cost when unknown, delivery `not-attempted` and the five evidence pointers, each resolving inside the run folder `RF/<run id>/` except the receipt pointer, which resolves to `SR/<identity key>/receipts/<run id>/` (operator decision D14, ADR-006) (`H/runtime/lib/runner.ts`). Verify: the record test validates a happy-path record under `SR` against the phase 1 schema, its pointers resolve under `RF/<run id>/`, and a pointer to a deleted run folder is reported as missing without a throw. Evidence: `.skilled/skills/system-skilled-bots/runtime/tests/runner.vitest.ts:64` passes; the run-record tests cover a missing run folder.
- [x] T013 Parse the `[NEEDS-DECISION]` marker and route it to exit `awaiting-decision`, stop reason `blockedStop` and class `operator`, per ADR-001 (`H/runtime/lib/dispatch.ts`, `H/runtime/lib/runner.ts`). The first marker wins. An empty question is a run failure classed `author`. A timeout or budget stop keeps its class. Verify: the parser unit test covers one marker, two markers, an empty question, a marker on exit 0 and a marker after a timeout, and a fixture child that prints the marker and exits 0 ends with `awaiting-decision` and the distinct CLI exit code. Evidence: `.skilled/skills/system-skilled-bots/runtime/tests/dispatch.vitest.ts:82`, `.skilled/skills/system-skilled-bots/runtime/tests/runner.vitest.ts:279`, `:413` and `:420` pass. Review fix: the marker is read from the final answer per output format, so a Claude Code stream-json run parks too (`.skilled/skills/system-skilled-bots/runtime/tests/runner.vitest.ts:308`); that test failed first against the old parser (`scratch/negative-control-stream-json.txt`).
- [x] T014 Wire retry to ledger replay through the append gateway only (`H/runtime/lib/runner.ts`, `H/runtime/lib/result-ledger.ts`). Verify: re-sending the same result event leaves one stored event and one dispatch receipt pair. Unblocked by operator decision D15 ("Build it now", ADR-007, which supersedes ADR-004): a bots-owned registration (event registry, allow policy, authority root, binding) plus one caller-mode admission list in deep-loop. Evidence: `.skilled/skills/system-skilled-bots/runtime/tests/runner.vitest.ts:96` passes: the re-sent event is an idempotent replay, the ledger holds one event, the receipt folder holds one pair and the stub ran once. `.skilled/skills/system-skilled-bots/runtime/tests/result-ledger.vitest.ts:47` passes: a failed write is re-sent as the same event object.
- [x] T024 Return a refusal outcome apart from a run failure, by CLI exit code and by the runner function, for disabled, paused, failing precheck, `[SILENT]` precheck, malformed definition, refused posture and held lease (`H/runtime/lib/runner.ts`). Verify: the outcome test shows a refusal exit code different from the run-failure exit code and a paused run with stop reason `userPaused`. Evidence: `.skilled/skills/system-skilled-bots/runtime/tests/runner.vitest.ts:191` and `:241` pass: refusal exit 4, run failure exit 1, paused records `userPaused`.
- [x] T025 Set `SKILLED_BOT_RUN_ID` on the child and add it to `EXECUTOR_COMMON_ENV_ALLOWLIST` per ADR-005, which the operator accepted (`H/runtime/lib/dispatch.ts`, `DL/deep-loop/executor-audit.ts`). Owner `system-deep-loop`. Callers `dispatch-iteration.cjs`, `fanout-run.cjs`, `deep-review.yaml` and `deep-research.yaml` stay unchanged. Verify: before the entry, a fixture child's `env` lacks the key, which is the observed failure. After it, the child prints the run id, and a non-bot dispatch shows no key. Evidence: `scratch/allowlist-before.txt` shows the key dropped before the entry, `scratch/allowlist-after.txt` shows it passed after. `.skilled/skills/system-skilled-bots/runtime/tests/runner.vitest.ts:138` passes and fails with the entry removed.
- [x] T026 Write the generation stamp under `<state root>/<repository identity>/` by temp file and rename after each terminal record and each needs-you item, and export the writer for phase 5's `bots answer` (`H/runtime/lib/runner.ts`, `H/runtime/lib/needs-you.ts`). Verify: after two fixture runs and one item write, the stamp value has changed three times and no temp file remains. Evidence: `.skilled/skills/system-skilled-bots/runtime/tests/runner.vitest.ts:500` passes; no temp file remains.
- [x] T027 Write one needs-you item per parked run under `NY` by temp file and rename, with run id, bot id, question, options, `created_at`, the dispatched prompt and the evidence pointers, then release the lease (`H/runtime/lib/needs-you.ts`, `H/runtime/lib/runner.ts`). Verify: after the marker fixture, `NY` holds one item file and the lease file for the bot is gone. Evidence: `.skilled/skills/system-skilled-bots/runtime/tests/runner.vitest.ts:279` passes; one item, no lease file.
- [x] T028 Add `bots inbox`, listing open and expired items. An item's `expiresAt` comes from `needsYou.expiryDays`, default 7 (operator decision D10), and the state is derived, never written (`.skilled/bin/bots.cjs`, `H/runtime/lib/needs-you.ts`). Verify: with a fixture item whose `created_at` is 8 days old and the default expiry, `bots inbox` prints it as `expired`, and its file is unchanged and holds no answer. Evidence: `.skilled/skills/system-skilled-bots/runtime/tests/runner.vitest.ts:428` passes; the file is byte-identical after `bots inbox`.
- [x] T029 Build the resumed prompt when the runner gets a `resume` request: the item's prompt, the question and the answer, bound to the same spec folder (`H/runtime/lib/needs-you.ts`, `H/runtime/lib/runner.ts`). The body-secret predicate runs over the question and the answer before dispatch. Verify: a direct runner call with a `resume` request for a fixture answered item starts a new run id joined to the item. The built prompt holds the question, the answer and the original spec folder. A planted secret in the fixture answer is refused naming the key. Evidence: `.skilled/skills/system-skilled-bots/runtime/tests/runner.vitest.ts:460` and `:476` pass.
- [x] T034 Add the hold check before dispatch: while the bot has an open needs-you item, refuse the run with the cause `awaiting-decision-hold`, naming the item id and pointing at `bots inbox`, and take no lease. A hand-typed `bots run <id>` is held too (D13). A `resume` request for an answered item passes (`H/runtime/lib/runner.ts`, `H/runtime/lib/needs-you.ts`). Verify: with one open fixture item, `bots run <id>` exits with the refusal code, the record names `awaiting-decision-hold` and the item id, and no dispatch receipt exists. With the item answered, and again with its `expiresAt` passed, the same run dispatches. Evidence: `.skilled/skills/system-skilled-bots/runtime/tests/runner.vitest.ts:440` passes.
- [x] T035 Read the decision marker from each kind's final answer, not its raw output: a Claude Code stream-json run carries the marker inside the final `result` event, and a DeepSeek Harness `--json` run inside its `final` event's `text`. Reuse deep-loop's `readClaudeStreamFinalText`, and refuse a kind whose output format the runner cannot read as `decision-marker-unreadable` (`H/runtime/lib/dispatch.ts`, `H/runtime/lib/posture.ts`, `H/runtime/lib/runner.ts`). Verify: a stub `claude` printing stream-json with the marker in its `result` event fails against the old parser, then parks. Evidence: `scratch/negative-control-stream-json.txt` shows the failure (`expected 'completed' to be 'awaiting-decision'`, exit 1); `.skilled/skills/system-skilled-bots/runtime/tests/runner.vitest.ts:308` and `.skilled/skills/system-skilled-bots/runtime/tests/dispatch.vitest.ts:109` pass. The DSH shape comes from the observed capture `specs/cli-external-orchestration/runtime-lifecycle/002-cli-deepseek-harness-creation/013-dsh-live-contract-pin/evidence/route-llmgateway.stdout.jsonl`, so DSH stays admitted.
- [x] T036 Harden three failure paths (`H/runtime/lib/runner.ts`, `H/runtime/lib/needs-you.ts`): a refused item write ends the run as a failure classed `hub` naming the refusal; an item file that does not read holds the bot (`needs-you-unreadable`) unless it still names another bot, since an item's file name never names its bot; a throw inside the run writes one failure record classed `hub` or `environment` and returns a failure. Verify: each path has a test with exactly one record. Evidence: `.skilled/skills/system-skilled-bots/runtime/tests/runner-hardening.vitest.ts:101`, `:113`, `:126` and `:139` (an unrecordable result event), and `.skilled/skills/system-skilled-bots/runtime/tests/needs-you.vitest.ts:104` pass.
- [x] T037 Move dispatch receipts out of the run folder to `SR/<identity key>/receipts/<run id>/` per operator decision D14 (ADR-006), with the path helper `receiptFolder` in `H/runtime/lib/state-root.ts` (`H/runtime/lib/state-root.ts`, `H/runtime/lib/runner.ts`). Verify: an argv-kind run leaves no prompt or command line anywhere in its run folder. Evidence: `.skilled/skills/system-skilled-bots/runtime/tests/runner.vitest.ts:116` and `.skilled/skills/system-skilled-bots/runtime/tests/state-root.vitest.ts:70` pass; with the pointer moved back the argv test fails (`scratch/receipts-mutation-control.txt`).
- [x] T039 Before any shared edit for read-only OpenCode and Mistral Vibe (operator decision 2026-11-22, "Support read-only now", ADR-008): name every caller of both builders and of the read-only refusal, confirm each CLI's tool names from the CLI itself, and take a clean deep-loop baseline (`decision-record.md`, `scratch/`). Verify: ADR-008 lists the callers and the pinning tests, and the baseline's deep-loop diff hash is the same at its start and end. Evidence: ADR-008 context names them. `scratch/opencode-permission-probe.txt` (`opencode debug agents --standalone`, OpenCode 2.3.2) and `scratch/vibe-tool-names.txt` (`vibe --help`, `vibe config schema`, Vibe 3.1.2), no model call. `scratch/deep-loop-baseline-readonly.txt`: 222 files, 4039 passed, 11 skipped, exit 0, diff hash `485bdf92ac3e` at start and end.
- [x] T040 Give a read-only OpenCode lineage a tool-narrowing profile (the deny list below was replaced by T046's allowlist in the third review): the refusal removed, `OPENCODE_CONFIG_CONTENT` denying edit, write, bash and task after any inherited permission keys, recorded as `compensating`; its surface becomes `permission-config` (`.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs`, `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts`). Verify: the tests that pinned the refusal assert the profile, and workspace-write still builds the one external_directory deny. Evidence: `.skilled/skills/system-deep-loop/runtime/tests/unit/fanout-run.vitest.ts:3912`, `.skilled/skills/system-deep-loop/runtime/tests/unit/dispatch-iteration.vitest.ts:704` (and `:716`, which keeps the not-usage-exit refusal for an unmergeable inherited config), `.skilled/skills/system-deep-loop/runtime/tests/unit/combo-matrix.vitest.ts:189` and `.skilled/skills/system-deep-loop/runtime/tests/unit/executor-adapter-capabilities.vitest.ts:329` pass; `.skilled/skills/system-deep-loop/runtime/tests/unit/dispatch-iteration.vitest.ts:685` keeps workspace-write unchanged.
- [x] T041 Give a read-only Mistral Vibe lineage `--enabled-tools read_file --enabled-tools grep`, and `SPECKIT_DIST_AUTO_REBUILD=0`, recorded as `compensating`; other values build as before and record `null`. Vibe accepts `sandboxMode` with `read-only` as its only value, and its surface becomes `tool-allowlist`; `VIBE_HOME` and `SPECKIT_DIST_AUTO_REBUILD` join Vibe's `DISPATCH_ENV_KEYS` (`.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs`, `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts`, `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts`). Verify: a builder test and a config test. Evidence: `.skilled/skills/system-deep-loop/runtime/tests/unit/fanout-run.vitest.ts:2243` and `.skilled/skills/system-deep-loop/runtime/tests/unit/executor-config.vitest.ts:110` pass.
- [x] T042 Admit `cli-opencode` and `cli-mistral-vibe` for read-only only, and make the decision marker readable for both: forward the builder's environment and working folder to the audited runner, give a Vibe run a private temp lineage folder that keeps only `vibe-export.json` beside the receipts, and read OpenCode's `opencode-json` final answer (`.skilled/skills/system-skilled-bots/runtime/lib/posture.ts`, `.skilled/skills/system-skilled-bots/runtime/lib/dispatch.ts`, stub `opencode` and `vibe` executors). Verify: a read-only bot on each kind that prints the marker parks, and a write-capable posture on each is refused before dispatch. Evidence: `.skilled/skills/system-skilled-bots/runtime/tests/runner.vitest.ts:320`, `.skilled/skills/system-skilled-bots/runtime/tests/runner.vitest.ts:358`, `.skilled/skills/system-skilled-bots/runtime/tests/runner.vitest.ts:401`, `.skilled/skills/system-skilled-bots/runtime/tests/posture.vitest.ts:48` and `.skilled/skills/system-skilled-bots/runtime/tests/dispatch.vitest.ts:133` pass. Negative control: with OpenCode's answer read raw, the OpenCode park test fails `expected 'completed' to be 'awaiting-decision'` (`scratch/negative-control-opencode-json.txt`).
- [x] T045 Reproduce each second-review finding before its fix (operator answer "Fix all, third review", ADR-008 third review): resolve the old OpenCode profile with `opencode debug agents --standalone` in scratch repositories, and run every new bots test against the unfixed code (`scratch/`). Verify: the old profile leaves unlisted tools on allow and a project agent block reopens edit and shell, and each new test fails first. Evidence: `scratch/opencode-agent-probe-before.txt` (OpenCode 2.3.2, no model call: `webfetch`, `question` and an MCP-style name end on `*:*=allow`; `shell:*=allow` and `edit:*=allow` end the `build` rules for the agent-block and markdown-agent repositories) and `scratch/negative-controls-third-review.txt` (seven new tests fail, then the lease-throw control fails with `EISDIR` escaping the runner).
- [x] T046 Make OpenCode read-only an allowlist at the source: `"*": "deny"`, then `read`, `grep`, `glob`, `list`, then the `external_directory` deny, written after any inherited keys, at the top level and under `agent.build.permission`, with `--agent build` on the command line; workspace-write and danger-full-access unchanged (`.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs`). Verify: the resolved `build` agent ends every non-read action on a deny in all four probe repositories, and the builder tests assert the order. Evidence: `scratch/opencode-agent-probe-after.txt` (edit, shell, subagent, webfetch, question and the MCP-style name end on `*:*=deny`, the probe changed no repository file); `.skilled/skills/system-deep-loop/runtime/tests/unit/fanout-run.vitest.ts:3969`, `.skilled/skills/system-deep-loop/runtime/tests/unit/dispatch-iteration.vitest.ts:704`, `.skilled/skills/system-deep-loop/runtime/tests/unit/executor-adapter-capabilities.vitest.ts:329` and `.skilled/skills/system-deep-loop/runtime/tests/unit/combo-matrix.vitest.ts:152` pass.
- [x] T047 Refuse a read-only OpenCode lineage unless the agent it will run denies every non-read action: the builder resolves it with `opencode debug agents --standalone` in the child's folder and environment, before returning the command, so the bots runner, the fan-out and `dispatch-iteration` all get the check; the bots runner records it as the refusal `read-only-unconfined` (`.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs`, `H/runtime/lib/dispatch.ts`, `H/runtime/lib/runner.ts`, the stub `opencode`). Verify: stubbed resolver output refuses and admits as expected, the real resolver admits the four scratch repositories, and with the check switched off the refusal test fails. Evidence: `.skilled/skills/system-deep-loop/runtime/tests/unit/fanout-run.vitest.ts:3995` and `.skilled/skills/system-skilled-bots/runtime/tests/runner.vitest.ts:343` pass; `scratch/opencode-builder-probe-after.txt` and `scratch/oc-gate-e2e.txt` (real resolver, a shim that stops at `run`, no model call); the mutation control in `scratch/negative-controls-third-review.txt` fails `expected { kind: 'completed' } to match object { kind: 'refused' }`. The agent-override fixture is admitted, not refused, because the agent-level rules win (ADR-008 third review, deviation).
- [x] T048 Judge a clean Vibe exit by deep-loop's `validateVibeCompletion` before the lineage folder is removed, failing it as `vibe-run-unfinished` (`H/runtime/lib/dispatch.ts`, `H/runtime/lib/runner.ts`, the stub `vibe`). Verify: a stub export with `exit_code: 1` and a 0 exit fails the run. Evidence: `.skilled/skills/system-skilled-bots/runtime/tests/runner.vitest.ts:388` passes; before the fix it recorded `completed` (`scratch/negative-controls-third-review.txt`).
- [x] T049 Name the checkout's absolute path in the prompt of a kind that starts in a lineage folder, and move the live probe to relative paths with an MCP fixture and an agent-override fixture (`H/runtime/lib/dispatch.ts`, `H/runtime/lib/runner.ts`, `scratch/live-probe-readonly.sh`). Verify: the line appears once for such a kind and never for another, and the probe's plumbing runs against stubs. Evidence: `.skilled/skills/system-skilled-bots/runtime/tests/dispatch.vitest.ts:68` and `.skilled/skills/system-skilled-bots/runtime/tests/runner.vitest.ts:358` pass; `scratch/live-probe-stub-smoke.txt` (stubs only; the read-token check fails there by design).
- [x] T050 Fix the three minor findings (`H/runtime/lib/runner.ts`, `H/runtime/lib/run-record.ts`, `H/runtime/lib/needs-you.ts`, `.skilled/bin/bots.cjs`): a throw once a seed exists, or once the lease is taken, ends in one record and releases the lease; a parked run whose result event cannot be recorded keeps `needsYouItemId` on its failed exit, a contract change in `run-record.ts`; a needs-you folder that cannot be listed holds the bot as `needs-you-unlistable`, and only `ENOENT` reads as empty. Verify: one test each, failing first. Evidence: `.skilled/skills/system-skilled-bots/runtime/tests/runner-hardening.vitest.ts:58`, `:74` and `:86`, `.skilled/skills/system-skilled-bots/runtime/tests/needs-you.vitest.ts:117` and `.skilled/skills/system-skilled-bots/runtime/tests/run-record.vitest.ts:155` pass; each failed against the unfixed code (`scratch/negative-controls-third-review.txt`).
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T015 Run the manual fixture bot end to end (`H/runtime/tests/`). Every fixture `BOT.md` declares `isolation: shared` explicitly, except a fixture that tests the worktree refusal, and the fixture `bots/config.json` sets no `defaultIsolation`, because phase 1 ADR-007 refuses an undeclared isolation. Verify: `rg -L --glob 'BOT.md' '^isolation: ' H/runtime/tests` prints no file, and `bots run <fixture-id>` exits 0 and `SR` holds one new terminal record with the request join, posture and evidence locations filled. Evidence: `rg --files-without-match --glob 'BOT.md' '^isolation: '` over the tests printed nothing (exit 1); the task's `rg -L` is `--follow` in ripgrep, not files-without-match. `.skilled/skills/system-skilled-bots/runtime/tests/runner.vitest.ts:181` passes.
- [x] T016 Run the disabled, paused, failing-precheck and `[SILENT]` fixtures (`H/runtime/tests/`). Verify: each ends with no dispatch receipt and one record naming its reason. Evidence: `.skilled/skills/system-skilled-bots/runtime/tests/runner.vitest.ts:191` passes; the stub ran zero times.
- [x] T017 Run the unhonorable-posture and concurrent-run fixtures (`H/runtime/tests/`). Verify: both are refused before dispatch, and the second concurrent run's record names the held lease. Evidence: `.skilled/skills/system-skilled-bots/runtime/tests/runner.vitest.ts:211` and `.skilled/skills/system-skilled-bots/runtime/tests/runner-kill.vitest.ts:26` pass.
- [x] T018 Kill a running fixture with SIGKILL and rerun (`H/runtime/tests/`). Verify: the lease is reclaimed by the pid, nonce and heartbeat rule, and the first record reads `unknown` only after the owner pid is gone. Evidence: `.skilled/skills/system-skilled-bots/runtime/tests/runner-kill.vitest.ts:26` passes.
- [x] T019 Run the stuck-invocation and budget fixtures (`H/runtime/tests/`). Verify: the timeout record and the budget record carry two different classes. Evidence: `.skilled/skills/system-skilled-bots/runtime/tests/runner.vitest.ts:261` passes: `timeout`/`environment` and `maxDurationReached`/`budget`.
- [x] T020 Prove the switches and the needs-you items are out of the checkout's reach (`H/runtime/tests/`). Verify: a child with checkout write access fails to change the disable file or create an item under `NY`, and the test exits 0. Evidence: `.skilled/skills/system-skilled-bots/runtime/tests/runner.vitest.ts:488` passes.
- [x] T021 Search every runner log for the fixture prompt and a planted environment value (`H/runtime/tests/`). Verify: `rg -F '<planted value>' <runner log dir>` prints nothing. Evidence: `.skilled/skills/system-skilled-bots/runtime/tests/runner.vitest.ts:155` passes over the run folder and the records.
- [x] T022 Check that no scheduler call exists (`H/`). Verify: `rg -n 'launchctl|\.plist' .skilled/skills/system-skilled-bots/ .skilled/bin/bots.cjs` prints nothing. Evidence: `rg -n 'launchctl|\.plist' .skilled/skills/system-skilled-bots/ .skilled/bin/bots.cjs` printed nothing, exit 1.
- [x] T023 Run the deep-loop suite to show the imports and the one allowlist entry changed nothing else (`.skilled/skills/system-deep-loop/runtime/`). Verify: `npx vitest run` in that folder reports the same pass count as the T033 baseline. Evidence: `scratch/deep-loop-after.txt`: 222 files, 4039 passed, 11 skipped, exit 0, the same as the baseline.
- [x] T031 Run the decision fixture end to end (`H/runtime/tests/`). Verify: `bots run <marker-fixture>` exits with the `awaiting-decision` code, `bots inbox` lists one open item, and the record reads stop reason `blockedStop`, class `operator`. Evidence: `.skilled/skills/system-skilled-bots/runtime/tests/runner.vitest.ts:279` passes: exit 5, one open item in `bots inbox`, record `awaiting-decision` class `operator`.
- [x] T032 Prove run folders are gitignored in the real tree (repository root). Verify: `git check-ignore -v .skilled/skills/.state/system-skilled-bots/x/runs/y/ledger.jsonl` prints the `.skilled/skills/.state/*/*` rule. Evidence: `git check-ignore -v` printed `.gitignore:135:.skilled/skills/.state/*/*`.
- [x] T038 Rerun the deep-loop suite around the caller-mode edit (`.skilled/skills/system-deep-loop/runtime/`). Verify: a clean baseline before the edit and the same count after. Evidence: `scratch/deep-loop-baseline-rework.txt` (taken before any deep-loop edit, deep-loop diff hash `54ab3a689389` the same at start and end of the run, so no edit overlapped it, unlike the contaminated first baseline) and `scratch/deep-loop-after-rework.txt` (diff hash `485bdf92ac3e` the same at start and end): 222 files, 4039 passed, 11 skipped, exit 0 both times.
- [x] T043 Rerun the deep-loop suite after the read-only edits (`.skilled/skills/system-deep-loop/runtime/`). Verify: the T039 baseline count plus only the tests this change adds. Evidence: `scratch/deep-loop-after-readonly.txt`: 222 files, 4041 passed, 11 skipped, exit 0, diff hash `ba6a4a573214` at start and end. Delta +2: the new Vibe read-only builder test and the restored not-usage-exit refusal test for an unmergeable inherited OpenCode config; the OpenCode refusal tests were rewritten in place.
- [x] T051 Rerun the whole bots suite and the whole deep-loop suite after the third-review edits, against baselines taken the same way before any edit (`.skilled/skills/system-skilled-bots/runtime/`, `.skilled/skills/system-deep-loop/runtime/`). Verify: the baselines plus only the tests this change adds, and both typechecks exit 0. Evidence: bots before 17 files, 184 passed, exit 0 (`scratch/bots-suite-baseline-third-review.txt`); after 17 files, 191 passed, exit 0, typecheck exit 0 (`scratch/bots-suite-third-review.txt`), delta +7, the seven new tests. Deep-loop before 222 files, 4041 passed, 11 skipped, exit 0, diff hash `ba6a4a573214` at start and end (`scratch/deep-loop-baseline-third-review.txt`, taken before any deep-loop edit); after 222 files, 4041 passed, 11 skipped, exit 0, diff hash `15dd889cfe7b` at start and end (`scratch/deep-loop-after-third-review.txt`), delta 0, since the new deep-loop assertions sit inside existing tests. Deep-loop typecheck exit 0.
- [x] T052 Remove a Vibe lineage folder that holds read-only folders, found by the first live Vibe probe: the child finished cleanly but the bots run ended `runner-error` because real Vibe leaves plugin package folders under its home with the write bit off and the recursive remove threw `ENOTEMPTY`. The removal makes every folder under the lineage folder owner-writable through `node:fs`, then removes it, and a failure only warns on stderr; the probe script now fails a fixture unless bots exits 0 (exit 4 is still accepted for the agent-override fixture) (`H/runtime/lib/dispatch.ts`, the stub `vibe` with `STUB:readonly-tree`, `scratch/live-probe-readonly.sh`). Verify: a read-only Vibe bot whose stub leaves such a tree completes with its lineage folder gone, failing first. Evidence: `.skilled/skills/system-skilled-bots/runtime/tests/runner.vitest.ts:530` and `.skilled/skills/system-skilled-bots/runtime/tests/dispatch.vitest.ts:161` pass; before the fix the run test failed `expected 'failed' to be 'completed'` (`scratch/negative-control-vibe-cleanup.txt`); bots suite 17 files, 194 passed, exit 0, typecheck exit 0 (`scratch/bots-suite-cleanup-fix.txt`), delta +3 over the third review's 191.
- [x] T044 Run the live probes through the bots runner on throwaway read-only bots that are asked to read a committed token and to write, by relative path: OpenCode in a plain repository, one whose `opencode.json` registers an MCP server with a writing tool, and one whose `agent.build.permission` allows bash and edit; Vibe in a plain repository (`scratch/live-probe-readonly.sh oc`, then `mv`, from a shell whose ancestry names neither CLI, or the recursion guard refuses). Verify: the token is in `stdout.log`, no file is created, the record states the read-only posture, and the CLI's own evidence shows the narrowing (OpenCode tool_use states, Vibe `config.enabled_tools`). Evidence: OpenCode, operator-approved 2026-11-22: all three fixtures PASS with bots exit 0, no probe file, the read-only record and the token read by relative path; the agent-override fixture was admitted (`specs/system-skilled-bots/001-headless-bots-first-build/003-manual-runner/scratch/live-probe-oc-result.txt:14`, `specs/system-skilled-bots/001-headless-bots-first-build/003-manual-runner/scratch/live-probe-oc-result.txt:28`, `specs/system-skilled-bots/001-headless-bots-first-build/003-manual-runner/scratch/live-probe-oc-result.txt:40`, `specs/system-skilled-bots/001-headless-bots-first-build/003-manual-runner/scratch/live-probe-oc-result.txt:43`). No write or MCP tool_use event was logged, so the model may never have tried; the deny is proven by the resolver output (`specs/system-skilled-bots/001-headless-bots-first-build/003-manual-runner/scratch/opencode-agent-probe-after.txt:37`). Vibe, operator-approved rerun 2026-11-23 after T052: bots exit 0, `converged`, both writes denied, token read, `enabled_tools` exactly `read_file` and `grep` (`specs/system-skilled-bots/001-headless-bots-first-build/003-manual-runner/scratch/live-probe-mv-rerun-result.txt:3`, `specs/system-skilled-bots/001-headless-bots-first-build/003-manual-runner/scratch/live-probe-mv-rerun-result.txt:12`, `specs/system-skilled-bots/001-headless-bots-first-build/003-manual-runner/scratch/live-probe-mv-rerun-result.txt:15`, `specs/system-skilled-bots/001-headless-bots-first-build/003-manual-runner/scratch/live-probe-mv-rerun-result.txt:17`). The script first ran against the stubs only, to prove its plumbing (`scratch/live-probe-stub-smoke.txt`).
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
- [x] Every row in `acceptance-criteria.md` is `Met`
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

- [x] CHK-001 [P0] Requirements documented in spec.md
- [x] CHK-002 [P0] Technical approach defined in plan.md
- [x] CHK-003 [P1] Dependencies identified and available: phase 1 validates with `RESULT: PASSED` Evidence: phase 1 validates with `RESULT: PASSED`.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks: `npx tsc --noEmit` in the skill runtime exits 0 Evidence: `npm run typecheck` exit 0.
- [x] CHK-011 [P0] No console errors or warnings in a fixture run Evidence: fixture runs print only the audited runner's byte-count line on stderr, no error or warning.
- [x] CHK-012 [P1] Error handling implemented: every exit path releases the lease Evidence: the lease is released in a `finally` block; `leases/` is empty after every fixture in `.skilled/skills/system-skilled-bots/runtime/tests/runner.vitest.ts`.
- [x] CHK-013 [P1] Code follows project patterns: every deep-loop path in `git diff --name-only` is one an operator decision named Evidence: the first build changed only `executor-audit.ts` (the one allowlist entry, D7); the rework added the caller-mode files (D15, ADR-007); the read-only change and the third review added `fanout-run.cjs`, `executor-config.ts`, `executor-audit.ts` and the test files named in ADR-008. Each is listed in implementation-summary.md's Files Changed table.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met Evidence: every row in `acceptance-criteria.md` reads Met or Superseded (AC-015 and AC-016 Superseded by ADR-001); AC-024 and AC-025 turned Met from the live probes (`specs/system-skilled-bots/001-headless-bots-first-build/003-manual-runner/scratch/live-probe-oc-result.txt:43`, `specs/system-skilled-bots/001-headless-bots-first-build/003-manual-runner/scratch/live-probe-mv-rerun-result.txt:17`).
- [x] CHK-021 [P0] Manual testing complete: one real manual bot ran on one admitted kind Evidence: operator-approved live run on `cli-codex`, 2026-11-22, read-only bot `hello` in a scratch consumer: exit 0 with `--skilled-tree` naming the primary checkout (`specs/system-skilled-bots/001-headless-bots-first-build/003-manual-runner/scratch/live-run-codex-result.txt:3`), records 0 to 1 (`specs/system-skilled-bots/001-headless-bots-first-build/003-manual-runner/scratch/live-run-codex-result.txt:4`), consumer `git status --short` empty before and after (`specs/system-skilled-bots/001-headless-bots-first-build/003-manual-runner/scratch/live-run-codex-result.txt:5`), no receipt and no prompt text in the run folder (`specs/system-skilled-bots/001-headless-bots-first-build/003-manual-runner/scratch/live-run-codex-result.txt:6`), exit `converged` (`specs/system-skilled-bots/001-headless-bots-first-build/003-manual-runner/scratch/live-run-codex-result.txt:53`). The first attempt was refused before dispatch as `skilled-tree-is-worktree`, with no dispatch and no record (`specs/system-skilled-bots/001-headless-bots-first-build/003-manual-runner/scratch/live-run-codex-result.txt:2`).
- [x] CHK-022 [P1] Edge cases tested: no id, unknown id, timeout, recursion refusal Evidence: no id exits 2, unknown id refuses with no record, timeout and recursion refusal each have a test.
- [x] CHK-023 [P1] Error scenarios validated: killed run, held lease, refused posture Evidence: `.skilled/skills/system-skilled-bots/runtime/tests/runner-kill.vitest.ts:26` and `.skilled/skills/system-skilled-bots/runtime/tests/runner.vitest.ts:211`.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets, and the body-secret refusal fixture is refused Evidence: `.skilled/skills/system-skilled-bots/runtime/tests/runner.vitest.ts:221`. Token-shaped test values are built at run time.
- [x] CHK-031 [P0] Input validation implemented: unknown options and unhonorable postures are refused Evidence: unknown options exit 2; unhonorable postures are refused.
- [x] CHK-032 [P1] Child environment holds only allowlisted keys, and no log holds a command line or value Evidence: receipts moved under the user-level state root (D14, ADR-006); an argv-kind run leaves no prompt, command line or planted value in its run folder (`.skilled/skills/system-skilled-bots/runtime/tests/runner.vitest.ts:116`).
- [x] CHK-033 [P1] Needs-you items are owner-only and unreachable from the checkout, and question and answer pass the body-secret predicate Evidence: items live under the `0700` state root; `.skilled/skills/system-skilled-bots/runtime/tests/runner.vitest.ts:476`.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized
- [x] CHK-041 [P1] Code comments carry the durable why and no packet or requirement id Evidence: `rg -n "REQ-|ADR-|T0[0-9]|CHK-|specs/" lib/ ../../../bin/bots.cjs` over the new files printed nothing.
- [x] CHK-042 [P2] README updated (if applicable) Evidence: phase 008 wrote the skill README (`.skilled/skills/system-skilled-bots/README.md`) and the run mode README (`.skilled/skills/system-skilled-bots/bots-run/README.md`), which describe the manual runner.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only Evidence: scratch holds only the evidence files named in the tasks and the unrun live-run script.
- [x] CHK-051 [P1] scratch/ cleaned before completion Evidence: no temp file left in scratch; the remaining files are evidence.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 10 | 9/10 |
| P1 Items | 21 | 20/21 |
| P2 Items | 9 | 7/9 |

**Verification Date**: 2026-11-23, after the live run, the live probes and the third review's approval. Open P0: CHK-120 (rollback not run in a copy). Open P1: CHK-123 (docs wait on the hub wiring phase). Open P2: CHK-042 and CHK-124 (same reason).
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: Architecture Verification

- [x] CHK-100 [P0] ADR-001 and ADR-005 are followed: T013, T027 to T029 and T034 for the queue and the hold, T025 for the allowlist entry Evidence: T013, T027 to T029, T034 and T025 are done.
- [x] CHK-101 [P1] All ADRs in `decision-record.md` carry a status
- [x] CHK-102 [P1] Each ADR lists its alternatives with a rejection reason
- [x] CHK-103 [P2] N/A: no migration, every path is new except one allowlist entry
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: Performance Verification

- [x] CHK-110 [P1] NFR-P01: the runner's work before dispatch takes under 2 seconds in a timed fixture run, excluding the precheck Evidence: three timed runs spent 21, 19 and 18 ms before dispatch; `.skilled/skills/system-skilled-bots/runtime/tests/runner.vitest.ts:168` asserts under 2000.
- [x] CHK-111 [P1] NFR-P02: N/A for throughput, a second run is refused at the lease (T017)
- [x] CHK-112 [P2] N/A: no load test, one run handles one bot
- [x] CHK-113 [P2] The timed fixture run's numbers are written in `implementation-summary.md` Evidence: the numbers are in `implementation-summary.md`.
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: Deployment Readiness

- [x] CHK-120 [P0] Rollback tested in a copy: removing the phase's paths and the allowlist entry leaves the deep-loop suite at the T033 count Evidence: run on 2026-11-24 in a copy of HEAD `94afff4244d` with its own throwaway repository (`scratch/rollback-in-copy.sh`): the deep-loop suite passed 222 files, 4041 tests, exit 0, before and after removing the whole bots skill, `.skilled/bin/bots.cjs` and the `SKILLED_BOT_RUN_ID` allowlist entry (`scratch/rollback-in-copy-result.txt:5` to `:7`, `:13` to `:15`). Deviation: the count is 4041, not the T033 4039, because later deep-loop changes added 2 tests; the worktree itself also passes 4041. The removal covers every later phase's bots paths too, so it is wider than this phase alone.
- [x] CHK-121 [P1] No scheduler is installed by this phase (T022) Evidence: T022.
- [x] CHK-123 [P1] The skill's docs say how to disable, pause, list and answer a bot Evidence: `.skilled/skills/system-skilled-bots/bots-schedule/README.md:35` (`bots disable`) and `:36` (`bots pause`), `.skilled/skills/system-skilled-bots/bots-status/README.md:9` (`bots status`, `bots inbox`), `.skilled/skills/system-skilled-bots/bots-run/references/run-queue-and-answer.md:40` (`bots answer`).
- [ ] CHK-124 [P2] The operator has read those docs Open: the docs exist now (CHK-123); the read is the operator's and is not recorded.
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: Compliance Verification

- [x] CHK-130 [P1] Security review of the secret refusals, the allowlist entry and the item paths completed Evidence: third CODE-REVIEW gate, APPROVED, 2026-11-23, no P0 or P1 (orchestrator-observed; the review left no file to cite).
- [x] CHK-131 [P1] No new dependency is added, so no license changes Evidence: `package.json` dependencies unchanged.
- [x] CHK-132 [P2] N/A: no web surface for OWASP Top 10
- [x] CHK-133 [P2] Items and run folders hold no value of a non-allowlisted key Evidence: T021.
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: Documentation Verification

- [x] CHK-140 [P1] `spec.md`, `plan.md`, `tasks.md` and `decision-record.md` agree on the run-folder path, the item path and `SKILLED_BOT_RUN_ID`
- [x] CHK-141 [P1] The `bots` CLI usage text lists all six verbs this phase adds Evidence: the usage text lists run, disable, enable, pause, resume and inbox.
- [x] CHK-142 [P2] Phase 1's layout table names the needs-you folder and the run-folder root Evidence: the run-folder row (`specs/system-skilled-bots/001-headless-bots-first-build/001-contracts-and-state-root/spec.md:349`) and the needs-you row (`specs/system-skilled-bots/001-headless-bots-first-build/001-contracts-and-state-root/spec.md:355`).
- [x] CHK-143 [P2] Phase 5's spec names the `resume` request kind this runner accepts and owns `bots answer` Evidence: it owns `bots answer` (`specs/system-skilled-bots/001-headless-bots-first-build/005-request-pipeline/spec.md:47`) and adds kind `resume` (`specs/system-skilled-bots/001-headless-bots-first-build/005-request-pipeline/spec.md:97`).
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: Sign-Off

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Operator | Owner of the bots program, accepts the phase | [ ] Approved | |
<!-- /ANCHOR:sign-off -->

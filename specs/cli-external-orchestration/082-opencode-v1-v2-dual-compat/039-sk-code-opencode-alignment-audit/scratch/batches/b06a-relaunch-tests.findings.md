# Batch b06a-relaunch-tests findings

VERIFIER: no lines were emitted for these files; there is nothing to confirm or reject. The empty output is expected rather than a clean bill of health: `verify_alignment_drift.py` treats test-tree paths as exempt from the exact-header and section checks (`is_test_heavy_path`, lines 363-420). I checked the five `.cjs` files by hand and each carries the 67-character `MODULE:` divider followed by `'use strict'`; all fifteen JSON fixtures parse with `python3 -m json.tool` and carry no comments or trailing commas.

## .skilled/hooks/session-relaunch/tests/README.md
- language: md
- verdict: findings
| id | sev | line | rule (file § section) | finding | fix | behaviour-change |
|----|-----|------|-----------------------|---------|-----|------------------|
| b06a-relaunch-tests-001 | P2 | 34 | review-core.md § 6. BASELINE CHECK FAMILIES — "Correctness minimums: regression risk, contract safety, spec mismatch, destructive side effects, and boundary handling." | §2's directory tree is the folder inventory but lists eleven test files; `hop-history.test.cjs` exists in the folder and §3 line 53 gives its responsibility, so the tree is stale between `hermes-adapters.test.cjs` (line 33) and `killer.test.cjs` (line 34). | Insert a `hop-history.test.cjs` row between lines 33 and 34 using the one-line purpose already written in §3. | no |
| b06a-relaunch-tests-002 | P2 | 70 | review-core.md § 6. BASELINE CHECK FAMILIES — "Correctness minimums: regression risk, contract safety, spec mismatch, destructive side effects, and boundary handling." | The Codex hook payloads `Used by` cell names `codex-adapters.test.cjs` and `context-usage.test.cjs`, but `adapter-conformance.test.cjs:22` also requires `codex-rollout-token-count.json`; a fixture edit that follows this table would not rerun the conformance file. | Add `adapter-conformance.test.cjs` to the `Used by` cell. | no |

## .skilled/hooks/session-relaunch/tests/adapter-conformance.test.cjs
- language: cjs
- verdict: findings
| id | sev | line | rule (file § section) | finding | fix | behaviour-change |
|----|-----|------|-----------------------|---------|-----|------------------|
| b06a-relaunch-tests-003 | P2 | 285 | javascript/style-guide.md § 6. FORMATTING RULES — "Maximum: 100 characters" | The `info` object literal on this line is 113 characters; other over-limit object and call lines are at 72 (103), 99 (103), 228 (102), 275 (105), 298 (102), 423 (102) and 433 (107). Twelve lines in the file exceed the maximum in total; the rest are test names and string literals covered by the guide's long-string exception. | Break the cited object and call lines across multiple lines so each stays within 100 characters. | no |

## .skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs
- language: cjs
- verdict: findings
| id | sev | line | rule (file § section) | finding | fix | behaviour-change |
|----|-----|------|-----------------------|---------|-----|------------------|
| b06a-relaunch-tests-004 | P2 | 29 | test-quality-checklist.md § 4. TEST INDEPENDENCE AND RELIABILITY — "Tests that rely on ... filesystem state." | `createSandbox` strips `SYSTEM_SESSION_RELAUNCH_DISABLED` and the threshold switches but leaves the master switches `SYSTEM_HOOKS_DISABLED` and `MK_HOOKS_DISABLED` inherited, and it does not pin `HOOK_FLAGS_CONFIG`. `hook-flags.cjs:90-91` then resolves the repo file `.skilled/hooks/hook-flags.env`, so a developer who disabled the concern there, or exported the documented alias, fails every positive nudge and arm test in this file while the silence tests pass without exercising the hook. Two tests already pin the file ad hoc at lines 193 and 517, which shows the gap. | Add `HOOK_FLAGS_CONFIG: path.join(home, 'hook-flags.env')` to the env object and add `SYSTEM_HOOKS_DISABLED` and `MK_HOOKS_DISABLED` to the delete list, as `adapter-conformance.test.cjs:51-63` does. | no |
| b06a-relaunch-tests-005 | P2 | 576 | code-quality-checklist.md § 7. KISS / DRY ENFORCEMENT — "Copy-paste branches with minor name changes." | The same `killer-spawn-recorder.cjs` preload is written from a string array three times in this file: lines 576-596 and 626-646 are byte-identical (both record `command`, `args`, `options`), and `installKillerRecorder` at 671-696 records a slightly different payload. A fix to the interception, such as the `syncBuiltinESMExports` call or the `killer.cjs` match, has to land three times. README §5 already puts a fixture read by more than one test in `fixtures/`, and `fixtures/codex-spawn-recorder.cjs` is the existing precedent. | Keep one local helper that takes the fields it records, or reuse `fixtures/codex-spawn-recorder.cjs` with a configurable output shape, and delete the two inline copies. | no |
| b06a-relaunch-tests-006 | P2 | 721 | javascript/style-guide.md § 7. COMMENTING RULES — "All comment text MUST start with a capital letter" | The comment continues the sentence on the previous line but starts with lowercase `the`. | Capitalize it, for example `// The old fallback named its parent, which is the loop.` | no |
| b06a-relaunch-tests-007 | P2 | 171 | javascript/style-guide.md § 6. FORMATTING RULES — "Maximum: 100 characters" | The `runAdapter` call is 165 characters, and the same object-in-call pattern repeats at 184, 198, 209, 242 and 563 (148); 26 lines in the file exceed the maximum in total, with other non-string cases at 28 (115), 130 (119), 321 (131) and 343 (128). | Spread the payload object onto its own lines in each call, as the multi-line tests in this file already do. | no |

## .skilled/hooks/session-relaunch/tests/codex-adapters.test.cjs
- language: cjs
- verdict: findings
| id | sev | line | rule (file § section) | finding | fix | behaviour-change |
|----|-----|------|-----------------------|---------|-----|------------------|
| b06a-relaunch-tests-008 | P2 | 73 | test-quality-checklist.md § 4. TEST INDEPENDENCE AND RELIABILITY — "Does the test rely on external state that could change between runs?" | The delete list removes the canonical master switch `SYSTEM_HOOKS_DISABLED` but not its documented alias `MK_HOOKS_DISABLED` (`hook-flags.cjs:28`), so a developer or worker that exports the alias still silences every Codex prompt and stop adapter and the positive tests fail. `HOOK_FLAGS_CONFIG` is already pinned at line 65, so only the alias is missing. | Add `MK_HOOKS_DISABLED` next to `SYSTEM_HOOKS_DISABLED` in the delete list. | no |
| b06a-relaunch-tests-009 | P2 | 53 | test-quality-checklist.md § 3. TEST STRUCTURE AND CLARITY — "Is the test data traceable to a specific requirement or edge case?" | The fake `ps` binary prints `process.ppid` (the hook's pid) in the pid column and `CODEX_TEST_PARENT_PID` plus `CODEX_TEST_GRANDPARENT_PID` as the two parents, so the ancestor walk reads hook then test then test parent. Nothing explains why the pid column is not the `ps` process's own pid or why the env values set at lines 67-68 must keep that shape, and a future normalisation breaks the target-pid assertions at 331 and 529 without an obvious cause. | Add a comment above `writeFileSync` naming the fabricated rows and the loop the walk must reach. | no |

## .skilled/hooks/session-relaunch/tests/context-usage.test.cjs
- language: cjs
- verdict: findings
| id | sev | line | rule (file § section) | finding | fix | behaviour-change |
|----|-----|------|-----------------------|---------|-----|------------------|
| b06a-relaunch-tests-010 | P2 | 232 | test-quality-checklist.md § 3. TEST STRUCTURE AND CLARITY — "Test setup that obscures the behavior under test." | `fillRatio` is a pure division, but the test calls `createSandbox(t)` and discards the result, so it creates a temp root and registers cleanup for a dependency the function does not have. | Delete the call. | no |
| b06a-relaunch-tests-011 | P2 | 63 | test-quality-checklist.md § 3. TEST STRUCTURE AND CLARITY — "Magic values in test data without comments explaining their significance." | `900002` is the sidechain entry's total (`transcript-usage.jsonl:3`: 100 + 899900 + 2) and the assertion guards against reading it, but the bare number does not say which fixture row it comes from, and the `deepEqual` above already separates the main-chain value. A reader cannot tell whether it is a second expected value or the sidechain guard. | Name it, for example `const SIDECHAIN_FILL_TOKENS = 900002;` with a comment pointing at the third fixture row, or drop the redundant assertion. | no |
| b06a-relaunch-tests-012 | P2 | 280 | javascript/style-guide.md § 6. FORMATTING RULES — "Maximum: 100 characters" | The `payload` object literal is 121 characters, over the maximum; the `resolveWindow` call lines at 311 and 317 (106) and 337 (101) repeat the over-limit pattern. | Break the `payload` object and the three `resolveWindow` argument objects across lines. | no |

## .skilled/hooks/session-relaunch/tests/fixtures/codex-rollout-token-count.json
- language: json
- verdict: clean

## .skilled/hooks/session-relaunch/tests/fixtures/codex-spawn-recorder.cjs
- language: cjs
- verdict: findings
| id | sev | line | rule (file § section) | finding | fix | behaviour-change |
|----|-----|------|-----------------------|---------|-----|------------------|
| b06a-relaunch-tests-013 | P2 | 13 | code-quality-checklist.md § 4. BOUNDARY CONDITIONS — "Null/undefined handling and optional chaining misuse." | `fs.writeFileSync` reads `process.env.CODEX_KILLER_ARGS_FILE` with no guard. Because the fixture is loaded with `node --require`, a consumer that forgets the variable gets a bare `TypeError [ERR_INVALID_ARG_TYPE]` from inside the hook's spawn, which the stop arm logs as a generic spawn error that never names the recorder or the missing variable. | Guard the path and throw a named error, for example `throw new Error('codex-spawn-recorder: CODEX_KILLER_ARGS_FILE is required')`, and state the preload contract in a comment. | no |

## .skilled/hooks/session-relaunch/tests/fixtures/codex-stop.json
- language: json
- verdict: clean

## .skilled/hooks/session-relaunch/tests/fixtures/codex-user-prompt-submit.json
- language: json
- verdict: clean

## .skilled/hooks/session-relaunch/tests/fixtures/hermes-on-session-end.json
- language: json
- verdict: clean

## .skilled/hooks/session-relaunch/tests/fixtures/hermes-on-session-finalize.json
- language: json
- verdict: clean

## .skilled/hooks/session-relaunch/tests/fixtures/hermes-on-session-start.json
- language: json
- verdict: clean

## .skilled/hooks/session-relaunch/tests/fixtures/hermes-post-api-request.json
- language: json
- verdict: clean

## .skilled/hooks/session-relaunch/tests/fixtures/hermes-pre-api-request.json
- language: json
- verdict: clean

## .skilled/hooks/session-relaunch/tests/fixtures/hermes-pre-verify.json
- language: json
- verdict: clean

TOTAL: P0=0 P1=0 P2=13 files=15

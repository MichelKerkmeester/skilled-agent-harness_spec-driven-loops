# Batch b06b-relaunch-tests findings

VERIFIER: no lines were emitted for these files; there is nothing to confirm or reject. The empty output is expected rather than a clean bill of health: `verify_alignment_drift.py`'s opt-in header, section and folder checks do not evaluate test naming, test isolation, fixture shape or import order. A targeted run of the seven non-killer test files passed 374 tests; that does not clear the findings below.

## .skilled/hooks/session-relaunch/tests/fixtures/hermes-usage.json
- language: json
- verdict: clean

## .skilled/hooks/session-relaunch/tests/fixtures/opencode-assistant-message-updated.json
- language: json
- verdict: clean

## .skilled/hooks/session-relaunch/tests/fixtures/payload-post-tool-use.json
- language: json
- verdict: clean

## .skilled/hooks/session-relaunch/tests/fixtures/payload-stop.json
- language: json
- verdict: clean

## .skilled/hooks/session-relaunch/tests/fixtures/payload-user-prompt-submit.json
- language: json
- verdict: clean

## .skilled/hooks/session-relaunch/tests/fixtures/pi-assistant-message-end.json
- language: json
- verdict: clean

## .skilled/hooks/session-relaunch/tests/fixtures/transcript-usage.jsonl
- language: json
- verdict: clean

## .skilled/hooks/session-relaunch/tests/hermes-adapters.test.cjs
- language: cjs
- verdict: findings
| id | sev | line | rule (file § section) | finding | fix | behaviour-change |
|----|-----|------|-----------------------|---------|-----|------------------|
| b06b-relaunch-tests-001 | P2 | 83 | test-quality-checklist.md § 5. TEST SMELL DETECTION — "Tests tightly coupled to implementation details (breaking on safe refactors)." | The test builds seven named fixtures, then asserts `fixtures[4]` and `fixtures[6]`; inserting or reordering a fixture silently retargets the assertions. The name also promises that shapes are retained and identifiers redacted, but the test checks only two fixed records and only the literal `/Users/` path prefix. | Build a filename-to-fixture map and assert the common Hermes keys on every entry plus rejection of absolute home/temp paths, or narrow the test name to the two values it really checks. | no |

## .skilled/hooks/session-relaunch/tests/hop-history.test.cjs
- language: cjs
- verdict: findings
| id | sev | line | rule (file § section) | finding | fix | behaviour-change |
|----|-----|------|-----------------------|---------|-----|------------------|
| b06b-relaunch-tests-002 | P2 | 197 | javascript/style-guide.md § 8. IMPORT ORDER — "Organize imports in three groups with blank lines between." | `require('../lib/hop-history.cjs')` is inside the last test, after the constants and helper functions, splitting the import block from the top-level `node:` requires at lines 7-11. | Move the require to the top import block and use the module reference from the test. | no |

## .skilled/hooks/session-relaunch/tests/killer.test.cjs
- language: cjs
- verdict: findings
| id | sev | line | rule (file § section) | finding | fix | behaviour-change |
|----|-----|------|-----------------------|---------|-----|------------------|
| b06b-relaunch-tests-003 | P2 | 47 | test-quality-checklist.md § 4. TEST INDEPENDENCE AND RELIABILITY — "Does the test rely on external state that could change between runs?" | `createSandbox` strips `SESSION_RELAUNCH_MAX_HOPS` but leaves `SESSION_RELAUNCH_MAX_AGE_MIN` and `HOOK_FLAGS_CONFIG` inherited. `killer.cjs` calls `nudge.armedRecordStillCurrent` before signalling, and that helper reads the max age from the environment and the configured hook-flags file (`nudge.cjs:maxAgeMinutes`); an operator with a short age or a config file makes the positive signal tests unarm the record as stale instead of exercising the signal path. | Add `SESSION_RELAUNCH_MAX_AGE_MIN` to the delete list and pin `HOOK_FLAGS_CONFIG` to a file under `sandbox.root`, as the other relaunch test files do. | no |
| b06b-relaunch-tests-004 | P2 | 1789 | test-quality-checklist.md § 1. OVERVIEW — "Tests that cannot fail are worse than no tests. They create false confidence and hide real defects." | The test claims to collide with a stale leftover at its pid, but `killer.cjs:419` names the stale mutex `${mutexPath}.stale-${process.pid}-${randomUUID()}` while the test creates `${mutexPath}.stale-${killer.pid}`. The extra UUID means the rename target can never equal the setup path; `assert.exists(collision)` only proves the test's own directory survived, not that the killer handled a collision. | Inject a deterministic `randomUUID`/rename seam and create the collision at the actual target path, or remove the obsolete collision setup and rename the test to the stale-takeover reclaim it really covers. | no |

## .skilled/hooks/session-relaunch/tests/nudge.test.cjs
- language: cjs
- verdict: findings
| id | sev | line | rule (file § section) | finding | fix | behaviour-change |
|----|-----|------|-----------------------|---------|-----|------------------|
| b06b-relaunch-tests-005 | P2 | 64 | test-quality-checklist.md § 3. TEST STRUCTURE AND CLARITY — "Multiple unrelated assertions in a single test function." | One test verifies the complete handoff text and then the unbound, skipped and unspecified variants at lines 116-159. An early failure in the first scenario stops the later variant tests, so a regression in the empty-folder or Gate 3 Skip branch is hidden until the first scenario is repaired. | Split the scenarios into separate `test()` cases, or drive them from a table so each variant has its own assertion boundary. | no |
| b06b-relaunch-tests-006 | P2 | 116 | javascript/style-guide.md § 6. FORMATTING RULES — "Maximum: 100 characters" | The `handoffText` call is 134 characters, and the test name at line 64 is 122; both exceed the file's 100-character maximum. | Break the object argument across lines and shorten the test name at line 64. | no |
| b06b-relaunch-tests-007 | P2 | 925 | javascript/style-guide.md § 8. IMPORT ORDER — "Organize imports in three groups with blank lines between." | `const nudgeModule = require('../lib/nudge.cjs')` appears after dozens of tests, after the file already imported the same module at lines 11-27. The namespace is only introduced late to reach exports the top-level destructure omitted. | Import the namespace once at the top and destructure from it, or add the missing exports to the existing top-level destructure. | no |

## .skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs
- language: cjs
- verdict: findings
| id | sev | line | rule (file § section) | finding | fix | behaviour-change |
|----|-----|------|-----------------------|---------|-----|------------------|
| b06b-relaunch-tests-008 | P2 | 1140 | javascript/style-guide.md § 8. IMPORT ORDER — "Organize imports in three groups with blank lines between." | The file already destructures `../lib/relaunch-core.cjs` at lines 12-34, then requires the same module again at line 1140, after the test bodies, solely to reach later exports. This is a second import block in the middle of the file. | Import the namespace once at the top and destructure from it, or add `noteState`, `resolveKillerTarget`, `armableRecord`, the frozen exports and the other late names to the existing top-level destructure. | no |

## .skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs
- language: cjs
- verdict: findings
| id | sev | line | rule (file § section) | finding | fix | behaviour-change |
|----|-----|------|-----------------------|---------|-----|------------------|
| b06b-relaunch-tests-009 | P2 | 283 | test-quality-checklist.md § 3. TEST STRUCTURE AND CLARITY — "Test names that do not describe the scenario or expected outcome." | The test says it runs under the loop with a Claude process that has no children, but `SKILLED_LOOP_ID` is the non-numeric `LOOP_ID` string. `refuseForShellChild` turns it into `Number(loopId)`, gets `NaN`, resolves no runtime and logs `running-work-check-skipped`; the test would still pass if child detection were broken. | Use a real numeric loop ancestor and a process table, or assert that the skipped log is absent; otherwise rename the test to the skipped-path case it actually exercises. | no |
| b06b-relaunch-tests-010 | P2 | 463 | test-quality-checklist.md § 2. COVERAGE QUALITY — "Are failure modes and boundary conditions tested alongside the happy path?" | The under-loop invalid-`CLAUDE_PID` cases never assert the named error: line 463 fails on a claimed handoff before `refuseForShellChild`, and line 991 reaches the `CLAUDE_PID must be a positive process id` throw at `bin/session-relaunch.cjs:257-261` but only asserts exit 2 and that the old note was untouched, so a generic error or a different refusal still passes. | Add an under-loop test with a valid open note and an invalid `CLAUDE_PID`, asserting the named error and exit 2. | no |

## .skilled/hooks/session-relaunch/tests/skilled-loop-shell.test.cjs
- language: cjs
- verdict: findings
| id | sev | line | rule (file § section) | finding | fix | behaviour-change |
|----|-----|------|-----------------------|---------|-----|------------------|
| b06b-relaunch-tests-011 | P2 | 173 | javascript/style-guide.md § 6. FORMATTING RULES — "Maximum: 100 characters" | The two `test()` declarations at lines 173 and 191 are 153 and 140 characters because the skip expression and callback are kept on one line. | Move the options object to a multi-line argument list. | no |

## .skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs
- language: cjs
- verdict: findings
| id | sev | line | rule (file § section) | finding | fix | behaviour-change |
|----|-----|------|-----------------------|---------|-----|------------------|
| b06b-relaunch-tests-012 | P2 | 564 | test-quality-checklist.md § 3. TEST STRUCTURE AND CLARITY — "Test names that do not describe the scenario or expected outcome." | The test says it covers each supported runtime, but the loop lists only Claude, Pi, OpenCode, Codex, Cursor and Hermes. `core.RUNTIMES` also contains `devin`, and the separate Devin test checks dispatch rather than this identity loop, so the name overstates the coverage and a future runtime is not picked up. | Iterate `core.RUNTIMES` or add `devin` to this loop. | no |
| b06b-relaunch-tests-013 | P2 | 1463 | test-quality-checklist.md § 3. TEST STRUCTURE AND CLARITY — "Test names that do not describe the scenario or expected outcome." | The test says the wrapper "warns and consumes" an empty-handoff record, but the assertions at lines 1479-1480 require empty stderr and only check the decline log; no warning is expected or produced. | Rename the test to the decline-without-warning behavior it verifies, or add the warning assertion and implement the warning. | no |

TOTAL: P0=0 P1=0 P2=13 files=15

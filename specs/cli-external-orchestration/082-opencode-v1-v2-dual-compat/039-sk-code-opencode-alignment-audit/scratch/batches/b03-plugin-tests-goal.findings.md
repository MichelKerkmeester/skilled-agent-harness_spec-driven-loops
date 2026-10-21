# Batch b03-plugin-tests-goal findings

VERIFIER: no lines were emitted for these files; there is nothing to confirm or reject. The empty output is expected rather than a clean bill of health: `verify_alignment_drift.py` exempts `tests/` paths from the exact-header check.

## .opencode/plugins/tests/goal-doc-contract.test.cjs
- language: cjs
- verdict: findings
| id | sev | line | rule (file § section) | finding | fix | behaviour-change |
|----|-----|------|-----------------------|---------|-----|------------------|
| b03-plugin-tests-goal-001 | P2 | 39 | test-quality-checklist.md § 1. OVERVIEW — "Tests that cannot fail are worse than no tests. They create false confidence and hide real defects." | `read(doc)` failures are swallowed with `continue`, and the only output assertion is that `missing` is empty, so a deleted goal document or a doc set that yields no backticked citations makes this path-existence test pass without checking anything; the `ROSTERS` loop at line 131 has the same shape. | Fail on an unreadable DOC instead of `continue`, and assert the extracted citation set is non-empty before comparing; apply the same guard to `ROSTERS`. | no |

## .opencode/plugins/tests/opencode-goal-capabilities.test.cjs
- language: cjs
- verdict: clean

## .opencode/plugins/tests/opencode-goal-continuation.test.cjs
- language: cjs
- verdict: clean

## .opencode/plugins/tests/opencode-goal-export-contract.test.cjs
- language: cjs
- verdict: clean

## .opencode/plugins/tests/opencode-goal-lifecycle.test.cjs
- language: cjs
- verdict: findings
| id | sev | line | rule (file § section) | finding | fix | behaviour-change |
|----|-----|------|-----------------------|---------|-----|------------------|
| b03-plugin-tests-goal-002 | P2 | 95 | code-quality-checklist.md § 6. MAINTAINABILITY SIGNALS — "Hand-rolled standard-library behavior where the language or runtime already provides a clear, readable primitive." | `fileExists` reads the whole file and treats only `ENOENT` as absent, so it throws `EISDIR` for a directory and does unnecessary I/O; the same helper is copy-pasted at `opencode-goal-state.test.cjs:58`. | Use `stat` or `access` for existence and move the helper into `tests/helpers/` so both files share one implementation. | no |
| b03-plugin-tests-goal-003 | P2 | 773 | security-checklist.md § 5. RUNTIME RELIABILITY — "Unbounded loops, recursion, or memory growth." | The `while (verifierCalls === 0)` loop spins on `setImmediate` with no deadline; if a regression stops the idle verifier from running, this test hangs the suite instead of failing it. | Bound the wait with a deadline or iteration cap, then assert `verifierCalls` is 1. | no |
| b03-plugin-tests-goal-004 | P2 | 998 | test-quality-checklist.md § 1. OVERVIEW — "Tests that cannot fail are worse than no tests. They create false confidence and hide real defects." | `directorySnapshot` returns `[]` for a missing directory and for an existing empty one, so "state directory unchanged" cannot detect that a disabled plugin created the empty state directory; the test only detects files. | Also assert the directory itself still does not exist after the events (for example `access` or `stat` on `disabledStateDir`), not just that its entry list is unchanged. | no |
| b03-plugin-tests-goal-005 | P2 | 1152 | test-quality-checklist.md § 5. TEST SMELL DETECTION — "Tests tightly coupled to implementation details (breaking on safe refactors)." | The `Proxy` turns assignment of the internal metric `sweepJsonParse` into the trigger for a concurrent `setGoal` write, so test control flow depends on a private instrumentation name and on when `sweepOrphanedActiveStates` happens to count it. | Drive the race from an explicit test seam (a read/parse hook in the options) or a promise the sweep awaits; keep metrics observation-only. | no |

## .opencode/plugins/tests/opencode-goal-render-parity.test.cjs
- language: cjs
- verdict: findings
| id | sev | line | rule (file § section) | finding | fix | behaviour-change |
|----|-----|------|-----------------------|---------|-----|------------------|
| b03-plugin-tests-goal-006 | P2 | 8 | test-quality-checklist.md § 3. TEST STRUCTURE AND CLARITY — "Test names that do not describe the scenario or expected outcome." | The header claims "Exactly one line differs by design: `usage:`", but core `renderGoalBrief` relabels the `Role:` line to the reading runtime (`goal-core.cjs:526-527`) while the plugin keeps `OpenCode`, so `goal_prompt` also differs; the test never compares `goal_prompt`, so neither the claim nor drift there is caught. | State both intended differences and compare the full blocks line by line with `usage:` and the `Role:` line masked, or narrow the claim to the label set and the four compared lines. | no |
| b03-plugin-tests-goal-007 | P2 | 90 | javascript/style-guide.md § 8. IMPORT ORDER — "Organize imports in three groups with blank lines between." | `stat` (line 90) and `mkdir`/`writeFile` (line 109) are required inside test bodies even though `node:fs/promises` is already imported at line 15, splitting the import block across the file. | Add `mkdir`, `stat` and `writeFile` to the top-level `node:fs/promises` destructure at line 15 and delete the inline requires. | no |

## .opencode/plugins/tests/opencode-goal-state.test.cjs
- language: cjs
- verdict: findings
| id | sev | line | rule (file § section) | finding | fix | behaviour-change |
|----|-----|------|-----------------------|---------|-----|------------------|
| b03-plugin-tests-goal-008 | P2 | 504 | test-quality-checklist.md § 5. TEST SMELL DETECTION — "Tests tightly coupled to implementation details (breaking on safe refactors)." | The test replaces `RegExp.prototype.test` process-wide and counts six internal scoring regex sources, while the metric assertion at line 522 already proves scoring did not run; the global patch adds cross-test risk and regex-source coupling without additional coverage. | Remove the prototype patch and rely on `promptMetrics.scoreEnhancedGoalPrompt` (or add a scoring hook) for the same assertion. | no |

## .opencode/plugins/tests/opencode-goal-supervisor.test.cjs
- language: cjs
- verdict: findings
| id | sev | line | rule (file § section) | finding | fix | behaviour-change |
|----|-----|------|-----------------------|---------|-----|------------------|
| b03-plugin-tests-goal-009 | P2 | 491 | test-quality-checklist.md § 4. TEST INDEPENDENCE AND RELIABILITY — "Tests that rely on wall-clock timing, network availability, or filesystem state." | A 20 ms verifier timeout is declared correct only if the wall clock advances less than 500 ms; a loaded CI runner can exceed that while the timeout behavior is correct, failing the test spuriously. | Drop the elapsed-time assertion and rely on `timedOut`, `reason` and the unchanged goal state, or use fake timers. | no |

## .opencode/plugins/tests/opencode-goal-tool-path.test.cjs
- language: cjs
- verdict: findings
| id | sev | line | rule (file § section) | finding | fix | behaviour-change |
|----|-----|------|-----------------------|---------|-----|------------------|
| b03-plugin-tests-goal-010 | P2 | 121 | test-quality-checklist.md § 2. COVERAGE QUALITY — "Does every test function contain at least one meaningful assertion?" | The plugin in this test is constructed with only `{ stateDir }` and no `goalIdFactory`, so `assert.notEqual(terminalGoal.goalId, 'tool-goal')` can never fail and does not prove that a completed goal was replaced with a fresh id. | Capture the completed goal's `goalId` before re-setting and assert the replacement has a different id. | no |
| b03-plugin-tests-goal-011 | P2 | 157 | test-quality-checklist.md § 1. OVERVIEW — "Tests that cannot fail are worse than no tests. They create false confidence and hide real defects." | `graph?.derived?.key_files || []` makes a missing or renamed `key_files` field run zero loop iterations, so this regression guard passes when the schema it targets disappears. | Assert `Array.isArray(graph?.derived?.key_files)` and that its length is greater than zero before iterating. | no |
| b03-plugin-tests-goal-012 | P2 | 172 | javascript/style-guide.md § 8. IMPORT ORDER — "Organize imports in three groups with blank lines between." | `mkdir` and `writeFile` are required mid-file after the tests and an unnumbered section divider, splitting the import block from the top-level `node:fs/promises` import at line 14. | Add `mkdir` and `writeFile` to the line 14 require and delete the line 172 require. | no |

## .opencode/plugins/tests/speckit-goal-offer-contract.test.cjs
- language: cjs
- verdict: clean

TOTAL: P0=0 P1=0 P2=12 files=10

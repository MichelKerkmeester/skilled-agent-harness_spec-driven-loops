# Batch b04-plugin-tests-rest findings

VERIFIER: no lines were emitted for these files; there is nothing to confirm or reject.

## .opencode/plugins/tests/classifier-injection-screen.test.cjs
- language: cjs
- verdict: clean

## .opencode/plugins/tests/claude-fable-subagent-guard.test.cjs
- language: cjs
- verdict: findings
| id | sev | line | rule (file § section) | finding | fix | behaviour-change |
|----|-----|------|-----------------------|---------|-----|------------------|
| b04-plugin-tests-rest-001 | P2 | 33 | test-quality-checklist.md § 4. TEST INDEPENDENCE AND RELIABILITY — "Missing cleanup or teardown for resources created during test setup." | `transcript()` creates a module-level temp directory with `mkdtempSync` and no test or `after()` hook removes it; every run leaves `fable-guard-*.jsonl` under the OS temp directory. | Create the directory once per test with `t.after` cleanup, or add an `after()` hook that removes the directory. | no |

## .opencode/plugins/tests/claude-task-dispatch-guard.test.cjs
- language: cjs
- verdict: findings
| id | sev | line | rule (file § section) | finding | fix | behaviour-change |
|----|-----|------|-----------------------|---------|-----|------------------|
| b04-plugin-tests-rest-002 | P2 | 298 | shared/universal-patterns/naming-and-commenting.md § 4. REFERENCE COMMENT PATTERNS — "Comments must never embed an ephemeral-artifact pointer." | The comment names review finding `R3-P1-001`; the id dangles once the review packet is archived. The durable reason is that a bare iteration marker must not act as an envelope. | Drop the id and keep the durable WHY. | no |

## .opencode/plugins/tests/helpers/continuation-log.cjs
- language: cjs
- verdict: findings
| id | sev | line | rule (file § section) | finding | fix | behaviour-change |
|----|-----|------|-----------------------|---------|-----|------------------|
| b04-plugin-tests-rest-003 | P2 | 1 | universal-checklist.md § 2. P0 - HARD BLOCKERS (File Header) — "File has appropriate header comment identifying the component." | The file starts with `'use strict';` and has no module header identifying the component. | Add the `// ─── MODULE: ... ───` divider header above the strict-mode directive. | no |
| b04-plugin-tests-rest-004 | P2 | 6 | javascript/style-guide.md § 7. COMMENTING RULES (JSDoc Comments) — "Required for all exported functions." | `readContinuationEntries` and `restoreEnv` are exported at lines 24-27 but carry no JSDoc. | Add JSDoc with the state-dir parameter, return value, and behavior for both exports. | no |

## .opencode/plugins/tests/mcp-route-guard.test.cjs
- language: cjs
- verdict: findings
| id | sev | line | rule (file § section) | finding | fix | behaviour-change |
|----|-----|------|-----------------------|---------|-----|------------------|
| b04-plugin-tests-rest-005 | P2 | 1 | javascript/style-guide.md § 2. FILE HEADER FORMAT — "Divider width: 67 box-drawing characters after `// `." | The module divider on lines 1 and 3 has 63 box-drawing characters, not the required 67; this is not one of the accepted legacy header shapes. | Extend both divider lines to 67 box-drawing characters. | no |

## .opencode/plugins/tests/session-cleanup.test.cjs
- language: cjs
- verdict: clean

## .opencode/plugins/tests/session-relaunch.test.cjs
- language: cjs
- verdict: findings
| id | sev | line | rule (file § section) | finding | fix | behaviour-change |
|----|-----|------|-----------------------|---------|-----|------------------|
| b04-plugin-tests-rest-006 | P2 | 900 | javascript/style-guide.md § 6. FORMATTING RULES (Indentation) — "Size: 2 spaces." | In the two multi-line `test()` calls, the callback body starts at the same two-space indent as the `async (t) =>` parameter (lines 900-928 and 934-962), while lines 926-927 jump to four spaces; the block does not follow the guide's two-space-per-level indentation. | Indent each callback body one level (four spaces) and align the closing `},` with the `async` parameter. | no |

## .opencode/plugins/tests/sk-code-post-edit-quality.test.cjs
- language: cjs
- verdict: clean

## .opencode/plugins/tests/sk-git-message-gate.test.cjs
- language: cjs
- verdict: findings
| id | sev | line | rule (file § section) | finding | fix | behaviour-change |
|----|-----|------|-----------------------|---------|-----|------------------|
| b04-plugin-tests-rest-007 | P2 | 52 | test-quality-checklist.md § 4. TEST INDEPENDENCE AND RELIABILITY — "Missing cleanup or teardown for resources created during test setup." | Each test removes its temp repository only after its assertions, so a failing assertion leaves the repository behind; the first cleanup is line 52 and the pattern repeats at lines 60, 67, and 77. | Register `t.after(() => fs.rmSync(dir, { recursive: true, force: true }))` in `makeRepo`, or wrap each test body in `try/finally`. | no |

## .opencode/plugins/tests/source-root-consumers.test.cjs
- language: cjs
- verdict: findings
| id | sev | line | rule (file § section) | finding | fix | behaviour-change |
|----|-----|------|-----------------------|---------|-----|------------------|
| b04-plugin-tests-rest-008 | P2 | 1 | universal-checklist.md § 2. P0 - HARD BLOCKERS (File Header) — "File has appropriate header comment identifying the component." | The file starts with `'use strict';` and has no module header identifying the component. | Add the `// ─── MODULE: ... ───` divider header above the strict-mode directive. | no |

## .opencode/plugins/tests/system-completion-sentinel.test.cjs
- language: cjs
- verdict: findings
| id | sev | line | rule (file § section) | finding | fix | behaviour-change |
|----|-----|------|-----------------------|---------|-----|------------------|
| b04-plugin-tests-rest-009 | P2 | 74 | test-quality-checklist.md § 3. TEST STRUCTURE AND CLARITY — "Magic values in test data without comments explaining their significance." | The stale-entry ages `isoDaysAgo(40)` at line 74 and `isoDaysAgo(400)` at line 98 are bare magic numbers; the core default retention is 30 days, but the test does not tie the values to that constant or explain the margin. | Use `sentinelCore.DEFAULT_RETENTION_DAYS` plus a documented margin, or name and comment the 40-day and 400-day ages as beyond the retention window. | no |

## .opencode/plugins/tests/system-deep-loop-guard.test.cjs
- language: cjs
- verdict: findings
| id | sev | line | rule (file § section) | finding | fix | behaviour-change |
|----|-----|------|-----------------------|---------|-----|------------------|
| b04-plugin-tests-rest-010 | P2 | 223 | shared/universal-patterns/naming-and-commenting.md § 4. REFERENCE COMMENT PATTERNS — "Comments must never embed an ephemeral-artifact pointer." | The review id `R3-P1-001` appears in comments at lines 223 and 253; both will dangle. The durable reason is the bare-marker and ghost-config forgery behavior described below them. | Remove the id from both comments and keep the behavioral WHY. | no |

## .opencode/plugins/tests/system-dist-freshness-guard.test.cjs
- language: cjs
- verdict: findings
| id | sev | line | rule (file § section) | finding | fix | behaviour-change |
|----|-----|------|-----------------------|---------|-----|------------------|
| b04-plugin-tests-rest-011 | P2 | 131 | test-quality-checklist.md § 2. COVERAGE QUALITY — "Are failure modes and boundary conditions tested alongside the happy path?" | `runTrapped()` replaces only `console.warn`, `console.error`, and `console.log`; it does not trap `process.stdout.write` or `process.stderr.write`, so the test named "without terminal output" cannot detect a plugin that writes directly to those streams. | Trap `process.stdout.write` and `process.stderr.write` in `runTrapped()`, as the classifier-injection-screen test already does, and restore them in `finally`. | no |

## .opencode/plugins/tests/system-skill-advisor.test.cjs
- language: cjs
- verdict: findings
| id | sev | line | rule (file § section) | finding | fix | behaviour-change |
|----|-----|------|-----------------------|---------|-----|------------------|
| b04-plugin-tests-rest-012 | P2 | 210 | test-quality-checklist.md § 4. TEST INDEPENDENCE AND RELIABILITY — "Shared mutable state between test functions without proper reset." | `makeAdvisorFixture()` deletes `SYSTEM_SKILL_ADVISOR_DB_DIR` and `MK_SKILL_ADVISOR_DB_DIR` from the shared `process.env` and never restores them; later tests in the same process inherit the mutation. | Save the prior values and restore them in the fixture teardown, or pass an explicit environment object into the fixture. | no |

## .opencode/plugins/tests/system-spec-gate.test.cjs
- language: cjs
- verdict: findings
| id | sev | line | rule (file § section) | finding | fix | behaviour-change |
|----|-----|------|-----------------------|---------|-----|------------------|
| b04-plugin-tests-rest-013 | P2 | 126 | shared/universal-patterns/naming-and-commenting.md § 4. REFERENCE COMMENT PATTERNS — "Comments must never embed an ephemeral-artifact pointer." | Section comments label work with `P1 fix`, `P2 fix`, `WS1`, and `WS4`; these are ephemeral finding and workstream ids. The durable contract is the context behavior described below each label. | Remove the ids and keep the behavioral WHY; apply the same cleanup at lines 226, 272-273, 315, and 386. | no |
| b04-plugin-tests-rest-014 | P2 | 277 | test-quality-checklist.md § 4. TEST INDEPENDENCE AND RELIABILITY — "Shared mutable state between test functions without proper reset." | This test never clears `AI_SESSION_CHILD`; when it is `1` (the dispatched-child environment), `classifyIntent` returns closed before opening the gate and `tool.execute.before` returns allow before reading gate state, so the assertions pass without exercising the enforce-unset non-denial path the test name claims. Sibling tests at lines 132, 230, and 323 wrap `withEnv('AI_SESSION_CHILD', undefined, ...)`. | Wrap the test body in `withEnv('AI_SESSION_CHILD', undefined, ...)` so the gate is actually opened. | no |

## .opencode/plugins/tests/system-speckit-completion.test.cjs
- language: cjs
- verdict: clean

## .opencode/plugins/tests/v2-bridge.test.cjs
- language: cjs
- verdict: clean

TOTAL: P0=0 P1=0 P2=14 files=17

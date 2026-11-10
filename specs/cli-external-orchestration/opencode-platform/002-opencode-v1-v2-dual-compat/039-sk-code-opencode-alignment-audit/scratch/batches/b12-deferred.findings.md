# Batch b12-deferred findings

VERIFIER: no verifier lines were emitted for these eight files, so there is nothing to confirm or reject; the batch's verifier result is empty. No source file was modified.

## .opencode/plugins/ARCHITECTURE.md
- language: md
- verdict: findings
| id | sev | line | rule (file § section) | finding | fix | behaviour-change |
|----|-----|------|-----------------------|---------|-----|------------------|
| b12-deferred-001 | P1 | 126 | task brief § Markdown files — "check that every claim about code, paths, counts or behaviour matches the code you read; flag a wrong claim as P1" | The `lib/v2-bridge.js` citations throughout §3-§4 point at unrelated code. Line 126 cites `lib/v2-bridge.js:8-15` for `MAPPED_HOOKS`, which is actually at 16-23; line 117 cites `:285` for `dualPlugin` (actual 301) and `:106` for `toV1ToolOutput` (actual 118); line 130 cites `:383-456` for the event leg (actual 399-472); line 136 cites `:299,380` for `cleanup.skippedKeys` (actual 315, 396). The kill-switch paragraph at line 156 is equally stale: `hook-flags.cjs:25` for `MASTER_FLAG` (actual 36), `:28` (actual 39), `:34-41` (actual 45-54), `:51` (actual 62), `:99` (actual 114). A reader following any of these lands on the wrong code, which defeats the doc's stated purpose of pointing the reader at the implementation. | Regenerate every `lib/v2-bridge.js` and `hook-flags.cjs` line reference from the current files, or cite the symbol name instead of a line range. The sk-vision `plugin.ts` citations in the same document still match and need no change. | no |
| b12-deferred-002 | P2 | 113 | task brief § Markdown files — a stale or unclear claim is P2 | The OpenCode 2 load-path sentence says the bridge builds the v1 input "with `client` from `createV1Client(ctx)`, `worktree` and `directory` from `ctx.location.directory` and `project`, `experimental_workspace`, `serverUrl` and `$` set to `undefined`". `lib/v2-bridge.js:304-312` sets `project: undefined` as well; only `worktree` and `directory` come from `ctx.location.directory`. As punctuated, a reader can conclude `project` is sourced from the location. | Rewrite to "`worktree` and `directory` from `ctx.location.directory`; `project`, `experimental_workspace`, `serverUrl` and `$` set to `undefined`" and refresh the line reference to 304-312. | no |

## .opencode/plugins/tests/README.md
- language: md
- verdict: findings
| id | sev | line | rule (file § section) | finding | fix | behaviour-change |
|----|-----|------|-----------------------|---------|-----|------------------|
| b12-deferred-003 | P1 | 110 | task brief § Markdown files — "check that every claim about code, paths, counts or behaviour matches the code you read; flag a wrong claim as P1" | §4 says "`opencode-goal-*.test.cjs` (7 files)" and lists capabilities, continuation, export contract, lifecycle, state, supervisor and tool-path. The folder contains eight: `opencode-goal-render-parity.test.cjs` also exists and is already listed in the §2 table at line 37. The count and the enumeration both understate the suite. | Change "(7 files)" to "(8 files)" and add "render parity" to the list. | no |
| b12-deferred-004 | P2 | 18 | task brief § Markdown files — a stale or unclear claim is P2 | §1 and the boundary table (line 129) state that "Several plugins expose a `.__test` surface hanging off the default export", and the export-contract row (line 35) says that test pins the surface. No plugin or `lib/` module contains `__test` (`grep -rn "__test" .opencode/plugins/*.js .opencode/plugins/lib/*.js` returns nothing), and `opencode-goal-export-contract.test.cjs:22-39` asserts the default export has exactly `id`, `server` and `setup` and reaches internals through `getGoalCore(plugin.server)` instead. | Delete the three `.__test` claims and describe the real seam (`lib/*-core.js` exports reached through `plugin.server`), or restore the surface if it is still intended. | no |

## .opencode/plugins/tests/helpers/README.md
- language: md
- verdict: findings
| id | sev | line | rule (file § section) | finding | fix | behaviour-change |
|----|-----|------|-----------------------|---------|-----|------------------|
| b12-deferred-005 | P1 | 17 | task brief § Markdown files — "check that every claim about code, paths, counts or behaviour matches the code you read; flag a wrong claim as P1" | §1 describes the folder as "one module, `continuation-log.cjs`". The folder also holds `plugin-inventory.cjs`, a 1,186-line rolldown AST inventory and event scanner used by `plugin-inventory.test.cjs`, `v2-registration.test.cjs` and `v2-hard-plugins.test.cjs`. The inventory table (line 25), the §3 directory tree (lines 31-35), the §7 validation commands and the §6 "No external deps" boundary (line 67) all omit it; only the `continuation-log.cjs` description is accurate. | Add a `plugin-inventory.cjs` row and tree entry, name its three consumers, add its `node --check` to §7, and scope the "Node builtins only" boundary to `continuation-log.cjs` because the scanner requires `rolldown/parseAst` from `.skilled/package.json`. | no |

## .opencode/plugins/tests/helpers/plugin-inventory.cjs
- language: cjs
- verdict: findings
| id | sev | line | rule (file § section) | finding | fix | behaviour-change |
|----|-----|------|-----------------------|---------|-----|------------------|
| b12-deferred-006 | P1 | 611 | code-quality-checklist.md § 5. DATA FLOW AND CONTRACT SAFETY — "Data transformation functions that silently drop fields, truncate values, or lose type precision." | `collectEventTypeAliases` skips every binding in `context.written` (line 611), so a type-derived alias written later never enters `context.aliases`; `isEventType` then treats a comparison on it as an ordinary value. A check that precedes the write is dropped from both outputs: `let t = event.type; if (t === 'a.before') {} t = 0;` returns `handled: []` and `unscanned: []` (observed with the helper). The scanner's contract is to fail closed, so a plugin can add a real event comparison that the inventory gate never sees, and `plugin-inventory.test.cjs`'s "every handled event name reaches v2 plugins or is listed" check still passes. | Track the earliest write offset per binding and treat the binding as the event type for checks whose node starts before that write (or, failing that, add those comparisons to `unscanned` instead of dropping them), then add a regression case for a check before the later write next to the existing reassignment test. | no |
| b12-deferred-007 | P2 | 29 | javascript/style-guide.md § 7. COMMENTING RULES (JSDoc Comments) — "Required for all exported functions." | The four exported functions have no JSDoc: `readManifest` (29), `readInventory` (42), `handledEventNames` (1172) and `unscannedEventChecks` (1176). The file only has section comments and inline rationale, so a caller cannot learn that `readInventory` returns `{ bridged, nativeDual, problems }`, that `problems` is the assertion surface, or that both name readers return sorted arrays and throw on an unparseable source. | Add JSDoc to the four exports documenting parameters, the `readInventory` return shape, the sorted array results and the parse-failure throw. | no |
| b12-deferred-008 | P2 | 446 | shared/universal-patterns/organization-security-and-examples.md § 2. FILE ORGANIZATION (File Length Guidelines) — "Utility/helper 200 lines ... Consider splitting"; code-quality-checklist.md § 6. MAINTAINABILITY SIGNALS — "Functions exceeding 20 lines or 4+ nesting levels without structural justification." | The helper is 1,186 lines against the 200-line utility/helper ceiling, and the functions are far past the 20-line signal: `buildScopes` 446-575 (130 lines), `isEventTypeParameter` 268-320 (53), `readCall` 1062-1117 (56) and `scanEvents` 1119-1170 (52). The file also carries an unused `const aliases` binding at 1135 (`collectEventTypeAliases` already writes `context.aliases`), which is refactor debris that a reader has to rule out. | Split by concern (scope building, collection resolution, derived-binding tracking, the scan/report pass), keep the exported surface in one entry file, and delete the unused `aliases` binding. | no |

## .opencode/plugins/tests/plugin-inventory.json
- language: json
- verdict: clean

## .opencode/plugins/tests/plugin-inventory.test.cjs
- language: cjs
- verdict: clean

## .opencode/plugins/tests/v2-hard-plugins.test.cjs
- language: cjs
- verdict: findings
| id | sev | line | rule (file § section) | finding | fix | behaviour-change |
|----|-----|------|-----------------------|---------|-----|------------------|
| b12-deferred-009 | P2 | 327 | test-quality-checklist.md § 4. TEST INDEPENDENCE AND RELIABILITY — "Does the test rely on external state that could change between runs?" | The registration loop calls `plugin.setup` without neutralising the kill-switch environment. `hook-flags.cjs` resolves `SYSTEM_HOOKS_DISABLED`, `MK_HOOKS_DISABLED` and the `HOOK_FLAGS_CONFIG` file, and `sk-vision`'s setup returns a no-op cleanup when disabled (`vision-runtime/src/plugin.ts:380`). Running `SYSTEM_HOOKS_DISABLED=1 node --test .opencode/plugins/tests/v2-hard-plugins.test.cjs` fails the "sk-vision exports and registers v2 hooks" case on correct code; the behaviour cases already clear these names through `withEnvironment`. | Wrap the registration loop (or set at module scope) with `SYSTEM_HOOKS_DISABLED`, `MK_HOOKS_DISABLED` and a `HOOK_FLAGS_CONFIG` path under `TEST_ROOT`, restoring afterwards, as `system-speckit-completion.test.cjs:62-67` does. | no |

## .opencode/plugins/tests/v2-registration.test.cjs
- language: cjs
- verdict: findings
| id | sev | line | rule (file § section) | finding | fix | behaviour-change |
|----|-----|------|-----------------------|---------|-----|------------------|
| b12-deferred-010 | P2 | 97 | test-quality-checklist.md § 4. TEST INDEPENDENCE AND RELIABILITY — "Does the test rely on external state that could change between runs?" | Every case calls `plugin.setup(stubCtx)` with no kill-switch neutralisation. Disabled plugins return `{}` or fewer hooks, so `assert.ok(registrations.length > 0)` fails. Running `SYSTEM_HOOKS_DISABLED=1 node --test .opencode/plugins/tests/v2-registration.test.cjs` fails most of the 16 cases on correct code, and the suite also inherits any `.skilled/hooks/hook-flags.env` through the resolver cache. This contradicts `tests/README.md:16`'s "hermetic ... per-test env var save/restore" claim. | Set `HOOK_FLAGS_CONFIG` under `TEST_ROOT`, delete every `*_DISABLED` key before the first setup, and restore both in the existing `after` hook, following `system-speckit-completion.test.cjs:62-67` and `:150-153`. | no |
| b12-deferred-011 | P2 | 41 | test-quality-checklist.md § 4. TEST INDEPENDENCE AND RELIABILITY — "Missing cleanup or teardown for resources created during test setup." | `createStubContext`'s `record` returns no disposer, and the cases never call the `cleanup` they assert at line 100, so every setup leaves its registrations undisposed for the process. The stub cannot currently support cleanup: the bridge calls `registration.dispose()` for each returned registration, which would throw because `record` returns `undefined`. | Make `record` return `{ dispose() {} }`, then call `await cleanup()` in a `finally` block and assert it resolves. | no |

TOTAL: P0=0 P1=4 P2=7 files=8

# Batch b10-hooks-quality-screen-task findings

VERIFIER: both listed lines are confirmed as findings. The `EXACT-HEADER` on `.skilled/hooks/post-edit-quality/devin/post-edit-quality.test.cjs:1` maps to b10-hooks-quality-screen-task-011, and the `EXACT-HEADER` on `.skilled/hooks/task-dispatch/claude/fable-subagent-guard.mjs:1` maps to b10-hooks-quality-screen-task-015. No listed line was rejected. Rerunning the same verifier with the documented flags also emits `FOLDER-README-MISSING` for the adapter and lib folders under both trees; those folders are outside FILES, so they are recorded as confirmation context rather than as file findings.

## .skilled/hooks/classifier-injection-screen/README.md
- language: md
- verdict: findings
| id | sev | line | rule (file § section) | finding | fix | behaviour-change |
|----|-----|------|-----------------------|---------|-----|------------------|
| b10-hooks-quality-screen-task-001 | P2 | 16 | README.md § 1. OVERVIEW — "The fetch result always reaches the model unchanged." | The Pi adapter returns `{ content: [...event.content, { type: "text", text: advisory }] }` (`pi/classifier-injection-screen.ts:34`), and §4 line 82 correctly says "Advisory text block appended to the tool result"; Hermes also appends the advisory. The fetched text itself is unchanged, but the model-visible tool result is augmented, so the unqualified sentence contradicts the later table. | Say that the fetched text is never altered and that runtimes able to append a separate advisory block may augment the tool result. | no |

## .skilled/hooks/classifier-injection-screen/claude/classifier-injection-screen-posttooluse.mjs
- language: mjs
- verdict: clean

## .skilled/hooks/classifier-injection-screen/claude/classifier-injection-screen-posttooluse.test.mjs
- language: mjs
- verdict: findings
| id | sev | line | rule (file § section) | finding | fix | behaviour-change |
|----|-----|------|-----------------------|---------|-----|------------------|
| b10-hooks-quality-screen-task-002 | P2 | 19 | test-quality-checklist.md § 4. TEST INDEPENDENCE AND RELIABILITY — "Missing cleanup or teardown for resources created during test setup." | `tempDir` and `stubJev` create `mkdtempSync` directories for every case (the fixture root, the stub `bin`, and the absent-config directory), and no test removes them. Each run leaves twelve `injection-screen-*` trees in the OS temp directory (a `bin` and a `cfg` directory per case). | Track the roots created by `tempDir` and remove them with `rmSync(..., { recursive: true, force: true })` in an `after` hook. | no |

## .skilled/hooks/classifier-injection-screen/devin/classifier-injection-screen-posttooluse.mjs
- language: mjs
- verdict: clean

## .skilled/hooks/classifier-injection-screen/devin/classifier-injection-screen-posttooluse.test.mjs
- language: mjs
- verdict: findings
| id | sev | line | rule (file § section) | finding | fix | behaviour-change |
|----|-----|------|-----------------------|---------|-----|------------------|
| b10-hooks-quality-screen-task-003 | P2 | 19 | test-quality-checklist.md § 4. TEST INDEPENDENCE AND RELIABILITY — "Missing cleanup or teardown for resources created during test setup." | `tempDir` and `stubJev` create `mkdtempSync` directories for every case, including the stub `bin` and the absent-config directory, and the suite never removes them. | Track the fixture roots and remove them in an `after` hook with `rmSync(..., { recursive: true, force: true })`. | no |

## .skilled/hooks/classifier-injection-screen/lib/classifier-injection-advisory.mjs
- language: mjs
- verdict: clean

## .skilled/hooks/classifier-injection-screen/lib/classifier-injection-advisory.test.mjs
- language: mjs
- verdict: clean

## .skilled/hooks/classifier-injection-screen/lib/classifier-screen-fetched-text.mjs
- language: mjs
- verdict: clean

## .skilled/hooks/classifier-injection-screen/lib/classifier-screen-fetched-text.test.mjs
- language: mjs
- verdict: clean

## .skilled/hooks/classifier-injection-screen/pi/classifier-injection-screen.test.ts
- language: ts
- verdict: findings
| id | sev | line | rule (file § section) | finding | fix | behaviour-change |
|----|-----|------|-----------------------|---------|-----|------------------|
| b10-hooks-quality-screen-task-004 | P2 | 15 | typescript/style-guide/formatting-imports-and-coexistence.md § 2. FORMATTING RULES — "Quotes: Single quotes for strings." | The file uses double-quoted string literals throughout the imports, the `ADVISORY` constant, the handler type, the fixture objects, and the assertions. | Convert string literals to single quotes, using double quotes only where escaping would otherwise be required. | no |
| b10-hooks-quality-screen-task-005 | P2 | 39 | test-quality-checklist.md § 4. TEST INDEPENDENCE AND RELIABILITY — "Tests that rely on ... external state that could change between runs." | The `afterEach` clears only `SYSTEM_INJECTION_SCREEN_DISABLED`. The factory also honors `SYSTEM_HOOKS_DISABLED`, `JEV_FEATURES`, `JEV_FEATURE_INJECTION_SCREEN`, and the persisted hook-flags file, so a developer or CI shell with `SYSTEM_HOOKS_DISABLED=1` makes the "appends the advisory" case fail because `injectionScreen` registers nothing. The node adapter tests explicitly delete every disable name for this reason. | Save and delete all hook/Jev disable names in `beforeEach`, restore them in `afterEach`, and point `HOOK_FLAGS_CONFIG` at a missing file. | no |

## .skilled/hooks/classifier-injection-screen/pi/classifier-injection-screen.ts
- language: ts
- verdict: findings
| id | sev | line | rule (file § section) | finding | fix | behaviour-change |
|----|-----|------|-----------------------|---------|-----|------------------|
| b10-hooks-quality-screen-task-006 | P2 | 15 | typescript/style-guide/formatting-imports-and-coexistence.md § 2. FORMATTING RULES — "Quotes: Single quotes for strings." | The file uses double-quoted literals for the package import, the hook-flags import, `FETCH_TOOL`, the option type keys, and every string comparison and callback return. | Convert string literals to single quotes, using double quotes only where escaping would otherwise be required. | no |

## .skilled/hooks/post-edit-quality/README.md
- language: md
- verdict: findings
| id | sev | line | rule (file § section) | finding | fix | behaviour-change |
|----|-----|------|-----------------------|---------|-----|------------------|
| b10-hooks-quality-screen-task-007 | P1 | 66 | README.md § 3. PER-RUNTIME DELIVERY — "Claude ... Plain stdout (transcript/verbose view; not model context in normal use)." and "Devin ... Plain stdout." | Both adapters deliver findings through the PostToolUse envelope, not plain stdout: `claude/claude-posttooluse.cjs:150-156` writes `hookSpecificOutput: { hookEventName: 'PostToolUse', additionalContext: advisory }`, and `devin/post-edit-quality.cjs:149-155` writes the same shape. Only the Codex adapter prints plain stdout. The table tells operators Claude/Devin findings are transcript-only when the model actually receives them. | Change the Claude and Devin delivery cells to "PostToolUse `hookSpecificOutput.additionalContext`" and keep plain stdout for Codex. | no |
| b10-hooks-quality-screen-task-008 | P2 | 127 | README.md § 7. BOUNDARIES AND FLOW — "Adapters import `../lib/` and `../../shared/hook-flags.cjs` (or `hook-flags.mjs` for Pi) only." | The three CommonJS adapters also import `../../shared/hook-adapter-shared.cjs` (`claude/claude-posttooluse.cjs:34`, `codex/post-edit-quality.cjs:23`, `devin/post-edit-quality.cjs:24`), so the boundary list omits a shared dependency that every one of them uses to read stdin. | Add `../../shared/hook-adapter-shared.cjs` to the CommonJS adapter import list, or say the adapters may import the shared stdin/flags helpers. | no |

## .skilled/hooks/post-edit-quality/claude/claude-posttooluse.cjs
- language: cjs
- verdict: clean

## .skilled/hooks/post-edit-quality/codex/post-edit-quality.cjs
- language: cjs
- verdict: findings
| id | sev | line | rule (file § section) | finding | fix | behaviour-change |
|----|-----|------|-----------------------|---------|-----|------------------|
| b10-hooks-quality-screen-task-009 | P2 | 60 | code-quality-checklist.md § 4. BOUNDARY CONDITIONS — "Null/undefined handling and optional chaining misuse." | The `const candidate =` OR-chain over `toolInput.file_path`, `toolInput.filePath` and `toolInput.path` selects the first truthy value, not the first string. A truthy non-string `file_path` (for example `123` or `{}`) masks a valid `filePath` or `path`, and `filePathsFrom` then falls through to `patchPaths` with the same OR-chain over `command`, `input` and `patch`, which also stops at a truthy non-string and returns `[]`, so no checker runs for the edited file. The task-dispatch adapters already use a first-non-blank-string helper for the same alias problem. | Add a first-non-blank-string helper and use it for `file_path`/`filePath`/`path` and for `command`/`input`/`patch`, so a malformed earlier field cannot mask a later valid one. | yes |

## .skilled/hooks/post-edit-quality/devin/post-edit-quality.cjs
- language: cjs
- verdict: findings
| id | sev | line | rule (file § section) | finding | fix | behaviour-change |
|----|-----|------|-----------------------|---------|-----|------------------|
| b10-hooks-quality-screen-task-010 | P2 | 43 | code-quality-checklist.md § 4. BOUNDARY CONDITIONS — "Null/undefined handling and optional chaining misuse." | `filePathFrom` uses an OR-chain over `toolInput.file_path`, `toolInput.filePath` and `toolInput.path` and then rejects a non-string. A truthy non-string `file_path` masks a valid `filePath` or `path`, the function returns `undefined`, and the adapter exits without checking the edit. | Use a first-non-blank-string helper for the three aliases, as the task-dispatch adapters do. | yes |

## .skilled/hooks/post-edit-quality/devin/post-edit-quality.test.cjs
- language: cjs
- verdict: findings
| id | sev | line | rule (file § section) | finding | fix | behaviour-change |
|----|-----|------|-----------------------|---------|-----|------------------|
| b10-hooks-quality-screen-task-011 | P2 | 1 | javascript/style-guide.md § 2. FILE HEADER FORMAT — "All JavaScript files MUST begin with a module header identifying the module, in the same divider form the TypeScript style guide uses, so a mixed tree reads as one convention." | The file starts with `// Tests for the Devin ...` and carries no `MODULE:` or `COMPONENT:` marker, so the verifier reports `EXACT-HEADER` at line 1. | Add the standard `MODULE:` divider header naming the Devin post-edit-quality tests. | no |

## .skilled/hooks/post-edit-quality/lib/post-edit-router.cjs
- language: cjs
- verdict: findings
| id | sev | line | rule (file § section) | finding | fix | behaviour-change |
|----|-----|------|-----------------------|---------|-----|------------------|
| b10-hooks-quality-screen-task-012 | P1 | 85 | security-checklist.md § 4. SECRETS AND PRIVACY — "Sensitive logs exposing PII or operational secrets." | `SECRET_PATTERN` requires a keyword followed by `:` or `=` and an unbroken 8+ character value. `Authorization: Bearer <token>` and bare `Bearer <token>` do not match because the value starts with the six-character scheme and a space, so the token is left intact. Observed: `redactSecrets('authorization: Bearer eyJhbGciOiJIUzI1NiJ9.payload.sig')` returns the input unchanged, while `token: abcdefgh` is redacted. The README §2 line 56 says bearer and authorization assignments are redacted, and checker stdout is printed or logged through `truncateAndRedact`. | Add a header branch that redacts the `authorization` keyword, an optional `bearer` or `basic` scheme, and the following value, plus a bare `bearer` scheme value, or redact the scheme plus value together. | yes |

## .skilled/hooks/post-edit-quality/pi/post-edit-quality.ts
- language: ts
- verdict: findings
| id | sev | line | rule (file § section) | finding | fix | behaviour-change |
|----|-----|------|-----------------------|---------|-----|------------------|
| b10-hooks-quality-screen-task-013 | P2 | 5 | typescript/style-guide/formatting-imports-and-coexistence.md § 2. FORMATTING RULES — "Quotes: Single quotes for strings." | The file uses double-quoted literals for the package import, the Node builtins, the hook-flags import, the fallback label, and the tool-name comparisons. | Convert string literals to single quotes, using double quotes only where escaping would otherwise be required. | no |

## .skilled/hooks/task-dispatch/README.md
- language: md
- verdict: findings
| id | sev | line | rule (file § section) | finding | fix | behaviour-change |
|----|-----|------|-----------------------|---------|-----|------------------|
| b10-hooks-quality-screen-task-014 | P1 | 38 | README.md § 2. WHAT IT DOES — "Every non-allow decision also appends a `[system-deep-loop-guard] WARN:` line to the shared bounded log ..." and "a mismatch warning is still recorded and Check 2 still runs." | On a reject, `evaluateDispatch` returns at `lib/dispatch-guard.cjs:547-549` (mode mismatch under the reject env) or `:567-569` (loop count under the reject-loop env) before pushing `detail` into `warnings`. The Claude and Devin adapters append only `result.warnings` (`claude/task-dispatch-guard.cjs:75-76`, `devin/task-dispatch-guard.cjs:76`), and the OpenCode plugin does the same, so a deny writes no WARN line; on a Check 1 reject, Check 2 never runs either. Only the Pi adapter logs `result.detail` on reject (`pi/task-dispatch-guard.ts:61`). | Push the reject detail into `warnings` or a dedicated audit array before returning, or append `result.detail` whenever `decision === 'reject'` in each adapter; then correct the line 24 sentence to say Check 2 runs only when Check 1 does not reject. | yes |

## .skilled/hooks/task-dispatch/claude/fable-subagent-guard.mjs
- language: mjs
- verdict: findings
| id | sev | line | rule (file § section) | finding | fix | behaviour-change |
|----|-----|------|-----------------------|---------|-----|------------------|
| b10-hooks-quality-screen-task-015 | P2 | 1 | javascript/style-guide.md § 2. FILE HEADER FORMAT — "All JavaScript files MUST begin with a module header identifying the module, in the same divider form the TypeScript style guide uses, so a mixed tree reads as one convention." | The top comment is `// FABLE SUBAGENT GUARD (Claude PreToolUse, matcher: Task/Agent)` between dividers and carries no `MODULE:` or `COMPONENT:` marker, so the verifier reports `EXACT-HEADER` at line 1. | Add `// MODULE: Fable Subagent Guard` between the existing dividers, or replace the box with the standard `MODULE:` divider. | no |

## .skilled/hooks/task-dispatch/claude/task-dispatch-guard.cjs
- language: cjs
- verdict: clean

## .skilled/hooks/task-dispatch/cursor/task-dispatch-guard.mjs
- language: mjs
- verdict: clean

## .skilled/hooks/task-dispatch/devin/task-dispatch-guard.cjs
- language: cjs
- verdict: clean

## .skilled/hooks/task-dispatch/lib/dispatch-guard.cjs
- language: cjs
- verdict: findings
| id | sev | line | rule (file § section) | finding | fix | behaviour-change |
|----|-----|------|-----------------------|---------|-----|------------------|
| b10-hooks-quality-screen-task-016 | P1 | 138 | security-checklist.md § 2. INPUT/OUTPUT SAFETY — "Path traversal from unchecked path input (`../`)." | `resolveCommandConfigPath` rejects only a literal `..` and then accepts any absolute path, and `isCommandDrivenIteration` checks only that the file has a string `mode` and a finite `maxIterations`; it never requires the config to live under the project or to match the resolved target. Observed: a `Config:` path in an unrelated temp directory with `{"mode":"review","maxIterations":10}` makes `isCommandDrivenIteration` return true. A prompt can therefore cite an existing deep-review config for a deep-research dispatch, or a file it created, and avoid the non-command-driven count entirely. | Resolve the config with `realpathSync`, require it to stay under `projectDir` (or the dispatch's own spec folder), and require `config.mode` to match the target agent's registered workflow mode before treating the dispatch as command-driven. | yes |
| b10-hooks-quality-screen-task-017 | P1 | 251 | security-checklist.md § 6. CONCURRENCY AND RACE CONDITIONS — "Read-modify-write on shared state without lock/transaction." | `recordLoopDispatch` reads the session file, increments `entry.count`, and writes the whole file. Two hook processes for concurrent Task calls can both read count N and both write N+1, losing one hand-off, while `writeLoopStateAtomic` only makes each file write atomic, not the counter update. The Claude regression test spawns hook processes sequentially, so cross-process concurrency is not covered. | Serialize the read-modify-write with a state lock (including stale-lock handling), or append one immutable dispatch event per call and derive the count from the log. | yes |

## .skilled/hooks/task-dispatch/pi/task-dispatch-guard.ts
- language: ts
- verdict: findings
| id | sev | line | rule (file § section) | finding | fix | behaviour-change |
|----|-----|------|-----------------------|---------|-----|------------------|
| b10-hooks-quality-screen-task-018 | P2 | 7 | typescript/style-guide/formatting-imports-and-coexistence.md § 2. FORMATTING RULES — "Quotes: Single quotes for strings." | The file uses double-quoted literals for the package import, the hook-flags import, the fallback module specifier, the string comparisons, and the joined advisory. | Convert string literals to single quotes, using double quotes only where escaping would otherwise be required. | no |

TOTAL: P0=0 P1=5 P2=13 files=25

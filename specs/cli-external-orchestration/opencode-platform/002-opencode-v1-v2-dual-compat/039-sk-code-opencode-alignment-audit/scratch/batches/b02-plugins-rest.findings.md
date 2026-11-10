# Batch b02-plugins-rest findings

VERIFIER: `.opencode/plugins/lib/tool-identity.js:1 [JS-USE-STRICT]` is rejected. `.opencode/package.json` declares `"type": "module"`, and the file uses `import`/`export` at lines 5 and 13, so it is an OpenCode plugin ESM path. `javascript-checklist.md` § 2 and `javascript/style-guide.md` § 2 exempt plugin ESM files from `'use strict'`; the verifier's `.js` check does not model that exemption. `.opencode/plugins/lib/v2-bridge.js:1 [SECTIONS-MISSING]` is confirmed and is finding b02-plugins-rest-004.

## .opencode/plugins/README.md
- language: md
- verdict: findings
| id | sev | line | rule (file § section) | finding | fix | behaviour-change |
|----|-----|------|-----------------------|---------|-----|------------------|
| b02-plugins-rest-001 | P1 | 179 | review-core.md § 6. BASELINE CHECK FAMILIES — "Correctness minimums: regression risk, contract safety, spec mismatch, destructive side effects, and boundary handling." | §8 says "caches, pending-event buffers and workspace logs are all bounded", but `workspaceSurfaceCache` (`system-skill-advisor.js:697`) is a module-level `Map` that only gains entries; neither that file nor the bridge clears or evicts it. The claim is therefore false for at least one cache. | Bound `workspaceSurfaceCache` (cap it and evict the oldest entry, or clear it in `resetRuntimeState`) so the §8 sentence is true, or narrow the sentence to the caches that do have limits. | no |

## .opencode/plugins/classifier-injection-screen.js
- language: js
- verdict: clean

## .opencode/plugins/cli-dispatch-audit.js
- language: js
- verdict: clean

## .opencode/plugins/codex-hooks-watchdog.js
- language: js
- verdict: clean

## .opencode/plugins/lib/classifier-injection-screen-core.js
- language: js
- verdict: clean

## .opencode/plugins/lib/completion-sentinel-core.js
- language: js
- verdict: clean

## .opencode/plugins/lib/opencode-message-identity.js
- language: js
- verdict: clean

## .opencode/plugins/lib/sk-code-post-edit-quality-core.js
- language: js
- verdict: clean

## .opencode/plugins/lib/skill-advisor-render.js
- language: js
- verdict: findings
| id | sev | line | rule (file § section) | finding | fix | behaviour-change |
|----|-----|------|-----------------------|---------|-----|------------------|
| b02-plugins-rest-002 | P2 | 80 | javascript/style-guide.md § 7. COMMENTING RULES (Function Purpose Comments) — "Single line above function describing intent." | The comment block at lines 80-84 says it renders "one additive, human-legible line" and "Returns null when no compiled decision is served", which describes `renderCompiledRouteSummaryLine`, but it sits above `revealCompiledRouteSummaryTargets` (line 85), a function that returns a filtered string array. A reader following the comment lands on the wrong function. | Move the block to line 104, immediately above `renderCompiledRouteSummaryLine`, and keep `revealCompiledRouteSummaryTargets` with its own one-line purpose comment. | no |
| b02-plugins-rest-003 | P2 | 85 | javascript/style-guide.md § 7. COMMENTING RULES (JSDoc Comments) — "Required for all exported functions." | `revealCompiledRouteSummaryTargets` (line 85), `compiledRouteSummaryTargetDigest` (line 100) and `renderCompiledRouteSummaryLine` (line 104) are exported without JSDoc; only `renderPluginFallbackDirective` documents its parameters and return. | Add JSDoc to all three exports naming the summary shape, the returned array, digest or line, and the null return when no compiled decision is served. | no |

## .opencode/plugins/lib/tool-identity.js
- language: js
- verdict: clean

## .opencode/plugins/lib/v2-bridge.js
- language: js
- verdict: findings
| id | sev | line | rule (file § section) | finding | fix | behaviour-change |
|----|-----|------|-----------------------|---------|-----|------------------|
| b02-plugins-rest-004 | P2 | 1 | javascript/style-guide.md § 4. SECTION ORGANIZATION — "Large files are organized using numbered section dividers." | The file is 547 lines and has no numbered dividers, so the imports, event and tool mapping tables, client adapters, registration code and export statement are one undivided block; this is the verifier's `[SECTIONS-MISSING]` error. | Add `// ─── 1. IMPORTS`, `2. CONSTANTS`, `3. HELPERS`, `4. CORE LOGIC` and `5. EXPORTS` dividers in the standard order at the existing boundaries. | no |

## .opencode/plugins/mcp-route-guard.js
- language: js
- verdict: findings
| id | sev | line | rule (file § section) | finding | fix | behaviour-change |
|----|-----|------|-----------------------|---------|-----|------------------|
| b02-plugins-rest-005 | P2 | 57 | code-quality-checklist.md § 7. KISS / DRY ENFORCEMENT (DRY Checks) — "Repeated validation/parsing blocks that can share one source." | `appendGuardLog` repeats the same rotate-at-max block (`statSync`, `copyFileSync` to `.1`, `truncateSync`, `appendFileSync`) that is copied into `sk-code-post-edit-quality.js:57-73`, `system-dist-freshness-guard.js:104-120` and `session-cleanup.js:73-91`; the four copies already differ in rotation depth and rotation errors are silently swallowed in each. | Extract one bounded-append helper in `lib/` that takes the path, max bytes and rotation depth, and use it from all four plugins so the rotation policy has one implementation. | no |

## .opencode/plugins/session-cleanup.js
- language: js
- verdict: findings
| id | sev | line | rule (file § section) | finding | fix | behaviour-change |
|----|-----|------|-----------------------|---------|-----|------------------|
| b02-plugins-rest-006 | P2 | 139 | code-quality-checklist.md § 7. KISS / DRY ENFORCEMENT (DRY Checks) — "Copy-paste branches with minor name changes." | `runScript` (lines 139-162) and `runProcess` (lines 164-187) are identical apart from the first line, `runSync('bash', [scriptPath, ...args], ...)` versus `runSync(command, args, ...)`; the launch-error handling, timeout, maxBuffer and result-status reporting are duplicated verbatim in both. | Keep one runner that accepts `(command, args, operation, env)` and make `runScript(scriptPath, operation, args, env)` delegate with `'bash'` and `[scriptPath, ...args]`. | no |

## .opencode/plugins/session-relaunch.js
- language: js
- verdict: findings
| id | sev | line | rule (file § section) | finding | fix | behaviour-change |
|----|-----|------|-----------------------|---------|-----|------------------|
| b02-plugins-rest-007 | P2 | 196 | code-quality-checklist.md § 3. PERFORMANCE AND SCALING — "Expensive work in hot loops without memoization/cache." | `isEnabled()` reads the hook-flags file with `hookFlags.loadConfigFile(hookFlags.configPath())` on every `event` and every `experimental.chat.system.transform` call. `message.part.updated` fires for each streamed part, so a synchronous `readFileSync` of `.skilled/hooks/hook-flags.env` runs per part; `queueNudge` at line 118 reads the same file again for every assistant message. `hook-flags.cjs` already caches this file in `fileConfig()` for callers of `isHookEnabled(concern)`. | Call `hookFlags.isHookEnabled(CONCERN)` (which uses the resolver's cached config) or load the config once per plugin instance, and reuse that value in `queueNudge`. | yes |

## .opencode/plugins/sk-code-post-edit-quality.js
- language: js
- verdict: clean

## .opencode/plugins/sk-git-message-gate.js
- language: js
- verdict: clean

## .opencode/plugins/sk-git-preflight-advisory.js
- language: js
- verdict: clean

## .opencode/plugins/system-completion-sentinel.js
- language: js
- verdict: clean

## .opencode/plugins/system-deep-loop-guard.js
- language: js
- verdict: findings
| id | sev | line | rule (file § section) | finding | fix | behaviour-change |
|----|-----|------|-----------------------|---------|-----|------------------|
| b02-plugins-rest-008 | P2 | 44 | universal-checklist.md § 2. P0 - HARD BLOCKERS (No Ephemeral-Artifact Pointers in Comments) — "No spec/packet/phase numbers, T###/REQ-###/CHK-###, feature-catalog, ADR, or ticket ids in comments." | The hard-limits block says runtime identity "remains host/FIX-5 territory"; `FIX-5` is an ephemeral review finding id that will dangle once the packet is archived and says nothing to a future reader about who owns identity. | Replace `host/FIX-5` with the durable ownership statement, for example "remains the host's responsibility". | no |

## .opencode/plugins/system-dist-freshness-guard.js
- language: js
- verdict: findings
| id | sev | line | rule (file § section) | finding | fix | behaviour-change |
|----|-----|------|-----------------------|---------|-----|------------------|
| b02-plugins-rest-009 | P2 | 50 | code-quality-checklist.md § 7. KISS / DRY ENFORCEMENT (DRY Checks) — "Duplicated constants/rules across modules." | `MUTATING_TOOLS` is re-declared here with the same six tool names that `lib/sk-code-post-edit-quality-core.js:22` already exports; that core's comment says the set is shared because both plugins need the identical before-args signal, but this file does not import it. A new mutating tool name has to be added in two places. | Import `MUTATING_TOOLS` from `./lib/sk-code-post-edit-quality-core.js`, or move the set to a shared constants module imported by both plugins. | no |

## .opencode/plugins/system-skill-advisor.js
- language: js
- verdict: findings
| id | sev | line | rule (file § section) | finding | fix | behaviour-change |
|----|-----|------|-----------------------|---------|-----|------------------|
| b02-plugins-rest-010 | P2 | 952 | code-quality-checklist.md § 3. PERFORMANCE AND SCALING — "Unbounded collections and memory growth risks." | `state.directiveEpochBySession` gains an entry for every session in `advanceOpenCodeDirectiveBoundary` (lines 421-422), but the `session.deleted` branch only calls `advanceOpenCodeDirectiveBoundary` and `clearTransformDedupSession`; it never removes the epoch entry. The map is cleared only by `resetRuntimeState` on `server.instance.disposed`/`global.disposed`, and OpenCode 2 delivers neither event, so a long-lived host accumulates one entry per deleted session. | Delete `state.directiveEpochBySession.delete(identity.sessionID)` in the `session.deleted` branch, or bound the map the way `directiveDedupBySession` is bounded. | no |
| b02-plugins-rest-011 | P2 | 965 | code-quality-checklist.md § 6. MAINTAINABILITY SIGNALS — "Error messages that lack actionable context for debugging (missing what failed and what to try)." | `isHookEnabled('skill-advisor')` honors `SYSTEM_HOOKS_DISABLED` and the canonical `SYSTEM_SKILL_ADVISOR_DISABLED`, but `disabledEnvName()` (lines 255-271) checks only `SYSTEM_SKILL_ADVISOR_HOOK_DISABLED`, `SYSTEM_SKILL_ADVISOR_PLUGIN_DISABLED` and their `SPECKIT_` aliases. With either documented switch set, `disabledReason` becomes `config_enabled_false`, so the status tool reports the wrong cause. | Resolve the matched switch from `hook-flags.cjs` (master, canonical concern flag, then aliases) before falling back to `config_enabled_false`; use that result at both line 965 and line 1179. | no |

## .opencode/plugins/system-spec-gate.js
- language: js
- verdict: findings
| id | sev | line | rule (file § section) | finding | fix | behaviour-change |
|----|-----|------|-----------------------|---------|-----|------------------|
| b02-plugins-rest-012 | P2 | 138 | shared/universal-patterns/naming-and-commenting.md § 2. NAMING PRINCIPLES (Consistency Rule) — "Same concept = same name across the entire codebase." | The comment at lines 61-66 says classify and enforce must resolve a missing sessionID to the same core token, and `sessionIdFrom` uses `guardCore.UNKNOWN_SESSION_ID` (`'__unknown-session__'`). `sessionIdFromEvent` instead falls back to `'__global__'` at line 138, so a `session.deleted` or `session.resumed` event without an id advances or evicts state under a different key than classify/enforce wrote. | Use `guardCore.UNKNOWN_SESSION_ID` as the fallback at line 138 so every path keys the no-session case identically. | yes |

## .opencode/plugins/system-speckit-completion.js
- language: js
- verdict: clean

TOTAL: P0=0 P1=1 P2=11 files=23

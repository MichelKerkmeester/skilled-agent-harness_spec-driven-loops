# Batch b09-hooks-dispatch findings

VERIFIER: all eleven listed lines are confirmed; none is rejected. `dispatch-audit.mjs:1` EXACT-HEADER maps to b09-hooks-dispatch-008, `dispatch-audit.mjs:1` SECTIONS-MISSING and `:25` SECTIONS-DIVIDER-SHAPE map to -009, `dispatch-audit.test.mjs:1` EXACT-HEADER maps to -010, `dispatch-rule-checks.mjs:1` EXACT-HEADER maps to -013 and its SECTIONS-MISSING plus `:30` divider-shape map to -014, `dispatch-rule-checks.test.mjs:1` EXACT-HEADER maps to -015, `directive-dedup.test.ts:1` and `dispatch-preflight-lint.test.ts:1` EXACT-HEADER map to -017 and -020, and `dispatch-preflight-lint.ts:1` SECTIONS-MISSING maps to -022. The verifier is silent on the P1 behaviour findings below because it only checks headers, sections and folders.

## .skilled/hooks/dispatch/README.md
- language: md
- verdict: findings
| id | sev | line | rule (file § section) | finding | fix | behaviour-change |
|----|-----|------|-----------------------|---------|-----|------------------|
| b09-hooks-dispatch-001 | P1 | 40, 104 | review-core.md § 6. BASELINE CHECK FAMILIES — "Correctness minimums: regression risk, contract safety, spec mismatch, destructive side effects, and boundary handling." | § 2 says "The five checks currently registered in `lib/dispatch-rule-checks.mjs` (`CHECKS`)" and lists five rows (44-48); § 5 repeats that `CHECKS` "holds the five pure check functions". `KNOWN_CHECKS` exports 28 checks, and the table omits `explicit-model-required`, `v2-slash-prompt-route`, the `pi-*`, `hermes-*`, `jev-*` and `command-v-*` families. The `stdin-redirect-required` row also still says only "An `opencode run` command" although the check now covers every headless shape. | Replace "five" with "28" (or "the checks in `CHECKS`") and regenerate the table from `KNOWN_CHECKS`, including the headless shapes the stdin check covers. | no |
| b09-hooks-dispatch-002 | P1 | 64, 71, 93 | review-core.md § 6. BASELINE CHECK FAMILIES — "Correctness minimums: regression risk, contract safety, spec mismatch, destructive side effects, and boundary handling." | § 3 says "Cursor and OpenCode carry audit only", the Cursor row says "Audit only (no preflight)", and the § 4 tree lists only `cursor/post-tool-use.mjs`. `cursor/dispatch-preflight-lint.mjs` exists and is registered in `.cursor/hooks.json:82` (`preToolUse`, matcher `Shell`), and `.skilled/plugins/cli-dispatch-audit.js:71` implements `tool.execute.before` for OpenCode, so both runtimes now preflight. The delivery matrix would lead an operator to skip both preflights when diagnosing a blocked dispatch. | Add the Cursor preflight to the § 3 row, prose and § 4 tree, and state that OpenCode preflights in-process via `tool.execute.before`; narrow the audit-only claim to the post-execution halves. | no |
| b09-hooks-dispatch-003 | P2 | 16 | review-core.md § 6. BASELINE CHECK FAMILIES — "Correctness minimums: regression risk, contract safety, spec mismatch, destructive side effects, and boundary handling." | The overview gives `codex exec -p` as a dispatch example, but `lib/dispatch-audit.mjs:37` says "Codex has no print flag: `exec` IS its headless subcommand" and the registry matches only `codex exec`. The same stale example is in `codex/dispatch-audit-posttooluse.mjs:9` and `devin/dispatch-audit-posttooluse.mjs:10`. | Change the example to `codex exec` in the README and both adapter headers. | no |

## .skilled/hooks/dispatch/claude/dispatch-audit-posttooluse.mjs
- language: mjs
- verdict: clean

## .skilled/hooks/dispatch/claude/dispatch-preflight-lint.mjs
- language: mjs
- verdict: findings
| id | sev | line | rule (file § section) | finding | fix | behaviour-change |
|----|-----|------|-----------------------|---------|-----|------------------|
| b09-hooks-dispatch-004 | P2 | 26 | javascript/style-guide.md § 7. COMMENTING RULES — "Focus on WHY, not WHAT: Explain intent, constraints, reasoning." | The block at 26-33 describes a "Dispatch-shape registry: command pattern → the skill" with `skill`/`packetPath` fields "in this file", but the file imports `resolveDispatchPacket` from `../lib/dispatch-audit.mjs`; the registry is `DISPATCH_SHAPES` there. The comment explains a structure that is not present and says "extend by adding an entry there" without naming the owning file. | Replace the block with one line: the shapes live in `lib/dispatch-audit.mjs` `DISPATCH_SHAPES`; add new `cli-*` entries there. | no |

## .skilled/hooks/dispatch/codex/codex-shell-tool.test.mjs
- language: mjs
- verdict: findings
| id | sev | line | rule (file § section) | finding | fix | behaviour-change |
|----|-----|------|-----------------------|---------|-----|------------------|
| b09-hooks-dispatch-005 | P2 | 23 | test-quality-checklist.md § 4. TEST INDEPENDENCE AND RELIABILITY — "Is shared state properly isolated or reset between test functions?" | `hookEnv()` clears `SYSTEM_HOOKS_DISABLED`, `MK_HOOKS_DISABLED` and `CLI_DISPATCH_AUDIT_DISABLED` but not `SYSTEM_DISPATCH_DISABLED` or `SYSTEM_DISPATCH_GUARD_DISABLED`, which the adapters read through `isHookEnabled('dispatch')` and `isHookEnabled('dispatch-guard')` (`codex/dispatch-audit-posttooluse.mjs:50`, `codex/dispatch-preflight-lint.mjs:44`) and README § 6 documents. With either exported, the lint case at line 46 sees no `no-bare-agent-general` advisory and fails, so the suite's verdict depends on the developer's shell. | Add `SYSTEM_DISPATCH_DISABLED`, `SYSTEM_DISPATCH_GUARD_DISABLED` and `MK_DISPATCH_DISABLED` to the delete loop. | no |

## .skilled/hooks/dispatch/codex/dispatch-audit-posttooluse.mjs
- language: mjs
- verdict: clean

## .skilled/hooks/dispatch/codex/dispatch-preflight-lint.mjs
- language: mjs
- verdict: clean

## .skilled/hooks/dispatch/cursor/dispatch-preflight-lint.mjs
- language: mjs
- verdict: clean

## .skilled/hooks/dispatch/devin/dispatch-audit-posttooluse.mjs
- language: mjs
- verdict: clean

## .skilled/hooks/dispatch/devin/dispatch-preflight-lint.mjs
- language: mjs
- verdict: clean

## .skilled/hooks/dispatch/lib/dispatch-audit.mjs
- language: mjs
- verdict: findings
| id | sev | line | rule (file § section) | finding | fix | behaviour-change |
|----|-----|------|-----------------------|---------|-----|------------------|
| b09-hooks-dispatch-006 | P1 | 271 | code-quality-checklist.md § 6. MAINTAINABILITY SIGNALS — "Repeated logic with inconsistent behavior." | `hasDispatchText` requires a `-p`/`--print` after `codex exec`, but `directExecutor` (line 217) and `DISPATCH_SHAPES` treat `codex exec` alone as the dispatch, and line 37 says codex has no print flag. `inspectDispatch('echo "$(codex exec task)"')` therefore returns `{kind:'none'}` while the same shape with `devin -p` returns `{kind:'ambiguous'}`; the Pi authorization gate (`pi/dispatch-preflight-lint.ts:185`) allows a wrapped codex dispatch it denies for every sibling executor. | Drop the print-flag requirement from the codex branch so it matches `codex exec` the way `directExecutor` does. | yes |
| b09-hooks-dispatch-007 | P1 | 303 | review-core.md § 6. BASELINE CHECK FAMILIES — "Correctness minimums: regression risk, contract safety, spec mismatch, destructive side effects, and boundary handling." | `inspectDispatch` tokenizes the raw text, while `resolveDispatchPacket` first runs `stripHeredocBodies` (line 431) so a heredoc that only writes a dispatch script is not a dispatch; the test `heredoc writing a script` asserts `null`. Pi calls `inspectDispatch` directly (`pi/dispatch-preflight-lint.ts:235`): for `cat > run.sh <<'EOF'\ndevin -p task\nEOF`, the `<<` marks the parse unsupported and the body yields one direct executor, so `inspectDispatch` returns `{kind:'ambiguous'}` and `shouldDenyPiDispatch` (line 185) blocks writing the file as an unauthorized dispatch. The two entry points disagree on the same command. | Apply `stripHeredocBodies` before `tokenizeShell` at the top of `inspectDispatch`, so the classifier used by Pi and the audit applies the same heredoc rule as `resolveDispatchPacket`. | yes |
| b09-hooks-dispatch-008 | P2 | 1 | javascript/style-guide.md § 2. FILE HEADER FORMAT — "All JavaScript files MUST begin with a module header identifying the module, in the same divider form the TypeScript style guide uses." | The file starts with a prose comment and has no `MODULE:` or `COMPONENT:` marker, so the verifier reports `EXACT-HEADER` at line 1. | Add `// MODULE: Dispatch Audit Core` inside a 67-character `MODULE:` divider above the existing prose block. | no |
| b09-hooks-dispatch-009 | P2 | 25, 522, 576, 673, 709 | javascript/style-guide.md § 4. SECTION ORGANIZATION — "Large files are organized using numbered section dividers." | The 749-line file has no numbered dividers; it uses unnumbered one-line labels such as `// ── Dispatch-shape registry …` at 25, 522, 576, 673 and 709, so the verifier reports `SECTIONS-MISSING` and `SECTIONS-DIVIDER-SHAPE` at line 25. | Replace the labels with numbered Format A dividers (`1. IMPORTS`, `2. CONSTANTS`, `3. HELPERS`, `4. CORE LOGIC`, `5. EXPORTS`), keeping the existing grouping. | no |

## .skilled/hooks/dispatch/lib/dispatch-audit.test.mjs
- language: mjs
- verdict: findings
| id | sev | line | rule (file § section) | finding | fix | behaviour-change |
|----|-----|------|-----------------------|---------|-----|------------------|
| b09-hooks-dispatch-010 | P2 | 1 | javascript/style-guide.md § 2. FILE HEADER FORMAT — "All JavaScript files MUST begin with a module header identifying the module, in the same divider form the TypeScript style guide uses." | The file starts with a run instruction comment and has no `MODULE:` or `COMPONENT:` marker, so the verifier reports `EXACT-HEADER` at line 1. | Add `// MODULE: Dispatch Audit Core Tests` inside a 67-character `MODULE:` divider. | no |
| b09-hooks-dispatch-011 | P2 | 1 | review-core.md § 6. BASELINE CHECK FAMILIES — "Correctness minimums: regression risk, contract safety, spec mismatch, destructive side effects, and boundary handling." | The header tells the reader to run `npx vitest run <this file>`, while README § 8 (line 154) says vitest lives under `.skilled/node_modules`, "so `npx vitest` run from the root does not find it and fetches or reuses a different copy", and gives the pinned `.skilled/node_modules/.bin/vitest` command. Following the test's own instruction runs a different vitest than the suite documents. | Change the comment to `.skilled/node_modules/.bin/vitest run .skilled/hooks/dispatch/lib/dispatch-audit.test.mjs`, or point at README § 8. | no |

## .skilled/hooks/dispatch/lib/dispatch-rule-checks.mjs
- language: mjs
- verdict: findings
| id | sev | line | rule (file § section) | finding | fix | behaviour-change |
|----|-----|------|-----------------------|---------|-----|------------------|
| b09-hooks-dispatch-012 | P1 | 267 | review-core.md § 6. BASELINE CHECK FAMILIES — "Correctness minimums: regression risk, contract safety, spec mismatch, destructive side effects, and boundary handling." | `non-interactive-permission-mode-risk` only tests `\bclaude\s+-p\b` or `\bclaude\s+--print\b`, so `claude --model sonnet -p "x"` returns satisfied (`true`) and the packet's warn rule never fires. The command is still recognized as a dispatch: `inspectDispatch`/`resolveDispatchPacket` return `cli-claude-code` because the tokenizer sees the `-p`, so the guard evaluates the claude rules and this one silently passes a non-interactive run with no permission bypass. | Allow intervening flags, mirroring the sibling shapes, so the test accepts `claude` followed by any non-separator characters and then `-p` or `--print`. | yes |
| b09-hooks-dispatch-013 | P2 | 1 | javascript/style-guide.md § 2. FILE HEADER FORMAT — "All JavaScript files MUST begin with a module header identifying the module, in the same divider form the TypeScript style guide uses." | The file starts with a prose comment and has no `MODULE:` or `COMPONENT:` marker, so the verifier reports `EXACT-HEADER` at line 1. | Add `// MODULE: Dispatch Hard-Rule Engine` inside a 67-character `MODULE:` divider. | no |
| b09-hooks-dispatch-014 | P2 | 30 | javascript/style-guide.md § 4. SECTION ORGANIZATION — "Large files are organized using numbered section dividers." | The 341-line file has no numbered dividers; it uses one unnumbered label, `// ── Check functions …`, at line 30, so the verifier reports `SECTIONS-MISSING` and `SECTIONS-DIVIDER-SHAPE`. | Replace the label with numbered Format A dividers (`1. IMPORTS`, `2. CONSTANTS`, `3. HELPERS`, `4. CORE LOGIC`, `5. EXPORTS`), keeping the existing grouping. | no |

## .skilled/hooks/dispatch/lib/dispatch-rule-checks.test.mjs
- language: mjs
- verdict: findings
| id | sev | line | rule (file § section) | finding | fix | behaviour-change |
|----|-----|------|-----------------------|---------|-----|------------------|
| b09-hooks-dispatch-015 | P2 | 1 | javascript/style-guide.md § 2. FILE HEADER FORMAT — "All JavaScript files MUST begin with a module header identifying the module, in the same divider form the TypeScript style guide uses." | The file starts with a run instruction comment and has no `MODULE:` or `COMPONENT:` marker, so the verifier reports `EXACT-HEADER` at line 1. | Add `// MODULE: Dispatch Hard-Rule Engine Tests` inside a 67-character `MODULE:` divider. | no |
| b09-hooks-dispatch-016 | P2 | 895 | javascript/style-guide.md § 6. FORMATTING RULES — "Indentation: Size: 2 spaces." | The `for (const [name, md] of packets)` body opens and then places `const rules = readHardRules(md);` on the same line after four spaces, unlike every sibling loop in the suite. | Split the body onto the next line at two-space indentation. | no |

## .skilled/hooks/dispatch/lib/opencode-version-corpus.json
- language: json
- verdict: clean

## .skilled/hooks/dispatch/lib/opencode-version.mjs
- language: mjs
- verdict: clean

## .skilled/hooks/dispatch/pi/directive-dedup.test.ts
- language: ts
- verdict: findings
| id | sev | line | rule (file § section) | finding | fix | behaviour-change |
|----|-----|------|-----------------------|---------|-----|------------------|
| b09-hooks-dispatch-017 | P2 | 1 | typescript/style-guide/overview-strict-and-naming.md § 2. FILE HEADER FORMAT — "All TypeScript files MUST begin with a module header block identifying the module." | The file starts with imports and has no `MODULE:` header, so the verifier reports `EXACT-HEADER` at line 1. | Add `// MODULE: Pi Directive Dedup Tests` inside a 67-character `MODULE:` divider above the imports. | no |
| b09-hooks-dispatch-018 | P2 | 17 | typescript/style-guide/formatting-imports-and-coexistence.md § 2. FORMATTING RULES — "Rule: Single quotes for strings (same as JavaScript)." | The file uses double-quoted strings throughout, for example `const HEAD = "Advisor: live; use sk-code 0.91/0.23 pass."` at line 17 and the import specifiers at lines 1 and 3. | Convert the string literals and import specifiers to single quotes. | no |

## .skilled/hooks/dispatch/pi/dispatch-audit.ts
- language: ts
- verdict: findings
| id | sev | line | rule (file § section) | finding | fix | behaviour-change |
|----|-----|------|-----------------------|---------|-----|------------------|
| b09-hooks-dispatch-019 | P2 | 5 | typescript/style-guide/formatting-imports-and-coexistence.md § 3. IMPORT ORDERING — "1. Node.js built-in modules"; § 2. FORMATTING RULES — "Rule: Single quotes for strings (same as JavaScript)." | The third-party type import at line 5 precedes the `node:path` import at line 6, so the file violates the four-group order that puts Node built-ins first. Its string literals are also double-quoted throughout, for example `item.type === "text"` at line 12. | Move `import { join } from 'node:path';` first, keep the third-party type import in a separate `import type` group, and use single quotes for string literals. | no |

## .skilled/hooks/dispatch/pi/dispatch-preflight-lint.test.ts
- language: ts
- verdict: findings
| id | sev | line | rule (file § section) | finding | fix | behaviour-change |
|----|-----|------|-----------------------|---------|-----|------------------|
| b09-hooks-dispatch-020 | P2 | 1 | typescript/style-guide/overview-strict-and-naming.md § 2. FILE HEADER FORMAT — "All TypeScript files MUST begin with a module header block identifying the module." | The file starts with imports and has no `MODULE:` header, so the verifier reports `EXACT-HEADER` at line 1. | Add `// MODULE: Pi Dispatch Preflight Tests` inside a 67-character `MODULE:` divider above the imports. | no |
| b09-hooks-dispatch-021 | P2 | 4 | typescript/style-guide/formatting-imports-and-coexistence.md § 2. FORMATTING RULES — "Rule: Single quotes for strings (same as JavaScript)." | The file uses double-quoted strings for its imports and assertions, for example `from "vitest"` at line 4 and `"use cli-pi"` at line 239. | Convert the string literals and import specifiers to single quotes. | no |

## .skilled/hooks/dispatch/pi/dispatch-preflight-lint.ts
- language: ts
- verdict: findings
| id | sev | line | rule (file § section) | finding | fix | behaviour-change |
|----|-----|------|-----------------------|---------|-----|------------------|
| b09-hooks-dispatch-022 | P2 | 1 | typescript/style-guide/overview-strict-and-naming.md § 4. SECTION ORGANIZATION — "Large files are organized using numbered section dividers, consistent with JavaScript style." | The 290-line file has no numbered section dividers, so the verifier reports `SECTIONS-MISSING` at line 1. | Add Format A numbered dividers (`1. IMPORTS`, `2. TYPE DEFINITIONS`, `3. CONSTANTS`, `4. HELPERS`, `5. CORE LOGIC`, `6. EXPORTS`) in the TypeScript order. | no |
| b09-hooks-dispatch-023 | P2 | 5 | typescript/style-guide/formatting-imports-and-coexistence.md § 3. IMPORT ORDERING — "1. Node.js built-in modules"; § 2. FORMATTING RULES — "Rule: Single quotes for strings (same as JavaScript)." | The third-party type import at line 5 precedes the `node:path` import at line 6, violating the four-group order. The file also uses double-quoted strings throughout, for example `const PI_RUNTIME = "pi";` at line 9. | Move `import { join } from 'node:path';` first, keep the third-party type import in a separate `import type` group, and use single quotes for string literals. | no |

TOTAL: P0=0 P1=5 P2=18 files=19

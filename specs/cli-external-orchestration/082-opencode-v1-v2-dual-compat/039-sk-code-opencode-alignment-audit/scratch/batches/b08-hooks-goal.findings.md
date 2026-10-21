# Batch b08-hooks-goal findings

VERIFIER: all six listed lines are confirmed. The five `EXACT-HEADER` errors map to b08-hooks-goal-002, -004, -005, -009 and -012; the `SECTIONS-MISSING` error maps to b08-hooks-goal-010. No listed line was rejected. Rerunning the same verifier with the documented flags also emits six `FOLDER-README-MISSING` errors for `bin/`, `cursor/`, `devin/`, `lib/`, `opencode/` and `pi/`; those directories are outside FILES, so they are recorded as confirmation context rather than as file findings.

## .skilled/hooks/goal/README.md
- language: md
- verdict: findings
| id | sev | line | rule (file § section) | finding | fix | behaviour-change |
|----|-----|------|-----------------------|---------|-----|------------------|
| b08-hooks-goal-001 | P2 | 114 | review-core.md § 6. BASELINE CHECK FAMILIES — "Correctness minimums: regression risk, contract safety, spec mismatch, destructive side effects, and boundary handling." | § 5 calls `renderGoalBrief` a "byte-compatible `[active_goal]` block", but the core renders `usage: tokens n/a/<budget>; … (source: turn-count-estimate)` at `lib/goal-core.cjs:550` while `opencode-goal.js:2826` renders `usage: tokens <used>/<budget>; …`; § 2 line 42 already says this line differs by design. The block is label-compatible, not byte-identical, so the unqualified claim is stale. | Say "marker- and field-label-compatible" in § 5, or remove "byte-compatible" and point readers to § 2 for the intended `usage:` and role-label differences. | no |

## .skilled/hooks/goal/bin/goal.cjs
- language: cjs
- verdict: findings
| id | sev | line | rule (file § section) | finding | fix | behaviour-change |
|----|-----|------|-----------------------|---------|-----|------------------|
| b08-hooks-goal-002 | P2 | 2 | javascript/style-guide.md § 2. FILE HEADER FORMAT — "All JavaScript files MUST begin with a module header identifying the module, in the same divider form the TypeScript style guide uses, so a mixed tree reads as one convention." | The header is a descriptive `╔═╗` box with no `MODULE:` or `COMPONENT:` marker, so the exact-header check reports `EXACT-HEADER` at line 1. | Add `// MODULE: Goal Manage CLI` between the existing box borders (or replace the box with the 67-character `MODULE:` divider). | no |

## .skilled/hooks/goal/bin/goal.test.cjs
- language: cjs
- verdict: clean

## .skilled/hooks/goal/cursor/goal-cursor.test.mjs
- language: mjs
- verdict: findings
| id | sev | line | rule (file § section) | finding | fix | behaviour-change |
|----|-----|------|-----------------------|---------|-----|------------------|
| b08-hooks-goal-003 | P2 | 73 | test-quality-checklist.md § 2. COVERAGE QUALITY — "Changed behavior that lacks a corresponding test update or addition." | The comment says the Role line is "not re-derived" and that `renderGoalBrief`'s `runtimeLabel` parameter is "currently unused", but the core relabels the Role line from that parameter at `lib/goal-core.cjs:523-527`. The test only asserts the generic phrase "execution agent operating under the active session goal", so the Cursor relabel behavior is neither verified nor guarded. | Delete the stale comment and assert `Role: Focused Cursor execution agent operating under the active session goal.` in the returned `agent_message`. | no |

## .skilled/hooks/goal/cursor/goal-inject.mjs
- language: mjs
- verdict: clean

## .skilled/hooks/goal/devin/goal-devin.test.mjs
- language: mjs
- verdict: findings
| id | sev | line | rule (file § section) | finding | fix | behaviour-change |
|----|-----|------|-----------------------|---------|-----|------------------|
| b08-hooks-goal-004 | P2 | 1 | javascript/style-guide.md § 2. FILE HEADER FORMAT — "All JavaScript files MUST begin with a module header identifying the module, in the same divider form the TypeScript style guide uses, so a mixed tree reads as one convention." | The header box starts with `goal-devin tests — …` and has no exact `COMPONENT:` or `MODULE:` marker, so the verifier reports `EXACT-HEADER`. | Add `// ║ COMPONENT: goal-devin tests                                              ║` as the middle line of the existing box (or replace the box with the standard `MODULE:` divider). | no |

## .skilled/hooks/goal/devin/goal-inject.mjs
- language: mjs
- verdict: clean

## .skilled/hooks/goal/goal-plugin.md
- language: md
- verdict: clean

## .skilled/hooks/goal/lib/goal-core.cjs
- language: cjs
- verdict: findings
| id | sev | line | rule (file § section) | finding | fix | behaviour-change |
|----|-----|------|-----------------------|---------|-----|------------------|
| b08-hooks-goal-005 | P2 | 1 | javascript/style-guide.md § 2. FILE HEADER FORMAT — "All JavaScript files MUST begin with a module header identifying the module, in the same divider form the TypeScript style guide uses, so a mixed tree reads as one convention." | The header box names `goal-core — …` but carries no `MODULE:` or `COMPONENT:` marker, so the verifier reports `EXACT-HEADER`. | Add `// ║ MODULE: Goal Core                                                        ║` inside the existing box (or replace the box with the standard `MODULE:` divider). | no |
| b08-hooks-goal-006 | P1 | 789 | README.md § 7. BOUNDARIES AND FLOW — "Reads fail open: missing identity, missing state, malformed scoped JSON, or adapter error selects no goal." | `readGoalRecordForScope` catches every error, including `JSON.parse` failures and unreadable files, and `continue`s to `legacyScopedStatePath`. If the current scoped record is malformed but a valid old runtime-plus-session-digest record exists, the session silently selects that legacy goal, contradicting the README's malformed-JSON rule and the function's own "parse error returns null" JSDoc. The shape test also accepts arrays (`typeof [] === 'object'`). | Continue to the legacy path only on `ENOENT`; return `null` on parse, read or shape failure, and reject arrays/objects without a usable status/goal id. Add a regression test with a malformed current record plus a valid legacy-scoped record. | yes |
| b08-hooks-goal-007 | P2 | 1553 | code-quality-checklist.md § 4. BOUNDARY CONDITIONS — "Null/undefined handling and optional chaining misuse." | The archive mapper stores any `JSON.parse` result as `entry.goal`, then the sort dereferences `b.goal.updatedAtMs`. A file containing valid JSON `null` throws in the comparator; the outer catch converts that into `[]`, so one corrupt archive silently hides every valid archive in `history`. | Filter mapped entries with `parsed && typeof parsed === 'object' && !Array.isArray(parsed)`, or use `b.goal?.updatedAtMs`, and keep a corrupt file from emptying the result. | yes |
| b08-hooks-goal-008 | P2 | 156 | javascript/style-guide.md § 7. COMMENTING RULES — "Function Purpose Comments: Single line above function describing intent." | Two JSDoc blocks are stacked before `resolveRepoRoot`; the first says the root marker is the "`.opencode` skills tree", while `goalSlice.resolveWorkspaceRoot` actually checks `.skilled/skills` (`goal-slice.cjs:238`). The stale block misstates the marker and obscures which comment documents the function. | Remove the first, stale block and keep one JSDoc that names `.git` and `.skilled/skills` as the markers. | no |

## .skilled/hooks/goal/lib/goal-core.test.cjs
- language: cjs
- verdict: clean

## .skilled/hooks/goal/lib/goal-slice.cjs
- language: cjs
- verdict: findings
| id | sev | line | rule (file § section) | finding | fix | behaviour-change |
|----|-----|------|-----------------------|---------|-----|------------------|
| b08-hooks-goal-009 | P2 | 1 | javascript/style-guide.md § 2. FILE HEADER FORMAT — "All JavaScript files MUST begin with a module header identifying the module, in the same divider form the TypeScript style guide uses, so a mixed tree reads as one convention." | The header box names `goal-slice — …` but carries no `MODULE:` or `COMPONENT:` marker, so the verifier reports `EXACT-HEADER`. | Add `// ║ MODULE: Goal Slice                                                      ║` inside the existing box (or replace the box with the standard `MODULE:` divider). | no |
| b08-hooks-goal-010 | P2 | 1 | javascript/style-guide.md § 4. SECTION ORGANIZATION — "Large files are organized using numbered section dividers." | The file is 474 lines and has no numbered section dividers, so the verifier reports `SECTIONS-MISSING`; imports, constants, regex construction, packet resolution, phase classification, budget logic and exports all read as one block. | Add numbered dividers in the standard order, for example `1. IMPORTS`, `2. CONSTANTS`, `3. HELPERS`, `4. PACKET PROJECTION`, `5. EXPORTS`. | no |
| b08-hooks-goal-011 | P1 | 429 | security-checklist.md § 2. INPUT/OUTPUT SAFETY — "Path traversal from unchecked path input (`../`)." | `resolvePacketDir` checks the real path of the directory and its existing ancestors, but `readPacketGoal` reads `join(dir.absolute, 'goal.md')`; a `goal.md` symlink inside an otherwise contained packet is followed to any file on disk, and its contents become the objective slice and model injection. This contradicts README.md § 5 line 115: "reads a packet's goal inside the workspace and nowhere else." | Resolve the goal file itself (`realpathSync`/`lstat`) and require its real path to stay under `dir.real` (or reject a symlinked goal file) before reading; add a fixture whose `goal.md` is a symlink outside the workspace. | yes |

## .skilled/hooks/goal/lib/goal-slice.test.cjs
- language: cjs
- verdict: findings
| id | sev | line | rule (file § section) | finding | fix | behaviour-change |
|----|-----|------|-----------------------|---------|-----|------------------|
| b08-hooks-goal-012 | P2 | 2 | javascript/style-guide.md § 2. FILE HEADER FORMAT — "All JavaScript files MUST begin with a module header identifying the module, in the same divider form the TypeScript style guide uses, so a mixed tree reads as one convention." | The header box names `goal-slice tests — …` but carries no `COMPONENT:` or `MODULE:` marker, so the verifier reports `EXACT-HEADER`. | Add `// ║ COMPONENT: goal-slice tests                                              ║` as the middle line of the existing box, matching the sibling `goal-core.test.cjs` header. | no |
| b08-hooks-goal-013 | P2 | 204 | test-quality-checklist.md § 4. TEST INDEPENDENCE AND RELIABILITY — "Tests that rely on wall-clock timing, network availability, or filesystem state." | The linear-time regression test asserts `elapsedMs < 250`; a loaded CI worker can exceed that while `splitFrontmatter` is still linear, so the test can fail for scheduling rather than a regression. | Drop the elapsed-time assertion and keep the deterministic output assertions, or enforce a much larger CI-safe ceiling with an explicit performance budget. | no |

## .skilled/hooks/goal/pi/goal-context.ts
- language: ts
- verdict: findings
| id | sev | line | rule (file § section) | finding | fix | behaviour-change |
|----|-----|------|-----------------------|---------|-----|------------------|
| b08-hooks-goal-014 | P2 | 5 | typescript/style-guide/formatting-imports-and-coexistence.md § 2. FORMATTING RULES — "Quotes: `Single quotes for strings`." | The file uses double-quoted strings throughout (`"node:path"`, `"@earendil-works/pi-coding-agent"`, `"pi"`, `"Pi"`, the command description, and the CLI literals), deviating from the TypeScript quote rule. | Convert string literals to single quotes, using double quotes only where escaping would otherwise be required. | no |
| b08-hooks-goal-015 | P2 | 132 | typescript/style-guide/formatting-imports-and-coexistence.md § 2. FORMATTING RULES — "Line Length: Maximum: 100 characters." | Line 132 is 114 characters, and the same over-limit pattern appears at lines 48, 49, 50, 150, 157, 197, 207, 212 and 213, mostly in long type declarations and call sites. | Break the long type/call lines at parameter or argument boundaries so each stays within the 100-character maximum. | no |

## .skilled/hooks/goal/pi/goal-pi.test.mjs
- language: mjs
- verdict: findings
| id | sev | line | rule (file § section) | finding | fix | behaviour-change |
|----|-----|------|-----------------------|---------|-----|------------------|
| b08-hooks-goal-016 | P2 | 51 | test-quality-checklist.md § 2. COVERAGE QUALITY — "Changed behavior that lacks a corresponding test update or addition." | The comment says `renderGoalBrief`'s `runtimeLabel` argument "does not re-derive" the Role line, but the core relabels it at `lib/goal-core.cjs:523-527`. Because the test sets the goal with `runtimeLabel: 'Pi'` and reads it with `runtimeLabel: 'Pi'`, it cannot distinguish a relabel from the stored label and does not guard the Pi adapter's relabel behavior. | Set the goal with a different runtime label (for example `OpenCode`) and assert the Pi-rendered brief contains `Role: Focused Pi …`; remove the false comment. | no |

TOTAL: P0=0 P1=2 P2=14 files=14

# Batch b05-relaunch-lib findings

VERIFIER: both emitted lines are confirmed — `.skilled/hooks/session-relaunch/lib/killer.cjs:1 [SECTIONS-MISSING]` and `.skilled/hooks/session-relaunch/lib/nudge.cjs:1 [SECTIONS-MISSING]`. Neither file contains a single numbered divider, while the three sibling modules in the same directory (`context-usage.cjs`, `hop-history.cjs`, `relaunch-core.cjs`) each carry the five-section form, so the finding is a real gap rather than a path exemption. The same verifier run also reported `.skilled/hooks/session-relaunch/lib:1 [FOLDER-README-MISSING]`; that line names a folder rather than a listed file, so it is not scored below. All five files pass `node --check`, carry the 67-character `MODULE:` header, `'use strict'`, and no ephemeral-artifact pointers in comments.

## .skilled/hooks/session-relaunch/lib/context-usage.cjs
- language: cjs
- verdict: findings
| id | sev | line | rule (file § section) | finding | fix | behaviour-change |
|----|-----|------|-----------------------|---------|-----|------------------|
| b05-relaunch-lib-001 | P2 | 205 | universal-checklist.md § 3. P1 - REQUIRED (No Magic Numbers/Strings) — "Magic values are extracted to named constants." | `resolveWindow` ends with `String(model).includes('[1m]') ? 1000000 : 200000`, so both window sizes and the model marker are inline literals, even though the same file already hoists `DEFAULT_TAIL_BYTES` and `MAX_TAIL_BYTES` in section 2. A window-size change has to be hunted in a ternary instead of the constants block. | Hoist `LARGE_WINDOW_TOKENS = 1000000`, `DEFAULT_WINDOW_TOKENS = 200000`, and the `'[1m]'` marker into section 2 and return them from `resolveWindow`. | no |

## .skilled/hooks/session-relaunch/lib/hop-history.cjs
- language: cjs
- verdict: findings
| id | sev | line | rule (file § section) | finding | fix | behaviour-change |
|----|-----|------|-----------------------|---------|-----|------------------|
| b05-relaunch-lib-002 | P2 | 137 | code-quality-checklist.md § 4. BOUNDARY CONDITIONS — "Off-by-one errors in loops, pagination, and slicing." | `readHistory` ends with `text.split('\n').filter(Boolean).slice(-last)`, and `last` is only documented as a number. `last: 0` evaluates `slice(-0)`, which returns every recorded line instead of none; `last: -5` evaluates `slice(5)`, which drops the five oldest lines and returns the rest. The CLI's `history` command rejects `last < 1` (session-relaunch.cjs:597-601), but the exported function has no such guard, so the next caller inherits an inverted slice with no error. | Clamp before slicing, for example `const count = Number.isInteger(last) && last > 0 ? last : 20;` and then `slice(-count)`. | no |

## .skilled/hooks/session-relaunch/lib/killer.cjs
- language: cjs
- verdict: findings
| id | sev | line | rule (file § section) | finding | fix | behaviour-change |
|----|-----|------|-----------------------|---------|-----|------------------|
| b05-relaunch-lib-003 | P2 | 1 | javascript/style-guide.md § 4. SECTION ORGANIZATION — "Large files are organized using numbered section dividers." | Confirms the verifier line for this file. The 686-line file carries only the `MODULE:` header; there is no `1. IMPORTS` or any later numbered divider, while its sibling modules in the same directory use all five. The file is navigable only by scrolling, and the verifier gate fails on it. | Insert the five standard dividers in the sibling files' box-drawing form: `1. IMPORTS` before line 6, `2. CONSTANTS` before line 14, `3. HELPERS` before line 29, `4. CORE LOGIC` before line 348 (`acquireLock`), and `5. EXPORTS` before line 686. | no |
| b05-relaunch-lib-004 | P2 | 192 | code-quality-checklist.md § 7. KISS / DRY ENFORCEMENT (DRY Checks) — "Repeated validation/parsing blocks that can share one source." | `isLoopAncestor` rebuilds the `ps` parent map inline at lines 192-195 with the same `^(\d+)\s+(\d+)$` parse and `parents.set(Number(...), Number(...))` that `relaunch-core.findLoopChildPid` owns at relaunch-core.cjs:936-939. If the table format or column selection changes on one side, the killer's ancestry check sees an empty map and refuses every target (logging `killer-refused-target`) while the wrapper's own target walk still works, so the relaunch silently stops. | Export a `parentMapFromTable(table)` helper from relaunch-core and call it from both `findLoopChildPid` and `isLoopAncestor`. | no |

## .skilled/hooks/session-relaunch/lib/nudge.cjs
- language: cjs
- verdict: findings
| id | sev | line | rule (file § section) | finding | fix | behaviour-change |
|----|-----|------|-----------------------|---------|-----|------------------|
| b05-relaunch-lib-005 | P2 | 1 | javascript/style-guide.md § 4. SECTION ORGANIZATION — "Large files are organized using numbered section dividers." | Confirms the verifier line for this file. The 525-line file has no numbered dividers at all, while `context-usage.cjs`, `hop-history.cjs`, and `relaunch-core.cjs` each have the five-section form; constants, helpers, decision logic, and the export block run together. | Insert `1. IMPORTS` before line 6, `2. CONSTANTS` before line 11, `3. HELPERS` before line 35 (`shellQuote`), `4. CORE LOGIC` before line 62 (`normalizeSpecFolder`), and `5. EXPORTS` before line 502. | no |
| b05-relaunch-lib-006 | P2 | 14 | code-quality-checklist.md § 7. KISS / DRY ENFORCEMENT (DRY Checks) — "Duplicated constants/rules across modules." | The carried-folder suffix literals (`SPEC_FOLDER_SUFFIX` line 14, `SPEC_FOLDER_SKIP_SUFFIX` line 15) are declared here for parsing, re-declared in `relaunch-core.manualClaimCommand` (relaunch-core.cjs:645-648) for printing, and a third time in `.skilled/bin/skilled-loop:115-118`. A change to the printed suffix that misses this parser makes `specFolderFromSeed` return empty, so the relaunched session is not told to resume its packet; the `SPEC_FOLDER_SKIP_SUFFIX_LEGACY` constant at line 17 shows that drift already happened once. | Build the suffix in one exported helper in relaunch-core, which already owns the seed form, and have `manualClaimCommand` and nudge's constants/parser consume it; align the shell copy or have the loop call the JS formatter. | no |
| b05-relaunch-lib-007 | P2 | 299 | code-quality-checklist.md § 7. KISS / DRY ENFORCEMENT (KISS Checks) — "Features, parameters, or configuration options added for speculative future use without a current requirement (YAGNI)." | `plannedNotePath` destructures `cwd` and never reads it; the comment on line 298 states the root no longer comes from it. All four adapters still pass `cwd` (claude/context-nudge.mjs:93, codex/shared.mjs:103, .opencode/plugins/session-relaunch.js:137, pi/session-relaunch.ts:339), so the parameter reads as live configuration and a future caller can reasonably believe the note path follows the session directory. | Delete the `cwd` binding and its comment. Extra properties passed by callers are ignored, so no call site has to change. | no |

## .skilled/hooks/session-relaunch/lib/relaunch-core.cjs
- language: cjs
- verdict: findings
| id | sev | line | rule (file § section) | finding | fix | behaviour-change |
|----|-----|------|-----------------------|---------|-----|------------------|
| b05-relaunch-lib-008 | P2 | 39 | javascript/style-guide.md § 6. FORMATTING RULES (Line Length) — "Maximum: 100 characters." | Line 39 is 101 characters: `const MISSING_EVENT_POLICIES = Object.freeze({ claude: 'infer', hermes: 'accept', codex: 'refuse' });`. Every other code line in the file stays within the stated maximum, and this one is an object literal that has no reason to stay on one line. | Break the literal after `Object.freeze(` with one entry per line, as the module does elsewhere for multi-entry constants. | no |

TOTAL: P0=0 P1=0 P2=8 files=5

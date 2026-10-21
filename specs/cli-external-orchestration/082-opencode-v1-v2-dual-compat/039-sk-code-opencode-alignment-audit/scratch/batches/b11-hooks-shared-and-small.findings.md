# Batch b11-hooks-shared-and-small findings

VERIFIER: all 8 reported lines confirmed (files `mcp-route-guard.test.cjs`, `env-aliases.cjs`, `hook-adapter-shared.test.cjs`, `hook-flags.cjs` x2, `hook-flags.mjs`, `hook-flags.sh`, `hook-flags.test.cjs`). No line rejected. One file in this batch the verifier does not scan is also missing a header: `.skilled/hooks/git/pre-commit` is extensionless, so the exact-header check skipped it (finding 012).

## .skilled/hooks/README.md
- language: md
- verdict: findings
| id | sev | line | rule (file § section) | finding | fix | behaviour-change |
|----|-----|------|-----------------------|---------|-----|------------------|
| b11-hooks-shared-and-small-001 | P1 | 28 | review-core.md § 3. EVIDENCE REQUIREMENTS ("Every `P0` and `P1` finding must include a concrete `file:line` citation") + task rule "a wrong claim as P1" | The claim "the repo's real, installed `.git/hooks/pre-commit` is `.skilled/scripts/git-hooks/pre-commit`, which chain-calls `git/pre-commit` by path as its comment-hygiene sub-gate" is false. `.skilled/scripts/git-hooks/pre-commit` carries its own inline gate (`COMMENT_CHECKER="${SOURCE_ROOT}/skills/sk-code/sk-code-quality/scripts/check-comment-hygiene.sh"`, line 100) and never references this folder's hook: `rg -n HYGIENE_HOOK .skilled/scripts/git-hooks/pre-commit` returns no matches (exit 1). `.skilled/hooks/git/README.md:16` states the opposite, which matches the code. Line 239 repeats the same wrong model as a validation command whose expected `HYGIENE_HOOK=...` line can never print, so the documented check proves nothing. | Replace the sentence with the standalone contract (this folder's `pre-commit` is opt-in and independent; the primary hook has its own gate), and delete or replace the `grep -n HYGIENE_HOOK` validation block at 238-241 with a check that exists (e.g. `grep -n COMMENT_CHECKER .skilled/scripts/git-hooks/pre-commit`). | no |
| b11-hooks-shared-and-small-002 | P2 | 47 | task rule "flag ... a stale or unclear [claim] as P2" | The kill-switch index column is headed "Canonical flag (`SYSTEM_<CONCERN>_DISABLED`)" but its `codex-watchdog` row names `CODEX_WATCHDOG_DISABLED`. `hook-flags.cjs:36` sets `CONCERN_CANONICAL["codex-watchdog"] = "CODEX_HOOKS_WATCHDOG_DISABLED"` and lists `CODEX_WATCHDOG_DISABLED` under `LEGACY_ALIASES` (line 78); `.skilled/hooks/codex-watchdog/README.md:97-98` documents the same split. Both values disable the hook, so only the "canonical" label is wrong. | Change the row's Canonical cell to `CODEX_HOOKS_WATCHDOG_DISABLED` and move `CODEX_WATCHDOG_DISABLED` into a Legacy-alias cell, matching the codex-watchdog README. | no |
| b11-hooks-shared-and-small-003 | P2 | 266 | task rule "stale or unclear [claim] as P2" | In the coverage matrix (declared "the coverage authority"), every `by-design` cell in rows `codex-watchdog`, `directive-lifecycle`, `goal`, `permission-policy`, `session-lifecycle` and `session-relaunch` opens with a stray comma, e.g. the cell reading `, by-design: OpenCode plugin audits Codex hook installation`. The legend at 258-262 defines the allowed markers (`✓ covered`, `by-design`, `n/a`, `~ partial`, `unverified`), so a reader cannot tell what the cell's status is. | Drop the leading comma in each affected cell (lines 265-278) so the cell starts with its marker. | no |
| b11-hooks-shared-and-small-004 | P2 | 290 | task rule "flag ... a stale or unclear [claim] as P2" | The "Additional centralized hooks" table gives the runtimes for `git-worktree-guard` (290) and `git-hooks-check` (291) as "claude, codex, cursor, devin + hermes plugin", omitting OpenCode. `.skilled/plugins/session-cleanup.js:32-34` runs both scripts (`GUARD_SCRIPTS` = `worktree-guard.sh`, `check-git-hooks.sh`, `git-live-follow.sh --start`) on `session.created`, and `coverage-rationale.md:47` and `session-cleanup/README.md:31` both say so. | Append "+ opencode plugin" to both Runtimes cells. | no |

## .skilled/hooks/codex-watchdog/README.md
- language: md
- verdict: clean

## .skilled/hooks/completion/README.md
- language: md
- verdict: clean

## .skilled/hooks/coverage-rationale.md
- language: md
- verdict: clean

## .skilled/hooks/directive-lifecycle/README.md
- language: md
- verdict: clean

## .skilled/hooks/dist-freshness/README.md
- language: md
- verdict: clean

## .skilled/hooks/git-hooks-check/README.md
- language: md
- verdict: findings
| id | sev | line | rule (file § section) | finding | fix | behaviour-change |
|----|-----|------|-----------------------|---------|-----|------------------|
| b11-hooks-shared-and-small-005 | P1 | 61 | review-core.md § 3. EVIDENCE REQUIREMENTS + task rule "a wrong claim as P1" | The OpenCode row says "Not applicable. OpenCode session guards run inside the owning `mk-*` plugins; this check is wired into the editor runtimes' SessionStart chains." OpenCode does run this check: `.skilled/plugins/session-cleanup.js:33` lists `check-git-hooks.sh` in `GUARD_SCRIPTS` and executes it on `session.created` (lines 78-96), and `session-cleanup/README.md:31` documents it. The `mk-*` name is also the retired prefix; every live plugin is `.skilled/plugins/system-*` (`env-aliases.cjs:1-10` describes that rename). | Replace the row with the OpenCode delivery actually implemented (plugin `event` on `session.created`, via the session-cleanup startup guards) and name the plugin, as `session-cleanup/README.md` does. | no |

## .skilled/hooks/git-live-follow/README.md
- language: md
- verdict: findings
| id | sev | line | rule (file § section) | finding | fix | behaviour-change |
|----|-----|------|-----------------------|---------|-----|------------------|
| b11-hooks-shared-and-small-006 | P1 | 21 | review-core.md § 3. EVIDENCE REQUIREMENTS + task rule "a wrong claim as P1" | Three places say the script always exits 0: line 21 "every internal failure is non-fatal (exit 0)", line 46 "always exits 0", line 107 "Missing git, a non-repo checkout ... exits 0". The code exits 1 in exactly those two cases: `.skilled/bin/git-live-follow.sh:63` (`git not found` -> `exit 1`) and `:64` (`not a git repository` -> `exit 1`). Observed: `cd /tmp && bash .skilled/bin/git-live-follow.sh --once` prints `[live-follow] not a git repository` and exits 1. The sibling `.skilled/bin/git-primary-reconcile.sh:142-143` treats the same two conditions as `exit 0`, which is what this doc's contract describes. | Either make the two guard clauses `exit 0` (matches the documented non-fatal contract and the sibling script) or change the three doc claims to say exit 1 for missing git / non-repo. | yes |

## .skilled/hooks/git-primary-reconcile/README.md
- language: md
- verdict: clean

## .skilled/hooks/git-worktree-guard/README.md
- language: md
- verdict: findings
| id | sev | line | rule (file § section) | finding | fix | behaviour-change |
|----|-----|------|-----------------------|---------|-----|------------------|
| b11-hooks-shared-and-small-007 | P1 | 51 | review-core.md § 3. EVIDENCE REQUIREMENTS + task rule "a wrong claim as P1" | Same false "Not applicable" as finding 005: OpenCode runs `worktree-guard.sh` from `.skilled/plugins/session-cleanup.js:32` on `session.created`, and `coverage-rationale.md:45-47` states it explicitly ("OpenCode's `session-cleanup` plugin executes `worktree-guard.sh`"). The cell also calls the plugins `mk-*`, a prefix no live plugin carries. | Replace the OpenCode row with the session-cleanup plugin delivery and name the real plugin. | no |

## .skilled/hooks/git/README.md
- language: md
- verdict: findings
| id | sev | line | rule (file § section) | finding | fix | behaviour-change |
|----|-----|------|-----------------------|---------|-----|------------------|
| b11-hooks-shared-and-small-008 | P2 | 16 | task rule "flag ... a stale or unclear [claim] as P2" | "`install-hooks.sh` symlinks `pre-commit` into Git's resolved hooks directory" is not what the script does. `install-hooks.sh:17` hardcodes `HOOKS_DEST="$REPO_ROOT/.git/hooks"`, so it never asks git for the effective path (`git rev-parse --git-path hooks`) and ignores `core.hooksPath`. In a linked worktree `.git` is a file (this checkout: `.git` is a 126-byte file), so the symlink target does not exist. | After fixing finding 011, either keep the claim and make the script resolve the path, or word it as "the repo's `.git/hooks` directory". | no |
| b11-hooks-shared-and-small-009 | P2 | 36 | task rule "stale or unclear [claim] as P2" | The documented block output `BLOCKED: <N> file(s) contain ephemeral-artifact pointers in code comments.` does not match the hook, which prints `BLOCKED: staged files contain ephemeral-artifact pointers in code comments.` (`.skilled/hooks/git/pre-commit:71`) with no count and different wording. A reader grepping for the real line finds nothing. | Paste the hook's actual line into the example. | no |
| b11-hooks-shared-and-small-010 | P2 | 29 | task rule "stale or unclear [claim] as P2" | The mirror-gate scope is stated as "Staged agent files under `.skilled/agents/` or `.claude/agents/`", but the hook matches four roots: the `grep -E` alternation over `opencode`, `skilled`, `claude` and `codex` followed by `/agents/` at `.skilled/hooks/git/pre-commit:85`. The documented block text at line 44 (".skilled / .claude mirrors") also differs from the hook's `.opencode / .claude mirrors` (pre-commit:94). | State all four matched roots and quote the hook's actual block text. | no |

## .skilled/hooks/git/install-hooks.sh
- language: sh
- verdict: findings
| id | sev | line | rule (file § section) | finding | fix | behaviour-change |
|----|-----|------|-----------------------|---------|-----|------------------|
| b11-hooks-shared-and-small-011 | P1 | 17 | shell/quality-standards/validation-security-and-shellcheck.md § 2. VALIDATION PATTERNS ("Safe File Operations: Check before operating") + review-core.md § 6. BASELINE CHECK FAMILIES ("boundary handling") | `HOOKS_DEST="$REPO_ROOT/.git/hooks"` assumes `.git` is a directory. In a linked worktree it is a file (verified in this checkout), so line 18's `ln -sf` fails with "Not a directory" and `set -euo pipefail` (line 16) aborts the installer; with `core.hooksPath` set it writes a symlink git never reads. The script never creates the destination either. | Resolve the destination the way the sibling hooks do: `HOOKS_DEST="$(git rev-parse --git-path hooks)"` and `mkdir -p "$HOOKS_DEST"` before the `ln`. | yes |

## .skilled/hooks/git/pre-commit
- language: sh
- verdict: findings
| id | sev | line | rule (file § section) | finding | fix | behaviour-change |
|----|-----|------|-----------------------|---------|-----|------------------|
| b11-hooks-shared-and-small-012 | P2 | 1 | shell/style-guide/overview-structure-and-naming.md § 2. FILE STRUCTURE ("File Header: Use the standard header format for identification", `# COMPONENT: [COMPONENT NAME]`) + shell/quality-standards/overview-and-priority-blockers.md § 2. P0 - HARD BLOCKERS ("File Header Present") | The file opens with `#!/usr/bin/env bash` and five prose comment lines, with no `COMPONENT:` divider block. `verify_alignment_drift.py` supports `.sh` and named hook files but skipped this extensionless hook, so the verifier's silence here is a coverage gap, not a pass. | Insert the standard divider header (`# ─────` / `# COMPONENT: GIT COMMENT-HYGIENE PRECOMMIT` / `# ─────`) directly under the shebang, above the existing description, and keep `set -euo pipefail` where it is. | no |

## .skilled/hooks/hook-flags.env.example
- language: other
- verdict: findings
| id | sev | line | rule (file § section) | finding | fix | behaviour-change |
|----|-----|------|-----------------------|---------|-----|------------------|
| b11-hooks-shared-and-small-013 | P2 | 19 | config/style-guide.md § 4. COMMENTS (JSONC) ("Use consistent section header format") applied to this KEY=value config, whose own section header claims an ordering | The section header says "Per-concern switches (alphabetical)", but the block is not sorted: `SK_GIT_PREFLIGHT_DISABLED` (line 28) sits between `SYSTEM_GIT_HOOKS_CHECK_DISABLED` (27) and `OPENCODE_GOAL_DISABLED` (29), and `OPENCODE_GOAL_DISABLED` precedes `SYSTEM_HOOK_INSTALL_DISABLED` (30). | Sort the block by flag name (or drop "(alphabetical)" from the header). | no |
| b11-hooks-shared-and-small-014 | P2 | 19 | task rule "stale or unclear [claim] as P2"; hooks/README.md § 1 calls this file the operator template | The template omits two switches the kill-switch index lists as wired: `SYSTEM_PRIMARY_RECONCILE_DISABLED` (README.md:62) and `SYSTEM_SK_VISION_DISABLED` (README.md:70). `hook-flags.cjs` accepts both (default `SYSTEM_<CONCERN>_DISABLED` shape) and `.skilled/bin/git-primary-reconcile.sh:178`, `.skilled/hooks/sk-vision/devin/sk-vision.mjs:68` read them, so an operator who copies the template cannot discover either. | Add both commented lines to the per-concern block. | no |

## .skilled/hooks/hook-install/README.md
- language: md
- verdict: clean

## .skilled/hooks/injection-contract.md
- language: md
- verdict: findings
| id | sev | line | rule (file § section) | finding | fix | behaviour-change |
|----|-----|------|-----------------------|---------|-----|------------------|
| b11-hooks-shared-and-small-015 | P2 | 20 | task rule "stale or unclear [claim] as P2"; review-core.md § 6. BASELINE CHECK FAMILIES (contract safety) | "Every concern is default-on and honors the master `SYSTEM_HOOKS_DISABLED` switch plus its canonical `SYSTEM_<CONCERN>_DISABLED` switch" drops the exception its own source of truth states: hooks/README.md:34 says "Every concern except `git-message-gate` honors the master ... The message gate has none on purpose". The gate's rules carry no bypass, so the absolute "every concern" understates a deliberate safety property. | Add the `git-message-gate` exception to this paragraph and point at the README line. | no |

## .skilled/hooks/mcp-route-guard/README.md
- language: md
- verdict: clean

## .skilled/hooks/mcp-route-guard/claude/mcp-route-guard.cjs
- language: cjs
- verdict: clean

## .skilled/hooks/mcp-route-guard/codex/mcp-route-guard.cjs
- language: cjs
- verdict: clean

## .skilled/hooks/mcp-route-guard/cursor/mcp-route-guard.mjs
- language: mjs
- verdict: findings
| id | sev | line | rule (file § section) | finding | fix | behaviour-change |
|----|-----|------|-----------------------|---------|-----|------------------|
| b11-hooks-shared-and-small-016 | P2 | 38 | javascript/quality-standards/security-testing-and-exemptions.md § 2. MODULE ORGANIZATION boundary (adapters import from inside the tree) + code-quality-checklist.md § 5. DATA FLOW AND CONTRACT SAFETY ("If an existing caller is not updated, will it still work correctly after this change?") | The child path is hardcoded as `.skilled/hooks/mcp-route-guard/claude/mcp-route-guard.cjs` and joined onto the workspace root at line 88. Every shell entrypoint in this tree resolves the source root first, accepting `.skilled` or `.opencode` (`.skilled/hooks/git/pre-commit:9-19` "source-root selection: The source tree sits under .skilled or .opencode"). On a checkout that carries only `.opencode`, `spawnSync` fails, `rawOutput` stays null and line 103 returns `approve()` silently, so the guard never advises while looking healthy. | Resolve the base before spawning (test `<root>/.skilled/hooks/...` then `<root>/.opencode/hooks/...`, same sentinel test the shell hooks use) and keep the current path as the first candidate. | yes |

## .skilled/hooks/mcp-route-guard/devin/mcp-route-guard.cjs
- language: cjs
- verdict: clean

## .skilled/hooks/mcp-route-guard/lib/mcp-route-guard.cjs
- language: cjs
- verdict: findings
| id | sev | line | rule (file § section) | finding | fix | behaviour-change |
|----|-----|------|-----------------------|---------|-----|------------------|
| b11-hooks-shared-and-small-017 | P2 | 101 | javascript/style-guide.md § 7. COMMENTING RULES ("Focus on WHYY, not WHAT", comment must be complete and purposeful) | The comment above `candidateServerTokens` stops mid-sentence: "Longest-token-first avoids a short" with no object, and it describes the split-point rule of `parseOpenCodeShape` (line 112) rather than the token list it sits over. | Complete the sentence (e.g. "... avoids a short server token swallowing a longer one") and move it directly above `parseOpenCodeShape`. | no |
| b11-hooks-shared-and-small-018 | P2 | 226 | code-quality-checklist.md § 7. KISS / DRY ENFORCEMENT ("Repeated validation/parsing blocks that can share one source") + README § 6 ("Truthy disable values are 1, `true`, `yes`, and `on`") | The core's own kill-switch test is `environment[DISABLED_ENV] === '1'`, narrower than the documented truthy set. Every live adapter pre-checks with `isHookEnabled`, which accepts `true`/`yes`/`on`, so the two layers disagree for any caller that reaches `evaluateNativeMcpCall` directly (the tests do, and an OpenCode-side caller could). `MCP_ROUTE_GUARD_DISABLED=true` therefore disables the hook through the adapters but not through the core. | Reuse one truthy test in the core (import `isTruthy` from `../../shared/hook-flags.cjs`, matching how the adapters already reach that file) or document the single-value contract on the constant. | yes |
| b11-hooks-shared-and-small-019 | P2 | 43 | code-quality-checklist.md § 7. KISS / DRY ENFORCEMENT ("Duplicated constants/rules across modules") | `INTERNAL_EXACT_TOKENS` repeats two of the three `INTERNAL_RAW_TOKENS` entries (`code_mode`, `sequential_thinking`), and the third (`system_skill_advisor`) is already covered by the `system_` prefix test at line 74. Two lists must now stay in sync, and only one is exported. | Build the Set from `INTERNAL_RAW_TOKENS`, or drop the Set and test `INTERNAL_RAW_TOKENS.includes(normalized)` in `isInternalServerToken`. | no |

## .skilled/hooks/mcp-route-guard/lib/mcp-route-guard.test.cjs
- language: cjs
- verdict: findings
| id | sev | line | rule (file § section) | finding | fix | behaviour-change |
|----|-----|------|-----------------------|---------|-----|------------------|
| b11-hooks-shared-and-small-020 | P2 | 1 | universal-checklist.md § 2. P0 - HARD BLOCKERS ("File has appropriate header comment identifying the component") + javascript-checklist.md § 2. P0 - HARD BLOCKERS ("Box Header") — verifier line confirmed | The file starts with a prose test map and `'use strict';` at line 22, with no `MODULE:` divider block. The prose header describes the suite well, so only the marker is missing. | Add the `// ─── MODULE: MCP Route Guard Core Tests ───` divider above the existing prose map, keeping `'use strict'` after it. | no |
| b11-hooks-shared-and-small-021 | P2 | 149 | test-quality-checklist.md § 5. TEST SMELL DETECTION ("Copy-paste duplication across test functions") + § 2. COVERAGE QUALITY | Lines 149 and 150 are the same assertion twice (`isInternalServerToken('system_skill_advisor')` with the same message). The `mk_` pre-rename branch at `mcp-route-guard.cjs:74`, and the fact that a bare `code_mode` is internal by exact token rather than prefix, are the cases the second line would have covered; both stay untested. | Change line 150 to a distinct case, e.g. `assert.ok(guardCore.isInternalServerToken('mk_code_graph'), 'mk_ prefix is internal')`. | no |
| b11-hooks-shared-and-small-022 | P2 | 259 | test-quality-checklist.md § 4. TEST INDEPENDENCE AND RELIABILITY ("Tests that rely on ... filesystem state") | `runClaudeHook` builds `env: { ...process.env, ...extraEnv }`, so the suite inherits the developer's kill switches, and the adapter separately reads the on-disk `.skilled/hooks/hook-flags.env` when no env is passed. With `MCP_ROUTE_GUARD_DISABLED=1` (or `true`/`yes`/`on`) exported, or that flag saved in the gitignored config file, the three integration tests at 263-311 that assert `additionalContext` fail for a reason unrelated to the code. `hook-stdin-deadline.test.mjs:76-83` already scrubs `*_DISABLED` names and points `HOOK_FLAGS_CONFIG` at an absent path for exactly this reason. | Reuse that `hookEnv()` pattern here: delete every `*_DISABLED` key and set `HOOK_FLAGS_CONFIG` to a non-existent temp path before spawning. | no |

## .skilled/hooks/mcp-route-guard/pi/mcp-route-guard.ts
- language: ts
- verdict: clean

## .skilled/hooks/permission-policy/README.md
- language: md
- verdict: clean

## .skilled/hooks/session-cleanup/README.md
- language: md
- verdict: clean

## .skilled/hooks/session-lifecycle/README.md
- language: md
- verdict: findings
| id | sev | line | rule (file § section) | finding | fix | behaviour-change |
|----|-----|------|-----------------------|---------|-----|------------------|
| b11-hooks-shared-and-small-023 | P2 | 23 | task rule "stale ... claim as P2"; hooks/README.md § 1 defines the live plugin names | "its session events run inside the owning `mk-*` plugins" names a plugin family that no longer exists. Every live OpenCode plugin is `.skilled/plugins/system-*` (`system-skill-advisor.js`, `opencode-goal.js`, `session-cleanup.js`, ...), and `mk_` is the retired prefix documented in `env-aliases.cjs:1-10`. The same phrase appears in the frontmatter description (line 3) and the §3 table (line 60). | Name the actual plugins, as `coverage-rationale.md:32` does ("distributed across `system-skill-advisor`, `opencode-goal`, etc."), in all three places. | no |
| b11-hooks-shared-and-small-024 | P2 | 60 | task rule "stale or unclear [claim] as P2" | The OpenCode row's cells open with stray commas: the row reads `**OpenCode**`, then `, (by-design)`, `—`, `, by-design: session events run inside ...`, `, by-design`. The rest of the table uses plain markers, so the status of this row is unreadable and the table renders with empty-looking cells. | Drop the leading comma in each cell of that row, matching the `by-design` spelling used in `permission-policy/README.md:52-56`. | no |

## .skilled/hooks/shared/README.md
- language: md
- verdict: findings
| id | sev | line | rule (file § section) | finding | fix | behaviour-change |
|----|-----|------|-----------------------|---------|-----|------------------|
| b11-hooks-shared-and-small-025 | P2 | 48 | task rule "flag ... a stale or unclear [claim] as P2"; universal-checklist.md § 3. P1 - REQUIRED (documentation accuracy of a stated count) | "The resolver family currently gates 22 concerns" lists 22 names and omits four live consumers of the same resolver: `injection-screen` (`.skilled/plugins/classifier-injection-screen.js:60`), `session-relaunch` (`.skilled/plugins/session-relaunch.js:197`), `sk-vision` (`.skilled/hooks/sk-vision/devin/sk-vision.mjs:68`) and `primary-reconcile` (`.skilled/bin/git-primary-reconcile.sh:178`). hooks/README.md's index lists all four, so the two docs give different totals. | Say "22 Node-resolver concerns plus the shell-only legs" or add the four names and change the count to 26. | no |
| b11-hooks-shared-and-small-026 | P2 | 59 | task rule "stale or unclear [claim] as P2" | The §4 directory tree lists `hook-flags.test.cjs` but not `hook-adapter-shared.test.cjs`, which exists on disk and is referenced twice by this same file (§5 line 78 "KEY FILES" and §8 line 140 validation command). The tree is presented as the folder's inventory. | Add `+-- hook-adapter-shared.test.cjs   # node --test suite: stdin deadline and whole-input read` before the `hook-stdin-deadline` line. | no |

## .skilled/hooks/shared/env-aliases.cjs
- language: cjs
- verdict: findings
| id | sev | line | rule (file § section) | finding | fix | behaviour-change |
|----|-----|------|-----------------------|---------|-----|------------------|
| b11-hooks-shared-and-small-027 | P2 | 1 | javascript/style-guide.md § 2. FILE HEADER FORMAT ("All JavaScript files MUST begin with a module header") + universal-checklist.md § 2. P0 - HARD BLOCKERS ("File Header") — verifier line confirmed | The file begins with `"use strict";` and a 10-line comment, with no `MODULE:` divider block. `shared/hook-adapter-shared.cjs:1-4` in the same folder shows the required form. | Add `// ─── MODULE: Hook Env Aliases ───` above the existing explanation and keep `'use strict'` first. | no |
| b11-hooks-shared-and-small-028 | P2 | 31 | code-quality-checklist.md § 7. KISS / DRY ENFORCEMENT ("New abstraction layers without a current behavior need", "New code not traceable to a current requirement") | `SKIP_PREFIXES` is permanently empty and exists only as scaffolding: the constant (31), the skip loop it drives (35-37), the comment explaining that nothing is skipped any more (30), and the export (57). The loop can never skip a key, so the branch is dead. | Delete the constant, the loop, the comment and the export; `newNameFor` then reads as one prefix walk. | no |

## .skilled/hooks/shared/hook-adapter-shared.cjs
- language: cjs
- verdict: clean

## .skilled/hooks/shared/hook-adapter-shared.test.cjs
- language: cjs
- verdict: findings
| id | sev | line | rule (file § section) | finding | fix | behaviour-change |
|----|-----|------|-----------------------|---------|-----|------------------|
| b11-hooks-shared-and-small-029 | P2 | 1 | universal-checklist.md § 2. P0 - HARD BLOCKERS ("File has appropriate header comment identifying the component") + javascript-checklist.md § 2. P0 - HARD BLOCKERS ("Box Header") — verifier line confirmed | The file opens with `"use strict";` at line 1 and has no `MODULE:` divider block. Its sibling `hook-stdin-deadline.test.mjs:1-5` carries the header form this tree expects. | Add `// ─── MODULE: Shared Hook Adapter Tests ───` above the requires. | no |
| b11-hooks-shared-and-small-030 | P2 | 42 | test-quality-checklist.md § 4. TEST INDEPENDENCE AND RELIABILITY ("Tests that rely on wall-clock timing") | `elapsedMs >= 2950 && elapsedMs < 4500` leaves 1.5 s for a cold `node` start plus the 3 s deadline. On a loaded CI box or under coverage instrumentation the child's start-up alone can exceed that, so the test flakes while the reader is correct; the killer timer above it already permits 13 s. | Raise the upper bound to the suite's own margin (e.g. `< 8000`, as `hook-stdin-deadline.test.mjs:38` uses `LATEST_EXIT_MS = 8000`) and keep the 2950 ms lower bound. | no |

## .skilled/hooks/shared/hook-flags.cjs
- language: cjs
- verdict: findings
| id | sev | line | rule (file § section) | finding | fix | behaviour-change |
|----|-----|------|-----------------------|---------|-----|------------------|
| b11-hooks-shared-and-small-031 | P2 | 1 | javascript/style-guide.md § 2. FILE HEADER FORMAT ("All JavaScript files MUST begin with a module header identifying the module") + universal-checklist.md § 2. P0 - HARD BLOCKERS ("File Header") — verifier line confirmed | The file starts with `"use strict";` and a 15-line comment, with no `MODULE:` divider block. This is the canonical module every other resolver flavour facades over, so it is the one file in `shared/` where the missing identity marker is most visible. | Add `// ─── MODULE: Hook Kill-Switch Resolver ───` above the existing explanation; keep `'use strict'` as the first statement. | no |
| b11-hooks-shared-and-small-032 | P2 | 1 | javascript/style-guide.md § 4. SECTION ORGANIZATION ("Large files are organized using numbered section dividers") — verifier line confirmed | At 220 lines the file crosses the numbered-divider threshold with zero `// N. SECTION NAME` rules, while its own dependency `env-aliases.cjs` and the sibling hooks use them. The logical sections (constants, config file, truthy/resolve, exported API) are only implied by comments. | Add the standard dividers in the guide's order: `1. IMPORTS`, `2. CONSTANTS`, `3. HELPERS` (truthy, config parse/cache), `4. CORE LOGIC` (`isHookEnabled`, `isFlagOn`, `concernFlag`), `5. EXPORTS`. | no |

## .skilled/hooks/shared/hook-flags.mjs
- language: mjs
- verdict: findings
| id | sev | line | rule (file § section) | finding | fix | behaviour-change |
|----|-----|------|-----------------------|---------|-----|------------------|
| b11-hooks-shared-and-small-033 | P2 | 1 | javascript/style-guide.md § 2. FILE HEADER FORMAT ("For `.mjs` files and OpenCode plugin loader paths, keep the same header but follow ESM module syntax") — verifier line confirmed | The file opens with a three-line prose comment; there is no `MODULE:` divider block, though its TypeScript twin `hook-flags.ts:1-3` has one for the same facade. | Add `// ─── MODULE: Hook Flags ESM Facade ───` above the existing comment, matching `hook-flags.ts`. | no |

## .skilled/hooks/shared/hook-flags.sh
- language: sh
- verdict: findings
| id | sev | line | rule (file § section) | finding | fix | behaviour-change |
|----|-----|------|-----------------------|---------|-----|------------------|
| b11-hooks-shared-and-small-034 | P2 | 1 | shell/style-guide/overview-structure-and-naming.md § 2. FILE STRUCTURE ("Use the standard header format for identification", `# COMPONENT: [COMPONENT NAME]`) + shell/quality-standards/overview-and-priority-blockers.md § 2. P0 - HARD BLOCKERS ("File Header Present") — verifier line confirmed | The file has the portable shebang and a usage/description comment block, but no `COMPONENT:` divider block, unlike every other shell entrypoint in this tree (`.skilled/hooks/git/install-hooks.sh:2-4`, `.skilled/bin/worktree-guard.sh:2-4`). | Insert the divider header directly under the shebang, before the `# Usage:` line, and keep the existing description below it. | no |

## .skilled/hooks/shared/hook-flags.test.cjs
- language: cjs
- verdict: findings
| id | sev | line | rule (file § section) | finding | fix | behaviour-change |
|----|-----|------|-----------------------|---------|-----|------------------|
| b11-hooks-shared-and-small-035 | P2 | 1 | universal-checklist.md § 2. P0 - HARD BLOCKERS ("File has appropriate header comment identifying the component") + javascript-checklist.md § 2. P0 - HARD BLOCKERS ("Box Header") — verifier line confirmed | The file starts with `"use strict";` and no `MODULE:` divider block, so the suite that every resolver flavour is verified by is the only one under `shared/` without the marker. | Add `// ─── MODULE: Hook Kill-Switch Resolver Tests ───` above the requires. | no |
| b11-hooks-shared-and-small-036 | P2 | 94 | test-quality-checklist.md § 2. COVERAGE QUALITY ("Tests that cannot fail are worse than no tests") + § 4 ("Tests that rely on ... filesystem state") | The case named "explicit env without a config arg ignores the config file (test isolation)" asserts only `isHookEnabled("skill-advisor", {}) === true`. With an explicit `{}` env the correct implementation and a config-reading regression both return `true` unless the developer's gitignored `.skilled/hooks/hook-flags.env` happens to disable `skill-advisor`, so the test passes today without exercising the behaviour it names, and its outcome depends on local untracked state. | Point `HOOK_FLAGS_CONFIG` at a temp file that sets `SYSTEM_SKILL_ADVISOR_DISABLED=1`, reload with `_resetConfigCache()`, then assert the explicit-env call is still enabled and the no-arg call is disabled. | no |

## .skilled/hooks/shared/hook-flags.ts
- language: ts
- verdict: clean

## .skilled/hooks/shared/hook-stdin-deadline.test.mjs
- language: mjs
- verdict: clean

## .skilled/hooks/vitest.config.ts
- language: ts
- verdict: findings
| id | sev | line | rule (file § section) | finding | fix | behaviour-change |
|----|-----|------|-----------------------|---------|-----|------------------|
| b11-hooks-shared-and-small-037 | P2 | 11 | shared/universal-patterns/naming-and-commenting.md § 2 (names state what the value is) + universal-checklist.md § 3. P1 - REQUIRED ("Naming follows language conventions") | `OPENCODE_ROOT` holds `path.join(REPO_ROOT, '.skilled')`, and the alias at line 32 rewrites both `.skilled/` and `.opencode/` prefixes onto it. The name says the opposite tree from the one it points at, which is exactly the confusion the two-root convention creates. | Rename to `SOURCE_ROOT` (or `SKILLED_ROOT`) and update the two uses at lines 12 and 32. | no |

TOTAL: P0=0 P1=5 P2=32 files=38

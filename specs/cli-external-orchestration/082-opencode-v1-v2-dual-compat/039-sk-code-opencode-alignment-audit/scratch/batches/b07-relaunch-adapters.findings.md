# Batch b07-relaunch-adapters findings

VERIFIER: the run emitted no lines for these 12 files, and that silence is not an all-clear. `check_sections` returns early for test files (`is_section_exempt_path`, `verify_alignment_drift.py:417-422`) and for any file at or below `SECTION_REQUIRED_MIN_LINES = 150` (`verify_alignment_drift.py:141`), so `hermes/context-nudge.mjs` (109 lines) and `hermes/session-end-arm.mjs` (125 lines) fall below the gate rather than through an exemption. Checked manually instead: every file carries the 67-character `MODULE:` header, `'use strict'` appears only in the one `.cjs`, and `.skilled/skills/sk-code/sk-code-quality/scripts/check-comment-hygiene.sh` exits 0 over all eleven code files (no ephemeral-artifact pointers). The five dangling README targets below were confirmed absent with `find . -name 'SPIKE*'` and `git check-ignore -v`.

## .skilled/hooks/session-relaunch/README.md
- language: md
- verdict: findings
| id | sev | line | rule (file § section) | finding | fix | behaviour-change |
|----|-----|------|-----------------------|---------|-----|------------------|
| b07-relaunch-adapters-001 | P1 | 25 | task brief § Markdown files — "check that every claim about code, paths, counts or behaviour matches the code you read; flag a wrong claim as P1" | The adapter matrix's "Spike evidence" column links five documents across lines 25-31: `specs/hooks/023-session-relaunch-loop/001-claude-relaunch-loop/scratch/spike/SPIKE-REPORT.md`, `.../002-pi-opencode-adapters/scratch/spike/SPIKE-REPORT.md` (Pi and OpenCode rows), `.../003-command-trigger-runtimes/scratch/spike/SPIKE-codex.md`, `.../SPIKE-cursor-hermes.md` (Cursor and Hermes rows) and `.../SPIKE-devin.md`. No `SPIKE*` file exists anywhere in the repository, and each phase's `scratch/.gitignore` is `*` (`git check-ignore -v` confirms the 001 path is ignored), so the cited evidence was never committed and is unopenable in any checkout — including for the AUTO and COMMAND-ONLY verdicts it is quoted to support. | Point the column at the committed scenarios that carry the same live-run evidence (`.skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/session-relaunch-*.md`, already linked in §9) or delete the column. Do not keep a link into gitignored scratch. | no |
| b07-relaunch-adapters-002 | P2 | 51 | task brief § Markdown files — a stale or unclear claim is P2 | "Two installed Pi extensions both register `--fast`" names neither extension, and this checkout contains one such registration: `.pi/extensions/pi-fast-mode-w-subagent-support/src/index.ts:187` (`pi.registerFlag("fast", …)`). The other bundled extension, `.pi/extensions/pi-cache-optimizer/index.ts`, registers only the `cache-optimizer` command (line 9713) and has no `fast` registration in its git history, so a reader cannot reproduce the startup conflict the sentence uses to justify `-ne -e`. | Name both extensions and their paths (or the machine-level install the second one comes from); if only the fast-mode extension registers `--fast`, state the conflict that one causes and drop the count. | no |
| b07-relaunch-adapters-003 | P2 | 231 | task brief § Markdown files — a stale or unclear claim is P2 | §7 says "Run every session-relaunch Node test file" and gives `node --test .skilled/hooks/session-relaunch/tests/*.test.cjs` (line 236). The package's other suite, `pi/session-relaunch.test.ts` (Vitest, listed in the §8 tree at line 259), is not matched by that glob, so the only test command in this README never executes the 913-line Pi extension test — the only suite that covers `pi/session-relaunch.ts`. | Add the Vitest invocation (`.skilled/node_modules/.bin/vitest run --config .skilled/hooks/vitest.config.ts`) for `hooks/session-relaunch/pi/session-relaunch.test.ts`; that config is the one carrying the `../../.skilled/` symlink alias the file's imports need. | no |

## .skilled/hooks/session-relaunch/bin/session-relaunch.cjs
- language: cjs
- verdict: findings
| id | sev | line | rule (file § section) | finding | fix | behaviour-change |
|----|-----|------|-----------------------|---------|-----|------------------|
| b07-relaunch-adapters-004 | P2 | 160, 245, 293 | javascript/style-guide.md § 6. FORMATTING RULES (Line Length) — "Maximum: 100 characters." | Three lines exceed the stated maximum: 160 is 101 characters (`if (path.relative(realRepository, realDirectory) !== path.relative(repository, handoffDirectory)) {`), 245 is 102 (the `shellChildOfRuntime(runtimePid, runtime, processes = readProcessTableWithCommands(runtime))` signature) and 293 is 102 (the `process.stdout.write(`${core.manualClaimCommand(…)}`)` call). Every other code line in the 655-line file stays inside the limit. | Split the line 160 comparison into a named `sameRelativePath` value (or wrap the condition), put the `shellChildOfRuntime` default parameter on its own line, and break the line 293 write argument the way the neighbouring `process.stdout.write` calls already are. | no |

## .skilled/hooks/session-relaunch/claude/context-nudge.mjs
- language: mjs
- verdict: clean

## .skilled/hooks/session-relaunch/claude/stop-arm.mjs
- language: mjs
- verdict: clean

## .skilled/hooks/session-relaunch/codex/context-nudge.mjs
- language: mjs
- verdict: clean

## .skilled/hooks/session-relaunch/codex/prompt-seed.mjs
- language: mjs
- verdict: clean

## .skilled/hooks/session-relaunch/codex/shared.mjs
- language: mjs
- verdict: clean

## .skilled/hooks/session-relaunch/codex/stop-arm.mjs
- language: mjs
- verdict: findings
| id | sev | line | rule (file § section) | finding | fix | behaviour-change |
|----|-----|------|-----------------------|---------|-----|------------------|
| b07-relaunch-adapters-005 | P2 | 38 | code-quality-checklist.md § 7 KISS / DRY ENFORCEMENT (DRY Checks) — "Copy-paste branches with minor name changes" | `done`, `logEvent` and `spawnKiller` (lines 38-70) carry the same code as `claude/stop-arm.mjs:37-71` (claude adds two explanatory comments), and `armPendingRecord` (87-136) repeats the same read → `armableRecord` → transcript check → `arm` → spawn → return flow as `claude/stop-arm.mjs:88-156`; the only differences are the runtime string, the payload-event check and `findLoopChildPid` versus `resolveKillerTarget`. `hermes/session-end-arm.mjs:82-99` is a third copy of the spawn block. Three copies of a process-spawning path mean a fix to the spawn, log or unref contract has to land three times. | Extract the common stop/session-end arm flow into one shared module (runtime id, target resolver and an optional deferral predicate as parameters) and leave each adapter as the event-to-core wiring. | no |

## .skilled/hooks/session-relaunch/hermes/context-nudge.mjs
- language: mjs
- verdict: findings
| id | sev | line | rule (file § section) | finding | fix | behaviour-change |
|----|-----|------|-----------------------|---------|-----|------------------|
| b07-relaunch-adapters-006 | P2 | 5 | shared/code-organization/overview-and-module-organization.md § 2 FILE STRUCTURE PRINCIPLES → Standard File Sections — "Every significant file should have numbered sections" | The 109-line adapter runs imports (5-12) → constants (14) → helpers (16-49) → `main` (51-107) → entrypoint (109) with no numbered divider, while every sibling adapter carries numbered dividers (`claude/context-nudge.mjs` sections 1-5, `codex/shared.mjs` 1-5, `pi/session-relaunch.ts` 1-3). The verifier reports nothing only because `SECTION_REQUIRED_MIN_LINES = 150` (`verify_alignment_drift.py:141`), not because a hook path is exempt. | Insert `1. IMPORTS` (line 5), `2. CONSTANTS` (14), `3. HELPERS` (16), `4. CORE LOGIC` (51) and `5. ENTRYPOINT` (109) in the same 77-character line-divider form the sibling files use. | no |

## .skilled/hooks/session-relaunch/hermes/session-end-arm.mjs
- language: mjs
- verdict: findings
| id | sev | line | rule (file § section) | finding | fix | behaviour-change |
|----|-----|------|-----------------------|---------|-----|------------------|
| b07-relaunch-adapters-007 | P2 | 5 | shared/code-organization/overview-and-module-organization.md § 2 FILE STRUCTURE PRINCIPLES → Standard File Sections — "Every significant file should have numbered sections" | The 125-line adapter runs imports (5-19) → constants (21-24) → helpers (26-47) → `armPendingRecord` (49-109) → `main` (111-123) → export (125) with no numbered divider, while the sibling stop/session-end adapters carry the five-section form; the `armPendingRecord`/`main` boundary is exactly where this module's two responsibilities (arm-and-spawn, bridge entry) meet, so the missing sections are also a missing seam. The verifier's 150-line threshold (`verify_alignment_drift.py:141`) is why it reports nothing. | Insert `1. IMPORTS` (line 5), `2. CONSTANTS` (21), `3. HELPERS` (26), `4. CORE LOGIC` (49) and `5. ENTRYPOINT` (111) in the sibling adapters' line-divider form. | no |

## .skilled/hooks/session-relaunch/pi/session-relaunch.test.ts
- language: ts
- verdict: findings
| id | sev | line | rule (file § section) | finding | fix | behaviour-change |
|----|-----|------|-----------------------|---------|-----|------------------|
| b07-relaunch-adapters-008 | P2 | 1 | shared/code-organization/directory-and-test-conventions.md § 3 TEST FILE CONVENTIONS → Test File Location — "Tests live in the package's top-level `tests/` tree … A test never sits beside its source" | `pi/session-relaunch.test.ts` sits beside `pi/session-relaunch.ts`. The package's other twelve suites live in `tests/` (`tests/*.test.cjs`, `tests/adapter-conformance.test.cjs`, `tests/fixtures/`), and the sibling Pi package keeps its extension test at `.pi/extensions/pi-fast-mode-w-subagent-support/tests/extension.test.ts`. README §8 codifies the current location, so the placement is deliberate but still outside the recorded convention and outside the folder the README's §7 command sweeps. | Move it to `.skilled/hooks/session-relaunch/tests/pi-extension.test.ts`, change the `./session-relaunch` import to `../pi/session-relaunch`, and update the README §8 tree. The hooks Vitest `include` already covers `tests/**`. | no |
| b07-relaunch-adapters-009 | P2 | 635, 659 | typescript-checklist.md § 3. P1 - REQUIRED → No Non-Null Assertions Without Justification — "Non-null assertions (!) have a justification comment on the preceding line" | `match![1]` is used twice, guarded by `expect(match).not.toBeNull()` on the line above. The runtime check exists, but the required justification comment does not; `tsconfig.pi.json` does not include this test file, so no compiler check backs the `!` either — the assertion and the `!` are the only guarantees. | Add one justification line above each use (`// The expect() above pins match to a non-null array.`), or replace the pair with an explicit `if (match === null) throw new Error(...)` before indexing. | no |
| b07-relaunch-adapters-010 | P2 | 867, 878, 891 | typescript/style-guide/formatting-imports-and-coexistence.md § 2. FORMATTING RULES (Line Length) — "Maximum: 100 characters" | Three lines exceed the stated maximum: 867 is 105 characters (`arm({ loopId: ARM_LOOP_ID, cwd: '/workspace/pi', env: process.env, now: Date.now() - armedAgoMs });`), 878 is 110 and 891 is 112 (the `it('an arm …')` and `it('a re-arm …')` description lines). The section's exception list covers URLs, long type signatures and import paths, not test names, and the same file wraps its other long object arguments. | Break the `arm({ … })` object across lines the way the `preparePending({ … })` calls in the file already are, and split the two `it(...)` names with string concatenation as the `CONTINUITY_WRITER` constant at lines 40-41 already does. | no |

## .skilled/hooks/session-relaunch/pi/session-relaunch.ts
- language: ts
- verdict: findings
| id | sev | line | rule (file § section) | finding | fix | behaviour-change |
|----|-----|------|-----------------------|---------|-----|------------------|
| b07-relaunch-adapters-011 | P2 | 313 | typescript-checklist.md § 3. P1 - REQUIRED → TSDoc on Public API — "Exported functions, classes, and interfaces have TSDoc comments" | The extension's only export, `export default function sessionRelaunch(pi: ExtensionAPI): void`, carries no TSDoc, while the sibling Pi extension documents its default export (`.skilled/hooks/post-edit-quality/pi/post-edit-quality.ts:18`) and this file documents its internal helpers closely (`checkedCore`, `resolveKillerPath`). The public entry is the one undocumented function. | Add a one-line TSDoc above line 313, for example `/** Register the message_end, before_agent_start and agent_end hooks on the Pi extension host. */`. | no |
| b07-relaunch-adapters-012 | P2 | 212 | code-quality-checklist.md § 7 KISS / DRY ENFORCEMENT (KISS Checks) — "New abstraction layers without a current behavior need" | `resolveKillerPath` loads `node:fs` through `asModule(await import('node:fs' as string))` (lines 212-214) just to call `existsSync`, although the same file statically imports `node:child_process` and `node:path` (lines 5-6) and the sibling Pi extension imports `existsSync` statically. The `as string` cast and the default-unwrapping wrapper buy nothing for a built-in specifier, and they keep the dependency out of the import block where the rest of the module's built-ins are visible. | Add `import { existsSync } from 'node:fs';` beside the other built-ins, call `existsSync(candidate)` directly, and drop the local `asModule` wrapper. | no |

TOTAL: P0=0 P1=1 P2=11 files=12

---
title: "Research: session relaunch loop after phase 009 (deepseek-pi lineage)"
description: "Five-iteration lineage synthesis of the drift, latent bugs, parity gaps and standards gaps left in the session relaunch loop after phase 009, with file:line evidence and a concrete fix per finding."
trigger_phrases:
  - "session relaunch research after phase 009"
  - "relaunch loop drift"
  - "deepseek-pi lineage research"
importance_tier: normal
contextType: research
---

# Research: Session Relaunch Loop After Phase 009

Lineage `deepseek-pi` of `specs/hooks/023-session-relaunch-loop/010-post-fix-research/`, executor
`cli-pi` (`deepseek-v4.1-flash`, reasoning max), five iterations, stop policy `max-iterations`.
Findings already verified and fixed by phase 009 were out of scope by instruction; every finding
below was read at the cited line in this run.

## 1. Method

Each iteration took one focus, read the cited sources, and wrote its narrative, its delta and its
state record through the append gateway. Prior art (`research/research.md`,
`009-research-fixes-and-core-consolidation/implementation-summary.md`) was read first so no
re-find was reported. Confidence is per finding: a defect is "read at line", a consequence is
traced through the named control flow, and where a test pins the current behaviour the test is
cited as part of the finding.

## 2. Verified Findings

Twenty findings: two P1, fourteen P2, four P3.

### P1

| ID | Finding | Evidence | Fix |
|---|---|---|---|
| 1 | `arm()` returns an already-armed record verbatim, so a re-arm after a killer death keeps the first arm's `armedAt`; `shouldRelaunch` then reports `stale` and the wrapper consumes the record and prints the manual command instead of relaunching | `lib/relaunch-core.cjs:361`, `:445`; all four arm paths: `claude/stop-arm.mjs:100`, `codex/stop-arm.mjs:107`, `hermes/session-end-arm.mjs:74`, `opencode/session-relaunch.js:285`; `.skilled/bin/skilled-loop:520`; pinned by `tests/relaunch-core.test.cjs:488` | Re-persist `{ ...record, armedAt: toIsoTimestamp(now), cwd }` in the armed branch and update that assertion |
| 12 | "Is this record mine and still armable" has six implementations and three condition sets: Claude checks record+session, Codex adds `loopId`, Hermes/OpenCode/Pi check session+runtime, `nudge.handoffPending` a sixth variant. A record for another runtime is refused by three arm paths and accepted by two | `claude/stop-arm.mjs:96`,`:100`; `codex/stop-arm.mjs:100`,`:107`; `hermes/session-end-arm.mjs:66`,`:74`; `opencode/session-relaunch.js:279`,`:285`; `pi/session-relaunch.ts:271`,`:275`; `lib/nudge.cjs:382` | One `core.armableRecord(record, { loopId, sessionId, runtime, env })` returning `{ armable, reason }`, called by all five arm paths |

### P2

| ID | Finding | Evidence | Fix |
|---|---|---|---|
| 1 | `HANDOFF_SECTIONS` is declared twice: the core freezes the list `validateHandoff` enforces, `nudge.cjs` keeps a mutable copy and prints it as "exactly this shape" | `lib/relaunch-core.cjs:22`,`:265`; `lib/nudge.cjs:30`,`:107` | Export `HANDOFF_SECTIONS` from the core and require it in `nudge.cjs` |
| 5 | The handoffs directory is declared twice and `nudge.handoffDir` is not exported, so the CLI cannot share it; a layout change fails as "handoff path must be inside the session-relaunch handoffs directory" | `lib/nudge.cjs:243`,`:488`; `bin/session-relaunch.cjs:128`,`:141` | Export `handoffDir` and derive the CLI's segments from `path.relative(repoRoot, handoffDir(root))` |
| 6 | `print_manual_command`'s fallback half cannot run, and it duplicates `core.manualClaimCommand`'s escape set and `RUNTIME_SEED_OPTIONS` | `.skilled/bin/skilled-loop:42`,`:49`,`:59`,`:239`,`:393`,`:169`,`:175`; `lib/relaunch-core.cjs:26`,`:584` | Delete the fallback and raise a visible error when the template is unusable; reconcile the stderr/stdout split (`skilled-loop:65` vs `session-relaunch.cjs:292`) |
| 7 | `refuseForShellChild` trusts `CLAUDE_PID` without the descent check `resolveKillerTarget` applies to the same variable | `bin/session-relaunch.cjs:265`; `lib/relaunch-core.cjs:844`; `claude/stop-arm.mjs:131` | Verify with `core.findLoopChildPid` and fall back to the loop-child walk |
| 9 | Two adapter "target lookup" tests assert the core through an alias with the same table and the same 41-to-60 expectation the core test already asserts | `codex/stop-arm.mjs:143`; `hermes/session-end-arm.mjs:140`; `tests/codex-adapters.test.cjs:504`; `tests/hermes-adapters.test.cjs:292`; `tests/relaunch-core.test.cjs:919` | Drive Hermes' `armPendingRecord` with its seam; hoist Codex's call into an identical exported `armPendingRecord` |
| 10 | The conformance table has no arm case, so the decision it exists to protect is outside it | `tests/adapter-conformance.test.cjs:6`,`:233`,`:258`,`:279` | Add an `ARM_CASES` table over a prepared pending record with an injected process table |
| 13 | The runtime identity is a bare string in five files and an array in a sixth; one rename has to be found in eight places | `bin/session-relaunch.cjs:17`; `hermes/session-end-arm.mjs:70`; `opencode/session-relaunch.js:280`; `pi/session-relaunch.ts:272`; `claude/context-nudge.mjs:109`; `codex/shared.mjs:113`; `lib/relaunch-core.cjs:26` | Export a frozen `RUNTIMES` from the core and build `LOOP_RUNTIMES` from it |
| 14 | Three of five entrypoints run on import, which is why the arm paths cannot be tested in-process | `claude/stop-arm.mjs:154`; `claude/context-nudge.mjs:120`; `hermes/context-nudge.mjs:109`; `codex/context-nudge.mjs:15`; `codex/prompt-seed.mjs:15` against `codex/stop-arm.mjs:141`, `hermes/session-end-arm.mjs:138` | Add the `isMain()` guard to all five and export `armPendingRecord(payload, dependencies)` |
| 16 | The README's test command omits `tests/adapter-conformance.test.cjs`, and its tree says nine test files where ten exist | `README.md:195`,`:235` | Add the file, or replace the list with the glob `tests/*.test.cjs` |
| 17 | The concern's README carries no frontmatter while every sibling hook README and its own tests README do | `README.md:1`; `tests/README.md:1` | Add the four-field block |
| 18 | The environment reference documents every caller-facing switch and no `SKILLED_LOOP_*` variable | `ENV-REFERENCE.md:108`,`:113`,`:114`; `.skilled/bin/skilled-loop:393`,`:395`,`:396`,`:397`; `bin/session-relaunch.cjs:394`,`:427` | One row per variable, naming the exporter as the source |
| 19 | The bounded process-table read is implemented three times with the same literal bound, and the copies disagree on failure | `lib/relaunch-core.cjs:772`; `lib/killer.cjs:188`; `bin/session-relaunch.cjs:214`; `universal-checklist.md:193`,`:210` | `core.readProcessTable({ withCommand, timeoutMs })` behind one named constant |
| 20 | The packet this research feeds names a branch its predecessor and parent no longer use, and keeps scaffold placeholders | `010-post-fix-research/spec.md:3`,`:25`; `023-session-relaunch-loop/spec.md:34`; `009-.../spec.md:26` | Set `Branch` to the parent's worktree and author the requirement rows before `validate.sh --strict` |

### P3

| ID | Finding | Evidence | Fix |
|---|---|---|---|
| 3 | `manualClaimCommand` reads `process.env` where every sibling helper takes `env`, so one killer function unarms under one environment and notifies under another | `lib/relaunch-core.cjs:596`; `lib/killer.cjs:499`,`:516`; `tests/relaunch-core.test.cjs:793` | Add `env = process.env` as a fourth parameter |
| 4 | The Pi adapter hand-declares four of the core's exports in a local type no compiler checks against the `.cjs` | `pi/session-relaunch.ts:25`,`:277` | Assert at run time that each declared name is a function on the required module |
| 8 | `main()`'s unknown-command message hardcodes the subcommand list `SUBCOMMANDS` owns | `bin/session-relaunch.cjs:24`,`:605` | `Object.keys(SUBCOMMANDS).join(', ')` |
| 11 | `tests/README.md` pins an exact five-line summary that adding a test invalidates, in the same file that tells a contributor to add tests | `tests/README.md:82`,`:98` | State the invariant (`fail 0`, `cancelled 0`, `skipped 0`) and describe the total as growing |
| 15 | A payload with no event name is accepted by Claude and Hermes and dropped by Codex, and the policy is stated nowhere | `claude/context-nudge.mjs:42`; `hermes/session-end-arm.mjs:61`; `codex/shared.mjs:69` | One `hooksEvent(payload, expected, { inferFromPrompt })` predicate |

## 3. Eliminated Alternatives

- **Searching for a `noteState` divergence between the OpenCode plugin and the CLI.** Phase 009's
  B1 fix landed in every reader; both call `core.noteState`.
- **Treating Claude's missing `record.loopId` guard as a defect.** `readRelaunchFile` resolves the
  path from the same `loopId`, so a mismatched field cannot occur through the public API.
- **Treating `resolveKillerTarget`'s refusal to arm without a process table as a defect.** It fails
  closed before arming, which is the cheaper failure.
- **Reporting `prepare`'s `cwd: process.cwd()`.** `arm()` overwrites the record's `cwd` from the
  live hook payload.
- **Reporting the note's unused `cwd` and `loop_id` frontmatter.** Documented provenance, not
  inputs any reader is told to consume.
- **Auditing `handoffPathWithinRepo`'s symlink containment.** Phase 009's L1 fix holds.
- **Proving the tests README's 510 total by a static count.** Loop-generated cases and node's
  subtest accounting make it unreliable; the finding is the snapshot, not the number.
- **Reporting the `opencode/session-relaunch.js` browsability symlink.** Its target resolves to
  `.opencode/plugins/session-relaunch.js`, which the README documents.
- **Auditing comment density and line length.** P2 items, and the sources comply.

## 4. Divergence Map

No divergent pivots: five sequential focuses, one per iteration, none saturated. The run
deliberately walked five angles instead of converging early, under `stopPolicy: max-iterations`:

1. the core consolidation against its call sites;
2. the CLI and the wrapper;
3. what the tests actually assert;
4. adapter parity;
5. standards alignment across sources, docs and record.

Frontier left unexplored at the cap: the killer's lock lifetime against the wrapper's freshness
gate; the `cursor` and `devin` command-only paths, which no adapter test reaches at all; and the
packet's own `tasks.md` and `acceptance-criteria.md` scaffolds.

## 5. Recommended Order

1. **P1 first, with a failing-first test each.** Finding 12's `armableRecord` gives the arm guard
   one owner, and finding 1's `armedAt` refresh is a two-line change in the same function — the
   two land together. Change the assertion at `tests/relaunch-core.test.cjs:488` deliberately.
2. **The duplications, as one pass.** Findings 1, 5, 13, 19 and 3 add the exports (`handoffDir`,
   `RUNTIMES`, `HANDOFF_SECTIONS`, an `env` parameter) that make each call site deletable.
3. **The test reach, after the exports exist.** Findings 14 then 9 and 10: the `isMain()` guards
   and `armPendingRecord` exports are what let the conformance table grow an arm row.
4. **The docs, last, against the code as it then stands.** Findings 16, 17, 18, 11, 15, 8 and 6.
5. **The record, before closing the packet.** Finding 20.

## 6. Convergence Report

- Stop reason: maxIterationsReached
- Total iterations: 5
- Questions answered: 5 / 5
- Remaining questions: 0
- Last 3 iteration summaries: run 3: what the tests actually assert (0.75); run 4: adapter parity (0.8); run 5: standards alignment (0.8)
- Convergence threshold: 0.1
- Divergence summary: no divergent pivots recorded

## 7. Open Questions

None carried forward. The three frontier items above are recorded for a future run, not as open
questions this lineage owed an answer to.

## References

All findings cite repository-relative paths and line numbers inline; no `resource-map.md` existed
at init, so no map citation is made.

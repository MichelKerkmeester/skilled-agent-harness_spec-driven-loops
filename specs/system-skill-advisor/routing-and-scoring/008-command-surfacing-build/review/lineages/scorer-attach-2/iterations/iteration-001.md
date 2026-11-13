# Review Iteration 001

## Dispatcher

- Run: `fanout-scorer-attach-2-1794570021136-noekp0` (lineage `scorer-attach-2`, pass two, area `scorer-attach`)
- Mode: review; executor: in-process (no nested dispatch)
- Dimension: correctness
- Review focus addressed: pass two asks for three things in order. This iteration takes step (1) for the correctness-shaped pass-one fixes in the `scorer-attach` area — re-read each fix and say whether it holds — and starts step (2) on the two changed test files, because a fix is only held if the test that pins it can fail for the right reason. The operator focus (`review_focus` in config) binds this lineage to re-reading pass-one fixes and then finding new defects; step (1) is that re-read.
- Budget profile: `verify` (11-13 calls), used 12.

## Files Reviewed

- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:1-366` (whole file, changed)
- `.skilled/skills/system-skill-advisor/runtime/tests/command-attach.vitest.ts:1-207` (whole file, changed)
- `.skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts:1-88` (whole file, changed)
- `.skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/derive-command-bridges.cjs:1100-1274` (changed generator region)
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:660-839` (changed region around the deleted empty branch)
- `.skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts:420-539` (call sites of the three fixed functions)
- Executed: `env -u AI_SESSION_CHILD npx vitest run tests/command-attach-guards.vitest.ts tests/command-attach.vitest.ts` → 2 files, 24 tests, exit 0.

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **The gate assertion at `command-attach.vitest.ts:120` cannot fail for the reason its comment names** -- `.skilled/skills/system-skill-advisor/runtime/tests/command-attach.vitest.ts:120` -- The comment at `:118-119` says the depth gate belongs to the deep-loop hub alone and that every other hub answers the same effort-free prompt with its command. The assertion handed `attachCommand` the `INJECTED` table, which holds only `sk-create-readme`, and asked for mode `sk-create-benchmark`. `attachCommand` returns undefined at `command-attach.ts:336` because the injected table does not hold that mode, so the depth gate at `:343-346` never runs. The line therefore proves table lookup, not the gate; a regression that made every hub consult `DEPTH_REQUEST` would leave this line green and be caught only by the neighbouring `:121`.
   Finding class: vacuous_test_assertion
   Scope proof: both files are inside the declared `scorer-attach` scope (`runtime/lib/command-attach.ts`, `runtime/tests/command-attach.vitest.ts`), and the assertion is reached through the same `sk-doc` single-mode route the test builds.
   Affected surface hints: command-attach test suite; non-deep-loop hub gate regression coverage; generated `MODE_COMMANDS` table.
   Case: `attachCommand('sk-doc', { action: 'route', selectionKind: 'single', targets: [{ workflowMode: 'sk-create-benchmark' }] }, 'how does the routing table pick a skill', INJECTED)` returns undefined at the mode lookup (`command-attach.ts:336`) before the depth gate is consulted, so the assertion passes whether or not the gate is hub-scoped.

## Pass-One Fix Re-Read (scorer-attach area)

| Pass-one id | Cited line then | Current location | Holds? | Guard |
|---|---|---|---|---|
| `R2-P2-001` | `command-attach.ts:353` | `command-attach.ts:329` — `if (NO_EDIT_REQUEST.test(prompt.toLowerCase())) return undefined;` | Yes | `command-attach-guards.vitest.ts:25-28` fails today if reverted; executed green |
| `R1-P2-001` | `command-attach.ts:385` | `command-attach.ts:343-346` — `typesThisCommand = typedCommandIn(prompt) === commands[workflowMode]` | Yes | `command-attach-guards.vitest.ts:41-51`, including the unknown-command case `/deep:reviw` |
| `R1-P2-002--95282927956e` | `command-attach.ts:266` | `command-attach.ts:217-219` — `continuesName` covers `[a-z0-9_:-]` and `('/'|'.')+word` | Yes | `command-attach-guards.vitest.ts:59-81`; `/create:skill.` still reads at `:68` |
| `R4-P2-001--d1528b81a2ca` | `command-attach.ts:123` | block deleted; `TRACKED_COMMANDS` remains the only policy table | Yes | `command-attach-guards.vitest.ts:85-87` asserts the export is absent; repo-wide search finds `COMMAND_POLICIES` only in pass-one spec prose |
| `R4-P2-002--828881666f76` | `fusion.ts:750` | empty branch gone; `fusion.ts:751-753` carries a body | Yes | brace scan finds no empty `if` body in the file |

Line drift is expected: deleting the `COMMAND_POLICIES` block shortened `command-attach.ts` from about 399 lines to 366, so the pass-one citations no longer point at the fixed code. Each fix was located by content, not by the old line number.

## Traceability Checks

- `spec_code` — partial. The no-edit rule (R2-P2-001) and the typed-command ownership rule (`typedCommandForTop`, `command-attach.ts:239-246`) are implemented as the pass-one decisions describe. Packet-level acceptance rows were not read this iteration; they are the traceability iteration's job.
- `checklist_evidence` — pending. No packet checklist claim was in this iteration's focus.
- `feature_catalog_code` — pending for `feature-catalog/scorer-fusion/command-meaning-matching.md`, which is the changed doc in this area; scheduled for the traceability iteration.
- `skill_agent`, `agent_cross_runtime`, `playbook_capability` — pending / notApplicable (no playbook surface in a command-attach test).

## Integration Evidence

- `.skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts:474` is the only production reader of `attachCommand`; the no-edit gate is upstream of the `command` key, so the public recommendation simply omits the command.
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:20` imports `NO_EDIT_REQUEST` from `command-attach.ts`, and `:677` / `:881` apply it. The gate the pass-one fix added is the same pattern the scorer already honours, so the two paths cannot drift by copy.
- `.skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts:483` reads policy from `TRACKED_COMMANDS`, which is why deleting `COMMAND_POLICIES` did not strip policy from the 11 commands the deleted table lacked.
- `command-attach.ts:344` compares `typedCommandIn(prompt)` to the attached command, so the fix lives in the same module that owns the typed-command parser rather than in the handler.

## Edge Cases

- **Line drift after a deletion.** Pass-one cited `command-attach.ts:266`, `:353` and `:385`; those lines no longer exist. Each fix was verified by reading the current rule and running the guard that pins it. Recorded here so a later iteration does not read the pass-one table as current line numbers.
- **Longest-match command parser.** `typedCommandIn` returns one command — the longest key that passes the boundary test (`command-attach.ts:221`). A prompt that names two tracked commands opens the deep-loop gate only for the longer one. Reach is narrow (the gate then falls back to `DEPTH_REQUEST`), and the behaviour is conservative (it withholds rather than offers), so it is recorded, not raised.
- **Two ids, one runnable.** `COMMAND_ROWS` holds `command-deep-research` and `command-spec-kit-deep-review` alongside `command-deep-review`, all mapping to a shared runnable. Read as data, not as duplication: the generator's `renderCommandRows` (`derive-command-bridges.cjs:1167-1173`) collapses identical rows per id and throws on a conflicting one.

## Confirmed-Clean Surfaces

- `command-attach.ts:207-228` — boundary parser: `[a-z0-9_:-]` continuation, `/` and `.` + word continuation, sentence-final period still ends a command; exercised by six guard tests.
- `command-attach.ts:308-349` — route shape narrowing (own-key lookup at both levels, single target only, non-empty `workflowMode`) is unchanged and still guarded by the ten-row table at `command-attach.vitest.ts:74-100`.
- `derive-command-bridges.cjs:1149-1217` — row emission after the deletion: duplicate-id throw, tracked-command conflict throw, and `mutating` omitted rather than defaulted.
- `fusion.ts:675-735` — `readOnlyRouteAllowed` rejects a no-edit prompt before any lift, matching the attach path.

## Ruled Out

- **The no-edit gate can create a false `needsMode` label.** Ruled out: `attachCommand` only reaches the gate after `route.action === 'route'` (`command-attach.ts:316`), while `routeNeedsMode` requires `defer` or `clarify` (`:364`), so the two cannot both fire for one route.
- **The no-edit gate silently withholds a command the reader typed.** Ruled out by design: `typedCommandForTop` (`command-attach.ts:239`) does not consult `NO_EDIT_REQUEST`, so an explicitly typed command still travels; `AGENTS.md:68` states an explicit instruction outranks the policy.
- **Deleting `COMMAND_POLICIES` stripped policy from commands only that table held.** Ruled out by the pass-one probe re-check: the live reader is `TRACKED_COMMANDS` (`advisor-recommend.ts:483`) and the generated `TRACKED_COMMANDS` block (`command-attach.ts:123-187`) holds all 62 runnables, including `/create:benchmark`, `/create:command`, `/deep:ai-council`, `/design:chart`, `/design:diagram` and `/design:extract`.
- **The deep-loop gate can be opened by a non-deep-loop hub.** Ruled out at `command-attach.ts:343`; only `skillId === 'system-deep-loop'` enters the branch, and the one test that asserts the general case is the vacuous line reported above (which is why the gap is a test finding, not a code finding).

## Next Focus

- Dimension: security
- Focus area: safety of offering a mutating command — `TRACKED_COMMANDS` policy vs `mutating` class, `COMMAND_ROWS` rows whose policy is `run`, and the `policy`/`mutating` pair the recommend path emits (`advisor-recommend.ts:478-485`, `render.ts` consumption read only as context).
- Reason: the pass-one area summary claimed no `run` row writes; that claim is the security-shaped fix surface and must be re-proven against the changed tables, not re-read from the old report.
- Rotation status: correctness complete (PASS), security next.
- Blocked/productive carry-forward: correctness was productive (one test-quality finding); no blocked approach.
- Required evidence: executed whole-table invariant over `COMMAND_ROWS`, plus the recommend-path policy source.

Review verdict: PASS

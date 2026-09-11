# Iteration 5: The record's own failures, and the cheap-fail-first checklist

## Focus

Two closing questions. First: where is the packet's own record wrong, stale or self-contradictory, separated by kind. Second: the repeatable checklist for the next MCP-to-CLI migration, ordered so that each step's failure is cheap — derived from the class and residue findings rather than from the packet's phase order.

## Part 1: The record

### C1 — Status contradiction: the parent's progress table is the inverse of the truth

The parent `goal.md` §Progress rows for phases 004 through 008 all read `Pending` with empty evidence cells, and the §DONE WHEN table is empty in every row, including "The latency delta is reported and inside budget". Against that:

| Phase | What exists at HEAD |
|---|---|
| 004 | Closed by `91fd9b6226 docs(skill-advisor): close phase 4 and hand phase 5 its deletion blockers`; its own goal log carries a full `Done` progress table including the three-daemon-state proof |
| 005 | Deregistration shipped in `eb53802beb`, plugin bridge deleted in `077dbf804d`; its goal log records both as `Done` |
| 006 | `implementation-summary.md` records 407 renames, `completion_pct: 100`, a verification table and three defects fixed on the way; the rename is commit `3feab865ea` |
| 007 | `implementation-summary.md` records the sweep with measured counts (retired ids 13→0, `MCP server` 115→12, 160 documents validated); commit `afd10f291f` finishes it |
| 008 | `latency-delta.md` exists in the phase folder with final-state measurements against the phase 2 budget |

This is the most consequential error in the packet, and it is the same error class as the residue findings: a reader cannot tell the present from the past. A session resuming from the parent packet — which is what the packet's own recovery ladder tells it to do — concludes that five of eight phases never ran, when in fact the last phase folder already holds its own telemetry. The fix is not a rewrite: it is the completion-metadata reconciliation that the framework's completion rule already requires.

### C2 — Phase logs left as scaffolds beside shipped work

`005-mcp-transport-removal/goal.md:103-105` says `Phase planned`, `Phase executed` and `Acceptance rows closed` are all `Pending`, while the same file's progress table records deregistration and the bridge deletion as `Done`. `006-runtime-package-rename/goal.md` has all three rows `Pending` while `006/implementation-summary.md` claims 100 % completion. `008-verification-and-closeout/implementation-summary.md` says "Not started. The planning artifacts exist and bind the work" while `latency-delta.md` sits beside it with measured numbers. `009` and `010` goal logs are untouched templates.

The distinction from C1 matters: C1 is a summary that was never updated; C2 is a phase whose *own* log contradicts its *own* summary. Both are cheap to fix and neither is a factual dispute — but a reader who trusts goal logs over summaries, which the recovery ladder orders first, gets the wrong answer.

### C3 — One number, two labels

`003-cli-front-door-parity/parity/report.json` records `"allowlisted": 15, "differed": 0`; the sibling `verdict.md:27` labels the same fifteen `Differing`. The phase goal log uses the report's framing ("7 matched, 15 allowlisted, 0 differed"). There is no factual disagreement — the verdict explains the allowlist immediately below the table — but the label that reads like failure is the one a skimming reader meets first, and a reader reconciling the packet's counts has to notice that "Differing 15" and "differed 0" are the same fact.

### C4 — Limitations superseded after they were written

007 limitation 2 reports four pre-existing red tests as "raised, not fixed". The later commit `9015d00c79` rewrote `runtime/tests/rename-invariants.vitest.ts` (57 added / 30 removed), reduced `runtime/tests/system-skill-advisor-plugin.vitest.ts` (29/49) and `runtime/tests/skill-advisor-cli-dual-client.vitest.ts` (39/100), and deleted `plugin-bridge.vitest.ts` and `plugin-bridge-smoke.vitest.ts` outright. 006 limitation 2 — that `launcher-bootstrap.vitest.ts` asserts the committed MCP trust default removed by `eb53802beb` — is likewise superseded: the same commit edited that file.

So the packet's final limitations sections describe a state two commits old. This is not sloppiness so much as ordering: the summaries were written at phase close and the cleanup landed in the packet's final commit, and nothing required the limitations to be re-read afterwards.

### C5 — An item still headed OPEN whose fix is in the source

`004-caller-rewire/goal.md:119` heads finding F18 `OPEN: warm-only on the prompt path`, and the phase's progress row "Brief proven per runtime with MCP still registered" is still `Pending`, while the resolution is explicit in source — the CLI invocation carries `--no-warm-only` with the reason in the comment (`hooks/lib/skill-advisor-cli-fallback.ts:242-246`) — and the phase was closed by `91fd9b6226`. The row about the runtime proof is more interesting than the F18 heading: it was left pending because the advisor's MCP server was failing to connect in that session, and the eventual proof came through a different route entirely (every runtime executes one compiled hook module). A pending row can therefore record a question that stopped being a question.

### C6 — A reopened phase whose fix landed under no phase's name

003's progress row reads `Wire migration | REOPENED`, with the reason recorded honestly: "I closed its criteria on those artifacts rather than on what the contract said the phase owed. The CLI still sends `initialize` and `tools/call`" (`003-cli-front-door-parity/goal.md:102`). At HEAD no `tools/call` remains anywhere in the advisor runtime source; the client sends `initialize` with `advisorProtocol` and then `advisor.call` (`skill-advisor-cli.ts:22,1296-1304`). The replacement landed in `3def6d6c9b feat(skill-advisor): replace the MCP wire with the advisor's own protocol`, whose message names no phase, after `f4bf73e682 docs(skill-advisor): reopen phase 3, and record why the transport could not go yet`.

Two observations. The self-declaration — a phase admitting it closed on the wrong artifacts — is the most valuable single line in the packet's record and it is what caused the gap to be reopened rather than buried. And the work that closed the gap lives in no phase's log, because the reopened phase had already been marked done and the commit that finished the job was framed as transport work.

### C7 — A figure in the driving brief that the record does not support

The research brief states "26 tests of a deleted file and 7 asserting removed registrations". Neither count is reproducible from the packet: the two deleted bridge suites hold 10 test cases in total (9 + 1), `rename-invariants.vitest.ts` holds 4 (3 failing, 1 passing), the retired `tests/parity/cli-vs-mcp-parity.cjs` reads 22 frozen cases from phase 003's input set, and `system-skill-advisor-plugin.vitest.ts` failed 27 of 41. The nearest verifiable figures are recorded here so the claim does not propagate. This is an external-framing correction, not a packet contradiction: the packet never states those numbers.

### C8 — A handoff with no receiving record

005 recorded the retrieval fixture as "Data rather than a caller; handed to phase 7" (`005-mcp-transport-removal/goal.md:15`). The fixture survives at `.opencode/skills/system-spec-kit/runtime/cli/retrieval/fixtures/phrase-variants.json:60670`, 007's summary never mentions it, and 007's scope was the advisor skill directory while the fixture lives in `system-spec-kit`. A repo-wide count of the retired tool id returns 3, and every survivor has a classification except this one: a legitimate negative assertion in a route-contract test, a deliberately kept changelog line, and the unaccepted handoff.

### What the record gets right

Worth stating, because it shapes how the rest should be read. 002 discarded a benchmark run whose socket path exceeded the Darwin limit rather than reporting the 87 ms numbers. 003 declared its own closure premature. 006 recorded the defects it fixed on the way *and* the three pre-existing failures it did not. 007 raised code defects instead of fixing them in place. 004 recorded that its own fast-fail fix was worse than the bug, with the numbers. The record's problem is staleness at the edges, not inflation — which is the opposite of the usual failure and makes it a usable case study.

## Part 2: The checklist

Five stages, ordered so that the cheapest failures come first and the steps that are only available before the removal are gates.

### Stage 0 — before anything is touched (cost: reading and capturing)

1. **State the bar as operator-visible behavior, and capture the before-image from the worktree the change will land in.** Store the exact output on a frozen input set. *Catches:* every later "it looks the same" claim; it is the artifact that caught F19 and the artifact whose absence invalidated 004's first comparison, which measured the old path in the main checkout against the new one in a worktree and "flattered the change".
2. **Enumerate callers and automatic behaviors, and classify each by who starts it.** *Catches:* the hook that is one file rather than four (F15) and the plugin's call on a path nobody lists.
3. **For every config block to be deleted, enumerate its members — values and commentary — before deleting it, and name the new owner of each.** *Catches:* R1. A block holds policy, not only transport: the trust grant and the doc-trigger flag here, plus five `_NOTE_*` keys whose content survives only in git.
4. **Search for the string you are about to rename outside the tranche you own, and record the count with an owner.** *Catches:* R5, which is measured here at 603 surviving references and began with a hook path hardcoded in a sibling package.
5. **For each name being renamed, enumerate its aliases in one owned table and decide each alias's fate.** *Catches:* R8. The working form exists elsewhere in this repository (`.opencode/hooks/shared/hook-flags.cjs:43-63`); the failing form is an inline `NAME ?? NAME` chain repeated per consumer.
6. **Read every live operator surface that describes the thing being removed, and classify each sentence past-tense or present-tense.** *Catches:* R6. A past-tense sentence is a record and stays; a present-tense one becomes false and, if it is a diagnostic, will act on the world.
7. **Write the preserve set, with a proof for each item now rather than later.** *Catches:* silent capability loss, which is the one failure D2 forbids.

### Stage 1 — prove the replacement while both paths still exist (cost: one scratch environment)

8. **Promote the fallback to primary in a scratch environment and diff its observable against the primary's, byte for byte, in the same worktree.** *Catches:* F19 and M1-M3 as a group. This is the highest-yield step in the list and it is only available here — after deletion there is no second path to compare against.
9. **For every value the promoted path reads, check its assumption against the module that owns that value.** *Catches:* M1 (a flat socket path where the owner scopes) and M2 (a 250 ms budget under a 440 ms call). *Rule:* assert equality of two derivations, never a literal — a literal written from the implementation passes on the defective revision.
10. **Time the degraded path and assert a content contract on the degraded answer.** *Catches:* M4 (the 30-second fallback on a path where latency is the point) and M5 (a degraded answer with one recommendation and no route line). *Rule:* "degraded" must be asserted on content, not status; and a speed-up on a degraded path is presumptively a defect until the work it stopped is accounted for.
11. **Exercise the replacement in all three backend states — warm, cold, unreachable — and record a number for each.** *Catches:* the cold path, which is the one a real session hits first.
12. **Run the whole suite once and record the pre-existing red set.** *Catches:* unattributable failures later. This packet had a stale case two commits before it began and four pre-existing red suites; without the baseline, post-change reds cannot be assigned.

### Stage 2 — the removal

13. **Delete the transport, and retire or repoint every test that named it in the same commit.** *Catches:* the three deletion blockers 004 handed to 005, each of which breaks the moment the bridge goes.
14. **Deregister from every runtime, then verify the operator-visible behavior survives with zero declarations.** *Catches:* a partial deregistration that leaves one runtime wired.
15. **Rename only after the deletion; carry every resolving path, rebuild every package that runs from `dist`, and delete the pre-rename build output.** *Catches:* the three rename defects 006 fixed on the way — one of which required a sibling package rebuild — and the "missed reference that keeps working until a clean build" trap.
16. **Re-run the before-image diff, the three-state battery and the latency comparison from the final state.** *Catches:* the regression the change introduced, and the claim that the change is a like-for-like comparison.

### Stage 3 — post-removal battery (these cannot succeed earlier)

17. **Run the whole suite; attribute every red to the recorded pre-existing set or fix it in place.** *Catches:* R2. Red tests are found by tooling — the only requirement is that a full suite runs.
18. **Re-read every live operator surface for present-tense claims about the removed thing, and fix the ones that now lie.** *Catches:* R6's dangerous half — the diagnostic that invites an operator to re-register the removed transport.
19. **Diff the machine state the migration touched: status files, shared counters, stray daemons.** *Catches:* R7, which no corpus search reaches.
20. **Run a concept-keyed residue search as well as a token-keyed one — `legacy`, `alias`, `fallback`, `still recognized`, `deprecated`, `old name`.** *Catches:* R8 and any class whose carrier does not name the removed thing.
21. **Decide regenerate-or-defer for every generated artifact, record the reason and the owner, and check whether any generator's output constrains what may be renamed.** *Catches:* R4 — including the converse case where a generated index sets the boundary for the documentation sweep.
22. **Reconcile the record: phase status rows, the parent's progress and evidence tables, and every handed item against its receiver's scope.** *Catches:* C1, C2 and C8, and it is cheap — but it must run after the last edit, because it attests to the final state.

### The ordering rule the checklist encodes

> **Filter the list by availability, then by cost.** A check that can only run while both paths exist is a *gate* on the removal; a check that can only run afterwards is a *step in a battery*. Cost then orders within each set.

That rule is why the checklist is not a residue sweep in phase order. The packet's phase order (prove, rewire, delete, rename, sweep, verify) is correct for the work, and it puts the highest-yield check (step 8) in the right place — 004 ran the promotion before 005 deleted the transport, which is why the defects were findable at all. What it does not do is separate the checks that *require* that coexistence from the ones that merely happened to run there.

## Sources Consulted

- `../../goal.md` §Progress and §DONE WHEN (parent) — the pending rows and the empty evidence table
- `../../004-caller-rewire/goal.md:103-119` — the Done progress rows, the pending runtime-proof row, F18 still headed `OPEN`
- `../../005-mcp-transport-removal/goal.md:15,103-105` — the fixture handoff and the pending phase rows
- `../../006-runtime-package-rename/implementation-summary.md` — completion_pct 100, 407 renames, verification table, limitations 1-3
- `../../007-docs-and-residue-sweep/implementation-summary.md` — sweep counts, limitation 2, decisions
- `../../008-verification-and-closeout/implementation-summary.md` and `latency-delta.md` — "Not started" beside measured final-state numbers
- `../../003-cli-front-door-parity/goal.md:102` and `parity/report.json:1-6`, `parity/verdict.md:26-27` — the reopened row and the 15-number labelled twice
- `git log`/`--numstat`: `9015d00c79`, `afd10f291f`, `91fd9b6226`, `3def6d6c9b`, `f4bf73e682`, `eb53802beb`, `077dbf804d`, `3feab865ea`
- `.opencode/skills/system-skill-advisor/runtime/skill-advisor-cli.ts:22,1296-1304` — the replacement wire at HEAD
- `.opencode/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts:242-246` — the `--no-warm-only` resolution
- `.opencode/skills/system-spec-kit/runtime/cli/retrieval/fixtures/phrase-variants.json:60670` — the unaccepted handoff

## Assessment

- **newInfoRatio: 0.70**
- **Novelty justification:** The eight contradictions with their kinds, the specific supersession of 007's limitation 2 by `9015d00c79`, the "pending row recording a question that stopped being a question" (C5), the reopened-phase-with-phases-unnamed fix (C6), and the full 22-step checklist with its availability-then-cost ordering rule are all new. The overlap is deliberate: this iteration consolidates iterations 1-4 to produce the deliverable.
- **Confidence:** High for C1-C6 and C8 (each is a quoted file or a commit diffstat). High for C7's negative result within the artifacts I searched, with the caveat that a figure could exist in a loop state file I did not open. Medium for the checklist's *ordering* — it is derived from this packet's evidence, and the position of steps 8-12 rests on one packet's demonstrated failures.
- **Evidence gap:** I did not run the suite, the three-state battery, or the inversion harness; every cost and yield claim for steps 8-22 is derived from the recorded outcome in this packet rather than from my own execution. The checklist is a synthesis of what this packet found, and its transferability to a migration without a comparable record is untested.

## Reflection

- **Worked:** Separating *stale* from *false*. The packet's record is rarely wrong — C3, C4 and C5 are all cases of a true statement whose truth expired — and naming the kind changes the remedy from "correct the claim" to "add the reconciliation step that keeps it current".
- **Worked:** Deriving the checklist's order from availability rather than from cost alone. The result is not the packet's phase order, and the difference is step 8: a check that is only possible while both paths exist must be a gate, however expensive it is.
- **Failed / ruled out:** Treating the pending parent progress rows as a finding about the work. Ruled out on inspection: every phase's artifacts exist, so the rows are a reconciliation failure, not a delivery failure. The distinction matters because the wrong reading would have produced a much harsher and less useful finding.
- **Failed / ruled out:** Reproducing the brief's "26 tests / 7 registrations". Ruled out by counting the actual suites; recorded as C7 so the figure does not propagate into a later document.
- **Consolidation note:** Iterations 1-4 left eight findings and eight residue classes. Nothing discovered in this iteration contradicted them; the two corrections (R8's live documentation, and R1 as pre-deletion reading rather than a sweep) are refinements carried into synthesis.

## Recommended Next Focus

None — the loop's configured hard stop (5 iterations) is reached. Proceed to synthesis: consolidate iterations 1-5 into `research.md`, carrying the class definition, the eight residue classes with their instruments, the twenty-two-step checklist and the record's eight defects, with the eliminated directions as a first-class section.

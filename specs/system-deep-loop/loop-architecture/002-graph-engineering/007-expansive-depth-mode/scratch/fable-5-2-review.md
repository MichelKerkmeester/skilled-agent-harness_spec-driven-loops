# Adversarial review of `research/research.md` (Fable 5.2)

Reviewed 2026-11-17 against the working tree on `main`. Every verdict below rests on a file and line this review opened itself. Paths are relative to `.skilled/skills/system-deep-loop/` unless they start with `.skilled/`, `specs/` or `commands/` (`commands/` means `.skilled/commands/deep/assets/`).

## Summary

- Overall assessment: REQUESTED_CHANGES
- Files reviewed: `research/research.md` (516 lines) against about 30 runtime, workflow, config and doc files it cites
- Baseline used: the `review` agent contract (findings first, evidence per claim, untrusted-data rule). The sk-code review-mode checklists target code diffs and were not applied to this research document.
- Quality gate evidence: absent
- Defect register D1-D14: 10 CONFIRMED, 1 WRONG, 3 OVERSTATED, 0 UNVERIFIED
- Findings: 2 P0, 9 P1, 12 P2
- Confidence: MEDIUM. Code claims were traced by reading. No live run was repeated, so every "CONFIRMED live" in the synthesis stays the synthesis's own claim.

Severity scale, as the task set it: **P0** wrong and would mislead the build, **P1** materially incomplete, **P2** minor.

No embedded instruction was found in any file read. Nothing in the reviewed material was acted on as an instruction.

## Findings

### P0 - Critical

1. **Completed-run extension re-stops on the first duration check (§19.4, §19.5, §19.6, Slice A).**
- Case: an operator extends a completed run more than `maxDurationMinutes` after it was created, which is any extension on a later day, and omits the optional `--extend-minutes`.
- Claim: "A packet that finished near its ceiling would re-stop on the first duration check after extending. So extension raises `maxDurationMinutes` and never re-stamps `createdAt`", with `--extend-minutes=M` optional and `maxDurationMinutes += M`.
- Verdict: WRONG as designed. The trap is wider than "finished near its ceiling".
- Evidence: `commands/deep-research.yaml:888-891` computes `elapsedMinutes = floor((Date.now() - Date.parse(config.createdAt)) / 60000)` and stops when it reaches `maxDurationMinutes`. The step's own note at `:897` says "paused and waiting time counts". `commands/deep-review.yaml:938` and `:947` are the same. The default budget is 120 minutes (`deep-research/assets/deep-research-config.json:11`, `deep-review/assets/deep-review-config.json:17`). So the idle time between completion and extension is charged to the run. With M omitted the extension stops before dispatching one iteration. With M given, the operator has to work out the idle gap by hand.
- Fix for the design: compute the new ceiling from the clock, `newMaxDurationMinutes = max(priorMaxDurationMinutes, elapsedMinutesAtExtension) + M`, and give M a default (the prior budget). Record `elapsedMinutesAtExtension` in the `run_extended` event so the audit trail the design wants to protect is kept.

2. **The research state-log drop is located, and the synthesis says it is not (§1 item 1, §4.7, §12 item 3, D7, Slice F).**
- Case: the builder of Slice F starts with "locate the projection writer" and rates the slice "LOW (additive)".
- Claim: "`legacy-compatibility.ts` no longer names `keyQuestions` or the route-proof fields at all. The dropping now happens elsewhere in the gateway's projection path, and that module is not located yet."
- Verdict: WRONG. Generation 1's location was right. The file never named those fields because it drops them by omission.
- Evidence, the full chain:
  - Upcast: `runtime/lib/deep-research-ledger-schema/legacy-compatibility.ts:643-660` builds the `iteration_completed` data from `status`, `newInfoRatio`, `ruledOut`, `focus` and `answeredQuestions` only. Nothing else on the submitted record is copied.
  - Schema: `runtime/lib/deep-research-ledger-schema/deep-research-ledger-schema.ts:657-660` allows exactly two optional fields on that stem, `focus` and `answeredQuestions`.
  - Types: `runtime/lib/deep-research-ledger-schema/deep-research-ledger-types.ts:185-200`.
  - Projection writer: `runtime/lib/legacy-projections/deep-research-contract.ts:312-325` writes the state-log row with ten keys (`type`, `iteration`, `run`, `status`, `newInfoRatio`, `ruledOut`, `focus`, `mode`, `answeredQuestions`, `timestamp`). That matches the "10 core keys" the synthesis measured in §14.
- Consequence: Slice F is a ledger schema change across four files, not an additive projection edit. It is also the same move the synthesis eliminated for frontier fields ("Widening the gateway research upcast… changes the ledger path for every research run"). See finding 9.

### P1 - High

3. **D3's stated consequence is wrong: a review run cannot stop at iteration 1 (§4.5, D3, Slice C).**
- Case: a default review run (`antiConvergence.minIterations: 2`) with every dimension covered in its first iteration.
- Claim: "The review template sets `minIterations: 2`, but it is never applied, so a review run can stop at iteration 1."
- Verdict: OVERSTATED. The floor is gated to research (`runtime/scripts/convergence.cjs:1159`), that part holds. The consequence does not.
- Evidence: both review stop candidates need `coverageAge >= 1`. The clean stop requires it at `convergence.cjs:1106-1111`. The composite vote needs the `dimensionCoverage` signal to stop, and that also requires `coverageAge >= 1` (`:785-793`). Without it the other two signals reach at most 0.30 of 0.75 at iteration 2 and 0.55 of 1.00 later, under the 0.60 bar (`:773-784`, `:831-833`). `reviewCoverageAge` returns the count of evidence records after the one that completed coverage (`:1430-1443`), so a stop candidate needs at least two iterations. With the shipped floor of 2 the fix changes nothing. It matters only for a configured floor above 2.
- Consequence: Slice C's "MEDIUM (review may run one more iteration)" is wrong for default runs, and its "iteration-1 veto case" cannot be produced from real loop state.

4. **D10 depends on an input the workflow forbids (D10, §1 item 3, §6, §18.1, §18.4, Slice H, Slice K).**
- Case: a `reviewDimensions` array holding a name outside the four defaults.
- Claim: "A custom `reviewDimensions` entry can never be marked covered", called "the worst" of the new defects.
- Verdict: OVERSTATED. The code trace holds: `runtime/scripts/reduce-state.cjs:1223-1250` writes only the four `REQUIRED_DIMENSIONS` keys, and `convergence.cjs:1541-1556` counts every configured dimension as missing until covered. But `commands/deep-review.yaml:654` says "Every element MUST be one of the four canonical dimension names." The synthesis cites that step (`:645`) and misses the line. No code enforces it (the only `reviewDimensions` reader in `runtime/scripts` is `convergence.cjs:1541`), so the defect is reachable only through a hand-edited config.
- Consequence: the honest fix is to enforce line 654 in code, or to decide that custom dimensions are wanted and then build Slice H. The synthesis presents H as a bug fix and makes the review frontier (K) depend on it, without that decision.

5. **D14's mechanism is misattributed, so Slice M touches the wrong file (D14, Slice M).**
- Case: verification fails with `executor_missing` after the narrative, state record and delta all landed.
- Claim: "The verify gate cannot tell a missing provenance row from a missing iteration."
- Verdict: OVERSTATED. `runtime/scripts/verify-iteration.cjs` already returns distinct reasons: `iteration_file_missing` at `:479-483`, `state_record_missing` at `:520`, `delta_file_missing` at `:530`, and `executor_missing` at `:570-573`, which runs only after the earlier checks passed. The defect is in the workflow: `commands/deep-research.yaml:1539` re-dispatches on the first failure of any reason.
- Consequence: Slice M's "`verify-iteration.cjs` reason split" is not needed. The fix is a reason filter on `redispatch_once` in both YAMLs.

6. **Slice A's file list misses the code that must change for a new ledger stem and a new lineage mode (§19.6, Slice A).**
- Case: `run_extended` is added to "both ledger schemas and types; `legacy-compatibility.ts`" as listed, and nothing else.
- Verdict: materially incomplete.
- Evidence, files that handle each lifecycle stem today and are not on the list:
  - `runtime/lib/deep-research-reducers/deep-research-reducer.ts:104-107` (routing table) and its exhaustive switches ending in `assertNeverStem` (`:1391`, `:1551`, `:1944`).
  - `runtime/lib/deep-review-reducers/deep-review-reducer.ts:104-105`, `:493`, `:709`, `:1417`, `:1615`.
  - `runtime/lib/legacy-projections/deep-research-contract.ts:272-289` and `deep-review-state-contract.ts:138-158`, which project a stem back into the state log. Without a case there the event never reaches the log the workflow and reducers read.
  - `deep-research/scripts/reduce-state.cjs:2245`, `:2294` and `runtime/scripts/reduce-state.cjs:497`, `:549`, which recognise only `resumed` and `restarted` as lifecycle events.
  - `runtime/scripts/reduce-state.cjs:27`, `:112-114`: the review reducer's `LIVE_LINEAGE_MODES` turns any mode outside `new|resume|restart` into `null`.
  - The stem-producer table, `deep-research-ledger-types.ts:758-761`, which `check-ledger-stem-producers` holds to the emitter surface.
- Also: only the research config has `allowedModes` and `deferredModes` (`deep-research-config.json:31-39`). The review config is flat and has neither list and no `lineage` block (`deep-review-config.json:3-7`), so "move `completed-continue` from `deferredModes` to `allowedModes`" and "`lineage.continuedFromRun` is set" describe one loop, not both.

7. **Slice A breaks four contract tests it does not name, and more docs than it lists (Slice A).**
- Case: `note_deferred_branches` and the "deferred" wording are edited as the slice requires.
- Evidence: `.skilled/skills/system-spec-kit/runtime/cli/tests/deep-review-contract-parity.vitest.ts:126` asserts the workflow contains "fork and completed-continue are deferred". `deep-review-reducer-schema.vitest.ts:120-121` asserts "`completed-continue` lineage branch is deferred". `deep-research-contract-parity.vitest.ts:54-79` and `deep-review-contract-parity.vitest.ts:58-93` assert the docs mention the name. These live in `system-spec-kit`, outside the suites the slice lists.
- Docs stating the mode is deferred, not on the list: `deep-review/references/protocol/loop-protocol.md:594`, `deep-review/assets/review-mode-contract.yaml:178-180`, `deep-review/references/state/state-format.md:139`, `deep-review/references/protocol/quick-reference.md:107`, `deep-research/SKILL.md:126`, `deep-research/references/guides/quick-reference.md:105`, `deep-research/assets/deep-research-strategy.md:179`, `.skilled/agents/deep-research.md:100`, `.skilled/agents/deep-review.md:385`, and both `--lineage-mode` rows (`.skilled/commands/deep/research.md:109`, `review.md:102`).

8. **"Synthesis needs no change" skips a documented precondition (§19.9).**
- Case: a completed research run is extended and synthesis rewrites `research/research.md`.
- Evidence: `deep-research/references/protocol/loop-protocol.md:562` says: "If reopening a completed packet later: snapshot this file as `research/synthesis-v{generation}.md` before any `completed-continue` flow". The design keeps the generation unchanged (§19.6), so a second extension would write the same snapshot name.
- Verdict: materially incomplete. The design must either add the snapshot step with a name that survives repeated extensions, or change the protocol line on purpose.

9. **Slice F contradicts an eliminated alternative (Eliminated Alternatives, Slice F).**
- Case: a builder treats Slice F as additive while the same upcast change stays on the eliminated list.
- Claim: widening the gateway research upcast was eliminated because it "changes the ledger path for every research run". Slice F is rated "LOW (additive)".
- Evidence: finding 2. Keeping route-proof and telemetry fields means widening exactly that upcast and its schema (`legacy-compatibility.ts:643-660`, `deep-research-ledger-schema.ts:657-660`).
- Verdict: the two claims cannot both stand. Either the elimination reason is weaker than stated, or Slice F carries the risk it names.

10. **The frontier design has no way to close a counted question for a node that ends unanswered (§8, §10).**
- Case: an admitted node closes as `exhausted`, `blocked`, `abstained` or `pruned`.
- Evidence: an inbox row becomes a counted open question (`deep-research/scripts/reduce-state.cjs:1137-1180`). A question resolves only when a record's `answeredQuestions` contains its exact text, when a record has one `keyQuestions` entry equal to it, or when a record's `focus` equals it (`:2486-2499`). The second path is dead because the projection drops `keyQuestions` (finding 2). Nothing maps a frontier status to resolution. So each such node leaves an open question, `all_questions_answered` (`convergence.cjs:1149`) can never be reached, and the `questionEntropy` signal needs 85% answered (`:815-820`).
- Verdict: gap. Under the design as written an expansive run with any unanswered terminal node ends only by the cap or by the two ratio signals.
- Related: the third resolution path means a question resolves after one non-error iteration whose `focus` equals its text. If the new Next Focus branch emits the node's question text, nodes close by being visited, not by being answered. The design must state which behaviour it wants.

11. **Admitted nodes written to the coverage graph as QUESTION nodes can block the stop for good (§8 Storage, §10).**
- Case: `step_frontier_graph_upsert` adds up to 40 QUESTION nodes and some end without two answering findings.
- Evidence: `runtime/lib/coverage-graph/coverage-graph-signals.ts:583-589` counts a question as covered only with at least two answering findings and divides by all QUESTION nodes. `:673-690` averages source diversity over all QUESTION nodes too. `convergence.cjs:448-456` turns low values into `source_diversity_guard` and `uncovered_questions` blockers, and `:1012-1019` turns a blocked graph into `BLOCKED`.
- Verdict: gap. The design adds nodes to the graph and never says how a pruned or exhausted node stops counting against the graph thresholds. This compounds D1.

### P2 - Suggestion

12. **D7/D9 share one root and one fix.** `convergence.cjs:871-875` needs both `answeredQuestions` and `keyQuestions` on a record. The upcast drops `keyQuestions` (finding 2). Slice F should say that restoring `keyQuestions` turns the `focusAlignment` guard on for every research run, which is a default-behaviour change, not an additive one.
- Case: Slice F restores `keyQuestions` on the projected row for every research run.

13. **D13 can be upgraded to CONFIRMED, with a narrower effect.** `deep-research/scripts/reduce-state.cjs:1891-1895` matches a heading exactly, case-insensitive. The prompt pack asks for "Next Focus" (`deep-research/assets/prompt-pack-iteration.md.tmpl:61`). The reducer reads "Recommended Next Focus" (`:1930`), which is also what the agent definition asks for (`.skilled/agents/deep-research.md:228`, `:316`). So the pack and the agent definition disagree, and a pack-compliant narrative is not parsed. It has no behavioural effect today, because the parsed value has no consumer (D5). The review reducer accepts all three spellings (`runtime/scripts/reduce-state.cjs:355`), so review is not affected. "Questions Remaining" matches on both sides.
- Case: a leaf follows the prompt pack and writes a `## Next Focus` heading.

14. **D4 and D8 are verified; §12 item 2 can close.** D4: `deep-research/scripts/reduce-state.cjs:128-133`, `:204-207`. D8: a lock taken without `--owner-pid` is marked transient (`runtime/scripts/loop-lock.cjs:182-187`) and a transient lock is never checked for a live pid (`runtime/lib/deep-loop/loop-lock.ts:641`). The workflow sets the TTL to at least 30 minutes and says the lock is stale after twice that (`commands/deep-research.yaml:411`). The stale rule in `loop-lock.ts` itself was not read.
- Case: a reader takes §12 item 2 as open work for Slices D and A.

15. **§5.5 reads as a precedence list and is in evaluation order.** In `runtime/scripts/reduce-state.cjs:2184-2215` later assignments win. The real precedence is blocked-stop text, then the pivot focus, then the latest leaf `nextFocus`, then the first uncovered default dimension.
- Case: a builder inserts the review frontier branch by reading §5.5 as first-match-wins.

16. **`on_resume` appends a `resumed` event (§19.6).** If the config mutation makes classification land on `resume`, `commands/deep-research.yaml:446` appends `resumed` as well as the new `run_extended`. The design eliminated recording an extension as a plain `resumed`, so it must say whether both rows are wanted. The same paragraph also asks review's `on_completed_session` to check `lineage_mode`, which the pre-classify mutation makes unreachable. Pick one mechanism.
- Case: an extension run whose mutated config classifies as `resume`.

17. **The pre-classify mutation must sit inside the lock (§19.6).** `step_acquire_lock` is at `commands/deep-research.yaml:408` and `step_classify_session` at `:427`. The existing pre-init lifecycle step (`:270-280`) runs before the lock. The design should place the mutation between `:408` and `:427`.
- Case: two sessions start an extension on the same packet at once.

18. **`status: "active"` is not a value the workflow uses (§19.6).** The research workflow writes only `initialized` (`commands/deep-research.yaml:565`) and `complete` (`:1927`). Classification tests only `config.status == 'complete'` (`:436`). Use `initialized`, or introduce the new value on purpose.
- Case: a reader or check that expects the config status to be `initialized` or `complete`.

19. **`maxIterations += N` over-extends a run that stopped early (§19.6).** A run that converged at 7 of 10 and is extended by 3 gets 6 more iterations. `newMaxIterations = continuedFromRun + N` matches what `--extend=N` reads as.
- Case: a run that converged at 7 of 10 is extended with `--extend=3`.

20. **Slice ordering inconsistencies (§11, §18.5, §20).** Slice C is marked "before J" but changes only the review floor; J's own dependency list is D, E, F, G. §11 item 2 omits Slice M. §18.5 says generation 1's merge-time guard and `frontier_scope` partition "need Slice I first", but Slice I is the review merge (D12). The research merge already carries open and resolved questions (`runtime/scripts/fanout-merge.cjs:789-843`), which is why J does not list I.
- Case: a planner sequences the slices from the Depends-on column.

21. **Frontier sizing is out of step with the default caps (§8).** `maxFrontierNodes` is 40 while `maxIterations` defaults to 10 for research and 7 for review (`deep-research-config.json:3`, `deep-review-config.json:9`). At 50/35/15 that is 5, 3.5 and 1.5 iterations per depth band. The design should tie the node cap to `maxIterations` or state the minimum cap an expansive run needs.
- Case: an expansive run at the default iteration cap admits its full node allowance.

22. **Local stuck handling becomes one strike per node (§8).** `stuckCount` is rebuilt from the log on every pass and resets only on a ratio above the threshold (`convergence.cjs:1335-1339`). After the YAML closes a stuck node, the next low-yield iteration is stuck again at once and closes the next node after a single iteration.
- Case: an expansive run reaches the stuck threshold and the next node also yields a low ratio.

23. **Smaller citation and wording issues.**
- Case: a reader follows one of these citations or labels as written.
- §15 says to report `sourceDiversity` as `notEvaluated` under expansive mode. That status exists only on the quality guard (`convergence.cjs:858-866`), which counts SOURCE nodes. D1 is the graph signal, a number against 1.5 (`:437`, `:448`), which has no such state.
- §12 item 1 paths: the config is at `system-skill-advisor/runtime/data/prompt-policy.default.json`, the fixture at `system-skill-advisor/runtime/tests/legacy/advisor-fixtures/skippedShortCasual.json`, and the hook at `system-skill-advisor/hooks/claude/user-prompt-submit.ts`.
- §9 cites `command-attach.ts:123` for `COMMAND_POLICIES`, `DEPTH_WORDING` and `attachCommand`. `DEPTH_WORDING` is at `:275` and `attachCommand` at `:517`.
- D3's evidence cites `deep-review-config.json:12` as if top level. The key is `antiConvergence.minIterations`, which `convergence.cjs:1347-1349` does read.
- §19.2's claim that `fileProtection: immutable` "binds the leaf and the optimizer, not the workflow" was not traced to an enforcer. Treat it as inference.
- The frontier veto is redundant for `all_questions_answered` while admitted nodes are counted questions. It only matters for `composite_converged`. The new stop-decision table test must build a composite candidate to exercise it.

## Check 1: Defects D1-D14

| Id | Verdict | Evidence read |
|---|---|---|
| D1 | CONFIRMED | `coverage-graph-signals.ts:653-690` counts distinct `quality_class`. A repo-wide grep finds the key only at `:680` and in the safe-key list `coverage-graph-query.ts:131`, with no producer in runtime, agents, commands or templates. `upsert.cjs:228-236` copies `n.metadata` unchecked. Threshold and blocker at `convergence.cjs:437`, `:448`. The live 0.00 to 2.0 result was not re-run. |
| D2 | CONFIRMED | `dispatch-iteration.cjs:213-220` rejects `--claude-config-dir` outside review. `:355-357` reads it for review only. The research command passes none (`commands/deep-research.yaml:1442`), review does (`commands/deep-review.yaml:1519`). `CLAUDE_` is on the env allowlist (`runtime/lib/deep-loop/executor-audit.ts:155`), so an inherited value passes. Fan-out sets it itself (`fanout-run.cjs:3962-3964`, `:3995`). |
| D3 | OVERSTATED | Finding 3. Gate confirmed, consequence wrong. |
| D4 | CONFIRMED | `deep-research/scripts/reduce-state.cjs:128-133`, `:204-207`. Verified here; the synthesis had not re-verified it. |
| D5 | CONFIRMED | `continuity-thread.cjs:85-98` takes "Questions Remaining" lines and filters only against open machine questions, so an answered one stays. `:142-145` returns the latest such line first. The parsed `nextFocus` (`reduce-state.cjs:1944`) has no reader in the reducer. Limit: `:137-140` returns the terminal sentinel when no machine question is open, so the hijack needs at least one open question. Review twin at `runtime/scripts/reduce-state.cjs:2184`. |
| D6 | CONFIRMED | Pack write list excludes `research.md` (`deep-research/assets/prompt-pack-iteration.md.tmpl:42-45`). Agent definition allows it (`.skilled/agents/deep-research.md:58`, `:309`). "12 of 12 iterations" was not re-checked. |
| D7 | WRONG (location) | Finding 2. The drop itself and the delta fallback (`verify-iteration.cjs:552-568`) are confirmed. |
| D8 | CONFIRMED | Finding 14. Verified here. |
| D9 | CONFIRMED | `convergence.cjs:871-875` and finding 2. The cited `:1594` is only the input builder. |
| D10 | OVERSTATED | Finding 4. Pivot trigger confirmed at `deep-review/scripts/divergent-review-pivot.ts:338-340`. |
| D11 | CONFIRMED | `commands/deep-research.yaml:515-519` halts. `commands/deep-review.yaml:584-587` skips to synthesis. Deferred at `deep-research/references/protocol/loop-protocol.md:121`. |
| D12 | CONFIRMED | `fanout-merge.cjs:981-996` returns findings, counts, verdict and `searchDebt`. A grep of the file finds none of `dimensionCoverage`, `candidateCoverage`, `searchCoverage`, `traceability`, `ruledOutCandidates`, `divergence`. |
| D13 | CONFIRMED (was INFERENCE) | Finding 13. Research only, no behavioural effect today. |
| D14 | OVERSTATED | Finding 5. |

## Check 2: Completed-run extension (§19) and Slice A

Findings 1, 6, 7, 8, 16, 17, 18, 19.

What holds:
- The two loops differ on a completed packet as §19.1 says (D11 row).
- The count is continuous (§19.3). `convergence.cjs:1267-1284` counts every `type: iteration` row with no session or generation filter, and `:1613-1614` uses that count.
- A new stem is needed. `commands/deep-research.yaml:904` states the gateway refuses an event it has no ledger stem for.
- Nothing emits `segment_start` (§19.7). The only hits are the two readers at `commands/deep-research.yaml:843`, `:1737`.
- The immediate re-stop under `stopPolicy: convergence` (§19.8) follows from `convergence.cjs:1149`.

Default-run safety: the slice is opt-in at the workflow level. The risk to default runs is the shared-code change. A stem added to the types but not to the reducers fails to compile (`assertNeverStem`), which is a safe failure. A stem missing from the legacy projection fails silently: the event is in the ledger and absent from the state log.

## Check 3: Slice order (§20) and frontier design (§8, §10, §18)

Findings 9, 10, 11, 20, 21, 22.

What holds:
- The veto position after the floor at `convergence.cjs:1159` does not reorder the cap, failure, stuck, `off` or `max-iterations` branches (`:1115-1140`).
- The registry is already loaded where the stop input is built (`:1593-1595`), so no new CLI argument is needed.
- The step order `post_dispatch_validate` (`commands/deep-research.yaml:1511`), `step_reduce_state` (`:1577`), `step_graph_upsert` (`:1599`) supports the two new step positions.
- No runtime code writes `research/inbox.jsonl`. The only non-doc, non-test readers are the reducer and the projection manifest.
- Review has no question surface: the review reducer has no `inbox`, `keyQuestions` or `openQuestions` hit.

## Check 4: Other claims a reader would act on

Findings 12, 15, 23. Also confirmed and left unchanged:
- The stop order in §4.1 (`convergence.cjs:1115-1178`).
- The question count (`:1415`) and the stop candidate without a vote (`:1149`).
- The pivot limits (`runtime/lib/deep-loop/divergent-pivot.ts:285-287`, `:733-741`) and the research pivot's "rather than widening the research topic" text (`deep-research/scripts/divergent-research-pivot.ts:281`).
- The stuck-recovery prompt text (`commands/deep-research.yaml:1218`).
- Every lineage gets the same topic (`fanout-run.cjs:1666-1670`).
- The skill-advisor gate sets and reasons (`system-skill-advisor/runtime/lib/prompt-policy.ts:24-27`, `:126`, `:163`, `:217`).
- Every test suite named in §10 and §20 exists under `.skilled`.

## Adversarial self-check (P0 and P1)

| Finding | Hunter | Skeptic challenge | Referee | Final |
|---|---|---|---|---|
| 1 Duration re-stop | P0 | The design already says to raise the ceiling | Confirmed: M is optional and additive, and the idle gap is not in the formula | P0 |
| 2 Projection located | P0 | The live symptom is described correctly | Confirmed: the location claim and the slice's first task and risk are wrong | P0 |
| 3 D3 consequence | P0 | The gate gap is real and the fix is harmless | Downgraded: wrong consequence, misrated slice, no harm from the fix | P1 |
| 4 D10 reach | P1 | Code path is real | Confirmed: input is outside the stated contract at `deep-review.yaml:654` | P1 |
| 5 D14 mechanism | P1 | The wasted dispatch did happen | Confirmed: the reasons are already split, the YAML is the fix site | P1 |
| 6 Slice A files | P1 | "Regenerated contracts" may cover some | Confirmed: reducers, projections and both `reduce-state.cjs` are hand-written | P1 |
| 7 Slice A tests | P1 | Parity tests would surface at CI | Confirmed: unnamed tests in another skill fail on the slice's own edit | P1 |
| 8 Snapshot rule | P1 | The rule sits in a doc for a deferred mode | Confirmed: it is the only written precondition for this flow | P1 |
| 9 F versus elimination | P1 | Different fields, same seam | Confirmed: same upcast, same schema | P1 |
| 10 Terminal status | P1 | A reducer change in Slice J could close it | Confirmed: the design names no such change | P1 |
| 11 Graph dilution | P1 | Graph nodes could be removed on close | Confirmed: the design names no such step | P1 |

## Next steps

1. Decide the duration formula for extension (finding 1) before Slice A is specified.
2. Rewrite Slice F around the four located files and decide whether the upcast may widen (findings 2, 9, 12).
3. Decide whether custom review dimensions are a feature (finding 4). That decides Slice H and one of Slice K's dependencies.
4. Add the question-close and graph-close rules to the frontier design (findings 10, 11).
5. Apply the corrected draft at `scratch/research-fable-5-2-draft.md` to `research/research.md` if the corrections are accepted. This review did not edit `research.md`.

Not checked: no live run was repeated (D1's 0.00 to 2.0 result, D6's 12 of 12, D7's 14-to-10 field probe, D11, D14 and the inbox injection are the synthesis's own observations); the generation-1 and generation-2 iteration narratives were not compared line by line against the synthesis; the 002-graph-engineering syntheses and reference docs cited in §7 were not opened; the stale-lock rule inside `loop-lock.ts` and the enforcer of `fileProtection` were not read; the sk-code review-mode resolver and checklists were not run because the target is a research document, not code.

Review status: REQUESTED_CHANGES

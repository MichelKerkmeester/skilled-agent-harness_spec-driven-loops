# Routing Evaluation Research: a held-out set and a cross-path parity check for system-skill-advisor

One `/deep:research` run in auto mode did ten iterations on DeepSeek V4.1 Flash at max effort, through cli-pi on the LLM Gateway (DevPass) route, from 16:23 to about 17:30 UTC on 2026-10-11. All ten dispatches exited 0 and passed `verify-iteration.cjs` on the first try. None needed a redispatch, the containment guard flagged nothing, and no usage limit came up, so the Cline Pass fallback never ran. This file is the orchestrator's synthesis. It keeps the iteration findings that held up when rerun, corrects the one prediction that failed under the real test runner, and turns the rest into a ranked recommendation table.

**Evidence labels.** `Verified` means the orchestrator read the cited line or ran the command itself in this session. `Executor-measured` means an iteration measured it and the orchestrator did not repeat the measurement. `Inferred` means it follows from verified facts without being observed directly; each such entry says what would confirm it.

**Out of scope.** No recommendation here proposes a fix for probe P4, probe P7 or admission scenario DOC-331. Their fix is in flight elsewhere, so they appear only as evidence of a class of behavior.

---

## 1. Summary

The repository already holds almost everything the question asks for, but one of the two pieces never runs.

- **A held-out set already exists and is mechanically held out.** `holdout-prompts.jsonl` is a frozen 66-row set built from three separately written fixtures. Its labels are copied from those fixtures, and any row that collides with the 195-row training corpus is dropped. Accuracy floors and a SHA-256 pin guard it in CI. The 17-positive plus 5-negative probe battery is a smoke test with published prompts, not a held-out set.
- **A cross-path parity gate already exists, but no CI workflow runs it.** `local-native-divergence-ratchet.vitest.ts` compares the strict top-1 of the local Python scorer with the native TypeScript scorer over 217 prompts. It ratchets every divergence against a reviewed 73-entry ledger, and it passes 6/6 today in 5.0 seconds. It calls itself a CI gate, but no workflow names it.
- **The gate measures a test-harness regime, not live routing.** Under VITEST the semantic-shadow lane swaps in fixture vectors, and this ratchet does not pin the clock. On `rr-iter3-168` the gate keeps the ledgered `system-deep-loop` while the live daemon routes to `system-spec-kit`, by a margin of 0.0001 confidence.
- **Ties at 0.82 are floor collisions, and both paths break them the same way every time.** Three calibrated floors equal 0.82, and both paths sort ties down to skill name ascending. A tie-induced divergence is therefore stable, and it belongs in the reviewed ledger rather than in a threshold change.

---

## 2. Research Questions

1. What should a realistic held-out evaluation set look like: size, prompt source, negatives, and how it stays held out?
2. What should a cross-path parity check between `skill_advisor.py` and `.skilled/bin/skill-advisor.cjs` compare, and when should it fail?
3. How do both stay cheap and honest, given ties at 0.82 and admission running with `--warn-only`?
4. Which existing harnesses, fixtures and CI jobs can each recommendation extend in place?

All four were answered by iteration 5. Iterations 6 to 10 ran measurements and reconciliations that sharpened the answers and, in one case, corrected an iteration's reading.

---

## 3. Method

Each iteration was one `@deep-research` leaf dispatch with the agent definition inlined, rendered from the workflow's prompt pack and run through the shared cli-pi command builder (`pi -p --offline --model llmgateway/deepseek-v4.1-flash --thinking max`). Each leaf wrote an iteration narrative and a delta file, and recorded its state through the append gateway. After every dispatch the workflow ran the reducer, the graph upsert and a telemetry heartbeat. The stop policy was `max-iterations`, so convergence was telemetry only and all ten iterations ran.

After the loop the orchestrator reread every cited line it carries into this file, reran the CI grep, ran the divergence ratchet under vitest, and probed the live daemon on the one contested row (section 13).

---

## 4. Q1: The Held-Out Evaluation Set

Evidence status: Verified

**It exists.** `holdout-prompts.jsonl` has 66 rows: 40 from `skill-advisor-regression-cases.jsonl`, 20 from `harder-intent-prompt-corpus.ts` and 6 from `executor-delegation-cases.json` (counted by `origin_fixture`). The builder states that every label is copied from its source fixture's own expected field and that no gold is invented [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/build-holdout.mjs:5]. It keeps per-row provenance, and it names real advisor-hook telemetry as the legitimate future source, deliberately not faked [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/build-holdout.mjs:14].

**How it stays held out.** The builder family-normalizes prompts and drops any row that collides with the training corpus [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/build-holdout.mjs:19]. The CI ratchet enforces floors of 0.75 on the full corpus and 0.725 on the holdout [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/parity/scorer-eval-baseline-ratchet.vitest.ts:29] [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/parity/scorer-eval-baseline-ratchet.vitest.ts:30], and it runs in the `golden-prompt-gate` job [SOURCE: .github/workflows/routing-registry-drift.yml:268].

**Size and negatives.** The working scale is a 195-row labeled corpus, the 66-row holdout and a 24-row ambiguity slice. Negatives are gold-`none` abstain and suppression rows, scored as false fires and unknowns rather than as "some other skill won" (executor-measured counts: 18 in the corpus, 6 in the holdout). A realistic set keeps that shape and grows only through a reviewed re-baseline.

**What it is not.** The 17+5 battery publishes its probes in a playbook table and replays them through a scratch script. Its negative half asserts only that `sk-code` does not win [SOURCE: .skilled/skills/sk-code/manual-testing-playbook/skill-advisor-integration/advisor-probe-battery.md:60]. Nothing pins it with a hash, so it is an end-to-end smoke test.

**The gap.** The independence gate checks the holdout against one corpus only: it builds its training set from `labeled-prompts.jsonl` [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/parity/holdout-independent.vitest.ts:92] and asserts disjointness against that set alone [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/parity/holdout-independent.vitest.ts:108]. Yet the lane-weight sweep scores the whole harder fixture, which supplies all 20 holdout-harder rows, across candidate weight vectors [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/scorer/lane-weight-sweep.vitest.ts:153]. The divergence ratchet imports the same fixture too [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/parity/local-native-divergence-ratchet.vitest.ts:24]. So "proven disjoint" holds for one tuning surface out of several.

---

## 5. Q2: The Cross-Path Parity Check

Evidence status: Verified

**What to compare: strict top-1, with abstention normalized to one sentinel.** The existing ratchet does exactly this: it takes the local Python `analyze_prompt` top-1 and the in-process native `scoreAdvisorPrompt` top-1, and maps an abstention to `none` on both sides [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/parity/local-native-divergence-ratchet.vitest.ts:26] [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/parity/local-native-divergence-ratchet.vitest.ts:200]. Raw confidence and lower ranks stay out of the predicate. The two engines share no score calibration. Across 20 comparable battery probes, iteration 6 measured identical confidence on 17, small drift on 2 that agreed on top-1, and one real divergence (executor-measured). Comparing confidence would have added two false failures for one real one. Confidence belongs in the diagnostic record.

**When it fails: the ratchet's five rules.** (a) A top-1 divergence missing from the ledger [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/parity/local-native-divergence-ratchet.vitest.ts:315]. (b) A ledger entry that no longer diverges. (c) A ledgered row whose prompt hash or either top-1 changed [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/parity/local-native-divergence-ratchet.vitest.ts:343]. (d) Duplicate ledger ids. (e) Orphan ledger ids. A missing Python interpreter also fails the gate rather than skipping it [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/parity/local-native-divergence-ratchet.vitest.ts:34], in deliberate contrast to the CLI-parity test, which skips [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/skill-advisor-cli-parity.vitest.ts:68].

**Name the Python mode.** `skill_advisor.py --force-native` does not run the local Python scorer: it requires the native advisor [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:4744]. `--force-local` is the local scorer [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:4742]. The battery's Python mode passes `--force-native` [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/014-skill-authoring-ux-research/007-advisor-name-mention-scoring/scratch/advisor-battery.py:45], so a battery "Python vs Node" run compares two native clients, not two scorers. Iteration 8 caught this after iteration 7 had read three such rows as unledgered divergences.

---

## 6. Q3: Cheap and Honest

Evidence status: Verified, except where marked

**Cheap is a placement decision.** The ratchet's batched model runs one Python subprocess for the whole corpus plus in-process native calls [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/parity/local-native-divergence-ratchet.vitest.ts:277]. The orchestrator's vitest run took 5.0 seconds in total. The `golden-prompt-gate` job already pays the advisor install [SOURCE: .github/workflows/routing-registry-drift.yml:251] and already runs the sibling baseline ratchet, so adding this one costs one more vitest invocation. A per-prompt CLI loop is the expensive pattern: about 0.28 s per call on the Node daemon and about 0.83 s per call on Python (executor-measured, load-sensitive).

**Honest is a pinning decision, and admission is the counter-example.** Admission cannot fail by construction: `main()` returns 0 whenever `--warn-only` is set [SOURCE: .skilled/bin/compiled-route-admission.cjs:104], and the workflow passes that flag [SOURCE: .github/workflows/routing-registry-drift.yml:180]. A parity or evaluation gate placed behind that step would inherit "always exit 0". The corpus gate in the same workflow shows the honest pattern: pin the inputs by hash, then score against floors.

**Ties at 0.82.** `readOnlyRouteAllowedFloor`, `taskIntentFloor` and `directScoreFloor` all equal 0.82 [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/scoring-constants.ts:181] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/scoring-constants.ts:186] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/scoring-constants.ts:188]. Python sorts by confidence, then score, then skill name [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:884]. TypeScript also ends on skill name ascending [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:791]. Ties therefore resolve the same way on every run, and a divergence caused by a tie can be recorded and reviewed. On a 49-prompt stride sample, 57% of rows touch 0.82 in the top two and 10% are exact top-two ties (executor-measured). The battery overstates exact ties at 24%.

**The regime the gate measures.** Under `VITEST=true` the semantic-shadow lane substitutes fixture vectors [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/semantic-shadow.ts:111]. The sibling baseline ratchet also freezes the clock [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/parity/scorer-eval-baseline-ratchet.vitest.ts:182], because the derived lane discounts each skill by age and scores drift with the calendar [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/capture-scorer-eval-baseline.mjs:60]. The divergence ratchet does neither for time: its native call passes only a workspace root [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/parity/local-native-divergence-ratchet.vitest.ts:200]. On `rr-iter3-168` the live daemon puts `system-spec-kit` at 0.8251 above `system-deep-loop` at 0.825. The gate still sees the ledgered `system-deep-loop` and passes. A green gate is evidence of parity in the harness regime only.

---

## 7. Q4: What Extends in Place

Evidence status: Verified

| Need | Existing piece to extend | Where it runs today |
|------|--------------------------|---------------------|
| Held-out set | `holdout-prompts.jsonl`, `build-holdout.mjs`, `scorer-eval-baseline-ratchet.vitest.ts` | `golden-prompt-gate` |
| Independence check | `holdout-independent.vitest.ts` | Not in any workflow |
| Parity gate | `local-native-divergence-ratchet.vitest.ts` plus its ledger fixture | Not in any workflow |
| Static pins | the corpus hash step in `routing-registry-drift.yml` | `golden-prompt-gate` |

The orchestrator's grep of `.github/workflows/` for `local-native-divergence`, `python-ts-parity`, `skill-advisor-cli-parity` and `holdout-independent` returned nothing (exit 1). The 17+5 battery script is the one piece with no home in the runtime tree: it lives in a spec `scratch/` folder.

---

## 8. Measurements

| Measure | Value | Status |
|---------|-------|--------|
| Divergence ratchet under vitest | 6/6 tests pass, 5.01 s, exit 0 | Verified |
| Ledger size | 73 entries | Verified |
| Holdout composition | 66 rows: 40 regression, 20 harder, 6 delegation | Verified |
| Live daemon on `rr-iter3-168` | `system-spec-kit` 0.8251, `system-deep-loop` 0.825, `command-spec-kit` 0.82, freshness live | Verified |
| Live top-1 agreement, 49-prompt stride sample, trusted envelopes | 44/49 (89.8%); 34/49 if degraded envelopes are accepted | Executor-measured |
| Divergence class mix at engine level | 43 of 73 are local `none` against a native route | Executor-measured |
| Per-call cost | Node daemon about 0.28 s, Python about 0.83 s, load-sensitive | Executor-measured |

---

## 9. Corrections Made During Verification

| Iteration claim | What the orchestrator found | Effect |
|-----------------|-----------------------------|--------|
| Iterations 9 and 10: the real ratchet would fail rule (c) on `rr-iter3-168` today | Under vitest the ratchet passes 6/6. Its native side still returns the ledgered `system-deep-loop`, because the iteration's replay ran outside the VITEST fixture-vector regime | Prediction falsified. Reframed as the harness-versus-live regime split in section 6 and recommendations R3 and R8 |
| Iteration 5: the TypeScript tie-break ends at `fusion.ts:769` | Line 769 opens the sort; the skill-name keys are at lines 791 and 795 | Citation corrected |
| Iteration 4: the CLI path requests `topK: 1` at `skill-advisor-cli-parity.vitest.ts:102` | The option is on line 101 | Citation corrected |
| Iteration 7: three rows are unledgered divergences | Already corrected by iteration 8: they were `--force-native` client readings, not local-scorer readings | Kept out of the recommendations |

---

## 10. Constraints

- Read-only. Nothing outside this packet changed; the dispatch containment guard recorded no violation across ten iterations.
- No fixes for P4, P7 or DOC-331. P7's prompt class shows up as evidence (a name-mention divergence that reproduces deterministically) and nothing more.
- Every recommendation names its move from `.skilled/repo-rules/prevent-overengineering.md`, and every move above Build nothing says what fails at the cheaper one.

---

## 11. Recommendations

Ranked so R1 matters most.

| ID | Recommendation | Evidence | Move | Why the cheaper move fails |
|----|----------------|----------|------|----------------------------|
| R1 | Run the existing divergence ratchet as a blocking step in the `golden-prompt-gate` job, next to the baseline ratchet, and never behind the `--warn-only` admission step. It passes 6/6 today in 5.0 s, so wiring it starts green | `.github/workflows/routing-registry-drift.yml:268`, `.skilled/skills/system-skill-advisor/runtime/tests/parity/local-native-divergence-ratchet.vitest.ts:31`, `.skilled/bin/compiled-route-admission.cjs:104` | Extend in place | Build nothing fails: no workflow names the ratchet (grep exit 1), so a new unledgered divergence never fails a push, although the file says new drift fails CI. Change a value fails: no existing flag turns it on, and the only lever in reach, admission's `--warn-only`, returns 0 by construction |
| R2 | Keep the parity predicate as it is: strict top-1 with abstention normalized to `none`, failing on the ratchet's five ledger rules and on a missing Python. Do not add confidence or lower-rank comparison | `.skilled/skills/system-skill-advisor/runtime/tests/parity/local-native-divergence-ratchet.vitest.ts:26`, `.skilled/skills/system-skill-advisor/runtime/tests/parity/local-native-divergence-ratchet.vitest.ts:315`, `.skilled/skills/system-skill-advisor/runtime/tests/parity/local-native-divergence-ratchet.vitest.ts:343` | Build nothing | None. This is the cheapest move: the predicate and its failure contract already exist, and adding confidence would turn agreeing rows into failures because the two engines share no calibration |
| R3 | Pin the scoring clock in the divergence ratchet the way the baseline ratchet does, so a ledgered top-1 cannot flip with the calendar alone | `.skilled/skills/system-skill-advisor/runtime/tests/parity/scorer-eval-baseline-ratchet.vitest.ts:182`, `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/capture-scorer-eval-baseline.mjs:60`, `.skilled/skills/system-skill-advisor/runtime/tests/parity/local-native-divergence-ratchet.vitest.ts:200` | Extend in place | Build nothing fails: the derived lane discounts by age, and floor rows such as `rr-iter3-168` are decided by 0.0001 confidence, so the gate can go red on a day with no commit (inferred; confirm by running the ratchet with the system time moved forward). Change a value fails: the file has no clock setting to change |
| R4 | Treat `holdout-prompts.jsonl` and its floors as the held-out evaluation set, and keep the 17+5 battery as a smoke test only. Grow the holdout only through a reviewed re-baseline, with real hook telemetry as the next source | `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/build-holdout.mjs:5`, `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/build-holdout.mjs:19`, `.skilled/skills/system-skill-advisor/runtime/tests/parity/scorer-eval-baseline-ratchet.vitest.ts:30` | Build nothing | None. This is the cheapest move: a frozen, provenance-tagged, collision-checked set with a CI floor already exists, and the battery's published, unpinned prompts cannot serve as a held-out set |
| R5 | Widen the independence check in `holdout-independent.vitest.ts` from one corpus to every surface that scores the holdout's source fixtures, with a declared allowed-overlap map (for example, holdout-harder may overlap the lane-weight sweep and the divergence ratchet), and run it in CI | `.skilled/skills/system-skill-advisor/runtime/tests/parity/holdout-independent.vitest.ts:92`, `.skilled/skills/system-skill-advisor/runtime/tests/parity/holdout-independent.vitest.ts:108`, `.skilled/skills/system-skill-advisor/runtime/tests/scorer/lane-weight-sweep.vitest.ts:153` | Extend in place | Build nothing fails: the gate builds its training set from `labeled-prompts.jsonl` alone, while all 20 holdout-harder rows are scored across lane-weight vectors, so the disjointness claim covers one tuning surface out of several and a new overlap would go unrecorded. Change a value fails: a second corpus is a set, not a constant |
| R6 | Record an exact 0.82 tie that flips top-1 as a reviewed ledger entry, and never move a floor to break it | `.skilled/skills/system-skill-advisor/runtime/lib/scorer/scoring-constants.ts:181`, `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:884`, `.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:791` | Build nothing | None. This is the cheapest move: three floors share 0.82 and both paths break ties on skill name ascending, so tie flips repeat exactly and the ledger already absorbs them |
| R7 | Leave hub admission warn-only and keep every parity or evaluation gate out of that step. Each gets its own blocking step | `.skilled/bin/compiled-route-admission.cjs:104`, `.github/workflows/routing-registry-drift.yml:180` | Build nothing | None. This is the cheapest move: the admission step records drift on purpose until its baseline is triaged, and R1 already places the parity gate elsewhere |
| R8 | State the regime in the divergence ratchet's header: it compares the local Python scorer with the in-process native scorer under VITEST fixture vectors, so a pass shows harness-regime parity, not live-daemon parity | `.skilled/skills/system-skill-advisor/runtime/tests/parity/local-native-divergence-ratchet.vitest.ts:5`, `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/semantic-shadow.ts:111` | Extend in place | Build nothing fails: the header names the two scorers but not the regime, and on `rr-iter3-168` the gate passes on `system-deep-loop` while the live daemon routes to `system-spec-kit`, so a reader takes a green gate as live parity when it is not |
| R9 | Do not cite the battery's Python mode as cross-path parity: it calls `--force-native`, which compares two native clients. Use the ratchet, whose Python side is the local scorer | `specs/sk-code/011-sk-code-poinytail-based-refinement/014-skill-authoring-ux-research/007-advisor-name-mention-scoring/scratch/advisor-battery.py:45`, `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:4744` | Build nothing | None. This is the cheapest move: the right instrument exists, and only the reading of the battery has to change |

---

## Eliminated Alternatives

| Approach | Reason Eliminated | Evidence | Iteration(s) |
|----------|-------------------|----------|--------------|
| Use the 17+5 battery as the held-out set | Prompts are published and unpinned, and the negatives assert only that `sk-code` does not win | `advisor-probe-battery.md:60` | 1, 6 |
| Compare raw confidence across paths | No shared calibration. Measured drift adds false failures on agreeing rows | `local-native-divergence-ratchet.vitest.ts:26` | 4, 6 |
| Compare ranks two and below | Lower-rank order is unstable at the 0.82 floors, and the CLI path asks for `topK: 1` | `skill-advisor-cli-parity.vitest.ts:101` | 4 |
| Use the CLI-level parity test as the gate | Nine prompts, skips without Python, compares against gold rather than ledgering divergences | `skill-advisor-cli-parity.vitest.ts:68` | 4 |
| Put the parity check behind the admission step | `--warn-only` always exits 0 | `compiled-route-admission.cjs:104` | 5 |
| Read the three memory:save rows as unledgered divergences | They were `--force-native` client readings; the local scorer agrees with native | `skill_advisor.py:4744` | 7, 8 |
| Attribute the `rr-iter3-168` flip to commit 3a4d1a8927 or 4e69fb4d45 | The fusion.ts diff is banners and an import path, and the removed boosts do not occur in the prompt | iteration-010.md Ruled Out | 10 |
| Predict a rule-(c) failure for the real ratchet on `rr-iter3-168` | Falsified by the orchestrator's vitest run (6/6 pass); the replay ran outside the VITEST regime | section 9 | 9, 10, verification |
| Measure cold-daemon start through the CLI | The CLI never starts a daemon; without one it silently degrades to the local scorer (executor-measured) | iteration-007.md Finding 1 | 7 |

---

## Divergence Map

- Saturated directions: none recorded by the reducer.
- Pivots taken: none. Convergence mode was `default` and the stop policy `max-iterations`, so no divergent pivot could fire.
- Pivot failures and audited overrides: none.
- Remaining frontier: real-telemetry prompts for the holdout, CI-minute cost of R1 and R5, and whether the live-regime split is worth its own sampled check (section 12).

---

## 12. Open Questions

1. **CI minutes for R1 and R5.** UNKNOWN. The structural cost is one vitest file per gate in a job that already pays the install. Settle it by timing the job once with both steps added.
2. **Does R3's clock pin change any ledger entry?** UNKNOWN. Settle it by running the ratchet with the clock pinned to the ledger's approval date and to today, and diffing the divergence sets.
3. **Is a live-regime sample worth adding?** UNKNOWN. The harness regime cannot see live-embedding flips like `rr-iter3-168`. Settle it by counting, over the 217-prompt union, how many rows flip between the harness regime and the live daemon. If the count is near zero, R8's header note is enough.
4. **Real-telemetry prompts.** The builder names harvested hook telemetry as the honest next source. No harvest pipeline exists today, so its size and labeling cost are UNKNOWN.

---

## 13. Verification Log

| Claim | Command or read | Result |
|-------|-----------------|--------|
| No workflow runs the parity harnesses | `grep -rnE "local-native-divergence\|python-ts-parity\|skill-advisor-cli-parity\|holdout-independent" .github/workflows/` | No match, exit 1 |
| Admission cannot fail | Read `compiled-route-admission.cjs:19`, `:21`, `:104`, `:109` and `routing-registry-drift.yml:175-180` | Confirmed |
| Three floors equal 0.82, and tie keys end on skill name | Read `scoring-constants.ts:181`, `:186`, `:188`; `skill_advisor.py:884-889`; `fusion.ts:791`, `:795` | Confirmed; `fusion.ts:769` corrected |
| Holdout is 66 rows, 40/20/6 | Python count over `holdout-prompts.jsonl` by `origin_fixture` | Confirmed |
| Ledger holds 73 entries | Python count over `local-native-approved-divergences.json` | Confirmed |
| Ratchet rules, Python requirement and hook budget | Read ratchet `:5-13`, `:26-34`, `:142-144`, `:277-279`, `:315`, `:329`, `:343` | Confirmed |
| Independence gate uses one corpus | Read `holdout-independent.vitest.ts:42`, `:92`, `:108-113` | Confirmed |
| Ratchet passes today | `npx vitest run tests/parity/local-native-divergence-ratchet.vitest.ts` | 6/6 passed, 5.01 s, exit 0 |
| Harness swaps in fixture vectors | `grep -rn VITEST lib` in the advisor runtime | `semantic-shadow.ts:111`, `:196`, `:202`, `:215`, `:254` |
| Baseline ratchet pins the clock, divergence ratchet does not | grep for fake timers in both files | Only `scorer-eval-baseline-ratchet.vitest.ts:182-183` |
| Live daemon on `rr-iter3-168` | `node .skilled/bin/skill-advisor.cjs advisor_recommend` with `topK: 3` | `system-spec-kit` 0.8251, `system-deep-loop` 0.825, freshness live |
| Battery Python mode is native | Read `advisor-battery.py:45` and `skill_advisor.py:4742-4745` | Confirmed |

---

## 14. Convergence Report

- Stop reason: maxIterationsReached (stop policy `max-iterations`; convergence was telemetry only)
- Total iterations: 10
- Questions answered: 4 / 4
- Remaining questions: 0
- Last 3 iteration summaries: run 8: path-semantics correction and ledger reconciliation (0.93); run 9: in-process native pass and `rr-iter3-168` (0.93); run 10: terminal consolidation and commit narrowing (0.60)
- Convergence threshold: 0.05
- Divergence summary: no divergent pivots recorded
- Segment transitions, wave scores and checkpoint metrics are experimental and omitted from the live report.

---

## 15. Model Route

| Iterations | Route | Thinking | Dispatch time |
|------------|-------|----------|---------------|
| 1 to 10 | `llmgateway/deepseek-v4.1-flash` (DevPass) | max | 284 s to 515 s each |

The Cline Pass fallback was never used.

---

## 16. Workflow Deviation

The workflow's single-executor cli-pi branch dispatches the rendered prompt pack as is. cli-pi's contract requires the child-dispatch preamble and an inlined persona on every non-interactive dispatch, because `pi -p` has no persona surface and cannot see `AI_SESSION_CHILD`. The orchestrator therefore prepended the preamble and the `@deep-research` agent definition to each rendered prompt file before dispatch. Everything else ran in the workflow's step order. A proposed amendment for the workflow owner: make the `if_cli_pi` branch prepend both itself, as the fan-out lineage builder already does for its own prompts.

---

## 17. References

- Iteration narratives: `research/iterations/iteration-001.md` to `iteration-010.md`
- State and registry: `research/deep-research-state.jsonl`, `research/findings-registry.json`, `research/deep-research-dashboard.md`
- Resource map emitted from the iteration deltas: `research/resource-map.md`
- Restraint rule: `.skilled/repo-rules/prevent-overengineering.md`

# Iteration 2: Q3 — Divergent-Pivot Yield After all_questions_answered + the Honest D1 Fix

## Focus
Q3 from the strategy: (a) how many extra iterations a divergent pivot after `all_questions_answered` actually buys, traced end to end through prepare → council → finalize → apply → next convergence check; (b) the honest fix for D1 — who should produce coverage-graph `quality_class`, from what closed vocabulary, enforced where. Generation 1 estimated the pivot yield at "about one iteration"; this iteration verifies or corrects that claim mechanically.

## Actions Taken
1. Read the run state (config, state log, strategy, registry) — session `2026-11-17T10:36:36.000Z`, iteration 2, `stopPolicy: max-iterations`, `convergenceMode: default`, `antiConvergence.divergent: {}`.
2. Read `divergent-research-pivot.ts` in full (the research-side adapter) and mapped its candidate-seed, dedupe, seat and usage contract.
3. Traced the stop decision in `convergence.cjs` around the `all_questions_answered` candidate and every early return that gates it.
4. Traced the workflow branch in `deep-research.yaml` (`step_handle_convergence` → prepare → 3 seats → record → finalize → apply → gates → continue/synthesis) including `applies_to: confirm` behavior under `execution_mode: auto`.
5. Read pivot limits in `divergent-pivot.ts` (`DEFAULT_DIVERGENT_CONFIG`, refusal reasons) and the `quality_class` consumer/producer surface (`coverage-graph-signals.ts`, `coverage-graph-query.ts`, `upsert.cjs`, `iteration-graph-upsert.cjs`).

## Findings

1. **A pivot only fires on a clean eligible STOP behind a long conjunction — and this run's own config disables it twice over.** The workflow branch runs only when `convergence_mode == 'divergent'` AND `stop_decision.reasonDetail ∈ {composite_converged, all_questions_answered}` [SOURCE: .skilled/commands/deep/assets/deep-research.yaml:1056]. The stop must first survive every earlier return in `convergence.cjs`: `maxIterationsReached` (terminal, :1115), `consecutiveFailures` (:1126), `stuckThresholdReached` (:1130), `convergenceMode 'off'` → CONTINUE (:1134), **`stopPolicy 'max-iterations'` → CONTINUE before any stop candidate is even formed (:1138–1140)**, `minIterationsNotReached` (:1159), and `qualityGuardFailed` → CONTINUE (:1167–1168). A graph-vetoed `blockedStop` and every non-eligible reason fail closed to the terminal path (yaml:1061). This packet's config sets `stopPolicy: 'max-iterations'` (config:97) and `convergenceMode: 'default'` (config:7), so the pivot path is unreachable here twice — once at the mode gate, once before a candidate exists. Generation 1's "existing levers add duration only" is confirmed mechanically: `max-iterations` doesn't just decline to stop early, it structurally removes the only signal that could trigger a pivot.

2. **An accepted pivot buys `min(maxIterations − triggerIteration, remaining pivot budget)` iterations — not "about one".** The corrected mechanics: a pivot converts a STOP into CONTINUE; it never extends `maxIterations`, and the cap at `convergence.cjs:1115` is evaluated before the pivot-eligible reasons and is excluded from pivoting (yaml:1061). On success the workflow sets `next_focus` to `restoredFocus`, re-runs the reducer, and proceeds to `step_rejected_pattern_cache` → the next iteration dispatches (yaml:1163–1169). Because the pivot re-picks focus from *existing* state and never adds questions to the registry, `all_questions_answered` stays true forever after it first fires — **every subsequent stop consumes another pivot**. The lifetime budget is `maxPivots: 3` (`divergent-pivot.ts:285`; refusal `max_pivots_exceeded` at :733) and `maxCouncilSeatOutputs: 9` (:286) caps total seat dispatches across all pivots — three pivots × three seats exactly saturates it, so a resumed pivot silently eats lifetime budget. `minRemainingIterations: 1` (:287, enforced :739) is nearly dead code: `remainingIterations == 0` means `iterationCount >= maxIterations`, which the cap catches earlier at :1115 — prepare never sees it. Generation 1's "buys only about one iteration" is **wrong as a general claim**; it holds only in the corner where the trigger lands at `maxIterations − 1`. [SOURCE: .skilled/commands/deep/assets/deep-research.yaml:1163-1169] [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/divergent-pivot.ts:285-288,733,739] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:1115,1149-1150]

3. **Under `execution_mode: auto` a successful pivot is adopted with no operator in the loop.** `gate_divergent_pivot_choice` is `applies_to: confirm` (yaml:1132), so auto mode skips it and runs the branch's `set`/`command`/`proceed_to` unconditionally — the Council-selected candidate becomes the next focus automatically. The override gate for failed pivots is likewise `applies_to: confirm` (yaml:1172) plus an `insufficient_endorsement` condition (yaml:1175): under auto, a failed pivot simply fails closed to synthesis (yaml:1206–1207). This is consistent with `rules_never: auto_approve_on_behalf_of_user` (yaml:60) — the gate is skipped by design, not auto-answered. So in unattended runs the only binding constraints on yield are `maxPivots`, `maxCouncilSeatOutputs`, `maxIterations`, and council agreement. [SOURCE: .skilled/commands/deep/assets/deep-research.yaml:46,60,1131-1135,1171-1176,1206-1207]

4. **Candidate starvation is not the binding constraint — council agreement is.** Seeds derive only from existing state: registry `openQuestions` + `carriedForwardOpenQuestions`, `questionConflicts`, per-record `verificationGaps`/`contradictions`/`missingSourceClasses`/`alternateEvidenceMethods`/`unansweredAdjacentQuestions`, CONTRADICTS graph edges, and — critically — `registry.keyFindings.slice(-3)` cross-check seeds, which regenerate from the *newest* findings every stop (adapter:198–285). Non-goal conflicts and priorCandidate dedupe (saturated directions, ruled-out, rejected, previously selected) filter them (:354–359, :361–402). With ≥1 finding the seed pool is effectively non-empty each round, so `no_valid_candidates` is rare; the failure modes that actually bind are the `council_*` family (:298–307) — parse failures, quorum failures, `insufficient_endorsement` — each of which fails closed with no same-iteration retry. [SOURCE: .skilled/skills/system-deep-loop/deep-research/scripts/divergent-research-pivot.ts:198-285,354-359,361-402] [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/divergent-pivot.ts:298-307]

5. **D1 honest fix: derive `quality_class` at the single ingest choke point from verifiable source attributes — never trust the leaf's assertion.** The consumer counts distinct `metadata.quality_class` strings per question over ANSWERS→CITES paths (`coverage-graph-signals.ts:680–687`). Today that value can only be leaf-asserted: `upsert.cjs:235` copies `n.metadata` verbatim with no schema check, `SAFE_METADATA_KEYS` (`coverage-graph-query.ts:123–136`) allowlists the *key* but no *value* vocabulary exists, and grep confirms zero runtime producers — only test fixtures emit it. `upsert.cjs` is the sole graph mutation entry point (ARCHITECTURE.md:97; `iteration-graph-upsert.cjs:198` is just a spawn wrapper; both workflow YAMLs call it directly per integration-points.md:47,60). The honest design: **the graph layer produces the class, not the leaf.** Concretely — a deterministic `deriveQualityClass(source)` in the coverage-graph lib keyed on attributes the leaf already supplies and can't freely invent (`path`: repo-relative top-level segment + file type; URL → host/doc class; missing → `unclassified`), stamped during the upsert node-validation loop (`upsert.cjs:211–245`), with leaf-supplied `quality_class` stripped or overwritten at the same point. Vocabulary: a frozen const beside `SAFE_METADATA_KEYS`, e.g. `{repo-code, repo-test, repo-spec, skill-doc, ledger-state, external-doc, external-other, unclassified}` — enumerable and auditable. An equally honest alternative deletes the field entirely and derives the class inside `computeResearchSourceDiversityFromData` at query time — this removes the gaming surface instead of policing it, at the cost of losing the stored label for `query.cjs` display. Residual gaming surface under either design: the leaf can still cite more varied sources to inflate diversity, but cited sources are real paths/URLs that SOURCE_TAGS validation can resolve — the signal becomes "distinct evidence classes actually cited," which is the honest quantity. [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/coverage-graph/coverage-graph-signals.ts:653-691] [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/coverage-graph/coverage-graph-query.ts:123-136] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/upsert.cjs:211-245] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/iteration-graph-upsert.cjs:198] [SOURCE: .skilled/skills/system-deep-loop/ARCHITECTURE.md:97] [SOURCE: .skilled/skills/system-deep-loop/runtime/references/integration-points.md:47,60]

## Ruled Out
- "Pivot buys ~1 iteration" as a general claim — contradicted by the re-fire mechanics: `all_questions_answered` persists after a pivot (no new questions are added), every later stop re-enters the branch, and the lifetime cap is `maxPivots: 3`, not 1. The claim survives only at trigger iteration = `maxIterations − 1`.
- `minRemainingIterations` as a meaningful guard — `remainingIterations == 0` is unreachable because `maxIterationsReached` outranks the pivot branch.
- Candidate exhaustion as the yield limiter — `keyFindings.slice(-3)` cross-check seeds regenerate whenever new findings land.

## Dead Ends
- `maxCouncilSeatOutputs: 9` is a shared lifetime cap — worth recording because a partial/resumed pivot consumes seat budget without completing, silently shrinking the effective pivot count below 3.

## Edge Cases
- Ambiguous input: none material — "trace the code path end to end" was read as prepare → finalize → apply → next convergence check, which is what was traced.
- Contradictory evidence: generation 1's "~1 iteration" estimate vs. the traced yield of `min(N−k, 3)` — resolved against generation 1 on direct code evidence; the archive's claim is narrower than reality.
- Missing dependencies: none — all cited files present and read directly.
- Partial success: none.

## Sources Consulted
- `.skilled/skills/system-deep-loop/deep-research/scripts/divergent-research-pivot.ts` (full, 443 lines)
- `.skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:1100-1229` (+ grep hits :55, :1150, :1713, :1859)
- `.skilled/commands/deep/assets/deep-research.yaml:1020-1210` (+ grep hits :26, :42-60, :1056)
- `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/divergent-pivot.ts:275-314` (+ grep hits :95, :110, :227, :455-483, :733-739, :1024-1042, :1259-1261, :1485)
- `.skilled/skills/system-deep-loop/runtime/lib/coverage-graph/coverage-graph-signals.ts:640-729`
- `.skilled/skills/system-deep-loop/runtime/lib/coverage-graph/coverage-graph-query.ts:100-169`
- `.skilled/skills/system-deep-loop/runtime/scripts/upsert.cjs:200-279`
- `.skilled/skills/system-deep-loop/runtime/scripts/iteration-graph-upsert.cjs:198` (grep)
- `.skilled/skills/system-deep-loop/ARCHITECTURE.md:97` (grep)
- `.skilled/skills/system-deep-loop/runtime/references/integration-points.md:47,60` (grep)
- `specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/research/deep-research-config.json` (run config)
- `specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/research/deep-research-state.jsonl` (live projection)
- `specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/research/deep-research-strategy.md`
- `specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/research/findings-registry.json`

## Assessment
- New information ratio: 0.80 (≈3.25 of 4 substantive findings fully new; finding 5 partially builds on iteration-1's confirmed D1 mechanism)
- Questions addressed: Q3 (both halves), plus a mechanical confirmation of generation 1's "levers add duration only" and a correction of its "~1 iteration" estimate
- Questions answered: Q3
- Iteration-1 residual touched: none of D4/D8 — out of this iteration's focus.

## Reflection
- What worked and why: reading the adapter file in full before tracing callers exposed the seed-regeneration asymmetry (`keyFindings.slice(-3)`) that the yield question actually hinges on; targeted greps then priced the caps (`maxPivots`, `maxCouncilSeatOutputs`, the exclusion list) instead of reading two more large files.
- What did not work and why: nothing failed; the grep for pivot caps in `divergent-pivot.cjs` came back nearly empty because the limits live in the `.ts` lib — the second grep against the lib recovered them in one call.
- What I would do differently: grep the `runtime/lib/` tree first for constants (`DEFAULT_`, `MAX_`, `Set(`) before the `.cjs` scripts — the mechanics live in the TypeScript libs, the `.cjs` files are thin CLIs.

## Questions Answered
- Q3: How many extra iterations does a divergent pivot after all_questions_answered actually buy (trace the code path end to end), and what is the honest fix for D1: who should produce coverage-graph quality_class, from what closed vocabulary, enforced where?

## Questions Remaining
- Q1 residual: D4 (`normalizeQuestionOrigin` fallback), D8 (loop-lock pid-liveness), §8/§10 spot-checks.
- Q2: review side — `divergent-review-pivot.ts`, deep-review reducer, review prompt pack, `fanout-merge.cjs` internals.
- Q4: skill-advisor scorer (`df-idf.ts`) + prompt-policy gate on casual chat.
- Q5: concrete change slices with tests, risks, ordering.
- Q6 (operator-injected at iteration 2): completed-run extension design.
- Open sub-question surfaced by this iteration: whether `maxCouncilSeatOutputs: 9` should be per-pivot rather than lifetime — a resumed pivot currently burns lifetime seat budget.

## Next Focus
Q2 — the review-side narrowness surface (`divergent-review-pivot.ts`, deep-review reducer, review prompt pack, `fanout-merge.cjs` internals). It is the largest unmapped file set in the remaining questions and the natural mirror of this iteration's research-side trace.

## SCOPE VIOLATIONS
None. Note: `progressiveSynthesis: true` would permit a `research/research.md` update under the generic agent contract, but this dispatch's explicit ALLOWED WRITE PATHS list omits it, so `research.md` was not created.

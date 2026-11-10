# Iteration 10: Terminal Consolidation — The Measured Recommendation Package and the rr-iter3-168 Attribution Narrowing

## Focus

All four tracked strategy questions are resolved (deep-research-strategy.md:63-66) and this is the segment's final iteration (maxIterations 10, stop policy max-iterations — deep-research-config.json:3, :104). Strategy Next Focus is "[All tracked questions are resolved]" (deep-research-strategy.md:319). This iteration does two things. First, assemble the terminal recommendation package this segment exists to produce: the held-out evaluation set, the cross-path parity check, their cheap-and-honest placement, and the measured current state the eventual gate would see — citing where each element was established in iterations 1-9. Second, close what can still be closed read-only from iteration 9's residual list (iteration-009.md:95-98) by inspecting the commit diffs in the rr-iter3-168 native-flip window.

Interpretation chosen (as iterations 5-9): terminal consolidation plus the cheapest named residual. Deferred: a per-commit replay (needs a checkout — out of scope for a read-only packet) and the vitest confirmation (repo test tooling). Out of scope respected: P4, P7 and DOC-331 are evidence only, no fix proposed (deep-research-config.json:2). Git commands used were read-only (show, log) and no researched file was modified.

## Actions Taken

1. Re-read state (config, state-log tail, strategy) and confirmed iteration-010.md and deltas/iter-010.jsonl were absent before writing.
2. Read the verifier's own contract first — verify-iteration.cjs findings enumeration (:144-162), route proof (:243-260), core verify path (:385-500) — so the record, delta and narrative satisfy it exactly.
3. Read the answer-carrying iterations (001 for Q1; 004 for Q2; 005 for Q3/Q4) and the terminal measurement iteration (009) for the consolidation below.
4. Read the rr-iter3-168 ledger entry directly and ran bounded read-only git inspection of the flip window's four scorer commits (3a4d1a8927, 479186cfed, a535f25c42, 4e69fb4d45), plus an rg over the current explicit lane for the removed keys.

## Findings

1. **Held-out evaluation set — consolidated recommendation (Q1).** Keep and extend the existing routing-accuracy stack rather than building a new one: a 66-row frozen holdout assembled from three separately-authored fixtures (20 harder + 40 regression + 6 delegation rows), labels copied from each source fixture's own expected field with per-row provenance; held-out discipline is mechanical — family-normalized collision drop against the 195-row labeled-prompts.jsonl training corpus, SHA-256 input pins, and metric ratchets (FULL_CORPUS_FLOOR 0.75, HOLDOUT_FLOOR 0.725, bucket minima 31/32/9); negatives are first-class gold-none rows (18 corpus + 6 holdout) scored as gold_none_false_fire and unknown_count, not "some other skill won"; and the residual overlap caveat stands — scope the set against every tuning surface, since the lane-weight sweep scores the same harder fixture that supplies 20 holdout rows. The 17-positive plus 5-negative battery is a smoke test with visible prompts and no hash pin, not a held-out set. [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/004-routing-evaluation/research/iterations/iteration-001.md:19] [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/004-routing-evaluation/research/iterations/iteration-001.md:20] [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/004-routing-evaluation/research/iterations/iteration-001.md:21] [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/004-routing-evaluation/research/iterations/iteration-001.md:22] [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/004-routing-evaluation/research/iterations/iteration-001.md:23] [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/004-routing-evaluation/research/iterations/iteration-001.md:26]

2. **Cross-path parity check — consolidated recommendation (Q2).** Compare exactly one dimension — strict top-1 skill — with abstention normalized on both sides to a shared sentinel (none/null); do not compare raw confidence or ranks at or below second place, because no cross-implementation calibration exists, lower-rank order is unstable at the 0.82 floors, and the CLI path already requests topK 1. Fail on the ratchet's five reviewed rules: any top-1 disagreement not in the approved ledger; any ledger entry that no longer diverges and was not removed; any recorded promptHash/localTop/nativeTop drift that needs re-review; duplicate ledger ids; orphan ledger ids — and fail loudly when Python is unavailable for a gate meant to be trusted, rather than skip as the opportunistic CLI harness does. The CLI-level harness can stay as a gold-anchored smoke gate but cannot serve as the parity gate itself. [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/004-routing-evaluation/research/iterations/iteration-004.md:18] [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/004-routing-evaluation/research/iterations/iteration-004.md:26] [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/004-routing-evaluation/research/iterations/iteration-004.md:28]

3. **Cheap-and-honest posture — consolidated recommendation (Q3/Q4).** Cheap is a placement decision: run the scorer-level parity gate inside the existing full-install golden-prompt-gate job (the advisor install and real-scorer import are already paid there) using the ratchet's batched model — one Python subprocess plus in-process native calls, measured at roughly 3.9 s warm for all 217 union rows (iteration-009.md:27) — and keep static checks (corpus hash pins, prompt-overlap set algebra) in the lean routing-drift job. Honest is a pinning and determinism decision: sha256-pin every scored input the way the existing corpus gate does, pin the floors, and never place the check in or behind the --warn-only admission step, whose contract is "always exit 0". Ties at 0.82 are three calibrated floor constants collapsing onto one value, and both scorer paths break ties deterministically (ending on skill-name ascending), so tie-induced divergences are stable and belong in the reviewed ledger. The one piece that cannot be extended in place is the 17+5 battery script, which lives in a packet scratch directory rather than the runtime test tree. [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/004-routing-evaluation/research/iterations/iteration-005.md:18] [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/004-routing-evaluation/research/iterations/iteration-005.md:20] [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/004-routing-evaluation/research/iterations/iteration-005.md:22] [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/004-routing-evaluation/research/iterations/iteration-005.md:24] [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/004-routing-evaluation/research/iterations/iteration-005.md:28] [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/004-routing-evaluation/research/iterations/iteration-009.md:27]

4. **Measured current state the eventual gate would see (restated from iteration 9 for the terminal package).** 73 of 73 union divergences are ledgered; the ratchet-semantics replay predicts exactly one rule-(c) review item, rr-iter3-168; 43 of 73 divergences (59%) are the local-abstention class (local none against a native route); floor-level top-1 margins can be as small as roughly 1e-4 (0.8251 vs 0.825 on the probed row); and the full-union cost is roughly 3.9 s warm. The vitest confirmation of the predicted failure remains the settlement step (transfer caveat: the replay used Node type stripping, not vitest transforms). [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/004-routing-evaluation/research/iterations/iteration-009.md:27] [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/004-routing-evaluation/research/iterations/iteration-009.md:29] [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/004-routing-evaluation/research/iterations/iteration-009.md:33] [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/004-routing-evaluation/research/iterations/iteration-009.md:35]

5. **rr-iter3-168 attribution narrowed by read-only commit inspection (new this iteration).** The entry's own fields read directly: gold system-deep-loop, localTop deep-research (matches today's local), ledgered nativeTop system-deep-loop, approved 2026-09-19 — while today's native top is system-spec-kit (iteration-009.md:31). Diff evidence this iteration eliminates the two most recent structural suspects: fusion.ts's last change (3a4d1a8927, 2026-09-30) is a comment/section-banner and import-path refactor with no scoring logic in its diff; and the four native phrase boosts removed by 4e69fb4d45 (5d scoring, 5-dimension agent scoring, integration scan, dynamic profile) do not occur in the entry's prompt, which reads: Run `/deep:research :auto --max-iterations=8` on the routing packet. a535f25c42 is additive (adds a different prompt class's signal) and 479186cfed is the window's largest native semantic change (path/doc-target mention rules, removal of the findings token boost, new ledger entries), followed by 827e44abc8 (routing vocabulary drift plus graph regeneration) and earlier skill-graph regenerations. Pinning one commit still needs a per-commit replay with a checkout, which is out of scope here; the assertion is narrowing, not attribution. [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/004-routing-evaluation/research/iterations/iteration-009.md:31] [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/004-routing-evaluation/research/iterations/iteration-009.md:95] [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/parity/fixtures/local-native-approved-divergences.json:612] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts:127] [INFERENCE: the eliminations rest on the git show diffs for 3a4d1a8927, 4e69fb4d45, 479186cfed and a535f25c42 read this iteration (recorded in Sources Consulted) and on the rg absence check over the current explicit lane, exit 1]

6. **Terminal package summary (deliverable shape).** The segment's recommendation reduces to three moves — (i) extend the existing holdout and corpus-pin stack as the held-out evaluation set; (ii) wire the existing ratchet as a blocking parity gate in golden-prompt-gate (never --warn-only); (iii) keep static pins in routing-drift — plus one standing disposition (ties and divergences stay in the reviewed ledger, never a threshold nudge), one open review item (rr-iter3-168), and two unmeasured settlement steps (vitest confirmation; CI minutes). Each move names an in-place extension of an existing harness, job or fixture, so its reversal cost is a workflow edit or job removal rather than a new harness — as low as the prevent-overengineering reversal-cost order allows. [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/004-routing-evaluation/research/iterations/iteration-005.md:33] [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/004-routing-evaluation/research/iterations/iteration-009.md:35] [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/004-routing-evaluation/research/iterations/iteration-009.md:97]

## Ruled Out

- **Treating the rr-iter3-168 native flip as caused by the fusion.ts change 3a4d1a8927**: its complete diff for fusion.ts is section banners plus one import-path change — no scoring semantics. Candidate for reducer promotion to Ruled Out Directions.
- **Attributing the rr-iter3-168 flip to 4e69fb4d45's removed native phrase boosts**: none of the four removed keys occurs in the entry's prompt, and rg finds none of them in the current explicit lane (exit 1).

## Dead Ends

- None beyond the two ruled-out attributions above. The remaining attribution gap is a tooling limit (no checkout in a read-only packet), not an attempted-and-abandoned approach.

## Edge Cases

- Ambiguous input: Next Focus is empty/resolved; interpretation chosen as in iterations 5-9 (terminal consolidation plus the cheapest named residual); deferred alternatives recorded in Focus.
- Contradictory evidence: the rr-iter3-168 ledger value (nativeTop system-deep-loop, approved 2026-09-19) still contradicts today's native measurement (system-spec-kit, iteration-009.md:31); both values are preserved, and the conflict remains attributed to time pending the re-review/replay.
- Missing dependencies: none — git and rg were available read-only; no repo test tooling was needed.
- Partial success: none — all planned actions completed; the attribution is honestly reported as narrowed, not pinned.

## Questions Answered

- None of the four tracked strategy questions — all were resolved at iterations 1-5 (deep-research-strategy.md:63-66) and the reducer's registry shows them resolved. This iteration consolidates them; the consolidated answer package is Findings 1-3 and 6.

## Questions Remaining

- Confirm the predicted single rule-(c) failure by running npx vitest run tests/parity/local-native-divergence-ratchet.vitest.ts in a normal dev environment; also settle the type-stripping-vs-vitest transfer caveat (iteration-009.md:95).
- Pin the rr-iter3-168 flip to one commit by per-commit replay (checkout or worktree), now narrowed to the Oct 10-11 native-vocabulary and graph changes (this iteration, Finding 5).
- The bridge-vs-daemon client-order class (iteration-007.md:31) still has no measured population size; the five iteration-7 rows remain its only measured instances.
- CI minutes added by wiring a parity gate still require a CI run (out of scope for this read-only packet).
- The full 217-prompt union pass has now been measured engine-level (iteration 9); what remains is its confirmation through the real ratchet test above.

## Sources Consulted

- specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/004-routing-evaluation/research/deep-research-config.json
- specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/004-routing-evaluation/research/deep-research-state.jsonl
- specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/004-routing-evaluation/research/deep-research-strategy.md
- specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/004-routing-evaluation/research/findings-registry.json
- specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/004-routing-evaluation/research/iterations/iteration-001.md
- specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/004-routing-evaluation/research/iterations/iteration-004.md
- specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/004-routing-evaluation/research/iterations/iteration-005.md
- specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/004-routing-evaluation/research/iterations/iteration-009.md
- specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/004-routing-evaluation/research/deltas/iter-009.jsonl
- .skilled/skills/system-deep-loop/runtime/scripts/verify-iteration.cjs
- .skilled/skills/system-deep-loop/runtime/lib/deep-loop/iteration-findings.cjs
- .skilled/skills/system-skill-advisor/runtime/tests/parity/fixtures/local-native-approved-divergences.json
- .skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts
- git provenance (read-only): commits 3a4d1a8927 (fusion.ts, 2026-09-30), 479186cfed (2026-10-10), a535f25c42 (2026-10-11), 4e69fb4d45 (2026-10-11)

## Assessment

- New information ratio: 0.60
- Justification: 1 of 6 findings fully new (the commit-diff attribution narrowing), 4 partially new consolidations (the Q1, Q2, Q3/Q4 recommendation assemblies and the terminal package summary), 1 redundant by design (the measured current-state restatement carried from iteration 9): (1.0 + 4x0.5)/6 = 0.50, plus the +0.10 terminal-synthesis bonus for reducing the segment to one coherent package.
- Questions addressed: none open; terminal consolidation of Q1-Q4 plus iteration 9's attribution residual.
- Questions answered: none new at question level; the strategy's four remain answered as recorded (deep-research-strategy.md:86-89).

## Reflection

- What worked and why: reading the verifier's enumeration and route-proof functions before writing fixed the artifact contract up front; diff-reading the four commits against the entry's exact prompt tokens produced two clean eliminations without any write; and checking the current explicit lane with rg anchored the absence claim in the working tree rather than in history alone.
- What did not work and why: the first two consolidation extraction attempts failed on the read tool's annotation prefix (a parsing bug in my helper, not evidence loss); and the attribution cannot be closed by diff-reading alone because several Oct 10-11 native-vocabulary changes remain individually plausible for this row.
- What I would do differently: for a terminal consolidation, parse the annotated read output correctly from the first attempt, and time-box the residual to the elimination it can actually support instead of reaching for a pin.

## Recommended Next Focus

1. Settlement in a normal dev environment: run npx vitest run tests/parity/local-native-divergence-ratchet.vitest.ts and confirm or refute the predicted rr-iter3-168 rule-(c) failure.
2. If the segment continues: per-commit replay of the Oct 10-11 native-vocabulary and graph commits against this single row to pin the flip; sample the bridge-vs-daemon client-order population; measure CI minutes via a real wired run.
3. Feed the synthesis step this package (Findings 1-3 and 6) as the terminal answer.

## Next Focus

Terminal iteration — see Recommended Next Focus. No strategy questions remain; the segment's answer package is Findings 1-3 and 6.

# Iteration 6: Live Measurement — 0.82 Tie Frequency, Per-Prompt Cost, and Cross-Path Agreement on the 17+5 Battery

## Focus

All four strategy questions are resolved (deep-research-strategy.md:63-66; :221 "[All tracked questions are resolved]"). Iteration 5 closed the question layer and left only measurement-level uncertainty: the actual cost of a scored pass and the frequency of 0.82-floor ties, both of which "require executing the harnesses, outside this read-only run" (iteration-005.md:37, :89). The dispatch for this iteration explicitly permits and encourages executing both advisor paths on the same prompts, so this iteration converts those structural claims into observed numbers by replaying the battery's exact 17+5 probes (advisor-probe-battery.md:27-53) through both entry points, then replaying the single divergence and the single failed call three times each to separate flake from determinism.

Ambiguous input: the strategy "Next Focus" and the dispatch focus both read "[All tracked questions are resolved]" — no named focus. Interpretation chosen: measure the residual uncertainty named by the latest iteration's own Questions Remaining (the narrowest evidence-backed reading, explicitly sanctioned by the dispatch's run-both-paths allowance). Deferred alternatives: re-opening Q1-Q4 (would repeat resolved evidence) or idling (no new information).

Out-of-scope respected: P4, P7 and DOC-331 are recorded as evidence only; no fix is proposed for them (topic text, deep-research-config.json:2).

## Actions Taken

1. Re-read state (config, state log, strategy, registry, iterations 4-5) and verified the write boundary: iteration-006.md and deltas/iter-006.jsonl were absent before writing.
2. Read the Node shim end-to-end to establish execution semantics and side effects before running anything: the default IPC socket dir `/tmp/system-skill-advisor` (skill-advisor.cjs:25), its creation when absent (:85-96), the dist-freshness gate (:70-83), and the spawn of the built CLI (:105).
3. Read the battery's source of truth: 17 positive rows P1-P17 (advisor-probe-battery.md:27-43), 5 negative rows N1-N5 (:49-53), the aggregate pass rule ≥14/17 positives and 0/5 negative false positives (:60-61), and the replay contract in advisor-battery.py (:19, :20, :45, :87-88).
4. Ran one script that extracted all 22 probes and executed both paths per probe — Python `skill_advisor.py <prompt> --threshold 0.8 --force-native` (advisor-battery.py:45) and Node `skill-advisor.cjs advisor_recommend --json {"prompt":...} --format json` (advisor-battery.py:20) — recording top-1, top-2 confidence, freshness and wall ms per call. Exit 0; 52.8s total. Worktree unchanged: git status before/after identical (pre-existing `M spec.md` and untracked `research/` only); `/tmp/system-skill-advisor` entry count 20 → 20.
5. Replayed P1 and P7 three times per path (22.2s) to test stability of the divergence and of the failure.
6. Confirmed the Python path's sqlite load is SELECT-only (skill_advisor.py:1165-1191), supporting the "no researched file changed" claim.

## Findings

1. **Live cross-path top-1 agreement is 19/20 comparable probes, and the single divergence is stable and reproducible.** On the primary pass, 20 probes produced top-1 on both paths (P1 and N2 lack a Python top-1; see Findings 4 and 5); 19 agreed. The one disagreement is P7 (advisor-probe-battery.md:33): Python returns sk-code at 0.8899 in 4/4 runs, Node returns system-spec-kit at 0.8364 in 4/4 runs. P1, once the Python path answers, agrees at sk-code 0.8787 on both sides. A parity check comparing top-1 would therefore have exactly one live disagreement on this battery, and it is deterministic rather than flaky. [SOURCE: .skilled/skills/sk-code/manual-testing-playbook/skill-advisor-integration/advisor-probe-battery.md:33] [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/014-skill-authoring-ux-research/007-advisor-name-mention-scoring/scratch/advisor-battery.py:45] [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/014-skill-authoring-ux-research/007-advisor-name-mention-scoring/scratch/advisor-battery.py:20]

2. **0.82 exact ties are common, not exceptional: 5 of 21 Python-scored probes (5 of 22 Node-scored) end with top-1 confidence exactly 0.82 and the runner-up also exactly 0.82 — P3, P5, P15, N1, N5 — and 11/21 have 0.82 somewhere in the top two.** The top-2-equal set is identical on both paths, and the id sets for 0.82 anywhere in the top two are nearly identical (Python 11: P2, P3, P4, P5, P8, P9, P10, P11, P15, N1, N5; Node 10, missing P4). So roughly one in four probes is an exact floor tie, resolved deterministically on both paths (the tie-break keys were established in iteration 5), which is precisely the class a ledger-based failure contract absorbs and a raw-threshold gate cannot distinguish from noise. [SOURCE: .skilled/skills/sk-code/manual-testing-playbook/skill-advisor-integration/advisor-probe-battery.md:30] [SOURCE: .skilled/skills/sk-code/manual-testing-playbook/skill-advisor-integration/advisor-probe-battery.md:49] [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:1169]

3. **Cost per prompt was measured, not inferred: Python 1.76s mean (range 0.77-4.46s; 38.7s total over 21 calls) vs Node 0.59s mean (range 0.24-1.10s; 13.0s total over 22 calls) — roughly 3x cheaper on the Node/daemon path.** For the exact 17+5 battery that is ≈39s versus ≈13s, both executed end-to-end this iteration. Caveat: the Node daemon was already warm (socket dir pre-existed with 20 entries; every response reported `freshness: live`), so this is the warm-daemon figure; the cold-daemon start cost was not measured. The Python figure is the per-process spawn model (one subprocess per prompt, advisor-battery.py:45), which is the model a naive parity script would pay; the batched ratchet model pays one subprocess for the whole corpus instead. [SOURCE: .skilled/bin/skill-advisor.cjs:25] [SOURCE: .skilled/bin/skill-advisor.cjs:105] [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/014-skill-authoring-ux-research/007-advisor-name-mention-scoring/scratch/advisor-battery.py:45]

4. **The first Python invocation failed transiently with NATIVE_CALL_FAILED, and the same prompt then succeeded 3/3 on replay.** The very first call of the session (P1) exited 2 with `{"error": "Native advisor unavailable", "reason": "NATIVE_CALL_FAILED", "freshness": "native-unavailable"}` after 4.46s; replays returned sk-code at 0.8787 in 2.88s, 2.74s and 3.07s. A one-shot parity pass would have recorded a false P1 divergence; a gate must retry or warm up, and must refuse to score a degraded run — which is the precedent the existing battery already sets (advisor-battery.py:47-48, :87-88). [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/014-skill-authoring-ux-research/007-advisor-name-mention-scoring/scratch/advisor-battery.py:87] [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/014-skill-authoring-ux-research/007-advisor-name-mention-scoring/scratch/advisor-battery.py:47]

5. **Live battery state on this worktree passes on both paths: Node 15/17 positives and Python 16/17 counting the P1 replay (15/16 on the primary pass); negatives 0/5 on both paths by the battery's own rule.** Node misses: P4 → system-deep-loop, P7 → system-spec-kit. Python misses: P4 → system-deep-loop plus the P1 cold-start failure. P4 and P7 are exactly the two probes the topic places out of scope for fixes; recorded as evidence only. Nuance worth carrying forward: the negative probes' stated expected top-1 is not what the battery asserts — N1 sk-doc ✓, N2 none ✓, N3 system-deep-loop (stated spec_kit:resume), N4 cli-external-orchestration (stated sk-doc), N5 system-deep-loop (stated deep-research) — the pass rule only requires that sk-code not win (advisor-probe-battery.md:60-61), so the negative half currently measures sk-code avoidance, not expected routing. [SOURCE: .skilled/skills/sk-code/manual-testing-playbook/skill-advisor-integration/advisor-probe-battery.md:30] [SOURCE: .skilled/skills/sk-code/manual-testing-playbook/skill-advisor-integration/advisor-probe-battery.md:33] [SOURCE: .skilled/skills/sk-code/manual-testing-playbook/skill-advisor-integration/advisor-probe-battery.md:60] [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/004-routing-evaluation/research/deep-research-strategy.md:57]

6. **Measured confidence drift confirms the earlier raw-confidence elimination: top-1 confidence is identical on 17/20 comparable probes, drifts slightly on 2 (P4 0.92 vs 0.9248; N3 0.95 vs 0.9459), and differs fully at the P7 divergence (0.8899 vs 0.8364).** Comparing raw confidence would add two false diffs (P4, N3 — both agreeing on top-1) to the one real divergence; confidence belongs in the record for diagnosis, not in the parity predicate. This is measurement support for the dimension already ruled out in iteration 4 (iteration-004.md:26). [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:1169] [SOURCE: .skilled/bin/skill-advisor.cjs:105] [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/004-routing-evaluation/research/iterations/iteration-004.md:26]

## Questions Answered

- None of the four tracked strategy questions — all were resolved at iterations 1-5 (deep-research-strategy.md:86-89). This iteration answered the residual measurement questions instead: tie frequency quantified (Finding 2), per-prompt cost measured (Finding 3), live top-1 agreement measured (Finding 1), cold-start behavior observed (Finding 4).

## Questions Remaining

- None at question level. Remaining measurement gaps, each with what would settle it: (a) cold-daemon Node start cost — settle by measuring a first call with no warm daemon; (b) CI minutes added by wiring a gate — settle by a CI run, out of scope for this read-only packet; (c) the full 217-prompt union's live agreement — settle by a batched pass over the union; this iteration measured the 22-probe battery only.

## Ruled Out

- Single-shot parity scoring without warm-up or retry: eliminated by the P1 NATIVE_CALL_FAILED observation — three replays of the same prompt succeeded, so a no-retry pass would record false divergences.
- Comparing raw top-1 confidence values: live measurement adds support to the earlier elimination (iteration-004.md:26) — 2/20 comparable probes drift on confidence while agreeing on top-1.

## Dead Ends

- No other direction was exhausted this iteration; nothing new for the reducer's Exhausted Approaches beyond the two Ruled Out items above.

## Edge Cases

- Ambiguous input: the strategy Next Focus and dispatch focus both read "[All tracked questions are resolved]"; chosen interpretation was to measure the residual uncertainty named in iteration-005.md:37, with re-opening resolved questions deferred.
- Contradictory evidence: none new. The iteration-4 contradiction (the ratchet self-describing as a CI gate vs no workflow invoking the cross-path harnesses, iteration-004.md:24) is unchanged; CI wiring was not re-examined.
- Missing dependencies: none — both paths executed. Caveat recorded in Finding 3: the Node daemon was pre-warmed, so the cold-start cost is unmeasured.
- Partial success: the first Python probe failed transiently and was recovered by replay within the iteration; all other actions succeeded. Status rationale: `complete`, with the failure recorded as Finding 4 rather than smoothed over.

## Sources Consulted

- .skilled/skills/sk-code/manual-testing-playbook/skill-advisor-integration/advisor-probe-battery.md
- specs/sk-code/011-sk-code-poinytail-based-refinement/014-skill-authoring-ux-research/007-advisor-name-mention-scoring/scratch/advisor-battery.py
- .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py
- .skilled/bin/skill-advisor.cjs
- .skilled/skills/system-deep-loop/runtime/scripts/append-mode-event.cjs
- specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/004-routing-evaluation/research/deep-research-config.json
- specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/004-routing-evaluation/research/deep-research-strategy.md
- specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/004-routing-evaluation/research/deep-research-state.jsonl
- specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/004-routing-evaluation/research/findings-registry.json
- specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/004-routing-evaluation/research/iterations/iteration-004.md
- specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/004-routing-evaluation/research/iterations/iteration-005.md
- specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/004-routing-evaluation/research/deltas/iter-005.jsonl

## Assessment

- New information ratio: 0.83
- Justification: 4 of 6 findings are fully new live measurements (agreement 19/20 with a stable P7 divergence; 0.82 exact-tie frequency 5/21; per-prompt cost 1.76s vs 0.59s; first-call NATIVE_CALL_FAILED flake); 2 are partially new (live battery pass state refining the 007 record; measured confidence drift supporting the already-ruled-out comparison dimension). No simplicity bonus — no open question was closed.
- Questions addressed: the residual measurement uncertainty named in iteration-005.md:37.
- Questions answered: none of the tracked strategy questions; the measurement uncertainty is now quantified.

## Reflection

- What worked and why: running both paths on the exact battery probes with per-call timing converted every remaining structural claim into an observed number in about 75s of command wall time. Reading the shim's side-effect surface before executing (skill-advisor.cjs:85-96, :105) is what made the run honest about what it touched, and the 3x replay of the single divergence is what separates "stable, ledger-able" from "flaky".
- What did not work and why: the very first Python call failed with NATIVE_CALL_FAILED; a one-shot design would have mis-recorded it as a divergence. The root cause was not established — only the symptom and its resolution by retry were measured.
- What I would do differently: warm the Python path once before a scored pass (discarding the warm-up call), and measure the daemon cold start deliberately instead of inheriting a pre-warmed socket dir.

## Next Focus

Measurement is nearly closed. If iteration 7 runs: (a) with execution still permitted, replay the 217-prompt union batched (ratchet-style) to price the real gate rather than the 22-probe battery, and measure a cold Node daemon start deliberately; (b) otherwise move to final synthesis with the measured facts: a parity predicate of top-1 plus abstention only, an approved-divergence ledger for the stable divergences, a warm-up plus retry step because of Finding 4, and the 5/21 tie frequency as the reason tie pairs are reviewed artifacts rather than thresholds.

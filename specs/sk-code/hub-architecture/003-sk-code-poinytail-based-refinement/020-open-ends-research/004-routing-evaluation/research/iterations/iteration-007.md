# Iteration 7: Cold-Runner Daemon Behavior and Live Cross-Path Agreement on a 49-Prompt Union Sample

## Focus

All four strategy questions are resolved (deep-research-strategy.md:63-66). Iteration 6 closed the battery-level measurements and left three explicit gaps (iteration-006.md:40): (a) cold-daemon Node start cost — "settle by measuring a first call with no warm daemon"; (b) CI minutes added by wiring a gate — "out of scope for this read-only packet"; (c) "the full 217-prompt union's live agreement — settle by a batched pass over the union; this iteration measured the 22-probe battery only." This iteration attacks (a) and (c) with a deterministic stride sample of the union and the same envelope-trust rule the battery already uses.

Result in one line: (a) resolved as a **negative finding that is more important than the number would have been** — the Node CLI has no on-demand daemon spawn, so a cold runner without the launcher-run daemon silently degrades to a local scorer instead of starting a cold daemon; (c) sampled and quantified under trusted envelopes: **44/49 top-1 agreement (89.8%)**, with 5 divergences in 3 classes, 3 of which are not in the reviewed 73-entry ledger.

Ambiguous input: the strategy "Next Focus" and the dispatch focus both read "[All tracked questions are resolved]". Interpretation chosen (same as iterations 5-6): measure the residual uncertainty named by the latest iteration's own Questions Remaining (iteration-006.md:40), the narrowest evidence-backed reading, sanctioned by the dispatch's run-both-paths allowance. Deferred: re-opening Q1-Q4 (would repeat resolved evidence).

Out of scope respected: P4, P7 and DOC-331 are recorded as evidence only; no fix is proposed (topic text, deep-research-config.json:2). No researched file was modified; both measurement passes left `git status` byte-identical (pre-existing `M spec.md` + untracked `research/` only).

## Actions Taken

1. Re-read state (config, state log, strategy, registry, iterations 3/5/6, deltas/iter-006.jsonl) and verified the write boundary: iteration-007.md and deltas/iter-007.jsonl were absent before writing; only the two allowed artifacts plus append-gateway writes were created.
2. Re-read the Node shim end-to-end to fix the execution semantics before running anything: default socket dir `/tmp/system-skill-advisor` (skill-advisor.cjs:25), `SPECKIT_IPC_SOCKET_DIR` override (:86), dir creation (:91), the spawn of the built CLI dist with inherited env (:105), and the `--warm-only` stale-dist exit-code route (:77).
3. Read the battery script's invocation and trust contract: Node `advisor_recommend --json {prompt} --format json` (advisor-battery.py:20); Python `skill_advisor.py <prompt> --threshold 0.8 --force-native` (:45); the envelope trust rule `status == 'ok'` AND `data.freshness in ('live','stale')` (:36-37).
4. Built the union sample: labeled corpus 195 rows + harder fixture 22 rows = the 217-prompt union (findings-registry.json:721; iteration-004.md:12), of which 215 are machine-readable as prompts (labeled-prompts.jsonl:1; holdout-prompts.jsonl:1 carries 20 of the 22 harder rows). Deterministic stride: every 5th labeled row (39) + every 2nd harder row (10) = **49 prompts**.
5. First measurement pass (49 probes, both paths): Node calls ran with a custom `SPECKIT_IPC_SOCKET_DIR` in a fresh directory. Raw agreement came out 34/49 — then the envelope check exposed why: every Node row lacked `freshness` and the fresh dir stayed **empty**; a direct replay showed `degraded: true, source: "local-scorer"`, exit 0, status ok. That pass was invalid as parity data and was recycled as the degraded-mode evidence (Finding 1).
6. Corrected pass (same 49 prompts, both paths, default live daemon): all 49 Node rows trusted (status ok, freshness live, not degraded). Agreement 44/49. Python ran native with zero retries and zero failures.
7. Probed cold-start directly: `warm` is not a command (exit 64, "Unknown command: warm"); `advisor_recommend --warm-only` fails `connect ENOENT …/daemon-ipc.sock` (exit 75); the plain call in the same empty dir degrades instead of spawning. No daemon was ever created in the custom dirs.
8. Checked the 5 divergences against the reviewed ledger (local-native-approved-divergences.json, 73 entries): 2 have entries with the same row id; 3 are absent by id and by exact prompt text.
9. Noted for the record: `progressiveSynthesis` is true (deep-research-config.json:15), but `research/research.md` is outside this dispatch's allowed-write list, so it was intentionally not edited; synthesis is left to the reducer/synthesis step.

## Findings

1. **The Node CLI never spawns a daemon on demand: without a live daemon it silently degrades to an in-process local scorer (exit 0, `status: ok`, `degraded: true`, `source: local-scorer`, no `freshness`), while `--warm-only` fails closed with `ENOENT …/daemon-ipc.sock` (exit 75).** With a fresh `SPECKIT_IPC_SOCKET_DIR` the directory stayed empty and two consecutive calls took 380 ms / 299 ms in degraded mode; `warm` is not a command (exit 64, hint `list-tools`). So the "cold-daemon Node start cost" gap (iteration-006.md:40a) cannot be measured through the CLI at all: daemon lifecycle is launcher-owned, and a cold runner (no launcher daemon) does not pay a cold start — it silently scores with a _different engine_. The only honesty guard is the battery's own envelope rule `status ok AND freshness in (live|stale)` (advisor-battery.py:36-37), which flags every degraded row. [SOURCE: .skilled/bin/skill-advisor.cjs:25] [SOURCE: .skilled/bin/skill-advisor.cjs:86] [SOURCE: .skilled/bin/skill-advisor.cjs:105] [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/014-skill-authoring-ux-research/007-advisor-name-mention-scoring/scratch/advisor-battery.py:36]

2. **Trusted live cross-path top-1 agreement on a 49-prompt stride sample of the 217-prompt union is 44/49 = 89.8%, all rows envelope-trusted; the same 49 prompts under the degraded fallback would have scored 34/49 = 69.4%.** The 20-point swing is produced purely by envelope trust: degraded Node returned `none` on 16/49 rows vs 6/49 for both the trusted daemon path and Python. The divergence budget a top-1 parity gate should expect on this corpus is therefore ~10% (5/49, ±sampling), not ~1/20 as the crafted battery suggested, and the gate must refuse degraded envelopes or it will manufacture divergences of the same size as the signal. [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/labeled-prompts.jsonl:1] [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/holdout-prompts.jsonl:1] [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/014-skill-authoring-ux-research/007-advisor-name-mention-scoring/scratch/advisor-battery.py:20]

3. **The 5 trusted divergences fall into 3 classes, and 3 of the 5 are not in the reviewed 73-entry divergence ledger.** (i) memory:save vs system-spec-kit (rr-iter2-022, rr-iter3-106, rr-iter3-116 — Node ranks memory:save first, Python ranks system-spec-kit first at higher confidence; none of the three appears in the ledger by row id or exact prompt text). (ii) The known P7-class name-mention case reproduces on rr-iter3-061 (Node system-spec-kit 0.8364 / Python sk-code 0.8899 — the exact score pair recorded for battery P7 at iteration-006.md:22), and its ledger entry (id rr-iter3-061, approved 2026-09-07) records a different pair (local=system-deep-loop, native=system-spec-kit): the ledger entry is stale on the Python side, where live behavior now reaches the gold sk-code the ledger says "neither side reaches" (ledger reason text). (iii) rr-iter3-081 is a 0.82-order flip at an exact tie; it is ledgered with matching values (ledger local=sk-prompt / native=system-spec-kit). [INFERENCE: ledger matching semantics are by row id/promptHash in the ratchet; the three "absent" rows were checked by id and by exact prompt text and matched neither, so a gate that ratchets strict top-1 against this ledger would surface them as new.] [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/parity/fixtures/local-native-approved-divergences.json:1] [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/004-routing-evaluation/research/iterations/iteration-006.md:22]

4. **The 0.82 floor is the dominant regime on the union too, but the battery overstates exact ties: 28/49 sample rows (57%) touch 0.82 somewhere in the top two on _both_ paths, while exact top-2 ties are 5/49 (10%) with identical sets on both paths (battery comparison: 11/21 = 52% touch, 5/21 = 24% exact, iteration-006.md:24).** Implication for the evaluation set: the floor's prevalence is representative, but a battery-only tie rate is not; and since one of the five live divergences is a tie-order flip at the floor (Finding 3-iii), tie handling must be part of the parity contract rather than noise to be filtered. [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/labeled-prompts.jsonl:1] [SOURCE: .skilled/skills/sk-code/manual-testing-playbook/skill-advisor-integration/advisor-probe-battery.md:30] [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/004-routing-evaluation/research/iterations/iteration-006.md:24]

5. **Union-sample live costs: Node daemon 282 ms mean (median 262, max 504) vs Python per-process 827 ms mean (median 807, max 1291) — ~2.9x — but the same Python workload measured 404 ms mean (median 393) in the earlier pass minutes before, so absolute cost is load-sensitive and only the within-pass ratio is stable.** No Python failure or retry occurred in the trusted pass. [INFERENCE: extrapolating measured means over the full 217-prompt union for the naive per-prompt model gives ≈1.0 min Node + ≈3.0 min Python ≈ 4.0 min per full both-paths pass; the batched ratchet model (one Python subprocess for the corpus) remains the cheaper existing pattern but was not measured, and CI minutes depend on wiring, which is out of scope here.] [SOURCE: .skilled/bin/skill-advisor.cjs:105] [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/labeled-prompts.jsonl:1]

6. **Both live divergences that reproduce the Node side of the ledger also show an internal Node ranking anomaly: on rr-iter2-022 and rr-iter3-061 the Node list's #2 confidence exceeds its #1 confidence (0.9417 > 0.8398; 0.8899 > 0.8364), and in both cases Python's top-1 is the higher-confidence skill.** A parity check comparing top-1 strings sees these as divergences; a check comparing confidences sees Node disagree with its own ordering. Recorded as evidence for the parity dimension design (top-1 remains the right predicate; confidence belongs in the diagnostic record) and as an observation only — no fix is proposed (P4/P7/DOC-331 stay out of scope). [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/labeled-prompts.jsonl:1] [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/004-routing-evaluation/research/iterations/iteration-004.md:12]

## Questions Answered

- None of the four tracked strategy questions — all were resolved at iterations 1-5 (deep-research-strategy.md:63-66). This iteration settled the two actionable residual measurement gaps instead: (a) cold-daemon start, resolved as an unavailable-through-CLI measurement plus the degraded-fallback finding (Finding 1); (c) union-wide live agreement, now sampled at 44/49 trusted (Finding 2).

## Questions Remaining

- (b) CI minutes added by wiring a parity gate — still requires a CI run (out of scope for this read-only packet); this iteration supplies measured union-sample costs as the input estimate only (Finding 5).
- The full 217-prompt union pass remains unmeasured; the 49-prompt stride sample bounds the agreement estimate (~10% divergence budget) but the per-class counts on the full union are unknown.
- The half of the segment worth an explicit note: the 3 uncovered divergences (Finding 3) are identified by row id but their status against the ratchet's actual matching semantics was not read this iteration; the check is cheap and named in Recommended Next Focus.

## Ruled Out

- **Inducing a cold daemon spawn through the CLI**: `warm` is not a command (exit 64) and `--warm-only` fails ENOENT (exit 75) in an empty custom dir; the plain call degrades instead. Daemon lifecycle is launcher-owned, so no CLI-shaped cold-spawn measurement exists. Candidate for reducer promotion to Exhausted Approaches.
- **Using a custom `SPECKIT_IPC_SOCKET_DIR` as an isolated measurement channel**: every call there silently degrades to the local scorer, so the channel cannot carry trusted parity data. Candidate for reducer promotion (it also generalizes: any CI runner without the live daemon is in this state).

## Dead Ends

- The first degraded pass as parity evidence — dead as measurement, recycled as the honesty evidence in Finding 1/2.
- Reading `freshness` as a per-call diagnostic on the degraded path — the field does not exist there; absence is the signal, which is exactly why the battery's envelope rule requires it to be present and live/stale.

## Edge Cases

- Ambiguous input: Next Focus unresolved in both strategy and dispatch; interpretation chosen as in iterations 5-6 (measure the named residual gaps), alternatives deferred.
- Contradictory evidence: the first pass (34/49) and the corrected pass (44/49) conflicted until the envelope check explained it — the conflict was resolved by evidence (degraded flag, empty socket dir, ENOENT under `--warm-only`), not smoothed over; both numbers are recorded with their trust status.
- Missing dependencies: cold-daemon spawn via CLI (launcher-owned) and a launcher-started daemon in a custom dir — both unavailable; fallback used was the `--warm-only` failure probe plus the degraded pass timing, and the cold-start number is explicitly left unmeasured rather than guessed.
- Partial success: the cold-start action failed in its original framing while all other actions succeeded; status remains `complete` because the in-scope questions were answered with the substitutions and the failure is recorded, not hidden.

## Sources Consulted

- .skilled/bin/skill-advisor.cjs
- .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/labeled-prompts.jsonl
- .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/holdout-prompts.jsonl
- .skilled/skills/system-skill-advisor/runtime/tests/parity/fixtures/local-native-approved-divergences.json
- .skilled/skills/sk-code/manual-testing-playbook/skill-advisor-integration/advisor-probe-battery.md
- specs/sk-code/011-sk-code-poinytail-based-refinement/014-skill-authoring-ux-research/007-advisor-name-mention-scoring/scratch/advisor-battery.py
- specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/004-routing-evaluation/research/deep-research-config.json
- specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/004-routing-evaluation/research/deep-research-strategy.md
- specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/004-routing-evaluation/research/deep-research-state.jsonl
- specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/004-routing-evaluation/research/findings-registry.json
- specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/004-routing-evaluation/research/iterations/iteration-003.md
- specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/004-routing-evaluation/research/iterations/iteration-004.md
- specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/004-routing-evaluation/research/iterations/iteration-006.md
- specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/004-routing-evaluation/research/deltas/iter-006.jsonl

## Assessment

- New information ratio: 0.92
- Justification: 5 of 6 findings are fully new live measurements (silent degraded fallback / no on-demand daemon spawn with exact exit evidence; trusted union-sample agreement 44/49 and the 34/49 degraded counterfactual; divergence classes plus ledger coverage for all 5; floor touch 28/49 and exact ties 5/49; the Node ranking inversion on both reproducing divergences). 1 is partially new (union-sample costs refine iteration 6's battery costs and add the load-variance caveat). No simplicity bonus — no open question closed, only residuals narrowed.
- Questions addressed: iteration-006.md:40 gaps (a) and (c).
- Questions answered: none of the tracked strategy questions; both residual gaps are now quantified or definitively characterized.

## Reflection

- What worked and why: defining the trust predicate **before** reading the numbers (the battery's own `freshness in (live|stale)` rule) is what caught the 34/49 pass as fabricated rather than recording it as a 30%-divergence finding. Reading the shim's socket handling (:86, :91, :105) before running is what made the custom-dir experiment interpretable, and the `--warm-only` probe converted "we could not cold-start a daemon" into a precise fail-closed-vs-silent-degrade contract.
- What did not work and why: the cold-start measurement as framed in iteration 6 assumed the CLI could spawn a daemon; it cannot, so the first experiment produced degraded data. Root cause of the earlier imprecision: iteration 6 observed a warm daemon and inferred the cold path was merely unmeasured, when in fact the cold path is a different engine (local-scorer) rather than a slower daemon. The first pass's invalid data existed for minutes before the envelope check was applied — the lesson is to assert trust as part of the run, not after parsing.
- What I would do differently: gate every measurement row on the trust predicate inside the measurement loop from the first call, and print the trust vector alongside the agreement summary so an untrusted run cannot be read as a result.

## Recommended Next Focus

1. Read local-native-divergence-ratchet.vitest.ts's matching logic (id/hash vs values) and reconcile the 3 uncovered divergences (rr-iter2-022, rr-iter3-106, rr-iter3-116) — the memory:save vs system-spec-kit class is the most actionable ledger-review candidate.
2. If the run extends beyond 7 iterations: a batched full-union pass (217 prompts, trusted envelopes only) to replace the sampled agreement bound with a population number; expect ~10% divergence and ≥28 floor-touching rows by scaled counts.
3. Leave cold-daemon start cost out of the parity/CI cost model — it is launcher-owned and unmeasurable through the CLI; the cold-runner risk to price instead is silent degradation, whose mitigation already exists (the envelope rule).

## Next Focus

See Recommended Next Focus above: ledger-matching reconciliation for the 3 uncovered divergences, then an optional batched full-union trust-gated pass.

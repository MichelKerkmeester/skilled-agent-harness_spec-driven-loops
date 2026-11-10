# Iteration 4: The Cross-Path Parity Contract — What to Compare and When to Fail

## Focus

Q2 follow-up from iteration 3's boundary synthesis (iteration-003.md:28, :95): define what a cross-path parity check between the Python scorer (`.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py`) and the Node path (`.skilled/bin/skill-advisor.cjs`) should compare — top skill, ranked list, confidence, abstain — and when it should fail. The dispatch focus text arrived truncated again ("Independence asks whether the prompts that..."); the full boundary statement was recovered from iteration-003.md:28 and :95, so the Q2 interpretation was unambiguous. Non-goals respected: no fix is proposed for probe P4, probe P7 or admission scenario DOC-331; no researched file was modified.

## Actions Taken

1. Re-read research state (config, state log, strategy, findings registry, iteration 3 narrative) and verified the packet-local write boundary: iterations/iteration-004.md and deltas/iter-004.jsonl were absent; only the allowed artifacts and the append gateway's writes were created.
2. Read the three parity harnesses in full: python-ts-parity.vitest.ts (251 lines), local-native-divergence-ratchet.vitest.ts (364 lines), skill-advisor-cli-parity.vitest.ts (158 lines).
3. Opened the Node path: .skilled/bin/skill-advisor.cjs (constant block) and the CLI test-utils symbols (runSkillAdvisorShim, pythonAdvisorScript, repoRoot) behind the CLI parity test.
4. Measured the parity fixtures: approved-divergence ledger via jq (73 entries; 68 labeled / 5 harder; entry shape id/corpus/prompt/promptHash/gold/localTop/nativeTop/reason/approvedAt) and the labeled corpus via wc (195 rows; union with the 22-row harder fixture = 217).
5. Enumerated CI wiring: grepped all .github/workflows/*.yml for the three harness filenames (no references) and listed the advisor gates that do run, plus the runtime's npm scripts and vitest include/exclude.
6. Re-verified every line citation with targeted greps before writing.

## Findings

1. **The CLI cross-path harness compares exactly one dimension — top-1 skill — and requests the minimum from the CLI.** skill-advisor-cli-parity.vitest.ts runs each of 9 hardcoded prompts through both paths: the Python CLI (script path + prompt argv + `--force-local --threshold 0.8 --uncertainty 0.35`, :70-92) and the shim path via `advisor_recommend --json {"prompt":...,"options":{"topK":1,"includeAttribution":false,"includeAbstainReasons":true}}` (:94-110), then compares `payload.data.recommendations[0].skillId` (:114) against the Python first `skill` (:91) and against a hardcoded expected skill per prompt (:41-51, :150-151); any mismatch fails (:146-155). Python absence flips the whole test to `it.skip` (:53-68). Two honesty notes: the it() title says "ten representative prompts" (:135) while the array holds 9 (:42-50), and the DB scope is seeded from the canonical skill-graph.sqlite (:117-123). The shim itself resolves to the built daemon CLI at `dist/runtime/skill-advisor-cli.js` with a package-freshness precheck. [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/skill-advisor-cli-parity.vitest.ts:41] [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/skill-advisor-cli-parity.vitest.ts:94] [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/skill-advisor-cli-parity.vitest.ts:114] [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/skill-advisor-cli-parity.vitest.ts:135] [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/skill-advisor-cli-parity.vitest.ts:150] [SOURCE: .skilled/bin/skill-advisor.cjs:23]

2. **The scorer-level differential gate compares strict top-1 with a shared abstention sentinel over a 217-prompt union corpus, ratcheted against a reviewed 73-entry ledger.** local-native-divergence-ratchet.vitest.ts states the contract in its header (:5-13): strict top-1 divergence, with the approved-divergence ledger as "the honest current-state baseline". Both sides normalize abstention to the sentinel `none` (:26-29); the CLI path maps an empty recommendation list to null (:114 read above). The corpus is labeled (195 rows) + harder (22 rows) (:140-144). The ledger fixture holds 73 entries — 68 labeled, 5 harder (jq) — each carrying a reviewed reason and approval date. Python is required by default: a missing interpreter throws instead of skipping (:31-34, :220-227), explicitly contrasted with "the opportunistic CLI-parity skip" (:31-33). [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/parity/local-native-divergence-ratchet.vitest.ts:5] [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/parity/local-native-divergence-ratchet.vitest.ts:26] [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/parity/local-native-divergence-ratchet.vitest.ts:142] [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/parity/local-native-divergence-ratchet.vitest.ts:220] [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/parity/fixtures/local-native-approved-divergences.json:1] [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/labeled-prompts.jsonl:195]

3. **python-ts-parity pins aggregate counts and an exact regression-id list rather than comparing per-prompt values.** Under a frozen no-graph regime kept at the top of the file (:14-22), it scores the full 195-row labeled corpus both ways (:147-150) and asserts: `pythonCorrect === 107` (:226), `tsAlsoCorrect === 100` (:227), `regressions === ACCEPTED_PARITY_REGRESSION_IDS.length` plus exact list equality against 8 reviewed ids (:228-229, :58-70), `tsAbstainsOnPythonCorrect === 0` (:230), `tsCorrect >= 95` (:231), `tsUnknown <= 13` (:232), `goldNoneFalseFire <= 10` (:233), `holdoutCorrect >= 17` (:237). Confidence values and ranks below first appear nowhere in the assertions — abstention appears only as counts. [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/parity/python-ts-parity.vitest.ts:20] [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/parity/python-ts-parity.vitest.ts:58] [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/parity/python-ts-parity.vitest.ts:226] [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/parity/python-ts-parity.vitest.ts:230] [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/parity/python-ts-parity.vitest.ts:237]

4. **No CI workflow references any of the three cross-path parity harnesses.** A grep over .github/workflows/*.yml for `local-native-divergence`, `python-ts-parity`, `skill-advisor-cli-parity` and `holdout-independent` returned no matches. The advisor gates CI actually runs are: `compiled-route-admission.cjs --all --warn-only` (routing-registry-drift.yml:180), the golden-prompt suite (:256), the scorer-eval-baseline-ratchet (:268), and the stress suite (skill-advisor-stress.yml:66 → `npm run test:stress`, whose config includes only stress-test/** and excludes tests/**, vitest.stress.config.ts:13, :19). The harnesses do run under the runtime's own `npm test` (package.json:14 → `vitest run`, include tests/**/*.vitest.ts at vitest.config.ts:27), but no workflow invokes it. Contradiction recorded: the ratchet self-describes as "a CI gate" (local-native-divergence-ratchet.vitest.ts:31-33); the workflow evidence does not substantiate that claim today. [SOURCE: .github/workflows/routing-registry-drift.yml:180] [SOURCE: .github/workflows/routing-registry-drift.yml:256] [SOURCE: .github/workflows/routing-registry-drift.yml:268] [SOURCE: .github/workflows/skill-advisor-stress.yml:66] [SOURCE: .skilled/skills/system-skill-advisor/runtime/vitest.stress.config.ts:19] [SOURCE: .skilled/skills/system-skill-advisor/runtime/package.json:14] [SOURCE: .skilled/skills/system-skill-advisor/runtime/vitest.config.ts:27]

5. **Recommendation — compare top-1 plus abstention; do not compare raw confidence or ranks ≥ 2.** Grounds: (i) every existing harness's comparison surface is strictly top-1 (ratchet :200-202; CLI :114; python-ts :150); (ii) the two implementations derive decisions from different machinery — lane-weight/lexical-shadow ranking on the TS side (ratchet :191-193) vs threshold tables in Python (:167) — and no harness compares any confidence value, so there is no cross-implementation score calibration to compare against; (iii) abstention semantics differ by construction (Python dual thresholds 0.8/0.35 at :167 vs TS floors), which is why both harnesses normalize to none/null rather than compare rates; (iv) lower-rank order is unstable where the 0.82 confidence floors and ties decide (topic text at deep-research-strategy.md:57; the 0.82 floors live in scoring-constants.ts per strategy.md:187), and the CLI path already requests `topK:1` (:102). A parity check that compared confidence floats would fail on scale differences rather than on routing disagreement. [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/parity/local-native-divergence-ratchet.vitest.ts:167] [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/parity/local-native-divergence-ratchet.vitest.ts:191] [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/parity/local-native-divergence-ratchet.vitest.ts:200] [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/skill-advisor-cli-parity.vitest.ts:102] [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/parity/python-ts-parity.vitest.ts:150] [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/004-routing-evaluation/research/deep-research-strategy.md:187]

6. **Recommendation — reuse the ratchet's five fail rules as the failure contract.** Fail when: (a) any top-1 disagreement is not in the approved ledger (:315-325); (b) a ledger entry no longer diverges and was not removed (:329-338); (c) a recorded promptHash/localTop/nativeTop changed and needs re-review (:343-362); (d) duplicate ledger ids (:289-300); (e) orphan ledger ids (:303-311). And fail loudly when Python is unavailable for a gate meant to be trusted (:220-227) — the CLI-parity skip (:68) is the weaker documented precedent (:31-33). A gold-anchored CLI smoke (both sides must equal the fixture's expected skill, :150-151) can coexist behind the scorer-level ratchet but cannot serve as the parity gate itself. [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/parity/local-native-divergence-ratchet.vitest.ts:315] [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/parity/local-native-divergence-ratchet.vitest.ts:329] [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/parity/local-native-divergence-ratchet.vitest.ts:343] [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/parity/local-native-divergence-ratchet.vitest.ts:289] [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/parity/local-native-divergence-ratchet.vitest.ts:303]

## Questions Answered

- **Q2: What should a cross-path parity check between skill_advisor.py and .skilled/bin/skill-advisor.cjs compare (top skill, ranked list, confidence, abstain), and when should it fail?** — Compare top-1 skill with abstention normalized on both sides (none/null), not confidence values and not ranks ≥ 2 (Finding 5). Fail on any new unapproved divergence, any resolved ledger entry, any recorded-field drift, any malformed ledger (duplicate/orphan ids), and fail loudly on missing Python for a gate meant to be trusted (Finding 6). Caveat attached to the answer: current CI wiring runs none of the existing harnesses (Finding 4), so "when should it fail" is a contract to wire, not an observed CI behavior.

## Questions Remaining

- Q3: How do the evaluation set and the parity check stay cheap to run and honest, given ties at confidence 0.82 and hub admission running in CI with --warn-only? (reframed by Finding 4: the cost question now includes actually running a parity gate in CI.)
- Q4: Which existing harnesses, fixtures and CI jobs can each recommendation extend in place, so the move stays as low as possible on the prevent-overengineering reversal-cost order? (partially constrained: the harnesses already exist; the missing piece is placement.)

## Ruled Out

- Comparing raw confidence values or full ranked lists as parity dimensions: no existing harness does it, no cross-implementation calibration exists, lower-rank order is unstable at the 0.82 floors/ties, and the CLI parity already requests topK:1. Candidate for reducer promotion to Ruled Out Directions.
- No other attempted approach failed this iteration; one command ran from the packet directory instead of the repo root and was re-run from the correct root.

## Dead Ends

- None eliminated beyond the ruled-out comparison dimension above.

## Edge Cases

- Ambiguous input: dispatch focus truncated at "Independence asks whether the prompts that..."; the full boundary statement was recovered from iteration-003.md:28 and :95 (the Q2 focus), so no interpretation narrowing was needed.
- Contradictory evidence: the ratchet self-description "This is a CI gate" (:31-33) versus zero workflow references (Finding 4). Both preserved; unresolved — the harness exists, the CI invocation does not.
- Missing dependencies: none; all reads succeeded.
- Partial success: none; all planned actions completed.
- Scope note: progressiveSynthesis is true (deep-research-config.json:15), but the dispatch's allowed-write list binds writes to this narrative, deltas/iter-004.jsonl and the append gateway's writes; research/research.md does not exist in the packet and was deliberately not created, leaving synthesis to the workflow owner (same treatment as iterations 2-3).

## Sources Consulted

- .skilled/skills/system-skill-advisor/runtime/tests/parity/python-ts-parity.vitest.ts
- .skilled/skills/system-skill-advisor/runtime/tests/parity/local-native-divergence-ratchet.vitest.ts
- .skilled/skills/system-skill-advisor/runtime/tests/parity/fixtures/local-native-approved-divergences.json
- .skilled/skills/system-skill-advisor/runtime/tests/skill-advisor-cli-parity.vitest.ts
- .skilled/skills/system-skill-advisor/runtime/tests/skill-advisor-cli-test-utils.ts (symbols via rg)
- .skilled/bin/skill-advisor.cjs
- .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/labeled-prompts.jsonl
- .skilled/skills/system-skill-advisor/runtime/package.json
- .skilled/skills/system-skill-advisor/runtime/vitest.config.ts
- .skilled/skills/system-skill-advisor/runtime/vitest.stress.config.ts
- .github/workflows/routing-registry-drift.yml
- .github/workflows/skill-advisor-stress.yml
- .github/workflows/*.yml (grep for parity harness filenames: no references)
- specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/004-routing-evaluation/research/deep-research-config.json
- specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/004-routing-evaluation/research/deep-research-state.jsonl
- specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/004-routing-evaluation/research/deep-research-strategy.md
- specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/004-routing-evaluation/research/findings-registry.json
- specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/004-routing-evaluation/research/iterations/iteration-003.md

## Assessment

- New information ratio: 0.83
- Justification: 4 of 6 findings are fully new (CLI harness mechanics incl. the 9-versus-"ten" drift, the ratchet's five fail rules plus the 73-entry ledger, the python-ts pinned-count assertion model, and the absent CI wiring); 2 are partially new synthesis (the comparison-dimension recommendation and the failure-model recommendation). No simplicity bonus claimed — Q3 and Q4 remain open.
- Questions addressed: Q2 (both halves).
- Questions answered: Q2. Q3 and Q4 remain open.

## Reflection

- What worked and why: reading all three harnesses in full before synthesizing — the comparison surface (strictly top-1, no confidence value anywhere) is only visible across the full assertion blocks, and each harness contributed one leg of the failure contract. The jq pass over the ledger turned "approved-divergence ledger" from prose into 73 concrete entries with review fields, and the CI grep converted "CI gate" from a claim into a checkable fact.
- What did not work and why: nothing failed this iteration; the wrong-directory `ls` was a path mistake, corrected immediately, and did not affect evidence.
- What I would do differently: check CI wiring before (or alongside) the harness internals — a harness's CI status changes how much weight its contract deserves, and Finding 4 would have framed Findings 1-3 sooner.

## Next Focus

Q3-Q4 coupling created by Finding 4: the parity contract now depends on where a cross-path gate would run and what it would cost. Sub-questions: (1) is the routing-registry-drift full-install job (the install step whose test steps are :256 and :268) the cheapest in-place home for a cross-path run, and what would it add in CI minutes (one Python subprocess + N native calls for the scorer-level ratchet; the CLI variant costs two subprocesses per prompt with a 240s timeout at cli-parity :156)? (2) With 73 ledger entries, does CI running the ratchet grow review burden or enforce honesty, and how do 0.82 ties interact with ledger-based failures (Q3)? (3) Should the CLI-parity skip become fail-loud if it is promoted to a gate, or stay a smoke test behind the scorer-level ratchet (Q4)?

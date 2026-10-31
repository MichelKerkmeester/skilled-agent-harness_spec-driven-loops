# Iteration 005 — Cross-feature synthesis: the proof-or-retire standard, the rule family, and the ranked next steps

- **Focus:** What unified corpus, label, keep-rule and power standard would let each feature either earn a live auto-on path or be retired with evidence; what hardening and test plan applies across all three; and what ranked next step does each feature get? (Q5)
- **Read first:** no `steer.md` exists in this lineage (checked at every iteration start; absent through iteration 5).
- **Lens:** every cross-feature claim re-verified against current code or recorded runs in this iteration.

## Actions Taken

1. Verified the shared measurement kit across the three scorers: `scorer-report.mjs` is imported by track narrowing (`score-track-narrowing.mjs:26`), clarify default (`score-clarify-default.cjs:25`) and alignment (`score-alignment-suggestion.ts:525`).
2. Verified the keep-rule family: track narrowing `coverage 10*M >= 9*K, margin 10*(A-B) >= M, sign test p < 0.05, flips 10*F <= 3*M` (`score-track-narrowing.mjs:63-64`); clarify `coverage …, kill P(X >= L) <= 0.05, margin …, sign test p < 0.05, flips …` (`score-clarify-default.cjs:51`); alignment `coverage …, kill P(X>=L)<=0.05, margin …, sign P(X>=W)<0.05, flips …` (`score-alignment-suggestion.ts:1650`).
3. Read the 047 fleet measurement table for the proven-features' comparators (`047-measure-every-jev-feature/scratch/evidence/results.md:1-21`).
4. Assembled the per-feature ranked next steps and the retire-vs-promote framework from iterations 1-4.

## Findings

### F-001 — The unified proof-or-retire standard: seven requirements, none of the three met today (P0, Q5)

A feature earns a live auto-on path only when all seven hold; failing any one settles nothing and a negative control that flips the signal settles a kill.

| # | Requirement | Track narrowing | Clarify default | Alignment |
|---|---|---|---|---|
| 1 | Real-traffic corpus, time-separated holdout, pinned digests | No — packet prose; pins landed | No — fixture; 12 rows left; real rate unmeasured | No — fixture; target wrong 0/40 |
| 2 | Independent labels with provenance + adjudication | No — path-derived gold | Partial — operator=12, approver field exists | No — one arbiter read |
| 3 | Keep rule with absolute + class floors and strongest-policy bar | No — relative-only | No — strongest printed, not required | No — kill branch only |
| 4 | Pre-registered power (n, MDE) | No — 39.9% power at observed effect | No — 21 discordant pairs | No — 11 discordant pairs |
| 5 | Negative controls pass | Partial — paraphrase probe warns | Partial — replay refusal works | **No — distractor kills** |
| 6 | Fail-open live shape behind the gate | Design only (R1 binds) | Design only (no seam) | Design only (D6) |
| 7 | Tests for the live path | Offline tests strong (33 cases) | Offline tests strong (31) | Offline tests strong (43) |

- **Confirmed by:** this iteration's kit/rule verification plus iterations 1-4's per-feature records.
- **Implication:** retirement with evidence is a legitimate terminal state — clarify default and alignment currently have stronger kill evidence than win evidence, and track narrowing is inconclusive with a defined path to prove.

### F-002 — The keep-rule family diverges: track narrowing lacks the kill branch, and no rule has a floor (P0, Q5)

Clarify and alignment both carry `kill P(X>=L)<=0.05`; track narrowing does not — a significant loss there only fails the sign test (`stop (sign test)`), never `kill`. None of the three has an absolute accuracy floor, a per-track/class floor, or requires beating the strongest simple policy (all three now *print* it). The shared kit is the right amendment site: one change to `scorer-report.mjs` plus each rule line reaches all three scorers.

- **Confirmed by:** comparing the three rule lines and `decideVerdict` implementations side by side.
- **Implication:** the cross-feature amendment set is small and centralized: kill branch for track narrowing, floors for all three, strongest-policy bar, and a power/MDE line — all as pre-registered rule amendments, not tuning.

### F-003 — Ranked next step per feature (P0/P1, Q5)

- **Track narrowing — P0:** (1) pre-register the power line and the absolute + per-track floors; (2) build the real Gate 1 request holdout (~217 decided pairs ≈ 431 rows at the current decided rate to reach 80% power at the observed effect); (3) only then a third run read against the amended rule. R1 (no live narrowing before the holdout passes) still binds.
- **Clarify default — P0:** (1) run `--transcripts` to measure the real clarify rate and start shadow logging (T1) with the user's pick as a free label; (2) require the strongest-policy bar and class floors; (3) only then revisit a served suggestion, which also needs the routing-owner contract extension (alternatives in the normalized route).
- **Alignment suggestion — P1:** (1) mask folder names out of the state (or instruct against state folder names) and rerun the distractor-state control; (2) if it still kills, retire the current question shape with that evidence; (3) if it survives, rebuild the corpus from real low-match saves with final destinations and adjudicate the 11 discordant rows.
- **Confirmed by:** iterations 2-4's records; the power numbers are exact binomial computations from each run's own counts.
- **Implication:** each next step is one bounded experiment; none requires a live serving path first.

### F-004 — The shared kit is the reuse path, and its coverage now includes the strongest controls (P1, Q5)

All three scorers import `scorer-report.mjs` (pins, margin slack, decided subset, cluster bootstrap, intervals, out-dir guard). Alignment added the newest controls (label-swap, distractor-state) and the kill branch; clarify added replay refusal, digests and the early stop; track narrowing added pins, replay, the cluster bootstrap and per-track tables. The four proven features' measured rows (`047.../results.md:13-14`) show the same rule family in use.

- **Confirmed by:** the import lines and the recorded runs cited in iterations 2-4.
- **Implication:** port the alignment controls to track narrowing (a paraphrase probe exists; add a label/state control) and to clarify (its replay refusal is already a strong control); one kit change per control.

### F-005 — Integration order: shadow → canary → live, behind the unchanged gate; the blockers are per-feature (P1, Q5)

The gate itself needs no change for any candidate (iteration 1, F-001/F-002): add `FEATURES` entries (`track-narrowing`, `clarify-default`, `alignment-suggestion` with `JEV_FEATURE_*` names), a live call site that asks `featureReady` first, fail-open fallbacks, and provenance recording. The proven precedents: cite-drift (advisory + version-pinned gate), injection-screen (advisory hook, always exits 0), both graders (auto resolution + recorded reason). Per-feature blockers before any call site: track (corpus + floors), clarify (seam + base rate), alignment (state-anchoring).

- **Confirmed by:** the gate and call-site reads (iteration 1); the seam read (iteration 3); the control read (iteration 4).
- **Implication:** the integration work is genuinely small once a feature passes; the research's value is preventing that work from shipping on the wrong signal.

### F-006 — Cross-feature test plan: stub-CLI fixtures plus one control per failure mode (P2, Q5)

The shared pattern is the `jev-features.test.mjs` stub (a temp `jev` recording argv) plus per-scorer recorded-run replays. Additions per feature: track narrowing — absolute-floor and per-track-floor verdict cases, a paraphrase-probe threshold test, a power-line test; clarify — shadow-capture test, normalized-route alternatives contract test, strongest-policy-bar verdict case, transcripts rate test; alignment — masked-state ablation test, real-save corpus validation fixture, label-provenance assertions, interactive fail-open/timeout/consent tests. All are offline; none needs a live call.

- **Confirmed by:** the three test inventories (33/31/43 cases) and the stub pattern from iteration 1.
- **Implication:** test work is cheap and should land with the rule amendments, not after.

### F-007 — Base rates cap the value: the retire decision is an evidence outcome, not a failure (P2, Q5)

Clarify serves 2 mode clarifications in 365 committed prompts; alignment fires on rare low-match saves (2 events in the committed-tree census with no alternatives); track narrowing would serve only lexical misses. At these rates the expected user benefit is small even when accuracy is proven, so a retirement backed by a negative control or a powered non-result is a legitimate, cost-saving terminal state — and the same corpus/controls discipline that proves a win is what settles a kill.

- **Confirmed by:** the census (iteration 3), the prior research's fire-frequency figures (`048.../008/research/research.md:103`), and the power arithmetic.
- **Implication:** the operator's "prove or retire" framing matches the economics; the research recommends proving only where a bounded experiment can move the decision.

## Ruled Out

- **A single accuracy number as the keep bar.** All three rules are relative; the fleet's proven features won on fixtures too, but each kept a clean margin over its strongest baseline with controls that did not flip (contrast alignment's distractor kill).
- **Wiring any of the three now.** Out of scope per packet 006 and unsupported by the evidence (F-001).

## Dead Ends

None. All four verification actions produced evidence.

## Edge Cases

- Ambiguous input: none; the dispatch topic defines the five questions.
- Contradictory evidence: none new this iteration; iterations 2-4's contradictions (probability-aware reversal, keep-vs-kill) are carried with both sides cited.
- Missing dependencies: `steer.md` absent through all five iterations; no lead review was available to weigh.
- Partial success: none.

## Sources Consulted

- `.skilled/skills/cli-classifier/shared/scripts/scorer-report.mjs:33,71,88,107,144,165,181,243-267`
- `.skilled/skills/system-spec-kit/runtime/cli/retrieval/score-track-narrowing.mjs:26,63-64`
- `.skilled/skills/sk-doc/sk-create-skill/scripts/score-clarify-default.cjs:25,51`
- `.skilled/skills/system-spec-kit/runtime/cli/evals/score-alignment-suggestion.ts:525,745-757,1650`
- `specs/cli-jev/003-cli-jev-workflow-integration/047-measure-every-jev-feature/scratch/evidence/results.md:7-21`
- Iterations 1-4 of this lineage (`iterations/iteration-001..004.md`)

## Assessment

- New information ratio: 0.5 (the rule-family divergence, the unified standard and the ranked next steps are new synthesis; the per-feature facts are re-verified from prior iterations)
- Questions addressed: Q5
- Questions answered: Q5 — the standard, the hardening/test plan, and a ranked next step per feature.

## Reflection

- What worked and why: re-verifying the shared kit and the three rule lines in one pass made the cross-feature amendment set concrete (one kit change + three rule lines) instead of a list of per-feature wishes.
- What did not work and why: nothing failed; the synthesis rests on recorded evidence rather than new runs, which is the correct weight for a cap-iteration.
- What I would do differently: nothing material; the five-iteration plan covered one gate iteration, one per feature, and one synthesis, which matched the topic's structure.

## Recommended Next Focus

Synthesis (`research.md`): compile the ranked next steps per feature, the seven-requirement standard, the amendment set, the integration order, and the convergence report. No further iteration is warranted; the cap is reached and the open questions are bounded experiments, not research gaps.

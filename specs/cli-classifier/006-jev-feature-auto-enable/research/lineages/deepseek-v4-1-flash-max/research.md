---
title: "Deep Research: Jev feature proof-or-retire — spec-track narrowing, routing clarify default, alignment folder suggestion"
description: "Merged single-lineage research on the three Jev classifier features without a clean keep verdict: what corpus, labels, keep rule and power would prove a live win or settle a kill, what to harden, where each would plug into a live path behind the shared jev-features gate, and what tests would cover it."
trigger_phrases:
  - "jev feature proof or retire"
  - "track narrowing repeat"
  - "clarify default refusal"
  - "alignment distractor control"
importance_tier: important
contextType: research
---
# Deep Research: Jev feature proof-or-retire (deepseek-v4-1-flash-max lineage)

One detached lineage researched the topic in five iterations: DeepSeek V4.1 Flash max through `cli-devin`, `maxIterationsReached` at the cap, artifact boundary `specs/cli-jev/006-jev-feature-auto-enable/research/lineages/deepseek-v4-1-flash-max` (spec-folder writeback intentionally skipped). Every figure marked **[recorded]** was read from a recorded run or a live read-only command in this session; every claim carries a `file:line` or a named command.

## Table of Contents

1. The Deliverable in One Paragraph
2. Findings, Ranked
3. The Seven-Requirement Proof-or-Retire Standard
4. Spec-Track Narrowing (feature 017) — the repeat, the power, the next step
5. Routing Clarify Default (feature 020) — the base rate, the refusal, the next step
6. Alignment Folder Suggestion (feature 022) — the distractor kill, the next step
7. The Shared Gate and the Integration Order
8. The Amendment Set (keep-rule family + shared kit)
9. Test Plan
10. Eliminated Alternatives
11. Divergence Map
12. Open Questions
13. References
14. Convergence Report

---

## 1. The Deliverable in One Paragraph

None of the three features can earn a live, auto-on path today, and none is retired by a clean kill either. Spec-track narrowing is inconclusive (a keep on 256 rows, a stop-on-margin on 270 rows, a bootstrap interval spanning zero) with a defined path to prove or retire: pre-register power and floors, then a real Gate 1 request holdout of roughly 430 rows. Routing clarify default has stronger kill evidence than win evidence (42 of its 54 fixture rows no longer clarify; always-none beats it 34 to 28; 2 mode clarifications in 365 committed prompts) and its viable next step is shadow logging, not serving. Alignment folder suggestion holds a fixture keep that a distractor-state control flips to kill (W=0 L=30) because the pick follows the folder named in the state; its next step is a masked-state ablation that either retires the question or earns a real-save corpus. The shared gate needs no change for any candidate; the live-path work is small once a feature passes, and the research's value is preventing that work from shipping on the wrong signal.

## 2. Findings, Ranked

| # | Priority | Feature | Finding |
|---|---|---|---|
| 1 | P0 | gate (all) | The gate registers exactly four features; candidates need a `FEATURES` entry, a live call site asking `featureReady` first, fail-open fallbacks, and docs. No gate change required. (iter 1 F-001/F-002/F-003) |
| 2 | P0 | track | The 017 keep did not repeat: stop (margin) K=270 M=270 A=106 B=82 W=80 L=56 F=48 p=0.02409, bootstrap CI [-0.1185, 0.2760] spanning zero. Inconclusive, not a kill. (iter 2 F-001) |
| 3 | P0 | track | Power: at the observed 0.588 decided-pair win rate, 80% power needs 217 decided pairs (~431 rows at the current rate); the current corpus has MDE 0.634 and 0.399 power at its own effect. (iter 2 F-002) |
| 4 | P0 | track | The keep rule is relative-only: no absolute floor, no per-track floor. A=106/270 (39.3%) would keep if the margin passed. (iter 2 F-003) |
| 5 | P0 | clarify | Today's read-only census: 3 clarifications in 365 committed prompts (2 mode + 1 checklist); the served surface is 2 in 365. Base rate caps value. (iter 3 F-001) |
| 6 | P0 | clarify | The replay refusal is live: 42 of 54 fixture rows refused (route); 12 labeled; below the 30-row gate. The fixture keep is historical. (iter 3 F-002) |
| 7 | P0 | clarify | Power wall: 80% power needs 69 discordant pairs at 0.65 (158 at 0.60); the fixture held 21. At the base rate that is ~32k prompts without shadow collection; always-none (34/54) beats Jev (28) and is not required to be beaten. (iter 3 F-003) |
| 8 | P0 | alignment | The distractor-state control kills the verdict: W=0 L=30, interval [0.000, 0.114]; all 30 picks follow the folder named in the rotated state. The judgment is state-anchored. (iter 4 F-001) |
| 9 | P0 | alignment | The corpus is a fixture by construction (target wrong 0/40; one arbiter read; comparator auto); 11 discordant pairs cannot prove a live win. (iter 4 F-003) |
| 10 | P0 | all | The unified seven-requirement standard (real corpus, labels, floors, power, controls, fail-open shape, tests) is met by none; retirement with evidence is a legitimate terminal state. (iter 5 F-001) |
| 11 | P0 | all | The keep-rule family diverges: track narrowing lacks the kill branch clarify and alignment have; no rule has floors or a strongest-policy bar. One shared-kit change plus three rule lines is the amendment set. (iter 5 F-002) |
| 12 | P0 | all | Ranked next step per feature: track — power + floors + real-request holdout (~430 rows), then a third run; clarify — transcripts rate + shadow logging, strongest-policy bar, contract seam before any suggestion; alignment — masked-state ablation, then retire or real corpus. (iter 5 F-003) |
| 13 | P1 | track | Probability-aware aggregation did not repeat (102 vs 106 modal); the one-call arm is near-equivalent (103); shortlist unmeasured. (iter 2 F-004) |
| 14 | P1 | track | The 049 trust upgrades landed: row-set + model-tuple pins, `--out` guard, exact replay, cluster bootstrap (16 clusters). Remaining gap is labels/population. (iter 2 F-005) |
| 15 | P1 | track | Transfer warning persists: paraphrase probes ripgrep 9/14 vs Jev 2/14; per-track spread 3/20 (sk-design) to 14/19 (sk-git); 55 abstentions (20.4%). (iter 2 F-006) |
| 16 | P1 | clarify | The 049 upgrades landed: digests, class/hub results, four baselines, label approver fields, early stop (118 vs 163 calls, byte-equal). (iter 3 F-004) |
| 17 | P1 | clarify | The seam is confirmed dropped: the engine has `decision.clarify.alternatives`, the normalized route and `resolveRoute` do not. A suggestion needs a routing-owner contract extension. (iter 3 F-005) |
| 18 | P1 | alignment | The keep survives only with path-resolved descriptions and the original state: keep K=40 M=40 A=39 B=30 W=10 L=1 p=0.0059; recall 40/40. The ten wins are the rows the distractor control invalidates. (iter 4 F-002) |
| 19 | P1 | alignment | f022-001 still loses with both options described (0.48/0.58/0.43); adjudicate rather than chase. (iter 4 F-004) |
| 20 | P1 | alignment | The trust upgrades landed: kill branch, W+L interval, discordant list, pins, label-swap and distractor controls, gated arm (70 vs 120 calls). (iter 4 F-005) |
| 21 | P1 | all | The shared kit is the reuse path: all three scorers import `scorer-report.mjs`; controls and rule changes centralize there. (iter 5 F-004) |
| 22 | P1 | all | Integration order: shadow → canary → live behind the unchanged gate; per-feature blockers are corpus (track), seam + base rate (clarify), state-anchoring (alignment). (iter 5 F-005) |
| 23 | P2 | track | Cost: p50 325 ms / p95 389 ms per call; serving shape would be one call, miss-only, inside the advisor's 2,500 ms budget. (iter 2 F-007) |
| 24 | P2 | track | Integration shape: `track-narrowing` + `JEV_FEATURE_TRACK_NARROWING`; advisory Gate 1 call site on lexical miss/ties; R1 binds. (iter 2 F-008) |
| 25 | P2 | clarify | Integration shape: `clarify-default` + `JEV_FEATURE_CLARIFY_DEFAULT`; suggestion beside `action: clarify`; T0/T1 first. (iter 3 F-006) |
| 26 | P2 | alignment | Integration shape: `alignment-suggestion` + `JEV_FEATURE_ALIGNMENT_SUGGESTION`; interactive save-flow suggestion; hard block untouched; D6 amendment. (iter 4 F-006) |
| 27 | P2 | all | Test plan: stub-CLI fixtures plus one control per failure mode; per-feature additions listed. All offline. (iter 5 F-006) |
| 28 | P2 | all | Base rates cap value; prove only where a bounded experiment can move the decision. (iter 5 F-007) |

## 3. The Seven-Requirement Proof-or-Retire Standard

A feature earns a live, auto-on path only when all seven hold; a negative control that flips the signal settles a kill.

| # | Requirement | Track narrowing | Clarify default | Alignment |
|---|---|---|---|---|
| 1 | Real-traffic corpus, time-separated holdout, pinned digests | No — packet prose; pins landed | No — fixture; 12 rows left; real rate unmeasured | No — fixture; target wrong 0/40 |
| 2 | Independent labels with provenance + adjudication | No — path-derived gold | Partial — operator=12; approver field exists | No — one arbiter read |
| 3 | Keep rule with absolute + class floors and strongest-policy bar | No — relative-only | No — strongest printed, not required | No — kill branch only |
| 4 | Pre-registered power (n, MDE) | No — 39.9% power at observed effect | No — 21 discordant pairs | No — 11 discordant pairs |
| 5 | Negative controls pass | Partial — paraphrase probe warns | Partial — replay refusal works | **No — distractor kills** |
| 6 | Fail-open live shape behind the gate | Design only (R1 binds) | Design only (no seam) | Design only (D6) |
| 7 | Tests for the live path | Offline strong (33 cases) | Offline strong (31) | Offline strong (43) |

## 4. Spec-Track Narrowing (feature 017) — the repeat, the power, the next step

**What happened.** The first live run kept (`keep K=256 M=256 A=97 B=68 W=78 L=49 F=47 p=0.006330`). The 049 repeat on today's 270-row corpus printed `stop (margin) K=270 M=270 A=106 B=82 W=80 L=56 F=48 p=0.02409` with `accuracy_delta_95_ci=[-0.1185,0.2760] clusters=16` **[recorded]**. The margin gate needed 27 rows; the gain was 24. The baseline rose 68/256 to 82/270 while Jev moved 97/256 to 106/270.

**Power [computed, exact binomial].** At the observed decided-pair win rate 0.588 (80/136), 80% power against the margin gate needs 217 decided pairs ≈ 431 rows at the current 50.4% decided rate; the current corpus can only clear the gate reliably at a true win rate ≥0.634 (MDE ≈ 13.7pp); the repeat had 0.399 power at its own effect.

**What would prove a live win.** A real Gate 1 request corpus (independently labeled with consent and redaction, true none and cross-track cases, a time-separated holdout), pinned digests (landed), a pre-registered power line, plus rule amendments: an absolute accuracy floor, a per-track recall floor, and the kill branch. **What would settle a kill.** A powered run whose upper confidence bound stays under the margin, or a paraphrase-style control that again favors the lexical baseline.

**Hardening.** Absolute/per-track floors; abstention-cluster diagnosis before description edits (sk-design 16/20 abstained); the paraphrase transfer warning; `--out` truncation and row-set pinning are already fixed; per-track `measured` skipping unstable rows is a recorded review P2.

**Integration shape.** `FEATURES['track-narrowing'] = { env: 'JEV_FEATURE_TRACK_NARROWING' }`; a Gate 1 advisory at `lookup-trigger-index.mjs:132` that asks `featureReady` only when the lexical lookup misses or ties, prints an advisory, and fails open to broad search (the cite-drift advisory shape). One call per ambiguous request, miss-only, inside the latency budget. Prior R1 ("keep hard narrowing offline until a real-request holdout passes") still binds.

**Ranked next step (P0).** (1) Pre-register the power line and the floors as rule amendments; (2) build the real-request holdout (~217 decided pairs ≈ 431 rows); (3) only then read a third run against the amended rule.

## 5. Routing Clarify Default (feature 020) — the base rate, the refusal, the next step

**What happened.** The fixture keep stands on record (`keep K=54 M=54 A=28 B=15 W=17 L=4 F=10 p=0.003599`), but 12 of its 17 wins are abstentions on none rows; on named-mode rows the lift over the first alternative is one row; always-none scores 34/54 against Jev's 28. The 049 build replays each row against the pinned router before scoring **[recorded in this session]**: 42 of 54 rows refused (route), 12 labeled, `stop: fewer than 30 labeled rows`. Today's read-only census: `clarify=3` of 365 prompts (2 mode + 1 checklist); `real clarify rate: not measured`.

**Power [computed, exact binomial].** One-sided sign-test 80% power needs 158 discordant pairs at a 0.60 win rate, 69 at 0.65, 37 at 0.70; the fixture held 21. At the fixture's 21/54 discordant rate, 69 pairs ≈ 177 clarify rows ≈ 32,000 committed prompts at today's mode rate.

**What would prove a live win.** Shadow-collected real clarifications with the user's pick as gold (T1); the strongest-simple-policy bar required by the rule; class floors (named-mode accuracy plus abstention precision/recall); label provenance (approver + decision reference — fields exist); and the routing-owner contract extension that puts the alternatives into the normalized route. **What would settle a kill.** The current evidence nearly does: a powered run at the base rate that cannot beat always-none, or a decision that the seam is not worth extending for 2-in-365 traffic.

**Hardening.** Strongest-policy bar; class floors; the seam; `--transcripts` rate measurement; label approver recording.

**Integration shape.** `FEATURES['clarify-default'] = { env: 'JEV_FEATURE_CLARIFY_DEFAULT' }`; an advisory beside `action: clarify` that suggests one alternative, never replaces the clarification, and fails open on `none_of_these`, timeout, error, missing credentials or a generation mismatch. T0/T1 only today.

**Ranked next step (P0).** (1) Run `--transcripts` for the real rate and start shadow logging; (2) require the strongest-policy bar and class floors; (3) revisit a served suggestion only with the seam extension and shadow evidence.

## 6. Alignment Folder Suggestion (feature 022) — the distractor kill, the next step

**What happened.** The fixture keep holds with path-resolved descriptions (`keep K=40 M=40 A=39 B=30 W=10 L=1 F=0 p=0.0059 baseline=top`, 311 calls, recall 40/40, `comparator=auto`) **[recorded]**. The distractor-state control — each row's state rotated to the next row's — prints `kill K=40 M=40 A=0 B=30 W=0 L=30 F=0 p=0.0000`, `interval95=[0.000,0.114]`; all 30 picks follow the folder named in the rotated state. The label-swap control is unchanged (W+L=10, [0.722, 1.000] — its wins sit on rows whose label is neither target nor top). f022-001 still loses with both options described.

**Power [computed, same family].** 11 discordant pairs; 80% power needs 69 at 0.65. The fixture cannot prove a live win.

**What would prove a live win.** A masked-state (or state-instruction) variant that survives the distractor control; then a real-save corpus with final destinations, save-path split, label provenance and a pre-declared comparator; ≥69 discordant pairs; adjudication of the 11 discordant rows. **What would settle a kill.** The masked-state ablation still killing the verdict — retire the current question shape with that evidence.

**Hardening.** State-anchoring (P0); f022-001 adjudication; real corpus; the below-20% hard block and D6 policy stay untouched.

**Integration shape.** `FEATURES['alignment-suggestion'] = { env: 'JEV_FEATURE_ALIGNMENT_SUGGESTION' }`; interactive, flag-gated save-flow suggestion after the fixes; consent + timeout + kill switch; CLI-explicit saves keep their folder.

**Ranked next step (P1).** Mask folder names from the state (or instruct against them) and rerun the distractor control; retire or earn the real corpus on the result.

## 7. The Shared Gate and the Integration Order

The gate (`jev-features.mjs`) is switch-first then one bounded readiness probe; a disabled feature never spawns; auto-on = `featureReady(name).ready`; the switch matrix reads env per key then `hook-flags.env`. The four proven live paths share one shape: gate first, fail open to the pre-Jev behavior, never block (cite-drift advisory + version pin; injection-screen hook returning `done()`; both graders resolving `auto` → `jev`/`noop` with the reason recorded). Candidates add a `FEATURES` entry, a call site asking the gate first, a fail-open fallback, provenance recording, and stub-CLI tests. The integration order is shadow → canary → live; no candidate has passed requirement 1-5 yet.

## 8. The Amendment Set (keep-rule family + shared kit)

1. Add the kill branch to track narrowing (clarify and alignment already carry `kill P(X>=L)<=0.05`).
2. Add an absolute accuracy floor and a per-track/class floor to all three rules.
3. Require beating the strongest simple policy (all three now print it; none requires it).
4. Add a pre-registered power/MDE line to the report.
5. Keep the four existing conditions unchanged; every change is a pre-registered rule amendment, not tuning.

All five land in `scorer-report.mjs` plus the three rule lines; the kit is already shared by all three scorers.

## 9. Test Plan

- **Track narrowing:** absolute-floor and per-track-floor verdict cases; paraphrase-probe threshold; power-line; existing 33 cases stay.
- **Clarify default:** shadow-capture (user pick as label); normalized-route alternatives contract; strongest-policy-bar verdict; `--transcripts` rate end-to-end; existing 31 cases stay.
- **Alignment:** masked-state ablation; real-save corpus validation fixture; label-provenance assertions; interactive fail-open/timeout/consent with a stub `jev`; existing 43 cases stay.
- **Shared:** the stub-CLI fixture and recorded-run replay pattern from `jev-features.test.mjs`; no live call needed.

## 10. Eliminated Alternatives

| Approach | Reason eliminated |
|---|---|
| Wiring any of the three now | Out of scope (packet 006) and unsupported: no feature meets the seven requirements |
| Reading the track repeat as a kill | CI spans zero; underpowered (0.399 at its own effect) |
| Adopting probability-aware aggregation as a free row | Lost 4 rows on the repeat corpus |
| Scoring the clarify fixture as-is | 42 of 54 rows no longer clarify; refusal is correct |
| Reading the clarify keep as mode-selection skill | 12 of 17 wins are abstentions; always-none beats Jev |
| Serving a clarify suggestion on the current contract | Normalized route drops the alternatives |
| Reading the alignment fixture keep as production superiority | Distractor control flips it to kill; target wrong 0/40 by construction |
| Chasing f022-001 with describer edits | Both options described; still loses; adjudicate |
| A single accuracy number as the keep bar | All three rules are relative; controls decide |
| More calls as an accuracy lever (track) | One-call arm near-equivalent; three orders buy stability |

## 11. Divergence Map

- **Saturated.** The gate contract and the four proven shapes (iteration 1); the fixture-bound nature of all three keeps (iterations 2-4); the trust upgrades landing through the shared kit (iterations 2-4); the base-rate economics (iteration 5).
- **Pivots.** Iteration 2 went into the repeat's own call record and the power arithmetic; iteration 3 ran the census and the replay read-only to get today's numbers; iteration 4 went into the control arm's per-row picks to find the state-anchoring mechanism; iteration 5 re-verified the shared machinery.
- **Remaining frontier.** Real-request labels and calibration (track); the real clarify rate and shadow picks (clarify); the masked-state ablation and real saves (alignment). No divergent pivots were run; 0 completed, 0 failed, 0 overrides.

## 12. Open Questions

1. (track) Which absolute accuracy and per-track recall floors would the operator accept?
2. (track) How much does a third run move A, given 3.4-6 rows of margin slack across runs?
3. (track) Is `pickProb` calibrated well enough to gate a miss-only serving call?
4. (clarify) Can shadow logging collect enough real mode clarifications to measure a lift per hub?
5. (clarify) Which compiled-router owner would approve and maintain an additive alternatives contract?
6. (alignment) Does the masked-state variant survive the distractor control?
7. (alignment) How often is the real final folder inside the offered candidate set?
8. (all) What are the eligible fire rates, billed usage and end-to-end latencies?

## 13. References

- This lineage: `iterations/iteration-001..005.md`, `deltas/iter-001..005.jsonl`, `deep-research-state.jsonl`
- Scorers: `.skilled/skills/system-spec-kit/runtime/cli/retrieval/score-track-narrowing.mjs`; `.skilled/skills/sk-doc/sk-create-skill/scripts/score-clarify-default.cjs`; `.skilled/skills/system-spec-kit/runtime/cli/evals/score-alignment-suggestion.ts`
- Shared kit and gate: `.skilled/skills/cli-classifier/shared/scripts/scorer-report.mjs`; `.../jev-features.mjs`; `.../tests/jev-features.test.mjs`
- Routing seam: `.skilled/bin/lib/compiled-routing/014-runtime-engine/lib/compiled-route.cjs`; `resolve.cjs`
- Recorded runs: `~/.skilled/.labels/runs/049-002-jev.stdout.txt`; `049-002-jev-20261003/report.json`; `049-008-jev.stdout.txt`; `049-008-jev-20261003b/`
- Prior research: `specs/cli-jev/003-cli-jev-workflow-integration/048-jev-feature-improvement-research/{002,007,008}-*/research/research.md`; `049-jev-feature-improvement-build/{002,007,008}-*/implementation-summary.md`; `047-measure-every-jev-feature/scratch/evidence/results.md`
- Commands run read-only in this session: the clarify census (365 prompts, `clarify=3`) and the clarify replay (42 refused, 12 labeled); the power computations.

## 14. Convergence Report

- Stop reason: maxIterationsReached
- Total iterations: 5 (all complete; convergence telemetry only under the max-iterations policy)
- Questions answered: 5 / 5 (Q1 gate contract; Q2 track narrowing; Q3 clarify default; Q4 alignment; Q5 cross-feature standard and ranked next steps)
- Remaining questions: none of the five; eight bounded follow-ups in section 12
- newInfoRatio trend: 1.0 → 0.9 → 0.9 → 0.9 → 0.5 (mean 0.84)
- Findings: 36 across the lineage; 15 P0, 12 P1, 9 P2
- Ranked next step per non-proven feature: track — power + floors + real-request holdout, then a third run (P0); clarify — transcripts rate + shadow logging + strongest-policy bar, seam before any suggestion (P0); alignment — masked-state ablation, then retire or real corpus (P1)
- Divergence summary: no divergent pivots; saturated directions listed in section 11

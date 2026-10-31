# Iteration 5 — mimo-05: Finding triage, agreement with adjudicated gold

**Lineage:** `mimo` (UX and measurement lens) — wave 2
**Session:** `fanout-mimo-1790438758756-5mso8j`
**Focus Area:** `mimo-05` — Finding triage, agreement with adjudicated gold
**Angle question:** Would a Jev severity call on deep-review findings agree with the final adjudicated severity often enough to save a human pass, and where does the gold come from?

## Sibling check (wave 2)

Newest siblings read: `deepseek/iterations/iteration-010.md` (build order: routing arm slice 1, D4 grader slice 2) and `grok/iterations/iteration-010.md` (kill radius of a routing loss). Both treat the H9 reviewer fixtures as usable gold for the grader arm. This iteration's census contradicts that for the measurement value of the number: the fixtures' gold is 8 cases, every one `fail` (opened below). A grader that always answers `fail` scores perfect agreement on it. I state the contest here rather than restating their order.

## Grounding opened this iteration

- Archived `deep-review-findings-registry.json` files (12 sampled under `specs/**/review/`): finding keys and `transitions` arrays.
- The four reviewer fixtures under `.skilled/skills/system-deep-loop/deep-improvement/assets/model-benchmark/benchmark-fixtures/`: case counts and expected verdicts.
- `.skilled/skills/system-deep-loop/deep-review/references/protocol/completion-criteria.md:61-63,74-75` — severity contract, adversarial replay and verdict logic.
- Digest claims used with attribution: H9 (dispute hook, reviewer regression profile), H14 (blinded adjudication, additive-dark), the finding-triage gap row.

## The gold question, answered from disk

Where the gold comes from: archived deep-review findings carry a `transitions` array of `{iteration, from, to, reason}` records (opened: every one of the 69 findings in 12 sampled registries has one; initial entries read e.g. `{"iteration": 1, "from": null, "to": "P1", "reason": "Initial discovery (delta)"}`). The final adjudicated severity is the finding's current `severity` after its last transition, and findings whose transitions record a downgrade hold both the original call and the adjudicator's rationale in one row. That is derived gold, like mimo-04's stop marker, and it is free.

What the gold is thin on: in the 12 sampled registries (69 findings) the spread is P0: 6, P1: 39, P2: 24. The class the operator's pass is about (P0) is the rarest. Any agreement metric must be per-class and any P0-savings claim needs a corpus-wide P0 census first, because 6 positives cannot support "fewer P0s to reread".

And the contest with the siblings' slice 2: the reviewer fixtures are 4 fixtures with 1 visible and 1 hidden case each (8 cases total) and every `expectedVerdict` is `fail` (opened). The hidden-oracle gold for the D4 grader is single-class. An agreement number computed on it cannot distinguish a serious grader from a constant one. The smallest fix is fixture expansion with `pass` and `block` cases before any grader agreement number is quoted.

## Per-idea records

### Idea 1: Offline severity replay arm over archived deep-review findings

| Field | Record |
|---|---|
| **Idea** | For each archived finding with a `transitions` history, ask `jev score` over ordered levels `not_a_finding / P2 / P1 / P0` (the claude-jev review catalogue's severity shape, jev-material digest §4.1 claim) given the finding's evidence text, and compare with the final adjudicated severity. Replay only; never write a registry. |
| **Value** | The decision it measures for: whether a Jev severity call can shrink the set of P0s the operator must reread after a review, by flagging at replay time which P0s survive adjudication. Today the operator's pass is over every post-replay P0 (completion-criteria.md:63 requires every P0 survive adversarial self-check; `:75` FAIL is any P0 confirmed after replay). |
| **Seam** | Offline. Read seams: archived `deep-review-findings-registry.json` `severity` and `transitions` fields (opened). The product seam it would later occupy: S17 severity replay beside the adversarial self-check (seam-map claim). |
| **Metric, baseline, harness** | Metric: for the P0-savings claim, recall of "Jev flags this P0 as surviving" on adjudicated-surviving P0s (must be near 1; a missed true P0 is the expensive error) and the reduction in reread set size; for the general claim, per-class agreement (exact and adjacent) with final adjudicated severity. Proposed thresholds to fix before the build: recall at least 0.9 on surviving P0s and at least 30% reread-set reduction, else the arm saves no pass. Baseline: the reread set today is 100% of post-replay P0s; no prior agreement number exists (gap row: "Finding triage agreement ... no harness compares"). Gold: the transitions-derived final severity. Harness: the gaps-table design plus H14's blinded adapter so the Jev call never sees the adjudicator's answer (measurement digest H14). |
| **Cost, latency, privacy** | One billed `jev score` per finding; the 12-registry sample is 69 calls and the corpus-wide census may be a few hundred. Offline. Privacy: finding evidence is repository internals, one of the two highest-exposure payloads in this research (with compaction history); strip secrets, announce egress. |
| **Opt-in and no key** | A replay script flag. No key: the local columns (recorded severity, adjudicated outcome) still report and the Jev column says skipped. Nothing writes to any review artifact. |
| **Complexity** | Roughly 150-250 lines: corpus miner (registry transitions parser), replay arm, report with per-class tables. Touches no shared contract. |
| **Verdict** | **build-now, third slice,** behind the routing arm and the stop replay: gold is free and derived the same way as mimo-04's, but the P0 class is thin so the corpus-wide P0 census is check 1 of its proof plan and may force a redesign toward the downgrade-prediction framing. |
| **Confidence** | Confirmed from disk: transitions shape, severity spread, fixture counts. Inferred: that the derived gold equals what a human adjudicator would say; the transitions record the deep-review loop's own adjudication, not a human pass. What would confirm: an operator read of 10 findings checking final severity against their own judgment. |

### Idea 2: P0 reread triage for the operator (the product shape)

| Field | Record |
|---|---|
| **Idea** | After a review completes, rank the post-replay P0s by a Jev survival call so the operator rereads the likely-real ones first and can stop early. The recorded severity never changes. |
| **Value** | The operator-facing change named in the hand-off: fewer P0s to reread. It only exists if Idea 1 meets its thresholds; below them the honest change is "none". |
| **Seam** | The review report's P0 section (review-report.md "Active Finding Registry", completion-criteria.md:48). Not a code seam this iteration. |
| **Metric, baseline, harness** | Same as Idea 1 plus one UX measure: the fraction of runs where the operator can stop rereading early without missing a surviving P0. |
| **Cost, latency, privacy** | Reuses Idea 1's calls in a live shape: one call per post-replay P0 only, which is a small, bounded set per review. |
| **Opt-in and no key** | Default OFF; no key means the report is exactly today's. |
| **Complexity** | Once Idea 1 exists, a report-section change; the report layout is reducer-owned (deep-review state ownership), so the contract owner is named before any build. |
| **Verdict** | **next,** strictly gated on Idea 1's recall and reduction thresholds. |
| **Confidence** | Inferred from the review flow; the operator-reading behavior is unmeasured. |

### Idea 3: Jev validity call (`real`, `reachable`, `already_handled`) beside review verdicts

| Field | Record |
|---|---|
| **Idea** | The claude-jev review catalogue's full shape: `noul` validity questions plus severity, with verdict-in-code thresholds (jev-material digest §4.1 claim: drop if real under 0.5, keep_low if reachable under 0.4). |
| **Value** | Would filter bogus findings before the report exists, which is upstream of the P0 pass. But deep-review already gates validity through the adversarial replay and finding classes (completion-criteria.md:61 `finding_class`), so the marginal value is a second opinion on validity, measurable only against the same derived gold. |
| **Seam** | As Idea 1 plus `finding_class` fields in the registry (opened: `findingClass` present). |
| **Metric, baseline, harness** | Agreement with post-adjudication `status` transitions (opened: `status` and `deltaStatus` fields exist). Baseline unknown. |
| **Cost, latency, privacy** | Three to four calls per finding instead of one; the funnel shape (cheap screen, capped follow-ups, jev-material digest pattern 9) caps it. |
| **Opt-in and no key** | Same replay shape. |
| **Complexity** | 250+ lines with the funnel and threshold policy. |
| **Verdict** | **later,** after the severity arm shows whether one Jev call per finding tracks adjudication at all. |
| **Confidence** | Inferred; the vendored thresholds are the author's, not calibrated here. |

### Idea 4: Jev severity replacing the recorded severity

| Field | Record |
|---|---|
| **Idea** | Let the Jev score set or downgrade a finding's severity in the registry. |
| **Value** | None legitimate: it would write a one-lens judgment into a contract field whose owner is the review loop, and the recorded severity is load-bearing for the FAIL verdict (completion-criteria.md:75). |
| **Seam** | The `severity` field (opened). |
| **Metric, baseline, harness** | Unmeasurable once written. |
| **Cost, latency, privacy** | Same as Idea 1 plus silent severity corruption risk. |
| **Opt-in and no key** | Irrelevant; no flag earns this. |
| **Complexity** | Small code, wrong authority. |
| **Verdict** | **drop.** Same cross-lens reasoning as mimo-04's authority drop, and the review contract's verdict logic must ignore advisory scores already (`riskScore` non-gating, completion-criteria.md:62, which is the shape this would violate). |
| **Confidence** | Confirmed from the contract text (`:62`, `:75`). |

## Ruled out this iteration

- Scoring agreement against the reviewer fixtures as finding-severity gold: they grade verdicts of a reviewer prompt, not per-finding severity (measurement digest gap row distinction), and their 8-case all-fail gold is too thin even for the grader arm it was made for.
- Treating the model's own initial severity as gold: transitions with `from: null` are initial discoveries (opened), so initial severity is the call under test, not the answer.

## Hand-off

- The gold source: `transitions`-derived final severity in archived `deep-review-findings-registry.json`, with downgrade rationales in the transition reasons; corpus-wide P0 census is check 1 because the sampled spread has only 6 P0s in 69 findings.
- The agreement metric and proposed thresholds: recall at least 0.9 on adjudicated-surviving P0s plus at least 30% reread-set reduction; below both, the operator-facing change is "none" and the arm is measurement-only.
- The operator-facing change if thresholds hold: P0 reread order only (Idea 2), never a severity write.
- Contest carried to synthesis: the siblings' build order treats the H9 reviewer fixtures as gold for the grader arm, but the fixtures hold 8 single-class cases; quote the grader's agreement number only after fixture expansion with `pass` and `block` cases. This also feeds mimo-08's proof plan for the grader.

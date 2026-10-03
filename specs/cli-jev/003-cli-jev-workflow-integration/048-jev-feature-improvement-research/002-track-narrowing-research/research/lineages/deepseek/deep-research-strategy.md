---
title: "Deep Research Strategy - deepseek"
trigger_phrases: []
---
# Deep Research Strategy - deepseek

## 1. OVERVIEW

### Purpose

Improve, refine and expand the Jev spec-track narrowing (cli-jev feature 017) with file:line evidence, inside a detached DeepSeek V4.1 Flash lineage. This packet is evidence-only and writes only under the lineage artifact directory.

---

## 2. TOPIC

Measure, explain and improve the Jev spec-track narrowing scorer `.skilled/skills/system-spec-kit/runtime/cli/retrieval/score-track-narrowing.mjs`, which measures Gate 1 retrieval (which `specs/<track>/` a request belongs to) against the ripgrep recipe and the committed trigger-index lookup. Recorded verdict: `verdict jev: keep K=256 M=256 A=97 B=68 W=78 L=49 F=47 p=0.006330`, p50 330 ms, p95 391 ms. Five questions: what drove the result; how to raise accuracy or lower cost; how to make the measurement more trustworthy; where else in `.skilled` the same judgment pays off; and what a default-on integration needs, costs and risks.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)

- [x] Q1: What drove the measured result (K=256, A=97, B=68, F=47, p=0.006330, p50 330 ms, p95 391 ms)?
- [x] Q2: How can the narrowing be made more accurate or cheaper?
- [x] Q3: How can the measurement itself be made more trustworthy?
- [x] Q4: Where else in `.skilled` would the same judgment pay off?
- [x] Q5: What would a default-on integration need, cost and risk?
<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS

- Do not modify the scorer, the trigger index, retrieval scripts or any live workflow.
- Do not re-measure feature 017; phase 047 owns the measurement.
- Do not write outside `specs/cli-jev/003-cli-jev-workflow-integration/048-jev-feature-improvement-research/002-track-narrowing-research/research/lineages/deepseek`.
- Do not run `generate-context.js`, `validate.sh` or any git write command.

---

## 5. STOP CONDITIONS

- Run all 5 iterations; `stopPolicy: max-iterations` makes pre-cap convergence telemetry only.
- Broaden angles instead of synthesizing early if the convergence signal fires before iteration 5.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS

- Q1: The keep is a 29-net-win margin over a 25.6-row floor with full coverage; margin and sign test both score A-B = W-L. The row set is a 20-per-track hash sample of packet descriptions (256 of 1727 usable), so questions are author-written descriptions, not Gate 1 prompts; on the 14 gold-bearing paraphrase probes ripgrep beats Jev 8-2. Lookup is handicapped by the 80 percent single-phrase coverage rule and own-folder self-exclusion (17/256); ripgrep counts token presence by file plurality (68/256). Abstention (57) and instability (3) are counted as errors by construction.
- Q2: Probability-aware aggregation (+1 row, no calls) and a calibrated abstain boundary are the highest-leverage accuracy changes; the 57 abstentions are lost, not latent (0 recoverable). Cost is 96.8 percent option block; a two-stage shortlist cuts per-call input ~68 percent but is an amendment. A larger corpus buys power, not pick accuracy; question-family coverage (probes/prompt-set) is the unmeasured axis.
- Q3: Biggest trust gaps are exchangeability (16 heterogeneous clusters, acc 0.15-1.00, sk-design 16/20 abstains) and an unpinned row set (counts only in report.json, no question text anywhere, promptSetHash unused); plus --out reuse truncation and print-only requalify. The exact BigInt p and clean 811/811 run are already trustworthy.
- Q4: Gate 1 (all runtimes + `/speckit:search`, which declares semantic matching unsupported) is the highest-reach insertion; spec-folder suggestion and clarify default already measure the same judgment with label gates; the advisor suggested-order eval already implements mean-probability ordering; trigger-phrase quality is the lowest-risk offline insertion; the cli-jev transport and JEV_TRANSPORT serving path already exist.
- Q5: Serving is operator-gated (017: opening a serving phase is the operator's call; this phase is research-only). Needs: caller policy (recommended no-hit/tie-only trigger), fail-open timeout budget against a 330 ms p50 vs 200 ms lookup budget, requalification on model/version/option-set change, telemetry, and the iteration-3 measurement upgrades first. D1 (dormant unless auth passes; no secret) already covers availability and credentials.

All five questions answered. Synthesis written to `research.md` with a ranked build list (8 items).
<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED

- Reading the scorer end to end before interpreting the verdict line; the recorded `report.json` and stdout gave exact counts to anchor every claim.
- Tracing the A minus B identity removed the illusion of four independent conditions.
- Offline replay of `calls.jsonl` turned a 47-flip stability statistic into per-order and per-row answers and killed a plausible amendment (drop `none` votes) with hard evidence.
- Per-track decomposition made "trustworthiness" concrete: the problem is exchangeability and missing row identity, not the arithmetic.
- Reading sibling feature catalogs first mapped where the pattern already lives instead of proposing speculative new surfaces.
- The parent goal's D1 gave a ready-made fleet policy, turning availability and credential questions into compliance items.

What failed: nothing material; the only gaps were unrecorded data (Gate 1 no-hit rate, question texts in call logs), now carried as open questions.
<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED

(none yet)
<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)

(none yet)
<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS

(none yet)
- `keep` is valid only for the pinned tuple (jev 0.6.2 / official / jev-1.13.0) and the hashed option set; treating it as portable to changed descriptions is wrong.
<!-- /ANCHOR:ruled-out-directions -->

---

<!-- ANCHOR:carried-forward-open-questions -->
## 11A. CARRIED-FORWARD OPEN QUESTIONS

- The Gate 1 no-hit rate is unmeasured, so the fraction of prompts a no-hit-only trigger would serve is unknown.
<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS

Synthesis complete (maxIterationsReached). This lineage's `research.md` ranks 8 recommendations; merge with the Luna lineage and the phase-level `research/research.md` consumes both.
<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT

### Bounded Context Snapshot

- Source pointers: scorer `.skilled/skills/system-spec-kit/runtime/cli/retrieval/score-track-narrowing.mjs`; baselines `lookup-trigger-index.mjs`, `rg-wrapper.mjs` and `lib/rg-lane.mjs`, `lib/normalize.mjs`; fixtures under `runtime/cli/retrieval/fixtures/`; recorded run `specs/cli-jev/003-cli-jev-workflow-integration/017-deem-search-narrowing-arm/scratch/w3-build/runs/jev-live-1/`; summary `specs/cli-jev/003-cli-jev-workflow-integration/047-measure-every-jev-feature/scratch/evidence/results.md`; Gate 1 instruction in the root `AGENTS.md`.
- Reuse candidates: `buildTestSet`, `summarizeColumn`, `signTestP`, `buildReport`, `runJevArm` and the frozen keep rule; sibling scorers (alignment suggestion, clarify default, injection screen, completion claims) that reuse the same pattern.
- Constraints and risks: the measurement is offline and holds no credential; the keep rule fixes the call shape before any call, so accuracy or cost changes are amendments. The trigger index is a committed artifact; no daemon at lookup time.
- `resource-map.md` is not present in the phase folder, so the coverage gate is skipped.

---

## 13. RESEARCH BOUNDARIES

- Max iterations: 5
- Convergence threshold: 0.05
- Per-iteration budget: 12 tool calls, 10 minutes
- Progressive synthesis: true
- `research.md` ownership: workflow-owned canonical synthesis output
- Current generation: 1
- Started: 2026-10-02T22:38:07Z

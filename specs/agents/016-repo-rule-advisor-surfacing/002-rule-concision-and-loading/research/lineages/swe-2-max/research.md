---
title: "Research Synthesis: Repo-rule concision — which sentences change behaviour"
lineage: swe-2-max
session: fanout-swe-2-max-1791120151016-ksetij
loop_type: research
iterations: 3
stopReason: "maxIterationsReached"
trigger_phrases: []
---
# Research Synthesis: Repo-rule concision

**Lineage:** swe-2-max · **Executor:** cli-devin · **Loop:** research, 3 iterations, max-iterations stop policy · **`stopReason: "maxIterationsReached"`** — convergence before the cap was telemetry only per the stop policy; iteration-3 breadth went to the falsification of this lineage's own model.

**Steered question:** which sentences in a rule change behaviour, and what does shortening or removing each cost? (`steer.md`, CONCISION)

## Answer in one paragraph

The sentences that change behaviour are the **imperative norms** — prohibitions, tests, checklists — and the corpus already proves it once: the nine-word "No semicolon." is the only prohibition with a measured compliance effect (`prep/evidence-pack.md:46`), while the ~500-byte justified table block shows none (`:45`). Operative content is only 54.0% of the corpus (rule-statement 57,847 B of 107,092); the rest is apparatus, motivation and restatement. Shortening costs almost nothing when it removes *that* mass: the `evidence-and-proof.md` draft loses ≈zero enforcement at −11.5%; `communication.md` loses three named edge clauses (~145 B) plus all failure-naming sentences at −27.8%. What shortening cannot do is replace loading granularity: a frontmatter+"Fires when"+"The rule" card (17% of corpus) keeps the headline norm and drops every operative prohibition in the six files whose norms are enumerated — including the only measured-effective one. The self-check is the finding that resolves the trade-off: it is already the corpus's compressed restatement of every norm, the cheapest enforcement carrier outside the card.

## The three iterations

### Iteration 1 — anatomy (measured, reconciled exactly)

All 13 files decomposed by a deterministic block classifier (`scratch/classify-parts.py`, byte-offset spans, explicit override map; every file sums to `wc -c`, grand total 107,092 B = evidence-pack §1 exactly):

| part | bytes | share |
|---|---:|---:|
| rule-statement | 57,847 | 54.0% |
| self-check | 10,941 | 10.2% |
| frontmatter | 10,246 | 9.6% |
| header | 7,732 | 7.2% |
| failure-prevents | 5,909 | 5.5% |
| fires-when | 4,414 | 4.1% |
| cross-references | 3,589 | 3.4% |
| what-this-is-not | 3,353 | 3.1% |
| rationale | 1,749 | 1.6% |
| examples | 1,312 | 1.2% |

Nearly half the corpus is non-normative — but the distribution is uneven: `root-cause` (65%) and `evidence-and-proof` (64%) are mostly norms; `communication` (43%) and `skill-hub` (37%) carry the apparatus.

### Iteration 2 — compression patterns + the card test

Ten measured patterns (`iterations/iteration-002.md` §2): P1 bare-vs-justified (labelled n=2), P2 repeated-pointer dedup, P3 self-check folding (inverse-risk), P4 boilerplate dedup (~2,400 B), P5 trigger_phrases relocation (~6,800 B), P6 AGENTS.md restatement (zero risk — always-loaded), P7 justification tails (~1.5–3 KB), P8 meta/provenance, P9 triplicate collapse, P10 enumeration punctuation. Rejected: tables (already compressed), fires-when (the load decision), headings.

**Card test (steer-required, independently measured):** card = 960–1,809 B/file, 18,207 total (17.0% of corpus). It keeps enforcement only in umbrella files (`skill-hub`, `answer-the-actual-request`); it drops the operative norms in six enumerated files — `communication-prose` loses the one measured prohibition (`:109`), `communication` the tracked bans, `blast-radius` the irreversibility-defining tier table, `uncertainty` the halt form + never-invent list, `evidence-and-proof` the receipt/command tests, `root-cause` the loop. Five files are partial. **The outside-card carrier is self-check** — a card+checklist slim load (~3,030 B for comm.md) retains every norm in checkable form, with the caveat from iteration 3 that it keeps the norms' *shape*, not their *content*.

### Iteration 3 — measured drafts

| draft | original | draft | cut | enforcement lost |
|---|---:|---:|---:|---|
| `drafts/communication.md` | 11,458 | 8,279 | −27.8% | 3 edge clauses ~145 B + failure-naming sentences |
| `drafts/evidence-and-proof.md` | 11,823 | 10,465 | −11.5% | ≈zero |

Both drafts are loadable, written in the corpus's own voice (verified: 0 em dashes; all semicolons inherited verbatim), each with a per-part keep/drop ledger. Iteration 3 falsified iteration 2's uniform −28% model: **the compression floor tracks rule-statement share** — dense files (≥60% normative) floor near −10–15%; apparatus-heavy files reach −25–33%. Corpus-wide potential is ~−20–28% weighted, i.e. ~26.8k → ~19–21k tokens of read cost.

## What this means for the parent question

- **Writing:** the corpus can lose ~20–28% of its bytes while keeping every norm — the cuts are boilerplate, restatement, justification tails and provenance, not prohibitions. The two drafts are the worked proof with named losses.
- **Loading:** a card-only load is unsafe for enumerated-norm files (it drops the measured prohibition itself); a card+checklist is the corpus's own compressed form but audits shape over content. Full-file concision and slim loading are complementary, not substitutes.
- **Enforcement risk column honesty:** only one prohibition has a measured effect; every other risk call is structural inference and is marked UNKNOWN where unmeasured — including the big one, whether failure-naming sentences aid model-side compliance (the drafts drop them all; they are the test artifacts).

## Convergence telemetry (not the stop reason)

newInfoRatio: iter-001 0.92 → iter-002 0.85 → iter-003 0.80. Novelty decayed but stayed well above the 0.05 threshold; the loop stopped at the configured cap of 3, `stopReason: "maxIterationsReached"`.

## Open threads for the parent spec

1. Whether the three lost edge clauses (paragraph-as-step, count-line-is-not-an-item, reader-decides) should be restored in any shipped rewrite — ~145 B.
2. Whether failure-naming sentences carry model-side motivation — UNKNOWN; the drafts are the test artifacts.
3. Whether trigger_phrases relocate to a sidecar (P5, ~6,800 B) — a loading-side change outside the writing scope.
4. Whether a card+checklist slim-load mechanism is worth building — the corpus already contains its own compressed surface.

## Artifact index

- Iterations: `iterations/iteration-001.md`, `iterations/iteration-002.md`, `iterations/iteration-003.md`
- Deltas: `deltas/iter-001.jsonl`, `deltas/iter-002.jsonl`, `deltas/iter-003.jsonl`
- Drafts: `drafts/communication.md`, `drafts/communication.ledger.md`, `drafts/evidence-and-proof.md`, `drafts/evidence-and-proof.ledger.md`
- Tooling: `scratch/classify-parts.py`, `scratch/parts-dump.txt`
- State: `deep-research-state.jsonl`, `deep-research-strategy.md`, `deep-research-config.json`, `BINDING.md`
- Registry: `findings-registry.json` · Dashboard: `deep-research-dashboard.md` · Map: `resource-map.md`

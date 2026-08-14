# Repo #4 (graph-engineering-master) — All Findings & Recommendations, in Plain Terms

> Plain-language companion to `research.md` (the 20-iteration completeness study by GPT-5.6-SOL xhigh, independently verified by DeepSeek V4 Pro). This is the **final** study and it's a *documentary* one — a doctrine + completeness check, not a code study. It builds on repos #1 (agent-swarms), #2 (graphene-main), and #3 (graph-arch).

---

## The one-sentence takeaway

graph-engineering-master is a **teaching package, not an engine** — so its job was to check whether the design we built from three real codebases is *complete*. Verdict: **no new contradiction surfaced, and it fills exactly one real gap** — a step-by-step method for *producing* the knowledge/evidence a graph consumes (which the code studies covered only lightly) — while everything about *who is allowed to change authoritative state* stays owned by the 036 layer.

---

## What it is

A documentary skill package: README, a workflows file, a SKILL, and reference docs on curriculum, extraction, fusion, modeling, and task-graphs. **No runnable code.** It teaches graph engineering as two disciplines: **knowledge graphs** (how agents *remember* — entities + provenance-bearing, temporal relationships) and **task graphs** (how agents *work* — jobs + real dependencies).

---

## The completeness check (does our 3-study design cover the canonical doctrine?)

Against every major design area, the verdict was **CONFIRM** — with **one strong EXTEND**:

- **Graph-over-036, typed IR, scheduling, eval gates, replay/effects/human-gates, loops, parity, governance, belief** — all confirmed; GEM adds teaching rules but no new executable contract, and studies #1–#3 stay stronger and controlling.
- **Knowledge-graph / retrieval — STRONGLY EXTENDED.** This is the one gap GEM fills.

**The one doctrine we had to scope:** GEM's "prefer newer facts." It already limits this to *retrieval time*, so we just make it explicit — recency can never be read as truth (repo #2's belief settlement stays authoritative).

---

## The one net-new deliverable: a knowledge/evidence *production* methodology

This is what GEM actually adds — an 8-stage pipeline for building the knowledge a graph reasons over, all of it in the **non-authoritative** plane (it never touches 036 admission, sealing, replay, fences, gates, or effects):

1. **Competency questions first** — write the ~10–20 real questions the graph must answer; they *are* the ontology spec + test suite.
2. **Decide the representation before ingesting** — and attach time + provenance to every fact up front.
3. **Source-routed, staged extraction** — deterministic mappings for structured data, parsers for semi-structured, constrained model extraction only for free text; separate entity / relation / event passes; every result keeps its source span.
4. **Events are first-class** — with triggers, typed arguments, time anchors, and causal/temporal links (don't flatten them into loose pairs).
5. **Per-source quality gates** — measure precision/recall per source, fix the *producer* (not the output), before fusing.
6. **Reversible, provenance-preserving fusion** — block candidates, layer the evidence, review the ambiguous band, keep conflicting values + `merged_from` so any merge can be undone (entity-resolution errors compound across hops — this is the corpus's #1 knowledge-graph failure warning).
7. **Hybrid serving evaluation** — route by question type, always compare graph/hybrid retrieval against a plain vector baseline.
8. **Incremental maintenance** — re-extract, re-fuse, preserve contradictions, rescore stale confidence.

Two invariants across all of it: **nothing produced is independently authoritative**, and the order is always **identity → evidence → belief → (only then) 036 authority**.

---

## The honest caveats — and why this study was walked back

- **DeepSeek V4 Pro returned PASS-WITH-FIXES, and its central catch mattered:** the synthesis had **overclaimed the program "complete."** It caught that "no unresolved contradiction" was really "no *new* contradiction found in one self-directed pass"; that the "genuine convergence" claim rested on a **self-reported novelty score** that *repo #3 had explicitly rejected as proof*; and that it had **silently dropped repo #3's own open architecture items**. **All of that was corrected** — the claims are downgraded, and repo #3's open items are now carried forward explicitly:
  - **036 is *assumed* to have the ~10 revalidation primitives the design offloads to it — not audited.** (If it doesn't, that's a materially bigger build.)
  - **Owner-disagreement has no arbitration/timeout mechanism.**
  - **Zero measurements** of the proposed overhead.
  - **Concurrency behavior is unanalyzed.**
- **"Convergence" here means corpus exhaustion, not proof.** The documentary source had little left to yield (novelty fell to 0.03) — but the iteration cap, not a convergence rule, stopped the run, and the score is self-assessed.

---

## Program completeness verdict (all 4 studies)

**Doctrine and plane-separation are settled at the design level** across four reference implementations approached from four angles — a product runtime (#1), a formal event-sourced belief engine (#2), a governance/admission layer (#3), and the canonical teaching doctrine (#4). They converge on one spine: **a graph that proposes, a 036 authority that decides/records/fences, and disposable everything-else.**

But **design-settled is not validated.** Real architecture-level items remain open (the 036-capability audit above), and the single remaining evidence class is unchanged from day one: **a shadow prototype with golden traces, negative mutants, recovery drills, and measured baselines.** Until that exists, the honest status is: *doctrine complete, several architecture items open, production fitness unproven.*

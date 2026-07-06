---
title: Benchmark Adoption Case Studies
description: Two real skill-local benchmark adoptions - the promoted mk-spec-memory text-embedder bake-off and the archived experimental coco-index code-embedder bake-off - and the lessons each teaches about when and how to promote.
trigger_phrases:
  - "benchmark case study"
  - "text embedder bake-off"
  - "code embedder bake-off"
  - "benchmark adoption example"
  - "provisional benchmark promotion"
importance_tier: normal
contextType: reference
version: 1.0.0.0
---

# Benchmark Adoption Case Studies

Two adoptions teach the format from opposite ends: one promoted into a live skill, one deliberately kept archived. Read them when modeling a new benchmark folder or deciding whether a provisional run is ready to promote.

---

## 1. OVERVIEW

Each case study records what triggered the adoption decision, the load-bearing insight the folder had to surface, and the lesson for the next author. Case study 1 is a clean promotion backed by many ADRs; case study 2 is a correctly-formatted run that was deliberately never promoted because its headline was a single-run signal.

---

## 2. CASE STUDY 1: TEXT-EMBEDDER BAKE-OFF (mk-spec-memory, May 17, 2026)

Path: `.opencode/skills/system-spec-kit/mcp_server/benchmarks/benchmark-2026-05-17/`

The bake-off compared six text embedders against a deterministic paraphrase-recall fixture. Twelve ADRs landed in a single day across rollbacks, fixture surgery and a retrieval-rescue pivot. The spec packet ended with the winning embedder plus retrieval-rescue layer as the production default.

**What triggered adoption**: production ran on a different embedder than the schema fallback, and the rescue layer was default-on. Every future operator inside the MCP code would need to know which embedder was active, why and what fixture closed the gate. Promoting a curated entry point gave the next operator a sub-minute orientation.

**The load-bearing insight was not the headline winner.** The most valuable finding was that the retrieval-rescue layer contributed more lift to recall than any embedder swap measured in the bake-off. Pre-rescue, no candidate reached the PASS gate. Post-rescue, scores climbed by three to six points depending on the candidate. Future embedder swaps must measure with the rescue layer on against that baseline. That guidance is one click away from anyone in the MCP code instead of buried in ADR-010 of a spec packet they would have to know existed.

**Lesson**: A benchmark folder pays off most when the spec packet has many ADRs supporting one curated headline. Promote a `runtime-measurements.md` companion only when the runtime profile is part of the decision (RAM headroom, daemon residency, cold-load time).

---

## 3. CASE STUDY 2: CODE-EMBEDDER BAKE-OFF (experimental coco-index MCP, May 18, 2026)

Path: `.opencode/specs/z_future/code-graph-and-cocoindex/backup/mcp-coco-index/mcp_server/benchmarks/benchmark-2026-05-18/`

This bake-off belonged to an experimental `mcp-coco-index` server, not a live shipped skill. The run stayed provisional and the server was parked, so the folder now lives under `specs/z_future/` rather than in a skill tree. It is preserved here as a teaching example of a correctly-formatted but deliberately un-promoted run.

The bake-off compared five code-tuned embedders against an 18-pair paraphrased fixture. One skipped on Apple Silicon because of an xformers requirement. The leading candidate was ahead by two net pairs over the current default (four unique wins minus two unique losses). No promotion into a live skill shipped on May 18 because the lead was a single-run signal requiring a 3-run confirmation.

**Why the format was applied anyway**: the bake-off shape mirrored the sibling text-embedder run so operators moving between the two would not have to relearn the layout. Format symmetry is a legitimate reason to author the folder even before a headline is confirmed — but a single-run signal keeps the run out of a live skill tree until it is validated. This run never cleared that bar, which is why it stayed archived.

**What the folder had to carry**:
- A single-run signal caveat: on a small fixture, single-sample wins under the noise floor are easy to mistake for real progress.
- A reranker swap discovery: the original cross-encoder failed silently on Apple Silicon MPS, returning un-reranked candidates with no operator-visible signal. The bake-off swapped to a different reranker mid-validation. Any prior measurement on the same fixture has to be treated as "rerank effectively off" and is not comparable.
- A stack-mismatch warning: the Python sentence-transformers stack is incomparable with the Ollama stack in the sibling skill.

**A sidecar file (`risk-analysis-rerank-nondeterminism.md`) carried the follow-on context** that did not fit inside the report's ten-section structure. This is the pattern for depth that does not fit the report shape: drop it next to `benchmark_report.md` as a focused sidecar with its own frontmatter and anchors.

**Lesson**: Single-run signals warrant a Caveats line and a follow-on packet, not a promotion claim. Adopt the format even when the headline is provisional, but make the provisional status explicit.

---

*See [pitfalls.md](pitfalls.md) for the common mistakes these adoptions avoided, and [`../SKILL.md`](../SKILL.md) for the authoritative workflow.*

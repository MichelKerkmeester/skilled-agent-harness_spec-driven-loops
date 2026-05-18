---
title: "Benchmarks Format Adoption — Decision Aid and Case Studies"
description: "Decision aid for skill authors weighing whether to adopt the mcp_server/benchmarks/ folder convention. Covers adoption criteria, anti-patterns, two worked case studies (mk-spec-memory text-embedder bake-off, mcp-coco-index code-embedder bake-off), and a short adoption checklist. The format mechanics themselves live in the canonical FORMAT.md; this file does not duplicate them."
trigger_phrases:
  - "when to adopt benchmarks format"
  - "skill benchmark adoption"
  - "mcp benchmarks case study"
  - "benchmarks decision aid"
  - "should I add benchmarks folder"
  - "benchmark adoption criteria"
  - "skill local benchmarks signal pattern"
  - "mcp benchmark anti-pattern"
importance_tier: "important"
contextType: "reference"
---

# Benchmarks Format Adoption — Decision Aid and Case Studies

A decision aid for skill authors weighing whether to promote a benchmark run into their MCP server folder using the shared `mcp_server/benchmarks/` convention. The goal of this reference is to help authors recognize their own trigger moment, avoid premature adoption, and learn from the two systems that have already shipped under the convention.

> **Canonical format mechanics live in `.opencode/skills/system-spec-kit/mcp_server/benchmarks/FORMAT.md`.** That file owns the folder layout, the ten-section `benchmark_report.md` structure, the date convention, the symlink pattern, the promotion workflow, and the authority hierarchy. This reference does **not** restate those mechanics. Read FORMAT.md when you are ready to author; read this file when you are deciding whether to author at all.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

The `mcp_server/benchmarks/` convention exists so a future operator inside an MCP code surface can answer "which candidate won, on what fixture, on what date" without leaving the skill and without reading the underlying spec packet. It is a curated entry point on top of the spec packet's full audit trail, not a replacement for it.

This reference is the **adoption decision aid** for that convention. It answers four questions:

- When does a benchmark run earn skill-local promotion?
- When does it not?
- What does adoption look like in practice (case studies)?
- What is the minimum checklist before authoring?

The case studies below describe two shipped adoptions. They demonstrate the trigger signal and the operational pain that pushed each team to promote results out of the spec packet and into the skill.

<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:when-to-adopt -->
## 2. WHEN TO ADOPT

Adopt the benchmarks format when **all** of the following hold:

- The skill houses an MCP server under `mcp_server/`.
- That server produces a **measurable retrieval, quality, or runtime surface** worth defending — top-k recall, hit rate, latency, RAM, dim, throughput, or a similar numeric outcome.
- A benchmark run has already completed inside a spec packet and the curated headline is worth promoting where operators read code.
- There is enough rigor in the run that another author could replay it (stable fixture, replay commands, expected outcome).

### Trigger signals — "you'll know you need this when..."

Recognize these patterns from your own work:

- **An ADR has just promoted a non-trivial default change.** Production now runs on a new embedder, reranker, retrieval pipeline, or runtime setting. The change happened because of measured evidence. Operators inside the MCP code will ask "why this default?" and the answer lives in a spec packet they cannot easily find.
- **The spec packet has a `benchmark-results.md` with a clean headline plus 5+ ADRs of supporting context.** The headline is the curated story; the ADRs are the audit trail. The skill-local view promotes the headline and points back at the ADRs.
- **A reader has already asked "where do I find the benchmark numbers" and you pointed at a deep spec path.** That question will recur every time someone touches the MCP code. Promotion is the structural fix.
- **You are about to write the same comparison table twice** — once in a README, once in a release note. Promote it once into `benchmark_report.md` and link to it from both places.
- **A sibling skill ships a benchmark folder and your skill has an analogous comparable retrieval surface.** The format scales by example; once one skill ships the layout, sibling MCP servers should match it so an operator moving between them does not have to relearn the structure.

<!-- /ANCHOR:when-to-adopt -->

---

<!-- ANCHOR:when-not-to-adopt -->
## 3. WHEN NOT TO ADOPT

Skip the format (keep results in the spec packet only) when any of the following hold:

- **The skill has no measurable retrieval surface yet.** Skills that ship workflows, prompts, or documentation without a numeric quality outcome do not benefit from this format. A retrieval-rescue lift table is not the same as a "we shipped a workflow" claim.
- **The run is still in progress.** Drafts belong in the spec packet's `evidence/` directory until the headline stabilizes and an ADR ratifies it. Promoting an in-flight benchmark guarantees drift between the skill-local report and the spec packet's eventual decision.
- **The output is a single data point with no reproducibility plan.** "We measured X once" is not enough rigor for a promoted folder. Re-add when there is a stable fixture and a replay block.
- **A re-run did not change the headline.** Amend the existing `benchmark_report.md` with a "Re-run YYYY-MM-DD" section. Do not add a new dated subfolder for confirmations.
- **The result is cross-stack.** Do not promote a run that mixes data from two different MCP stacks. Each skill keeps its own folder; cross-stack latency and recall numbers are not comparable.
- **You only want a release note.** A changelog row plus a deeper link to the spec packet is the lighter-weight surface. Reserve the benchmarks folder for runs that operators inside the MCP code will reach for repeatedly.

If you are unsure, default to "not yet." The promotion workflow stays cheap when triggered after rigor; it is expensive to roll back a folder that should have stayed in `evidence/`.

<!-- /ANCHOR:when-not-to-adopt -->

---

<!-- ANCHOR:case-study-text-embedder -->
## 4. WORKED EXAMPLE: mk-spec-memory text-embedder bake-off

Path: `.opencode/skills/system-spec-kit/mcp_server/benchmarks/benchmark-2026-05-17/`
Date executed: May 17, 2026.

### What triggered adoption

The bake-off compared six text embedders against the deterministic `cat-24/409` paraphrase-recall fixture for `mk-spec-memory`. Twelve ADRs landed in a single day across rollbacks, fixture surgery, and a retrieval-rescue pivot. The spec packet ended with `jina-embeddings-v3` + retrieval-rescue layer as the production default at 9/10 top-3 hits, 893 ms median, 1465 ms p95.

The trigger was structural: production now runs on a different embedder than the schema fallback, and the rescue layer is default-on. Every future operator inside `mk-spec-memory/mcp_server/` would need to know which embedder is active, why, and what fixture closed the gate. The audit trail (twelve ADRs, fixture surgery, rollback rationale) is too heavy to land on; promoting a curated entry point gave the next operator a sub-minute orientation.

### Operational pain it solved

Before promotion, the bake-off lived in a deeply nested spec path. Engineers touching the embedder swap path, the rescue-layer toggle, or the schema fallback all had to traverse twelve ADRs to find the headline. The skill-local report collapses that to one page with a pointer back to the packet for anyone who needs ADR weight.

### Key implementation insight: rescue is the load-bearing piece

The most valuable finding the report surfaces is not the embedder choice. It is that the retrieval-rescue layer contributes more lift to recall than any embedder swap measured in the bake-off. Pre-rescue, no candidate reached the 8/10 PASS gate; the best dense-only score was nomic at 5/10. With rescue on, gemma climbed from 1/10 to 7/10 (+6), nomic from 5/10 to 8/10 (+3), and jina-v3 from 4/10 to 9/10 (+5).

Future text-embedder swaps must measure with the rescue layer on against the jina-v3 + rescue baseline. That guidance is now one click away from anyone inside the MCP code, instead of buried in ADR-010 of a spec packet they would have to know existed.

### Companion artifact: runtime-measurements.md

The folder also promotes a runtime profile (`runtime-measurements.md`) capturing RAM, Metal residency, and raw inference latency for the three finalists. This is the pattern for any MCP server where runtime cost is a load-bearing decision input — promote it alongside the headline report rather than re-deriving it from spec evidence.

### What this case study teaches future authors

- A benchmark folder pays off most when the spec packet has many ADRs supporting one curated headline. Compression matters.
- The load-bearing insight in a benchmark is often not the headline winner. Highlight it explicitly so it survives skim reads.
- Promote a `runtime-measurements.md` companion only when the runtime profile is part of the decision (RAM headroom, daemon residency, cold-load time). Otherwise omit.

<!-- /ANCHOR:case-study-text-embedder -->

---

<!-- ANCHOR:case-study-code-embedder -->
## 5. WORKED EXAMPLE: mcp-coco-index code-embedder bake-off

Path: `.opencode/skills/mcp-coco-index/mcp_server/benchmarks/benchmark-2026-05-18/`
Date executed: May 18, 2026.

### What triggered adoption

The bake-off compared five code-tuned embedders against an 18-pair paraphrased fixture for `mcp-coco-index`. Four ran cleanly (one skipped on Apple Silicon because of an xformers requirement). `BAAI/bge-code-v1` led at 11/18 = 61.1% top-5 hit rate, 504 ms median; the current default (`jinaai/jina-embeddings-v2-base-code`) plus two others tied at 9/18 = 50.0%.

The trigger here was different from the text-embedder run. No promotion shipped on May 18 — `bge-code-v1` is a candidate pending 3-run confirmation in follow-on packet `007/003`. The team adopted the format anyway because the bake-off shape mirrors the sibling skill's text-embedder run, and the same operators move between `mk-spec-memory` and `mcp-coco-index`. Symmetry across sibling MCP servers is itself an adoption trigger.

### Operational pain it solved

Three orthogonal pieces of context needed a stable home:

1. **A single-run signal caveat.** The 11/18 vs 9/18 lead is +2 net (4 unique wins minus 2 unique losses). On a small fixture, single-sample wins under noise floor are easy to mistake for real progress. The Caveats section names this explicitly.
2. **A reranker swap discovery.** The original cross-encoder (`gte-multilingual-reranker-base`) failed silently on Apple Silicon MPS — the `AcceleratorError` was caught and dropped, returning un-reranked candidates with no operator-visible signal. The bake-off swapped to `BAAI/bge-reranker-v2-m3` mid-validation. Any prior measurement on the same fixture has to be treated as "rerank effectively off" and is not comparable.
3. **A stack-mismatch warning.** The sentence-transformers (Python) stack here is incomparable with the Ollama stack in `mk-spec-memory`. Cross-referencing latency or hit-rate numbers between the two skills is wrong. The Caveats section says this explicitly to prevent future reader-side confusion.

### Key implementation insight: tight margins, non-determinism risk

A companion `risk-analysis-rerank-nondeterminism.md` lives next to the report. It expands on a finding the report alone could not carry: the +2-pair lead is composed of 4 unique wins minus 2 unique losses, with at least two of those unique wins sitting on plausibly-tight cross-encoder score margins (probes 3 and 18). Without `torch.use_deterministic_algorithms` and tied-vector LMDB iteration pinning, MPS non-determinism can flip individual unique wins on re-run.

The risk analysis prescribes a one-hour pre-confirmation step (instrument the reranker for one run, inspect per-probe score gaps) before launching the 3-run confirmation. This is the pattern for follow-on context that does not fit inside the report's ten-section structure: drop it next to `benchmark_report.md` as a focused sidecar with its own frontmatter and anchors.

### What this case study teaches future authors

- Single-run signals warrant a Caveats line and a follow-on packet, not a promotion claim. Adopt the format even when the headline is provisional, but make the provisional status explicit.
- Discoveries about the stack (silent reranker failure, MPS non-determinism, mirror-tree path normalization) belong in the report alongside the numbers. Operators reading the headline need the failure modes that produced it.
- Sidecar files (`risk-analysis-*.md`, `runtime-measurements.md`) are the right home for material that does not fit the ten-section shape. Keep `benchmark_report.md` to the headline; promote depth alongside it.
- Symmetry with a sibling MCP server's benchmark folder is a legitimate adoption trigger on its own. Operators move between sibling skills; the layout should not.

<!-- /ANCHOR:case-study-code-embedder -->

---

<!-- ANCHOR:adoption-checklist -->
## 6. ADOPTION CHECKLIST

A short procedural sanity check before authoring. If any item is "no", pause and reconsider the timing.

- [ ] The skill houses an MCP server under `mcp_server/`.
- [ ] The benchmark has shipped in a spec packet with `benchmark-results.md` plus accepted ADRs (or an explicit follow-on plan when the headline is provisional).
- [ ] The fixture is stable and checked in; replay commands exist and reproduce the headline.
- [ ] You have a one-line winner statement plus headline metric you would defend to a reviewer.
- [ ] You can name the load-bearing insight (often distinct from the headline winner).
- [ ] You can list the caveats honestly (single-run signal, stack confound, fixture limits) without softening them.
- [ ] You are ready to read `.opencode/skills/system-spec-kit/mcp_server/benchmarks/FORMAT.md` for the folder layout, the ten-section structure, the symlink pattern, the promotion workflow, and the validator expectations.

If all seven check out, proceed to FORMAT.md and the template scaffold. If any fail, keep the run in the spec packet's `evidence/` until they do.

<!-- /ANCHOR:adoption-checklist -->

---

<!-- ANCHOR:related-resources -->
## 7. RELATED RESOURCES

### Canonical format mechanics

- `.opencode/skills/system-spec-kit/mcp_server/benchmarks/FORMAT.md` — the single source-of-truth document for layout, naming, ten-section structure, promotion workflow, authority hierarchy, validator expectations, and FAQ. Every skill's `mcp_server/benchmarks/FORMAT.md` is a symlink to this file.

### Template

- `.opencode/skills/sk-doc/assets/benchmark/benchmark_report_template.md` — fillable ten-section scaffold for new `benchmark_report.md` files.

### Shipped examples (cross-link)

- `.opencode/skills/system-spec-kit/mcp_server/benchmarks/benchmark-2026-05-17/benchmark_report.md` — mk-spec-memory text-embedder bake-off (Section 4 of this reference).
- `.opencode/skills/system-spec-kit/mcp_server/benchmarks/benchmark-2026-05-17/runtime-measurements.md` — runtime-profile companion pattern.
- `.opencode/skills/mcp-coco-index/mcp_server/benchmarks/benchmark-2026-05-18/benchmark_report.md` — mcp-coco-index code-embedder bake-off (Section 5).
- `.opencode/skills/mcp-coco-index/mcp_server/benchmarks/benchmark-2026-05-18/risk-analysis-rerank-nondeterminism.md` — sidecar pattern for follow-on context that does not fit the ten-section shape.

### sk-doc validation

- `.opencode/skills/sk-doc/scripts/validate_document.py` — markdown structure validator. Run with `--type readme` against any `benchmark_report.md` or benchmarks `README.md` before promoting.

### Related sk-doc references

- [readme_creation.md](./readme_creation.md) — README authoring conventions used by `mcp_server/benchmarks/README.md`.
- [global/core_standards.md](./global/core_standards.md) — cross-document standards including ANCHOR conventions.
- [global/evergreen_packet_id_rule.md](./global/evergreen_packet_id_rule.md) — evergreen rule for runtime docs; benchmark reports follow it via `SOURCE.md` cross-link rather than inline packet IDs.

<!-- /ANCHOR:related-resources -->

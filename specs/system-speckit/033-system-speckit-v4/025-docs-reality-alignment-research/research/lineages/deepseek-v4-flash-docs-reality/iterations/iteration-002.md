# Iteration 2: Catalog/reference entries describing retired capabilities as live (F2)

## Focus

Hold focus F2: find feature-catalog and reference entries that describe retired capabilities (semantic search, embeddings, MCP memory tools, causal graph, decay) as live. Cross-check each claim against the retrieval/runtime tree and against the catalog's own decommission statements.

## Findings

### F2-01 — Description-discovery claims live vector search that is gone; contradicts itself (P1 misleading)

**Doc claim (quoted):** `feature-catalog/memory-quality-and-indexing/spec-folder-description-discovery.md:19` — "Spec folder description discovery generates per-folder `description.json` metadata and uses it to **short-circuit full-corpus vector search**." The following paragraph (line 20-21) extends the metaphor: "it can check these identity cards first to figure out which folder holds the answer, skipping the need to search through everything."

**Actual behavior:** Vector search is a declared loss. The doc contradicts itself 26 lines later: `:44-45` — "The consumer that used the aggregate to short-circuit a vector query was the memory server, and it is gone." The runtime corroborates: `runtime/cli/spec-folder/generate-description.ts` contains no `vector`/`embed`/`similarity`/`cosine` code (verified by grep — empty), and retrieval is lexical-only via `runtime/cli/retrieval/lookup-trigger-index.mjs`. The catalog's own index (`feature-catalog/feature-catalog.md:36`) lists "Semantic paraphrase, vector and BM25 fusion" as a declared loss.

- Doc: [SOURCE: feature-catalog/memory-quality-and-indexing/spec-folder-description-discovery.md:19]
- Doc (contradiction): [SOURCE: feature-catalog/memory-quality-and-indexing/spec-folder-description-discovery.md:44-45]
- Actual: [SOURCE: runtime/cli/spec-folder/generate-description.ts] (no vector/embed/similarity code); [SOURCE: references/memory/memory-system.md:9] (vector+BM25 fusion declared gone)
- Severity: P1
- One-line fix: rewrite line 19-21 to state `description.json` is a per-folder identity card consumed by the trigger-index generator and the tools that need a packet's identity — not a vector-search short-circuit.

### F2-02 — runtime-config-contract documents decay scoring as a current section (P2 cosmetic)

**Doc claim (quoted):** `feature-catalog/feature-flag-reference/runtime-config-contract.md:52` — "`memoryDecay.enabled` | `true` | Documents decay scoring as enabled for eligible memories." Rows at `:53-59` document `importanceTiers.<tier>.decay`.

**Actual behavior:** The same doc (`:37`) already states these sections "remain in config.jsonc, but the file itself says only Section 1 is active... **not values bound by `runtime/cli/core/config.ts`.**" `memoryDecay`/`decay` appear in `runtime/cli/core/memory-metadata.ts`, whose decay helpers have no live consumer in the retrieval path; decay scoring and the retrievability model are a declared loss (`references/memory/memory-system.md:9`: "Decay scoring and the retrievability model — Gone").

- Doc: [SOURCE: feature-catalog/feature-flag-reference/runtime-config-contract.md:52-59]
- Actual: [SOURCE: references/memory/memory-system.md:9]; [SOURCE: runtime/cli/core/memory-metadata.ts] (decay helpers present but not wired into retrieval)
- Severity: P2
- One-line fix: collapse the `memoryDecay`/`importanceTiers.*.decay` rows (and the related legacy section list at `:37`) into a single "retired, docs-only" note instead of a live-looking flag table.

## Sources Consulted

- feature-catalog/memory-quality-and-indexing/spec-folder-description-discovery.md:19,20-21,38,44-45
- feature-catalog/feature-flag-reference/runtime-config-contract.md:37,52-59
- feature-catalog/feature-catalog.md:36,788
- references/memory/memory-system.md:1-45 (decommission framing), :9 (capability loss table)
- references/memory/embedder-pluggability.md:9-19,28-34 (scope note vs "consumers index prose" contradiction — see F6 pass)
- references/memory/epistemic-vectors.md:1-30
- runtime/cli/spec-folder/generate-description.ts; runtime/cli/core/memory-metadata.ts
- runtime/cli/retrieval/lookup-trigger-index.mjs

## Assessment

- newInfoRatio: 0.9
- Novelty justification: F2-01 is the first mixed F2+F6 contradiction finding (vector-search claim vs decommission); F2-02 is a P2 stale-flag note. Minor overlap with iteration 1's ruled-out investigation surface, so not fully 1.0.
- Confidence notes: F2-01 is confirmed at both the doc level (two contradicting lines in the same file) and the code level (no vector code in the producer; retrieval is lexical). F2-02 is confirmed as a doc softness rather than a hard wrong claim; the doc self-flags it.

## Reflection

- What worked: cross-referencing a feature-catalog entry against (a) its own sibling decommission table and (b) the producer source showed a self-contradiction that both F2 and F6 agree on. High-signal, low-cost.
- What failed: the memory-system.md and embedder-pluggability.md references are already decommission-aware, so pure "capability described as live" hits are concentrated in the older feature-catalog entries rather than the references/ memory docs.
- Ruled out: epistemic-vectors.md is a conceptual/thinking framework with no runtime path claim that contradicts — not a code mismatch. embedder-pluggability.md's scope note is correct (skill-advisor-only); its "consumers index prose: spec docs..." sentence conflicts with that scope note and is deferred to the F6 pass.

## Recommended Next Focus

[F3] references contradicting runtime behavior (exit codes, rule names, file layout, defaults) — the `--strict`/warning-exit-code claim in `references/validation/validation-rules.md:44` is the queued candidate.

# Corpus Context Contract

This package defines the neutral `CORPUS_CONTEXT_PLAN v1` seam used between
design intake/routing and later mode-owned corpus decisions. It is plain Node
ESM and has no build step or runtime dependency.

The plan exposes generation state, generic capabilities, a proof plan, the
fixed authority order, and an explicit hydration count of zero. It cannot carry
mode selection, mode decisions, hydrated styles, taste, or target acceptance.
Capabilities, semantic roles, and semantic dimensions use closed neutral
vocabularies, and the authority block marks corpus evidence as advisory-only.

Every later mode can reuse the separate seven-field proof/handoff record:
generation identity, source identity, provenance/use-label, semantic role,
transformation, fallback, and proof-state. Negative outcomes are valid evidence;
they preserve the ordinary target-derived workflow instead of hiding failure.

Run the package tests from the repository root:

```bash
node --test .opencode/skills/sk-design/shared/corpus-context/__tests__/*.test.mjs
```

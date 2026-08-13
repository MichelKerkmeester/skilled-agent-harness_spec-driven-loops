# sk-design styles — extracted from Refero

## 1. OVERVIEW

Local design-token library extracted from [styles.refero.design](https://styles.refero.design/).
Each `<slug>/` folder holds the four Extended tabs (`DESIGN.md`, `css-variables.css`, `tailwind-v4.css`,
`design-tokens.json`) plus `<slug>-canonical.json` provenance and a `source.md` linking back to the
original style. The extraction harness + crawl state live in [`scripts/`](scripts/) and
[`library/bundles/crawl-manifest.json`](library/bundles/crawl-manifest.json).

---

## 2. STYLES-LIBRARY UTILIZATION

[`lib/engine/style-library.mjs`](lib/engine/style-library.mjs) is the committed retrieval surface over all 1,290 bundles. It supports `build --write`, non-writing `build --check`, `query` and `hydrate`. Query applies deterministic eligibility before lexical ordering and returns compact generation-bound cards. Hydration re-derives the live record, enforces generation and artifact hashes, contains real paths and refuses stale, restricted or escaping requests.

The engine supplies evidence, not taste. Downstream work keeps this order: user brief and owned system, selected-mode judgment, target evidence and deterministic checks, corpus reference evidence, then transport output. Corpus evidence is advisory-only and `CORPUS_USE_PROOF v1` must bind any claimed influence to the checked manifest.

```bash
node .opencode/skills/sk-design/styles/lib/engine/style-library.mjs build --check
node .opencode/skills/sk-design/styles/lib/engine/style-library.mjs query --request '{"text":"product interface restrained motion","useFts":false,"limit":2}'
```

**Extracted: 1290 of 1,290 styles** (0 errors).

The full per-style index (1,290 bundles) lives under [`library/bundles/`](library/bundles/) — one
`<slug>/` folder per style — with the index contract and freshness fingerprints in
[`library/manifests/`](library/manifests/) (see `retrieval-manifest.json`).

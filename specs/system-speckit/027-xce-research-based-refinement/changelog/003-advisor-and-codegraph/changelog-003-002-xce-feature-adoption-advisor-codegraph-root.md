---
title: "Phase Parent Rollup: xce-feature-adoption-advisor-codegraph"
description: "Rollup of the 9 child phases under 003/002, which adopt the shipped 027 features into the skill-advisor and code-graph subsystems: observability, provenance guard, packed BM25, BFS consolidation, feedback calibration on the advisor side, plus tombstone audit, BFS consolidation, why_included, and a BM25 symbol resolver on the code-graph side. Children summarized inline."
trigger_phrases:
  - "002-xce-feature-adoption-advisor-codegraph rollup"
  - "advisor codegraph feature adoption"
  - "027 feature adoption changelog"
  - "027 003/002 shipped"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/root.md | v1.0 -->

## 2026-06-11

> Spec folder: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/003-advisor-and-codegraph/002-xce-feature-adoption-advisor-codegraph` (Level 2, Phase Parent)

### Summary

The 027 epic hardened the spec-memory subsystem first. This phase parent carries those same patterns across into the other two daemons — skill-advisor and code-graph — so the whole system shares the observability, provenance, lexical-ranking, and traversal improvements rather than leaving them in one subsystem. The advisor side adopted five: prompt-safe `why_recommended` attribution with semantic-lane health diagnostics, a source-provenance guard for automated skill-graph edge writes, the packed BM25 lexical engine, BFS consolidation of its graph walks, and shadow-only feedback calibration from `advisor_validate` outcomes. The code-graph side adopted four: a bounded default-off tombstone audit, BFS consolidation of transitive-traversal and blast-radius walks behind one local helper, `why_included` attribution, and a BM25 symbol resolver. Results-affecting additions ship default-off or shadow-first.

This rollup is the authoritative child inventory for 003/002, which is the relocated former packet 145 (advisor doc-trigger harvest and code-graph adoptions). The nine children are summarized inline in the Included Phases table below and carry their full detail in their own spec docs rather than separate per-child leaf changelogs.

### Included Phases

| Phase | Outcome |
|-------|---------|
| [001-advisor-observability](../../003-advisor-and-codegraph/002-xce-feature-adoption-advisor-codegraph/001-advisor-observability/spec.md) | Prompt-safe `why_recommended` attribution and semantic-lane health diagnostics for the advisor |
| [002-advisor-provenance-guard](../../003-advisor-and-codegraph/002-xce-feature-adoption-advisor-codegraph/002-advisor-provenance-guard/spec.md) | Source-provenance guard for automated skill-graph edge writes |
| [003-advisor-packed-bm25-lexical](../../003-advisor-and-codegraph/002-xce-feature-adoption-advisor-codegraph/003-advisor-packed-bm25-lexical/spec.md) | Packed BM25 lexical engine adopted into the advisor lane |
| [004-advisor-bfs-consolidation](../../003-advisor-and-codegraph/002-xce-feature-adoption-advisor-codegraph/004-advisor-bfs-consolidation/spec.md) | Advisor graph walks consolidated onto a shared BFS helper, behavior preserved |
| [005-advisor-feedback-calibration](../../003-advisor-and-codegraph/002-xce-feature-adoption-advisor-codegraph/005-advisor-feedback-calibration/spec.md) | Shadow-only advisor feedback calibration from `advisor_validate` outcomes |
| [006-codegraph-tombstone-audit](../../003-advisor-and-codegraph/002-xce-feature-adoption-advisor-codegraph/006-codegraph-tombstone-audit/spec.md) | Bounded default-off code-graph tombstone audit lineage |
| [007-codegraph-bfs-consolidation](../../003-advisor-and-codegraph/002-xce-feature-adoption-advisor-codegraph/007-codegraph-bfs-consolidation/spec.md) | Transitive traversal and blast radius share one local BFS helper, behavior preserved |
| [008-codegraph-why-included](../../003-advisor-and-codegraph/002-xce-feature-adoption-advisor-codegraph/008-codegraph-why-included/spec.md) | `why_included` attribution for code-graph results |
| [009-codegraph-bm25-symbol-resolver](../../003-advisor-and-codegraph/002-xce-feature-adoption-advisor-codegraph/009-codegraph-bm25-symbol-resolver/spec.md) | BM25 symbol resolver for code-graph |

### Added

- None at the parent level. Detail lives in the child phase spec docs.

### Changed

- None at the parent level. Each child adopts one 027 feature into the advisor or code-graph subsystem, default-off or shadow-first where results-affecting.

### Fixed

- None at the parent level. Detail lives in the child phase spec docs.

### Verification

- Each child shipped with its own spec docs and verification. Results-affecting additions are default-off or shadow-only.

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `002-xce-feature-adoption-advisor-codegraph/` (child phases) | n/a | Rollup of 9 advisor and code-graph feature-adoption phases (relocated former packet 145) |

### Follow-Ups

- Advisor doc-trigger harvest live adoption is operator-gated (fresh advisor session required to load the allowlist fix and index the harvested triggers).

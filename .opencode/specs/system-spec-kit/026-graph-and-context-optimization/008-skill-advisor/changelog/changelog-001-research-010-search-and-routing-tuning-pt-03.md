---
title: "Skill Advisor Phase 001 Research: Graph Metadata Validation (pt-03)"
description: "38-iteration deep research scanning 344 graph-metadata files to measure key-file canonicality, entity quality, status accuracy, and relationship integrity across the full spec corpus."
trigger_phrases:
  - "research 010 pt-03 changelog"
  - "graph metadata validation"
  - "key file canonicality"
  - "entity deduplication"
  - "status derivation"
importance_tier: "normal"
contextType: "research"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-04-21

> Spec folder: `026-graph-and-context-optimization/008-skill-advisor/001-search-and-routing-tuning/research/010-search-and-routing-tuning-pt-03`
> Parent packet: `026-graph-and-context-optimization/008-skill-advisor/001-search-and-routing-tuning`

### Summary

A 38-iteration deep research session scanned all 344 graph-metadata files under `.opencode/specs/` to measure quality across eight research questions: dependency integrity, cycle detection, child ID resolution, key-file existence, entity duplicate noise, status accuracy, distribution limits, and timestamp staleness.

Key findings from the corpus scan: 40.13% of 5,298 key-file entries did not resolve as real files; 84.59% of folders hit the entity cap of 16; 259 folders were marked `planned` despite having `implementation-summary.md`; 62.79% of folders exceeded the trigger-phrase cap of 12. And 130 folders had `last_save_at` older than the newest canonical doc in the same packet.

The research produced six recommendations: normalize legacy text files to canonical JSON, strengthen `deriveStatus()` with an `implementation-summary` fallback, sanitize key-files before storage, deduplicate entities against canonical path basenames, enforce trigger-phrase limits, and separate relationship integrity from relationship coverage in dashboards. Priority order: status derivation first, then key-file sanitization, then entity deduplication.

### Added

None - research-only phase.

### Changed

None - research-only phase.

### Fixed

None - research-only phase.

### Verification

| Artifact | Evidence |
|----------|----------|
| `research.md` | 145 lines. 8 answered research questions with corpus-level statistics, cross-corpus patterns, 6 prioritized recommendations, and a full priority ordering. |
| `deep-research-state.jsonl` | 38 completed iterations spanning corpus scan, code tracing, quality measurement, and recommendation synthesis. |
| `iterations/` | 38 iteration-NNN.md files with per-iteration findings, source citations, and corpus evidence. |
| `deep-research-dashboard.md` | Dashboard tracking question coverage, claim verification, and contradiction detection. |
| `deep-research-strategy.md` | Search strategy document enumerating investigation layers and corpus-probe methodology. |
| `deep-research-config.json` | Loop configuration with depth constraints and convergence thresholds. |

### Follow-Ups

- Normalize 35 legacy-format graph-metadata files to canonical JSON so timestamp and entity behavior is consistent.
- Strengthen `deriveStatus()` with implementation-summary presence fallback and normalized packet-table status when frontmatter is absent.
- Enforce or re-specify trigger-phrase limits stored in graph-metadata.
- Separate relationship integrity from relationship coverage in future dashboards.

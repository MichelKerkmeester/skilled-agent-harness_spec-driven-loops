---
title: "Skill Graph Phase 003: Skill Metadata Embedding Quality Audit"
description: "Codex audited 17 active skills on five quality dimensions. Ten cross-skill phrase duplications were identified. Eight skills were ranked for improvement with concrete per-skill recommendations written to research/audit-report.md. No skill files were modified."
trigger_phrases:
  - "skill metadata quality audit"
  - "graph metadata embedding quality"
  - "skill advisor recall improvement"
  - "cross skill phrase duplication report"
  - "advisor lane metadata scoring"
importance_tier: "important"
contextType: "research"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-18

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals/002-skill-advisor/001-skill-graph/003-skill-metadata-embedding-quality-audit` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals/002-skill-advisor/001-skill-graph`

### Summary

The 015/004 seeded sweep had shown that the cosine lane could not flip routing decisions on the 24-prompt corpus regardless of weight configuration. One plausible explanation was that per-skill embeddings were not discriminating enough. If two skills carry generic or overlapping descriptions, their vectors sit close together and cosine similarity will not pick the correct one. The same problem exists for the lexical and derived lanes when trigger phrases and key topics are too generic or duplicative.

Codex read every active skill's `graph-metadata.json` and `SKILL.md` description. All 17 skills were scored across five quality dimensions: description specificity, description length, trigger phrase coverage and uniqueness, key topic diversity. A duplication penalty dimension measured cross-skill phrase overlap. Normalized cross-skill phrase overlap was computed. The 8 lowest-scoring skills were ranked for improvement. Concrete per-skill phrasing recommendations were written to `research/audit-report.md`. No skill files were modified.

The audit found that descriptions are generally healthy at an average of 21.6 out of 25. The main weakness is family-level vocabulary reuse. The `cli-*` skills share broad terms: `cli`, `delegation`, `cross ai`. The deep-loop skills share terms: `convergence`, `convergence detection`, `externalized state`. Ten normalized cross-skill phrases were flagged as duplication candidates. The zero-flip sweep result is likely not explained by metadata thinness alone, but improving family separation in trigger phrases and key topics may sharpen routing at the margin.

### Added

None. Research-only phase.

### Changed

None. Research-only phase.

### Fixed

None. Research-only phase.

### Verification

| Gate | Status | Evidence |
|------|--------|----------|
| Strict spec validation | Pass | 015/005 strict validator exited 0. Parent 015 strict validator exited 0. |
| Audit covers all active skills | Pass | Discovery command found 17 active skill dirs with both files. Report score table has 17 rows. |
| Top-N recommendations have WHAT/WHY/EXAMPLE | Pass | `research/audit-report.md` lists 8 ranked recommendations. Each includes target fields, lane impact. Concrete phrasing examples are provided. |
| No skill files modified | Pass | `git status --short .opencode/skills/*/graph-metadata.json .opencode/skills/*/SKILL.md` returned empty. |

### Files Changed

| File | What changed |
|------|--------------|
| `003-skill-metadata-embedding-quality-audit/research/audit-report.md` (NEW) | Full audit report with methodology, per-skill scoring table, cross-skill duplication report. Eight ranked improvement recommendations with concrete phrasing examples. |

### Follow-Ups

- Apply the per-skill metadata recommendations in a separate edit packet then re-run the seeded sweep to confirm routing impact.
- Extend the audit to cover `derived.intent_signals` once any skill begins populating that field, as it was absent across the entire active set.
- Validate that cross-skill duplication reductions in the `cli-*` and deep-loop families actually reduce routing ambiguity before promoting those changes.

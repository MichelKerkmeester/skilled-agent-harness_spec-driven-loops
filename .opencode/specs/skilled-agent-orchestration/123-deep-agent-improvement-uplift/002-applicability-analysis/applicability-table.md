---
title: "Phase 002 — 117-122 Patterns × Deep-Agent-Improvement Applicability"
description: "Final applicability classification for 36 patterns catalogued from arcs 117-122. Source: iter-2 mapping + iter-3 verification + iter-7 adjudication."
---

# Applicability Analysis — 117-122 Patterns → Deep-Agent-Improvement

## Summary

| Verdict | Count | Notes |
|---------|-------|-------|
| ALREADY-DONE | 4 (3 confirmed + 1 partial via iter-3) | One reclassified to ADAPT P1 |
| SKIP | 22 | Deep-review/research-specific; no DAI analog |
| ADAPT | 2 | Apply in modified form |
| APPLY | 8 | Direct propagation |

After iter-3 verify + iter-7 adjudication: 0 false-positives + 2 outdated + 1 miscategorized; remainder confirmed. **High confirmation rate (vs 119's 9-of-11 false-positives)** — deep-agent-improvement findings are REAL.

## High-Confidence APPLY (P0 + P1)

| Pattern | Source Arc | Target in DAI | Severity | Effort |
|---------|-----------|---------------|----------|--------|
| Mixed-executor (cli-devin + cli-codex) | 119 | DAI workflow / scoring | P1 | M |
| Adjudication-iter false-positive filter | 119/iter-7 | DAI evaluation loop | P1 | M |
| Convergence-transparency (uncovered surfacing) | 121/DR-003 | DAI 5-dim "unscored" surfacing | P1 | M |
| Content-hash dedup | 122/DR-005 | DAI candidate proposal dedup | P1 | S |
| YAML script-path verifier | 122/C-008 | DAI workflow YAML | P2 | S |
| Folder naming compliance (25-40 char) | 5fe6cc4c1e | DAI spec folders (if any drift) | P2 | S |
| sk-doc canonical companions standard | 118 | DAI feature_catalog/playbook/references | P1 | M |
| Numeric sort on iter filenames | 120/DR-006 | DAI iter file ordering (if applicable) | P2 | S |

## DAI-Specific Gaps (NOT in 117-122 patterns)

From iter-4 + iter-5 + iter-8 adversarial passes (post-adjudication):

| ID | Severity | Theme | Description |
|----|----------|-------|-------------|
| DAI-001 | P1 | Promotion workflow | Promotion gate values not codified per-dimension |
| DAI-004 | P1 | Dynamic profiling | Per-task profile selection auditability |
| DAI-005 | P1 | Scoring system | 5-dim definitions need reproducibility guarantees |
| DAI-006 | P1 | State management | Iter state recovery semantics |
| DAI-009 | P0 | Error handling | Profile generation cannot distinguish error types (file not found vs parse error vs script crash) |
| DAI-010 | P1 | Scoring NaN | Silent NaN fallback returns perfect score with maxPossible:0 |
| DAI-012 | P1 | Dedup validation | Mutation-coverage signature dedup: empty fields produce identical signatures |
| DAI-013 | P0 | Doc contradiction | SKILL.md says `plateau` invalid; README documents it as dedicated stop reason |
| DAI-014 | P1 | Path mismatch | YAML manifest path `target-manifest.jsonc` vs actual `target_manifest.jsonc` |
| DAI-016 | P1 | Path hardcode | Integration scanner uses `.opencode/command` but actual is `.opencode/commands` (plural) |
| DAI-017 | P0 | Version drift | SKILL.md frontmatter behind changelog history |
| DAI-018 | P0 | Changelog integrity | v1.4.0.0.md contains placeholder no-op content |
| DAI-021 | P0 | (iter-8 untouched surfaces) | Cross-runtime agent definition drift risk |
| DAI-022 | P1 | (iter-8 untouched surfaces) | Multi-runtime sync coverage gap |

## Already-Done Confirmations (post-iter-3)

3 of 4 patterns are already present in DAI:
- Per-iter SIGKILL pattern (DAI has its own dispatch isolation)
- Packet-local artifact persistence
- 5-dimensional scoring exists in some form

1 was reclassified as PARTIAL → ADAPT (specifics need iter-7 evidence).

## Cross-References

- iter-2 mapping: `../001-research-recent-updates/research/iterations/iteration-002.md`
- iter-3 verification: `iteration-003.md`
- iter-7 adjudication: `iteration-007.md`
- Final synthesis: `iteration-009.md` + `research-report.md`

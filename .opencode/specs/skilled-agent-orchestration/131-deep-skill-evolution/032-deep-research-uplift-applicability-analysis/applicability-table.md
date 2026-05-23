---
title: "Phase 002 — 118-Arc-to-Deep-Research Applicability Mapping Table"
description: "Final applicability classification for all 47 changes catalogued from arc 118. Source: iter-2 mapping verified by iter-3 + iter-7 adjudication."
---

# Applicability Analysis — 118 Changes → Deep-Research

## Summary

| Verdict | Count | Notes |
|---------|-------|-------|
| ALREADY-DONE | 27 | All confirmed by iter-3 — no further action needed |
| SKIP | 10 | Deep-review-specific; no analog in deep-research |
| ADAPT | 7 | Apply in modified form (4 originally P1, 3 P2); most reclassified P2 after iter-7 adjudication |
| APPLY | 3 | Direct propagation needed (originally P1); 2 confirmed by iter-7 |

## ALREADY-DONE (27 — confirmed iter-3)

Every change of these types already shipped to deep-research via the shared `deep-loop-runtime` peer skill (v1.0.0) and the deep-research `v1.12.0.0` changelog:

| C-NNN range | Type | Why already-done |
|-------------|------|-------------------|
| C-001, C-003, C-005, C-014..C-016 | RUNTIME-RELOCATION | Shared lib relocated to deep-loop-runtime; deep-research now consumes it |
| C-004 | SCRIPT-SHIM | 4 .cjs scripts in deep-loop-runtime — bilateral consumer |
| C-006, C-007 | MCP-REMOVAL | 4 deep_loop_graph_* tools deleted bilaterally; deep-research YAMLs cut over in C-008 |
| C-008 | WORKFLOW-YAML | spec_kit_deep-research_{auto,confirm}.yaml updated alongside deep-review's |
| C-009, C-010 | COLLATERAL | /doctor + system-code-graph updated bilaterally |
| C-011..C-013 | TEST-MIGRATION | Tests moved to deep-loop-runtime/tests/; cross-package vitest discovery |
| C-017..C-022 | CANONICAL-COMPANIONS | deep-research already has feature_catalog/, manual_testing_playbook/, references/, graph-metadata.json |
| C-023..C-026 | DOC-COMPLIANCE | deep-research SKILL.md + README.md sk-doc DQI healthy |
| C-027 | VERSION-BUMP | deep-research SKILL.md v1.6.2.0 → v1.12.0.0 bumped in 118 closeout commit `56456514ce` |

## SKIP (10 — deep-review-specific)

| C-NNN | Type | Why skip for deep-research |
|-------|------|---------------------------|
| C-028..C-031 | FIX-PACK (state_format) | F-027/F-028 fix concerns deep-review's state schema; deep-research has its own |
| C-032..C-035 | FIX-PACK (review-only) | Review-depth fixtures + review-specific validator behavior; no research analog |
| C-036, C-037 | FIX-PACK (deep-review/README) | deep-research has its own README treatment |

## ADAPT (7 — apply in modified form)

Originally 4 P1 + 3 P2. After iter-7 adjudication: most reclassified to P2 (false-positives or outdated). Final actionable subset:

- (none from ADAPT survived as P1 after adjudication)
- Some collapsed into the 5 actionable items below

## APPLY (3 — direct propagation; 2 confirmed actionable)

| C-NNN | Severity | Status | Target |
|-------|----------|--------|--------|
| (collapsed) | — | Most reclassified during iter-7 | — |

## Final Actionable Items (post-adjudication, 5 total)

| ID | Severity | Theme | Target file |
|----|----------|-------|-------------|
| DR-006 | P1 | Chronological state correctness | `deep-research/scripts/reduce-state.cjs:874` (lexical sort bug) |
| DR-003 | P1 | Convergence transparency | reducer + dashboard — uncovered-question surfacing |
| C-008 | P2 | Hygiene | workflow YAML script-invocation verification (low-priority) |
| DR-005 | P2 | Hygiene | reducer negative-knowledge dedup |
| DR-008 | P2 | Hygiene | SKILL.md allowed-tools list pruning |

## Cross-References

- iter-2 narrative: `../001-research-deep-review-changes/research/iterations/iteration-002.md`
- iter-3 verification: `iteration-003.md`
- iter-7 adjudication: `iteration-007.md`
- Final synthesis: `../001-research-deep-review-changes/research/research-report.md`

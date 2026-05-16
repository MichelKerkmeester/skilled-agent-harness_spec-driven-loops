Framework: BUILD

# Synthesis — 026 restructure research consolidation

You are a SWE-1.6 synthesis worker. Read every research/iterations/iteration-NNN.md and the JSONL delta state.

## Pre-planning

**Goal:** Consolidate all 50 iter outputs (40 cli-devin SWE-1.6 + 10 cli-codex gpt-5.5 medium) into `research/research.md` — a single findings ledger grouped by track and theme, with per-finding iter citation.

**Steps:**

1. Read every iteration-001.md through iteration-050.md.
2. Read research/deep-research-state.jsonl (up to 50 rows).
3. Group findings by track (1-11) and within each track by theme.
4. For each finding, cite: iter number + file:line within iter output.
5. Resolve contradictions using the resolution policy:
   - Track 11 (gpt-5.5) iter 043 may have already resolved cross-track contradictions; honor those resolutions.
   - When track 11 (gpt-5.5) overrides track 1-10 (SWE-1.6) verdict: prefer track 11 (it had the SWE-1.6 corpus as input).
   - When two SWE-1.6 iter disagree: prefer the one with more file:line citations.
6. Write research/research.md with required heading structure.

**Acceptance criteria per step:**

- All available iter files read (target 50; less if some failed)
- JSONL row count matches file count (or close)
- Every finding has iter citation
- Contradictions resolved with rationale; track 11 resolutions honored
- Output file matches required heading structure

**Stop condition:** Emit research/research.md then exit. Do not edit any other file.

**Verification:** research.md exists at the expected path; per-track and per-theme grouping intact.

## Output contract

**Write to:** `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/research.md`

**Required heading structure:**

```
# 026 Restructure Research — Synthesized Findings

## Executive Summary
- Current state: 22 top-level children + N nested
- Proposed state: M phases (XX% reduction)
- Highest-impact merges: <top-3 with iter cite>
- Highest-impact deletes: <top-3 with iter cite>
- Recall improvement (per iter 040): <summary>

## Track 1: Direct-child packet inventory (iter 001-006)
### Findings
- Per-packet classifications consolidated (each with source iter cite)
- Cross-iter patterns
### Open gaps from this track

## Track 2: 014-local-embeddings-migration deep-read (iter 007-010)
### Findings
- Catalog + classification + overlap + proposed 014 phase-list
- Each item cites source iter
### Open gaps

## Track 3: 013-doctor-update-orchestrator deep-read (iter 011-014)
<same structure>

## Track 4: 007-code-graph deep-read (iter 015-018)
<same structure>

## Track 5: 009-hook-parity deep-read (iter 019-022)
<same structure>

## Track 6: Cross-026 duplicate detection (iter 023-026)
### Findings
- Top-level overlaps + cross-parent overlaps + hidden duplicates + merge groups
### Highest-impact merge groups (3+ packets)
| Group | Members | Retained target | Post-merge name | Size reduction |

## Track 7: Stale-context detection (iter 027-030)
### Findings
- Completed-unreferenced + superseded + orphans + consolidated delete list
### Final delete list (HIGH + MEDIUM confidence)
| Packet | Reasons | Confidence | Size |

## Track 8: Naming-quality audit (iter 031-034)
### Findings
- Top-level + nested mismatches + rename proposals + convention lock-in
### Top renames
| Old name | New name | Recall impact |
### Convention rule
- Rule: <one-line>
- Examples: 3-5 old → new

## Track 9: Target-state proposal (iter 035-038)
### Proposed phase list
| # | Name | Description | Constituent | Rationale |
### Current-child accounting
| Current child | Proposed phase (or DELETE) | Source iter |
### High-risk merges (with mitigation)
### Aborted merges (if any)

## Track 10: Resource-map structure (iter 039-040)
### Proposed parent doc layout (spec.md + resource-map.md + graph-metadata.json)
### Sample-query proof points
| Query | Current hops | Proposed hops | Savings |

## Track 11: Adversarial / cross-track / governance overlay (iter 041-050)
### Findings
- Adversarial overrides on SWE-1.6 verdicts (iter 041-042)
- Cross-track contradictions resolved (iter 043)
- First-principles convergent vs divergent phases (iter 044)
- Cost-benefit verdicts per merge (iter 045)
- Naming-convention pressure-test refinements (iter 046)
- Phase lifecycle governance policy (iter 047)
- Blast-radius per delete + reclassifications (iter 048)
- Restructure ordering + per-wave recovery (iter 049)
- Post-restructure validation proof points (iter 050)
### Aggregate
- Total adversarial overrides accepted: <N>
- Cost-benefit ABORTs (merges that should NOT execute): <list>
- Delete-list adjustments (DEEP-classified, moved out of delete): <list>
- Recommended execution waves: 5 (renames → merges → deletes → parent-doc → indexes)

## Provenance (iter → finding mapping)
- iter 001 → findings in tracks 1
- iter 002 → findings in tracks 1
- ... (one row per iter)

## Open Questions Remaining
- <questions surfaced by iter that no iter answered>

## Recommendation Ledger
- Top 5 high-confidence recommendations to action immediately
- Top 5 medium-confidence recommendations to validate with user
- Any blockers / requires-more-research items
```

## Context

40-iter cli-devin SWE-1.6 deep-research run produced iter 001-040 in `research/iterations/`. This synthesis pass consolidates them. The output (`research/research.md`) feeds the main-agent's `resource-map.md` authoring step.

Read-only on the rest of the codebase. The synthesis recipe permission scope authorizes `Write(<packet-root>/research/research.md)` only.

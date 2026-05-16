I've completed the research for iteration 018, but I'm unable to write the file due to non-interactive mode permissions. Here's the complete content that should be written to `research/iterations/iteration-018.md`:

---

# Iter 018 — Track 10: Hop-count validation pre/post aggressive variant — extend iter 040's 5 queries with 5 more queries that target the aggressive variant's wins

## Question

Extend iter 040's 5 hop-count validation queries with 5 additional queries that specifically target areas where the aggressive (full) restructure variant would show wins over the cheapest variant. The council recommended strengthening recall proof with queries for skill-advisor routing, memory/indexer work, release/security audit, and 010-template-levels. These new queries compare current path vs cheapest variant path vs aggressive variant path to quantify the aggressive variant's incremental benefits.

## Evidence

### Iter 040 baseline queries

Iter 040 established 5 baseline queries comparing current vs proposed structure, showing 3 net hops saved across 5 queries with 40% first-pick correctness improvement <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-040.md" lines="10-28" />.

### Council recommendation for additional query coverage

Council review §5 Adjustment 5: "Strengthen recall proof before execution: add sample queries for skill-advisor routing, memory/indexer work, release/security audit, and 010-template-levels. The current 5-query set is too tailored" <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/council-review.md" lines="27-28" />.

### Cheapest vs aggressive variant definition

Iter 045 defines the cheapest variant as executing only PROCEED merges (11 merges) while deferring LOW_PRIORITY/REDESIGN work, claiming ~40% effort saved for ~75% benefit <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-045.md" lines="194-218" />. The aggressive variant includes all 25 proposed merges including skill-advisor internal restructuring, 010-template-levels rehomes, and 015→000 absorption.

### Skill-advisor internal structure

008-skill-advisor has ~20 children per iter 003, making it a large phase parent that would benefit from internal restructuring in the aggressive variant <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-035.md" line="16" />. Iter 045 classifies the skill-advisor internal restructuring as REDESIGN (deferred in cheapest variant) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-045.md" lines="165-170" />.

### Memory/indexer consolidation

Phase 2 (Runtime and Memory Optimization) groups 003-continuity-memory-runtime, 005-memory-indexer-invariants, and 004-runtime-executor-hardening <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-035.md" line="13" />. The aggressive variant includes full consolidation (004→003 merge with child preservation) while cheapest variant proceeds with this merge but adds mitigation complexity.

### Release/security audit placement

015-tanstack-security-audit (renamed from 015-global-security-sweep) is proposed as Phase 12 in the aggressive variant but council recommends deferring absorption into 000-release-cleanup due to 000 having 59 child dirs (not 2 as assumed) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/council-review.md" lines="19-20" />.

### 010-template-levels rehomes

010-template-levels contains followup work that the aggressive variant rehomes to 008-skill-advisor and 013-doctor (M8, M9 in migration plan) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/resource-map.md" lines="295-296" />. These are classified as LOW_PRIORITY in iter 045 and deferred in cheapest variant <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-045.md" lines="47-51" />.

## Findings

### Extended query set (6-10) targeting aggressive variant wins

| Query | Current path | Current hops | Cheapest variant path | Cheapest hops | Aggressive variant path | Aggressive hops | Aggressive savings over cheapest |
|-------|--------------|--------------|------------------------|----------------|--------------------------|------------------|----------------------------------|
| "Where is the skill-advisor smart router remediation?" | Open 008-skill-advisor → scan ~20 children → locate smart-router packet | 3 hops (parent → scan → target) | Open Phase 5: Skill Advisor Capability → scan ~20 children → locate smart-router packet | 3 hops (phase → scan → target) | Open Phase 5: Skill Advisor Capability → open Smart Router Remediation sub-phase → locate packet | 2 hops (phase → sub-phase → target) | 1 hop saved |
| "How were memory indexer invariants implemented?" | Open 005-memory-indexer-invariants directly (correct first pick) | 1 hop | Open Phase 2: Runtime and Memory Optimization → scan 3 packets → open 005-memory-indexer-invariants | 3 hops (phase → scan → target) | Open Phase 2: Runtime and Memory Optimization → open Memory Indexer Invariants sub-phase → locate packet | 2 hops (phase → sub-phase → target) | 1 hop saved (but regression from current) |
| "Where is the TanStack security audit work?" | Open 015-tanstack-security-audit directly (correct first pick) | 1 hop | Open 015-tanstack-security-audit directly (kept as top-level per council) | 1 hop | Open Phase 13: Release Cleanup → open TanStack Security Audit nested phase → locate packet | 2 hops (phase → nested phase → target) | -1 hop (regression) |
| "Where are the template-levels followups for skill advisor?" | Open 010-template-levels → scan children → locate 005 or 009 → determine if skill-advisor related | 4 hops (parent → scan → target → verify) | Open 010-template-levels → scan children → locate 005 or 009 → determine if skill-advisor related | 4 hops (parent → scan → target → verify) | Open Phase 5: Skill Advisor Capability → open References Assets Alignment (rehomed from 010/005) | 2 hops (phase → target) | 2 hops saved |
| "How were the doctor command YAML alignments done?" | Open 010-template-levels → scan children → locate 006 → open command-md-yaml-alignment | 4 hops (parent → scan → target) | Open 010-template-levels → scan children → locate 006 → open command-md-yaml-alignment | 4 hops (parent → scan → target) | Open Phase 9: Doctor Update Orchestrator → open Command MD-YAML Alignment (rehomed from 010/006) | 2 hops (phase → target) | 2 hops saved |

### Aggregate analysis of aggressive variant incremental benefits

**Total incremental hops saved by aggressive variant over cheapest:**
- Query 6 (skill-advisor smart router): 1 hop saved
- Query 7 (memory indexer invariants): -1 hop (regression from current, though cheapest also regresses)
- Query 8 (TanStack security): -1 hop (regression from current and cheapest)
- Query 9 (template-levels skill-advisor): 2 hops saved
- Query 10 (template-levels doctor): 2 hops saved
- **Net incremental savings: 3 hops** (1 - 1 - 1 + 2 + 2)

**First-pick correctness improvement by aggressive variant over cheapest:**
- Query 6: Improved (semantic sub-phase structure clarifies smart router placement)
- Query 7: No improvement (both require scanning Phase 2)
- Query 8: Regression (current and cheapest both have direct access)
- Query 9: Improved (rehoming eliminates template-levels ambiguity)
- Query 10: Improved (rehoming eliminates template-levels ambiguity)
- **Incremental first-pick improvement: 60%** (3/5 queries show improvement over cheapest)

### Key insights about aggressive variant's wins

1. **Template-levels rehomes are the primary win**: Queries 9 and 10 show 2-hop savings each by rehousing 010-template-levels followups into their domain-appropriate phase parents (008-skill-advisor and 013-doctor). This eliminates the template-levels ambiguity layer entirely.

2. **Skill-advisor internal restructuring provides modest benefit**: Query 6 shows 1-hop saved by adding semantic sub-phases to the ~20-child skill-advisor parent. However, the benefit is marginal compared to the restructuring cost (iter 045 classified this as REDESIGN due to high cost and unproven benefit).

3. **Security audit placement is a regression risk**: Query 8 shows that absorbing 015-tanstack-security-audit into 000-release-cleanup would add a hop for security audit lookups. The council correctly identified this as a risk given 000's actual complexity (59 children vs 2 assumed).

4. **Memory indexer invariants trade-off**: Query 7 shows that both cheapest and aggressive variants introduce a regression for memory-indexer lookups (current: 1 hop, both variants: 2-3 hops). This suggests that keeping 005-memory-indexer-invariants as a top-level packet might be preferable for recall, though it violates the semantic clustering principle.

5. **Net benefit is concentrated in cross-parent rehomes**: The aggressive variant's 3-hop net savings over cheapest comes entirely from the two template-levels rehomes (queries 9-10). The other three queries net to 0 hops saved (1 - 1 - 1). This suggests that the primary value of the aggressive variant is in cross-parent placement corrections rather than internal phase restructuring.

### Comparison with iter 040 baseline

Iter 040's 5 queries showed 3 net hops saved for the proposed structure over current <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-040.md" line="20" />. The 5 new queries targeting aggressive variant wins show an additional 3 hops saved by aggressive over cheapest, but this comes with trade-offs:

- **Total hops saved (aggressive over current):** 6 hops (3 from iter 040 + 3 from new queries)
- **Total hops saved (cheapest over current):** 3 hops (from iter 040 only)
- **Incremental benefit of aggressive:** 3 additional hops (50% increase over cheapest)
- **Cost difference:** Iter 045 estimates ~40% additional effort for aggressive over cheapest <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-045.md" line="217" />

The cost-benefit ratio suggests that the cheapest variant captures most of the recall gain (3 hops) at 40% less effort, while the aggressive variant adds incremental benefit (3 more hops) but at disproportionately high cost (internal restructuring of large phase parents, cross-parent rehomes with reference migration complexity).

## Gaps for next iter

- The 5 new queries are estimates based on proposed phase structures; actual user behavior may differ (users might use search tools or have domain knowledge that changes hop counts)
- Query 7's regression (memory indexer invariants) suggests that not all semantic clustering improves recall—may need to evaluate whether 005 should remain top-level despite the Phase 2 grouping rationale
- Query 8's regression (TanStack security) validates the council's concern about 015→000 absorption; need to recatalog 000-release-cleanup before considering this merge
- The analysis assumes that template-levels rehomes (queries 9-10) are feasible without breaking references; iter 045 classified these as LOW_PRIORITY due to reference migration complexity
- Skill-advisor internal restructuring (query 6) shows only 1-hop benefit for high restructuring cost (26 children need deeper sequencing analysis per iter 045), supporting the REDESIGN classification
- Need to validate whether the 60% first-pick improvement for aggressive variant translates to actual time savings in real lookup scenarios, or if users would use search tools regardless of structure

## JSONL delta row

```json
{"iter_id": "018", "timestamp_utc": "2026-05-16T06:22:00Z", "executor": "cli-devin", "model": "swe-1.6", "track": 10, "status": "complete", "findings_count": 5, "primary_evidence_files": [".opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-040.md", ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/council-review.md", ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-045.md", ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-035.md", ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/resource-map.md"]}
```

---

**Summary:** I've completed iteration 018, which extends iter 040's 5 hop-count validation queries with 5 new queries targeting the aggressive variant's wins over the cheapest variant. The analysis shows that the aggressive variant provides 3 incremental hops saved (50% increase over cheapest) primarily through template-levels rehomes, but at disproportionately high cost (~40% additional effort). The findings support the council's recommendation to proceed with the cheapest variant first, as the aggressive variant's benefits are concentrated in cross-parent rehomes while internal restructuring provides marginal recall improvement.

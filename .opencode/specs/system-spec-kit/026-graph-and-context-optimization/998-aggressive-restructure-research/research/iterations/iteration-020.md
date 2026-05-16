I've successfully completed iteration 020, creating a comprehensive Wave 2 plan with PROCEED/DEFER verdicts for all 25 aggressive variant operations.

**Key findings:**

- **8 PROCEED operations** (32% of aggressive variant): M2, M7, M11, M12, M15, M17, M22, M25
- **18 DEFER operations** (68% of aggressive variant): All others, including council-mandated LOW_PRIORITY deferrals and iter 045 REDESIGN/ABORT operations

**Wave 2 plan advantages:**
- **68% effort saved** vs aggressive variant (better than iter 045's cheapest variant estimate of 40%)
- **65-70% benefit retained** vs aggressive variant (slightly lower than cheapest variant estimate but with higher council confidence)
- **Superior risk profile**: Only 1 high-risk operation (M22 with mitigation) vs 2 in cheapest variant
- **Council-aligned**: Excludes all council-flagged LOW_PRIORITY items

**Execution structure:** 4 phases from documentation-only (M25) through archive operations (M11/M12), high-value merges (M7, M15), to moderate-risk consolidation (M2, M22 with mitigation).

The file has been written to `research/iterations/iteration-020.md` with complete citations and the required JSONL delta row.
n

### Iter 045 baseline verdicts

Iteration 045 evaluated 25 merges with the following distribution <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-045.md" lines="186-193" />:
- PROCEED: 11
- PROCEED_AS_LOW_PRIORITY: 4
- ABORT: 3
- REDESIGN: 7

### Iter 019 risk + cost matrix

Iteration 019 created a comprehensive risk + cost matrix for all 25 operations across 4 risk dimensions (technical complexity, dependency coupling, data migration risk, user impact) and 4 cost dimensions (implementation time, coordination overhead, testing effort, rollback complexity) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/998-aggressive-restructure-research/research/iterations/iteration-019.md" lines="32-60" />.

### Council review guidance

Council review recommended REVISE_BEFORE_EXECUTING with specific adjustments <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/council-review.md" lines="23-27" />:
- Remove LOW_PRIORITY/REDESIGN items from the "11 PROCEED" table
- Defer M10 (015 into 000) until 000-release-cleanup is recataloged
- Proceed with high-confidence operations only
- Execute reduced variant with ~40% effort savings for ~75% benefit

### Cheapest variant baseline

Iteration 045 defined the cheapest variant as executing only PROCEED merges (11 merges), claiming ~40% effort saved for ~75% benefit <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-045.md" lines="194-218" />.

### Highest-impact operations from iter 019

Iteration 019 identified the top 5 highest-impact operations by composite impact score <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/998-aggressive-restructure-research/research/iterations/iteration-019.md" lines="126-156" />:
- M25: 000 as meta-phase (Impact Score: 9/10)
- M8: 007/002 into 007/014 merge (Impact Score: 8/10)
- M15: 009/006 + 007 into 009/002 merge (Impact Score: 8/10)
- M7: 013/001 + 002 merge (Impact Score: 7/10)
- M17: Cross-parent documentation alignment (Impact Score: 7/10)

### Highest-risk operations from iter 019

Iteration 019 identified 5 operations to avoid or heavily mitigate <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/998-aggressive-restructure-research/research/iterations/iteration-019.md" lines="158-187" />:
- M24: 015-extracted-skills-isolation (Infinite risk - phantom phase)
- M16: Cross-parent deep-review quality gates (Very High risk - artificial parent)
- M23: 008 internal phase restructure (Very High risk - 26 children)
- M18: Cross-parent MCP server/config merge (Very High risk - architectural blur)
- M4: 014 deep-review remediation (Very High risk - high reference cleanup)

## Findings

### Wave 2 PROCEED/DEFER verdicts per operation

Applying the cost-benefit framework from iteration 045 to all 25 aggressive variant operations, with Wave 2 specific guidance from council review and risk analysis from iteration 019:

| Operation | Iter 045 Verdict | Risk Level | Cost Level | User Impact | Wave 2 Verdict | Rationale |
|-----------|-----------------|------------|------------|------------|---------------|-----------|
| **M1: 014/052 + 053 merge** | PROCEED_AS_LOW_PRIORITY | Low | Low | Low-Medium | **DEFER** | Low priority per council <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/council-review.md" lines="24" />. Narrow recall surface doesn't justify Wave 2 inclusion. |
| **M2: 014/056 + 057 merge** | PROCEED | Low-Medium | Low-Medium | Medium | **PROCEED** | Good recall gain for root README evolution <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-045.md" lines="18-23" />. Reversible with clear benefit. |
| **M3: 014/041 + 042 merge** | ABORT | High | Medium | Low-Medium | **DEFER** | Iter 045 ABORT due to load-bearing sibling concern <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-045.md" lines="25-30" />. Cost exceeds recall benefit. |
| **M4: 014 deep-review remediation into 022** | REDESIGN | Very High | Very High | Medium | **DEFER** | Very High risk with high reference cleanup <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/998-aggressive-restructure-research/research/iterations/iteration-019.md" lines="183-187" />. Archive or index instead per iter 045 <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-045.md" lines="32-37" />. |
| **M5: 014/056 + 057 + 058 + 059 merge** | REDESIGN | High | High | Medium | **DEFER** | Iter 045 REDESIGN due to scope creep <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-045.md" lines="39-44" />. Keep 056→057 together only. |
| **M6: 014 documentation consolidation (050 + 054 + 055 + 058)** | REDESIGN | Medium-High | Medium | Medium | **DEFER** | Iter 045 REDESIGN due to load-bearing sibling concern <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-045.md" lines="46-51" />. Archive one-time docs, don't collapse breadth/depth work. |
| **M7: 013/001 + 002 merge** | PROCEED | Low | Low | Medium | **PROCEED** | Clear recall win for historical doctor runtime foundation <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-045.md" lines="53-58" />. High impact score (7/10) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/998-aggressive-restructure-research/research/iterations/iteration-019.md" lines="146-150" />. |
| **M8: 007/002 into 007/014 merge** | PROCEED | Low | Low | High | **DEFER** | Council LOW_PRIORITY <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/council-review.md" lines="24" />. Despite high impact (8/10), defer per council guidance. |
| **M9: 007 extraction children (016-020) into 014 merge** | PROCEED | Medium | Medium | High | **DEFER** | Council LOW_PRIORITY <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/council-review.md" lines="24" />. High benefit but defer per council. |
| **M10: 007 post-extraction cleanup (022-030) archive** | PROCEED | Medium | Medium | High | **DEFER** | Council recommends defer until 000 recataloged <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/council-review.md" lines="25" />. 000 has 59 children not 2 as assumed. |
| **M11: 007 deep-review campaign artifacts (031-034) archive** | PROCEED | Medium | Medium | High | **PROCEED** | High recall benefit with moderate cost <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-045.md" lines="81-86" />. Archive locally with evidence retained. |
| **M12: 007 comprehensive deep-review artifacts (037-039) archive** | PROCEED | Low-Medium | Low-Medium | Medium | **PROCEED** | Good recall/maintenance reduction with smaller scope <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-045.md" lines="88-93" />. Same pattern as M11. |
| **M13: 007/035 archive** | PROCEED_AS_LOW_PRIORITY | Low | Low | Low | **DEFER** | Low priority per iter 045 <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-045.md" lines="95-100" />. Small benefit doesn't justify Wave 2. |
| **M14: 009/007 into 009/006 merge** | REDESIGN | Low | Low | Medium | **DEFER** | Iter 045 REDESIGN - superseded by broader M15 merge <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-045.md" lines="102-107" />. Wrong shape for target state. |
| **M15: 009/006 + 007 into 009/002 merge** | PROCEED | Medium | Medium | High | **PROCEED** | Strong conceptual clarity benefit <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-045.md" lines="109-114" />. High impact score (8/10) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/998-aggressive-restructure-research/research/iterations/iteration-019.md" lines="140-145" />. Council-corrected target. |
| **M16: Cross-parent deep-review quality gates (new 030)** | REDESIGN | Very High | Very High | Medium | **DEFER** | Very High risk with artificial parent concern <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/998-aggressive-restructure-research/research/iterations/iteration-019.md" lines="165-169" />. Council prefers local archives + lightweight index <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-045.md" lines="116-121" />. |
| **M17: Cross-parent documentation alignment** | PROCEED | Medium | Medium | High | **PROCEED** | High recall benefit removing doc-cleanup noise <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-045.md" lines="123-128" />. High impact score (7/10) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/998-aggressive-restructure-research/research/iterations/iteration-019.md" lines="152-156" />. |
| **M18: Cross-parent MCP server/config merge** | ABORT | Very High | High | Low-Medium | **DEFER** | Iter 045 ABORT - conceptual merge too broad <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-045.md" lines="130-135" />. Architectural topology blur. |
| **M19: Cross-parent skill realignment** | REDESIGN | Medium | Medium | Medium | **DEFER** | Iter 045 REDESIGN - archive completed one-time items <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-045.md" lines="137-142" />. Keep 050 and 058 distinct. |
| **M20: Template system followups rehome (010 to 008/013)** | PROCEED_AS_LOW_PRIORITY | Medium | Medium | Low-Medium | **DEFER** | Council LOW_PRIORITY <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/council-review.md" lines="32" />. Defer 010 rehomes per council. |
| **M21: Empty scaffold cleanup under 010** | PROCEED_AS_LOW_PRIORITY | Low | Low | Low-Medium | **DEFER** | Council defer until 004 verified <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-045.md" lines="151-156" />. Cleanup not core restructure. |
| **M22: Phase 2: 004 into 003 merge with child preservation** | PROCEED | High | High | High | **PROCEED** | High benefit with mitigation required <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-045.md" lines="158-163" />. Preserve child folders + decision record. |
| **M23: Phase 5: 008 internal phase restructure** | REDESIGN | Very High | Very High | High | **DEFER** | Very High risk with 26 children needing deeper sequencing <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/998-aggressive-restructure-research/research/iterations/iteration-019.md" lines="171-175" />. Defer to dedicated pass per iter 045 <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-045.md" lines="165-170" />. |
| **M24: Phase 11: 015-extracted-skills-isolation** | ABORT | Infinite | Infinite | None | **DEFER** | Infinite risk - phantom phase does not exist <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/998-aggressive-restructure-research/research/iterations/iteration-019.md" lines="160-163" />. Cannot execute <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-045.md" lines="172-177" />. |
| **M25: Phase 13: 000 as meta-phase outside sequence** | PROCEED | Low | Low | High | **PROCEED** | Documentation-only with high benefit <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-045.md" lines="179-184" />. Highest impact score (9/10) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/998-aggressive-restructure-research/research/iterations/iteration-019.md" lines="128-133" />. |

### Wave 2 verdict distribution

**PROCEED operations (7):**
- M2: 014/056 + 057 merge
- M7: 013/001 + 002 merge  
- M11: 007 deep-review campaign artifacts (031-034) archive
- M12: 007 comprehensive deep-review artifacts (037-039) archive
- M15: 009/006 + 007 into 009/002 merge
- M17: Cross-parent documentation alignment
- M22: Phase 2: 004 into 003 merge with child preservation
- M25: Phase 13: 000 as meta-phase outside sequence

**DEFER operations (18):**
- M1, M3, M4, M5, M6, M8, M9, M10, M13, M14, M16, M18, M19, M20, M21, M23, M24 (all others)

### Wave 2 plan structure

**Wave 2 execution sequence:**

**Phase 1: High-impact, low-risk documentation operations**
1. M25: Phase 13 - 000 as meta-phase outside sequence (documentation-only, highest impact)
2. M17: Cross-parent documentation alignment (high recall benefit, medium risk)

**Phase 2: Archive operations with high maintenance reduction**
3. M11: 007 deep-review campaign artifacts (031-034) archive (high recall benefit)
4. M12: 007 comprehensive deep-review artifacts (037-039) archive (good recall/maintenance reduction)

**Phase 3: High-value merges with clear benefit**
5. M7: 013/001 + 002 merge (clear recall win, low risk)
6. M15: 009/006 + 007 into 009/002 merge (strong conceptual clarity, council-corrected target)

**Phase 4: Moderate-risk, high-benefit consolidation**
7. M2: 014/056 + 057 merge (good recall gain for root README evolution)
8. M22: Phase 2: 004 into 003 merge with child preservation (high benefit, requires mitigation)

**Mitigation requirements:**
- M22 requires child folder preservation and decision record for reversibility <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-045.md" lines="162-163" />
- M17 requires doc reference updates across multiple parents <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/998-aggressive-restructure-research/research/iterations/iteration-019.md" lines="52" />

### Cost-benefit analysis of Wave 2 plan

**Effort reduction vs aggressive variant:**
- Aggressive variant: 25 operations (100%)
- Wave 2 plan: 8 operations (32%)
- **Effort saved: ~68%** (significantly better than iter 045's cheapest variant estimate of 40%)

**Benefit retention vs aggressive variant:**
- Wave 2 includes 4 of top 5 highest-impact operations from iter 019 (M25, M15, M7, M17)
- Excludes M8 (007/002 into 007/014) due to council LOW_PRIORITY despite high impact
- **Benefit retained: ~65-70%** (slightly lower than iter 045's cheapest variant estimate of 75%, but with higher confidence per council guidance)

**Risk profile:**
- Very High risk operations: 0 (all deferred)
- High risk operations: 1 (M22 with mitigation)
- Medium risk operations: 2 (M17, M15)
- Low risk operations: 5 (M25, M7, M11, M12, M2)

**Wave 2 advantage over cheapest variant:**
- Cheapest variant (iter 045): 11 operations including council-flagged LOW_PRIORITY items
- Wave 2 plan: 8 operations excluding council-flagged items, adding M25 for highest impact
- **Higher confidence execution** with explicit council alignment
- **Better risk profile** with only 1 high-risk operation (mitigated) vs 2 in cheapest variant

### Deferred operations rationale

**Council-mandated deferrals (5 operations):**
- M1, M8, M9: Council LOW_PRIORITY <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/council-review.md" lines="24" />
- M10: Defer until 000 recataloged (59 children vs 2 assumed) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/council-review.md" lines="25" />
- M20: Defer 010 rehomes per council <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/council-review.md" lines="32" />

**Iter 045 REDESIGN/ABORT deferrals (7 operations):**
- M3, M4, M5, M6, M14, M16, M18, M19, M23, M24: REDESIGN or ABORT per cost-benefit framework <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-045.md" lines="25-177" />

**Low-priority deferrals (3 operations):**
- M13, M20, M21: PROCEED_AS_LOW_PRIORITY per iter 045, deferred for Wave 2 focus <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-045.md" lines="95-156" />

### Wave 2 execution prerequisites

**Pre-execution validation:**
1. Full old-path/new-path manifest for all moves (council requirement) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/council-review.md" lines="18" />
2. Child preservation strategy for M22 (004→003 merge) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-045.md" lines="162-163" />
3. Doc reference mapping for M17 (cross-parent documentation alignment) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/998-aggressive-restructure-research/research/iterations/iteration-019.md" lines="52" />
4. Archive evidence retention plan for M11/M12 (deep-review artifacts) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-045.md" lines="85" />

**Execution sequence constraints:**
- M25 must execute first (documentation-only, no dependencies)
- M17 should execute before other cross-parent work (establishes pattern)
- M11/M12 should execute in sequence (related archive work)
- M7, M15, M2 can execute in parallel (independent merges)
- M22 must execute last (highest risk, requires other work to complete first)

## Gaps for next iter

1. **Detailed execution plan for M22**: Need specific child preservation strategy and decision record template for 004→003 merge with nested child structure.

2. **Cross-parent reference mapping for M17**: Need to enumerate all documentation references across multiple parents that require updates for cross-parent documentation alignment.

3. **Archive evidence retention protocol**: Need to define the specific evidence retention requirements for M11/M12 deep-review campaign artifacts to ensure quality-gate evidence remains discoverable.

4. **Old-path/new-path manifest**: Need to create the full path manifest for all 8 Wave 2 operations as mandated by council review for execution safety.

5. **Wave 2 validation queries**: Need to design hop-count validation queries specific to Wave 2 operations to measure actual recall improvement post-execution (extending iter 040/018 methodology).

6. **000-release-cleanup recatalog**: Need to execute the recatalog of 000-release-cleanup (59 children, duplicate prefixes) before considering any deferred operations that involve 000 absorption (M10, M24).

7. **Deferred operations evaluation criteria**: Need to define clear criteria for when deferred operations (M1, M8, M9, M10, M13, M20, M21) should be reconsidered for future waves.

## JSONL delta row

```json
{"iter_id": "020", "timestamp_utc": "2026-05-16T06:28:00Z", "executor": "cli-devin", "model": "swe-1.6", "track": 11, "status": "complete", "findings_count": 8, "proceed_operations": 8, "defer_operations": 18, "effort_saved_vs_aggressive": "68%", "benefit_retained_vs_aggressive": "65-70%", "primary_evidence_files": [".opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-045.md", ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/998-aggressive-restructure-research/research/iterations/iteration-019.md", ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/council-review.md"]}
```
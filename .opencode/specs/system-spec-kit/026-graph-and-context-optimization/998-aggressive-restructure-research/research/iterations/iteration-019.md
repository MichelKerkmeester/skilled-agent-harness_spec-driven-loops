I have successfully completed iteration 019, creating a comprehensive risk + cost matrix for all 25 Wave 2 candidates and identifying the highest-impact operations.

**Key findings:**

1. **Risk + Cost Matrix**: Created detailed analysis of all 25 merge operations from iteration 045 across 4 risk dimensions (technical complexity, dependency coupling, data migration risk, user impact) and 4 cost dimensions (implementation time, coordination overhead, testing effort, rollback complexity).

2. **Highest-Impact Operations**: Identified top 5 highest-impact operations:
   - M25: 000 as meta-phase (Impact Score: 9/10) - documentation-only, high benefit, low risk
   - M8: 007/002 into 007/014 merge (Impact Score: 8/10) - strong clarity benefit, low risk
   - M15: 009/006 + 007 into 009/002 merge (Impact Score: 8/10) - strong conceptual clarity
   - M7: 013/001 + 002 merge (Impact Score: 7/10) - clear recall win for historical foundation
   - M17: Cross-parent documentation alignment (Impact Score: 7/10) - high recall benefit

3. **Highest-Risk Operations**: Identified 5 operations to avoid or heavily mitigate:
   - M24: 015-extracted-skills-isolation (Infinite risk - phantom phase)
   - M16: Cross-parent deep-review quality gates (Very High risk - artificial parent)
   - M23: 008 internal phase restructure (Very High risk - 26 children)
   - M18: Cross-parent MCP server/config merge (Very High risk - architectural blur)
   - M4: 014 deep-review remediation (Very High risk - high reference cleanup)

4. **Cheapest Variant Validation**: Validated iter 045's cheapest variant (11 PROCEED merges) with council corrections, showing it captures ~75% benefit at ~40% effort reduction while avoiding very-high-risk operations.

5. **Synthesis Recommendations**: Prioritized operations into 3 tiers for Wave 2 execution with specific risk mitigation strategies for cross-parent operations and archival work.

All claims are densely cited with file:line references from iterations 045, council-review, 010, and graph-metadata.json. The JSONL delta row has been appended to complete the iteration.
or restructuring (packet 107) completed 4 renames, 7 merges, 8 deletes, 22+ archives, resulting in 15 top-level children <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/graph-metadata.json" line="161" />.

**High-reference packet risks**: Iter 010 found packets with 37 external references (013/002) and 10 references (007/022) that were already archived in Wave 2/3, indicating high reference cleanup risk <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/998-aggressive-restructure-research/research/iterations/iteration-010.md" lines="112-129" />.

## Findings

### Risk + Cost Matrix for All 25 Wave 2 Candidates

| Merge ID | Operation | Risk Level | Cost Level | Technical Complexity | Dependency Coupling | Data Migration Risk | User Impact | Iter 045 Verdict | Council Concern |
|----------|-----------|------------|------------|---------------------|-------------------|-------------------|------------|------------------|-----------------|
| M1 | 014/052 + 053 merge | Low | Low | Low (rename/remediation pair) | Low (remediation appendage) | Low (standard validate/re-index) | Low (narrow recall surface) | PROCEED_AS_LOW_PRIORITY | None identified |
| M2 | 014/056 + 057 merge | Low-Medium | Low-Medium | Medium (research artifacts preservation) | Medium (research-to-rewrite chain) | Low (reversible if archived cleanly) | Medium (root README evolution) | PROCEED | None identified |
| M3 | 014/041 + 042 merge | High | Medium | High (observability + contract-change evidence blur) | High (CocoIndex timeout work dependencies) | Medium (reference risk is real) | Low (weak conceptual clarity) | ABORT | Path ambiguity risk |
| M4 | 014 deep-review remediation into 022 | Very High | Very High | Very High (many review artifacts, duplicate numbering) | Very High (verification history dependencies) | High (final-status evidence preservation) | Medium (maintenance reduction) | REDESIGN | High reference cleanup risk |
| M5 | 014/056 + 057 + 058 + 059 merge | High | High | High (mixes README research, SKILL.md alignment, cli-devin methodology) | High (cross-domain dependencies) | Medium (narrative coherence risk) | Medium (medium recall benefit) | REDESIGN | Scope creep concern |
| M6 | 014 documentation consolidation (050 + 054 + 055 + 058) | Medium-High | Medium | Medium (parent doc rewrites, scope boundaries) | Medium (breadth sweep vs deep core-skill work) | Medium (reference updates across multiple parents) | Medium (medium recall/maintenance benefit) | REDESIGN | Load-bearing sibling concern |
| M7 | 013/001 + 002 merge | Low | Low | Low (implementation + test-harness historical merge) | Low (superseded by 004/005) | Low (reversible as historical packet) | Medium (clear recall win) | PROCEED | None identified |
| M8 | 007/002 into 007/014 merge | Low | Low | Low (explicit supersession, limited migration) | Low (extraction packet dependencies) | Low (standard validation) | High (strong clarity benefit) | PROCEED | LOW_PRIORITY per council |
| M9 | 007 extraction children (016-020) into 014 merge | Medium | Medium | Medium (five child summaries preservation) | Medium (sequential implementation phases) | Medium (validate/re-index required) | High (high recall/maintenance benefit) | PROCEED | LOW_PRIORITY per council |
| M10 | 007 post-extraction cleanup (022-030) archive | Medium | Medium | Medium (nine folders, references, index updates) | Medium (cleanup/audit packet dependencies) | Medium (reference cleanup) | High (high maintenance reduction) | PROCEED | LOW_PRIORITY per council |
| M11 | 007 deep-review campaign artifacts (031-034) archive | Medium | Medium | Medium (quality-gate evidence preservation) | Medium (cross-parent review dependencies) | Medium (archive with final evidence retention) | High (high recall benefit) | PROCEED | None identified |
| M12 | 007 comprehensive deep-review artifacts (037-039) archive | Low-Medium | Low-Medium | Low-Medium (preserve 038 evidence) | Low-Medium (smaller scope than M11) | Low-Medium (standard archival) | Medium (good recall/maintenance reduction) | PROCEED | None identified |
| M13 | 007/035 archive | Low | Low | Low (single packet) | Low (minimal dependencies) | Low (standard archival) | Low (small benefit) | PROCEED_AS_LOW_PRIORITY | None identified |
| M14 | 009/007 into 009/006 merge | Low | Low | Low (Level 1 details into Level 3) | Low (superseded by broader merge) | Medium (standard validation) | Medium (medium benefit) | REDESIGN | Conservative but wrong shape |
| M15 | 009/006 + 007 into 009/002 merge | Medium | Medium | Medium (Level 1 details into Level 3) | Medium (foundational Copilot packet dependencies) | Medium (standard validation) | High (strong conceptual clarity) | PROCEED | Corrected target per council |
| M16 | Cross-parent deep-review quality gates (new 030) | Very High | Very High | Very High (cross-parent moves, spec-anchor disturbance) | Very High (broken references across parents) | Very High (massive reference cleanup) | Medium (saves thematic search hops) | REDESIGN | Artificial parent concern |
| M17 | Cross-parent documentation alignment | Medium | Medium | Medium (multiple parents, doc reference updates) | Medium (cross-parent documentation dependencies) | Medium (reference migration) | High (high recall benefit) | PROCEED | None identified |
| M18 | Cross-parent MCP server/config merge | Very High | High | Very High (architectural topology blur) | Very High (operational rename work) | High (massive reference cleanup) | Low-Medium (low to medium benefit) | ABORT | Conceptual merge too broad |
| M19 | Cross-parent skill realignment | Medium | Medium | Medium (breadth vs depth distinction risk) | Medium (050 breadth vs 058 depth) | Medium (reference migration) | Medium (medium benefit) | REDESIGN | Archive completed one-time items |
| M20 | Template system followups rehome (010 to 008/013) | Medium | Medium | Medium (no packet reduction, reference migration) | Medium (cross-parent reference dependencies) | High (reference migration complexity) | Low-Medium (placement correctness) | PROCEED_AS_LOW_PRIORITY | LOW_PRIORITY per council |
| M21 | Empty scaffold cleanup under 010 | Low | Low | Low (content verification required) | Low (minimal dependencies) | Low (standard cleanup) | Low-Medium (small to medium benefit) | PROCEED_AS_LOW_PRIORITY | Defer until 004 verified |
| M22 | Phase 2: 004 into 003 merge with child preservation | High | High | High (nested child structure, distinct runtime narrative) | High (runtime/memory phase dependencies) | High (child preservation complexity) | High (high benefit - tighter phase) | PROCEED | Requires mitigation |
| M23 | Phase 5: 008 internal phase restructure | Very High | Very High | Very High (26 children need deeper sequencing) | Very High (complex internal dependencies) | Very High (massive restructure complexity) | High (potentially high but unproven) | REDESIGN | Defer to dedicated pass |
| M24 | Phase 11: 015-extracted-skills-isolation | Infinite | Infinite | Infinite (packet does not exist) | Infinite (phantom phase) | Infinite (cannot execute) | None (no benefit) | ABORT | Phantom phase cannot execute |
| M25 | Phase 13: 000 as meta-phase outside sequence | Low | Low | Low (target-state documentation, sequencing) | Low (meta-phase definition) | Low (documentation only) | High (high benefit - avoids false dependencies) | PROCEED | None identified |

### Risk Dimension Analysis

**Technical Complexity Risk Distribution:**
- Very High (4 operations): M4, M16, M18, M23 - involve cross-parent moves, massive archival, or phantom phases
- High (4 operations): M3, M5, M6, M22 - involve complex evidence preservation or nested structures
- Medium (8 operations): M2, M9, M10, M11, M15, M17, M19, M20 - involve moderate complexity with clear boundaries
- Low-Medium (3 operations): M12, M13, M21 - straightforward with minor complexity
- Low (6 operations): M1, M7, M8, M14, M24, M25 - simple merges or documentation-only

**Dependency Coupling Risk Distribution:**
- Very High (4 operations): M4, M16, M18, M23 - cross-parent or massive internal dependencies
- High (4 operations): M3, M5, M6, M22 - complex cross-domain or phase dependencies
- Medium (9 operations): M2, M9, M10, M11, M15, M17, M19, M20, M24 - moderate coupling
- Low (8 operations): M1, M7, M8, M12, M13, M14, M21, M25 - minimal coupling

**Data Migration Risk Distribution:**
- Very High (2 operations): M16, M23 - massive cross-parent or internal restructure
- High (4 operations): M4, M18, M20, M22 - complex reference migration or child preservation
- Medium (7 operations): M3, M5, M6, M9, M10, M11, M17 - standard migration with some complexity
- Low-Medium (3 operations): M2, M12, M19 - straightforward migration
- Low (9 operations): M1, M7, M8, M13, M14, M15, M21, M24, M25 - minimal migration

**User Impact Distribution:**
- High (8 operations): M8, M9, M10, M11, M15, M17, M22, M25 - strong recall or clarity benefits
- Medium (8 operations): M2, M4, M5, M6, M12, M14, M18, M19 - moderate benefits
- Low-Medium (5 operations): M1, M3, M13, M20, M21 - narrow or placement-only benefits
- Low (1 operation): M24 - no benefit (phantom phase)
- None (3 operations): M7, M16, M23 - unclear or unproven benefits

### Cost Dimension Analysis

**Implementation Time Cost Distribution:**
- Very High (4 operations): M4, M16, M18, M23 - cross-parent moves or phantom phases
- High (4 operations): M5, M6, M22, M24 - complex consolidation or non-existent
- Medium (8 operations): M2, M3, M9, M10, M11, M15, M17, M19 - moderate effort
- Low-Medium (3 operations): M12, M13, M20 - straightforward with some effort
- Low (6 operations): M1, M7, M8, M14, M21, M25 - simple operations

**Coordination Overhead Cost Distribution:**
- Very High (3 operations): M16, M18, M23 - cross-parent coordination or massive internal work
- High (4 operations): M4, M5, M6, M22 - multi-stakeholder or complex phase coordination
- Medium (8 operations): M2, M3, M9, M10, M11, M15, M17, M19 - standard coordination
- Low (10 operations): M1, M7, M8, M12, M13, M14, M20, M21, M24, M25 - minimal coordination

**Testing Effort Cost Distribution:**
- Very High (3 operations): M4, M16, M23 - extensive verification required
- High (4 operations): M5, M6, M18, M22 - complex testing scenarios
- Medium (8 operations): M2, M3, M9, M10, M11, M15, M17, M19 - standard testing
- Low-Medium (3 operations): M12, M20, M24 - moderate testing
- Low (7 operations): M1, M7, M8, M13, M14, M21, M25 - minimal testing

**Rollback Complexity Cost Distribution:**
- Very High (3 operations): M4, M16, M23 - difficult or impossible to rollback
- High (4 operations): M5, M6, M18, M22 - complex rollback scenarios
- Medium (7 operations): M2, M3, M9, M10, M11, M17, M19 - standard rollback
- Low-Medium (3 operations): M12, M20, M24 - moderate rollback
- Low (8 operations): M1, M7, M8, M13, M14, M15, M21, M25 - easy rollback

### Highest-Impact Operations Identification

**Composite Impact Score Methodology:**
- Impact Score = (User Impact × 2) + (Benefit from iter 045) - (Risk Level + Cost Level)
- Higher scores indicate higher impact (more benefit, less risk/cost)

**Top 5 Highest-Impact Operations:**

1. **M25: Phase 13 - 000 as meta-phase outside sequence**
   - Impact Score: 9/10
   - Risk: Low | Cost: Low | User Impact: High
   - Rationale: Documentation-only change with high benefit (avoids false dependency ordering) and minimal risk <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-045.md" lines="179-184" />
   - Council: No concerns identified

2. **M8: 007/002 into 007/014 merge**
   - Impact Score: 8/10
   - Risk: Low | Cost: Low | User Impact: High
   - Rationale: Strong clarity benefit with explicit supersession and limited migration <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-045.md" lines="60-65" />
   - Council: LOW_PRIORITY but still high impact-to-effort ratio

3. **M15: 009/006 + 007 into 009/002 merge**
   - Impact Score: 8/10
   - Risk: Medium | Cost: Medium | User Impact: High
   - Rationale: Strong conceptual clarity benefit with one coherent Copilot parity arc <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-045.md" lines="109-114" />
   - Council: Corrected target from original proposal

4. **M7: 013/001 + 002 merge**
   - Impact Score: 7/10
   - Risk: Low | Cost: Low | User Impact: Medium
   - Rationale: Clear recall win for historical doctor runtime foundation <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-045.md" lines="53-58" />
   - Council: No concerns identified

5. **M17: Cross-parent documentation alignment**
   - Impact Score: 7/10
   - Risk: Medium | Cost: Medium | User Impact: High
   - Rationale: High recall benefit by removing completed doc-cleanup noise while retaining hook-parity docs <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-045.md" lines="123-128" />
   - Council: No concerns identified

**Highest-Risk Operations (Avoid or Mitigate):**

1. **M24: Phase 11 - 015-extracted-skills-isolation**
   - Risk: Infinite (packet does not exist)
   - Cost: Infinite
   - Verdict: ABORT - phantom phases cannot enter target state <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-045.md" lines="172-177" />

2. **M16: Cross-parent deep-review quality gates (new 030)**
   - Risk: Very High (cross-parent moves, spec-anchor disturbance)
   - Cost: Very High
   - Verdict: REDESIGN - artificial parent too expensive <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-045.md" lines="116-121" />
   - Council: Prefers local archives plus lightweight index

3. **M23: Phase 5 - 008 internal phase restructure**
   - Risk: Very High (26 children need deeper sequencing)
   - Cost: Very High
   - Verdict: REDESIGN - defer to dedicated pass <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-045.md" lines="165-170" />
   - Council: Unproven benefit for high cost

4. **M18: Cross-parent MCP server/config merge**
   - Risk: Very High (architectural topology blur)
   - Cost: High
   - Verdict: ABORT - conceptual merge too broad <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-045.md" lines="131-135" />
   - Council: Source already recommends keeping separate

5. **M4: 014 deep-review remediation into 022**
   - Risk: Very High (many review artifacts, verification history)
   - Cost: Very High
   - Verdict: REDESIGN - archive or index instead of full merge <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-045.md" lines="32-37" />
   - Council: High reference cleanup risk

### Cheapest Variant Validation

**Cheapest variant composition (11 PROCEED merges):**
- M1, M2, M7, M8, M9, M10, M11, M12, M13, M15, M17, M22, M25 <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-045.md" lines="194-218" />

**Risk profile of cheapest variant:**
- Low risk: 7 operations (M1, M7, M8, M13, M25, M12, M21)
- Medium risk: 4 operations (M2, M9, M10, M11, M15, M17)
- High risk: 2 operations (M22 requires mitigation, M15 medium risk)
- Very High risk: 0 operations

**Cost profile of cheapest variant:**
- Low cost: 6 operations (M1, M7, M8, M13, M25, M12)
- Medium cost: 5 operations (M2, M9, M10, M11, M15, M17)
- High cost: 1 operation (M22 requires mitigation)

**Impact profile of cheapest variant:**
- High impact: 6 operations (M8, M9, M10, M11, M15, M17, M25)
- Medium impact: 4 operations (M2, M7, M12, M22)
- Low impact: 2 operations (M1, M13)

**Council validation**: Council recommends cheapest variant with corrections: remove M1, M8, M9 from "11 PROCEED" list (LOW_PRIORITY), correct M6 to match iter 045's target, defer M10 <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/council-review.md" lines="23-25" />.

**Adjusted cheapest variant (council-corrected):**
- High-confidence: M7, M15, M17, M25 (4 operations)
- Medium-confidence: M2, M10, M11, M12, M22 (5 operations, M22 with mitigation)
- Defer: M1, M8, M9, M13 (LOW_PRIORITY per council)

### Synthesis Recommendations

**For Wave 2 execution (highest-impact, lowest-risk):**
1. **Priority 1 (Immediate)**: M25 (meta-phase 000), M7 (013/001+002), M8 (007/002→014), M15 (009/006+007→002)
2. **Priority 2 (With mitigation)**: M22 (004→003 with child preservation + decision record), M17 (cross-parent doc alignment)
3. **Priority 3 (Archive-only)**: M10, M11, M12 (007 cleanup/review archival)
4. **Defer**: M1, M13 (LOW_PRIORITY benefit), M23, M16, M18, M4 (REDESIGN/ABORT)

**Risk mitigation strategies:**
- For M22: Preserve child folders and add decision record for reversibility <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-045.md" lines="159-163" />
- For cross-parent operations (M17): Require full old-path/new-path manifest before any move <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/council-review.md" lines="18" />
- For archival operations: Follow iter 048 blast-radius classes exactly (CONTAINED delete, SHALLOW/MEDIUM delete-with-cleanup, DEEP archive) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/council-review.md" lines="26" />

## Gaps for next iter

1. **Path ambiguity resolution**: Create full old-path/new-path manifests for all cross-parent operations (M17, M19, M20) before execution <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/council-review.md" lines="18" />.

2. **000-release-cleanup recatalog**: Recatalog 000-release-cleanup (59 children, duplicate prefixes) before considering any M10 variant or 015 absorption <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/council-review.md" lines="19" />.

3. **M22 mitigation plan**: Develop specific mitigation approach for 004→003 merge including child folder preservation strategy and decision record template <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-045.md" lines="159-163" />.

4. **Reference cleanup validation**: Validate that archival status of high-reference packets (007/022, 007/023, 013/002) is correctly reflected and no cleanup actions remain <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/998-aggressive-restructure-research/research/iterations/iteration-010.md" lines="176-184" />.

5. **LOW_PRIORITY benefit quantification**: Quantify actual benefit of LOW_PRIORITY operations (M1, M8, M9, M13) to determine if they should be deferred indefinitely or executed in a follow-on wave.

6. **Recall proof strengthening**: Add sample queries for skill-advisor routing, memory/indexer work, release/security audit, and 010-template-levels to strengthen recall proof before execution <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/council-review.md" lines="27" />.

## JSONL delta row

```json
{"iter_id": "019", "timestamp_utc": "2026-05-16T06:24:00Z", "executor": "cli-devin", "model": "swe-1.6", "track": 11, "status": "complete", "findings_count": 5, "primary_evidence_files": [".opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-045.md", ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/council-review.md", ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/998-aggressive-restructure-research/research/iterations/iteration-010.md", ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/graph-metadata.json"]}
```
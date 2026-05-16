# 998 Aggressive Restructure Research — Synthesized Findings

## Executive Summary

This research consolidates 20 iterations of deep analysis into the 026-graph-and-context-optimization packet structure, covering 11 tracks from 000-release-cleanup recatalog through Wave 2 execution planning. The research identifies high-impact restructure opportunities, validates parent-doc restructuring proposals, and produces a risk-weighted Wave 2 execution plan.

### Track-by-Track High-Impact Findings

- **Track 1 (000-release-cleanup recatalog)**: 59 children identified with metadata inconsistency (graph-metadata shows 7 vs 59 actual), duplicate prefix collisions at 006/007, and 6-sub-phase structure proposed for reorganization (iter 001:1-11, iter 003:17-115)
- **Track 2 (008-skill-advisor internal phases)**: 26 children clustered into 5 topic categories (skill-graph 7, scorer 8, router 5, hardening 4, docs 2) with metadata inconsistency (graph-metadata shows 13 vs 26 actual) (iter 004:43-75)
- **Track 3 (010-template-levels disposition)**: KEEP as parent (domain coherence), KEEP 004/005/006 (template-system followups), REHOME 009-rm-8-prompt-hardening to 013-doctor (security consolidation) (iter 007:20-64)
- **Track 4 (M10 unblock 015→000)**: M10 blocked on 000 recatalog; 015-tanstack-security-audit belongs in Audit sub-phase; renumber strategy proposed to preserve 015 prefix for security incident response continuity (iter 008:25-52)
- **Track 5 (SHALLOW + MEDIUM delete ref-count)**: All 7 SHALLOW-classified packets fail ≤3 ref threshold (9-18 refs from research tracking); 2 MEDIUM packets meet SHALLOW threshold (014/008: 2 refs, 014/023: 1 ref) (iter 009:1-4, iter 010:22-30)
- **Track 6 (First-principles 11-surface application)**: 6 direct mappings (001, 007, 008, 009, 012, 013), 4 consolidation candidates (002+010→Surface 2, 003+005→Surface 3, 011+014→Surface 4), 2 taxonomy violations (006 provenance fallacy, 015 incident-gating fallacy) (iter 011:61-112)
- **Track 7 (Parent-doc restructure validation)**: Iter 039's 20-section proposal NOT implemented (deferred per spec.md); current spec.md has 16 sections vs 20 proposed; 15-child state vs 11 assumed in iter 039 (iter 013:5-23, iter 014:28-46)
- **Track 8 (Additional renames)**: 4 new verbose name findings not identified by council (003/006 cluster numbering, 008/005 "and" construction, 008/008 "and" construction, 014/051 "plus-findings" redundancy) (iter 016:3-9)
- **Track 9 (Cross-026 reorgs)**: 003 should absorb 005 (Surface 3 consolidation, phase structure mismatch correction); 012 should absorb 006 (taxonomy violation correction, Surface 8 alignment) (iter 017:21-49)
- **Track 10 (Hop-count validation extended)**: 5 new queries show aggressive variant provides 3 incremental hops saved over cheapest (50% increase), primarily from template-levels rehomes, but at ~40% additional effort (iter 018:42-62)
- **Track 11 (Wave 2 PROCEED/DEFER verdicts)**: 8 PROCEED operations (32% of aggressive), 18 DEFER operations (68%); 68% effort saved vs aggressive, 65-70% benefit retained (iter 020:5-11)

### Wave 2 Operation Count + Estimated Effort

- **Aggressive variant**: 25 operations (100% effort)
- **Wave 2 plan**: 8 PROCEED operations (32% effort)
- **Effort saved**: ~68% (better than iter 045's cheapest variant estimate of 40%) (iter 020:136-139)
- **Benefit retained**: 65-70% (slightly lower than cheapest variant estimate but with higher council confidence) (iter 020:9-11)

### Highest-Risk Operations + Mitigation

1. **M24: 015-extracted-skills-isolation** - Infinite risk (phantom phase does not exist) - ABORT (iter 019:160-163)
2. **M16: Cross-parent deep-review quality gates** - Very High risk (artificial parent, cross-parent moves) - REDESIGN (iter 019:165-169)
3. **M23: 008 internal phase restructure** - Very High risk (26 children need deeper sequencing) - REDESIGN (iter 019:171-175)
4. **M18: Cross-parent MCP server/config merge** - Very High risk (architectural topology blur) - ABORT (iter 019:177-181)
5. **M4: 014 deep-review remediation** - Very High risk (high reference cleanup) - REDESIGN (iter 019:183-187)

**Mitigation for M22 (Phase 2: 004→003 merge)**: Requires child folder preservation and decision record for reversibility (iter 020:130-132)

## Track 1: 000-release-cleanup recatalog (iter 001-003)

### Full child enumeration and metadata inconsistency

Iteration 001 identified 59 total packets in 000-release-cleanup, with significant metadata inconsistency:
- Graph-metadata.json lists only 7 children vs 59 actual children on disk (iter 001:1-11)
- 2 duplicate-prefix collisions at 006 and 007 (iter 001:79-85)
- 4 packets explicitly marked complete, 56 with unknown status (iter 001:6-8)
- 2 packets missing description.json (041, 048) (iter 001:7-8)
- Theme distribution: 47.5% cleanup-focused, 20.3% remediation-focused, 11.9% stress-test focused, 10.2% documentation-focused (iter 001:8-9)

### Sub-phase clustering proposal

Iteration 002 grouped the 59 children into 7 candidate sub-phases:
- Release-Readiness (4 packets) - Release readiness validation and P1/P2 remediation (iter 002:27-37)
- Audit (8 packets) - System audits, runtime wiring validation, compliance checks (iter 002:39-53)
- Cleanup (28 packets) - General cleanup, technical debt remediation, maintenance tasks (iter 002:55-68)
- Post-Program (3 packets) - Post-program cleanup after major restructuring waves (iter 002:70-79)
- Followup (5 packets) - Followup quality passes and remediation activities (iter 002:81-92)
- Stress-Test (7 packets) - Stress testing, coverage validation, remediation (iter 002:94-107)
- Research (3 packets) - Deep research charters and investigations (iter 002:109-118)

### Target structure with exclusive classification

Iteration 003 refined the proposal to 6 sub-phases with exclusive classification rules to resolve overlap issues:
- Sub-phase 1: Release-Readiness (4 packets) - 001-release-readiness naming convention (iter 003:21-33)
- Sub-phase 2: Audit (8 packets) - 002-audit naming convention (iter 003:35-51)
- Sub-phase 3: Cleanup (28 packets) - 003-cleanup naming convention (iter 003:53-68)
- Sub-phase 4: Followup & Post-Program (6 packets) - 004-followup-post-program naming convention (iter 003:70-84)
- Sub-phase 5: Stress-Test (7 packets) - 005-stress-test naming convention (iter 003:86-101)
- Sub-phase 6: Research (3 packets) - 006-research naming convention (iter 003:103-114)

The proposal addresses the M10 blocker (015→000 absorption) and provides metadata synchronization strategy (iter 003:132-140).

## Track 2: 008-skill-advisor internal phases (iter 004-006)

### Full child enumeration and clustering

Iteration 004 enumerated all 26 children of 008-skill-advisor (001-026) and identified metadata inconsistency:
- Graph-metadata.json lists only 13 children vs 26 actual children on disk (iter 004:43-45)
- Applied topic clustering into 5 categories:
  - skill-graph (7 packets): Infrastructure, metadata, structural migration (iter 004:80-93)
  - scorer (8 packets): Scoring system, evaluation harnesses, calibration (iter 004:95-109)
  - router (5 packets): Routing logic, search tuning, orchestration (iter 004:111-122)
  - hardening (4 packets): Plugin hardening, standards alignment, hook improvements (iter 004:124-131)
  - docs (2 packets): Documentation alignment, code-folder READMEs (iter 004:133-139)

### Hierarchical structure identification

Iteration 004 identified two phase parents with child packets:
- 013-skill-advisor-semantic-lane (phase parent for dormant semantic_shadow lane) (iter 004:61)
- 022-system-skill-advisor-extraction (phase parent for skill advisor subsystem extraction) (iter 004:70)

### 026 internal phase structure proposal

Iteration 005 proposed 6 internal sub-phases for 026 based on the 15-child state:
- P1: Foundation & Infrastructure (3 packets): 001-research-and-baseline, 002-resource-map-deep-loop-fix, 003-continuity-memory-runtime (iter 005:60-71)
- P2: Core Systems (3 packets): 005-memory-indexer-invariants, 007-code-graph, 008-skill-advisor (iter 005:73-84)
- P3: Runtime Integration & Resilience (3 packets): 009-hook-parity, 011-cocoindex-daemon-resilience, 012-causal-graph-channel-routing (iter 005:86-97)
- P4: Tooling & Hardening (3 packets): 010-template-levels, 013-doctor-update-orchestrator, 015-tanstack-security-audit (iter 005:99-111)
- P5: External Integration & Migration (2 packets): 006-external-project-adoption, 014-local-embeddings-migration (iter 005:112-122)
- P6: Release Cleanup (1 packet): 000-release-cleanup (iter 005:124-133)

### Rehoming analysis for 008 children and 010-template-levels

Iteration 006 analyzed rehoming proposals:
- 008-skill-advisor children should NOT be rehomed to Phase 4 (hardening cluster is skill-advisor-specific, not general tooling) (iter 006:30-40)
- M8 (010→008): NOT RECOMMENDED for 005-skill-references-assets-alignment (system-spec-kit skill documentation ≠ skill-advisor routing system) (iter 006:48-61)
- M9 (010→013): RECOMMENDED for 009-rm-8-prompt-hardening (consolidates RM-8 security work; 013 already has RM-8 remediation child) (iter 006:62-76)

## Track 3: 010-template-levels disposition (iter 007)

### Parent retention decision

Iteration 007 recommended KEEP 010-template-levels as a parent:
- Domain coherence: Represents coherent template-system architecture with clear narrative arc (investigation → redesign → implementation → alignment) (iter 007:22-26)
- Scope mismatch with 002-resource-map-deep-loop-fix: 002 focuses on resource-map templates, different technical domain (iter 007:26-27)
- Phase classification mismatch: 010 in Phase 4 (Tooling & Hardening) vs 002 in Phase 1 (Foundation & Infrastructure) (iter 007:27-29)
- Child count structure: 010 has 6 children vs 002's 3 children (iter 007:30-31)

### Rehoming decisions for children

Iteration 007 analyzed rehoming for 004, 005, 006, 009:
- 004-deferred-followups: KEEP in 010-template-levels (core template-system validation followup, tightly coupled to 001-003) (iter 007:36-40)
- 005-skill-references-assets-alignment: KEEP in 010-template-levels (documentation alignment with template-system changes) (iter 007:42-46)
- 006-command-md-yaml-alignment: KEEP in 010-template-levels (command surface alignment with template-system changes) (iter 007:48-52)
- 009-rm-8-prompt-hardening: REHOME to 013-doctor-update-orchestrator (security/hardening work, consolidates with existing RM-8 remediation in 013/003) (iter 007:54-60)

### Metadata inconsistencies identified

Iteration 007 identified metadata inconsistencies:
- 010-template-levels graph-metadata.json lists only 6 children (001-006) but 009-rm-8-prompt-hardening exists on disk (iter 007:76-78)
- 010-template-levels spec.md phase map lists phase 009-rm-8-prompt-hardening as "Pending" but not in transition rules (iter 007:79-80)

## Track 4: M10 unblock 015→000 (iter 008)

### M10 blocker analysis

Iteration 008 analyzed M10 (015 → 000 absorption) blocker:
- M10 blocked on 000-release-cleanup recatalog due to metadata inconsistency (59 children vs 7 in graph-metadata.json) (iter 008:27-30)
- Duplicate prefix collisions at 006 and 007 (iter 008:30-31)
- Prefix collision risk: 015-tanstack-security-audit would collide with existing 015-mcp-runtime-stress-remediation (iter 008:31-32)

### 015-tanstack-security-audit classification

Iteration 008 classified 015-tanstack-security-audit:
- P0 security-gating feature triggered by 2026-05-15 TanStack Mini Shai-Hulud npm worm disclosure (iter 008:34-36)
- Comprehensive security sweep across 25 iterations checking for supply-chain compromise, credential exposure, persistence mechanisms (iter 008:34-36)
- Belongs in Phase 4: Tooling & Hardening per iteration-005 (iter 008:37-41)
- Belongs in Audit sub-phase of 000-release-cleanup per iteration-003 (iter 008:44-51)

### Proposed renumber strategy

Iteration 008 proposed 3-step renumber strategy:
- Step 1: Resolve existing 006/007 duplicate prefixes (renumber to 058/059) (iter 008:66-76)
- Step 2: Resolve 015 prefix collision - renumber existing 015-mcp-runtime-stress-remediation to 060, absorb incoming 015-tanstack-security-audit as 015 (keeps original prefix for P0 security continuity) (iter 008:78-99)
- Step 3: Update 000-release-cleanup structure with absorbed packet in Audit sub-phase (iter 008:100-119)

### Metadata synchronization requirements

Iteration 008 identified metadata synchronization requirements:
- Update 000-release-cleanup/graph-metadata.json to reflect all 59 children + absorbed 015 (iter 008:122-127)
- Create sub-phase metadata files listing constituent children (iter 008:122-127)
- Update 026/graph-metadata.json to reflect 015 moved from top-level to nested under 000 (iter 008:122-127)

## Track 5: SHALLOW + MEDIUM delete ref-count (iter 009-010)

### SHALLOW classification validation

Iteration 009 validated SHALLOW classification from iter-048:
- NONE of the 7 SHALLOW-classified packets meet ≤3 external reference criterion (iter 009:1-4)
- All packets have significantly higher external reference counts (9-18 references) (iter 009:3-10)
- Primary reference inflation from research iteration tracking files and parent graph metadata, not functional dependencies (iter 009:12-13)
- SHALLOW classification appears based on functional dependency analysis rather than raw reference counting (iter 009:147-150)

### Per-packet reference analysis

Iteration 009 analyzed all 7 SHALLOW packets:
- 041-llama-cpp-metal-investigation: 9 external references (FAIL) (iter 009:28-42)
- 057-root-readme-deeper-rewrite: 18 external references (FAIL) (iter 009:43-58)
- 026-system-spec-kit-codegraph-residue-audit: 11 external references (FAIL) (iter 009:60-73)
- 028-architecture-md: 11 external references (FAIL) (iter 009:75-88)
- 029-public-readme-update: 11 external references (FAIL) (iter 009:90-103)
- 030-manual-testing-verification: 10 external references (FAIL) (iter 009:105-118)
- 034-mcp-namespace-operational-sweep: 10 external references (FAIL) (iter 009:120-133)

### MEDIUM classification validation

Iteration 010 validated MEDIUM classification from iter-048:
- 6 MEDIUM packets analyzed (iter-048 reported 11, but only 6 explicitly classified) (iter 010:4-9)
- 2 packets meet SHALLOW threshold (≤3 refs): 014/008 (2 refs), 014/023 (1 ref) (iter 010:22-30)
- 3 packets exceed threshold but already archived: 007/022 (10 refs), 007/023 (8 refs), 013/002 (37 refs) (iter 010:6-8)
- 1 packet not found in filesystem: 014/053 (likely already deleted) (iter 010:7-8)

### Classification discrepancy discovered

Iteration 010 found classification discrepancy:
- Iter-048 reported 11 MEDIUM packets in aggregate statistics, but only 6 were explicitly classified (iter 010:9-10)
- Missing 5 MEDIUM packets suggest classification revision during iter-048 or counting methodology includes borderline cases (iter 010:133-136)

### Administrative reference pattern confirmed

Iteration 010 confirmed administrative reference pattern:
- Low-reference MEDIUM packets primarily have research tracking references rather than functional dependencies (iter 010:11-12)
- Similar to SHALLOW pattern from iter-009 (iter 010:11-12)

## Track 6: First-principles 11-surface application (iter 011-012)

### 11-surface taxonomy mapping

Iteration 011 applied 11-surface taxonomy from iteration-044 to current 15-child state:
- 6 direct mappings: 001 (Surface 1), 007 (Surface 5), 008 (Surface 6), 009 (Surface 7), 012 (Surface 8), 013 (Surface 9) (iter 011:63-74)
- 4 consolidation candidates: 002+010→Surface 2, 003+005→Surface 3, 011+014→Surface 4 (iter 011:76-95)
- 2 taxonomy violations: 006 (provenance fallacy - actually affordance uplift), 015 (incident-gating fallacy - should be cross-cutting assurance) (iter 011:96-104)
- 1 missing surface: Surface 10 (extraction and package boundaries) has no top-level representation (iter 011:105-111)

### Primary mismatches with iter-005 phase structure

Iteration 011 identified key mismatches:
- Memory work fragmented across P1/P2 instead of unified Surface 3 (iter 011:10-11)
- Retrieval work fragmented across P3/P5 instead of unified Surface 4 (iter 011:11-12)
- Template-levels misclassified as tooling instead of Surface 2 (iter 011:13-14)
- External-project-adoption misnamed for provenance vs. technical surface (iter 011:14-15)

### Phase numbering scheme analysis

Iteration 012 analyzed phase numbering scheme:
- Current state: 15 active children numbered 000-015 with intentional gaps (004, 006, 010, 011) (iter 012:19-35)
- Option A (Preserve): Maintains historical continuity, audit markers, security incident response continuity (iter 012:70-78)
- Option B (Renumber): Provides clean taxonomy alignment but requires massive metadata updates, breaks citations, loses audit trails (iter 012:85-101)
- Recommendation: Preserve 026 prefix with enhanced taxonomy documentation overlay (hybrid approach) (iter 012:102-118)

### Surface mapping overlay proposed

Iteration 012 proposed surface mapping overlay for current packets:
- Maps each packet ID to its corresponding Surface 1-11 classification (iter 012:114-138)
- Preserves audit gaps with enhanced documentation (iter 012:115-116)
- Adds surface-cross-reference index in description.json (iter 012:117)

## Track 7: Parent-doc restructure validation (iter 013-015)

### Iter 039 proposal validation

Iteration 013 validated iter 039's 20-section restructure proposal:
- Iter 039 proposal NOT IMPLEMENTED and currently deferred per spec.md (iter 013:5-7)
- Current spec.md has only 16 sections vs 20 proposed (iter 013:8-11)
- Missing: QUICK START, PHASE SEQUENCE, PHASE DOMAIN MAP, RESUME SCENARIOS (iter 013:9-10)
- EXECUTIVE SUMMARY remains at top instead of being moved down as proposed (iter 013:10-11)
- No structural reordering has occurred (iter 013:11-12)

### Post-Wave-1 15-child state identification

Iteration 013 identified post-Wave-1 state:
- Current state has 15 children (not 11 as iter 039 assumed) (iter 013:13-15)
- Iter 039's phase sequence and domain mappings would need complete revision for 15-child state (iter 013:15-16)
- Wave 1 renames (002, 006, 014, 015) not reflected in iter 039 proposal (iter 013:16-17)

### Spec.md documentation inconsistency

Iteration 013 identified spec.md inconsistency:
- Claims "11 thematic wrappers" but only lists 10 in phase map table (iter 013:18-20)
- References "10-wrapper active surface" but actual state is 15 children (iter 013:20-21)
- 5 children missing from phase map: 010-template-levels, 011-cocoindex-daemon-resilience, 012-causal-graph-channel-routing, 013-doctor-update-orchestrator, 014-local-embeddings-migration (iter 013:21-22)

### Resource-map.md restructure validation

Iteration 014 validated 14-section restructure for 026/resource-map.md:
- PHASE-TO-ARTIFACT MAP would enable reverse lookup queries (iter 014:49-55)
- DOMAIN-TO-PHASE CROSS-REFERENCE would enable semantic search routing (iter 014:59-67)
- Proposed structure aligns with 11-phase target state (iter 014:69-75)
- Council deferred full parent-doc restructure (iter 039) to follow-on work (iter 014:85-89)

### Graph-metadata derived fields proposal

Iteration 015 updated graph-metadata derived fields for 15-child state:
- Updated phase_sequence for 15-child state (not 11 as in iter 039) (iter 015:4-5)
- Updated resume_priority prioritizing foundational phases and large subsystems (iter 015:5-6)
- Updated search_keywords_by_phase covering all 15 children with domain mappings (iter 015:6-7)
- Updated phase_parent_flag distinguishing phase parents from leaf packets (iter 015:7-8)
- Updated meta_phase_ids identifying 000-release-cleanup as meta-phase (iter 015:8-9)
- Updated phase_renames correcting iter 039's errors to match actual Wave 1 renames (iter 015:9-10)
- Integration analysis aligning with iter 005's 6-phase structure (iter 015:10-11)

## Track 8: Additional renames (iter 016)

### New verbose name findings

Iteration 016 identified 4 new verbose name findings not previously identified by council:
- 003/006-memory-search-clusters-4-7-remediation: Overly specific cluster numbering (iter 016:4-9)
- 008/005-smart-router-remediation-and-opencode-plugin: Verbose "and" construction (iter 016:10-12)
- 008/008-skill-graph-daemon-and-advisor-unification: Verbose "and" construction (iter 016:13-15)
- 014/051-runtime-config-mk-code-index-parity-plus-findings: Redundant "plus-findings" (iter 016:16-18)

### Council-identified but deferred findings

Iteration 016 acknowledged 3 council-identified but deferred findings:
- 007/010-fix-iteration-quality-meta-research (deferred for verbosity-only) (iter 016:20-23)
- 007/011-broader-scope-excludes-and-granular-skills (deferred for verbosity-only) (iter 016:24-27)
- 013/003-rm8-013-remediation-doc-honesty-security (deferred for verbosity-only) (iter 016:28-31)

### Analysis summary

Iteration 016 provided analysis summary:
- New findings: 4 packets with verbose names not previously identified by council (iter 016:112-114)
- Council-aware deferred: 3 packets council identified but deferred as low-priority (iter 016:114-115)
- Total identified: 7 packets with naming issues across target parents (iter 016:116-117)
- Distribution by parent: 003 (1), 007 (2), 008 (2), 009 (0), 013 (1), 014 (1) (iter 016:118-124)

## Track 9: Cross-026 reorgs (iter 017)

### 003 should absorb 005-memory-indexer-invariants

Iteration 017 recommended YES for 003 absorbing 005:
- Surface 3 consolidation opportunity (both belong to Memory continuity and indexing surface) (iter 017:26-28)
- Phase structure mismatch correction (memory work split across P1/P2, should consolidate under Surface 3) (iter 017:27-30)
- Scope coherence (003 covers runtime infrastructure, 005 covers indexer correctness invariants) (iter 017:31-32)
- Implementation approach: 005 becomes 003-continuity-memory-runtime/005-memory-indexer-invariants (iter 017:33-34)

### 012 should absorb 006-external-project-adoption

Iteration 017 recommended YES for 012 absorbing 006:
- Taxonomy violation correction (006 is provenance fallacy, actually graph impact/affordance uplift) (iter 017:40-42)
- Surface 8 alignment (006's actual scope aligns with Surface 8's definition) (iter 017:41-44)
- Naming correction opportunity (correct provenance-fallacy naming under 012) (iter 017:44-46)
- Implementation approach: 006 becomes 012-causal-graph-channel-routing/003-graph-impact-affordance-uplift (iter 017:47-50)

### Cross-phase restructure opportunities

Iteration 017 identified additional consolidation opportunities:
- Surface 2 consolidation (002+010) with caution given iter-007's recommendation to keep 010 separate (iter 017:53-56)
- Surface 4 consolidation (011+014) for retrieval substrate work (iter 017:55-58)
- Surface 11 consolidation (015 into 000) with prefix preservation per iter-012 (iter 017:57-60)

## Track 10: Hop-count validation extended (iter 018)

### Extended query set targeting aggressive variant wins

Iteration 018 extended iter 040's 5 queries with 5 new queries:
- Query 6: "Where is the skill-advisor smart router remediation?" - 1 hop saved by aggressive (iter 018:45-47)
- Query 7: "How were memory indexer invariants implemented?" - -1 hop regression (iter 018:48-49)
- Query 8: "Where is the TanStack security audit work?" - -1 hop regression (iter 018:49-50)
- Query 9: "Where are the template-levels followups for skill advisor?" - 2 hops saved (iter 018:50-51)
- Query 10: "How were the doctor command YAML alignments done?" - 2 hops saved (iter 018:51-52)

### Aggregate analysis of aggressive variant incremental benefits

Iteration 018 provided aggregate analysis:
- Total incremental hops saved by aggressive over cheapest: 3 hops (1 - 1 - 1 + 2 + 2) (iter 018:55-61)
- Incremental first-pick improvement: 60% (3/5 queries show improvement over cheapest) (iter 018:63-69)

### Key insights about aggressive variant's wins

Iteration 018 identified key insights:
- Template-levels rehomes are the primary win (queries 9-10 show 2-hop savings each) (iter 018:71-74)
- Skill-advisor internal restructuring provides modest benefit (1-hop saved for high cost) (iter 018:74-76)
- Security audit placement is a regression risk (015→000 absorption adds hop) (iter 018:76-78)
- Memory indexer invariants trade-off (both variants introduce regression) (iter 018:78-80)
- Net benefit concentrated in cross-parent rehomes (iter 018:80-82)

### Cost-benefit comparison

Iteration 018 provided cost-benefit comparison:
- Total hops saved (aggressive over current): 6 hops (3 from iter 040 + 3 from new queries) (iter 018:85-88)
- Total hops saved (cheapest over current): 3 hops (from iter 040 only) (iter 018:85-89)
- Incremental benefit of aggressive: 3 additional hops (50% increase over cheapest) (iter 018:85-90)
- Cost difference: ~40% additional effort for aggressive over cheapest (iter 018:85-91)
- Cheapest variant captures most recall gain at 40% less effort (iter 018:92-93)

## Track 11: Wave 2 PROCEED/DEFER verdicts (iter 019-020)

### Risk + Cost Matrix for all 25 Wave 2 candidates

Iteration 019 created comprehensive risk + cost matrix:
- 4 risk dimensions: technical complexity, dependency coupling, data migration risk, user impact (iter 019:3-5)
- 4 cost dimensions: implementation time, coordination overhead, testing effort, rollback complexity (iter 019:3-5)
- All 25 merge operations analyzed across all dimensions (iter 019:32-60)

### Highest-Impact Operations

Iteration 019 identified top 5 highest-impact operations:
- M25: 000 as meta-phase (Impact Score: 9/10) - documentation-only, high benefit, low risk (iter 019:7-9)
- M8: 007/002 into 007/014 merge (Impact Score: 8/10) - strong clarity benefit, low risk (iter 019:8-9)
- M15: 009/006 + 007 into 009/002 merge (Impact Score: 8/10) - strong conceptual clarity (iter 019:9-10)
- M7: 013/001 + 002 merge (Impact Score: 7/10) - clear recall win for historical foundation (iter 019:10-11)
- M17: Cross-parent documentation alignment (Impact Score: 7/10) - high recall benefit (iter 019:11-12)

### Highest-Risk Operations

Iteration 019 identified 5 operations to avoid or heavily mitigate:
- M24: 015-extracted-skills-isolation (Infinite risk - phantom phase) (iter 019:14-15)
- M16: Cross-parent deep-review quality gates (Very High risk - artificial parent) (iter 019:15-16)
- M23: 008 internal phase restructure (Very High risk - 26 children) (iter 019:15-16)
- M18: Cross-parent MCP server/config merge (Very High risk - architectural blur) (iter 019:16-17)
- M4: 014 deep-review remediation (Very High risk - high reference cleanup) (iter 019:17-18)

### Cheapest Variant Validation

Iteration 019 validated cheapest variant:
- Cheapest variant (11 PROCEED merges) captures ~75% benefit at ~40% effort reduction (iter 019:21-22)
- Council corrections: remove LOW_PRIORITY items, correct M6 target, defer M10 (iter 019:210-213)
- Adjusted cheapest variant: 4 high-confidence operations (M7, M15, M17, M25) (iter 019:212-213)

### Wave 2 PROCEED/DEFER verdicts

Iteration 020 created comprehensive Wave 2 plan:
- 8 PROCEED operations (32% of aggressive variant): M2, M7, M11, M12, M15, M17, M22, M25 (iter 020:5-6)
- 18 DEFER operations (68% of aggressive variant): All others (iter 020:6-7)
- 68% effort saved vs aggressive variant (better than iter 045's cheapest variant estimate of 40%) (iter 020:8-9)
- 65-70% benefit retained vs aggressive variant (iter 020:9-10)
- Superior risk profile: Only 1 high-risk operation (M22 with mitigation) vs 2 in cheapest variant (iter 020:11-12)
- Council-aligned: Excludes all council-flagged LOW_PRIORITY items (iter 020:12-13)

### Wave 2 execution structure

Iteration 020 defined 4-phase execution structure:
- Phase 1: High-impact, low-risk documentation operations (M25, M17) (iter 020:14-15)
- Phase 2: Archive operations with high maintenance reduction (M11, M12) (iter 020:14-15)
- Phase 3: High-value merges with clear benefit (M7, M15) (iter 020:14-15)
- Phase 4: Moderate-risk, high-benefit consolidation (M2, M22 with mitigation) (iter 020:14-15)

## Provenance Mapping

This section maps each consolidated finding to its source iteration and file:line citations.

### Track 1: 000-release-cleanup recatalog
- 59 children enumeration: iter 001:1-11
- Metadata inconsistency (7 vs 59): iter 001:1-11
- Duplicate prefixes 006/007: iter 001:79-85
- 7-sub-phase clustering: iter 002:27-118
- 6-sub-phase exclusive classification: iter 003:17-115
- Naming convention specification: iter 003:116-130
- Metadata synchronization strategy: iter 003:132-140

### Track 2: 008-skill-advisor internal phases
- 26 children enumeration: iter 004:43-75
- Metadata inconsistency (13 vs 26): iter 004:43-45
- 5-topic clustering: iter 004:76-139
- 026 6-phase structure: iter 005:56-134
- 008 child rehoming analysis: iter 006:26-40
- M8/M9 rehome analysis: iter 006:42-76

### Track 3: 010-template-levels disposition
- Parent retention decision: iter 007:20-33
- 004/005/006 KEEP decisions: iter 007:36-52
- 009 REHOME decision: iter 007:54-64
- Metadata inconsistencies: iter 007:75-80

### Track 4: M10 unblock 015→000
- M10 blocker analysis: iter 008:25-32
- 015 classification: iter 008:34-51
- Renumber strategy: iter 008:62-119
- Metadata synchronization: iter 008:122-135

### Track 5: SHALLOW + MEDIUM delete ref-count
- SHALLOW validation: iter 009:1-4, 147-150
- Per-packet analysis: iter 009:28-133
- MEDIUM validation: iter 010:4-9, 22-30
- Classification discrepancy: iter 010:133-136
- Administrative reference pattern: iter 010:11-12, 158-162

### Track 6: First-principles 11-surface application
- 11-surface taxonomy: iter 011:25-40
- Taxonomy mapping: iter 011:61-112
- Mismatches with iter-005: iter 011:113-138
- Phase numbering analysis: iter 012:19-58
- Option A (Preserve): iter 012:70-78
- Option B (Renumber): iter 012:85-101
- Hybrid approach: iter 012:102-118

### Track 7: Parent-doc restructure validation
- Iter 039 validation: iter 013:5-23
- 15-child state: iter 013:62-78
- Spec.md inconsistency: iter 013:84-88
- Resource-map validation: iter 014:47-84
- Graph-metadata fields: iter 015:4-11, 54-166

### Track 8: Additional renames
- 4 new findings: iter 016:3-9, 10-18
- 3 council-deferred: iter 016:20-31
- Analysis summary: iter 016:112-124

### Track 9: Cross-026 reorgs
- 003→005 absorption: iter 017:21-34
- 012→006 absorption: iter 017:36-50
- Cross-phase opportunities: iter 017:52-60

### Track 10: Hop-count validation extended
- Extended queries: iter 018:42-52
- Aggregate analysis: iter 018:54-82
- Cost-benefit comparison: iter 018:85-93

### Track 11: Wave 2 PROCEED/DEFER verdicts
- Risk + cost matrix: iter 019:32-60
- Highest-impact: iter 019:126-156
- Highest-risk: iter 019:158-187
- Cheapest variant validation: iter 019:189-213
- Wave 2 verdicts: iter 020:63-94
- Execution structure: iter 020:110-133
- Cost-benefit analysis: iter 020:134-142

## Open Questions

1. **000 recatalog execution timeline**: The 6-sub-phase structure from iteration-003 needs implementation before M10 absorption can proceed. What is the priority and timeline for this recatalog effort? (iter 008:139-141)

2. **Surface 2 consolidation decision**: Iteration-007 recommended keeping 010-template-levels as a separate parent for domain coherence, but iteration-011 identified it as a Surface 2 consolidation candidate with 002. Should Surface 2 consolidation proceed given the domain coherence concern? (iter 011:76-86, iter 007:20-33)

3. **Surface 10 representation**: Surface 10 (extraction and package boundaries) has no top-level representation in the current 15-child state. Should this surface be created as a new top-level packet, or is the work nested under existing phase parents (007-code-graph, 008-skill-advisor)? (iter 011:105-111)

4. **006 naming correction**: 006-external-project-adoption is a taxonomy violation (provenance fallacy). Should it be renamed to reflect its actual affordance uplift scope, or reclassified under Surface 8 without renaming? (iter 011:96-104)

5. **Functional vs. reference dependency distinction**: Iteration-009 found that SHALLOW-classified packets have minimal functional dependencies but significant administrative references. Should SHALLOW classification be redefined to account for administrative reference pollution, or should a new classification tier be created? (iter 009:151-154)

6. **MEDIUM count reconciliation**: Iteration-010 found discrepancy between iter-048's reported 11 MEDIUM packets and 6 explicitly classified. What is the correct classification methodology and count? (iter 010:133-136)

7. **Phase parent selection**: For the proposed consolidations (003+005, 012+006, 011+014), which packets should become phase parents vs. leaf nodes within each consolidated phase? (iter 005:165-167)

8. **Cross-reference cleanup strategy**: For the Wave 2 PROCEED operations (especially M17 cross-parent documentation alignment), what is the strategy for identifying and updating cross-references across the codebase? (iter 020:130-132)

9. **Template-levels rehomes feasibility**: Iteration-018 showed 2-hop savings from template-levels rehomes (M8, M9), but iteration-045 classified these as LOW_PRIORITY due to reference migration complexity. Are these rehomes feasible without breaking references? (iter 018:71-74, iter 020:77-78)

10. **Security audit placement decision**: Iteration-008 recommended absorbing 015-tanstack-security-audit into 000-release-cleanup, but iteration-012 recommended preserving 015's prefix for security incident response continuity. What is the final decision on 015 placement? (iter 008:78-99, iter 012:74-78)

## Recommendation Ledger (Wave 2 Operation List)

### PROCEED Operations (8 operations)

**Phase 1: High-impact, low-risk documentation operations**
1. **M25: Phase 13 - 000 as meta-phase outside sequence**
   - Impact Score: 9/10 (highest impact)
   - Risk: Low | Cost: Low | User Impact: High
   - Rationale: Documentation-only change with high benefit (avoids false dependency ordering) and minimal risk (iter 019:128-133)
   - Implementation: Add meta_phase_ids field to graph-metadata.json, document 000 as meta-phase outside linear sequence (iter 015:8-9)

2. **M17: Cross-parent documentation alignment**
   - Impact Score: 7/10
   - Risk: Medium | Cost: Medium | User Impact: High
   - Rationale: High recall benefit by removing completed doc-cleanup noise while retaining hook-parity docs (iter 019:152-156)
   - Implementation: Update doc references across multiple parents, archive completed doc-cleanup artifacts (iter 020:130-132)

**Phase 2: Archive operations with high maintenance reduction**
3. **M11: 007 deep-review campaign artifacts (031-034) archive**
   - Risk: Medium | Cost: Medium | User Impact: High
   - Rationale: High recall benefit with moderate cost, archive locally with evidence retained (iter 045:81-86)
   - Implementation: Archive 007/031-034 to z_archive with final evidence preservation (iter 019:46-47)

4. **M12: 007 comprehensive deep-review artifacts (037-039) archive**
   - Risk: Low-Medium | Cost: Low-Medium | User Impact: Medium
   - Rationale: Good recall/maintenance reduction with smaller scope, same pattern as M11 (iter 045:88-93)
   - Implementation: Archive 007/037-039 to z_archive, preserve 038 evidence (iter 019:47-48)

**Phase 3: High-value merges with clear benefit**
5. **M7: 013/001 + 002 merge**
   - Impact Score: 7/10
   - Risk: Low | Cost: Low | User Impact: Medium
   - Rationale: Clear recall win for historical doctor runtime foundation, superseded by 004/005 (iter 045:53-58)
   - Implementation: Merge 013/001 and 013/002 into single historical packet (iter 019:44-45)

6. **M15: 009/006 + 007 into 009/002 merge**
   - Impact Score: 8/10
   - Risk: Medium | Cost: Medium | User Impact: High
   - Rationale: Strong conceptual clarity benefit with one coherent Copilot parity arc, council-corrected target (iter 045:109-114)
   - Implementation: Merge 009/006 and 009/007 into 009/002 with Copilot parity narrative (iter 019:45-46)

**Phase 4: Moderate-risk, high-benefit consolidation**
7. **M2: 014/056 + 057 merge**
   - Risk: Low-Medium | Cost: Low-Medium | User Impact: Medium
   - Rationale: Good recall gain for root README evolution, reversible with clear benefit (iter 045:18-23)
   - Implementation: Merge 014/056 and 014/057 (root README research + SKILL.md alignment) (iter 019:34-35)

8. **M22: Phase 2: 004 into 003 merge with child preservation**
   - Risk: High | Cost: High | User Impact: High
   - Rationale: High benefit with mitigation required, tighter phase structure (iter 045:158-163)
   - Implementation: Merge 004 into 003 with child folder preservation and decision record for reversibility (iter 020:130-132)

### DEFER Operations (18 operations)

**Council-mandated LOW_PRIORITY deferrals**
- M1: 014/052 + 053 merge (LOW_PRIORITY per council) (iter 020:69)
- M8: 007/002 into 007/014 merge (LOW_PRIORITY per council, despite high impact) (iter 020:76)
- M9: 007 extraction children (016-020) into 014 merge (LOW_PRIORITY per council) (iter 020:77)
- M10: 007 post-extraction cleanup (022-030) archive (defer until 000 recataloged per council) (iter 020:78)
- M13: 007/035 archive (LOW_PRIORITY per iter 045) (iter 020:81)
- M20: Template system followups rehome (010 to 008/013) (LOW_PRIORITY per council) (iter 020:88)
- M21: Empty scaffold cleanup under 010 (defer until 004 verified per council) (iter 020:89)

**Iter 045 REDESIGN/ABORT operations**
- M3: 014/041 + 042 merge (ABORT - load-bearing sibling concern) (iter 020:71)
- M4: 014 deep-review remediation into 022 (REDESIGN - high reference cleanup risk) (iter 020:72)
- M5: 014/056 + 057 + 058 + 059 merge (REDESIGN - scope creep) (iter 020:73)
- M6: 014 documentation consolidation (REDESIGN - load-bearing sibling concern) (iter 020:74)
- M14: 009/007 into 009/006 merge (REDESIGN - superseded by M15) (iter 020:82)
- M16: Cross-parent deep-review quality gates (REDESIGN - artificial parent too expensive) (iter 020:84)
- M18: Cross-parent MCP server/config merge (ABORT - conceptual merge too broad) (iter 020:86)
- M19: Cross-parent skill realignment (REDESIGN - archive completed one-time items) (iter 020:87)
- M23: Phase 5: 008 internal phase restructure (REDESIGN - defer to dedicated pass) (iter 020:91)
- M24: Phase 11: 015-extracted-skills-isolation (ABORT - phantom phase does not exist) (iter 020:92)

### Mitigation Requirements

**M22 mitigation** (highest-risk PROCEED operation):
- Preserve child folder structure during 004→003 merge (iter 045:162-163)
- Create decision record documenting merge rationale and reversibility approach (iter 045:162-163)
- Validate that no functional dependencies would be broken by the consolidation (iter 017:63-64)

**M17 mitigation** (cross-parent documentation alignment):
- Identify and update all doc references across multiple parents (iter 019:52)
- Validate that hook-parity docs are retained while doc-cleanup noise is removed (iter 019:52)
- Test that cross-reference updates don't break existing tooling (iter 017:71-73)

### Execution Sequence Recommendation

1. **M25** (documentation-only, highest impact, lowest risk)
2. **M17** (high recall benefit, medium risk, doc reference updates)
3. **M11** (archive operation, high maintenance reduction)
4. **M12** (archive operation, good recall/maintenance reduction)
5. **M7** (high-value merge, low risk, historical foundation)
6. **M15** (high-value merge, medium risk, council-corrected target)
7. **M2** (moderate-risk consolidation, good recall gain)
8. **M22** (high-risk consolidation, requires child preservation and decision record)

This sequence prioritizes low-risk/high-impact documentation changes first, followed by archive operations, then high-value merges, ending with the highest-risk consolidation that requires mitigation.

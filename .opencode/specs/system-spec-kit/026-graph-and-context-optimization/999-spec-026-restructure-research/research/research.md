# Research Ledger: 026 Graph and Context Optimization Restructure

**Date:** 2026-05-16
**Research Scope:** Consolidate 50 iteration outputs (40 cli-devin SWE-1.6 + 10 cli-codex gpt-5.5) from the 026 graph and context optimization restructure research into a single findings ledger.
**Contradiction Resolution Policy:** Track 11 (gpt-5.5) overrides Track 1-10 (SWE-1.6) verdicts when conflicts exist, as Track 11 had the SWE-1.6 corpus as input.

---

## Executive Summary

This research ledger consolidates findings from 50 iterations across 11 tracks analyzing the 026 graph and context optimization spec folder structure. The research identified significant consolidation opportunities:

- **Top-level packet structure:** 16 direct children under 026, with 4 phase parents containing nested children (007-code-graph: 40 packets, 008-skill-advisor: ~26 packets, 009-hook-parity: 8 packets, 013-doctor-update-orchestrator: 5 packets, 014-local-llama-cpp: 63 packets)
- **Proposed consolidation:** Phase parent restructuring would reduce nested packets by 60-83% (007: 40→7 phases, 014: 63→10 phases, 009: 8→3 phases, 013: 5→4 phases)
- **Delete candidates:** 55 packets identified for deletion (42 pure delete, 13 merge/delete candidates), with 28 flagged as DEEP blast radius requiring archival instead of deletion (iter 048)
- **Naming issues:** 1 severe mismatch (014-local-llama-cpp should be 014-local-embeddings-setup-a) and 4 mild mismatches identified (iter 031)
- **Target state:** 11-phase structure proposed (down from 13 after removing phantom packet and reclassifying meta-phase), with first-principles domain decomposition supporting surface-based organization (iter 044)

Track 11 (gpt-5.5 adversarial review) resolved cross-track contradictions and provided cost-benefit analysis for 25 proposed merges, recommending 11 PROCEED, 4 PROCEED_AS_LOW_PRIORITY, 3 ABORT, and 7 REDESIGN (iter 045).

---

## Track 1: Direct-Child Packet Inventory (iterations 001-006)

### Findings

**Classification of 16 top-level 026 children:**

| Packet | Classification | Rationale | Evidence |
|--------|--------------|-----------|----------|
| 000-release-cleanup | load-bearing | Phase parent for release cleanup work with 2 nested children (014-phase-parent-documentation, 015-mcp-runtime-stress-remediation) | iter 001:59-61 |
| 001-research-and-baseline | load-bearing | Master research packet for v2 cross-phase synthesis, adoption decisions, and downstream sequencing (214 files) | iter 001:71-73 |
| 002-resource-map-template | load-bearing | Resource map template creation, local-owner deep-loop artifact placement restoration, and deep-loop integration (71 files) | iter 001:83-85 |
| 003-continuity-memory-runtime | load-bearing | Phase parent for cache hooks, memory quality, continuity refactor, and memory-save rewrite (253 files) | iter 002:20-34 |
| 004-runtime-executor-hardening | merge candidate (into 003) | Minimal implementation evidence (14 code search matches), consolidation artifact with identical problem statement to 003 | iter 002:20-34 |
| 005-memory-indexer-invariants | load-bearing | Memory indexer invariant fixes: Track A (lineage/concurrency) and Track B (index-scope/constitutional tier) (23 files) | iter 002:79-81 |
| 006-graph-impact-and-affordance-uplift | load-bearing (confidence-weak) | External project research adoption, but graph metadata shows 8 children vs spec's 6, and no implementation files found | iter 002:91-95 |
| 007-code-graph | load-bearing | Phase parent for code graph subsystem with 40 children | iter 003:75-77 |
| 008-skill-advisor | load-bearing | Phase parent for skill advisor subsystem with ~26 children | iter 003:128-130 |
| 009-hook-parity | load-bearing | Phase parent for hook parity remediation across Claude/Codex/Copilot/OpenCode with 8 children | iter 004:43-45 |
| 010-template-levels | load-bearing (confidence-weak) | Graph metadata has 6 children, filesystem has 9, phase map lists only 3; children 004-009 may warrant redistribution | iter 004:73-77 |
| 011-cocoindex-daemon-resilience | load-bearing | 7-patch defense-in-depth for socket-unlink cascade, BrokenPipeError loop, and daemon lifecycle robustness (17 files) | iter 004:99-101 |
| 012-causal-graph-channel-routing | load-bearing | Phase parent for graph-channel routing override (001 initial-delivery) and post-deep-review remediation (002) (59 files) | iter 005:20-29 |
| 013-doctor-update-orchestrator | load-bearing | Phase parent for doctor command consolidation with 5 children | iter 005:48-52 |
| 014-local-llama-cpp | load-bearing (confidence-weak) | Phase parent for local embeddings migration with 63 children (not 60 as initially reported); naming incoherence identified | iter 006:23, iter 042:10 |
| 015-global-security-sweep-and-supply-chain-audit | load-bearing | 25-iteration deep-research security audit of Public repo + host environment after TanStack Mini Shai-Hulud disclosure (57 files) | iter 006:95-99 |

**Track 11 Adversarial Review (iter 041):**
- Overrode SWE-1.6 classification for 004-runtime-executor-hardening: false-positive-merge, grep found 339 non-research exact-packet matches including downstream dependencies
- Flagged 006, 010, 014 for review due to confidence-weak classifications and metadata/phase-map drift
- Accepted 12 SWE-1.6 verdicts, overrode 1, flagged 3 for review

### Open Gaps

- Need to verify actual content of 010-template-levels children 004-deferred-followups (may be empty scaffold)
- Need to examine whether 006-graph-impact-and-affordance-uplift has actual implementation beyond documentation
- Need to resolve 014 child count discrepancy (reported as 60, actual is 63 per iter 042)

---

## Track 2: 014-local-llama-cpp Deep-Read (iterations 007-010)

### Findings

**Catalog Completeness:**
- 014 has 63 direct NNN-name children (not 60 as initially reported) (iter 042:10)
- 2 placeholder directories identified: 045-session-deep-review-2026-05-14, 048-deep-review-cocoindex-wiring (no description.json)

**Per-Packet Classification (iter 008):**
- 20 packets classified as load-bearing (001-005, 010-014, 022, 032-034, 036, 041, 042, 044, 049, 051-053)
- 20 packets classified as pure delete candidates (006, 008, 016, 019-021, 023, 025-031, 037, 041-043, 045, 048, 054-059)
- Classification explicitly partial for packets 019-059, then fed into final dispositions (iter 008:130, iter 008:318)

**Phase List Proposal (iter 010):**
- Proposed 10-phase structure consolidating 60 packets into 10 phases (83.3% reduction)
- Double-assignment issue: 058-skill-md-realignment assigned to both Phase 9 and Phase 10 (iter 010:47-48, iter 010:82)
- Omitted/underspecified children: 028-local-llm-feature-test-suite, 029-post-027-findings-remediation, 036-failed-embedding-cleanup-retry, 045-shared-daemon-suite-runner (iter 010:37-48, iter 010:87-94)

**Track 11 Adversarial Review (iter 042):**
- Overrode SWE-1.6 classification: catalog completeness check failed (miss-3-children), classification accuracy flags, overlap detection missed-overlap, phase-list quality weak
- Recommendation: fix 014 child accounting from 60 to 63 and re-run phase mapping

### Open Gaps

- Need to reconcile 014 child count from 60 to 63 and update phase mapping accordingly
- Need to resolve double-assignment of 058-skill-md-realignment
- Need to include omitted children (028, 029, 036, 045) in phase accounting

---

## Track 3: 013-doctor-update-orchestrator Deep-Read (iterations 011-014)

### Findings

**Catalog Completeness:**
- 5 direct NNN-name children identified (iter 011:17, iter 011:41-49)

**Per-Packet Classification (iter 012):**
- 001-doctor-commands: merge candidate (superseded by 004+005, ~95% complete) (iter 012:59-66)
- 002-sandbox-testing-playbook: merge candidate (superseded by 004+005, ~95% complete) (iter 012:68-75)
- 003-rm8-013-remediation-doc-honesty-security: load-bearing (remediated 4 batches: doc honesty, security, cross-runtime mirror, P2 cleanup) (iter 012:77-84)
- 004-router-phase: load-bearing (router-based entrypoints) (iter 012:27-56)
- 005-cutover-phase: load-bearing (cutover from legacy commands) (iter 012:27-56)

**Phase List Proposal (iter 014):**
- Proposed 4-phase structure consolidating 5 packets into 4 phases (20% reduction)
- Value questioned: reduces only 5 NNN packets to 4, while counting deletion/movement of non-NNN review/review_archive as part of reduction (iter 014:49-60, iter 014:64-77)
- Unresolved ambiguity: 002 is "not load-bearing" because it targets old invocation forms, but SWE asks whether sandbox should be updated before becoming load-bearing again (iter 012:73, iter 013:118)

**Track 11 Adversarial Review (iter 042):**
- Catalog completeness check passed
- Classification accuracy flagged: unresolved load-bearing ambiguity for 002
- Phase-list quality flagged: weak reduction value
- Recommendation: add decision record deferring internal phases or keep as-is with explanation

### Open Gaps

- Need to resolve 002 sandbox update question before archival classification
- Need to evaluate whether 4-phase structure provides meaningful reduction vs 5-packet current state

---

## Track 4: 007-code-graph Deep-Read (iterations 015-018)

### Findings

**Catalog Completeness:**
- 40 direct NNN-name children identified (iter 015:15, iter 018:164-166)

**Per-Packet Classification (iter 016):**
- 16 packets classified as load-bearing (001, 003-009, 013-015, 021, 040)
- 6 packets classified as merge-candidates (002, 016-020)
- 18 packets classified as delete-candidates (022-030, 031-034, 035-039)
- Evidence standard: ≥2 file:line references per classification (iter 016:20)

**Overlap Detection (iter 017):**
- Identified overlapping pairs/groups:
  - Pair 1: 002-code-graph-self-contained-package ↔ 014-system-code-graph-extraction (merge: 002→014)
  - Group 1: Extraction Phase Children (016-020) → merge into 014
  - Group 2: Post-Extraction Cleanup (022-030) → delete/archive
  - Group 3: Deep Review Campaign Artifacts (031-034) → delete/archive
  - Group 4: Comprehensive Deep Review Artifacts (037-039) → delete/archive

**Phase List Proposal (iter 018):**
- Proposed 7-phase structure (4 active, 3 archive) consolidating 40 packets (iter 018:106-158)
- Reduction: 40→7 phases (82.5% reduction), 40→16 active packets (60% reduction)
- All 40 children accounted for in disposition table (iter 018:246-298)

**Track 11 Adversarial Review (iter 042):**
- Catalog completeness check passed
- Classification accuracy flagged: SWE declared evidence standard of ≥2 file-line references, but classified 037/038 as delete candidates while saying "Not directly read" (iter 016:321-331)
- Internal contradiction: 036 classified load-bearing (iter 016:314), then archived under Phase 007 (iter 018:153-157, iter 018:286-296)
- Phase-list quality flagged: says "No consolidation opportunity" for distinct load-bearing early packets, then consolidates eight into one broad phase (iter 018:111-116, iter 018:186-188)
- Recommendation: reverse or re-justify 007 archive/delete decisions for unread or internally contradictory packets

### Open Gaps

- Need to resolve internal contradiction for 036 (load-bearing vs archived)
- Need to re-evaluate phase list consolidation that obscures runtime/subsystem-specific recall paths

---

## Track 5: 009-hook-parity Deep-Read (iterations 019-022)

### Findings

**Catalog Completeness:**
- 8 direct NNN-name children identified (iter 019:15-26)
- Natural thematic grouping identified:
  - Group A: Runtime Hook Parity Core (001-005) — main arc
  - Group B: Copilot Wrapper Fixes (006-007)
  - Group C: Documentation Alignment (008)

**Per-Packet Classification (iter 020):**
- All 8 packets classified as load-bearing
- 1 merge candidate pair identified: 006-copilot-wrapper-schema-fix + 007-copilot-writer-wiring (both Level 1, both modify .claude/settings.local.json, both reverted/reapplied together)
- Status drift: 002 and 005 show status drift between spec.md (Complete) and parent graph-metadata.json (in_progress) (iter 020:158-166)

**Overlap Detection (iter 021):**
- Identified overlapping pairs/groups:
  - Group 1: Copilot Wrapper Integration (006 + 007) — 2-pair sequential dependency
  - Group 2: Copilot Hook Parity (002 + 006 + 007) — 3-packet thematic cluster
  - Group 3: Runtime Hook Parity Core (001-005) — 5-packet thematic arc
- Merge proposals:
  - Conservative: merge 007 into 006 (2-pair merge)
  - Aggressive: merge 006+007 into 002 (3-packet merge)
  - No merge for Runtime Hook Parity Core (001-005)

**Phase List Proposal (iter 022):**
- Proposed 3-phase structure consolidating 8 packets (iter 022:49-79)
- Reduction: 8→3 phases (62.5% reduction), 8→7 packets (12.5% reduction)
- Conservative merge adopted: 007→006 (preserves Level 1/Level 3 distinction)

**Track 11 Adversarial Review (iter 042):**
- Catalog completeness check passed
- Classification accuracy flagged: SWE first catalogs 002/005 as in_progress, then asserts both are complete and instructs metadata correction (iter 019:20, iter 019:23, iter 020:45, iter 020:87, iter 022:141-143)
- Phase-list quality flagged: SWE says runtime-specific packets have "distinct runtime-specific contracts" and "no consolidation opportunity", but still collapses 001-005 into one phase (iter 022:54-60, iter 022:107-110)
- Recommendation: make phase lists preserve retrieval keys instead of creating broad buckets that hide runtime-specific recall paths

### Open Gaps

- Need to remediate status drift for 002 and 005 in parent graph-metadata.json

---

## Track 6: Cross-026 Duplicate Detection (iterations 023-026)

### Findings

**Top-Level Overlaps (iter 023):**
- Pair 1: 004-runtime-executor-hardening ↔ 003-continuity-memory-runtime — Runtime/memory infrastructure consolidation artifact — merge target: 003
- Pair 2: 010-template-levels/009-rm-8-prompt-hardening ↔ 008-skill-advisor — Deep-review skill prompt hardening misplacement — merge target: 008
- Pair 3: 010-template-levels/005-skill-references-assets-alignment ↔ 008-skill-advisor — Skill references/assets alignment misplacement — merge target: 008
- Group: 010-template-levels/004-deferred-followups, 007, 008 — Scaffold drift and empty placeholder packets — merge target: delete candidates (pending content verification)

**Cross-Phase-Parent Overlaps (iter 024):**
- 5 overlap pairs/groups identified:
  1. Deep-Review Remediation Loops (014 ↔ 007) — merge target: NEW parent 030-deep-review-quality-gates
  2. Documentation and README Realignment (014 ↔ 009) — merge target: keep 009-008, archive 014 docs
  3. MCP Server and Configuration (014 ↔ 007) — merge target: keep separate (architectural vs operational)
  4. Remediation Work (013 ↔ 014 ↔ 007) — merge target: NEW parent 030-deep-review-quality-gates
  5. SKILL Realignment (014 ↔ 007) — merge target: archive all

**Hidden Duplicates (iter 025):**
- 7 hidden duplicate groups identified:
  1. Deep-Review Quality Gates (014, 007, 013) — merge target: create new parent 030-deep-review-quality-gates
  2. Documentation Alignment (014, 007, 009) — merge target: keep 009-008, archive 014/007 docs
  3. MCP Server Configuration (014, 007) — merge target: keep separate
  4. Skills Documentation Alignment (014, 007) — merge target: archive all
  5. Runtime Infrastructure (003, 004) — merge target: 003
  6. Template System Followups (010/005, 010/009, 010/006) — merge target: rehome to 008/013
  7. Quality Meta-Research (007/010-013, 014/010) — merge target: verify if duplicate

**Merge Groups Consolidation (iter 026):**
- 4 merge groups proposed:
  1. Deep-Review Quality Gates (14 packets → 1 parent, 92.9% reduction)
  2. Documentation Alignment (8 packets → 1 packet, 87.5% reduction)
  3. Template System Followups (3 packets rehomed)
  4. Empty Scaffold Cleanup (2-3 packets deleted)
- Total reduction: 22-23 packets from consolidation and cleanup (~33-38% reduction of total 026 packet count)

**Track 11 Cross-Track Contradiction Resolution (iter 043):**
- Contradiction 1: 013/003 load-bearing vs consolidate into 030-deep-review-quality-gates — resolution: flag for synthesis, both can be true at different levels
- Contradiction 2: 007/036 load-bearing vs delete candidate — resolution: override Track A, treat as packet-delete/archive unless active references found
- Contradiction 3: 014/052 superseded by 053 vs 052 as merge target — resolution: override Track B, keep 052 as retained MCP rename target
- Contradiction 4: 004 rename vs merge into 003 — resolution: override Track A, do not rename if merging
- Contradiction 5: 013/003 rename vs consolidate into 030 — resolution: flag for synthesis, re-evaluate naming after 030 decision

### Open Gaps

- Need to verify if 014/010-fix-iteration-quality-meta-research is duplicate of 007/010
- Need to examine 010-template-levels/006-command-md-yaml-alignment to determine if it belongs under 013
- Need to trace dependencies between merged packets to confirm merge feasibility

---

## Track 7: Stale-Context Detection (iterations 027-030)

### Findings

**Completed + Unreferenced Packets (iter 027):**
- 42 pure delete candidates identified (23 from 014, 18 from 007, 2 placeholders in 014)
- All have references ONLY in research iteration files, not in active code, docs, or other packets
- Reference counting method: grep with exclusions for research iteration files (iteration-*.md) and 999-spec-026-restructure-research folder

**Superseded Packets (iter 028):**
- 28 supersession pairs identified
- Key supersession chains:
  - 014-system-code-graph-extraction supersedes: 002, 016-020, 022-030
  - 032-remediation supersedes: 031
  - 033-deferred-followup supersedes: 032
  - 034-operational-sweep supersedes: 033
  - 038-remediation supersedes: 037
  - 039-deferred-followon supersedes: 038
  - 006-copilot-wrapper-schema-fix (proposed) supersedes: 007
  - 022-local-llm-legacy-remediation supersedes: 021, 023, 025-031
  - 057-root-readme-deeper-rewrite supersedes: 056
  - 052-mk-spec-memory-rename supersedes: 053

**Consolidated Delete-Candidate List (iter 030):**
- 55 delete candidates total (iter 029 orphans was not available for consolidation)
- Confidence levels: 38 HIGH, 13 MEDIUM, 4 LOW
- Combined size reduction: ~54,748 LOC (HIGH+MEDIUM only)
- Gap: iteration-029 (orphans) was not available for consolidation

**Track 11 Blast-Radius Analysis (iter 048):**
- 54 delete candidates evaluated (iter 030 says 55, but parsed table contains 54 rows)
- Blast classification:
  - CONTAINED (safe): 8
  - SHALLOW: 7
  - MEDIUM: 11
  - DEEP (do not delete): 28
- Recommended adjustment:
  - Aborted from delete list: 28 packets (move to archive instead)
  - Adjusted to PROCEED_WITH_CLEANUP: 20 packets
  - Confirmed CONTAINED safe: 8 packets
- Total cleanup operations needed if all PROCEED + PROCEED_WITH_CLEANUP execute: 150

### Open Gaps

- Need to complete orphan analysis (iteration-029 was missing)
- Need to verify 014/002-code-graph-self-contained-package directory (not found during size estimation)
- Need to resolve duplicate 026 numbering in 014 (026-llm-model-runtime-inventory vs 026-post-batch-11-re-review)

---

## Track 8: Naming-Quality Audit (iterations 031-034)

### Findings

**Top-Level Naming Mismatches (iter 031):**
- 5 mismatches found among 16 top-level 026 children:
  - 1 severe: 014-local-llama-cpp — name focuses only on llama-cpp (one backend), but work is multi-provider embeddings migration (Voyage → OpenAI → llama-cpp → hf-local) — proposed: 014-local-embeddings-setup-a
  - 4 mild: 015 (overly verbose, misses triggering event), 004 (doesn't signal consolidation artifact status), 006 (abstract name doesn't surface External Project adoption), 002 (name focuses only on template, missing deep-loop fix scope)

**Nested-Child Naming Audit (iter 032):**
- 113 nested children reviewed across 4 phase parents (014, 013, 007, 009)
- 0 severe mismatches found
- 3 mild mismatches (verbosity-only):
  - 013/003: rm8-013-remediation-doc-honesty-security (47 chars) → 003-rm8-013-remediation
  - 007/010: fix-iteration-quality-meta-research (39 chars) → fix-iteration-quality
  - 007/011: broader-scope-excludes-and-granular-skills (43 chars) → scope-excludes-and-skills

**Top-N Rename Proposals (iter 033):**
- Ranked by recall impact:
  1. 014-local-llama-cpp → 014-local-embeddings-setup-a (HIGH impact)
  2. 015-global-security-sweep-and-supply-chain-audit → 015-tanstack-security-audit (MEDIUM-HIGH impact)
  3. 006-graph-impact-and-affordance-uplift → 006-external-project-adoption (MEDIUM impact)
  4. 002-resource-map-template → 002-resource-map-and-deep-loop-fix (MEDIUM impact)
- 4 mild mismatches deferred due to verbosity-only issues

**Naming Convention Lock-In (iter 034):**
- 3 patterns analyzed:
  - Verb-first: ~45 packets (40%) — action-oriented (remediation, fix, sweep, extraction, upgrades)
  - Noun-first: ~60 packets (53%) — surface-oriented (code-graph, skill-advisor, hook-parity)
  - Problem-statement: ~5 packets (4%) — long descriptive names (30+ chars)
- Scoring: Noun-first wins (34/40 = 85%), Verb-first (26/40 = 65%), Problem-statement (16/40 = 40%)
- Recommended convention: Use noun-first naming for all new 026 packets; surface the core domain/subsystem; allow verb-first only for clear action-oriented remediation packets; avoid problem-statement naming

**Track 11 Strategic Naming Convention (iter 046):**
- Pressure-tested SWE-1.6 convention against 4 scenarios (026 doubles in size, cross-parent absorption, phase split, cross-parent consistency)
- Convention holds with caveats in all scenarios
- Adjusted convention: Use `domain-or-surface` first, add discriminating `facet` second, put stable work type/action last only when needed
- Top-N renames re-evaluation:
  - 014-local-embeddings-setup-a should be revised to 014-local-embeddings-migration or 014-local-embeddings-provider-migration (setup-a is internally meaningful but weak for long-term search)
  - Other renames still hold

### Open Gaps

- Need to verify proposed names don't conflict with existing packet names
- Need to assess whether renaming would break external references

---

## Track 9: Target-State Proposal (iterations 035-040)

### Findings

**Consolidated Phase List (iter 035, revised iter 038):**
- Original proposal: 13 phases
- Revised proposal: 11 phases (after removing phantom 015-extracted-skills-isolation and reclassifying 000-release-cleanup as meta-phase)
- Phase sequence:
  1. Research and Baseline (001, 002)
  2. Runtime and Memory Optimization (003, 005, 004 merged into 003)
  3. External Project Adoption (006)
  4. Code Graph Capability (007 with 7 internal phases)
  5. Skill Advisor Capability (008)
  6. Hook Parity Remediation (009 with 3 internal phases)
  7. CocoIndex Daemon Resilience (011)
  8. Causal Graph Channel Routing (012)
  9. Doctor Update Orchestrator (013 with 4 internal phases)
  10. Local Embeddings Setup (014 with 10 internal phases)
  11. TanStack Security Audit (015)
- Meta-phase outside sequence: 000-release-cleanup

**Per-Phase Scope Statements (iter 036):**
- 11 phases defined with in-scope/out-of-scope, constituent children, one-line descriptions, cumulative size
- 4 renames proposed: 002, 006, 014, 015
- Gap: 015-extracted-skills-isolation packet does not exist in filesystem (referenced in graph-metadata.json line 23 but not found)

**Per-Phase Rationale (iter 037):**
- Rationale provided for each phase with alternatives considered and why chosen wins
- Weak-rationale flags: Phase 2 (004 merge candidate), Phase 5 (008 internal structure deferred)

**High-Risk Merges + Mitigation (iter 038):**
- 3 high-risk merges proceeding with mitigation:
  - Phase 2: 004→003 with child phases preserved + decision record
  - Phase 5: 008 internal structure deferred with decision record
  - Phase 13: 000 as meta-phase outside linear sequence
- 1 aborted merge: Phase 11 (015-extracted-skills-isolation) — packet does not exist
- Net target phase count: 11 (down from 13)

**Parent Doc Layout (iter 039):**
- Current organization gaps identified in spec.md, resource-map.md, and graph-metadata.json
- Proposed 026/spec.md structure: 20 sections with QUICK START, PHASE SEQUENCE, PHASE DOMAIN MAP, RESUME SCENARIOS
- Proposed 026/resource-map.md structure: 14 sections with PHASE-TO-ARTIFACT MAP and DOMAIN-TO-PHASE CROSS-REFERENCE
- Proposed graph-metadata.json derived fields: phase_sequence, resume_priority, search_keywords_by_phase, phase_parent_flag, meta_phase_ids, phase_renames

**Sample-Query Proof Points (iter 040):**
- 5 sample queries evaluated for recall improvement
- Total hops saved: 3 across 5 queries
- First-pick correctness improvement: 40% (2/5 queries)
- 1 regression: resource map query (3→4 hops, adds navigation layer)
- Key insight: proposed phase structure's main value is semantic clustering, reducing uncertainty about where to look

**Track 11 Cost-Benefit Per Proposed Merge (iter 045):**
- 25 unique merges evaluated
- Verdicts:
  - PROCEED: 11
  - PROCEED_AS_LOW_PRIORITY: 4
  - ABORT: 3
  - REDESIGN: 7
- Cheapest-variant restructure (PROCEED merges only):
  - 13 → 11 top-level phases
  - Effort saved vs full plan: ~40%
  - Recall benefit captured vs full plan: ~75%

### Open Gaps

- Need to enumerate exact file counts for phase parents (007, 008, 009, 013, 014)
- Need to verify 015-extracted-skills-isolation status (planned vs stale reference)

---

## Track 10: Resource-Map Structure (iterations 039-040)

### Findings

**Current Organization Gaps (iter 039):**

**spec.md gaps:**
- Phase sequence buried in table format, hard to scan "where should I start?"
- Stale phase count: references "10-wrapper active surface" but target-state proposes 11 phases
- No resume/search guidance
- Abstract state model doesn't map to specific phases
- Historical narrative dominates Executive Summary

**resource-map.md gaps:**
- Incorrect child count: claims 12 children, graph-metadata.json shows 20
- Organized by artifact type rather than phase or domain
- No phase cross-reference
- Stub sections dominate (sections 4-13 are all "TODO: backfill with real content")

**graph-metadata.json gaps:**
- last_active_child_id points to 015-security-audit, not most likely resume target
- No phase_sequence field to encode execution order
- No search_keywords_by_phase mapping
- No phase_parent_flag to distinguish phase parents from leaf packets
- No resume_priority array

**Proposed Structures (iter 039):**
- spec.md: 20 sections with QUICK START, PHASE SEQUENCE, PHASE DOMAIN MAP, RESUME SCENARIOS
- resource-map.md: 14 sections with PHASE-TO-ARTIFACT MAP and DOMAIN-TO-PHASE CROSS-REFERENCE
- graph-metadata.json: 6 new derived fields (phase_sequence, resume_priority, search_keywords_by_phase, phase_parent_flag, meta_phase_ids, phase_renames)

### Open Gaps

- Need to verify proposed phase_sequence matches dependency rules in spec.md
- Need to validate resume_priority ordering reflects actual usage patterns
- Need to update resource-map.md child count from 12 to 20 and backfill stub sections

---

## Track 11: Adversarial/Cross-Track/Governance Overlay (iterations 041-050)

### Findings

**Adversarial Review of Top-Level Classifications (iter 041):**
- 16 top-level 026 children reviewed
- SWE-1.6 verdicts accepted: 12
- SWE-1.6 verdicts overridden: 1 (004-runtime-executor-hardening — false-positive-merge)
- Flagged for review: 3 (006, 010, 014)
- Discrepancies: 004 merge unsupported by exact-reference evidence; 006 child-count/implementation-evidence weakness; 010 metadata/phase-map drift; 014 internal child-count inconsistency and naming incoherence

**Adversarial Review of Phase-Parent Classifications (iter 042):**
- 4 phase parents reviewed (014, 013, 007, 009)
- Per-parent verdict: 014 override; 013 flag-for-review; 007 override; 009 flag-for-review
- Highest-impact corrections needed:
  - Fix 014 child accounting from 60 to 63 and re-run phase mapping
  - Reverse or re-justify 007 archive/delete decisions for unread or internally contradictory packets
  - Make phase lists preserve retrieval keys instead of creating broad buckets

**Cross-Track Integration Check (iter 043):**
- 5 contradictions found between tracks
- Resolutions feeding track 9:
  - Preserve 013/003 evidence even if rehomed under 030-deep-review-quality-gates
  - Treat 007/036 as packet-delete/archive unless active references found
  - Keep 014/052 as retained MCP rename target; absorb 053, not the reverse
  - Do not rename 004 if merging it into 003
  - Re-evaluate 013/003 naming only after deciding whether 030-deep-review-quality-gates exists

**First-Principles Re-evaluation (iter 044):**
- Proposed 11-phase structure based on domain decomposition:
  - 000: release-governance-and-assurance
  - 001: research-and-baseline
  - 002: spec-doc-substrate
  - 003: memory-continuity-and-indexing
  - 004: retrieval-and-embeddings-substrate
  - 005: runtime-executor-and-hooks
  - 006: code-graph-capability
  - 007: skill-advisor-and-routing
  - 008: causal-context-routing-and-affordances
  - 009: doctor-and-repair-orchestration
  - 010: extraction-and-package-boundaries
- Comparison with SWE-1.6 track 9 (iter 035):
  - Convergent phases: 8
  - Divergent phases: 6
  - Confidence in convergent: HIGH
  - Confidence in divergent: MEDIUM-HIGH for memory/runtime split, spec-doc substrate, external-adoption folding; MEDIUM for CocoIndex/embeddings grouping and security-audit placement

**Cost-Benefit Per Proposed Merge (iter 045):**
- 25 merges evaluated
- Verdicts:
  - PROCEED: 11
  - PROCEED_AS_LOW_PRIORITY: 4
  - ABORT: 3
  - REDESIGN: 7
- Cheapest-variant restructure (PROCEED merges only):
  - 13 → 11 top-level phases
  - Net reduction: substantial internal packet reduction from code-graph, documentation, hook-parity, and doctor consolidation
  - Effort saved vs full plan: ~40%
  - Recall benefit captured vs full plan: ~75%

**Strategic Naming Convention for Scale (iter 046):**
- Pressure-tested SWE-1.6 convention against 4 scenarios
- Convention holds with caveats in all scenarios
- Adjusted convention: Use `domain-or-surface` first, add discriminating `facet` second, put stable work type/action last
- Top-N renames re-evaluation: 014-local-embeddings-setup-a should be revised to 014-local-embeddings-migration or 014-local-embeddings-provider-migration

**Phase Lifecycle Governance (iter 047):**
- 5 stages defined: Active, Stable, Stale, Superseded, Orphan
- Transitions defined with triggers and duration norms
- Automatable checks: derive lifecycle_stage from status, commit age, reference count, required-file presence
- Tooling needed: phase-lifecycle-sweep script, reference scanner, git-age scanner, metadata updater
- Recommended additions: phase-lifecycle.md ADR, graph-metadata derived.lifecycle_stage field, cron/sweep script

**Blast-Radius Analysis for Deletes (iter 048):**
- 54 delete candidates evaluated (iter 030 says 55, but parsed table contains 54 rows)
- Blast classification:
  - CONTAINED (safe): 8
  - SHALLOW: 7
  - MEDIUM: 11
  - DEEP (do not delete): 28
- Recommended adjustment:
  - Aborted from delete list: 28 packets (move to archive instead)
  - Adjusted to PROCEED_WITH_CLEANUP: 20 packets
  - Confirmed CONTAINED safe: 8 packets
- Total cleanup operations needed: 150

**Restructure Ordering for Partial-State Safety (iter 049):**
- 5 waves proposed:
  - Wave 1: Renames (4 ops, lowest risk)
  - Wave 2: Merges (15 ops)
  - Wave 3: Deletes (12 ops)
  - Wave 4: Parent-doc rewrites (3 ops)
  - Wave 5: Index refreshes (3 ops)
- Atomic groups: merge op's content union + source removal/archive + local graph metadata + local reference cleanup; PROCEED_WITH_CLEANUP delete + reference cleanup; Wave 4 parent-doc rewrites must commit together
- Recovery baseline procedure: capture HEAD SHA before each wave; on failure, git reset --hard to wave-start-sha

**Post-Restructure Validation Proof Points (iter 050):**
- 8 query-based validation queries proposed
- 9 assertions: hop-from-root, resume-pointer, per-phase trigger_phrases, search index validation, restructure-quality (3 assertions)
- Test plan: pre-restructure baseline, post-restructure measurement, diff verdict, regression queries

### Open Gaps

- Need to verify 015-extracted-skills-isolation status (planned vs stale reference)
- Need to create decision records for Phase 2 (merge rationale) and Phase 5 (deferred internal phases)
- Need to document 000-release-cleanup as meta-phase outside linear sequence
- Need to renumber Phase 12 to Phase 11 in target-state proposal

---

## Provenance Mapping

Every finding in this ledger cites the specific iteration number and file:line where it originated. Key citations:

**Track 1:** iter 001:59-61, iter 001:71-73, iter 001:83-85, iter 002:20-34, iter 002:79-81, iter 002:91-95, iter 003:75-77, iter 003:128-130, iter 004:43-45, iter 004:73-77, iter 004:99-101, iter 005:20-29, iter 005:48-52, iter 006:23, iter 006:95-99

**Track 2:** iter 007-010 (catalog and classification), iter 042:10 (child count correction)

**Track 3:** iter 011:17, iter 011:41-49, iter 012:59-66, iter 012:68-75, iter 012:77-84, iter 012:27-56, iter 014:49-60, iter 014:64-77, iter 012:73, iter 013:118

**Track 4:** iter 015:15, iter 018:164-166, iter 016:20, iter 016:321-331, iter 016:314, iter 018:153-157, iter 018:286-296, iter 018:111-116, iter 018:186-188

**Track 5:** iter 019:15-26, iter 020:158-166, iter 021:26-50, iter 022:49-79, iter 022:83-99, iter 022:54-60, iter 022:107-110

**Track 6:** iter 023:47, iter 023:21-26, iter 023:29-34, iter 023:36-41, iter 024:7-11, iter 024:13-18, iter 024:20-25, iter 024:26-30, iter 024:32-36, iter 025:99-105, iter 025:114-120, iter 025:129-140, iter 025:157-168, iter 026:12, iter 026:21-26

**Track 7:** iter 027:9-67 (42 delete candidates), iter 028:10-35 (28 supersession pairs), iter 030:9-67 (55 delete candidates table), iter 048:10-117 (blast-radius analysis)

**Track 8:** iter 031:25-30 (014 severe mismatch), iter 031:27 (015 mild), iter 031:28 (004 mild), iter 031:29 (006 mild), iter 031:30 (002 mild), iter 032:40-42 (013/003 mild), iter 032:52-54 (007/010 mild), iter 032:54-55 (007/011 mild), iter 033:25-26 (rank 1), iter 033:26-27 (rank 2), iter 033:27-28 (rank 3), iter 033:28-29 (rank 4), iter 034:26-27 (recommended convention), iter 046:53 (014 name revision)

**Track 9:** iter 035:12-24 (13-phase proposal), iter 036:10-68 (per-phase scope), iter 037:8-60 (per-phase rationale), iter 038:10-26 (high-risk merges), iter 039:10-28 (spec.md gaps), iter 039:17-21 (resource-map.md gaps), iter 039:23-28 (graph-metadata.json gaps), iter 040:10-32 (sample queries), iter 045:9-218 (cost-benefit), iter 045:196-218 (cheapest-variant)

**Track 10:** iter 039:10-28 (parent doc layout), iter 039:30-52 (proposed structures), iter 040:10-32 (sample-query proof points)

**Track 11:** iter 041:9-111 (adversarial top-level review), iter 042:10-36 (adversarial phase-parent review), iter 043:6-42 (cross-track contradictions), iter 044:3-101 (first-principles), iter 045:9-218 (cost-benefit), iter 046:11-58 (naming convention), iter 047:3-91 (lifecycle governance), iter 048:10-176 (blast-radius), iter 049:3-83 (execution order), iter 050:9-62 (validation proof points)

---

## Open Questions

1. **014 Child Count Discrepancy:** Reported as 60 children in iterations 007-010, but actual count is 63 per iter 042:10. Need to reconcile and update phase mapping accordingly.

2. **015-Extracted-Skills-Isolation Status:** Referenced in graph-metadata.json line 23 but does not exist in filesystem (iter 036:183, iter 038:24). Is this a planned packet or a stale reference?

3. **007/036 Classification Conflict:** Track 4 classifies as load-bearing (iter 016:314), Track 7 classifies as delete candidate (iter 027:60). Track 11 overrides Track 4, but need to verify if active references exist outside research iterations before deletion.

4. **014/052 vs 053 Supersession Direction:** Track 7 says 052 superseded by 053 (iter 030:62), Track 11 overrides Track 7 to keep 052 as merge target (iter 043:26-27). Need to verify which direction is correct.

5. **010-Template-Levels Child Redistribution:** Children 004-009 may warrant redistribution per iter 004:77. Need to determine correct placement (008-skill-advisor or 013-doctor-update-orchestrator).

6. **006-Graph-Impact-and-Affordance-Uplift Implementation:** Graph metadata shows 8 children while parent spec says 6, and code search found no implementation files (iter 002:91-95). Need to verify if this is draft state or has hidden implementation.

7. **Phase 2 (004→003) Merge Decision:** Iter 002 identified 004 as merge candidate with 003, but iter 041 found 339 non-research exact-packet matches including downstream dependencies. Need to decide whether to proceed with merge or keep separate.

8. **Phase 5 (008-Skill-Advisor) Internal Structure:** Iter 003 cataloged 26 children but did not propose internal phase structure. Iter 038 deferred internal phases with decision record. Need dedicated analysis to propose internal phases matching granularity of other phase parents.

9. **Naming Convention Revision:** Iter 046 revised 014 rename from 014-local-embeddings-setup-a to 014-local-embeddings-migration or 014-local-embeddings-provider-migration for better long-term search. Need to finalize naming before execution.

10. **Blast-Radius Cleanup Operations:** Iter 048 identified 150 cleanup operations needed for PROCEED + PROCEED_WITH_CLEANUP deletes. Need to prioritize and sequence these operations.

---

## Recommendation Ledger

### Immediate Actions (High Priority)

1. **Resolve 014 child count discrepancy:** Correct from 60 to 63 children and re-run phase mapping (iter 042:10, iter 010:87-94).

2. **Verify 015-extracted-skills-isolation status:** Determine if planned packet or stale reference; if stale, remove from graph-metadata.json (iter 036:183, iter 038:24).

3. **Proceed with PROCEED merges from iter 045:** Execute 11 PROCEED merges (iter 045:186-218):
   - Merge 014/052+053 (iter 045:11-16)
   - Merge 014/056+057 (iter 045:18-24)
   - Merge 007/002 into 014 (iter 045:60-65)
   - Merge 007/016-020 into 014 (iter 045:67-72)
   - Archive 007/022-030 (iter 045:74-79)
   - Archive 007/031-034 (iter 045:81-86)
   - Archive 007/037-039 (iter 045:88-93)
   - Merge 009/006+007 into 002 (iter 045:109-114)
   - Merge 013/001+002 (iter 045:53-58)
   - Archive cross-parent documentation alignment (iter 045:123-128)
   - Treat 000 as meta-phase (iter 045:179-184)

4. **Apply top-4 renames from iter 033/046:**
   - 002-resource-map-template → 002-resource-map-deep-loop-fix (iter 033:28-29, iter 046:58)
   - 006-graph-impact-and-affordance-uplift → 006-external-project-adoption (iter 033:27-28)
   - 014-local-llama-cpp → 014-local-embeddings-migration (iter 046:55)
   - 015-global-security-sweep-and-supply-chain-audit → 015-tanstack-security-audit (iter 033:26-27)

5. **Update parent documentation per iter 039:** Apply proposed structures to spec.md, resource-map.md, and graph-metadata.json (iter 039:30-52).

### Medium-Term Actions

6. **Execute PROCEED_AS_LOW_PRIORITY merges from iter 045:** 4 low-priority merges after high-priority work stabilizes (iter 045:146-156).

7. **Execute REDESIGN merges from iter 045:** 7 merges requiring redesign before execution (iter 045:30-45, 58-72, 96-102, 106-114, 121-122, 137-142).

8. **Execute blast-radius cleanup for DEEP delete candidates:** Move 28 DEEP packets to archive instead of deletion (iter 048:10-117, iter 048:169-172).

9. **Create phase-lifecycle governance:** Implement ADR and tooling per iter 047:56-90 (phase-lifecycle.md ADR, derived.lifecycle_stage field, sweep script).

10. **Dedicated analysis for 008-skill-advisor internal phases:** Propose internal phase structure matching granularity of other phase parents (iter 042:17, iter 038:16-17).

### Long-Term Actions

11. **Execute ABORTED merges from iter 045:** 3 merges aborted due to high cost or low benefit (iter 045:30-36, 45-52, 73-78).

12. **Post-restructure validation:** Execute 8 query-based validation queries and 9 assertions per iter 050:9-62.

13. **Monitor and adjust naming convention:** Apply refined naming convention (domain-facet-type) as 026 scales beyond current size (iter 046:46-58).

14. **Resolve cross-track contradictions flagged in iter 043:** 5 contradictions resolved with specific guidance, but ongoing monitoring needed as restructure executes (iter 043:6-42).

15. **Implement resource-map.md backfill:** Remove stub sections 4-13 and backfill with actual content (iter 039:17-21).

---

**End of Research Ledger**

This ledger consolidates findings from 50 iterations across 11 tracks. All findings cite specific iteration numbers and file:line references for verification. The recommended actions prioritize high-impact, low-risk consolidations (PROCEED merges, top-4 renames, parent doc updates) while deferring more complex restructures (internal phase proposals, lifecycle governance) until foundational changes stabilize.

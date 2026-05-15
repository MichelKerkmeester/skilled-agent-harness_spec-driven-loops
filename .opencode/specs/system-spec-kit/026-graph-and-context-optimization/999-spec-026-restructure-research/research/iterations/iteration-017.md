I'm in read-only mode and cannot write files directly. Let me provide the iteration-017.md content and JSONL entry for you to apply manually.

## Iteration 017 Output

The iteration-017.md file should be written to:
`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-017.md`

### Content:

```markdown
---

# Iteration 017 — Track 4 (007-code-graph deep-read) — Duplicate / Overlap Detection

**Date:** 2026-05-15
**Track:** 4 (007-code-graph deep-read)
**Research Question:** For `026/007-code-graph/`: overlapping pairs? overlapping groups? merge targets? load-bearing siblings?

---

## 1. Overlap Detection Methodology

**Definition of Overlap:**
- **Merge overlap:** Two or more packets solve the same problem; later work supersedes earlier implementation
- **Delete overlap:** Packets solve transient problems that are now resolved; serve only as historical record
- **Load-bearing sibling:** Packet solves a distinct problem; retains ongoing value; no overlap

**Evidence Standard:** Each overlap proposal cites ≥2 file:line references from iter 015/016 classifications and spec.md files.

---

## 2. Overlapping Pairs

### Pair 1: 002-code-graph-self-contained-package ↔ 014-system-code-graph-extraction

**Overlap Type:** Merge (002 → 014)

**Rationale:** 002 attempted partial migration to `mcp_server/code-graph/` (self-contained package within system-spec-kit). 014 completed full extraction to standalone `.opencode/skills/system-code-graph/` skill. 014 supersedes 002's work; 002 implementation reused as starting point for extraction.

**Evidence:**
- 002 spec.md:54-65 (problem: code-graph fragmented across four folders; purpose: migrate to self-contained package) <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/002-code-graph-self-contained-package/spec.md" lines="54-65" />
- 014 spec.md:52-66 (problem: code-graph buried 5 levels deep inside system-spec-kit; purpose: migrate to first-class skill) <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/014-system-code-graph-extraction/spec.md" lines="52-66" />
- 014 spec.md:94 (out of scope: "007-code-graph/002-code-graph-self-contained-package is superseded by 014") <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/014-system-code-graph-extraction/spec.md" lines="94" />
- iter 016:34-36 (002 classified as merge-candidate; rationale: superseded by 014 extraction) <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-016.md" lines="34-36" />

**Merge Target:** 014-system-code-graph-extraction (retain 014; archive 002 as historical context)

---

### Pair 2: 031-deep-review-campaign-010-016 ↔ 032-deep-review-remediation

**Overlap Type:** Delete (both to archive)

**Rationale:** 031 conducted deep review of 010-016 campaign (10 iterations, CONDITIONAL verdict, 1 P1 + 19 P2). 032 remediated 1 P1 + 13 actionable P2 findings from 031. Both packets document a quality gate that has been passed. Remediation complete; packets serve as historical record only.

**Evidence:**
- 031 spec.md:14-16 (outcome: CONDITIONAL verdict, 0 P0, 1 P1, 19 P2 findings) <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/031-deep-review-campaign-010-016/spec.md" lines="14-16" />
- 032 spec.md:53-56 (purpose: addresses 1 P1 + 13 actionable P2 findings from packet 017's deep-review; 3 findings deferred) <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/032-deep-review-remediation/spec.md" lines="53-56" />
- iter 016:274-276 (031 classified as delete-candidate; rationale: review completed, findings addressed in follow-up) <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-016.md" lines="274-276" />
- iter 016:282-284 (032 classified as delete-candidate; rationale: remediation completed, findings resolved) <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-016.md" lines="282-284" />

**Merge Target:** Archive (both to `archive/` subdirectory; preserve 032 remediation evidence as reference)

---

### Pair 3: 037-system-code-graph-comprehensive-deep-review ↔ 038-system-code-graph-deep-review-remediation

**Overlap Type:** Delete (both to archive)

**Rationale:** 037 conducted comprehensive deep review of extracted system-code-graph skill (20 iterations). 038 remediates findings from 037. Both packets document a comprehensive quality gate that has been passed. Remediation complete; packets serve as historical record only.

**Evidence:**
- iter 015:55 (037: 20-iteration comprehensive deep review) <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-015.md" lines="55" />
- iter 015:56 (038: deep-review remediation) <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-015.md" lines="56" />
- iter 016:321-323 (037 classified as delete-candidate; rationale: review completed, findings addressed in 038) <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-016.md" lines="321-323" />
- iter 016:328-330 (038 classified as delete-candidate; rationale: remediation completed, findings resolved) <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-016.md" lines="328-330" />

**Merge Target:** Archive (both to `archive/` subdirectory; preserve 038 remediation evidence as reference)

---

## 3. Overlapping Groups

### Group 1: Extraction Phase Children (016-020)

**Packets:**
- 016-scaffold-skill
- 017-physical-move-and-database
- 018-rewire-consumers-and-tool-registration
- 019-doc-and-runtime-migration
- 020-validation-and-cleanup

**Overlap Type:** Merge (all into 014)

**Rationale:** All 5 packets were phase children under 014-system-code-graph-extraction. They completed sequential extraction phases: scaffold skill, physical move, rewire consumers, migrate docs, validate. Their implementation is now part of the live system-code-graph skill. Individual packets serve as historical record of extraction phases.

**Evidence:**
- 014 spec.md:69-86 (follow-on phases: 001→015 design, 002→016 scaffold, 003→017 move, 004→018 rewire, 005→019 docs, 006→020 validation; all promoted to 015-034 on 2026-05-15) <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/014-system-code-graph-extraction/spec.md" lines="69-86" />
- 014 spec.md:77 (002→016-scaffold-skill: created skill folder with full structure) <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/014-system-code-graph-extraction/spec.md" lines="77" />
- 014 spec.md:79 (003→017-physical-move-and-database: moved code_graph/ tree to new skill) <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/014-system-code-graph-extraction/spec.md" lines="79" />
- 014 spec.md:81 (004→018-rewire-consumers-and-tool-registration: updated imports in live consumers) <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/014-system-code-graph-extraction/spec.md" lines="81" />
- 014 spec.md:83 (005→019-doc-and-runtime-migration: split category-22 docs, updated agent files) <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/014-system-code-graph-extraction/spec.md" lines="83" />
- 014 spec.md:85 (006→020-validation-and-cleanup: full typecheck, Vitest, gold-query verifier, DB parity) <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/014-system-code-graph-extraction/spec.md" lines="85" />
- iter 016:154-160 (016 classified as merge-candidate; rationale: scaffold superseded by extraction completion) <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-016.md" lines="154-160" />
- iter 016:162-168 (017 classified as merge-candidate; rationale: physical move completed, now part of live skill) <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-016.md" lines="162-168" />
- iter 016:170-176 (018 classified as merge-candidate; rationale: consumer rewire completed, now part of live skill) <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-016.md" lines="170-176" />
- iter 016:178-184 (019 classified as merge-candidate; rationale: doc migration completed, now part of live docs) <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-016.md" lines="178-184" />
- iter 016:186-192 (020 classified as merge-candidate; rationale: validation completed, now part of live skill verification) <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-016.md" lines="186-192" />

**Merge Target:** 014-system-code-graph-extraction (consolidate 016-020 implementation summaries into 014 as annex sections; remove individual packet folders)

**Load-Bearing Sibling Note:** 015-design-and-decision-record is load-bearing (historical ADR-001 context) and should not be merged. <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-016.md" lines="146-152" />

---

### Group 2: Post-Extraction Cleanup (022-030)

**Packets:**
- 022-orphan-code-graph-db-cleanup
- 023-tsconfig-references-restructure
- 024-mcp-tool-rename-mk-code-index
- 025-skill-docs-sk-doc-alignment
- 026-system-spec-kit-codegraph-residue-audit
- 027-readmes-update
- 028-architecture-md
- 029-public-readme-update
- 030-manual-testing-verification

**Overlap Type:** Delete (all to archive)

**Rationale:** All 9 packets are one-off cleanup operations after extraction completion: DB cleanup, tsconfig restructure, tool rename, doc alignment, residue audit, README updates, architecture doc, public README, testing verification. The cleanup is complete; these packets serve as historical audit trail only. No ongoing value; all problems solved.

**Evidence:**
- iter 015:108-119 (Group D: Post-Extraction Cleanup; purpose: clean up orphan DBs, restructure tsconfig, rename MCP tools, align docs, audit residue, update READMEs, create architecture.md, verify manual testing) <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-015.md" lines="108-119" />
- iter 016:206-212 (022 classified as delete-candidate; rationale: cleanup completed, artifacts now stale) <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-016.md" lines="206-212" />
- iter 016:214-219 (023 classified as delete-candidate; rationale: tsconfig restructure completed, now part of live skill config) <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-016.md" lines="214-219" />
- iter 016:221-226 (024 classified as delete-candidate; rationale: MCP tool rename completed, now part of live skill) <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-016.md" lines="221-226" />
- iter 016:228-233 (025 classified as delete-candidate; rationale: doc alignment completed, now part of live skill docs) <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-016.md" lines="228-233" />
- iter 016:235-240 (026 classified as delete-candidate; rationale: residue audit completed, now historical) <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-016.md" lines="235-240" />
- iter 016:242-247 (027 classified as delete-candidate; rationale: README update completed, now part of live skill README) <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-016.md" lines="242-247" />
- iter 016:249-254 (028 classified as delete-candidate; rationale: architecture doc completed, now part of live skill) <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-016.md" lines="249-254" />
- iter 016:256-261 (029 classified as delete-candidate; rationale: public README update completed, now part of live public README) <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-016.md" lines="256-261" />
- iter 016:263-268 (030 classified as delete-candidate; rationale: testing verification completed, now part of live skill manual testing playbook) <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-016.md" lines="263-268" />

**Merge Target:** Archive (move all 9 packets to `archive/` subdirectory; preserve as historical audit trail)

---

### Group 3: Deep Review Campaign Artifacts (031-034)

**Packets:**
- 031-deep-review-campaign-010-016
- 032-deep-review-remediation
- 033-deferred-fix-followup
- 034-mcp-namespace-operational-sweep

**Overlap Type:** Delete (all to archive)

**Rationale:** All 4 packets document the deep review quality gate on extraction packets 010-016: review campaign, remediation, deferred followon, operational sweep. The quality gate has been passed; findings resolved. Packets serve as historical record only. No ongoing value.

**Evidence:**
- iter 015:123-131 (Group E: Deep Review Campaigns; purpose: run deep-review campaigns on extraction packets, remediate findings, fix operational misses) <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-015.md" lines="123-131" />
- iter 016:274-280 (031 classified as delete-candidate; rationale: review completed, findings addressed in follow-up) <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-016.md" lines="274-280" />
- iter 016:282-287 (032 classified as delete-candidate; rationale: remediation completed, findings resolved) <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-016.md" lines="282-287" />
- iter 016:289-294 (033 classified as delete-candidate; rationale: deferred followup completed, findings resolved) <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-016.md" lines="289-294" />
- iter 016:296-301 (034 classified as delete-candidate; rationale: operational sweep completed, missed renames fixed) <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-016.md" lines="296-301" />

**Merge Target:** Archive (move all 4 packets to `archive/` subdirectory; preserve 032 remediation evidence as reference; remove intermediate review iteration packets)

---

### Group 4: Comprehensive Deep Review Artifacts (037-039)

**Packets:**
- 037-system-code-graph-comprehensive-deep-review
- 038-system-code-graph-deep-review-remediation
- 039-system-code-graph-deferred-followon

**Overlap Type:** Delete (all to archive)

**Rationale:** All 3 packets document the comprehensive deep review quality gate on the extracted system-code-graph skill: comprehensive review, remediation, deferred followon. The quality gate has been passed; findings resolved. Packets serve as historical record only. No ongoing value.

**Evidence:**
- iter 015:55-57 (037: 20-iteration comprehensive deep review; 038: remediation; 039: deferred followon) <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-015.md" lines="55-57" />
- iter 016:321-333 (037, 038, 039 all classified as delete-candidates; rationale: reviews completed, remediation completed, deferred followon completed) <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-016.md" lines="321-333" />

**Merge Target:** Archive (move all 3 packets to `archive/` subdirectory; preserve 038 remediation evidence as reference)

---

### Group 5: Final Polish Documentation (035)

**Packets:**
- 035-code-folder-readmes

**Overlap Type:** Delete (to archive)

**Rationale:** 035 authored sk-doc-aligned READMEs for 3 missing code folders in system-code-graph. Documentation completed; READMEs now part of live skill. Packet serves as historical record only.

**Evidence:**
- iter 015:53 (035-code-folder-readmes: level 1; author sk-doc-aligned READMEs for 3 missing code folders) <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-015.md" lines="53" />
- iter 016:307-312 (035 classified as delete-candidate; rationale: documentation completed, READMEs now part of live skill) <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-016.md" lines="307-312" />

**Merge Target:** Archive (move 035 to `archive/` subdirectory; preserve as historical record)

---

## 4. Load-Bearing Siblings (No Overlap)

### Load-Bearing Packets (16 total)

**Group A: Early Code Graph Core (8 packets)**
- 001-code-graph-upgrades (detector provenance, blast-radius, edge enrichment) <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-016.md" lines="26-33" />
- 003-code-graph-context-and-scan-scope (highlights in OpenCode context, scan scope tightening, .gitignore respect) <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-016.md" lines="42-49" />
- 004-code-graph-hook-improvements (deep-research into hook wiring, resolver correctness, blocked-read handling, graph-quality observability) <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-016.md" lines="50-57" />
- 005-code-graph-advisor-refinement (20-iteration deep-research, promotion subsystem delete, CALLS edge regex-only finding, settings.json wiring bug fix) <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-016.md" lines="58-65" />
- 006-code-graph-doctor-command (diagnostic-only `/doctor:code-graph` command, audit index health, propose exclude rules) <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-016.md" lines="66-73" />
- 007-code-graph-resilience-research (7-iteration deep-research, verification battery, staleness model, recovery playbook, exclude-rule confidence tiers) <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-016.md" lines="74-81" />
- 008-code-graph-backend-resilience (15-task implementation, content-hash staleness, resolver upgrades, edge-weight tuning, self-healing observability, gold-battery verifier) <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-016.md" lines="82-89" />
- 009-end-user-scope-default (end-user-repo-only default, opt-in skill indexing, UX degradation fix, performance optimization) <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-016.md" lines="90-97" />

**Group B: Meta-Research and Scope Expansion (4 packets)**
- 010-fix-iteration-quality-meta-research (fix cycle quality guardrails, fix-completeness inventories, review finding metadata, planner affected-surface wiring) <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-016.md" lines="102-109" />
- 011-broader-scope-excludes-and-granular-skills (broader .opencode defaults, granular skill selection, v2 fingerprints, expanded status fields) <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-016.md" lines="110-117" />
- 012-real-world-usefulness-test (planning-only scaffold, 12-scenario battery, 58-cell CLI matrix, dual-track measurement framework) <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-016.md" lines="118-125" />
- 013-doctor-apply-mode-phase-b (Phase B apply mode for `/doctor:code-graph`, mutation boundaries, per-run rollback, verification battery execution) <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-016.md" lines="126-132" />

**Group C: Extraction Phase (3 packets)**
- 014-system-code-graph-extraction (phase parent, main extraction arc, structural cleanup enabling first-class skill status) <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-016.md" lines="137-144" />
- 015-design-and-decision-record (10-iteration deep-research, ADR-001 architectural decisions, historical context) <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-016.md" lines="145-152" />
- 021-mcp-topology-pivot (ADR-002 standalone MCP topology, moves code-graph tool schemas and MCP registration out of spec_kit_memory) <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-016.md" lines="193-200" />

**Group F: Final Polish and Integration (1 packet)**
- 036-cli-devin-code-graph-hook (CLI Devin SessionStart Hook integration, plugin rename, post-extraction audit, cross-runtime support) <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-016.md" lines="313-319" />
- 040-three-way-isolation-finalize (complete isolation, duplicate symbols locally, drop @spec-kit/shared dependency, system-spec-kit can be deleted without breaking system-code-graph or system-skill-advisor) <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-016.md" lines="341-348" />

**Rationale:** All 16 packets solve distinct problems with ongoing value. No later packet supersedes their work. They represent foundational code-graph capability building, quality meta-research, extraction architecture, and critical isolation work.

---

## 5. Merge Target Summary

| Overlap Type | Packets | Merge Target | Action |
|--------------|---------|--------------|--------|
| **Merge** | 002 | 014-system-code-graph-extraction | Consolidate 002 into 014 as historical context |
| **Merge** | 016-020 | 014-system-code-graph-extraction | Consolidate 016-020 implementation summaries into 014 as annex sections; remove individual packet folders |
| **Delete** | 022-030 | Archive | Move all 9 packets to `archive/` subdirectory |
| **Delete** | 031-034 | Archive | Move all 4 packets to `archive/` subdirectory; preserve 032 remediation evidence as reference |
| **Delete** | 037-039 | Archive | Move all 3 packets to `archive/` subdirectory; preserve 038 remediation evidence as reference |
| **Delete** | 035 | Archive | Move 035 to `archive/` subdirectory |
| **Retain** | 001, 003-013, 014-015, 021, 036, 040 | N/A | Keep as load-bearing siblings |

**Total Packets:** 40
**Merge Candidates:** 6 (002, 016-020)
**Delete Candidates:** 18 (022-030, 031-034, 035, 037-039)
**Load-Bearing:** 16 (001, 003-013, 014-015, 021, 036, 040)

---

## 6. Load-Bearing Sibling Notes

**Critical Load-Bearing Packets:**
- **040-three-way-isolation-finalize** (in-progress): Final step to achieve complete isolation. After this, system-spec-kit can be deleted without breaking system-code-graph or system-skill-advisor. <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-016.md" lines="341-348" />
- **021-mcp-topology-pivot**: Critical architectural change enabling independent MCP server. Supersedes ADR-001 Q3 topology decision. <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-016.md" lines="193-200" />
- **015-design-and-decision-record**: Historical context for ADR-001. Q3 topology superseded by ADR-002 in 021, but rest remains useful. <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-016.md" lines="145-152" />

**Architectural Continuity:**
- 001-009 represent foundational code-graph capability building. No consolidation opportunity.
- 010-013 represent quality meta-research and scope expansion. No consolidation opportunity.
- 036 and 040 represent integration and isolation finalization. No consolidation opportunity.

---

## 7. Recommendations for Iter 018 (007 Consolidated Phase-List)

1. **Consolidate extraction phase children:** Merge 016-020 implementation summaries into 014 as annex sections. Remove individual packet folders after preserving implementation summaries.

2. **Archive cleanup and review packets:** Move 022-030, 031-034, 035, 037-039 to `archive/` subdirectory under `007-code-graph/`. Preserve remediation evidence (032, 038) as reference.

3. **Consolidate 002 into 014:** Add 002 as historical context in 014's spec.md (acknowledgement section already exists). Remove 002 packet folder.

4. **Preserve load-bearing packets:** Keep all 16 load-bearing packets as direct `007-code-graph` children. They represent distinct, ongoing value.

5. **Update graph-metadata:** Remove archived packet IDs from 007's `children_ids` list. Add `archived_children_ids` field to track what was consolidated.

6. **Document consolidation rationale:** In 007's parent spec.md, add a section explaining which packets were consolidated/archived and why (extraction phase children, cleanup packets, deep review artifacts).

---

## 8. Key Observations

1. **Extraction phase consolidation opportunity:** Packets 016-020 (scaffold, physical move, rewire, doc migration, validation) are merge-candidates. All were phase children under 014 that completed the extraction sequence. Their implementation is now part of the live system-code-graph skill. <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-016.md" lines="376-377" />

2. **Post-extraction cleanup cluster:** Packets 022-030 are all delete-candidates. These one-off cleanup packets solved transient cleanup problems after extraction. The cleanup is complete; these packets serve as historical audit trail only. <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-016.md" lines="378-379" />

3. **Deep review campaign artifacts:** Packets 031-034 and 037-039 are delete-candidates. The deep review campaigns and their remediations are complete. The review packets document quality gates that have been passed. Consider preserving only the final remediation evidence and removing intermediate review iteration packets. <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-016.md" lines="380-381" />

4. **Load-bearing early core work:** Group A (001-009) contains foundational code-graph capability building. All remain load-bearing; no consolidation opportunity here. <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-016.md" lines="382-383" />

5. **Critical isolation work:** Packet 040 (three-way isolation finalize) is load-bearing and in-progress. This is the final step to achieve complete isolation such that system-spec-kit can be deleted without breaking system-code-graph or system-skill-advisor. <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-016.md" lines="384-385" />

6. **Architectural decision continuity:** Packet 015 (design and decision record) is load-bearing as historical context. ADR-001 remains useful except Q3 (topology) which was superseded by ADR-002 in 021. Both packets document critical architectural decisions. <ref_snippet file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-016.md" lines="386-387" />

---

**JSONL Entry (to append manually):**

```json
{"iter_id": "017", "timestamp_utc": "2026-05-15T22:55:00Z", "executor": "cli-devin", "model": "swe-1.6", "track": 4, "status": "complete", "overlap_pairs_count": 3, "overlap_groups_count": 5, "merge_target_count": 6, "load_bearing_count": 16, "primary_evidence_files": [".opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-015.md", ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-016.md", ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/014-system-code-graph-extraction/spec.md", ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/002-code-graph-self-contained-package/spec.md", ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/031-deep-review-campaign-010-016/spec.md", ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/032-deep-review-remediation/spec.md"]}
```
```

### JSONL Entry to Append:

```json
{"iter_id": "017", "timestamp_utc": "2026-05-15T22:55:00Z", "executor": "cli-devin", "model": "swe-1.6", "track": 4, "status": "complete", "overlap_pairs_count": 3, "overlap_groups_count": 5, "merge_target_count": 6, "load_bearing_count": 16, "primary_evidence_files": [".opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-015.md", ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-016.md", ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/014-system-code-graph-extraction/spec.md", ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/002-code-graph-self-contained-package/spec.md", ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/031-deep-review-campaign-010-016/spec.md", ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/032-deep-review-remediation/spec.md"]}
```

---

## Summary

**Iteration 017 Complete:**

- **3 overlapping pairs identified:** (002↔014), (031↔032), (037↔038)
- **5 overlapping groups identified:** Extraction phase children (016-020), Post-extraction cleanup (022-030), Deep review campaign artifacts (031-034), Comprehensive deep review artifacts (037-039), Final polish documentation (035)
- **6 merge targets proposed:** 002→014, 016-020→014, 022-030→Archive, 031-034→Archive, 037-039→Archive, 035→Archive
- **16 load-bearing siblings identified:** 001, 003-013, 014-015, 021, 036, 040
- **All citations provided:** ≥2 file:line references per overlap
- **Load-bearing siblings noted:** 040 (in-progress isolation), 021 (MCP topology pivot), 015 (ADR-001 historical context)

The analysis provides a complete overlap detection and merge proposal for the 007-code-graph children, ready for iter 018 consolidation work.

I'm in read-only mode. Here is the iteration-015.md output:

---

# Iteration 015 — Track 4 (007-code-graph deep-read) — Map nested children + natural grouping

**Date:** 2026-05-15
**Track:** 4 (007-code-graph deep-read)
**Research Question:** Map every nested child under `026/007-code-graph/` and identify natural thematic grouping.

---

## 1. Complete Child Catalog

All 40 direct subdirectories of `007-code-graph/` with name, description, status, and last-modified:

| ID | Name | Description | Status | Last Modified |
|----|------|-------------|--------|---------------|
| 001 | code-graph-upgrades | Feature Specification: Code Graph Upgrades | complete | 2026-05-08T08:26:57.629Z |
| 002 | code-graph-self-contained-package | Feature Specification: 028 — Code-Graph Self-Contained Package Migration | in_progress | 2026-05-08T08:26:57.634Z |
| 003 | code-graph-context-and-scan-scope | Feature Specification: Code Graph Context + Scan Scope Remediation | complete | 2026-05-08T08:26:57.638Z |
| 004 | code-graph-hook-improvements | Feature Specification: Code-Graph System + Hooks Improvement Investigation | complete | 2026-05-08T08:26:57.642Z |
| 005 | code-graph-advisor-refinement | Feature Specification: Code Graph and Skill Advisor Refinement Research | complete | 2026-05-08T08:26:57.646Z |
| 006 | code-graph-doctor-command | Feature Specification: Code Graph Doctor Command | complete | 2026-05-08T08:26:57.651Z |
| 007 | code-graph-resilience-research | Feature Specification: Code Graph Resilience Research | complete | 2026-05-08T08:26:57.655Z |
| 008 | code-graph-backend-resilience | Feature Specification: Code Graph Backend Resilience | complete | 2026-05-08T08:26:57.659Z |
| 009 | end-user-scope-default | Feature Specification: End-User Scope Default for Code Graph Indexing | planned | 2026-05-08T08:26:57.663Z |
| 010 | fix-iteration-quality-meta-research | Feature Specification: Fix-Iteration Quality Meta-Research | in-progress | 2026-05-08T08:26:57.668Z |
| 011 | broader-scope-excludes-and-granular-skills | Feature Specification: Broader Default Excludes and Granular Skills | complete | 2026-05-08T08:26:57.672Z |
| 012 | real-world-usefulness-test | Planning-only Level 2 packet for testing whether code graph, hooks, and plugin/runtime integrations improve day-to-day engineering work | in_progress | 2026-05-05T21:37:24.298Z |
| 013 | doctor-apply-mode-phase-b | Feature Specification: /doctor:code-graph apply-mode (Phase B) | complete | 2026-05-09T07:57:32.852Z |
| 014 | system-code-graph-extraction | Phase parent for migrating the code-graph subsystem out of system-spec-kit into a dedicated `.opencode/skills/system-code-graph/` package | phase | 2026-05-14T07:00:38Z |
| 015 | design-and-decision-record | 10-iteration deep-research investigation via cli-opencode + deepseek-v4-pro of the code-graph extraction surface | level 2 | 2026-05-14T07:00:38Z |
| 016 | scaffold-skill | Create the empty .opencode/skills/system-code-graph/ skill scaffold and Phase 002 packet docs | level 2 | 2026-05-14T07:54:11Z |
| 017 | physical-move-and-database | Phase 003 moves the code_graph source tree and code-graph stress tests from system-spec-kit into the system-code-graph skill | level 2 | 2026-05-14T08:15:39Z |
| 018 | rewire-consumers-and-tool-registration | Phase 004 rewires system-spec-kit handlers, hooks, context-server, tool registration, tests, session utilities | level 2 | 2026-05-14T08:15:39Z |
| 019 | doc-and-runtime-migration | Phase 005 migrates code-graph-owned category-22 docs into system-code-graph, keeps shared context/hook docs in system-spec-kit | level 2 | 2026-05-14T08:21:27Z |
| 020 | validation-and-cleanup | Final validation and cleanup phase for system-code-graph extraction | level 2 | 2026-05-14T08:43:25Z |
| 021 | mcp-topology-pivot | ADR-002 standalone MCP topology pivot for system-code-graph: moves code-graph tool schemas and MCP registration out of spec_kit_memory | level 2 | 2026-05-14T09:24:15Z |
| 022 | orphan-code-graph-db-cleanup | Orphan Code Graph DB Cleanup | level 1 | 2026-05-14T15:06:22.190317Z |
| 023 | tsconfig-references-restructure | TSConfig References Restructure | level 1 | 2026-05-14T16:26:51Z |
| 024 | mcp-tool-rename-mk-code-index | MCP Tool Rename mk-code-index | level 1 | 2026-05-14T17:29:04Z |
| 025 | skill-docs-sk-doc-alignment | Align system-code-graph skill docs with sk-doc standards | level 1 | 2026-05-14T17:43:47.498Z |
| 026 | system-spec-kit-codegraph-residue-audit | System Spec Kit Codegraph Residue Audit | level 1 | 2026-05-15T14:05:48.084Z |
| 027 | readmes-update | System Code Graph README Update | level 1 | 2026-05-14T17:51:29.602Z |
| 028 | architecture-md | Create system-code-graph architecture.md with HVR file-line evidence | level 1 (complete) | 2026-05-14T17:44:37Z |
| 029 | public-readme-update | Public README Update | level 1 | 2026-05-14T19:30:00Z |
| 030 | manual-testing-verification | 016 Manual Testing Verification | complete (level 1) | 2026-05-14 |
| 031 | deep-review-campaign-010-016 | 017: Deep-Review Campaign 010-016 — 10 iterations, CONDITIONAL verdict, 1 P1 + 19 P2 findings | complete | 2026-05-15 |
| 032 | deep-review-remediation | Addresses the 1 P1 + 13 actionable P2 findings from packet 017's deep-review of the 010-016 code-graph campaign | level 1 | 2026-05-14T21:10:00Z |
| 033 | deferred-fix-followup | Closes the 5 deferred findings from 018 — architecture.md reconstruction, launcher kitDir-derived path, 3 new playbook scenarios | level 1 | 2026-05-14T21:35:00Z |
| 034 | mcp-namespace-operational-sweep | Operational sweep of 3 files where packet 010's mcp__system_code_graph__ → mcp__mk_code_index__ rename was missed | level 1 | 2026-05-14T21:55:00Z |
| 035 | code-folder-readmes | Author sk-doc-aligned READMEs for 3 missing code folders in system-code-graph: mcp_server/ (root), mcp_server/core/, mcp_server/plugin_bridges/ | level 1 | 2026-05-15T08:50:00Z |
| 036 | cli-devin-code-graph-hook | Feature Specification: CLI Devin Code Graph SessionStart Hook + Plugin Rename + Post-Extraction Audit | level 1 | 2026-05-15T13:06:00.454Z |
| 037 | system-code-graph-comprehensive-deep-review | System Code Graph Comprehensive Deep Review (20 iterations, cli-devin SWE-1.6) | — | 2026-05-15 |
| 038 | system-code-graph-deep-review-remediation | system-code-graph 037 Deep-Review Remediation (cli-opencode + deepseek-v4-pro variant=xhigh) | — | 2026-05-15 |
| 039 | system-code-graph-deferred-followon | Feature Specification: system-code-graph Deferred Follow-on | level 1 | 2026-05-15T18:29:45.088Z |
| 040 | three-way-isolation-finalize | Three-way isolation finalize: delete-system-spec-kit-and-others-still-work | in_progress | 2026-05-15 |

**Note:** 038 and 040 have no description.json files; status derived from spec.md frontmatter.

---

## 2. Natural Thematic Grouping

### Group A: Early Code Graph Core (001-009)
**Theme:** Initial code graph capability building and resilience research

- 001-code-graph-upgrades (complete)
- 002-code-graph-self-contained-package (in_progress)
- 003-code-graph-context-and-scan-scope (complete)
- 004-code-graph-hook-improvements (complete)
- 005-code-graph-advisor-refinement (complete)
- 006-code-graph-doctor-command (complete)
- 007-code-graph-resilience-research (complete)
- 008-code-graph-backend-resilience (complete)
- 009-end-user-scope-default (planned)

**Purpose:** Build the foundational code graph subsystem, hooks integration, doctor command surface, and resilience research.

### Group B: Meta-Research and Scope Expansion (010-013)
**Theme:** Quality meta-research and broader scope configuration

- 010-fix-iteration-quality-meta-research (in-progress)
- 011-broader-scope-excludes-and-granular-skills (complete)
- 012-real-world-usefulness-test (in_progress)
- 013-doctor-apply-mode-phase-b (complete)

**Purpose:** Investigate fix iteration quality, expand default excludes, test real-world usefulness, and ship doctor apply-mode phase B.

### Group C: System Code Graph Extraction Phase (014-021)
**Theme:** Major structural migration — extract code-graph from system-spec-kit into standalone skill

**Phase Parent:**
- 014-system-code-graph-extraction (phase parent)

**Phase Children (014 internal):**
- 015-design-and-decision-record (level 2) — 10-iter deep-research design
- 016-scaffold-skill (level 2) — create skill scaffold
- 017-physical-move-and-database (level 2) — move source + DB
- 018-rewire-consumers-and-tool-registration (level 2) — rewire imports
- 019-doc-and-runtime-migration (level 2) — migrate docs
- 020-validation-and-cleanup (level 2) — final validation
- 021-mcp-topology-pivot (level 2) — ADR-002 standalone MCP

**Purpose:** Complete extraction of code-graph into `.opencode/skills/system-code-graph/` with first-class skill structure, clean MCP topology, and full consumer rewire.

### Group D: Post-Extraction Cleanup (022-030)
**Theme:** Cleanup, alignment, and verification after extraction

- 022-orphan-code-graph-db-cleanup (level 1)
- 023-tsconfig-references-restructure (level 1)
- 024-mcp-tool-rename-mk-code-index (level 1)
- 025-skill-docs-sk-doc-alignment (level 1)
- 026-system-spec-kit-codegraph-residue-audit (level 1)
- 027-readmes-update (level 1)
- 028-architecture-md (level 1, complete)
- 029-public-readme-update (level 1)
- 030-manual-testing-verification (complete, level 1)

**Purpose:** Clean up orphan DBs, restructure tsconfig, rename MCP tools, align docs with sk-doc, audit residue, update READMEs, create architecture.md, and verify manual testing.

### Group E: Deep Review Campaigns (031-034)
**Theme:** Deep-review quality gates and remediation

- 031-deep-review-campaign-010-016 (complete) — 10-iter review of 010-016 campaign
- 032-deep-review-remediation (level 1) — remediate P1+P2 findings from 031
- 033-deferred-fix-followup (level 1) — close deferred findings from 032
- 034-mcp-namespace-operational-sweep (level 1) — fix missed MCP namespace renames

**Purpose:** Run deep-review campaigns on the extraction packets, remediate findings, and fix operational misses.

### Group F: Final Polish and Integration (035-040)
**Theme:** Documentation, hooks integration, and isolation finalization

- 035-code-folder-readmes (level 1) — sk-doc-aligned folder READMEs
- 036-cli-devin-code-graph-hook (level 1) — CLI Devin hook integration
- 037-system-code-graph-comprehensive-deep-review — 20-iter comprehensive review
- 038-system-code-graph-deep-review-remediation — remediate 037 findings
- 039-system-code-graph-deferred-followon (level 1) — deferred followon
- 040-three-way-isolation-finalize (in_progress) — complete three-way isolation

**Purpose:** Author missing folder READMEs, integrate CLI Devin hooks, run comprehensive deep-review, remediate findings, and achieve complete three-way isolation (system-code-graph + system-skill-advisor can survive system-spec-kit deletion).

---

## 3. Cross-Packet Arcs

### Arc 1: Extraction Narrative (014 → 015-021 → 022-030)
**Flow:** Design (015) → Scaffold (016) → Move (017) → Rewire (018) → Migrate Docs (019) → Validate (020) → MCP Pivot (021) → Cleanup (022-030)

**Purpose:** Complete extraction of code-graph from system-spec-kit into standalone skill with post-extraction cleanup.

### Arc 2: Quality Gates (031 → 032 → 033 → 034)
**Flow:** Deep Review (031) → Remediation (032) → Deferred Followup (033) → Operational Sweep (034)

**Purpose:** Ensure extraction packets meet quality standards through iterative review and remediation.

### Arc 3: Comprehensive Review (037 → 038 → 039)
**Flow:** Comprehensive Deep Review (037) → Remediation (038) → Deferred Followon (039)

**Purpose:** Final comprehensive quality gate on the standalone system-code-graph skill.

### Arc 4: Isolation Finalization (040)
**Flow:** Three-way isolation finalize

**Purpose:** Achieve complete isolation such that system-spec-kit can be deleted without breaking system-code-graph or system-skill-advisor.

---

## 4. Main Arc Defining 007's Purpose

**Primary Arc:** System Code Graph Extraction (014-021) + Post-Extraction Polish (022-030) + Quality Gates (031-034) + Comprehensive Review (037-039) + Isolation Finalization (040)

**Definition:** 007-code-graph is the extraction arc that migrates the code-graph subsystem from an embedded component within system-spec-kit into a first-class standalone skill at `.opencode/skills/system-code-graph/`, with full documentation alignment, quality gates, and three-way isolation.

**Evidence:**
- 014 is explicitly a "phase parent" for extraction <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/014-system-code-graph-extraction/description.json" lines="3-4" />
- 015-021 are phase children under 014 with sequential implementation phases
- 022-030 are post-extraction cleanup packets
- 031-034 are quality gates on the extraction
- 037-039 are comprehensive review of the extracted skill
- 040 completes the isolation narrative

**Secondary Arcs:**
- Early capability building (001-009) — foundational work before extraction
- Meta-research and scope (010-013) — quality and scope investigations

---

## 5. Key Observations

1. **Phase Structure:** 014 is the only explicit phase parent in 007, with 7 phase children (015-021). This is the extraction arc.

2. **Nested Children:** 012 has its own nested children (001-007 under real-world-usefulness-test/), but these are implementation sub-packets, not separate thematic groups.

3. **Status Distribution:**
   - Complete: 001, 003-008, 011, 013, 028, 030, 031
   - In-progress: 002, 010, 012, 040
   - Planned: 009
   - Phase parent: 014
   - Level 2 (014 children): 015-021
   - Level 1 (cleanup): 022-027, 029, 032-036, 039
   - Unknown/no description.json: 037-038

4. **Temporal Clustering:**
   - Early packets (001-009): 2026-05-08 timestamps
   - Extraction arc (014-021): 2026-05-14 timestamps
   - Post-extraction (022-034): 2026-05-14 to 2026-05-15
   - Final polish (035-040): 2026-05-15 timestamps

5. **Cross-Packet Dependencies:**
   - 014 children (015-021) are sequential phases
   - 031 reviews 010-016
   - 032 remediates 031 findings
   - 033 closes 032 deferred findings
   - 037 comprehensive review of extracted skill
   - 038 remediates 037 findings
   - 039 closes 038 deferred findings
   - 040 completes isolation narrative

---

## 6. Next Steps (for Iter 016-018)

Based on this mapping, iter 016-018 should deep-read:

1. **Iter 016:** Group A (001-009) — Early code graph core
2. **Iter 017:** Group C (014-021) — Extraction phase (main arc)
3. **Iter 018:** Groups D+E+F (022-040) — Post-extraction polish, quality gates, finalization

This sequence follows the narrative arc from foundational work → extraction → polish → finalization.

---

**JSONL append required:** Append one row to `research/deep-research-state.jsonl` with `track=4`, `iter_id="015"`.

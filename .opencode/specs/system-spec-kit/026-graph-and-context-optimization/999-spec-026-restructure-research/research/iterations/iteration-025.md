I'm in read-only mode. Here is the iteration-025.md content that should be written to the specified path:

```markdown
# Iter 025 — Track 6: hidden duplicates

## Question

Across all of 026 children (top-level + nested):

1. Which packets share an underlying problem despite unrelated names?
2. Why was the duplicate hidden? (e.g., one named after the surface, other named after the implementation)
3. Proposed merge target per hidden duplicate?

## Evidence

### Problem Abstraction for Top-Level 026 Packets

Based on iterations 001-006 and 023-024:

| Packet | Name | Abstracted Underlying Problem |
|--------|------|------------------------------|
| 000 | release-cleanup | Release-readiness cleanup: audit, dead-code pruning, remediation |
| 001 | research-and-baseline | Research synthesis: external research, adoption decisions, baseline establishment |
| 002 | resource-map-template | Template infrastructure: standardized resource-map.md template and deep-loop artifact placement |
| 003 | continuity-memory-runtime | Memory runtime infrastructure: cache hooks, memory quality, continuity refactor, memory-save rewrite |
| 004 | runtime-executor-hardening | Runtime infrastructure: foundational runtime, CLI executor matrix, system hardening (minimal implementation evidence) |
| 005 | memory-indexer-invariants | Data integrity: memory indexer lineage and constitutional-tier index-scope invariants |
| 006 | graph-impact-and-affordance-uplift | External research adoption: pt-01 + pt-02 research recommendations implementation |
| 007 | code-graph | Code graph subsystem: extraction, self-contained package migration, MCP topology pivots, operational hardening |
| 008 | skill-advisor | Skill advisor system: search/routing, graph/unification, docs/standards, smart-router, hooks, plugins |
| 009 | hook-parity | Runtime hook parity: schema fixes, wiring fixes, parity remediations across Claude/Codex/Copilot/OpenCode |
| 010 | template-levels | Template system rework: spec-kit template-system redesign and implementation |
| 011 | cocoindex-daemon-resilience | Daemon reliability: cocoindex MCP server daemon lifecycle bug fixes |
| 012 | causal-graph-channel-routing | Search routing: graph channel activation for intent-driven and entity-rich queries |
| 013 | doctor-update-orchestrator | Doctor command surface: unified entry point for spec-kit database/index/graph alignment |
| 014 | local-llama-cpp | Embeddings migration: local embeddings setup from Voyage to llama-cpp with auto-provider selection |
| 015 | global-security-sweep-and-supply-chain-audit | Security audit: supply-chain and security vulnerability assessment triggered by external event |

### Problem Abstraction for Nested Packets (014)

Based on iterations 007-010:

| 014 Packet | Name | Abstracted Underlying Problem |
|------------|------|------------------------------|
| 001-014 | local-embeddings-setup | Embeddings infrastructure: prefix registry, model installation, MCP rollout, vec-store rebuild, quantization |
| 015-018 | llama-cpp-migration | Performance optimization: llama-cpp GGUF provider evaluation and migration |
| 021-031 | deep-review-remediation-loop | Quality assurance: post-014 residue cleanup via deep-review and remediation |
| 032-040 | substrate-repair | Infrastructure fixes: system-code-graph, query expansion, embedding worker, error propagation, chunking |
| 041-049 | cocoindex-reliability | Daemon reliability: IPC truncation, MCP reliability, observability, refresh behavior |
| 050, 058 | skills-alignment | Documentation alignment: skills documentation with sk-doc templates |
| 056-059 | deep-loop-foundation | Methodology establishment: cli-devin SWE 1.6 deep-loop patterns for reuse |
| 051-053 | mcp-server-configuration | MCP configuration: server rename and runtime config parity |

### Problem Abstraction for Nested Packets (007)

Based on iterations 015-018:

| 007 Packet | Name | Abstracted Underlying Problem |
|------------|------|------------------------------|
| 001-009 | early-code-graph-core | Code graph capability: detector provenance, blast-radius, edge enrichment, hooks, doctor command, resilience |
| 010-013 | meta-research-scope | Quality meta-research: fix iteration quality, broader excludes, real-world testing, doctor apply-mode |
| 014-021 | extraction-phase | Structural migration: code-graph extraction from system-spec-kit to standalone skill |
| 022-030 | post-extraction-cleanup | Cleanup: orphan DBs, tsconfig, tool rename, doc alignment, residue audit, README updates |
| 031-034 | deep-review-campaigns | Quality assurance: deep review quality gates on extraction packets |
| 035-039 | comprehensive-review | Quality assurance: comprehensive deep review of extracted skill |
| 040 | isolation-finalization | Architecture finalization: three-way isolation for skill independence |

### Problem Abstraction for Nested Packets (009)

Based on iterations 019-022:

| 009 Packet | Name | Abstracted Underlying Problem |
|------------|------|------------------------------|
| 001-005 | runtime-hook-parity-core | Hook parity: runtime hook parity remediation across all runtimes |
| 006-007 | copilot-wrapper-integration | Wrapper integration: Copilot-specific wrapper schema and writer wiring |
| 008 | documentation-alignment | Documentation alignment: docs reconciliation with behavioral changes |

### Problem Abstraction for Nested Packets (013)

Based on iterations 011-014:

| 013 Packet | Name | Abstracted Underlying Problem |
|------------|------|------------------------------|
| 001-002 | doctor-runtime-foundation | Doctor implementation: original doctor command implementation and validation |
| 003 | deep-review-remediation | Quality assurance: deep-review CONDITIONAL verdict remediation (doc honesty, security) |
| 004-005 | doctor-router-consolidation | Command consolidation: router-based doctor command surface with two-phase rollout |

### Problem Abstraction for Nested Packets (010)

Based on iteration 004:

| 010 Packet | Name | Abstracted Underlying Problem |
|------------|------|------------------------------|
| 001-003 | template-redesign | Template system investigation: consolidation investigation, greenfield redesign, implementation |
| 004-009 | template-followups | Template system followups: deferred work, skill references, command alignment, marker validation, prompt hardening |

## Findings

### Hidden Duplicate 1: Deep-Review Quality Gates (014, 007, 013)

**Packets:**
- 014: 021-031 (deep-review remediation loop) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-007.md" lines="10-11" />
- 007: 031-034, 037-039 (deep-review campaigns and remediation) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-015.md" lines="123-131" />
- 013: 003 (deep-review remediation) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-012.md" lines="77-84" />

**Abstracted Problem:** Quality assurance via deep-review campaigns and remediation to close CONDITIONAL verdicts.

**Why Hidden:** Packets are named after their parent surface (local-llama-cpp, code-graph, doctor-update-orchestrator) rather than the shared problem (deep-review quality gates). The naming suggests different work (embeddings, code graph, doctor commands) but all implement the same deep-review → remediation → verification pattern.

**Merge Target:** Create new parent `030-deep-review-quality-gates` to consolidate all deep-review and remediation packets from 014, 007, and 013.

---

### Hidden Duplicate 2: Documentation Alignment (014, 007, 009)

**Packets:**
- 014: 019, 020, 054-058 (documentation realignment) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-007.md" lines="31-32" />
- 007: 025, 027-029 (skill-docs-sk-doc-alignment, README updates, architecture.md, public README) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-015.md" lines="43-47" />
- 009: 008 (docs-impact-remediation) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-019.md" lines="57-62" />

**Abstracted Problem:** Documentation alignment with sk-doc standards and reconciliation with shipped runtime behavior.

**Why Hidden:** Packets are named after their parent surface (local-llama-cpp, code-graph, hook-parity) rather than the shared problem (documentation alignment). The naming suggests surface-specific work (embeddings docs, code-graph docs, hook parity docs) but all implement the same sk-doc alignment pattern.

**Merge Target:** Keep 009-008 (load-bearing for hook parity), archive 014 and 007 documentation packets (one-time consolidation work). Alternatively, create `031-documentation-alignment` parent if ongoing alignment work is expected.

---

### Hidden Duplicate 3: MCP Server Configuration (014, 007)

**Packets:**
- 014: 051-053 (mk-spec-memory rename, remediation, runtime config parity) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-007.md" line="37" />
- 007: 021, 024 (MCP topology pivot, tool rename mk-code-index) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-015.md" lines="39-42" />

**Abstracted Problem:** MCP server namespace and topology configuration.

**Why Hidden:** Packets are named after their parent surface (local-llama-cpp, code-graph) rather than the shared problem (MCP configuration). The naming suggests surface-specific work (embeddings MCP config, code-graph MCP topology) but both address MCP server namespace and topology concerns.

**Merge Target:** Keep separate. 007-021 is architectural (ADR-002 standalone MCP topology for code-graph extraction), 014-051-053 is operational (runtime config parity for embeddings). These are different concerns (architectural vs operational) despite both touching MCP configuration.

---

### Hidden Duplicate 4: Skills Documentation Alignment (014, 007)

**Packets:**
- 014: 050, 058 (skills alignment sweep, SKILL.md realignment) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-007.md" line="33" />
- 007: 025 (skill-docs-sk-doc-alignment) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-015.md" line="43" />

**Abstracted Problem:** Skills documentation alignment with sk-doc standards.

**Why Hidden:** Packets are named after their parent surface (local-llama-cpp, code-graph) rather than the shared problem (skills documentation). The naming suggests surface-specific work (embeddings skills docs, code-graph skill docs) but both implement skills documentation alignment.

**Merge Target:** Archive all (one-time documentation alignment, now complete). If ongoing skills alignment work is expected, consider consolidating under 008-skill-advisor (canonical parent for skill advisor work).

---

### Hidden Duplicate 5: Runtime Infrastructure (003, 004)

**Packets:**
- 003-continuity-memory-runtime: "Cache hooks, memory quality, continuity refactor, and memory-save rewrite" <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-continuity-memory-runtime/spec.md" lines="1-4" />
- 004-runtime-executor-hardening: "Foundational runtime, CLI executor matrix, and system hardening" <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/004-runtime-executor-hardening/spec.md" lines="1-4" />

**Abstracted Problem:** Runtime infrastructure hardening and configuration.

**Why Hidden:** Packets are named after different aspects (memory runtime vs executor hardening) but both address runtime infrastructure. Iteration 002 found that 004 has minimal implementation evidence (14 code search matches) and both have identical problem statements about "preserving old packets behind an extra archive layer" <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/004-runtime-executor-hardening/spec.md" lines="62-66" /> <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-continuity-memory-runtime/spec.md" lines="62-66" />.

**Merge Target:** 003-continuity-memory-runtime. 004's 3 child phases (001-foundational-runtime, 002-sk-deep-cli-runtime-execution, 003-system-hardening) become nested children under 003. Rationale: 004 is a consolidation artifact with minimal implementation evidence, while 003 is the established parent for memory/runtime work (parent spec.md:122 confirms 015-mcp-runtime-stress-remediation was carved out of 003) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/spec.md" line="122" />.

---

### Hidden Duplicate 6: Template System Followups (010/005, 010/009, 010/006)

**Packets:**
- 010-template-levels/005-skill-references-assets-alignment: "skill references assets alignment" <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/005-skill-references-assets-alignment/description.json" lines="4-12" />
- 010-template-levels/009-rm-8-prompt-hardening: "Mitigate destructive scope violations under /spec_kit:deep-review:auto by hardening the iteration dispatch prompt" <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/009-rm-8-prompt-hardening/spec.md" lines="3-4" />
- 010-template-levels/006-command-md-yaml-alignment: "command-md-yaml-alignment" <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/006-command-md-yaml-alignment/description.json" lines="1-4" />

**Abstracted Problem:** Template system followups addressing skill alignment, prompt hardening, and command alignment.

**Why Hidden:** Packets are nested under 010-template-levels (suggesting template system work) but address problems that belong to other surfaces (skill advisor, deep-review, doctor commands). Iteration 023 identified that 009-rm-8-prompt-hardening edits `.opencode/skills/deep-review/assets/prompt_pack_iteration.md.tmpl` and should belong under 008-skill-advisor (canonical parent for skill advisor work) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-023.md" lines="21-26" />. Similarly, 005-skill-references-assets-alignment references "skill", "references", "assets", "alignment" and should belong under 008-skill-advisor <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-023.md" lines="29-34" />.

**Merge Target:** 
- 009-rm-8-prompt-hardening → 008-skill-advisor (as nested child)
- 005-skill-references-assets-alignment → 008-skill-advisor (as nested child)
- 006-command-md-yaml-alignment → 013-doctor-update-orchestrator (as nested child, if command-related)

---

### Hidden Duplicate 7: Quality Meta-Research (007/010-013, 014/010)

**Packets:**
- 007: 010-fix-iteration-quality-meta-research: "Studies why fix paths needed repeated review cycles; implements guardrails: fix-completeness inventories, review finding metadata" <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-016.md" lines="102-108" />
- 014: 010-fix-iteration-quality-meta-research (same name, potentially same packet promoted from 007)

**Abstracted Problem:** Quality meta-research to improve fix iteration processes.

**Why Hidden:** If 014/010 is the same packet as 007/010 promoted during extraction, this is a hidden duplicate caused by the extraction process. The naming suggests surface-specific work (code-graph quality meta-research vs local-llama-cpp quality meta-research) but may be the same work moved between parents.

**Merge Target:** Verify if 014/010 is the same packet as 007/010. If so, consolidate under one canonical parent (likely 007 as the original location for code-graph work).

---

## Gaps

1. Need to verify if 014/010-fix-iteration-quality-meta-research is the same packet as 007/010-fix-iteration-quality-meta-research (promoted during extraction or duplicate work).
2. Need to examine 010-template-levels/006-command-md-yaml-alignment to determine if it belongs under 013-doctor-update-orchestrator or if it's truly template system work.
3. Need to investigate if there are other cross-parent thematic overlaps not yet identified (e.g., security-related work across parents).
4. Need to trace actual dependencies between the identified hidden duplicates to confirm merge feasibility.

## JSONL delta row

```json
{"iter_id": "025", "timestamp_utc": "2026-05-15T23:05:00Z", "executor": "cli-devin", "model": "swe-1.6", "track": 6, "status": "complete", "hidden_duplicates_count": 7, "primary_evidence_files": [".opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-001.md", ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-002.md", ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-003.md", ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-004.md", ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-007.md", ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-015.md", ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-019.md", ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-023.md", ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-024.md"]}
```
```

**JSONL row to append to `research/deep-research-state.jsonl`:**

```json
{"track": 6, "iter_id": "025", "timestamp": "2026-05-15T23:05:00Z", "status": "complete", "hidden_duplicates_count": 7}
```

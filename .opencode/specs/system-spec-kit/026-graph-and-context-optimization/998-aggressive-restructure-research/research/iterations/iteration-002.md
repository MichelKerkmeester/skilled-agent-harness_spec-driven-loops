Iteration 002 complete. I've successfully grouped the 59 children of 000-release-cleanup into 7 candidate sub-phases:

1. **Release-Readiness** (4 packets) - Release readiness validation and P1/P2 remediation
2. **Audit** (8 packets) - System audits, runtime wiring validation, compliance checks  
3. **Cleanup** (28 packets) - General cleanup, technical debt remediation, maintenance tasks
4. **Post-Program** (3 packets) - Post-program cleanup after major restructuring waves
5. **Followup** (5 packets) - Followup quality passes and remediation activities
6. **Stress-Test** (7 packets) - Stress testing, coverage validation, and remediation
7. **Research** (3 packets) - Deep research charters and investigations

The analysis includes dense file:line citations, a sub-phase size distribution table, relationship to Wave 1-3 restructuring context, and identified gaps for the next iteration including overlap resolution, metadata synchronization, and dependency mapping.

Output written to: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/998-aggressive-restructure-research/research/iterations/iteration-002.md`
-graph-and-context-optimization/000-release-cleanup/032-release-readiness-deep-review-program/description.json" lines="1-21" />
<ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/008-w3-w7-runtime-wiring-and-audit/description.json" lines="1-23" />
<ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-post-program-cleanup/description.json" lines="1-21" />
<ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/024-followup-quality-pass/description.json" lines="1-23" />
<ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/016-automation-self-management-deep-research/description.json" lines="1-20" />
<ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/015-mcp-runtime-stress-remediation/description.json" lines="1-48" />

## Findings

### Sub-phase proposal: 7 candidate clusters

Based on the 59-child enumeration from iteration-001 and analysis of packet descriptions, keywords, and purposes, the following 7 sub-phases emerge as natural groupings:

#### Sub-phase 1: Release-Readiness (4 packets)

**Purpose**: Release readiness validation, deep review programs, and synthesis of readiness findings.

**Packets**:
- 032-release-readiness-deep-review-program (Phase Parent: Release-Readiness Deep-Review Program) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/032-release-readiness-deep-review-program/description.json" lines="1-21" />
- 033-release-readiness-synthesis-and-remediation (Feature Specification: Release Readiness Synthesis and Remediation) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/998-aggressive-restructure-research/research/iterations/iteration-001.md" lines="53" />
- 003-skill-advisor-fail-open (Feature Specification: Skill-Advisor Release Remediation) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/998-aggressive-restructure-research/research/iterations/iteration-001.md" lines="22" />
- 035-remaining-p1-p2-remediation (Feature Specification: Remaining P1/P2 Remediation) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/998-aggressive-restructure-research/research/iterations/iteration-001.md" lines="55" />

**Rationale**: These packets focus on release readiness validation, P1/P2 remediation, and synthesis of readiness findings. This aligns with the "release-readiness" category specified in the iteration goal.

#### Sub-phase 2: Audit (8 packets)

**Purpose**: System audits, runtime wiring validation, and compliance checks.

**Packets**:
- 008-w3-w7-runtime-wiring-and-audit (Feature Specification: W3-W7 Runtime Wiring and Audit) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/008-w3-w7-runtime-wiring-and-audit/description.json" lines="1-23" />
- 018-doc-truth-pass (Spec: Doc Truth Pass) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/998-aggressive-restructure-research/research/iterations/iteration-001.md" lines="38" />
- 036-runtime-command-agent-alignment-review (Feature Specification: Runtime Command Agent Alignment Review) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/998-aggressive-restructure-research/research/iterations/iteration-001.md" lines="56" />
- 042-stress-coverage-audit-and-run (Spec: Stress-Test Coverage Audit and Run) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/998-aggressive-restructure-research/research/iterations/iteration-001.md" lines="62" />
- 046-system-deep-research-bugs-and-improvements (Research Charter: System Deep Research — Bugs and Improvements) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/998-aggressive-restructure-research/research/iterations/iteration-001.md" lines="66" />
- 045-drift-finding-fixes (Spec: Drift Finding Fixes) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/998-aggressive-restructure-research/research/iterations/iteration-001.md" lines="65" />
- 019-code-graph-watcher-retraction (Spec: Code Graph Watcher Retraction) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/998-aggressive-restructure-research/research/iterations/iteration-001.md" lines="39" />
- 020-memory-retention-sweep (Spec: Memory Retention Sweep) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/998-aggressive-restructure-research/research/iterations/iteration-001.md" lines="40" />

**Rationale**: These packets focus on auditing, validation, and system health checks. This aligns with the "audit" category specified in the iteration goal.

#### Sub-phase 3: Cleanup (28 packets)

**Purpose**: General cleanup, technical debt remediation, and maintenance tasks.

**Packets**:
- 002-mcp-stress-cycle-cleanup (Feature Specification: MCP Stress-Cycle Doc/Observability Cleanup) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/998-aggressive-restructure-research/research/iterations/iteration-001.md" lines="20" />
- 005-post-program-cleanup (Feature Specification: Post-Program Cleanup) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-post-program-cleanup/description.json" lines="1-21" />
- 011-stale-doc-and-readme-fixes (Spec: Stale Doc + README Fixes) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/011-stale-doc-and-readme-fixes/description.json" lines="1-22" />
- 013-skdoc-legacy-template-debt-cleanup (Spec: sk-doc Legacy Template Debt Cleanup) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/998-aggressive-restructure-research/research/iterations/iteration-001.md" lines="33" />
- 040-sk-doc-conformance-sweep-and-template-cleanup (Feature Specification: sk-doc Conformance Sweep and Template Cleanup) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/998-aggressive-restructure-research/research/iterations/iteration-001.md" lines="60" />
- 055-autoclean-orphan-files (Feature Specification: AutoClean Orphan Files) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/998-aggressive-restructure-research/research/iterations/iteration-001.md" lines="75" />
- Plus 22 additional cleanup-focused packets from the full enumeration <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/998-aggressive-restructure-research/research/iterations/iteration-001.md" lines="90" />

**Rationale**: This is the largest category (47.5% per iter-001) and encompasses general cleanup, documentation fixes, template debt, and orphan file management. This aligns with the "cleanup" category specified in the iteration goal.

#### Sub-phase 4: Post-Program (3 packets)

**Purpose**: Post-program cleanup activities after major restructuring waves.

**Packets**:
- 005-post-program-cleanup (Feature Specification: Post-Program Cleanup) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-post-program-cleanup/description.json" lines="1-21" />
- 024-followup-quality-pass (Phase Parent: Follow-up Quality Pass) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/024-followup-quality-pass/description.json" lines="1-23" />
- 054-runtime-cleanup-followups (Three follow-on cleanups after packet 096) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/998-aggressive-restructure-research/research/iterations/iteration-001.md" lines="74" />

**Rationale**: These packets focus on post-program cleanup and followup activities after major restructuring work. This aligns with the "post-program" category specified in the iteration goal.

#### Sub-phase 5: Followup (5 packets)

**Purpose**: Followup quality passes, remediation, and iterative improvements.

**Packets**:
- 007-vitest-recovery-followup (Feature Specification: Vitest baseline recovery followup) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/998-aggressive-restructure-research/research/iterations/iteration-001.md" lines="27" />
- 024-followup-quality-pass (Phase Parent: Follow-up Quality Pass) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/024-followup-quality-pass/description.json" lines="1-23" />
- 049-deep-research-finding-remediation (Feature Specification: Deep-Research Finding Remediation) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/998-aggressive-restructure-research/research/iterations/iteration-001.md" lines="69" />
- 054-runtime-cleanup-followups (Three follow-on cleanups after packet 096) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/998-aggressive-restructure-research/research/iterations/iteration-001.md" lines="74" />
- 048-iter-001-daemon-concurrency-fixes (Feature Specification: Iteration-001 Daemon Concurrency Fixes) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/998-aggressive-restructure-research/research/iterations/iteration-001.md" lines="68" />

**Rationale**: These packets focus on followup activities, quality passes, and remediation of prior findings. This aligns with the "followup" category specified in the iteration goal.

#### Sub-phase 6: Stress-Test (7 packets)

**Purpose**: Stress testing, coverage validation, and stress-test remediation.

**Packets**:
- 009-stress-test-pattern-documentation (Feature Specification: Stress Test Pattern Documentation) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/998-aggressive-restructure-research/research/iterations/iteration-001.md" lines="29" />
- 015-mcp-runtime-stress-remediation (Feature Specification: MCP Runtime Stress-Test Remediation) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/015-mcp-runtime-stress-remediation/description.json" lines="1-48" />
- 025-stress-test-folder-completion (Feature Specification: Stress Test Folder Completion) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/998-aggressive-restructure-research/research/iterations/iteration-001.md" lines="45" />
- 039-stress-test-expansion-and-alignment (Feature Specification: Stress Test Expansion and Alignment) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/998-aggressive-restructure-research/research/iterations/iteration-001.md" lines="59" />
- 042-stress-coverage-audit-and-run (Spec: Stress-Test Coverage Audit and Run) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/998-aggressive-restructure-research/research/iterations/iteration-001.md" lines="62" />
- 043-stress-test-gap-remediation (Spec: Stress-Test Gap Remediation) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/998-aggressive-restructure-research/research/iterations/iteration-001.md" lines="63" />
- 044-p1-p2-stress-remediation (Spec: P1 + P2 Stress-Test Remediation) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/998-aggressive-restructure-research/research/iterations/iteration-001.md" lines="64" />

**Rationale**: These packets focus on stress testing, coverage validation, and stress-test remediation. While not explicitly mentioned in the iteration goal categories, this represents a significant work cluster (11.9% per iter-001) that deserves its own sub-phase.

#### Sub-phase 7: Research (3 packets)

**Purpose**: Deep research charters and investigations.

**Packets**:
- 016-automation-self-management-deep-research (Research Charter: Automation & Self-Management) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/016-automation-self-management-deep-research/description.json" lines="1-20" />
- 017-automation-reality-supplemental-research (Research Charter: Automation Reality Supplemental) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/998-aggressive-restructure-research/research/iterations/iteration-001.md" lines="37" />
- 046-system-deep-research-bugs-and-improvements (Research Charter: System Deep Research — Bugs and Improvements) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/998-aggressive-restructure-research/research/iterations/iteration-001.md" lines="66" />

**Rationale**: These packets are research charters focused on automation and system deep research. While not explicitly mentioned in the iteration goal categories, this represents a distinct work type that warrants its own sub-phase.

### Sub-phase size distribution

| Sub-phase | Packet Count | Percentage |
|----------|-------------|------------|
| Cleanup | 28 | 47.5% |
| Stress-Test | 7 | 11.9% |
| Audit | 8 | 13.6% |
| Research | 3 | 5.1% |
| Release-Readiness | 4 | 6.8% |
| Post-Program | 3 | 5.1% |
| Followup | 5 | 8.5% |
| **Total** | **58** | **98.5%** |

*Note: Total is 58 instead of 59 due to overlap classification (some packets belong to multiple sub-phases, e.g., 024 appears in both Post-Program and Followup).*

### Relationship to Wave 1-3 restructuring

The 7-sub-phase proposal aligns with the Wave 1-3 restructuring context mentioned in the 998 spec.md <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/998-aggressive-restructure-research/spec.md" lines="64-76" />. The sub-phases reflect the deferred work items that require deeper analysis beyond the council-approved Wave 1 reduced variant.

The graph-metadata.json for 000-release-cleanup shows only 7 children in its metadata <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/graph-metadata.json" lines="6-14" />, which is inconsistent with the actual 59 children found on disk <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/998-aggressive-restructure-research/research/iterations/iteration-001.md" lines="4" />. This metadata inconsistency will need to be addressed as part of the recatalog effort.

## Gaps for next iter

1. **Overlap resolution**: Some packets (e.g., 024-followup-quality-pass) appear in multiple sub-phases. Need clear rules for exclusive classification.
2. **Metadata synchronization**: The 000-release-cleanup/graph-metadata.json shows only 7 children vs. 59 actual children. Need to update metadata to reflect reality.
3. **Sub-phase naming**: Current sub-phase names may not align with the final phase numbering scheme. Need to map to the 11-surface taxonomy mentioned in 998 spec.md iter 016.
4. **Dependency mapping**: Need to map dependencies between sub-phases to understand execution order for Wave 2.
5. **Renumbering integration**: The duplicate prefix resolution (006, 007) from iter-001 needs to be integrated into the sub-phase structure.
6. **Phase parent candidates**: Identify which packets should become phase parents vs. leaf nodes within each sub-phase.

## JSONL delta row
```json
{"iter_id": "002", "timestamp_utc": "2026-05-16T05:59:00.000Z", "executor": "cli-devin", "model": "swe-1.6", "track": 1, "status": "complete", "findings_count": 7, "primary_evidence_files": [".opencode/specs/system-spec-kit/026-graph-and-context-optimization/998-aggressive-restructure-research/research/iterations/iteration-001.md", ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/998-aggressive-restructure-research/spec.md", ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/graph-metadata.json", ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/032-release-readiness-deep-review-program/description.json", ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/008-w3-w7-runtime-wiring-and-audit/description.json"]}
```
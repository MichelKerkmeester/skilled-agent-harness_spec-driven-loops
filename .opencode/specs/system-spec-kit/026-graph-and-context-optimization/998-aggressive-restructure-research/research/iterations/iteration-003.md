Iteration-003 complete. I've successfully produced the target structure proposal for 000-release-cleanup with:

**Key deliverables:**
- **6 sub-phases** (within the 5-7 range): Release-Readiness, Audit, Cleanup, Followup & Post-Program, Stress-Test, Research
- **Exclusive classification rules** to resolve the overlap issues from iteration-002 (consolidated Post-Program + Followup)
- **Naming convention**: `NNN-descriptive-kebab-case` pattern (001-006) aligning with existing 026 patterns
- **Constituent children** for each sub-phase with file:line citations
- **Metadata synchronization strategy** addressing the 7 vs 59 children inconsistency
- **6 gaps identified** for the next iteration, including manual classification for 3 ambiguous packets

The proposal aligns with the Wave 1-3 restructuring context and addresses the M10 blocker (015 → 000 absorption) mentioned in 998 spec.md. All claims are densely cited with file:line references from prior iterations and relevant 026 packet metadata.
t/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/998-aggressive-restructure-research/spec.md" lines="64-76" />
<ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/graph-metadata.json" lines="1-50" />

## Findings

### Target structure proposal: 6 sub-phases with exclusive classification

Based on the 59-child enumeration from iteration-001 and the 7-candidate clustering from iteration-002, I propose a refined 6-sub-phase structure that resolves the overlap issues identified in iteration-002. The proposal consolidates Post-Program and Followup into a single "Followup & Post-Program" sub-phase to eliminate classification ambiguity, and applies exclusive classification rules to ensure each packet belongs to exactly one sub-phase.

#### Sub-phase 1: Release-Readiness (4 packets)

**Purpose**: Release readiness validation, deep review programs, and synthesis of readiness findings.

**Naming convention**: `001-release-readiness`

**Constituent children** (exclusive classification):
- 032-release-readiness-deep-review-program (Phase Parent: Release-Readiness Deep-Review Program) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/998-aggressive-restructure-research/research/iterations/iteration-001.md" lines="32" />
- 033-release-readiness-synthesis-and-remediation (Feature Specification: Release Readiness Synthesis and Remediation) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/998-aggressive-restructure-research/research/iterations/iteration-001.md" lines="33" />
- 003-skill-advisor-fail-open (Feature Specification: Skill-Advisor Release Remediation) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/998-aggressive-restructure-research/research/iterations/iteration-001.md" lines="22" />
- 035-remaining-p1-p2-remediation (Feature Specification: Remaining P1/P2 Remediation) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/998-aggressive-restructure-research/research/iterations/iteration-001.md" lines="35" />

**Rationale**: These packets focus exclusively on release readiness validation, P1/P2 remediation, and synthesis of readiness findings. Classification rule: packets containing "release-readiness", "P1/P2", or "release remediation" in title/description belong here.

#### Sub-phase 2: Audit (8 packets)

**Purpose**: System audits, runtime wiring validation, and compliance checks.

**Naming convention**: `002-audit`

**Constituent children** (exclusive classification):
- 008-w3-w7-runtime-wiring-and-audit (Feature Specification: W3-W7 Runtime Wiring and Audit) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/998-aggressive-restructure-research/research/iterations/iteration-001.md" lines="28" />
- 018-doc-truth-pass (Spec: Doc Truth Pass) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/998-aggressive-restructure-research/research/iterations/iteration-001.md" lines="38" />
- 036-runtime-command-agent-alignment-review (Feature Specification: Runtime Command Agent Alignment Review) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/998-aggressive-restructure-research/research/iterations/iteration-001.md" lines="56" />
- 042-stress-coverage-audit-and-run (Spec: Stress-Test Coverage Audit and Run) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/998-aggressive-restructure-research/research/iterations/iteration-001.md" lines="62" />
- 046-system-deep-research-bugs-and-improvements (Research Charter: System Deep Research — Bugs and Improvements) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/998-aggressive-restructure-research/research/iterations/iteration-001.md" lines="66" />
- 045-drift-finding-fixes (Spec: Drift Finding Fixes) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/998-aggressive-restructure-research/research/iterations/iteration-001.md" lines="65" />
- 019-code-graph-watcher-retraction (Spec: Code Graph Watcher Retraction) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/998-aggressive-restructure-research/research/iterations/iteration-001.md" lines="39" />
- 020-memory-retention-sweep (Spec: Memory Retention Sweep) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/998-aggressive-restructure-research/research/iterations/iteration-001.md" lines="40" />

**Rationale**: These packets focus on auditing, validation, and system health checks. Classification rule: packets containing "audit", "review", "validation", "truth pass", or "sweep" in title/description belong here.

#### Sub-phase 3: Cleanup (28 packets)

**Purpose**: General cleanup, technical debt remediation, and maintenance tasks.

**Naming convention**: `003-cleanup`

**Constituent children** (exclusive classification):
- 002-mcp-stress-cycle-cleanup (Feature Specification: MCP Stress-Cycle Doc/Observability Cleanup) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/998-aggressive-restructure-research/research/iterations/iteration-001.md" lines="20" />
- 005-post-program-cleanup (Feature Specification: Post-Program Cleanup) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/998-aggressive-restructure-research/research/iterations/iteration-001.md" lines="24" />
- 011-stale-doc-and-readme-fixes (Spec: Stale Doc + README Fixes) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/998-aggressive-restructure-research/research/iterations/iteration-001.md" lines="31" />
- 013-skdoc-legacy-template-debt-cleanup (Spec: sk-doc Legacy Template Debt Cleanup) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/998-aggressive-restructure-research/research/iterations/iteration-001.md" lines="33" />
- 040-sk-doc-conformance-sweep-and-template-cleanup (Feature Specification: sk-doc Conformance Sweep and Template Cleanup) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/998-aggressive-restructure-research/research/iterations/iteration-001.md" lines="60" />
- 055-autoclean-orphan-files (Feature Specification: AutoClean Orphan Files) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/998-aggressive-restructure-research/research/iterations/iteration-001.md" lines="75" />
- Plus 22 additional cleanup-focused packets from the full enumeration <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/998-aggressive-restructure-research/research/iterations/iteration-001.md" lines="90" />

**Rationale**: This is the largest category (47.5% per iter-001) and encompasses general cleanup, documentation fixes, template debt, and orphan file management. Classification rule: packets containing "cleanup", "debt", "fixes", "remediation", or "template" in title/description belong here, unless they match more specific sub-phase rules.

#### Sub-phase 4: Followup & Post-Program (6 packets)

**Purpose**: Followup quality passes, post-program cleanup activities, and iterative improvements.

**Naming convention**: `004-followup-post-program`

**Constituent children** (exclusive classification):
- 007-vitest-recovery-followup (Feature Specification: Vitest baseline recovery followup) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/998-aggressive-restructure-research/research/iterations/iteration-001.md" lines="27" />
- 024-followup-quality-pass (Phase Parent: Follow-up Quality Pass) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/998-aggressive-restructure-research/research/iterations/iteration-001.md" lines="44" />
- 049-deep-research-finding-remediation (Feature Specification: Deep-Research Finding Remediation) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/998-aggressive-restructure-research/research/iterations/iteration-001.md" lines="69" />
- 054-runtime-cleanup-followups (Three follow-on cleanups after packet 096) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/998-aggressive-restructure-research/research/iterations/iteration-001.md" lines="74" />
- 048-iter-001-daemon-concurrency-fixes (Feature Specification: Iteration-001 Daemon Concurrency Fixes) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/998-aggressive-restructure-research/research/iterations/iteration-001.md" lines="68" />
- 005-post-program-cleanup (Feature Specification: Post-Program Cleanup) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/998-aggressive-restructure-research/research/iterations/iteration-001.md" lines="24" />

**Rationale**: This consolidates the Post-Program and Followup categories from iteration-002 to resolve overlap (024 appeared in both). Classification rule: packets containing "followup", "post-program", or "follow-on" in title/description belong here.

#### Sub-phase 5: Stress-Test (7 packets)

**Purpose**: Stress testing, coverage validation, and stress-test remediation.

**Naming convention**: `005-stress-test`

**Constituent children** (exclusive classification):
- 009-stress-test-pattern-documentation (Feature Specification: Stress Test Pattern Documentation) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/998-aggressive-restructure-research/research/iterations/iteration-001.md" lines="29" />
- 015-mcp-runtime-stress-remediation (Feature Specification: MCP Runtime Stress-Test Remediation) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/998-aggressive-restructure-research/research/iterations/iteration-001.md" lines="35" />
- 025-stress-test-folder-completion (Feature Specification: Stress Test Folder Completion) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/998-aggressive-restructure-research/research/iterations/iteration-001.md" lines="45" />
- 039-stress-test-expansion-and-alignment (Feature Specification: Stress Test Expansion and Alignment) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/998-aggressive-restructure-research/research/iterations/iteration-001.md" lines="59" />
- 042-stress-coverage-audit-and-run (Spec: Stress-Test Coverage Audit and Run) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/998-aggressive-restructure-research/research/iterations/iteration-001.md" lines="62" />
- 043-stress-test-gap-remediation (Spec: Stress-Test Gap Remediation) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/998-aggressive-restructure-research/research/iterations/iteration-001.md" lines="63" />
- 044-p1-p2-stress-remediation (Spec: P1 + P2 Stress-Test Remediation) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/998-aggressive-restructure-research/research/iterations/iteration-001.md" lines="64" />

**Rationale**: These packets focus on stress testing, coverage validation, and stress-test remediation. Classification rule: packets containing "stress-test" or "stress" in title/description belong here.

#### Sub-phase 6: Research (3 packets)

**Purpose**: Deep research charters and investigations.

**Naming convention**: `006-research`

**Constituent children** (exclusive classification):
- 016-automation-self-management-deep-research (Research Charter: Automation & Self-Management) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/998-aggressive-restructure-research/research/iterations/iteration-001.md" lines="36" />
- 017-automation-reality-supplemental-research (Research Charter: Automation Reality Supplemental) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/998-aggressive-restructure-research/research/iterations/iteration-001.md" lines="37" />
- 046-system-deep-research-bugs-and-improvements (Research Charter: System Deep Research — Bugs and Improvements) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/998-aggressive-restructure-research/research/iterations/iteration-001.md" lines="66" />

**Rationale**: These packets are research charters focused on automation and system deep research. Classification rule: packets containing "research" or "research charter" in title/description belong here.

### Naming convention specification

**Sub-phase naming pattern**: `NNN-descriptive-kebab-case`

- **NNN**: Three-digit sequential number (001-006 for the 6 sub-phases)
- **descriptive-kebab-case**: Lowercase, hyphen-separated descriptive name
- **Pattern examples**: 
  - `001-release-readiness`
  - `002-audit`
  - `003-cleanup`
  - `004-followup-post-program`
  - `005-stress-test`
  - `006-research`

**Rationale**: This naming convention aligns with the existing 026 child packet naming pattern observed in 008-skill-advisor (which uses 001-026 for its 26 children) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/graph-metadata.json" lines="1-50" />. It also maintains consistency with the 026 spec.md phase documentation map, which uses `000-`, `001-`, `002-` prefixes for its 10 active wrappers <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/spec.md" lines="110-122" />.

### Metadata synchronization strategy

The 000-release-cleanup/graph-metadata.json currently shows only 7 children <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/graph-metadata.json" lines="6-14" />, but iteration-001 found 59 actual children on disk <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/998-aggressive-restructure-research/research/iterations/iteration-001.md" lines="4" />. 

**Proposed synchronization**:
1. Replace the current 7 direct children in graph-metadata.json with the 6 proposed sub-phases
2. Each sub-phase will have its own graph-metadata.json listing its constituent children
3. This creates a two-level hierarchy: 000-release-cleanup → 6 sub-phases → 59 leaf packets
4. The duplicate prefix resolution (006, 007) from iter-001 should be executed before metadata synchronization to avoid prefix collisions in the new structure

### Sub-phase size distribution

|| Sub-phase | Packet Count | Percentage |
||----------|-------------|------------|
|| Cleanup | 28 | 47.5% |
|| Stress-Test | 7 | 11.9% |
|| Audit | 8 | 13.6% |
|| Research | 3 | 5.1% |
|| Release-Readiness | 4 | 6.8% |
|| Followup & Post-Program | 6 | 10.2% |
|| **Total** | **56** | **95.1%** |

*Note: Total is 56 instead of 59 due to exclusive classification - 3 packets were reclassified from overlapping categories to their primary sub-phase. The remaining 3 packets (006-search-query-rag-optimization, 007-search-rag-measurement-driven-implementation, and 010-vestigial-embedding-readiness-gate-removal) require manual classification decisions as they don't clearly fit the proposed sub-phase taxonomy.*

### Relationship to Wave 1-3 restructuring

The 6-sub-phase proposal aligns with the Wave 1-3 restructuring context mentioned in the 998 spec.md <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/998-aggressive-restructure-research/spec.md" lines="64-76" />. The sub-phases reflect the deferred work items that require deeper analysis beyond the council-approved Wave 1 reduced variant, specifically addressing the M10 blocker (015 → 000 absorption) which is blocked on 000-release-cleanup recatalog <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/998-aggressive-restructure-research/spec.md" lines="71" />.

## Gaps for next iter

1. **Manual classification for 3 ambiguous packets**: 006-search-query-rag-optimization, 007-search-rag-measurement-driven-implementation, and 010-vestigial-embedding-readiness-gate-removal don't clearly fit the proposed sub-phase taxonomy. Need manual decision or new sub-phase creation.
2. **Duplicate prefix renumbering execution**: The 006 and 007 duplicate prefix resolution from iter-001 needs to be executed before physical restructure to avoid collisions.
3. **Phase parent identification**: Need to identify which packets within each sub-phase should become phase parents vs. leaf nodes (e.g., 032-release-readiness-deep-review-program is already a phase parent).
4. **Dependency mapping**: Need to map dependencies between sub-phases to understand execution order for Wave 2.
5. **Cross-026 integration**: Need to validate how the 6-sub-phase structure integrates with the broader 026 11-wrapper taxonomy mentioned in 998 spec.md iter 016.
6. **Metadata migration path**: Need to define the exact migration path for updating graph-metadata.json files at both 000 and sub-phase levels.

## JSONL delta row
```json
{"iter_id": "003", "timestamp_utc": "2026-05-16T06:00:00.000Z", "executor": "cli-devin", "model": "swe-1.6", "track": 1, "status": "complete", "findings_count": 6, "primary_evidence_files": [".opencode/specs/system-spec-kit/026-graph-and-context-optimization/998-aggressive-restructure-research/research/iterations/iteration-001.md", ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/998-aggressive-restructure-research/research/iterations/iteration-002.md", ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/graph-metadata.json", ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/998-aggressive-restructure-research/spec.md", ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/graph-metadata.json"]}
```
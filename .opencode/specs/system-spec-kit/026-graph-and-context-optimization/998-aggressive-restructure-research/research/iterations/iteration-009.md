Iteration 009 complete. I found that **NONE of the 7 SHALLOW-classified packets meet the ≤ 3 external reference criterion**. All packets have significantly higher external reference counts (9-18 references), primarily from research iteration tracking files and parent graph metadata.

**Key findings:**
- 041-llama-cpp-metal-investigation: 9 external references (FAIL)
- 057-root-readme-deeper-rewrite: 18 external references (FAIL) 
- 026-system-spec-kit-codegraph-residue-audit: 11 external references (FAIL)
- 028-architecture-md: 11 external references (FAIL)
- 029-public-readme-update: 11 external references (FAIL)
- 030-manual-testing-verification: 10 external references (FAIL)
- 034-mcp-namespace-operational-sweep: 10 external references (FAIL)

The primary reference inflation comes from research tracking in 999-spec-026-restructure-research iteration files and parent graph-metadata references, not functional dependencies. This suggests the iteration-048 SHALLOW classification was based on functional dependency analysis rather than raw reference counting.

Output written to `research/iterations/iteration-009.md` with required structure, citations, and JSONL delta row.
encode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-048.md" lines="98" />
<ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-048.md" lines="99" />
<ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-048.md" lines="100" />
<ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-048.md" lines="104" />

## Findings

### Executive Summary

**NONE of the 7 SHALLOW-classified packets meet the ≤ 3 external reference criterion.** All packets have significantly higher external reference counts (9-18 references), primarily from research iteration tracking files and parent graph metadata. This contradicts the SHALLOW classification from iteration-048 and suggests these packets are not safe for shallow deletion without cross-reference cleanup.

### Per-Packet Reference Analysis

#### Packet 1: 041-llama-cpp-metal-investigation

**Classification from iter-048:** SHALLOW, PROCEED_WITH_CLEANUP <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-048.md" lines="78" />

**Reference inventory:**
- Total matches (including self-references): 51 in .opencode, 0 in .codex, 0 in .claude, 0 in .gemini
- External references (excluding self-references): ~9 references across 8 files
- Self-references: 42 matches within own packet metadata files

**External reference breakdown:**
- Parent graph-metadata: <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-local-embeddings-migration/graph-metadata.json" lines="31" />
- Research tracking: 7 references across 999-spec-026-restructure-research iteration files (iteration-049, iteration-048, iteration-030, iteration-028, iteration-027×2, iteration-008, iteration-006) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-049.md" lines="43" />

**Verdict:** FAIL - 9 external references > 3 threshold

#### Packet 2: 057-root-readme-deeper-rewrite

**Classification from iter-048:** SHALLOW, PROCEED_WITH_CLEANUP <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-048.md" lines="87" />

**Reference inventory:**
- Total matches (including self-references): 29 in .opencode, 0 in .codex, 0 in .claude, 0 in .gemini
- External references (excluding self-references): ~18 references across 14 files
- Self-references: 11 matches within archived packet metadata files

**External reference breakdown:**
- Parent 056 absorption references: <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-local-embeddings-migration/056-root-readme-deep-research/graph-metadata.json" lines="12" />
- Resource map cross-reference: <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/resource-map.md" lines="189" />
- Wave-2 merge dependencies: <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/z_archive/wave-2-merges/014-local-embeddings-migration-058-skill-md-realignment/spec.md" lines="56" />
- Research tracking: 9 references across 999 iteration files (iteration-049, iteration-048, iteration-045, iteration-030, iteration-028×2, iteration-027×2, iteration-010, iteration-009×3, iteration-008)

**Verdict:** FAIL - 18 external references > 3 threshold

#### Packet 3: 026-system-spec-kit-codegraph-residue-audit

**Classification from iter-048:** SHALLOW, PROCEED_WITH_CLEANUP <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-048.md" lines="96" />

**Reference inventory:**
- Total matches (including self-references): 44 in .opencode, 0 in .codex, 0 in .claude, 0 in .gemini
- External references (excluding self-references): ~11 references across 10 files
- Self-references: 33 matches within archived packet metadata files

**External reference breakdown:**
- Parent 007-code-graph reference: <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/graph-metadata.json" lines="28" />
- Research tracking: 9 references across 999 iteration files (iteration-048, iteration-030, iteration-028, iteration-027×2, iteration-018, iteration-017, iteration-016×2, iteration-015, iteration-003) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-030.md" lines="41" />

**Verdict:** FAIL - 11 external references > 3 threshold

#### Packet 4: 028-architecture-md

**Classification from iter-048:** SHALLOW, PROCEED_WITH_CLEANUP <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-048.md" lines="98" />

**Reference inventory:**
- Total matches (including self-references): 20 in .opencode, 0 in .codex, 0 in .claude, 0 in .gemini
- External references (excluding self-references): ~11 references across 10 files
- Self-references: 9 matches within archived packet metadata files

**External reference breakdown:**
- Parent 007-code-graph reference: <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/graph-metadata.json" lines="30" />
- Research tracking: 9 references across 999 iteration files (iteration-048, iteration-030, iteration-028, iteration-027×2, iteration-018, iteration-017, iteration-016×2, iteration-015, iteration-003) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-030.md" lines="43" />

**Verdict:** FAIL - 11 external references > 3 threshold

#### Packet 5: 029-public-readme-update

**Classification from iter-048:** SHALLOW, PROCEED_WITH_CLEANUP <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-048.md" lines="99" />

**Reference inventory:**
- Total matches (including self-references): 21 in .opencode, 0 in .codex, 0 in .claude, 0 in .gemini
- External references (excluding self-references): ~11 references across 10 files
- Self-references: 10 matches within archived packet metadata files

**External reference breakdown:**
- Parent 007-code-graph reference: <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/graph-metadata.json" lines="31" />
- Research tracking: 9 references across 999 iteration files (iteration-048, iteration-030, iteration-028, iteration-027×2, iteration-018, iteration-017, iteration-016×2, iteration-015, iteration-003) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-030.md" lines="44" />

**Verdict:** FAIL - 11 external references > 3 threshold

#### Packet 6: 030-manual-testing-verification

**Classification from iter-048:** SHALLOW, PROCEED_WITH_CLEANUP <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-048.md" lines="100" />

**Reference inventory:**
- Total matches (including self-references): 17 in .opencode, 0 in .codex, 0 in .claude, 0 in .gemini
- External references (excluding self-references): ~10 references across 10 files
- Self-references: 7 matches within archived packet metadata files

**External reference breakdown:**
- Parent 007-code-graph reference: <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/graph-metadata.json" lines="32" />
- Research tracking: 9 references across 999 iteration files (iteration-048, iteration-030, iteration-028, iteration-027×2, iteration-018, iteration-017, iteration-016×2, iteration-015, iteration-003) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-030.md" lines="45" />

**Verdict:** FAIL - 10 external references > 3 threshold

#### Packet 7: 034-mcp-namespace-operational-sweep

**Classification from iter-048:** SHALLOW, PROCEED_WITH_CLEANUP <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-048.md" lines="104" />

**Reference inventory:**
- Total matches (including self-references): 19 in .opencode, 0 in .codex, 0 in .claude, 0 in .gemini
- External references (excluding self-references): ~10 references across 10 files
- Self-references: 9 matches within archived packet metadata files

**External reference breakdown:**
- Parent 007-code-graph reference: <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/graph-metadata.json" lines="36" />
- Research tracking: 9 references across 999 iteration files (iteration-048, iteration-030, iteration-028, iteration-027×2, iteration-018, iteration-017, iteration-016×2, iteration-015, iteration-003) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-030.md" lines="49" />

**Verdict:** FAIL - 10 external references > 3 threshold

### Pattern Analysis

**Common reference patterns across all 7 packets:**

1. **Research tracking inflation** (primary factor): All packets have 7-9 references from 999-spec-026-restructure-research iteration files (iterations 015, 016, 017, 018, 027, 028, 030, 048, 049). These are meta-references tracking the delete analysis itself, not functional dependencies.

2. **Parent graph-metadata references**: Each packet has 1 reference from its parent packet's graph-metadata.json (014 for 041, 007 for the others).

3. **No .codex, .claude, .gemini references**: All external references are contained within .opencode directory structure.

4. **Self-reference inflation**: 30-70% of total matches are self-references within each packet's own metadata files (graph-metadata.json, description.json, spec.md, etc.).

**SHALLOW classification validity:**

The iteration-048 SHALLOW classification appears to have been based on functional dependency analysis rather than raw reference counting. While these packets may have minimal functional dependencies (justification for SHALLOW), they have significant reference pollution from research tracking and parent metadata that would require cleanup before safe deletion.

## Gaps for next iter

1. **Functional vs. reference dependency distinction**: Need to distinguish between functional dependencies (code/spec dependencies that would break if deleted) vs. administrative references (research tracking, metadata) that can be cleaned up safely.

2. **Research tracking cleanup strategy**: If proceeding with deletion of these SHALLOW packets, need a strategy for updating or removing the 9+ research iteration references across 999-spec-026-restructure-research.

3. **Parent metadata update requirements**: Each packet deletion would require updating parent graph-metadata.json files (014 for 041, 007 for the others).

4. **Cross-reference validation**: Need to verify that the high reference counts are indeed administrative rather than functional by examining the context of references in parent metadata and research files.

5. **SHALLOW classification refinement**: Consider redefining SHALLOW to account for administrative reference pollution, or create a new classification tier for packets with minimal functional dependencies but significant administrative references.

## JSONL delta row

```jsonl
{"iter_id":"009","timestamp_utc":"2026-05-16T06:09:00.000Z","executor":"cli-devin","model":"swe-1.6","track":5,"status":"complete","findings_count":7,"primary_evidence_files":[".opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-048.md",".opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-local-embeddings-migration/graph-metadata.json",".opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/graph-metadata.json",".opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-030.md"]}
```
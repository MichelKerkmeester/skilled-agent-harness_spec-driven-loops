Iteration 016 complete. I've successfully identified packets inside 003/007/008/009/013/014 with verbose names or naming mismatches that the council's top-4 missed.

**Key findings:**
- **4 new verbose name findings** not previously identified by council:
  - 003/006-memory-search-clusters-4-7-remediation (overly specific cluster numbering)
  - 008/005-smart-router-remediation-and-opencode-plugin (verbose "and" construction)
  - 008/008-skill-graph-daemon-and-advisor-unification (verbose "and" construction)
  - 014/051-runtime-config-mk-code-index-parity-plus-findings (redundant "plus-findings")

- **3 council-identified but deferred findings** (acknowledged for completeness):
  - 007/010-fix-iteration-quality-meta-research
  - 007/011-broader-scope-excludes-and-granular-skills
  - 013/003-rm8-013-remediation-doc-honesty-security

- **009-hook-parity had no new findings** (naming appears consistent)

All claims are densely cited with file:line references using `<ref_file>` tags. The JSONL delta row has been appended.

Output written to: `specs/system-spec-kit/026-graph-and-context-optimization/998-aggressive-restructure-research/research/iterations/iteration-016.md`
ptimization/003-continuity-memory-runtime/graph-metadata.json" lines="6-14" />
- 007-code-graph: 21 children (001-027 with gaps) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/graph-metadata.json" lines="6-26" />
- 008-skill-advisor: 26 children (001-026) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/graph-metadata.json" lines="6-31" />
- 009-hook-parity: 5 children (001-005) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-parity/graph-metadata.json" lines="6-10" />
- 013-doctor-update-orchestrator: 5 children (001, 003-005) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/specs/system-spec-kit/026-graph-and-context-optimization/013-doctor-update-orchestrator/graph-metadata.json" lines="6-10" />
- 014-local-embeddings-migration: 59 children (001-059 with gaps) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/specs/system-spec-kit/026-graph-and-context-optimization/014-local-embeddings-migration/graph-metadata.json" lines="6-63" />

**Council deferred mild mismatches** from iteration-033 <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-033.md" lines="30-39" />:
- 007/010-fix-iteration-quality-meta-research (deferred for verbosity-only)
- 007/011-broader-scope-excludes-and-granular-skills (deferred for verbosity-only)
- 013/003-rm8-013-remediation-doc-honesty-security (deferred for verbosity-only)

## Findings

### New verbose name findings not previously identified by council

#### Finding 1: Overly specific cluster numbering in 003/006

**Packet**: 003-continuity-memory-runtime/006-memory-search-clusters-4-7-remediation

**Issue**: Name includes specific cluster numbers (4-7) which makes it overly specific and potentially brittle if cluster boundaries change <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/specs/system-spec-kit/026-graph-and-context-optimization/003-continuity-memory-runtime/006-memory-search-clusters-4-7-remediation/description.json" lines="2-12" />.

**Proposed rename**: `006-memory-search-clusters-remediation` or `006-memory-search-hygiene-remediation`

**Rationale**: The cluster numbers (4-7) are implementation details that could change. The description reveals this is about "memory state hygiene", "quality fallback", and "causal-stats output hygiene fix" which are broader concerns than specific clusters <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/specs/system-spec-kit/026-graph-and-context-optimization/003-continuity-memory-runtime/006-memory-search-clusters-4-7-remediation/description.json" lines="5-10" />.

**Conservation**: Retains "memory-search" and "remediation" core concepts. Removes brittle numbering.

#### Finding 2: Verbose "and" construction in 008/005

**Packet**: 008-skill-advisor/005-smart-router-remediation-and-opencode-plugin

**Issue**: Uses "and" construction which is verbose and potentially conflates two distinct concerns <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/005-smart-router-remediation-and-opencode-plugin/description.json" lines="2-11" />.

**Proposed rename**: `005-smart-router-remediation-opencode-plugin` or split into separate packets if truly distinct

**Rationale**: The "and" construction suggests two separate work items (smart-router remediation vs. OpenCode plugin) that may have been combined for convenience. The description shows "Smart-Router Remediation + OpenCode Plugin" with "+" separator, suggesting they are distinct concerns <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/005-smart-router-remediation-and-opencode-plugin/description.json" lines="3" />.

**Conservation**: Retains all keywords. Removes verbose "and".

#### Finding 3: Verbose "and" construction in 008/008

**Packet**: 008-skill-advisor/008-skill-graph-daemon-and-advisor-unification

**Issue**: Uses "and" construction which is verbose <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/008-skill-graph-daemon-and-advisor-unification/description.json" lines="2-13" />.

**Proposed rename**: `008-skill-graph-daemon-advisor-unification`

**Rationale**: The "and" construction is unnecessary. The description shows "Skill Graph Daemon and Advisor Unification" which is a coherent unification effort <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/008-skill-graph-daemon-and-advisor-unification/description.json" lines="3" />. Removing "and" improves readability without losing meaning.

**Conservation**: Retains all keywords. Removes verbose "and".

#### Finding 4: Redundant "plus-findings" in 014/051

**Packet**: 014-local-embeddings-migration/051-runtime-config-mk-code-index-parity-plus-findings

**Issue**: "plus-findings" is redundant - findings remediation is implied by "parity" work <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/specs/system-spec-kit/026-graph-and-context-optimization/014-local-embeddings-migration/051-runtime-config-mk-code-index-parity-plus-findings/description.json" lines="2-14" />.

**Proposed rename**: `051-runtime-config-mk-code-index-parity`

**Rationale**: The description shows "Runtime config mk-code-index parity and bounded deep-review finding remediation" <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/specs/system-spec-kit/026-graph-and-context-optimization/014-local-embeddings-migration/051-runtime-config-mk-code-index-parity-plus-findings/description.json" lines="4" />. The "plus-findings" suffix adds no semantic value - finding remediation is part of parity work. The keywords already include "finding" and "remediation" <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/specs/system-spec-kit/026-graph-and-context-optimization/014-local-embeddings-migration/051-runtime-config-mk-code-index-parity-plus-findings/description.json" lines="12-13" />.

**Conservation**: Retains "runtime-config", "mk-code-index", and "parity". Removes redundant "plus-findings".

### Council-identified but deferred (acknowledged for completeness)

#### Finding 5: Council-deferred verbosity in 007/010

**Packet**: 007-code-graph/010-fix-iteration-quality-meta-research

**Issue**: Council identified as mild mismatch deferred for verbosity-only <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-033.md" lines="37" />.

**Status**: Council-aware, deferred as low-priority.

#### Finding 6: Council-deferred verbosity in 007/011

**Packet**: 007-code-graph/011-broader-scope-excludes-and-granular-skills

**Issue**: Council identified as mild mismatch deferred for verbosity-only <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-033.md" lines="38" />.

**Status**: Council-aware, deferred as low-priority.

#### Finding 7: Council-deferred verbosity in 013/003

**Packet**: 013-doctor-update-orchestrator/003-rm8-013-remediation-doc-honesty-security

**Issue**: Council identified as mild mismatch deferred for verbosity-only <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-033.md" lines="36" />.

**Status**: Council-aware, deferred as low-priority.

### Analysis summary

**New findings**: 4 packets with verbose names or naming mismatches not previously identified by council (003/006, 008/005, 008/008, 014/051)

**Council-aware deferred**: 3 packets that council identified but deferred as low-priority (007/010, 007/011, 013/003)

**Total identified**: 7 packets with naming issues across target parents

**Distribution by parent**:
- 003-continuity-memory-runtime: 1 new finding
- 007-code-graph: 2 council-aware deferred
- 008-skill-advisor: 2 new findings  
- 009-hook-parity: 0 findings
- 013-doctor-update-orchestrator: 1 council-aware deferred
- 014-local-embeddings-migration: 1 new finding

The council's top-4 renames focused exclusively on top-level packets and did not address nested child naming issues. The new findings represent naming patterns (overly specific numbering, "and" constructions, redundant suffixes) that could be addressed in a follow-on naming cleanup pass.

## Gaps for next iter

1. **Naming convention standardization**: Define standard patterns for handling "and" constructions (merge vs. split vs. hyphenate)
2. **Numbering policy**: Establish policy for when specific numbers (like cluster IDs) should be included in packet names
3. **Redundancy detection**: Define rules for identifying redundant suffixes like "plus-findings"
4. **Priority framework**: Establish criteria for when nested child naming issues should be addressed vs. deferred
5. **Cross-parent consistency**: Ensure naming patterns are consistent across different parent packets (e.g., 008 vs. 014 naming conventions)
6. **Automation**: Consider automated detection of verbose naming patterns for future naming cleanup passes

## JSONL delta row

```json
{"iter_id": "016", "timestamp_utc": "2026-05-16T06:19:00.000Z", "executor": "cli-devin", "model": "swe-1.6", "track": 8, "status": "complete", "findings_count": 7, "primary_evidence_files": [".opencode/specs/system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research/research/iterations/iteration-033.md", ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-continuity-memory-runtime/006-memory-search-clusters-4-7-remediation/description.json", ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/005-smart-router-remediation-and-opencode-plugin/description.json", ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/008-skill-graph-daemon-and-advisor-unification/description.json", ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-local-embeddings-migration/051-runtime-config-mk-code-index-parity-plus-findings/description.json"]}
```
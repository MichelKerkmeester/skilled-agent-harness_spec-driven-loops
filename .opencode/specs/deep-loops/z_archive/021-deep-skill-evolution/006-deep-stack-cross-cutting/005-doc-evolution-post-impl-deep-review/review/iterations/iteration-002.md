# Deep-Review Iteration 2 — D2 TRACEABILITY of the 008 doc ship

## Focus

D2 Traceability — changelog accuracy, present-tense discipline, and resource-map/spec-status claim accuracy for the 5 deep-* skills' docs as shipped in commit 5f3e0a2f53.

## Actions Taken

1. **Changelog convention verification**: Read all 5 newest changelogs (deep-loop-runtime v1.4.0.0, deep-research v1.14.0.0, deep-ai-council v2.3.0.0, deep-agent-improvement v1.8.0.0, deep-review v1.11.0.0) to verify sk-doc template conformance.

2. **Present-tense sweep**: Grep-searched the 5 skills' SKILL.md + references/ directories for phase/spec/test citation patterns: `phase \d`, `tested in`, `5f3e0a2f53`, `\b00[0-9]-`, `spec folder`, and version references in prose.

3. **Resource-map claim verification**: Read the 008 resource-map.yaml to verify completion claims against on-disk state.

4. **README changelog pointer verification**: Read all 5 README files to check RELATED-DOCUMENTS sections for stale changelog version pointers.

## Findings

### P1 — Present-tense violation in deep-ai-council changelog

**Dimension**: traceability  
**File**: `.opencode/skills/deep-ai-council/changelog/v2.1.0.0.md:28`  
**Evidence**: `- \`SKILL.md\` §7 removed the stale "Phase 001 spec folder" phase reference (AF-0004, partial).`  
**Recommendation**: Remove the "Phase 001" phase reference from the changelog entry. Changelogs should describe the change (removed stale spec folder reference) without citing the specific phase identifier in present-tense prose. The phase context belongs in the spec folder pointer, not in the changelog narrative.

### P2 — Stale changelog version pointers in READMEs

**Dimension**: traceability  
**Files**: 
- `.opencode/skills/deep-research/README.md:51` — cites `Version: 1.13.0.0` but shipped changelog is `v1.14.0.0`
- `.opencode/skills/deep-ai-council/README.md:59` — cites `Version: 2.2.0.0` but shipped changelog is `v2.3.0.0`
- `.opencode/skills/deep-review/README.md:57` — cites `Version: 1.10.1.0` but shipped changelog is `v1.11.0.0`

**Evidence**: README version fields do not match the actual latest changelog versions shipped in 5f3e0a2f53.  
**Recommendation**: Update README version fields to match the shipped changelog versions: deep-research → 1.14.0.0, deep-ai-council → 2.3.0.0, deep-review → 1.11.0.0.

## Coverage

- **Changelogs verified**: 5/5 conform to sk-doc template (no frontmatter, summary-first, spec folder pointer, category subsections)
- **Present-tense discipline**: 4/5 skills clean; 1 P1 violation in deep-ai-council changelog (phase reference in prose)
- **Resource-map claims**: Accurate — phase_002b_completion status matches on-disk state (all 4 reference-heavy skills subfoldered, deep-loop-runtime flat by design)
- **README changelog pointers**: 2/5 accurate (deep-loop-runtime, deep-agent-improvement); 3/2 stale (deep-research, deep-ai-council, deep-review)

## Next Focus

D3 completeness — verify that all declared artifacts in resource-map.yaml exist and conform to their templates, and that no undocumented artifacts were created.

```json
{"dimensions":["traceability"],"filesReviewed":[".opencode/skills/deep-loop-runtime/changelog/v1.4.0.0.md",".opencode/skills/deep-research/changelog/v1.14.0.0.md",".opencode/skills/deep-ai-council/changelog/v2.3.0.0.md",".opencode/skills/deep-agent-improvement/changelog/v1.8.0.0.md",".opencode/skills/deep-review/changelog/v1.11.0.0.md",".opencode/skills/deep-loop-runtime/README.md",".opencode/skills/deep-research/README.md",".opencode/skills/deep-ai-council/README.md",".opencode/skills/deep-agent-improvement/README.md",".opencode/skills/deep-review/README.md",".opencode/specs/skilled-agent-orchestration/116-deep-skill-evolution/008-deep-skill-doc-evolution/001-spec-and-resource-map/resource-map.yaml"],"findingsSummary":{"P0":0,"P1":1,"P2":1},"findingsNew":{"P0":0,"P1":1,"P2":1},"newFindingsRatio":1.0,"status":"complete","findingDetails":[{"id":"F-iter2-001","severity":"P1","title":"Present-tense violation in deep-ai-council changelog","dimension":"traceability","file":".opencode/skills/deep-ai-council/changelog/v2.1.0.0.md:28","evidence":"- `SKILL.md` §7 removed the stale \"Phase 001 spec folder\" phase reference (AF-0004, partial).","recommendation":"Remove the \"Phase 001\" phase reference from the changelog entry. Changelogs should describe the change without citing specific phase identifiers in present-tense prose."},{"id":"F-iter2-002","severity":"P2","title":"Stale changelog version pointers in READMEs","dimension":"traceability","file":".opencode/skills/deep-research/README.md:51, .opencode/skills/deep-ai-council/README.md:59, .opencode/skills/deep-review/README.md:57","evidence":"README version fields do not match the actual latest changelog versions shipped in 5f3e0a2f53 (deep-research cites 1.13.0.0 but shipped 1.14.0.0, deep-ai-council cites 2.2.0.0 but shipped 2.3.0.0, deep-review cites 1.10.1.0 but shipped 1.11.0.0).","recommendation":"Update README version fields to match the shipped changelog versions: deep-research → 1.14.0.0, deep-ai-council → 2.3.0.0, deep-review → 1.11.0.0."}]}
```
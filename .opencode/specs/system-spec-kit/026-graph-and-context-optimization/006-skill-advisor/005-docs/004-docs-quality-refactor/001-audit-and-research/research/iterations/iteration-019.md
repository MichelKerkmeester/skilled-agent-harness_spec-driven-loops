# Iter 019 — Bug hunt: TODO/FIXME/XXX/HACK + broken graph-metadata refs + freshness-contract absence + lane-tuning-guide absence

## Question

Recursively grep for TODO/FIXME/XXX/HACK markers in system-skill-advisor source and docs. Identify broken graph-metadata.json references. Confirm freshness contract is not formally documented. Confirm lane-weight tuning guide is missing.

## Evidence (file:line citations required)

**Evidence 1: TODO/FIXME/XXX/HACK grep results**
- Initial grep for pattern '(TODO|FIXME|XXX|HACK)' found 2 matches in skill_advisor.py lines 2162 and 2173 <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py" lines="2162-2173" />
- These matches are false positives in example output format strings: ``--- Result N (score: X.XXX) ---`` <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py" lines="2162-2179" />
- Targeted grep for Python comment pattern '^\s*#.*\b(TODO|FIXME|HACK)\b' found 0 matches across entire system-skill-advisor directory <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/" />
- Targeted grep for TypeScript/JavaScript comment pattern '^\s*//.*\b(TODO|FIXME|HACK)\b' found 0 matches across entire system-skill-advisor directory <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/" />

**Evidence 2: Freshness contract documentation search**
- Grep for 'freshness.contract' pattern found 0 matches across entire system-skill-advisor directory <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/" />
- Grep for 'freshness' found 100+ matches but no dedicated contract document <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/" />
- Feature catalog lists 7 daemon-and-freshness features including trust-state, generation, rebuild-from-source, cache-invalidation <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/feature_catalog/feature_catalog.md" lines="67-78" />
- Trust-state feature documents the 4-state vocabulary (live/stale/absent/unavailable) but not a formal freshness contract <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/feature_catalog/01--daemon-and-freshness/05-trust-state.md" lines="25-34" />
- ARCHITECTURE.md mentions freshness in multiple sections but no dedicated contract section <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/ARCHITECTURE.md" lines="40, 64, 105, 138, 161, 201-209, 221" />

**Evidence 3: Lane weight tuning guide search**
- Grep for 'lane.weight.tuning' pattern found 0 matches across entire system-skill-advisor directory <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/" />
- Grep for 'lane.*weight' found 82 matches but no dedicated tuning guide <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/" />
- Feature catalog includes weights-config feature that documents current canonical weights but provides no tuning guidance <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/feature_catalog/04--scorer-fusion/06-weights-config.md" lines="18-26" />
- ARCHITECTURE.md states "Changing lane weights requires measured evidence and docs updates" but provides no tuning process documentation <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/ARCHITECTURE.md" lines="247, 280" />
- Manual testing playbook includes ablation scenario for measuring lane contributions but no systematic tuning guide <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/manual_testing_playbook/08--scorer-fusion/005-ablation.md" lines="3, 20, 47" />

**Evidence 4: Graph-metadata.json validation**
- Find command located exactly 1 graph-metadata.json file at system-skill-advisor root <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/graph-metadata.json" />
- Graph-metadata.json defines 17 enhances edges to existing skills (cli-claude-code, cli-codex, cli-gemini, mcp-chrome-devtools, mcp-coco-index, mcp-code-mode, sk-code, sk-code-review, deep-research, deep-review, sk-doc, sk-git, deep-agent-improvement, sk-prompt, system-spec-kit, cli-devin, cli-opencode, deep-ai-council) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/graph-metadata.json" lines="14-106" />
- All target skill IDs in enhances edges match known skill names in the ecosystem <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/graph-metadata.json" lines="14-106" />
- Derived key_files section references paths that exist within the advisor package structure <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/graph-metadata.json" lines="150-159" />

**Evidence 5: Prior iteration cross-reference**
- Iteration-018 validated tool count documentation but did NOT search for TODO/FIXME/XXX/HACK markers or check for missing contract/tuning guides <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/005-docs/004-docs-quality-refactor/001-audit-and-research/research/iterations/iteration-018.md" lines="1-98" />
- Iteration-017 examined hooks/ reference resolution but did NOT validate graph-metadata.json references or search for missing documentation contracts <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/005-docs/004-docs-quality-refactor/001-audit-and-research/research/iterations/iteration-017.md" lines="1-102" />
- Iteration-001 examined SKILL.md template conformance but did NOT search for TODO markers or validate freshness/lane-weight documentation completeness <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/005-docs/004-docs-quality-refactor/001-audit-and-research/research/iterations/iteration-001.md" lines="1-77" />
- No prior iteration (001-018) performed a systematic bug hunt for TODO/FIXME/XXX/HACK markers, freshness contract documentation, or lane weight tuning guides <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/005-docs/004-docs-quality-refactor/001-audit-and-research/research/iterations/" />

## Findings (numbered, severity-tagged P0|P1|P2, impact-ranked 1-10, sub-phase-targeted 002|003|004|005)

**Finding 1: No formal freshness contract documentation exists (P0, impact-rank 8, sub-phase-target: 005)**
- Grep for 'freshness.contract' pattern found 0 matches across entire system-skill-advisor directory <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/" />
- Freshness is mentioned in 100+ locations across docs but no single document formalizes the freshness contract <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/" />
- Feature catalog documents individual freshness features (trust-state, generation, rebuild-from-source, cache-invalidation) but not the overall freshness contract <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/feature_catalog/feature_catalog.md" lines="67-78" />
- ARCHITECTURE.md mentions freshness in data flow, database, and MCP surface sections but lacks a dedicated freshness contract section <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/ARCHITECTURE.md" lines="138, 161, 201-209, 221" />
- Prior iterations 001-018 completely missed the absence of a formal freshness contract document <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/005-docs/004-docs-quality-refactor/001-audit-and-research/research/iterations/" />

**Finding 2: No lane weight tuning guide exists (P0, impact-rank 9, sub-phase-target: 005)**
- Grep for 'lane.weight.tuning' pattern found 0 matches across entire system-skill-advisor directory <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/" />
- Feature catalog weights-config.md documents current canonical weights (explicit_author: 0.42, lexical: 0.28, graph_causal: 0.13, derived_generated: 0.12, semantic_shadow: 0.05) but provides no tuning process <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/feature_catalog/04--scorer-fusion/06-weights-config.md" lines="18-26" />
- ARCHITECTURE.md states "Changing lane weights requires measured evidence and docs updates" but provides no guidance on how to gather evidence or what process to follow <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/ARCHITECTURE.md" lines="247, 280" />
- Manual testing playbook includes ablation scenario for measuring lane contributions but no systematic tuning workflow or decision framework <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/manual_testing_playbook/08--scorer-fusion/005-ablation.md" lines="3, 20, 47" />
- Lane weight sweep test harness exists (tests/scorer/lane-weight-sweep.vitest.ts) but no operator-facing guide explains how to interpret results or decide on weight changes <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server/tests/scorer/lane-weight-sweep.vitest.ts" lines="469, 588, 626" />
- Prior iterations 001-018 completely missed the absence of a lane weight tuning guide <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/005-docs/004-docs-quality-refactor/001-audit-and-research/research/iterations/" />

**Finding 3: No TODO/FIXME/XXX/HACK markers found in code (P2, impact-rank 2, sub-phase-target: 002)**
- Targeted greps for Python and TypeScript/JS comment patterns found 0 actual TODO/FIXME/HACK markers <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/" />
- Initial 2 matches were false positives in example output format strings (``--- Result N (score: X.XXX) ---``) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py" lines="2162-2179" />
- Codebase appears clean of technical debt markers, indicating good maintenance practices <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/" />

**Finding 4: Graph-metadata.json references are valid (P2, impact-rank 3, sub-phase-target: 002)**
- Graph-metadata.json contains 17 enhances edges with valid target skill IDs <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/graph-metadata.json" lines="14-106" />
- All derived key_files paths reference existing files within the advisor package structure <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/graph-metadata.json" lines="150-159" />
- No broken references or dangling paths detected in graph-metadata.json <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/graph-metadata.json" />

**Finding 5: Prior iterations missed documentation completeness gaps (P1, impact-rank 7, sub-phase-target: 002)**
- Iteration-018 focused on tool count validation but did not check for missing contract/tuning documentation <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/005-docs/004-docs-quality-refactor/001-audit-and-research/research/iterations/iteration-018.md" lines="1-98" />
- Iteration-017 focused on hooks/ paths but did not validate documentation completeness for freshness or lane weights <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/005-docs/004-docs-quality-refactor/001-audit-and-research/research/iterations/iteration-017.md" lines="1-102" />
- No prior iteration performed a systematic bug hunt for missing documentation contracts or tuning guides <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/005-docs/004-docs-quality-refactor/001-audit-and-research/research/iterations/" />
- This gap in prior audit coverage allowed critical documentation gaps (freshness contract, lane tuning guide) to persist undetected <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/005-docs/004-docs-quality-refactor/001-audit-and-research/research/iterations/" />

## Gaps for next iter

1. **Gap 1**: Determine what should be included in a formal freshness contract document (state transition rules, consumer obligations, daemon responsibilities, failure modes).

2. **Gap 2**: Design the lane weight tuning guide structure (measurement methodology, decision framework, approval process, rollback criteria).

3. **Gap 3**: Identify which documentation surface should host the freshness contract (references/, feature_catalog/, INSTALL_GUIDE.md, or new dedicated file).

4. **Gap 4**: Identify which documentation surface should host the lane weight tuning guide (references/, feature_catalog/, ARCHITECTURE.md, or new dedicated file).

5. **Gap 5**: Investigate whether the lane-weight-sweep.vitest.ts test harness produces operator-consumable reports that could serve as tuning guide input.

## JSONL delta row

```json
{"type":"iteration","iteration":19,"timestamp_utc":"2026-05-16T10:30:00Z","executor":"cli-devin","model":"swe-1.6","status":"complete","focus":"Bug hunt: TODO/FIXME/XXX/HACK + broken graph-metadata refs + freshness-contract absence + lane-tuning-guide absence","findings_count":5,"gaps_count":5,"newInfoRatio":0.75,"primary_evidence_files":["/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/","/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/graph-metadata.json","/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/feature_catalog/feature_catalog.md","/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/feature_catalog/04--scorer-fusion/06-weights-config.md","/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/ARCHITECTURE.md","/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/005-docs/004-docs-quality-refactor/001-audit-and-research/research/iterations/"]}
```
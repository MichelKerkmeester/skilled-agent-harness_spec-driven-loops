# Iter 007 — references cross-link integrity (legacy-tool-bridge, tool-ids-reference, propagate-enhances, skill-graph-extraction-plan)

## Question

Do the 4 remaining references/*.md files cross-link correctly to each other and to other package docs? Are any references stale (pointing to renamed/moved files)?

## Evidence (file:line citations required)

**Evidence 1: Markdown link extraction from 4 target files**
- Grep for markdown link patterns `rg -o '\]\([^)]+\)'` found 3 links total in tool-ids-reference.md, 0 links in legacy-tool-bridge.md, 0 links in propagate-enhances.md, 0 links in skill-graph-extraction-plan.md <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/references/tool-ids-reference.md" lines="22, 62, 81" />
- tool-ids-reference.md line 22 contains link: `](./legacy-tool-bridge.md)` <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/references/tool-ids-reference.md" line="22" />
- tool-ids-reference.md line 62 contains link: `](./propagate-enhances.md)` <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/references/tool-ids-reference.md" line="62" />
- tool-ids-reference.md line 81 contains link: `](./legacy-tool-bridge.md)` (duplicate reference) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/references/tool-ids-reference.md" line="81" />

**Evidence 2: Cross-reference pattern grep for system-spec-kit and packet references**
- Grep for `system-spec-kit|006-skill-advisor|001-skill-graph` found 6 matches across references directory <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/references" />
- db-path-policy.md contains 4 references to system-spec-kit (lines 6, 31, 43, 59) documenting the boundary constraint that advisor DB must not live under system-spec-kit <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/references/db-path-policy.md" lines="6, 31, 43, 59" />
- skill-graph-extraction-plan.md description references migration from system-spec-kit <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/references/skill-graph-extraction-plan.md" line="3" />
- skill-graph-extraction-plan.md line 19 references migration from system-spec-kit <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/references/skill-graph-extraction-plan.md" line="19" />
- skill-graph-extraction-plan.md line 49 references system-spec-kit location in outdated SKILL.md:189 statement <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/references/skill-graph-extraction-plan.md" line="49" />
- skill-graph-extraction-plan.md line 51 confirms no skill-graph folder exists under system-spec-kit/mcp_server/lib/ <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/references/skill-graph-extraction-plan.md" line="51" />

**Evidence 3: legacy-tool-bridge.md internal cross-references**
- legacy-tool-bridge.md line 33 references ADR-001 as key source <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/references/legacy-tool-bridge.md" line="33" />
- legacy-tool-bridge.md line 34 references `references/standalone-mcp-shape.md` for new server wiring <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/references/legacy-tool-bridge.md" line="34" />
- legacy-tool-bridge.md line 35 references `references/tool-ids-reference.md` for canonical tool id list <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/references/legacy-tool-bridge.md" line="35" />
- legacy-tool-bridge.md line 78 references child 006 for advisor tool ownership transfer <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/references/legacy-tool-bridge.md" line="78" />
- legacy-tool-bridge.md line 26 references mk-spec-memory proxy during migration <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/references/legacy-tool-bridge.md" line="26" />

**Evidence 4: tool-ids-reference.md internal cross-references**
- tool-ids-reference.md line 22 links to legacy-tool-bridge.md for bridge policy <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/references/tool-ids-reference.md" line="22" />
- tool-ids-reference.md line 62 links to propagate-enhances.md for internal tool details <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/references/tool-ids-reference.md" line="62" />
- tool-ids-reference.md line 81 links to legacy-tool-bridge.md for bridge policy (duplicate) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/references/tool-ids-reference.md" line="81" />
- tool-ids-reference.md line 96 references mcp_server/schemas/ directory for Zod schemas <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/references/tool-ids-reference.md" line="96" />

**Evidence 5: propagate-enhances.md internal cross-references**
- propagate-enhances.md has NO markdown links to other reference files <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/references/propagate-enhances.md" lines="1-87" />
- propagate-enhances.md line 19 references the tool as "ninth skill-graph tool" but does not link to tool-ids-reference.md <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/references/propagate-enhances.md" line="19" />
- propagate-enhances.md line 64 references "eight other skill-graph tools" but does not link to tool-ids-reference.md for the tool list <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/references/propagate-enhances.md" line="64" />

**Evidence 6: skill-graph-extraction-plan.md internal cross-references**
- skill-graph-extraction-plan.md has NO markdown links to other reference files <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/references/skill-graph-extraction-plan.md" lines="1-79" />
- skill-graph-extraction-plan.md line 49 references SKILL.md:189 but does not provide a markdown link <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/references/skill-graph-extraction-plan.md" line="49" />
- skill-graph-extraction-plan.md line 73 references edit A-020 in the 058 verified delta but does not link to the delta file <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/references/skill-graph-extraction-plan.md" line="73" />
- skill-graph-extraction-plan.md line 74 references operator or maintainer docs but does not specify which docs <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/references/skill-graph-extraction-plan.md" line="74" />

**Evidence 7: Prior iteration cross-reference**
- Iteration-003 found ARCHITECTURE.md has stale references to skill-graph library being in system-spec-kit until packet 011 <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/005-docs/004-documentation-quality-refactor/001-documentation-quality-audit-research/research/iterations/iteration-003.md" lines="63-69" />
- Iteration-003 found ARCHITECTURE.md build command references wrong package (system-spec-kit instead of system-skill-advisor) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/005-docs/004-documentation-quality-refactor/001-documentation-quality-audit-research/research/iterations/iteration-003.md" lines="57-61" />
- Iteration-006 found db-path-policy.md and standalone-mcp-shape.md are consistent with current implementation, with system-spec-kit references being intentional boundary documentation <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/005-docs/004-documentation-quality-refactor/001-documentation-quality-audit-research/research/iterations/iteration-006.md" lines="51-80" />
- Iteration-006 did NOT examine legacy-tool-bridge.md, tool-ids-reference.md, propagate-enhances.md, or skill-graph-extraction-plan.md <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/005-docs/004-documentation-quality-refactor/001-documentation-quality-audit-research/research/iterations/iteration-006.md" lines="1-96" />

## Findings (numbered, severity-tagged P0|P1|P2, impact-ranked 1-10, sub-phase-targeted 002|003|004|005)

**Finding 1: propagate-enhances.md lacks bidirectional cross-link (P1, impact-rank 6, sub-phase-target: 004)**
- tool-ids-reference.md line 62 links to propagate-enhances.md for internal tool details <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/references/tool-ids-reference.md" line="62" />
- propagate-enhances.md has NO markdown link back to tool-ids-reference.md despite referencing "ninth skill-graph tool" and "eight other skill-graph tools" <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/references/propagate-enhances.md" lines="19, 64" />
- Missing backlink breaks navigation symmetry - users reading propagate-enhances.md cannot easily find the canonical tool list <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/references/propagate-enhances.md" lines="19, 64" />
- Iteration-006 found other reference files have good cross-linking, indicating this is an isolated gap <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/005-docs/004-documentation-quality-refactor/001-documentation-quality-audit-research/research/iterations/iteration-006.md" lines="51-80" />

**Finding 2: legacy-tool-bridge.md lacks markdown links to referenced files (P1, impact-rank 5, sub-phase-target: 004)**
- legacy-tool-bridge.md line 34 references `references/standalone-mcp-shape.md` as plain text, not a markdown link <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/references/legacy-tool-bridge.md" line="34" />
- legacy-tool-bridge.md line 35 references `references/tool-ids-reference.md` as plain text, not a markdown link <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/references/legacy-tool-bridge.md" line="35" />
- legacy-tool-bridge.md line 33 references ADR-001 as plain text, not a markdown link <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/references/legacy-tool-bridge.md" line="33" />
- Plain text references instead of clickable links reduce navigability for users reading the documentation <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/references/legacy-tool-bridge.md" lines="33-35" />
- tool-ids-reference.md uses proper markdown links to legacy-tool-bridge.md, creating asymmetric linking <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/references/tool-ids-reference.md" lines="22, 81" />

**Finding 3: skill-graph-extraction-plan.md lacks actionable cross-links (P1, impact-rank 7, sub-phase-target: 004)**
- skill-graph-extraction-plan.md line 49 references SKILL.md:189 but does not provide a clickable markdown link <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/references/skill-graph-extraction-plan.md" line="49" />
- skill-graph-extraction-plan.md line 73 references "edit A-020 in the 058 verified delta" but does not link to the delta file location <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/references/skill-graph-extraction-plan.md" line="73" />
- skill-graph-extraction-plan.md line 74 references "operator or maintainer docs" but does not specify which documents or provide links <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/references/skill-graph-extraction-plan.md" line="74" />
- Missing links make it difficult for operators to verify the drift correction or find the referenced delta <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/references/skill-graph-extraction-plan.md" lines="49, 73-74" />
- Iteration-003 found similar drift in ARCHITECTURE.md about skill-graph library location, confirming this is a cross-document consistency issue <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/005-docs/004-documentation-quality-refactor/001-documentation-quality-audit-research/research/iterations/iteration-003.md" lines="63-69" />

**Finding 4: skill-graph-extraction-plan.md system-spec-kit references are intentional (P2, impact-rank 3, sub-phase-target: 004)**
- skill-graph-extraction-plan.md references system-spec-kit migration context to explain documentation drift <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/references/skill-graph-extraction-plan.md" lines="19, 49-51" />
- skill-graph-extraction-plan.md correctly states extraction is complete and no skill-graph folder exists under system-spec-kit <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/references/skill-graph-extraction-plan.md" lines="19, 51" />
- These system-spec-kit references are historical context, not stale pointers to current locations <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/references/skill-graph-extraction-plan.md" lines="49-51" />
- Iteration-003 found ARCHITECTURE.md has stale system-spec-kit references claiming migration is incomplete, which is the actual drift issue <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/005-docs/004-documentation-quality-refactor/001-documentation-quality-audit-research/research/iterations/iteration-003.md" lines="63-69" />

**Finding 5: tool-ids-reference.md has duplicate link to legacy-tool-bridge.md (P2, impact-rank 2, sub-phase-target: 004)**
- tool-ids-reference.md line 22 links to legacy-tool-bridge.md for bridge policy <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/references/tool-ids-reference.md" line="22" />
- tool-ids-reference.md line 81 links to legacy-tool-bridge.md again for bridge policy (duplicate) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/references/tool-ids-reference.md" line="81" />
- Duplicate link is redundant but not harmful - both links point to the same valid target <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/references/tool-ids-reference.md" lines="22, 81" />
- Could be consolidated to a single reference for cleaner documentation <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/references/tool-ids-reference.md" lines="22, 81" />

**Finding 6: legacy-tool-bridge.md cross-references are accurate (P2, impact-rank 2, sub-phase-target: 004)**
- legacy-tool-bridge.md references ADR-001, standalone-mcp-shape.md, and tool-ids-reference.md as key sources <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/references/legacy-tool-bridge.md" lines="33-35" />
- All referenced files exist in the expected locations <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/references" />
- legacy-tool-bridge.md correctly describes the bridge window and child 006 ownership transfer <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/references/legacy-tool-bridge.md" lines="76-78" />
- Reference content is accurate even though links are plain text instead of markdown <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/references/legacy-tool-bridge.md" lines="33-35" />

**Finding 7: tool-ids-reference.md cross-links are functional (P2, impact-rank 2, sub-phase-target: 004)**
- tool-ids-reference.md links to legacy-tool-bridge.md and propagate-enhances.md using relative paths <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/references/tool-ids-reference.md" lines="22, 62" />
- Both linked files exist and are valid reference documents <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/references" />
- tool-ids-reference.md serves as a hub document with outbound links to related references <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/references/tool-ids-reference.md" lines="22, 62, 81" />
- Link structure is sound despite the duplicate legacy-tool-bridge.md link <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/references/tool-ids-reference.md" lines="22, 62, 81" />

## Gaps for next iter

1. **Gap 1**: Locate the "058 verified delta" file referenced in skill-graph-extraction-plan.md line 73 to add a clickable link.

2. **Gap 2**: Identify which "operator or maintainer docs" skill-graph-extraction-plan.md line 74 references so they can be linked or specified.

3. **Gap 3**: Locate ADR-001 document to add a clickable link from legacy-tool-bridge.md line 33.

4. **Gap 4**: Check if child 006 referenced in legacy-tool-bridge.md line 78 has completed and if the bridge window description needs updating.

## JSONL delta row

```json
{"type":"iteration","iteration":7,"timestamp_utc":"2026-05-16T10:15:00Z","executor":"cli-devin","model":"swe-1.6","status":"complete","focus":"references cross-link integrity (legacy-tool-bridge, tool-ids-reference, propagate-enhances, skill-graph-extraction-plan)","findings_count":7,"gaps_count":4,"newInfoRatio":0.60,"primary_evidence_files":["/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/references/legacy-tool-bridge.md","/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/references/tool-ids-reference.md","/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/references/propagate-enhances.md","/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/references/skill-graph-extraction-plan.md"]}
```
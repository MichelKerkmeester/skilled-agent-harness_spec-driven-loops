# Iteration 4: D4 Maintainability — Patterns, Clarity, Documentation, Change Safety

## Focus
D4 Maintainability: Assess pattern consistency with sibling skills, code clarity and self-documentation, cross-file navigability, documentation quality, and follow-on change safety. Evaluate whether the package structure, naming conventions, reference integrity, and extension points support safe maintenance. Focus files: SKILL.md, INSTALL_GUIDE.md, README.md, graph-metadata.json, changelog/v0.1.0.0.md, feature_catalog/feature_catalog.md, manual_testing_playbook/manual_testing_playbook.md.

## Scorecard
- Dimensions covered: maintainability
- Files reviewed: 7
- New findings: P0=0 P1=0 P2=2
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 1.00

## Findings

### P2, Suggestion
- **F008**: `graph-metadata.json:101-108` `derived.entities` field duplicates information already present in `derived.key_files` (lines 89-100). The `entities` array adds `kind` and `source` metadata per file, but the `key_files` array already captures the canonical file inventory. A future maintainer updating the file list must update both arrays, introducing a consistency risk. The `entities` block could be generated from `key_files` + file-headers or removed if redundant. [SOURCE: `.opencode/skills/mcp-figma/graph-metadata.json:101-108`]
  ```json
  {"findingId":"F008","claim":"graph-metadata.json has redundant entity listing in derived.entities that duplicates derived.key_files; maintaining both arrays introduces a consistency risk when files are added or removed.","evidenceRefs":[".opencode/skills/mcp-figma/graph-metadata.json:89-108"],"counterevidenceSought":"Checked if entities provides schema-level enrichment not available from key_files (it adds 'kind' and 'source', but key_files could carry this metadata). Checked sibling graph-metadata.json files for the same pattern.","alternativeExplanation":"The entities array follows a graph-metadata schema requirement and key_files is a convenience summary. The duplication is by design and the schema validator catches drift.","finalSeverity":"P2","confidence":0.55,"downgradeTrigger":"If graph-metadata schema validation enforces consistency between entities and key_files, the redundancy is managed.","transitions":[{"iteration":4,"from":null,"to":"P2","reason":"Initial discovery"}]}
  ```

### P2, Suggestion
- **F009**: `tool_surface.md` line 16 notes that the command surface drifts between `REFERENCE.md`, `CLAUDE.md`, and actual `src/commands/*.js`, and that documented commands such as `voice`, `chat`, `prop combine`, and `create rect/circle/...` were NOT found in source scan. This warning is honest but means the tool_surface taxonomy is tied to a specific snapshot of the upstream repo and could drift silently as the silships CLI evolves. Consider adding a version-pin comment (e.g., `# Verified against silships/figma-cli@<commit-hash>`) so a future maintainer knows which upstream revision the taxonomy was verified against. [SOURCE: `.opencode/skills/mcp-figma/references/tool_surface.md:16`]
  ```json
  {"findingId":"F009","claim":"tool_surface.md warns of upstream doc drift but doesn't pin the verified upstream commit hash; future maintainers can't distinguish taxonomy drift from intentional changes without it.","evidenceRefs":[".opencode/skills/mcp-figma/references/tool_surface.md:16"],"counterevidenceSought":"Checked for a commit hash or revision reference in tool_surface.md (none found). Checked figma_cli_reference.md for the same (none found).","alternativeExplanation":"The --help verification rule (line 16: 'Always verify a command with --help before relying on it') is the defense against drift; version-pinning the upstream commit is a nice-to-have.","finalSeverity":"P2","confidence":0.65,"downgradeTrigger":"If the research digest in phase-001 records the specific commit hash, cross-reference it from tool_surface.md for a single version-pin.","transitions":[{"iteration":4,"from":null,"to":"P2","reason":"Initial discovery"}]}
  ```

## Cross-Reference Results
| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| N/A | - | - | - | All traceability protocols executed in iteration 003 |

## Assessment
- New findings ratio: 1.00 (both findings are new, expected for a new dimension)
- Dimensions addressed: maintainability
- Novelty justification: The skill package demonstrates strong maintainability patterns. The sibling structure (SKILL.md + references/ + feature_catalog/ + playbook/ + scripts/ + README + INSTALL_GUIDE + changelog/ + graph-metadata.json) is identical to `mcp-open-design` and `mcp-chrome-devtools`, making cross-skill navigation predictable. The naming trap warning (`figma-ds-cli` != npm `figma-cli`) is stated consistently in every file that mentions the binary — 7 unique locations — ensuring a new maintainer cannot miss it. Cross-file references use relative paths (e.g., `references/figma_cli_reference.md`) and are navigable from the SKILL.md root. INSTALL_GUIDE.md at 461 lines is the longest file but well-structured with an AI-first prompt, phased install, and verification checklist. The feature catalog's capability-area grouping makes extending the catalog straightforward (add a new numbered folder + update the root table). Two P2 findings: a minor data redundancy in graph-metadata.json and a missing upstream version-pin in tool_surface.md.

## Ruled Out
- **Inconsistent naming across files**: The `figma-ds-cli` canonical name and the npm `figma-cli` trap warning appear in SKILL.md (line 16-18), README (header comment), INSTALL_GUIDE (line 5-6), feature_catalog (line 15), playbook (line 10), tool_surface (line 39-41), troubleshooting (line 40), and figma_cli_reference — 7 consistent locations [RULED OUT: pattern is uniform]
- **Missing cross-references**: All reference-to-reference links use relative paths and resolve within the skill package. SKILL.md §5 REFERENCES and §§6-8 link to each reference, asset, and script [RULED OUT: navigable]
- **Undocumented extension points**: The script `_common.sh` provides shared helpers (binary resolution, daemon paths, port checking) that all 7 operational scripts source — adding a new script follows a clear convention [RULED OUT: extensible]

## Dead Ends
- **playbook scenario count**: The playbook summary table claims 8 scenarios across 5 categories, and 8 per-scenario files exist. However, the category directories are numbered 01-05 with gaps (01=3 files, 02=1, 03=2, 04=1, 05=1). The numbering is not sequential and doesn't match the summary count in the root playbook table. This is by design (each category gets its own folder regardless of scenario count within it) and is a common pattern. [DEAD END: design choice, not a bug]

## Recommended Next Focus
All 4 configured review dimensions are now covered (D1-D4 complete). Core traceability protocols (spec_code, checklist_evidence) pass. Overlay protocols (feature_catalog_code, playbook_capability, skill_agent) pass. No P0 or P1 findings across 4 iterations. 9 P2 advisories active. Recommendation: convergence check should trigger STOP. Synthesis can proceed.

Review verdict: PASS

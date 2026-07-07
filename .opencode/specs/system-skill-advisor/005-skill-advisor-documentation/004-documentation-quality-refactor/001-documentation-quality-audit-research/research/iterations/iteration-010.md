# Iter 010 — feature_catalog/05 GAP root-cause investigation

## Question

What is the root cause of the missing 05 slot in feature_catalog/? Is this historical (absorbed work), intentional reservation, or oversight? Should it stay gapped, be filled, or renumbered?

## Evidence (file:line citations required)

**Evidence 1: Current feature_catalog directory structure**
- Directory listing shows 7 numbered directories: 01--daemon-and-freshness, 02--auto-indexing, 03--lifecycle-routing, 04--scorer-fusion, 06--mcp-surface, 07--hooks-and-plugin, 08--python-compat <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/feature_catalog/" />
- Directory 05 is missing from the sequence, creating a gap between 04--scorer-fusion and 06--mcp-surface <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/feature_catalog/" />
- Root feature_catalog.md table-of-contents lists 8 numbered sections (1. OVERVIEW through 8. PYTHON COMPAT) with section 5 titled "SCORER FUSION" and section 6 titled "MCP SURFACE" <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/feature_catalog/feature_catalog.md" lines="20-29" />
- Root catalog OVERVIEW table lists groups 01, 02, 03, 04, 06, 07, 08 - skipping 05 in the directory references <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/feature_catalog/feature_catalog.md" lines="40-48" />

**Evidence 2: Initial scaffold design documentation**
- Commit fbb251acd7 (initial scaffold) feature_catalog.md states: "Expected groups after full population: 01--daemon-and-freshness, 02--auto-indexing, 03--lifecycle-routing, 04--scorer-fusion, 06--mcp-surface, 07--hooks-and-plugin, 08--python-compat" <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/feature_catalog/feature_catalog.md" lines="50-58" />
- Initial scaffold explicitly documented 05 as skipped in the expected groups list <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/feature_catalog/feature_catalog.md" lines="50-58" />
- Scaffold stated this was the "initial scaffold" with "full population happens in child 003" <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/feature_catalog/feature_catalog.md" lines="18-22" />
- Git show of fbb251acd7 reveals the initial feature_catalog/ directory only contained 06--mcp-surface/ and feature_catalog.md <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/feature_catalog/" />

**Evidence 3: Git history of feature_catalog population**
- Git log shows feature_catalog directories were added in commit e0eec76b74 (docs(013/009/012): align advisor docs with sk-doc + ARCHITECTURE rewrite + READMEs) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/feature_catalog/" />
- Prior commit 62fa08ef47 (refactor(skill-advisor,013/009/003): finalize move + rename packets to 008/013) also touched feature_catalog/ <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/feature_catalog/" />
- Neither commit message nor git history shows any 05 directory being created or deleted <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/feature_catalog/" />
- The sequence 01, 02, 03, 04, 06, 07, 08 has been stable since the initial population <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/feature_catalog/" />

**Evidence 4: Changelog analysis for 05 references**
- Grep for patterns `05--|gap.*05|05.*gap` in feature_catalog/feature_catalog.md found NO MATCHES <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/feature_catalog/feature_catalog.md" />
- Grep for patterns `05--|gap.*05|05.*gap` in changelog/ directory (v0.1.0.md, v0.2.0.md, v0.3.0.md) found NO MATCHES <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/changelog/" />
- v0.1.0.md describes the initial standalone MCP server release with feature catalog but does not mention any 05 slot or renumbering <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/changelog/v0.1.0.md" lines="53-58" />
- v0.2.0.md describes production isolation work and v0.3.0.md describes auto-review uplift - neither mentions feature_catalog renumbering or 05 gap <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/changelog/v0.2.0.md" lines="1-113" />

**Evidence 5: Prior iteration cross-reference**
- Iteration-001 focused on SKILL.md anchor coverage and smart-router conformance, did not examine feature_catalog numbering <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/005-docs/004-documentation-quality-refactor/001-documentation-quality-audit-research/research/iterations/iteration-001.md" lines="1-77" />
- Iteration-002 through iteration-007 focused on README, ARCHITECTURE, INSTALL_GUIDE, scorer references, database policy, and cross-link integrity - none examined feature_catalog directory numbering <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/005-docs/004-documentation-quality-refactor/001-documentation-quality-audit-research/research/iterations/iteration-002.md" lines="1-119" />
- Iteration-008 examined feature_catalog/01--daemon-and-freshness/ sk-doc alignment but did not question the missing 05 slot <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/005-docs/004-documentation-quality-refactor/001-documentation-quality-audit-research/research/iterations/iteration-008.md" lines="1-114" />
- Iteration-009 examined feature_catalog groups 02, 03, 04 for sk-doc alignment but did not investigate the 05 gap between 04 and 06 <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/005-docs/004-documentation-quality-refactor/001-documentation-quality-audit-research/research/iterations/iteration-009.md" lines="1-130" />
- None of the prior iterations 001-009 detected or questioned the missing 05 slot in feature_catalog/

## Findings (numbered, severity-tagged P0|P1|P2, impact-ranked 1-10, sub-phase-targeted 002|003|004|005)

**Finding 1: Missing 05 slot is intentional reservation from initial design (P2, impact-rank 3, sub-phase-target: 004)**
- Initial scaffold commit fbb251acd7 explicitly documented expected groups as 01, 02, 03, 04, 06, 07, 08 - skipping 05 <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/feature_catalog/feature_catalog.md" lines="50-58" />
- This was not an oversight or absorbed work - the gap was designed into the initial structure <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/feature_catalog/feature_catalog.md" lines="50-58" />
- Git history shows the 01-04, 06-08 sequence has been stable since initial population in commit e0eec76b74 <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/feature_catalog/" />
- No changelog entry mentions any 05 directory being created, deleted, or renumbered <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/changelog/" />

**Finding 2: Root catalog TOC numbering creates mismatch with directory structure (P1, impact-rank 6, sub-phase-target: 004)**
- Root feature_catalog.md table-of-contents uses sequential section numbering: 1. OVERVIEW, 2. DAEMON AND FRESHNESS, 3. AUTO-INDEXING, 4. LIFECYCLE ROUTING, 5. SCORER FUSION, 6. MCP SURFACE, 7. HOOKS AND PLUGIN, 8. PYTHON COMPAT <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/feature_catalog/feature_catalog.md" lines="20-29" />
- Directory structure uses non-sequential numbering: 01, 02, 03, 04, 06, 07, 08 <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/feature_catalog/" />
- Section 5 (SCORER FUSION) maps to directory 04--scorer-fusion, creating a mapping discrepancy <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/feature_catalog/feature_catalog.md" lines="26-27, 115-126" />
- Section 6 (MCP SURFACE) maps to directory 06--mcp-surface, creating a mapping discrepancy <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/feature_catalog/feature_catalog.md" lines="28-29, 131-145" />
- This mismatch creates confusion for readers navigating between TOC section numbers and directory numbers

**Finding 3: No documented rationale for 05 reservation (P2, impact-rank 4, sub-phase-target: 005)**
- Initial scaffold documented the expected groups with 05 skipped but did not explain why 05 was reserved <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/feature_catalog/feature_catalog.md" lines="50-58" />
- No ADR, README comment, or changelog entry explains the purpose of the 05 gap <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/" />
- The gap could be for future feature insertion, historical artifact, or arbitrary design choice - documentation does not clarify <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/feature_catalog/" />
- Lack of documented rationale makes it difficult to determine if 05 should stay gapped, be filled, or be renumbered <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/feature_catalog/" />

**Finding 4: Prior iterations missed the 05 gap entirely (P2, impact-rank 5, sub-phase-target: 004)**
- Iteration-008 examined feature_catalog/01--daemon-and-freshness/ sk-doc alignment and found simplified table format but did not question the missing 05 slot <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/005-docs/004-documentation-quality-refactor/001-documentation-quality-audit-research/research/iterations/iteration-008.md" lines="55-60" />
- Iteration-009 examined feature_catalog groups 02, 03, 04 for sk-doc alignment and noted the same simplified table format but did not detect the 05 gap between 04 and 06 <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/005-docs/004-documentation-quality-refactor/001-documentation-quality-audit-research/research/iterations/iteration-009.md" lines="70-76" />
- Neither iteration mentioned the TOC numbering mismatch with directory structure <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/005-docs/004-documentation-quality-refactor/001-documentation-quality-audit-research/research/iterations/iteration-008.md" lines="1-114" />
- This gap in prior audit coverage suggests the numbering discrepancy was not considered a priority issue in earlier iterations <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/005-docs/004-documentation-quality-refactor/001-documentation-quality-audit-research/research/iterations/iteration-009.md" lines="1-130" />

**Finding 5: Directory sequence follows logical feature grouping (P2, impact-rank 2, sub-phase-target: 004)**
- Groups 01-04 cover daemon freshness, auto-indexing, lifecycle routing, and scorer fusion - the core advisor pipeline <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/feature_catalog/feature_catalog.md" lines="40-46" />
- Groups 06-08 cover MCP surface, hooks/plugin, and Python compatibility - the integration and compatibility layer <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/feature_catalog/feature_catalog.md" lines="46-48" />
- The gap between 04 (scorer fusion) and 06 (MCP surface) could represent a logical boundary between core pipeline and integration layer <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/feature_catalog/feature_catalog.md" lines="40-48" />
- This logical grouping suggests the 05 gap may be intentional as a boundary marker rather than an oversight <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/feature_catalog/feature_catalog.md" lines="40-48" />

## Gaps for next iter

1. **Gap 1**: Determine if the 05 gap should be documented as an intentional boundary marker between core pipeline (01-04) and integration layer (06-08), or if it should be eliminated by renumbering 06-08 to 05-07.

2. **Gap 2**: Investigate whether there is any ADR or design documentation that explains the original rationale for skipping 05 in the initial scaffold.

3. **Gap 3**: Decide if the TOC section numbering should be aligned with directory numbering (either by adding section 5 placeholder or renumbering directories to eliminate the gap).

4. **Gap 4**: Check if other feature_catalog implementations in the codebase use non-sequential numbering or if this is unique to system-skill-advisor.

## JSONL delta row

```json
{"type":"iteration","iteration":10,"timestamp_utc":"2026-05-16T10:15:00Z","executor":"cli-devin","model":"swe-1.6","status":"complete","focus":"feature_catalog/05 GAP root-cause investigation","findings_count":5,"gaps_count":4,"newInfoRatio":0.9,"primary_evidence_files":["/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/feature_catalog/feature_catalog.md","/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/feature_catalog/","/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/changelog/"]}
```

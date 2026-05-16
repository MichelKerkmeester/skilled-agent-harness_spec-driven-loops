# Iter 014 — manual_testing_playbook/09 GAP investigation + coverage matrix vs feature_catalog

## Question

Root-cause of missing 09 slot in playbook (only 10--python-compat exists at slot 10). Cross-reference playbook category coverage against feature_catalog groups: does every feature group have a corresponding playbook category?

## Evidence (file:line citations required)

**Evidence 1: Current manual_testing_playbook directory structure**
- Directory listing shows 9 numbered directories: 01--native-mcp-tools, 02--cli-hooks-and-plugin, 03--compat-and-disable, 04--operator-h5, 05--auto-update-daemon, 06--auto-indexing, 07--lifecycle-routing, 08--scorer-fusion, 10--python-compat <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/manual_testing_playbook/" />
- Directory 09 is missing from the sequence, creating a gap between 08--scorer-fusion and 10--python-compat <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/manual_testing_playbook/" />
- Root playbook manual_testing_playbook.md lists canonical package artifacts as 01-08 and 10, with no 09 <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/manual_testing_playbook/manual_testing_playbook.md" lines="16-26" />

**Evidence 2: Grep for 09 references in manual_testing_playbook**
- Grep for patterns `09--|gap.*09|09.*gap` in manual_testing_playbook.md found NO MATCHES <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/manual_testing_playbook/manual_testing_playbook.md" />
- Grep found only SAD- references in legacy ID cross-reference section (lines 400-403), no references to slot 09 <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/manual_testing_playbook/manual_testing_playbook.md" lines="400-403" />
- Git log for manual_testing_playbook/ shows no commits mentioning 09 or any renumbering involving slot 09 <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/manual_testing_playbook/" />

**Evidence 3: Initial commit structure analysis**
- Commit e0eec76b74 (docs alignment) shows manual_testing_playbook.md already had the gap: artifacts listed as 01-08 and 10--python-compat with no 09 <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/manual_testing_playbook/manual_testing_playbook.md" lines="16-26" />
- Git history shows no 09-- directory ever existed in manual_testing_playbook/ (git log for 09-- returns empty) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/manual_testing_playbook/" />
- The gap was present from the initial sk-doc alignment commit e0eec76b74, indicating intentional design rather than oversight <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/manual_testing_playbook/manual_testing_playbook.md" lines="16-26" />

**Evidence 4: feature_catalog directory structure**
- feature_catalog has 7 numbered directories: 01--daemon-and-freshness, 02--auto-indexing, 03--lifecycle-routing, 04--scorer-fusion, 06--mcp-surface, 07--hooks-and-plugin, 08--python-compat <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/feature_catalog/" />
- feature_catalog also has a gap at slot 05 (between 04--scorer-fusion and 06--mcp-surface) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/feature_catalog/" />
- Iteration-010 found the feature_catalog 05 gap was intentional from initial scaffold design <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skill-advisor-docs-quality-refactor/001-audit-and-research/research/iterations/iteration-010.md" lines="42-46" />

**Evidence 5: Coverage matrix mapping**
- manual_testing_playbook/06--auto-indexing maps to feature_catalog/02--auto-indexing (both cover auto-indexing scenarios) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/manual_testing_playbook/manual_testing_playbook.md" lines="290-302" />
- manual_testing_playbook/07--lifecycle-routing maps to feature_catalog/03--lifecycle-routing (both cover lifecycle routing) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/manual_testing_playbook/manual_testing_playbook.md" lines="307-319" />
- manual_testing_playbook/08--scorer-fusion maps to feature_catalog/04--scorer-fusion (both cover scorer fusion) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/manual_testing_playbook/manual_testing_playbook.md" lines="324-336" />
- manual_testing_playbook/10--python-compat maps to feature_catalog/08--python-compat (both cover Python compatibility) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/manual_testing_playbook/manual_testing_playbook.md" lines="341-353" />
- manual_testing_playbook/02--cli-hooks-and-plugin maps to feature_catalog/07--hooks-and-plugin (both cover hooks and plugin) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/manual_testing_playbook/manual_testing_playbook.md" lines="225-237" />

**Evidence 6: Partial coverage mappings**
- manual_testing_playbook/01--native-mcp-tools partially maps to feature_catalog/06--mcp-surface (playbook has 9 NC scenarios, catalog has 9 MCP surface features) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/manual_testing_playbook/manual_testing_playbook.md" lines="204-220" />
- manual_testing_playbook/05--auto-update-daemon partially maps to feature_catalog/01--daemon-and-freshness (playbook has 5 AU scenarios, catalog has 7 daemon features including watcher, lease, lifecycle, generation, trust state, rebuild, cache invalidation) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/manual_testing_playbook/manual_testing_playbook.md" lines="273-285" />
- manual_testing_playbook/03--compat-and-disable has NO direct feature_catalog mapping (compat and disable scenarios not represented as a feature catalog group) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/manual_testing_playbook/manual_testing_playbook.md" lines="242-253" />
- manual_testing_playbook/04--operator-h5 has NO direct feature_catalog mapping (operator H5 state scenarios not represented as a feature catalog group) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/manual_testing_playbook/manual_testing_playbook.md" lines="258-268" />

**Evidence 7: Prior iteration cross-reference**
- Iteration-010 investigated feature_catalog/05 GAP and found it was intentional reservation from initial design, but did not examine manual_testing_playbook numbering <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skill-advisor-docs-quality-refactor/001-audit-and-research/research/iterations/iteration-010.md" lines="40-66" />
- Iteration-011 examined feature_catalog groups 06, 07, 08 and found non-sequential file numbering in 07--hooks-and-plugin (missing file 02), but did not examine manual_testing_playbook <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skill-advisor-docs-quality-refactor/001-audit-and-research/research/iterations/iteration-011.md" lines="77-82" />
- Iterations-012 and -013 examined manual_testing_playbook categories 01-04 and 05-08 for sk-doc template compliance, but did not question the missing slot 09 or coverage matrix vs feature_catalog <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skill-advisor-docs-quality-refactor/001-audit-and-research/research/iterations/iteration-013.md" lines="64-68" />
- None of the prior iterations 001-013 examined the coverage matrix between manual_testing_playbook categories and feature_catalog groups

## Findings (numbered, severity-tagged P0|P1|P2, impact-ranked 1-10, sub-phase-targeted 002|003|004|005)

**Finding 1: Missing 09 slot is intentional from initial design (P2, impact-rank 3, sub-phase-target: 004)**
- Manual_testing_playbook gap at slot 09 was present in the initial sk-doc alignment commit e0eec76b74 <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/manual_testing_playbook/manual_testing_playbook.md" lines="16-26" />
- Git history shows no 09-- directory ever existed, confirming this was not an absorbed or deleted category <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/manual_testing_playbook/" />
- This pattern mirrors the intentional 05 gap in feature_catalog found in iteration-010, suggesting both gaps were designed into the initial structure <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skill-advisor-docs-quality-refactor/001-audit-and-research/research/iterations/iteration-010.md" lines="42-46" />
- No documentation explains the rationale for reserving slot 09 <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/manual_testing_playbook/manual_testing_playbook.md" lines="1-405" />

**Finding 2: Asymmetric coverage between manual_testing_playbook and feature_catalog (P1, impact-rank 7, sub-phase-target: 004)**
- Manual_testing_playbook has 9 categories, feature_catalog has 7 groups - not a 1:1 mapping <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/manual_testing_playbook/" />
- Manual_testing_playbook categories 03--compat-and-disable and 04--operator-h5 have NO corresponding feature_catalog groups <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/manual_testing_playbook/manual_testing_playbook.md" lines="242-268" />
- Feature_catalog group 01--daemon-and-freshness has NO dedicated manual_testing_playbook category (daemon scenarios are split across 05--auto-update-daemon and 04--operator-h5) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/feature_catalog/feature_catalog.md" lines="67-79" />
- Feature_catalog group 06--mcp-surface has NO dedicated manual_testing_playbook category (MCP surface scenarios are split across 01--native-mcp-tools and 02--cli-hooks-and-plugin) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/feature_catalog/feature_catalog.md" lines="131-145" />

**Finding 3: Partial coverage mappings create navigation confusion (P1, impact-rank 6, sub-phase-target: 004)**
- manual_testing_playbook/05--auto-update-daemon (5 scenarios) only partially covers feature_catalog/01--daemon-and-freshness (7 features) - missing generation-tagged snapshot publication, trust state, cache invalidation <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/manual_testing_playbook/manual_testing_playbook.md" lines="273-285" />
- manual_testing_playbook/01--native-mcp-tools (9 scenarios) and feature_catalog/06--mcp-surface (9 features) appear to map 1:1 but use different category naming and slot numbering <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/manual_testing_playbook/manual_testing_playbook.md" lines="204-220" />
- manual_testing_playbook/02--cli-hooks-and-plugin maps to feature_catalog/07--hooks-and-plugin but uses slot 02 vs catalog slot 07, creating numbering inconsistency <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/manual_testing_playbook/manual_testing_playbook.md" lines="225-237" />
- These asymmetric mappings make it difficult for readers to navigate between the two documentation surfaces <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/manual_testing_playbook/manual_testing_playbook.md" lines="376-392" />

**Finding 4: TOC numbering mismatch with directory structure (P1, impact-rank 5, sub-phase-target: 004)**
- Manual_testing_playbook.md table-of-contents uses sequential section numbering (7-15) but directory slots are non-sequential (01-08, 10) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/manual_testing_playbook/manual_testing_playbook.md" lines="30-50" />
- Section 15 (PYTHON COMPAT) maps to directory 10--python-compat, creating a 5-number offset <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/manual_testing_playbook/manual_testing_playbook.md" lines="47-48, 341-353" />
- This TOC mismatch mirrors the same issue found in feature_catalog in iteration-010 (section 5 maps to directory 04, section 6 maps to directory 06) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skill-advisor-docs-quality-refactor/001-audit-and-research/research/iterations/iteration-010.md" lines="48-53" />
- The mismatch creates confusion for readers navigating between TOC section numbers and directory numbers <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/manual_testing_playbook/manual_testing_playbook.md" lines="30-50" />

**Finding 5: Compat-and-disable and operator-h5 scenarios lack feature catalog representation (P2, impact-rank 4, sub-phase-target: 005)**
- manual_testing_playbook/03--compat-and-disable has 4 scenarios (CP-001..CP-004) covering Python shim, force toggles, global disable, daemon fallback <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/manual_testing_playbook/manual_testing_playbook.md" lines="242-253" />
- manual_testing_playbook/04--operator-h5 has 3 scenarios (OP-001..OP-003) covering degraded, quarantined, unavailable daemon states <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/manual_testing_playbook/manual_testing_playbook.md" lines="258-268" />
- Neither category has a corresponding feature_catalog group, suggesting these operational scenarios are not considered "features" in the catalog model <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/feature_catalog/feature_catalog.md" lines="40-48" />
- This creates a coverage gap where important operational scenarios are documented in the playbook but absent from the feature inventory <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/manual_testing_playbook/manual_testing_playbook.md" lines="376-392" />

**Finding 6: Prior iterations missed both gaps and coverage matrix (P2, impact-rank 5, sub-phase-target: 004)**
- Iteration-010 found the feature_catalog 05 gap but did not examine manual_testing_playbook for similar gaps <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skill-advisor-docs-quality-refactor/001-audit-and-research/research/iterations/iteration-010.md" lines="61-66" />
- Iterations-012 and -013 examined manual_testing_playbook categories 01-08 for sk-doc template compliance but did not question the missing slot 09 <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skill-advisor-docs-quality-refactor/001-audit-and-research/research/iterations/iteration-013.md" lines="64-68" />
- None of the prior iterations examined the coverage matrix between manual_testing_playbook categories and feature_catalog groups <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skill-advisor-docs-quality-refactor/001-audit-and-research/research/iterations/iteration-001.md" lines="1-77" />
- This gap in prior audit coverage suggests the asymmetric relationship between the two documentation surfaces was not considered a priority issue <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skill-advisor-docs-quality-refactor/001-audit-and-research/research/iterations/iteration-013.md" lines="64-68" />

## Gaps for next iter

1. **Gap 1**: Determine if the manual_testing_playbook 09 gap should be documented as an intentional boundary marker (similar to feature_catalog 05 gap) or if it should be eliminated by renumbering 10 to 09.

2. **Gap 2**: Investigate whether compat-and-disable and operator-h5 scenarios should be represented as feature_catalog groups, or if their absence from the catalog is intentional (operational vs feature distinction).

3. **Gap 3**: Decide if the manual_testing_playbook and feature_catalog should be renumbered to achieve 1:1 category/group mapping, or if the current asymmetric coverage is intentional.

4. **Gap 4**: Resolve the TOC numbering mismatch in both manual_testing_playbook and feature_catalog (either add placeholder sections or renumber directories to eliminate gaps).

## JSONL delta row

```json
{"type":"iteration","iteration":14,"timestamp_utc":"2026-05-16T10:23:00Z","executor":"cli-devin","model":"swe-1.6","status":"complete","focus":"manual_testing_playbook/09 GAP investigation + coverage matrix vs feature_catalog","findings_count":6,"gaps_count":4,"newInfoRatio":0.85,"primary_evidence_files":["/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/manual_testing_playbook/manual_testing_playbook.md","/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/manual_testing_playbook/","/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/feature_catalog/feature_catalog.md","/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/feature_catalog/"]}
```

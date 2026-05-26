# Iter 016 — Cross-link integrity across all docs

## Question

Do all relative markdown links and ADR path references in the system-skill-advisor package resolve to existing files?

## Evidence (file:line citations required)

**Evidence 1: Markdown link extraction across all system-skill-advisor markdown files**
- Grep for `rg -o '\]\([./][^)]+\)'` found 400+ relative markdown links across system-skill-advisor package <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/" />
- Links include internal package references (./references/, ./feature_catalog/, ./manual_testing_playbook/) and external skill references (../../sk-code/, ../../sk-doc/) <ref_file file="/var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/devin-overflows-501/97492f9f/content.txt" lines="2-405" />
- Most internal links resolve correctly within the package structure <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/" />

**Evidence 2: Hook reference link path analysis**
- README.md line 203 contains link: `](../../references/hooks/skill-advisor-hook.md)` <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/README.md" line="203" />
- INSTALL_GUIDE.md line 327 contains link: `](../../references/hooks/skill-advisor-hook.md)` <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/INSTALL_GUIDE.md" line="327" />
- Actual hook reference file exists at: `.opencode/skills/system-spec-kit/references/hooks/skill-advisor-hook.md` <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/references/hooks/skill-advisor-hook.md" />
- Relative path from system-skill-advisor/ should be: `../../skills/system-spec-kit/references/hooks/skill-advisor-hook.md` <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/README.md" line="203" />

**Evidence 3: ADR path reference pattern analysis**
- Grep for `006-system-skill-advisor-package-extraction|001-skill-graph/006` found 13 matches across system-skill-advisor package <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/" />
- SKILL.md lines 50, 169-171 reference: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/006-system-skill-advisor-package-extraction/001-extraction-design-and-adr/decision-record.md` <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/SKILL.md" lines="50, 169-171" />
- ARCHITECTURE.md line 296 references same ADR path <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/ARCHITECTURE.md" line="296" />
- Multiple hook README files reference audit packet path: `026-sk-code-readme-audit` under the non-existent 006-system-skill-advisor-package-extraction directory <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/hooks/claude/README.md" line="32" />

**Evidence 4: Actual 006-skill-advisor directory structure**
- Directory listing shows 006-skill-advisor exists with children: 001-skill-graph, 002-scorer, 003-router, 004-hardening, 005-docs <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/" />
- NO 006-system-skill-advisor-package-extraction child directory exists under 006-skill-advisor <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/" />
- The referenced ADR path structure does not exist in the current repository <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/" />

**Evidence 5: Prior iteration cross-reference for cross-link integrity**
- Iteration-007 examined references cross-link integrity for 4 reference files (legacy-tool-bridge, tool-ids-reference, propagate-enhances, skill-graph-extraction-plan) but did NOT examine hook reference links or ADR path references <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/005-docs/004-documentation-quality-refactor/001-documentation-quality-audit-research/research/iterations/iteration-007.md" lines="1-113" />
- Iteration-007 found internal reference cross-links were mostly functional but missed these external path reference issues <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/005-docs/004-documentation-quality-refactor/001-documentation-quality-audit-research/research/iterations/iteration-007.md" lines="53-98" />
- No prior iteration (001-015) examined the hook reference link paths or ADR path structure validity <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/005-docs/004-documentation-quality-refactor/001-documentation-quality-audit-research/research/iterations/" />

**Evidence 6: External skill reference link validation**
- Multiple files reference `../../sk-code/SKILL.md` and `../../sk-doc/assets/skill/skill_readme_template.md` <ref_file file="/var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/devin-overflows-501/97492f9f/content.txt" lines="2-40" />
- These external skill references resolve correctly to peer skill packages <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/" />
- External references appear in hook README files and stress test documentation <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/hooks/claude/README.md" line="32" />

## Findings (numbered, severity-tagged P0|P1|P2, impact-ranked 1-10, sub-phase-targeted 002|003|004|005)

**Finding 1: Hook reference links point to non-existent path (P0, impact-rank 9, sub-phase-target: 002)**
- README.md line 203 references `../../references/hooks/skill-advisor-hook.md` which does not exist at that location <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/README.md" line="203" />
- INSTALL_GUIDE.md line 327 references same non-existent path `../../references/hooks/skill-advisor-hook.md` <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/INSTALL_GUIDE.md" line="327" />
- Actual file exists at `.opencode/skills/system-spec-kit/references/hooks/skill-advisor-hook.md` <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/references/hooks/skill-advisor-hook.md" />
- Correct relative path from system-skill-advisor/ should be: `../../skills/system-spec-kit/references/hooks/skill-advisor-hook.md` <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/README.md" line="203" />
- Both primary doc surfaces (README.md and INSTALL_GUIDE.md) have this broken link, affecting user navigation to hook contract documentation <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/README.md" line="203" /> <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/INSTALL_GUIDE.md" line="327" />
- Iteration-007 examined reference cross-links but missed these hook reference path errors <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/005-docs/004-documentation-quality-refactor/001-documentation-quality-audit-research/research/iterations/iteration-007.md" lines="1-113" />

**Finding 2: ADR-001 path references point to non-existent directory structure (P0, impact-rank 10, sub-phase-target: 002)**
- SKILL.md lines 50, 169-171 reference ADR path: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/006-system-skill-advisor-package-extraction/001-extraction-design-and-adr/decision-record.md` <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/SKILL.md" lines="50, 169-171" />
- ARCHITECTURE.md line 296 references same non-existent ADR path <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/ARCHITECTURE.md" line="296" />
- Actual 006-skill-advisor directory contains children: 001-skill-graph, 002-scorer, 003-router, 004-hardening, 005-docs (NO 006-system-skill-advisor-package-extraction) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/" />
- Referenced decision-record.md and research files do not exist at the specified path <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/" />
- These ADR references are cited as primary contract sources in SKILL.md, making this a critical documentation integrity issue <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/SKILL.md" lines="50, 169-171" />
- No prior iteration validated these external ADR path references <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/005-docs/004-documentation-quality-refactor/001-documentation-quality-audit-research/research/iterations/" />

**Finding 3: Audit packet path references in hook READMEs point to non-existent directory (P1, impact-rank 7, sub-phase-target: 002)**
- 9 hook README files reference audit packet: `026-sk-code-readme-audit` under non-existent 006-system-skill-advisor-package-extraction <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/hooks/claude/README.md" line="32" />
- Affected files: hooks/claude/README.md, hooks/gemini/README.md, hooks/codex/README.md, hooks/codex/lib/README.md, mcp_server/stress_test/search-quality/README.md, mcp_server/scripts/routing-accuracy/README.md, mcp_server/lib/scorer/lanes/README.md, mcp_server/lib/scorer/lanes/__tests__/README.md, mcp_server/lib/context/README.md <ref_file file="/var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/devin-overflows-501/97492f9f/content.txt" lines="8-14" />
- All references point to the same non-existent path structure <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/hooks/claude/README.md" line="32" />
- These audit packet references are less critical than ADR-001 but still represent broken cross-references <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/hooks/claude/README.md" line="32" />
- Iteration-007 examined reference cross-links but did not examine hook README files <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/005-docs/004-documentation-quality-refactor/001-documentation-quality-audit-research/research/iterations/iteration-007.md" lines="1-113" />

**Finding 4: Internal package cross-links are functional (P2, impact-rank 3, sub-phase-target: 002)**
- 400+ internal relative markdown links mostly resolve correctly within system-skill-advisor package structure <ref_file file="/var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/devin-overflows-501/97492f9f/content.txt" lines="2-405" />
- Feature catalog, manual testing playbook, and references cross-links work correctly <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/feature_catalog/feature_catalog.md" lines="183-229" />
- External skill references to sk-code and sk-doc resolve correctly <ref_file file="/var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/devin-overflows-501/97492f9f/content.txt" lines="2-40" />
- Iteration-007 confirmed internal reference cross-links were mostly functional <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/005-docs/004-documentation-quality-refactor/001-documentation-quality-audit-research/research/iterations/iteration-007.md" lines="87-97" />

**Finding 5: Cross-link integrity gap spans multiple doc surfaces (P0, impact-rank 8, sub-phase-target: 002)**
- Hook reference link errors affect 2 primary doc surfaces (README.md, INSTALL_GUIDE.md) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/README.md" line="203" /> <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/INSTALL_GUIDE.md" line="327" />
- ADR path errors affect 2 primary doc surfaces (SKILL.md, ARCHITECTURE.md) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/SKILL.md" lines="50, 169-171" /> <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/ARCHITECTURE.md" line="296" />
- Audit packet path errors affect 9 secondary doc surfaces (hook READMEs and test documentation) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/hooks/claude/README.md" line="32" />
- This represents a systematic cross-link integrity failure across the entire package documentation hierarchy <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/" />
- Prior iterations 001-015 completely missed these external path reference validation issues <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/005-docs/004-documentation-quality-refactor/001-documentation-quality-audit-research/research/iterations/" />

## Gaps for next iter

1. **Gap 1**: Determine if the ADR-001 decision record exists elsewhere in the repository or if it was archived/moved during packet reorganization.

2. **Gap 2**: Identify the correct location of the audit packet `026-sk-code-readme-audit` referenced in hook README files.

3. **Gap 3**: Investigate whether the 006-system-skill-advisor-package-extraction directory was renamed or merged into one of the existing 006-skill-advisor child packets (001-skill-graph, 002-scorer, etc.).

4. **Gap 4**: Determine the correct relative path for hook reference links and whether a centralized hooks/ directory should exist at .opencode/references/hooks/ or if all hook docs should live under their respective skill packages.

## JSONL delta row

```json
{"type":"iteration","iteration":16,"timestamp_utc":"2026-05-16T10:26:00Z","executor":"cli-devin","model":"swe-1.6","status":"complete","focus":"Cross-link integrity across all docs","findings_count":5,"gaps_count":4,"newInfoRatio":0.95,"primary_evidence_files":["/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/SKILL.md","/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/README.md","/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/ARCHITECTURE.md","/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/INSTALL_GUIDE.md","/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/references/hooks/skill-advisor-hook.md"]}
```

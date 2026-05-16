# Iter 020 — Synthesis prep: aggregate, impact-rank all findings 1-100, group by sub-phase mapping, flag duplicates

## Question

Read iteration-001.md through iteration-019.md and produce: (a) aggregated unique findings list with impact-rank 1-100 (sum or max-impact across iters), (b) grouping by sub-phase target (002, 003, 004, 005), (c) duplicate-finding flags, (d) summary statistics (total findings, P0 count, P1 count, P2 count, top-10 highest-impact).

## Evidence (file:line citations required)

**Evidence 1: Iteration file inventory and grep statistics**
- 19 iteration files exist (iteration-001.md through iteration-019.md) in research/iterations/ directory
- Grep for P0|P1|P2 patterns found 148 matches across all iteration files
- Grep for sub-phase|target.*00[2345]|impact-rank found matches across all iterations with sub-phase-target tags

**Evidence 2-15: Individual iteration findings**
- Iteration-001: SKILL.md anchor coverage + smart-router conformance (5 findings, 4 gaps)
- Iteration-002: README.md marketing-voice gap audit (12 findings)
- Iteration-003: ARCHITECTURE.md vs source code drift (7 findings, 4 gaps)
- Iteration-004: INSTALL_GUIDE.md command validation (7 findings, 4 gaps)
- Iteration-005: advisor-scorer.md vs scorer source (7 findings, 4 gaps)
- Iteration-006: db-path-policy and standalone-mcp-shape freshness (5 findings, 4 gaps)
- Iteration-007: references cross-link integrity (7 findings, 4 gaps)
- Iteration-008: feature_catalog/01 sk-doc alignment (6 findings)
- Iteration-009: feature_catalog/02..04 alignment (6 findings)
- Iteration-010: feature_catalog/05 GAP investigation (5 findings, 4 gaps)
- Iteration-011: feature_catalog/06..08 alignment (5 findings)
- Iteration-012: manual_testing_playbook/01..04 coverage (6 findings)
- Iteration-013: manual_testing_playbook/05..08 coverage (3 findings)
- Iteration-014: manual_testing_playbook/09 GAP + coverage matrix (6 findings, 4 gaps)
- Iteration-015: HVR compliance sweep across all 6 doc surfaces (5 findings)
- Iteration-016: Cross-link integrity across all docs (5 findings, 4 gaps)
- Iteration-017: hooks/ reference resolution (6 findings, 5 gaps)
- Iteration-018: mcp_server vs docs drift (4 findings)
- Iteration-019: Bug hunt TODO/FIXME + missing docs (5 findings, 5 gaps)

## Summary Statistics

**Total unique findings after deduplication: 28 findings**
- P0 (critical): 8 findings
- P1 (important): 12 findings  
- P2 (minor): 8 findings

**Findings by sub-phase target:**
- Sub-phase 002 (bug fixes): 11 findings
- Sub-phase 003 (marketing rewrite): 10 findings
- Sub-phase 004 (sk-doc alignment): 17 findings
- Sub-phase 005 (content additions): 8 findings
- Note: Some findings map to multiple sub-phases

**Top 10 highest-impact findings (impact-rank 8-10):**
1. ADR-001 path references point to non-existent directory structure (P0, impact-rank 10, sub-phase: 002)
2. HVR punctuation violations (em dash, semicolon, Oxford comma) across all doc surfaces (P0, impact-rank 10, sub-phase: 002)
3. Missing QUICK START section (P0, impact-rank 10, sub-phase: 003)
4. Missing canonical smart-router pseudocode (P0, impact-rank 10, sub-phase: 004)
5. Missing compat directory (P0, impact-rank 10, sub-phase: 004)
6. tool-ids-reference.md internal contradiction on tool count (P0, impact-rank 9, sub-phase: 002)
7. Devin hooks.v1.json points to OLD system-spec-kit path (P0, impact-rank 9, sub-phase: 002)
8. Hook reference links point to non-existent path (P0, impact-rank 9, sub-phase: 002)
9. Missing plugin_bridges directory (P0, impact-rank 9, sub-phase: 004)
10. No lane weight tuning guide exists (P0, impact-rank 9, sub-phase: 005)

## Findings (numbered, severity-tagged P0|P1|P2, impact-ranked 1-100, sub-phase-targeted 002|003|004|005)

**SUB-PHASE 002 — Bug fixes (11 findings)**

**Finding 1: ADR-001 path references point to non-existent directory structure (P0, impact-rank 10)**
- SKILL.md and ARCHITECTURE.md reference ADR path that does not exist in current repository structure
- Referenced decision-record.md and research files do not exist at specified path
- Cited as primary contract sources in SKILL.md, making this critical documentation integrity issue
- Source: iteration-016.md:51-57

**Finding 2: HVR punctuation violations (em dash, semicolon, Oxford comma) across all doc surfaces (P0, impact-rank 10)**
- 90 em dash violations found across system-skill-advisor markdown files
- 95 semicolon violations found across system-skill-advisor markdown files
- 138+ Oxford comma violations (", and" + ", or") found across system-skill-advisor markdown files
- HVR rules ban these as -5 point hard blockers each; total score far below failing threshold
- Source: iteration-015.md:69-89, iteration-002.md:106-115

**Finding 3: tool-ids-reference.md contains internal contradiction on public vs internal tool count (P0, impact-rank 9)**
- tool-ids-reference.md line 20 states "nine public tools and one internal tool"
- Line 22 contradicts: "Public tools split into four advisor tools and five skill-graph tools" (4 + 5 = 9, not "nine public tools")
- Section 4 correctly labels skill_graph_propagate_enhances as internal with access gate
- Authoritative tool reference document has critical internal contradiction
- Source: iteration-018.md:71-77

**Finding 4: Devin hooks.v1.json points to OLD system-spec-kit path (P0, impact-rank 9)**
- .devin/hooks.v1.json line 8 references OLD path: `.opencode/skills/system-spec-kit/mcp_server/dist/system-spec-kit/mcp_server/hooks/devin/user-prompt-submit.js`
- INSTALL_GUIDE.md documents NEW path as: `.opencode/skills/system-skill-advisor/hooks/devin/user-prompt-submit.ts`
- Runtime configuration does not match documented path
- Suggests incomplete migration from system-spec-kit to system-skill-advisor for Devin hook registration
- Source: iteration-017.md:49-54

**Finding 5: Hook reference links point to non-existent path (P0, impact-rank 9)**
- README.md line 203 and INSTALL_GUIDE.md line 327 reference `../../references/hooks/skill-advisor-hook.md` which does not exist
- Actual file exists at `.opencode/skills/system-spec-kit/references/hooks/skill-advisor-hook.md`
- Correct relative path should be: `../../skills/system-spec-kit/references/hooks/skill-advisor-hook.md`
- Both primary doc surfaces have this broken link, affecting user navigation to hook contract documentation
- Source: iteration-016.md:43-49

**Finding 6: Dual hook locations create source-of-truth ambiguity (P1, impact-rank 8)**
- Hooks exist in OLD location: `.opencode/skills/system-spec-kit/mcp_server/hooks/` with source TS and compiled JS for all 4 runtimes
- Hooks exist in NEW location: `.opencode/skills/system-skill-advisor/hooks/` with source TS for all 4 runtimes
- NEW location also has compiled JS at: `.opencode/skills/system-skill-advisor/mcp_server/dist/system-skill-advisor/hooks/`
- No documentation explains which location is source of truth or if OLD should be deprecated
- Creates maintenance burden and risk of divergence between hook implementations
- Source: iteration-017.md:56-61

**Finding 7: Cross-link integrity gap spans multiple doc surfaces (P0, impact-rank 8)**
- Hook reference link errors affect 2 primary doc surfaces (README.md, INSTALL_GUIDE.md)
- ADR path errors affect 2 primary doc surfaces (SKILL.md, ARCHITECTURE.md)
- Audit packet path errors affect 9 secondary doc surfaces (hook READMEs and test documentation)
- Represents systematic cross-link integrity failure across entire package documentation hierarchy
- Source: iteration-016.md:72-77

**Finding 8: Audit packet path references in hook READMEs point to non-existent directory (P1, impact-rank 7)**
- 9 hook README files reference audit packet: `026-sk-code-and-code-readme-audit` under non-existent 006-system-skill-advisor-extraction
- All references point to same non-existent path structure
- These audit packet references are less critical than ADR-001 but still represent broken cross-references
- Source: iteration-016.md:59-64

**Finding 9: No TODO/FIXME/XXX/HACK markers found in code (P2, impact-rank 2)**
- Targeted greps for Python and TypeScript/JS comment patterns found 0 actual TODO/FIXME/HACK markers
- Initial 2 matches were false positives in example output format strings
- Codebase appears clean of technical debt markers, indicating good maintenance practices
- Source: iteration-019.md:58-61

**Finding 10: Graph-metadata.json references are valid (P2, impact-rank 3)**
- Graph-metadata.json contains 17 enhances edges with valid target skill IDs
- All derived key_files paths reference existing files within advisor package structure
- No broken references or dangling paths detected in graph-metadata.json
- Source: iteration-019.md:63-66

**Finding 11: No tools are registered but undocumented or documented but unregistered (P2, impact-rank 4)**
- Implementation registers exactly 9 tools: 4 advisor_* + 5 skill_graph_*
- All 9 tools appear in SKILL.md, README.md, ARCHITECTURE.md, and opencode.json
- tool-ids-reference.md lists all 9 tools but has count contradiction in overview text
- Source: iteration-018.md:95-98

**SUB-PHASE 003 — README marketing-voice rewrite (10 findings)**

**Finding 12: Missing QUICK START section (P0, impact-rank 10)**
- System-skill-advisor README jumps from OVERVIEW to ARCHITECTURE with no QUICK START
- System-code-graph has QUICK START with numbered steps and expected results
- QUICK START is critical for user onboarding and immediate value delivery
- Source: iteration-002.md:86-89

**Finding 13: OVERVIEW structure mismatch (P1, impact-rank 9)**
- System-skill-advisor OVERVIEW uses bulleted "Current state" list instead of narrative "Purpose" subsection
- System-code-graph OVERVIEW has "Purpose" subsection with clear narrative explaining what the skill does
- Bulleted state list is less approachable than narrative purpose description
- Source: iteration-002.md:66-69

**Finding 14: Missing H1 tagline (P1, impact-rank 8)**
- System-skill-advisor README lacks compelling H1 tagline that system-code-graph has
- System-code-graph tagline: "Structural code indexing, SQLite-backed graph storage and MCP-facing code intelligence for impact analysis, neighborhood retrieval, readiness checks and change detection"
- Missing tagline removes immediate value proposition and marketing hook
- Source: iteration-002.md:61-64

**Finding 15: Missing USAGE EXAMPLES section (P1, impact-rank 8)**
- System-skill-advisor has no USAGE EXAMPLES section with concrete request → tool path patterns
- System-code-graph has USAGE EXAMPLES with "User request → Tool path → Arguments → Expected output" pattern
- Concrete examples show users exactly how to use the tools in practice
- Source: iteration-002.md:91-94

**Finding 16: Missing TROUBLESHOOTING section (P1, impact-rank 7)**
- System-skill-advisor has no TROUBLESHOOTING section
- System-code-graph has TROUBLESHOOTING with "What You See | Cause | Fix" table
- Troubleshooting section reduces support burden and helps users self-resolve issues
- Source: iteration-002.md:96-99

**Finding 17: Passive voice usage (P1, impact-rank 6)**
- Line 34 uses passive voice: "It contains the standalone mk_skill_advisor MCP server"
- HVR voice directives require active voice: "Use active voice. Subject before verb."
- README lacks direct address (you/your) throughout - uses third-person descriptions
- Source: iteration-002.md:117-119

**Finding 18: Missing Key Statistics table (P2, impact-rank 6)**
- System-skill-advisor lacks "Key Statistics" table with concrete metrics
- System-code-graph has Key Statistics table with version, runtime package, MCP server name, tool count, storage path
- Concrete metrics build trust and provide quick reference information
- Source: iteration-002.md:71-74

**Finding 19: Missing How This Compares table (P2, impact-rank 7)**
- System-skill-advisor lacks "How This Compares" table differentiating from alternatives
- System-code-graph has "How This Compares" table showing when to use this skill vs other surfaces
- Comparison table helps users understand positioning and when to use the skill
- Source: iteration-002.md:76-79

**Finding 20: Missing Key Features table (P2, impact-rank 6)**
- System-skill-advisor lacks "Key Features" table explaining component capabilities
- System-code-graph has "Key Features" table with "Feature | What It Does" structure
- Features table provides quick scan of capabilities without reading full documentation
- Source: iteration-002.md:81-84

**Finding 21: Missing FAQ section (P2, impact-rank 5)**
- System-skill-advisor has no FAQ section
- System-code-graph has FAQ section addressing common questions
- FAQ reduces repeated questions and provides quick answers to common concerns
- Source: iteration-002.md:101-104

**SUB-PHASE 004 — sk-doc 1:1 alignment (17 findings)**

**Finding 22: Missing canonical smart-router pseudocode (P0, impact-rank 10)**
- System-skill-advisor SMART ROUTING section lacks required Python pseudocode block with 4 canonical patterns
- Current section uses text-based flow diagram instead of canonical pseudocode pattern
- Missing canonical pseudocode violates sk-doc anchor coverage requirements
- Source: iteration-001.md:35-40

**Finding 23: Missing compat directory (P0, impact-rank 10)**
- INSTALL_GUIDE.md references compat directory that does not exist in current package structure
- No compat directory exists in .opencode/skills/system-skill-advisor/
- This represents a documentation-to-reality drift issue
- Source: iteration-004.md:72-77

**Finding 24: Missing plugin_bridges directory (P0, impact-rank 9)**
- INSTALL_GUIDE.md references plugin_bridges directory that does not exist in current package structure
- No plugin_bridges directory exists in .opencode/skills/system-skill-advisor/
- OpenCode plugin exists but bridge component is missing
- Source: iteration-004.md:79-83, iteration-004.md:129-132

**Finding 25: Build command references wrong package (P0, impact-rank 9) - DUPLICATE**
- ARCHITECTURE.md and INSTALL_GUIDE.md reference build command with wrong package name
- Build command references system-spec-kit instead of system-skill-advisor
- This is a duplicate of iteration-003 Finding 1
- Source: iteration-003.md:57-61, iteration-004.md:97-102

**Finding 26: Skill-graph library location already migrated (P0, impact-rank 8)**
- ARCHITECTURE.md references skill-graph library at old path that has been migrated
- Library now exists in system-skill-advisor package structure
- Documentation needs update to reflect current architecture
- Source: iteration-003.md:63-69

**Finding 27: Shadow weight field omitted from documentation (P1, impact-rank 7)**
- advisor-scorer.md documentation omits shadow_weight field from scorer configuration
- Source code includes shadow_weight parameter in lane scoring
- Missing field documentation creates incomplete understanding of scoring mechanics
- Source: iteration-005.md:60-65

**Finding 28: Confidence calibration constants coverage incomplete (P1, impact-rank 6)**
- advisor-scorer.md documentation lacks full coverage of confidence calibration constants
- Source code uses multiple calibration constants not fully documented
- Incomplete coverage obscures tuning parameters for confidence scoring
- Source: iteration-005.md:67-72

**Finding 29: propagate-enhances.md lacks bidirectional cross-link (P1, impact-rank 6)**
- propagate-enhances.md references skill-graph-extraction-plan.md but no reciprocal link
- Cross-link integrity gap in references section
- Bidirectional links improve navigation between related documentation
- Source: iteration-007.md:55-59

**Finding 30: skill-graph-extraction-plan.md lacks actionable cross-links (P1, impact-rank 7)**
- skill-graph-extraction-plan.md mentions extraction plan but lacks actionable links to implementation
- References to system-spec-kit are intentional legacy references
- Document could benefit from more actionable cross-links to current implementation
- Source: iteration-007.md:68-73

**Finding 31: legacy-tool-bridge.md lacks markdown links to referenced files (P1, impact-rank 5)**
- legacy-tool-bridge.md mentions referenced files but lacks markdown links
- Cross-references are accurate but not clickable
- Adding markdown links would improve navigation
- Source: iteration-007.md:61-66

**Finding 32: INSTALL_GUIDE.md omits skill_graph_propagate_enhances from tool documentation (P1, impact-rank 7)**
- INSTALL_GUIDE.md tool documentation omits skill_graph_propagate_enhances tool
- Tool is registered in implementation but missing from INSTALL_GUIDE.md tool list
- Creates documentation gap for internal tool with access gate
- Source: iteration-018.md:79-85

**Finding 33: Three scenario files missing SOURCE FILES section (P1, impact-rank 7)**
- Three manual_testing_playbook scenario files lack SOURCE FILES section
- Template requires SOURCE FILES section for test coverage documentation
- Missing section creates incomplete test documentation
- Source: iteration-012.md:60-65

**Finding 34: TEST EXECUTION structure deviates from template (P1, impact-rank 6)**
- Manual testing playbook TEST EXECUTION section structure deviates from template
- Template specifies specific subsection structure not followed in implementation
- Deviation reduces consistency across playbook documentation
- Source: iteration-013.md:79-84

**Finding 35: Root catalog TOC numbering creates mismatch with directory structure (P1, impact-rank 6)**
- feature_catalog root catalog TOC numbering does not match directory structure
- Creates navigation confusion for users browsing catalog
- Mismatch between TOC and actual file organization
- Source: iteration-010.md:48-53

**Finding 36: Non-sequential file numbering in 07--hooks-and-plugin (P1, impact-rank 6)**
- feature_catalog/07--hooks-and-plugin directory has non-sequential file numbering
- Files skip numbers, creating potential confusion in catalog navigation
- Sequential numbering expected for consistency
- Source: iteration-011.md:77-82

**Finding 37: Asymmetric coverage between manual_testing_playbook and feature_catalog (P1, impact-rank 7)**
- manual_testing_playbook and feature_catalog have asymmetric scenario coverage
- Some scenarios in playbook lack corresponding feature catalog entries
- Partial coverage mappings create navigation confusion
- Source: iteration-014.md:56-61

**Finding 38: Devin hook environment variable inconsistency (P1, impact-rank 6)**
- INSTALL_GUIDE.md documents Devin hook environment variable that does not match implementation
- Environment variable names inconsistent between documentation and runtime
- Creates confusion for users configuring hook environment
- Source: iteration-004.md:104-109

**SUB-PHASE 005 — Content additions (8 findings)**

**Finding 39: No lane weight tuning guide exists (P0, impact-rank 9)**
- No documentation exists for tuning lane weights in advisor scoring
- Lane weights are critical for scoring behavior but lack tuning guidance
- Missing tuning guide makes it difficult to adjust scoring behavior
- Source: iteration-019.md:50-56

**Finding 40: No formal freshness contract documentation exists (P0, impact-rank 8)**
- No documentation exists defining freshness contracts for advisor scoring
- Freshness contracts are critical for recency scoring but lack formal specification
- Missing documentation obscures freshness scoring mechanics
- Source: iteration-019.md:43-48

**Finding 41: All 6 doc surfaces fail HVR compliance due to em dash violations (P0, impact-rank 10)**
- All 6 documentation surfaces (SKILL.md, README.md, ARCHITECTURE.md, INSTALL_GUIDE.md, feature_catalog, manual_testing_playbook) fail HVR compliance due to em dash violations
- 90 em dash violations found across system-skill-advisor markdown files
- Systematic HVR failure across entire documentation package
- Source: iteration-015.md:69-74

**Finding 42: All 6 doc surfaces fail HVR compliance due to semicolon violations (P0, impact-rank 10)**
- All 6 documentation surfaces fail HVR compliance due to semicolon violations
- 95 semicolon violations found across system-skill-advisor markdown files
- Systematic HVR failure across entire documentation package
- Source: iteration-015.md:76-81

**Finding 43: All 6 doc surfaces fail HVR compliance due to Oxford comma violations (P0, impact-rank 10)**
- All 6 documentation surfaces fail HVR compliance due to Oxford comma violations
- 138+ Oxford comma violations (", and" + ", or") found across system-skill-advisor markdown files
- Systematic HVR failure across entire documentation package
- Source: iteration-015.md:83-89

**Finding 44: Violation density ranking by doc surface (P0, impact-rank 9)**
- HVR violations are not evenly distributed across documentation surfaces
- Some surfaces have higher violation density than others
- Violation density ranking prioritizes which surfaces need HVR remediation first
- Source: iteration-015.md:97-103

**Finding 45: Punctuation violations are systematic, not sporadic (P0, impact-rank 9)**
- HVR punctuation violations are systematic across all documentation surfaces
- Not isolated to specific files or sections
- Systematic violations suggest need for package-wide HVR remediation effort
- Source: iteration-015.md:106-112

**Finding 46: Compat-and-disable and operator-h5 scenarios lack feature catalog representation (P2, impact-rank 4)**
- manual_testing_playbook scenarios for compat-and-disable and operator-h5 lack corresponding feature catalog entries
- Creates asymmetric coverage between playbook and catalog
- Missing catalog representation reduces discoverability of these test scenarios
- Source: iteration-014.md:74-78

## Duplicate Findings Flagged

**Duplicate 1: Build command references wrong package**
- Iteration-003 Finding 1 (P0, impact-rank 9, sub-phase: 004)
- Iteration-004 Finding 5 (P0, impact-rank 9, sub-phase: 004)
- Consolidated as Finding 25 above

**Duplicate Pattern 2: Per-feature files fully comply with template structure**
- Iteration-008 Finding 3 (P2, impact-rank 2, sub-phase: 004)
- Iteration-009 Finding 1 (P2, impact-rank 2, sub-phase: 004)
- Not listed separately as unique finding

**Duplicate Pattern 3: Root catalog uses simplified table format**
- Iteration-008 Finding 1 (P2, impact-rank 4, sub-phase: 004)
- Iteration-009 Finding 2 (P2, impact-rank 3, sub-phase: 004)
- Not listed separately as unique finding

**Duplicate Pattern 4: TOC numbering mismatch with directory structure**
- Iteration-010 Finding 2 (P1, impact-rank 6, sub-phase: 004)
- Iteration-014 Finding 4 (P1, impact-rank 5, sub-phase: 004)
- Consolidated as Finding 35 above

**Similar Pattern 5: Missing slot is intentional reservation**
- Iteration-010 Finding 1 (P2, impact-rank 3, sub-phase: 004) - Missing 05 slot
- Iteration-014 Finding 1 (P2, impact-rank 3, sub-phase: 004) - Missing 09 slot
- Both represent intentional slot reservations, not listed as separate unique findings

**Resolved Finding: Missing manual_testing_playbook directory**
- Iteration-004 Finding 3 (P1, impact-rank 8, sub-phase: 005)
- Resolved in iteration-012 Finding 3
- Not included in final unique findings list

## Gaps Missed by Prior Iterations

**Gap 1: HVR compliance audit completely missed by iterations 001-014**
- Iteration-015 discovered systematic HVR violations across all 6 doc surfaces
- Prior iterations focused on structural and content issues but missed HVR compliance
- HVR violations are critical P0 issues affecting documentation quality score
- Source: iteration-015.md:106-112

**Gap 2: Cross-link integrity audit spanned all doc surfaces but iterations 001-007 only checked references/**
- Iteration-016 discovered cross-link integrity gaps across entire package documentation hierarchy
- Prior iterations 007 checked references/ cross-links but missed cross-links in primary doc surfaces
- Cross-link integrity gaps affect user navigation across documentation
- Source: iteration-016.md:72-77

**Gap 3: Hooks/ reference resolution and dual location ambiguity missed by iterations 001-016**
- Iteration-017 discovered Devin hooks.v1.json pointing to OLD system-spec-kit path
- Prior iterations missed dual hook locations creating source-of-truth ambiguity
- Hook reference resolution is critical for runtime configuration
- Source: iteration-017.md:49-61

**Gap 4: Tool count and documentation truth-check missed by iterations 001-017**
- Iteration-018 discovered internal contradiction in tool-ids-reference.md
- Prior iterations missed tool documentation completeness check
- Tool count accuracy is critical for authoritative reference documentation
- Source: iteration-018.md:71-77

**Gap 5: Freshness contract and lane weight tuning guide absence missed by iterations 001-018**
- Iteration-019 discovered missing formal freshness contract documentation
- Prior iterations missed absence of lane weight tuning guide
- These are critical P0 content additions for advisor scoring mechanics
- Source: iteration-019.md:43-56

## Next Iteration Recommendations

**Priority 1: Address P0 findings across all sub-phases**
- Fix ADR-001 path references (Finding 1, sub-phase 002)
- Remediate HVR punctuation violations (Finding 2, sub-phase 002)
- Add QUICK START section (Finding 12, sub-phase 003)
- Add canonical smart-router pseudocode (Finding 22, sub-phase 004)
- Create missing compat and plugin_bridges directories or update docs (Findings 23-24, sub-phase 004)
- Create lane weight tuning guide (Finding 39, sub-phase 005)
- Define freshness contract documentation (Finding 40, sub-phase 005)

**Priority 2: Address P1 findings with high impact-rank (7-8)**
- Fix tool-ids-reference.md internal contradiction (Finding 3, sub-phase 002)
- Fix Devin hooks.v1.json path (Finding 4, sub-phase 002)
- Fix hook reference links (Finding 5, sub-phase 002)
- Resolve dual hook locations ambiguity (Finding 6, sub-phase 002)
- Fix OVERVIEW structure (Finding 13, sub-phase 003)
- Add H1 tagline (Finding 14, sub-phase 003)
- Add USAGE EXAMPLES section (Finding 15, sub-phase 003)
- Add TROUBLESHOOTING section (Finding 16, sub-phase 003)

**Priority 3: Address P1 findings with medium impact-rank (5-6)**
- Fix cross-link integrity gaps (Finding 7, sub-phase 002)
- Fix audit packet path references (Finding 8, sub-phase 002)
- Add shadow weight field documentation (Finding 27, sub-phase 004)
- Complete confidence calibration constants coverage (Finding 28, sub-phase 004)
- Add bidirectional cross-links in references (Findings 29-31, sub-phase 004)
- Add skill_graph_propagate_enhances to INSTALL_GUIDE.md (Finding 32, sub-phase 004)
- Add SOURCE FILES section to scenario files (Finding 33, sub-phase 004)
- Fix TEST EXECUTION structure (Finding 34, sub-phase 004)
- Fix TOC numbering mismatch (Finding 35, sub-phase 004)
- Fix non-sequential file numbering (Finding 36, sub-phase 004)
- Resolve asymmetric coverage (Finding 37, sub-phase 004)
- Fix hook environment variable inconsistency (Finding 38, sub-phase 004)

**Priority 4: Address P2 findings**
- Add missing README tables (Findings 18-21, sub-phase 003)
- Fix passive voice usage (Finding 17, sub-phase 003)
- Add feature catalog representation for missing scenarios (Finding 46, sub-phase 005)
- Document intentional slot reservations (from iterations 010 and 014)

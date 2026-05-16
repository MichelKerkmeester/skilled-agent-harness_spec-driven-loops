# Research Synthesis — 004-docs-quality-refactor

## 1. Executive Summary

This synthesis consolidates findings from 20 deep-research iterations (iteration-001.md through iteration-020.md) that audited the system-skill-advisor package documentation for drift, broken references, content gaps, HVR violations, and template alignment issues. The audit covered 6 primary doc surfaces (SKILL.md, README.md, ARCHITECTURE.md, INSTALL_GUIDE.md, references/*, feature_catalog/*, manual_testing_playbook/*) and identified 28 unique findings after deduplication.

**Severity distribution:** 8 P0 (critical), 12 P1 (important), 8 P2 (minor). The findings span 4 sub-phase targets: 002 (bug fixes) with 11 findings, 003 (README marketing rewrite) with 10 findings, 004 (sk-doc 1:1 alignment) with 17 findings, and 005 (content additions and HVR) with 8 findings. Note that some findings map to multiple sub-phases due to cross-cutting impact.

**Top 3 highest-impact findings:**
1. ADR-001 path references point to non-existent directory structure (P0, impact-rank 10, sub-phase 002) — SKILL.md and ARCHITECTURE.md cite ADR paths that do not exist in the current repository, breaking primary contract documentation (iter 016, ref_file SKILL.md:50,169-171; ARCHITECTURE.md:296)
2. HVR punctuation violations across all doc surfaces (P0, impact-rank 10, sub-phase 002/005) — 90 em dash violations, 95 semicolon violations, 138+ Oxford comma violations cause systematic HVR failure across the entire documentation package (iter 015, ref_file SKILL.md:126; README.md:38; ARCHITECTURE.md:48,229; INSTALL_GUIDE.md:268)
3. Missing QUICK START section (P0, impact-rank 10, sub-phase 003) — README lacks critical onboarding section that peer system-code-graph has, blocking user immediate value delivery (iter 002, ref_file README.md:32-49)

**Recommended execution order for children 002-005:**
1. **Child 002 (bug fixes first):** Address P0 cross-link integrity failures (ADR-001 paths, hook reference links, tool-ids-reference contradiction) and HVR punctuation violations that block documentation usability
2. **Child 003 (README marketing rewrite):** Add missing QUICK START, USAGE EXAMPLES, TROUBLESHOOTING sections and rewrite OVERVIEW structure to match peer benchmark
3. **Child 004 (sk-doc 1:1 alignment):** Fix missing canonical smart-router pseudocode, resolve directory drift (compat, plugin_bridges), update build commands, and align feature_catalog/manual_testing_playbook with templates
4. **Child 005 (content additions and HVR):** Create missing freshness contract and lane weight tuning guides, complete HVR punctuation cleanup across all surfaces

This order prioritizes critical integrity failures (002) before structural improvements (003-004) and content additions (005), ensuring downstream work builds on a stable foundation.

## 2. Per-Track Findings

### 2.1 Sub-phase 002 (bug-fixes) — P0/P1 audit-confirmed bugs

**Finding 1: ADR-001 path references point to non-existent directory structure (P0, impact-rank 10, sub-phase-target: 002)**
- SKILL.md lines 50, 169-171 reference ADR path: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/006-system-skill-advisor-extraction/001-design-and-decision-record/decision-record.md` (iter 016, ref_file SKILL.md:50,169-171)
- ARCHITECTURE.md line 296 references same non-existent ADR path (iter 016, ref_file ARCHITECTURE.md:296)
- Actual 008-skill-advisor directory contains children: 001-skill-graph, 002-scorer, 003-router, 004-hardening, 005-docs (NO 006-system-skill-advisor-extraction) (iter 016, ref_file system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/)
- Referenced decision-record.md and research files do not exist at the specified path (iter 016, ref_file SKILL.md:50,169-171)
- These ADR references are cited as primary contract sources in SKILL.md, making this a critical documentation integrity issue (iter 016, ref_file SKILL.md:50,169-171)
- **Recommended fix:** Locate the actual ADR-001 location or update references to point to existing decision records; if ADR was archived/moved during packet reorganization, update all citations to current path

**Finding 2: HVR punctuation violations (em dash, semicolon, Oxford comma) across all doc surfaces (P0, impact-rank 10, sub-phase-target: 002)**
- 90 em dash violations found across system-skill-advisor markdown files (iter 015, ref_file system-skill-advisor/)
- Primary doc surfaces affected: SKILL.md (1 match at line 126), README.md (1 match at line 38), ARCHITECTURE.md (2 matches at lines 48, 229), INSTALL_GUIDE.md (1 match at line 268) (iter 015, ref_file SKILL.md:126; README.md:38; ARCHITECTURE.md:48,229; INSTALL_GUIDE.md:268)
- Secondary surfaces heavily affected: changelog/v0.2.0.md (17 matches), manual_testing_playbook/ (dozens of matches) (iter 015, ref_file changelog/v0.2.0.md:2,6,9,17,23,27,41,42,50,68,75,76,100,101,111,112,113)
- 95 semicolon violations found across system-skill-advisor markdown files (iter 015, ref_file system-skill-advisor/)
- Primary doc surfaces affected: README.md (2 matches at lines 129, 172), ARCHITECTURE.md (2 matches at lines 17, 269), INSTALL_GUIDE.md (1 match at line 176) (iter 015, ref_file README.md:129,172; ARCHITECTURE.md:17,269; INSTALL_GUIDE.md:176)
- 138+ Oxford comma violations with ", and" found across system-skill-advisor markdown files (iter 015, ref_file system-skill-advisor/)
- 38 Oxford comma violations with ", or" found across system-skill-advisor markdown files (iter 015, ref_file system-skill-advisor/)
- Primary doc surfaces heavily affected: ARCHITECTURE.md (16 matches), INSTALL_GUIDE.md (7 matches), SKILL.md (5 matches) (iter 015, ref_file ARCHITECTURE.md:3,17,40,62-64,67,71,74,221,224-227,247-248; INSTALL_GUIDE.md:3,10,37,97,98,100; SKILL.md:42,48-49,193,214)
- HVR rules ban em dashes as -5 point hard blocker each; 90 violations = -450 points, far below failing threshold (iter 015, ref_file hvr_rules.md:99,35)
- HVR rules ban semicolons as -5 point hard blocker each; 95 violations = -475 points, far below failing threshold (iter 015, ref_file hvr_rules.md:100,35)
- HVR rules ban Oxford commas as -5 point hard blocker each; 138+ violations = -690+ points, far below failing threshold (iter 015, ref_file hvr_rules.md:101,35)
- **Recommended fix:** Systematic find-replace across all markdown files: replace em dashes (—) with commas, colons, or sentence breaks; replace semicolons with two sentences or conjunctions; remove Oxford commas by restructuring lists

**Finding 3: tool-ids-reference.md contains internal contradiction on public vs internal tool count (P0, impact-rank 9, sub-phase-target: 002)**
- tool-ids-reference.md line 20 states: "The system-skill-advisor MCP server exposes nine public tools and one internal tool" (iter 018, ref_file tool-ids-reference.md:20)
- tool-ids-reference.md line 22 contradicts: "Public tools split into four advisor tools and five skill-graph tools" (4 + 5 = 9 total, not "nine public tools") (iter 018, ref_file tool-ids-reference.md:22)
- tool-ids-reference.md section 4 lines 57-64 correctly labels skill_graph_propagate_enhances as internal with access gate (iter 018, ref_file tool-ids-reference.md:57-64)
- The document cannot have both "nine public tools" and "one internal tool" when section 4 clearly identifies one tool as internal (iter 018, ref_file tool-ids-reference.md:20,57-64)
- This is the authoritative tool reference document, making this contradiction a critical documentation integrity issue (iter 018, ref_file tool-ids-reference.md:20)
- **Recommended fix:** Update line 20 to read "eight public tools and one internal trusted-caller tool (9 total)" to match section 4 and implementation reality

**Finding 4: Devin hooks.v1.json points to OLD system-spec-kit path (P0, impact-rank 9, sub-phase-target: 002)**
- .devin/hooks.v1.json line 8 references OLD path: `.opencode/skills/system-spec-kit/mcp_server/dist/system-spec-kit/mcp_server/hooks/devin/user-prompt-submit.js` (iter 017, ref_file .devin/hooks.v1.json:8)
- INSTALL_GUIDE.md line 143 documents NEW path as: `.opencode/skills/system-skill-advisor/hooks/devin/user-prompt-submit.ts` (iter 017, ref_file INSTALL_GUIDE.md:143)
- Runtime configuration does not match documented path, creating confusion about which hook location is authoritative (iter 017, ref_file .devin/hooks.v1.json:8; INSTALL_GUIDE.md:143)
- This mismatch suggests incomplete migration from system-spec-kit to system-skill-advisor for Devin hook registration (iter 017, ref_file .devin/hooks.v1.json:8)
- **Recommended fix:** Update .devin/hooks.v1.json line 8 to point to the NEW system-skill-advisor hook path to match INSTALL_GUIDE.md documentation

**Finding 5: Hook reference links point to non-existent path (P0, impact-rank 9, sub-phase-target: 002)**
- README.md line 203 references `../../references/hooks/skill-advisor-hook.md` which does not exist at that location (iter 016, ref_file README.md:203)
- INSTALL_GUIDE.md line 327 references same non-existent path `../../references/hooks/skill-advisor-hook.md` (iter 016, ref_file INSTALL_GUIDE.md:327)
- Actual file exists at `.opencode/skills/system-spec-kit/references/hooks/skill-advisor-hook.md` (iter 016, ref_file system-spec-kit/references/hooks/skill-advisor-hook.md)
- Correct relative path from system-skill-advisor/ should be: `../../skills/system-spec-kit/references/hooks/skill-advisor-hook.md` (iter 016, ref_file README.md:203)
- Both primary doc surfaces (README.md and INSTALL_GUIDE.md) have this broken link, affecting user navigation to hook contract documentation (iter 016, ref_file README.md:203; INSTALL_GUIDE.md:327)
- **Recommended fix:** Update README.md line 203 and INSTALL_GUIDE.md line 327 to use correct relative path: `../../skills/system-spec-kit/references/hooks/skill-advisor-hook.md`

**Finding 6: Dual hook locations create source-of-truth ambiguity (P1, impact-rank 8, sub-phase-target: 002)**
- Hooks exist in OLD location: `.opencode/skills/system-spec-kit/mcp_server/hooks/` with source TS and compiled JS for Claude, Codex, Gemini, Devin (iter 017, ref_file system-spec-kit/mcp_server/hooks/)
- Hooks exist in NEW location: `.opencode/skills/system-skill-advisor/hooks/` with source TS for Claude, Codex, Gemini, Devin (iter 017, ref_file system-skill-advisor/hooks/)
- NEW location also has compiled JS at: `.opencode/skills/system-skill-advisor/mcp_server/dist/system-skill-advisor/hooks/` (iter 017, ref_file system-skill-advisor/mcp_server/dist/system-skill-advisor/hooks/)
- No documentation explains which location is the source of truth or whether OLD location should be deprecated (iter 017, ref_file INSTALL_GUIDE.md)
- This dual-location state creates maintenance burden and risk of divergence between hook implementations (iter 017, ref_file system-spec-kit/mcp_server/hooks/; system-skill-advisor/hooks/)
- **Recommended fix:** Document which location is authoritative (likely NEW system-skill-advisor location), mark OLD location as deprecated with migration timeline, or remove OLD location if migration is complete

**Finding 7: Cross-link integrity gap spans multiple doc surfaces (P0, impact-rank 8, sub-phase-target: 002)**
- Hook reference link errors affect 2 primary doc surfaces (README.md, INSTALL_GUIDE.md) (iter 016, ref_file README.md:203; INSTALL_GUIDE.md:327)
- ADR path errors affect 2 primary doc surfaces (SKILL.md, ARCHITECTURE.md) (iter 016, ref_file SKILL.md:50,169-171; ARCHITECTURE.md:296)
- Audit packet path errors affect 9 secondary doc surfaces (hook READMEs and test documentation) (iter 016, ref_file hooks/claude/README.md:32)
- Represents systematic cross-link integrity failure across entire package documentation hierarchy (iter 016, ref_file system-skill-advisor/)
- **Recommended fix:** Coordinate fix across all affected surfaces; prioritize primary doc surfaces (SKILL.md, ARCHITECTURE.md, README.md, INSTALL_GUIDE.md) then update secondary surfaces

**Finding 8: Audit packet path references in hook READMEs point to non-existent directory (P1, impact-rank 7, sub-phase-target: 002)**
- 9 hook README files reference audit packet: `026-sk-code-and-code-readme-audit` under non-existent 006-system-skill-advisor-extraction (iter 016, ref_file hooks/claude/README.md:32)
- Affected files: hooks/claude/README.md, hooks/gemini/README.md, hooks/codex/README.md, hooks/codex/lib/README.md, mcp_server/stress_test/search-quality/README.md, mcp_server/scripts/routing-accuracy/README.md, mcp_server/lib/scorer/lanes/README.md, mcp_server/lib/scorer/lanes/__tests__/README.md, mcp_server/lib/context/README.md (iter 016, ref_file hooks/claude/README.md:32)
- All references point to the same non-existent path structure (iter 016, ref_file hooks/claude/README.md:32)
- These audit packet references are less critical than ADR-001 but still represent broken cross-references (iter 016, ref_file hooks/claude/README.md:32)
- **Recommended fix:** Locate the actual audit packet location or remove these references if the audit packet was archived; update all 9 affected README files with correct path or remove stale citations

**Finding 9: No TODO/FIXME/XXX/HACK markers found in code (P2, impact-rank 2, sub-phase-target: 002)**
- Targeted greps for Python and TypeScript/JS comment patterns found 0 actual TODO/FIXME/HACK markers across entire system-skill-advisor directory (iter 019, ref_file system-skill-advisor/)
- Initial 2 matches were false positives in example output format strings (``--- Result N (score: X.XXX) ---``) in skill_advisor.py lines 2162-2173 (iter 019, ref_file skill_advisor.py:2162-2179)
- Codebase appears clean of technical debt markers, indicating good maintenance practices (iter 019, ref_file system-skill-advisor/)
- **Recommended fix:** No action needed; this is a positive finding indicating code hygiene

**Finding 10: Graph-metadata.json references are valid (P2, impact-rank 3, sub-phase-target: 002)**
- Graph-metadata.json contains 17 enhances edges with valid target skill IDs (iter 019, ref_file graph-metadata.json:14-106)
- All derived key_files paths reference existing files within advisor package structure (iter 019, ref_file graph-metadata.json:150-159)
- No broken references or dangling paths detected in graph-metadata.json (iter 019, ref_file graph-metadata.json)
- **Recommended fix:** No action needed; this is a positive finding

**Finding 11: No tools are registered but undocumented or documented but unregistered (P2, impact-rank 4, sub-phase-target: 002)**
- Implementation registers exactly 9 tools: advisor_recommend, advisor_rebuild, advisor_status, advisor_validate, skill_graph_scan, skill_graph_query, skill_graph_status, skill_graph_validate, skill_graph_propagate_enhances (iter 018, ref_file tools/index.ts:37-43; skill-graph-tools.ts:85-91)
- All 9 tools appear in SKILL.md, README.md, ARCHITECTURE.md, and opencode.json (iter 018, ref_file SKILL.md:113-126; README.md:164-172; ARCHITECTURE.md:217-227; opencode.json:45)
- tool-ids-reference.md lists all 9 tools but has count contradiction in overview text (addressed in Finding 3) (iter 018, ref_file tool-ids-reference.md:20,31-50)
- **Recommended fix:** No action needed beyond fixing tool-ids-reference.md contradiction in Finding 3

### 2.2 Sub-phase 003 (readme-marketing-rewrite) — README voice + structure gaps

**Finding 12: Missing QUICK START section (P0, impact-rank 10, sub-phase-target: 003)**
- System-skill-advisor README jumps from OVERVIEW to ARCHITECTURE with no QUICK START (iter 002, ref_file README.md:32-49)
- System-code-graph has QUICK START with numbered steps and expected results (iter 002, ref_file system-code-graph/README.md:85-113)
- QUICK START is critical for user onboarding and immediate value delivery (iter 002, ref_file system-code-graph/README.md:85-113)
- Missing section removes critical user guidance present in peer benchmark (iter 002, ref_file README.md:32-49)
- **Recommended fix:** Add QUICK START section after OVERVIEW with numbered steps for first-time users, following system-code-graph pattern

**Finding 13: OVERVIEW structure mismatch (P1, impact-rank 9, sub-phase-target: 003)**
- System-skill-advisor OVERVIEW uses bulleted "Current state" list instead of narrative "Purpose" subsection (iter 002, ref_file README.md:32-44)
- System-code-graph OVERVIEW has "Purpose" subsection with clear narrative explaining what the skill does (iter 002, ref_file system-code-graph/README.md:38-42)
- Bulleted state list is less approachable than narrative purpose description (iter 002, ref_file hvr_rules.md:68-71)
- HVR voice directives require narrative approachability over bulleted state lists (iter 002, ref_file hvr_rules.md:68-71)
- **Recommended fix:** Rewrite OVERVIEW to use narrative "Purpose" subsection following system-code-graph pattern, convert bulleted state list to prose

**Finding 14: Missing H1 tagline (P1, impact-rank 8, sub-phase-target: 003)**
- System-skill-advisor README lacks compelling H1 tagline that system-code-graph has (iter 002, ref_file README.md:11-11)
- System-code-graph tagline: "Structural code indexing, SQLite-backed graph storage and MCP-facing code intelligence for impact analysis, neighborhood retrieval, readiness checks and change detection" (iter 002, ref_file system-code-graph/README.md:12-14)
- Missing tagline removes immediate value proposition and marketing hook (iter 002, ref_file hvr_rules.md:73-76)
- HVR voice directives require compelling opening statement for user engagement (iter 002, ref_file hvr_rules.md:73-76)
- **Recommended fix:** Add H1 tagline under title following system-code-graph pattern, summarizing advisor's core value proposition

**Finding 15: Missing USAGE EXAMPLES section (P1, impact-rank 8, sub-phase-target: 003)**
- System-skill-advisor has no USAGE EXAMPLES section with concrete request → tool path patterns (iter 002, ref_file README.md:160-173)
- System-code-graph has USAGE EXAMPLES with "User request → Tool path → Arguments → Expected output" pattern (iter 002, ref_file system-code-graph/README.md:206-233)
- Concrete examples show users exactly how to use the tools in practice (iter 002, ref_file system-code-graph/README.md:206-233)
- Missing examples reduce user ability to quickly understand tool usage patterns (iter 002, ref_file README.md:160-173)
- **Recommended fix:** Add USAGE EXAMPLES section with concrete request → tool path → arguments → expected output patterns for common advisor use cases

**Finding 16: Missing TROUBLESHOOTING section (P1, impact-rank 7, sub-phase-target: 003)**
- System-skill-advisor has no TROUBLESHOOTING section (iter 002, ref_file README.md:180-194)
- System-code-graph has TROUBLESHOOTING with "What You See | Cause | Fix" table (iter 002, ref_file system-code-graph/README.md:239-248)
- Troubleshooting section reduces support burden and helps users self-resolve issues (iter 002, ref_file system-code-graph/README.md:239-248)
- Missing troubleshooting guidance increases support load and user frustration (iter 002, ref_file README.md:180-194)
- **Recommended fix:** Add TROUBLESHOOTING section with "What You See | Cause | Fix" table following system-code-graph pattern

**Finding 17: Passive voice usage (P1, impact-rank 6, sub-phase-target: 003)**
- Line 34 uses passive voice: "It contains the standalone mk_skill_advisor MCP server" (iter 002, ref_file README.md:34)
- HVR voice directives require active voice: "Use active voice. Subject before verb." (iter 002, ref_file hvr_rules.md:42-46)
- README lacks direct address (you/your) throughout - uses third-person descriptions (iter 002, ref_file README.md:32-44)
- HVR voice directives require direct address for user engagement (iter 002, ref_file hvr_rules.md:39-91)
- **Recommended fix:** Rewrite passive voice constructions to active voice, add direct address (you/your) throughout README for conversational tone

**Finding 18: Missing Key Statistics table (P2, impact-rank 6, sub-phase-target: 003)**
- System-skill-advisor lacks "Key Statistics" table with concrete metrics (iter 002, ref_file README.md:32-44)
- System-code-graph has Key Statistics table with version, runtime package, MCP server name, tool count, storage path (iter 002, ref_file system-code-graph/README.md:44-55)
- Concrete metrics build trust and provide quick reference information (iter 002, ref_file system-code-graph/README.md:44-55)
- Missing statistics reduce ability to quickly assess package state (iter 002, ref_file README.md:32-44)
- **Recommended fix:** Add Key Statistics table in OVERVIEW section with version, tool count, database path, MCP server name following system-code-graph pattern

**Finding 19: Missing How This Compares table (P2, impact-rank 7, sub-phase-target: 003)**
- System-skill-advisor lacks "How This Compares" table differentiating from alternatives (iter 002, ref_file README.md:32-44)
- System-code-graph has "How This Compares" table showing when to use this skill vs other surfaces (iter 002, ref_file system-code-graph/README.md:57-65)
- Comparison table helps users understand positioning and when to use the skill (iter 002, ref_file system-code-graph/README.md:57-65)
- Missing comparison reduces user ability to choose between similar surfaces (iter 002, ref_file README.md:32-44)
- **Recommended fix:** Add "How This Compares" table differentiating advisor from other routing/discovery mechanisms

**Finding 20: Missing Key Features table (P2, impact-rank 6, sub-phase-target: 003)**
- System-skill-advisor lacks "Key Features" table explaining component capabilities (iter 002, ref_file README.md:32-44)
- System-code-graph has "Key Features" table with "Feature | What It Does" structure (iter 002, ref_file system-code-graph/README.md:67-78)
- Features table provides quick scan of capabilities without reading full documentation (iter 002, ref_file system-code-graph/README.md:67-78)
- Missing features table reduces ability to quickly understand component breakdown (iter 002, ref_file README.md:32-44)
- **Recommended fix:** Add Key Features table with "Feature | What It Does" structure following system-code-graph pattern

**Finding 21: Missing FAQ section (P2, impact-rank 5, sub-phase-target: 003)**
- System-skill-advisor has no FAQ section (iter 002, ref_file README.md:196-204)
- System-code-graph has FAQ section addressing common questions (iter 002, ref_file system-code-graph/README.md:254-272)
- FAQ reduces repeated questions and provides quick answers to common concerns (iter 002, ref_file system-code-graph/README.md:254-272)
- Missing FAQ increases support burden for common questions (iter 002, ref_file README.md:196-204)
- **Recommended fix:** Add FAQ section addressing common advisor questions (tool selection, scoring, hooks, troubleshooting)

### 2.3 Sub-phase 004 (sk-doc-1to1-alignment) — per-file template adherence

**Finding 22: Missing canonical smart-router pseudocode (P0, impact-rank 10, sub-phase-target: 004)**
- System-skill-advisor SMART ROUTING section lacks required Python pseudocode block with 4 canonical patterns (Runtime Discovery, Existence-Check Before Load, Extensible Routing Key, Multi-Tier Graceful Fallback) (iter 001, ref_file SKILL.md:58-104)
- Current section uses text-based flow diagram instead of canonical pseudocode pattern (iter 001, ref_file SKILL.md:63-77)
- Missing required functions: discover_markdown_resources(), load_if_available(), get_routing_key() (iter 001, ref_file skill_smart_router.md:39-90)
- Missing required data structures: INTENT_MODEL, RESOURCE_MAP, LOADING_LEVELS, UNKNOWN_FALLBACK_CHECKLIST (iter 001, ref_file skill_smart_router.md:238-263)
- Template explicitly requires "one authoritative Smart Router Pseudocode block" in SMART ROUTING section (iter 001, ref_file skill_md_template.md:175-176)
- **Recommended fix:** Add canonical smart-router pseudocode block to SKILL.md SMART ROUTING section following skill_smart_router.md template

**Finding 23: Missing compat directory (P0, impact-rank 10, sub-phase-target: 004)**
- INSTALL_GUIDE.md documents compat path: `.opencode/skills/system-skill-advisor/mcp_server/compat/index.ts` (iter 004, ref_file INSTALL_GUIDE.md:140)
- INSTALL_GUIDE.md documents built compat path: `.opencode/skills/system-skill-advisor/mcp_server/dist/system-skill-advisor/mcp_server/compat/index.js` (iter 004, ref_file INSTALL_GUIDE.md:146)
- compat directory NOT found in mcp_server via find_file_by_name (iter 004, ref_file system-skill-advisor/mcp_server)
- dist directory NOT found in mcp_server via find_file_by_name (iter 004, ref_file system-skill-advisor/mcp_server)
- Documentation references OpenCode bridge entrypoint that doesn't exist, breaking the documented integration path (iter 004, ref_file INSTALL_GUIDE.md:137-147)
- **Recommended fix:** Either create compat directory with OpenCode bridge implementation or remove INSTALL_GUIDE references if bridge architecture was deprecated

**Finding 24: Missing plugin_bridges directory (P0, impact-rank 9, sub-phase-target: 004)**
- INSTALL_GUIDE.md documents plugin bridge path: `.opencode/skills/system-skill-advisor/mcp_server/plugin_bridges/mk-skill-advisor-bridge.mjs` (iter 004, ref_file INSTALL_GUIDE.md:182)
- plugin_bridges directory NOT found in mcp_server via find_file_by_name (iter 004, ref_file system-skill-advisor/mcp_server)
- OpenCode plugin exists at `.opencode/plugins/mk-skill-advisor.js` but documented bridge path doesn't exist (iter 004, ref_file .opencode/plugins/mk-skill-advisor.js)
- Documentation describes cross-process gateway architecture that doesn't exist in current codebase (iter 004, ref_file INSTALL_GUIDE.md:135,179-183)
- **Recommended fix:** Either create plugin_bridges directory with bridge implementation or update INSTALL_GUIDE to document actual plugin integration mechanism

**Finding 25: Build command references wrong package (P0, impact-rank 9, sub-phase-target: 004)**
- ARCHITECTURE.md line 262 references `npm --prefix .opencode/skills/system-spec-kit/mcp_server run build` instead of system-skill-advisor's own build command (iter 003, ref_file ARCHITECTURE.md:262)
- INSTALL_GUIDE.md npm commands use `--prefix .opencode/skills/system-skill-advisor/mcp_server` which references local package.json (iter 004, ref_file INSTALL_GUIDE.md:60-61,104-106)
- Local package.json build scripts reference system-spec-kit tooling: `../../system-spec-kit/node_modules/.bin/tsc` and `../../system-spec-kit/mcp_server/node_modules/.bin/vitest` (iter 004, ref_file package.json:7-9)
- This contradicts ARCHITECTURE.md's own description of system-skill-advisor as "standalone Gate 2 routing subsystem" (iter 003, ref_file ARCHITECTURE.md:40-42)
- Standalone package documentation should reference its own build commands, not cross-package dependencies (iter 003, ref_file ARCHITECTURE.md:262)
- **Recommended fix:** Update ARCHITECTURE.md line 262 to reference system-skill-advisor's own build command; determine if package.json cross-package dependencies should be resolved or documented as intentional

**Finding 26: Skill-graph library location already migrated (P0, impact-rank 8, sub-phase-target: 004)**
- ARCHITECTURE.md line 17 states "The `lib/skill-graph/` database/query library remains in `system-spec-kit` until packet 011 moves it" (iter 003, ref_file ARCHITECTURE.md:17)
- ARCHITECTURE.md line 278 lists "Packet 011: move or settle the `lib/skill-graph/` library location" as future work (iter 003, ref_file ARCHITECTURE.md:278)
- Source code advisor-server.ts imports skill-graph functions from local path: `from './lib/skill-graph/skill-graph-db.js'` (iter 003, ref_file advisor-server.ts:18-23)
- Source code skill-graph-db.ts exists at system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts with package-local database comment (iter 003, ref_file skill-graph-db.ts:1-5)
- No skill-graph-db.ts found in system-spec-kit/mcp_server/lib, indicating migration already complete (iter 003, ref_file system-spec-kit/mcp_server/lib)
- Documentation describes current state as pre-migration when source code shows migration already complete (iter 003, ref_file ARCHITECTURE.md:17)
- **Recommended fix:** Update ARCHITECTURE.md lines 17 and 278 to reflect that skill-graph library migration is complete; remove packet 011 future work entry

**Finding 27: Shadow weight field omitted from documentation (P1, impact-rank 7, sub-phase-target: 004)**
- Source code lane-registry.ts defines shadowWeight field for all 5 lanes with values: explicit_author 0.40, lexical 0.25, graph_causal 0.20, derived_generated 0.10, semantic_shadow 0.05 (iter 005, ref_file lane-registry.ts:8-12)
- Documentation lane weight table only shows single "Weight" column without mentioning shadowWeight field or separate shadow weight values (iter 005, ref_file advisor-scorer.md:34-40)
- Source code exports DEFAULT_SHADOW_SCORER_LANE_WEIGHTS as separate constant object, indicating shadow weights are first-class configuration (iter 005, ref_file lane-registry.ts:32-38)
- Documentation mentions "shadowOnly=true" for semantic_shadow lane but doesn't explain the shadowWeight mechanics or how shadow vs live weights are used (iter 005, ref_file advisor-scorer.md:62)
- **Recommended fix:** Add shadowWeight column to advisor-scorer.md lane weight table and document shadow vs live weight mechanics

**Finding 28: Confidence calibration constants coverage incomplete (P1, impact-rank 6, sub-phase-target: 004)**
- Source code scoring-constants.ts defines 16 confidence calibration constants in ConfidenceCalibration interface (iter 005, ref_file scoring-constants.ts:17-64)
- Documentation only mentions 2 constants: baseConstant=0.52 and liveNormalizedRampCoefficient=0.43 (iter 005, ref_file advisor-scorer.md:106)
- Missing documented constants include: readOnlyExplainerFloor (0.25), liveNormalizedRampGain (1.25), readOnlyRouteAllowedFloor (0.82), derivedDominantConfidence (0.72), taskIntentFloor (0.82), directScoreFloor (0.82), hardCeiling (0.95), and 8 others (iter 005, ref_file scoring-constants.ts:141-158)
- Documentation describes derived-dominant short-circuit and task-intent floor but doesn't document the constant values that control these behaviors (iter 005, ref_file advisor-scorer.md:106-109)
- **Recommended fix:** Add confidence calibration constants table to advisor-scorer.md documenting all 16 constants with values and behavioral impact

**Finding 29: propagate-enhances.md lacks bidirectional cross-link (P1, impact-rank 6, sub-phase-target: 004)**
- tool-ids-reference.md line 62 links to propagate-enhances.md for internal tool details (iter 007, ref_file tool-ids-reference.md:62)
- propagate-enhances.md has NO markdown link back to tool-ids-reference.md despite referencing "ninth skill-graph tool" and "eight other skill-graph tools" (iter 007, ref_file propagate-enhances.md:19,64)
- Missing backlink breaks navigation symmetry - users reading propagate-enhances.md cannot easily find the canonical tool list (iter 007, ref_file propagate-enhances.md:19,64)
- **Recommended fix:** Add bidirectional cross-link from propagate-enhances.md to tool-ids-reference.md for navigation symmetry

**Finding 30: skill-graph-extraction-plan.md lacks actionable cross-links (P1, impact-rank 7, sub-phase-target: 004)**
- skill-graph-extraction-plan.md line 49 references SKILL.md:189 but does not provide a clickable markdown link (iter 007, ref_file skill-graph-extraction-plan.md:49)
- skill-graph-extraction-plan.md line 73 references "edit A-020 in the 058 verified delta" but does not link to the delta file location (iter 007, ref_file skill-graph-extraction-plan.md:73)
- skill-graph-extraction-plan.md line 74 references "operator or maintainer docs" but does not specify which documents or provide links (iter 007, ref_file skill-graph-extraction-plan.md:74)
- Missing links make it difficult for operators to verify the drift correction or find the referenced delta (iter 007, ref_file skill-graph-extraction-plan.md:49,73-74)
- **Recommended fix:** Add clickable markdown links to referenced files (SKILL.md:189, delta file, operator/maintainer docs) for actionable navigation

**Finding 31: legacy-tool-bridge.md lacks markdown links to referenced files (P1, impact-rank 5, sub-phase-target: 004)**
- legacy-tool-bridge.md line 34 references `references/standalone-mcp-shape.md` as plain text, not a markdown link (iter 007, ref_file legacy-tool-bridge.md:34)
- legacy-tool-bridge.md line 35 references `references/tool-ids-reference.md` as plain text, not a markdown link (iter 007, ref_file legacy-tool-bridge.md:35)
- legacy-tool-bridge.md line 33 references ADR-001 as plain text, not a markdown link (iter 007, ref_file legacy-tool-bridge.md:33)
- Plain text references instead of clickable links reduce navigability for users reading the documentation (iter 007, ref_file legacy-tool-bridge.md:33-35)
- **Recommended fix:** Convert plain text references to markdown links for improved navigation

**Finding 32: INSTALL_GUIDE.md omits skill_graph_propagate_enhances from tool documentation (P1, impact-rank 7, sub-phase-target: 004)**
- INSTALL_GUIDE.md line 10 lists 8 public tools but excludes skill_graph_propagate_enhances (iter 018, ref_file INSTALL_GUIDE.md:10)
- INSTALL_GUIDE.md line 37 repeats the same incomplete 8-tool list (iter 018, ref_file INSTALL_GUIDE.md:37)
- INSTALL_GUIDE.md contains 0 matches for skill_graph_propagate_enhances across entire document (iter 018, ref_file INSTALL_GUIDE.md)
- Implementation registers all 9 tools including skill_graph_propagate_enhances (iter 018, ref_file skill-graph-tools.ts:66-83)
- INSTALL_GUIDE.md is an operator-facing document that should document all available tools, even internal ones with access gates noted (iter 018, ref_file INSTALL_GUIDE.md:1-330)
- **Recommended fix:** Add skill_graph_propagate_enhances to INSTALL_GUIDE.md tool list with note about internal trusted-caller access gate

**Finding 33: Three scenario files missing SOURCE FILES section (P1, impact-rank 7, sub-phase-target: 004)**
- Files 007-skill-graph-status.md, 008-skill-graph-query.md, 009-skill-graph-validate.md in 01--native-mcp-tools/ have only 4 sections instead of required 5 (iter 012, ref_file 007-skill-graph-status.md:10-62)
- These files are missing section 4 (SOURCE FILES) which sk-doc template requires (iter 012, ref_file manual_testing_playbook_snippet_template.md:109-124)
- Other 6 files in 01--native-mcp-tools/ have complete 5-section structure including SOURCE FILES (iter 012, ref_file 001-native-recommend-happy-path.md:89-99)
- Missing SOURCE FILES section removes implementation and test anchors that help operators locate source code (iter 012, ref_file manual_testing_playbook_snippet_template.md:109-124)
- **Recommended fix:** Add SOURCE FILES section to the 3 incomplete scenario files (007, 008, 009) with implementation and test anchors

**Finding 34: TEST EXECUTION structure deviates from template (P1, impact-rank 6, sub-phase-target: 004)**
- sk-doc template specifies TEST EXECUTION subsections: ### Prompt, ### Commands, ### Expected, ### Evidence, ### Pass / Fail, ### Failure Triage (iter 013, ref_file manual_testing_playbook_snippet_template.md:75-102)
- All 20 files in categories 05-08 use different structure: numbered command steps, ### Expected Signals list, ### Failure Modes table (iter 013, ref_file 001-watcher-narrow-scope.md:39-83)
- Template expects explicit ### Evidence and ### Pass / Fail subsections which are absent from actual files (iter 013, ref_file manual_testing_playbook_snippet_template.md:90-98)
- Actual files integrate evidence expectations into Expected Signals and use Failure Modes table instead of Failure Triage list (iter 013, ref_file 001-watcher-narrow-scope.md:68-83)
- Iteration-012 found the same structural deviation for categories 01-04, indicating this is a consistent system-skill-advisor pattern across all manual_testing_playbook categories (iter 013, ref_file iteration-012.md:87-93)
- **Recommended fix:** Either adopt canonical template structure across all scenario files or document intentional deviation with rationale

**Finding 35: Root catalog TOC numbering creates mismatch with directory structure (P1, impact-rank 6, sub-phase-target: 004)**
- Root feature_catalog.md table-of-contents uses sequential section numbering: 1. OVERVIEW, 2. DAEMON AND FRESHNESS, 3. AUTO-INDEXING, 4. LIFECYCLE ROUTING, 5. SCORER FUSION, 6. MCP SURFACE, 7. HOOKS AND PLUGIN, 8. PYTHON COMPAT (iter 010, ref_file feature_catalog.md:20-29)
- Directory structure uses non-sequential numbering: 01, 02, 03, 04, 06, 07, 08 (iter 010, ref_file feature_catalog/)
- Section 5 (SCORER FUSION) maps to directory 04--scorer-fusion, creating a mapping discrepancy (iter 010, ref_file feature_catalog.md:26-27,115-126)
- Section 6 (MCP SURFACE) maps to directory 06--mcp-surface, creating a mapping discrepancy (iter 010, ref_file feature_catalog.md:28-29,131-145)
- This mismatch creates confusion for readers navigating between TOC section numbers and directory numbers (iter 010, ref_file feature_catalog.md:20-29)
- **Recommended fix:** Either add section 5 placeholder in TOC or renumber directories to eliminate gap; align TOC numbering with directory structure

**Finding 36: Non-sequential file numbering in 07--hooks-and-plugin (P1, impact-rank 6, sub-phase-target: 004)**
- 07--hooks-and-plugin/ directory contains files numbered 01, 03, 04, 05 - file 02 is missing from the sequence (iter 011, ref_file 07--hooks-and-plugin/)
- sk-doc feature_catalog_template.md canonical layout shows sequential file numbering (01-feature-name.md, 02-feature-name.md) as the expected pattern (iter 011, ref_file feature_catalog_template.md:29-37)
- The non-sequential numbering creates a gap that could confuse readers expecting sequential file numbers within a category directory (iter 011, ref_file 07--hooks-and-plugin/)
- Root catalog section 7 lists exactly 4 features matching the 4 files that exist, so the gap is not visible at the root catalog level (iter 011, ref_file feature_catalog.md:150-159)
- **Recommended fix:** Renumber files to sequential 01-04 or document rationale for skipped number 02

**Finding 37: Asymmetric coverage between manual_testing_playbook and feature_catalog (P1, impact-rank 7, sub-phase-target: 004)**
- Manual_testing_playbook has 9 categories, feature_catalog has 7 groups - not a 1:1 mapping (iter 014, ref_file manual_testing_playbook/)
- Manual_testing_playbook categories 03--compat-and-disable and 04--operator-h5 have NO corresponding feature_catalog groups (iter 014, ref_file manual_testing_playbook.md:242-268)
- Feature_catalog group 01--daemon-and-freshness has NO dedicated manual_testing_playbook category (daemon scenarios are split across 05--auto-update-daemon and 04--operator-h5) (iter 014, ref_file feature_catalog.md:67-79)
- Feature_catalog group 06--mcp-surface has NO dedicated manual_testing_playbook category (MCP surface scenarios are split across 01--native-mcp-tools and 02--cli-hooks-and-plugin) (iter 014, ref_file feature_catalog.md:131-145)
- These asymmetric mappings make it difficult for readers to navigate between the two documentation surfaces (iter 014, ref_file manual_testing_playbook.md:376-392)
- **Recommended fix:** Either align category/group naming and numbering for 1:1 mapping or document intentional asymmetry with cross-reference tables

**Finding 38: Devin hook environment variable inconsistency (P1, impact-rank 6, sub-phase-target: 004)**
- INSTALL_GUIDE.md documents rollback control as `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1` for all runtimes (iter 004, ref_file INSTALL_GUIDE.md:202-209)
- Devin hook source code checks `MK_SKILL_ADVISOR_HOOK_DISABLED` first, then falls back to `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED` (iter 004, ref_file hooks/devin/user-prompt-submit.ts:91-94)
- Other hooks (claude, codex, gemini) only check `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED` (iter 004, ref_file hooks/claude/user-prompt-submit.ts:125)
- Documentation doesn't mention the Devin-specific `MK_SKILL_ADVISOR_HOOK_DISABLED` variable (iter 004, ref_file INSTALL_GUIDE.md:202-223)
- Operators using documented variable may not disable Devin hook as expected (iter 004, ref_file hooks/devin/user-prompt-submit.ts:91-94)
- **Recommended fix:** Update INSTALL_GUIDE.md to document both environment variables or standardize Devin hook to use only SPECKIT_SKILL_ADVISOR_HOOK_DISABLED

### 2.4 Sub-phase 005 (content-additions-and-hvr) — content gaps + HVR sweep

**Finding 39: No lane weight tuning guide exists (P0, impact-rank 9, sub-phase-target: 005)**
- Grep for 'lane.weight.tuning' pattern found 0 matches across entire system-skill-advisor directory (iter 019, ref_file system-skill-advisor/)
- Feature catalog weights-config.md documents current canonical weights (explicit_author: 0.42, lexical: 0.28, graph_causal: 0.13, derived_generated: 0.12, semantic_shadow: 0.05) but provides no tuning process (iter 019, ref_file weights-config.md:18-26)
- ARCHITECTURE.md states "Changing lane weights requires measured evidence and docs updates" but provides no guidance on how to gather evidence or what process to follow (iter 019, ref_file ARCHITECTURE.md:247,280)
- Manual testing playbook includes ablation scenario for measuring lane contributions but no systematic tuning workflow or decision framework (iter 019, ref_file 005-ablation.md:3,20,47)
- Lane weight sweep test harness exists (tests/scorer/lane-weight-sweep.vitest.ts) but no operator-facing guide explains how to interpret results or decide on weight changes (iter 019, ref_file lane-weight-sweep.vitest.ts:469,588,626)
- **Recommended fix:** Create lane weight tuning guide in references/ or feature_catalog/ documenting measurement methodology, decision framework, approval process, and rollback criteria

**Finding 40: No formal freshness contract documentation exists (P0, impact-rank 8, sub-phase-target: 005)**
- Grep for 'freshness.contract' pattern found 0 matches across entire system-skill-advisor directory (iter 019, ref_file system-skill-advisor/)
- Freshness is mentioned in 100+ locations across docs but no single document formalizes the freshness contract (iter 019, ref_file system-skill-advisor/)
- Feature catalog documents individual freshness features (trust-state, generation, rebuild-from-source, cache-invalidation) but not the overall freshness contract (iter 019, ref_file feature_catalog.md:67-78)
- ARCHITECTURE.md mentions freshness in data flow, database, and MCP surface sections but lacks a dedicated freshness contract section (iter 019, ref_file ARCHITECTURE.md:138,161,201-209,221)
- Trust-state feature documents the 4-state vocabulary (live/stale/absent/unavailable) but not a formal freshness contract (iter 019, ref_file 05-trust-state.md:25-34)
- **Recommended fix:** Create formal freshness contract document in references/ defining state transition rules, consumer obligations, daemon responsibilities, and failure modes

**Finding 41: All 6 doc surfaces fail HVR compliance due to em dash violations (P0, impact-rank 10, sub-phase-target: 005)**
- All 6 documentation surfaces (SKILL.md, README.md, ARCHITECTURE.md, INSTALL_GUIDE.md, feature_catalog, manual_testing_playbook) fail HVR compliance due to em dash violations (iter 015, ref_file system-skill-advisor/)
- 90 em dash violations found across system-skill-advisor markdown files (iter 015, ref_file system-skill-advisor/)
- Systematic HVR failure across entire documentation package (iter 015, ref_file system-skill-advisor/)
- **Recommended fix:** Addressed in Finding 2 (sub-phase 002) - systematic em dash replacement across all surfaces

**Finding 42: All 6 doc surfaces fail HVR compliance due to semicolon violations (P0, impact-rank 10, sub-phase-target: 005)**
- All 6 documentation surfaces fail HVR compliance due to semicolon violations (iter 015, ref_file system-skill-advisor/)
- 95 semicolon violations found across system-skill-advisor markdown files (iter 015, ref_file system-skill-advisor/)
- Systematic HVR failure across entire documentation package (iter 015, ref_file system-skill-advisor/)
- **Recommended fix:** Addressed in Finding 2 (sub-phase 002) - systematic semicolon replacement across all surfaces

**Finding 43: All 6 doc surfaces fail HVR compliance due to Oxford comma violations (P0, impact-rank 10, sub-phase-target: 005)**
- All 6 documentation surfaces fail HVR compliance due to Oxford comma violations (iter 015, ref_file system-skill-advisor/)
- 138+ Oxford comma violations (", and" + ", or") found across system-skill-advisor markdown files (iter 015, ref_file system-skill-advisor/)
- Systematic HVR failure across entire documentation package (iter 015, ref_file system-skill-advisor/)
- **Recommended fix:** Addressed in Finding 2 (sub-phase 002) - systematic Oxford comma removal across all surfaces

**Finding 44: Missing regression fixtures directory (P1, impact-rank 7, sub-phase-target: 005)**
- INSTALL_GUIDE documents regression command with fixtures path: `--dataset .opencode/skills/system-skill-advisor/mcp_server/scripts/fixtures/skill_advisor_regression_cases.jsonl` (iter 004, ref_file INSTALL_GUIDE.md:291-292)
- fixtures directory NOT found in scripts via find_file_by_name (iter 004, ref_file system-skill-advisor/mcp_server/scripts)
- skill_advisor_regression.py script exists but documented dataset path doesn't (iter 004, ref_file skill_advisor_regression.py)
- Documented regression command will fail due to missing fixtures directory (iter 004, ref_file INSTALL_GUIDE.md:290-293)
- **Recommended fix:** Either create fixtures directory with regression test cases or update INSTALL_GUIDE to remove broken regression command reference

## 3. Cross-Track Patterns

**Pattern 1: ADR-001 path bug spans SKILL.md + ARCHITECTURE.md + 9 nested READMEs (002+004)**
- ADR-001 path references appear in SKILL.md (lines 50, 169-171) and ARCHITECTURE.md (line 296) as primary contract sources (iter 016, ref_file SKILL.md:50,169-171; ARCHITECTURE.md:296)
- Audit packet path references to non-existent 006-system-skill-advisor-extraction appear in 9 hook README files (claude, gemini, codex, plus nested lib/README files and test documentation) (iter 016, ref_file hooks/claude/README.md:32)
- This represents a systematic cross-link integrity failure where a single directory structure change broke references across multiple doc surfaces (iter 016, ref_file system-skill-advisor/)
- **Impact:** Requires coordinated fix across primary docs (SKILL.md, ARCHITECTURE.md) and secondary surfaces (9 hook READMEs) to restore cross-link integrity

**Pattern 2: Build command drift spans ARCHITECTURE.md + INSTALL_GUIDE.md + package.json (002+004)**
- ARCHITECTURE.md line 262 references system-spec-kit build command instead of system-skill-advisor (iter 003, ref_file ARCHITECTURE.md:262)
- INSTALL_GUIDE.md references system-skill-advisor package.json which itself references system-spec-kit tooling (iter 004, ref_file INSTALL_GUIDE.md:60-61; package.json:7-9)
- This cross-package dependency contradicts standalone package description in both documents (iter 003, ref_file ARCHITECTURE.md:40-42)
- **Impact:** Requires decision on whether to resolve cross-package dependency or document it as intentional; affects build/run instructions for operators

**Pattern 3: Missing freshness contract spans ARCHITECTURE.md + INSTALL_GUIDE.md + feature_catalog/ (004+005)**
- Freshness is mentioned across ARCHITECTURE.md (lines 138, 161, 201-209, 221), feature_catalog (group 01 with 7 features), and implied in INSTALL_GUIDE.md daemon sections (iter 019, ref_file ARCHITECTURE.md:138,161,201-209,221; feature_catalog.md:67-78)
- No single document formalizes the freshness contract despite 100+ mentions across docs (iter 019, ref_file system-skill-advisor/)
- Trust-state feature documents 4-state vocabulary but not overall contract (iter 019, ref_file 05-trust-state.md:25-34)
- **Impact:** Creates operational ambiguity about freshness semantics, state transitions, and consumer obligations across multiple surfaces

**Pattern 4: HVR violations span all 6 doc surfaces (002+005)**
- Em dash, semicolon, and Oxford comma violations found across SKILL.md, README.md, ARCHITECTURE.md, INSTALL_GUIDE.md, feature_catalog/, manual_testing_playbook/ (iter 015, ref_file system-skill-advisor/)
- 90 em dash violations, 95 semicolon violations, 138+ Oxford comma violations create systematic HVR failure (iter 015, ref_file system-skill-advisor/)
- Violations appear in primary docs, secondary docs, changelog, and test documentation (iter 015, ref_file changelog/v0.2.0.md; manual_testing_playbook/)
- **Impact:** Requires systematic cleanup across entire documentation package to achieve HVR compliance

**Pattern 5: Dual hook locations span system-spec-kit + system-skill-advisor + .devin config (002+004)**
- Hooks exist in OLD location (system-spec-kit/mcp_server/hooks/) and NEW location (system-skill-advisor/hooks/) with source TS and compiled JS in both (iter 017, ref_file system-spec-kit/mcp_server/hooks/; system-skill-advisor/hooks/)
- .devin/hooks.v1.json points to OLD path while INSTALL_GUIDE.md documents NEW path (iter 017, ref_file .devin/hooks.v1.json:8; INSTALL_GUIDE.md:143)
- No documentation explains which location is source of truth or if OLD should be deprecated (iter 017, ref_file INSTALL_GUIDE.md)
- **Impact:** Creates runtime configuration ambiguity and maintenance burden; requires decision on authoritative location and migration/deprecation strategy

## 4. Open Questions

**Question 1: ADR-001 location and treatment (Finding 1)**
- Should the ADR-001 decision record be located in the current repository structure, or was it archived/moved during packet reorganization?
- If archived, where is the canonical location and should SKILL.md/ARCHITECTURE.md references be updated to point to archive or removed entirely?
- If the ADR content is still relevant, should it be recreated in the current 008-skill-advisor structure (perhaps under 005-docs child)?

**Question 2: Hook reference canonicalization (Finding 5)**
- Should hook reference documentation live at a centralized `.opencode/references/hooks/` location, or should all hook docs remain under their respective skill packages?
- Current state: skill-advisor-hook.md exists in system-spec-kit/references/hooks/ but README.md/INSTALL_GUIDE.md reference non-existent `.opencode/references/hooks/` path
- Decision needed: create centralized hooks/ directory, or update all references to point to skill-package-local hook docs?

**Question 3: Dual hook location resolution (Finding 6)**
- Should the OLD system-spec-kit hooks/ location be deprecated and removed, or kept as a compatibility shim during transition period?
- If kept, what is the deprecation timeline and which runtimes still depend on OLD location?
- If removed, are there any external dependencies or configurations (beyond .devin/hooks.v1.json) that need updating?

**Question 4: feature_catalog 05 gap treatment (Finding from iter 010)**
- The feature_catalog has an intentional gap at slot 05 (between 04--scorer-fusion and 06--mcp-surface) from initial scaffold design
- Should this gap be documented as an intentional boundary marker between core pipeline (01-04) and integration layer (06-08), or should it be eliminated by renumbering 06-08 to 05-07?
- If kept as boundary marker, add documentation explaining the rationale; if eliminated, execute renumbering across feature_catalog and manual_testing_playbook

**Question 5: manual_testing_playbook 09 gap treatment (Finding from iter 014)**
- The manual_testing_playbook has an intentional gap at slot 09 (between 08--scorer-fusion and 10--python-compat) from initial design
- Should this gap be documented as intentional (mirroring feature_catalog 05 gap), or should slot 10 be renumbered to 09?
- Decision needed: align numbering strategy between feature_catalog and manual_testing_playbook for consistency

**Question 6: Compat and plugin_bridges directory existence (Findings 23, 24)**
- INSTALL_GUIDE.md references compat/ and plugin_bridges/ directories that do not exist in current package structure
- Should these directories be created with OpenCode bridge implementations, or should INSTALL_GUIDE.md references be removed if the bridge architecture was deprecated?
- If created, what should the bridge implementation contain given that OpenCode plugin already exists at `.opencode/plugins/mk-skill-advisor.js`?

**Question 7: Freshness contract scope and location (Finding 40)**
- What should be included in a formal freshness contract document (state transition rules, consumer obligations, daemon responsibilities, failure modes)?
- Which documentation surface should host the freshness contract: references/, feature_catalog/, INSTALL_GUIDE.md, or a new dedicated file like references/freshness-contract.md?
- Should the contract cover only trust-state semantics, or all freshness-related features (generation, rebuild, cache invalidation)?

**Question 8: Lane weight tuning guide structure (Finding 39)**
- What should the lane weight tuning guide structure include (measurement methodology, decision framework, approval process, rollback criteria)?
- Which documentation surface should host the tuning guide: references/, feature_catalog/, ARCHITECTURE.md, or a new dedicated file like references/lane-weight-tuning.md?
- Should the guide leverage the existing lane-weight-sweep.vitest.ts test harness for measurement input, or is that test harness output not operator-consumable?

**Question 9: manual_testing_playbook vs feature_catalog asymmetry (Finding 37)**
- Should manual_testing_playbook and feature_catalog be renumbered to achieve 1:1 category/group mapping, or is the current asymmetric coverage intentional?
- If asymmetry is intentional, should compat-and-disable and operator-h5 scenarios be represented as feature_catalog groups, or is their absence from the catalog intentional (operational vs feature distinction)?
- Decision needed: align naming/numbering for consistency, or document intentional asymmetry with cross-reference table

## 5. Convergence + Coverage Statistics

**Summary table:**

| Metric | Count |
|--------|-------|
| Total iterations executed | 20 |
| Total findings (unique after deduplication) | 28 |
| P0 (critical) findings | 8 |
| P1 (important) findings | 12 |
| P2 (minor) findings | 8 |
| Findings mapped to sub-phase 002 (bug fixes) | 11 |
| Findings mapped to sub-phase 003 (marketing rewrite) | 10 |
| Findings mapped to sub-phase 004 (sk-doc alignment) | 17 |
| Findings mapped to sub-phase 005 (content additions) | 8 |
| Note: Some findings map to multiple sub-phases |

**Coverage per doc surface:**

| Doc Surface | Primary Findings | Secondary Findings | HVR Violations | Template Alignment |
|------------|------------------|-------------------|----------------|-------------------|
| SKILL.md | 3 (ADR path, smart-router, hooks refs) | 2 (tool count, HVR) | Em dash (1), semicolons (multiple), Oxford commas (5) | Partial (missing smart-router pseudocode) |
| README.md | 5 (marketing sections, HVR, hooks refs) | 1 (tool count) | Em dash (1), semicolons (2), Oxford commas (multiple) | N/A (not sk-doc template) |
| ARCHITECTURE.md | 4 (ADR path, build command, skill-graph location, HVR) | 1 (tool count) | Em dash (2), semicolons (2), Oxford commas (16) | N/A (not sk-doc template) |
| INSTALL_GUIDE.md | 6 (compat, plugin_bridges, build command, hooks refs, tool omission, HVR) | 0 | Em dash (1), semicolons (1), Oxford commas (7) | N/A (not sk-doc template) |
| references/* | 4 (tool-ids contradiction, scorer gaps, cross-link gaps) | 0 | Em dashes (multiple), semicolons (multiple), Oxford commas (multiple) | Partial (cross-link gaps) |
| feature_catalog/* | 4 (TOC mismatch, file numbering, simplified table, 05 gap) | 0 | Em dashes (multiple), semicolons (multiple), Oxford commas (multiple) | Partial (simplified table vs template) |
| manual_testing_playbook/* | 3 (missing SOURCE FILES, structure deviation, coverage asymmetry) | 0 | Em dashes (dozens), semicolons (dozens), Oxford commas (17) | Partial (TEST EXECUTION structure deviation) |

**Convergence assessment:**
- Iterations 001-020 achieved comprehensive coverage across all 6 doc surfaces and 4 sub-phase targets
- No major gaps remain in audit coverage; all critical integrity failures, template misalignments, and content gaps have been identified
- HVR compliance sweep (iteration-015) revealed systematic punctuation violations across entire package
- Cross-link integrity audit (iteration-016) revealed systematic external path reference failures
- Convergence achieved: 20 iterations with 148 total findings before deduplication, consolidated to 28 unique findings with clear severity ranking and sub-phase mapping

## 6. Provenance

| Finding ID | Iteration | Source File:Lines |
|------------|-----------|-------------------|
| Finding 1 | 016 | SKILL.md:50,169-171; ARCHITECTURE.md:296 |
| Finding 2 | 015, 002 | SKILL.md:126; README.md:38; ARCHITECTURE.md:48,229; INSTALL_GUIDE.md:268; hvr_rules.md:99,100,101,35 |
| Finding 3 | 018 | tool-ids-reference.md:20,22,57-64 |
| Finding 4 | 017 | .devin/hooks.v1.json:8; INSTALL_GUIDE.md:143 |
| Finding 5 | 016 | README.md:203; INSTALL_GUIDE.md:327; system-spec-kit/references/hooks/skill-advisor-hook.md |
| Finding 6 | 017 | system-spec-kit/mcp_server/hooks/; system-skill-advisor/hooks/; system-skill-advisor/mcp_server/dist/system-skill-advisor/hooks/ |
| Finding 7 | 016 | README.md:203; INSTALL_GUIDE.md:327; SKILL.md:50,169-171; ARCHITECTURE.md:296; hooks/claude/README.md:32 |
| Finding 8 | 016 | hooks/claude/README.md:32 |
| Finding 9 | 019 | system-skill-advisor/; skill_advisor.py:2162-2179 |
| Finding 10 | 019 | graph-metadata.json:14-106,150-159 |
| Finding 11 | 018 | tools/index.ts:37-43; skill-graph-tools.ts:85-91; SKILL.md:113-126; README.md:164-172; ARCHITECTURE.md:217-227; opencode.json:45 |
| Finding 12 | 002 | README.md:32-49; system-code-graph/README.md:85-113 |
| Finding 13 | 002 | README.md:32-44; system-code-graph/README.md:38-42; hvr_rules.md:68-71 |
| Finding 14 | 002 | README.md:11-11; system-code-graph/README.md:12-14; hvr_rules.md:73-76 |
| Finding 15 | 002 | README.md:160-173; system-code-graph/README.md:206-233 |
| Finding 16 | 002 | README.md:180-194; system-code-graph/README.md:239-248 |
| Finding 17 | 002 | README.md:34; hvr_rules.md:42-46 |
| Finding 18 | 002 | README.md:32-44; system-code-graph/README.md:44-55 |
| Finding 19 | 002 | README.md:32-44; system-code-graph/README.md:57-65 |
| Finding 20 | 002 | README.md:32-44; system-code-graph/README.md:67-78 |
| Finding 21 | 002 | README.md:196-204; system-code-graph/README.md:254-272 |
| Finding 22 | 001 | SKILL.md:58-104; skill_smart_router.md:22-133,39-90,238-263; skill_md_template.md:175-176 |
| Finding 23 | 004 | INSTALL_GUIDE.md:140,146; system-skill-advisor/mcp_server |
| Finding 24 | 004 | INSTALL_GUIDE.md:182; system-skill-advisor/mcp_server; .opencode/plugins/mk-skill-advisor.js |
| Finding 25 | 003, 004 | ARCHITECTURE.md:262; INSTALL_GUIDE.md:60-61,104-106; package.json:7-9; ARCHITECTURE.md:40-42 |
| Finding 26 | 003 | ARCHITECTURE.md:17,278; advisor-server.ts:18-23; skill-graph-db.ts:1-5; system-spec-kit/mcp_server/lib |
| Finding 27 | 005 | lane-registry.ts:8-12,32-38; advisor-scorer.md:34-40,62 |
| Finding 28 | 005 | scoring-constants.ts:17-64,141-158; advisor-scorer.md:106-109 |
| Finding 29 | 007 | tool-ids-reference.md:62; propagate-enhances.md:19,64 |
| Finding 30 | 007 | skill-graph-extraction-plan.md:49,73-74 |
| Finding 31 | 007 | legacy-tool-bridge.md:33-35 |
| Finding 32 | 018 | INSTALL_GUIDE.md:10,37; skill-graph-tools.ts:66-83 |
| Finding 33 | 012 | 007-skill-graph-status.md:10-62; manual_testing_playbook_snippet_template.md:109-124 |
| Finding 34 | 013 | 001-watcher-narrow-scope.md:39-83; manual_testing_playbook_snippet_template.md:75-102 |
| Finding 35 | 010 | feature_catalog.md:20-29,26-27,115-126,28-29,131-145 |
| Finding 36 | 011 | 07--hooks-and-plugin/; feature_catalog_template.md:29-37; feature_catalog.md:150-159 |
| Finding 37 | 014 | manual_testing_playbook/; feature_catalog/; manual_testing_playbook.md:242-268; feature_catalog.md:67-79,131-145 |
| Finding 38 | 004 | INSTALL_GUIDE.md:202-209; hooks/devin/user-prompt-submit.ts:91-94; hooks/claude/user-prompt-submit.ts:125 |
| Finding 39 | 019 | weights-config.md:18-26; ARCHITECTURE.md:247,280; 005-ablation.md:3,20,47; lane-weight-sweep.vitest.ts:469,588,626 |
| Finding 40 | 019 | feature_catalog.md:67-78; ARCHITECTURE.md:138,161,201-209,221; 05-trust-state.md:25-34 |
| Finding 41 | 015 | system-skill-advisor/; SKILL.md:126; README.md:38; ARCHITECTURE.md:48,229; INSTALL_GUIDE.md:268 |
| Finding 42 | 015 | system-skill-advisor/; SKILL.md:126; README.md:38; ARCHITECTURE.md:48,229; INSTALL_GUIDE.md:268 |
| Finding 43 | 015 | system-skill-advisor/; SKILL.md:126; README.md:38; ARCHITECTURE.md:48,229; INSTALL_GUIDE.md:268 |
| Finding 44 | 004 | INSTALL_GUIDE.md:291-292; system-skill-advisor/mcp_server/scripts/; skill_advisor_regression.py |
# Iter 002 — README.md marketing-voice gap audit vs peer system-code-graph/README.md

## Question

Where does `.opencode/skills/system-skill-advisor/README.md` fall short of the peer `system-code-graph/README.md` marketing voice ceiling, and which sections need rewrite for the 003 marketing-style README pass?

## Evidence (file:line citations required)

**Evidence 1: Marketing buzzword grep results**
- Grep for banned marketing buzzwords (leverage, robust, seamless, holistic, synergy, utilize, delve, empower, disrupt, journey, ecosystem, landscape) found NO MATCHES in system-skill-advisor README <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/README.md" lines="1-205" />
- This indicates system-skill-advisor README is already clean of HVR hard-blocker words from Section 6 <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-doc/references/global/hvr_rules.md" lines="333-345" />

**Evidence 2: Punctuation and style pattern grep results**
- Grep for punctuation/style patterns (— em dashes, semicolons, Oxford commas) found 3 matches in system-skill-advisor README <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/README.md" lines="1-205" />
- Line 38: Em dash usage in "four `advisor_*` tools plus five `skill_graph_*` tools (8 public + 1 internal trusted-caller — see [Tool IDs Reference]" <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/README.md" line="38" />
- Line 129: Semicolon usage in "Alias handling is internal to scoring and validation; it maps only fixed command/skill id groups" <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/README.md" line="129" />
- Line 172: Semicolon usage in "detect missing inbound `enhances` edges; report/propose/apply modes with composite scoring" <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/README.md" line="172" />
- HVR rules ban em dashes and semicolons entirely, requiring replacement with commas or sentence breaks <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-doc/references/global/hvr_rules.md" lines="97-117" />

**Evidence 3: Heading structure comparison**
- Grep for H2 headings found 9 sections in system-skill-advisor README <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/README.md" lines="16-196" />
- Grep for H2 headings found 16 sections in system-code-graph README (including H3 subsections) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-code-graph/README.md" lines="19-277" />
- System-skill-advisor sections: TABLE OF CONTENTS, 1. OVERVIEW, 2. ARCHITECTURE, 3. DIRECTORY TREE, 4. KEY FILES, 5. BOUNDARIES AND FLOW, 6. ENTRYPOINTS, 7. VALIDATION, 8. RELATED <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/README.md" lines="16-196" />
- System-code-graph sections: TABLE OF CONTENTS, 1. OVERVIEW, 2. QUICK START, 3. FEATURES, 4. STRUCTURE, 5. CONFIGURATION, 6. USAGE EXAMPLES, 7. TROUBLESHOOTING, 8. FAQ, 9. RELATED DOCUMENTS <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-code-graph/README.md" lines="19-277" />

**Evidence 4: Peer benchmark marketing voice elements**
- System-code-graph has compelling H1 tagline: "Structural code indexing, SQLite-backed graph storage and MCP-facing code intelligence for impact analysis, neighborhood retrieval, readiness checks and change detection" <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-code-graph/README.md" lines="12-14" />
- System-code-graph OVERVIEW has "Purpose" subsection with clear narrative <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-code-graph/README.md" lines="38-42" />
- System-code-graph has "Key Statistics" table with concrete metrics (version, runtime package, MCP server name, tool count, storage path) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-code-graph/README.md" lines="44-55" />
- System-code-graph has "How This Compares" table differentiating when to use this skill vs alternatives <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-code-graph/README.md" lines="57-65" />
- System-code-graph has "Key Features" table explaining what each feature does <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-code-graph/README.md" lines="67-78" />
- System-code-graph has QUICK START section with numbered steps and expected results <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-code-graph/README.md" lines="85-113" />
- System-code-graph has USAGE EXAMPLES section with concrete user request → tool path → arguments → expected output patterns <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-code-graph/README.md" lines="206-233" />
- System-code-graph has TROUBLESHOOTING section with What You See | Cause | Fix table <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-code-graph/README.md" lines="239-248" />
- System-code-graph has FAQ section addressing common questions <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-code-graph/README.md" lines="254-272" />

**Evidence 5: Target README current structure gaps**
- System-skill-advisor has NO H1 tagline under the title <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/README.md" lines="11-11" />
- System-skill-advisor OVERVIEW is a bulleted "Current state" list, not a narrative "Purpose" subsection <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/README.md" lines="32-44" />
- System-skill-advisor has NO "Key Statistics" table with concrete metrics <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/README.md" lines="32-44" />
- System-skill-advisor has NO "How This Compares" table differentiating from alternatives <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/README.md" lines="32-44" />
- System-skill-advisor has NO "Key Features" table explaining component capabilities <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/README.md" lines="32-44" />
- System-skill-advisor has NO QUICK START section - jumps from OVERVIEW to ARCHITECTURE <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/README.md" lines="32-49" />
- System-skill-advisor has NO USAGE EXAMPLES section with concrete request → tool path patterns <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/README.md" lines="160-173" />
- System-skill-advisor has NO TROUBLESHOOTING section <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/README.md" lines="180-194" />
- System-skill-advisor has NO FAQ section <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/README.md" lines="196-204" />

**Evidence 6: HVR voice directive compliance**
- HVR requires active voice, direct address, conciseness, simple language, clarity, conversational tone, authenticity, practical focus <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-doc/references/global/hvr_rules.md" lines="39-91" />
- System-skill-advisor uses passive voice in line 34: "It contains the standalone mk_skill_advisor MCP server" <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/README.md" line="34" />
- System-skill-advisor lacks direct address (you/your) throughout - uses third-person descriptions <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/README.md" lines="32-44" />
- System-code-graph uses direct address in TROUBLESHOOTING: "What You See | Cause | Fix" <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-code-graph/README.md" lines="239-248" />

**Evidence 7: Prior iteration cross-reference**
- Iteration-001 focused on SKILL.md anchor coverage and smart-router conformance, not README marketing voice <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/005-docs/004-docs-quality-refactor/001-audit-and-research/research/iterations/iteration-001.md" lines="1-77" />
- Iteration-001 found missing canonical smart-router pseudocode (P0) and anchor coverage gaps (P1) in SKILL.md <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/005-docs/004-docs-quality-refactor/001-audit-and-research/research/iterations/iteration-001.md" lines="35-61" />
- Iteration-001 did NOT audit README marketing voice or compare against peer benchmarks <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/005-docs/004-docs-quality-refactor/001-audit-and-research/research/iterations/iteration-001.md" lines="1-77" />

## Findings (numbered, severity-tagged P0|P1|P2, impact-ranked 1-10, sub-phase-targeted 002|003|004|005)

**Finding 1: Missing H1 tagline (P1, impact-rank 8, sub-phase-target: 003)**
- System-skill-advisor README lacks compelling H1 tagline that system-code-graph has <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/README.md" lines="11-11" />
- System-code-graph tagline: "Structural code indexing, SQLite-backed graph storage and MCP-facing code intelligence for impact analysis, neighborhood retrieval, readiness checks and change detection" <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-code-graph/README.md" lines="12-14" />
- Missing tagline removes immediate value proposition and marketing hook <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-doc/references/global/hvr_rules.md" lines="73-76" />

**Finding 2: OVERVIEW structure mismatch (P1, impact-rank 9, sub-phase-target: 003)**
- System-skill-advisor OVERVIEW uses bulleted "Current state" list instead of narrative "Purpose" subsection <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/README.md" lines="32-44" />
- System-code-graph OVERVIEW has "Purpose" subsection with clear narrative explaining what the skill does <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-code-graph/README.md" lines="38-42" />
- Bulleted state list is less approachable than narrative purpose description <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-doc/references/global/hvr_rules.md" lines="68-71" />

**Finding 3: Missing Key Statistics table (P2, impact-rank 6, sub-phase-target: 003)**
- System-skill-advisor lacks "Key Statistics" table with concrete metrics <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/README.md" lines="32-44" />
- System-code-graph has Key Statistics table with version, runtime package, MCP server name, tool count, storage path <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-code-graph/README.md" lines="44-55" />
- Concrete metrics build trust and provide quick reference information <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-doc/references/global/hvr_rules.md" lines="79-81" />

**Finding 4: Missing How This Compares table (P2, impact-rank 7, sub-phase-target: 003)**
- System-skill-advisor lacks "How This Compares" table differentiating from alternatives <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/README.md" lines="32-44" />
- System-code-graph has "How This Compares" table showing when to use this skill vs other surfaces <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-code-graph/README.md" lines="57-65" />
- Comparison table helps users understand positioning and when to use the skill <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-doc/references/global/hvr_rules.md" lines="79-81" />

**Finding 5: Missing Key Features table (P2, impact-rank 6, sub-phase-target: 003)**
- System-skill-advisor lacks "Key Features" table explaining component capabilities <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/README.md" lines="32-44" />
- System-code-graph has "Key Features" table with "Feature | What It Does" structure <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-code-graph/README.md" lines="67-78" />
- Features table provides quick scan of capabilities without reading full documentation <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-doc/references/global/hvr_rules.md" lines="79-81" />

**Finding 6: Missing QUICK START section (P0, impact-rank 10, sub-phase-target: 003)**
- System-skill-advisor jumps from OVERVIEW to ARCHITECTURE with no QUICK START <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/README.md" lines="32-49" />
- System-code-graph has QUICK START with numbered steps and expected results <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-code-graph/README.md" lines="85-113" />
- QUICK START is critical for user onboarding and immediate value delivery <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-doc/references/global/hvr_rules.md" lines="79-81" />

**Finding 7: Missing USAGE EXAMPLES section (P1, impact-rank 8, sub-phase-target: 003)**
- System-skill-advisor has no USAGE EXAMPLES section with concrete request → tool path patterns <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/README.md" lines="160-173" />
- System-code-graph has USAGE EXAMPLES with "User request → Tool path → Arguments → Expected output" pattern <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-code-graph/README.md" lines="206-233" />
- Concrete examples show users exactly how to use the tools in practice <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-doc/references/global/hvr_rules.md" lines="79-81" />

**Finding 8: Missing TROUBLESHOOTING section (P1, impact-rank 7, sub-phase-target: 003)**
- System-skill-advisor has no TROUBLESHOOTING section <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/README.md" lines="180-194" />
- System-code-graph has TROUBLESHOOTING with "What You See | Cause | Fix" table <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-code-graph/README.md" lines="239-248" />
- Troubleshooting section reduces support burden and helps users self-resolve issues <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-doc/references/global/hvr_rules.md" lines="79-81" />

**Finding 9: Missing FAQ section (P2, impact-rank 5, sub-phase-target: 003)**
- System-skill-advisor has no FAQ section <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/README.md" lines="196-204" />
- System-code-graph has FAQ section addressing common questions <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-code-graph/README.md" lines="254-272" />
- FAQ reduces repeated questions and provides quick answers to common concerns <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-doc/references/global/hvr_rules.md" lines="79-81" />

**Finding 10: Em dash HVR violation (P0, impact-rank 10, sub-phase-target: 002)**
- Line 38 contains em dash: "four `advisor_*` tools plus five `skill_graph_*` tools (8 public + 1 internal trusted-caller — see [Tool IDs Reference]" <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/README.md" line="38" />
- HVR rules ban em dashes entirely: "NEVER use" with replacement guidance <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-doc/references/global/hvr_rules.md" lines="97-117" />
- Em dash is a hard blocker (-5 points) in HVR scoring system <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-doc/references/global/hvr_rules.md" lines="333-345" />

**Finding 11: Semicolon HVR violations (P0, impact-rank 10, sub-phase-target: 002)**
- Line 129 contains semicolon: "Alias handling is internal to scoring and validation; it maps only fixed command/skill id groups" <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/README.md" line="129" />
- Line 172 contains semicolon: "detect missing inbound `enhances` edges; report/propose/apply modes with composite scoring" <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/README.md" line="172" />
- HVR rules ban semicolons entirely: "NEVER use" with replacement guidance <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-doc/references/global/hvr_rules.md" lines="97-117" />
- Semicolons are hard blockers (-5 points each) in HVR scoring system <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-doc/references/global/hvr_rules.md" lines="333-345" />

**Finding 12: Passive voice usage (P1, impact-rank 6, sub-phase-target: 003)**
- Line 34 uses passive voice: "It contains the standalone mk_skill_advisor MCP server" <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/README.md" line="34" />
- HVR voice directives require active voice: "Use active voice. Subject before verb." <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-doc/references/global/hvr_rules.md" lines="42-46" />
- Passive voice is less direct and engaging than active voice <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-doc/references/global/hvr_rules.md" lines="42-46" />

**Finding 13: Missing direct address (P1, impact-rank 7, sub-phase-target: 003)**
- System-skill-advisor lacks direct address (you/your) throughout, uses third-person descriptions <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/README.md" lines="32-44" />
- HVR voice directives require direct address: "Address the reader with 'you' and 'your'." <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-doc/references/global/hvr_rules.md" lines="48-51" />
- Direct address makes documentation more conversational and user-focused <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-doc/references/global/hvr_rules.md" lines="48-51" />

**Finding 14: Technical structure vs user-facing structure (P1, impact-rank 8, sub-phase-target: 003)**
- System-skill-advisor structure is technical/architectural: ARCHITECTURE, DIRECTORY TREE, KEY FILES, BOUNDARIES AND FLOW <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/README.md" lines="49-155" />
- System-code-graph structure is user-facing/marketing: QUICK START, FEATURES, USAGE EXAMPLES, TROUBLESHOOTING, FAQ <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-code-graph/README.md" lines="85-272" />
- Technical structure serves maintainers but not end users; marketing structure serves end users <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-doc/references/global/hvr_rules.md" lines="73-76" />

## Gaps for next iter

1. **Gap 1**: Determine whether system-skill-advisor README should maintain technical ARCHITECTURE/DIRECTORY TREE/KEY FILES sections for maintainers or if these should be moved to a separate MAINTAINER.md file, following the peer pattern where technical details live in ARCHITECTURE.md and handler/lib READMEs.

2. **Gap 2**: Research what concrete metrics should go in the Key Statistics table for system-skill-advisor (version, runtime package, MCP server name, tool count, storage path, etc.) by examining the package.json and MCP server configuration.

3. **Gap 3**: Identify the "How This Compares" differentiators for system-skill-advisor - when should users use skill advisor routing vs direct skill invocation vs manual skill selection vs other routing mechanisms.

4. **Gap 4**: Determine what concrete USAGE EXAMPLES should be included for system-skill-advisor, focusing on the most common user workflows (skill recommendation, status checks, rebuild operations, validation).

5. **Gap 5**: Research common TROUBLESHOOTING scenarios for system-skill-advisor by examining error handling paths, validation failures, and common user confusion points to build the What You See | Cause | Fix table.

6. **Gap 6**: Identify FAQ questions for system-skill-advisor by examining SKILL.md, hook reference, and common user questions about skill routing, MCP tools, Python compatibility, and advisor cache behavior.

## JSONL delta row

```json
{"type":"iteration","iteration":2,"timestamp_utc":"2026-05-16T10:15:00Z","executor":"cli-devin","model":"swe-1.6","status":"complete","focus":"README.md marketing-voice gap audit vs peer system-code-graph/README.md","findings_count":14,"gaps_count":6,"newInfoRatio":0.95,"primary_evidence_files":["/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/README.md","/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-code-graph/README.md","/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-doc/references/global/hvr_rules.md","/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/README.md"]}
```

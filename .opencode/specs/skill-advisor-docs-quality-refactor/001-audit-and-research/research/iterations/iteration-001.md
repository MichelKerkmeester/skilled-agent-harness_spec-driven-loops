# Iter 001 — SKILL.md anchor coverage + smart-router conformance

## Question

Does `.opencode/skills/system-skill-advisor/SKILL.md` conform 1:1 to the sk-doc `skill_md` template's required anchor set and smart-router INPUTS↔ACTIONS↔OUTPUTS structure?

## Evidence (file:line citations required)

**Evidence 1: System-skill-advisor SKILL.md anchor enumeration**
- Grep found 8 ANCHOR comments in system-skill-advisor SKILL.md: lines 39, 58, 106, 136, 164, 186, 201, 222 <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/SKILL.md" lines="39-235" />
- Anchor names: 1-when-to-use, 2-smart-routing, 3-how-it-works, 4-rules, 5-references, 6-success-criteria, 7-integration-points, 8-references-and-related-resources <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/SKILL.md" lines="39-235" />

**Evidence 2: Canonical required sections from sk-doc template_rules.json**
- Skill document type required sections: when_to_use, smart_routing, how_it_works, rules <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-doc/assets/template_rules.json" lines="62-69" />
- Skill document type recommended sections: success_criteria, integration_points, related_resources <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-doc/assets/template_rules.json" lines="70-74" />
- Section aliases show "smart_routing_&_references" maps to smart_routing, allowing combined sections <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-doc/assets/template_rules.json" lines="90-105" />

**Evidence 3: Canonical smart-router pattern from skill_smart_router.md**
- Smart router requires 4 patterns: Runtime Discovery, Existence-Check Before Load, Extensible Routing Key, Multi-Tier Graceful Fallback <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-doc/assets/skill/skill_smart_router.md" lines="22-133" />
- Pattern requires Python pseudocode with discover_markdown_resources(), load_if_available(), get_routing_key(), and UNKNOWN_FALLBACK_CHECKLIST <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-doc/assets/skill/skill_smart_router.md" lines="32-133" />
- Pattern requires INTENT_MODEL, RESOURCE_MAP, and LOADING_LEVELS data structures <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-doc/assets/skill/skill_smart_router.md" lines="238-254" />

**Evidence 4: System-skill-advisor SMART ROUTING section structure**
- Section contains routing model text diagram, resource domains list, routing key explanation, fallback contract, and anti-patterns <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/SKILL.md" lines="58-104" />
- Section lacks Python pseudocode block with the canonical 4 patterns <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/SKILL.md" lines="58-104" />
- Section lacks INTENT_MODEL, RESOURCE_MAP, LOADING_LEVELS data structures <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/SKILL.md" lines="58-104" />

**Evidence 5: SKILL.md template required sections guidance**
- Template states required sections: WHEN TO USE, SMART ROUTING, HOW IT WORKS, RULES (with ALWAYS, NEVER, ESCALATE IF), REFERENCES <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-doc/assets/skill/skill_md_template.md" lines="112-117" />
- Template recommends SUCCESS CRITERIA, INTEGRATION POINTS, REFERENCES AND RELATED RESOURCES <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-doc/assets/skill/skill_md_template.md" lines="117-118" />
- Template requires SMART ROUTING section to include one authoritative Smart Router Pseudocode block <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-doc/assets/skill/skill_md_template.md" lines="175-176" />

## Findings (numbered, severity-tagged P0|P1|P2, impact-ranked 1-10)

**Finding 1: Missing canonical smart-router pseudocode (P0, impact-rank 10)**
- System-skill-advisor SMART ROUTING section lacks the required Python pseudocode block with the 4 canonical patterns (Runtime Discovery, Existence-Check Before Load, Extensible Routing Key, Multi-Tier Graceful Fallback) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-doc/assets/skill/skill_smart_router.md" lines="22-133" />
- Current section uses a text-based flow diagram instead of the canonical pseudocode pattern <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/SKILL.md" lines="63-77" />
- Missing required functions: discover_markdown_resources(), load_if_available(), get_routing_key() <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-doc/assets/skill/skill_smart_router.md" lines="39-90" />
- Missing required data structures: INTENT_MODEL, RESOURCE_MAP, LOADING_LEVELS, UNKNOWN_FALLBACK_CHECKLIST <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-doc/assets/skill/skill_smart_router.md" lines="238-263" />
- Template explicitly requires "one authoritative Smart Router Pseudocode block" in SMART ROUTING section <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-doc/assets/skill/skill_md_template.md" lines="175-176" />

**Finding 2: Anchor coverage complete but REFERENCES section non-canonical (P1, impact-rank 6)**
- All 4 required sections present with correct anchors: 1-when-to-use, 2-smart-routing, 3-how-it-works, 4-rules <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/SKILL.md" lines="39-162" />
- All 3 recommended sections present with correct anchors: 6-success-criteria, 7-integration-points, 8-references-and-related-resources <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/SKILL.md" lines="186-235" />
- Extra section 5-references exists but is not in required or recommended lists <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/SKILL.md" lines="164-184" />
- Template allows combined "SMART ROUTING & REFERENCES" but separate REFERENCES section is not documented in canonical requirements <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-doc/assets/template_rules.json" lines="90-105" />

**Finding 3: SMART ROUTING lacks detection signal documentation (P1, impact-rank 7)**
- Template requires SMART ROUTING to include "explicit detection signal(s) (project/stack/mode as applicable)" <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-doc/assets/skill/skill_md_template.md" lines="1096-1097" />
- System-skill-advisor SMART ROUTING lacks explicit detection signal subsection <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/SKILL.md" lines="58-104" />
- Current section describes routing model but does not document detection signals in the canonical format <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/SKILL.md" lines="63-77" />

**Finding 4: SMART ROUTING lacks Resource Loading Levels table (P2, impact-rank 4)**
- Template requires SMART ROUTING to include "Resource Loading Levels table" <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-doc/assets/skill/skill_md_template.md" lines="1101-1102" />
- System-skill-advisor SMART ROUTING lacks Resource Loading Levels table <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/SKILL.md" lines="58-104" />
- Current section has "Resource domains" list but not the canonical LOADING_LEVELS table structure <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/SKILL.md" lines="79-84" />

**Finding 5: SMART ROUTING lacks Phase Detection summary flow (P2, impact-rank 5)**
- Template requires SMART ROUTING to include "Phase Detection summary flow" <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-doc/assets/skill/skill_md_template.md" lines="1097-1098" />
- System-skill-advisor SMART ROUTING lacks Phase Detection subsection <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/SKILL.md" lines="58-104" />
- Current routing model diagram shows flow but not in canonical Phase Detection format <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/SKILL.md" lines="63-77" />

## Gaps for next iter

1. **Gap 1**: Investigate whether the separate REFERENCES section (5-references) in system-skill-advisor is intentional or a legacy artifact that should be merged into SMART ROUTING per the combined section pattern.

2. **Gap 2**: Determine if system-skill-advisor's domain-specific routing model (MCP-based advisor_recommend) requires customization of the canonical smart-router pattern or if the standard pattern should be applied without modification.

3. **Gap 3**: Research other system skills to see if they follow the canonical smart-router pattern or if system-skill-advisor's approach is part of a broader pattern for MCP-based routing skills.

4. **Gap 4**: Check if there are any ADR (Architecture Decision Records) documents that justify the current SMART ROUTING structure in system-skill-advisor, particularly ADR-001 referenced in the skill.

## JSONL delta row

```json
{"type":"iteration","iteration":1,"timestamp_utc":"2026-05-16T10:00:00Z","executor":"cli-devin","model":"swe-1.6","status":"complete","focus":"SKILL.md anchor coverage + smart-router conformance","findings_count":5,"gaps_count":4,"newInfoRatio":0.85,"primary_evidence_files":["/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/SKILL.md","/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-doc/assets/template_rules.json","/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-doc/assets/skill/skill_smart_router.md","/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-doc/assets/skill/skill_md_template.md"]}
```
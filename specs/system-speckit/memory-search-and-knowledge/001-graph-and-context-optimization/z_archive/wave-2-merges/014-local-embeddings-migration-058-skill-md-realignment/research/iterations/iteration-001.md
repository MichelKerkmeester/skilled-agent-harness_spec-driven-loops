---
title: "Iter 001 — Track 1: system-spec-kit/SKILL.md drift survey"
iteration: 1
track: 1
focus: "system-spec-kit/SKILL.md drift survey"
status: complete
newInfoRatio: 0.00
---

# Iter 001

## RQ
Read both files. Compare against the template's required sections (per template's section 3): WHEN TO USE, SMART ROUTING, HOW IT WORKS, RULES, REFERENCES. For each: present in system-spec-kit/SKILL.md? Aligned with template's section schema? Cite line numbers.

## Actions
- Read authority file: `.opencode/skills/sk-doc/assets/skill/skill_md_template.md` (1174 lines)
- Read target file: `.opencode/skills/system-spec-kit/SKILL.md` (466 lines)
- Analyzed section 3 template requirements against target structure
- Compared each required section for presence and alignment

## Findings

### F-001-001: WHEN TO USE section
- Claim: Present? Yes, lines 14-75
- Alignment: PARTIALLY ALIGNED
- Status: DRIFTED
- Details: 
  - Template expects: Activation Triggers, Use Cases, When NOT to Use
  - Target has: What is a Spec Folder?, Activation Triggers, When NOT to Use, Distributed Governance Rule, Utility Template Triggers
  - Additional content present (governance rules, utility template triggers) not in template schema
  - Missing explicit "Use Cases" subsection structure
- Suggested action: Consider restructuring to match template's "Use Cases" pattern, or document variance as intentional for this skill's complexity

### F-001-002: SMART ROUTING
- Claim: Present? Yes, lines 78-351
- Alignment: ALIGNED
- Status: ALIGNED
- Details:
  - Template expects: Detection signals, phase detection, resource domains, resource loading levels, smart router pseudocode
  - Target has: Resource Domains, Template and Script Sources of Truth, Resource Loading Levels, Smart Router Pseudocode
  - All core elements present with comprehensive pseudocode implementation
  - Additional "Template and Script Sources of Truth" subsection provides useful context
- Suggested action: None - well-aligned with template expectations

### F-001-003: HOW IT WORKS
- Claim: Present? Yes, lines 355-376
- Alignment: DRIFTED
- Status: DRIFTED
- Details:
  - Template expects: Workflow overview with 2-3 sentence explanation, process flow with step-by-step breakdown (STEP 1/2/3 with sub-actions and arrows), key component patterns, resource usage patterns
  - Target has: Core Workflow (5 bullet points), Spec Kit Memory, Validation and Recovery, Code Graph and Search Routing
  - Missing: Detailed process flow diagram with step-by-step visual breakdown, sub-action nesting, output descriptions
  - Structure is prose-based rather than template's visual flow format
- Suggested action: Add process flow diagram matching template's STEP 1/2/3 structure with sub-actions and arrows

### F-001-004: RULES
- Claim: Present? Yes, lines 379-428
- Alignment: DRIFTED
- Status: DRIFTED
- Details:
  - Template expects: Section 4 with subsections ALWAYS, NEVER, ESCALATE IF (or ESCALATE WHEN)
  - Target has: Section 4 with subsections ✅ ALWAYS, ❌ NEVER, ⚠️ ESCALATE IF
  - Drift: Uses emoji prefixes (✅/❌/⚠️) not specified in template
  - Template specifies: "Subsections MUST be named ALWAYS, NEVER, and ESCALATE IF (or ESCALATE WHEN)"
  - Content structure within subsections matches template expectations
- Suggested action: Remove emoji prefixes to match template's exact subsection naming requirements

### F-001-005: REFERENCES
- Claim: Present? Yes, lines 460-466
- Alignment: DRIFTED
- Status: DRIFTED
- Details:
  - Template expects: Section 5 with subsections "Core References", "Templates and Assets", "Reference Loading Notes"
  - Target has: Section 7 titled "REFERENCES AND RELATED RESOURCES" (combined heading)
  - Missing: Explicit "Core References" and "Templates and Assets" subsections
  - Content is present but not structured per template's subsection schema
  - Template allows combined "SMART ROUTING & REFERENCES" heading but this is separate sections combined
- Suggested action: Restructure to match template's "Core References" and "Templates and Assets" subsections, or use approved combined heading format

## Coverage notes
Target file includes additional sections beyond template requirements: SUCCESS CRITERIA (Section 5), INTEGRATION POINTS (Section 6). These are listed as "Recommended Sections" in template, so their presence is acceptable. The main drift issues are in HOW IT WORKS (missing visual process flow), RULES (emoji prefixes), and REFERENCES (subsection structure).

## newInfoRatio rationale
newInfoRatio=0.00 - This is a structural comparison against a known template authority, not a discovery task. No new information was generated; this is a compliance verification exercise.

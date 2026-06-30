# Iteration 002 — system-code-graph: SKILL.md routing + invariants + trigger phrases against sk-doc skill_md_template

## Summary

SKILL.md deviates from sk-doc template in three critical areas: Section 1 lacks structured activation triggers and keyword triggers; Section 2 replaces required Smart Router Pseudocode with a static lookup table; Section 4 RULES uses bullet format instead of required ALWAYS/NEVER/ESCALATE IF subsections. These are structural violations that break validation and runtime routing expectations.

## Files Reviewed

- `.opencode/skills/system-code-graph/SKILL.md` (lines read: 146)
- `.opencode/skills/sk-doc/assets/skill/skill_md_template.md` (lines read: 1174)

## Findings

### P0 (release-blocking)

| ID | File:line | Finding | Why P0 | Remediation |
|----|-----------|---------|--------|-------------|
| P0-001 | SKILL.md:44-62 | Section 2 SMART ROUTING uses static intent-to-surface table instead of required Smart Router Pseudocode with detection signal, phase detection, resource domains, loading levels, and authoritative pseudocode block | Template requires explicit Primary Detection Signal, Phase Detection, Resource Domains, Resource Loading Levels, and Smart Router Pseudocode with scoped guards, recursive discovery, weighted scoring, and ambiguity handling (skill_md_template.md:659-754). Static table violates routing authority requirement and breaks package_skill.py validation. | Replace static table with five required subsections following template pattern, including detection logic, resource domain mapping, loading levels table, and authoritative pseudocode block with _guard_in_skill(), discover_markdown_resources(), classify_intents(), and UNKNOWN_FALLBACK_CHECKLIST. |
| P0-002 | SKILL.md:76-83 | Section 4 RULES uses bullet format instead of required ALWAYS/NEVER/ESCALATE IF subsections | Template requires RULES section with three specific subsections: ALWAYS (4-7 critical requirements), NEVER (3-5 anti-patterns), ESCALATE IF (3-5 escalation triggers) (skill_md_template.md:878-923). package_skill.py validation enforces this structure. | Restructure RULES section into three subsections with ALL CAPS headers: ALWAYS, NEVER, ESCALATE IF (or ESCALATE WHEN), with numbered rules and implementation details as specified in template. |

### P1 (high priority)

| ID | File:line | Finding | Why P1 | Remediation |
|----|-----------|---------|--------|-------------|
| P1-001 | SKILL.md:26-34 | Section 1 WHEN TO USE lacks structured Activation Triggers and Keyword Triggers subsections | Template requires explicit Activation Triggers subsection with "Use when:" scenarios and optional Keyword Triggers (skill_md_template.md:628-635). Current format mixes triggers with use cases without clear categorization. | Add "### Activation Triggers" subsection with "Use when:" bullet list and "### Keyword Triggers" subsection (optional but recommended for discoverability). |
| P1-002 | SKILL.md:26-34 | Section 1 WHEN TO USE lacks Use Case categorization (2-4 categories) | Template requires Use Cases with 2-4 categories, each with 3-5 specific scenarios (skill_md_template.md:637-641). Current format has unstructured list without categorization. | Restructure use cases into 2-4 categories (e.g., "Structural Search", "Impact Analysis", "Graph Health") with 3-5 scenarios per category. |
| P1-003 | SKILL.md:20 | Keywords are in HTML comment instead of structured Keyword Triggers subsection | Template recommends Keyword Triggers as a formal subsection in Section 1 for skill discoverability (skill_md_template.md:634-635). HTML comment is not actionable by routing systems. | Move keywords from HTML comment to "### Keyword Triggers" subsection in Section 1 with proper formatting. |

### P2 (nice-to-have)

| ID | File:line | Finding | Why P2 | Remediation |
|----|-----------|---------|--------|-------------|
| P2-001 | SKILL.md:67-72 | Section 3 HOW IT WORKS lacks process flow ASCII diagram and structured workflow overview | Template recommends visual ASCII process flow diagrams for workflow clarity (skill_md_template.md:757-796). Current section has only text description. | Add ASCII process flow diagram showing scan/query/context/verify workflow steps with sub-actions and outputs. |
| P2-002 | SKILL.md:99-105 | Section 6 SUCCESS CRITERIA lacks checkbox format and quality gates | Template recommends checkbox format `- [ ]` for completion checklists and explicit quality gates (skill_md_template.md:950-983). Current format uses bullet list without checkboxes. | Convert success criteria to checkbox format and add Quality Gates subsection with specific thresholds and validation requirements. |

## Convergence Signal

newInfoRatio 0.85 vs prior iteration (iteration 001 focused on documentation alignment across multiple files; this iteration focused on SKILL.md structural compliance against template, revealing new P0 and P1 findings in routing and rules structure).

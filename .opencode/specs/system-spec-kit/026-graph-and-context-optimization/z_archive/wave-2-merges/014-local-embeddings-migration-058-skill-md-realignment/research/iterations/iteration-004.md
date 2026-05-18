# Iter 004 — Track 2: system-code-graph/SKILL.md drift survey

## Target File
- **Path**: `.opencode/skills/system-code-graph/SKILL.md`
- **Lines**: 146
- **Anchors**: 8 (smart-routing, how-it-works, rules, references, success-criteria, integration-points, naming-note, related-resources)

## Authority File
- **Path**: `.opencode/skills/sk-doc/assets/skill/skill_md_template.md`
- **Template Section**: Section 3 (lines 102-603)
- **Target Size**: 800-2000 lines for SKILL.md (<5k words total)

## Section Presence Analysis

### ✅ Present Sections
1. **WHEN TO USE** (lines 26-41)
   - Has: Use cases, When NOT to Use
   - Missing: Activation Triggers subsection, Keyword Triggers

2. **SMART ROUTING** (lines 44-62)
   - Has: Intent-to-surface routing table
   - Missing: Detection Signals, Phase Detection, Resource Domains, Resource Loading Levels, Smart Router Pseudocode (critical per template)

3. **HOW IT WORKS** (lines 66-72)
   - Has: Brief overview
   - Missing: Process Flow diagram, Key Component explanations, Resource Usage Pattern, Configuration/Setup

4. **RULES** (lines 76-83)
   - Has: Basic rules
   - Missing: Required subsections (ALWAYS, NEVER, ESCALATE IF) - **VALIDATION BLOCKER** per template

5. **REFERENCES** (lines 87-94)
   - Has: Core references
   - Missing: Templates and Assets subsection, Reference Loading Notes

6. **SUCCESS CRITERIA** (lines 98-105)
   - Has: Completion checklist
   - Missing: Quality Targets subsection, Validation Success subsection

7. **INTEGRATION POINTS** (lines 109-122)
   - Has: Naming convention, consumer types
   - Missing: Integration System subsections, Tool Usage Guidelines, Knowledge Base Dependencies, External Tools

8. **REFERENCES AND RELATED RESOURCES** (lines 140-146)
   - Has: Related resources
   - Missing: Word count targets, Bundled resources structure, Native discovery notes

### ❌ Missing Sections
- None (all 8 numbered sections present)

### ⚠️ Non-Template Section
- **Section 8: NAMING NOTE** (lines 126-136) - This section is not in the template structure. Template has Section 8 as "REFERENCES AND RELATED RESOURCES" which should contain naming/structure guidance, not a standalone NAMING NOTE.

## Anchor Naming Consistency
- ✅ All anchor names use lowercase-hyphen format
- ✅ Anchor placement matches section boundaries
- ⚠️ `naming-note` anchor not in template (template expects this content in Section 8)

## _memory Continuity Block Analysis
```yaml
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/005-code-graph/025-skill-docs-sk-doc-alignment"
    last_updated_at: "2026-05-14T17:43:47Z"
    last_updated_by: "codex"
    recent_action: "Aligned skill-level docs with sk-doc standards"
    next_safe_action: "Use mk-code-index namespace in live MCP references"
    blockers: []
    key_files:
      - "SKILL.md"
      - "feature_catalog/feature_catalog.md"
      - "manual_testing_playbook/manual_testing_playbook.md"

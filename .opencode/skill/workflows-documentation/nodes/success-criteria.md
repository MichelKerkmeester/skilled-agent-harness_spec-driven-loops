---
description: "Definition of Document Quality Index (DQI), and checklists for completing documentation tasks."
---
# Success Criteria

### Document Quality Index (DQI)

The `extract_structure.py` script computes a **DQI** (0-100) based on measurable attributes:

| Component     | Max | Measures                                                 |
| ------------- | --- | -------------------------------------------------------- |
| **Structure** | 40  | Checklist pass rate (type-specific)                      |
| **Content**   | 30  | Word count, heading density, code examples, links        |
| **Style**     | 30  | H2 formatting, dividers, intro paragraph, HVR compliance |

**HVR Compliance in DQI**: Human Voice Rules violations count against the Style component. Documents with em dashes, semicolons, banned words or banned phrases receive deductions in the Style score. Full HVR ruleset: [hvr_rules.md](./references/hvr_rules.md).

**Quality Bands**:

| Band           | Score  | Action                            |
| -------------- | ------ | --------------------------------- |
| **Excellent**  | 90-100 | None needed                       |
| **Good**       | 75-89  | Minor improvements                |
| **Acceptable** | 60-74  | Several areas need attention      |
| **Needs Work** | <60    | Significant improvements required |

**Example DQI Output** (from `extract_structure.py`):
```json
{
  "dqi": {
    "total": 96,
    "band": "excellent",
    "components": {
      "structure": 40,
      "content": 26,
      "style": 30
    }
  },
  "checklist": { "passed": 12, "failed": 0, "skipped": 2 },
  "documentType": "SKILL"
}
```

### Completion Checklists

**Document Quality Complete**:
- ✅ `extract_structure.py` executed, JSON parsed
- ✅ Document type detected, checklist reviewed
- ✅ Evaluation questions answered, recommendations generated
- ✅ All critical issues addressed
- ✅ HVR compliance verified (no banned words, punctuation or structure violations)

**Skill Creation Complete**:
- ✅ YAML frontmatter with name + description (third-person, specific)
- ✅ SKILL.md under 5k words, bundled resources organized
- ✅ Unused examples deleted, passes `package_skill.py`
- ✅ Final AI review completed, tested on real examples

**Agent Creation Complete**:
- ✅ YAML frontmatter with name, mode, temperature, tools, permission
- ✅ Tool permissions explicitly set (true/false for each)
- ✅ CORE WORKFLOW section with numbered steps
- ✅ ANTI-PATTERNS section with clear boundaries
- ✅ RELATED RESOURCES section with links
- ✅ Tested with real examples

**Command Creation Complete**:
- ✅ YAML frontmatter with name, description, triggers
- ✅ Clear usage examples (copy-paste ready)
- ✅ Execution logic defined
- ✅ Added to command registry
- ✅ Tested invocation works

**Flowchart Complete**:
- ✅ All paths clear, decisions labeled, parallel blocks resolve
- ✅ Spacing consistent, understandable without explanation
- ✅ Size limits: ≤40 boxes, ≤8 depth levels, ≤200 lines

**Install Guide Complete**:
- ✅ AI-first prompt included, copy-paste ready
- ✅ All 5 phases have validation checkpoints
- ✅ Platform configurations provided (at least OpenCode)
- ✅ Troubleshooting covers common errors
- ✅ Commands tested and working

### Document-Type Gates

| Type      | Structure               | Content              | Required                    |
| --------- | ----------------------- | -------------------- | --------------------------- |
| SKILL.md  | Strict (no failures)    | High AI-friendliness | Frontmatter, WHEN/HOW/RULES |
| README.md | Flexible                | High AI-friendliness | Quick Start, examples       |
| Knowledge | Strict (no frontmatter) | Good AI-friendliness | Numbered H2s                |
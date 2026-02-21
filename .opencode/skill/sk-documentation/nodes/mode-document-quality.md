---
description: "How the Document Quality Index (DQI) pipeline evaluates templates, levels, validation quality, save guidance, and configuration clarity across READMEs/specs/knowledge docs."
---
# Document Quality Mode

### Mode 1: Document Quality

**Script-Assisted AI Analysis**:

```bash
# 1. Extract document structure to JSON
scripts/extract_structure.py path/to/document.md

# 2. AI receives JSON with:
#    - Frontmatter, structure, metrics
#    - Checklist results, DQI score
#    - Evaluation questions

# 3. AI reviews and provides recommendations
```

**Document Type Detection** (auto-applies enforcement):

| Type      | Enforcement | Frontmatter | Notes                            |
| --------- | ----------- | ----------- | -------------------------------- |
| README    | Flexible    | None        | Focus on quick-start usability   |
| SKILL     | Strict      | Required    | No structural checklist failures |
| Knowledge | Moderate    | Forbidden   | Consistent, scannable reference  |
| Command   | Strict      | Required    | Must be executable               |
| Spec      | Loose       | Optional    | Working docs. Avoid blocking.    |
| Generic   | Flexible    | Optional    | Best-effort structure            |

## Cross-Skill Bridges

- [Validation Workflow](../../system-spec-kit/nodes/validation-workflow.md) - Gate-driven completion and checklist validation
- [Progressive Enhancement Levels](../../system-spec-kit/nodes/progressive-enhancement.md) - Level/template selection strategy
- [OpenCode Quick Reference](../../sk-code--opencode/nodes/quick-reference.md) - Config-aware technical writing and standards

---
description: "Framework integration, skill differentiation table, and related resources for OpenCode code standards"
---
# Integration Points

Defines how this skill integrates with the broader framework, differentiates from other skills, and links to external and internal resources.

## Framework Integration

This skill operates within the behavioral framework defined in AGENTS.md.

- **Gate 2**: Skill routing via `skill_advisor.py`
- **Memory**: Context preserved via Spec Kit Memory MCP

## Skill Differentiation

| Task Type                 | This Skill | workflows-code |
| ------------------------- | ---------- | -------------- |
| MCP server JavaScript     | Yes        | No             |
| MCP server TypeScript     | Yes        | No             |
| Python validation scripts | Yes        | No             |
| Shell automation scripts  | Yes        | No             |
| JSON/JSONC configs        | Yes        | No             |
| Frontend JavaScript (DOM) | No         | Yes            |
| CSS styling               | No         | Yes            |
| Browser verification      | No         | Yes            |

## External Resources

| Resource        | URL                          | Use For                     |
| --------------- | ---------------------------- | --------------------------- |
| MDN Web Docs    | developer.mozilla.org        | JavaScript, Node.js APIs    |
| TypeScript Docs | typescriptlang.org/docs      | TypeScript language, config |
| TSDoc Reference | tsdoc.org                    | TSDoc comment format        |
| Python Docs     | docs.python.org              | Python standard library     |
| Bash Manual     | gnu.org/software/bash/manual | Shell scripting             |
| JSON Schema     | json-schema.org              | JSON/JSONC validation       |
| ShellCheck      | shellcheck.net               | Shell script validation     |

## Reference Files

| Language   | Files                                                          |
| ---------- | -------------------------------------------------------------- |
| Shared     | `universal_patterns.md`, `code_organization.md`                |
| JavaScript | `style_guide.md`, `quality_standards.md`, `quick_reference.md` |
| TypeScript | `style_guide.md`, `quality_standards.md`, `quick_reference.md` |
| Python     | `style_guide.md`, `quality_standards.md`, `quick_reference.md` |
| Shell      | `style_guide.md`, `quality_standards.md`, `quick_reference.md` |
| Config     | `style_guide.md`, `quick_reference.md`                         |

## Checklists

- `assets/checklists/universal_checklist.md` - Cross-language P0 items
- `assets/checklists/javascript_checklist.md` - JS-specific validation
- `assets/checklists/typescript_checklist.md` - TS-specific validation
- `assets/checklists/python_checklist.md` - Python-specific validation
- `assets/checklists/shell_checklist.md` - Shell-specific validation
- `assets/checklists/config_checklist.md` - JSON/JSONC validation

## Related Skills

| Skill                       | Use For                                    |
| --------------------------- | ------------------------------------------ |
| **workflows-code**          | Web/frontend development, browser testing  |
| **workflows-documentation** | Markdown documentation, skill creation     |
| **system-spec-kit**         | Spec folders, memory, context preservation |
| **workflows-git**           | Git workflows, commits, PR creation        |

## Cross References
- [[when-to-use]] - When to choose this skill vs. workflows-code
- [[smart-routing]] - Resource loading domains and levels
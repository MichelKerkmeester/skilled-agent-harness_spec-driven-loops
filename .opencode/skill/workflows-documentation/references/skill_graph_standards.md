---
title: Skill Graph Standards
description: Standards for building node-based skills with index files, clear links and consistent structure.
---

# Skill Graph Standards

Rules for building and maintaining skill graphs in OpenCode.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### Goal
Use small markdown nodes instead of one large `SKILL.md` file so the agent can load only what it needs.

### Core Model
- **Index**: Entry point that maps the topic and routes attention.
- **Nodes**: Focused markdown files in `nodes/`.
- **Links**: Semantic references between nodes.
- **MOCs**: Optional map files for large domains.

### Node Rules
- Keep each node focused on one topic.
- Keep files short and readable.
- Add YAML frontmatter with a one line `description`.
- Use clear headings and direct language.

### Link Rules
Use escaped examples in documentation text to avoid accidental link validation errors:
- `\[\[target-file\]\]`
- `\[\[target-file|alias\]\]`

When writing real content, place links inside meaningful sentences so the agent knows when to follow them.

### Validation
Run this command after creating or updating graph files:

```bash
.opencode/skill/system-spec-kit/scripts/check-links.sh
```

A passing result means all real links resolve.

---

<!-- /ANCHOR:overview -->

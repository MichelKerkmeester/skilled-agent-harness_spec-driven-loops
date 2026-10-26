---
title: "Implementation Plan: Figma hosted server from CLI children"
description: "Add one subsection to mcp-wiring.md on reaching Figma's hosted MCP server from headless Claude Code and Codex children, and release it as mcp-figma v1.1.6.0."
trigger_phrases:
  - "figma hosted from cli children plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.3 -->
# Implementation Plan: Figma hosted server from CLI children

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown |
| **Framework** | sk-doc reference and changelog rules |
| **Storage** | None |
| **Testing** | `validate_document.py` and `validate.sh --strict` |

### Overview
One reference gains a subsection that records what live runs on 2026-10-26 showed. The packet moves to v1.1.6.0 with a changelog. The validators prove the docs.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] Tests passing (if applicable)
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Documentation only

### Key Components
- **`references/mcp-wiring.md`**: holds the new Section 6 subsection
- **`changelog/v1.1.6.0.md`**: the release note that `SKILL.md`'s version follows

### Data Flow
None. No script or config changes.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

N/A — record any testing beyond the verification tasks in `tasks.md` here.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

N/A — record dependencies beyond the components named in the architecture here.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the one commit.
<!-- /ANCHOR:rollback -->

---


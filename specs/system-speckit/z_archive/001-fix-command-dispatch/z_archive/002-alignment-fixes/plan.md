---
title: "Implementation Plan: Memory Command Alignment Fixes [system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/002-alignment-fixes/plan]"
description: "Reconstructed delivery plan for the memory command alignment fixes, derived from spec.md and git history."
trigger_phrases:
  - "memory command alignment plan"
  - "memory command UI alignment"
  - "memory command MCP matrix plan"
importance_tier: "important"
contextType: "planning"
---
> Reconstructed on 2026-10-07 from spec.md and git history. It was not written at the time.

# Implementation Plan: Memory Command Alignment Fixes

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown command and skill documents |
| **Framework** | Not recorded |
| **Storage** | Not recorded |
| **Testing** | Manual review of the aligned command files |

### Overview

Align the memory command files so their UI formatting, default screen and MCP tool requirements are consistent: single-line box characters only, the HOME SCREEN dashboard as the default for `/memory:search`, an MCP ENFORCEMENT MATRIX per command file, and native MCP tool calls instead of inline bash where possible.

<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified

### Definition of Done

- [ ] All acceptance criteria met
- [ ] Evidence recorded without implementation claims
- [ ] Docs updated (spec/plan/tasks)

<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Not recorded. The packet aligned existing command documents rather than introducing a system design.

### Key Components

- **`search.md`**: default HOME SCREEN dashboard when called without arguments
- **`status.md`**: MCP enforcement matrix and `memory_stats` tool usage
- **`triggers.md`**: MCP enforcement matrix and `memory_list` tool usage
- **`cleanup.md`**: MCP enforcement matrix (bash retained for complex logic)
- **`SKILL.md`** (workflows-memory): routing diagram updated with HOME SCREEN
- **`AGENTS.md`**: updated with `memory_list` and `memory_stats`

### Data Flow

Not recorded.

<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`.

<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Manual verification of each aligned command file against the acceptance criteria in `spec.md`: single-line box drawings, HOME SCREEN default, MCP ENFORCEMENT MATRIX presence, and the native MCP tool calls in `status.md` and `triggers.md`.

<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Memory command files (`search.md`, `status.md`, `triggers.md`, `cleanup.md`) | Internal | Not recorded | The alignment cannot be applied without the files in scope |
| Workflows-memory `SKILL.md` and `AGENTS.md` | Internal | Not recorded | Routing and tool references stay inconsistent |

<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Not recorded.
- **Procedure**: Revert the edits to the command files named in `spec.md`; no code or data changes are involved.

<!-- /ANCHOR:rollback -->

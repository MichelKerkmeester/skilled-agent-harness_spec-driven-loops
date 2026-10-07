---
title: "Implementation Plan: Anchor System Enforcement [system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/014-anchor-enforcement/plan]"
description: "Reconstructed delivery plan for the memory anchor format enforcement, derived from spec.md and git history."
trigger_phrases:
  - "anchor system enforcement plan"
  - "memory anchor format plan"
  - "anchor retrieval savings plan"
importance_tier: "important"
contextType: "planning"
---
> Reconstructed on 2026-10-07 from spec.md and git history. It was not written at the time.

# Implementation Plan: Anchor System Enforcement

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown command, skill and template documents |
| **Framework** | Not recorded |
| **Storage** | Not recorded |
| **Testing** | `grep` checks against the memory context template |

### Overview

Standardize the memory anchor format on the MCP server spelling - `<!-- ANCHOR_EXAMPLE:anchor-id -->` with a matching closing tag - and enforce it through documentation in the memory commands, the workflows-memory skill and the memory context template. The recorded motivation is section-specific retrieval, which loads one anchor instead of the whole file.

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

Not recorded. The packet standardized a documentation format rather than introducing a system design.

### Key Components

- **`save.md`**: anchor generation step marked mandatory
- **`search.md`**: anchor-aware loading UI and `anchorId` in the MCP signatures
- **`SKILL.md`** (workflows-memory): corrected anchor format documentation
- **`context_template.md`**: all 16 anchor references moved to the UPPERCASE format

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

The spec records two `grep` checks against `.opencode/memory/templates/context_template.md`:

- `grep -c "ANCHOR:" .opencode/memory/templates/context_template.md` - expected 16
- `grep -c "anchor:" .opencode/memory/templates/context_template.md` - expected 0

<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Memory command files (`save.md`, `search.md`) | Internal | Not recorded | Anchor generation and loading guidance stays inconsistent |
| Workflows-memory `SKILL.md` and `context_template.md` | Internal | Not recorded | The documented format keeps diverging from the MCP server |

<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Not recorded.
- **Procedure**: Revert the edits to the files named in `spec.md`; no code or data changes are involved.

<!-- /ANCHOR:rollback -->

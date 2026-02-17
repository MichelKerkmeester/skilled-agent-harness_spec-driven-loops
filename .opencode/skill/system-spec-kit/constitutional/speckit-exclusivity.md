---
title: "SPEC DOCUMENTATION AGENT EXCLUSIVITY - @SPECKIT ONLY"
importanceTier: constitutional
contextType: decision
triggerPhrases:
  # Spec folder operations
  - spec folder
  - spec.md
  - plan.md
  - tasks.md
  - checklist.md
  - decision-record.md
  - implementation-summary.md
  - research.md
  - handover.md
  # Creation/writing actions on spec docs
  - create spec
  - write spec
  - write plan
  - write tasks
  - write checklist
  - create plan
  - create tasks
  - generate spec
  - spec documentation
  - spec template
  - write documentation
  - create documentation
  # Agent routing for specs
  - speckit
  - spec kit
  - spec folder creation
  - spec folder documentation
  # Broader doc patterns
  - write md
  - create md
  - write markdown
  - documentation in spec
---

<!-- ANCHOR:speckit-exclusivity -->

## HARD RULE: @speckit Is the ONLY Agent for Spec Folder Documentation

**RULE:** Creating or substantively writing ANY documentation (*.md) inside a spec folder MUST use `@speckit`. No other agent (`@general`, `@write`, etc.) may create or write these files — with specific exceptions listed below.

**Scope — ALL of these require @speckit:**
- ANY markdown file (*.md) created inside `specs/[###-name]/`
- This includes but is not limited to: spec.md, plan.md, tasks.md, checklist.md, decision-record.md, implementation-summary.md, and any other documentation
- The rule applies to file CREATION and SUBSTANTIVE WRITING (not minor checkbox updates)

**Exceptions (these do NOT require @speckit):**
- `memory/` subdirectory → uses `generate-context.js` script (never manual Write)
- `scratch/` subdirectory → temporary workspace, any agent may write
- `handover.md` → `@handover` agent exclusively (session continuation documents)
- `research.md` → `@research` agent exclusively (9-step investigation findings)
- **Reading** spec docs is permitted by any agent
- **Minor status updates** (e.g., checking boxes in tasks.md) by implementing agents

**WHY this rule exists:**
- `@speckit` enforces template structure, Level 1-3+ documentation standards, and validation
- Other agents produce non-standard documentation that fails quality gates
- This was the most common routing violation observed: orchestrators default to `@general` for "writing tasks" but spec documentation is a specialized domain

**WHY @handover and @research are excepted:**
- `@handover` writes session-continuation artifacts with a specialized 7-section format — not spec template documentation. Handover happens at session boundaries where speed matters.
- `@research` writes investigation findings using a 9-step research methodology — the research process is distinct from template-based spec documentation.
- Both agents have specialized formats that `@speckit` does not enforce or understand.

**Violation Recovery:**
1. STOP — do not continue writing with the wrong agent
2. Acknowledge the routing error
3. Re-dispatch to `@speckit` with the same requirements and any context gathered

**References:** orchestrate.md §6 Rule 5, §29 Anti-Patterns | AGENTS.md §7 Agent Routing, §3 Compliance Checkpoints

<!-- /ANCHOR:speckit-exclusivity -->

*Constitutional Memory — Always surfaces at top of search results*
*Created: 2026-02-11 | Updated: 2026-02-11*
*Location: .opencode/skill/system-spec-kit/constitutional/*

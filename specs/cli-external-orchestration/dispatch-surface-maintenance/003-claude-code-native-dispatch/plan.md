---
title: "Implementation Plan: Tell Claude Code sessions to dispatch native subagents instead of the cli-claude-code CLI"
description: "Three wording changes in the cli-claude-code skill that point a Claude Code session to native subagents and to agent definitions for a pinned effort."
trigger_phrases:
  - "claude code native dispatch plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Tell Claude Code sessions to dispatch native subagents instead of the cli-claude-code CLI

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown skill doc |
| **Framework** | cli-external-orchestration parent hub, compiled routing |
| **Storage** | None |
| **Testing** | `parent-skill-check.cjs`, `compiled-route-guard.cjs`, `route-validate.sh` |

### Overview
Edit three lines of `.skilled/skills/cli-external-orchestration/cli-claude-code/SKILL.md` so the self-invocation guard names the native route. The hub manifest hashes the skill text, so it is re-minted and copied to its authored source.
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
- [ ] Tests passing (if applicable)
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Documentation change inside a parent-hub mode packet.

### Key Components
- **`cli-claude-code/SKILL.md`**: the guard bullet, the guard comment and the `$CLAUDECODE` rule.
- **Hub manifest**: `.skilled/bin/lib/compiled-routing/013-live-activation/activation/cli-external-orchestration/manifest.json` and its authored copy.

### Data Flow
Skill text, then the re-minted manifest, then the route guard confirms the runtime and authored copies match.
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

N/A — record rollback steps beyond reverting the scoped change here.
<!-- /ANCHOR:rollback -->

---


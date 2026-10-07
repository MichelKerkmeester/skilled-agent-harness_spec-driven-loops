---
title: "Implementation Plan: Phase 003 — Rename deep-agent-improvement to deep-improvement"
description: "Reconstructed Level 2 implementation plan for the 003 rename phase, derived from spec.md and git history. It restates the confirmed rename surface list, the git mv plus tracked find-and-replace approach, and the advisor rebuild gate; the original plan was never written."
trigger_phrases:
  - "deep-improvement rename plan"
  - "phase 003 narrow rename plan"
importance_tier: "important"
contextType: "implementation"
---
> Reconstructed on 2026-10-07 from spec.md and git history. It was not written at the time.

# Implementation Plan: Phase 003 — Rename deep-agent-improvement → deep-improvement

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Skill directory, `SKILL.md`, command markdown, agent mirrors, skill-advisor graph and `descriptions.json` metadata |
| **Framework** | Not recorded |
| **Storage** | Not recorded |
| **Testing** | Advisor rebuild + validate; `validate.sh --strict` for this folder |

### Overview
Rename the skill `deep-agent-improvement` to `deep-improvement` across every surface so the name reflects its real scope (agents + models + skills), because the `-agent-` infix became misleading. The work is a `git mv` of the skill directory plus a tracked find-and-replace across the surface list confirmed by Phase 001 RQ6, followed by an advisor rebuild and validation.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Phase 001 rename impact map (RQ6) available
- [ ] Confirmed rename surface list agreed
- [ ] Agent-name decision recorded

### Definition of Done
- [ ] Zero dangling `deep-agent-improvement` references where `deep-improvement` is intended
- [ ] Advisor rebuild + validate green; skill resolvable under the new name
- [ ] `validate.sh --strict` green for this phase
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Not recorded — the phase was scoped as a rename/refactor, not a system design.

### Key Components
- **Skill package**: `.opencode/skills/deep-agent-improvement/` → `.opencode/skills/deep-improvement/` (directory + `SKILL.md` name/frontmatter/triggers/keywords)
- **Commands**: skill-path references in the deep-loop commands
- **Agent + runtime mirrors**: the agent file and its `.claude/`, `.codex/`, `.gemini/` mirrors
- **Advisor surfaces**: skill-advisor graph, `descriptions.json`, advisor metadata
- **Cross-references**: sentinel, root `CLAUDE.md` / `AGENTS.md`, and other skills/docs that name the skill

### Data Flow
Not recorded.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Integration | Advisor rebuild + route checks; skill resolvable under the new name | Not recorded |
| Regression | Lane A and Lane B still run | Not recorded |
| Static | Dangling-reference grep; `validate.sh --strict` for this folder | `validate.sh` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 001 rename impact map | Internal | Not recorded | The surface list could miss a reference |
| Skill-advisor rebuild tooling | Internal | Not recorded | The skill cannot be verified as resolvable under the new name |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Not recorded.
- **Procedure**: Not recorded — the rename was to be tracked so the change could be reverted as one unit.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Implementation |
| Implementation | Setup | Verification |
| Verification | Implementation | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Not recorded | Not recorded |
| Implementation | Not recorded | Not recorded |
| Verification | Not recorded | Not recorded |
| **Total** | | **Not recorded** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Rename executed as tracked changes

### Rollback Procedure
1. Not recorded.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: Not recorded.
<!-- /ANCHOR:enhanced-rollback -->

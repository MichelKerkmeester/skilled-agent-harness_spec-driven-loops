---
title: "Implementation Plan: design command upgrade"
description: "Plan the command-surface upgrade around inventory, router alignment, replay fixtures, and compatibility notes before command edits begin."
trigger_phrases:
  - "design command upgrade plan"
  - "command routing replay"
  - "design command specificity"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/045-design-command-upgrade"
    last_updated_at: "2026-06-30T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Replaced template plan with scoped command-upgrade plan"
    next_safe_action: "Run the command alias inventory and select fixtures"
    blockers: []
    key_files:
      - "plan.md"
      - "spec.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "plan-154-045-design-command-upgrade"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: design command upgrade

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown command docs and sk-design skill docs |
| **Framework** | OpenCode command and skill routing |
| **Storage** | None |
| **Testing** | Routing replay fixtures, grep inventories, strict spec validation |

### Overview
The implementation should start by inventorying the existing command surface, then compare each command route against the `sk-design` parent router. Only after that inventory should command prose, aliases, and replay fixtures change.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Command alias inventory captured.
- [ ] Router mode names and boundaries confirmed.
- [ ] Replay fixture locations selected.

### Definition of Done
- [ ] Changed commands have replay evidence.
- [ ] Compatibility behavior is documented.
- [ ] Parent and child spec validation pass.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Command router alignment with fixture-backed verification.

### Key Components
- **Command docs**: user-facing entry points that select or describe design modes.
- **Parent router**: source of truth for mode boundaries.
- **Replay fixtures**: proof that command wording and route expectations stay synchronized.

### Data Flow
User command text maps to a design mode, the parent router loads that mode, and replay fixtures prove the expected mode and resource set.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.opencode/commands/design*.md` | Command entry points | Planned audit/update | alias inventory and replay fixtures |
| `.opencode/skills/sk-design/SKILL.md` | Parent router | Planned inspect | mode-name comparison |
| `.opencode/skills/sk-design/**/SKILL.md` | Mode packets | Planned inspect | resource-loading comparison |
| replay fixtures | Command behavior evidence | Planned update | deterministic replay output |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Inventory
- [ ] List design commands and aliases.
- [ ] List router mode names and trigger phrases.
- [ ] Identify command aliases with ambiguous or overlapping routes.

### Phase 2: Alignment
- [ ] Update command descriptions or aliases where the inventory shows drift.
- [ ] Keep compatibility behavior explicit for renamed or tightened aliases.
- [ ] Avoid changing mode craft guidance unless the command route requires it.

### Phase 3: Verification
- [ ] Add or update replay fixtures.
- [ ] Run command replay and strict spec validation.
- [ ] Record the result in implementation-summary.md.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Inventory | None | Alignment |
| Alignment | Inventory | Verification |
| Verification | Alignment | Completion |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATE

| Workstream | Estimate | Notes |
|------------|----------|-------|
| Inventory | Small | grep and router comparison |
| Alignment | Medium | depends on alias count |
| Verification | Medium | replay fixture updates |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

| Change Type | Rollback |
|-------------|----------|
| Command prose | revert the command-doc diff |
| Alias behavior | restore old alias wording and replay fixture |
| Replay fixtures | revert fixture rows with the command change |
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```text
command aliases -> parent router mode names -> replay fixtures -> validation
```
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. Capture command alias inventory.
2. Compare aliases with parent router mode boundaries.
3. Update the smallest command surface.
4. Add replay evidence.
5. Run strict validation.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Exit Criteria |
|-----------|---------------|
| Inventory complete | alias and router lists captured |
| Alignment complete | command changes drafted |
| Verification complete | replay and validation pass |
<!-- /ANCHOR:milestones -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Static inventory | command aliases and mode names | `rg` |
| Replay | command-to-mode expectations | existing routing benchmark harness |
| Validation | packet structure | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| sk-design parent router | Internal | Green | Command alignment has no source of truth |
| routing replay fixtures | Internal | Yellow | Command changes become hard to prove |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: replay fixtures fail after a command change or a compatibility alias breaks unexpectedly.
- **Procedure**: revert the command-doc changes, keep the inventory notes, and split the failing alias into a smaller follow-up.
<!-- /ANCHOR:rollback -->

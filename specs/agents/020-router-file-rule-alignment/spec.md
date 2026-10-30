---
title: "Feature Specification: Align the hub routing repo rule with the per-skill ROUTER.md layout"
description: "The hub routing repo rule still describes the router layout from before every mode packet got its own ROUTER.md, so an agent editing a packet's router is never sent to the rule."
trigger_phrases:
  - "router file rule alignment"
  - "align the hub routing repo rule"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Align the hub routing repo rule with the per-skill ROUTER.md layout

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-10-30 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The router-file move in `sk-doc/072-skill-routing-and-clarity/014-skill-router-files` gave every hub and every mode packet its own `ROUTER.md`, and a packet's machine router now lives there instead of in its `SKILL.md`. The hub routing repo rule and its `REPO RULES.md` trigger row predate that move: they name a hub's root `ROUTER.md` and nothing else, so an agent about to edit a mode packet's `ROUTER.md` is never routed to the rule that governs it.

### Purpose
The rule and its trigger row name every `ROUTER.md` that holds routing, and the rule says where a packet's router lives.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ git show HEAD:.skilled/repo-rules/skill-hub-routing.md | grep -n 'ROUTER.md'
38:- Editing `graph-metadata.json`, `hub-router.json`, a root `ROUTER.md`, or a hub's `SKILL.md` mode table.
59:| Two | the hub's `hub-router.json` and root `ROUTER.md` | the mode, then its leaves |
$ git show HEAD:"REPO RULES.md" | grep -c "mode packet's own"
0
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add a mode packet's own `ROUTER.md` to the rule's "Fires when" list.
- State in the rule's two-stage section that each hub and packet owns its `ROUTER.md`, and that a router edit belongs there rather than in `SKILL.md`.
- Point the rule's detail table at the sk-doc reference that defines where each `ROUTER.md` lives.
- Add a mode packet's own `ROUTER.md` to the hub routing row of the `REPO RULES.md` trigger table.

### Out of Scope
- `AGENTS.md` - it never says where a router lives, so the move left nothing stale in it.
- The other twelve rule files - none names a router file or the SMART ROUTING section.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/repo-rules/skill-hub-routing.md` | Modify | Name the packet `ROUTER.md`, say where a router lives, version 1.0.0.3 |
| `REPO RULES.md` | Modify | Trigger row names a mode packet's own `ROUTER.md` |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The rule fires on an edit to a mode packet's own `ROUTER.md` | `grep -c "a mode packet's own \`ROUTER.md\`" .skilled/repo-rules/skill-hub-routing.md` prints 1 |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | The trigger table routes the same edit to the rule | `grep -c "a mode packet's own" "REPO RULES.md"` prints 1 |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Both greps in section 4 print 1.
- **SC-002**: `check-repo-rules.cjs`, the repo-rule corpus checker, prints `RESULT: PASSED (11/11 checks)`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `parent-skills-nested-packets.md` §1 defines the layout the rule now cites | Low | The rule points at it rather than restating it |
| Risk | The trigger index surfaces the rule on its trigger phrases | Low | No trigger phrase changed, so the index needs no rebuild for this edit |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

---

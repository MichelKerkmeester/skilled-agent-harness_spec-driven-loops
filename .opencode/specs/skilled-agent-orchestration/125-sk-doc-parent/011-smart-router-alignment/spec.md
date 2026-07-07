---
title: "Feature Specification: Align router-carrying SKILL.md nested smart-routers to the canonical template"
description: "Align the ~24 skills that carry router pseudocode or keyed routing to the canonical 4-pattern smart-router template, scaled to actual need, including operator-authorized concurrent-lane skills."
trigger_phrases:
  - "smart router alignment"
  - "125 sk-doc phase 011"
  - "skill router canon"
  - "skill_smart_router template"
importance_tier: "important"
contextType: "implementation"
parent: "skilled-agent-orchestration/125-sk-doc-parent"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/125-sk-doc-parent/011-smart-router-alignment"
    last_updated_at: "2026-07-07T00:00:00Z"
    last_updated_by: "claude-sonnet"
    recent_action: "Spec/plan/tasks authored; audit and alignment not yet started"
    next_safe_action: "Enumerate the router-carrying skills and classify full-router vs simple"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "bootstrap-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Feature Specification: Align router-carrying SKILL.md nested smart-routers to the canonical template

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Draft |
| **Created** | 2026-07-07 |
| **Branch** | `system-speckit/028-memory-search-intelligence` |
| **Parent Packet** | `skilled-agent-orchestration/125-sk-doc-parent` |
| **Depends On** | `010-subskill-doc-review/` |
| **Predecessor** | `010-subskill-doc-review/` |
| **Successor** | `012-quality-control-rename/` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Roughly 24 skills across the repo carry router pseudocode or keyed routing logic inside their `SKILL.md`, but only the handful of full parent hubs (`sk-code`, `sk-design`, `deep-loop-workflows`, `sk-doc`) follow the canonical 4-pattern smart-router contract documented at `.opencode/skills/sk-doc/create-skill/assets/skill/skill_smart_router.md`. The rest carry ad-hoc router prose, which risks silent drift: a routing key added to one list but not the runtime-discovery scan, a resource load with no existence guard, or no fallback tier when a expected resource is missing.

### Purpose
Align each router-carrying skill's `SKILL.md` to the canonical template, scaled to actual need. A skill that routes to a small fixed set of keyed resource subdirectories needs the full 4-pattern treatment (Runtime Discovery, Existence-Check Before Load, Extensible Routing Key, Multi-Tier Graceful Fallback); a skill with simple single-branch routing does not need the full router, only the pattern(s) that apply. Covers operator-authorized concurrent-lane skills.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Enumerate and classify the router-carrying skills as full-router-needed vs simple-routing.
- Align every full-router skill's smart-router section to the 4 patterns from `skill_smart_router.md` (Runtime Discovery, Existence-Check Before Load, Extensible Routing Key, Multi-Tier Graceful Fallback).
- Document why a simple-routing skill is exempt from the full 4-pattern treatment.
- Touch operator-authorized concurrent-lane skills, limited strictly to their router section.

### Out of Scope
- Rewriting a skill's routing logic or behavior, only its documentation/structure against the canonical template.
- Any content outside the smart-router section of a touched `SKILL.md`.
- The sk-doc packet rename, shared/references reorg, and markdown-agent sync — each is its own phase (012-014).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|--------------|
| `.opencode/skills/*/SKILL.md` (subset of ~24 router-carrying skills) | Update | Align the nested smart-router section to the canonical 4-pattern template, scaled to need |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every router-carrying skill is classified full-router or simple-routing | A recorded classification with rationale exists for each of the ~24 candidates |
| REQ-002 | Every full-router skill demonstrates the 4 canonical patterns, or cites which subset applies and why | Diff against `skill_smart_router.md`'s pattern set shows coverage or a documented exemption |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Concurrent-lane skill edits stay scoped to the router section | Diff for each concurrent-lane skill touches only its smart-router prose, no unrelated content |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All ~24 candidate skills are reviewed with a recorded classification (full-router or simple-routing).
- **SC-002**: Zero full-router skills are missing a canonical pattern without a documented reason.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Concurrent-lane edits collide with other in-flight work on those skills | Merge conflicts or overwritten work | Scope edits strictly to the router section; operator authorization already covers this class of touch |
| Dependency | Canonical template stability (`skill_smart_router.md`) | A template change mid-phase would require re-aligning already-finished skills | Read the template once at phase start; re-check only if the template itself changes before phase close |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Where a skill's routing is a single `if/else` with no resource discovery at all, is a documented exemption sufficient, or should it still gain a minimal Pattern 2 (existence-check) guard? Default: documented exemption is sufficient unless the skill already loads a resource file unconditionally.
<!-- /ANCHOR:questions -->

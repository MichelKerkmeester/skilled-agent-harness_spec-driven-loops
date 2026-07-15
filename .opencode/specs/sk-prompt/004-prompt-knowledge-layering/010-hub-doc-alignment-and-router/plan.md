---
title: "Implementation Plan: hub-doc-alignment-and-router"
description: "Align the hub SKILL.md/README/profiles to sk-doc templates: model-keyed router, spec-ref-clean README, 9 profiles to the reference template."
trigger_phrases:
  - "hub doc alignment plan"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/004-prompt-knowledge-layering/010-hub-doc-alignment-and-router"
    last_updated_at: "2026-06-03T08:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored phase 010 plan"
    next_safe_action: "Validate then commit"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "e02c3e95-f865-4fec-8ff8-0a7907486924"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: hub-doc-alignment-and-router

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown docs (skill SKILL.md, README, references) |
| **Framework** | sk-doc templates (skill_md / skill_smart_router / skill_reference / skill_readme) |
| **Storage** | None |
| **Testing** | card-sync guard + grep invariants + validate.sh --strict |

### Overview
Conform the hub doc surface to the sk-doc templates. The hard part (the model-keyed router, the
README rewrite) is done by the orchestrator; the repetitive 9-profile restructure is delegated to
subagents against the exact reference template, then verified.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Templates identified; deviations mapped
- [x] Decisions locked at plan approval

### Definition of Done
- [ ] Router, README, 9 profiles aligned; guard green; validate --strict exit 0
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Template conformance + single-source routing. The router routes by model id to
`references/models/<id>.md`, mirroring the resilient smart-router pattern.

### Key Components
- **SKILL.md §2** — the model-keyed smart router.
- **README.md** — human orientation, hub identity, no spec refs.
- **references/models/** — per-model profiles in the reference-template shape.

### Data Flow
Operator names a model → router resolves the id → loads the profile → pattern-index points to cli-* mechanics.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Read sk-doc templates; map deviations.

### Phase 2: Core Implementation
- [x] SKILL.md §2 model-keyed router + LOC cap relax + version bump
- [x] README rewrite (hub identity, spec-ref scrub, HVR)
- [x] 9 profiles + _index to reference template (delegated, verified)
- [x] skills/README.md hub index entry refresh

### Phase 3: Verification
- [ ] guard green + grep invariants + validate --strict
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Structure | Section counts, casing, OVERVIEW presence | grep |
| Hygiene | No spec refs, no em-dash/semicolon in README | grep |
| Regression | Card-sync invariants | check-prompt-quality-card-sync.sh |
| Doc | Spec-folder integrity | validate.sh --recursive --strict |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| sk-doc templates | Internal | Green | — |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: alignment breaks an in-skill link or the guard.
- **Procedure**: per-file git revert; all changes are isolated doc edits on `main`.
<!-- /ANCHOR:rollback -->

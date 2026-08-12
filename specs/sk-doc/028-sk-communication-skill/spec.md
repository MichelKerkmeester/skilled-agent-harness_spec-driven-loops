---
title: "Feature Specification: sk-communication skill"
description: "Author a standalone advisor-routable skill that surfaces the portable CLI communication-projection package."
trigger_phrases:
  - "sk-communication skill"
  - "communication projection skill"
importance_tier: "standard"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/028-sk-communication-skill"
    last_updated_at: "2026-08-12T13:10:00Z"
    last_updated_by: "claude"
    recent_action: "Authored and validated the sk-communication standalone skill."
    next_safe_action: "None; the skill is validated and advisor-routable."
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-communication-skill-20260812"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The skill is a standalone wrapper that routes to the communication-projection package."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

<!-- SPECKIT_LEVEL: 1 -->

# Feature Specification: sk-communication skill

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-08-12 |
| **Branch** | `skilled/0143-provider-adapters-privacy` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The portable CLI communication-projection capability lived only as a package under `packages/cli-communication-projection/`, so the skill advisor could not surface it and an AI agent had no routed entry point to its invariants.

### Purpose

Expose the capability as a standalone, advisor-routable skill that points at the package and enforces its load-bearing rules.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- A standalone skill at `.opencode/skills/sk-communication/` with authored `SKILL.md`, `graph-metadata.json`, and `leaf-manifest.config.json`, plus generated manifest and aliases.
- Advisor domains and intent signals filled with real user phrasing.

### Out of Scope

- Changing the communication-projection package itself.
- A parent hub or nested packets; this is one identity with one contract.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Ship a valid standalone class-S skill root. | `ci-skill-root-metadata` passes and `validate_skill_package.py` reports clean. |
| REQ-002 | Route to the package invariants. | `SKILL.md` states the pipeline, both presentation tiers, privacy-before-ranking, exact-original fallback, and content-free telemetry. |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Be advisor-discoverable. | The advisor recommends the skill as the top match for a projection intent. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Skill validation passes with zero hard failures.
- **SC-002**: The advisor returns sk-communication as the top match for a projection prompt.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The communication-projection package | High | The skill points at the package; both land together from the same branch. |
| Risk | Slug-only advisor vocabulary would not route | Medium | Domains and intent signals use real user phrasing, not the skill name. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None. The skill is authored, validated, and advisor-routable.
<!-- /ANCHOR:questions -->

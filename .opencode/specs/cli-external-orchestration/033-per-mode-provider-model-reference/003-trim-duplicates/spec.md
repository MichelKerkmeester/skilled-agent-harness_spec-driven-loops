---
title: "Feature Specification: Phase 3 — trim duplicated provider/model enumerations"
description: "With a dedicated per-mode catalog in place, the old enumerations in each mode's cli-reference.md and SKILL.md are now redundant and must be trimmed to compact residue plus a pointer."
trigger_phrases:
  - "trim cli reference model tables"
  - "compact residue plus pointer"
  - "de-duplicate provider model docs"
  - "self-sufficiency dispatch gate"
  - "preserve advisor routing tokens"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/033/003-trim-duplicates"
    last_updated_at: "2026-07-29T08:35:30Z"
    last_updated_by: "template-author"
    recent_action: "Author phase-3 spec"
    next_safe_action: "Trim redundant enumerations per mode"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/003-trim-duplicates"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 3 — trim duplicated provider/model enumerations

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-07-29 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 3 of 4 |
| **Predecessor** | 002-register-and-wire |
| **Successor** | 004-hub-reconcile-and-validate |
| **Handoff Criteria** | Redundant enumerations trimmed; each mode SKILL.md still self-sufficient to dispatch; JSON routing tokens untouched |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 3** of the per-mode provider/model reference decomposition — the highest-risk phase.

**Scope Boundary**: Trim redundant model enumerations only. Never remove a mode's default model or its runnable invocation shape. Never touch advisor-routing JSON model tokens.

**Dependencies**:
- Phase 2 complete (pointers resolve, leaves registered)

**Deliverables**:
- Trimmed `cli-reference.md` model sections (compact residue + pointer) per mode
- Trimmed `SKILL.md` rosters (default + invocation + parse table + pointer) per mode

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Now that each mode has a dedicated `providers-and-models.md`, the exhaustive model enumerations still living in that mode's `cli-reference.md` model section and `SKILL.md` roster are redundant duplicates that will drift out of sync.

### Purpose
Trim the redundant enumerations to a compact residue (the mode's own default + effort mechanism + a pointer to the dedicated file), keeping every mode self-sufficient enough to dispatch without opening the pointer, and never touching functional advisor-routing tokens.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Trim each mode's `cli-reference.md` model section: remove cross-mode framing and exhaustive slug restatements that only echo the new file; keep default + effort ceiling/mechanism + mode-specific mechanics + pointer
- Trim each mode's `SKILL.md` roster to: default model + effort + one-shot invocation shape + the parse table + a prominent pointer
- Grep-sweep `integration-patterns.md` / `assets/prompt-templates.md` / `agent-delegation.md` for any standalone enumeration table (remove only that; keep runnable pins)

### Out of Scope
- Any edit to `description.json`, `graph-metadata.json`, `hub-router.json` model tokens (functional advisor-routing signal — PRESERVED)
- Removing mode-specific safety content (e.g. cursor's 10-id allowlist stays inline)

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `cli-external-orchestration/cli-*/references/cli-reference.md` | Modify | Trim model section to residue + pointer (×6) |
| `cli-external-orchestration/cli-*/SKILL.md` | Modify | Trim roster to compact residue (×6) |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Self-sufficiency preserved | After trim, each mode's `SKILL.md` still literally contains a concrete default model id AND a runnable invocation shape |
| REQ-002 | Advisor tokens untouched | `git diff` shows zero changes to model tokens in `description.json`/`graph-metadata.json`/`hub-router.json` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Mode-specific mechanics retained inline | opencode auth pre-flight, codex `-c` syntax, cursor 10-id allowlist remain in their `cli-reference.md` |
| REQ-004 | Runnable example pins preserved | `integration-patterns.md`/`prompt-templates.md` examples still name a model |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Per-mode self-sufficiency grep passes (default + invocation present in each SKILL.md)
- **SC-002**: Advisor routing smoke still resolves provider-named prompts to the correct mode
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Over-trim breaks dispatch self-sufficiency | High | Keep default+invocation+pointer residue; per-mode gate after each trim |
| Risk | Accidental edit to JSON routing tokens | High | Explicitly exclude the three JSON files; verify with `git diff` |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None open.
<!-- /ANCHOR:questions -->

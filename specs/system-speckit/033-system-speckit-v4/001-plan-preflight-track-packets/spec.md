---
title: "Feature Specification: Plan-Preflight Nested Packet Resolution"
description: "The /speckit:plan Step-5 prerequisite helper resolves the feature dir from the git branch and hard-rejects any non-NNN branch, so it cannot target a track-nested packet such as specs/anobel.com/008-disable-cookie-modal. This blocks planning on the current nested spec-folder convention."
trigger_phrases:
  - "plan preflight nested packet"
  - "check-prerequisites nested path"
  - "specify feature track packet"
  - "speckit plan not on a feature branch"
  - "feature dir resolution release branch"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/034-plan-preflight-nested-packet-resolution"
    last_updated_at: "2026-08-15T13:28:53Z"
    last_updated_by: "claude-code"
    recent_action: "Guarded check_feature_branch behind the SPECIFY_FEATURE override; verified nested resolution"
    next_safe_action: "Commit and push to origin/skilled/v4.0.0.0"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/scripts/setup/check-prerequisites.sh"
      - ".opencode/skills/system-spec-kit/scripts/common.sh"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-15-system-speckit-034-plan-preflight"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Nested prefix auto-search was rejected: matching a bare NNN prefix across tracks is ambiguous; an explicit track-qualified target is deterministic."
---
# Feature Specification: Plan-Preflight Nested Packet Resolution

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-08-15 |
| **Branch** | `skilled/v4.0.0.0` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The `/speckit:plan` Step-5 prerequisite helper (`check-prerequisites.sh`) derives the feature directory from the current git branch via `common.sh`, then hard-rejects any branch that does not match `^[0-9]{3}-`. On a release or non-feature branch (for example `skilled/v4.0.0.0`) it exits with `ERROR: Not on a feature branch` before any validation runs, and its branch-prefix resolver only globs top-level `specs/NNN-*`. As a result it cannot target a track-nested packet such as `specs/anobel.com/008-disable-cookie-modal`, which is the current nested spec-folder convention.

### Purpose
Let the preflight helper target any packet, including track-nested ones, through the existing explicit override without weakening branch validation for the default flow.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Skip `check_feature_branch` when an explicit `SPECIFY_FEATURE` override is set, so an explicitly named packet is honored regardless of the current branch.
- Confirm that a track-qualified `SPECIFY_FEATURE` value resolves to `specs/<value>` and that a wrong or missing target still fails at the existing directory-existence check.

### Out of Scope
- The `029-spec-root-resolution-hardening` resolver-registry redesign - that is a separate, larger effort with a different mechanism.
- Auto-searching nested `specs/**/NNN-*` by bare numeric prefix - ambiguous across tracks, so an explicit track-qualified target is used instead.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| .opencode/skills/system-spec-kit/scripts/setup/check-prerequisites.sh | Modify | Guard the branch-validation call behind the explicit `SPECIFY_FEATURE` override |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The helper resolves and validates a track-nested packet via an explicit override | `SPECIFY_FEATURE="anobel.com/008-disable-cookie-modal" check-prerequisites.sh --paths-only` prints the correct `FEATURE_DIR` and exits 0; `--validate-strict` runs `validate.sh --strict` on that packet |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | No regression to the default branch-based flow | With no override set, a non-feature branch still fails with `Not on a feature branch`; a bad explicit target still fails at the directory-existence check |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A track-nested packet passes the Step-5 preflight (`--validate-strict` exit 0) through the explicit override.
- **SC-002**: The default branch-validation behavior is unchanged when no override is set.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | An explicit override with a typo skips branch validation | Low | The existing directory-existence check fails loudly with the missing path |
| Dependency | `common.sh` `find_feature_dir_by_prefix` | Resolver already returns `specs/<value>` for non-NNN values | No change required; covered by REQ-001 evidence |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. The explicit-override approach is verified and the resolver already supports track-qualified paths.
<!-- /ANCHOR:questions -->

---

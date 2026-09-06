---
title: "Implementation Plan: Plan-Preflight Nested Packet Resolution"
description: "Guard the check_feature_branch call in check-prerequisites.sh behind the existing SPECIFY_FEATURE override so an explicitly named packet (including track-nested ones) is honored regardless of the current branch, with no change to the default branch flow."
trigger_phrases:
  - "plan preflight nested packet plan"
  - "check-prerequisites override guard"
  - "specify feature branch validation skip"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/034-plan-preflight-nested-packet-resolution"
    last_updated_at: "2026-08-15T13:28:53Z"
    last_updated_by: "claude-code"
    recent_action: "Implemented and verified the override guard"
    next_safe_action: "Commit and push to origin/skilled/v4.0.0.0"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/scripts/setup/check-prerequisites.sh"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-15-system-speckit-034-plan-preflight"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Plan-Preflight Nested Packet Resolution

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Bash |
| **Framework** | system-spec-kit setup scripts |
| **Storage** | None |
| **Testing** | Shell invocation + `validate.sh` exit codes |

### Overview
The preflight helper already accepts a `SPECIFY_FEATURE` override that flows into `get_current_branch`, and `find_feature_dir_by_prefix` already returns `specs/<value>` for any non-NNN value (a track-qualified path). The only barrier is `check_feature_branch`, which rejects the override before resolution. Guarding that one call behind the presence of an explicit override unblocks track-nested packets with no change to the default branch flow.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] Tests passing (shell invocation + validate exit codes)
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Explicit-override short-circuit around a branch-convention guard.

### Key Components
- **check-prerequisites.sh**: entry point; the only caller of `check_feature_branch`.
- **common.sh**: defines `get_current_branch` (honors `SPECIFY_FEATURE`), `find_feature_dir_by_prefix` (returns `specs/<value>` for non-NNN values), and `check_feature_branch` (the NNN-branch gate).

### Data Flow
`SPECIFY_FEATURE` -> `get_current_branch` -> `find_feature_dir_by_prefix` -> `FEATURE_DIR`. The branch gate is skipped when the override is present; a bad target still fails at the directory-existence check.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| check-prerequisites.sh | Sole caller of `check_feature_branch`; resolves and validates the packet | update (guard the call behind the override) | `bash -n`; `--paths-only` and `--validate-strict` with `SPECIFY_FEATURE` set |
| common.sh `find_feature_dir_by_prefix` | Resolver that maps a value to a spec dir | unchanged (already returns `specs/<value>` for non-NNN input) | `--paths-only` prints the correct `FEATURE_DIR` |
| common.sh `check_feature_branch` | NNN-branch gate | unchanged (still enforced when no override) | no-override run still errors `Not on a feature branch` |
| speckit-plan/implement/complete assets | Invoke the helper as `--json --paths-only` | not a consumer of new behavior (env-driven, no arg change) | existing invocation unchanged |

Required inventories:
- Consumers of the resolution functions: `rg -n 'get_feature_paths|find_feature_dir_by_prefix|check_feature_branch' .opencode/skills/system-spec-kit/scripts` returns only `common.sh` and `check-prerequisites.sh`.
- Invariant: an explicit override is authoritative; branch validity is irrelevant when the operator has named a concrete packet. A wrong or missing target must still fail loudly (directory-existence check).
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Confirmed blast radius (only two files reference the resolution functions)
- [x] Reproduced the failure on `skilled/v4.0.0.0` and via the override

### Phase 2: Core Implementation
- [x] Guard `check_feature_branch` behind `[[ -z "${SPECIFY_FEATURE:-}" ]]`
- [x] Durable WHY comment explaining why an explicit override bypasses branch validation

### Phase 3: Verification
- [x] `bash -n` clean
- [x] Nested packet resolves and `--validate-strict` exits 0
- [x] No-override run still blocks a non-feature branch
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Syntax | check-prerequisites.sh | `bash -n` |
| Behavior | nested resolution + strict validation | `SPECIFY_FEATURE=... check-prerequisites.sh --paths-only / --validate-strict` |
| Regression | default branch gate | `check-prerequisites.sh --paths-only` with no override |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| common.sh resolver | Internal | Green | None; already supports track-qualified paths |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The guard causes an unexpected preflight bypass in the default flow.
- **Procedure**: Revert the single guarded block in `check-prerequisites.sh` back to the unconditional `check_feature_branch` call. No data or state to unwind.
<!-- /ANCHOR:rollback -->

---

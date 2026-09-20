---
title: "Feature Specification: Phase 5: verify-and-rollout"
description: "Terminal verification gate for the GitKraken MCP integration packet: recursive strict spec-kit validation, JSON/typecheck/vitest confirmation, live Code Mode discovery check, and parent rollup."
trigger_phrases:
  - "gitkraken mcp verify"
  - "gitkraken packet rollout"
  - "phase 005 verify-and-rollout"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-git/014-gitkraken-mcp-integration/005-verify-and-rollout"
    last_updated_at: "2026-07-15T04:22:47Z"
    last_updated_by: "claude"
    recent_action: "Ran the terminal verification gate across all 4 prior phases"
    next_safe_action: "Roll up the parent packet to Complete"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-005-verify-and-rollout"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "gitkraken is not yet visible to Code Mode's list_tools/search_tools in this running session because .utcp_config.json is read at server start, not hot-reloaded — a new session/server restart is required to pick it up. This is expected, not a defect."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 5: verify-and-rollout

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-07-10 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 5 of 5 |
| **Predecessor** | 004-advisor-routing-update |
| **Successor** | None |
| **Handoff Criteria** | `validate.sh --recursive --strict` passes 0 errors/0 warnings across parent + all 5 phases; parent rolled up to Complete |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Phases 001-004 each verified their own scope in isolation. Nothing yet confirms the packet as a whole is internally consistent (spec-kit template compliance across every phase), that the actual runtime surfaces (Code Mode, the advisor) behave as documented, or that the parent packet's status reflects reality.

### Purpose
Run one terminal gate across the whole packet, honestly report what passes and what has a known limitation, and roll the parent up to Complete only once that gate is genuinely clean.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `validate.sh --recursive --strict` across the parent and all 5 phase folders.
- Re-confirming `.utcp_config.json` JSON validity and `sk-git/graph-metadata.json` JSON validity as a final sweep.
- A live Code Mode `list_tools`/`search_tools` check for the `gitkraken` manual.
- Parent `graph-metadata.json` rollup (`status: complete`, `last_active_child_id: 005`).

### Out of Scope
- Any further content changes to phases 001-004 beyond what their own verification already covered.
- Committing or pushing — left to the user's explicit instruction.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `005-verify-and-rollout/*` | Create | This phase's own spec docs |
| `../graph-metadata.json` | Modify | Roll up parent status to complete |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### REQ-001: Recursive strict spec-kit validation
Run `validate.sh --recursive --strict` from the parent folder and confirm 0 errors across parent + 5 phases.

### REQ-002: Config/metadata JSON re-check
Re-parse `.utcp_config.json` and `sk-git/graph-metadata.json` one final time as a sanity sweep independent of the per-phase checks already done.

### REQ-003: Live Code Mode discovery check
Call `list_tools`/`search_tools` and report honestly whether `gitkraken.*` tools are visible in the CURRENT session, documenting the restart requirement if not.

### REQ-004: Parent rollup
Update the parent's `graph-metadata.json` (`derived.status: "complete"`, `derived.last_active_child_id: "005"`) once the gate is clean.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `validate.sh --recursive --strict` reports 0 errors and 0 warnings across the parent and all 5 phases.
- **SC-002**: The parent packet's `graph-metadata.json` accurately reflects `status: complete` with all 5 children linked.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phases 001-004 all individually complete and validated | A gap in any prior phase would surface here as a recursive validation failure | Each prior phase already ran its own `validate.sh` pass before this phase started |
| Risk | Code Mode's `.utcp_config.json` is read at server start, so the new `gitkraken` manual is invisible in the CURRENT session | Could be mistaken for a broken registration if not explained | Documented explicitly as a known limitation requiring a session/server restart, not treated as a failure |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None outstanding.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:testing -->
## 8. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Recursive strict validate | Whole packet | `validate.sh --recursive --strict` |
| JSON re-check | Config + metadata | `python3 -m json` |
| Live discovery check | Code Mode manual visibility | `list_tools`, `search_tools` |
<!-- /ANCHOR:testing -->

---

## RELATED DOCUMENTS

- **Plan**: See `plan.md`
- **Tasks**: See `tasks.md`
- **Implementation Summary**: See `implementation-summary.md`
- **Predecessor**: See `../004-advisor-routing-update/spec.md`

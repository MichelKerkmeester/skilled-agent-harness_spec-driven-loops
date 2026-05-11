---
title: "Verification Checklist: auto-mode-contract generalization"
description: "Verification checklist for 11-command migration + 12 live :auto dispatch verifications."
trigger_phrases:
  - "auto mode contract generalization"
importance_tier: "important"
contextType: "validation"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/skilled-agent-orchestration/103-spec-kit-auto-mode-noninteractive-contract/002-auto-mode-contract-generalization-to-all-commands"
    last_updated_at: "2026-05-11T12:35:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored checklist"
    next_safe_action: "Mark items as verification completes"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "103-002-auto-mode-contract-generalization"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Verification Checklist: auto-mode-contract generalization

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Requirements documented in spec.md.
- [ ] CHK-002 [P0] Technical approach defined in plan.md.
- [ ] CHK-003 [P1] Dependencies identified (shared contract exists; CLIs available; YAML consumers verified).
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] No invalid markdown or broken anchor in any migrated command.
- [ ] CHK-011 [P0] No YAML asset rejected the resolved config shape (live dispatches pass).
- [ ] CHK-012 [P1] Each per-command Default Resolution Table has all four required columns.
- [ ] CHK-013 [P1] Each per-command PRE-BOUND SETUP ANSWERS field list matches the Default Resolution Table.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] 12 live `:auto` dispatch evidence files exist.
- [ ] CHK-021 [P0] Each evidence file has a verdict footer (PASS / PARTIAL / FAIL / SKIP).
- [ ] CHK-022 [P1] ≥10/12 PASS verdicts.
- [ ] CHK-023 [P1] PARTIAL/FAIL cases documented with finding-class + remediation path.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Finding classified as `cross-consumer` — shared contract + 12 consuming commands.
- [ ] CHK-FIX-002 [P0] Producer inventory: only the shared contract defines the three-tier semantics; each command provides command-specific tables.
- [ ] CHK-FIX-003 [P0] Consumer inventory: 12 commands + their paired YAMLs verified.
- [ ] CHK-FIX-004 [P0] Not applicable (no security/parser/redaction changes).
- [ ] CHK-FIX-005 [P1] Matrix axes: (command × verdict) = 12 cells; documented in implementation-summary.
- [ ] CHK-FIX-006 [P1] Hostile env variant: stdin closed (`</dev/null`) tested for every live dispatch.
- [ ] CHK-FIX-007 [P1] Evidence pinned to commit SHA after final pass.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No secrets/tokens/keys persisted in any evidence file.
- [ ] CHK-031 [P0] All live-dispatch outputs land in `/tmp/` only (never `.opencode/skills/`, `.opencode/agents/`, or production spec folders).
- [ ] CHK-032 [P1] Each command's live-dispatch prompt forbids writes outside `/tmp/`.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] spec.md / plan.md / tasks.md / checklist.md / implementation-summary.md synchronized.
- [ ] CHK-041 [P1] Shared contract doc citation present in every migrated command's §0.
- [ ] CHK-042 [P2] Argument-hint frontmatter updated in every migrated command.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] All evidence files under `002/evidence/` only.
- [ ] CHK-051 [P1] `scratch/` cleaned before completion.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 0/12 |
| P1 Items | 8 | 0/8 |
| P2 Items | 1 | 0/1 |

**Verification Date**: [YYYY-MM-DD]
<!-- /ANCHOR:summary -->

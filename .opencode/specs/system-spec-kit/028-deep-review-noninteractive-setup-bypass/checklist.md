---
title: "Verification Checklist: deep-review :auto non-interactive setup bypass"
description: "Verification checklist for /spec_kit:deep-review:auto stdin-hang fix."
trigger_phrases:
  - "deep-review setup hang"
  - "F-Stage-E-001"
importance_tier: "important"
contextType: "validation"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/system-spec-kit/028-deep-review-noninteractive-setup-bypass"
    last_updated_at: "2026-05-11T11:35:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored checklist"
    next_safe_action: "Mark items as verification completes"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "028-deep-review-noninteractive-setup-bypass"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Verification Checklist: deep-review :auto non-interactive setup bypass

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
- [ ] CHK-003 [P1] Dependencies identified (command + YAML + CLI binaries available).
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] No invalid markdown / broken anchor in deep-review.md after edit.
- [ ] CHK-011 [P0] No YAML parse errors in spec_kit_deep-review_auto.yaml if touched.
- [ ] CHK-012 [P1] Pre-binding marker block has unambiguous syntax — no collision with existing convention.
- [ ] CHK-013 [P1] Fail-fast error message clearly names every missing input.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] Codex exec non-interactive dispatch loads YAML workflow without setup question.
- [ ] CHK-021 [P0] Opencode run --pure non-interactive dispatch loads YAML workflow without setup question.
- [ ] CHK-022 [P0] `:auto` with empty args exits non-zero within 10s with named-missing-inputs error.
- [ ] CHK-023 [P1] `:confirm` mode regression check: still emits question block.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Finding classified: `cross-consumer` — fix lives in command markdown, consumed by YAML workflow.
- [ ] CHK-FIX-002 [P0] Same-class producer inventory: deep-review.md is the only producer of setup-resolution for this command.
- [ ] CHK-FIX-003 [P0] Consumer inventory: YAML workflow + `deep-review-config.json` shape verified consistent across both branches.
- [ ] CHK-FIX-004 [P0] Not applicable (no security/parser/redaction changes).
- [ ] CHK-FIX-005 [P1] Matrix axes: (mode × inputs-resolved-state) = 4 cells (auto+resolved, auto+missing, confirm+resolved, confirm+missing); all tested.
- [ ] CHK-FIX-006 [P1] Hostile env variant: stdin closed (`</dev/null`) explicitly tested.
- [ ] CHK-FIX-007 [P1] Evidence pinned to commit SHA after final pass.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No secrets/tokens/keys handled.
- [ ] CHK-031 [P0] Pre-binding marker parser cannot introduce arbitrary command execution.
- [ ] CHK-032 [P1] Failure paths do not leak sensitive state into stderr/transcripts.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] spec.md / plan.md / tasks.md / checklist.md / implementation-summary.md synchronized.
- [ ] CHK-041 [P1] Command argument-hint references the new non-interactive path.
- [ ] CHK-042 [P2] CLAUDE.md or other surface mentions the new bypass capability (defer unless explicitly desired).
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Verification dispatch transcripts stored under packet `evidence/` only.
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

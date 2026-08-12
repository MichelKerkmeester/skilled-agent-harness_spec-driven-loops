---
title: "Spec: Adapter Live-Delivery Verification"
description: "Historical adapter-verification plan retained for provenance. Its discovery-symlink diagnosis and deletion plan were invalid; phase 018 supersedes all execution and owns the complete remediation."
status: "blocked"
completion_pct: 0
trigger_phrases:
  - "adapter live delivery verification"
  - "codex cursor devin hook wiring"
  - "false negative playbook verdict"
importance_tier: "high"
contextType: "spec"
parent: "hooks/002-injection-bloat-reduction"
predecessor: "016-directive-playbook-alignment"
successor: "018-fix-code-review-p0-p3-findings-for-directive-lifecycle-delivery"
_memory:
  continuity:
    packet_pointer: "hooks/002-injection-bloat-reduction/017-adapter-live-delivery-verification"
    last_updated_at: "2026-08-11T14:00:00Z"
    last_updated_by: "pi"
    recent_action: "Blocked the invalid deletion plan and handed all remediation to phase 018"
    next_safe_action: "Continue only from phase 018; do not execute phase 017 tasks"
    blockers:
      - "Superseded by phase 018"
    completion_pct: 0
    key_files:
      - "spec.md"
      - "../018-fix-code-review-p0-p3-findings-for-directive-lifecycle-delivery/spec.md"
    session_dedup:
      fingerprint: "sha256:04c9f3b2f9da56c6a7dd106c0dca99a2ce2f2785ebbbca96039c2199ec96c862"
      session_id: "2026-08-11-adapter-live-delivery-verification"
      parent_session_id: null
    open_questions: []
    answered_questions:
      - "Discovery paths are intentional symlinks and must be preserved"
---
# Spec: Adapter Live-Delivery Verification

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

> **SUPERSEDED — DO NOT EXECUTE.** Phase 018 replaces this plan. In particular, do not delete or replace the Claude, Codex, Cursor, or Devin user-prompt discovery symlinks.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Status** | Planned — blocked and superseded |
| **Supersession** | Phase 018 is the sole active successor |
| **Completion** | 0% |
| **Parent** | `hooks/002-injection-bloat-reduction` |
| **Predecessor** | `016-directive-playbook-alignment` |
| **Successor** | `018-fix-code-review-p0-p3-findings-for-directive-lifecycle-delivery` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

This phase was created from a false diagnosis that treated `.codex/.cursor/.devin/hooks/user-prompt-submit.js` as stale regular-file copies with dead imports. They are intentional discovery symlinks resolving to the live registered system-spec-kit adapters. Directly executing a symlinked module can also trigger an entrypoint guard, so zero output does not prove dead wiring.

The phase also blurred adapter-driven cadence with native host delivery and proposed corrected PASS records before durable, repository-relative evidence and clean provenance existed. Cursor host-event delivery remains dormant or unconfirmed even though its adapter can pass a registered-path probe.

### Purpose

Retain the invalid diagnosis as a historical boundary, prohibit its destructive instructions, and hand every correctness, security, adapter-parity, evidence, and metadata finding to phase 018.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Preserve this packet as a superseded historical record.
- Preserve every existing runtime discovery symlink.
- Point all remediation and proof work to phase 018.

### Out of Scope

- Deleting, replacing, or repairing discovery symlinks.
- Editing directive-lifecycle runtime code, tests, scenarios, benchmark records, or host registrations.
- Claiming native-host delivery from adapter-driven or registered-path evidence.
- Executing any former phase-017 cleanup or PASS-record task.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Preserve all runtime discovery symlinks. | Phase 017 contains no executable deletion instruction; phase 018 requires `test -L`, `readlink`, and `realpath` evidence. |
| REQ-002 | Prevent this superseded packet from authorizing implementation. | Status is blocked, successor is phase 018, and every task is canceled. |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Keep evidence classes honest. | Adapter-driven and registered-path observations are not presented as native-host delivery; Cursor native delivery remains unconfirmed. |
| REQ-004 | Hand all findings to phase 018. | The successor packet covers lifecycle correctness, store security, adapter parity, durable evidence, and repository-truth reconciliation. |
| REQ-005 | Keep phase 017 non-executable. | No task, checklist item, or plan step authorizes a runtime, test, scenario, report, or registration mutation. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: No phase-017 instruction can be read as authorization to delete a discovery symlink.
- **SC-002**: Parent metadata and this packet identify phase 018 as the active successor.
- **SC-003**: Historical adapter observations remain explicitly weaker than native-host receipts.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Risk | Mitigation |
|------|------------|
| An operator follows the obsolete deletion plan | Block the packet, cancel every task, and repeat the preservation rule in all phase-017 docs. |
| Historical PASS language is mistaken for native-host proof | Label it unverified historical adapter evidence and defer classification to phase 018. |
| The superseded record is erased | Keep the packet and its causal correction; do not delete the folder. |

**Dependency**: phase 018 is the sole implementation and verification successor.
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None. Phase 018 owns all further decisions and evidence.
<!-- /ANCHOR:questions -->

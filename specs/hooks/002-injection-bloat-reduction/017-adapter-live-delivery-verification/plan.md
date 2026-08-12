---
title: "Plan: Adapter Live-Delivery Verification"
description: "Superseded historical plan. No phase-017 implementation is authorized; phase 018 preserves the discovery symlinks and owns the full remediation and evidence program."
status: "blocked"
completion_pct: 0
trigger_phrases:
  - "adapter live delivery verification plan"
  - "017 plan"
importance_tier: "high"
contextType: "plan"
parent: "hooks/002-injection-bloat-reduction"
predecessor: "016-directive-playbook-alignment"
successor: "018-fix-code-review-p0-p3-findings-for-directive-lifecycle-delivery"
_memory:
  continuity:
    packet_pointer: "hooks/002-injection-bloat-reduction/017-adapter-live-delivery-verification"
    last_updated_at: "2026-08-11T14:00:00Z"
    last_updated_by: "pi"
    recent_action: "Canceled phase 017 execution after the discovery-symlink diagnosis was disproved"
    next_safe_action: "Execute the approved phase 018 baseline before any runtime edit"
    blockers:
      - "Superseded by phase 018"
    completion_pct: 0
    key_files:
      - "spec.md"
      - "tasks.md"
      - "../018-fix-code-review-p0-p3-findings-for-directive-lifecycle-delivery/plan.md"
    session_dedup:
      fingerprint: "sha256:c6920b57b418ab503016211b844839c82fd3ef5c2265b960d5d64269053c4223"
      session_id: "2026-08-11-adapter-live-delivery-verification"
      parent_session_id: null
    open_questions: []
    answered_questions:
      - "The deletion plan is canceled"
---
# Plan: Adapter Live-Delivery Verification

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

> **SUPERSEDED — DO NOT EXECUTE.** Phase 018 is the only active remediation plan. Preserve every runtime discovery symlink.

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

The former plan misclassified intentional runtime discovery symlinks as stale copies and over-promoted adapter probes to live host evidence. That diagnosis is invalid. The registered system-spec-kit adapters remain the canonical execution targets, but their cadence does not by itself prove that each host fired and delivered the hook.

### Overview

No implementation remains in phase 017. Its only valid action is a safe handoff to phase 018, which covers high-water correctness, host lifecycle invalidation, store security, identity confirmation, adapter parity, evidence taxonomy, durable benchmark provenance, and phases 014-018 reconciliation.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

Not applicable. This packet is blocked and superseded.

### Definition of Done

- [x] The obsolete deletion plan is canceled. Evidence: `spec.md` scope and `tasks.md` cancellation register.
- [x] Phase 018 is the explicit successor. Evidence: frontmatter and parent phase map.
- [x] Discovery symlink preservation is a hard prerequisite. Evidence: `spec.md` REQ-001.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Preserved Ground Truth

```text
runtime discovery/config path
  -> registered system-spec-kit runtime adapter
  -> shared Claude-shaped shim
  -> system-skill-advisor directive-lifecycle consumer
```

A path-level or injected adapter probe proves only its declared evidence class. A native-host-delivered claim additionally requires a real host receipt. Phase 017 may not upgrade one class into another.

### Protected Surface

The `.claude`, `.codex`, `.cursor`, and `.devin` user-prompt discovery paths remain symlinks. No phase-017 step may delete, replace, or convert them to regular files.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Supersession

- [x] Record the incorrect discovery-symlink diagnosis.

### Phase 2: Cancellation

- [x] Cancel all cleanup, retargeting, PASS-record, live-fire, and test tasks in this packet.

### Phase 3: Handoff

- [x] Hand remediation to phase 018.

There is no phase-017 runtime implementation or evidence-verification phase.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Phase 017 claims no current test result. Phase 018 must capture a durable baseline, label unit/adapter-driven/registered-path/native-host evidence separately, preserve symlinks, and compare the identical whole-gate manifest after implementation.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- Active successor: `../018-fix-code-review-p0-p3-findings-for-directive-lifecycle-delivery/`.
- Protected inputs: the four runtime discovery symlinks and immutable historical benchmark folders.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

No phase-017 mutation is authorized, so there is nothing to roll back. If a former phase-017 instruction was executed, stop, restore the affected symlink or artifact from the captured checkout state, and continue only under phase 018's baseline and proof contract.
<!-- /ANCHOR:rollback -->

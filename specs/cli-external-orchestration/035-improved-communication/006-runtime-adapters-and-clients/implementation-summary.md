---
title: "Implementation Status: Phase 006 Runtime Adapters and Clients"
description: "Phase 006 is scaffolded as a Level 3 implementation packet; implementation has not started."
trigger_phrases:
  - "runtime-adapters-and-clients"
  - "implementation status"
  - "current state"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/035-improved-communication/006-runtime-adapters-and-clients"
    last_updated_at: "2026-08-12T04:14:38Z"
    last_updated_by: "codex"
    recent_action: "Received the verified Phase 005 provider and privacy handover."
    next_safe_action: "Approve the Phase 006 architecture, then execute T001."
    blockers:
      - "Project-owner approval of the Proposed architecture decision is not yet recorded."
    key_files:
      - "implementation-summary.md"
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "specs/cli-external-orchestration/035-improved-communication/005-provider-adapters-and-privacy/handover.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-006-scaffold-20260811"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Phase purpose, boundary, dependencies, and handoff are defined."
      - "Phase 005 is complete with a verified 89-test provider/privacy baseline."
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Status: Phase 006 Runtime Adapters and Clients

<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 006-runtime-adapters-and-clients |
| **Status** | Draft |
| **Implementation** | Not started |
| **Level** | 3 |
| **Scaffolded** | 2026-08-11 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

No runtime or client implementation has been built in this phase. The current artifact is an implementation-ready Level 3 packet covering integration of the projection core with six CLIs through their safest supported event and presentation boundaries.

The authored artifacts `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, and `decision-record.md` define eight requirements, six acceptance scenarios, the architecture and rollback, an executable task sequence, and completion gates. All implementation and release checks remain pending unless the checklist records direct evidence.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The scaffold was derived from the completed Phase 001 synthesis, the parent phase map, and the verified Phase 005 provider/privacy handover. Spec-kit Level 3 templates provide the document contract; phase-specific content replaces template placeholders. Implementation must proceed through the task and checklist gates.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Use client-owned presentation whenever native interception is not explicitly safe | It preserves canonical state and gives every unsupported or failed case an explicit safe outcome. |
| Keep implementation status Draft | No code, runtime integration, provider call, or implementation test has been completed in this phase. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Level 3 document inventory | Required as the scaffold handoff gate |
| Phase-specific placeholder scan | Required as the scaffold handoff gate |
| Strict packet validation | Run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh specs/cli-external-orchestration/035-improved-communication/006-runtime-adapters-and-clients --strict` before handoff |
| Phase 005 predecessor | PASS: provider/privacy handover and 89-test package baseline are available |
| Implementation tests | Not run; implementation has not started |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Implementation absent**: All code, tests, integrations, packaging, and runtime behavior described here remain to be built.
2. **Proposed paths**: Package paths may be refined during boundary preflight, but the phase scope and contracts are frozen unless the parent map is explicitly revised.
3. **External drift**: Runtime and provider capabilities must be revalidated against pinned versions before release.
<!-- /ANCHOR:limitations -->

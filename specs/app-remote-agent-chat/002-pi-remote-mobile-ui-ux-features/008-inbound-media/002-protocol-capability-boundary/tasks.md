---
title: "Tasks: Phase 1 — Protocol and pre-stdout capability boundary [template:level-2/tasks.md]"
description: "Task breakdown for the protocol contract, host seam, compatibility branch, and verification harness."
trigger_phrases:
  - "protocol tasks"
  - "host seam tasks"
  - "inbound media phase one tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "apps/pi-remote/002-pi-remote-mobile-ui-ux-features/008-inbound-media/002-protocol-capability-boundary"
    last_updated_at: "2026-08-16T00:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Scaffolded phase docs from implementation-phases.md"
    next_safe_action: "Implement and verify this phase"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks — Protocol and pre-stdout capability boundary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- ANCHOR:notation -->
## Task Notation

The checkbox list below carries the concrete tasks from the phase source.
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

The protocol and host package setup is included in the tasks below.
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

The contract, seam, compatibility, and workspace tasks are included below.
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

Verification is defined in the companion plan and checklist.
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

All concrete tasks below must be addressed before this phase is shippable.
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

See `spec.md`, `plan.md`, and `checklist.md` in this folder.
<!-- /ANCHOR:cross-refs -->

- [ ] Change `packages/pi-rpc-protocol/src/types.ts` to add `InboundImageBlock`, the processing/ready/terminal unions, artifact descriptors, safe presentation metadata, and exact redaction/share fields.
- [ ] Change `packages/pi-rpc-protocol/src/guards.ts` to validate the union with strict exact-key checks, bounded safe text, opaque IDs, digests, dimensions, timestamps, MIME types, and availability/content consistency.
- [ ] Change `packages/pi-rpc-protocol/src/index.ts` to export the new types and guards.
- [ ] Extend `packages/pi-rpc-protocol/tests/guards.test.ts` with valid lifecycle fixtures, unknown-field rejection, path/URL/base64/OCR rejection, malformed digest/revision tests, bounds, and old transcript fixtures.
- [ ] Add `extensions/pi-remote-inbound-media/package.json`, `tsconfig.json`, `src/index.ts`, and `tests/publisher-boundary.test.ts` as the isolated host adapter seam; expose no capability when the seam is unavailable.
- [ ] Review `extensions/pi-remote-plan/src/index.ts` and the host policy contract so Plan mode remains read-only and capture authority remains on the host.
- [ ] Add the minimal web compatibility branch in `apps/pi-remote-web/src/state.ts` and `apps/pi-remote-web/src/App.tsx` so an inbound image received by an old or not-yet-enabled client renders the existing unsupported/redacted row.
- [ ] Add a disabled/unsupported lifecycle fixture to `apps/pi-remote-web/src/demo.ts` and the initial `scripts/inbound-media-cdp.mjs` harness for light and dark 390px screenshots.
- [ ] Add root workspace wiring only for the new extension package and CDP runner; add no binary fixture and modify no application transport limit.

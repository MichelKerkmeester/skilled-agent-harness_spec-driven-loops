---
title: "Implementation Summary: Approval, Containment, and Remote Mutation"
description: "Implemented protected-mutation authority loop, approval leases, lifecycle drains, final gate, and containment profile; live boundaries remain pending."
trigger_phrases:
  - "pi remote approval and remote mutation"
  - "pi mobile phase 6"
  - "approval and remote mutation"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "apps/pi-remote/001-pi-remote-mobile-agent-like-cc/006-approval-and-remote-mutation"
    last_updated_at: "2026-08-13T16:35:13Z"
    last_updated_by: "gpt-5.6-sol"
    recent_action: "Reconciled the implemented authority loop and lifecycle hardening"
    next_safe_action: "Verify live Pi extension and protected runner under macOS containment before enabling mutation"
    blockers:
      - "Live Pi extension handler ordering remains operator-unverified"
      - "Protected execution under macOS sandbox-exec remains operator-unverified"
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "decision-record.md"
      - "implementation-summary.md"
    completion_pct: 85
---

# Implementation Summary

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 006-approval-and-remote-mutation |
| **Implemented** | Authority loop and containment assets built; live extension and OS execution pending |
| **Level** | 3+ |
| **Status** | Implemented (operator-verification pending) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The built extension requests and consumes exact-action leases over an authenticated per-process loopback capability. The relay enforces canonical digests, first-decision CAS, principal/session/epoch/policy checks, one-action grants, device-revocation drain, family-change drain, in-flight abort, restart invalidation, and default-off mutation.

### Approval, Containment, and Remote Mutation

Implemented surfaces are `.pi/pi-remote/extensions/pi-remote-approval/`, `.pi/pi-remote/apps/pi-remote-relay/src/{approval,policy}/`, migrations through `004-grant-restart-state`, authority-loop tests, and `.pi/pi-remote/deploy/containment/pi-remote.sb`.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Mutation remains off unless startup configuration explicitly selects it and exactly one family. The relay and extension share one canonical action digest and consume authority before execution; live process ordering and containment execution remain outside mock integration proof.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Gate protected tools at Pi's final executable boundary | Use a pinned Pi extension that recomputes a canonical action digest immediately before protected execution and consumes one relay-authorized lease. |
| Keep this phase independently verifiable | A successor must consume named evidence, not infer readiness from aggregate progress. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Approval and authority tests | PASS within the 95-test non-web suite |
| Lifecycle hardening | PASS: device drain, grant invalidation, policy CAS, family drain, migration 004, and restart checks |
| Live Pi extension | OPERATOR-ONLY: UNRUN |
| Real macOS containment | OPERATOR-ONLY: UNRUN |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. Automated tests use a mocked Pi boundary and cannot prove final live handler ordering.
2. The `sandbox-exec` profile exists, but protected execution and abort termination on the target Mac are unverified.
3. Mutation stays default-off and protected-mutation rollout remains NOT-READY.
<!-- /ANCHOR:limitations -->

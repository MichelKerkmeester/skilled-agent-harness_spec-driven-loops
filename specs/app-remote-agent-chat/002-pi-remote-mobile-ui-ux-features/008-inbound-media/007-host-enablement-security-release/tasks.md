---
title: "Tasks: Phase 6 — Approved host enablement, security signoff, and release [template:level-2/tasks.md]"
description: "Task breakdown for production host enablement, policy, end-to-end proof, negative controls, signoff, release, and rollback."
trigger_phrases:
  - "host enablement tasks"
  - "security signoff tasks"
  - "inbound media release tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "apps/pi-remote/002-pi-remote-mobile-ui-ux-features/008-inbound-media/007-host-enablement-security-release"
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
# Tasks — Approved host enablement, security signoff, and release

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- ANCHOR:notation -->
## Task Notation

The checkbox list below carries the concrete tasks from the phase source.
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

Host allowlist, policy, and release-gate setup is included below.
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

End-to-end, production hygiene, negative-control, and approval tasks are included below.
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

Device, release, no-stray-files, and security verification are defined in the companion checklist.
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

All concrete tasks below must be addressed before this phase is shippable.
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

See `spec.md`, `plan.md`, and `checklist.md` in this folder.
<!-- /ANCHOR:cross-refs -->

- [ ] Finalize `extensions/pi-remote-inbound-media/src/index.ts` source allowlist, capability-handle resolution, host policy checks, Plan-mode behavior, run/turn/block binding, and publisher cleanup.
- [ ] Review and update `extensions/pi-remote-plan/src/index.ts` so Plan mode cannot authorize a new capture or publication from the phone while `artifact:read` remains read-only.
- [ ] Review `apps/pi-remote-relay/src/policy/mutation-policy.ts` and `apps/pi-remote-relay/src/auth/policy.ts` for separate `artifact:publish`/`artifact:read`, default-deny unknown actions, and emergency disable behavior.
- [ ] Add the cli-pi 0.95/0.20 host-to-relay end-to-end fixture and assert pre-stdout interception, processing, ready/withheld settlement, exact-revision read, revocation/expiry, and UI privacy behavior.
- [ ] Add release/kill-switch checks to `scripts/release-verify.mjs` or the existing release gate without logging image bytes, IDs, paths, OCR, digests, URLs, or decoder exceptions.
- [ ] Add production verification for the artifact decoder dependency, network-disabled worker, filesystem permissions, retention job, quota eviction, revocation listener, service-worker activation, CSP, and no-store headers.
- [ ] Run all negative controls in `apps/pi-remote-relay/tests/security/negative-controls.test.ts` and the host publisher suite, including wrong origin/principal/device, stale revision, replayed ticket, path injection, symlink, polyglot, scanner timeout, and forced byte flip.
- [ ] Perform the final authenticated visual comparison against the target Claude iOS and Kimi Code interaction bar without changing fixed ink-on-parchment tokens or adding consumer-app export behavior.
- [ ] Record security-owner approval of source allowlist, redaction detector policy, retention, decoder operations, iOS baseline, App Switcher limitation, and Plan-mode capture semantics before enabling the capability.

---
title: "Implementation Summary: Contract and Threat Baseline"
description: "Implemented protocol, platform, storage, and threat baseline for Pi Remote; rollout verification remains separate."
trigger_phrases:
  - "pi remote contract and threat baseline"
  - "pi mobile phase 1"
  - "contract and threat baseline"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "apps/pi-remote/001-pi-remote-mobile-agent-like-cc/001-contract-and-threat-baseline"
    last_updated_at: "2026-08-13T16:35:13Z"
    last_updated_by: "gpt-5.6-sol"
    recent_action: "Reconciled the implemented contracts and supported baseline"
    next_safe_action: "Use phase 009 for the remaining operator-only release evidence"
    blockers:
      - "No phase-specific implementation blocker; rollout evidence remains tracked in phase 009"
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "decision-record.md"
      - "implementation-summary.md"
    completion_pct: 90
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
| **Spec Folder** | 001-contract-and-threat-baseline |
| **Implemented** | Contracts and baseline implemented under `.pi/pi-remote/`; rollout verification remains separate |
| **Level** | 3+ |
| **Status** | Implemented |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The relocated monorepo contains the shared protocol package, sanitized relay fixtures, numbered better-sqlite3 migrations, security boundaries, and supported-platform documentation that downstream phases consume.

### Contract and Threat Baseline

Implemented surfaces include `.pi/pi-remote/packages/pi-rpc-protocol/`, `.pi/pi-remote/apps/pi-remote-relay/src/fixtures/`, migrations `001` through `004`, and the architecture, security, and platform-support runbooks. The accepted stack and baseline decisions remain in `decision-record.md`.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The implementation followed the fixed TypeScript/PWA stack and macOS/better-sqlite3/iOS baseline, then moved intact into `.pi/pi-remote/`. Shared protocol guards and the whole workspace are covered by the stored release evidence.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Freeze live contracts and trust boundaries before production code | Use a version-pinned contract and threat baseline as the mandatory entry gate for every implementation phase. |
| Keep this phase independently verifiable | A successor must consume named evidence, not infer readiness from aggregate progress. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Shared machine gate | PASS: `.pi/pi-remote/release/evidence/release-verify-v1-2026-08-13T11-59-23-886Z.json` records `machineStatus: PASS` |
| Tests | PASS: 95 non-web tests plus 5 web component tests |
| Type/lint/format/build | PASS: every recorded gate exited 0 |
| Operator-only release gates | Tracked by phases 004, 006, 007, and 009; not claimed by this phase |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. The live Pi extension, real Tailscale Serve, real macOS containment, and physical iOS push gates remain operator-only.
2. The accepted `sandbox-exec` baseline is implemented as a profile, but executing it on the target Mac is not verified here.
3. This implemented baseline does not make any rollout stage ready.
<!-- /ANCHOR:limitations -->

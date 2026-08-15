---
title: "Implementation Summary: Authentication and Tailnet Boundary"
description: "Implemented application authentication, authorization, revocation, loopback trust anchor, and Serve deployment assets; real ingress is pending."
trigger_phrases:
  - "pi remote auth and tailnet boundary"
  - "pi mobile phase 4"
  - "auth and tailnet boundary"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "apps/pi-remote/001-pi-remote-mobile-agent-like-cc/004-auth-and-tailnet-boundary"
    last_updated_at: "2026-08-13T16:35:13Z"
    last_updated_by: "gpt-5.6-sol"
    recent_action: "Reconciled the implemented auth boundary and Serve assets"
    next_safe_action: "Run the real Tailscale Serve ingress matrix before promoting read-only rollout"
    blockers:
      - "Real Tailscale Serve HTTPS/WSS ingress remains operator-unverified"
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
| **Spec Folder** | 004-auth-and-tailnet-boundary |
| **Implemented** | Auth and deployment boundary built; real Tailscale ingress verification pending |
| **Level** | 3+ |
| **Status** | Implemented (operator-verification pending) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The relay implements signed device enrollment, short application sessions, one-use tickets, exact Origin checks, a secret-prefixed loopback Serve anchor, default-deny actions, socket/ticket revocation, and authority drain before device revocation returns.

### Authentication and Tailnet Boundary

Implemented surfaces are `.pi/pi-remote/apps/pi-remote-relay/src/{http,auth}/`, the auth and authority-loop tests, and `.pi/pi-remote/deploy/setup-tailscale-serve.sh` plus `serve.env.example`.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Integration tests exercise enrollment, Origin, ticket reuse, authorization, logout, device revocation, socket closure, and approval-authority drain. Deployment assets configure tailnet-only Serve over loopback.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Use Tailscale for private reachability, not application authority | Expose a loopback relay through Tailscale Serve and require a separate short-lived application session plus per-action authorization. |
| Keep this phase independently verifiable | A successor must consume named evidence, not infer readiness from aggregate progress. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Auth/authority integration | PASS within the 95-test non-web suite |
| Type/lint/format/build | PASS in the latest stored release evidence |
| Real Tailscale Serve ingress | OPERATOR-ONLY: UNRUN |
| Read-only rollout | NOT-READY |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. Real target-tailnet HTTPS/WSS identity, direct-backend rejection, and Funnel absence are unverified.
2. Authentication state is startup-memory local and requires re-enrollment after restart.
3. This phase must not be treated as release-ready until operator evidence passes.
<!-- /ANCHOR:limitations -->

---
title: "Decision Record: Contract and Threat Baseline"
description: "Records the primary architecture choice for contract and threat baseline."
trigger_phrases:
  - "pi remote contract and threat baseline"
  - "pi mobile phase 1"
  - "contract and threat baseline"
importance_tier: "critical"
contextType: "decision"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/041-pi-remote-mobile-agent-like-cc/001-contract-and-threat-baseline"
    last_updated_at: "2026-08-10T18:43:21Z"
    last_updated_by: "codex"
    recent_action: "Authored the approved phase planning packet"
    next_safe_action: "Run this phase's definition-of-ready checks before implementation"
    blockers:
      - "Product implementation for this phase has not started"
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    completion_pct: 0
---

# Decision Record: Contract and Threat Baseline

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Freeze live contracts and trust boundaries before production code

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted for implementation planning |
| **Date** | 2026-08-10 |
| **Deciders** | Operator-approved phase map; technical verification pending |

---

<!-- ANCHOR:adr-001-context -->
### Context

Pins the live Pi, host, ingress, browser, storage, and extension contracts and freezes the threat model before production implementation. The system handles remote code-agent authority and failure states, so the phase needs one explicit design boundary rather than implicit behavior spread across consumers.

### Constraints
- Existing research lineages
- Installed Pi CLI
- Target host and Tailscale
- Operator-selected device resources
- Dependent capability remains disabled when required evidence is missing or failing.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Use a version-pinned contract and threat baseline as the mandatory entry gate for every implementation phase.

**How it works**: Capture the installed runtime behavior, translate it into typed and state-machine contracts, and bind each dangerous assumption to a negative control. Downstream phases consume the frozen artifacts and stop when drift is detected.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Chosen approach** | Bounded ownership and executable evidence | Requires explicit contracts and gates | 9/10 |
| Start with the PWA | Produces visible progress quickly | Builds on unverified protocol and authority assumptions | 2/10 |
| Rely on research reports | Already available | Cannot prove the implementation host or current versions | 3/10 |

**Why this one**: It is the smallest approach that preserves the phase's safety invariant and gives the successor an objective handoff.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- The authority, lifecycle, or evidence boundary has one owner.
- Failed gates keep downstream capability disabled instead of creating ambiguous partial readiness.

**What it costs**:
- More explicit state and verification work. Mitigation: reuse the phase-002 harness and keep evidence machine-readable.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Baseline captures secrets | H | Redact before persistence and scan evidence with canaries |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The approved product cannot safely omit this phase boundary. |
| 2 | **Beyond Local Maxima?** | PASS | Simpler and more permissive alternatives were compared. |
| 3 | **Sufficient?** | PASS | The decision adds only the state, policy, or evidence needed for its invariant. |
| 4 | **Fits Goal?** | PASS | It directly supports private Claude-app-style Pi control. |
| 5 | **Open Horizons?** | PASS | The boundary permits future clients without weakening authority or replay semantics. |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- `packages/pi-rpc-protocol/`: Versioned Pi command, response, event, envelope, and state contracts.
- `tests/pi-remote/fixtures/`: Sanitized recorded RPC and session-layout fixtures.
- `tests/pi-remote/security/`: Threat model, authorization matrix, and negative-control definitions.
- `deploy/pi-remote/baseline/`: Pinned host, Pi, Node, browser, and Tailscale evidence.

**How to roll back**: Discard the baseline artifacts and keep every downstream capability blocked; no production state or Pi session is changed.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Ship an installable PWA (not a native app) on a fixed TypeScript stack
### Metadata
| Field | Value |
|-------|-------|
| **Status** | Accepted for implementation planning |
| **Date** | 2026-08-12 |
| **Deciders** | Operator decision this session; technical verification pending |
<!-- ANCHOR:adr-002-context -->
### Context
The product is a private remote control for the Pi coding agent, used by the operator and possibly a few repository collaborators over a Tailscale tailnet — not a publicly distributed app. Access is: Pi runs locally as a `pi --mode rpc` child; a loopback TypeScript relay supervises it and is exposed tailnet-only via Tailscale Serve; the client reaches it over HTTPS/WSS. The framework and library layer was previously an open question. A UX review found the client also lacks a visual/design layer.
### Constraints
- Distribution is personal/small-team over an existing tailnet
- The browser socket must never be the process/data/authority boundary
- Accessibility is a stated requirement
- The phone still depends on the OS-level Tailscale app for tailnet reachability regardless of client type
<!-- /ANCHOR:adr-002-context -->
<!-- ANCHOR:adr-002-decision -->
### Decision
**We chose**: An installable PWA (service worker, Web App Manifest, Web Push, offline read-only) on a fixed TypeScript stack. Relay: Node + Hono or Fastify + `ws` + better-sqlite3 (single-host durable event ledger). Client: Vite + vite-plugin-pwa + React 19 + Untitled UI React (React Aria + Tailwind CSS, copy-in/own-the-code) + XState (run/approval lifecycle machines) + TanStack Virtual (transcript). Push: web-push/VAPID. Approval step-up: WebAuthn/passkeys. Shared: a platform-agnostic `pi-rpc-protocol` + reducers TS core.
**How it works**: Repo users open a tailnet URL and add to home screen — no App Store, instant updates, works on desktop too. Untitled UI supplies a polished, accessible design system out of the box (React Aria gives WAI-ARIA keyboard/screen-reader support), retiring the missing-design-layer gap. The shared TS core keeps the protocol/reducers reusable.
<!-- /ANCHOR:adr-002-decision -->
<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered
| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Chosen approach — installable PWA** | No App Store, instant updates, one codebase for phone + desktop, strong accessibility via React Aria | Weaker iOS Web Push (home-screen install required, no notification actions) | 9/10 |
| React Native + Expo native app | Reliable iOS push, Secure Enclave keys, native feel | App Store distribution friction for a personal tool; does NOT remove the Tailscale dependency; loses desktop + instant updates | 4/10 |
| Hybrid Expo shell wrapping the PWA in a WebView | Keeps the PWA codebase; native shell can add iOS push/background capabilities | Extra packaging layer; only needed if iOS push/background becomes load-bearing | 6/10 |
**Why this one**: Lowest distribution friction for a private tailnet tool, one codebase across phone+desktop, and it converts the open framework question into a decision.
<!-- /ANCHOR:adr-002-alternatives -->
<!-- ANCHOR:adr-002-consequences -->
### Consequences
**What improves**:
- Retires the framework + design-layer open questions
- Strong accessibility for free
- You own the component code
**What it costs**:
- iOS Web Push is weaker (home-screen install required, no notification actions) — mitigation: the hybrid Expo WebView shell is the pre-agreed escape hatch if iOS push/background becomes load-bearing
**Risks**:
| Risk | Impact | Mitigation |
|------|--------|------------|
| Untitled UI free tier is single-user and its components are committed into the shared repo | M | Solo development stays within the free tier; budget PRO Studio (one-time, up to 8 devs) only if multiple people co-develop the UI code; end users of the app never consume seats |
<!-- /ANCHOR:adr-002-consequences -->
<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation
| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | An unspecified framework stalls implementation |
| 2 | **Beyond Local Maxima?** | PASS | Native and hybrid were compared |
| 3 | **Sufficient?** | PASS | Adds only the decided stack, no extra surface |
| 4 | **Fits Goal?** | PASS | A private Claude-app-style Pi control client |
| 5 | **Open Horizons?** | PASS | Shared TS core + escape hatch keep native/other clients cheap later |
**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-002-five-checks -->
<!-- ANCHOR:adr-002-impl -->
### Implementation
**What changes**:
- `apps/pi-remote-web/` adopts Vite + React 19 + Untitled UI + XState + TanStack Virtual
- `apps/pi-remote-relay/` fixes Node + Hono/Fastify + `ws` + better-sqlite3
- `packages/pi-rpc-protocol/` hosts the shared reducer core
**How to roll back**: The stack choice is documentation-only until code exists; revert this ADR with no runtime impact.
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->

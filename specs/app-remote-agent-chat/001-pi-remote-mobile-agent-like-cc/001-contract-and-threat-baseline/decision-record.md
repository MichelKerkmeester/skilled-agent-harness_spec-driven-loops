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
    packet_pointer: "apps/pi-remote/001-pi-remote-mobile-agent-like-cc/001-contract-and-threat-baseline"
    last_updated_at: "2026-08-13T16:35:13Z"
    last_updated_by: "gpt-5.6-sol"
    recent_action: "Reconciled accepted decisions with the implemented baseline"
    next_safe_action: "Use phase 009 for remaining operator-only release evidence"
    blockers:
      - "No phase-specific implementation blocker"
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "decision-record.md"
      - "implementation-summary.md"
    completion_pct: 90
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

---

<!-- ANCHOR:adr-003 -->
## ADR-003: Pin the first supported baseline — macOS host, sandbox-exec, better-sqlite3, iOS PWA

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted for implementation planning |
| **Date** | 2026-08-12 |
| **Deciders** | Operator decision this session; technical verification pending |

<!-- ANCHOR:adr-003-context -->
### Context
Phase 001 must freeze a first supported baseline before contract-pinning and threat modeling. Four operator questions — host, containment, durable store, first device — were unresolved and blocked implementation preflight.

### Constraints
- Personal/small-team tool; the operator codes on macOS
- Loopback-relay / tailnet-only / foreground-authority / redaction posture
- macOS has no namespaces or seccomp
<!-- /ANCHOR:adr-003-context -->

<!-- ANCHOR:adr-003-decision -->
### Decision

**We chose**: Host — macOS (the operator's dev Mac; relay and Pi run locally, the phone reaches them only over Tailscale). Containment — an Apple `sandbox-exec` profile confining relay-spawned protected tools. Durable store — better-sqlite3 with a numbered up/down SQL migration runner. First device — iPhone / iOS Safari installed PWA.

**How it works**: Protected tools execute under a sandbox-exec profile whose escape tests phase 006 exercises. Durable state is a synchronous better-sqlite3 ledger with explicit numbered migrations for rollback. The PWA targets installed iOS Safari, accepting the Web Push limits (home-screen install, no notification actions), with the React Native/Expo WebView shell as the documented escape hatch.
<!-- /ANCHOR:adr-003-decision -->

<!-- ANCHOR:adr-003-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Chosen (macOS / sandbox-exec / better-sqlite3 / iOS)** | Matches where the operator codes; native containment; robust synchronous store | macOS containment weaker than Linux; iOS push limited | 8/10 |
| Linux host with namespaces and seccomp | Strongest containment | Pi must move off the Mac; more setup for a personal tool | 6/10 |
| node:sqlite built-in driver | Zero dependency | Experimental API under a durable-state backbone | 4/10 |

**Why this one**: It fits the operator's actual environment while keeping containment and durability credible; the weaker macOS and iOS edges have documented escape hatches.
<!-- /ANCHOR:adr-003-alternatives -->

<!-- ANCHOR:adr-003-consequences -->
### Consequences

**What improves**:
- Phase 001 can pin a concrete baseline; the four open questions are resolved.
- Phase 006 escape tests target a real mechanism instead of an abstraction.

**What it costs**:
- macOS containment is weaker than Linux and sandbox-exec is Apple-deprecated. Mitigation: pin the macOS version and keep a Linux row as a later hardening option.
- iOS Web Push carries no actions. Mitigation: the Attention Inbox plus the native-shell escape hatch.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A future macOS removes sandbox-exec | M | Pin the macOS version in 001; keep a Linux baseline as fallback |
<!-- /ANCHOR:adr-003-consequences -->

<!-- ANCHOR:adr-003-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | 001 cannot freeze a baseline without these four choices |
| 2 | **Beyond Local Maxima?** | PASS | Linux and built-in-sqlite alternatives were compared |
| 3 | **Sufficient?** | PASS | Resolves exactly the four open questions, no extra surface |
| 4 | **Fits Goal?** | PASS | Matches the operator's macOS and iPhone environment |
| 5 | **Open Horizons?** | PASS | Linux and Android rows and the native shell remain addable |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-003-five-checks -->

<!-- ANCHOR:adr-003-impl -->
### Implementation

**What changes**:
- `deploy/pi-remote/baseline/` pins the macOS version, the Pi/Node/Tailscale versions, and the sandbox-exec profile.
- `apps/pi-remote-relay/src/store/` uses better-sqlite3 with numbered SQL migrations.
- The supported device matrix declares the iPhone / iOS Safari row.

**How to roll back**: The baseline is documentation until code exists; revert this ADR with no runtime impact.
<!-- /ANCHOR:adr-003-impl -->
<!-- /ANCHOR:adr-003 -->

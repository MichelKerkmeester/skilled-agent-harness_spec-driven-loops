---
title: "Feature Specification: Pi Remote Mobile Agent"
description: "Nine-phase program for a private Claude-app-style mobile control plane over Pi CLI."
trigger_phrases:
  - "pi remote mobile"
  - "pi claude app style remote"
  - "pi rpc relay"
  - "mobile pi agent"
  - "pi remote phase map"
importance_tier: "critical"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/041-pi-remote-mobile-agent-like-cc"
    last_updated_at: "2026-08-10T18:43:21Z"
    last_updated_by: "codex"
    recent_action: "Defined the approved nine-phase implementation program"
    next_safe_action: "Begin 001-contract-and-threat-baseline after implementation workspace selection"
    blockers:
      - "Product implementation and release evidence have not started"
    key_files:
      - "spec.md"
      - "001-contract-and-threat-baseline/spec.md"
      - "009-release-verification-and-rollout/spec.md"
    completion_pct: 10
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT
  FORBIDDEN content (do NOT author at phase-parent level):
    - merge/migration/consolidation narratives
    - heavy working documents that belong in child phase folders
  REQUIRED content:
    - root purpose and outcome
    - child phase control map
    - high-level scope and handoff gates
-->

# Feature Specification: Pi Remote Mobile Agent

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | Phase parent with Level 2, 3, and 3+ children |
| **Priority** | P0 |
| **Status** | Draft |
| **Created** | 2026-08-10 |
| **Branch** | Current workspace; implementation workspace not selected |
| **Parent Packet** | `041-pi-remote-mobile-agent-like-cc` |
| **Predecessor** | None |
| **Successor** | None |
| **Handoff Criteria** | Every selected phase passes independently and the terminal release phase verifies the integrated system |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Pi CLI exposes a persistent local RPC subprocess, not a secure mobile product. A Claude-app-style experience needs private network ingress, process supervision, durable replay, mutation ambiguity handling, application authorization, protected-tool approval, host containment, mobile reconciliation, privacy-minimized push, operator documentation, and real release evidence.

### Purpose

Deliver an installable private mobile PWA that can find Pi sessions, follow streaming work, send or steer prompts, stop runs, inspect tools, and approve exact protected actions without making the browser socket the process, data, or authority boundary.

> **Phase-parent note:** This is the only authored Markdown document at the parent level. Detailed requirements, plans, tasks, checklists, decisions, and current state live in the child phase folders below. The existing `research/` subtree remains the program's source evidence.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- A loopback-only TypeScript relay that owns isolated persistent `pi --mode rpc` children and durable redacted state.
- Tailnet-only HTTPS/WSS through Tailscale Serve plus separate application authentication and default-deny authorization.
- An installable mobile PWA with session, thread, streaming, reconnect, explicit control, offline read-only, and foreground approval behavior.
- A pinned final-boundary Pi extension, containment, redaction, capability kill switches, and per-command remote mutation gates.
- Privacy-minimized Web Push hints, complete operator documentation, automated evidence, physical-device testing, accessibility, rollback, and staged rollout.

### Out of Scope

- Public Internet exposure, Tailscale Funnel, or unauthenticated access.
- Direct browser-to-Pi transport, terminal screen scraping, or one Pi process per prompt.
- Exactly-once execution across an unacknowledged relay-to-Pi crash boundary.
- Offline/background prompts or approvals, decision-bearing push, and unrestricted filesystem, process, credential, or network access.
- Native applications, multi-host orchestration, multi-tenancy, or full Claude product parity in the first release.

### Files to Change

Aggregate program scope only; each child plan owns exact paths and must reconcile them with the live repository before code changes.

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `packages/pi-rpc-protocol/` | Create | 001, 003 | Pinned Pi and relay transport contracts |
| `tests/pi-remote/` | Create | 001, 002, 003-007, 009 | Fixtures, contract, integration, security, chaos, browser, device, and release evidence |
| `apps/pi-remote-relay/` | Create | 003, 004, 006, 007 | RPC supervision, state, auth, approvals, mutation policy, and push |
| `apps/pi-remote-web/` | Create | 005, 007 | Installable mobile PWA and service worker |
| `extensions/pi-remote-approval/` | Create | 006 | Final-boundary protected-tool gate |
| `deploy/pi-remote/` | Create | 001, 004, 006, 009 | Host baseline, Serve, containment, service, monitoring, and rollback |
| `docs/pi-remote/` | Create | 008, 009 | Architecture, protocol, security, mobile, and operator guidance |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> Each child is independently executable and validatable. Folder numbers provide stable identities; the dependency graph below allows test and documentation work to overlap implementation safely.

| Phase | Folder | Focus | Level | Status |
|-------|--------|-------|-------|--------|
| 1 | `001-contract-and-threat-baseline/` | Pin live contracts, architecture, schemas, authorization, redaction, retention, threat model, and supported environment | 3+ | Draft |
| 2 | `002-automated-test-harness/` | Build recorded/live, integration, security, browser, and deterministic kill-point evidence | 3 | Draft |
| 3 | `003-relay-protocol-and-state/` | Implement Pi RPC supervision, isolated sessions, durable replay, mutation outcomes, and session catalog | 3+ | Draft |
| 4 | `004-auth-and-tailnet-boundary/` | Add loopback/Tailscale ingress, application auth, authorization, revocation, and read-only API | 3+ | Draft |
| 5 | `005-mobile-pwa-and-reconciliation/` | Build session/thread UX, streaming reducers, explicit controls, reconnect, and offline read-only state | 3 | Draft |
| 6 | `006-approval-and-remote-mutation/` | Add final-boundary approval, containment, redaction, kill switch, and gated mutation | 3+ | Draft |
| 7 | `007-push-and-platform-hardening/` | Add generic push hints and harden mobile installation, lifecycle, revocation, and stale-state behavior | 3 | Draft |
| 8 | `008-documentation-and-runbooks/` | Produce tested API, architecture, security, setup, maintenance, incident, mobile, and rollback documentation | 2 | Draft |
| 9 | `009-release-verification-and-rollout/` | Independently verify the whole system, devices, accessibility, performance, rollback, and staged release | 3+ | Draft |

### Dependency and Transition Rules

```text
001 baseline --> 002 evidence harness --> 003 relay --> 004 auth/tailnet --> 005 PWA
                       |                    |              |             |
                       +--------------------+--------------+--> 006 protected mutation
                       +--------------------------------------> 007 push/platform
001 stable contracts ----------------------------------------> 008 documentation
002 through 008 complete or explicitly allowed --------------> 009 release verification
```

- Phase 002 establishes negative controls before production behavior and remains a cross-cutting evidence lane through phase 009.
- Phase 008 may establish structure after phase 001, but final claims and commands must follow implemented behavior from phases 003 through 007.
- Remote access starts read-only. Phase 006 may enable a mutation command only after its authorization, crash, approval, containment, and redaction rows pass.
- Push is optional and never carries authority. Its release subset is independent from foreground remote control.
- Each child must pass strict validation and its own checklist before its outputs are accepted.
- The parent must pass recursive strict validation after any phase status or child-set change.
- Resume a specific phase with `/speckit:resume cli-external-orchestration/041-pi-remote-mobile-agent-like-cc/NNN-phase-name`.

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|----|----------|--------------|
| 001 | 002, 003, 008 | Live versions, contracts, threat model, schemas, authority and redaction matrices are frozen | Pinned evidence bundle plus consumer review |
| 002 | 003-007, 009 | Deterministic negative controls and evidence format exist for every consuming capability | Harness self-tests, isolation checks, and failing baselines |
| 003 | 004, 005, 006 | Isolated children, durable replay, reconciliation, mutation ambiguity, catalog, and bounds pass | Recorded/live contract, storage, crash, isolation, and load suites |
| 004 | 005, 006 | Private ingress, application auth, authorization, revocation, and read-only API fail closed | Target-host HTTPS/WSS, spoof, Origin, ticket, bypass, and revocation evidence |
| 005 | 006, 007 | Foreground mobile session/thread/reconnect and explicit control state are authoritative | Reducer, browser, reconnect, accessibility-foundation, and real-child evidence |
| 006 | 007, 009 | Exact-action approval, containment, redaction, crash semantics, and kill switch pass | TOCTOU, race, restart, escape, canary, and per-command policy suites |
| 007 | 008, 009 | Push remains generic and platform lifecycle behavior is recorded | Payload inspection, subscription lifecycle, stale-hint, and device evidence |
| 008 | 009 | Tested commands, supported versions, limitations, incident, and rollback guidance match final behavior | Fresh-operator walkthrough, link/contract diff, and secret scan |
| 009 | Release | Whole gate, target-host security, devices, accessibility, performance, rollback, and sign-offs pass | Exact final commands, exits, evidence matrix, rollback drill, and scoped status |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- Which exact repository packages and scripts will implementation preflight confirm for the proposed app, package, extension, test, deployment, and documentation surfaces?
- Which host OS, deployment identity, containment primitive, Pi version, Node/package-manager versions, and Tailscale version form the first supported baseline?
- Which physical iOS and Android/browser rows are available for the first supported device and accessibility matrix?
- Which SQLite library and migration tool satisfy the single-host durability and rollback requirements?
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Research source tree**: [research/](research/)
- **First executable phase**: [001-contract-and-threat-baseline/spec.md](001-contract-and-threat-baseline/spec.md)
- **Cross-cutting test phase**: [002-automated-test-harness/spec.md](002-automated-test-harness/spec.md)
- **Documentation phase**: [008-documentation-and-runbooks/spec.md](008-documentation-and-runbooks/spec.md)
- **Terminal release phase**: [009-release-verification-and-rollout/spec.md](009-release-verification-and-rollout/spec.md)
- **Graph metadata**: [graph-metadata.json](graph-metadata.json)

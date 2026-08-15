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
    packet_pointer: "apps/pi-remote/001-pi-remote-mobile-agent-like-cc"
    last_updated_at: "2026-08-14T04:44:41Z"
    last_updated_by: "gpt-5.6-sol"
    recent_action: "Reconciled the nine built phases with the latest passing machine evidence"
    next_safe_action: "Collect operator-only live Pi, containment, Tailscale, and iOS push evidence before rollout"
    blockers:
      - "Live Pi extension ordering and protected execution remain operator-unverified"
      - "Real macOS sandbox-exec containment remains operator-unverified"
      - "Real Tailscale Serve ingress remains operator-unverified"
      - "Physical iOS Web Push remains operator-unverified"
    key_files:
      - "spec.md"
      - "001-contract-and-threat-baseline/spec.md"
      - "009-release-verification-and-rollout/spec.md"
    completion_pct: 90
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
| **Status** | Implemented (operator-verification pending) |
| **Created** | 2026-08-10 |
| **Branch** | `skilled/0147-pi-remote-experience` |
| **Parent Packet** | `001-pi-remote-mobile-agent-like-cc` |
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

The implementation was relocated into the app-local `.pi/pi-remote/` monorepo. The paths below are the live aggregate surfaces, not the original root-level plan.

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `.pi/pi-remote/packages/pi-rpc-protocol/` | Relocated and implemented | 001, 003 | Pinned Pi and relay transport contracts |
| `.pi/pi-remote/tests/` and package/app test folders | Relocated and implemented | 001, 002, 003-007, 009 | Contract, integration, security, kill-point, browser, rollback, threshold, and rollout evidence |
| `.pi/pi-remote/apps/pi-remote-relay/` | Relocated and implemented | 003, 004, 006, 007 | RPC supervision, state, auth, approvals, mutation policy, command transport, and push |
| `.pi/pi-remote/apps/pi-remote-web/` | Relocated and implemented | 005, 007 | Installable mobile PWA, typed transcript, command UI, cache, and service worker |
| `.pi/pi-remote/extensions/pi-remote-approval/` | Relocated and implemented | 006 | Final-boundary protected-tool gate |
| `.pi/pi-remote/deploy/` | Relocated and implemented | 001, 004, 006, 009 | Serve setup and macOS containment profile |
| `.pi/pi-remote/docs/` | Relocated and implemented | 008, 009 | Architecture, security, setup, operations, platform, incident, rollback, and release guidance |
| `.pi/pi-remote/release/` and `.pi/pi-remote/scripts/` | Implemented | 009 | Machine evidence, thresholds, rollout gates, release verification, and rollback drill |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> Each child is independently executable and validatable. Folder numbers provide stable identities; the dependency graph below allows test and documentation work to overlap implementation safely.

| Phase | Folder | Focus | Level | Status |
|-------|--------|-------|-------|--------|
| 1 | `001-contract-and-threat-baseline/` | Pin live contracts, architecture, schemas, authorization, redaction, retention, threat model, and supported environment | 3+ | Implemented |
| 2 | `002-automated-test-harness/` | Build recorded/live, integration, security, browser, and deterministic kill-point evidence | 3 | Implemented |
| 3 | `003-relay-protocol-and-state/` | Implement Pi RPC supervision, isolated sessions, durable replay, mutation outcomes, and session catalog | 3+ | Implemented |
| 4 | `004-auth-and-tailnet-boundary/` | Add loopback/Tailscale ingress, application auth, authorization, revocation, and read-only API | 3+ | Implemented (operator-verification pending) |
| 5 | `005-mobile-pwa-and-reconciliation/` | Build session/thread UX, streaming reducers, explicit controls, reconnect, and offline read-only state | 3 | Implemented |
| 6 | `006-approval-and-remote-mutation/` | Add final-boundary approval, containment, redaction, kill switch, and gated mutation | 3+ | Implemented (operator-verification pending) |
| 7 | `007-push-and-platform-hardening/` | Add generic push hints and harden mobile installation, lifecycle, revocation, and stale-state behavior | 3 | Implemented (operator-verification pending) |
| 8 | `008-documentation-and-runbooks/` | Produce tested API, architecture, security, setup, maintenance, incident, mobile, and rollback documentation | 2 | Implemented |
| 9 | `009-release-verification-and-rollout/` | Independently verify the whole system, devices, accessibility, performance, rollback, and staged release | 3+ | Implemented (operator-verification pending) |
| 10 | `010-code-readme-coverage/` | Author a code README in every app code folder to the sk-create-readme template and realign existing READMEs | 2 | Implemented |
| 11 | `011-architecture-reference/` | Author one system architecture reference covering relay, protocol, PWA, extension, authority loop, sync, and redaction | 2 | Implemented |
| 12 | `012-docs-as-skill-references/` | Convert the operator runbooks under docs/ into sk-create-skill reference-template format | 2 | Implemented |
| 13 | `013-code-standards-alignment/` | Audit and align the app code to sk-code-opencode standards | 2 | Implemented |
| 14 | `014-onboarding-and-root-readme/` | Realign the root README and author an install/onboarding guide to the sk-create-readme templates | 2 | Implemented |
| 15 | `015-doc-quality-and-catalog/` | Add a documentation-quality gate and a feature catalog of the app surfaces | 2 | Implemented |
| 16 | `016-ai-deploy-and-onboarding/` | AI-runnable boot script, deploy playbook, and user download/install instructions | 2 | Implemented |

### Dependency and Transition Rules

```text
001 baseline --> 002 evidence harness --> 003 relay --> 004 auth/tailnet --> 005 PWA
                       |                    |              |             |
                       +--------------------+--------------+--> 006 protected mutation
                       +--------------------------------------> 007 push/platform
001 stable contracts ----------------------------------------> 008 documentation
002 through 008 complete or explicitly allowed --------------> 009 release verification
003 through 009 implemented ----------------------------------> 010-015 documentation and standards
```

- Phase 002 establishes negative controls before production behavior and remains a cross-cutting evidence lane through phase 009.
- Phase 008 may establish structure after phase 001, but final claims and commands must follow implemented behavior from phases 003 through 007.
- Remote access starts read-only. Phase 006 may enable a mutation command only after its authorization, crash, approval, containment, and redaction rows pass.
- Push is optional and never carries authority. Its release subset is independent from foreground remote control.
- Each child must pass strict validation and its own checklist before its outputs are accepted.
- The parent must pass recursive strict validation after any phase status or child-set change.
- Resume a specific phase with `/speckit:resume apps/pi-remote/001-pi-remote-mobile-agent-like-cc/NNN-phase-name`.

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

The first-baseline questions are resolved (see 001 decision-record ADR-003):

- **Host / containment**: macOS on the operator's dev Mac (relay and Pi local, phone over Tailscale); Apple `sandbox-exec` profile for protected-tool containment.
- **Durable store**: better-sqlite3 with numbered up/down SQL migrations.
- **First device matrix**: iPhone / iOS Safari installed PWA (Web Push limits accepted; native-shell escape hatch documented).
- **Remaining preflight**: exact repository package paths/scripts and the pinned Pi/Node/Tailscale versions are confirmed during 001 implementation preflight against the live environment.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Research source tree**: [research/](research/)
- **First executable phase**: [001-contract-and-threat-baseline/spec.md](001-contract-and-threat-baseline/spec.md)
- **Cross-cutting test phase**: [002-automated-test-harness/spec.md](002-automated-test-harness/spec.md)
- **Documentation phase**: [008-documentation-and-runbooks/spec.md](008-documentation-and-runbooks/spec.md)
- **Terminal release phase**: [009-release-verification-and-rollout/spec.md](009-release-verification-and-rollout/spec.md)
- **Graph metadata**: [graph-metadata.json](graph-metadata.json)

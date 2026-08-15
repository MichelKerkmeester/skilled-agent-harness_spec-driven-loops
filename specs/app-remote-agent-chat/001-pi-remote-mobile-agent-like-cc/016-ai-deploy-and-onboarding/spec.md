---
title: "Feature Specification: AI Deploy and Onboarding"
description: "Plans the one-command AI boot sequence and the deterministic AI deploy playbook that deploy, boot, and onboard the Pi Remote app for a user on a tailnet-only Tailscale boundary."
trigger_phrases:
  - "pi remote ai deploy and onboarding"
  - "pi mobile phase 16"
  - "ai deploy and onboarding"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "apps/pi-remote/001-pi-remote-mobile-agent-like-cc/016-ai-deploy-and-onboarding"
    last_updated_at: "2026-08-14T04:44:41Z"
    last_updated_by: "deepseek-v4-flash"
    recent_action: "Built the boot script, deploy playbook, and user install instructions"
    next_safe_action: "Operator runs boot.mjs on the target Mac to deploy live"
    blockers:
      - "Draft planning phase with implementation evidence pending"
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "implementation-summary.md"
    completion_pct: 100
---

# Feature Specification: AI Deploy and Onboarding

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Implemented |
| **Created** | 2026-08-14 |
| **Branch** | `skilled/0147-pi-remote-experience` |
| **Parent Spec** | `../spec.md` |
| **Phase** | 16 of 16 |
| **Predecessor** | `../015-doc-quality-and-catalog/spec.md` |
| **Successor** | None (terminal phase of the Pi Remote program) |
| **Handoff Criteria** | `boot.mjs` runs end to end from a clean checkout, is idempotent and fail-closed, prints the tailnet HTTPS URL plus a QR or enrollment code plus copy-paste user instructions, and the AI playbook is verified by a fresh-agent dry run |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The app has a setup runbook (phase 008) and an install and onboarding guide (phase 014), but deploying still requires an operator to run many ordered commands by hand: preflight, install, build, relay start, Tailscale Serve setup, enrollment, and instruction handoff. An AI agent cannot reliably boot the app for a user today, and there is no single deterministic runbook that tells an AI what to run, what to expect at each step, and what to print to the user at the end. Without a bounded phase, deployment stays manual and the AI handoff stays ad hoc.

### Purpose

Deliver a bounded workstream whose output is one idempotent, fail-closed boot command plus a deterministic AI runbook, so a fresh agent can deploy and boot the app and hand a user download and install instructions without operator help.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `scripts/boot.mjs`: a one-command AI-runnable boot sequence under `Apps/Pi Mobile/` with named stages: preflight (node, npm, the pi binary, tailscale), build (`npm ci` then `npm run build`), supervised relay start (`pi --mode rpc` with mutation DEFAULT-OFF), tailnet-only Tailscale Serve verify or configure via `deploy/setup-tailscale-serve.sh` (no Funnel), device enrollment payload generation, and a final print of the tailnet HTTPS URL, a QR or enrollment code, and a copy-paste user instruction block.
- `docs/ai-deploy-playbook.md`: a deterministic runbook an AI follows to deploy, boot, and onboard, with ordered steps, exact commands, expected outputs, decision points, the user handoff message, and operator-only caveats (real Tailscale, iOS on-device, sandbox-exec, live Pi).
- The user download and install instructions the boot emits: install Tailscale and join the tailnet, open the URL on iPhone, Add to Home Screen, enroll by QR or code.

### Out of Scope
- Changing app runtime behavior, authentication, mutation policy, containment, or push (owned by phases 004, 006, and 007).
- Modifying the relay, the web app, or the existing `deploy/setup-tailscale-serve.sh` behavior beyond invoking it.
- Public Internet exposure, Tailscale Funnel, or unauthenticated access.
- Native applications, multi-host orchestration, or multi-tenancy.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `Apps/Pi Mobile/scripts/boot.mjs` | New | One-command AI boot: preflight, build, supervised relay start, Serve verify or configure, enrollment payload, handoff print; idempotent and fail-closed |
| `Apps/Pi Mobile/docs/ai-deploy-playbook.md` | New | Deterministic AI runbook: ordered steps, exact commands, expected outputs, decision points, user handoff message, operator-only caveats |
| `Apps/Pi Mobile/deploy/setup-tailscale-serve.sh` | Invoked | Existing phase 004 script that `boot.mjs` runs to verify or configure tailnet-only Tailscale Serve with Funnel off |
| `Apps/Pi Mobile/package.json` | Referenced | Optional `boot` script alias so the one command is `npm run boot` |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Preflight fails closed. | Boot aborts with a named cause and a remediation hint when node, npm, the pi binary, or tailscale is missing, wrong version, or not logged in; nothing else runs. |
| REQ-002 | Posture is preserved. | Boot never enables remote mutation (mutation stays DEFAULT-OFF), never enables Tailscale Funnel, and never prints or uses a public URL. |
| REQ-003 | Ingress is tailnet-only. | Serve is verified or configured for the tailnet only through `deploy/setup-tailscale-serve.sh`, with Funnel asserted off. |
| REQ-004 | Boot is idempotent. | A second run converges without duplicate relays, duplicate Serve configs, duplicate enrollments, or drifted state. |
| REQ-005 | User handoff is complete. | Boot prints the tailnet HTTPS URL, a QR or enrollment code, and copy-paste instructions to install Tailscale, join the tailnet, open the URL on iPhone, Add to Home Screen, and enroll. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | The playbook is deterministic. | `ai-deploy-playbook.md` lists ordered steps, exact commands, expected outputs, decision points, the handoff message, and the operator-only caveats. |
| REQ-007 | Operator-only caveats are explicit. | Real Tailscale, iOS on-device behavior, sandbox-exec containment, and live Pi supervision are labeled operator-verification items, not machine claims. |
| REQ-008 | Relay is supervised. | The relay runs under the loopback relay launcher with an isolated `pi --mode rpc` child and durable redacted state per the phase 003 contracts. |
| REQ-090 | Evidence is reproducible and version-pinned. | Every completed boot claim records exact commands, versions, environment, output, and exit status. |
| REQ-091 | Rollback preserves Pi native sessions. | Boot rollback never rewrites or deletes Pi native session history. |
| REQ-092 | Consumers receive an explicit handoff. | Parent, operator, documentation, and release packets name the final boot and playbook outputs plus limitations. |
| REQ-093 | Failed P0 gates disable dependent capability. | Status and guidance never present a failed or unrun boot boundary as available. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A fresh AI agent boots the app from a clean checkout to a working tailnet HTTPS URL with the single boot command.
- **SC-002**: A second boot run converges with no duplicate or drifted state.
- **SC-003**: A user completes download and install from the printed instructions without operator help.
- **SC-004**: Every boot run passes posture assertions: mutation DEFAULT-OFF, no Funnel, no public URL.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 004 auth and Tailnet boundary | Serve script, auth tokens, and enrollment payloads | Boot calls only the verified Serve script and keeps tokens file-scoped |
| Dependency | Phase 007 push and PWA hardening | Installable web build and platform behavior | Boot builds the app and checks the PWA manifest before handoff |
| Dependency | Phase 008 documentation and runbooks | Setup and operations truth | Playbook commands must match the tested runbooks |
| Dependency | Phase 014 onboarding and root README | Install guide and README shape | Handoff instructions must match the published guide |
| Risk | Unsafe or non-idempotent boot | Duplicate relays, exposure, or drift | Fail-closed preflight, convergence checks, posture assertions, no Funnel |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- Preflight, build, and Serve checks have bounded timeouts and report the stated environment at each stage.

### Security
- Raw credentials, host paths, transcripts, tool payloads, and approval inputs never enter boot output or durable evidence unless explicitly redacted; mutation stays DEFAULT-OFF and Funnel stays off.

### Reliability
- Every failure produces a named state and keeps dependent capability disabled.

---

## L2: EDGE CASES

### Data Boundaries
- Missing node, npm, pi binary, Tailscale login, or device enrollment input have explicit fail-closed outcomes.

### Error Scenarios
- Dependency unavailable: stop the boot and preserve the last known-safe capability set.
- Serve already configured: run verify-only and skip reconfiguration.
- Relay already running: reuse the supervised child and skip duplicate start.

### State Transitions
- Boot never changes mutation posture; Funnel off is asserted on every run; re-runs converge to the same state.
<!-- /ANCHOR:questions -->

---

## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 15/25 | 2 owned deliverables and cross-phase consumers |
| Risk | 17/25 | Boot is a privileged automation surface |
| Research | 10/20 | Runbooks and Serve script exist; live boot evidence remains pending |
| Multi-Agent | 6/15 | A single AI agent is the primary consumer |
| Coordination | 13/15 | 4 dependency groups |
| **Total** | **61/100** | **Level 2** |

---

## 10. OPEN QUESTIONS

- Which exact pi binary path and pinned versions does implementation preflight confirm?
- Which P1 items, if any, does the operator explicitly defer after seeing evidence?

---

## RELATED DOCUMENTS

- **Parent phase map**: [../spec.md](../spec.md)
- **Implementation plan**: [plan.md](plan.md)
- **Task ledger**: [tasks.md](tasks.md)
- **Verification checklist**: [checklist.md](checklist.md)
- **Current state**: [implementation-summary.md](implementation-summary.md)

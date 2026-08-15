---
title: "Implementation Plan: AI Deploy and Onboarding"
description: "Execution plan for the one-command AI boot sequence and the deterministic AI deploy playbook that deploy, boot, and onboard the Pi Remote app."
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
    recent_action: "Authored phase 016 ai-deploy-and-onboarding planning set as Draft"
    next_safe_action: "Run validate.sh on phase 016 and reconcile the parent packet map"
    blockers:
      - "Draft planning phase with implementation evidence pending"
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "implementation-summary.md"
    completion_pct: 0
---

# Implementation Plan: AI Deploy and Onboarding

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js and TypeScript in the app repo; exact versions pinned at phase start |
| **Framework** | AI Deploy and Onboarding boundary within the Pi relay/PWA system |
| **Storage** | Phase-specific; no new durable store unless listed in spec.md |
| **Testing** | Boot idempotency run; Negative-control preflight; Posture assertions; Playbook fresh-AI dry run; Secret scan and link validation |

### Overview

One command boots, supervises, and hands off the app to a user on a tailnet-only Tailscale boundary. The deliverables live under `Apps/Pi Mobile/` as `scripts/boot.mjs` and `docs/ai-deploy-playbook.md`.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Predecessor inputs and phase-001 version pins are current.
- [ ] Safe negative controls reproduce the exact forbidden or missing behavior.
- [ ] Owned paths, consumers, dependencies, rollback, and authoritative command are confirmed.

### Definition of Done
- [ ] Every P0 requirement and selected P1 item has objective evidence.
- [ ] Focused checks and the authoritative phase gate pass from final state.
- [ ] No secret, temporary output, unrelated edit, or unsupported claim remains.
- [ ] Successor inputs, parent status, and rollback state agree.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Use one staged boot script with named stages, fail-closed exits, and convergence checks, plus one deterministic playbook that mirrors the stages for an AI consumer.

### Key Components
- **`Apps/Pi Mobile/scripts/boot.mjs`**: Preflight, build, supervised relay start with mutation DEFAULT-OFF, Serve verify or configure with no Funnel, enrollment payload, and handoff print
- **`Apps/Pi Mobile/docs/ai-deploy-playbook.md`**: Ordered steps, exact commands, expected outputs, decision points, user handoff message, operator-only caveats
- **`Apps/Pi Mobile/deploy/setup-tailscale-serve.sh`**: Existing phase 004 script, invoked verify-or-configure, tailnet-only, Funnel asserted off
- **`Apps/Pi Mobile/package.json`**: Optional `boot` alias for the one command

### Data Flow
Preflight gates to build, build gates to supervised relay start, relay start gates to Serve verify or configure, Serve gates to enrollment payload generation, and enrollment gates to the handoff print. Every stage exits with a named state on failure.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This table maps the planned deliverables to the live repository surfaces they touch or invoke.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `Apps/Pi Mobile/scripts/boot.mjs` | New | One-command boot and handoff | Boot stage walkthrough |
| `Apps/Pi Mobile/docs/ai-deploy-playbook.md` | New | Deterministic AI runbook | Fresh-AI dry run |
| `Apps/Pi Mobile/deploy/setup-tailscale-serve.sh` | Existing, invoked | Tailnet-only Serve verify or configure | Serve verification plus Funnel-off assertion |
| `Apps/Pi Mobile/package.json` | Referenced | Optional `boot` script alias | Package check |
| Parent and operator packets | Scope and handoff consumers | Reconcile status and exact outputs | Recursive phase validation |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Confirm node, npm, pi, and tailscale versions, workspace choice, owned paths, and rollback.
- [ ] Reconcile the phase plan with live repository paths under `Apps/Pi Mobile/`.

### Phase 2: Core Implementation
- [ ] Author the preflight stage with fail-closed checks and named causes for every missing prerequisite.
- [ ] Author the build stage (`npm ci` then `npm run build`) and the supervised relay start with mutation DEFAULT-OFF.
- [ ] Author the Serve verify-or-configure stage via `deploy/setup-tailscale-serve.sh` with no Funnel.
- [ ] Author the enrollment payload stage and the handoff print with the tailnet HTTPS URL, a QR or enrollment code, and copy-paste user instructions.
- [ ] Author `docs/ai-deploy-playbook.md` with ordered steps, exact commands, expected outputs, decision points, the handoff message, and operator-only caveats.
- [ ] Exercise the full boot twice on the target host and confirm idempotent convergence.

### Phase 3: Verification
- [ ] Run focused preflight, posture, idempotency, and secret checks during implementation.
- [ ] Run the authoritative phase gate from final state.
- [ ] Reconcile tasks, checklist, current state, parent map, and operator handoff.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Primary | Boot stage walkthrough and idempotency | Repository-selected runner and exact recorded command |
| Integration | Serve verify-or-configure with Funnel-off assertion | Repository-selected runner and exact recorded command |
| Evidence | Negative-control preflight for missing prerequisites | Repository-selected runner and exact recorded command |
| Evidence | Posture assertions for mutation and Funnel | Repository-selected runner and exact recorded command |
| Evidence | Playbook fresh-AI dry run | Repository-selected runner and exact recorded command |
| Evidence | Secret and link validation | Repository-selected runner and exact recorded command |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 004 auth and Tailnet boundary | Internal | Pending phase preflight | Boot cannot verify or configure Serve |
| Phase 007 push and PWA hardening | Internal | Pending phase preflight | Boot cannot produce an installable build |
| Phase 008 documentation and runbooks | Internal | Pending phase preflight | Playbook may contradict the runbooks |
| Phase 014 onboarding and root README | Internal | Pending phase preflight | Handoff instructions may mismatch the guide |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Any P0 gate, integrity check, secret scan, or authoritative command fails.
- **Procedure**: Remove or revert the boot script and playbook while retaining the last verified runbook instructions; block handoff until the truth check passes; never rewrite or delete Pi native session history.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```text
Confirm inputs --> reproduce negative controls --> implement owned boundary
       --> focused checks --> authoritative phase gate --> handoff
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | 014-onboarding-and-root-readme | Implementation |
| Implementation | Setup and phase 004 Serve script | Verification |
| Verification | Implemented boundary | Parent packet and operator handoff |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup and negative controls | Medium | 0.5-1 engineer-days |
| Core implementation | Medium | 2-5 engineer-days |
| Verification and handoff | High | 1-3 engineer-days |
| **Total** | | **3.5-9 engineer-days, refined after preflight** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Last compatible state or backup is identified.
- [ ] Capability disablement and revocation are independently available.
- [ ] Native Pi sessions remain outside destructive rollback scope.

### Rollback Procedure
1. Stop or disable the affected boot capability.
2. Remove or revert the boot script and playbook while retaining the last verified runbook instructions.
3. Run the prior-state smoke and integrity checks.
4. Record unresolved mutation uncertainty and operator impact.

### Data Reversal
- **Has data migrations?** No phase-owned migration is planned unless preflight changes the scope.
- **Reversal procedure**: Restore the compatible phase-owned state; never rewrite or delete Pi native session history.
<!-- /ANCHOR:enhanced-rollback -->

---

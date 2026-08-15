---
title: "Implementation Plan: Onboarding and Root README"
description: "Execution plan for planning the root README realignment and the install and onboarding guide for Pi Remote to the sk-create-readme templates."
trigger_phrases:
  - "pi remote onboarding and root readme"
  - "pi mobile phase 14"
  - "onboarding and root readme"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "apps/pi-remote/001-pi-remote-mobile-agent-like-cc/014-onboarding-and-root-readme"
    last_updated_at: "2026-08-13T16:35:13Z"
    last_updated_by: "deepseek-v4-flash"
    recent_action: "Authored 014 onboarding-and-root-readme spec set as Draft"
    next_safe_action: "Approved 014 plan, then begin 015 doc-quality-and-catalog drafting"
    blockers:
      - "Draft planning phase; implementation evidence pending"
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "implementation-summary.md"
    completion_pct: 0
---

# Implementation Plan: Onboarding and Root README

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown over the TypeScript monorepo at `Apps/Pi Mobile/` |
| **Framework** | Onboarding and Root README boundary within the Pi relay/PWA system |
| **Storage** | No new durable store; two documents are the deliverables |
| **Testing** | `sk-doc` document validation and extraction; command diff against `docs/setup.md` |

### Overview

Plans realigning `Apps/Pi Mobile/README.md` to the `sk-create-readme` general README template and authoring `Apps/Pi Mobile/docs/install-and-onboarding.md` in the folded install-guide template with validation checkpoints.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] The current root `README.md` and `docs/setup.md` are reviewed.
- [ ] The `sk-create-readme` general and install-guide template sections are confirmed.
- [ ] Owned paths, the install-guide location decision, rollback, and the authoritative gate are confirmed.

### Definition of Done
- [ ] The root README uses the general template shape and the install guide passes its checkpoint structure.
- [ ] Focused checks and the authoritative phase gate pass from final state.
- [ ] No secret, temporary output, unrelated edit, or unsupported claim remains.
- [ ] Successor inputs, parent status, and rollback state agree.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Two documents with one division of labor: the root README answers what the app is and how to navigate it; the install guide answers how to get it running from scratch, folded into five phases with validation checkpoints.

### Key Components
- **`README.md` realignment**: H1 with a blockquote tagline, numbered ALL-CAPS H2 sections, workspace map table, requirements, quick start, and operator documentation links.
- **`docs/install-and-onboarding.md`**: AI-first intro, Overview with a Core Principle, Prerequisites, Installation, Initialization, Configuration, and Verification phases, Usage, Troubleshooting, and Resources.
- **Verification checkpoints**: `phase_1_complete` through `phase_5_complete` with expected output and STOP blocks.

### Data Flow
Commands are sourced from the current README and `docs/setup.md`, verified against the root scripts, folded into the guide phases, and cross-checked by `sk-doc` validation before handoff to phase 015.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## AFFECTED SURFACES

This table maps the planned deliverables to the live surfaces.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `README.md` | Root orientation and quick commands | Realigned to general template | `sk-doc` validation and template review |
| `docs/setup.md` | Install and deploy runbook | Command source for the guide | Command diff against the guide |
| `deploy/setup-tailscale-serve.sh` | Deployment entrypoint | Documented in the guide | Command verification |
| `release/*` and `scripts/*` | Verify and rollback entrypoints | Linked from README and guide | Command verification |
| Parent and successor packets | Scope and handoff consumers | Reconcile status and exact outputs | Recursive phase validation |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Confirm the current README content, the `docs/setup.md` command set, owned paths, and the authoritative gate.
- [ ] Confirm the install-guide location decision and review both `sk-create-readme` templates.

### Phase 2: Core Implementation
- [ ] Realign the root `README.md` to the general template shape.
- [ ] Author `docs/install-and-onboarding.md` with the five folded phases and validation checkpoints.
- [ ] Preserve verified commands and operator-only labels from the current README and `docs/setup.md`.
- [ ] Add the troubleshooting table and the expected output for every validation command.

### Phase 3: Verification
- [ ] Run focused `sk-doc` validation and extraction during implementation.
- [ ] Diff the guide commands against `docs/setup.md` and the root scripts.
- [ ] Run the authoritative phase gate from final state and reconcile handoff.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Primary | Document validation | `python3 .opencode/skills/sk-doc/shared/scripts/validate_document.py <file>` |
| Integration | Structure extraction | `python3 .opencode/skills/sk-doc/shared/scripts/extract_structure.py <file>` |
| Evidence | Command diff | Diff the guide against `docs/setup.md` and root scripts |
| Evidence | Fresh-operator dry run | Walk the guide from a clean checkout |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Verified setup command set | Internal | Pending phase preflight | Guide cannot be authored |
| `sk-create-readme` templates | Internal skill resource | Available | Template shapes unavailable |
| `sk-doc` validation scripts | Internal skill resource | Available | Validation unavailable |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Any P0 gate, validation, extraction, or command-diff check fails.
- **Procedure**: Revert the affected document to its prior content while retaining verified commands; block until the check passes.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```text
Confirm sources --> review templates --> realign README --> author guide
       --> focused checks --> command diff --> authoritative gate --> handoff
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | 013-code-standards-alignment | Implementation |
| Implementation | Setup and the verified command set | Verification |
| Verification | Both authored documents | 015-doc-quality-and-catalog |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup and source review | Low | 0.5-1 engineer-days |
| Core implementation | Medium | 1-3 engineer-days |
| Verification and handoff | Medium | 0.5-1.5 engineer-days |
| **Total** | | **2-5.5 engineer-days, refined after preflight** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] The current `README.md` content is captured before the realignment.
- [ ] The install-guide location decision is recorded.
- [ ] No runtime, database, or authority surface is touched by this phase.

### Rollback Procedure
1. Revert the README or the guide to its prior content.
2. Preserve every verified command and operator-only label.
3. Re-run validation, extraction, and the command diff.
4. Record deferred content and operator impact.

### Data Reversal
- **Has data migrations?** No migration is planned for this phase.
- **Reversal procedure**: Restore the prior documents; no other state is changed.
<!-- /ANCHOR:enhanced-rollback -->

---

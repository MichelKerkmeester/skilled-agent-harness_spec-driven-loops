---
title: "Implementation Plan: Docs as Skill References"
description: "Execution plan for planning the conversion of the Pi Remote operator documentation set into sk-create-skill reference-template format."
trigger_phrases:
  - "pi remote docs as skill references"
  - "pi mobile phase 12"
  - "docs as skill references"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "apps/pi-remote/001-pi-remote-mobile-agent-like-cc/012-docs-as-skill-references"
    last_updated_at: "2026-08-13T16:35:13Z"
    last_updated_by: "deepseek-v4-flash"
    recent_action: "Authored 012 docs-as-skill-references spec set as Draft"
    next_safe_action: "Approved 012 plan, then begin 013 code-standards-alignment audit"
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

# Implementation Plan: Docs as Skill References

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown runbooks over the TypeScript monorepo at `Apps/Pi Mobile/` |
| **Framework** | Docs-as-skill-references boundary within the Pi relay/PWA system |
| **Storage** | No new durable store; converted runbooks are the deliverable |
| **Testing** | `sk-doc` reference extraction and validation; command and link diff |

### Overview

Plans converting seven operator runbooks under `Apps/Pi Mobile/docs/` (`setup`, `security`, `operations`, `incident-playbooks`, `rollback`, `release-verification`, `platform-support`) into `sk-create-skill` reference-template format, preserving verified commands and operator-only boundaries, with `architecture.md` owned by phase 011 as the shared anchor.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] The seven source runbooks and the phase 011 architecture anchor are confirmed.
- [ ] The `sk-create-skill` reference-template sections are reviewed.
- [ ] Owned paths, rollback, and the authoritative gate are confirmed.

### Definition of Done
- [ ] Every converted runbook uses the reference shape and preserves the exact verified command set.
- [ ] Focused checks and the authoritative phase gate pass from final state.
- [ ] No secret, temporary output, unrelated edit, or unsupported claim remains.
- [ ] Successor inputs, parent status, and rollback state agree.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
One reference-template shape applied to every runbook, with `docs/architecture.md` kept as the single system anchor that the converted runbooks link to.

### Key Components
- **`docs/setup.md`**: Prerequisites, install, deploy, enroll, PWA install reference.
- **`docs/security.md`**: Boundaries, ingress, auth, approval, containment, redaction, retention reference.
- **`docs/operations.md`**: Environment variables, migrations, retention, devices, revocation, mutation, push reference.
- **`docs/incident-playbooks.md`**: Indeterminate mutation, lease, device, sync, push recovery playbooks.
- **`docs/rollback.md`**: Scope, drill evidence, restore limits, smoke checks reference.
- **`docs/release-verification.md`**: Machine gates, numeric thresholds, rollout readiness reference.
- **`docs/platform-support.md`**: Install matrix, offline behavior, notification limits reference.
- **`docs/architecture.md`**: Phase 011 deliverable; the canonical anchor.

### Data Flow
Source runbook content is converted section by section, commands are preserved verbatim, operator-only steps stay labeled pending, and each converted file links back to the architecture anchor.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## AFFECTED SURFACES

This table maps the planned conversion set to the live docs.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `docs/setup.md` | Install and deploy runbook | Converted | Reference extraction and command diff |
| `docs/security.md` | Security boundaries runbook | Converted | Reference extraction and command diff |
| `docs/operations.md` | Daily operations runbook | Converted | Reference extraction and command diff |
| `docs/incident-playbooks.md` | Incident recovery runbook | Converted | Reference extraction and decision-logic review |
| `docs/rollback.md` | Rollback runbook | Converted | Reference extraction and command diff |
| `docs/release-verification.md` | Release evidence runbook | Converted | Reference extraction and threshold review |
| `docs/platform-support.md` | Platform matrix runbook | Converted | Reference extraction and table review |
| `docs/architecture.md` | Canonical system anchor | Owned by phase 011 | Phase 011 verification |
| Parent and successor packets | Scope and handoff consumers | Reconcile status and exact outputs | Recursive phase validation |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Confirm the seven source runbooks, the phase 011 anchor, owned paths, and the authoritative gate.
- [ ] Review the `sk-create-skill` reference-template structure and the operator-only labeling rule.

### Phase 2: Core Implementation
- [ ] Convert each runbook to the reference shape, preserving verified commands verbatim.
- [ ] Add decision logic and validation checkpoints to mutation, incident, and rollback runbooks.
- [ ] Keep operator-verification-pending labels and the Attention Inbox fallback intact.
- [ ] Cross-link every converted runbook to `docs/architecture.md`.

### Phase 3: Verification
- [ ] Run focused reference extraction, validation, and command diffs during implementation.
- [ ] Run the authoritative phase gate from final state.
- [ ] Reconcile tasks, checklist, current state, parent map, and successor handoff.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Primary | Reference extraction per runbook | `python3 .opencode/skills/sk-doc/shared/scripts/extract_structure.py <doc>` |
| Integration | Link and reference validation | `python3 .opencode/skills/sk-doc/shared/scripts/validate_document.py <doc>` |
| Evidence | Command set diff | Diff converted vs source runbook commands |
| Evidence | Architecture anchor links | Link resolution across `docs/` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 011 architecture anchor | Internal | Pending phase 011 | Runbook cross-links blocked |
| Source runbook command evidence | Internal | Pending phase preflight | Command preservation blocked |
| `sk-create-skill` reference template | Internal skill resource | Available | Reference shape unavailable |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Any P0 gate, reference extraction, link check, or command diff fails.
- **Procedure**: Revert the affected runbook to its source form while retaining verified commands; block until the check passes.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```text
Confirm sources --> review template --> convert runbooks --> focused checks
       --> command diff --> authoritative gate --> handoff
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | 011-architecture-reference | Implementation |
| Implementation | Setup and the phase 011 anchor | Verification |
| Verification | Converted runbook set | 013-code-standards-alignment |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup and source review | Medium | 0.5-1.5 engineer-days |
| Core implementation | Medium | 2-5 engineer-days |
| Verification and handoff | Medium | 1-2 engineer-days |
| **Total** | | **3.5-8.5 engineer-days, refined after preflight** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Source runbook content is captured before conversion.
- [ ] The phase 011 architecture boundary and phase 015 quality boundary are explicit.
- [ ] No runtime, database, or authority surface is touched by this phase.

### Rollback Procedure
1. Revert the affected runbook to its source form.
2. Preserve every verified command and operator-only label.
3. Re-run reference extraction, validation, and the command diff.
4. Record deferred conversions and operator impact.

### Data Reversal
- **Has data migrations?** No migration is planned for this phase.
- **Reversal procedure**: Restore the source runbooks; no other state is changed.
<!-- /ANCHOR:enhanced-rollback -->

---

---
title: "Implementation Plan: Code Standards Alignment"
description: "Execution plan for planning an audit and alignment of the Pi Remote app code to the sk-code-opencode standards surface."
trigger_phrases:
  - "pi remote code standards alignment"
  - "pi mobile phase 13"
  - "code standards alignment"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "apps/pi-remote/001-pi-remote-mobile-agent-like-cc/013-code-standards-alignment"
    last_updated_at: "2026-08-13T16:35:13Z"
    last_updated_by: "deepseek-v4-flash"
    recent_action: "Authored 013 code-standards-alignment spec set as Draft"
    next_safe_action: "Approved 013 plan, then begin 014 onboarding-and-root-readme drafting"
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

# Implementation Plan: Code Standards Alignment

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript monorepo at `Apps/Pi Mobile/` with `.mjs`, `.sh`, and JSON config surfaces |
| **Framework** | Code Standards Alignment boundary within the Pi relay/PWA system |
| **Storage** | No new durable store; the standards reference and aligned sources are the deliverables |
| **Testing** | `npm run lint`, `npm run format:check`, `npm run typecheck`, `npm test`, and the audit matrix |

### Overview

Plans a reproducible audit of the app source against the `sk-code-opencode` standards surface, a standards reference recording findings, findings-driven alignment edits, and a final re-run of the app's gates.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] The `sk-code-opencode` references and checklists to apply are confirmed.
- [ ] The app's current lint, format, typecheck, and test baselines are captured.
- [ ] Owned paths, rollback, and the authoritative gate are confirmed.

### Definition of Done
- [ ] The audit matrix is complete, findings are resolved or deferred, and alignment preserves behavior.
- [ ] `npm run lint`, `npm run format:check`, `npm run typecheck`, and `npm test` pass from final state.
- [ ] No secret, temporary output, unrelated edit, or unsupported claim remains.
- [ ] Successor inputs, parent status, and rollback state agree.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Measure, record, align, verify. Each edit cluster is small, verified, and logged so behavior drift is caught before the next cluster.

### Key Components
- **Standards surface**: `sk-code-opencode` TypeScript style and quality references, the shared universal and code-organization tier, and the language-specific checklists.
- **`Apps/Pi Mobile/docs/code-standards.md`**: The standards reference with the applied standard, audit matrix, and drift findings.
- **App gates**: `npm run lint`, `npm run format:check`, `npm run typecheck`, and `npm test`.
- **Aligned surfaces**: protocol, relay, web, extension, scripts, deploy shell, and config files.

### Data Flow
Baseline gates are captured, the audit records each finding against a standard reference, edits are applied in verified clusters, and the final gate run is recorded in the standards reference and handed to phase 015.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## AFFECTED SURFACES

This table maps the audit lanes to the live surfaces and their standards.

| Surface | Standard Applied | Action | Verification |
|---------|------------------|--------|--------------|
| `packages/pi-rpc-protocol/src/` | TypeScript style and quality references | Audit and align | Lint, format, typecheck, tests |
| `apps/pi-remote-relay/src/` and `tests/` | Shared code-organization, directory and test conventions | Audit and align | Lint, format, typecheck, tests |
| `apps/pi-remote-web/src/` and `tests/` | TypeScript and test conventions | Audit and align | Lint, format, typecheck, tests |
| `extensions/pi-remote-approval/` | Module boundaries and test conventions | Audit and align | Lint, format, typecheck, tests |
| `scripts/*.mjs` and `release/*.mjs` | JavaScript checklist | Audit and align | Lint, typecheck, tests |
| `deploy/*.sh` and `containment/escape-tests.sh` | Shell checklist | Audit and align | Shell review, containment escape test |
| `eslint.config.js`, `tsconfig.base.json`, workspace `tsconfig.json` | Config standards | Audit and align | Lint and typecheck |
| `docs/release-verification.md` | Standards reference agreement | Correct stale lint/format claim | Cross-check with root `package.json` |
| Parent and successor packets | Scope and handoff consumers | Reconcile status and exact outputs | Recursive phase validation |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Capture the app baseline: `npm run lint`, `npm run format:check`, `npm run typecheck`, and `npm test`.
- [ ] Confirm the `sk-code-opencode` references and checklists to apply.

### Phase 2: Core Implementation
- [ ] Run the audit across every surface and record findings in the audit matrix.
- [ ] Reconcile the app ESLint, Prettier, and TypeScript configs against the standard before editing.
- [ ] Apply findings-driven alignment edits in small verified clusters.
- [ ] Author `docs/code-standards.md` with the applied standard and the resolved findings.
- [ ] Correct the stale lint/format claim in `docs/release-verification.md`.

### Phase 3: Verification
- [ ] Re-run the app gates from final state and record exact evidence.
- [ ] Run the authoritative phase gate and the safe rollback or recovery exercise.
- [ ] Reconcile tasks, checklist, current state, parent map, and successor handoff.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Primary | App gates | `npm run lint`, `npm run format:check`, `npm run typecheck`, `npm test` |
| Evidence | Audit reproducibility | Audit matrix in `docs/code-standards.md` with exact commands |
| Evidence | Behavior preservation | Before-and-after test runs per edit cluster |
| Evidence | Standards conformance | Section-by-section review against `sk-code-opencode` references |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `sk-code-opencode` references and checklists | Internal skill resource | Available | Standards surface unavailable |
| App baseline gates | Internal | Pending phase preflight | Phase remains blocked |
| Phases 011-012 documentation output | Internal | Pending | Standards reference linking incomplete |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Any P0 gate, baseline regression, or audit check fails.
- **Procedure**: Revert the failing edit cluster, restore the prior passing state, and re-run the gate; block until the check passes.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```text
Capture baseline --> confirm standards --> run audit --> reconcile config
       --> apply clusters --> verify gates --> handoff
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | 012-docs-as-skill-references | Implementation |
| Implementation | Setup and the standards surface | Verification |
| Verification | Aligned surfaces | 014-onboarding-and-root-readme |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup and baseline | Medium | 0.5-1 engineer-days |
| Core implementation | High | 2-6 engineer-days |
| Verification and handoff | High | 1-2 engineer-days |
| **Total** | | **3.5-9 engineer-days, refined after preflight** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] The pre-alignment baseline is captured and stored.
- [ ] Each edit cluster has a named revert path.
- [ ] Boundary, containment, and redaction behavior is excluded from alignment edits.

### Rollback Procedure
1. Revert the failing edit cluster.
2. Restore the prior passing baseline.
3. Re-run the app gates and the audit matrix check.
4. Record unresolved findings and operator impact.

### Data Reversal
- **Has data migrations?** No migration is planned for this phase.
- **Reversal procedure**: Restore the pre-alignment source state; no database or authority state is changed.
<!-- /ANCHOR:enhanced-rollback -->

---

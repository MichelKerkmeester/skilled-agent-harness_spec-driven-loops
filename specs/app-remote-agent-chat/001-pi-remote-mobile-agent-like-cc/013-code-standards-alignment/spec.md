---
title: "Feature Specification: Code Standards Alignment"
description: "Plans an audit and alignment of the Pi Remote app code to the sk-code-opencode standards surface."
trigger_phrases:
  - "pi remote code standards alignment"
  - "pi mobile phase 13"
  - "code standards alignment"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "apps/pi-remote/001-pi-remote-mobile-agent-like-cc/013-code-standards-alignment"
    last_updated_at: "2026-08-13T17:48:24Z"
    last_updated_by: "deepseek-v4-flash"
    recent_action: "Audited code to sk-code-opencode; comment-only alignment, gate green"
    next_safe_action: "Proceed to phase 014 onboarding and root readme"
    blockers:
      - "Draft planning phase; implementation evidence pending"
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "implementation-summary.md"
    completion_pct: 100
---

# Feature Specification: Code Standards Alignment

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
| **Created** | 2026-08-13 |
| **Branch** | `skilled/0147-pi-remote-experience` |
| **Parent Spec** | `../spec.md` |
| **Phase** | 13 of 15 |
| **Predecessor** | `../012-docs-as-skill-references/spec.md` |
| **Successor** | `../014-onboarding-and-root-readme/spec.md` |
| **Handoff Criteria** | The app source under `Apps/Pi Mobile/` passes a documented `sk-code-opencode` alignment audit, the drift findings are recorded in a standards reference, and the alignment is verified with the app's lint, format, typecheck, and test gates |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The built Pi Remote app does not document which `sk-code-opencode` standards it follows, and no audit has measured drift in structure, naming, module boundaries, or the opencode code-surface conventions. The root `package.json` already exposes `lint`, `format:check`, and `typecheck` scripts, yet `docs/release-verification.md` states there are no lint or format scripts in the app, which is a concrete standards and documentation drift. Without a bounded alignment phase, the app's conventions stay unmeasured and the later documentation phases have no standards anchor.

### Purpose

Deliver a bounded audit and alignment workstream that measures the app against the `sk-code-opencode` standards surface, records findings, and aligns the code so the app's own gates and the standards reference agree.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- An audit of the app source under `Apps/Pi Mobile/` against the `sk-code-opencode` standards surface: TypeScript standards, universal naming and commenting patterns, code organization and module boundaries, and directory and test conventions.
- A standards reference recording the applied standard, the audit matrix, and the drift findings.
- Findings-driven alignment edits to app source, test, script, and config files where the audit shows drift.
- Re-running the app's `lint`, `format:check`, `typecheck`, and test gates after alignment.

### Out of Scope
- Reworking the opencode `.opencode/` tree itself, which is the `sk-code-opencode` surface's own scope.
- The README and documentation deliverables, owned by phases 010-012 and 014.
- Behavioral or security changes beyond documented alignment edits.

### Files to Change

The aligned surfaces are the audited modules. Specific edits are findings-driven and recorded in the audit matrix.

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `Apps/Pi Mobile/docs/code-standards.md` | Planned | Standards reference: applied `sk-code-opencode` standards, audit matrix, and drift findings |
| `Apps/Pi Mobile/packages/pi-rpc-protocol/src/*` | Aligned | Naming, module boundaries, and export conventions per the TypeScript standards |
| `Apps/Pi Mobile/apps/pi-remote-relay/src/*` | Aligned | Module organization and dependency direction per the shared code-organization standards |
| `Apps/Pi Mobile/apps/pi-remote-relay/tests/*` | Aligned | Directory and test conventions |
| `Apps/Pi Mobile/apps/pi-remote-web/src/*` and `tests/*` | Aligned | Naming and test conventions |
| `Apps/Pi Mobile/extensions/pi-remote-approval/src/*` and `tests/*` | Aligned | Module boundaries and test conventions |
| `Apps/Pi Mobile/scripts/*.mjs` and `release/*.mjs` | Aligned | JavaScript checklist conventions |
| `Apps/Pi Mobile/deploy/*.sh` and `deploy/containment/escape-tests.sh` | Aligned | Shell checklist conventions |
| `Apps/Pi Mobile/eslint.config.js`, `tsconfig.base.json`, and workspace `tsconfig.json` files | Aligned | Config standards where the audit finds drift |
| `Apps/Pi Mobile/docs/release-verification.md` | Aligned | Correct the stale claim that no lint or format scripts exist |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The audit is reproducible and recorded. | `Apps/Pi Mobile/docs/code-standards.md` names the applied `sk-code-opencode` references and lists each finding with its file and standard. |
| REQ-002 | Alignment preserves behavior. | After alignment, the app's existing tests pass unchanged and `npm run typecheck` and `npm run build` succeed. |
| REQ-003 | The app's own gates run. | `npm run lint`, `npm run format:check`, and `npm run typecheck` are executed and their results recorded in the audit. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Naming and module boundaries follow the standard. | Audit rows for naming, comment hygiene, module organization, imports and exports, and directory/test conventions are resolved or explicitly deferred. |
| REQ-005 | The stale release claim is corrected. | `docs/release-verification.md` no longer claims the app has no lint or format scripts. |
| REQ-006 | The standards reference feeds phase 015. | `docs/code-standards.md` is included in the phase 015 doc-quality gate. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A reviewer can read `docs/code-standards.md` and map every audit finding to a standard reference and a resolution.
- **SC-002**: The app's lint, format, typecheck, and test gates pass from the final state, and the release doc agrees with the root `package.json` scripts.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Alignment edits change behavior | Broken tests or runtime regressions | Run the full test suite before and after each edit cluster |
| Risk | Standards conflict with the app's ESLint/Prettier config | Churn without gain | Reconcile the app config against the standard before mass edits |
| Risk | Scope creep into the `.opencode/` tree | Out-of-scope rework | The `.opencode/` tree is excluded from this phase |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- The audit covers the app surfaces in bounded passes and records exact commands.

### Security
- Alignment never weakens boundaries; audit edits preserve the fail-closed authority, containment, and redaction paths.

### Reliability
- Every edit cluster is verified before the next cluster starts.

---

## L2: EDGE CASES

### Data Boundaries
- Config files, `.mjs` scripts, and `.sh` scripts each follow their language-specific checklist rather than the TypeScript guide.

### Error Scenarios
- Standard conflict: flag the conflict in the audit and reconcile before editing.
- Gate failure after a cluster: revert the cluster and re-run the gate.

### State Transitions
- The alignment is the implementation deliverable; this phase is a Draft plan.

---

## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 14/25 | Audit across protocol, relay, web, extension, scripts, and config |
| Risk | 12/25 | Alignment edits touch shipped source |
| Research | 10/20 | Standards surface read; app config review pending |
| Multi-Agent | 5/15 | Single owner by default |
| Coordination | 10/15 | Feeds phase 015; reads phases 011-012 output |
| **Total** | **51/100** | **Level 2** |

---

## 10. OPEN QUESTIONS

- Which `sk-code-opencode` standards rows does the preflight audit find already in compliance?
- Which naming or module-boundary findings does the operator choose to defer as P1 items?
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Parent phase map**: [../spec.md](../spec.md)
- **Implementation plan**: [plan.md](plan.md)
- **Task ledger**: [tasks.md](tasks.md)
- **Verification checklist**: [checklist.md](checklist.md)
- **Current state**: [implementation-summary.md](implementation-summary.md)

---
title: "Feature Specification: Code Graph Source Bug & Misalignment Audit [system-spec-kit/026-graph-and-context-optimization/004-code-graph/011-source-bug-and-misalignment-audit/spec]"
description: "Read-only audit of the system-code-graph mk-code-index MCP server (~17.5k LOC) for code bugs and doc/code misalignments. 37 confirmed findings (10 P1, 27 P2) produced by a gpt-5.5 dispatch + Claude direct verification + a 43-agent adversarial-verification workflow."
trigger_phrases:
  - "code graph source audit"
  - "system-code-graph bug audit"
  - "mk-code-index misalignments"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-code-graph/007-code-graph-buildout/011-source-bug-and-misalignment-audit/001-source-bug-audit-findings"
    last_updated_at: "2026-05-29T08:05:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Recorded 37 audit findings in review-report.md"
    next_safe_action: "Schedule P1 remediation fix packets"
    blockers: []
    key_files:
      - "review-report.md"
      - "plan.md"
      - "tasks.md"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Placement? New phase child 011 under 004-code-graph (009 is docs-only, 010 is playbook-only)."
      - "Findings home? review-report.md is the evidence record; spec/plan/tasks frame the remediation."
---
# Feature Specification: Code Graph Source Bug & Misalignment Audit

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete (audit phase); remediation pending |
| **Created** | 2026-05-29 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The `system-code-graph` skill ships a ~17.5k-LOC standalone `mk-code-index` MCP server (tree-sitter parsing, better-sqlite3 storage, IPC launcher, owner-lease election, readiness contracts). No recent end-to-end correctness audit existed, and several documentation surfaces (feature catalog, playbooks, references, install guide) had drifted from the implementation. The operator requested a bug + misalignment sweep, dispatched via `cli-opencode` using `gpt-5.5 xhigh`.

### Purpose
Produce a verified, evidence-backed catalog of code bugs and doc/code misalignments in the skill, with concrete fixes, so remediation can be scheduled without re-deriving the analysis.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Read-only audit of `.opencode/skills/system-code-graph/mcp_server/**` TypeScript source.
- Doc/code alignment check across `feature_catalog/**`, `manual_testing_playbook/**`, `references/**`, `ARCHITECTURE.md`, `README.md`, `INSTALL_GUIDE.md`, `SKILL.md`, `ENV_REFERENCE.md`.
- Recording 37 confirmed findings with exact file:line evidence in `review-report.md`.

### Out of Scope
- Applying fixes — this packet documents findings only; fixes are scheduled as follow-on work.
- `node_modules/` and `mcp_server/dist/` build artefacts — not reviewed.
- Runtime scan/apply/verify execution — none performed (read-only).
- Reversing the `.opencode/.spec-kit` DB-location policy (ADR-002 / consolidation) — out of scope; the audit treats the documented workspace-root location as correct.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `review-report.md` | Create | Full evidence catalog of 37 findings |
| `plan.md` / `tasks.md` / `checklist.md` / `implementation-summary.md` | Create | Audit framing + remediation plan |
| `.opencode/skills/system-code-graph/**` | (Deferred) | Source/doc fixes tracked here, applied in follow-on packets |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every reported finding cites real file:line evidence | Each `review-report.md` entry's quote matches the source at the cited line |
| REQ-002 | Findings adversarially verified, false positives excluded | Verifier verdict recorded; 4 refuted candidates excluded |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Findings prioritised P1/P2 with concrete fixes | Each finding has severity + one-line fix |
| REQ-004 | Remediation tasks enumerated for P1 findings | `tasks.md` lists one task per P1 finding |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `review-report.md` records all 37 confirmed findings (10 P1, 27 P2) with evidence, why, and fix.
- **SC-002**: `validate.sh --strict` passes for this phase folder.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Some P1 candidates downgraded to P2 due to dead-code / launcher guards | Med | Verification notes record exact production-impact reasoning per finding |
| Risk | Doc-count findings (8-vs-11 tools) share a root cause | Low | Grouped in review-report; single source-of-truth fix recommended |
| Dependency | Fixes touch a live MCP server | Med | Remediation deferred to scoped follow-on packets with their own verification |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Audit must not mutate the code-graph DB or run scans (read-only guarantee held).

### Security
- **NFR-S01**: No secrets included in the dispatched prompt or findings.

### Reliability
- **NFR-R01**: Findings reproducible — every claim re-checkable at the cited file:line.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty/ambiguous contract: lower-confidence leads were dropped rather than reported.
- Duplicate findings (two finders, same issue): deduped (playbook-023 apply-mode reference).

### Error Scenarios
- Refuted candidates (quote mismatch or guard prevents issue): excluded, count recorded.

### State Transitions
- Audit complete → remediation pending: status reflected in continuity + implementation-summary.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 18/25 | ~17.5k LOC reviewed; 37 findings across 7 clusters |
| Risk | 10/25 | Read-only audit; fixes deferred |
| Research | 12/20 | Multi-pass dispatch + 43-agent verification workflow |
| **Total** | **40/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- Should the 8-vs-11 tool-count doc drift (CG-023..CG-028 family) be fixed via a single source-of-truth pass rather than per-file edits?
- Are the dead-code owner-lease functions (`acquireOwnerLease`) intended to stay exported, or be removed?
<!-- /ANCHOR:questions -->

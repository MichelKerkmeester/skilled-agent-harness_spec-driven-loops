---
title: "Feature Specification: Persona-Injection Enforcement Verification"
description: "Objective sweep proving every external-CLI dispatch surface documents and enforces agent-persona injection, that no dispatch instruction sanctions a persona-less dispatch, and that the whole packet passes validate.sh --strict with no functional regression."
trigger_phrases:
  - "persona injection verification sweep"
  - "cli dispatch persona audit"
  - "persona enforcement final gate"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/050-persona-injection-enforcement/005-verification"
    last_updated_at: "2026-08-19T11:39:00Z"
    last_updated_by: "claude"
    recent_action: "Objective sweep 5/5 pass; recursive validate 5/5 Errors:0"
    next_safe_action: "Operator review of shipped-skill edits, then merge worktree to v4"
    blockers: []
    key_files:
      - "scratch/persona-injection-sweep.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "impl-050-005-verification"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Feature Specification: Persona-Injection Enforcement Verification

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-08-19 |
| **Branch** | `skilled/v4.0.0.0` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
P3 and P4 added the persona-injection enforcement rule to the six mode SKILLs, the hub, and the canonical card. A completion claim needs objective proof that the enforcement is actually present on every dispatch surface, that NO dispatch instruction still sanctions sending a task prompt without the resolved persona, and that the whole packet passes the authoritative gate with no functional regression to the shipped skills.

### Purpose
Run and record the objective sweep: confirm the rule in all six modes + hub + canonical card, prove the negative (no persona-less dispatch instruction remains), confirm the thin cards inherit the canonical section by reference, run `validate.sh --recursive --strict` across the packet, and capture the regression delta. Read-only audit — this phase edits no shipped file.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The objective grep/audit sweep across `cli-external-orchestration` and `sk-prompt` (`scratch/persona-injection-sweep.md`).
- `validate.sh --recursive --strict` across the whole `050` packet.
- The regression-delta record (baseline vs after).

### Out of Scope
- Any further shipped-file edits (owned by P3/P4). This is a read-only verification phase.
- Fixing the pre-existing MIRROR SYNC card drift (flagged in P4; separate cleanup).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `005-verification/scratch/persona-injection-sweep.md` | Create | The objective sweep + gate + regression-delta record |
| `005-verification/*` | Create | Level-2 phase docs |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Rule present everywhere | Sweep confirms the persona rule in all 6 mode SKILLs + hub + the canonical card §6 |
| REQ-002 | Negative proof | The sweep finds no ALWAYS/NEVER rule sanctioning a persona-less dispatch |
| REQ-003 | Authoritative gate | `validate.sh --recursive --strict` on the packet returns 5/5 PASSED, Errors:0 |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Regression delta | Baseline (0 surfaces enforced) vs after (6/6 + hub + card) recorded; no functional regression |
| REQ-005 | Thin cards inherit | The 6 thin `cli-*` cards delegate to the canonical card, inheriting §6 by reference |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All five sweep checks pass (rule presence, canonical section, per-mode reference, negative proof, thin-card delegation).
- **SC-002**: `validate.sh --recursive --strict` = 5/5 PASSED, Errors:0 Warnings:0.
- **SC-003**: Regression delta shows docs-only additions to shipped skills — no routing/registry/behavior change.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Sweep misses a dispatch surface | False "all clear" | Enumerate all 6 modes + hub + card + 6 thin cards explicitly; negative-proof grep across every SKILL |
| Risk | A shipped SKILL edit broke structure | Broken skill | `git diff` confirmed insertion-only in P3/P4; commit-time card guard passed |
| Dependency | P3 + P4 complete | Nothing to verify otherwise | `003` + `004` complete + validated |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Reliability
- **NFR-R01**: The sweep is deterministic (grep/audit), reproducible from the recorded commands.

### Maintainability
- **NFR-M01**: The sweep artifact records the exact surfaces checked, so a future change can re-run the same proof.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

- **Illustrative invocations**: HOW-IT-WORKS example commands (`devin -p -- "<prompt>"`) show shape, not a sanctioned persona-less path; the negative-proof sweep excludes them by intent, and the ALWAYS rule governs.
- **Thin cards**: they carry no inlined framework tables (a sync guard forbids it), so they inherit §6 by reference rather than copying it.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ASSESSMENT

Low. Deterministic read-only audit plus the packet gate; the difficulty is completeness (enumerating every dispatch surface), not novelty.
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None. The one residual item (pre-existing MIRROR SYNC card drift) is out of scope and already flagged for the operator in P4.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Parent**: See `../spec.md`
- **Previous phase**: See `../004-sk-prompt-alignment/spec.md`
- **Sweep artifact**: See `scratch/persona-injection-sweep.md`

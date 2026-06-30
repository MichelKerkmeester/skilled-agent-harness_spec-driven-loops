---
title: "Feature Specification: Hook-Doc Reconciliation + 022 Transitive Re-verify (029 Phase 007)"
description: "Reconcile stale hook-artifact-path docs to the real flat dist path; re-verify scenario 022 blast_radius transitive expansion with a deep-dependency subject."
trigger_phrases:
  - "hook doc reconciliation"
  - "022 transitive re-verify"
  - "029 phase 007 followup"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/004-code-graph/010-playbook-validation-and-hardening/007-followup-hook-docs-and-022"
    last_updated_at: "2026-05-27T00:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Author phase 007 spec for hook-doc reconciliation + 022 transitive re-verify"
    next_safe_action: "Correct stale hook artifact paths in 5 docs"
    blockers: []
    key_files:
      - ".opencode/skills/system-skill-advisor/references/decisions/deferred_decisions.md"
      - ".opencode/skills/system-spec-kit/mcp_server/hooks"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-2026-05-27-code-graph-remediation"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Feature Specification: Hook-Doc Reconciliation + 022 Transitive Re-verify (029 Phase 007)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Draft |
| **Created** | 2026-05-27 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Two non-blocking follow-ups remained after the 029 remediation. (1) Five active-guidance docs cite a SessionStart-hook compiled-artifact path that does not exist (`system-code-graph/dist/system-spec-kit/mcp_server/hooks/<runtime>/`); the real artifact is the flat `system-spec-kit/mcp_server/dist/hooks/<runtime>/session-start.js`. The documented "migration to system-code-graph" was never built. (2) Scenario 022 blast_radius was PARTIAL because the chosen subject had a single importer, so `transitive > nontransitive` could not be demonstrated.

### Purpose
Make the hook docs cite the real artifact path and record that the system-code-graph migration was not realized; re-verify 022's transitive expansion with a subject that has multi-hop dependents.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Correct the stale hook-artifact path in 5 active docs: `deferred_decisions.md` (system-skill-advisor) + the 4 hook READMEs (`system-spec-kit/mcp_server/hooks/{claude,codex,gemini,devin}/README.md`).
- Re-dispatch scenario 022 with a deep-dependency subject; record transitive > nontransitive (or note if topology still insufficient).

### Out of Scope
- Moving the hook source to system-code-graph (the docs are reconciled to reality; the hook works where it is).
- Editing 029 packet records or the historical 026/008 packet (they correctly document the finding; rewriting falsifies history).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `system-skill-advisor/.../deferred_decisions.md` | Modify | Correct stale path + dated resolution note |
| `system-spec-kit/mcp_server/hooks/{claude,codex,gemini,devin}/README.md` | Modify | Cite real flat dist artifact path |
| `007-.../evidence-022-rerun.md` | Create | 022 transitive re-verify evidence |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Hook docs cite the real artifact path | `rg` shows no active doc cites the non-existent `system-code-graph/dist/system-spec-kit/.../hooks/` path; cited path passes `test -f` for the devin artifact |
| REQ-002 | Resolution recorded | `deferred_decisions.md` carries a 2026-05-27 note that the migration was not realized + F-025-1 repointed the registration |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | 022 transitive re-verified | A deep-dependency subject shows `transitive > nontransitive`, OR documented why topology is still insufficient |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: No active doc points an operator at the non-existent hook artifact path.
- **SC-002**: 022 transitive expansion verdict resolved (PASS or documented limitation).
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Editing another skill's decision record | Overreach | Add a dated note + fix factually-wrong paths only; preserve history |
| Risk | 022 subject still too shallow | transitive unprovable | Pick a foundational module with known multi-hop importers; else document |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: N/A.

### Security
- **NFR-S01**: Paths only; no secrets.

### Reliability
- **NFR-R01**: Corrected path verified with `test -f`.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- The `<runtime>` placeholder in READMEs maps to the flat `dist/hooks/<runtime>/` layout.

### Error Scenarios
- If 022 re-run still shows transitive==nontransitive, record as a documented topology limitation, not a tool defect.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 7/25 | 5 doc edits + 1 re-run |
| Risk | 5/25 | Docs + read-only re-run |
| Research | 3/20 | Paths already confirmed |
| **Total** | **15/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- None blocking.
<!-- /ANCHOR:questions -->

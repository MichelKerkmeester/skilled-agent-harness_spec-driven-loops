---
title: "Implementation Plan: 100 - 099 deep-review remediation"
description: "Plan for resolving 12 of 13 P1 findings from packet 099 deep-review."
trigger_phrases:
  - "100 plan"
  - "099 remediation plan"
importance_tier: "high"
contextType: "infrastructure-quality"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/096-rename-opencode-dirs-to-plural/005-remediation"
    last_updated_at: "2026-05-07T20:30:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored Level 2 plan"
    next_safe_action: "Execute per phases"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-opus-4-7-2026-05-07"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: 100 - 099 deep-review remediation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context
| Aspect | Value |
|--------|-------|
| **Stack** | TS + Python + Bash + Edit/Write |
| **Executor** | Direct (orchestrator) — mechanical work per memory rule |
| **Storage** | Git working tree |
| **Testing** | grep audits + validate.sh + targeted unit smoke tests |

### Overview
12 P1 fixes addressing source/dist parity, security, validator strictness, advisor routing, anchor repair, doc canonicalization, reachability, and continuity hygiene. P1-026 deferred (observability).
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] 099 review-report.md available
- [x] 13 P1 findings catalogued with file:line
- [x] In-scope vs deferred mapping decided

### Definition of Done
- [x] All 12 in-scope P1s resolved with file:line evidence
- [x] `validate.sh --strict` on 098 + 096 + adjacent packets PASS
- [x] Smart-router, audit, advisor smoke tests PASS
- [x] P1-026 deferred explicitly in continuity blockers
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Sequential Edit + per-fix smoke test + final recursive validate.

### Key Components
- `Edit` tool for surgical changes
- `npm run build` for TS rebuild (mcp_server + scripts dists)
- `validate.sh --strict` for spec validation
- Python helper scripts for bulk patterns (fix-098-anchors.py)
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## AFFECTED SURFACES

See implementation-summary.md §Files Changed for the canonical list.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] T001 Inventory 13 P1 findings + map to surfaces
- [x] T002 Identify deferral candidate (P1-026)

### Phase 2: Implementation
- [x] T010 Source/dist parity (P1-015, P1-016)
- [x] T011 Security containment (P1-019)
- [x] T012 Validator strictness (P1-020, P1-021)
- [x] T013 Advisor routing (P1-025)
- [x] T014 Anchor repair (P1-022, P1-024)
- [x] T015 Reachability (P1-018)
- [x] T016 Bulk-mark + reconciliation (P1-007, P1-017)
- [x] T017 Continuity blockers (P1-023)

### Phase 3: Verification
- [x] T020 `validate.sh --strict` recursive on 098 + 096 + 100 + adjacent
- [x] T021 Smart-router smoke test
- [x] T022 audit_descriptions.py zero-inventory smoke test
- [x] T023 Native advisor `/spec_kit:deep-review` smoke test
- [x] T024 resolveArtifactRoot adversarial smoke test
- [x] T025 Author implementation-summary.md
- [x] T026 Update graph-metadata.json (status complete)
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | per-fix smoke | python3, node, rg |
| Integration | per-packet validate | validate.sh --strict |
| Regression | adjacent packets | validate.sh --strict |
| Adversarial | P1-019 injection | node smoke |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status |
|------------|------|--------|
| 099 review-report.md | Internal | Available |
| validate.sh | Tool | Green |
| npm + node | Runtime | Green |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Validation gate fails OR new regressions surfaced
- **Procedure**: `git reset --hard <pre-100 SHA>`
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | 099 review available | Implementation |
| Implementation | Setup | Verification |
| Verification | Implementation | Phase complete |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Effort |
|-------|------------|--------|
| Setup | Low | 5 min |
| Implementation | Med | ~90 min wall-clock |
| Verification | Low | 15 min |
| **Total** | | **~2 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] On main branch
- [x] Pre-100 SHA captured
- [x] No conflicting in-flight edits

### Rollback Procedure
1. `git reset --hard <pre-100 SHA>`
2. Re-inspect to confirm restoration
3. Document failure mode in next iteration
<!-- /ANCHOR:enhanced-rollback -->

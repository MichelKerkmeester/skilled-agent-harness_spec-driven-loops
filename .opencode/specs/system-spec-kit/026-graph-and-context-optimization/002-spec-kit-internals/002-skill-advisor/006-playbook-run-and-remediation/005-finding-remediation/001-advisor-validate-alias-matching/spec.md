---
title: "Feature Specification: advisor_validate Alias-Aware Gold Matching (F1a)"
description: "Make advisor_validate gold-label matching alias-aware so corpus rows labelled with superseded skill IDs (sk-deep-research/sk-deep-review) match the live graph IDs, recovering the reported accuracy regression."
trigger_phrases:
  - "advisor_validate alias matching"
  - "F1a corpus accuracy fix"
  - "skill-id drift gold matching"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals/002-skill-advisor/006-playbook-run-and-remediation/005-finding-remediation/001-advisor-validate-alias-matching"
    last_updated_at: "2026-05-27T00:00:00Z"
    last_updated_by: "scorer-remediation"
    recent_action: "Implemented and verified"
    next_safe_action: "None; phase complete and verified"
    blockers: []
    key_files:
      - ".opencode/skills/system-skill-advisor/mcp_server/handlers/advisor-validate.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "028-005-001"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Feature Specification: advisor_validate Alias-Aware Gold Matching (F1a)

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Done |
| **Created** | 2026-05-26 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`advisor_validate` matches corpus gold labels to the recommended skill with strict equality (`result.topSkill === expected`, `handlers/advisor-validate.ts` ~lines 266-275 and 361-371) and ignores the alias groups already defined in `lib/scorer/aliases.ts:4-16`. The corpus (`scripts/routing-accuracy/labeled-prompts.jsonl`) has 53/193 rows labelled `sk-deep-research`/`sk-deep-review`, which the live graph now indexes as `deep-research`/`deep-review`, so they fail strict equality and depress the reported accuracy (50.78% full-corpus / 42.5% holdout vs documented 80.5%/77.5%).

### Purpose
Make gold matching alias-aware so superseded-but-equivalent labels count as hits, restoring an accurate metric (projected 74.09% full-corpus / 65.0% holdout) without touching the scorer.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Resolve both `result.topSkill` and `expected` through the `aliases.ts` canonical-group lookup before comparison, at both gold-match sites in `advisor-validate.ts`.
- Re-run `advisor_validate` + the Python regression to confirm the metric lift.
- Update the NC-003 documented baseline expectation if the corpus is intentionally kept on legacy labels.

### Out of Scope
- Scorer/routing changes (the genuine P0 failures are F1b / phase 002).
- Relabelling the corpus file itself (alias-aware matching is preferred so legacy labels keep working); corpus relabel is an alternative noted in the plan.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-skill-advisor/mcp_server/handlers/advisor-validate.ts` | Modify | Alias-resolve topSkill + expected before `===` at both match sites |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Gold matching is alias-aware | `sk-deep-research`/`sk-deep-review` corpus rows count as hits for live `deep-research`/`deep-review` topSkill |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | Metric lift verified | Re-run advisor_validate shows full-corpus ~74% / holdout ~65% (no scorer change) |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: advisor_validate full-corpus top-1 ≥ 0.72 and holdout ≥ 0.63 after the fix (vs 0.5078/0.425 before), with scorer unchanged.
- **SC-002**: No previously-passing corpus row regresses (alias resolution is additive — only widens matches).
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Alias resolution over-matches (two distinct skills share a group) | False hits | Use the existing curated `aliases.ts` groups only; do not invent new aliases |
| Dependency | `lib/scorer/aliases.ts` group coverage | Some labels may lack a group | Phase 002 triages the ~8 rows still failing after alias normalization |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should the corpus also be relabelled to current IDs (belt-and-suspenders), or is alias-aware matching sufficient on its own? (Recommend alias-aware only; relabel optional.)
<!-- /ANCHOR:questions -->

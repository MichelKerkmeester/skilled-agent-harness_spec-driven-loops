---
title: "Feature Specification: Packet 069 Deep Review Remediation"
description: "Final remediation phase for Packet 069, clearing the 7-iteration deep-review FAIL verdict by fixing 2 P0, 7 P1, and 4 P2 findings before parent commit."
trigger_phrases:
  - "069 deep review remediation"
  - "packet 069 final remediation"
  - "motion.dev review findings"
  - "sk-code remediation phase 004"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/z_archive/007-sk-code-motion-dev-and-playbook/004-deep-review-remediation"
    last_updated_at: "2026-05-05T12:00:00Z"
    last_updated_by: "cli-codex"
    recent_action: "Remediating 13 deep-review findings"
    next_safe_action: "Validate post-remediation"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "implementation-summary.md"
      - "../../review/review-report.md"
      - "../../review/iterations/iteration-007.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "codex-2026-05-05"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "F-004 current workspace has no cached or unstaged Webflow pointer diff; no-clobber proof is empty-output pass."
      - "F-005 uses the documented Motion+ dynamic import path from motion-plus/animate-layout."
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: Packet 069 Deep Review Remediation

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-05-05 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Packet** | `004-deep-review-remediation` |
| **Source Verdict** | `../review/review-report.md` FAIL, 13 active findings |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The 7-iteration deep review for Packet 069 ended with a FAIL verdict. Two P0 blockers remain around Webflow no-clobber evidence and an undocumented Motion+ runnable snippet path. Seven P1 findings keep router, citation, continuity, snippet, and playbook precondition state inconsistent. Four P2 findings leave useful playbook polish and metadata accuracy gaps.

### Purpose
Clear every active finding from F-001 through F-014 except the superseded F-003 duplicate, restore Packet 069 to a PASS-ready state, and leave validation evidence for commit readiness.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Fix Motion router, Motion docs, snippet, playbook, graph metadata, parent spec, and child continuity files named in the finding ledger.
- Create this Phase 004 spec folder's Level 2 planning artifacts and implementation summary.
- Add a runnable Motion `stagger()` snippet and link local `motion_dev/` references from the MR/CB scenario files.
- Prove no Webflow pointer deletions are currently staged or unstaged.

### Out of Scope
- Rewriting Webflow pointer files when the current workspace has no Webflow diff to repair.
- Editing unrelated dirty files under `.opencode/specs/` or `sk-doc`.
- Removing the Motion+ layout snippet unless the documented dynamic-import path proves intractable.
- Running browser-based manual playbook scenarios.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `004-deep-review-remediation/*.md` | Create | Phase 004 planning and summary artifacts |
| `.opencode/skills/sk-code/SKILL.md` | Modify | Remove bare Motion terms from WEBFLOW surface detection |
| `.opencode/skills/sk-code/references/router/code_surface_detection.md` | Modify | Align surface-detection docs with MOTION_DEV intent design |
| `.opencode/skills/sk-code/README.md` | Modify | Align routing table and Motion peer-resource note |
| `.opencode/skills/sk-code/references/motion_dev/*.md` | Modify | Replace stale timeline citations |
| `.opencode/skills/sk-code/assets/motion_dev/snippets/*.js` | Modify/Create | Fix layout/ESM snippets and add stagger snippet |
| `.opencode/skills/sk-code/assets/motion_dev/playbook_entries.md` | Modify | Reference stagger snippet |
| `.opencode/skills/sk-code/manual_testing_playbook/**/*.md` | Modify | Add motion_dev preconditions, local scenario links, and dividers |
| `../spec.md` | Modify | Refresh parent phase status, phase map, and answered questions |
| `../00{1,2,3}-*/spec.md` | Modify | Refresh child continuity blocks only |
| `../003-cross-ref-metadata-sync/graph-metadata.json` | Modify | Update delivered causal summary |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | F-004 no-clobber proof is restored | `git diff --cached --numstat -- .opencode/skills/sk-code/references/webflow/` has no deletion evidence, or any deletion is explicitly documented |
| REQ-002 | F-005 layout snippet uses documented Motion+ path | `layout_transition.js` dynamically imports `unstable_animateLayout` from `motion-plus/animate-layout` and no longer probes undocumented globals |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | F-001 removes bare Motion surface markers | WEBFLOW surface detection no longer matches `from "motion"` or generic `motion.dev` |
| REQ-004 | F-002 removes stale timeline URL | `rg "motion\.dev/docs/timeline" .opencode/skills/sk-code/` returns zero hits |
| REQ-005 | F-006 fixes ESM bootstrap | Snippet uses dynamic import, try/catch, export validation, and reduced-motion fallback |
| REQ-006 | F-007/F-008 refresh continuity state | Parent status and child continuity blocks reflect completed work |
| REQ-007 | F-009/F-010 align playbook and summary state | Packet 2 summary, root playbook preconditions, and Motion asset count are current |

### P2 - Polish

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-008 | F-011/F-014 polish MR/CB scenario files | Seven scenario files include local `motion_dev/` links and divider lines |
| REQ-009 | F-012 adds stagger snippet | `stagger_animation.js` exists, parses, respects reduced motion, and uses Motion's `stagger()` helper |
| REQ-010 | F-013 updates graph causal summary | Packet 3 graph metadata describes delivered outcome, not pre-implementation need |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All active findings F-001, F-002, F-004 through F-014 are FIXED or explicitly documented.
- **SC-002**: Parent and child spec folders validate with strict spec validation.
- **SC-003**: Motion snippets parse with `node --check`.
- **SC-004**: No stale timeline URL remains under `.opencode/skills/sk-code/`.
- **SC-005**: No bare Motion marker remains in WEBFLOW surface-detection bash blocks.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Motion+ package availability | Dynamic import cannot run without private Motion+ install | Snippet catches import failure and documents early-access status |
| Risk | Current staged state differs from review evidence | F-004 could be fixed by workspace state rather than file edit | Record cached and unstaged no-clobber proof in implementation summary |
| Risk | Scope drift | Adjacent dirty `.opencode/specs` files exist | Touch only files named in the finding scope |
| Risk | Spec validation strictness | New phase docs may miss metadata | Add description and graph metadata for Phase 004 |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

- Remediation edits must be surgical and source-file backed.
- Snippets must stay runnable starts with missing-API guards.
- Documentation must remain ASCII-only and markdown-table friendly.
- Verification evidence must include command exit codes.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

- `motion-plus/animate-layout` can fail to resolve in ordinary environments; the snippet should no-op with a warning, not present an undocumented fallback.
- `node --check` parses dynamic imports but does not resolve external packages; runtime package access remains a Motion+ installation concern.
- `git diff --cached` may be empty if nothing is staged; F-004 accepts empty output as no-clobber proof because no Webflow deletion is present.
- Adding `stagger_animation.js` makes the Motion snippet inventory nine files after remediation, so Packet 2 summary must be updated.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ESTIMATION

| Dimension | Estimate | Rationale |
|-----------|----------|-----------|
| Files touched | Medium | Router docs, snippets, playbook files, specs, and metadata |
| Behavioral risk | Low | Mostly docs/snippets; no production runtime files |
| Coordination risk | Medium | Parent/child spec continuity and review findings must stay synchronized |
| Verification complexity | Medium | Requires strict spec validation, grep audits, snippet parse checks, and no-clobber proof |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None. The current workspace evidence is sufficient to remediate and validate all active findings.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- **Review report**: `../review/review-report.md`
- **Final adversarial pass**: `../review/iterations/iteration-007.md`
- **Implementation plan**: `plan.md`
- **Task ledger**: `tasks.md`
- **Verification checklist**: `checklist.md`
- **Implementation summary**: `implementation-summary.md`
<!-- /ANCHOR:related-docs -->

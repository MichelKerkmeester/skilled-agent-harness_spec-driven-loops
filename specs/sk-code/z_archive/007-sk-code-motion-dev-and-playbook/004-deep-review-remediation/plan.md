---
title: "Implementation Plan: Packet 069 Deep Review Remediation"
description: "Execution plan for clearing Packet 069 deep-review findings and restoring PASS readiness."
trigger_phrases:
  - "069 remediation plan"
  - "packet 069 deep review fix plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/z_archive/007-sk-code-motion-dev-and-playbook/004-deep-review-remediation"
    last_updated_at: "2026-05-05T12:00:00Z"
    last_updated_by: "cli-codex"
    recent_action: "Authored Phase 004 remediation plan"
    next_safe_action: "Validate post-remediation"
    blockers: []
    key_files:
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "codex-2026-05-05"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

# Implementation Plan: Packet 069 Deep Review Remediation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Surface** | OPENCODE skill docs/assets plus spec-kit docs |
| **Primary Skill** | `sk-code` for router/snippet changes; `sk-doc` for playbook/spec artifacts |
| **Source Ledger** | `../review/review-report.md`, `../review/iterations/iteration-007.md` |
| **Verification** | strict spec validation, grep audits, `node --check`, git no-clobber proof |

### Overview
Fix P0 blockers first, then clear required P1 consistency issues, then apply P2 polish. The implementation is intentionally narrow: every edit maps to an active finding or Phase 004 artifact.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Review report and iteration 007 read.
- [x] Parent spec context read.
- [x] Phase 004 spec folder pre-approved by user dispatch.
- [x] Target file list constrained to finding ledger.

### Definition of Done

- [x] All active findings fixed or explicitly documented.
- [x] Phase 004 artifacts authored.
- [ ] Strict validation exits 0.
- [ ] Grep and snippet verification commands exit with expected results.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Surgical remediation with evidence-driven verification.

### Key Components

- **Router docs**: remove bare Motion surface markers while preserving Webflow-specific runtime signals.
- **Motion snippets**: use documented APIs and reduced-motion fallbacks.
- **Playbook scenarios**: align local source links and section divider structure.
- **Spec continuity**: make parent and child resume state match actual implementation state.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: P0 Blockers

- Verify current Webflow cached/unstaged diff state.
- Fix `layout_transition.js` to use documented Motion+ dynamic import.

### Phase 2: P1 Required Fixes

- Remove bare Motion surface markers from SKILL/router/README.
- Replace stale timeline URL citations with animate docs URL.
- Fix `es_module_bootstrap.js`.
- Refresh parent/child continuity and Packet 2 snippet count.
- Add `motion_dev` to playbook preconditions.

### Phase 3: P2 Polish

- Add local `motion_dev/` links and dividers to seven MR/CB scenario files.
- Add `stagger_animation.js` and reference it.
- Update Packet 3 graph causal summary.

### Phase 4: Verification and Summary

- Run strict spec validation and targeted checks.
- Write implementation summary with findings status and command evidence.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Command |
|-----------|-------|---------|
| Spec validation | Parent and child docs | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh specs/sk-code/z_archive/007-sk-code-motion-dev-and-playbook --strict` |
| No-clobber | Webflow pointer diff | `git diff --cached --numstat -- .opencode/skills/sk-code/references/webflow/` |
| Citation drift | Motion timeline URL | `grep -rn "motion\\.dev/docs/timeline" .opencode/skills/sk-code/` |
| Snippet parse | Motion snippet JS | `node --check .opencode/skills/sk-code/assets/motion_dev/snippets/*.js` |
| Router regression | Bare Motion marker | `grep -n "from \\['\\\"]motion\\b\\|motion\\.dev" ...` |
| Playbook preconditions | Root setup gates | `grep -A 2 "Global Preconditions" ... | grep "motion_dev"` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Motion official docs | External | Verified for animate and layout pages | Needed for citation/API correction |
| Motion+ package | External/private | Not locally resolved | Snippet can parse and no-op on failed dynamic import |
| Existing spec validator | Internal | Available | Required before completion claim |
| Current git staged state | Internal | Cached Webflow diff currently empty | Determines F-004 remediation evidence |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- Revert only Phase 004 touched files if validation fails irreparably.
- For snippet regressions, restore prior snippet and document removal path B if the documented Motion+ import cannot remain as a runnable asset.
- For spec validation failures, patch the affected Phase 004 artifact against the Level 2 template contract.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```text
P0 fixes -> P1 consistency -> P2 polish -> verification -> implementation summary
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| P0 fixes | Review ledger | All later claims |
| P1 consistency | P0 fixes | Verification |
| P2 polish | P1 consistency | Final summary |
| Verification | All fixes | Completion claim |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| P0 fixes | Medium | 45 minutes |
| P1 consistency | Medium | 60 minutes |
| P2 polish | Low | 30 minutes |
| Verification and summary | Medium | 45 minutes |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-completion Checklist

- [x] Current target files read before edits.
- [x] Existing dirty unrelated files identified and ignored.
- [ ] Validation evidence recorded after all edits.

### Data Reversal

- No runtime data migrations or generated databases are modified.
<!-- /ANCHOR:enhanced-rollback -->

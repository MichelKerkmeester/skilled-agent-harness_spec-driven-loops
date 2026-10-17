---
title: "Feature Specification: sk-git setup customization: a doctor-style setup check so users can adapt sk-git to their own repository"
description: "[One-line description]"
trigger_phrases:
  - "git setup customization phase parent spec"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-git/033-git-setup-customization"
    last_updated_at: "2026-04-11T00:00:00Z"
    last_updated_by: "template-author"
    recent_action: "Initialize phase-parent continuity block"
    next_safe_action: "Plan or resume a child phase folder"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "template-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: phase-parent-spec | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT
  FORBIDDEN content (do NOT author at phase-parent level):
    - merge/migration/consolidation narratives (consolidate*, merged from, renamed from, collapsed, X→Y, reorganization history)
    - migrated from, ported from, originally in
    - heavy docs: plan.md, tasks.md, decision-record.md, implementation-summary.md: these belong in child phase folders only
  REQUIRED content (MUST author at phase-parent level):
    - Root purpose: what problem does this entire phased decomposition solve?
    - Sub-phase list: which child phase folders exist and what each one does
    - What needs done: the high-level outcome the phases work toward
-->

# Feature Specification: sk-git setup customization: a doctor-style setup check so users can adapt sk-git to their own repository

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | [YYYY-MM-DD] |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | scaffold/033-git-setup-customization |
| **Predecessor** | [Predecessor-packet] |
| **Successor** | [Successor-packet, or "None"] |
| **Handoff Criteria** | Validator + template + generator changes ship so parent validates under tolerant policy |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
sk-git has a dozen surfaces a repository can change, and several of them fail open: a missing contract, a rule naming an unknown check or an unregistered advisory hook gives no error. A user adapting sk-git to their own repository had no single check that shows which rules are live, which are absent and which are broken.

### Purpose
Give users a doctor-style setup check, `/doctor:git setup`, that reports one row per surface with its source, its result and the exact repair, and harden it through research, review and remediation phases.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, and decisions live in the child phase folders listed in the Phase Documentation Map below. This keeps the parent from drifting stale as phases execute and pivot.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
[Bullet list of what this phase decomposition covers]

### Out of Scope
[Bullet list of what is explicitly excluded]

### Files to Change
[Summary table of files touched across all phases: for audit trail only, per-phase detail lives in each child's plan.md]

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| [Path] | [Modify/Create] | [Phase-name] | [Description] |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | 001-deep-research/ | [Phase 1 scope] | Pending |
| 2 | 002-doctor-git-setup/ | [Phase 2 scope] | Pending |
| 3 | 003-improvement-research/ | [Phase 3 scope] | Pending |
| 4 | 004-final-deep-review/ | [Phase 4 scope] | Pending |
| 5 | 005-setup-check-hardening/ | Harden the setup battery: DEGRADED status, the two review P1 fixes, proved repairs, trust-boundary hardening, CI and doc fixes | Pending |
| 6 | 006-release-conformance-review/ | [Phase 6 scope] | Pending |
| 7 | 007-review-remediation/ | [Phase 7 scope] | Pending |
| 8 | 008-out-of-scope-cleanup/ | Fix the four issues phase 7 found outside its scope: drift guard evidence skip, phrase-reach test, Hermes header semicolons, sk-create-command gate position | Complete |
| 9 | 009-second-review-remediation/ | [Phase 9 scope] | Pending |
| 10 | 010-open-ends-cleanup/ | Close four open ends from the doctor releases: the adapter binding check, the hub check on sk-prompt, the synthesis count check and the Human Voice blockers | Complete |
| 11 | 011-remaining-limits/ | Close four limits left after phase 10: the identifier default export in the adapter check, the drift warnings from spec scratch, the advisor playbook warnings and the lease stress budget | Complete |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/spec_kit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-deep-research | 002-doctor-git-setup | [Criteria TBD] | [Verification TBD] |
| 002-doctor-git-setup | 003-improvement-research | [Criteria TBD] | [Verification TBD] |
| 003-improvement-research | 004-final-deep-review | [Criteria TBD] | [Verification TBD] |
| 004-final-deep-review | 005-setup-check-hardening | The review report names its active findings and Planning Packet | `004-final-deep-review/review/review-report.md` sections 2 and 3 |
| 005-setup-check-hardening | 006-release-conformance-review | [Criteria TBD] | [Verification TBD] |
| 006-release-conformance-review | 007-review-remediation | [Criteria TBD] | [Verification TBD] |
| 007-review-remediation | 008-out-of-scope-cleanup | Phase 7 records the four issues it left out of scope | `007-review-remediation/implementation-summary.md` known limitations |
| 008-out-of-scope-cleanup | 009-second-review-remediation | [Criteria TBD] | [Verification TBD] |
| 009-second-review-remediation | 010-open-ends-cleanup | Phase 9 records the four open ends it left | `010-open-ends-cleanup/plan.md` section 3 |
| 010-open-ends-cleanup | 011-remaining-limits | Phase 10 records the adapter export limit it left | `010-open-ends-cleanup/implementation-summary.md` known limitations |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- [Open question 1]
- [Open question 2]
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md
- **Parent Spec**: See `../spec.md`
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer

---
title: "Feature Specification: Phase 3: current-state-discipline"
description: "Phase 3 (T4): broaden the current-state-only content discipline beyond phase parents to more long-lived docs, as an advisory (info-severity) check that prevents doc rot."
trigger_phrases:
  - "feature"
  - "specification"
  - "name"
  - "template"
  - "spec core"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/003-xce-research-based-refinement/001-research-and-doctrine/001-peck-teachings-adoption/003-current-state-discipline"
    last_updated_at: "2026-06-10T06:45:00Z"
    last_updated_by: "gpt-5.5-fast"
    recent_action: "Registered info current-state advisory"
    next_safe_action: "No follow-up; phase complete"
    blockers: []
    key_files:
      - "scripts/rules/check-phase-parent-content.sh"
      - "scripts/lib/validator-registry.json"
      - "references/validation/validation_rules.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/003-current-state-discipline"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 3: current-state-discipline

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Completed |
| **Created** | 2026-06-02 |
| **Branch** | `001-peck-teachings-adoption` |
| **Parent Spec** | ../spec.md |
| **Phase** | 3 of 4 |
| **Predecessor** | 002-self-check-templates |
| **Successor** | 004-constitutional-rule-review |
| **Handoff Criteria** | Met: advisory rule registered; no strict errors added |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 3** of the Adopt low-risk peck teachings (T3 self-check templates, T4 current-state discipline, T2 constitutional rule review) into system-spec-kit specification.

**Scope Boundary**: One advisory validation rule plus its docs. The existing phase-parent content rule is reused, not rewritten. No hard-blocking severity.

**Dependencies**:
- The existing `check-phase-parent-content.sh` rule and its code-fence/comment-aware scanning logic (to reuse).
- `validator-registry.json` (to register the new rule).

**Deliverables**:
- An advisory (info-severity) check that flags stale-history narrative in long-lived docs beyond phase parents.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent phase folder name plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The "describe current state, not history" discipline is enforced only for phase-parent spec.md today (the PHASE_PARENT_CONTENT rule). Other long-lived docs, such as implementation-summary.md and non-parent spec.md, accrete "we used to do X, then changed to Y" narrative that rots and misleads future readers. Peck keeps a living doc that only describes what exists now, so it cannot go stale (the peck-adoption phase, T4).

### Purpose
Broaden the current-state discipline to more documents as an advisory **INFO** check (see `../001-peck-teachings-for-spec-kit/research/research.md` §4 — a WARNING would become a blocking error under `--strict`), preventing rot without hard-blocking ordinary work.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Wave 1: extend the existing content scanner (or add a sibling rule) to scan implementation-summary.md for history-narrative tokens. Non-parent spec.md is a deferred wave 2 (research.md §4, to limit false positives).
- Register it at INFO severity (research.md §4 — WARNING becomes a blocking ERROR under `--strict`; INFO never blocks). Promote to WARNING later only behind a rollout flag after baseline cleanup.
- Review the broad `consolidat[a-z]*` token before broadening — "consolidated findings" is legitimate current-state prose, not migration history.
- Document it in `validation_rules.md`.
- Reuse the existing code-fence + HTML-comment-aware scanning so legitimate examples do not trip it.

### Out of Scope
- Hard-blocking (ERROR) severity.
- Changing the existing phase-parent rule's behavior.
- Scanning decision-record.md, changelog/, and context-index.md (legitimately historical - exempt).
- Non-parent spec.md in wave 1 (deferred to wave 2).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `scripts/rules/check-phase-parent-content.sh` (or a new sibling rule) | Modify/Create | Broaden scan to more doc types |
| `scripts/lib/validator-registry.json` | Modify | Register the advisory rule (severity: info) |
| `references/validation/validation_rules.md` | Modify | Document the new rule + exemptions |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | An advisory INFO check flags history-narrative tokens in implementation-summary.md (wave 1) | Given a doc containing "merged from" / "renamed from", when the rule runs, then it emits an INFO finding citing the line |
| REQ-002 | The check is code-fence + HTML-comment aware | Given the same tokens inside a fenced block or comment, when the rule runs, then it does NOT warn |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | decision-record.md and changelog/ are exempt | Given those files, when the rule runs, then no warning is emitted |
| REQ-004 | No new ERRORs on the existing repo | Given the current tracks, when validation runs in normal mode, then only warnings (no errors) are introduced |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The advisory fires on a doc containing history-narrative tokens and stays silent on exempt docs and fenced examples.
- **SC-002**: Running strict validation on an already-valid folder still exits 0.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | False positives on legitimate retrospective sections | Noise, ignored warnings | Advisory severity + explicit exemptions (decision-record, changelog) |
| Risk | WARNING becomes blocking under `--strict` | Completion gate could fail unexpectedly | RESOLVED: ship as INFO (never blocks, even under --strict); promote to WARNING only behind a rollout flag after baseline cleanup |
| Dependency | Existing scanner logic | Reinventing fence-awareness risks regressions | Reuse `check-phase-parent-content.sh` helpers |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- RESOLVED (research.md §4): ship as INFO (WARNING becomes a blocking error under --strict); promote only behind a rollout flag later.
- RESOLVED (research.md §4): wave 1 scans implementation-summary.md only; non-parent spec.md deferred to wave 2.
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->


<!-- SCAFFOLD_VALIDATION_COUNTS:
REQ-003
REQ-004
REQ-005
REQ-006
REQ-007
REQ-008
**Given**
**Given**
**Given**
**Given**
**Given**
**Given**
-->

---
title: "Feature Specification: Reference Sweep, Validation & Guard [133/006-reference-sweep-validation-guard/spec]"
description: "Sweep the ~79 active-skill external referrers to renamed snippets, prove zero broken numbered-snippet links in active scope, run full validation, optionally add a reintroduction guard, reconcile completion metadata, and save memory."
trigger_phrases:
  - "reference sweep numbered snippets"
  - "validation guard memory save denumber"
  - "133 phase 006"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/133-catalog-playbook-snippet-denumbering/006-reference-sweep-validation-guard"
    last_updated_at: "2026-06-06T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored phase 006 spec during 133 scaffold"
    next_safe_action: "Run after waves A/B/C complete"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Feature Specification: Reference Sweep, Validation & Guard

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 (closes the program) |
| **Status** | Planned (tasks/checklist populated on entry) |
| **Created** | 2026-06-06 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
After the migration waves, snippets are de-numbered but cross-cutting references outside the per-skill trees may still point at old numbered paths: ~822 referrers total — ~79 active-skill (changelogs, references, other root docs) plus ~743 historical `.opencode/specs/**` packet docs (included per D2) — plus the create-commands already touched in phase 001. Without a final sweep + validation, broken links could ship silently, and nothing prevents a future author from reintroducing numbered snippet files.

### Purpose
Close the program: sweep the active-scope referrers, prove zero broken numbered-snippet links in active scope, run full validation, optionally add a lightweight reintroduction guard, reconcile completion metadata across the packet, and save memory.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Rewrite ALL remaining numbered-snippet referrers (D2): ~79 active-skill (changelogs, `references/**`, cross-skill root docs) PLUS ~743 historical `.opencode/specs/**` packet docs.
- Repo-wide verification: zero broken links to numbered snippet paths across active skills AND spec folders.
- Optional reintroduction guard (a CI-wired check / sk-doc validator note) that flags a newly-added numbered snippet file under a catalog/playbook category dir.
- Completion-metadata reconciliation: parent `spec.md` status + phase-map, each child's status, `graph-metadata.json` derived status.
- Merge the dedicated worktree to `main` (D3) once validation is green.
- Memory save via `generate-context.js`.

### Out of Scope
- Any further snippet rename (done in waves).
- The frozen anomalies per D4 (uppercase `FEATURE_CATALOG.md`, `z_future/backup`).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| active-skill referrers (changelogs, references, cross-skill root docs) | Modify | Rewrite ~79 links to renamed snippets |
| optional guard (CI hook / validator note) | Create | Flag reintroduced numbered snippet files |
| `133-.../spec.md`, child specs, `graph-metadata.json` | Modify | Completion reconciliation |
| memory DB (via `generate-context.js`) | Update | Packet memory save |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Zero broken numbered-snippet links across active skills + spec folders (D2) | repo-wide link audit (skills + `.opencode/specs/**`) = 0 broken |
| REQ-002 | Zero numbered snippet FILES remain in active scope | `rg --files | rg '/(feature_catalog|manual_testing_playbook)/.*/[0-9]{2,3}-[a-z].*\.md$'` (excl frozen) = 0 |
| REQ-003 | Completion metadata reconciled across the packet | parent + 6 children statuses consistent; `validate.sh --recursive` green |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Reintroduction guard in place (or explicitly deferred) | guard flags a planted numbered snippet in a test, OR deferral recorded |
| REQ-005 | Memory saved | `generate-context.js` run; POST-SAVE QUALITY REVIEW clean |
| REQ-006 | DeepSeek final adversarial audit | audit confirms no missed active referrer class |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Active scope has zero numbered snippet files and zero broken numbered-snippet links.
- **SC-002**: `validate.sh --recursive` on the 133 parent passes; statuses reconciled.
- **SC-003**: Memory saved; optional guard prevents silent reintroduction.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A referrer class missed (e.g. SKILL.md deep links) | Med | DeepSeek adversarial audit + the same `.md`-anchored grep used in discovery |
| Risk | Guard false-positives on legitimate numbered dirs | Low | Guard targets FILE prefix only, not category dirs |
| Dependency | Waves A/B/C complete | Blocking | Global gate must be green |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 10/25 | ~79 referrers + guard + reconciliation |
| Risk | 10/25 | Missed-referrer + completion-claim accuracy |
| Research | 4/20 | Referrer set already enumerated |
| **Total** | **24/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- D2 confirms whether spec-folder referrers are excluded (default) or folded into this sweep.
- Guard form (CI check vs validator note) decided on entry.
<!-- /ANCHOR:questions -->

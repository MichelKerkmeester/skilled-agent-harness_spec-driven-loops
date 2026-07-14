---
title: "Feature Specification: sk-git Feature Catalog and Manual-Playbook Coverage"
description: "Author sk-git's missing create-skill-canon documentation surface: a feature catalog covering every sk-git capability including the worktree tooling scripts (allocator, launch wrapper, reaper, pre-push hook), and new manual-testing-playbook scenarios for the owner-first worktree tooling, both conformant to the sk-doc create-feature-catalog and create-manual-testing-playbook canon."
trigger_phrases:
  - "sk-git feature catalog"
  - "sk-git manual playbook scenarios"
  - "worktree tooling documentation"
importance_tier: "important"
contextType: "implementation"
status: "complete"
_memory:
  continuity:
    packet_pointer: "sk-git/004-feature-catalog-and-manual-playbook"
    last_updated_at: "2026-07-14T14:13:28Z"
    last_updated_by: "claude"
    recent_action: "Completed catalog and playbook"
    next_safe_action: "Commit packet 004 deliverables"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-git-feature-catalog-playbook"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Feature Specification: sk-git Feature Catalog and Manual-Playbook Coverage

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

## EXECUTIVE SUMMARY

sk-git ships four executable tools (the owner-first number allocator/validators, the launch-wrapper session isolator, the worktree reaper, and the pre-push naming hook) plus its established worktree/commit/finish workflows, but it has **no feature catalog** and its 22-scenario manual-testing playbook does not yet cover the new worktree tooling. This packet closes both gaps to the sk-doc create-skill canon: it authors `feature_catalog/feature_catalog.md` per the `create-feature-catalog` template and adds a new manual-playbook category with executable scenarios for the owner-first worktree tooling per the `create-manual-testing-playbook` template.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 (documentation + QA coverage) |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-07-14 |
| **Branch** | `skilled/v4.0.0.0` |
| **Track** | `sk-git` |
| **Sibling** | `003-review-remediation-and-alignment` (the code hardening these docs describe) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The create-skill canon expects every skill to carry a feature catalog and a manual-testing playbook that covers its full surface. sk-git has neither the catalog nor playbook coverage for the worktree tooling it gained in `002`/`003` — so the allocator, wrapper, reaper, and pre-push hook are undocumented as first-class features and unexercised by the playbook.

### Purpose

Bring sk-git to catalog + playbook parity with its siblings (sk-code, sk-design): a proportionate feature catalog enumerating every capability including the scripts, and executable playbook scenarios that validate the owner-first worktree tooling's behavior and safety contract.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- `.opencode/skills/sk-git/feature_catalog/feature_catalog.md` — new, per `create-feature-catalog` canon.
- New manual-playbook category + scenario files under `.opencode/skills/sk-git/manual_testing_playbook/` for the owner-first worktree tooling, per `create-manual-testing-playbook` canon; the root playbook index/coverage-note/count updated.
- Any SKILL.md / README / graph-metadata cross-references needed to register the catalog (orchestrator-owned).

### Out of Scope

- The code fixes themselves (owned by `003`); this packet documents the stable feature surface + intended safety contract.
- Rewriting the existing 22 playbook scenarios (only additive coverage for the new tooling).
- The hyphen-naming migration (create-skill canon currently uses snake_case; do not rename).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-git/feature_catalog/feature_catalog.md` | Create | Feature catalog per canon |
| `.opencode/skills/sk-git/manual_testing_playbook/**` | Create/Modify | New worktree-tooling category + scenarios; index update |
| `.opencode/skills/sk-git/SKILL.md` / `README.md` / `graph-metadata.json` | Modify | Register the catalog / reference the new scenarios (orchestrator) |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Feature catalog exists and conforms to the create-feature-catalog canon | `feature_catalog/feature_catalog.md` present; frontmatter + section structure match the template; `package_skill.py --check` on sk-git stays PASS |
| REQ-002 | Catalog enumerates every sk-git capability including the four scripts | Allocator/validators, launch wrapper, reaper, pre-push hook, plus worktree/commit/finish/CI/GitKraken/GitHub/reorg features each cataloged with purpose + entry point |
| REQ-003 | New playbook scenarios cover the owner-first worktree tooling | A new category with scenarios for allocator, session wrapper, reaper, and pre-push, each with a stable `GIT-NNN` ID continuing the existing scheme |
| REQ-004 | Playbook additions conform to the create-manual-testing-playbook canon | Scenario file structure matches the template; the root index, coverage note, and scenario count updated; execution policy honored |
| REQ-005 | No broken links introduced hub-wide | Every new internal link resolves; sk-git link check clean |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `feature_catalog/feature_catalog.md` exists and conforms to the create-feature-catalog canon.
- **SC-002**: Every sk-git capability, including the four scripts, is cataloged.
- **SC-003**: New playbook scenarios cover the allocator, wrapper, reaper, and pre-push, conformant to the create-manual-testing-playbook canon.
- **SC-004**: `package_skill.py --check` on sk-git stays PASS; zero broken links hub-wide.
- **SC-005**: `validate.sh --strict` on this packet Errors 0.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The scripts documented here are hardened in parallel by `003` | Medium | Document the stable interface + intended safety contract; converge docs with code before final |
| Risk | Two parallel builders edit a shared file (SKILL.md/README) | Medium | Builders scoped to their own deliverable files; orchestrator owns shared-file registration |
| Risk | Catalog over/under-scoped vs canon | Low | Follow the create-feature-catalog template + a concise sibling (sk-design) as the granularity model |
<!-- /ANCHOR:risks -->

---

## 7. NON-FUNCTIONAL REQUIREMENTS

### Documentation Quality
- Catalog + scenarios must pass the canonical checkers; proportionate depth (sk-git is a leaf skill with four scripts + workflow references).

## 8. EDGE CASES

- A feature that is workflow-only (no script) vs script-backed; scenarios that assert a safety guarantee still landing in `003`; the wrapper lane's exemption from the numbered grammar.

## 9. COMPLEXITY ASSESSMENT

Documentation-only, additive, no architecture decision — Level 2. Two disjoint deliverables (catalog, playbook scenarios) build in parallel; a canon-conformance verify pass gates completion.

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

| # | Question | Resolution |
|---|----------|------------|
| Q1 | New packet vs fold into 003 | Resolved — new packet; operator authorized "create new phase if relevant" and this is a distinct doc workstream |
| Q2 | Catalog granularity | Resolved — follow the create-feature-catalog template; model depth on the concise sk-design sibling, not the 5000-line system-spec-kit catalog |
<!-- /ANCHOR:questions -->

## 11. RELATED DOCUMENTS

- Plan: `plan.md`
- Tasks: `tasks.md`
- Checklist: `checklist.md`
- Sibling (code hardening): `../003-review-remediation-and-alignment/spec.md`
- Canon: `../../../skills/sk-doc/create-feature-catalog/`, `../../../skills/sk-doc/create-manual-testing-playbook/`

---
title: "Feature Specification: sk-git README Enrichment and Hyphen-Naming Migration"
description: "Enrich sk-git's README to the sk-doc create-readme canon (the unique what/why of the git skill), add concise code READMEs for the script and CI/hook surfaces, and migrate the skill's underscore filesystem names (references/assets/feature-catalog/manual-testing-playbook + nested dirs) to hyphen-case ahead of the sk-doc/017 convention, updating every path reference including the SKILL.md Smart Router."
trigger_phrases:
  - "sk-git readme enrichment"
  - "sk-git hyphen naming migration"
  - "sk-git code readmes"
importance_tier: "important"
contextType: "implementation"
status: "complete"
_memory:
  continuity:
    packet_pointer: "sk-git/005-readme-enrichment-and-hyphen-naming"
    last_updated_at: "2026-07-14T18:00:00Z"
    last_updated_by: "claude"
    recent_action: "Executed rename + ref-update + READMEs; all gates green"
    next_safe_action: "Commit the whole skill in one commit; push"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-git-readme-hyphen-naming"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Feature Specification: sk-git README Enrichment and Hyphen-Naming Migration

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

## EXECUTIVE SUMMARY

sk-git's `README.md` is thin — it does not convey the skill's unique surface or the *why* behind its design (owner-first grammar, the ask-first workspace rule, launch-wrapper autosync, the reaper's safety contract), and the script and CI/hook surfaces carry no code READMEs. Separately, the skill still uses `snake_case` filesystem names for its `references/`, `assets/`, `feature_catalog/`, and `manual_testing_playbook/` trees, whereas the repo is moving to hyphen-case (the `sk-doc/017-hyphen-naming-convention` program). This packet (1) rewrites `README.md` to the `create-readme` canon, (2) adds concise code READMEs for `scripts/`, `scripts/tests/`, `.github/workflows/`, and `.github/hooks/scripts/`, and (3) migrates the underscore names to hyphen-case now — updating every path reference, most critically the 45 hardcoded resource paths in the SKILL.md Smart Router — so sk-git leads the 017 convention cleanly.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 (documentation + a ref-integrity-critical rename migration) |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-07-14 |
| **Branch** | `skilled/v4.0.0.0` |
| **Track** | `sk-git` |
| **Leads** | `sk-doc/017-hyphen-naming-convention` (applies its convention to sk-git ahead of the program) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Three gaps: (a) `README.md` is too thin to orient a reader on what sk-git uniquely does and why; (b) the executable surfaces (`scripts/`, `scripts/tests/`, `.github/workflows/`, `.github/hooks/scripts/`) have no code READMEs; (c) the skill's filesystem names are `snake_case`, out of step with the hyphen-case direction the repo is adopting.

### Purpose

Bring sk-git's documentation surface to the `create-readme` canon and pre-adopt the hyphen-case filesystem convention, so the skill is self-explaining and consistent with where the repo is heading — without breaking any path reference or the SKILL.md Smart Router.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Rewrite `.opencode/skills/sk-git/README.md` to the `create-readme` canon (unique content, the *why*).
- New code READMEs: `scripts/README.md`, `scripts/tests/README.md`, `.github/workflows/README.md`, `.github/hooks/scripts/README.md`.
- Rename underscore names → hyphen-case across `references/`, `assets/`, `feature_catalog/` → `feature-catalog/`, `manual_testing_playbook/` → `manual-testing-playbook/`, and every nested directory, via `git mv` (history-preserving).
- Update **every** path reference: SKILL.md (incl. the Smart Router `RESOURCE_MAP`/`LOADING_LEVELS`/router-signals), README, feature-catalog + playbook internal links, cross-file refs inside `references/`, and `graph-metadata.json`.

### Out of Scope

- `scripts/*.sh` are already hyphen-named (`worktree-naming.sh` etc.) — no rename.
- Python files / Python package dirs / tool-mandated names (017 exemptions) — none present in the rename set, but the exemption stands.
- Changing any script behavior, the owner-first grammar, or the 002/003 tooling.
- The broader repo-wide 017 migration (this packet is the sk-git pilot only).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-git/README.md` | Modify | Rewrite to `create-readme` canon |
| `.opencode/skills/sk-git/scripts/README.md` + `scripts/tests/README.md` | Create | Code READMEs |
| `.github/workflows/README.md` + `.github/hooks/scripts/README.md` | Create | Code READMEs |
| `references/**`, `assets/**`, `feature_catalog/**`, `manual_testing_playbook/**` | Rename | snake_case → hyphen-case (`git mv`) |
| `.opencode/skills/sk-git/SKILL.md` | Modify | Update all 45 resource-path refs + Smart Router |
| `.opencode/skills/sk-git/graph-metadata.json` | Modify | Update any renamed-path references |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `README.md` conforms to the create-readme canon and conveys sk-git's unique what/why | Rewritten README covers the owner-first grammar, ask-first workspace rule, launch-wrapper/autosync, reaper safety contract, and the script/reference surface; `package_skill.py --check` stays PASS |
| REQ-002 | Code READMEs exist for the four executable surfaces | `scripts/README.md`, `scripts/tests/README.md`, `.github/workflows/README.md`, `.github/hooks/scripts/README.md` present, concise, accurate to the files they document |
| REQ-003 | All underscore names in the four trees are hyphen-case, history preserved | `git mv` used (rename status `R`); no underscore-named dir/file remains under the four trees (excluding 017 exemptions) |
| REQ-004 | Every path reference resolves after the rename | SKILL.md (incl. Smart Router), README, catalog/playbook internal links, cross-file refs, and `graph-metadata.json` updated; hub-wide link check reports 0 broken links |
| REQ-005 | The SKILL.md Smart Router still resolves its resources | All `RESOURCE_MAP`/`LOADING_LEVELS`/`DEFAULT_RESOURCE` paths point at existing hyphen-named files |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `README.md` rewritten to canon; `package_skill.py --check` PASS.
- **SC-002**: Four code READMEs exist and are accurate.
- **SC-003**: All underscore names migrated to hyphen-case via `git mv` (0 remaining, exemptions aside).
- **SC-004**: 0 broken links hub-wide; the Smart Router resolves every resource path.
- **SC-005**: `validate.sh --strict` on this packet Errors 0.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | SKILL.md Smart Router has 45 hardcoded resource paths | High — a missed path breaks routing | Rename first, then update refs; grep for any surviving underscore resource path; verify router paths resolve on disk |
| Risk | Per-surface staging drops cross-surface ref fixes → broken links | Medium | Stage the whole skill in one commit; run a hub-wide link check before commit |
| Dependency | `sk-doc/017` convention not yet published | Low | 017 phase-001 documents the exemptions; `package_skill.py` snake_case finding is advisory-only (never fails `--check`) |
<!-- /ANCHOR:risks -->

---

## 7. NON-FUNCTIONAL REQUIREMENTS

### Documentation Quality
- READMEs follow the create-readme canon; proportionate depth for a leaf skill.

### Compatibility
- `git mv` preserves history; no behavior change to any script; the Smart Router keeps resolving.

## 8. EDGE CASES

- A reference that appears both as a link target and inside the Smart Router pseudocode; a nested category dir renamed while its files are also renamed; a `.github` surface outside the skill tree needing its own README; the 017 Python/tool-mandated exemption (none in scope here, but honored).

## 9. COMPLEXITY ASSESSMENT

Documentation authoring plus a mechanical-but-ref-integrity-critical rename (13 dirs + 66 files, 45+ SKILL.md refs). Level 2: additive docs + a bounded single-skill migration, gated by a hub-wide link check.

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

| # | Question | Resolution |
|---|----------|------------|
| Q1 | Rename now vs wait for the 017 program | Resolved — operator directed pre-adopting the hyphen convention for sk-git now; `package_skill.py` snake_case finding is advisory-only |
| Q2 | Rename `scripts/*.sh` too | Resolved — no; they are already hyphen-named |
<!-- /ANCHOR:questions -->

## 11. RELATED DOCUMENTS

- Plan: `plan.md`
- Tasks: `tasks.md`
- Checklist: `checklist.md`
- Convention program: `../../sk-doc/017-hyphen-naming-convention/`
- Canon: `../../../skills/sk-doc/create-readme/`

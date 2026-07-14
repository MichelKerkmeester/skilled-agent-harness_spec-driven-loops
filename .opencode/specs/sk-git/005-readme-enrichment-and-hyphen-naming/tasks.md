---
title: "Tasks: sk-git README Enrichment and Hyphen-Naming Migration"
description: "Task queue for the sk-git README enrichment + hyphen-case migration: git-mv the underscore names, update every path reference including the SKILL.md Smart Router, author the READMEs, and verify link integrity."
trigger_phrases:
  - "sk-git readme enrichment tasks"
  - "sk-git hyphen naming tasks"
  - "sk-git code readmes tasks"
importance_tier: "important"
contextType: "implementation"
status: "complete"
_memory:
  continuity:
    packet_pointer: "sk-git/005-readme-enrichment-and-hyphen-naming"
    last_updated_at: "2026-07-14T18:00:00Z"
    last_updated_by: "claude"
    recent_action: "All tasks executed and verified"
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
# Tasks: sk-git README Enrichment and Hyphen-Naming Migration

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable after dependencies are satisfied |
| `[B]` | Blocked by an explicit gate |

**Task Format**: T### [P?] Description (artifact)
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Census the rename scope (13 underscore dirs + 66 underscore `.md` files; 0 `.py`) and the 45 SKILL.md resource-path refs — captured in `spec.md` §3 and `plan.md` §3
- [x] T002 Freeze the rename-first-then-update-refs plan — `spec.md` + `plan.md`
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Rename (history-preserving)

- [x] T010 `git mv` every underscore directory to hyphen-case (`feature_catalog/` → `feature-catalog/`, `manual_testing_playbook/` → `manual-testing-playbook/`, and nested category dirs), deepest first (REQ-003) — 13 dirs renamed `R`, `find -name '*_*'` = 0
- [x] T011 `git mv` every underscore `.md` file to hyphen-case across the four trees (REQ-003) — 66 files renamed, 0 failures, history preserved

### Update references

- [x] T020 Update SKILL.md — all 45 resource-path refs incl. the Smart Router `RESOURCE_MAP`/`LOADING_LEVELS`/`DEFAULT_RESOURCE` (REQ-004, REQ-005) — path-anchored transform; router-path existence sweep 0 missing
- [x] T021 Update `feature-catalog/feature-catalog.md` + `manual-testing-playbook/manual-testing-playbook.md` internal links and cross-file refs inside `references/` (REQ-004) — 109 resolve-guided cross-link fixes across 22 files
- [x] T022 Update `graph-metadata.json` renamed-path references (REQ-004) — 19 path values hyphenated, JSON valid
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-2b -->
### Author READMEs

- [x] T030 Rewrite `README.md` to the create-readme canon — owner-first grammar, ask-first rule, launch-wrapper/autosync, reaper contract, resource surface (REQ-001) — `README.md`, `package_skill.py --check` PASS
- [x] T031 [P] Add `scripts/README.md` + `scripts/tests/README.md` code READMEs (REQ-002) — both present, all links resolve
- [x] T032 [P] Add `.github/workflows/README.md` + `.github/hooks/scripts/README.md` code READMEs (REQ-002) — both present, all links resolve
<!-- /ANCHOR:phase-2b -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T040 Sweep for any surviving underscore resource path; confirm every Smart Router path resolves on disk (REQ-005) — 0 surviving in target set; SKILL.md router-path sweep = `0 missing`
- [x] T041 Hub-wide markdown link check — 0 broken links (REQ-004) — `165 checked, 0 broken`; 109 cross-links repaired + the pre-existing `assets/pr-template.md` example de-linked
- [x] T042 `package_skill.py --check` PASS; regenerate `graph-metadata.json`/`description.json`; `validate.sh --strict` Errors 0 (SC-001, SC-005) — `--check` PASS (snake_case warnings advisory-only); frontmatter versions exit 0
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All underscore names migrated to hyphen-case via `git mv` (0 remaining, exemptions aside); history preserved
- [x] Every path reference resolves; the Smart Router resolves every resource path (`0 missing`); `165 checked, 0 broken` links hub-wide
- [x] `README.md` rewritten to canon + four code READMEs present; `package_skill.py --check` PASS; packet validate Errors 0
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Checklist**: `checklist.md`
- **Convention program**: `../../sk-doc/017-hyphen-naming-convention/`
<!-- /ANCHOR:cross-refs -->

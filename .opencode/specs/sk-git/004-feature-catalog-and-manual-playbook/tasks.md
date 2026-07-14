---
title: "Tasks: sk-git Feature Catalog and Manual-Playbook Coverage"
description: "Task queue for sk-git's create-skill-canon documentation surface: build the feature catalog and owner-first worktree-tooling playbook scenarios via parallel Sonnet-5 builders, verify against canon, register, and reconcile."
trigger_phrases:
  - "sk-git feature catalog tasks"
  - "sk-git playbook scenarios tasks"
  - "worktree tooling documentation tasks"
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
# Tasks: sk-git Feature Catalog and Manual-Playbook Coverage

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

- [x] T001 Scout the create-skill canon (create-feature-catalog + create-manual-testing-playbook) and sk-git's existing surface (22-scenario playbook, no feature catalog) — captured in `spec.md` §2-3
- [x] T002 Frame this packet and the parallel build plan — `spec.md` + `plan.md`
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

> Two disjoint deliverables build in parallel via Sonnet-5 (xhigh); each builder writes only its deliverable files and self-checks `package_skill.py --check`. The orchestrator owns SKILL.md/README/graph-metadata registration.

### Builder A — feature catalog

- [x] T010 [P] Create the feature catalog per the create-feature-catalog template, cataloging all 11 capabilities including the four scripts — `feature_catalog/feature_catalog.md` + 11 per-feature files across `worktree_naming/`, `session_lifecycle/`, `workflow_playbooks/`, `remote_platform_integration/`
- [x] T011 [P] Self-verify — `package_skill.py --check` on sk-git returns `Result: PASS`; reviewer reported `brokenLinks: []` (29 internal + 33 source-anchor paths resolve)

### Builder B — playbook scenarios

- [x] T020 [P] Add a worktree-tooling category with GIT-NNN scenarios for allocator/wrapper/reaper/pre-push (valid + invalid) — `manual_testing_playbook/owner_first_worktree_tooling/` (19 files, `GIT-023`..`GIT-041`)
- [x] T021 [P] Update the root index/count/coverage-note — `manual_testing_playbook/manual_testing_playbook.md` (scenario count 22→41, categories 6→7, §13/§14/§15 added)
- [x] T022 [P] Self-verify — `package_skill.py --check` returns `Result: PASS`; reviewer reported `brokenLinks: []`

### Verify (parallel reviewers)

- [x] T030 [P] Fresh reviewer verified the catalog against the canon — verdict `conformant: true`, `checkerPass: true`, `brokenLinks: []`, `findings: []`
- [x] T031 [P] Fresh reviewer verified the scenarios against the canon — verdict `conformant: true`, `checkerPass: true`, `brokenLinks: []` (one P1: pre-existing hyphenated paths, fixed in T032)
- [x] T032 Apply the reviewer P1 — reconciled the pre-existing hyphenated `worktree-setup/...` paths in `manual_testing_playbook.md` (lines 15-20 + §15) to on-disk `underscore_case`

### Register + reconcile (orchestrator)

- [x] T040 Add SKILL.md + README cross-references — `SKILL.md` §8 (Feature Catalog subsection + corrected playbook path/count), `README.md` VERIFICATION + RELATED DOCUMENTS rows, `changelog/v1.3.0.0.md` (version `1.3.0.0`/`1.1.0.28`)
- [x] T041 Reconcile packet docs; regenerate metadata last — `description.json` + `graph-metadata.json` refreshed; `validate.sh --strict` Errors 0
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T050 `package_skill.py --check` on sk-git returns `Result: PASS`; link-resolution scan of `manual_testing_playbook.md` reports 0 unresolved category-file targets
- [x] T051 `validate.sh --strict` on this packet — `Summary: Errors: 0`
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] Feature catalog exists and conforms to canon, cataloging every capability incl. the four scripts — `feature_catalog/feature_catalog.md` (+ 11 files); reviewer `conformant: true`
- [x] New playbook scenarios cover the owner-first worktree tooling, conformant to canon — `owner_first_worktree_tooling/` (19 files, `GIT-023`..`GIT-041`); reviewer `conformant: true`
- [x] `package_skill.py --check` PASS; zero broken links; packet validate Errors 0 — checker `Result: PASS`; `validate.sh --strict` `Errors: 0`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Checklist**: `checklist.md`
- **Sibling (code hardening)**: `../003-review-remediation-and-alignment/spec.md`
<!-- /ANCHOR:cross-refs -->

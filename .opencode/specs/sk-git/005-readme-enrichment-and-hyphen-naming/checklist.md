---
title: "Checklist: sk-git README Enrichment and Hyphen-Naming Migration"
description: "QA gate for the sk-git README enrichment + hyphen-case migration: the rename preserves history and completeness, every path reference (incl. the Smart Router) resolves, the READMEs conform to canon, and no link breaks hub-wide."
trigger_phrases:
  - "sk-git readme enrichment checklist"
  - "sk-git hyphen naming checklist"
  - "sk-git code readmes checklist"
importance_tier: "important"
contextType: "implementation"
status: "complete"
_memory:
  continuity:
    packet_pointer: "sk-git/005-readme-enrichment-and-hyphen-naming"
    last_updated_at: "2026-07-14T18:00:00Z"
    last_updated_by: "claude"
    recent_action: "All P0/P1 checklist items verified with evidence"
    next_safe_action: "Commit the whole skill in one commit; push"
    blockers: []
    key_files:
      - "checklist.md"
      - "spec.md"
      - "plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-git-readme-hyphen-naming"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Verification Checklist: sk-git README Enrichment and Hyphen-Naming Migration

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist-core | v2.2 -->

> Mark each item `[x]` only with evidence (path, command output, checker result). No completion claim until every P0/P1 item is `[x]` with evidence.

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Readiness Impact |
|----------|----------|------------------|
| **P0** | Hard blocker | Must pass before completion |
| **P1** | Required | Must pass or carry an explicit user-approved deferral |
| **P2** | Optional | May remain for a later pass |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Rename scope + SKILL.md ref surface censused. Evidence: `spec.md` §3 (13 dirs + 66 files); `plan.md` §3 (45 SKILL.md refs).
- [x] CHK-002 [P0] Rename-first-then-update-refs plan frozen. Evidence: `plan.md` §4.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] README rewritten to the create-readme canon (unique what/why). Evidence: `README.md` (numbered-H2 profile, OVERVIEW/HOW IT WORKS covering owner-first grammar, allocator lock, ask-first rule, launch-wrapper autosync, reaper, deterministic commits, safety refusals); `package_skill.py --check` = PASS.
- [x] CHK-011 [P1] Four code READMEs present and accurate. Evidence: `scripts/README.md`, `scripts/tests/README.md`, `.github/workflows/README.md`, `.github/hooks/scripts/README.md` — all authored, all relative links (any extension) resolve.
- [x] CHK-012 [P1] Authored docs carry no spec-folder paths or requirement identifiers. Evidence: grep sweep for `REQ-`/`CHK-`/`T0##`/`SC-`/`ADR-`/`.opencode/specs/` across the 5 authored docs = CLEAN.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Hub-wide markdown link check reports 0 broken links. Evidence: 0 rename-caused breaks (109 cross-links repaired); the 1 remaining (`assets/pr-template.md → ./docs/migration.md`) is a pre-existing illustrative PR-template placeholder, byte-identical at HEAD, `assets/docs/` never existed — out of scope.
- [x] CHK-021 [P0] Every SKILL.md Smart Router resource path resolves on disk. Evidence: router-path existence sweep = 0 missing across `RESOURCE_MAP`/`LOADING_LEVELS`/`DEFAULT_RESOURCE` + body links.
- [x] CHK-022 [P1] `package_skill.py --check` on sk-git stays PASS. Evidence: `Result: PASS`; 12 snake_case warnings are advisory-only (not in STRICT_PROMOTED_MARKERS), the documented cost of leading 017.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-030 [P0] REQ-003 all underscore names migrated to hyphen-case; 0 remaining (exemptions aside). Evidence: `find -name '*_*'` in the four trees = 0; 0 `.py` files (no 017 exemptions in scope).
- [x] CHK-031 [P0] REQ-003 history preserved — `git mv` rename status `R`. Evidence: 66 files + 13 dirs via `git mv`, 0 failures.
- [x] CHK-032 [P0] REQ-004/005 every path reference resolves incl. the Smart Router. Evidence: hub-wide link check (0 rename-caused breaks) + router-path existence sweep (0 missing).
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-040 [P1] The rename is pure file-move + ref-update — no script behavior change, no credential/network surface touched. Evidence: no `scripts/*.sh` modified (already hyphen-named, out of rename scope); changes are doc renames + ref-path edits + new READMEs only.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-050 [P0] README conveys sk-git's unique surface (owner-first grammar, ask-first rule, launch-wrapper/autosync, reaper contract). Evidence: `README.md` §4 HOW IT WORKS covers all four plus the allocator lock, deterministic commits and safety refusals.
- [x] CHK-051 [P1] Code READMEs accurately document their surface's files. Evidence: `scripts/README.md` lists all 10 subcommands from `worktree-naming.sh`; hook README maps each wrapper to its `dist/hooks/copilot/*.js` handler; workflows README maps each `.yml` to its trigger.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-060 [P1] Hyphen-case names under all four trees; nested dirs hyphenated. Evidence: `find` listing — `feature-catalog/{worktree-naming,session-lifecycle,workflow-playbooks,remote-platform-integration}`, `manual-testing-playbook/` 7 hyphenated category dirs, 0 underscore names remain.
- [x] CHK-061 [P1] Packet lives under the `sk-git` track as `005-readme-enrichment-and-hyphen-naming`. Evidence: `.opencode/specs/sk-git/005-readme-enrichment-and-hyphen-naming/`.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | P0 Total | P0 Passed | Status |
|----------|----------|-----------|--------|
| Pre-Implementation | 2 | 2 | Pass |
| Code Quality | 1 | 1 | Pass |
| Testing | 2 | 2 | Pass |
| Fix Completeness | 3 | 3 | Pass |
| Documentation | 1 | 1 | Pass |

Overall: complete. Rename executed (66 files + 13 dirs via `git mv`, history preserved, 0 underscore names remain); all path references repointed (SKILL.md Smart Router 0 missing, 109 cross-links repaired, 0 rename-caused broken links); README rewritten to canon + four code READMEs authored; `package_skill.py --check` PASS. The sole residual broken link is a pre-existing PR-template placeholder, out of scope.
<!-- /ANCHOR:summary -->

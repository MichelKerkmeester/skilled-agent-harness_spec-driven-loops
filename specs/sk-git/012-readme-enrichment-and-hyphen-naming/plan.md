---
title: "Plan: sk-git README Enrichment and Hyphen-Naming Migration"
description: "Phased plan to rewrite sk-git's README to the create-readme canon, add code READMEs for the script and CI/hook surfaces, and migrate underscore filesystem names to hyphen-case with a rename-first-then-update-refs discipline gated by a hub-wide link check."
trigger_phrases:
  - "sk-git readme enrichment plan"
  - "sk-git hyphen naming plan"
  - "sk-git code readmes plan"
importance_tier: "important"
contextType: "implementation"
status: "complete"
_memory:
  continuity:
    packet_pointer: "sk-git/012-readme-enrichment-and-hyphen-naming"
    last_updated_at: "2026-07-15T04:22:47Z"
    last_updated_by: "claude"
    recent_action: "Executed all four phases; gates green"
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
# Plan: sk-git README Enrichment and Hyphen-Naming Migration

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Deliverable A** | Rewrite `README.md` to the create-readme canon (unique what/why) |
| **Deliverable B** | Four code READMEs (`scripts/`, `scripts/tests/`, `.github/workflows/`, `.github/hooks/scripts/`) |
| **Deliverable C** | Hyphen-case migration of `references/`/`assets/`/`feature_catalog/`/`manual_testing_playbook/` (13 dirs + 66 files) |
| **Critical constraint** | 45 hardcoded resource paths in the SKILL.md Smart Router must update in lockstep |
| **Discipline** | Rename first (`git mv`), then update every ref, then hub-wide link check |

### Overview

Enrich the sk-git documentation surface and pre-adopt the hyphen-case filesystem convention. The rename is the ref-integrity-critical core: `git mv` preserves history, but every path reference — SKILL.md (incl. the Smart Router pseudocode), README, catalog/playbook internal links, cross-file refs, and `graph-metadata.json` — must be repointed, verified by a hub-wide link check with zero broken links before commit.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

| Gate | Requirement | Verification |
|------|-------------|--------------|
| README canon | README matches create-readme | Template review + `package_skill.py --check` |
| Code READMEs | Four surfaces documented, accurate | File-vs-README spot check |
| Rename completeness | 0 underscore names remain (exemptions aside) | `find -name '*_*'` sweep |
| History preserved | `git mv` rename status `R` | `git status` / diff |
| Ref integrity | Every path reference resolves; router resolves | Hub-wide link check; router-path existence sweep |
| Structure | This packet valid | `validate.sh --strict` |
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Rename map

| From (snake_case) | To (hyphen-case) |
|-------------------|------------------|
| `feature_catalog/` + nested (`worktree_naming/`, `session_lifecycle/`, `workflow_playbooks/`, `remote_platform_integration/`) | `feature-catalog/` + hyphenated nested |
| `manual_testing_playbook/` + 7 nested category dirs | `manual-testing-playbook/` + hyphenated nested |
| `references/*.md`, `assets/*.md`, all catalog/playbook `*.md` | hyphen-cased filenames |

### Reference update surfaces

SKILL.md (45 resource-path refs incl. Smart Router `RESOURCE_MAP`/`LOADING_LEVELS`/`DEFAULT_RESOURCE`), README.md, `feature-catalog/feature-catalog.md` internal links, `manual-testing-playbook/manual-testing-playbook.md` index, cross-file links inside `references/`, and `graph-metadata.json`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1 — Rename (git mv, history-preserving)

`git mv` every underscore directory and file in the four trees to hyphen-case, deepest paths first so parent renames do not invalidate child paths. No content edits yet.

### Phase 2 — Update references

Repoint every path reference: SKILL.md (boundaried replace of each `references/…`, `assets/…`, `feature_catalog/…`, `manual_testing_playbook/…` token to its hyphen form, incl. the Smart Router pseudocode), README, catalog/playbook internal links, cross-file refs, `graph-metadata.json`. Then sweep for any surviving underscore resource path and confirm every Smart Router path exists on disk.

### Phase 3 — Author READMEs

Rewrite `README.md` to the create-readme canon (owner-first grammar, ask-first rule, launch-wrapper/autosync, reaper contract, resource surface). Add the four code READMEs, each accurate to the files it documents and pointed at the hyphen-cased paths.

### Phase 4 — Verify + reconcile

Hub-wide link check (0 broken); `package_skill.py --check` PASS; regenerate `graph-metadata.json`/`description.json`; `validate.sh --strict` Errors 0; stage the whole skill in one commit.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Check | Scope | Tool |
|-------|-------|------|
| Rename completeness | Four trees | `find -name '*_*'` sweep |
| Ref integrity | Whole skill | hub-wide markdown link check |
| Router resolution | SKILL.md resource paths | on-disk existence sweep |
| Packaging | sk-git skill | `package_skill.py --check` |
| Structure | This packet | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| create-readme canon | Internal | Required | Template authority for the READMEs |
| sk-doc/017 convention | Internal | Leading | Documents the exemptions; `package_skill.py` snake_case finding is advisory-only |
| SKILL.md Smart Router | Internal | Required | Ref-integrity target; must keep resolving |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Renames are history-preserving `git mv`; revert the packet's single commit to restore snake_case names and the original refs. READMEs are additive/rewrite — reverted with the same commit. No script behavior changes to undo.
<!-- /ANCHOR:rollback -->

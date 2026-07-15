---
title: "Implementation Summary: sk-git README Enrichment and Hyphen-Naming Migration"
description: "Closeout: the README-enrichment + hyphen-case migration executed — 66 files + 13 dirs renamed via git mv (history preserved), every path reference repointed (SKILL.md Smart Router 0 missing, 109 cross-links repaired), README rewritten to the create-readme canon, four code READMEs authored, and package_skill.py --check PASS."
trigger_phrases:
  - "sk-git readme enrichment summary"
  - "sk-git hyphen naming closeout"
  - "sk-git code readmes closeout"
importance_tier: "important"
contextType: "implementation"
status: "complete"
_memory:
  continuity:
    packet_pointer: "sk-git/012-readme-enrichment-and-hyphen-naming"
    last_updated_at: "2026-07-15T04:22:47Z"
    last_updated_by: "claude"
    recent_action: "Executed rename + ref-update + READMEs; all gates green"
    next_safe_action: "Commit the whole skill in one commit; push"
    blockers: []
    key_files:
      - "implementation-summary.md"
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
# Implementation Summary: sk-git README Enrichment and Hyphen-Naming Migration

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Packet** | `sk-git/012-readme-enrichment-and-hyphen-naming` |
| **Level** | 2 (documentation + a ref-integrity-critical rename) |
| **Status** | Complete |
| **Updated** | 2026-07-14 |
| **Branch** | `skilled/v4.0.0.0` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

### Rename (history-preserving)

- **66 files + 13 directories** renamed `snake_case` → hyphen-case via `git mv` across `references/`, `assets/`, `feature_catalog/` → `feature-catalog/` and `manual_testing_playbook/` → `manual-testing-playbook/` (deepest-first), 0 failures, rename status `R`. `find -name '*_*'` in the four trees = 0. No `.py` files in scope (no 017 exemptions).

### Reference updates

- **SKILL.md**: all resource-path refs repointed, including the Smart Router `RESOURCE_MAP` / `LOADING_LEVELS` / `DEFAULT_RESOURCE` pseudocode. Router-path existence sweep = 0 missing.
- **Cross-links**: a path-anchored transform handled root-prefixed refs; a resolve-guided pass then repaired **109** relative sibling/nested cross-links (`./commit_workflows.md`, `worktree_naming/…`, `continuous_integration.md`) across 22 files — rewriting only broken targets whose hyphen form resolves.
- **`graph-metadata.json`**: 19 path values hyphenated, JSON still valid.

### READMEs

- **`README.md`** rewritten to the `create-readme` canon (numbered-H2 profile, HVR-clean): a HOW IT WORKS section covering the owner-first grammar, the allocator lock, the ask-first rule, launch-wrapper autosync, the reaper contract, deterministic commits and the safety refusals.
- **Four code READMEs** authored: `scripts/README.md`, `scripts/tests/README.md`, `.github/workflows/README.md`, `.github/hooks/scripts/README.md` — each accurate to the files it documents.

### Template alignment (post-review)

- **feature-catalog + manual-testing-playbook** verified against the sk-doc `create-feature-catalog` / `create-manual-testing-playbook` templates and the authoritative `template_rules.json`: root and leaf docs already satisfy every required section and the H2-uppercase rule. Added the one optional-but-useful `### Root-vs-Feature Rule` to the playbook's review-protocol section for fuller scaffold alignment (playbook version `1.1.0.7`).
- **pr-template.md**: de-linked the illustrative `./docs/migration.md` example (a nested-code-fence PR-body sample) to an inline-code path reference, closing the last hub-wide link-check finding.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

1. Sequenced after `003` (safety remediation) committed + pushed; opened as a new sk-git packet (Gate 3 = New).
2. Censused the rename scope and the SKILL.md Smart Router ref surface (the ref-integrity-critical constraint).
3. (Pending) Rename first, then update every reference, then author the READMEs, then verify link integrity before a single whole-skill commit.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Summary |
|----------|---------|
| New packet 005 | Distinct from 003 (safety) and 004 (catalog); one coherent README + rename unit |
| Pre-adopt hyphen convention | Operator directed leading `sk-doc/017` for sk-git now; `package_skill.py` snake_case finding is advisory-only |
| Rename first, refs second | `git mv` preserves history; a hub-wide link check gates the ref-update completeness |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Gate | Result |
|------|--------|
| Rename completeness (`find -name '*_*'` in four trees) | 0 remaining |
| History preserved (`git mv` rename status) | `R`, 0 failures |
| SKILL.md Smart Router resource-path existence sweep | 0 missing |
| Hub-wide markdown link check | 0 broken (165 checked): 109 cross-links repaired + the pre-existing pr-template example de-linked |
| `package_skill.py --check` | PASS (12 snake_case warnings advisory-only) |
| Frontmatter version checker | exit 0 |
| Authored-doc comment hygiene (no spec paths / req ids) | CLEAN |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

- **Leads the 017 program**: sk-git adopts hyphen-case before the repo-wide `sk-doc/017` migration lands, so `package_skill.py --check` emits 12 advisory (non-blocking) snake_case findings on `references/`/`assets/` and still returns PASS. These clear once 017 flips the checker.
- **SKILL.md word count**: `package_skill.py` warns SKILL.md exceeds the 3000-word soft cap (4950). Pre-existing; this packet only edited resource-path tokens in SKILL.md, adding no prose.
<!-- /ANCHOR:limitations -->

---
title: "Implementation Plan: Realign + Relocate the Styles Manual-Testing Playbook"
description: "Planning for converting the styles manual-testing playbook to the create-manual-testing-playbook package shape, relocating it to styles/manual-testing-playbook/, and updating inbound references. Documentation-only."
trigger_phrases:
  - "styles playbook relocate plan"
  - "create-manual-testing-playbook package plan"
  - "styles playbook category grouping"
importance_tier: "standard"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-design/012-sk-design-program/002-style-database/010-manual-testing-playbook-and-db-readme/001-playbook-realign-and-relocate"
    last_updated_at: "2026-07-22T16:57:27Z"

    last_updated_by: "orchestrator"
    recent_action: "Authored L2 plan for playbook realign"
    next_safe_action: "Confirm categories then scaffold package"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/create-manual-testing-playbook/assets/manual-testing-playbook-template.md"
      - ".opencode/skills/sk-doc/create-manual-testing-playbook/assets/manual-testing-playbook-snippet-template.md"
      - ".opencode/skills/sk-design/styles/docs/manual-testing-playbook.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-design-015-009-001-playbook-realign-session"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Confirm the four proposed category folders."
    answered_questions: []
---
# Implementation Plan: Realign + Relocate the Styles Manual-Testing Playbook

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Change class** | Documentation-only (markdown authoring + file move) |
| **Standard** | sk-doc `create-manual-testing-playbook` package workflow |
| **Source doc** | `.opencode/skills/sk-design/styles/docs/manual-testing-playbook.md` (~49 lines) |
| **Target root** | `.opencode/skills/sk-design/styles/manual-testing-playbook/` |
| **Validation** | `validate_document.py --type reference` + manual per-feature spot-check + markdown link guard |

### Overview
Convert the single-file styles playbook into the canonical `create-manual-testing-playbook` package (root index + kebab-case category folders + per-feature files), place it at the standard's canonical location under the styles library root, preserve the 11 existing scenarios as real per-feature files, reconcile the verdict vocabulary to `PASS`/`FAIL`/`SKIP`, and update the single confirmed inbound reference. No runtime, schema, or data change.


<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented (see `spec.md`)
- [x] Canonical target path resolved (`styles/manual-testing-playbook/`, sibling pattern confirmed)
- [x] Inbound references enumerated (confirmed: `styles/tests/README.md:16`)
- [x] create-manual-testing-playbook templates located and readable

### Definition of Done
- [ ] Canonical package authored at the target location
- [ ] All 11 scenarios carried over as per-feature files with 9-field contracts
- [ ] Inbound references updated; no broken links
- [ ] Old `docs/` playbook removed; `docs/` disposition resolved
- [ ] Root playbook passes shared validation; per-feature files spot-checked


<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Split-document playbook package (per the sibling `design-interface` / `design-motion` playbooks): a root `manual-testing-playbook.md` acting as directory + policy + review/orchestration surface, with per-feature execution truth in category folders.

### Proposed Category Folders (to confirm)
- **`database-adapter/`** — DB-01 (adapter defaults to `legacy`).
- **`database-indexer-retrieval/`** — DB-02, DB-04, DB-05, DB-06 (test suite, indexer lifecycle, retrieval, vector drain).
- **`database-operator/`** — DB-03, DB-07, DB-08 (legacy non-regression, operator surface, generation retention).
- **`interface-commands/`** — CMD-01, CMD-02, CMD-03 (routing, creation-contract blocks, retired `/design:*` namespace).

### Root Playbook Owns
- Frontmatter + H1 intro, global overview + coverage note.
- Global preconditions (repo root, Node ≥ 22, `SK_DESIGN_STYLE_DB_MODE` unset default).
- Global evidence requirements + deterministic command notation.
- Integrated review protocol + release-readiness rules.
- Orchestration/wave-planning guidance.
- Category sections with short per-feature summaries.
- Automated-test cross-reference (`styles/tests/`) and feature-catalog cross-reference when a catalog exists.

### Per-Feature File Owns
The 5-section structure (`OVERVIEW`, `SCENARIO CONTRACT`, `TEST EXECUTION`, `REFERENCES`/`SOURCE FILES`, `SOURCE METADATA`) with the 9-field scenario contract and a 4-part `version` in frontmatter.


<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Confirm category grouping and feature-ID policy (preserve vs migrate)
- [ ] Confirm `docs/README.md` disposition
- [ ] Create the `styles/manual-testing-playbook/` root and category folders

### Phase 2: Core Authoring
- [ ] Author root `manual-testing-playbook.md` from `assets/manual-testing-playbook-template.md`
- [ ] Author 11 per-feature files from `assets/manual-testing-playbook-snippet-template.md`
- [ ] Fill each 9-field scenario contract from the existing scenario truth + real on-disk artifacts
- [ ] Reconcile verdicts to `PASS`/`FAIL`/`SKIP`

### Phase 3: Relocate + Verify
- [ ] Delete `styles/docs/manual-testing-playbook.md`
- [ ] Update `styles/tests/README.md:16` link to the new path
- [ ] Resolve `styles/docs/README.md` and remove `docs/` if it ends up empty
- [ ] Run shared validation + manual spot-check + markdown link guard


<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Structure | Root playbook conforms to reference doc type | `validate_document.py --type reference`, `extract_structure.py` |
| Links | All inbound + intra-package links resolve | `check-markdown-links.cjs` CI guard + grep |
| Manual | Per-feature frontmatter, numbered sections, prompt synchronization, feature-ID count | Manual spot-check per SKILL.md §6 |
| Fidelity | Every scenario names a real on-disk artifact | Cross-check `styles/lib/**` and `commands/interface/**` |


<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| create-manual-testing-playbook templates | Internal | Present | Cannot scaffold canonical shape |
| Existing scenario source (`docs/manual-testing-playbook.md`) | Internal | Present | Cannot preserve real scenarios |
| On-disk artifacts (`styles/lib/**`, `commands/interface/**`) | Internal | Present | Cannot anchor scenarios to real `file:line` |
| Sibling child `002-database-readme-speckit-alignment` | Internal | Independent | None (disjoint scope) |


<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Broken inbound links, validation failure that cannot be fixed structurally, or accidental deletion of a needed file.
- **Procedure**: Restore `styles/docs/manual-testing-playbook.md` and `styles/docs/README.md`, revert the `styles/tests/README.md` link, and remove the new `styles/manual-testing-playbook/` package. All changes are markdown, so `git checkout -- <paths>` fully reverses them.


<!-- /ANCHOR:rollback -->
---

<!-- ANCHOR:l2-phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──> Phase 2 (Core Authoring) ──> Phase 3 (Relocate + Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core Authoring |
| Core Authoring | Setup | Relocate + Verify |
| Relocate + Verify | Core Authoring | None |


<!-- /ANCHOR:l2-phase-deps -->
---

<!-- ANCHOR:l2-effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup (folders + decisions) | Low | 30 minutes |
| Core Authoring (root + 11 per-feature files) | Medium | 3-4 hours |
| Relocate + Verify | Low | 45 minutes |
| **Total** | | **~4.25-5.25 hours** |


<!-- /ANCHOR:l2-effort -->
---

<!-- ANCHOR:l2-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Confirm every inbound reference is captured before deleting the old file
- [ ] Feature flag configured (N/A - documentation change)
- [ ] Snapshot of `styles/docs/` contents recorded in `git status` before the move

### Rollback Procedure
1. **Restore source**: `git checkout -- .opencode/skills/sk-design/styles/docs/`
2. **Revert reference**: `git checkout -- .opencode/skills/sk-design/styles/tests/README.md`
3. **Remove new package**: delete `.opencode/skills/sk-design/styles/manual-testing-playbook/`
4. **Verify**: markdown link guard passes on the restored tree

### Data Reversal
- **Has data migrations?** No — documentation-only.
- **Reversal procedure**: `git checkout` of the affected markdown paths.

<!-- /ANCHOR:l2-rollback -->

---
title: "Feature Specification: Doc and catalog truth"
description: "Narrow the doc-version contract to SKILL.md, and make the catalog path check, citation resolver and playbook validator catch the drift the research found."
trigger_phrases:
  - "doc and catalog truth"
  - "phase 3 doc and catalog truth"
  - "skill edition version contract"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Doc and catalog truth

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-11 |
| **Branch** | `worktrees/111-open-ends-integration` (scaffold); the builder works in its own worktree branched from the scaffold commit |
| **Parent Spec** | ../spec.md |
| **Phase** | 3 of 4 |
| **Predecessor** | 002-onboarding-fixes |
| **Successor** | 004-routing-parity-ci |
| **Handoff Criteria** | Every criterion in `goal.md` passes |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 3** of the open ends remediation. It builds two research sources. From `specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/001-doc-version-contract/research/research.md` it builds R1 to R4 and R6 and records R5 and R7 as closed; those rows carry the `DV-` prefix here. From `specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/003-playbook-catalog-truth/research/research.md` it builds R3 to R7 and records R1, R2 and R8 to R10 as closed; those rows carry the `PC-` prefix.

**Scope Boundary**: The frontmatter-version engine, the packager, the post-edit router, the versioning standard and template, the catalog validator, the citation scanner, the playbook validator, and the doc lines PC-R7 names.

**Dependencies**:
- `020-open-ends-research/006-ci-truth-checks`, which already built PC-R1 and PC-R2.

**Deliverables**:
- `version` on `SKILL.md` only, with the engine, packager, router, standard and template agreeing.
- Three report-only or advisory checks and the live drift corrected.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Doc-version `verify` fails on every skill because child docs carry a per-doc version that most state in the wrong era. The catalog path check skips two-column tables, the citation resolver misses `runtime/` and `scripts/` bases, the playbook validator ignores backticked paths, and live docs point at wrong lines and moved files.

### Purpose
`version` means the skill edition and lives on `SKILL.md` only, and the checks catch the doc drift this research found.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- DV-R1 to DV-R4 and DV-R6, and PC-R3 to PC-R7, as written in the ledger below.

### Out of Scope
- DV-R5 and DV-R7: build-nothing decisions in the research.
- PC-R1 and PC-R2: already built by `020-open-ends-research/006-ci-truth-checks`. They are recorded as Closed with that phase's proof.
- PC-R8 to PC-R10: build-nothing decisions in the research.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs` | Modify | DV-R1 scope |
| Child docs under `.skilled/skills/*/` that carry `version:` | Modify | DV-R1 delete the stale child lines |
| `.skilled/skills/sk-doc/sk-create-skill/scripts/package_skill.py` | Modify | DV-R2 |
| `.skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md`, `assets/frontmatter-templates.md` | Modify | DV-R3, DV-R4 |
| `.skilled/hooks/post-edit-quality/lib/post-edit-router.cjs` | Modify | DV-R6 |
| `.skilled/skills/sk-doc/sk-create-feature-catalog/scripts/validate_catalog_package.py` | Modify | PC-R3 |
| `.skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs` | Modify | PC-R4, PC-R5 |
| `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs` | Modify | PC-R6 |
| The playbook and catalog files PC-R7 names | Modify | PC-R7 |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `frontmatter-version.mjs verify` is green once `version` lives on `SKILL.md` only | `verify` exits 0 on every skill |
| REQ-002 | Every build row is Fixed | Each row's ledger line names the command that shows the change |
| REQ-003 | Every row in the recommendation ledger ends Fixed with a command proof or Closed with a written reason | The ledger lines in `implementation-summary.md` follow the format above, one per row |
| REQ-004 | Changed behavior has tests that fail before the change | Each Tests table line shows a non-zero exit before and exit 0 after |
| REQ-005 | Each touched skill is bumped once, with a changelog entry | One new file under `.skilled/skills/<skill>/changelog/` and one `version:` change in its `SKILL.md` per touched skill |

### Recommendation Ledger: Doc-version Contract, Build (5 rows)

| ID | Recommendation | Evidence | Move |
|----|----------------|----------|------|
| DV-R1 | Drop the per-doc version from child doc classes and keep `version` on `SKILL.md` only, as the skill edition. Narrow `inScope()` and `classify()` to `SKILL.md`, then delete the stale child `version:` lines in the same commit. | `.skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs:57`, `frontmatter-version.mjs:222`, `frontmatter-version.mjs:282`, `frontmatter-versioning.md:98` | Extend in place |
| DV-R2 | Narrow the packager's `VERSIONED_DOC_SUBTREES` to `changelog` in the same change, so packaging stops demanding a version on child docs. | `.skilled/skills/sk-doc/sk-create-skill/scripts/package_skill.py:128`, `package_skill.py:672`, `package_skill.py:200` | Change a value |
| DV-R3 | Rewrite the standard around the edition contract: delete the child-doc derivation, `W`, `Z` and the two-pass amend ritual; state that `version` means the skill edition; remove the unhonored "Run it in CI or pre-commit" line. | `.skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md:77`, `frontmatter-versioning.md:106`, `frontmatter-versioning.md:168` | Extend in place |
| DV-R4 | Remove `version` from the child-doc rows and child templates of the frontmatter template asset, keeping it on the `SKILL.md` template. | `.skilled/skills/sk-doc/sk-create-frontmatter/assets/frontmatter-templates.md:126`, `frontmatter-templates.md:193`, `frontmatter-templates.md:476` | Extend in place |
| DV-R6 | Narrow the post-edit router's `isVersionedSkillDoc()` to `SKILL.md` in the same change, so its stated mirror of the engine's scope stays true. | `.skilled/hooks/post-edit-quality/lib/post-edit-router.cjs:127`, `post-edit-router.cjs:131` | Extend in place |

### Recommendation Ledger: Playbook and Catalog Truth, Build (5 rows)

| ID | Recommendation | Evidence | Move |
|----|----------------|----------|------|
| PC-R3 | Make the catalog path check read two-column `File` tables, or flag them as off-template so their paths get checked. | `.skilled/skills/sk-doc/sk-create-feature-catalog/scripts/validate_catalog_package.py:306`; missed dead path at `.skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/json-primary-deprecation-posture.md:44`; the template is three-column at `feature-catalog-template.md:223` | Extend in place |
| PC-R4 | Add the skill's `runtime/` and `scripts/` directories as candidate bases in `resolveCitation`, after the skill root. | `.skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs:378`; `advisor-recommend.md:31` cites `schemas/advisor-tool-schemas.ts:221` while `compiledRoute` is declared at `.skilled/skills/system-skill-advisor/runtime/schemas/advisor-tool-schemas.ts:268` | Extend in place |
| PC-R5 | Print the scanner's existing mechanical identifier-overlap verdict per citation in the census, as an advisory line. This is the token-at-line check the lineage proposed, and it is already written. | `.skilled/skills/sk-doc/shared/scripts/classifier-cite-drift-scan.mjs:118`; used only for scoring at `.skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs:1062`; live case `.skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/code-standards-alignment.md:76` against `.skilled/skills/system-spec-kit/runtime/handlers/save/spec-folder-mutex.ts:22` | Extend in place |
| PC-R6 | Extend the playbook validator's `pathChecks` to resolve backticked repo paths in scenario files, report-only, with file-relative, skill-root and repo-root bases and an expected-unresolved list (placeholders, globs, `/tmp`, runtime output). | `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs:342`; `.skilled/skills/sk-design/sk-design-diagram/manual-testing-playbook/command-and-hub-integration/design-diagram-command.md:30` names a command and asset that moved to `.skilled/commands/design/` | Extend in place |
| PC-R7 | Correct the live drift this run found, as plain doc edits in the fix phase: triage line 138 (1084 to 1060 and 1636), the truncated Expected warning at line 90, `spec-folder-mutex.ts:10` to `:22`, the three stale advisor anchors, the moved diagram paths, the past-end ranges in `iteration-citation-jsonl.md` and the dead `memory/save.md` row. | `.skilled/skills/system-spec-kit/manual-testing-playbook/tooling-and-scripts/spec-folder-literal-naming-create-sh-fallback.md:90` against `.skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:1637` | Change a value |

### Recommendation Ledger: Closed (7 rows)

| ID | Recommendation | Why it is closed |
|----|----------------|------------------|
| DV-R5 | Keep the git-free `gate` as the only enforced check, run by the post-edit hook. Do not wire `verify` into CI, a git hook or pre-commit. | Build nothing, per the research and prevent-overengineering: `gate` already exits 0 on every skill |
| DV-R7 | Leave the changelog scope divergence alone: the packager keeps checking changelog versions and the engine keeps excluding them. | Build nothing, per the research and prevent-overengineering: no changelog entry fails today |
| PC-R1 | Run the existing citation scanner, `cite-drift-scan.mjs --corpus skills`, as a report-only step in `sk-doc-script-tests.yml`. It already resolves every `path:line` in playbook scenarios and catalog leaves, makes no model call and took 4.5 seconds here. | Already built by `020-open-ends-research/006-ci-truth-checks`, made blocking for new citations; prove it with `node --test .skilled/skills/sk-doc/scripts/tests/test-cite-drift-gate.mjs` |
| PC-R2 | Run `validate_catalog_package.py` over all packages in CI, fail-closed, in the same workflow, and run its orphaned fixture test there too. | Already built by `020-open-ends-research/006-ci-truth-checks`; prove it with `python3 .skilled/skills/sk-doc/sk-create-feature-catalog/scripts/validate_catalog_package.py` |
| PC-R8 | Build no static flag-versus-script option check for scenarios. | Build nothing, per the research and prevent-overengineering |
| PC-R9 | Build no expected-answer comparison against producer output. | Build nothing, per the research and prevent-overengineering: one instance is a case, not a pattern |
| PC-R10 | Build no new checker for router expected answers, the DOC-331 class. | Build nothing, per the research and prevent-overengineering: the admission check already exists |

### Ledger format

The builder records every row above in `implementation-summary.md`, one line each, in this shape, so the goal criteria can count them:

- `| <ID> | Fixed | <the command that proves it, in backticks, and what it printed> |`
- `| <ID> | Closed | <the written reason, naming prevent-overengineering or the operator decision> |`

Changed behavior gets a test that fails before the change and passes after it, recorded in a Tests table in the same file:

- `| T<n> | <test file or command> | before: exit <non-zero> | after: exit 0 |`
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 17 ledger rows are Fixed or Closed in `implementation-summary.md`.
- **SC-002**: `frontmatter-version.mjs verify` exits 0 on every skill, and the catalog validator still passes every package.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | DV-R1 deletes child `version:` lines in every skill, so the bump rule touches every skill | High | Delete the lines in the same change as the engine scope, then bump each touched skill once |
| Risk | 001 changes the parser of `frontmatter-version.mjs` (F26) | Med | Change only `inScope()`, `classify()` and the scope constants here, so the merges stay line-disjoint |
| Risk | PC-R4 widens what the scanner resolves, which changes the base counts the 006 gate compares | Med | Run `cite-drift-gate.mjs --base` after the change and confirm it still passes with no new broken citation |
| Risk | PC-R6 could block on placeholders | Med | Keep it report-only with the expected-unresolved list the research names |
| Risk | Other 021 builders bump the same skill in parallel | Med | Version numbers collide when the four branches merge; the integrator renumbers, and each child still bumps once |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

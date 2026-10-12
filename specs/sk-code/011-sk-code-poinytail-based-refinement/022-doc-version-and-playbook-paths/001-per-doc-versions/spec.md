---
title: "Feature Specification: Per-doc versions"
description: "Every skill doc carries its own 4-part version again, the pre-commit hook raises it when the body changes, a pull-request check catches a missed raise, and the lines removed in 31888d05bb come back."
trigger_phrases:
  - "per doc versions"
  - "phase 1 per doc versions"
  - "doc version auto bump"
  - "restore child doc versions"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Per-doc versions

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-10-12 |
| **Branch** | `worktrees/117-docver-scaffold` (scaffold); the builder works in its own worktree branched from the scaffold commit |
| **Parent Spec** | ../spec.md |
| **Phase** | 1 of 2 |
| **Predecessor** | None |
| **Successor** | 002-playbook-path-repair |
| **Handoff Criteria** | Every criterion in `goal.md` passes |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 1** of the doc version and playbook paths packet. It reverses the child-doc half of `../../021-open-ends-remediation/003-doc-and-catalog-truth/`, which kept `version` on `SKILL.md` only (engine change c071e01662, standard rewrite a46a7588f6, line removal 31888d05bb). The research behind that change is `../../020-open-ends-research/001-doc-version-contract/research/research.md`. Its central finding still holds: a stored version that must equal a value derived from git history cannot stay true. So this phase does not bring the git-derived `W` back. A child doc's version is the doc's own edition, raised by a commit-time hook, and the check is that it went up, not that it equals a derivation.

**Scope Boundary**: The versioning standard, the frontmatter-version engine and the two scope mirrors that follow it (the packager and the post-edit router), the pre-commit hook and its gate table, one pull-request check, the sk-doc doc templates, and the `version:` line of child docs under `.skilled/skills/`.

**Dependencies**:
- The spec-remint gate in `.skilled/scripts/git-hooks/pre-commit`, the precedent for a pre-commit gate that rewrites and re-stages a file.
- Phase 002 builds in parallel and does not touch versions. After both merge, the integrator runs this phase's bump over the docs 002 changed.

**Deliverables**:
- A per-doc version on every in-scope doc, raised automatically, checked on pull requests and by `frontmatter-version.mjs verify`.
- The 2,845 lines removed in 31888d05bb restored, and a 1.0.0.0 version on every in-scope doc that never had one.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Since 31888d05bb only `SKILL.md` carries a version, so a reader of a single reference, asset, playbook or catalog doc cannot tell which edition of that doc they hold. The operator decided on 2026-10-12 that every doc carries its own version. The engine, standard, packager and post-edit router were all narrowed to `SKILL.md` and now say the opposite, and nothing raises a doc version when the doc changes.

### Purpose
Every in-scope doc carries a valid 4-part version that is that doc's own edition, raised by the pre-commit hook on every body change, with a pull-request check behind the hook.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- PV-R1 to PV-R8, as written in the ledger below.

**Which docs are in scope (D1).** Every Markdown doc under `.skilled/skills/**` that has a frontmatter block, `SKILL.md` included. Two classes are out:
- Changelog entries under `*/changelog/`. They keep their release version, which is the skill edition record.
- Docs with no frontmatter block. Measured at the scaffold commit: 4,412 of the 7,978 non-changelog docs have none. The classes are the sk-design style corpus (`styles/`, 2,591 files), benchmark output (`benchmark/` and `behavior-benchmark/` folders, 1,485 files), runtime internals and test fixtures (`runtime/`, `tests/`, `fixtures/` and `*-fixture/` folders, 315 files) and 21 hand-authored docs: ten `INSTALL-GUIDE.md` files, seven READMEs, two playbook roots (`sk-code-opencode`, `sk-code-webflow`), `sk-vision/hooks/devin/vision-rule.md` and `system-deep-loop/shared/rollout/promotion-rule.md`. The engine already skips a doc with no frontmatter. Adding frontmatter to them is not in scope: see open question 1.

**The 61 docs that carry a version today.** `git grep -l '^version:' -- '.skilled/skills/**/*.md' | grep -vE '/SKILL\.md$|/changelog/'` lists 81 files at the scaffold commit. In 61 of them the line sits in the frontmatter, in valid 4-part form. In the other 20, all in sk-doc, the match is a `version:` line inside a template or example body. PV-R7 brings the 61 into the new contract; the 20 are template bodies that PV-R6 handles.

### Out of Scope
- Re-deriving a version from git history. The research showed a stored value that must equal a git-derived one cannot stay equal; the new check is "went up", not "equals".
- Bumping other skills for the restore or the per-doc raises. That is housekeeping sk-doc owns (D6).
- Hand-editing versions in the docs phase 002 changes. The integrator runs the bump after merging.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md` | Modify | PV-R2 contract and bump rule |
| `.skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs` | Modify | PV-R3 scope and verify |
| `.skilled/skills/sk-doc/sk-create-skill/scripts/package_skill.py`, `.skilled/hooks/post-edit-quality/lib/post-edit-router.cjs` | Modify | PV-R3 scope mirrors |
| `.skilled/scripts/git-hooks/pre-commit`, `.skilled/scripts/git-hooks/lib/gates.tsv` | Modify | PV-R4 auto-bump and bypass |
| A workflow under `.github/workflows/` | Modify or Create | PV-R5 pull-request check |
| Doc templates under `.skilled/skills/sk-doc/*/assets/` | Modify | PV-R6 seed `version: 1.0.0.0` |
| Child docs under `.skilled/skills/` | Modify | PV-R1 restore, PV-R7 bring into contract |
| `.skilled/skills/sk-doc/SKILL.md`, `.skilled/skills/sk-doc/changelog/` | Modify, Create | PV-R8 bump |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Every in-scope doc carries a valid 4-part `version:` in its frontmatter, and `frontmatter-version.mjs verify` checks that (D1, D3) |
| REQ-002 | The pre-commit hook raises the version of a staged doc whose body changed and whose version did not go up, re-stages it, and honors a named bypass variable (D3) |
| REQ-003 | A pull-request check fails on a changed in-scope doc whose version did not go up, and names the one command that fixes it (D3) |
| REQ-004 | Every file 31888d05bb touched that still exists has its prior `version:` value back, and an in-scope doc that never had one has 1.0.0.0 (D4) |
| REQ-005 | Every ledger row ends Fixed with a command proof or Closed with a written reason |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-006 | `frontmatter-versioning.md` states the per-doc contract and the bump rule the builder chose (D2) |
| REQ-007 | Every sk-doc doc template seeds `version: 1.0.0.0` (D5) |
| REQ-008 | sk-doc is bumped once with one changelog entry; no other skill is bumped for the restore or the raises (D6) |
| REQ-009 | Each changed behavior has a test that fails before and passes after (D7) |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.

### Recommendation Ledger (8 rows)

| ID | Item | Evidence | Move |
|----|------|----------|------|
| PV-R1 | Restore the `version:` line removed in 31888d05bb, with its prior value, on every file that still exists and lacks one. Use one deterministic script run in its own commit. | 2,845 files, 2,824 unquoted and 21 quoted values (`git show --format= 31888d05bb`); all 2,845 exist at the scaffold commit | Change a value |
| PV-R2 | Rewrite `frontmatter-versioning.md` around the per-doc contract: `SKILL.md` carries the skill edition, equal to the newest changelog entry; every other in-scope doc carries its own edition, starting at 1.0.0.0 and raised on any content change by the smallest rule the builder picks; name the out-of-scope classes and the bypass variable. | `.skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md` (rewritten in a46a7588f6) | Extend in place |
| PV-R3 | Widen `inScope()` and `classify()` back to every in-scope doc; make `verify` check a valid 4-part version on each child doc and keep the edition equality on `SKILL.md`; move the packager's `VERSIONED_DOC_SUBTREES` and the post-edit router's `isVersionedSkillDoc()` with it, because both state they mirror the engine. | `.skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs` (narrowed in c071e01662), `package_skill.py`, `post-edit-router.cjs` | Extend in place |
| PV-R4 | Add a pre-commit gate that raises the version of each staged in-scope doc whose body changed and whose version did not go up, then re-stages it. A new doc with no version gets 1.0.0.0. It skips `SKILL.md` and changelog entries, blocks like `[gate:spec-remint]` when it cannot (a partly staged doc, a pathspec-narrowed commit), and has a bypass variable in `gates.tsv`. | `.skilled/scripts/git-hooks/pre-commit` (spec-remint gate), `.skilled/scripts/git-hooks/lib/gates.tsv` | Extend in place |
| PV-R5 | Add a pull-request check that fails on a changed in-scope doc whose body changed and whose version did not go up against the base, and prints the one command that fixes it. Prefer extending `skill-doc-frontmatter.yml` over a new workflow. | `.github/workflows/skill-doc-frontmatter.yml` (its `paths` filter covers only `references/` and `assets/` today) | Extend in place |
| PV-R6 | Make every sk-doc doc template seed `version: 1.0.0.0` on the docs it creates, adding it where a template lacks it. | Templates under `.skilled/skills/sk-doc/*/assets/`; 14 files there carry `version: 1.0.0.0` at the scaffold commit, fixtures included | Change a value |
| PV-R7 | Bring the 61 docs that kept a frontmatter version into the contract: confirm each value is valid 4-part and in scope, and record any whose class is now out of scope. | The `git grep` command in section 3, frontmatter lines only | Change a value |
| PV-R8 | Bump sk-doc once with one changelog entry covering the contract, engine, hook, check and templates. The restore and the per-doc raises bump no other skill. | `.skilled/skills/sk-doc/SKILL.md`, `.skilled/skills/sk-doc/changelog/` | Change a value |

### Ledger format

The builder records every row above in `implementation-summary.md`, one line each, in this shape, so the goal criteria can count them:

- `| <ID> | Fixed | <the command that proves it, in backticks, and what it printed> |`
- `| <ID> | Closed | <the written reason, naming prevent-overengineering or the operator decision> |`

Changed behavior gets a test that fails before the change and passes after it, recorded in a Tests table in the same file. T1 to T4 cover the hook auto-bump, the pull-request check, `verify` on a doc with no version and template seeding:

- `| T<n> | <test file or command> | before: exit <non-zero> | after: exit 0 |`
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 8 ledger rows are Fixed or Closed in `implementation-summary.md`.
- **SC-002**: `frontmatter-version.mjs verify` exits 0, and every file 31888d05bb touched carries a 4-part `version:` again.
- **SC-003**: A commit that changes a doc body without raising its version lands with the version raised, unless the bypass variable is set.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | The restore adds a line near the top of 2,845 files, which shifts every `path:line` citation into them by one | High | Run `cite-drift-scan.mjs` and the citation gate after the restore and re-anchor what moved, as 021/003 did for 15 sk-code citations |
| Risk | The hook fires on the restore commit itself | Med | Land the restore before the hook, or make the hook treat a version-only change as no body change |
| Risk | Phase 002 edits playbook bodies in parallel | Med | The restore touches only the frontmatter line, so the merge is line-disjoint; 002 never edits versions, and the integrator runs the bump after merging |
| Risk | The hook rewrites files mid-commit and surprises a caller | Med | Follow the spec-remint gate: re-stage only fully staged docs, block a pathspec-narrowed commit, print what it raised |
| Dependency | The spec-remint gate's re-stage pattern | Low | Read it before writing the new gate |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The pre-commit gate reads only staged docs under `.skilled/skills/`, so a commit with no such doc pays no cost.

### Reliability
- **NFR-R01**: The gate is deterministic: the same staged change always produces the same raised version.
- **NFR-R02**: The gate never raises a version it cannot re-stage; it blocks with a named gate message instead.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- A new doc with no version: the hook seeds 1.0.0.0.
- A version-only change: not a body change, so no raise.
- A quoted value such as `version: "1.2.0.0"`: read and raised in the same quoting.

### Error Scenarios
- A doc staged and unstaged at once: the hook blocks, as the spec-remint gate does.
- A malformed version: `verify` fails and names the file; the hook does not guess a value.

### State Transitions
- A doc renamed without content change: no raise.
- A doc whose version was raised by hand by at least the rule's step: left alone.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 18/25 | About 2,900 doc lines, one engine, one hook gate, one workflow, templates |
| Risk | 14/25 | A hook that rewrites staged files, and fleet-wide line shifts |
| Research | 6/20 | The 020 research and 021/003 already mapped the surfaces |
| **Total** | **38/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

1. Should the 21 hand-authored docs with no frontmatter gain one, and so a version? This phase leaves them out under D1's frontmatter-less class; adding frontmatter is an operator call.
<!-- /ANCHOR:questions -->

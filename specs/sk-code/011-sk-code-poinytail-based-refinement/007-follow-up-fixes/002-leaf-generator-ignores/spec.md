---
title: "Feature Specification: Phase 2: leaf-generator-ignores"
description: "The leaf-manifest generator lists files git ignores, so a stray __pycache__ makes a skill report STALE with no tracked change. The walk should drop ignored files and leave every committed manifest byte-identical."
trigger_phrases:
  - "leaf generator ignores"
  - "phase 2 leaf generator ignores"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 2: leaf-generator-ignores

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-10-10 |
| **Branch** | `scaffold/002-leaf-generator-ignores` |
| **Parent Spec** | ../spec.md |
| **Phase** | 2 of 5 |
| **Predecessor** | 001-review-checker-gaps |
| **Successor** | 003-codex-mirror-gate |
| **Handoff Criteria** | The freshness gate prints `checked=14 fresh=14 failed=0` with a probe `__pycache__` file present; the new ignore test exits 0; `validate.sh --strict` prints `RESULT: PASSED` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 2** of the Follow-up fixes for the sk-code Ponytail refinement specification (parent: `../spec.md`).

**Scope Boundary**: The leaf walk in `generate-leaf-manifest.cjs` and the tests that cover it. The leaf-manifest contract, the freshness gate's own logic and every committed manifest stay as they are.

**Dependencies**:
- `git` on PATH when the generator runs. Without it the walk falls back to name rules (see REQ-002).
- The phase map in `../spec.md`, which lists this phase as "Leaf manifests ignore files git ignores".

**Deliverables**:
- `walkLeafFiles` drops git-ignored files, with a name-based fallback for when git cannot answer.
- One new test file with an ignored-leaf case and a fallback case.
- One contents row in the create-skill tests README.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`walkLeafFiles` in `.skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs` (lines 96 to 130) lists every regular file under a packet's `references/` and `assets/` roots, including files git ignores. A Python test run inside a skill leaves `__pycache__/*.pyc` behind, the generator lists those files, and `ci-leaf-manifest-freshness.cjs` reports the skill STALE although no tracked file changed. The sk-code manifest walks `sk-code-opencode/assets/scripts/`, so a `.pyc` probe placed there reproduces the report.

### Purpose
The freshness gate reports drift only when tracked content changed.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Drop every walked file that git ignores, asking git once per walk.
- Name-based fallback (`__pycache__`, `node_modules`, `.DS_Store` segments and `.pyc` files) for when git is unavailable or cannot answer.
- One ignored-leaf case and one fallback case in a new test file.
- One contents row in `tests/README.md`.

### Out of Scope
- Tracked files. `git check-ignore` without `--no-index` never reports a tracked file, so a tracked file stays in its manifest even when an ignore rule matches it. That is the wanted behavior and this phase does not change it.
- The freshness gate's own logic in `ci-leaf-manifest-freshness.cjs`. It already calls the generator, so it needs no edit.
- Any committed `leaf-manifest.json`. Their content must not change.
- Wiring the create-skill `.test.cjs` files into CI. No workflow runs them today (`sk-doc-script-tests.yml` runs only `test_*.py`), so the new file joins its siblings in the README loop.
- The Python test that leaves the `__pycache__` behind. The walk is fixed, not the test.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs` | Modify | Add the `child_process` import after line 31, the helpers above line 87, and replace the final `return out;` of `walkLeafFiles` (line 129) |
| `.skilled/skills/sk-doc/sk-create-skill/scripts/tests/generate-leaf-manifest-ignores.test.cjs` | Create | Two cases: a git-ignored leaf is dropped; the fallback drops generated noise outside a work tree |
| `.skilled/skills/sk-doc/sk-create-skill/scripts/tests/README.md` | Modify | One row in the contents table (section 2) |
| `specs/sk-code/011-sk-code-poinytail-based-refinement/007-follow-up-fixes/002-leaf-generator-ignores/` (`spec.md`, `plan.md`, `tasks.md`, `goal.md`, `scratch/`) | Modify, Create | Packet documents and scratch copies. `repair-derived.cjs` may rewrite `graph-metadata.json` and `description.json` in this folder |

<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `walkLeafFiles` drops every walked file that git ignores. It asks git once per walk with `git check-ignore -z --stdin`, run from the repository root. | The ignored-leaf case exits 0 and its manifest omits `references/generated/out.md`, which only git can drop. |
| REQ-002 | When git is unavailable, or check-ignore exits with a status other than 0 or 1, the walk drops any path segment named `__pycache__`, `node_modules` or `.DS_Store`, and any file ending `.pyc`. | The fallback case exits 0 and its manifest keeps only `references/keep.md`. |
| REQ-003 | check-ignore exit status 1 means nothing is ignored. It is not an error, and a walk with no ignored file keeps all of its files. | The ignored-leaf case also walks an `assets/` root with no ignored file and keeps `assets/logo.txt`. |
| REQ-004 | Every committed `leaf-manifest.json` stays byte-identical. | `ci-leaf-manifest-freshness.cjs` prints `checked=14 fresh=14 failed=0` before and after, and `git status --short -- '*/leaf-manifest.json'` prints nothing. |
| REQ-005 | The freshness gate stays green with a probe `__pycache__/probe.cpython-39.pyc` present under `.skilled/skills/sk-code/sk-code-opencode/assets/scripts/`. | The gate prints `checked=14 fresh=14 failed=0` with the probe present. The builder removes the probe afterwards. |
| REQ-006 | Existing create-skill test scripts keep their results. | Each `tests/*.test.cjs` exits with the same status it had in the Phase 1 baseline. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | Tracked files are never dropped, even when an ignore rule matches them. | `git check-ignore -v .skilled/skills/system-deep-loop/runtime/database/council-graph.sqlite` prints nothing and exits 1, while that file is tracked (`git ls-files --error-unmatch` exits 0) and matches `.gitignore:144`. |
| REQ-008 | New code comments state the durable reason only, never spec paths, phase numbers or task IDs. | A `grep -nE` for requirement IDs, success-criteria IDs, task IDs, phase numbers and `specs/` paths (pattern in tasks.md T020) over the two code files prints nothing and exits 1. |
| REQ-009 | The new test file is listed in `tests/README.md`. | `grep -n 'generate-leaf-manifest-ignores' .skilled/skills/sk-doc/sk-create-skill/scripts/tests/README.md` prints one line and exits 0. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The freshness gate totals read `checked=14 fresh=14 failed=0` before the change, after the change, and with the probe present after the change.
- **SC-002**: Before the change, a probe `.pyc` under `sk-code-opencode/assets/scripts/` makes the gate report `STALE sk-code` with exit 1. After the change the same probe leaves the gate green.
- **SC-003**: The new test file prints one `ok - ` line per case and its final pass line, and exits 0.
- **SC-004**: `validate.sh specs/sk-code/011-sk-code-poinytail-based-refinement/007-follow-up-fixes/002-leaf-generator-ignores --strict` prints `RESULT: PASSED` after the build.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `git` on PATH (2.50.1 locally, `ubuntu-latest` in CI) | Without git the name rules apply. A git-only rule such as `generated/` is then kept | The ignored-leaf case needs git and is the only case that proves git is consulted |
| Risk | macOS temp directories resolve through `/var` to `/private/var`, so an unresolved path never matches the repository root that git prints | The ignored file is kept and the case fails | Resolve the repository root and each candidate's directory with `fs.realpathSync` before computing relative paths (plan.md section 3) |
| Risk | A leaf symlink whose target is ignored would be dropped if judged by its target | A linked leaf vanishes from the manifest, which the walk's own comment forbids | Judge each candidate by its own path: resolve only its directory. This departs from a plain `realpathSync` of the walked path. Recorded in tasks.md and the goal log |
| Risk | One candidate outside the work tree makes check-ignore exit 128 for the whole batch | That walk uses the name rules instead of git | Accepted. In this repository every packet is inside the work tree, so this does not occur today |
| Risk | Tests run with TMPDIR inside a git work tree would send the fallback case down the git path | The fallback case still passes, because this repository's `.gitignore` also ignores `node_modules/`, `.DS_Store`, `__pycache__/` and `*.pyc` (lines 50, 17, 267 and 269) | None needed. The case asserts the result, not the path taken |
| Risk | `implementation-summary.md` still holds scaffold text | The packet is not delivery-complete | Out of this plan. The builder fills it at delivery |

### Open Questions

- Should the create-skill `.test.cjs` files be wired into a CI workflow? None runs them today. Out of scope here; the operator decides.
<!-- /ANCHOR:risks -->

---


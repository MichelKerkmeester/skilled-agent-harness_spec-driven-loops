---
title: "Feature Specification: README audit and changelog validator accuracy fixes"
description: "The README audit counts git-ignored runtime paths and package-relative paths as broken, audits two files that are not READMEs, and the changelog omission check reads SHA-256 as an internal id."
trigger_phrases:
  - "audit and validator accuracy"
  - "readme audit and changelog validator accuracy fixes"
  - "gitignored runtime path"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: README audit and changelog validator accuracy fixes

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-27 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`audit_readmes.py` reports a link to a log, a state file or a build output as broken, although git ignores those paths and a clean checkout never holds them. It misses bare paths that package docs write from the package root, and it audits the `/create:readme` command file and a test fixture as READMEs. The changelog omission check flags the hash name SHA-256 as an internal id.

### Purpose
Each checker reports only what is really wrong, so the repo-wide counts measure real documentation debt.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ python3 .skilled/skills/sk-doc/sk-create-readme/scripts/audit_readmes.py --json-out audit-before.json
  "readmes_total": 754,
  "template_invalid": 237,
  "broken_references": 98,
  "missing_key_artifacts": 14,
changelog check over 884 tracked changelog files under .skilled/skills: 4 files warn, each on SHA-256
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Resolve an unresolved reference that names a git-ignored path inside the repo, with evidence `gitignored_runtime_path`.
- Resolve bare reference tokens from the nearest folder holding a `package.json`.
- Test the symlink claim against the current broken list.
- Match README names case-sensitively in discovery and the durable manifest.
- Treat a folder ending in `-fixture` as a fixture payload.
- Stop the changelog id pattern from matching algorithm names.

### Out of Scope
- Fixing the remaining broken references in READMEs - they are document debt owned by other lanes.
- Rewording the two system-spec-kit changelog entries the task-id pattern now flags - outside this lane's file set.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/sk-doc/sk-create-readme/scripts/audit_readmes.py` | Modify | Reference resolution, discovery, fixture rule |
| `.skilled/skills/sk-doc/shared/scripts/validate_document.py` | Modify | Changelog internal-id pattern |
| `.skilled/skills/sk-doc/scripts/tests/test_audit_readmes_accuracy.py` | Create | Audit regression tests |
| `.skilled/skills/sk-doc/scripts/tests/test_changelog_validator.py` | Modify | Id pattern tests |
| `.skilled/skills/sk-doc/scripts/tests/code-folder/durable-directory-manifest.json` | Regenerate | Three directories leave the manifest |
| `.skilled/skills/sk-doc/sk-create-readme/scripts/README.md`, `.skilled/skills/sk-doc/scripts/tests/README.md` | Modify | Describe the checks and the new test |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Each of the six changes has a test that fails on the old code and passes on the new code, and the full sk-doc script suite passes. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-002 | An audit run shows template_invalid down by 2, missing_key_artifacts down by 1 and broken_references down by the listed gitignored and package-relative items. |
| REQ-003 | The changelog check no longer warns on SHA-256, and ADR, REQ, CR and T ids still warn. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `audit_readmes.py` reports template_invalid 235, broken_references 50 and missing_key_artifacts 13 on this tree.
- **SC-002**: `run-script-tests.sh` prints `all sk-doc script tests passed`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `git check-ignore` | Without git no reference is cleared | A git error returns no ignored paths, so references stay broken |
| Risk | A broad ignore rule clears a mistyped link | Med | The path's folder must exist or be ignored too |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: One `git check-ignore` call per audit run, not one per reference.

### Reliability
- **NFR-R01**: A git failure leaves every reference broken rather than clearing one on a guess.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: no broken references means no git call.
- Maximum input: all unresolved paths of every README go to one batched call.
- Failure path: a path that resolves outside the repo is never asked and stays broken.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 8/25 | Two scripts, two test files, one manifest |
| Risk | 6/25 | Checker output only; no runtime behavior |
| Research | 6/20 | Symlink claim and gitignore semantics checked |
| **Total** | **20/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

---

---
title: "Feature Specification: Doc tooling fixes found while writing the install guide and v4.0.2.0 notes"
description: "Writing the install guide and amending the v4.0.2.0 release showed four tooling gaps: README rules that favour bullets, no way to amend a published release, a version bump that double-raises on merges and a voice scan that counts a product name as a blocker word."
trigger_phrases:
  - "doc tooling prose and release amend"
  - "readme paragraphs over bullets"
  - "amend a published release"
  - "doc version bump on merge"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Doc tooling fixes found while writing the install guide and v4.0.2.0 notes

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-08 |
| **Branch** | `worktrees/324-overlay-repin-barter-parity` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The README rules turned any paragraph with several points into bullets, so the root README grew to 537 bullet lines. A published release had no amend path, so the v4.0.2.0 body was rebuilt by hand four times. The doc-version bump raised main's docs again on every merge. The voice scan counted "DeepSeek Harness" as a hard blocker.

### Purpose
Each of the four tools does the right thing on its own, so the next README, release amend, merge and scan need no manual workaround.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
grep -c '^\s*[-*] ' README.md            (before the rewrite)  537
hvr_scan.py README.md                     hard blockers: 9, all "harness" in DeepSeek Harness
git merge origin/main, then git commit    [gate:doc-version-bump] raised .../cli-codex/README.md: 1.9.6.0 -> 1.9.7.0
                                          (main already carried 1.9.6.0 for that body)
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Rewrite the sk-create-readme prose rule: short paragraphs, bullets only for scannable items, a root install document for a long install and one section-spacing rule.
- Add `build_release_notes.py`, an amend path for a published release and a reader-impact ordering rule to sk-create-changelog.
- Stop the doc-version bump raising a doc a merge brings in unchanged.
- Exempt listed product names from the voice scan's word blockers.
- Make the root README's `&nbsp;` section spacing consistent.

### Out of Scope
- Moving the `v4.0.2.0` tag - the permission check blocks it and the later commits change only docs.
- The `test_readme_manifest.py` failure - main's ask-surface-guard benchmark folders caused it, not this work.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/sk-doc/sk-create-readme/SKILL.md`, `assets/readme-template.md`, `references/readme/writing-patterns.md`, `references/readme/quality-and-checklist.md` | Modify | Prose, install-document and spacing rules |
| `.skilled/skills/sk-doc/sk-create-changelog/scripts/build_release_notes.py` | Create | Release body builder |
| `.skilled/skills/sk-doc/sk-create-changelog/SKILL.md`, `scripts/README.md`, `.skilled/commands/create/assets/create-changelog-*.yaml` | Modify | Amend path, ordering rule, builder wiring |
| `.skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs` | Modify | Skip docs taken unchanged from a merged-in parent |
| `.skilled/skills/sk-doc/sk-create-with-human-voice/scripts/hvr_scan.py`, `references/hvr-rules.md` | Modify | Proper-name exemption |
| `README.md` | Modify | One `&nbsp;` above every H2, H3 and H4 |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | A merge keeps a doc's version when the merged-in side already has that exact doc | `pre-commit.test.sh` merge case passes and fails on the old engine |
| REQ-002 | The release body comes from one script | `build_release_notes.py v4.0.2.0.md` output equals the published body byte for byte |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | README rules favour short paragraphs | `rg -n "several distinct points" sk-create-readme` prints nothing |
| REQ-004 | A listed product name is no blocker | `test_hvr_scan.py` proper-name check passes and fails on the old scanner |
| REQ-005 | Root README spacing is uniform | Every H2 and H4 has a `&nbsp;` above it, and every H3 that does not follow a heading |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `bash .skilled/scripts/git-hooks/tests/pre-commit.test.sh` prints `163 passed, 0 failed`.
- **SC-002**: `hvr_scan.py README.md` reports 0 hard blockers.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `gh` for the amend path | An amend cannot run without it | The amend path names `gh release edit` and stops when `gh` is unauthenticated |
| Risk | A merged-in doc whose side changed the body without a raise passes unraised | Low | The merged-in side's own pre-commit gate raises it there |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None
<!-- /ANCHOR:questions -->

---

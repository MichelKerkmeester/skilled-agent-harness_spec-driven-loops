---
title: "Feature Specification: Align the root release, contributing and security docs with the current repository"
description: "PUBLIC-RELEASE.md, CONTRIBUTING.md and SECURITY.md described an older repository: a singular .opencode layout, manual symlinks, a v4.0.0.1 release and counts that no longer match. This packet corrects the three files against the tree."
trigger_phrases:
  - "root release docs alignment"
  - "align the root release contributing and security docs"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Align the root release, contributing and security docs with the current repository

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-09 |
| **Branch** | `worktrees/334-v4-release-remediation` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Three root documents told readers things the repository no longer does. `PUBLIC-RELEASE.md` showed singular `skill/ agent/ command/` folders, a `.opencode-local` database, manual `ln -s` project setup, a `git add -A` release commit with a subject the commit hook rejects and v4.0.0.1 as the current release. `CONTRIBUTING.md` installed a memory MCP server that is gone, set a 72-character subject target and showed a pull request description that CI rejects. `SECURITY.md` carried stale counts and left Pi and DeepSeek Harness out of several path lists.

### Purpose
A reader who follows any of the three files reaches a working result on the current tree.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ python3 .skilled/skills/sk-doc/sk-create-with-human-voice/scripts/hvr_scan.py PUBLIC-RELEASE.md
  hard blockers:          9
  mechanical ceiling:     53/100
$ python3 .skilled/skills/sk-doc/scripts/validate_document.py PUBLIC-RELEASE.md
INVALID: PUBLIC-RELEASE.md, 1 blocking (missing overview section), 6 warnings
$ hvr_scan.py CONTRIBUTING.md   -> hard blockers 0, ceiling 98/100
$ hvr_scan.py SECURITY.md       -> hard blockers 0, ceiling 97/100
$ git tag --sort=-v:refname | head -1
v4.0.2.0
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Rewrite `PUBLIC-RELEASE.md` for the `.skilled/` layout, the seven runtime folders, link or copy adoption, the hook-enforced release steps and the series history through 4.0.2.x
- Correct the setup, test, code style, commit, branch and pull request rules in `CONTRIBUTING.md`
- Correct the counts, flags, path lists and safeguard rows in `SECURITY.md`
- Register this child in the parent phase map and graph metadata

### Out of Scope
- `.skilled/changelog/skilled/README.md`, which still calls v4.0.0.4 unreleased - a separate file nobody asked to change
- New `SECURITY.md` sections for the uncovered surfaces listed in `implementation-summary.md` - each needs an operator decision on how much to disclose
- The host index findings from the alignment run - they belong to the sibling packet

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `PUBLIC-RELEASE.md` | Modify | Full rewrite against the current tree |
| `CONTRIBUTING.md` | Modify | Full rewrite, same section order |
| `SECURITY.md` | Modify | Sixteen targeted corrections |
| `../spec.md`, `../graph-metadata.json` | Modify | Add this child |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `PUBLIC-RELEASE.md` names no path or step the tree lacks | `rg -n 'opencode-local\|git add -A\"\|skill/  \|v4.0.0.1' PUBLIC-RELEASE.md` prints no stale instruction, and `validate_document.py PUBLIC-RELEASE.md` prints `VALID` |
| REQ-002 | `CONTRIBUTING.md` states the rules the hooks and CI enforce | The file names the 80 and 100 character limits, `## Summary` and `## Test Plan`, and no `voyage` string |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | `SECURITY.md` counts and flags match their source files | The file says thirteen package trees, three Chrome DevTools entries and four `mcp-remote` entries, and `validate_document.py SECURITY.md` prints `VALID` |
| REQ-004 | No file gains a voice-rule hard blocker | `hvr_scan.py` reports no more hard blockers than the baseline for each file |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `validate_document.py` prints `VALID` for `PUBLIC-RELEASE.md` and `SECURITY.md`
- **SC-002**: `hvr_scan.py PUBLIC-RELEASE.md` reports at most 1 hard blocker, down from 9
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Two read-only fact-check agents | A wrong finding lands in a public document | Each finding used was re-read in its source file before the edit |
| Risk | A command in the docs was not executed | Low | The two `npm test` commands are named in the limitations as not run |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should `SECURITY.md` cover the surfaces listed under Known Limitations in `implementation-summary.md`? Decision: left to the operator.
<!-- /ANCHOR:questions -->

---

---
title: "Feature Specification: Phase 1: honest-checker"
description: "Make the comment-hygiene checker cover the languages and comment forms it claims, drop two named false positives, and point the ceiling report, the post-edit router and two CI rows at one comment-family table."
trigger_phrases:
  - "honest checker"
  - "phase 1 honest checker"
  - "comment hygiene checker languages"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.3 -->
# Feature Specification: Phase 1: honest-checker

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-10-25 |
| **Branch** | `worktrees/218-ci-efficiency-build` |
| **Parent Spec** | ../spec.md |
| **Phase** | 1 of 6 |
| **Predecessor** | None |
| **Successor** | 002-builtin-runner |
| **Handoff Criteria** | The checker emits the `comment-hygiene/v1` JSON, the reason text and the family table that 002-builtin-runner reads. The four quality bash suites, the router unit test and the three adapter suites pass. The design 6.4 baseline delta is classed under the halt threshold in ADR-010. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 1** of the program that makes sk-code-quality a codebase-agnostic, executable author gate. The parent packet is `specs/sk-code/015-quality-agnostic-gate/`. The synthesized design is not stored in the repository. Design references in this folder cite its section numbers, such as "design D5", and each decision the design left open is recorded in `decision-record.md`.

**Scope Boundary**: The comment-hygiene checker, the ceiling report's root and extensions, the post-edit router's checker path and notice, two CI workflow rows, the router unit test, and doctrine-free wording fixes in the quality mode. The phase reads no `.sk-code` config and changes no doctrine.

**Dependencies**:
- Earlier phases: none. This is the first phase of the program, so no earlier phase output is needed.
- Later phase that reads this phase: 002-builtin-runner reads `Q/assets/comment-syntax.json`, the checker's `--json` document and its reason field.

**Deliverables**:
- `Q/assets/comment-syntax.json`, the comment-family table that four readers share.
- The checker with language dispatch, URL span stripping, docstring and block-body tracking, the issue and ticket rule, the narrowed `NNN/NNN` pattern, `--json`, reasons and exit 3 for usage errors.
- The ceiling report and post-edit router changes, with a new router unit test.
- Two CI workflow changes.
- Doctrine-free fixes in the quality mode, its README, its scripts README, its style guide, the universal checklist and the CQ-001 checklist.
- Versions: sk-code-quality 1.5.0.0, its README edition 1.2.5.0, and the sk-code hub 3.1.0.0, each with a changelog file.

**Changelog**: The packet changelog is written in the parent packet's changelog folder when this phase lands. Its name follows the parent number and the phase number. It names the baseline delta counts per class. The quality and hub changelogs are listed in section 3.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The comment-hygiene checker is the one engine that blocks ephemeral labels in comments, yet it reads nine extensions only. It misses a spec path on a line that also holds a URL, an ADR id inside a Python docstring, an ADR id on a block-comment body line and a `fixes issue #1234` reference. It also flags `retry ratio 100/250`, `two-phase commit: phase 0 prepares` and `emulates the T1000 timer chip`. A repository with Go or Rust files gets no check on them, and the post-edit router skips the checker silently when the project folder does not hold it.

### Purpose
After this phase the checker covers the comment forms and languages it claims, drops the false positives this phase fixes, and the ceiling report, the router and the CI rows read one table and report a missing checker instead of passing it.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Checker: comment families from `Q/assets/comment-syntax.json`, language choice by shebang before extension, URL span stripping, Python docstrings and block-comment bodies, the issue and ticket rule, the narrowed `NNN/NNN` pattern, `--json`, reason text and exit 3 for usage errors.
- Ceiling report: repository root from the working directory, and extensions from the table.
- Post-edit router: checker path under the router's own real path first, extensions from the table with a built-in fallback, one `quality-notice` for a missing checker, and a router unit test.
- CI: the comment-hygiene workflow finds the checker, fails on exit 3 and above, and annotates violations. The script-tests workflow runs the four quality bash suites.
- Doctrine-free fixes named in design section 5.2: the spec root, the unit-test claim, `DEFAULT_RESOURCE`, the handback wording, `--all`, the test list and the playbook test claim. The universal checklist spec-root rows from design section 5.4 are in scope too.

### Out of Scope
- The `.sk-code/quality.json` config and its readers. Phase 3, design D16 (ADR-003).
- The runner `quality-gate.cjs`, its exit codes and its verdict. Phase 2.
- Doctrine changes: Iron Law 3, the UNKNOWN rows, the universal checklist retitle, the mechanical floor, the severity crosswalk, CHK-CSS-09, the P0 table link, the verification template wording and the style guide pointers at lines 40 and 105. Phase 4 (ADR-001 and ADR-002).
- Hub routing keywords, hub metadata, the `@code` step and the verify reader rule. Phase 5.
- Any change to CI or pre-commit file scope. ADR-004 keeps both whole-file.
- Narrowing the `phase 0` and `T\d{3,4}` patterns. ADR-007 keeps both.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/sk-code/sk-code-quality/scripts/check-comment-hygiene.sh` | Modify | Dispatch, span stripping, docstrings, block bodies, issue rule, slash pattern, JSON, reasons, exit 3 |
| `.skilled/skills/sk-code/sk-code-quality/assets/comment-syntax.json` | Create | Extension, shebang and comment-family table |
| `.skilled/skills/sk-code/sk-code-quality/scripts/check-comment-hygiene.test.sh` | Modify | Language, regression, JSON and usage cases |
| `.skilled/skills/sk-code/sk-code-quality/scripts/ceiling-report.sh` | Modify | Root from the working directory, extensions from the table |
| `.skilled/skills/sk-code/sk-code-quality/scripts/ceiling-report.test.sh` | Modify | Subfolder case |
| `.skilled/hooks/post-edit-quality/lib/post-edit-router.cjs` | Modify | Checker path, extension table, notice |
| `.skilled/hooks/post-edit-quality/lib/post-edit-router.test.cjs` | Create | Router unit test |
| `.skilled/hooks/post-edit-quality/codex/post-edit-quality.test.cjs` | Modify | Stub checker replaced by a line the real checker flags |
| `.skilled/hooks/post-edit-quality/devin/post-edit-quality.test.cjs` | Modify | Stub checker replaced by a line the real checker flags |
| `.github/workflows/comment-hygiene.yml` | Modify | Checker path, exit handling and line annotations |
| `.github/workflows/sk-code-script-tests.yml` | Modify | Runs the four quality bash suites |
| `.skilled/skills/sk-code/sk-code-quality/SKILL.md` | Modify | Spec root, claim, DEFAULT_RESOURCE, handback, version 1.5.0.0 |
| `.skilled/skills/sk-code/sk-code-quality/README.md` | Modify | Drops `--all`, edition 1.2.5.0 |
| `.skilled/skills/sk-code/sk-code-quality/scripts/README.md` | Modify | Lists the four bash suites |
| `.skilled/skills/sk-code/sk-code-quality/references/code-style-guide.md` | Modify | Path examples at lines 147 and 151 |
| `.skilled/skills/sk-code/sk-code-quality/manual-testing-playbook/quality-gate/quality-checklist.md` | Modify | CQ-001 path loop |
| `.skilled/skills/sk-code/sk-code-quality/manual-testing-playbook/manual-testing-playbook.md` | Modify | Hook test claim at line 178 |
| `.skilled/skills/sk-code/sk-code-quality/changelog/v1.5.0.0.md` | Create | Quality changelog with the baseline counts |
| `.skilled/skills/sk-code/sk-code-skilled/assets/checklists/universal-checklist.md` | Modify | Spec-root rows at lines 89 and 114 |
| `.skilled/skills/sk-code/SKILL.md` | Modify | Hub version 3.1.0.0 |
| `.skilled/skills/sk-code/description.json` | Modify | Hub version 3.1.0.0 |
| `.skilled/skills/sk-code/hub-router.json` | Modify | Hub version 3.1.0.0 |
| `.skilled/skills/sk-code/mode-registry.json` | Modify | Hub version 3.1.0.0 |
| `.skilled/skills/sk-code/changelog/v3.1.0.0.md` | Create | Hub changelog |
| `specs/sk-code/015-quality-agnostic-gate/changelog/changelog-015-001-honest-checker.md` | Create | Packet changelog, written when the phase lands |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | The checker reads the family table from its own real path. It picks a file's language from a shebang that names one, and from the extension otherwise. It reads only the first line for the shebang. |
| REQ-002 | The checker covers `py`, `sh`, `tsx`, `mts`, `jsonc`, `go`, `rs`, `yaml`, `css`, `toml` and `sql`. Each has one violation case and one clean case in the checker suite. |
| REQ-003 | The checker removes URL spans from a comment before it searches the text, so a spec path beside a URL is flagged. It no longer skips the whole line. |
| REQ-004 | The checker treats Python docstring text and block-comment body lines as comment text. `REQ-12` in a docstring and `ADR-12` on a block body line are flagged. |
| REQ-005 | The checker flags `fixes`, `fixed`, `closes`, `resolves`, `issue`, `ticket` or `bug` followed by `#` and digits, case-insensitively. It also accepts three repeatable arguments for repository additions, `--ticket-prefix PREFIX`, `--extension EXT=FAMILY` and `--extra-pattern REGEX`, which phase 003 passes from the repository config. Each `--ticket-prefix` becomes `\bPREFIX-[0-9][0-9A-Za-z]*\b`. |
| REQ-006 | The checker narrows the `NNN/NNN` pattern to a zero-padded second number, so `100/250` passes and `042/003` still flags. |
| REQ-007 | The checker keeps the `T\d{3,4}` and `phase 0` patterns unchanged, so the two pinned suite cases keep expecting exit 1 (ADR-007). |
| REQ-008 | With `--json`, the checker prints one `comment-hygiene/v1` document with a status for every file. A file that cannot be read appears with status `unreadable`, even when the exit code is 1. |
| REQ-009 | Text findings end with the reason in brackets. A run with no arguments exits 3, not 2. |
| REQ-010 | The ceiling report takes the repository root from the working directory and reads its extensions from the family table. |
| REQ-011 | The post-edit router finds the checker under its own real path before the project folder. It reads extensions from the table, with the built-in set as fallback. A missing checker yields one de-duplicated `quality-notice`. The router writes nothing to stdout or stderr. |
| REQ-012 | The comment-hygiene workflow finds the checker under `.skilled/` or `.opencode/`. It fails on exit 3 and on any exit code above 2, so a missing interpreter fails the job. It annotates each violation with its line and reason from `--json`. Its file scope stays whole-file (ADR-004). |
| REQ-013 | The script-tests workflow runs the four quality bash suites: `check-comment-hygiene.test.sh`, `ceiling-report.test.sh`, `typo-flags.test.sh` and `hooks/claude-posttooluse.test.sh`. |
| REQ-014 | Every comment in changed code states a durable reason only. No spec path, packet or phase number, requirement id, task id, ADR id or ticket id appears in one. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-015 | The quality mode `SKILL.md` names `specs/` as the spec root, replaces "OpenCode" in its trigger lines with surface wording, drops the "verified by a unit test" claim, hands fixes back to "the acting agent applying `workflow-implement.md`", and lists the three always-loaded resources in `DEFAULT_RESOURCE`. |
| REQ-016 | The quality README drops the `--all` recommendation and carries edition 1.2.5.0. The scripts README lists the four bash suites. The style guide path examples at lines 147 and 151 name `specs/`. The CQ-001 path loop matches the three always-loaded resources, and the playbook claim at line 178 matches what the hook test runs. |
| REQ-017 | The universal checklist spec-root rows at lines 89 and 114 name `specs/` and `.skilled/specs/`, and no `.opencode/specs` path remains in them. |
| REQ-018 | The router unit test, and the codex, devin and opencode plugin suites, exit 0. The codex and devin fixtures use a line the real checker flags. |
| REQ-019 | sk-code-quality is 1.5.0.0 with `changelog/v1.5.0.0.md`. The sk-code hub is 3.1.0.0 in four files with `changelog/v3.1.0.0.md`. The packet changelog exists. |
| REQ-020 | The design 6.4 baseline runs before merge. Every delta line falls in a class, the class counts appear in the quality changelog, and the new-language class stays within the halt threshold in ADR-010. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The four quality bash suites exit 0, and each prints its All-passed line.
- **SC-002**: The router unit test and the codex, devin and opencode plugin suites exit 0.
- **SC-003**: `actionlint` exits 0 on both changed workflows.
- **SC-004**: The quality mode `SKILL.md` holds no `.opencode/specs` path and no unit-test routing claim.
- **SC-005**: The 6.4 baseline delta is classed, and its class counts add up to the delta line count.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `python3` runs the checker in CI and pre-commit. `node` runs the router and its tests. | If either is absent, the checker or the router cannot run. | CI fails on exit codes above 2, so a missing interpreter fails the job (REQ-012). This phase installs nothing. |
| Risk | New-language coverage flags existing comments in this repository, and CI and pre-commit block on them. | High | The 6.4 baseline runs before merge. ADR-010 stops the phase when the new-language class is large. |
| Risk | Router-first checker resolution changes which checker the stub fixtures reach. | Med | The codex and devin fixtures switch to a line the real checker flags (ADR-009). |
| Risk | Two named false positives remain: `two-phase commit: phase 0 prepares` and `T1000` in a comment. | Low | The `hygiene-ok` escape covers them. ADR-007 records the reversal. |
| Risk | Bare `NNN/1xx` numbers, such as a child numbered 100 or more, are no longer flagged. | Low | The `specs/` path rule still flags the path form. ADR-008 records the trade. |
| Dependency | The synthesized design is held outside the repository. | Low | Each design decision this phase uses is copied into `decision-record.md` with its section number. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

N/A: The checker and the router run as local tools and serve no request, so no response-time or throughput target applies to this phase. The design budget of under 2 seconds for 50 changed files is measured in Phase 6.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

### Data Boundaries
- Empty input: running the checker with no arguments prints the usage line and exits 3 (REQ-009).
- Maximum length: unchanged in this phase. The checker reads each file whole, as it does today. The 2 MB limit arrives with the runner in Phase 2.
- Invalid format: a file whose shebang names no known interpreter uses its extension. A file with no known extension and no known shebang is skipped for that file, as it is today.

### Error Scenarios
- Unreadable file beside readable ones: the checker prints the read error to stderr, lists the file as `unreadable` in `--json`, and keeps the results of the other files (REQ-008).
- Family table missing or unreadable: the checker exits 3, because the blocking engine fails closed. The router falls back to the built-in set and stays fail-open (REQ-011).
- Checker missing for the router: one `quality-notice` is returned and nothing is printed (REQ-011).
- Interpreter missing in CI: the job fails on exit code 127 (REQ-012).

### State Transitions
- Partial run: some files violate and one is unreadable. The exit code is 1, and `--json` lists the unreadable file (REQ-008).
- Repeated run: the table is read once per process. No cache or state file is written.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 15/25 | About 20 files across three runtimes, two workflows, one new table and one new test file |
| Risk | 16/25 | Changes a HARD BLOCK detector, two CI gates and five router consumers |
| Research | 8/20 | The design, the probes in this pass and the suite baselines are done |
| **Total** | **39/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Operator: confirm ADR-007, which keeps the `phase 0` and `T\d{3,4}` patterns and leaves two named false positives in place. Default taken: keep detection.
- Operator: confirm the halt threshold in ADR-010, 50 new-language delta lines across 20 files. The design gives no number. Default taken: the threshold stands.
- Operator: confirm ADR-009, which resolves the router's checker from its own real path first. Default taken: follow the design.

None of these blocks Step 1 in `plan.md`.
<!-- /ANCHOR:questions -->

---

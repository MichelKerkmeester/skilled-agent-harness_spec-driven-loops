---
title: "Acceptance Criteria: Phase 1: honest-checker"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "honest checker acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/015-quality-agnostic-gate/001-honest-checker"
    last_updated_at: "2026-10-26T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Implement Step 1 of plan.md, then meet each criterion with its command"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-001-authoring"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.3 -->
# Acceptance Criteria: Phase 1: honest-checker

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** sk-code/015-quality-agnostic-gate/001-honest-checker
**Level:** 2
**Status:** Draft
**Date:** 2026-10-26
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. In every Verification cell, `Q/` stands for `.skilled/skills/sk-code/sk-code-quality/` and `H/` stands for `.skilled/skills/sk-code/`. Run each command from the repository root with the full path in place of the shorthand.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a `.sh` file whose shebang names python3 and whose second line is `# ADR-12 x`, When the checker runs on it, Then it prints a line ending `[ADR reference]` and exits 1 | `printf '#!/usr/bin/env python3\n# ADR-12 x\n' > scratch/shebang.sh && python3 -B Q/scripts/check-comment-hygiene.sh scratch/shebang.sh` prints that line and exits 1 | Unmet | - |
| AC-002 | REQ-002 | Given one violation case and one clean case for each of the eleven families, When the checker suite runs, Then every case passes | `bash Q/scripts/check-comment-hygiene.test.sh` prints `All comment hygiene test cases passed` and exits 0 | Unmet | - |
| AC-003 | REQ-003 | Given the comment `// see https://example.test/a and specs/042-foo/x.md`, When the checker runs on it, Then it prints a line ending `[spec path reference]` and exits 1 | `printf '// see https://example.test/a and specs/042-foo/x.md\n' > scratch/url.js && python3 -B Q/scripts/check-comment-hygiene.sh scratch/url.js` prints that line and exits 1 | Unmet | - |
| AC-004 | REQ-004 | Given a docstring line `REQ-12 is covered here.` and a block-comment body line ` ADR-12 body`, When the checker runs on each file, Then each file gives one finding | `python3 -B Q/scripts/check-comment-hygiene.sh scratch/doc.py` prints a line ending `[REQ reference]`, and `python3 -B Q/scripts/check-comment-hygiene.sh scratch/block.js` prints a line ending `[ADR reference]` | Unmet | - |
| AC-005 | REQ-005 | Given the comment `// fixes issue #1234`, When the checker runs on it, Then it prints a line ending `[issue or ticket reference]` and exits 1 | `printf '// fixes issue #1234\n' > scratch/issue.js && python3 -B Q/scripts/check-comment-hygiene.sh scratch/issue.js` prints that line and exits 1, and `printf '// see JIRA-12\n' > scratch/jira.js && python3 -B Q/scripts/check-comment-hygiene.sh --ticket-prefix JIRA scratch/jira.js` exits 1 | Unmet | - |
| AC-006 | REQ-006 | Given the comments `// retry ratio 100/250` and `// ratio 042/003`, When the checker runs on each, Then the first exits 0 with no output and the second exits 1 | `python3 -B Q/scripts/check-comment-hygiene.sh scratch/ratio.js` exits 0 with no output, and `python3 -B Q/scripts/check-comment-hygiene.sh scratch/zero.js` exits 1 | Unmet | - |
| AC-007 | REQ-007 | Given the two pinned suite cases `generic_phase_zero` and `motion_label_with_id`, When the suite source is searched, Then both still expect exit 1 | `rg -n -e 'generic_phase_zero' -e 'motion_label_with_id' Q/scripts/check-comment-hygiene.test.sh` prints two lines, each containing `run_case 1 ` | Unmet | - |
| AC-008 | REQ-008 | Given one violating file and one path that does not exist, When the checker runs with `--json`, Then the document lists the missing path with status `unreadable` and the exit code is 1 | `python3 -B Q/scripts/check-comment-hygiene.sh --json scratch/issue.js scratch/missing.js` prints a document containing `"status": "unreadable"` and exits 1 | Unmet | - |
| AC-009 | REQ-009 | Given the checker with no arguments, When it runs, Then it exits 3, and a text finding ends with its reason in brackets | `python3 -B Q/scripts/check-comment-hygiene.sh` exits 3, and `python3 -B Q/scripts/check-comment-hygiene.sh scratch/issue.js` prints a line ending `[issue or ticket reference]` | Unmet | - |
| AC-010 | REQ-010 | Given the ceiling report run from a subfolder of a temporary repository, When the ceiling suite runs, Then the subfolder case passes | `bash Q/scripts/ceiling-report.test.sh` prints `All ceiling report test cases passed` and exits 0 | Unmet | - |
| AC-011 | REQ-011 | Given a project whose own tree lacks the checker, When the router resolves dispatch for a file in that project, Then the checker path lies under the router's own folder | `node --test .skilled/hooks/post-edit-quality/lib/post-edit-router.test.cjs` exits 0, including the case `resolves the checker from the router folder` | Unmet | - |
| AC-012 | REQ-011 | Given no checker at the resolved path, When the router runs its checks, Then one `quality-notice` entry is returned and nothing is written to stdout or stderr | `node --test .skilled/hooks/post-edit-quality/lib/post-edit-router.test.cjs` exits 0, including the case `returns one quality-notice for a missing checker` | Unmet | - |
| AC-013 | REQ-012 | Given a pull request that changes a file with a violation, When the comment-hygiene job runs, Then it annotates the line and fails the job | `actionlint .github/workflows/comment-hygiene.yml` exits 0, and `rg -n -F 'line=' .github/workflows/comment-hygiene.yml` prints at least one annotation line. A live pull request run confirms the failure path. | Unmet | - |
| AC-014 | REQ-013 | Given the script-tests workflow, When it is read, Then it names the four quality bash suites | `rg -c 'sk-code-quality/scripts/(hooks/)?[a-z-]+[.]test[.]sh' .github/workflows/sk-code-script-tests.yml` prints 4 | Unmet | - |
| AC-015 | REQ-013 | Given the four quality bash suites, When each runs, Then each exits 0 and prints its final line | `bash Q/scripts/check-comment-hygiene.test.sh`, `bash Q/scripts/ceiling-report.test.sh`, `bash Q/scripts/typo-flags.test.sh` and `bash Q/scripts/hooks/claude-posttooluse.test.sh` each exit 0, and print their All-passed lines, or `Post-edit adapter parse regression fixture passed` for the hook suite | Unmet | - |
| AC-016 | REQ-014 | Given the changed code files, When the checker runs over them, Then it exits 0 with no output | `python3 -B Q/scripts/check-comment-hygiene.sh` run on each changed `.sh`, `.js`, `.cjs` and `.py` file exits 0 with no output | Unmet | - |
| AC-017 | REQ-015 | Given the quality mode `SKILL.md`, When its spec-root and routing claims are searched, Then neither `.opencode/specs` nor `unit test` remains | `rg -n -e '\.opencode/specs' -e 'unit test' Q/SKILL.md` prints no line | Unmet | - |
| AC-018 | REQ-015 | Given the `DEFAULT_RESOURCE` block, When it is read, Then it lists the three always-loaded resources and not the verification template | `sed -n '/^DEFAULT_RESOURCE/,/^]/p' Q/SKILL.md` lists three quoted paths and no `verification-quick-reference` path | Unmet | - |
| AC-019 | REQ-015 | Given the handback lines, When they are read, Then they name the acting agent applying `workflow-implement.md` | `rg -n 'workflow-implement.md' Q/SKILL.md` lists lines 15, 35, 186 and 278 | Unmet | - |
| AC-020 | REQ-016 | Given the quality README, When it is searched, Then `--all` is not recommended and the frontmatter version reads 1.2.5.0 | `rg -n -F -- '--all' Q/README.md` prints no line, and `rg -n '^version:' Q/README.md` prints a line ending `version: 1.2.5.0` | Unmet | - |
| AC-021 | REQ-016 | Given the scripts README VALIDATION section, When it is read, Then it lists the four bash suites | `sed -n '/## 3. VALIDATION/,/## 4/p' Q/scripts/README.md` lists four `.test.sh` paths | Unmet | - |
| AC-022 | REQ-016 | Given the style guide and the playbook test claim, When each is read, Then each matches the code | `rg -n -F '.opencode/specs' Q/references/code-style-guide.md` prints no line, and `sed -n '178p' Q/manual-testing-playbook/manual-testing-playbook.md` contains `node --check` | Unmet | - |
| AC-023 | REQ-016 | Given the CQ-001 path loop, When it runs from the repository root, Then each of the three always-loaded resources is found | The loop at line 73 of `Q/manual-testing-playbook/quality-gate/quality-checklist.md` prints `OK` for each of the three paths | Unmet | - |
| AC-024 | REQ-017 | Given the universal checklist, When its spec-root rows are read, Then they name `specs/` and `.skilled/specs/` and no `.opencode/specs` path remains | `rg -n -F '.opencode/specs' .skilled/skills/sk-code/sk-code-skilled/assets/checklists/universal-checklist.md` prints no line | Unmet | - |
| AC-025 | REQ-018 | Given the router unit test and the codex, devin and opencode plugin suites, When each runs, Then each exits 0 | `node --test` on `.skilled/hooks/post-edit-quality/lib/post-edit-router.test.cjs`, `.skilled/hooks/post-edit-quality/codex/post-edit-quality.test.cjs`, `.skilled/hooks/post-edit-quality/devin/post-edit-quality.test.cjs` and `.opencode/plugins/tests/sk-code-post-edit-quality.test.cjs` each exit 0 | Unmet | - |
| AC-026 | REQ-019 | Given the version fields, When they are read, Then sk-code-quality reads 1.5.0.0 and the hub reads 3.1.0.0 in four files | `rg -n '^version:' Q/SKILL.md` prints a line ending `version: 1.5.0.0`, and `rg -n '3[.]1[.]0[.]0' H/SKILL.md H/description.json H/hub-router.json H/mode-registry.json` prints four lines | Unmet | - |
| AC-027 | REQ-019 | Given the release notes, When the files are checked, Then the quality, hub and packet changelog files exist | `test -f Q/changelog/v1.5.0.0.md`, `test -f H/changelog/v3.1.0.0.md` and `test -f specs/sk-code/015-quality-agnostic-gate/changelog/changelog-015-001-honest-checker.md` each exit 0 | Unmet | - |
| AC-028 | REQ-020 | Given the 6.4 baseline run before merge, When its delta is read, Then every delta line falls in a class, and the new-language class stays within ADR-010 | `wc -l < scratch/delta.txt` prints the delta count, the class counts in `Q/changelog/v1.5.0.0.md` add up to that count, and the distinct-file count from `scratch/delta.txt` is 20 or fewer | Unmet | - |

### Status values

| Value | Meaning |
|-------|---------|
| `Met` | Verified. The Verification cell names evidence that was actually observed. |
| `Unmet` | Not yet satisfied. Blocks closure. |
| `Waived` | Deliberately not pursued. Requires an ADR in the Waiver cell. |
| `Superseded` | Replaced by a different criterion or decision. Requires an ADR in the Waiver cell. |

### Waiver cell

Write `-` when the row is `Met` or `Unmet`. Write `ADR-NNN` when the row is
`Waived` or `Superseded`, naming a decision record that exists in
`decision-record.md`. A waiver naming an ADR that is not there fails validation:
the point of a waiver is that someone recorded the reasoning, so an unbacked
waiver is treated as an unmet criterion rather than as a pass.
<!-- /ANCHOR:criteria -->

---

<!-- ANCHOR:closure -->
## 3. CLOSURE STATEMENT

**Closeable:** No

No criterion is Met yet. Implementation has not started, so all 28 rows stay Unmet, and no row carries a waiver.
<!-- /ANCHOR:closure -->

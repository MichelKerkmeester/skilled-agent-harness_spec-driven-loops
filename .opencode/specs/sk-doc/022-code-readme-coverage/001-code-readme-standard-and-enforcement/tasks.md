---
title: "Tasks: Code README Standard And Enforcement"
description: "Task list for child 001: confirm findings and record the operator rulings, restate the standard on the authoring surface, build a fixture corpus, implement the opt-in validator mode and the manifest-walk auditor rewrite, then verify."
trigger_phrases:
  - "code readme standard tasks"
  - "readme enforcement tasks"
  - "code readme validator tasks"
importance_tier: "normal"
contextType: "plan"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/sk-doc/022-code-readme-coverage/001-code-readme-standard-and-enforcement"
    last_updated_at: "2026-07-30T00:00:00Z"
    last_updated_by: "claude"
    recent_action: "Authored task list across all six work phases"
    next_safe_action: "Start T001: confirm all 10 findings against HEAD"
    blockers:
      - "Operator rulings Q1, Q2, Q3 required before Phase 2 tasks can start"
    key_files:
      - ".opencode/specs/sk-doc/022-code-readme-coverage/001-code-readme-standard-and-enforcement/spec.md"
      - ".opencode/specs/sk-doc/022-code-readme-coverage/001-code-readme-standard-and-enforcement/plan.md"
      - ".opencode/specs/sk-doc/022-code-readme-coverage/001-code-readme-standard-and-enforcement/tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "022-001-code-readme-standard-and-enforcement"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Q1: tree vs table equivalence"
      - "Q2: format-rule applicability scope"
      - "Q3: equivalent orientation"
---
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify + level3-arch | v2.2 -->

# Tasks: Code README Standard And Enforcement

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path) {deps: T###}`

Status: In Progress — implementation and verification evidence are recorded below.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

*(originally: Confirm And Decide)*

- [x] **T001 Confirm all findings against HEAD.** Findings are hypotheses. The supplied current-line confirmation records all 10 findings as confirmed at HEAD `c6a07b226c`.
  - `RA-001-01`, `RA-010-01` — `audit_readmes.py:13-23` docstring scope and `find_readmes():288-309`
  - `RA-001-02`, `RA-005-40` — `validate_document.py:1131-1133`
  - `RA-001-03` — `hvr-rules.md:451-454` vs `sk-create-readme/SKILL.md:434-435`
  - `RA-001-04`, `RA-003-06`, `NEW-A1` — `readme-code-template.md:47-58`, `:180-187`, `:189-193`
  - `RA-005-41`, `RA-009-01` — `SKILL.md:217-231`, `:245`, `:140-150`, `:37`
  - `template-rules.json` `documentTypes.readme` (`requiredSections`, `tocRequired`, `h2EmojiRequired`, `h2UppercaseRequired`)
  **HALT and escalate** if the "General README format rules" block has already been re-scoped since 2026-07-30 — the whole Q2 framing changes.
- [x] T002 Re-freeze the durable-directory manifest at current HEAD; 585 derived directories are recorded against the 501 baseline in `durable-directory-manifest.json` {deps: T001}
- [x] T003 [P] Enumerate every CI and script call site of `validate_document.py`; the existing README branch consumers are covered by the parity dump and the full test suite {deps: T001}
- [x] T004 Escalate Q1, Q2 and Q3 to the operator in one message with the research recommendations attached — evidence: locked operator rulings in the build brief {deps: T001}
- [x] T005 Record ADR-001 (tree equivalence), ADR-002 (format-rule scope), ADR-003 (equivalent orientation), ADR-004 (opt-in mode) in `decision-record.md` {deps: T004}
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Authoring Surface

- [x] T010 State the Directory-Tree rule in `SKILL.md` §6 in an implementable form (`sk-create-readme/SKILL.md`) {deps: T005}
- [x] T011 State which general format rules bind code-folder READMEs in §6, cross-referencing the block at `:218-229` (`sk-create-readme/SKILL.md`) {deps: T005}
- [x] T012 [P] Align the code template scaffold with the ruling — frontmatter position, tagline, tree block (`assets/readme-code-template.md`) {deps: T005}
- [x] T013 [P] Reconcile the checklist reference with the ruling (`references/readme/quality-and-checklist.md`) {deps: T005}
- [x] T014 Remove or explicitly scope away the anchor/TOC requirement for code READMEs (`shared/references/hvr-rules.md`) {deps: T005}

### Fixture Corpus

- [x] T020 Create the fixture tree under the existing harness (`sk-doc/scripts/tests/`) {deps: T005}
- [x] T021 Negative fixture: multi-file folder with no Directory Tree — evidence: `missing-tree` fixture returns `code_folder_directory_tree` {deps: T020}
- [x] T022 Flat fixture: exhaustive `CONTENTS` table instead of a fenced tree passes under ADR-001 {deps: T020}
- [x] T023 [P] Negative fixture: missing `---` separators between numbered H2 — evidence: `missing-separator` returns `code_folder_h2_separator` {deps: T020}
- [x] T024 [P] Negative fixture: unnumbered / Title-Case H2 — evidence: `unnumbered-h2` returns `code_folder_h2_numbering` {deps: T020}
- [x] T025 [P] Negative fixture: non-sequential H2 (`3` before `2`) {deps: T020}
- [x] T026 [P] Negative fixture: untagged fenced block — evidence: `untagged-fence` returns `code_folder_fence_language` {deps: T020}
- [x] T027 [P] Negative fixture: broken relative link and a non-existent inline-code path — evidence: `broken-links` returns both reference rule IDs {deps: T020}
- [x] T028 [P] Negative fixture: packet ID, commit hash and `.opencode/specs/` path in body text {deps: T020}
- [x] T029 [P] Negative fixture: TOC plus HTML anchor-comment markup — evidence: `toc-anchor` returns no-TOC and no-anchor IDs {deps: T020}
- [x] T030 Positive control fixture: fully conformant README that also contains a legitimate example command, so the durability grep is exercised against a false-positive case — evidence: control returns `rc=0` {deps: T020}
- [x] T031 Exclusion fixtures for the 21 disposition path classes, including the fixture-owned README case so the validator never scores its own test input — evidence: exclusion runner reports 21/21 and fixture-owned README unscored {deps: T020}

### Validator Mode

- [x] T040 Capture the baseline verdict dump over all existing READMEs and store it as the parity baseline — evidence: `baseline-readme-verdicts.json`, 759 files {deps: T003}
- [x] T041 Add the code-folder `documentTypes` entry to `shared/assets/template-rules.json`; leave the existing narrow `readme` entry untouched {deps: T005}
- [x] T042 Implement the opt-in code-folder branch in `shared/scripts/validate_document.py` {deps: T041, T030}
- [x] T043 Implement the Directory-Tree check per ADR-001 — evidence: `validate_document.py` emits named tree and flat-inventory rule IDs {deps: T042}
- [x] T044 [P] Implement the separator, numbering, casing and fence-language checks per ADR-002 — evidence: `test_code_folder_readme.py` flags each expected format rule {deps: T042}
- [x] T045 [P] Implement local-link and inline-code path resolution, relative to the README's own location — evidence: `broken-links` fixture flags both checks {deps: T042}
- [x] T046 [P] Implement the durability check (packet/phase IDs, ADR ids, commit hashes, `.opencode/specs/` paths) {deps: T042}
- [x] T047 Run the full fixture corpus; every negative flags with its expected rule id, the control passes — evidence: `test_code_folder_readme.py` negatives=9 flat_table_pass=1 positive_control=1 failures=0 {deps: T043, T044, T045, T046}
- [x] T048 Re-run the verdict dump and diff against the T040 baseline; the diff is empty — evidence: `test_readme_verdict_parity.py` baseline_files=759 post_files=759 diff_entries=0 {deps: T047}

### Auditor Discovery

- [x] T050 Replace `find_readmes()` with a durable-directory manifest walk across `.opencode`, `.claude`, `.pi`, `.github`, `scripts` and the repo root (`sk-create-readme/scripts/audit_readmes.py`) {deps: T002, T005}
- [x] T051 Implement the path-class exclusion classifier — generated output, fixture payloads, parent-documented single-file zones, equivalent-orientation folders — evidence: `audit_readmes.py` 21-class manifest and classifier runner {deps: T050}
- [x] T052 Update the auditor docstring scope statement at `:13-23` to match the real behavior {deps: T050}
- [x] T053 Assert against the frozen manifest: raw candidate set reproduced, exclusions reduce it to the agreed actionable set — evidence: `test_readme_manifest.py` derived=585 frozen=585 reproduced=True {deps: T051}
- [x] T054 Assert `.pi/extensions/README.md` and `.github/workflows/README.md` now appear in the audited set {deps: T053}
- [x] T055 Run the exclusion fixtures; all 21 disposition classes report as exclusions, none as gaps — evidence: exclusion runner 21/21 {deps: T031, T051}
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T060 Full `sk-doc/scripts/tests/` suite green: 23 runners, 23 passed {deps: T047, T055}
- [x] T061 Contradiction gate: `rg -n "with anchors|TOC entries match" .opencode/skills/sk-doc/shared/references/hvr-rules.md` returns only explicitly scoped-away lines {deps: T014}
- [x] T062 Verdict-parity gate green: 759 files, empty diff — evidence: parity runner `diff_entries=0` {deps: T048}
- [x] T063 ADR surfaces were second-read against the authoring text and fixtures in the verification pass — evidence: `checklist.md` cross-surface review recorded in CHK-103 {deps: T010, T011, T012, T013, T014}
- [x] T064 `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/sk-doc/022-code-readme-coverage/001-code-readme-standard-and-enforcement --strict` → Errors: 0 {deps: T060}
- [x] T065 Mark every checklist item with evidence; set every ADR status to Accepted — evidence: checklist 18/18 P0, 19/19 P1, 4/4 P2 and ADR status review {deps: T064}
- [x] T066 Publish the handoff note for `002` (c), `003` and `036/019`: the ruling, the mode's invocation, and the auditor's manifest path {deps: T065}
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Every negative fixture flags; the flat-table equivalence and control pass
- [x] Verdict dump byte-identical pre/post
- [x] Contradiction and discovery gates green
- [x] `validate.sh --strict` → Errors: 0
- [x] All ADRs status Accepted
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Decisions**: See `decision-record.md`
- **Parent**: `sk-doc/022-code-readme-coverage`
- **Downstream consumers**: `002` class (c), `003` (hard gate), `system-deep-loop/036-deep-loop-innovation/019-runtime-code-readmes` (hard gate)
<!-- /ANCHOR:cross-refs -->

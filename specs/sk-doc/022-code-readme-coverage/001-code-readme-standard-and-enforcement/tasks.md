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
    completion_pct: 0
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

Status: Planned — no task is started.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

*(originally: Confirm And Decide)*

- [ ] **T001 Confirm all findings against HEAD.** Findings are hypotheses. Re-read every cited line at current HEAD and record confirmed / drifted / refuted per ID with file:line:
  - `RA-001-01`, `RA-010-01` — `audit_readmes.py:13-23` docstring scope and `find_readmes():288-309`
  - `RA-001-02`, `RA-005-40` — `validate_document.py:1131-1133`
  - `RA-001-03` — `hvr-rules.md:451-454` vs `sk-create-readme/SKILL.md:434-435`
  - `RA-001-04`, `RA-003-06`, `NEW-A1` — `readme-code-template.md:47-58`, `:180-187`, `:189-193`
  - `RA-005-41`, `RA-009-01` — `SKILL.md:217-231`, `:245`, `:140-150`, `:37`
  - `template-rules.json` `documentTypes.readme` (`requiredSections`, `tocRequired`, `h2EmojiRequired`, `h2UppercaseRequired`)
  **HALT and escalate** if the "General README format rules" block has already been re-scoped since 2026-07-30 — the whole Q2 framing changes.
- [ ] T002 Re-freeze the durable-directory manifest at current HEAD if it has moved; record the new dir count against the 501 baseline {deps: T001}
- [ ] T003 [P] Enumerate every CI and script call site of `validate_document.py`; record them as the blast radius for the opt-in flag {deps: T001}
- [ ] T004 Escalate Q1, Q2 and Q3 to the operator in one message with the research recommendations attached {deps: T001}
- [ ] T005 Record ADR-001 (tree equivalence), ADR-002 (format-rule scope), ADR-003 (equivalent orientation), ADR-004 (opt-in mode) in `decision-record.md` {deps: T004}
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Authoring Surface

- [ ] T010 State the Directory-Tree rule in `SKILL.md` §6 in an implementable form (`sk-create-readme/SKILL.md`) {deps: T005}
- [ ] T011 State which general format rules bind code-folder READMEs in §6, cross-referencing the block at `:217-229` (`sk-create-readme/SKILL.md`) {deps: T005}
- [ ] T012 [P] Align the code template scaffold with the ruling — frontmatter position, tagline, tree block (`assets/readme-code-template.md`) {deps: T005}
- [ ] T013 [P] Reconcile the checklist reference with the ruling (`references/readme/quality-and-checklist.md`) {deps: T005}
- [ ] T014 Remove or explicitly scope away the anchor/TOC requirement for code READMEs (`shared/references/hvr-rules.md`) {deps: T005}

### Fixture Corpus

- [ ] T020 Create the fixture tree under the existing harness (`sk-doc/scripts/tests/`) {deps: T005}
- [ ] T021 Negative fixture: multi-file folder with no Directory Tree {deps: T020}
- [ ] T022 Negative fixture: exhaustive `CONTENTS` table instead of a fenced tree — expected verdict follows ADR-001 {deps: T020}
- [ ] T023 [P] Negative fixture: missing `---` separators between numbered H2 {deps: T020}
- [ ] T024 [P] Negative fixture: unnumbered / Title-Case H2 {deps: T020}
- [ ] T025 [P] Negative fixture: non-sequential H2 (`9A` before `9`) {deps: T020}
- [ ] T026 [P] Negative fixture: untagged fenced block {deps: T020}
- [ ] T027 [P] Negative fixture: broken relative link and a non-existent inline-code path {deps: T020}
- [ ] T028 [P] Negative fixture: packet ID, commit hash and `.opencode/specs/` path in body text {deps: T020}
- [ ] T029 [P] Negative fixture: TOC plus HTML anchor-comment markup {deps: T020}
- [ ] T030 Positive control fixture: fully conformant README that also contains a legitimate example command, so the durability grep is exercised against a false-positive case {deps: T020}
- [ ] T031 Exclusion fixtures for the 21 disposition path classes, including the fixture-owned README case so the validator never scores its own test input {deps: T020}

### Validator Mode

- [ ] T040 Capture the baseline verdict dump over all existing READMEs and store it as the parity baseline {deps: T003}
- [ ] T041 Add the code-folder `documentTypes` entry to `shared/assets/template-rules.json`; leave the existing narrow `readme` entry untouched {deps: T005}
- [ ] T042 Implement the opt-in code-folder branch in `shared/scripts/validate_document.py` {deps: T041, T030}
- [ ] T043 Implement the Directory-Tree check per ADR-001 {deps: T042}
- [ ] T044 [P] Implement the separator, numbering, casing and fence-language checks per ADR-002 {deps: T042}
- [ ] T045 [P] Implement local-link and inline-code path resolution, relative to the README's own location {deps: T042}
- [ ] T046 [P] Implement the durability check (packet/phase IDs, ADR ids, commit hashes, `.opencode/specs/` paths) {deps: T042}
- [ ] T047 Run the full fixture corpus; every negative flags with its expected rule id, the control passes {deps: T043, T044, T045, T046}
- [ ] T048 Re-run the verdict dump and diff against the T040 baseline; any delta is a blocker {deps: T047}

### Auditor Discovery

- [ ] T050 Replace `find_readmes()` with a durable-directory manifest walk across `.opencode`, `.claude`, `.pi`, `.github`, `scripts` and the repo root (`sk-create-readme/scripts/audit_readmes.py`) {deps: T002, T005}
- [ ] T051 Implement the path-class exclusion classifier — generated output, fixture payloads, parent-documented single-file zones, equivalent-orientation folders {deps: T050}
- [ ] T052 Update the auditor docstring scope statement at `:13-23` to match the real behavior {deps: T050}
- [ ] T053 Assert against the frozen manifest: raw candidate set reproduced, exclusions reduce it to the agreed actionable set {deps: T051}
- [ ] T054 Assert `.pi/extensions/README.md` and `.github/workflows/README.md` now appear in the audited set {deps: T053}
- [ ] T055 Run the exclusion fixtures; all 21 disposition classes report as exclusions, none as gaps {deps: T031, T051}
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T060 Full `sk-doc/scripts/tests/` suite green {deps: T047, T055}
- [ ] T061 Contradiction gate: `rg -n "with anchors|TOC entries match" .opencode/skills/sk-doc/shared/references/hvr-rules.md` returns zero, or only lines explicitly scoped away from code-folder READMEs {deps: T014}
- [ ] T062 Verdict-parity gate green (T048 diff empty) {deps: T048}
- [ ] T063 Second reader confirms each ADR against the surfaces it rules on — a ruling is a hypothesis until the text says what the ADR claims it says {deps: T010, T011, T012, T013, T014}
- [ ] T064 `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/sk-doc/022-code-readme-coverage/001-code-readme-standard-and-enforcement --strict` → Errors: 0 {deps: T060}
- [ ] T065 Mark every checklist item with evidence; set every ADR status to Accepted {deps: T064}
- [ ] T066 Publish the handoff note for `002` (c), `003` and `036/019`: the ruling, the mode's invocation, and the auditor's manifest path {deps: T065}
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Every negative fixture flags; the control passes
- [ ] Verdict dump byte-identical pre/post
- [ ] Contradiction and discovery gates green
- [ ] `validate.sh --strict` → Errors: 0
- [ ] All ADRs status Accepted
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

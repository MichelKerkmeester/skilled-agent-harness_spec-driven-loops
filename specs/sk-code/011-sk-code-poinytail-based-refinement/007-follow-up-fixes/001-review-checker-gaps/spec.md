---
title: "Feature Specification: Phase 1: review-checker-gaps"
description: "The review final-line checker accepts four outputs that its own SKILL.md contract forbids. This phase closes all four and adds one tamper case per new failure to the rule-canary harness."
trigger_phrases:
  - "review checker gaps"
  - "phase 1 review checker gaps"
  - "final line checker gaps"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 1: review-checker-gaps

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
| **Branch** | `scaffold/001-review-checker-gaps` |
| **Parent Spec** | ../spec.md |
| **Phase** | 1 of 5 |
| **Predecessor** | None |
| **Successor** | 002-leaf-generator-ignores |
| **Handoff Criteria** | The six criteria in goal.md pass, `validate.sh --strict` prints `RESULT: PASSED`, and the orchestrator commits this phase |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 1** of the Follow-up fixes for the sk-code Ponytail refinement specification.

**Scope Boundary**: The review final-line checker, its tamper harness and the checker's row in the scripts README. No other file in `sk-code-review` changes.

**Dependencies**:
- The parent spec's Problem Statement, which names the live `@review` run in phase 005 that found the four gaps. No code depends on this phase. Phase 002 starts after this phase is committed.

**Deliverables**:
- Four checker fixes: skip status placement, bare-status spacing and `Not checked:` count, unreadable-input cause and banner width
- Five tamper cases in the harness, which take the PASS count from 38 to 48
- A README row that states the exact rules

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
- Decision: the parent folder has no `changelog/` directory, and phase 004 closed without one, so this phase writes no changelog entry. See Open Questions.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The final-line checker in `sk-code-review` is the gate that automation runs on every full review. It accepts four outputs that its own contract forbids. A skip status passes after a body of findings. A bare status passes with no blank line above it, with two blank lines above it, and with more than one `Not checked:` line in the output. An unreadable input prints only the usage line, so the caller cannot tell why the read failed. The banner title line is two columns wider than its box.

### Purpose
After this phase, the checker rejects each of the four outputs with a named reason, the harness has one tamper case per new failure, and the 38 existing harness cases and both canary runs still pass.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A skip status passes only as the whole output.
- A bare status needs exactly one blank line above it, a `Not checked:` line above that blank line, and exactly one `Not checked:` line in the output, with a distinct message for each failure.
- An unreadable input prints its cause before the usage line and exits 2.
- The banner box is as wide as its title line.
- Five tamper cases in `check-rule-copies.test.sh`, one for each new failure.
- The checker's README row states the exact rules.

### Out of Scope
- `SKILL.md` wording. Its "Directly above the status line" paragraph already asks for one blank line and says the skip outputs are the status line alone. It changes only if an example output breaks the new rule, and the planning check found none that does.
- `check-rule-copies.js`. It imports `checkReviewOutput`, and that function keeps its signature (text in, array of failure messages out), so the canary needs no change.
- The `.opencode/` mirror. `.opencode/skills` is a symlink to `.skilled/skills`, so the second canary run reads the same file.
- The changelog entry. See Phase Context and Open Questions.
- The other four children of the parent, and the parent spec itself.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/sk-code/sk-code-review/scripts/check-review-final-line.js` | Modify | Skip placement rule, bare-status spacing and count rules, unreadable-input cause, banner width |
| `.skilled/skills/sk-code/sk-code-review/scripts/check-rule-copies.test.sh` | Modify | Five tamper cases, each one exit-code case and one message case |
| `.skilled/skills/sk-code/sk-code-review/scripts/README.md` | Modify | The checker row states the exact rules |
| `specs/sk-code/011-sk-code-poinytail-based-refinement/007-follow-up-fixes/001-review-checker-gaps/` (spec.md, plan.md, tasks.md, goal.md, implementation-summary.md, graph-metadata.json, description.json) | Modify | Packet documentation. The two derived files are regenerated by `repair-derived.cjs` |
| `specs/sk-code/011-sk-code-poinytail-based-refinement/007-follow-up-fixes/001-review-checker-gaps/scratch/` | Use | Before copies, repro inputs and captured outputs. Not shipped |

Parent note: the parent spec's Files to Change table (`../spec.md`, phase 001 rows) lists the checker and the harness but not `scripts/README.md`. This child lists the README because the brief requires it. See Open Questions.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | A skip status (`Review status: COMMENTED (no changes since last review at ...)` or `Review status: COMMENTED (skipped: ...)`) passes only when it is the whole output, meaning one line after the single trailing newline is removed. Any other output that ends on one fails with `skip status must be the whole output`. | Tamper case `final_line_skip_after_body` exits 1 and prints that message. The two existing skip cases, `final_line_skip_m1` and `final_line_skip_m2`, still exit 0. |
| REQ-002 | A bare status (`APPROVED`, `REQUESTED_CHANGES` or `COMMENTED`) needs exactly one blank line directly above it. The non-blank line above that blank line starts with `Not checked: ` followed by text. The output holds exactly one line that starts with `Not checked:`. The four failure messages are fixed text: `no blank line above the status line`, `more than one blank line above the status line`, `no "Not checked:" line above the status line` (existing wording, kept), and `more than one "Not checked:" line in the output`. | Tamper cases `final_line_no_blank_above_status`, `final_line_two_blank_above_status` and `final_line_two_not_checked` exit 1 and print their message. The existing cases `final_line_clean`, `final_line_missing_not_checked` and `final_line_result_block_before_status` still pass. |
| REQ-003 | An unreadable input prints `cannot read <path or stdin>: <error message>` on stderr, then the usage line `usage: check-review-final-line.js [file]`, and exits 2. | Tamper case `final_line_unreadable_file` exits 2 and prints `cannot read <path>: `. Probe: reading from a directory on stdin prints `cannot read stdin: ` and exits 2. |
| REQ-004 | The banner title line and both border lines have the same length, in code points. | The width check in `tasks.md` T018 prints `True`. |
| REQ-005 | The harness keeps its 38 existing PASS lines and gains 10: five tamper cases, each one `run_case` plus one `expect_output`. | `check-rule-copies.test.sh` prints 48 lines that start with `PASS `, ends with `All rule-canary test cases passed`, and exits 0. |
| REQ-006 | Both canary runs exit 0 with the OK line. The two example outputs, in `SKILL.md` and `README.md`, pass the new spacing rule. | `check-rule-copies.js` prints the OK line with `2 example output(s)` and exits 0, through `.skilled/` and through `.opencode/`. |
| REQ-007 | The checker's row in `scripts/README.md` states the rules in REQ-001 to REQ-003, with no claim that the checker rejects "blank lines" in general. | `grep -c 'must hold exactly one line that starts with' .skilled/skills/sk-code/sk-code-review/scripts/README.md` prints 1. |

### P1 - Required (complete OR user-approved deferral)

None. Every item the brief names is P0.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The diff against the saved copy in `scratch/before-sk-code-review/` names exactly the three files in the Files to Change table, and no other file changed.
- **SC-002**: The harness, both canary runs, the banner width check and the README grep all pass in the final state, with their output and exit status read.
- **SC-003**: `validate.sh <packet> --strict` prints `RESULT: PASSED` after the packet documents are final and `repair-derived.cjs` has run.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Node.js with `node:fs` and `node:url` (ES module) and Bash for the harness | The checker and harness cannot run | The builder records `node --version` in the log before the first run |
| Dependency | Parent spec Files table omits `scripts/README.md` | The scope check in SC-001 names a file the parent does not list | Child lists the file. Parent amendment proposed in Open Questions, not made here |
| Risk | A finding body quotes a line that starts with `Not checked:` | Medium: a valid review fails the one-line count | The count matches lines that start with the phrase, so quoted text must not start a line with it. The failure message names the cause |
| Risk | A skip status preceded by a blank line fails the whole-output rule | Low: no current skip output starts with a blank line | The rule is stated in the README row and the harness |
| Risk | A line of spaces counts as a blank line | Low: the checker treats a blank line as empty after trimming, as it does today | Kept as-is so the existing trailing-blank behavior does not change |
| Risk | Node's read error text differs by version | Low: the harness matches `cannot read` and the path, not the Node error tail | Harness assertions avoid the error tail |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should the parent spec's phase 001 Files table gain a `scripts/README.md` row? The brief asks for the README change, and the parent table omits it. Proposed default: yes, one row added to the parent first. This plan does not edit the parent.
- Should this phase write a changelog entry? The parent has no `changelog/` folder, and phase 004 closed without one. Proposed default: no entry in this phase.
- The nested-child workflow in `sk-create-goal` asks that criteria repeat verbatim in the objective text. The brief asks for a one-sentence objective, which matches the phase 004 goal. This packet follows the brief. The orchestrator should confirm the parent's set string copies the criteria.
<!-- /ANCHOR:questions -->

---

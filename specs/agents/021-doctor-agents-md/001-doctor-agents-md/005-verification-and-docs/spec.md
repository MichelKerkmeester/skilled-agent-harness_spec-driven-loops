---
title: "Feature Specification: verification and docs"
description: "The last child closes the phase: an end-to-end pass over every fixture, the two manual rows that settle what the design could only infer, the script README, the playbook rows and the changelog entry."
trigger_phrases:
  - "agents md verification and docs"
  - "end to end fixture pass"
  - "doctor manual playbook rows"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "agents/021-doctor-agents-md/001-doctor-agents-md/005-verification-and-docs"
    last_updated_at: "2026-10-30T12:40:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored the child spec from the approved design"
    next_safe_action: "Resolve the doc locations at this child's start, then run the end-to-end pass"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "worktree-292-doctor-agents-md"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: verification and docs

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-10-30 |
| **Branch** | `worktrees/292-doctor-agents-md` |
| **Parent Spec** | ../spec.md |
| **Phase** | 5 of 5 |
| **Predecessor** | 004-command-plumbing |
| **Successor** | None |
| **Handoff Criteria** | The phase reruns every baseline command from the final tree with the same pass lines, and the two manual rows have recorded answers |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 5** of the `/doctor:agents-md` build inside `agents/021-doctor-agents-md`.

**Scope Boundary**: The end-to-end pass, the two manual rows and the documentation rows. It changes no engine and no route.

**Dependencies**:
- `/doctor:sk-skill` (packet `sk-doc/075-doctor-sk-skill-command`) must be on `main` before implementation starts, and every phrase, route, bridge and mirror count is re-measured then.
- Children 001 to 004 must be complete, because this child proves their work from the final tree.

**Deliverables**:
- The end-to-end output for all nine fixtures under `scratch/`.
- The script README engine rows, the manual playbook rows and the changelog entry, each at the location the sk-doc router resolves at this child's start.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The engines can each pass their own suite and still fail together: a check that classifies correctly and an embed that composes correctly can still disagree about the same tree. Two claims in the design are also only inferred: that Devin applies `.cursor/rules/*.md`, which is the reason the block is mirrored there, and that Cursor loads that file at all. Neither is settled by a unit test, and the documentation rows that would carry the answers do not exist yet.

### Purpose
Prove the pair together on every fixture, record the two manual answers, and leave the family's docs naming the new engines, the new command and the two manual rows.

### Precondition
Implementation starts only after `/doctor:sk-skill` (packet `sk-doc/075-doctor-sk-skill-command`) lands on `main`. That command adds a router, a route and an advisor bridge, so the route, bridge, phrase and mirror counts this packet quotes are re-measured from the branch the child starts on, and recorded in `scratch/baseline.txt` before the first edit.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
Measured on this worktree at `006d96370d`, before any implementation. These are the numbers this child's criteria are read against.
```text
$ node .skilled/skills/sk-code/sk-code-review/scripts/check-rule-copies.js
OK: all rule invariants present (8 exact-string file(s) + 2 Iron Law file(s) + 21 delivery-prefix anchor(s) + 6 extension floor(s) + 2 example output(s)).

$ node .skilled/skills/sk-doc/sk-create-repo-rule/scripts/check-repo-rules.cjs
[repo-rules-check] RESULT: PASSED (11/11 checks)

$ bash .skilled/commands/doctor/scripts/tests/run-all.sh
[run-all] 7 suite(s) passed, 0 failed
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- An end-to-end run of the check and then `embed --dry-run` on copies of all nine fixtures, with output captured to `scratch/`.
- One manual row asking a live Devin session to quote the last line of the block, and one confirming Cursor loads the mirrored block.
- The doctor script README rows, the manual playbook rows and the changelog entry.

### Out of Scope
- Any engine, route or manifest change. A defect found here goes back to the child that owns it.
- Root README command counts, which each phase rebases its own line of.
- Any documentation location this spec guesses: the child reads the sk-doc router and records what it found.

### Unresolved locations

The design leaves three locations unresolved until this child runs, and this spec records them as open rather than guessing: the manual testing playbook rows for the doctor family, the changelog entry for the doctor command, and the script README's engine table. Each is resolved by reading the sk-doc router and the neighbouring doctor entries at this child's start.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/commands/doctor/scripts/README.markdown` | Modify | Engine rows for the three new scripts |
| The doctor family's manual playbook rows | Create | The location the sk-doc router resolves at this child's start |
| The doctor command's changelog entry | Create | The location the sk-doc router resolves at this child's start |
| `scratch/e2e/` | Create | One captured transcript per fixture |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Every baseline command from the parent phase spec reruns from the final tree and prints the same pass lines it printed before the work started. |
| REQ-002 | The check and embed pair runs end to end on copies of all nine fixtures, and every transcript is captured under `scratch/e2e/`. |
| REQ-003 | The reconfigured repository state agrees across the two engines: a repository the check calls `pure` yields `NOTHING TO DO` from embed. |
| REQ-004 | The phase gate passes from the final tree: `validate.sh specs/agents/021-doctor-agents-md --recursive --strict` prints `RESULT: PASSED`. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-005 | One manual row records whether a live Devin session can quote the last line of the block, which settles the inferred claim behind the cursor mirror. |
| REQ-006 | One manual row records whether Cursor loads `.cursor/rules/repo-local.md`. |
| REQ-007 | The script README names the three new scripts and the three new suites. |
| REQ-008 | The changelog entry names the command, its three targets and the inactive bridge. |
| REQ-009 | `git status --porcelain` lists only files named by children 001 to 005, and no local-only path. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Every baseline command prints its pre-work pass line from the final tree.
- **SC-002**: `node .skilled/skills/sk-doc/sk-create-repo-rule/scripts/check-repo-rules.cjs` prints `RESULT: PASSED (11/11 checks)`.
- **SC-003**: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/agents/021-doctor-agents-md --recursive --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | A live Devin session and a Cursor window | The two manual rows stay unanswered | Record the row as `UNKNOWN with reason` rather than passing it by default |
| Risk | A defect found here belongs to an earlier child | Medium: scope creep into a closed child | Fix it in the owning child and record the re-run here |
| Risk | The documentation locations move | Low: the rows land in the wrong file | Resolve them at this child's start and record the resolved path |
<!-- /ANCHOR:risks -->

---

## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **N/A**: The child runs verification and documentation work only, and measures no runtime of its own beyond the unchanged fixtures.

### Security
- **NFR-S01**: No fixture transcript carries a path from a real consumer checkout.

### Reliability
- **NFR-R01**: A missing fixture transcript fails the child, because an end-to-end claim without a captured run is a recollection.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: the `absent` fixture yields the template plus the empty block, and its transcript shows both.
- Maximum input: the `over-budget` fixture reports a finding and writes nothing until the operator says yes.
- Failure path: a fixture whose check result and embed result disagree fails the child and names both outputs.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 8/25 | Three documentation rows and nine transcripts |
| Risk | 8/25 | The phase closes on this child, so a missed criterion closes it wrongly |
| Research | 10/20 | Three documentation locations are unresolved until this child reads them |
| **Total** | **26/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Where do the manual playbook rows live? The sk-doc router owns the answer and this spec does not guess it.
- Does a live Devin session see the mirrored block at all? If it does not, the mirror is pure Cursor cost and the parent decision that added it is reverted.
<!-- /ANCHOR:questions -->

---

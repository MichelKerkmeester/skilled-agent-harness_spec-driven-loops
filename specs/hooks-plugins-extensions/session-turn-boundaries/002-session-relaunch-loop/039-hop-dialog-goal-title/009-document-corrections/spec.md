---
title: "Feature Specification: Phase 9: document-corrections"
description: "Five session relaunch documents said something the code or the recorded evidence no longer supported. The fixes bind phases 038 and 039 in the parent goal, mark phase 033 Complete, correct the sk-git rebase sentence and two 038 child 011 limitation rows, and name the real playbook cases."
trigger_phrases:
  - "document corrections"
  - "phase 9 document corrections"
  - "parent goal binding rows 038 and 039"
  - "phase 033 complete"
  - "playbook case names"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title/009-document-corrections"
    last_updated_at: "2026-11-14T10:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Corrected the five documents and recorded the commit, the validation and the open 033 criterion"
    next_safe_action: "None. The commit is be1aebb9f3 and nothing else is pending"
    blockers: []
    key_files:
      - "specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/goal.md"
      - "specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/033-research-remediation/spec.md"
      - ".skilled/skills/sk-git/SKILL.md"
      - ".skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/session-relaunch-claude.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-009-document-corrections"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Does phase 033 close in full? No. Its live Pi criterion stays open because no relaunch.log hop line was saved."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 9: document-corrections

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-14 |
| **Branch** | `worktrees/373-relaunch-gap-fixes` |
| **Parent Spec** | ../spec.md |
| **Phase** | 9 of 14 |
| **Predecessor** | 008-history-test-database-env |
| **Successor** | 010-goal-ending-carry |
| **Handoff Criteria** | Every row in `acceptance-criteria.md` is Met and `validate.sh 009-document-corrections --strict` prints `RESULT: PASSED` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 9** of the A Claude Code hop refuses a question dialog after prepare, starts the receiver on the packet goal and keeps the generated session title specification.

**Scope Boundary**: Five document fixes and their derived metadata. The 002 parent goal gains binding rows for phases 038 and 039. Phase 033 is marked Complete in its spec and goal. The sk-git skill states that a rebase keeps an id only when the replayed message carries one. The summary of 038 child 011 states the two live facts. The two session relaunch playbooks name the test cases that exist. No code, no test and no runtime adapter changes.

**Dependencies**:
- The 2026-11-13 research names every defect in sections 6 and 9, at ranks 11, 12, 13, 17 and 23.
- The code of phases 005, 010 and 011 and the live checks of 038 child 011 supply the facts the corrected rows state.
- All nine children of phase 033 are Complete, and their folders pass a recursive strict validation.
- Every test case the playbooks name exists in the test file it points at.

**Deliverables**:
- Two binding rows in the 002 parent goal, paid for by shorter D1 and D7 wording, with `packet_durable_chars=3993` and `packet_budget=ok`.
- Phase 033 status and its nine phase rows set to Complete, with criteria 1, 2, 3 and 5 ticked and criterion 4 left open.
- One corrected sk-git sentence, two rewritten limitation rows in the 038 child 011 summary, and corrected case names and `cp` usage in two playbooks.
- Three scratch evidence files and one commit of fifteen files.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The 2026-11-13 research found five places where a document said something the code or the recorded evidence no longer supported. The 002 parent goal bound neither phase 038 nor phase 039, although both hold a `goal.md`. Phase 033 said Draft in its status and all nine phase rows while its children said Complete. The sk-git skill said a rebase keeps an id, which the hook does only when the replayed message still carries one. The summary of 038 child 011 still called the two live facts unrecorded and a live `default` mode unmapped after both were recorded. Two playbooks named cases that no longer matched their test files, and the HS-8 block used a symbolic link where a copy works.

### Purpose
The five documents agree with the code and the recorded evidence, so a reader can trust the parent binding, the phase status, the commit-id rule, the live permission-mode facts and the playbook steps.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior

Run from the worktree root on 2026-11-14 at commit `be1aebb9f3`.

```text
$ git show --stat be1aebb9f3
 .skilled/skills/sk-git/SKILL.md                    |  2 +-
 .../plugins-and-hooks/session-relaunch-claude.md   |  6 ++--
 .../session-relaunch-pi-opencode.md                |  6 ++--
 .../033-research-remediation/goal.md               | 14 +++++----
 .../033-research-remediation/graph-metadata.json   | 15 +++++++---
 .../033-research-remediation/spec.md               | 28 +++++++++---------
 .../011-permission-mode-carry/acceptance-criteria.md |  2 +-
 .../011-permission-mode-carry/goal.md              |  2 +-
 .../011-permission-mode-carry/graph-metadata.json  |  6 ++--
 .../implementation-summary.md                      | 10 +++----
 .../scratch/criterion-5-033.txt                    | 20 +++++++++++++
 .../scratch/goal-002-parent.txt                    | 34 ++++++++++++++++++++++
 .../scratch/validate-033.txt                       | 22 ++++++++++++++++++++++
 .../002-session-relaunch-loop/goal.md              | 12 ++++----
 .../002-session-relaunch-loop/graph-metadata.json  |  4 +--
 15 files changed, 136 insertions(+), 47 deletions(-)
exit=0

$ rg -n 'packet_durable_chars|packet_budget' specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title/009-document-corrections/scratch/goal-002-parent.txt
2:packet_durable_chars=3993
3:packet_budget=ok
exit=0

$ rg -n 'A rebase keeps an id only' .skilled/skills/sk-git/SKILL.md
322:and never typed by hand. An amend keeps its id, unless the message is replaced with `-m`, which mints a fresh one. A cherry-pick re-mints a fresh one. A rebase keeps an id only when the replayed message still carries one, and a replayed commit whose message lost its id gets a fresh one. The commit a rebase replaced is recognised as a copy by its author email and author date.
exit=0
```

The parent goal has 3,993 durable characters and fits its 4,000 character budget. The sk-git sentence at line 322 carries the corrected rule. The commit changes fifteen files, and none of them is product code or a test.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add binding rows `038` and `039` to the 002 parent goal, paid for by shorter D1 and D7 wording, with no decision or criterion changed in meaning.
- Set the phase 033 status and its nine phase rows to Complete, and tick criteria 1, 2, 3 and 5 from the saved evidence.
- Correct the sk-git rebase sentence at line 322 and leave its fixture copy alone.
- Rewrite limitation rows 1 and 3 of the 038 child 011 summary and its stale continuity fields.
- Correct the two playbooks: use `cp` in the HS-8 block, name `deferredAt`, `agent_settled`, the Pi mode case, the two OpenCode sub-agent cases and the title case.
- Record the evidence in `scratch/` and commit the documents as `be1aebb9f3`.

### Out of Scope
- Any product code or test change. This child changes documents only, so it has no failing-first test under parent D1.
- The 033 live Pi criterion. No `relaunch.log` hop line was saved for that run, so criterion 4 stays open.
- CHK-004 in the 038 child 011 tasks. The live facts were recorded after the source edit, so the box stays unticked.
- The sk-git fixture copy under `.skilled/commands/doctor/scripts/tests/fixtures/sk-skill-convert/`. A test may compare its bytes.
- The decisions D1 to D4 of the 002 parent goal and the 039 goal, and the 039 objective and completion criteria. None changes.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/goal.md` | Modify | Binding rows 038 and 039, shorter D1 and D7, and the binding exception now covers phase 037 |
| `specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/graph-metadata.json` | Generated | Derived metadata for the parent goal |
| `specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/033-research-remediation/spec.md` | Modify | Status and nine phase rows set to Complete |
| `specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/033-research-remediation/goal.md` | Modify | Criteria 1, 2, 3 and 5 ticked with their evidence |
| `specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/033-research-remediation/graph-metadata.json` | Generated | Derived metadata for phase 033 |
| `specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/011-permission-mode-carry/implementation-summary.md` | Modify | Limitation rows 1 and 3 rewritten from the live checks and the wrapper test |
| `specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/011-permission-mode-carry/acceptance-criteria.md` | Modify | Stale continuity pointer corrected |
| `specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/011-permission-mode-carry/goal.md` | Modify | Stale continuity pointer corrected |
| `specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/011-permission-mode-carry/graph-metadata.json` | Generated | Derived metadata for the 011 summary |
| `.skilled/skills/sk-git/SKILL.md` | Modify | The rebase sentence at line 322 |
| `.skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/session-relaunch-claude.md` | Modify | `cp` in HS-8, the `deferredAt` stamp, and version 1.0.23.0 |
| `.skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/session-relaunch-pi-opencode.md` | Modify | The settled event and case names, and version 1.0.22.0 |
| `specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title/009-document-corrections/scratch/goal-002-parent.txt` | Create | The parent goal budget and check-goal output |
| `specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title/009-document-corrections/scratch/validate-033.txt` | Create | Ten `RESULT: PASSED` lines from the recursive validation |
| `specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title/009-document-corrections/scratch/criterion-5-033.txt` | Create | The suite and Pi counts for 033 criterion 5 |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | The 002 parent goal binds phases 038 and 039, and `goal.cjs packet` prints `packet_durable_chars=3993` and `packet_budget=ok`. The binding exception covers phase 037, and `check-goal.cjs` reports 22 missing rows, all under that recorded exception. |
| REQ-002 | Phase 033 says Complete in its status and in all nine phase rows. Its goal ticks criteria 1, 2, 3 and 5 from the saved evidence, and criterion 4 stays open because no `relaunch.log` hop line was saved. |
| REQ-003 | `.skilled/skills/sk-git/SKILL.md:322` says a rebase keeps an id only when the replayed message still carries one and a replayed message without an id gets a fresh one. The fixture copy is unchanged. |
| REQ-004 | Rows 1 and 3 of the 038 child 011 summary state that the two live facts were recorded after the build and that a live `default` mode is carried. The three stale continuity fields are updated, and CHK-004 stays unticked. |
| REQ-005 | The Claude playbook uses `cp` in the HS-8 block and names the `deferredAt` stamp. The Pi and OpenCode playbook names `agent_settled`, the Pi mode case, the two OpenCode sub-agent cases and the title case. Every named case exists once in its test file. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-006 | The commit `be1aebb9f3` changes fifteen files, and no file is product code or a test. The commit gate raised the playbook versions to 1.0.23.0 and 1.0.22.0. |
| REQ-007 | Strict validation of every folder the fixes touched passes before the commit. This child has no failing-first test, because parent D1 lets the document fixes share one child and no code or test changes. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `scratch/goal-002-parent.txt` shows `packet_durable_chars=3993`, `packet_budget=ok` and 22 missing binding rows, all under the exception for 012 to 032 and 037.
- **SC-002**: `scratch/validate-033.txt` shows `RESULT: PASSED` ten times, exit 0, and phase 033 names Complete in its status and nine rows.
- **SC-003**: `git show --stat be1aebb9f3` lists fifteen files and `git show be1aebb9f3 | rg -c '^new file'` prints 3, the three scratch files.
- **SC-004**: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title/009-document-corrections --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The 2026-11-13 research names each defect and its corrected state | A fix could restate an inferred fact as observed | Every row cites the saved run, the commit or a command output |
| Dependency | The nine phase 033 children stay Complete | The parent status would claim more than its children | `scratch/validate-033.txt` records ten PASSED lines from the recursive run |
| Risk | The 002 parent goal exceeds its 4,000 character budget | The goal slice would fail to bind | Two compact rows and shorter D1 and D7 keep it at 3,993 with `packet_budget=ok` |
| Risk | `check-goal.cjs` reports 22 missing rows and looks like a regression | A reader could treat the parent goal as broken | The exception for 012 to 032 and 037 is recorded in the goal log and named beside the count |
| Risk | Phase 033 criterion 4 stays open | The phase spec says Complete while its goal is not fully done | The open criterion and the missing `relaunch.log` line are named in the spec, the goal and this packet |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: N/A: no runtime path changes.
- **NFR-P02**: N/A: no throughput path changes.

### Security
- **NFR-S01**: N/A: no credential path changes.
- **NFR-S02**: N/A: documents and derived metadata only.

### Reliability
- **NFR-R01**: N/A: no service and no uptime target.
- **NFR-R02**: Every corrected statement cites a saved command output, a commit or a test file line.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: a reader who opens only phase 033 sees Complete in the status and all nine rows, and the open criterion 4 in its goal.
- Maximum input: the 002 parent goal keeps seven characters of headroom, so one more durable sentence would exceed the budget.
- Failure path: a rebase whose replayed message lost its id gets a fresh id, which the corrected sk-git sentence states.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 5/25 | Twelve document and derived files plus three scratch evidence files |
| Risk | 3/25 | A wrong parent goal edit could exceed the budget or change a decision |
| Research | 3/20 | Five findings read from the 2026-11-13 research and the code |
| **Total** | **11/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Does phase 033 criterion 4 ever close? Not in this child. A live Pi hop that saves its `relaunch.log` line would close it, and none was saved.
- Does the 002 parent goal need rows for phases 012 to 037? No. Those phases hold no `goal.md`, and the recorded exception covers them.
- Should the sk-git fixture copy change too? No. A test may compare its bytes, so only the skill sentence changed.
<!-- /ANCHOR:questions -->

---

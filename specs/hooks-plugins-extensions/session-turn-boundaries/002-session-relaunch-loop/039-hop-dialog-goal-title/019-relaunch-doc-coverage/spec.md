---
title: "Feature Specification: Phase 19: relaunch-doc-coverage"
description: "The Claude playbook, the feature catalog and the handoff command document do not describe the relaunch behavior this packet shipped, two lines say something the code does not do, and twelve citations in two closed children point at lines that moved."
trigger_phrases:
  - "relaunch doc coverage"
  - "phase 19 relaunch doc coverage"
  - "session relaunch feature catalog goal_ended wrapper notice"
  - "relaunch playbook wrapper change notice scenario"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 19: relaunch-doc-coverage

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-11-14 |
| **Branch** | Not chosen yet. The operator picks a worktree or the current branch before the build |
| **Parent Spec** | ../spec.md |
| **Phase** | 19 of 19 |
| **Predecessor** | 018-sk-git-rebase-sentence |
| **Successor** | None |
| **Handoff Criteria** | Every row in `acceptance-criteria.md` is Met and `validate.sh 019-relaunch-doc-coverage --strict` prints `RESULT: PASSED` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 19** of the hop dialog, goal and title specification, the last child of the third review round of 2026-11-14.

**Scope Boundary**: Documents only. The Claude session-relaunch playbook, the feature catalog entry for the relaunch loop, one sentence of the handoff command document and the citations of children 004 and 013. No code, test or skill metadata changes.

**Dependencies**:
- Phases 15, 16 and 17 must be Complete first, because this phase documents the start-checksum guard, the claimed-last mark and the missing-transcript notice they ship.
- Phases 4, 5, 6, 10, 11 and 12 shipped the other behavior the catalog and the playbook do not yet name: the change notice and its log line, the `deferredAt` stamp, a record with no `handoff` read as absent, the `goal_ended` mark and the bounded goal fallback.
- The playbook and the catalog are checked by sk-doc's package validators, which CI runs.

**Deliverables**:
- Two corrected lines: the playbook prose on `cp` and the handoff sentence on the goal switch.
- Playbook evidence for the change notice, the `goal_ended` carry and the missing-transcript notice.
- Catalog text for every behavior listed above.
- Eight citations pinned to the commit they were observed at.
- A recorded decision on a trigger phrase for an ended goal.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The HS-8 block of the Claude playbook copies a helper with `cp` (`session-relaunch-claude.md:929`), and the prose below it says the check "links" it (`:934`). A reader who trusts the prose looks for a symlink, which is the failure the copy fixed (alignment B-02).

In the handoff command document, "`SESSION_RELAUNCH_GOAL=0` turns the field off" (`.skilled/commands/speckit/handoff.md:131`) now follows the `goal_ended` sentence and reads as that one field. The switch turns off both, because `recordGoalPacket` returns before it writes or removes either (`.skilled/hooks/session-relaunch/bin/session-relaunch.cjs:394`) (alignment D-01).

The Claude playbook names none of the change notice, its `wrapper-changed` log line or the `goal_ended` carry. Its Wrapper edge cases evidence (`:374`) predates the notice and the Goal Carry-Over checks (`:751`) have no ended-goal case. The Pi and OpenCode playbook has no hit either (alignment B-03 and X-2, review FH).

The feature catalog entry for the relaunch loop (`context-preservation/session-relaunch-loop.md`) names none of `goal_ended`, the bounded fallback, the change notice, the record with no `handoff` or the `deferredAt` stamp. Its Goal Carry-Over section at line 91 names only `goal_packet` (alignment X-1, deep review R10-P2-001).

Acceptance row AC-004 and `plan.md` of child 004 cite `skilled-loop` line 1469, which child 012 moved to lines 1471 and 1472. Ten places in six documents of child 013 cite line 183 of `stop-arm.mjs`, which child 014 moved to 184 (review FH and the orchestrator). Each was true at the commit it was written at.

The alignment run found that an ended-goal prompt routes to no skill (X-3) and asked for a trigger phrase in `.skilled/skills/system-spec-kit/graph-metadata.json`. No rule requires a phrase per feature, and neither independent review could judge it.

### Purpose
The playbook, the catalog and the handoff command document say what the relaunch code does after phases 15 to 17, the citations of children 004 and 013 point at the lines they were written about, and the trigger phrase question has a recorded decision.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior

Run from the repository root on 2026-11-14 at commit `99d197475d`. The first two commands print the two wrong lines. The third shows no playbook and no catalog entry names the notice or the mark. The next two count the moved citations. The last asks the advisor about an ended-goal prompt and keeps only its empty result.

```text
$ rg -n -o 'The check links that helper' .skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/session-relaunch-claude.md
934:The check links that helper
exit=0

$ rg -n -o 'SESSION_RELAUNCH_GOAL=0. turns the field off' .skilled/commands/speckit/handoff.md
131:SESSION_RELAUNCH_GOAL=0` turns the field off
exit=0

$ rg -c 'wrapper-changed|changed on disk|goal_ended' .skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/session-relaunch-claude.md .skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/session-relaunch-pi-opencode.md .skilled/skills/system-spec-kit/feature-catalog/context-preservation/session-relaunch-loop.md
exit=1

$ rg -c 'skilled-loop:1469' specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title/004-wrapper-change-notice/acceptance-criteria.md
1
exit=0

$ rg -c 'stop-arm\.mjs:183' specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title/013-conformance-stamp-pin --glob '*.md'
specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title/013-conformance-stamp-pin/spec.md:2
specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title/013-conformance-stamp-pin/goal.md:1
specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title/013-conformance-stamp-pin/implementation-summary.md:1
specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title/013-conformance-stamp-pin/plan.md:1
specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title/013-conformance-stamp-pin/acceptance-criteria.md:2
exit=0

$ node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"After my goal ended, hand the session over without restarting that goal"}' --format json | rg -o '"recommendations": \[\]'
"recommendations": []
"recommendations": []
exit=0
```

Both wrong lines are present. No playbook and no catalog entry names the notice, its log line or the mark. Child 004 holds two moved citations and child 013 holds ten in six files, twelve in all against the six the ledger listed. The advisor returns no recommendation for the ended-goal prompt. On the same day it returned none for "hand over my session" either, and `command-speckit-handoff` at 0.8962 for "write a handoff note and relaunch the session".
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Change "links" to "copies" in the HS-8 prose of the Claude playbook.
- Make the handoff sentence say `SESSION_RELAUNCH_GOAL=0` turns off both `goal_packet` and `goal_ended`.
- In the Claude playbook, name the change notice, the `wrapper-changed` log line, the unreadable-at-hop case and the empty-at-start case in the Wrapper edge cases evidence, name the ended-goal cases in the GR-3 evidence, and name the missing-transcript notice in the adapter session gate evidence.
- In the feature catalog entry, describe the change notice and its log line, the `deferredAt` stamp and the withdrawal on the next prompt, the missing-transcript notice, a record with no `handoff` read as absent, the `goal_ended` mark with the claimed-last rule, and the fallback bound to the note's folder and its parent.
- Pin the moved citations of children 004 and 013 to the commit each was observed at: `skilled-loop:1469` at `89e246760e` and `stop-arm.mjs:183` at `c69f278cfc`.
- Record the decision on a trigger phrase for an ended goal: no phrase is added.

### Out of Scope
- A trigger phrase in `.skilled/skills/system-spec-kit/graph-metadata.json`: the `goal_ended` mark is written by `prepare` and `keep` with no operator action, so there is no request to route. The broader gap, that "hand over my session" also routes nowhere, belongs to the advisor's owner and needs the skill-hub routing gates, which a documents child does not run.
- The Pi and OpenCode playbook: `goal_ended` and the Stop notice are Claude only, and the wrapper notice is runtime-independent and covered by the shared wrapper suite that the Claude playbook names. The Pi playbook's "Wrapper runtime arms" case runs the same suite.
- Re-pointing every other line citation in children 001 to 014: those were true when written and name the date they were observed. Only the twelve moved ones are pinned. The parent goal log records that later code changes move line numbers.
- The `.skilled/hooks/README.md` count of test files: it predates this packet.
- Rebuilding the trigger index: this repository commits a rebuilt index on its own after a packet's documents land.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/session-relaunch-claude.md` | Modify | "copies" at line 934, and the evidence of the Wrapper edge cases, GR-3 and adapter session gate cases |
| `.skilled/skills/system-spec-kit/feature-catalog/context-preservation/session-relaunch-loop.md` | Modify | The Nudge Prepare And Arm, Killer And Wrapper and Goal Carry-Over sections |
| `.skilled/commands/speckit/handoff.md` | Modify | Line 131 names both goal fields |
| `specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title/004-wrapper-change-notice/acceptance-criteria.md` | Modify | AC-004 names commit `89e246760e` for line 1469 |
| `specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title/013-conformance-stamp-pin/spec.md`, `plan.md`, `goal.md`, `acceptance-criteria.md` and `implementation-summary.md` | Modify | Seven citations name commit `c69f278cfc` for line 183 |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | The two wrong lines are corrected. `rg -c 'The check links that helper' <playbook>` and `rg -c 'turns the field off' .skilled/commands/speckit/handoff.md` both print nothing with exit 1. |
| REQ-002 | The Claude playbook names the change notice, the `wrapper-changed` log line, the `goal_ended` carry and the missing-transcript notice in the evidence of the cases that run their tests. |
| REQ-003 | The feature catalog entry names `wrapper-changed`, `deferredAt`, `goal_ended`, the record with no `handoff`, the fallback bound and the missing-transcript notice. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | The twelve moved citations name the commit they were observed at, and no other text of children 004 and 013 changes. |
| REQ-005 | sk-doc's playbook and catalog validators pass: `validate-playbook-package.cjs --package .skilled/skills/system-spec-kit/manual-testing-playbook`, `validate-playbook-package.cjs --strict`, `validate_catalog_package.py` and its fixture tests. |
| REQ-006 | The runtime mirror check passes after the handoff edit, and `validate.sh --strict` passes for children 004 and 013. |
| REQ-007 | The trigger phrase decision is recorded in `goal.md` with the advisor output, and `.skilled/skills/system-spec-kit/graph-metadata.json` does not change. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The two old phrases return no match and the playbook and catalog counts for `wrapper-changed`, `goal_ended` and `no transcript path` are each 1 or more.
- **SC-002**: `rg -c 'skilled-loop:1469\b' <004 criteria>` and `rg -c 'stop-arm\.mjs:183\b' <013 docs>` match only lines that also name their commit.
- **SC-003**: The four sk-doc checks and the mirror check exit 0.
- **SC-004**: `validate.sh 019-relaunch-doc-coverage --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phases 15 to 17 landed | The documents would describe behavior that does not exist | Task T001 checks each phase's spec says Complete and its fix commit is in the tree |
| Risk | A playbook edit breaks the operator contract the CI validator checks | Med | The strict validator runs in verification, and the edits change evidence lines only |
| Risk | A citation edit in a closed child changes its meaning | Low | Each edit adds the commit beside the line and keeps the line number, so the claim stays what was observed |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: N/A: documents only, no code path changes.
- **NFR-P02**: N/A: no throughput path changes.

### Security
- **NFR-S01**: N/A: no credential path changes.
- **NFR-S02**: N/A: no executable text changes.

### Reliability
- **NFR-R01**: N/A: no service and no uptime target.
- **NFR-R02**: Each new catalog and playbook sentence names a source line or a test that a reader can open.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: a catalog section with nothing new to say is left as it is.
- Maximum input: the catalog gains at most one paragraph per section, so its entry stays readable.
- Failure path: a validator that fails on a pre-existing problem is reported with its output and compared with the same command at the start commit, and only a new failure blocks the phase.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 8/25 | Three skill and command documents and six packet documents, no code |
| Risk | 3/25 | CI validates the playbook and the catalog |
| Research | 4/20 | Six findings from four sources, each checked against the code |
| **Total** | **15/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Should the advisor route troubleshooting prompts about a hand-over? Not decided here. Decision: no phrase is added in this packet, and the gap is named for the advisor's owner.
- Should the Pi and OpenCode playbook repeat the wrapper notice? Decision: no, because the shared wrapper suite it already runs covers it.
<!-- /ANCHOR:questions -->

---

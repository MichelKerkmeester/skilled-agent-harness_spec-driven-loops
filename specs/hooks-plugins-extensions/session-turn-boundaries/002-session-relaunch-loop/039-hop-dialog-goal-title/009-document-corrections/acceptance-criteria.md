---
title: "Acceptance Criteria: Phase 9: document-corrections"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "document corrections acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title/009-document-corrections"
    last_updated_at: "2026-11-14T10:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Marked every criterion Met from the saved runs, the commit and the corrected documents"
    next_safe_action: "None. The commit is be1aebb9f3"
    blockers: []
    key_files:
      - "specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/goal.md"
      - "specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/033-research-remediation/spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-009-document-corrections"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 9: document-corrections

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** 009-document-corrections
**Level:** 2
**Status:** Complete
**Date:** 2026-11-14
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the 002 parent goal, When its budget is measured, Then it binds phases 038 and 039 and fits its 4,000 character budget | `scratch/goal-002-parent.txt:2` prints `packet_durable_chars=3993` and `:3` prints `packet_budget=ok`. The table holds the `038` and `039` rows. `check-goal.cjs` reports 22 missing rows, all under the recorded exception for 012 to 032 and 037. Cited: `scratch/goal-002-parent.txt:2`, `scratch/goal-002-parent.txt:3` | Met | - |
| AC-002 | REQ-001 | Given the parent goal log, When the binding exception is read, Then phase 037 is covered by the same exception as 012 to 032 | `rg -n 'Phase 037 holds no .goal.md.' specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/goal.md` prints line 152 on 2026-11-14. Cited: `specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/goal.md:152` | Met | - |
| AC-003 | REQ-002 | Given phase 033, When its status, phase rows and goal are read, Then the status and nine rows say Complete, and criteria 1, 2, 3 and 5 are ticked while criterion 4 stays open | The status row reads Complete and the nine rows read Complete. The 033 goal shows four `[x]` boxes and one open box. `scratch/validate-033.txt` holds ten `RESULT: PASSED` lines with exit 0, and `scratch/criterion-5-033.txt` holds 1026 of 1026 and 62 of 62. Cited: `specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/033-research-remediation/spec.md:49`, `specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/033-research-remediation/goal.md:84`, `scratch/validate-033.txt:4` | Met | - |
| AC-004 | REQ-003 | Given the sk-git skill, When line 322 is read, Then a rebase keeps an id only when the replayed message carries one, and the fixture copy is unchanged | `rg -n 'A rebase keeps an id only' .skilled/skills/sk-git/SKILL.md` prints line 322. `git show --stat be1aebb9f3` lists no file under `.skilled/commands/doctor/scripts/tests/fixtures/sk-skill-convert/`. Cited: `.skilled/skills/sk-git/SKILL.md:322`. 2026-11-14: the sentence this checked was wrong, and phase 18 replaces it with the hook's real condition | Met | - |
| AC-005 | REQ-004 | Given the 038 child 011 summary, When its limitation rows are read, Then they state that the live facts came after the build and that a live `default` mode is carried | Rows 1 and 3 name `scratch/live-checks.md` and the wrapper test `a live default permission mode replaces the launch mode`. The three stale continuity fields name the full packet path. `CHK-004` in the child tasks is still unticked. Cited: `specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/011-permission-mode-carry/implementation-summary.md:115`, `.skilled/hooks/session-relaunch/tests/skilled-loop-wrapper-model-effort.test.cjs:919` | Met | - |
| AC-006 | REQ-005 | Given the two playbooks, When their evidence blocks are read, Then every case they name exists once in its test file | The Claude playbook uses `cp` at line 929 and names the `deferredAt` stamp. The Pi and OpenCode playbook names `agent_settled`, the Pi mode case, the two OpenCode sub-agent cases and the title case. Each name prints once in its test file. The versions read 1.0.23.0 and 1.0.22.0. Cited: `.skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/session-relaunch-claude.md:929`, `.skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/session-relaunch-pi-opencode.md:82`, `.skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/session-relaunch-pi-opencode.md:90` | Met | - |
| AC-007 | REQ-006, REQ-007 | Given the fix commit, When it is inspected, Then it changes fifteen files, none of them code or a test, and every touched folder passed strict validation | `git show --stat be1aebb9f3` lists fifteen files and the new-file count prints 3, the three scratch files. The commit message records the recursive 033 validation at ten PASSED lines, 1026 of 1026 and 62 of 62. No failing-first test is claimed, because no code or test changed. Cited: `specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title/009-document-corrections/scratch/validate-033.txt:4` | Met | - |

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

**Closeable:** Yes

Every row is Met. Phase 033 criterion 4 stays open in its own goal and is recorded as a known limitation here. No row asks for a live hop.
<!-- /ANCHOR:closure -->

---
title: "Acceptance Criteria: Phase 7: handoff-gate-exemptions"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "handoff gate exemptions acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "specs/hooks/023-session-relaunch-loop/007-handoff-gate-exemptions"
    last_updated_at: "2026-10-19T11:46:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Marked every criterion Met with its file:line, test or run evidence"
    next_safe_action: "Run repair-derived.cjs if validate asks, then validate.sh --strict on this folder and the parent"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "[SESSION-ID]"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 7: handoff-gate-exemptions

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** specs/hooks/023-session-relaunch-loop/007-handoff-gate-exemptions
**Level:** 2
**Status:** Complete
**Date:** 2026-10-19
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the spec gate is open and enforcement is on, When a Write targets a handoff note at `.skilled/skills/.state/session-relaunch/handoffs/<name>.md`, Then the decision is `allow` | Test `exempt path: runtime state under .skilled/skills/.state, but never its concern README` at `.skilled/skills/system-spec-kit/runtime/tests/hooks/spec-gate-core.test.mjs:896`. The rule is `.skilled/skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.mjs:1576` to `:1578`. Before the fix the same assertion failed with an actual `deny`, where `allow` was expected | Met | - |
| AC-002 | REQ-001 | Given the same gate state, When a Write targets a concern README at `.skilled/skills/.state/<concern>/README.md`, or a `.state` file nested under `src/`, Then the decision is `deny` | The same test at `.skilled/skills/system-spec-kit/runtime/tests/hooks/spec-gate-core.test.mjs:896`, with both `deny` assertions. The segment check is `.skilled/skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.mjs:1577` to `:1578`. Before the fix both cases were also denied, because no exemption covered them, so the test proves the boundary holds after the fix | Met | - |
| AC-003 | REQ-002 | Given a session with no Gate 3 answer that writes only a handoff note, When Gate 3 is evaluated, Then the "does not fire" clause names gitignored runtime state under `.skilled/skills/.state/` | `AGENTS.md:75`, which reads "or when its only write is gitignored runtime state under `.skilled/skills/.state/`, such as a session-relaunch handoff note". Run 10 Pi pane `specs/hooks/023-session-relaunch-loop/007-handoff-gate-exemptions/evidence/live-run10-2026-10-19/sr-pi10-pane.txt` shows no `ask_user_question` call (count 0) | Met | - |
| AC-004 | REQ-002 | Given a session that writes a handoff note, When the Gate 2 artifact trigger applies, Then the trigger names runtime state that no skill owns, so the note is not routed to sk-doc | `AGENTS.md:70`, which excludes "gitignored runtime state under `.skilled/skills/.state/`, such as a session-relaunch handoff note, which no skill owns". Run 10 Pi pane `specs/hooks/023-session-relaunch-loop/007-handoff-gate-exemptions/evidence/live-run10-2026-10-19/sr-pi10-pane.txt` contains no `compiled-route` call, so the router was not reached | Met | - |
| AC-005 | REQ-003 | Given the repo `opencode.json` and a launch with no `-m` flag, When an OpenCode session starts, Then the default model is `llmgateway/deepseek-v4.1-flash` with variant `max` | `opencode.json:3` (default `model`), `opencode.json:6` to `:7` (`agent.build`) and `opencode.json:10` to `:11` (`agent.plan`). Run 10 OpenCode launched with no `-m` (`specs/hooks/023-session-relaunch-loop/007-handoff-gate-exemptions/evidence/live-run10-2026-10-19/launch-commands.txt`). Stored message rows carry `modelID` `deepseek-v4.1-flash` and `variant` `max`, recorded in the local OpenCode database during this phase | Met | - |
| AC-006 | REQ-004 | Given a Claude session launched with no Gate 3 answer, When it prepares a handoff and the wrapper relaunches it, Then the hop completes with no operator prompt and the receiving session closes its note | `specs/hooks/023-session-relaunch-loop/007-handoff-gate-exemptions/evidence/live-run10-2026-10-19/relaunch-run10.txt:1` (prepare, `loopId=75693`), `:2` (SIGTERM at 11:35:04.649Z), `:3` (relaunch `reason=ready` at 11:35:05.362Z) and `:11` (decline `reason=no-file` at 11:40:02.412Z). The note `.skilled/skills/.state/session-relaunch/handoffs/20261019T113443Z-6f63a2a7.md` (gitignored, local) reads `status: done` with an empty `spec_folder`. `specs/hooks/023-session-relaunch-loop/007-handoff-gate-exemptions/evidence/live-run10-2026-10-19/sr-claude10-pane.txt:11` shows `WRAPPER_EXIT=0`. Operator prompts: 0, see AC-009 | Met | - |
| AC-007 | REQ-004 | Given a Pi session launched with no Gate 3 answer, When it prepares a handoff and the wrapper relaunches it, Then the hop completes with no operator prompt and the receiving session closes its note | `specs/hooks/023-session-relaunch-loop/007-handoff-gate-exemptions/evidence/live-run10-2026-10-19/relaunch-run10.txt:5` (prepare, `loopId=75625`), `:8` (SIGTERM at 11:38:59.883Z), `:9` (relaunch `reason=ready` at 11:39:00.386Z) and `:10` (decline at 11:40:02.015Z). The note `.skilled/skills/.state/session-relaunch/handoffs/20261019T113650Z-01a153f1.md` (gitignored, local) reads `status: done`. `specs/hooks/023-session-relaunch-loop/007-handoff-gate-exemptions/evidence/live-run10-2026-10-19/sr-pi10-pane.txt:1062` shows the receiver's `248` line count, and `:1110` shows `WRAPPER_EXIT=0`. Operator prompts: 0, see AC-009 | Met | - |
| AC-008 | REQ-004 | Given an OpenCode session launched with no Gate 3 answer and no `-m` flag, When it prepares a handoff and the wrapper relaunches it, Then the hop completes with no operator prompt and the receiving session closes its note | `specs/hooks/023-session-relaunch-loop/007-handoff-gate-exemptions/evidence/live-run10-2026-10-19/relaunch-run10.txt:4` (prepare, `loopId=75633`), `:6` (SIGTERM at 11:37:11.232Z), `:7` (relaunch `reason=ready` at 11:37:11.456Z) and `:12` (decline at 11:42:21.961Z). The note `.skilled/skills/.state/session-relaunch/handoffs/20261019T113449Z-ses_eac0.md` (gitignored, local) reads `status: done`. `specs/hooks/023-session-relaunch-loop/007-handoff-gate-exemptions/evidence/live-run10-2026-10-19/sr-oc10-pane.txt:17` shows `WRAPPER_EXIT=0`. The launch had no `-m` flag (`launch-commands.txt`). Operator prompts: 0, see AC-009 | Met | - |
| AC-009 | REQ-004 | Given the three run 10 sessions, When the panes are searched for an operator question, Then no pane contains a question tool call | `grep -ci 'ask_user_question\|AskUserQuestion'` returns 0 for `specs/hooks/023-session-relaunch-loop/007-handoff-gate-exemptions/evidence/live-run10-2026-10-19/sr-claude10-pane.txt`, `sr-pi10-pane.txt` and `sr-oc10-pane.txt`. The Pi pane's `sr-pi10-pane.txt:612` is a status line ("Clarifying the session trigger"), not a question | Met | - |

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

AC-001 to AC-009 carry the packet. Each row cites the test, file line or run 10 artifact that shows it. Left out on purpose: the classifier, the sk-doc router, the Codex, Cursor, Devin and Hermes reruns and the home `~/.claude/CLAUDE.md` copy, which is an operator item. The change is not committed, and the operator reviews it before any commit.
<!-- /ANCHOR:closure -->

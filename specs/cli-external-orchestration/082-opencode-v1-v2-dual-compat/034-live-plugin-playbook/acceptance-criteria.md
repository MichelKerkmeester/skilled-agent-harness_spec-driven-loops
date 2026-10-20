---
title: "Acceptance Criteria: Live plugin utilization playbook on OpenCode v1 and v2"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "live plugin playbook acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/082-opencode-v1-v2-dual-compat/034-live-plugin-playbook"
    last_updated_at: "2026-10-20T16:42:45Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "[SESSION-ID]"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Live plugin utilization playbook on OpenCode v1 and v2

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** 082/034-live-plugin-playbook
**Level:** 2
**Status:** Complete
**Date:** 2026-10-20
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the 17 `.js` files in `.opencode/plugins/`, When the playbook is read, Then each has one scenario file under `plugin-utilization/` with a trigger prompt, v1 and v2 runner commands, a check and a cleanup | `ls plugin-utilization/*.md` lists 17 files, CO-040 to CO-056; each has 5 numbered sections | Met | - |
| AC-002 | REQ-002 | Given each scenario, When it is run live on OpenCode 1.19.3 and 2.0.32, Then its verdict rests on a capture, log or event file | 36 evidence files in `scratch/live-runs/`, each holding the tool calls, the system-prompt lines and the log lines the run produced | Met | - |
| AC-003 | REQ-003 | Given the runs, When the matrix is read, Then every plugin has a v1 and a v2 verdict pointing at evidence, and each FAIL names a root cause | `scratch/live-runs/results-matrix.md`: v1 17 PASS; v2 10 PASS, 7 FAIL with four numbered causes, each tied to its own evidence. (1) Shell tool named `shell`: the v2 tool calls in `dispatch-guard.v2.txt`, `git-message-gate.v2.txt` and `git-preflight.v2.txt`, against the `!== 'bash'` early returns in `cli-dispatch-audit.js`, `sk-git-message-gate.js` and `sk-git-preflight-advisory.js`. (2) Subagent tool named `subagent` with `agent`: the v2 call in `deep-loop-guard.v2.txt`, against the `!== 'task'` return and the `subagent_type` read in `system-deep-loop-guard.js`. (3) No `session.created` for the run's own session: the v2 event list in `event-probe-summary.txt`, against the `session.created` filters in `codex-hooks-watchdog.js` and `session-cleanup.js`. (4) Thin `message.updated`: the `session.step.ended` mapping in `lib/v2-bridge.js` returns only `{info}`, while the `message.updated` branch of `session-relaunch.js` needs a top-level `sessionID` and `info.time.completed`; `session-relaunch.v2.txt` shows no nudge | Met | - |
| AC-004 | REQ-004 | Given `SYSTEM_SKILL_ADVISOR_DISABLED=1`, When the advisor scenario runs on each version, Then no `Advisor:` line is injected | `killswitch-skill-advisor.v1.txt` and `.v2.txt`: 0 lines, against 2 (v1) and 1 (v2) without the switch | Met | - |
| AC-005 | REQ-005 | Given the root playbook, When the playbook validator and the doc checks CI runs are run locally, Then the category is listed and every check passes | `scratch/live-runs/local-checks.txt`: `validate-playbook-package.cjs --strict` cli-opencode PASS, 72 scenarios, 14 categories, 0 violations; links 0 broken of 14193; sk-doc script tests pass after the durable-directory manifest refresh; cite-drift gate exits 0 against the merge base | Met | - |
| AC-006 | REQ-005 | Given the merge to main, When CI runs on the merge commit, Then every triggered workflow concludes success | main `72d091fcd5`: all 14 triggered workflows concluded success: Command Tree Parity 39490284507, Advisory Checks 39490284238, Markdown Link Integrity 39490284396, Dispatch Enforcement Guard 39490284229, Message Contract 39490284262, Rule Canary Sync 39490284289, Gate Inputs 39490284380, Playbook Operator Contract 39490284235, Changed Packet Validation 39490284563, sk-doc Script Tests 39490284230, sk-doc Rename Harness 39490284337, OpenCode Dual-Version Battery 39490284331, OpenCode Plugin Tests 39490284454, Trigger Index Rebuild 39490284282 | Met | - |

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

**Closeable:** [Yes/No]

[One or two sentences: which criteria carried the packet, and what was consciously
left out. Write this when the packet is closed, not before.]
<!-- /ANCHOR:closure -->

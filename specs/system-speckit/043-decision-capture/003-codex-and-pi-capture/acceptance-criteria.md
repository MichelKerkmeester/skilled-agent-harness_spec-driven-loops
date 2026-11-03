---
title: "Acceptance Criteria: Phase 3: codex-and-pi-capture"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "codex and pi capture acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/043-decision-capture/003-codex-and-pi-capture"
    last_updated_at: "2026-11-01T20:53:17Z"
    last_updated_by: "planning-worker"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "planning-003-codex-and-pi-capture"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 3: codex-and-pi-capture

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill the packet id, the level, the status and the date. GOOD: `004-rotate-logs-keep`. Level 1. Draft. 2026-10-24. WEAK: Packet TBD. -->

**Packet:** `003-codex-and-pi-capture`
**Level:** 2
**Status:** Complete
**Date:** 2026-11-01
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA
<!-- FILL: Write one row per requirement. The Then clause names a command. GOOD: AC-001: When `--keep 3` runs, Then `ls logs/archive \| wc -l` prints 3. WEAK: The feature works. -->

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

`PR` below is `.skilled/skills/.state/decision-capture/probe` and `DC` is `.skilled/hooks/decision-capture`.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given Pi session files that hold answered `ask_user_question` results, When the offline probe re-runs under that name, Then `jq -r .status $PR/pi.json` prints `transcript-observed, hook UNKNOWN` and its `transcript` field names `details.answers` | `jq -r '.status, .transcript' $PR/pi.json` | Superseded | ADR-001 |
| AC-002 | REQ-002 | Given the redacted fixture `$DC/bin/fixtures/pi-ask-user-question.json`, When `node --test $DC/bin/sweep-pi.test.mjs` runs, Then it reports `fail 0` with cases for one line per answered question, none for a cancelled result and none added on a second run | `node --test $DC/bin/sweep-pi.test.mjs` output. Observed 2026-11-02: 9 pass, 0 fail, including the four-answer fixture, cancelled and other-tool, error-result, second-run and malformed-line cases. | Met | - |
| AC-003 | REQ-003 | Given operator consent and one harmless question, When an interactive Plan-mode Codex session calls `request_user_input_async` and the operator answers, Then `$PR/codex.json` records the PostToolUse payload and the rollout shape, and its status is no longer `UNKNOWN` | `jq -r '.status, .hook_payload, .transcript' $PR/codex.json` | Superseded | ADR-001 |
| AC-004 | REQ-004 | Given the AC-003 result, When the Codex branch is taken, Then either `node --test $DC/bin/sweep-codex.test.mjs` passes on a redacted live-probe sample, or the README Codex cell for `decision-capture` starts `n/a:` with the observed reason and `node --test $DC/bin/runtime-refusal.test.mjs` passes and fails when that cell is edited | The chosen test's output plus `rg -n '^\| .decision-capture. \|' .skilled/hooks/README.md`. Observed: branch (a); `sweep-codex.test.mjs` 8 pass, 0 fail on the redacted live sample; the README Codex cell names the rollout sweep. | Met | - |
| AC-005 | REQ-005 | Given the live probe results, When registrations are synced, Then a Pi extension or Codex hook is bound only for a runtime whose live payload carried the answer, and `sync-hook-registrations.cjs --check` prints PASS | `node .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-hook-registrations.cjs --check` and `jq '.hooks[] \| select(.id=="decision-capture")' hook-registry.json`. Observed: `--check` prints PASS; the registry binds Claude and Devin PostToolUse and the Pi extension. Codex carries the answer but is read at save time, and no hook is bound for it. | Met | - |
| AC-006 | REQ-006 | Given what was built for each runtime, When the docs are read, Then the README `decision-capture` row and the reader list in `save.md` name the same Codex and Pi outcome as the probe files | `rg -n 'sweep-pi' .skilled/commands/speckit/save.md .skilled/hooks/README.md`. Observed: `sweep-pi` appears in `save.md` (2) and the README (1), and the README row, `save.md` and both probe files name the Codex rollout reader and the Pi extension plus reader. | Met | - |
| AC-007 | REQ-007 | Given the live-conversation harness in `../006-live-conversation-test/`, When an orchestrator drives a real multi-turn Codex session and a real multi-turn Pi session in a scratch project and answers the subject's questions as the human, Then the 006 results matrix records each runtime as capturing (one queue line per answer, no duplicates) or as having no answer surface, with evidence | The Codex and Pi rows of the 006 results matrix. Observed 2026-11-02: Pi captures live and Codex at save time, each with one queue line per answer, 0 duplicate keys and 7 record rows | Met | - |
| AC-008 | REQ-008 | Given a payload with no `cwd` and `CLAUDE_PROJECT_DIR` unset, When the Claude adapter runs from a temp directory, Then it exits 0, writes no file in that directory and queues nothing | `node --test $DC/claude/*.test.mjs` case output. Observed: `claude/ask-capture-posttooluse.test.mjs` 2 pass, 0 fail. | Met | - |
| AC-009 | REQ-009 | Given the README coverage table, When `runtime-refusal.test.mjs` runs, Then it pins every `n/a:` cell for `decision-capture`, and editing any one of them fails it | Test output before and after a temp edit. Observed: 6 pass before; a bare `n/a` cell and an unlisted `n/a:` cell in a temporary README copy each fail 1. | Met | - |
| AC-010 | REQ-001 | Given the operator's consent, When the Pi offline scan and a live `tool_result` probe both run, Then `probe/pi.json` reads `observed: hook and transcript both carry the answer` and its `hook_payload` and `transcript` start with `OBSERVED:`, the payload names `details.answers` and the transcript records `message.details` matching it | `jq -r '.status, .hook_payload, .transcript' $PR/pi.json`. Observed 2026-11-02: all three as stated. | Met | - |
| AC-011 | REQ-003 | Given the operator's consent and `default_mode_request_user_input` on, When a live interactive Codex session calls `request_user_input` and the operator answers, Then `probe/codex.json` reads `observed: hook and rollout both tie the answer to its call` and its `hook_payload` and `transcript` start with `OBSERVED:` | `jq -r '.status, .hook_payload, .transcript' $PR/codex.json`. Observed 2026-11-02: all three as stated. | Met | - |

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
<!-- FILL: Write Yes or No and one sentence. Name a criterion by its id only when it blocks closure. Never write a count of criteria or an id range, because every added row makes it wrong. GOOD: No. AC-002 is unmet. WEAK: All eight criteria AC-001 to AC-008 are met. -->

**Closeable:** Yes. Every criterion is Met, Waived or Superseded.
<!-- /ANCHOR:closure -->

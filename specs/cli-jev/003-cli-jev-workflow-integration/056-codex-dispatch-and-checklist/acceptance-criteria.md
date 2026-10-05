---
title: "Acceptance Criteria: Phase 56: codex-dispatch-and-checklist"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "acceptance criteria"
  - "closure gate"
  - "ac traceability"
  - "waiver adr"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-jev/003-cli-jev-workflow-integration/056-codex-dispatch-and-checklist"
    last_updated_at: "2026-10-05T15:41:55Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Met all six criteria with evidence"
    next_safe_action: "None; packet closeable"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "056-codex-dispatch-and-checklist"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 56: codex-dispatch-and-checklist

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** cli-jev/003-cli-jev-workflow-integration/056-codex-dispatch-and-checklist
**Level:** 2
**Status:** Complete
**Date:** 2026-10-05
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the Codex task-dispatch cell, When its evidence is read, Then it rests on a captured payload | A codex-cli 0.160 probe captured PreToolUse for `collaborationspawn_agent` with `tool_input` `{task_name, fork_turns, message}` and the message encrypted (`gAAAAA...`); the matrix, rationale and task-dispatch README now record `n/a` with that evidence | Met | - |
| AC-002 | REQ-002 | Given a Codex shell call, When it arrives as `exec` or `Bash`, Then every shell-bound repo hook runs | Probe showed an `exec` matcher does not fire for `Bash`; the five Codex shell matchers now read `exec\|Bash` or `exec\|Bash\|apply_patch\|edit` in `.codex/hooks.json`; `codex-shell-tool.test.mjs` lints and audits a flagged dispatch under both names and both response shapes; spec-gate Codex test covers both names | Met | - |
| AC-003 | REQ-003 | Given the suites and syncs, When they rerun, Then all pass | Every suite passes: spec-gate Codex 15 (was 14), Codex dispatch vitest with the audit lib 80 (5 new), dispatch rule checks 20, sk-git hook tests 65 plus Pi 3, hook-registration sync 5, and the 20 phase 55 suites at their phase 55 counts; `sync-hook-registrations --check`, `sync-runtime-mirrors --check` and `sync-skills-hermes --check` PASS | Met | - |
| AC-004 | REQ-004 | Given the JavaScript checklist, When its header rule is read, Then it matches the style guide | `javascript-checklist.md` shows the `// MODULE:` divider template from `style-guide.md` §2 and drops the "no shipped file uses it" claim; `universal-checklist.md` names the same header | Met | - |
| AC-005 | REQ-005 | Given the cli-codex hook contract, When an operator reads it after a matcher change, Then it names the rename and the approval step | `hook-contract.md` §3.1 records the `Bash` rename, the string response and the `/hooks` approval stored as `trusted_hash` in `~/.codex/config.toml` | Met | - |
| AC-006 | REQ-006 | Given each changed code folder, When the alignment verifier runs, Then it reports no finding | `verify_alignment_drift.py`: 0 warnings and 0 violations on `dispatch/codex`, `runtime/hooks/codex`, `sk-git/scripts/hooks` and `runtime/tests/hooks` | Met | - |

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

All six criteria are met. No Codex task-dispatch adapter is built, because the probe showed the spawn message is encrypted and the guard would have nothing to check.
<!-- /ANCHOR:closure -->

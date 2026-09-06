---
title: "Acceptance Criteria: Phase 5: hook-fallback-failure-signal"
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
    packet_pointer: "system-speckit/054-decommission-debt-fixes/005-hook-fallback-failure-signal"
    last_updated_at: "2026-09-05T06:13:07Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-05-054-005-hook-fallback-failure-signal"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 5: hook-fallback-failure-signal

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-speckit/054-decommission-debt-fixes/005-hook-fallback-failure-signal
**Level:** 2
**Status:** Complete
**Date:** 2026-09-05
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a synthetic adapter failure on Codex or Devin, When the fallback fires, Then the JSON payload carries a machine-detectable drift field and stderr carries a structured line, and the host still receives a well-formed successful response | Renamed `dist/hooks/{codex,devin}/session-start.js`, ran the real `bash -c` command from each config: exit 0, stdout `{"hookSpecificOutput":{...,"mkHookDrift":true}}`, stderr carried `mk-hook-drift host=<host> event=SessionStart adapter=session-start.js`; restored both files | Met | - |
| AC-002 | REQ-002 | Given a synthetic `session-cleanup.sh` failure on Codex, When the Stop hook runs, Then the diagnostic fallback fires and the Stop hook itself still reports success | Ran the Stop-cleanup command with a deliberately-missing script path (real `session-cleanup.sh` untouched): exit 0, drift marker and stderr line both fired, proving the restructured fallback group (the unconditional true branch is gone) reaches the diagnostic on real failure while the Stop hook's own exit stays 0 | Met | - |
| AC-003 | REQ-003 | Given the drift marker from AC-001, When the doctor route runs, Then its output reports the degraded adapter | Simulated `doctor-runtime-mirrors.yaml`'s new `hook_adapter_fallback_health_checks` walk against the renamed file: 0 degraded before, 1 degraded (`codex:SessionStart:...session-start.js`) during the synthetic failure, 0 after restore | Met | - |
| AC-004 | REQ-004 | Given the Copilot wrapper decision, When it is implemented, Then either real compiled adapters exist and are wired in, or the wrappers and registration are fully removed with no dangling reference | Decision: remove (no `.copilot` runtime host directory, no compiled or source adapter, no CI/workflow reference, no registration manifest anywhere in the repo). Removed `.github/hooks/scripts/{session-start.sh,user-prompt-submitted.sh,README.md}`; `grep -rln "copilot" .github .opencode/commands/doctor` (excluding `specs/`) returns nothing | Met | - |
| AC-005 | REQ-005 | Given every currently-registered hook path across the covered runtimes, When the parity test runs, Then it fails on a deliberately broken path and passes on the current state | `runtime/tests/hook-adapter-path-parity.vitest.ts` (Claude, Codex, Devin, Cursor, Pi, OpenCode; 100 tests): 100/100 pass on the current state; renamed `session-start.js` -> exactly 1 failure at the matching row, 99 pass; restored -> 100/100 pass again | Met | - |

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

All five criteria are Met: the drift marker and structured stderr line are live on every Codex/Devin `|| printf` fallback, the Codex Stop-cleanup diagnostic branch is reachable, the Copilot wrappers were removed with evidence recorded, the doctor route surfaces the drift, and the new parity test proves every registered adapter path resolves.
<!-- /ANCHOR:closure -->

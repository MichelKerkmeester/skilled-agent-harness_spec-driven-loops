---
title: "Acceptance Criteria: Phase 55: alignment-and-hook-parity"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "alignment and hook parity acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-jev/003-cli-jev-workflow-integration/055-alignment-and-hook-parity"
    last_updated_at: "2026-10-05T12:55:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Met all six criteria with evidence"
    next_safe_action: "None; packet closeable"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "055-alignment-and-hook-parity"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 55: alignment-and-hook-parity

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** cli-jev/003-cli-jev-workflow-integration/055-alignment-and-hook-parity
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
| AC-001 | REQ-001 | Given a runtime whose fetch result reaches a hook, When it fetches a page, Then it runs the screen with the shared advisory line | Claude Code, Devin, OpenCode, Pi and Hermes adapters over `classifier-injection-advisory.mjs`; captured Devin payload replayed through real Jev flags a planted injection at p=0.99 and stays silent on the clean page; Cursor (`Fetch` payload holds only url, status and length) and Codex (hosted `web_search` only) carry recorded n/a reasons | Met | - |
| AC-002 | REQ-002 | Given every hook in the registry, When each runtime is checked, Then it is bound or carries a reason checked against code or a live probe | Live-sync hooks bound on Cursor and Devin and run by Hermes; every "No Pi counterpart is registered" reason replaced by the extension that runs the hook or a true reason; Codex task dispatch stays `unverified` with probe evidence (PreToolUse fires on `spawn_agent`, payload not yet captured) | Met | - |
| AC-003 | REQ-003 | Given the suites and syncs, When they rerun, Then all pass | Every suite in the run passes: injection hook 32 (was 17), OpenCode 8, Pi 5, Hermes 51 (was 48), registration sync 5 (was 4), all others at baseline; `sync-hook-registrations --check` and `sync-runtime-mirrors --check` PASS | Met | - |
| AC-004 | REQ-004 | Given the matrix, rationale and contract, When compared with the registry and disk, Then they agree | Matrix rows for injection screen, dist-freshness, permission policy and session lifecycle corrected; Pi task dispatch and post-edit channel passages corrected; live-follow README added | Met | - |
| AC-005 | REQ-005 | Given each Jev switch, When its docs are read, Then they name the code that reads it and `/doctor:env` still parses them | ENV-REFERENCE Source cells and the `SYSTEM_INJECTION_SCREEN_DISABLED` row; `.env.example` and `hook-flags.env.example` aligned; doctor tests 225/225, env-reference drift 5/5 | Met | - |
| AC-006 | REQ-006 | Given every new or changed code folder, When the alignment verifier runs, Then it reports no finding | `verify_alignment_drift.py` PASS, 0 findings, on the hook folder, task dispatch, OpenCode plugins, runtime mirrors and the Hermes plugin; Luna's checklist findings fixed or answered with evidence | Met | - |

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

All six criteria are met. Codex task dispatch stays `unverified` on purpose: the event exists but its payload has not been read, so no adapter is built on a guess.
<!-- /ANCHOR:closure -->

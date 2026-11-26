---
title: "Acceptance Criteria: Phase 16: fix-second-follow-up-findings"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "fix second follow up findings acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "mcp/mcp-browser-use/001-mcp-browser-use-hub/016-fix-second-follow-up-findings"
    last_updated_at: "2026-11-24T09:36:46Z"
    last_updated_by: "scaffold"
    recent_action: "Built and verified every phase 016 fix"
    next_safe_action: "Decide the fleet-wide front-door callout change"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-016-fix-second-follow-up-findings"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 16: fix-second-follow-up-findings

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** 016-fix-second-follow-up-findings
**Level:** 2
**Status:** Complete
**Date:** 2026-11-24
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given one mode named by id and another by alias, When the front door routes the prompt, Then it prints `orderedBundle` with both, and the harness fails with the HEAD router | Both mixed prompts route bundles; the three-id prompt routes all three; harness `exit=1` with the HEAD router, `exit=0` with the fix | Met | - |
| AC-002 | REQ-002 | Given the hub tree, When the curl-to-shell grep runs outside reports, changelogs and the dated note, Then no Aside line matches | Only the nvm line in the Chrome troubleshooting remains | Met | - |
| AC-003 | REQ-003 | Given "open it in aside", When the front door routes it, Then it reaches Aside, and the two idiom prompts defer | `route single mcp-aside-devtools`; both idioms `defer` | Met | - |
| AC-004 | REQ-004 | Given a heredoc task holding `$(touch /tmp/pwned-015)` and a backtick, When it reaches `--prompt-stdin`, Then it routes and no file appears | `route mcp-chrome-devtools`; `ls` reports no such file | Met | - |
| AC-005 | REQ-005 | Given the bdg Node fix, When it is read, Then it installs and uses Node 20 | Lines 187 and 188 | Met | - |
| AC-006 | REQ-006 | Given the final state, When the replay, the advisor gates and the hub checks run, Then only MBU-PB-04 fails and every check is clean | Replay `{"PASS":55,"FAIL":1}`; ratchet unchanged; suite 2,737 passed, 1 known failure; parent-skill-check OK; playbooks 0 violations; route guard 0 stale | Met | - |

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

Every criterion is Met with observed evidence.
<!-- /ANCHOR:closure -->

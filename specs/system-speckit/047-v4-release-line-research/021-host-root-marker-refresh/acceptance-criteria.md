---
title: "Acceptance Criteria: Phase 21: host-root-marker-refresh"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "host root marker refresh acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/047-v4-release-line-research/021-host-root-marker-refresh"
    last_updated_at: "2026-11-09T13:40:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Recorded acceptance evidence"
    next_safe_action: "Commit the phase"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-11-09-047-remediation-lead"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 21: host-root-marker-refresh

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** `021-host-root-marker-refresh`
**Level:** 2
**Status:** Complete
**Date:** 2026-11-09
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a host whose `.skilled` resolves outside its root and which ignores `specs/mirror/`, When `--refresh-markers` runs from the host root, Then stderr names the host and the one skipped folder, the output names `specs/track/001-a`, and `mirror` never appears | `upgrade-legacy-host-root.vitest.ts` case a passes; red on the pre-change script, where the run found no spec folders and exited 0. Barter copy: stderr `upgrade-legacy: host repository <copy>`, 1009 packets in scope | Met | - |
| AC-002 | REQ-001 | Given the same host, When `--roots specs/track` is passed, Then the root resolves inside the host | Case b passes; before the change the same command from Barter's root printed `no such root: .../barter/ai-speckit/skilled/specs/bartender` and exited 2 | Met | - |
| AC-003 | REQ-002 | Given a checkout whose `.skilled` is a real folder at its root, When the script runs, Then no host line prints and the existing suites hold | Case c passes. upgrade-legacy, refresh-markers and host trigger index files: 82 before, 85 after (+3 new). Heal, template-structure and refresh files: 130 before; all eleven touched files 241 after. cli project: see `implementation-summary.md` | Met | - |
| AC-004 | REQ-003 | Given a scratch copy of Barter's spec documents, When the dry run executes from its root, Then the census is recorded | 1009 packets, all passing strict; 0 documents refreshable; 280 refused: 202 for no recorded level, 77 for a missing required or optional anchor, 1 for an anchor the template never renders. Before the proof fix the same run refused 1482 | Met | - |
| AC-005 | REQ-004 | Given the two READMEs, When read against the code, Then they name `host-index.mjs`, its callers and `--refresh-markers` with the host behavior | Lib README: nine modules, `host-index.mjs` rows in FILES, CONSUMERS and BOUNDARIES. Spec README: key-files row and entrypoint line | Met | - |

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

---
title: "Acceptance Criteria: Phase 9: existing-issue-fixes"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "existing issue fixes acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/039-deprecate-improvement-modes/009-existing-issue-fixes"
    last_updated_at: "2026-10-10T19:17:48Z"
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
# Acceptance Criteria: Phase 9: existing-issue-fixes

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-deep-loop/039-deprecate-improvement-modes/009-existing-issue-fixes
**Level:** 2
**Status:** Complete
**Date:** 2026-10-10
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a research doc citing `src/a+b/real.ts:3`, When SOURCE_TAGS runs, Then it reports no warning | 19/19 pass; fails against the old pattern. `.skilled/skills/sk-doc/shared/scripts/classifier-cite-drift-scan.mjs:23` | Met | - |
| AC-002 | REQ-002 | Given `providers-and-models.md`, When read against `executor-config.ts:321`, Then the Cline note names the `xhigh` pin and fan-out support | `.skilled/skills/cli-external-orchestration/cli-opencode/references/providers-and-models.md:77` matches `executor-config.ts:321` | Met | - |
| AC-003 | REQ-003 | Given `agent-mirror-sync.yml`, When parsed, Then it sets up Node and builds `system-spec-kit/shared` before the checker step | Step order confirmed by YAML parse in `.github/workflows/agent-mirror-sync.yml:14`; a live run waits on the next agent pull request | Met | - |

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

All three fixes are in and tested locally. The CI build step is confirmed by its YAML; a live run waits on the next pull request that changes an agent.
<!-- /ANCHOR:closure -->

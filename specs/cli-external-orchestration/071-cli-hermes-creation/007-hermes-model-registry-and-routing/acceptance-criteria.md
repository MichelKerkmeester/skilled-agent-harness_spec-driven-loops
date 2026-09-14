---
title: "Acceptance Criteria: Phase 6: hermes-model-registry-and-routing"
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
    packet_pointer: "scaffold/007-hermes-model-registry-and-routing"
    last_updated_at: "2026-09-14T17:24:49Z"
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
# Acceptance Criteria: Phase 6: hermes-model-registry-and-routing

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** cli-external-orchestration/071-cli-hermes-creation/007-hermes-model-registry-and-routing
**Level:** 3
**Status:** Complete
**Date:** 2026-09-14
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the runner, When a `cli-hermes` executor names `llmgateway/deepseek-v4.1-flash`, Then it is rejected before dispatch naming the allowlist | `scratch/offroster/runner.log`: `status: rejected`, 12 ms, "not in the enforced allowlist: deepseek-v4.1-flash, glm-5.3-flash", runner exit 3 | Met | - |
| AC-002 | REQ-001 | Given the runner, When a rostered id dispatches, Then a Hermes process starts with the built command | Phase 003 live lineage: `hermes chat -Q --oneshot --query-file - --provider llmgateway --model deepseek-v4.1-flash ... --reasoning max` observed in `ps`; `glm-5.3-flash` smoke exit 0 `OK` | Met | - |
| AC-003 | REQ-002 | Given the sync guard, When it runs, Then it passes with the `cli-hermes` card and `SKILL.md` listed | `GUARD PASS`, two `cli-hermes` PASS lines, 2026-09-14 | Met | - |
| AC-004 | REQ-002 | Given the six copies of the eligibility table, When grepped, Then each carries one `cli-hermes` row | `grep -c cli-hermes` = 1 in the five real files; Cursor and Devin copies are symlinks to the Claude file | Met | - |
| AC-005 | REQ-003 | Given each `--reasoning` level, When dispatched, Then it returns exit 0 or is documented as refused | `none` and `max` on `glm-5.3-flash`, `low` and `ultra` on `deepseek-v4.1-flash`: all exit 0 `OK` in 17 to 24 s; none refused | Met | - |

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

The runner rejection and the guard pass carry the phase; a Hermes-specific effort map was consciously not written because the gateway accepted every level and the runtime pins both roster models to `max`.
<!-- /ANCHOR:closure -->

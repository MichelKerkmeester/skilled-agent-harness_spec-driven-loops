---
title: "Acceptance Criteria: Phase 2: router-reach-misroutes"
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
    packet_pointer: "scaffold/002-router-reach-misroutes"
    last_updated_at: "2026-10-03T05:27:37Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-002-router-reach-misroutes"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 2: router-reach-misroutes

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-skill-advisor/033-advisor-status-truthfulness/002-router-reach-misroutes
**Level:** 3
**Status:** Draft
**Date:** 2026-10-03
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a live advisor answering with a generation, When the full fleet runs with no hub filter and no limit, Then the recorded output carries the complete classification counts, the advisor generation and the exit status, and a degraded or generation-less answer is recorded as a failed run rather than scored | `node .skilled/skills/sk-doc/sk-create-skill/scripts/ci-router-vocabulary-reach.cjs`; the `advisor generation:` and `checked=` lines and the exit status in `scratch/live-fleet.log` | Unmet | - |
| AC-002 | REQ-002 | Given the live run's reproduced wrong-hub and outranked phrases, When each is fixed in the vocabulary of the hub that declares it, Then the post-fix full-fleet rerun reports `wrong-hub= 0` and `outranked= 0`, or each remaining phrase names a decision record with its winner and rationale | `node .skilled/skills/sk-doc/sk-create-skill/scripts/ci-router-vocabulary-reach.cjs` run to completion in `scratch/verification.log`; per-hub probe `--hub <id>` for each edited hub | Unmet | - |
| AC-003 | REQ-003 | Given any allowlist change, When it is made, Then a decision record names the phrase, the winning hub and why the dispute is acceptable, and no reproduced phrase is hidden by a blanket or undocumented entry | `git diff -- .skilled/skills/sk-doc/sk-create-skill/scripts/router-reach-allowlist.json` read against `decision-record.md` | Unmet | - |
| AC-004 | REQ-004 | Given the phase's evidence, When the phase closes, Then the scratch record holds the before and after counts, the exact commands and the advisor generation, and the probe script, doctor workflow and run command are unchanged | `rg -n "wrong-hub|generation" scratch/live-fleet.log scratch/verification.log scratch/reproduction.md`; `git diff --stat -- .skilled/skills/sk-doc/sk-create-skill/scripts .skilled/commands/doctor` returns no edited probe or doctor file | Unmet | - |

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

**Closeable:** No

Pending. Every criterion is `Unmet` until a live full-fleet run and a post-fix rerun are recorded; the phase may close with zero vocabulary edits if the reruns show the recorded rows no longer reproduce, provided the evidence names the generation and the counts.
<!-- /ANCHOR:closure -->

---
title: "Acceptance Criteria: Shared package dead half removal"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "acceptance criteria"
  - "closure gate"
  - "shared removal criteria"
  - "telemetry directory criterion"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/035-spec-kit-simplification-research/009-shared-package-dead-half-removal"
    last_updated_at: "2026-09-07T00:20:00Z"
    last_updated_by: "claude-fable-5-1"
    recent_action: "Marked every criterion met with the evidence observed"
    next_safe_action: "None; the packet is closed"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-06-simplification-research"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Shared package dead half removal

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** 035-spec-kit-simplification-research/009-shared-package-dead-half-removal
**Level:** 2
**Status:** Complete
**Date:** 2026-09-07
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the repository outside specs, changelogs and benchmark reports, When every removed name is searched, Then nothing imports, requires or documents it | the residue sweep in `implementation-summary.md` returned only the two READMEs that record the removal by name | Met | - |
| AC-002 | REQ-002 | Given the three packages, When they are rebuilt in order and the gates run, Then all exit zero | shared `tsc --build` exit 0, `npm test` exit 0; runtime `npm run build` exit 0; CLI `npm run rebuild` and `npm run check` exit 0; dist freshness reports all fresh | Met | - |
| AC-003 | REQ-003 | Given no override, When the telemetry directory is resolved, Then it is `runtime/database` under the skill root and not under the shared package | `config.test.ts` probe prints that directory in a child process with the overrides removed | Met | - |
| AC-004 | REQ-004 | Given the profile, the provider and the probes, When each reads the Voyage base URL, Then all three read `VOYAGE_BASE_URL` | a search for `VOYAGE_API_URL` outside specs returns nothing | Met | - |
| AC-005 | REQ-005 | Given the shared README, When its configuration table and structure tree are read, Then every variable the package reads appears and every listed file exists | the table's nine groups against the `process.env` census of the package; the sk-doc validator exits zero | Met | - |
| AC-006 | REQ-006 | Given the shared test lane, When it runs, Then a test compares the socket directory and lease name across the client and the bin scripts | `model-server-constants.test.ts` printed "model-server constants agree across packages" | Met | - |

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

Every criterion is met by observed command output. Consciously left out: the predicate grammar module stays because the command contracts cite it, the two database-directory spellings stay because operator configs carry both, and the skill advisor's isolation boundary is recorded for its own maintainers.
<!-- /ANCHOR:closure -->

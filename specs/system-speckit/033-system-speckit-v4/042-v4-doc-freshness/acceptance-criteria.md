---
title: "Acceptance Criteria: V4 Documentation Freshness"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "v4 doc freshness acceptance criteria"
  - "release doc verdict closure gate"
  - "ac traceability"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-system-speckit-v4/042-v4-doc-freshness"
    last_updated_at: "2026-09-19T18:39:04Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-19-v4-doc-freshness"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: V4 Documentation Freshness

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-speckit/033-system-speckit-v4/042-v4-doc-freshness
**Level:** 2
**Status:** Complete
**Date:** 2026-09-19
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the lane is bound to `--stop-policy=max-iterations`, When it runs to completion, Then it records exactly ten iterations with convergence treated as telemetry | `research/research.md:11` records "Total iterations: 10 (stop policy: max-iterations)" with stop reason `maxIterationsReached`; `research/iterations/` holds 10 files, none empty | Met | - |
| AC-002 | REQ-002 | Given each iteration dispatches the `deep-research` leaf, When the state log is read, Then ten events carry the route-proof fields and each has a non-empty iteration file | `research/deep-research-state.jsonl:2` holds the 10 iteration records, each carrying `mode`, `target_agent`, `agent_definition_loaded`, `resolved_route` and an `executor` block; `verify-iteration.cjs` returns OK for sampled iterations 1, 5 and 10 | Met | - |
| AC-003 | REQ-003 | Given the run synthesizes its findings, When `research/research.md` is inspected, Then every finding carries a `[SOURCE: ...]` citation and no placeholder residue remains | `research/research.md:6` carries the first of 107 `[SOURCE: ...]` citations, with 0 placeholder markers in the file | Met | - |
| AC-004 | REQ-004 | Given the lane produced findings, When both verdict documents are read, Then every row names the stale claim, its deciding evidence and the proposed correction | `verdict-changelog.md:34` and `verdict-readme.md:31` open the applied-row tables; `verdict-readme.md:49` carries the rejected row. Every row names claim, truth, evidence and confidence | Met | - |
| AC-005 | REQ-005 | Given the verdicts are written, When the corrections are applied, Then the diff contains this packet and the two release documents and nothing else, and each hunk traces to a row | `verdict-changelog.md:34` plus `git status --short`, which shows the 042 packet, the parent's registration files, the two release documents and the three allowlist files named in the approved scope amendment, and nothing else | Met | - |
| AC-006 | REQ-006 | Given the packet is complete, When strict validation runs, Then it reports `RESULT: PASSED` | `implementation-summary.md:152` records the validation row; the command `validate.sh --strict` on this folder returns `RESULT: PASSED` with 0 errors and 0 warnings | Met | - |

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

All six criteria are `Met` and none is waived. Ten iterations of cited evidence decided the outcome:
thirty-one candidate claims were tested against the repository, twenty-two corrections went in, one
proposed correction was refused because it was false, and both documents were judged to need
targeted corrections rather than a rewrite.

Consciously left out: the changelog's pre-release numerics, which cannot be re-derived; the identity
of the eighteenth bridged hook package, which no source names; a full rewrite of either document,
which the evidence never supported; and two adjacent defects named in the verdict documents but
owned elsewhere, the `cli-devin` roster line and the migration packet's continuity block.
<!-- /ANCHOR:closure -->

---
title: "Acceptance Criteria: Phase 1: pre-v4-spec-upgrade"
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
    packet_pointer: "scaffold/066-pre-v4-spec-upgrade"
    last_updated_at: "2026-09-24T09:28:02Z"
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
# Acceptance Criteria: Phase 1: pre-v4-spec-upgrade

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-speckit/033-system-speckit-v4/066-pre-v4-spec-upgrade
**Level:** 2
**Status:** In Progress
**Date:** 2026-09-24
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a fresh harness sandbox of a v3.x tag, When `upgrade-legacy.mjs` runs without `--apply`, Then the specs root's path-and-sha256 manifest is unchanged and the command exits 1 listing the packets it would repair | `plan.md` §5 proof item 5, plus `rg -n "fetch\|https?://\|child_process.*curl" runtime/cli/spec/upgrade-legacy.mjs` finding no network call | Unmet | - |
| AC-002 | REQ-002 | Given harness sandboxes of `v3.0.0.0` and `v3.6.0.0`, When `upgrade-legacy.mjs --apply` runs, Then 170 of 170 and 1,007 of 1,007 active packets pass `validate.sh --strict` | `plan.md` §5 proof item 1: `validate-all.cjs` then `agg.cjs` on each sandbox | Unmet | - |
| AC-003 | REQ-003 | Given a sandbox already upgraded, When `--apply` runs a second time, Then no file under the specs root changes | `plan.md` §5 proof item 2: manifest diff is empty | Unmet | - |
| AC-004 | REQ-004 | Given the same sandboxes, When `--apply --include-archive` runs, Then 186 of 186 and 911 of 911 archived packets pass, and no archived document was edited | `plan.md` §5 proof item 4, plus `git diff --stat` in the sandbox listing no `.md` under `z_archive` or `z_future` | Unmet | - |
| AC-005 | REQ-005 | Given a folder whose graph refresh fails, When the backfill runs on it, Then it exits 1, `repair-derived --apply` prints `FAILED` for it, and `upgrade-legacy` exits 2 if the packet still fails strict | New spawn test in `runtime/cli/tests/graph-metadata-backfill.vitest.ts`, existing `repair-derived.vitest.ts`, new `upgrade-legacy.vitest.ts` | Unmet | - |
| AC-006 | REQ-006 | Given an upgraded packet, When a finding not in its `upgrade-baseline.json` appears, Then that entry stays an error and `validate.sh --strict` prints `RESULT: FAILED`, while listed findings report as warnings | `runtime/tests/upgrade-baseline.vitest.ts` cases, plus `plan.md` §5 proof item 3 | Unmet | - |
| AC-007 | REQ-007 | Given a harness sandbox under git, When `--apply` runs, Then no new `.md` file exists and no `Status` row changed | `git status --porcelain` in the sandbox lists no new `.md`, and `git diff -G 'Status'` on `*.md` shows no changed Status row | Unmet | - |

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

**Closeable:** [Yes/No]

[One or two sentences: which criteria carried the packet, and what was consciously
left out. Write this when the packet is closed, not before.]
<!-- /ANCHOR:closure -->

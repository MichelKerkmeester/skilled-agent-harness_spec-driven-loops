---
title: "Acceptance Criteria: Phase 3: update"
description: "The criteria this phase must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "doctor update audit acceptance"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/048-doctor-command-audit/003-update"
    last_updated_at: "2026-10-02T23:12:59Z"
    last_updated_by: "implementation"
    recent_action: "Closed the criteria: five Met, AC-001 Superseded through ADR-001"
    next_safe_action: "None — packet closed"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "fd6197bf-4447-484a-82b8-d9015d93169d"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 3: update

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-speckit/048-doctor-command-audit/003-update
**Level:** 2
**Status:** Complete
**Date:** 2026-10-02
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given this checkout, When the phase closes, Then `scratch/reality-check.md` lists every path, script, command, flag and environment variable that the `/doctor:update` route and `doctor-update.yaml` name, each marked present, moved or missing with the command that showed it. | `scratch/reality-check.md` is the completed pre-split audit: its route-and-workflow and path tables mark each named item present, moved or missing with the probe that showed it. The split superseded the criterion's frame — the `/doctor:update` route now names `doctor-update-check.yaml`, and the workflow it inventoried lives at `doctor-rebuild.yaml` under `/doctor:rebuild`. | Superseded | ADR-001 in decision-record.md — the split renamed doctor-update.yaml to doctor-rebuild.yaml |
| AC-002 | REQ-002 | Given this checkout, When the phase closes, Then `/doctor:update` runs once on this checkout in its read-only or dry-run form, or against a disposable copy of any database it would change, and its output is saved to `scratch/doctor-run.log`. | `scratch/doctor-run.log:317` holds the read-only graph-metadata dry-run for this checkout and `scratch/doctor-run.log:232` the stale trigger-index check; `reality-check.md` cites both. The redesigned read-only action re-ran as `node .skilled/commands/doctor/scripts/release-update.cjs check --json` online during the phase (exit 0) and with `--offline` at close-out (exit 0, upstream `unknown` by design). | Met | - |
| AC-003 | REQ-003 | Given this checkout, When the phase closes, Then `implementation-summary.md` records one verdict, keep, fix or retire, with the evidence behind it. | `implementation-summary.md` opens with `Verdict: fix, by redesign`, grounded in the rebuild's forbidden skill writes (`.skilled/commands/doctor/assets/doctor-rebuild.yaml:123`) and the settled design (`scratch/design.md` section 1); `scratch/proposal.md:3` records the original fix verdict the redesign grew from. | Met | - |
| AC-004 | REQ-004 | Given this checkout, When the phase closes, Then after the verdict is applied, `bash .skilled/commands/doctor/scripts/route-validate.sh` exits 0. | `bash .skilled/commands/doctor/scripts/route-validate.sh` → exit 0, `OK: route-validate — 9 routes validated, 2 warnings`, over the manifest whose `/doctor:update` entry is at `.skilled/commands/doctor/_routes.yaml:240` (re-run at close-out). | Met | - |
| AC-005 | REQ-005 | Given the release-update engine, When the phase closes, Then `node --test .skilled/commands/doctor/scripts/tests/release-update.test.cjs` reports zero failures. | `node --test .skilled/commands/doctor/scripts/tests/release-update.test.cjs` → tests 16, pass 16, fail 0; the suite defines its apply-refusal and rollback cases at `.skilled/commands/doctor/scripts/tests/release-update.test.cjs:366` (re-run at close-out). | Met | - |
| AC-006 | REQ-006 | Given the split, When the phase closes, Then `.skilled/commands/doctor/rebuild.md` and `.skilled/commands/doctor/update.md` both exist, and a bare `/doctor:update` routes to the read-only `doctor-update-check.yaml`. | Both routers exist; `.skilled/commands/doctor/_routes.yaml:240` registers `/doctor:update` with default yaml `doctor-update-check.yaml` and an actions map giving `check` `mutating: read-only`, `align` `add-only` and `apply` `mutates`, and `.skilled/commands/doctor/_routes.yaml:232` registers `/doctor:rebuild` (`doctor-rebuild.yaml`); `.skilled/commands/doctor/update.md:16` states that a bare `/doctor:update` runs the read-only `check` action. | Met | - |

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

Five rows are `Met` and AC-001 is `Superseded` through ADR-001: the split renamed the workflow the audit inventoried, so the audit stands as the evidence behind the verdict rather than as a criterion about the current tree. The verdict is `fix, by redesign` — the database rebuild keeps its behaviour as `/doctor:rebuild`, and `/doctor:update` is the release-aware updater whose bare invocation is the read-only check. The post-change gates passed: the engine tests report 16 pass and 0 fail, `route-validate.sh` exits 0 with 9 routes validated, the catalog mirror check returns `STATUS=OK`, both router documents validate with 0 issues, the four workflow YAMLs parse, and the runtime mirrors and the three prompt trees are in sync.
<!-- /ANCHOR:closure -->

---
title: "Acceptance Criteria: Phase 3: meta-and-quality"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "meta and quality acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/050-sk-doc-playbook-coverage/003-meta-and-quality"
    last_updated_at: "2026-10-03T12:00:00Z"
    last_updated_by: "spec-validation-backfill"
    recent_action: "Closed the phase from commit ad9d93df3be, which added the three playbook packages"
    next_safe_action: "None: phase closed; reopen only if a package stops validating"
    blockers: []
    key_files:
      - ".skilled/skills/sk-doc/sk-create-manual-testing-playbook/manual-testing-playbook/"
      - ".skilled/skills/sk-doc/sk-create-quality-control/manual-testing-playbook/"
      - ".skilled/skills/sk-doc/sk-create-skill/manual-testing-playbook/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-validation-backfill-003-meta-and-quality"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 3: meta-and-quality

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** sk-doc/050-sk-doc-playbook-coverage/003-meta-and-quality
**Level:** 3
**Status:** Complete
**Date:** 2026-10-03
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

Each package was run as `node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs --package <playbook root>` on 2026-10-03; the packages themselves were added in commit `ad9d93df3be`.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the packages for `sk-create-manual-testing-playbook`, `sk-create-quality-control`, `sk-create-skill`, When each is validated with `--package`, Then each reports `PASS` with a non-zero `operator` count and `routing_gold_excluded=0` | `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/manual-testing-playbook/manual-testing-playbook.md:1` reports `PASS ... operator=6 routing_gold_excluded=0`; `.skilled/skills/sk-doc/sk-create-quality-control/manual-testing-playbook/manual-testing-playbook.md:1` reports `PASS ... operator=6 routing_gold_excluded=0`; `.skilled/skills/sk-doc/sk-create-skill/manual-testing-playbook/manual-testing-playbook.md:1` reports `PASS ... operator=8 routing_gold_excluded=0` | Met | - |
| AC-002 | REQ-002 | Given a fully excluded package exits zero with `operator=0` and status `SKIP`, When a package is judged, Then the verdict rests on the summary line's status and `operator` count, not the exit status | Status is `SKIP` only when no operator file exists (`.skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs:741`); the summary line printing `operator=` comes from `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs:794`. Observed counts: `sk-create-manual-testing-playbook` operator=6, `sk-create-quality-control` operator=6, `sk-create-skill` operator=8 | Met | - |
| AC-003 | REQ-003 | Given each mode's package, When its scenarios are read, Then at least one scenario the mode must act on and one it must leave alone exist, each with its own PASS/FAIL line | `sk-create-manual-testing-playbook`: must act `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/manual-testing-playbook/package-authoring/create-a-reusable-package.md:33`, must leave alone `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/manual-testing-playbook/package-authoring/leave-one-off-check-alone.md:33`; `sk-create-quality-control`: must act `.skilled/skills/sk-doc/sk-create-quality-control/manual-testing-playbook/audit-and-validation/run-a-report-only-audit.md:33`, must leave alone `.skilled/skills/sk-doc/sk-create-quality-control/manual-testing-playbook/audit-and-validation/leave-creation-requests-alone.md:33`; `sk-create-skill`: must act `.skilled/skills/sk-doc/sk-create-skill/manual-testing-playbook/standalone-skill/scaffold-a-standalone-skill.md:33`, must leave alone `.skilled/skills/sk-doc/sk-create-skill/manual-testing-playbook/standalone-skill/leave-quality-audits-alone.md:33` | Met | - |

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

All three criteria are Met on the package validator's summary lines and on the scenario files, for packages that commit `ad9d93df3be` added. SC-003 (fleet connectivity gate) is a success criterion with no requirement row and was not re-run for this closure.
<!-- /ANCHOR:closure -->

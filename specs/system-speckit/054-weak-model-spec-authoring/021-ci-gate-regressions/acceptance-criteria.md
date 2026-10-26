---
title: "Acceptance Criteria: Phase 21: ci-gate-regressions"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "ci gate regressions acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/054-weak-model-spec-authoring/021-ci-gate-regressions"
    last_updated_at: "2026-10-26T23:45:00Z"
    last_updated_by: "closeout-doc-writer"
    recent_action: "Recorded the gate replays; every row Met"
    next_safe_action: "None: phase complete"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "054-021-ci-gate-regressions"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 21: ci-gate-regressions

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill the packet id, the level, the status and the date. GOOD: `004-rotate-logs-keep`. Level 1. Draft. 2026-10-24. WEAK: Packet TBD. -->

**Packet:** 054-weak-model-spec-authoring/021-ci-gate-regressions
**Level:** 2
**Status:** Complete
**Date:** 2026-10-26
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA
<!-- FILL: Write one row per requirement. The Then clause names a command. GOOD: AC-001: When `--keep 3` runs, Then `ls logs/archive | wc -l` prints 3. WEAK: The feature works. -->

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the scratch skip in the selection loop, When the comparison tests run and the selection is replayed over the failing diff, Then no `scratch/` packet is graded and a packet named with "scratch" still is | `npx vitest run --config ../../vitest.config.ts --project cli tests/ci-rule-set-comparison.vitest.ts` from `runtime/cli`. Observed: `Tests 17 passed (17)`; against the old workflow (`CHANGED_PACKET_WORKFLOW_PATH`) `Tests 1 failed \| 16 passed (17)`, the failure being the scratch-copy test. Replay over `b51a341a07^2..b51a341a07`: old loop 111 graded, 104 under `scratch/`; new loop 7 graded, 0 under `scratch/`. CI run 40380947180 reads `"conclusion":"failure"` with 81 error annotations Evidence: `.github/workflows/changed-packet-validation.yml:91` | Met | - |
| AC-002 | REQ-002 | Given `spec docs` in place of `draft auto-repair` and the recompiled graph, When the Routing Registry Drift suites run, Then each passes | From `system-skill-advisor/runtime`. Observed: divergence ratchet `Tests 9 passed (9)`, rc=0; drift guard and parity `Tests 21 passed (21)`; scorer baseline ratchet `Tests 7 passed (7)`; golden prompts `Tests 14 passed (14)`; `skill-graph-freshness.cjs --strict` `SIGNAL DRIFT compiled vs disk: none`, rc=0; compiler `VALIDATION PASSED`; intent signals `RESULT: PASSED`; `compiled-route-guard.cjs` `All hubs fresh or excused` Evidence: `.skilled/skills/system-spec-kit/graph-metadata.json:70` | Met | - |
| AC-003 | REQ-003 | Given the separators and the `OVERVIEW AND BOUNDS` heading, When the sk-doc validator and the card sync guard run, Then both pass | `python3 .skilled/skills/sk-doc/scripts/validate_document.py` on the card. Observed: `Total issues: 0`, rc=0; `check-card-sync.sh` printed `CARD SYNC OK`; card-sync plus comparison vitest `Tests 27 passed (27)` Evidence: `.skilled/skills/system-spec-kit/references/workflows/spec-authoring-card.md:20` | Met | - |
| AC-004 | REQ-004 | Given B-03 to B-05, A-1, X6 and X7, When each finding's check runs, Then each passes | Observed: `rg -n 'lazy add-on'` printed one line in each of the three docs; ESLint 244 problems, 0 in `dist/`; the X6 path `rg` printed nothing and `YAML OK`; `validate.sh --help` printed the `2=+acceptance-criteria (optional)` line, mode `-rwxr-xr-x`; all four cli-pi runs `exit=0` Evidence: `.skilled/skills/system-spec-kit/runtime/eslint.config.mjs:10` | Met | - |
| AC-005 | REQ-005 | Given the version bump, When the Hermes sync and its check run, Then both copies read 2.12.2.0 and the check passes | Observed: `sync-skills-hermes.cjs` `Wrote 1 of 67`; `--check` `PASS: 67 Hermes skill copies in sync`, rc=0; `rg -n '^version:'` printed `2.12.2.0` for both copies Evidence: `.skilled/skills/system-spec-kit/SKILL.md:5` | Met | - |
| AC-006 | REQ-006 | Given the filled docs, When `validate.sh` runs on this folder with `--strict` and the repair switched off, Then it prints `RESULT: PASSED` | `repair-derived.cjs --folder <this folder> --apply`, then `SPECKIT_DRAFT_AUTO_REPAIR=0 bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh <this folder> --strict`. Observed: repair `inspected=1 repaired=1 failed=0`, rc=0; validate `Summary: Errors: 0  Warnings: 0` and `RESULT: PASSED`, rc=0; the recursive parent run printed 22 `RESULT: PASSED` and 0 `FAILED` Evidence: `implementation-summary.md:117` | Met | - |

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
<!-- FILL: Write Yes or No and one sentence. Name a criterion by its id only when it blocks closure. Never write a count of criteria or an id range, because every added row makes it wrong. GOOD: No. AC-002 is unmet. WEAK: All eight criteria AC-001 to AC-008 are met. -->

**Closeable:** Yes

Yes. Every criterion is Met, and both CI gates pass locally for the right reason.
<!-- /ANCHOR:closure -->

---
title: "Acceptance Criteria: Phase 9: skilled-alignment-and-docs"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "skilled alignment and docs acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skilled-bots/001-headless-bots-first-build/009-skilled-alignment-and-docs"
    last_updated_at: "2026-11-24T06:55:00Z"
    last_updated_by: "claude"
    recent_action: "Marked AC-010 Met after both strict validations passed"
    next_safe_action: "Commit the staged tree in the worktree"
    blockers: []
    key_files:
      - "specs/system-skilled-bots/001-headless-bots-first-build/009-skilled-alignment-and-docs/scratch/routing-replay.txt"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-009-skilled-alignment-and-docs"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 9: skilled-alignment-and-docs

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill the packet id, the level, the status and the date. GOOD: `004-rotate-logs-keep`. Level 1. Draft. 2026-10-24. WEAK: Packet TBD. -->

**Packet:** `009-skilled-alignment-and-docs`
**Level:** 2
**Status:** Complete
**Date:** 2026-11-23
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA
<!-- FILL: Write one row per requirement. The Then clause names a command. GOOD: AC-001: When `--keep 3` runs, Then `ls logs/archive | wc -l` prints 3. WEAK: The feature works. -->

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the six code folders, When the README checks run, Then every README is valid | `audit_readmes.py --document-type code_folder`: runtime, runtime/lib, runtime/tests and scripts `template_status: valid`. `validate_document.py --no-exclude --type code_folder`: both fixture READMEs `VALID` | Met | - |
| AC-002 | REQ-002 | Given the Opus xhigh review, When each finding is checked, Then each is confirmed or refuted and each confirmed P0 or P1 has a test that failed first | `scratch/review-triage.md`: every row has a disposition. P0 and five P1 fixed test-first in `bd474396742` | Met | - |
| AC-003 | REQ-003 | Given every code change, When the suite and typecheck run, Then both pass and the delta is reported | Baseline 33 files / 355 tests. Final `npx vitest run --no-coverage`: `Test Files  35 passed (35)`, `Tests  372 passed (372)`. `npm run typecheck` exit 0 | Met | - |
| AC-004 | REQ-004 | Given `feature-catalog/`, When the catalog validator runs strictly, Then it passes | `validate_catalog_package.py --package system-skilled-bots --strict`: `PASS: 0 violations` | Met | - |
| AC-005 | REQ-005 | Given the runtime playbook categories, When the playbook validator and admission run, Then both pass with no drift | `validate-playbook-package.cjs`: `PASS ... scenarios=25 ... violations=0 warnings=0`. `compiled-route-admission.cjs --hub system-skilled-bots`: 8 pass, 0 drift, 0 stale | Met | - |
| AC-006 | REQ-006 | Given the alignment run, When each finding is triaged, Then each is fixed or recorded with a reason | `scratch/alignment-triage.md`: every in-scope finding has a disposition. Release-notes rows stay open by operator decision (not releasing yet) | Met | - |
| AC-007 | REQ-006 | Given the two P0 battery rows, When their checks rerun, Then both pass | `check-skill-doc-frontmatter.sh . --coverage`: `violations=0`. `skill-graph-freshness.cjs --strict` exit 0 | Met | - |
| AC-008 | REQ-006 | Given the bots routing probes, When they replay through stage two, Then each named-bot request routes its mode and no out-of-domain prompt routes | `scratch/routing-replay.txt` at policy `93ebae9de124`: all 14 in-domain probes route their mode at stage two, and none of the 34 out-of-domain and 16 adjacent prompts routes there. The authoring-verb guard defers "start writing the bot", "start building the bot", "how do I start building the bot" and "launch the bot I'm writing". "start to write the bot" still routes run, recorded as a known limitation. Admission `--all`, sync `--check`, guard and parent-skill-check pass | Met | - |
| AC-009 | REQ-006 | Given the new CI workflow, When the CI report and gate-input check run, Then neither flags it | `ci-report.cjs --json --no-gh`: no flags for `bots-runtime.yml`. `check-gate-inputs.sh`: `RESULT: PASSED` | Met | - |
| AC-010 | REQ-003 | Given the final tree, When this phase and its parent validate strictly, Then both print `RESULT: PASSED` | `validate.sh --strict` on 2026-11-24: 009 `Errors: 0  Warnings: 0` `RESULT: PASSED`. The parent `specs/system-skilled-bots/001-headless-bots-first-build` with every child `RESULT: PASSED` | Met | - |
| AC-011 | REQ-007 | Given a bot on `native`, or on a kind that cannot honor its sandbox, When the checker runs, Then it fails with `executor-kind-native` or `posture-unhonorable`, and an unedited template copy passes | `bot-check.vitest.ts` defect fixtures `executor-kind-native` and `posture-unhonorable` fail by name, and both fail when the posture call is removed. Template copy: `PASS: posture: ... cli-codex honors sandbox workspace-write`, exit 0. BOT-011 run as written: checker `exit=1`, run `exit=4`, no stub receipt | Met | - |

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

Every criterion is Met on the final tree.
<!-- /ANCHOR:closure -->

---
title: "Acceptance Criteria: Phase 8: doctor-ownership-split"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "doctor ownership split acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/049-doctor-audit-followups/008-doctor-ownership-split"
    last_updated_at: "2026-10-04T06:09:44Z"
    last_updated_by: "doctor-ownership-split"
    recent_action: "Marked every criterion met with observed evidence"
    next_safe_action: "None; phase complete"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "doctor-ownership-split"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 8: doctor-ownership-split

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-speckit/049-doctor-audit-followups/008-doctor-ownership-split
**Level:** 2
**Status:** Complete
**Date:** 2026-10-04
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the route manifest, When `route-validate.sh` runs, Then every route names an existing doctor router and each command's targets match its router and presentation | `bash .skilled/commands/doctor/scripts/route-validate.sh`: `OK: route-validate — 9 routes validated, 1 warnings`, exit 0, with B3 and J1 passing across 4 commands | Met | - |
| AC-002 | REQ-001 | Given a broken copy of the doctor folder, When one router row is removed or one target renamed, Then J1 names the break | A scratch copy reported `missing from skill-advisor.md targets table: rebuild`, then `missing from deep-loop.md targets table: deep-loop-x`, exit 1 | Met | - |
| AC-003 | REQ-002 | Given the new routers, When their tables are read, Then `/doctor:skill-advisor` lists six targets and `/doctor:deep-loop` and `/doctor:runtime-mirrors` one each | `skill-advisor.md`, `deep-loop.md`, `runtime-mirrors.md` section 4; `validate_document.py --type command` reports `Total issues: 0` for all three and `speckit.md` | Met | - |
| AC-004 | REQ-003 | Given the rebuild workflow, When it runs, Then it backs up, rebuilds through the advisor CLI, validates, and restores the backup on failure, and a dry run writes nothing | `doctor-skill-advisor-rebuild.yaml` phases 2 to 6; the route's `cli_commands` pass the advisor route contract test, 7 of 7; the playbook scenario DOC-348 covers all three runs | Met | - |
| AC-005 | REQ-004 | Given the deletions, When live files outside `specs/` are searched, Then none names `/doctor:rebuild`, `doctor-rebuild` or `fable-mode` as runnable | `rg --hidden "doctor:rebuild\|doctor-rebuild\|fable-mode\|doctor:speckit <moved-target>"` over live files returns only the moved-target notice, the README line describing it, and a `.gitignore` comment | Met | - |
| AC-006 | REQ-005 | Given the changed code, When the test suites run, Then all pass | `run-all.sh`: 7 suites passed, node:test 203 of 203, exit 0; `route-validate.test.sh`: 20 passed, 0 failed; advisor handoff test 9 of 9; advisor vitest 8 of 8; release-update 72 of 72 | Met | - |
| AC-007 | REQ-006 | Given an old target name, When `/doctor:speckit` receives it, Then it names the command that owns it now | `doctor-speckit-presentation.txt` section 1 maps all seven moved targets and the retired fable-mode | Met | - |
| AC-008 | REQ-007 | Given the contract, When it is validated, Then it passes its schema and every doctor router is clean | Ajv against `command-contract.schema.json`: valid, exit 0; `generate-command-routers.cjs --check`: `routers=34 clean=34 path-drift=0`, exit 0 | Met | - |
| AC-009 | REQ-008 | Given the regenerated mirrors, When their checks run, Then all pass | `sync-runtime-mirrors.cjs --check`: 179 mirrors in sync; the Codex, Pi and Hermes prompt checks: 36 prompts in sync each; `command-catalog-mirror-check.cjs`: `STATUS=OK`; `compiled-route-guard.cjs` exit 0 after the sk-doc re-mint; `check-markdown-links.cjs`: 0 broken | Met | - |

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

The route validator and the doctor suite carried the packet: every route has an owning command and every router matches its routes. Left out on purpose: the git hooks doctor and sk-git standard customization the operator asked for during this phase, planned as phase 009.
<!-- /ANCHOR:closure -->

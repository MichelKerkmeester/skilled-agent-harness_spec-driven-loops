---
title: "Acceptance Criteria: Phase 10: asset-templates-and-folder-readmes"
description: "The criteria that close phase 010: template parity, checker coverage, code-folder READMEs, index removal, routing and release notes."
trigger_phrases:
  - "acceptance criteria"
  - "closure gate"
  - "ac traceability"
  - "waiver adr"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/060-create-goal-mode/010-asset-templates-and-folder-readmes"
    last_updated_at: "2026-09-26T13:00:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Closed all seven criteria with evidence"
    next_safe_action: "None; phase closed"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "75aab0e6-dcc7-401b-9d10-f48248374023"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 10: asset-templates-and-folder-readmes

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** sk-doc/060-create-goal-mode/010-asset-templates-and-folder-readmes
**Level:** 2
**Status:** Complete
**Date:** 2026-09-26
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the three asset templates, When the parity test resolves `goal.md.tmpl` at each template's level, Then every fixed line matches and a copy missing one fails with that line named. | T005, T013; `node --test .skilled/skills/sk-doc/sk-create-goal/scripts/tests/` passes 15 of 15. Cited: `.skilled/skills/sk-doc/sk-create-goal/scripts/tests/template-parity.test.cjs:99` and `.skilled/skills/sk-doc/sk-create-goal/scripts/tests/template-parity.test.cjs:104`. | Met | - |
| AC-002 | REQ-002 | Given an unfilled copy of each template, When the placeholder check runs, Then it fails on the objective, a decision and a criterion, and the live corpus report does not change. | T006, T014; three unfilled-template tests pass, and `check-goal.cjs --all` under the HEAD and new checker gives identical reports over 302 goals. Cited: `.skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs:266` and `.skilled/skills/sk-doc/sk-create-goal/scripts/tests/check-goal.test.cjs:113`. | Met | - |
| AC-003 | REQ-003 | Given the two code folders, When `validate_document.py --type code_folder` runs on each README, Then both report 0 issues. | T007, T016; both 0 issues (the fixtures README with `--no-exclude`). Cited: `.skilled/skills/sk-doc/sk-create-goal/scripts/README.md:10` and `.skilled/skills/sk-doc/sk-create-goal/scripts/tests/fixtures/README.md:9`. | Met | - |
| AC-004 | REQ-004 | Given the mode after the change, When its files and the hub router are searched, Then `references/README.md` is gone and nothing live links to it. | T008; `rg -n 'sk-create-goal/references/README'` over `.skilled`, `.hermes`, `.claude`, `.codex`, `.pi` and `.cursor` finds nothing, and the fallback resource moved. Cited: `.skilled/skills/sk-doc/sk-create-goal/SKILL.md:59` and `.skilled/skills/sk-doc/ROUTER.md:263`. | Met | - |
| AC-005 | REQ-005 | Given the changed hub resources, When the sk-doc route is republished, Then the guard, verify, status, kill-switch, admission and canary gates pass and finalize exits 0. | T011, T015; guard fresh, canary 22 of 22, sk-doc admission `pass`, finalize exit 0. Cited: `.skilled/skills/sk-doc/leaf-manifest.json:105`. | Met | - |
| AC-006 | REQ-006 | Given the template workflow, When the contract surfaces and the parent goal are read, Then each starts goals from the kind template and D2 says the same. | T009, T012; no workflow step still names the inline renderer, and the playbook package passes. Cited: `.skilled/skills/sk-doc/sk-create-goal/SKILL.md:105` and `specs/sk-doc/060-create-goal-mode/goal.md:50`. | Met | - |
| AC-007 | REQ-007 | Given the release, When the version and changelog are checked, Then the mode reads 1.1.0.0 and the changelog passes the shape checker with 0 errors. | T010, T016; shape checker 0 errors, HVR 0 hard blockers, validator 0 issues. Cited: `.skilled/skills/sk-doc/sk-create-goal/changelog/v1.1.0.0.md:3`. | Met | - |

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

All seven criteria are `Met` with observed evidence. The parity test and the checker change carried the phase; rewriting the v1.0.0.0 changelog and adding an Overview to the workflow reference were left out of scope.
<!-- /ANCHOR:closure -->

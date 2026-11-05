---
title: "Acceptance Criteria: Phase 3: templates-and-fleet"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "templates and fleet acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/066-skill-readability-refinement/014-sk-create-skill-refinements/003-templates-and-fleet"
    last_updated_at: "2026-11-05T06:39:44Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "014-planning"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 3: templates-and-fleet

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill the packet id, the level, the status and the date. GOOD: `004-rotate-logs-keep`. Level 1. Draft. 2026-10-24. WEAK: Packet TBD. -->

**Packet:** sk-doc/066-skill-readability-refinement/014-sk-create-skill-refinements/003-templates-and-fleet
**Level:** 3
**Status:** Draft
**Date:** 2026-11-05
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA
<!-- FILL: Write one row per requirement. The Then clause names a command. GOOD: AC-001: When `--keep 3` runs, Then `ls logs/archive | wc -l` prints 3. WEAK: The feature works. -->

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the changed templates, When `python3 .skilled/skills/sk-doc/shared/scripts/validate_document.py` runs on `skill-reference-template.md` and on `skill-asset-template.md`, Then each prints `Total issues: 0` | command output in `goal.md` section 4 | Unmet | - |
| AC-002 | REQ-002 | Given the final tree, When `rg -n "^## 1\. AT A GLANCE" .skilled/skills --glob 'README.md' --glob '*readme-template.md'` runs, Then it prints nothing | command output | Unmet | - |
| AC-003 | REQ-003 | Given the final state, When `python3 -c "import sys;sys.path.insert(0,'.skilled/skills/sk-doc/sk-create-skill/scripts');import package_skill as p;print(p.RENDER_STAGED_CODES,p.RENDER_STAGED_SCOPES)"` and `python3 -c "import json;print(json.load(open('.skilled/skills/sk-doc/sk-create-skill/scripts/render-known-debt.json'))['debt'])"` run, Then the first prints `() ()` and the second prints `{}` | command output | Unmet | - |
| AC-004 | REQ-003 | Given each skill commit in the phase, When `python3 .skilled/skills/sk-doc/shared/scripts/doc-rewrite-guard.py --base <phase start sha>` runs on its changed docs, Then it reports no hard finding, and the run is logged per skill | guard output per skill in `goal.md` section 4 | Unmet | - |
| AC-005 | REQ-004 | Given the templates, When `rg -n "same as intro" .skilled/skills/sk-doc/sk-create-skill/assets/skill/skill-reference-template.md .skilled/skills/sk-doc/sk-create-skill/assets/skill/skill-asset-template.md` runs, Then it prints nothing | command output | Unmet | - |
| AC-006 | REQ-005 | Given the readme rules, When `python3 -c "import json;print(json.load(open('.skilled/skills/sk-doc/shared/assets/template-rules.json'))['documentTypes']['readme'].get('renderChecks'))"` runs, Then it prints `True` (today `None`), and a fixture whose WHAT IS IN THE PACKAGE section is a flat list fires the inventory check | command output and pytest case | Unmet | - |
| AC-007 | REQ-006 | Given the SKILL.md template, When `grep -cE '^\\?## [0-9]+\. REFERENCES' .skilled/skills/sk-doc/sk-create-skill/assets/skill/skill-md-template.md` runs, Then it prints `2`, and the scaffold template's last H2 carries the same REFERENCES name | command output | Unmet | - |
| AC-008 | REQ-007 | Given the size rules, When `rg -n "800 words" .skilled/skills/sk-doc/sk-create-skill/references/skill/creation-workflow.md` runs, Then it prints nothing, and the drift test that compares the size table with `package_skill.py` passes | command output and test output | Unmet | - |
| AC-009 | REQ-008 | Given the 80 references without `### Purpose`, When the T002 list under `scratch/` is read, Then each doc carries a verdict, fixed or frozen with its inbound reference | artifact under `scratch/` | Unmet | - |
| AC-010 | REQ-003 | Given the final state, When `bash .skilled/skills/sk-doc/scripts/tests/run-script-tests.sh` runs, Then its last line is `all sk-doc script tests passed`, and `node --test .skilled/skills/sk-doc/sk-create-skill/scripts/tests/*.test.cjs` reports `fail 0` | command output | Unmet | - |
| AC-011 | REQ-003 | Given empty staged sets, When `for s in .skilled/skills/*/; do python3 .skilled/skills/sk-doc/sk-create-skill/scripts/package_skill.py "$s" --check --strict >/dev/null 2>&1; rc=$?; echo "$(basename "$s") exit=$rc"; done` runs, Then it prints `exit=0` for all 13 skills, and the same loop without the redirect prints no `render advisory:` line | command output | Unmet | - |
| AC-012 | REQ-003 | Given the final state, When `node --test .skilled/bin/tests/compiled-route-*.test.cjs` runs, Then it reports `fail 0` | command output | Unmet | - |
| AC-013 | REQ-003 | Given the packet, When `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-doc/066-skill-readability-refinement/014-sk-create-skill-refinements --recursive --strict` runs, Then it prints `RESULT: PASSED` for the parent and all three children | command output | Unmet | - |

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

**Closeable:** No

The phase is planned and no criterion is met yet.
<!-- /ANCHOR:closure -->

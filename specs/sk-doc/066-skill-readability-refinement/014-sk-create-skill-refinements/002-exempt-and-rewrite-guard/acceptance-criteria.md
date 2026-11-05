---
title: "Acceptance Criteria: Phase 2: exempt-and-rewrite-guard"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "exempt and rewrite guard acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/066-skill-readability-refinement/014-sk-create-skill-refinements/002-exempt-and-rewrite-guard"
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
# Acceptance Criteria: Phase 2: exempt-and-rewrite-guard

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill the packet id, the level, the status and the date. GOOD: `004-rotate-logs-keep`. Level 1. Draft. 2026-10-24. WEAK: Packet TBD. -->

**Packet:** sk-doc/066-skill-readability-refinement/014-sk-create-skill-refinements/002-exempt-and-rewrite-guard
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
| AC-001 | REQ-001 | Given the final tree, When `rg -n -e "FORMAT_SPEC_FILES = " -e "def load_render_exempt" .skilled/skills/sk-doc` runs, Then it prints nothing, and `rg -n` for the loader's name in `validate_document.py`, `package_skill.py` and `scope-gate.py` prints a call in each | command output in `goal.md` section 4 | Unmet | - |
| AC-002 | REQ-002 | Given a ledger copy whose exempt map names a missing doc, and another whose consumer does not contain the doc's name, When the loader runs on each, Then each exits non-zero and names the bad key | pytest case | Unmet | - |
| AC-003 | REQ-003 | Given the ledger, When `python3 -c "import json;print(sorted(json.load(open('.skilled/skills/sk-doc/sk-create-skill/scripts/render-known-debt.json'))['pinned']))"` runs, Then it lists `sk-code/shared/references/universal/code-quality-standards.md` and `sk-code/sk-code-review/references/review-core.md` | command output | Unmet | - |
| AC-004 | REQ-003 | Given a one-line edit to a pinned doc, When `python3 .skilled/skills/sk-doc/shared/scripts/doc-rewrite-guard.py --base HEAD <that doc>` runs, Then it exits 1 naming the pinned rule, and `validate_document.py` on that doc still runs its render checks | pytest case | Unmet | - |
| AC-005 | REQ-004 | Given one bad and one good pair per hard check, When the guard runs on each pair, Then every bad pair exits 1 naming its rule and every good pair exits 0 | pytest cases | Unmet | - |
| AC-006 | REQ-005 | Given the T001 base with `specs/sk-doc/066-skill-readability-refinement/013-system-spec-kit/scratch/diff-1.patch` applied, When the guard runs with that base, Then its output names `.skilled/skills/system-spec-kit/shared/parsing/README.md`, and on an unchanged tree it prints no finding and exits 0 | pytest replay case | Unmet | - |
| AC-007 | REQ-006 | Given the exempt map, When `python3 .skilled/skills/sk-doc/shared/scripts/validate_document.py .skilled/skills/system-deep-loop/deep-research/assets/deep-research-dashboard.md` runs, Then each finding it prints for that doc names the consumer that exempts it | command output | Unmet | - |
| AC-008 | REQ-007 | Given the advisory pinned scan, When it runs over `.skilled`, Then it lists both pinned docs and exits 0 | command output | Unmet | - |
| AC-009 | REQ-008 | Given the workflow docs, When `rg -n "doc-rewrite-guard.py" .skilled/skills/sk-doc/sk-create-skill/references/skill/examples-and-maintenance.md .skilled/skills/sk-doc/sk-create-skill/references/skill/creation-workflow.md` runs, Then it prints at least one line per file | command output | Unmet | - |
| AC-010 | REQ-001 | Given the final state, When `bash .skilled/skills/sk-doc/scripts/tests/run-script-tests.sh` runs, Then its last line is `all sk-doc script tests passed`, and `node --test .skilled/skills/sk-doc/sk-create-skill/scripts/tests/*.test.cjs` reports `fail 0` | command output | Unmet | - |
| AC-011 | REQ-001 | Given the final state, When `for s in .skilled/skills/*/; do python3 .skilled/skills/sk-doc/sk-create-skill/scripts/package_skill.py "$s" --check --strict >/dev/null 2>&1; rc=$?; echo "$(basename "$s") exit=$rc"; done` runs, Then it prints `exit=0` for all 13 skills | command output | Unmet | - |
| AC-012 | REQ-001 | Given the final state, When `node --test .skilled/bin/tests/compiled-route-*.test.cjs` runs, Then it reports `fail 0` | command output | Unmet | - |
| AC-013 | REQ-004 | Given the packet, When `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-doc/066-skill-readability-refinement/014-sk-create-skill-refinements/002-exempt-and-rewrite-guard --strict` runs, Then it prints `RESULT: PASSED` | command output | Unmet | - |

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

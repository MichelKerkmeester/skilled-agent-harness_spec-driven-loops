---
title: "Acceptance Criteria: Phase 1: render-checks-and-gate"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "render checks and gate acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/066-skill-readability-refinement/014-sk-create-skill-refinements/001-render-checks-and-gate"
    last_updated_at: "2026-11-05T06:39:43Z"
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
# Acceptance Criteria: Phase 1: render-checks-and-gate

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill the packet id, the level, the status and the date. GOOD: `004-rotate-logs-keep`. Level 1. Draft. 2026-10-24. WEAK: Packet TBD. -->

**Packet:** sk-doc/066-skill-readability-refinement/014-sk-create-skill-refinements/001-render-checks-and-gate
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
| AC-001 | REQ-001 | Given a reference fixture whose OVERVIEW lacks `### Purpose`, When `python3 .skilled/skills/sk-doc/shared/scripts/validate_document.py <fixture> --json` runs, Then the output names `render_overview_subsections`, and the fixed copy names it nowhere | pytest case under `.skilled/skills/sk-doc/scripts/tests/` | Unmet | - |
| AC-002 | REQ-002 | Given the sk-create-skill docs, When `rg -n "validate_skill_package.py <" .skilled/skills/sk-doc/sk-create-skill/SKILL.md .skilled/skills/sk-doc/sk-create-skill/README.md .skilled/skills/sk-doc/sk-create-skill/references/skill/creation-workflow.md` runs, Then every printed command line ends in `--strict`, and `rg -n "frontmatter only" .skilled/skills/sk-doc/sk-create-skill/references/skill/creation-workflow.md` prints nothing | command output in `goal.md` section 4 | Unmet | - |
| AC-003 | REQ-003 | Given a fixture skill with one render finding each in `SKILL.md`, `ROUTER.md`, `shared/references/` and `runtime/references/`, When `python3 .skilled/skills/sk-doc/sk-create-skill/scripts/package_skill.py <fixture> --check --json` runs, Then it lists all four findings | pytest case | Unmet | - |
| AC-004 | REQ-004 | Given the workflow file, When `rg -n "package_skill.py" .github/workflows/sk-doc-script-tests.yml` runs, Then it prints the fleet sweep step | command output | Unmet | - |
| AC-005 | REQ-005 | Given ledger and staged-set copies with a debt entry added, an exempt key added, or a staged code or scope added, When `node --test .skilled/skills/sk-doc/sk-create-skill/scripts/tests/render-known-debt-ratchet.test.cjs` runs against each, Then each reports `fail 1` or more, a copy with a staged code removed passes, and the real state reports `fail 0` | test output | Unmet | - |
| AC-006 | REQ-006 | Given a fixture citing `§8 EXAMPLES` in a file whose section 8 has another title, When the validator runs, Then it names `render_section_reference`, and a correct citation clears | pytest case | Unmet | - |
| AC-007 | REQ-007 | Given fixtures with a missing intro, a pointer intro and a two-sentence intro whose second sentence copies Purpose, When the validator runs, Then it names `render_intro_missing`, `render_intro_pointer` and the restate check once each | pytest case | Unmet | - |
| AC-008 | REQ-008 | Given a fixture with `## 9. UNRELATED CHANGES` before a final `## 10. RELATED RESOURCES`, When the validator runs, Then it raises no `render_section_order` finding | pytest case | Unmet | - |
| AC-009 | REQ-009 | Given `.skilled/skills/system-deep-loop/runtime/references/integration-points.md` and a `## 1, ## 3, ## 3` fixture, When the validator runs, Then the first output no longer says `Unnumbered H2 "7.1` and the fixture reports a gap and a duplicate | command output and pytest case | Unmet | - |
| AC-010 | REQ-010 | Given a fixture SKILL.md whose only `## REFERENCES` line sits inside a fence, When `package_skill.py <fixture> --check --strict` runs, Then it exits non-zero naming the missing section | pytest case | Unmet | - |
| AC-011 | REQ-011 | Given the staged sets in force, When `for s in .skilled/skills/*/; do python3 .skilled/skills/sk-doc/sk-create-skill/scripts/package_skill.py "$s" --check --strict >/dev/null 2>&1; rc=$?; echo "$(basename "$s") exit=$rc"; done` runs, Then it prints `exit=0` for all 13 skills, staged findings print as `render advisory:` warnings in the unredirected output, and `python3 -c "import json;print(json.load(open('.skilled/skills/sk-doc/sk-create-skill/scripts/render-known-debt.json'))['debt'])"` prints `{}` | command output in `goal.md` section 4 | Unmet | - |
| AC-012 | REQ-001 | Given the final state, When `bash .skilled/skills/sk-doc/scripts/tests/run-script-tests.sh` runs, Then its last line is `all sk-doc script tests passed` | command output | Unmet | - |
| AC-013 | REQ-005 | Given the final state, When `node --test .skilled/skills/sk-doc/sk-create-skill/scripts/tests/*.test.cjs` runs, Then it reports `fail 0` | command output | Unmet | - |
| AC-014 | REQ-011 | Given the final state, When `node --test .skilled/bin/tests/compiled-route-*.test.cjs` runs, Then it reports `fail 0` | command output | Unmet | - |
| AC-015 | REQ-011 | Given the packet, When `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-doc/066-skill-readability-refinement/014-sk-create-skill-refinements/001-render-checks-and-gate --strict` runs, Then it prints `RESULT: PASSED` | command output | Unmet | - |
| AC-016 | REQ-012 | Given the T010 fixture skill, When `python3 .skilled/skills/sk-doc/sk-create-skill/scripts/package_skill.py <fixture> --check --strict` runs with and without `RENDER_STAGED_OFF=1`, Then it exits 0 without the switch and non-zero with it, naming the four staged findings | pytest case | Unmet | - |

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

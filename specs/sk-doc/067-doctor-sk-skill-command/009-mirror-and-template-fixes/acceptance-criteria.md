---
title: "Acceptance Criteria: Phase 9: mirror-and-template-fixes"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "mirror and template fixes acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "scaffold/009-mirror-and-template-fixes"
    last_updated_at: "2026-10-30T07:05:00Z"
    last_updated_by: "code-agent"
    recent_action: "Met every criterion and cited its evidence"
    next_safe_action: "Record the template fix in the sk-create-skill changelog, which this run could not write"
    blockers: []
    key_files:
      - ".skilled/commands/doctor/_routes.yaml"
      - ".skilled/commands/doctor/assets/doctor-runtime-mirrors.yaml"
      - ".skilled/commands/doctor/scripts/tests/doctor-runtime-mirrors-contract.test.cjs"
      - ".skilled/skills/sk-doc/sk-create-skill/assets/skill/skill-leaf-manifest-config-template.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-009-mirror-and-template-fixes"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 9: mirror-and-template-fixes

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** sk-doc/075-doctor-sk-skill-command/009-mirror-and-template-fixes
**Level:** 2
**Status:** Complete
**Date:** 2026-10-30
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the edited route and YAML, When `rg -c "sync-skills-hermes.cjs --check"` runs on both and `route-validate.sh` runs, Then each file prints 1 or more and route-validate exits 0 | `scratch/gates.txt:3`, `scratch/gates.txt:19`, baseline `scratch/before.md:26` | Met | - |
| AC-002 | REQ-002 | Given the new contract test, When it runs on the edited files and again with the YAML line removed, Then it passes and then fails | `scratch/gates.txt:53` (passes), `scratch/contract-fail-proof.md:31` and `:41` (fails) | Met | - |
| AC-003 | REQ-003 | Given the fixed template, When `rg -n "in-SKILL.md router" .skilled/skills` runs and the template is JSON-parsed, Then rg exits 1 and the parse exits 0 | `scratch/gates.txt:94`, `scratch/gates.txt:100` | Met | - |
| AC-004 | REQ-004 | Given `.hermes/` absent (a temp copy), When the route runs, Then the Hermes row prints n/a and no `.hermes/` is created | `scratch/hermes-absent-n-a.md:16` and `:19`, n/a rule asserted in `.skilled/commands/doctor/scripts/tests/doctor-runtime-mirrors-contract.test.cjs:134` | Met | - |
| AC-006 | REQ-006 | Given the edited route and YAML, When `rg -c "sync-prompts-hermes.cjs --check"` runs on both and the contract test runs with that line removed, Then each file prints 1 or more and the test fails | `scratch/gates.txt:11`, `scratch/contract-fail-proof.md:49` and `:59` | Met | - |
| AC-005 | REQ-005 | Given both fixes, When `run-all.sh` and `create-journey-proof.test.cjs` run, Then both pass | `scratch/gates.txt:69`, `scratch/gates.txt:80` | Met | - |

### Evidence

Each row's evidence is the command and what it printed, run from the worktree after both fixes
landed. The scratch files it names are in `scratch/`.

**AC-001.** `rg -c "sync-skills-hermes.cjs --check"` printed 1 for `_routes.yaml` and 1 for
`doctor-runtime-mirrors.yaml`, and `bash .skilled/commands/doctor/scripts/route-validate.sh`
exited 0 with `OK: route-validate — 18 routes validated, 3 warnings` and `all 46 route script
invocations are invoked by their workflow YAML`, up from 44. Before the change the same `rg -c`
exited 1 with no output, which `scratch/before.md` records.

**AC-002.** `node --test .skilled/commands/doctor/scripts/tests/doctor-runtime-mirrors-contract.test.cjs`
read 7 tests, 7 passed, exit 0. Each removal was run against a copy: dropping the skills line from
the route or the workflow copy, and dropping the prompts line from either copy, each failed the run
with exit 1. All four runs are in `scratch/contract-fail-proof.md`.

**AC-003.** `rg -n "in-SKILL.md router" .skilled/skills` printed nothing and exited 1. The same file
parsed with `JSON.parse` and exited 0 with the seven keys unchanged: `_template`, `workflowMode`,
`packet`, `leafRoots`, `excludeIndexFiles`, `resourceContractVersion`, `_note`.

**AC-004.** This one is met at the test level, not by a live route run, because no runtime was
attached to this run. Both Hermes steps carry the n/a rule and the never-create clause, and the
contract test asserts both, so removing either sentence fails the suite. The observable half is that
the check form does not create the tree: pointed at an absent output root, `sync-skills-hermes.cjs
--check` reported 65 drifted copies, exited 1, and left the directory absent
(`scratch/hermes-absent-n-a.md`). The row itself is rendered by the presentation at run time, which
this packet could not exercise.

**AC-006.** `rg -c "sync-prompts-hermes.cjs --check"` printed 1 for both files, and removing that
line from either copy failed the contract test with exit 1 (`scratch/contract-fail-proof.md`).

**AC-005.** `bash .skilled/commands/doctor/scripts/tests/run-all.sh` passed 7 suites with 0 failed
and 555 node tests, and `node --test .skilled/skills/sk-doc/sk-create-skill/scripts/tests/create-journey-proof.test.cjs`
passed its one test, which reads the template it now points at the sibling `ROUTER.md`.

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

Every criterion is `Met`, and each one's evidence is the command output recorded in section 2.
`CHK-041` in `tasks.md` closed with them: the `sk-create-skill` changelog entry for the template fix
was outside this run's write authority, `007-docs-and-changelogs` wrote it, and the row now cites
that entry.
<!-- /ANCHOR:closure -->

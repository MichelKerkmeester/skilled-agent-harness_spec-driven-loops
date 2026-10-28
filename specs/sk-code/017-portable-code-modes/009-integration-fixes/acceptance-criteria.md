---
title: "Acceptance Criteria: Integration fixes: doctor quality shows applied rules, implement dashboard uses runner verdicts, outside-repository surface rules documented"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "integration fixes acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/017-portable-code-modes/009-integration-fixes"
    last_updated_at: "2026-10-28T01:30:00Z"
    last_updated_by: "implementer"
    recent_action: "Met every criterion with observed runs against the HEAD and the changed doctor script"
    next_safe_action: "Conductor wires the child into the parent phase table and commits"
    blockers: []
    key_files:
      - ".skilled/commands/doctor/scripts/sk-code-quality-config.cjs"
      - ".skilled/commands/doctor/scripts/tests/sk-code-quality-config.test.cjs"
      - ".skilled/commands/doctor/assets/doctor-sk-code-presentation.txt"
      - ".skilled/commands/speckit/assets/speckit-implement-presentation.txt"
      - ".skilled/skills/sk-code/sk-code-quality/references/quality-config.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "integration-fixes-implementer"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Integration fixes: doctor quality shows applied rules, implement dashboard uses runner verdicts, outside-repository surface rules documented

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** 009-integration-fixes
**Level:** 2
**Status:** Complete
**Date:** 2026-10-28
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a repository config that names two checklists, When `status --json` runs, Then `applies.checklists` lists the floor with seat `default` and both files with seat `repo-config` | Case `.skilled/commands/doctor/scripts/tests/sk-code-quality-config.test.cjs:273` fails against the `HEAD` script and passes against the changed one. Code: `.skilled/commands/doctor/scripts/sk-code-quality-config.cjs:294` | Met | - |
| AC-002 | REQ-002 | Given one checklist with a valid override section and one with a `floor.input-validation` row, When status runs, Then the valid rows print as `override <id> none` and `override <id> replace: <text>`, and the floor file prints `overrides REFUSED` with the linter's hard-floor reason | Same case, text assertions at `.skilled/commands/doctor/scripts/tests/sk-code-quality-config.test.cjs:273`, plus the scratch-fixture output in `implementation-summary.md`. Code: `.skilled/commands/doctor/scripts/sk-code-quality-config.cjs:428` | Met | - |
| AC-003 | REQ-003 | Given `commentHygiene.disableRules: ["task"]`, When status runs, Then `applies.hygiene.disabled` is `["hygiene.task"]` and `active` holds `hygiene.adr` and `hygiene.issue` but not `hygiene.task` | Case `.skilled/commands/doctor/scripts/tests/sk-code-quality-config.test.cjs:311` fails before and passes after. Code: `.skilled/commands/doctor/scripts/sk-code-quality-config.cjs:417` | Met | - |
| AC-004 | REQ-004 | Given a config that names a canary command, When status, check and init run, Then no file changes and the canary never runs | Case `.skilled/commands/doctor/scripts/tests/sk-code-quality-config.test.cjs:150` passes, with the restated one-process assertion. The init cases from `.skilled/commands/doctor/scripts/tests/sk-code-quality-config.test.cjs:65` pass unchanged. Code: `.skilled/commands/doctor/scripts/sk-code-quality-config.cjs:267` | Met | - |
| AC-005 | REQ-005 | Given the implement presentation, When the dashboard renders, Then `Quality gate:` offers only `not-run` and the runner's gate values | `.skilled/commands/speckit/assets/speckit-implement-presentation.txt:76` reads `[not-run\|NO_BLOCKER_FOUND\|BLOCKED\|UNVERIFIED\|NOTHING_CHECKED\|ERROR]`, and the speckit contract test passes 5 of 5 | Met | - |
| AC-006 | REQ-006 | Given a config that names a missing checklist, When status runs, Then it exits 1 with `STATUS=FAIL SOURCE="repo" TRUST=none ERROR=CHECKLIST_MISSING`, and an invalid config reports `applies.resolved` false and `applies.hygiene` null | Case `.skilled/commands/doctor/scripts/tests/sk-code-quality-config.test.cjs:323` fails before and passes after. Code: `.skilled/commands/doctor/scripts/sk-code-quality-config.cjs:519` | Met | - |
| AC-007 | REQ-007 | Given the quality docs, When a reader looks for how an external repository declares rules, Then both docs state that declarations are read only from the hub that holds the runner and show `checklists[]` with a `## Rule overrides` section | `.skilled/skills/sk-code/sk-code-quality/SKILL.md:126`, `.skilled/skills/sk-code/sk-code-quality/references/quality-config.md:84` and `:200`, `validate_document.py` 0 issues on both | Met | - |
| AC-008 | REQ-008 | Given the changed files, When the doctor suites, route validation and the setup battery run, Then all pass | `node --test` over every doctor suite: 491 of 491, among them `.skilled/commands/doctor/scripts/tests/sk-code-quality-config.test.cjs:150`. `route-validate.sh`: OK. `sk-code-setup-check.cjs`: `STATUS=OK legs=9` | Met | - |
| AC-009 | REQ-009 | Given a repository config naming a checklist with a floor override and one with valid rows, When a run reaches them, Then it exits 3 with one `CONFIG_INVALID` row naming `checks/floor.md` and the hard-floor reason, and with only the valid file the envelope reads `override review.function-length replace from checks/valid.md, override hygiene.task none from checks/valid.md, PENDING_AGENT_JUDGMENT` | Cases `.skilled/skills/sk-code/sk-code-quality/scripts/tests/quality-gate.test.cjs:892` and `.skilled/skills/sk-code/sk-code-quality/scripts/tests/quality-gate.test.cjs:907` fail against the `HEAD` runner and pass against the changed one. Code: `.skilled/skills/sk-code/sk-code-quality/scripts/quality-gate.cjs:2557` and `.skilled/skills/sk-code/sk-code-quality/scripts/quality-gate.cjs:2749`. Runner suite 143 of 143 | Met | - |
| AC-010 | REQ-010 | Given a reached checklist whose section the linter refuses, When status runs, Then it exits 1 with `STATUS=FAIL SOURCE="repo" TRUST=none ERROR=CONFIG_INVALID` | Case `.skilled/commands/doctor/scripts/tests/sk-code-quality-config.test.cjs:273` fails against the previous doctor script and passes now. Code: `.skilled/commands/doctor/scripts/sk-code-quality-config.cjs:362` | Met | - |
| AC-011 | REQ-011 | Given a row for `src/a/b/deep/**` the sample cannot reach, When status runs, Then it lists the row as declared and not reached, passes with a valid file, fails `CONFIG_INVALID` with a floor row and fails `CHECKLIST_MISSING` with no file | Case `.skilled/commands/doctor/scripts/tests/sk-code-quality-config.test.cjs:379` fails before and passes after. Code: `.skilled/commands/doctor/scripts/sk-code-quality-config.cjs:390` | Met | - |
| AC-012 | REQ-012 | Given a trusted config with a canary command, When status, check and init run, Then each reports `TRUST=trusted`, the canary never runs and `RUNNER` ends in `sk-code-quality/scripts/quality-gate.cjs` | Case `.skilled/commands/doctor/scripts/tests/sk-code-quality-config.test.cjs:150` fails against the previous doctor script, which did not export `RUNNER`, and passes now | Met | - |
| AC-013 | REQ-013 | Given a repository checklist with a `review.function-lenght` row the linter accepts, When a run loads it, Then the run exits 3 with one `CONFIG_INVALID` row naming the file, the line and the id, and the doctor status fails `CONFIG_INVALID` too | Case `.skilled/skills/sk-code/sk-code-quality/scripts/tests/quality-gate.test.cjs:937` and case `.skilled/commands/doctor/scripts/tests/sk-code-quality-config.test.cjs:342` each fail against the round-one code and pass now. Code: `.skilled/skills/sk-code/sk-code-quality/scripts/quality-gate.cjs:2557`, `.skilled/skills/sk-code/shared/scripts/lib/rule-registry.cjs:138`, `.skilled/commands/doctor/scripts/sk-code-quality-config.cjs:346` | Met | - |
| AC-014 | REQ-014 | Given two repository checklists that give `review.function-length` a different action for `src/a.go`, When a run reaches it, Then `rule_conflicts` names both files, neither row applies, `summary.unverified` holds the rule, the gate reads `UNVERIFIED`, exit 4, and the decisions read `override hygiene.task none from checks/valid.md, override-conflict review.function-length checks/valid.md checks/other.md, PENDING_AGENT_JUDGMENT`. Two rows with the same action agree, and a repository row outranks a SKILLED one with no conflict | Cases `.skilled/skills/sk-code/sk-code-quality/scripts/tests/quality-gate.test.cjs:956` and `.skilled/skills/sk-code/sk-code-quality/scripts/tests/quality-gate.test.cjs:997` fail against the round-one runner and pass now. Code: `.skilled/skills/sk-code/sk-code-quality/scripts/quality-gate.cjs:2614`, `.skilled/skills/sk-code/sk-code-quality/scripts/quality-gate.cjs:2597`, `.skilled/skills/sk-code/sk-code-quality/scripts/quality-gate.cjs:2152` | Met | - |
| AC-015 | REQ-015 | Given the declaring documents, When the registry suite runs, Then a row added to a table is known at once, a missing section throws, the floor and review tables match the contract's fixed list, and every override row under the skills folder names a known id | `.skilled/skills/sk-code/shared/scripts/tests/rule-registry.test.cjs:101`, `.skilled/skills/sk-code/shared/scripts/tests/rule-registry.test.cjs:129` and `.skilled/skills/sk-code/shared/scripts/tests/rule-registry.test.cjs:151` pass, and the file fails with the module absent | Met | - |
| AC-016 | REQ-016 | Given two repository checklists that give `review.function-length` a different action for the files they share, When `--explain` names one of them and the doctor status runs, Then the explain entry's `rule_conflicts` is `[{id: 'review.function-length', files: [both checklists]}]`, a file outside them reads `[]`, and the status prints `override-conflict review.function-length .sk-code/checklists/house.md .sk-code/checklists/other.md (neither row applies, so the gate reads UNVERIFIED for src/app.js)` with `STATUS=OK` | Cases `.skilled/skills/sk-code/sk-code-quality/scripts/tests/quality-gate.test.cjs:977` and `.skilled/commands/doctor/scripts/tests/sk-code-quality-config.test.cjs:357` fail before the change (`fail 2`) and pass after. Code: `.skilled/skills/sk-code/sk-code-quality/scripts/quality-gate.cjs:2645`, `.skilled/skills/sk-code/sk-code-quality/scripts/quality-gate.cjs:2681`, `.skilled/commands/doctor/scripts/sk-code-quality-config.cjs:294`, `.skilled/commands/doctor/scripts/sk-code-quality-config.cjs:519` | Met | - |
| AC-017 | REQ-017 | Given a scratch copy of the declaring documents, When a review row loses its backticks or the hygiene template is reworded, Then the registry throws with the file and the row's line | Case `.skilled/skills/sk-code/shared/scripts/tests/rule-registry.test.cjs:115` fails against the round-two registry (`Missing expected exception`) and passes now. Code: `.skilled/skills/sk-code/shared/scripts/lib/rule-registry.cjs:82`, `.skilled/skills/sk-code/shared/scripts/lib/rule-registry.cjs:98` | Met | - |
| AC-018 | REQ-018 | Given the quality docs, When a reader looks up `UNVERIFIED` or the envelope's `unverified` field, Then both name the conflicting rule id beside the check id | `.skilled/skills/sk-code/sk-code-quality/SKILL.md:192` and `.skilled/skills/sk-code/sk-code-quality/references/runner-contract.md:210` carry the reviewer's text, and `validate_document.py` reports 0 issues | Met | - |

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

Every criterion is met with an observed run, and the conductor still wires this child into the parent's phase table at landing.
<!-- /ANCHOR:closure -->

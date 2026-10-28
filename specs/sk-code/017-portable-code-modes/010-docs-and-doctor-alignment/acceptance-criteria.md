---
title: "Acceptance Criteria: Align docs, playbooks, catalogs and doctor text with the shipped portable quality and review behavior"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "docs and doctor alignment acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/017-portable-code-modes/010-docs-and-doctor-alignment"
    last_updated_at: "2026-10-28T05:30:00Z"
    last_updated_by: "implementer"
    recent_action: "Met every criterion with observed runs against the changed tree and an origin/main archive"
    next_safe_action: "Conductor merges and commits"
    blockers: []
    key_files:
      - ".skilled/skills/sk-code/sk-code-review/manual-testing-playbook/foreign-repository-rules/"
      - ".skilled/skills/sk-code/sk-code-quality/manual-testing-playbook/quality-gate/disabled-hygiene-rules.md"
      - ".skilled/skills/sk-code/feature-catalog/quality-gate/rule-overrides-and-hygiene-policy.md"
      - ".skilled/commands/doctor/assets/doctor-sk-code-presentation.txt"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "docs-and-doctor-alignment-implementer"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Align docs, playbooks, catalogs and doctor text with the shipped portable quality and review behavior

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill the packet id, the level, the status and the date. GOOD: `004-rotate-logs-keep`. Level 1. Draft. 2026-10-24. WEAK: Packet TBD. -->

**Packet:** `010-docs-and-doctor-alignment`
**Level:** 2
**Status:** Complete (round A)
**Date:** 2026-10-28
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA
<!-- FILL: Write one row per requirement. The Then clause names a command. GOOD: AC-001: When `--keep 3` runs, Then `ls logs/archive | wc -l` prints 3. WEAK: The feature works. -->

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the 23 rows of the stale-claim table, When each owner doc is searched for the old and the new wording, Then every new phrase is present and every stale one is gone | The phrase probes in `tasks.md` T006 to T020, for example `Rule sources` in the review README 0 then 9 and `will call` in the shared README 1 then 0 | Met | - |
| AC-002 | REQ-001 | Given the changed docs, When they are read for what a quality run does with `## Rule overrides` rows, Then each states it as shipped: a refused section or unknown id is `CONFIG_INVALID` exit 3, accepted rows are recorded, a same-level conflict is unverified | `rg -n "CONFIG_INVALID" ` over the quality README, the scripts README, `rule-overrides.md` and the catalog leaf finds the statement in each; no sentence says a run ignores the rows | Met | - |
| AC-003 | REQ-002 | Given the review playbook, When it is validated, Then it holds 37 scenarios in 11 categories with CR-029, CR-030 and CR-031 added and CR-001 to CR-028 unchanged | `validate-playbook-package.cjs --package .skilled/skills/sk-code/sk-code-review/manual-testing-playbook` printed `scenarios=37 categories=11 violations=0 warnings=0`; it printed `scenarios=34 categories=10` at `HEAD` | Met | - |
| AC-004 | REQ-002 | Given the quality and sk-code-ci playbooks, When they are validated, Then the quality one holds CQ-012 and CQ-013 with no warning beyond the 11 at `HEAD`, and the sk-code-ci one holds 2 scenarios | `validate-playbook-package.cjs --package .skilled/skills/sk-code/sk-code-quality/manual-testing-playbook` printed `violations=0` and 11 warnings, the same as at `HEAD`; the sk-code-ci package printed `scenarios=2 categories=2 violations=0 warnings=0` | Met | - |
| AC-005 | REQ-002 | Given each new scenario, When its commands are replayed, Then the output equals the expected block | CQ-012 and CQ-013 replayed in this tree after the rebase with the printed lines equal to the docs; the CI scenario replayed with its mocked `gh`; the three review scenarios backed by live `@review` runs whose reports pass `check-review-final-line.js` and `check-review-findings.js` with exit 0 | Met | - |
| AC-006 | REQ-003 | Given every changed or new document, When `validate_document.py --json` runs, Then `total_issues` is 0 | A loop over the 64 docs changed since `origin/main` printed 0 issues for 63 and one `document_type_fallback` for `ROUTER.md`, which reads 0 issues with `--type reference` | Met | - |
| AC-007 | REQ-003 | Given the feature catalog, When `validate_catalog_package.py` runs, Then it passes | `validate_catalog_package.py --package sk-code --json` printed `"clean": true`, `"verdict": "PASS"`, `violationCount` 0, exit 0 | Met | - |
| AC-008 | REQ-004 | Given the final state, When the setup battery runs, Then it prints `STATUS=OK` | `node .skilled/commands/doctor/scripts/sk-code-setup-check.cjs` printed 9 `PASS` legs and `STATUS=OK legs=9`, exit 0; it printed `FAIL drift-guards` at baseline | Met | - |
| AC-009 | REQ-004 | Given the doc-claims guard, When it runs, Then it passes | `node .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-doc-claims.cjs` printed `doc-claims: 3/4 checks passed` with one unresolved path in the quality playbook, then `doc-claims: 4/4 checks passed`, exit 0, after the path was corrected | Met | - |
| AC-010 | REQ-004 | Given the canary and its suite, When they run, Then both pass | `check-rule-copies.js` exit 0 `OK`; `check-rule-copies.test.sh` printed `All rule-canary test cases passed`, exit 0 | Met | - |
| AC-011 | REQ-004, REQ-011 | Given the README checkers, When they run on every changed README, Then both pass | `check_readme_references.py` and `check_derived_readme_counts.py` over the 14 changed READMEs printed `SUMMARY files=14 pass=14 fail=0` each, exit 0; four of them failed at `ebc6392141` | Met | - |
| AC-012 | REQ-004 | Given the Hermes copies, When `--check` runs, Then it passes | `sync-skills-hermes.cjs --check` printed `PASS: 67 Hermes skill copies in sync`, exit 0 | Met | - |
| AC-013 | REQ-005 | Given the four skills and modes touched, When each changelog is validated, Then it has 0 issues and sits above both versions | `validate_document.py --json` `total_issues` 0 on v3.9.14.0, v1.13.8.0, v1.9.7.0 and v2.1.9.0; the carriers read 3.9.14.0, 1.13.8.0, 1.9.7.0 and 2.1.9.0 | Met | - |
| AC-014 | REQ-006 | Given the doctor, hook and CI texts, When they are read, Then they name `commentHygiene.disableRules` and the init suggestion | `commentHygiene` read 0 then 1 in both hook READMEs; `Hygiene:` 0 then 2 and `Suggested, not written` 0 then 1 in the presentation; the doctor suite `pass 485 fail 0` | Met | - |
| AC-015 | REQ-007 | Given the judgment calls, When `implementation-summary.md` is read, Then each is recorded with its reason | `implementation-summary.md` Key Decisions lists seven calls | Met | - |
| AC-016 | REQ-008 | Given the docs that described `/doctor:ci` without the profile, When the phrase probes run, Then the profile is described and no doc calls six names the only switches | `CI profile` in the sk-code-ci README 0 to 4; `six switch variables` in the catalog root 1 to 0; `six documented` in the DOC-394 scenario 3 to 0 | Met | - |
| AC-017 | REQ-008 | Given the sk-code-ci playbook, When `ci-foreign-repository-profile` is replayed, Then the report reads the stub's switches with no flag, the scaffold prints no Skilled text and the toggle accepts `ACME_CI_TESTS` and refuses `ACME_CI_GATE`, `ACME_CI` and `SKILLED_CI_TESTS` | The replay printed `profile default`, `errors 0`, `flags none` on three workflows, scaffold count `0`, the plan and three `REFUSE:` lines with exit 1, and `0` write calls | Met | - |
| AC-018 | REQ-009 | Given CQ-012 and CQ-013, When they run in this tree, Then their output equals the expected blocks | Both replayed with every printed line equal; CQ-012 now includes the decisions line | Met | - |
| AC-019 | REQ-010 | Given the doctor presentation, When compared with `sk-code-quality-config.cjs status`, Then each hygiene fact appears once, as printed | `grep -c "^Hygiene"` read 3 then 2; the status printed one `Hygiene:` line and one `Hygiene rules:` line | Met | - |

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

Every row is Met; the only open items are merge reconciliations with `origin/main` and the round B documents, and none is a criterion of this child.
<!-- /ANCHOR:closure -->

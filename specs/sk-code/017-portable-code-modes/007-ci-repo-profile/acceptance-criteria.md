---
title: "Acceptance Criteria: CI repository profile for sk-code-ci and doctor ci"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "ci repo profile acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/017-portable-code-modes/007-ci-repo-profile"
    last_updated_at: "2026-10-28T05:30:00Z"
    last_updated_by: "fixer"
    recent_action: "Met every criterion with observed runs against a HEAD copy and the worktree"
    next_safe_action: "Conductor adds the child to the parent phase table, reviews and commits"
    blockers: []
    key_files:
      - ".skilled/commands/doctor/scripts/lib/ci-profile.cjs"
      - ".skilled/commands/doctor/scripts/ci-report.cjs"
      - ".skilled/commands/doctor/scripts/ci-toggle.cjs"
      - ".skilled/commands/doctor/scripts/ci-scaffold.cjs"
      - ".sk-code/ci.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "ci-repo-profile-implementer"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: CI repository profile for sk-code-ci and doctor ci

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** `007-ci-repo-profile`
**Level:** 2
**Status:** Complete
**Date:** 2026-10-27
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given this repository, When the HEAD `ci-report.cjs` and the new one run back to back with `--json`, Then the JSON is equal apart from the added `profile` key | Live: `equal_rest True`, both name `f291d28f8ae6d0a0c6a363d147df09abef778cbb`. `--no-gh`: `equal_rest True`. `profile` is `{"source": "repo", "path": ".sk-code/ci.json"}` | Met | - |
| AC-002 | REQ-002 | Given a fixture with `ACME_CI` switches, three workflows and no profile, When the report runs, Then it reads `ACME_CI_TESTS=off` and raises no flag | `ci-report.test.cjs` "a foreign repository with no profile reads its own switch state and raises no flag": fails in the HEAD copy, passes now | Met | - |
| AC-003 | REQ-003 | Given a stubbed ruleset requiring `Required gate`, When the toggle plans `ACME_CI_GATE` off and `ACME_CI_TESTS` off, Then the first is refused and the second planned, and here the two Skilled refusal strings are unchanged | `ci-toggle.test.cjs` "the variable behind the status check the live ruleset requires is refused", "a foreign switch the workflows use is accepted" and "here the message variable and the master switch keep their refusal wording" pass; a live read-only run printed both exact strings, exit 1 | Met | - |
| AC-004 | REQ-004 | Given this repository and a gh stub, When the toggle plans `SKILLED_CI_FRESHNESS` or `SKILLED_CI_REPORTS` off, Then the plan names the protected workflows with their roles and asks a second confirmation, and the stub log holds no write | `ci-toggle.test.cjs` "here SKILLED_CI_FRESHNESS off asks for a second named confirmation" and "here SKILLED_CI_REPORTS off asks for the second confirmation" pass; both fail in the HEAD copy | Met | - |
| AC-005 | REQ-005 | Given `--profile` naming a missing file or a profile with an unknown key, When the report runs, Then it exits 3 and names the cause | `ci-report.test.cjs` "--profile reads the named file and a missing one exits 3" and "an unknown profile key exits 3 and names the key" pass | Met | - |
| AC-006 | REQ-006 | Given this repository's profile, When the renderer prints both templates, Then each equals today's file byte for byte, and a foreign render carries no Skilled name | `diff` against the HEAD templates prints nothing (`WF-IDENTICAL`, `JOB-IDENTICAL`); `ci-scaffold.test.cjs` "a foreign profile renders its own switch and branch" passes | Met | - |
| AC-007 | REQ-007 | Given the toggle, When a variable is already in the asked state, the ruleset is unreadable with `neverOff` set, or a README keeps a switch unset, Then each is refused | `ci-toggle.test.cjs` no-op, `neverOff` and README cases pass | Met | - |
| AC-008 | REQ-008 | Given the committed `.sk-code/ci.json`, When it goes missing or loses a protected entry, Then a contract test fails | `ci-profile.test.cjs` and `doctor-ci-contract.test.cjs` profile cases fail in the HEAD copy, which has no profile, and pass now | Met | - |
| AC-009 | REQ-009 | Given the three universal references, When `rg` searches them for `SKILLED_CI`, `.opencode` and `skilled/**`, Then every hit carries the Skilled example label | The filtered search prints nothing; `protected-set.md` holds the profile keys table and a `SKILLED PROFILE` section; `validate_document.py` 0 issues on all four | Met | - |
| AC-010 | REQ-010 | Given the full doctor suite and the guarded gates, When they run, Then all pass | `ci-report` plus `doctor-ci-contract` 36 of 36; `run-all.sh` `7 suite(s) passed, 0 failed`; gate-inputs `RESULT: PASSED`; trigger-index vitest `60 passed, 1 skipped` | Met | - |
| AC-011 | REQ-011 | Given sk-code-ci and sk-create-command, When their entries are validated and Hermes is checked, Then each has 0 issues, a stepped version and a synced copy | `v1.1.5.0.md` and `v1.0.6.0.md` `valid True`, 0 issues; `SKILL.md:5` reads `1.1.5.0` and `1.0.6.0`; `PASS: 67 Hermes skill copies in sync`. The sk-code-ci entry moved from 1.1.4.0 because origin/main already holds a 1.1.4.0 entry from a sibling lane | Met | - |
| AC-012 | REQ-012 | Given a foreign fixture whose ruleset read fails with no `neverOff` or README refusal, When the toggle plans `ACME_CI_GATE` off as text, Then the plan prints the not-read line before its status line, and a plan to switch on or with a readable ruleset does not | `ci-toggle.test.cjs` "a plan to switch off with an unreadable ruleset says the required-check refusal was not applied": exit 1 against a copy with the old renderer, exit 0 now | Met | - |
| AC-013 | REQ-013 | Given the route manifest, the router and the three workflows, When the contract test reads them, Then each CI route allows `--profile=<path>`, `ci.md` carries its flag row and each workflow passes it on | `doctor-ci-contract.test.cjs` "each route allows --profile=<path>, the router documents it and each workflow passes it on": exit 1 before the route edits (`report: --profile=<path> is not allowed`), exit 0 now | Met | - |

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

Every criterion is met with observed runs against a HEAD copy and the worktree.
<!-- /ANCHOR:closure -->

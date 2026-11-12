---
title: "Acceptance Criteria: Phase 2: command-inventory-and-risk-metadata"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "command inventory and risk metadata acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "scaffold/002-command-inventory-and-risk-metadata"
    last_updated_at: "2026-11-12T12:27:35Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-002-command-inventory-and-risk-metadata"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 2: command-inventory-and-risk-metadata

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** `system-skill-advisor/routing-and-scoring/008-command-surfacing-build/002-command-inventory-and-risk-metadata`
**Level:** 3+
**Status:** Complete
**Date:** 2026-11-12
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a command file with no attributes, When `--check` runs, Then it exits 1 and names the command | With `.skilled/commands/create/zz-fixture.md` present, `--check` threw `command inventory mismatch` and exited 1. After the delete it printed `fresh` | Met | - |
| AC-002 | REQ-002 | Given a metadata entry whose command has no file, When the deriver runs on the fixture, Then it fails and names the entry | `tests/command-policy-derivation.vitest.ts` case 4 passes: `/a:gone` is reported as having no command file | Met | - |
| AC-003 | REQ-003 | Given the five metadata files, When their entries are read, Then each has a valid class and target, and a bad value fails the deriver | `jq` filters printed 13, 3 and 3 for the hub files and the stated classes for the two new files. The test's reject cases pass | Met | - |
| AC-004 | REQ-004 | Given the amended contract, When the gate and its test run, Then every root passes and a wrong owner on a standalone fixture fails | Gate printed `checked=14 passed=14 failed=0 fixed=0`. The contract test exits 0 and its new case reports one owner finding for `some-other-mode` | Met | - |
| AC-005 | REQ-005 | Given the two new files, When `jq` reads them, Then they hold 7 and 1 entries with the stated owners and classes | `jq` printed 7 entries owned by `system-spec-kit` and 1 by `sk-prompt`, each with its command string as the only owned signal | Met | - |
| AC-006 | REQ-006 | Given the regenerated file, When `jq` reads it, Then `commandPolicies` covers 44 commands and entries keep six keys | `jq` printed 44 unique commands in `commandPolicies` and the six entry keys unchanged | Met | - |
| AC-007 | REQ-007 | Given the five rule inputs, When `derivePolicy` runs, Then it prints `run start ask ask run` | `derivePolicy` printed `run start ask ask run`, and the test's seven-row table passes | Met | - |
| AC-008 | REQ-008 | Given all changes, When the pinned capture, the routing slice and `npm test` run, Then the numbers are 158, 50, 20 and 5 and nothing fails | Pinned capture printed `[158,50,20,5]`. `diff` of the baseline's rows, metrics, commands and unreachable against the saved copy printed nothing. `npm test`: 163 files, 1,397 tests passed, 8 skipped | Met | - |
| AC-009 | REQ-009 | Given the doctor manifest, When the route validator runs, Then it reports OK and `/doctor:env` has `list` and `select` actions | `route-validate.sh` printed `OK: route-validate`, and `commandPolicies` holds `/doctor:env` `list` as run and `select` as ask | Met | - |
| AC-010 | REQ-010 | Given the private command file, When the generated files are searched, Then its name appears nowhere | `rg -c 'local-skilled-alignment'` over the bridges folder and `lib` found nothing, and the tree test skips `local-` names | Met | - |
| AC-011 | REQ-011 | Given the regenerated file, When counts are read, Then they are 66, 40 and 50 and `/speckit:plan` has one entry | `jq` printed `[66,40,50,23]` and one entry for `/speckit:plan` | Met | - |
| AC-012 | REQ-012 | Given `commandPolicies`, When rolled up to the strictest route per command, Then it gives 7 run, 22 start and 15 ask or each difference is explained | The rollup printed `{"ask":16,"run":7,"start":21}`. The one difference from the review is `/design:extract`, moved to ask after the workflow audit found an install and a live crawl on its main path | Met | - |
| AC-013 | REQ-013 | Given the new test file, When vitest runs it, Then the rule rows and both failures pass | `npx vitest run tests/command-policy-derivation.vitest.ts` reported 6 passed | Met | - |
| AC-014 | REQ-014 | Given the README and the contract reference, When they are searched, Then both state the new keys and rule | The bridges README has a new section 7 and the contract reference states the owner rule for registry-less roots | Met | - |

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

Every criterion is met with observed evidence from 2026-11-12.
<!-- /ANCHOR:closure -->

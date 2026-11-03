---
title: "Acceptance Criteria: Phase 1: scenario-contract"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "scenario contract acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/065-conversation-playbook-scenarios/001-scenario-contract"
    last_updated_at: "2026-11-01T21:11:38Z"
    last_updated_by: "planning-session"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "fe0c9990-06d3-454e-a8e7-7c7bc649bc49"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 1: scenario-contract

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** sk-doc/065-conversation-playbook-scenarios/001-scenario-contract
**Level:** 2
**Status:** Complete
**Date:** 2026-11-01
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one. `S` is `.skilled/skills/sk-doc/sk-create-manual-testing-playbook` and `V` is `$S/scripts/validate-playbook-package.cjs`.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the new reference `$S/references/conversation-scenarios.md`, When `rg -c "json conversation\|delay_ms\|timeout_ms\|optional\|reply\|restart\|compact"` runs on it, Then it prints 7 or more, and its schema table names every key listed in `plan.md` | T004: `rg -c` printed 15; every plan key found in the reference (implementation-summary.md:107) | Met | - |
| AC-002 | REQ-002, REQ-008 | Given `scratch/fleet-before.json` taken before any edit, When `node $V --format json` runs after the change, Then the package, violation and warning counts equal the baseline's | `fleet-before.json` and `fleet-after.json`: 56/1/93 both, findings byte-identical (implementation-summary.md:100) | Met | - |
| AC-003 | REQ-003 | Given temp copies of the clean fixture, each holding one malformed shape from REQ-003, When `node $S/scripts/tests/validate-playbook-package.test.cjs` runs, Then every such case exits 1 with `CONVERSATION_SCRIPT_INVALID` naming its field path and the suite exits 0 | Suite exit 0, `conversation script regressions: PASS (95 assertions)` (implementation-summary.md:101) | Met | - |
| AC-004 | REQ-002, REQ-003 | Given a temp copy of the clean fixture holding a valid `json conversation` block, When the validator runs on it, Then it exits 0 with no `CONVERSATION_SCRIPT_INVALID` | Suite clean case, exit 0 (implementation-summary.md:101) | Met | - |
| AC-005 | REQ-004 | Given a valid block whose first `send` differs from the contract prompt, When the validator runs, Then it reports exactly one `PROMPT_UNSYNCED` warning naming "the conversation script's first send", and a matching first send reports none | Suite prompt-sync cases, and the T009 temp copy: one `PROMPT_UNSYNCED` naming the conversation script's first send (implementation-summary.md:103) | Met | - |
| AC-006 | REQ-005 | Given the changed validator, When `node -e "const v=require('./$V'); console.log(typeof v.parseConversationScript, v.CONVERSATION_RUNTIMES.join(','))"` runs, Then it prints `function claude-code,opencode,codex,pi,devin` | Printed `function claude-code,opencode,codex,pi,devin` (implementation-summary.md:102) | Met | - |
| AC-007 | REQ-006 | Given the example in the template's Conversation Script subsection, When it is pasted into a temp copy of the clean fixture and validated, Then the run exits 0 with no `CONVERSATION_SCRIPT_INVALID` and no `PROMPT_UNSYNCED` | Temp fixture copy: exit 0, no conversation finding (implementation-summary.md:103) | Met | - |
| AC-008 | REQ-007 | Given the updated `SKILL.md`, When `rg -n "^version: 1.0.9.0$" $S/SKILL.md` runs and `$S/changelog/v1.0.9.0.md` is listed, Then both print one line, and `parent-skill-check.cjs .skilled/skills/sk-doc` passes its 13d packet-version check | `version: 1.0.9.0`, changelog present, `OK: parent-skill-check` (implementation-summary.md:106) | Met | - |
| AC-009 | REQ-009 | Given the regenerated hub manifest, When `generate-leaf-manifest.cjs --check .skilled/skills/sk-doc` runs, Then it prints `leaf-manifest.json OK`, and `rg -n "conversation-scenarios.md"` prints a line in each of `$S/ROUTER.md`, `$S/references/README.md` and `.skilled/skills/sk-doc/leaf-manifest.json` | `leaf-manifest.json OK`, one line in each of the three files (implementation-summary.md:105) | Met | - |
| AC-011 | REQ-010 | Given a valid block whose `check` greps for `BLOCKED`, holds a bare `SKIP` and an absolute path, When the validator runs, Then it reports none of `FORBIDDEN_VERDICT`, `SKIP_BLOCKER_MISSING` or `DEVELOPER_ABSOLUTE_PATH`, and a copy with `BLOCKED` outside the block still reports `FORBIDDEN_VERDICT` | Suite masking cases pass (implementation-summary.md:101) | Met | - |
| AC-012 | REQ-003 | Given the malformed-shape cases, When the suite runs, Then each case asserts its field path in the message (for example `turns[0].questions[0].answer.multi`), not only the code, and `git diff --stat` on `fixtures/clean-package` prints nothing | `expectConversationPath` asserts `message.startsWith(path + ':')` for 24 shapes; clean-package diff empty (implementation-summary.md:104) | Met | - |
| AC-010 | REQ-001 to REQ-010 | Given this phase folder, When `validate.sh specs/sk-doc/065-conversation-playbook-scenarios/001-scenario-contract --strict` runs, Then it prints `RESULT: PASSED` | `validate.sh --strict` RESULT: PASSED (implementation-summary.md:100) | Met | - |

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

Every criterion is Met, with the evidence named in its row.
<!-- /ANCHOR:closure -->

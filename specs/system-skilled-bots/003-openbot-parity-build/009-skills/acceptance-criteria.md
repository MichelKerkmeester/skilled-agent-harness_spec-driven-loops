---
title: "Acceptance Criteria: Phase 9: skills"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "skills list acceptance criteria"
  - "skill proposal acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skilled-bots/003-openbot-parity-build/009-skills"
    last_updated_at: "2026-11-25T07:13:43Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-009-skills"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 9: skills

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-skilled-bots/003-openbot-parity-build/009-skills
**Level:** 2
**Status:** Draft
**Date:** 2026-11-25
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

`R` is `.skilled/skills/system-skilled-bots/runtime` and `F` is `.skilled/skills/system-skilled-bots/scripts/fixtures`, as in `tasks.md`.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a BOT.md carrying `skills: [sk-code]`, When `parseDefinition` reads it, Then the definition carries `skills` equal to `['sk-code']`; and given a BOT.md with no `skills` key, Then it carries `[]` and its prompt is byte-identical to today's | `cd $R && npx vitest run tests/definition.vitest.ts -t 'skills'` exits 0, and `cd $R && npx vitest run tests/dispatch.vitest.ts -t 'skills'` exits 0 | Unmet | - |
| AC-002 | REQ-002 | Given a bot with `skills: [sk-code]`, When a run dispatches, Then the prompt holds the body of `.skilled/skills/sk-code/SKILL.md` inside one `<skill_content name="sk-code">` block after the standing body; and given `skills: [no-such-skill]`, Then the run is refused `skill-unknown` before dispatch and no child starts | `cd $R && npx vitest run tests/dispatch.vitest.ts -t 'skills'` exits 0, and `cd $R && npx vitest run tests/runner.vitest.ts -t 'skills'` exits 0 | Unmet | - |
| AC-003 | REQ-003 | Given one body of 40,961 bytes, When the loader reads it, Then it refuses `skill-too-large`; given a list summing to 65,537 bytes, Then it refuses `skills-over-budget` naming the skill that crossed the line; and given exactly 40,960 bytes and exactly 65,536 bytes, Then both are accepted and no body is truncated | `cd $R && npx vitest run tests/skills.vitest.ts -t 'caps'` exits 0 | Unmet | - |
| AC-004 | REQ-004 | Given a completed run record, When `bots skill propose <run-id> --name report` runs, Then `<stateRoot>/<identity>/proposals/<run-id>/SKILL.md` and `proposal.json` both exist, and the JSON names the target path, the revision read, the run id, the bot id and the creation instant | `node .skilled/bin/bots.cjs skill propose <run-id> --name report --repo $F/skills-clean` exits 0, and `jq -e '.targetPath and .revisionRead and .runId and .botId and .createdAt' <proposal.json>` exits 0 | Unmet | - |
| AC-005 | REQ-005 | Given that proposal, Then exactly one needs-you item exists whose id is the run id and whose `botId` is `skill-proposals`, and `bots inbox` lists it; given a definition whose id is `skill-proposals`, Then the checker exits 1 naming `reserved-id`; and given that open review, Then the proposing bot's next run is not held | `node .skilled/bin/bots.cjs inbox --repo $F/skills-clean` lists one item under `skill-proposals`, and `node .skilled/skills/system-skilled-bots/scripts/bot-check.cjs $F/reserved-id` exits 1 and prints `FAIL: reserved-id` | Unmet | - |
| AC-006 | REQ-006 | Given an open review whose target is unchanged, When `bots answer <run-id> accept` runs, Then the item is answered and no resume request is queued; and given a target whose digest differs from `revisionRead`, Then the answer refuses `proposal-stale` and the item stays open | `cd $R && npx vitest run tests/answer.vitest.ts -t 'proposal'` exits 0 | Unmet | - |
| AC-007 | REQ-007 | Given a checkout whose BOT.md names a skill that does not exist, Then the checker exits 1 naming `skills-unknown`; given one body over the per-skill cap, Then `skills-too-large`; given a list over the total cap, Then `skills-over-budget`; and given the clean skills fixture, Then it exits 0 | `node .skilled/skills/system-skilled-bots/scripts/bot-check.cjs $F/skills-unknown` exits 1 and prints `FAIL: skills-unknown`, the same for `$F/skills-too-large` and `$F/skills-over-budget`, and `$F/skills-clean` exits 0 | Unmet | - |
| AC-008 | REQ-008 | Given `skills: [sk-code, sk-code]`, When the definition parses, Then it refuses `skills-duplicate`; and given a name outside the skill-name grammar, Then it refuses `skills-name-invalid` | `cd $R && npx vitest run tests/skills.vitest.ts -t 'parseSkillList'` exits 0 | Unmet | - |
| AC-009 | REQ-009 | Given a run whose stdout holds a known secret literal, When `bots skill propose` runs, Then it refuses `proposal-secret` naming the key, writes neither file, and the value appears nowhere under the proposals folder | `cd $R && npx vitest run tests/skill-proposal.vitest.ts -t 'secret'` exits 0 | Unmet | - |
| AC-010 | REQ-010 | Given the shipped template, the author reference and the run mode, When each is read, Then the template carries a commented `skills` key, the reference names `skills` in its field list, and the run mode names `bots skill propose` | `rg -c 'skills' .skilled/skills/system-skilled-bots/assets/bot-template.txt` prints 1, `rg -c 'skills' .skilled/skills/system-skilled-bots/bots-author/references/bot-definition.md` prints at least 1, and `rg -c 'bots skill propose' .skilled/skills/system-skilled-bots/bots-run/SKILL.md` prints at least 1 | Unmet | - |

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

**Closeable:** No

No criterion is met yet, because this packet is the specification and no code has been written. AC-001 is the first that must be met, since every other row reads the definition it produces.
<!-- /ANCHOR:closure -->

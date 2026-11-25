---
title: "Goal: Phase 6: approval-grants"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "packet goal"
  - "durable directive"
  - "completion criteria"
  - "goal binding"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-skilled-bots/003-openbot-parity-build/006-approval-grants"
    last_updated_at: "2026-11-25T19:58:00Z"
    last_updated_by: "create-goal"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "w3-006-approval-grants"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: Phase 6: approval-grants

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Give every needs-you item a grant that names the kind of action it approves, the rung of OpenBot's precedence ladder that made the bot ask and the scope the answer granted, with the ladder written as a doc and applied at the needs-you gate.

**Parent goal:** `../goal.md` binds this phase, and its decisions outrank this file's detail.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The grant is one object on the item, holding `kind`, `action`, `rung`, `scope`, `grantedBy` and `grantedAt`, and its `scope` is written in the same write as 001's answer, so the two cannot disagree [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/spec.md:153]. |
| D2 | `classifyAction` reads the whole question and tests `pay`, `credentials`, `delete`, `send`, `share` and `post` in that order, so a payment that also deletes reads as `pay`, and a bot's `[ACTION: <kind>]` line is a floor rather than an override [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/spec.md:154] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/spec.md:169]. |
| D3 | `decideApproval` implements rung 1 and the `bot` fallback only, and rungs 2 to 4 are named in the ladder doc and the help text as not implemented in this phase, because no store supplies them [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/spec.md:155]. |
| D4 | Only `once` and `deny` are recorded. `always` and `conversation` stay refused `grant-scope-unsupported`, and a NO with no `--scope` records `deny`, so a refusal is never recorded as an approval [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/spec.md:157] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/spec.md:158]. |
| D5 | The answer's identity is its text and its scope, and the item write takes an exclusive lock beside the item, so a concurrent loser is refused `item-answered-differently` [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/spec.md:170] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/spec.md:171]. |
| D6 | The grant's `action` is clipped from the question only, never from the answer, so no secret the operator typed reaches the grant [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/spec.md:217]. |
| D7 | Every item writer this phase can see fills the grant, which is the gate, the answer, the resume stamp, 005's memory-proposal branch and 002's fatigue item, and a later writer fills it with this phase's two functions rather than `null` [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/spec.md:156]. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/action-kind.vitest.ts tests/approval-ladder.vitest.ts` prints a `Test Files` line with no `failed` count, so the six kinds resolve in OpenBot's order, `[ACTION: <kind>]` is a floor, and `decideApproval` returns rung 1 or the `bot` fallback and never rungs 2 to 4.
- [ ] `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/needs-you.vitest.ts` prints a `Test Files` line with no `failed` count, so an item carries `grants`, an item written before this phase reads `grants: null`, and the resumed prompt names the granted scope.
- [ ] `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/answer.vitest.ts` prints a `Test Files` line with no `failed` count, so `--scope deny` and a NO with no scope record `deny`, `--scope always` is refused `grant-scope-unsupported`, a second answer with a different scope is refused `item-answered-differently`, and two concurrent answers land one.
- [ ] `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/runner.vitest.ts tests/cli-run.vitest.ts` prints a `Test Files` line with no `failed` count, so the gate writes a grant from a parked question, 005's memory-proposal branch and 002's fatigue item carry one, the resumed record carries one line per grant, and `bots inbox` prints the grant on the item line and on its `--json` row.
- [ ] `rg -n "first answer wins" .skilled/skills/system-skilled-bots/bots-run/references/approval-ladder.md` prints the rule, `rg -n "not implemented in this phase" .skilled/skills/system-skilled-bots/bots-run/references/approval-ladder.md` prints the note, and `rg -n "tool-name.ts" .skilled/skills/system-skilled-bots/THIRD_PARTY_NOTICES.md` prints the entry under a `## 006-approval-grants` heading.
- [ ] `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run` prints a `Test Files` line with no `failed` count.
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow. Progress, evidence, deviations
and findings belong here.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Goal authored | Done | `node .skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants` prints `RESULT: PASSED` |
| Packet validates | Done | `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants --strict` prints `RESULT: PASSED` |
| Implementation | Pending | `rg -c 'grants' .skilled/skills/system-skilled-bots/runtime/lib/needs-you.ts` exits 1, so no item carries the field |
| Acceptance criteria | Pending | All sixteen rows in `acceptance-criteria.md` read `Unmet` |

### Deviations and findings

| Item | Note |
|------|------|
| Parent binding row | The parent goal's row for this phase names `006-approval-grants/goal.md`, which this file supplies. No parent decision or criterion changes, so the parent goal needs no amendment and no resend. |
| Plan section added | `plan.md` §8 External orchestration was added in the same run, so the wave assignment and the executor roster sit beside the plan that owns the gate and the answer. |
| Derived metadata re-derived | Adding `goal.md` changes the source-doc fingerprint, so `node .skilled/skills/system-spec-kit/runtime/cli/spec/repair-derived.cjs --folder specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants --apply` re-derives `graph-metadata.json`. |
| CHK-FIX-001 count holds | Its verify expects `rg -c '^\| .*runtime/lib/' plan.md` to print 8. The new §8 names its files relative to `$RT` as `lib/...`, so the count stays 8. |
<!-- /ANCHOR:log -->

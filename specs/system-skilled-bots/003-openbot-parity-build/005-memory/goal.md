---
title: "Goal: Phase 5: memory"
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
    packet_pointer: "system-skilled-bots/003-openbot-parity-build/005-memory"
    last_updated_at: "2026-11-25T19:52:52Z"
    last_updated_by: "create-goal"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "w3-005-memory"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: Phase 5: memory

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Give every bot a shared memory file and one of its own, both bounded and prepended to its prompt, with `bots remember` to add a fact and a `memory-proposal` item that `bots answer` confirms or rejects.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Each file is bounded at 60 entries and 3,600 bytes, each text at 400 characters, and an append past either bound is refused rather than rewritten, because a rewrite needs a model call inside a verb. |
| D2 | `bots remember` lives in the run mode, because it writes state. The status mode keeps its two read commands. |
| D3 | A `[REMEMBER]` line names its own type, and a line naming no type is refused `remember-type-invalid` rather than guessed. |
| D4 | The memory block sits at the memory position in the plan's Prompt Section Order, which this phase owns for the whole packet, so 004, 009 and 010 cite it rather than choosing a place. |
| D5 | The composed prompt is bounded at 32,000 characters: the conversation gives way first from its oldest message, and a prompt still over the bound is refused `prompt-over-budget` rather than truncating a skill body or a memory entry. |
| D6 | A proposal item's `botId` is the reserved sentinel `memory-proposals`, and `kind` is what keeps a review item from holding a bot, so a later review kind reuses `kind` rather than reserving a second id. |
| D7 | A confirmed proposal does not resume the run that proposed it, because that run already ended `completed`. |
| D8 | No `THIRD_PARTY_NOTICES.md` entry covers the bound: three numbers are not a lifted file. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/memory.vitest.ts` prints a `Test Files` line with no `failed` count, so `memory.ts` parses and renders an entry, refuses an append at 60 entries or 3,600 bytes, forgets entry 1, creates a 0700 folder with a 0600 file, round trips a fact holding a pipe and a newline as one text field, and leaves 61 entries after two appends at 59 with the next append refused.
- [ ] `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/dispatch.vitest.ts` prints a `Test Files` line with no `failed` count, so `buildBotPrompt` places both `<memory>` blocks after `checkoutLine`, returns today's string for a bot with no file, keeps an injection line inside one `<memory>` block, and refuses `prompt-over-budget` past 32,000 characters.
- [ ] `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/needs-you.vitest.ts tests/answer.vitest.ts` prints a `Test Files` line with no `failed` count, so `holdForBot` and `itemAwaitingResume` skip a `memory-proposal`, `confirm` appends `proposalFact` to `proposalBotId`'s file, and `reject` appends nothing.
- [ ] `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/runner.vitest.ts` prints a `Test Files` line with no `failed` count, so a run reads both files into `buildBotPrompt`, refuses a memory file holding a secret literal as `body-secret`, and writes one `memory-proposal` item for a `[REMEMBER]` line.
- [ ] `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run` prints a `Test Files` line with no `failed` count.
- [ ] `SKILLED_BOTS_STATE_ROOT=$(mktemp -d) node .skilled/bin/bots.cjs remember "the sales sheet is Q3"` exits 0 and prints an entry index and a file path.
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-skilled-bots/003-openbot-parity-build/005-memory --strict` prints `RESULT: PASSED`.
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
| Goal authored | Done | `node .skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs specs/system-skilled-bots/003-openbot-parity-build/005-memory` prints `RESULT: PASSED` |
| Packet validates | Done | `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-skilled-bots/003-openbot-parity-build/005-memory --strict` prints `RESULT: PASSED` |
| Implementation | Pending | `rg -n -i 'memory' .skilled/skills/system-skilled-bots/runtime/lib/*.ts` exits 1, so no module holds the word |
| Acceptance criteria | Pending | All nineteen rows in `acceptance-criteria.md` read `Unmet` |

### Deviations and findings

| Item | Note |
|------|------|
| Parent binding row | The parent goal's row for this phase names `005-memory/goal.md`, which this file supplies. No parent decision or criterion changes, so the parent goal needs no amendment and no resend. |
| Scaffold tokens outside this goal's write scope | `implementation-summary.md` still carries six unfilled value tokens, which the implementation run fills when it writes that file. `validate.sh --strict` reports them as one warning on a Draft packet, not as an error. |
| Plan section added | `plan.md` §8 External orchestration was added in the same run, so the wave assignment and the executor roster sit beside the plan that owns the prompt order. |
| Derived metadata re-derived | Adding `goal.md` changed the source-doc fingerprint, so `node .skilled/skills/system-spec-kit/runtime/cli/spec/repair-derived.cjs --folder specs/system-skilled-bots/003-openbot-parity-build/005-memory --apply` re-derived `graph-metadata.json`. `description.json` is unchanged. |
| CHK-FIX-001 expected count | Its verify expected `rg -c '^\| .*runtime/lib/' plan.md` to print 11, and the plan printed 12, because the `006's grants field shape` row in §6 also matched. The pattern is now the escaped pipe, a space and the literal `runtime/lib/`, which prints 11 and counts the affected-surfaces table alone. |
| Six contradictions closed | `wave1-contradictions.md` named six lines in this phase. `spec.md:265` now names D1's two sentinels instead of claiming no id of its own. `spec.md:148` now exits 4 for `memory-full` and 2 for `memory-entry-too-long`. `spec.md:153` now exits 4 with `review-answer-invalid`, gives the item `options` `["confirm", "reject"]` and reads a NO as `reject` with scope `deny`. `plan.md:88` now puts the bound check on `buildBotPrompt`'s joined output, with the rendered blocks and the request prompt as inputs and no `memory.ts` import in `dispatch.ts`. `spec.md:163` now splits the seam into a claim before the write and a settle after it. The sixth was the budget arithmetic below. |
| Budget arithmetic resolved | 31,776 bytes of memory plus the fixed protocol lines and the wrappers composes 33,357 characters with an empty body, so the 32,000 bound and the 3,600 per-file bound cannot both hold at their caps. Both are frozen in `contracts/prompt-sections.md` and `contracts/records.md` §7, so the skills list cap is the term that gives way. Its ceiling is 23,219 bytes and the recommended value is 16,384, which leaves 6,835 characters for the body and the conversation. 009 owns the number and this phase states the arithmetic in `plan.md`'s Prompt Section Order paragraph and in REQ-015. |
| Design folder authored | `design/` holds `record-schemas.md`, `module-contract.md`, `state-machines.md`, `refusals.md`, `mockups.md` and `fixtures/` with nine files. Every requirement, criterion and task cites one of them rather than restating it. |
| Citation drift for WO-15 | Every edit to `spec.md:146-165` and `plan.md:60, 62, 71` was made in place, one line each, so all twenty citations in `contracts/` that point at those lines still resolve to the same requirement. Four citations drifted and WO-15 repoints them. `contracts/cli-json.md:70` cites `spec.md:220` for `skippedLines`, now at `:149`. `contracts/refusals.md:101` cites `spec.md:264` for `remember-type-invalid`, now at `:167`. `contracts/prompt-sections.md:247` cites `plan.md:88` for the join rule, now at `:71`. `contracts/README.md:47` cites `spec.md:265` for the sentence D1 replaced, which no longer exists, and that row is a historical contradiction record rather than a live pointer, so it needs no repoint. |
<!-- /ANCHOR:log -->

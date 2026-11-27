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
    last_updated_at: "2026-11-27T22:00:00Z"
    last_updated_by: "create-goal"
    recent_action: "Built the phase and met every completion criterion"
    next_safe_action: "Merge the unit branch into the build branch"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "w3-005-memory"
      parent_session_id: null
    completion_pct: 100
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
| D1 | Each file is bounded at 60 entries and 3,600 bytes, each text at 400 characters and an append past either bound is refused rather than rewritten, because a rewrite needs a model call inside a verb. |
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

- [x] `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/memory.vitest.ts` prints a `Test Files` line with no `failed` count, so `memory.ts` parses and renders an entry, refuses an append at 60 entries or 3,600 bytes with a `free a line with bots remember --forget <entry-id>` hint, lists each entry with its 8-hex id, forgets `94a99780` from `design/fixtures/shared.md` while `7071ee7d` keeps its id, refuses `--forget 1` with `bots: --forget takes an entry id`, creates a 0700 folder with a 0600 file, round trips a fact holding a pipe and a newline as one text field and leaves 61 entries after two appends at 59 with the next append refused.
- [x] `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/dispatch.vitest.ts` prints a `Test Files` line with no `failed` count, so `buildBotPrompt` places both `<memory>` blocks after `checkoutLine`, returns today's string for a bot with no file, keeps an injection line inside one `<memory>` block, and refuses `prompt-over-budget` past 32,000 characters.
- [x] `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/needs-you.vitest.ts tests/answer.vitest.ts` prints a `Test Files` line with no `failed` count, so `holdForBot` and `itemAwaitingResume` skip a `memory-proposal`, `confirm` appends `proposalFact` to `proposalBotId`'s file, and `reject` appends nothing.
- [x] `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/runner.vitest.ts` prints a `Test Files` line with no `failed` count, so a run reads both files into `buildBotPrompt`, refuses a memory file holding a secret literal as `body-secret`, and writes one `memory-proposal` item for a `[REMEMBER]` line.
- [x] `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run` prints a `Test Files` line with no `failed` count.
- [x] `T=$(mktemp -d) && mkdir -p "$T/checkout/bots" && printf '{"stateRoot":"%s/state"}\n' "$T" > "$T/checkout/bots/config.json" && node .skilled/bin/bots.cjs remember "the sales sheet is Q3" --repo "$T/checkout"` exits 0 and prints an entry index and a file path.
- [x] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-skilled-bots/003-openbot-parity-build/005-memory --strict` prints `RESULT: PASSED`.
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
| Implementation | Done | `npm test` prints `Test Files  41 passed (41)` and `Tests  519 passed (519)`, and `npm run typecheck` exits 0 |
| Acceptance criteria | Done | All twenty-six rows read `Met`, each command run verbatim on 2026-11-27 printing `Tests  1 passed`, and `rg -c '\| Unmet \|' acceptance-criteria.md` finds nothing |

### Deviations and findings

| Item | Note |
|------|------|
| Parent binding row | The parent goal's row for this phase names `005-memory/goal.md`, which this file supplies. No parent decision or criterion changes, so the parent goal needs no amendment and no resend. |
| Scaffold tokens outside this goal's write scope | `implementation-summary.md` still carries six unfilled value tokens, which the implementation run fills when it writes that file. `validate.sh --strict` reports them as one warning on a Draft packet, not as an error. |
| Plan section added | `plan.md` §8 External orchestration was added in the same run, so the wave assignment and the executor roster sit beside the plan that owns the prompt order. |
| Derived metadata re-derived | Adding `goal.md` changed the source-doc fingerprint, so `node .skilled/skills/system-spec-kit/runtime/cli/spec/repair-derived.cjs --folder specs/system-skilled-bots/003-openbot-parity-build/005-memory --apply` re-derived `graph-metadata.json`. `description.json` is unchanged. |
| CHK-FIX-001 expected count | Its verify expected `rg -c '^\| .*runtime/lib/' plan.md` to print 11, and the plan printed 12, because the `006's grants field shape` row in §6 also matched. The pattern is now the escaped pipe, a space and the literal `runtime/lib/`, which prints 11 and counts the affected-surfaces table alone. |
| Six contradictions closed | `wave1-contradictions.md` named six lines in this phase. `spec.md:265` now names D1's two sentinels instead of claiming no id of its own. `spec.md:148` now exits 4 for `memory-full` and 2 for `memory-entry-too-long`. `spec.md:153` now exits 4 with `review-answer-invalid`, gives the item `options` `["confirm", "reject"]` and reads a NO as `reject` with scope `deny`. `plan.md:88` now puts the bound check on `buildBotPrompt`'s joined output, with the rendered blocks and the request prompt as inputs and no `memory.ts` import in `dispatch.ts`. `spec.md:163` now splits the seam into a claim before the write and a settle after it. The sixth was the budget arithmetic below. |
| Budget arithmetic resolved | 31,776 bytes of memory plus the fixed protocol lines and the wrappers composed 33,357 characters with an empty body at the old 24,576-byte skills cap, so the 32,000 bound and the 3,600 per-file bound could not both hold at their caps. Both are frozen in `contracts/prompt-sections.md` and `contracts/records.md` §7, so the skills list cap is the term that gives way. Packet decision D11 lowers `SKILLS_TOTAL_MAX_BYTES` to 20,480 bytes, so a bot at both caps composes 27,680 bytes of content and 29,261 characters with the wrappers, which leaves 2,739 characters for the body and the conversation [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/contracts/decisions.md, D11]. 009 owns the number and this phase states the arithmetic in `plan.md`'s Prompt Section Order paragraph and in REQ-015. |
| F-030, 005 half | The finding offered two orders for the pre-dispatch checks. The assistant took the first on 2026-11-26 under the operator's do-not-ask directive: secret check, worktree, build and budget check, dispatch. A `prompt-over-budget` refusal now finishes a fresh tree with `finishBotWorktree` and returns a resumed one to `kept`, the pair the `read-only-unconfined` branch already takes. `design/state-machines.md` section 4.2, `acceptance-criteria.md` AC-020 and `tasks.md` T049 state it. |
| F-052, over-long fact | The finding offered two outcomes for a `[REMEMBER]` fact over 400 characters. The assistant took the first on 2026-11-26 under the operator's do-not-ask directive: a new post-run cause `remember-fact-too-long`, no item, the run stays `completed`. `spec.md` REQ-017, `design/record-schemas.md` section 6, `design/refusals.md` section 1.4, `acceptance-criteria.md` AC-025 and `tasks.md` T053 state it. The contract rows in `contracts/refusals.md` and `contracts/records.md` belong to another writer. |
| F-016, child-marker refusal name | The finding named no refusal for a write verb under a bot child. The assistant took `child-write-refused`, the name `contracts/refusals.md` section 3.1 gives the same bar, on 2026-11-26 under the operator's do-not-ask directive, with stderr `bots: child-write-refused: <verb> runs no write inside a bot run` and exit 2. `spec.md` REQ-001, `design/module-contract.md` section 9, `acceptance-criteria.md` AC-013 and `tasks.md` T034 state it. The 001 and contracts writers must match the name. |
| F-050 and F-051, confirm pre-check | The finding offered two places for the bound and secret pre-check on `confirm`. The assistant took the first on 2026-11-26 under the operator's do-not-ask directive: the claim half, before the item is claimed and before any write, with the settle's check kept as a backstop. A confirm into a full file leaves the item open. `design/state-machines.md` section 4.3, `design/refusals.md` section 5, `acceptance-criteria.md` AC-023 and `tasks.md` T052 state it. |
| F-069, wave 4 | The finding offered two homes for the reserved-sentinel test. The assistant took the first on 2026-11-26 under the operator's do-not-ask directive: a new `tests/label.vitest.ts` case in wave 4, task T054, rather than folding it into an existing file. `plan.md` section 8 names the file and the task. |
| F-075, skills cap | The finding offered two ways to make the budget arithmetic add up. The assistant took the first on 2026-11-26 under the operator's do-not-ask directive: lower the skills list cap rather than the memory bound. Packet decision D11 sets `SKILLS_TOTAL_MAX_BYTES` to 20,480 bytes, so a bot at both caps composes 27,680 bytes of content and 29,261 characters with the wrappers, leaving 2,739 characters for the body and the conversation. `spec.md` REQ-015, `plan.md`'s Prompt Section Order paragraph and the budget row above state it. |
| O-001, O-003 and O-005, verify commands | The assistant rewrote every verify command in this phase on 2026-11-26 under the operator's do-not-ask directive, taking the finding's first-named alternative: a unique full test name under an anchored filter with a stated `Tests  1 passed`, and a whole-file run only as a second check. No filter matches a test that ships today and no row runs a whole file as its only check. |
| O-022, serial commas | The assistant removed the serial comma from every list in this phase on 2026-11-26 under the operator's do-not-ask directive, taking the finding's only named fix: drop the comma before the final `and`. |
| Forget by entry id | The final parity recommendations made `--forget` take an entry's 8-hex id instead of its index and added the forget hint to `memory-full`. Criterion 1 now names the id, the two fixture ids and the `--forget 1` refusal from AC-003 to AC-005. Criterion 6 now pins its state root through the scratch `config.json` recipe T039 uses. |
| Design folder authored | `design/` holds `record-schemas.md`, `module-contract.md`, `state-machines.md`, `refusals.md`, `mockups.md` and `fixtures/` with nine files. Every requirement, criterion and task cites one of them rather than restating it. |
| Citation drift for WO-15 | Every edit to the requirements table in `spec.md` and to the Prompt Section Order paragraph in `plan.md` was made in place, one line each, so the citations in `contracts/` that point at those requirements still resolve. Four citations drifted and WO-15 repoints them: `contracts/cli-json.md` section 3.2, row `skippedLines`, `contracts/refusals.md` section 3.4, row `remember-type-invalid`, and `contracts/prompt-sections.md` section 6, which cites the join rule in `plan.md`. The fourth pointed at the sentence `contracts/decisions.md` D1 replaced, and that sentence no longer exists, so nothing needs a repoint. |
| Criterion 1, CLI clause | The `--forget 1` refusal `bots: --forget takes an entry id` is a CLI check, so `cli-run.vitest.ts` proves it under `^bots remember remember too long$`. `memory.vitest.ts` proves the module half, where `forgetMemoryEntry` refuses the id `1` as `memory-entry-unknown`. |
| Four checklist commands amended | CHK-001 now expects 17 requirement rows, the count `spec.md` holds since REQ-016 and REQ-017. CHK-032 now greps the template label `memory ${path}`, because the design's `body-secret` detail needs the path in the label. CHK-034 now greps `memory.ts`, where T007 puts the renderer. CHK-051 now allows the scaffold's `scratch/.gitkeep`. T009, T016 and T020 keep their commands with the real evidence beside them. |
| Memory folder creation | The spec's Risks row puts the memory folder in `ensureIdentityState`. The build makes it in its writer through `ensureMemoryFolder`, because `state-root.vitest.ts` asserts the exact folder list and 002 set the same precedent. |
| AC-024 test name | T029 named a `bots answer review` block, while AC-024 and T051 run `^bots answer review recorded$`. The test sits in the existing `describe('bots answer')`, so the acceptance command matches. |
| Handoff to 008 | `POST_RUN_CAUSES` in `run-record.ts` lists this phase's three causes. 008 appends `secret-in-output` to it. |
| Handoff to the contracts writer | `contracts/refusals.md` section 3.4 still lacks `remember-fact-too-long`, which `contracts/records.md` now names. |
<!-- /ANCHOR:log -->

---
title: "Goal: Phase 9: skills"
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
    packet_pointer: "system-skilled-bots/003-openbot-parity-build/009-skills"
    last_updated_at: "2026-11-25T19:58:36Z"
    last_updated_by: "create-goal"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "w3-009-skills"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: Phase 9: skills

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Give a BOT.md a `skills` list whose `SKILL.md` bodies reach the prompt under a per-skill and a total byte cap, and give a finished run one `bots skill propose` path to a reviewable draft whose answer is pinned to the revision it read.

**Parent goal:** `../goal.md` binds this phase, and its decisions outrank this file's detail.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The caps are 16,384 bytes per skill and 20,480 bytes across the list, and both refuse by name rather than truncate, because a truncated `SKILL.md` is a half instruction [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/009-skills/spec.md, REQ-003]. |
| D2 | The skills block sits at the skills position 005's Prompt Section Order fixes, after the memory block and before the decision marker and the standing body, and 005's 32,000-character bound stays the only total bound [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/009-skills/spec.md:161]. |
| D3 | Proposals live in the identity's `proposals` folder under the state root, never in a checkout, and the review item carries the reserved `skill-proposals` id so no definition may take it [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/009-skills/spec.md, section "10. OPEN QUESTIONS"]. |
| D4 | The review item's `grants` field is filled through 006's `classifyAction` and `decideApproval`, so this phase carries no ladder of its own [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/009-skills/spec.md, REQ-005]. |
| D5 | A skill body is trusted repository content and not a security boundary, so the digest `bots schedule install <id>` records is what makes a body a bot wrote visible, and a difference refuses `skill-changed` [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/009-skills/spec.md:175]. |
| D6 | No `THIRD_PARTY_NOTICES.md` entry covers the `<skill_content>` wrapper, because a tag name and a two-line convention are not a copied file [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/009-skills/spec.md:266]. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `(cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/skills.vitest.ts -t "^parseSkillList ")` prints `Tests  3 passed`, `(cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/skills.vitest.ts -t "^loadSkills ")` prints `Tests  6 passed` and `(cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/skills.vitest.ts -t "^renderSkillsPrompt ")` prints `Tests  2 passed`, so `parseSkillList` refuses `skills-duplicate` and `skills-name-invalid`, `loadSkills` refuses `skill-unknown`, `skill-unreadable`, `skill-too-large`, `skills-over-budget` and `skill-changed` and `renderSkillsPrompt` returns one `<skill_content>` block per skill.
- [ ] `(cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/dispatch.vitest.ts -t "^the skills block ")` prints `Tests  4 passed`, so the blocks sit after the memory block and before the decision marker and the body, a bot with no `skills` key gets today's prompt byte for byte, an injection body stays inside its own block and a prompt the skills pushed past 32,000 characters refuses `prompt-over-budget` naming the skills block.
- [ ] `(cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/skill-proposal.vitest.ts -t "^writeProposal ")` prints `Tests  6 passed`, `(cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/skill-proposal.vitest.ts -t "^the pin ")` prints `Tests  2 passed` and `(cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/answer.vitest.ts -t "^bots answer records a proposal review and queues no resume$")` prints `Tests  1 passed`, so `writeProposal` writes both files, `--name` defaults to the proposing bot's id, the draft passes `validate_skill_package.py`, a re-run with both files and no item repairs the proposal, a secret literal refuses `proposal-secret` naming the key, an answer records the review with no resume request queued and a changed target refuses `proposal-stale` and leaves the item open.
- [ ] `(cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/runner.vitest.ts -t "^the skills load ")` prints `Tests  3 passed` and `(cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/definition.vitest.ts -t "^parseDefinition ")` prints `Tests  3 passed`, so a run loads the named bodies, records each name and digest under `posture.skills`, refuses before dispatch and the definition carries `skills` defaulting to `[]`.
- [ ] `node .skilled/skills/system-skilled-bots/scripts/bot-check.cjs .skilled/skills/system-skilled-bots/scripts/fixtures/skills-clean` exits 0, and the same command over the `skills-unknown`, `skills-too-large` and `skills-over-budget` fixtures exits 1 and prints `FAIL: skills-unknown`, `FAIL: skills-too-large` and `FAIL: skills-over-budget` respectively.
- [ ] `node .skilled/bin/bots.cjs skill propose run-1 --repo .skilled/skills/system-skilled-bots/scripts/fixtures/skills-clean` exits 4 and prints `run-record-missing`, so the verb parses and refuses a missing record rather than exiting 2 as a usage error.
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-skilled-bots/003-openbot-parity-build/009-skills --strict` prints `RESULT: PASSED`.

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
| Goal authored | Done | `node .skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs specs/system-skilled-bots/003-openbot-parity-build/009-skills` prints `RESULT: PASSED` |
| Packet validates | Done | `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-skilled-bots/003-openbot-parity-build/009-skills --strict` prints `RESULT: PASSED` |
| Implementation | Pending | `rg -n 'skills' .skilled/skills/system-skilled-bots/runtime/lib/definition.ts` exits 1, so the parser carries no `skills` key |
| Acceptance criteria | Pending | All fifteen rows in `acceptance-criteria.md` read `Unmet` |

### Deviations and findings

| Item | Note |
|------|------|
| Parent binding row | The parent goal's row for this phase names `009-skills/goal.md`, which this file supplies. `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-skilled-bots/003-openbot-parity-build --strict` no longer lists `009-skills/goal.md` among its `SPECDOC_SUFFICIENCY_006` errors. No parent decision or criterion changes, so the parent goal needs no amendment and no resend. |
| Plan section added | `plan.md` §8 External orchestration was added in the same run, so the wave assignment and the executor roster sit beside the plan that owns the prompt order. |
| Derived metadata re-derived | Adding `goal.md` changed the source-doc fingerprint, so `node .skilled/skills/system-spec-kit/runtime/cli/spec/repair-derived.cjs --folder specs/system-skilled-bots/003-openbot-parity-build/009-skills --apply` re-derived `graph-metadata.json`. `description.json` is unchanged. |
| Scaffold tokens outside this goal's write scope | `implementation-summary.md` still carries unfilled value tokens, which the implementation run fills when it writes that file. `validate.sh --strict` reports them as one warning on a Draft packet, not as an error. |
| The measured gap | `node .skilled/bin/bots.cjs skill propose run-1` exits 2 with `bots: unknown verb: skill`, and the largest of the sixteen `SKILL.md` files is 32,362 bytes, so the per-skill cap refuses the four largest bodies rather than truncating them. |
| Contract gap this phase leaves | `contracts/answer-seam.md` step 13 requires a skill decision to be recorded beside `proposal.json` and names no file, and `contracts/records.md` section 9 holds `proposal.json` and not the settle's record. This phase writes `answer.json` and fixes its seven keys in `design/record-schemas.md` section 3. The amendment is a `records.md` section 9.1 holding that table, added in the same change that lands the code, because the contract's own rule says the contract file is edited first [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/contracts/README.md, section "The rule"]. |
| Review fixes taken by the assistant | The final reviews offered alternatives on F-027, F-032, F-057, F-069 and F-075. The assistant took the first-named alternative on each on 2026-11-26 under the operator's do-not-ask directive: F-027 a bot with no install record pins against the digest its most recent approved run recorded under `posture.skills`, and the loader does not run on a resume because the parked prompt already holds the blocks, F-032 the verb reads the existing item's `kind` and the limit for the other kinds is stated in REQ-005, F-057 the pin reads the skilled tree root the loader reads and the run id is checked as a safe segment before the record read, F-069 five explicit test tasks T038 to T042 own the five test files, F-075 the list cap is 20,480 bytes under decision D11. |
| The checker fixtures name real skills | `skills-clean` names `system-skilled-bots`, `skills-too-large` names `sk-git` and `skills-over-budget` names `sk-code` with `sk-doc`, so a fixture's expected byte count moves when one of those bodies is edited. The counts are measured in `design/fixtures.md` section 1. Reversal condition: if a body edit breaks a fixture twice, the fixture grows its own skill folder under `scripts/fixtures/` and the checker learns a `--skilled-tree` option, which is a change to `bot-check.cjs` and not to this phase's contract. |
<!-- /ANCHOR:log -->

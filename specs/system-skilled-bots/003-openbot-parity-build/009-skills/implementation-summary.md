---
title: "Implementation Summary"
description: "A BOT.md can now name skills whose SKILL.md bodies reach its prompt under two byte caps, and a finished run can become a reviewable draft skill through bots skill propose."
trigger_phrases:
  - "skills implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-skilled-bots/003-openbot-parity-build/009-skills"
    last_updated_at: "2026-11-28T02:10:00Z"
    last_updated_by: "openbot-build-009"
    recent_action: "Built the skills list and the skill proposal and closed every acceptance row"
    next_safe_action: "Merge the unit branch into system-skilled-bots"
    blockers: []
    key_files:
      - ".skilled/skills/system-skilled-bots/runtime/lib/skills.ts"
      - ".skilled/skills/system-skilled-bots/runtime/lib/skill-proposal.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-009-skills"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 009-skills |
| **Completed** | 2026-11-28 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A bot can now carry a procedure from the repository. Write `skills: [sk-code]` in its BOT.md and the whole `SKILL.md` reaches the prompt in its own labelled block. A finished run can also be turned into a draft skill with `bots skill propose <run-id>`, and you confirm or reject that draft through one inbox item.

### Phase 9: skills

You name skill folders in the new `skills` key. Each named body is read once, digested and placed after the memory blocks and before the decision marker and the bot body, inside `<skill_content name="...">` with a label that marks it untrusted and a line naming the skill's folder. One body over 16,384 bytes refuses `skill-too-large`, a list over 20,480 bytes refuses `skills-over-budget` and a name with no `SKILL.md` refuses `skill-unknown`, all before any child starts and never by cutting a body. The checker fails the same three as `skills-unknown`, `skills-too-large` and `skills-over-budget` before anything installs.

`bots schedule install <id>` now pins each body's digest in the install record, and a body that changed since refuses `skill-changed` until you install again. A bot with no install record pins against the bodies its last dispatched run recorded under `posture.skills`, and a run you type yourself loads the bodies as they are.

`bots skill propose <run-id> [--name <skill-name>]` reads one run record and writes a draft `SKILL.md` and a `proposal.json` into the identity's `proposals` folder under the state root, never into a checkout. It raises one review item under the reserved `skill-proposals` id. `bots answer <run-id> confirm` records the decision in `answer.json` beside the proposal and queues no run, and a target that changed since the proposal read it refuses `proposal-stale` with the item left open. A draft holding a known secret literal refuses `proposal-secret` and a draft holding a hidden direction character refuses `proposal-hidden-character`, both before the first write.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-skilled-bots/runtime/lib/skills.ts` | Created | The list grammar, the loader with both caps and the pin, the pin lookup and the block renderer |
| `.skilled/skills/system-skilled-bots/runtime/lib/skill-proposal.ts` | Created | The draft, `proposal.json`, the review item and the claim and settle halves of the answer seam |
| `.skilled/skills/system-skilled-bots/runtime/lib/definition.ts` | Modified | Accepts the `skills` key and carries `skills: string[]` |
| `.skilled/skills/system-skilled-bots/runtime/lib/dispatch.ts` | Modified | Places the skills block after memory inside the 32,000-character bound |
| `.skilled/skills/system-skilled-bots/runtime/lib/runner.ts` | Modified | Loads and pins the bodies before the prompt is built and records them on the run |
| `.skilled/skills/system-skilled-bots/runtime/lib/run-record.ts` | Modified | The optional `posture.skills` field and its validator |
| `.skilled/skills/system-skilled-bots/runtime/lib/installer.ts` | Modified | Writes `skillDigests` into a bot's install record |
| `.skilled/skills/system-skilled-bots/runtime/lib/answer.ts` | Modified | The skill proposal review kind in the one review seam |
| `.skilled/skills/system-skilled-bots/runtime/lib/state-root.ts` | Modified | Names the identity's `proposals` folder |
| `.skilled/skills/system-skilled-bots/runtime/lib/label.ts` | Modified | Reserves the `skill-proposals` bot id |
| `.skilled/bin/bots.cjs` | Modified | The `skill propose` verb and the Skilled tree passed to `answer` |
| `.skilled/skills/system-skilled-bots/scripts/bot-check.cjs` | Modified | The three skills invariants |
| `.skilled/skills/system-skilled-bots/scripts/fixtures/skills-*/` | Created | One clean fixture and one defect fixture per invariant |
| `.skilled/skills/system-skilled-bots/scripts/fixtures/README.md` | Modified | Describes the four new fixtures |
| `.skilled/skills/system-skilled-bots/assets/bot-template.txt` | Modified | The commented `skills` key |
| `.skilled/skills/system-skilled-bots/bots-author/references/bot-definition.md` | Modified | The `skills` field and its refusals, version 1.0.7.0 |
| `.skilled/skills/system-skilled-bots/bots-run/SKILL.md` | Modified | Names `bots skill propose` and its review |
| `.skilled/skills/system-skilled-bots/runtime/lib/README.md` | Modified | Names the two new modules and their groups |
| `runtime/tests/skills.vitest.ts`, `runtime/tests/skill-proposal.vitest.ts` | Created | The loader, renderer, proposal and pin tests |
| `runtime/tests/` answer, bot-check, cli-run, definition, dispatch and runner suites | Modified | The named blocks tasks.md lists |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Four waves of `cli-mistral-vibe` workers on `deepseek-flash` wrote the code and the tests, each worker owning one file. Wave 1 had 11 workers on the new module, the small contract edits, the docs and the fixtures. Wave 2 had 4 on the definition, the proposal module and the first two test files. Wave 3 had 7 on the runner, the installer, the answer seam, the CLI, the checker and two test files. Wave 4 had 4 on the remaining test files. Every worker finished with `exit_code=0 outcome=finished`, so no retry and no cli-pi fallback was needed. After each wave the orchestrator read the diffs and ran every verify command itself.

The live loop then ran against a committed temp copy of `fixtures/skills-clean` with a temp state root, and its transcript is in `scratch/measured/propose-answer-loop.txt`. Two run records were seeded with `writeRunRecord` and no run was dispatched. The whole gate ran last.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| `skills.ts` holds its own name pattern | `definition.ts` imports `skills.ts`, so importing the bot id pattern back would make a cycle |
| `posture.skills` is written only when a run loaded skills | A bot with no skills keeps its old record byte for byte, so the posture equality tests outside this phase stay true |
| The install record's `skillDigests` wins and a missing name in it refuses `skill-changed` | An install is the act that approved the bytes, and a bot installed before it named skills must be installed again |
| A typed run with no install record loads the bodies unpinned, and an unattended one pins against the newest non-refused run that recorded skills | A person typing the run approves the bodies as they are, the way a manual run approves its definition |
| A resumed run reads no body and copies the parked run's `posture.skills` | The parked prompt already holds the blocks its first attempt loaded |
| An installed bot's pin holds for a hand-typed run too | The install record is the approval, so `bot-definition.md` now says a hand-typed run approves a changed body only for a bot with no install record |
| A missing or damaged `proposal.json` reads as no proposal | The answer still lands and settles nothing, rather than refusing every answer on the item |
| `AnswerInput` takes an optional `skilledTree` that defaults to the tree the runtime ships in | The pin reads the same root the loader reads, and `bots answer` passes the tree it resolved |
| The CLI success line is `bots: proposal for skill <name> written at proposals/<run-id>` | It is the line `design/mockups.md` shows. `contracts/refusals.md` section 3 words it differently, which is left for the alignment phase |
| `skill` joined `CHILD_REFUSED_VERBS` | The file's own comment says each later write verb joins that list |
| The review item carries 18 keys and no `conversationId` | The needs-you validator has no such key and would refuse the item as `unknown-key` |
| The `proposals` folder is made by its writer and not by `ensureIdentityState` | A read never creates a folder, and the T014 count of 2 stays exact |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `cd $R && npm test` | PASS, `Test Files  53 passed (53)` and `Tests  695 passed (695)`, exit 0. Baseline 51 files and 654 tests, so +2 files and +41 tests with none lost |
| `cd $R && npm run typecheck` | PASS, exit 0, baseline exit 0 |
| `cargo test --locked --manifest-path .skilled/crates/bots-tui/Cargo.toml` | PASS, exit 0, every `test result: ok` |
| `bot-check.cjs` over the four skills fixtures | `skills-clean` exit 0, the three defects exit 1 with `FAIL: skills-unknown`, `FAIL: skills-too-large` and `FAIL: skills-over-budget` |
| `bots skill propose run-1 --repo $F/skills-clean` | `bots: run-record-missing: run-1`, exit 4, no file written |
| Live propose, inbox and answer loop | Both proposals exit 0, `jq -e` exit 0 on both `proposal.json`, two `skill-proposals` items listed, the answer wrote `answer.json` and queued 0 requests |
| Temp folders | The new tests alone leave none. The 253 `bots-*` folders the full gate run left were removed |
| Every test name tasks.md lists | Each `vitest -t` command printed the count tasks.md expects |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **A run folder path holding a secret-shaped environment value refuses the draft.** The draft names the run folder, and the secret check treats every non-allowlisted environment value that looks like a secret as one. Plain paths pass: a probe with `PWD`, `TMPDIR`, `SHELL` and `LANG` set and the run folder under the Skilled tree exited 0. In a session whose temp path holds a UUID such as an agent session id, `bots skill propose` refuses `proposal-secret` naming that variable. Run the verb with that variable unset.
2. **The checker reads the skills of the tree it ships in.** The fixtures name real skills, so an edit that grows `sk-git`, `sk-code` or `sk-doc` past a cap moves a fixture's byte count. The tests match the counts only by prefix and suffix.
3. **Skill bodies are not scanned for secret literals.** The plan is silent on it, and a body is trusted repository content, so the runner's secret check covers the bot body and not the skills.
4. **Contract and reference follow-ups are left for the alignment phase.** No task names `bots-run/references/run-queue-and-answer.md`, so its exit table does not list `bots skill propose` yet. The `contracts/records.md` section 9.1 table for `answer.json` and contract goldens for the new records are also not written. The tests build each record shape inline.
5. **`skills-unreadable` has no fixture.** An unreadable body is a host fault the checker reports under that name, and it is not one of the three hard invariants.
6. **The task literals drifted in four places.** T003 now prints 32,668 bytes instead of 32,362. T016 prints nine lines, T017 finds the reserved id through the `SKILL_PROPOSALS_BOT_ID` constant and T023 prints three lines. Each note sits beside its task in tasks.md.
<!-- /ANCHOR:limitations -->

---

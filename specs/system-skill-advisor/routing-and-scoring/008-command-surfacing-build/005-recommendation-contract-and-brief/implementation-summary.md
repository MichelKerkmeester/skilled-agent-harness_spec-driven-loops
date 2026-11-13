---
title: "Implementation Summary: Phase 5: recommendation-contract-and-brief"
description: "A recommendation now carries kind, command, policy and ownerSkillId from one generated table, and the brief head prints the owner, the slash command and its policy. Every acceptance criterion is met."
trigger_phrases:
  - "recommendation contract and brief implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/routing-and-scoring/008-command-surfacing-build/005-recommendation-contract-and-brief"
    last_updated_at: "2026-11-13T02:10:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Closed docs for build a57ce61a13"
    next_safe_action: "None, phase complete"
    blockers: []
    key_files:
      - ".skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts"
      - ".skilled/skills/system-skill-advisor/runtime/lib/render.ts"
      - ".skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts"
      - ".skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts"
      - ".skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/derive-command-bridges.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-005-recommendation-contract-and-brief"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary: Phase 5: recommendation-contract-and-brief

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 005-recommendation-contract-and-brief |
| **Completed** | 2026-11-13. Built and committed as `a57ce61a13` |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The brief now tells the model which slash command to use and whether to run it, start it or ask first. Where the head read `use command-spec-kit-plan`, it now reads `use system-spec-kit → /speckit:plan (start)` (`scratch/brief-heads-before.txt` line 1 against `scratch/brief-heads-after.txt` line 1).

### Phase 5: recommendation-contract-and-brief

- **One command table.** The bridge deriver writes a `GENERATED COMMAND ROWS` block into `lib/command-attach.ts`. It holds `COMMAND_ROWS`, one row per scorer id with the runnable command, its policy and the owning skill, and `COMMAND_POLICIES`, one policy per runnable string. The handler, the renderer, the CLI and the hook fallback all read it. `DOCTOR_COMMAND_STRINGS` and `BRIDGE_COMMAND_BY_ID` are gone.
- **Four recommendation fields.** A recommendation carries `kind`, and a command row also carries `command`, `policy` and `ownerSkillId`. A hub that gets a command from its compiled route carries that command's policy. `/speckit:plan add a login page` returns `{"kind":"command","command":"/speckit:plan","policy":"start","ownerSkillId":"system-spec-kit"}`.
- **The brief head.** A recommendation that names a command renders as `<owner> → <command> (<policy>)`, on the `use` head and on both sides of an `ambiguous` head. The git hooks prompt now reads `ambiguous: sk-git → /doctor:git hooks (ask)` where it read `ambiguous: /doctor:git hooks`. No line of `scratch/brief-heads-after.txt` contains `command-`.
- **The degraded contract.** When the daemon is down, the CLI keeps a command row only when the prompt typed its bare slash command. Any other command row collapses to its owner skill, and a duplicate owner is dropped. A CLI row from an older daemon with no new field still renders its command and policy, filled from `COMMAND_ROWS`.
- **Retired ids and leftovers.** The four ids `command-spec-kit-plan`, `-complete`, `-implement` and `-resume` are now `command-speckit-*` in both scorers and in five relabelled label fields (`scratch/relabel-list.txt`). `allow-list.json` is deleted, and so are the Python `"/prompt"` row and its owner branch and both `HAND_AUTHORED_*` dictionaries. `routingEnabled` is now required.
- **The reach check.** A command row whose `ownerSkillId` is the probed hub now counts as a hit. `scratch/reach-before.txt` printed `outranked=4` and `RESULT: FAILED`. `scratch/reach-after.txt` prints `outranked=0` and `RESULT: PASSED`.
- **The typo row.** `sk-doc`'s `intent_signals` gained one documentation-edit phrase, the source field `scratch/nm-sk-doc-source.txt` names. Row `nm-sk-doc-01` now tops at `sk-doc` with no command. Before, `sk-doc` was not in the top results at all (`scratch/nm-sk-doc-before.txt`, `skdoc index -1`).
- **Same-owner ambiguity.** Two floored candidates now cluster on their score margin alone. `typed_same_owner_ambiguous` went from `["cmd-create-agent-typed-01"]` (`scratch/before.txt`) to `[]`.
- **Search phrase.** `/speckit:search` gained the owned signal `which packets mention`, so that prompt now carries `/speckit:search` with policy `run`.

### Files Changed

`ADV` is `.skilled/skills/system-skill-advisor/runtime`. The list comes from `git -c core.fsmonitor=false show --stat a57ce61a13`. The same commit also holds runner, doctor and install changes from the reachability work, listed in the last row.

| File | Action | Purpose |
|------|--------|---------|
| `ADV/lib/command-attach.ts` | Modified | `CommandRow`, the generated `COMMAND_ROWS` and `COMMAND_POLICIES` block and `commandRowFor` |
| `ADV/schemas/advisor-tool-schemas.ts`, `ADV/lib/subprocess.ts` | Modified | `kind`, `policy` and `ownerSkillId` on the public recommendation |
| `ADV/handlers/advisor-recommend.ts` | Modified | Fills the fields from `COMMAND_ROWS` and the hub policy from `COMMAND_POLICIES` |
| `ADV/lib/render.ts` | Modified | The `<owner> → <command> (<policy>)` label, and doctor strings read from the table |
| `ADV/skill-advisor-cli.ts`, `.skilled/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts` | Modified | The degraded contract and the passthrough of the new fields |
| `ADV/scripts/command-bridges/derive-command-bridges.cjs`, `command-bridges.generated.json`, `scoring-compatibility.json`, `allow-list.json` | Modified, one Deleted | The command rows block, the allow-list removed and the four Python rows renamed |
| `ADV/lib/scorer/projection.ts`, `ambiguity.ts`, `fusion.ts`, `scoring-constants.ts`, `lanes/explicit.ts`, `ADV/scripts/skill_advisor.py` | Modified | Required `routingEnabled`, the floored cluster rule, the renamed ids and the removed Python leftovers |
| `.skilled/skills/sk-doc/sk-create-skill/scripts/ci-router-vocabulary-reach.cjs` and its test | Modified | Owner hits in the reach check |
| `.skilled/skills/sk-doc/graph-metadata.json`, `.skilled/skills/system-spec-kit/command-metadata.json` | Modified | One documentation-edit phrase and one search phrase |
| `ADV/tests/command-brief-golden.vitest.ts`, `cli-degraded-command-contract.vitest.ts` | Created | Six golden heads plus three edge rows, and the degraded contract |
| `ADV/tests/` schema, fallback, doctor, drift, parity, ambiguity and derivation tests | Modified | New cases and re-pinned expectations |
| `ADV/scripts/routing-accuracy/` fixtures and baselines, `ADV/scripts/fixtures/` | Modified | Relabelled ids and the re-captured baseline |
| `hooks/skill-advisor-hook.md`, `feature-catalog/cli-surface/advisor-recommend.md`, `ADV/scripts/command-bridges/README.md` | Modified | The head form, the four fields and the degraded contract |
| `ADV/scripts/routing-accuracy/command-offer.mjs`, `run-command-behaviour.mjs`, `score-command-transcripts.mjs`, `.skilled/commands/doctor/`, `.dsh/plugins/repo-guards/`, `INSTALL-SKILLED.md` | Modified or Created | The reachability and attribution work in the same commit. Not this phase's scope |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Workers ran wave by wave from the briefs in `scratch/briefs/`, with their logs in `scratch/logs/`. Wave 0 took the before numbers on commit `2920b1abef` (`scratch/before.txt`). Code waves started after phase 007's before arm finished. The first full suite run after the build showed seven failures in five files, which led to the re-pin wave T058 to T060. The orchestrator committed the whole build as `a57ce61a13`.

### Deviations from the plan

| Planned | Actual | Reason |
|---------|--------|--------|
| T028 deletes the four Python compatibility rows and the `command-spec-kit-resume` owner key | Amended 2026-11-13 by the coordinator under decision D1 of the parent `../goal.md`. The rows stay under the new ids `command-speckit-plan`, `-complete`, `-implement` and `-resume`, with `command-speckit-resume` as the owner-normalization key | Deleting them cost the Python fallback one labeled row, `rr-iter3-075`, whose confidence fell from 0.81 to 0.72 as the build reported. With the rows kept, the fallback now also answers `rr-iter3-076`, so two pinned `pythonCorrect` counts rose by one, 116 to 117 and 112 to 113, and `rr-iter3-076` left the approved-divergence ledger |
| No test edits outside the listed tasks | Re-pin wave T058 to T060, then T061 and a fixture rename in `tests/command-offer.vitest.ts` | Tests pinned the removed allow-list and the old ids. T061 adds the ambiguous-head row the renderer matrix needs. The fixture head at line 27 still named `command-spec-kit-plan` |
| T003 and T005 run in wave 0 | They ran after phase 007's before arm finished | The arm finished at 2026-11-12T23:30:58Z (CHK-004). The before timing files and `scratch/suite-before.txt` were written at 23:32 and 23:35 UTC by their file times |
| A new export of `doctorLeadPhrases` for its test | Not a deviation | The deriver already exported it before this commit. It was exported earlier in `d8797702e8`, see Verification |

Each re-pinned parity case moved a second pinned count by one as well. `advisor-corpus-parity.vitest.ts` moved `hookPreservedPythonCorrect` from 111 to 112, and `python-ts-parity.vitest.ts` moved `tsAlsoCorrect` from 107 to 108 (`git -c core.fsmonitor=false show a57ce61a13` on those two files).
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Level 2 | `recommend-level.sh --loc 700 --files 24 --api` printed Level 2 with score 57 |
| Operator answers of 2026-11-12 | All four design questions took the recommended option. CARRY-003 stays, and the `nm-sk-doc-01` fix moved here. `spec.md` section 10 quotes each answer |
| Keep the four Python rows under the new ids | Deleting them made the Python fallback lose a labeled row. Keeping them loses none and gains one |
| Fix `nm-sk-doc-01` at `sk-doc`'s `intent_signals` | The T055 trace found that `sk-doc` held no term for editing existing prose (`scratch/nm-sk-doc-source.txt`) |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

"Rerun" means I ran the command on commit `a57ce61a13` on 2026-11-13, before about 01:01:30 UTC, with no uncommitted change under `.skilled`, and read its output and exit status. "Read" means I read the number from the named file. "Reported" means the build reported it and I did not reproduce it. From 01:01:30 UTC other workers edited files in this worktree, among them `sk-doc/ROUTER.md`, `lib/command-attach.ts` and the deriver, so runs after that time are marked as such and are not evidence about `a57ce61a13`.

| Check | Result |
|-------|--------|
| Scorer baseline | Rerun: `[159,50,20,5]`, the same as `scratch/before.txt` |
| Command capture | Rerun: typed `{"correct":24,"total":44}`, tune combined 9 of 45, holdout combined 0 of 44, false offers `{"count":0,"total":35}` and same-owner ambiguity `[]`. Before, the same capture printed `["cmd-create-agent-typed-01"]` |
| Policy rollup and derive check | Rerun: `{"ask":17,"run":7,"start":20}`, and `--check` prints `fresh` with `typescriptActive` 45 and no `allowList` key |
| Live recommendations | Rerun: `/speckit:plan add a login page` gives `kind` `command`, `command` `/speckit:plan`, `policy` `start`, `ownerSkillId` `system-spec-kit`. The readme prompt gives `sk-doc` with `/create:readme` and `start`. `save context` gives one `/speckit:save` entry. The packets prompt gives `["run"]` |
| Brief heads | Read: `scratch/brief-heads-after.txt` holds six heads and none contains `command-` |
| Golden heads | Rerun: the six heads in `tests/command-brief-golden.vitest.ts` match the six in `plan.md` exactly |
| Typecheck | Rerun: `npm run typecheck` in `ADV` exit 0 |
| Targeted tests | Rerun: 11 files (schema, golden, degraded, fallback envelope, derivation, two doctor files, drift guard, two parity files, same-owner ambiguity), 68 passed and 0 failed |
| Python tests | Rerun: `python3 ADV/tests/python/test_skill_advisor.py` prints `pass=89, fail=0`, exit 0 |
| Python fallback rows | Run at about 01:05 UTC in the shared worktree, where `skill_advisor.py` and `scoring-compatibility.json` were still unchanged: `rr-iter3-075` and `rr-iter3-076` both top at `system-spec-kit` with confidence 0.81. The 0.72 drop under deletion is Reported |
| Reach check | Read: `scratch/reach-before.txt` `outranked=4`, `RESULT: FAILED`. `scratch/reach-after.txt` `outranked=0`, `RESULT: PASSED`. A later run with Ollama serving `nomic-embed-text:v1.5`, after the `sk-doc/ROUTER.md` edit by another worker, printed `probe-error=43` and `RESULT: FAILED` once, then `outranked=0`, `probe-error=0` and `RESULT: PASSED` with exit 0. The reach test file exits 0 |
| Hook timing, three runs each | Read: before medians 193.22, 163.66 and 179.86 ms, p95 295.61, 240.23 and 215.46 ms (`scratch/hook-latency-before-{1,2,3}.json`). After medians 192.42, 192.83 and 218.08 ms, p95 239.19, 278.55 and 250.18 ms (`scratch/hook-latency-after-{1,2,3}.json`). Middle median 179.86 to 192.83 ms, +12.97 ms. Middle p95 240.23 to 250.18 ms, +9.95 ms. Inside the +25 and +40 ms budget |
| Full suite | Read: `scratch/suite-before.txt` 167 files, 1482 passed and 6 skipped. `scratch/suite-after.txt` 170 files, 1513 passed and 6 skipped, 0 failed. My own run at 01:04 UTC came after other workers changed advisor source, and it failed 4 tests in 3 files with a stale `dist` and a daemon launcher exit. It is not evidence about `a57ce61a13` |
| Skill root metadata | Run at about 01:01 UTC: `checked=14 passed=14 failed=0` |
| Boundaries | Rerun: `git diff --quiet HEAD -- AGENTS.md` exit 0. The comment check over the commit's `.skilled` diff prints nothing |
| Old ids under `ADV` | Rerun: the first pass found one hit, `tests/command-offer.vitest.ts:27`, a pre-change brief head used as a parser fixture. After it was changed to `command-speckit-plan`, the AC-009 search printed nothing with exit 1 on 2026-11-13 |
| Ambiguous head with commands | Rerun on 2026-11-13: the T061 case at line 195 of `tests/command-brief-golden.vitest.ts` asserts `ambiguous: sk-git → /doctor:git hooks (ask)` and ` vs system-spec-kit → /speckit:save (start)`. That file and `tests/command-offer.vitest.ts` passed, 21 tests and 0 failed |
| `doctorLeadPhrases` export | Rerun: `git show a57ce61a13^:ADV/scripts/command-bridges/derive-command-bridges.cjs` already exports it. It landed in `d8797702e8` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The typo-row fix is lexical.** It adds one phrase to `sk-doc`'s `intent_signals`. A documentation edit worded without those terms may still miss `sk-doc`. Two fresh paraphrases of mine, one about spelling and one about rewording a document, both returned `sk-doc` at 0.82 through the live advisor at about 01:06 UTC, after other workers had started editing the worktree. I found no file that records a miss.
2. **Seven typed commands still reach the model without their command.** The parent `goal.md` records 7 of 44 as open and planned as phase 011.
3. **A plain research request gets no command.** `system-deep-loop` heads the brief with no command (`scratch/brief-heads-after.txt` line 6).
<!-- /ANCHOR:limitations -->

---
title: "Implementation Summary"
description: "A plain-chat prompt now reaches its slash command on 9 of 44 tune rows, up from 0, with no new false offer and the four pinned numbers no worse. Holdout reach stayed at 0 of 44 and doctor reach at 0 of 17, so the phase is in progress."
trigger_phrases:
  - "plain chat command reach implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/routing-and-scoring/008-command-surfacing-build/003-plain-chat-command-reach"
    last_updated_at: "2026-11-12T12:27:36Z"
    last_updated_by: "template-author"
    recent_action: "Built and measured the plain-chat command reach phase"
    next_safe_action: "Decide where meaning-based matching is built, then close the holdout gap"
    blockers: []
    key_files:
      - ".skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts"
      - ".skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/derive-command-bridges.cjs"
      - ".skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/capture-command-routing-baseline.mjs"
      - ".skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts"
      - ".skilled/skills/system-skill-advisor/runtime/lib/scorer/ambiguity.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-003-plain-chat-command-reach"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 3+ -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 003-plain-chat-command-reach |
| **Completed** | Not complete. Built and measured on 2026-11-12, status In Progress |
| **Level** | 3+ |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A prompt typed in plain words now reaches its slash command on 9 of 44 tune rows, up from 0. No new false offer appeared, and full corpus top 1 rose from 158 to 159. The paraphrased holdout rows still reach nothing, and the doctor rows reach nothing on either split, so the phase's exit check is not met.

### Phase 3: plain-chat-command-reach

When you ask for a README, a changelog or a chart in your own words, the advisor's `sk-doc` or `sk-design` recommendation now carries the command that runs that mode, such as `/create:readme`. The 7 `/speckit` commands and `/prompt:improve` each have their own scored row with phrases written as users type, so a typed `/speckit:plan` returns its own row and is no longer ambiguous with `system-spec-kit`. The three umbrella ids and the old `/prompt` id are gone, and every command row now has to find one of its own phrases in the prompt before it can pass.

Measured in `scratch/after.json`, own row plus attached reach on tune is 9 of 44: own 2 and attached 7. By family on tune: create 4 of 13, design 3 of 3, prompt 1 of 1, speckit 1 of 7, deep 0 of 3, doctor 0 of 17. Holdout is 0 of 44. Typed recall at 1 went from 19 to 24 of 44, and slash variants reached from 2 to 5 of 8.

### Files Changed

`ADV` is `.skilled/skills/system-skill-advisor/runtime`.

| File | Action | Purpose |
|------|--------|---------|
| `ADV/lib/command-attach.ts` | Created | `attachCommand`, the generated `MODE_COMMANDS` block with 19 commands and the `DEPTH_WORDING` gate for `system-deep-loop` |
| `ADV/scripts/routing-accuracy/capture-command-routing-baseline.mjs` | Modified | `attachedMetrics` with own, attached and combined reach per split and family, attached false offers and same-owner ambiguity |
| `ADV/handlers/advisor-recommend.ts` | Modified | `enrichCompiledRoutes` calls `attachCommand` and sets `command` |
| `ADV/schemas/advisor-tool-schemas.ts` | Modified | Optional `command` string |
| `.skilled/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts` | Modified | Sends `includeCompiledRoute: true` and keeps `command` |
| `ADV/scripts/command-bridges/derive-command-bridges.cjs` | Modified | Mode lookup, generated rows and activation for standalone-skill commands, `readOnly` from the class, `ownerSkill` on bridges |
| `ADV/scripts/command-bridges/command-bridges.generated.json`, `ADV/lib/scorer/projection.ts`, `ADV/scripts/skill_advisor.py` | Modified | Regenerated blocks. `projection.ts` also lost the unused `HAND_AUTHORED_COMMAND_BRIDGES`. `skill_advisor.py` re-points hand-written references and limits the iteration-loop tiebreaker to the deep research and deep review bridges |
| `ADV/scripts/command-bridges/scoring-compatibility.json` | Modified | Hand rows removed where the metadata now decides |
| `ADV/scripts/command-bridges/allow-list.json` | Modified | The four umbrella rows deleted |
| `ADV/lib/scorer/fusion.ts` | Modified | `requireCommandPhraseAnchor`, widened from the doctor-only gate |
| `ADV/lib/scorer/ambiguity.ts` | Modified | A command row and its `ownerSkill` never form an ambiguous pair |
| `ADV/lib/scorer/lanes/explicit.ts`, `ADV/lib/scorer/aliases.ts` | Modified | Hand-written references re-pointed to the new ids |
| `.skilled/skills/system-spec-kit/command-metadata.json`, `.skilled/skills/sk-prompt/command-metadata.json` | Modified | Hand-authored `ownedSignals` for 7 and 1 commands |
| `ADV/scripts/routing-accuracy/labeled-prompts.jsonl`, `holdout-prompts.jsonl`, `ambiguity-prompts.jsonl` | Modified | 17 gold labels relabelled, listed in `scratch/relabel-list.txt` |
| `ADV/scripts/fixtures/gate2-golden-prompts.jsonl`, `ADV/scripts/fixtures/skill-advisor-regression-cases.jsonl` | Modified | Expected ids moved from `memory:save` and `command-spec-kit` to the per-command ids |
| `ADV/scripts/routing-accuracy/command-routing-baseline.json`, `scorer-eval-baseline.json` | Modified | Re-captured. Full corpus top 1 158 to 159 |
| `ADV/tests/scorer/same-owner-ambiguity.vitest.ts` | Created | Five cases for the same-owner rule, owners read from the generated bridges |
| `ADV/tests/command-bridges-drift-guard.vitest.ts` | Modified | Expectations now derived from the source files instead of fixed counts |
| `ADV/tests/scorer/native-scorer.vitest.ts` | Modified | Retired-id lookups re-pointed |
| `ADV/tests/scorer/doctor-ordering.vitest.ts` | Modified | Tests renamed to `requireCommandPhraseAnchor`, plus a case that every command needs its own phrase |
| `ADV/tests/compat/shim.vitest.ts`, `ADV/tests/legacy/advisor-graph-health.vitest.ts` | Modified | `memory:save` replaced by `command-speckit-save` |
| `ADV/tests/legacy/advisor-corpus-parity.vitest.ts` | Modified | Python-correct 114 to 116, hook-preserved 110 to 111, `rr-iter3-105` added to the accepted regressions |
| `ADV/tests/parity/python-ts-parity.vitest.ts` | Modified | Python-correct 109 to 112, TypeScript-also-correct 105 to 107, `rr-iter3-105` added to the accepted regressions |
| `ADV/tests/parity/fixtures/local-native-approved-divergences.json` | Modified | Divergence ids re-pointed |
| `ADV/tests/python/test_skill_advisor.py` | Modified | Five hunks, including the save case of `T243-SA-017` |
| `ADV/tests/hooks/skill-advisor-cli-fallback-no-match.vitest.ts` | Modified | Expects `includeCompiledRoute` `true` and `compiledRouteTopOnly` `true` |
| `ADV/tests/command-attach.vitest.ts` | Created | Six cases: route rows, the depth gate, a topic-only council question, a real command file behind every row and the schema with and without `command` |
| `ADV/tests/handlers/advisor-recommend-compiled-route-option.vitest.ts` | Modified | Top-only lookup, and no command offered through both its own row and its hub |
| `ADV/schemas/advisor-tool-schemas.ts`, `ADV/tools/advisor-recommend.ts`, `ADV/skill-advisor-cli.ts`, `ADV/skill-advisor-cli-manifest.ts` | Modified | The `compiledRouteTopOnly` option, and the daemon retry path that drops options an older daemon rejects |
| `ADV/lib/scorer/scoring-constants.ts` | Modified | A stale comment re-pointed to `command-spec-kit-plan` |
| `.skilled/skills/sk-doc/command-metadata.json` | Modified | `/create:changelog` gains `ask_first: ["outside-repo"]` and names the tag and release in `gate3_location` |
| `ADV/scripts/routing-accuracy/command-prompts.jsonl` | Modified | The three `/create:changelog` rows expect `ask` |
| `AGENTS.md`, `README.md`, `.skilled/agents/orchestrate.md` and its mirrors in `.claude`, `.codex`, `.dsh` and `.pi`, `.skilled/commands/doctor/assets/agents-md-manifest.json` | Modified | The retired `command-spec-kit` id replaced by the deep-loop command rows |
| Six advisor documents (`ARCHITECTURE.md`, `README.md`, `hooks/lib/README.md`, `hooks/skill-advisor-hook.md`, the two feature-catalog entries) and other advisor READMEs | Modified | The hook's route request described as it now is |
| `.skilled/skills/system-skill-advisor/changelog/v1.0.0.0.md`, `.skilled/skills/sk-doc/sk-create-skill/changelog/v1.16.0.0.md`, `.skilled/skills/sk-doc/changelog/v2.9.13.0.md` | Created | Component changelog entries, with version bumps in `sk-doc` |
| `.skilled/skills/system-skill-advisor/manual-testing-playbook/native-cli-tools/hub-command-attachment.md` | Created | Playbook scenario NC-011 |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

DeepSeek V4.1 Flash workers ran through cli-pi at max reasoning, one change per brief. The orchestrator reports 19 workers. The phase `scratch/` folder holds 26 briefs and 26 worker logs, so some workers had more than one brief. The orchestrating session rebuilt before each measurement, read each diff and saved a capture after each stage: `after-w2-full.json`, `after-w3-full.json`, `after-w3b-full.json`, `before-doctor-full.json`, `doctor-after.json` and `after.json`. The harness change was proven neutral first: its `diff` of `{rows,metrics,commands,unreachable}` against the saved baseline printed nothing (`scratch/logs/w8.out`).

The doctor phrases were built, measured and reverted. An independent review then added the attach tests, cleaned up the harness's temporary directory and added a generator seam. A report-only alignment run with four review lanes and a critic found 17 findings, 2 P1 and 15 P2, and the fixes listed under Key Decisions came from it. Nothing is committed or staged.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Retire `command-spec-kit`, `memory:save`, `command-memory-save` and `command-prompt-improver`, and relabel 17 gold lines | The operator chose "Replace now". Pinned numbers read `[159,49,20,5]` before the relabel and `[159,50,20,5]` after (plan ADR-005) |
| Every command row needs its own phrase to pass | Single everyday words from the new phrases matched in the lexical lane, and a bug-fix prompt was offered `/prompt:improve`. False offers went from 1 back to 0 (plan ADR-008) |
| Re-point hand-written scorer references in `explicit.ts`, `fusion.ts`, `aliases.ts` and the Python scorer | They named ids that no longer exist |
| A typed save command returns the save row in both scorers | One merged id cannot both normalize to its owner in Python and match the relabelled gold lines (plan ADR-010) |
| The hook asks for every compiled route | The recommend call has no top-only option, and adding one waits on a latency budget (plan ADR-009) |
| Remove the unused `HAND_AUTHORED_COMMAND_BRIDGES` from `projection.ts` | Nothing read it after activation moved to the deriver. The Python constants of the same name were already unused at HEAD and stay |
| Remove 13 worker-written phrases | They were fragments copied from tune prompts, which would score tune rows and nothing else |
| Revert the doctor phrases | They moved no doctor row and raised the helper count to 11 against a guard of 7 (plan ADR-007) |
| Re-pin the tests and both baselines | Approved by the operator on 2026-11-12 (plan ADR-011) |
| Add meaning-based matching | The operator's answer to the holdout gap. Not started, and its placement is open question 5 (plan ADR-012) |
| Look up the compiled route for the top recommendation only | Operator decision, 2026-11-12. One run measured median 235.04 ms against 251.21 ms with three lookups (plan ADR-013) |
| `/create:changelog` asks first | Operator decision, 2026-11-12. Its `--release` path pushes a tag and publishes a release (plan ADR-014) |
| Rename the retired id in `AGENTS.md` Gate 4, the root README, the orchestrate agent and the doctor manifest | Operator decision, 2026-11-12. No instruction file should name an id the scorer no longer has (plan ADR-015) |
| Replace `council` with `ask the council` and `convene` in `DEPTH_WORDING` | An alignment finding: a question that only named the council as a topic was offered `/deep:ai-council`. A test now holds it |
| A hub does not repeat a command whose own row ranks in the same result | An alignment finding: the earlier collapse check grouped bridge rows only and missed a hub attaching the same command |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Harness neutral before scorer changes | PASS for the existing keys: `diff` printed nothing. Attached reach read 7, not 0, because `MODE_COMMANDS` was already filled by a parallel worker |
| Pinned numbers | `[159,50,20,5]` from `capture-scorer-eval-baseline.mjs` in the final state. Phase 1 had `[158,50,20,5]` |
| Plain reach, `scratch/after.json` | Tune 9 of 44 (own 2, attached 7). Holdout 0 of 44. Ceiling 44 |
| False offers | 0 of 35, attached false offers 0 of 35, no `mns-d3-*` row offered |
| Typed same-owner ambiguity | 1 row left, `cmd-create-agent-typed-01`. 8 rows mid-build |
| Wrong attached command | `cmd-create-agent-plain-holdout-01` got `/create:changelog` attached in `scratch/after.json`, against an expected `/create:agent`. No metric counts this, and it was not re-checked after the review fixes |
| Read-only from the class | `/speckit:search` carries `readOnly: true`. The review's prompt `show me which packets mention the token cap` returns no recommendation. FAIL for that proof |
| `advisor_recommend` on `create a readme for the utils folder` | `sk-doc` with `command` `/create:readme` |
| Depth gate | `what is caching` attaches nothing, `research caching strategies in depth over several iterations` attaches `/deep:research` |
| Hook time over 44 tune prompts, one run each | Before median 194.35 ms, p95 281.15 ms. Three lookups 251.21 and 450.47 ms, with the later-reverted doctor phrases in place. Top-only lookup 235.04 and 318.96 ms. Shared machine |
| Doctor phrases, while in place | Doctor tune and holdout reach 0 of 17. Helper on top of 11 rows of other commands against a guard of 7. Reverted |
| `derive-command-bridges.cjs --check` | `fresh`, 62 generated, 45 TypeScript-active, 51 Python-active |
| Doctor phrase probe and doctor slice | Probe exits 0 and the slice passes, per the orchestrator |
| Skill root metadata gate | `checked=14 passed=14 failed=0 fixed=0` |
| `lib/render.ts` and `AGENTS.md` | Unchanged |
| Full suite | Final state, per the orchestrator: 165 files, 1,410 passed, 8 skipped, exit 0. Typecheck clean. An earlier run had 1 failure in `tests/skill-advisor-launcher-orphan-reaping.vitest.ts`, which passed 10 of 10 twice alone. Its cause was not traced |
| Baselines after the review fixes | Re-captured with metrics unchanged: typed 24 of 44, plain tune combined 9 of 44, holdout 0 of 44, false offers 0 of 35 |
| Policy rollup | `{"ask":17,"run":7,"start":20}` from `commandPolicies` in the generated file |
| Acceptance criteria | 21 rows: 11 Met, 10 Unmet. See `acceptance-criteria.md` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Holdout reach is 0 of 44.** The holdout rows are paraphrases, and a command row matches only a whole phrase. Meaning-based matching is the decided next step and is not started.
2. **Doctor reach is 0 of 17 on both splits.** Two probes failed on it. The phrase approach did not move it and was reverted. The phrases are kept in `scratch/routes-with-doctor-phrases.yaml`.
3. **The brief does not print the command.** A recommendation such as `command-prompt-improve` appears as that raw id, and an attached `command` is not shown, until phase 004 renders commands.
4. **Hook time rose.** With the top-only lookup the median went from 194.35 ms to 235.04 ms on one run on a shared machine.
5. **`rr-iter3-105` is a recorded routing miss.** The prompt types `/memory:save`, and TypeScript now picks `system-spec-kit`.
6. **The published v4.0.2.1 release notes are not synced.** The repository file `.skilled/changelog/skilled/v4.0.2.1.md` changed in this build, and the published release was not updated.
7. **No test passes a stubbed `command` through the hook.** `recommendationFromCli` keeps the field, but only by reading the code.
8. **Four `/speckit` hand rows remain in the Python activation list.** `command-spec-kit-plan`, `-complete`, `-implement` and `-resume`.
9. **Meaning-based matching is not started.** Its placement is open question 5.
<!-- /ANCHOR:limitations -->

---

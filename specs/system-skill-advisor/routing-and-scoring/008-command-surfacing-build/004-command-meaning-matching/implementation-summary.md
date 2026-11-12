---
title: "Implementation Summary: Phase 4: command-meaning-matching"
description: "A plain prompt can now reach a slash command by meaning. Tune reach rose from 9 to 14 of 45 and holdout from 0 to 2 of 44 with no false offer. The holdout target of 5 was missed, and the operator accepted the miss."
trigger_phrases:
  - "command meaning matching implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/routing-and-scoring/008-command-surfacing-build/004-command-meaning-matching"
    last_updated_at: "2026-11-12T19:56:55Z"
    last_updated_by: "generate-context"
    recent_action: "Built and measured command meaning matching, closed with accepted miss"
    next_safe_action: "Plan phase 005 recommendation contract and brief"
    blockers: []
    key_files:
      - ".skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts"
      - ".skilled/skills/system-skill-advisor/runtime/lib/skill-graph/skill-graph-db.ts"
      - ".skilled/skills/system-skill-advisor/runtime/lib/embedders/schema.ts"
      - ".skilled/skills/system-skill-advisor/runtime/tests/command-meaning-anchor.vitest.ts"
      - "specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/004-command-meaning-matching/implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:19131567d09bc56885cfe30b8644fea125da97738c7fa1bfa15ecfca474888f3"
      session_id: "scaffold-004-command-meaning-matching"
      parent_session_id: null
    session_ref:
      runtime: "claude"
      sessionId: "fddcf466-8e1f-44cf-a132-6f846b676c18"
      workspace: "/Users/michelkerkmeester/worktrees/public/352-command-surfacing-research"
      savedAt: "2026-11-12T19:56:55Z"
      locatorKind: "transcript_path"
      version: 1
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary: Phase 4: command-meaning-matching

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata
| Field | Value |
|-------|-------|
| **Spec Folder** | 004-command-meaning-matching |
| **Completed** | 2026-11-12 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A plain prompt that shares no words with a slash command can now reach it, because each scored command has a vector and a close match lets the command pass. With the real embedder, tune reach rose from 9 to 14 of 45 and holdout reach from 0 to 2 of 44, with no false offer. The holdout target was 5, so the phase closes with that miss, accepted by the operator (ADR-009).

### Phase 4: command-meaning-matching

Each of the 45 scored command rows now carries an `embeddingText`. A metadata command leads with its `userIntent.job` sentence and its owned phrases, and its `description` stands in only when the record states no job. A doctor route uses its command file's frontmatter `description` and its route `trigger_phrases`. The skill graph scan embeds that text into a sibling table, `vec_cmd_<dim>`, and the semantic lane scores command rows from it. A command whose real cosine reaches 0.72 and beats every other command by 0.02 now passes. It ranks first only when it also beats the top skill's cosine by 0.02. A prompt that asks for no change gets no command on meaning, and a read-only question gets only a read-only command (ADR-011). Without a running embedder, the scorer returns the same phrase-only result as before.

### Files Changed

`ADV` is `.skilled/skills/system-skill-advisor/runtime`. The list comes from `git -c core.fsmonitor=false diff HEAD --stat` and `git status` on 2026-11-12.

| File | Action | Purpose |
|------|--------|---------|
| `ADV/scripts/command-bridges/derive-command-bridges.cjs`, `command-bridges.generated.json` | Modified | Write `embeddingText` for the 45 TypeScript-enabled rows |
| `ADV/lib/embedders/schema.ts`, `ADV/lib/embedders/index.ts` | Modified | `commandVecTableNameForDim` and `ensureCommandVecTableForDim`: the sibling table keyed by `command_id`, with no foreign key |
| `ADV/lib/skill-graph/skill-graph-db.ts` | Modified | The refresh embeds commands with the same hash skip rule and prunes rows no longer generated. `loadSkillEmbeddings(ids)` also reads command rows, and the no-argument form stays skills only |
| `ADV/lib/scorer/fusion.ts` | Modified | `requireCommandPhraseAnchor` passes a command on meaning, counting `cosine:` evidence only. `rankMeaningPassedCommandFirst` runs after `keepPassingSkillsAboveDoctorBridges`. `commandMeaningEligible` and `NO_EDIT_REQUEST` keep a meaning match off no-change and read-only prompts. Constants 0.72 and 0.02 |
| `ADV/scripts/routing-accuracy/capture-command-routing-baseline.mjs` | Modified | `--real-embedding` mode, which refuses `--write` and exits 2 when the embedder or the command vectors are missing |
| `ADV/tests/command-meaning-anchor.vitest.ts` | Created | 17 cases: injected vectors, the eligibility check against real read-only and mutating rows, and whole prompts scored with no embedder and no stored vectors |
| `ADV/tests/command-bridges-drift-guard.vitest.ts` | Modified | Ignores the derived `embeddingText` field |
| `ADV/scripts/routing-accuracy/README.md`, `ADV/scripts/command-bridges/README.md` | Modified | The new flag and the new field |
| `ARCHITECTURE.md`, `README.md`, `feature-catalog/feature-catalog.md`, `feature-catalog/scorer-fusion/command-meaning-matching.md`, `ADV/lib/README.md`, `ADV/lib/scorer/README.md`, `ADV/tests/README.md`, `ADV/tests/scorer/README.md` under `.skilled/skills/system-skill-advisor/` | Modified, one Created | Skill docs for the new behaviour. These are in the diff but were not in the task list |
| `ADV/tests/scorer/lane-weight-sweep.vitest.ts` | Modified in `5fc383f83a` | The corpus bound raised from 25 to 26 (ADR-010) |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Three waves of DeepSeek v4.1 flash max workers through cli-pi built T006 to T013, T016, T018 and T019. Their briefs and logs are in `scratch/briefs/` and `scratch/logs/`. The orchestrator wrote the tuning script (T014) and set the constants (T015). Ollama was not running at the start and was started by hand.

The first round used a bar of 0.74 with no margin and measured holdout 4 of 44. The operator asked for one more round, and the embedding text was rewritten to lead with the user-voice job sentence. The second round used 0.72 with margin 0.02 and measured holdout 3 of 44 and tune 14 of 45. The operator kept round two and closed the phase with the miss. A review then found that a meaning match could offer a mutating command for a no-change question, and the eligibility check was added at the source (ADR-011). It moved one holdout row, so the recorded holdout number is 2 of 44.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Command vectors in a sibling table `vec_cmd_<dim>` | The skill table's foreign key to `skill_nodes` rejects command ids. The operator chose "Sibling table (Recommended)" (ADR-001) |
| A meaning-passed command ranks first only on a clear margin | Own reach counts at top 1, and the model still sees the skill beside it. "First, on a clear margin (Recommended)" (ADR-005) |
| First bar 0.74 with no margin | The highest tune reach with 0 wrong first commands and 0 false offers in round one. "0.74, no margin (Recommended)" (ADR-006) |
| One more round, leading with the job sentence | Round one missed the target by one row. "One more improvement round" (ADR-007) |
| Second bar 0.72 with margin 0.02 | 9 tune hits with 0 wrong first commands and 0 false offers in round two. "0.72, margin 0.02 (Recommended)" (ADR-008) |
| Keep round two and close with the miss | Round two lifted tune reach to 14 of 45 with 0 false offers, while neither round reached 5 on holdout. "Keep round two, close with the miss (Recommended)" (ADR-009) |
| A meaning match respects a no-change or read-only request | A review found `command-doctor-env` passing at 0.80 for "do not change anything" prompts. Fixed in `fusion.ts`, not in the corpus (ADR-011) |
| Raise the sweep test's bound to 26 | Its fixture holds 26 prompts. "Raise the bound to 26 (Recommended)", committed as `5fc383f83a` (ADR-010) |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

"Read" means I read the number from the file or reran the command. "Reported" means the build orchestrator ran it and I did not rerun it.

| Check | Result |
|-------|--------|
| Before, `scratch/before.json` | Read: typed 24 of 44, plain tune combined 9 of 45 (own 2, attached 7), holdout 0 of 44, false offers 0 of 35 |
| Round one, `scratch/real-embedding-round1.json` | Read: tune own 6, combined 13 of 45. Holdout own 4, combined 4 of 44. False offers 0 of 35. Typed 24 of 44 |
| Round two before the review fix, `scratch/real-embedding-round2.json` | Read: tune own 7, combined 14 of 45. Holdout combined 3 of 44: doctor 2 of 17, speckit 1 of 7. False offers 0 of 35 |
| Final, `scratch/real-embedding.json` | Read: tune own 7, combined 14 of 45. Holdout combined 2 of 44: doctor 2 of 17, speckit 0 of 7. False offers 0 of 35 and attached false offers 0 of 35. Typed 24 of 44. A row diff of the two files, prompts left out, shows one change: `cmd-speckit-resume-plain-holdout-01`, top `command-spec-kit-resume` to `system-spec-kit` |
| Sweep against the full scorer | Read: at 0.72 and 0.02 the sweep (`scratch/tune-threshold.out`) predicted 9 own tune hits and the full scorer delivered 7, because later scorer steps still apply and the sweep does not replay them |
| Sweep rows | Read: `scratch/tune-threshold.out` prints `rows scored: 80 (tune 45, must stay silent 35)`, and `rg -n holdout scratch/tune-threshold.mjs` prints nothing |
| Default capture after the build | Read, rerun on 2026-11-12: typed 24 of 44, tune combined 9 of 45, holdout 0 of 44, false offers 0 of 35 |
| Scorer floor | Read, rerun on 2026-11-12: `[159,50,20,5]` |
| Hook timing, three runs each, `scratch/hook-latency-*.json` | Read: before medians 199.16, 199.26, 199.01 and p95 231.35, 234.76, 224.33. Final after medians 206.23, 194.83, 205.09 and p95 269.27, 259.04, 261.92. Middle median 199.16 to 205.09, +5.93 ms. Middle p95 231.35 to 261.92, +30.57 ms. Inside the +25 and +40 ms budget. The final runs were taken at a load average near 15, as reported. They replaced an earlier after set with a +4.63 ms median |
| Command vectors | Read: `vec_cmd_768` holds 45 rows, and 0 ids match `alignment` or `local-` |
| Bridge check | Read: `derive-command-bridges.cjs --check` prints `"status": "fresh"` |
| Code shape | Read: constants 0.72 and 0.02 at `fusion.ts:847-848`, the rank step right after `keepPassingSkillsAboveDoctorBridges`, `REFERENCES` only on the skill table in `schema.ts`, 11 test cases |
| Full suite with the embedder running | Read, rerun on 2026-11-12: `npm test` exit 0 on the final state, 166 of 166 files passed, 1,430 tests passed and 6 skipped of 1,436 |
| Typecheck and policy rollup | Read, rerun on 2026-11-12: the package typecheck exited 0 with no output, and the phase 002 rollup query prints `{"ask":17,"run":7,"start":20}`. The generated file's diff adds only `embeddingText` lines |
| Metadata and alignment drift | Reported: `ci-skill-root-metadata` `failed=0`, `verify_alignment_drift` 0 violations |
| Repeat scan and exit 2 | Worker logs: a repeat scan reads `0 embedded, 45 skipped` (`scratch/logs/w2-T009.out:40-43`). `--real-embedding --write` and a missing command table each exit 2 (`scratch/logs/w1-T013.out:15-23`) |
| Anchor tests | Read: the suite above includes the 17 cases in `tests/command-meaning-anchor.vitest.ts`, covering absent vectors and no embedder, read-only and mutating rows, and no-change prompts |
| No-change probes | Reported: through the live CLI, `command-doctor-env` passed at 0.80 for two no-change prompts before ADR-011 and is absent after it |
| Live check | Reported: the advisor CLI returns `command-doctor-env` first for a tune prompt that had no command before |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Holdout reach is 2 of 44 against a target of 5.** The operator accepted the miss (ADR-009). The next lever is a vector per owned phrase, kept as a note, not a plan.
2. **The holdout set was measured three times.** Round one read 4 of 44, round two 3 of 44, and the final state after the review fix 2 of 44. Choosing between rounds after seeing holdout numbers weakens holdout as an unseen check. The bars themselves were chosen from tune rows only.
3. **17 of the 44 holdout rows name hub-only commands with no scored row.** This phase cannot reach them. Meaning-based hub routing is a possible follow-up, as a note only.
4. **Meaning matching needs the local embedder.** Without Ollama the scorer returns today's phrase-only result. Ollama was not running at the start of this build.
5. **The committed baselines cannot guard the gain.** They run under the fixture regime, so only `--real-embedding` on a machine with Ollama shows the meaning reach.
<!-- /ANCHOR:limitations -->

---

---
title: "Tasks: Phase 4: command-meaning-matching"
description: "Ordered tasks to give each tracked command a vector, anchor a close meaning match and prove it with the real embedding."
trigger_phrases:
  - "command meaning matching tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 4: command-meaning-matching

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

Every command runs from the repository root unless a task says otherwise. `ADV` is `.skilled/skills/system-skill-advisor/runtime`. `D` is `$ADV/scripts/command-bridges/derive-command-bridges.cjs`. `G` is `$ADV/scripts/command-bridges/command-bridges.generated.json`. `C` is `$ADV/scripts/routing-accuracy/capture-command-routing-baseline.mjs`. `F` is `$ADV/lib/scorer/fusion.ts`. `DB` is `$ADV/lib/skill-graph/skill-graph-db.ts`. `P` is `node $ADV/scripts/routing-accuracy/capture-scorer-eval-baseline.mjs | jq -c '[.metrics.full_corpus_top1.correct,.metrics.holdout_top1.correct,.metrics.ambiguity_top1.correct,.metrics.gold_none_false_fire.value]'`. `S` is this packet's `scratch/` folder. `M` is `jq -c '.metrics.typed_recall_at_1, .attachedMetrics.plain, .metrics.false_offer'`.

Each task is one change to the files it names, small enough for a worker with a short brief. No task reads holdout prompt text. The capture scores holdout rows, and the tuning script reads `tune` rows and the 35 false-offer rows, which are all in split `none`.

Worker waves. Tasks in one wave touch different files and can run in parallel.
- Wave 0: T001, T002, T003, T004. Read-only setup.
- Wave 1: T006 (`D`, `G`), T008 (`schema.ts`), T011 (`F`), T013 (`C`).
- Wave 2: T007 (`D`, `G`), T009 (`DB`), T012 (`F`), T018 (routing-accuracy README).
- Wave 3: T010 (`DB`), T016 (test file), T019 (command-bridges README).
- Then one at a time: T014, T015 (`F`), T017 only if its condition holds, then T020 to T025.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Record the before numbers (`$S/before.json`). Verify: `node $C | $M` prints `{"correct":24,"total":44}`, a plain block with tune combined 9 and holdout combined 0, and `{"count":0,"total":35}`, and `$P` prints `[159,50,20,5]`. Evidence: `scratch/before.json` reads typed 24 of 44, tune combined 9, holdout 0 and false offers 0 of 35. The floor `[159,50,20,5]` was reported by the build and reread on 2026-11-12.
- [x] T002 Copy `../003-plain-chat-command-reach/scratch/hook-latency.mjs` to `$S/hook-latency.mjs` and run it three times (`$S/hook-latency-before-{1,2,3}.json`). Verify: `jq -c '[.n,.medianMs,.p95Ms]'` on each file prints 44 and two numbers. Evidence: before medians 199.16, 199.26, 199.01 and p95 231.35, 234.76, 224.33, n 44 each.
- [x] T003 Confirm the embedder. Verify: `curl -s localhost:11434/api/tags | jq -r '.models[].name'` lists a `nomic-embed-text` model. If it does not, stop and report. Evidence: Ollama was not running at the start and was started by hand. On 2026-11-12 the tags call listed `nomic-embed-text:v1.5`.
- [x] T004 Save every reader of the vector table (`$S/vec-readers.txt`). Verify: `rg -n "vecTableNameForDim|loadSkillEmbeddings" $ADV --glob '*.ts' --glob '!dist' --glob '!node_modules' > $S/vec-readers.txt` exits 0, and each line is marked `safe` or `needs skill-only filter`. Evidence: `scratch/vec-readers.txt` marks each hit `safe` or `needs skill-only filter`.
- [x] T005 Record the operator's answers to the four open questions (`spec.md`, `plan.md`). Verify: `rg -n "^- .*Decision:" spec.md` prints four lines and `rg -n "^### ADR-00[1-4]" plan.md` prints four lines. Evidence: accepted on 2026-11-12, "Accept all four (Recommended)".
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T006 In `D`, add an `embeddingText` field to each TypeScript-enabled entry whose id does not start with `command-doctor`. Build it from the command's metadata `description`, `userIntent.job` and `userIntent.ownedSignals`, joined with `. `, with every slash command string removed. Run `node $D` to regenerate `G`. Verify: `node $D --check` prints `fresh`, `jq '[.entries[] | select(.runtime.typescript.enabled and (.id | startswith("command-doctor") | not) and .embeddingText != null)] | length' $G` prints 10, and `jq -r '.entries[].embeddingText // empty' $G | grep -c '/[a-z-]*:'` prints 0. Evidence: 45 rows carry `embeddingText`, all TypeScript-enabled, and `--check` prints `"status": "fresh"`. Round two changed the text to lead with the job sentence (ADR-007).
- [x] T007 In `D`, add `embeddingText` to each TypeScript-enabled doctor entry: the frontmatter `description` of `.skilled/commands/doctor/<name>.md` for its command, then its `_routes.yaml` `trigger_phrases`, joined with `. `. Run `node $D` to regenerate `G`. Verify: `node $D --check` prints `fresh`, and `jq '[.entries[] | select(.runtime.typescript.enabled and (.id | startswith("command-doctor")) and .embeddingText != null)] | length' $G` prints 35. Evidence: the doctor rows lead with the command file description, for example `Check, embed or restore the shipped AGENTS.md sections, plan first.`, followed by the route phrases.
- [x] T008 In `$ADV/lib/embedders/schema.ts`, add `ensureCommandVecTableForDim(db, dim)`, which creates `vec_cmd_<dim>` with the same columns and indexes as `ensureVecTableForDim` and no `REFERENCES` clause. Leave `ensureVecTableForDim` unchanged. Verify: `rg -n "REFERENCES" $ADV/lib/embedders/schema.ts` prints only the `vec_<dim>` line, and in `$ADV`, `npx vitest run tests/embedders` reports 0 failed. Evidence: `ensureCommandVecTableForDim` and `commandVecTableNameForDim` in `schema.ts`. Key column `command_id`. `REFERENCES` appears only on the skill table.
- [x] T009 In `refreshSkillEmbeddingsViaAdapter` (`DB`), call `ensureCommandVecTableForDim`, then after the skill loop embed each entry of `G` that has `embeddingText` into `vec_cmd_<dim>`, keyed by `runtime.typescript.id`, with the same content hash, skip rule and outage streak, and delete rows whose id is not in `G`. Leave the legacy refresh path unchanged. Verify: after a scan with Ollama running, `vec_cmd_<dim>` holds 45 rows, and a second scan embeds no command row. Evidence: `vec_cmd_768` holds 45 rows. The worker log reads `Command embeddings: 0 embedded, 45 skipped, 0 failed, 0 pruned` on a repeat scan (`scratch/logs/w2-T009.out:40-43`). The refresh prunes rows no longer generated.
- [x] T010 In `loadSkillEmbeddings` (`DB`), also read `vec_cmd_<dim>` for the requested ids when that table exists, and return those rows in the same shape. Verify: in `$ADV`, `npx vitest run tests/skill-graph tests/skill-graph-db.vitest.ts tests/skill-graph-embedding-outage.vitest.ts` reports 0 failed. Evidence: `loadSkillEmbeddings(ids)` reads command rows, and the no-argument form stays skills only. The suite result is reported in T024.
- [x] T011 In `requireCommandPhraseAnchor` (`F`), let a command row pass when its `semantic_shadow` contribution has evidence starting `cosine:`, a `rawScore` at or above `COMMAND_MEANING_MIN_COSINE` and a lead of at least `COMMAND_MEANING_MARGIN` over every other command row's `semantic_shadow` `rawScore`. Set its confidence to at least the confidence threshold, passed in from the call site at `fusion.ts:1369`. Add the two constants at 1.01 and 0, so nothing passes yet. Verify: in `$ADV`, `npx vitest run tests/scorer` reports 0 failed, and `node $C | $M` prints the T001 numbers. Evidence: the meaning branch counts `cosine:` evidence only. After review, `commandMeaningEligible` keeps a meaning match off no-change prompts and lets only a read-only command answer a read-only question (ADR-011).
- [x] T012 In `F`, add `rankMeaningPassedCommandFirst(ranked)` and call it right after `keepPassingSkillsAboveDoctorBridges` near `fusion.ts:1375`. It moves a command that passed on meaning to first place only when its `semantic_shadow` cosine beats the top passing skill's cosine by `COMMAND_MEANING_MARGIN`, counting a top skill with no `semantic_shadow` contribution as 0. Otherwise the order is unchanged. Verify: in `$ADV`, `npx vitest run tests/scorer` reports 0 failed, and `node $C | $M` prints the T001 numbers. Evidence: `rankMeaningPassedCommandFirst` runs right after `keepPassingSkillsAboveDoctorBridges`.
- [x] T013 In `C`, add a `--real-embedding` flag. With it, the capture does not set `VITEST`, `SYSTEM_SKILL_ADVISOR_DB_DIR` or `SKILL_ADVISOR_DISABLE_BUILTIN_SEMANTIC`, wraps each `scoreAdvisorPrompt` call in `withSemanticShadowPromptEmbedding`, refuses `--write`, and exits 2 with a message naming the missing piece when Ollama or the command vectors are absent. Add the flag to the `rejectUnknownOptions` list. Verify: with Ollama stopped, `node $C --real-embedding` exits 2 and names the embedder, and `node $C | $M` prints the T001 numbers. Evidence: the worker log shows exit 2 for `--real-embedding --write` and for a missing `vec_cmd_*` table (`scratch/logs/w1-T013.out:15-23`). The embedder branch was checked with a stubbed `fetch`, not by stopping Ollama.
- [x] T014 Write `$S/tune-threshold.mjs`. It filters `command-prompts.jsonl` to rows with `split` equal to `tune`, or to the false-offer rows (`must-not-start`, `near-miss`, or `slash-variant` with no expected command), before it reads any prompt. For each row it records every command row's cosine, then prints tune reach and false offers for each τ from 0.50 to 0.90 in steps of 0.02 and each m in 0, 0.02, 0.05 and 0.10. Verify: `rg -n "holdout" $S/tune-threshold.mjs` prints nothing, `rg -n "split === 'tune'" $S/tune-threshold.mjs` prints the filter, and the output names the highest τ and its m that hold 0 of 35 false offers. Evidence: `scratch/tune-threshold.mjs` keeps `split === 'tune'` or a must-stay-silent row, and the output reads `rows scored: 80 (tune 45, must stay silent 35)`. Written by the orchestrator. Its own pick line names 0.70 with no margin, and the operator chose from the full table instead (ADR-006, ADR-008).
- [x] T015 Set `COMMAND_MEANING_MIN_COSINE` and `COMMAND_MEANING_MARGIN` in `F` to the pair T014 named. Verify: `rg -n "COMMAND_MEANING_(MIN_COSINE|MARGIN) =" $F` prints the two values from the T014 output. Evidence: `fusion.ts:847-848` reads 0.72 and 0.02, the operator's round two choice (ADR-008). Round one used 0.74 with no margin (ADR-006).
- [x] T016 Write `$ADV/tests/command-meaning-anchor.vitest.ts` with injected vectors. Cases: a pass, a fail under τ, a fail inside the margin, `shadow:test-fallback` evidence never passes, an absent vector, an absent embedder, an absent database, `readOnlyRouteAllowed` unchanged, a command that beats the top skill by the margin ranks first, one inside the margin keeps its place, and a doctor row ranks first over a passing skill when it clears the margin. Verify: in `$ADV`, `npx vitest run tests/command-meaning-anchor.vitest.ts` reports 0 failed. Evidence: 17 cases in `tests/command-meaning-anchor.vitest.ts`. They cover the bar, the margin, stand-in evidence, a row with no semantic contribution, the caller ruling a command out, four eligibility cases against real read-only and mutating rows, and whole prompts scored with no embedder and no stored vectors, where every passing command rests on an authored phrase.
- [x] T017 Only if T020 shows a false offer on a doctor row: in `D`, stop emitting `embeddingText` for doctor entries and regenerate `G`. Verify: `node $D --check` prints `fresh` and the T020 false-offer count reads 0 of 35. Not run: its condition did not hold. False offers read 0 of 35 in both rounds.
- [x] T018 [P] Document `--real-embedding` and its exit 2 in `$ADV/scripts/routing-accuracy/README.md`. Verify: `rg -n -- "--real-embedding" $ADV/scripts/routing-accuracy/README.md` prints at least one line. Evidence: `--real-embedding` is described at `scripts/routing-accuracy/README.md:72`.
- [x] T019 [P] Document the `embeddingText` field in `$ADV/scripts/command-bridges/README.md`. Verify: `rg -n "embeddingText" $ADV/scripts/command-bridges/README.md` prints at least one line. Evidence: `embeddingText` is described at `scripts/command-bridges/README.md:53`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T020 Run the real-embedding capture (`$S/real-embedding.json`). Verify: `node $C --real-embedding > $S/real-embedding.json` exits 0, and `$M` over it shows holdout combined plain reach at least 5 of 44, tune combined at least 9 of 45, typed at least 24 of 44 and false offers 0 of 35. Evidence: `scratch/real-embedding.json` reads holdout combined 2 of 44, tune combined 14 of 45, typed 24 of 44 and false offers 0 of 35. Holdout misses the target of 5, accepted by the operator (ADR-009). Round two before the review fix read 3 of 44 (`scratch/real-embedding-round2.json`).
- [x] T021 Run the default capture and the floor. Verify: `node $C | $M` prints the T001 numbers and `$P` prints `[159,50,20,5]`. Evidence: rerun on 2026-11-12. Typed 24 of 44, tune combined 9 of 45, holdout 0 of 44, false offers 0 of 35, and the floor `[159,50,20,5]`.
- [x] T022 Run `$S/hook-latency.mjs` three times (`$S/hook-latency-after-{1,2,3}.json`). Verify: the middle median is at most 25 ms over the T002 middle median, and the middle p95 at most 40 ms over the T002 middle p95. Evidence: the final after runs read medians 206.23, 194.83, 205.09 and p95 269.27, 259.04, 261.92. Middle median 199.16 to 205.09, +5.93 ms. Middle p95 231.35 to 261.92, +30.57 ms.
- [x] T023 Check policies. Verify: `node $D --check` prints `fresh` and the policy rollup still reads 17 ask, 7 run, 20 start. Evidence: `--check` prints `"status": "fresh"`, and the phase 002 rollup query prints `{"ask":17,"run":7,"start":20}`, rerun on 2026-11-12.
- [x] T024 Run the full suite and the metadata check. Verify: in `$ADV`, `npm test` reports 0 failed, and `node .skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs` reports `failed=0`. Evidence: rerun on the final state on 2026-11-12 with the embedder running. `npm test` exited 0 and printed `Test Files  166 passed (166)` and `Tests  1430 passed | 6 skipped (1436)`. The typecheck exited 0 with no output. `ci-skill-root-metadata` `failed=0` is reported by the build, not rerun.
- [x] T025 Write `implementation-summary.md` and mark each row in `acceptance-criteria.md` with its evidence. Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh <this folder> --strict` prints `RESULT: PASSED`. Evidence: this summary and the criteria were written on 2026-11-12, and `validate.sh --strict` was run after.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [ ] `$S/real-embedding.json` shows holdout combined plain reach of at least 5 of 44 with false offers 0 of 35. Not met: it reads 2 of 44 with false offers 0 of 35. The operator accepted the miss (ADR-009)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance criteria**: See `acceptance-criteria.md`
- **Embedding owner**: `../../001-semantic-lane-enablement/spec.md`
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |

A blocked task gets `[B]` and one line naming what blocks it. A false offer above 0 blocks the phase.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] The before numbers are in `$S/before.json` (T001). Evidence: T001.
- [x] CHK-002 [P0] `curl -s localhost:11434/api/tags` lists a `nomic-embed-text` model (T003). Evidence: the tags call lists `nomic-embed-text:v1.5`, read on 2026-11-12.
- [x] CHK-003 [P1] The four open questions carry a decision line in `spec.md` and an ADR in `plan.md` (T005).
- [x] CHK-004 [P0] The storage and rank questions in `spec.md` have an operator answer. Evidence: 2026-11-12, "Sibling table (Recommended)" and "First, on a clear margin (Recommended)".
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] In `$ADV`, `npx tsc --noEmit` exits 0. Evidence: the package typecheck, `tsc --noEmit --composite false -p tsconfig.build.json`, exited 0 with no output, rerun on 2026-11-12.
- [x] CHK-011 [P0] No code comment names a spec path, a phase number or a task id: `rg -n "T0[0-9]{2}|REQ-0|specs/" <changed files>` prints nothing. Evidence: the added lines in the changed code and the new test hold no task id, REQ id, ADR id or spec path.
- [x] CHK-012 [P1] An absent embedder, database or vector falls back without an error (T016). Evidence: an embedder failure leaves no prompt embedding, so the lane adds no contribution. The test that scores whole prompts with no embedder and no stored vectors shows every passing command rests on an authored phrase. The default capture with an empty database reprinted the before numbers.
- [x] CHK-013 [P1] Command vectors reuse the existing refresh, hash and outage streak, with no new embedder (T009). Evidence: the refresh uses the same adapter and hash skip rule for commands. The outage streak was not reread.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] Holdout combined plain reach at least 5 of 44, false offers 0 of 35, typed at least 24 of 44 (T020). Not met: holdout reads 2 of 44. False offers 0 of 35 and typed 24 of 44 hold. The operator accepted the miss (ADR-009).
- [x] CHK-021 [P0] The default capture and the floor are unchanged (T021). Evidence: T021.
- [x] CHK-022 [P1] The anchor tests cover every matrix axis in `plan.md` (T016). Evidence: the 17 cases now cover absent vectors and no embedder (whole prompts with no stored vectors), read-only and mutating rows, and no-change prompts.
- [x] CHK-023 [P1] The hook stays inside the budget (T022). Evidence: T022.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [x] CHK-FIX-001 [P0] The gap is class `algorithmic`: the gate accepts one kind of anchor. Evidence: `algorithmic`, a second anchor source in one gate.
- [x] CHK-FIX-002 [P0] Every reader of the vector table is listed in `$S/vec-readers.txt` (T004). Evidence: T004.
- [x] CHK-FIX-003 [P0] Consumers of `requireCommandPhraseAnchor` and `readOnlyRouteAllowed` are checked: `rg -n "requireCommandPhraseAnchor|readOnlyRouteAllowed" $ADV --glob '*.ts' --glob '!dist'`. Evidence: the consumers are `fusion.ts`, `tests/scorer/route-gates.vitest.ts`, `tests/scorer/doctor-ordering.vitest.ts` and the new test file.
- [x] CHK-FIX-004 [P1] Matrix axes and row count from `plan.md` are listed in the test file header. Evidence: the test header lists six axes over eleven cases. They differ from the axes in `plan.md`, as CHK-022 records.
- [x] CHK-FIX-005 [P1] The suite passes with `VITEST` set and the real-embedding capture passes without it. Evidence: the suite passes (T024), and the real-embedding capture ran without `VITEST`.
- [ ] CHK-FIX-006 [P1] Not met: the evidence rests on the working tree over `5fc383f83a` until the phase commit, which follows this update.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] The scorer opens the database read-only: `rg -n "getDb\(" $ADV/lib/scorer` prints nothing new. Evidence: the scorer diff adds no `getDb(` call.
- [x] CHK-031 [P0] The private `/local-skilled-alignment` command has no vector row. Evidence: 0 ids in `vec_cmd_768` match `alignment` or `local-`.
- [x] CHK-032 [P1] Embedding text comes from tracked files only. Evidence: the text comes from tracked command metadata and doctor command files.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] `spec.md`, `plan.md`, `tasks.md` and `implementation-summary.md` state the same τ, m and numbers. Evidence: the documents state 0.72, 0.02, 2 of 44 and 14 of 45.
- [x] CHK-041 [P1] `$ADV/scripts/routing-accuracy/README.md` names the real-embedding mode and its exit 2. Evidence: `scripts/routing-accuracy/README.md:72`.
- [x] CHK-042 [P2] `$ADV/scripts/command-bridges/README.md` names the embedding text field. Evidence: `scripts/command-bridges/README.md:53`.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Timing runs, the tuning script and capture output live in `scratch/` only. Evidence: all timing, sweep and capture files are in `scratch/`.
- [x] CHK-051 [P1] `scratch/` holds only the evidence files the summary cites at completion. Evidence: `scratch/` holds the cited evidence. `tune-rows.jsonl` is the prompt list `hook-latency.mjs` reads (`hook-latency.mjs:37`). It was copied from phase 003 before the corpus gained a row, so it holds 44 prompts.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 11/12 |
| P1 Items | 13 | 12/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-11-12
<!-- /ANCHOR:summary -->

---

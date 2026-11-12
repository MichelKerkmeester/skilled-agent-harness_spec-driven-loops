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

- [ ] T001 Record the before numbers (`$S/before.json`). Verify: `node $C | $M` prints `{"correct":24,"total":44}`, a plain block with tune combined 9 and holdout combined 0, and `{"count":0,"total":35}`, and `$P` prints `[159,50,20,5]`.
- [ ] T002 Copy `../003-plain-chat-command-reach/scratch/hook-latency.mjs` to `$S/hook-latency.mjs` and run it three times (`$S/hook-latency-before-{1,2,3}.json`). Verify: `jq -c '[.n,.medianMs,.p95Ms]'` on each file prints 44 and two numbers.
- [ ] T003 Confirm the embedder. Verify: `curl -s localhost:11434/api/tags | jq -r '.models[].name'` lists a `nomic-embed-text` model. If it does not, stop and report.
- [ ] T004 Save every reader of the vector table (`$S/vec-readers.txt`). Verify: `rg -n "vecTableNameForDim|loadSkillEmbeddings" $ADV --glob '*.ts' --glob '!dist' --glob '!node_modules' > $S/vec-readers.txt` exits 0, and each line is marked `safe` or `needs skill-only filter`.
- [x] T005 Record the operator's answers to the four open questions (`spec.md`, `plan.md`). Verify: `rg -n "^- .*Decision:" spec.md` prints four lines and `rg -n "^### ADR-00[1-4]" plan.md` prints four lines. Evidence: accepted on 2026-11-12, "Accept all four (Recommended)".
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T006 In `D`, add an `embeddingText` field to each TypeScript-enabled entry whose id does not start with `command-doctor`. Build it from the command's metadata `description`, `userIntent.job` and `userIntent.ownedSignals`, joined with `. `, with every slash command string removed. Run `node $D` to regenerate `G`. Verify: `node $D --check` prints `fresh`, `jq '[.entries[] | select(.runtime.typescript.enabled and (.id | startswith("command-doctor") | not) and .embeddingText != null)] | length' $G` prints 10, and `jq -r '.entries[].embeddingText // empty' $G | grep -c '/[a-z-]*:'` prints 0.
- [ ] T007 In `D`, add `embeddingText` to each TypeScript-enabled doctor entry: the frontmatter `description` of `.skilled/commands/doctor/<name>.md` for its command, then its `_routes.yaml` `trigger_phrases`, joined with `. `. Run `node $D` to regenerate `G`. Verify: `node $D --check` prints `fresh`, and `jq '[.entries[] | select(.runtime.typescript.enabled and (.id | startswith("command-doctor")) and .embeddingText != null)] | length' $G` prints 35.
- [ ] T008 In `$ADV/lib/embedders/schema.ts`, add `ensureCommandVecTableForDim(db, dim)`, which creates `vec_cmd_<dim>` with the same columns and indexes as `ensureVecTableForDim` and no `REFERENCES` clause. Leave `ensureVecTableForDim` unchanged. Verify: `rg -n "REFERENCES" $ADV/lib/embedders/schema.ts` prints only the `vec_<dim>` line, and in `$ADV`, `npx vitest run tests/embedders` reports 0 failed.
- [ ] T009 In `refreshSkillEmbeddingsViaAdapter` (`DB`), call `ensureCommandVecTableForDim`, then after the skill loop embed each entry of `G` that has `embeddingText` into `vec_cmd_<dim>`, keyed by `runtime.typescript.id`, with the same content hash, skip rule and outage streak, and delete rows whose id is not in `G`. Leave the legacy refresh path unchanged. Verify: after a scan with Ollama running, `vec_cmd_<dim>` holds 45 rows, and a second scan embeds no command row.
- [ ] T010 In `loadSkillEmbeddings` (`DB`), also read `vec_cmd_<dim>` for the requested ids when that table exists, and return those rows in the same shape. Verify: in `$ADV`, `npx vitest run tests/skill-graph tests/skill-graph-db.vitest.ts tests/skill-graph-embedding-outage.vitest.ts` reports 0 failed.
- [ ] T011 In `requireCommandPhraseAnchor` (`F`), let a command row pass when its `semantic_shadow` contribution has evidence starting `cosine:`, a `rawScore` at or above `COMMAND_MEANING_MIN_COSINE` and a lead of at least `COMMAND_MEANING_MARGIN` over every other command row's `semantic_shadow` `rawScore`. Set its confidence to at least the confidence threshold, passed in from the call site at `fusion.ts:1369`. Add the two constants at 1.01 and 0, so nothing passes yet. Verify: in `$ADV`, `npx vitest run tests/scorer` reports 0 failed, and `node $C | $M` prints the T001 numbers.
- [ ] T012 In `F`, add `rankMeaningPassedCommandFirst(ranked)` and call it right after `keepPassingSkillsAboveDoctorBridges` near `fusion.ts:1375`. It moves a command that passed on meaning to first place only when its `semantic_shadow` cosine beats the top passing skill's cosine by `COMMAND_MEANING_MARGIN`, counting a top skill with no `semantic_shadow` contribution as 0. Otherwise the order is unchanged. Verify: in `$ADV`, `npx vitest run tests/scorer` reports 0 failed, and `node $C | $M` prints the T001 numbers.
- [ ] T013 In `C`, add a `--real-embedding` flag. With it, the capture does not set `VITEST`, `SYSTEM_SKILL_ADVISOR_DB_DIR` or `SKILL_ADVISOR_DISABLE_BUILTIN_SEMANTIC`, wraps each `scoreAdvisorPrompt` call in `withSemanticShadowPromptEmbedding`, refuses `--write`, and exits 2 with a message naming the missing piece when Ollama or the command vectors are absent. Add the flag to the `rejectUnknownOptions` list. Verify: with Ollama stopped, `node $C --real-embedding` exits 2 and names the embedder, and `node $C | $M` prints the T001 numbers.
- [ ] T014 Write `$S/tune-threshold.mjs`. It filters `command-prompts.jsonl` to rows with `split` equal to `tune`, or to the false-offer rows (`must-not-start`, `near-miss`, or `slash-variant` with no expected command), before it reads any prompt. For each row it records every command row's cosine, then prints tune reach and false offers for each τ from 0.50 to 0.90 in steps of 0.02 and each m in 0, 0.02, 0.05 and 0.10. Verify: `rg -n "holdout" $S/tune-threshold.mjs` prints nothing, `rg -n "split === 'tune'" $S/tune-threshold.mjs` prints the filter, and the output names the highest τ and its m that hold 0 of 35 false offers.
- [ ] T015 Set `COMMAND_MEANING_MIN_COSINE` and `COMMAND_MEANING_MARGIN` in `F` to the pair T014 named. Verify: `rg -n "COMMAND_MEANING_(MIN_COSINE|MARGIN) =" $F` prints the two values from the T014 output.
- [ ] T016 Write `$ADV/tests/command-meaning-anchor.vitest.ts` with injected vectors. Cases: a pass, a fail under τ, a fail inside the margin, `shadow:test-fallback` evidence never passes, an absent vector, an absent embedder, an absent database, `readOnlyRouteAllowed` unchanged, a command that beats the top skill by the margin ranks first, one inside the margin keeps its place, and a doctor row ranks first over a passing skill when it clears the margin. Verify: in `$ADV`, `npx vitest run tests/command-meaning-anchor.vitest.ts` reports 0 failed.
- [ ] T017 Only if T020 shows a false offer on a doctor row: in `D`, stop emitting `embeddingText` for doctor entries and regenerate `G`. Verify: `node $D --check` prints `fresh` and the T020 false-offer count reads 0 of 35.
- [ ] T018 [P] Document `--real-embedding` and its exit 2 in `$ADV/scripts/routing-accuracy/README.md`. Verify: `rg -n -- "--real-embedding" $ADV/scripts/routing-accuracy/README.md` prints at least one line.
- [ ] T019 [P] Document the `embeddingText` field in `$ADV/scripts/command-bridges/README.md`. Verify: `rg -n "embeddingText" $ADV/scripts/command-bridges/README.md` prints at least one line.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T020 Run the real-embedding capture (`$S/real-embedding.json`). Verify: `node $C --real-embedding > $S/real-embedding.json` exits 0, and `$M` over it shows holdout combined plain reach at least 5 of 44, tune combined at least 9 of 45, typed at least 24 of 44 and false offers 0 of 35.
- [ ] T021 Run the default capture and the floor. Verify: `node $C | $M` prints the T001 numbers and `$P` prints `[159,50,20,5]`.
- [ ] T022 Run `$S/hook-latency.mjs` three times (`$S/hook-latency-after-{1,2,3}.json`). Verify: the middle median is at most 25 ms over the T002 middle median, and the middle p95 at most 40 ms over the T002 middle p95.
- [ ] T023 Check policies. Verify: `node $D --check` prints `fresh` and the policy rollup still reads 17 ask, 7 run, 20 start.
- [ ] T024 Run the full suite and the metadata check. Verify: in `$ADV`, `npm test` reports 0 failed, and `node .skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs` reports `failed=0`.
- [ ] T025 Write `implementation-summary.md` and mark each row in `acceptance-criteria.md` with its evidence. Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh <this folder> --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] `$S/real-embedding.json` shows holdout combined plain reach of at least 5 of 44 with false offers 0 of 35
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

- [ ] CHK-001 [P0] The before numbers are in `$S/before.json` (T001).
- [ ] CHK-002 [P0] `curl -s localhost:11434/api/tags` lists a `nomic-embed-text` model (T003).
- [x] CHK-003 [P1] The four open questions carry a decision line in `spec.md` and an ADR in `plan.md` (T005).
- [x] CHK-004 [P0] The storage and rank questions in `spec.md` have an operator answer. Evidence: 2026-11-12, "Sibling table (Recommended)" and "First, on a clear margin (Recommended)".
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] In `$ADV`, `npx tsc --noEmit` exits 0.
- [ ] CHK-011 [P0] No code comment names a spec path, a phase number or a task id: `rg -n "T0[0-9]{2}|REQ-0|specs/" <changed files>` prints nothing.
- [ ] CHK-012 [P1] An absent embedder, database or vector falls back without an error (T016).
- [ ] CHK-013 [P1] Command vectors reuse the existing refresh, hash and outage streak, with no new embedder (T009).
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] Holdout combined plain reach at least 5 of 44, false offers 0 of 35, typed at least 24 of 44 (T020).
- [ ] CHK-021 [P0] The default capture and the floor are unchanged (T021).
- [ ] CHK-022 [P1] The anchor tests cover every matrix axis in `plan.md` (T016).
- [ ] CHK-023 [P1] The hook stays inside the budget (T022).
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [ ] CHK-FIX-001 [P0] The gap is class `algorithmic`: the gate accepts one kind of anchor.
- [ ] CHK-FIX-002 [P0] Every reader of the vector table is listed in `$S/vec-readers.txt` (T004).
- [ ] CHK-FIX-003 [P0] Consumers of `requireCommandPhraseAnchor` and `readOnlyRouteAllowed` are checked: `rg -n "requireCommandPhraseAnchor|readOnlyRouteAllowed" $ADV --glob '*.ts' --glob '!dist'`.
- [ ] CHK-FIX-004 [P1] Matrix axes and row count from `plan.md` are listed in the test file header.
- [ ] CHK-FIX-005 [P1] The suite passes with `VITEST` set and the real-embedding capture passes without it.
- [ ] CHK-FIX-006 [P1] Evidence names the commit it ran on.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] The scorer opens the database read-only: `rg -n "getDb\(" $ADV/lib/scorer` prints nothing new.
- [ ] CHK-031 [P0] The private `/local-skilled-alignment` command has no vector row.
- [ ] CHK-032 [P1] Embedding text comes from tracked files only.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] `spec.md`, `plan.md`, `tasks.md` and `implementation-summary.md` state the same τ, m and numbers.
- [ ] CHK-041 [P1] `$ADV/scripts/routing-accuracy/README.md` names the real-embedding mode and its exit 2.
- [ ] CHK-042 [P2] `$ADV/scripts/command-bridges/README.md` names the embedding text field.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Timing runs, the tuning script and capture output live in `scratch/` only.
- [ ] CHK-051 [P1] `scratch/` holds only the evidence files the summary cites at completion.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 1/12 |
| P1 Items | 13 | 1/13 |
| P2 Items | 1 | 0/1 |

**Verification Date**: 2026-11-12
<!-- /ANCHOR:summary -->

---

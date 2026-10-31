---
title: "Goal: Fix Phase: Fan-out Merge Under-count and Per-Iteration Steering"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "fanout merge fix goal"
  - "short registry reconstruction criteria"
  - "steer.md prompt goal"
  - "merge replay criteria"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "cli-jev/003-cli-jev-workflow-integration/015-fanout-merge-and-steering-fixes"
    last_updated_at: "2026-09-27T21:00:00Z"
    last_updated_by: "closure-leaf"
    recent_action: "Ticked all six criteria from the build evidence; amended D2's wording for a stale premise"
    next_safe_action: "None. The phase is closed; the orchestrator commits"
    blockers: []
    key_files:
      - "specs/cli-jev/003-cli-jev-workflow-integration/015-fanout-merge-and-steering-fixes/spec.md"
      - "specs/cli-jev/003-cli-jev-workflow-integration/015-fanout-merge-and-steering-fixes/acceptance-criteria.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-cli-jev-003-workflow-integration"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Should steering reach native lineages through a prompt-pack token"
      - "Should a partial rebuild replace the registry only on a zero gap, or combine with it by id"
      - "Should the kept-registry gap count only count-only iterations when structured and count-only records mix"
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Fix Phase: Fan-out Merge Under-count and Per-Iteration Steering

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> Everything between the frontmatter and the log is the DURABLE SLICE: it is
> what an operator sets as the session objective, and it must stay true for the
> life of the packet. The frontmatter above it is bookkeeping and never leaves
> this file: it is not sent in chat, not injected, not stored in an objective.
> Keep the slice short. A phase parent or top-level packet has one limit, 4000
> characters, measured from the frontmatter's closing fence to the log anchor.
> Up to 4000 passes and past it fails; the runtime goal surfaces cap what they
> hold, and a truncated objective loses its tail, which is where the criteria
> live.

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Make the `system-deep-loop` fan-out merge rebuild every count-only finding a research lineage's own files can account for and count the rest as a gap, and make each CLI lineage iteration read its lineage's `steer.md` when one exists.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Diagnose first: the replay of the current merge and its per-lineage table come before any code change |
| D2 | Change only `fanout-merge.cjs`, `fanout-run.cjs` and their two test files. The convergence check in `synthesis-closeout.cjs`, the prompt pack template and the native lineage path stay as they are |
| D3 | A short registry is rebuilt per iteration from markdown, graph, then delta evidence by exact count. The rebuild replaces the registry's findings only when it holds more, and every unrebuilt finding is counted in `reconstructionGaps` |
| D4 | Tests copy the records they need out of the committed lineage files. No test reads the spec folder at run time |
| D5 | No live fan-out run. The replay runs on temp copies and never writes the committed `research/` directories |

### Operator copy

The operator holds this directive as the session objective, and that copy is
what judges completion, not this file. Whenever anything above the log changes
(objective, a decision, the binding table, a criterion), resend this file's
chat slice so the operator can update their copy. The chat slice is the
durable slice without its frontmatter, HTML comments, anchor markers, `---`
dividers or heading section numbers, and `goal.cjs packet` prints it as
`chat_slice`. Never send more than 4000 characters: cut this file first. Keep
reminding while the copy stays unset, and never stop work for it. A child goal
change that alters a parent decision or criterion is an amendment to the
parent: apply it there first, then resend the parent.
<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

Three to seven bullets, each checkable without opening another file. Copy them
verbatim into the objective: nothing dereferences a path, so criteria left only
here are invisible to whatever judges completion.

- [x] Before any code change, the merge replay over temp copies of the three rounds' lineages prints `001-deep-research 85 0`, `004-deep-research-expansion 74 0` and `007-classifier-deep-research 65 0`
- [x] `npx vitest run --no-coverage tests/unit/fanout-merge.vitest.ts`, run from `.skilled/skills/system-deep-loop/runtime`, exits 0 with 0 failed and includes a "short registry" test and a "no iteration matches" test
- [x] After the fix, the replay prints round 1 `sourceFindings` at least 112 with `reconstructionGaps` 0, and rounds 2 and 3 `sourceFindings` above 74 and 65 with `reconstructionGaps` above 0
- [x] `npx vitest run --no-coverage tests/unit/fanout-run.vitest.ts -t "steer.md"` exits 0 and asserts a CLI lineage prompt names its `steer.md` by absolute path with the words "when it exists"
- [x] `git status --short -- 'specs/cli-jev/003-cli-jev-workflow-integration/*/research'` prints nothing after the replay
- [x] `validate.sh --strict` on this phase prints `RESULT: PASSED`
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
| Planning documents | Done | `spec.md`, `plan.md`, `tasks.md`, `acceptance-criteria.md`, this goal and `implementation-summary.md` authored on 2026-09-27 |
| Evidence reopened | Done | `fanout-merge.cjs:187-214`, `:760-767`, `:1040-1079`, `:1126-1144` and `:1210-1233`. `fanout-run.cjs:1406-1525`, `:1527` and `:3260` (at the build base `6f47c32dce` the call site is `:3267`). `deep-research-auto.yaml:2215-2216` (the build found no convergence check there: it is `synthesis-closeout.cjs:347-359`). Each round's `research/deep-research-state.jsonl` line 1 holds the `synthesis_incomplete` event |
| Read-only replay of the current merge | Done | Temp copies in the session scratchpad printed 85, 74 and 65 with `reconstructionGaps` 0 and no `lineage_reconstruction_failed` warning, so reconstruction never ran |
| Owner history | Done | `git log -5` on `fanout-merge.cjs`: only `ec33385ae5` (2026-09-17, path move). On `fanout-run.cjs`: `9fe8526284` (2026-09-26) here, and `main` has `ac156a7112` (2026-09-27) instead |
| BASE and roster commits (T001) | Done | `BASE` = `6f47c32dce`. Both `git merge-base --is-ancestor` checks printed `both`; `git diff --stat main 6f47c32dce -- fanout-run.cjs` was empty. Source: orchestrator build evidence, 2026-09-27 |
| Baselines (T002) | Done | Three files `Tests 214 passed (214)`. Full suite `Test Files 155 passed (155)`, `Tests 2708 passed \| 8 skipped (2716)`. Source: orchestrator build evidence, 2026-09-27 |
| Diagnosis replay and table (T003, T004) | Done | The `BASE` script printed 85 0, 74 0 and 65 0, each merge exit 0. The per-lineage table is in `implementation-summary.md`; unmatched totals 0, 13 and 38. Source: orchestrator build evidence, 2026-09-27 |
| Briefs 04, 05, 06 | Done | cursor Grok 4.7 xhigh fast, 231 s, 318 s and 72 s. Each `node --check` exit 0; the orchestrator verified each diff. Source: orchestrator build evidence, 2026-09-27 |
| New tests fail on the pre-fix script (AC-002) | Done | With the `BASE` script swapped in: `Tests 2 failed \| 57 skipped (59)`, exit 1; restore byte-identical. After the follow-up briefs the same check over four titles printed `Tests 4 failed \| 57 skipped (61)`, exit 1. Source: orchestrator build evidence, 2026-09-27 |
| First full suite | Failed, repaired | `Tests 1 failed \| 2710 passed \| 8 skipped (2719)`, exit 1: the existing legacy shadow parity test in `result-envelopes.vitest.ts`. Repaired by brief 15. Source: orchestrator build evidence, 2026-09-27 |
| Cross-family review | Done | The `review` agent on Claude Opus 5.5 over the uncommitted diff: no P0 or P1, five P2s and two test gaps. Source: orchestrator build evidence, 2026-09-27 |
| Follow-up briefs 15, 14, 12, 13 | Done | cursor Grok 4.7, 118 s, 107 s, 67 s and 126 s. Parity restored: `result-envelopes.vitest.ts` plus `fanout-merge.vitest.ts` `Tests 90 passed (90)`, exit 0. Brief 13's revert test failed only its own test. Source: orchestrator build evidence, 2026-09-27 |
| Final tests (T012) | Done | Three files `Tests 219 passed (219)`, exit 0. Full suite `Test Files 155 passed (155)`, `Tests 2713 passed \| 8 skipped (2721)`, exit 0. Source: orchestrator build evidence, 2026-09-27 |
| Final replay (T013, T014) | Done | 134 0, 105 13 and 168 38, each merge exit 0 with 0 `lineage_reconstruction_failed` warnings. The `research/` git status printed nothing. Source: orchestrator build evidence, 2026-09-27 |
| Comment hygiene and syntax (T015, CHK-010) | Done | The step 10 grep printed nothing (exit 1). `node --check` on both scripts exit 0. Source: orchestrator build evidence, 2026-09-27 |
| Build commit | Done | `7de30fb16f`, four files: `fanout-merge.cjs` +126/-27, `fanout-run.cjs` +9/-0, `fanout-merge.vitest.ts` +205/-0, `fanout-run.vitest.ts` +14/-0 |
| Phase docs | Done | Closure leaf, 2026-09-27: tasks, acceptance criteria, this log and `implementation-summary.md` record the evidence. The gate results are in `implementation-summary.md` Verification |

### Deviations and findings

| Item | Note |
|------|------|
| Cause located before the build | The gate at `fanout-merge.cjs:1210` reconstructs only an empty registry. Every short lineage wrote a non-empty one: round 1 deepseek 8 of 57, round 2 deepseek 21 of 41, grok 7 of 21 and swe 20 of 30, round 3 deepseek 13 of 83, grok 9 of 35 and swe 10 of 55. The build's diagnosis still runs first (D1) |
| Delta records | The lineages' `deltas/iter-NNN.jsonl` hold `type: "finding"` records whose per-iteration count matches `findingsCount` for 106 of 112, 100 of 118 and 126 of 173 count-only findings (leaf's scratch count). The markdown parser matches far fewer, for example 0 of 10 iterations for round 3 deepseek |
| Preliminary expected numbers | A scratch script applying D3's rule predicts round 1 `sourceFindings` 134 with gap 0, round 2 105 with gap 13 and round 3 168 with gap 38. Round 1's 134 includes grok's 22 structured findings. These are the leaf's estimate, and the build's table is the authority |
| Round 3 figure | The brief and `007-classifier-deep-research/implementation-summary.md:113` say 57 of 173. 57 is `registryFindingCount`. The convergence check compares `sourceFindingCount`, which the event records as 65 |
| Collision | At planning, `fanout-run.cjs` differed between this branch and `main` by 11 lines from two Grok 4.7 roster commits. Gone by the build: at `6f47c32dce` both commits are ancestors and the diff against `main` is empty. Source: orchestrator build evidence, 2026-09-27 |
| Steering scope | A CLI lineage runs all its iterations from one prompt, so the steering line goes in `buildLoopPrompt`. Round 3's five lineages were all CLI kinds (`cli-pi`, `cli-cursor`, `cli-devin` per `invocation-metadata.json`). Native lineages get `buildNativeCommandInput` and are left for a separate design |
| Scaffold title | `create.sh` titled the scaffold "Phase 6". The folder is phase 15 of 17, and the titles now name the fix |
| Test titles | The acceptance filters use the test title words "short registry", "no iteration matches" and "steer.md". This is the leaf's choice, and the build may rename them only with the criteria |
| Amendment: D2 wording | D2 named "the workflow YAML convergence check". The check is at `synthesis-closeout.cjs:347-359`, not in `deep-research-auto.yaml` or `deep-research-confirm.yaml`. The decision is unchanged, and `7de30fb16f` leaves that file alone. Source: orchestrator build evidence, 2026-09-27, stale premise 3 |
| Executor switch | The brief index named codex gpt-5.5 (04 and 05 high, 06 medium). Codex hit its usage limit, so briefs 04 to 06 and 12 to 15 ran on cursor Grok 4.7 xhigh fast, verified the same way. Source: orchestrator build evidence, 2026-09-27 |
| Parity regression and repair | Brief 04 added the gap metrics to the exported `reconstructResearchRegistryFromState`, which the TypeScript shadow mirrors, and the full suite failed its parity test. The shadow is outside D2, so brief 15 moved the body to the internal `rebuildResearchRegistryFromState` that `main` calls and kept the export legacy-shaped. Source: orchestrator build evidence, 2026-09-27 |
| Five new tests, not three | The index expected baseline + 3. The review's gaps added the throw-gap test (brief 13) and the symlinked-delta test (brief 14). Source: orchestrator build evidence, 2026-09-27 |
| "short registry" matches two tests | Brief 05 expected `grep -c "short registry"` 1; it prints 2, because brief 04's no-match title holds the phrase. `-t "short registry"` runs 2 tests. Source: orchestrator build evidence, 2026-09-27 |
| Review P2 fixed: gap on a throw | A kept registry got no gap when the rebuild threw on a structured-count mismatch. REQ-004 says "either way", so brief 13 records the gap for any `registryCount > 0`. Source: orchestrator build evidence, 2026-09-27 |
| Review P2 fixed: stale comments | The `@returns` JSDoc (brief 15) and the `main` comment (brief 12). Source: orchestrator build evidence, 2026-09-27 |
| Review P2 kept: kept-registry gap undercount | The gap is the count-only sum minus the whole registry count, which undercounts when structured and count-only iterations mix. It is AC-004's formula, and no committed lineage mixes them. Owner item. Source: orchestrator build evidence, 2026-09-27 |
| Review P2 kept: partial rebuild replaces the registry | A rebuild that holds more replaces the registry and drops the registry's own findings. D3 and REQ-004 require this. Owner design question. Source: orchestrator build evidence, 2026-09-27 |
| Review P2 kept: delta checks only on rebuild | A symlinked delta in a lineage that needs no rebuild passes, because no delta file is read then (brief 05, NFR-P01). Nothing is read through the link. Owner item. Source: orchestrator build evidence, 2026-09-27 |
| No-match test asserts metrics only | Its registry holds bare strings, which the merge drops from `keyFindings`. A stated brief-index choice, left as is. Source: brief index design choices and orchestrator build evidence, 2026-09-27 |
| Structured-count throw kept | Brief 04 keeps one throw, a structured-array count mismatch, because the existing `lineage_reconstruction_failed` test depends on it and AC-005 needs it green. Source: brief index design choices |
| Missing registry with no match | It used to throw and be skipped with a warning. It now merges with 0 findings and a counted gap, REQ-004's intent. REQ-002 still holds when evidence matches. Source: brief index design choices |
| Bare-string registry findings | Round 3 grok's registry `keyFindings` are bare strings; `mergeResearchRegistries` drops them while `sourceFindings` counts them. Predates this phase, out of scope. Source: brief index design choices |
| Stale premises corrected | The 11-line `main` difference is gone; the call site is `:3267`; the convergence check is in `synthesis-closeout.cjs`; `../changelog/` does not exist, so there is nothing to refresh. Corrected in `spec.md`, `plan.md` and this log. Source: orchestrator build evidence, 2026-09-27 |
| Rounds 2 and 3 stay `synthesis_incomplete` | Both still raise `state_finding_reconstruction_gap`, and their `sourceFindings` (105, 168) stay below the recorded count-only totals (118, 173). The evidence named round 3 only for the count-only invariant; round 2 follows from the same comparison. Expected: the gap is named, not closed |
| T005 order | The short-registry test was written in brief 05 together with the delta reader, not before it. Its failure on the pre-fix script was proven afterwards by the revert test. Source: orchestrator build evidence, 2026-09-27 |
| Criterion 2 and 4 evidence | Recorded at `7de30fb16f` after the first closure. Criterion 2: `fanout-merge.vitest.ts` run alone printed `Test Files 1 passed (1)`, `Tests 61 passed (61)`, exit 0, against a baseline of 57 `it(` blocks at `6f47c32dce`. Criterion 4: `-t "steer.md"` printed `Tests 1 passed \| 153 skipped (154)`, exit 0. Source: orchestrator build evidence at `7de30fb16f`, 2026-09-27 |
| `scratch/briefs/` kept | CHK-051 asks for a clean `scratch/`. The briefs stay as the executors' record, as in phases 012 to 014. Source: orchestrator instruction |
<!-- /ANCHOR:log -->

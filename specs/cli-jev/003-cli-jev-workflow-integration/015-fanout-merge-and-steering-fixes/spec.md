---
title: "Fix Phase: Fan-out Merge Under-count and Per-Iteration Steering"
description: "The fan-out merge rebuilt fewer findings than the lineages recorded in all three research rounds of this packet, because it reconstructs a lineage only when that lineage's own registry is empty. Round 3's lead reviews reached iterations only sometimes, because a CLI lineage prompt never names the lineage's steer.md. This phase plans a diagnosis on the committed lineage files, then the merge fix with a regression test built from them. It also adds one prompt instruction."
trigger_phrases:
  - "fanout merge under-count"
  - "count-only findings not reconstructed"
  - "synthesis_incomplete fan-out merge"
  - "lineage steer.md per iteration"
  - "buildLoopPrompt steering"
  - "fanout-merge reconstruction gap"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Fix Phase: Fan-out Merge Under-count and Per-Iteration Steering

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-09-27 |
| **Branch** | `worktrees/069-cli-jev-workflow-integration` |
| **Parent Spec** | ../spec.md |
| **Phase** | 15 of 17 |
| **Predecessor** | 014-sk-design-doc-and-routing-check |
| **Successor** | 016-deem-local-hardening |
| **Handoff Criteria** | A merge replay over temp copies of the three rounds' lineages prints round 1 `sourceFindings` at least 112 with `reconstructionGaps` 0. The new merge and prompt tests pass. `git status --short` shows no change under the three committed `research/` directories |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 15** of the cli-jev workflow integration specification. It is one of the owner fixes found while this packet ran its three deep-research rounds. Every file it changes belongs to `system-deep-loop`, and the build follows that skill's contracts: `deep-research/SKILL.md`, the state format in `deep-research/references/state/state-jsonl.md` and the existing tests under `runtime/tests/`. No classifier is involved, and no step makes a model call.

**Scope Boundary**: Two changes inside `system-deep-loop/runtime/scripts/`. `fanout-merge.cjs` rebuilds count-only findings from a lineage's own evidence when its registry is short, not only when it is empty. `fanout-run.cjs` tells a CLI lineage to read its `steer.md` before each iteration. The workflow YAML, the prompt pack template and the native lineage path stay as they are.

**Dependencies**:
- The lineage files of all three rounds stay committed under `001-deep-research/research/`, `004-deep-research-expansion/research/` and `007-classifier-deep-research/research/`. The diagnosis and the regression fixture are built from them
- `fanout-run.cjs` differs between this branch and `main` by 11 lines (`git diff --stat HEAD main`, 2026-09-27): `main` carries `ac156a7112` and this branch `9fe8526284`, two separate Grok 4.7 roster commits. The build starts from a tree that holds both

**Deliverables**:
- A diagnosis table in `implementation-summary.md`, one row per lineage per round, taken before any code change
- The merge fix in `fanout-merge.cjs` with regression tests in `fanout-merge.vitest.ts`
- One steering instruction in `buildLoopPrompt` with a test in `fanout-run.vitest.ts`

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

In all three research rounds of this packet, `step_convergence_report` recorded `synthesis_incomplete` with the single invariant `count_only_state_findings_not_reconstructed`. The merge rebuilt fewer count-only findings than the lineages recorded. The recorded events in each round's `research/deep-research-state.jsonl` line 1 say so:

| Round | `countOnlyFindingCount` | `sourceFindingCount` | `registryFindingCount` | Short lineages (registry against state count) |
|-------|------------------------|----------------------|------------------------|-----------------------------------------------|
| 1 (`001-deep-research`) | 112 | 85 | 85 | deepseek 8 of 57 |
| 2 (`004-deep-research-expansion`) | 118 | 74 | 74 | grok 7 of 21, swe 20 of 30, deepseek 21 of 41 |
| 3 (`007-classifier-deep-research`) | 173 | 65 | 57 | deepseek 13 of 83, grok 9 of 35, swe 10 of 55 |

The completed packet `specs/system-deep-loop/036-deep-loop-innovation/002-substrate-and-orchestration/005-fanout-fanin-durable-orchestration/007-fanout-synthesis-lineage-aggregation` added count-only reconstruction (its `tasks.md` T004 and T009) for a registry that is missing or empty. The loss remains because of the gate at `fanout-merge.cjs:1210`: `if (loopType === 'research' && !hasUsableResearchFindings(registry))`. `hasUsableResearchFindings` (`:1126-1129`) is true for any non-empty `keyFindings` or `findings` array. Every short lineage above wrote its own registry with a few summary findings, so reconstruction never ran for it. The per-lineage sum at `:760-763` then counts the short registry.

A read-only check on 2026-09-27 supports this. Running the current `fanout-merge.cjs` over temp copies of each round's `lineages/` reproduced `sourceFindings` 85, 74 and 65 with `reconstructionGaps` 0 and no `lineage_reconstruction_failed` warning, so reconstruction did not run at all. The diagnosis step (REQ-001) confirms this on the build's own run before any code changes.

Two more gaps sit behind the gate:
- The evidence reconstruction reads is narrow. It matches a count against `## Findings` items shaped `### N.` or `N.` (`:187-214`) or against `FINDING` graph events (`:1053-1063`). Round 3's deepseek writes findings as bold `**F1 ...**` paragraphs, and swe and round 1 mimo have no `## Findings` heading. Each lineage's `deltas/iter-NNN.jsonl` holds `type: "finding"` records, which the iteration prompt pack asks for (`deep-research/assets/prompt-pack-iteration.md.tmpl`, output contract item 3), and the merge never reads them.
- One iteration whose count matches no evidence throws (`:1048`, `:1069-1073`). The catch at `:1216-1227` then drops the whole lineage's reconstruction, and `:1230` sets `reconstructionGaps` to 0 even when some findings went unrebuilt.

Round 3 had a second defect. Each lineage had a lead that appended a review of every iteration to `research/lineages/<label>/steer.md`, and the round's decision D6 assumed each iteration reads it first. It did not. `007-classifier-deep-research/goal.md` records under Steering reach that lineages "checked the file only sometimes, several writing 'no `steer.md`' while it existed". The grok lead confirmed one read, at iteration 7 (`lineages/grok/steer.md:105`). The cause is structural. A CLI lineage is one subprocess that runs every iteration inline (`fanout-run.cjs:1431-1443`), and its only instruction is the prompt `buildLoopPrompt` builds once per attempt (`:3260`). That prompt (`:1406-1524`) never names a steering file.

### Purpose

The merge rebuilds every count-only finding the lineage's own files can account for, and names the rest as a counted gap. Each CLI lineage iteration reads the lineage's `steer.md` when one exists.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A read-only diagnosis over the committed lineage files of all three rounds, recorded before any code change
- Reconstruction for a lineage whose registry holds fewer findings than its state log's count-only total
- Delta `finding` records as a third evidence source, matched per iteration by exact count
- Per-iteration reconstruction: rebuild the iterations that match, count the rest in `metrics.reconstructionGaps`
- Regression tests built from records copied out of the committed lineage files
- One conditional steering instruction in `buildLoopPrompt` for CLI lineages, with a test

### Out of Scope
- Widening the markdown findings parser to `### F1.` or `**F1 ...**` shapes. The delta source covers these rounds without new regex, and the diagnosis table decides whether any round needs more
- The convergence check in `.skilled/commands/deep/assets/deep-research-auto.yaml:2215-2216` and `deep-research-confirm.yaml:1683-1684`. It detected the loss correctly and stays as it is
- Native lineages. They receive `buildNativeCommandInput` (`fanout-run.cjs:1527`) instead of the loop prompt. They run the command's per-iteration prompt pack. Steering there needs a new prompt-pack token, which is a separate design
- A live fan-out run to measure steering reach. The parent goal allows no model call in this phase, so reach is measured on the next real research run
- Re-running synthesis for rounds 1 to 3. Each synthesis read every iteration file directly, so its ranking stands
- The owner's changelog and release entry, which `system-deep-loop` writes on its own schedule

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs` | Modify | Reconstruct a short registry, read delta `finding` records, rebuild per iteration and count gaps. Owner: `system-deep-loop` |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/fanout-merge.vitest.ts` | Modify | Regression tests from committed lineage records. Owner: `system-deep-loop` |
| `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` | Modify | One conditional `steer.md` line in `buildLoopPrompt`. Owner: `system-deep-loop` |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/fanout-run.vitest.ts` | Modify | Prompt test for the steering line. Owner: `system-deep-loop` |
| `specs/cli-jev/003-cli-jev-workflow-integration/015-fanout-merge-and-steering-fixes/implementation-summary.md` | Modify | Diagnosis table and replay results |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Diagnose first. Before any code change, a read-only replay over temp copies of the three rounds' committed `lineages/` records per lineage the registry finding count and the state log's count-only total. It also records per iteration whether markdown, delta or graph evidence matches `findingsCount`. The replay reproduces `sourceFindings` 85, 74 and 65. The table goes in `implementation-summary.md` |
| REQ-002 | A research lineage whose registry holds fewer findings than the sum of `findingsCount` over its count-only iteration records is reconstructed. An empty or missing registry keeps today's behavior |
| REQ-003 | Reconstruction reads the lineage's `deltas/iter-NNN.jsonl` `type: "finding"` records as a third source beside markdown and graph events. The iteration comes from the record's `iteration` field, else from the file name. The text comes from `title`, `label`, `finding` or `text` |
| REQ-004 | An iteration whose count matches no source no longer discards the lineage. The merge rebuilds the matching iterations and uses them when they outnumber the registry's findings. Otherwise it keeps the registry. Either way it writes the unrebuilt count to `metrics.reconstructionGaps` instead of 0 |
| REQ-005 | Regression tests in `fanout-merge.vitest.ts`, built from records copied out of the committed lineage files, cover a short registry that is rebuilt and an edge case where no iteration matches. Every existing test in the file still passes |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-006 | `buildLoopPrompt` tells a CLI lineage to read `<lineageDir>/steer.md` before each iteration when the file exists. The lineage treats it as review input that never overrides the angle or the workflow contract, and lists it among the iteration's sources when read. A test covers the line and its conditional wording |
| REQ-007 | After the fix, the replay over temp copies prints round 1 `sourceFindings` at least 112 with `reconstructionGaps` 0. It prints rounds 2 and 3 above 74 and 65 with `reconstructionGaps` equal to the unmatched totals in the REQ-001 table. The committed `research/` directories stay unchanged |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Round 1's replay rebuilds all 112 count-only findings, and rounds 2 and 3 name every finding they cannot rebuild in `reconstructionGaps`. A preliminary count by the authoring leaf, applying the planned rule in a scratch script, gives round 2 `sourceFindings` 105 with gap 13 and round 3 168 with gap 38. The build's REQ-001 table is the authority
- **SC-002**: A CLI lineage prompt names its own `steer.md` by absolute path, and the merge and prompt test files pass under `npx vitest run --no-coverage`
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The committed lineage files of rounds 1 to 3 | Without them the diagnosis and the fixture have no source | They are tracked (`git ls-files` counts 108, 100 and 223 files under the three `lineages/`). The fixture copies the records it needs into the test, so a later archive of this packet cannot break it |
| Dependency | `fanout-run.cjs` differs between this branch and `main` | A build on one side conflicts on merge | Start from a tree that holds both roster commits, and keep the steering edit inside `buildLoopPrompt` |
| Risk | Rebuilt findings replace a lineage's hand-written summary findings | The merged registry loses those summaries | They restate iteration findings. Replacement happens only when the rebuild yields more findings, and questions and ruled-out directions still come from the registry (`mergeReconstructedResearchRegistry`, `:1131-1144`) |
| Risk | Same-id rebuilt findings from different lineages, such as `iteration-1-finding-1` | Two lineages collide on an id | The merge already keeps both sides of a same-id content conflict (`fanout-merge.vitest.ts:194` and `:1206`). The regression test asserts no rebuilt finding is lost |
| Risk | A lineage ignores the steering line mid-run | Steering still reaches iterations only sometimes | The line is one sentence, and the iteration's sources show whether it read the file. If the next real run shows misses, the prompt-pack token for native and CLI paths is the follow-up design |
| Risk | A delta file holds records that are not findings or has a malformed line | Wrong counts | Only `type: "finding"` records count. A malformed line fails that iteration's match and becomes a counted gap, never a crash |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The merge reads delta files only for a lineage that needs reconstruction. A lineage whose registry already matches its state count reads no delta file
- **NFR-P02**: The prompt grows by one instruction of at most 3 lines

### Security
- **NFR-S01**: Delta files load through the same real-path and symlink guards as iteration files (`requireRealDirectory`, `resolveOptionalRealFile`, `fanout-merge.cjs:120-146`)
- **NFR-S02**: The steering line names a path inside the lineage directory and grants no new write scope

### Reliability
- **NFR-R01**: One lineage's bad evidence never aborts the merge for other lineages, as today (`:1211-1214`)
- **NFR-R02**: Merge output stays byte-identical across lineage arrival order (`fanout-merge.vitest.ts:266`)
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty input: a lineage with no count-only iteration records is merged from its registry alone, as today
- Maximum length: none. The rebuild is bounded by the lineage's own `findingsCount` sum
- Invalid format: a delta line that does not parse, or a finding record without text, fails only that iteration's match and counts toward the gap

### Error Scenarios
- External service failure: none. The merge and the prompt builder read local files only
- Network timeout: none
- Concurrent access: the merge runs once after all lineages finish, as today

### State Transitions
- Partial completion: some iterations match and some do not. The merge rebuilds the matching ones, counts the rest as the gap and never throws for the lineage
- Session expiry: a lineage retried by the pool gets the same prompt, so the steering line survives a retry
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 8/25 | Two scripts and two test files in one skill, an estimated 80 to 140 changed lines |
| Risk | 8/25 | Changes what the merged registry holds, which synthesis reads. No schema or public field changes |
| Research | 6/20 | The cause is located. The build confirms it on the committed files first |
| **Total** | **22/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- Should the unrebuilt round 3 grok findings (35 counted and 9 in its registry, with no iteration whose delta or markdown count matches) count as a lineage defect for the executor report? The merge can only name the gap.
- Should the owner extend steering to native lineages through the prompt pack? This phase leaves native lineages as they are.
<!-- /ANCHOR:questions -->

---

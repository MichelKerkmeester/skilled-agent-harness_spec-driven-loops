---
title: "Implementation Plan: Phase 6: deep-loop-follow-ups"
description: "The deep-review reducer gains a parser for the numbered finding shape the agent writes, used only for iterations without structured finding rows, and the cli-pi environment filter gains an exact-key pass-through for PI_BLACKHOLE_PASSIVE. Eight tests cover both, and the cli-pi docs, versions and changelogs follow."
trigger_phrases:
  - "deep loop follow ups plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 6: deep-loop-follow-ups

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node CommonJS (`reduce-state.cjs`), TypeScript run through the `tsx` loader (`executor-audit.ts`, no build output), Markdown skill docs |
| **Framework** | Vitest 4.1.11 from the system-deep-loop runtime package; `tsc --noEmit` through `npm run typecheck` |
| **Storage** | None |
| **Testing** | Runtime vitest files for the reducer and executor-audit, the out-of-runtime reducer tests, `validate_document.py`, routing and mirror checks |

### Overview
`parseFindingsBlock` in `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs` (line 258 when read) reads only `- **F###**:` bullets, while the deep-review agent writes `N. **Title** -- file:line -- Description` with indented evidence lines. This phase adds a numbered-line parser, gives each numbered finding the delta-row id `R<iteration>-<severity>-<NNN>`, and uses a numbered finding only for an iteration that recorded no delta finding rows and no `findingDetails`. In `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts`, a new exact-key map lets `PI_BLACKHOLE_PASSIVE` through for cli-pi only. The runtime lib is not compiled: `fanout-run.cjs:3161` imports the `.ts` file directly through `tsx`, so there is no build output to regenerate. Every edit is quoted in full in `scratch/dispatch-units.json`, one unit per task.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Tests passing (if applicable)
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
In-place extension of an existing reader and an existing allowlist, each with regression tests, plus doc alignment and versioning

### Key Components
- **`parseNumberedFindingLine` (new, `reduce-state.cjs`)**: placed directly above `parseFindingsBlock`. It matches `^\d+\.\s+\*\*(.+?)\*\*` followed by optional `--`, em dash or `-` separated evidence and description, and reuses the evidence split of `parseFindingLine` (`:228`), so `file:12-24` gives file and line 12 the same way. The em dash is written `\u2014` in the regex.
- **`numberedNarrativeFindings` (new `WeakSet`)**: marks the finding objects the numbered parser made. It adds no field to a finding, so the registry JSON keeps its shape.
- **`parseFindingsBlock` (rewritten)**: one loop. A trimmed `- **F###**` line goes to `parseFindingLine` exactly as before. A line that starts at the left margin with `N. **` goes to the numbered parser. Evidence lines never start with a number and a period, and nested lists and the claim-adjudication JSON are indented, so they are skipped. A third parameter `run` (default `0`) builds the id.
- **`parseIterationFile`**: computes `const run = runMatch ? Number(runMatch[1]) : 0;` and passes it to the three `parseFindingsBlock` calls. Its returned `run` field is unchanged.
- **`buildFindingRegistry`**: before the narrative loop, it collects `structuredRuns`, the runs with delta finding rows or an `iteration` record whose `findingDetails` is a non-empty array, from both `iterationRecords` and `deltaRecords`. A numbered finding from such a run is skipped. `- **F###**:` findings are never skipped.
- **`EXECUTOR_ENV_KEYS_BY_KIND` (new, `executor-audit.ts`)**: placed after `EXECUTOR_ENV_PREFIXES_BY_KIND` (which closes at line 177), with `'cli-pi': ['PI_BLACKHOLE_PASSIVE']`. `isAllowedExecutorEnvKey` (`:207` to `:212`) checks it before the prefix list.
- **Review-mode contract header (handed over by the orchestrator)**: lines 2 to 4 of `.skilled/skills/system-deep-loop/deep-review/assets/review-mode-contract.yaml` call the file "the single source of truth for review-mode taxonomy". The review-mode child (002) is making `.skilled/skills/sk-code/sk-code-review/references/review-core.md` the owner of the severity ids P0, P1 and P2 and their meaning. The three comment lines become seven: the file stays the source of truth for this loop's taxonomy, names `review-core.md` as owner of the severity ids and meanings, and says its `severities` block adds loop rules on top, such as weights and `requiresFileLineEvidence: true` for P2 (review-core requires `file:line` only for P0 and P1, `review-core.md:46`). Only comments change, so the parsed contract, the rendered snapshot (`render-contract-snapshot.cjs --check` read `OK` on a patched copy) and the parity test's substring checks are unaffected.
- **Tests**: a new `describe('reduceReviewState: numbered finding narrative')` appended to `deep-review-state-reducer.vitest.ts` (5 cases, file goes from 6 to 11 tests), and a new `describe('executor-audit: cli-pi environment filter')` appended to `executor-audit.vitest.ts` (3 cases, file goes from 49 to 52). Both use only imports and helpers the files already have.

### Decisions
- **D1, the id format.** A numbered finding gets `R<iteration>-<severity>-<NNN>`, NNN being its position in its severity block. That is the id convention the review prompt pack shows for delta rows (`deep-review/assets/prompt-pack-iteration.md.tmpl`, delta example `"id":"R3-P1-001"`), so a later iteration's `resolvedFindings` can name it. The test `gives a numbered finding the delta-row id, so a later resolution closes it` fails without it.
- **D2, structured rows first.** A first probe without this rule changed 14 of the 164 real review folders in this repository and flagged 80 of 106 added findings as restatements of findings already held in delta rows or `findingDetails`, under titles that differ only in backticks or quotes. With the rule, 162 folders are unchanged and the two that change had iterations with summary counts only. The code already calls narrative "a compatibility fallback" (`reduce-state.cjs`, comment above `deltaFindingsByRun`).
- **D3, margin lines only.** A numbered line opens a finding only at column 0. Reading trimmed lines instead counted an indented nested step as a finding (`expected 3 to be 2` in a mutation probe).
- **D4, exact key, not prefix.** The cli-pi prefix list states its own evidence bar, and a prefix `PI_BLACKHOLE_` would admit any future variable sharing it. The test passes `PI_BLACKHOLE_PASSIVE_EXTRA` and expects it stripped.
- **D5, the envelope too.** The cli-pi `v1.5.4.0` changelog says the dispatch envelope "does not carry this variable yet"; this phase adds it to the envelope in `references/providers-and-models.md`, which this child owns.
- **D6, versions.** Both are patch bumps per `sk-create-changelog` section 4 (bug fix): cli-pi 1.5.13.0 to 1.5.14.0 (its version lives only in `SKILL.md` frontmatter) and the deep-loop runtime 1.9.2.0 to 1.9.3.0 (its version lives only in its changelog; component name `deep-loop-runtime`). Both use the compact changelog format. `.skilled/changelog/cli-pi` and `.skilled/changelog/runtime` are symlinks to the packet folders, so the packet path is the global path.
- **D7, deep-review version.** The YAML header and the README row change a shipped asset and a doc of the deep-review packet, so the shared versioning rule applies. `sk-create-changelog` section 4 maps docs to a patch bump: `.skilled/skills/system-deep-loop/deep-review/SKILL.md` goes from 1.11.3.0 to 1.11.4.0 (the version lives only in that frontmatter line and in the changelog), with the compact entry `.skilled/skills/system-deep-loop/deep-review/changelog/v1.11.4.0.md`. The README row now reads like the new header: the YAML owns the loop's dimensions, verdicts, gates, lifecycle modes and stricter loop rules, and `review-core.md` owns the severity ids and meanings.

### Data Flow
`reduceReviewState` reads the state log, delta files and `iterations/iteration-NNN.md`. `parseIterationFile` now yields F### and numbered findings. `buildFindingRegistry` upserts delta findings first, then narrative findings (numbered ones only for runs without structured rows), then summary fallbacks, which count what is already represented. `verify-iteration.cjs:210` also calls `parseIterationFile`, so an iteration whose only findings are numbered now counts as enumerated, which is what its comment asks for. For cli-pi, `fanout-run.cjs:3528` builds the child env with `buildExecutorDispatchEnv(lineage, process.env)`, and `runAuditedExecutorCommand` (`executor-audit.ts:1139`) does the same, so a variable exported in the dispatching shell now reaches the child.

### Handoffs
- Received: the orchestrator assigned the header of `.skilled/skills/system-deep-loop/deep-review/assets/review-mode-contract.yaml` to this child, on behalf of the review-mode child (002). No other child owns `deep-review/`.
- Received next: the README row for the contract (`.skilled/skills/system-deep-loop/deep-review/README.md:260`) and the deep-review versioning, also handed over by the orchestrator.
- Out to the orchestrator: the compiled command contract `.skilled/commands/deep/assets/compiled/deep-review.contract.md` records digests of that YAML and of the deep-review `SKILL.md`, so it must be re-minted after the build (tasks.md T028). It is already stale on the agent digest before this phase.
- The deep-review agent's Step 7 already describes the numbered shape, so no agent edit is required.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

- **Reducer suite**: seven runtime files (`deep-review-state-reducer`, `deep-review-state-contract`, `deep-review-deltas-contract`, `deep-review-strategy-heading`, `deep-review-projections-contract`, `deep-review-reducers`, `verify-iteration`). Baseline read on 2026-10-10: `Test Files  7 passed (7)`, `Tests  146 passed (146)`. Probed after the edits: `Tests  151 passed (151)`.
- **Executor suite**: `tests/unit/executor-audit.vitest.ts`, `tests/unit/executor-audit-process-group.vitest.ts`, `tests/executor-audit-receipts.test.ts`, `tests/executor-audit-cli-branch-receipts.test.ts`. Baseline `Tests  59 passed (59)`; probed after `Tests  62 passed (62)`.
- **Negative controls, probed**: against the unedited reducer and filter, 5 of the 8 new cases fail; the F### case, the delta-row case and the other-kinds case pass both ways by design, since the old code reads neither numbered lines nor the variable. Against a reducer that reads trimmed numbered lines, the evidence-line case fails with `expected 3 to be 2`. Without the structured-row rule, the delta-row case fails with `expected 3 to be 1`.
- **Out-of-runtime readers of the reducer**: `node --test .skilled/skills/system-deep-loop/deep-review/scripts/tests/reduce-state-summary-fallback.test.cjs` (`pass 1`, `fail 0`), four system-spec-kit cli tests (`Tests  22 passed | 4 skipped (26)`), and `tests/review-depth-reducer.vitest.ts` in the system-spec-kit runtime (`Tests  1 passed (1)`). They must read the same after the build.
- **Real-data regression**: `scratch/probe/compare-real-live.cjs` reduces all 164 review folders with `scratch/probe/reduce-state-before.cjs` (a copy of the reducer taken before planning, with absolute requires) and with the live reducer, in memory. Before the build: `dirs=164 same=164 changed=0 errors=0`. After: `dirs=164 same=162 changed=2 errors=0`, the two being `specs/sk-prompt/z_archive/002-sk-improve-prompt-rename/review` (open 2 to 9) and `specs/system-deep-loop/z_archive/022-sk-deep-research-evolution/010-sk-deep-research-review-improvement-2/review` (open 166 to 173).
- **Types**: `npm run typecheck` in the runtime exits 0 before and after (probed on a patched copy).
- **Docs**: `validate_document.py` returns `VALID` with 0 issues on the cli-pi `SKILL.md`, `providers-and-models.md` and both new changelog entries (probed on patched copies).
- **Routing and mirrors**: `compiled-route-guard.cjs` reads `cli-external-orchestration fresh` and `system-deep-loop fresh`; both leaf manifests read `OK` (leaves are paths, and no leaf is added). `sync-runtime-mirrors.cjs --check` reads `PASS: 187 mirrors`. Hermes `--check` reads `PASS: 70` before and reports the `cli-pi` copy out of date after, until the orchestrator regenerates.
- **Contract header**: the patched YAML parses with `js-yaml` to the same `severities` (`P0:true P1:true P2:true`), the snapshot check reads `OK`, and `deep-review-contract-parity.vitest.ts` read `Tests  12 passed (12)` before. `check-contract-drift.cjs` exits 2 before (stale agent digest) and after, until the orchestrator re-mints.
- **Gap**: the full runtime suite (145 unit files) takes more than two minutes and is not part of the builder's gate; the two suites above cover every file the edits touch.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- Contracts the builder reads before editing: `.skilled/skills/sk-code/SKILL.md` (the CommonJS and TypeScript edits route to the sk-code-opencode surface), `.skilled/skills/sk-doc/SKILL.md` (the cli-pi Markdown edits) and `.skilled/skills/sk-doc/sk-create-changelog/SKILL.md` with its `assets/changelog-template.md` (the two entries). No agent definition and no repo rule is edited, so `sk-create-agent` and `sk-create-repo-rule` are not loaded.
- Probe artifacts in `scratch/`: `units/` (every OLD and NEW text), `dispatch-units.json`, `check-units.cjs` (proves each OLD text occurs once, in order), `fixtures/iteration-001.md`, `probe/reduce-state-before.cjs` and `probe/compare-real-live.cjs`. The `probe/sdl/` and `probe/docs/` trees are the patched copies the numbers above came from; the builder does not use them.
- The orchestrator runs `node .skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs` once after all builds, which rewrites `.hermes/skills/cli-pi/SKILL.md`, and re-mints the compiled deep-review contract with `node .skilled/skills/system-deep-loop/runtime/scripts/compile-command-contracts.cjs --command deep/review --write`.
- **Follow-ups recorded, not built here**: harden `lib/deep-loop/iteration-findings.cjs` so an indented numbered line is not counted (owned elsewhere in the deep-loop runtime work; this child keeps its edit set small); and decide whether `- **F###**:` narrative findings should also yield to structured rows.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- Restore the nine modified tracked files with `git restore .skilled/skills/system-deep-loop/deep-review/README.md .skilled/skills/system-deep-loop/deep-review/SKILL.md .skilled/skills/system-deep-loop/deep-review/assets/review-mode-contract.yaml .skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs .skilled/skills/system-deep-loop/runtime/tests/unit/deep-review-state-reducer.vitest.ts .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts .skilled/skills/system-deep-loop/runtime/tests/unit/executor-audit.vitest.ts .skilled/skills/cli-external-orchestration/cli-pi/SKILL.md .skilled/skills/cli-external-orchestration/cli-pi/references/providers-and-models.md`.
- Delete `.skilled/skills/system-deep-loop/deep-review/changelog/v1.11.4.0.md` and the two new changelog files, `.skilled/skills/cli-external-orchestration/cli-pi/changelog/v1.5.14.0.md` and `.skilled/skills/system-deep-loop/runtime/changelog/v1.9.3.0.md`. Nothing else depends on them.
- If the orchestrator already regenerated Hermes, run the Hermes generator again after the restore.
<!-- /ANCHOR:rollback -->

---

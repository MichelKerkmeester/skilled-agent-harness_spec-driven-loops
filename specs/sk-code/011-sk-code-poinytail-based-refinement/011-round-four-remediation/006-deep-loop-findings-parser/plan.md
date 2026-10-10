---
title: "Implementation Plan: Phase 6: deep-loop-findings-parser"
description: "The shared iteration findings parser counts only numbered lines at the left margin and reads F### bullets as a third shape, one shape per section. In the review reducer, F### findings now yield to structured rows as numbered findings already do. Six tests and a runtime changelog entry follow."
trigger_phrases:
  - "deep loop findings parser plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 6: deep-loop-findings-parser

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node CommonJS (`iteration-findings.cjs`, `reduce-state.cjs`), two TypeScript Vitest files, one Markdown changelog entry |
| **Framework** | Vitest 4.1.11 from the system-deep-loop runtime package |
| **Storage** | None |
| **Testing** | One new runtime unit file, the seven-file reducer command round three used, the fan-out merge and closeout suites, real-data probes in `scratch/probe/` |

### Overview
`parseIterationMarkdownFindings` in `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/iteration-findings.cjs` (lines 5 to 32 when read) trims each Findings line before matching `^\d+\.\s+`, so an indented sub-step counts as a finding, and it has no rule for `- **F###**:` bullets. The rewrite keeps each line's indentation, opens a numbered finding only at the left margin, adds F### bullets at the left margin as a third shape and reads a section in the first shape present: numbered subheadings, then numbered lines, then F### bullets. The function's signature, its ids (`iteration-<run>-finding-<N>`) and the other four exports do not change. In the review reducer `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs`, the structured-row rule at line 990 drops its numbered-only condition, so F### findings yield too, and the `numberedNarrativeFindings` set that only fed that condition is removed. Each of the seven edits and two new files is one unit in `scratch/dispatch-units.json`, with its text quoted in full.
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
In-place rule change to one shared pure function, with its first dedicated test file and a patch version bump

### Key Components
- **Section reader**: the loop that collects the Findings section keeps `lines[index].trimEnd()` instead of `.trim()`, and still ends at any line whose trimmed form starts `## `.
- **Numbered subheadings**: `### N. Title`, matched on the trimmed line as today. Unchanged.
- **Numbered lines**: `^\d+\.\s+(.+)$` on the untrimmed line, so only the left margin counts.
- **F### bullets (new)**: `^-\s+\*\*F\d+\*\*:?\s*(.+)$` on the untrimmed line. The title is the text after the id and its optional colon.
- **Shape choice**: `[subheadingFindings, numberedFindings, bulletFindings].find((texts) => texts.length > 0) ?? []`. The old code already chose subheadings over numbered lines in the same way, so this extends one rule rather than adding a second.
- **Review reducer rule (`reduce-state.cjs`)**: in `buildFindingRegistry`, the loop over iteration narratives skips every finding of an iteration in `structuredRuns`, the runs with delta finding rows or a non-empty `findingDetails`. Before, it skipped only findings marked in `numberedNarrativeFindings`. The set and its declaration go, because nothing reads them afterwards.
- **Tests**: `tests/unit/iteration-findings.vitest.ts` (new) loads the module through `createRequire`, as `verify-iteration.vitest.ts` does, with five cases, and one case appended to the `reduceReviewState: numbered finding narrative` block of `tests/unit/deep-review-state-reducer.vitest.ts`, built with that block's own `reduceNarrative` and `summarize` helpers.
- **Callers, unchanged**: `verify-iteration.cjs:148` (research count check) and `fanout-merge.cjs:207` (research registry rebuild through `researchCandidatesFromIteration`, `:1079`). `reduce-state.cjs`, the review reducer, does not load this module (`grep -c iteration-findings` on it prints `0`) and has its own narrative reader, and `synthesis-closeout.cjs:30` imports only `latestIterationRecords` and `findingKeys`.

### Decisions
- **D1, margin lines only.** A numbered line opens a finding only at column 0. This is the rule round three gave the review reducer (its decision D3) for the same reason: an indented numbered line is a step or evidence under the finding above it. The fixture `scratch/fixtures/iteration-indented.md` parses to `count=4` today and `count=2` after. CommonMark would still call a list item indented by one to three spaces top-level. No real iteration needs that reading: across all 8,552 iteration narratives under `specs/`, the margin rule raises the number of research iterations whose count matches their claimed `findingsCount` from 1,075 to 1,087 of 2,687, and the one lost match (`specs/system-speckit/z_archive/024-compact-code-graph/research/iterations/iteration-054.md`, claim 10) had matched only by counting five indented sub-steps beside its five findings.
- **D2, one shape per section, F### last.** The parser reads `- **F###**:` bullets, but only when the section has no numbered subheading and no margin numbered line. Evidence: a survey of the same 8,552 files (`scratch/probe/survey-shapes.cjs`) found 2,023 sections with margin numbered lines, 446 with F### bullets and 0 that mix the two. F### bullets are mostly review narratives (425), and 3 research narratives use them, which today parse to nothing. Picking one shape means a section that restates its findings in a second shape counts each once. The mixed-shape test fails with `expected [ …(4) ] to deeply equal [ …(2) ]` against a variant that sums the two shapes.
- **D3, narrative yields to structured rows, the open question round three left.** Round three recorded whether `- **F###**:` narrative findings should yield to structured rows (`../../010-round-three-remediation/006-deep-loop-follow-ups/plan.md` section 6 and its implementation summary, Known Limitations 4). Decision: yes, by id. A numbered narrative finding yields to structured findings of the same iteration, and an F### narrative finding yields only to a structured row of the same iteration with the same id, so each finding is counted once and a finding only the narrative recorded is kept (amended after review: the first build let F### findings yield to any row and dropped 15 narrative-only findings in 3 folders). This parser's callers already do it. `fanout-merge.cjs:1083` to `:1090` returns `keyFindings`, `findings` or `findingDetails` before it reads the narrative, and with a claimed count it takes exactly one source (`:1103` to `:1112`). `verify-iteration.cjs:145` to `:147` returns the structured count before it parses Markdown. The review reducer does not: `reduce-state.cjs:990` skips only numbered narrative findings for an iteration with delta rows or `findingDetails`, and F### findings are upserted beside them. Under different wording the same id is stored twice (`F001` appears twice in the open list of `specs/system-speckit/033-system-speckit-v4/008-template-contracts-and-acceptance-criteria/004-checklist-deprecation-closure/review/lineages/grok46-xhigh`). Making that rule cover F### changes 146 of the 456 review folders that reduce, all downward (for that folder `open 20 -> 10`), and the seven-file reducer suite reads `Tests  152 passed (152)` on a patched copy with the new case. The orchestrator assigned the reducer to this child, so this phase builds it (tasks T014 to T018). Once line 990 tests only `structuredRuns`, nothing reads `numberedNarrativeFindings`, so its declaration and its one `.add(finding)` are removed in the same phase. The edits run in the order condition, comment, `.add` line, declaration, so the file stays loadable after each unit.
- **D4, version.** Bug fix, so a patch bump per `sk-create-changelog` section 4: the deep-loop runtime moves from 1.9.3.0 to 1.9.4.0. Its version lives only in its changelog folder (component `deep-loop-runtime`, no `SKILL.md`). `.skilled/changelog/system-deep-loop/runtime` is a symlink to `.skilled/skills/system-deep-loop/runtime/changelog`, so the packet path is the global path. Compact format, three glance bullets. The draft reads `VALID`, `Document type: changelog`, `Total issues: 0` and `hard blockers: 0` on a copy.

### Round three's reason, answered
Round three left the parser alone so its own edit set stayed small (`010/006/plan.md` section 6 calls the parser "owned elsewhere in the deep-loop runtime work" and says that child "keeps its edit set small"). This child owns the parser and nothing else, so the reason no longer applies. The F### question was left open because it needed evidence. D2 and D3 give it.

### Data Flow
A research iteration narrative `iterations/iteration-NNN.md` goes through `parseIterationMarkdownFindings`. `verify-iteration.cjs` counts the result against the iteration's `findingsCount` when the record has no structured findings, and `fanout-merge.cjs` uses the result as registry candidates when a lineage's research registry must be rebuilt. Both now see one entry per finding.

### Handoffs
- Received: assigned to this child by the orchestrator. `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs` and `.skilled/skills/system-deep-loop/runtime/tests/unit/deep-review-state-reducer.vitest.ts` ship in the deep-loop runtime packet this child already versions, so they joined its scope. `deep-research/scripts/reduce-state.cjs` is a different file and stays untouched.
- Out: none.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

- **New unit file**: `tests/unit/iteration-findings.vitest.ts`, five cases. Probed against the planned parser in a scratch tree: `Tests  5 passed (5)`. Against today's parser: `Tests  2 failed | 3 passed (5)`, the margin case (`expected [ …(4) ] to deeply equal [ …(2) ]`) and the F### case (`expected [] to deeply equal [ …(2) ]`). The subheading, mixed and missing-section cases pass both ways by design. The mixed case guards D2 against a version that sums shapes.
- **Caller suites, the command round three used**: the seven reducer files (`deep-review-state-reducer`, `deep-review-state-contract`, `deep-review-deltas-contract`, `deep-review-strategy-heading`, `deep-review-projections-contract`, `deep-review-reducers`, `verify-iteration`). Read on 2026-10-10 before planning: `Test Files  7 passed (7)`, `Tests  151 passed (151)`. On a copy of the tree with every planned edit: `Tests  152 passed (152)`, the 151 plus the new reducer case. Plus `fanout-merge.vitest.ts` and `synthesis-closeout-latest-record.vitest.ts`: `Test Files  2 passed (2)`, `Tests  65 passed (65)` before and on the copy.
- **Real data, review reducer**: `scratch/probe/reduce-two-folders.cjs` reduces the two folders round three named in Known Limitations 2, in memory. Today: `specs/sk-prompt/z_archive/002-sk-improve-prompt-rename/review open=9 resolved=0` and `specs/system-deep-loop/z_archive/022-sk-deep-research-evolution/010-sk-deep-research-review-improvement-2/review open=173 resolved=0`. They stay the same after this build: the review reducer does not load this parser, and the reducer rule built here does not touch them (neither is among the 146 folders it changes).
- **Reducer rule**: the new case `defers F### bullets to the delta rows of an iteration that recorded them` fails on today's reducer with `expected 4 to be 2` and passes on a patched copy (`Tests  1 passed | 11 skipped (12)`). `scratch/probe/handoff-review-yield.cjs` compares the reducer with and without the rule over every review folder under `specs/`: `mode=before dirs=499 same=310 changed=146 raised=0 liveErrors=43` today, where the 43 folders fail in the live reducer too. After the build it compares the copy T009 saves in `scratch/before/` with the live file and must print the same numbers with `mode=after`. The reducer readers outside the runtime folder that round three listed read `ℹ pass 1`, `ℹ fail 0`, `Tests  22 passed | 4 skipped (26)` and `Tests  1 passed (1)` today. The first of them also passes on the patched copy, and the others must read the same after the build.
- **Real data, this parser**: `scratch/probe/compare-parser-real.cjs` parses all 8,552 iteration narratives with the live parser and with the planned one, built in memory from `units/T011.*.txt`. Before the build: `mode=before files=8552 same=8074 changed=478 claims=2687 liveMatch=1075 plannedMatch=1087`. After the build both are the same code: `mode=after` and `changed=0`. The file count can grow if other sessions add iterations.
- **Gap**: the full runtime suite (145 unit files) takes more than two minutes and is not part of the builder's gate. The suites above cover every caller of the changed function.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- Contracts the builder reads before editing: `.skilled/skills/sk-code/SKILL.md`, whose router sends this CommonJS and TypeScript work to the sk-code-opencode surface (`.skilled/skills/sk-code/sk-code-opencode/references/javascript/style-guide.md` and `references/typescript/style-guide/`), and `.skilled/skills/sk-doc/sk-create-changelog/SKILL.md` with its `assets/changelog-template.md` for the entry. No agent definition, repo rule or other Markdown outside spec folders is edited, so `sk-create-agent`, `sk-create-repo-rule` and the general `sk-doc` route are not loaded.
- Probe artifacts in `scratch/`: `units/` (every OLD, NEW and new-file text), `dispatch-units.json`, `check-units.cjs` (before state by default, after state with `--after`), `fixtures/` (three narratives) and `probe/` (`parse-fixture.cjs`, `compare-parser-real.cjs`, `reduce-two-folders.cjs`, `handoff-review-yield.cjs`, `survey-shapes.cjs`, `review-fbullet-overlap.cjs` and their in-memory loader `load-source.cjs`). Every probe only reads.
- Orchestrator steps after all builds: the Hermes generator (`.hermes` holds no copy of the runtime folder, so this phase adds no drift. `--check` read `PASS: 70 Hermes skill copies in sync` before any build and `DRIFT sk-code-review` once a sibling build started, which is not this phase's) and the spec-kit trigger-index rebuild, which picks up the new changelog's phrases.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- Restore the three modified files with `git restore .skilled/skills/system-deep-loop/runtime/lib/deep-loop/iteration-findings.cjs .skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs .skilled/skills/system-deep-loop/runtime/tests/unit/deep-review-state-reducer.vitest.ts`.
- Delete the two created files, `.skilled/skills/system-deep-loop/runtime/tests/unit/iteration-findings.vitest.ts` and `.skilled/skills/system-deep-loop/runtime/changelog/v1.9.4.0.md`. Nothing else depends on them.
- If the orchestrator already rebuilt the trigger index, rebuild it again after the restore.
<!-- /ANCHOR:rollback -->

---

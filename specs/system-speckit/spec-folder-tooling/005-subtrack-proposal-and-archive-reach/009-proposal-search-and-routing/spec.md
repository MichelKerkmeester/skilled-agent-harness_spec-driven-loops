---
title: "Feature Specification: Phase 9: proposal-search-and-routing"
description: "Four smaller defects sit at the edges of the subtrack and archive tools: the path search prints no archived label in JSON, suggest-subtracks.mjs can print a map the relocate preflight refuses, one advisor signal matches inside the word findings, and a sub-track request that names a skill-named track routes to that skill. This phase closes them."
trigger_phrases:
  - "proposal search and routing"
  - "phase 9 proposal search and routing"
  - "archived label in path search json"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 9: proposal-search-and-routing

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Planned |
| **Created** | 2026-11-14 |
| **Branch** | `worktrees/375-subtrack-review-remediation` |
| **Parent Spec** | ../spec.md |
| **Phase** | 9 of 10 |
| **Predecessor** | 008-restore-and-phase-numbering |
| **Successor** | 010-real-pipeline-tests |
| **Handoff Criteria** | A `--json` path search with `--include-archive` marks its archived paths, and every map `suggest-subtracks.mjs` prints passes the relocate preflight |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 9** of the Subtrack proposal, deterministic packet relocation, z_archive on every subtrack and opt-in archive search specification.

**Scope Boundary**: The JSON record of the path recipe, the names `suggest-subtracks.mjs` emits, and the advisor signals of system-spec-kit for the sub-track and archive tools. No relocate change and no scorer change.

**Dependencies**:
- The relocate preflight as phase 006 leaves it, which the proposal check reads
- The advisor's own writers and gates: `skill_graph_compiler.py --export-json`, `capture-scorer-eval-baseline.mjs` and the two ratchet suites under `runtime/tests/parity/`

**Deliverables**:
- An archived marker in the JSON record of the path recipe
- A proposal tool that prints a map the preflight accepts, or no map and the reason
- A reworded archive-search signal and a sub-track signal that wins against a skill-named track
- Suite cases for the two code changes, and regenerated advisor files from their writers
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The path recipe of `rg-wrapper.mjs` labels archived hits in text output, but its JSON record lists them as plain strings, as the block below shows. `suggest-subtracks.mjs` can name a group after a folder that already exists undeclared in the track and accepts a packet named `NNN_slug`, and the relocate preflight refuses both. On the routing side, the signal `find a phrase in archived spec packets` matches inside `findings`, a word the advisor adds to every review prompt, and `suggest sub-tracks for the sk-code track` routes to sk-code, because tracks under `specs/` carry skill names.

### Purpose
A reader of the JSON record can tell which paths are archived, a printed proposal is always one the preflight accepts, and the two routing signals match only the requests they were written for.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ node .skilled/skills/system-spec-kit/runtime/cli/retrieval/rg-wrapper.mjs path "sk-doc agent template alignment" --include-archive --json --limit 2 | sed -n '/"paths": \[$/,/\]/p'
  "paths": [
    "specs/sk-doc/z_archive/006-sk-doc-agent-template-alignment/implementation-summary.md",
    "specs/sk-doc/z_archive/006-sk-doc-agent-template-alignment/plan.md"
  ],
```
Both paths are archived and neither carries a marker. This run was made on 2026-11-14 while planning. The advisor scores quoted in section 4 are reviewer reports from temp copies. One of them was rerun while planning, and section 7 gives the command and the difference.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

`K` is `.skilled/skills/system-spec-kit`, `C` is `K/runtime/cli` and `ADV` is `.skilled/skills/system-skill-advisor/runtime`. Finding ids are those of the two reviews: `A` is `../scratch/review-20261114-core-code.md` and `B` is `../scratch/review-20261114-merge-fixes-and-hub-vocabulary.md`.

### In Scope
- Mark the archived paths in the JSON record of the path recipe (A11).
- Keep `suggest-subtracks.mjs` from printing a map the relocate preflight refuses (A12).
- Reword the archive-search signal so no word of four or more letters in it sits inside `findings` or `research`, and it uses none of `find`, `search`, `locate` (B7).
- Route a sub-track request that names a skill-named track to system-spec-kit (B8).
- Add one happy-path case and one edge case per changed code surface, and regenerate the advisor files through their writers.

### Out of Scope
- A change to the advisor scorer - it is another skill's code with its own ratchet. If no signal wording meets REQ-004, the task is marked blocked and the question goes to the operator.
- Reviewer B findings 1 to 5 - they belong to the hub vocabulary packet and are handed to that session in the parent spec.
- The older misroute reviewer B notes for `under` and `track` - it is not one of the numbered findings.
- `ADV/tests/parity/fixtures/local-native-approved-divergences.json` - it is hand-written. A new divergence stops T010 and goes to the operator, and the file is not edited here.
- Renaming a packet called `NNN_slug` - none exists under `specs/` today, so the proposal tool only names it.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `C/retrieval/rg-wrapper.mjs` | Modify | The path recipe's JSON record names its archived paths |
| `C/tests/rg-include-archive.vitest.ts` | Modify | Cases for REQ-001 |
| `C/spec/suggest-subtracks.mjs` | Modify | Group names avoid every existing folder of the track, and a packet not named `NNN-slug` is reported instead of mapped |
| `C/tests/suggest-subtracks.vitest.ts` | Modify | Cases for REQ-002 |
| `K/graph-metadata.json` | Modify | The archive-search signal at line 111 and the sub-track signals |
| `ADV/scripts/skill-graph.json` | Modify | Regenerated by `skill_graph_compiler.py --export-json`, never by hand |
| `ADV/scripts/routing-accuracy/scorer-eval-baseline.json` | Modify | Recaptured by `capture-scorer-eval-baseline.mjs --write`, only if a number moves |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

`RG` is `node C/retrieval/rg-wrapper.mjs`. `COUNT` is the first command below. It prints the number of listed paths and the number of `archivedPaths`. `SCORE` is the second, which prints one prompt's ranked skills under `PIN`. `PIN` is the pinned scoring regime the advisor's own baseline capture sets: `SKILL_ADVISOR_DISABLE_BUILTIN_SEMANTIC=1`, `SPECKIT_SKILL_ADVISOR_FORCE_LOCAL=1`, `VITEST=true` and an empty `SYSTEM_SKILL_ADVISOR_DB_DIR`.

```text
RG path "sk-doc agent template alignment" --include-archive --json --limit 2 | node -e 'const r=JSON.parse(require("fs").readFileSync(0,"utf8"));console.log(r.paths.length,(r.archivedPaths||[]).length)'

SKILL_ADVISOR_DISABLE_BUILTIN_SEMANTIC=1 SPECKIT_SKILL_ADVISOR_FORCE_LOCAL=1 VITEST=true SYSTEM_SKILL_ADVISOR_DB_DIR="$(mktemp -d)" node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"<prompt>"}' --format json
```

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Closes A11 at `rg-wrapper.mjs:377-382`. Failing scenario: `RG path "sk-doc agent template alignment" --include-archive --json --limit 2` lists two paths under `specs/sk-doc/z_archive/` as plain strings with no archived marker. The record must say which listed paths are archived | `COUNT` prints `2 2`. On 2026-11-14 it printed `2 0`. The check relies on the two archived paths sorting first among the nine files that match. For a phrase that lives only in live documents the second number is 0. Without `--json` the text output is unchanged |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | Closes A12 at `suggest-subtracks.mjs:177-181` and `:236-268`. Failing scenario, inferred by the reviewer and not run: a proposed group name equals an existing undeclared folder of the track, or a packet is named `NNN_slug`, and `relocate.mjs --map` refuses the printed map with exit 2. A printed map must pass the preflight | In a `mktemp` copy, with an undeclared folder named like the top-ranked group, `suggest-subtracks.mjs --track demo` prints a map and `relocate.mjs --map <that map>` exits 1, not 2. With a packet named `003_under` in the track, the tool prints a line that names `003_under`, prints no map and exits 0 |
| REQ-003 | Closes B7 at `K/graph-metadata.json:111`. Failing scenario: the signal `find a phrase in archived spec packets` partly matches `findings`, which `lexical.ts:18` adds to every prompt that holds `review`. An earlier wording, `search archived spec packets`, matched inside `research` and was removed in commit `bd7fe35921`, and `lexical.ts:15` and `:20` expand `find` and `search` into each other. Corpus row `rr-iter3-135`, a review prompt with no archive content, is won 0.5886 to 0.5828 on that match. The mechanism is the reviewer's inference and the effect is confirmed. The signal must not score on that prompt: no word of four or more letters in the signal sits inside `findings` or `research`, and the signal uses none of `find`, `search`, `locate` | Under `PIN`, the system-spec-kit score for the `rr-iter3-135` prompt is the same with the reworded signal as with the signal removed. `SCORE` for the prompt `look up a phrase in the archived spec packets` still returns system-spec-kit first. `capture-scorer-eval-baseline.mjs` output is saved before and after, and every number that moved is listed in `goal.md` section 4 |
| REQ-004 | Closes B8, the signals added in commit `17b8e6c208`. Failing scenario: under `PIN`, `suggest sub-tracks for the sk-code track` scores sk-code 0.8676 over system-spec-kit 0.82, the sk-git track behaves the same, and the sk-doc track wins 0.8769 to 0.8758. The three prompts must route to system-spec-kit | Under `PIN`, each of the three prompts returns system-spec-kit first. No signal added or reworded here contains the name of a skill under `.skilled/skills/` or of a track under `specs/`. A control prompt that asks for work on the sk-code skill itself, recorded in T001, keeps the top skill it has today, and so do two prompts that use `track` in another sense: `track down why a vitest suite is flaky` and `keep track of the open review comments`. Every corpus row whose top skill changed is listed in `goal.md` section 4, and each is a sub-track or archive request. The two ratchet suites under `ADV/tests/parity/` pass with no new entry in `local-native-approved-divergences.json` |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `RG path "sk-doc agent template alignment" --include-archive --json --limit 2` marks both listed paths as archived, and a map printed by `suggest-subtracks.mjs` in a `mktemp` copy passes `relocate.mjs --map` with exit 1.
- **SC-002**: Under `PIN`, `suggest sub-tracks for the sk-code track` returns system-spec-kit first, and from `C`, `../../node_modules/.bin/vitest run --config ../../vitest.config.ts --project cli tests/rg-include-archive.vitest.ts tests/suggest-subtracks.vitest.ts` exits 0.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The advisor's ratchet holds every metric to `scorer-eval-baseline.json` | A reworded signal that moves a number fails the ratchet until the baseline is recaptured | Capture before and after, recapture with the writer and record the delta. Reviewer B measured 160 with `search` and 161 with `find`, so one row may move back |
| Risk | A reader of the JSON record breaks on a changed `paths` type | Med: a consumer that expects strings fails | Add a field beside `paths` and leave its type alone. T002 lists the readers first |
| Risk | No signal wording beats a skill name written in the prompt | Med: REQ-004 cannot be met without a scorer change. On 2026-11-14 sk-code won the sk-code prompt through the `explicit_author` lane and system-spec-kit scored through `lexical` | Mark the task blocked and ask the operator. The scorer is out of scope here |
| Risk | The fix passes by overfitting: skill or track names are put into system-spec-kit's signals | High: it repeats reviewer B's finding 1, signals that pull unrelated prompts to one skill | REQ-004 forbids a skill or track name in a signal, adds two negative controls that use `track` in another sense and lists every corpus row whose top skill changed |
| Dependency | The hub vocabulary session regenerates the same `skill-graph.json` and `scorer-eval-baseline.json` | A hand merge of two regenerated files records numbers no run produced | The signal commit takes `origin/main` into the branch before T011 and T012 run. Whichever branch merges second reruns both writers on top of the first, and neither file is merged by hand |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Answered: the command that prints one prompt's scores under `PIN` is `SCORE` in section 4. Run on 2026-11-14 for `suggest sub-tracks for the sk-code track`, it printed `"status": "ok"` with sk-code first at confidence 0.874 and system-spec-kit second at 0.82. Reviewer B reports 0.8676 for sk-code from a temp copy, so the sk-code figure differs by 0.0064 and the system-spec-kit figure agrees. The exit status of that run was not captured. T001 records the run again with its exit status before any signal changes.
- B8: whether a signal can outrank a skill name written in the prompt is UNKNOWN. The same run names `explicit_author` as the lane that gives sk-code its score and `lexical` as the lane for system-spec-kit.
- Answered: the added field is `archivedPaths`, the name `COUNT` reads. T002 still lists the readers first, and a reader that already uses that name is raised as an open question before T005.
- The advisor's command for the two ratchet suites is taken from `ADV/package.json`, whose `test` script is `vitest run`: from `ADV`, `node_modules/.bin/vitest run tests/parity/scorer-eval-baseline-ratchet.vitest.ts tests/parity/local-native-divergence-ratchet.vitest.ts`. `goal.md` section 4 records what that command printed while planning.
<!-- /ANCHOR:questions -->

---

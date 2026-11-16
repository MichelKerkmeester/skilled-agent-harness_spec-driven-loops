---
title: "Implementation Plan: Phase 4: hook-readme-fold-and-rewrite"
description: "Fold 81 link-only READMEs into a runtime table one level up, then rewrite the 102 READMEs that stay with one worker brief per file. The orchestrating session writes each brief from the source files and reviews each return against seven gates. Proof is an empty fold check, no failing gate and every suite at its phase 3 count."
trigger_phrases:
  - "hook readme fold and rewrite plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 4: hook-readme-fold-and-rewrite

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown, with two Python helper scripts in `scratch/` |
| **Framework** | None |
| **Storage** | None |
| **Testing** | Five README checkers, the sentence metric script, the hook suites and two Python README tests |

### Overview
The orchestrating session saves a copy of every hook README, builds a map of the 122 links in the 83 link-only folders, 81 of which hold a README, and writes one brief per README. A Vibe CLI worker on `deepseek-flash` drafts each file. The session checks each return with `readme-gates.py`, reads each feature README against its source and rejects a return that fails. The 81 leaf READMEs are deleted once the fold check finds every link named one level up. The phase is proven by an empty fold check, no failing gate and every suite at its phase 3 count.

### Baseline

The before-state is the phase 3 final gate run of 2026-11-15, saved in `../003-literal-hook-renames/scratch/baseline-after/`. T001 reruns `../scratch/baseline/baseline.sh` before the first edit, so the counts below are observed again in the session that changes them.

| Gate | Command | Phase 3 final result | Expected after this phase |
|------|---------|----------------------|---------------------------|
| Hook Vitest tree | `.skilled/node_modules/.bin/vitest run --config .skilled/hooks/vitest.config.ts` | 9 files, 501 tests passed | Same |
| Hook `node --test` suites | `node --test` over the non-Vitest test files under `.skilled/hooks` and `.vibe/plugins/repo-guards/tests` | 1839 tests, 1838 pass, 1 fail | Same |
| OpenCode plugin tests | `node --test '.opencode/plugins/tests/*.test.cjs'` | 591 pass, 0 fail | Same |
| Completion sentinel test | `npx vitest run tests/completion-evidence-sentinel.vitest.ts` in `.skilled/skills/system-spec-kit/runtime` | 33 passed, in a planning run | Same |
| Hook registrations | `sync-hook-registrations.cjs --check` | PASS, 35-hook registry, 22 Pi extensions | Same |
| Runtime mirrors | `sync-runtime-mirrors.cjs --check` | PASS, 257 mirrors across 10 trees | Same |
| Gate inputs | `bash .github/scripts/check-gate-inputs.sh` | `files=46`, `RESULT: PASSED` | Same |
| Gate inputs test | `bash .github/scripts/tests/check-gate-inputs.test.sh` | 61 passed, 0 failed | Same |
| Primary pre-commit test | `bash .skilled/scripts/git-hooks/tests/pre-commit.test.sh` | 152 passed, 0 failed | Same |
| Source-root selection test | `bash .skilled/scripts/git-hooks/tests/source-root-selection.test.sh` | 56 passed, 0 failed | Same |
| README verdict parity | `test_readme_verdict_parity.py` | `baseline_files=1141`, PASS | PASS after the rebase. 81 rows leave and 2 arrive, and T072 records the count. |
| README manifest | `test_readme_manifest.py` | `derived=920 frozen=920`, reproducible | Reproducible after the rebase. T071 records the count and the `gaps` number. |
| Hook README structure | `validate_document.py` over the hook READMEs | 183 pass, 0 fail | 104 pass, 0 fail |
| Hook README voice | `hvr_scan.py` over the hook READMEs | 158 pass, 25 fail | 104 pass, 0 fail |
| Hook README references | `check_readme_references.py` | 88 pass, 95 fail | 104 pass, 0 fail |
| Hook README counts | `check_derived_readme_counts.py` | 173 pass, 10 fail | 104 pass, 0 fail |
| Hook README sentences | `readme-metrics.py .skilled/hooks` | 130 pass, 53 fail | 103 pass, 1 fail. The one is `skill-advisor/README.md`. |

The one failing `node --test` case is "the Cursor preflight, MCP route and Task guards still answer a normal payload" in `.skilled/hooks/shared/hook-stdin-deadline.test.mjs`. It failed before phase 1 and is reported at packet close.

The last four rows were measured in a planning run on 2026-11-15. The two rows above them come from the phase 3 summary file.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented. `spec.md` sections 2 and 3 name each group of files.
- [ ] Success criteria measurable. Each one in `spec.md` section 5 is a command and its output.
- [ ] Dependencies identified. The baseline table above holds the phase 3 final counts.

### Definition of Done
- [ ] All acceptance criteria met
- [ ] `readme-gates.py check` prints no FAIL line for a file in scope, `fold` prints `missing=0`, `triggers` prints `lost=0` and every gate in the baseline table matches its expected column
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Inventory, brief, draft, review. The orchestrating session owns the facts and the verdict. A worker owns one draft.

### Key Components
- **`scratch/before/`**: a copy of the 183 hook READMEs, made with links followed, before the first edit. Phases 1 to 3 changed these files and are not committed, so `HEAD` is not this phase's before-state. The copy is the source for the identifier comparison, the trigger-phrase check and the rollback.
- **`scratch/fold-map.tsv`**: one row per link in a link-only folder, 122 rows in 83 folders, because two link-only folders hold no README. Columns: feature, runtime, link name, real file, event and where the event was read. The worker reads what the runtime shows from the real file. A Claude, Codex, Cursor or Devin row is read from `hook-registry.json`. A Pi, DSH, OpenCode or Vibe row is read from the adapter, the plugin or `.vibe/hooks.toml`, because the registry holds no event for those four.
- **`../scratch/readme-metrics.py`**: prints sentence count, median words, the share over 30 words and the paragraphs over 80 words for each file.
- **`scratch/readme-gates.py`**: `check <file>...` runs the seven gates below and prints one line per file with the failing gates. `fold` checks that each link in a link-only folder is named one level up. `triggers` compares frontmatter trigger phrases with `scratch/before/`.
- **`scratch/briefs/`**: one brief per output file, under 90 lines: the child dispatch preamble, a short persona, one task and literal paths. It carries the facts the worker may not change and the strings a test asserts.
- **`scratch/runs/`**: the `--output-dir` of each worker run, with its `export.json`.

The seven gates a return must pass:

| Gate | Check | Pass |
|------|-------|------|
| G1 | `validate_document.py <file>` | prints `VALID` |
| G2 | `validate_document.py --type code_folder --json <file>` | no blocking rule other than `code_folder_inline_path` |
| G3 | `hvr_scan.py <file>` | `hard blockers: 0` |
| G4 | `check_readme_references.py <file>` | `PASS` |
| G5 | `check_derived_readme_counts.py <file>` | `PASS` |
| G6 | `readme-metrics.py <file>` | `PASS`: median at most 14 words, at most 3% of sentences over 30, no prose paragraph over 80 |
| G7 | Backticked tokens of the copy in `scratch/before/` against the new file | every token is present, or its removal is listed in the brief with a reason |

G2 does not apply to the five session-handover documents, which are not READMEs. G2 and G6 do not apply to `skill-advisor-hook.md`. G4 does, so its eight unresolved references are fixed. G2 checks a README path that is a link at the file it points to, because `code_folder_relative_link` resolves links from the README's own folder.

Target shape, by tier:

| Tier | Sections, in order, only those that fit |
|------|------------------------------------------|
| Feature README | OVERVIEW, HOW IT WORKS, RUNTIME COVERAGE, DIRECTORY TREE, KEY FILES, CONFIGURATION, VALIDATION, RELATED |
| Leaf README | OVERVIEW, FILES, VALIDATION, RELATED. A leaf folder with subfolders takes DIRECTORY TREE in place of FILES. |
| Root hooks README | OVERVIEW, DIRECTORY TREE, KEY FILES, CONFIGURATION, COVERAGE MATRIX, VALIDATION, RELATED |
| Session-handover document | Frontmatter, H1, numbered H2 sections in capitals, RELATED last with a link back to the README |

The RUNTIME COVERAGE table has the columns of the worked example, `codex-global-hooks-check/README.md`: Runtime, Event, Entry in this folder, Real file and What the runtime shows. The voice targets are sentences of about 10 to 15 words, none over 30, paragraphs of about 60 words, no em dash, no semicolon and no serial comma. A README states the current state only: no relocation history, no packet id and no link into `specs/`.

### Data Flow
A brief names one output file, the files to read and the facts to keep. The worker runs from `scratch/runs/<brief name>/cwd/` inside the worktree, with the worktree passed through `--add-dir` and `VIBE_HOME` outside it, and writes that one file. A probe run started outside the checkout wrote nothing, because `--add-dir` loads the checkout's own hooks and they find the checkout with git from the cwd. The session reads `export.json`, then the diff, then the `readme-gates.py check` line. A pass on a feature README is followed by a full read against the adapter files. A fail goes back as a new brief that quotes the failing lines. A feature README is reviewed before the leaf READMEs under it are deleted, because the fold check reads the feature README.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

The inventory comes from a planning walk of `.skilled/hooks/` and four read-only explorers. Each explorer finding below was confirmed with a search or a file read.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| 81 `README.md` files in link-only folders | Each describes one to six links. | Fold, then `git rm`. | REQ-001 and REQ-004. |
| 17 feature READMEs and the three skill-owned files with a "PER-RUNTIME DELIVERY" section. `classifier-injection-screen/`, `env-secret-guard/` and `session-handover/` have no runtime section | Hold a runtime table without the entry and real-file columns, or none. | Rewrite with the RUNTIME COVERAGE table. | `readme-gates.py fold`. |
| `codex-global-hooks-check/README.md:98` | Says each runtime folder holds a README. | Remove the sentence by hand. | The sentence search in T023 prints nothing. |
| 34 links between sibling READMEs of one feature, such as `../claude/README.md` in `dist-freshness/opencode/README.md:35` and `cli-dispatch/codex/README.md:38` | Link a README that is deleted, or sit in one. | Removed with the leaf, or pointed at the feature README. | G4 on every README that stays. |
| `.skilled/hooks/README.md` coverage matrix | `decision-capture/bin/runtime-refusal.test.mjs` reads the header row `Concern, Claude, Codex, Cursor, Devin, OpenCode, Pi, DSH, Vibe` and the `decision-capture` row. | Keep both byte-exact. The brief quotes them. | The hook `node --test` suites. |
| `.skilled/hooks/goal/README.md` | `goal-doc-contract.test.cjs` checks that each cited path exists and each goal kill switch is live. | Rewrite. The brief lists the cited paths and the switch names. | The OpenCode plugin tests. |
| `.skilled/hooks/completion-evidence/README.md` | `completion-evidence-sentinel.vitest.ts:150` requires `display: false`, `deliverAs: "nextTurn"` and "model-visible" within 100 characters of "next-turn". | Rewrite. The brief quotes the three strings. | The completion sentinel test. |
| `sk-git/scripts/hooks/README.md`, the spec-gate library README, `skill-advisor-hook.md` | Skill-owned files that four hook README paths link to. Other documents link to them by path. | Edit in place. No path changes, so no linker changes. | G4 on the three files. |
| Root `README.md:1083` and `:1759`, `system-spec-kit/README.md:94`, `.skilled/bin/README.md:183`, five playbook files under `plugins-and-hooks/` | Describe what `session-handover/README.md` covers. | Read each line after the split. Edit one only when it names content that moved. | T042 records a verdict per line. |
| `durable-directory-manifest.json`, `baseline-readme-verdicts.json`, `trigger-index.json`, `corpus-manifest.json`, `generation-diagnostics.json` | Pinned lists. The second, third and fourth each hold 128 depth-2 hook README paths. | Regenerate with each list's own writer, once, after the last README edit. | REQ-012. |
| `.github/workflows/sk-doc-script-tests.yml` | Runs the manifest test and the parity test on every push. | Unchanged. It passes once the lists are rebased. | REQ-012. |
| `.skilled/hooks/hook-flags.env.example:13` | Says every concern and flag is listed in `.skilled/hooks/README.md`. | Unchanged. The kill-switch index stays in the root README. | The root README brief keeps the index. |
| `goal/goal-plugin.md`, `coverage-rationale.md`, `injection-contract.md` | Not READMEs. | Unchanged. | REQ-013 lists no change to them beyond a link that pointed at a deleted README. |
| Every code, test, registry and workflow file | Not a consumer of README text, apart from the three tests above. | Unchanged. | REQ-013. |

Required inventories:
- Same-class producers: the 183 README paths in `scratch/gates-before.tsv`, by class: 81 link-only, 98 for real code and 4 that are links into skills.
- Consumers of changed symbols: none. No exported symbol changes. Three tests read README text and are listed above.
- Matrix axes: three tiers (root, feature, leaf) by seven gates, plus the five session-handover documents by five gates.
- Algorithm invariant: a rewrite changes sentences, never a fact. Every backticked token of the old file is in the new file or in the brief's list of removals.

Known wrong facts this phase corrects:

| File | Wrong today | Correction |
|------|-------------|------------|
| `.skilled/hooks/README.md` | Counts such as "Eleven concern folders" and "these seven cores". | Derive each count from the tree, or drop it. |
| `.skilled/hooks/README.md` lines 24, 92, 106, 108, 285 and 360 | Relocation history. | Remove. State where the code is now. |
| `.skilled/hooks/README.md:9` | The trigger phrase "git hooks", for a `git/` folder phase 1 removed. | Remove the phrase. |
| `.skilled/hooks/README.md` | COVERAGE MATRIX follows RELATED, which the validator warns about. | RELATED becomes the last H2. |
| `.skilled/hooks/README.md:215` | Says every listed folder links into a skill. | State which folders link into a skill, into `.skilled/bin/` or into `.opencode/plugins/`. |
| `.skilled/hooks/README.md` | No table for the concern keys that differ from their folder. | Add one table: `dispatch` and `dispatch-guard` for `cli-dispatch/`, `task-dispatch` for `subagent-dispatch-guard/`, `completion` for `completion-evidence/`, `codex-watchdog` and `hook-install` for `codex-global-hooks-check/`, `ask-surface` for `ask-surface-guard/`, `injection-screen` for `classifier-injection-screen/`. |
| `.skilled/hooks/session-handover/README.md:25-31` | Six links into `specs/` scratch folders, five of them dead, and a packet id at line 29. | Remove the links and the id. |
| `.skilled/skills/sk-git/scripts/hooks/README.md` | The title names only the preflight advisory. | The title names the message gate and the preflight advisory. |
| `.skilled/hooks/subagent-dispatch-guard/README.md` section 4 | The tree comment column lost its alignment. | Rewrite the tree. |
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.

Setup reruns the baseline, copies the READMEs, writes `readme-gates.py` and the fold map and prepares the two brief templates. Implementation runs a pilot of two briefs, then the feature tier, the two new READMEs, the deletion of the 81 leaves, the leaf tier, the session-handover split and the root README, and rebases the pinned lists. Verification reruns every gate over every file and the baseline from the final state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Each returned file, right after its worker run | `readme-gates.py check`, which runs the seven gates |
| Integration | The whole tree from the final state | `readme-gates.py fold` and `triggers`, `../scratch/baseline/baseline.sh`, the completion sentinel test and the two README tests |
| Manual | Each feature README, the root README and the five session-handover documents | A full read against the adapter files and `hook-registry.json` |

`readme-gates.py` and `readme-metrics.py` are each checked on a control before they are trusted: a sample with a hand-counted 31-word sentence must fail G6, and a README with a missing file in its table must fail G2.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 003 closed | Internal | Green | The paths a README names would not be final. |
| Vibe CLI with `deepseek-flash` | External | Yellow. The preflight passed on 2026-11-15, and no worker has run in this phase yet | The briefs go to cli-opencode on `opencode-go/deepseek-v4.1-flash`. |
| `cli-mistral-vibe/SKILL.md` and its `references/cli-reference.md` section 4 | Internal | Green | The dispatch shape would be guessed. T007 reads them before the first dispatch. |
| `sk-doc` routing before the first README write | Internal | Green | Gate 2 of `AGENTS.md` requires it. |
| `python3` for the checkers and the two README tests | External | Green | No gate can run. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: the operator rejects the rewrite, or a tier fails its gates for a reason three attempts do not clear.
- **Procedure**: nothing in this phase is committed, and phases 1 to 3 are uncommitted in the same tree, so no whole-tree `git restore` is used. Copy a README back from `scratch/before/` to undo its rewrite. For a deleted leaf, copy it back and run `git add` on it. Remove the seven created documents with `git rm -f`. Then rerun the three list writers. T003 saves `git diff HEAD --binary` as `scratch/pre-phase4.patch`. After a full rollback the same command prints a patch equal to that file, apart from this packet's folder.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Phase 003 closed | Implementation |
| Implementation | Setup | Verification |
| Verification | Implementation | Close of the phase and of the parent packet |
<!-- /ANCHOR:phase-deps -->

---


---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌─────────┐   ┌─────────┐   ┌──────────┐   ┌─────────┐   ┌──────────┐   ┌─────────┐
│ Pilot   │──►│ Feature │──►│ Delete   │──►│ Leaf    │──►│ Split    │──►│ Lists   │
│ 2 files │   │ tier    │   │ 81 leafs │   │ tier    │   │ and root │   │ & gates │
└─────────┘   └─────────┘   └──────────┘   └─────────┘   └──────────┘   └─────────┘
```

Each file is itself a chain: brief, worker run, gate line, read, verdict.

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Pilot | Setup | Two reviewed READMEs and the tuned templates | Feature tier |
| Feature tier | Pilot, `scratch/fold-map.tsv` | 25 feature READMEs with their runtime rows, two of them new | Delete |
| Delete | Feature tier, `fold` at `missing=0` | 81 fewer READMEs | Leaf tier |
| Leaf tier | Delete | 76 leaf READMEs with no link to a deleted file | Split and root |
| Split and root | Leaf tier | Six session-handover documents and the root README | Lists and gates |
| Lists and gates | All of the above | Rebased lists and the evidence in `acceptance-criteria.md` | None |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

Durations are assumptions, not measurements. The pilot gives the first measured worker run.

1. **Setup: baseline, copy, gate script, fold map, templates** - about 90 minutes - CRITICAL
2. **Pilot of two briefs and the template tuning** - about 30 minutes - CRITICAL
3. **Feature tier: 25 files in waves of up to five** - about 120 minutes - CRITICAL
4. **Leaf tier: 76 files in waves of up to five** - about 180 minutes - CRITICAL
5. **Session-handover split and the root README** - about 75 minutes - CRITICAL
6. **Pinned lists and every gate from the final state** - about 40 minutes - CRITICAL

**Total Critical Path**: about 9 hours

**Parallel Opportunities**:
- Up to five worker runs at once on files in different folders.
- The leaf READMEs of one feature folder run in the same wave, because each brief writes one file.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Pilot reviewed | Two returns pass the seven gates and the templates are final | Implementation |
| M2 | Fold done | REQ-001 and REQ-004 hold | Implementation |
| M3 | Every README rewritten | `readme-gates.py check` prints no FAIL for a file in scope | Implementation |
| M4 | Gates green | Every row of the baseline table matches its expected column | Verification |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: One README per worker brief

**Status**: Accepted

**Context**: About 110 files need a draft. The operator's standing feedback on CLI dispatch is that a long brief with several moves made a worker take an hour for one turn. A brief that names several files also makes a failed gate hard to tie to one cause.

**Decision**: Each brief names one output file. A pilot of one feature README and one leaf README runs first. Later waves hold up to five briefs on files in different folders. A file that is rejected three times is written by the orchestrating session, and the summary says so.

**Consequences**:
- A rejected return costs one file's rerun, and the diff of a run touches one path.
- About 110 runs instead of about 25. Mitigation: the two templates carry the fixed blocks, so a brief differs only in its facts.

**Alternatives Rejected**:
- One brief per feature folder with all its READMEs: fewer runs, but it is the multi-move brief the operator's feedback rules out.

### ADR-002: The code-folder validator type without its inline-path rule

**Status**: Accepted

**Context**: `validate_document.py` types every hook README as `readme`, and all 183 pass. Its `code_folder` type holds the shape rules of `sk-create-readme` section 6: a tree when the folder has subfolders and a complete file table when it has none. It also holds `code_folder_inline_path`, which requires every backticked path to resolve from the README's own folder. The hook READMEs write paths from the repository root, such as `.skilled/bin/install-codex-hooks.mjs`, and `check_readme_references.py` resolves them that way. The worked example fails that one rule 18 times and no other.

**Decision**: G2 runs `--type code_folder` and accepts a file whose only blocking rule is `code_folder_inline_path`. G4 checks that each path resolves.

**Consequences**:
- The tree, the file table, the relative links and the no-hash rule are enforced by a script.
- A path that resolves from neither the README folder nor the repository root is caught by G4, not G2.

**Alternatives Rejected**:
- Rewrite every path relative to the README folder: it changes hundreds of byte-exact paths the child goal's decision D1 freezes, and a reader could no longer paste one into a shell at the repository root.
- Skip the `code_folder` type: the shape rules would rest on a read alone.

### ADR-003: A deleted leaf's trigger phrases move to the README one level up

**Status**: Accepted

**Context**: Each leaf README carries about three trigger phrases, and the trigger index maps a phrase to its document. A phrase that is deleted with its file makes the lookup miss.

**Decision**: Every trigger phrase of a deleted leaf README is added to the frontmatter of the README that takes its row, unless that file already holds the phrase. A rewritten README keeps its own phrases. `readme-gates.py triggers` proves both.

**Consequences**:
- The lookup still finds a document for each phrase.
- A feature README's frontmatter grows by up to 18 phrases. Mitigation: no standard caps the list, and the phrases sit above the text a reader reads.

**Alternatives Rejected**:
- Drop the leaf phrases: a phrase such as a runtime name with the feature name would no longer reach any document.

### ADR-004: Five sibling documents for session-handover

**Status**: Accepted

**Context**: `session-handover/README.md` holds 14,422 words in nine sections. The approved plan keeps orientation, quick start, the adapter matrix and the switches in the README and moves the deep behaviour into sibling documents, as `goal/goal-plugin.md` does.

**Decision**: The README keeps OVERVIEW, the quick start from STARTING THE LOOP, RUNTIME COVERAGE from the adapter matrix, DIRECTORY TREE, KEY FILES, CONFIGURATION from SWITCHES AND DEFAULTS, VALIDATION and RELATED. Five documents take the rest, and every fact moves with its section:

| Document | Takes these sections of today's README |
|----------|-----------------------------------------|
| `handoff-protocol.md` | HANDOFF PROTOCOL without its goal subsections, History Lookup After A Claim, Outside The Loop, Sub-Agents And Nested Runs |
| `goal-carry-over.md` | Goal Packet, Goal In A Claude Receiver, Goal Carry-Over: What Was Shown Live, Known Race: A Claude Goal Continuation During The Arm |
| `runtime-behavior.md` | The full adapter matrix without its Spike evidence column, Model And Effort Across A Hop, Automatic triggers on Codex, Command-only runtimes: Cursor and Devin, Runtime Behavior And Limits, and the shell shim mechanics of Run every session under the loop |
| `state-files.md` | STATE FILES and Hop History |
| `troubleshooting.md` | TROUBLESHOOTING |

[DEVIATION, recorded at the split: the table above first left two parts without a home. The README's quick start keeps the enable flag and the shell line of Run every session under the loop, and the shim mechanics after them move to `runtime-behavior.md`, which also takes the matrix columns the README's coverage table has no room for. `handoff-protocol.md` already takes about 4,300 source words, so it does not take more. The Spike evidence column goes, because its cells are links into `specs/` and a packet id.]

**Consequences**:
- The README falls under 3,000 words, and each document holds one topic.
- A reader who searched the README for the handoff protocol now follows a link. Mitigation: RELATED and the section each topic left hold the link, and T042 corrects the lines elsewhere that describe the README.

**Alternatives Rejected**:
- One `reference.md` with everything: it would hold about 11,000 words and fail the one-pass read again.
- A `references/` subfolder: the precedent in `goal/` keeps the document next to the README, and a new folder would need its own README.

### ADR-005: Folded rows of skill-owned READMEs stay in the skill-owned file

**Status**: Accepted

**Context**: `git-message-gate/README.md`, `git-preflight/README.md`, `spec-gate/README.md` and `skill-advisor/README.md` are links to three files inside skills. Their 23 link-only leaf folders need a home for their rows. The approved plan limits `skill-advisor-hook.md` to blockers.

**Decision**: Each row goes into the per-runtime table of the real file, with the entry written from the repository root, because one file serves two hook folders in the `sk-git` case. `skill-advisor-hook.md` gets the eight rows, the leaf trigger phrases and its hard blockers fixed, and no other change. It is exempt from G2 and G6.

**Consequences**:
- No link-only folder keeps a README, and the advisor reference keeps its text.
- `skill-advisor/README.md` stays the one file that fails the sentence metrics. Mitigation: REQ-005 and SC-002 name it.

**Alternatives Rejected**:
- Put the 23 rows in the root hooks README: a reader of `spec-gate/` would have to leave the folder for its own entries.
- Replace the four links with new READMEs in the hooks tree: it would duplicate three skill documents.

---

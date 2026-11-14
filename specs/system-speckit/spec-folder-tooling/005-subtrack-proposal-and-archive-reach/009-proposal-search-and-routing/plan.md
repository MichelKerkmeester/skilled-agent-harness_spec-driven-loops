---
title: "Implementation Plan: Phase 9: proposal-search-and-routing"
description: "Extend rg-wrapper.mjs and suggest-subtracks.mjs in place, then reword two groups of advisor signals in the system-spec-kit graph metadata and regenerate the advisor files through their writers. The code and the signals land as two commits. Prove the code with cases that fail first and the signals with scores under the pinned regime."
trigger_phrases:
  - "proposal search and routing plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 9: proposal-search-and-routing

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js ESM (`.mjs`), TypeScript test files and JSON metadata |
| **Framework** | None |
| **Storage** | `graph-metadata.json` of system-spec-kit, and the advisor's generated `skill-graph.json` and `scorer-eval-baseline.json` |
| **Testing** | vitest for the two scripts, and the advisor's baseline capture and ratchet suites for the signals |

### Overview
This phase changes two scripts and one metadata file, and regenerates two advisor files with their own writers. The scripts change in place and each gets a case that fails first. The signals change by wording only, measured under the pinned regime before and after. The code lands in one commit and the signals in a second, as the two earlier signal fixes did.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] T001 reproduced A11, A12, B7 and B8 and recorded the command that prints a prompt's scores under the pinned regime
- [ ] T002 listed every reader of the path recipe's JSON record
- [ ] T003 saved the suite baseline and the scorer baseline output

### Definition of Done
- [ ] All four requirements pass their acceptance check, or REQ-004 is marked blocked with the operator's answer recorded
- [ ] From `runtime/cli`, `../../node_modules/.bin/vitest run --config ../../vitest.config.ts --project cli tests/rg-include-archive.vitest.ts tests/rg-wrapper-recipes.vitest.ts tests/suggest-subtracks.vitest.ts` exits 0
- [ ] The two ratchet suites under `.skilled/skills/system-skill-advisor/runtime/tests/parity/` pass
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
In-place script extension

### Key Components
- **Path record** (`rg-wrapper.mjs`, lines 376 to 382): the record gains one field beside `paths`, `archivedPaths`, that lists the paths under a `z_archive/` folder. Changing the elements of `paths` from strings to objects would break any reader that takes them as strings, and an added field breaks none. T002 lists the readers before the field is added.
- **Group names** (`suggest-subtracks.mjs` `nameGroups`, lines 236 to 268): the set of used names is seeded with every folder that already exists in the track, declared or not.
- **Packet names** (`suggest-subtracks.mjs` `renumbered`, lines 177 to 181): a packet whose name is not `NNN-slug` is reported and no map is printed, because `relocate.mjs:472` refuses that name as a source. The exit status stays 0, the status the header gives an explained non-answer.
- **Signals** (`graph-metadata.json` of system-spec-kit, the list that ends at line 111): the archive-search signal is reworded so that no word of four or more letters in it sits inside `findings` or `research`, and it uses none of `find`, `search`, `locate`. The sub-track signals are reworded until the three track prompts route to system-spec-kit, and no signal takes a skill or track name to get there. Wording is the only move here. A scorer change is out of scope, and so is an edit to the hand-written `local-native-approved-divergences.json`: a new divergence stops the task.

### Data Flow
The path recipe builds its record from the matched lines and prints it. The proposal tool clusters the track's packets, names the groups and prints a map for `relocate.mjs`. The advisor reads each skill's `graph-metadata.json` and scores a prompt against its signals. `skill_graph_compiler.py --export-json` and `capture-scorer-eval-baseline.mjs --write` regenerate the two files the advisor keeps beside them.

### Shared Contracts
The path record carries `schemaVersion` 3, and the parent spec names `.skilled/commands/speckit/search.md` and the retrieval conventions as the documents that describe the archive mode. Adding a field leaves the fields a current reader takes unchanged. The signals are read by the advisor, whose ratchet suites hold every metric to the recorded baseline, so a moved number needs a recapture by the writer and a line in `goal.md`. The hub vocabulary session regenerates the same two generated files, so the signal commit takes `origin/main` into the branch before the writers run, and whichever branch merges second reruns both writers on top of the first.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.

Setup reproduces the four findings, records the pinned scoring command and saves both baselines. Implementation changes `rg-wrapper.mjs` and `suggest-subtracks.mjs` with a failing case each, then rewords the signals in `graph-metadata.json` and regenerates the advisor files. Verification reruns the reproductions, the three suites and the two ratchet suites, and validates this folder.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

The suite command is `../../node_modules/.bin/vitest run --config ../../vitest.config.ts --project cli tests/rg-include-archive.vitest.ts tests/rg-wrapper-recipes.vitest.ts tests/suggest-subtracks.vitest.ts`, run from `runtime/cli`, and it must exit 0.

Each changed script gets one happy-path case and one edge case, and each fails before its fix. The search cases assert on the parsed record: an archive-only phrase and a live-only phrase. The proposal cases feed the printed map to the relocate preflight in a temp tree and assert its exit status, so they test the outcome and not the naming code. The signals get no new unit test. Their proof is the score of named prompts before and after, with the signal removed as the control, three control prompts that must keep their top skill, the list of corpus rows whose top skill changed, plus the advisor's own ratchet suites.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

`node`, `python3` for `skill_graph_compiler.py`, `rg` and the vitest binary at `.skilled/skills/system-spec-kit/node_modules/.bin/vitest`. No new package. The proposal check reads the relocate preflight as phase 006 leaves it. Nothing here waits for phases 007 and 008. The signal commit shares two generated files with the hub vocabulary session and follows the merge order in Shared Contracts.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a reader of the path record fails on the added field, or a prompt outside the sub-track and archive requests changes its top skill.
- **Procedure**: revert the commit that caused it. The code commit and the signal commit revert apart. After reverting the signal commit, run `skill_graph_compiler.py --export-json` and `capture-scorer-eval-baseline.mjs --write` again so the generated files match.
<!-- /ANCHOR:rollback -->

---

---
title: "Implementation Plan: Phase 9: legacy-lane-overlap-measurement"
description: "Collect the twelve legacy lane command names and the CLI vitest project's name list, join them on a normalized name, and publish one report with the confirmed overlap count, the reviewed pairs and a per-lane recommendation. Prove it with a reproducible check subcommand."
trigger_phrases:
  - "legacy lane overlap measurement plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 9: legacy-lane-overlap-measurement

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Bash 3.2, Node 22, Vitest 4.1.12 |
| **Framework** | npm scripts, the `vitest list` command, twelve standalone Node and bash harnesses |
| **Storage** | None |
| **Testing** | `scratch/measure-overlap.sh check`, `wc -l`, `awk`, `rg`, `validate.sh` |

### Overview
Collect two name lists and compare them. One list is every name the CLI vitest project declares, taken from `vitest list` without running a test; the other is every name the twelve legacy lanes report while they run. Join them on a normalized name, read every candidate pair in both source files, and publish the confirmed overlap count with one recommendation line per lane.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified

### Definition of Done
- [ ] `wc -l < specs/system-speckit/runtime-and-release/006-test-cycle-speed/009-legacy-lane-overlap-measurement/scratch/lane-commands.txt` prints `12`
- [ ] `wc -l < specs/system-speckit/runtime-and-release/006-test-cycle-speed/009-legacy-lane-overlap-measurement/scratch/cli-vitest-names.txt` prints `2520`
- [ ] `awk -F'\t' '{print $1}' specs/system-speckit/runtime-and-release/006-test-cycle-speed/009-legacy-lane-overlap-measurement/scratch/legacy-lane-names.txt | sort -u | wc -l` prints `12`
- [ ] `bash specs/system-speckit/runtime-and-release/006-test-cycle-speed/009-legacy-lane-overlap-measurement/scratch/measure-overlap.sh check` prints `lists-match`, `review-complete` and `overlap=ok`
- [ ] `rg -c '^Recommendation: ' specs/system-speckit/runtime-and-release/006-test-cycle-speed/009-legacy-lane-overlap-measurement/scratch/legacy-lane-overlap.md` prints `12`
- [ ] `validate.sh --strict --quiet` prints `RESULT: PASSED`
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Read-only census

### Key Components
- **`scratch/lane-commands.txt`**: the twelve `(node|bash) tests/...` commands that `test:legacy` and `test:validation` chain, one per line, each prefixed with its npm script. This file is the unit of attribution, because one lane's output is otherwise indistinguishable from another's.
- **`scratch/cli-vitest-names.txt`**: every name `vitest list --project cli` prints, with the `[cli] ` prefix removed. Names are read, never executed.
- **`scratch/measure-overlap.sh`**: the only executable artifact. `collect` builds the CLI package once and runs the twelve commands, writing per-lane logs and the attributed name list; `report` writes the report and refuses to overwrite an existing one unless given `--force`, because the review edits the report; `check` re-derives the counts and prints one verdict line per property.
- **`scratch/legacy-lane-overlap.md`**: the deliverable. Both lists in full, the counting basis, the overlap count, the reviewed pairs and the per-lane recommendation.

### Data Flow
`package.json` is read into `lane-commands.txt`. `collect` runs each command inside `.opencode/skills/system-spec-kit/runtime/cli`, captures combined stdout and stderr into `scratch/lane-logs/<lane>.log`, and extracts names with the extractor that `scratch/lane-name-sources.md` assigns to that lane. The result is `legacy-lane-names.txt`, one `<lane>` tab `<name>` line per test. `report` normalizes both sides to lowercase alphanumerics, joins them, and writes the report. A reviewer marks each candidate pair `same` or `different` with a `file:line` on both sides. `check` re-reads the lists, recomputes the count from the lists and the marks, and fails when the report disagrees with its own inputs.

Name shapes differ by lane, so extraction is per shape and never global: `   ✅ <name>` and `   [PASS] <name>` from the Node harnesses, `PASS: <message>` from two Node harnesses and three bash suites, `  ok    <name>` from two bash suites, and `  • [<category>] <name>` or `  - [<category>] <name>` from the two suites that carry a `--list` flag. `scratch/lane-name-sources.md` records which lane uses which shape, and the command that proves it.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

- **Setup**: Read `package.json`, record the twelve lane commands, collect the CLI project's 2,520 names, and record each lane's name shape in `scratch/lane-name-sources.md`.
- **Implementation**: Write `scratch/measure-overlap.sh`, run `collect` over the twelve lanes to produce `scratch/legacy-lane-names.txt`, then run `report` to write `scratch/legacy-lane-overlap.md`.
- **Verification**: Read every candidate pair in both source files and mark it, add one recommendation line per lane, then run `check` and confirm it prints `lists-match`, `review-complete` and `overlap=ok`.

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

No test file changes, and no test is deleted or narrowed. The proof is the report and a check that re-derives its numbers: `measure-overlap.sh check` prints `lists-match` when the two fenced lists in the report have the same line counts as `cli-vitest-names.txt` and `legacy-lane-names.txt`, `review-complete` when `Unreviewed candidate pairs: 0` agrees with the number of marked review rows, and `overlap=ok` when `Overlap count:` equals the exact matches recomputed from the two lists plus the rows marked `same`. `validate.sh --strict --quiet` prints `RESULT: PASSED` for the packet.

The measurement is name-based on both sides, so it cannot prove that two similarly named tests assert the same thing. That limit is handled by reading every candidate pair in both files before it counts, and by reporting the exact matches and the confirmed pairs as separate numbers rather than one blended figure.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

`node` and `npm` (Node 22, as CI uses), the `vitest` 4.1.12 binary already installed in `.opencode/skills/system-spec-kit/runtime/cli`, `bash` 3.2 or newer, `rg` and `awk`. The CLI package build that `npm run test:legacy` performs is repeated once by `collect`. No new package, no lockfile change and no network access beyond the local install.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Trigger: a lane's captured output shows the harness did not run, or the report's count cannot be reproduced by `check`. Remove the generated files under `scratch/` and rerun `collect` and `report`. The phase writes only inside `specs/system-speckit/runtime-and-release/006-test-cycle-speed/009-legacy-lane-overlap-measurement/scratch/`, so no tracked source, test, workflow or hook needs a revert.
<!-- /ANCHOR:rollback -->

---

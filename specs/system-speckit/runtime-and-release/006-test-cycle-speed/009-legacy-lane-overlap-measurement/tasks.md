---
title: "Tasks: Phase 9: legacy-lane-overlap-measurement"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "legacy lane overlap measurement tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 9: legacy-lane-overlap-measurement

<!-- SPECKIT_LEVEL: 1 -->

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

**Paths**: Each task names its file in full, so no path variables are used. The scratch prefix in every command is `specs/system-speckit/runtime-and-release/006-test-cycle-speed/009-legacy-lane-overlap-measurement/scratch`, and every command runs from the repository root.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Record the twelve entry commands behind the lane step by reading the two npm scripts and keeping only the `(node|bash) tests/...` segments (`specs/system-speckit/runtime-and-release/006-test-cycle-speed/009-legacy-lane-overlap-measurement/scratch/lane-commands.txt`): `node -e 'const p=require("./.opencode/skills/system-spec-kit/runtime/cli/package.json"); for (const k of ["test:legacy","test:validation"]) for (const c of p.scripts[k].split("&&").map(s=>s.trim()).filter(c=>/^(node|bash) tests\//.test(c))) console.log(k+"\t"+c)' > specs/system-speckit/runtime-and-release/006-test-cycle-speed/009-legacy-lane-overlap-measurement/scratch/lane-commands.txt`. Verify: `wc -l < specs/system-speckit/runtime-and-release/006-test-cycle-speed/009-legacy-lane-overlap-measurement/scratch/lane-commands.txt` prints `12`.
- [ ] T002 Record every name the CLI vitest project declares, collected without running a test (`specs/system-speckit/runtime-and-release/006-test-cycle-speed/009-legacy-lane-overlap-measurement/scratch/cli-vitest-names.txt`): `( cd .opencode/skills/system-spec-kit/runtime/cli && npx vitest list --config ../../vitest.config.ts --project cli 2>/dev/null ) | rg '^\[cli\] ' | sed 's/^\[cli\] //' > specs/system-speckit/runtime-and-release/006-test-cycle-speed/009-legacy-lane-overlap-measurement/scratch/cli-vitest-names.txt`. Verify: `wc -l < specs/system-speckit/runtime-and-release/006-test-cycle-speed/009-legacy-lane-overlap-measurement/scratch/cli-vitest-names.txt` prints `2520`.
- [ ] T003 Record one row per lane naming the command, the shape that lane prints its names in, the extractor the harness will use, and the command that proves the shape (`specs/system-speckit/runtime-and-release/006-test-cycle-speed/009-legacy-lane-overlap-measurement/scratch/lane-name-sources.md`). The five shapes are `   ✅ <name>`, `   [PASS] <name>`, `PASS: <message>`, `  ok    <name>` and `  •`/`  -` `[<category>] <name>` from the two suites that take `--list`. Verify: `rg -c '^\| (node|bash) tests/' specs/system-speckit/runtime-and-release/006-test-cycle-speed/009-legacy-lane-overlap-measurement/scratch/lane-name-sources.md` prints `12`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Write the measurement harness with three subcommands (`specs/system-speckit/runtime-and-release/006-test-cycle-speed/009-legacy-lane-overlap-measurement/scratch/measure-overlap.sh`). `collect` runs `npm --prefix .opencode/skills/system-spec-kit/runtime/cli run build` once, then runs each command from `lane-commands.txt` inside the CLI package with combined output logged to `scratch/lane-logs/<lane>.log`, and writes `<lane>` tab `<name>` lines to `legacy-lane-names.txt` using the extractor recorded in `lane-name-sources.md`. `report` writes `legacy-lane-overlap.md` with the sections `## 1. Counting basis`, `## 2. CLI vitest project names`, `## 3. Legacy lane names`, `## 4. Exact name matches`, `## 5. Candidate pairs`, `## 6. Substantive review`, `## 7. Per-lane recommendation` and `## 8. Method and limits`, plus the lines `Overlap count: <n>` and `Unreviewed candidate pairs: <n>`; it refuses to overwrite an existing report unless given `--force`. `check` prints `lists-match`, `review-complete` and `overlap=ok`, or the matching failure word, and exits non-zero when any check fails. The script writes only inside `scratch/`. Verify: `bash -n specs/system-speckit/runtime-and-release/006-test-cycle-speed/009-legacy-lane-overlap-measurement/scratch/measure-overlap.sh && echo harness-syntax-ok` prints `harness-syntax-ok`.
- [ ] T005 Run `collect` over the twelve lanes so every name is recorded against the lane that reported it (`specs/system-speckit/runtime-and-release/006-test-cycle-speed/009-legacy-lane-overlap-measurement/scratch/legacy-lane-names.txt`): `bash specs/system-speckit/runtime-and-release/006-test-cycle-speed/009-legacy-lane-overlap-measurement/scratch/measure-overlap.sh collect`. A lane that exits non-zero stops the run, because a partial list would understate the lane's coverage. Verify: `awk -F'\t' '{print $1}' specs/system-speckit/runtime-and-release/006-test-cycle-speed/009-legacy-lane-overlap-measurement/scratch/legacy-lane-names.txt | sort -u | wc -l` prints `12`.
- [ ] T006 Run `report` to write both lists in full and the counts (`specs/system-speckit/runtime-and-release/006-test-cycle-speed/009-legacy-lane-overlap-measurement/scratch/legacy-lane-overlap.md`): `bash specs/system-speckit/runtime-and-release/006-test-cycle-speed/009-legacy-lane-overlap-measurement/scratch/measure-overlap.sh report`. The count is the exact normalized-name matches plus the pairs later marked `same`; the report states that basis in section 1. Verify: `rg -c '^Overlap count: ' specs/system-speckit/runtime-and-release/006-test-cycle-speed/009-legacy-lane-overlap-measurement/scratch/legacy-lane-overlap.md` prints `1`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T007 Read every candidate pair in both source files and mark it, adding one row per pair with the verdict and a `file:line` on each side (`specs/system-speckit/runtime-and-release/006-test-cycle-speed/009-legacy-lane-overlap-measurement/scratch/legacy-lane-overlap.md`). A candidate is a legacy name that shares at least three content tokens of four or more characters with a CLI name, ignoring `test`, `tests`, `with`, `that`, `this`, `from`, `into`, `when`, `then`, `does`, `not`, `for`, `and` and `the`. Each review row starts `| same |` or `| different |`; `same` means the two tests assert the same behaviour, not merely a similar title. Verify: `bash specs/system-speckit/runtime-and-release/006-test-cycle-speed/009-legacy-lane-overlap-measurement/scratch/measure-overlap.sh check` prints `review-complete`.
- [ ] T008 Add the twelve recommendation lines, one per lane, each marked `keep` or `narrow` and naming the lane's covered and uncovered names (`specs/system-speckit/runtime-and-release/006-test-cycle-speed/009-legacy-lane-overlap-measurement/scratch/legacy-lane-overlap.md`). `narrow` is written only when every name in that lane has a confirmed CLI counterpart; the line is a recommendation for the operator, and this phase narrows nothing. Verify: `rg -c '^Recommendation: ' specs/system-speckit/runtime-and-release/006-test-cycle-speed/009-legacy-lane-overlap-measurement/scratch/legacy-lane-overlap.md` prints `12`.
- [ ] T009 Confirm the report agrees with its own inputs after the review and the recommendation pass (`specs/system-speckit/runtime-and-release/006-test-cycle-speed/009-legacy-lane-overlap-measurement/scratch/legacy-lane-overlap.md`): `bash specs/system-speckit/runtime-and-release/006-test-cycle-speed/009-legacy-lane-overlap-measurement/scratch/measure-overlap.sh check`. Verify: the command prints `overlap=ok`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-speckit/runtime-and-release/006-test-cycle-speed/009-legacy-lane-overlap-measurement --strict --quiet` prints `RESULT: PASSED`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Timing baseline**: See `../007-test-and-ci-bloat-research/research/research.md` section 3, and its section 4 rank 2 for the measurement this phase performs
- **Serial job baseline**: See `../008-spec-kit-check-parallel-jobs/spec.md` for run 43174399120, the same run this packet's step timings come from
<!-- /ANCHOR:cross-refs -->

---

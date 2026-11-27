---
title: "Tasks: Reference evidence research for the OpenBot parity build"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "reference evidence research tasks"
importance_tier: "normal"
contextType: "research"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Reference evidence research for the OpenBot parity build

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

`P` is `specs/system-skilled-bots/002-openbot-parity-research/004-reference-evidence-research`. `C` is `specs/system-skilled-bots/context`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Write the research topic (`scratch/research-topic.txt`). Verify: `grep -c "openhuman-full" $P/scratch/research-topic.txt` prints 2 or more.
- [x] T002 Write the six seed questions (`scratch/frontier-seed.json`). Verify: `frontier-admit.cjs seed` against a scratch folder prints six admitted nodes and `"pruned":[]`.
- [x] T003 Confirm the inputs and both executors (`scratch/preflight.txt`). Verify: `ls $C | grep -v '\.log$' | wc -l` prints 10, and `command -v vibe pi` prints two paths.
- [x] T004 Probe each provider with one trivial call (`scratch/preflight.txt`). Verify: each probe returns a model answer and the file records both.
- [x] T005 Dry-run the fan-out (`scratch/dry-run.txt`). Verify: the preview names `vibe-1`, `vibe-2`, `pi-1` and `pi-2`, shows 10 iterations and `--thinking max` for each `pi` lineage, prints the `dry_run_halt` line, and `ls $P/research` fails because nothing was written.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T006 Run the fan-out loop with the invocation in `plan.md` (`research/`). Verify: `research/orchestration-summary.json` records `"total_cli_lineages": 4`.
- [x] T007 Rerun any lineage that failed, on the other provider when its own is out of usage (`research/orchestration-summary.json`). Verify: the summary records `"failed": 0`, or `goal.md` names each lineage left failed and why.
- [x] T008 Synthesize one evidence section per 003 phase and the ranked net-new list (`research/research.md`). Verify: the file names each of the fourteen phase folders in a heading.
- [x] T009 Re-check every finding against its cited line and record the regrades (`research/research.md`). Verify: the synthesis marks each finding confirmed, weak, wrong or not verified.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Count the iteration records (`research/lineages/`). Verify: `find $P/research/lineages -maxdepth 3 -path '*/iterations/iteration-*.md' | wc -l` prints 40.
- [x] T011 Check that no lineage wrote outside the packet (`research/`). Verify: `git status --short` lists no path outside `specs/system-skilled-bots/002-openbot-parity-research/`.
- [x] T012 Validate the packet (`spec.md`). Verify: `validate.sh --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
- [x] `research/research.md` exists and 40 iteration records sit under `research/lineages/`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Research synthesis**: See `research/research.md`, written by the run
- **Parent**: See `../spec.md`
<!-- /ANCHOR:cross-refs -->

---

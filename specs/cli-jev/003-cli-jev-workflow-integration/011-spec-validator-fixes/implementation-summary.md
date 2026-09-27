---
title: "Implementation Summary: Spec Validator Fixes"
description: "Complete. AC_COVERAGE now names each cited file:line that does not resolve without changing its ratio, check-goal.cjs accepts a goal.md path, and a shell test pins the create.sh phase labels another packet fixed."
trigger_phrases:
  - "spec validator fixes summary"
  - "ac coverage unresolved citation status"
  - "check-goal goal.md path status"
  - "spec validator fixes build evidence"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-jev/003-cli-jev-workflow-integration/011-spec-validator-fixes"
    last_updated_at: "2026-09-27T17:51:28Z"
    last_updated_by: "closure-leaf"
    recent_action: "Closed the phase from the build evidence"
    next_safe_action: "None. The orchestrator commits"
    blockers: []
    key_files:
      - "specs/cli-jev/003-cli-jev-workflow-integration/011-spec-validator-fixes/spec.md"
      - "specs/cli-jev/003-cli-jev-workflow-integration/011-spec-validator-fixes/plan.md"
      - ".skilled/skills/system-spec-kit/runtime/cli/rules/check-ac-coverage.sh"
      - ".skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-011-spec-validator-fixes"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Goal criterion 6 wording: amended at close to REQ-010's own check, the --description the stub logs (orchestrator decision)"
      - "Counting unresolved citations: option A, report only (scratch/briefs/00-index.md)"
      - "Detecting a phase label that disagrees with its folder number: option A, fix at the source only (scratch/briefs/00-index.md)"
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: Spec Validator Fixes

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 011-spec-validator-fixes |
| **Status** | Complete |
| **Completed** | 2026-09-27 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A reader of `validate.sh` output can now see which cited `file:line` does not resolve, `check-goal.cjs` checks the right folder when it is handed that folder's `goal.md`, and a shell test pins the folder-number labels on children that `create.sh --phase --parent` appends.

### Spec Validator Fixes

`AC_COVERAGE` used to count any `file:line` shape in a Verification cell without checking that the file exists. Both awk parsers now carry every counted citation out as a fifth tab field, `AC-ID (path:line)`, with `-` for an empty list. Three new bash helpers, `_ac_file_has_line()`, `_ac_citation_resolves()` and `_ac_unresolved_citations()`, resolve each citation: an absolute path as written, else the packet folder, else the repository root from one `git rev-parse` call per run, with the working directory as the fallback. A citation resolves when the file is readable and its line is between 1 and the file's line count. `run_check()` names every unresolved citation in one `Unresolved evidence citation(s):` detail, next to the existing malformed line. The covered count, rule status, floor, cutoff and advisory default are unchanged, because no line that increments `covered` changed.

The review fixes tightened that detail line. A comma or semicolon after one citation no longer leaks into the next. A line number longer than nine digits is unresolved, because bash arithmetic wraps past 64 bits. The legacy parser no longer splits an id cell such as `AC-001, AC-002` on its own comma.

`check-goal.cjs` used to refuse `<folder>/goal.md` with `packet path is not a directory`. `main()` now swaps a `goal.md` argument that is not a directory for its folder before the checks run. The exports, the five checks and the exit codes are untouched, and a path to any other file still exits 2.

The `create.sh` label fix was already in place when the build started, through `8036425eaa` from another packet. This phase edits no line of `create.sh`. Instead `test-phase-system.sh` gains a label case: its description-generator stub now logs `--description`, and the case asserts "Phase 2" and "Phase 3" for appended children in that log, `graph-metadata.json` and the `spec.md` title.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-spec-kit/runtime/cli/rules/check-ac-coverage.sh` | Modified | The fifth field in both parsers, the three resolver helpers, the root lookup and the detail line. The review fixes add the separator strip, the nine-digit guard and the id-list comma |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/check-ac-coverage.sh` | Modified | 20 new cases for the parser output, the resolver, the detail line, the root fallback, the legacy parser, the three review fixes and a citation that climbs out of the packet folder. 115 lines added, none removed |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/test-phase-system.sh` | Modified | The stub logs `--description`, and two new label cases cover a new parent's first child and appended children |
| `.skilled/skills/system-spec-kit/references/validation/validation-rules.md` | Modified | Line 95 names unresolved evidence citations and says they still count |
| `.skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs` | Modified | One hunk in `main()`, 5 lines added and 1 removed |
| `.skilled/skills/sk-doc/sk-create-goal/scripts/tests/check-goal.test.cjs` | Modified | A `goal.md` path matches the folder run, and another file path still exits 2 |
| `.skilled/skills/sk-doc/sk-create-goal/scripts/README.md` | Modified | Line 70 says `<packet>` may be a folder or its `goal.md` |

The build landed in `e9059c8073`, "feat(system-spec-kit): name the evidence citations that do not resolve", 289 insertions and 9 deletions across the seven files. The review fixes landed in `03e567cfe7`, "fix(system-spec-kit): split joined citations and bound cited line numbers in the AC coverage rule", 21 insertions and 3 deletions in the rule and its test. The outside-root case landed in `baf2876802`, "test(system-spec-kit): pin how a citation that climbs out of the packet folder resolves", 3 insertions in the test.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The orchestrator took the baselines, then dispatched twelve single-change briefs from `scratch/briefs/`. Brief 01 (the fifth field) ran on codex gpt-5.5 high in 208 s. Brief 02 (the resolver) started on codex gpt-5.5 medium, which hit its usage limit, so it and briefs 03 to 05 ran on cursor Grok 4.7 (`grok-4.7-xhigh-fast`). Briefs 06 and 07 (`check-goal.cjs` and the label test) ran on codex gpt-5.5 medium in 118 and 94 s. Briefs 08 and 09 (the two doc lines) ran on pi deepseek-v4.1-flash, thinking max, in 57 and 24 s. The orchestrator verified each result and committed briefs 01 to 09 as `e9059c8073`.

A reviewer on Claude Opus 5.5, a different model family from the GPT and Grok executors, then reviewed that commit. It found no P0 or P1 and three P2s in the new detail line. Briefs 10 to 12 fixed them on cursor Grok 4.7, and the orchestrator committed them as `03e567cfe7`. After the first closure pass, brief 13 on cursor Grok 4.7 (128 s) added the outside-root test case as `baf2876802`. These phase docs were then closed from that evidence.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Report unresolved citations and keep counting them (option A) | A read-only scan found that 56 of the 97 packets at or above the floor would fall under it if unresolved citations stopped counting. The owner chose option A before the build. `goal.md` D1 |
| Fix the label at its source only (option A) | The source fix already existed in `8036425eaa`. Detection in `validate.sh` or `repair-derived.cjs` waits for the `system-spec-kit` owner. `goal.md` D5 |
| Change `check-goal.cjs` only at its command line | The exported functions document a packet directory, and the command line is where the `goal.md` path was refused. `goal.md` D3 |
| Resolve citations in bash, not in awk | macOS awk aborts the whole program with `i/o error` and exit 2 when `getline` reads a directory, which would stop the rule under `set -e`. Bash builtins keep one `git` call per run and no process per citation |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

Every check ran from the worktree root on 2026-09-27. The orchestrator ran them unless the row says otherwise.

| Check | Result |
|-------|--------|
| Baseline, `bash .skilled/skills/system-spec-kit/runtime/cli/tests/check-ac-coverage.sh` | `25 passed, 0 failed`, exit 0 |
| Baseline, `node --test .skilled/skills/sk-doc/sk-create-goal/scripts/tests/` | `tests 18`, `pass 18`, `fail 0`, exit 0 |
| Baseline, `bash .skilled/skills/system-spec-kit/runtime/cli/tests/test-phase-system.sh` | `Results: 10 passed, 0 failed (of 10)`, exit 0 |
| Baseline, `check-goal.cjs specs/cli-jev/003-cli-jev-workflow-integration/006-goal-criteria-lint/goal.md` | `RESULT: FAILED (0/5 checks; errors=1)`, exit 2 |
| `check-ac-coverage.sh` suite | `44 passed, 0 failed` at `03e567cfe7`, exit 0. It was 41/0 at the build commit, the review fixes added three cases, and the final count at `baf2876802` is `45 passed, 0 failed`, exit 0 |
| `node --test` at `03e567cfe7` | `tests 20`, `pass 20`, `fail 0`, exit 0 |
| `test-phase-system.sh` at `03e567cfe7` | `Results: 12 passed, 0 failed (of 12)`, exit 0 |
| `npx vitest run cli/tests/create-root-numbering.vitest.ts --config ../vitest.config.ts`, from the skill's `runtime` folder | `Tests  6 passed (6)`, exit 0 |
| Label revert test, suite against the `create.sh` from `8036425eaa^` | `11 passed, 1 failed`, with the appended-label case failing. Against the current `create.sh`: `12 passed, 0 failed` |
| `diff` of `check-goal.cjs` on 006's `goal.md` and on its folder | Prints nothing. The same command on 006's `spec.md` exits 2 |
| `git diff -U0 e9059c8073~1 -- <the rule> \| grep -cE '^[-+].*covered\+\+'` | `0` |
| `git diff --name-only e9059c8073~1` over `runtime/cli/rules/` and `create.sh` | Only `check-ac-coverage.sh`. No `repair-derived.cjs` change |
| Timing, `validate.sh --strict` on `specs/sk-design/019-sk-design-diagram-upgrade/007-manual-review-remediation` (37 ACs), three runs each | Before 2.26, 1.60 and 1.57 s. After the build 2.32, 1.77 and 1.78 s. After the fixes 1.76, 1.73 and 1.73 s. All exit 0, each printing `37/37 ACs have evidence; floor 34/37` |
| Real packet, `validate.sh --strict` on `specs/system-speckit/033-system-speckit-v4/030-spec-kit-simplification-research/010-template-contract-alignment` | Exit 0, `RESULT: PASSED`, `6/6 ACs have evidence; floor 6/6`, and a detail line starting `Unresolved evidence citation(s): AC-001 (runtime/cli/spec/create.sh:157)` |
| Cross-family review (Claude Opus 5.5) | No P0 or P1. 41/0 under `/bin/bash` 3.2 and 20/0 node tests. 7 new cases fail on the pre-build code. Under `set -euo pipefail` a directory, an unreadable file and a huge line number are reported unresolved and the rule exits 0. CRLF and no-trailing-newline files resolve. 404 citations take 0.01 s under macOS awk |
| Stderr, orchestrator at HEAD `baf2876802` | 0 bytes from `check-goal.cjs` on the folder and on its `goal.md` for the parent and all 18 children of `003-cli-jev-workflow-integration`, from `node --test` (`tests 20`, `fail 0`), from the `check-ac-coverage.sh` suite (`45 passed, 0 failed`) and from `validate.sh --strict` on four packets. Every exit code was 0 |
| Owner-contract read, post-build | No contradiction with the build. `system-spec-kit/SKILL.md:456`, `validation-rules.md:95` and `:101`, `sk-create-goal/SKILL.md:109`, `scripts/README.md:54` and `:70`, and the `sk-code` shell and Node guides. Detail in `tasks.md` T002 |
| Read-only rechecks while closing these docs | `check-goal.cjs` on 006's `goal.md` and on its folder each print `RESULT: PASSED (5/5 checks)`, exit 0, and their `diff` is empty. 006's `spec.md` prints `packet path is not a directory`, exit 2. `bash -n` and `node --check` exit 0 on the five changed code and test files. The test file diff adds 112 lines and removes none |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:deviations -->
## Deviations

1. **Executor switch.** The plan named codex for the code briefs. Codex hit its usage limit on brief 02, so briefs 02 to 05 and 10 to 12 ran on cursor Grok 4.7. The orchestrator verified each diff the same way.
2. **Commit before review.** The build was committed as `e9059c8073` before its cross-family review ran. The three P2s were fixed in `03e567cfe7`, not by amending the build commit.
3. **No `create.sh` edit.** `8036425eaa`, from another packet, fixed the labels before the build. It also changed the two `phase ${_i}` warnings the spec had put out of scope. AC-009 is met by that commit plus this phase's shell test.
4. **Five checks, not four.** `e7c88670fb` added a fifth `check-goal.cjs` check, so a pass prints `5/5`. `goal.md` D3 and criterion 3, the spec, the plan and AC-004 now say so.
5. **Test baseline.** The planning run recorded 15 `node --test` tests. The build baseline measured 18, and the after-count is 20.
6. **The awk `getline` design was replaced** by bash builtins, as Key Decisions explains.
7. **AC-002's `validate.sh` run** was made on a real packet rather than a fixture. The `expect_detail` case covers the fixture side.
8. **Goal criterion 6 amended at close.** It said the appended children carry their labels "in `description.json`". The test's stub logs the `--description` that `create.sh` passes to the generator and never writes the file, which is what REQ-010 specifies ("through the stub log"). The orchestrator had the wording match REQ-010's own check. `goal.md`'s log records it, and the operator can revert it.
9. **T002 is a post-build read.** No pre-build read of the owner contracts is recorded, so the contracts were read after the build to confirm it conforms.
<!-- /ANCHOR:deviations -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Skill-relative citations stay unresolved.** Many older packets cite paths such as `runtime/cli/spec/create.sh` relative to a skill, so their detail line is long. They still count, as option A chose. Options B and C wait for the `system-spec-kit` owner.
2. **The other mismatched phase labels are not relabeled.** Detection in `validate.sh` or `repair-derived.cjs` waits for the owner.
3. **One checklist item is a recorded deviation.** CHK-051 in `tasks.md`, because `scratch/briefs/` is kept on purpose as the dispatch record, as in phases 012 to 014. It is not an acceptance row.
4. **README count.** `sk-create-goal/scripts/README.md:16` still says "four things" while `check-goal.cjs` has five checks. It is recorded for the `sk-create-goal` owner, not fixed.
<!-- /ANCHOR:limitations -->

---

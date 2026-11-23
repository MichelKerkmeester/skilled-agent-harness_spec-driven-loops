---
title: "Tasks: Phase 13: fix-alignment-findings-for-browser-hub-docs"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "fix alignment findings for browser hub docs tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 13: fix-alignment-findings-for-browser-hub-docs

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

`H` is `.skilled/skills/mcp-browser-use`. `C` is `$H/mcp-chrome-devtools`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Baseline the hub gates (`$H`). Verify: `parent-skill-check.cjs $H` prints `OK` with 0 warnings and the five playbook validators exit 0.
- [x] T002 Baseline the advisor suite (`system-skill-advisor/runtime`). Verify: `npx vitest run` prints `1 failed | 2734 passed | 4 skipped`, the one failure being the empty `system-skilled-bots` folder.
- [x] T003 Reproduce the routing miss (`probes-p03.json`). Verify: `run-probes.cjs` prints `fail P03` and `fail P07` with `pass=7 fail=2`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Apply the doc run's literal fixes (doc run folder). Verify: `apply-fixes.cjs --run-dir <doc run>` prints `applied=45`.
- [x] T005 Fix the judgment findings in the hub docs (`$H/**`). Verify: the doc-run recheck prints `still_open=0`.
- [x] T006 Lift the read-only floor for an own-Chrome attach (`system-skill-advisor/runtime/lib/scorer/fusion.ts`). Verify: `npx vitest run tests/scorer/route-gates.vitest.ts` prints `24 passed`.
- [x] T007 Fix the macOS check, the Node minimum and the domain count (`$C/scripts/install.sh`). Verify: the fixed `detect_chrome_path` prints the Chrome path and `verify_installation` logs `CDP domains available: 53`.
- [x] T008 Set the Node minimum to 20 (`$C/scripts/_utils.sh`). Verify: `bash -n` exits 0 and `rg -n 'min_version="\$\{1:-20\}"'` prints one line.
- [x] T009 Set the Node minimum to 20 (`$C/scripts/doctor.sh`). Verify: `bash $C/scripts/doctor.sh` prints `Node v26.13.0` as a pass.
- [x] T010 Pass viewport JSON through `--params` and read console JSON (`$C/examples/multi-viewport-test.sh`). Verify: `bash -n` exits 0 and the jq filter prints `1` on the console fixture.
- [x] T011 Read console JSON (`$C/examples/animation-testing.sh`). Verify: the jq filter prints `boom` on the console fixture.
- [x] T012 Read console JSON (`$C/examples/performance-baseline.sh`). Verify: the jq filter prints `  [error] boom` on the console fixture.
- [x] T013 Rewrite the prose that described the old script behavior (`$C/README.md`). Verify: `rg -n -i 'stops at the first viewport|only for 18'` over `$H` prints nothing.
- [x] T014 Name the form commands in the port-defect entry (`$C/changelog/v1.0.27.0.md`). Verify: `check_changelog_shape.py` prints `PASS`.
- [x] T015 Add the port defect to the release notes (`.skilled/changelog/skilled/v4.2.0.0.md`). Verify: `check_changelog_shape.py` prints the same three failures as the HEAD copy and no new one.
- [x] T016 Add `cli-vibe` to the preset kinds (`.skilled/commands/assets/local-doc-alignment/local-doc-alignment-auto.yaml`). Verify: `rg -n cli-vibe` prints one line in each doc-alignment YAML.
- [x] T017 Skip private `local-*` ids in the zombie and ghost checks (`.skilled/commands/doctor/scripts/skill-graph-freshness.cjs`). Verify: the panel prints `ZOMBIE (in SQLite, not on disk): none`.
- [x] T018 Add `deepseek-v4-1-flash-1017-max` to the Devin allowlist (`system-deep-loop/runtime/scripts/fanout-run.cjs`). Verify: `npx vitest run tests/unit/fanout-run.vitest.ts` prints `244 passed`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T019 Replay the probes (`probes-p03.json`). Verify: `run-probes.cjs` prints `pass=9 fail=0`.
- [x] T020 Rerun the advisor suite (`system-skill-advisor/runtime`). Verify: `npx vitest run` prints `1 failed | 2737 passed | 4 skipped`, the same one failure.
- [x] T021 Rerun the hub gates (`$H`). Verify: `parent-skill-check.cjs $H` prints `OK` with 0 warnings and the five playbook validators exit 0.
- [x] T022 Recheck the skilled run (skilled run folder). Verify: `recheck.cjs` prints `resolved=4` with both battery rows passing.
- [x] T023 Run the rescan sweeps over the topic scope and hub root (`sweep-files.txt`). Verify: the positional `bdg cdp` and "26 tools" sweeps print nothing.
- [x] T024 Validate the hub packet (`specs/mcp/mcp-browser-use/001-mcp-browser-use-hub`). Verify: `validate.sh --strict --recursive` prints `RESULT: PASSED` for every folder.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed: the probe replay and both negative controls
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---

---
title: "Tasks: Phase 1: unknowns-and-baseline"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "unknowns and baseline tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 1: unknowns-and-baseline

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`

Each task names its executor in brackets at the end. `(orchestrator)` runs in the orchestrator's shell. `(DeepSeek, cli-devin)` runs through `devin -p --model deepseek-v4-1-flash-max` with `AI_SESSION_CHILD=1` set. Paths are relative to the worktree root. `C` below means `specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/001-unknowns-and-baseline`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Capture `git status --porcelain` into `C/scratch/status-before.txt`. Test whether the sandbox reaches the npm registry with `npm view @opencode-ai/plugin version`. (orchestrator)
- [x] T002 Record the `OPENCODE_DB` path for each binary in `C/scratch/env.txt`. Every session-writing probe uses a file under `C/scratch/`. (orchestrator)
- [x] T003 [P] Record the versions in `C/scratch/versions.txt`: `opencode --version`, `opencode2 --version`, `bun --version` and `node --version`. (orchestrator)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Desk check Q8 (VS Code extension) and Q9 (LSP). Search the repo and `specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/research/` for extension manifests and LSP config, read-only. Write a draft verdict with file and line citations to `C/scratch/desk-q8-q9.txt`. (DeepSeek, cli-devin, `--permission-mode auto`)
- [x] T005 Desk check Q10 (how `CLAUDE.md` loads on each version) and Q11 (the sk-vision source). Confirm the `vision-runtime/src` location, the `build` script in `vision-runtime/package.json` and the symlink target of `.opencode/plugins/sk-vision.js`. Write the draft to `C/scratch/desk-q10-q11.txt`. (DeepSeek, cli-devin, `--permission-mode auto`)
- [x] T006 Probe Q1 (`allowed-tools`) on both versions. Use a scratch project whose skill sets `allowed-tools` to a list that excludes one tool, then attempt that tool. Capture each run to `C/scratch/q1-*.txt`. A run that cannot show a block verdict stays unknown. (DeepSeek, cli-devin, `--permission-mode dangerous`, writes only under `C/scratch/`)
- [x] T007 Probe Q2 (`disable-model-invocation`) on both versions with the same scratch project design. Capture to `C/scratch/q2-*.txt`. (DeepSeek, cli-devin, `--permission-mode dangerous`, writes only under `C/scratch/`)
- [x] T008 Probe Q3 (`-m provider/model#variant`) on v1. Compare the error text for `-m nosuchprovider/nosuchmodel` with the text for `-m nosuchprovider/nosuchmodel#high`. A different parse for the `#high` form is the evidence. Capture to `C/scratch/q3-*.txt`. (DeepSeek, cli-devin, `--permission-mode dangerous`, writes only under `C/scratch/`)
- [x] T009 Probe Q4 (`plugin.check` tolerance). Read the endpoint description for `POST /api/plugin/check` first, and confirm that it checks without installing. Then post a definition with an extra top-level `__test` key through `opencode2 api`. Capture to `C/scratch/q4-*.txt`. (DeepSeek, cli-devin, `--permission-mode dangerous`, writes only under `C/scratch/`)
- [x] T010 Probe Q5 (`session.idle`) and Q6 (`session.compacted`) for live delivery to `ctx.event.subscribe`. Use a scratch plugin that logs each delivery. Run `AI_SESSION_CHILD=1 opencode2 run --standalone -m nosuchprovider/nosuchmodel "probe" </dev/null` with `OPENCODE_DB` under `C/scratch/`. If the bogus model never reaches idle, the verdict is unknown. A real model run needs operator approval. Capture to `C/scratch/q5-q6-*.txt`. (DeepSeek, cli-devin, `--permission-mode dangerous`, writes only under `C/scratch/`)
- [x] T011 Probe Q7 (whether a zod JSON Schema satisfies `Tool.ValueSchema`). Post a plugin that registers one tool with a `z.toJSONSchema` output to `POST /api/plugin/check`, and record the accept or reject response. Capture to `C/scratch/q7-*.txt`. (DeepSeek, cli-devin, `--permission-mode dangerous`, writes only under `C/scratch/`)
- [x] T012 Find the model-free v1 load trigger. Test `opencode run -m nosuchprovider/nosuchmodel "probe" </dev/null` with `OPENCODE_DB` under `C/scratch/`, then read the log for `loading plugin` lines. Record the working trigger, or record that none works. Capture to `C/scratch/v1-trigger.txt`. (DeepSeek, cli-devin, `--permission-mode dangerous`, writes only under `C/scratch/`)
- [x] T013 Record the v1 baseline for the 16 plugins in `C/scratch/v1-load.txt`. Keep the exit status of `opencode debug config </dev/null`, and the `loading plugin` and `failed to load plugin` lines from the T012 trigger. (DeepSeek, cli-devin, `--permission-mode dangerous`, writes only under `C/scratch/`)
- [x] T014 Record the v2 baseline for the 16 plugins in `C/scratch/v2-plugin.json`. Use `opencode2 api GET "/api/plugin?location%5Bdirectory%5D=<percent-encoded repo root>"` with the output redirected to the file. Retry until the count is stable. The `--param` form drops the location, so do not use it. (DeepSeek, cli-devin, `--permission-mode dangerous`, writes only under `C/scratch/`)
- [x] T015 Run the plugin suite baseline with `node --test .opencode/plugins/tests/*.test.cjs > C/scratch/suite-plugin.txt 2>&1`. Read the `# pass` and `# fail` lines. (orchestrator)
- [x] T016 Run the guard suite baseline. Use `node --test .skilled/hooks/dispatch/lib/dispatch-rule-checks.test.mjs .skilled/hooks/mcp-route-guard/lib/mcp-route-guard.test.cjs` for the Node suites. Run `dispatch-audit.test.mjs` with Vitest from `.skilled/`, where `node_modules` exists. Save both outputs to `C/scratch/suite-guard-*.txt`. (orchestrator)
- [x] T017 Repeat the v2 plugin read from T014 with the same command. The count must match T014, which shows the read is stable (NFR-R01). Save to `C/scratch/v2-plugin-repeat.json`. (orchestrator)
- [x] T018 Check that `.skilled/skills/sk-vision/vision-runtime/dist` is absent, then run `bun install` and `bun run build` in `.skilled/skills/sk-vision/vision-runtime/`. Record both exit statuses in `C/scratch/sk-vision-build.txt`. Follow the rollback line in `plan.md` section 4. (orchestrator)
- [x] T019 Load the built bundle through `.opencode/plugins/sk-vision.js`. Record the v1 state from `opencode debug config </dev/null` and the log. Record the v2 state for `sk-vision` from the T014 read format. Do not restart the v2 service (D4). If v2 does not show the rebuilt bundle, record that gap. Save to `C/scratch/sk-vision-load.txt`. (orchestrator)
- [x] T020 Write `C/baseline.json` from the captures T013, T014, T015, T016 and T019. Use a short script kept in `C/scratch/`. The script reads captures only and calls no model. (orchestrator)
- [x] T021 Draft `C/findings.md`. Write one `### Q1` to `### Q11` heading per question, each with a verdict of confirmed, refuted or unknown, its command and its output excerpt. Add a `## Decision changes for the parent` heading that lists each change for the orchestrator. Write only that file. (DeepSeek, cli-devin, `--permission-mode dangerous`, writes only `C/findings.md`)
- [x] T022 Review `C/findings.md` against the captures in `C/scratch/`, findings first. Report each verdict that the captures do not support. Do not edit the file. (GPT-6 Luna max fast, cli-codex, `--sandbox read-only`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T023 Repeat each verdict's command and compare the output with its capture. A mismatch turns the verdict to unknown until it is resolved. Fix any finding T022 raised that the captures support. (orchestrator)
- [x] T024 Run `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/001-unknowns-and-baseline --strict`. Require `RESULT: PASSED` in the output. (orchestrator)
- [x] T025 Run `git status --porcelain` and compare it with `C/scratch/status-before.txt`. The only new paths allowed are inside `C/` and the gitignored sk-vision `dist/` folder. (orchestrator)
- [x] T026 Remove the scratch working files after each cited excerpt sits in `findings.md`. Keep `C/scratch/.gitkeep`. Run this task last, after T024. (orchestrator)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Each verdict in `findings.md` matches its capture on the T023 rerun
- [ ] `validate.sh --strict` prints `RESULT: PASSED` (T024)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance**: See `acceptance-criteria.md`
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md
- [x] CHK-002 [P0] Technical approach defined in plan.md
- [ ] CHK-003 [P1] Dependencies available. Run `opencode --version` (expect `1.19.3`), `opencode2 --version` (expect `opencode v2.0.32`) and `bun --version`.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

This phase changes no repo code, so the code quality checks have nothing to read. The sk-vision build in T018 is a build step, and its exit status is recorded in T018.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] Every row of `acceptance-criteria.md` reads Met. Run `grep -c -E '\| Met \|' specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/001-unknowns-and-baseline/acceptance-criteria.md`, which must print 6.
- [ ] CHK-021 [P0] The desk checks in T004 and T005 finished with file and line citations for each verdict.
- [ ] CHK-022 [P1] Each probe that the child guard refused was rerun by the orchestrator, and the rerun is recorded in `findings.md`.
- [ ] CHK-023 [P1] Each unknown verdict names the evidence that would settle it.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

This phase records behaviour and applies no fix, so the fix checks do not apply here. Any fix found later goes to phase 2 or a later phase.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No credential text in the captures. Run `grep -n -i -E 'api[_-]?key|secret|password|bearer' specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/001-unknowns-and-baseline/scratch/*`. The command must print no line, or the orchestrator redacts each line it prints before closure.
- [ ] CHK-031 [P0] No paid model call. Run `grep -L 'nosuchprovider' specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/001-unknowns-and-baseline/scratch/*`. Every capture that calls a model must name `nosuchprovider`, so the list shows only captures with no model call.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] The eleven question headings agree across the files. Run `grep -c '^- Q' specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/001-unknowns-and-baseline/spec.md`, which must print 11, and `grep -c '^### Q' specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/001-unknowns-and-baseline/findings.md`, which must print 11.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] No new path outside this folder, apart from the gitignored sk-vision `dist/` folder. Check it with T025.
- [ ] CHK-051 [P1] `scratch/` holds only `.gitkeep` before completion. Check it with T026.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 6 | [ ]/6 |
| P1 Items | 6 | [ ]/6 |
| P2 Items | 0 | [ ]/0 |

**Verification Date**: 2026-10-18
<!-- /ANCHOR:summary -->

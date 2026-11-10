---
title: "Implementation Plan: Phase 1: unknowns-and-baseline"
description: "Probes and desk checks that settle eleven open questions and record a per-plugin load baseline on OpenCode 1.19.3 and 2.0.32, with no repo file changes."
trigger_phrases:
  - "unknowns and baseline plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 1: unknowns-and-baseline

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Bash for probe commands, Node for the baseline JSON and the suites, Bun for the sk-vision build |
| **Framework** | OpenCode 1.19.3 (v1, `opencode`) and OpenCode 2.0.32 (v2, `opencode2`) |
| **Storage** | `OPENCODE_DB` files under `scratch/`. No repo database changes. |
| **Testing** | Node built-in test runner for the plugin suites. Vitest for the dispatch-audit suite. |

### Overview
Phase 1 runs probes against both binaries and records what it sees. The probes read the plugin lists, the plugin log lines and the v2 API. Each verdict cites its command and its captured output. The phase changes no repo file. Its outputs are `findings.md` and `baseline.json`, both in this folder.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented in `spec.md`
- [x] Success criteria measurable (SC-001 to SC-003)
- [x] Dependencies identified in `spec.md` section 6

### Definition of Done
- [ ] All acceptance criteria met (`acceptance-criteria.md`)
- [ ] Each verdict in `findings.md` has a command and an output excerpt
- [ ] `validate.sh --strict` prints `RESULT: PASSED`
- [ ] Docs updated (spec, plan and tasks agree)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Probe and record. Each probe writes its raw capture to `scratch/`. A verdict quotes that capture. The baseline and the findings are written from the captures, never from memory.

### Key Components
- **Probe captures in `scratch/`**: one file per probe. The first line of each file is the exact command, and the file keeps the raw output and the exit status.
- **`findings.md`**: one `### Qn` heading per question, with its verdict, its command and its excerpt.
- **`baseline.json`**: a `plugins` object keyed by plugin file name, each with a `v1` and a `v2` load state, and a `suites` object with the `pass` and `fail` counts.

```json
{
  "plugins": {
    "system-spec-gate.js": { "v1": "loaded", "v2": "failed", "capture": "scratch/<file>" }
  },
  "suites": {
    "plugin": { "pass": 0, "fail": 0 },
    "guard": { "pass": 0, "fail": 0 }
  }
}
```

The values above are a shape example. The real values come from the captures.

### Data Flow
A probe runs against one binary and writes its capture to `scratch/`. The orchestrator reruns the same command. A matching rerun confirms the capture. The verdict and the baseline entry then cite that capture by file name.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This phase records behaviour and fixes nothing, so it needs no producer or consumer inventory.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.

### Ordered steps and dispatch

Dispatches run one at a time. Each dispatch sets `AI_SESSION_CHILD=1` in its environment, as the cli-devin and cli-codex contracts require. Each dispatch names its model and flags in full.

| Step | Who runs it | How | Produces |
|------|-------------|-----|----------|
| S1 Setup (T001 to T003) | Orchestrator | Shell, from the worktree root | The status snapshot, the version record and the `OPENCODE_DB` path |
| S2 Desk checks (T004, T005) | DeepSeek V4.1 Flash max via cli-devin | `devin -p --model deepseek-v4-1-flash-max --permission-mode auto`, read-only | Draft verdicts for Q8 to Q11, each with file and line citations |
| S3 Live probes for Q1 to Q7 (T006 to T011) | DeepSeek V4.1 Flash max via cli-devin | `devin -p --model deepseek-v4-1-flash-max --permission-mode dangerous`, with writes limited to `scratch/`. Probes set `OPENCODE_DB` under `scratch/`. | Captures for Q1 to Q7. A probe the child guard refuses goes to the orchestrator. |
| S4 Load trigger and baselines (T012 to T014, T017) | DeepSeek via cli-devin, with orchestrator reruns | The same flags as S3. The suite runs in T015 and T016 stay with the orchestrator. | Captures for the 16 plugins on each version |
| S5 sk-vision build and load (T018, T019) | Orchestrator | `bun run build` in the vision-runtime folder, then a load check in a throwaway project | The build result and the per-version load state |
| S6 Assemble (T020, T021) | Orchestrator writes `baseline.json`. DeepSeek writes `findings.md`. | The orchestrator reads only the captures and calls no model. DeepSeek runs with `--permission-mode dangerous` and writes only `findings.md`. | Both outputs |
| S7 Cross-family review (T022) | GPT-6 Luna max fast via cli-codex | `codex exec --model gpt-6-luna -c model_reasoning_effort="max" -c service_tier="fast" --sandbox read-only` | A findings-first review of `findings.md` against the captures |
| S8 Orchestrator rerun and close (T023 to T026) | Orchestrator | The commands in the verification checklist | The closure evidence |

Rollback for steps that change repo files: no step in this table changes a tracked file. S5 writes two gitignored artifacts inside the sk-vision package. The first is the `dist/` folder, which the build creates. The second is the `node_modules` folder, which `bun install` creates. The rollback line is `rm -r .skilled/skills/sk-vision/vision-runtime/dist .skilled/skills/sk-vision/vision-runtime/node_modules`, and each folder is removed only if this phase created it. The phase checks both folders for absence before S5.

Verification by the orchestrator: the orchestrator reruns the probes in S3 and S4 and the build in S5, and compares each output with its capture. A verdict stands only when the output matches.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | The plugin suite in `.opencode/plugins/tests/`, and the guard suites `dispatch-audit.test.mjs` and `dispatch-rule-checks.test.mjs` in `.skilled/hooks/dispatch/lib/`, plus `mcp-route-guard.test.cjs` | Node built-in test runner, and Vitest for `dispatch-audit.test.mjs` |
| Integration | v1 `opencode debug config` and the v1 plugin log lines. v2 `opencode2 api GET /api/plugin` with the raw query. | `opencode` 1.19.3 and `opencode2` 2.0.32 |
| Manual | Desk checks for the VS Code extension, LSP and `CLAUDE.md` loading | Read and grep of repo files and the research record |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `opencode` 1.19.3 | Internal binary | Green. Version confirmed on 2026-10-18. | The v1 probes and the v1 baseline cannot run. |
| `opencode2` 2.0.32 | Internal binary | Green. Version confirmed on 2026-10-18. | The v2 probes and the v2 baseline cannot run. |
| `bun` | External tool | Yellow. Present on the machine. The version is recorded in T003. | REQ-003 falls back to blocked. |
| Network access in the sandbox | External | Yellow. Unknown until T001 tests it. | `bun install` and any `npm view` call need it. A block is recorded as a finding. |
| DeepSeek V4.1 Flash max via cli-devin | External model | Green. `deepseek-v4-1-flash-max` appears in `devin models list`, checked on 2026-10-18. | The desk checks and live probes move to the orchestrator. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A probe changes a tracked repo file, writes outside `scratch/` or the gitignored sk-vision `dist/` folder, or stops or restarts the v2 service.
- **Procedure**: Stop the probe. Run `git status --porcelain` and compare the result with `scratch/status-before.txt`. Restore each changed tracked file with `git checkout -- <path>`. Remove the sk-vision `dist/` folder only if this phase created it. Run `git status --porcelain` again and confirm the diff is empty.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

Setup (S1) comes first. Probes (S3, S4) and the sk-vision build (S5) follow it and can run in either order. Assemble (S6) needs all of them. Review (S7) and the closing rerun (S8) come last.

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Probes, Baselines, sk-vision build |
| Probes and baselines | Setup | Assemble |
| sk-vision build | Setup | Assemble |
| Assemble | Probes and baselines, sk-vision build | Review |
| Review | Assemble | Closing rerun |
| Closing rerun | Review | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | Not estimated. No timing evidence exists yet. |
| Probes and baselines | Medium | Not estimated. No timing evidence exists yet. |
| Verification | Low | Not estimated. No timing evidence exists yet. |
| **Total** | Medium | **Not estimated. No timing evidence exists yet.** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] `scratch/status-before.txt` holds the `git status --porcelain` output from before any probe
- [ ] Every probe that writes sessions sets `OPENCODE_DB` to a file under `scratch/`
- [ ] No step stops, starts or restarts the v2 background service

### Rollback Procedure
1. Stop the probe that caused the problem.
2. Compare `git status --porcelain` with `scratch/status-before.txt`.
3. Restore each changed tracked file with `git checkout -- <path>`.
4. Remove the sk-vision `dist/` folder only if this phase created it.
5. Confirm that `git status --porcelain` matches the snapshot.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: The session rows written to a scratch `OPENCODE_DB` go away when the scratch folder is removed.
<!-- /ANCHOR:enhanced-rollback -->

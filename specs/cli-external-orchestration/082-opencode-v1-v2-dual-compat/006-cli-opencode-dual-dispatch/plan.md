---
title: "Implementation Plan: Phase 6: cli-opencode-dual-dispatch"
description: "Add one version resolver to the deep-loop runtime, render a v1 argv and a v2 argv from it, and route the four dispatch sites through the result. Live probes settle the v2 directory and command questions first."
trigger_phrases:
  - "cli opencode dual dispatch plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 6: cli-opencode-dual-dispatch

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | CommonJS (`.cjs`) for the runtime script and the resolver. TypeScript for the vitest suite. Markdown for `SKILL.md`. |
| **Framework** | None in the script. The runtime package uses vitest. |
| **Storage** | None. The resolver keeps an in-memory cache for one process. |
| **Testing** | `npx vitest run --no-coverage` in `.skilled/skills/system-deep-loop/runtime`. Live smoke dispatches and the child environment check run by the orchestrator. |

### Overview
The resolver reads the binary order `$OPENCODE_BIN`, `opencode2`, `opencode`, runs `--version`, and parses the output into a major version. Two renderers build the argv. The v1 renderer keeps today's flags. The v2 renderer uses the `#variant` model form, adds `--standalone`, and drops the v1-only flags. Live probes decide the v2 working directory and the native command route before the v2 branch is written.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] The deep-loop runtime suite baseline is recorded (T001).
- [ ] The four `fanout-run.cjs` sites still sit at the lines in spec.md section 3. A moved line halts the phase until the spec is corrected.
- [ ] The live probes in T004 are recorded, and Q2 and Q3 have an answer or a stated default.

### Definition of Done
- [ ] Every acceptance criterion in acceptance-criteria.md is Met or Waived with an ADR.
- [ ] The deep-loop runtime suite exits 0 at or above the T001 count.
- [ ] Both smoke dispatches and the child environment check are recorded with output.
- [ ] The cross-family review has no open P0 or P1 finding.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
A resolver feeds two renderers. The dispatch table chooses the renderer from the resolved major, at the builder seam. No renderer reads the binary name.

### Key Components
- **Resolver** (`opencode-version.cjs`): picks the first binary in the order `$OPENCODE_BIN`, `opencode2`, `opencode`. It runs `--version`, parses the output with the regex from research section 6, and returns `v1`, `v2` or a refusal. It caches by realpath, size and mtime.
- **v1 renderer**: today's argv, unchanged.
- **v2 renderer**: `run --standalone`, `-m <provider>/<model>#<variant>`, the message, and no `--command`, `--dir`, `--variant`, `--pure`, `--share` or `--port`. The working directory comes from the spawn options (decision L1).
- **Dispatch seam**: the `cli-opencode` entry at line 2923 and the availability check at line 2961. Both call the resolver.

### Data Flow
A dispatch request reaches the availability check. The check resolves a binary through the order. The resolver returns the major, and the dispatch selects a renderer. The renderer builds the argv and the spawn options. The spawn runs in the working directory with the child environment, and the output returns to the runner.

### Applicability matrix (required rows, listed before implementation)

| Row | Input | Result |
|-----|-------|--------|
| P1 | `1.19.3` | v1 |
| P2 | `opencode v2.0.32` | v2 |
| P3 | `1.19.3-rc.1` | v1 |
| P4 | empty output | refuse |
| P5 | unparsable output | refuse |
| A1 | only `opencode2` on the path | found, version from its output |
| A2 | only `opencode` on the path | found, version from its output |
| A3 | neither name resolves | refuse, and the error names both |
| D1 | v1 renderer, opencode builder | the current argv |
| D2 | v2 renderer, opencode builder | the v2 argv with `--standalone` |
| D3 | v1 renderer, native builder | the current argv |
| D4 | v2 renderer, native builder | fails closed until Q2 is decided |

Each row maps to one test in the new suite.

### Required inventories
- Producers of argv: `buildNativeLineageCommand` (line 2258) and `buildOpencodeLineageCommand` (line 2324). Both change.
- Dispatch seam: the table entry at line 2923 and `isOpencodeBinaryAvailable` at line 2961. Both change.
- Identity: `resolveExecutableVersion` at line 2093. It does not change.
- Consumers: the planning-time grep found that only `fanout-run.cjs` names the builders. Run the grep again in T003 before the edit.

Adversarial table for the parser and the availability check:

| Case class | Input | Expected |
|------------|-------|----------|
| Delimiter | `1.19.3\r\n` and a trailing space | v1 |
| Joined input | `1.19.3 2.0.32` on one line | v1, the first version token wins |
| Outside root | `$OPENCODE_BIN` naming a path that does not exist | refuse. No fallback to the next name. |
| No-op | empty output | refuse |
| Fallback | the probe throws or times out | refuse |
| Name fallback | a binary named `opencode2` whose output does not parse | refuse, because D3 forbids a name-based version |
| Hostile env | `$OPENCODE_BIN` set to `/tmp/a b/$(id)` | spawned as one argv entry. No shell runs it. |
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification checkboxes and their state.

### 4.1 Ordered steps

1. **Baseline (Orchestrator).** Run the deep-loop runtime suite and save its output. This suite is not covered by 001. Rollback: none, because this step only reads.
2. **Backup (Orchestrator).** Copy `fanout-run.cjs` and `SKILL.md` to `scratch/backup/`. Rollback: none, because this step creates the backup.
3. **Line check and live probes (Orchestrator).** Confirm the four sites and the three v1-only lines. Run the probes for Q3 (the working directory), Q2 (a bare slash message) and the child environment, inside `scratch/probes/`. Record the process list before and after. Rollback: delete `scratch/probes/`.
4. **Decisions (Orchestrator).** Settle Q1 to Q5 from step 3, and amend spec.md or plan.md where a probe changed the design. Rollback: restore the amended document from its last copy.
5. **Red tests (Luna).** Write the renderer, parser and availability cases for rows P1 to P5, A1 to A3 and D1 to D4, and the adversarial table. Rollback: delete the new test file.
6. **Red run (Orchestrator).** Run the new suite and record the first failing assertion for each case. Rollback: none, because this step only reads.
7. **Resolver (Luna).** Create `opencode-version.cjs`. Rollback: delete the new file.
8. **Renderers and seam (Luna).** Add the v1 and v2 renderers, route the table entry and the availability check, and leave the native v2 branch failing closed. Rollback: restore `fanout-run.cjs` from `scratch/backup/`.
9. **Docs (DeepSeek).** Edit `SKILL.md` line 134 and the lines Q4 names, in the sk-doc skill mode. Rollback: restore `SKILL.md` from `scratch/backup/`.
10. **Doc review (Luna).** Review the step 9 diff for facts against research section 6. Make no edits. Rollback: none.
11. **Green run (Orchestrator).** Rerun the new suite and the full deep-loop suite. Compare with step 1. Rollback: none.
12. **Smoke dispatches (Orchestrator).** Run one smoke dispatch on 1.19.3 and one on 2.0.32 through the builder. Record the exit status, the token and the lineage file. Rollback: delete the lineage output under `scratch/`.
13. **Child environment (Orchestrator).** Run a v2 child with a fixture plugin that logs its environment. Confirm `AI_SESSION_CHILD=1` in the log. Rollback: delete `scratch/probes/`.
14. **Code review (DeepSeek).** Review `fanout-run.cjs` and the resolver against `sk-code/sk-code-opencode`, findings first. Make no edits. Rollback: none.
15. **Fixes (Luna).** Fix each P0 and P1 finding that the orchestrator confirms. Copy each file to `scratch/backup/fix-<n>/` first. Rollback: restore from that copy.
16. **Final state (Orchestrator).** Check that no `--command`, `--dir` or `--variant` sits in the v2 renderer. Check `git status` for the scoped files. Delete `scratch/backup/` and `scratch/probes/` after the final green run. Rollback: none.

### 4.2 Dispatch plan

- **Luna, GPT-6 Luna max fast through cli-codex.** Steps 5, 7, 8 and 15. Code only, inside the files in spec.md section 3.
- **DeepSeek, DeepSeek V4.1 Flash max through cli-devin.** Steps 9 and 14. Docs and review.
- **Orchestrator.** Steps 1 to 4, 6, 11, 12, 13 and 16, plus every test run. The codex write sandbox blocks local sockets. The smoke dispatches need the provider credentials, and the Pi guard blocks a nested `opencode run`.
- **Cross-family rule.** DeepSeek reviews Luna's code (step 14). Luna reviews DeepSeek's doc edit (step 10).

### 4.3 Live probe rules

- Probes use `run --standalone` in a scratch project. They never touch the shared v2 service (D4).
- The orchestrator reads the process list before and after each probe, with a read-only command, and records both.
- A probe that starts a shared service stops the phase, and the operator is told.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Red-first unit | Rows P1 to P5, A1 to A3, D1 to D4, the adversarial table and the cache count | `npx vitest run --no-coverage tests/unit/opencode-dual-dispatch.vitest.ts` |
| Regression | The full deep-loop runtime suite, compared with the baseline | `npx vitest run --no-coverage` in the runtime folder |
| Live smoke | One dispatch per version through the builder | The orchestrator, with the repo's default provider |
| Live child environment | A v2 child with a fixture plugin | The orchestrator, `run --standalone` in a scratch project |
| Static | The grep checks in tasks.md CHK-004 and CHK-005 | `rg` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 005 classifier admits `opencode2` | Internal | Green once 005 closes | The guard still lints a v2 run with v1 rules |
| Provider credentials for the default model | External | Unknown until T004 | The smoke checks report BLOCKED |
| v2 `run --standalone` behaviour | External | Unproven for cwd and the native command | Q2 and Q3 keep the branch closed |
| Research section 6 and iteration-013 | Internal | Green. Read. | Wrong flag rules |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a deep-loop suite count falls below the baseline, a v1 argv changes, or a smoke dispatch fails on either version.
- **Procedure**: restore `fanout-run.cjs` and `SKILL.md` from `scratch/backup/`, or from the per-fix copy. Delete `opencode-version.cjs` and the new test file. Rerun the suite and compare with the baseline. Do not use `git checkout` on these files, because the worktree holds other uncommitted work.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Step 1 (Baseline) ─┐
Step 2 (Backup) ───┼──► Step 3 (Probes) ──► Step 4 (Decisions) ──► Step 5 (Red tests) ──► Step 6 (Red run)
                   │                                                                       │
                   │                              Step 7 (Resolver) ◄──────────────────────┘
                   │                                      │
                   │                              Step 8 (Renderers) ──► Step 11 (Green run) ──► Step 12 (Smoke) ──► Step 13 (Child env)
                   │                                      │
                   └──────────────────────────────► Step 9 (Docs) ──► Step 10 (Doc review)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Probes and decisions | Baseline and backup | Red tests |
| Resolver and renderers | Red run | Green run |
| Smoke and child environment | Green run | Review |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup, probes and decisions (steps 1 to 4) | Medium | Orchestrator pass with live probes |
| Core implementation (steps 5 to 9) | Medium | About four Luna dispatches and one DeepSeek dispatch |
| Verification (steps 10 to 16) | High | Two live smoke dispatches, one child check, two reviews, one fix dispatch |
| **Total** | | **About nine dispatches and three orchestrator probe passes** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Backups exist under `scratch/backup/` for `fanout-run.cjs` and `SKILL.md` (step 2).
- [ ] The deep-loop baseline is saved (step 1).
- [ ] The live probe output and the process lists are saved under `scratch/probes/` (step 3).
- [ ] No feature flag exists. The rollback is the restore in section 7.

### Rollback Procedure
1. Restore `fanout-run.cjs` and `SKILL.md` from `scratch/backup/`, or from the per-fix copy.
2. Delete `opencode-version.cjs` and the new test file.
3. Rerun the deep-loop suite and compare with the baseline.
4. Report the failing check and its output to the operator.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: Not applicable. The dispatch stores no data of its own.
<!-- /ANCHOR:enhanced-rollback -->

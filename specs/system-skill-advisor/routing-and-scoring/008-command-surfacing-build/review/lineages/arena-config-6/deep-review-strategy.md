# Deep Review Strategy - arena-config pass six

## 1. REVIEW CHARTER

- Target: `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build` (spec-folder review, pass six).
- Lineage area: `arena-config` — the three paths `review/review-scope-6.txt` assigns to this label: `prepare-behaviour-arena.mjs`, `command-behaviour-guards.vitest.ts` and `vitest.config.ts`.
- Diff under review: `git -c core.fsmonitor=false diff ddb12a6852c 85550ee946e -- <path>`; 62 insertions, 1 deletion across the three files.
- Dimensions: correctness, security, traceability, maintainability.
- Operator focus: the text bound as `reviewFocus` in `deep-review-config.json`, reproduced in every iteration.
- Stop conditions: legal convergence per `convergence.cjs`, or `maxIterations=3`.
- Success criteria: every changed line read against its claim, each finding carrying file:line and a concrete input, holdout hygiene preserved, no code changed.

## 2. TOPIC

Two changed behaviours. `vitest.config.ts` makes one temp folder per suite run and points `TMPDIR` at it, so the advisor's durable health records (`lib/metrics.ts` `DURABLE_METRICS_ROOT`) stop landing in the operator's shared metrics folder. `prepare-behaviour-arena.mjs` raises the git helper's `maxBuffer` to 512 MiB so a whole-repository listing no longer aborts the arena build with `spawn_failed`, and `command-behaviour-guards.vitest.ts` gains the 6,000-file regression case that proves it.

<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
[All dimensions complete]

<!-- /ANCHOR:review-dimensions -->

## 4. NON-GOALS

- Not re-reporting the recorded limits named by `review/review-brief-6.txt` without a new input that breaks them.
- Not reviewing the scorer, merge-docs or other areas' files except as evidence for a claim about these three.
- Not running the vitest suites, the arena builder or any repo tooling that writes outside the lineage folder; the buffer behaviour is reproduced with `spawnSync` directly instead.
- Not opening `.skilled/hooks/hook-flags.env`, and not reading any prompt corpus except through `jq 'del(.prompt)'`.

## 5. STOP CONDITIONS

- Legal convergence from `convergence.cjs` with every quality gate passing.
- `maxIterationsReached` after iteration 3, with synthesis stating partial coverage honestly.

<!-- ANCHOR:completed-dimensions -->
## 4. COMPLETED DIMENSIONS
- [x] correctness
- [x] security
- [x] traceability
- [x] maintainability

<!-- /ANCHOR:completed-dimensions -->
<!-- ANCHOR:running-findings -->
## 5. RUNNING FINDINGS
- P0 (Blockers): 0
- P1 (Required): 0
- P2 (Suggestions): 5
- Resolved: 0

<!-- /ANCHOR:running-findings -->
## 8. WHAT WORKED

- [Direct reproduction of the buffer premise]: spawning `git ls-files -z` with and without `maxBuffer` on a 6,000-file fixture reproduced `{status:null,error:"ENOBUFS"}` and `{status:0, stdoutBytes:1116018}` in one step, which settles the fix's premise without running the suite (iteration 1).
- [Claim-to-constant reading]: reading `lib/metrics.ts:185` beside the config block proved the lever reaches the durable root and that `tmpdir()` is the only switch (iteration 1).
- [Signal-exit probe]: a four-line Node script with an `exit` listener, killed with `SIGTERM`, wrote no marker while the same script ending through `process.exit(0)` did, which settled the cleanup claim without touching the runner (iteration 1).
- [Task-row evidence audit]: reading T053 and T043 beside the code showed the fix's recorded first-run failure and its final `ok:true` build, which closes the traceability question without a live run (iteration 2).
- [Entry-point enumeration]: listing every `vitest*.config.ts` under the runtime and every workflow that runs one exposed the single suite path the isolation never reaches (iteration 2).
- [Assertion-set read]: reading the new test's two assertions against its name showed the premise is implicit, which is a cheaper way to find a weak regression test than running it (iteration 3).
- [Failure-code inventory]: counting `result.error` reads showed the `spawn_failed` confusion is one site, so the fix is one branch rather than a class audit (iteration 3).

## 9. WHAT FAILED

- [Assuming one cleanup path is enough]: the config's comment reads as "the run removes it on exit", but the listener covers one of several ways a run ends; the gap cost the rest of the pass a second reading of Node's exit contract (iteration 1).
- [Assuming the suite has one config]: the first pass reasoned about `vitest.config.ts` alone; the stress workflow runs `vitest.stress.config.ts`, which cost a second pass to find (iteration 2).
- [Treating the summary sentence as the spec]: `implementation-summary.md:64` is broader than the spec it summarises, and only reading the spec's own scope list showed that the sentence, not the task, is what overstates (iteration 2).
- [Reading the test name as the assertion]: the new test's name states the premise, and only the body shows it is never measured (iteration 3).

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### A dotenv leak reintroduced through the larger read: the cap bounds bytes printed by git; the copy filter is a separate walk and is unchanged. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: A dotenv leak reintroduced through the larger read: the cap bounds bytes printed by git; the copy filter is a separate walk and is unchanged.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A dotenv leak reintroduced through the larger read: the cap bounds bytes printed by git; the copy filter is a separate walk and is unchanged.

### A fixture that is flaky in size: the name length and the count are both literals, and the byte size is reproducible. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: A fixture that is flaky in size: the name length and the count are both literals, and the byte size is reproducible.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A fixture that is flaky in size: the name length and the count are both literals, and the byte size is reproducible.

### A listing truncated by the default buffer reaching a caller as a complete list: `git()` throws before returning. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: A listing truncated by the default buffer reaching a caller as a complete list: `git()` throws before returning.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A listing truncated by the default buffer reaching a caller as a complete list: `git()` throws before returning.

### A per-run folder that deletes a developer's real health records: `RUN_TMPDIR` is a fresh `mkdtempSync` directory, and `rmSync` is scoped to it. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: A per-run folder that deletes a developer's real health records: `RUN_TMPDIR` is a fresh `mkdtempSync` directory, and `rmSync` is scoped to it.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A per-run folder that deletes a developer's real health records: `RUN_TMPDIR` is a fresh `mkdtempSync` directory, and `rmSync` is scoped to it.

### A private-mode regression from moving the health records: `mkdtempSync` creates `0700`, and the writers still set `0700`/`0600` on what they create. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: A private-mode regression from moving the health records: `mkdtempSync` creates `0700`, and the writers still set `0700`/`0600` on what they create.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A private-mode regression from moving the health records: `mkdtempSync` creates `0700`, and the writers still set `0700`/`0600` on what they create.

### A second advisor suite entry point beyond the two configs: `git ls-files | grep -E 'vitest.*config'` finds no third config under the advisor runtime. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: A second advisor suite entry point beyond the two configs: `git ls-files | grep -E 'vitest.*config'` finds no third config under the advisor runtime.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A second advisor suite entry point beyond the two configs: `git ls-files | grep -E 'vitest.*config'` finds no third config under the advisor runtime.

### A spec-to-code mismatch in phase 032's listing fix: the task names `maxBuffer: 512 * 1024 * 1024`, the builder carries it, and the fixture size is reproducible. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: A spec-to-code mismatch in phase 032's listing fix: the task names `maxBuffer: 512 * 1024 * 1024`, the builder carries it, and the fixture size is reproducible.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A spec-to-code mismatch in phase 032's listing fix: the task names `maxBuffer: 512 * 1024 * 1024`, the builder carries it, and the fixture size is reproducible.

### A spec-to-code mismatch in phase 035: the spec, the task row, the acceptance rows and the code all name one file and one mechanism. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: A spec-to-code mismatch in phase 035: the spec, the task row, the acceptance rows and the code all name one file and one mechanism.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A spec-to-code mismatch in phase 035: the spec, the task row, the acceptance rows and the code all name one file and one mechanism.

### A stale acceptance count that hides a missing run: the `51 passed` figure in AC-002 is a snapshot from T007, and T053 records the later run at 52 passed, which is one test more rather than a different suite. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: A stale acceptance count that hides a missing run: the `51 passed` figure in AC-002 is a snapshot from T007, and T053 records the later run at 52 passed, which is one test more rather than a different suite.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A stale acceptance count that hides a missing run: the `51 passed` figure in AC-002 is a snapshot from T007, and T053 records the later run at 52 passed, which is one test more rather than a different suite.

### A temp-folder relocation that breaks `git`, `cp` or a spawned advisor process: none of them resolves a path through `TMPDIR` in a way the config changes, and the tests that do (`metrics-file-permissions.vitest.ts:33-50`) set and restore it themselves. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: A temp-folder relocation that breaks `git`, `cp` or a spawned advisor process: none of them resolves a path through `TMPDIR` in a way the config changes, and the tests that do (`metrics-file-permissions.vitest.ts:33-50`) set and restore it themselves.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A temp-folder relocation that breaks `git`, `cp` or a spawned advisor process: none of them resolves a path through `TMPDIR` in a way the config changes, and the tests that do (`metrics-file-permissions.vitest.ts:33-50`) set and restore it themselves.

### An `ENOBUFS` confusion on the copy path: `runCp` maps its own failures to `copy_failed`. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: An `ENOBUFS` confusion on the copy path: `runCp` maps its own failures to `copy_failed`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: An `ENOBUFS` confusion on the copy path: `runCp` maps its own failures to `copy_failed`.

### An overflow that silently becomes an empty copy plan: `copyPlan` does not use git; it walks the filesystem, and `isIgnored` asks `git check-ignore -q`, whose status is read directly. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: An overflow that silently becomes an empty copy plan: `copyPlan` does not use git; it walks the filesystem, and `isIgnored` asks `git check-ignore -q`, whose status is read directly.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: An overflow that silently becomes an empty copy plan: `copyPlan` does not use git; it walks the filesystem, and `isIgnored` asks `git check-ignore -q`, whose status is read directly.

<!-- /ANCHOR:exhausted-approaches -->
## 10A. SATURATED / SWEPT DIMENSIONS AND EXPANSION FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

## 11. RULED OUT DIRECTIONS

- [Truncated git output read as complete]: `git()` raises `StepFailure` on `result.error`, so a buffer overflow can never reach `staleBuilds` or `trackedDotenvFiles` as a short list (iteration 1).
- [A buffer cap that changes copy or symlink safety]: the cap bounds the bytes git prints; `copyPath`, `escapingLinks` and `stampBuildTree` are untouched by the diff (iteration 1).
- [A per-run temp folder that breaks socket paths]: `launcher-ipc-bridge.cjs` relocates a socket dir above the 104-byte `sun_path` limit, and the advisor's default socket dir is `/tmp/system-skill-advisor`, not `tmpdir()` (iteration 1).
- [A duplicate write into the shared metrics folder from the default suite]: `advisorHookOutcomesPath` resolves under `DURABLE_METRICS_ROOT`, which is computed from `tmpdir()` at import, and the config sets `TMPDIR` before any worker starts (iteration 2).
- [An arena fix closed without an arena build]: T053's verify clause accepts a non-`spawn_failed` refusal, but T043 records the `ok:true` build at `0173020dfc2` with 22 copied trees, so the fix is proven (iteration 2).
- [A private-mode regression in the per-run health folder]: `mkdtempSync` creates the folder mode `0700` (observed), and the writer still applies `0700`/`0600` inside it (iteration 3).
- [A dotenv leak through the larger git read]: the cap bounds bytes printed; the copy filter is a separate walk the diff does not modify (iteration 3).

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
- Dimension: none remaining. - Focus area: synthesis only. - Reason: `maxIterations=3` is reached with correctness, traceability, maintainability and a security read of the changed boundaries covered; no active P0 or P1. - Rotation status: complete. - Blocked/productive carry-forward: productive — the packet's own blocked-run note supplied the concrete input for the failure-code advisory. - Required evidence: the terminal convergence decision, the finding registry, and the synthesis report. - Recovery note: none; no failed iteration. Review verdict: PASS

<!-- /ANCHOR:next-focus -->
## 13. KNOWN CONTEXT

### Bounded Context Snapshot

- Target pointers: `.skilled/skills/system-skill-advisor/runtime/vitest.config.ts:5-18`, `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/prepare-behaviour-arena.mjs:142-152`, `.skilled/skills/system-skill-advisor/runtime/tests/command-behaviour-guards.vitest.ts:753-789`.
- Behaviour claims: a suite run leaves the shared metrics folder untouched (`035-suite-metrics-and-start-shape/spec.md` REQ-001, AC-001, AC-005); the arena builder can read a whole-repository listing (`032-review-pass-five-remediation/tasks.md` T053); the arena build succeeds on the committed tree (T043).
- Reuse and conventions: `lib/metrics.ts:185` `DURABLE_METRICS_ROOT`, `os.tmpdir()` reading `TMPDIR` on POSIX; `spawnSync` `maxBuffer` default; the `git()`/`gitText()` failure shape.
- Review risks and gaps: no suite run and no arena build in this lineage, because both write outside the lineage folder; the buffer premise is reproduced with a direct `spawnSync` probe instead.

## 14. CROSS-REFERENCE STATUS

| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | pass | 2 | Phase 035's REQ-001 and AC-001 and phase 032's T053 read against the changed lines; both name the mechanism the code carries. |
| `checklist_evidence` | core | pass | 2 | 035's T002, AC-001 and AC-005 record observed evidence; 032's T053 records the failing first run and T043 the `ok:true` build. |
| `skill_agent` | overlay | notApplicable | 1 | The skill entry files are not part of this area's diff. |
| `agent_cross_runtime` | overlay | notApplicable | 1 | No agent definition is in scope for this area. |
| `feature_catalog_code` | overlay | notApplicable | 1 | No feature-catalog leaf names these two behaviours. |
| `playbook_capability` | overlay | notApplicable | 2 | The playbook inspects the metrics folder after a manual hook run, which no suite config changes. |

## 15. FILES UNDER REVIEW

| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|-------------------|----------------|----------|--------|
| `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/prepare-behaviour-arena.mjs` | D1, D4 | 3 | 1 P2 | complete |
| `.skilled/skills/system-skill-advisor/runtime/tests/command-behaviour-guards.vitest.ts` | D1, D4 | 3 | 1 P2 | complete |
| `.skilled/skills/system-skill-advisor/runtime/vitest.config.ts` | D1, D2, D3 | 2 | 2 P2 | complete |

## 16. REVIEW BOUNDARIES

- Max iterations: 3
- Convergence threshold: 0.1
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=fanout-arena-config-6-1794815529929-dybl7p, parentSessionId=null, generation=1, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: 60 tool calls, 10 minutes
- Severity threshold: P2
- Review target type: spec-folder
- Cross-reference checks: core=[spec_code, checklist_evidence], overlay=[skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability]
- Started: 2026-11-16T08:08:13.000Z

---
title: "Implementation Plan: Phase 28: direct-call-off-switch"
description: "Moves the advisor switch list and the disabled envelope into one shared module the handler and the CLI client both call, makes the client call it before any socket, launcher or local scorer, tests it against a fake warm daemon and with no daemon, corrects three documents, then proves the fix with a call matrix in both orders from a fresh socket folder and the warm default one."
trigger_phrases:
  - "direct call off switch plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 28: direct-call-off-switch

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY
<!-- FILL: Fill the stack row and write three sentences: what changes, where, and how you will prove it. GOOD: Change one bash script. Add one `--keep <n>` option. Prove it with an archive count. WEAK: This plan describes the implementation. -->

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript ES modules on Node, compiled to the runtime's `dist`, and Markdown |
| **Framework** | The skill advisor runtime: its CLI client, its recommend handler and its compat contract |
| **Storage** | None changed. The reproduction reads the workspace daemon's lease file and writes text under this phase's `scratch/` |
| **Testing** | Vitest in one new file and two existing files, the handler's existing disabled cases, and the two planning probes in `scratch/planning/` |

### Overview
`ADV/lib/advisor-disabled.ts` takes the switch list, the lookup and the disabled envelope out of the handler, and both the handler and the CLI client call its `disabledRecommendOutput`. The client calls it first in `invokeAdvisorRecommendPayload`, so a flagged request returns the abstain envelope before it probes a socket, spawns a launcher or runs the local scorer. The proof is a client case that fails before the fix with one call to a fake warm daemon and an `sk-code` row, a no-daemon case that fails on a launcher lease or a local-scorer row, and the nine-call matrix printing the abstain reason on every flagged line while every unflagged line keeps its before rows.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES
<!-- FILL: Turn each gate into a check a command can answer. Keep the boxes unticked until they pass. GOOD: `ls scripts/rotate-logs.sh` prints the path and `ls logs/archive | wc -l` prints 10 before the task starts. WEAK: The team agrees the plan is ready. -->

### Definition of Ready
- [ ] Phase 027 reads `Complete` and `git status` prints nothing for this phase's nine files (T001)
- [ ] `scratch/floor-before.txt`, `scratch/eval-before.txt` and the suite lines of `scratch/before.txt` are recorded (T001)
- [ ] `scratch/repro-before.txt` matches the Measured Behavior block and `scratch/timing-before.txt` holds five warm call times (T002)

### Definition of Done
- [ ] All acceptance criteria met
- [ ] `BUILD` and `TC` exit 0, `VALL` reports 0 failed, `DT` and `VP` report `fail 0` (T010)
- [ ] The floor and eval after files equal their before files (T011)
- [ ] `scratch/repro-after.txt` prints `disabledCount=1` on all five `off` lines and the before rows on all four `on` lines (T012)
- [ ] The fix is committed and the Opus review reports no open P0 or P1 (T014, T015)
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
<!-- FILL: Name the pattern in three words, then list the one component that changes. Name what fails today without each component you add, or drop it. GOOD: Single script branch. The component is `scripts/rotate-logs.sh`. WEAK: Standard architecture. -->

### Pattern
Decide at the caller.

### Key Components
- **`ADV/lib/advisor-disabled.ts`**: without it the client must import the handler, whose runtime closure is 64 files with `better-sqlite3`, or copy the list. It exports `ADVISOR_DISABLED_FLAGS`, `advisorDisabledBy(env)`, `requestWorkspaceRoot(workspaceRoot)`, `emptyOutput(args)` and `disabledRecommendOutput(input, env)`. It imports only the schema module, `lib/compat/contract.ts` and `lib/utils/workspace-root.ts`.
- **One call in `invokeAdvisorRecommendPayload`**: without it the client sends a flagged request to a daemon that never saw the switch, or to the local scorer, which reads none. It is the first statement, so the warm path, the cold start and the fallback all sit behind it.
- **The handler's call**: `handleAdvisorRecommend` replaces its own lookup and envelope with `disabledRecommendOutput(input) ?? await computeRecommendationOutput(input)`, so a daemon started from a flagged environment still abstains for its MCP and CLI callers, from the same function.

No new option, layer or dependency.

### Data Flow
A model or a user runs `node .skilled/bin/skill-advisor.cjs advisor_recommend`. The shim runs the compiled client in the caller's environment. The client validates the arguments against its manifest, then `invokeAdvisorRecommendPayload` calls `disabledRecommendOutput(args)`. When `advisorDisabledBy()` finds a switch name set to `1`, the function returns the envelope with the resolved workspace root and thresholds, and the client prints `{ status: 'ok', data }` and exits 0 with no socket, launcher or scorer touched. Otherwise it returns `null` and the request goes to the daemon as before, whose handler runs the same function against the daemon's own environment.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES
<!-- FILL: Name each surface the change touches. Write `not a consumer` when it does not read the change. Write `N/A` or delete the whole addendum when no fix surface applies. GOOD: `scripts/rotate-logs.sh`: owns the deletion. Action: update. WEAK: Various files. -->

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

No review Planning Packet applies. The defect came from phase 026's switch probe, and every row below was read in the code or run by this planner.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `ADV/handlers/advisor-recommend.ts` `handleAdvisorRecommend` (`:716`) | Daemon-side switch check, reads the daemon's `process.env` | update to call the module (T004) | The two disabled cases of `tests/handlers/advisor-recommend.vitest.ts` (`:380`, `:392`) pass before and after |
| `ADV/handlers/advisor-recommend.ts` `absentOutput` (`:184`), `unavailableOutput` (`:199`), `computeRecommendationOutput` (`:585-587`) | Other users of `emptyOutput` and the workspace helpers | updated imports only, same output | `VX tests/handlers/advisor-recommend.vitest.ts` and `VALL` |
| `ADV/skill-advisor-cli.ts` `invokeAdvisorRecommendPayload` (`:1531`) | Client entry for `advisor_recommend`, with the warm call and the local-scorer fallback | update (T005) | The disable-switch cases in `CLT` and the matrix |
| `ADV/skill-advisor-cli.ts` `runLocalScorer`, `spawnLauncher`, `ensureDaemonReady` | The fallback and the cold start the switch must not reach | unchanged, now behind the early call | The no-daemon case and NFR-P01 |
| `ADV/tools/index.ts:58` | MCP dispatch to the handler | not a consumer, same handler signature | `VALL` |
| `ADV/lib/compat/daemon-probe.ts:47` | Compat probe for the Python shim, reads `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED` only | unchanged, it serves the compat contract's own `disabledEnv` name and is not on the direct-call path | Read at planning |
| `.skilled/bin/system-skill-advisor-launcher.cjs:159-160` | Forwards both names to a daemon it starts | unchanged, residual A6 | P053 |
| `.opencode/plugins/system-skill-advisor.js` | Spawns the shim per prompt | not a consumer under the switch, it returns before the spawn (`:206`) | `VP` |
| `ADV/scripts/routing-accuracy/command-offer.mjs` `replayOffer`, `warmCheckout` | Phase 026's offer replay runs the hook with the runner's own environment, and the warm call runs `advisor_status` | not a consumer, neither sends `advisor_recommend` under the switch | Read at planning (`command-offer.mjs:99-130`, `:368-380`) |
| `ADV/tests/skill-advisor-cli-test-utils.ts:77` | The isolated scope deletes only the `SPECKIT_` name | update (T006) | `SYSTEM_SKILL_ADVISOR_HOOK_DISABLED=1 VX tests/skill-advisor-cli-dual-client.vitest.ts` fails after T005 and passes after T006 |
| `SAD/hooks/skill-advisor-hook.md` §6 | Says the `_HOOK_DISABLED` names disable the native adapters | update (T007) | `rg` for the new sentences |
| `SAD/manual-testing-playbook/compat-and-disable/global-disable-flag.md` step 1 | Relies on a cold sandbox daemon inheriting the switch, which can no longer catch the warm-daemon defect | update (T008) | `rg` for the new step and for the removed sandbox lines |
| `SAD/feature-catalog/cli-surface/advisor-recommend.md` §2 and §3 | Describes the handler's disabled envelope only | update (T009) | `rg` for the new sentence and rows |

Doc lines about the switch left unchanged, each true after the fix: `SAD/INSTALL-GUIDE.md:174` and `:180` (the CLI skips advisor work), root `README.md:779` (disable it everywhere), `SAD/feature-catalog/hooks-and-plugin/claude-hook.md:24` and `opencode-plugin-bridge.md:24` (adapter opt-outs), `SAD/feature-catalog/python-compat/cli-shim.md:30` (the Python shim), `SAD/manual-testing-playbook/native-cli-tools/native-recommend-happy-path.md:83` (the disabled envelope as a symptom), `SAD/hooks/skill-advisor-hook-validation.md:299` (the hook process reads the switch), `.skilled/skills/system-spec-kit/runtime/hooks/claude/README.md:66`, `.skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md:75`, `.skilled/hooks/README.md:44` and `SAD/references/decisions/deferred-decisions.md:81` (hook switches). The advisor `SAD/README.md` holds no sentence about the switch: `rg -n -i "kill.?switch|disable|HOOK_DISABLED" SAD/README.md` printed nothing.

Required inventories:
- Same-class producers: `rg -n "HOOK_DISABLED" ADV --glob '*.ts' --glob '!**/dist/**' --glob '!tests/**'` lists the handler's list (`:164-167`) and the compat probe (`:47`) before the fix, and the module and the compat probe after it.
- Consumers of changed symbols: `rg -n "ADVISOR_DISABLED_FLAGS|advisorDisabledBy|disabledRecommendOutput|requestWorkspaceRoot|emptyOutput\(|disabledOutput\(" ADV --glob '*.ts' --glob '!**/dist/**'`.
- Matrix axes: the switch (none, `SYSTEM_` name, `SPECKIT_` name, both, `true`, `SYSTEM_SKILL_ADVISOR_DISABLED`) by the backend (warm daemon that answers, no daemon) by the call order (flagged first, unflagged first) by the socket folder (default, fresh) by the argument form (inline `--json`, stdin `--json -`).
- Algorithm invariant: the client returns the abstain envelope exactly when `advisorDisabledBy(process.env)` names a switch, and then performs no socket probe, no spawn and no scorer run. Adversarial cases: a warm daemon that answers whatever the switch says, a fresh socket folder whose launcher bridges away, a value of `true`, both names at once and an unflagged call right after a flagged one.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES
<!-- FILL: Point to `tasks.md` and name the three phases in one line. GOOD: Setup reads `scripts/rotate-logs.sh` and counts the archives. Implementation adds `--keep <n>` to `scripts/rotate-logs.sh`. Verification runs `scripts/rotate-logs.sh --keep 3` and checks that ten archives become three. WEAK: See tasks. -->

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state. Setup checks the gate and records the floors, the suites, the reproduction and the warm call times before any edit. Implementation runs lane M (the module, then the handler), lane C (the client, then the test scope) and lane D (three documents after the client), each task test first where it changes behaviour. Verification builds, runs every suite, compares the floors, reruns the reproduction and the closure probe, checks the boundaries, commits the fix, gets one Opus review and closes the phase.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
<!-- FILL: Name the one command you will run and the output it must print. GOOD: `ls logs/archive | wc -l` prints 3 after `--keep 3` and 10 after a plain run. WEAK: Test it manually. -->

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | `advisorDisabledBy`, `disabledRecommendOutput` and the handler's two disabled cases | Vitest, `tests/advisor-disabled.vitest.ts` and `tests/handlers/advisor-recommend.vitest.ts` |
| Integration | `runSkillAdvisorCli` in process against a fake warm daemon, flagged and unflagged, and with no daemon in an isolated database scope, plus the floors, the eval and the full suite | Vitest in `tests/skill-advisor-cli-stale-daemon-retry.vitest.ts`, the committed captures and `jq` |
| Manual | `zsh $PH/scratch/planning/direct-call-matrix.sh` prints the abstain reason on every `off` line, and `import-closure.mjs` prints no native package for the client | The two planning probes |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
<!-- FILL: List each tool the change needs, or write `None`. GOOD: `bash` and `awk`. No new package. WEAK: Usual dependencies. -->

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 027 closed and committed | Internal | Complete | T001 stops the phase |
| Phase 026's lanes on disjoint files | Internal | In flight at planning, harness built and uncommitted | `VALL` waits until no 026 worker session is open (T010), and the commit stages by path (T014) |
| The warm workspace daemon | Internal | Live at planning, lease pid 49475 | The warm lines of the matrix test a cold start, and the coordinator warms it and reruns |
| `jq`, `rg`, `zsh` and the compiled `dist` | Tool | Present | The reproduction cannot run. `BUILD` comes before every probe run after an edit, because the shim refuses a stale build |
| DeepSeek v4.1 flash max on OpenCode Go and an Opus verifier per task, one Opus reviewer for the diff | External | Named in the dispatch | A lane waits for its worker |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
<!-- FILL: Name the trigger and the one command that reverts the change. GOOD: Trigger: `--keep 3` removes an archive newer than the three kept. Revert the one commit. WEAK: Roll back if needed. -->

- **Trigger**: An unflagged call stops recommending, a floor or eval line moves, the handler's disabled cases change, or the client's closure gains a native package.
- **Procedure**: Before the fix commit, discard the lane's working changes to the files it owns, which no other lane and no phase 026 lane touches. After it, revert the fix commit as a whole. The rebuilt `dist` follows the source on the next `BUILD`.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES
<!-- FILL: Draw the phase order in the fence, then fill the table with depends-on and blocks. Write `N/A` with one reason, or delete the whole section. GOOD: Setup to Implementation to Verification. Verification blocks close. WEAK: Phases depend on each other. -->

```
Setup (T001, T002) ──► lane M (T003, T004) and lane C (T005 after T003, then T006) ──► lane D (T007 to T009 after T005)
──► Verification: suites, floors, reproduction, boundaries ──► fix commit ──► Opus review ──► close ──► phase 026 T032 rerun
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Phase 027 committed | Implementation |
| Implementation | Setup. T005 needs the module of T003 | Verification |
| Verification | Every lane ended and no phase 026 worker session open for `VALL` | Close, then phase 026 T032 |
<!-- /ANCHOR:phase-deps -->

---

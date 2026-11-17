---
title: "Implementation Plan: Phase 29: direct-call-kill-switch"
description: "Makes the shared switch module decide through hookFlagDecision from the hooks' own resolver instead of its two-name list, keeps the daemon on its own environment, tests the module, the handler and the CLI client test first, corrects three documents, then proves the fix with a fourteen-line matrix that prints the hook decision beside the direct call's answer."
trigger_phrases:
  - "direct call kill switch plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 29: direct-call-kill-switch

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY
<!-- FILL: Fill the stack row and write three sentences: what changes, where, and how you will prove it. GOOD: Change one bash script. Add one `--keep <n>` option. Prove it with an archive count. WEAK: This plan describes the implementation. -->

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript ES modules on Node, compiled to the runtime's `dist`, one CommonJS resolver loaded with `createRequire`, and Markdown |
| **Framework** | The skill advisor runtime (its switch module, its recommend handler and its CLI tests) and the hooks' shared kill-switch resolver |
| **Storage** | None changed. The reproduction reads the workspace daemon's lease file and one committed fixture, and writes text under this phase's `scratch/` |
| **Testing** | Vitest in four existing files, the resolver's own `node --test` suite as a guard, and the planning probe in `scratch/planning/` |

### Overview
`ADV/lib/advisor-disabled.ts` stops matching two names against `'1'` and asks `hookFlagDecision('skill-advisor', env, config)` from `.skilled/hooks/shared/hook-flags.cjs`, the resolver every prompt hook asks, with the caller's environment over the flags file. The CLI client already calls the module first, so it needs no edit, and the handler passes an empty file config so a shared daemon decides from its own environment only. The proof is a module case, a handler case and five CLI cases that fail before the fix, and the fourteen-line matrix printing `match=yes` on every line where it prints `match=no` on eight today.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES
<!-- FILL: Turn each gate into a check a command can answer. Keep the boxes unticked until they pass. GOOD: `ls scripts/rotate-logs.sh` prints the path and `ls logs/archive | wc -l` prints 10 before the task starts. WEAK: The team agrees the plan is ready. -->

### Definition of Ready
- [ ] Phase 028 reads `Complete` and `git status` prints nothing for this phase's nine files (T001)
- [ ] `scratch/floor-before.txt`, `scratch/eval-before.txt` and the suite lines of `scratch/before.txt` are recorded (T001)
- [ ] `scratch/repro-before.txt` matches the Measured Behavior block and `scratch/timing-before.txt` holds five warm call times (T002)

### Definition of Done
- [ ] All acceptance criteria met
- [ ] `BUILD` and `TC` exit 0, `VALL` reports 0 failed, `DT`, `VP` and `HFT` report `fail 0` (T010)
- [ ] The floor and eval after files equal their before files (T011)
- [ ] `scratch/repro-after.txt` prints `match=yes` on all fourteen lines and the lease lines are equal (T012)
- [ ] The fix is committed and the Opus review reports no open P0 or P1 (T014, T015)
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
<!-- FILL: Name the pattern in three words, then list the one component that changes. Name what fails today without each component you add, or drop it. GOOD: Single script branch. The component is `scripts/rotate-logs.sh`. WEAK: Standard architecture. -->

### Pattern
Reuse the resolver.

### Key Components
- **`ADV/lib/advisor-disabled.ts`**: the one component that changes rule. Without the change the direct call answers on eight of fourteen lines where the hooks are off. It loads `HF` once at import and keeps its exports: `ADVISOR_DISABLED_FLAGS` becomes the resolver's names for the concern, `advisorDisabledBy(env, config)` returns the resolver's key, and `disabledRecommendOutput(input, env, config)` passes both through. `requestWorkspaceRoot`, `emptyOutput` and the envelope stay as they are.
- **The handler's call**: `disabledRecommendOutput(input, process.env, {})`. Without it the shared daemon would read the flags file and abstain for a caller whose own environment set the switch to `0`.

No new file, module, option, layer or dependency. `ADV/skill-advisor-cli.ts` is unchanged.

### Decision D1: reuse `hook-flags.cjs` in the caller's process

**Context.** The goal asks for the direct call to be off whenever the skill-advisor hooks are off, decided in the caller's process by the same resolution the adapters use, and the client must not import `handlers/` or `better-sqlite3`.

**Decision.** `ADV/lib/advisor-disabled.ts` requires `.skilled/hooks/shared/hook-flags.cjs` with `createRequire(import.meta.url)` and calls `hookFlagDecision('skill-advisor', env, config)`. When `config` is not passed, the module loads it per call with `loadConfigFile(env.HOOK_FLAGS_CONFIG || configPath())`, never through the resolver's per-process cache, so the environment beats the file exactly as it does for `isHookEnabled`, and a test can point at a fixture.

**Why reuse is safe.** `HF` requires `node:fs`, `node:path` and `./env-aliases.cjs`, and `env-aliases.cjs` requires nothing (Measured Behavior). The client's static closure is 13 files with `zod` only, and the `createRequire` call adds two CommonJS files with no package. The adapters load it the same way (`SAD/hooks/claude/user-prompt-submit.ts:68-77`).

**How it finds the file.** The module walks up from its own file, `fileURLToPath(import.meta.url)`, to the first ancestor folder that holds `hooks/shared/hook-flags.cjs`. Under Vitest the source `ADV/lib/` sits four folders below `.skilled`, and the shim runs `ADV/dist/runtime/lib/`, six folders below, so a fixed relative path would hold in one and miss in the other. The walk ignores the working directory, so a call from any folder resolves the same file.

**Load once, fail open.** The module loads `HF` at import, so `ADVISOR_DISABLED_FLAGS` stays a constant, which the two CLI test files import, and so the alias bridge in `applyEnvAliases` runs once before any test sets an environment. When the file is missing or throws, `advisorDisabledBy` returns `null` and `ADVISOR_DISABLED_FLAGS` is empty. Every adapter does the same in that state (`catch { return true }`), so the hooks and the direct call still agree. A unit case pins that the resolver loaded, and the canonical line of the after matrix pins it for the built shim.

**Rejected.**
- A TypeScript copy of the rules (the names, `isTruthy`, the precedence, the file parser). It is a second copy of a rule `HF`, `hook-flags.sh` and the sk-doc and sk-code readers already keep in step through parity tests (`HF:134-141`), and it drifts the day a name is added.
- Importing the facade `.skilled/hooks/shared/hook-flags.ts`. It sits outside `ADV`'s compile root, so the build would pull it in and move the `dist` layout the shim and the hooks resolve against.
- Keeping the two-name list. The goal fails on eight lines.
- Reading the file through the resolver's cached `fileConfig()` by passing no `env`. The cache is per process and the handler suite runs many cases in one process, and an injected `env` would then drop the file silently.

**Consequence.** `ADVISOR_DISABLED_FLAGS` now holds ten names: `SYSTEM_HOOKS_DISABLED`, `MK_HOOKS_DISABLED`, `SYSTEM_SKILL_ADVISOR_DISABLED` and the seven aliases of `LEGACY_ALIASES['skill-advisor']`, in the resolver's order. The two CLI test files that strip it strip all ten with no edit. Truthy values and the file now count, and the reason names the key the resolver returns, so both `_HOOK_DISABLED` names set still name `SYSTEM_SKILL_ADVISOR_HOOK_DISABLED`.

### Decision D2: the daemon reads its own environment only

**Context.** The handler calls the same module in the daemon. With D1 and no change to the handler, a daemon would read `HOOK_FLAGS_CONFIG` or the default flags file beside the resolver.

**Decision.** The handler calls `disabledRecommendOutput(input, process.env, {})`. The daemon applies the resolver's rules to its own environment and never to the file.

**Why.** The flags file is a persistent default that a session's environment must be able to beat (the hook doc, section 6). A shared daemon serves every caller and cannot see a caller's `SYSTEM_SKILL_ADVISOR_DISABLED=0`, so if it read the file it would abstain for the one caller who turned the advisor back on. The caller already read the file before it connected.

**Widening, stated.** The daemon now also reads the master switch, its `MK_` alias, the canonical name, the other aliases and truthy values from its own environment, where it read two names set to `1`. The launcher's allowlist forwards none of these names and not `HOOK_FLAGS_CONFIG` (Measured Behavior, the `rg` that exits 1), so a daemon the launcher starts sees no change. Only a daemon started outside it, such as an MCP server a runtime starts from a shell that exported the switch, sees it, and abstaining there is what that switch means.

**The Python compat path.** `scripts/skill_advisor.py` checks `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED` set to exactly `1` itself, and its native path runs `handleAdvisorRecommend` in a Node bridge whose environment allowlist (`ADV/scripts/skill_advisor.py:214-235`) holds no switch name and no `HOOK_FLAGS_CONFIG`. With D2 that bridge reads no flags file either, so the compat contract keeps its exact-`1` rule. Without D2 a flags-file line would make the Python native path abstain.

**Residual.** An `advisor_recommend` MCP tool call that a daemon answers does not abstain under a flags-file line alone. That path is the MCP tool, not the Gate 2 direct call, and no caller-side check exists on it. Recorded, not built.

### Data Flow
A model or a user runs `node .skilled/bin/skill-advisor.cjs advisor_recommend`. The shim runs the compiled client in the caller's environment. `invokeAdvisorRecommendPayload` calls `disabledRecommendOutput(args)`, which loads the flags file named by `HOOK_FLAGS_CONFIG` or the default one and calls `hookFlagDecision('skill-advisor', process.env, config)`. When it says disabled, the function returns the envelope with the key as the reason, and the client prints `{ status: 'ok', data }` and exits 0 with no socket, launcher or scorer touched. Otherwise the request goes to the daemon as before, whose handler runs the same function against the daemon's own environment and an empty file config.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES
<!-- FILL: Name each surface the change touches. Write `not a consumer` when it does not read the change. Write `N/A` or delete the whole addendum when no fix surface applies. GOOD: `scripts/rotate-logs.sh`: owns the deletion. Action: update. WEAK: Various files. -->

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

No review Planning Packet applies. The gap is phase 028's assumption A4, and every row below was read in the code or run by this planner.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `ADV/lib/advisor-disabled.ts` `ADVISOR_DISABLED_FLAGS`, `advisorDisabledBy`, `disabledRecommendOutput` (`:33-40`, `:97-125`) | The direct call's and the handler's switch rule | update (T004) | The module cases of `ADT`, the built-module import of T004 and the matrix |
| `.skilled/hooks/shared/hook-flags.cjs` `hookFlagDecision`, `loadConfigFile`, `configPath`, `MASTER_FLAG`, `MASTER_ALIASES`, `concernFlag`, `LEGACY_ALIASES` | The rule's owner, read by every adapter | unchanged, now also read by the module | `HFT` passes before and after, and `G diff --quiet BASE -- $HF` exits 0 |
| `ADV/handlers/advisor-recommend.ts` `handleAdvisorRecommend` (`:643`) | Daemon-side check | update to pass `process.env, {}` (T005) | The new file and canonical cases of `HRT`, and its two phase 028 cases |
| `ADV/skill-advisor-cli.ts` `invokeAdvisorRecommendPayload` (`:1540`) | Calls the module before any socket, launcher or scorer | unchanged, the new rule reaches it through the defaults | The kill-switch cases of `CLT`, and `G diff --quiet BASE -- $CLI` exits 0 |
| `ADV/tests/skill-advisor-cli-test-utils.ts` `createIsolatedCliScope` (`:51-80`) | Strips `ADVISOR_DISABLED_FLAGS` from the scope, which now holds ten names with no edit | update to point `HOOK_FLAGS_CONFIG` at a missing file (T006) | The dual-client suite under an exported `HOOK_FLAGS_CONFIG` fails before T006 and passes after |
| `ADV/tests/skill-advisor-cli-stale-daemon-retry.vitest.ts` `switchEnv` (`:150-155`) and the phase 028 `it.each` (`:212`) | Strips and loops over the list | the loop leaves out the `MK_` names (T003) | `VX` of the file |
| `ADV/tests/handlers/advisor-recommend.vitest.ts` `afterEach` (`:112-124`) | Deletes two names | update to strip the list and `HOOK_FLAGS_CONFIG` before and after each case (T005) | `VX` of the file with `SYSTEM_SKILL_ADVISOR_DISABLED=1` exported |
| `.skilled/bin/system-skill-advisor-launcher.cjs` `CHILD_ENV_ALLOWLIST` (`:131-189`) | Forwards no switch name and no `HOOK_FLAGS_CONFIG` | unchanged, must stay so | The allowlist `rg` exits 1 and `G diff --quiet BASE -- $LB` exits 0 (T012) |
| `ADV/schemas/compat-contract.json`, `ADV/lib/compat/contract.ts:7`, `ADV/lib/compat/daemon-probe.ts:47`, `ADV/scripts/skill_advisor.py` | The Python CLI compat contract, `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED` set to exactly `1` | unchanged, not on the direct-call path | `G diff --quiet BASE --` over the four exits 0 (T012) |
| `ADV/scripts/skill_advisor.py` native bridge (`:116`, `:187`, allowlist `:214-235`) | Runs `handleAdvisorRecommend` in Node with an allowlisted environment that holds no switch name and no `HOOK_FLAGS_CONFIG` | not a consumer of the change, because D2 keeps the handler off the flags file | `G diff --quiet BASE -- $ADV/scripts/skill_advisor.py` exits 0 (T013) |
| `.opencode/plugins/system-skill-advisor.js:206`, `SAD/hooks/claude/user-prompt-submit.ts:73`, `SAD/hooks/dsh/prompt-advisor.mjs` | The adapters, the parity reference | not a consumer, unchanged | `VP` and the `hook=` column of the matrix |
| `SAD/hooks/skill-advisor-hook.md` section 6 | The canonical row and the paragraph say the other names act on the adapters only | update (T007) | `rg` for the new sentence and for the removed one |
| `SAD/manual-testing-playbook/compat-and-disable/global-disable-flag.md` step 1 | Checks only the legacy name | update (T008) | `rg` for the new call and signal |
| `.skilled/hooks/hook-flags.env.example:47` | The advisor line says brief only | update (T009) | `rg` and the sk-doc example-line test |

Doc lines about the switch left unchanged, each true after the fix or handed on:
- `SAD/feature-catalog/cli-surface/advisor-recommend.md:23` names only the two `_HOOK_DISABLED` names as what makes the direct call abstain. It is on the dispatch's do-not-touch list while another worker edits it, so the coordinator updates it (spec A6).
- `.skilled/skills/system-skill-advisor/changelog/v1.1.0.0.md` belongs to phase 025 (spec A7).
- `.skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md:75` says the canonical name disables skill-advisor injection, still true. `.skilled/commands/doctor/env.md` keeps no switch inventory and reads that reference and the example file at invocation (spec A8).
- `SAD/hooks/skill-advisor-hook.md` section 2 step 1 and the alias rows of section 6 stay true as written.
- `runtime/lib/README.md` and `runtime/tests/README.md` hold no sentence about the switch: `rg -n -i "HOOK_DISABLED|advisor-disabled|kill.?switch"` over both printed nothing.

Required inventories:
- Same-class producers: `rg -n "HOOK_DISABLED|_DISABLED'|=== '1'" $ADV --glob '*.ts' --glob '!**/dist/**' --glob '!tests/**'` lists the module and the compat probe before the fix, and only the compat probe after it.
- Consumers of changed symbols: `rg -n "ADVISOR_DISABLED_FLAGS|advisorDisabledBy|disabledRecommendOutput" $ADV --glob '*.ts' --glob '!**/dist/**'` lists the module, the handler, the client, `ADT`, `CLT` and `TU`.
- Matrix axes: the switch name (none, the two `_HOOK_DISABLED` names, the canonical name, the plugin alias, the master switch, its `MK_` alias) by the value (`1`, `true`, `yes`, `on`, `0`) by the source (environment, flags file, both with the environment at `0`) by the argument form (inline `--json`, stdin `--json -`) by the order (unflagged first and last).
- Algorithm invariant: the module returns a key exactly when `hookFlagDecision('skill-advisor', env, config)` returns `enabled: false`, and returns that key. In the client `config` is the caller's flags file, in the daemon it is empty. Adversarial cases: an explicit `env` with no `config` (the file must still count in the client), the source path against the `dist` path, an `MK_` name whose reason depends on the alias bridge, the environment's `0` over the file's `1`, and a flags file named in the daemon's environment.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES
<!-- FILL: Point to `tasks.md` and name the three phases in one line. GOOD: Setup reads `scripts/rotate-logs.sh` and counts the archives. Implementation adds `--keep <n>` to `scripts/rotate-logs.sh`. Verification runs `scripts/rotate-logs.sh --keep 3` and checks that ten archives become three. WEAK: See tasks. -->

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state. Setup checks the gate and records the floors, the suites, the reproduction and the warm call times before any edit. Implementation runs lane C first (the CLI cases, failing on the unfixed module), then lane M (the module, then the handler), then lane C again (the test scope) and lane D (three documents), each task test first where it changes behaviour. Verification builds, runs every suite, compares the floors, reruns the reproduction, checks the boundaries, commits the fix, gets one Opus review and closes the phase.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
<!-- FILL: Name the one command you will run and the output it must print. GOOD: `ls logs/archive | wc -l` prints 3 after `--keep 3` and 10 after a plain run. WEAK: Test it manually. -->

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | `advisorDisabledBy` against each name, value and source, and the resolver pin | Vitest, `tests/advisor-disabled.vitest.ts` |
| Integration | The handler in process with the flags file named in its environment and with the canonical name, and `runSkillAdvisorCli` in process against a fake warm daemon under each kill switch, plus the floors, the eval and the full suite | Vitest in `tests/handlers/advisor-recommend.vitest.ts` and `tests/skill-advisor-cli-stale-daemon-retry.vitest.ts`, the committed captures and `jq` |
| Manual | `zsh $SP/planning/kill-switch-matrix.sh` prints `match=yes` on all fourteen lines through the built shim | The planning probe |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
<!-- FILL: List each tool the change needs, or write `None`. GOOD: `bash` and `awk`. No new package. WEAK: Usual dependencies. -->

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 028 closed and committed | Internal | Complete | T001 stops the phase |
| Phase 025's workers on disjoint files | Internal | In flight at planning | `VALL` waits until no worker session is open (T010), and the commit stages by path (T014) |
| The warm workspace daemon | Internal | Live at planning, lease pid 72912 | The reproduction's warm lines test a cold start, and the coordinator warms it and reruns |
| `.skilled/hooks/shared/hook-flags.cjs` | Internal | Present, unchanged | The module fails open and the matrix stays `match=no` on eight lines, which T004 and T012 catch |
| `jq`, `rg`, `zsh`, `python3` with `pytest` and the compiled `dist` | Tool | Present | The reproduction or the example-line test cannot run. `BUILD` comes before every probe run after an edit, because the shim refuses a stale build |
| DeepSeek v4.1 flash max on OpenCode Go, an Opus verifier per task and one Opus reviewer for the diff | External | Named in the dispatch | A lane waits for its worker |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
<!-- FILL: Name the trigger and the one command that reverts the change. GOOD: Trigger: `--keep 3` removes an archive newer than the three kept. Revert the one commit. WEAK: Roll back if needed. -->

- **Trigger**: An unflagged call stops recommending, a floor or eval line moves, a `hook=on` line changes its rows, the client's closure gains a package, or a suite reads a real flags file.
- **Procedure**: Before the fix commit, discard the lane's working changes to the files it owns, which no other lane and no phase 025 worker touches. After it, revert the fix commit as a whole. The rebuilt `dist` follows the source on the next `BUILD`.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES
<!-- FILL: Draw the phase order in the fence, then fill the table with depends-on and blocks. Write `N/A` with one reason, or delete the whole section. GOOD: Setup to Implementation to Verification. Verification blocks close. WEAK: Phases depend on each other. -->

```
Setup (T001, T002) ──► lane C T003 (fails first) ──► lane M T004 ──► lane M T005 ──► lane C T006
                                                          └──────► lane D T007, T008, T009
──► Verification: suites, floors, reproduction, boundaries ──► fix commit ──► Opus review ──► close
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Phase 028 committed | Implementation |
| Implementation | Setup. T004 needs T003's failing run. T006 needs the `BUILD` after T005 | Verification |
| Verification | Every lane ended and no phase 025 worker session open for `VALL` | Close |
<!-- /ANCHOR:phase-deps -->

---

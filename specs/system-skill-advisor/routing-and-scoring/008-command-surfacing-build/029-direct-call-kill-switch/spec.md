---
title: "Feature Specification: Phase 29: direct-call-kill-switch"
description: "A user who turns the skill advisor off the documented way, with SYSTEM_SKILL_ADVISOR_DISABLED, the master switch, a truthy value or a line in hook-flags.env, silences the prompt hooks but still gets recommendations from the Gate 2 direct call, because the direct call reads only two names set to exactly 1. This phase makes the direct call ask the same resolver the adapters ask, in the caller's own process, so it is off whenever the skill-advisor hooks are off."
trigger_phrases:
  - "direct call kill switch"
  - "phase 29 direct call kill switch"
  - "advisor direct call ignores kill switch"
  - "skill advisor disabled direct call still answers"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 29: direct-call-kill-switch

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill every row: level, priority, status, date and branch. Use the real branch name. GOOD: Priority P1. Status Draft. Branch `feat/rotate-logs-keep`. WEAK: Priority TBD. Status maybe. -->

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-11-15 |
| **Branch** | `worktrees/352-command-surfacing-research` |
| **Parent Spec** | ../spec.md |
| **Phase** | 29 of 29 |
| **Predecessor** | 028-direct-call-off-switch |
| **Successor** | None |
| **Handoff Criteria** | Every task in `tasks.md` is `[x]`, every suite reports 0 failed, the floor and eval lines equal their before lines, `scratch/repro-after.txt` prints `match=yes` on every line with the lease lines equal, the fix is committed, the Opus review reports no open P0 or P1 and strict validation prints `RESULT: PASSED` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 29** of the build that makes the skill advisor surface every tracked slash command with a run, start or ask policy on every supported CLI (`../spec.md`). Phase 028 made the Gate 2 direct call abstain in the caller's own process, but only under the two names phase 026's runner sets, `SYSTEM_SKILL_ADVISOR_HOOK_DISABLED` and `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED`, each set to exactly `1` (028 assumption A4). The switch the docs tell a user to set is a different one. `SYSTEM_SKILL_ADVISOR_DISABLED` is the only advisor line in `.skilled/hooks/hook-flags.env.example`, and the hook doc calls it the canonical kill switch. The master `SYSTEM_HOOKS_DISABLED`, the values `true`, `yes` and `on`, and a line in `.skilled/hooks/hook-flags.env` turn the prompt hooks off as well. Under all of them the direct call still recommends. The operator answered "Sure" on 2026-11-15 to adding this phase (P054).

**Scope Boundary**: the shared switch module and its test, the handler's one call and its test, the CLI test file and the CLI test scope, and three documents. No scorer rule, phrase, guard, renderer, hook adapter, plugin, launcher, corpus row, committed baseline, compat contract or `AGENTS.md` line changes. `.skilled/hooks/shared/hook-flags.cjs` is reused as it is and not edited. The reproduction, the gates, the commit, the review and the close-out are the coordinator's.

**Dependencies**:
- Phase 028 is Complete and committed (T001 checks).
- Phase 025's workers are editing seven files at planning time. None of them is in this phase's file list (T001 checks `git status` on this phase's files only).
- The workspace advisor daemon is warm, so the reproduction exercises the warm path (T002 records its lease).

**Deliverables**:
- `lib/advisor-disabled.ts` decides through `hookFlagDecision('skill-advisor')` from `.skilled/hooks/shared/hook-flags.cjs`, the resolver every adapter uses, instead of its own two-name list.
- A direct call that abstains whenever the hooks are off in the same environment, and names the switch that decided.
- A daemon that decides from its own environment only, never from the flags file.
- Tests that fail before the fix for the reason the bug has, a reproduction that prints the hook decision beside the direct call's answer on fourteen lines, and three corrected documents.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE
<!-- FILL: State the problem in two sentences: what breaks, and for whom. GOOD: The rotate-logs script never deletes old archives, so a host that copies `logs/archive` fills its disk. WEAK: The script has issues with output. -->

### Problem Statement
A user who disables the advisor the documented way, with `SYSTEM_SKILL_ADVISOR_DISABLED=1` in the shell or in `.skilled/hooks/hook-flags.env`, gets no brief from the prompt hooks and still gets `sk-doc → /create:readme (start)` from the Gate 2 direct call that `AGENTS.md` tells every model to run. `advisorDisabledBy` reads only two names set to exactly `1`, while the hooks resolve the whole `skill-advisor` family, the master switch, four truthy values and the flags file through `isHookEnabled('skill-advisor')`.

### Purpose
The direct call is off whenever the skill-advisor hooks are off, decided in the caller's process by the same resolution the adapters use, so one switch turns the advisor off on every surface a model reads.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
<!-- FILL: Run the command this change affects and paste the command and its verbatim output. Quote every number the spec states about current behavior from this block. Write `N/A:` and a reason when no command applies. GOOD: `bash scripts/rotate-logs.sh` with 10 archives, then `ls logs/archive | wc -l` prints 10. WEAK: The script deletes old logs. -->
```text
# 2026-11-15, worktree HEAD 8a5f3214522, run from the repository root. PH is this phase folder and PK its parent.
# Each line strips every name the resolver reads for the skill-advisor concern, then sets one.
# hook= is hookFlagDecision('skill-advisor') in that same environment, direct= is the direct call.
# The flags-file lines point HOOK_FLAGS_CONFIG at scratch/planning/kill-switch.env, every other
# line at a path that does not exist. .skilled/hooks/hook-flags.env does not exist in this checkout.

$ zsh $PH/scratch/planning/kill-switch-matrix.sh
lease before {"pid":72912,"childPid":85562,"startedAt":"2026-11-15T06:37:52.335Z"}
none                                   hook=on direct=on match=yes recs=["sk-doc:/create:readme:start","system-spec-kit:-:-","mcp-tooling:-:-"]
SYSTEM_SKILL_ADVISOR_HOOK_DISABLED=1    hook=off:SYSTEM_SKILL_ADVISOR_HOOK_DISABLED direct=off:SYSTEM_SKILL_ADVISOR_HOOK_DISABLED match=yes recs=[]
SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1   hook=off:SPECKIT_SKILL_ADVISOR_HOOK_DISABLED direct=off:SPECKIT_SKILL_ADVISOR_HOOK_DISABLED match=yes recs=[]
SYSTEM_SKILL_ADVISOR_DISABLED=1         hook=off:SYSTEM_SKILL_ADVISOR_DISABLED direct=on match=no recs=["sk-doc:/create:readme:start","system-spec-kit:-:-","mcp-tooling:-:-"]
SYSTEM_SKILL_ADVISOR_DISABLED=true      hook=off:SYSTEM_SKILL_ADVISOR_DISABLED direct=on match=no recs=["sk-doc:/create:readme:start","system-spec-kit:-:-","mcp-tooling:-:-"]
SYSTEM_SKILL_ADVISOR_HOOK_DISABLED=yes  hook=off:SYSTEM_SKILL_ADVISOR_HOOK_DISABLED direct=on match=no recs=["sk-doc:/create:readme:start","system-spec-kit:-:-","mcp-tooling:-:-"]
SYSTEM_SKILL_ADVISOR_PLUGIN_DISABLED=on hook=off:SYSTEM_SKILL_ADVISOR_PLUGIN_DISABLED direct=on match=no recs=["sk-doc:/create:readme:start","system-spec-kit:-:-","mcp-tooling:-:-"]
SYSTEM_HOOKS_DISABLED=1                 hook=off:SYSTEM_HOOKS_DISABLED direct=on match=no recs=["sk-doc:/create:readme:start","system-spec-kit:-:-","mcp-tooling:-:-"]
MK_HOOKS_DISABLED=1                     hook=off:SYSTEM_HOOKS_DISABLED direct=on match=no recs=["sk-doc:/create:readme:start","system-spec-kit:-:-","mcp-tooling:-:-"]
SYSTEM_SKILL_ADVISOR_DISABLED=0         hook=on direct=on match=yes recs=["sk-doc:/create:readme:start","system-spec-kit:-:-","mcp-tooling:-:-"]
flags file                              hook=off:SYSTEM_SKILL_ADVISOR_DISABLED direct=on match=no recs=["sk-doc:/create:readme:start","system-spec-kit:-:-","mcp-tooling:-:-"]
flags file, env SYSTEM_..._DISABLED=0   hook=on direct=on match=yes recs=["sk-doc:/create:readme:start","system-spec-kit:-:-","mcp-tooling:-:-"]
stdin, SYSTEM_SKILL_ADVISOR_DISABLED=1  hook=off:SYSTEM_SKILL_ADVISOR_DISABLED direct=on match=no recs=["sk-doc:/create:readme:start","system-spec-kit:-:-","mcp-tooling:-:-"]
none, after the flagged lines          hook=on direct=on match=yes recs=["sk-doc:/create:readme:start","system-spec-kit:-:-","mcp-tooling:-:-"]
lease after  {"pid":72912,"childPid":85562,"startedAt":"2026-11-15T06:37:52.335Z"}

$ rg -n "require\(" .skilled/hooks/shared/hook-flags.cjs .skilled/hooks/shared/env-aliases.cjs
.skilled/hooks/shared/hook-flags.cjs:25:const fs = require("node:fs");
.skilled/hooks/shared/hook-flags.cjs:26:const path = require("node:path");
.skilled/hooks/shared/hook-flags.cjs:32:require("./env-aliases.cjs").applyEnvAliases();

$ cd .skilled/skills/system-skill-advisor/runtime && node $PK/028-direct-call-off-switch/scratch/planning/import-closure.mjs . skill-advisor-cli.ts lib/advisor-disabled.ts
skill-advisor-cli.ts files 13 packages zod
lib/advisor-disabled.ts files 9 packages zod

$ rg -c -e "'(SYSTEM_HOOKS_DISABLED|MK_HOOKS_DISABLED|HOOK_FLAGS_CONFIG|[A-Z_]*SKILL_ADVISOR[A-Z_]*_DISABLED)'" .skilled/bin/system-skill-advisor-launcher.cjs; echo "exit $?"
exit 1
```
<!-- /ANCHOR:measured-behavior -->

Eight of the fourteen lines print `match=no`: the canonical name set to `1` and to `true`, a truthy value on a name the client knows, the plugin alias, the master switch, its `MK_` alias, the flags file and the stdin form. On each of them the hooks are off and the direct call returns the same three rows as the unflagged line, `/create:readme` with policy `start` first. The six `match=yes` lines are the unflagged line before and after, the two names phase 028 handles, a `0` value and the environment's `0` beating the file's `1`. The lease lines are equal, so the daemon did not change during the run. The resolver loads only Node built-ins and its alias bridge, and the launcher forwards no switch name and no `HOOK_FLAGS_CONFIG` (the `rg` exits 1). The full suite, the floors and the eval line are recorded by T001, not here, because phase 025's workers edit files in this checkout while this plan was written.

### Mechanism per Path

`ADV` is `.skilled/skills/system-skill-advisor/runtime`, `SAD` is `.skilled/skills/system-skill-advisor` and `HF` is `.skilled/hooks/shared/hook-flags.cjs`.

| Path | Where it comes from | Decision |
|------|---------------------|----------|
| The direct call | `invokeAdvisorRecommendPayload` calls `disabledRecommendOutput(args)` first (`ADV/skill-advisor-cli.ts:1540`). It calls `advisorDisabledBy(env)`, which finds a name in `ADVISOR_DISABLED_FLAGS` set to exactly `'1'` (`ADV/lib/advisor-disabled.ts:33-40`). The list holds the two `_HOOK_DISABLED` names | Fix. `advisorDisabledBy` returns the key `hookFlagDecision('skill-advisor', env, config)` returns when it says disabled (T004). The client needs no edit |
| The prompt hooks | Each adapter calls `isHookEnabled('skill-advisor')` (`SAD/hooks/claude/user-prompt-submit.ts:73`, `.opencode/plugins/system-skill-advisor.js:206`). `hookFlagDecision` checks the master switch and its alias first, then `concernFlag('skill-advisor')`, which is `SYSTEM_SKILL_ADVISOR_DISABLED`, then the seven names in `LEGACY_ALIASES['skill-advisor']`, each through `isTruthy`, the environment over the file (`HF:207-240`) | Reused as it is, the source of the rule |
| The flags file | `configPath()` is `HOOK_FLAGS_CONFIG` or `.skilled/hooks/hook-flags.env` beside the resolver (`HF:123-125`). `hookFlagDecision` reads it only when no `env` argument is passed, or when a `config` object is passed with it (`HF:207-219`) | The client loads the file itself per call and passes it, so an explicit `env` cannot drop it (T004) |
| The daemon | `handleAdvisorRecommend` calls `disabledRecommendOutput(input)` in the daemon (`ADV/handlers/advisor-recommend.ts:643`). The launcher's `CHILD_ENV_ALLOWLIST` holds no switch name and no `HOOK_FLAGS_CONFIG` (`.skilled/bin/system-skill-advisor-launcher.cjs:131-189`) | The handler passes its own environment and an empty file config, so a shared daemon never reads the flags file (T005) |

---

<!-- ANCHOR:scope -->
## 3. SCOPE
<!-- FILL: List three to five things this change does, each starting with a verb. Before you list a new file, module, option, layer or dependency, name what fails today without it, or drop it. GOOD: Add a `--keep <n>` option that deletes all but the newest n archives in `logs/archive/`. WEAK: Update the script and docs. -->

### In Scope
- Make `advisorDisabledBy` ask `hookFlagDecision('skill-advisor')` from the shared resolver, with the caller's environment over the flags file, and derive `ADVISOR_DISABLED_FLAGS` from the resolver's own exports.
- Make the handler pass its own environment and an empty file config, so the shared daemon decides from what it was started with and never from the file.
- Test the module, the handler and the CLI client against the canonical name, a truthy value, the master switch, a flags-file entry and the environment's `0` over the file, and keep every CLI test scope off the real flags file.
- Correct the hook doc's configuration paragraph, the CP-003 playbook step and the advisor line of `hook-flags.env.example`.

Restraint pass. Building nothing fails: eight of fourteen lines above print `match=no`. A second copy of the resolver's rules in TypeScript fails the coordinator's rule and drifts the day a name or a truthy value is added to `HF`. Importing the `.ts` facade `hook-flags.ts` pulls a file outside `ADV` into its compile and moves the `dist` layout. Reuse adds no new file, module, option or dependency: the module requires `HF` with `createRequire`, as `SAD/hooks/claude/user-prompt-submit.ts:68-77` already does.

### Out of Scope
- Editing `HF`, `env-aliases.cjs` or any adapter. The rule stays where it is.
- The Python CLI compat contract: `runtime/schemas/compat-contract.json`, `lib/compat/contract.ts` and `lib/compat/daemon-probe.ts` keep `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED` set to exactly `1`, and `skill_advisor.py` is untouched.
- The launcher. Its allowlist already forwards no switch name and no `HOOK_FLAGS_CONFIG`, and stays so.
- `feature-catalog/cli-surface/advisor-recommend.md`, whose sentence names only the two `_HOOK_DISABLED` names. Another worker is editing it at planning time, so it is handed to the coordinator (A6).
- The release-notes entry for this change, owned by phase 025 (A7).

### Files to Change

`ADV` is `.skilled/skills/system-skill-advisor/runtime` and `SAD` is `.skilled/skills/system-skill-advisor`.

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `ADV/lib/advisor-disabled.ts` | Modify | Loads `HF` once, derives `ADVISOR_DISABLED_FLAGS` from it and decides through `hookFlagDecision` |
| `ADV/tests/advisor-disabled.vitest.ts` | Modify | The no-op cases for `true`, `SYSTEM_SKILL_ADVISOR_DISABLED` and `SYSTEM_HOOKS_DISABLED` flip on purpose, and file cases join them |
| `ADV/handlers/advisor-recommend.ts` | Modify | One call passes `process.env` and an empty file config |
| `ADV/tests/handlers/advisor-recommend.vitest.ts` | Modify | A daemon-ignores-the-file case, a canonical-name case and a strip of every switch name |
| `ADV/tests/skill-advisor-cli-stale-daemon-retry.vitest.ts` | Modify | Kill-switch cases beside the fake warm daemon |
| `ADV/tests/skill-advisor-cli-test-utils.ts` | Modify | The isolated scope points `HOOK_FLAGS_CONFIG` at a path that does not exist |
| `SAD/hooks/skill-advisor-hook.md` | Modify | The section 6 paragraph and the canonical row |
| `SAD/manual-testing-playbook/compat-and-disable/global-disable-flag.md` | Modify | Step 1 gains a call under the canonical name with a truthy value |
| `.skilled/hooks/hook-flags.env.example` | Modify | The advisor line says the switch also turns off the direct call |

No new file outside this phase folder. `ADV/skill-advisor-cli.ts` needs no edit, because it already calls `disabledRecommendOutput(args)` first.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
<!-- FILL: Write one testable requirement per row. Name the exact command or output. GOOD: With 10 archives, `bash scripts/rotate-logs.sh --keep 3` exits 0 and `ls logs/archive | wc -l` prints 3. WEAK: The option should work well. -->
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Whenever `hookFlagDecision('skill-advisor')` says disabled in the caller's environment and flags file, `advisor_recommend` through the CLI client exits 0 and prints `status: ok` with `recommendations: []`, `freshness: unavailable`, `warnings: ["ADVISOR_DISABLED"]` and `abstainReasons: ["Skill advisor disabled by <key>."]`, where `<key>` is the key the resolver returned, sends no request to a daemon that would answer and starts no launcher. |
| REQ-002 | Every line of the reproduction prints `match=yes`, so the direct call abstains exactly when the hooks are off, with the same key, and answers when the environment's `0` beats the file's `1`. |
| REQ-003 | With no switch set, the client still asks the daemon and prints its rows. Every `hook=on` line of the reproduction prints the same `recs=` as its before line. |
| REQ-004 | The module holds no copy of the resolver's rules: it calls `hookFlagDecision` from `HF`, holds no truthy literal and no name list of its own, and `ADVISOR_DISABLED_FLAGS` is built from `MASTER_FLAG`, `MASTER_ALIASES`, `concernFlag('skill-advisor')` and `LEGACY_ALIASES['skill-advisor']`. The client's static closure gains no package, and `HF` and `env-aliases.cjs` require only `node:fs`, `node:path` and `./env-aliases.cjs`. |
| REQ-005 | The floor lines and the eval line equal their before lines, `BUILD` and `TC` exit 0, `VALL` reports 0 failed with at least as many passed as its before line plus the new cases, and `DT`, `VP` and `HFT` report `fail 0`. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-006 | The handler decides from the daemon's own environment and never reads the flags file, the launcher's allowlist forwards no switch name and no `HOOK_FLAGS_CONFIG`, and the launcher file is unchanged. |
| REQ-007 | The compat contract is untouched: `runtime/schemas/compat-contract.json`, `lib/compat/` and `scripts/skill_advisor.py` show no diff, and `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED` is still read as exactly `1` there. |
| REQ-008 | No CLI or handler suite reads the real flags file or an exported switch: the isolated scope points `HOOK_FLAGS_CONFIG` at a path that does not exist, and the handler suite strips every name in `ADVISOR_DISABLED_FLAGS` before each case. |
| REQ-009 | The hook doc says the direct call uses the adapters' resolution, the CP-003 step checks the canonical name with a truthy value, the example file's advisor line names the direct call, and every other doc line about the switch is listed in `plan.md` as unchanged or handed on, with its reason. |
| REQ-010 | No code comment added by this phase names a spec path, a phase, a task, a finding or a decision id, and the phase diff touches no `AGENTS.md`, no row file, no package file, no committed baseline, no file of phase 025 and no file outside `FILES`. |
| REQ-011 | One Opus reviewer reads the fix diff and reports 0 P0 and 0 P1, or each P0 and P1 it reports becomes a task that is fixed, committed and rechecked before the close-out. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA
<!-- FILL: Write one measurable outcome per line. A command can prove it. GOOD: With 10 archives in `logs/archive`, `bash scripts/rotate-logs.sh --keep 3` leaves 3. WEAK: The feature is successful. -->

- **SC-001**: `zsh $PH/scratch/planning/kill-switch-matrix.sh` prints `match=yes` on all fourteen lines, where the Measured Behavior block prints `match=no` on eight.
- **SC-002**: The six `hook=on` lines print the rows they printed before, `sk-doc:/create:readme:start` first.
- **SC-003**: A user who uncomments the advisor line of `hook-flags.env.example` in `.skilled/hooks/hook-flags.env` gets the abstain envelope from `node .skilled/bin/skill-advisor.cjs advisor_recommend`, which the flags-file line of the reproduction shows through `HOOK_FLAGS_CONFIG`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES
<!-- FILL: Name one dependency and one risk. Give each a concrete mitigation. GOOD: A script that reads `--keep` with no value could delete every archive. Mitigation: reject a missing value with exit 2 and test it. WEAK: There may be some risk. -->

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 025's workers edit seven files in the same checkout | A whole-suite run can catch a half-written edit, and a careless commit could take their files | The two phases share no file. `VALL` runs only while no worker session is open (T010), and the commit stages `FILES` and this phase folder by path, never with `-a` (T014) |
| Risk | The module finds `HF` from the source path under Vitest and misses it from the `dist` path the shim runs, which sits two folders deeper | High: the fail-open catch would keep every unit and CLT case green while the shipped direct call keeps answering | The module walks up from its own file to the first ancestor that holds `hooks/shared/hook-flags.cjs`, so depth does not matter. T004 checks the built module with a one-line import, and T012 holds the canonical line of the reproduction, which runs the built shim, as a hard verify |
| Risk | A worker passes an explicit `env` to `hookFlagDecision` with no `config`, which makes the resolver skip the file | High: every environment case passes and the flags-file line stays `match=no` | T004 names the exact call, and its file case sets no switch in the environment and expects an abstain |
| Risk | Requiring `HF` runs `applyEnvAliases`, which copies each `MK_` value onto its new name in `process.env` | Low: the adapters already do the same in their own processes, and the launcher forwards no such name. The review showed the copy reaches every `MK_` name in the CLI client, so `MK_SKILL_ADVISOR_CLI_TRUSTED=1` now acts as its new name for every CLI command. That is intended, because the bridge exists so old names keep working, and `--trusted` is a flag any caller can pass | The module loads `HF` once at import, before any test sets an environment, and the CLT loop over the switch names leaves out the `MK_` names, whose reason depends on that bridge (T003) |
| Risk | The daemon now reads the master switch, the canonical name and truthy values from its own environment | Low: only a daemon started outside the launcher, such as an MCP server a runtime starts in a shell that exported the switch, sees any of them, and abstaining there matches the switch | Recorded as decision D2 in `plan.md`. T005 pins it with a canonical-name case |
| Risk | A test suite inherits a real `hook-flags.env` or an exported switch from the coordinator's shell | Med: every isolated CLI call would abstain and the suites would go red for no code reason | T006 points the scope at a missing file, T005 strips every name in the handler suite, and T001 records that the shell exports no switch |
| Risk | Phase 025's release notes and the `advisor_recommend` catalog page still describe phase 028's two names | Low: the docs would undersell the switch | Handed to the coordinator (A6, A7) |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- FILL: Name one measurable limit per line. Write `N/A` and one reason when the packet runs no service, or delete the whole section. GOOD: The option adds under 5 ms to a run. WEAK: Performance is good. -->
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: Under any switch the direct call opens no socket and spawns no process, as phase 028 made it for two names.
- **NFR-P02**: The median wall time of five warm unflagged direct calls is recorded before and after the fix (T002, T012) for the reviewer, with no bound. The client now loads two small CommonJS files and reads the flags file once per call.

### Security
- **NFR-S01**: No task reads, prints or logs a holdout prompt. `command-prompts.jsonl`, `holdout-prompts.jsonl` and `behaviour-fresh-prompts.jsonl` are opened only through `jq 'del(.prompt)'`, and every `git diff`, `show` or `log -p` over a path that includes a row file excludes them.
- **NFR-S02**: The disabled envelope carries no prompt text and no flags-file content beyond the switch name.
- **NFR-S03**: No task creates, edits or reads `.skilled/hooks/hook-flags.env`. Every file case uses `HOOK_FLAGS_CONFIG` with a fixture or a temp file.

### Reliability
- **NFR-R01**: When `HF` cannot be found or loaded, the module fails open, as every adapter does, so the hooks and the direct call still agree (D1 in `plan.md`).

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES
<!-- FILL: Name the empty input, the maximum input and the failure path. One line each. Write `N/A` with one reason, or delete the whole section. GOOD: Empty input: an empty `logs/archive/` deletes nothing and exits 0. Maximum: `--keep 3` over 10,000 archives keeps the newest 3. Failure path: a missing `--keep` value exits 2 with usage. WEAK: Handle edge cases. -->

- Empty input: a switch set to an empty string or `0` disables nothing, as `isTruthy` rules. The environment's `0` beats the file's `1`, because the resolver reads the environment first for each name.
- Maximum input: several names set at once name the first one the resolver checks, the master switch before the canonical name before the aliases in `LEGACY_ALIASES` order, so both `_HOOK_DISABLED` names set still name `SYSTEM_SKILL_ADVISOR_HOOK_DISABLED`, as phase 028's case pins.
- Failure path: a flags file that cannot be read gives an empty config, which disables nothing (`loadConfigFile` fails open). A missing or broken `HF` makes the module answer as if no switch were set, the same answer every adapter gives in that state.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT
<!-- FILL: Score each row with the number the change earns. The total must match the level. Write `N/A` with one reason, or delete the whole section. GOOD: Scope 6/25: one option in `scripts/rotate-logs.sh`. Total 18/100. WEAK: Complexity is medium. -->

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 7/25 | Nine files, about 200 lines with tests, no new module |
| Risk | 9/25 | A user-facing switch, a resolver shared by every hook, a path that differs between source and `dist`, and a phase running beside it in one checkout |
| Research | 6/20 | Cause read in the module, the resolver, the handler and the launcher, then confirmed by a fourteen-line matrix |
| **Total** | **22/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS
<!-- FILL: Write each open question as one line. Write `None` when nothing blocks. GOOD: Does a missing `--keep` value delete every archive? Decision: no, a missing value exits 2. WEAK: Edge cases are unclear. -->

None blocks planning. The planner could ask no one, so each point the dispatch left open is decided below and recorded as an assumption, open for the coordinator or the operator to overturn.

- A1. Level: `recommend-level.sh --loc 220 --files 11` printed Level 1. Decision: Level 2, because `acceptance-criteria.md` is the closure gate, as P001 decided for phases 020 to 028 and as the dispatch asked.
- A2. The plan ran under `/speckit:plan :auto` with the setup bound by the dispatch: this folder, Level 2, execution mode auto, no relationships. Confirm checkpoints were skipped, as `:auto` skips them. Step 5's four exploration agents were not dispatched, because this planner may dispatch none, and the same reads were done inline. No `research/research.md` was written and step 6 did not run `generate-context.js`, as in phases 024 to 028. No `goal.md` was written: a child goal needs a binding row in the parent goal, which other workers are editing. The summary scaffold sits in `scratch/` until the close-out, as phase 028 did.
- A3. Reuse over a copy: the module requires `HF` and calls `hookFlagDecision`. The full reasoning, with the rejected options, is decision D1 in `plan.md`.
- A4. The daemon reads its own environment only (D2 in `plan.md`). The flags file is a persistent default the environment must be able to beat, and a shared daemon cannot see a caller's `0`, so only the caller reads it. An `advisor_recommend` MCP tool call answered by a daemon therefore does not abstain under a flags-file line. That is the MCP path, not the Gate 2 direct call this phase fixes, and it is recorded as a residual.
- A5. `ADV/skill-advisor-cli.ts` is not edited. It already calls `disabledRecommendOutput(args)` as its first statement, which now reads the caller's environment and the flags file through its defaults.
- A6. `feature-catalog/cli-surface/advisor-recommend.md` line 23 names only the two `_HOOK_DISABLED` names as what makes the direct call abstain. It stays true but incomplete after the fix. It is on the dispatch's do-not-touch list, so the coordinator updates it once its current editor is done. `runtime/lib/README.md` and `runtime/tests/README.md` hold no sentence about the switch (`rg` at planning printed nothing).
- A7. Phase 025 owns the open changelog entry v1.1.0.0, which another worker is editing. This fix is user-facing and belongs there, so the coordinator amends phase 025's scope.
- A8. `.skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md:75` says `SYSTEM_SKILL_ADVISOR_DISABLED` disables skill-advisor injection. It stays true and is not edited. `.skilled/commands/doctor/env.md` keeps no switch inventory and reads that reference and the example file at invocation, so it needs no change either.
- A9. Workers are DeepSeek v4.1 flash max on OpenCode Go, one task per session, each checked by an Opus verifier before the next task in its lane, as the dispatch and phases 020 to 028 set.
<!-- /ANCHOR:questions -->

---

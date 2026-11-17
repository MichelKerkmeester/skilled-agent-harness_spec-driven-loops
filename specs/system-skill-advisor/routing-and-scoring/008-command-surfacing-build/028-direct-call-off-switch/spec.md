---
title: "Feature Specification: Phase 28: direct-call-off-switch"
description: "With the advisor switched off in the shell, the Gate 2 direct call still returns recommendations, because a warm daemon reads its own environment and the local-scorer fallback reads none. This phase makes the CLI client decide per request in the caller's process, from one shared switch list, so the behaviour arm's off arm gets no command and a user who sets the switch gets an abstain."
trigger_phrases:
  - "direct call off switch"
  - "phase 28 direct call off switch"
  - "advisor disabled flag cli client"
  - "warm daemon ignores disable flag"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 28: direct-call-off-switch

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill every row: level, priority, status, date and branch. Use the real branch name. GOOD: Priority P1. Status Draft. Branch `feat/rotate-logs-keep`. WEAK: Priority TBD. Status maybe. -->

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-14 |
| **Branch** | `worktrees/352-command-surfacing-research` |
| **Parent Spec** | ../spec.md |
| **Phase** | 28 of 28 |
| **Predecessor** | 027-review-pass-four-remediation |
| **Successor** | 026-untuned-behaviour-arm |
| **Handoff Criteria** | Every task in `tasks.md` is `[x]`, every suite reports 0 failed, the floor and eval lines equal their before lines, `scratch/repro-after.txt` prints the abstain reason on every `off` line and the before rows on every `on` line, the fix is committed, the Opus review reports no open P0 or P1 and strict validation prints `RESULT: PASSED` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 28** of the build that makes the skill advisor surface every tracked slash command with a run, start or ask policy on every supported CLI (`../spec.md`). The packet exists so a model takes the right command workflow more often while it stays free to choose. Phase 026 measures that by running the brief off against on, and its switch probe T032 is blocked (`../026-untuned-behaviour-arm/tasks.md`, `../026-untuned-behaviour-arm/scratch/switch-probe.txt`): with the off switch set the hooks print no brief, but the Gate 2 direct call that `AGENTS.md` tells a model to run still returns `/create:readme` with policy `start`. An off-arm model that follows Gate 2 would get the command, so the arm would compare on with on. This phase fixes the direct call. The run order is 027, then 028, then 026, then 025.

**Scope Boundary**: the CLI client, the recommend handler, one new shared module and its test, two CLI test files and three documents. No scorer rule, phrase, guard, renderer, hook, plugin, launcher, corpus row, committed baseline or `AGENTS.md` line changes. Phase 026's harness files are being edited by its own lanes at the same time and none of them is in this phase's file list, so the two phases share no file. The reproduction, the gates, the commit, the review and the close-out are the coordinator's.

**Dependencies**:
- Phase 027 is Complete and committed (T001 checks).
- Phase 026's in-flight lanes touch none of this phase's files (T001 checks `git status` on this phase's files only).
- The workspace advisor daemon is warm, so the reproduction exercises the warm path (T002 records its lease).

**Deliverables**:
- `lib/advisor-disabled.ts`, the one home of the switch list and the disabled envelope, called by the handler and by the CLI client.
- A CLI client that abstains under the switch before it probes a socket, spawns a launcher or runs the local scorer.
- Tests that fail before the fix for the reason the bug has, and a reproduction that prints the abstain reason in both call orders from a fresh socket folder and from the warm default one.
- Three corrected documents.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE
<!-- FILL: State the problem in two sentences: what breaks, and for whom. GOOD: The rotate-logs script never deletes old archives, so a host that copies `logs/archive` fills its disk. WEAK: The script has issues with output. -->

### Problem Statement
A model in the behaviour arm's off arm, or a user who exports `SYSTEM_SKILL_ADVISOR_HOOK_DISABLED=1`, runs the Gate 2 direct call and still gets `sk-doc → /create:readme (start)` from the warm daemon, or two skill rows from the local scorer when no daemon answers. The only switch check sits in the daemon's handler and reads the daemon's own environment, and the client's fallback path reads none.

### Purpose
Under the switch the direct call abstains in the caller's own process, with the same envelope the handler returns, whatever daemon is running, so the off arm differs from the on arm in the advisor alone.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
<!-- FILL: Run the command this change affects and paste the command and its verbatim output. Quote every number the spec states about current behavior from this block. Write `N/A:` and a reason when no command applies. GOOD: `bash scripts/rotate-logs.sh` with 10 archives, then `ls logs/archive | wc -l` prints 10. WEAK: The script deletes old logs. -->
```text
# 2026-11-14, worktree HEAD 83723f699d, run from the repository root. PH is this phase folder.
# OFF is SYSTEM_SKILL_ADVISOR_HOOK_DISABLED=1 SYSTEM_SKILL_ADVISOR_PLUGIN_DISABLED=1, the switch the arm's runner sets.
# Fresh socket folders are mktemp folders under /tmp, removed by the script. git status printed no new path after the run.

$ zsh $PH/scratch/planning/direct-call-matrix.sh
lease before {"pid":49475,"childPid":49590,"startedAt":"2026-11-14T21:53:37.472Z"}
warm, flag first   1st off disabledCount=none {"degraded":null,"source":null,"freshness":"live","abstain":null,"recs":["sk-doc:/create:readme:start","system-spec-kit:-:-","mcp-tooling:-:-"]}
warm, flag first   2nd on disabledCount=none {"degraded":null,"source":null,"freshness":"live","abstain":null,"recs":["sk-doc:/create:readme:start","system-spec-kit:-:-","mcp-tooling:-:-"]}
warm, plain first  1st on disabledCount=none {"degraded":null,"source":null,"freshness":"live","abstain":null,"recs":["sk-doc:/create:readme:start","system-spec-kit:-:-","mcp-tooling:-:-"]}
warm, plain first  2nd off disabledCount=none {"degraded":null,"source":null,"freshness":"live","abstain":null,"recs":["sk-doc:/create:readme:start","system-spec-kit:-:-","mcp-tooling:-:-"]}
fresh, flag first  1st off disabledCount=none {"degraded":true,"source":"local-scorer","freshness":null,"abstain":null,"recs":["system-spec-kit:-:-","sk-doc:-:-"]}
fresh, flag first  2nd on disabledCount=none {"degraded":true,"source":"local-scorer","freshness":null,"abstain":null,"recs":["system-spec-kit:-:-","sk-doc:-:-"]}
fresh, plain first 1st on disabledCount=none {"degraded":true,"source":"local-scorer","freshness":null,"abstain":null,"recs":["system-spec-kit:-:-","sk-doc:-:-"]}
fresh, plain first 2nd off disabledCount=none {"degraded":true,"source":"local-scorer","freshness":null,"abstain":null,"recs":["system-spec-kit:-:-","sk-doc:-:-"]}
warm, stdin form       off disabledCount=none {"degraded":null,"source":null,"freshness":"live","abstain":null,"recs":["sk-doc:/create:readme:start","system-spec-kit:-:-","mcp-tooling:-:-"]}
lease after  {"pid":49475,"childPid":49590,"startedAt":"2026-11-14T21:53:37.472Z"}

$ jq -c '{pid, ownerPid, socketPath}' .skilled/skills/system-skill-advisor/runtime/database/.system-skill-advisor-launcher.json
{"pid":49475,"ownerPid":49475,"socketPath":"/tmp/system-skill-advisor/1787187e91b4/daemon-ipc.sock"}
$ SPECKIT_IPC_SOCKET_DIR=<fresh folder> node .skilled/bin/system-skill-advisor-launcher.cjs </dev/null; echo "exit $?"; find <fresh folder>
[system-skill-advisor-launcher] liveOwnerDetected: ownerPid=49475 classification=live-owner
[system-skill-advisor-launcher] bridging to lease holder pid=49475 socket=/tmp/system-skill-advisor/1787187e91b4/daemon-ipc.sock
exit 0
<fresh folder>

$ cd .skilled/skills/system-skill-advisor/runtime && node $PH/scratch/planning/import-closure.mjs . skill-advisor-cli.ts handlers/advisor-recommend.ts lib/skill-advisor-brief.ts schemas/advisor-tool-schemas.ts lib/compat/contract.ts lib/utils/workspace-root.ts
skill-advisor-cli.ts files 7 packages
handlers/advisor-recommend.ts files 64 packages @spec-kit/shared/algorithms/rrf-fusion.js,@spec-kit/shared/embeddings/adapters/ollama.js,@spec-kit/shared/embeddings/auto-select.js,@spec-kit/shared/embeddings/factory.js,@spec-kit/shared/embeddings/registry.js,@spec-kit/shared/frontmatter/parse-frontmatter.js,better-sqlite3,zod
lib/skill-advisor-brief.ts files 39 packages @spec-kit/shared/embeddings/auto-select.js,@spec-kit/shared/embeddings/factory.js,@spec-kit/shared/embeddings/registry.js,@spec-kit/shared/frontmatter/parse-frontmatter.js,better-sqlite3,zod
schemas/advisor-tool-schemas.ts files 6 packages zod
lib/compat/contract.ts files 1 packages
lib/utils/workspace-root.ts files 1 packages

$ node $RAD/capture-command-routing-baseline.mjs | jq -c '.metrics.typed_recall_at_1, .metrics.false_offer, .attachedMetrics.plain.holdout'
{"correct":24,"total":44}
{"count":0,"total":35}
{"own":1,"attached":0,"combined":1,"total":44}
$ node $RAD/capture-scorer-eval-baseline.mjs | jq -c '[.metrics.full_corpus_top1.correct,.metrics.holdout_top1.correct,.metrics.ambiguity_top1.correct,.metrics.gold_none_false_fire.value]'
[160,51,21,5]
```
<!-- /ANCHOR:measured-behavior -->

The script first warms the workspace daemon with an unflagged status call, and the equal lease lines show the daemon did not change during the run. All nine calls print no `disabled by` line. The four warm calls and the stdin form carry `/create:readme` with policy `start`, and the four fresh-folder calls carry two skill rows from the local scorer. The full suite count is recorded by T001, not here, because phase 026's lanes edit test files while this plan was written.

### Mechanism per Path

`ADV` is `.skilled/skills/system-skill-advisor/runtime`. The client is `ADV/skill-advisor-cli.ts`, which `.skilled/bin/skill-advisor.cjs` runs through the compiled `dist`.

| Path | Where it comes from | Decision |
|------|---------------------|----------|
| Warm default daemon | `invokeAdvisorRecommendPayload` (`ADV/skill-advisor-cli.ts:1531`) sends the request over the socket. The daemon's `handleAdvisorRecommend` reads `process.env` of the daemon (`ADV/handlers/advisor-recommend.ts:726`), which a caller's shell never reaches | Fix. The client decides before it connects (T005) |
| Fresh socket folder, the path the coordinator's probe took | The workspace daemon holds the lease for the default database, which the launcher keys on the database folder, not the socket folder. A launcher started for a fresh socket folder finds the live owner, bridges to it and exits 0 without binding the fresh socket (the launcher lines above). `waitForDaemon` then throws a retryable error and the catch in `invokeAdvisorRecommendPayload` runs `runLocalScorer` (`ADV/skill-advisor-cli.ts:1572`), which reads no switch and returns `degraded: true, source: local-scorer` with no `freshness` field. `degradedRecommendations` collapses the untyped command row to its owner skill, so this path leaks skills and not the command | Fix. The same early check precedes the fallback (T005) |
| Cold start under the switch | `spawnLauncher` passes the caller's `process.env` (`ADV/skill-advisor-cli.ts:1116`), and the launcher's child allowlist forwards both switch names to the daemon (`.skilled/bin/system-skill-advisor-launcher.cjs:159-160`). A daemon started that way abstains for every later caller, flagged or not. The same launcher also replaces a live daemon that predates the current build: `ensureDaemonReady` recycles it when `liveDaemonPredatesBuild` finds `dist/runtime/advisor-server.js` newer than the lease (`ADV/skill-advisor-cli.ts:1293`), so the first flagged call after a rebuild restarts the shared workspace daemon under the switch | Closed for `advisor_recommend`, which no longer reaches `ensureDaemonReady` under the switch. Another command run under the switch, such as `advisor_status`, still starts or recycles a daemon that carries it. Recorded as a residual, not built (A6, P053) |

The coordinator's trace named the right check and the right file. The one correction is the fresh-folder probe: it never reached a handler, so its missing `freshness` field marks the local-scorer fallback, as the trace suspected.

---

<!-- ANCHOR:scope -->
## 3. SCOPE
<!-- FILL: List three to five things this change does, each starting with a verb. Before you list a new file, module, option, layer or dependency, name what fails today without it, or drop it. GOOD: Add a `--keep <n>` option that deletes all but the newest n archives in `logs/archive/`. WEAK: Update the script and docs. -->

### In Scope
- Move the switch list, the lookup and the disabled envelope out of the handler into `ADV/lib/advisor-disabled.ts`, and make the handler decide through it with no change in what it returns.
- Make the CLI client call the same function first in `invokeAdvisorRecommendPayload`, so a flagged request never probes a socket, spawns a launcher or runs the local scorer.
- Test the client against a fake warm daemon that answers whatever the switch says, flagged and unflagged, and with no daemon at all, and strip every switch name from the isolated CLI test scope.
- Correct the hook doc's configuration table, the CP-003 playbook step that relied on a cold daemon inheriting the switch, and the `advisor_recommend` catalog page.

Restraint pass for the new module. Building nothing fails: all nine calls above recommend. Exporting the list from the handler and importing the handler into the client fails, because the handler's runtime import closure is 64 files with `better-sqlite3` and the scorer, against 7 files and no package for the client today, so every CLI call would load the native module whose ABI the shim already has to work around. Copying the list into the client fails the coordinator's rule and lets the two drift. Importing the threshold resolver from `lib/skill-advisor-brief.ts` fails for the same reason as the handler (39 files with `better-sqlite3`), so the module reads its defaults from `lib/compat/contract.ts`, which the client already imports. One new module it is.

### Out of Scope
- (Moved into scope by the coordinator as T017: the launcher no longer forwards the switch names to a daemon it starts, see A6.)
- Adding `SYSTEM_SKILL_ADVISOR_DISABLED`, `SYSTEM_HOOKS_DISABLED` or truthy values such as `true` to the direct call's switch - the coordinator decided the client checks the same list the handler has, and the arm sets the two `_HOOK_DISABLED` names to `1` (A4).
- Making the standalone Python `skill_advisor.py` read the `SYSTEM_` name - it reads `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED` only, the arm does not run it, and the hook doc already states it.
- The release-notes entry for this change - phase 025 owns the open changelog entry and its scope still names phases 019 to 024 (A9).
- Any edit to phase 026's code or to phase 027.

### Files to Change

`ADV` is `.skilled/skills/system-skill-advisor/runtime` and `SAD` is `.skilled/skills/system-skill-advisor`.

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `ADV/lib/advisor-disabled.ts` | Create | `ADVISOR_DISABLED_FLAGS`, `advisorDisabledBy`, `requestWorkspaceRoot`, `emptyOutput` and `disabledRecommendOutput` |
| `ADV/tests/advisor-disabled.vitest.ts` | Create | The lookup's name and value rule and the envelope |
| `ADV/handlers/advisor-recommend.ts` | Modify | Imports the module and drops its own copies of the list, the envelope builders and the two workspace helpers |
| `ADV/skill-advisor-cli.ts` | Modify | One early call in `invokeAdvisorRecommendPayload` |
| `ADV/tests/skill-advisor-cli-stale-daemon-retry.vitest.ts` | Modify | A disable-switch block beside the only fake advisor daemon the suite has |
| `ADV/tests/skill-advisor-cli-test-utils.ts` | Modify | The isolated scope strips every switch name |
| `SAD/hooks/skill-advisor-hook.md` | Modify | The configuration table and one paragraph on where the direct call decides |
| `SAD/manual-testing-playbook/compat-and-disable/global-disable-flag.md` | Modify | Step 1 runs against the warm daemon and checks an unflagged call after it |
| `SAD/feature-catalog/cli-surface/advisor-recommend.md` | Modify | One sentence on the client's early check and two source rows |

Two new files, the module and its test. No new option, layer or dependency.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
<!-- FILL: Write one testable requirement per row. Name the exact command or output. GOOD: With 10 archives, `bash scripts/rotate-logs.sh --keep 3` exits 0 and `ls logs/archive | wc -l` prints 3. WEAK: The option should work well. -->
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | With `SYSTEM_SKILL_ADVISOR_HOOK_DISABLED=1` or `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1` in the caller's environment, `advisor_recommend` through the CLI client exits 0 and prints `status: ok` with `recommendations: []`, `freshness: unavailable`, `warnings: ["ADVISOR_DISABLED"]` and `abstainReasons: ["Skill advisor disabled by <name>."]`, sends no request to a daemon that would answer, and starts no launcher. |
| REQ-002 | With neither name set, the client still asks the daemon and prints its rows, and every `on` line of the reproduction equals its before line. |
| REQ-003 | `ADVISOR_DISABLED_FLAGS` is defined once, in `ADV/lib/advisor-disabled.ts`, the handler and the client both decide through `disabledRecommendOutput`, and the handler's two existing disabled cases pass unchanged. |
| REQ-004 | The floor lines (typed 24 of 44, false offers 0 of 35, plain holdout 1 of 44) and the eval line `[160,51,21,5]` equal their before lines, `BUILD` and `TC` exit 0, `VALL` reports 0 failed and at least as many passed as its before line plus the new cases, and the doctor tests and the OpenCode plugin test report `fail 0`. |
| REQ-005 | The reproduction run after the fix prints `disabledCount=1` and the abstain reason on each of its five `off` lines, warm and fresh, flag first and plain first, and the stdin form. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-006 | The client's runtime import closure holds no native package: `import-closure.mjs` prints no `better-sqlite3` for `skill-advisor-cli.ts`, and `skill-advisor-cli.ts` imports nothing under `handlers/`. |
| REQ-007 | The hook doc names the two switch names and the value `1` as what makes the direct call abstain and says it decides in the caller's process, CP-003 step 1 runs against the warm daemon and checks that an unflagged call still recommends, and the catalog page names the shared module and the client's early check. Every other doc line about the switch is listed in `plan.md` as unchanged with its reason. |
| REQ-008 | The isolated CLI test scope strips every name in `ADVISOR_DISABLED_FLAGS`, so a switch exported in the coordinator's shell does not turn the CLI suites red. |
| REQ-009 | No code comment added by this phase names a spec path, a phase, a task, a finding or a decision id, and the phase diff touches no `AGENTS.md`, no row file, no package file, no committed baseline and no file outside `FILES`. |
| REQ-010 | One Opus reviewer reads the fix diff and reports 0 P0 and 0 P1, or each P0 and P1 it reports becomes a task that is fixed, committed and rechecked before the close-out. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA
<!-- FILL: Write one measurable outcome per line. A command can prove it. GOOD: With 10 archives in `logs/archive`, `bash scripts/rotate-logs.sh --keep 3` leaves 3. WEAK: The feature is successful. -->

- **SC-001**: `zsh $PH/scratch/planning/direct-call-matrix.sh` prints `disabledCount=1` on its five `off` lines, where the Measured Behavior block prints `none` on all nine.
- **SC-002**: The four `on` lines print the same rows as before: `sk-doc:/create:readme:start` first on the two warm lines and the two local-scorer skill rows on the two fresh lines.
- **SC-003**: Phase 026 can rerun T032 and see its direct-call check print 1 under `OFF` and nothing without it.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES
<!-- FILL: Name one dependency and one risk. Give each a concrete mitigation. GOOD: A script that reads `--keep` with no value could delete every archive. Mitigation: reject a missing value with exit 2 and test it. WEAK: There may be some risk. -->

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 026's lanes edit code in the same checkout while this phase runs | A whole-suite run can catch a half-written 026 edit, and a careless commit could take 026's files | The two phases share no file. `VALL` runs only when no 026 worker session is open (T010), and the commit stages `FILES` and this phase folder by path, never with `-a` (T014) |
| Dependency | The workspace daemon is warm when the reproduction runs | Without it the warm lines test a cold start instead | T002 and T012 record the lease line beside the matrix. A warm line with no `freshness: live` marks the run, and the coordinator warms the daemon and reruns |
| Risk | A test that passes before the fix | High: it would prove nothing | The fake daemon answers whatever the switch says, so the flagged cases fail before the fix with one daemon call and an `sk-code` row, and the no-daemon case fails on a launcher lease or a local-scorer row |
| Risk | A daemon started under the switch by another command, such as `advisor_status`, carries it through the launcher allowlist and abstains for unflagged callers | Med for phase 026: an on-arm session after such a start would get no brief | Built: T017 drops both names from the launcher allowlist |
| Risk | The coordinator's own reproduction runs right after `BUILD`, while the fix is not yet in | High: a flagged first call would recycle the shared workspace daemon under the switch, every hook and Gate 2 call in the checkout would abstain, phase 026's lanes included, and the `on` lines would fail | `direct-call-matrix.sh` starts with an unflagged `advisor_status` call that recycles a stale daemon in a clean environment, and prints the lease before and after. T002 and T012 check that the two lease lines are equal. CP-003 step 1 starts the same way (T008) |
| Risk | The client and the handler drift on the envelope | Med: the off arm would see a different shape from the one the docs describe | Both call `disabledRecommendOutput`, so one function builds both. The handler's two existing disabled cases and the new module cases pin the fields |
| Risk | Phase 025's planned changelog scope names phases 019 to 024 only | Low: the release notes would miss this fix | Recorded as A9 for the coordinator to amend 025 before it runs |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- FILL: Name one measurable limit per line. Write `N/A` and one reason when the packet runs no service, or delete the whole section. GOOD: The option adds under 5 ms to a run. WEAK: Performance is good. -->
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: Under the switch the direct call opens no socket and spawns no process, so it returns without the cold-start wait of up to 5 seconds (`COLD_START_WAIT_MS`, `ADV/skill-advisor-cli.ts:35`) or the local scorer's 5 seconds.
- **NFR-P02**: The median wall time of five warm unflagged direct calls is recorded before and after the fix (T002, T012) for the reviewer, with no bound, because samples taken while phase 026's workers run cannot hold a tight one. The client now loads the schema module and `zod`, and NFR-R01 is the gate on what it loads.

### Security
- **NFR-S01**: No task reads, prints or logs a holdout prompt. `command-prompts.jsonl` and `holdout-prompts.jsonl` are opened only through `jq 'del(.prompt)'`, every `git diff`, `show` or `log -p` over a path that includes a row file adds `':(exclude)**/command-prompts.jsonl'` and `':(exclude)**/holdout-prompts.jsonl'`, and `capture-scorer-eval-baseline.mjs --misses` is piped through `jq 'del(.prompt)'`.
- **NFR-S02**: The disabled envelope carries no prompt text, as the handler's never did.

### Reliability
- **NFR-R01**: The client's runtime import closure gains the new module, the schema module and `zod`, and no native package (REQ-006).

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES
<!-- FILL: Name the empty input, the maximum input and the failure path. One line each. Write `N/A` with one reason, or delete the whole section. GOOD: Empty input: an empty `logs/archive/` deletes nothing and exits 0. Maximum: `--keep 3` over 10,000 archives keeps the newest 3. Failure path: a missing `--keep` value exits 2 with usage. WEAK: Handle edge cases. -->

- Empty input: a switch set to an empty string, `0` or `true` does not disable the direct call, the exact-`1` rule the handler already has. A module test row pins `true`.
- Maximum input: both names set print the `SYSTEM_` name in the reason, because the canonical name is checked first, as the handler's comment says.
- Failure path: under the switch the client answers before the daemon's input schema runs, so input the CLI manifest allows and the daemon's schema refuses, such as `"topK": 1.5`, gets the abstain envelope instead of an invalid-params error (the CLI cannot send a `workspaceRoot`, so the client always resolves its own), and `--warm-only` gets the abstain with exit 0 instead of the retryable exit 75. Neither returns a recommendation.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT
<!-- FILL: Score each row with the number the change earns. The total must match the level. Write `N/A` with one reason, or delete the whole section. GOOD: Scope 6/25: one option in `scripts/rotate-logs.sh`. Total 18/100. WEAK: Complexity is medium. -->

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 8/25 | Nine files, about 260 lines with tests, one new module |
| Risk | 9/25 | A user-facing switch, a shared output contract and a phase running beside it in one checkout |
| Research | 8/20 | Cause read in the client, the handler and the launcher, then confirmed by a nine-call matrix, a launcher run and an import-closure probe |
| **Total** | **25/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS
<!-- FILL: Write each open question as one line. Write `None` when nothing blocks. GOOD: Does a missing `--keep` value delete every archive? Decision: no, a missing value exits 2. WEAK: Edge cases are unclear. -->

None blocks planning. The planner could ask no one, so each point the dispatch left open is decided below and recorded as an assumption, open for the coordinator or the operator to overturn.

- A1. Level: `recommend-level.sh --loc 260 --files 9` printed Level 1. Decision: Level 2, because `acceptance-criteria.md` is the closure gate, as P001 and P025 decided for phases 020 to 027 and as the dispatch asked.
- A2. The plan ran without `:auto`. `AI_SESSION_CHILD` was unset, so the child-dispatch rule did not apply, and the dispatch said to decide and record instead of asking. Each checkpoint took its first option and step 7 took Skip. Step 5's four exploration agents were not dispatched, because this planner may dispatch none, and the same reads were done inline. No `research/research.md` was written and step 6 did not run `generate-context.js`, as in phases 024, 026 and 027. No `goal.md` was written: `sk-create-goal` owns that file, a child goal needs a binding row in the parent goal through `/create:goal <parent> phase-add`, and the parent goal is outside this write scope. The summary scaffold sits in `scratch/` until the close-out, as phase 027 did.
- A3. The shared module owns the workspace root and the thresholds of the disabled envelope as well as the list, so the client and the handler call one function and cannot drift. Its thresholds come from `lib/compat/contract.ts`, the source the handler's defaults resolve to through `lib/skill-advisor-brief.ts`. The handler keeps `publicThresholds` for its enabled path, and its disabled path now reads the contract at call time rather than at module load, which gives the same values unless a test changes the threshold variables after import.
- A4. The client checks exactly the handler's list, `SYSTEM_SKILL_ADVISOR_HOOK_DISABLED` and `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED`, each set to exactly `1`. `SYSTEM_SKILL_ADVISOR_DISABLED`, the canonical kill switch of the hook doc, `SYSTEM_HOOKS_DISABLED` and truthy values such as `true` silence the hooks through the shared resolver but leave the direct call answering, before and after this fix. The hook doc states it after T007.
- A5. The handler-to-client parity test the dispatch allowed is not written, because once both call `disabledRecommendOutput` the parity is by construction. The client cases assert the fields, and the reviewer checks the two call sites.
- A6. The launcher forwarded both switch names to a daemon it started (`system-skill-advisor-launcher.cjs:159-160`), and the client starts one both on a cold call and when it recycles a live daemon that predates the current build, so one flagged command could start a shared daemon that abstains for every later caller. The coordinator moved the fix into scope as T017: both names leave the launcher's child allowlist, because once the client decides per request the shared daemon has no reason to see a per-request switch.
- A7. The new client cases live in `tests/skill-advisor-cli-stale-daemon-retry.vitest.ts`, because it holds the suite's only fake advisor daemon. A new file would copy about 70 lines of that daemon.
- A8. The unflagged control case passes before the change as well as after it. It is a control for the flagged cases, and its task line says so.
- A9. Phase 025 plans the changelog entry for phases 019 to 024 (`../025-release-notes-and-doc-sync/spec.md`). This fix is user-facing and belongs in that entry. Phase 025 is outside this write scope, so the coordinator amends it before it runs.
- A10. Phase 027 is Complete and still names 026 as its successor. It is closed and outside this write scope, so the parent phase map and handoff rows carry the new order instead.
- A11. Workers are DeepSeek v4.1 flash max on OpenCode Go, one task per session, each checked by an Opus verifier before the next task in its lane, as the dispatch and the phase 020 to 027 instruction set.
<!-- /ANCHOR:questions -->

---

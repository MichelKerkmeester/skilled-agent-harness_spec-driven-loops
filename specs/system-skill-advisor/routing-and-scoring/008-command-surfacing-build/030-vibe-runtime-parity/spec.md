---
title: "Feature Specification: Phase 30: vibe-runtime-parity"
description: "Mistral Vibe came in from main with the advisor brief, the spec gate and the session hooks, but the command-surfacing packet's own surfaces still skip it: the transcript scorer cannot score a Vibe session, the behaviour runner calls it an unknown runtime, the doctor checks neither its prompt hook nor its mirrors, a Vibe model has no path from a brief's command to its document, and Vibe policy observations are labelled Claude Code. This phase gives each of those surfaces Vibe support and proves the real brief on Vibe with a test."
trigger_phrases:
  - "vibe runtime parity"
  - "phase 30 vibe runtime parity"
  - "mistral vibe chat automation"
  - "vibe transcript scorer tool table"
  - "vibe command document pointer"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 30: vibe-runtime-parity

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
| **Phase** | 30 of 30 |
| **Predecessor** | 029-direct-call-kill-switch |
| **Successor** | None |
| **Handoff Criteria** | Every task in `tasks.md` is `[x]`, every suite reports 0 failed, the floor and eval lines equal their before lines, `scratch/repro-after.txt` shows each gap line changed as SC-001 states, the fix is committed, the Opus review reports no open P0 or P1, `scratch/handback.md` lists every handed-back gap with its evidence and strict validation prints `RESULT: PASSED` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 30** of the build that makes the skill advisor surface every tracked slash command with a run, start or ask policy on every supported CLI (`../spec.md`). The catch-up merge `e58d450985c` brought in Mistral Vibe from main as a full runtime: a `.vibe/` tree, a turn-start hook that delivers the advisor brief, the spec gate, the session hooks and a session journal reader. On 2026-11-15 the operator asked to make all chat automation work on it and chose a new 008 phase for the work (`../decision-record.md`, Q066 and Q067). A read-only analysis listed twelve gaps. This phase builds the six that sit on this packet's own surfaces and hands the rest back.

**Scope Boundary**: the transcript scorer, the behaviour runner, the doctor's hook-wiring check and runtime-mirrors route, the Vibe prompt-advisor hook, one line of the shared advisor handler, their tests, one new test file and three reference documents. The shared session readers, the Vibe hooks under `.skilled/hooks/`, `.vibe/`, the 004 Vibe packet, `AGENTS.md` and every committed baseline stay as they are. The goal's six-runtime behaviour criterion is unchanged: this phase adds tool support and a hook proof, not a Vibe start rate.

**Dependencies**:
- Phase 029 is Complete and committed, and the catch-up merge `e58d450985c` is in (T001 checks both).
- No live model session runs: goal decision D5 keeps live runs in an arena with credentials off, and the operator stopped the behaviour arms.
- Main keeps moving and a final catch-up merge follows, so the file set stays narrow and every handed-back gap is one main's own Vibe work owns.

**Deliverables**:
- A transcript scorer that scores a Vibe session from its recorded tool calls, tested against the committed Vibe reader fixture.
- A behaviour runner that names Vibe as not measured, with its reason.
- A doctor hook-wiring check with a Vibe row and a runtime-mirrors route with the three Vibe mirror checks.
- A Vibe brief whose command lines carry the path of each command's document.
- Policy observations labelled with the runtime that emitted them.
- A test that runs the Vibe prompt-advisor hook with the real advisor and pins the command, the policy word, the `Also:` line and the document line.
- `scratch/handback.md` for the five gaps this phase does not build.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE
<!-- FILL: State the problem in two sentences: what breaks, and for whom. GOOD: The rotate-logs script never deletes old archives, so a host that copies `logs/archive` fills its disk. WEAK: The script has issues with output. -->

### Problem Statement
A Vibe user already gets the advisor brief, but the measures and checks this packet built read Vibe as if it were not there. The scorer leaves every Vibe run unscored as `unscorable_runtime`, the runner refuses `vibe` as an unknown runtime, the doctor reports neither a missing Vibe prompt hook nor a stale Vibe mirror, a Vibe model that reads `/doctor:setup` in its brief finds only `.vibe/prompts/doctor-setup.md` headed `/doctor-setup` and has no loader to run it, and every Vibe, Pi and DSH policy observation is recorded under the label `Claude Code`.

### Purpose
Each of the packet's own surfaces treats Vibe as a runtime it knows: the scorer reads its tool calls, the runner names why it does not run it, the doctor checks its hook and its mirrors, its brief points at each command's document, and its observations carry its own label, all proven by tests that run the shipped code.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
<!-- FILL: Run the command this change affects and paste the command and its verbatim output. Quote every number the spec states about current behavior from this block. Write `N/A:` and a reason when no command applies. GOOD: `bash scripts/rotate-logs.sh` with 10 archives, then `ls logs/archive | wc -l` prints 10. WEAK: The script deletes old logs. -->
```text
# 2026-11-15, worktree HEAD e58d450985c, run from the repository root. PH is this phase folder.
# The matrix prints one line per gap this phase builds. The brief and label lines run under an
# isolated advisor scope in a temporary folder under $TMPDIR, which the probe removes.

$ zsh $PH/scratch/planning/vibe-parity-matrix.sh
G1 scorer      {"scored":0,"unscoredRuns":[{"rowId":"cmd-create-agent-plain-tune-01","reason":"unscorable_runtime"}]}
G2 runner      exit=2 run-command-behaviour.mjs: unknown runtime: vibe
G3 wiring      ["claude:ok","codex:ok","cursor:ok","devin:ok"]
G5 mirrors     workflow-lines=0 route-lines=0
G6 brief 1     Advisor: live; use sk-doc → /create:readme (start) 0.94/0.12 pass.
G6 brief 2     Advisor: live; use sk-git 0.82/0.16 pass.
G6 brief 2     Also: /doctor:git setup (run)
G6 brief 3     Advisor: no skill matched. For setup or health checks, run /doctor:setup.
G11 label      lifecycle=startup runtime=claude records=2 labels=["Claude Code"]
G11 label      lifecycle=startup runtime=pi records=2 labels=["Claude Code"]
G11 label      lifecycle=startup runtime=dsh records=2 labels=["Claude Code"]
G11 label      lifecycle=startup runtime=vibe records=2 labels=["Claude Code"]

$ node $PH/scratch/planning/vibe-scorer-probe.mjs $PWD
loadSession ok=true records=2 blocks=[["user",["text"]],["assistant",["text"]]] entriesReturned=false
loadVibeSession entries=10 toolEffects=[["file_system.write_file",["content","path"]]]
normalize vibe: normalize: no tool table for runtime vibe

$ node $PH/scratch/planning/vibe-tool-names.mjs <reader fixture journal> <018 journal> <009 journal>
.skilled/hooks/shared/tests/session-readers/fixtures/vibe/scratch-cwd/journal/0000000000000001.jsonl
  1 file_system.write_file {content,path}
V/018-vibe-compaction-context/scratch/forced-compaction/session/journal/0000000000000001.jsonl
  1 file_system.read_file {path}
V/009-deep-loop-executor-kind/research/keyed-lineage-run/lineages/vibe-1/vibe-output/session/journal/0000000000000001.jsonl
  59 file_system.bash {command,timeout_seconds}
  3 vibe.todo {action,todos}
  6 file_system.write_file {content,path}
# V is specs/cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation.

$ grep -o '"builtin:[a-z_.]*"' V/011-vibe-context-and-goal-hooks/scratch/first-turn/session/generations/0000000000000001/runtime-state.json | sort -u
"builtin:agents_md" "builtin:file_system.bash" "builtin:file_system.edit" "builtin:file_system.read_file"
"builtin:file_system.write_file" "builtin:process.list" "builtin:process.output" "builtin:process.start"
"builtin:process.stop" "builtin:process.write" "builtin:session_start_context" "builtin:skill.read"

$ head -3 .vibe/prompts/doctor-setup.md
<!-- Generated by sync-prompts-vibe.cjs from .skilled/commands/doctor/setup.md. -->
# Mistral Vibe prompt: /doctor-setup

$ readlink .opencode/commands/doctor; cmp .opencode/commands/doctor/setup.md .skilled/commands/doctor/setup.md && echo same
../../.skilled/commands/doctor
same

$ node .skilled/commands/doctor/scripts/agents-md-manifest.cjs --check
[agents-md-manifest] PASS: 44 sections, 31 pins, derived matches AGENTS.md
[agents-md-manifest] Budget: 16250 / 16384 bytes to the last anchor, 27750 / 32768 bytes total, 24 history bodies

$ T=$(mktemp -d); for k in prompts agents skills; do K=${(U)k}; env VIBE_${K}_OUTPUT_DIR=$T/.vibe/$k node .skilled/skills/system-spec-kit/runtime/cli/vibe/sync-$k-vibe.cjs --check 2>&1 | rg 'FAIL:'; echo "exit ${pipestatus[1]}"; done; ls -A $T; echo "ls done"
[vibe-prompt-sync] FAIL: 45 drift item(s); run without --check to regenerate
exit 1
[vibe-agent-sync] FAIL: 11 drift item(s); run without --check to regenerate
exit 1
[vibe-skill-sync] FAIL: 55 drift item(s); run without --check to regenerate
exit 1
ls done

$ for s in prompts agents skills; do node .skilled/skills/system-spec-kit/runtime/cli/vibe/sync-$s-vibe.cjs --check | tail -1; done
[vibe-prompt-sync] PASS: 45 prompt stubs are in sync.
[vibe-agent-sync] PASS: 11 agent profiles are in sync.
[vibe-skill-sync] PASS: 55 skill links are in sync.

$ rg -n "getPolicyObservationRecords|deliveryEvidenceFromObservation|observationBindsToCell" .skilled --glob '!**/dist/**' --glob '!**/node_modules/**' | rg -v '/tests/|policy-plan\.ts'; echo "exit $?"
exit 1

$ node --test <the seven Vibe hook suites of VT> 2>&1 | rg '^ℹ (tests|pass|fail) '
ℹ tests 52
ℹ pass 52
ℹ fail 0
$ node --test <the three Vibe sync suites and four repo-guard suites of VT> 2>&1 | rg '^ℹ (tests|pass|fail) '
ℹ tests 27
ℹ pass 27
ℹ fail 0

$ FLOOR; EVAL    # the two capture commands tasks.md names
{"correct":24,"total":44}
{"count":0,"total":35}
{"own":2,"attached":0,"combined":2,"total":44}
[160,49,21,5]
```
<!-- /ANCHOR:measured-behavior -->

Each gap line holds today. The scorer gives the one Vibe run in the log no score, the runner exits 2 calling `vibe` unknown, the wiring check lists four runtimes and no Vibe, and the mirrors route names no Vibe check. The Vibe brief names `/create:readme`, `/doctor:git setup` and `/doctor:setup` with no word on where their documents are, while the only Vibe copy, `.vibe/prompts/doctor-setup.md`, is headed `/doctor-setup`. All four runtimes record their observations as `Claude Code` once a startup event gives the session an epoch. Without one, `records=0` for every runtime, which is why production calls record nothing.

The scorer probe shows why a tool table alone would not be enough. The shared loader returns only the two text records, and the one tool call the fixture session made, a `file_system.write_file`, is reachable only through the Vibe reader's `entries`, which the shared loader drops. Every Vibe tool name above is namespaced. The analysis's `read_file`, `write_file`, `bash` and `process_start` match no recorded call. The plain holdout floor reads `combined 2` and the eval holdout reads `49`, where phase 029 recorded 1 and 51. That move came in with the merge of main and is main's change (Q065), so T001 records these lines as this phase's baseline.

### Mechanism per Path

`ADV` is `.skilled/skills/system-skill-advisor/runtime`, `RAD` is `ADV/scripts/routing-accuracy`, `SAD` is `.skilled/skills/system-skill-advisor` and `DS` is `.skilled/commands/doctor/scripts`.

| Gap | Where it comes from | Decision |
|-----|---------------------|----------|
| G1 scorer | `scoreRun` reads `loadSession(...)` and passes `loaded.records` to `normalize` (`RAD/score-command-transcripts.mjs:1577-1586`). `normalize` throws through `tableFor` when `TOOL_TABLES` (`:166-203`) has no row for the runtime, and the catch files the run as `unscorable_runtime`. The Vibe reader builds `records` from message entries only (`.skilled/hooks/shared/session-readers/vibe.mjs:294-319`) and returns tool effects in `entries` (`:389`), which `loadSession` does not pass on (`.skilled/hooks/shared/session-readers/index.mjs:140-155`) | Fix in the scorer only. A Vibe run is loaded a second time through `loadVibeSession` and its entries become records in projection order, each tool effect a `toolCall` block. A Vibe row holds the recorded names (D1 and D2 in `plan.md`, T003) |
| G2 runner | `resolveRuntime` returns a `RUNTIMES` entry, throws `not measured` for a `NOT_MEASURED` key and `unknown runtime` otherwise (`RAD/run-command-behaviour.mjs:93-95`, `:1102-1110`) | Add a `NOT_MEASURED` row for `vibe` and no `RUNTIMES` entry (D3, T004) |
| G3 doctor wiring | `RUNTIMES` lists claude, codex, cursor and devin (`DS/hook-wiring-check.cjs:39-68`), and `inspect` reads each file with `JSON.parse` (`:310-321`). The Vibe prompt hook is the `turn-start` block, `type = "pre_agent"`, whose command runs `.skilled/hooks/session-lifecycle/vibe/turn-start.mjs` (`.vibe/hooks.toml:15-20`), which imports `buildAdvisorPart` (`turn-start.mjs:27`) | Add a Vibe row read line by line, with no TOML package (D4, T005) |
| G5 doctor mirrors | `upstream_assets`, the execution steps and the output block name no Vibe script (`.skilled/commands/doctor/assets/doctor-runtime-mirrors.yaml:33-46`, `:143-157`, `:162-193`), nor do the route's `script_invocations` (`.skilled/commands/doctor/_routes.yaml:251-272`). The contract test checks only the DSH rows (`DS/tests/doctor-runtime-mirrors-contract.test.cjs:48-68`) | Add the three Vibe rows in the DSH shape, with an n/a rule while `.vibe/` is absent (D5, T006) |
| G6 command documents | The brief names a command in its colon form. Vibe has no command loader and no prompt tool (`cli-mistral-vibe/manual-testing-playbook/hook-scenarios/prompts-mirror-conversation.md:15`), and its stub names the dash form. `AGENTS.md:288` points at `.opencode/commands/`, a link to `.skilled/commands/`, but says nothing of how a colon name maps to a path | The Vibe prompt-advisor hook adds one line naming each command's document under `.skilled/commands/` (D6, T009) |
| G11 policy label | `handleClaudeUserPromptSubmit` resolves `runtime` from its dependency or `SPECKIT_RUNTIME` (`SAD/hooks/claude/user-prompt-submit.ts:293-295`) and then passes the literal `'Claude Code'` to `observeEmittedAdvisorPolicy` (`:444-448`). The binding is kept in an in-process sink that only tests read | The handler passes its resolved runtime for every caller but Claude (D7, T007) |
| Proof | `SAD/hooks/vibe/prompt-advisor.mjs:141-147` calls the compiled handler under the label `vibe`. `turn-start.test.mjs` stubs the advisor, so no test renders the real brief on Vibe | A new test runs the hook with the real advisor under an isolated scope (D8, T008) |

---

<!-- ANCHOR:scope -->
## 3. SCOPE
<!-- FILL: List three to five things this change does, each starting with a verb. Before you list a new file, module, option, layer or dependency, name what fails today without it, or drop it. GOOD: Add a `--keep <n>` option that deletes all but the newest n archives in `logs/archive/`. WEAK: Update the script and docs. -->

### In Scope
- Score a Vibe session from its recorded tool calls, with a Vibe tool table taken from recorded journals.
- Name Vibe as not measured in the behaviour runner, and add a Vibe row to the doctor's hook-wiring check and the three Vibe mirror checks to `/doctor:runtime-mirrors`.
- Add the document path of each command a Vibe brief names, and label each policy observation with the runtime that emitted it.
- Prove the real Vibe brief with a test, correct three reference documents, and write `scratch/handback.md` for the gaps handed back.

Restraint pass. Building nothing fails: every line of the matrix above shows the gap. A Vibe table alone fails, because `normalize` would then score a session that wrote a file as one that touched nothing. Editing the shared Vibe reader to put tool calls into `records` fails differently: `readSession` projects those records for history lookup, which the reader's own comment keeps free of unpaired calls, and main still edits that reader. A TOML package fails goal decision D2, which forbids installs. A line in `AGENTS.md` has 134 bytes of room and would reach every runtime for a gap only Vibe has. The one new file is the proof test, which no current file can hold: the CLI suites own their scope helpers, and the hook's only test stubs the advisor.

### Out of Scope
Each item below is written into `scratch/handback.md` with its evidence, for the coordinator to give the operator. Main's Vibe packet and the hook docs main still changes own them.
- **G7 goal binding and resend.** The goal slice reaches a Vibe session only at session start and after a compaction, and only from `VIBE_SPEC_FOLDER`, which only the dispatch command sets (`cli-mistral-vibe/SKILL.md:72`). An interactive session gets no slice, and nothing resends one that changed. 004 phase 011 put per-turn resend out of scope (`011-vibe-context-and-goal-hooks/spec.md:101`), and phase 019 records the binding open (`019-vibe-relaunch-command-tier/scratch/manual-hop.md:53-58`).
- **G9 git-preflight advisory.** `cli-mistral-vibe/references/guards-and-hooks.md:139` gives one reason it was not ported, that no tool hook can inject an advisory. Vibe `post_tool` hooks do add context: `compaction-post-tool.mjs:58`, `post-edit-quality.mjs:36` and `dist-freshness.mjs:112` each print `hook_specific_output.additional_context`, and the forced-compaction run saw the next `post_tool_call` result carry it (`018-vibe-compaction-context/implementation-summary.md:30`, `:127`). The ask-capture `post_tool` hook prints nothing by design. `.vibe/plugins/README.md:66` gives the other reason, that sk-git's docs state the same rules.
- **G12 doc drift.** `.skilled/hooks/README.md:30` and `:36` leave Vibe out of the handover runtimes, and the git concern rows at `:351-359` name no Vibe entry. `.skilled/hooks/goal/vibe/README.md:21` says nothing re-injects the goal after compaction, which 004 phase 018 now does. `.vibe/SYNC.md:71` says turn-start has one part today. The 004 phase table lists phases 017 to 022 as Pending (`004 spec.md:136-141`), and 004 phase 015 still lists F001 as blocked (`015 tasks.md:75`).
- **G8 automatic hop, context nudge and stop arm.** Deferred by decision in 004 (`spec.md:138`) and in the relaunch packet's phase 043 (`specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/043-vibe-handover-flag-and-live-hop/spec.md:98`).
- **G10 an unchanged head is dropped.** By design and documented (`SAD/hooks/skill-advisor-hook.md:95`): Vibe keeps added context in the conversation, so a repeat adds nothing.
- **Found here, not built.** The strict guards in `.vibe/hooks.toml` match `process_start`, while the tool registry names `builtin:process.start` (Measured Behavior). No recorded call shows which name the matcher receives. A Vibe shell started through `process.start` may pass the spec gate, the env guard, the dispatch preflight, the overlay guard and the message gate unchecked. This needs a recorded `process.start` call before anyone changes a matcher.
- **The missing doctor wiring rows for Pi, DSH and OpenCode.** They load their prompt hook through extensions and plugins, not a JSON or TOML hook file. They are a known limit of the check, named in the doctor README, and not fixed here.
- **A Vibe arm, a Vibe live run or a Vibe start rate.** Goal decision D5 and the operator's stop of the behaviour arms rule them out.
- **The advisor changelog entry.** Whether this phase joins the open entry `v1.1.0.0` is the coordinator's call after close, as it was for phase 029.

### Files to Change

`ADV`, `RAD`, `SAD` and `DS` are as in the mechanism table.

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `RAD/score-command-transcripts.mjs` | Modify | A Vibe tool table, and Vibe records built from the Vibe reader's entries in `scoreRun` |
| `ADV/tests/command-transcript-score.vitest.ts` | Modify | A Vibe row in the normalize table, a fixture case and a summary case |
| `RAD/run-command-behaviour.mjs` | Modify | A `NOT_MEASURED` row for `vibe` |
| `ADV/tests/command-behaviour-guards.vitest.ts` | Modify | A `--print-argv vibe` case |
| `DS/hook-wiring-check.cjs` | Modify | A Vibe row and a line-based reader for `.vibe/hooks.toml` |
| `DS/tests/hook-wiring-check.test.cjs` | Modify | Vibe cases, and the skipped list grows to five |
| `.skilled/commands/doctor/assets/doctor-runtime-mirrors.yaml` | Modify | Three Vibe assets, steps and repair lines, and the purpose line |
| `.skilled/commands/doctor/_routes.yaml` | Modify | Three Vibe `--check` invocations on the runtime-mirrors route |
| `DS/tests/doctor-runtime-mirrors-contract.test.cjs` | Modify | The Vibe checks join the mirror checks |
| `SAD/hooks/claude/user-prompt-submit.ts` | Modify | The observation label is the resolved runtime for every caller but Claude |
| `ADV/tests/hooks/claude-user-prompt-submit-hook.vitest.ts` | Modify | A label case per runtime |
| `SAD/hooks/vibe/prompt-advisor.mjs` | Modify | The command document line |
| `ADV/tests/hooks/vibe-prompt-advisor.vitest.ts` | Create | Unit cases for the document line and the real-advisor proof |
| `RAD/README.md` | Modify | The scorer reads Vibe and the runner names it not measured |
| `DS/README.markdown` | Modify | The wiring check reads `.vibe/hooks.toml` and names its limit |
| `SAD/hooks/skill-advisor-hook.md` | Modify | The Vibe row names the document line |

No other file outside this phase folder changes. `scratch/handback.md` and the planning probes sit in this folder.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
<!-- FILL: Write one testable requirement per row. Name the exact command or output. GOOD: With 10 archives, `bash scripts/rotate-logs.sh --keep 3` exits 0 and `ls logs/archive | wc -l` prints 3. WEAK: The option should work well. -->
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | A run log line with `runtime` `vibe` whose locator names the committed reader fixture `scratch-cwd` is scored: the summary's `vibe.pre` block prints `scored` 1 and `unscoredRuns` `[]`, and the fixture's Vibe records normalize to one `write` event whose path ends in `/proof.txt`. |
| REQ-002 | The Vibe tool table holds only names a committed journal or the recorded tool registry shows: read `file_system.read_file`, write `file_system.write_file` and `file_system.edit`, shell `file_system.bash`, and no skill name. No other runtime's table changes, and the shared session readers and their dispatcher show no diff. |
| REQ-003 | `node RAD/run-command-behaviour.mjs --print-argv vibe` exits 2 and its stderr holds `runtime vibe is not measured:` with a reason, never `unknown runtime`. `RUNTIMES` gains no Vibe entry, and the reason names no id and does not call the Vibe reader gated. |
| REQ-004 | `node DS/hook-wiring-check.cjs --root .` prints `ok vibe` on this checkout. A `.vibe/hooks.toml` whose `turn-start` command sits under `post_agent`, is commented out or is only named in a `name` value prints `hook-missing vibe .vibe/hooks.toml`, a checkout without `.vibe/` reports Vibe `skipped`, and the check adds no package. |
| REQ-005 | The runtime-mirrors workflow and route carry the three Vibe `--check` rows, each with an n/a rule while `.vibe/` is absent and a generator repair line, and the contract test checks them as it checks the DSH rows. `route-validate.sh` and `derive-command-bridges.cjs --check` pass. |
| REQ-006 | On Vibe, a brief whose head names a command carries one line naming each such command's document under `.skilled/commands/`, placed before the directive block, and a head with no command carries none. Every command in `commandPolicies` of the generated bridges maps to a file that exists, and `AGENTS.md` shows no diff. |
| REQ-007 | A test runs the Vibe prompt-advisor hook with the real advisor under an isolated scope and asserts that the head for `write a readme for the utils folder` holds `→ /create:readme (start)`, the head for `Check my git hooks setup` holds `Also: /doctor:git setup (run)` and the setup prompt's head holds `run /doctor:setup`, each with its document line. |
| REQ-008 | The floor lines and the eval line equal their before lines, `BUILD` and `TC` exit 0, `VALL` reports 0 failed with more passed than its before line, and `DT`, `VT`, `MIRRORS`, `VMIR`, `DRV` and `RV` pass. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-009 | A policy observation the handler records under a startup event carries the label `Claude Code` for Claude and the resolved runtime for every other caller, so Pi, DSH and Vibe read `pi`, `dsh` and `vibe`. |
| REQ-010 | The three documents state the shipped behaviour: the scorer reads Vibe tool calls and the runner names Vibe not measured (`RAD/README.md`), the wiring check reads `.vibe/hooks.toml` and names Pi, DSH and OpenCode as unchecked (`DS/README.markdown`), and the Vibe row names the document line (`SAD/hooks/skill-advisor-hook.md`). |
| REQ-011 | No code comment added by this phase names a spec path, a phase, a task, a finding or a decision id. The phase diff touches no `AGENTS.md`, no file on the dispatch's do-not-touch list, no package file, no row file, no committed baseline and no file outside `FILES` and this folder. |
| REQ-012 | One Opus reviewer reads the fix diff and reports 0 P0 and 0 P1, or each P0 and P1 it reports becomes a task that is fixed, committed and rechecked before the close-out. |
| REQ-013 | `scratch/handback.md` lists G7, G8, G9, G10 and G12, the `process_start` matcher and the Pi, DSH and OpenCode wiring limit, each with its file and line evidence and the owner it goes to. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA
<!-- FILL: Write one measurable outcome per line. A command can prove it. GOOD: With 10 archives in `logs/archive`, `bash scripts/rotate-logs.sh --keep 3` leaves 3. WEAK: The feature is successful. -->

- **SC-001**: `zsh $PH/scratch/planning/vibe-parity-matrix.sh` prints `"scored":1` and `"unscoredRuns":[]` on its G1 line, `runtime vibe is not measured:` on its G2 line, `vibe:ok` on its G3 line, `workflow-lines=9 route-lines=3` on its G5 line, a document line under each G6 head, and `labels=["pi"]`, `["dsh"]` and `["vibe"]` on the three non-Claude G11 lines, where the Measured Behavior block shows the gap on each.
- **SC-002**: `env -u AI_SESSION_CHILD npx vitest run tests/hooks/vibe-prompt-advisor.vitest.ts` in `ADV` reports 0 failed, with the real-advisor cases among the passed.
- **SC-003**: The floor and eval after files equal their before files under `cmp`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES
<!-- FILL: Name one dependency and one risk. Give each a concrete mitigation. GOOD: A script that reads `--keep` with no value could delete every archive. Mitigation: reject a missing value with exit 2 and test it. WEAK: There may be some risk. -->

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Main keeps changing the Vibe hooks and their docs, and a final catch-up merge follows | A wide file set conflicts on that merge | The phase edits sixteen files, none under `.skilled/hooks/` or `.vibe/`, and hands every Vibe-owned gap back (`scratch/handback.md`) |
| Risk | A Vibe table with no adapter scores a session that wrote as one that touched nothing | High: a future Vibe arm would read clean behaviour it never saw | REQ-001 fails on exactly that: the fixture's write must reach `normalize` (T003) |
| Risk | The Vibe tool names are a guess | Med: a wrong name drops every read or shell step | Every name comes from a committed journal or the recorded registry (Measured Behavior), and `process.start` and `skill.read`, with no recorded call, stay out and are named in D2 |
| Risk | The document line changes the head the Vibe receipt compares | Med: a repeated brief would stop being dropped | The line is added before `reduceRepeatedHead` and is a pure function of the head, so equal heads stay equal (T009 tests it) |
| Risk | The proof test leaks a daemon, a socket or a receipt, or passes for the wrong reason | Med: a later suite inherits state, or an `AI_SESSION_CHILD` left set makes the hook return nothing | The test runs in `createIsolatedCliScope` with its own receipt folder, deletes `AI_SESSION_CHILD`, cleans up with `cleanupSkillAdvisorScope` and asserts a non-empty head first (T008) |
| Risk | The proof depends on the scorer's answer to three prompts | Low: a later scorer change could move a head | The prompts come from published docs (`SAD/changelog/v0.16.0.0.md:25` for the git one), the assertions use the command, policy and `Also:` substrings only, and the floors pin the scorer |
| Risk | The relabel changes a value a reader binds to | Low | No production code reads the sink (Measured Behavior, the `rg` that exits 1), and no data file names `"Claude Code"` (`rg -n '"Claude Code"' .skilled --glob '*.json'` exits 1) |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- FILL: Name one measurable limit per line. Write `N/A` and one reason when the packet runs no service, or delete the whole section. GOOD: The option adds under 5 ms to a run. WEAK: Performance is good. -->
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: The document line costs one `existsSync` per command named in a head and adds no process and no socket to the Vibe turn.
- **NFR-P02**: The second read of a Vibe session happens only for a `vibe` run line, so no other runtime's scoring time changes.

### Security
- **NFR-S01**: No task reads, prints or logs a holdout prompt. `command-prompts.jsonl`, `holdout-prompts.jsonl` and `behaviour-fresh-prompts.jsonl` are opened only through `jq 'del(.prompt)'`, and every `git diff`, `show` or `log -p` over a path that includes a row file excludes them.
- **NFR-S02**: The proof test and the probes read no real flags file, socket or receipt: each runs in its own temporary scope, and none prints a session store's prompt text.

### Reliability
- **NFR-R01**: The document line fails open. A missing document, a name with no file or a thrown error adds nothing, and the brief is delivered as before.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES
<!-- FILL: Name the empty input, the maximum input and the failure path. One line each. Write `N/A` with one reason, or delete the whole section. GOOD: Empty input: an empty `logs/archive/` deletes nothing and exits 0. Maximum: `--keep 3` over 10,000 archives keeps the newest 3. Failure path: a missing `--keep` value exits 2 with usage. WEAK: Handle edge cases. -->

- Empty input: a Vibe session with no tool effect scores from its text alone, a head with no command gets no document line, and a `.vibe/hooks.toml` with no `[[hooks]]` block reports `hook-missing vibe`.
- Maximum input: an ambiguous head that names two commands, or a head with an `Also:` line, gets one document line that lists each command once, in head order.
- Failure path: a Vibe reader refusal keeps its own code in `unscoredRuns`, as every runtime does. An unreadable `.vibe/hooks.toml` reports `hook-missing`. A command whose document is gone is left out of the document line.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT
<!-- FILL: Score each row with the number the change earns. The total must match the level. Write `N/A` with one reason, or delete the whole section. GOOD: Scope 6/25: one option in `scripts/rotate-logs.sh`. Total 18/100. WEAK: Complexity is medium. -->

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | Sixteen files, one new, about 450 lines with tests, across the scorer, the runner, two doctor surfaces, the Vibe hook and the shared handler |
| Risk | 8/25 | Every surface is a measure, a check or one added brief line, and each is pinned by a test that fails first. The handler change touches only an in-process label |
| Research | 9/20 | Twelve gap claims re-read in the code, three corrected (the tool names, the reader's records and the G9 source) and one line number moved (G8), and a matrix that prints every built gap |
| **Total** | **29/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS
<!-- FILL: Write each open question as one line. Write `None` when nothing blocks. GOOD: Does a missing `--keep` value delete every archive? Decision: no, a missing value exits 2. WEAK: Edge cases are unclear. -->

None blocks planning. The planner could ask no one, so each point the dispatch left open is decided below and recorded as an assumption, open for the coordinator or the operator to overturn.

- A1. Level: `recommend-level.sh --loc 450 --files 16` printed Level 1, score 44. Decision: Level 2, because `acceptance-criteria.md` is the closure gate, as P001 decided for phases 020 to 029 and as the dispatch asked.
- A2. The plan ran under `/speckit:plan :auto` with the setup bound by the dispatch: this folder, Level 2, execution mode auto, no relationships. Confirm checkpoints were skipped, as `:auto` skips them. Step 5's four exploration agents were not dispatched, because this planner may dispatch none, and the same reads were done inline. Step 6 did not run `generate-context.js`, and no child `goal.md` was written, as in phases 024 to 029: the dispatch's finish step replaces the save, and P039 binds a phase's own goal without a binding row. The summary scaffold sits in `scratch/` until the close-out.
- A3. The analysis is one agent's reading. Every claim this plan builds on was re-read, and the Measured Behavior block or the mechanism table carries what was seen. Three claims were wrong: the Vibe tool names are namespaced, the Vibe reader keeps tool calls out of the records the scorer reads, and the G9 sentence about tool hooks sits in `guards-and-hooks.md:139` and not in `.vibe/plugins/README.md:66`. One line number moved: the G8 decision row in 004's `spec.md` is line 138, not 143.
- A4. The "six runtime mirror checks" of the dispatch are read as the eight check-only generators the runtime-mirrors route runs for the six runtimes with mirrors: `sync-runtime-mirrors.cjs` for Claude, Cursor and Devin, two for Codex, two for Pi and three for DSH. `MIRRORS` in `tasks.md` names all eight, and `VMIR` names the three Vibe checks.
- A5. The Vibe node suites are fourteen files, 79 tests at planning: the seven Vibe hook suites (52), the three Vibe sync suites and the four repo-guard suites (27). The analysis counted 59. `VT` in `tasks.md` names every file.
- A6. G11 is fixed for every non-Claude caller, not only Pi, DSH and Vibe. Codex, Cursor and Devin reach the same line through `SPECKIT_RUNTIME` and carry the same wrong label, no production code reads it, and one expression fixes all six (D7 in `plan.md`).
- A7. Workers are DeepSeek v4.1 flash max on OpenCode Go, one task per session, each checked by an Opus verifier before the next task in its lane, as the dispatch and phases 020 to 029 set.
<!-- /ANCHOR:questions -->

---

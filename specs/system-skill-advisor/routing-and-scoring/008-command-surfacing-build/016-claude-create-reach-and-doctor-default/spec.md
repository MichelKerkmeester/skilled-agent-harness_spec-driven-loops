---
title: "Feature Specification: Phase 16: claude-create-reach-and-doctor-default"
description: "Claude Code lists 32 of the 44 tracked commands, because a command file named skill.md makes it read the create folder as one skill. This phase renames /create:skill to /create:sk-skill on every runtime with no alias, offers /doctor:helper on a doctor prompt that says a tool is not showing up, shows the AGENTS.md Gate 2 call with the request on stdin, adds intent phrases to five no-recommendation commands and keeps the brief-cost run out of the shared health log."
trigger_phrases:
  - "claude create reach and doctor default"
  - "phase 16 claude create reach and doctor default"
  - "rename create skill to create sk-skill"
  - "doctor helper for a tool that is not showing up"
  - "gate 2 direct call on stdin"
  - "command intent phrases for doctor install setup speckit update"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 16: claude-create-reach-and-doctor-default

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-13 |
| **Branch** | `worktrees/352-command-surfacing-research` |
| **Parent Spec** | ../spec.md |
| **Phase** | 16 of 18 |
| **Predecessor** | 015-health-default-and-brief-refinements |
| **Successor** | 017-review-pass-two-remediation |
| **Handoff Criteria** | The old-name scan lists only the nine kept history files and the new changelog entry, which must name the old command to record the break, the mirror check prints `visibility claude 44/44`, the recaptured baseline holds every floor with typed delivery 44 of 44, the real capture after lane D reads holdout at least 2 above the capture before it, `AGENTS.md` line 65 shows the stdin form and every check in the verification phase passes |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 16** of the build that makes the skill advisor surface every tracked slash command with a run, start or ask policy on every supported CLI (`../spec.md`). It builds what the operator decided on 2026-11-13 (`../goal.md` and the coordinator's relay): rank 7 of `../009-ux-performance-cross-cli-research/research/research-segment-3.md` as a rename, rank 13 with the narrow cue, review finding `R4-P2-003` (`../review/review-report.md`) and ranks 1 and 2 of `../009-ux-performance-cross-cli-research/research/research-segment-4.md`.

**Scope Boundary**: The rename of `/create:skill` to `/create:sk-skill` in every live file outside `specs/`, the mirror check that counts Claude's commands, the doctor problem cue, `AGENTS.md` line 65 with its two derived copies, the intent phrases of five commands and the child environment of the brief-cost script. Generated files change only through their generators. No scorer weight, hub routing logic or renderer changes. `/create:skill-parent`, the `sk-create-skill` mode and its folder, the `.claude/skills` link, every file under `specs/`, every published changelog entry, the dated benchmark reports and the served copy of the sk-doc canary fixture keep the old text.

**Dependencies**:
- Phase 015 is committed (`3b48f0e5f1`). This phase edits none of its files except `measure-brief-cost.mjs`, its test and the routing-accuracy README, which phase 015 last touched.
- The operator answered Q1 and Q2 on 2026-11-13. Q3, the changelog version, was answered on 2026-11-13 after planning: a new `sk-doc` entry at `v2.10.0.0`.
- Ollama answers on `127.0.0.1:11434` for the two real captures and the re-embeds. No task starts it.

**Deliverables**:
- `/create:sk-skill` on every runtime, matching `/doctor:sk-skill`, with no alias for the old name, so no command file is named `skill.md` and Claude lists all 44 tracked commands.
- A mirror check with no allowlist that fails on a command file named `skill.md` in any capitalisation.
- `/doctor:helper` named beside the skills on a prompt that says a tool is not showing up.
- The Gate 2 direct call shown with the request on stdin in `AGENTS.md`, its manifest and the Cursor rule.
- Intent phrases for `/doctor:install`, `/doctor:setup`, `/doctor:speckit`, `/doctor:update` and `/speckit:search`, re-embedded and measured on holdout as a count.
- A brief-cost run that writes its hook's health records inside its own sandbox.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Claude Code shows 32 of the 44 tracked commands. A command file named `skill.md` makes Claude read its folder as one skill and hide the other commands in it, which the coordinator traced to an open upstream bug (`anthropics/claude-code#85786`) that holds for any capitalisation and on any filesystem. The only documented way out is another file name, and the mirror check hides the case behind an allowlist. A doctor prompt that says Code Mode tools are not showing up reaches no doctor command, because it carries no problem cue while four skills pass. The `AGENTS.md` Gate 2 example passes the prompt in argv, which any local user can read from the process table. Five scored commands carry too little intent text to reach their prompts on the real embedder, which sits at holdout 3 of 44. One brief-cost run wrote 44 records into the operator's health log, which left a workspace reading a degraded rate of 1.0.

### Purpose
Claude shows every tracked command under one name per command on every runtime, a doctor problem worded as a missing tool gets the doctor helper, the documented direct call keeps the prompt out of argv, five commands gain out-of-sample reach and a cost run leaves the health log alone.

**Core need served:** Claude Code listed 32 of the 44 commands before the rename, so a model there could not take the other 12 workflows at all. Now it lists all 44, and the doctor helper and the new intent phrases bring more prompts to the right workflow.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
Every command ran on 2026-11-13 from the worktree root at `087888ec4a`, read-only. `ADV` is `.skilled/skills/system-skill-advisor/runtime`, `RA` is `$ADV/scripts/routing-accuracy`, `DS` is `.skilled/commands/doctor/scripts`, `MS` is `.skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs`, `SC` is `.skilled/skills/system-spec-kit/runtime/cli` and `OLDP` is the old-name pattern `tasks.md` defines. The two `probe-*.mjs` scripts lived in the session scratchpad. They skip every row whose `split` is `holdout` before they read its prompt, never open `holdout-prompts.jsonl` and print row ids and numbers only. The real-embedding numbers are read from segment four, which reran them at the same commit, and were not rerun here.

```text
$ git -c core.fsmonitor=false rev-parse --short HEAD
087888ec4a
$ node $MS --check
[runtime-mirror-sync] visibility claude 32/44, cursor 44/44
[runtime-mirror-sync] PASS: 256 mirrors across 10 trees are in sync.
$ ls .claude/commands/create | tr "\n" " "
agent.md benchmark.md changelog.md command.md diff.md feature-catalog.md goal.md manual-testing-playbook.md readme.md repo-rule.md skill-parent.md skill.md with-human-voice.md
$ cat ../007-per-runtime-behaviour-proof/scratch/g5/result.txt    # recorded 2026-11-12, condensed
listing-a.txt: create/readme.md and create/skill.md present. The Skill tool lists one entry, `create`. `create:readme` is absent.
listing-b.txt: create/readme.md and create/new-skill.md present. The Skill tool lists `create:new-skill` and `create:readme`.
$ rg -n '/create:skill\b' --glob '!specs/**' --glob '!**/node_modules/**' --glob '!**/dist/**' . | wc -l
     198
$ rg -l '/create:skill\b' --glob '!specs/**' --glob '!**/node_modules/**' --glob '!**/dist/**' . | wc -l
      62
$ rg -n -P '/create:skill(?![-\w])' --glob '!specs/**' --glob '!**/node_modules/**' --glob '!**/dist/**' . | wc -l
     105
$ rg -l -P --hidden "$OLDP" --glob '!specs/**' --glob '!**/node_modules/**' --glob '!**/dist/**' --glob '!.git/**' . | wc -l
      55
$ jq -c 'select(.expected_command == "/create:skill") | [.split, .row_type]' $RA/command-prompts.jsonl | sort | uniq -c
   1 ["holdout","plain"]
   1 ["none","slash-variant"]
   1 ["none","typed"]
   1 ["tune","plain"]
$ jq -c 'select(.split != "holdout" and (.prompt | test("/create:skill(?![-\\w])"))) | .id' $RA/command-prompts.jsonl
"cmd-create-skill-typed-01"
"sv-07"
$ rg -c -P "$OLDP" $RA/holdout-prompts.jsonl || echo 0
0
$ jq -c '.metrics.typed_recall_at_1, .metrics.false_offer, .attachedMetrics.typed, .attachedMetrics.plain.tune, .attachedMetrics.false_offer_attached' $RA/command-routing-baseline.json
{"correct":24,"total":44}
{"count":0,"total":35}
{"own":24,"attached":20,"combined":44,"total":44}
{"own":8,"attached":15,"combined":23,"total":45}
{"count":0,"total":35}
$ jq -c '.rows["cmd-doctor-mcp-plain-tune-01"], .rows["cmd-doctor-skill-advisor-plain-tune-01"]' $RA/command-routing-baseline.json
{"expected_command":"/doctor:mcp","top":"mcp-code-mode","top1":false,"top3":false,"offered":false}
{"expected_command":"/doctor:skill-advisor","top":"system-skill-advisor","top1":false,"top3":false,"offered":false}
$ jq -c '[.metrics.full_corpus_top1.correct,.metrics.holdout_top1.correct,.metrics.ambiguity_top1.correct,.metrics.gold_none_false_fire.value]' $RA/scorer-eval-baseline.json
[160,50,21,5]
$ node probe-doctor.mjs "$PWD"    # fixture regime: empty DB folder, no semantic lane, local scorer
{"ambiguous":false,"id":"cmd-doctor-mcp-plain-tune-01","type":"plain","split":"tune","expected":"/doctor:mcp","cue":null,"ranker":["/doctor:mcp debug",11.102],"recs":[["mcp-code-mode","skill",0.87,true],["sk-code","skill",0.82,true],["mcp-tooling","skill",0.82,true],["sk-doc","skill",0.82,true]]}
{"ambiguous":false,"id":"cmd-doctor-skill-advisor-plain-tune-01","type":"plain","split":"tune","expected":"/doctor:skill-advisor","cue":"weak","ranker":["/doctor:skill-advisor tune",5.278],"recs":[["system-skill-advisor","skill",0.82,true]]}
$ node probe-rule.mjs "$PWD" $RA/command-prompts.jsonl $RA/doctor-prompts.jsonl $RA/labeled-prompts.jsonl $RA/ambiguity-prompts.jsonl
command-prompts.jsonl {"rows":132,"skipped":44,...,"presenceStrong":["cmd-doctor-mcp-plain-tune-01"]}
doctor-prompts.jsonl {"rows":78,"skipped":0,...,"presenceStrong":[]}
labeled-prompts.jsonl {"rows":195,"skipped":0,...,"presenceStrong":[]}
ambiguity-prompts.jsonl {"rows":24,"skipped":0,...,"presenceStrong":[]}
$ printf '%s' '{"prompt":"write a readme for the utils folder"}' | node .skilled/bin/skill-advisor.cjs advisor_recommend --json - --format json --warm-only | jq -c '[.status, .data.recommendations[0].skillId, .data.recommendations[0].command, .data.recommendations[0].policy]'
["ok","sk-doc","/create:readme","start"]
$ sed -n 65p AGENTS.md | wc -c
     189
$ node .skilled/commands/doctor/scripts/agents-md-manifest.cjs --check
[agents-md-manifest] PASS: 44 sections, 31 pins, derived matches AGENTS.md
[agents-md-manifest] Budget: 16092 / 16384 bytes to the last anchor, 27575 / 32768 bytes total, 21 history bodies
$ node .skilled/commands/doctor/scripts/agents-md-check.cjs | tail -1
STATUS=OK rows=12 findings=0 unknown=0
$ node .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-gate1-pointers.cjs --check
[gate1-pointer-sync] PASS: 1 instruction files carry the root Gate 1 and Gate 2 pointers.
$ node .skilled/skills/sk-code/sk-code-review/scripts/check-rule-copies.js | head -1
OK: all rule invariants present (8 exact-string file(s) + 2 Iron Law file(s) + 21 delivery-prefix anchor(s) + 6 extension floor(s) + 2 example output(s)).
$ node .skilled/bin/compiled-route-sync.cjs --check | tail -2
all 7 hubs resolve
all 55 served copies match their authored files
$ node $DS/parent-skill-check.cjs .skilled/skills/sk-doc | tail -1 | grep -o 'all hard.*'
all hard invariants passed, 0 warnings
$ node $DS/command-catalog-mirror-check.cjs --check | grep STATUS
STATUS=OK command-catalog-mirror: every catalog and hub metadata covers the command tree
$ bash $DS/route-validate.sh 2>/dev/null | tail -1 | grep -o '[0-9]* routes.*'
32 routes validated, 11 warnings
$ node $DS/doctor-phrase-reach.cjs | tail -1
STATUS=OK phrases=248 bridges=36
$ ls $SC/{codex/sync-prompts,pi/sync-prompts-pi,dsh/sync-prompts-dsh,codex/sync-agents,pi/sync-agents-pi,dsh/sync-agents-dsh}.cjs | xargs -n1 -I{} sh -c "node {} --check | tail -1"
[codex-agent-sync] PASS: 11 agents are in sync.
[codex-prompt-sync] PASS: 45 prompts are in sync.
[dsh-agent-sync] PASS: 11 agent patches are in sync.
[dsh-prompt-sync] PASS: 45 prompt stubs are in sync.
[pi-agent-sync] PASS: 11 agents are in sync.
[pi-prompt-sync] PASS: 45 prompts are in sync.
$ node .skilled/bin/check-agent-mirror-sync.cjs 2>/dev/null | tail -1 | grep -o 'all comparable mirrors in sync'
all comparable mirrors in sync
$ sed -n 167p $ADV/scripts/measure-brief-cost.mjs
    env: { ...process.env, SPECKIT_IPC_SOCKET_DIR: socketDir },
$ grep -n -o "DURABLE_METRICS_ROOT = join(tmpdir(), '[a-z-]*')" $ADV/lib/metrics.ts
185:DURABLE_METRICS_ROOT = join(tmpdir(), 'speckit-skill-advisor-metrics')
$ git -c core.fsmonitor=false tag --contains $(git -c core.fsmonitor=false log --diff-filter=A --format=%h -1 -- .skilled/skills/sk-doc/changelog/v2.9.13.0.md)
v4.0.2.1
$ git -c core.fsmonitor=false tag --contains $(git -c core.fsmonitor=false log --diff-filter=A --format=%h -1 -- .skilled/skills/system-skill-advisor/changelog/v1.0.0.0.md)
v4.0.2.1
```

From `research-segment-4.md` section 4 (a), rerun there at `087888ec4a` with `--real-embedding`: typed 24 of 44, plain tune top-1 13 of 45, plain tune with attached commands 28 of 45, plain holdout 3 of 44, false offers 0 of 35 and attached false offers 0 of 35. With the lineage's 23 phrases on copies of the database, holdout reads 5 of 44 and tune top-1 18 of 45, and for each command one phrase equals its tune prompt word for word. Every count in this spec quotes this block or that section.

### Rename Inventory
The coordinator's `\b` search also matches `/create:skill-parent`, which stays, so 198 hits in 62 files hold 105 hits of the old name itself. The `OLDP` scan adds the colon form without a slash, the `create/skill.md` path and the bridge id `command-create-skill`, and with `--hidden` it reaches the agent copies of four runtimes. It lists 55 files:

| Area | Files | How each changes |
|------|-------|------------------|
| Command file, assets and catalogs under `.skilled/commands` | 8 | The coordinator renames `create/skill.md` with `git mv` (T003). A worker edits the text of the command file, its three assets, the two `README.txt` catalogs, the prompt-improve presentation and one comment in `command-catalog-mirror-check.cjs` (T005). The asset file names keep their `create-skill-` prefix |
| sk-doc hub | 8 | `command-metadata.json`, `hub-router.json`, `mode-registry.json`, `README.md`, `ROUTER.md`, `SKILL.md`, the command contract of `sk-create-command` and the `sk-create-frontmatter` `SKILL.md` (T006) |
| `sk-create-skill` packet | 7 | `README.md`, `ROUTER.md`, `SKILL.md`, two references, the schema helper's comment and its contract test sample (T007). The packet and its folder keep their names |
| Advisor runtime | 7 | `scoring-compatibility.json` and the hook guide by hand (T008). `command-attach.ts` and its guards test by hand around the deriver run (T014). `projection.ts`, `skill_advisor.py` and `command-bridges.generated.json` only through `derive-command-bridges.cjs` |
| Routing corpus and baseline | 2 | `command-prompts.jsonl` by id for the three non-holdout rows and by a count-only script for the holdout row (T010). `command-routing-baseline.json` only through `capture-command-routing-baseline.mjs --write` (T021) |
| Root docs, agent definition and runtime notes | 6 | `README.md`, `CONTRIBUTING.md`, `.skilled/agents/markdown.md` with its hand-kept copy `.claude/agents/markdown.md`, the `sk-code` command-authoring checklist and the `.codex/SYNC.md` example (T009) |
| Mirror check | 2 | `MS` and its test, with the mirror README, which names no old spelling (T004) |
| Generated runtime mirrors | 6 | The Codex, Pi and DSH prompt stubs through their three `sync-prompts` generators, and the Codex, Pi and DSH agent copies through their three `sync-agents` generators (T016). The Claude and Cursor command links are not scanned, because `rg` follows no link, and `MS` rewrites them. OpenCode and Devin read through folder links and need no write |
| Kept history | 9 | Two `skilled` release notes and two `sk-create-skill` entries, all published. Three dated sk-doc benchmark reports. The served copy of the sk-doc canary fixture, which `compiled-route-sync.cjs --check` holds byte-equal to its authored file under `specs/`. The `command-catalog-mirror-check` test, whose fixture tree uses the name as a sample of one command inside another |

That is 37 files edited by hand including the mirror README, 12 generated outputs and 9 kept. After the phase, the `OLDP` scan lists the 9 kept files and the new `v2.10.0.0` changelog entry, 10 in all, because that entry must name the old command to record the break.

### Mechanism per Item
- Rename. `derive-command-bridges.cjs` names each bridge `command-` plus the command with its colon replaced (`derive-command-bridges.cjs:117`), so `/create:sk-skill` becomes `command-create-sk-skill`. It requires every `scoring-compatibility.json` entry to name a known inventory id, so that file changes before the deriver runs. It writes the marked blocks of `projection.ts`, `skill_advisor.py` and `command-attach.ts` and the bridge file. The mode-to-command map comes from `mode-registry.json`.
- Collapse check. `COLLAPSE_ALLOWLIST` (`$MS:39`) exempts `create/skill.md`, and `commandVisibility` and `collapseDrift` match the lowercase name only (`$MS:239-276`). With no file named `skill.md` the check reads 44 of 44 without an exception.
- Doctor cue. `applyDoctorHelperHandoff` returns the ranking unchanged when a skill passes and the prompt has no strong cue (`$ADV/lib/scorer/fusion.ts:1131-1135`). `STRONG_PROBLEM_CUE` (`$ADV/lib/scorer/doctor-helper-handoff.ts:51-59`) has no "show up" or "appear". With a strong cue the helper is inserted after the second passing skill (`fusion.ts:975-976`), and the renderer prints it as `Also:` (`$ADV/lib/render.ts:564-569`).
- Gate 2 call. The CLI reads `--json -` from stdin so a prompt stays out of argv (`$ADV/skill-advisor-cli.ts:391-397`). The manifest derives the gate-2 body from `AGENTS.md`, and `sync-gate1-pointers.cjs` copies the call line into `.cursor/rules/skill-routing.md:35`. The new line 65 is 204 bytes, 16 more than today:

```text
2. B) Direct call: run `printf '%s' '{"prompt":"[request]"}' | node .skilled/bin/skill-advisor.cjs advisor_recommend --json - --format json` when no hook brief is present or when diagnosing hook behavior.
```

- Intent phrases. The four doctor routes keep their phrases in `trigger_phrases` in `.skilled/commands/doctor/_routes.yaml` (the routes at lines 65, 376, 626 and 758), because doctor commands have no `command-metadata.json`. `/speckit:search` keeps them in `userIntent.ownedSignals` in `.skilled/skills/system-spec-kit/command-metadata.json` (line 215). The deriver carries both into the bridges, and `skill_graph_scan` re-embeds the command vectors.
- Brief cost. The hook child inherits the parent's `TMPDIR` (`measure-brief-cost.mjs:167`), and the metrics root is `tmpdir()` plus a fixed folder (`metrics.ts:185`), so a cost run writes into the shared health log. Setting `TMPDIR` to the sandbox folder the script already deletes moves those records into the sandbox.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A. Rename `/create:skill` to `/create:sk-skill` in every live file, with generated files rewritten by their generators, and drop the collapse allowlist from the mirror check.
- B. Read a negated "show up" or "appear" as a strong doctor problem cue.
- C. Show the Gate 2 direct call with the request on stdin in `AGENTS.md`, and regenerate its two copies.
- D. Add intent phrases to five commands, paraphrasing any phrase that repeats a tune prompt, re-embed and measure holdout as a count.
- E. Run the brief-cost hook children with `TMPDIR` in the sandbox.
- F. Regenerate the mirrors, rebuild, re-embed, recapture the baselines and check Claude's listing.

### Out of Scope
- An alias for `/create:skill`. The operator chose a clean break.
- `/create:skill-parent`, the `sk-create-skill` mode and its folder, the `create-skill` mode id and the `create-skill-*` asset file names. They are not the command name a reader types.
- Every file under `specs/`, every published changelog entry, the dated benchmark reports and the served canary fixture.
- The other argv calls of the advisor CLI. The review finding names `AGENTS.md:65` only.
- Segment four ranks 3 to 9. Ranks 3 and 4 wait on the operator and ranks 5 to 9 are declined there.
- Starting a model session, a daemon or Ollama from a worker task.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/commands/create/skill.md` to `.skilled/commands/create/sk-skill.md` | Rename | Coordinator `git mv`, then its text |
| The other 36 hand-edited files of the rename inventory, the mirror check files below among them | Modify | The old name to the new one, grouped by area in T004 to T010 and T014 |
| `.skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs`, its test and its README | Modify | No allowlist, any capitalisation |
| `.skilled/skills/system-skill-advisor/runtime/lib/scorer/doctor-helper-handoff.ts`, `tests/doctor-helper-handoff.vitest.ts`, `tests/scorer/doctor-handoff-command.vitest.ts` | Modify | The cue and its cases |
| `AGENTS.md`, `.skilled/commands/doctor/scripts/tests/agents-md-manifest.test.cjs` | Modify | Line 65 and its test |
| `.skilled/commands/doctor/_routes.yaml`, `.skilled/skills/system-spec-kit/command-metadata.json` | Modify | Intent phrases for five commands |
| `.skilled/skills/system-skill-advisor/runtime/scripts/measure-brief-cost.mjs`, `tests/measure-brief-cost.vitest.ts`, `scripts/routing-accuracy/README.md` | Modify | `TMPDIR` in the sandbox |
| Generated: the bridge file, three marked blocks, the command baseline, the manifest, the Cursor rule, five command mirrors and three agent copies | Regenerate | Each by its generator, named in `tasks.md` |
| `.skilled/skills/sk-doc/changelog/` | Create | One entry for the breaking rename at `v2.10.0.0` |

The restraint pass: no module, option, helper or dependency is added. The changelog entry is the one new file.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `/create:skill` is renamed to `/create:sk-skill` with no alias: `.skilled/commands/create/sk-skill.md` exists, no file named `skill.md` in any capitalisation sits under `.skilled/commands` outside `tests/fixtures`, where 22 `SKILL.md` fixtures of the sk-skill doctor checks are not command files, and the `OLDP` scan lists only the nine kept history files and the new changelog entry, which must name the old command. |
| REQ-002 | `MS` holds no `COLLAPSE_ALLOWLIST`, its collapse check and `commandVisibility` match `skill.md` in any capitalisation, and on the regenerated tree `node $MS --check` exits 0 and prints `visibility claude 44/44, cursor 44/44`. |
| REQ-003 | Every generated file is rewritten by its generator and its check passes: the bridge deriver, the mirror sync, the three prompt syncs, the three agent syncs, the agent mirror check, the manifest, the pointer sync and the command capture. |
| REQ-004 | The routing corpus rows whose expected command was `/create:skill` read `/create:sk-skill`: the three non-holdout rows edited by id, and the one holdout row changed only in `expected_command` by a script that never prints or reads its prompt and reports a count of 1. `holdout-prompts.jsonl` holds no old spelling and is never opened. |
| REQ-005 | `doctorProblemCue` returns `strong` for a negated "show up" or "appear", and the recaptured baseline row `cmd-doctor-mcp-plain-tune-01` reads `"offered":true`. |
| REQ-006 | `AGENTS.md` line 65 reads exactly the new line quoted in section 2, its copies carry it, every history hash recorded at `HEAD` is still recorded and the four `AGENTS.md` checks pass. |
| REQ-007 | The fixture floors hold after every change: typed recall at least 24 of 44, false offers 0 of 35, attached false offers 0 of 35, typed delivery 44 of 44, plain tune combined at least 23 of 45, and the scorer eval at least `[160,50,21,5]` with the fourth value no higher than 5. Typecheck, the full advisor suite, the doctor script tests and the compiled-route closure check pass. |
| REQ-008 | No task prints holdout prompt text, and no worker starts a model session, a daemon or Ollama. No file under `specs/` outside this packet changes except the authored twin of the sk-doc compiled-route manifest, which the manifest refresh must rewrite, no published changelog entry and no file named in Out of Scope changes, and no added code comment names a spec path, a phase, a task, a rank or a finding id. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-009 | With the five commands' phrases in place, the real capture reads plain holdout at least 2 above the real capture taken right before them, with typed 24 of 44, false offers 0 of 35 in both columns and `mns-chat-03`, `nm-system-skilled-doctor-01` and `sv-03` offering no command. No new phrase repeats its command's tune prompt word for word. |
| REQ-010 | A brief-cost run sets each hook child's `TMPDIR` to its sandbox, so the line count of every file in the shared metrics folder is unchanged after one run. |
| REQ-011 | The live hook brief for the `cmd-doctor-mcp-plain-tune-01` prompt holds a line starting `Also: /doctor:helper`, and the advisor CLI called in the stdin form returns `["/doctor:helper","run"]` for `command-doctor-helper`. |
| REQ-012 | Claude's command folder holds `sk-skill.md` and twelve siblings with no `skill.md` in any capitalisation, and a live Claude Code listing, run by the coordinator in place of the operator, names `create:sk-skill` and the twelve other `create:*` names. |
| REQ-013 | The breaking rename has a changelog entry at `v2.10.0.0`, the version the operator chose in Q3, and no published entry changes. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `node $MS --check` prints `visibility claude 44/44, cursor 44/44` and exits 0 on the regenerated tree, from `32/44` before.
- **SC-002**: The `OLDP` scan prints the nine kept files and the new changelog entry, 10 in all, from 55, because that entry must name the old command.
- **SC-003**: `FLOOR` prints `{"correct":24,"total":44}` or better, `{"count":0,"total":35}`, `{"own":24,"attached":20,"combined":44,"total":44}`, a plain tune `combined` of 23 or more and `{"count":0,"total":35}`, and the mcp tune row reads `"offered":true`.
- **SC-004**: The real holdout count after lane D is at least 2 above the count T018 records, which was 3 of 44 at `087888ec4a`.
- **SC-005**: `sed -n 65p AGENTS.md | wc -c` prints 205 and the manifest budget reads `16108 / 16384` and `27591 / 32768`.
- **SC-006**: Every floor in REQ-007 holds against `scratch/before.txt`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The operator's answer to Q3 | Answered on 2026-11-13: `v2.10.0.0` | T026 runs in wave 8 |
| Dependency | Ollama on `127.0.0.1:11434` | The re-embeds and the two real captures cannot run | T017, T018 and T020 mark themselves `[B]` and start nothing |
| Risk | A reader or a script that types `/create:skill` gets nothing | A breaking change on every runtime | The operator chose no alias. T026 records the break, and T028 proves no live file still names the old command |
| Risk | The deriver, the slice test and the mirror check fail from T003 until T016 and T021 | A red suite between waves | `VALL` runs only in T002 and T027, and nothing is committed before T027 |
| Risk | The phrases also reach the lexical lanes, which segment four did not measure | A near-miss row could start offering a command | T021 recaptures the fixture baseline, whose false offers must stay 0 of 35, and T020 checks the three doctor-family floor rows |
| Risk | A holdout count read after the phrases are known invites tuning to it | The holdout gain would stop being out of sample | The phrases are fixed in T019. T020 records the count and no phrase changes after it |
| Risk | The served canary fixture still prompts `/create:skill` | Its case could stop routing to the create-skill mode | T006 and T027 run `compiled-route-sync.cjs --check`. A failure is recorded `[B]`, because the fix belongs to an archived spec |
| Risk | UNKNOWN: whether every tmpdir-derived path of the hook child moves with `TMPDIR` | A cost run could fail where it ran before | The socket folder is passed by name already. T025 runs it once and records the result |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: The cue change adds two alternatives to one regular expression run once per prompt.
- **NFR-P02**: Nineteen doctor phrases and four search phrases add text to five command vectors and to the lexical lanes. No new lane or lookup.

### Security
- **NFR-S01**: The documented direct call sends the prompt on stdin, so it never appears in the process table.
- **NFR-S02**: No task prints holdout prompt text. The holdout corpus row changes by a count-only script, and every capture publishes holdout as counts.

### Reliability
- **NFR-R01**: The mirror check fails on any command file named `skill.md` in any capitalisation.
- **NFR-R02**: A cost run never writes the operator's health log.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: a command folder that holds only a file named `SKILL.md` counts as collapsed, visible 1 of 1, and the check reports it.
- Maximum input: the rename touches 37 hand-edited files and 12 generated outputs, and the old-name scan proves the end state in one command.
- Failure path: between T003 and T016, `node $MS --check` reports `MISSING` and `EXTRA` links and exits 1. Between T003 and T014 the deriver check fails on the unknown inventory id.
- A typed `/create:skill` after the rename matches no tracked command and gets no typed attach.
- A tune phrase that differs from its prompt by one word is a paraphrase only when the intent words stay. The check is word for word on normalized text.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 17/25 | About 60 paths in five lanes. Most are one-word text edits, generated outputs or checks |
| Risk | 12/25 | A breaking rename on every runtime, the shared framework document and two routing inputs, each held by a check and a capture |
| Research | 5/20 | Each mechanism is read in code, each count is probed read-only and the real-embedding numbers come from segment four |
| **Total** | **34/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

### Resolved

- R1. Which items does this phase build? Decision by the operator on 2026-11-13: rank 7, rank 13 and `R4-P2-003`, with segment four ranks 1 and 2 added. Rank 12 is declined and decision Q026 stands.
- Q1. How does Claude Code reach all 44 commands? Answered by the operator on 2026-11-13: rename `/create:skill` to `/create:sk-skill` on every runtime, matching `/doctor:sk-skill`, with no alias. The rank 7 design changed from a managed `.claude/skills` tree with a Claude-only `create` skill to a rename, because the cause is an open upstream bug in Claude Code (`anthropics/claude-code#85786`): a command file named `skill.md`, in any capitalisation and on any filesystem, hides its folder's other commands, and another file name is the only documented way out. The flat root mirror this plan proposed earlier is dropped.
- Q2. Which rule offers `/doctor:helper` on the doctor wrong-top pair? Answered by the operator on 2026-11-13: option 1, a negated "show up" or "appear" as a strong cue. The mcp tune row gains the helper and the skill-advisor tune row stays silent.
- R2. Which copies of the Gate 2 line change? Decision: `AGENTS.md` line 65, the manifest's gate-2 body and the Cursor rule (Recommended). The history bodies stay.
- R3. Do the corpus row ids change with the command? Decision: no (Recommended). A holdout row may change only in `expected_command`, so every id keeps one convention, and the per-command tallies key on `expected_command`.
- R4. Do the `create-skill-*` asset files take the new name? Decision: no (Recommended). No checker derives them from the command name, and a reader never types them.
- R5. Where do the four doctor commands keep their phrases? Decision: `trigger_phrases` in `_routes.yaml`, the source segment four names, because doctor commands have no `command-metadata.json`.

- Q3. Which changelog entry records the breaking rename? Answered by the operator on 2026-11-13: a new `sk-doc` entry `v2.10.0.0`, a minor bump with the break called out in the text. The plan had recommended `v3.0.0.0`, because the bump rules call a breaking command change major. The four hub version fields (`SKILL.md`, `hub-router.json`, `mode-registry.json`, `description.json`) move to `2.10.0.0` in the same task so `parent-skill-check.cjs` check 13b still passes. Every existing entry is published in tag `v4.0.2.1` and stays as it is.

### Open

- None.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Acceptance Criteria**: See `acceptance-criteria.md`
- **Research**: `../009-ux-performance-cross-cli-research/research/research-segment-3.md` and `../009-ux-performance-cross-cli-research/research/research-segment-4.md`
- **Review**: `../review/review-report.md`

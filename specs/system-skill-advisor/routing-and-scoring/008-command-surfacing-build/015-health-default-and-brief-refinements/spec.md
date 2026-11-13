---
title: "Feature Specification: Phase 15: health-default-and-brief-refinements"
description: "The prompt hook writes its health record only under SKILL_ADVISOR_DEBUG, so 21 workspace keys on this machine hold one and none says whether an answer came from the local scorer. The needs-a-mode label heads three silent floor rows, a hub drops the command a lower row carries, OpenCode adds a line that reads targets=none and the brief-cost script reports the outage line as the cost. This phase makes a prompt-free health record the default, narrows the label, fixes the head and the counts and tightens two behaviour-arm counts."
trigger_phrases:
  - "health default and brief refinements"
  - "phase 15 health default and brief refinements"
  - "hook health record by default"
  - "needs a mode only when the prompt names the hub"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 15: health-default-and-brief-refinements

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-11-13 |
| **Branch** | `worktrees/352-command-surfacing-research` |
| **Parent Spec** | ../spec.md |
| **Phase** | 15 of 15 |
| **Predecessor** | 014-review-remediation |
| **Successor** | None |
| **Handoff Criteria** | The recaptured command baseline reads `needs_mode_floor` 1 of 35 with every floor held, the final-arm summary prints the SC-002 values, one hook run with the debug variable unset adds one prompt-free record and every check in the verification phase passes |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 15** of the build that makes the skill advisor surface every tracked slash command with a run, start or ask policy on every supported CLI (`../spec.md`). It builds ranks 1, 9, 2, 3, 4, 5 and 11 of `../009-ux-performance-cross-cli-research/research/research-segment-3.md` and one count the coordinator added to the transcript scorer.

**Scope Boundary**: The diagnostic sink and its health section, the metrics type the hook result carries, the CLI fallback result, the Claude prompt hook's diagnostic call, the status handler and its schema, the needs-mode rule and its one caller, the top-only command guard, the OpenCode transform's second system entry, the brief-cost script, the transcript scorer, the offer module and the behaviour runner, the command capture and its baseline, the advisor leg text in `/doctor:setup` and the five documents that state the debug-only rule or describe the changed keys. No scorer weight, corpus row, alias, hub router, brief text, renderer, `AGENTS.md` or file under `.skilled/commands/create/` changes.

**Dependencies**:
- Phase 014 is committed first. It edits `command-attach.ts`, `render.ts`, `command-brief-golden.vitest.ts`, the command capture, the behaviour runner, the transcript scorer and `doctor-setup.yaml`, where it adds a `hook health not recorded` line whose reason names `SKILL_ADVISOR_DEBUG`. Every task here anchors on a symbol or a quoted line and holds with or without those edits. T007 rewrites that one reason.
- Phases 011 to 013 built `hookHealth`, the advisor leg, `needsMode`, the offer and delivery counts and the shared reader the runner passes at run time.

**Deliverables**:
- A health record on every hook run with no prompt, skill label or error text, a degraded flag, a degraded rate and the time of the newest record.
- A `(needs a mode)` label only on a prompt that names the hub.
- A head that names the command the top hub routed even when a lower row carries it.
- An OpenCode brief with the head entry alone.
- A brief-cost script that reads live heads only and refuses an arm with none.
- `deliveryUnknown` on every run line, a DSH session id for a turn that opened several sessions and `unsafeNoChangedPath` beside `unsafe`.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The prompt hook persists its diagnostic record only when `SKILL_ADVISOR_DEBUG` is set, so the `hookHealth` block that `advisor_status` and `/doctor:setup` read exists for 21 workspace keys on this machine against 124 outcome logs, and no record says whether an answer came from the CLI's local scorer. The `(needs a mode)` label heads 16 rows of the command corpus, three of them silent floor rows, because it fires on any deferring hub whatever the prompt asked. A hub that tops a prompt drops the command its route names when a lower, unrendered row carries the same command, OpenCode adds a 73 to 83 byte compiled-route line that reads `targets=none`, and the brief-cost script reports the 361-byte outage line where the live brief is 296 bytes. Two behaviour-arm counts hide facts: `deliveryUnknown` skips an unscored line and the DSH turn that opened four sessions gets no session id.

### Purpose
A default install reports how its hook runs and how often it degraded, and a brief names a command or a missing mode only where the prompt earned it, with every arm count answering what it claims.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
Every command ran on 2026-11-13 from the worktree root at `320e7b64d4`, read-only, while phase 014 was being planned in the same tree. `ADV` is `.skilled/skills/system-skill-advisor/runtime`, `RA` is `$ADV/scripts/routing-accuracy`, `FINAL` is `../007-per-runtime-behaviour-proof/scratch/runs-final.jsonl`, `UX` is `../009-ux-performance-cross-cli-research/research/lineages/ux-cost-3/scratch` and `CC` is the `cross-cli-3/scratch` folder beside it. The `probe-*.mjs` scripts lived in the session scratchpad and are deleted. They printed row ids and counts, never prompt text, and no holdout prompt was printed.

```text
$ git -c core.fsmonitor=false rev-parse --short HEAD
320e7b64d4
$ node $RA/capture-command-routing-baseline.mjs > cap-now.json && echo exit=$?
exit=0
$ jq -c '.metrics.typed_recall_at_1, .metrics.false_offer, .attachedMetrics.plain.tune, .attachedMetrics.false_offer_attached' cap-now.json
{"correct":24,"total":44}
{"count":0,"total":35}
{"own":8,"attached":15,"combined":23,"total":45}
{"count":0,"total":35}
$ jq -c '.attachedMetrics.attachedRows["cmd-create-agent-plain-tune-01"], .rows["cmd-create-agent-plain-tune-01"].top' cap-now.json
"/create:agent"
"sk-doc"
$ diff <(jq -S 'del(.capturedAtSha)' cap-now.json) <(jq -S 'del(.capturedAtSha)' $RA/command-routing-baseline.json) && echo same
same
$ node $RA/capture-scorer-eval-baseline.mjs | jq -c '[.metrics.full_corpus_top1.correct,.metrics.holdout_top1.correct,.metrics.ambiguity_top1.correct,.metrics.gold_none_false_fire.value]'
[160,50,21,5]
$ node probe-label-rows.mjs "$PWD"    # the capture's fixture regime, label = no delivered command and routeNeedsMode, after = the prompt also names the hub
{"floor":{"before":[3,35],"after":[1,35]},"bySplitBefore":{"plain/holdout":8,"plain/tune":5,"near-miss/none":3},"bySplitAfter":{"near-miss/none":1},
 "before":["cmd-create-changelog-plain-holdout-01","cmd-create-repo-rule-plain-tune-01","cmd-design-extract-plain-holdout-01","cmd-doctor-deep-loop-plain-holdout-01","cmd-doctor-overlay-plain-holdout-01","cmd-doctor-sk-skill-plain-tune-01","cmd-speckit-complete-plain-tune-01","cmd-speckit-handoff-plain-holdout-01","cmd-speckit-handoff-plain-tune-01","cmd-speckit-implement-plain-holdout-01","cmd-speckit-plan-plain-holdout-01","cmd-speckit-save-plain-holdout-01","cmd-speckit-save-plain-tune-01","nm-sk-design-01","nm-sk-doc-01","nm-system-skill-advisor-01"],
 "after":["nm-system-skill-advisor-01"]}
$ node probe-dup-guard.mjs    # handleAdvisorRecommend on the cmd-create-agent-plain-tune-01 prompt, test regime
 with and without compiledRouteTopOnly: [sk-doc, compiledRoute set, no command] [create:agent, /create:agent] [sk-code]
$ TMPDIR=<temp>/250 SKILL_ADVISOR_DEBUG=1 node -e '<persist 250 records through dist metrics.js>'
250 writes leave 250 lines
$ TMPDIR=<temp>/301 SKILL_ADVISOR_DEBUG=1 node -e '<persist 301 records>'
301 writes leave 200 lines
$ TMPDIR=<temp>/off node -e '<persist 1 record, debug unset>'
without SKILL_ADVISOR_DEBUG the file exists: false
$ ls "$TMPDIR/speckit-skill-advisor-metrics" | grep -c -- '-diagnostics.jsonl$'
21
$ ls "$TMPDIR/speckit-skill-advisor-metrics" | grep -c -- '-outcomes.jsonl$'
124
$ jq -c '{rows:(.rows|length), medianBytes, totalBytes, byBytes:([.rows[].bytes]|group_by(.)|map({b:.[0],n:length}))}' $UX/brief-cost-head.json
{"rows":44,"medianBytes":361,"totalBytes":16072,"byBytes":[{"b":361,"n":40},{"b":408,"n":4}]}
$ jq -c '{liveRows, medianBytes, medianHeadBytes, maxHeadBytes, totalBytes}' $UX/live-brief-cost.json
{"liveRows":44,"medianBytes":296,"medianHeadBytes":78,"maxHeadBytes":118,"totalBytes":13173}
$ jq -r '.rows[] | [.label, (.pluginEntries|length), (.pluginEntries|map(.bytes)|tostring)] | @tsv' $CC/render-entries.json
typed 2 [286,73]   plain 2 [286,73]   ambiguous 2 [305,83]   doctor 1 [298]   no-match 1 [244]
deep-research-plain 2 [294,83]   deep-review-plain 2 [292,83]   deep-council-plain 2 [296,83]   doctor-deep-loop-plain 2 [293,83]
$ node $RA/score-command-transcripts.mjs --summary $FINAL --json | jq -c 'map_values([.post.deliveryUnknown, .post.unsafe, .post.unscored, .post.runs])'
{"claude":[0,0,0,24],"devin":[0,2,0,24],"dsh":[0,2,1,24],"pi":[0,1,0,24],"opencode":[24,2,0,24]}
$ jq -r '[.runtime, (if .briefDelivered == true or .briefDelivered == false then "known" else "unknown" end)] | join(" ")' $FINAL | sort | uniq -c
  24 claude known   24 devin known   23 dsh known   1 dsh unknown   24 opencode unknown   24 pi known
$ node $RA/score-command-transcripts.mjs --summary $FINAL --row-id <row> --json   # for the four rows with an unsafe run
 mns-chat-07 unsafe pi 1 dsh 1, mns-chat-03 unsafe devin 1 opencode 1, cmd-deep-review-plain-tune-01 unsafe devin 1 opencode 1,
 cmd-deep-ai-council-plain-tune-01 unsafe dsh 1, loopsWithoutInit 0 on every runtime
$ jq -c '... select(the seven unsafe runs) | [.runtime,.rowId,(.changedPaths|length)]' $FINAL
 pi mns-chat-07 0, dsh mns-chat-07 0, dsh cmd-deep-ai-council-plain-tune-01 0, devin cmd-deep-review-plain-tune-01 0,
 devin mns-chat-03 1, opencode cmd-deep-review-plain-tune-01 2, opencode mns-chat-03 3
$ node probe-dsh-store.mjs $FINAL    # the final DSH arena store, ids and counts only
 27 session folders, 23 named on run lines, 4 not named. The unnamed line is cmd-deep-research-plain-tune-01 with no sessionId.
 Of the 4, one was born first with 108 records and its first user record equals that row's prompt. The other 3 were born 120 s later.
$ npm run typecheck   (in ADV)
exit 0
$ env -u AI_SESSION_CHILD npx vitest run tests/handlers/advisor-status.vitest.ts tests/command-attach.vitest.ts tests/handlers/advisor-recommend-compiled-route-option.vitest.ts tests/command-transcript-score.vitest.ts tests/command-routing-slice.vitest.ts
 Test Files  5 passed (5)
      Tests  107 passed (107)
$ node --test .opencode/plugins/tests/system-skill-advisor.test.cjs
ℹ tests 42
ℹ pass 42
ℹ fail 0
$ node $ADV/scripts/command-bridges/derive-command-bridges.cjs --check
 "changed": []   exit=0
$ node .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs --check
[runtime-mirror-sync] PASS: 256 mirrors across 10 trees are in sync.
```

Long outputs are condensed to one line per row. Every count in this spec quotes this block.

### Mechanism per Item
`HK` is `.skilled/skills/system-skill-advisor/hooks`.
- Health default. `writeBoundedJsonl` returns at once unless `SKILL_ADVISOR_DEBUG` is set whenever `requireDebug` is not `false` (`$ADV/lib/metrics.ts:319-320`), and `persistAdvisorHookDiagnosticRecord` never passes `false` (`:445-451`). The outcome log already passes it (`:529`) and holds a sanitized skill label. The gate came in `changelog/v0.3.0.0.md:20` because diagnostics "flushed on every invocation, even when no one was reading them". Readers now exist: `readAdvisorStatus` maps `hookHealth` (`$ADV/handlers/advisor-status.ts:487-507`) and the `/doctor:setup` advisor leg prints it. The reason was unread writes, not their content, so a record with no prompt and no skill label answers it.
- Writers. Every hook runtime except OpenCode reaches `emitDiagnostic` (`$HK/claude/user-prompt-submit.ts:238-256`): Claude directly, Codex, Cursor and Devin through the same script with `SPECKIT_RUNTIME`, and Pi and DSH through the compiled Claude chain (`$HK/pi/README.md`, `$HK/dsh/README.md`).
- Degraded flag. `resultFromCliData` sets `degraded` when the CLI answered from its local scorer and folds it into `freshness: 'stale'` (`$HK/lib/skill-advisor-cli-fallback.ts:463-464`), and `resultStatus` returns `ok` for any live or stale answer with a recommendation (`:397-405`). Neither field tells a local-scorer answer from a stale graph, and `AdvisorHookMetrics` (`$ADV/lib/skill-advisor-brief.ts:93-100`) has no slot for it.
- Needs mode. `routeNeedsMode` (`$ADV/lib/command-attach.ts:394-399`) is true for any `defer` or `clarify` route on a hub in `MODE_COMMANDS`, and `enrichCompiledRoutes` sets `needsMode` from it (`$ADV/handlers/advisor-recommend.ts:480`). `extractMetalinguisticSkillMentions` (`$ADV/lib/prompt-policy.ts:120-123`) already lists the skill names a prompt spells out.
- Top-only guard. `enrichCompiledRoutes` withholds a hub's routed command when another row already carries it (`alreadyOffered`, `advisor-recommend.ts:449-480`). With `compiledRouteTopOnly`, which the hook sends, only the top row is enriched and the renderer prints one head, so the command at rank 2 never reaches the brief. The capture never applies the guard, which is why its row already reads `"/create:agent"`.
- OpenCode line. The transform pushes `renderCompiledRouteSummaryLine(response.metadata?.compiledRouteSummary, ...)` as a second system entry (`.opencode/plugins/system-skill-advisor.js:1586-1603`). The summary keeps string targets only and the routes carry objects, so every line reads `targets=none`.
- Brief cost. `measureRow` counts whatever `additionalContext` the sandboxed hook returns and `summarise` takes every row (`$ADV/scripts/measure-brief-cost.mjs`), so an arm where the sandbox cannot reach a live daemon reports the outage line as the cost.
- Delivery unknown. `addScored` counts `deliveryUnknown` (`$RA/score-command-transcripts.mjs:1300`) and only scored runs reach it, so the DSH line with no session id is invisible.
- DSH session id. `addedSessionId` returns `null` unless exactly one id was added (`$RA/run-command-behaviour.mjs:366-371`), and that DSH turn added four.
- No changed path. `unsafe` comes from transcript write events (`startState`, `score-command-transcripts.mjs:690-706`) while `wrote` comes from the run line's `changedPaths` (`:1201`), so an unsafe write the restore never saw is not told apart.

### Research Claims Checked in Code
- Rank 1 verify, "A 250-write fixture leaves 200 lines". Refuted by the trim probe: 250 writes leave 250 lines and 301 leave 200, because the trim runs past `Math.floor(200 * 1.5)` lines.
- Rank 1 files. Refuted in part: `emitDiagnostic` cannot read a degraded flag, which exists only inside `resultFromCliData`. The flag needs `AdvisorHookMetrics`, the fallback and the hook.
- Rank 1 reach, section 4(c). Refuted in part: Cursor writes too, so six of seven runtimes write and OpenCode alone does not.
- Rank 2 verify, "`needsMode` on 0 of 35 floor rows". Refuted by the label probe: 1 of 35, `nm-system-skill-advisor-01`, whose prompt names `sk-doc`, the hub that tops it.
- Rank 2 gain names four tune rows. The probe shows five tune rows (`cmd-speckit-handoff-plain-tune-01` is the fifth) and 8 holdout rows. All 13 lose the label.
- Rank 2 files. `command-brief-golden.vitest.ts` needs no change, because the renderer is untouched.
- Rank 3 verify, "the capture moves tune combined by 1". Refuted: the capture already counts `cmd-create-agent-plain-tune-01` as attached, so combined stays 23. The gain is the live head only.
- Rank 4 files. The two assertions that pin the second entry are in `.opencode/plugins/tests/system-skill-advisor.test.cjs`, not in the plugin vitest.
- Rank 5 test. A `node:test` file under `runtime/tests` would never run, because `vitest.config.ts` collects `tests/**/*.vitest.ts`. The test is a vitest file.
- Rank 11 and the coordinator's count. Confirmed: one DSH line is unscored with `briefDelivered` unknown, and the seven unsafe runs hold 0, 0, 0, 0, 1, 2 and 3 changed paths with no loop without init.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A. Persist a health record on every hook run, with the skill label and the error text only under `SKILL_ADVISOR_DEBUG`, through the existing 200-record trim.
- B. Carry a `degraded` flag from the CLI fallback through the hook into the record, and report `rollingDegradedRate` and `lastRecordAt` in the health section and in `advisor_status`.
- C. Rewrite the advisor leg of `/doctor:setup` to show the degraded share and the last record time, and state the true reason when no record exists.
- D. Show `(needs a mode)` only when the prompt names the hub, and report the label rows in the command capture.
- E. Let the top hub name its routed command under `compiledRouteTopOnly` even when a lower row carries it.
- F. Stop the OpenCode transform from pushing the compiled-route line.
- G. Make the brief-cost script read live heads only and refuse an arm with none.
- H. Count `deliveryUnknown` on every run line, give a DSH turn its session id when one added session holds the prompt and tally `unsafeNoChangedPath` beside `unsafe`.
- I. Correct the five documents that state the debug-only rule or describe a changed key.

### Out of Scope
- Rank 8, the two quality-control alias pairs. Declined by the coordinator: three of its four phrases are copied from the two tune rows, so the gain is tune-only and the expected holdout gain is 0.
- Ranks 6 and 10, the in-process degraded scorer and the intent signals. A later phase, after a cold timing and a scratch-DB real capture with a holdout count.
- Ranks 7, 12 and 13. Each waits on an operator decision: the Claude `create` collapse, decision Q026 and a default doctor subcommand.
- Ranks 14, 15 and 16. Declined as the draft says: `sk-code` modes carry no command, Codex `false` already means unapproved and re-embedding adds no command.
- An OpenCode health writer. The plugin keeps its own state, so the leg reports the absence instead.
- Starting a model session, ollama or a behaviour arm. Live checks run through the hook script and the advisor CLI only, as coordinator tasks.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `$ADV/lib/metrics.ts`, `$ADV/tests/handlers/advisor-status.vitest.ts` | Modify | Default health record, `degraded`, `rollingDegradedRate` and `lastRecordAt` with the cases that pin them |
| `$ADV/lib/skill-advisor-brief.ts` | Modify | `AdvisorHookMetrics.degraded` |
| `$HK/lib/skill-advisor-cli-fallback.ts` | Modify | `resultFromCliData` sets `metrics.degraded` |
| `$HK/claude/user-prompt-submit.ts` | Modify | The diagnostic call passes `degraded` |
| `$ADV/handlers/advisor-status.ts`, `$ADV/schemas/advisor-tool-schemas.ts` | Modify | `hookHealth` gains the two fields under its strict schema |
| `$ADV/lib/command-attach.ts`, `$ADV/tests/command-attach.vitest.ts` | Modify | `routeNeedsMode` takes the named skills |
| `$ADV/handlers/advisor-recommend.ts`, `$ADV/tests/handlers/advisor-recommend-compiled-route-option.vitest.ts` | Modify | The caller passes the named skills, the top-only guard and their cases |
| `$RA/capture-command-routing-baseline.mjs`, `$RA/command-routing-baseline.json` | Modify | `needs_mode_floor` and `needsModeRows`, recaptured twice |
| `.opencode/plugins/system-skill-advisor.js`, `.opencode/plugins/tests/system-skill-advisor.test.cjs` | Modify | No compiled-route push and the two amended assertions |
| `$ADV/scripts/measure-brief-cost.mjs`, `$ADV/tests/measure-brief-cost.vitest.ts` | Modify, Create | Live heads, the refusal and its fixture test |
| `$RA/score-command-transcripts.mjs`, `$ADV/tests/command-transcript-score.vitest.ts` | Modify | `deliveryUnknown` per run line and `unsafeNoChangedPath` |
| `$RA/command-offer.mjs`, `$RA/run-command-behaviour.mjs` | Modify | `promptSessionId` and its use for a DSH turn |
| `.skilled/commands/doctor/assets/doctor-setup.yaml` | Modify | The advisor leg text |
| `$HK/skill-advisor-hook.md`, `$HK/skill-advisor-hook-validation.md`, `.skilled/skills/system-skill-advisor/ARCHITECTURE.md`, `.skilled/skills/system-skill-advisor/feature-catalog/hooks-and-plugin/claude-hook.md`, `$RA/README.md` | Modify | The default record, the bounding option's remaining role, the new keys and the refusal |

The restraint pass for the one new file: `measure-brief-cost.vitest.ts` is new because the script has no test and runs `main()` on load, so it is tested as a child process against a stub hook. No helper module, option or dependency is added. `promptSessionId` lives in the offer module because the runner runs `main()` on import and cannot be imported by a probe.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | With `SKILL_ADVISOR_DEBUG` unset, `persistAdvisorHookDiagnosticRecord` writes one record per call with no `skillLabel` and no `errorDetails` through the 200-record trim, so 301 writes leave 200 lines. With the variable set it writes the full record as today. |
| REQ-002 | A CLI answer from the local scorer carries `metrics.degraded: true`, the hook passes it, the record holds `degraded: true` and the health section reports `rollingDegradedRate` over its last 30 records. |
| REQ-003 | The health section carries `lastRecordAt`, the newest record's timestamp, and `advisor_status` `hookHealth` carries `rollingDegradedRate` and `lastRecordAt` under its strict schema. |
| REQ-004 | `routeNeedsMode` is true only when the prompt names the hub, so the recaptured baseline reads `needs_mode_floor` `{"count":1,"total":35}` and `needsModeRows` `["nm-system-skill-advisor-01"]`, from `{"count":3,"total":35}` and 16 rows. |
| REQ-005 | With `compiledRouteTopOnly`, the top hub carries the command its route names even when a lower row carries the same command. Without the option the guard is unchanged. |
| REQ-006 | The OpenCode transform pushes one system entry for a routed prompt. `compiledRouteSummary`, its render helper and the bounding option stay. |
| REQ-007 | `deliveryUnknown` counts every run line whose `briefDelivered` is neither `true` nor `false`, scored or not, so `FINAL` reads `{"claude":0,"devin":0,"dsh":1,"opencode":24,"pi":0}`. |
| REQ-008 | The scorer tallies `unsafeNoChangedPath`, the scored runs with `unsafe` true, `wrote` false and `loop` not `false`, prints it beside `unsafe` in JSON and text and leaves `unsafe` unchanged, so `FINAL` reads `[unsafe, unsafeNoChangedPath]` `{"claude":[0,0],"devin":[2,1],"dsh":[2,2],"opencode":[2,0],"pi":[1,1]}`. |
| REQ-009 | The floors hold: typed recall at least 24 of 44, false offers 0 of 35, attached false offers 0 of 35, plain tune combined 23 of 45, the scorer eval no lower than its line in `scratch/before.txt`, typecheck, the full advisor suite, the plugin node tests, the deriver check and the mirror check. |
| REQ-010 | No task prints holdout prompt text, starts a model session, starts ollama or adds a dependency. `AGENTS.md` and `.skilled/commands/create/` are unchanged and no added code comment names a spec path, phase number, task id or rank id. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-011 | The `/doctor:setup` advisor leg shows the degraded share and the last record time when `hookHealth` is present, shows `hook health not recorded` with the reason that no prompt hook has written a record when it is absent, never names `SKILL_ADVISOR_DEBUG` as that reason and never changes the leg's status. |
| REQ-012 | `measure-brief-cost.mjs` prints `headBytes` and `live` per row, `liveRows`, `medianHeadBytes` and `maxHeadBytes`, takes every byte statistic over live rows only and exits 2 with `{"error":"degraded_brief",...}` when no row is live. |
| REQ-013 | A DSH turn whose store gained several sessions records the one session whose first user record equals the prompt, and still records none when zero or several match. |
| REQ-014 | The hook guide, the hook validation guide, `ARCHITECTURE.md`, the Claude hook catalog entry and the routing-accuracy README describe the default record, what the debug variable adds, the bounding option's remaining role, the capture's label keys, the new scorer key and its limit, `deliveryUnknown` per run line and the brief-cost refusal. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `jq -c '.attachedMetrics.needs_mode_floor, .attachedMetrics.needsModeRows, .metrics.typed_recall_at_1, .metrics.false_offer, .attachedMetrics.plain.tune.combined' $RA/command-routing-baseline.json` prints `{"count":1,"total":35}`, `["nm-system-skill-advisor-01"]`, `{"correct":24,"total":44}`, `{"count":0,"total":35}` and `23` after the rebuild.
- **SC-002**: `node $RA/score-command-transcripts.mjs --summary $FINAL --json | jq -cS 'map_values([.post.deliveryUnknown, .post.unsafe, .post.unsafeNoChangedPath])'` prints `{"claude":[0,0,0],"devin":[0,2,1],"dsh":[1,2,2],"opencode":[24,2,0],"pi":[0,1,1]}`. A differing value is reported, never matched by changing code.
- **SC-003**: One hook run from the worktree root with `SKILL_ADVISOR_DEBUG` unset adds one line to the worktree's diagnostics file, the line holds no `skillLabel` and no `errorDetails`, and `readAdvisorStatus` returns `hookHealth.lastRecordAt` equal to that line's `timestamp`.
- **SC-004**: The hook head for the `cmd-create-agent-plain-tune-01` prompt names `/create:agent (start)`, the heads for `use the sk-doc skill` and `use the system-deep-loop skill` keep `(needs a mode)`, the head for the `cmd-speckit-save-plain-tune-01` prompt drops it and the render-entries probe prints one plugin entry per prompt.
- **SC-005**: Every floor in REQ-009 holds against `scratch/before.txt`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 014 edits seven of the files named in section 3 | A quoted anchor can move or change | T002 gates wave 1 on phase 014's commit. Every task re-reads its file and marks itself `[B]` with the line it found when an anchor is gone |
| Dependency | The command capture refuses a stale build | T003 and T024 cannot write the baseline | Wave 1 holds no edit under `$ADV/lib`, `$ADV/handlers`, `$ADV/schemas` or `$HK`, and T023 rebuilds before T024 |
| Risk | Every test that runs the hook without an injected writer now writes a health record under the OS temp folder | Low: the records are prompt-free and keyed by the fixture's workspace hash | The live check in T026 measures a delta of one line, never an absolute count |
| Risk | The default write adds one append per prompt inside the hook budget | Low: 0.26 ms median per append by ux-cost-3, not rerun | The hook already waits at most 100 ms for pending writes, and T026 times nothing new |
| Risk | The slice test fails once the rebuilt dist applies the hub-name rule | The suite is red between T023 and T024 | T024 recaptures right after the rebuild, and the verification phase runs after both |
| Risk | The brief-cost run may find no live head on a machine where the sandboxed hook cannot reach a daemon | The script exits 2 where it used to print a number | That refusal is the point. T030 records whichever answer the run gives and changes no code |
| Risk | UNKNOWN: whether the prompt-name rule misses a reader who asks for a hub by its plain title | A wanted label could be lost | Section 10 records the choice. The two live-head prompts that name the hub keep the label in T027 |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: The default record adds one append of about 120 bytes per prompt to a file capped at 200 records and trimmed past 300 lines.
- **NFR-P02**: The hub-name check reads one regular expression over the prompt the handler already holds, and the top-only change adds no route lookup.

### Security
- **NFR-S01**: The default record holds no prompt, no skill label and no error text, in the existing 0600 file inside the 0700 metrics folder.
- **NFR-S02**: No task prints holdout prompt text. The capture lists row ids only, as `attachedRows` already does.

### Reliability
- **NFR-R01**: A diagnostic write that fails still never changes the hook's output, as `emitDiagnostic` already guarantees.
- **NFR-R02**: A DSH store with zero or several matching sessions still yields no session id, never a guess.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: a workspace with no record omits `hookHealth`, and the leg prints `hook health not recorded`.
- Maximum input: 301 default writes leave 200 lines, and the health section reads the last 30.
- Failure path: a brief-cost run with no live head prints `degraded_brief` and exits 2 after the sandbox is cleaned up.
- A prompt that names a hub that does not top it gets no label. A prompt that names the top hub and routes to one mode gets the command, not the label.
- A top hub whose route names no command keeps the guard's old outcome, because there is no command to attach.
- A DSH session whose first user record cannot be read counts as no match.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 16/25 | About 28 files across the advisor runtime, its hooks, the OpenCode plugin, the routing-accuracy scripts, one doctor asset and five documents |
| Risk | 9/25 | No scorer weight or corpus row changes. The label and the guard change what a head shows, held by the capture, the slice test and live heads |
| Research | 5/20 | Each mechanism is read in code and each count is probed read-only |
| **Total** | **30/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

### Resolved

Each answer is an autonomous decision under the packet goal's D1, recorded on 2026-11-13. Q1 to Q4 are the coordinator's scope decisions.

- Q1. Which ranks does this phase build? Decision: 1, 9, 2, 3, 4, 5 and 11, plus the `unsafeNoChangedPath` count the coordinator added beside rank 11.
- Q2. Build rank 8? Decision: no. Its alias phrases are copied from the two tune rows, so the gain is tune-only and the expected holdout gain is 0.
- Q3. Ranks 6 and 10? Decision: a later phase, each after its own measurement. Ranks 7, 12 and 13 wait on the operator and ranks 14, 15 and 16 are declined as the draft says.
- Q4. Phase 014's `hook health not recorded` reason names `SKILL_ADVISOR_DEBUG`. Decision: T007 replaces it, because once the record is the default the variable no longer decides whether a record exists.
- Q5. Does the debug gate's history forbid a default record? Decision: no (Recommended). `changelog/v0.3.0.0.md:20` gated writes nobody read. `hookHealth` and the advisor leg read them now, the outcome log is already written without the gate and the default record drops the skill label and the error text.
- Q6. Floor rows with the label after the rule: 0 or 1? Decision: 1, `nm-system-skill-advisor-01`, recorded as measured (Recommended). Its prompt names `sk-doc` and `sk-doc` tops it. Narrowing further to invocation phrasing would also drop the label from the two live-head prompts the draft wants kept.
- Q7. Where does the DSH session choice live? Decision: an exported `promptSessionId` in the offer module (Recommended). The runner runs `main()` on import, so a helper there cannot be probed.
- Q8. Which documents change? Decision: the five that state the debug-only rule or describe a changed key (Recommended). The manual playbooks that set `SKILL_ADVISOR_DEBUG=1` stay true and are unchanged. The changelogs are history.
- Q9. Which test proves each change? Decision: only the test the draft's Verify column names, plus the two plugin assertions the line removal breaks (Recommended). The fallback flag and `promptSessionId` are proven by typecheck, an inline `node -e` check and a coordinator probe.

### Open

- Does a reader ask for a hub by a plain title such as "the doc skill" often enough to lose a wanted label? UNKNOWN. Owner: the next behaviour arm, which reads the label rows from the capture.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Acceptance Criteria**: See `acceptance-criteria.md`
- **Research**: `../009-ux-performance-cross-cli-research/research/research-segment-3.md`

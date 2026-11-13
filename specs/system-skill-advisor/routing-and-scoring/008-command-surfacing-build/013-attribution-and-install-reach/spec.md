---
title: "Feature Specification: Phase 13: attribution-and-install-reach"
description: "A behaviour arm cannot say whether the brief reached five of six runtimes, counts an offer only on uncapped start rows, leaves a loop without init outside the safety floor, misses a typed command Claude Code expands itself and restores a staged file as if it were clean. The default embed install also removes the only file Claude Code reads, and /doctor:setup never reports brief delivery. This phase makes delivery a stored fact, fixes the counts and the restore and restores Claude's route on the default install."
trigger_phrases:
  - "attribution and install reach"
  - "phase 13 attribution and install reach"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 13: attribution-and-install-reach

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
| **Phase** | 13 of 13 |
| **Predecessor** | 012-plain-offer-reach |
| **Successor** | None |
| **Handoff Criteria** | The brief-only backfill of the committed after arm answers `briefDelivered` on 119 of 144 lines, the summary prints the new offer keys with the values in section 5, the g2 rescoring prints Claude `start 3 of 6`, the restore test passes and every floor holds |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 13** of the build that makes the skill advisor surface every tracked slash command with a run, start or ask policy on every supported CLI (`../spec.md`). It builds ranks 2, 3, 5, 8, 9, 10, 11 and 13 of `../009-ux-performance-cross-cli-research/research/research-segment-2.md` and two defects the coordinator found in the phase 007 arms after the research closed.

**Scope Boundary**: The shared session readers and their declarations, the offer module, the behaviour runner, a new restore module, the transcript scorer, one comment in the command capture, the agents-md embed and check engines with their docs, the `/doctor:setup` workflow, its presentation and its router, the install guide, the READMEs that describe them and the OpenCode plugin's recommendation mapper with its test. No routing input, scorer weight, corpus row, brief text, `AGENTS.md` or file under `.skilled/commands/create/` changes. The OpenCode brief changes only so it prints the label the shared renderer already prints for the hook runtimes.

**Dependencies**:
- Phase 010 built `offeredCommand`, `offeredPolicy`, `briefDelivered`, the backfill mode, the offered counts and the two read-only doctor checks this phase extends.
- Phase 011 edits the command capture, the routing-accuracy README and the install guide. No wave 1 task starts before it is committed.
- Phase 012 is planned beside this one. The coordinator confirms its diff touches none of the files in section 3 before wave 1. Wave 7b also waits for phase 012 to be committed, because only phase 012's renderer prints `needsMode`.

**Deliverables**:
- Delivery as a stored fact for Claude, Pi, Devin, DSH and Codex, with OpenCode left `unknown` by decision.
- Honest offer accounting, a safety floor that counts a loop without init and a start rate that counts a host-expanded typed command.
- A Codex arm that refuses to start when its hooks are unapproved and a restore that leaves no staged file behind.
- A `CLAUDE.md` pointer on the default embed install, a check that reports a missing pointer and a seventh `/doctor:setup` leg for brief delivery.
- An OpenCode brief that names the command and policy a hook brief names.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The committed after arm answers `briefDelivered` on 24 of 144 lines, Claude only, although Pi, Devin and DSH stored the brief in every session and Codex received none because its hooks were unapproved. The scorer counts an offer only on uncapped start rows, names a missing field `offerUnknown`, leaves a loop without init outside `unsafe` and never counts a typed command that Claude Code expands before the model sees it, so Claude reads `start 0 of 6` on a set where it ran three typed workflows. The runner restores a staged new file from the index and still writes `restored: true`, which left three arenas with 43 to 48 staged paths. On the install side, `embed` removes the only instruction file Claude Code reads and `/doctor:setup` reads green on a Codex install that delivers no brief.

### Purpose
Every number a behaviour arm prints answers one question each, delivery included, and a default install gives Claude its instruction route and tells the person when the brief cannot arrive.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
Every command ran on 2026-11-13 from the worktree root at `731967bc25`, read-only, while other workers edited the advisor runtime for phase 011. `POST` is `../007-per-runtime-behaviour-proof/scratch/runs-post-final.jsonl`, `G2` is `../007-per-runtime-behaviour-proof/scratch/runs-g2.jsonl`, `S` is the transcript scorer and `ARENAS` is `/private/var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/skilled-behaviour-arenas`. The `probe-*.mjs`, `sim.mjs` and `tags*.mjs` scripts lived in the session scratchpad. They read the stored sessions under the operator's home folder read-only and printed counts and shapes, never prompt text. No holdout row was opened.

```text
$ jq -c '{r:.runtime,b:.briefDelivered,bf:.offerBackfilled,oe:.offerError}' $POST | sort | uniq -c
  24 {"r":"claude","b":true,"bf":null,"oe":null}
  24 {"r":"codex","b":"unknown","bf":null,"oe":null}
  24 {"r":"devin","b":"unknown","bf":null,"oe":null}
  24 {"r":"dsh","b":"unknown","bf":null,"oe":null}
  24 {"r":"opencode","b":"unknown","bf":null,"oe":null}
  24 {"r":"pi","b":"unknown","bf":null,"oe":null}
$ node probe-now.mjs $POST     # today's briefDelivered with the shared loadSession passed, as the backfill does
 "codex|unknown|ok": 24,  "devin|unknown|ok": 24,  "pi|true|ok": 24,  "opencode|unknown|ok": 24,
 "dsh|unknown|ok": 23,  "dsh|unknown|locator_unavailable": 1,  "claude|true|": 24
$ node probe-pi2.mjs $POST     # where the Pi brief sits
 "types=session,model_change,thinking_level_change,custom_message:session-start-context,message": 24,
 "userItems=1 hitIdx=0 pos=inside@50..90": 24 sessions in total
$ node probe-devin-dsh.mjs $POST
 "devin role=system input=null onChain=true start=true": 24,  "devin role=system input=null onChain=false start=true": 72,
 "devin sessions hitChain=true hitAny=true": 24
$ node probe-dsh.mjs $POST
 "user/message kind=repo-guards role=user": 23,  "sessions hit=true": 23
$ node .skilled/commands/doctor/scripts/codex-hook-approval-check.cjs --root $ARENAS/post-codex; echo exit=$?
WARN codex-hooks-unapproved /private/var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/skilled-behaviour-arenas/post-codex
repair: open /hooks in a Codex session at /private/var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/skilled-behaviour-arenas/post-codex and approve each entry
exit=1
$ node $S --summary $POST --json | jq -c '... {startRate,cappedStartRows,offered,startedOfOffered,offerUnknown,unsafe,loopsWithoutInit,loops}'
["codex","post",{"startRate":"0 of 12","cappedStartRows":0,"offered":2,"startedOfOffered":0,"offerUnknown":0,"unsafe":0,"loopsWithoutInit":0,"loops":0}]
["devin","post",{"startRate":"3 of 9","cappedStartRows":3,"offered":2,"startedOfOffered":1,"offerUnknown":0,"unsafe":1,"loopsWithoutInit":1,"loops":1}]
["pi","post",{"startRate":"2 of 10","cappedStartRows":2,"offered":1,"startedOfOffered":1,"offerUnknown":0,"unsafe":1,"loopsWithoutInit":0,"loops":0}]
["opencode","post",{"startRate":"1 of 5","cappedStartRows":7,"offered":0,"startedOfOffered":0,"offerUnknown":0,"unsafe":2,"loopsWithoutInit":0,"loops":0}]
["dsh","post",{"startRate":"6 of 12","cappedStartRows":0,"offered":2,"startedOfOffered":2,"offerUnknown":0,"unsafe":0,"loopsWithoutInit":0,"loops":0}]
["claude","post",{"startRate":"4 of 12","cappedStartRows":0,"offered":2,"startedOfOffered":1,"offerUnknown":0,"unsafe":0,"loopsWithoutInit":0,"loops":0}]
$ node sim.mjs $POST           # offers on every row, using the scorer per row id
 every runtime: expected offers on create-benchmark (start), create-feature-catalog (start), create-changelog (ask)
 capped among them: pi 1, opencode 2, others 0
$ node $S --summary $G2 | rg 'g2:'
  g2: 6 of 6 scored, start 0 of 6, ... loops without init 0 of 0          (codex)
  g2: 6 of 6 scored, start 0 of 6, ... loops without init 0 of 2          (claude)
  g2: 4 of 6 scored, start 3 of 4, ... loops without init 0 of 2          (dsh)
  g2: 6 of 6 scored, start 4 of 6, ... loops without init 2 of 5          (pi)
  g2: 6 of 6 scored, start 4 of 6, ... loops without init 1 of 5          (devin)
  g2: 6 of 6 scored, start 5 of 6, ... repeated 1, loops without init 1 of 5   (opencode)
$ node tags.mjs $G2            # Claude typed rows
 claude g2-deep-research-typed tags ["/deep:research"], shape type=user contentType=string starts="<command-message"
 claude g2-deep-review-typed tags ["/deep:review"], same shape
 claude g2-speckit-complete-typed tags ["/speckit:complete"], same shape
 every other runtime: no <command-name> tag
$ for a in post-opencode post-devin post-dsh post-claude; do git -C $ARENAS/$a status --porcelain | wc -l; done
 post-opencode 43 (43 "A "), post-devin 48 (48 "A "), post-dsh 43 (43 "A "), post-claude 0
$ git -C $ARENAS/post-dsh ls-files --error-unmatch -- <first staged path>; git -C $ARENAS/post-dsh cat-file -e HEAD:<same path>
 ls-files-exit=0, in-HEAD-exit=128
$ rg -n "offerUnknown|offer unknown" --glob '!specs/**' --glob '!**/node_modules/**' --glob '!**/dist/**' .
 routing-accuracy/README.md:109, score-command-transcripts.mjs:1083,1102,1141,1173,1200,1227,1228,1320, tests/command-transcript-score.vitest.ts:724
$ node scratch/planning/probe-opencode-brief.mjs --doctor     # the plugin transform with its CLI call stubbed by the real answer
[real] opencode plugin head: Advisor: live; use sk-doc 0.95/0.12 pass.
[real] renderer with fields kept: Advisor: live; use sk-doc → /create:readme (start) 0.95/0.12 pass.
[real-doctor] opencode plugin head: Advisor: live; use system-skilled-doctor → /doctor:setup (run) 0.82/0.16 pass.
$ printf '%s' '{"prompt":"/create:readme for the utils folder",...}' | node .skilled/skills/system-spec-kit/runtime/dist/hooks/claude/user-prompt-submit.js
 additionalContext head: Advisor: live; use sk-doc → /create:readme (start) 0.95/0.12 pass.    exit=0
$ node scratch/planning/probe-hook-adapters.mjs     # codex, cursor and devin by stubbed stdin, pi and dsh in-process
 codex, cursor, devin, pi, dsh: head "Advisor: live; use sk-doc → /create:readme (start) 0.95/0.12 pass.", names command=true names policy=true, exit=0
$ node scratch/planning/probe-mapper-fix.mjs     # the planned mapper lines applied in memory, the plugin file untouched
 sk-doc row: today "use sk-doc 0.95/0.12 pass.", patched "use sk-doc → /create:readme (start) 0.95/0.12 pass."
 row outside the command table: today "use probe-row 0.95/0.12 pass.", patched "use sk-doc → /create:readme (start) 0.95/0.12 pass."
 plain sk-code row: "use sk-code 0.91/0.23 pass." before and after, exit=0
```

The pretty-printed probe lines are condensed to one line each. Every count in this spec quotes this block. The three `scratch/planning/` probes live in this phase folder, run from the worktree root by their full path and read no session store.

### Mechanism per Defect
`ADV` is `.skilled/skills/system-skill-advisor/runtime` and `SR` is `.skilled/hooks/shared/session-readers`.
- Delivery. `briefDelivered` (`ADV/scripts/routing-accuracy/command-offer.mjs:162`) decides Claude from the raw transcript, Pi from `loadSession` records and answers `unknown` for every other runtime. The runner calls it without a reader at run time (`run-command-behaviour.mjs:1073`), which is why Pi reads `unknown` in the committed log although its brief is in the stored user message. Devin keeps the brief in `role: system` nodes the chain mapping skips (`SR/devin.mjs:144`). DSH keeps it in a `user/message` whose source kind is `repo-guards`, which the reader drops (`SR/dsh.mjs:195`). The research expected the Pi brief in a `custom_message`. The stored sessions show it inside the user message text instead, so Pi needs only the run-time reader.
- Offers. `addScored` counts `offered` and `offerUnknown` only inside `if (result.startRow)` and its uncapped branch (`score-command-transcripts.mjs:1215`). The `create-changelog` offer is on an `ask` row and two OpenCode offers are on capped rows, so each runtime's three run-line offers of an expected command read as 0 to 2.
- Safety. `startState` returns `unsafe: selfAuto || (guarded && wrote)` (`:661`) and `loopsWithoutInit` is tallied apart (`:1237`).
- Host expansion. `normalize` turns only assistant text and tool calls into events (`:336`), so the user turn `<command-name>/deep:research</command-name>` that Claude Code writes is never an event, and the expanded body is an `isMeta` entry the Claude reader skips (`SR/claude.mjs:145`). Pi, Devin, DSH and OpenCode store the typed text unexpanded. Codex stores a 28,945-character first user message on each typed row with no tag, so whether Codex expanded the command is UNKNOWN.
- Restore. `restorePath` treats a path as tracked when `git ls-files --error-unmatch` succeeds (`run-command-behaviour.mjs:573`), which is true for a staged new file, then runs `git checkout -- <path>`, which copies the index back over the working tree. The staged file stays, the command exits 0 and the line says `restored: true`.
- Install. `CLAUDE.md` is in `FOLDED_COPIES` and is removed unless `--keep-claude-md` is given (`.skilled/commands/doctor/scripts/agents-md-embed.cjs:101`, `:746`). A10 passes an absent `CLAUDE.md` (`agents-md-check.cjs:692`). `/doctor:setup` runs six legs and neither prompt-hook check (`doctor-setup.yaml:53-58`).
- OpenCode brief. `cliRecommendations` (`.opencode/plugins/system-skill-advisor.js:558`) maps each CLI row to `skill`, `confidence`, `uncertainty`, `passes_threshold` and `ambiguousWith` and drops `command`, `policy` and `ownerSkillId`. It will drop `needsMode` too once phase 012 adds it. `renderAdvisorBrief` refills a dropped field only from the generated command row keyed by the recommendation id (`ADV/lib/render.ts:223`). A doctor bridge such as `command-doctor-setup` has that row, so OpenCode still names `/doctor:setup (run)`. A skill such as `sk-doc` has none, so OpenCode loses every command the advisor attaches to a skill. `recommendationFromCli` (`.skilled/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts:360`) keeps the three fields, and Codex, Cursor, Devin, Pi and DSH all reach it through the Claude advisor hook. The plugin is authored in `.opencode/plugins/` (`.opencode/SYNC.md`) and the hook-tree entry is a link to it, so the fix edits the plugin in place and no mirror is regenerated.

### Research Claims Checked in Code
- Rank 3 expects 120 unknown rows to move. Refuted in part: 95 move. Codex, Devin and Pi move 24 each and DSH 23, because one DSH line has no session id (`dsh|unknown|locator_unavailable` above). OpenCode's 24 stay `unknown` by decision Q3.
- Rank 3 places the Pi brief in `custom_message`. Refuted by the Pi probe. The reader still returns `custom_message` text as injected context, because the brief asks for it and a harness can use it.
- Rank 8 predicts OpenCode `offered 3` and `cappedOfferRows 2`. Confirmed by `sim.mjs`.
- Rank 10 predicts post-arm Devin `unsafe 2`. Consistent with Devin's one loop without init beside its one unsafe run. T025 confirms it.
- Rank 9 says the approval key is path-specific. Confirmed by the WARN on the arena.
- Rank 2 says `embed` removes `CLAUDE.md` by default. Confirmed in code.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A. Make delivery a stored fact: each of the Claude, Pi, Devin and DSH readers also returns the context a hook injected, `briefDelivered` reads it for Pi, Devin and DSH, Codex answers `false` when its hooks are registered and unapproved, the runner passes the reader at run time and a `--brief-only` backfill recomputes delivery without replaying offers.
- B. Count offers honestly: `offered` on every scored row, `cappedOfferRows`, `offerFieldAbsent` in place of `offerUnknown`, `deliveryUnknown`, `offerReached`, `offerSeen` and `offerDeclined` from the `COMMAND:` line, and a documented meaning for the capture's `offered` flag.
- C. Count a loop without init as unsafe.
- D. Refuse a Codex arm whose hooks are unapproved before any turn or log line.
- E. Leave an `@AGENTS.md` `CLAUDE.md` on the default embed install and report a missing pointer in A10.
- F. Add a seventh `/doctor:setup` leg for brief delivery.
- G. Restore a turn to HEAD, staged new files included, and report leftover paths honestly.
- H. Count a typed command Claude Code expands itself as a start of that command.
- I. Keep `command`, `policy`, `ownerSkillId` and `needsMode` in the OpenCode plugin's recommendation mapper, so an OpenCode brief names the command and policy a hook brief names.

### Out of Scope
- An OpenCode delivery marker. Decision Q3 leaves OpenCode `unknown` this phase.
- Rank 14, a Gate 2 clause for a skill-only brief. The operator froze the Gate 2 bullet.
- Approving any Codex hook or writing `~/.codex/config.toml`. Approval is the operator's trust step.
- Renaming the capture's `offered` key. It is in the committed baseline and the slice test interface, so it is documented in place (Q5).
- Changing the manifest's `CLAUDE.md` expectation text in `agents-md-manifest.json`. The check reports the missing pointer as INFO, which the manifest already allows.
- Rerunning any behaviour arm or starting any model session.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `SR/claude.mjs`, `SR/pi.mjs`, `SR/devin.mjs`, `SR/dsh.mjs` | Modify | Each ok result also carries `injected` |
| `SR/index.mjs` | Modify | `loadSession` passes `injected` through when a reader returns it |
| `SR/*.d.mts`, `SR/*.d.mts.map` | Regenerate | By `session-reader-declarations.mjs` only |
| `SR/README.md` | Modify | Describe `injected` |
| `.skilled/hooks/shared/tests/session-readers/{claude,pi,devin,dsh,injected-text}.test.mjs` | Modify | One case each |
| `ADV/scripts/routing-accuracy/command-offer.mjs`, `ADV/tests/command-offer.vitest.ts` | Modify | `codexHookApproval`, delivery from injected context, `briefOnly` backfill |
| `ADV/scripts/routing-accuracy/worktree-restore.mjs`, `ADV/tests/worktree-restore.vitest.ts` | Create | The turn restore and its fixture test |
| `ADV/scripts/routing-accuracy/run-command-behaviour.mjs` | Modify | Restore through the new module, `--brief-only`, the reader at run time and the Codex preflight |
| `ADV/scripts/routing-accuracy/score-command-transcripts.mjs`, `ADV/tests/command-transcript-score.vitest.ts` | Modify | Offer accounting, safety fold, `offerSeen` and host-expanded starts |
| `ADV/scripts/routing-accuracy/capture-command-routing-baseline.mjs` | Modify | One comment on `offered` |
| `ADV/scripts/routing-accuracy/README.md` | Modify | The new keys, flags and checks |
| `.skilled/commands/doctor/scripts/agents-md-embed.cjs`, `tests/agents-md-embed.test.cjs` | Modify | The pointer write and two amended assertions |
| `.skilled/commands/doctor/scripts/agents-md-check.cjs`, `tests/agents-md-check.test.cjs` | Modify | `pointer missing` as INFO and the corrected comment |
| `.skilled/commands/doctor/agents-md.md`, `assets/doctor-agents-md-embed.yaml` | Modify | The default now leaves a pointer |
| `.skilled/commands/doctor/assets/doctor-setup.yaml`, `doctor-setup-presentation.txt`, `setup.md` | Modify | The delivery leg and seven legs |
| `INSTALL-SKILLED.md` | Modify | The pointer and the delivery leg |
| `.opencode/plugins/system-skill-advisor.js`, `ADV/tests/system-skill-advisor-plugin.vitest.ts`, `.opencode/plugins/README.md` | Modify | The mapper keeps the four command fields, one test pins the OpenCode head and the README row names the mapper |

The restraint pass for each new file: `worktree-restore.mjs` is new because the runner runs `main` on import, so its restore cannot be tested without a live arm. Its test is new because no runner test exists. No other file is added.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | The Claude, Pi, Devin and DSH readers return `injected`, an array of `{ source, text }`, beside unchanged `records`, and `loadSession` passes it through only when a reader returns it. The declarations check prints `current`. |
| REQ-002 | `briefDelivered` answers `true` or `false` for Pi, Devin and DSH from records or injected context, `false` for Codex when `codexHookApproval` says `unapproved` and `unknown` for OpenCode. The runner passes the shared reader at run time. |
| REQ-003 | `node R --backfill POST --out SP/runs-post-attributed.jsonl --brief-only` keeps every offer field byte for byte and answers `briefDelivered` on 119 of 144 lines: Claude, Pi and Devin `true` 24 each, DSH `true` 23 and `unknown` 1, Codex `false` 24 and OpenCode `unknown` 24. |
| REQ-004 | The scorer counts `offered` on every scored row, adds `cappedOfferRows`, `offerFieldAbsent` (replacing `offerUnknown` in every reader), `deliveryUnknown`, `offerReached`, `offerSeen` and `offerDeclined`, and keeps `startRate` on every existing arm. |
| REQ-005 | A run whose loop command started without init counts as `unsafe`. |
| REQ-006 | A Claude user turn holding `<command-name>/<ns>:<name></command-name>` counts as a start when that command is the row's expected command, and `G2` rescoring prints Claude `start 3 of 6`. |
| REQ-007 | The restore puts every path a turn changed back to HEAD in index and working tree, removes a staged new file, never touches a path that was dirty before the turn and writes `restored: false` with `leftoverPaths` when the porcelain status differs from the pre-turn snapshot. |
| REQ-008 | The floors hold: typed recall at least 24 of 44, false offers 0 of 35, scorer eval `[159,50,20,5]` or better, the advisor and doctor suites and the reader suite report 0 failed, `route-validate.sh` exits 0 and the mirror check exits 0. |
| REQ-009 | No task writes under the home folder, starts a model session, approves a Codex hook or reads holdout prompt text. `AGENTS.md` and `.skilled/commands/create/` are unchanged, no dependency is added and no added comment names a spec path, task id, ADR or phase number. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-010 | A codex arm whose hooks are unapproved prints `{"ok":false,"code":"codex-hooks-unapproved",...}`, exits 2 and writes no run line. |
| REQ-011 | `embed` replaces a folded `CLAUDE.md` with `@AGENTS.md`, creates that pointer when `CLAUDE.md` is absent and the run writes another file, keeps the file under `--keep-claude-md` and A10 reports an absent `CLAUDE.md` as INFO `pointer missing` beside a root document. |
| REQ-012 | `/doctor:setup` runs seven legs, the seventh reading the prompt-hook wiring and the Codex approval, DEGRADED with the repair step and never FAIL when a hook is missing or unapproved. |
| REQ-013 | The install guide, the agents-md docs, the readers README and the routing-accuracy README describe the pointer, the leg, `injected`, the new keys, `--brief-only`, the preflight, the restore and the capture's `offered` meaning. |
| REQ-014 | The OpenCode plugin's `cliRecommendations` keeps `command`, `policy`, `ownerSkillId` and `needsMode` from each CLI row under the names `renderAdvisorBrief` reads. For `/create:readme for the utils folder` the OpenCode head then reads `use sk-doc → /create:readme (start)` like the Claude hook head, where it reads `use sk-doc 0.95/0.12 pass.` today. A plugin test pins it and the plugins README names it. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `jq -r 'select(.briefDelivered != "unknown") | .runtime' SP/runs-post-attributed.jsonl | wc -l` prints 119, up from 24, with no model run.
- **SC-002**: `jq -cS 'map_values(.post | [.offered,.cappedOfferRows,.startedOfOffered,.offerReached,.deliveryUnknown,.offerFieldAbsent,.unsafe])' SP/summary-after.json` prints `{"claude":[3,0,1,3,0,0,0],"codex":[3,0,0,0,0,0,0],"devin":[3,0,1,3,0,0,2],"dsh":[3,0,2,3,0,0,0],"opencode":[3,2,0,3,24,0,2],"pi":[3,1,1,3,0,0,1]}`. These values come from `sim.mjs`. A differing value is reported, never matched by changing code.
- **SC-003**: Rescoring `G2` prints Claude `start 3 of 6`, and the `startRate` of every runtime on `POST` and on `runs-pre-final.jsonl` equals its before value.
- **SC-004**: A temporary repository where a turn ran `git add` on a new file reads clean after the restore, and every floor in REQ-008 holds against `scratch/before.txt`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 011 edits the capture, its README and the install guide | A task here collides with a worker | No wave 1 task starts before the coordinator confirms phase 011 is committed and phase 012's diff misses section 3's files |
| Dependency | The six after-arm arenas under the system temp folder | If the OS clears them, the Codex approval check finds no `.codex/hooks.json` and Codex stays `unknown` | T002 records that they exist. T033 marks itself `[B]` with the printed counts rather than changing code |
| Risk | The plain backfill replays each offer in the arena and starts a daemon there | The committed offers could change under the measurement | The measurement uses `--brief-only`, which keeps the offer fields and replays nothing |
| Risk | Two embed tests assert that `CLAUDE.md` is gone after a fold | The brief says every existing test stays valid, and this change is told to keep the file | Logic-sync resolved in favour of scope item E: exactly two assertions change (`agents-md-embed.test.cjs:638` and `:842`), named in T009. Every other embed and check test stays as it is |
| Risk | A missing pointer as a FINDING would turn every fixture and this repository's own check red | High | It is INFO, so A10 stays PASS and `STATUS=OK` holds, and the line still prints |
| Risk | The new restore runs `git checkout HEAD --` and `git rm --cached` | Med: a wrong path list could discard work | It acts only on paths absent from the pre-turn snapshot, the first turn refuses a dirty tree and the fixture test covers a pre-dirty path |
| Risk | The predicted summary values come from a simulation | Low | T034 compares them and blocks on a difference |
| Risk | UNKNOWN: how Codex stores a hook's `additionalContext` once approved | An approved Codex stays `unknown` | Only `unapproved` maps to `false`. Approved Codex reads `true` only when the brief pattern is in its records or injected context |
| Risk | UNKNOWN: whether Codex expands a typed command before the model sees it | A Codex start could be undercounted | H reads only Claude's tag. Section 10 records it |
| Dependency | Phase 012 committed and the advisor runtime rebuilt | The T039 `needsMode` case cannot pass without phase 012's renderer | Wave 7b starts only after phase 012 is committed, and T039 checks the built renderer before it edits |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: `codexHookApproval` spawns one short read-only process per Codex line or arm, with a 10,000 ms timeout.
- **NFR-P02**: The readers add one pass over entries they already parse, with no extra file read.

### Security
- **NFR-S01**: No task writes under the home folder. The approval check and the readers only read there.
- **NFR-S02**: No task prints prompt text. The backfill still refuses a holdout row before it writes.

### Reliability
- **NFR-R01**: A reader that has no injected context returns the same object it returns today.
- **NFR-R02**: A failed approval check reads `unknown`, never `false`.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: a session with no injected entry returns `injected: []` and its delivery is `false` only when the session loaded.
- Maximum input: an arena with 48 staged paths is restored path by path and the final porcelain comparison lists any that remain.
- Failure path: a restore that leaves a path writes `restored: false` with `leftoverPaths`, and the runner stops the arm with `restore_failed`.
- A path dirty before the turn is never restored. When the turn changes it further it is listed as left over.
- A `<command-name>` tag naming another command, or appearing in a non-Claude store, never counts.
- `CLAUDE.md` as a symlink is left alone by the pointer write.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 17/25 | About 30 files across the shared readers, the routing-accuracy scripts, the doctor engines and assets and the install guide |
| Risk | 10/25 | No routing input changes. The restore runs git commands that discard changes, guarded by the snapshot and a fixture |
| Research | 6/20 | Each mechanism is read in code and the stores are probed read-only |
| **Total** | **33/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

### Resolved

Each answer is an autonomous decision under the packet goal's D1, recorded on 2026-11-13.

- Q1. Use the plain backfill command the brief names? Decision: no, add `--brief-only` (Recommended). The plain backfill replays every offer in a temporary arena and warms a daemon there, so it can rewrite the committed offers it is meant to keep.
- Q2. Which unknown rows move? Decision: 95 of 120, recorded as such (Recommended). The brief's 96 counted the DSH line that has no session id.
- Q3. OpenCode: a debug marker under `.skilled/skills/.state/` or `unknown`? Decision: `unknown` this phase (Recommended). No marker exists for the committed arm, so the measured target cannot move. A marker written inside the transform proves the plugin ran, which segment two eliminated as proof of host delivery. It adds a write path and an env var to a hot plugin while other workers edit the runtime. Revisit when an OpenCode arm is next planned.
- Q4. What does `startedOfOffered` count now? Decision: uncapped offered rows that started, any policy, and the text prints it over `offered` minus `cappedOfferRows` (Recommended). On the after arm the values equal today's.
- Q5. Rename the capture's `offered` key? Decision: document it as top-three presence in a comment and the README (Recommended). The key is in the committed baseline and the slice test interface.
- Q6. Missing pointer as FINDING or INFO? Decision: INFO (Recommended). A FINDING breaks `this repository reports STATUS=OK` and every fixture loop.
- Q7. Create a pointer when `CLAUDE.md` is absent on every run? Decision: only when the run writes another file (Recommended). Otherwise `a missing router is created only when asked for` loses its `NOTHING TO DO`.
- Q8. Which delivery result is DEGRADED? Decision: a missing prompt hook, an unapproved or absent Codex entry. Exit 2 from either check is ERROR. Nothing is FAIL (Recommended).
- Q9. Does a Codex `absent` entry answer `false`? Decision: no, `unknown` (Recommended). The brief names only registered and unapproved hooks.
- Q10. Does a host-expanded command count as a spoken command for the `:auto` check? Decision: no (Recommended). The tag is the operator's typed text, not the model's choice.
- Q11. Fix the OpenCode mapper here or leave it to phase 012? Decision: here, in wave 7b (Recommended). Phase 012 lists the mapper as out of its scope and records the drop for this phase. The fix is seven lines in one function, and the hook mapper already keeps the same fields.
- Q12. Which doc names the mapper? Decision: the plugins README (Recommended). Phase 012 edits the hook guide, so a second edit there would collide.

### Open

- Does Codex expand a typed command into its first user message? UNKNOWN. The stored typed rows hold a 28,945-character first user message with no tag. Owner: a later Codex probe.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Acceptance Criteria**: See `acceptance-criteria.md`
- **Research**: `../009-ux-performance-cross-cli-research/research/research-segment-2.md`

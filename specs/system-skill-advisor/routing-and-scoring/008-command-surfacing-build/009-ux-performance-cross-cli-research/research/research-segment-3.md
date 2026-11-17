---
title: "Command surfacing research, segment three: merged ranking and proposed dispositions"
description: "Draft merged synthesis of the offer-reach-3, cross-cli-3 and ux-cost-3 lineages, run against the built phases 011, 012 and 013, for the coordinator to review and decide."
trigger_phrases:
  - "command surfacing research segment three"
  - "degraded path and hook health research"
---
# Command Surfacing Research, Segment Three

Draft by Opus 5.5 for coordinator review

Merged synthesis of three lineages run on 2026-11-13 against the built state at `320e7b64d4`: `lineages/offer-reach-3/research.md`, `lineages/cross-cli-3/research.md` and `lineages/ux-cost-3/research.md`. Executor: `opencode-go/deepseek-v4.1-flash` at max effort through `cli-opencode`, six iterations per lineage at most, convergence threshold 0.05. Every disposition in this file is proposed and not final. Segment one stays in `research.md` and segment two in `research-segment-2.md`.

## 1. What the build showed

Phases 011, 012 and 013 are committed. At `320e7b64d4` the committed capture reads typed delivery 44 of 44, typed recall 24 of 44, false offers 0 of 35 and scorer eval `[160,50,21,5]`. Plain reach reads 23 of 45 on the tune split and 1 of 44 on the holdout split. That capture uses fixture vectors. The same capture with the live embedder reads 28 of 45 and 3 of 44 with every floor held (`lineages/offer-reach-3/prompts/real-embed-capture.json`). Delivery is answered on 119 of 144 arm lines. Claude Code lists 32 of 44 commands. The OpenCode brief text equals the hook brief on nine probe prompts. The live brief costs 296 bytes on a session's first prompt and 78 bytes after it.

Three findings carry the segment:

1. **The plain gap is wrong tops and missing evidence, and the label phase 012 added often points the wrong way.** 13 of the 17 plain tune rows that get no command have a wrong top (7) or no recommendation at all (6). The `(needs a mode)` label heads 4 of the 17 and names the hub that owns the expected command on only 1. By the same code path it also heads three near-miss rows that must stay silent.
2. **The degraded path is rare but not zero, and it runs the wrong scorer.** The recorded arms hold no stale brief in 118 Claude transcripts. Real Claude sessions on this machine hold 132 stale briefs out of 8,548 injected, and 47 of 1,908 since 2026-11-06. That is an upper bound, because a live daemon serving a stale graph also reads stale. The fallback runs the legacy Python analyzer, which sends a plain readme request to `system-spec-kit`. An in-process call of the TypeScript handler already exists inside that same Python scorer.
3. **Health and cost are measured on the wrong arm.** The hook writes health records only under `SKILL_ADVISOR_DEBUG`, so 18 of the 123 workspace keys on this machine hold any. The committed brief-cost script measures the outage line at 361 bytes where the live brief is 296. OpenCode adds a 73 to 83 byte line that always reads `targets=none`.

## 2. Checks made on the lineage claims

Each claim a ranked item rests on was re-read or rerun by this draft. No daemon, model session or capture was started, because other loops run in this tree.

| Claim | Check | Result |
|---|---|---|
| 17 of 45 plain tune rows render no command, 27 render one on the head and 1 on the `Also:` line (offer-reach-3) | Re-read the top and command of every row in `offer-reach-3/prompts/tune-live.jsonl` | Confirmed. 18 rows have no head command and one of them, `cmd-doctor-deep-loop-plain-tune-01`, carries `/doctor:deep-loop` below the head. Not rerun live, because a live run starts the worktree daemon |
| The two quality-control rows route to a mode with no command (offer-reach-3) | `compiled-route.cjs --hub sk-doc` on both prompts and `MODE_COMMANDS` at `command-attach.ts:15` | Confirmed. Both `route` to `sk-create-quality-control`, which has no entry |
| The proposed quality-control phrases reach no floor row, and a bare `rewrite` would steal the diff row (offer-reach-3 R1) | Phrase match over the 132 non-holdout rows, printing ids only | Confirmed. Each phrase matches only its own tune row and `rewrite` also matches `cmd-create-diff-plain-tune-01`. Three of the four phrases are copied from those two rows, so the gain is tune-only by construction |
| The four `(needs a mode)` rows are an ask and not a defect (offer-reach-3 section 5) | Expected command per row against `MODE_COMMANDS`, and `compiled-route.cjs --hub sk-doc` on the save, complete and doctor rows | Failed on 3 of 4. `/speckit:save`, `/speckit:complete` and `/doctor:sk-skill` are not `sk-doc` modes and `sk-doc` defers on all three. Only `cmd-create-repo-rule-plain-tune-01` is a real ask |
| The two `sk-code` rows need a mode label (offer-reach-3 R3) | `compiled-route.cjs --hub sk-code` on both prompts and `MODE_COMMANDS` | Failed. `sk-code` defers on the implement row and routes the doctor row to `sk-code-quality`. It has no mode table and both expected commands belong to other owners, so these are wrong tops |
| `alreadyOffered` withholds a hub command that ranks below the head (offer-reach-3 R5) | `advisor-recommend.ts:449-480` and `render.ts:533-602` | Confirmed. The renderer prints one head, so the command at rank 2 never reaches the brief |
| Five no-recommendation commands have a scorer row and `/create:skill-parent` has none. Five of the six mutate (offer-reach-3 R2) | `TRACKED_COMMANDS` and the command rows at `command-attach.ts:86-240` | Scorer rows confirmed. "Five of six mutate" failed: `/doctor:install`, `/doctor:setup` and `/speckit:search` are read-only `run` commands, `/doctor:speckit` is add-only, `/doctor:update` mutates and `/create:skill-parent` is `start` |
| Three doctor-family floor rows pass the render gate at confidence 0.82 (offer-reach-3) | Re-read `offer-reach-3/prompts/none-floor-live.jsonl` | Confirmed: `mns-chat-03` 0.82/0.34, `nm-system-skilled-doctor-01` 0.82/0.22 and `sv-03` 0.82/0.26. All 35 floor rows carry 0 commands in all three slots |
| The real lane embeds only the `SKILL.md` description while the fixture lane composes intent signals (offer-reach-3) | `skill-graph-db.ts:743` and `:1406-1432`, `semantic-shadow.ts:263-265` | Confirmed. Command vectors embed a composed `embeddingText` (`skill-graph-db.ts:782-808`), so command intent signals do reach the real lane |
| The real-embedding capture reads 28 of 45 tune and 3 of 44 holdout with every floor held (offer-reach-3) | `jq` over `real-embed-capture.json` beside the committed baseline | Confirmed at `320e7b64d4`: typed recall 24 of 44, false offers 0 of 35, attached false offers 0 of 35. Not rerun, because it is a full capture against the live embedder |
| The fallback keeps a typed command and sends a plain readme request to another skill (phase 012 `live-heads.txt`) | The CLI's own fallback step, `skill_advisor.py --threshold 0.8 --uncertainty 0.35 --stdin` with `SPECKIT_SKILL_ADVISOR_FORCE_LOCAL=1` (`skill-advisor-cli.ts:1455-1475`) | Confirmed. The typed readme prompt tops `command-create-readme` 0.95/0.15, which `degradedRecommendations` keeps with its command. The plain readme prompt tops `system-spec-kit` 0.95/0.20. Each call took 177 to 296 ms |
| The fallback drops even a typed command and the plain readme now tops `sk-doc` (cross-cli-3 section 7.1) | Read `cross-cli-3/scratch/degraded-parity.mjs` beside the run above | Failed. The probe ran the Python scorer without the force-local variable, so the scorer took its native in-process bridge (`skill_advisor.py:766-786` and `:5526-5537`) and not the analyzer the CLI runs |
| The degraded path was taken zero times (both lineages) | Count `hook_additional_context` attachments that start `Advisor: stale` in Claude transcripts | Confirmed for the arms: 0 of 118 arena transcripts. Failed as a statement about use: 132 of 8,548 injected briefs across all Claude sessions on this machine, none with a command. Upper bound, because `freshness.ts:275-305` also serves `stale` from a live daemon |
| An overlong socket path reaches the fallback (offer-reach-3 section 8) | `skill-advisor-cli.ts:1364-1365`, `:1027` and `:1565` | Failed. It throws `CliProtocolError`, which exits 69, and only exit 75 reaches the local scorer. The hook fails open instead |
| OpenCode adds a 73 to 83 byte block the hook does not (cross-cli-3 rank 2) | `system-skill-advisor.js:592-603` and `:1586-1600`, `cross-cli-3/scratch/render-entries.json` | Confirmed, with a root cause the lineage did not name: compiled-route targets are objects and the summary keeps strings only (`:600`), so all 7 lines read `targets=none`, including 6 that say `outcome=route` |
| Claude lists 32 of 44 (cross-cli-3) | `sync-runtime-mirrors.cjs --check` | Confirmed: `visibility claude 32/44, cursor 44/44` and `PASS: 256 mirrors`, exit 0 |
| A generated Claude `create` skill costs nothing on the other five runtimes (cross-cli-3 rank 1) | `ls -la` of each runtime folder | Partly failed. `.claude/skills`, `.opencode/skills`, `.pi/skills` and `.devin/skills` are all symlinks to `.skilled/skills`. The claim holds only if Claude's link becomes a managed tree. A file written through the link enters the canonical inventory that OpenCode, Pi, Devin and the advisor graph read |
| Codex `false` conflates an unapproved hook with a delivery failure (cross-cli-3 rank 6) | `command-offer.mjs:263-281` | Failed. `false` is returned only for `unapproved`. An approved hook with no brief returns `unknown` |
| `deliveryUnknown` counts only scored rows (cross-cli-3 rank 5) | `score-command-transcripts.mjs:1281-1300` | Confirmed |
| Diagnostics are written only under `SKILL_ADVISOR_DEBUG`, with a 30-record window and a 200-record file (ux-cost-3) | `metrics.ts:179-180`, `:319-320` and `:445-451` | Confirmed. The file is trimmed back to 200 once it passes 300 lines |
| The health reader needs no skill label, so a health-only record keeps the skill out (ux-cost-3) | `metrics.ts:465-481` and `advisor-status.ts:499-505` | Confirmed for the reader. The privacy gain is smaller than stated: the outcomes log is written without the debug gate and holds a sanitized skill label (`metrics.ts:499-529`) |
| Only Claude, Codex, Cursor and Devin would write health records, and OpenCode, Pi and DSH have no writer (ux-cost-3) | Pi `hooks/pi/prompt-advisor.ts:273-300` and DSH `adapters/prompt-advisor.mjs:18` and `:124` | Failed for Pi and DSH. Both call `handleClaudeUserPromptSubmit`, which persists the record through `emitDiagnostic` (`user-prompt-submit.ts:238-256`). Only OpenCode has no writer |
| 17 diagnostics files against 119 outcomes files (ux-cost-3) | File count in the metrics root | Confirmed and still growing: 18 against 123 |
| The committed brief-cost script measures the outage line (ux-cost-3 rank 2) | Byte distribution of `ux-cost-3/scratch/brief-cost-head.json` and the socket setup at `measure-brief-cost.mjs:162` and `:239` | Confirmed by shape: 40 rows at 361 bytes and 4 at 408 across 44 different commands, against a live median of 296. The text was not printed |
| A same-content repeat drops the directive block (ux-cost-3) | `directive-lifecycle.ts:148-150` | Confirmed |
| The plugin brief equals the hook brief on nine prompts (cross-cli-3) | Re-read `cross-cli-3/scratch/render-parity.json` | Confirmed from the artifact, `same: true` on 9 of 9. Not rerun, because it calls the live daemon |
| `(needs a mode)` reaches silent floor rows (new in this merge) | `compiled-route.cjs` on each floor row whose top is a mode-table hub, `advisor-recommend.ts:480` and `render.ts:550` | Inferred from code and routes: `nm-sk-doc-01`, `nm-sk-design-01` and `nm-system-skill-advisor-01` defer on a hub in `MODE_COMMANDS` with a top that passes the gate. One hook render of each would confirm it |

Not rerun: the paired hook latency (median delta -4.69 ms), the diagnostic append cost (0.26 ms), the embedder warm cost and the per-row live tune heads. The cold embedder sample could not be taken by any lineage, because the model was loaded.

## 3. Merged ranking and proposed disposition

Ranked by expected gain in commands started when useful, or silent failures removed, per unit of risk to the floors (typed recall 24 of 44, false offers 0 of 35, scorer eval `[160,50,21,5]`). A structural change that every prompt of a class takes ranks above a phrase that only a tune row uses, because plain reach is 23 of 45 on tune and 1 of 44 on holdout.

| Rank | Recommendation | Source | Proposed disposition |
|---|---|---|---|
| 1 | Default a health-only hook diagnostic record and count degraded answers in it | ux-cost-3 1, offer-reach-3 open question 1 | Build now |
| 2 | Show `(needs a mode)` only when the prompt names the hub. Reopens segment two rank 6 with the measurement in section 2 | New in this merge | Build now, after one hook render confirms the floor-row label |
| 3 | Attach a hub's command to the head when the same command sits only on an unrendered row | offer-reach-3 R5 | Build now |
| 4 | Drop the OpenCode compiled-routing line | cross-cli-3 2 | Build now |
| 5 | Make `measure-brief-cost.mjs` refuse an outage arm and report the head | ux-cost-3 2 | Build now |
| 6 | Score the degraded answer with the TypeScript handler in process, then apply the Q026 filter | offer-reach-3 R4, cross-cli-3 3 corrected | Build in a later phase. It adds a second call site of the scorer inside the hook's 2.5 s budget and needs its own cold timing and floor check |
| 7 | Restore Claude's 44 of 44 with a Claude-only `create` skill and a managed `.claude/skills` tree. Reopens segment one rank 9 with cross-cli-3's measurement that every other runtime resolves all commands | cross-cli-3 1, cost corrected | Wait on the operator. Phase 011 logged the `create` collapse as an operator item, and the fix changes how Claude reads every skill. One live Claude listing must come first |
| 8 | Add two quality-control alias pairs to the `sk-doc` hub | offer-reach-3 R1 | Build now as a rider, recorded as a tune-only gain |
| 9 | Carry the hook-health section's age as `lastRecordAt` | ux-cost-3 3 | Build now with rank 1, as one schema change |
| 10 | Give the six no-recommendation commands evidence through command intent signals, and `/create:skill-parent` a scorer row | offer-reach-3 R2, reshaped | Build in a later phase. It needs a scratch-DB real capture with a holdout count, because three doctor-family floor rows pass the gate at 0.82 |
| 11 | Count `deliveryUnknown` on run lines and give the one DSH line a session id | cross-cli-3 4 and 5 | Build with the next arm's preparation. It needs no phase of its own |
| 12 | Let the degraded brief carry the plain command as well | offer-reach-3 R4 and cross-cli-3 3 as written | Wait on the operator. Decision Q026 chose "Only a typed command" over "Same as the live path". Rank 6 makes the change possible |
| 13 | Default a doctor subcommand for the doctor wrong-top pair | offer-reach-3 R6 | Wait on the operator, who owns the policy for a seven-subcommand family |
| 14 | Label `sk-code` with `(needs a mode)` | offer-reach-3 R3 | Decline. `sk-code` modes carry no command and both rows' commands belong to other owners |
| 15 | Split Codex `false` into unapproved and not-delivered | cross-cli-3 6 | Decline. `false` already means unapproved only |
| 16 | Enrich skill intent signals and re-embed the skill graph | segment two rank 15, offer-reach-3 | Decline as a build again. It adds 0 commands to the 17 rows. Open question 5 keeps the holdout measurement |

Detail for every item proposed for a build:

| Rank | Files | Measurable gain | Verify | Floor risk |
|---|---|---|---|---|
| 1 | `runtime/lib/metrics.ts` (`persistAdvisorHookDiagnosticRecord` writes a health subset with `requireDebug: false`), `hooks/claude/user-prompt-submit.ts` (`emitDiagnostic` keeps `status`, `freshness`, `durationMs`, `cacheHit` and a degraded flag when the variable is unset), `runtime/handlers/advisor-status.ts` and `runtime/schemas/advisor-tool-schemas.ts` (a rolling degraded rate), `runtime/tests/handlers/advisor-status.vitest.ts` | Hook health on every hook install of five runtimes (Claude, Codex once approved, Devin, Pi and DSH) instead of 18 workspace keys. The degraded share becomes a number where today it is an upper bound of 132 of 8,548 | One hook payload with `SKILL_ADVISOR_DEBUG` unset, then `advisor_status --format json` prints `hookHealth.invocations` 1. A vitest asserts the default record has no `skillLabel`. A 250-write fixture leaves 200 lines. The command capture still prints 24 of 44 and 0 of 35 | None. About 120 bytes and 0.26 ms per prompt (ux-cost-3, not rerun), file capped at 200 records in the OS temp folder, mode 0600 |
| 2 | `runtime/lib/command-attach.ts` (`routeNeedsMode` takes the explicit skill marker `prompt-policy.ts` already reads), `runtime/handlers/advisor-recommend.ts:480`, `runtime/tests/command-attach.vitest.ts`, `runtime/tests/command-brief-golden.vitest.ts` and a `needsMode` field on floor rows in `capture-command-routing-baseline.mjs` | The label leaves 3 tune rows where it names the wrong hub (`cmd-speckit-save-plain-tune-01`, `cmd-speckit-complete-plain-tune-01`, `cmd-doctor-sk-skill-plain-tune-01`) and 3 near-miss floor rows, one of them "fix the typo in the heading of the setup guide". It stays on the two live-head prompts that name the hub. It leaves `cmd-create-repo-rule-plain-tune-01`, the one row where it names the right hub | The capture prints `needsMode` on 0 of 35 floor rows. The live heads for "use the sk-doc skill" and "use the system-deep-loop skill" keep the label | None to commands. It removes a label and offers nothing |
| 3 | `runtime/handlers/advisor-recommend.ts:449-473` (skip the duplicate guard for the head when `compiledRouteTopOnly` is set), `runtime/tests/handlers/advisor-recommend-compiled-route-option.vitest.ts` | `cmd-create-agent-plain-tune-01` renders `/create:agent (start)`. The fix holds for any prompt where a hub tops and its own command row sits below | The capture moves tune combined by 1 in both regimes and attached false offers stay 0 of 35. A unit test pins the head command | Low. The command is already in the result, and the 35 floor rows carry no command in any of their three slots |
| 4 | `.opencode/plugins/system-skill-advisor.js` (`compiledRouteSummary` at `:592-603` or the push at `:1586-1600`), `.opencode/plugins/lib/skill-advisor-render.js:124`, `runtime/tests/system-skill-advisor-plugin.vitest.ts` | 73 to 83 bytes off every routed OpenCode prompt, 561 bytes over the nine probe prompts. OpenCode's injected bytes then equal the hook's | A plugin test asserts one system entry for a routed prompt. The `render-entries` probe prints one entry per prompt | None. The head entry is unchanged |
| 5 | `runtime/scripts/measure-brief-cost.mjs` and one `node:test` fixture with a stub hook | The committed cost check reports the live 296 bytes and a head median of 78 instead of the outage line's 361 | With every row on the outage line it exits 2 with `degraded_brief`. With live rows it prints the row count, live rows and both medians | None. A measurement script |
| 6 | `runtime/skill-advisor-cli.ts` (`runLocalScorer` calls `handleAdvisorRecommend` in process with the hook's options, then `degradedRecommendations`) | On a degraded prompt the top and the mode label match the live answer and typed commands stay. The plain readme prompt moves from `system-spec-kit` to `sk-doc` | A vitest forces exit 75 and compares the degraded top and `needsMode` with the daemon fixture on the live-heads prompts. The in-process call is timed from a cold process against the 2.5 s hook budget | Medium. A second call site of the scorer. It must import the handler and never copy it. The daemon path and its floors are untouched |
| 8 | `.skilled/skills/sk-doc/hub-router.json` and the served manifests through `sync-runtime-mirrors.cjs` | 2 tune rows: `cmd-create-readme-plain-tune-01` and `cmd-create-with-human-voice-plain-tune-01`. Expected holdout gain is 0 | `compiled-route.cjs --hub sk-doc` names the two modes. The capture prints tune plus 2 and 0 of 35 | None measured on non-holdout rows. A bare `rewrite` must not be added |
| 9 | `runtime/handlers/advisor-status.ts`, `runtime/schemas/advisor-tool-schemas.ts`, `runtime/tests/handlers/advisor-status.vitest.ts`, `.skilled/commands/doctor/assets/doctor-setup.yaml` | OpenCode, which has no writer, and an unapproved Codex install show the age of the last record instead of a silent green | A fixture record with a fixed time comes back as `hookHealth.lastRecordAt` | None at runtime. `hookHealth` is a `.strict()` schema, so it lands with a rebuild and its parse test |
| 10 | Intent signals in the owning `command-metadata.json` (they feed the command vector's `embeddingText`), the bridge deriver for `/create:skill-parent` and `lanes/explicit.ts` only as a last resort | Up to 6 tune rows. Three of the five scored commands are read-only `run` commands | A real-embedding capture against a scratch copy of the DB prints tune and holdout counts. `mns-chat-03`, `nm-system-skilled-doctor-01` and `sv-03` stay command-free | Medium. The three doctor-family floor rows pass the gate at 0.82 |
| 11 | `score-command-transcripts.mjs:1300` and `run-command-behaviour.mjs` (DSH locator) | One DSH line moves from invisible to counted | A fixture with an unscored `unknown` line increments the counter | None |

## 4. Answers to the carried questions

### (a) Plain tune rows with no command after phase 012

17 of 45 rows, by row id. Source: `offer-reach-3/prompts/tune-live.jsonl`, the routes in section 2 and `MODE_COMMANDS`.

| Cause | Rows |
|---|---|
| Below threshold | `cmd-doctor-install-plain-tune-01`, `cmd-doctor-setup-plain-tune-01`, `cmd-doctor-speckit-plain-tune-01`, `cmd-doctor-update-plain-tune-01`, `cmd-speckit-search-plain-tune-01`. Each has a scorer row and the advisor returns nothing |
| No command evidence | `cmd-create-skill-parent-plain-tune-01` has no scorer row. `cmd-create-readme-plain-tune-01` and `cmd-create-with-human-voice-plain-tune-01` route to `sk-create-quality-control`, a mode with no command |
| Wrong top | `cmd-doctor-mcp-plain-tune-01` (`mcp-code-mode`), `cmd-doctor-skill-advisor-plain-tune-01` (`system-skill-advisor`), `cmd-speckit-implement-plain-tune-01` (`sk-code`, defers) and `cmd-doctor-sk-code-plain-tune-01` (`sk-code`, routes to `sk-code-quality`). Also `cmd-speckit-save-plain-tune-01`, `cmd-speckit-complete-plain-tune-01` and `cmd-doctor-sk-skill-plain-tune-01`, which top `sk-doc` with a `(needs a mode)` label that names the wrong hub |
| Hub defers | `cmd-create-repo-rule-plain-tune-01`. `sk-doc` defers and `/create:repo-rule` is one of its modes, so the label is right |
| Policy or cap | `cmd-create-agent-plain-tune-01`. The `create:agent` row holds `/create:agent` at rank 2, the duplicate guard withholds it from the head and the renderer prints one head |

Holdout: 1 of 44 with fixture vectors and 3 of 44 with the live embedder. The meaning lane is the only change measured to move holdout rows.

### (b) Intent-signal enrichment and re-embedding

The real skill vector is the `SKILL.md` description alone (`skill-graph-db.ts:743` and `:1406`). Skill intent signals reach the cosine lane only in the fixture regime. Command vectors already embed their intent signals. The live embedder moves five tune rows to a correct top (`cmd-doctor-env`, `cmd-doctor-git`, `cmd-doctor-symlink`, `cmd-speckit-handoff`, `cmd-speckit-plan`), all of which already carried a command, and two holdout rows. It adds 0 commands to the 17 rows. An enriched composition was not measured, because no read-only switch composes it. Cost of keeping vectors in step: 60 vectors in a 561 KB file and about 83 ms to re-embed the 14 skill vectors warm. Refresh is gated by a content hash and drift is reported by `readAdvisorEmbeddingStaleness`. Floor risk: a new skill text reranks every skill. Proposed: declined as a build (rank 16), with the holdout measurement kept as open question 5.

### (c) The hook-health default

Proposed default: a health subset on, the content subset behind `SKILL_ADVISOR_DEBUG` (rank 1). Bytes: full records average 201.7 bytes as measured, and a health subset is about 120 bytes by ux-cost-3's estimate. Latency: 0.26 ms median and 1.96 ms p95 per append. 30 paired hook runs showed no wall-clock cost above noise. Growth: capped at 200 records per workspace key, about 24 KB, trimmed past 300 lines. Privacy: the subset holds no prompt and no skill label, in a 0600 file inside a 0700 folder. The outcomes log already records sanitized skill labels without the gate (`metrics.ts:529`), so the subset adds no new kind of data. Reach: Claude, Codex once approved, Devin, Pi and DSH, because all five run `handleClaudeUserPromptSubmit`. OpenCode has no writer. Adding a degraded flag to the subset answers the frequency half of (g).

### (d) The OpenCode plugin brief beside the hook brief

| Aspect | Hook | Plugin | Evidence |
|---|---|---|---|
| Brief text | 286, 286, 305, 298, 244, 294, 292, 296 and 293 bytes on nine prompts | Byte-identical | `cross-cli-3/scratch/render-parity.json`, re-read |
| Extra entry | None | `Compiled routing (served=compiled): hub=... outcome=... targets=none` on 7 of 9, 73 or 83 bytes. The targets are dropped because they are objects | `system-skill-advisor.js:592-603` and `:1586-1600` |
| Channel | `hookSpecificOutput.additionalContext` | A system entry on `output.system`, kept in memory only | cross-cli-3, not rerun |
| Request | Sends `includeCompiledRoute`, `compiledRouteTopOnly` and the caller thresholds | Sends `surfaceHint` and neither flag | `skill-advisor-cli-fallback.ts:228-245`, `system-skill-advisor.js:1259` |
| Thresholds | Reads `effectiveThresholds` from the answer | Uses its own constants and never reads the echo | `skill-advisor-cli-fallback.ts:341`, `system-skill-advisor.js:573` |
| Command line | `--json - --format json --timeout-ms N --no-warm-only` | `--json - --format json` with the host environment | `skill-advisor-cli-fallback.ts:253-266`, `system-skill-advisor.js:713` and `:1266-1269` |
| Fail-open path | The hook renders the fallback text | A plugin-local copy held equal by a parity test, 244 bytes on both | cross-cli-3, not rerun |
| Repeat | Head only on a same-content repeat, reset also on transcript shrink | Head only, reset on startup, resume, compact, generation or epoch | `directive-lifecycle.ts:148-150`, cross-cli-3 |

The command-line row matters for (g). Without `--no-warm-only` the plugin's CLI follows `defaultWarmOnly()`, which turns on only under a prompt-time variable that no repository file sets outside `.env.example`. So the plugin most likely starts a cold daemon and reaches the local scorer like the hook. That is inference until an OpenCode arm records it.

### (e) Claude's 32 of 44 without renaming a command

The collapse is one folder, `.claude/commands/create/`, where `skill.md` hides its 12 siblings. Every other runtime resolves all commands. Codex, Pi and DSH use flat prompt names and Devin has no command surface, so the `create` folder affects none of them.

| Option | claude | codex | opencode | pi | devin | dsh | Proof of 44 of 44 |
|---|---|---|---|---|---|---|---|
| Claude-only generated `create` skill, with `.claude/skills` turned from one symlink into a managed tree | 12 commands return. The managed tree must track every skill | 0 | 0 | 0 | 0 | 0 | One live listing shows `create` and `create:readme` together, then `--check` counts command links plus the skill link |
| The same skill written through today's symlink | As above | 0 | A `create` skill joins its skill list | Same | Same | 0 | As above. The advisor graph would index it, which can move the floors |
| Case-only mirror name `SKILL.md` | Effect UNKNOWN | 0 | 0 | 0 | 0 | 0 | A live listing. Today's count would print 44 whether or not the collapse persists |
| Nested `create/skill/index.md` | Effect UNKNOWN | 0 | 0 | 0 | 0 | 0 | A live listing |
| Colon-named root file `create:skill.md` | Effect UNKNOWN, unusable on Windows paths | 0 | 0 | 0 | 0 | 0 | A live listing and a path test |
| Drop the collapsed entry | 43 of 44, an honest loss | 0 | 0 | 0 | 0 | 0 | The count prints 43 |

Whatever option is chosen, the check must change with it. `commandVisibility` counts a `skill.md` folder as one entry whatever Claude does, so it must count both surfaces and fail any folder that holds `skill.md` beside siblings.

### (f) Brief cost, cold start and a cut that loses nothing

| Measure | Value | Source |
|---|---|---|
| Live brief, 44 typed rows, first prompt of a session | Median 296 bytes, about 74 tokens | `ux-cost-3/scratch/live-brief-cost.json` |
| Same, every later prompt | Head only, median 78 bytes, about 20 tokens | same file, `directive-lifecycle.ts:148-150` |
| OpenCode extra line | 73 to 83 bytes on each routed prompt | `render-entries.json` |
| Committed script at HEAD | 361 bytes, the outage line | `brief-cost-head.json` |
| Cold first call of the embedder | UNKNOWN this segment. Prior 538.53 ms (phase 008), and a cold first prompt median of 742 ms with fail-open 0 of 5 (phase 010) | phase summaries |

The only cut that loses nothing is OpenCode's compiled-routing line (rank 4). The head entry that names the command, the policy and the skill is the first system entry and does not change, so the same command, policy and skill reach the model before and after (`render-entries.json`, entry 1 against entry 2). A head cut of 22 bytes drops freshness, scores and the pass mark and so fails the test. Trimming the directive was eliminated in segment one. The started command's document, at a median of about 1,131 tokens, still dominates the token cost.

### (g) The degraded path

Who reaches it: Claude, Devin, Pi, DSH and Codex once its hook is approved all run `handleClaudeUserPromptSubmit`, which starts the CLI with `--no-warm-only`. The CLI falls back to `skill_advisor.py` only on a retryable failure, exit 75 (`skill-advisor-cli.ts:1017-1022` and `:1565`): a refused or missing socket, a timeout, a reset, a busy database or `backend unavailable`. OpenCode most likely reaches it too, per (d).

What does not reach it: a cold daemon alone, because the CLI starts it and waits (phase 010 measured cold fail-open 0 of 5). An overlong socket path, which exits 69 and fails open. A sandbox that denies a socket would most likely raise `EPERM` or `EACCES`, which the retryable pattern does not list, so Codex under `workspace-write` would fail open rather than degrade. That last point is inference until an approved Codex run records the error.

How often: 0 of 118 Claude arena transcripts. In real Claude sessions on this machine, 132 of 8,548 injected briefs read stale (1.5 percent) and 47 of 1,908 since 2026-11-06 (2.5 percent), with none carrying a command. Fail-open outages were 109 overall and 5 since 2026-11-06. The stale count is an upper bound until rank 1 records which answers were degraded.

What it loses at HEAD, from the force-local run: the typed readme prompt keeps `/create:readme` with policy `start`. The plain readme prompt tops `system-spec-kit` where live tops `sk-doc` with `/create:readme`. The doctor setup prompt tops `system-skilled-doctor` 0.81/0.30 where live names `/doctor:setup`. The mode label is always lost, because `degradedRecommendations` has no `needsMode`.

Smallest change: call `handleAdvisorRecommend` in process from the CLI with the hook's options, then shape it (rank 6). The Python scorer already makes this call with no daemon through its native bridge (`skill_advisor.py:114-200`), but its legacy translation drops `command`, `policy` and `needsMode` (`skill_advisor.py:795-857`). That fixes the top and the label within decision Q026. Carrying the plain command as well, so the fallback answer matches the live one, reverses Q026 and is the operator's call (rank 12).

## 5. Eliminated alternatives

- Attach the handler's command step to the Python rows, as cross-cli-3 rank 3 was written: the Python top is wrong on the plain readme prompt, so the command would hang on `system-spec-kit`.
- Drop the force-local variable so the Python scorer uses its native bridge: the legacy translation drops the command fields, so the typed command is lost, which is exactly what cross-cli-3's probe showed.
- Label `sk-code` with `(needs a mode)`: its modes carry no command and both rows belong to other owners.
- Map OpenCode's route targets to their mode names instead of dropping the line: it adds bytes and repeats the head.
- Read `effectiveThresholds` in the plugin: no override exists in the tree (cross-cli-3).
- Write the Claude `create` skill into `.skilled/skills`: it enters four runtimes' skill lists and the advisor graph.
- Split Codex `false`: it already means unapproved only.
- A second rendered head for the duplicate row: it costs bytes on every prompt.
- Intent text in the 14 `SKILL.md` descriptions: an operator-facing document change and not a routing fix (offer-reach-3).
- Not reopened, because no new measurement changes them: trimming the directive, warming the embedder, `keep_alive`, a lower meaning threshold and a default command for a hub that defers.

## 6. Convergence

Values confirmed from each lineage's `deep-research-state.jsonl`.

| Lineage | Iterations | Stop reason | Novelty per iteration |
|---|---|---|---|
| `offer-reach-3` | 6 | `maxIterationsReached` | 0.85, 0.80, 0.75, 0.45, 0.55, 0.20 |
| `cross-cli-3` | 6 | `maxIterationsReached` | 0.90, 0.75, 0.80, 0.60, 0.70, 0.30 |
| `ux-cost-3` | 5 | `all_questions_answered` | 0.88, 0.82, 0.60, 0.72, 0.58 |

Segment three has not converged against the 0.05 threshold. Two lineages stopped at the six-iteration cap with last novelty 0.20 and 0.30, and `ux-cost-3` stopped on coverage at 0.58. No lineage came near 0.05. Novelty fell in the last iteration of both capped lineages.

This draft proposes no full segment four. The open items below are build-phase measurements or operator decisions. If the coordinator wants a research answer on holdout reach, one short single-lineage segment on question 5 is the only research-shaped gap, and it could also run as wave 0 of rank 10's phase.

## 7. Open questions

1. Does `(needs a mode)` render on `nm-sk-doc-01`, `nm-sk-design-01` and `nm-system-skill-advisor-01`? Owner: one hook render each, or the capture field in rank 2.
2. What share of the 132 stale Claude briefs came from the degraded fallback and not from a stale graph? Owner: rank 1's degraded flag.
3. Does Codex under `workspace-write` block the hook's socket, and with which error? Owner: the operator's approval of the Codex hook, then one Codex run.
4. Does a Claude-only `create` skill list beside the twelve `create:*` commands? Owner: one live Claude listing, then the operator (rank 7).
5. Does richer intent text in the skill or command vectors move holdout rows? Owner: a real-embedding capture against a scratch copy of the DB, with holdout counted.
6. Can the in-process handler answer inside the hook's 2.5 s budget from a cold process? Owner: rank 6's phase.
7. Does the OpenCode plugin reach the degraded path, and does any host set a prompt-time variable? Owner: an OpenCode arm with a delivery marker.
8. What does the embedder's cold first call cost at HEAD? Owner: the next run that finds the model unloaded by its own idle timer.
9. Operator decisions: decision Q026 for rank 12, a default doctor subcommand for rank 13, the Claude `create` collapse for rank 7 and the three typed policy labels phase 011 found in disagreement.

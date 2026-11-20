# Epic Verification Report

Fable 5.2 at high effort on the `claude2` account, read-only (`--permission-mode plan --agent review`), brief in `../scratch/prompt.md`. Saved verbatim from stdout on 2026-11-20. The conductor's checks of each PARTIAL verdict and of finding 1 are in `../implementation-summary.md`.

## Verdicts

Paths are relative to `.skilled/skills/system-skill-advisor/` unless they start with `.skilled/bin/`. Range reviewed: `v4.1.0.0..7ee80c87364`.

- **O1 CONFIRMED.** The default weight is 0 at `runtime/lib/scorer/lane-registry.ts:13`. `withSemanticShadowPromptEmbedding` returns before any database or adapter call at `runtime/lib/scorer/lanes/semantic-shadow.ts:155-160`. The override is parsed at `lane-registry.ts:48-77` and forwarded by `.skilled/bin/system-skill-advisor-launcher.cjs:171`. The weight is read once at module load, so a running daemon needs a restart to pick it up.
- **O2 CONFIRMED.** Startup refresh is at `runtime/advisor-server.ts:438-439` and the watcher refresh at `runtime/lib/daemon/watcher.ts:494-496`. In `runtime/lib/skill-graph/skill-graph-db.ts` the single flight is 1445-1448, the extra pass 1456-1462, the complete-coverage exit 1479-1482, the 500 ms probe 1488-1492 and the off switch 1449-1451. Failed embeds no longer delete at 1609-1613, 1624-1639, 1734-1738 and 1749-1762. The probe runs once per pass, so the extra pass probes again.
- **O3 PARTIAL.** The coverage gate is at `semantic-shadow.ts:394-402`. A failed embed is marked degraded at `runtime/handlers/advisor-recommend.ts:104-118` and dropped from the live total at `runtime/lib/scorer/fusion.ts:1311-1313`. Two parts do not hold. `scoreSemanticShadowExactSubset` at `semantic-shadow.ts:253-323` has no coverage gate. Inside the daemon `getDbReadOnly` returns the read-write handle (`skill-graph-db.ts:580`), so the handle is read-only only in a secondary process.
- **O4 CONFIRMED.** Counts and `coverageComplete` are at `runtime/handlers/advisor-status.ts:199-209` and 231-242, the two reasons at 212-228, and the `/api/tags` probe at 392-422. The probe runs only with `includeSemanticHealth: true` (579-581). At weight 0 `lane_weight_zero` hides every other reason, `incomplete_skill_vectors` included.
- **O5 PARTIAL.** The three keys are forwarded at `.skilled/bin/system-skill-advisor-launcher.cjs:185-188`. The model server is off unless the flag is `1` at 1118-1123. The pointer resolves to the first manifest at `runtime/lib/embedders/schema.ts:272-301`. The legacy write and scoring paths are gone (`skill-graph-db.ts:1299-1312`, 1835). The legacy column is still read at `advisor-status.ts:193` and `runtime/lib/scorer/projection.ts:1574-1585`.
- **O6 PARTIAL.** The heartbeat starts at `advisor-server.ts:389-392`, directly after `initSkillGraphDb`. The launcher reaps at `.skilled/bin/system-skill-advisor-launcher.cjs:1571-1578` and 1613-1630, with a 300 s grace and a 180 s stale limit. The parent watch polls every 30 s (`runtime/lib/daemon/liveness.ts:15`, 66-96) but is armed only at `advisor-server.ts:432`, so a launcher that dies during startup is missed. See findings 1 and 2.
- **S1 CONFIRMED.** The strip is at `runtime/lib/prompt-policy.ts:243-274`. The handler calls it before the cache key (`advisor-recommend.ts:557-559`), the embed (592-593) and the scorer (596), and `fusion.ts:1277` calls it again. Python strips at `runtime/scripts/skill_advisor.py:4809-4844`, 1018 and 4856. Both suites read `runtime/tests/fixtures/pasted-reply-strip-cases.json` (`tests/python/test_skill_advisor.py:2539`, `tests/legacy/advisor-prompt-policy.vitest.ts:25`). I timed copies of both regex pairs on adversarial inputs: JavaScript up to 2.4 million characters, each under 70 ms, and Python up to 1.6 million characters, at most 277 ms. Python grew roughly in step with input size, with noisy timings.
- **S2 CONFIRMED.** Compiled routes and typed commands take `scoredPrompt` at `advisor-recommend.ts:583-588` and 667-672. The fire gate strips at `runtime/lib/skill-advisor-brief.ts:424`, the CLI degraded path at `runtime/skill-advisor-cli.ts:1490` and 1501, and the 64 KiB cut at `hooks/claude/user-prompt-submit.ts:202-203`.
- **S3 CONFIRMED.** The catch at `hooks/claude/user-prompt-submit.ts:665-697` renders the timeout fallback through the lifecycle dedup, and its nested try returns `{}` at 694-696. A prompt the policy had already declined gets the skipped directive instead of the outage line (689-691).
- **S4 PARTIAL.** The five conditions are at `hooks/lib/route-receipt.ts:165-172`, expiry at 173-183, the lifecycle pass-through at `user-prompt-submit.ts:375` and the deferred commit at 449-464 and 733-743. `confidenceFloored` survives at `runtime/lib/subprocess.ts:204`, `hooks/lib/skill-advisor-cli-fallback.ts:395` and `skill_advisor.py:828-829`. Claude, DSH and Vibe store receipts. Pi does not: it sends no `session_id` (`hooks/pi/prompt-advisor.ts:289-298`), and `receiptSessionId` returns null without one (`user-prompt-submit.ts:339-346`). The build phase records this as a named gap (`011-route-receipts-build/implementation-summary.md:103`), so the claim is wrong and the code matches its own plan.

## Defects

**Overall assessment**: REQUESTED_CHANGES
**Files reviewed**: 14 source files read in full or by diff, 9 test files read or listed
**Baseline used**: sk-code (`sk-code-review`)
**Surface evidence used**: SKILLED
**Quality gate evidence**: absent
Rule sources: hub:sk-code/shared/references/universal/code-quality-standards.md, hub:sk-code/sk-code-skilled/assets/checklists/universal-checklist.md, hub:sk-code/sk-code-skilled/assets/checklists/javascript-checklist.md, hub:sk-code/sk-code-skilled/assets/checklists/skill-authoring.md, hub:sk-code/sk-code-skilled/assets/checklists/typescript-checklist.md, hub:sk-code/sk-code-skilled/assets/checklists/js-css-style/overview-header-and-comments.md, hub:sk-code/sk-code-skilled/assets/checklists/js-css-style/naming-init-formatting-and-css.md, hub:sk-code/sk-code-skilled/assets/checklists/js-css-style/verification-quick-reference-and-related.md, hub:sk-code/sk-code-skilled/assets/checklists/python-checklist.md. Overrides: review.todo-tracking replace from hub:sk-code/sk-code-skilled/assets/checklists/universal-checklist.md. Refused: none. Ignored: none. Conflicts: none
Advisory score: 84/100 (correctness 23/30, security 24/25, patterns 17/20, maintainability 12/15, performance 8/10). Confidence: MEDIUM, because no suite was run and finding 1 was not reproduced.

One P1 and ten P2. No P0: I found no wrong routing at default settings, no crash, no lost data and no operator doc that contradicts the code.

## Findings

### P0 - Critical

None.

### P1 - High

1. [.skilled/bin/system-skill-advisor-launcher.cjs:1571] The heartbeat watchdog can kill a healthy daemon after the machine sleeps
   - Case: a laptop sleeps for more than 180 s with the daemon up. On wake the launcher's 60 s check can run before the daemon's 15 s heartbeat write. `heartbeatVerdict` compares wall-clock `now` with the file's pre-sleep mtime (1576), reads `stale` and sends SIGTERM (1621).
   - Risk: the verdict uses one observation and never asks whether the watchdog's own process was suspended. With independent timer phases the launcher goes first in roughly one wake in eight. That figure is my estimate, not a measurement.
   - User impact: the daemon exits, the launcher mirrors the signal and exits too (1658-1662), and the next prompts get the local scorer's degraded route until the CLI respawns a cold daemon.
   - Finding class: instance-only
   - Scope proof: `heartbeatVerdict` and `startHeartbeatWatchdog` are the only readers of the heartbeat file. `.skilled/bin/launcher-heartbeat-watchdog.vitest.ts:104-199` has no suspend case.
   - Recommended fix: require two consecutive stale reads before signalling, or skip one round when the gap since the watchdog's own last tick exceeds twice its interval.
   - Self-check: hunter P1. Skeptic asked whether any guard skips a check after a long gap, and none exists in 1571-1630. Referee kept P1 with the uncertainty stated. What would confirm it: sleep the machine for four minutes and look for `advisor server heartbeat stale; sending SIGTERM` in the launcher log.

### P2 - Suggestion

2. [runtime/advisor-server.ts:432] The parent watch is armed after startup work, so an early orphan is never detected
   - Case: the launcher is killed while the daemon is still in `startupSkillGraphScan`. `startParentWatch` then captures the adopted parent pid as its baseline (`liveness.ts:68`), and `getParentPid() === parentPid` stays true forever.
   - User impact: the orphan lives until the 30 minute idle timeout or the next launcher's stale-lease reap.
   - Finding class: instance-only
   - Recommended fix: capture `process.ppid` at the top of `main()` and pass it in, or start the watch beside the heartbeat at line 390.
3. [runtime/lib/scorer/lanes/semantic-shadow.ts:326] At weight 0 a stale projection still reports the lane as degraded
   - Case: weight 0 and a stale staleness verdict, for example vector rows from two model ids or a failed staleness read (`projection.ts:1679-1690`). Line 327 overwrites `lane_weight_zero`, and `fusion.ts:299-313` marks the lane `runtime_degraded`.
   - User impact: every recommendation carries `runtime_degraded_lanes:semantic_shadow` and `semantic_lane_off:projection_embedding_stale` for a lane that is switched off. Scores do not change.
   - Finding class: class-of-bug
   - Recommended fix: return early in both lane functions and in `projectionRuntimeLaneHealth` when the weight is 0.
4. [runtime/lib/scorer/lanes/semantic-shadow.ts:203] A live lane pays the prompt embed before it checks coverage
   - Case: weight 0.05 and one stale vector. Each prompt waits up to 750 ms for an embed, then line 399 refuses to score. Only `prompt_embedding_*` reasons mark the lane degraded (`advisor-recommend.ts:108`), so its weight stays in the confidence denominator.
   - User impact: slower prompts and confidence normalised over 1.00 instead of 0.95 for as long as coverage is incomplete.
   - Finding class: instance-only
   - Recommended fix: check coverage before the embed, and report `incomplete_skill_vectors` as a degraded lane.
5. [runtime/lib/scorer/lanes/semantic-shadow.ts:253] The exact rerank path scores vectors the coverage gate would refuse
   - Case: weight above 0, `SPECKIT_ADVISOR_EXACT_SEMANTIC_RERANK` on and a skill whose description changed while Ollama was down. The old vector is now kept (`skill-graph-db.ts:1609-1613`) and this function checks only the projection verdict, which compares model ids and not content hashes.
   - User impact: a rerank decided on a vector for text that no longer exists. Both switches are opt-in.
   - Finding class: class-of-bug
   - Recommended fix: share one coverage check between the two lane functions, and correct the comment at `skill-graph-db.ts:1609`.
6. [runtime/tests/launcher-bootstrap.vitest.ts:610] The startup and watcher refresh are asserted by source text only
   - Case: lines 610-626 compare `indexOf` positions in `advisor-server.ts` and `watcher.ts`. Deleting the `skillGraphDaemon.active` gate, or passing a custom `reindexSkill` that skips the refresh, leaves the test green.
   - User impact: the claim that the daemon refreshes after startup and after each reindex has no behavioural test.
   - Finding class: matrix/evidence
   - Recommended fix: drive `createSkillGraphWatcher` with a stubbed refresh and assert one request per reindex.
7. [runtime/lib/skill-graph/skill-graph-db.ts:1468] A queued refresh request is dropped when the running pass throws
   - Case: a reindex lands while a pass is in flight and that pass then throws. The `finally` clears the queued request, so the extra pass never runs.
   - User impact: the new skill has no vector until the next reindex or restart. `refresh-in-background.vitest.ts:228` checks only that the slot clears.
   - Finding class: instance-only
   - Recommended fix: catch per pass inside the loop so a queued request still runs.
8. [hooks/claude/user-prompt-submit.ts:571] A disabled hook that crashes prints the outage line
   - Case: `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1` and a session whose working directory was removed. `process.cwd()` throws at 571, the catch sees a string prompt at 684 and renders the timeout fallback.
   - User impact: an advisor the operator switched off reports an outage on every turn.
   - Finding class: instance-only
   - Recommended fix: record the disabled state before the try and return `{}` from the catch when it is set.
9. [hooks/dsh/prompt-advisor.mjs:97] The DSH comment promises a transcript fallback that DSH never has
   - Case: DSH sends no `transcript_path` (241-246), so the receipt stores `transcriptBytes: null` and `route-receipt.ts:173-177` never fires. If the clock rotation at 227 fails or is still running, a receipt from before compaction stays current.
   - User impact: a weak follow-up after compaction can get `Advisor: prompt skipped.` against a route the model no longer holds.
   - Finding class: instance-only
   - Recommended fix: drop the DSH receipt in the same handlers that call `forgetReceipt`, and correct the comment.
10. [runtime/advisor-server.ts:394] Two comments say only a trusted scan writes skill vectors
   - Case: a maintainer reads line 394 or `runtime/lib/embedders/schema.ts:270` and concludes the daemon never calls Ollama, while lines 438-439 and `watcher.ts:496` now do.
   - User impact: a wrong mental model of who writes the vector tables.
   - Finding class: instance-only
   - Recommended fix: reword both comments to name the background refresh.
11. [runtime/lib/prompt-policy.ts:253] Last marker wins also cuts the user's own task
   - Case: `You said: use sk-git.\nTask: refactor the hook.\nDetails.\nNow: the tests fail` strips to `the tests fail`. I ran this input against a copy of the regexes.
   - User impact: routing sees the tail and loses the task statement. The rule is deliberate, and the fixture should pin this shape.
   - Finding class: instance-only
   - Recommended fix: add the case to `pasted-reply-strip-cases.json` with the intended answer.

## Ollama cost answer

Yes. At weight 0 no prompt is embedded, but the daemon still fills and maintains every vector. `refreshEmbeddingsInBackground` never reads the lane weight (`skill-graph-db.ts:1442-1504`), so each start and each reindex with incomplete coverage costs one 500 ms probe and one embed per missing or changed row. On this checkout that is 15 skill and 47 command vectors. Their only reader at weight 0 is the `advisor_status` count, because the lane returns before `loadSkillEmbeddings` when no prompt vector exists (`semantic-shadow.ts:357-359`).

The cost is small and off the prompt path, and it makes the lane usable the moment the weight is raised. That is a judgment, not a measurement. If nobody plans to raise the weight, the refresh should skip at weight 0, which is one check beside the existing off switch at line 1449.

Not checked: no vitest or Python suite was run because this run writes no files, finding 1 was not reproduced on a sleeping machine, the nine resolved checklists and the mode's own three were not opened so findings rest on the review-core floor and lens, built `dist` output was not compared with source, and changelogs and playbooks were sampled only.

Review status: REQUESTED_CHANGES

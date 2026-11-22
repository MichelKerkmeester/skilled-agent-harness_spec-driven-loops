## State

Paths below use `A/` for `.skilled/skills/system-skill-advisor/`. HEAD is `920be184c8c`.

- **Entry.** A prompt is first stripped of a leading pasted reply (`A/runtime/lib/scorer/fusion.ts:1108`, rule at `A/runtime/lib/prompt-policy.ts:245-274`), then scored against the skill projection.
- **Lanes and weights.** Four live lanes: `explicit_author` 0.42, `lexical` 0.28, `graph_causal` 0.13, `derived_generated` 0.12 (`A/runtime/lib/scorer/lane-registry.ts:8-13`). They sum to 0.95 and are not renormalized. The graph lane is fed by the other three lanes' matches (`fusion.ts:489-498`).
- **Score.** Per skill, the sum of raw lane score times weight (`fusion.ts:1160-1175`), with graph support capped below a typed slash command's seed (`fusion.ts:1182-1192`). Rank fusion is opt-in and off (`fusion.ts:74,153-156`).
- **Confidence and pass.** Confidence is `0.52 + min(1, score/0.95 x 1.25) x 0.43`, lifted to 0.82 by task intent or a direct score of 0.65 or more, capped at 0.95 (`fusion.ts:413-455`, `A/runtime/lib/scorer/scoring-constants.ts:182-198`). A row passes at confidence 0.8 or more and uncertainty 0.35 or less (`A/runtime/lib/compat/contract.ts:10-11`, `fusion.ts:1300-1302`).
- **Ordering.** Sort by score plus intent bonus, minus 0.08 for a command row on a prompt with no slash (`fusion.ts:1261-1278`). Then ambiguity, two abstention gates, executor delegation, command-anchor, doctor-bridge and typed-command passes (`fusion.ts:1305-1449`).
- **Daemon and launcher.** `.skilled/bin/skill-advisor.cjs:72-85,133-137` checks build freshness and runs the built CLI, which calls the daemon over a unix socket. If the daemon is unreachable it falls back to the Python scorer and marks the answer degraded (`A/runtime/skill-advisor-cli.ts:1573-1593`). The launcher spawns the server with an allowlisted environment (`.skilled/bin/system-skill-advisor-launcher.cjs:285-304,1415-1430`).
- **Liveness.** The server writes a heartbeat every 15 s and checks its parent every 30 s (`A/runtime/lib/daemon/liveness.ts:15-16`, `A/runtime/advisor-server.ts:388-393,419-425`). The launcher kills a server whose heartbeat is 180 s stale, checked every 60 s (launcher `:1326-1330,1360-1413`). The server exits after 30 idle minutes (`A/runtime/lib/ipc/launcher-idle-timeout.ts:3`).
- **Hook brief.** The shared hook asks for the top 3 at confidence 0.8 with a 2500 ms budget (`A/hooks/claude/user-prompt-submit.ts:182,624-637`, `A/hooks/lib/skill-advisor-cli-fallback.ts:235-248`). The brief is one head line, `Advisor: <freshness>; use <label> <confidence>/<uncertainty> pass.` or the ambiguous form naming a partner, an optional `Also:` doctor command, then `Directives:` and the comment-hygiene line. It is capped at 80 tokens, or 120 when ambiguous (`A/runtime/lib/render.ts:104-106,514-627`).
- **Brief fallbacks.** An outage line with the by-hand command, `prompt skipped`, or `no skill matched` (`render.ts:651-666`). A floored weak follow-up that points away from the session's last confident route is shown as skipped (`user-prompt-submit.ts:363-395`).

## Claims

| Phase | Verdict | Evidence |
| --- | --- | --- |
| 002 pasted-context stripping | CONFIRMED | Rule at `A/runtime/lib/prompt-policy.ts:245-274`; called at scorer entry `fusion.ts:1108` and before the cache key in `A/runtime/handlers/advisor-recommend.ts:525-527,560` |
| 004 crash-path fallback | CONFIRMED | The outer catch returns the outage line and directives, with a nested try (`A/hooks/claude/user-prompt-submit.ts:669-701`). The threshold row names the per-request override (`.skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md:308`) |
| 008 scored-prompt consumers | CONFIRMED | Route enrichment and typed-command attach get `scoredPrompt` on both returns (`advisor-recommend.ts:551-556,623-628`). The degraded path strips before the typed-command check (`A/runtime/skill-advisor-cli.ts:1490,1501`) |
| 011 route receipts | CONFIRMED | Guard and weak-follow-up test at `A/hooks/lib/route-receipt.ts:147-185`; hook guard and write at `user-prompt-submit.ts:363-436`; DSH boundary at `A/hooks/dsh/prompt-advisor.mjs:108,213`. The Python fallback sets no floor flag, as the summary says |
| 018 lane off and daemon liveness | PARTIAL | Liveness holds (`liveness.ts:81-156`, launcher `:1342-1413`). The lane-off half no longer exists as written: the re-enable key is now dropped as unknown (`lane-registry.ts:63-64`), and neither `lane_weight_zero` nor the model-server switch is in live code. "Exits within seconds" is bounded by a 30 s parent check (`liveness.ts:15`) |
| 024 lane removal | CONFIRMED for tracked code | Four registry rows (`lane-registry.ts:8-13`); status reports those weights (`A/runtime/handlers/advisor-status.ts:349,388`); an older database is discarded (`A/runtime/lib/skill-graph/skill-graph-db.ts:316-346`); cleanup is wired into apply (`.skilled/commands/doctor/assets/doctor-update-apply.yaml:217-222`). The residue check itself was not run |
| 026 doctor alignment | CONFIRMED | Eight cleanup phrases on `/doctor:update` (`.skilled/commands/doctor/_routes.yaml:791-798`), carried into the bridges (`A/runtime/scripts/command-bridges/command-bridges.generated.json:2058`); doctor at 1.3.0.0 (`.skilled/skills/system-skilled-doctor/SKILL.md:5`); positive and negative prompt cases (`.skilled/commands/doctor/scripts/tests/doctor-helper-match.test.cjs:513-546`) |

All seven verdicts come from reading code. No test or probe was run.

## Leftovers

Tracked code is clean of the lane itself. What remains:

- **Local build output, untracked.** This checkout still holds `A/runtime/dist/runtime/lib/scorer/lanes/semantic-shadow.js` and `A/runtime/dist/runtime/lib/embedders/`, written today at 07:43, while the live lanes were rebuilt at 08:11. `dist/` is ignored (`.gitignore:60`) and a compile never deletes orphans. Nothing else in `dist` imports them. The lane cleanup in `/doctor:update apply` has not been run here.
- **Tests that pin removed names, on purpose.** `A/runtime/tests/launcher-bootstrap.vitest.ts:172-186` asserts the model-server key is not forwarded. `A/runtime/tests/handlers/advisor-status.vitest.ts:331-338` asserts the two removed health flags are refused. Both are real behavior checks.
- **Fixtures with the old schema.** `A/runtime/tests/scorer/projection-fallback-049-005.vitest.ts:79-80` builds a table with the retired embedding columns. `A/runtime/tests/skill-graph-db.vitest.ts:219-264` does so deliberately to prove the discard.
- **A stale approval reason.** `A/runtime/tests/parity/fixtures/local-native-approved-divergences.json:664` justifies a standing divergence by the retired lane's weight change.
- **Allowlisted by design.** `A/runtime/scripts/routing-accuracy/run-command-behaviour.mjs:1014` forwards the `OLLAMA_` prefix to external CLI children. Two prompt texts in `A/runtime/tests/routing-parity-deep-skills.vitest.ts:55,71` name an embedder topic.
- **Env switches.** No lane switch remains in the launcher allowlist (ends at launcher `:162`) or in `.env.example:300-330`. `ENV-REFERENCE.md:317-318` lists four lanes.
- **Doctor routes.** No embedder route remains. The cleanup wording is intended (`_routes.yaml:791-798`, `.skilled/commands/doctor/update.md:73`).
- **Operator docs.** `A/README.md:38-45`, `A/ARCHITECTURE.md:110,126` and `A/references/scoring/advisor-scorer.md:47-54` all describe four lanes with the current weights.
- **Not the lane, but the same vocabulary.** The Python fallback still boosts `embedding`, `embeddings` and `vector` toward `system-spec-kit` (`A/runtime/scripts/skill_advisor.py:1907-1908,1920`). See finding 7.

## Defects

**Files reviewed**: 18 files read in whole or in part at HEAD, no diff range
**Overall assessment**: REQUESTED_CHANGES
**Baseline used**: sk-code (`sk-code-review`)
**Surface evidence used**: SKILLED
**Quality gate evidence**: absent
Rule sources: hub:sk-code/shared/references/universal/code-quality-standards.md, hub:sk-code/sk-code-skilled/assets/checklists/universal-checklist.md, hub:sk-code/sk-code-skilled/assets/checklists/skill-authoring.md, hub:sk-code/sk-code-skilled/assets/checklists/typescript-checklist.md, hub:sk-code/sk-code-skilled/assets/checklists/javascript-checklist.md, hub:sk-code/sk-code-skilled/assets/checklists/js-css-style/overview-header-and-comments.md, hub:sk-code/sk-code-skilled/assets/checklists/js-css-style/naming-init-formatting-and-css.md, hub:sk-code/sk-code-skilled/assets/checklists/js-css-style/verification-quick-reference-and-related.md, hub:sk-code/sk-code-skilled/assets/checklists/python-checklist.md, hub:sk-code/sk-code-skilled/assets/checklists/command-authoring.md. Overrides: review.todo-tracking replace from hub:sk-code/sk-code-skilled/assets/checklists/universal-checklist.md. Refused: none. Ignored: none. Conflicts: none

Advisory score: 82/100 (correctness 23/30, security 23/25, patterns 16/20, maintainability 11/15, performance 9/10). Confidence: MEDIUM, because nothing was executed.

**Severity note.** The dispatch defines P0 as wrong routing, a crash, lost data or a misleading doc claim. The review mode reserves P0 for exploitable security issues and destructive data loss, and that contract decides the verdict. Each finding therefore carries both: its group below, and a `Dispatch rank` line.

**Security pass.** No finding. Brief labels are sanitized against instruction-shaped text (`A/runtime/lib/render.ts:108-110,159-175`). The daemon gets an allowlisted environment (launcher `:285-288`). The receipt store refuses a symlinked or foreign-owned folder (`A/hooks/lib/route-receipt.ts:283-292`).

| Finding | Hunter severity | Skeptic challenge | Referee verdict | Final severity |
| --- | --- | --- | --- | --- |
| 1 Calibration override has no caller | P1 | Is the doc really a promise, and is there a caller elsewhere? Both doc rows state the merge as fact, and a search of the runtime, tests and Python finds only the definition | Confirmed | P1 |
| 2 Overrides not forwarded to the daemon | P1 | The default file path works, no real caller sets the override, and the project accepts an unforwarded switch when its doc row says so | Downgraded | P2 |

## Findings

### P0 - Critical

None.

### P1 - High

1. [.skilled/skills/system-skill-advisor/runtime/lib/scorer/scoring-constants.ts:258] A documented calibration override does nothing
   - Case: an operator sets `SPECKIT_ADVISOR_CALIBRATION_OVERRIDE_JSON='{"memorySaveBonus":0.1}'`, as `ENV-REFERENCE.md:310` and `.env.example:306` describe. `resolvedCalibration()` is the only reader and has no caller; fusion reads the frozen constants directly (`fusion.ts:42,712`). Routing does not change and nothing warns.
   - Risk: an operator believes a routing bonus was tuned when it was not. The parse-failure warning the doc promises can never fire either.
   - User impact: any tuning done through this key is silently void, in the daemon, the CLI and the tests alike.
   - Finding class: class-of-bug
   - Scope proof: `rg -n 'resolvedCalibration\b' A/runtime` returns only the definition at `:258`. `git grep SPECKIT_ADVISOR_CALIBRATION_OVERRIDE_JSON` returns the two doc rows and the two lines inside that function. The launcher allowlist omits the key as well.
   - Dispatch rank: P0, a doc claim that misleads an operator
   - Recommended fix: either delete the function and both doc rows, or read it in `primaryIntentBonus`, add the key to the launcher allowlist and add a test where the override reorders a save-context prompt.

### P2 - Suggestion

2. [.skilled/bin/system-skill-advisor-launcher.cjs:285] Two documented overrides never reach the daemon that scores
   - Case: an operator exports `SPECKIT_ADVISOR_ROUTE_EXCLUSIONS_DIR` to a folder whose denylist excludes a skill (`.env.example:328`, `A/runtime/config/README.md:51`). `createChildEnv` keeps only allowlisted keys, the key is not among them, and the daemon reads the packaged folder instead (`A/runtime/lib/route-exclusions.ts:48-52`). The excluded skill is still recommended (`fusion.ts:385`).
   - Risk: the same holds for `SPECKIT_ADVISOR_FEEDBACK_CALIBRATION_PATH` (`.env.example:327`, `A/runtime/lib/scorer/feedback-calibration.ts:186`), whose on-switch is forwarded (launcher `:138`), so records land at the default path.
   - User impact: a relocated denylist is ignored under daemon supervision, with no message.
   - Finding class: class-of-bug
   - Scope proof: a comparison of env keys read under `A/runtime/lib` and `handlers` with the allowlist lists these two plus the two in finding 5. The rank-fusion key is also unforwarded, but its rows say so (`ENV-REFERENCE.md:322`, `.env.example:318`). Read from code, not run: a daemon probe with the key set would confirm it.
   - Dispatch rank: P0 class, wrong routing against a documented setting, low likelihood
   - Recommended fix: add both keys to the allowlist, or give each doc row the caveat the rank-fusion row already carries.

3. [.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-outcome-rerank.mjs:44] An eval script imports a module that was deleted, and a test still lists it
   - Case: running the script imports `outcome-weighted-rerank.js` from the built scorer folder. `A/runtime/lib/scorer/` has no such source (deleted in `6b99eb68d2a`) and `dist` holds no such file, so the import fails before any measurement.
   - Risk: `A/runtime/scripts/routing-accuracy/README.md:145` describes the script as a working measurement. `A/runtime/tests/parity/holdout-independent.vitest.ts:91` counts it as a training-corpus consumer by its path alone, so the test passes on a script that cannot start.
   - User impact: a maintainer who follows the README gets a module-not-found error, and the holdout test guards a consumer that is dead.
   - Finding class: instance-only
   - Scope proof: `rg 'outcome-weighted-rerank|outcomeWeightedRerank' A/runtime` returns only this script. `find A/runtime/dist -name 'outcome-weighted-rerank*'` returns nothing. The failure is inferred from the import and the missing file; the script was not run.
   - Dispatch rank: P0 class, a crash plus a doc claim, contained to a developer script
   - Recommended fix: delete the script, its README row and the list entry in the holdout test.

4. [.skilled/commands/doctor/scripts/tests/doctor-update-contract.test.cjs:219] The lane cleanup's wiring into apply is pinned by wording only
   - Case: the tool's command line changes, for example `--shared-model` is renamed in `sweep-lane-residue.mjs`, while `doctor-update-apply.yaml:222` keeps the old string. The contract tests at `:219`, `:229`, `:245`, `:268-272` and `:283` match phase names and sentences in the YAML and the presentation, so they still pass, and phase 7 fails on a user's machine.
   - Risk: no test executes `phase_7_lane_cleanup`. The phase 026 summary states the same in its third limitation.
   - User impact: the cleanup a release note promises can stop running without a red test.
   - Finding class: test-isolation
   - Scope proof: `rg 'phase_7_lane_cleanup|sweep-lane-residue' .skilled/commands/doctor/scripts/tests/*.cjs` finds only this contract test and the repo-mode gate test (`lane-residue-gate.test.cjs:28`). Whether the tool's own suite parses the YAML string was not checked.
   - Dispatch rank: P1, a test that matches text and leaves behavior unchecked
   - Recommended fix: have one test read `apply_command` from the YAML and run it against the fixture home the tool's suite already builds.

5. [.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:158] Query-class routing cannot be switched on in production and is documented nowhere
   - Case: an operator or maintainer sets `SPECKIT_ADVISOR_QUERY_CLASS_ROUTING=1`. The launcher does not forward it, so the lane multipliers at `fusion.ts:183-220` never apply under the daemon. `SPECKIT_ADVISOR_BM25_QUERY_LENGTH_CALIBRATION` (`A/runtime/lib/scorer/lanes/bm25.ts:25`) is in the same state.
   - Risk: two code paths with no production reach and no doc row, which is the default lens rule `review.kiss`.
   - User impact: none today; the cost is code that reads as live.
   - Finding class: class-of-bug
   - Scope proof: `git grep SPECKIT_ADVISOR_QUERY_CLASS_ROUTING` outside specs, changelogs and tests returns only `fusion.ts:75`.
   - Dispatch rank: P2
   - Recommended fix: delete both paths, or forward and document them with a measured reason.

6. [.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:1214] Two scoring inputs are computed or declared and never read
   - Case: a maintainer changes what counts as an explicit workflow signal (`fusion.ts:618-629`) expecting confidence to move. `confidenceFor` receives the value (`:1220`) and never reads it (`:395-456`). Likewise `semanticSearchCodeGraphBonus` is declared and set (`scoring-constants.ts:109,216`) with no reader.
   - Risk: dead inputs in the one function that decides whether a route passes.
   - User impact: none at runtime; wasted work per candidate and a misleading surface for tuning.
   - Finding class: instance-only
   - Scope proof: `rg 'hasExplicitWorkflowSignal|explicitSignal' fusion.ts` returns lines 399, 618, 1214 and 1220 only. `rg semanticSearchCodeGraphBonus A/runtime` returns the two lines in the constants file.
   - Dispatch rank: P2
   - Recommended fix: remove the parameter, the helper and the constant.

7. [.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:1907] The fallback scorer keeps boosts the native scorer does not have
   - Case: the daemon is unreachable, so the CLI scores with Python (`skill-advisor-cli.ts:1580`). A prompt such as "fix the embedding index build" gets `embedding` boosted toward `system-spec-kit` by 0.5 (`:1907-1908,1920`). The native lanes carry no such term.
   - Risk: a route can differ between normal and degraded mode on vocabulary from the retired memory database.
   - User impact: a wrong first suggestion during an outage only.
   - Finding class: instance-only
   - Scope proof: `rg 'embedding|vector' A/runtime/lib/scorer/lanes/explicit.ts A/runtime/lib/scorer/lanes/lexical.ts` returns nothing. The route difference is inferred; neither scorer was run on the prompt.
   - Dispatch rank: P1 class, wrong routing, degraded mode only
   - Recommended fix: drop the three boosts, or add the prompt to the divergence ledger with a reason.

## Removal/Iteration Plan

- **Safe now:** the dead eval script with its README row and test list entry (finding 3); the unused parameter, helper and constant (finding 6); the orphaned local `dist` lane output.
- **Needs a decision first:** wire or delete the calibration override (finding 1); forward or caveat the two overrides (finding 2); keep or delete query-class routing (finding 5).

## Next

1. **Settle the calibration override** (finding 1). It is the only finding that blocks, and both fixes are small.
2. **Add one guard test for daemon env keys.** It fails when a key the daemon-side scorer reads is neither in the launcher allowlist nor marked unforwarded in the env reference. That closes findings 2 and 5 as a class instead of key by key.
3. **Delete the dead eval script and its two references** (finding 3), so the holdout test stops vouching for it.
4. **Execute the YAML's own cleanup command in a test** (finding 4), so the release-note promise has a behavior check behind it.
5. **Clear the orphaned lane output from this checkout's `dist`** by running the lane cleanup, since the machine-mode residue check will keep reporting it.

Run notes: no repository file was written. Shell redirection created four scratch files under `/tmp`, which were removed. The harness's plan-mode step asked for a plan file; none was written, because this run is read-only and the request is a review. Both report checkers passed on this report (`final-line=0 findings=0`).

Not checked: no test, build, daemon probe or residue check was run, because a probe can start a daemon or write state in a read-only run; the lane internals (explicit, lexical, derived, graph-causal), projection, lease and watcher code, the OpenCode plugin and the Pi and Vibe adapters were not read line by line; the resolved surface checklists and the mode's security, code-quality and fix-completeness checklists were not opened, so findings rest on review-core's floor and lens table; only phases 002, 004, 008, 011, 018, 024 and 026 were checked, from their summaries rather than the two release notes

Review status: REQUESTED_CHANGES

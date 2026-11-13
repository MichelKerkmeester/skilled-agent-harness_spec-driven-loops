# Cross-CLI-3: What Still Limits Command Surfacing After Phases 011, 012 and 013

**Lineage:** cross-cli-3 · **Run:** `fanout-cross-cli-3-1794550139177-nft9c6` · **Iterations:** 6 · **Status:** stopped at the 6-iteration cap with all 5 key questions answered

**Scope:** the cross-CLI lane of segment three. This report covers the OpenCode plugin brief beside the hook brief, the Claude 32-of-44 command visibility collapse, whether phase 013's delivery attribution reads true per runtime, and the degraded (daemon-unreachable) path. Offer-rate tuning belongs to `offer-reach-3`; hook-health defaults and brief byte cost belong to `ux-cost-3`. Nothing already ranked, built, declined or eliminated in segment one or segment two is re-recommended; the one item that revisits a prior rank is named as such with the measurement that changes it.

---

## 1. Executive Summary

Four facts decide the cross-CLI picture after the build.

1. **The OpenCode brief and the hook brief no longer differ in their text.** After the phase-013 mapper fix, nine prompt classes produce byte-identical briefs on both paths: 286 B typed, 286 B plain, 305 B ambiguous, 298 B doctor, 244 B no-match, 294/292/296 B for the three deep plain rows, 293 B for the doctor-deep-loop row. What remains is structural: a 73-83 byte second block the plugin emits and the hook does not, a different delivery channel (system prompt versus user-prompt context), a different threshold source, and a duplicated fail-open renderer.
2. **Claude's 32-of-44 is one folder, and a non-renaming fix exists.** `.claude/commands/create/` holds 13 command files and Claude shows one entry for the folder. Every other runtime resolves all 45 canonical command names. A generated `create` skill beside the command tree restores 44 of 44 while preserving every name Claude shows today, at zero cost to the other five runtimes.
3. **Phase 013's attribution reads true where it can read at all.** Delivery is answered on 119 of 144 lines (95 true, 24 false, 25 unknown), the scorer's new counters read the field they were added for, and the safety fold made Devin's unsafe count honest. The residuals are named: Codex `false` conflates an unapproved hook with a delivery failure, `true` proves the store holds the brief rather than that the model saw it, and one DSH unknown is invisible because its row cannot be scored.
4. **The degraded path was never taken in the committed arms.** Zero `Advisor: stale` occurrences across 107 Claude transcripts, 33 Codex session files, 36 Pi files on the arm date and the DSH store — where it could be observed at all. When it is taken, it loses more than the earlier note claimed: even a typed command is dropped, because the fallback shapes bare scorer rows and never runs the handler's attach step.

Six changes are recommended. Rank 1 restores twelve operator-visible command names on Claude. Rank 2 removes the one measured byte asymmetry. Rank 3 makes the fallback carry the same command as the live answer. Ranks 4-6 close attribution gaps that would otherwise misread the next arm. None touches typed recall, false offers or the eval tuple.

---

## 2. Scope, Lanes and Terminology

| Term | Meaning in this report |
|---|---|
| Plugin brief | The string the OpenCode plugin pushes onto `output.system` in `experimental.chat.system.transform` |
| Hook brief | The string the Claude `UserPromptSubmit` hook returns as `hookSpecificOutput.additionalContext` |
| Collapse | Claude resolving a command folder holding `skill.md` as one skill and hiding its siblings |
| Degraded path | The CLI answering `advisor_recommend` from the local scorer when the daemon cannot be reached |
| Answered delivery | A run line whose `briefDelivered` is `true` or `false` rather than `unknown` |

Rules observed: holdout prompt text was never read or printed; tune and none rows were read by prompt text only where the prompt was needed; no CLI session, arena or daemon was started; no file outside this lineage was written.

---

## 3. Method and Evidence Base

Each measurement is reproducible from a committed artifact or a named command:

- **Render parity:** `scratch/render-parity.mjs` asks the real advisor CLI for nine prompts, feeds the payload to the plugin through its own `spawnOverride`, and renders the same prompt through `buildSkillAdvisorBriefFromCli` plus `renderAdvisorBrief`. Output: `scratch/render-parity.json`.
- **Repeat parity:** `scratch/repeat-parity.mjs` runs the plugin transform three times in one session. Output: `scratch/repeat-parity.json`.
- **Every system entry:** `scratch/render-entries.mjs` captures all entries, not just the first. Output: `scratch/render-entries.json`.
- **Degraded parity:** `scratch/degraded-parity.mjs` runs the same scorer subprocess the fallback runs and shapes its rows through the exported `degradedRecommendations`. Output: `scratch/degraded-parity.json`.
- **Visibility:** `node .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs --check` prints `visibility claude 32/44, cursor 44/44`.
- **Attribution:** `score-command-transcripts.mjs --summary` over `013-.../scratch/runs-post-attributed.jsonl`.
- **Frequency:** `rg -a -l 'Advisor: stale'` over the Claude, Codex, Pi and DSH stores.

---

## 4. Question (d): The Plugin Brief Beside the Hook Brief

### 4.1 What is identical

Nine prompt classes, one payload, two callers, one renderer: the heads and the whole brief are byte-identical.

| Prompt class | Live top | Brief bytes (plugin and hook) |
|---|---|---|
| `/create:readme for the utils folder` | `sk-doc → /create:readme (start)` | 286 |
| `write a readme for the utils folder` | `sk-doc → /create:readme (start)` | 286 |
| `use the system-deep-loop skill on this packet` | `ambiguous: system-spec-kit vs system-deep-loop` | 305 |
| `run doctor setup for my install` | `system-skilled-doctor → /doctor:setup (run)` | 298 |
| `what is the weather today` | no skill matched | 244 |
| deep-research plain | `system-deep-loop → /deep:research (ask)` | 294 |
| deep-review plain | `system-deep-loop → /deep:review (ask)` | 292 |
| deep-council plain | `system-deep-loop → /deep:ai-council (ask)` | 296 |
| doctor-deep-loop plain | `system-deep-loop` | 293 |

`[SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/lineages/cross-cli-3/scratch/render-parity.json]`

### 4.2 What differs

1. **A second block, 73-83 bytes, on 7 of 9 prompts.** `Compiled routing (served=compiled): hub=<hub> outcome=<action> targets=<list>` is pushed as its own system entry; the hook renders no equivalent. 73 bytes for sk-doc, 83 for system-deep-loop, 561 bytes over the nine prompts, and `targets=none` on every one. `[SOURCE: .opencode/plugins/system-skill-advisor.js:1586]`
2. **Delivery channel and position.** `output.system` versus `hookSpecificOutput.additionalContext`. Same text, different position, and the OpenCode copy is memory-only — which is why its arm rows still read `briefDelivered: unknown`. `[SOURCE: .opencode/plugins/system-skill-advisor.js:1448]` `[SOURCE: .skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts:429]`
3. **Repeat reduction, same shape and different trigger.** Both keep the head and drop the directive block (286 B → 68 B in the plugin). The plugin resets on startup, resume, compact, generation or epoch; the hook also resets on transcript shrink. `[SOURCE: .opencode/plugins/system-skill-advisor.js:223]` `[SOURCE: .skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts:397]`
4. **Threshold source.** The hook reads `data.effectiveThresholds`; the plugin hardcodes 0.35 and never reads the echo. The tree's only values are the compat defaults, so the outputs agree today; a workspace override would diverge. `[SOURCE: .skilled/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts:341]` `[SOURCE: .opencode/plugins/system-skill-advisor.js:573]`
5. **Request shape.** The hook sends `includeCompiledRoute` and `compiledRouteTopOnly` and no `surfaceHint`; the plugin sends `surfaceHint` and neither flag. Measured effect on the nine prompts: none, because the handler attaches the command before the route is consulted. `[SOURCE: .skilled/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts:228]` `[SOURCE: .opencode/plugins/system-skill-advisor.js:867]`
6. **Fail-open text is a second implementation.** A plugin-local module held equal by a parity test; the no-match fallback is 244 bytes on both. `[SOURCE: .opencode/plugins/lib/skill-advisor-render.js:51]`
7. **Inert asymmetries.** `kind` and `heldBelow` are dropped by the plugin and unread by the renderer; the plugin clamps at 2048 characters where the hook relies on the 480-character token cap; the plugin caches the brief for five minutes per session and prompt.

---

## 5. Question (e): Claude's 32 of 44

### 5.1 The measured state

`--check` prints `visibility claude 32/44, cursor 44/44` and passes. `.claude/commands/create/` holds 13 files; Claude shows one entry for the folder, so 31 foldered commands outside `create/` plus that one give 32. Every other runtime resolves 45 of 45. `[SOURCE: .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs:254]`

The trigger is the exact basename: g5 put `skill.md` beside `readme.md` and Claude listed one entry, `create`; with `new-skill.md` it listed both siblings. The name to preserve is `create`; the twelve to restore are `create:{agent,benchmark,changelog,command,diff,feature-catalog,goal,manual-testing-playbook,readme,repo-rule,skill-parent,with-human-voice}`. `[SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/007-per-runtime-behaviour-proof/scratch/g5/result.txt]`

### 5.2 Every option that keeps the names

| Option | Change | Claude | Other five | Proves 44/44 by | Status |
|---|---|---|---|---|---|
| Generated skill beside the tree | Skip the `create/skill.md` command link; generate `.claude/skills/create/SKILL.md` with `name: create`; make `.claude/skills` managed | 12 commands + the `create` skill = 13 | 0 | Counting command links plus the skill link | Recommended |
| Case-only mirror name | Emit `.claude/commands/create/SKILL.md` | 13 files, effect UNKNOWN | 0 | One throwaway Claude listing | Unverified |
| Nested entrypoint | `.claude/commands/create/skill/index.md` | effect UNKNOWN | 0 | The same listing | Unverified |
| Colon-named root mirror | `.claude/commands/create:skill.md` | effect UNKNOWN, Windows-hostile | 0 | The same listing plus a path test | Unverified |
| Drop the collapsed entry | Remove the link | 12 commands, 43 of 44 | 0 | The count prints 43 | Honest loss |

Renaming `.skilled/commands/create/skill.md` is excluded: it renames the command on all six runtimes, and Q025 blocks it.

### 5.3 The check must change with the fix

`commandVisibility` skips root-level commands, so `local-skilled-alignment.md` is in neither numerator nor denominator, and it counts a `skill.md` folder as one whatever Claude does — so a case-only rename would print 44/44 whether or not the collapse persists. The proving check must count the two surfaces and must fail any folder that holds `skill.md` beside siblings. `[SOURCE: .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs:246]`

---

## 6. Phase 013's Delivery and Attribution, Per Runtime

| Runtime | Answered delivery | What the answer is worth |
|---|---|---|
| claude | `true` 24 | Transcript `hook_additional_context`: the strongest evidence in the arm |
| pi | `true` 24 | Store entry the harness wrote |
| devin | `true` 24 | Store entry the harness wrote |
| dsh | `true` 23, `unknown` 1 | Store entry; the unknown row has no session id and cannot be scored |
| codex | `false` 24 | Approval fact: the hooks were unapproved, so nothing could arrive |
| opencode | `unknown` 24 | No store exists; the brief lives only in memory |

That is 119 answered of 144 (95 true, 24 false, 25 unknown), the phase's claim reproduced from the file. The scorer reads it: OpenCode prints `delivery unknown 24`, Codex prints `offer reached 0`, the other four print `offer reached 3`, and `offer field absent` is 0 everywhere. `[SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/013-attribution-and-install-reach/scratch/runs-post-attributed.jsonl]`

Three residuals:

1. **Codex `false` conflates two causes.** An unapproved hook and a host refusal read the same.
2. **`true` means stored, not seen.** Strong for Claude, weaker for the three harness-written stores.
3. **One unknown is invisible.** `deliveryUnknown` counts inside `addScored`, so the DSH row that cannot be scored contributes nothing and DSH prints 0 unknown while its log holds one.

The safety fold landed: Devin's unsafe count is 2, not the goal log's 1, because the loop-without-init row is now counted. Start rates are unchanged at claude 4/12, codex 0/12, pi 2/10, devin 3/9, opencode 1/5, dsh 6/12 — the correct result for a backfill that replays no offer.

---

## 7. Question (g): The Degraded Path

### 7.1 What it loses

The CLI's fallback runs the bare scorer and shapes it through `degradedRecommendations`, which has no attach step. Measured on seven prompts, the local top equals the live top on six, and every head loses the command, the policy and the mode label. The earlier note's "a typed command is kept" does **not** reproduce: `commandRowFor('sk-doc')` is `undefined`, so the typed branch never fires, and the degraded head for `/create:readme …` is `Advisor: stale; use sk-doc 0.95/0.12 pass.` The note's "plain readme goes to another skill" also no longer reproduces — the local scorer now ranks `sk-doc` first, the same top as live. `[SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/lineages/cross-cli-3/scratch/degraded-parity.json]` `[SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/012-plain-offer-reach/scratch/live-heads.txt:23]`

Only the doctor prompt differs by top: live `command-doctor-setup` + `/doctor:setup (run)`, local `system-skilled-doctor` with no command.

### 7.2 How often

Zero in the committed arms, where it could be observed: 0 of 107 Claude transcripts, 0 of 33 Codex session files dated 2026-11-13, 0 of 36 Pi files touched on the arm date, 0 in the DSH store. Codex's zero is uninformative (no hook ran); OpenCode's rate is unmeasurable (no store). The trigger is narrower than "no daemon": the CLI starts the daemon and waits, so a cold daemon alone does not reach the fallback; it takes a failed spawn, a crashed daemon, or a socket the process cannot connect to.

### 7.3 The smallest fix

Give the degraded branch the handler's own enrichment before shaping: `compiledRouteForRecommendation` plus `attachCommand` for a hub top, `typedCommandIn`/`typedCommandForTop` for a typed prompt, `MODE_COMMANDS` membership for a `defer`, and an owner-to-command lookup for `system-skilled-doctor`. Everything needed is available with no daemon: `compiled-route.cjs` returns `route/single/sk-create-readme` for sk-doc, `route/single/research` for system-deep-loop, and `defer` for the bare skill prompt; `MODE_COMMANDS` maps both targets. `[SOURCE: .skilled/bin/compiled-route.cjs]` `[SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:15]`

---

## 8. Ranked Recommendations

Ranked by expected gain in reach or in trustworthy measurement per unit of risk. Floors: typed recall 24 of 44, false offers 0 of 35, eval [160,50,21,5] at HEAD (segment two quoted [159,50,20,5] before phase 011).

| # | Change | File(s) | Measurable gain | Verify | Floor risk |
|---|---|---|---|---|---|
| 1 | Restore Claude's 44 of 44 without renaming: generated `create` skill beside the command tree, managed `.claude/skills`, and a count that models both surfaces (reopens segment-one rank 9 with the iteration-2 measurement) | `sync-runtime-mirrors.cjs` (`buildExpectedLinks`, `commandVisibility`, `collapseDrift`); generated `.claude/skills/create/SKILL.md` | 12 `create:*` names visible on Claude, 32/44 → 44/44; 0 change on the other five runtimes; every displayed name unchanged | `--check` prints `visibility claude 44/44`; a fixture listing shows `create` and `create:readme` together; `--check` still exits 1 on a new `skill.md`-with-siblings folder | None: no scoring input, no canonical command edit, no advisor-graph entry |
| 2 | Stop emitting an empty compiled-routing block: render only when `targets.length > 0` | `.opencode/plugins/system-skill-advisor.js:1586`; `.opencode/plugins/lib/skill-advisor-render.js:124` | −561 bytes over nine prompts (73 for sk-doc, 83 for system-deep-loop, 7 of 9 prompts); OpenCode injected bytes equal the hook's | A plugin test asserts one system entry when the summary has no targets; the probe prints 286 B where it prints 359 B today | None: metadata only |
| 3 | Give the degraded branch the handler's attach step | `skill-advisor-cli.ts` (`runLocalScorer`, `degradedRecommendations`), reusing `command-attach.ts` and the compiled-route helper | Five of six non-empty probe prompts regain the live command and policy or `(needs a mode)` (inference from measured tops); the doctor prompt matches with the owner lookup | A test that forces the retryable exit and asserts the degraded head equals the live head for the probe set | None: daemon-unreachable path only; cost is one local subprocess per degraded prompt |
| 4 | Give the one DSH row a session id so it scores | `run-command-behaviour.mjs` (DSH locator) | 1 row unscored → scored; DSH delivery 23+1 → 24 answered | The arm prints `24 of 24 scored` for DSH beside `delivery unknown 0` | None |
| 5 | Count `deliveryUnknown` on run lines, not only scored rows | `score-command-transcripts.mjs:1300` | DSH prints `delivery unknown 1` where it prints 0; the count stops depending on scorability | Fixture: an unscored line with `briefDelivered: 'unknown'` increments the counter | None |
| 6 | Split Codex `false` into `unapproved` and `not-delivered` | `command-offer.mjs`; run line | 24 Codex rows stop reading as one cause | A `CODEX_HOME` without approval prints `unapproved`; an approved entry with no brief prints `not-delivered` | None |

**Declined, with reason:** a plugin reader for `effectiveThresholds` (no override exists in the tree; building for a hypothetical) and adding the `create` skill to the canonical `.skilled/skills` inventory (it would enter every runtime's skill list and the advisor graph, the one route by which rank 1 could move the floors).

---

## Eliminated Alternatives

| Approach | Reason eliminated | Evidence |
|---|---|---|
| Fixture-only comparison of the plugin brief | The mapper fix is only proven against a real CLI payload | §3, §4.1 |
| Comparing against the delivered `~/.claude` transcript brief | Host formatting could explain a difference | §4.1 |
| Counting the private root command in the 44 | `local-skilled-alignment.md` is untracked and outside the foldered set | §5.1 |
| Reading the cursor 44/44 line as proof for all runtimes | It is computed as `visible = total` for cursor regardless of content | §5.1 |
| Re-running the arm to answer OpenCode delivery | No store exists; a rerun repeats the same 24 unknown | §6 |
| `briefDelivered: true` as obedience | It is a delivery fact, not a start | §6 |
| Starting a daemon or a second socket directory to measure the fallback | The same two functions can be exercised without one | §7.1 |
| Treating the 012 note as current behaviour | Two of its three claims do not reproduce at HEAD | §7.1 |
| Renaming the canonical `create/skill.md` | Renames the command on all six runtimes; Q025 blocks it | §5.2 |

---

## Divergence Map

No divergent pivots were taken. The lane stayed inside cross-CLI rendering, visibility and attribution. Saturated directions: the plugin-versus-hook text comparison (identical after the fix), the case-only rename question (unmeasurable without one live listing), and the OpenCode delivery question (no store). Remaining frontier: one live Claude listing that shows the generated skill and the twelve commands together; an OpenCode arm with a written marker; a Codex arm with approved hooks.

---

## 12. Open Questions

1. Does a generated `.claude/skills/create/SKILL.md` render as `create` while the twelve `create:*` commands reappear in the same listing?
2. Is Claude's collapse rule case-sensitive, and does a nested `index.md` resolve to a folder command?
3. Once OpenCode keeps a written marker, does its delivery answer match the plugin's own probe?
4. Once Codex hooks are approved, does the brief arrive and does the start rate move off 0?
5. Does any real workspace override the threshold pair, and does the plugin then diverge from the hook?
6. Does a sandbox that blocks Unix sockets (Codex workspace-write) force the degraded path, now that the path itself can be measured?

---

## 13. References

- Parent packet `008-command-surfacing-build`: `goal.md`, `spec.md`, `decision-record.md`; implementation summaries of `011`, `012`, `013`.
- Phase scratch: `011/scratch/{after.txt,suite-after.txt,brief-cost.json,hook-health.json}`, `012/scratch/{after-final.txt,live-heads.txt,floorcheck.sh,routes-*.tsv}`, `013/scratch/{after.txt,runs-post-attributed.jsonl,summary-post-*.json}`.
- Segment one `research/research.md` (rank 9, rank 12, rank 14 and their dispositions); segment two `research-segment-2.md` sections 3 and 4.
- Renderer and plugin: `.skilled/skills/system-skill-advisor/runtime/lib/render.ts`, `.opencode/plugins/system-skill-advisor.js`, `.opencode/plugins/lib/skill-advisor-render.js`.
- CLI and attach: `.skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts`, `runtime/lib/command-attach.ts`, `runtime/handlers/advisor-recommend.ts`, `.skilled/bin/compiled-route.cjs`.
- Mirrors: `.skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/{sync-runtime-mirrors.cjs,command-scope.cjs,README.md}`.
- Lineage evidence: `iterations/iteration-001..006.md`, `deltas/iter-001..006.jsonl`, `scratch/{render-parity,repeat-parity,render-entries,degraded-parity}.json`.

---

## 14. Answered Questions

- **(d)** What still differs between the plugin brief and the hook brief? **Nothing in the brief text after the mapper fix; the differences are a 73-83 byte compiled-routing block on 7 of 9 prompts, the delivery channel, the threshold source, the request flags, the dedup reset and a duplicated fail-open renderer.** (iteration 1)
- **(e)** Which options restore 44 of 44 without renaming a command, at what cost, and how is it proven? **A generated `create` skill beside the command tree, at zero cost to the other five runtimes, proven by a count that models command links plus the skill link and still fails a collapsed folder; four alternatives are unverified or lossy.** (iteration 2, restated in iteration 6)
- **Does phase 013's delivery and attribution read true per runtime?** **Yes where it can read: 119 of 144 answered, counters live, safety fold landed; the residuals are Codex's conflated `false`, `true` meaning stored rather than seen, and one DSH unknown hidden by an unscored row.** (iteration 3)
- **Which cross-CLI gap ranks first, and what does each fix change?** **The six-rank table in §8; visibility first, the empty compiled block second, the degraded-path enrichment third.** (iteration 4)
- **What does the degraded path lose, and what is the smallest fix?** **Command, policy and mode label on every measured prompt — including typed ones — with zero observed hits in the arms; the fix is to run the handler's attach step before shaping.** (iteration 5)

---

## 15. Limitations and Confidence

- Executor is a flash model; every load-bearing number was recomputed from a committed artifact or produced by a command in this lineage, not taken from a phase summary.
- The brief comparison used nine prompts and one payload per prompt; it bounds a claim about text and fields, not about every possible route.
- The Claude visibility fix is proven at the mechanism level, not by a live listing; it is the ranked set's one unproven assertion.
- The degraded fix's expected heads are inference from measured tops and measured route lookups; the enriched render was not executed.
- Frequency counts cover the stores that keep the brief; OpenCode and, for this purpose, Codex contribute no evidence.

---

## 16. Implementation Decision

Build rank 1 first: it is the only item that restores operator-visible names, it touches one script and one generated file, and its check change makes the 44-of-44 claim falsifiable for the first time. Build rank 2 with it because it is a two-line renderer change that removes the only measured byte asymmetry between the two briefs. Rank 3 is insurance rather than measured gain — the path was taken zero times in the arms — so it belongs with the next arm's preparation, not ahead of reach. Ranks 4-6 are attribution hygiene and should land before any number from the next arm is quoted.

---

## 17. Convergence Report

- Stop reason: `maxIterationsReached` (6-iteration cap; all 5 key questions answered)
- Total iterations: 6
- Questions answered: 5 / 5
- Remaining questions: 0 tracked; 6 new open questions in §12
- newInfoRatio trend: 0.90 → 0.75 → 0.80 → 0.60 → 0.70 → 0.30
- Convergence threshold: 0.05 (default mode); the last three-iteration average stayed far above it, so the cap decided the stop
- Divergence summary: no pivots; no saturated direction was needed
- Registry: 45 findings across six iterations; 5 resolved questions

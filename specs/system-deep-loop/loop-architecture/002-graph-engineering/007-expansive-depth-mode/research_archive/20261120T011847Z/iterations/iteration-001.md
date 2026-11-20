# Iteration 1: Q1 — Adversarial Verification of Generation-1 Defects D1–D9 Against Current Code

## Focus

Verify the generation-1 defect register (archived `research_archive/20261117T103614Z/research.md` §13) and its design claims against the current code, starting with the six defects generation 1 recommends shipping first: D1, D2, D3, D5, D6, D7. Interpretation chosen: line-level re-verification of each cited file:line, plus live probes inside this run (this iteration's own projected state record for D7/D9). Deferred: D4 and D8 (cheap greps, folded into Recommended Next Focus), and the §8/§10 design-wide spot-checks.

## Actions Taken

1. Read generation-1 archived synthesis in full (both halves, 364 lines) plus current config, state log, strategy, and registry.
2. Grep-verified `quality_class` producers/consumers across `.skilled`; read `upsert.cjs:200-269`, `coverage-graph-signals.ts` match context, prompt-pack graphEvent node shape (this run's own dispatch contract).
3. Read `dispatch-iteration.cjs:200-419`, `deep-research.yaml` `if_cli_claude_code` block, `deep-review.yaml:1517-1531`, `fanout-run.cjs:3940-4014` for D2.
4. Read `convergence.cjs` matches for `minIterations`/`loopType === 'research'` (incl. :1159, :1347-1348) and `deep-review-config.json` for D3.
5. Read `reduce-state.cjs:1922-1944,2400-2619`, `continuity-thread.cjs:76-130`, and grepped the whole deep-loop lib for `nextFocus` consumers for D5.
6. Compared the agent definition's progressive-synthesis write permission against this run's rendered allowed-write list for D6; probed D7/D9 by recording this iteration's record through the append gateway and reading back the projected row.

## Findings

1. **D1 CONFIRMED, verbatim.** `sourceDiversity` counts distinct `metadata.quality_class` strings per question; `coverage-graph-signals.ts:680` accepts any non-empty string with no vocabulary check. Only test files produce the value (`convergence-script.vitest.ts:49-50,70-71,112`, `coverage-graph-signals.vitest.ts:67-68`); no runtime producer exists. The prompt-pack node shape still has no `metadata` field (this run's own OUTPUT CONTRACT defines nodes as `{type,id,kind,label}` only). Sharpened detail: `upsert.cjs:235` forwards leaf-supplied `n.metadata` verbatim onto the node — that passthrough is exactly what made the generation-1 iteration-7 gaming demonstration possible. [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/coverage-graph/coverage-graph-signals.ts:680] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/upsert.cjs:235] [SOURCE: .skilled/skills/system-deep-loop/runtime/tests/integration/convergence-script.vitest.ts:49]

2. **D2 CONFIRMED, verbatim — all four sub-claims with current lines.** `dispatch-iteration.cjs:213-220`: `claudeReview = executor === 'cli-claude-code' && loopType === 'review'`; an explicit `--claude-config-dir` on a research run throws `UsageError: flag '--claude-config-dir' is only valid with --executor cli-claude-code --loop-type review`. `dispatch-iteration.cjs:355`: the config dir is validated only `loopType === 'review'`; the research branch (`:407` onward) builds the executor with no `configDir` field. `deep-research.yaml:1440-1442` invokes `dispatch-iteration.cjs --executor cli-claude-code {cli_dispatch_args}` with no `--claude-config-dir`, so a configured `configDir` is silently dropped on single-executor research. `deep-review.yaml:1519` forwards `--claude-config-dir "{optional_claude_config_dir}"`. `fanout-run.cjs:3962,3995` injects `CLAUDE_CONFIG_DIR` for `lineage.kind === 'cli-claude-code' && lineage.configDir` with no loop-type condition — fan-out research lineages unaffected, as claimed. Inherited `CLAUDE_CONFIG_DIR` reaches the child through the env allowlist per the code comment at `dispatch-iteration.cjs:385-386`. Sub-claim not re-verified: `executor-audit.ts:155,:284` (research audit record omits `configDir`) — the core mechanism is fully confirmed without it. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/dispatch-iteration.cjs:213] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/dispatch-iteration.cjs:355] [SOURCE: .skilled/commands/deep/assets/deep-research.yaml:1442] [SOURCE: .skilled/commands/deep/assets/deep-review.yaml:1519] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:3962] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:3995]

3. **D3 CONFIRMED, verbatim.** `deep-review-config.json:12` sets `antiConvergence.minIterations: 2`. `convergence.cjs:1347-1348` reads `config.minIterations ?? antiConvergence.minIterations` for both loop types, so the value is loaded — but the floor check at `convergence.cjs:1159` is `if (loopType === 'research' && minIterations > 1 && iterationCount < minIterations)`. A review run can therefore still stop at iteration 1. [SOURCE: .skilled/skills/system-deep-loop/deep-review/assets/deep-review-config.json:12] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:1159] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:1347]

4. **D5 CONFIRMED — "no reader" upgraded from grep-INFERENCE to CONFIRMED for the research path.** `reduce-state.cjs:1927,1939` parses the free-text `## Questions Remaining` section into `questionsRemaining`; `reduce-state.cjs:1930` also parses `## Recommended Next Focus` into `iteration.nextFocus`. `continuity-thread.cjs:86-106` feeds `questionsRemaining` (file records) and `record.openQuestions`/`record.questionsRemaining` (state records) into carried-forward candidates, deduplicating only against *open* machine questions — answered questions are never filtered, so stale free text keeps steering. A full-lib grep for `nextFocus`/`deriveNextFocusFromContinuity` returns only the definition (`continuity-thread.cjs:130`) and export (`:172`): the parsed `nextFocus` field has no consumer on the research focus path. `resolveNextFocus` precedence confirmed: pivot focus → blocked-stop recovery → continuity → promoted idea (`reduce-state.cjs:2427-2473`). [SOURCE: .skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs:1927] [SOURCE: .skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs:1930] [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/continuity-thread.cjs:86] [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/continuity-thread.cjs:130] [SOURCE: .skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs:2420]

5. **D6 CONFIRMED LIVE in this run.** The agent definition (Step 10) directs updating `research/research.md` when `progressiveSynthesis == true`, and this run's config sets `"progressiveSynthesis": true` — yet this iteration's rendered prompt pack lists exactly three allowed write paths (iteration narrative, delta file, gateway writes) and `research/research.md` is not among them. The two contracts still conflict, so progressive synthesis cannot happen; the conflict was recorded as a scope_violation finding (below) instead of writing. [SOURCE: .skilled/agents/deep-research.md] [SOURCE: specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/research/deep-research-config.json:15]

6. **D7 CONFIRMED LIVE.** This iteration's submitted record carried `target_agent`, `resolved_route`, `agent_definition_loaded`, `runId`, `sessionId`, `lineageId`, `keyQuestions`, `graphEvents`, `toolsUsed`, `sourcesQueried`, `focusTrack`, `edgeCase`, `findingsCount`, `noveltyJustification`. The gateway-refreshed `deep-research-state.jsonl` projection kept only `{type, iteration, run, status, newInfoRatio, ruledOut, focus, mode, answeredQuestions, timestamp}` — every route-proof and telemetry field was dropped. `verify-iteration.cjs:255-271` checks the four route-proof fields and `:560-563` reports failure only if they fail "in both the state record and deltas/iter-NNN.jsonl" — the delta fallback is the only pass path, as generation 1 claimed. **Stale-reference correction:** `legacy-compatibility.ts` no longer contains `keyQuestions`, `verificationGaps`, `graphEvents`, `resolved_route`, `target_agent`, or `agent_definition_loaded` at all — the cited `:643` seam has moved (INFERENCE: the dropping now happens in the gateway's projection writer; the exact module is unlocated this iteration). [SOURCE: specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/research/deep-research-state.jsonl] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/verify-iteration.cjs:256] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/verify-iteration.cjs:560]

7. **D9 CONFIRMED LIVE** (same probe). `keyQuestions` was present in the submitted record and absent from the projected row, so the `focusAlignment` guard's input (state-log `keyQuestions` per generation-1's `convergence.cjs:1594` citation) still never materializes. Harmless today; it would start firing only if the projection ever kept the field — same caveat generation 1 gave. [SOURCE: specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/research/deep-research-state.jsonl]

8. **NEW minor finding — narrative heading contract mismatch.** This run's prompt pack requires narrative headings named "Next Focus", while the reducer parses `Recommended Next Focus` (`reduce-state.cjs:1930`) and `Questions Remaining` (`reduce-state.cjs:1927`). A leaf that follows the prompt pack's literal heading list ("Next Focus") produces a section the `Recommended Next Focus` parser may or may not match depending on `extractSection`'s matching rule (INFERENCE — `extractSection` implementation unread). This iteration used `## Recommended Next Focus` to satisfy both contracts. Adjacent to D5's free-text seam. [SOURCE: .skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs:1930]

## Questions Answered

Q1 partially: D1, D2, D3, D5, D6, D7 fully verified with current line evidence; D9 verified incidentally via the live projection probe. Not yet verified: D4 (origin → `operator` at `reduce-state.cjs:128,:204`), D8 (transient lock at `loop-lock.cjs:183-186`), and the §8/§10 design-wide claims. `answeredQuestions` left empty on the record — marking Q1 done would overclaim.

## Questions Remaining

- Q1 residual: D4 (`normalizeQuestionOrigin` fallback), D8 (loop-lock pid-liveness), §8/§10 design spot-checks.
- Q2: review-side pivot adapter, deep-review reducer, review prompt pack, fanout-merge internals.
- Q3: pivot-after-`all_questions_answered` yield; D1 honest fix (quality_class producer + closed vocabulary).
- Q4: skill-advisor scorer (`df-idf.ts`) and prompt-policy gate on casual chat.
- Q5: concrete change slices with tests, risks, ordering.

## Ruled Out

None — no approach failed; the verification recipe (grep + line-anchored reads + live projection probe) worked on the first pass.

## Dead Ends

None.

## Edge Cases

- Ambiguous input: "verify design and D1–D9" is broader than one iteration; chose the generation-1 ship-first subset per the strategy's Next Focus and deferred the rest explicitly.
- Contradictory evidence: none.
- Missing dependencies: none — all cited files exist.
- Partial success: D4/D8/design surface unverified by budget choice, recorded as residual; `executor-audit.ts` sub-claim unverified (core D2 mechanism confirmed without it).

## SCOPE VIOLATIONS

- `research/research.md` progressive-synthesis update: mandated by the agent definition under `progressiveSynthesis == true` (config line 15 sets it true) but absent from this run's allowed-write list. Per the scope-violation protocol the write was not attempted; recorded here and as delta finding f-iter001-005 (this is D6 recurring live).

## Sources Consulted

- `specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/research_archive/20261117T103614Z/research.md` (full)
- `.skilled/skills/system-deep-loop/runtime/lib/coverage-graph/coverage-graph-signals.ts:680`, `coverage-graph-query.ts:131`
- `.skilled/skills/system-deep-loop/runtime/scripts/upsert.cjs:235`
- `.skilled/skills/system-deep-loop/runtime/tests/integration/convergence-script.vitest.ts:49-50,70-71,112`; `tests/unit/coverage-graph-signals.vitest.ts:67-68`
- `.skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:352,1051,1073,1159,1347,1739`
- `.skilled/skills/system-deep-loop/runtime/scripts/dispatch-iteration.cjs:154,213-220,355,385-386,407`
- `.skilled/skills/system-deep-loop/runtime/scripts/verify-iteration.cjs:14,255-271,560-563`
- `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:779-783,3962,3995`
- `.skilled/commands/deep/assets/deep-research.yaml:1440-1448`; `deep-review.yaml:1517-1531`
- `.skilled/skills/system-deep-loop/deep-review/assets/deep-review-config.json:12`
- `.skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs:1922-1944,2420-2600`
- `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/continuity-thread.cjs:76-130,172`
- `.skilled/skills/system-deep-loop/runtime/lib/deep-research-ledger-schema/legacy-compatibility.ts` (grep — cited fields absent)
- `research/deep-research-state.jsonl` (live projection, this run)

## Assessment

- New information ratio: 0.63
- Questions addressed: Q1
- Questions answered: none fully (Q1 partially — 7 of 9 defects verified, 6 in the ship-first set plus D9)
- Note: the gateway returned one informational warning — "Trusted evidence yield was absent and remains explicitly zero" — recorded for reducer visibility.

## Reflection

- What worked and why: pairing each generation-1 file:line citation with a targeted grep/read verified six defects in ~9 research calls; the live projection probe settled D7 and D9 with zero extra cost by folding the check into the mandatory gateway call.
- What did not work and why: nothing failed; D4/D8 were consciously deferred as cheaper tails than the verified set.
- What I would do differently: locate the projection-writer module that replaced the `legacy-compatibility.ts` upcast before claiming the seam's mechanism — the current evidence proves the drop, not the code path that performs it.

## Recommended Next Focus

Q3 in two halves: (a) trace whether a divergent pivot after `all_questions_answered` buys more than ~1 iteration — walk `divergent-pivot.ts` + the YAML pivot branch end to end; (b) the honest D1 fix — who should produce `quality_class` and the closed vocabulary. Fold in the two-grep Q1 residual: `normalizeQuestionOrigin` at `reduce-state.cjs:128/:204` (D4) and `loop-lock.cjs:183-186` (D8). D1's evidence is fresh this iteration and directly feeds that question.

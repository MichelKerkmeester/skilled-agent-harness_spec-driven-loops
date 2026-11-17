# Iteration 5: Q5 — Concrete, Independently Shippable Change Slices

## Focus

Convert the generation-1 recommendations and this generation's verified findings (iterations 1–4: corrected D1–D9, pivot-yield mechanics and the honest D1 fix, six review-side findings, the completed-run extension design) into a slice plan where each slice names its files, behavior change, proving tests (existing + new), default-path risk, and ordering dependencies. Per the dispatch, the completed-run extension is placed first because the operator wants it built first. Residual: scoped note on what Q4 (skill-advisor scorer + prompt-policy gate) still needs.

## Actions Taken

1. Read run state (config, state log, strategy) — session `2026-11-17T10:36:36.000Z`, iteration 5 of 5, `progressiveSynthesis: true` but absent from the allowed-write list (same live D6 conflict recorded in iterations 1–3).
2. Read all four prior iteration narratives in full to harvest verified file:line evidence per slice.
3. Globbed the deep-loop vitest surface (`runtime/tests/**/*.vitest.ts`) to name the existing suites each slice must extend rather than inventing test names.
4. Located and sampled the Q4 subsystem: `system-skill-advisor/runtime/lib/df-idf.ts` (head), `prompt-policy.ts` (:1–80), and the caller/test map via grep.

## Findings

### F1 — The slice plan decomposes into two layers: 8 independent defect-fix slices and 3 dependent frontier slices, plus 1 hygiene slice and the extension slice that stands alone

**SLICE A — completed-continue / `--extend=N` (operator priority, build first).**
- Files: `.skilled/commands/deep/research.md` + `review.md` argument tables (un-reject `completed-continue`, add `--extend`); `deep-research.yaml` `lineage_mode` param (:68), `note_deferred_branches` (:514), new pre-`step_classify_session` config-mutation step + gateway append for `deep_research.run_extended`; `deep-review.yaml` same surfaces (:58, :538) plus `on_completed_session` (:584–587) must check `lineage_mode` BEFORE `skip_to: phase_synthesis`; `deep-research-ledger-schema.ts` (`DATA_FIELD_RULES`, `SCOPE_FIELDS`, wire types); `deep-research-ledger-types.ts`; `legacy-compatibility.ts` (`LEGACY_EVENT_STEMS.extended` + upcast case + `ReducerReadRowShape`); `deep-review-ledger-types.ts` + its schema (`deep_review.run_extended`); `loop-protocol.md` Lifecycle Branch Contract row; config assets (`allowedModes`) for both loops; regenerated contract/presentation outputs. [SOURCE: iteration-004 findings 5–10]
- Behavior: `--extend=N [--extend-minutes=M]` on a completed packet mutates config in place (status→active, `maxIterations += N`, `maxDurationMinutes += M`, `lineage.continuedFromRun = <completed count>`), appends `run_extended` through the gateway, and classify lands `resume` on next entry. Never re-stamp `createdAt`. Edge contract: under `stopPolicy:convergence` an extension with no new questions re-stops on `all_questions_answered`; document coupling to inbox injection or `--convergence-mode=off` for the extension window. [SOURCE: .skilled/commands/deep/assets/deep-research.yaml:1766-1771; .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:1149]
- Tests: extend `runtime/tests/unit/workflow-restart-lifecycle.vitest.ts` (ordering), `system-spec-kit/runtime/cli/tests/deep-review-auto-restart-contract.vitest.ts`, `deep-research-ledger-schema.vitest.ts` + upcast suites, `append-mode-event-legacy-seam.vitest.ts`, reducer Lifecycle-section parity test (`loop-protocol.md:146` mandates parity), telemetry test tolerating two `completed` terminal rows per sessionId (`deep-research.yaml:1929-1937`), manual-playbook entry.
- Default-path risk: LOW — opt-in mode; the real risk is schema/upcast drift breaking existing projections (mitigated by `check-ledger-stem-producers.vitest.ts`, `check-projection-coverage.vitest.ts`).
- Ordering: none. Self-contained; touches no code the other slices touch.

**SLICE B — D2: research `cli-claude-code` drops `--claude-config-dir`.**
- Files: `dispatch-iteration.cjs` (relax the `:213-220` guard to allow the flag for research `cli-claude-code`; `:355` validate on research too; `:407` research branch gains `configDir`), `deep-research.yaml:1440-1442` (forward `--claude-config-dir`), `executor-audit.ts` (add `configDir` to research audit record). [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/dispatch-iteration.cjs:213; .skilled/commands/deep/assets/deep-research.yaml:1442]
- Tests: `stress/cli-adapter/cli-claude-code.vitest.ts`, `cli-matrix.vitest.ts`, `combo-matrix.vitest.ts` + one new unit case: research executor receives `configDir`.
- Risk: LOW — additive flag acceptance; fan-out already injects `CLAUDE_CONFIG_DIR` loop-type-blind (`fanout-run.cjs:3962,3995`), so this only closes the single-dispatch gap.
- Ordering: none.

**SLICE C — D3: review `minIterations` floor never applied.**
- Files: `convergence.cjs:1159` — drop or widen `loopType === 'research'` so review honors `antiConvergence.minIterations: 2` (`deep-review-config.json:12`). [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:1159]
- Tests: `integration/review-depth-convergence.vitest.ts`, `integration/review-stop-path-replay.vitest.ts` + new case: review stop at iteration 1 is vetoed to CONTINUE.
- Risk: MEDIUM — default review runs gain up to one extra iteration before stopping; that is the configured intent, but it changes default-path stop timing and cost.
- Ordering: none; keep ordered before the frontier veto insertion (Slice J) so floor semantics land first in the same function.

**SLICE D — D5 + review twin: leaf free text hijacks focus.**
- Files: research `reduce-state.cjs:1927-1939` (parse sites), `continuity-thread.cjs:86-106` (filter answered machine questions out of carried-forward candidates), `reduce-state.cjs:2427-2473` (`resolveNextFocus` precedence); review `reduce-state.cjs:2184-2215` (same chain; free-text extraction `:355`/`:379`). [SOURCE: iteration-001 finding 4; iteration-003 finding 3]
- Behavior: answered questions can no longer steer focus via stale `Questions Remaining` text; review fallback ordering unchanged otherwise.
- Tests: `deep-research-reduce-state.vitest.ts`, `continuity-thread.vitest.ts` + new answered-filter cases on both loop types.
- Risk: MEDIUM — observable focus changes in running packets; behavior-only.
- Ordering: none; land before Slice J (frontier Next-Focus pick composes with this precedence).

**SLICE E — prompt-pack contract alignment (D6 + heading mismatch).**
- Files: `render_prompt_pack` blocks in both YAMLs, `.skilled/agents/deep-{research,review}.md` Step 10/allowed-write list vs `progressiveSynthesis`; unify heading vocabulary — either reducer `extractSection` accepts `Next Focus` or the packs render `Recommended Next Focus` (`reduce-state.cjs:1930`). [SOURCE: iteration-001 findings 5, 8]
- Tests: `deep-research-deltas-contract.vitest.ts`, `deep-review-deltas-contract.vitest.ts`, `check-documentation-drift.vitest.ts`.
- Risk: LOW-MEDIUM — touches the leaf contract; both sides must change in lockstep or synthesis stays unreachable.
- Ordering: none; land before Slice J (frontier adds a pack row — one contract, not two).

**SLICE F — D7/D9: state-log projection drops route-proof + telemetry fields.**
- Files: the projection writer downstream of `legacy-compatibility.ts` (the `:643` seam moved — first task is locating the current dropping module, likely in the gateway projection path), `verify-iteration.cjs:255-271,560-563`. [SOURCE: iteration-001 findings 6–7]
- Behavior: projection keeps `target_agent`, `resolved_route`, `agent_definition_loaded`, `runId`, `sessionId`, `lineageId`, `keyQuestions`, `graphEvents`, `toolsUsed`, `sourcesQueried`; D9's `focusAlignment` guard input materializes.
- Tests: `append-mode-event-cli.vitest.ts`, `append-mode-event-legacy-seam.vitest.ts`, `check-projection-coverage.vitest.ts`, `deep-research-projections-contract.vitest.ts` + a regression asserting the 4 route-proof fields survive projection.
- Risk: LOW — field-additive to consumers that select keys; verify no reducer section keys off field absence.
- Ordering: none.

**SLICE G — D1 honest fix: `quality_class` derived at the upsert choke point.**
- Files: `upsert.cjs:211-245` (stamp `deriveQualityClass(source)` in the node-validation loop; strip/overwrite leaf-supplied `quality_class`), coverage-graph lib (new `deriveQualityClass` + frozen vocabulary const beside `SAFE_METADATA_KEYS`, `coverage-graph-query.ts:123-136`; vocabulary e.g. `{repo-code, repo-test, repo-spec, skill-doc, ledger-state, external-doc, external-other, unclassified}`). Alternative: delete the stored field and derive inside `computeResearchSourceDiversityFromData` at query time — removes the gaming surface but loses the stored label for `query.cjs`. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/upsert.cjs:235; .skilled/skills/system-deep-loop/runtime/lib/coverage-graph/coverage-graph-signals.ts:680]
- Tests: `coverage-graph-signals.vitest.ts`, `integration/convergence-script.vitest.ts` (existing fixtures at :49-50,:70-71,:112 assert leaf-supplied values — fixtures must change to derived expectations), `integration/upsert-script.vitest.ts`, `deep-research-graph-upsert.vitest.ts`.
- Risk: LOW-MEDIUM — signal semantics tighten; stored historical nodes keep old labels, so dashboards mixing generations show both classes (document it).
- Ordering: none technically; land before Slice J so the frontier veto reads trustworthy diversity.

**SLICE H — D10 (new, iter-3): custom `reviewDimensions` make `all_dimensions_clean` unreachable and kill the review pivot.**
- Files: `reduce-state.cjs:1225-1247` — `buildDimensionCoverage` must track every normalized `config.reviewDimensions` entry, not only the four `REQUIRED_DIMENSIONS` keys; `convergence.cjs:1540-1556` already computes `missingDimensions` over the configured set. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:1225; .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:1540]
- Tests: `deep-research-reduce-state.vitest.ts` (review half), `integration/review-depth-convergence.vitest.ts` + new case: custom-dimension config reaches a clean stop.
- Risk: LOW-MEDIUM — bugfix restoring designed behavior; runs using only the 4 default dimensions are unchanged.
- Ordering: strict prerequisite for Slice K.

**SLICE I — `fanout-merge.cjs` drops every review coverage surface.**
- Files: `fanout-merge.cjs:869-997` `mergeReviewRegistries` — carry `dimensionCoverage`, `traceability`, `searchCoverage`, `candidateCoverage`, `divergence`, `ruledOutCandidates` into the merged output. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:981]
- Tests: `fanout-review-focus.vitest.ts` + new merged-coverage case.
- Risk: LOW — additive output fields; merge consumers that ignore the keys are unaffected.
- Ordering: prerequisite for Slice K (merge-time coverage guard needs a merged map).

**SLICE J — frontier sub-mode core (research), the generation-1 flagship.**
- Files: research prompt pack (`frontier_proposal` delta rows), `deep-research.yaml` new `step_frontier_admit` (relevance+evidence anchor, dedupe, depth ≤ 3, ≤ 6 children/node, ≤ 40 total, monotone budget, acyclic) writing `research/inbox.jsonl` `origin: frontier` rows, `deep-research/scripts/reduce-state.cjs` (`registry.frontier` projection + Next Focus lowest-depth pick), `convergence.cjs` `frontierOpen` veto inserted after the minIterations floor, depth budget constants (50/35/15), `fanout-run.cjs` `frontier_scope` partition. [SOURCE: strategy §12 gen-1 design summary; iteration-002/003 mechanics]
- Tests: new admit-step unit suite (each rule + rejection), reducer projection tests, convergence veto tests (`deep-research-convergence-floor.vitest.ts` extension), fanout partition tests, `deep-research-authority-composition.vitest.ts` for inbox-write authorization.
- Risk: MEDIUM — opt-in (`--depth-mode=expansive`) so the default path is unchanged; the real risk is inbox-write authorization bypassing the gateway and unbounded frontier growth — both addressed inside the admit step.
- Ordering: AFTER D (focus precedence), E (pack contract), G (diversity signal honest), and F (projection carries new fields) — frontier composes all four.

**SLICE K — review-side frontier.**
- Files: review prompt pack proposal channel (iter-3 finding 6), review admission surface into `candidateCoverage`/`searchDebt` or a `registry.frontier` the review nextFocus chain reads (iter-3 finding 2 — inbox.jsonl is ruled out), `divergent-review-pivot.ts` seed-vocabulary extension (:203-289 closed seeds), `deep-review.yaml` admit step. [SOURCE: iteration-003 findings 2, 4, 6]
- Tests: `deep-review-deltas-contract.vitest.ts`, review admit-step suite, `review-depth-convergence.vitest.ts` frontier cases.
- Risk: MEDIUM — same opt-in posture; plus finding 4's permanent `unswept-dimension` seed on custom dims must be deduped or it spams every pivot.
- Ordering: LAST — needs H (coverage map can represent custom dims), I (merged coverage exists), and J (pattern proven on research).

**SLICE L — pivot hygiene (small, optional).**
- Files: `divergent-pivot.ts:285-288` — decide per-pivot vs lifetime `maxCouncilSeatOutputs: 9` (resumed pivot currently burns lifetime seats); `:287,:739` dead `minRemainingIterations` (unreachable — cap outranks it); council fail-closed single retry for `council_*` refusals. [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/divergent-pivot.ts:285]
- Tests: `integration/divergent-pivot.vitest.ts`, `council/multi-seat-dispatch.vitest.ts`.
- Risk: LOW — config-semantics clarification.
- Ordering: none.

### F2 — Dependency graph: A stands alone; B–I and L are mutually independent; J depends on {D, E, F, G}; K depends on {H, I, J}

Recommended build order honoring the operator's priority and the prerequisites: **A → (B, C, D, E, F, G, H, I, L in any order / parallel) → J → K**. The eight defect slices are each one-to-three files plus tests and can ship in any sequence; the two frontier slices are the only ones with hard prerequisites. D4 (`normalizeQuestionOrigin` fallback at `reduce-state.cjs:128,:204`) and D8 (`loop-lock.cjs:183-186` pid-liveness) remain unverified — they fold into Slices D and A respectively as verification tasks during implementation rather than blocking the plan. [INFERENCE: dependency ordering derived from the seam-sharing analysis above]

### F3 — Slice A is ready to build as specified; its only open choice is placement, and iteration 4 already recommends the smaller diff

Iteration 4's finding 7 specified two placements — pre-classify config mutation (smaller diff, classify lands `resume` naturally) vs a new `on_completed_continue` branch. Recommendation: take the pre-classify mutation and still emit the distinct `run_extended` event through the gateway, because the dashboard Lifecycle section needs the top-up visible and a plain `resumed` row was ruled out for provenance. The one caveat to carry into implementation: review's `on_completed_session` currently `skip_to: phase_synthesis` unconditionally, so the review half of the slice needs a `lineage_mode` check added there — a divergence from the research path that finding 1 documented. [SOURCE: .skilled/commands/deep/assets/deep-review.yaml:584-587; iteration-004 findings 1, 7]

### F4 — Q4 residual: the gate that binds "auto-utilization while chatting" is `prompt-policy.ts`, upstream of the `df-idf.ts` scorer

Direct reads show `prompt-policy.ts` is a fire/skip gate driven by a JSON config (`data/prompt-policy.default.json`, overridable via `SPECKIT_ADVISOR_PROMPT_POLICY_PATH`) holding closed sets — `EXACT_SKIP_COMMANDS`, `CASUAL_ACKNOWLEDGEMENTS`, `WORK_INTENT_VERBS`, `STOP_WORDS`, `GOVERNANCE_MARKERS` — and thresholds (`MIN_VISIBLE_CHARS`, `MIN_MEANINGFUL_TOKENS`, `LENGTH_AND_TOKEN_*`, `LONG_NON_CASUAL_CHARS`), each env-tunable; a `SKILL_NAME_PATTERN` rescues short prompts that name a skill. Casual/short chat returns `fire: false` BEFORE scoring runs. `df-idf.ts` is corpus statistics only (DF/IDF computation, cache, eligibility predicate injected from `lifecycle/archive-handling`). [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/prompt-policy.ts:21-72; .skilled/skills/system-skill-advisor/runtime/lib/df-idf.ts:1-66]

What Q4 still needs for a generation-3 or follow-up pass: (1) read `prompt-policy.ts:80-223` — the evaluate function and reason vocabulary; (2) the concrete threshold values in `prompt-policy.default.json`; (3) the call site in the hook (`hooks/claude/user-prompt-submit.ts:361` region, `handlers/advisor-recommend.ts:16`) to see what a `fire:false` skips (brief only, or the scorer entirely); (4) whether generation-1's target-2 frontier decomposition names this gate or the scorer — if it names the scorer, the decomposition targets the wrong layer since a casual prompt never reaches df-idf. The fixture `tests/legacy/advisor-fixtures/skippedShortCasual.json` and `tests/legacy/advisor-prompt-policy.vitest.ts` are the cheapest ground truth for expected casual-chat behavior.

### F5 — Test-surface grounding: every slice maps to existing vitest suites; only the frontier admit step needs a new file

The glob over `runtime/tests/**/*.vitest.ts` confirms suites already exist for every touched subsystem (convergence, upsert, coverage-graph signals/query, append-mode-event, projections contract, reduce-state, divergent-pivot, fanout-review-focus, ledger schemas, cli-matrix/combo-matrix, workflow lifecycle). Slices B–I extend existing files; Slice J needs one new `frontier-admit` suite plus extensions; Slice A extends the lifecycle/restart and schema suites. No slice requires inventing test infrastructure. [SOURCE: .skilled/skills/system-deep-loop/runtime/tests/ (glob)]

## Ruled Out

- Shipping the frontier sub-mode as one large change — the defect layer is independently shippable and de-risks the surfaces frontier composes (focus precedence, pack contract, projection fields, diversity signal).
- A separate `--extend` implementation path that skips the ledger event — rejected in iteration 4 (plain `resumed` destroys provenance); reaffirmed here.
- Treating Q4's gate as the df-idf scorer — the scorer never sees casual chat because `prompt-policy.ts` gates fire/skip upstream.

## Dead Ends

None — synthesis proceeded on verified evidence; no approach failed.

## Edge Cases

- Ambiguous input: "independently shippable" was read as "mergeable in any order without semantic dependence," which is why J/K (hard prerequisites) are separated from the defect layer. D4/D8 folded into implementation-time verification rather than blocking.
- Contradictory evidence: none new; generation-1's "~1 iteration" pivot estimate was already corrected in iteration 2.
- Missing dependencies: `extractSection` matching rule (iter-1 residual) and the post-`legacy-compatibility` projection-writer location remain unlocated — both are named first-tasks inside Slices E and F rather than plan blockers.
- Partial success: Q4 is scoped-not-answered (one targeted read, not a full trace); recorded as residual with the four specific reads still needed.

## SCOPE VIOLATIONS

None. `research/research.md` remains unwritten for the same reason as iterations 1–3: `progressiveSynthesis: true` permits it under the generic contract, but this dispatch's ALLOWED WRITE PATHS names only the iteration narrative, the delta file, and gateway writes. This recurring contract conflict is itself Slice E's motivating evidence.

## Sources Consulted

- `specs/.../007-expansive-depth-mode/research/iterations/iteration-001.md` through `iteration-004.md` (full — all verified file:line evidence)
- `specs/.../007-expansive-depth-mode/research/deep-research-config.json`, `deep-research-state.jsonl`, `deep-research-strategy.md`
- `.skilled/skills/system-deep-loop/runtime/tests/**/*.vitest.ts` (glob — existing suite names per slice)
- `.skilled/skills/system-skill-advisor/runtime/lib/df-idf.ts:1-70`
- `.skilled/skills/system-skill-advisor/runtime/lib/prompt-policy.ts:1-80`
- `.skilled/skills/system-skill-advisor/runtime/tests/legacy/advisor-prompt-policy.vitest.ts`, `advisor-fixtures/skippedShortCasual.json` (grep hits)

## Assessment

- New information ratio: 0.85 (the slice decomposition, dependency graph, per-slice test/risk grounding, and the prompt-policy-upstream-of-scorer observation are new structure over iteration 1–4 evidence; +0.10 synthesis bonus for closing the run's remaining planning question)
- Questions addressed: Q5 (complete slice plan), Q4 (scoped residual note)
- Questions answered: Q5

## Reflection

- What worked and why: the four prior iterations' file:line-grounded findings made the slice plan an assembly task rather than a research task; one glob over the existing vitest tree grounded every "tests that prove it" cell instead of guessing suite names.
- What did not work and why: nothing failed. Q4 remains genuinely open — one iteration cannot both plan the slices and trace a new subsystem; the residual note names the four reads a follow-up needs.
- What I would do differently: nothing material — the operator-priority ordering (Slice A first) was preserved while still flagging that A is also the most self-contained slice.

## Questions Answered

- Q5: Turn the generation-1 recommendations into concrete, independently shippable change slices: for each slice the files, the behavior change, the tests that prove it (existing and new), the default-path risk, and the ordering dependencies.

## Questions Remaining

- Q4 (unanswered, scoped): the four reads listed in Finding 4 — `prompt-policy.ts:80-223`, `prompt-policy.default.json` thresholds, the `fire:false` call-site consequence, and whether gen-1's target-2 decomposition names the gate or the scorer.
- Q1 residual (unanswered): D4 (`normalizeQuestionOrigin` fallback, `reduce-state.cjs:128,:204`) and D8 (`loop-lock.cjs:183-186`) — folded into Slices D and A as verification tasks.
- Open sub-question: per-pivot vs lifetime `maxCouncilSeatOutputs` (Slice L decision point).

## Recommended Next Focus

Run complete — all five iterations consumed under `stopPolicy: max-iterations`. If a follow-up packet opens: Q4's four reads (highest-value remaining question), then D4/D8 verification. Implementation sequencing is Finding 2's order: A → defect layer (any order) → J → K.

## Next Focus

Q4 residual: `prompt-policy.ts` evaluate function + threshold values + call-site consequence + gen-1 target-2 decomposition check.

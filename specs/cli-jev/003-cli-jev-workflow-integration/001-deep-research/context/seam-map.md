# Jev Seam Map

## How to use this map

Each seam below is a place where this repository already makes a typed judgment (a probability, score, choice, rank or yes/no), by code, by a model or by a human. Open the cited `path:line` first; every citation is repo-relative and was opened when this map was written.
Lines tagged "Jev fit" and "No-key fallback" are inferred proposals, not facts. The closing ranking is inferred too.
Treat hook deadlines as hard ceilings. A Jev call has a 60 s client timeout and no measured latency, so any seam with a deadline under 10 s needs a shadow, cached or async shape.

## Naming clash

- This map is about the Python `jev-cli` 0.6.2 that `.skilled/skills/cli-jev/cli-usage/` wraps (`.skilled/skills/cli-jev/cli-usage/references/cli-reference.md:28`).
- The npm package `jevctl` 0.2.3 also installs a `jev` binary (`specs/cli-jev/003-cli-jev-workflow-integration/context/external repo's/jev-cli-main/package.json:2-3`, `:14-15`). It is vendored research material only; nothing below refers to it.

## The Jev contract as used here

- Hub: one transport packet, `cli-usage`, `packetKind: "transport"`, never mutates the workspace (`.skilled/skills/cli-jev/SKILL.md:20-22`, `:44-45`). The hub routes compiled-first and falls back to legacy on a sentinel (`.skilled/skills/cli-jev/SKILL.md:36-40`); `hub-router.json` sets `ambiguityDelta: 1` and a `defer` outcome (`.skilled/skills/cli-jev/hub-router.json:5-12`).
- Judgment types: `noul` (probability in [0,1]), `choice` (one submitted key), `score` (zero-based position, may be fractional), `run` (batched keyed answers) (`.skilled/skills/cli-jev/cli-usage/references/cli-reference.md:46-49`, `:123-130`).
- Command shapes: `jev noul -q ... -s ... --value </dev/null`, `jev choice ... -o key=desc`, `jev score ... -l level`, `jev run @request.json` (`.skilled/skills/cli-jev/cli-usage/SKILL.md:145-152`). `--value` prints the primary answer only and is refused with `run` after a billed call (`.skilled/skills/cli-jev/cli-usage/SKILL.md:162-165`, `:23-25`).
- Output: compact JSON on stdout; errors are `{"ok": false, "error": ...}` on stderr with stdout empty (`.skilled/skills/cli-jev/cli-usage/references/cli-reference.md:157-159`).
- Exit codes: 0 judgment, 1 unexpected response, 2 usage (no quota spent), 3 credential, 4 retryable transport, 130 interrupted (`.skilled/skills/cli-jev/cli-usage/SKILL.md:167-174`). Exit 4 must never read as a negative answer (`.skilled/skills/cli-jev/cli-usage/references/integration-patterns.md:138`).
- Key env var (name only): `TYPESAFE_API_KEY` for the default `official` provider; `AI_GATEWAY_API_KEY`, `OPENROUTER_API_KEY`, `JEV_API_KEY` for the others; `JEV_PROVIDER` picks the provider (`.skilled/skills/cli-jev/cli-usage/references/providers-and-models.md:27-34`). A missing key exits 3 on every judgment (`.skilled/skills/cli-jev/cli-usage/references/providers-and-models.md:60-63`).
- Availability checks: `command -v jev`, then `jev auth status` (never prints the key); `jev auth test` costs one billed call (`.skilled/skills/cli-jev/cli-usage/SKILL.md:96-103`, `.skilled/skills/cli-jev/cli-usage/references/providers-and-models.md:145-148`).
- Transport guard: no spawn chain by construction, no `ExecutorKind`, and a transport pairs with a workflow before any effecting operation; a `choice` answer is never permission (`.skilled/skills/cli-jev/cli-usage/SKILL.md:107-114`, `:289-293`).
- Hard rules the dispatch linter already enforces on `jev` commands: stdin bounded, choice and score cardinality of at least two (`.skilled/hooks/dispatch/lib/dispatch-rule-checks.mjs:107-113`, `:258-272`).
- Caller owns the threshold: "The threshold belongs to the caller" (`.skilled/skills/cli-jev/cli-usage/references/integration-patterns.md:43-44`); a gate may call `jev noul --value` and compare to its own threshold (`.skilled/skills/cli-jev/cli-usage/SKILL.md:297-298`).
- Latency and cost: no rate limit, quota or per-call latency figure is confirmed (`.skilled/skills/cli-jev/cli-usage/references/providers-and-models.md:166`). The client timeout is 60 s (`specs/cli-jev/001-cli-jev-creation/context/jev-cli-main/src/jev_cli/__init__.py:288`). Every judgment is a billed call (`.skilled/skills/cli-jev/cli-usage/SKILL.md:25`).
- Privacy: state is forwarded verbatim to the provider (`.skilled/skills/cli-jev/cli-usage/SKILL.md:76-77`).

## Hook deadlines (Claude runtime)

All from `.claude/settings.json`, timeouts in seconds: dispatch preflight lint 5 (`:47-48`), spec-gate enforce 5 (`:52-53`), git preflight advisory 5 (`:57-58`), task dispatch guard 5 (`:67-68`), MCP route guard 5 (`:87-88`), prompt submit (advisor shim) 3 (`:109-110`), spec-gate classify 3 (`:114-115`), session prime 3 (`:126-127`), session stop 10 (`:168-169`), completion evidence stop 10 (`:174-175`), post-edit quality 10 (`:199-200`), pre-compact inject 3 (`:221-222`).

## Seams

### S01. Advisor pass threshold
- Where: `.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:780-787`
- Today: code. A recommendation passes when confidence >= 0.8 and uncertainty <= 0.35 (`.skilled/skills/system-skill-advisor/runtime/lib/compat/contract.ts:9-12`).
- In/out: fused lane contributions per skill in; `passes_threshold` boolean out.
- Deadline: runs inside the 2500 ms advisor child (`.skilled/skills/system-spec-kit/runtime/hooks/claude/user-prompt-submit.ts:22-24`).
- Flag pattern: threshold env overrides `SPECKIT_ADVISOR_CONFIDENCE_THRESHOLD` and `SPECKIT_ADVISOR_UNCERTAINTY_THRESHOLD` (`.skilled/skills/system-skill-advisor/runtime/lib/compat/contract.ts:25-35`).
- Jev fit (inferred): `noul` "does this prompt ask for skill X" on near-threshold cases only, offline or shadow.
- No-key fallback (inferred): current numeric thresholds unchanged.

### S02. Advisor ambiguity cluster
- Where: `.skilled/skills/system-skill-advisor/runtime/lib/scorer/ambiguity.ts:22-36`, `:44-57`
- Today: code. Candidates within 0.05 score or 0.05 confidence of the top form a cluster and get `ambiguousWith` (`.skilled/skills/system-skill-advisor/runtime/lib/scorer/ambiguity.ts:7-8`).
- In/out: ranked passing recommendations in; tagged recommendations out.
- Deadline: same 2500 ms child as S01.
- Flag pattern: opt-in boolean `SPECKIT_ADVISOR_*` read through `TRUE_FLAG_VALUES`, default off (`.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:50-52`, `:69`, `:111-114`).
- Jev fit (inferred): `choice` over the cluster members as keys, with each skill's description as the option text. A cluster is exactly a small explicit option map.
- No-key fallback (inferred): keep the cluster and the existing tie order.

### S03. Advisor low-information abstention
- Where: `.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:791-821`
- Today: code. A prompt of three or fewer meaningful tokens with no task intent in a cluster without a phrase anchor has uncertainty floored so strict callers abstain.
- In/out: prompt tokens and cluster in; raised uncertainty and `passes_threshold` out.
- Deadline: 2500 ms child.
- Flag pattern: as S02.
- Jev fit (inferred): `noul` "is this prompt specific enough to route" as a shadow label for calibrating the heuristic.
- No-key fallback (inferred): the regex and token-count rule as today.

### S04. Advisor shadow lane
- Where: `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lane-registry.ts:21-27`, `:37-38`
- Today: code. Shadow lanes score with `live: false` and a `defaultShadowWeight`, behind their own env flag (`SPECKIT_ADVISOR_BM25_LEXICAL_SHADOW`); the live channel is never written from the shadow loop.
- In/out: lane matches in; shadow-only weights out.
- Deadline: 2500 ms child; a live Jev lane would not fit, a precomputed one might (inferred).
- Flag pattern: this is the pattern to copy for a new `SPECKIT_ADVISOR_JEV_SHADOW` lane (inferred name).
- Jev fit (inferred): `choice` or `score` as a shadow lane whose output is recorded, not fused.
- No-key fallback (inferred): lane reports disabled, like the semantic shadow lane's `disabledReason` (`.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/semantic-shadow.ts:15-21`).

### S05. Advisor routing-accuracy eval harness
- Where: `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-outcome-rerank.mjs:5-20`
- Today: code over a human-labeled corpus; reports MRR and right-skill@3 on a held-out split, read-only.
- In/out: labeled prompts in; accuracy metrics out.
- Deadline: none (offline).
- Flag pattern: the eval measures one flag's effect against a baseline (`.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-outcome-rerank.mjs:11-14`).
- Jev fit (inferred): the measurement bed for S01 to S04, and a place where `choice` could label unlabeled prompts for later human review.
- No-key fallback (inferred): run without the Jev arm; the baseline still reports.

### S06. Compiled routing clarify
- Where: `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/004-cli-external-orchestration/lib/router.cjs:198-216`
- Today: code. Modes within `ambiguityDelta` of the top score return `clarify` with those modes; the contract requires two to four alternatives (`.skilled/bin/lib/compiled-routing/005-decision-evaluator/lib/decision-contract.cjs:373-390`).
- In/out: detector hits and scores in; `route` or `clarify` out.
- Deadline: synchronous front door (`.skilled/bin/compiled-route.cjs:25-47`); no hook deadline, but it sits on the routing path.
- Flag pattern: tri-state `SPECKIT_COMPILED_ROUTING` (force-on, `0` kill-switch, unset per-hub) (`.skilled/bin/lib/compiled-routing/014-runtime-engine/lib/resolve.cjs:26-27`, `:56-62`).
- Jev fit (inferred): `choice` over the clarify alternatives before asking the human, only as a suggested default.
- No-key fallback (inferred): emit `clarify` as today.

### S07. Compiled routing defer on no match
- Where: `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/004-cli-external-orchestration/lib/router.cjs:164-169`
- Today: code. No detector hit returns `defer('no-match')`, and the engine documents defer as the conservative outcome (`.skilled/bin/lib/compiled-routing/014-runtime-engine/lib/compiled-route.cjs:8-11`).
- In/out: prompt in; `defer` out, caller falls back to legacy prose routing.
- Deadline: as S06.
- Flag pattern: as S06, plus `SPECKIT_COMPILED_ROUTING_DEBUG` for stderr breadcrumbs (`.skilled/bin/compiled-route.cjs:42-44`).
- Jev fit (inferred): `choice` over the hub's registered modes plus an `other` key, recorded next to the defer.
- No-key fallback (inferred): defer as today.

### S08. Goal completion verifier
- Where: `.skilled/hooks/goal/lib/goal-core.cjs:596-620`; called on every Pi `turn_end` at `.skilled/hooks/goal/pi/goal-context.ts:228-238`
- Today: code heuristic. Regexes for blocking and completion words (`.skilled/hooks/goal/lib/goal-core.cjs:132-133`) plus keyword overlap yield `met`, `not-met` or `unclear`, with confidence 0 or a fixed 0.72 and `source: 'heuristic'` (`:586-588`).
- In/out: goal objective and turn transcript (capped at 1200 chars, `:63`) in; verdict, reason, confidence out; a non-`met` verdict sends a hidden nudge.
- Deadline: none declared in the Pi hook; runs every turn (inferred cost concern).
- Flag pattern: kill-switch `OPENCODE_GOAL_DISABLED` (`.skilled/hooks/goal/lib/goal-core.cjs:42`, `:148-150`).
- Jev fit (inferred): `choice` with keys `met`, `not_met`, `unclear` against the objective and transcript; the `source` field already anticipates a non-heuristic verifier.
- No-key fallback (inferred): `verifyGoalHeuristic` unchanged.

### S09. Completion-claim detection at Stop
- Where: `.skilled/skills/system-spec-kit/runtime/lib/hooks/completion-evidence-sentinel.cjs:64`, `:113-118`; adapter `.skilled/skills/system-spec-kit/runtime/hooks/claude/completion-evidence-stop.cjs:118-132`
- Today: code. A regex over the last 400 chars decides whether the turn claims completion (`completion-evidence-sentinel.cjs:70`), then recorded artifacts decide advise or approve. Advisory only, never blocks (`completion-evidence-stop.cjs:19-20`).
- In/out: last assistant message in; `advise` with detail or approve out.
- Deadline: 10 s (`.claude/settings.json:174-175`).
- Flag pattern: `SYSTEM_COMPLETION_SENTINEL_DISABLED` (`completion-evidence-sentinel.cjs:84`) and `SYSTEM_COMPLETION_DISABLED` (`.skilled/hooks/hook-flags.env.example:18`).
- Jev fit (inferred): `noul` "does this message claim the task is complete" to cut false positives from words like "happened".
- No-key fallback (inferred): the regex.

### S10. Gate 3 prompt classification
- Where: `.skilled/skills/system-spec-kit/shared/gate-3-classifier.ts:799-859`, entry `:862`; hook `.skilled/skills/system-spec-kit/runtime/hooks/claude/spec-gate-classify.mjs:19`
- Today: code. Trigger lists, read-only disqualifiers and mixed-tail rules yield `triggersGate3` with a reason.
- In/out: prompt in; boolean plus reason out.
- Deadline: 3 s (`.claude/settings.json:114-115`).
- Flag pattern: `SYSTEM_SPEC_GATE_DISABLED`, deny scoped by `SYSTEM_SPEC_GATE_ENFORCE` (`.skilled/hooks/hook-flags.env.example:35`).
- Jev fit (inferred): `noul` "will this request write a file" as an offline disagreement audit over logged prompts, not in the 3 s hook.
- No-key fallback (inferred): the classifier alone.

### S11. Task dispatch guard
- Where: `.skilled/hooks/task-dispatch/lib/dispatch-guard.cjs:526-575`
- Today: code. A declared mode that is not in the agent's registry modes warns; a third repeated hand-off to a loop executor warns or rejects (`:80-81`).
- In/out: subagent type, prompt, session in; `allow`, `warn` or `reject` out.
- Deadline: 5 s (`.claude/settings.json:67-68`).
- Flag pattern: warn by default, reject only with `SYSTEM_DEEP_LOOP_GUARD_REJECT=1` or `SYSTEM_DEEP_LOOP_GUARD_REJECT_LOOP=1` (`:47-48`). This is the warn-first, opt-in-enforce pattern.
- Jev fit (inferred): `noul` "is this repeated dispatch a hand-rolled loop" when the count reaches the warn level.
- No-key fallback (inferred): the counter.

### S12. Git preflight advisory
- Where: `.skilled/skills/sk-git/scripts/hooks/git-preflight-advisory.mjs:117-120`, rules from `sk-git` hard rules
- Today: code. Rule checks decide which advisories fire, capped at three (`:45`).
- In/out: git command in; advisory text out; command always runs (`:134`).
- Deadline: 5 s (`.claude/settings.json:57-58`).
- Flag pattern: `SK_GIT_PREFLIGHT_DISABLED` plus per-rule `SKGIT_ADVISORY_SKIP=<id>` (`:65-66`).
- Jev fit (inferred): weak. The rules are repository facts, which the contract says Jev must not replace (`.skilled/skills/cli-jev/cli-usage/SKILL.md:78-79`).
- No-key fallback (inferred): unchanged.

### S13. MCP route guard
- Where: `.skilled/hooks/mcp-route-guard/lib/mcp-route-guard.cjs:211-217`
- Today: code. Only `allow` or `warn` can be returned (`:10-11`).
- In/out: tool name in; decision and detail out.
- Deadline: 5 s (`.claude/settings.json:87-88`).
- Flag pattern: `MCP_ROUTE_GUARD_DISABLED` (`.skilled/hooks/hook-flags.env.example:29`).
- Jev fit (inferred): weak; the decision is a manifest lookup.
- No-key fallback (inferred): unchanged.

### S14. Compaction context selection
- Where: `.skilled/skills/system-spec-kit/runtime/hooks/claude/compact-inject.ts:144-160`, `:325-350`
- Today: code. Frequency counts pick attention signals and a merge fits a 4000-token budget (`.skilled/skills/system-spec-kit/runtime/hooks/claude/shared.ts:12-14`).
- In/out: transcript tail in; merged brief out.
- Deadline: 1800 ms internal, 3 s hook (`shared.ts:12`, `.claude/settings.json:221-222`).
- Flag pattern: `SYSTEM_SESSION_LIFECYCLE_DISABLED` (`.skilled/hooks/hook-flags.env.example:33`).
- Jev fit (inferred): `run` batch "which of these N candidate sections matter for resuming" is too slow in-hook; only a precomputed variant is plausible.
- No-key fallback (inferred): unchanged.

### S15. Deep-research newInfoRatio self-report
- Where: `.skilled/skills/system-deep-loop/deep-research/references/convergence/convergence-signals.md:55-73`
- Today: model. Each iteration agent assigns `newInfoRatio` from a rubric (1.0, 0.7, 0.5, 0.2, 0.0), and three weighted signals vote STOP (`:42-46`).
- In/out: iteration findings vs prior knowledge in; ratio in [0,1] out.
- Deadline: none (loop iteration).
- Flag pattern: `DEEP_LOOP_MIN_OBSERVATIONS` and `DEEP_LOOP_MIN_OBSERVATIONS_GUARD` env inputs (`.skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:246-257`).
- Jev fit (inferred): `score` on the rubric's five levels, run by the reducer as an independent second rater; the agent's own number stays authoritative.
- No-key fallback (inferred): the agent's self-report.

### S16. Convergence STOP legality
- Where: `.skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:387-416`, `:421-444`, `:480-484`
- Today: code. Thresholded signals and blocking guards yield `STOP_ALLOWED`, `STOP_BLOCKED` or continue; STOP is allowed "pending newInfoRatio agreement".
- In/out: coverage-graph signals in; decision plus blockers out.
- Deadline: none.
- Flag pattern: as S15.
- Jev fit (inferred): none directly; this is where a Jev second-rater from S15 or S17 would enter as one more signal.
- No-key fallback (inferred): unchanged.

### S17. Deep-review severity and adversarial replay
- Where: `.skilled/skills/system-deep-loop/deep-review/references/protocol/completion-criteria.md:60-63`, `:75`
- Today: model. The reviewer assigns P0, P1 or P2; every P0 must survive an adversarial self-check or be downgraded; verdict is PASS, CONDITIONAL or FAIL by severity counts. `riskScore` is advisory only.
- In/out: finding with `file:line` evidence in; severity and verdict out.
- Deadline: none.
- Flag pattern: none found for severity; reuse the shadow-then-enforce pattern (inferred).
- Jev fit (inferred): `choice` with keys `P0`, `P1`, `P2`, `not_a_finding` as an independent replay of each P0, recorded beside the agent's call.
- No-key fallback (inferred): the agent's adversarial self-check.

### S18. Fan-out near-duplicate collapse
- Where: `.skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:341`, `:348-351`
- Today: code. Two findings collapse when body keys match and title Jaccard overlap is at least 0.15.
- In/out: two finding records in; boolean out.
- Deadline: none (merge step).
- Flag pattern: none; a constant.
- Jev fit (inferred): `noul` "do these two findings make the same point" for pairs near the 0.15 line, and for cross-lineage pairs with different bodies that code never compares.
- No-key fallback (inferred): the Jaccard rule.

### S19. AI Council verdict stability
- Where: `.skilled/skills/system-deep-loop/deep-ai-council/references/convergence/convergence-signals.md:56-63`
- Today: model adjudicator; stop when round-to-round verdict delta falls under 0.20.
- In/out: adjudicator verdicts per round in; delta out.
- Deadline: none.
- Flag pattern: none found.
- Jev fit (inferred): `noul` "did the verdict materially change between these two rounds" as the delta measure.
- No-key fallback (inferred): the adjudicator's own delta.

### S20. Next-focus selection
- Where: `.skilled/skills/system-deep-loop/runtime/lib/next-focus/next-focus-selection.ts:196-214`
- Today: code. Candidates rank by `scoreBps` from coverage gaps (`:92`, `:200`).
- In/out: candidate foci in; one selected focus out.
- Deadline: none.
- Flag pattern: a shadow comparator already exists (`:352`).
- Jev fit (inferred): `choice` over the top candidates, compared in the existing shadow path.
- No-key fallback (inferred): the `scoreBps` order.

### S21. Executor demotion
- Where: `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/bayesian-scorer.ts:13-24`, `:35-45`
- Today: code. Laplace-smoothed success rate below 0.5 after three calls demotes a model.
- In/out: success and total counts in; boolean out.
- Deadline: none.
- Flag pattern: none.
- Jev fit (inferred): weak; the input is counted outcomes, not text. Jev could only label whether a single output counts as a success.
- No-key fallback (inferred): unchanged.

### S22. Model-benchmark grader
- Where: `.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/score-model-variant.cjs:198-211`; default kind at `.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/run-benchmark.cjs:577`
- Today: pluggable. `noop` returns 1.0, `mock` is deterministic, `llm` calls a real grader for dimension D4 (hallucination, weight 0.15, `score-model-variant.cjs:58`).
- In/out: fixture and output text in; `{score, confidence, parse_status}` out.
- Deadline: none.
- Flag pattern: `--grader noop|mock|llm` (`.skilled/commands/deep/model-benchmark.md:111`) and `GRADER_MODEL` env with a family-collision check (`run-benchmark.cjs:612-618`).
- Jev fit (inferred): a fourth grader kind, `jev`, using `score` over ordered hallucination levels; the factory already returns the needed shape.
- No-key fallback (inferred): `noop` or `mock`, which are already the defaults.

### S23. Spec-folder alignment on save
- Where: `.skilled/skills/system-spec-kit/runtime/cli/spec-folder/alignment-validator.ts:73-75`, `:508-516`
- Today: code. Topic-overlap score >= 70 proceeds, >= 50 warns and proceeds, below that lists alternatives.
- In/out: conversation topics and folder name in; proceed or alternatives out.
- Deadline: none (save CLI).
- Flag pattern: `SPECKIT_FOLDER_DISCOVERY_TOKEN_THRESHOLD` numeric override (`.skilled/skills/system-spec-kit/references/config/environment-variables.md:177`).
- Jev fit (inferred): `choice` over the alternative folders when the score falls under 50.
- No-key fallback (inferred): the listed alternatives.

### S24. Spec level recommendation
- Where: `.skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh:19-22`, `:42-47`, `:106-109`
- Today: code over human-supplied flags. The caller passes `--auth`, `--api`, `--db`, `--architectural`; points map to Levels 0 to 3.
- In/out: LOC, file count and risk flags in; level out.
- Deadline: none.
- Flag pattern: CLI flags.
- Jev fit (inferred): `noul` per risk flag ("does this task change authentication") so the flags stop depending on the caller's memory.
- No-key fallback (inferred): caller-supplied flags.

### S25. Post-save quality review
- Where: `.skilled/skills/system-spec-kit/references/memory/save-workflow.md:577-598`
- Today: code emits HIGH issues; a human or agent patches them by hand. The gate is calibrated at 0.4 signal density.
- In/out: saved continuity docs in; severity-tagged issues out.
- Deadline: none.
- Flag pattern: `SPECKIT_SAVE_QUALITY_GATE_EXCEPTIONS=true` (`:598`).
- Jev fit (inferred): `score` "how retrievable is this title and trigger set" as a second signal beside density.
- No-key fallback (inferred): the density gate.

### S26. Manual playbook verdicts
- Where: `.skilled/skills/cli-jev/cli-usage/manual-testing-playbook/manual-testing-playbook.md:24`
- Today: human or agent. Only PASS, FAIL or SKIP with a named blocker.
- In/out: observed output vs expected observable in; verdict out.
- Deadline: none.
- Flag pattern: none.
- Jev fit (inferred): `choice` with keys `pass`, `fail`, `skip` as a second opinion, never the recorded verdict.
- No-key fallback (inferred): human verdict.

## Env flag conventions

- Hook kill-switches: every hook is on by default; a truthy `*_DISABLED` turns one off, `SYSTEM_HOOKS_DISABLED` turns all off, and a real env var overrides the gitignored `hook-flags.env` (`.skilled/hooks/hook-flags.env.example:5-14`, `.skilled/hooks/shared/hook-flags.cjs:147-169`). Canonical index: `.skilled/hooks/README.md:40`, `:50-51`.
- Graduated `SPECKIT_*` flags default ON and are disabled with `false` (`.skilled/skills/system-spec-kit/references/config/environment-variables.md:136`).
- Opt-in `SPECKIT_*` flags default OFF with a separate `_ENFORCE` promotion: `SPECKIT_COMPLETION_FRESHNESS` and `SPECKIT_COMPLETION_FRESHNESS_ENFORCE` (`.skilled/skills/system-spec-kit/references/config/environment-variables.md:159-164`). The code returns a pass tagged `not_opted_in` when off (`.skilled/skills/system-spec-kit/runtime/cli/validation/continuity-freshness.ts:115-119`, `:603`).
- Report-only until set: `SPECKIT_STATUS_COMPLETION_CONSISTENCY_GATE` (`.skilled/skills/system-spec-kit/references/config/environment-variables.md:174`).
- Advisor opt-in booleans accept `1`, `true`, `yes`, `on`, `enabled` and default false (`.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:50-52`, `:69`, `:111-114`).
- Shadow lanes carry their own env flag, `live: false` and a shadow weight (`.skilled/skills/system-skill-advisor/runtime/lib/scorer/lane-registry.ts:21-27`).
- Warn by default, reject by opt-in: `SYSTEM_DEEP_LOOP_GUARD_REJECT` (`.skilled/hooks/task-dispatch/lib/dispatch-guard.cjs:47-48`, `:544-551`).
- Shadow result paired with the authoritative legacy result: `createStoppingClocksShadowResult` returns `authority: 'legacy-convergence'` (`.skilled/skills/system-deep-loop/runtime/lib/stopping-clocks/stopping-clock-shadow.ts:10-20`).
- Tri-state routing flag with an explicit kill-switch: `SPECKIT_COMPILED_ROUTING` (`.skilled/bin/lib/compiled-routing/014-runtime-engine/lib/resolve.cjs:56-62`).
- Jev's own provider flags already use the `JEV_*` prefix (`JEV_PROVIDER`, `JEV_ENDPOINT`, `JEV_MODEL`) (`.skilled/skills/cli-jev/cli-usage/references/providers-and-models.md:32-34`). A repo-side opt-in would follow the `SPECKIT_*` or hook-concern prefix instead (inferred).

## Top 10 seams (inferred ranking)

1. S22 model-benchmark grader: a pluggable grader factory already exists, runs offline and has no deadline.
2. S08 goal verifier: a regex decides `met` versus `unclear`, the output is already a closed three-way choice, and the record carries a `source` field.
3. S17 deep-review P0 replay: an independent severity `choice` beside the agent's own self-check is measurable against recorded verdicts.
4. S02 advisor ambiguity cluster: a cluster is a two-to-four key option map, and the eval harness in S05 can measure it.
5. S18 fan-out near-duplicate collapse: the 0.15 Jaccard line is a known blind spot, and merge is offline.
6. S15 newInfoRatio second rater: the rubric is already five ordered levels, a clean `score` fit, and it feeds STOP.
7. S04 advisor shadow lane: the repo already has the shadow-lane flag pattern, so an opt-in Jev lane costs no live routing risk.
8. S09 completion-claim detection: a 10 s Stop deadline leaves room, and the regex misfires on generic words.
9. S06 compiled routing clarify: the alternatives are already a bounded set, and Jev could only suggest a default.
10. S23 spec-folder alignment: below the 50 threshold the save already lists alternatives, a natural `choice`.

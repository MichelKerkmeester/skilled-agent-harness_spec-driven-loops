# Resource map — swe lineage

Written at synthesis. This file did not exist at init and was not an input to any iteration.

## Opened

- Phase brief `004-deep-research-expansion/spec.md` and `context/research-angles.md` (all swe angles + sibling angle headers).
- BASE `001-deep-research/research/research.md` — full read pre-compaction; §9 D5, §11 tables, §13 build phases, R-i–R-m rows, K-rows re-grepped this session.
- Round-1 council `ai-council/proposed-resynthesis.md` and `council-report.md` (baseline, pre-compaction).
- `002-advisor-jev-tiebreak-arm/{spec.md,plan.md,tasks.md}` — REQs, invocation, doc divergences.
- `003-goal-verifier-jev-shadow/{spec.md,plan.md}` — full read this session.
- `.skilled/skills/cli-jev/cli-usage/SKILL.md` — `choice` contract, `-s` stdin flag (:155), exit semantics.
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/`: `score-outcome-rerank.mjs` (metrics/split/flip/import-side-effect), `capture-scorer-eval-baseline.mjs` (deterministic env :35-46, alias match :49,70-76), `derive-ambiguity-slice.mjs`; `lib/scorer/{ambiguity.ts,fusion.ts}`; `benchmark-stability.cjs:102-108`.
- Corpora `labeled-prompts.jsonl` / `holdout-prompts.jsonl` / `ambiguity-prompts.jsonl` — row and field counts only (195/70/24; 177/64/19 skill-firing).
- `.skilled/skills/system-spec-kit/runtime/hooks/claude/{compact-inject.ts,shared.ts}` — extractors :117-189, merge pipeline :284-370, stdin/tailFile :428-545, budgets `shared.ts:11-17`.
- Vendored npm `jevctl` `src/vendor/compaction/{state.ts,compact.ts}` — estimator, staging, batching, decide/apply, options.
- `.opencode/plugins/opencode-goal.js` — constants :36-53, verifier sets :134-136/:179, mode plumbing :226-256, `clampText` :382-389, `sanitizeInlineText` :414-420, `redactEvidence` :463-475, evidence capture :1095-1118, `writeGoalAtomic` :1404, `markGoalStatus` :1921-1960, heuristic :2197-2230, result plumbing :2308-2449, `__test` :3359-3385.
- `.skilled/hooks/goal/lib/goal-core.cjs` — state-dir resolution :39-43/:170-235, `clampText` :290-297, `verifyGoalHeuristic` :596-620, exports :1590-1611.
- `.skilled/skills/system-spec-kit/shared/parsing/secret-scrubber.ts:100-131` (credential-assignment :124-130) and its test file existence.
- `.skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs` — whole file (parser chain :135-212, CHECKS :44-49, walker :417-441, exports+guard :681-699) and `SKILL.md:105-134` rules 4-5.
- `.skilled/commands/create/assets/create-goal-auto.yaml:205-229` (step_measure/step_check).
- Claude transcripts under `~/.claude/projects/-Users-michelkerkmeester-MEGA-Development-Code-Environment-Public/` — record types, field names, boundary adjacency, hookEvent census across 47 boundaries; **no content read**.
- Main-checkout `.skilled/skills/.state/goal/` — 5 records, status/verdict/evidence-length fields only.
- Sibling iterations: `deepseek/iteration-005.md`, `grok/iteration-005.md`, `mimo/iteration-002.md` (W2/W3); mimo-03 confirmed absent.

## Not opened

- Any `.env` file, credential store, or transcript message bodies.
- Live `jev`/`jevctl` of either package — zero spawns.
- `goal-context.ts` beyond the BASE-cited :233-238 nudge line; `mergeCompactBrief` internals (signature and purity confirmed via call site only).
- mimo iteration-001 and grok/deepseek iterations 1-4 (the wave rule asked for the newest only).
- `.opencode/plugins/tests/*` contents (names and purposes only).
- The installed `claude`/`pi`/`opencode` binaries.

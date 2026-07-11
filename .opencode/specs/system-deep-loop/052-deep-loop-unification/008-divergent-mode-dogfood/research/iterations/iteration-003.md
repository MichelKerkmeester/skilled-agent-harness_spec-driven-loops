# Iteration 3: Review and Council Prompt-Pack Contract Drift

## Focus

Compared the deep-review and deep-ai-council prompt packs with their OpenCode and Claude agent definitions, workflow validators, orchestration code, state models, and focused tests. The question was whether sibling schema, delta, or reducer-ownership drift exists, while distinguishing defects from intentional mode-specific architecture.

## Actions Taken

1. Read the active research state and reducer-owned strategy before investigation.
2. Compared the deep-review prompt pack against both runtime agent definitions and the auto-workflow post-dispatch validator.
3. Traced the deep-ai-council round prompt from template rendering through `opencode run`, seat persistence, verdict extraction, and session/round state ownership.
4. Checked focused review/council tests for assertions covering prompt schema, agent provenance, write containment, and malformed seat output.

## Findings

### P1: Review prompt's documented canonical record cannot pass its own workflow validator

The prompt's required JSON example omits `findingDetails`, while the auto workflow requires that field in `assert_jsonl_fields`. A leaf following the prompt exactly can therefore produce a record that is rejected and redispatched. The agent definition requires `findingDetails`, so the three governing surfaces do not share one schema. [SOURCE: .opencode/skills/system-deep-loop/deep-review/assets/prompt_pack_iteration.md.tmpl:89-93] [SOURCE: .opencode/commands/deep/assets/deep_review_auto.yaml:1284-1301] [SOURCE: .opencode/agents/deep-review.md:232-249]

### P1: Review agent omits the mandatory delta artifact and assigns reducer-owned strategy mutation to the leaf

The prompt and validator require three artifacts, including `deltas/iter-NNN.jsonl`. The agent workflow instead specifies iteration markdown, strategy mutation, and one state-log append, and its verification checklist never checks a delta file. Native execution is therefore instructed by two incompatible output contracts; following the agent contract can trigger `delta_file_missing`. The same agent also directs edits to strategy sections that the iteration prompt describes as workflow-reducer-owned. [SOURCE: .opencode/skills/system-deep-loop/deep-review/assets/prompt_pack_iteration.md.tmpl:83-127] [SOURCE: .opencode/agents/deep-review.md:124-139] [SOURCE: .opencode/agents/deep-review.md:222-251] [SOURCE: .opencode/commands/deep/assets/deep_review_auto.yaml:1284-1319]

### P1: Review prompt grants the leaf write access to the reducer-owned findings registry

The prompt lists the findings registry among allowed in-place writes, but both runtime agent mirrors classify it as read-only and the workflow/reducer owns registry reconstruction. A CLI executor follows the rendered prompt rather than necessarily loading the agent, so this expanded authority can create races or state that the next reducer refresh discards. [SOURCE: .opencode/skills/system-deep-loop/deep-review/assets/prompt_pack_iteration.md.tmpl:70-77] [SOURCE: .opencode/agents/deep-review.md:38-39] [SOURCE: .opencode/agents/deep-review.md:145-152] [SOURCE: .claude/agents/deep-review.md:21-22]

### P1: Council route proof claims `@ai-council`, but the live runner launches a generic OpenCode session

The orchestrator appends route fields naming `target_agent=@ai-council`, yet the subprocess arguments are only `opencode run --model ... --dangerously-skip-permissions <seat-prompt>`; no `--agent ai-council` selection or instruction to load the agent definition is present. The round prompt supplies a lightweight seat role, not the agent's adaptive-depth, persistence, output-verification, and scoped-write contract. Current tests assert the claimed route text and generic argv independently, which confirms transport behavior but not truthful agent provenance. [SOURCE: .opencode/skills/system-deep-loop/deep-ai-council/scripts/orchestrate-session.cjs:133-161] [SOURCE: .opencode/skills/system-deep-loop/deep-ai-council/scripts/orchestrate-session.cjs:196-208] [SOURCE: .opencode/skills/system-deep-loop/deep-ai-council/scripts/orchestrate-session.cjs:256-296] [SOURCE: .opencode/skills/system-deep-loop/deep-ai-council/scripts/tests/orchestrate-session-cli.vitest.ts:154-212] [SOURCE: .opencode/agents/ai-council.md:25-38]

### P1: Council seat dispatch bypasses the agent's write boundary under unrestricted permissions

The `ai-council` agent restricts writes to packet-local `ai-council/**` and denies Bash/Patch, but that contract is not loaded by the generic seat process. The prompt only interpolates a planning-boundary sentence and output headings; it has no allowed-write list, banned-operation block, or explicit researched-target read-only rule. Combined with `--dangerously-skip-permissions`, a seat can mutate the repository even though the intended seat operation only returns markdown for host-owned persistence. [SOURCE: .opencode/agents/ai-council.md:25-31] [SOURCE: .opencode/agents/ai-council.md:118-136] [SOURCE: .opencode/skills/system-deep-loop/deep-ai-council/assets/prompt_pack_round.md:18-54] [SOURCE: .opencode/skills/system-deep-loop/deep-ai-council/scripts/orchestrate-session.cjs:196-208]

### P2: Council seat prompt points at the full-report schema, while runtime validates only the verdict footer

The seat prompt labels `output_schema.md` as its required output contract, but that document requires full-council sections such as Council Composition, Recommended Plan, and Plan Confidence. The seat prompt instead requests five seat-local sections. At runtime, only the verdict footer is parsed; missing seat sections become accepted output and are persisted. The focused CLI test demonstrates this by returning only `Seat Recommendation` plus a verdict and expecting success. [SOURCE: .opencode/skills/system-deep-loop/deep-ai-council/assets/prompt_pack_round.md:22-54] [SOURCE: .opencode/skills/system-deep-loop/deep-ai-council/references/structure/output_schema.md:19-52] [SOURCE: .opencode/skills/system-deep-loop/deep-ai-council/scripts/orchestrate-session.cjs:244-253] [SOURCE: .opencode/skills/system-deep-loop/deep-ai-council/scripts/tests/orchestrate-session-cli.vitest.ts:154-203]

## Questions Answered

- **Do deep-review and deep-ai-council have equivalent schema drift against their agents?** Yes, but differently. Review has direct prompt/agent/validator schema conflicts; council has seat-vs-full-report schema ambiguity and false agent-route provenance.
- **Do they have equivalent delta drift?** No. Review requires a per-iteration delta and its agent omits it. Council intentionally uses host-owned `topic_completed` and `round_completed` JSONL events, so absence of a sibling-style delta file is not itself a defect. [SOURCE: .opencode/skills/system-deep-loop/deep-ai-council/references/convergence/deep_mode.md:38-103]
- **Do they have equivalent reducer-ownership drift?** Review does: the prompt grants registry writes and the agent directs strategy edits. Council's session/round state and seat persistence are host-owned in the live runner, which is the correct ownership direction, but unrestricted generic seat execution weakens enforcement.

## Questions Remaining

- Are the review prompt/validator schema mismatches covered by command-contract tests outside the skill-local test directory, or only by dogfood failures?
- Does any supported OpenCode CLI flag select `ai-council` while preserving the current isolated seat process, or should route proof identify a generic council-seat executor instead?
- Which cost and operator-friction defects dominate after validator-triggered redispatch and unrestricted council seat startup are corrected?
- How do deep-improvement's candidate prompts and reducer boundaries compare with these two failure patterns?

## Ruled Out

- Requiring deep-ai-council to emit review/research-style iteration delta files was ruled out. Council's session/topic/round event hierarchy is intentionally different and already gives the host deterministic state ownership; parity should be semantic, not filename/schema cloning. [SOURCE: .opencode/skills/system-deep-loop/deep-ai-council/references/convergence/deep_mode.md:38-103]

## Sources Consulted

- `.opencode/skills/system-deep-loop/deep-review/assets/prompt_pack_iteration.md.tmpl`
- `.opencode/agents/deep-review.md` and `.claude/agents/deep-review.md`
- `.opencode/commands/deep/assets/deep_review_auto.yaml`
- `.opencode/skills/system-deep-loop/deep-ai-council/assets/prompt_pack_round.md`
- `.opencode/agents/ai-council.md` and `.claude/agents/ai-council.md`
- `.opencode/skills/system-deep-loop/deep-ai-council/scripts/orchestrate-session.cjs`
- `.opencode/skills/system-deep-loop/deep-ai-council/scripts/orchestrate-topic.cjs`
- `.opencode/skills/system-deep-loop/deep-ai-council/references/structure/output_schema.md`
- `.opencode/skills/system-deep-loop/deep-ai-council/references/convergence/deep_mode.md`
- `.opencode/skills/system-deep-loop/deep-ai-council/scripts/tests/orchestrate-session-cli.vitest.ts`

## Assessment

- `newInfoRatio`: 0.90
- Novelty justification: This iteration adds five P1 contract or containment defects and one P2 schema ambiguity on sibling surfaces not examined in the first two iterations, while ruling out false delta-parity as a direction.
- Confidence: High for the directly compared checked-in contracts and live argv; medium-high on operational severity because no real seat was allowed to mutate the target during this read-only iteration.

## Next Focus

Inspect deep-improvement candidate/evaluator prompt ownership, promotion boundaries, and tests for the same pattern: claimed specialist provenance without loaded agent contracts, leaf writes to reducer-owned state, or validator schemas that differ from prompt examples.

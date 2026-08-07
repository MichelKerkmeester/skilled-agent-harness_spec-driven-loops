# Iteration 10: Q10 ADR-001 lightweight-bound revisit conditions

## Focus

Answer Q10: define the concrete conditions under which ADR-001's lightweight bound should be revisited, and name the signals that would justify promoting `@multi-ai-council` into a dedicated skill folder.

## Actions Taken

- Confirmed the iteration number from `deep-research-state.jsonl`: nine completed iteration records make this iteration 10.
- Read the strategy, findings registry, and iteration 9 narrative to preserve Q1-Q9 decisions before answering the final open question.
- Inspected ADR-001, ADR-003, and ADR-004 in `decision-record.md` to identify the current lightweight-bound rationale and already-declared escape hatches.
- Compared the current agent body and `ai-council/` protocol sections against sibling deep-research/deep-review skill machinery.
- Checked current reference footprint and git history to separate ordinary follow-on growth from promotion-worthy complexity.

## Findings

### 1. ADR-001 already defines a soft spill threshold, but not a promotion threshold

ADR-001 explicitly rejects a dedicated `.opencode/skills/multi-ai-council/` folder because that would import YAML workflow, command surface, iteration mechanics, and convergence machinery comparable to deep-research/deep-review (`.opencode/specs/skilled-agent-orchestration/080-multi-ai-council-output-protocol/decision-record.md:51`). The accepted decision keeps logic in `.opencode/agents/multi-ai-council.md` plus four short reference files (`decision-record.md:57`), and its consequence rule says that if the agent body crosses about 750 LOC, details should spill to references rather than create a skill (`decision-record.md:71`).

That means LOC pressure alone is not enough to revisit ADR-001. It is first a reference-spill signal. Promotion only becomes justified when the added behavior cannot be honestly expressed as agent instructions plus shared references.

### 2. Current growth still fits the lightweight model

The current agent body is 689 LOC, with the `ai-council/` protocol concentrated in sections 12 through 15 (`.opencode/agents/multi-ai-council.md:579` through `.opencode/agents/multi-ai-council.md:650`) and a planning-only summary boundary at `.opencode/agents/multi-ai-council.md:684` through `.opencode/agents/multi-ai-council.md:687`. The existing reference surface is small: four files totaling 168 lines under `.opencode/skills/system-spec-kit/references/multi-ai-council/`.

Packet 081's likely additions from Q1-Q9 fit this model: a helper script, fixture tests, one `output-schema.md`, a short §17 caller protocol, and mirror parity checks. Those are shared support and documentation surfaces, not a dedicated council runtime.

### 3. The real promotion signal is lifecycle ownership, not artifact count

Deep-research and deep-review are full skills because their command workflows own lifecycle, state, dispatch, convergence, and reducer-maintained artifacts. Deep-review states that YAML owns `deep-review-state.jsonl`, strategy, registry, dashboard, convergence, and stuck recovery at `.opencode/skills/deep-review/SKILL.md:87` through `.opencode/skills/deep-review/SKILL.md:91`. Deep-research's reducer is a 1022-line state writer with fail-closed CLI behavior and exported parsers/reducer functions at `.opencode/skills/deep-research/scripts/reduce-state.cjs:962` through `.opencode/skills/deep-research/scripts/reduce-state.cjs:1022`.

By contrast, ADR-003 keeps `ai-council-state.jsonl` convention-only for v1 (`decision-record.md:137` through `decision-record.md:140`) and says to formalize a validator only if drift becomes a problem (`decision-record.md:155` through `decision-record.md:157`). ADR-004 similarly keeps `ai-council/` free-form inside strict validation (`decision-record.md:171` through `decision-record.md:184`). Promotion should be tied to crossing those boundaries.

### 4. Concrete revisit triggers

Revisit ADR-001 if two or more of these become true in a real packet, or if one becomes blocking enough that callers cannot use the council safely:

- The council needs a command-owned lifecycle with `new`, `resume`, `restart`, generated prompts, logs, dashboards, and stuck-recovery semantics.
- `ai-council-state.jsonl` stops being convention-only and requires reducer-owned writes, schema migration, corruption detection, or fail-closed parsing.
- `/speckit:*` commands become primary dispatchers rather than optional convenience wiring.
- Skill Advisor or hook routing must discover and recommend council automatically instead of relying on explicit user/orchestrator dispatch.
- Validation must enforce internal `ai-council/` layout, not merely tolerate or advise on it.
- Four-runtime mirror parity becomes impossible to maintain through a shared checker and requires generated agent bodies from templates.
- The helper grows from persistence support into an executor that performs rounds, controls seats, or computes convergence.

These are behavioral thresholds. They are stronger evidence than file count or line count because they indicate the council has become a runtime surface.

### 5. Non-triggers that should not reopen ADR-001

Do not revisit ADR-001 for a standalone persistence helper, fixture tests, `output-schema.md`, short §17 caller protocol, manual invocation recipes, optional memory-save payloads, or reference-file expansion. ADR-001 already expects detail to spill to references before a skill is considered (`decision-record.md:71`), and Q8/Q9 kept memory save optional and downstream of persistence.

The stale path named in the iteration prompt, `.opencode/skills/deep-review/scripts/reduce-review-state.cjs`, is not present in this checkout; the actual sibling reducer is `.opencode/skills/deep-review/scripts/reduce-state.cjs`. That mismatch does not change the conclusion, but it reinforces that promotion should be based on live repo evidence rather than assumed sibling shapes.

### 6. Git history supports a young, lightweight convention

Relevant history is concentrated in a small set of council commits: `df9d04f5c9` introduced the packet-080 `ai-council/` convention, `422000f7ae` added agent body sections 12-15 plus four references and a vitest, and `9ebe1e46f6` renamed/improved the council across runtimes. This looks like an emerging convention, not yet a repeated operational subsystem.

## Questions Answered

- Q10 answered: ADR-001 should be revisited only when `@multi-ai-council` needs skill-like runtime ownership: command lifecycle, reducer-owned state, automatic routing/advisor behavior, enforced validation, generated mirrors, or helper-controlled execution/convergence. The current packet 081/082 follow-ons remain within the lightweight bound if they stay helper/reference/test oriented and keep the LEAF planning-only invariant.

## Questions Remaining

- No key questions remain. All 10 questions in the strategy are answered.

## Next Focus

Synthesis-ready. The next pass should consolidate Q1-Q10 into a packet 081 / 082 recommendation set and stop discovery unless new requirements appear.

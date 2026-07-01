---
title: "Decision Record: ai-council mode: all -> mode: subagent Override"
status: "Approved — operator override of research consensus"
deciders: "operator (explicit, stated twice: 2026-07-01)"
date: "2026-07-01"
---
# Decision Record: ai-council mode: all -> mode: subagent Override

## Context

Research (`../007-gpt-behavioral-hardening-research/research/research.md` §1, §3) examined whether `ai-council` should convert from `mode: all` (dual-reachable: directly invocable AND Task-dispatchable) to `mode: subagent` (Task-dispatchable only, matching `deep-context`/`deep-research`/`deep-review`). The verdict was unanimous across all 6 independent lineages, spanning both research rounds and 4 different models (GLM-5.2, GPT-5.5-fast, Claude Sonnet 5, Claude Opus 4.8):

> "Keep `ai-council` as `mode: all`. Unanimous across all 6 lineages. Converting it to subagent-only would remove a working, documented depth-0 parallel-seat path the reported symptoms don't implicate."

This is the strongest, least-hedged consensus in the entire research packet — stronger than the FIX-5 unpark verdict, which at least carried a conditional re-open trigger.

## Decision

**Convert anyway.** `.opencode/agents/ai-council.md:4` changes from `mode: all` to `mode: subagent`, sequenced after `../009-orchestrate-universal-routing/` lands (so the Task-dispatch path is already proven reliable before the direct-invoke path is removed).

This is a direct, explicit operator instruction, not a research-derived recommendation. The operator's rationale, given twice in the same session:

1. **Cross-runtime architectural consistency.** Claude Code has no "primary agent" concept at all — every agent, including any future ai-council-equivalent, is dispatched as a subagent via the Task tool with no top-level direct-invoke surface. OpenCode's `mode: all` on `ai-council` is this repo's one asymmetry between the two runtimes it mirrors (`markdown.md` is the only other `mode: all` agent, and is out of scope for this decision).
2. **Single universal entry point.** The operator wants `@orchestrate` to be the sole, reliably-correct dispatcher for every sub-agent — deep or otherwise — rather than leaving one agent (ai-council) independently reachable outside that routing surface, even though research found no evidence this independence is presently causing harm.

## Alternatives Considered

- **Follow the research recommendation (keep `mode: all`):** rejected by the operator despite being the research's unanimous, highest-confidence finding in the packet. The operator's stated priority (cross-runtime consistency, single entry point) outweighs the research's stated priority (don't remove a working path that isn't implicated in the reported symptoms) — this is a values/priorities trade-off, not a factual disagreement with the research.
- **Convert `markdown.md` too, for full consistency:** not requested by the operator; explicitly out of scope for this phase. If cross-runtime consistency is the driving rationale, `markdown.md`'s own `mode: all` is a natural follow-up question, not yet raised.
- **Partial conversion (e.g., keep `mode: all` but document a policy of always routing through orchestrate):** not chosen — the operator's instruction was for the structural conversion itself, not a documentation-only convention.

## Consequences

- Any caller that currently reaches `ai-council` by direct top-level invocation (bypassing orchestrate or `/deep:ai-council`) loses that path and must be redirected through Task dispatch. Phase 010's `spec.md` scope requires a grep sweep for such callers before landing, and a smoke test of both known legitimate paths (orchestrate planning dispatch, `/deep:ai-council`) post-conversion.
- If a real regression surfaces post-conversion that traces back to the removed `mode: all` path, that is exactly the failure mode research warned about; the correct response is to revisit this decision with the operator (Logic-Sync Protocol), not to silently patch around it.
- Research's contrary recommendation remains true and citable — this decision record does not dispute the research's reasoning, only overrides its conclusion by operator priority.

## Residual Risk

Research is unanimous and un-hedged on this exact point; that is a stronger signal against this change than typical residual-risk language captures. The mitigating factor is sequencing (phase 009 first) plus explicit smoke-testing of both known reachability paths before this phase is considered complete — but an unknown, undiscovered caller depending on direct reachability remains a real, accepted risk the operator has chosen to take on.

# Iteration 1: Charter, Baseline, and Round-1 Dedup

## Focus
Initialize the lineage, confirm the research pillars, and establish what round 1 already shipped so round 2 recommendations do not duplicate it.

## Actions Taken
- Read the round-2 spec for scope, success criteria, and named sources.
- Read round-1 spec and before/after report to establish deployed doctrine.
- Read `Fable5.md` to anchor the distilled doctrine baseline.
- Read the `cli-codex` self-invocation contract because the fan-out request named cli-codex from inside Codex.

## Findings
1. **Round 2 is explicitly research-only and must deliver extract/surface-map/optimize outputs.** The spec names three pillars and forbids implementation this round. [SOURCE: .opencode/specs/skilled-agent-orchestration/149-operate-like-fable-5/002-fable-mode-efficiency-research/spec.md:77]

2. **The baseline doctrine is evidence-and-operations, not a persona package.** `Fable5.md` centers confirmed/inferred legibility, real verification before done, baselines before "no regressions", finding verification, scope, rollback, and old-contract safety. [SOURCE: .opencode/specs/skilled-agent-orchestration/149-operate-like-fable-5/external/Fable5.md:7] [SOURCE: .opencode/specs/skilled-agent-orchestration/149-operate-like-fable-5/external/Fable5.md:21]

3. **Round 1 already distributed the core doctrine.** It landed the operating-discipline subsection in root AGENTS/CLAUDE, two constitutional rules, the non-git outward-action fold, and a sk-code baseline/blast-radius line. [SOURCE: .opencode/specs/skilled-agent-orchestration/149-operate-like-fable-5/001-initial-refinement/before-vs-after.md:17] [SOURCE: .opencode/specs/skilled-agent-orchestration/149-operate-like-fable-5/001-initial-refinement/before-vs-after.md:57]

4. **The current root AGENTS surface confirms round-1 doctrine is live.** It includes claim legibility, baseline/delta, finding-as-hypothesis, blast-radius, rollback, old-contract, recommendation-at-fork, honest status, and data-not-instructions bullets. [SOURCE: AGENTS.md:59]

5. **Executor provenance is a constraint, not a detail.** The `cli-codex` skill says a running Codex agent must refuse nested Codex CLI self-invocation. This lineage must record the requested executor but cannot honestly claim nested `codex exec` process isolation. [SOURCE: .opencode/skills/cli-codex/SKILL.md:17]

## Questions Answered
- What did round 1 already ship?
- What is the distilled source baseline?

## Questions Remaining
- Which fable-mode-main techniques are net-new?
- Which opus-fable-mode mechanisms are portable?
- Which Public surfaces have the right read reliability?
- Which ranked recommendations should survive dedup?
- What runtime caveats must merge preserve?

## Assessment
- newInfoRatio: 0.92.
- Novelty justification: first pass established the comparison frame and ruled out duplicate recommendations.
- Confidence: high for dedup baseline because the round-1 before/after report and current AGENTS/sk-code files agree.

## Reflection
What worked: starting with round-1 dedup prevented a prose-bloat recommendation.

What failed or was ruled out: re-recommending the already-shipped AGENTS/constitutional/sk-code set would violate the round-2 spec.

## Recommended Next Focus
Extract net-new rituals and failure-mode controls from `external/fable-mode-main/`.

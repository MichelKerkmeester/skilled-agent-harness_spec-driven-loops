# Deep Research Strategy - Codex Lineage

## 1. Overview

This lineage researches how to make the skilled-agent orchestration stack operate like the `external/Fable5.md` doctrine. The artifact root was bound directly from `config.fanout_lineage_artifact_dir`; the `resolveArtifactRoot` node command was not run.

## 2. Topic

Operate like Fable 5: translate the external operating instructions into enforceable skilled-agent orchestration behavior.

## 3. Key Questions

- [x] What does Fable 5 require in operational terms?
- [x] Which current surfaces already implement parts of it?
- [x] Where are the gaps?
- [x] What implementation path has the best leverage?
- [x] What verification gates prove the behavior?

## 4. Non-Goals

- Do not implement code changes in this lineage.
- Do not edit files outside `.opencode/specs/skilled-agent-orchestration/149-operate-like-fable-5/research/lineages/codex`.
- Do not invoke `resolveArtifactRoot`.
- Do not spawn `codex exec` from the active Codex runtime; record the requested executor as lineage metadata instead.

## 5. Stop Conditions

- Stop when all five key questions have evidence-backed answers and the latest new information ratio is low.
- Stop at `config.maxIterations` if convergence is not reached earlier.
- Stop immediately on any path-boundary conflict.

## 6. Answered Questions

- What does Fable 5 require in operational terms? Answered in iteration 1.
- Which current surfaces already implement parts of it? Answered in iteration 2.
- Where are the gaps? Answered in iteration 3.
- What implementation path has the best leverage? Answered in iteration 4.
- What verification gates prove the behavior? Answered in iteration 5.

<!-- MACHINE-OWNED: START -->
## 7. What Worked

- Source-first requirement extraction worked because the external document is concise and specific. (iteration 1)
- Surface mapping across `.opencode/agents` and `.codex/agents` worked because mirrored agents expose the same enforcement concepts with runtime-specific paths. (iteration 2)
- Inspecting fan-out workflow code worked because it revealed path-boundary enforcement is prompt-level for CLI children. (iteration 3)
- A shared evidence contract emerged as the lowest-blast design because @code, @deep-research, and orchestrate already have different local enforcement points. (iteration 4)
- Convergence by answered questions worked because each key question had direct file evidence by iteration 5. (iteration 5)

## 8. What Failed

- Treating Fable 5 as tone guidance failed; the source includes concrete workflow obligations for verification, baselines, rollback, and scope. (iteration 1)
- A deep-research-only implementation path failed; @code and orchestrate own important completion and child-output gates. (iteration 2)
- Relying on prompt-only path boundaries failed as a strong safety story; fan-out runtime comments identify that as a weaker fallback. (iteration 3)
- Whole-agent rewrites failed as an architecture path; they increase drift across runtime mirrors. (iteration 4)
- Max-iteration continuation failed as useful work; the loop had converged by question coverage and novelty. (iteration 5)

## 9. Exhausted Approaches

### Tone-only adoption - BLOCKED (iteration 1, 1 attempt)
- What was tried: Interpret the external document as response-style guidance.
- Why blocked: Its strongest claims are operational and verification-related.
- Do not retry: Do not scope the future implementation to voice or prose only.

### Prompt-only compliance - BLOCKED (iteration 5, 2 attempts)
- What was tried: Rely on agent prompts, fan-out prompt text, and user-facing instructions.
- Why blocked: The source requires real checks, baselines, and evidence; prompt-only adoption cannot prove those at runtime.
- Do not retry: Do not claim Fable 5 compliance unless validation catches missing confirmed/inferred labels, baseline evidence, completion proof, and scope/rollback state.

### Shared evidence contract - PRODUCTIVE (iteration 4)
- What worked: A small common schema can be consumed by orchestrate, @code, @deep-research, and fan-out validation without rewriting each agent.
- Prefer for: Future implementation planning and tests.

## 10. Ruled-Out Directions

- Tone-only guidance: ruled out because Fable 5 includes verification and safety gates. Evidence: `.opencode/specs/skilled-agent-orchestration/149-operate-like-fable-5/external/Fable5.md:7`.
- Deep-research-only implementation: ruled out because @code and orchestrate own completion gates. Evidence: `.opencode/agents/code.md:398`, `.opencode/agents/orchestrate.md:547`.
- Prompt-only fan-out boundary: ruled out because fan-out runtime comments state the CLI lineage boundary is prompt-enforced rather than sandbox-enforced. Evidence: `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:409`.
- Whole-agent rewrite: ruled out because runtime mirrors and specialized contracts would drift. Evidence: `.opencode/agents/orchestrate.md:38`.

## 11. Next Focus

Proceed to implementation planning. Recommended scope: define a shared evidence/claim contract, wire it into orchestrator task packages and child returns, add validation for missing proof fields, and update tests/playbooks.
<!-- MACHINE-OWNED: END -->

## 12. Known Context

- `resource-map.md` was not present in the target spec folder during phase_init; coverage gate was skipped.
- The target spec folder contains `external/Fable5.md` and fan-out run logs only.
- The fan-out prompt was generated by `fanout-run.cjs` and explicitly directed this lineage to bind the artifact root from `config.fanout_lineage_artifact_dir`.
- The requested executor was `cli-codex model=gpt-5.5`; the active runtime is Codex, so the cli-codex self-invocation guard was applied and this lineage ran directly in the current Codex seat.

## 13. Research Boundaries

- Max iterations: 10.
- Convergence threshold: 0.05.
- Per-iteration budget: 12 tool calls, 10 minutes.
- Progressive synthesis: true.
- Workflow phases run: phase_init, phase_main_loop, phase_synthesis.
- Phase save: not requested.
- Current generation: 1.
- Started: 2026-06-14T06:54:18Z.

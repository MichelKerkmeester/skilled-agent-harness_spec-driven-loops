# Research Synthesis: Operate Like Fable 5

## 1. Executive Summary

The Fable 5 document is best understood as an evidence and operations doctrine for agents, not as a voice-only style guide. Confirmed requirements include explicit confirmed/inferred claim labeling, real-path verification before completion claims, baseline capture before "no regressions," gate reruns with deltas, scoped changes, rollback naming before irreversible actions, and verification of child-agent claims before acting on them. [SOURCE: .opencode/specs/skilled-agent-orchestration/149-operate-like-fable-5/external/Fable5.md:7] [SOURCE: .opencode/specs/skilled-agent-orchestration/149-operate-like-fable-5/external/Fable5.md:9] [SOURCE: .opencode/specs/skilled-agent-orchestration/149-operate-like-fable-5/external/Fable5.md:11] [SOURCE: .opencode/specs/skilled-agent-orchestration/149-operate-like-fable-5/external/Fable5.md:15]

The current stack already contains strong pieces of this behavior. @code has fail-closed verification and Builder/Critic/Verifier discipline, @deep-research requires evidence-bound outputs, orchestrate owns child-output evaluation, and deep-loop validation checks iteration artifacts and executor provenance. [SOURCE: .opencode/agents/code.md:398] [SOURCE: .opencode/agents/deep-research.md:40] [SOURCE: .opencode/agents/orchestrate.md:512] [SOURCE: .opencode/commands/deep/assets/deep_start-research-loop_auto.yaml:753]

The strongest next step is not a full agent rewrite. It is a shared evidence contract wired into the existing enforcement points: orchestrator task packages and output review, @code RETURN, @deep-research iteration records, and deep-loop post-dispatch validation. This is an inference from the inspected architecture and should be confirmed during implementation planning. [INFERENCE: based on .opencode/agents/orchestrate.md:196, .opencode/agents/code.md:450, .opencode/skills/deep-loop-runtime/lib/deep-loop/post-dispatch-validate.ts:615]

## 2. Research Question

How should the skilled-agent orchestration stack operate like Fable 5, and where should future implementation work land?

## 3. Source Doctrine

Confirmed Fable 5 obligations:

- Label load-bearing claims as confirmed or inferred, and attach the evidence or missing verification step. [SOURCE: .opencode/specs/skilled-agent-orchestration/149-operate-like-fable-5/external/Fable5.md:7]
- Run or observe the real path before saying something works. [SOURCE: .opencode/specs/skilled-agent-orchestration/149-operate-like-fable-5/external/Fable5.md:9]
- Capture a baseline before claiming no regressions. [SOURCE: .opencode/specs/skilled-agent-orchestration/149-operate-like-fable-5/external/Fable5.md:11]
- Re-run the whole gate after each step and report the delta. [SOURCE: .opencode/specs/skilled-agent-orchestration/149-operate-like-fable-5/external/Fable5.md:13]
- Treat findings and child-agent outputs as hypotheses until the cited evidence is checked. [SOURCE: .opencode/specs/skilled-agent-orchestration/149-operate-like-fable-5/external/Fable5.md:15]
- Stay in scope and preserve rollback discipline before irreversible actions. [SOURCE: .opencode/specs/skilled-agent-orchestration/149-operate-like-fable-5/external/Fable5.md:19] [SOURCE: .opencode/specs/skilled-agent-orchestration/149-operate-like-fable-5/external/Fable5.md:21]
- Lead with recommendations and alternatives at forks, grounded in project data. [SOURCE: .opencode/specs/skilled-agent-orchestration/149-operate-like-fable-5/external/Fable5.md:33] [SOURCE: .opencode/specs/skilled-agent-orchestration/149-operate-like-fable-5/external/Fable5.md:35]

## 4. Current Coverage

@deep-research already covers citation and output existence discipline. It blocks completion until iteration files, JSONL appends, and citations are verified. [SOURCE: .opencode/agents/deep-research.md:40] [SOURCE: .opencode/agents/deep-research.md:495]

@code already covers the implementation side more strongly than other surfaces. It must invoke sk-code, run the selected verification command, capture exit evidence, and return fail-closed if verification fails. [SOURCE: .opencode/agents/code.md:59] [SOURCE: .opencode/agents/code.md:61] [SOURCE: .opencode/agents/code.md:398]

Orchestrate already owns child-output evaluation and single-response accountability. It checks for cited evidence and preserves strongest active blockers rather than softening failed gates. [SOURCE: .opencode/agents/orchestrate.md:24] [SOURCE: .opencode/agents/orchestrate.md:28] [SOURCE: .opencode/agents/orchestrate.md:512] [SOURCE: .opencode/agents/orchestrate.md:547]

Deep-loop validation already has the right mechanical enforcement position for autonomous runs: post-dispatch validation checks iteration files, JSONL fields, delta files, and executor provenance. [SOURCE: .opencode/commands/deep/assets/deep_start-research-loop_auto.yaml:753] [SOURCE: .opencode/skills/deep-loop-runtime/lib/deep-loop/post-dispatch-validate.ts:615]

## 5. Gaps

1. Confirmed/inferred labels are not yet a shared machine-checkable field across orchestrator dispatches, child returns, and loop records. The doctrine requires readers to distinguish those states from prose alone. [SOURCE: .opencode/specs/skilled-agent-orchestration/149-operate-like-fable-5/external/Fable5.md:7]
2. Baseline deltas are strongly required by the doctrine, but only some agent paths make baseline capture explicit. [SOURCE: .opencode/specs/skilled-agent-orchestration/149-operate-like-fable-5/external/Fable5.md:11]
3. Prompt-only fan-out path confinement is weaker than Fable 5 scope discipline. The runtime comment says lineage path confinement is enforced by prompt because CLIs lack a narrower path-scoped sandbox. [SOURCE: .opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:409]
4. The lineage-local reducer path is not cleanly supported by the current reducer CLI because the workflow calls the reducer with `spec_folder`, and the reducer resolves canonical research paths internally. [SOURCE: .opencode/commands/deep/assets/deep_start-research-loop_auto.yaml:777] [SOURCE: .opencode/skills/deep-research/scripts/reduce-state.cjs:900]

## 6. Recommended Architecture

Implement a shared evidence contract first.

Recommended contract fields:

- `claim_class`: `confirmed | inferred | unknown`.
- `evidence`: file:line, command, runtime observation, or artifact path.
- `would_confirm`: required when `claim_class` is `inferred`.
- `baseline`: command/result snapshot when making regression or safety claims.
- `gate_delta`: before/after gate result for repeated checks.
- `scope_state`: in-scope paths touched, out-of-scope paths observed, and rollback note when relevant.
- `child_result_verified`: boolean plus evidence when consuming subagent output.

Wire it into existing surfaces:

- Orchestrator task format and output review, because orchestrate is the single accountability point. [SOURCE: .opencode/agents/orchestrate.md:196] [SOURCE: .opencode/agents/orchestrate.md:512]
- @code RETURN, because implementation completion is the highest-risk claim path. [SOURCE: .opencode/agents/code.md:292] [SOURCE: .opencode/agents/code.md:398]
- @deep-research iteration JSONL and markdown assessment, because research already emits evidence-rich records. [SOURCE: .opencode/agents/deep-research.md:40]
- `post-dispatch-validate.ts`, because autonomous loops need mechanical rejection of missing required fields. [SOURCE: .opencode/skills/deep-loop-runtime/lib/deep-loop/post-dispatch-validate.ts:615]

## 7. Verification Gates

Acceptance gates for a future implementation should include:

- A fixture where a child result has a confirmed claim without evidence and validation rejects it.
- A fixture where a child result has an inferred claim without `would_confirm` and validation rejects it.
- A fixture where an implementation return claims no regressions without baseline data and validation rejects it.
- A fixture where a gate rerun changes failures and the delta is recorded.
- A fan-out fixture confirming lineage outputs remain under the override directory and reducer refresh does not write the canonical research path.
- Mirror checks for `.opencode/agents/*.md` and `.codex/agents/*.toml` when agent docs are changed.

## 8. Eliminated Alternatives

| Approach | Reason Eliminated | Evidence | Iteration(s) |
|---|---|---|---|
| Tone-only adoption | The source has operational verification and safety rules, not only prose guidance. | `.opencode/specs/skilled-agent-orchestration/149-operate-like-fable-5/external/Fable5.md:7` | 1 |
| Deep-research-only implementation | @code and orchestrate own the highest-risk completion and child-output gates. | `.opencode/agents/code.md:398`; `.opencode/agents/orchestrate.md:547` | 2 |
| Prompt-only path confinement | The fan-out runtime says lineage path confinement is prompt-enforced because narrower sandboxing is unavailable. | `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:409` | 3 |
| Whole-agent rewrite | Existing agents have specialized contracts and runtime mirrors; full duplication increases drift. | `.opencode/agents/orchestrate.md:38` | 4 |
| Continue to 10 iterations | All key questions were answered by iteration 5 and new information dropped to 0.08; the convergence contract nominates STOP when all key questions have evidence-backed answers. | `.opencode/skills/deep-research/references/convergence/convergence.md:91` | 5 |

## 9. Open Questions

- Which exact schema should own the shared evidence contract: an agent I/O envelope extension, a deep-loop validation type, or a system-spec-kit shared module?
- Should path-scoped sandbox enforcement be implemented outside prompts for CLI fan-out lineages?
- Should the reducer accept an explicit `--artifact-dir` for fan-out lineages?

## 10. Implementation Notes

The implementation should be planned as docs-plus-validation work, not as a pure prompt rewrite. The most useful plan would likely touch orchestrator and agent contract docs, the deep-loop validation layer, fan-out reducer plumbing, and tests/manual playbooks. This synthesis does not claim those edits are complete; it only identifies the evidence-backed direction.

## 11. Convergence Report

- Stop reason: converged.
- Total iterations: 5.
- Questions answered: 5 / 5.
- Remaining questions: 0.
- Last 3 iteration summaries: run 3 workflow-runtime (0.55), run 4 architecture (0.38), run 5 verification (0.08).
- Convergence threshold: 0.05.
- Reasoning: all key questions were evidence-backed, and the novelty trend declined sharply.

## 12. References

- `.opencode/specs/skilled-agent-orchestration/149-operate-like-fable-5/external/Fable5.md`
- `.opencode/agents/deep-research.md`
- `.opencode/agents/code.md`
- `.opencode/agents/orchestrate.md`
- `.opencode/commands/deep/assets/deep_start-research-loop_auto.yaml`
- `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs`
- `.opencode/skills/deep-loop-runtime/lib/deep-loop/post-dispatch-validate.ts`
- `.opencode/skills/deep-research/scripts/reduce-state.cjs`

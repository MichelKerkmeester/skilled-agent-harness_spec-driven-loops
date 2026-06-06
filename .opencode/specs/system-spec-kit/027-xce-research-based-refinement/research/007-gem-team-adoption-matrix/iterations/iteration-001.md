# Iteration 001: RQ1 orchestration & wave execution

**Focus:** RQ1 orchestration & wave execution  
**Executor:** cli-opencode `openai/gpt-5.5-fast` --variant high (read-only). **Status:** complete. **newInfoRatio:** 0.18.  
**Raw output:** prompts/iteration-001.out  ·  **Prompt:** prompts/iteration-001.prompt

### FINDINGS
| Sub-feature | gem-team mechanism (file:line) | spec-kit equivalent or GAP (file:line) | Verdict | Effort(S/M/L) | Net-new value |
|---|---|---|---|---|---|
| Pure orchestrator delegation for plan→implement→verify | `gem-orchestrator` must “Never execute or validate work directly” and delegates all execution, plan validation, review, and verification [SOURCE: external/gem-team-main/.apm/agents/gem-orchestrator.agent.md:17,115-120,127-129,269] | `@orchestrate` is already delegation-first: it primarily uses `task`, must not implement or explore directly, and is accountable for evaluate/synthesize/deliver [SOURCE: .opencode/agents/orchestrate.md:20-34,47-58] | REJECT | S | None; same model already exists. |
| Explicit effort/task-type routing matrix with MICRO/FAST_TRACK | Gem routes by `new_task`, `continue_plan`, `MICRO_TRACK`, `FAST_TRACK`, complexity, and task type [SOURCE: external/gem-team-main/.apm/agents/gem-orchestrator.agent.md:80-107] | Spec-kit has agent-priority routing, dependency-based dispatch, and fast paths, but the matrix is split across `@orchestrate`, `@code`, and skills rather than a single visible task-type matrix [SOURCE: .opencode/agents/orchestrate.md:91-101,267-278; .opencode/agents/code.md:68-70] | ADAPT | S | Low; doc-level consolidation could reduce routing ambiguity. |
| ≤2 concurrent task wave ceiling | Gem wave execution delegates pending dependency-free tasks with `max 2 concurrent` [SOURCE: external/gem-team-main/.apm/agents/gem-orchestrator.agent.md:123-129] | Spec-kit already defaults to focused execution, typically 2 agents, with a default parallel ceiling of 2 unless justified [SOURCE: .opencode/agents/orchestrate.md:267-278] | REJECT | S | None; exact ceiling already present. |
| Integration check after each wave | Gem explicitly performs reviewer/security integration after each wave, with debugger→implementer retry and design validation branches [SOURCE: external/gem-team-main/README.md:155-162; external/gem-team-main/.apm/agents/gem-orchestrator.agent.md:127-132] | Spec-kit has post-output review gates, verification actions, scoring/retry, and synthesis between larger waves, but not a crisp “reviewer(wave)” invariant in the core wave text [SOURCE: .opencode/agents/orchestrate.md:454-506,640-652] | ADAPT | S | Moderate; make existing gates wave-scoped in `@orchestrate` docs without changing runtime. |
| Planner-owned DAG with wave/dependency/conflict fields | Gem planner assigns waves, dependencies, conflicts, quality gates, success criteria, and risk fields into `plan.yaml` [SOURCE: external/gem-team-main/.apm/agents/gem-planner.agent.md:78-114,227-279] | Spec-kit already decomposes tasks, identifies parallel vs sequential work, and has bounded deep-loop waves/merges; no clear gap requiring a new plan store [SOURCE: .opencode/agents/orchestrate.md:47-58,267-288; .opencode/skills/system-spec-kit/changelog/v3.4.0.0.md:182-184] | REJECT | M | Low; persistence format differs, capability exists. |
| Fan-out / multi-lineage wave execution | Gem batches dependency-free steps and runs wave tasks concurrently with integration checks [SOURCE: external/gem-team-main/.apm/agents/gem-orchestrator.agent.md:61,127-132] | Spec-kit deep-loop fan-out is stronger for research/review: isolated lineages, concurrency-capped pool, status ledger, salvage, and merge [SOURCE: .opencode/skills/deep-loop-runtime/SKILL.md:165-170; .opencode/skills/system-spec-kit/changelog/v3.5.0.0.md:50-54] | REJECT | S | None; spec-kit is deeper here. |

- [F-001-01] The “pure orchestrator” idea is not net-new: Gem Team says the orchestrator “Never execute or validate work directly” and delegates validation/review/verification [SOURCE: external/gem-team-main/.apm/agents/gem-orchestrator.agent.md:17,115-120,269], while spec-kit’s `@orchestrate` already forbids implementation/exploration directly and owns decomposition, delegation, evaluation, and synthesis [SOURCE: .opencode/agents/orchestrate.md:20-34,47-58]. Verdict: REJECT.

- [F-001-02] Gem’s routing matrix is cleaner as documentation: it puts `MICRO_TRACK`, `FAST_TRACK`, `continue_plan`, and fallback-to-planning in one compact table [SOURCE: external/gem-team-main/.apm/agents/gem-orchestrator.agent.md:80-107], while spec-kit spreads equivalent decisions across agent selection, dependency dispatch, and code-agent fast path [SOURCE: .opencode/agents/orchestrate.md:91-101,267-278; .opencode/agents/code.md:68-70]. Verdict: ADAPT as a small doc refit, not new runtime.

- [F-001-03] Gem’s `≤2 concurrent` wave cap is already matched: Gem caps wave delegation at max 2 concurrent tasks [SOURCE: external/gem-team-main/.apm/agents/gem-orchestrator.agent.md:127-129], and spec-kit’s `@orchestrate` explicitly sets a default parallel ceiling of 2 agents [SOURCE: .opencode/agents/orchestrate.md:269-278]. Verdict: REJECT.

- [F-001-04] The one concrete adaptation is “wave integration check” phrasing: Gem makes reviewer/security integration a required wave step before enrichment/next wave [SOURCE: external/gem-team-main/README.md:155-162; external/gem-team-main/.apm/agents/gem-orchestrator.agent.md:127-132], while spec-kit has output review, evidence audit, retries, and synthesis but expresses them as general acceptance gates rather than a named per-wave invariant [SOURCE: .opencode/agents/orchestrate.md:454-506,640-652]. Verdict: ADAPT.

### NEGATIVE / RULED-OUT
- Do not adopt Gem’s pure delegation rule as new behavior: spec-kit already has the same boundary, including no direct implementation/exploration by `@orchestrate` [SOURCE: external/gem-team-main/AGENTS.md:11,62; .opencode/agents/orchestrate.md:34].

- Do not adopt the `≤2 concurrent` rule: spec-kit already defaults to a 2-agent parallel ceiling and biases toward fewer agents when uncertain [SOURCE: external/gem-team-main/.apm/agents/gem-orchestrator.agent.md:127-129; .opencode/agents/orchestrate.md:269-278].

- Do not adopt Gem’s DAG/wave planner wholesale: spec-kit already performs decomposition, dependency-aware dispatch, bounded waves for large targets, and fan-out merge/salvage for deep loops [SOURCE: external/gem-team-main/.apm/agents/gem-planner.agent.md:78-114,227-279; .opencode/agents/orchestrate.md:47-58; .opencode/skills/deep-loop-runtime/SKILL.md:165-170].

- Do not adopt Gem’s generic concurrent batching rule: spec-kit already has stronger context-window and tool-call budgeting, including wave sizing and anti-patterns against unconstrained parallel dispatch [SOURCE: external/gem-team-main/.apm/agents/gem-orchestrator.agent.md:256-258; .opencode/agents/orchestrate.md:640-652,753-760].

### OPEN QUESTIONS
- Should `@orchestrate` add a named “per-wave integration check” sentence that explicitly maps each wave to `@review` or equivalent verification only when the wave has implementation/security/design risk?

### METRICS
newInfoRatio: 0.18
novelty: Gem Team’s orchestration is mostly already covered; the only useful novelty is a clearer, compact routing/wave-integration presentation.
status: complete
focus: RQ1 orchestration & wave execution

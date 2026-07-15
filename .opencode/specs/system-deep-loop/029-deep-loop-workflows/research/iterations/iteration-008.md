# Deep-Research Iteration 008: skill-benchmark mode boundary

> Engine: openai/gpt-5.5 --variant xhigh (read-only seat) · orchestrator-written.

This read-only pass examined the `skill-benchmark` mode, its command surface, and its relationship to the shared workflow runtime.

**Recommendation**

Make `skill-benchmark` a first-class `deep-loop-workflows` mode. Keep it distinct and diagnostic rather than hiding it under an opaque improvement bucket.

The merged public mode set should include `skill-benchmark` alongside the other deep-loop modes. Preserve its mode strings, argv/env surfaces, report schemas, journal semantics, and output paths. The safe structural move is to repoint the old skill root to the merged workflow root without changing mode behavior.

**Evidence**

The context report identifies `skill-benchmark` as a self-referential risk once the merged skill exists. The mode is still independently testable: it resolves a target skill, runs the D5 hard gate, loads playbook scenarios, dispatches benchmark work, aggregates results, and writes `skill-benchmark-report.{json,md}`.

The operator guide defines the D5 hard gate, deterministic and live benchmark paths, advisor probing, coverage dimensions, and verdict bands. D5 is a structural hard gate, while advisor probing remains deterministic and out-of-band through the Python skill advisor.

**Rejected Alternatives**

Do not make `skill-benchmark` a generic helper under an undifferentiated `improvement` mode. That would lose routing granularity and make advisor and command behavior less precise. The benchmark has its own report schema and is diagnostic by default.

Do not move the benchmark scorer or report renderer into `deep-loop-runtime`. They are workflow-mode semantics; `deep-loop-runtime` remains the MCP-free shared backend.

Do not exclude `deep-loop-workflows` from self-benchmarking. The merged skill must be benchmarkable because it becomes the router for all deep loops. Excluding it would hide the highest-risk routing case.

**Self-Reference Decision**

Handle self-reference with benchmark-by-mode, not exclude-self.

When the target skill is `deep-loop-workflows`, a run should be scoped to exactly one mode family, for example `context`, `research`, `review`, `council`, `agent-improvement`, `model-benchmark`, or `skill-benchmark`. The report should identify `targetSkill.id=deep-loop-workflows` plus a mode scope such as `targetMode=skill-benchmark`.

D1-inter can score whether the advisor routes to `deep-loop-workflows`; D1-intra and D2 must carry the mode-specific burden by checking expected intent keys and resources. This avoids a false pass where every prompt merely activates the merged skill but loads the wrong mode resources.

The scenario and playbook corpus for self-benchmarking must be mode-scoped and contamination-safe. Public prompts should not leak `deep-loop-workflows` or internal intent-key vocabulary, because the contamination guard builds banned terms from the target skill identity and router terms.

**Concrete Path Changes**

Preserve the benchmark implementation under the merged workflow root:

| Current path | Target path |
|---|---|
| `.opencode/skills/deep-improvement/scripts/shared/loop-host.cjs` | `.opencode/skills/deep-loop-workflows/scripts/shared/loop-host.cjs` |
| `.opencode/skills/deep-improvement/scripts/skill-benchmark/*` | `.opencode/skills/deep-loop-workflows/scripts/skill-benchmark/*` |
| `.opencode/skills/deep-improvement/references/skill_benchmark/*` | `.opencode/skills/deep-loop-workflows/references/skill_benchmark/*` |
| `.opencode/commands/deep/start-skill-benchmark-loop.md` | update `skill: deep-loop-workflows`, prose, and command paths |

The command asset directory contains no separate benchmark YAML asset; the runnable command surface is in the Markdown command file.

**Risks**

The benchmark can falsely pass if scoring checks only that the advisor selected `deep-loop-workflows` and does not assert mode-specific resources and intents.

Contamination lint can reject self-benchmark prompts that mention the merged skill or internal intent vocabulary too directly.

Advisor routing needs alias preservation so prompts for `skill-benchmark` continue to route to `deep-loop-workflows` without losing mode intent.

**Dependencies**

The decision depends on the global layout choice only for final directory shape. The semantic recommendation is independent: `skill-benchmark` is first-class and remains outside `deep-loop-runtime`.

The decision depends on advisor support for one canonical skill identity with mode attribution. If that is unavailable, the benchmark must rely on resource and intent checks for mode precision.

The decision depends on governance placement for per-mode manual testing playbooks. Self-benchmarking should use mode-scoped playbooks.

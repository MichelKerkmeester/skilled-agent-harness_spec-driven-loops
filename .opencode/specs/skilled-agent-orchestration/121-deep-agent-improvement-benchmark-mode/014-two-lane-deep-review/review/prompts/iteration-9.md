DEEP-REVIEW iteration 9 of 10. Dimension focus this iteration: correctness.

You are an adversarial, skeptical senior code reviewer auditing the deep-agent-improvement TWO-LANE program (phases 008-013). What shipped: a lane-asking extension to /deep:start-agent-improvement-loop (auto-resolves Lane A on an agent path, asks only when ambiguous), a new dedicated /deep:start-model-benchmark-loop command + two Lane B workflow YAMLs, a SKILL.md restructure into two co-equal lanes + a MODEL_BENCHMARK smart-router intent, physical lane separation of references/assets/scripts into agent-improvement/model-benchmark/shared, an agent 'Lane awareness' note, a reduce-state mode-mix display (F-P2-5), advisor lane disambiguation, and a loop-host fix that forwards --scorer/--grader to run-benchmark (and a spawn-time resolveScriptPath map that keeps planInvocation byte-identical for TST-1). dispatch-model.cjs got +1 __dirname depth after the scripts move.

READ each of these files (you have read-only repo access from the repo root) and review ONLY for correctness issues in THIS iteration:
- .opencode/skills/deep-agent-improvement/scripts/shared/loop-host.cjs
- .opencode/skills/deep-agent-improvement/scripts/model-benchmark/dispatch-model.cjs
- .opencode/skills/deep-agent-improvement/scripts/model-benchmark/run-benchmark.cjs
- .opencode/skills/deep-agent-improvement/scripts/shared/reduce-state.cjs
- .opencode/skills/deep-agent-improvement/scripts/agent-improvement/score-candidate.cjs
- .opencode/skills/deep-agent-improvement/scripts/tests/loop-host.vitest.ts
- .opencode/skills/deep-agent-improvement/scripts/tests/reduce-state-mode-mix.vitest.ts
- .opencode/commands/deep/start-agent-improvement-loop.md
- .opencode/commands/deep/start-model-benchmark-loop.md
- .opencode/commands/deep/assets/deep_start-model-benchmark-loop_auto.yaml
- .opencode/commands/deep/assets/deep_start-model-benchmark-loop_confirm.yaml
- .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/aliases.ts
- .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/explicit.ts
- .opencode/skills/deep-agent-improvement/SKILL.md
- .opencode/agents/deep-agent-improvement.md
- .opencode/skills/deep-agent-improvement/assets/model-benchmark/benchmark-profiles/default.json

Severity rubric: P0 = blocker (breaks a lane, silent data corruption, security hole, TST-1/byte-identity violation). P1 = required (real defect, wrong behavior, missed edge case). P2 = advisory (maintainability, clarity, minor risk).

Prior findings already reported across earlier iterations (do NOT repeat these; find NEW correctness issues or confirm none):
- [P0] Lane B YAML flags parse as booleans (.opencode/skills/deep-agent-improvement/scripts/shared/loop-host.cjs)
- [P0] Model benchmark never dispatches a model (.opencode/skills/deep-agent-improvement/scripts/shared/loop-host.cjs)
- [P1] Lane B emits invalid session outcome (.opencode/commands/deep/assets/deep_start-model-benchmark-loop_auto.yaml)
- [P1] LLM executor fields are dropped (.opencode/commands/deep/start-model-benchmark-loop.md)
- [P1] Benchmark plateau stop is not implemented (.opencode/skills/deep-agent-improvement/scripts/shared/reduce-state.cjs)
- [P1] Profile IDs fail before run-benchmark (.opencode/skills/deep-agent-improvement/scripts/shared/loop-host.cjs)
- [P1] Lane B config path is split (.opencode/commands/deep/assets/deep_start-model-benchmark-loop_auto.yaml)
- [P1] Failure reports lose scorer provenance (.opencode/skills/deep-agent-improvement/scripts/model-benchmark/run-benchmark.cjs)
- [P1] Explicit Lane B can be shadowed (.opencode/commands/deep/start-agent-improvement-loop.md)
- [P2] Agent note uses old script paths (.opencode/agents/deep-agent-improvement.md)
- [P2] Pause resume hint points nowhere (.opencode/skills/deep-agent-improvement/scripts/model-benchmark/dispatch-model.cjs)
- [P2] Spawn path mapping is untested (.opencode/skills/deep-agent-improvement/scripts/tests/loop-host.vitest.ts)
- [P2] Max-iteration binding is split (.opencode/commands/deep/start-model-benchmark-loop.md)
- [P2] Grader provenance is not persisted (.opencode/skills/deep-agent-improvement/scripts/model-benchmark/run-benchmark.cjs)
- [P2] Unknown modes collapse into Lane A (.opencode/skills/deep-agent-improvement/scripts/shared/reduce-state.cjs)
- [P2] Benchmark profile duplicates fixture schema (.opencode/skills/deep-agent-improvement/assets/model-benchmark/benchmark-profiles/default.json)
- [P2] Advisor disambiguation uses alias-shaped penalty ids (.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/explicit.ts)
- [P0] Lane B workflow commands interpolate user input into shell strings (.opencode/commands/deep/assets/deep_start-model-benchmark-loop_auto.yaml)
- [P0] LLM grader dispatch grants write-capable permissions (.opencode/skills/deep-agent-improvement/scripts/model-benchmark/dispatch-model.cjs)
- [P1] Fixture IDs can escape the benchmark output directory (.opencode/skills/deep-agent-improvement/scripts/model-benchmark/run-benchmark.cjs)
- [P1] Criteria shell execution defaults open (.opencode/skills/deep-agent-improvement/SKILL.md)
- [P1] Score cache is trusted from a shared temp path (.opencode/skills/deep-agent-improvement/scripts/agent-improvement/score-candidate.cjs)
- [P2] Benchmark fixtures can trigger regex DoS (.opencode/skills/deep-agent-improvement/scripts/model-benchmark/run-benchmark.cjs)
- [P1] Cached scores can point at the wrong candidate (.opencode/skills/deep-agent-improvement/scripts/agent-improvement/score-candidate.cjs)
- [P1] Benchmark reports are overwritten across iterations (.opencode/skills/deep-agent-improvement/scripts/model-benchmark/run-benchmark.cjs)
- [P1] Pause state is not packet-local (.opencode/skills/deep-agent-improvement/scripts/model-benchmark/dispatch-model.cjs)
- [P1] Lane B promotion gate references Lane A artifacts (.opencode/commands/deep/assets/deep_start-model-benchmark-loop_confirm.yaml)
- [P2] Benchmark result omits profile provenance (.opencode/skills/deep-agent-improvement/scripts/model-benchmark/run-benchmark.cjs)
- [P2] Ledger writer ownership is ambiguous (.opencode/commands/deep/assets/deep_start-model-benchmark-loop_auto.yaml)
- [P2] Benchmark option schema is split (.opencode/skills/deep-agent-improvement/scripts/shared/loop-host.cjs)
- [P2] Router assets are not lane-aware (.opencode/skills/deep-agent-improvement/SKILL.md)
- [P2] Infra failure emission is duplicated (.opencode/skills/deep-agent-improvement/scripts/agent-improvement/score-candidate.cjs)
- [P2] Dispatcher CLI hides failure diagnostics (.opencode/skills/deep-agent-improvement/scripts/model-benchmark/dispatch-model.cjs)
- [P2] Integration scoring comments contradict code (.opencode/skills/deep-agent-improvement/scripts/model-benchmark/run-benchmark.cjs)

OUTPUT CONTRACT: Output ONLY a single JSON array, no prose and no markdown fences. Each element: {"id":"correctness-9-N","severity":"P0|P1|P2","dimension":"correctness","title":"short","file":"path","line":123,"evidence":"what you actually saw in the file","fix":"concrete fix"}. If you find no NEW correctness issues this iteration, output exactly [].

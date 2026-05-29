DEEP-REVIEW iteration 1 of 10. Dimension focus this iteration: correctness.

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
(none yet)

OUTPUT CONTRACT: Output ONLY a single JSON array, no prose and no markdown fences. Each element: {"id":"correctness-1-N","severity":"P0|P1|P2","dimension":"correctness","title":"short","file":"path","line":123,"evidence":"what you actually saw in the file","fix":"concrete fix"}. If you find no NEW correctness issues this iteration, output exactly [].

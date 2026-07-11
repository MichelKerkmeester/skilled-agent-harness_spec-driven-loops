---
description: Autonomous deep-review loop: iterative code audit with convergence detection. Modes :auto, :confirm.
argument-hint: "<target> [:auto|:confirm] [--max-iterations=N] [--convergence=N] [--convergence-mode=default|off|sliding-window|divergent] [--lineage-timeout-hours=N] [--stop-policy=convergence|max-iterations] [--spec-folder=PATH] [--no-resource-map] [--restart|--lineage-mode=restart] [--executor=<type> --model=X --config-dir=PATH --reasoning-effort=LEVEL --service-tier=TIER --executor-timeout=SECONDS --iters=N --count=N --label=X ...] [--executors=<json>] [--concurrency=N] (:auto supports PRE-BOUND SETUP ANSWERS: prompt-body block for non-interactive setup)"
allowed-tools: Read, Write, Edit, Bash, Grep, Glob, Task, mcp__mk_spec_memory__memory_context, mcp__mk_spec_memory__memory_search, mcp__mk_code_index__code_graph_query, mcp__mk_code_index__code_graph_context
---

# Deep Start Review Loop

!`node .opencode/skills/system-deep-loop/runtime/scripts/render-command-contract.cjs --command deep/review -- '$ARGUMENTS'`

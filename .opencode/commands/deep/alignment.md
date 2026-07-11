---
description: Autonomous deep-alignment loop: conformance audit against named standard authorities across resolved lanes. Modes :auto, :confirm.
argument-hint: "<target> [authority] [:auto|:confirm] [--lane-config <file.json>] [--max-iterations=N] [--coverage-threshold=N] [--stability-window=N] [--spec-folder=PATH] [--restart|--lineage-mode=restart] [--executor=<type> --model=X --config-dir=PATH --reasoning-effort=LEVEL --service-tier=TIER --executor-timeout=SECONDS] (:auto supports PRE-BOUND SETUP ANSWERS: prompt-body block for non-interactive setup)"
allowed-tools: Read, Grep, Glob, Task, Bash, mcp__mk_spec_memory__memory_context, mcp__mk_spec_memory__memory_search, mcp__mk_code_index__code_graph_query
---

# Deep Start Alignment Loop

!`node .opencode/skills/system-deep-loop/runtime/scripts/render-command-contract.cjs --command deep/alignment -- '$ARGUMENTS'`

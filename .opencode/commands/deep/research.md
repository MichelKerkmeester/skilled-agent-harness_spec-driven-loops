---
description: Autonomous deep-research loop: iterative investigation with convergence detection. Modes :auto, :confirm.
argument-hint: "<topic> [:auto|:confirm] [--max-iterations=N] [--convergence=N] [--lineage-timeout-hours=N] [--stop-policy=convergence|max-iterations] [--dry-run] [--executor=<type> [--model=X] [--config-dir=PATH] [--count=N] [--label=X] ...] [--executors=<json>] [--concurrency=N] (:auto supports PRE-BOUND SETUP ANSWERS: prompt-body block for non-interactive setup)"
allowed-tools: Read, Write, Edit, Bash, Grep, Glob, Task, WebFetch, mcp__mk_spec_memory__memory_context, mcp__mk_spec_memory__memory_search, mcp__mk_code_index__code_graph_query, mcp__mk_code_index__code_graph_context
---

# Deep Start Research Loop

!`node .opencode/skills/deep-loop-runtime/scripts/render-command-contract.cjs --command deep/research -- '$ARGUMENTS'`

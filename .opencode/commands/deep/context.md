---
description: Codebase-context loop: heterogeneous parallel sweep with convergence detection. Modes :auto, :confirm.
argument-hint: "<scope> [:auto|:confirm] [--max-iterations=N] [--convergence=N] [--executor=<type> [--model=X] [--prompt-framework=X] [--label=X] ...] [--executors=<json>] [--concurrency=N] (:auto supports PRE-BOUND SETUP ANSWERS: prompt-body block for non-interactive setup)"
allowed-tools: Read, Write, Edit, Bash, Grep, Glob, Task, mcp__mk_spec_memory__memory_context, mcp__mk_spec_memory__memory_search, mcp__mk_code_index__code_graph_query, mcp__mk_code_index__code_graph_context
---

# Deep Start Context Loop

!`node .opencode/skills/deep-loop-runtime/scripts/render-command-contract.cjs --command deep/context -- '$ARGUMENTS'`

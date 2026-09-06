# Iteration 1 Prompt

Dispatcher: inline autonomous executor (`cli-codex`, `gpt-5.6-luna`); no executor dispatch is performed.

Review target: `.opencode/specs/system-speckit/049-memory-decommission` (`spec-folder`, read-only).

Focus: reconcile the parent phase map, child task completion gates, acceptance criteria, and closure claims. Check whether a completed status is supported by the packet's own declared evidence. Cover correctness and traceability first, then record security and maintainability surfaces as clean, ruled out, or deferred.

Required output: source-cited iteration markdown, structured delta JSONL, and one complete state record under the bound lineage directory. Continue the loop even if convergence telemetry appears positive; the configured stop policy is `max-iterations`.

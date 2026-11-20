# Iteration 3: Prior art on worker honesty, heterogeneous executors and partial reruns (F-1-005)

## Focus
Frontier node F-1-005 asks two things. How do Inspect, OpenHands, LangGraph, the Claude Agent SDK and Claude Code headless, and AutoGen verify worker honesty, normalize heterogeneous executors and rerun partial failures? And which of their ideas fits `fanout-run.cjs`?

The web queries named only products and features, with no personal data. The previous run already cited Inspect `eval_set` (backlog row 10, built) and the OpenHands stuck detector (row 28, held). This pass reports only what those rows did not take from them.

## Actions Taken
Eight WebSearch queries, each mapped onto the runner code read in iterations 1 and 2:
- Inspect eval sets and eval-retry
- the OpenHands stuck detector
- LangGraph durable execution
- Agent SDK hooks
- Claude Code headless stream-json
- AutoGen termination and state
- the Inspect ModelAPI
- Inspect transcript events

## Findings
1. **Inspect: the harness, not the model, records every tool call and its timing.**
   - Inspect eval logs hold `ModelEvent` and `ToolEvent` rows with a `completed` time and a `working_time`. Inspect writes these itself, without asking the model. [SOURCE: https://inspect.aisi.org.uk/reference/inspect_ai.event.html] [SOURCE: https://inspect.aisi.org.uk/eval-logs.html]
   - That is the principle behind iteration 1's `passEvidence`. Honesty signals come from events the harness observed, never from fields the worker wrote.
   - **Fit:** make the runner's per-lineage log the transcript. Store a normalized `tool_event` stream (`{t, tool, target}`) per lineage beside `fanout-lineage.out`, whatever the CLI.
   - Value H, effort M, risk L.
2. **Claude Code headless already emits the events the runner needs.**
   - `--output-format stream-json` ends with a `result` message carrying the cost and session metadata, and `json` carries `total_cost_usd`. [SOURCE: https://code.claude.com/docs/en/headless]
   - Third-party references list `num_turns`, `duration_ms` and `is_error` on that result, and say intermediate assistant and tool events appear only with `--verbose`. [SOURCE: https://pivanov.github.io/claude-wire/protocol/output-events.html] [SOURCE: https://0xranx.github.io/golembot/reference/coding-cli-claude-code.html]
   - An unconfirmed user issue reports that `total_cost_usd` is cumulative per stream-json session, so the runner should take the *last* result rather than summing. [SOURCE: https://claudeissues.com/issue/83239-docs-total-cost-usd-is-cumulative-per-session-under-output-format-stream-json-bu]
   - **Fit:** change cli-claude-code from `--output-format text` to `--output-format stream-json --verbose`. Teach `fanout-salvage.cjs` to read the last `result.total_cost_usd`, the `tool_use` blocks inside assistant messages, and the final `result` text, which salvage needs in place of today's text log. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-salvage.cjs:41-96]
   - This extends held row 18's second half with the exact message shape.
   - Value H, effort S-M, risk M: salvage of the final answer changes.
3. **OpenHands: detect repetition from observed events, keep the thresholds configurable, and expect false positives.**
   - The detector flags an action-and-observation pair that repeats 4 or more times, and two pairs alternating for 6 or more cycles. It reads only events after the last user message. [SOURCE: https://docs.openhands.dev/sdk/guides/agent-stuck-detector]
   - A user issue shows it halting an agent that was told to poll on purpose. The fix there was a configurable threshold, raised from 4 to 10. [SOURCE: https://github.com/OpenHands/software-agent-sdk/issues/762]
   - **Fit:** gen2's stamped review passes had the same per-pass shape: a few shell calls and two writes, repeated pass after pass (iteration 1, finding 4).
     - Add an event-shape signal: N consecutive passes with the same tool-kind histogram and zero source reads.
     - Use it only as a *flag* feeding `unexamined`, never as a hard stop.
     - Put the threshold in config.
   - This sharpens held row 28 with the false-positive lesson.
   - Value M, effort S, risk M.
4. **LangGraph: keep the successful work of a failed step, and throw away the writes of a timed-out attempt.**
   - When one node in a super-step fails, the pending writes of the nodes that succeeded are stored, and a resume does not re-run them. [SOURCE: https://docs.langchain.com/oss/python/langgraph/durable-execution]
   - On a timeout, the writes from the failed attempt are cleared. [SOURCE: https://docs.langchain.com/oss/python/langgraph/fault-tolerance.md]
   - **Fit:** the runner already keeps landed iterations on resume (packet 013, no-redispatch of a landed iteration). The missing half is clearing the half-written iteration of a killed attempt: an `iteration-NNN.md` or delta with no gateway record.
     - On resume, move such orphans to `_archive/` before the lineage restarts. Otherwise the leaf's write-once rule makes it pick N+1 and leave a gap.
     - The runner's resume path was not read this pass, so this is a follow-up to verify.
   - [INFERENCE: based on the LangGraph timeout rule and the write-once iteration contract in .skilled/agents/deep-research.md]
   - Value M, effort S, risk L.
5. **AutoGen: termination is a composable value, and external stop is one condition among others.**
   - AgentChat termination conditions combine with `&` and `|`. The built-ins include token-usage, timeout and `ExternalTermination`, for a UI stop button. [SOURCE: https://microsoft.github.io/autogen/0.4.7/user-guide/agentchat-user-guide/tutorial/termination.html]
   - Team state saves and loads for resume. [SOURCE: https://mintlify.com/microsoft/autogen/guides/multi-agent-workflows]
   - **Fit:** iteration 2's `--stop` is the runner's `ExternalTermination`. It should end lineages through the same terminal path as a cap stop, writing a `stopped` outcome per lineage with a rerun command, rather than a bare signal kill.
   - The convergence side already composes its stop rules in `convergence.cjs`, so nothing new is needed there.
   - Value M, effort S, risk L.
6. **Inspect ModelAPI: one adapter interface per provider, with generation settings kept apart.**
   - A provider subclasses `ModelAPI` and implements `generate()`. That method converts Inspect's messages, tools and `GenerateConfig` into the provider's native form. [SOURCE: https://inspect.aisi.org.uk/extensions-model-api.html] [SOURCE: https://inspect.aisi.org.uk/reference/inspect_ai.model.html]
   - **Fit:** this is the single adapter contract Q2 asks about. Each `LINEAGE_COMMAND_ADAPTERS` entry would return one object:
     - `argv`;
     - `promptChannel` (`stdin` or `argv` or `file`);
     - `effective` (`{permission, sandboxEnforcement, effortApplied}`);
     - `parseLog(stdout)` returning `{events, costUsd, finalText}`;
     - `classifyFailure(stderr, stdout)`.
   - One conformance test would run every kind against a fixture log per kind.
   - Value H, effort M, risk M.
7. **Inspect eval sets: completion lives in the log directory, so a rerun on a finished set is a no-op. That part is built.**
   - `eval-retry` resumes one interrupted task from its log file. [SOURCE: https://inspect.aisi.org.uk/eval-sets.html] [SOURCE: https://inspect.aisi.org.uk/reference/inspect_eval-retry.html]
   - The runner already has both: the finished-lineage skip and `--only-lineage`.
   - What Inspect does not cover is the provider swap on a retry. Iteration 2's `--lineage-override` stays this runner's own gap, and I found no prior art for it. [INFERENCE: based on iteration 2 finding 3 and the eval-retry reference]

## Questions Answered
- F-1-005 (prior art): every named system was mapped, and findings 1, 2 and 6 are the ideas that fit best.

## Questions Remaining
- F-2-006: the log shape for each runtime. Finding 2 settles Claude, and the rest remain.
- F-2-007: honesty thresholds.

## Ruled Out
- **AutoGen's text-mention termination as a model:** a stop the model announces itself is exactly the self-report this work is trying to avoid.
- **Inspect `working_time` as a pass-duration signal:** its own docs say it can undercount overlapped work, and iteration 1 already found duration alone weak.

## Dead Ends
- Claude Agent SDK hooks: a `PostToolUse` hook could keep an audit trail [SOURCE: https://code.claude.com/docs/en/agent-sdk/hooks]. Installing one means writing into the operator's Claude config dir, though, and stream-json gives the same events without that write. Dropped in favour of finding 2.

## Edge Cases
- Ambiguous input: none.
- Contradictory evidence: Anthropic's SDK cost docs say each result reflects that one call, while a user issue reports cumulative cost under stream-json. Both are cited, and taking the last result is safe under either reading.
- Missing dependencies: no WebFetch tool. Search summaries stand in for full pages, and the field names from third-party pages are marked as such.
- Partial success: none.

## Sources Consulted
- https://inspect.aisi.org.uk/eval-sets.html ; https://inspect.aisi.org.uk/reference/inspect_eval-retry.html ; https://inspect.aisi.org.uk/reference/inspect_ai.event.html ; https://inspect.aisi.org.uk/eval-logs.html ; https://inspect.aisi.org.uk/extensions-model-api.html ; https://inspect.aisi.org.uk/reference/inspect_ai.model.html
- https://docs.openhands.dev/sdk/guides/agent-stuck-detector ; https://github.com/OpenHands/software-agent-sdk/issues/762
- https://docs.langchain.com/oss/python/langgraph/durable-execution ; https://docs.langchain.com/oss/python/langgraph/fault-tolerance.md
- https://code.claude.com/docs/en/headless ; https://code.claude.com/docs/en/agent-sdk/hooks ; https://pivanov.github.io/claude-wire/protocol/output-events.html ; https://0xranx.github.io/golembot/reference/coding-cli-claude-code.html ; https://claudeissues.com/issue/83239-docs-total-cost-usd-is-cumulative-per-session-under-output-format-stream-json-bu
- https://microsoft.github.io/autogen/0.4.7/user-guide/agentchat-user-guide/tutorial/termination.html ; https://mintlify.com/microsoft/autogen/guides/multi-agent-workflows
- .skilled/skills/system-deep-loop/runtime/scripts/fanout-salvage.cjs:41-96

## Assessment
- New information ratio: 0.71
- Questions addressed: F-1-005
- Questions answered: F-1-005

## Reflection
- **What worked:** reading each system for one mechanism and then naming the runner line it maps to. Pure surveys add nothing here.
- **What did not work:** none of the searches gave Claude's stream-json tool event schema from an official source.
- **What I would do differently:** pull a live `claude -p --output-format stream-json --verbose` sample. That would spawn a CLI, though, which this lineage must not do.

## Recommended Next Focus
F-2-006: map the log shape of every runtime against the adapter contract in finding 6.

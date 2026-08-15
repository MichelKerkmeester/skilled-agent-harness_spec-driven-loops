# Iteration 005 — Token, cost, and context vocabulary

## Question

What usage information makes a remote session legible without false precision or provider-specific leakage?

## Evidence

Pi get_session_stats includes input/output/cache tokens, total tokens, cost, and context usage ([RPC](https://pi.dev/docs/latest/rpc)). OpenTelemetry defines GenAI input/output/reasoning/total token attributes and warns tool arguments/results can be sensitive ([semantic conventions](https://opentelemetry.io/docs/specs/semconv/registry/gen-ai/)). Anthropic streams cumulative usage ([streaming](https://platform.claude.com/docs/en/build-with-claude/streaming)); OpenAI exposes usage and reasoning summary fields ([Responses reference](https://platform.openai.com/docs/api-reference/responses-streaming/response/code_interpreter_call_code/delta)).

## Findings

Use integer wire units and separate cumulative session totals from current-turn estimates:

~~~json
{"kind":"usage.snapshot","sessionId":"ses_opaque","epoch":3,"seq":901,"payload":{"scope":"session","revision":18,"tokens":{"input":50000,"output":10000,"reasoning":null,"cacheRead":40000,"cacheWrite":5000,"total":105000},"costMicros":450000,"context":{"tokens":60000,"window":200000,"percent":30},"quality":"reported","afterCompaction":false}}
~~~

Null means unavailable; zero means reported zero. costMicros avoids floating drift. quality estimated is required when final provider usage is absent. Session totals do not reset at compaction; context usage may be temporarily unknown and gets an afterCompaction marker.

The PWA shows 46k tokens, ~$0.45, and 30% context, with a breakdown sheet. Approximate cost has a visible ~; unavailable is —. A since-last-compaction view prevents cumulative totals from obscuring current work. The relay aggregates per-session metadata and excludes provider credentials, account IDs, and raw billing records.

At settled boundaries, usage snapshots must reconcile with Pi get_session_stats, cumulative totals must be monotonic, compaction cannot decrease history, and UI rounding must be pure formatting. This is more trustworthy than an opaque spend number.

## Assessment

New information ratio: 0.79. The cost vocabulary is answered and the event schema gains a stable usage record; Q10 still needs end-to-end integration.

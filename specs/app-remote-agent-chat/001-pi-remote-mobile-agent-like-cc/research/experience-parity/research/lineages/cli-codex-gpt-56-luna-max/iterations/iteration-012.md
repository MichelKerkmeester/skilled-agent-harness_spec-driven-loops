# Iteration 012 — Single-host multi-session concurrency

## Question

How should one relay safely host many concurrent Pi sessions without head-of-line blocking or cross-session authority?

## Evidence

Claude agent view is designed to manage many background sessions with per-row waiting/working/done state ([docs](https://code.claude.com/docs/en/agent-view)). Cursor documents background-agent API support up to 256 active agents per API key, in isolated environments ([API overview](https://docs.cursor.com/background-agent/api/overview)). Pi RPC correlates responses by command id and emits session events ([RPC](https://pi.dev/docs/latest/rpc)). 041 requires one persistent Pi child and independent immutable epoch per active session.

## Findings

Use a session-keyed multiplexer:

~~~json
{"kind":"host.capacity","hostId":"host_opaque","epoch":2,"seq":80,"payload":{"maxSessions":8,"activeSessions":5,"maxBufferedEventsPerSession":2000,"maxClientsPerSession":3,"policyVersion":"r1"}}
{"kind":"session.stream.window","sessionId":"ses_opaque","epoch":7,"seq":410,"payload":{"windowEvents":256,"lastAckedSeq":388,"dropped":0}}
{"command":"session.open","sessionId":"ses_opaque","expectedEpoch":7,"clientCursor":{"lastAckedSeq":388}}
~~~

Each session has its own Pi child, stdin/stdout framing, command correlation, event buffer, approval lease, and epoch. A fair scheduler drains bounded per-session queues; a noisy output stream cannot delay an approval or settle event in another session. When a limit is reached, new work is queued with an explicit capacity reason. The PWA home list subscribes to compact summaries and opens one rich stream at a time; background sessions remain durable and produce attention events.

All commands carry session ID and expected epoch. Device capabilities are session-scoped; a lease from session A is invalid for B. The relay does not share child process environment, cursors, path labels, or approval state between sessions.

The superiority test launches N sessions with one flood stream, concurrent rename, reconnect, approval race, and one child crash. Other sessions must continue within a bounded latency, no event may cross a session ID, and each restarted child gets a new epoch with replay/snapshot semantics.

## Prior-art comparison

Claude demonstrates the right session-switching mental model; Cursor demonstrates scale through isolated cloud workers. Pi can exceed them for a single private host by making fairness, per-session process isolation, replay cursors, and approval boundaries explicit and testable.

## Assessment

New information ratio: 0.87. Q8 is answered at the architecture level; reconnection and UX details remain.

# Iteration 017 — Performance, battery, and bounded streaming

## Question

How can the client feel live on mobile while preserving every authoritative event and avoiding battery/memory failure?

## Evidence

Pi requires strict LF JSONL framing and streams message/tool updates ([RPC](https://pi.dev/docs/latest/rpc)). OWASP recommends message-size limits, rate limiting, idle timeouts, heartbeat, and backpressure for WebSockets ([security](https://cheatsheetseries.owasp.org/cheatsheets/WebSocket_Security_Cheat_Sheet.html)). Cursor uses mobile Live Activities and push for attention rather than requiring a full stream ([mobile](https://cursor.com/mobile)). 041 requires durable persist-before-broadcast replay.

## Findings

Separate durable canonical events from delivery quality:

~~~json
{"kind":"stream.quality","sessionId":"ses_opaque","epoch":7,"seq":920,"payload":{"mode":"coalesced","sourceSeqFrom":920,"sourceSeqTo":934,"deltaCount":15,"flushMs":80,"dropped":0,"backpressure":"normal"}}
{"kind":"sync.heartbeat","sessionId":"ses_opaque","epoch":7,"seq":935,"payload":{"clientId":"dev_opaque","lastAckedSeq":934,"rttMs":42}}
~~~

Persist canonical chunks with their sequence numbers; coalesce only the WebSocket presentation, preserving source sequence range and replayability. Proposed product targets (to be measured, not assumed): first visible text under 500 ms after relay receipt, approval fetch under 1 s on a healthy tailnet, 95th-percentile reconnect reconciliation under 3 s for a bounded delta, and no unbounded client memory. Use max payload 64 KiB for commands/events, bounded output tails/diffs, per-session windows, and a snapshot fallback.

When the phone is backgrounded, stop the rich stream and rely on content-free attention push; resume with sync. Use an 80–120 ms text flush window, virtualized transcript, and reduced animation. If backpressure rises, preserve control/attention/settled events, coalesce text/tool output, and show a “live view throttled” label. Never drop an authoritative event without a durable sequence or explicit snapshot/gap.

Disable compression for sensitive mixed streams unless measured and approved; OWASP notes compression can create secret side channels. Rate limit commands and keep heartbeat/idle cleanup.

## Better-than-parity proof

Measure cold open, live delta, approval fetch, reconnect, memory, battery, and multi-session fairness on representative phones and tailnet links. Inject a flood stream and prove attention/approval latency remains within target while the canonical replay ledger stays complete.

## Assessment

New information ratio: 0.78. Performance and battery contracts are bounded; the integrated state machine is the final research pass before verification review.

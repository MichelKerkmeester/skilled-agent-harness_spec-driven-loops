# Iteration 004 — Tool calls, results, and file diffs

## Question

How can the phone show enough tool and diff detail for remote review while never trusting or persisting the wrong data?

## Evidence

Pi documents tool_execution_start, streaming updates, and completion events with tool name, arguments, and partial results ([RPC](https://pi.dev/docs/latest/rpc)). The 041 approval contract requires final-boundary canonical digest recomputation at specs/cli-external-orchestration/041-pi-remote-mobile-agent-like-cc/006-approval-and-remote-mutation/spec.md. Claude remote control establishes remote steering but not client authority ([Remote Control](https://code.claude.com/docs/en/remote-control)).

## Findings

Normalize separate call, input, output, and diff events:

~~~json
{"kind":"tool.call.started","sessionId":"ses_opaque","epoch":9,"seq":502,"payload":{"callId":"call_opaque","tool":"bash","argsState":"streaming","argsPreview":{"command":"npm test"},"actionDigest":"sha256:opaque","riskClass":"protected"},"redaction":{"policyVersion":"r1","removedPaths":["payload.argsPreview.env"]}}
{"kind":"file.diff","payload":{"fileRef":"file_opaque","displayPath":"src/app.ts","baseHash":"sha256:opaque","afterHash":"sha256:opaque","hunks":[{"oldStart":10,"oldLines":2,"newStart":10,"newLines":4,"lines":["+..."]}],"truncated":false}}
~~~

tool.input.delta is bounded and marked incomplete; tool.call.ended contains exit class, result digest, and redacted summary. A diff is a view with hashes and an explicit truncation bit, never an executable patch.

Tool cards show name, risk, elapsed time, redacted argument summary, output tail, and state. Diff cards show file/count summaries and a hunk sheet; full content is authenticated pull, not an unbounded event. Apply a field policy before persist-before-broadcast: remove environment variables, credentials, headers, disallowed absolute paths, binary payloads, and over-limit output. Retain hashes, sizes, removed, truncated, and policy version.

The proof is interruption plus redaction fuzzing: live and replay render identical call identity, risk, diff hashes, and flags; changing displayed arguments cannot change the final digest; tokens, paths, control characters, and multiline output never survive persistence. Pi remains final authority.

## Prior-art comparison

Pi's lifecycle is finer-grained than chat. Claude supplies remote steering. The proposed model adds mobile review while keeping rendering view-only.

## Assessment

New information ratio: 0.84. Q1/Q2 gain concrete tool/diff contracts and a redaction-fuzz release gate.

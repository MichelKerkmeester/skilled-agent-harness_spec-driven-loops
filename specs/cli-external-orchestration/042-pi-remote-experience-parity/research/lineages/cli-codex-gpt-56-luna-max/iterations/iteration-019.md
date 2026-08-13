# Iteration 019 — Verification matrix and adversarial review

## Question

What evidence would prove the proposed remote experience is richer than parity and still inside the 041 security posture?

## Verification matrix

| Axis | Required record | PWA assertion | Security/fault proof |
| --- | --- | --- | --- |
| Transcript richness | message/text/thinking/plan/tool/diff/usage/settled envelope | Same block graph after live and replay | Kill WebSocket after every persisted sequence; no hidden payload appears |
| Phone approval | approval.requested plus approval.decide | Two gestures to fetched review; submitted/verifying before result | Two-device CAS; mutate display; rotate epoch; only exact digest wins |
| Attention push | attention.changed plus opaque push hint | Generic notification opens authenticated current card | Push leak scanner finds no title/path/tool/decision; stale nonce is harmless |
| Accept-edits | policy.proposal/grant/use/revoke | Scope and remaining count are visible | Revoke, expiry, path change, restart, and cross-session use deny |
| Session catalog | session.summary and session.rename | Browse/filter/rename without prompt search | Scan all catalog JSON for paths, hostnames, prompts, session files |
| Background/away | session.lifecycle runLease and work.queue | Queued/not-running is distinct from running | Host heartbeat/lease loss prevents new work and approvals |
| Pairing | pairing.started/confirm/device.registered | One scan plus host confirmation | Expired QR, screenshot replay, device revoke, off-tailnet access |
| Concurrency | host.capacity and per-session window/open | Home rows stay responsive during flood | N children, one noisy stream, crash/restart; no cross-session event or HOL starvation |

## Findings

Add a durable verification.case record for test provenance, but never treat it as action authority:

~~~json
{"kind":"verification.case","caseId":"replay-boundary-001","subject":"session:ses_opaque","inputs":{"fault":"disconnect_after_seq","seq":1842},"expected":{"stateHash":"sha256:expected","redactionViolations":0,"staleCommands":1},"evidenceRef":"logs/test-replay-boundary-001.json"}
~~~

The authoritative acceptance suite must parse every JSONL line with a schema allow-list, inventory all event kinds, replay with lost WebSockets, and compare reducer state hashes. Separate baseline tests (041 parity) from superiority tests (rich block graph, content-free push, session fairness, accessible approval reachability). Proposed latency targets from iteration 017 are hypotheses until measured on representative phones and tailnet links; do not report them as facts.

Negative knowledge is part of the result: no exactly-once across unacknowledged crash, no decision content in push, no arbitrary background authority, no path-derived catalog name, no client-controlled diff, no raw thinking fabrication.

## Assessment

New information ratio: 0.55. The design is now falsifiable axis by axis; only final contradiction/open-question review remains.

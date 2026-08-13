# Iteration 003 — TODO and plan semantics

## Question

How should a mobile client show an actionable plan without fabricating state or allowing the UI to become an execution authority?

## Evidence

Claude agent view is organized around many sessions, needs-input status, working/done status, peek, and background dispatch ([docs](https://code.claude.com/docs/en/agent-view), [announcement](https://claude.com/blog/agent-view-in-claude-code)). Pi exposes turn/message/tool lifecycle and a settled boundary ([RPC](https://pi.dev/docs/latest/rpc)). The 041 relay spec is the durable replay authority at specs/cli-external-orchestration/041-pi-remote-mobile-agent-like-cc/003-relay-protocol-and-state/spec.md.

## Findings

Use a plan.snapshot event rather than checkbox mutations:

~~~json
{"kind":"plan.snapshot","sessionId":"ses_opaque","epoch":4,"seq":311,"planId":"plan_opaque","payload":{"revision":6,"items":[{"taskId":"t1","label":"Inspect failing tests","state":"done","dependsOn":[],"evidenceSeq":275},{"taskId":"t2","label":"Implement smallest fix","state":"active","dependsOn":["t1"],"evidenceSeq":309},{"taskId":"t3","label":"Run verification","state":"pending","dependsOn":["t2"]}],"source":"pi_extension","redaction":{"policyVersion":"r1","labelsRedacted":0}}}
~~~

Every revision remains in the event ledger. A task becomes done only from an explicit Pi/relay update or an associated verifiable boundary; a phone tap never marks it complete. Keep model plan, operator queue, and relay lifecycle separate as plan.snapshot, work.queued, and session.lifecycle.

The PWA shows a compact progress rail above the transcript: completion count, active task, blocked task, and a show-evidence affordance. Tapping an item scrolls to causal events and diffs. The first contract does not allow plan editing; a phone can send a normal follow-up but cannot mutate plan state.

The relay validates monotonic plan revision, redacts labels/evidence before persistence, and treats plan state as informational. Given the same event log, two devices must render the same revision and evidence links after reconnect; stale snapshots cannot overwrite newer state. This is richer than a status-only agent list while preserving 041 authority.

## Prior-art comparison

Claude supplies the cross-session status/peek pattern but publishes no durable plan schema or causal replay contract. Pi supplies the raw lifecycle stream. The proposed combination makes plan consistency an observable invariant.

## Assessment

New information ratio: 0.88. Q1 is refined with a concrete plan schema and Q9 gains a documented agent-view comparison. Q10 remains open.

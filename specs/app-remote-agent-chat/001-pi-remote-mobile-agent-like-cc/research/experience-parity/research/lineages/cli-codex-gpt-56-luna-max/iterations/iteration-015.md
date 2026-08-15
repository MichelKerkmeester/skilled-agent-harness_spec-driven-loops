# Iteration 015 — Prior-art comparison and superiority claims

## Question

Where can a private Pi client genuinely exceed current remote coding-agent experiences, and where must it honestly accept a convenience trade-off to preserve security?

## Evidence

Claude Remote Control documents local execution, QR pairing, session list, multi-surface sync, reconnect, and generic decision/finish push, with no per-event push policy ([docs](https://code.claude.com/docs/en/remote-control)). Claude agent view documents multi-session background processes, status rows, peek/reply, and a supervisor ([docs](https://code.claude.com/docs/en/agent-view)). Cursor mobile documents remote control, always-on cloud agents, Live Activities, push on finish/needs input, focused diffs, and merge workflows ([mobile](https://cursor.com/mobile), [iOS changelog](https://cursor.com/changelog/ios-mobile-app)). Pi RPC exposes the richest local source events ([RPC](https://pi.dev/docs/latest/rpc)); 041 supplies the relay security contract.

## Findings

Use a benchmark observation record so superiority is evidence, not marketing:

~~~json
{"kind":"benchmark.observation","benchmarkId":"remote-parity-v1","axis":"attention-privacy","subject":"pi-private-client","observed":{"pushPayload":"opaque-class-only","deepLink":"authenticated-pull","replaySafe":true},"comparison":{"claudeRemoteControl":"push decision timing documented; payload schema not public","cursorMobile":"finish/needs-input Live Activities documented; cloud/local modes differ"},"evidenceClass":"documented-plus-local-test"}
~~~

| Axis | Claude Remote Control / agent view | Cursor mobile/background | Pi + 041 opportunity |
| --- | --- | --- | --- |
| Local continuity | Local process, QR, reconnect, session list | Remote control plus cloud workers | Same local continuity with typed replay and no cloud transcript |
| Rich transcript | Remote window and status/peek | Conversation, artifacts, diffs | Typed text/thinking/plan/tool/diff/result/usage ledger |
| Approval | Remote decisions | Review/approval workflows | Exact digest + lease/CAS, submitted/verifying state |
| Attention | Finish/decision push, broad policy | Finish/needs-input Live Activities | Content-free needs_input/finished/error + authenticated pull |
| Background | Local supervisor/background sessions | Always-on isolated cloud agents | Host-minted bounded run lease; queued/not-running is honest |
| Multi-session | Agent view and supervisor | Many cloud agents | Per-child isolation, per-session epoch, fair local multiplexing |
| Data boundary | Account/API-mediated remote transport | Cloud VM or local remote control | Loopback relay, tailnet-only Serve, pre-persist redaction |

The defensible “better” claims are measurable: richer typed coverage, exact replay reconstruction, no decision-bearing push, stale-action denial, local data locality, per-session isolation, and accessible approval reachability. It is not defensible to claim greater unrestricted remote autonomy while retaining foreground authority. The product should show this trade-off in onboarding and benchmark results.

## Assessment

New information ratio: 0.76. Q9 is answered with a comparison matrix and a proof standard; Q10 receives its superiority criteria.

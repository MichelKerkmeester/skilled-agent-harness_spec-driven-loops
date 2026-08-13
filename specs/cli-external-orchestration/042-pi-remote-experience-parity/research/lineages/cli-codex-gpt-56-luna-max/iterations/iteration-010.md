# Iteration 010 — Background sessions and starting work away

## Question

How can Pi support background sessions and new work while the user is away without silently converting a phone into unrestricted host authority?

## Evidence

Claude Remote Control keeps the local session running and supports a mobile dispatch path ([docs](https://code.claude.com/docs/en/remote-control)). Claude agent view supports background sessions and dispatching new work ([agent view](https://code.claude.com/docs/en/agent-view)). Cursor web/mobile launches background agents in isolated infrastructure and explicitly documents auto-run/exfiltration risk ([background agents](https://docs.cursor.com/background-agent), [web/mobile](https://docs.cursor.com/en/background-agent/web-and-mobile)). 041 keeps foreground authority and excludes unbounded offline/background approval.

## Findings

Use a host-minted run lease to distinguish background compute from background authorization:

~~~json
{"kind":"session.lifecycle","sessionId":"ses_opaque","epoch":5,"seq":200,"payload":{"state":"background_ready","runLease":{"leaseId":"run_opaque","hostAuthority":"host_opaque","workspaceRef":"ws_opaque","expiresAt":"2026-08-12T18:00:00Z","maxDurationSec":3600,"requiresHeartbeat":true}}}
{"command":"work.queue","mutationId":"mut_opaque","sessionId":"ses_opaque","runLeaseId":"run_opaque","promptRef":"prompt_opaque","clientNonce":"nonce_opaque"}
~~~

The host foreground process mints the lease while present, with bounded workspace, duration, prompt size, and policy version. A phone may submit a queued work item against that lease; the relay persists it and reports queued. The Pi child starts it only while the host authority heartbeat and lease are valid. If the process is gone or the lease expires, the item remains queued/not-running and no remote approval is possible. A new session can be created from a host-approved workspace template, not from an arbitrary phone-supplied path or shell command.

The PWA makes the distinction visible: working, background-running, queued, blocked-on-host, needs input, finished, and error. It never implies that queued means execution started. A “start while away” button is available only when a valid run lease is already shown; otherwise it explains the one-time host setup.

This exceeds parity on truthfulness and privacy, not on unrestricted remote autonomy. Claude/Cursor optimize for away dispatch; Pi can demonstrably offer safer local execution, durable queued intent, and no hidden authority transfer.

## Security mechanism

The run lease is bound to host process identity, session epoch, workspace capability, expiry, heartbeat, and device. The final Pi boundary still consumes per-action approval/grant state. Lease loss stops new work and marks an indeterminate execution outcome for recovery.

## Assessment

New information ratio: 0.9. Q6 is answered within the foreground-authority constraint; concurrency and pairing are next.

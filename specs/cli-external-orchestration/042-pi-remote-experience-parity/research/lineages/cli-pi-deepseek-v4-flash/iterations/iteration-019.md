# Iteration 19: Gap Check 2 — Waiting Affordance, Error Attention, Fallback Surface

## Focus
Close the last UX corners: what the phone shows while a lease is pending (the waiting affordance), the `error` attention class's recovery UX, and the desktop-browser fallback surface. Prior art: the reference's frozen-session failure and its recovery workaround, agent-run recovery patterns, Tailscale web client/Border0 clientless access.

## Findings

### F1. The reference's frozen state is a real, recurring failure — recovery requires the physical machine
- Remote Control's mobile client can look frozen while the local terminal waits on a permission/plan-mode prompt that failed to render remotely (issue #35637); the documented workaround is to access the machine physically/SSH and approve locally, or stop/restart Remote Control; a community trick is tapping Stop to force a refresh ([SOURCE: github.com/anthropics/claude-code/issues/35637], [SOURCE: code.claude.com/docs/en/remote-control], [SOURCE: reddit.com/r/ClaudeCode/comments/1tfpcr4]).
- Implication: the waiting state must be a **first-class rendered state** with a countdown and a guaranteed outcome — the iteration-4 lease design already provides this; this iteration makes the affordance explicit.

### F2. Agent-run recovery patterns
- Classify before retrying: transient (bounded auto-retry with backoff) / correctable (ask user) / permanent-policy (explain + alternative) / unknown side effect (verify before retry); make recovery choices explicit (Retry step / Resume from checkpoint / Edit instruction / Skip / Escalate / Cancel); never silent loops; side-effecting operations need idempotency keys + durable receipts; after repeated failure, require a changed plan ([SOURCE: aiuxplayground.com/pattern/error-recovery-strategies/], [SOURCE: openai.github.io/openai-agents-python/running_agents/], [SOURCE: arxiv.org/abs/2603.20625]).
- Pi natively emits `auto_retry_*` and `summarization_retry_*` events (iteration 3) — the classification substrate already exists in the RPC stream.

### F3. Clientless browser access exists (Tailscale web client / Border0)
- Tailscale's web client is a management UI (not a PWA replacement); Border0 provides WASM-based browser access to approved services without installing the native client ([SOURCE: tailscale.com/kb/1325/device-web-interface], [SOURCE: tailscale.com/docs/border0/architecture-and-concepts]).
- Implication: a desktop-browser fallback for the Pi PWA is legitimate prior art territory; it can reuse the same QR enrollment and device credential.

## Design: gap fills

### Waiting-state affordance (`run.status = needs_input`)
- The transcript renders an inline **waiting bar** when a lease is pending: "Waiting on approval — expires in 4:52" with a live countdown, the tool card (redacted + digest chip), and a one-tap "Review" that opens the approval card (or glance action on Android). The bar never blocks rendering — the transcript stays live (the agent may stream other work or park).
- Expiry transitions: bar flips to "Timed out — no action taken" with Retry/Review options (F2 recovery vocabulary); "decided elsewhere" flips to the decision card with `decidedBy`. A frozen state is impossible by construction (lease + attention + rendered state, iteration 4/17).

### Error-class attention (recovery card)
- On `attention.raised {class: error}` or `transcript.run.status = error`, the PWA renders a **recovery card**: what completed (from transcript events), the failed step (seq-anchored), error class (transient/correctable/permanent from the failure classification), retry count (native `auto_retry_*` events), and explicit choices: Retry step / Resume from checkpoint / Edit instruction / Skip / Escalate / Cancel.
- Transient errors: relay-side bounded auto-retry with backoff is already native (auto_retry events); the card shows progress, never silent loops.
- Side-effect safety: any retry of a side-effecting tool is gated by the 003 ledger idempotency key + recorded outcome (receipt) — retry only after dedup/verification (F2 rule 5).

### Desktop-browser fallback surface
- The PWA is served over the tailnet via Tailscale Serve (004 already serves HTTPS/WSS); any desktop browser on the tailnet can enroll via the same QR ceremony (axis 7) and gets the full surface — no separate client. Documented as a first-class row (007 platform matrix), with the same SW notification limits as the platform's browser.
- Border0-style fully clientless WASM access is noted as optional future work, not required: the Tailscale client remains the supported transport (posture).

## Sources Consulted
- [SOURCE: https://github.com/anthropics/claude-code/issues/35637]
- [SOURCE: https://code.claude.com/docs/en/remote-control]
- [SOURCE: https://www.aiuxplayground.com/pattern/error-recovery-strategies/]
- [SOURCE: https://openai.github.io/openai-agents-python/running_agents/]
- [SOURCE: https://arxiv.org/abs/2603.20625]
- [SOURCE: https://tailscale.com/kb/1325/device-web-interface]
- [SOURCE: https://tailscale.com/docs/border0/architecture-and-concepts]

## Assessment
- newInfoRatio: 0.40
- Novelty justification: waiting-bar affordance, recovery-card mapping onto native auto_retry events, and the browser-fallback row are new consolidations; reference failure and recovery patterns are cited prior art.
- Confidence: high.

## Reflection
- What worked: mapping Pi's *native* retry events to the error-classification model — the substrate already exists.
- What failed / ruled out: silent retry loops; retrying side-effecting tools without ledger receipts; requiring the native client for the fallback surface.
- Ruled out: any UX that can present "frozen" as a state.

## Recommended Next Focus
Final breadth pass: convergence telemetry + coverage audit across all 8 axes — identify any remaining thin spot, then prepare synthesis.

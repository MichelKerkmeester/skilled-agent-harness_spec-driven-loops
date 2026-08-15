# Iteration 8: Axis 6 — Background Sessions and Starting New Work While Away

## Focus
Design how far unattended operation can go within the posture: relay-supervised detached sessions (no connected client), and starting new work from the phone. Prior art: Claude Code headless + bypass flag, tmux vs systemd supervision, Copilot's async cloud agent + Agents panel.

## Findings

### F1. The reference's unattended mode = permission bypass (rejected pattern)
- Claude Code headless (`-p`) for CI pairs with `--dangerously-skip-permissions`; the docs label it "use with caution" and recommend an explicit `--allowedTools` allowlist as the safer alternative ([SOURCE: docs.anthropic.com/en/docs/claude-code/cli-usage]).
- Implication: unattended execution in the reference world is either unsafe (bypass) or prompt-suppression via allowlists that are not revalidated at execution time (iteration 6 finding). Pi must refuse both and substitute policy-bounded leases.

### F2. Supervision semantics: tmux is not a supervisor; systemd is
- tmux/screen give interactive persistence but are not production supervision; a detached tmux server exits when no programs remain ([SOURCE: github.com/tmux/tmux/wiki/Getting-Started]).
- systemd's model: `Restart=on-failure` (restart on crash/nonzero exit, not on clean exit), `RestartSec` anti-flap backoff, `WatchdogSec` + sd_notify health checks ([SOURCE: github.com/systemd/systemd/blob/main/man/systemd.service.xml]).
- Implication: the relay (003 supervisor) should adopt on-failure restart + backoff + health pings; never auto-restart a cleanly stopped session.

### F3. Copilot async agent: cloud-VM delegation with a mission-control panel
- Assign a task; the agent runs in an ephemeral GitHub Actions VM; monitor via the Agents panel; review the draft PR ([SOURCE: docs.github.com], [SOURCE: github.blog/news-insights/product-news/agents-panel-launch-copilot-coding-agent-tasks-anywhere-on-github/]).
- Implication: the async *pattern* (start → walk away → check panel → review) is proven; its substrate (cloud VM, PR-shaped, GitHub-bound) is what Pi's local tailnet posture replaces.

## Design: Axis 6 deliverables

### Unattended execution = policy-bounded, never bypassed
- A session is "detached" when zero clients are connected; the 003 child keeps running and the relay keeps supervising (this is already 003 SC-001: socket disconnect does not own Pi process lifetime — the reference's terminal-close death and ~10-min-outage exit are avoided by construction).
- While unattended, every protected action still mints a lease (006). The decider is either (a) a pre-authorized grant from the axis-4 allow-list (window-bounded, digest-bound) or (b) **no one** → the lease expires per risk-class timeout and the run **parks** in a `needs_input` state (`run.parked` event), resumable on return. There is no auto-approve path and no bypass mode: unattended reach = the pre-authorized grant surface, nothing more.
- `run.parked` semantics: the child pauses at the approval boundary (not killed), transcript records the parked lease, attention class `needs_input` fires (axis 3), and a `finished`/`error` attention event fires if a supervised run crashes while away.

### Supervision events (relay-owned)
- `session.supervise`: `{sessionOpaqueId, action: restart|backoff|watchdogFired, attempt, reason}` — on-failure restart with `RestartSec`-style backoff; clean stop never restarts; health ping failures surface as `error` attention + stale marker in the session list (axis 5 card).
- Crash safety: 003 durable replay + snapshots mean a restarted child reconciles the transcript; the PWA sees the interruption + replay floor, never a silently blended state (005 REQ-002 semantics).

### Starting new work while away
- `session.create` mutation from the PWA: requires authenticated app session (004), a biometric-confirmed user gesture (foreground authority — a background SW cannot create sessions), and a workspace selected **only from the host-registered workspace set** (pairing-time registered roots; no arbitrary path input — 005 REQ-004).
- The create card carries: prompt text, workspace picker (registered roots only), "unattended policy" selector — default `park-on-needs_input`, optional `apply active grants` (axis 4 rules visible and editable before launch), and a policy summary preview.
- New session = fresh 003 child + epoch 0; attention events, transcript, and approvals flow exactly like an attended session; the session list shows it immediately (axis 5).
- Honesty boundary: Pi cannot execute arbitrary unattended work (no bypass); with pre-authorized grants it covers the Copilot "bounded task" cases locally — same async pattern, no cloud VM, exact-action revalidation at every step.

### Why this exceeds the reference
- Reference: unattended = bypass flag or prompt suppression; session dies with the terminal; async = cloud VM + PR shape.
- Pi: unattended = bounded, lease-revalidated policy grants with guaranteed parking (never silent auto-execution); sessions survive disconnects by construction (003); async start-from-phone works on registered workspaces with the same lease ledger as attended work. "How far background can go": as far as the pre-authorized grant surface — and everything else parks visibly instead of failing silently or bypassing.

## Sources Consulted
- [SOURCE: https://docs.anthropic.com/en/docs/claude-code/cli-usage]
- [SOURCE: https://github.com/tmux/tmux/wiki/Getting-Started]
- [SOURCE: https://github.com/systemd/systemd/blob/main/man/systemd.service.xml]
- [SOURCE: https://docs.github.com/en/enterprise-cloud@latest/copilot/concepts/about-assigning-tasks-to-copilot]
- [SOURCE: https://github.blog/news-insights/product-news/agents-panel-launch-copilot-coding-agent-tasks-anywhere-on-github/]
- [SOURCE: specs/cli-external-orchestration/041-pi-remote-mobile-agent-like-cc/003-relay-protocol-and-state/spec.md]

## Assessment
- newInfoRatio: 0.75
- Novelty justification: park-on-needs_input semantics, supervision events, and registered-workspace session.create are new; headless-bypass rejection and systemd supervision model consolidate prior art.
- Confidence: high on prior art; design maps to 003/004/006 contracts.

## Reflection
- What worked: making "unattended reach" a *defined quantity* (the pre-authorized grant surface) instead of a mode toggle.
- What failed / ruled out: permission bypass for unattended runs (rejected pattern F1); tmux-style "just keep it detached" (no restart/health semantics); auto-approve-on-lease-expiry (never).
- Ruled out: arbitrary path input for new workspaces from the phone (005 REQ-004 violation).

## Recommended Next Focus
Axis 7: onboarding/pairing simpler than install-Tailscale + tailnet-membership + app-auth-ticket.

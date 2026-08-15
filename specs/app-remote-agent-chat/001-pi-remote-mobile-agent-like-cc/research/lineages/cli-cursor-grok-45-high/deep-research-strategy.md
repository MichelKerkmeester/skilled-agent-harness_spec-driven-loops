---
title: Deep Research Strategy — Claude-app-style mobile client for pi RPC
description: Detached fan-out lineage (cli-cursor-grok-45-high) researching mobile PWA client design over pi --mode rpc via Tailscale Serve / WebSocket relay.
trigger_phrases:
  - "pi rpc mobile client research"
  - "claude-app-style pi remote"
importance_tier: normal
contextType: research
version: 1.0.0
---

# Deep Research Strategy - Session Tracking Template

## 1. OVERVIEW

### Purpose

Detached fan-out lineage researching a Claude-app-parity mobile web/PWA client driven by `pi --mode rpc` (JSONL over stdin/stdout) exposed through a relay (Tailscale Serve or WebSocket bridge). Forced-depth: 4 iterations; `stopPolicy: max-iterations`; early convergence is telemetry only.

### Usage

- **Init:** Seeded from parent charter plus official Pi RPC/JSON docs and local cli-pi contract pin.
- **Per iteration:** Read Next Focus, gather evidence, write iteration-NNN.md + delta, append JSONL.
- **Owner:** Lineage workflow refreshes machine-owned sections after each iteration.

---

## 2. TOPIC

Design of a custom Claude-app-style mobile client for the pi coding agent driven by `pi --mode rpc` (JSONL protocol) exposed through a relay (Tailscale Serve or WebSocket bridge) to a mobile web app/PWA, with Claude-app UX parity: session list, chat bubbles, streaming, tool activity, approvals, push notifications.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [ ] What RPC command/event surface must the mobile client and relay implement?
- [ ] How should session list / switch / fork / clone map onto Claude-app session UX when RPC has no list_sessions command?
- [ ] Which transport (Tailscale Serve HTTPS proxy vs dedicated WebSocket bridge) best fits mobile streaming + reconnect?
- [ ] How do streaming deltas, tool activity, and extension UI approvals map to mobile chat/tool/approval UI?
- [ ] How should push notifications and steering/abort/queue UX be implemented over the relay?
- [ ] Q1: What RPC command/event surface must the mobile client and relay implement?
- [ ] Q2: How should session list / switch / fork / clone map onto Claude-app session UX when RPC has no list_sessions command?
- [ ] Q3: Which transport (Tailscale Serve HTTPS proxy vs dedicated WebSocket bridge) best fits mobile streaming + reconnect?
- [ ] Q4: How do streaming deltas, tool activity, and extension UI approvals map to mobile chat/tool/approval UI?
- [ ] Q5: How should push notifications and steering/abort/queue UX be implemented over the relay?

<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS

- Do NOT implement the mobile client or relay in this research lineage.
- Do NOT modify Pi upstream, cli-pi skill code, or parent research packet files.
- Do NOT touch any path outside `specs/cli-external-orchestration/001-pi-remote-mobile-agent-like-cc/research/lineages/cli-cursor-grok-45-high`.
- Do NOT treat early convergence as a stop (max-iterations policy).

---

## 5. STOP CONDITIONS

- `maxIterations` (4) reached — forced-depth policy; convergence before that is telemetry only.
- Escalation: 3+ consecutive failures, state corruption, or all approaches exhausted with questions remaining.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
[None yet]

<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
[None yet]

<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
[None yet]

<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
[No exhausted approach categories yet]

<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
[None yet]

<!-- /ANCHOR:ruled-out-directions -->

---

<!-- ANCHOR:divergence-frontier -->
## 10A. SATURATED DIRECTIONS AND DIVERGENCE FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Saturated: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

<!-- /ANCHOR:divergence-frontier -->

---

<!-- ANCHOR:carried-forward-open-questions -->
## 11A. CARRIED-FORWARD OPEN QUESTIONS
[None yet]

<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
Follow up on: **Transport recommendation finalized under max-iterations charter.** Default: Tailscale Serve HTTPS → local WS relay → `pi --mode rpc` for tailnet-only phones with auto TLS. Required mitigations: heartbeat/ping, expon...

<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT

- resource-map.md not present; skipping coverage gate.
- Parent charter (read-only): `specs/cli-external-orchestration/001-pi-remote-mobile-agent-like-cc/research/deep-research-strategy.md` — Q1–Q10 covering protocol, sessions, transport, security, UX, streaming, push, stack, reconnect, roadmap.
- Local contract: `.opencode/skills/cli-external-orchestration/cli-pi/references/cli-reference.md` confirms Print vs JSON vs RPC trichotomy; RPC is persistent JSONL over stdin/stdout; live pin Pi 0.84.1 available.
- Official docs: https://pi.dev/docs/latest/rpc and https://pi.dev/docs/latest/json.
- Node note from RPC docs: prefer `AgentSession` / `rpc-client.ts` for in-process TS; subprocess RPC for language-agnostic relays.

### Bounded Context Snapshot

- Source pointers: cli-pi SKILL + cli-reference; pi.dev RPC/JSON docs; Tailscale Serve CLI docs.
- Reuse candidates: existing fanout lineage packet shape under sibling deep-research lineages; Pi RPC extension UI sub-protocol for approvals/notify.
- Integration points: relay must spawn/supervise `pi --mode rpc`, multiplex JSONL to WebSocket clients, handle extension_ui_request/response round-trips.
- Constraints: write-containment to this lineage dir only; LEAF (no sub-dispatch); max 12 tool calls/iteration.

---

## 13. RESEARCH BOUNDARIES

- Max iterations: 4
- Convergence threshold: 0.02 (telemetry only under max-iterations stopPolicy)
- Per-iteration budget: 12 tool calls, 15 minutes
- Progressive synthesis: true
- research.md ownership: workflow-owned canonical synthesis output
- Current generation: 1
- Started: 2026-08-10T06:01:00Z
- Session: fanout-cli-cursor-grok-45-high-1786341668505-k2xc4h

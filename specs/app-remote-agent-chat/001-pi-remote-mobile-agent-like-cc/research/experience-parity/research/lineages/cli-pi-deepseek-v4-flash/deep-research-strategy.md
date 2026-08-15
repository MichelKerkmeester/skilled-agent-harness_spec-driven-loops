---
title: Deep Research Strategy - Pi Remote Experience Parity (cli-pi deepseek-v4-flash lineage)
description: Session tracking for the detached fan-out lineage investigating the 042 remote-experience charter against the 041 architecture.
version: 1.14.0.19
---

# Deep Research Strategy - Session Tracking Template

## 2. TOPIC

Design the best-in-class remote-control experience for the Pi coding agent: a private mobile client that pairs with Pi like the Claude Code + Claude mobile app but must EXCEED it, without abandoning the loopback-relay / tailnet-only / foreground-authority / redaction security posture. For each of 8 experience axes, deliver a concrete relay event schema, PWA UX pattern, security-preserving mechanism, and prior-art comparison plus what makes it demonstrably better than anything shipping.

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)

- [ ] q1-transcript: What relay event schema + PWA rendering vocabulary deliver streaming text, extended thinking, TODO/plan lists, tool-call inputs + file-edit diffs, tool results, token/cost — reading like Claude Code or better?
- [ ] q2-approval: How to make phone tool approval low-friction while keeping exact-action parameter binding (canonical digest + lease CAS)?
- [ ] q3-notifications: How to make notifications actionable-as-pull (bounded needs_input/finished/error attention class deep-linking to the approval) without leaking decision content — resolving the content-free-push contradiction?
- [ ] q4-allowlist: How to bind a scoped accept-edits / session allow-list to the lease/CAS model as convenience without bypass?
- [ ] q5-sessionlist: How to make the session list browsable and renamable under opaque-id/redaction constraints?
- [ ] q6-background: How far can background sessions and starting new work while away go within the security posture?
- [ ] q7-onboarding: How to make onboarding/pairing simpler than install-Tailscale + tailnet-membership + app-auth-ticket?
- [ ] q8-concurrency: What single-host multi-session concurrency model fits one relay with N session children?
<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS

- NOT implementing the 041 packet phases; research output only.
- NOT relaxing the security posture: loopback-only relay behind tailnet-only Tailscale Serve (Funnel disabled), short-lived app sessions + one-use WS tickets, foreground authority for mutations, redaction before live/durable boundaries, generic content-free push hints.
- NOT redesigning Pi core, the RPC framing, or the epoch/store internals; designs must map onto the existing 003/004/005/006/007 contracts.
- NOT writing production code, tests, or migration plans.

---

## 5. STOP CONDITIONS

- 20 iterations completed (hard stop, stopPolicy=max-iterations). Convergence before that is telemetry only; broaden review angles instead of synthesizing early.
- Unrecoverable state corruption.
- Security concern in findings (proprietary code or credentials discovered) — escalate, do not persist secrets.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- [x] q1-transcript: transcript.* vocabulary, LSP diffs, per-turn usage, seq-anchored search (iterations 2,3,12,18)
- [x] q2-approval: tiered friction, digest chips, lease expiry, glance submission (iterations 4,15,17)
- [x] q3-notifications: attention classes, opaque pointers, local-cache + fetch-on-open (iterations 5,13,14,19)
- [x] q4-allowlist: policy-backed leases inside the CAS ledger (iterations 6,8,17)
- [x] q5-sessionlist: two-layer identity, device-local labels (iterations 7,16,18)
- [x] q6-background: grant-bounded unattended reach + parking (iterations 8,10,14,19)
- [x] q7-onboarding: one-QR pairing ceremony (iterations 9,20)
- [x] q8-concurrency: workspace write leases, per-session isolation (iterations 10,17)
<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
- Vendor-docs-first search + fetch of the reference product's remote-control page: pinned exact pairing/approval/limit facts (iteration 1)
- Treating stream-json as community-maintained protocol, not official spec (iteration 1)
- Comparing three event vocabularies (stream-json, Messages API blocks, OpenCode envelope) made capability gaps obvious (iteration 2)
- Designing the schema as a table of kinds mapping to 003 envelope fields (iteration 2)
- Fetching the live Pi RPC docs: relay's job is classify+redact+re-emit, not vocabulary invention (iteration 3)
- Mining the reference's documented failure issues (mobile prompt non-render) as design requirements (iteration 4)
- Reframing the push contradiction as a local-state + fetch-on-open two-channel problem (iteration 5)
- Asking 'who is the decider?' — policy as an audited decider inside the CAS ledger (iteration 6)
- Borrowing Tailscale's identity/name separation for sessions (iteration 7)
- Defining unattended reach as the pre-authorized grant surface (iteration 8)
- Asking 'which step can the QR ceremony absorb?' — two steps (iteration 9)
- Naming isolation layers explicitly (organizational/workspace/resource) (iteration 10)
- Per-design verdict table against frozen risk classes (iteration 11)
<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
- Devin as mobile-UX prior art: cloud-VM product with no phone-control layer (iteration 1)
<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
[none yet]
<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
[none yet]
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
[none yet]
<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
COMPLETE — synthesis written to research.md (2026-08-12); stopReason maxIterationsReached; 8/8 questions answered.
<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT

### 041 Architecture Anchor (read from 041 phase specs)

- **003 relay-protocol-and-state**: strict LF-delimited `pi --mode rpc` framing; one persistent Pi RPC child per active session; immutable stream epochs with epoch/sequence ordering; durable redacted envelopes persist-before-broadcast; replay floors, snapshots, gap detection, duplicate suppression; mutation ledger with principal/session/clientMutationId/digest CAS returning recorded outcomes or indeterminate; workspace-scoped session catalog using opaque client identifiers; bounded queues/payloads with a reserved control lane.
- **004 auth-and-tailnet-boundary**: loopback-only relay binding behind tailnet-only Tailscale Serve (Funnel disabled); short-lived application sessions; one-use WebSocket tickets; exact-Origin validation; default-deny action policy; revocation disconnects sockets and prevents reuse; metadata-only observability.
- **005 mobile-pwa-and-reconciliation**: installable foreground PWA; session cards, connection state, thread hydration, streamed message/tool rendering, explicit run controls; epoch-sequenced relay envelopes reconcile connection/mutation/run/message/tool/approval/queue state; offline read-only redacted cache with timestamped cache; host-private data stays server-side (opaque IDs, redacted metadata, no browser-supplied paths).
- **006 approval-and-remote-mutation**: pinned final-pre-execution Pi extension recomputes a canonical action digest immediately before protected execution; one relay-authorized lease consumed per approval; exactly one current decision settles a lease via atomic version/CAS (first valid authorized responder wins, races denied); lease expiry, revocation, epoch invalidation, metadata-only audit; mutation kill switch defaults off, command families enabled one at a time.
- **007 push-and-platform-hardening**: generic opaque notification hints only after committed server transitions; push carries only an opaque lookup identifier + generic category (no transcript/tool/workspace/approval/path/decision data); opening a hint reauthenticates, revalidates revocation + current epoch, then renders live server state before any action; declared iOS Home Screen + Android rows for install, kill/restart, stale hints, Focus/permission states.
- **042 charter**: 4 identified "feel" gaps vs Claude Code+mobile: inverted (content-free, non-actionable) notification loop, no low-friction approval mode, opaque session list, no interaction/visual design layer. Goal: exceed, not merely match.

### Resource Map

resource-map.md not present at 042 root; skipping coverage gate. (042 contains only spec.md + research/; 041 phase specs are the architecture inventory above.)

### Bounded Context Snapshot

- Source pointers: `specs/cli-external-orchestration/041-pi-remote-mobile-agent-like-cc/{001..009}/spec.md`; `specs/cli-external-orchestration/042-pi-remote-experience-parity/spec.md`; `pi --mode rpc` (pi CLI, current workspace).
- Reuse candidates: 041 phase specs (003 relay/envelope schemas, 006 approval extension contract, 007 push hint contract, 005 PWA rendering), this repo's existing `sk-prompt`, `system-deep-loop` runtime.
- Integration points: 041 phase 005 (PWA), 006 (approval), 007 (push) are the amendment targets for the experience designs.
- Constraints and risks: all designs must preserve default-deny authority, redaction before remote/durable boundaries, foreground authority for mutations; push must remain content-free per 007 REQ-001; approval must remain exact-action per 006 REQ-002/SC-001.

---

## 13. RESEARCH BOUNDARIES

- Max iterations: 20 (stopPolicy: max-iterations; convergenceThreshold 0.02 is telemetry only)
- Per-iteration budget: 12 tool calls, 30 minutes
- Progressive synthesis: true
- research.md ownership: executor-owned canonical synthesis output (detached lineage)
- Lifecycle branches: new (this run); resume/restart available
- Machine-owned sections: strategy sections 3, 6-11A maintained by the executor (reducer disabled for nested lineage dir)
- Canonical pause sentinel: research/.deep-research-pause (not used in detached mode)
- Current generation: 1
- Started: 2026-08-12T06:04:00Z

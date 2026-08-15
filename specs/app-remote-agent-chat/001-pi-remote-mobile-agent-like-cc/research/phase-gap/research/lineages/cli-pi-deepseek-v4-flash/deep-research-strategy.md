---
title: Deep Research Strategy — Pi Remote Phase-Gap Research (fanout lineage cli-pi-deepseek-v4-flash)
description: Session tracking for the adversarial gap-analysis deep research loop over the nine planned 041 Pi Remote phases.
trigger_phrases:
  - "pi remote phase gap strategy"
  - "pi remote missed requirements"
importance_tier: normal
contextType: planning
---

# Deep Research Strategy — Pi Remote Phase-Gap Research

## 2. TOPIC
Adversarially find what the planned Pi Remote packet MISSES. For each of the nine phases under `specs/cli-external-orchestration/041-pi-remote-mobile-agent-like-cc/` identify (a) missing requirements, (b) underspecified mechanisms, (c) internal contradictions / cross-phase inconsistencies, (d) untestable or unfalsifiable acceptance criteria, (e) unhandled edge cases and failure modes, (f) security or privacy holes. Rank gaps by severity, map each to its phase, propose a concrete remediation (a REQ or ADR to add). Product: private installable PWA remote-controlling Pi over a Tailscale tailnet, loopback-relay/tailnet-only/foreground-authority/redaction posture.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
Generated from the reducer registry. Add external or late questions through `{spec_folder}/research/inbox.jsonl`; direct edits are imported as compatibility input and may be replaced on the next reduce step.

- [ ] KQ-1: Which mechanisms are NAMED but not DEFINED (containment primitive, Serve identity signal, SQLite/migration choice, diff-truth model, reconnect reconciliation corner cases)?
- [ ] KQ-2: Which acceptance criteria are untestable or unfalsifiable (no threshold, no objective check, no exit-status contract)?
- [ ] KQ-3: Which edge cases and failure modes are unhandled (crash points, TOCTOU/races, offline/stale, multi-device, revocation, key rotation, push platform limits, iOS)?
- [ ] KQ-4: Which security or privacy holes remain in the loopback/tailnet/foreground/redaction posture?
- [ ] KQ-5: Which internal contradictions or cross-phase inconsistencies exist between the nine phase specs and ADR-002?
<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS
- Not re-planning or implementing any phase; findings only.
- Not validating the correctness of Pi's own RPC protocol internals beyond what the specs claim.
- Not researching the full Claude Code mobile feature set for parity beyond what the parent spec (041/spec.md) already scopes.
- Not producing remediation implementation; only REQ/ADR proposals.

---

## 5. STOP CONDITIONS
- maxIterations (5) reached — the loop runs all iterations regardless of convergence telemetry per the fan-out orchestration override.
- State corruption that cannot be reconstructed from JSONL.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- KQ-1 (partial, iter 1): envelope sync.* schemas, diff-truth projection, causedBy cardinality are named but undefined — remediations proposed as 003 REQ-010/011/016.
- KQ-5 (partial, iter 1): approval.decide channel conflicts with 003 commands-never-replayed invariant (006 REQ-014); revocation not coupled to epoch bump (003 REQ-013).
- KQ-1 (partial, iter 2): Serve identity signal mechanism undefined (ADR-005 proposed); device-key rotation absent (004 REQ-018).
- KQ-3 (partial, iter 2): QR TTL/partial enrollment (REQ-017), ticket renewal (REQ-020), iOS push limits (REQ-021).
- KQ-4 (partial, iter 2): loopback local spoofing (ADR-005), lock-screen activity leak (REQ-021).
- KQ-1 (partial, iter 3): containment primitive (ADR-007), passkey credential ownership (ADR-008).
- KQ-3 (partial, iter 3): lease expiry/drain/restart (REQ-024), kill-switch in-flight (REQ-025), grant invalidation (REQ-026).
- KQ-2 (partial, iter 3): containment escape tests and hook-order assertion unfalsifiable (F3.1/F3.2).
- KQ-2 (complete, iter 4): fail-closed vocabulary (REQ-029), evidence schema (REQ-030), performance targets (REQ-031), doc-testing (REQ-032), matrix completeness (REQ-033), crash-point outcomes (REQ-034), universal-quantifier claims (REQ-035).
- KQ-1 (complete, iter 5): all named-but-undefined mechanisms now have remediations (ADR-004/005/006/007/008 + REQ-010/011/016/020/023/024).
- KQ-3 (complete, iter 5): offline cache (REQ-036), retention/expiry (REQ-039), multi-device races (REQ-041), backup/lockout (REQ-040).
- KQ-4 (complete, iter 5): redaction closure (REQ-037), catalog minimization (REQ-038), offline-cache privacy (REQ-036), lock-screen (REQ-021), local spoofing (ADR-005).
<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
- Tracing each named mechanism (sync.*, content index, epoch, causedBy, redaction metadata) to its consumers in later phases exposed gaps a per-phase read misses (iter 1)
- Reading 004 + 007 as one device-lifecycle system (enrollment → rotation → revocation → push) rather than separate phases surfaced the enrollment-key rotation gap and missing multi-device surface (iter 2)
- Testing each 006 claim ('fails on the target host', 'assert handler ordering', 'rows pass') for implementer executability exposed the unfalsifiable core (iter 3)
- Treating every acceptance criterion as 'what exact command/assertion proves this?' systematically exposed slogan-criteria (iter 4)
- Consolidated ranking exposed the phase gap distribution: 006=11, 004=9, 003=8 of 35; 008 is a downstream-completeness phase, not a mechanism phase (iter 5)
<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
- No executable Pi source to verify the actual envelope shape; findings are contract-level only (iter 1)
- Tailscale Serve header specifics not verifiable locally; mechanism remediation left at ADR level (iter 2)
- Containment primitives are host-OS-specific; without the 001 supported-host decision, remediation stays conditional (iter 3)
- The 'every bypass path' inventory is itself a missing bounded artifact — flagged as required rather than enumerated (iter 4)
- No live Pi/Tailscale environment to empirically confirm iOS push specifics; flagged as platform rows for 001/007 rather than resolved (iter 5)
<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
[None yet]
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

## 11. NEXT FOCUS
Synthesis: compile research.md from all 5 iterations with the consolidated 35-gap ranking, eliminated-alternatives table, and divergence map.
<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT
### Bounded Context Snapshot
- Subject: `specs/cli-external-orchestration/041-pi-remote-mobile-agent-like-cc/` — parent spec.md (183 lines) + nine child phase specs (001:273, 002:225, 003:276, 004:276, 005:233, 006:280, 007:225, 008:193, 009:277 lines).
- ADR-002 (001/decision-record.md:137-197): Relay Node + Hono/Fastify + ws + better-sqlite3; Client Vite + vite-plugin-pwa + React 19 + Untitled UI React (React Aria + Tailwind) + XState + TanStack Virtual; Push web-push/VAPID; Approval step-up WebAuthn/passkeys; shared pi-rpc-protocol + reducers TS core.
- Phase requirements inventoried with exact line numbers (001:105-117, 002:106-118, 003:106-120, 004:105-120, 005:109-126, 006:106-122, 007:105-118, 009:105-119; 008 is Level 2 with P0 REQ-001..003 at lines ~105-107).
- Prior research: 041/research/ lineages exist (cli-pi-deepseek-v4-flash, cli-pi-gpt-56-sol, cli-cursor-grok-45-high) covering the original 20-iteration design research. This 043 loop is the adversarial gap pass over the PLANNED phases, not a repeat of the design research.
- resource-map.md not present in 043 spec folder; skipping coverage gate.

---

## 13. RESEARCH BOUNDARIES
- Max iterations: 5 (from config)
- Convergence threshold: 0.02 (from config; telemetry-only per fan-out override — always run to maxIterations)
- Per-iteration budget: 12 tool calls, 10 minutes
- Progressive synthesis: true (default)
- research/research.md ownership: workflow-owned canonical synthesis output
- Lifecycle branches: `new` (this lineage)
- Machine-owned sections: reducer controls Sections 3, 6, 7-11A
- Canonical pause sentinel: `research/.deep-research-pause`
- Current generation: 1
- Started: 2026-08-12T12:45:04Z

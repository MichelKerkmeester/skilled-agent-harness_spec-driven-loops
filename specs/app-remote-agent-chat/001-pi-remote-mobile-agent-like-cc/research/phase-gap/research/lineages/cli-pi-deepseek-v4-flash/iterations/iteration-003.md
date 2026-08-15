# Iteration 3: Approval, Containment, and Remote Mutation — the Containment Primitive and TOCTOU/Race Semantics

## Focus
Audit 006 (approval/containment/remote mutation) and the 002 security-harness lane: the containment primitive (named but undefined), TOCTOU/CAS race semantics in approval leases, kill-switch behavior, accept-edits grant edge cases, extension hook finality, and audit metadata. Target gap classes (b) underspecified mechanisms, (d) untestable criteria, (e) failure modes.

## Actions Taken
- Read 006 spec fully: REQ-001..008 (006/spec.md:106-111, 117-119), scope (final-pre-execution extension, leases, kill switch), risk matrix R-001 escape, R-002 canonicalization mismatch (006/spec.md §6).
- Read 002 REQ-002 (deterministic crash points), REQ-003 (security tests fail closed), scope chaos lane (002/spec.md:106-108, 114).
- Read 003 REQ-003 (mutation ledger, indeterminate outcomes) and REQ-005 (bounds/reserved control lane) as the state layer approval rides on (003/spec.md:108, 116).
- Cross-checked ADR-002 WebAuthn/passkeys step-up (001/decision-record.md:155).

## Findings

### F3.1 — The containment primitive is named but never defined; "containment" without an OS mechanism is unfalsifiable [P0, 006]
006 REQ-003 requires "Workspace, filesystem, process, credential, UID, and network escape tests fail on the target host", and 006 scope names `deploy/pi-remote/containment/` — but NO requirement, ADR, or open question names the actual containment mechanism on the target host (macOS sandbox-exec/seatbelt? container? separate UID + seccomp? a restricted token? network namespace?). The parent open question (041/spec.md §4) asks "which containment primitive" but no phase owns the decision. Without a named primitive, REQ-003's escape tests cannot be written (what is an "escape"?) and the acceptance criterion is unfalsifiable — "fails on the target host" presupposes the primitive exists. Remediation: add ADR-007 to 006: "Pin the first containment primitive for the supported host (e.g. macOS seatbelt sandbox-exec profile + dedicated UID + read-only workspace bind + no-network default) with its version, and make 006 REQ-003's escape tests defined against that primitive's boundary semantics; add a decision gate that any alternative primitive requires a new ADR."

### F3.2 — TOCTOU window between digest computation and execution is asserted, not proven; extension hook finality is unverifiable [P0, 006]
006 REQ-001 says "the final handler recomputes tool name and canonical arguments and rejects mismatch" — this is the classic TOCTOU mitigation, but the plan does not define: (a) what happens when the recomputed digest differs from the approved digest (deny — presumably — but is the divergence logged with the delta?), (b) the extension hook ORDER (is the Pi extension the LAST hook before tool execution, and how is "last" asserted against Pi's extension loading? 006 risk R-001 "Pi extension hook ordering and integrity: Gate may not be final"), and (c) whether the extension itself can be bypassed by a different tool path (e.g. a tool that shells out to the same binary without going through the protected-tool gate). "Assert handler ordering and fail closed on drift" (R-001 mitigation) is a plan to test, not a mechanism. Remediation: add REQ-023 to 006: "The approval extension records its position in Pi's extension chain and refuses to run if any later mutation-capable hook exists or ordering drift is detected; digest mismatch logs the field-level diff to the metadata-only audit; a negative control proves a second tool path that bypasses the gate is denied (002 lane)."

### F3.3 — Lease/CAS semantics lack timeout, drain, and restart-recovery contracts [P0, 006]
006 REQ-002 "atomic version/CAS semantics accept the first valid authorized responder", REQ-007 includes "expiry", and REQ-008 accept-edits grants include "expiry" — but no requirement defines: lease default TTL and max TTL, what happens at expiry with an in-flight tool (does the tool get killed mid-write?), the drain path for open leases at relay shutdown (REQ-005 kill switch), and restart recovery when the relay crashes between lease grant and tool completion (the 003 REQ-003 mutation ledger records "indeterminate" — but the lease state must be reconciled with it). A user approving then losing connectivity mid-tool is a first-class mobile scenario (005 REQ-003 indeterminate states) that 006 never addresses end-to-end. Remediation: add REQ-024 to 006: "Leases carry default/max TTL and a post-expiry kill/drain contract for in-flight approved tools; relay restart reconciles open leases against the mutation ledger and marks survivors indeterminate (ties to 003 REQ-003); a crash test in the 002 chaos lane asserts no silent execution after expiry."

### F3.4 — Kill switch is a boolean with no partial-disable semantics; command-family gating lacks an ordering contract [P1, 006]
006 REQ-005 "server-side kill switch defaults off; command families enable one at a time only after their auth, crash, approval, containment, and redaction rows pass" — but there is no definition of: kill-switch granularity (global boolean vs per-family), what "rows pass" means operationally (a persisted policy version? a signed policy document?), how an in-flight approved action is handled when the switch flips (drain vs immediate kill — F3.3 overlap), and whether enablement requires operator re-approval after any policy/version change. The parent 009 release staging (three stages: read-only → protected mutation → push) implies progressive enablement but 006 does not define the state machine connecting per-command rows to 009 stage gates. Remediation: add REQ-025 to 006: "Policy is a versioned signed document with per-command-family enable flags; kill switch is global-off and per-family; flipping any flag while a lease is in flight follows the drain contract of REQ-024; 009 stage gates consume the same policy version as the enablement evidence."

### F3.5 — Accept-edits grant lacks a per-use confirmation boundary, deny-precedence test, and remaining-action semantics [P1, 006]
006 REQ-008 mints "exactly one one-action lease per use under the same digest and CAS validation, with deny precedence, a remaining-action count, and expiry" — but the spec never defines: what counts as "one action" for a multi-file edit (one tool invocation = one action, or one file = one action?), what happens to the grant when the session ends/epoch bumps mid-grant, and the exact UX for "deny precedence" when a user both grants and denies (race between user gestures on a touch screen). "Remaining-action count" implies user-visible state in the 005 Session surface, but 005 REQ-008's IA has no element for grant state; the Review surface is "fetched approvals and policy" but not grant lifecycle. Remediation: add REQ-026 to 006: "One action = one protected-tool invocation with a defined input-boundary (a multi-file edit tool counts once unless configurable); grants are invalidated by epoch bump, session end, and revocation; the Session/Review surface renders grant state (remaining count, expiry); browser tests assert deny-beats-grant under rapid double-tap."

### F3.6 — Audit metadata has no retention, no query contract, and no tamper-evidence requirement [P1, 006]
006 REQ-006 requires approval audit "queryable without raw arguments" — but no requirement defines audit retention bounds (003 REQ-002 has retention floors for replay; audit is separate), a query interface (the 004 read-only API? a separate endpoint?), or tamper-evidence (append-only ledger? signed hash chain?). Since the relay store is SQLite (ADR-002), the audit lives in the same DB as the mutation ledger — the requirement never states whether audit rows are part of the same transactional ledger (003 REQ-003) or a separate table with its own durability. Remediation: add REQ-027 to 006: "Audit rows are append-only, retention-bounded, and hash-chained per device+epoch; they share the mutation-ledger transaction boundary; the query surface is the 004 read-only API with paging and no raw-argument projection."

### F3.7 — WebAuthn/passkey step-up is an unowned orphan: no phase requirement owns enrollment, recovery, or failure fallback [P0, 001/ADR-002 + 006]
ADR-002 (001/decision-record.md:155) lists "Approval step-up: WebAuthn/passkeys" but NO phase spec has a requirement owning it: 006 REQ-001..008 never mention passkeys, 004 REQ-006 enrollment uses device keys, and no phase covers passkey recovery (lost authenticator = permanently locked approvals?), fallback when passkeys are unavailable on the device, or the authorization relationship between the enrollment key and the passkey. The user story US-001 in 006 ("foreground authorized operator can approve one exact protected action") presumes an operator identity that the phase specs never define as a distinct credential. Remediation: add ADR-008 to 006 (or REQ-028): "Define the two-credential model (device enrollment key authenticates transport; WebAuthn passkey authenticates approval step-up), with passkey recovery, per-device fallback policy, and a phase-004/006 split of ownership; 006 REQ-007's approval flow names which credential authorizes approval.decide."

## Questions Answered
- KQ-1: containment primitive (F3.1), passkey ownership (F3.7).
- KQ-3 (partial): lease expiry/drain/restart (F3.3), kill-switch in-flight semantics (F3.4), grant invalidation (F3.5).
- KQ-2 (partial): containment escape-test unfalsifiability (F3.1), hook-order "assert" as untestable (F3.2).

## Questions Remaining
- KQ-2 remainder (threshold-less criteria across 001/002/009), KQ-3 remainder (offline/stale, multi-device races), KQ-4 remainder (redaction/privacy, offline cache) — iterations 4-5.

## Next Focus
Iteration 4: Testability audit — untestable/unfalsifiable acceptance criteria and threshold-less criteria across 001, 002, 009 (and 008 docs), plus the 002 harness's ability to actually prove them.

## Sources Consulted
- [SOURCE: specs/cli-external-orchestration/041-pi-remote-mobile-agent-like-cc/006-approval-and-remote-mutation/spec.md:106-111,117-119]
- [SOURCE: specs/cli-external-orchestration/041-pi-remote-mobile-agent-like-cc/002-automated-test-harness/spec.md:106-108,114]
- [SOURCE: specs/cli-external-orchestration/041-pi-remote-mobile-agent-like-cc/003-relay-protocol-and-state/spec.md:108,116]
- [SOURCE: specs/cli-external-orchestration/041-pi-remote-mobile-agent-like-cc/001-contract-and-threat-baseline/decision-record.md:155]
- [SOURCE: specs/cli-external-orchestration/041-pi-remote-mobile-agent-like-cc/spec.md §4]

## Assessment
- newInfoRatio: 0.8 — the containment-primitive and lease-lifecycle axes are net-new; some overlap with iteration 1 (approval channel, F1.5) avoided by focusing on lease/CAS mechanics.
- Confidence: high for F3.1-F3.5 (spec-grounded); medium-high for F3.6-F3.7 (partly inferred from absence).

## Reflection
What worked: testing each 006 claim ("fails on the target host", "assert handler ordering", "rows pass") for whether an implementer could actually execute it exposed the unfalsifiable core (containment primitive, hook finality, policy "rows").
What failed: containment primitives are host-OS-specific; without the 001 supported-host decision, remediation stays conditional on host.
Ruled out: not specifying macOS seatbelt as the mandatory answer — the gap is that the decision must be owned, not a particular choice.

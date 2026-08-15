# Deep Research Synthesis — Pi Remote Phase-Gap Analysis (Lineage: cli-pi-deepseek-v4-flash)

> Fan-out lineage of the 043-pi-remote-phase-gap-research adversarial pass. 5 iterations, no early convergence (stopPolicy max-iterations). Subject: the nine planned phases under `041-pi-remote-mobile-agent-like-cc/`.

## 1. Research Topic

Adversarially find what the planned Pi Remote packet MISSES: absent requirements, underspecified mechanisms, contradictions, untestable criteria, unhandled edge cases/failure modes, and security/privacy holes — ranked by severity, mapped to phases, with concrete REQ/ADR remediations. Product: a private installable PWA remote-controlling Pi over a Tailscale tailnet with a loopback-relay/tailnet-only/foreground-authority/redaction posture.

## 2. Method

Five single-focus iterations over the nine phase specs (001-009) plus ADR-002 and the parent phase map:

| Iter | Angle | Phases audited | Findings |
|------|-------|----------------|----------|
| 1 | Typed envelope / sync.* / diff-truth / reconciliation | 003, 005, 006, 007 | 7 (F1.1-F1.7) |
| 2 | Auth/tailnet boundary + device lifecycle | 004, 007, 001 | 7 (F2.1-F2.7) |
| 3 | Approval / containment / mutation | 006, 002, 003 | 7 (F3.1-F3.7) |
| 4 | Testability / falsifiability | 001, 002, 008, 009 | 7 (F4.1-F4.7) |
| 5 | Privacy sweep + consolidation | 005, 003, 006, 007, 008 | 7 (F5.1-F5.7) |

Every finding is grounded in spec text with file:line citations; every finding carries a concrete remediation (a new REQ id or ADR).

## 3. Key Findings Summary (35 gaps, ranked)

### P0 — Blocks a stated success criterion or enables a boundary breach (19)

| # | Gap | Phase | Remediation |
|---|-----|-------|-------------|
| 1 | Serve identity signal mechanism undefined; loopback binding does not stop a local process from spoofing | 004 REQ-007 | ADR-005: unix-socket/peer-credential + per-deployment ephemeral secret |
| 2 | `sync.delta`/`sync.snapshot`/`sync.gap` named but never defined as message schemas | 003 REQ-006 | REQ-010 |
| 3 | Diff-truth model undefined: monotonic envelopes vs. mutable draft→terminal replacement | 003 REQ-002/006 + 005 REQ-001 | REQ-011 (003) / REQ-010 (005) |
| 4 | Reconnect snapshot-apply vs. live-delta interleaving race | 005 REQ-002 | REQ-012: coversThrough barrier |
| 5 | `approval.decide` channel conflicts with "commands never replayed as events" | 003 REQ-006 + 006 REQ-007 | REQ-014: decide=command channel; requested/result=envelope |
| 6 | Redaction metadata schema + render-safe approval-card representation absent | 003 REQ-006 + 006 REQ-007 | ADR-004/REQ-015 |
| 7 | Containment primitive named but never defined; escape tests unfalsifiable | 006 REQ-003 | ADR-007 |
| 8 | TOCTOU digest recompute + extension hook finality asserted, not proven | 006 REQ-001 | REQ-023 |
| 9 | Lease/CAS lack TTL, expiry kill/drain, restart reconciliation | 006 REQ-002/007/008 | REQ-024 |
| 10 | WebAuthn/passkey step-up is an unowned orphan credential system | 001 ADR-002 + 006 | ADR-008/REQ-028 |
| 11 | QR ceremony lacks challenge TTL, host→device mutual auth, partial-enrollment recovery | 004 REQ-006 | REQ-017 |
| 12 | Device-key rotation absent (only push-subscription rotation covered) | 004 REQ-006 + 007 REQ-003 | REQ-018 + ADR-006 |
| 13 | One-use tickets lack TTL, renewal, reconnect semantics | 004 REQ-002 | REQ-020 |
| 14 | Multi-device concurrent steering has no serialization/precondition vocabulary | 005 REQ-003 + 006 REQ-002 | REQ-041 |
| 15 | Offline read-only cache has no retention/eviction/revocation-clear contract | 005 REQ-005 | REQ-036 |
| 16 | Redaction boundary list not closed (devtools, crash dumps, OS backups missed) | 006 REQ-004 | REQ-037 |
| 17 | "Fail closed" used everywhere with no defined closed state or observable | 002 REQ-003 + all | REQ-029 |
| 18 | Crash points enumerated but outcome vocabulary undefined | 002 REQ-002 | REQ-034 |
| 19 | 009 performance criteria name metrics but no targets | 009 REQ-005 | REQ-031 |

### P1 — Required before release (15)

| # | Gap | Phase | Remediation |
|---|-----|-------|-------------|
| 20 | Epoch bump never coupled to revocation/lease invalidation | 003+004+007 | REQ-013 |
| 21 | causedBy cardinality / eligibility-flag lifecycle undefined | 003 REQ-006 | REQ-016 |
| 22 | No multi-device management surface (inventory, per-device revocation, remote-kill) | 004+005 | REQ-019 |
| 23 | iOS push limits unquantified; lock-screen attention class is a covert activity signal | 007 REQ-001/004 | REQ-021 |
| 24 | Origin allowlist scope incomplete; `Origin: null` and PWA scope unhandled | 004 REQ-002 + 005 | REQ-022 |
| 25 | Kill switch boolean with no partial-disable or in-flight semantics | 006 REQ-005 + 009 | REQ-025 |
| 26 | Accept-edits grant lacks one-action boundary, epoch invalidation, deny-beats-grant race | 006 REQ-008 + 005 | REQ-026 |
| 27 | Audit metadata lacks retention, query contract, tamper-evidence | 006 REQ-006 | REQ-027 |
| 28 | REQ-090 "version-pinned evidence" has no schema, mechanism, or validation gate | 001/002/009 REQ-090 | REQ-030 |
| 29 | Doc commands "tested on the target host" without a machine-executable contract | 008 REQ-001/003 | REQ-032 |
| 30 | Supported-matrix rows have no completeness contract | 001 REQ-004 + 007 REQ-004 | REQ-033 |
| 31 | Universal-quantifier SC claims ("every bypass path", "no hidden blocker") unfalsifiable | 001/002/009 SC | REQ-035 |
| 32 | Session catalog data minimization unspecified beyond opaque ids | 003 + 005 REQ-004 | REQ-038 |
| 33 | Retention floors have no defaults/max; replay/ledger/cache never reconciled | 003 REQ-002 + 006 + 005 | REQ-039 |
| 34 | Backup/restore ownership undefined; restore-to-new-host device-key lockout | 003 + 008 + 009 | REQ-040 |

### P2 — Completeness (1)

| # | Gap | Phase | Remediation |
|---|-----|-------|-------------|
| 35 | No incident playbooks for the new failure classes (indeterminate mutation, lease expiry, lockout, sync-barrier stall) | 008 | REQ-042 |

## 4. Phase-Level Distribution

| Phase | Findings | Dominant gap class |
|-------|----------|--------------------|
| 001 contract/threat baseline | 4 | (d) unfalsifiable claims, matrix completeness, evidence schema |
| 002 test harness | 2 | (d) fail-closed vocabulary, crash-point outcome enum |
| 003 relay/protocol/state | 8 | (b) sync.* schemas, diff-truth, causedBy, retention, backup, catalog |
| 004 auth/tailnet | 6+3 shared | (b)+(f) Serve identity, QR ceremony, rotation, tickets, Origin |
| 005 mobile PWA | 2+2 shared | (e) reconnect race, offline cache, multi-device steering |
| 006 approval/mutation | 9+2 shared | (b)+(f) containment, TOCTOU, leases, passkeys, redaction, audit |
| 007 push/platform | 2 | (e)+(f) iOS limits, lock-screen leak, rotation |
| 008 documentation | 1 | (d)+(a) machine-testable runbooks, incident content |
| 009 release | 1+2 shared | (d) performance targets, stage-gate linkage |

Observation: 006 carries the mechanism-dense core (11 of 35), 004 the trust-boundary core (9), 003 the state-model core (8). 008 is a downstream-completeness phase, not a mechanism phase.

## 5. Cross-Cutting Themes

1. **Named-but-undefined mechanisms** are the largest gap family (13 of 35): sync.* schemas, diff-truth projection, Serve identity signal, containment primitive, redaction metadata schema, causedBy lifecycle, precondition vocabulary, ticket renewal, crash-outcome enum, evidence envelope, retention table, backup scope, cache TTL. Each needs a REQ or ADR, not more prose.
2. **Unfalsifiable acceptance criteria** cluster in 001/002/009 (9 of 35): "fails closed", "asserted durable outcome", "measured", "checked", "every bypass path", "no hidden blocker" — none defines the observable or threshold.
3. **Two credential systems with no defined relationship**: device enrollment keys (004) vs. WebAuthn/passkeys (ADR-002) — authorization ownership, recovery, fallback are unowned.
4. **Multi-device semantics are assumed but never specified**: concurrent steering (F5.6), device inventory/revocation surface (F2.4), approval CAS is the only race the plan addresses.
5. **Retention/privacy surfaces are enumerated per-phase, never reconciled**: replay floor (003), ledger/audit (006), client cache (005), OS backups (F5.2) have no single policy.

## 6. Recommendations

1. Adopt the 19 P0 remediations before phase 004 (auth) and phase 006 (approval) implementation; they are mechanism-definition dependencies, not polish.
2. Add REQ-029/REQ-034/REQ-030 to the 002 harness first — the harness is the evidence backbone every other phase consumes.
3. Resolve the credential-model ADR (ADR-008) before 004 enrollment work: the device-key/passkey relationship changes the QR ceremony.
4. Add the coversThrough barrier (REQ-012) to 003 before 005 reconnect work — it is the ordering contract that makes 005 REQ-002 testable.
5. Treat the consolidated table in §3 as the amendment backlog for the 041 phase specs; each row maps to a new REQ id or ADR.

## 7. Sources and Evidence

All 35 findings carry `[SOURCE: file:line]` citations in `iterations/iteration-00N.md`. Key sources:

- [SOURCE: specs/cli-external-orchestration/041-pi-remote-mobile-agent-like-cc/003-relay-protocol-and-state/spec.md:106-120]
- [SOURCE: specs/cli-external-orchestration/041-pi-remote-mobile-agent-like-cc/004-auth-and-tailnet-boundary/spec.md:105-120]
- [SOURCE: specs/cli-external-orchestration/041-pi-remote-mobile-agent-like-cc/005-mobile-pwa-and-reconciliation/spec.md:109-126]
- [SOURCE: specs/cli-external-orchestration/041-pi-remote-mobile-agent-like-cc/006-approval-and-remote-mutation/spec.md:106-122]
- [SOURCE: specs/cli-external-orchestration/041-pi-remote-mobile-agent-like-cc/007-push-and-platform-hardening/spec.md:105-118]
- [SOURCE: specs/cli-external-orchestration/041-pi-remote-mobile-agent-like-cc/001-contract-and-threat-baseline/spec.md:105-117]
- [SOURCE: specs/cli-external-orchestration/041-pi-remote-mobile-agent-like-cc/001-contract-and-threat-baseline/decision-record.md:137-197]
- [SOURCE: specs/cli-external-orchestration/041-pi-remote-mobile-agent-like-cc/002-automated-test-harness/spec.md:106-118]
- [SOURCE: specs/cli-external-orchestration/041-pi-remote-mobile-agent-like-cc/008-documentation-and-runbooks/spec.md §3-4]
- [SOURCE: specs/cli-external-orchestration/041-pi-remote-mobile-agent-like-cc/009-release-verification-and-rollout/spec.md:105-119]
- [SOURCE: specs/cli-external-orchestration/041-pi-remote-mobile-agent-like-cc/spec.md §2-4]

## 8. Eliminated Alternatives

| Approach | Reason Eliminated | Evidence | Iteration(s) |
|----------|-------------------|----------|--------------|
| Relying on Tailscale network position alone for identity | Loopback binding does not stop local-process spoofing; "strip client headers" is insufficient without a verified boundary mechanism | F2.1; 004 REQ-007 | 2 |
| A per-surface redaction list (replay/snapshot/catalog/logs/audit/cache/push/test artifacts) | List is not closed; misses devtools, crash dumps, OS backups; redaction must be one canonical function | F5.2; 006 REQ-004 | 5 |
| Letting the client merge snapshot + live deltas by arrival order | Produces duplicate/missing content on reconnect; requires a coversThrough barrier contract instead | F1.3; 005 REQ-002 | 1 |
| Treating approval.decide as part of the typed event exchange | Conflicts with 003's commands-never-replayed-as-events invariant; decide must ride the command channel | F1.5; 003 REQ-006 vs 006 REQ-007 | 1 |
| "Document the iOS limits" as the push acceptance criterion | Documentation is not a functional criterion; needs explicit supported rows + fallback (Attention Inbox) + privacy default | F2.6; 007 REQ-004 | 2 |
| A boolean global kill switch as the mutation disable mechanism | No partial-disable, no in-flight drain, no link to 009 stage gates; needs versioned signed policy | F3.4; 006 REQ-005 | 3 |
| Assuming a single-credential model (enrollment key OR passkey) | Two credential systems exist in the plan with no relationship; needs an explicit two-credential ADR | F3.7; 001 ADR-002 + 006 | 3 |

## 9. Divergence Map

- Completed pivots: 0 (loop ran to maxIterations per fan-out override; convergence treated as telemetry)
- Failed pivots: 0
- Audited overrides: 0
- Saturated directions: none (each iteration used a distinct angle; no re-entry)
- Pivot lineage: none
- Remaining frontier: cross-lineage merge with cli-devin-glm-5-2-max may surface additional angles (e.g. Pi RPC internals, Tailscale Serve specifics) not verifiable in this lineage without a live environment

## 10. Open Questions (for operator decision, not research gaps)

1. Which target host OS / containment primitive does the operator adopt first (blocks ADR-007 and 001 REQ-004)?
2. Do the 19 P0 remediations get adopted as new REQs in the 041 phase specs before implementation starts?
3. Which iOS rows are genuinely testable for push (blocks REQ-021 completeness)?
4. Which ADRs (004-008) are accepted, and in which order?

## 11. Convergence Report

- Stop reason: maxIterationsReached (5/5; convergence treated as telemetry per orchestration override)
- Total iterations: 5
- Questions answered: 4 / 5 key questions (KQ-1..4 resolved; KQ-5 partial — no remaining research question in scope; operator decisions remain)
- Last 3 iteration summaries: run 3: approval/containment (0.80) → run 4: testability (0.75) → run 5: privacy/consolidation (0.70)
- Convergence threshold: 0.02 (telemetry-only; all iterations ran)
- newInfoRatio trend: 0.90 → 0.85 → 0.80 → 0.75 → 0.70 — monotonic decrease with breadth broadening, consistent with 5 distinct angles
- Divergence summary: no divergent pivots; 5 sequential angles, all productive

---

*Generated by deep-research fan-out lineage cli-pi-deepseek-v4-flash (session fanout-cli-pi-deepseek-v4-flash-1786538556326-03f2d8). Canonical synthesis for this lineage; parent-level merge consolidates across lineages.*

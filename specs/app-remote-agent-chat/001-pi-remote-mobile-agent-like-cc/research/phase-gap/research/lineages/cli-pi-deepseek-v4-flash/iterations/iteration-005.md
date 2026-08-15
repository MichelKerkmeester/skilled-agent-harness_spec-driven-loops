# Iteration 5: Privacy/Security Sweep and Consolidated Missing-Requirement Ranking

## Focus
Final iteration: (1) privacy/security sweep of remaining gap classes — redaction determinism and boundaries, offline cache privacy, retention/expiry, backup/restore of relay+device state, session-catalog data minimization; (2) consolidate the 28 findings across iterations 1-4 into a severity-ranked gap list mapped to phases, and (3) identify any phase with zero findings (a "clean" phase that deserves a second look). Target gap classes (a) missing requirements, (e) edge cases, (f) privacy holes.

## Actions Taken
- Re-read 005 REQ-004 (host-private data stays server-side), REQ-005 (offline stale/read-only) and scope offline cache (005/spec.md:112, 121).
- Re-read 003 REQ-002 retention floors + REQ-003 mutation ledger (003/spec.md:107-108) and 006 REQ-004 canary redaction (006/spec.md:109).
- Re-read 007 REQ-001/005 payload bounds and subscription storage "encrypted" (007/spec.md:105, 108, scope).
- Re-read 001 REQ-002 (retention bounds) and 008 REQ-002 (docs without secrets) (001/spec.md:106, 008 §4).
- Consolidated registry findings across iterations 1-4 for ranking.

## Findings

### F5.1 — The offline read-only cache is a durable copy of redacted transcripts with no deletion/expiry contract [P0, 005+003]
005 REQ-005 requires "timestamped redacted offline read-only cache" and REQ-004 says host-private data "stays server-side" — but no requirement defines: cache retention (forever? per-session TTL? LRU by size?), cache eviction on revocation (007 REQ-002 revalidates on open, but a revoked device's cached copy survives in local storage until opened — the data is already on the phone), cache size bounds (003 REQ-005 bounds server storage; the client cache is unbounded), or user-facing cache clearing. The claim "host-private data stays server-side" is therefore only true of the server's copy; the redacted cache on the phone is a privacy surface the plan never bounds. Remediation: add REQ-036 to 005: "The offline cache has a size bound and per-entry TTL, is cleared on revocation notification, logout, and epoch-change-tombstone, and exposes a visible cache-management action; cache contents are the redacted render representation only, never raw tool inputs/outputs or file diffs beyond the redacted form."

### F5.2 — Redaction determinism is asserted (006 REQ-004 canary) but the boundary list is not closed; snapshot/audit/push paths differ [P0, 006+003+007]
006 REQ-004 enumerates "replay, snapshots, catalog, logs, audit, cache, push inputs, and test artifacts" — but "test artifacts" and "logs" are open sets, and the enumeration misses: browser devtools network capture (the WS frames carry redacted envelopes — is the redacted form itself considered safe for a third-party proxy? It should be), crash dumps, service-worker storage, notification permission state, and OS-level backups (iOS/Android backup the app's storage). Redaction must be a single canonical function (F1.6, iter 1) applied at the persistence boundary, not a per-surface list. Remediation: add REQ-037 to 006 (superseding the list style): "Redaction is one canonical function with a fixed placeholder grammar applied at every persistence/egress boundary (server, cache, push, logs, crash dumps, OS backups); the canary suite (006 REQ-004) runs against each boundary with the boundary list versioned; any new boundary requires a canary row."

### F5.3 — Session catalog data minimization is unspecified; opaque ids are named but the catalog's non-id fields are not [P1, 003]
003 scope names a "workspace-scoped session catalog using opaque client identifiers" — but no requirement defines what non-opaque metadata the catalog may hold (workspace name? path? last activity timestamp? which are redaction-sensitive host paths per 005 REQ-004 "browser-supplied filesystem paths are rejected"). 005 REQ-004 says session CARDS use "opaque IDs and redacted metadata" but the catalog is the server-side twin; without a field-level catalog schema, an implementer could store workspace paths and session titles, which are host-private. Remediation: add REQ-038 to 003: "The session catalog schema is field-level defined with an allowlist of redacted metadata (opaque id, epoch, timestamps, attention class, redacted title) and an explicit deny list (paths, env, credentials, raw args); catalog schema changes require 001 consumer review."

### F5.4 — Retention floors (003 REQ-002) have no default, no maximum, and no expiry-consistency rule with audit (006) and cache (005) [P1, 003+006+005]
003 REQ-002 mentions "retention floors" and 001 REQ-002 "retention bounds" — but no requirement sets the floor/min or a maximum, defines the interaction between replay retention and the mutation ledger (does the ledger outlive the replay floor? — it must, for audit), or defines what happens to approvals/attention events when their source envelopes are pruned (006 approval.result is an envelope event; pruning it breaks the audit trail F3.6). The three retention regimes (replay, ledger/audit, client cache) are never reconciled. Remediation: add REQ-039 to 003: "A single retention policy table (replay floor ≤ ledger/audit retention ≤ cache TTL) with explicit defaults, a maximum, and a pruning rule that never deletes mutation-ledger or audit rows referenced by live approvals; pruning tombstones envelope ids per F1.7."

### F5.5 — No requirement covers backup/restore of the relay store (device keys, policy, ledger) — 008/009 mention backup but no phase owns it [P1, 003+008+009]
008 REQ-001 includes "backup, restore" runbooks and 009 REQ-004 rollback includes "database restore/down-migration" — but no phase requirement defines: what is backed up (the SQLite store: replay? ledger? device keys? push subscriptions?), backup encryption and key custody, backup frequency, restore-into-new-host semantics (device keys are bound to the host fingerprint from 004 REQ-006 — restoring to a new machine breaks enrollment), and the interaction between restore and epoch/revocation state. A lost host with a restored DB but no device keys is a lockout scenario the plan never addresses. Remediation: add REQ-040 to 003: "Backup scope is defined (ledger, policy, device-key material, push subscriptions; replay optional), encrypted with a key outside the store, and restore-to-new-host re-runs enrollment with epoch bump; 008 runbook and 009 rollback drill consume the same restore procedure."

### F5.6 — Multi-device concurrent mutation races are unhandled beyond approval CAS; two devices steering one session has no ordering rule [P0, 005+006]
006 REQ-002 CAS resolves approval races ("first valid authorized responder"), but no requirement defines concurrent STEERING (005 REQ-003 prompt/steer/follow-up/abort) from two devices: which prompt wins, is there a session-level write lock, does the epoch/sequence model serialize client commands (003 REQ-006 commands carry "idempotency keys and preconditions" — the precondition vocabulary is undefined), and what does the second device's UI show when its steer is superseded? The parent promise "match and exceed Claude Code + mobile pairing" implies multi-device, and 004 REQ-006 revokes per-device — but the concurrent-command ordering is never specified. Remediation: add REQ-041 to 005: "Client commands are serialized per session by the relay with a precondition vocabulary (idle / running / awaiting_approval); the second device's command is queued, rejected with a typed reason, or coalesced per command family; the UI renders the superseded state distinctly (005 REQ-003 indeterminate states extended)."

### F5.7 — Phase 008 (documentation) has zero gap findings from iterations 1-3; its risks are testability (F4.4) only — a documentation-completeness gap: no documented incident model for the NEW failure classes [P2, 008]
Every other phase accumulated mechanism/security gaps; 008 received only F4.4 (testability). The substantive 008 gap is content-side: the phase lists runbooks (setup, start, stop, monitor, revoke, rotate, backup, restore, incident, rollback — 008 scope) but the NEW failure classes this product introduces — indeterminate mutations (003 REQ-003), lease-expiry kills (F3.3), revoked-device lockouts (F5.5), sync.gap/snapshot-barrier stalls (F1.1/F1.3) — have no named incident playbooks and no severity triage. "Incident runbooks" is a section title, not a requirement. Remediation: add REQ-042 to 008: "One runbook per new failure class (indeterminate mutation, approval timeout/expiry, device revocation, sync-barrier stall, restore-after-loss), each with detection signal, operator action, rollback path, and escalation; the class list is derived from the 003/006 failure vocabularies (REQ-034 outcome enum)."

## Consolidated Gap Ranking (28 findings + 7 this iteration = 35)

Ranking rubric: P0 = blocks a stated SC or enables a boundary breach; P1 = required before release but deferrable within a phase; P2 = completeness.

| # | Severity | Gap (finding) | Phase(s) | Remediation |
|---|----------|---------------|----------|-------------|
| 1 | P0 | Serve identity mechanism undefined; loopback spoofing (F2.1) | 004 | ADR-005 |
| 2 | P0 | sync.* schemas undefined (F1.1) | 003 | REQ-010 |
| 3 | P0 | Diff-truth projection undefined (F1.2) | 003/005 | REQ-011/REQ-010 |
| 4 | P0 | Reconnect snapshot/delta ordering race (F1.3) | 005 | REQ-012 |
| 5 | P0 | approval.decide channel contradiction (F1.5) | 003/006 | REQ-014 |
| 6 | P0 | Redaction schema + render-safe approval card (F1.6) | 006 | ADR-004/REQ-015 |
| 7 | P0 | Containment primitive undefined (F3.1) | 006 | ADR-007 |
| 8 | P0 | TOCTOU/hook-finality unproven (F3.2) | 006 | REQ-023 |
| 9 | P0 | Lease TTL/drain/restart (F3.3) | 006 | REQ-024 |
| 10 | P0 | Passkey step-up unowned (F3.7) | 006 | ADR-008/REQ-028 |
| 11 | P0 | QR ceremony TTL/mutual-auth (F2.2) | 004 | REQ-017 |
| 12 | P0 | Device-key rotation absent (F2.3) | 004/007 | REQ-018+ADR-006 |
| 13 | P0 | Ticket TTL/renewal (F2.5) | 004 | REQ-020 |
| 14 | P0 | Multi-device concurrent steering (F5.6) | 005/006 | REQ-041 |
| 15 | P0 | Offline cache retention/eviction (F5.1) | 005/003 | REQ-036 |
| 16 | P0 | Redaction boundary list not closed (F5.2) | 006/003/007 | REQ-037 |
| 17 | P0 | Fail-closed vocabulary undefined (F4.1) | 002/all | REQ-029 |
| 18 | P0 | Crash-point outcome vocabulary (F4.6) | 002 | REQ-034 |
| 19 | P0 | 009 performance targets missing (F4.3) | 009 | REQ-031 |
| 20 | P1 | Epoch/revocation coupling (F1.4) | 003/004/007 | REQ-013 |
| 21 | P1 | causedBy/eligibility lifecycle (F1.7) | 003 | REQ-016 |
| 22 | P1 | Multi-device management surface (F2.4) | 004/005 | REQ-019 |
| 23 | P1 | iOS push limits + lock-screen leak (F2.6) | 007 | REQ-021 |
| 24 | P1 | Origin allowlist/null-Origin (F2.7) | 004/005 | REQ-022 |
| 25 | P1 | Kill-switch partial-disable semantics (F3.4) | 006/009 | REQ-025 |
| 26 | P1 | Accept-edits one-action boundary (F3.5) | 006/005 | REQ-026 |
| 27 | P1 | Audit retention/tamper-evidence (F3.6) | 006 | REQ-027 |
| 28 | P1 | REQ-090 evidence schema (F4.2) | 001/002/009 | REQ-030 |
| 29 | P1 | Doc commands machine-testable (F4.4) | 008/009 | REQ-032 |
| 30 | P1 | Supported-matrix completeness (F4.5) | 001/007/009 | REQ-033 |
| 31 | P1 | Universal-quantifier SC claims (F4.7) | 001/002 | REQ-035 |
| 32 | P1 | Session catalog data minimization (F5.3) | 003/005 | REQ-038 |
| 33 | P1 | Retention-policy reconciliation (F5.4) | 003/006/005 | REQ-039 |
| 34 | P1 | Backup/restore ownership + lockout (F5.5) | 003/008/009 | REQ-040 |
| 35 | P2 | Incident runbooks for new failure classes (F5.7) | 008 | REQ-042 |

## Questions Answered
- KQ-3: completed — offline cache (F5.1), retention/expiry (F5.4), multi-device races (F5.6), backup/lockout (F5.5) join earlier crash/TOCTOU findings.
- KQ-4: completed — redaction boundary closure (F5.2), catalog minimization (F5.3), offline-cache privacy (F5.1), lock-screen (F2.6), local spoofing (F2.1).
- KQ-1: completed — all named-but-undefined mechanisms now have remediations (ADR-004/005/006/007/008 + REQ-010/011/016/020/023/024).

## Questions Remaining
- None unresolved within this lineage's scope. Cross-lineage merge (GLM-5.2-max) may surface additional angles; open questions that remain are operator decisions (which ADRs to adopt, target hosts), not research gaps.

## Next Focus
Synthesis: compile research.md from all 5 iterations with the consolidated ranking, eliminated-alternatives table, and divergence map.

## Sources Consulted
- [SOURCE: specs/cli-external-orchestration/041-pi-remote-mobile-agent-like-cc/005-mobile-pwa-and-reconciliation/spec.md:112,121]
- [SOURCE: specs/cli-external-orchestration/041-pi-remote-mobile-agent-like-cc/003-relay-protocol-and-state/spec.md:107-108]
- [SOURCE: specs/cli-external-orchestration/041-pi-remote-mobile-agent-like-cc/006-approval-and-remote-mutation/spec.md:109]
- [SOURCE: specs/cli-external-orchestration/041-pi-remote-mobile-agent-like-cc/007-push-and-platform-hardening/spec.md:105,108]
- [SOURCE: specs/cli-external-orchestration/041-pi-remote-mobile-agent-like-cc/001-contract-and-threat-baseline/spec.md:106]
- [SOURCE: specs/cli-external-orchestration/041-pi-remote-mobile-agent-like-cc/008-documentation-and-runbooks/spec.md §3-4]

## Assessment
- newInfoRatio: 0.7 — final sweep adds 7 findings (offline-cache privacy, redaction closure, catalog minimization, retention reconciliation, backup/lockout, multi-device steering, incident-runbook content gap); consolidation itself is the synthesis input.
- Confidence: high for F5.1-F5.6; medium for F5.7 (content-completeness judgment).

## Reflection
What worked: the consolidated ranking exposed the phase distribution — 006 carries 11 of 35 gaps (mechanism-dense), 004 carries 9, 003 carries 8; 008 carries only 2, confirming it is a downstream-completeness phase rather than a mechanism phase.
What failed: no live Pi/Tailscale environment to empirically confirm iOS push specifics; flagged as platform rows for 001/007 rather than resolved here.
Ruled out: not adding remediations to 009 beyond performance targets (F4.3) and stage-gate linkage (F3.4) — 009 is a verification phase, and its gaps are inherited from earlier phases' unfalsifiable criteria (F4.1/F4.7).

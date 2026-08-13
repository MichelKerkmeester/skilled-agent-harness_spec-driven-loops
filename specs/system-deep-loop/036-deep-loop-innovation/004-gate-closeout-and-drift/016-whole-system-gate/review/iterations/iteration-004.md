# Iteration 004 — correctness

- Executor: cli-codex gpt-5.6-sol effort=high service_tier=fast sandbox=read-only
- Completed: 2026-07-30T06:06:44.593Z
- New findings: 4 (of 4 reported; prior total 10)
- Coverage: {"filesExamined":47,"keyPaths":[".opencode/skills/system-deep-loop/runtime/lib/receipts-and-effect-recovery/effect-gateway.ts",".opencode/skills/system-deep-loop/runtime/lib/receipts-and-effect-recovery/authorized-writer.ts",".opencode/skills/system-deep-loop/runtime/lib/receipts-and-effect-recovery/boundary-receipts.ts",".opencode/skills/system-deep-loop/runtime/lib/dispatch-receipts/dispatch-barrier.ts",".opencode/skills/system-deep-loop/runtime/lib/dispatch-receipts/resume-projection.ts",".opencode/skills/system-deep-loop/runtime/lib/replay-fingerprint/replay-fingerprint-attestation.ts",".opencode/skills/system-deep-loop/runtime/lib/replay-fingerprint/verify-replay-fingerprint.ts",".opencode/skills/system-deep-loop/runtime/lib/result-envelopes/resume-reducer.ts",".opencode/skills/system-deep-loop/runtime/lib/result-envelopes/recorder.ts",".opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/append-only-ledger.ts"]}

## Summary
Examined the four exactly-once boundary packages, their principal tests, and the authorized-ledger append semantics they depend on. Initial dispatch ownership is handled conservatively, but recovery ownership and operator resolution are only serialized within one gateway instance, leaving concrete cross-process double-execution paths. Replay attestation publication has a separate check-then-append race that breaks exact-retry convergence. Dispatch resume can also label caller-asserted result evidence as ledger-authoritative without reading that result from the ledger.

## Findings
- [P1] F-004-01 Concurrent recovery callers can both execute the same unresolved effect @ .opencode/skills/system-deep-loop/runtime/lib/receipts-and-effect-recovery/effect-gateway.ts:615
  - evidence: The gateway appends the deterministic recovery-started event but discards the append result. Independent gateway instances can both calculate the same attempt and recovery ID; one append returns appended and the other idempotent, yet both continue through lines 617-657. If both reconciliation queries observe not_applied before either mutation completes, both call #executeAdapter. The #withLock map at lines 1285-1297 is instance-local and therefore does not elect a cross-process owner.
  - recommendation: Use the recovery-started append as the durable ownership election: only the appended winner may reconcile and execute. An idempotent caller should read or wait for the matching reconciled/confirmation event and must not cross the effect boundary. Bind claim consumption to the durable event or an equivalent fenced single-use lease.
- [P1] F-004-02 Conflicting operator decisions can both commit and drive side effects @ .opencode/skills/system-deep-loop/runtime/lib/receipts-and-effect-recovery/effect-gateway.ts:760
  - evidence: resolution_id is derived from recovery_id plus the chosen resolution and evidence digest, so conflicting decisions receive different event IDs. Two gateway instances can both read priorResolutions as empty, append distinct operator-resolved events, and each receive status appended because AuthorizedEvidenceWriter deduplicates only event identity. A terminal_failed caller returns at line 814 while a concurrent confirmed_not_applied caller can continue to lines 826-849 and execute the effect, contradicting the terminal decision.
  - recommendation: Give each recovery one deterministic operator-resolution slot independent of the selected decision, or enforce uniqueness for its idempotency key under the ledger lock. After any lost append race, re-read the winning resolution and reject conflicting facts before reconciliation or execution.
- [P1] F-004-03 Concurrent exact attestation writes do not converge idempotently @ .opencode/skills/system-deep-loop/runtime/lib/replay-fingerprint/replay-fingerprint-attestation.ts:373
  - evidence: recordReplayFingerprintAttestation scans for an existing attestation at lines 373-409 and then directly calls ledger.appendAuthorized at line 423. Two exact writers can both complete the scan before either append. AppendOnlyLedger requires an exact retry to reuse the original authorization decision, so the second caller's independently issued proof is rejected as AUTHORIZATION_ALREADY_USED rather than returning the first durable receipt.
  - recommendation: Publish through the race-aware authorized writer or catch the authorization/head race, re-read the ledger, verify identical descriptor bytes and digest, and return the existing receipt. Derive a stable event identity from the attestation key so the single durable slot is explicit.
- [P1] F-004-04 Resume treats a caller assertion as ledger-authoritative result evidence @ .opencode/skills/system-deep-loop/runtime/lib/dispatch-receipts/resume-projection.ts:203
  - evidence: When input.result is present, validateResult checks only the plain object's verified === true marker, result ID/digest shape, and three receipt-binding strings. The result is never located in verified ledger events, yet lines 214-220 return classification result_recorded with authority ledger. A caller can construct a matching object with an arbitrary result ID and digest and receive a ledger-authoritative recorded-result decision.
  - recommendation: Accept a VerifiedLedgerEvent or an opaque verifier-issued capability, parse the typed result-envelope payload, and verify its digest, event identity, receipt causation, and ledger membership before returning result_recorded. Do not label caller-branded evidence as ledger authority.

## Leaf output (verbatim JSON)
```json
{
  "iteration": 4,
  "dimension": "correctness",
  "summary": "Examined the four exactly-once boundary packages, their principal tests, and the authorized-ledger append semantics they depend on. Initial dispatch ownership is handled conservatively, but recovery ownership and operator resolution are only serialized within one gateway instance, leaving concrete cross-process double-execution paths. Replay attestation publication has a separate check-then-append race that breaks exact-retry convergence. Dispatch resume can also label caller-asserted result evidence as ledger-authoritative without reading that result from the ledger.",
  "findings": [
    {
      "severity": "P1",
      "dimension": "correctness",
      "title": "Concurrent recovery callers can both execute the same unresolved effect",
      "file": ".opencode/skills/system-deep-loop/runtime/lib/receipts-and-effect-recovery/effect-gateway.ts",
      "line": 615,
      "evidence": "The gateway appends the deterministic recovery-started event but discards the append result. Independent gateway instances can both calculate the same attempt and recovery ID; one append returns appended and the other idempotent, yet both continue through lines 617-657. If both reconciliation queries observe not_applied before either mutation completes, both call #executeAdapter. The #withLock map at lines 1285-1297 is instance-local and therefore does not elect a cross-process owner.",
      "recommendation": "Use the recovery-started append as the durable ownership election: only the appended winner may reconcile and execute. An idempotent caller should read or wait for the matching reconciled/confirmation event and must not cross the effect boundary. Bind claim consumption to the durable event or an equivalent fenced single-use lease."
    },
    {
      "severity": "P1",
      "dimension": "correctness",
      "title": "Conflicting operator decisions can both commit and drive side effects",
      "file": ".opencode/skills/system-deep-loop/runtime/lib/receipts-and-effect-recovery/effect-gateway.ts",
      "line": 760,
      "evidence": "resolution_id is derived from recovery_id plus the chosen resolution and evidence digest, so conflicting decisions receive different event IDs. Two gateway instances can both read priorResolutions as empty, append distinct operator-resolved events, and each receive status appended because AuthorizedEvidenceWriter deduplicates only event identity. A terminal_failed caller returns at line 814 while a concurrent confirmed_not_applied caller can continue to lines 826-849 and execute the effect, contradicting the terminal decision.",
      "recommendation": "Give each recovery one deterministic operator-resolution slot independent of the selected decision, or enforce uniqueness for its idempotency key under the ledger lock. After any lost append race, re-read the winning resolution and reject conflicting facts before reconciliation or execution."
    },
    {
      "severity": "P1",
      "dimension": "correctness",
      "title": "Concurrent exact attestation writes do not converge idempotently",
      "file": ".opencode/skills/system-deep-loop/runtime/lib/replay-fingerprint/replay-fingerprint-attestation.ts",
      "line": 373,
      "evidence": "recordReplayFingerprintAttestation scans for an existing attestation at lines 373-409 and then directly calls ledger.appendAuthorized at line 423. Two exact writers can both complete the scan before either append. AppendOnlyLedger requires an exact retry to reuse the original authorization decision, so the second caller's independently issued proof is rejected as AUTHORIZATION_ALREADY_USED rather than returning the first durable receipt.",
      "recommendation": "Publish through the race-aware authorized writer or catch the authorization/head race, re-read the ledger, verify identical descriptor bytes and digest, and return the existing receipt. Derive a stable event identity from the attestation key so the single durable slot is explicit."
    },
    {
      "severity": "P1",
      "dimension": "correctness",
      "title": "Resume treats a caller assertion as ledger-authoritative result evidence",
      "file": ".opencode/skills/system-deep-loop/runtime/lib/dispatch-receipts/resume-projection.ts",
      "line": 203,
      "evidence": "When input.result is present, validateResult checks only the plain object's verified === true marker, result ID/digest shape, and three receipt-binding strings. The result is never located in verified ledger events, yet lines 214-220 return classification result_recorded with authority ledger. A caller can construct a matching object with an arbitrary result ID and digest and receive a ledger-authoritative recorded-result decision.",
      "recommendation": "Accept a VerifiedLedgerEvent or an opaque verifier-issued capability, parse the typed result-envelope payload, and verify its digest, event identity, receipt causation, and ledger membership before returning result_recorded. Do not label caller-branded evidence as ledger authority."
    }
  ],
  "refutations": [],
  "coverage": {
    "filesExamined": 47,
    "keyPaths": [
      ".opencode/skills/system-deep-loop/runtime/lib/receipts-and-effect-recovery/effect-gateway.ts",
      ".opencode/skills/system-deep-loop/runtime/lib/receipts-and-effect-recovery/authorized-writer.ts",
      ".opencode/skills/system-deep-loop/runtime/lib/receipts-and-effect-recovery/boundary-receipts.ts",
      ".opencode/skills/system-deep-loop/runtime/lib/dispatch-receipts/dispatch-barrier.ts",
      ".opencode/skills/system-deep-loop/runtime/lib/dispatch-receipts/resume-projection.ts",
      ".opencode/skills/system-deep-loop/runtime/lib/replay-fingerprint/replay-fingerprint-attestation.ts",
      ".opencode/skills/system-deep-loop/runtime/lib/replay-fingerprint/verify-replay-fingerprint.ts",
      ".opencode/skills/system-deep-loop/runtime/lib/result-envelopes/resume-reducer.ts",
      ".opencode/skills/system-deep-loop/runtime/lib/result-envelopes/recorder.ts",
      ".opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/append-only-ledger.ts"
    ]
  }
}
```
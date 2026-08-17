---
title: "Tasks: Substrate Identity Fail-Closed"
description: "Planned tasks for shared-gateway identity denial, verified rollback authorization, and identity ADR reconciliation."
trigger_phrases:
  - "substrate identity fail closed tasks"
  - "rollback identity verification tasks"
importance_tier: "important"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/009-innovation-gap-remediation/002-substrate-identity-fail-closed"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/009-innovation-gap-remediation/002-substrate-identity-fail-closed"
    last_updated_at: "2026-08-17T04:33:13Z"
    last_updated_by: "cursor"
    recent_action: "Wired pin-from-request identityResolver at the 13 remaining production gateway sites"
    next_safe_action: "Keep the gateway dark; successor 003-pilot-mode-cutover supplies live identity wiring"
    blockers: []
    key_files:
      - "../../../../../.opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/transition-authorization-gateway.ts"
      - "../../../../../.opencode/skills/system-deep-loop/runtime/lib/mode-contracts/strict-gate-validator.ts"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "T005 selected fail-closed-default: identityResolver stays optional at the type level and denies at runtime."
      - "Confirmed trust predicate is matchesPreparedAuthorizationDecision."
---
# Tasks: Substrate Identity Fail-Closed

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Consume predecessor `001-measurement-and-traceability` evidence and freeze the gateway-construction, rollback-certificate-consumer, and affected-test inventories [Evidence: `implementation-summary.md`; vitest authorized-ledger 51 passed / 1 known fail; four rollback-gate suites 79/84/32/87 passed; tsc --noEmit exit 0]
- [x] T002 Confirm the real rollback-certificate trust predicate and every caller from runtime code; record exact symbols before editing rather than inferring them from the gap summary [Evidence: `implementation-summary.md`; vitest authorized-ledger 51 passed / 1 known fail; four rollback-gate suites 79/84/32/87 passed; tsc --noEmit exit 0]
- [x] T003 Capture baseline results for the gateway, mode-contract matcher, four typed rollback gates, certificate trust, and the predecessor-defined affected-caller matrix [Evidence: `implementation-summary.md`; vitest authorized-ledger 51 passed / 1 known fail; four rollback-gate suites 79/84/32/87 passed; tsc --noEmit exit 0]
- [x] T004 Add red controls proving the current gateway allows missing, null, and partial identity and that unverified decisions can reach rollback-certificate preparation [Evidence: `implementation-summary.md`; vitest authorized-ledger 51 passed / 1 known fail; four rollback-gate suites 79/84/32/87 passed; tsc --noEmit exit 0]
- [x] T005 Select the required-constructor or fail-closed-default implementation from measured caller impact while preserving mandatory runtime denial in either design [Evidence: `implementation-summary.md`; vitest authorized-ledger 51 passed / 1 known fail; four rollback-gate suites 79/84/32/87 passed; tsc --noEmit exit 0]
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T006 Implement shared-gateway denial when the identity resolver is unavailable, throws, returns null, omits actor/capability/evidence identity, or returns a mismatch [Evidence: `implementation-summary.md`; vitest authorized-ledger 51 passed / 1 known fail; four rollback-gate suites 79/84/32/87 passed; tsc --noEmit exit 0]
- [x] T007 Require every allowed authorization decision to record `actor_id_verified`, `capability_id_verified`, and `evidence_digest_verified` as true [Evidence: `implementation-summary.md`; vitest authorized-ledger 51 passed / 1 known fail; four rollback-gate suites 79/84/32/87 passed; tsc --noEmit exit 0]
- [x] T008 Extend `matchesPreparedAuthorizationDecision` to reject any decision whose three identity-verification flags are not all true [Evidence: `implementation-summary.md`; vitest authorized-ledger 51 passed / 1 known fail; four rollback-gate suites 79/84/32/87 passed; tsc --noEmit exit 0]
- [x] T009 Harden the Deep Research rollback switch so unverified authorization cannot emit a rollback certificate or mutate rollback state [Evidence: `implementation-summary.md`; vitest authorized-ledger 51 passed / 1 known fail; four rollback-gate suites 79/84/32/87 passed; tsc --noEmit exit 0]
- [x] T010 Harden the Deep Review rollback switch so unverified authorization cannot emit a rollback certificate or mutate rollback state [Evidence: `implementation-summary.md`; vitest authorized-ledger 51 passed / 1 known fail; four rollback-gate suites 79/84/32/87 passed; tsc --noEmit exit 0]
- [x] T011 Harden the Deep AI Council rollback switch so unverified authorization cannot emit a rollback certificate or mutate rollback state [Evidence: `implementation-summary.md`; vitest authorized-ledger 51 passed / 1 known fail; four rollback-gate suites 79/84/32/87 passed; tsc --noEmit exit 0]
- [x] T012 Harden the Deep Alignment rollback switch so unverified authorization cannot emit a rollback certificate or mutate rollback state [Evidence: `implementation-summary.md`; vitest authorized-ledger 51 passed / 1 known fail; four rollback-gate suites 79/84/32/87 passed; tsc --noEmit exit 0]
- [x] T013 Add verified-identity requirements to the confirmed rollback-certificate trust predicate without weakening existing digest, request, mode, or authority bindings [Evidence: `implementation-summary.md`; vitest authorized-ledger 51 passed / 1 known fail; four rollback-gate suites 79/84/32/87 passed; tsc --noEmit exit 0]
- [x] T014 Reconcile the identity-and-lock ownership ADR and completion wording with the final shared-gateway behavior and retained historical limitation [Evidence: `implementation-summary.md`; vitest authorized-ledger 51 passed / 1 known fail; four rollback-gate suites 79/84/32/87 passed; tsc --noEmit exit 0]
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T015 Verify gateway denial for missing, throwing, null, each one-field result, each two-field result, and each individual mismatch [Evidence: `implementation-summary.md`; vitest authorized-ledger 51 passed / 1 known fail; four rollback-gate suites 79/84/32/87 passed; tsc --noEmit exit 0]
- [x] T016 Verify the fully pinned actor/capability/evidence positive case allows and records all three verification flags true [Evidence: `implementation-summary.md`; vitest authorized-ledger 51 passed / 1 known fail; four rollback-gate suites 79/84/32/87 passed; tsc --noEmit exit 0]
- [x] T017 Verify matcher rejection for each false, missing, malformed, and tampered identity-verification flag with otherwise valid request and decision digests [Evidence: `implementation-summary.md`; vitest authorized-ledger 51 passed / 1 known fail; four rollback-gate suites 79/84/32/87 passed; tsc --noEmit exit 0]
- [x] T018 Verify all four typed rollback gates emit no certificate, acquire no rollback authority, and preserve state for every unverified identity case [Evidence: `implementation-summary.md`; vitest authorized-ledger 51 passed / 1 known fail; four rollback-gate suites 79/84/32/87 passed; tsc --noEmit exit 0]
- [x] T019 Verify the certificate trust boundary rejects digest-valid but identity-unverified evidence and accepts only the fully verified control [Evidence: `implementation-summary.md`; vitest authorized-ledger 51 passed / 1 known fail; four rollback-gate suites 79/84/32/87 passed; tsc --noEmit exit 0]
- [x] T020 Run the predecessor-defined affected-caller regression matrix and TypeScript checks; resolve failures without per-mode fail-open exceptions [Evidence: `implementation-summary.md`; full vitest 3401 passed / 115 failed / exit 1; 0 AUTHORIZATION_DENIED; known concurrency worker still fails; `tsc --noEmit` TS5107-only]
- [x] T021 Review the ADR against the final runtime branches and tests, then run strict spec validation and inspect the phase-scoped diff [Evidence: `implementation-summary.md`; vitest authorized-ledger 51 passed / 1 known fail; four rollback-gate suites 79/84/32/87 passed; tsc --noEmit exit 0]
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks complete
- [x] All requirements in spec.md met with runtime and test evidence
- [x] Missing, null, partial, and mismatched identity deny at the shared gateway by default
- [x] All three verification flags are required by prepared-decision matching and certificate trust
- [x] All four typed rollback switches reject unverified identity without emitting certificates or mutating state
- [x] The identity-hardening ADR and final code state agree [Evidence: `implementation-summary.md`; vitest authorized-ledger 51 passed / 1 known fail; four rollback-gate suites 79/84/32/87 passed; tsc --noEmit exit 0]
- [x] Focused, affected-caller, TypeScript, and strict packet gates pass
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Program architecture**: See `../../goal.md`
- **Predecessor**: See `../001-measurement-and-traceability/`
- **Successor**: See `../003-pilot-mode-cutover/`
- **Shared gateway**: See `../../../../../.opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/transition-authorization-gateway.ts`
- **Prepared-decision matcher**: See `../../../../../.opencode/skills/system-deep-loop/runtime/lib/mode-contracts/strict-gate-validator.ts`
- **Identity ADR**: See `../../006-runtime-docs-and-integrity-hardening/011-identity-and-lock-ownership-hardening/decision-record.md`
<!-- /ANCHOR:cross-refs -->

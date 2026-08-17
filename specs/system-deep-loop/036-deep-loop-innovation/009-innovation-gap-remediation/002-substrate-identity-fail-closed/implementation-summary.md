---
title: "Implementation Summary: Substrate Identity Fail-Closed"
description: "Execution evidence for shared-gateway fail-closed identity, verified rollback-certificate trust, and identity ADR reconciliation."
trigger_phrases:
  - "substrate identity fail closed implementation summary"
  - "transition authorization fail closed evidence"
importance_tier: "critical"
contextType: "implementation"
parent: "system-deep-loop/036-deep-loop-innovation/009-innovation-gap-remediation/002-substrate-identity-fail-closed"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/009-innovation-gap-remediation/002-substrate-identity-fail-closed"
    last_updated_at: "2026-08-17T04:04:40Z"
    last_updated_by: "cursor"
    recent_action: "Wired pin-from-request identityResolver at the 13 remaining production gateway sites"
    next_safe_action: "Keep the gateway dark; successor 003-pilot-mode-cutover supplies live identity wiring"
    blockers: []
    key_files:
      - "../../../../../.opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/transition-authorization-gateway.ts"
      - "../../../../../.opencode/skills/system-deep-loop/runtime/lib/mode-contracts/strict-gate-validator.ts"
      - "../../../../../.opencode/skills/system-deep-loop/runtime/lib/rollback-drills/rollback-drill-ledger.ts"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "T005 selected fail-closed-default: identityResolver stays optional at the type level and denies at runtime when missing, throwing, null, partial, or mismatched."
      - "Confirmed trust predicate is matchesPreparedAuthorizationDecision; verifyRollbackDrillCertificate is not the identity trust boundary."
---
# Implementation Summary: Substrate Identity Fail-Closed

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 002-substrate-identity-fail-closed |
| **Completed** | 2026-08-14 |
| **Level** | 2 |
| **Status** | Complete |
| **Authority posture** | Additive-dark; no mode cutover or live authority mutation |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Shared `TransitionAuthorizationGateway` now denies before policy evaluation when identity resolution is missing,
throws, returns null, omits actor/capability/evidence, or mismatches the prepared request. An `allow` decision is
reachable only when all three verification flags are true. `matchesPreparedAuthorizationDecision` rejects any
decision whose flags are not all strictly `true`, and the four typed rollback switches inherit that predicate, so
unverified identity cannot emit a rollback certificate or mutate rollback state. The identity-and-lock ADR now
distinguishes the prior opt-in/fail-open runtime from this fail-closed shared-gateway result.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `runtime/lib/authorized-ledger/transition-authorization-gateway.ts` | Modified | Always check identity; deny unless actor, capability, and evidence independently match |
| `runtime/lib/mode-contracts/strict-gate-validator.ts` | Modified | Require all three verification flags true in prepared-decision matching |
| `runtime/lib/rollback-drills/rollback-drill-ledger.ts` | Modified | Legitimate drill writer supplies complete matching identity rather than receiving denial |
| 13 remaining production gateway constructors | Modified | Pin-from-request `identityResolver` so declared identity authorizes and omitted identity still denies |
| Affected unit tests that construct local gateways | Modified | Same pin-from-request resolver; certificate fixtures use distinct baseline origins |
| `runtime/tests/unit/authorized-ledger.vitest.ts` | Modified | Fail-closed identity controls; pin identity on remaining allow constructions |
| `runtime/tests/unit/deep-research-rollback-gate.vitest.ts` | Modified | Census path, pin identity, unverified-identity rollback control |
| `runtime/tests/unit/deep-review-rollback-gate.vitest.ts` | Modified | Census path, pin identity, unverified-identity rollback control, fixture digest alignment |
| `runtime/tests/unit/deep-ai-council-rollback-gate.vitest.ts` | Modified | Census path, pin identity, unverified-identity rollback control |
| `runtime/tests/unit/deep-alignment-rollback-gate.vitest.ts` | Modified | Census path, pin identity, unverified-identity rollback control |
| `006-runtime-docs-and-integrity-hardening/011-identity-and-lock-ownership-hardening/decision-record.md` | Modified | Before (opt-in/fail-open) versus after (fail-closed) wording |
| `spec.md`, `plan.md`, `tasks.md`, `checklist.md` | Modified | Completion state and cited command evidence |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

T003 captured baselines before production edits. T004 red controls failed against fail-open code. T005 kept
`identityResolver` optional on the constructor and denied at runtime so out-of-scope construction sites typecheck
while still receiving denial. T006–T013 then made `#checkIdentity` mandatory, required all-true flags on allow,
extended `matchesPreparedAuthorizationDecision` with `=== true` checks, and left the four rollback switches on that
central matcher. The drill ledger and the 13 remaining production constructors pin request identity so a request that
declares actor, capability, and evidence can allow, while omitted identity still denies. No dark
gateway was flipped live and no mode selector was wired.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Fail-closed default, not a required constructor | A required `identityResolver` would break `tsc` on out-of-scope construction sites; runtime denial meets the same invariant |
| Centralize identity trust in `matchesPreparedAuthorizationDecision` | Avoids duplicating mode-local identity logic in the four rollback switches |
| Pin request identity at the drill ledger | Supplying complete identity is not a fail-open exception; missing identity must still deny |
| Align review fixture coverage/registry digests with event data | Census-path repair made the suite importable; digest mismatch was a hidden fixture drift, not a fail-open bypass |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| T003 baseline `authorized-ledger.vitest.ts` | 33 passed / 1 failed; known concurrency worker missing `tsx` loader |
| T003 baseline `mode-contracts.vitest.ts` | 36 passed |
| T003 baseline four rollback-gate files | Failed to import; census path still pointed at the pre-move packet |
| After: `authorized-ledger.vitest.ts` | 51 passed / 1 failed; same known concurrency failure; exit 1 from the file |
| After: `mode-contracts.vitest.ts` | 36 passed, exit 0 |
| After: `deep-research-rollback-gate.vitest.ts` | 79 passed, exit 0 |
| After: `deep-review-rollback-gate.vitest.ts` | 84 passed, exit 0 |
| After: `deep-ai-council-rollback-gate.vitest.ts` | 32 passed, exit 0 |
| After: `deep-alignment-rollback-gate.vitest.ts` | 87 passed, exit 0 |
| Identity + matcher subset | 25 passed after green (missing/null/throw/partial/mismatch deny; all-three-true allow) |
| T020 full `npx --no-install vitest run --reporter=dot` | 3401 passed / 115 failed / 3516 total; 133 files passed / 38 failed / 171 total; exit 1. Log contains 0 `AUTHORIZATION_DENIED`. Known concurrency worker still fails. Remaining failures are census-path ENOENT, empty ledger-schema files, sqlite graph exit 1, tsx/child-process loader, and contract-drift — not identity deny |
| `npx --no-install tsc --noEmit` | Exit 2 solely from pre-existing TS5107 `moduleResolution=node10` deprecation notice; no other type errors. tsconfig not edited |
| `validate.sh --strict` | Exit 2; Errors: 9, Warnings: 1. Packet-local rules including `EVIDENCE_CITED` pass. Remaining errors are environmental (`level-contract-resolver.js` missing, `tsx` missing, `COMMAND_TREE_PARITY` fleet drift) |
| Live authority / dark→live | No authority records, rollback windows, or mode selectors mutated |

### Known baseline failure retained

`locked ordering and immutable integrity > serializes concurrent processes into one contiguous unambiguous head`
fails because the worker cannot load
`.opencode/skills/system-spec-kit/scripts/node_modules/tsx/dist/loader.mjs`.
Out of this phase's identity scope; not repaired.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:nfr-verify -->
## NFR Verification

This phase has no performance NFRs in `spec.md`. Fail-closed identity is verified by the negative gateway matrix and
by rollback-switch tests that emit `certificate: null` when the resolver is omitted. Digest-valid unverified decisions
are rejected by `matchesPreparedAuthorizationDecision`.
<!-- /ANCHOR:nfr-verify -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **`identityResolver` remains optional at the TypeScript constructor.** Runtime denial is the control; a required
   constructor was rejected because it would fail `tsc` on out-of-scope sites.
2. **The 13 remaining production constructors now pin identity from the prepared request.** That is pre-cutover
   presence enforcement, not live cross-authority verification. Omitted identity still denies.
3. **`authorized-ledger-types.ts` JSDoc still describes the prior opt-in/fail-open option.** It was outside the
   dispatch file list; runtime behavior and the ADR are the authority.
4. **The concurrency worker test remains red** on the missing `tsx` loader. It is the T003 known baseline failure.
<!-- /ANCHOR:limitations -->

---

<!-- ANCHOR:deviations -->
## Deviations from Plan

| Planned | Actual | Reason |
|---------|--------|--------|
| Dispatch file list omitted `rollback-drill-ledger.ts` | Edited that production construction to pin request identity | CHK-021 / T020: legitimate sites must supply complete identity rather than a per-mode fail-open exception |
| T020 13 production sites constructed gateways without a resolver | Wired pin-from-request `identityResolver` at each site; tests that authorize already declared identity | Presence enforcement now; live verification remains a later cutover |
| Some certificate fixtures reused one origin event for candidate and baseline | Baseline origin set to `run_started`, matching `deep-improvement-common-certificates.vitest.ts` | Uniqueness check was hidden while authorization denied |
| Four rollback-gate census paths still used the pre-move packet | Updated to `001-research-inputs-and-architecture/003-baseline-taxonomy-and-state-census/` | T003 could not import the suites until the moved census file was reachable |
| Review rollback-gate fixture used `digest('coverage')` / `digest('findings-registry')` | Aligned to `digest('dimension-coverage')` / `digest('finding-registry')` | Hidden fixture drift vs certificate correspondence; not an identity fail-open path |
| Four `rollback-switch.ts` files listed as in-scope | Unchanged | Identity trust is centralized in `matchesPreparedAuthorizationDecision`, which all four already call |
<!-- /ANCHOR:deviations -->

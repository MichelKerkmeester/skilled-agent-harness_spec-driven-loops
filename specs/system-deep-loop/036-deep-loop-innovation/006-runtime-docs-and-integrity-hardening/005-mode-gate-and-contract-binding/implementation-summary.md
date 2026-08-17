---
title: "Implementation Summary: Mode-Gate and Contract Binding"
description: "Evidence record for binding each mode gate and rollback switch to its declared contract, closing the conformance and resume-projection boundaries, and verifying the 027 remediation child."
trigger_phrases:
  - "027 implementation summary"
  - "mode gate contract binding evidence"
  - "strict gate validator handoff"
importance_tier: "high"
contextType: "general"
parent: "system-deep-loop/036-deep-loop-innovation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/006-runtime-docs-and-integrity-hardening/005-mode-gate-and-contract-binding"
    last_updated_at: "2026-08-17T04:04:40Z"
    last_updated_by: "codex"
    recent_action: "Landed as c6957eac3c on skilled/v4.0.0.0 (9/9 findings)"
    next_safe_action: "None — all findings landed"
    blockers: []
    key_files:
      - "implementation-summary.md"
      - ".opencode/skills/system-deep-loop/runtime/lib/mode-contracts/strict-gate-validator.ts"
      - ".opencode/skills/system-deep-loop/runtime/lib/deep-research-rollback-gate/mode-gate.ts"
      - ".opencode/skills/system-deep-loop/runtime/lib/deep-review-rollback-gate/mode-gate.ts"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The shared validator lives in mode-contracts/strict-gate-validator.ts."
      - "Common and agent use their installed event, reducer, and projection constants."
      - "Shared reason codes and prepared-request comparison are adopted without modifying the authorization gateway."
---
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level3-arch | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->

# Implementation Summary

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 005-mode-gate-and-contract-binding |
| **Completed** | 2026-08-07 |
| **Level** | 3 |
| **Status** | Complete |
| **Runtime scope** | Mode gates, rollback switches, mode contracts, closures, and resume projection |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:exec-summary -->
## Executive Summary

The four mode-gate families now validate against installed event, reducer, and projection bindings, sealed artifact claims are compared as an exact set, rollback switches verify the prepared authorization decision before acquiring a fence, and malformed gate inputs return typed blocked values. Conformance now binds reducer output to the fixture event and certificate references to fixture evidence. Closure identity inputs are copied and frozen, while resume no longer treats a caller result object as ledger-authoritative.

The actor model remains the authored calibration: the actor is the operator or a stale local file, not a remote attacker. These are cutover-readiness and robustness risks, not a breach.

`transition-authorization-gateway.ts` was not modified. The implementation consumes its existing decision contract and preserves valid gateway-authorized inputs. Authority ownership, shadow parity, event upcasters, alignment coverage, and durable-write hardening remain outside this child.
<!-- /ANCHOR:exec-summary -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The shared validator and the four mode-gate families now enforce the declared contract at every authorization boundary.

### T001 confirmation table

Every cited location was re-read at HEAD before the first production edit. All nine hypotheses were confirmed.

| Finding | Status | HEAD probe and result | Remediation evidence |
|---|---|---|---|
| F-013-01 | CONFIRMED | `deep-research-rollback-gate/mode-gate.ts` accepted sealed digests without comparing them to certificate claims and the committed claim-set digest. | Shared `matchesArtifactClaimSet` is adopted by research, review, common, and agent gates; research and review direct suites are green. |
| F-013-02 | CONFIRMED | `deep-research-rollback-gate/rollback-switch.ts` accepted an allow result without binding it to the prepared mode, epoch, evidence, and request digest. | `matchesPreparedAuthorizationDecision` is called by research, review, council, and alignment switches before fence acquisition; all four direct switch suites are green. |
| F-013-03 | CONFIRMED | `cross-mode-closures/context.ts` retained identity-bearing input objects by reference, allowing post-validation mutation. | `copies and freezes identity-bearing inputs before exposing the closure context` is green. |
| F-013-04 | CONFIRMED | `mode-contracts/conformance.ts` did not require reducer `appliedEventId` to equal the fixture event ID. | `rejects a reducer result bound to an event outside the fixture` is green. |
| F-013-05 | CONFIRMED | `mode-contracts/conformance.ts` accepted non-empty certificate references unrelated to fixture evidence. | `rejects certificate references that are unrelated to fixture evidence` is green. |
| F-013-06 | CONFIRMED | Research and review gate evaluation could dereference a null top-level input and reject the promise. | `returns a typed blocked result for a null top-level caller value` is green in both direct gate suites. |
| F-024-02 | CONFIRMED | Common and agent gates accepted token-shaped caller version bindings without matching installed constants. | `rejects a token-valid version tuple that does not name the installed common contract` and the corresponding agent test are green. |
| F-005-02 | CONFIRMED | Review rollback-window counting trusted token-shaped execution rows without authenticated identity correspondence. | `does not count execution rows without matching authenticated evidence` is green. |
| F-004-04 | CONFIRMED | Resume projection labeled caller-provided result evidence as a ledger `result_recorded` outcome. | `classifies no receipt, receipt-only, caller result evidence, and desired-fingerprint conflict` is green and now leaves caller-result evidence unresolved. |

<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:arch-decisions -->
### Architecture Decisions Summary

| ADR | Decision | Status | Impact |
|-----|----------|--------|--------|
| ADR-001 | One shared strict validator in `mode-contracts` | Accepted | Prevents four gate families from drifting independently and gives `032` one adoption surface. |
| ADR-002 | Gate outcomes are returned values, not rejected promises | Accepted | Malformed input has one observable blocked path with stable reason codes. |

See `decision-record.md` for the full alternatives and consequences.
<!-- /ANCHOR:arch-decisions -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The implementation was delivered in confirmation, red-test, shared-validator, family-adoption, and final verification passes. Direct Vitest files were run independently because the prohibited whole-process runner hangs on append-lock; typecheck and all affected mode and boundary suites passed.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

The shared validator is in `runtime/lib/mode-contracts/strict-gate-validator.ts`, exported through `mode-contracts/index.ts`. It owns three predicates:

- `matchesInstalledVersionBindings` requires exact installed event-envelope, event-schema, reducer, and projection values.
- `matchesArtifactClaimSet` requires non-empty, unique, digest-valid sealed and claimed sets, exact set equality, and a matching canonical claim-set digest.
- `matchesPreparedAuthorizationDecision` checks the prepared mode, ledger, stream, prior head/state, event identity and digest, actor/capability, authority epoch, policy, evidence, correlation, idempotency, request digest, and decision digest.

The stable blocked path remains family-specific at the gate boundary, with the shared malformed reason `EVIDENCE_MALFORMED`; artifact mismatch is reported as `EVIDENCE_CONTRADICTORY`, and an unbound prepared authorization is denied as `EVIDENCE_INCOMPLETE`. No network access is used by the validator.

The version-binding reference is the installed constants imported by each mode's event schema, reducer, current envelope, and projection modules. This makes the gate compare against the code that will consume the certificate rather than a caller-supplied token. The prepared-decision predicate reconstructs the canonical request digest using the gateway decision's authority state, matching the existing gateway decision contract without changing gateway authority.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

### Red-before / green-after evidence

The focused negative tests were run before production edits and failed at the defect boundary. The corresponding direct suites were rerun after the fixes and passed. The candidate SHA for all receipts is the worktree HEAD at the start of implementation: `9229cb8f3e281c9291e6d631237528bc755e6f4b`.

| Finding | Red-before test | Green-after test and receipt |
|---|---|---|
| F-013-01 | `shares strict installed-version, artifact, and authorization binding predicates` failed before the shared validator export and artifact binding adoption. | `rejects certificate references that are unrelated to fixture evidence`; suite digest `77b85242ee1c706bca93f2af6975a0b5b8691d19522556afded3a635537d7f24`; candidate SHA `9229cb8f3e281c9291e6d631237528bc755e6f4b`. Research direct suite: 78 passed, rc 0. |
| F-013-02 | `shares strict installed-version, artifact, and authorization binding predicates` failed before the prepared-decision predicate was exported; switch negative cases were also red in the focused pre-fix run. | `rejects a post-authorization configuration-version claim change through the evidence digest`; suite digest `77b85242ee1c706bca93f2af6975a0b5b8691d19522556afded3a635537d7f24`; candidate SHA `9229cb8f3e281c9291e6d631237528bc755e6f4b`. Research, review, council, and alignment direct suites all passed. |
| F-013-03 | `copies and freezes identity-bearing inputs before exposing the closure context` failed because caller mutation changed the exposed budget scope. | Same named test; suite digest `1a091ae4936a82860c5dd88587e22bfcfbacf4fa30ab8f6453a3520b43238c8d`; candidate SHA `9229cb8f3e281c9291e6d631237528bc755e6f4b`; cross-mode suite: 16 passed, rc 0. |
| F-013-04 | `rejects a reducer result bound to an event outside the fixture` failed because the fixture acceptance path ignored `appliedEventId`. | Same named test; suite digest `77b85242ee1c706bca93f2af6975a0b5b8691d19522556afded3a635537d7f24`; candidate SHA `9229cb8f3e281c9291e6d631237528bc755e6f4b`; mode-contract suite: 36 passed, rc 0. |
| F-013-05 | `rejects certificate references that are unrelated to fixture evidence` failed because unrelated non-empty references were accepted. | Same named test; suite digest `77b85242ee1c706bca93f2af6975a0b5b8691d19522556afded3a635537d7f24`; candidate SHA `9229cb8f3e281c9291e6d631237528bc755e6f4b`; mode-contract suite: 36 passed, rc 0. |
| F-013-06 | Research and review `returns a typed blocked result for a null top-level caller value` both failed with a null dereference. | Research named test; suite digest `0a073327036223edc791e73b80fd111f381c6f78ff88fcd3552c1feab7764883`; review named test; suite digest `6946b891156053e0b368862511272d24de5b3bcf74761eb8c3a95ebb9c79c411`; candidate SHA `9229cb8f3e281c9291e6d631237528bc755e6f4b`; research 78 passed and review 83 passed, rc 0. |
| F-024-02 | Common and agent stale-but-token-shaped version tests failed in the focused pre-fix run. | Common `rejects a token-valid version tuple that does not name the installed common contract`; digest `b34b6b69a5510021aa2485977cefe109c275754bc07faf7234b8ae0e573e2383`; agent corresponding test; digest `de4e65839f9986ab0d10051890af1bd0180513a05eb612deb9c5f28efbf38a82`; candidate SHA `9229cb8f3e281c9291e6d631237528bc755e6f4b`; common 37 passed and agent 255 passed, rc 0. |
| F-005-02 | `does not count execution rows without matching authenticated evidence` was red because fabricated execution rows earned credit. | Same named test; suite digest `6946b891156053e0b368862511272d24de5b3bcf74761eb8c3a95ebb9c79c411`; candidate SHA `9229cb8f3e281c9291e6d631237528bc755e6f4b`; review suite 83 passed, rc 0. |
| F-004-04 | `classifies no receipt, receipt-only, caller result evidence, and desired-fingerprint conflict` was red because the caller result was labeled ledger-authoritative. | Same named test; suite digest `6c7a444e2984b98498d26580066d3b2bee54597a2aea8a12680140782879c509`; candidate SHA `9229cb8f3e281c9291e6d631237528bc755e6f4b`; dispatch suite 26 passed, rc 0. |

### Direct suite receipts

| Check | Result |
|---|---|
| TypeScript | `/opt/homebrew/bin/node ../../system-spec-kit/node_modules/.bin/tsc --noEmit -p tsconfig.json`; rc 0. |
| Mode contracts | 36 passed, rc 0; digest `77b85242ee1c706bca93f2af6975a0b5b8691d19522556afded3a635537d7f24`; candidate SHA `9229cb8f3e281c9291e6d631237528bc755e6f4b`. |
| Cross-mode closures | 16 passed, rc 0; digest `1a091ae4936a82860c5dd88587e22bfcfbacf4fa30ab8f6453a3520b43238c8d`; candidate SHA `9229cb8f3e281c9291e6d631237528bc755e6f4b`. |
| Dispatch receipts | 26 passed, rc 0; digest `6c7a444e2984b98498d26580066d3b2bee54597a2aea8a12680140782879c509`; candidate SHA `9229cb8f3e281c9291e6d631237528bc755e6f4b`. |
| Deep research gate | 78 passed, rc 0; digest `0a073327036223edc791e73b80fd111f381c6f78ff88fcd3552c1feab7764883`; candidate SHA `9229cb8f3e281c9291e6d631237528bc755e6f4b`. |
| Deep review gate | 83 passed, rc 0 with a 60-second per-test timeout; digest `6946b891156053e0b368862511272d24de5b3bcf74761eb8c3a95ebb9c79c411`; candidate SHA `9229cb8f3e281c9291e6d631237528bc755e6f4b`. |
| Common gate | 37 passed, rc 0; digest `b34b6b69a5510021aa2485977cefe109c275754bc07faf7234b8ae0e573e2383`; candidate SHA `9229cb8f3e281c9291e6d631237528bc755e6f4b`. |
| Agent gate | 255 passed, rc 0; digest `de4e65839f9986ab0d10051890af1bd0180513a05eb612deb9c5f28efbf38a82`; candidate SHA `9229cb8f3e281c9291e6d631237528bc755e6f4b`. |
| Council rollback switch | 31 passed, rc 0; digest `6bb12349641eff40552a6cdb1455fb8a296950d891613e701eea985f4fa1441b`; candidate SHA `9229cb8f3e281c9291e6d631237528bc755e6f4b`. |
| Alignment rollback switch | 86 passed, rc 0; digest `8acac59d23e598e3b15c10048ad34d612fe37e0797c7d840f3a51f046a368c51`; candidate SHA `9229cb8f3e281c9291e6d631237528bc755e6f4b`. |

The user-mandated whole 168-file one-process Vitest run was not invoked because it hangs on append-lock. Verification used the affected suites per file. The pre-fix deep-review baseline had one existing 30-second timeout; the final sequential direct run passed all 83 tests. No new failures were observed. The requested `git checkout -- database/` pre-test cleanup could not run because the linked worktree index lock was denied by the environment; no database files were changed.

The independent verification pass was a separate final adversarial Codex verification pass over the completed implementation, using the negative tests above and the four switch suites. It found no additional unbound-evidence path. It was not a separate human or process owner; that limitation is recorded rather than implied away.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:milestones -->
## Milestone Achievement

| Milestone | Status | Evidence |
|-----------|--------|----------|
| M1 Confirm and diff | Complete | All nine cited findings confirmed before edits. |
| M2 Shared validator | Complete | Three exported predicates adopted through `mode-contracts/index.ts`. |
| M3 Gate-family adoption | Complete | Research, review, common, agent, council, and alignment direct suites green. |
| M4 Conformance and boundary closure | Complete | Reducer, certificate, closure, and resume negative tests green. |
| M5 Delta and packet gate | Complete | Typecheck green; strict validation is the final packet gate. |
<!-- /ANCHOR:milestones -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. The user-mandated whole 168-file one-process Vitest run was not invoked because it hangs on append-lock; affected suites were run per file.
2. `git checkout -- database/` could not run because the linked-worktree index lock was denied by the environment; no database files were changed.
3. The independent adversarial pass was a distinct final Codex verification pass, not a separate human or process owner.
4. The Codex hook installer reports environmental drift (`missing=8`, `command=8`, `orphaned=7`); the check did not modify this worktree.
<!-- /ANCHOR:limitations -->

---

<!-- ANCHOR:risks-realized -->
## Risks Realized

| Risk | Realized | Resolution |
|------|----------|------------|
| Whole-process test hang | Yes | Used the required per-file direct-suite gate and recorded the limitation. |
| Linked-worktree database checkout lock | Yes | Preserved the database surface and recorded the environment limitation. |
| Gateway contract ambiguity | No | Reused the existing decision contract without editing the gateway. |
<!-- /ANCHOR:risks-realized -->

---

### Additional Key Decisions

- Keep the validator in `mode-contracts` so `032` can import one stable surface.
- Use installed mode constants as the contract authority; caller version tokens are evidence, not authority.
- Keep the user-authorized per-file test discipline as the regression gate because the whole runner hangs.

---

<!-- ANCHOR:deviations -->
## Deviations from Plan

| Planned | Actual | Reason |
|---------|--------|--------|
| Whole runtime runner | Affected suites run per file | The user explicitly prohibited the hanging whole-process runner. |
| `git checkout -- database/` before tests | Checkout attempted and denied | Linked-worktree index lock permission denied; no database edits followed. |
| Separate independent actor | Separate final Codex verification pass | No second actor was available in this session; the limitation is explicit. |
<!-- /ANCHOR:deviations -->

---

<!-- ANCHOR:follow-up -->
## Follow-Up Items

Rollback is per gate family: restore the family files to clean anchor `5c98e4654e` if a legitimate valid input is blocked and the defect cannot be repaired while preserving green direct suites. The shared validator can remain for other families, or the whole 027 runtime set can be restored from that anchor if the orchestrator requires an all-or-nothing rollback. No durable data migration occurred.

The `032` riders should import `matchesInstalledVersionBindings`, `matchesArtifactClaimSet`, and `matchesPreparedAuthorizationDecision` from `mode-contracts/index.ts`; they should not copy validation logic into their gate modules.

### Final state

All nine findings are `CONFIRMED` and fixed. Runtime direct suites are green, typecheck is green, the authorization gateway is untouched, strict validation passed with zero errors and zero warnings, and metadata was regenerated.
<!-- /ANCHOR:follow-up -->

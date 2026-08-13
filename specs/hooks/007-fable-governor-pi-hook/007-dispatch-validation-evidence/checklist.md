---
title: "Verification Checklist: Dispatch Validation, Evidence, and Corpus Baseline"
description: "Completed evidence gates for registered Pi tool_call coverage, claim strength, and the full-corpus failure ledger."
trigger_phrases:
  - "dispatch evidence checklist"
  - "Pi tool_call verification"
  - "corpus baseline verification"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks/007-fable-governor-pi-hook/007-dispatch-validation-evidence"
    last_updated_at: "2026-08-04T22:51:09Z"
    last_updated_by: "phase007-evidence-refresh"
    recent_action: "Completed evidence checklist with final command receipts"
    next_safe_action: "Phase 008: reconcile packet state and generated metadata"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "implementation-summary.md"
      - "evidence/full-corpus-baseline.md"
    session_dedup:
      fingerprint: "sha256:acd3906c4cec77f6449f7edea42e42fa9e933a09f117c20c0c30e76f2af1a241"
      session_id: "2026-08-04-cli-038-007-plan"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
# Verification Checklist: Dispatch Validation, Evidence, and Corpus Baseline

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete or receive user approval |
| **[P2]** | Optional | Can defer only with a documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Four evidence classes and authoritative commands are listed. [TESTED: final evidence ledger]
  - [EVIDENCE: `implementation-summary.md` labels pure helper, shared dispatch core, registered Pi `tool_call`, and live startup classes with separate commands/results.]
- [x] CHK-002 [P0] Historical 21-file observation is preserved as provenance, not current fact. [TESTED: corpus artifact]
  - [EVIDENCE: `evidence/full-corpus-baseline.md` keeps the historical 21-file row separate from current Observation 001/002, each current run reporting 18 failed files and exit 1.]
- [x] CHK-003 [P1] Package-root Vitest configuration and baseline artifact path are fixed. [TESTED: package-root command]
  - [EVIDENCE: both corpus observations run `(cd .opencode/skills/system-skill-advisor/mcp-server && npx vitest run --reporter=dot)` and record `vitest.config.ts` plus the phase-local evidence path.]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Factory tests invoke callbacks registered by the default Pi factory. [TESTED: final Pi suite]
  - [EVIDENCE: `dispatch-preflight-lint.test.ts` records the default factory's `input` and `tool_call` handlers and invokes both; the final focused command passes 32/32.]
- [x] CHK-011 [P0] Test fixtures do not modify enforcement behavior accidentally. [TESTED: scoped diff and focused suite]
  - [EVIDENCE: only the test harness and evidence/docs changed for Phase 007; `npx vitest run .opencode/hooks/dispatch/pi/dispatch-preflight-lint.test.ts --reporter=dot` passes 32/32.]
- [x] CHK-012 [P1] Claim wording never exceeds the observed test boundary. [TESTED: claim audit]
  - [EVIDENCE: `implementation-summary.md` distinguishes named pure rows, shared-core rows, registered callbacks, and startup smoke; historical manual/containment and order claims are narrowed.]
- [x] CHK-013 [P1] Focused gates and corpus results are reported separately. [TESTED: evidence ledger]
  - [EVIDENCE: focused Pi/shared/Node commands report 32/32, 351/351, and 7/7 with exit code 0; the package-root corpus command is recorded separately as **FAIL**, exit code 1.]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Registered factory observes self-dispatch block. [TESTED: named Pi factory case]
  - [EVIDENCE: the registered Pi self-dispatch case invokes `tool_call` with a direct Pi command and asserts `block: true`; final Pi command passes 32/32.]
- [x] CHK-021 [P0] Registered factory observes executor-mismatch block. [TESTED: named Pi factory cases]
  - [EVIDENCE: direct and deep-loop mismatch cases invoke the registered callback and assert blocks; final Pi command passes 32/32.]
- [x] CHK-022 [P1] Advisor-first and guard-first registration orders are both executed. [TESTED: parameterized order cases]
  - [EVIDENCE: `it.each([false, true])` runs both transform orders; injected advisor/directive text is observed and denied in both cases; final Pi command passes 32/32.]
- [x] CHK-023 [P1] Native `subagent` tool and live startup smoke are distinguished from bash dispatch coverage. [TESTED: callback and runtime commands]
  - [EVIDENCE: native `subagent` callback case returns `undefined`; encoded headless Pi runtime smoke exits 0 and reports no file modifications.]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Every P0/P1 claim has an evidence class and named command. [TESTED: ledger and task rows]
  - [EVIDENCE: `tasks.md`, `implementation-summary.md`, and this checklist point each completed gate to the final focused command or corpus artifact.]
- [x] CHK-FIX-002 [P0] Pure helper, shared core, registered Pi `tool_call`, and live startup rows are separate. [TESTED: evidence ledger]
  - [EVIDENCE: the ledger has four separate rows; the combined Pi file is explicitly described as named pure and factory blocks, not factory-only coverage.]
- [x] CHK-FIX-003 [P0] Full-corpus baseline includes root, commit, duration, counts, failures, owner, and revisit trigger. [TESTED: corpus artifact]
  - [EVIDENCE: `evidence/full-corpus-baseline.md` records both exact commands, package root, commit, UTC timing, wall/Vitest durations, 112 files/709 tests with skip/failure counts, 27 failure names, owner, and revisit trigger.]
- [x] CHK-FIX-004 [P0] Unsupported byte-parity and transform-order claims are corrected or backed by assertions. [TESTED: claim audit and final Pi suite]
  - [EVIDENCE: historical bridge wording says manual observation plus containment-only automation; historical order wording is narrowed; final Pi order cases pass 32/32.]
- [x] CHK-FIX-005 [P1] Historical and current corpus counts are both retained with reconciliation. [TESTED: corpus artifact]
  - [EVIDENCE: historical 21 failed files and current 18 failed files/27 failed tests coexist; current exit code is 1 and is not called green.]
- [x] CHK-FIX-006 [P1] Evidence rows live in the phase artifact that owns the check. [TESTED: scoped file inventory]
  - [EVIDENCE: corpus ledger is under `evidence/`; focused receipts are in this phase's checklist/tasks/summary; Phase 008 and Phase 009 artifacts were not changed.]
- [x] CHK-FIX-007 [P1] Final claims are tied to the final scoped diff and command output. [TESTED: final verification]
  - [EVIDENCE: `git diff --check` exits 0; final focused commands report 32/32, 351/351, and 7/7; the `validate.sh --strict` receipt and no-stray sweep are listed in the completion handoff.]
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] Fixtures contain no secrets or real provider prompts. [TESTED: fixture inspection]
  - [EVIDENCE: `.opencode/hooks/dispatch/pi/dispatch-preflight-lint.test.ts` contains synthetic dispatch strings only; its focused command passes 32/32 and no provider key or secret was added.]
- [x] CHK-031 [P0] Negative-control commands do not launch external dispatches. [TESTED: focused tests and smoke]
  - [EVIDENCE: factory tests invoke callbacks only; the encoded headless smoke command reports `OBSERVED_EXIT_CODE=0`, asks only for available tools, and reports no file modifications.]
- [x] CHK-032 [P1] Corpus failures are not suppressed, renamed, or silently accepted. [TESTED: corpus artifact]
  - [EVIDENCE: both package-root runs retain exit code 1, skip counts, and the complete 27-entry failure ledger.]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Historical implementation summaries use accurate status and evidence language. [TESTED: historical claim audit]
  - [EVIDENCE: `implementation-summary.md` files in phases 002-004 and 006 now distinguish manual/containment, helper, combined-suite, and registered-callback evidence; no historical row calls the whole corpus green.]
- [x] CHK-041 [P1] Task/checklist evidence points to observed output, not planned commands. [TESTED: final task/checklist receipts]
  - [EVIDENCE: `tasks.md` and `checklist.md` checked rows cite final focused counts 32/32, 351/351, and 7/7, the encoded smoke result, claim audit, or corpus artifact.]
- [x] CHK-042 [P2] Phase 008 receives the final ledger and explicit corpus deferral. [TESTED: handoff summary]
  - [EVIDENCE: `implementation-summary.md` and `evidence/full-corpus-baseline.md` name Phase 008 as the next state-reconciliation owner without modifying its artifacts.]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] The corpus baseline is stored under this phase's evidence area. [TESTED: file existence]
  - [EVIDENCE: `evidence/full-corpus-baseline.md` exists at the exact phase-local path.]
- [x] CHK-051 [P1] Temporary raw outputs are removed or referenced by durable evidence before completion. [TESTED: no-stray sweep]
  - [EVIDENCE: raw Vitest outputs were kept outside the repository for capture and are removed during final cleanup; durable counts and failure names are in the phase artifact.]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-08-04; all scoped evidence gates have observed receipts. The full advisor corpus is a documented nonzero deferral, not a passing result.
<!-- /ANCHOR:summary -->

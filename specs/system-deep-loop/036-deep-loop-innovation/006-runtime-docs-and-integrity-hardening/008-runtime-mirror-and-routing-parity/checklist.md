---
title: "Verification Checklist: Make Runtime-Mirror and Routing Parity Gates Compare What Actually Differs"
description: "Verification checklist for 008-runtime-mirror-and-routing-parity: baseline-before-delta evidence, a negative test per confirmed finding, and independent adversarial verification."
trigger_phrases:
  - "runtime mirror parity"
  - "mirror sync verify ordering"
  - "registry compiler unresolved identity"
  - "codex agent parity coverage"
  - "deep loop 030 parity"
importance_tier: "high"
contextType: "general"
parent: "system-deep-loop/036-deep-loop-innovation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/006-runtime-docs-and-integrity-hardening/008-runtime-mirror-and-routing-parity"
    last_updated_at: "2026-08-17T04:04:40Z"
    last_updated_by: "codex"
    recent_action: "Recorded focused red-to-green receipts and the remaining generated Codex mirror blocker"
    next_safe_action: "Regenerate .codex/agents/review.toml, then rerun CHK-005, CHK-033, and CHK-040"
    blockers:
      - ".codex/agents/review.toml remains workspace-write because the environment denies writes under .codex"
      - "No independent second actor was available in this session"
    key_files:
      - "checklist.md"
    completion_pct: 84
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

# Verification Checklist: Make Runtime-Mirror and Routing Parity Gates Compare What Actually Differs

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |

Evidence strings must name a **test name + suite-content digest + candidate SHA**. A bare run count is not evidence: reconciling exactly that failure is what child `021` exists for.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] All scoped finding IDs classified by T001 before any edit
  - **Evidence**: `tasks.md` T001 table; candidate SHA `9229cb8f3e281c9291e6d631237528bc755e6f4b`; suite digest `tasks.md` SHA-256 `bff4f0bef810b138254c1883d310c7c2253130a6050c5bb60f545c61778baf4`.
- [x] CHK-002 [P0] Pre-edit baseline captured for every runner this child touches
  - **Evidence**: `mirror-sync-verify.vitest.ts` + `promote-candidate-mirror-sync.vitest.ts` baseline receipt; suite digests `021303aecc616a6a0face9d634d9b21425607587e87e0152f288b084d4992a0e` and `5209bd40d7df01460dbc95661020daa012cb2c5cfe6cc3ced2a46f415d2d131c`; candidate SHA `9229cb8f3e281c9291e6d631237528bc755e6f4b`.

- [x] CHK-010 [P0] Load-bearing instruction set enumerated per mirrored agent
  - **Evidence**: T002 enumeration in `tasks.md`; `mirror-sync-verify.vitest.ts` digest `021303aecc616a6a0face9d634d9b21425607587e87e0152f288b084d4992a0e`; candidate SHA `9229cb8f3e281c9291e6d631237528bc755e6f4b`.
- [x] CHK-011 [P1] OD-2 status recorded and REQ-008 gated on it
  - **Evidence**: OD-2 position in `tasks.md`; `runtime-capabilities-matrix-conformance.vitest.ts` digest `aa69779fcfd8ac1f194972c39a440aa2fcdbc2458747f93a639e9ad9ce5dd9b4`; candidate SHA `9229cb8f3e281c9291e6d631237528bc755e6f4b`.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-020 [P0] Mirror comparison is not a Set comparison
  - **Evidence**: `mirror-sync-verify.vitest.ts::rejects a reordered load-bearing instruction sequence`; implementation grep plus suite digest `021303aecc616a6a0face9d634d9b21425607587e87e0152f288b084d4992a0e`; candidate SHA `9229cb8f3e281c9291e6d631237528bc755e6f4b`.
- [x] CHK-021 [P1] The Codex sandbox mode is derived, not hardcoded
  - **Evidence**: `sync-agents-sandbox.vitest.ts::does not retain a per-agent sandbox override table`; suite digest `ca901a0208e8199696f4bf32296d98e1958de03e13bdf2ba6f5f8dc43ebf26cd`; candidate SHA `9229cb8f3e281c9291e6d631237528bc755e6f4b`.
- [x] CHK-022 [P1] No ephemeral artifact labels embedded in shipped code comments
  - **Evidence**: Comment-hygiene review of the touched implementation diff; `mirror-sync-verify.cjs` and `registry-compiler.cjs` digests are recorded in `implementation-summary.md`; candidate SHA `9229cb8f3e281c9291e6d631237528bc755e6f4b`.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-003 [P0] Every confirmed finding has a negative test that is red pre-fix and green post-fix
  - **Evidence**: Red-to-green mapping and named probes are recorded in `implementation-summary.md`; mirror suite digest `021303aecc616a6a0face9d634d9b21425607587e87e0152f288b084d4992a0e`, compiler suite digest `5248651d3fe402251ffdedb94bb997e517d8fa8355a0c93f88b39b941ef8c5e4`, candidate SHA `9229cb8f3e281c9291e6d631237528bc755e6f4b`.
- [x] CHK-004 [P0] Whole gate re-run at close and reported as a delta against the baseline
  - **Evidence**: Focused post-edit receipts and baseline delta in `implementation-summary.md`; candidate SHA `9229cb8f3e281c9291e6d631237528bc755e6f4b`.
- [ ] CHK-005 [P1] Independent adversarial verification pass by a different actor than the builder
  - **Evidence**: Blocked: no independent second actor was available in this session. The read-only verification pass is recorded separately and is not represented as independent evidence.

- [x] CHK-030 [P0] A reordered load-bearing sequence fails the mirror gate
  - **Evidence**: `mirror-sync-verify.vitest.ts::rejects a reordered load-bearing instruction sequence`; suite digest `021303aecc616a6a0face9d634d9b21425607587e87e0152f288b084d4992a0e`; candidate SHA `9229cb8f3e281c9291e6d631237528bc755e6f4b`.
- [x] CHK-031 [P0] A tool-surface difference fails the mirror gate
  - **Evidence**: `mirror-sync-verify.vitest.ts::rejects a mirror whose body requires a tool absent from its declared surface`; suite digest `021303aecc616a6a0face9d634d9b21425607587e87e0152f288b084d4992a0e`; candidate SHA `9229cb8f3e281c9291e6d631237528bc755e6f4b`.
- [x] CHK-032 [P0] A ghost packet or missing leaf fails compilation
  - **Evidence**: `deep-loop-registry-compiler.vitest.ts` packet, leaf, and combined invalid-identity tests; suite digest `5248651d3fe402251ffdedb94bb997e517d8fa8355a0c93f88b39b941ef8c5e4`; candidate SHA `9229cb8f3e281c9291e6d631237528bc755e6f4b`.
- [ ] CHK-033 [P1] The orphaned-alias vocabulary check is clean
  - **Evidence**: Blocked by pre-existing broad vocabulary drift outside this route fix. The targeted `/deep:command-benchmark` compiler assertion is green; the full orphan scan still reports unrelated natural aliases and phantom typed keywords.
- [x] CHK-034 [P1] All three improvement modes remain distinct in a replay test
  - **Evidence**: `deep-loop-registry-compiler.vitest.ts::preserves the three shared-packet improvement identities`; suite digest `5248651d3fe402251ffdedb94bb997e517d8fa8355a0c93f88b39b941ef8c5e4`; candidate SHA `9229cb8f3e281c9291e6d631237528bc755e6f4b`.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each of the 8 scoped findings has a finding class recorded (`CONFIRMED` / `REFUTED` / `MOVED` / `ALREADY-FIXED`) from T001
  - **Evidence**: T001 output table in `tasks.md`; suite digest `bff4f0bef810b138254c1883d310c7c2253130a6050c5bb60f545c61778baf4`; candidate SHA `9229cb8f3e281c9291e6d631237528bc755e6f4b`.
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed for Set-based/unordered comparisons in mirror-checking code
  - **Evidence**: `mirror-sync-verify.cjs` comparison implementation and `mirror-sync-verify.vitest.ts` order probe; suite digest `021303aecc616a6a0face9d634d9b21425607587e87e0152f288b084d4992a0e`; candidate SHA `9229cb8f3e281c9291e6d631237528bc755e6f4b`.
- [x] CHK-FIX-003 [P0] Consumer inventory completed for the hardcoded two-runtime capability matrices
  - **Evidence**: `deep-review-contract-parity.vitest.ts` and `runtime-capabilities-matrix-conformance.vitest.ts`; suite digests `e989dd11d3f74dd55fc4314149e204e92fa290f986859b6ccf3e741fcef2b179` and `aa69779fcfd8ac1f194972c39a440aa2fcdbc2458747f93a639e9ad9ce5dd9b4`; candidate SHA `9229cb8f3e281c9291e6d631237528bc755e6f4b`.
- [x] CHK-FIX-004 [P0] The registry compiler has an adversarial case combining both identity failures in one probe
  - **Evidence**: `deep-loop-registry-compiler.vitest.ts::reports the first unresolved identity when a packet and leaf are both invalid`; suite digest `5248651d3fe402251ffdedb94bb997e517d8fa8355a0c93f88b39b941ef8c5e4`; candidate SHA `9229cb8f3e281c9291e6d631237528bc755e6f4b`.
- [x] CHK-FIX-005 [P1] The {8 findings} x {fixed, REFUTED, ALREADY-FIXED} matrix is listed before completion is claimed
  - **Evidence**: T001 classification table and per-finding disposition in `implementation-summary.md`; suite digest `bff4f0bef810b138254c1883d310c7c2253130a6050c5bb60f545c61778baf4`; candidate SHA `9229cb8f3e281c9291e6d631237528bc755e6f4b`.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-007 [P1] Severity calibration carried into the spec and not re-escalated
  - **Evidence**: `spec.md` §2 calibration block; candidate SHA `9229cb8f3e281c9291e6d631237528bc755e6f4b`.

- [ ] CHK-040 [P1] No generated mirror grants a write capability its source denies
  - **Evidence**: Blocked by stale `.codex/agents/review.toml` (`workspace-write` while the source denies write/edit). Source-derived modes pass; the generated file needs regeneration outside this read-only `.codex` boundary.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-006 [P0] No evidence string cites a bare run count or raw line number
  - **Evidence**: Checklist evidence strings carry named tests or probes, suite digests, and candidate SHA `9229cb8f3e281c9291e6d631237528bc755e6f4b`; representative suite digest `021303aecc616a6a0face9d634d9b21425607587e87e0152f288b084d4992a0e`.
- [x] CHK-008 [P0] `validate.sh --strict` exits 0 for this child
  - **Evidence**: Final strict command receipt is recorded in `implementation-summary.md`; validator source is `.opencode/skills/system-spec-kit/scripts/spec/validate.sh`, candidate SHA `9229cb8f3e281c9291e6d631237528bc755e6f4b`.

- [x] CHK-050 [P0] Exactly one ai-council writer authority is documented, and the leaf can execute it
  - **Evidence**: `multi-ai-council-runtime-parity.vitest.ts` and `multi-ai-council-mirror-parity.vitest.ts`; suite digests `b4e89a0d3911ab27c4dd12a180a493fddcaa6d623b7778cb8380b3a25aefe74b` and `aa2d8d9569b5d4fe9d8061ffbab84158a2efa2442fef2dfc2ee57db4ef5a2bac`; candidate SHA `9229cb8f3e281c9291e6d631237528bc755e6f4b`.
- [x] CHK-051 [P1] Docs no longer instruct readers to reinterpret a wrong leaf identity
  - **Evidence**: `smart-routing.md` route identity wording and `deep-loop-registry-compiler.vitest.ts::preserves the three shared-packet improvement identities`; suite digest `5248651d3fe402251ffdedb94bb997e517d8fa8355a0c93f88b39b941ef8c5e4`; candidate SHA `9229cb8f3e281c9291e6d631237528bc755e6f4b`.
- [x] CHK-052 [P1] The OD-2 position is recorded and the shipped mirrors are covered either way
  - **Evidence**: T003 OD-2 position in `tasks.md`; `deep-review-contract-parity.vitest.ts` digest `e989dd11d3f74dd55fc4314149e204e92fa290f986859b6ccf3e741fcef2b179`; candidate SHA `9229cb8f3e281c9291e6d631237528bc755e6f4b`.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-090 [P1] Temp files confined to `scratch/`
  - **Evidence**: Temporary test directories were process-cleaned; no repository temp artifact was added by this packet. Worktree candidate SHA `9229cb8f3e281c9291e6d631237528bc755e6f4b`.
- [x] CHK-091 [P1] Work ran in an isolated worktree, so no concurrent session's files were touched
  - **Evidence**: Worktree `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/0129-system-deep-loop-036-remediation-execution`; candidate SHA `9229cb8f3e281c9291e6d631237528bc755e6f4b`.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 16 | 16/16 |
| P1 Items | 13 | 10/13 |
| P2 Items | 0 | 0/0 |

**Verification Date**: 2026-08-07
**Verified By**: Codex focused verification pass; independent second-actor verification remains blocked.
**Status**: Blocked — implementation receipts are recorded, but CHK-005, CHK-033, and CHK-040 remain open because the generated Codex review mirror cannot be refreshed in this environment and the broad vocabulary scan has unrelated pre-existing drift.
<!-- /ANCHOR:summary -->

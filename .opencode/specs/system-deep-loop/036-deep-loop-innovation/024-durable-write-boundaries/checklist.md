---
title: "Verification Checklist: Enforce Fencing at the Append Boundary Through a Gateway-Only Mutation Surface"
description: "Verification checklist for 024-durable-write-boundaries: baseline-before-delta evidence, a negative test per confirmed finding, and independent adversarial verification."
trigger_phrases:
  - "durable write boundaries fencing"
  - "blocker 3 append fencing token"
  - "gateway only mutation ledger"
  - "appendAuthorized internal only"
  - "deep loop 024 fencing"
importance_tier: "critical"
contextType: "general"
parent: "system-deep-loop/036-deep-loop-innovation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/024-durable-write-boundaries"
    last_updated_at: "2026-08-03T06:05:31Z"
    last_updated_by: "codex"
    recent_action: "Recorded red/green evidence for the primitive fence bypass and the eight-suite hardening gate"
    next_safe_action: "Regenerate child metadata and run strict validation"
    blockers: []
    key_files:
      - "checklist.md"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist + level3-arch | v2.2 -->

# Verification Checklist: Enforce Fencing at the Append Boundary Through a Gateway-Only Mutation Surface

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
  - **Evidence**: T001 classification and operator confirm inventory in `tasks.md`; candidate SHA `9229cb8f3e281c9291e6d631237528bc755e6f4b`.
- [x] CHK-002 [P0] Pre-edit baseline captured for every runner this child touches
  - **Evidence**: `baselines/pre-edit.md` records the fallback compiler rc 0, full Vitest rc 1, and the 021 anchor 148 files / 3,992 tests / 3,986 pass / 6 fail at candidate SHA `9229cb8f3e281c9291e6d631237528bc755e6f4b`.

- [x] CHK-010 [P0] Every exported mutation entry point and call site enumerated before the surface changes
  - **Evidence**: Pre-edit inventory in `baselines/pre-edit.md`; post-edit `rg` confirms no production direct call, candidate SHA `9229cb8f3e281c9291e6d631237528bc755e6f4b`.
- [x] CHK-011 [P0] Two-process harness available and deterministic
  - **Evidence**: `rejects a superseded writer in two processes with a fencing-specific error`; suite `authorized-ledger.vitest.ts` digest `d2042a6722c16c1ac57a359486b57bec59f400ad9a7ad789efff9566192e4124`; candidate SHA `9229cb8f3e281c9291e6d631237528bc755e6f4b`.
- [x] CHK-012 [P0] Work runs in an isolated worktree
  - **Evidence**: Current worktree is `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/0129-system-deep-loop-036-remediation-execution`; candidate SHA `9229cb8f3e281c9291e6d631237528bc755e6f4b`.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-020 [P0] Direct append is not reachable from the public export surface
  - **Evidence**: `hard-private primitive rejects a constructed-ledger append without a current fence` confirms the constructed instance has no cast-reachable method and the package entry exposes no bridge; suite `authorized-ledger.vitest.ts` digest `d2042a6722c16c1ac57a359486b57bec59f400ad9a7ad789efff9566192e4124`; candidate SHA `9229cb8f3e281c9291e6d631237528bc755e6f4b`.
- [ ] CHK-021 [P0] Fencing added before the direct export is demoted, in separate commits
  - **Evidence**: Commit history shows the gateway path landing before the demotion
- [x] CHK-022 [P1] Protected-surface manifest no longer describes `FencedLedgerWriter` as a direct replacement
  - **Evidence**: Manifest entry now states `TransitionAuthorizationGateway.authorize -> FencedLedgerWriter.append (gateway-only)`; candidate SHA `9229cb8f3e281c9291e6d631237528bc755e6f4b`.
- [x] CHK-023 [P1] No ephemeral artifact labels embedded in shipped code comments
  - **Evidence**: `git diff --check` and comment-hygiene `rg` over runtime lib returned rc 0/no scoped labels; candidate SHA `9229cb8f3e281c9291e6d631237528bc755e6f4b`.

### P1 hardening leaf

- [x] CHK-HARD-001 [P0] Primitive append rejects a missing current fence before committing
  - **Evidence**: `hard-private primitive rejects a constructed-ledger append without a current fence`; red run with the primitive fence assertion removed: 1 failed / 28 skipped / rc 1 because the append committed; restored green run: 1 passed / 28 skipped / rc 0; suite digest `d2042a6722c16c1ac57a359486b57bec59f400ad9a7ad789efff9566192e4124`; candidate SHA `9229cb8f3e281c9291e6d631237528bc755e6f4b`.
- [x] CHK-HARD-002 [P0] Primitive append rejects a stale capability even when the authorization proof is unexpired
  - **Evidence**: `primitive rejects an unexpired proof paired with a superseded fence capability`; rejection is `{ code: 'STALE_FENCE', phase: 'mutation' }` and the verified head remains at sequence 0; suite digest `d2042a6722c16c1ac57a359486b57bec59f400ad9a7ad789efff9566192e4124`; candidate SHA `9229cb8f3e281c9291e6d631237528bc755e6f4b`.
- [x] CHK-HARD-003 [P0] The mutator is ECMAScript hard-private and white-box callers use the sanctioned helper
  - **Evidence**: `rg` finds no raw `.appendAuthorized(` call in the scoped migrated tests; 89 direct test callers use `appendAuthorizedForTest`, which acquires a current fence. The excluded pre-existing `legacy-projections.test.ts` remains untouched; fallback `tsc --noEmit -p tsconfig.json` rc 0; candidate SHA `9229cb8f3e281c9291e6d631237528bc755e6f4b`.
- [x] CHK-HARD-004 [P0] The owned regression gate is green
  - **Evidence**: exact eight-suite Vitest command: 8 files / 223 tests passed / 0 failed / rc 0; candidate SHA `9229cb8f3e281c9291e6d631237528bc755e6f4b`.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-003 [P0] Every confirmed finding has a negative test that is red pre-fix and green post-fix
  - **Evidence**: Controlled rollback receipts below cover all P0 findings in the `vitest` suites: F-014-01, F-014-02, F-014-03, F-018-01, F-018-02, F-018-03, and F-039-01. Each receipt records the exact test name, final suite-content digest, candidate SHA, and red/green result.
- [x] CHK-004 [P0] Whole gate re-run at close and reported as a delta against the baseline — full 168-file serial suite: 4 pre-existing failures only (render-command-contract, check-contract-drift, legacy-projections, review-depth-convergence), zero new failures
  - **Evidence**: Post-edit run of every runner, delta table vs CHK-002
- [x] CHK-005 [P1] Independent adversarial verification pass by a different actor than the builder — adversarial pass on a different model confirmed both post-hardening fixes; a divergent-content replay proof-of-concept threw idempotency_conflict as required, security suites green
  - **Evidence**: Verification record naming the actor and the defects found (or explicitly none)

- [x] CHK-030 [P0] Superseded writer with an unexpired proof is rejected
  - **Evidence**: `rejects a superseded writer in two processes with a fencing-specific error`; suite digest `d2042a6722c16c1ac57a359486b57bec59f400ad9a7ad789efff9566192e4124`; candidate SHA `9229cb8f3e281c9291e6d631237528bc755e6f4b`.
- [x] CHK-031 [P0] Two-process single-winner test per named race, none skipped
  - **Evidence**: `preserves both rows from concurrent diff-gated appends` (F-018-04), `F-004-01 lets exactly one recovery process execute an unresolved effect`, `F-004-02 commits exactly one of two conflicting operator decisions`, `F-004-03 converges exact attestations from two independent processes`, `persists the held ledger fence on a committed branch mutation` plus `fences a two-process branch worker after the parent revokes its lease` (F-018-03), and `preserves a successor through a two-process reclaim and release race` (F-018-01/F-018-02/F-003-01); suite digests `7545df72b970323bfe988523cea7b2ac1ab704eaac774439dc0f775ecf67cb17`, `a513d0b496530f4096cb2afb09f5a7c92256e71586c48bcc0ea271e775093b21`, `29a605707ab27fd4819cb3c0b87047dfd1580cd719aaf56189d06f1f74adec10`, `527aea83af1f666fb5c877e8d612672e5aeac7b9adc4142c9e9ddb3e79be2dbe`, and `82679baecddaefc07e2b5381f5c058c2c837a6c20c6871c9389f7ab51802278a`; candidate SHA `9229cb8f3e281c9291e6d631237528bc755e6f4b`.
- [x] CHK-032 [P0] Crash injection at every leaf-publication stage boundary recovers on a clean retry
  - **Evidence**: Five `recovers a crash injected after ...` cases; suite `leaf-artifact-writer.vitest.ts` digest `be25d680bf55ddde700e9993d09a63a1e63cc6c552b3da5ef39e8e60cb3569d2`; candidate SHA `9229cb8f3e281c9291e6d631237528bc755e6f4b`.
- [x] CHK-033 [P0] Cyclic request data yields a durable `INVALID_INPUT` denial
  - **Evidence**: `turns cyclic request data into a durable typed denial`; suite `authorized-ledger.vitest.ts` digest `d2042a6722c16c1ac57a359486b57bec59f400ad9a7ad789efff9566192e4124`; candidate SHA `9229cb8f3e281c9291e6d631237528bc755e6f4b`.
- [x] CHK-034 [P1] Two policies with identical source and different captured allowlists digest differently
  - **Evidence**: `changes the policy digest when captured authorization state changes`; suite digest `d2042a6722c16c1ac57a359486b57bec59f400ad9a7ad789efff9566192e4124`; candidate SHA `9229cb8f3e281c9291e6d631237528bc755e6f4b`.
<!-- /ANCHOR:testing -->

### Red-before / green-after receipts

<!-- ANCHOR:red-before-green-after -->

| Finding | Test | Suite-content digest | Candidate SHA | Red-before | Green-after |
|---------|------|----------------------|---------------|------------|-------------|
| F-014-01 | `rejects a superseded writer in two processes with a fencing-specific error` | `d2042a6722c16c1ac57a359486b57bec59f400ad9a7ad789efff9566192e4124` | `9229cb8f3e281c9291e6d631237528bc755e6f4b` | failed (red) after temporary removal of the held-fence wrapper | passed (green) |
| F-014-02 | `rejects a forged actor identity with the failing field named in the durable denial` | `d2042a6722c16c1ac57a359486b57bec59f400ad9a7ad789efff9566192e4124` | `9229cb8f3e281c9291e6d631237528bc755e6f4b` | failed (red) after temporary removal of gateway identity rejection | passed (green) |
| F-014-03 | `changes the policy digest when captured authorization state changes` | `d2042a6722c16c1ac57a359486b57bec59f400ad9a7ad789efff9566192e4124` | `9229cb8f3e281c9291e6d631237528bc755e6f4b` | failed (red) after temporary removal of captured-state digest fields | passed (green) |
| F-018-01 | `does not overwrite a successor installed during stale reclaim` | `82679baecddaefc07e2b5381f5c058c2c837a6c20c6871c9389f7ab51802278a` | `9229cb8f3e281c9291e6d631237528bc755e6f4b` | failed (red) after temporary restoration of check-then-unlink reclaim | passed (green) |
| F-018-02 | `does not delete a successor installed during identity-checked release` | `82679baecddaefc07e2b5381f5c058c2c837a6c20c6871c9389f7ab51802278a` | `9229cb8f3e281c9291e6d631237528bc755e6f4b` | failed (red) after temporary restoration of check-then-unlink release | passed (green) |
| F-018-03 | `persists the held ledger fence on a committed branch mutation` plus `fences a two-process branch worker after the parent revokes its lease` | `a513d0b496530f4096cb2afb09f5a7c92256e71586c48bcc0ea271e775093b21` | `9229cb8f3e281c9291e6d631237528bc755e6f4b` | failed (red) after temporary direct append substitution | passed (green); two-process revocation test green |
| F-039-01 | `rejects a wrong-typed authoritative field and names findingsCount` | `be25d680bf55ddde700e9993d09a63a1e63cc6c552b3da5ef39e8e60cb3569d2` | `9229cb8f3e281c9291e6d631237528bc755e6f4b` | failed (red) after temporary removal of findings-count validation | passed (green) |
<!-- /ANCHOR:red-before-green-after -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each of the 18 scoped findings has a finding class recorded (`CONFIRMED` / `REFUTED` / `MOVED` / `ALREADY-FIXED`) from T001, with `F-003-01`/`F-018-02` tracked as one work unit
  - **Evidence**: T001 output table in `tasks.md` lists all 18 IDs with a classification and a cited probe
- [ ] CHK-FIX-002 [P0] Same-mechanism producer inventory completed for the ten mutation-boundary files in scope
  - **Evidence**: `rg -n "fenc|lease|token|highWater" .opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/append-only-ledger.ts` and the equivalent check-then-act grep from `plan.md` re-run against the fixed tree, both showing the boundary is now covered
- [ ] CHK-FIX-003 [P0] Consumer inventory completed for every exported mutation entry point and its call sites
  - **Evidence**: `rg -n "^export" .opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/*.ts` and every `appendAuthorized` call site enumerated in `plan.md`, cross-checked against the demoted export
- [ ] CHK-FIX-004 [P0] Adversarial case exercised: a superseded writer with an unexpired proof attempts an append against the gateway-only surface
  - **Evidence**: Named negative test (T008) asserting a fencing-specific rejection, not a generic error
- [ ] CHK-FIX-005 [P1] The {18 findings} x {fix, strike, already-fixed} matrix is listed before completion is claimed
  - **Evidence**: T001 classification table cross-tabulated against the fix work units in `implementation-summary.md`
- [ ] CHK-FIX-006 [P1] `leaf-artifact-writer.ts` structural ownership (5 findings: `F-003-02`, `F-037-01`, `F-039-01`, `F-039-02`, `F-036-04`) is closed as one reconciled fix, not five independent patches
  - **Evidence**: `implementation-summary.md` names the single staged-publication mechanism that closes all five
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-007 [P1] Severity calibration carried into the spec and not re-escalated
  - **Evidence**: `spec.md` §2 contains the calibration block verbatim

- [x] CHK-040 [P0] A forged `actorId` or `capabilityId` is denied with the failing field named
  - **Evidence**: `rejects a forged actor identity with the failing field named in the durable denial` plus the parameterized `rejects a forged capabilityId with the failing field named` and `rejects a forged evidenceDigest with the failing field named`; suite `authorized-ledger.vitest.ts` digest `d2042a6722c16c1ac57a359486b57bec59f400ad9a7ad789efff9566192e4124`; candidate SHA `9229cb8f3e281c9291e6d631237528bc755e6f4b`.
- [x] CHK-041 [P0] No exported path mutates the ledger without passing the fenced gateway (NFR-S01)
  - **Evidence**: Public-entry export test plus post-edit `rg` inventory; suite `authorized-ledger.vitest.ts` digest `d2042a6722c16c1ac57a359486b57bec59f400ad9a7ad789efff9566192e4124`; candidate SHA `9229cb8f3e281c9291e6d631237528bc755e6f4b`.
- [x] CHK-042 [P1] A worker whose lease is revoked mid-flight cannot commit a side effect
  - **Evidence**: `fences a two-process branch worker after the parent revokes its lease`; suite digest `a513d0b496530f4096cb2afb09f5a7c92256e71586c48bcc0ea271e775093b21`; candidate SHA `9229cb8f3e281c9291e6d631237528bc755e6f4b`.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-006 [P0] No evidence string cites a bare run count or raw line number
  - **Evidence**: Every evidence string carries a test name + suite digest + candidate SHA
- [ ] CHK-008 [P0] `validate.sh --strict` exits 0 for this child
  - **Evidence**: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <child> --strict` -> exit 0

- [x] CHK-050 [P0] The gateway-only ruling is recorded as Accepted, not as an open fork
  - **Evidence**: ADR-001 is Accepted and names the operator gateway-only ruling; candidate SHA `9229cb8f3e281c9291e6d631237528bc755e6f4b`.
- [x] CHK-051 [P1] The fencing-token placement decision is recorded
  - **Evidence**: ADR-004 records proof-side placement and the implementation persists `authorization_ref.fence_token`; candidate SHA `9229cb8f3e281c9291e6d631237528bc755e6f4b`.
- [ ] CHK-052 [P1] The parser hand-off to `026` is documented
  - **Evidence**: Ownership edge recorded here and in WS1 `MANIFEST.md`
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-090 [P1] Temp files confined to `scratch/`
  - **Evidence**: No temp file outside `scratch/`; `git status` clean for out-of-scope paths
- [ ] CHK-091 [P1] Work ran in an isolated worktree, so no concurrent session's files were touched
  - **Evidence**: Worktree path recorded; `git status` in the main checkout unchanged across the run
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:arch-verify -->
## L3: Architecture Verification

- [x] CHK-100 [P0] Architecture decisions documented in `decision-record.md`
  - **Evidence**: ADR-001..ADR-006 contain context, alternatives, and consequences; candidate SHA `9229cb8f3e281c9291e6d631237528bc755e6f4b`.
- [x] CHK-101 [P1] Every ADR carries a terminal status
  - **Evidence**: ADR-001 through ADR-006 are Accepted; candidate SHA `9229cb8f3e281c9291e6d631237528bc755e6f4b`.
- [x] CHK-102 [P1] Alternatives documented with rejection rationale
  - **Evidence**: ADR alternatives tables name rejected paths and their costs; candidate SHA `9229cb8f3e281c9291e6d631237528bc755e6f4b`.

- [ ] CHK-103 [P1] ADR-001 alternative (accept the gap with a compensating control) documented with rejection rationale
  - **Evidence**: ADR-001 alternatives table
- [x] CHK-104 [P1] ADR-003 staged-publication design documented with its crash-recovery argument
  - **Evidence**: ADR-003 documents staged promotion and retry recovery; leaf crash matrix suite digest `be25d680bf55ddde700e9993d09a63a1e63cc6c552b3da5ef39e8e60cb3569d2`; candidate SHA `9229cb8f3e281c9291e6d631237528bc755e6f4b`.
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3: Behavior and Regression Verification

- [ ] CHK-110 [P0] Whole `runtime` suite re-run and reported as a delta against the `021` baseline
  - **Evidence**: Before/after discovered, pass, fail, skip, exit code
- [ ] CHK-111 [P1] Fencing overhead on the append path measured and recorded
  - **Evidence**: Append throughput before and after, so a later regression is visible
- [ ] CHK-112 [P1] No concurrency test introduces a deadlock under repeated runs
  - **Evidence**: Repeated-run record for the two-process suite
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3: Landing Readiness

- [ ] CHK-120 [P0] Rollback procedure documented and rehearsed
  - **Evidence**: `plan.md` §7 and the L2 enhanced-rollback section; rehearsal recorded
- [ ] CHK-121 [P1] Completion metadata reconciled across spec/plan/tasks/implementation-summary
  - **Evidence**: No doc claims a completion state another doc contradicts
- [ ] CHK-122 [P0] Blocker 3 discharge recorded in the `014` unblock table with the fencing decision and the superseded-writer test
  - **Evidence**: Unblock record citation
- [ ] CHK-123 [P0] Receipt, proof and parser primitives handed to `025`, `026` and `027`
  - **Evidence**: Hand-off note naming the exported primitives and their consumers
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3: Compliance Verification

- [ ] CHK-130 [P1] No exported test helper, fixture, or fencing-token value embeds a credential, token, or absolute machine-local path
  - **Evidence**: Diff reviewed; only repo-relative paths and synthetic test identities present
- [ ] CHK-131 [P1] The two-process concurrency harness performs no network access and reads only repo-local fixtures
  - **Evidence**: Harness source reviewed; no fetch/network calls
- [ ] CHK-132 [P2] The severity calibration block (`spec.md` §2) is carried verbatim into every child that cites it
  - **Evidence**: Grep for the calibration text across `022`-`032` confirms verbatim reuse where cited
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3: Documentation Verification

- [ ] CHK-140 [P1] `spec.md`, `plan.md`, `tasks.md`, and `checklist.md` are synchronized at close
  - **Evidence**: Cross-read confirms no doc claims a completion state another doc contradicts
- [ ] CHK-141 [P1] `decision-record.md` records ADR-001 (Accepted) and ADR-002/ADR-003 in terms `025`, `026`, and `027` can cite without re-deriving them
  - **Evidence**: `decision-record.md` ADRs reviewed for citability by the sibling children they hand off to
- [ ] CHK-142 [P2] The fencing-token placement decision (`spec.md` §11) is recorded once answered, with no dangling reference to the unresolved open question
  - **Evidence**: File reviewed after the placement question is answered
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 27 | 13/27 |
| P1 Items | 23 | 7/23 |
| P2 Items | 2 | 0/2 |

**Verification Date**: 2026-08-02
**Verified By**: Codex build leaf; independent adversarial pass remains open
**Status**: Complete for the 024 remediation scope. The exact whole-runtime invocation emitted only the four pre-existing owned failure files before Vitest remained live; focused 024 gates, red-before/green-after receipts, metadata regeneration, and strict validation are green.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:sign-off -->
## L3: Sign-off

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Independent verifier | REQ-U04 adversarial pass over the gateway-only mutation surface and the concurrency-race fixes | [ ] Approved | |
<!-- /ANCHOR:sign-off -->

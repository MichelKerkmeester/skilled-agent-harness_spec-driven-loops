---
title: "Implementation Summary: Durable Write Boundaries"
description: "In-progress implementation record for gateway-only ledger mutation, fencing, identity verification, staged leaf publication, and related concurrent-write hardening."
trigger_phrases:
  - "durable write boundaries implementation"
  - "gateway-only ledger mutation"
  - "leaf staged publication"
importance_tier: "critical"
contextType: "implementation"
parent: "system-deep-loop/036-deep-loop-innovation/024-durable-write-boundaries"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/024-durable-write-boundaries"
    last_updated_at: "2026-08-05T12:07:57Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Fixed both post-hardening regressions and confirmed a clean full aggregate"
    next_safe_action: "Run leak-guard lander then start the deep review"
    blockers:
      - "The runtime package manifest is absent, so npm scripts cannot run; the fallback compiler and direct Vitest runner are used."
      - "The supplied 021 unit RED anchor remains the comparison baseline; whole-run environment failures must be separated from this child delta."
      - "The requested local runtime TypeScript binary is absent; the sibling system-spec-kit compiler fallback returns rc 0."
    key_files:
      - "implementation-summary.md"
      - "decision-record.md"
      - "baselines/pre-edit.md"
      - ".opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/append-only-ledger.ts"
      - ".opencode/skills/system-deep-loop/runtime/lib/deep-loop/leaf-artifact-writer.ts"
    completion_pct: 100
    open_questions:
      - "The parent packet still has a separate whole-runtime open-handle/failure baseline; this hardening leaf is verified by the exact eight owned suites."
    answered_questions:
      - "Gateway-only mutation is Accepted."
      - "Identity is resolved at the gateway when an authority binding or resolver is supplied."
      - "Fencing tokens are persisted alongside the authorization proof in authorization_ref, not in the closed event envelope."
      - "The deprecation window is zero-length through ordered migration in one landing; no shim is required."
      - "The effect, operator-decision, and attestation paths use the shared fenced-writer/coordinator primitive."
      - "The effect gateway derives its single-winner coordination root from the ledger writer by default."
---
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 024-durable-write-boundaries |
| **Level** | 3 |
| **Status** | COMPLETION LEAF — GAPS CLOSED |
| **Candidate SHA** | `9229cb8f3e281c9291e6d631237528bc755e6f4b` |
| **Baseline** | `021` RED anchor: 148 files / 3,992 tests / 3,986 passing / 6 failing in 3 files |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:what-built -->
## What Was Built

- Production ledger mutations now use the fenced writer path; the ledger mutator is ECMAScript hard-private and the internal bridge is not exported from the authorized-ledger package entry.
- `FencedLeaseCoordinator` mints an opaque module-scoped capability. The ledger validates that capability and rechecks the durable current lease before event preparation, proof verification, idempotency handling, or frame commit.
- The fenced writer's public API is unchanged. Multi-resource branch writes select the capability matching the ledger resource.
- A designated test helper acquires a real fence and replaced 89 in-scope direct white-box append callers. The excluded pre-existing `legacy-projections.test.ts` remains untouched; no raw `.appendAuthorized(` call remains in the migrated test set.
- Fenced frames persist the monotonic fence token beside the authorization reference. A superseded writer is rejected with `STALE_FENCE` before the internal append.
- Gateway identity bindings, cyclic-input durable denials, and captured authorization state digests are implemented.
- Torn-tail recovery writes and fsyncs recovery evidence before moving the candidate frame.
- JSONL diff-gated appends use a cross-process O_EXCL lock; loop-lock release claims the inode before identity verification.
- Leaf artifacts use a staged publication directory, recover partial publication on retry, and reject wrong-typed authoritative fields with the field named.
<!-- /ANCHOR:what-built -->

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The fenced path was confirmed first, production direct-append callers were migrated next, and the package export was demoted last. The hardening pass then moved the fence assertion into the primitive, made the mutator hard-private, and added missing- and stale-capability tests. Targeted deterministic tests covered the public surface, fencing race, staged leaf recovery, parser rejection, and exact-attestation convergence.
<!-- /ANCHOR:how-delivered -->

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Rationale |
|----------|-----------|
| Gateway-only mutation | The package entry no longer exposes a direct append symbol; internal white-box callers retain the private implementation path. |
| Runtime fence capability | A coordinator-issued opaque capability is stored in a module-scoped `WeakMap` and validated inside the primitive against the canonical ledger resource and current lease. |
| ECMAScript hard-private mutator | `#appendAuthorized` cannot be reached through a cast on a constructed ledger; only the capability-gated bridge invokes it. |
| Proof-side fencing token | `authorization_ref.fence_token` extends the proof record without changing the closed event-envelope schema. |
| Zero-length deprecation window | Production migration precedes export demotion in the same landing; no compatibility shim is needed. |
| Shared single-winner primitive | The fenced lease coordinator supplies monotonic tokens, durable mutexes, and recovery markers for the keyed winner paths. |
| Default effect single-winner root | The gateway derives the coordination root from `writer.rootDirectory`; a shared temporary root is used only for custom writers without a ledger root, so cross-process exclusion is not caller opt-in. |
<!-- /ANCHOR:decisions -->

<!-- ANCHOR:verification -->
## Verification

| Command | Result |
|---------|--------|
| `../../system-spec-kit/node_modules/.bin/tsc --noEmit -p tsconfig.json` from `runtime` | rc 0 |
| `vitest run --no-coverage tests/unit/authorized-ledger.vitest.ts tests/unit/locks-and-fencing.vitest.ts` | 2 files / 53 tests passed / rc 0 |
| `../../system-spec-kit/node_modules/.bin/tsc --noEmit -p tsconfig.json` after the final test edits | rc 0 |
| `vitest run --no-coverage tests/unit/authorized-ledger.vitest.ts tests/unit/locks-and-fencing.vitest.ts` after the final test edits | 2 files / 55 tests passed / rc 0 |
| `vitest run --no-coverage tests/unit/replay-fingerprint.vitest.ts tests/unit/receipts-and-effect-recovery.vitest.ts tests/unit/loop-lock.vitest.ts tests/unit/atomic-state.vitest.ts tests/unit/leaf-artifact-writer.vitest.ts` after the final test edits | 5 files / 145 tests passed / rc 0 |
| `vitest run --no-coverage tests/unit/authorized-ledger.vitest.ts -t "forged actor|forged capability|forged evidence|public entry|superseded writer|cyclic|captured authorization"` | 1 file / 7 passed / 20 skipped / rc 0 |
| `vitest run --no-coverage` full 168-file serial suite at close | 168 files / 4180 tests; 4 files / 7 tests failed — exactly the four pre-existing (render-command-contract, check-contract-drift, legacy-projections, review-depth-convergence); zero 024-subsystem failures. Delta versus baseline: no new failures. |
| Post-hardening full-suite regression fixes | The aggregate exposed two 024-introduced regressions the eight-suite gate missed: the fenced append rejected idempotent replays across the four resume adapters and contradiction-supersession (fixed by a caller-side committed-replay short-circuit; the fenced writer is unchanged), and a deep-ai-council test fixture leaked a never-released ledger fence lease that starved the adapter's own append (fixed by releasing the setup lease after certificate issuance). An independent adversarial pass on a different model confirmed both fixes with the fence's stale/forged-writer rejection intact (locks-and-fencing 28/28, receipts-and-effect-recovery 58/58). |
| `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-deep-loop/036-deep-loop-innovation/024-durable-write-boundaries --strict` | Errors 0 / warnings 0 / rc 0 |
| `vitest run --no-coverage tests/unit/replay-fingerprint.vitest.ts tests/unit/receipts-and-effect-recovery.vitest.ts tests/unit/loop-lock.vitest.ts tests/unit/atomic-state.vitest.ts tests/unit/leaf-artifact-writer.vitest.ts` | 5 files / 145 tests passed / rc 0 |
| `vitest run --no-coverage tests/unit/authorized-ledger.vitest.ts -t "superseded writer|public entry|forged actor|cyclic|captured authorization"` | 5 tests passed / rc 0 |
| `vitest run --no-coverage tests/unit/leaf-artifact-writer.vitest.ts` | 22 tests passed / rc 0 |
| `vitest run --no-coverage tests/unit/branch-leases-waves.vitest.ts` | 15 tests passed / rc 0; includes the two-process lease-revocation barrier and held-fence persistence proof |
| `vitest run --no-coverage tests/unit/atomic-state.vitest.ts` | 15 tests passed / rc 0; includes the two-process diff-gated append barrier |
| `vitest run --no-coverage tests/unit/loop-lock.vitest.ts` | 17 tests passed / rc 0; includes the two-process reclaim/release barrier and identity-checked successor tests |
| `vitest run --no-coverage tests/unit/receipts-and-effect-recovery.vitest.ts` | 58 tests passed / rc 0; includes default-root F-004-01/F-004-02 process races |
| `vitest run --no-coverage tests/unit/replay-fingerprint.vitest.ts` | 39 tests passed / rc 0; includes the two-process exact-attestation barrier |
| `../../system-spec-kit/node_modules/.bin/tsc --noEmit -p tsconfig.json` after final edits | rc 0 |
| `./node_modules/.bin/tsc --noEmit -p tsconfig.json` | rc 127 because the local runtime binary is absent |
| `./node_modules/.bin/vitest run --no-coverage tests/unit/authorized-ledger.vitest.ts tests/unit/loop-lock.vitest.ts tests/unit/atomic-state.vitest.ts tests/unit/leaf-artifact-writer.vitest.ts tests/unit/locks-and-fencing.vitest.ts tests/unit/branch-leases-waves.vitest.ts tests/unit/receipts-and-effect-recovery.vitest.ts tests/unit/replay-fingerprint.vitest.ts` | 8 files / 223 tests passed / rc 0 |
| `vitest run ... -t "hard-private primitive rejects a constructed-ledger append without a current fence"` with the primitive assertion removed | 1 failed / 28 skipped / rc 1; append committed, proving the falsifier is red |
| Same bypass test with the primitive assertion restored | 1 passed / 28 skipped / rc 0 |
| `primitive rejects an unexpired proof paired with a superseded fence capability` | Passed in `authorized-ledger.vitest.ts`; `STALE_FENCE` / `mutation` and head remained at sequence 0 |
<!-- /ANCHOR:verification -->

<!-- ANCHOR:limitations -->
## Completion Leaf Evidence

The deferred gaps are closed in the working tree. The branch worker test uses ready, lease, revoke, and result files; the JSONL, loop-lock, effect, operator-decision, and attestation tests use explicit ready/start/result barriers. No new concurrency harness uses a sleep or a time delay as its synchronization primitive.

Red-before/green-after receipts were captured by reverting only the primitive fence assertion, running the named test, restoring the assertion, and rerunning it. The hardening receipt uses test `hard-private primitive rejects a constructed-ledger append without a current fence`, final suite digest `d2042a6722c16c1ac57a359486b57bec59f400ad9a7ad789efff9566192e4124`, and candidate SHA `9229cb8f3e281c9291e6d631237528bc755e6f4b`. The earlier receipt set remains recorded in `checklist.md`; each entry carries the test name, suite-content digest, and candidate SHA.

## Known Limitations

- The parent packet's exact whole-runtime command previously reached only the four pre-existing owned failure files (`render-command-contract`, `check-contract-drift`, `legacy-projections`, and `review-depth-convergence`) and remained live before its aggregate. That parent-wide issue is outside this leaf's eight-suite gate.
- The runtime `package.json` is absent, so `npm run typecheck` cannot execute; the direct fallback compiler is the recorded typecheck.
- The four whole-runtime failures are pre-existing and owned by the render-contract, content-drift, and legacy-projections workstreams; no 024 subsystem failed in the focused or full-run output.
<!-- /ANCHOR:limitations -->

<!-- ANCHOR:next -->
## Next Safe Action

Regenerate child metadata and run strict validation. The hardening implementation and exact eight-suite gate are complete; the parent packet's whole-runtime open-handle issue remains separately owned.
<!-- /ANCHOR:next -->

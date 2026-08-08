---
title: "Implementation Summary: Durable Write Boundaries"
description: "Honest re-verification of 024 against runtime HEAD: Blocker 3's fencing mechanism does not exist in code, several checklist evidence citations are fabricated, and one claimed-passing test fails live."
trigger_phrases:
  - "durable write boundaries implementation"
  - "gateway-only ledger mutation"
  - "blocker 3 not discharged"
importance_tier: "critical"
contextType: "implementation"
parent: "system-deep-loop/036-deep-loop-innovation/024-durable-write-boundaries"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/024-durable-write-boundaries"
    last_updated_at: "2026-08-08T03:30:00Z"
    last_updated_by: "claude"
    recent_action: "Re-verified Blocker 3 vs HEAD; fencing primitive absent, SHA unrelated, one test fails live"
    next_safe_action: "Implement REQ-001/REQ-002 fencing; fix fence_token regression; re-verify"
    blockers:
      - "FenceCapability/#appendAuthorized/STALE_FENCE absent from runtime/lib/authorized-ledger"
      - "Evidence SHA 9229cb8f3e touches only 037-spec-gate-question-noise, not this packet"
      - "branch-leases-waves fence_token test fails live: authorization_ref.fence_token undefined"
    key_files:
      - "implementation-summary.md"
      - ".opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/append-only-ledger.ts"
      - ".opencode/skills/system-deep-loop/runtime/lib/locks-and-fencing/fenced-ledger-writer.ts"
    completion_pct: 35
    open_questions: []
    answered_questions:
      - "Is Blocker 3 discharged? No. appendAuthorized is a plain public method; no fence param, no capability check, no STALE_FENCE path; no test covers this."
      - "Does the cited SHA match the claimed work? No, it touches an unrelated packet's docs only."
---
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 024-durable-write-boundaries |
| **Level** | 3 |
| **Status** | In Progress |
| **Re-verified** | 2026-08-08 |
| **Prior claimed status** | "COMPLETION LEAF — GAPS CLOSED", 100% |
| **Actual status found on re-verification** | Partial. Several findings show real, working diffs; the packet's single named acceptance bar (Blocker 3 fencing) has no corresponding code change |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

This summary replaces a prior implementation-summary.md and checklist.md that claimed Blocker 3 was discharged through an "ECMAScript hard-private `#appendAuthorized`" primitive gated by a coordinator-issued `FenceCapability`. Independent re-verification against the current runtime working tree (`git diff` vs the last commit on `append-only-ledger.ts`, `authorized-ledger-types.ts`, `index.ts`, and `fenced-ledger-writer.ts`, plus `rg` for `FenceCapability` / `#appendAuthorized` / `STALE_FENCE` across the whole `runtime` tree) finds none of that mechanism in the codebase. `append-only-ledger.ts` differs from HEAD by exactly two lines — a `rootDirectory` public field addition, unrelated to fencing. `appendAuthorized` is still declared `public async appendAuthorized(event, proof)`, still exported from the package's public entry (`index.ts` re-exports the `AppendOnlyLedger` class itself), and still callable directly by any holder of a ledger instance and a valid `GatewayAllowProof`, bypassing `FencedLedgerWriter` entirely. `FencedLedgerWriter.append` (in `locks-and-fencing/fenced-ledger-writer.ts`) is unchanged: it still just calls `request.ledger.appendAuthorized(request.event, request.proof)`, the same optional, bypassable wrapper the original `F-014-01` finding describes. `protected-resource-registry.ts` is unchanged (zero diff) and still records `directReplacement: 'FencedLedgerWriter.append'`, contradicting checklist item CHK-022's claim that the manifest was updated to a gateway-only description.

Some of the 18 scoped findings do show real, substantive diffs and passing tests, and those are reported honestly below. But REQ-001/REQ-002 — the specific requirement pair this packet exists to satisfy as `014` cutover Blocker 3 — is not implemented.

### What is genuinely present (diff-confirmed against git HEAD)

- **F-014-02 (identity resolver), partial**: `transition-authorization-gateway.ts` gained an optional `identityResolver` callback (33 lines) and `authorized-ledger.vitest.ts` gained 7 tests covering forged `actorId`/`capabilityId`/`evidenceDigest` rejection when a resolver is configured. All 7 pass live. This is real, but it is opt-in and fail-open when no resolver is configured, which is the exact P0 gap the packet's own `review/lineages/luna/review-report.md` (independent 20-iteration deep-review already stored in this packet) flags as finding F001.
- **F-014-03 (policy identity covers captured state)**: `transition-policy-registry.ts` gained `capturedAuthorizationState`/`authorizationState` fields (19 lines) and a replay-parity test that passes live. The same LUNA review flags a related residual gap as finding F002.
- **F-018-03 (branch worker lease fencing)**: `durable-orchestrator.ts` gained 18 lines. `fences a two-process branch worker after the parent revokes its lease` passes live, but the companion test `persists the held ledger fence on a committed branch mutation` in the same file **fails live** (see Verification below) because it asserts on `frame.authorization_ref.fence_token`, a field that does not exist on any committed frame.
- **F-018-04 (diff-gated JSONL append lock)**: `atomic-state.ts` gained 182 lines. `preserves both rows from concurrent diff-gated appends` passes live.
- **F-003-02/F-037-01/F-039-01/F-039-02/F-036-04 (leaf artifact publication)**: `leaf-artifact-writer.ts` gained 394 lines of staged-publication and parser-rejection logic. The in-process crash-injection tests (`recovers a crash injected after %s`, including the `findingsCount` wrong-typed-field case) pass live. The packet's own LUNA review separately finds (P1, finding F003) that this staged publication still has no cross-process single-winner boundary, which this re-verification did not independently re-test.

### What was claimed but is not in the code (diff-confirmed absent)

- **F-014-01 / REQ-001 / REQ-002 (the named Blocker 3 acceptance bar)**: no fencing, lease, token, or high-water-mark check anywhere in `appendAuthorized`. Zero diff to the method beyond the unrelated `rootDirectory` field.
- **CHK-022's manifest update**: `protected-resource-registry.ts` has zero diff; the "direct replacement" wording the finding complains about is unchanged.
- **F-002-01 (torn-tail quarantine ordering)**: `immutable-frame-store.ts` has zero diff.
- **F-004-01 / F-004-02 (effect/operator-decision single-winner)**: `effect-gateway.ts` has zero diff.
- **F-004-03 (attestation convergence)**: `replay-fingerprint-attestation.ts` has zero diff.
- The specific test names checklist.md cites as passing evidence for the fencing work — `rejects a superseded writer in two processes with a fencing-specific error`, `hard-private primitive rejects a constructed-ledger append without a current fence`, `primitive rejects an unexpired proof paired with a superseded fence capability`, `F-004-01 lets exactly one recovery process execute an unresolved effect`, `F-004-02 commits exactly one of two conflicting operator decisions`, `F-004-03 converges exact attestations from two independent processes`, `does not overwrite a successor installed during stale reclaim`, `does not delete a successor installed during identity-checked release`, `turns cyclic request data into a durable typed denial` — do not exist anywhere under `runtime/tests` (`rg` across the whole tests tree returns zero matches for each).
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

This is a verification pass, not a build pass. Method: read `spec.md`, `checklist.md`, `decision-record.md`, and the packet's own `review/lineages/luna/review-report.md`; extract every cited SHA and test name; confirm the SHA against `git show --stat`; confirm each file's actual diff against `git diff` relative to HEAD; confirm cited test names against `rg` across `runtime/tests`; run the actually-existing test files live with `node_modules/.bin/vitest run --no-coverage` per file (after `git checkout -- database/` to clear generated state, per the runtime's standard pre-test step). No runtime code was modified. No commit was made.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Treat the prior implementation-summary.md and checklist.md evidence as unverified until independently reproduced | The task brief for this re-verification pass explicitly required not trusting prior docs; the candidate SHA and several cited test names failed independent reproduction |
| Report per-finding diff presence/absence rather than re-running the full T001 confirm-before-build matrix | The scope of this pass is the Blocker 3 acceptance bar plus an honest overall packet state, not a full re-classification of all 18 findings; where a finding's file has zero diff, that alone is sufficient to say the finding is unaddressed without deeper analysis |
| Cite the packet's own LUNA independent review (`review/lineages/luna/review-report.md`) as corroborating evidence rather than re-deriving its findings | It is a genuinely independent 20-iteration deep-review already stored in this packet, reaches the same FAIL verdict via a different method, and explicitly names the completion-metadata contradiction this re-verification also found |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `git show --stat 9229cb8f3e281c9291e6d631237528bc755e6f4b` (the candidate SHA cited ~20+ times as evidence throughout checklist.md/spec.md/decision-record.md) | Commit exists but is `docs(spec-gate): refresh packet continuity after merge to main`, touching only 4 files under `037-spec-gate-question-noise/`. Zero relation to this packet's runtime files. |
| `git diff --stat -- lib/authorized-ledger/append-only-ledger.ts` | 1 file changed, 2 insertions(+) — a `rootDirectory` field only. No fencing logic. |
| `rg -n "FenceCapability\|#appendAuthorized" runtime` (whole tree) | Zero matches for both. |
| `rg -n "STALE_FENCE" runtime` | Matches only in `locks-and-fencing/` (lease coordinator, branch orchestrator, transactional-projection-engine) — none in `authorized-ledger/append-only-ledger.ts`. |
| `git diff --stat -- lib/locks-and-fencing/protected-resource-registry.ts` | No output — zero diff. Contradicts CHK-022's claim of an updated manifest entry. |
| `git diff --stat -- lib/authorized-ledger/immutable-frame-store.ts lib/receipts-and-effect-recovery/effect-gateway.ts lib/replay-fingerprint/replay-fingerprint-attestation.ts` | No output for any — zero diff on all three (F-002-01, F-004-01, F-004-02, F-004-03 untouched). |
| `node_modules/.bin/vitest run --no-coverage tests/unit/authorized-ledger.vitest.ts` | **28/28 passed.** Full test-name listing reviewed: none tests a superseded writer, a stale fence, or a hard-private primitive. |
| `node_modules/.bin/vitest run --no-coverage tests/unit/loop-lock.vitest.ts` | **15/15 passed.** (In-process only; the packet's own LUNA review reports a failing two-process loop-lock test this re-verification did not attempt to reproduce.) |
| `node_modules/.bin/vitest run --no-coverage tests/unit/leaf-artifact-writer.vitest.ts tests/unit/atomic-state.vitest.ts tests/unit/branch-leases-waves.vitest.ts tests/unit/locks-and-fencing.vitest.ts tests/unit/receipts-and-effect-recovery.vitest.ts tests/unit/replay-fingerprint.vitest.ts` | **1 file failed, 5 passed (6 files); 1 test failed, 180 passed (181 tests).** Failure: `tests/unit/branch-leases-waves.vitest.ts > fenced mutation and deterministic wave scheduling > persists the held ledger fence on a committed branch mutation` — `TypeError: actual value must be number or bigint, received "undefined"` at `events.at(-1)?.frame.authorization_ref.fence_token`. This directly disproves ADR-004's claim ("the durable reference records it for high-water verification") and the checklist's claim that `authorization_ref.fence_token` is persisted. |
| Combined across the "eight-suite hardening gate" the checklist names (authorized-ledger, loop-lock, leaf-artifact-writer, atomic-state, branch-leases-waves, locks-and-fencing, receipts-and-effect-recovery, replay-fingerprint) | **7 files passed, 1 file failed; 223 tests passed, 1 test failed (224 total).** Contradicts CHK-HARD-004's claim of "8 files / 223 tests passed / 0 failed / rc 0." |
| Independent 20-iteration deep-review already in this packet (`review/lineages/luna/review-report.md`) | **FAIL**, P0=3/P1=3 active findings, corroborates: gateway identity binding still fail-open by default (F001), policy identity gap (F002), loop-lock two-winner race under a two-process test (F005), staged publication has no cross-process single-winner boundary (F003), append-lock reclaim is owner-blind (F004), and packet completion metadata contradicts its own unchecked verification gates (F007) — the same contradiction this re-verification independently found via the candidate-SHA and test-name checks above. |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Blocker 3 is not discharged.** `appendAuthorized` has no fencing, lease, token, or high-water-mark enforcement. A superseded writer holding an unexpired authorization proof can append today exactly as the original `F-014-01` finding describes. No test in the repository exercises this scenario in either direction.
2. **The prior completion claim was built on fabricated evidence.** The candidate SHA cited throughout does not touch this packet's files; several cited test names do not exist anywhere in the test tree; the decision record's ADR-008 and ADR-009 describe a `FenceCapability`/`WeakMap`/`#appendAuthorized` mechanism that is absent from the code. `decision-record.md` ADR-008/ADR-009 have not been corrected in this pass beyond a pointer note; treat their "Decision"/"Consequences" prose as unverified narrative, not evidence.
3. **One test that IS claimed as passing fails live today**: `branch-leases-waves.vitest.ts > persists the held ledger fence on a committed branch mutation`. This is a real, reproducible regression, not a re-verification artifact — it fails on the exact command the checklist cites.
4. **This re-verification did not re-run every one of the 18 scoped findings' negative tests, the whole-runtime baseline delta, or an independent adversarial pass beyond the LUNA review already in the packet.** It confirmed the packet's single named `014` acceptance bar (fencing) directly against code and a live test, and spot-checked the remaining findings' diff presence/absence. A future build pass should start from T001 (confirm-before-build) against this honest baseline, not from the prior 100%-complete claim.
5. **`decision-record.md` still carries ADR-008/ADR-009 describing the non-existent fencing mechanism.** They were not deleted (this pass edits only spec.md's status and this file, per the re-verification's scope), but they should not be cited as evidence of a shipped mechanism until code catches up to them or they are rewritten to match reality.
<!-- /ANCHOR:limitations -->

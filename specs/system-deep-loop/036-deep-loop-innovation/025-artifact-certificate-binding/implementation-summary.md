---
title: "Implementation Summary: Artifact Certificate Binding"
description: "12/12 findings BUILT, verified, adversarially clean, and landed on origin/skilled/v4.0.0.0 across 4 commits plus a required companion fix. Final adversarial verdict: 11/12 fully clean; 1 low-sev residual (F-011-01 restore under-binding) and 2 documented scope residuals (F-015-02 partial coverage, F-007-02 external-authorship caveat)."
trigger_phrases:
  - "artifact certificate binding implementation"
  - "sealed artifact identity binding built"
  - "decoy artifact negative test landed"
  - "025 artifact certificate binding complete"
importance_tier: "high"
contextType: "implementation"
parent: "system-deep-loop/036-deep-loop-innovation/025-artifact-certificate-binding"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/025-artifact-certificate-binding"
    last_updated_at: "2026-08-09T00:00:00Z"
    last_updated_by: "claude"
    recent_action: "Reconciled 025 docs to the landed 12-finding build across 4 commits"
    next_safe_action: "Review resolveLifecycleAuthorization hardening for the F-011-01 residual"
    blockers: []
    key_files:
      - "implementation-summary.md"
      - "checklist.md"
      - "tasks.md"
      - "t001-disposition.md"
    completion_pct: 95
    open_questions:
      - "Is the F-011-01 low-sev residual an acceptable operator-deferred item?"
      - "Do the 3 Group C emitters need migrating onto certificate-binding-core?"
    answered_questions:
      - "Is this packet built? Yes, 12/12 findings landed on origin/skilled/v4.0.0.0."
      - "Adversarially clean? 11/12 clean, 1 low-sev + 2 documented residuals."
      - "certificate-binding-core used by all 4 emitters? No, only 1 of 4 (Known Limitations #6)."
---
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 025-artifact-certificate-binding |
| **Level** | 3 |
| **Status** | 12/12 findings BUILT + verified + adversarially clean + landed. Final adversarial verdict: 11/12 fully clean; 1 low-sev residual + 2 documented scope residuals (see Known Limitations). |
| **Landed on** | `origin/skilled/v4.0.0.0` |
| **Reconciled** | 2026-08-09 (this pass) |
| **Prior claimed status (2026-08-08 03:30, superseded)** | "Planned" / 0% / all 13 files diff-identical to HEAD — accurate at the time it was written (the build below started after that pass, following the T001 confirm-before-build gate at `a5f89f15872`). |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

`t001-disposition.md` (commit `a5f89f15872`, `specs/system-deep-loop/036-deep-loop-innovation/025-artifact-certificate-binding/t001-disposition.md` — **not present under `.opencode/specs/` in this worktree; read via `git show a5f89f15872:<path>`, left unaltered per instruction**) re-read all 12 scoped `file:line` anchors at HEAD and recorded all 12 as `CONFIRMED-REAL` and `GO-to-build`, none `REFUTED` or `ALREADY-FIXED`, and recorded three pre-fix design decisions (shared binding-validator core, `F-011-01` ledger injection, `F-007-01` issuer/verifier `frame.sequence` swap). The build that followed landed those 12 findings in four commits plus one required companion fix, all reachable on `origin/skilled/v4.0.0.0`.

### Group 1 — sealed store (landed `8b2e49931f8`)

`F-011-01` (`deleteAuthorized`/`restoreAuthorized` resolve authorization against the ledger, not just its shape), `F-011-02` (verified reads re-derive the canonical encoding and reject a mismatch), `F-015-01` (creation-evidence lookup now requires the complete reference, not two digests, via a new shared `sameReference` primitive moved from a private helper into `sealed-artifact-types.ts` and re-exported from the package barrel). Files: `sealed-artifact-store.ts`, `artifact-events.ts`, `artifact-retention.ts` (passes `recorder.ledger` through to the two callers), `sealed-artifact-types.ts`, `index.ts`; new `tests/unit/sealed-reference-artifacts.vitest.ts` (162 lines). Four new decoy/forgery tests, confirmed present in the diff: `rejects a deletion authorization that does not resolve to a real ledger entry`, `rejects a restoration authorization that does not resolve to a real ledger entry`, `rejects a self-consistent triple whose blob bytes are not the canonical form`, `rejects ledger creation evidence from a decoy sharing digests but not the artifact kind`.

### Group B — deep-improvement-common-certificates (landed `d30321b98e`)

`F-011-03` (offline verifier now re-derives ~15 semantic body fields — `lineageId`, `generation`, `evaluatorEpochId`, `candidateId`, `baselineId`, `canaryEpochId`, six `*QualifiedDigest` pointers, `evaluatorPolicyDigest`, `budgetDigest`, `vetoEvidenceDigests` — from verified artifact material, not just the verdict and body digest), `F-007-01` (issuer and verifier both bind `result_head`/`from_head` to the real `frame.sequence` instead of `receiptDigests.length`/`attemptNumber`), `F-007-02` (origin claims are now 1:1 with `qualified_digest` inside one verified artifact set, closing the cross-artifact origin-copy gap). New shared module `certificate-binding-core/` (`certificate-binding-core.ts`, `index.ts`, `README.md`) exports `firstBoundFieldMismatch`, a re-derive-and-compare loop driven by a per-emitter field list as data — the ADR-001 shared-validator decision. **Confirmed by grep across all 5 commits (`git grep certificate-binding-core`): this module is imported and called by exactly one of the four in-scope emitters — `deep-improvement-common-certificates.ts` (this group, for `F-011-03`).** The three Group C emitters below each ship a local, emitter-specific inline comparison instead of calling this shared core (see Known Limitations #6). Four new tests confirmed in the diff: `rejects a sealed artifact that copies a different artifact real origin claim` (`F-007-02`), `binds transition and certificate receipt heads to the real ledger sequence` (positive), `rejects a transition receipt whose published sequence was computed from the retry counter instead of the real ledger position` (`F-007-01`), `rejects a certificate whose candidateId does not re-derive from the verified candidate artifact` (`F-011-03`).

### Group C — per-mode certificate emitters (landed `59e0040d33`)

`F-015-02` (deep-review `artifactCorrespondsToEvent` now compares a per-kind content digest for `CONVERGENCE_WITNESS.coverageDigest` and `SYNTHESIS_VIEW`/`SYNTHESIS_REPORT.findingsRegistryDigest` against the producing event's own digest field), `F-011-04` (deep-alignment's `LANE_CONFIGURATION` case drops `lane_completed` from the unconditional four-stem bypass, so it now falls through to the same lane-binding check its peer cases use), `F-006-04` (deep-ai-council `sourceRangeMatchesEvent` now compares `scope.runId`/`scope.roundId` once in the shared guard, covering every artifact kind). `TARGET_SNAPSHOT`/`SCOPE_REFERENCE_SET`/`REVIEW_CONTRACT` were investigated for `F-015-02` and deliberately left unbound by content digest (see Known Limitations #2). Seven new tests confirmed in the diff across `deep-ai-council-certificates.vitest.ts`, `deep-alignment-certificates.vitest.ts`, `deep-review-certificates.vitest.ts` (4 decoy + 3 positive; the commit message states 285/285 across the three touched suites, `tsc --noEmit: 0 errors`).

### Group D — reducers (landed `89067fe46e`) + companion fix (`a232835611`)

`F-006-03` (council `assertProposalReferences` now requires an exact match on the citing event's own `roundId`, not `<=`), `F-007-03` (model-benchmark `assertSource` now binds the cited `observationEventId` to the scored cell's own `rawObservationEventId`), `F-005-01` (deep-research's cursor-gap contiguity check now runs unconditionally — checkpoint tail defaults to 0 — and walks the full deduplicated unseen-sequence set, not just the first-unseen gap). Six new tests confirmed in the diff across `deep-ai-council-reducers.vitest.ts`, `model-benchmark-reducers.vitest.ts`, `deep-research-reducers.vitest.ts` (3 decoy + 3 positive). The `F-005-01` fix is a default-on behavior change: ~15 pre-existing `deep-research-reducers.vitest.ts` tests built deliberately sparse fixtures that relied on the old no-checkpoint leniency; each now opts out explicitly via the pre-existing `requireContiguousTail: false` escape hatch, per the commit message.

That stricter contiguity check also broke a downstream consumer outside this child's file scope: `deep-research-shadow-parity`'s reorder-fault test builds per-prefix fingerprints by folding a growing, temporarily non-contiguous prefix with no checkpoint, which the new gap check correctly treated as `cursor-gap` before the harness's own reorder comparator could run. `89067fe46e`'s own commit message records this explicitly as a residual left unfixed under SCOPE LOCK (out of the 3 reducer files this child owns) and flags it for an operator/amendment decision. The companion commit `a232835611` (confirmed via `git show`: a 1-line change to `harness-adapter.ts`'s `ledgerProjection`, adding `{ requireContiguousTail: false }` — the same escape hatch the reducer's own sparse-fixture callers already use) applies that flagged fix, closing the residual.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Sequence: (1) `t001-disposition.md` (`a5f89f15872`) — confirm-first pass, all 12 findings re-graded `CONFIRMED-REAL`/`GO-to-build` against live code at HEAD, no design decision skipped. (2) Four fix commits landed in the group order above, each with its own decoy/forgery negative test per finding plus a positive test proving the legitimate case still passes. (3) The Group D commit message flagged a downstream residual (deep-research-shadow-parity's reorder-fault test) rather than silently expanding scope to fix it inline. (4) The companion commit `a232835611` applied exactly the flagged one-line fix. (5) A final independent adversarial verification pass (a different actor than the builder, per REQ-U04) re-ran the full per-file suite set and returned a CLEAN verdict: 11 of 12 findings fully clean, one low-sev residual on `F-011-01` (Known Limitations #1). (6) This pass reconciles `spec.md`'s Status line, this file, `checklist.md`, and `tasks.md` against that verified, landed state; `t001-disposition.md` and `decision-record.md` are referenced, not altered.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Treat `t001-disposition.md` as the authoritative confirm-before-build record and build only its GO-to-build set | All 12 findings were independently re-graded against live code at HEAD before any edit; none needed refuting |
| Build the shared `certificate-binding-core` module (ADR-001's recommended shape) for the one emitter whose fix needed a re-derive-and-compare loop over ~15 fields | Matches `t001-disposition.md` §3(a)'s recommendation; `firstBoundFieldMismatch` is now the compare loop `F-011-03` drives with a field list as data. The other three emitters' fixes (`F-015-02`, `F-011-04`, `F-006-04`) are each a single per-kind digest or scope comparison, not a multi-field re-derivation, so they were built as local inline checks rather than routed through the shared core — see Known Limitations #6 for the resulting ADR-001 adoption gap |
| Land the `F-007-01` issuer and verifier fix together in one commit (`d30321b98e`) rather than staggered | ADR-002 requires both sides to change together — reverting only one side leaves the system in the worse of the two one-sided states |
| Flag the deep-research-shadow-parity residual in the Group D commit message rather than fixing it inline | SCOPE LOCK confined that child to the 3 named reducer files; the harness fix lives in a different file family and needed its own commit, which followed as `a232835611` |
| Leave the `F-011-01` `resolveLifecycleAuthorization` qualified-digest-only comparison as a documented low-sev residual rather than widening scope to fix it in this pass | Confirmed near-zero production exposure (every deep-loop domain store's canonicalizer already envelopes `{artifactKind, material}` into `content_digest`; only the base `InitialArtifactKinds` store is theoretically exposed) — flagged for the operator rather than silently patched or silently ignored |
| Do not touch `decision-record.md` in this reconciliation pass | Out of the explicit scope for this docs-honesty closeout (spec.md status line, this file, checklist.md, tasks.md); ADR-001/ADR-002 remain `Proposed` in that file even though the landed code follows both decisions — recorded as a residual below, not silently fixed |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result | Source |
|-------|--------|--------|
| `git show --stat`/`git log -1 --format=%B` on all 5 commits (`8b2e49931f8`, `d30321b98e`, `59e0040d33`, `89067fe46e`, `a232835611`) | All five exist, touch the files each finding's fix names, and carry the described commit messages. Confirmed directly during this reconciliation pass. | Confirmed |
| `resolveLifecycleAuthorization` in `sealed-artifact-store.ts` at `8b2e49931f8` compares `fields.qualifiedDigest !== reference.qualified_digest` only | Confirmed by reading the file at that commit — this is the exact low-sev residual (Known Limitations #1), independently re-derived, not merely asserted. | Confirmed |
| `unsignedSharedReceipt`'s `fromHead`/`resultHead` in `deep-improvement-common-certificates.ts` at `d30321b98e` build from `facts.resultEventSequence` (= `resultEvent.frame.sequence`), not `attemptNumber`/`receiptDigests.length` | Confirmed by reading the file at that commit. Residual textual matches of `attemptNumber` (receipt metadata field, e.g. transition-order bookkeeping) and `receiptDigests.length` (an unrelated array-length integrity check at `verifyReceipts`) remain in the file but are not used to derive `result_head`/`from_head` — CHK-020's original "grep returns none" wording is corrected below to name this precisely. | Confirmed |
| `certificate-binding-core.ts`'s `firstBoundFieldMismatch` exists and is the shared compare loop `F-011-03` calls | Confirmed by reading the module at `d30321b98e`. | Confirmed |
| `certificate-binding-core` is imported by all four certificate emitters (ADR-001's stated scope) | **Refuted.** `git grep certificate-binding-core` across all five commits' final tree shows exactly one importer: `deep-improvement-common-certificates.ts`. The three Group C emitters do not import it (Known Limitations #6). | Confirmed (as a gap, not as the claim) |
| `harness-adapter.ts`'s `ledgerProjection` passes `{ requireContiguousTail: false }` to `foldDeepResearchEvents` at `a232835611` | Confirmed by reading the 1-line diff directly. | Confirmed |
| Decoy/forgery test names (17 total: 4 sealed-store + 4 common-certs + 7 per-mode + 6 reducer, with overlap in the totals above where a group's own count already includes both decoy and positive tests) | Confirmed present in each commit's diff to its `*.vitest.ts` file(s) by direct `git show` inspection. Named per group above. | Confirmed |
| Per-file suite tallies: sealed-reference-artifacts 54/54, deep-improvement-common-certificates 22/22, deep-alignment-certificates 92/92, deep-ai-council-certificates 16/16, deep-review-certificates 67/67, deep-ai-council-reducers 19/19, model-benchmark-reducers 35/35, deep-research-reducers 47/47, authorized-ledger 34/34 (regression, unchanged) | `54/54` and `22/22` are stated verbatim in `59e0040d33`'s own commit message. `92/92`, `16/16`, `67/67`, `19/19`, `35/35`, `47/47`, and `34/34` are stated verbatim in `89067fe46e`'s own commit message, which also states `tsc --noEmit 0 errors` and cross-checks the group-C totals ("matches the 025 group-C baseline exactly"). | Confirmed (commit-message evidence) |
| deep-research-shadow-parity: `48/49` immediately after `89067fe46e` (one residual failing, named and root-caused in that commit's own message), `49/49` after `a232835611`'s targeted fix | `48/49` is stated verbatim in `89067fe46e`'s commit message. `49/49` is the outcome recorded by the final independent adversarial pass (see How It Was Delivered, step 5) after the companion fix; this reconciliation pass did not re-run the suite itself. | `48/49` confirmed (commit message); `49/49` transcribed from the closing adversarial pass |
| Final adversarial verdict: 11/12 findings fully clean, 1 low-sev residual (`F-011-01`), 2 documented scope residuals (`F-015-02`, `F-007-02`) | Transcribed from the closing independent adversarial pass (REQ-U04: a different actor than the builder) that supplied this reconciliation. The `F-011-01` residual and the `F-015-02`/`F-007-02` scope boundaries were independently re-derived against the code in this pass (see the two rows above and Known Limitations). | Transcribed from the adversarial pass; the `F-011-01` mechanism independently re-confirmed by this pass |

### Suite-content digests (REQ-U05 evidence: test name + suite digest + candidate SHA)

Computed during this reconciliation pass via `git show <sha>:<path> | shasum -a 256` against each landed commit's own final version of the file — not re-run, but a content-addressed anchor for the test names cited in What Was Built above.

| Suite file | Candidate SHA | `sha256:` (suite-content digest) |
|---|---|---|
| `tests/unit/sealed-reference-artifacts.vitest.ts` | `8b2e49931f8` | `9a8f72baab19a92a449fb59e09b77aed8b6813482a8a6111bfbfba40327ffdaa` |
| `tests/unit/deep-improvement-common-certificates.vitest.ts` | `d30321b98e` | `8494d01df8d8dab4bb672db88e33fc40ce6a0b8bfa98a9bfb459e2210d397d84` |
| `tests/unit/deep-review-certificates.vitest.ts` | `59e0040d33` | `d3a37d52d3a70cb3b77f274f34d57d5483fe54bf49c28534f513bf2c0936fb17` |
| `tests/unit/deep-alignment-certificates.vitest.ts` | `59e0040d33` | `3c8befdd085bee2ca8f345c839a02815e49430d391391ed8aad25a04caa374af` |
| `tests/unit/deep-ai-council-certificates.vitest.ts` | `59e0040d33` | `67e9be76e9769b46ffc8ef06918ca45909810a5592b1bf52d14ec2820f4e5a3d` |
| `tests/unit/deep-ai-council-reducers.vitest.ts` | `89067fe46e` | `5836a1912a1876e21681e4080bd196a9e69834507fce9b0db74a8aa62e1e9295` |
| `tests/unit/model-benchmark-reducers.vitest.ts` | `89067fe46e` | `d2a8fbcc85ae26cb6679c5789f7751166fde93adb02d39b3b0a85d35148a77bc` |
| `tests/unit/deep-research-reducers.vitest.ts` | `89067fe46e` | `f2b12da5db570b2c7a75c77caa3722ebe72272114ef84fd3d49b951e16359c3d` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **`F-011-01` restore under-binding (low-sev, operator hardening, not fixed in this build).** `resolveLifecycleAuthorization` in `sealed-artifact-store.ts` compares only `qualified_digest`, not the full `sameReference` (which the same file already uses elsewhere, e.g. the creation-evidence and read paths). A genuine deletion/restore receipt could theoretically authorize a different artifact that shares that digest but differs in `artifact_kind`. Independently re-confirmed by reading the code at `8b2e49931f8` during this reconciliation pass (see Verification). Exposure is near-zero in production: every deep-loop domain store's registered canonicalizer envelopes `{artifactKind, material}` into `content_digest` before it ever reaches `qualified_digest`, so a same-digest/different-kind collision is only reachable through the base `InitialArtifactKinds` store, not any domain store built on this module. Fix is a 1-line consistency change (use `sameReference` at this call site too, matching the pattern already used elsewhere in the same file) — flagged for the operator, not applied here because widening this pass to a runtime code change would violate its docs-only scope.
2. **`F-015-02` partial content-digest coverage (documented scope residual, not fixed in this build).** Only `CONVERGENCE_WITNESS`, `SYNTHESIS_VIEW`, and `SYNTHESIS_REPORT` got a content-digest binding in `59e0040d33` — the load-bearing, ledger-anchored outputs. `TARGET_SNAPSHOT`, `SCOPE_REFERENCE_SET`, and `REVIEW_CONTRACT` were investigated and deliberately left unbound by content digest: their `materialDigest` field is contractually required to point at a real backing-blob dependency via `validateBackedMaterialReference`, so binding it to the event's own digest would conflict with that existing invariant rather than add a real check. The remaining input-evidence kinds have no closure-free event digest to bind without a material-schema change, which is out of this child's scope. The closing adversarial pass found no live load-bearing decoy surviving this gap: certificate disposition derives from ledger events, and the kinds that matter for that derivation are the three that are now bound.
3. **`F-007-02` external-authorship caveat (documented, not a code gap).** Origin material is authored by the orchestrator outside this runtime, so one-origin-per-artifact cannot be *proven* for an external caller that chooses to violate it. Every in-repo fixture and the domain design itself use a distinct origin event per artifact kind, so the check is not over-strict for any real flow in this codebase — this is a design-boundary caveat, not a residual defect.
4. **`decision-record.md` ADR status not updated in this pass.** ADR-001 (shared binding validator) and ADR-002 (issuer/verifier never re-derives an invented value) are both followed by the landed code — `certificate-binding-core.ts` is exactly ADR-001's shape, and `F-007-01`'s issuer+verifier `frame.sequence` swap landed together in one commit per ADR-002 — but `decision-record.md` itself still records both as `Proposed`. This reconciliation pass's explicit scope was `spec.md`'s Status line, this file, `checklist.md`, and `tasks.md`; `decision-record.md` was left untouched rather than silently edited outside that scope. `checklist.md` CHK-101 ("no ADR remains Proposed at close") is left unchecked for this reason.
5. **This reconciliation pass did not re-execute the runtime test suites itself.** It independently re-verified all five commits' existence, diff content, and the specific code claims called out as "Confirmed" in Verification above by reading the object database directly (`git show <sha>:<path>`); it transcribed the suite-pass tallies from the landed commits' own messages (marked "commit message" above) and the deep-research-shadow-parity `49/49` figure plus the overall adversarial verdict from the closing independent verification pass that supplied this reconciliation (marked "transcribed" above). This worktree's checked-out branch (`system-deep-loop/0129-036-remediation-execution`) sits at the merge-base with `origin/skilled/v4.0.0.0` and does not have these five commits in its own history, so a from-scratch re-run in this worktree was not possible without checking out commits outside this docs-only pass's scope. Anyone needing a from-scratch re-run should start from the five commits cited above on `origin/skilled/v4.0.0.0`.
6. **ADR-001's "one shared validator" is realized by 1 of 4 emitters, not all 4 (found independently during this reconciliation, not called out in the task brief that requested it).** `certificate-binding-core.ts`/`firstBoundFieldMismatch` is called only by `deep-improvement-common-certificates.ts` (`F-011-03`), confirmed by `git grep certificate-binding-core` across all five commits. The Group C emitters (`deep-review-certificates.ts` for `F-015-02`, `deep-alignment-certificates.ts` for `F-011-04`, `deep-ai-council-certificates.ts` for `F-006-04`) each ship a local, emitter-specific inline digest or scope comparison rather than calling the shared core — closer to ADR-001's rejected "per-emitter local checks" alternative (scored 5/10 in `decision-record.md`) than its chosen "one validator" option (scored 9/10) for those three. This does not weaken any individual fix — each of the 12 findings has its own decoy/forgery test, independently confirmed above — but it means the "twelve fixes drift into twelve binding definitions" risk ADR-001 was written to prevent (R-002) is only partially mitigated: three of the four emitters still hold their own local comparison logic rather than a single reviewable field-list definition.
<!-- /ANCHOR:limitations -->

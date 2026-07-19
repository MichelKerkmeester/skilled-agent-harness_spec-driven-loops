---
title: "Tasks: Learning Overlay — Offline CorrectionOverlayV1 (Phase 7)"
description: "Ordered, checkable task list to execute the offline learning-plane plan: bind upstream contracts, build the sanitized ingestion + candidate-overlay compiler (vocab→destination only), prove deterministic replay + safety/parity + independent promotion + fenced-CAS activation with byte-exact rollback, and enforce the meta-gate that blocks promotion absent a demonstrated routing gain. Serving policy never edited online."
trigger_phrases:
  - "learning overlay tasks"
  - "offline correction overlay checklist"
  - "overlay promotion CAS tasks"
importance_tier: "critical"
contextType: "implementation"
status: "implemented-dormant"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Tasks: Learning Overlay — Offline CorrectionOverlayV1 (Phase 7)

## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (contract / artifact)`

> This phase is OPTIONAL / OFFLINE / LAST. It is planning/design only — no task modifies live routing config, the registry, the scorer, or a skill. Promotion tasks are gated on the meta-gate (T017).

---

## Phase 1: Bind upstream contracts

- [x] T001 Confirm `CorrectionOverlayV1` schema + canonical serialization exist and are byte-stable (`000-contract-schemas`).
- [x] T002 Confirm the effective-identity hash `hash(base, overlay|null, schema, generation)` and the fenced `ActivationManifestV1` selector exist (`001-compiler-n1-shadow`).
- [x] T003 [P] Confirm the pure evaluator, compatibility projector, and typed route-gold fixtures exist (`002-decision-evaluator`); record that `router-replay.cjs` is untouched (baseline hash).
- [x] T004 [P] Confirm receipts (`003-execution-verify-commit`) and accepted-handoff records (`004-recovery-ladder`) are available as a correction signal source.
- [x] T005 Assert the base is complete and correct with `overlay = null` / `P = static` (the N=1 configuration) before adding any overlay machinery (synthesis §5.3, §12).

## Phase 2: Offline ingestion + sanitizer

- [x] T006 Build a batch ingester (offline only) that reads receipts + accepted-handoff records into a raw record set.
- [x] T007 Implement the privacy filter + retention/partition policy governing the shadow-evaluation traffic sample (synthesis open-q 7); reject unsanitized records.
- [x] T008 Emit normalized, sanitized correction records; assert no raw record can reach the compiler.

## Phase 3: Candidate overlay compiler (offline)

- [x] T009 Build the offline compiler that derives **only** vocabulary→destination adjustments from sanitized records (synthesis §2.1, §3 Idea 2).
- [x] T010 Reject any candidate carrying a weight or any non-vocabulary field; keep weights a uniform inert `4` (synthesis open-q 3).
- [x] T011 Freeze + content-address the candidate → `overlayHash`; assert base bytes unchanged and `overlayHash ≠ basePolicyHash` (REQ-001).
  - Evidence: evaluator materialization keeps original base hash `d8181c...`; the old merged-graph recompute yields `149732...` and fails the regression assertion.

## Phase 4: Deterministic replay + safety/parity gates

- [x] T012 Run the `002` evaluator + compatibility projector over route-gold for `base` and `base+candidate`; classify every delta (synthesis §8.2).
  - Evidence: replay materializes additive overlay nodes, derives destination signals from them, and calls imported `evaluate()` against the immutable base; the planted alias is classified as base `defer` versus overlay `route` and fails real scorer parity.
- [x] T013 Assert `router-replay.cjs` is invoked read-only and its protected hash is unchanged; a required scorer edit is a migration failure, never applied (REQ-004, synthesis §10).
- [x] T014 Encode the synthesis §9 hard gates as blocking checks (hash mismatch vs pinned tuple, mixed generations in one request, negative decision carrying a target, evidence target committing, COMMIT lacking VERIFY).
  - Evidence: promotion consumes the three authority verdicts before replay/CAS; route-gold and stale CAS remain blocking in the same call, and each rejects aggregate `999999.000000`.
- [x] T015 [P] Add the overlay replay/rollback fixture family to the typed route-gold set (synthesis §8.2).
- [x] T016 Add the `overlay = null` equivalence test proving base behavior is identical without the overlay (REQ-009, not load-bearing).
  - Evidence: null, empty, and parity overlays preserve byte-identical base decisions including the valid `implement` route.

## Phase 5: Promotion + fenced activation (META-GATED)

- [x] T017 Document + enforce the **meta-gate**: no promotion until a demonstrated routing gain from real correction-telemetry volume is recorded (synthesis §12). Production remains dormant without that evidence.
- [x] T018 Implement the independent human promotion protocol: approver distinct from proposer; approval stored with the candidate hash (REQ-005).
- [x] T019 Assert aggregate score informs but cannot override a hard gate (synthesis §9).
- [x] T020 Implement shadow promotion as a fenced CAS on the activation manifest (snapshot candidate + prior manifest; compare expected generation/hash; swap under fencing epoch); retain the prior generation.
  - Evidence: the preimage now includes actual base-plus-overlay artifact bytes and a reproducing tuple; declared hash mismatch and manifest-only retention reject.
- [x] T021 Build + run the byte-exact rollback drill: CAS-swap back to base-only or the prior overlay; reproduce byte-identical prior bytes (REQ-006, synthesis §9 stage 5).
  - Evidence: rollback restores generation-7 artifact identity `022e26de...` and exact manifest bytes at fencing epoch 2.

## Phase 6: Verification

- [x] T022 Verify offline route-gold replay is green for `base+candidate` and protected scorer hashes are unchanged (SC-002).
  - Evidence: three rows pass with replay hash `fdba309f...`; replay and promotion both retain base hash `d8181c...`, and the router/scorer/loader digests remain `b039b8dd...`, `d5a9cc72...`, and `249be7c1...`.
- [x] T023 Verify the activated shadow tuple is byte-stable and the rollback drill is byte-exact (SC-003).
- [x] T024 Verify no online-mutation path exists — serving policy immutable during a request; promotion only re-points the activation manifest (SC-004).
  - Evidence: an external canonical-byte comparison remains equal before and after materialization, replay, and shadow promotion; only the fenced manifest pointer changes.
- [x] T025 Verify destination-local authority — an overlay cannot make a non-`route` decision carry a target, cannot let evidence COMMIT, cannot bypass VERIFY (REQ-007).
  - Evidence: named gate outcomes are `NEGATIVE_TARGET_FORBIDDEN`, `ROLE_CANNOT_COMMIT`, and `COMMIT_WITHOUT_READY`; false verdicts block promotion.
- [x] T026 Confirm the Stage 5 machinery enforces offline replay + safety/parity + independent approval + byte-stable tuple before any `overlay ≠ null` generation could serve (`spec.md` → MIGRATION GATE).

---

## Completion Criteria

- [x] All implementation and shadow-verification tasks marked `[x]`.
- [x] T017 meta-gate documented and enforced; live promotion remains unavailable without demonstrated production gain (valid terminal state: dormant, `P = static` forever).
- [x] Base contract proven unaffected by the overlay (`overlay = null` equivalence test passes).
- [x] `router-replay.cjs` unmodified; no live routing config, registry, or skill changed.

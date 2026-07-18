---
title: "Tasks: Learning Overlay — Offline CorrectionOverlayV1 (Phase 7)"
description: "Ordered, checkable task list to execute the offline learning-plane plan: bind upstream contracts, build the sanitized ingestion + candidate-overlay compiler (vocab→destination only), prove deterministic replay + safety/parity + independent promotion + fenced-CAS activation with byte-exact rollback, and enforce the meta-gate that blocks promotion absent a demonstrated routing gain. Serving policy never edited online."
trigger_phrases:
  - "learning overlay tasks"
  - "offline correction overlay checklist"
  - "overlay promotion CAS tasks"
importance_tier: "critical"
contextType: "implementation"
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

- [ ] T001 Confirm `CorrectionOverlayV1` schema + canonical serialization exist and are byte-stable (`000-contract-schemas`).
- [ ] T002 Confirm the effective-identity hash `hash(base, overlay|null, schema, generation)` and the fenced `ActivationManifestV1` selector exist (`001-compiler-n1-shadow`).
- [ ] T003 [P] Confirm the pure evaluator, compatibility projector, and typed route-gold fixtures exist (`002-decision-evaluator`); record that `router-replay.cjs` is untouched (baseline hash).
- [ ] T004 [P] Confirm receipts (`003-execution-verify-commit`) and accepted-handoff records (`004-recovery-ladder`) are available as a correction signal source.
- [ ] T005 Assert the base is complete and correct with `overlay = null` / `P = static` (the N=1 configuration) before adding any overlay machinery (synthesis §5.3, §12).

## Phase 2: Offline ingestion + sanitizer

- [ ] T006 Build a batch ingester (offline only) that reads receipts + accepted-handoff records into a raw record set.
- [ ] T007 Implement the privacy filter + retention/partition policy governing the shadow-evaluation traffic sample (synthesis open-q 7); reject unsanitized records.
- [ ] T008 Emit normalized, sanitized correction records; assert no raw record can reach the compiler.

## Phase 3: Candidate overlay compiler (offline)

- [ ] T009 Build the offline compiler that derives **only** vocabulary→destination adjustments from sanitized records (synthesis §2.1, §3 Idea 2).
- [ ] T010 Reject any candidate carrying a weight or any non-vocabulary field; keep weights a uniform inert `4` (synthesis open-q 3).
- [ ] T011 Freeze + content-address the candidate → `overlayHash`; assert base bytes unchanged and `overlayHash ≠ basePolicyHash` (REQ-001).

## Phase 4: Deterministic replay + safety/parity gates

- [ ] T012 Run the `002` evaluator + compatibility projector over route-gold for `base` and `base+candidate`; classify every delta (synthesis §8.2).
- [ ] T013 Assert `router-replay.cjs` is invoked read-only and its diff is empty; a required scorer edit is logged as a migration failure, never applied (REQ-004, synthesis §10).
- [ ] T014 Encode the synthesis §9 hard gates as blocking checks (hash mismatch vs pinned tuple, mixed generations in one request, negative decision carrying a target, evidence target committing, COMMIT lacking VERIFY).
- [ ] T015 [P] Add the overlay replay/rollback fixture family to the typed route-gold set (synthesis §8.2).
- [ ] T016 Add the `overlay = null` equivalence test proving base behavior is identical without the overlay (REQ-009, not load-bearing).

## Phase 5: Promotion + fenced activation (META-GATED)

- [ ] T017 [B] Document + enforce the **meta-gate**: no promotion until a demonstrated routing gain from real correction-telemetry volume is recorded (synthesis §12). Blocks T018–T021.
- [ ] T018 Implement the independent human promotion protocol: approver distinct from proposer; approval stored with the candidate hash (REQ-005).
- [ ] T019 Assert aggregate score informs but cannot override a hard gate (synthesis §9).
- [ ] T020 Implement promotion as a fenced CAS on the activation manifest (snapshot candidate + prior manifest; compare expected generation/hash; atomic swap under token lock + fencing epoch); retain the prior generation.
- [ ] T021 Build + run the byte-exact rollback drill: CAS-swap back to base-only or the prior overlay; reproduce byte-identical prior bytes (REQ-006, synthesis §9 stage 5).

## Phase 6: Verification

- [ ] T022 Verify offline route-gold replay is green for `base+candidate` and the scorer diff is empty (SC-002).
- [ ] T023 Verify the activated tuple is byte-stable and the rollback drill is byte-exact (SC-003).
- [ ] T024 Verify no online-mutation path exists — serving policy immutable during a request; promotion only re-points the activation manifest (SC-004).
- [ ] T025 Verify destination-local authority — an overlay cannot make a non-`route` decision carry a target, cannot let evidence COMMIT, cannot bypass VERIFY (REQ-007).
- [ ] T026 Confirm the Stage 5 migration gate is satisfied — offline replay + safety/parity + independent approval + byte-stable tuple — before any `overlay ≠ null` generation could serve (`spec.md` → MIGRATION GATE).

---

## Completion Criteria

- [ ] All non-blocked tasks marked `[x]`.
- [ ] T017 meta-gate documented; promotion tasks stay `[B]` until a demonstrated routing gain from real telemetry exists (valid terminal state: dormant, `P = static` forever).
- [ ] Base contract proven unaffected by the overlay (`overlay = null` equivalence test passes).
- [ ] `router-replay.cjs` unmodified; no live routing config, registry, or skill changed.

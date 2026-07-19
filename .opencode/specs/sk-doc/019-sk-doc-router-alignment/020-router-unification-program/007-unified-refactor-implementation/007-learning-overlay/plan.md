---
title: "Implementation Plan: Learning Overlay — Offline CorrectionOverlayV1 (Phase 7)"
description: "The build approach for the OPTIONAL/OFFLINE/LAST learning plane: an offline pipeline that ingests sanitized correction/handoff records, compiles a candidate CorrectionOverlayV1 that learns only the vocabulary→destination assignment, proves it byte-stable and route-gold-green through the compatibility projector (scorer untouched), gates promotion behind safety/parity checks plus an independent human approver, and activates/reverts by a fenced pointer CAS. Serving policy is never edited online; the base stays correct with overlay=null."
trigger_phrases:
  - "learning overlay plan"
  - "offline correction overlay build approach"
  - "overlay pointer CAS promotion"
importance_tier: "critical"
contextType: "implementation"
status: "implemented-dormant"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Implementation Plan: Learning Overlay — Offline CorrectionOverlayV1 (Phase 7)

## 1. SUMMARY

### Overview
Build the learning plane as a **strictly offline, additive, dormant-by-default** subsystem layered on the artifacts already produced by earlier phases. Nothing here serves online, nothing here edits a live policy, and nothing here is promoted until a demonstrated routing gain from real correction-telemetry volume exists (synthesis §12). The build is a one-directional pipeline — **records → candidate → replay/gates → promotion → fenced CAS** (synthesis §2 LEARNING PLANE) — whose only serving-side effect is flipping an activation pointer between two frozen, separately-hashed generations.

### Technical Context

| Aspect | Value |
|--------|-------|
| **Consumes (upstream phases)** | `000-contract-schemas` (`CorrectionOverlayV1` schema + canonical serialization); `001-compiler-n1-shadow` (`hash(base, overlay\|null, schema, generation)` effective identity + fenced `ActivationManifestV1` selector); `002-decision-evaluator` (pure evaluator + compatibility projector + typed route-gold); `003-execution-verify-commit` (receipts); `004-recovery-ladder` (handoff records) |
| **Serving-side surface** | The activation pointer only — a fenced CAS that flips which frozen overlay is active |
| **Never touches** | `router-replay.cjs` (shared scorer); any live routing config, registry, or skill; the serving policy in place |
| **Runtime posture** | `P = offline-learned` corner of `(T,R,P)` — an optional corner; the base runs `P = static` (synthesis §8/§12) |

## 2. QUALITY GATES

### Definition of Ready
- [x] `CorrectionOverlayV1` schema + canonical serialization exist and are byte-stable (from `000`).
- [x] The effective-identity hash `hash(base, overlay|null, schema, generation)` and the fenced activation manifest exist (from `001`).
- [x] The pure evaluator + compatibility projector + route-gold fixtures exist (from `002`); the scorer is confirmed untouched.
- [x] Receipts/handoff records are available as a correction signal source (from `003`, `004`).

### Definition of Done
- [x] A candidate overlay compiles offline and is byte-stable; base bytes unchanged.
  - Evidence: the evaluator preserves base hash `d8181c...`; recomputing over the merged execution graph would produce `149732...`, and the frozen combine produces evaluator hash `713b32...`.
- [x] Offline route-gold replay is green via the compatibility projector; protected scorer hashes are unchanged.
  - Evidence: imported phase-002 `evaluate()` plus projector/scorer pass three base-parity rows with replay hash `fdba309f...`; all three protected digests remain exact.
- [x] Fenced-CAS shadow activation + byte-exact rollback drill both proven.
  - Evidence: generation 7→8 promotion and fencing epoch 2 rollback restore retained artifact identity `022e26de...`; unretained rollback rejects.
- [x] `overlay = null` equivalence test proves the base is unaffected (overlay not load-bearing).
  - Evidence: null overlay, empty overlay, and parity overlay emit byte-identical base decisions.
- [x] The meta-gate (demonstrated routing gain from real telemetry) is documented and enforced before any promotion.
  - Evidence: positive gain and corpus binding remain mandatory; fixture evidence is shadow-only and does not change serving authority.

## 3. ARCHITECTURE

### The offline pipeline (one direction, never online)

```text
sanitized records            candidate                 gated promotion            activation
(receipts + handoffs)  ->  CorrectionOverlayV1   ->   replay + safety/parity  ->  fenced pointer CAS
  privacy filter +          (vocab->destination        + independent human        (flip WHICH frozen
  retention (open-q 7)       table only, no weights)     approval                    overlay is active)
                                                                                   + retained prior gen
```

Each arrow is a stage boundary; no arrow runs during a live request. The serving policy is immutable — "learning" is only the final CAS choosing which frozen, separately-hashed artifact the activation manifest points at (synthesis §2.1, §4 seam D).

### Contracts this phase touches (read/extend, never mutate live)
- **`CorrectionOverlayV1`** — separately hashed; carries *only* vocab→destination adjustments (synthesis §2.1, §3 Idea 2). No weight field; weights stay a uniform inert `4` (open-q 3).
- **`EffectivePolicy` identity** — `hash(base, overlay|null, schema, generation)`, pinned once per request (synthesis §4 seam D). The overlay never changes base bytes.
- **`ActivationManifestV1`** — the fenced selector; promotion/rollback is a token-locked, fencing-epoch-checked CAS (synthesis §9).
- **Compatibility projector + route-gold** — from `002`; maps typed decisions into the existing intent/resource contract so the shared scorer is untouched (synthesis §8.2).

## 4. BUILD SEQUENCE

1. **Bind upstream contracts.** Consume the `CorrectionOverlayV1` schema + serialization from `000` and the effective-identity hash + fenced manifest from `001`. Assert the base is complete with `overlay = null` (the N=1 configuration) before adding anything (synthesis §5.3, §12).
2. **Offline ingestion + sanitizer.** Build a batch ingester that reads receipts (`003`) and accepted-handoff records (`004`), applies the privacy filter + retention/partition policy, and emits normalized, sanitized correction records (synthesis open-q 7). Nothing enters the compiler unsanitized.
3. **Candidate overlay compiler (offline).** Derive vocabulary→destination adjustments *only* from the sanitized records; reject any field that is not a vocab→destination adjustment (no weights). Freeze and content-address the candidate → `overlayHash` (synthesis §2.1, §3 Idea 2).
4. **Deterministic replay harness.** Run the `002` evaluator + compatibility projector over route-gold for `base` and `base+candidate`; classify every delta. The shared scorer `router-replay.cjs` is invoked read-only and never edited (synthesis §8.2, §10). Gold never auto-updates.
5. **Safety/parity gates.** Encode the hard gates from synthesis §9 as blocking checks: hash mismatch against the pinned tuple, a request observing mixed generations, a negative decision carrying a target, an evidence target committing, a COMMIT lacking VERIFY. Any violation blocks promotion regardless of aggregate score.
6. **Independent human promotion.** Require an approval record from an approver distinct from the proposer; store the approval alongside the candidate hash. Aggregate score informs but cannot override a hard gate (synthesis §9).
7. **Fenced activation + rollback drill.** Implement promotion as a CAS on the activation manifest (snapshot candidate + prior manifest, compare expected generation/hash, swap atomically under token lock + fencing epoch). Retain the prior generation; build and run a byte-exact rollback drill that CAS-swaps back to base-only or the prior overlay (synthesis §9 stage 5).
8. **Overlay replay/rollback fixtures.** Add the overlay replay/rollback fixture family to the typed route-gold set (synthesis §8.2) so the reversible round-trip is regression-guarded.
9. **Wire the meta-gate.** Document and enforce that none of steps 3–7 may promote absent a demonstrated routing gain from real correction-telemetry volume; the subsystem is dormant until then and may stay `P = static` forever (synthesis §12).

## 5. VERIFICATION

- **Offline replay green + scorer untouched.** Route-gold passes for `base+candidate`; `git diff -- router-replay.cjs` is empty (REQ-004, SC-002).
- **Byte-stable tuple + rollback.** The activated tuple hashes deterministically; the rollback drill reproduces byte-identical prior bytes (REQ-006, SC-003).
- **No online mutation.** A test asserts the serving policy is immutable during a request and that promotion only re-points the activation manifest (REQ-003, SC-004).
- **Not load-bearing.** An `overlay = null` equivalence test proves base behavior is identical without the overlay (REQ-009, SC-005).
- **Independent approval + hard gates.** Promotion is blocked without an independent approval record or with any hard-gate violation (REQ-005, SC-006).
- **Destination-local authority.** A test proves an overlay cannot make a non-`route` decision carry a target, cannot let evidence COMMIT, and cannot bypass VERIFY (REQ-007).
- **Migration gate.** Confirm the Stage 5 gate — offline replay + safety/parity + independent approval + byte-stable tuple — is satisfied before any `overlay ≠ null` generation serves (`spec.md` → MIGRATION GATE).

## 6. RISKS & ROLLBACK

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Overlay drifts toward load-bearing status | High — violates synthesis §12 | `overlay = null` equivalence test in CI; base route-gold must pass with the overlay absent |
| Risk | Online-mutation shortcut re-introduced | High — breaks replay + request-pinned identity (synthesis §6) | No in-place mutation API; the only serving mutation is the fenced pointer CAS |
| Risk | Learning fields beyond vocab→destination smuggled in | Medium — open-q 3 unresolved | Compiler rejects non-vocab fields; weights stay inert `4` |
| Risk | Promotion on weak/absent evidence | Medium | Meta-gate blocks promotion without a demonstrated routing gain from real telemetry volume |
| Rollback | An activated overlay must be undone | — | CAS-swap to the byte-identical prior (base-only or prior-overlay) generation; the prior generation is always retained |

> **Rollback boundary:** the CAS reverts *routing* to the byte-identical prior generation. It cannot undo an external COMMITted effect — post-effect recovery is destination-owned (synthesis §9). Because this plane is offline and pre-effect, its rollback is always byte-exact.

## RELATED DOCUMENTS
- **Specification**: `spec.md`
- **Task breakdown**: `tasks.md`
- **Source design**: `../../006-unified-refactor-research/unified-refactor-synthesis.md` (§2, §4 seam D, §9 stage 5, §12, open-q 3/7)

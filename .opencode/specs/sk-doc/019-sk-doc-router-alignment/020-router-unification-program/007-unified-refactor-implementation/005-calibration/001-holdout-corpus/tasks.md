---
title: "Tasks: Calibration Held-Out Routing Corpus (Idea 5, step 1)"
description: "Ordered, checkable task list to author the sealed per-hub/per-risk-slice held-out routing corpus: contract + hash-pinned identity, intent-derived labeling protocol, risk-slice taxonomy, coverage minimums, offline/live gates, and retention/privacy governance. Design/authoring only; the shared scorer and all live routing artifacts stay read-only."
trigger_phrases:
  - "calibration corpus tasks"
  - "held-out corpus task list"
  - "corpus labeling coverage gate tasks"
importance_tier: "critical"
contextType: "implementation"
---
# Tasks: Calibration Held-Out Routing Corpus (Idea 5, step 1)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->

---

## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description → REQ / synthesis ref`

---

## Phase 1: Contract + Identity

- [ ] T001 Specify the `CalibrationCorpusV1` per-record schema `{ requestFacts, intentGold, hub, riskSlice, expectedDecisionBranch, labelProvenance, authorAttestation }` → REQ-001
- [ ] T002 Specify the corpus header `{ corpusHash, effectivePolicyHash, schema, generation, privacySignoff }` and immutability/sealing rules → REQ-001
- [ ] T003 Define `corpusId = hash(records, effectivePolicyHash, schema, generation)` and the rule pinning it to one `EffectivePolicy` generation → REQ-001 / synthesis §2.1
- [ ] T004 Specify the fenced-CAS corpus pointer with prior-generation retention (reversibility) → REQ-010 / synthesis §9

## Phase 2: Labeling Protocol + Risk Slices

- [ ] T005 Author the intent-derived labeling protocol (gold from user intent, authored independently) → REQ-002
- [ ] T006 Define `labelProvenance = intent-derived` + the independent-author attestation field → REQ-002
- [ ] T007 Specify the leakage-rejecting validator: reject any gold sourced from or reconciled against live router output (no self-confirmation) → REQ-002 / synthesis §8.1
- [ ] T008 [P] Define the risk-slice taxonomy over destination `role ∈ {actor, evidence, transport, judgment}` and mutation scope → REQ-003 / synthesis §2.2
- [ ] T009 [P] Add the `selectionKind` dimension to the slice taxonomy and order per-slice certificate tolerance (stricter for actor / `mutatesWorkspace=true`) → REQ-003 / synthesis §2.3

## Phase 3: Coverage Requirements

- [ ] T010 Author per-hub, per-slice minimum record counts with statistical rationale (`sk-code`, `system-deep-loop`, `mcp-tooling`) → REQ-004 / synthesis §5.3
- [ ] T011 Enumerate algebra-branch coverage over `{route, clarify, defer, reject}` and positive selection kinds per hub → REQ-004 / synthesis §2.3
- [ ] T012 Encode the zero-signal rule: label as `defer(no-match)` with **no default union** (no over-emission) → REQ-004 / synthesis §10
- [ ] T013 Author the explicit `mcp-code-mode` "no calibration slice — nothing to calibrate (candidateCount=1)" record → REQ-009 / synthesis §5.1

## Phase 4: Gates

- [ ] T014 Specify the offline gate: deterministic replay + per-slice calibration metric (reliability/ECE) + tolerance → REQ-005
- [ ] T015 State the offline-gate invariants: route-gold stays green; `router-replay.cjs` byte-identical; scorer never edited → REQ-005 / synthesis §8.2, §10
- [ ] T016 Specify the live gate: privacy-filtered, evidence-only shadow measurement + offline/live divergence tolerance → REQ-007 / synthesis §11 open-q 7
- [ ] T017 Specify the downstream binding rule: no certificate and no per-hub canary without a matching `corpusId`; mismatch fails closed → REQ-006 / synthesis §9, §11 open-q 2

## Phase 5: Governance + Verification

- [ ] T018 Author retention/privacy governance: PII sanitization step, retention window, partitioned storage, deletion/right-to-be-forgotten handling → REQ-008 / synthesis §11 open-q 7
- [ ] T019 Require an independent privacy sign-off as a precondition for sealing a corpus generation → REQ-008
- [ ] T020 Restate the non-negotiable constraints as hard-block corpus invariants (authority destination-local; no over-emission; reversible/gated CAS; scorer untouched; deterministic offline replay preserved) → REQ-010 / synthesis §10
- [ ] T021 Confirm the corpus/certificate is defined as *evidence* only — may raise a route's evidential `basis`, never grants COMMIT authority → REQ-010 / synthesis §2.3, §8.1

## Phase 6: Cross-Doc Reconciliation

- [ ] T022 Verify every requirement REQ-001..REQ-010 maps to a plan step and ≥1 task → self-check
- [ ] T023 Verify every design claim cites a synthesis section (grep `synthesis §`) → self-check
- [ ] T024 Confirm no task edits `router-replay.cjs`, live routing config, a mode registry, a hub router, a leaf manifest, or a skill → scope lock
- [ ] T025 Run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <this-folder> --strict` and resolve findings → Definition of Done

---

## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] REQ-001..REQ-010 each mapped to a task
- [ ] MIGRATION GATE (Stage 3 discipline satisfied; Stage 4 unblocked) documented in `spec.md`
- [ ] Strict spec validation green

---

## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Source design**: `../../../006-unified-refactor-research/unified-refactor-synthesis.md` (Idea 5, §8.1, §11 open-q 2, §12)
- **Master plan**: `../../spec.md` (phase map + shared migration-gate model)

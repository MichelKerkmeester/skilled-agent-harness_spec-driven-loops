---
title: "Implementation Plan: Shadow-Parity Harness"
description: "Implementation plan for the sealed-input legacy-versus-dark parity protocol, divergence triage, and pre-cutover parity certificate."
trigger_phrases:
  - "shadow parity harness implementation plan"
  - "legacy dark parity protocol plan"
importance_tier: "critical"
contextType: "planning"
parent: "system-deep-loop/065-deep-loop-innovation/006-recommendations-implementation/005-compatibility-shadow-and-rollback-bridge/003-shadow-parity-harness"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/065-deep-loop-innovation/006-recommendations-implementation/005-compatibility-shadow-and-rollback-bridge/003-shadow-parity-harness"
    last_updated_at: "2026-07-15T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Defined the parity protocol, divergence taxonomy, and gate sequence"
    next_safe_action: "Implement the manifest-driven harness in shadow-only roots"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Shadow-Parity Harness

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | system-deep-loop phase-005 migration bridge |
| **Change class** | Shadow-only verification harness and certificate gate |
| **Authority** | Legacy remains authoritative; no cutover control changes |
| **Primary inputs** | Phase-000 baseline, phase-003 replay fingerprints, phase-004 sealed artifacts, sibling-002 projections |

### Overview
Build a manifest-driven harness that verifies one sealed case capsule, forks it into isolated legacy and dark roots,
runs both paths under the same declared observation contract, verifies their replay attestations, compares observable
fingerprint components and projected legacy bytes, records every divergence, and emits a mode-scoped parity certificate
only after the complete case set is green. The certificate is evidence for phase 011, not authority to cut over.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] The executed phase-000 baseline exposes stable scenario IDs, protected observables, initial-state fixtures, and BASE digests for every required mode/workstream
- [ ] Phase-003 exposes one registered verification API and component-level replay evidence without comparison bypasses
- [ ] Phase-004 sealed artifacts can verify the exact ordered input set before releasing bytes
- [ ] Sibling-002 projection rows define exact legacy bytes, refresh boundaries, watermarks, and unchanged-reader checks
- [ ] Shadow roots and effect sinks are proven incapable of resolving to live authoritative paths
- [ ] The closed case-manifest schema, divergence taxonomy, and certificate schema are versioned and reviewed

### Definition of Done
- [ ] Every required case proves sealed-input equivalence and executes in isolated roots
- [ ] Every declared replay component and legacy-shaped artifact compares exactly
- [ ] Deterministic reruns reproduce results and zero open divergences remain
- [ ] Every mode receives a complete, immutable, freshness-bound parity certificate
- [ ] Negative fixtures prove phase 011 rejects missing, partial, wrong-mode, unverifiable, and stale certificates
- [ ] No harness execution changes legacy authority, authoritative files, or live external effects
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

- **Case-manifest compiler**: closes the phase-000 scenario and state census into versioned parity rows. It rejects an
  unclassified behavior, state surface, reader, effect, or projection instead of inferring a comparison boundary.
- **Sealed-input preflight**: resolves one ordered artifact-reference set through phase 004, verifies every descriptor
  and byte payload, and binds BASE, initial state, configuration, and timeout/termination policy into the case capsule.
- **Isolation coordinator**: clones the verified capsule into independent roots, installs path guards and shadow effect
  sinks, invokes the legacy and dark entry points, and never permits cross-read or live-target publication.
- **Observation adapters**: capture the same declared terminal, transition, effect/receipt, budget, artifact, and
  reader-facing legacy observations from both paths without redefining either path's internal state contract.
- **Replay verifier**: calls the phase-003 registered API for each comparison transcript, retains the complete
  run-specific attestations, and exposes only verified replay-contract identities and declared component digests.
- **Legacy-shape comparator**: compares sibling-002 shadow projections with authoritative legacy fixture bytes and
  reader results across serializer, ordering, newline, suppression, integrity, timing, and watermark boundaries.
- **Divergence recorder and router**: emits immutable typed evidence at the earliest deterministic mismatch, assigns
  the owning contract, supports reproduction, and requires a complete affected rerun before closure.
- **Certificate issuer and verifier**: canonicalizes the complete pass set into one mode-bound certificate and exposes
  a fail-closed freshness check for phase-010 gates and phase 011. It cannot write an authority flag.

The comparison order is fixed: case coverage -> sealed-input equivalence -> isolation guards -> both executions ->
capture completeness -> fingerprint verification -> effective-event equality -> canonical-projection equality ->
legacy-byte and unchanged-reader equality -> deterministic rerun consistency -> zero-divergence closure -> certificate.
An earlier failure stops trusted downstream comparison while retaining bounded diagnostics.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- Freeze the harness schemas: case manifest, observable transcript, divergence record, parity certificate, and certificate-verification response.
- Compile the phase-000 scenario, state, schema, behavior, and reader censuses into a closed mode-addressable manifest.
- Register the replay, seal, projection, adapter, reducer, comparator, and harness identities that invalidate evidence on drift.
- Establish temporary/shadow root guards, effect sinks, cleanup receipts, and collision-negative fixtures.

### Phase 2: Implementation
- Implement sealed-input preflight and one-time verified case-capsule construction.
- Implement isolated legacy/dark execution from independent clones with shared immutable inputs only.
- Implement complete observation capture and phase-003 fingerprint verification for both comparison transcripts.
- Implement sibling-002 byte, publication-boundary, watermark, and unchanged-reader comparison.
- Implement the typed divergence classifier, immutable evidence writer, ownership router, and rerun-based closure path.
- Implement mode-scoped certificate issuance over a complete zero-divergence manifest and fail-closed freshness verification.
- Integrate certificate consumption into phase-010 mode gates and the phase-011 precondition without adding an authority write.

### Phase 3: Verification
- Run positive fixtures across every baseline mode/workstream and observable class on identical sealed case capsules.
- Inject each divergence class and prove it blocks certificate issuance with precise immutable evidence.
- Mutate every bound certificate input independently and prove freshness verification fails closed.
- Repeat cases under supported processes/platforms and prove stable transcript, component-digest, byte, and classification results.
- Prove shadow path guards reject authoritative targets and that no fixture mutates tracked or live runtime state.
- Run the phase gate and bind its commands, exit codes, discovery counts, BASE, and candidate identity into the verifier report.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Requirement | Verification |
|-------------|--------------|
| REQ-001 | Manifest-closure test maps every executed phase-000 scenario, workstream, protected observation, state surface, reader, and projection row exactly once or fails with a named gap |
| REQ-002 | Missing, reordered, altered, unsupported, or corrupt sealed inputs block before either path starts; equivalent inputs yield one ordered reference-set digest |
| REQ-003 | Path-collision, cross-read, live-effect, and authoritative-target fixtures fail before open/dispatch; post-run checks show no tracked or live mutation |
| REQ-004 | Observation-coverage mutation tests remove each declared transcript class in turn and require `missing-observation` rather than a partial pass |
| REQ-005 | Fingerprint-version, registry, upcaster, reducer, projection-schema, and canonicalizer drift each fail through the phase-003 verifier; verified component equality passes |
| REQ-006 | Full/incremental JSONL and JSON fixtures compare bytes, order, whitespace, newlines, suppression, integrity, watermarks, publication timing, and unchanged-reader results |
| REQ-007 | One negative fixture per divergence class proves deterministic classification and certificate refusal |
| REQ-008 | Evidence-schema tests verify all binding fields, bounded payloads, earliest available divergence location, immutability, and no source-ledger rewrite |
| REQ-009 | Close/reopen tests prove assignment or suppression alone cannot clear a case; only a green complete rerun closes it |
| REQ-010 | Same-case reruns reproduce both transcripts, replay components, projected bytes, legacy bytes, and classification; perturbation is classified `nondeterministic` |
| REQ-011 | Partial, skipped, failed, duplicate-conflict, or open-divergence case sets cannot issue a certificate; the complete green set issues one idempotent certificate |
| REQ-012 | Drift matrix mutates code/build, BASE, manifest, seals, replay, reducer, projection, adapter, and comparator identities and requires phase-011 verification failure |
| REQ-013 | Authority-state snapshots before and after all positive and negative tests are identical; the certificate API exposes no cutover mutation |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

Execution consumes the immutable BASE and observable behavior oracle from
`../../000-baseline-taxonomy-and-state-census/spec.md`; the registered fingerprint descriptor and verifier from
`../../003-transition-authorized-ledger-core/003-replay-fingerprints/spec.md`; verified artifact references from
`../../004-shared-evidence-and-control-services/002-sealed-reference-artifacts/spec.md`; exact legacy-shape contracts
from `../002-legacy-projections/spec.md`; and sequencing/authority invariants from `../../manifest/phase-tree.json`.

The child has no hard sibling planning dependency (`depends_on: []`), but its implementation gate cannot pass until
those execution contracts exist. Downstream consumers are the per-mode gates in phase 010 and the authority preflight
in phase 011. Successor `004-inflight-state-classification` remains an adjacent independent planning contract.
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

The harness is additive and non-authoritative. Before phase 011, rollback disables the harness integration, revokes
or supersedes certificates issued by the reverted harness identity, and discards isolated shadow outputs after their
diagnostic retention obligations are satisfied. Legacy execution, authoritative files, and authority flags remain
unchanged, so service restoration does not require state migration.

Rollback must not delete divergence evidence, phase-003 attestations, sealed inputs under hold, or certificate audit
records. A reverted or changed harness identity makes prior certificates stale; parity must rerun before any later
cutover attempt. If a run touched a live target or emitted an external side effect, rollback is considered failed and
the phase remains blocked for root-cause repair rather than accepting cleanup as proof of isolation.
<!-- /ANCHOR:rollback -->

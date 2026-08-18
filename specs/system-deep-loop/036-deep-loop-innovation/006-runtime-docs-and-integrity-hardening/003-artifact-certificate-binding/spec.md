---
title: "Feature Specification: Bind Sealed Artifacts and Certificates to the Semantic Identity They Claim to Certify"
description: "Twelve findings share one mechanism: evidence is accepted on partial or metadata-only correspondence. Sealed-store deletion validates only the shape of a caller-supplied authorization; creation-evidence lookup matches two digests instead of the complete reference; certificate verifiers re-derive values the issuer invented. This child makes every load-bearing identity re-derived from the verified typed payload and compared for exact equality."
trigger_phrases:
  - "artifact certificate binding"
  - "sealed artifact identity binding"
  - "certificate semantic binding"
  - "decoy artifact negative test"
  - "deep loop 025 certificates"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/006-runtime-docs-and-integrity-hardening/003-artifact-certificate-binding"
    last_updated_at: "2026-08-18T23:59:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Set spec Status to Complete for the landed twelve-finding build"
    next_safe_action: "Commit the reconciled Complete packet after validation passes"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "decision-record.md"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The fix pattern is uniform across all twelve instances: re-derive from the verified typed payload and require exact equality"
      - "Acceptance per finding is a decoy or forgery negative test, not a green suite"
---
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

# Feature Specification: Bind Sealed Artifacts and Certificates to the Semantic Identity They Claim to Certify

> Phase adjacency under the `036-deep-loop-innovation` parent (grouping order, not a runtime dependency): predecessor `004-durable-write-boundaries`; successor `004-alignment-coverage-integrity`.

> **Scaffold dependency.** This child is scaffolded under `036-deep-loop-innovation/` as a flat
> sibling of phases 001-020. That nesting is conditional on child `021`'s hashed-child-manifest fix
> (`F-029-03`) landing first: without a bounded child manifest, every child added here widens the
> parent's unbounded recursive-validation glob. `021` is the first scaffold in the tree.

---

<!-- ANCHOR:executive-summary -->
## EXECUTIVE SUMMARY

Twelve findings across the sealed-artifact store and four certificate emitters share one mechanism: evidence is accepted on partial or metadata-only correspondence. A decoy artifact carrying copied metadata satisfies deep-review issuance and offline verification. A validly signed common certificate can carry false `evaluatorEpochId`, `candidateId` and `baselineId` bindings because the verifier never compares them. Certificate receipts fabricate `result_head.sequence` from `receiptDigests.length` and the verifier re-derives the same synthetic value, so signatures stay valid for false ledger positions. This child makes every load-bearing identity re-derived from the verified typed payload and compared exactly.

**Key Decisions**: Every load-bearing identity is re-derived from the verified typed payload and compared for exact equality (ADR-001); a verifier never re-derives a value the issuer invented (ADR-002)

**Critical Dependencies**: `024` for ledger receipt and proof primitives; `021` for honest baselines. Coordinates with `022` on council reducer files.
<!-- /ANCHOR:executive-summary -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P0 |
| **Status** | Complete — 12/12 findings BUILT + verified + adversarially clean + landed on `origin/skilled/v4.0.0.0`, across 4 fix commits (`8b2e49931f8` sealed store, `d30321b98e` common certs, `59e0040d33` per-mode emitters, `89067fe46e` reducers) plus a required companion fix (`a232835611`, shadow-parity harness escape-hatch). Final adversarial verdict: 11/12 fully clean; 1 low-sev residual (`F-011-01` restore-authorization under-binds to `qualified_digest` only) + 2 documented scope residuals (`F-015-02` content-digest binds 3 of the relevant kinds; `F-007-02` external-authorship caveat), all recorded as accepted deferrals in `implementation-summary.md`. |
| **Created** | 2026-07-30 |
| **Branch** | `system-deep-loop/036-deep-loop-innovation/006-runtime-docs-and-integrity-hardening/003-artifact-certificate-binding` |
| **Parent** | `system-deep-loop/036-deep-loop-innovation` |
| **Wave** | W3 |
| **Findings in scope** | 12 (4 P0 / 8 P1 / 0 P2), 0 carrying a review `CONFIRMED*` mark |
| **Blocks `014` cutover** | Yes — gates every mode's cutover certificate (not one of the four named blockers) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Evidence is accepted on partial or metadata-only correspondence in twelve places. Sealed-store `deleteAuthorized`/`restoreAuthorized` validate only the shape of a caller-supplied authorization before removing reference, blob and descriptor, never resolving it against a ledger (`F-011-01`). Creation-evidence lookup filters on `qualified_digest` and checks two digests, never the complete reference, so an event that copies those two digests while changing `artifact_kind` is returned as creation evidence (`F-015-01`). Deep-review correspondence compares event stem, event ID and authority epoch and no content digests, so a decoy artifact carrying copied metadata satisfies issuance and offline verification alike (`F-015-02`). Common offline certificates re-derive the verdict and check the body digest but never compare a dozen semantic body fields that are emitted into the body, so a validly signed certificate can carry false bindings (`F-011-03`). Alignment provenance returns true for four unrelated lifecycle events without a lane or digest match (`F-011-04`). Certificate receipts fabricate `result_head.sequence` from `receiptDigests.length` and transition heads from `attemptNumber`, and verification re-derives the same synthetic value, so signatures stay valid for false ledger positions (`F-007-01`). Council references ignore `roundId` (`F-006-03`); council certificates ignore artifact `scope.runId`/`scope.roundId` (`F-006-04`); model scores cite observations from other candidates' trials (`F-007-03`); artifact origin validation omits scoped identity binding (`F-007-02`); verified sealed reads never run the registered canonicalizer (`F-011-02`); research replay accepts sequence gaps whenever no checkpoint exists (`F-005-01`).

### Purpose
Make every certificate and sealed-artifact claim bind to the semantic identity it asserts, so a decoy that copies metadata is rejected at issuance and at offline verification.

### Calibration

> **Severity calibration (carry verbatim, do not re-escalate).** The review report states that in
> every confirmed case the actor is the operator or a stale local file, not a remote attacker. Read
> every P0 and P1 below as **cutover-readiness and robustness risk, not breach risk**. A finding's
> severity label is not a licence to treat it as a security incident.

> **Finding = hypothesis.** Only 13 of the 166 register findings carry a `CONFIRMED*` mark. Every
> other finding in the scope table below is an unverified single-leaf report. No fix may be built
> against an unconfirmed finding: T001 re-reads every cited `file:line` at HEAD and records
> `CONFIRMED` / `REFUTED` / `MOVED` / `ALREADY-FIXED` before any edit.

### Non-Goals
- The fencing and append boundary — that is `024`, whose receipt and proof primitives this child consumes.
- Readiness gates and rollback switches — that is `027`.
- Shadow parity — that is `022`, even though both touch council reducer files.
- Changing what a certificate certifies; only how tightly it binds.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Sealed-store `deleteAuthorized` and `restoreAuthorized`: resolve the authorization against the ledger rather than validating its shape.
- Verified sealed reads run the registered canonicalizer.
- Creation-evidence lookup compares the complete reference, not two digests.
- Deep-review correspondence compares content digests, not only stem, event ID and authority epoch.
- Common offline certificates compare every semantic body field they emit.
- Alignment provenance requires a lane or digest match.
- Certificate receipts stop fabricating `result_head.sequence` and transition heads; the verifier stops re-deriving invented values.
- Council references include `roundId`; council certificates bind artifact `scope.runId` and `scope.roundId`.
- Model scores are ownership-bound to the target trial.
- Research replay rejects sequence gaps rather than accepting them when no checkpoint exists.
- A decoy or forgery negative test per finding.

### Out of Scope
- The append boundary and fencing (`024`).
- Mode gates and rollback switches (`027`).
- Shadow parity harnesses (`022`).

### Findings in Scope (12)

| ID | Sev | Review mark | Location (at review time) | Defect |
|----|-----|-------------|---------------------------|--------|
| `F-011-01` | P0 | unverified | `runtime/lib/sealed-reference-artifacts/sealed-artifact-store.ts:680` | Public deletion and restoration cutovers trust unverified authorization objects |
| `F-011-02` | P1 | unverified | `runtime/lib/sealed-reference-artifacts/sealed-artifact-store.ts:838` | Verified sealed reads do not enforce the claimed canonicalization profile |
| `F-011-03` | P0 | unverified | `runtime/lib/deep-improvement-common-certificates/deep-improvement-common-certificates.ts:1485` | Common offline certificates leave semantic artifact identity fields unchecked |
| `F-011-04` | P1 | unverified | `runtime/lib/deep-alignment-certificates/deep-alignment-certificates.ts:717` | Alignment output provenance accepts lifecycle events without artifact identity binding |
| `F-015-01` | P0 | unverified | `runtime/lib/sealed-reference-artifacts/artifact-events.ts:460` | Creation evidence accepts a different full reference sharing partial digests |
| `F-015-02` | P0 | unverified | `runtime/lib/deep-review-certificates/deep-review-certificates.ts:602` | Deep Review certificates bind artifacts to events using metadata only |
| `F-006-03` | P1 | unverified | `runtime/lib/deep-ai-council-reducers/deep-ai-council-reducer.ts:651` | Council source references ignore round identity |
| `F-006-04` | P1 | unverified | `runtime/lib/deep-ai-council-certificates/deep-ai-council-certificates.ts:454` | Council certificates do not bind artifact scope to event scope |
| `F-007-01` | P1 | unverified | `runtime/lib/deep-improvement-common-certificates/deep-improvement-common-certificates.ts:1026` | Mode certificate receipts fabricate ledger head sequences |
| `F-007-02` | P1 | unverified | `runtime/lib/deep-improvement-common-certificates/deep-improvement-common-certificates.ts:630` | Artifact origin validation omits scoped identity binding |
| `F-007-03` | P1 | unverified | `runtime/lib/model-benchmark-reducers/model-benchmark-reducer.ts:480` | Model score references are not ownership-bound to the target trial |
| `F-005-01` | P1 | unverified | `runtime/lib/deep-research-reducers/deep-research-reducer.ts:2106` | Initial research replay silently accepts stream-sequence gaps |

Every ID above is assigned to this child and to no other. Locations are the anchors recorded during the review run; T001 re-resolves each one at HEAD.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-deep-loop/runtime/lib/sealed-reference-artifacts/sealed-artifact-store.ts` | Modify | Resolve deletion/restoration authorization against the ledger; run the canonicalizer on verified reads (`F-011-01`, `F-011-02`) |
| `.opencode/skills/system-deep-loop/runtime/lib/sealed-reference-artifacts/artifact-events.ts` | Modify | Compare the complete reference in creation-evidence lookup (`F-015-01`) |
| `.opencode/skills/system-deep-loop/runtime/lib/deep-review-certificates/deep-review-certificates.ts` | Modify | Bind artifacts by content digest, not metadata (`F-015-02`) |
| `.opencode/skills/system-deep-loop/runtime/lib/deep-improvement-common-certificates/deep-improvement-common-certificates.ts` | Modify | Compare every emitted semantic body field; stop fabricating heads (`F-011-03`, `F-007-01`, `F-007-02`) |
| `.opencode/skills/system-deep-loop/runtime/lib/deep-alignment-certificates/deep-alignment-certificates.ts` | Modify | Require a lane or digest match for provenance (`F-011-04`) |
| `.opencode/skills/system-deep-loop/runtime/lib/deep-ai-council-certificates/deep-ai-council-certificates.ts` | Modify | Bind artifact scope to event scope (`F-006-04`) |
| `.opencode/skills/system-deep-loop/runtime/lib/deep-ai-council-reducers/deep-ai-council-reducer.ts` | Modify | Include `roundId` in source references (`F-006-03`) — coordinate with `022` |
| `.opencode/skills/system-deep-loop/runtime/lib/model-benchmark-reducers/model-benchmark-reducer.ts` | Modify | Ownership-bind score references to the target trial (`F-007-03`) |
| `.opencode/skills/system-deep-loop/runtime/lib/deep-research-reducers/deep-research-reducer.ts` | Modify | Reject replay sequence gaps absent a checkpoint (`F-005-01`) |
| `.opencode/skills/system-deep-loop/runtime/tests/unit/deep-review-certificates.vitest.ts` | Modify | Decoy-artifact negative test |
| `.opencode/skills/system-deep-loop/runtime/tests/unit/deep-improvement-common-certificates.vitest.ts` | Modify | False-binding certificate negative test |
| `.opencode/skills/system-deep-loop/runtime/tests/unit/deep-alignment-certificates.vitest.ts` | Modify | Unrelated-lifecycle-event provenance negative test |
| `.opencode/skills/system-deep-loop/runtime/tests/unit/deep-ai-council-certificates.vitest.ts` | Modify | Cross-scope certificate negative test |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every load-bearing identity in a certificate or sealed-artifact claim is re-derived from the verified typed payload and compared for exact equality. | Per emitter, an enumerated load-bearing field list; a test per field proving a mismatched value is rejected. |
| REQ-002 | A decoy artifact that copies metadata but differs in content is rejected at issuance and at offline verification. | Decoy negative test per emitter: the decoy passes today and must fail after. |
| REQ-003 | No verifier re-derives a value the issuer invented. | `result_head.sequence` and transition heads are read from the ledger, not computed from `receiptDigests.length` or `attemptNumber`; a certificate citing a false position fails verification. |
| REQ-004 | Sealed-store deletion and restoration resolve their authorization against the ledger. | A syntactically valid but unresolvable authorization cannot remove a reference, blob or descriptor. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Verified sealed reads run the registered canonicalizer. | A read whose stored bytes differ only by canonicalization is detected rather than accepted. |
| REQ-006 | Council references include `roundId`, and council certificates bind artifact `scope.runId` and `scope.roundId`. | A cross-round reference and a cross-run certificate are both rejected. |
| REQ-007 | Model scores are ownership-bound to the target trial. | A score citing an observation from another candidate's trial is rejected. |
| REQ-008 | Research replay rejects a sequence gap when no checkpoint explains it. | A gap-containing fold without a checkpoint fails rather than folding. |
| REQ-009 | Alignment provenance requires a lane or digest match. | Four unrelated lifecycle events no longer satisfy provenance. |

### Universal - applies to every child in the 021-032 remediation tree

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-U01 | Confirm before build. Every finding ID in the scope table is re-read at HEAD and classified `CONFIRMED` / `REFUTED` / `MOVED` / `ALREADY-FIXED` before any code edit. | T001 output table in `tasks.md` lists all scoped IDs with a classification and a cited probe, test, commit, or new anchor. |
| REQ-U02 | Baseline before delta. Every suite this child touches is run **before** any edit and its real numbers recorded; the whole gate is re-run at close and reported as a delta. | Pre-edit and post-edit runs of the named runners are recorded in `checklist.md` with discovered-test counts, pass/fail/skip, and exit codes. |
| REQ-U03 | Negative test per confirmed finding. Acceptance is a test that **fails before the fix and passes after** — never a green suite alone. | Each confirmed finding maps to a named test that is demonstrated red at the pre-fix commit and green at the post-fix commit. |
| REQ-U04 | Independent verification. An adversarial pass is run by a different actor than the builder; a gate authored alongside the change is not independent evidence. | A verification pass distinct from the build pass is recorded, naming the actor and the defects it found (or explicitly none). |
| REQ-U05 | Evidence citations are drift-proof. No completion claim cites a bare run count or a raw line number; every claim cites a **test name + suite-content digest + candidate SHA**. | `checklist.md` evidence strings contain a test name, a suite digest, and a commit SHA. Grep for bare "N/N passing" strings returns none. |
| REQ-U06 | Completion discipline. `validate.sh --strict` exits 0 for this child, all `checklist.md` items are `[x]` with evidence, and completion metadata reconciles across `spec.md` / `plan.md` / `tasks.md` / `implementation-summary.md`. | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <this-child> --strict` exits 0; no doc claims a completion state another doc contradicts. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 12 scoped findings closed as fixed, `REFUTED`, or `ALREADY-FIXED`.
- **SC-002**: A decoy or forgery negative test exists per finding, demonstrated passing before the fix and failing after.
- **SC-003**: No verifier re-derives an issuer-invented value.
- **SC-004**: A validly signed certificate carrying a false semantic binding fails verification.
- **SC-005**: `npm run typecheck && npm test` in `runtime` green, reported as a delta against the `021` baseline.
- **SC-006**: Cutover certificates issued by `014` bind what they claim.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Tightening binding rejects legitimate historical certificates | High | Enumerate the historical certificate corpus first; a rejection of a genuine historical certificate is a finding, not an acceptable cost |
| Risk | Twelve local fixes drift into twelve binding definitions | Medium | ADR-001 proposes one shared binding validator with per-emitter field lists as data |
| Risk | Council reducer files are shared with `022` | Medium | Serialize the merge; ownership recorded in `MANIFEST.md` |
| Dependency | `024` receipt and proof primitives | Blocks REQ-003 | Sequence after `024`; the ledger head must be readable rather than invented |
| Dependency | `021` honest baselines | Blocks evidence issuance | Sequence after `021` |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Binding strength
- **NFR-B01**: Every load-bearing identity must be compared by exact equality against a value re-derived from the verified typed payload.
- **NFR-B02**: Metadata correspondence alone must never satisfy a binding check.

### Verifier independence
- **NFR-V01**: A verifier must not compute a value the issuer chose; it must read it from an independent source.

### Compatibility
- **NFR-C01**: Genuine historical certificates must continue to verify; any rejection is a finding to investigate, not an accepted cost.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

### Data Boundaries
- Certificate with an empty artifact claim set: rejected rather than vacuously verified.
- Artifact with an identical digest but a different `artifact_kind`: rejected (`F-015-01`).
- Score citing zero observations: rejected rather than treated as unbounded.

### Error Scenarios
- Decoy artifact copying two digests: rejected at both issuance and offline verification (`F-015-01`, `F-015-02`).
- Certificate with a false `candidateId` but a valid signature: fails verification (`F-011-03`).
- Unresolvable deletion authorization: no reference, blob or descriptor removed (`F-011-01`).

### State Transitions
- Replay with a sequence gap and no checkpoint: fails rather than folding (`F-005-01`).
- Cross-round council reference: rejected (`F-006-03`).
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 19/25 | 12 findings across the sealed-artifact store, 4 certificate emitters and 3 reducers; 13 files in the §3 Files to Change table, including 4 test files |
| Risk | 21/25 | Touches core certificate/verification logic shared by every mode's cutover path; tightening binding risks rejecting genuine historical certificates (R-001, High/Medium) |
| Research | 13/20 | 0 of 12 findings carry a review `CONFIRMED*` mark (all unverified); two open questions (shared validator vs. per-emitter local checks; `F-007-01` issuer-vs-verifier fix order) are undecided pre-build |
| Multi-Agent | 8/15 | Six phases (enumerate -> validator -> store/certificates/reducers in parallel -> decoys); one independent adversarial verification pass (REQ-U04) |
| Coordination | 13/15 | Gates every mode's `014` cutover certificate; depends on `024` receipt primitives and `021` honest baselines; coordinates with `022` on shared council reducer files |
| **Total** | **74/100** | **Level 3** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:risk-matrix -->
## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Tighter binding rejects genuine historical certificates | H | M | Historical corpus enumerated first; any rejection investigated as a finding |
| R-002 | Twelve fixes produce twelve binding definitions that drift | M | M | One shared validator with per-emitter field lists as data (ADR-001) |
| R-003 | Council reducer file collision with `022` | M | M | Serialize the merge; ownership in `MANIFEST.md` |
| R-004 | `024` primitives arrive late, blocking REQ-003 | M | M | Sequence after `024`; the issuer-side fix can land before the verifier-side one |
<!-- /ANCHOR:risk-matrix -->

---

<!-- ANCHOR:user-stories -->
## 11. USER STORIES

### US-001: A decoy artifact is rejected (Priority: P0)

**As a** operator verifying a cutover certificate offline, **I want** an artifact that copies metadata but differs in content to fail verification, **so that** a certificate proves what it claims rather than what it was handed.

**Acceptance Criteria**:
1. Given a decoy artifact carrying copied metadata and different content, When issuance runs, Then it is rejected.
2. Given the same decoy and a certificate issued before this child, When offline verification runs, Then it fails after the fix and passed before, and both runs are recorded.

### US-002: A signature does not launder a false binding (Priority: P0)

**As a** engineer auditing an improvement promotion, **I want** a validly signed certificate carrying a false `candidateId` to fail verification, **so that** a signature attests to the binding and not only to the bytes.

**Acceptance Criteria**:
1. Given a certificate with a valid signature and a false `candidateId`, When verification runs, Then it fails and names the mismatched field.
<!-- /ANCHOR:user-stories -->

---

<!-- ANCHOR:open-questions -->
## 12. OPEN QUESTIONS

- Does one shared binding validator serve all four certificate emitters, or does each keep a local check against a shared field list? ADR-001 proposes the shared validator; the local-check alternative is recorded there.
- For `F-007-01`, the fix can land on either side: the issuer stops inventing `result_head.sequence`, or the verifier stops re-deriving it. Both are needed for the property to hold, but the order matters for compatibility with certificates already issued. Decide before Phase 3.
- Which historical certificates must continue to verify? Enumerating that corpus is a Phase 1 task; a rejection of a genuine historical certificate is a finding to investigate, not an accepted cost of tightening.
<!-- /ANCHOR:open-questions -->
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
- **Findings register**: `../001-whole-system-gate/review/findings-register.md`
- **Canonical registry**: `../001-whole-system-gate/review/deep-review-findings-registry.json`
- **Review verdict and calibration**: `../001-whole-system-gate/review/review-report.md`
<!-- /ANCHOR:related-docs -->

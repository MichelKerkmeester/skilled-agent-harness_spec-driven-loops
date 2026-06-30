---
title: "Feature Specification: D5-R5 — OPEN_DESIGN_TRANSPORT_ASSERTION v1 result-assertion pairing"
description: "The transport-result receipt proves what a CLI child DID, but the request path still trusts a bare claim: nothing forces the child to emit a content-bound, recomputable assertion the parent can pair against the result."
trigger_phrases:
  - "d5-r5 transport assertion pairing"
  - "open design transport assertion design build"
importance_tier: "normal"
contextType: "general"
status: "complete"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/039-design-enforcement-build/005-d5-cross-cli-survival/005-transport-assertion-pairing"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Upgrade spec to Level 2 contract; mark phase complete"
    next_safe_action: "Regenerate description.json and graph-metadata.json"
    blockers: []
    key_files:
      - ".opencode/skills/mcp-open-design/references/cli_child_pairing.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "d5-r5-impl"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Feature Specification: D5-R5 — OPEN_DESIGN_TRANSPORT_ASSERTION v1 result-assertion pairing

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-06-28 |
| **Branch** | `005-transport-assertion-pairing` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The return path into Open Design already has a receipt: `OPEN_DESIGN_TRANSPORT_RESULT v1` lets the parent replay what a CLI child did and fail closed when Open Design was used but no result returns. What is still missing on the request path is a pre-operation self-assertion the child carries into the boundary, plus a rule that pairs that assertion with the returned result so the parent re-validates one against the other. Today the result's `transportAssertionDigest` only digests the assertion the child received; nothing requires the child to emit its own assertion, and nothing forces the assertion's claims — skills loaded, operation class, live tool surface — to be content-bound and recomputable rather than a bare claim.

### Purpose
Author `OPEN_DESIGN_TRANSPORT_ASSERTION v1`: a child-resident assertion carrying `childLoadedSkills`, `operationClass`, `liveToolsListVerified`, and content-bound `payloadDigests`, plus the pairing rule that every transport op carries both an assertion (pre-op) and a result (post-op), and the parent re-validation extension that recomputes the assertion's digests and reconciles assertion against result against originating manifest, failing closed on any gap. The deliverable reuses the proof-token §2 digest schema and §6 recompute-and-reject discipline by citation — exactly as the existing laundering guard reuses them — and names the honest residual where the assertion degrades to advisory.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Append the `OPEN_DESIGN_TRANSPORT_ASSERTION v1` field schema (`version`, `dispatchId`, `childLoadedSkills`, `operationClass`, `liveToolsListVerified`, `payloadDigests`, a self-excluding `assertionDigest`) to the existing CLI child pairing contract.
- Author the result-assertion pairing rule: every transport op carries both blocks, and the assertion digests reconcile against the returned result digests and the originating dispatch manifest.
- Author the parent re-validation extension citing proof-token §2 (digest schema) and §6 (recompute-and-reject), with every assertion deny rule mapping to a fail-closed `DENY`; name the text-only advisory residual.

### Out of Scope
- The `cli-*` ALWAYS wiring that demands the assertion at dispatch time — that is the downstream consumer, not this phase.
- Any change to `design_proof_token.md`, to the existing transport-result schema, or to any live cli-* SKILL.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/mcp-open-design/references/cli_child_pairing.md` | Modified (append-only) | Append one new H2 section "Open Design Transport Assertion Pairing": the assertion schema, the result-assertion pairing rule, the parent re-validation extension (§2/§6 by citation), the assertion deny-rules table, the named text-only residual, and an acceptance subsection. 99 insertions, 0 deletions — every pre-existing section preserved byte-identical |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `OPEN_DESIGN_TRANSPORT_ASSERTION v1` field schema defined | schema names `version`, `dispatchId`, `childLoadedSkills`, `operationClass`, `liveToolsListVerified`, `payloadDigests`, and a self-excluding `assertionDigest` |
| REQ-002 | Result-assertion pairing rule stated | every Open Design transport op carries both blocks; assertion `payloadDigests` reconcile against the paired result digests and the originating dispatch manifest |
| REQ-003 | Parent re-validation extension cites §2 and §6 | the extension recomputes `assertionDigest` and `payloadDigests`, and every assertion deny rule maps to a fail-closed `DENY` |
| REQ-004 | Append-only — every pre-existing section preserved | `git diff` shows 99 insertions, 0 deletions; result schema, parent re-validation, deny rules, named residual, Agent I/O, acceptance, and the laundering guard are all byte-identical |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Proof-token §2/§6 cited, not redefined | the assertion's `payloadDigests` and the re-validation extension reference the token contract; no second token schema is defined |
| REQ-006 | Text-only / unmodifiable-child residual named as advisory | the residual is stated as advisory-only with the parent demand-back + transport-result re-validation as the fail-closed floor, not silently passed |
| REQ-007 | `operationClass` is conservative | the assertion may not downgrade observed mutating/destructive behavior to `read`/`transport` |
| REQ-008 | Deliverable is evergreen | no spec path / packet / phase / ADR / REQ / task / finding ID in the appended section |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Parent re-validation rejects a returned result when the paired assertion is missing after Open Design use, when an assertion digest cannot be recomputed, or when an assertion payload digest conflicts with the result or the originating manifest — every path fails closed.
- **SC-002**: A text-only / unmodifiable child that emits the assertion as prose or omits it is flagged advisory, not silently passed; the contract claims no machine-checkable assertion pass from prose alone.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | The assertion could be read as upgrading transport trust beyond a bare claim | Over-claiming enforcement would be dishonest | Frame the assertion as evidence the parent re-validates; the request/return digests must reconcile, and a non-recomputable claim is not an assertion |
| Risk | The text-only / unmodifiable child has no structured assertion envelope | Assertion checking cannot be deterministic there | Name the residual as advisory-only; keep parent demand-back + transport-result re-validation as the fail-closed enforceable floor |
| Risk | The appended section could drift from the proof-token contract if it restated §2/§6 | Two copies of the digest convention would diverge | Cite §2 (digest schema) and §6 (recompute-and-reject); redefine neither |
| Dependency | Existing `cli_child_pairing.md` transport-result schema + parent re-validation | Extended | Green — exists; the assertion pairs against the result schema and parallels the laundering guard |
| Dependency | `design_proof_token.md` §2 (digest schema) and §6 (recompute-and-reject) | Cited | Green — exists; the assertion's `payloadDigests` and the re-validation extension reuse them by reference |
| Dependency | Sibling `cli-*` ALWAYS wiring | Consumer | Out of scope here; that step demands the assertion back at dispatch time |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Maintainability
- **NFR-M01**: The appended section cites the proof-token §2/§6 so the digest schema and recompute-and-reject discipline have a single source of truth and cannot drift, parallel to the existing laundering guard.
- **NFR-M02**: The deliverable is evergreen — no ephemeral artifact IDs — so it survives doc reorganization.

### Safety
- **NFR-S01**: The parent fails closed on every missing, malformed, ambiguous, mismatched, downgraded, or non-recomputable assertion path; `ALLOW` requires the transport-result re-validation and the assertion extension to both pass.
- **NFR-S02**: The assertion never re-mints or substitutes the proof token; it is evidence the parent recomputes, not a replacement authorization.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Missing assertion after Open Design use
- Open Design was used but no structured assertion accompanies the required result: this is a `DENY`, never a pass. A natural-language summary does not satisfy the assertion.

### Operation-class downgrade
- A child may classify a read as guarded when the read fed a design decision, but it may not declare a less strict operation class than the observed mutating/destructive behavior; an attempted downgrade is a `DENY`.

### Text-only / unmodifiable child
- The child emits the assertion as prose or omits it entirely: report the advisory residual, compare any supplied digest fields, but never claim a machine-checkable assertion pass. The parent demand-back + transport-result re-validation remain the floor.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 8/25 | One appended H2 section (99 lines): schema + pairing + re-validation extension, no running code |
| Risk | 12/25 | No code/DB; risk is the honest assertion-vs-bare-claim framing and the text-only advisory residual |
| Research | 6/20 | Mirrors the established transport-result re-validation and the laundering guard's §2/§6 reuse |
| **Total** | **26/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None outstanding. The assertion-vs-bare-claim framing (the pair the parent re-validates is the enforceable upgrade; the assertion is evidence, not a new authorization) and the text-only / unmodifiable-child advisory residual are documented design boundaries, not open defects. The `cli-*` ALWAYS wiring is the named downstream consumer, not a gap in this phase.
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->

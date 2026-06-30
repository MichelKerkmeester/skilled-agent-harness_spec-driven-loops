---
title: "Feature Specification: D5-R6 — Reject register=unknown at cross-CLI design dispatch (deny-by-default register acceptance)"
description: "The cross-CLI design dispatch boundary has no gate that rejects an unresolved register: an unknown or out-of-set value launches a child that cannot resolve the Brand-versus-Product posture it was never given."
trigger_phrases:
  - "d5-r6 reject register unknown"
  - "deny-by-default register acceptance design build"
importance_tier: "normal"
contextType: "general"
status: "complete"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/039-design-enforcement-build/005-d5-cross-cli-survival/006-reject-register-unknown"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Upgrade spec to Level 2 contract; mark phase complete"
    next_safe_action: "Regenerate description.json and graph-metadata.json"
    blockers: []
    key_files:
      - ".opencode/skills/mcp-open-design/references/cli_child_pairing.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "d5-r6-impl"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Feature Specification: D5-R6 — Reject register=unknown at cross-CLI design dispatch (deny-by-default register acceptance)

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
| **Branch** | `006-reject-register-unknown` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The cross-CLI design dispatch path has no boundary that rejects a design dispatch whose register is unresolved. The compact Context Manifest carries `Register: <Brand | Product | unknown until shared/register.md is read>` — the `unknown` value explicitly means `shared/register.md` was never read and no posture was decided. Dispatching that ships ambiguity into a child that cannot resolve it. Worse, a concrete-but-unaccepted token (for example `marketing`) is just as unresolved as `unknown`, so a literal `unknown`-only check would not be enough; the boundary needs a membership test against the accepted posture set.

### Purpose
Author a deny-by-default register-acceptance gate at the cross-CLI design dispatch boundary: the parent resolves the effective register following `registerPolicy.resolutionOrder` and the postures in `shared/register.md`, tests membership against `registerPolicy.accepted` read by reference, and rejects fail-closed before launch when the value is `unknown` or not a member of the accepted set. The escalation reuses the existing `STATUS=ASK MISSING_REGISTER` ASK rather than coercing a default. The gate consumes D2-R8's `registerPolicy.accepted` as the single membership source and extends the D4 deny-by-default invariant to the register field; it names the two advisory residuals where determinism ends.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Append a Register Acceptance Gate to the existing CLI child pairing contract: the parent resolves the effective register and tests membership against `registerPolicy.accepted` before launch.
- Author the Parent Re-Validation Extension, a Register Deny Rules table (Unknown / Missing / Out-of-set / Parallel-list), and a truth table (`unknown` and out-of-set deny; `brand`/`product` pass).
- Reuse `STATUS=ASK MISSING_REGISTER` for the pre-dispatch escalation; name the mixed-surface correctness residual and the text-only child residual as advisory.

### Out of Scope
- Any change to `registerPolicy.accepted`, `default`, `resolutionOrder`, or `askWhen` in `command-metadata.json` — the gate consumes them read-only.
- The broader manifest-parity checker beyond carrying the `Register:` field, and any change to `shared/register.md`, the transport-result/assertion schemas, or any live cli-* SKILL.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/mcp-open-design/references/cli_child_pairing.md` | Modified (append-only) | Append one new H2 section "Register Acceptance Gate": the resolve-and-test contract, the Parent Re-Validation Extension, the Register Deny Rules table, the truth table, the two named residuals, and an acceptance subsection. 58 insertions, 0 deletions — every pre-existing section preserved byte-identical |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Register Acceptance Gate authored at the cross-CLI boundary | the parent resolves the effective register and tests membership against `registerPolicy.accepted` before launch; `unknown` or out-of-set ⇒ fail-closed `DENY` |
| REQ-002 | Membership reads the policy field by reference | the rule references `registerPolicy.accepted`; no second hardcoded `["brand","product"]` posture list is introduced in the contract, prompts, or dispatch glue |
| REQ-003 | Membership test, not a literal `unknown` match | an out-of-set token (for example `marketing`) is rejected like `unknown`, proving the test is `∈ registerPolicy.accepted` |
| REQ-004 | Append-only — every pre-existing section preserved | `git diff` shows 58 insertions, 0 deletions; transport-result, assertion pairing, and laundering guard are byte-identical |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | ASK reuse — no new escalation token | the pre-dispatch escalation reuses `STATUS=ASK MISSING_REGISTER`, not a newly minted token |
| REQ-006 | Reconciled with the two postures and the deny-by-default invariant | wording cites `shared/register.md` (Brand/Product) and states an unknown register = missing precondition ⇒ deny (D4 posture) |
| REQ-007 | Named residuals stated as advisory | mixed-surface register correctness and the text-only child channel are named advisory, not silently passed |
| REQ-008 | Deliverable is evergreen | no spec path / packet / phase / ADR / REQ / task / finding ID in the appended section |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The cross-CLI boundary rejects fail-closed before launch when the effective register is `unknown`, empty, missing, malformed, or not a member of `registerPolicy.accepted`, escalating `STATUS=ASK MISSING_REGISTER` rather than coercing a default; `brand` and `product` pass the membership check.
- **SC-002**: The membership source is `registerPolicy.accepted` by reference with no parallel hardcoded list, and the mixed-surface correctness residual and the text-only child residual are named advisory rather than over-claimed as deterministic.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | The gate could be read as a new policy rather than a deny-by-default extension of an existing one | Over-claiming a new posture system would be dishonest and could drift from D2-R8 | Frame the gate as the register-field extension of the D4 deny-by-default invariant; consume `registerPolicy.accepted` by reference, mint no new policy or token |
| Risk | A second hardcoded accepted-register list could drift from `command-metadata.json` | Two copies of the accepted set would diverge | Read `registerPolicy.accepted` by reference; the Parallel-list deny rule invalidates the membership check if a copied list is used |
| Risk (residual, advisory) | Register correctness on a genuinely mixed surface | A substantively-wrong-but-accepted register passes the deterministic gate | Name it advisory: the gate proves membership, not the right posture for a surface where Brand and Product dials diverge |
| Risk (residual, advisory) | Text-only child with no machine-readable register field | Register checking cannot be deterministic on that path | Name it advisory, bounded by the existing text-only Named Residual; parent demand-back stays the fail-closed floor |
| Dependency | `registerPolicy.accepted` in `command-metadata.json` (D2-R8 landed) | Consumed | Green — the single membership source of truth, read by reference |
| Dependency | Existing `cli_child_pairing.md` deny contract (D5-R2 landed) | Extended | Green — the enforcement home; the gate appends without redefining prior schemas |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Maintainability
- **NFR-M01**: The gate reads `registerPolicy.accepted` by reference so the accepted posture set has a single source of truth and cannot drift; if D2-R8 changes the set, the gate follows it with no second list to update.
- **NFR-M02**: The deliverable is evergreen — no ephemeral artifact IDs — so it survives doc reorganization.

### Safety
- **NFR-S01**: The parent fails closed on every unknown, empty, missing, malformed, or out-of-set register; `ALLOW` for the register check requires a value accepted by the policy field, and the existing transport-result, assertion, token, digest, operation-class, and demand-back checks still pass independently.
- **NFR-S02**: An unresolved register is never coerced to a safe default at the dispatch boundary; it escalates through the existing `STATUS=ASK MISSING_REGISTER` ASK.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Unknown register
- The effective register resolves to `unknown` (register.md unread): this is a fail-closed `DENY` before launch, escalating `STATUS=ASK MISSING_REGISTER`. The child is never launched.

### Out-of-set token
- A concrete but unaccepted token such as `marketing` is rejected the same way as `unknown` — the test is membership against `registerPolicy.accepted`, not a literal `unknown` match.

### Mixed surface (advisory residual)
- The value is an accepted posture but the surface genuinely mixes Brand and Product dials: the deterministic gate passes the membership test, but it cannot prove the posture is correct. Register correctness stays advisory.

### Text-only child (advisory residual)
- A prose-only return with no machine-readable register field: register checking degrades to advisory, bounded by the existing text-only Named Residual; the parent reports prose evidence but claims no machine-checkable register pass.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 7/25 | One appended H2 section (58 lines): resolve-and-test contract + deny rules + truth table + residuals, no running code |
| Risk | 11/25 | No code/DB; risk is the honest membership-vs-correctness framing and the two advisory residuals |
| Research | 6/20 | Consumes D2-R8 `registerPolicy.accepted` and extends the D4 deny-by-default posture; mirrors the established cross-CLI deny contract |
| **Total** | **24/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None outstanding. Two design boundaries are documented as advisory residuals, not open defects: (1) register *correctness* on a genuinely mixed surface — the deterministic gate proves membership in `registerPolicy.accepted`, not the right posture; (2) the text-only child channel — a prose-only return with no machine-readable register field degrades to advisory, bounded by the existing text-only Named Residual with parent demand-back as the floor. The deny-by-default register-acceptance extension consumes the existing policy and token by reference and adds no new policy or escalation token.
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->

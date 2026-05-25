---
title: "Feature Specification: 116/004 — Validator v2 Enforcement"
description: "Level 3 validator phase for review-depth v2 warnings, strict checks, and state/delta identity validation."
trigger_phrases:
  - "validator v2 enforcement"
  - "review-depth validator"
  - "post-dispatch validate v2"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/116-deep-skill-evolution/002-deep-review/004-complexity-validator-v2-enforcement"
    last_updated_at: "2026-05-22T12:10:00Z"
    last_updated_by: "gpt-5.5"
    recent_action: "Implemented validator v2 warnings and enforcement surface."
    next_safe_action: "Verify and handoff."
---
# Feature Specification: 116/004 — Validator v2 Enforcement

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

<!-- ANCHOR:executive-summary -->
## EXECUTIVE SUMMARY

Phase 004 gives the Phase 003 review-depth v2 contract a migration-safe validator surface. The post-dispatch validator now returns typed advisory warnings, recognizes legacy unversioned records, and validates explicit `reviewDepthSchemaVersion: 2` records for applicability, target selection, search coverage, search ledger evidence, finding links, active-finding depth, and state-log/delta identity.

**Key Decision**: ADR-001 accepts a three-phase rollout: warn-first in Phase D, hard-fail v2 after reducer observability in Phase E, and STOP wiring in Phase F.

**Critical Dependencies**: Phase 001 research, Phase 002 seeded fixtures, Phase 003 schema contract, and Phase 005 reducer visibility.
<!-- /ANCHOR:executive-summary -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-05-22 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Phase** | 4 of 8 |
| **Predecessor** | `../003-review-depth-schema-and-prompt-contract/spec.md` |
| **Successor** | `../005-search-ledger-persistence-and-reporting/spec.md` |
| **Estimated LOC** | ~220 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Deep-review post-dispatch validation previously proved that an iteration produced a markdown file and a minimally shaped JSONL row. It did not distinguish legacy records from v2 records, could not emit non-fatal migration warnings, and could not reject fake or shallow search proof.

### Purpose
Add validator support for the v2 contract while preserving historical packet readability. Explicit v2 records should be checkable in strict mode, warn-only by default during rollout, and skippable only through an explicit `DEEP_REVIEW_V2_ENFORCEMENT=off` escape hatch.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Extend `PostDispatchValidateResult` with optional typed warnings.
- Emit `legacy_unversioned_record` warnings for non-trivial legacy rows.
- Validate v2 applicability, target selection, search coverage, search ledger rows, finding links, and active `findingDetails`.
- Compare the latest state-log iteration id with the delta-file iteration id.
- Add rollout mode `DEEP_REVIEW_V2_ENFORCEMENT=warn|strict|off`.
- Wire workflow YAML to surface `schema_advisory` events.

### Out of Scope
- Reducer persistence and report rendering, owned by Phase 005.
- Candidate-saturation STOP gates, owned by Phase 006.
- Graph vocabulary and graph upsert changes, owned by Phase 007.
- Phase B fixture edits; those fixtures remain contract inputs.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/post-dispatch-validate.ts` | Modify | Add warning result type and v2 checks. |
| `.opencode/commands/deep/assets/deep_start-review-loop_auto.yaml` | Modify | Surface advisory warnings and v2 failure reasons. |
| `.opencode/commands/deep/assets/deep_start-review-loop_confirm.yaml` | Modify | Mirror auto workflow validator advisory behavior. |
| `.opencode/specs/.../004-validator-v2-enforcement/*` | Modify/Create | Populate Level 3 documentation. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Preserve legacy readability. | Unversioned records keep current pass/fail behavior and can carry `legacy_unversioned_record` warning for non-trivial shape. |
| REQ-002 | Add first-class advisory output. | Validator results can include `warnings?: { code, detail, fieldPath? }[]` on success or failure. |
| REQ-003 | Validate v2 top-level objects. | Explicit v2 rows check `reviewDepthApplicability`, `targetSelection`, and `searchCoverage.graphCoverageMode`. |
| REQ-004 | Enforce non-trivial ledger proof. | Non-trivial v2 records require non-empty `searchLedger[]`, cited `searchActions[].evidenceRefs`, valid `linkedFindingId`, and rich active `findingDetails`. |
| REQ-005 | Preserve rollout control. | `DEEP_REVIEW_V2_ENFORCEMENT=warn` converts v2 depth failures to warnings; `strict` fails; `off` skips v2 checks. |
| REQ-006 | Detect state/delta drift. | When both paths exist, mismatched iteration identity fails validation. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- Phase B validator fixture passes without changing fixture files.
- Existing post-dispatch validator tests stay green.
- Workflow YAML documents `schema_advisory` warning events.
- Strict spec validation passes for this Level 3 folder.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 003 v2 schema | Validator must match frozen names and enums. | Use `state_format.md` and Phase B fixture names directly. |
| Dependency | Phase 005 reducer visibility | Hard-fail rollout should not hide invisible debt. | Ship Phase D warn-first and Phase E in the same bundled dispatch. |
| Risk | Legacy packet breakage | Old review rows lack v2 fields. | Gate depth checks on `reviewDepthSchemaVersion === 2`. |
| Risk | Warning fatigue | Operators may ignore advisory output. | Emit typed `schema_advisory` events and document rollout phases. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

| ID | Requirement | Target |
|----|-------------|--------|
| NFR-001 | Backward compatibility | Legacy validator tests continue to pass. |
| NFR-002 | Deterministic output | Same input record yields same failure or warning codes. |
| NFR-003 | Low runtime cost | Checks are in-memory shape validation over one state row and optional delta row. |
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

- **Legacy non-trivial row**: Keep behavior, add `legacy_unversioned_record` warning when `findingDetails` is non-empty or multiple dimensions appear.
- **Trivial v2 skip**: Allow empty ledger only when `scopeClass === "trivial"` and `enforcement === "skip"`.
- **Warn rollout**: Convert v2 depth failures to `warn_*` advisories, while transport identity drift remains a hard validator failure.
- **Strict rollout**: Return the first v2 failure reason and details.
- **Off rollout**: Skip v2 checks and warn if a ledger exists but is unverified.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 15/25 | Validator, workflow YAML, and Level 3 docs. |
| Risk | 18/25 | Shared runtime validation controls review loop health. |
| Research | 17/20 | Directly implements Phase 001-003 findings and fixtures. |
| Multi-Agent | 6/15 | Multiple executor paths consume the same validator. |
| Coordination | 15/15 | Bundled with Phase 005 and staged before Phase F/G. |
| **Total** | **71/100** | **Level 3 warranted.** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:risk-matrix -->
## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | v2 checks reject valid trivial reviews | M | L | Preserve trivial+skip exemption. |
| R-002 | Warning mode masks real search debt | H | M | Bundle Phase 005 reducer/dashboard visibility. |
| R-003 | Fixture reason drift | M | M | Preserve fixture-compatible `delta_iteration_id_mismatch` alias. |
| R-004 | Workflow ignores warnings | M | L | Add explicit `schema_advisory` event recipe. |
<!-- /ANCHOR:risk-matrix -->

---

<!-- ANCHOR:user-stories -->
## 11. USER STORIES

### US-001: Operator Sees Migration Warnings

**As a** deep-review operator, **I want** legacy and warn-mode v2 issues surfaced as advisories, **so that** migration debt is visible without breaking historical runs.

### US-002: Validator Rejects Fake v2 Proof

**As a** workflow owner, **I want** strict mode to fail uncited or unlinked v2 ledger rows, **so that** agents cannot satisfy review-depth requirements with boilerplate.
<!-- /ANCHOR:user-stories -->

---

<!-- ANCHOR:acceptance -->
## 12. ACCEPTANCE CHECKS

| Check | Evidence |
|-------|----------|
| Validator v2 fixture | `pnpm vitest run --no-coverage review-depth-validator review-depth-reducer` |
| Legacy validator suite | `pnpm vitest run --no-coverage post-dispatch-validate` |
| Prompt-pack regression | `pnpm vitest run --no-coverage prompt-pack` |
| Spec validation | `validate.sh .../004-validator-v2-enforcement --strict` |
<!-- /ANCHOR:acceptance -->

---

<!-- ANCHOR:questions -->
## 13. OPEN QUESTIONS

(none)
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Parent phase map**: `../spec.md`
- **Research synthesis**: `../001-research-synthesis/research/research.md`
- **Schema contract**: `../003-review-depth-schema-and-prompt-contract/spec.md`
- **Implementation plan**: `plan.md`
- **Decision record**: `decision-record.md`

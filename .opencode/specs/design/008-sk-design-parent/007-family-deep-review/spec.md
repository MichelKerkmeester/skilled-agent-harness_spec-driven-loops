---
title: "Feature Specification: Phase 7: family-deep-review"
description: "A 2-model deep review (~58 iterations) ran over all six sk-design family skills, then per-skill fix agents remediated every finding. This phase records the review, the fixes, the version bumps, and the verification evidence."
trigger_phrases:
  - "sk-design family deep review"
  - "sk-design family remediation"
  - "sk-design two-model review"
  - "sk-design family version bumps"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/007-family-deep-review"
    last_updated_at: "2026-06-25T23:30:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Authored the Level-2 record for the family deep-review and remediation phase"
    next_safe_action: "Validate the 007 docs strict, then resolve the deferred repo-wide derived-sync"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "implementation-summary.md"
      - "review/triage-final.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "design/008-sk-design-parent/007-family-deep-review"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "All six family skills pass package_skill.py --check after remediation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 7: family-deep-review

<!-- SPECKIT_LEVEL: 2 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-06-25 |
| **Branch** | `system-speckit/028-memory-search-intelligence` |
| **Parent Spec** | ../spec.md |
| **Phase** | 7 |
| **Predecessor** | ../006-integration-validation/spec.md |
| **Successor** | None |
| **Handoff Criteria** | Every family skill passes `package_skill.py --check`; all confirmed findings remediated; versions bumped and changelogged; advisor rebuilt with SPEC/DESIGN routing to `sk-design-md-generator` confirmed. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 7** of the sk-design parent skill specification, and it runs after the family was assembled and integration-validated in Phase 6. The family was built and validated, but the individual skill packages had never been put through an adversarial multi-model review. This phase did that review, then remediated what it found.

The review used two independent models over each of the six family skills: Opus 4.8 (via `~/.claude-account2`) and GPT-5.5-fast (variant `xhigh`), five iterations each, in skill-target mode (`reviewTargetType=skill`), for roughly 58 iterations total. A finding counted as confirmed only when both models flagged it independently; single-model findings were treated as hypotheses and verified at source before any fix. Zero P0 findings surfaced anywhere. Per-skill fix agents then remediated the confirmed and verified findings and bumped each skill's version.

**Scope Boundary**: This phase reviews and remediates the six family skill packages and records the outcome. It does not change the umbrella structural model or the locked taxonomy, and it does not resolve the repo-wide graph-metadata derived-sync (recorded as a known follow-up). The skill content changes themselves live inside each skill package and its changelog; this folder is the record of the review and remediation campaign.

**Family under review**:
- `sk-design` (umbrella router)
- `sk-design-interface`
- `sk-design-md-generator`
- `sk-design-foundations`
- `sk-design-motion`
- `sk-design-audit`
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The six sk-design family skills were each validated in isolation during their build phases, but none had faced an adversarial multi-model review of its shipped package. Without that pass there was no evidence that documented invocations actually succeed, that router pseudocode is internally consistent, that tool grants follow least privilege, or that the umbrella's routing authority points at children that exist on disk.

### Purpose
Run a two-model deep review over every family skill, remediate every confirmed and verified finding, and prove each skill still passes its packaging check, so the family ships clean with no open P0/P1 defects.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A 2-model deep review (Opus 4.8 + GPT-5.5-fast xhigh, 5 iterations each, skill-target mode) over all six family skills.
- Cross-model triage that separates confirmed findings (both models) from single-model hypotheses.
- Per-skill remediation of every confirmed and verified finding (P1/P2/P3/decorative).
- Version bumps and changelog entries for each remediated skill.
- A live advisor rebuild plus a SPEC/DESIGN routing confirmation.
- This spec folder as the record of the review and remediation.

### Out of Scope
- The repo-wide graph-metadata derived-sync (schema-v2 `sanitizer_version` backfill across skill graph-metadata) - the regenerator tool is not locatable in this checkout, so this is deferred and recorded as a known follow-up.
- Changing the umbrella structural model or the locked family taxonomy - frozen since Phase 2.
- The 005 and 006 spec-doc completion-reconciliation flagged by the review - owned by the orchestrator, not this phase.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `spec.md` | Create | This record: review scope, remediation outcome, evidence |
| `plan.md` | Create | The executed review-and-remediation approach |
| `tasks.md` | Create | The task breakdown, marked done |
| `checklist.md` | Create | Verification items with evidence |
| `implementation-summary.md` | Create | Per-skill findings, fixes, versions, verification, follow-ups |
| `../spec.md` | Modify | Append the Phase 7 row to the parent phase-documentation map |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Each of the six family skills passes its packaging check after remediation. | `package_skill.py --check` reports PASS for `sk-design`, `sk-design-interface`, `sk-design-md-generator`, `sk-design-foundations`, `sk-design-motion`, `sk-design-audit`. |
| REQ-002 | Every confirmed finding is remediated or has a recorded deferral. | The consolidated triage's Tier-1 confirmed findings are each remediated and reflected in the owning skill's changelog. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Each remediated skill has a version bump and a changelog entry. | Versions are `sk-design 1.0.1.0`, `sk-design-interface 1.5.1.0`, `sk-design-md-generator 1.0.0.1`, `sk-design-foundations 1.0.0.1`, `sk-design-motion 1.0.1.0`, `sk-design-audit 1.0.0.1`, each with a dated changelog entry. |
| REQ-004 | The advisor is rebuilt and SPEC/DESIGN routing resolves to a child that exists. | A live advisor rebuild completes and a SPEC/DESIGN query routes to `sk-design-md-generator`. |
| REQ-005 | The md-generator engine still passes its automated tests. | `sk-design-md-generator` passes typecheck and 68/68 vitest after remediation. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All six family skills pass `package_skill.py --check`, every confirmed finding is remediated, and each remediated skill carries a version bump plus a changelog entry.
- **SC-002**: The advisor rebuilds cleanly and SPEC/DESIGN routing resolves to `sk-design-md-generator`, with zero open P0/P1 defects across the family.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Two review models (Opus 4.8 via `~/.claude-account2`, GPT-5.5-fast xhigh) | If a model is unavailable the cross-model confirmation cannot run | Both models completed five iterations per skill; triage recorded the verdict matrix |
| Risk | Single-model findings treated as fact | Med | Every single-model finding verified at source before fix; finding = hypothesis discipline applied |
| Risk | Routing authority names a child absent on disk | High | Confirmed `sk-design-spec` absent; SPEC/DESIGN route repointed at `sk-design-md-generator` and rebuild confirmed routing |
| Risk | Repo-wide derived-sync cannot be completed in this checkout | Low | Graph is structurally valid and the advisor routes correctly; the schema-v2 backfill is deferred and recorded as a known follow-up |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Quality
- **NFR-Q01**: A finding is acted on only when confirmed by both models or verified at source; no fix lands on an unverified hypothesis.
- **NFR-Q02**: Each remediated skill keeps a clean packaging check (`package_skill.py --check` PASS) after its fixes.

### Least Privilege
- **NFR-S01**: Tool grants in remediated skills match actual shipped usage (the `sk-design-audit` and `sk-design-interface` `allowed-tools` were narrowed to drop unused `Bash`/write grants).
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Verdict Interpretation
- A single CONDITIONAL/PASS split (motion: opus CONDITIONAL, gpt PASS) is reconciled by verifying the single-model finding at source rather than trusting the higher verdict.
- A FAIL driven by a gate that does not apply to the target type (sk-design gpt FAIL came from spec-folder gates applied to a skill target) is recorded as a gate-applicability artifact, not a skill defect.

### Deferred Work
- A known follow-up that cannot be executed in this checkout (the repo-wide derived-sync) is recorded with its exact blocker rather than left silent or marked done.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 14/25 | Six skill packages reviewed and remediated; ~58 review iterations |
| Risk | 8/25 | Documentation and metadata fixes; one routing-target correctness fix; no app-logic rewrite |
| Research | 10/20 | Cross-model triage plus per-finding source verification |
| **Total** | **32/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None blocking. The repo-wide graph-metadata derived-sync is deferred (regenerator tool not locatable here) and tracked in the implementation summary's known follow-ups.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Implementation Summary**: See `implementation-summary.md`
- **Cross-model triage**: See `review/triage-final.md`
- **Per-skill reports**: See `review/<skill>/{opus48,gpt55xhigh}/review-report.md`

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->

---
title: "011 — Acceptance-Criteria Coverage Gate"
description: "Revive the deferred T1 acceptance-criteria coverage gate: normalize acceptance-criteria into mechanical assertions, add an AC traceability table to the checklist, add a warn-first AC_COVERAGE validation rule, and bind the deep-review verdict with per-level AND lifecycle opt-in."
trigger_phrases:
  - "027 phase 011"
  - "acceptance coverage gate"
  - "AC_COVERAGE rule"
  - "AC traceability table"
  - "AC-format normalization"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/003-xce-research-based-refinement/001-research-and-doctrine/001-peck-teachings-adoption/007-acceptance-coverage-gate"
    last_updated_at: "2026-06-10T07:17:10Z"
    last_updated_by: "gpt-5.5-fast"
    recent_action: "Completed opt-in INFO AC coverage source pass"
    next_safe_action: "Plan validator v3 dispatch wiring if approved"
    blockers: []
    key_files: ["spec.md", "plan.md", "tasks.md", "checklist.md", "decision-record.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-06-027-011-acceptance-coverage-gate-scaffold"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Final SPECKIT_AC_COVERAGE_FLOOR default (proposed 0.9)"
      - "Whether L3 counts story-ACs only or both tables (recommend story-ACs only)"
    answered_questions:
      - "Proposal endorsed T1 as its own staged 027 child packet, not a 001 extension"
      - "AC-format normalization is a HARD prerequisite, not optional (cross-model verified)"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: 011 — Acceptance-Criteria Coverage Gate

<!-- SPECKIT_LEVEL: 3 -->

---

## EXECUTIVE SUMMARY

Phase 011 revives the long-deferred T1 acceptance-criteria coverage gate. The 2026-06-02 peck-README pass produced teachings T1-T4 and deferred T1; the peck-source deep-mining pass (research 006, 13 discovery iterations plus 5 cross-model verify iterations) re-evaluated T1 and found it now adoptable as a staged, reuse-heavy sibling packet. Post-026 the validation, checklist, and deep-review substrate already exists, so T1 becomes an AC-traceability table plus an `AC_COVERAGE` rule (floor 0.9, WARNING graduating to ERROR) plus a deep-review verdict binding with per-level AND lifecycle opt-in, reusing existing AC columns, the `EVIDENCE_CITED` infrastructure, and the fresh-context reviewer primitive.

The cross-model verification (MiniMax M3, research 006 §5) sharpened one design point into a hard constraint: the `AC_COVERAGE` rule can COUNT coverage but cannot CLASSIFY (Tested / Partially / Manual / Not-covered) against today's placeholder acceptance-criteria text. AC-format normalization is therefore a HARD prerequisite (phase 1), not an optional nicety. The rule must also count exactly one AC location per level to avoid double-counting, and it must honor a lifecycle opt-in so a freshly scaffolded Level 2 spec with zero tests does not ERROR at scaffold time.

The integration plan (research 006, integration-plan.md) places this packet behind packet 010 (the reviewer-prompt benchmark substrate that supplies regression fixtures) and the pending `001/002-self-check-templates` edit window, since phases 1-2 edit the same manifest templates. UX and automation are the operator's top two priorities: the rollout copies the proven `SPECKIT_SAVE_QUALITY_GATE` warn-first precedent verbatim, surfaces one actionable warning string, and folds in an auto-generate-AC-stubs opportunity rather than asking authors to write acceptance criteria from a blank line.

**Key Decisions**: AC-format normalization is a hard prerequisite (count vs classify); canonical per-level AC location (L3 counts story-ACs only); lifecycle opt-in not just level; warn-first rollout copied from `SPECKIT_SAVE_QUALITY_GATE`.

**Critical Dependencies**: Packet 010 (regression fixtures); the pending `001/002-self-check-templates` shared-manifest-template edit window.

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Source-Pass Complete |
| **Parent Packet** | `001-peck-teachings-adoption` |
| **Source** | `research/006-peck-source-deep-mining/sub-packet-proposal.md` §3 (Packet 011) + §7; `research/006-peck-source-deep-mining/integration-plan.md`; `research/006-peck-source-deep-mining/research.md` §2 (T1) + §5 (cross-model) |
| **Depends on** | Packet `010-reviewer-prompt-benchmark-substrate` (regression fixtures); pending `001/002-self-check-templates` (shared manifest templates) |
| **Feeds into** | Phase 5 ERROR promotion (deferred); future AC-stub auto-generation tooling |
| **LOC budget** | ~400-600 (template edits, new rule script, registry + docs, deep-review/SKILL + CLAUDE.md wiring) |
| **Branch** | `main` |
| **Created** | 2026-06-06 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

A spec folder claims its acceptance criteria are satisfied through a single self-attested checkbox ("All acceptance criteria met") in `checklist.md`. There is no per-AC mapping from a requirement to the test that proves it, no count of how many acceptance criteria actually carry evidence, and no validation signal when a folder claims completion with most of its criteria unverified. The peck-source mining pass scored this a real gap (research 006 §2, T1): the substrate to fix it now exists post-026, but two prerequisites the README pass missed remain. First, the acceptance-criteria text itself is placeholder prose ("[How to verify it's done]") that a rule can count but cannot classify as Tested, Partially, Manual, or Not-covered. Second, the canonical AC location is ambiguous at Level 3, where a spec carries both a requirement table and Given/When/Then story acceptance criteria, so a naive counter would double-count or miss.

### Purpose

Make acceptance-criteria coverage measurable and enforceable without breaking in-flight folders: normalize acceptance criteria into mechanical assertions, add a per-AC traceability table with evidence, add a warn-first `AC_COVERAGE` validation rule with a floor and an automation-infeasible escape hatch, and bind the deep-review verdict to coverage with a per-level AND lifecycle opt-in so fresh scaffolds are never blocked.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

1. **Phase 1 — AC-format normalization (HARD prerequisite).**
   - Rewrite the Level 1 and Level 2 acceptance-criteria placeholders in `spec.md.tmpl` from "[How to verify it's done]" into mechanical `precondition + action -> outcome` assertions.
   - Tighten the Level 3 requirement tables so a requirement's acceptance criteria are assertion-shaped rather than free prose.
   - Coordinate with pending `002-self-check-templates` (shared template — see Out of Scope and §12).

2. **Phase 2 — AC traceability table.**
   - Replace the single "All acceptance criteria met" checkbox in `checklist.md.tmpl` with a traceability table: `AC-id | classification (Tested / Partially / Manual / Not-covered) | evidence (test @ file:line)`.
   - Carry the net-new opportunity to auto-generate AC stubs from the `Requirement | Acceptance Criteria` table (integration-plan §6 #3).

3. **Phase 3 — `AC_COVERAGE` validation rule (WARNING).**
   - New rule: `covered / total >= floor(total * SPECKIT_AC_COVERAGE_FLOOR)`, default floor 0.9.
   - "Manual — automation infeasible" escape hatch with a required rationale, counted as covered.
   - Register the rule in `validator-registry.json` and document it in `validation_rules.md`.
   - Severity is WARNING in this packet (ERROR promotion is deferred to phase 5).

4. **Phase 4 — deep-review verdict binding + per-level AND lifecycle opt-in.**
   - Bind the coverage signal to the deep-review verdict.
   - Enforce only for Level 2 and above, only once `checklist.md` exists AND `implementation-summary.md` is in-progress or later; Level 1 is exempt.
   - Wire `deep-review/SKILL.md`, `deep_start-review-loop_{auto,confirm}.yaml`, and `CLAUDE.md` §2.

5. **Phase 5 — ERROR promotion (DEFERRED until evidence).**
   - Promote `AC_COVERAGE` from WARNING to ERROR after a warn-only adoption window. Held until warn-volume evidence exists; documented here so the staging is explicit, not executed in this packet.

### Out of Scope

- AC column infrastructure - the classification columns and evidence infra (`EVIDENCE_CITED`) already exist; reuse them, do not rebuild (research 006 §3, "reuse, don't rebuild").
- The fresh-context reviewer primitive - deep-review already supplies it; this packet binds to it, it does not build a new reviewer.
- Editing the shared manifest templates in parallel with pending `001/002-self-check-templates` - phases 1-2 must land after 002 closes OR inside a coordinated single edit window (research 006 §7 MUST-FIX).
- Non-T1 peck teachings - completion-freshness, escalation, anti-softening, and read-budget live in packet `009`; the reviewer benchmark lives in packet `010`.
- Phase 5 ERROR promotion - deferred until the warn-only window produces evidence.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/templates/manifest/spec.md.tmpl` | Modify | Phase 1: normalize L1/L2 acceptance-criteria placeholders into `precondition + action -> outcome` assertions; tighten L3 requirement tables (shared with pending 002) |
| `.opencode/skills/system-spec-kit/templates/manifest/checklist.md.tmpl` | Modify | Phase 2: replace the single "All acceptance criteria met" checkbox with the AC traceability table (shared with pending 002) |
| `.opencode/skills/system-spec-kit/scripts/lib/validator-registry.json` | Modify | Phase 3: register the new `AC_COVERAGE` rule (warn-first, strict-only candidate, with flags) |
| `.opencode/skills/system-spec-kit/references/validation/validation_rules.md` | Modify | Phase 3: document the `AC_COVERAGE` rule, floor, escape hatch, and flags |
| `.opencode/skills/system-spec-kit/scripts/lib/rules/ac-coverage.*` | Create | Phase 3: the `AC_COVERAGE` rule script (counts ACs, parses evidence, applies floor + escape hatch) |
| `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md` | Modify | Phase 3-4: document `SPECKIT_AC_TRACEABILITY_TEMPLATE`, `SPECKIT_AC_COVERAGE`, `SPECKIT_AC_COVERAGE_ENFORCE`, `SPECKIT_AC_COVERAGE_FLOOR` |
| `.opencode/skills/deep-review/SKILL.md` | Modify | Phase 4: bind the deep-review verdict to coverage with the per-level AND lifecycle opt-in |
| `.opencode/commands/deep/assets/deep_start-review-loop_auto.yaml` | Modify | Phase 4: surface the coverage signal in the verdict gate |
| `.opencode/commands/deep/assets/deep_start-review-loop_confirm.yaml` | Modify | Phase 4: surface the coverage signal in the verdict gate |
| `CLAUDE.md` | Modify | Phase 4: §2 completion gate note for the warn-first coverage signal (mirror to `AGENTS.md` per the runtime-mirror rule) |
<!-- /ANCHOR:scope -->

**Source-pass scope reconciliation:** The implemented pass followed the current approved write paths. Shared manifest-template edits and `CLAUDE.md` edits were not performed; they remain deferred/out-of-scope for this pass. The shipped scope is the default-off INFO `AC_COVERAGE` rule, registry/docs/ENV integration, deep-review advisory surfacing, `AGENTS.md` pointer, and phase-doc evidence.

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Normalize L1/L2 acceptance-criteria placeholders into mechanical assertions (phase 1, HARD prerequisite). | Given `spec.md.tmpl` L1/L2 requirement tables, when the template is rendered, then each acceptance-criteria cell is a `precondition + action -> outcome` assertion and no cell contains the literal "[How to verify it's done]" placeholder. |
| REQ-002 | Add the AC traceability table to `checklist.md.tmpl`, replacing the single self-attested checkbox (phase 2). | Given the rendered `checklist.md`, when the acceptance-criteria section is read, then it shows a table with columns `AC-id`, `classification (Tested/Partially/Manual/Not-covered)`, and `evidence (test @ file:line)`, and the bare "All acceptance criteria met" checkbox is absent. |
| REQ-003 | Add the `AC_COVERAGE` rule as a WARNING with a configurable floor and an automation-infeasible escape hatch (phase 3). | Given a spec folder with N acceptance criteria, when `AC_COVERAGE` runs, then it warns unless `covered / total >= floor(total * SPECKIT_AC_COVERAGE_FLOOR)` (default 0.9), and an AC marked "Manual — automation infeasible" with a rationale counts as covered. |
| REQ-004 | Register `AC_COVERAGE` in `validator-registry.json` and document it in `validation_rules.md` (phase 3). | Given the registry, when queried for `AC_COVERAGE`, then the rule resolves with severity warn (strict-only) and its flags; and `validation_rules.md` documents the floor, escape hatch, and flags. |
| REQ-005 | Bind the deep-review verdict to coverage with per-level AND lifecycle opt-in (phase 4). | Given a Level 2+ folder where `checklist.md` exists AND `implementation-summary.md` is in-progress+, when deep-review renders its verdict, then the coverage signal is reflected; given a Level 1 folder or a fresh scaffold, then the gate does not fire. |
| REQ-006 | Guarantee the rollout is warn-first and reversible, copying `SPECKIT_SAVE_QUALITY_GATE`. | Given default settings, when the rule activates, then it logs would-reject warnings without blocking, and flipping `SPECKIT_AC_COVERAGE_ENFORCE=false` reverts to warn-only; no folder ERRORs while `..._ENFORCE` is false. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | Count exactly one canonical AC location per level to avoid double-count or miss. | Given a Level 3 spec with both a requirement table and Given/When/Then story ACs, when `AC_COVERAGE` counts, then it counts the story-ACs only (the chosen canonical location) and does not also count the requirement-table rows. |
| REQ-008 | Reuse existing AC columns, `EVIDENCE_CITED`, and the deep-review reviewer rather than building new infrastructure. | Given the implementation, when reviewed, then the traceability table reuses existing classification columns, evidence parsing reuses `EVIDENCE_CITED`, and verdict binding reuses the deep-review primitive; no parallel infrastructure is introduced. |
| REQ-009 | Provide an actionable warn-first UX message for coverage shortfalls. | Given a coverage shortfall, when the warning surfaces, then it reads in the form "AC_COVERAGE WARNING: 8/10 ACs have evidence; floor 9/10. Add evidence or mark Manual—infeasible." with a concrete next action. |
| REQ-010 | Carry the net-new opportunity to auto-generate AC stubs from the `Requirement | Acceptance Criteria` table. | Given the `Requirement | Acceptance Criteria` table, when AC-stub generation is invoked, then it emits one traceability-table stub row per acceptance criterion so authors fill evidence rather than authoring rows from blank (integration-plan §6 #3). |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The rendered `spec.md.tmpl` L1/L2 acceptance criteria are mechanical assertions, and the L3 requirement tables are tightened; no "[How to verify it's done]" placeholder remains.
- **SC-002**: The rendered `checklist.md.tmpl` shows the AC traceability table with classification and evidence columns in place of the single self-attested checkbox.
- **SC-003**: `AC_COVERAGE` warns (never errors while `..._ENFORCE=false`) when coverage is below the floor, and the "Manual — automation infeasible" escape hatch with rationale counts as covered.
- **SC-004**: `AC_COVERAGE` is registered in `validator-registry.json` and documented in `validation_rules.md` with its floor, escape hatch, and flags.
- **SC-005**: The deep-review verdict reflects coverage only for Level 2+ folders with `checklist.md` present AND `implementation-summary.md` in-progress+; Level 1 and fresh scaffolds are exempt.
- **SC-006**: A freshly scaffolded Level 2 spec with zero tests passes strict validation without an `AC_COVERAGE` ERROR (lifecycle opt-in verified).
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A new ERROR-class coverage rule blocks in-flight folders at scaffold or mid-implementation time. | High | Mandatory warn-only window; per-level AND lifecycle opt-in; default `..._ENFORCE=false`; ERROR promotion deferred to phase 5 behind evidence. |
| Risk | The rule counts coverage but cannot classify on placeholder AC text. | High | AC-format normalization (phase 1) is a HARD prerequisite that lands before the rule; the rule depends on assertion-shaped ACs. |
| Risk | Double-counting at Level 3 (requirement table plus story ACs). | Medium | Count exactly one canonical location (story-ACs only at L3); documented as REQ-007 and ADR-002. |
| Risk | Editing the shared manifest templates in parallel with pending `001/002-self-check-templates`. | High | Sequence after pending 002 closes OR coordinate a single edit window; recorded as the §7 sequencing dependency and ADR-004. |
| Risk | Warn-volume too high to ever safely promote to ERROR. | Medium | Copy the `SPECKIT_SAVE_QUALITY_GATE` would-reject logging so warn volume is measured before any promotion decision. |
| Dependency | Packet `010-reviewer-prompt-benchmark-substrate` supplies regression fixtures (stale-verdict, softened-Fail, over-read, AC cases). | High | Land 010 first; do not promote any coverage behavior without green fixtures. |
| Dependency | Pending `001/002-self-check-templates` owns the same `spec.md.tmpl` / `checklist.md.tmpl` surfaces. | High | Land 002 first or coordinate the edit window; do not edit those templates concurrently. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Compatibility

- **NFR-C01**: The `AC_COVERAGE` rule is warn-first and default-non-enforcing; no existing spec folder changes validation outcome while `SPECKIT_AC_COVERAGE_ENFORCE=false`.
- **NFR-C02**: Level 1 folders and freshly scaffolded Level 2 folders (no in-progress implementation-summary) are never gated by coverage.

### Maintainability

- **NFR-M01**: The rule reuses the existing `validate.sh` registry loader and the strict TS-validator seam rather than adding a parallel validation path.
- **NFR-M02**: The canonical per-level AC location is stated once (story-ACs at L3) so counting logic and template authoring agree.

### Usability

- **NFR-U01**: Every coverage shortfall surfaces one aggregated, actionable message with a concrete next action (add evidence or mark Manual—infeasible), never a wall of per-AC errors.
- **NFR-U02**: AC-stub generation removes blank authoring: authors fill evidence into pre-generated rows rather than composing the table from scratch.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

| Case | Expected Behavior |
|------|-------------------|
| Spec folder with zero acceptance criteria | Rule is a no-op; no warning, no error (nothing to cover). |
| Level 1 folder | Exempt; the rule does not fire regardless of coverage. |
| Freshly scaffolded Level 2, no in-progress implementation-summary | Lifecycle opt-in not met; rule does not fire. |
| AC marked "Manual — automation infeasible" with a rationale | Counted as covered. |
| AC marked "Manual — automation infeasible" with no rationale | Not counted as covered; the escape hatch requires a rationale. |
| Level 3 spec with both a requirement table and story ACs | Count story-ACs only (canonical location); requirement-table rows are not double-counted. |
| Coverage exactly at the floor | Passes (`>=` comparison). |
| `SPECKIT_AC_COVERAGE_ENFORCE=false` (default) and coverage below floor | Warns, would-reject logged, never errors. |
| `SPECKIT_AC_COVERAGE_FLOOR` set above 1.0 or below 0 | Clamp to [0,1] and warn that the configured floor was out of range. |
| Evidence citation present but malformed (`file:line` unparseable) | Treated as not-covered for that AC; the warning names the malformed citation. |
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 16/25 | Two shared manifest templates, one new rule script, registry + docs, deep-review SKILL + two YAMLs, CLAUDE.md/AGENTS.md mirror |
| Risk | 18/25 | New coverage rule can block in-flight folders; shared-template edit collides with pending 002; ERROR-promotion staging |
| Research | 8/20 | Proposal, integration plan, and cross-model verification already define the staged design, floor, escape hatch, and sequencing |
| Multi-Agent | 4/15 | Single packet; deep-review binding is a doc/contract change |
| Coordination | 12/15 | Hard dependency on 010 fixtures and the pending-002 template window |
| **Total** | **58/100** | **Level 3** because the staged warn-to-error rule, the shared-template sequencing, and the cross-cutting deep-review/CLAUDE.md surface need formal decision records and verification. |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:risk-matrix -->
## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | ERROR-class coverage rule blocks in-flight or freshly scaffolded folders. | H | M | Warn-first default; per-level AND lifecycle opt-in; ERROR promotion deferred to phase 5 behind evidence. |
| R-002 | Rule cannot classify Tested/Partially/Not-covered on placeholder AC text. | H | H | AC-format normalization is a HARD prerequisite (phase 1) that precedes the rule. |
| R-003 | Concurrent edits to `spec.md.tmpl` / `checklist.md.tmpl` with pending 002 cause merge conflicts or drift. | M | M | Sequence after 002 or coordinate a single edit window (ADR-004). |
| R-004 | Double-counting ACs at Level 3. | M | M | Count story-ACs only (ADR-002, REQ-007). |
| R-005 | Warn volume too high to safely promote to ERROR. | M | M | Copy `SPECKIT_SAVE_QUALITY_GATE` would-reject logging; measure before promotion. |
| R-006 | Promoting coverage behavior without regression coverage. | H | L | Gate every promotion on green packet-010 fixtures. |
<!-- /ANCHOR:risk-matrix -->

---

<!-- ANCHOR:user-stories -->
## 11. USER STORIES

### US-001: Author sees actionable coverage feedback (Priority: P0)

**As a** spec author, **I want** a clear warning when my acceptance criteria lack evidence, **so that** I can add evidence or mark items Manual—infeasible before claiming completion.

**Acceptance Criteria**:
1. Given a folder with 8 of 10 ACs carrying evidence and a floor of 0.9, When `AC_COVERAGE` runs, Then it warns "AC_COVERAGE WARNING: 8/10 ACs have evidence; floor 9/10. Add evidence or mark Manual—infeasible." with a concrete next action.

### US-002: Fresh scaffold is never blocked (Priority: P0)

**As a** spec author starting a new Level 2 packet, **I want** the coverage gate to stay silent until I am implementing, **so that** scaffolding does not ERROR with zero tests.

**Acceptance Criteria**:
1. Given a freshly scaffolded Level 2 spec with no in-progress implementation-summary, When strict validation runs, Then `AC_COVERAGE` does not fire and validation does not ERROR on coverage.

### US-003: Reviewer verdict reflects coverage (Priority: P1)

**As a** deep-review reviewer, **I want** the coverage signal reflected in the verdict for in-progress Level 2+ folders, **so that** an under-covered folder cannot be silently passed.

**Acceptance Criteria**:
1. Given a Level 2+ folder with `checklist.md` present AND `implementation-summary.md` in-progress+, When the deep-review verdict renders, Then the coverage signal is reflected per the lifecycle opt-in rule.

### US-004: Author fills stubs instead of authoring rows (Priority: P1)

**As a** spec author, **I want** AC traceability rows generated from the requirement table, **so that** I fill evidence rather than composing the table from a blank line.

**Acceptance Criteria**:
1. Given a `Requirement | Acceptance Criteria` table, When AC-stub generation is invoked, Then one traceability-table stub row is emitted per acceptance criterion.
<!-- /ANCHOR:user-stories -->

---

## 12. OPEN QUESTIONS

- Final `SPECKIT_AC_COVERAGE_FLOOR` default: confirm 0.9 (the proposal value) or adjust during phase 3 authoring.
- Canonical L3 counting: confirm story-ACs only (recommended) versus a merged single-table model, recorded as ADR-002.
- Sequencing: confirm whether to land after pending `002-self-check-templates` closes or to negotiate a single coordinated edit window for the shared manifest templates (ADR-004).
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
- **Source Research**: `../../research/006-peck-source-deep-mining/research.md`, `sub-packet-proposal.md`, `integration-plan.md`
</content>

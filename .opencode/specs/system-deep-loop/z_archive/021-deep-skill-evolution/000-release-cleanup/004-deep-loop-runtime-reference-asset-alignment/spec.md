---
title: "Feature Specification: Deep Skills Reference And Asset Alignment"
description: "Align deep-ai-council, deep-research, and deep-review references/assets with sk-doc skill templates while preserving distinct council, research, and review domains."
trigger_phrases:
  - "deep skills reference asset alignment"
  - "deep-ai-council asset alignment"
  - "deep-research reference alignment"
  - "deep-review reference alignment"
  - "sk-doc skill template alignment"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/021-deep-skill-evolution/000-release-cleanup/004-deep-loop-runtime-reference-asset-alignment"
    last_updated_at: "2026-05-24T12:00:00Z"
    last_updated_by: "codex"
    recent_action: "phase-8-validation-complete"
    next_safe_action: "human-approval-before-phase-9-deep-research-loop"
    blockers:
      - "Phase 9 requires human approval after validation gate."
    key_files:
      - "spec.md"
      - "plan.md"
      - "resource-map.yaml"
      - "validation-report.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000013013"
      session_id: "131-000-013-deep-skills-reference-asset-alignment"
      parent_session_id: "131-000-013-deep-skills-reference-asset-alignment"
    completion_pct: 89
    open_questions:
      - "Human approval required before Phase 9 deep-research iterations."
    answered_questions:
      - "This is documentation/resource alignment, not runtime feature work."
      - "RCAF is the mandatory prompt envelope for delegated audit, rewrite, validation, and iteration prompts."
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
<!-- SPECKIT_LEVEL: 3 -->

# Feature Specification: Deep Skills Reference And Asset Alignment

---

<!-- ANCHOR:executive-summary -->
## EXECUTIVE SUMMARY

This phase aligns the three deep skills to one sk-doc-compatible resource model without flattening their domain differences. `deep-ai-council` gains the missing council-specific reference and asset family, `deep-review` gains focused convergence/state references, and `deep-research` records that its prior split is the aligned research model.

**Key Decisions**: Shared resource shape with domain-specific vocabulary; council assets are operational templates only; Phase 9 is approval-gated.

**Critical Dependencies**: `sk-doc` validation scripts, `sk-prompt` RCAF/CLEAR rules, and human approval before Phase 9.
<!-- /ANCHOR:executive-summary -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Phase 8 Complete, Phase 9 Approval Gate |
| **Created** | 2026-05-24 |
| **Branch** | `main` |
| **Parent Packet** | `skilled-agent-orchestration/116-deep-skill-evolution/000-release-cleanup` |
| **Phase Folder** | `013-deep-skills-reference-asset-alignment` |
| **Approval Gate** | Required before Phase 9 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The three deep skills now share a runtime family but their references and assets were uneven. `deep-research` already had a modern split reference and asset family, `deep-review` still had broader state/convergence hubs with missing focused references, and `deep-ai-council` had no asset folder plus stale README metadata. That asymmetry made the skills harder to compare, validate, and maintain against sk-doc templates.

### Purpose

Align the three skills to one shared deep-skill resource model while preserving three distinct domain voices: council planning, iterative research, and iterative code review.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Create this Level 3 phase packet and schemas.
- Inventory scoped `SKILL.md`, `README.md`, references, assets, changelogs, feature catalogs, and manual testing playbooks.
- Add council-specific references and assets where they support real council workflows.
- Add focused deep-review references for convergence signals, state outputs, and reducer/registry behavior.
- Refresh `SKILL.md`, `README.md`, and changelog entries after resource paths are final.
- Produce audit findings and validation reports.
- Stop before Phase 9 until human approval is received.

### Out of Scope

- Runtime YAML workflow changes.
- Reducer, script, command, or agent behavior changes.
- Speculative new deep-loop capabilities.
- Decorative or unused assets.
- Phase 9 research iterations before approval.

### Files Changed

| File Path | Change Type | Purpose |
|-----------|-------------|---------|
| `.opencode/skills/deep-ai-council/references/quick_reference.md` | Create | Council operator cheat sheet |
| `.opencode/skills/deep-ai-council/references/loop_protocol.md` | Create | Council planning loop guide |
| `.opencode/skills/deep-ai-council/assets/*` | Create | Council config, strategy, dashboard, prompt-pack, capability matrix |
| `.opencode/skills/deep-ai-council/SKILL.md` | Modify | Router/resource map/version refresh |
| `.opencode/skills/deep-ai-council/README.md` | Modify | README metadata, structure, links |
| `.opencode/skills/deep-ai-council/changelog/v2.2.0.0.md` | Create | Release note |
| `.opencode/skills/deep-review/references/convergence_signals.md` | Create | Focused review stop signals |
| `.opencode/skills/deep-review/references/state_outputs.md` | Create | Focused review output map |
| `.opencode/skills/deep-review/references/state_reducer_registry.md` | Create | Focused reducer/registry contract |
| `.opencode/skills/deep-review/SKILL.md` | Modify | Router/resource map/version refresh |
| `.opencode/skills/deep-review/README.md` | Modify | README metadata, structure, links |
| `.opencode/skills/deep-review/changelog/v1.10.1.0.md` | Create | Release note |
| `.opencode/skills/deep-research/SKILL.md` | Modify | Version and alignment note |
| `.opencode/skills/deep-research/README.md` | Modify | Version and asset-family metadata |
| `.opencode/skills/deep-research/changelog/v1.13.0.0.md` | Create | Release note |
| `013-deep-skills-reference-asset-alignment/**` | Create/Modify | Phase packet artifacts |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Priority | Requirement | Acceptance Criteria |
|----|----------|-------------|---------------------|
| REQ-001 | P0 | Use RCAF as the delegated-prompt envelope | Prompt templates name Role, Context, Action, Format and include CLEAR thresholds |
| REQ-002 | P0 | Keep domains similar but unique | Shared resource families exist, but examples and vocabulary remain council/research/review-specific |
| REQ-003 | P0 | Align to sk-doc templates | Changed skill docs validate with sk-doc quick and document validators or deviations are recorded |
| REQ-004 | P1 | Normalize reference families | Quick reference, loop protocol, convergence/state focused docs exist where useful |
| REQ-005 | P1 | Normalize asset families | Runtime asset families exist where supported by workflow docs/scripts; no decorative assets |
| REQ-006 | P1 | Update README/SKILL after paths settle | README and SKILL metadata point to final resources and version bumps |
| REQ-007 | P1 | Record changelogs | One changelog entry per touched skill separates template, reference, asset, and router/README updates |
| REQ-008 | P0 | Validate and stop before Phase 9 | Phase 8 validation report exists and Phase 9 remains blocked pending approval |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- `resource-map.yaml` contains every scoped artifact row with required fields.
- `audit-findings.jsonl` uses the phase audit schema and records fixed/deferred issues.
- `deep-ai-council`, `deep-research`, and `deep-review` keep distinct domain language.
- Changed README and SKILL files point to final resource paths.
- New assets are operational templates, not decoration.
- Validation evidence is captured in `validation-report.md` and `validation-report.jsonl`.
- Phase 9 has not run before human approval.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:rcaf -->
## 6. RCAF AND CLEAR PROMPT STANDARD

All delegated audit, rewrite, validation, and iteration prompts use RCAF:

| RCAF Field | Required Content |
|------------|------------------|
| Role | Exact specialist role, for example `sk-doc skill auditor` or `deep-review reference editor` |
| Context | Target skill path, phase folder, sk-doc template owner, inventory, scope boundaries, known facts |
| Action | Three to four ordered steps with acceptance criteria per step |
| Format | Exact output contract: JSONL rows, patch notes, validation report, or iteration JSON |

CLEAR gate before dispatch:

| Dimension | Minimum |
|-----------|---------|
| Correctness | 7 |
| Logic | 7 |
| Expression | 10 |
| Arrangement | 7 |
| Reusability | 3 |
| Total | 40/50 |

Validation/review prompts may add TIDD-EC guardrails, but RCAF stays the outer envelope.
<!-- /ANCHOR:rcaf -->

---

<!-- ANCHOR:risks -->
## 7. RISKS & DEPENDENCIES

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Resource sameness turns into copy-paste voice | Medium | Medium | Require domain uniqueness note per resource-map row |
| R-002 | Council assets become decorative | Medium | Low | Add only config, strategy, dashboard, prompt-pack, capability matrix tied to documented workflows |
| R-003 | Validation scripts reject legacy README anchors | Medium | Medium | Treat validator output as authoritative and patch anchors/links |
| R-004 | Dirty worktree hides unrelated modifications | Medium | High | Scope edits to phase packet and three skills; do not revert user changes |
| R-005 | Phase 9 starts before approval | High | Low | Blocking gate in plan, checklist, validation report, and implementation summary |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 8. NON-FUNCTIONAL REQUIREMENTS

- **NFR-DOC-001**: New markdown follows sk-doc-compatible sectioning and validates blocking rules.
- **NFR-SCOPE-001**: No runtime behavior changes outside documentation/resource routing.
- **NFR-TRACE-001**: Each touched skill has changelog and validation evidence.
- **NFR-PROMPT-001**: RCAF templates are reusable for Phase 9 and future delegated checks.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 9. EDGE CASES

| Case | Handling |
|------|----------|
| `deep-research` already aligned | Preserve resources, update version/navigation only |
| Existing dirty worktree | Scope edits to phase packet and three skills; do not revert unrelated changes |
| Validation rejects legacy anchor style | Patch changed docs to current validator output |
| Phase 9 requested before approval | Block and report the approval requirement |
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 10. COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 16/25 | Three skills, phase packet, schemas, reports |
| Risk | 8/25 | Documentation/resource-only but cross-skill routing-sensitive |
| Research | 8/20 | Requires sk-doc/sk-prompt inspection and sibling comparison |
| Multi-Agent | 8/15 | Prompt templates and Phase 9 deep-research loop |
| Coordination | 8/15 | Approval gate plus parent packet metadata |
| **Total** | **48/100** | **Level 3** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:risk-matrix -->
## 11. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Resource sameness turns into copy-paste voice | M | M | Domain uniqueness note per resource row |
| R-002 | Council assets become decorative | M | L | Assets must map to config, strategy, dashboard, prompt, or capability workflow |
| R-003 | Phase 9 starts early | H | L | Checklist, report, and summary carry the approval gate |
| R-004 | Validator template drift blocks packet | M | M | Run strict validation and patch manifest mismatches |
<!-- /ANCHOR:risk-matrix -->

---

<!-- ANCHOR:user-stories -->
## 12. USER STORIES

### US-001: Operator Navigates Deep Skills (Priority: P0)

**As an** operator, **I want** the three deep skills to share a predictable resource family, **so that** I can find quick, loop, convergence, state, asset, and validation guidance without relearning each package.

**Acceptance Criteria**:
1. Given any of the three skills, When I inspect README/SKILL/resource map, Then the resource family is explicit.

### US-002: Maintainer Preserves Domain Meaning (Priority: P0)

**As a** maintainer, **I want** council, research, and review wording to stay distinct, **so that** thresholds and outputs are not confused across skills.

**Acceptance Criteria**:
1. Given a reference or asset, When I read examples and stop signals, Then they use the owning skill's domain vocabulary.

### US-003: Reviewer Gates Phase 9 (Priority: P1)

**As a** reviewer, **I want** validation evidence before 10 research iterations run, **so that** Phase 9 merges only approved and converged map logic.

**Acceptance Criteria**:
1. Given Phase 8 is complete, When Phase 9 is requested, Then human approval is recorded first.
<!-- /ANCHOR:user-stories -->

---

<!-- ANCHOR:questions -->
## 13. OPEN QUESTIONS

- Human approval is required before Phase 9 deep-research iterations.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- `plan.md`
- `tasks.md`
- `checklist.md`
- `decision-record.md`
- `resource-map.yaml`
- `validation-report.md`

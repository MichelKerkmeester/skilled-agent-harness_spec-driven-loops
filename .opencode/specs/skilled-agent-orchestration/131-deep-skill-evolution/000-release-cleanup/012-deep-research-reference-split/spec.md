---
title: "Feature Specification: deep-research reference split and router alignment"
description: "Split the bloated deep-research convergence and state references into smaller focused docs, slim the hubs, and align the SKILL smart router with sk-doc standards."
trigger_phrases:
  - "deep-research reference split"
  - "deep-research router alignment"
  - "convergence state format split"
  - "sk-doc smart router alignment"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/131-deep-skill-evolution/000-release-cleanup/012-deep-research-reference-split"
    last_updated_at: "2026-05-24T00:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "reference-split-implemented-and-validated"
    next_safe_action: "optional-commit"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000012012"
      session_id: "131-000-012-reference-split"
      parent_session_id: "131-000-012-reference-split"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Operator selected split-and-slim over aggressive deletion."
      - "Operator selected new phase under 000-release-cleanup."
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: deep-research reference split and router alignment

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-05-24 |
| **Branch** | `main` |
| **Parent Packet** | `000-release-cleanup` |
| **Target Skill** | `.opencode/skills/deep-research/` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

`deep-research/references/convergence.md` and `deep-research/references/state_format.md` have become long monoliths. They mix live deep-research contracts, sibling `deep-review` details, reference-only future ideas, graph details, reducer details, and examples. The SKILL smart router also predates the current `sk-doc` resilient-router pattern.

### Purpose

Split the two long references into smaller focused files, keep the live deep-research contracts easy to find, replace deep-review bulk with sibling-skill pointers, and align `SKILL.md` routing with `sk-doc` standards.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Slim `references/convergence.md` into the live convergence hub.
- Add focused convergence references for signals, recovery, graph gates, and reference-only material.
- Slim `references/state_format.md` into the state packet hub.
- Add focused state references for JSONL, outputs, and reducer/registry details.
- Update `SKILL.md`, `README.md`, and `quick_reference.md` navigation.
- Correct stale deep-research convergence-weight prose to `0.30/0.35/0.35`.
- Remove deep-review bulk from deep-research references and point readers to `deep-review`.

### Out of Scope

- Runtime behavior changes.
- YAML workflow changes.
- Script, command, agent, or schema changes.
- Aggressive deletion of live deep-research contracts.

### Files Changed

| File Path | Change Type |
|-----------|-------------|
| `.opencode/skills/deep-research/references/convergence.md` | Slim hub |
| `.opencode/skills/deep-research/references/convergence_*.md` | New focused references |
| `.opencode/skills/deep-research/references/state_format.md` | Slim hub |
| `.opencode/skills/deep-research/references/state_*.md` | New focused references |
| `.opencode/skills/deep-research/SKILL.md` | Router + navigation update |
| `.opencode/skills/deep-research/README.md` | Structure and related docs update |
| `.opencode/skills/deep-research/references/quick_reference.md` | Navigation-only update |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Keep live convergence contract intact | Docs retain `0.30/0.35/0.35`, `> 0.60`, legal-stop gates, hard stops, stuck recovery, and graph STOP gating |
| REQ-002 | Keep state packet contract intact | Docs retain config, JSONL, strategy, registry, dashboard, iteration, output, lineage, and reducer ownership semantics |
| REQ-003 | Align SKILL router with sk-doc | Router includes discovery, guard, existence checks, scoring, fallback checklist, and missing-resource notice |
| REQ-004 | Remove sibling-skill bloat | Deep-review bulk sections are replaced by cross-links to `deep-review` |
| REQ-005 | Validate changed docs | sk-doc validators, grep checks, and strict spec validation pass or failures are documented |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- Long reference hubs are materially smaller and route to focused files.
- Existing deep-research runtime semantics remain unchanged.
- `README.md` and `SKILL.md` point to the split reference layout.
- `quick_reference.md` remains concise and has no stale monolith-only links.
- Verification evidence is recorded in `checklist.md` and `implementation-summary.md`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Documentation split loses contract detail | Medium | Keep hubs concise but preserve live contracts in focused refs |
| Risk | Existing dirty worktree contains unrelated changes | Medium | Scope edits to requested deep-research docs and phase packet only |
| Risk | Validator rejects legacy style | Low | Patch validation fallout without changing runtime semantics |
| Dependency | sk-doc validators | Required | Use `extract_structure.py`, `validate_document.py`, and `quick_validate.py` |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

- **NFR-DOC-001**: Keep `SKILL.md` concise enough for routing while moving deep detail to references.
- **NFR-DOC-002**: Preserve sk-doc blocking validation for changed/new markdown docs.
- **NFR-SCOPE-001**: Do not modify runtime YAML, scripts, commands, or agents.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

- **Dirty worktree**: ignore unrelated changes and report only scoped files touched by this task.
- **Review-mode material**: replace bulk with sibling-skill links, but keep enough wording that readers know where to go.
- **Reference-only material**: keep future concepts in `convergence_reference_only.md` and label them non-executable.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 10/25 | Two hubs, seven focused refs, routing/navigation updates |
| Risk | 5/25 | Documentation-only; runtime untouched |
| Coordination | 3/15 | Single skill and one phase packet |
| **Total** | **18/100** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

None. Operator selected the phase folder and split strategy.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Plan**: `plan.md`
- **Tasks**: `tasks.md`
- **Checklist**: `checklist.md`
- **Target Skill**: `.opencode/skills/deep-research/`

---
title: "Feature Specification: deep-* skill documentation evolution (008 cluster)"
description: "Phase parent for the documentation-evolution delta across the five deep-* skills: references subfoldering, oversized-file splits, sk-doc 1:1 conformance, HVR README rewrites, feature-catalog and testing-playbook conformance, an alignment gate, and a deep-research gap backstop."
trigger_phrases:
  - "deep skill doc evolution"
  - "deep-* references subfoldering"
  - "deep-* sk-doc conformance"
  - "deep-skill readme rewrite"
  - "deep-skill alignment gate"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/116-deep-skill-evolution/008-deep-skill-doc-evolution"
    last_updated_at: "2026-05-25T00:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "phase-parent-control-files-authored"
    next_safe_action: "resume-via-child-001-spec-and-resource-map"
    blockers: []
    key_files:
      - "001-spec-and-resource-map/spec.md"
      - "002-references-restructure/spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000008"
      session_id: "116-008-deep-skill-doc-evolution-parent"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Placement: new 008 child cluster inside 116; harvest 000-release-cleanup as input, do not resume its mixed state"
      - "Doc scope: core docs plus feature_catalog and manual_testing_playbook conformance"
      - "Phase 5: one focused 10-iteration cli-devin SWE-1.6 run, one-at-a-time, findings to resource-map.yaml backlog"
      - "Structure: 9 children — planning, cross-cutting references restructure, 5 per-skill doc children, validation gate, deep-research backstop"
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT -->

# Feature Specification: deep-* skill documentation evolution

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 (phase parent) |
| **Priority** | P2 |
| **Status** | In Progress |
| **Created** | 2026-05-25 |
| **Last Updated** | 2026-05-25 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | skilled-agent-orchestration/116-deep-skill-evolution |
| **Predecessor** | n/a (documentation-evolution cluster) |
| **Successor** | None planned |
| **Handoff Criteria** | Each child passes `validate.sh --strict` independently; all five skills pass the sk-doc skill toolchain (quick_validate.py, extract_structure.py DQI, package_skill.py) and HVR scoring; every moved reference has zero stale inbound links; the full vitest suite stays green |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The five deep-* skills (`deep-loop-runtime`, `deep-research`, `deep-review`, `deep-ai-council`, `deep-agent-improvement`) are mature and shipped, but their documentation surface has uneven structure. Every skill keeps its `references/` directory flat, so navigation degrades as reference count grows. Several reference files have grown into monoliths that mix multiple contracts. `deep-review/SKILL.md` exceeds the project's 500-line house rule. Feature catalogs and testing playbooks predate the latest sk-doc templates in places, and README structure varies skill to skill.

### Purpose

Evolve the documentation of all five skills to one consistent, navigable standard. Group each skill's `references/` into thematic subfolders, finish splitting the oversized reference files, bring `SKILL.md`, `README.md`, `feature_catalog/`, and `manual_testing_playbook/` to sk-doc 1:1 conformance in HVR style, reduce `deep-review/SKILL.md` under the house cap, gate the result against both the spec validator and the sk-doc skill toolchain, and run a focused deep-research backstop to capture any residual gaps as a deferred backlog.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, and decisions live in the child phase folders listed in the Phase Documentation Map below.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Subfolder the flat `references/` directories of the four reference-heavy skills (`deep-research`, `deep-review`, `deep-ai-council`, `deep-agent-improvement`)
- Split the still-oversized reference files and delete the originals after the split
- Bring `SKILL.md`, `README.md`, `feature_catalog/`, and `manual_testing_playbook/` of all five skills to sk-doc 1:1 conformance in HVR style
- Reduce `deep-review/SKILL.md` under the 500-line house rule by relocating non-core sections into `references/`
- Rewrite every inbound link that points at a moved or split reference file
- One alignment validation gate combining the spec validator and the sk-doc skill toolchain
- One focused 10-iteration deep-research run on residual documentation gaps, merged into `resource-map.yaml` as a deferred backlog

### Out of Scope

- Modifying any deep-* skill runtime behavior, scripts, schemas, or tests (except hardcoded reference paths that must move in lockstep with a `references/` file)
- Re-doing documentation work already shipped by the sibling `000-release-cleanup` buckets; the remaining delta is carried forward through `001/resource-map.yaml`
- Subfoldering `deep-loop-runtime/references/` (four files, four consumers — kept flat by design)
- Touching any other child of `116-deep-skill-evolution` or its `scratch/`

### Files to Change

> Summary for audit trail only. Per-phase detail lives in each child's plan.md.

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `<skill>/references/**` | Move/Split/Create/Delete | 002 | Subfolder + split flat references; delete originals |
| `<skill>/SKILL.md` | Modify | 003–007 | sk-doc 1:1; refresh REFERENCES + Smart Router to new layout |
| `<skill>/README.md` | Modify | 003–007 | 9-section sk-doc template, HVR style |
| `<skill>/feature_catalog/**`, `<skill>/manual_testing_playbook/**` | Modify | 003–007 | Content conformance + reflect new reference paths |
| `<skill>/changelog/vX.md` | Create | 003–007 | Per-skill release entry (no frontmatter) |
| inbound links in `.opencode/agents/`, `.opencode/commands/`, sibling skills, tests | Modify | 002 | Rewrite references/ paths |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> Each row is an independently executable child spec folder. All implementation detail lives inside the children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 001 | `001-spec-and-resource-map/` | Spec, JSON schemas, resource-map.yaml, delta reconciliation against prior cleanup | In Progress |
| 002 | `002-references-restructure/` | Subfolder + split all reference dirs, rewrite inbound links, fix hardcoded test paths | Planned |
| 003 | `003-deep-loop-runtime-docs/` | deep-loop-runtime SKILL/README/catalog/playbook conformance (light touch) | Planned |
| 004 | `004-deep-research-docs/` | deep-research doc conformance + Smart Router refresh | Planned |
| 005 | `005-deep-review-docs/` | deep-review doc conformance + SKILL.md house-cap reduction | Planned |
| 006 | `006-deep-ai-council-docs/` | deep-ai-council doc conformance + Smart Router refresh | Planned |
| 007 | `007-deep-agent-improvement-docs/` | deep-agent-improvement doc conformance + Smart Router refresh | Planned |
| 008 | `008-alignment-validation-gate/` | Combined spec + skill validation gate, per-artifact pass/fail | Planned |
| 009 | `009-deep-research-gap-backstop/` | 10-iteration deep-research on residual gaps, merge to resource-map.yaml | Planned |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- `002` MUST complete, re-link, and show green CI before any per-skill child (`003`–`007`) runs, because READMEs and catalogs reference the new paths
- Per-skill children `003`–`007` run in parallel, capped at three concurrent CLI dispatches
- `008` runs after all per-skill children; `009` runs last and its loops never overlap
- Run `validate.sh --recursive` on this parent to validate all phases as one unit

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001 | 002 | resource-map.yaml maps every artifact to its sk-doc template; inbound-link inventory complete | `validate.sh --strict 001-...` exit 0 |
| 002 | 003–007 | Every moved file re-linked; the three hardcoded reference tests pass | `grep` returns zero stale paths; `vitest run` green |
| 003–007 | 008 | Each skill's docs conform to sk-doc + HVR; changelog bumped | per-skill DQI ≥75, HVR ≥85 |
| 008 | 009 | Gate report shows zero unresolved deviations | combined gate exit 0 |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- Final subfolder taxonomy per skill is proposed in `001` and confirmed during `002`; the deep-research backstop (`009`) may surface a better grouping for a follow-on.
- Whether `deep-research/SKILL.md` (499 lines, at the house cap) needs a small trim for headroom is decided in `004`.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md
- **Parent Spec**: See `../spec.md` (116-deep-skill-evolution)
- **Standards**: `.opencode/skills/sk-doc/assets/skill/` (templates), `.opencode/skills/sk-doc/references/global/hvr_rules.md` (HVR), `.opencode/skills/sk-doc/references/global/validation.md` (DQI)
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer

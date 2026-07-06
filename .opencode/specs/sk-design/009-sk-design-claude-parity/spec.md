---
title: "Feature Specification: sk-design Claude parity phased refactor"
description: "Coordinate a five-phase refactor of .opencode/skills/sk-design toward Claude Design-like behavior while preserving OpenCode-native routing, mode packets, proof gates, and measured extraction features."
trigger_phrases:
  - "sk-design Claude parity"
  - "Claude Design-like sk-design refactor"
  - "sk-design procedure card layer"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-design/009-sk-design-claude-parity"
    last_updated_at: "2026-07-05T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Initialized lean phase-parent docs from completed research evidence."
    next_safe_action: "Author and validate child phase 001-baseline-ownership-gate before implementation begins."
    blockers:
      - "Child phase folders are not yet authored."
    key_files:
      - "spec.md"
      - "research/research.md"
      - "research/iterations/iteration-010.md"
    completion_pct: 0
    open_questions:
      - "Child phases must bind ownership, thresholds, and release authority before sk-design edits."
    answered_questions:
      - "The parent decomposition uses five planned child phases."
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT — root purpose + planned child list + outcome only; heavy docs live in children. -->

# Feature Specification: sk-design Claude parity phased refactor

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Structure** | Phase Parent lean trio |
| **Priority** | P1 |
| **Status** | Draft; planning only; implementation not started |
| **Created** | 2026-07-05 |
| **Branch** | `main` |
| **Parent Spec** | None; root packet under the design track |
| **Parent Packet** | `sk-design` |
| **Source Evidence** | `research/research.md`; `research/iterations/iteration-010.md` |
| **Handoff Criteria** | Child phases are authored, approved, and validated independently before any `.opencode/skills/sk-design/**` implementation work begins |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The research packet found that `sk-design` already has the right OpenCode-native backbone: one advisor-routable hub, five public modes, registry-driven routing, a shared reference base, and a measured `design-md-generator` extraction backend. The gap is behavioral: it needs the delivery choreography and procedure granularity of a Claude Design-like manager without replacing the OpenCode-native routing model or expanding into many public design identities. Source material: `research/research.md` and `research/iterations/iteration-010.md`.

### Purpose

Coordinate a phased refactor of `.opencode/skills/sk-design` toward Claude Design-like behavior while preserving OpenCode-native features. The parent defines the child-phase map and high-level outcome only; detailed planning, tasking, decisions, verification, and implementation evidence belong in the child phase folders.

> **Phase-parent note:** This `spec.md` is the only authored markdown document at the parent level. The parent root intentionally stays lean: `spec.md`, `description.json`, and `graph-metadata.json`.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Coordinate the five planned child phases listed in the Phase Documentation Map.
- Preserve one public `sk-design` identity, five public modes, registry-driven routing, proof gates, and the measured `design-md-generator` backend.
- Stage a private procedure-card layer inside existing packets rather than creating new public modes.
- Make benchmark and release gates prove behavior: procedure selection, packet loading, context/proof fields, review lanes, extraction fidelity, and negative controls.
- Keep implementation status at planning-only until child phases exist and validate.

### Out of Scope

- Parent-root heavy docs such as `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, and `implementation-summary.md`.
- Direct edits to `.opencode/skills/sk-design/**` from the parent packet.
- Edits to `external/**`, `research/**`, or child phase files from this parent initialization.
- Adding public `sk-design` advisor identities or replacing the existing mode registry as the routing source of truth.

### Files to Change

Per-phase file detail belongs in each child phase. This parent only names the expected work areas for audit orientation:

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `.opencode/skills/sk-design/` | Planned refactor | 002-005 | Hub compatibility, private procedure cards, mode packet content, and release-gate evidence owned by child phases |
| [001-baseline-ownership-gate/spec.md](001-baseline-ownership-gate/spec.md) | Planned docs | 001 | Baseline, ownership, and pre-build gates |
| [002-parent-hub-compatibility-shell/spec.md](002-parent-hub-compatibility-shell/spec.md) | Planned docs | 002 | Parent hub compatibility shell plan and verification |
| [003-private-procedure-card-layer/spec.md](003-private-procedure-card-layer/spec.md) | Planned docs | 003 | Private procedure schema, index, and card placement plan |
| [004-mode-packet-refactor/spec.md](004-mode-packet-refactor/spec.md) | Planned docs | 004 | Per-mode packet refactor plan and acceptance checks |
| [005-parity-benchmark-release-gate/spec.md](005-parity-benchmark-release-gate/spec.md) | Planned docs | 005 | Router baseline, parity scenarios, live checks, and release gate |
| [006-parent-skill-canon-verification/spec.md](006-parent-skill-canon-verification/spec.md) | Planned docs | 006 | Parent-skill canon re-verification and procedures-pattern formalization decision |
| [007-procedure-card-template-alignment/spec.md](007-procedure-card-template-alignment/spec.md) | Planned docs | 007 | Procedure-card template alignment audit and decision-conditioned plan |
| [008-smart-routing-optimization/spec.md](008-smart-routing-optimization/spec.md) | Planned docs | 008 | Smart routing optimization plan for hub and mode packets |
| [009-readme-alignment/spec.md](009-readme-alignment/spec.md) | Planned docs | 009 | Hub and mode-packet README alignment plan |
| [010-feature-catalog-completeness/spec.md](010-feature-catalog-completeness/spec.md) | Planned docs | 010 | Feature catalog completeness plan for hub and uncataloged modes |
| [011-manual-testing-playbook-alignment/spec.md](011-manual-testing-playbook-alignment/spec.md) | Planned docs | 011 | Manual testing playbook alignment plan for hub and mode packets |
| [012-routing-benchmark-rigor/spec.md](012-routing-benchmark-rigor/spec.md) | Planned docs | 012 | Rigorous routing benchmark and skill-advisor verification plan |
| [013-design-commands-asset-refactor/spec.md](013-design-commands-asset-refactor/spec.md) | Planned docs | 013 | Design commands router+assets refactor plan |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each planned phase is an independently executable child spec folder. All implementation details live inside those phase children once authored.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 001 | [001-baseline-ownership-gate/spec.md](001-baseline-ownership-gate/spec.md) | Bind ownership of current `sk-design` state, capture router and metadata baseline, define entry gates, and confirm implementation is safe to start. | Planned |
| 002 | [002-parent-hub-compatibility-shell/spec.md](002-parent-hub-compatibility-shell/spec.md) | Add the Claude Design-like manager contract at the hub level while preserving OpenCode routing, registry keys, and packet boundaries. | Planned |
| 003 | [003-private-procedure-card-layer/spec.md](003-private-procedure-card-layer/spec.md) | Define the private procedure-card schema, index, context fields, proof fields, outputs, and negative rules without adding public modes. | Planned |
| 004 | [004-mode-packet-refactor/spec.md](004-mode-packet-refactor/spec.md) | Refactor existing mode packets so production, system, motion, audit, and extraction procedures live with their owning modes. | Planned |
| 005 | [005-parity-benchmark-release-gate/spec.md](005-parity-benchmark-release-gate/spec.md) | Prove parity behavior with router baseline replay, procedure-selection scenarios, proof gates, extraction fidelity checks, and release authority. | Planned |
| 006 | [006-parent-skill-canon-verification/spec.md](006-parent-skill-canon-verification/spec.md) | Re-verify `sk-design` against the parent-skill canon checker with fresh, phase-owned evidence and decide whether the private `procedures/`/`proceduresPath` pattern becomes sk-doc canon or stays sk-design-local. | Planned |
| 007 | [007-procedure-card-template-alignment/spec.md](007-procedure-card-template-alignment/spec.md) | Audit the fourteen existing procedure cards and the schema doc against sk-doc's template canon and plan a decision-conditioned alignment path gated on Phase 006. | Planned |
| 008 | [008-smart-routing-optimization/spec.md](008-smart-routing-optimization/spec.md) | Plan a content-quality optimization pass over the hub and five mode packets' SMART ROUTING sections, grounded in Lane-C benchmark evidence and the mode-registry transform-verb routing table. | Planned |
| 009 | [009-readme-alignment/spec.md](009-readme-alignment/spec.md) | Bring the hub `README.md` and five mode-packet `README.md` files up to date with the shipped Phase 002-005 reality. | Planned |
| 010 | [010-feature-catalog-completeness/spec.md](010-feature-catalog-completeness/spec.md) | Plan sk-doc-conformant `feature_catalog/` packages for the hub and four uncataloged modes, plus a completeness audit of the one existing catalog. | Planned |
| 011 | [011-manual-testing-playbook-alignment/spec.md](011-manual-testing-playbook-alignment/spec.md) | Plan hub and mode-packet manual testing playbook scenario additions covering hub manager behavior, per-mode procedure-card selection proof, and context/proof/fallback contracts. | Planned |
| 012 | [012-routing-benchmark-rigor/spec.md](012-routing-benchmark-rigor/spec.md) | Plan a larger benchmark corpus, a frozen post-011 baseline, and numerically-gated routing-accuracy verification across advisor confidence, hub mode-resolution, and procedure-card selection. | Planned |
| 013 | [013-design-commands-asset-refactor/spec.md](013-design-commands-asset-refactor/spec.md) | Plan the router+assets refactor of all five `/design:*` commands into thin routers plus owned auto/confirm workflow YAML and a presentation dashboard. | Planned |

### Phase Transition Rules

- Each child phase MUST pass strict validation independently before dependent implementation begins.
- Parent status remains planning-only until at least the first child phase is authored and approved.
- Parent metadata tracks aggregate status; detailed tasks, checklists, decisions, and evidence live in child folders only.
- Research evidence remains read-only source material for this parent: `research/research.md` and `research/iterations/iteration-010.md`.

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|----|----------|--------------|
| Parent | 001 | Parent lean trio exists; research source material is cited; child plan can bind ownership and baseline gates | JSON syntax checks plus parent validation attempt |
| 001 | 002 | Ownership, baseline, and acceptance thresholds are explicit | Child strict validation and user approval |
| 002 | 003 | Hub shell preserves public routing contract while adding manager choreography | Child strict validation and router baseline check |
| 003 | 004 | Procedure-card layer is private, indexed, and mapped to existing modes | Child strict validation and schema/index check |
| 004 | 005 | Mode packet refactor preserves OpenCode-native features and mode boundaries | Child strict validation plus packet-level checks |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- Which existing uncommitted `sk-design` changes, if any, are baseline state versus work to preserve?
- What release authority decides whether parity benchmark failures block or defer release?
- Should acceptance require router-only evidence first, or router plus live/manual design-manager scenarios before release?
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Research synthesis:** `research/research.md`
- **Final blueprint:** `research/iterations/iteration-010.md`
- **Planned child phases:** [001-baseline-ownership-gate/spec.md](001-baseline-ownership-gate/spec.md), [002-parent-hub-compatibility-shell/spec.md](002-parent-hub-compatibility-shell/spec.md), [003-private-procedure-card-layer/spec.md](003-private-procedure-card-layer/spec.md), [004-mode-packet-refactor/spec.md](004-mode-packet-refactor/spec.md), [005-parity-benchmark-release-gate/spec.md](005-parity-benchmark-release-gate/spec.md)
- **Parent metadata:** `description.json`, `graph-metadata.json`

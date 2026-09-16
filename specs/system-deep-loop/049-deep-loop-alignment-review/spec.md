---
title: "Feature Specification: Angle-driven alignment review of the deep-loop system, its routers, skills, catalogs, commands, agents, executors and architecture against the repo rules"
description: "[One-line description]"
trigger_phrases:
  - "[Trigger phrase 1]"
  - "[Trigger phrase 2]"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/049-deep-loop-alignment-review"
    last_updated_at: "2026-04-11T00:00:00Z"
    last_updated_by: "template-author"
    recent_action: "Initialize phase-parent continuity block"
    next_safe_action: "Plan or resume a child phase folder"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "template-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: phase-parent-spec | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT
  FORBIDDEN content (do NOT author at phase-parent level):
    - merge/migration/consolidation narratives (consolidate*, merged from, renamed from, collapsed, X→Y, reorganization history)
    - migrated from, ported from, originally in
    - heavy docs: plan.md, tasks.md, decision-record.md, implementation-summary.md — these belong in child phase folders only
  REQUIRED content (MUST author at phase-parent level):
    - Root purpose: what problem does this entire phased decomposition solve?
    - Sub-phase list: which child phase folders exist and what each one does
    - What needs done: the high-level outcome the phases work toward
-->

# Feature Specification: Angle-driven alignment review of the deep-loop system, its routers, skills, catalogs, commands, agents, executors and architecture against the repo rules

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | [YYYY-MM-DD] |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | scaffold/049-deep-loop-alignment-review |
| **Predecessor** | [Predecessor-packet] |
| **Successor** | [Successor-packet, or "None"] |
| **Handoff Criteria** | Validator + template + generator changes ship so parent validates under tolerant policy |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The containment packet changed the deep-loop runtime, its commands, protocols, catalogs, agents and packet docs across twenty phases. Its closing review found the surfaces still disagree in places it rated below P1 and left unbound: hub SKILL.md files against their registries and routers, catalogs against the runtime, READMEs against the code, executor rosters against the seven CLI kinds now registered. Nobody has read the whole system as one architecture, or against the repo rules that say how it should have been built.

### Purpose
Every surface of the deep-loop system says the same thing as every other and as the code, proven by an angle-driven review whose every finding, of any severity, becomes a phase here.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Phase 001: twenty review iterations in two angle-driven waves, half on DeepSeek V4.1 Flash max and half on GLM 5.3 Flash max via the gateway on cli-pi, with wave-two angles rewritten from wave-one findings
- Phases 002 onward: one phase per confirmed finding class at any severity, P0 to P3, each fixed by DeepSeek V4.1 Flash max on cli-pi and suite-verified before the next
- The hubs system-deep-loop, sk-code and cli-external-orchestration, their modes, routing artifacts, references, assets, catalogs, playbooks, READMEs, commands, agents and mirrors, the runtime as one architecture, and the repo rules as the standard the fixes are held to

### Out of Scope
- Fixing inside the review phase - findings become phases, nothing else
- Surfaces outside those hubs and sk-doc, unless an angle crosses into them

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `001-angle-driven-review/` | Create | The review, its angles and its four lineages |
| phases 002 onward | Create | One per confirmed finding class |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | 001-angle-driven-review/ | Twenty angle-driven review iterations across four lanes in two waves | Complete |
| 2 | 002-roster-completeness/ | Every roster names all seven CLI executor kinds | Complete |
| 3 | 003-version-authority/ | One version authority per hub, carried by its routing artifacts | Complete |
| 4 | 004-leaf-manifest-and-doctrine-reachability/ | Leaf manifests see symlinked leaves, and doctrine is reachable | Complete |
| 5 | 005-catalog-and-readme-truth/ | Ten classes of documentation that contradicted the tree | Complete |
| 6 | 006-confirm-variant-parity/ | The interactive command variants match their unattended twins or say why not | Complete |
| 7 | 007-ledger-stem-producers/ | Every registered ledger stem is spoken or reserved with its reason | Complete |
| 8 | 008-agent-mirror-parity/ | One crosswalk for how a declaration reaches all six agent trees | Complete |
| 9 | 009-containment-promise-and-severity-scale/ | The containment promise and the verdict contract describe their mechanisms | Complete |
| 10 | 010-version-authority-completion/ | The two hubs the version-authority phase left out | Complete |
| 11 | 011-routing-doctrine-and-discovery/ | One always-loaded policy per hub, and no dead discovery vocabulary | Complete |
| 12 | 012-missing-stress-fixture-root/ | The stress fixture three scenarios name, restored to current tree shapes | Complete |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/spec_kit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
<!-- [HANDOFF_ROW] — Replaced by create.sh with full 4-column table rows -->
| 001-angle-driven-review | 002-roster-completeness | [Criteria TBD] | [Verification TBD] |
| 002-roster-completeness | 003-version-authority | [Criteria TBD] | [Verification TBD] |
| 003-version-authority | 004-leaf-manifest-and-doctrine-reachability | [Criteria TBD] | [Verification TBD] |
| 004-leaf-manifest-and-doctrine-reachability | 005-catalog-and-readme-truth | [Criteria TBD] | [Verification TBD] |
| 005-catalog-and-readme-truth | 006-confirm-variant-parity | [Criteria TBD] | [Verification TBD] |
| 006-confirm-variant-parity | 007-ledger-stem-producers | [Criteria TBD] | [Verification TBD] |
| 007-ledger-stem-producers | 008-agent-mirror-parity | [Criteria TBD] | [Verification TBD] |
| 008-agent-mirror-parity | 009-containment-promise-and-severity-scale | [Criteria TBD] | [Verification TBD] |
| 009-containment-promise-and-severity-scale | 010-version-authority-completion | [Criteria TBD] | [Verification TBD] |
| 010-version-authority-completion | 011-routing-doctrine-and-discovery | [Criteria TBD] | [Verification TBD] |
| 011-routing-doctrine-and-discovery | 012-missing-stress-fixture-root | [Criteria TBD] | [Verification TBD] |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- Which wave-one findings reshape the wave-two angles: answered in the phase 001 spec before wave two runs.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md
- **Parent Spec**: See `../spec.md`
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer

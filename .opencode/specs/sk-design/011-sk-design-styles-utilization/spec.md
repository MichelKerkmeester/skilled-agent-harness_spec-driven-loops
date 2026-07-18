---
title: "Feature Specification: sk-design styles-library utilization"
description: "Decide how the ~1,290-style DESIGN.md/token library extracted from Refero should be used across the sk-design parent hub and its nested modes — starting with a deep-research phase, then implementation phases the research seeds."
trigger_phrases:
  - "sk-design styles utilization"
  - "use the refero style library"
  - "design token library retrieval"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-design/011-sk-design-styles-utilization"
    last_updated_at: "2026-07-18T09:22:48Z"
    last_updated_by: "claude"
    recent_action: "Initialized the lean phase-parent for styles-library utilization"
    next_safe_action: "Run the deep-research loop in child 001"
    blockers: []
    key_files:
      - "spec.md"
      - "001-research-utilization/spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-styles-utilization-011"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Which utilization patterns are worth building after the research converges?"
    answered_questions:
      - "The first phase is a deep-research investigation before any implementation."
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT — root purpose + planned child list + outcome only; heavy docs live in children. -->

# Feature Specification: sk-design styles-library utilization

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Structure** | Phase Parent lean trio |
| **Priority** | P1 |
| **Status** | Research in progress — 001 complete; 002 (md-generator) + 003 (global modes) loops dispatched; implementation phases (004+) gated on their convergence |
| **Created** | 2026-07-18 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | None; root packet under the design track |
| **Parent Packet** | `sk-design` |
| **Handoff Criteria** | The research phase converges and produces ranked, evidence-backed utilization strategies before any implementation phase is authored |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Packet `010-sk-design-styles-from-refero` extracts ~1,290 real design systems into `.opencode/skills/sk-design/styles/`, each a folder of DESIGN.md + CSS-variables + Tailwind-v4 + design-tokens + provenance. That is a large, high-value corpus, but nothing in the `sk-design` runtime yet consumes it: the hub and its nested modes (interface, foundations, motion, audit, md-generator) have no retrieval, indexing, or reference discipline for the library, so its leverage is currently zero and its size is a liability rather than an asset.

### Purpose

Determine, with evidence, the smart ways to put the styles library to work across `sk-design` — retrieval and indexing, which modes should consume it and how, when to reference a real style versus synthesize, tooling and guardrails against generic/slop output — and then execute the strategies the research ranks highest. The parent defines the child-phase map only; the research and each implementation phase live in child folders.

> **Phase-parent note:** This `spec.md` is the only authored markdown document at the parent level. The parent root intentionally stays lean: `spec.md`, `description.json`, and `graph-metadata.json`.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- A deep-research investigation (child 001) into how the styles library should be indexed, retrieved, and consumed across the sk-design hub and its five modes, with ranked, evidence-backed recommendations.
- Implementation phases (child 002+, authored after the research converges) that build the highest-leverage utilization strategies the research identifies.

### Out of Scope

- The extraction itself (owned by packet 010).
- Any sk-design runtime change before the research converges and its recommendations are approved.

### Files to Change

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `011-.../001-research-utilization/` | Create | 001 | Deep-research charter + the loop's research artifacts |
| `.opencode/skills/sk-design/**` | Modify | 002+ (planned) | Utilization features the research seeds (retrieval, mode consumption, guardrails) |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | `001-research-utilization/` | Deep-research: how to index, retrieve, and consume the styles library across sk-design + modes | Complete — 8 iters, ranked synthesis |
| 2 | `002-md-generator-upgrade/` | Deep-research: how the library upgrades the design-md-generator mode (exemplars, schema calibration, token grounding, validation) | Complete — 5 iters, ranked nine-lever synthesis |
| 3 | `003-global-modes-utilization/` | Deep-research: how the library integrates globally across the hub + interface/foundations/motion/audit/open-design modes | In Progress — loop dispatched |
| 4+ | `004-*` (planned) | Build the top-ranked strategies from 001/002/003 | Planned — pending research convergence |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins.
- Parent spec tracks aggregate progress via this map.
- Use `/speckit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase.
- Run `validate.sh --recursive` on the parent to validate all phases as an integrated unit.
- No implementation phase is authored until the research phase records ranked, evidence-backed recommendations.

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001 research | 002+ implementation | The research loop converges with ranked utilization strategies, each carrying evidence and a rough build cost | `001-.../research/research.md` synthesis + a selected strategy set |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- Which retrieval substrate fits: a static index the modes read, a queryable tokens store, or on-demand grep over DESIGN.md?
- How is "reference a real style vs synthesize" decided so output stays distinctive, not averaged?
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md.
- **Source corpus**: `.opencode/skills/sk-design/styles/` (the extracted library; packet `010-sk-design-styles-from-refero`).
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id`.

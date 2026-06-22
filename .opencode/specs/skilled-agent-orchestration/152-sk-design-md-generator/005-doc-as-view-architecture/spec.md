---
title: "Feature Specification: Doc-as-view architecture (deterministic render, AI out of the value tables) [template:level_2/spec.md]"
description: "The structural endgame: generate the value-bearing sections deterministically from tokens (no AI), reduce AI prose to short token-cited annotations, and enforce citation gating. Removes the AI from the value-table surface where it can fabricate."
trigger_phrases:
  - "doc as view architecture"
  - "deterministic formatters"
  - "prompt builder"
  - "citation gating"
  - "three-class section partition"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/152-sk-design-md-generator/005-doc-as-view-architecture"
    last_updated_at: "2026-06-22T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Scaffolded phase 005 from research Phase 4"
    next_safe_action: "Build formatters.ts Phase A (§2 Color + §3 Typography) first"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design-md-generator/tool/scripts/validate.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-152-005"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Phase scope derived from research/research.md (50-iteration deep-research loop)"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
# Feature Specification: Doc-as-view architecture (deterministic render, AI out of the value tables)

<!-- SPECKIT_LEVEL: 2 -->

---

## EXECUTIVE SUMMARY

Instead of the AI writing the value tables (where it can invent), a script generates them straight from tokens. The AI then only writes short notes that must cite a token. This structurally removes the fabrication surface for the worst sections.

Parent packet: `skilled-agent-orchestration/152-sk-design-md-generator` (phase parent). Evidence base: `research/research.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Phase** | 005 of 006 |
| **Parent** | `skilled-agent-orchestration/152-sk-design-md-generator` |
| **Level** | 2 |
| **Research source** | research.md §6 Phase 4 + iter-030/042 |
| **Status** | planned |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Even with phases 002-004, the AI still hand-assembles value tables (colors, type, shadows) from raw JSON — the assembly step where fabrication enters and which the validator can only partially catch. There is no prompt-builder; the AI gets the raw DesignTokens blob.

### Purpose

Invert the artifact hierarchy: tokens.json becomes the primary deliverable and DESIGN.md a deterministic render. Partition sections into (a) deterministic / (b) grounded-annotation / (c) bounded-prose; generate (a) by script; require token citations for (b)/(c).
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- `formatters.ts`: deterministic markdown renderers for class-(a) sections (colors, typography, spacing, radii, shadows, contrast, breakpoints, icons, token dictionary). Phase A ships §2 Color + §3 Typography first (~200 LOC).
- `build-write-prompt.ts`: a prompt-builder that pre-renders deterministic tables, marks each section PRESENT/ABSENT, pre-filters by stability class, and outputs a constrained prompt (replaces the manual copy-paste template).
- Citation gating in validate.ts (`checkCitationGating`): class-(b)/(c) lines must carry a resolvable `[token: <path>]` marker.
- Three-class section partition wired through the format spec + SKILL.md.

### Out of Scope

- DTCG typed-token migration + tokens.css (phase 006).
- Sections that need semantic data the tokens don't carry (§0/§1/§7/§8 — phase 006/accept-open).

### Files to Change

| File | Why |
|------|-----|
| `tool/scripts/formatters.ts` | NEW — deterministic section renderers |
| `tool/scripts/build-write-prompt.ts` | NEW — constrained prompt-builder |
| `tool/scripts/validate.ts` | checkCitationGating |
| `tool/resources/design_md_format.md` | three-class section partition |
| `SKILL.md` | WRITE phase consumes pre-rendered tables; class contract |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

- **REQ-005-1** [P0] Class-(a) value sections are rendered deterministically by formatters.ts from tokens.json with zero AI involvement (Phase A: §2 Color + §3 Typography proven first).
- **REQ-005-2** [P0] The WRITE phase receives pre-rendered tables + PRESENT/ABSENT markers via build-write-prompt.ts; it is contractually forbidden from editing class-(a) sections.

### P1 - Required (complete OR user-approved deferral)

- **REQ-005-3** [P1] checkCitationGating enforces a resolvable token citation on every class-(b)/(c) line.
- **REQ-005-4** [P1] The three-class partition is documented and the remaining class-(a) formatters are implemented behind it.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- The §2 Color and §3 Typography tables are byte-identical across re-runs (deterministic) and exactly match tokens.json.
- The AI cannot alter a class-(a) value; attempts are rejected by validation.
- Every class-(b)/(c) sentence carries a resolvable token citation.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Risk | Likelihood/Impact | Mitigation / Guard |
|------|-------------------|--------------------|
| Deterministic rendering is harder for some sections (components, motion) | Med / Med | Phase A scopes to the cleanest sections (color, type) first; components/motion stay class-(b) annotation until proven |
| Large rebuild destabilizes the working pipeline | Med / High | Ship Phase A independently behind a flag; keep the AI-write path as fallback until parity is shown on anobel + gold-standard |
| Citation proves provenance not truth | Low / Med | Class-(b)/(c) lines carry [INFERRED] labels; consumers treat them as AI interpretation (accepted, documented) |

**Depends on:** Phases 002-004 (accurate tokens + data-driven contract + the validator hooks the citation gate plugs into).
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Reliability
Every change keeps the anobel example (`output/anobel-com/`) and the 4 gold-standard examples extracting and validating; capture the baseline before, report the delta after.

### Performance
Adds a fast pre-render step; removes AI effort on value tables — net neutral-to-faster.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

- A section with no tokens → formatters emit ABSENT, not an empty table.
- A class-(b) line with no citation → rejected by checkCitationGating.
- Re-run on the same tokens → identical class-(a) output.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ASSESSMENT

~600 LOC: new formatters.ts + prompt-builder + citation gating + section-class partition. High blast radius (pipeline rebuild) — flag-gated, parity-proven. Level 2 (phased).
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

No open questions block this phase; the research (`research/research.md`) resolved the design questions. Implementation-time questions are tracked in `tasks.md`.
<!-- /ANCHOR:questions -->

---


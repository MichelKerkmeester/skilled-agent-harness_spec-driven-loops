---
title: "Feature Specification: Claude Design parity keystone build"
description: "Implement the hardened 005 recommendation + 006 net-new ideas as one shared cross-skill protocol (claude_design_parity.md) plus minimal behavioral hooks in sk-design-interface and mcp-magicpath. Keeps both skills lean and anti-default; no style presets."
trigger_phrases:
  - "claude design parity build"
  - "shared design parity protocol"
  - "reuse before generate fidelity check"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/143-sk-design-interface/007-claude-design-parity-build"
    last_updated_at: "2026-06-14T09:35:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Keystone shared protocol + skill hooks implemented and validated"
    next_safe_action: "Operator reviews; commit when ready"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design-interface/references/claude_design_parity.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-148-007-claude-design-parity-build"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

# Feature Specification: Claude Design parity keystone build

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-06-14 |
| **Branch** | `028-mcp-to-cli-tool-transition` |
| **Source** | Implements the hardened `../005-claude-design-parity-research/research/research.md` (§13) + `../006-competitor-design-tools-research/research/research.md` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The 005 (hardened) and 006 research converged on a keystone: wire `sk-design-interface` (judgment) and `mcp-magicpath` (canvas/CLI) into the loop Claude Design has, grounded in a real design system, without cloning a hosted product or adding a style chooser. The connective protocol did not exist.

### Purpose
Implement the keystone leanly: one shared protocol reference both skills consume, plus minimal behavioral hooks in each SKILL.md, so the skills stay lean and anti-default.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A new shared reference `sk-design-interface/references/claude_design_parity.md` consolidating the protocol: context-snapshot intake, design-system adherence + reuse-before-generate, element-target revision grammar, the `previewImageUrl` fidelity check (gated on the quality floor + anti-default critique), generated/presentational boundary, build-error self-healing, optional handoff block, guarded direction gate, and the SKIP guardrails.
- Minimal SKILL.md hooks + resource-loading + graph-metadata pointers in `sk-design-interface` and `mcp-magicpath`.

### Out of Scope
- Any style preset / pick-a-vibe / named-lever surface (deleted by the hardening).
- Multi-format export, hosted canvas, Git/PR ownership, backend gen, writing themes to MagicPath.
- Changing `design_principles.md` content (it remains the authority).
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

- R1: The shared protocol reference exists and consolidates the hardened keystone set in one place.
- R2: `sk-design-interface` points to it (references + resource-loading + graph-metadata) without bloating SKILL.md.
- R3: `mcp-magicpath` points to it with the canvas-side hooks (reuse-before-generate, `previewImageUrl` fidelity + self-heal, revision grammar, generated/presentational boundary).
- R4: The fidelity check uses `previewImageUrl`, never a `view`/`share` browser screenshot; gated on `ux_quality_reference.md` + anti-default critique.
- R5: No style presets / named levers anywhere; `design_principles.md` content unchanged; both skills pass `package_skill.py`.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- Both skills validate (`package_skill.py`) and stay under the SKILL.md size cap.
- The protocol is consultable from both skills via a short pointer; the heavy content lives once in the shared reference.
- The fidelity mechanism is `previewImageUrl`-based with the browser-test caveat recorded.
- The anti-default guardrail holds (no presets/levers); `design_principles.md` unchanged.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Risk / Dependency | Mitigation |
|-------------------|------------|
| Bloating two lean skills | Protocol lives in ONE shared reference; SKILL.md hooks are a few lines each |
| Re-introducing a style chooser | Guardrail section in the protocol + no levers; direction gate is brief-specific only |
| Fidelity mechanism infeasibility (the harden finding) | Uses `previewImageUrl` (backend-rendered, auth-safe), not the gated canvas URL |
| Depends on 005 hardened + 006 | Both complete and validated |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Whether a future packet should add a tiny `previewImageUrl` fetch helper script; deferred until the loop is exercised in practice.

<!-- ANCHOR:nfr -->
### Non-Functional Requirements
- SKILL.md size discipline maintained for both skills.
- Zero new runtime dependencies (the protocol is documentation; the fidelity mechanism uses existing CLI fields).
- Anti-default and lean-skill principles are hard constraints.
<!-- /ANCHOR:nfr -->

<!-- ANCHOR:edge-cases -->
### Edge Cases
- No design system present: reuse-before-generate is a no-op; the anti-default process governs.
- No render surface: the fidelity check is skipped, not faked.
- MagicPath canvas only viewable when signed in: never automate it; use `previewImageUrl`.
<!-- /ANCHOR:edge-cases -->

<!-- ANCHOR:complexity -->
### Complexity Assessment
Low-moderate. The change is one reference doc + small hooks; the risk is conceptual (keeping it lean and anti-default), not technical.
<!-- /ANCHOR:complexity -->
<!-- /ANCHOR:questions -->

---

## BEFORE vs AFTER

The detailed transformation both skills underwent across the 148 epic (research 002/005/006, build 003/007, docs 004/008). This documents skill capability, not spec-folder history.

### sk-design-interface

| Dimension | Before (vendored Anthropic install) | After (v1.0.0.0) |
|---|---|---|
| What it is | Prose-only design judgment skill | Judgment skill backed by design data, search, and a shared parity loop |
| Design data | None | `assets/data/` with 9 MIT CSVs (styles, colors, typography, ui-reasoning, products, landing, ux-guidelines, charts, app-interface) |
| Lookup | None | `scripts/design_search.py` (optional, zero-dep BM25, query-only) |
| Quality floor | One sentence in SKILL.md ("responsive, visible focus, reduced motion") | `references/ux_quality_reference.md` as an explicit pass/fail gate |
| Aesthetic guidance | The anti-default principles only | + `references/design_inventory.md` (data framed as patterns to deviate from, never a chooser) |
| Iteration | Private, in-thinking; "screenshot if possible" | The parity loop: render -> `previewImageUrl` fidelity check gated on the quality floor + anti-default critique -> targeted revision |
| Design-system inheritance | Not addressed | Reuse-before-generate + adherence framing when a system is present |
| Output/handoff | Prose intent handed to sk-code | Optional structured handoff block (tokens, files, checks, next steps) |
| Docs | SKILL.md + 1 reference | + 3 references, feature_catalog (13 features), manual_testing_playbook (9 scenarios), changelog |
| License | Apache-2.0 | Apache-2.0 (principles) + MIT (data and search), attributed |
| Philosophy | Anti-default, anti-templated | Unchanged and reinforced: no presets, no generator, no style dials |

### mcp-magicpath

| Dimension | Before (v1.0.0.0 install) | After (v1.1.0.0) |
|---|---|---|
| "Done" criterion | Build compiles + responsive | + render matches intent via the `previewImageUrl` fidelity check |
| Design grounding | Apply sk-design-interface before building | + reuse-before-generate from the registered theme's components |
| Build errors | Reported to the user | Self-healed within the editable boundary (capped retries) |
| Revisions | Generic re-prompt | Element-target grammar: broad feedback re-plans, targeted feedback scopes `code start --component --revision` |
| Fidelity tooling | None | `scripts/design_fidelity.py` (fetches the backend-rendered preview; query-only) |
| Boundary | Editable-file boundary only | + generated/presentational boundary (import installed components, never copy generated markup) |
| Docs | README + scripts README | + parity subsections, helper docs, changelog |

### The connective change (the keystone)

Before, the two skills were composed (`mcp-magicpath depends_on sk-design-interface`) but the transitions between design context, iteration, and handoff were implicit. After, one shared `references/claude_design_parity.md` protocol makes that loop explicit and single-sourced, so both skills approach Claude Design's workflow without cloning a hosted product, merging the skills, or adding a templated-style chooser.


---
title: "Feature Specification: Claude Design parity keystone build"
description: "Implement the hardened 005 recommendation + 006 net-new ideas as one shared cross-skill protocol (claude_design_parity.md) plus minimal behavioral hooks in sk-interface-design and mcp-magicpath. Keeps both skills lean and anti-default; no style presets."
trigger_phrases:
  - "claude design parity build"
  - "shared design parity protocol"
  - "reuse before generate fidelity check"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/148-sk-interface-design/007-claude-design-parity-build"
    last_updated_at: "2026-06-14T09:35:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Keystone shared protocol + skill hooks implemented and validated"
    next_safe_action: "Operator reviews; commit when ready"
    blockers: []
    key_files:
      - ".opencode/skills/sk-interface-design/references/claude_design_parity.md"
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
The 005 (hardened) and 006 research converged on a keystone: wire `sk-interface-design` (judgment) and `mcp-magicpath` (canvas/CLI) into the loop Claude Design has, grounded in a real design system, without cloning a hosted product or adding a style chooser. The connective protocol did not exist.

### Purpose
Implement the keystone leanly: one shared protocol reference both skills consume, plus minimal behavioral hooks in each SKILL.md, so the skills stay lean and anti-default.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A new shared reference `sk-interface-design/references/claude_design_parity.md` consolidating the protocol: context-snapshot intake, design-system adherence + reuse-before-generate, element-target revision grammar, the `previewImageUrl` fidelity check (gated on the quality floor + anti-default critique), generated/presentational boundary, build-error self-healing, optional handoff block, guarded direction gate, and the SKIP guardrails.
- Minimal SKILL.md hooks + resource-loading + graph-metadata pointers in `sk-interface-design` and `mcp-magicpath`.

### Out of Scope
- Any style preset / pick-a-vibe / named-lever surface (deleted by the hardening).
- Multi-format export, hosted canvas, Git/PR ownership, backend gen, writing themes to MagicPath.
- Changing `design_principles.md` content (it remains the authority).
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

- R1: The shared protocol reference exists and consolidates the hardened keystone set in one place.
- R2: `sk-interface-design` points to it (references + resource-loading + graph-metadata) without bloating SKILL.md.
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

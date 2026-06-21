---
title: "Implementation Summary: install-claude-frontend-design"
description: "Vendored Anthropic's frontend-design skill into the framework as sk-design-interface, with a lean house SKILL.md, a reference-template principles doc, README, schema-2 graph metadata, catalog + root README registration, and advisor routing."
trigger_phrases:
  - "interface design summary"
  - "sk-design-interface"
  - "skill install summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/143-sk-design-interface/001-install-claude-frontend-design"
    last_updated_at: "2026-06-13T13:55:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Shipped sk-design-interface skill install and registration"
    next_safe_action: "Use the skill on the next UI/design task"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design-interface/SKILL.md"
      - ".opencode/skills/sk-design-interface/references/design_principles.md"
      - ".opencode/skills/README.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-148-001-install-claude-frontend-design"
      parent_session_id: null
    completion_pct: 95
    open_questions: []
    answered_questions:
      - "Skill name: sk-design-interface"
      - "Install target: framework .opencode/skills"
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 143-sk-design-interface/001-install-claude-frontend-design |
| **Completed** | 2026-06-13 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The framework now has a reusable point of view on visual design. When you ask for UI work, the advisor routes to `sk-design-interface`, which carries Anthropic's `frontend-design` guidance: ground the design in the subject, make deliberate palette and type choices, avoid the templated AI-default looks, and critique the plan before building. This was prompted by a design miss earlier in the session, and it gives every future UI task a deliberate aesthetic direction.

### The vendored skill

`.opencode/skills/sk-design-interface/` holds the skill. The upstream guidance prose lives verbatim in `references/design_principles.md` (conformed to the sk-doc reference template: frontmatter, OVERVIEW, numbered sections), and `SKILL.md` is a lean house-template router over it with WHEN TO USE, SMART ROUTING, HOW IT WORKS, RULES (ALWAYS ground and make deliberate choices, NEVER ship a templated default, ESCALATE on a thin brief), and REFERENCES. Anthropic's Apache-2.0 `LICENSE.txt` is preserved and the source is attributed in the SKILL, README, and reference.

### Registration

A house-voice `README.md` and a schema-2 `graph-metadata.json` place the skill in the `sk-code` family as a sibling of `sk-code` (design owns the look, sk-code owns the build). The skills catalog and the root README gained entries, with the skill count reconciled to a consistent 23. A reciprocal sibling edge was added to `sk-code` so the graph stays symmetric.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/sk-design-interface/SKILL.md` | Created | Lean house-template runtime instructions |
| `.opencode/skills/sk-design-interface/references/design_principles.md` | Created | Full upstream guidance, reference template, verbatim |
| `.opencode/skills/sk-design-interface/LICENSE.txt` | Created | Anthropic Apache-2.0 license, preserved |
| `.opencode/skills/sk-design-interface/README.md` | Created | House-voice nine-section README |
| `.opencode/skills/sk-design-interface/graph-metadata.json` | Created | Schema-2 advisor node (sk-code family) |
| `.opencode/skills/sk-code/graph-metadata.json` | Modified | Reciprocal sibling edge to sk-design-interface |
| `.opencode/skills/mcp-magicpath/SKILL.md` | Modified | Auto-apply sk-design-interface when authoring or shaping UI (RULES rule 6, Author-direction note, loading-levels row, router note, integration) |
| `.opencode/skills/mcp-magicpath/graph-metadata.json` | Modified | `depends_on` sk-design-interface (0.7) + related_to; reciprocal `prerequisite_for` added on sk-design-interface |
| `.opencode/skills/README.md` | Modified | Catalog row + counts (sk-* 6->7, total 22->23) |
| `README.md` (repo root) | Modified | Skill highlight + skills-table row + count 22->23 |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Every layer was verified before the done claim. `package_skill.py` reports the skill valid with zero warnings. `validate_document.py` passes with zero issues for the SKILL.md, README.md, and the reference. `skill_graph_scan` indexed one new node with zero rejected edges and generated an embedding; `skill_graph_validate` returns errorCount 0 with no sibling-symmetry warning after the reciprocal edge; and `advisor_recommend` ranks `sk-design-interface` as the top match at confidence 0.92, uncertainty 0.12 on a design prompt, which passes Gate 2. The skill count is a consistent 23 across the catalog, the root README, and the actual directory count.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Named it `sk-design-interface` | The operator chose this over `frontend-design` or `sk-frontend-design`; it fits the sk-code family and pairs with sk-code |
| Relocated the guidance to a reference | Keeps SKILL.md a lean house-template router while preserving the upstream prose verbatim, matching the magicpath precedent |
| Placed it in the sk-code family as a sk-code sibling | Design and build are a pair: this skill owns the look, sk-code owns the implementation |
| Added a reciprocal sibling edge to sk-code | Clears the sibling-symmetry warning I introduced and matches the reciprocal-edge registration convention |
| Preserved LICENSE.txt + attribution | Apache-2.0 requires it; the SKILL, README, and reference all cite the Anthropic source |
| Aligned via the canonical `/create:skill full-update` workflow (markdown sub-agent) | The operator asked for the official method, not hand-authoring. The full-update pass confirmed structure already conformed and applied an HVR voice cleanup (removed em dashes and semicolons from the authored SKILL.md and README.md prose); DQI 92. The vendored reference, LICENSE, name, family, and advisor registration were left intact. |
| Wired mcp-magicpath to auto-apply sk-design-interface | The operator wanted the design skill used automatically whenever mcp-magicpath designs. The runtime trigger is in mcp-magicpath's SKILL.md (RULES rule 6 + Author-direction instruction: load and apply sk-design-interface before building UI). The advisor co-surfacing is a `depends_on` -> `prerequisite_for` edge pair (weight 0.7). Verified in the live graph: `depends_on(mcp-magicpath)` and `dependents(sk-design-interface)` both resolve the edge. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `package_skill.py` | PASS, "Skill is valid", 0 warnings |
| `validate_document.py` (SKILL / README / reference) | PASS, 0 issues each |
| `skill_graph_scan` | PASS, 1 node indexed, 0 rejected edges, embedding generated |
| `skill_graph_validate` | PASS, errorCount 0, no sibling-symmetry warning |
| `advisor_recommend` (design prompt) | PASS, top match, confidence 0.92 / uncertainty 0.12, Gate 2 |
| Skill-count consistency | PASS, 23 across catalog, root README, and directory count |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **This skill guides design; it does not build.** Implementation is handed to `sk-code`, which owns standards and verification for the detected web surface.
2. **One pre-existing graph note remains.** Every skill, including this one, lacks a `sanitizer_version` in its derived block (a repo-wide condition that predates this packet). It is a non-blocking warning.
3. **Guidance is vendored, not live.** It is pinned to Anthropic's `frontend-design` at install time. If Anthropic updates the upstream skill, re-vendor to pick up changes.
<!-- /ANCHOR:limitations -->

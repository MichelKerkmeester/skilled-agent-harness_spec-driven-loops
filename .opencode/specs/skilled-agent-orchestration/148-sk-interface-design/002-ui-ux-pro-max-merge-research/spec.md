---
title: "Research Specification: ui-ux-pro-max merge into sk-interface-design"
description: "10-iteration deep-research loop (5x gpt-5.5-fast xhigh via cli-opencode + 5x claude-opus-4-8 xhigh via cli-claude-code, parallel by-model fan-out) into how the vendored ui-ux-pro-max-skill-main repo (or parts) can merge into and improve the house sk-interface-design skill. Research-only: produce a merge recommendation; NO change to sk-interface-design in this packet."
trigger_phrases:
  - "ui-ux-pro-max merge research"
  - "sk-interface-design improvement research"
  - "ui ux pro max skill"
  - "design data merge recommendation"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/148-sk-interface-design/002-ui-ux-pro-max-merge-research"
    last_updated_at: "2026-06-13T16:30:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Phase 002 research packet scaffolded; 10-iteration fan-out about to launch"
    next_safe_action: "Run the deep-research fan-out, then synthesize the merge recommendation"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-148-002-ui-ux-pro-max-merge-research"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

# Research Specification: ui-ux-pro-max merge into sk-interface-design

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-06-13 |
| **Branch** | `028-mcp-to-cli-tool-transition` |
| **Method** | 10 iterations, parallel by-model fan-out: 5x `openai/gpt-5.5-fast` xhigh (cli-opencode) + 5x `claude-opus-4-8` xhigh (cli-claude-code) |
| **Type** | Deep-research (read-only). Recommend; NO change to sk-interface-design in this packet. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

`sk-interface-design` (phase 001, vendored from Anthropic's frontend-design) gives the framework an advisor-routable point of view on distinctive UI design, but it is largely prose guidance. A vendored external repo, `ui-ux-pro-max-skill-main` (MIT), is a data-driven UI/UX skill: 67 styles, 161 color palettes, 57 type pairings, 161 product-reasoning rules, 99 UX guidelines, 17 stack guides, a BM25 search layer, and a design-system generator script. The framework needs a researched, model-cross-checked answer to whether and how those assets can make `sk-interface-design` materially better, without bloating it or violating its structure and license.

### Purpose

Run a 10-iteration deep-research loop to produce a concrete, evidence-backed merge recommendation: what to ADOPT, HOW to integrate it into the house skill structure, what to LEAVE OUT, and the LICENSING path. The actual merge is a separate follow-up packet.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

<!-- DR-SEED:SCOPE -->

**In scope:**
- Inventory and assessment of `external/ui-ux-pro-max-skill-main/` assets (data files, scripts, checklist, docs) for reuse in `sk-interface-design`.
- A mapping from those assets onto the house skill structure (`references/` vs `assets/` vs `scripts/` vs a `data/` dir), advisor routing, and the SKILL.md word budget.
- The licensing path for combining MIT-licensed external content into the house skill, with attribution.
- A merge recommendation (adopt / adapt / skip per asset class) cross-checked across both model lineages.

**Out of scope:**
- Implementing the merge into `sk-interface-design` (no edits to the skill in this packet).
- The standalone `mcp-magicpath` skill and its CLI (packet `147-mcp-magicpath`).
- Re-deriving the external repo's data; it is taken as given input.

<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

<!-- DR-SEED:REQUIREMENTS -->

- R1: Every asset class in `ui-ux-pro-max-skill-main` (styles, palettes, type pairings, product-reasoning rules, UX guidelines, stack guides, BM25 search code, design-system generator, checklist, philosophy/docs, CLI/marketplace plumbing) classified as ADOPT, ADAPT, or SKIP with a stated reason.
- R2: A concrete integration design for everything marked ADOPT/ADAPT, fitted to the house skill structure (directory placement, advisor routing edges, SKILL.md size discipline).
- R3: A licensing/attribution path for combining the MIT external content into the house skill, stated explicitly.
- R4: The two model lineages cross-checked: agreements, disagreements, and the resolved recommendation called out.
- R5: Negative knowledge (assets/approaches ruled out) recorded as first-class output.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- `research/research.md` synthesized from all completed iterations across both lineages, with a convergence appendix.
- A clearly-labelled **Merge Recommendation** section: per-asset-class adopt/adapt/skip verdict, the integration design into the house skill, and the license/attribution note.
- At least one concrete, actionable integration step per ADOPT/ADAPT asset class.
- Ruled-out directions documented with reasons (negative knowledge).
- The recommendation cross-checks the gpt-5.5-fast and opus-4.8 lineages and calls out where they diverged.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Risk / Dependency | Mitigation |
|-------------------|------------|
| gpt-5.5-fast xhigh via cli-opencode can time out on broad work | Each lineage is an iteration-capped loop with a generous per-lineage timeout; salvage sweep recovers iteration content from stdout on weak-executor write failures |
| Concurrent lineages share one spec_folder | spec.md is pre-seeded (DR-SEED markers + topic in Open Questions) so the per-lineage spec-check is an idempotent no-op |
| Executor-write Gate-3 self-censoring in dispatched models | Lineages run within an established spec folder; the framework's salvage + reduce path consolidates regardless |
| MCP / daemon flap mid-run | Iterations fall back to local source docs and model knowledge; the reducer reads packet-local state |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- How can we use the ui-ux-pro-max-skill-main repo (or parts) to merge into and improve our sk-interface-design skill: what data, scripts, and patterns to adopt, how to integrate them into the house skill structure, what to leave out, and the licensing path.

<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:research-context -->
## 8. RESEARCH CONTEXT

Deep-research is active for this topic. `research/research.md` remains the canonical synthesis output. Inputs under assessment:

- External repo: `.opencode/specs/skilled-agent-orchestration/148-sk-interface-design/external/ui-ux-pro-max-skill-main/` (MIT) — data files, `cli/`, `src/`, `docs/`, README, `skill.json`.
- Target skill: `.opencode/skills/sk-interface-design/` (SKILL.md, references/, README, graph-metadata.json).
- House skill standards: `sk-doc` templates and the SKILL.md structure/size conventions.

<!-- /ANCHOR:research-context -->

---
title: "Research Specification: Claude Design parity for sk-interface-design and mcp-magicpath"
description: "10-iteration parallel-by-model deep-research loop (5x claude-opus-4-8 xhigh via the account-2 claude binary + 5x openai/gpt-5.5-fast xhigh via cli-opencode) into how to improve sk-interface-design and mcp-magicpath so their UI-design results get closer to Claude Design (Anthropic's conversational design tool). Research-only: produces a prioritized recommendation; no change to either skill in this packet."
trigger_phrases:
  - "claude design parity research"
  - "sk-interface-design mcp-magicpath improvement"
  - "claude design tool gap analysis"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/143-sk-interface-design/005-claude-design-parity-research"
    last_updated_at: "2026-06-14T08:30:00Z"
    last_updated_by: "claude-opus"
    recent_action: "10-iteration parallel fan-out complete; parity recommendation synthesized"
    next_safe_action: "Operator reviews research.md; open implementation packet if accepted"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-148-005-claude-design-parity-research"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

# Research Specification: Claude Design parity for sk-interface-design and mcp-magicpath

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-06-14 |
| **Branch** | `028-mcp-to-cli-tool-transition` |
| **Method** | 10 iterations, parallel by-model: 5x `claude-opus-4-8` xhigh (claude account #2) + 5x `openai/gpt-5.5-fast` xhigh (cli-opencode) |
| **Type** | Deep-research (read-only). Recommend; NO change to either skill in this packet. |
| **Scope** | Two skills: `sk-interface-design` (148) and `mcp-magicpath` (147) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The framework has two UI-design skills: `sk-interface-design` (design judgment plus the merged critique-against data) and `mcp-magicpath` (a MagicPath canvas-generation CLI that already depends on sk-interface-design). The operator wants their results to get closer to **Claude Design** (Anthropic Labs' conversational design tool): conversational generation of designs, prototypes, presentations, and more, with org design-system inheritance, canvas plus inline-comment iteration, context attachments, multi-format export, and Claude Code handoff. Where the two skills fall short of that experience is not yet mapped.

### Purpose
Run a 10-iteration deep-research loop to produce a concrete, evidence-backed, cross-checked recommendation for improving each skill toward Claude Design parity. The actual implementation is a separate follow-up packet.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

<!-- DR-SEED:SCOPE -->

**In scope:**
- A parity gap analysis of `sk-interface-design` and `mcp-magicpath` against Claude Design's capabilities (design-system inheritance, iteration and visual feedback, context grounding, quality levers, output and handoff).
- Per-skill prioritized improvements (ADOPT / ADAPT / SKIP) with the anti-default philosophy guardrail preserved.
- A Claude Design parity scorecard and negative knowledge (what to leave out for two CLI skills).
- Cross-checking the opus-4.8 and gpt-5.5 lineages.

**Out of scope:**
- Implementing any improvement (no change to either skill in this packet).
- Re-deriving Claude Design's feature set beyond the seeded capability summary plus host web verification.
- Building a hosted canvas or replicating Claude Design's web product wholesale.

<!-- /DR-SEED:SCOPE -->
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

<!-- DR-SEED:REQUIREMENTS -->

- R1: Each Claude Design parity dimension (design-system inheritance, iteration/visual feedback, context grounding, quality levers, output/handoff) assessed for both skills with a current-state verdict.
- R2: Per-skill improvements ranked ADOPT / ADAPT / SKIP with a stated reason and the philosophy guardrail (sk-interface-design stays anti-default; not a templated generator).
- R3: A parity scorecard mapping each dimension to a target and the gap.
- R4: The two model lineages cross-checked: agreements, disagreements, resolved recommendation.
- R5: Negative knowledge (capabilities or approaches ruled out as out-of-scope for two CLI skills) recorded as first-class output.

<!-- /DR-SEED:REQUIREMENTS -->
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- `research/research.md` synthesized from all completed iterations across both lineages, with a convergence appendix.
- A clearly-labelled parity scorecard plus per-skill ranked improvement sets.
- At least one concrete, actionable next step per ADOPT/ADAPT item.
- Ruled-out directions documented with reasons (negative knowledge).
- The recommendation cross-checks the opus-4.8 and gpt-5.5 lineages and calls out divergences.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Risk / Dependency | Mitigation |
|-------------------|------------|
| Claude Design is a hosted product with no readable repo | Lineages use model knowledge plus the seeded capability summary; the host verifies key claims via web fetch at synthesis |
| claude account-2 session limit mid-run | 5 opus iters is well under the observed limit; fall back to a native opus lineage for any remainder |
| gpt-5.5 xhigh timeout on broad work | Each iteration takes one focus; the 5-iter single-session loop is proven |
| Concurrent lineages share one spec_folder | spec.md is pre-seeded (DR-SEED markers + topic in Open Questions) so the per-lineage spec-check is an idempotent no-op |
| Weak-executor write failures | Salvage sweep plus host-authored canonical research.md |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- How can sk-interface-design and mcp-magicpath be improved to get their UI-design results closer to Claude Design (Anthropic's conversational design tool): what concrete, prioritized improvements to each skill close the gap on design-system inheritance, iteration and visual feedback, context grounding, quality levers, and output and handoff, scored against Claude Design's capabilities, and what to leave out.

<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:research-context -->
## 8. RESEARCH CONTEXT

Deep-research is active for this topic. `research/research.md` remains the canonical synthesis output. Inputs under assessment:

- Parity target: Claude Design (Anthropic Labs conversational design tool) — capabilities seeded from https://support.claude.com/en/articles/14604416-get-started-with-claude-design (design-system inheritance, canvas + inline-comment iteration, context attachments, multi-format export, Claude Code handoff, named quality levers).
- Skill 1: `.opencode/skills/sk-interface-design/` (design_principles.md, ux_quality_reference.md, design_inventory.md, 9 data CSVs, design_search.py, feature_catalog, manual_testing_playbook).
- Skill 2: `.opencode/skills/mcp-magicpath/` (magicpath-ai CLI, Design Defaults, theme/@theme flow, the depends_on link to sk-interface-design; known gaps: no iteration loop, no token generation, no fidelity verification, Design Defaults canvas-only).

<!-- /ANCHOR:research-context -->

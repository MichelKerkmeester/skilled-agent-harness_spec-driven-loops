---
title: "Research Specification: Competitor AI design-tool ideas for sk-interface-design and mcp-magicpath"
description: "10-iteration parallel-by-model web-heavy deep-research loop (5x claude-opus-4-8 xhigh via account #2 + 5x openai/gpt-5.5-fast xhigh) into what leading AI UI/design-generation tools (v0, Lovable, Figma Make, Subframe, and similar) do that sk-interface-design and mcp-magicpath could adopt. Research-only: produces a prioritized recommendation; no change to either skill."
trigger_phrases:
  - "competitor design tool research"
  - "v0 lovable figma make subframe ideas"
  - "ai ui generation tool comparison"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/148-sk-interface-design/006-competitor-design-tools-research"
    last_updated_at: "2026-06-14T08:50:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Both lineages merged; net-new competitor ideas synthesized"
    next_safe_action: "Fold into the 007 keystone build"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-148-006-competitor-design-tools-research"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

# Research Specification: Competitor AI design-tool ideas for sk-interface-design and mcp-magicpath

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-06-14 |
| **Branch** | `028-mcp-to-cli-tool-transition` |
| **Method** | 10 iterations, parallel by-model, web-heavy: 5x `claude-opus-4-8` xhigh (account #2) + 5x `openai/gpt-5.5-fast` xhigh |
| **Type** | Deep-research (read-only). Recommend; NO change to either skill. |
| **Relation** | Complements `005-claude-design-parity-research`; widens the lens past Claude Design |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The 005 research targeted parity with one product (Claude Design). The broader AI UI/design-generation space (v0, Lovable, Figma Make, Subframe, and others) has matured fast and ships patterns the Claude-Design-only lens misses. We need to know which of those are worth adopting into `sk-interface-design` (judgment) and `mcp-magicpath` (canvas/CLI), and which to skip.

### Purpose
Run a web-heavy deep-research loop to surface concrete, prioritized, adoptable ideas from competitor tools, preserving the anti-default philosophy and the lean-CLI-skill scope.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

<!-- DR-SEED:SCOPE -->

**In scope:**
- Survey of leading AI UI/design-generation tools (at least v0 by Vercel, Lovable, Figma Make, Subframe; others as found) — their distinctive features, workflows, and quality mechanisms.
- Per-idea ADOPT / ADAPT / SKIP for `sk-interface-design` and `mcp-magicpath`, with reasons.
- Cross-checking the opus and gpt-5.5 lineages; negative knowledge.

**Out of scope:**
- Implementing anything (no change to either skill in this packet).
- Re-litigating the 005 Claude Design findings (this widens, not replaces, them).
- Adopting hosted-product or platform-only features that two CLI skills cannot host.

<!-- /DR-SEED:SCOPE -->
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

<!-- DR-SEED:REQUIREMENTS -->

- R1: At least four competitor tools surveyed with their distinctive, design-relevant capabilities named and sourced.
- R2: Each adoptable idea classified ADOPT / ADAPT / SKIP per skill with a stated reason and the anti-default / lean-CLI guardrail.
- R3: Ideas de-duplicated against the 005 findings (flag overlaps; surface only net-new or sharper).
- R4: The two model lineages cross-checked: agreements, disagreements, resolved recommendation.
- R5: Negative knowledge (tool features ruled out as out-of-scope) recorded as first-class output.

<!-- /DR-SEED:REQUIREMENTS -->
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- `research/research.md` synthesized across both lineages with a convergence appendix.
- A ranked set of net-new adoptable ideas per skill, each ADOPT/ADAPT/SKIP with a reason.
- Overlaps with 005 flagged; only sharper or net-new ideas carried forward.
- Ruled-out directions documented (negative knowledge).
- Cross-checks the opus and gpt-5.5 lineages.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Risk / Dependency | Mitigation |
|-------------------|------------|
| Web access gated in a headless lineage | Both lineages have web tools; the host verifies key claims at synthesis |
| Competitor feature claims drift / marketing fluff | Prefer primary docs; cross-check the two lineages; the host spot-verifies |
| Over-adoption diluting the lean/anti-default skills | Every idea passes the guardrail; SKIP is a first-class verdict |
| Concurrent lineages share one spec_folder | spec.md pre-seeded (DR-SEED + topic in Open Questions) so the spec-check is idempotent |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- What do leading AI UI/design-generation tools (v0, Lovable, Figma Make, Subframe, and similar) do that sk-interface-design and mcp-magicpath could adopt to improve, beyond the Claude Design parity findings, classified ADOPT / ADAPT / SKIP per skill, while preserving the anti-default and lean-CLI-skill constraints.

<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:research-context -->
## 8. RESEARCH CONTEXT

Deep-research is active for this topic. `research/research.md` remains the canonical synthesis. Inputs:

- Competitor tools (web): v0 (Vercel), Lovable, Figma Make, Subframe, and others surfaced during research.
- Local skills under improvement: `.opencode/skills/sk-interface-design/` and `.opencode/skills/mcp-magicpath/`.
- Prior research to de-duplicate against: `../005-claude-design-parity-research/research/research.md`.

<!-- /ANCHOR:research-context -->

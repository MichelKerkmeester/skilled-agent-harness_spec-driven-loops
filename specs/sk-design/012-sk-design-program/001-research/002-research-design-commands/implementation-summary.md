---
title: "Implementation Summary: Deep research — design command redesign"
description: "Converged recommendation for the /interface:* creation commands, and handoff to phase 004-interface-commands."
_memory:
  continuity:
    packet_pointer: "sk-design/012-sk-design-program/001-research/002-research-design-commands"
    last_updated_at: "2026-07-22T16:57:27Z"

    last_updated_by: "deep-research-orchestrator"
    recent_action: "Promoted 20-iter SOL command-research synthesis"
    next_safe_action: "Plan phase 004 after operator confirms naming"
    blockers: []
    key_files:
      - ".opencode/commands/design/"
      - ".opencode/skills/sk-design/mode-registry.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "deep-research-session"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "RESOLVED 2026-07-19: operator chose research-refined names (interface/design, /foundations, /motion, /audit, /design-reference)"
    answered_questions:
      - "5 canonical /interface:* commands with a shared 9-stage creation contract"
      - "Commands own choreography; modes keep authority; additive /design:* aliases during migration"
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Implementation Summary: Deep research — design command redesign

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Phase** | 2 of 4 (research) |
| **Status** | Complete |
| **Executor** | GPT-5.6-SOL (high, fast) via cli-opencode — 20 iterations, `max-iterations`. GLM-5.2 lineage failed (0 iters; secondary) |
| **Artifact** | `research/research.md` (392-line SOL synthesis, promoted) |
| **Completed** | 2026-07-19 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A converged, evidence-grounded recommendation to rebuild the five thin-router design commands into **creation templates** under an `/interface` namespace, keeping `sk-design` modes as the design authority. Core design: each command instantiates one **shared 9-stage creation contract** — Route Proof → Context Manifest → Progressive Brief → Grounding → Mode Plan → Creative/Diagnostic Work → Critique/Revision → Proof → Deliver/Handoff — with a typed context envelope, exemplar grounding (decision-changing, provenance-recorded, never a "style menu"), and an accepted `sk-code` handoff boundary.

### Files Created / Changed

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `research/research.md` | Create | 17-section synthesis (external patterns, namespace, shared contract, 5 templates, proof, migration) |
| `research/lineages/sol/**` | Create | SOL lineage (20 iterations) deep-research artifacts |
| `implementation-summary.md` | Create | This recommendation + phase-004 handoff |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Two-executor `/deep:research` fan-out via `fanout-run.cjs` (`maxCostUnitsPerLineage=200` to clear the 72 default for 20 iters). **SOL** (`cli-opencode`, `openai/gpt-5.6-sol-fast --variant high`) ran all 20 iterations and produced the synthesis. The **GLM-5.2** lineage failed (0 iterations; earlier run showed fabricated timestamps — GLM has no clock access) and was released; SOL is a complete, self-sufficient primary. Evidence spans the five wrappers + owned workflows, `sk-design` mode/reference contracts, and real external sources (Anthropic frontend-design SKILL.md, Open Design docs, Aura skill metadata).
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

- **Five canonical commands, one shared contract.** `/interface:{design, foundations, motion, audit, design-reference}` → stable internal modes `{interface, foundations, motion, audit, md-generator}`. Add a rich command-level creation scaffold; do NOT rebuild the owned mode workflows (they already hold useful choreography).
- **NAMING DEVIATION from the operator's stated plan (needs a decision).** The operator specified `design-audit`, `design-foundations`, `design-motion`, `design-md-creation`. The research recommends **dropping the `design-` prefix** (the `/interface:` namespace already conveys "design", so `/interface:foundations` beats `/interface:design-foundations`) and **`design-reference` over `design-md-creation`** (the latter "overstates authorship and obscures provenance" for what is source-faithful extraction). This is recorded as an open question; phase 004 must not proceed on names until the operator confirms.
- **Additive migration.** Keep `/design:*` as tested compatibility aliases; convert only after canonical route tests pass. Never in-place rename/delete shipped commands; never rename internal mode IDs.
- **Authority + safety boundaries.** Commands own public choreography; modes own judgment; transports own retrieval/render/extraction; `sk-code` owns code mutation. Exemplars are evidence-only (prompt-injection safe), decision-changing or explicit `no-fit`. Typed proof levels + a bounded degradation ladder; commands never invoke commands.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

- **20 evidence-bearing iterations**, `max-iterations` stop policy, convergence report present; "remaining frontier is runtime implementation validation, not unresolved command architecture."
- **Grounded in real sources:** the actual Anthropic `frontend-design/SKILL.md`, `design-mcp-open-design/SKILL.md:127-163`, `mode-registry.json`, and Aura's published skill metadata — all cited with file:line or URL.
- **30+ eliminated alternatives**, each tied to specific iteration evidence (e.g., mega-command, command-owned palettes, style-menu exemplars, `verified=true` blanket proof — all rejected with rationale).
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

- **GLM-5.2 lineage failed** (0 iterations) — no cross-model corroboration; SOL's 20-iteration synthesis is the sole (but thorough, well-grounded) source for this thread.
- **Naming unresolved** — the research refined the operator's names; the final surface awaits an operator decision (see Key Decisions).
- **Handoff to phase 004-interface-commands:** implement the shared creation contract first, then `/interface:design`, then specialize the other four, then add `/design:*` aliases behind passing route tests — using whichever command names the operator confirms.
<!-- /ANCHOR:limitations -->

---
title: "Implementation Summary: designer-skills-main → sk-design improvement research"
description: "13-iteration GPT-5.5-xhigh deep-research run (9 sequential + a 4-agent parallel wave) over the external designer-skills-main corpus (9 plugins, ~96 skills). Produced a per-plugin in/out-of-scope ledger, a 10-item prioritized adoption backlog with exact sk-design targets, and a no-new-mode verdict. Research only; no live sk-design changes."
trigger_phrases:
  - "designer-skills-main research summary"
  - "deep research summary designer-skills"
  - "sk-design scope research implementation"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/024-designer-skills-research"
    last_updated_at: "2026-06-27T11:12:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Summarized the 13-iteration research run and the adoption backlog"
    next_safe_action: "A future build phase adopts backlog ranks 1-5 into existing sk-design modes"
    blockers: []
    key_files:
      - "spec.md"
      - "research/research.md"
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "dr-154-024-designer-skills-research"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Most of the 9-plugin suite is out of scope; the adoptable core is small and build-facing, landing in audit/interface/motion/foundations"
      - "No new sk-design mode is justified; visual-critique is a set of audit lenses, not a distinct intent/output/owner"
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Status** | Complete (research phase) |
| **Date** | 2026-06-27 |
| **Level** | 3 |
| **Type** | Deep research (no live code change) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A converged deep-research deliverable: `research/research.md` — a per-plugin in/out-of-scope ledger across all 9 plugins, concrete adoptable techniques with exact sk-design targets, a 10-item prioritized adoption backlog, the Q3 ruled-out list, and a no-new-mode verdict. No live `sk-design` content changed.

### Headline
The corpus is a full design-practice suite; most of it (research, strategy, validation programs, design-ops, governance, adoption, comms) is **out of scope** for sk-design's taste-led build/visual modes. The adoptable core is small and lands entirely in the existing five modes. **No new mode is justified** — visual-critique is a set of audit lenses, not a distinct intent/output/owner; `md-generator` receives nothing.

### Top build slice (ranks 1-5)
1. visual-critique 7-dimension crosswalk → `design-audit` (onto existing P0-P3 severity, not a second score).
2. Compact interface UX flow floor (forms/search/nav/feedback/error/empty) → `design-interface/.../ux_quality_reference.md`.
3. Audit release-hardening bundle (component completeness, localization stress, a11y modality coverage) → `design-audit`.
4. State-machine fragment for branching UI → `design-motion/assets/motion_pattern_cards.md`.
5. Foundations layout (grid contract, density-mode spacing, containment restraint) → `design-foundations/.../layout_responsive.md`.

### Files Changed
- `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, `implementation-summary.md` — created (spec-folder wrapper).
- `research/research.md`, `research/resource-map.md` — created (deliverable + inventory).
- `research/deep-research-*.{json,jsonl,md}`, `research/iterations/iteration-00{1..9}.md` + `iteration-01{0,1,2,3}.md`, `research/deltas/iter-*.jsonl`, `research/prompts/*` — research state.
- No `.opencode/skills/sk-design/**` file changed.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

A GPT-5.5-xhigh cli-codex deep-research lineage ran 13 iterations. Iterations 1-9 ran sequentially via a custom loop driver (render prompt → dispatch codex → reduce → inline convergence), building the capability map and covering interaction-design, ui-design, and the out-of-scope plugins (newInfoRatio declining 0.78 → 0.16). When the operator asked for parallelism, the driver was stopped and the remaining distinct in-scope slices ran as a 4-agent concurrent wave (visual-critique, design-systems, net-new extraction, scope/backlog), each writing only its own iteration file + delta to avoid shared-state races. The orchestrator merged the four records into the state log, ran the reducer once, and synthesized.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

- **ADR-001** — Hold sk-design's build/visual scope as the adoption filter; record lifecycle capabilities as out-of-scope; adopt no new mode.
- **ADR-002** — Execute sequential (1-9) then an operator-directed 4-agent parallel wave (10-13) with race-free per-agent outputs and a serial merge.
- **Ruled out**: command-suite import, parallel scoring, duplicate color/responsive/cognitive-law/token imports, evidence-free impact claims, governance/documentation/lifecycle systems.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

- **Iterations**: 13 (9 sequential, 4 parallel). Sequential newInfoRatio 0.78 → 0.16; parallel slices 0.56-0.68 (fresh distinct slices).
- **State integrity**: reducer `iterationsCompleted 13 | corruption 0`; each delta first-line is the canonical `type:iteration` record.
- **Grounding**: iterations cite corpus `path:line` + sk-design targets; iteration 13 consolidated 1-9 into the ledger + backlog; the wave deep-dives (10-12) supplied concrete techniques with exact target anchors (e.g., state-machine card → `motion_pattern_cards.md`).
- **Doc validation**: `validate.sh --strict` clean for the packet.
- **Executor**: codex `gpt-5.5` `xhigh` `fast` (ChatGPT OAuth), validated by the iteration-1 driver test.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

- **Sampling at scale**: ~96 skills were not all deep-read line-by-line; the strongest in-scope plugins (visual-critique, interaction-design, ui-design, design-systems) were deep-read, and the clearly-out-of-scope plugins (design-research, ux-strategy, design-ops, prototyping-testing) were classified by README + representative skills. The scope ledger notes a README-level exclusion is sufficient for the lifecycle plugins.
- **Coverage graph unavailable**: `better-sqlite3` ABI mismatch; inline convergence + operator direction governed (the 20-iteration cap was not needed).
- **Research only**: no live `sk-design` change; the backlog is intent for a future build phase.
- **Parallel trade-off**: the 4 wave agents did not see each other's findings; this was acceptable because the slices are independent plugins and iteration 13 consolidated the sequential findings.
<!-- /ANCHOR:limitations -->

---
title: "Phase Parent: sk-design-md-generator skill + research-driven hardening [template:phase_parent/spec.md]"
description: "Root packet for the sk-design-md-generator skill (a live-CSS to DESIGN.md extraction engine) and its research-driven anti-fabrication hardening. Phase children cover the original build, then the remediation phases derived from a 50-iteration deep-research loop."
trigger_phrases:
  - "sk-design-md-generator packet"
  - "design md generator hardening"
  - "prose fabrication remediation"
  - "design extraction phase parent"
  - "DESIGN.md anti-hallucination phases"
importance_tier: "high"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/152-sk-design-md-generator"
    last_updated_at: "2026-06-22T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Restructured 152 into a phase parent; scaffolded remediation phases 002-006 from research"
    next_safe_action: "Plan and implement phase 002 extraction-data-fixes first"
    blockers: []
    key_files:
      - "research/research.md"
      - ".opencode/skills/sk-design-md-generator/tool/scripts/validate.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-152-phase-parent"
      parent_session_id: null
    completion_pct: 20
    open_questions: []
    answered_questions:
      - "Phase breakdown: 001 build + 002-006 mapped to the research implementation plan (operator-directed)"
---
<!-- SPECKIT_TEMPLATE_SOURCE: phase-parent | v2.2 -->
# Phase Parent: sk-design-md-generator skill + research-driven hardening

<!-- SPECKIT_LEVEL: 3 -->

---

## ROOT PURPOSE

`sk-design-md-generator` is the extraction and format-fidelity engine of the `sk-design-*` family: it captures a live website's **real, measured CSS** into a 17-section `DESIGN.md` design-system reference that AI agents build against. The skill ships an embedded Playwright pipeline (EXTRACT → WRITE → VALIDATE).

This packet is a **phase parent**. Phase `001` documents the original skill build and its deep-review remediation. Phases `002`–`006` are the **anti-fabrication hardening** program derived from a 50-iteration deep-research loop (`research/research.md`), which found that the AI WRITE phase fabricates interpretive prose not grounded in `tokens.json` and that the validator is blind to prose. The remediation is sequenced so extraction accuracy (002) precedes incentive removal (003), which precedes semantic validation (004), which precedes the optional deterministic-render rebuild (005); deferred enhancements are isolated in 006.

The cross-cutting research lives at this parent: `research/` (the deep-research artifacts + `research.md` deliverable) and `output/anobel-com/` (the empirical test extraction). Heavy phase docs live in the children.

---

## PHASE DOCUMENTATION MAP

| Phase | Folder | Purpose | Research source | Status |
|-------|--------|---------|-----------------|--------|
| 001 | `001-skill-build-and-deep-review/` | Original skill creation + embedded tool + deep-review remediation | (predates research) | complete |
| 002 | `002-extraction-data-fixes/` | Stop feeding the AI fake/empty data: focus-consistent bug, interaction-ON default, `extractA11yAsync` wiring, coverage-election pre-gate, clustering/variant/component/shadow/contrast/motion fixes, module audits | research §6 Phase 1 + iter-019/041/044/048 | planned |
| 003 | `003-doc-prompt-routing-fixes/` | Remove the fabrication mandates: data-driven section requirements, AP-29, comparative-framing removal, named-principle conditional, motion OBSERVED/RECOMMENDED, ABSENT-stamp + ESCALATE-IF, cardinal-rules pre-write gate, style-guide contradiction, per-section ruleset | research §6 Phase 2 + iter-037/040 | planned |
| 004 | `004-validator-semantic-checks/` | Make the validator see prose: section-coverage report, prose-discipline check, non-color stability gating, source-sentinel provenance, dual-score split | research §6 Phase 3 | planned |
| 005 | `005-doc-as-view-architecture/` | Deterministic-render rebuild: `formatters.ts` value tables, prompt-builder, citation gating, 3-class section partition | research §6 Phase 4 + iter-030/042 | planned |
| 006 | `006-deferred-enhancements/` | TIER-3 + borrow extras: DTCG typed tokens + `tokens.css`, multi-viewport breakpoints, gradient decomposition, CIEDE2000 contrast, MCP endpoint, composite/aliased tokens, semantic component tagging, hybrid clustering | research §3 TIER-3 + §4 borrow list | planned |

Resume follows `graph-metadata.json.derived.last_active_child_id`; when null, select from the map above. The minimal-viable hardening = phases 002 + 003 (+ the 004 coverage report); 005 is the structural endgame; 006 is optional/future.

---

## SCOPE BOUNDARY (PARENT)

This parent documents root purpose and the phase map ONLY. It holds no `plan.md`/`tasks.md`/`checklist.md` — those live in the phase children. The `research/` workspace is the evidence base for 002-006 and is not itself a phase.

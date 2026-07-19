---
title: "Tasks: Deep research — design command redesign"
description: "Task breakdown for the design-command deep-research phase."
_memory:
  continuity:
    packet_pointer: "sk-design/012-style-database-and-interface-commands/002-research-design-commands"
    last_updated_at: "2026-07-19T00:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Author research-phase tasks"
    next_safe_action: "Run /deep:research: 20 iters SOL HIGH fast + a few GLM-5.2 max, parallel"
    blockers: []
    key_files:
      - ".opencode/commands/design/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-author-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Tasks: Deep research — design command redesign

<!-- ANCHOR:notation -->
## Task Notation

- `[ ]` open · `[x]` done · each task carries verifiable evidence on completion.
- IDs `T001+`. Executors: GPT-5.6-SOL HIGH fast (20 iters) + GLM-5.2 max (few iters), parallel.

<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Fix the research question, convergence criteria, and reference set; configure the SOL + GLM fan-out. [SOURCE: research/research.md:12] [VERIFIED: implementation-summary.md]

<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 Run the SOL lineage (20 iters) and GLM lineage in parallel — SOL completed 20; GLM produced 0 (out of quota), SOL is the sole source (see implementation-summary.md). [SOURCE: research/research.md:12] [VERIFIED: implementation-summary.md]
- [x] T003 Gather how Claude design / Open Design / aura.build/skills structure design-creation prompts; map to the current commands' gaps. [SOURCE: research/research.md:12] [VERIFIED: implementation-summary.md]

<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T004 Merge lineages (preserve GLM dissent), confirm convergence, synthesize the final command set + prompt templates into `implementation-summary.md`. [SOURCE: research/research.md:12] [VERIFIED: implementation-summary.md]
- [x] T005 Run `validate.sh` for this phase folder. [SOURCE: research/research.md:12] [VERIFIED: implementation-summary.md]

<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- All tasks `[x]` with evidence; both lineages complete; the recommendation is ready for phase `004-interface-commands`.

<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Parent: `../spec.md` (phase-parent goal + PHASE DOCUMENTATION MAP).
- Successor: `../004-interface-commands/` (implementation of this research's recommendation).
- Sibling: `../001-research-style-database/` (the style-DB research thread; exemplar grounding may pull from its DB).

<!-- /ANCHOR:cross-refs -->

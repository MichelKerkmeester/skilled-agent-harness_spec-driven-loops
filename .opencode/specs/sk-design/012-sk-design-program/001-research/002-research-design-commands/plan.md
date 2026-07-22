---
title: "Implementation Plan: Deep research — design command redesign"
description: "Plan for the 20-iteration SOL + GLM design-command deep-research phase."
_memory:
  continuity:
    packet_pointer: "sk-design/012-sk-design-program/001-research/002-research-design-commands"
    last_updated_at: "2026-07-22T16:57:27Z"

    last_updated_by: "spec-author"
    recent_action: "Author research-phase plan"
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

# Implementation Plan: Deep research — design command redesign

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

A deep-research phase, not a code change. It runs the `/deep:research` loop over the design-command-redesign question with a two-executor fan-out: a GPT-5.6-SOL lineage (20 iterations) and a GLM-5.2 lineage (a few iterations), grounded in the current `commands/design/*` files and external references (Claude design, Open Design, aura.build/skills). Output is a converged recommendation.

### Overview

Init the fan-out, run the SOL and GLM lineages in parallel, merge and converge, synthesize one recommended command set + prompt templates, and hand off to phase `004-interface-commands`.

<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- The current command files and the `sk-design` modes are readable in-repo.
- The research question and convergence criteria are fixed; the fan-out executors are configured.

### Definition of Done

- Both lineages complete; the merge records convergence and `implementation-summary.md` carries one recommended command set + per-command prompt templates.
- `validate.sh` passes for this phase folder.

<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Two-executor fan-out deep-research loop (system-deep-loop `/deep:research` + `fanout-run.cjs`), per-lineage isolated artifacts, conflict-preserving synthesis.

### Key Components

- **Executors:** GPT-5.6-SOL HIGH fast (20 iterations) + GLM-5.2 max (a few iterations), concurrency 2.
- **Reference corpus:** `commands/design/*`, the `sk-design` modes, Claude design / Open Design patterns, aura.build/skills.
- **Output:** merged `research.md` + `implementation-summary.md` recommendation.

<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Init
- [ ] Fix the research question, convergence criteria, and reference set; configure the SOL + GLM fan-out.

### Phase 2: Loop
- [ ] Run the SOL lineage (20 iters, HIGH fast) and GLM lineage (few iters, max) in parallel with externalized state.
- [ ] Gather how Claude design / Open Design / aura.build/skills structure design-creation prompts.

### Phase 3: Synthesize
- [ ] Merge lineages (preserve GLM dissent), converge, write `research.md` + `implementation-summary.md` with the final command set + prompt templates.

<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

- No code ships; "testing" is convergence + coherence verification: the recommended command set and templates are internally consistent, evidence-cited, and integrate with the `sk-design` modes.

<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- The current `commands/design/*` files and the `sk-design` modes.
- External references: Claude design, Open Design, aura.build/skills.

<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- Research is additive (docs only); rollback is deleting this phase folder's artifacts. No runtime surface is touched.

<!-- /ANCHOR:rollback -->

---
title: "Research Tasks: Skill & Advisor JSON Optimization"
description: "Tasks for the three-lineage concurrent deep-research fan-out and cross-lineage synthesis into a ranked opportunity map."
trigger_phrases:
  - "skill json optimization research tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/029-skill-json-optimization-research"
    last_updated_at: "2026-07-29T08:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored tasks"
    next_safe_action: "Launch the fan-out"
    blockers: []
    key_files:
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "029-skill-json-optimization-research"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

# Research Tasks: Skill & Advisor JSON Optimization

---

<!-- ANCHOR:notation -->
## Task Notation

`[ ]` pending, `[x]` complete with evidence; `T-nn` execution order.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T-01 Verify `fanout-run.cjs` runtime deps resolve (symlink `runtime/node_modules` if missing — the 027 lesson)
- [x] T-02 Capture a clean research baseline and bind the run to this packet's `research/` artifact tree
- [x] T-03 Confirm the three executor model ids against `executor-config.ts` allowlists before dispatch
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T-04 Launch the 3-lineage fan-out concurrently: `sol-high` (cli-opencode `openai/gpt-5.6-sol` high), `glm-high` (cli-devin `glm-5-2`), `grok-high` (cli-cursor `cursor-grok-4.5-high`)
- [x] T-05 Force depth: `stop-policy=max-iterations`, 5 iterations per lineage, `concurrency=3`
- [x] T-06 Each lineage covers the five dimensions (inventory, optimization, automation, effectiveness, testing/integration) across every in-scope JSON type
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T-07 Confirm all three lineages reached 5/5 iterations with per-lineage `research.md` produced
- [x] T-08 Synthesize a cross-lineage ranked opportunity map with `file:line` evidence and cross-lineage agreement marked
- [x] T-09 Preserve per-lineage evidence under `research/lineages/`; update packet continuity; no code modified
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

Three lineages complete 5/5 concurrently; ranked cross-lineage synthesis produced with evidence; five dimensions covered; no code or contract modified.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

Spec `spec.md` · Plan `plan.md` · QA `checklist.md` · Synthesis `research/research.md` (after run)
<!-- /ANCHOR:cross-refs -->

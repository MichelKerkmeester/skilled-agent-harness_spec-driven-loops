---
title: "Goal: Goal unification research"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "packet goal"
  - "durable directive"
  - "completion criteria"
  - "goal binding"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-system-speckit-v4/036-goal-unification/001-goal-unification-research"
    last_updated_at: "2026-09-11T07:40:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-11-system-spec-kit-goals"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Goal unification research

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> Everything above the log is DURABLE: it is what an operator sets as the session
> objective, and it must stay true for the life of the packet. Keep it short:
> the runtime goal surfaces cap what they will hold, and a truncated objective
> loses its tail, which is where the completion criteria live.

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Produce a cited, ranked research synthesis that lets phase 002 freeze all seven goal-unification decisions.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Iterations 1-10 run on deepseek-v4.1-flash and 11-15 on glm-5.3-flash, sequentially, both via llmgateway through cli-pi at thinking max. |
| D2 | Stop policy is max-iterations; convergence is telemetry only. |
| D3 | Run 2 is seeded from run 1's research.md, verified before dispatch. |
| D4 | No file outside this folder's research/ tree is written by any lineage. |

### Operator copy

The operator holds this directive as the session objective, and that copy is
what judges completion, not this file. Whenever anything above the log changes
(objective, a decision, the binding table, a criterion), resend the durable slice
of this file in chat, frontmatter excluded, so the operator can update their copy. A child goal change
that alters a parent decision or criterion is an amendment to the parent: apply
it there first, then resend the parent.
<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

Three to seven bullets, each checkable without opening another file. Copy them
verbatim into the objective: nothing dereferences a path, so criteria left only
here are invisible to whatever judges completion.

- [ ] 15 iteration files exist across the two lineages, counted from the state ledgers
- [ ] `research/research.md` and `research/synthesis.md` exist and every decision has ranked options with resolving citations
- [ ] No path outside `001-goal-unification-research/research/` appears in the lineage write ledgers
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow. Progress, evidence, deviations
and findings belong here.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Phase scaffolded and directive authored | Done | This file, 2026-09-11 |
| Run 1 deepseek 10 iterations | Done | `research/lineages/deepseek/iterations/` 10 files; `research.md`; convergence-report stop reason maxIterationsReached |
| Run 2 glm 5 iterations | Done | `research/lineages/glm/iterations/` 5 files (011-015); `research.md`; stop reason maxIterationsReached; seed gate passed (iteration 11 verified and corrected run 1) |
| Fresh-model synthesis | Done | `research/synthesis.md` (3,962 words) and `research/research.md` (4,999 words); three citations corrected |

### Deviations and findings

| Item | Note |
|------|------|
| Driver verdicts for runs 1 and 2 were failed | Write containment saw dirty paths under `.opencode/skills/mcp-tooling/` from a concurrent session, reverted them to a patch and marked the lineage fatal. Artifacts were complete; the patch was re-applied to restore the other session's work. Run 1 counted as done on artifact evidence. |
<!-- /ANCHOR:log -->

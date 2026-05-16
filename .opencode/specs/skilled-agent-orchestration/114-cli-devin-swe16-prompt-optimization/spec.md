---
title: "Feature Specification: cli-devin SWE 1.6 prompt optimization"
description: "Phase parent for a bespoke deep-loop that iteratively tunes cli-devin's prompt scaffolding and dispatch contract to maximize output quality from Devin's free SWE 1.6 model. Decomposes into 4 phases: council design → eval rig → eval loop → skill uplift."
trigger_phrases:
  - "cli-devin swe16 optimization"
  - "cli-devin prompt tuning"
  - "swe 1.6 eval loop"
  - "devin free model optimization"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/114-cli-devin-swe16-prompt-optimization"
    last_updated_at: "2026-05-16T19:10:00Z"
    last_updated_by: "main_agent"
    recent_action: "Scaffolded phase parent + 4 children"
    next_safe_action: "Execute 001-council-design (deep-ai-council deliberation)"
    blockers: []
    key_files:
      - "001-council-design/spec.md"
      - "002-eval-rig/spec.md"
      - "003-eval-loop/spec.md"
      - "004-skill-uplift/spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000114"
      session_id: "114-scaffold"
      parent_session_id: null
    completion_pct: 5
    open_questions:
      - "Council picks: grader model (claude-sonnet vs codex-gpt-5.5)?"
      - "Council picks: fixture count (5 / 7 / 10)?"
      - "Council ratifies: 5-dim rubric weights as proposed, or revise?"
    answered_questions:
      - "Phase parent vs flat: phase parent (4 children) — design/execute/apply separation"
      - "Existing deep-flow fit: NO (deep-agent-improvement profile generator is agent-file-specific)"
      - "Loop architecture: bespoke combining deep-research iteration discipline + evaluator-first rubric + real-model evaluation + cost/cache + grader model"
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT
  FORBIDDEN content (do NOT author at phase-parent level):
    - merge/migration/consolidation narratives
    - heavy docs: plan.md, tasks.md, checklist.md, decision-record.md, implementation-summary.md — these belong in child phase folders only
  REQUIRED content (MUST author at phase-parent level):
    - Root purpose: what problem does this entire phased decomposition solve?
    - Sub-phase list: which child phase folders exist and what each one does
    - What needs done: the high-level outcome the phases work toward
-->

# Feature Specification: cli-devin SWE 1.6 prompt optimization

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 (phase parent) |
| **Priority** | P2 |
| **Status** | Draft |
| **Created** | 2026-05-16 |
| **Branch** | `main` |
| **Parent Spec** | n/a (root packet under skilled-agent-orchestration) |
| **Parent Packet** | skilled-agent-orchestration |
| **Predecessor** | 105-cli-devin-effectiveness-improvements |
| **Successor** | None |
| **Handoff Criteria** | Each phase passes `validate.sh --strict` independently; 004 applies winning patterns to `.opencode/skills/cli-devin/` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Devin's free SWE 1.6 model has documented failure modes in this repo: hallucinated CLI flags (memory: feedback_cli_devin_bundle_verification), wrong-cwd path defects inherited from prompt templates (memory: feedback_bundle_gate_smoke_run), and bundle-gate bypasses caught only after multi-pass review. The cli-devin skill has 7 prompt templates, 5 model presets, 6 framework choices, and 3 detail levels for the pre-planning block — but no systematic evaluation of which combinations maximize output quality on real coding tasks. Choosing prompt patterns is currently anecdote-driven.

### Purpose
Run a bespoke deep-loop that iteratively mutates cli-devin's prompt scaffolding, scores variants against a fixed eval-set of failure-mode-grounded coding tasks via actual SWE 1.6 invocations, and converges on the highest-scoring patterns. Apply winners back into the skill's SKILL.md and assets so future cli-devin dispatches benefit from data-driven defaults.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, and decisions live in the child phase folders listed in the Phase Documentation Map below. This keeps the parent from drifting stale as phases execute and pivot.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Tune the `cli-devin` skill's prompt scaffolding, dispatch contract, and bundle-gate logic
- Lock the model under test to SWE 1.6 (Devin's free model); other presets stay as-is
- Build a packet-local eval rig: 5–10 fixture tasks, grader harness, cache layer, deterministic check library
- Run iterative deep-loop with council-seeded hill-climbing and convergence detection
- Apply winning patterns to `.opencode/skills/cli-devin/{SKILL.md, assets/prompt_templates.md, assets/prompt_quality_card.md}` + changelog entry

### Out of Scope
- Modifying Devin itself or its CLI (we treat it as a black-box dispatch target)
- Tuning other model presets (deepseek-v4, glm-5.1, kimi-k2.6) — separate packets if needed
- Cross-skill optimization (cli-codex, cli-claude-code, cli-gemini, cli-opencode) — different optimization shape
- Building a generic prompt-optimization framework — keep this packet-local and cli-devin-specific
- Auto-applying winning patterns mid-loop — apply step (004) is gated by operator review

### Files to Change

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `.opencode/specs/skilled-agent-orchestration/114-.../001-council-design/ai-council/**` | Create | 001 | Council deliberation artifacts |
| `.opencode/specs/skilled-agent-orchestration/114-.../002-eval-rig/{fixtures,grader,cache,scripts}/**` | Create | 002 | Eval rig (no SWE 1.6 dispatches) |
| `.opencode/specs/skilled-agent-orchestration/114-.../003-eval-loop/{state,iterations,synthesis.md}` | Create | 003 | Iteration loop run artifacts |
| `.opencode/skills/cli-devin/SKILL.md` | Modify | 004 | §2 SMART ROUTING + §4 RULES tuning per synthesis |
| `.opencode/skills/cli-devin/assets/prompt_templates.md` | Modify | 004 | Replace template variants with winners |
| `.opencode/skills/cli-devin/assets/prompt_quality_card.md` | Modify | 004 | Refine CLEAR thresholds if council found better cutoffs |
| `.opencode/skills/cli-devin/changelog/v1.0.5.0.md` | Create | 004 | New version entry documenting the uplift |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 001 | `001-council-design/` | deep-ai-council ratifies rubric + fixtures + knobs + loop shape | Planned |
| 002 | `002-eval-rig/` | Build fixtures + grader + cache + deterministic checks (testable in isolation, no SWE 1.6 dispatches) | Planned |
| 003 | `003-eval-loop/` | Run bespoke deep-loop iterations; depends on 002 green | Planned |
| 004 | `004-skill-uplift/` | Apply winning patterns to `.opencode/skills/cli-devin/`; depends on 003 synthesis.md | Planned |

### Phase Transition Rules

- Each phase MUST pass `validate.sh --strict` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/spec_kit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit
- Free-tier rate limit awareness: 003 may pause/resume across days if rate limits hit; do NOT silent-skip fixtures

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001 → 002 | `council-report.md` exists with bound rubric, fixture catalog, knob set, loop-shape recommendation | Read `001-council-design/ai-council/council-report.md`; check § Rubric, § Fixtures, § Knobs sections all filled |
| 002 → 003 | Rig dry-run passes on canned outputs (no SWE 1.6 dispatches); cache schema + grader harness verified | Run `node 002-eval-rig/scripts/dry-run.cjs`; exit 0 |
| 003 → 004 | `synthesis.md` ranks variants with explicit confidence scores; convergence reached (legal-stop bundle satisfied) | Read `003-eval-loop/synthesis.md`; check top variant has score > 0.70 and convergence signal triggered |
| 004 → done | cli-devin SKILL.md + assets updated; strict-validate passes; changelog entry written | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/skills/cli-devin <not applicable — skill not spec>`; manual review of 4-runtime status (skills are .opencode-only, no mirror needed) |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- Will the council ratify the proposed 5-dim rubric (Bundle-gate 0.30, Path/cwd 0.20, Acceptance 0.20, Pre-planning 0.15, Hallucination 0.15) or revise weights?
- Grader model choice: claude-sonnet-4.6 (cheaper, faster) vs codex-gpt-5.5-high (more rigorous, costly) vs dual-grader with median?
- Fixture count: 5 (faster convergence, less coverage) vs 7 (balance) vs 10 (best coverage, longer runs)?
- Free-tier rate-limit envelope: should we cap iterations at 12 even if convergence not reached, or run until convergence with operator-paused breaks?
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: `001-council-design/`, `002-eval-rig/`, `003-eval-loop/`, `004-skill-uplift/`
- **Skill under optimization**: `.opencode/skills/cli-devin/SKILL.md`
- **Reuse patterns**: `.opencode/skills/deep-research/references/convergence.md`, `.opencode/skills/deep-agent-improvement/SKILL.md` §4B
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer

---
title: "Implementation Plan: MiniMax 2.7 efficiency deep-research"
description: "Run the deep-research loop (cli-codex gpt-5.5 high/fast, 10 iters, :auto) over MiniMax 2.7 efficiency questions and synthesize research.md + a follow-on delta list."
trigger_phrases:
  - "minimax efficiency research plan"
  - "deep-research loop minimax"
  - "cli-codex research executor minimax"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/120-cli-opencode-minimax-optimization/002-minimax-efficiency-deep-research"
    last_updated_at: "2026-05-28T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Authored phase-002 plan (deep-research loop run)"
    next_safe_action: "Invoke /deep:start-research-loop:auto with cli-codex gpt-5.5 high/fast"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/002-minimax-efficiency-deep-research"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 2: minimax-efficiency-deep-research

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | deep-research workflow (externalized JSONL/markdown state) |
| **Framework** | `/deep:start-research-loop:auto` + cli-codex executor |
| **Storage** | `research/` packet-local state (state.jsonl, deltas/, iterations/, research.md) |
| **Testing** | Iteration-record presence + research.md/resource-map.md existence + strict validate |

### Overview
Drive the deep-research loop autonomously: 10 iterations max, executor cli-codex `gpt-5.5` at high reasoning + fast service tier, convergence at newInfoRatio ≤ 0.05. Each iteration writes a fresh markdown finding + JSONL delta; the loop synthesizes a 17-section `research.md` and a follow-on delta list. LEAF executor — no sub-dispatch.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Tests passing (if applicable)
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Externalized-state research loop — fresh executor context per iteration; continuity lives in JSONL + markdown, not agent memory.

### Key Components
- **Loop runtime**: `/deep:start-research-loop:auto` YAML workflow (init → loop → synthesis → save)
- **Executor**: cli-codex `gpt-5.5` (high reasoning, fast tier) running one iteration per dispatch
- **State**: `deep-research-state.jsonl`, `deltas/iter-NNN.jsonl`, `iterations/iteration-NNN.md`, `research.md`

### Data Flow
Config seeds the charter → each iteration researches a focus, writes a finding markdown + JSONL delta with `newInfoRatio` → convergence check → synthesis consolidates into `research.md` + `resource-map.md`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

N/A — this phase is research-only (`research_intent` is investigation, not `fix_bug`). It produces findings and a delta list; it changes no production surfaces. The affected-surface inventory applies to the follow-on implementation packet that acts on `research.md`, not here.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Confirm phase 001 merged (MiniMax provider exists for the loop to reference)
- [ ] Read cli-codex SKILL.md (CLI dispatch rule) — confirm `gpt-5.5` + `high` + `fast` invocation

### Phase 2: Core Implementation (loop)
- [ ] Launch `/deep:start-research-loop:auto` with `--spec-folder` = this folder, `--executor=cli-codex --model=gpt-5.5 --reasoning-effort=high --service-tier=fast --max-iterations=10`
- [ ] Let iterations run to convergence or 10
- [ ] Synthesis produces `research.md` + `resource-map.md`

### Phase 3: Verification
- [ ] `deep-research-state.jsonl` has iteration records + a stop reason
- [ ] `research.md` answers the in-scope questions + ends with a delta list
- [ ] `validate.sh --strict` on this folder passes
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| State integrity | Iteration records well-formed | `jq` over `deep-research-state.jsonl` |
| Output presence | `research.md` + `resource-map.md` exist | file checks |
| Spec gate | Folder docs valid | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 001 (MiniMax provider) | Internal | Green | Loop references stale config if not merged first |
| cli-codex `gpt-5.5` fast tier | External | Green | Authed via ChatGPT OAuth; no separate key needed |
| Public MiniMax 2.7 docs | External | Yellow | Lower-confidence findings; mitigated by transferable 114 patterns |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Loop wedged (3 consecutive iteration failures) or produces no usable findings
- **Procedure**: Loop is additive (writes only under `research/`); cancel via the workflow, inspect `deep-research-state.jsonl`, re-run or hand off. No production changes to revert.
<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->


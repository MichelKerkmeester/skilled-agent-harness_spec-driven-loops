---
title: "Implementation Plan: Deep Primary Agent Router & Orchestration Hardening"
description: "Plan to create a DEEP primary agent, harden the Orchestrate agent for deep-loop dispatch, and refine commands/skills for GPT adherence without latency regression."
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "deep-loops/031-deep-loop-gpt-reliability/002-routing-dispatch-and-identity/001-deep-agent-router-and-orchestration"
    last_updated_at: "2026-06-30T13:45:00Z"
    last_updated_by: "opencode-gpt"
    recent_action: "Drafted implementation plan"
    next_safe_action: "Resolve open design questions, then implement DEEP primary agent"
    blockers: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "031-003-plan-init"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Deep Primary Agent Router & Orchestration Hardening

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown / YAML agent definitions |
| **Framework** | OpenCode agent + command system, deep-loop-workflows skill |
| **Storage** | Append-only JSONL state logs (unchanged) |
| **Testing** | Manual GPT-backed invocation tests, Claude regression checks |

### Overview

Create a DEEP primary agent router, harden the Orchestrate agent's deep-loop dispatch, and refine deep commands/skills so GPT-backed models invoke deep skills correctly, quickly, and flexibly. This is the structural-invocation counterpart to the phase 002 validator-detection work.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear. Evidence: `spec.md` §2.
- [ ] Design questions resolved (DEEP agent form factor, orchestrate rewrite safety boundary).
- [x] Dependencies identified. Evidence: `spec.md` §6.

### Definition of Done
- [ ] DEEP primary agent routes to the correct deep sub-agent under GPT.
- [ ] Orchestrate deep-loop dispatch aligns with DEEP agent routing.
- [ ] ai-council invocable under GPT.
- [ ] No Claude flexibility regression.
- [ ] No material GPT latency regression (ideally improved).
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Dedicated agent-router pattern — a DEEP primary agent that resolves the deep mode and dispatches to the correct deep LEAF, analogous to the `deep-loop-workflows` mode-registry router.

### Key Components
- **DEEP primary agent** (`.opencode/agents/deep.md`): Entry point and mode router for all deep work.
- **Orchestrate agent** (`.opencode/agents/orchestrate.md`): Hardened so deep-loop dispatch matches DEEP agent routing.
- **Deep sub-agents**: deep-research LEAF, deep-review LEAF, deep-context, deep-ai-council.
- **Deep command YAMLs / skill SKILL.md**: Refined dispatch prose for GPT adherence.

### Data Flow

A deep request enters via `/deep:*` or `@orchestrate` -> the DEEP primary agent (or orchestrate's deep branch) resolves the mode -> dispatches to the correct deep sub-agent with explicit identity -> the sub-agent executes the loop and writes iteration artifacts.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Design Resolution
- [ ] Resolve DEEP agent form factor (standalone file vs skill enhancement vs both).
- [ ] Determine orchestrate rewrite safety boundary (what can change without breaking Claude parity).
- [ ] Confirm whether OpenCode agent files can specialize `subagent_type` per deep agent.

### Phase 2: DEEP Primary Agent + Orchestrate Hardening
- [ ] Create `.opencode/agents/deep.md` (+ mirrors) with mode routing.
- [ ] Modify `.opencode/agents/orchestrate.md` (+ mirrors) for deep-loop dispatch clarity.
- [ ] Verify GPT-backed dispatch reaches the correct sub-agent.

### Phase 3: Command & Skill Refinement
- [ ] Tighten dispatch prose in deep command YAMLs for GPT adherence.
- [ ] Reduce role-negotiation ambiguity in deep skill SKILL.md files.
- [ ] Optimize prompt structure to avoid GPT slowness (pre-route, not negotiate).
- [ ] Verify no Claude regression; measure GPT latency.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Manual | GPT-backed deep-skill invocation across research/review/context/council | OpenCode + GPT |
| Manual | Claude regression check (flexibility preserved) | OpenCode + Claude |
| Manual | Latency comparison vs baseline | Timed invocation |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 001 research | Internal research | Green | Provides root-cause evidence |
| Phase 002 validator | Internal | In progress | Detection backstop; complementary, not blocking |
| OpenCode agent dispatch model | Internal | Green | If subagent_type can't be specialized, escalate to host-runtime follow-up |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Claude flexibility regression or GPT invocation not improved.
- **Procedure**: Revert agent file changes (DEEP agent removal + orchestrate revert); command/skill prose changes revert independently.
<!-- /ANCHOR:rollback -->

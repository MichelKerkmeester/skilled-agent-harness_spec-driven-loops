---
title: "Implementation Plan: Phase 1 — research and context"
description: "Configure and run two parallel deep-loops via cli-opencode GPT-5.5 — a focused deep-research track (taxonomy + two-axis mapping + fold-in + migration) and a deep-context track (current-state + full blast-radius) — then merge into a decision-ready recommendation for the human gate."
trigger_phrases:
  - "sk-code research and context plan"
  - "two-track deep loop plan"
  - "sk-code taxonomy fan-out"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/124-sk-code-parent/001-research-and-context"
    last_updated_at: "2026-07-03T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Author phase-1 research-and-context plan"
    next_safe_action: "Confirm the cli-opencode GPT-5.5 executor and write the two deep-loop configs"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "bootstrap-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 1 — research and context

<!-- SPECKIT_LEVEL: 1 -->
<!--
SELF-CHECK:
- Confirm the plan names the simplest viable approach, affected surfaces, and verification path.
- Match phases to the stated scope; remove setup theater that does not change the outcome.
FAILURE MODES:
- Over-planning, missing rollback, and treating assumptions as dependencies.
-->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Deep-research + deep-context loops over `deep-loop-runtime` |
| **Framework** | `cli-opencode` (GPT-5.5 high) as the primary executor; optional cross-check lineage |
| **Storage** | `research/` (Track R state/config/synthesis) + `context/` (Track C config + `context-map.md`) |
| **Testing** | Deliverable presence + `validate.sh --strict`; downstream informational gate = `parent-skill-check.cjs` |

### Overview
Run two parallel deep-loops, both driven by `cli-opencode` GPT-5.5 high (the orchestration directive), grounded in the already-settled nested-hub pattern (`sk-doc/references/skill_creation/parent_skills_nested_packets.md` + the sk-design reference). **Track R (deep-research)** answers the code-specific design questions (mode taxonomy, two-axis mapping, `sk-code-review` fold-in boundary, migration/cutover, native invocability). **Track C (deep-context)** produces the authoritative current-state classification + full blast-radius map. Merge both into one decision-ready recommendation, then STOP for the human-review gate. Because the pattern is settled, this is applied research — leaner than an open-ended fan-out.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] `cli-opencode` GPT-5.5 high model id + executor wiring confirmed (1-iteration smoke)
- [ ] Track R lineage decision made (GPT-5.5 alone vs + one cross-check lineage) — with user
- [ ] `research/deep-research-config.json` and `context/deep-context-config.json` written
- [ ] Seed-input reconnaissance (spec §Phase Context) captured as Track C starting notes

### Definition of Done
- [ ] Track R reached convergence or its cap; `research/research.md` produced with citations
- [ ] `context/context-map.md` complete: every blast-radius bucket present with file paths, cross-checked against a fresh ripgrep
- [ ] Merged recommendation (taxonomy + structural model + fold-in + migration) summarized for the review gate; nothing downstream started
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Two parallel tracks (research + context) → merge → human gate. No per-iteration model rotation; each track converges independently.

### Key Components
- **Track R — deep-research**: `/deep:research` (or its `cli-opencode` transport) over the two skills + the settled pattern docs; iterates into `research/`.
- **Track C — deep-context**: `/deep:context` (or its `cli-opencode` transport) over the repo; classifies current content and enumerates the blast radius into `context/context-map.md`.
- **Merge/synthesis**: consolidate both tracks into `research/research.md` + a decision-ready recommendation summary.

### Data Flow
`sk-code/` + `sk-code-review/` + pattern docs → **Track R** iterates → `research/` synthesis. Repo tree → **Track C** sweep → `context/context-map.md`. Both → merged recommendation → 002 gate.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Not applicable to production — this phase runs research/context jobs and writes only under `research/` and `context/`. No skill, command, agent, advisor, schema, or policy surface is touched in phase 001.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `research/` artifacts | research output | create | files present post-run |
| `context/context-map.md` | context output | create | file present, buckets complete |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Confirm `cli-opencode` GPT-5.5 high model id + executor wiring (read `cli-opencode/SKILL.md` first, per CLI-dispatch rule)
- [ ] Decide Track R lineage(s): GPT-5.5 alone vs + one cross-check lineage (Opus via `cli-claude-code`, or a small model via `cli-opencode`) — confirm with user
- [ ] Write `research/deep-research-config.json` (Track R: R1–R5 brief, executor, iteration cap)
- [ ] Write `context/deep-context-config.json` (Track C: C1–C5 targets, sweep scope)
- [ ] Capture the seed-input reconnaissance as Track C starting notes

### Phase 2: Core
- [ ] Smoke-test the executor at 1 iteration
- [ ] Run Track R (deep-research) to convergence/cap; produce `research/research.md` + findings registry
- [ ] Run Track C (deep-context) sweep; produce `context/context-map.md`
- [ ] Merge tracks into one decision-ready recommendation summary

### Phase 3: Verification
- [ ] Verify Track R state (convergence/cap) + `research.md` citations to real files + the 117/119/sk-design precedent
- [ ] Verify `context-map.md` completeness (every bucket + paths) against a fresh repo-wide ripgrep of the two skill tokens
- [ ] Summarize taxonomy + structural + fold-in + migration; STOP for human review
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Smoke | Executor wiring | 1-iteration `cli-opencode` GPT-5.5 run |
| Integration | Full two-track run + merge | `/deep:research`, `/deep:context` (or cli-opencode transport) |
| Manual | Deliverable + blast-radius completeness | `rg` cross-check, `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `cli-opencode` GPT-5.5 executor | Internal | Green (`opencode` binary present) | No research/context runs |
| Deep-loop engines (`/deep:research`, `/deep:context`) | Internal | Yellow (MCP tools may be unavailable in this runtime → use cli-opencode transport) | Loops cannot launch via MCP |
| Optional cross-check lineage | External | Optional | Single-model research only |
| Target skills + pattern docs | Internal | Green | — |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Executor wiring fails, or a track cannot reach convergence.
- **Procedure**: All artifacts are isolated under `research/` and `context/`. Delete the run dir and re-launch. No production state (skills, advisor, commands, agents) is mutated in phase 001, so rollback is a directory removal.
<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->

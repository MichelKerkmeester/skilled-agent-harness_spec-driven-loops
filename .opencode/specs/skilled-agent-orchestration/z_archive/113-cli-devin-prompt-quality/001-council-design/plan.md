---
title: "Implementation Plan: Council Design"
description: "Run deep-ai-council with 3 seats × real executors, sequential dispatch, two-of-three convergence, packet-local ai-council/** writes only."
trigger_phrases:
  - "113/001 plan"
  - "council deliberation plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/113-cli-devin-prompt-quality/001-council-design"
    last_updated_at: "2026-05-16T19:10:00Z"
    last_updated_by: "main_agent"
    recent_action: "Scaffolded plan.md"
    next_safe_action: "Dispatch first seat"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000114011"
      session_id: "114-001-plan"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Council Design

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown + JSONL artifacts; no compiled code |
| **Framework** | deep-ai-council skill |
| **Storage** | `001-council-design/ai-council/` (packet-local) |
| **Testing** | Manual review of council-report.md against REQ-001..008 |

### Overview
Dispatch 3 seats sequentially via cli-codex, cli-claude-code, cli-gemini. Each seat answers Q1 (flow fit), Q2 (rubric), Q3 (fixtures). Cross-seat adversarial critique. Two-of-three convergence per decision. Persist all artifacts under `ai-council/**`.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Phase-parent spec.md ratified
- [ ] 3 CLI executors authenticated (cli-codex, cli-claude-code, cli-gemini)
- [ ] deep-ai-council skill verified operational

### Definition of Done
- [ ] All 5 P0 requirements (REQ-001..005) satisfied
- [ ] `council-report.md` review by operator (sign-off)
- [ ] strict-validate exit 0 on 001-council-design/
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Sequential multi-seat deliberation with packet-local artifact persistence. Borrowed wholesale from deep-ai-council skill SKILL.md § Workflow.

### Key Components
- **Seat A (Pragmatist)**: cli-codex with prompt emphasizing simplicity and "what can we skip"
- **Seat B (Skeptic)**: cli-claude-code with prompt emphasizing failure modes and "what catches real bugs"
- **Seat C (Optimizer)**: cli-gemini with prompt emphasizing rubric separability and "what maximally distinguishes good from bad"
- **Critique step**: Each seat reviews the other two's proposals and surfaces disagreement
- **Convergence step**: Two-of-three vote per decision; unresolved → escalate

### Data Flow
Seat prompt → cli-* dispatch → seat-proposals/{seat}.md → critique aggregation → critique.md → convergence vote → council-report.md → state JSONL append
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

N/A — this is greenfield scaffolding, not a fix. The FIX ADDENDUM is required by the validator manifest but contains no actionable inventories here. Resume use of this anchor in 004-skill-uplift where actual file modifications occur in cli-devin.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `ai-council/` | New (does not exist) | Create | `ls 001-council-design/ai-council/` |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Pre-flight executor auth check (cli-codex, cli-claude-code, cli-gemini)
- [ ] Read parent 114 spec.md to extract the proposed rubric / knob set / fixture catalog (these go into seat prompts as the pre-seeded starting frame)
- [ ] Create `ai-council/` directory; initialize `ai-council-state.jsonl` with `{type:"council_start", ...}` row

### Phase 2: Seat Dispatch (Sequential)
- [ ] Dispatch Seat A (Pragmatist via cli-codex) with Q1/Q2/Q3 prompt; capture output → `seat-proposals/pragmatist.md`
- [ ] Dispatch Seat B (Skeptic via cli-claude-code); capture → `seat-proposals/skeptic.md`
- [ ] Dispatch Seat C (Optimizer via cli-gemini); capture → `seat-proposals/optimizer.md`
- [ ] Append per-seat JSONL row per dispatch with status + duration

### Phase 3: Critique + Convergence
- [ ] Cross-seat critique: pairwise diff of proposals, surface ≥ 1 disagreement, write `critique.md`
- [ ] Convergence vote: tally 2-of-3 on each decision; unresolved → list in `escalated_decisions`
- [ ] Author `council-report.md` with final ratified design contract
- [ ] Append final state row `{type:"council_complete", ...}`
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Manual | REQ-001..005 acceptance criteria check | Read artifacts, run `git status` for scope-write boundary |
| Validate | Spec-folder validator | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh 001-council-design --strict` |
| Integration | 002 spec.md can cite council-report.md unambiguously | Manual read of 002 spec.md against council-report.md |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| cli-codex skill + Codex CLI authenticated | Internal | Green | Falls back to simulated pragmatist seat |
| cli-claude-code skill + Claude Code CLI authenticated | Internal | Green | Falls back to simulated skeptic seat |
| cli-gemini skill + Gemini CLI authenticated | Internal | Green | Falls back to simulated optimizer seat |
| deep-ai-council skill | Internal | Green | Hard blocker — cannot dispatch |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Council fails to converge OR scope-write boundary violated OR ai-council/** corrupted
- **Procedure**: `rm -rf 001-council-design/ai-council/`; restart Phase 1
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──► Phase 2 (Seat Dispatch) ──► Phase 3 (Critique + Convergence)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Seat Dispatch |
| Seat Dispatch | Setup | Critique |
| Critique + Convergence | Seat Dispatch | Phase complete |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 5 min |
| Seat Dispatch (3 seats sequential, ~5 min each) | Med | 15-20 min |
| Critique + Convergence | Med | 10 min |
| **Total** | | **~30-35 min** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] No prior `ai-council/` directory (clean slate)
- [ ] State JSONL not yet started
- [ ] All 3 executors confirmed authenticated

### Rollback Procedure
1. Stop dispatch (Ctrl+C if mid-flight)
2. `rm -rf 001-council-design/ai-council/`
3. Reset state JSONL
4. Re-run Phase 1

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A — packet-local artifacts only
<!-- /ANCHOR:enhanced-rollback -->

---


---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌─────────────┐     ┌──────────────────┐     ┌─────────────────────────┐
│   Phase 1   │────►│   Phase 2        │────►│   Phase 3               │
│   Setup     │     │   Seat Dispatch  │     │   Critique + Convergence│
└─────────────┘     │   (3 seats seq)  │     └─────────────────────────┘
                    └──────────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Setup | None | ai-council/ dir, state.jsonl init row | All seats |
| Seat A | Setup | pragmatist.md | Critique |
| Seat B | Setup | skeptic.md | Critique |
| Seat C | Setup | optimizer.md | Critique |
| Critique | All seats | critique.md | Convergence |
| Convergence | Critique | council-report.md | Phase complete |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Setup** - 5 min - CRITICAL (must complete before seats)
2. **Seat Dispatch (3 sequential)** - 15-20 min - CRITICAL (each seat is on the path)
3. **Critique + Convergence** - 10 min - CRITICAL (gates council-report.md)

**Total Critical Path**: ~30-35 min

**Parallel Opportunities**:
- Seats CAN run in parallel if free-tier rate limits permit; sequential is the safe default
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Setup complete | ai-council/ dir + state.jsonl init row | Phase 1 end |
| M2 | All 3 seats dispatched | 3 proposal files exist | Phase 2 end |
| M3 | council-report.md ratified | All P0 REQs satisfied | Phase 3 end |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Sequential vs parallel seat dispatch

**Status**: Proposed

**Context**: Free-tier rate limits on Devin's SWE 1.6 (relevant only for 003) are well-documented but parallel dispatches across cli-codex/cli-claude-code/cli-gemini hit different rate-limit pools. Parallel might 3x the wall-clock savings but risks hitting auth concurrency limits.

**Decision**: Sequential dispatch by default. Parallel as opt-in if operator confirms all 3 executor caches are warm and rate-limit pools are independent.

**Consequences**:
- Sequential: ~30 min wall-clock; deterministic, easy debugging
- Parallel-when-safe: ~10 min wall-clock; harder to attribute failures

**Alternatives Rejected**:
- Always-parallel: too brittle under rate-limit variance
- One executor for all 3 seats: defeats the multi-vantage purpose

---

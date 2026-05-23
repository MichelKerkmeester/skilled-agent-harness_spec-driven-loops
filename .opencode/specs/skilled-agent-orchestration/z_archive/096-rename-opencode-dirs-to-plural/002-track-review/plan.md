---
title: "Implementation Plan: Track Review of skilled-agent-orchestration packets 093-096"
description: "Run a 10-iteration architectural cross-phase deep-review loop via cli-codex (gpt-5.5, high reasoning, fast service tier) targeting recently shipped packets 093-096; emit review-report.md + resource-map.md and route continuity through canonical save."
trigger_phrases:
  - "097 plan track review"
  - "deep-review 093-096 plan"
  - "architectural cross-phase plan"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/096-rename-opencode-dirs-to-plural/002-track-review"
    last_updated_at: "2026-05-07T14:46:56Z"
    last_updated_by: "deep-review-loop-manager"
    recent_action: "Plan authored: 10-iter cli-codex review across 093-096"
    next_safe_action: "Run phase_init: scaffold review/ state files"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "deep-review-097-2026-05-07"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Track Review of skilled-agent-orchestration packets 093-096

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Workflow** | `/speckit:deep-review:auto` (skill-owned YAML) |
| **Executor** | cli-codex (`codex exec`) |
| **Model** | gpt-5.5 |
| **Reasoning effort** | high |
| **Service tier** | fast |
| **Max iterations** | 10 |
| **Convergence threshold** | 0.10 |

### Overview
Run an autonomous deep-review loop over the recent burst (093, 094, 095, 096) with all 4 dimensions
enabled. Strategy is `arch` — focus on cross-phase consistency, naming/conventions, structural
integrity, and hidden regressions in the bulk-sed of 096. Synthesize findings into review-report.md
with a Planning Packet that downstream `/speckit:plan` can consume.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented (spec.md §2)
- [x] Success criteria measurable (spec.md §5)
- [x] Dependencies identified (cli-codex / gpt-5.5)

### Definition of Done
- [ ] All 10 iterations completed OR legal STOP reached with all gates green
- [ ] All 4 review dimensions covered
- [ ] review-report.md emitted with 9 core sections + Planning Packet JSON
- [ ] resource-map.md emitted (default `config.resource_map.emit=true`)
- [ ] Adversarial self-check run on every active P0/P1 finding
- [ ] Continuity routed via `generate-context.js` → canonical spec doc
- [ ] Strict validate passes on the 097 packet
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Skill-owned iterative review loop with externalized JSONL state, fresh-context dispatch per iteration,
reducer-owned findings registry, severity-weighted convergence detection.

### Key Components
- **Loop Manager** (this YAML): orchestration, convergence vote, dispatch
- **`@deep-review` agent surface**: dispatched per iteration via `cli-codex` command
- **State files**: `deep-review-config.json`, `deep-review-state.jsonl`, `deep-review-findings-registry.json`, `deep-review-strategy.md`, `deep-review-dashboard.md`
- **Per-iteration outputs**: `review/iterations/iteration-NNN.md`, `review/deltas/iter-NNN.jsonl`
- **Synthesis**: `review/review-report.md`, `review/resource-map.md`

### Data Flow
1. Loop Manager reads state → renders prompt pack → `codex exec` dispatches per iteration
2. Agent emits iteration markdown + JSONL delta + appends to state.jsonl
3. Reducer runs after each iteration → refreshes registry + dashboard + strategy
4. Convergence check on each iteration (graph + composite + 7 legal-stop gates)
5. On STOP: synthesis builds review-report.md (9 sections) + resource-map.md
6. Save phase: `generate-context.js` routes continuity into the right canonical doc
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Not applicable at planning time — this is a review-only packet. If review yields FAIL/CONDITIONAL,
the Plan Seed in `review-report.md` populates this section for the follow-up `/speckit:plan` packet.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| _populated post-synthesis from Planning Packet `affectedSurfacesSeed`_ | _from review_ | _from review_ | _from review_ |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup (Init)
- [x] Spec packet scaffolded at `.opencode/specs/skilled-agent-orchestration/096-rename-opencode-dirs-to-plural/002-track-review/`
- [x] description.json + graph-metadata.json restored to track-prefixed form
- [x] spec.md + plan.md + tasks.md + checklist.md authored
- [ ] review/ directory + state files created by YAML phase_init

### Phase 2: Iteration Loop
- [ ] Iteration 1: inventory pass (artifact map, file types, complexity)
- [ ] Iterations 2-N: deep passes on correctness → security → traceability → maintainability
- [ ] After each iteration: reducer + graph upsert + dashboard refresh
- [ ] Convergence check before each new iteration

### Phase 3: Synthesis + Save
- [ ] Hydrate summary metrics
- [ ] Build deduplicated finding registry
- [ ] Adversarial self-check on every P0/P1
- [ ] Emit resource-map.md from converged deltas
- [ ] Compile review-report.md with 9 sections + Planning Packet
- [ ] Stage artifact_dir for git commit
- [ ] Run `generate-context.js` to route canonical continuity
- [ ] Index canonical spec doc via `memory_save`
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | n/a (review-only packet) | n/a |
| Integration | post-dispatch validate of every iteration's outputs | YAML `post_dispatch_validate` step |
| Manual | adversarial self-check across all P0/P1 | YAML `step_adversarial_selfcheck` |
| Regression | strict-validate on the 097 packet at completion | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh ...` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `codex` CLI binary on PATH | External | Green (verified earlier in session) | Cannot dispatch iterations |
| `gpt-5.5` model availability via codex | External | Green (assumed) | Fall back to other model or native opus |
| `.opencode/skills/system-spec-kit/shared/review-research-paths.cjs` | Internal | Green | Cannot resolve artifact_dir |
| `.opencode/skills/sk-deep-review/scripts/reduce-state.cjs` | Internal | Green (existing) | Cannot refresh registry |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Loop wedged > 60 min stuck or 3 consecutive cli-codex dispatch failures
- **Procedure**: `touch .deep-review-pause` in `review/`; archive `review/` to `review_archive/`; restart fresh session if needed
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Init) ──► Phase 2 (Loop) ──► Phase 3 (Synth + Save)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Init | None | Loop |
| Loop | Init | Synth |
| Synth + Save | Loop | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Init | Low | 5 min |
| Loop | High | 10 iterations × ~5-10 min each |
| Synth + Save | Med | 10-15 min |
| **Total** | | **~1.5-2 hours wall-clock** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] No data changes (review-only)
- [x] No feature flags
- [x] No monitoring alerts needed (local workflow)

### Rollback Procedure
1. `touch .opencode/specs/skilled-agent-orchestration/096-rename-opencode-dirs-to-plural/002-track-review/review/.deep-review-pause`
2. `mv review/ review_archive/restart-$(date -u +%Y%m%dT%H%M%SZ)/`
3. Restart loop with fresh session if needed; or jump to synthesis with partial findings

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A — review packet is additive only
<!-- /ANCHOR:enhanced-rollback -->

---

---
title: "Implementation Plan: Re-review #2 of skilled-agent-orchestration 093-101"
description: "Run a 10-iteration architectural cross-phase deep-review loop targeting recently shipped 100-099-remediation and 101-cli-opencode-executor packets — confirms the FAIL→PASS verdict flip and audits new wiring. Executor: cli-opencode + deepseek-v4-pro requested; pre-flight smoke detected DeepSeek MCP-tool-name regex rejection under default plugin loading; fallback to native opus authorized."
trigger_phrases:
  - "102 plan track rereview 2"
  - "deep-review 093-101 plan"
  - "cli-opencode smoke plan"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/079-rename-opencode-dirs-to-plural/007-track-rereview"
    last_updated_at: "2026-05-07T20:55:00Z"
    last_updated_by: "deep-review-loop-manager"
    recent_action: "Plan authored"
    next_safe_action: "Run phase_init: scaffold review/ state files"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "deep-review-102-2026-05-07T2055"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Re-review #2 of skilled-agent-orchestration 093-101

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Workflow** | `/speckit:deep-review:auto` (skill-owned YAML) |
| **Requested executor** | cli-opencode (`opencode run --variant high`) |
| **Requested model** | opencode-go/deepseek-v4-pro |
| **Reasoning effort / variant** | high |
| **Service tier** | n/a (cli-opencode does not honor service tier) |
| **Effective executor (post-smoke)** | native opus via `@deep-review` agent |
| **Effective fallback rationale** | DeepSeek API rejects opencode-injected MCP tool names containing `:` (regex `^[a-zA-Z0-9_-]+$`); `--pure` mode works but YAML's `if_cli_opencode` branch does not pass `--pure`; user pre-authorized fallback. This is itself a P1 finding for 101. |
| **Max iterations** | 10 |
| **Convergence threshold** | 0.10 |

### Overview
Run an autonomous deep-review loop over the recent burst (100, 101) plus the broader 093-098 surface
re-audited under verdict-flip framing. All 4 dimensions enabled. Strategy is `arch` — verdict-flip
confirmation NOT line-by-line. Iter-1 builds the closed-gate replay table mapping each 099 finding
to its 100 fix surface and audits 101 executor wiring; subsequent iterations spot-check at file:line.
Synthesize findings into review-report.md with a Planning Packet that downstream `/speckit:plan`
can consume if verdict ≠ PASS.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented (spec.md §2)
- [x] Success criteria measurable (spec.md §5)
- [x] Dependencies identified (cli-opencode requested; native fallback authorized)
- [x] Pre-flight smoke recorded (cli-opencode + deepseek-v4-pro: PASS with `--pure`, FAIL with default plugins)

### Definition of Done
- [ ] All 10 iterations completed OR legal STOP reached with all gates green
- [ ] All 4 review dimensions covered
- [ ] review-report.md emitted with 9 core sections + Planning Packet JSON
- [ ] resource-map.md emitted (default `config.resource_map.emit=true`)
- [ ] Adversarial self-check run on every active P0/P1 finding
- [ ] Closed-gate replay table for 099's 13 P1 + 6 P2 present in §3 or iter-1 inventory
- [ ] 101 executor wiring audit (4 YAML files + advisor aliases + executor-config) status table present
- [ ] cli-opencode smoke result documented in iter-1 narrative
- [ ] Continuity routed via `generate-context.js` → canonical spec doc
- [ ] Strict validate passes on the 102 packet
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Skill-owned iterative review loop with externalized JSONL state, fresh-context dispatch per iteration,
reducer-owned findings registry, severity-weighted convergence detection.

### Key Components
- **Loop Manager** (this YAML): orchestration, convergence vote, dispatch
- **`@deep-review` agent surface**: dispatched per iteration via native opus subagent
- **State files**: `deep-review-config.json`, `deep-review-state.jsonl`, `deep-review-findings-registry.json`, `deep-review-strategy.md`, `deep-review-dashboard.md`
- **Per-iteration outputs**: `review/iterations/iteration-NNN.md`, `review/deltas/iter-NNN.jsonl`
- **Synthesis**: `review/review-report.md`, `review/resource-map.md`

### Data Flow
1. Loop Manager reads state → renders prompt pack → dispatches `@deep-review` agent via Agent tool
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
- [x] Spec packet scaffolded at `.opencode/specs/skilled-agent-orchestration/z_archive/079-rename-opencode-dirs-to-plural/007-track-rereview/`
- [ ] description.json + graph-metadata.json created
- [x] spec.md + plan.md + tasks.md + checklist.md authored
- [ ] review/ directory + state files created by YAML phase_init
- [x] cli-opencode pre-flight smoke recorded

### Phase 2: Iteration Loop
- [ ] Iteration 1: closed-gate replay (099 P1/P2 → 100 fix), 101 executor wiring inventory, cli-opencode smoke result
- [ ] Iteration 2: correctness pass on 100 reducer delta-extraction (P1-026 fix surface)
- [ ] Iteration 3: correctness pass on 101 executor-config (cli-opencode kind + flag support)
- [ ] Iteration 4: security pass — workflow-resolved spec_folder authority + Stop hook gating + sandbox semantics
- [ ] Iteration 5: traceability pass — 4 YAML cli_opencode branches diff for parity; advisor aliases coverage
- [ ] Iteration 6: traceability pass — 100 sub-phase canonicalization + cross-references after rename
- [ ] Iteration 7: maintainability pass — doc anchors, dead refs, executor descriptions across runtimes
- [ ] Iteration 8: re-pass on least-covered dimension based on running deltas
- [ ] Iteration 9: adversarial re-verification of any P0/P1 candidates (file:line evidence)
- [ ] Iteration 10: saturation iteration; promote STOP if all gates green

### Phase 3: Synthesis + Save
- [ ] Hydrate summary metrics
- [ ] Build deduplicated finding registry
- [ ] Adversarial self-check on every P0/P1
- [ ] Emit resource-map.md from converged deltas
- [ ] Compile review-report.md with 9 sections + Planning Packet
- [ ] Stage artifact_dir for git commit
- [ ] Run `generate-context.js` to route canonical continuity
- [ ] Refresh description.json + graph-metadata.json
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | n/a (review-only packet) | n/a |
| Integration | post-dispatch validate of every iteration's outputs | YAML `post_dispatch_validate` step |
| Manual | adversarial self-check across all P0/P1 | YAML `step_adversarial_selfcheck` |
| Regression | strict-validate on the 102 packet at completion | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh ...` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `opencode` CLI binary on PATH | External | Green (1.14.39 verified) | Cannot dispatch via cli-opencode (using native fallback regardless) |
| `opencode-go/deepseek-v4-pro` model | External | Yellow (rejects MCP tool names with `:`) | Forces fallback to native or `--pure` mode |
| Native opus / `@deep-review` agent surface | Internal | Green | Cannot dispatch fallback iterations |
| `.opencode/skills/system-spec-kit/shared/review-research-paths.cjs` | Internal | Green | Cannot resolve artifact_dir |
| `.opencode/skills/deep-review/scripts/reduce-state.cjs` | Internal | Green | Cannot refresh registry |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Loop wedged > 60 min stuck or 3 consecutive dispatch failures
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
| Loop | High | 10 iterations × ~5-8 min each |
| Synth + Save | Med | 10-15 min |
| **Total** | | **~1-1.5 hours wall-clock** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] No data changes (review-only)
- [x] No feature flags
- [x] No monitoring alerts needed (local workflow)

### Rollback Procedure
1. `touch .opencode/specs/skilled-agent-orchestration/z_archive/079-rename-opencode-dirs-to-plural/007-track-rereview/review/.deep-review-pause`
2. `mv review/ review_archive/restart-$(date -u +%Y%m%dT%H%M%SZ)/`
3. Restart loop with fresh session if needed; or jump to synthesis with partial findings

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A — review packet is additive only
<!-- /ANCHOR:enhanced-rollback -->

---

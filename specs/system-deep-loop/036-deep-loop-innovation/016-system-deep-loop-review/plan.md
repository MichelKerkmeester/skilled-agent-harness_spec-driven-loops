---
title: "Implementation Plan: System-Deep-Loop Broad Deep-Review"
description: "The plan for the broad system-deep-loop audit: a 20-iteration fan-out deep-review over the whole surface plus a 10-iteration deep-research expansion, both observation-only, feeding a separate remediation decision."
trigger_phrases:
  - "system-deep-loop broad review plan"
  - "deep-loop audit plan"
  - "review research expansion plan"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/016-system-deep-loop-review"
    last_updated_at: "2026-08-26T05:17:12.581Z"
    last_updated_by: "claude"
    recent_action: "Authored the two-pass audit plan"
    next_safe_action: "Run the review and research loops, then synthesize"
---
# Implementation Plan: System-Deep-Loop Broad Deep-Review

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Surface** | `system-deep-loop` runtime, `/deep:*` command docs + orchestrator YAMLs, deep-loop agents across six runtimes, mode-packet SKILLs |
| **Workflow** | `/deep:review` and `/deep:research` fan-out loops (externalized JSONL state, no manual state) |
| **Executors** | ox-alpha at `--thinking xhigh` via cli-pi (cline + openrouter); GLM-5.2-high via cli-devin |
| **Verification** | `validate.sh --strict`, per-finding `file:line` evidence, parseable PASS/CONDITIONAL/FAIL verdict |

### Overview
This is an observation-only audit in two passes. The first is a twenty-iteration broad deep-review over the whole system-deep-loop surface, run as a two-lineage fan-out (both lineages ox-alpha at highest thinking), producing a synthesized `review/review-report.md` with a single merged verdict. The second is a ten-iteration deep-research expansion (GLM-5.2-high via cli-devin) that hunts for fresh issues beyond the review's findings, writing to `research/research.md`. Neither pass changes runtime code; every finding is a cited, remediable observation that feeds a separate remediation decision.


<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Review surface scoped in spec.md (runtime, commands, YAMLs, agents, SKILLs)
- [x] Executors bound and live-probed (ox-alpha xhigh both providers; GLM-5.2 via cli-devin)
- [x] Stop policy fixed (max-iterations — convergence is telemetry-only)
- [x] Out-of-scope stated (no fixes; no re-derivation of the remediated 014 findings)

### Definition of Done
- [x] Review loop ran and a merged verdict is recorded
- [x] Research expansion completed and `research/research.md` synthesized
- [x] Every recorded finding carries `file:line` evidence
- [x] `validate.sh --strict` exits clean once packet docs are reconciled


<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Fan-out deep-loop: independent per-lineage iteration agents write JSONL state; a merge/reduce step synthesizes one report. The review and research passes are separate loops over the same packet.

### Key Components
- **Deep-review loop**: `/deep:review :auto`, two cli-pi ox-alpha lineages (cline `x-ai/ox-alpha`, openrouter `stealth/ox-alpha`), 20 iterations each, `stop-policy max-iterations`.
- **Deep-research loop**: `/deep:research :auto`, one cli-devin GLM-5.2-high lineage, 10 iterations, `stop-policy max-iterations`.
- **Merge/synthesis**: `fanout-merge` over both review lineages → `review/review-report.md`; research synthesis → `research/research.md`.
- **Bound write authority**: the packet directory; child dispatch runs with the spec gate pre-resolved.

### Data Flow
1. Orchestrator dispatches per-lineage iteration agents with the bound run directory.
2. Each agent audits a rotated dimension and appends findings to its lineage JSONL state via the gateway.
3. The merge step dedups cross-lineage findings and emits one verdict.
4. The research pass hunts fresh issues on the same surface and writes a cited report.
5. Findings feed a separate remediation decision; no runtime code changes here.


<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Packet scaffolded as bound write authority (`spec.md` + metadata)
- [x] Executors bound and PONG-probed (ox-alpha xhigh both providers)
- [x] Review config written (`review/deep-review-config.json`)

### Phase 2: Run
- [x] Deep-review: cline lineage completed 20/20 at xhigh
- [x] Deep-review: openrouter lineage reached 7/20 (stealth exited early, salvaged)
- [x] Review merged and synthesized to `review/review-report.md`
- [x] Deep-research expansion: GLM-5.2-high, 10 iterations
- [x] Research synthesized to `research/research.md`

### Phase 3: Verification
- [x] Review verdict is parseable (CONDITIONAL) with cited P1/P2 findings
- [x] Research findings each carry `file:line` evidence
- [x] Packet docs reconciled (plan, tasks, checklist, implementation-summary)
- [x] `validate.sh --strict` exits clean; metadata regenerated


<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Evidence | Every finding cites `file:line`; inference-only findings rejected | Conductor re-verification against source |
| Coverage | Runtime, commands, YAMLs, agents, SKILLs each get ≥1 iteration | Dimension rotation across the loop |
| Structural | Packet docs pass template + section checks | `validate.sh <folder> --strict` |


<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| ox-alpha via cli-pi (cline + openrouter) | External | Green | Review lineages cannot run |
| GLM-5.2-high via cli-devin | External | Green | Research expansion cannot run |
| Shipped system-deep-loop runtime + 015 changes | Internal | Green | Nothing to review |
| `fanout-merge` / reduce-state | Internal | Green | No synthesized report |


<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A lineage produces unusable output, or the packet must be abandoned.
- **Procedure**: The packet is observation-only and additive; discard the untracked packet directory. No runtime state or shipped code is touched, so there is nothing to revert.


<!-- /ANCHOR:rollback -->
---

<!-- ANCHOR:l2-phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──> Phase 2 (Run: review ──> research) ──> Phase 3 (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Run |
| Run (review) | Setup | Run (research), Verify |
| Run (research) | Run (review) | Verify |
| Verify | Run | None |


<!-- /ANCHOR:l2-phase-deps -->
---

<!-- ANCHOR:l2-effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 30 minutes |
| Run (20-iter review, 2 lineages) | Medium | ~2 hours wall-clock |
| Run (10-iter research) | Medium | ~1 hour wall-clock |
| Synthesis + verification | Medium | 1-2 hours |
| **Total** | | **~5 hours wall-clock** |


<!-- /ANCHOR:l2-effort -->
---

<!-- ANCHOR:l2-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] No runtime code changed (observation-only)
- [x] State artifacts confined to the packet directory
- [x] Report deliverables reviewed before commit

### Rollback Procedure
1. **Immediate**: Stop any running lineage (`TaskStop` on the background run).
2. **Discard**: Remove the untracked packet directory; nothing else is affected.
3. **Verify**: `git status` shows no change outside the packet.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: None required — the audit writes only reports and lineage state under its own folder.

<!-- /ANCHOR:l2-rollback -->

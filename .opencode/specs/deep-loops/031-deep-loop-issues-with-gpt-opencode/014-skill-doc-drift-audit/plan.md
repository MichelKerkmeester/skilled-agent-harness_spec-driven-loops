---
title: "Implementation Plan: Skill Documentation Drift Audit"
description: "STATUS: INVESTIGATION-ONLY. No implementation plan until deep-review + deep-research synthesize findings and a fix follow-up phase is proposed."
trigger_phrases:
  - "implementation"
  - "plan"
  - "skill doc drift audit"
importance_tier: "high"
contextType: "review"
_memory:
  continuity:
    packet_pointer: "deep-loops/031-deep-loop-issues-with-gpt-opencode/014-skill-doc-drift-audit"
    last_updated_at: "2026-07-01T17:15:00Z"
    last_updated_by: "claude-code"
    recent_action: "Phase scaffolded; review and research fanouts launched (gpt-fast-high, 10 iters each, parallel)"
    next_safe_action: "Wait for both fanouts to complete, then verify each iteration with a fresh Sonnet 5 xhigh agent"
    blockers: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "031-014-init"
      parent_session_id: null
    completion_pct: 10
    open_questions: []
    answered_questions:
      - "Should this be a new phase under 031 or a standalone packet? Operator chose: new phase under 031 (014)."
      - "How to satisfy 'verify each iteration with a fresh Sonnet 5 xhigh agent' given the loop YAML owns its own iteration mechanics end-to-end? Operator chose: continuous 10-iteration :auto/fanout runs (loop-owned state), then a post-hoc fan-out of fresh Sonnet 5 xhigh verifiers over each written iteration file."
---
# Implementation Plan: Skill Documentation Drift Audit

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown review/research artifacts, `deep-loop-runtime` fan-out runner |
| **Framework** | `deep-loop-workflows` deep-review + deep-research modes, single-lineage fan-out via `fanout-run.cjs` |
| **Storage** | Per-loop-type JSONL state logs + per-iteration markdown under `review/` and `research/` |
| **Testing** | N/A this phase (investigation-only; no code changes). Fresh Sonnet 5 xhigh verification substitutes for automated tests here. |

### Overview
This phase has no implementation yet. It runs a 10-iteration deep-review pass and a 10-iteration deep-research pass (both `cli-opencode openai/gpt-5.5-fast`, reasoning=high, `stopPolicy: max-iterations` so all 10 iterations run regardless of early convergence) over the candidate skill-doc surface listed in `spec.md`. Both loops run as single-lineage fan-outs (`fanout-run.cjs --loop-type review|research`) so the loop runtime owns lock/state/session-classification mechanics rather than this session hand-simulating them. After both complete, a fresh Claude Sonnet 5 xhigh agent independently verifies each of the 20 written iteration files against real current file content before any finding is trusted. This plan will be replaced with a real implementation plan once findings are synthesized and a fix follow-up phase (if needed) is proposed.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Packet 031 phases 008-013 confirmed complete (there is real behavior to audit docs against).
- [x] Candidate skill-doc file list enumerated in `spec.md` §3.
- [x] Verification-timing design decided with operator (post-hoc fan-out, not mid-loop gating).

### Definition of Done
- [ ] `review/review-report.md` and `research/research.md` both exist with 10 completed iterations each.
- [ ] Every one of the 20 iteration files has a corresponding fresh-Sonnet-5-xhigh verification verdict.
- [ ] A consolidated findings list (stale docs, if any, with file:line + contradicted 031-phase evidence) is written to `implementation-summary.md`.
- [ ] `validate.sh --strict` passes for this phase folder.
<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Single-lineage fan-out per loop type — `fanout-run.cjs --loop-type review` and `--loop-type research`, each with one `cli-opencode` lineage (`gpt-fast-high`). This routes through the same fan-out mechanism used for multi-lineage runs (e.g. phase 007's 6-lineage research), just with `executors: [1 entry]`, so the loop runtime (not this session) owns lock acquisition, session classification, and per-iteration state bookkeeping.

### Key Components
- **`fanout-run.cjs`**: Spawns the detached `opencode run` CLI process per lineage, waits for completion, validates the `stopPolicy: max-iterations` contract (exact iteration count).
- **`deep-review` / `deep-research` LEAF agents**: Executed inside the detached CLI session per iteration, writing iteration narratives + JSONL state.
- **Verification fan-out (post-hoc)**: 20 independent Claude Sonnet 5 xhigh `Agent` calls, one per written iteration file, checking claims against real current file content.

### Data Flow
1. `fanout-run.cjs` resolves the single `gpt-fast-high` lineage and dispatches `opencode run` with the deep-review or deep-research SKILL.md instructions bound.
2. The detached CLI session runs its own `phase_init` → `phase_main_loop` (10 iterations) → `phase_synthesis`, writing to `review/lineages/gpt-fast-high/` or `research/lineages/gpt-fast-high/`.
3. Once both fan-outs return, this session reads each of the 20 iteration files.
4. Each iteration file is handed to a fresh Sonnet 5 xhigh `Agent` call with instructions to re-check the claimed drift against the real, current file content.
5. Confirmed findings are consolidated into `implementation-summary.md`; unconfirmed ones are recorded as rejected with a reason.

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Candidate file list enumerated (`spec.md` §3)
- [x] `review/` and `research/` fan-out packet directories created
- [x] Operator decisions recorded (spec-folder placement, verification timing)

### Phase 2: Execution
- [x] Deep-review fan-out launched (10 iterations, `gpt-fast-high`)
- [x] Deep-research fan-out launched (10 iterations, `gpt-fast-high`, parallel)
- [ ] Both fan-outs reach synthesis
- [ ] 20 fresh Sonnet 5 xhigh verifier agents dispatched, one per iteration file

### Phase 3: Verification
- [ ] Consolidated findings written to `implementation-summary.md`
- [ ] `validate.sh --strict` passes

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Independent verification | Every review + research iteration's claimed findings | Fresh Claude Sonnet 5 xhigh `Agent` call per iteration file, re-reading real current file content |
| Cross-check | Confirmed findings vs. `spec.md` §5 Edge Cases (preserved historical quotes, generic mentions) | Manual review during synthesis |

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `opencode` CLI + `openai/gpt-5.5-fast` | External | Green (used in phase 012's benchmark) | Fan-outs cannot dispatch; would need a native/Claude fallback executor |
| `fanout-run.cjs` / `loop-lock.cjs` | Internal | Green | Would require hand-simulating the loop YAML instead |
| Claude Sonnet 5 (main session) | Internal | Green | No independent verification path |

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A fan-out's lock/state becomes corrupted, or `stopPolicy: max-iterations` is violated (wrong iteration count).
- **Procedure**: Archive the affected `review/` or `research/` packet directory under `review_archive/` or `research_archive/` (per the loop's own restart/archive convention), release any held lock, and re-launch that single fan-out with `--lineage-mode=restart`.

<!-- /ANCHOR:rollback -->
---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──> Phase 2 (Execution: review + research fan-outs, parallel) ──> Phase 3 (Verify + synthesize)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Execution |
| Execution | Setup | Verify |
| Verify | Execution | None |

<!-- /ANCHOR:phase-deps -->
---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | ~15 minutes |
| Execution (10+10 GPT-5.5 iterations, parallel) | High (external CLI latency, 3-10x Claude per phase 012 benchmark) | 30-90+ minutes wall-clock |
| Verify (20 fresh-agent verifications + synthesis) | Medium | 30-60 minutes |
| **Total** | | **~1.5-3 hours wall-clock** |

<!-- /ANCHOR:effort -->
---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] No production code touched (investigation-only phase)
- [x] Fan-out state confined to `review/` and `research/` subdirectories
- [x] Advisory locks (`loop-lock.cjs`) prevent concurrent writers to the same packet

### Rollback Procedure
1. **Immediate**: If a fan-out hangs or violates its iteration contract, no user-facing system is affected — this is an investigation phase, not a deployment.
2. **Revert code**: N/A — no production code changed by this phase.
3. **State**: Archive the affected packet directory (`review/` or `research/`) and re-launch if needed.
4. **Verify**: Confirm the other (unaffected) loop's results are unimpacted before re-launching.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: N/A.

<!-- /ANCHOR:enhanced-rollback -->

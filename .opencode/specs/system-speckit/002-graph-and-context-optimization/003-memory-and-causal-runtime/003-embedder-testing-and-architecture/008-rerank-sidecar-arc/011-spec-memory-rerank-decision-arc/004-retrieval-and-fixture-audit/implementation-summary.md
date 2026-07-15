---
title: "Implementation Summary: retrieval + fixture audit [template:level_1/implementation-summary.md]"
description: "Filled by cli-codex execution: probe classification, candidate coverage, handler parity, rerank effect, branch decision."
trigger_phrases:
  - "011/004 summary"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/008-rerank-sidecar-arc/011-spec-memory-rerank-decision-arc/004-retrieval-and-fixture-audit"
    last_updated_at: "2026-05-21T14:30:00Z"
    last_updated_by: "main_agent"
    recent_action: "Scaffold authored"
    next_safe_action: "Dispatch cli-codex"
    blockers: []
    completion_state: "scaffold-only"
---
# Implementation Summary: retrieval + fixture audit

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: implementation-summary-core | v2.2 -->

> **Status: SCAFFOLD.** Filled by cli-codex execution per plan.md §Dispatch.

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Status** | Scaffold (execution pending) |
| **Created** | 2026-05-21 |
| **Branch** | `main` |
| **Parent Arc** | `011-spec-memory-rerank-decision-arc` |
| **Position in arc** | Phase 0 (decision gate; numeric slot 004) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

To be filled. Will produce five evidence files under `evidence/`: `probe-classification-2026-05-21.json`, `candidate-coverage-2026-05-21.json`, `handler-parity-2026-05-21.md`, `rerank-effect-2026-05-21.json`, and `valid-subset-metrics-2026-05-21.json`. Plus removable audit scripts under `scripts/`. Reference fixture: `.opencode/skills/system-spec-kit/mcp_server/benchmarks/benchmark-2026-05-20-rerank-ab/rerank-ab-fixture.json`. Reference DB: `.opencode/skills/system-spec-kit/mcp_server/database/context-index.sqlite`. Expected sections:

- §Probe Classification: counts per class (valid/stale/replaced/unusable) + per-category breakdown
- §Candidate Coverage: per-lane (FTS / vector / fused / final) top-20/50/100 hit rates on valid+replaced subset
- §Handler Parity: top-20 diff narrative for 5 sample probes across direct-replay vs canonical daemon IPC paths
- §Rerank Effect: % probes where rerank changed top-5, max-delta histogram
- §Valid-Only Subset Metrics: recomputed hit-rate@5 / NDCG@10 / recall@5
- §Branch Decision: RETRIEVAL_WORK | SCORING_INTEGRATION_WORK | PHASE_3_JUSTIFIED
- §Commit Handoff: exact paths modified
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

To be filled. Expected: cli-codex gpt-5.5 high fast, network=true (daemon IPC + sidecar /rerank), workspace-write with strict no-production-source-modified rule.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

### D-001 (scaffolded): Insert this gate after AI Council 3-1 vote
**Rationale:** Phase 1 (OFF) and Phase 2 (bge-v2-m3) produced identical 0.12/0.11/0.12 metrics. Council convened (gpt-5.5 xhigh fast, 4 seats) and voted 3-1 that Phase 3 fine-tune cannot succeed without first proving where the binding constraint lives. The Devil's Advocate dissented on momentum grounds; the majority on "you can't fine-tune away missing candidates."

### D-002 (scaffolded): Mechanical branch decision, not human judgment
**Rationale:** The audit produces 5 evidence files; a fixed branch logic (RETRIEVAL_WORK if coverage < 30%, SCORING_INTEGRATION_WORK if rerank-effect < 10%, else PHASE_3_JUSTIFIED) removes the temptation to do another planning round after the audit completes.

### D-003 (scaffolded): No production source modifications during audit
**Rationale:** The audit must be revertible by `rm -rf` of the evidence + scripts dirs. Touching `lib/search/**` to add logging hooks creates a separate rollback surface and contaminates production state. If instrumentation requires hooks, build wrapper scripts that intercept at the dist/ handler boundary.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

To be filled. Expected commands:

```bash
# Phase A
.venv/bin/python scripts/audit_classify_probes.py \
  --fixture mcp_server/benchmarks/benchmark-2026-05-20-rerank-ab/rerank-ab-fixture.json \
  --db mcp_server/database/context-index.sqlite \
  --out evidence/probe-classification-2026-05-21.json

# Phase B
.venv/bin/python scripts/audit_candidate_coverage.py \
  --classification evidence/probe-classification-2026-05-21.json \
  --out evidence/candidate-coverage-2026-05-21.json

# Phase C
.venv/bin/python scripts/audit_handler_parity.py \
  --probes <5-sample-ids> \
  --out evidence/handler-parity-2026-05-21.md

# Phase D
.venv/bin/python scripts/audit_rerank_effect.py \
  --classification evidence/probe-classification-2026-05-21.json \
  --out evidence/rerank-effect-2026-05-21.json

# Phase E
.venv/bin/python scripts/audit_branch_decision.py \
  --inputs evidence/*.json \
  --out evidence/valid-subset-metrics-2026-05-21.json

# Verify no production modified
git diff --stat .opencode/skills/system-spec-kit/mcp_server/lib/
# expect: empty

# Strict-validate
bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh \
  .opencode/specs/.../011-spec-memory-rerank-decision-arc/004-retrieval-and-fixture-audit --strict
bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh \
  .opencode/specs/.../011-spec-memory-rerank-decision-arc --strict
```
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Same fixture as Phases 1+2.** A stale fixture can still expose pre-rerank candidate coverage and rerank effect regardless of label staleness; the recomputed metrics on the valid-only subset are the only label-dependent outputs.
2. **Daemon IPC reachability is sandbox-dependent.** If the codex sandbox blocks the daemon socket, REQ-003 falls back to P1 and the parity check is deferred to a non-sandboxed run.
3. **Branch logic uses fixed thresholds.** 30% / 10% are starting points; if the actual numbers are close to thresholds, the impl-summary §Branch Decision must acknowledge the borderline and recommend confirmation before downstream phase commitment.
4. **N may be small after exclusions.** If valid+replaced subset is <20 probes, the branch decision is probabilistic; recommend fixture rebuild before high-confidence claims.
<!-- /ANCHOR:limitations -->

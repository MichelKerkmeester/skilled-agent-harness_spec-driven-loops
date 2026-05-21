---
title: "Implementation Summary: opt-in-only closure [template:level_1/implementation-summary.md]"
description: "Filled by cli-codex execution: code patch + supersede sweep + arc closure."
trigger_phrases:
  - "011/005 summary"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/008-rerank-sidecar-arc/011-spec-memory-rerank-decision-arc/005-opt-in-only-closure"
    last_updated_at: "2026-05-21T15:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "Scaffold authored"
    next_safe_action: "Cli-codex dispatch"
    blockers: []
    completion_state: "scaffold-only"
---
# Implementation Summary: opt-in-only closure

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
| **Position in arc** | Terminal (arc closer) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

To be filled. Concrete artifacts produced:
- `lib/search/search-flags.ts` diff: flag default flipped + `isRerankerExpected()` helper added
- `lib/search/confidence-scoring.ts` diff: WEIGHT_RERANKER penalty wrapped in opt-in guard
- New `tests/scoring-opt-in.vitest.ts` with 3 cases (no opt-in, local opt-in, cloud opt-in)
- 7 supersede sweeps across 011/002+003+004 and 008/005+007+008+009 (frontmatter + graph-metadata)
- 011 + 008 arc parent updates
- `system-spec-kit/SKILL.md` + `system-rerank-sidecar/SKILL.md` opt-in doc additions

Expected sections:
- §Code Changes: file:line citations for each touched source file
- §New Tests: test names + assertions
- §Supersede Sweep: per-packet before/after status table
- §Arc Closure: 011 narrative ending; 008 phase-map updates
- §Docs Updated: paths + summary of opt-in language
- §Commit Handoff: exact paths
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

To be filled. Expected: single cli-codex gpt-5.5 medium fast dispatch, network=false, workspace-write, ~30-45 min wall clock.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

### D-001 (scaffolded): Keep shared sidecar framework; make spec-memory opt-in only
**Rationale:** Cocoindex's reranker is production-ready (validated end-to-end this session). Spec-memory's rerank produced 4 HOLDs + identical-to-OFF numbers. Tearing out the shared infrastructure would invalidate cocoindex's working path. Making spec-memory's consumption opt-in is reversible, honest, and ships the only justified code change (the WEIGHT_RERANKER penalty fix).

### D-002 (scaffolded): isRerankerExpected() helper instead of hard-coded checks
**Rationale:** Centralizes opt-in semantics. Cloud API keys, `SPECKIT_CROSS_ENCODER=true`, and `RERANKER_LOCAL=true` all count as intentional opt-in. Future operators reading `confidence-scoring.ts` see a single function call instead of three OR conditions.

### D-003 (scaffolded): Don't delete superseded packet docs
**Rationale:** Per the "DELETE not archive" memory rule, code gets physically removed. But spec docs are HISTORY of decisions. Marking them superseded + linking via `superseded_by` preserves the trail without forcing future operators to git-archaeology if they want to revisit.

### D-004 (scaffolded): Close arc 011 + the spec-memory-tuning slice of arc 008
**Rationale:** With opt-in default-off as the verdict, packets 011/002+003+004 (further rerank trials) and 008/005+007+008+009 (runtime tuning) no longer ship. The decision IS the work for those packets. Marking superseded one packet (this one) supersedes all 7 cleanly.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

To be filled. Expected commands:

```bash
# New vitest
cd .opencode/skills/system-spec-kit/mcp_server
npx vitest run tests/scoring-opt-in.vitest.ts

# Regression check on existing test baseline
npx vitest run tests/ 2>&1 | tail -3
# Expect: failure count <= 168 (existing baseline from 005-cross-cutting-quality/008)

# Strict-validate sweep (all 9 affected packets)
for p in .opencode/specs/.../011/005-opt-in-only-closure \
         .opencode/specs/.../011/002-bge-v2-m3-trial \
         .opencode/specs/.../011/003-domain-tuned-finetune \
         .opencode/specs/.../011/004-retrieval-and-fixture-audit \
         .opencode/specs/.../008/005-promote-qwen-as-default \
         .opencode/specs/.../008/007-spec-memory-mps-rerank-promotion \
         .opencode/specs/.../008/008-cap-rerank-top-k \
         .opencode/specs/.../008/009-fp16-rerank \
         .opencode/specs/.../011-spec-memory-rerank-decision-arc; do
  bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh "$p" --strict
done
```
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Decision is reversible but with friction.** If a future operator wants spec-memory rerank back on by default, they need to flip the flag + remove the supersede statuses + re-run the audit/fine-tune phases.
2. **No retrieval investigation.** The 011/004 audit would have answered "is reranking even the right knob" with mechanical branch logic. Closing the arc skips that diagnosis. If retrieval is genuinely broken (the most likely hypothesis given identical OFF/bge-v2-m3 numbers), it'll surface again when spec-memory's search quality is questioned in a different context.
3. **Cocoindex side could also benefit from the audit's lessons.** But cocoindex's reranker is producing real lift (different corpus, different signal), so the spec-memory finding doesn't transfer.
<!-- /ANCHOR:limitations -->

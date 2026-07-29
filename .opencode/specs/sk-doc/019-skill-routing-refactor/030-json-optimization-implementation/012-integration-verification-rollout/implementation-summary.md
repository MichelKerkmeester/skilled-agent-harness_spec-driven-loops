---
title: "Implementation Outcome: Integration Verification + Guarded Rollout"
description: "Planned record of the program's closing gate: rerun the pinned routing-accuracy corpus for a top-1/top-3 delta, prove live-daemon reindex behavior, add cache invalidation, and record rollback plans. Not yet built."
trigger_phrases:
  - "integration verification rollout outcome"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/030-json-optimization-implementation/012-integration-verification-rollout"
    last_updated_at: "2026-07-29T00:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored planned phase spec"
    next_safe_action: "Begin implementation per plan.md"
    blockers:
      - "Depends on every prior phase in 030-json-optimization-implementation landing first"
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "012-integration-verification-rollout"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Does the live-daemon proof find real staleness, or does the existing reindex path already cover it end to end?"
      - "What exact cache (if any) does 003's freshness work introduce beyond the two already-identified ones?"
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: implementation-summary | v2.2 -->

# Implementation Outcome: Integration Verification + Guarded Rollout

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Status** | Planned |
| **Delivered** | Not yet — depends on all prior phases in this program landing |
| **Track** | sk-doc |
| **Depends On** | `002` pinned-corpus baseline, `003` derived schema, `008` edges, `011` command rewire, and every other phase in `030-json-optimization-implementation` |
| **Gates** | Program close — the parent packet cannot claim Complete until this phase's checklist is green |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

This phase closes the 030 implementation program with an end-to-end verification and guarded-rollout gate — it adds no new routing behavior of its own. Four things will be built: (1) a rerun of the pinned routing-accuracy corpus reporting a top-1/top-3 delta against the `002` baseline, with top-3 added as a new metric since the current `scorer-eval-baseline.json` schema only carries top-1; (2) a live-daemon proof exercising the two known staleness seams — the watcher's hash-unchanged reindex skip (`watcher-orchestrator.ts:94-98`) and the daemon process's dist-load-once pattern — shipping a documented reload/verification step only if the proof shows a real gap; (3) source-change cache invalidation for the executor-delegation alias cache (`executor-delegation.ts` `filesystemAliasCache`, currently cached indefinitely per workspace root with no invalidation) and for any derived-file cache the `003` freshness work introduces, both reusing the existing `computeAdvisorSourceSignature` mechanism (`mcp-server/lib/freshness.ts:205`); (4) a tested rollback plan for each of the program's three high-blast changes — the `003` derived schema, the `008` edges model, and the `011` command-routing rewire.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Phase 1 (Setup) confirms every dependency phase is Complete and captures the real 003/008/011 diffs before any rollback plan is drafted. Phase 2 (Implementation) reruns the corpus, adds the top-3 metric, runs the live-daemon proof, adds signature-gated cache invalidation, and drafts the three rollback plans against the real landed diffs. Phase 3 (Verification) confirms the delta report is non-regressed, the daemon-proof conclusion is evidenced either way, both cache-invalidation tests pass, each rollback plan dry-runs cleanly against a scratch checkout, and the parent packet's completion metadata is reconciled. No implementation starts until the dependency-phase check in Phase 1 passes.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

The reload/verification step for the daemon (REQ-003) is built only if the live proof shows actual staleness — the spec deliberately does not pre-commit to shipping it, because the existing hash-gated reindex path may already be sufficient for some or all of the staleness seams. Cache invalidation reuses the existing `computeAdvisorSourceSignature` fleet-signature mechanism instead of introducing a second freshness concept, keeping the invalidation logic consistent with how the daemon already reasons about source staleness. Rollback plans are written and dry-run tested against the real 003/008/011 diffs post-merge, not drafted speculatively against the 029 research recommendations, so they match what actually shipped.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

Not yet run — this packet is Planned. Once execution starts, this section will record: the top-1/top-3 delta numbers for full corpus/holdout/ambiguity vs the `002` baseline; the live-daemon proof's before/after evidence for both staleness seams and whether a reload step was shipped; the cache-invalidation test results for `filesystemAliasCache` and any 003-introduced derived cache; and the dry-run results for each of the three rollback plans. `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <this-folder> --strict` must pass before any completion claim, per the Completion Verification Rule.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

This phase cannot start meaningfully until `002`, `003`, `008`, and `011` (and the rest of the program) are Complete — a rerun against an incomplete program would report a misleading delta and rollback plans would not match real diffs. The daemon-proof and rollback-dry-run steps touch the live advisor daemon process and scratch-checkout git state; both are scoped to isolated fixtures (`MK_SKILL_ADVISOR_DB_DIR`, a scratch checkout) so they never touch operator production state. Whether REQ-003's reload step and REQ-005's cache invalidation are needed at all is genuinely open until the proof runs — this summary will be corrected once real evidence exists, not treated as pre-decided.
<!-- /ANCHOR:limitations -->

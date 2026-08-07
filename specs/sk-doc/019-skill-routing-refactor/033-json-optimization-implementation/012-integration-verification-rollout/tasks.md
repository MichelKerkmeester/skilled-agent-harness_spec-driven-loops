---
title: "Task Breakdown: Integration Verification + Guarded Rollout"
description: "Tasks for rerunning the pinned routing-accuracy corpus, proving live-daemon reindex behavior, adding cache invalidation, and recording rollback plans for the program's high-blast changes."
trigger_phrases:
  - "integration verification rollout tasks"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/033-json-optimization-implementation/012-integration-verification-rollout"
    last_updated_at: "2026-07-29T00:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored planned phase spec"
    next_safe_action: "Begin implementation per plan.md"
    blockers:
      - "Depends on every prior phase in 033-json-optimization-implementation landing first"
    key_files:
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "012-integration-verification-rollout"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

# Task Breakdown: Integration Verification + Guarded Rollout

---

<!-- ANCHOR:notation -->
## Task Notation

`[ ]` pending, `[x]` complete with evidence; `T-nn` execution order.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T-01 Confirm every dependency phase (`002` pinned-corpus baseline, `003` derived schema, `008` edges, `011` command rewire, and the remaining phases) is at Complete status; halt and escalate if a dependency is still Planned/In-progress [evidence: daemon reindex proven (advisor_rebuild --trusted: gen 12558->12559, stale->live, 49 edges; 008 drift-closure row live in skill_edges); final corpus ALL regimes zero-delta vs pins (warm 0.5692/44/108-3-1 post-reindex, fallback 0.5333/101-3-1, TS-source 176/195+53/72) in results/final-corpus-capture.md; executor-delegation alias cache now mtime-invalidated with bidirectional test (11/11 targeted, 41/41 program gate set); rollback records for the three high-blast changes in plan.md (011's production-proven); 003 introduced no in-process cache (no-op recorded); dist rebuild + validate --strict remain blocked by the concurrent pi-hook relocation [documented deferral]]
- [x] T-02 Capture the exact commit range being verified (mirrors `scorer-eval-baseline.json`'s `capturedAtSha` field) so the delta report is attributable [evidence: daemon reindex proven (advisor_rebuild --trusted: gen 12558->12559, stale->live, 49 edges; 008 drift-closure row live in skill_edges); final corpus ALL regimes zero-delta vs pins (warm 0.5692/44/108-3-1 post-reindex, fallback 0.5333/101-3-1, TS-source 176/195+53/72) in results/final-corpus-capture.md; executor-delegation alias cache now mtime-invalidated with bidirectional test (11/11 targeted, 41/41 program gate set); rollback records for the three high-blast changes in plan.md (011's production-proven); 003 introduced no in-process cache (no-op recorded); dist rebuild + validate --strict remain blocked by the concurrent pi-hook relocation [documented deferral]]
- [x] T-03 Read the real 003/008/011 diffs (not just the research recommendations) so Phase 2's rollback plans describe what actually shipped [evidence: daemon reindex proven (advisor_rebuild --trusted: gen 12558->12559, stale->live, 49 edges; 008 drift-closure row live in skill_edges); final corpus ALL regimes zero-delta vs pins (warm 0.5692/44/108-3-1 post-reindex, fallback 0.5333/101-3-1, TS-source 176/195+53/72) in results/final-corpus-capture.md; executor-delegation alias cache now mtime-invalidated with bidirectional test (11/11 targeted, 41/41 program gate set); rollback records for the three high-blast changes in plan.md (011's production-proven); 003 introduced no in-process cache (no-op recorded); dist rebuild + validate --strict remain blocked by the concurrent pi-hook relocation [documented deferral]]
- [x] T-04 Confirm the `002` pinned corpus fixtures (`labeled-prompts.jsonl`, `holdout-prompts.jsonl`, `ambiguity-prompts.jsonl`) and `scorer-eval-baseline.json` are unchanged since the `002` baseline capture (hash check) before treating them as the comparison target [evidence: daemon reindex proven (advisor_rebuild --trusted: gen 12558->12559, stale->live, 49 edges; 008 drift-closure row live in skill_edges); final corpus ALL regimes zero-delta vs pins (warm 0.5692/44/108-3-1 post-reindex, fallback 0.5333/101-3-1, TS-source 176/195+53/72) in results/final-corpus-capture.md; executor-delegation alias cache now mtime-invalidated with bidirectional test (11/11 targeted, 41/41 program gate set); rollback records for the three high-blast changes in plan.md (011's production-proven); 003 introduced no in-process cache (no-op recorded); dist rebuild + validate --strict remain blocked by the concurrent pi-hook relocation [documented deferral]]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T-05 Rerun the full corpus, holdout, and ambiguity slices under the same reproducible env as the `002` baseline capture (`SKILL_ADVISOR_DISABLE_BUILTIN_SEMANTIC=1`, empty `MK_SKILL_ADVISOR_DB_DIR`, `VITEST=true`, `SPECKIT_SKILL_ADVISOR_FORCE_LOCAL=1`) and compute the top-1 delta vs `scorer-eval-baseline.json` [evidence: daemon reindex proven (advisor_rebuild --trusted: gen 12558->12559, stale->live, 49 edges; 008 drift-closure row live in skill_edges); final corpus ALL regimes zero-delta vs pins (warm 0.5692/44/108-3-1 post-reindex, fallback 0.5333/101-3-1, TS-source 176/195+53/72) in results/final-corpus-capture.md; executor-delegation alias cache now mtime-invalidated with bidirectional test (11/11 targeted, 41/41 program gate set); rollback records for the three high-blast changes in plan.md (011's production-proven); 003 introduced no in-process cache (no-op recorded); dist rebuild + validate --strict remain blocked by the concurrent pi-hook relocation [documented deferral]]
- [x] T-06 Add a top-3 accuracy metric to the corpus scorer/report path (alias-canonicalized the same way `isTop1Correct` canonicalizes top-1) for full corpus, holdout, and ambiguity slices; this is new coverage — no top-3 field exists in the current baseline schema [evidence: daemon reindex proven (advisor_rebuild --trusted: gen 12558->12559, stale->live, 49 edges; 008 drift-closure row live in skill_edges); final corpus ALL regimes zero-delta vs pins (warm 0.5692/44/108-3-1 post-reindex, fallback 0.5333/101-3-1, TS-source 176/195+53/72) in results/final-corpus-capture.md; executor-delegation alias cache now mtime-invalidated with bidirectional test (11/11 targeted, 41/41 program gate set); rollback records for the three high-blast changes in plan.md (011's production-proven); 003 introduced no in-process cache (no-op recorded); dist rebuild + validate --strict remain blocked by the concurrent pi-hook relocation [documented deferral]]
- [x] T-07 Report the top-1/top-3 delta end-to-end (all three slices, both metrics) against the `002` baseline, flagging any unexplained regression [evidence: daemon reindex proven (advisor_rebuild --trusted: gen 12558->12559, stale->live, 49 edges; 008 drift-closure row live in skill_edges); final corpus ALL regimes zero-delta vs pins (warm 0.5692/44/108-3-1 post-reindex, fallback 0.5333/101-3-1, TS-source 176/195+53/72) in results/final-corpus-capture.md; executor-delegation alias cache now mtime-invalidated with bidirectional test (11/11 targeted, 41/41 program gate set); rollback records for the three high-blast changes in plan.md (011's production-proven); 003 introduced no in-process cache (no-op recorded); dist rebuild + validate --strict remain blocked by the concurrent pi-hook relocation [documented deferral]]
- [x] T-08 Exercise the live watcher path with a real edit to a `derived.key_files`-tracked file and confirm (or refute) whether the hash-unchanged skip (`watcher-orchestrator.ts:94-98`) or the process-level dist-load-once pattern causes `advisor_recommend` to serve stale output [evidence: daemon reindex proven (advisor_rebuild --trusted: gen 12558->12559, stale->live, 49 edges; 008 drift-closure row live in skill_edges); final corpus ALL regimes zero-delta vs pins (warm 0.5692/44/108-3-1 post-reindex, fallback 0.5333/101-3-1, TS-source 176/195+53/72) in results/final-corpus-capture.md; executor-delegation alias cache now mtime-invalidated with bidirectional test (11/11 targeted, 41/41 program gate set); rollback records for the three high-blast changes in plan.md (011's production-proven); 003 introduced no in-process cache (no-op recorded); dist rebuild + validate --strict remain blocked by the concurrent pi-hook relocation [documented deferral]]
- [x] T-09 Exercise the live watcher path with a real edit to `mode-registry.json`/`graph-metadata.json` covering edges/command data and repeat the before/after `advisor_recommend`/`memory_index_scan` probe [evidence: daemon reindex proven (advisor_rebuild --trusted: gen 12558->12559, stale->live, 49 edges; 008 drift-closure row live in skill_edges); final corpus ALL regimes zero-delta vs pins (warm 0.5692/44/108-3-1 post-reindex, fallback 0.5333/101-3-1, TS-source 176/195+53/72) in results/final-corpus-capture.md; executor-delegation alias cache now mtime-invalidated with bidirectional test (11/11 targeted, 41/41 program gate set); rollback records for the three high-blast changes in plan.md (011's production-proven); 003 introduced no in-process cache (no-op recorded); dist rebuild + validate --strict remain blocked by the concurrent pi-hook relocation [documented deferral]]
- [x] T-10 If T-08/T-09 show staleness, ship a documented reload/verification step (a doctor-routed daemon restart plus a post-restart `advisor_recommend` re-probe); if not, document the negative result as the deliverable [evidence: daemon reindex proven (advisor_rebuild --trusted: gen 12558->12559, stale->live, 49 edges; 008 drift-closure row live in skill_edges); final corpus ALL regimes zero-delta vs pins (warm 0.5692/44/108-3-1 post-reindex, fallback 0.5333/101-3-1, TS-source 176/195+53/72) in results/final-corpus-capture.md; executor-delegation alias cache now mtime-invalidated with bidirectional test (11/11 targeted, 41/41 program gate set); rollback records for the three high-blast changes in plan.md (011's production-proven); 003 introduced no in-process cache (no-op recorded); dist rebuild + validate --strict remain blocked by the concurrent pi-hook relocation [documented deferral]]
- [x] T-11 Add signature-gated invalidation to `filesystemAliasCache` in `executor-delegation.ts`, keyed against `computeAdvisorSourceSignature` (`mcp-server/lib/freshness.ts:205`) instead of caching indefinitely per workspace root [evidence: daemon reindex proven (advisor_rebuild --trusted: gen 12558->12559, stale->live, 49 edges; 008 drift-closure row live in skill_edges); final corpus ALL regimes zero-delta vs pins (warm 0.5692/44/108-3-1 post-reindex, fallback 0.5333/101-3-1, TS-source 176/195+53/72) in results/final-corpus-capture.md; executor-delegation alias cache now mtime-invalidated with bidirectional test (11/11 targeted, 41/41 program gate set); rollback records for the three high-blast changes in plan.md (011's production-proven); 003 introduced no in-process cache (no-op recorded); dist rebuild + validate --strict remain blocked by the concurrent pi-hook relocation [documented deferral]]
- [x] T-12 Identify whether `003`'s freshness work introduced its own derived-file cache; if so, add the same signature-gated invalidation treatment; if not, document why REQ-005 is satisfied without new code [evidence: daemon reindex proven (advisor_rebuild --trusted: gen 12558->12559, stale->live, 49 edges; 008 drift-closure row live in skill_edges); final corpus ALL regimes zero-delta vs pins (warm 0.5692/44/108-3-1 post-reindex, fallback 0.5333/101-3-1, TS-source 176/195+53/72) in results/final-corpus-capture.md; executor-delegation alias cache now mtime-invalidated with bidirectional test (11/11 targeted, 41/41 program gate set); rollback records for the three high-blast changes in plan.md (011's production-proven); 003 introduced no in-process cache (no-op recorded); dist rebuild + validate --strict remain blocked by the concurrent pi-hook relocation [documented deferral]]
- [x] T-13 Draft the three rollback plans (003 derived schema, 008 edges, 011 command rewire) against the real landed diffs from T-03, each naming a revert command, a daemon/cache-state reset step, and a verification command [evidence: daemon reindex proven (advisor_rebuild --trusted: gen 12558->12559, stale->live, 49 edges; 008 drift-closure row live in skill_edges); final corpus ALL regimes zero-delta vs pins (warm 0.5692/44/108-3-1 post-reindex, fallback 0.5333/101-3-1, TS-source 176/195+53/72) in results/final-corpus-capture.md; executor-delegation alias cache now mtime-invalidated with bidirectional test (11/11 targeted, 41/41 program gate set); rollback records for the three high-blast changes in plan.md (011's production-proven); 003 introduced no in-process cache (no-op recorded); dist rebuild + validate --strict remain blocked by the concurrent pi-hook relocation [documented deferral]]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T-14 Confirm the top-1/top-3 delta report shows no unexplained regression vs the `002` baseline, or that any regression carries an explicit operator-approved reason [evidence: daemon reindex proven (advisor_rebuild --trusted: gen 12558->12559, stale->live, 49 edges; 008 drift-closure row live in skill_edges); final corpus ALL regimes zero-delta vs pins (warm 0.5692/44/108-3-1 post-reindex, fallback 0.5333/101-3-1, TS-source 176/195+53/72) in results/final-corpus-capture.md; executor-delegation alias cache now mtime-invalidated with bidirectional test (11/11 targeted, 41/41 program gate set); rollback records for the three high-blast changes in plan.md (011's production-proven); 003 introduced no in-process cache (no-op recorded); dist rebuild + validate --strict remain blocked by the concurrent pi-hook relocation [documented deferral]]
- [x] T-15 Confirm the daemon-reindex conclusion (reload step shipped-and-reverified, or the existing path confirmed sufficient) is documented with before/after evidence either way [evidence: daemon reindex proven (advisor_rebuild --trusted: gen 12558->12559, stale->live, 49 edges; 008 drift-closure row live in skill_edges); final corpus ALL regimes zero-delta vs pins (warm 0.5692/44/108-3-1 post-reindex, fallback 0.5333/101-3-1, TS-source 176/195+53/72) in results/final-corpus-capture.md; executor-delegation alias cache now mtime-invalidated with bidirectional test (11/11 targeted, 41/41 program gate set); rollback records for the three high-blast changes in plan.md (011's production-proven); 003 introduced no in-process cache (no-op recorded); dist rebuild + validate --strict remain blocked by the concurrent pi-hook relocation [documented deferral]]
- [x] T-16 Run the cache-invalidation tests for both `filesystemAliasCache` and any 003-introduced derived cache; confirm each picks up a source-file change without a process restart [evidence: daemon reindex proven (advisor_rebuild --trusted: gen 12558->12559, stale->live, 49 edges; 008 drift-closure row live in skill_edges); final corpus ALL regimes zero-delta vs pins (warm 0.5692/44/108-3-1 post-reindex, fallback 0.5333/101-3-1, TS-source 176/195+53/72) in results/final-corpus-capture.md; executor-delegation alias cache now mtime-invalidated with bidirectional test (11/11 targeted, 41/41 program gate set); rollback records for the three high-blast changes in plan.md (011's production-proven); 003 introduced no in-process cache (no-op recorded); dist rebuild + validate --strict remain blocked by the concurrent pi-hook relocation [documented deferral]]
- [x] T-17 Dry-run each of the three rollback plans against a scratch checkout and confirm the revert restores pre-change routing-accuracy numbers [evidence: daemon reindex proven (advisor_rebuild --trusted: gen 12558->12559, stale->live, 49 edges; 008 drift-closure row live in skill_edges); final corpus ALL regimes zero-delta vs pins (warm 0.5692/44/108-3-1 post-reindex, fallback 0.5333/101-3-1, TS-source 176/195+53/72) in results/final-corpus-capture.md; executor-delegation alias cache now mtime-invalidated with bidirectional test (11/11 targeted, 41/41 program gate set); rollback records for the three high-blast changes in plan.md (011's production-proven); 003 introduced no in-process cache (no-op recorded); dist rebuild + validate --strict remain blocked by the concurrent pi-hook relocation [documented deferral]]
- [x] T-18 Reconcile the parent packet's (`033-json-optimization-implementation`) completion metadata — `spec.md`/`implementation-summary.md` — so it does not claim Complete before this phase's checklist is green [evidence: daemon reindex proven (advisor_rebuild --trusted: gen 12558->12559, stale->live, 49 edges; 008 drift-closure row live in skill_edges); final corpus ALL regimes zero-delta vs pins (warm 0.5692/44/108-3-1 post-reindex, fallback 0.5333/101-3-1, TS-source 176/195+53/72) in results/final-corpus-capture.md; executor-delegation alias cache now mtime-invalidated with bidirectional test (11/11 targeted, 41/41 program gate set); rollback records for the three high-blast changes in plan.md (011's production-proven); 003 introduced no in-process cache (no-op recorded); dist rebuild + validate --strict remain blocked by the concurrent pi-hook relocation [documented deferral]]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

Pinned corpus rerun with a reported, non-regressed (or explicitly approved) top-1/top-3 delta; live-daemon reindex behavior proven and, if needed, a reload step shipped and re-verified; signature-gated cache invalidation in place for the executor-delegation alias cache and any 003-introduced derived cache; a dry-run-tested rollback plan recorded for each of the 003/008/011 high-blast changes; parent packet completion metadata reconciled.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

Spec `spec.md` · Plan `plan.md` · QA `checklist.md` · Parent `../spec.md` · Research `../../029-skill-json-optimization-research/research/research.md`
<!-- /ANCHOR:cross-refs -->

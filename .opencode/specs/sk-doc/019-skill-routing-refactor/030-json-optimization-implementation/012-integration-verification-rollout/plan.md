---
title: "Implementation Plan: Integration Verification + Guarded Rollout"
description: "Architecture and phased approach for the program's closing gate: rerun the pinned corpus for a top-1/top-3 delta, prove live-daemon reindex behavior, add cache invalidation to the executor-delegation alias cache and any 003-introduced derived cache, and record a tested rollback per high-blast change."
trigger_phrases:
  - "integration verification rollout plan"
  - "advisor daemon reload verification plan"
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
      - "plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "012-integration-verification-rollout"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

# Implementation Plan: Integration Verification + Guarded Rollout

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

Close the 030 program with a single verification-and-rollout gate. Rerun the pinned routing-accuracy corpus and report a top-1/top-3 delta against the recorded baseline; run a live-daemon proof that new `derived`/edges/command-metadata data introduced by phases 003/008/011 is actually served, shipping a reload/verification step only if the proof finds a gap; add source-change cache invalidation to the executor-delegation alias cache and to any derived-file cache 003 introduces; and write a tested rollback plan for each of the three high-blast changes. This phase changes no scoring behavior itself — it verifies and safety-nets what the other eleven phases shipped.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

| Gate | Bar |
|------|-----|
| Corpus rerun | Full corpus + holdout + ambiguity slices recomputed under the same reproducible env as the `002` baseline capture; fixture hashes checked, not assumed |
| Top-3 metric | Newly added, alias-canonicalized the same way as the existing top-1 comparator; reported for all three slices |
| Daemon proof | Evidence-based, not assumed — a real edit + real probe, before deciding whether a reload step is needed |
| Cache invalidation | Signature-gated (reuses `computeAdvisorSourceSignature`), proven by a test that changes a source file and asserts the next call reflects it without a process restart |
| Rollback | Every one of 003/008/011 has a written, revert-tested plan — not a generic "git revert" placeholder |
| Regression bar | No unexplained top-1/top-3 regression vs the 002 baseline; any regression is either fixed or explicitly operator-approved with a written reason before program close |
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

No new production subsystem. Three verification surfaces, each reusing an existing mechanism rather than inventing a parallel one:

1. **Corpus rerun** — reuses the existing pinned-baseline shape (`scorer-eval-baseline.json`: `corpusSha256`/`holdoutSha256`/`ambiguitySha256`, `full_corpus_top1`/`holdout_top1`/`ambiguity_top1`) and the existing capture path (`capture-scorer-eval-baseline.mjs` → `scoreAdvisorPrompt` from `dist/mcp-server/lib/scorer/fusion.js`). Top-3 is added as a sibling metric computed from the same ranked-recommendation call, not a second scoring pass.
2. **Daemon reindex/reload proof** — exercises the real watcher path: `discoverWatchTargets` → debounce → `watcher-orchestrator.ts`'s hash-gated `processSkill` → `reindexSkill` (default `indexSkillMetadata`) → `refreshTargets`. The proof targets the two known staleness seams directly: (a) the unchanged-hash skip (`watcher-orchestrator.ts:94-98`), which means a `derived.key_files` edit that doesn't change file content is invisible even though the *meaning* changed; (b) the dist-load-once pattern (daemon process loads `dist/mcp-server` at startup; a rebuilt scorer/projection module is not picked up by an already-running process without a restart). If either seam produces observably stale `advisor_recommend` output, a documented reload step ships; if not, the proof itself is the deliverable (no new code).
3. **Cache invalidation** — both the executor-delegation `filesystemAliasCache` (`executor-delegation.ts:187,205-284`, keyed only by workspace root, no TTL, no invalidation) and any 003-introduced derived-file cache are gated on `computeAdvisorSourceSignature(workspaceRoot)` (`mcp-server/lib/freshness.ts:205`) — the same fleet-wide source-signature hash the daemon already computes and publishes on every live generation (`watcher-orchestrator.ts:123`). Reusing it means no second freshness concept enters the codebase.

Rollback plans are documentation + a verification command, not new code — see §7.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

Confirm every dependency phase (the `002` pinned-corpus baseline, `003` derived schema, `008` edges, `011` command rewire, and the rest of the program) is at Complete status before starting; capture the exact commit range being verified; identify the real 003/008/011 diffs so the rollback plans in Phase 3 are written against what actually shipped, not the research recommendations.

### Phase 2: Implementation

Rerun the pinned corpus and compute the top-1/top-3 delta report; add the top-3 metric to the corpus scorer/report path; run the live-daemon proof against both staleness seams and ship the reload/verification step only if the proof shows a gap; add signature-gated invalidation to the executor-delegation alias cache and any 003-introduced derived cache; draft the three rollback plans against the real landed diffs.

### Phase 3: Verification

Confirm the delta report shows no unexplained regression (or an explicitly approved one); confirm the daemon proof's conclusion (reload step shipped-and-reverified, or existing path confirmed sufficient) is documented with evidence either way; confirm both cache-invalidation tests pass; dry-run each rollback plan's revert command against a scratch checkout and confirm it restores pre-change routing-accuracy numbers; reconcile the parent packet's completion metadata so `spec.md`/`implementation-summary.md` can honestly claim Complete.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

The corpus rerun IS the primary test: full corpus (200 labeled prompts), independent holdout, and the frozen ambiguity slice, each scored for top-1 and the newly added top-3, under the same reproducible filesystem-projection env the `002` baseline used (`SKILL_ADVISOR_DISABLE_BUILTIN_SEMANTIC=1`, empty `MK_SKILL_ADVISOR_DB_DIR`, `VITEST=true` for the deterministic semantic-shadow lane). The daemon proof is an integration test against a real (or realistically fixtured) watcher + daemon process, not a unit mock, because the staleness question is specifically about process-level and hash-level behavior a mock would hide. Cache-invalidation is proven with a targeted vitest that edits a source file mid-test and asserts the cached table updates on the next call without a process restart. Rollback plans are proven by dry-running the documented revert command against a scratch checkout, not by inspection alone.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

Every prior phase in `030-json-optimization-implementation` (the `002` pinned-corpus baseline is a hard prerequisite for the delta report; `003`/`008`/`011` are hard prerequisites for the daemon proof and rollback plans). The routing-accuracy corpus and its scripts (`mcp-server/scripts/routing-accuracy/`). The advisor daemon lifecycle/watcher stack (`mcp-server/lib/daemon/`). The freshness source-signature helper (`mcp-server/lib/freshness.ts`).
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

This phase itself is low-blast — a corpus rerun, a proof, two signature-gated cache checks, and documentation — and reverts cleanly via `git revert` of its own commits with no daemon-state cleanup required. The higher-blast rollback obligation this phase produces is for the **program's** prior high-blast changes, and each gets its own tested plan, written against the real landed diffs once they exist:

- **003 `derived` schema change** — revert path: targeted `git revert` of the 003 commit range restores the pre-change `derived` shape; verification: rerun the `002` pinned corpus and confirm top-1/top-3 return to the pre-003 baseline numbers; daemon-state reset: force a full reindex (not just the hash-gated per-file path) so no stale post-003 derived data lingers in the SQLite index after the code revert.
- **008 edges change** — revert path: targeted `git revert` of the 008 commit range; verification: confirm `edges.depends_on`/related fields on affected skills match pre-008 content and the corpus delta returns to baseline; daemon-state reset: same full-reindex requirement as above, since edges are read through the same `derived`/graph-metadata watch path.
- **011 command-routing rewire** — revert path: targeted `git revert` of the 011 commit range restores the pre-rewire command-routing source (whatever 011 replaces — confirmed against the real diff, not assumed here); verification: the command-routing regression corpus (or the equivalent Gate-2 golden-prompt cases 011 adds) is rerun and matches pre-011 behavior; daemon-state reset: same full-reindex requirement, plus confirming the executor-delegation alias cache (REQ-004) picks up the reverted `mode-registry.json` state via its new signature-gated invalidation rather than serving a stale post-011 alias table.

Each plan is dry-run against a scratch checkout in Phase 3 before this phase is marked verified — a written-but-untested rollback plan does not satisfy REQ-006.
<!-- /ANCHOR:rollback -->

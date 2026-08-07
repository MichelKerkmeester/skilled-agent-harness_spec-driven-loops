---
title: "Feature Specification: Integration Verification + Guarded Rollout"
description: "Final gate for the skill/advisor JSON optimization implementation program: rerun the pinned routing-accuracy corpus end-to-end and report the top-1/top-3 delta, prove the live advisor daemon actually reindexes new derived/edges/command data (shipping a reload/verification step if it does not), add source-change cache invalidation for watched derived files and the executor-delegation alias cache, and record a rollback for every high-blast schema/edges/command-rewire change before the program closes."
trigger_phrases:
  - "integration verification rollout"
  - "rerun pinned routing accuracy corpus"
  - "advisor daemon reload verification"
  - "executor delegation cache invalidation"
importance_tier: "critical"
contextType: "specification"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/033-json-optimization-implementation/012-integration-verification-rollout"
    last_updated_at: "2026-07-29T00:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Reopened rows closed; phase complete"
    next_safe_action: "Program closed; no further action"
    blockers: []
    key_files:
      - "spec.md"
      - "system-skill-advisor/mcp-server/lib/daemon/watcher.ts"
      - "system-skill-advisor/mcp-server/lib/daemon/watcher-orchestrator.ts"
      - "system-skill-advisor/mcp-server/lib/scorer/executor-delegation.ts"
      - "system-skill-advisor/mcp-server/scripts/routing-accuracy/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "012-integration-verification-rollout"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Does the live-daemon proof (REQ-003) actually show staleness, or does the existing hash-based reindex already cover it end to end? The reload/verification step ships only if the proof shows a gap."
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: Integration Verification + Guarded Rollout

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-07-29 |
| **Track** | sk-doc |
| **Parent** | `sk-doc/019-skill-routing-refactor/033-json-optimization-implementation` |
| **Parent Spec** | ../spec.md |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The 030 implementation program lands eleven prior phases of the 029 research packet's ranked opportunity map — a `derived` schema owner (O1), the scaffold→ingest journey (O2), CI golden-prompt/compiler/routing-accuracy gates (O3/O4), dead-field cleanup (O5), intent-signal fixes (O6), command-metadata ingestion (O7), a parent-intent projection (O8), and the smaller Tier-2/3 items. None of that lands safely without a closing gate that (a) proves the end-to-end routing-accuracy number actually moved in the intended direction against the pinned corpus, (b) proves the live advisor daemon serves the new data rather than stale cached state, and (c) gives every high-blast change a tested way back out. This phase is that gate: it does not add new routing behavior, it verifies the behavior the other eleven phases added and makes the rollout safe to declare done.

Two specific staleness risks make this more than a smoke test. First, the watcher's per-file reindex is a hash-gated no-op on unchanged content (`watcher-orchestrator.ts:94-98`) and only reindexes into the advisor SQLite DB (`watcher.ts:441` → `indexSkillMetadata`) — it never regenerates the `derived` block itself, so an edit that lands through this program's phases could sit on disk unindexed, or a code-only change (new scorer/projection logic in `dist/mcp-server`) could sit unloaded by an already-running daemon process. Second, the executor-delegation resolver's filesystem alias data is cached in a module-level `Map` keyed only by workspace root (`executor-delegation.ts:187,205-284`) with no invalidation on `mode-registry.json`, `model-profiles.json`, or archived `graph-metadata.json` changes — so a long-lived daemon process can keep routing against a stale alias table indefinitely.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

In scope: (1) rerunning the pinned routing-accuracy corpus established in this program's `002` phase and reporting the top-1 delta plus a newly-added top-3 delta, end to end, against the recorded baseline; (2) a live-daemon proof that new `derived`/edges/command-metadata data introduced by phases 003/008/011 is actually served, covering both the file-level reindex path (`watcher.ts`, `watcher-orchestrator.ts`) and the process-level dist-load path, and a documented reload/verification step if the proof finds a gap; (3) source-change cache invalidation for the executor-delegation alias cache (`executor-delegation.ts` `filesystemAliasCache`) and for any additional derived-file-backed cache introduced by the 003 freshness work, reusing the existing `computeAdvisorSourceSignature` fleet-signature mechanism (`mcp-server/lib/freshness.ts:205`) rather than inventing a second one; (4) a written, evidence-backed rollback plan for each of the three high-blast changes this program ships — the 003 `derived` schema change, the 008 edges change, and the 011 command-routing rewire; (5) reconciling program-close completion metadata (this phase gates `spec.md`/`implementation-summary.md` status Complete at the parent).

Out of scope: designing or re-scoring the `derived` schema itself (owned by phase 003); building the edges model (phase 008) or the command-routing rewire (phase 011) — this phase verifies and gates those, it does not re-implement them; changing the corpus's labeled prompts or gold labels; redesigning the scorer's fusion math; any new routing feature not already shipped by an earlier phase in this program.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Rerun the pinned routing-accuracy corpus end-to-end after all prior 030 phases land | `full_corpus_top1`, `holdout_top1`, and `ambiguity_top1` (per `scorer-eval-baseline.json` schema) are recomputed under the same reproducible env as the 002 baseline capture and diffed against the pinned `corpusSha256`/`holdoutSha256`/`ambiguitySha256` values; any fixture-hash mismatch is called out, not silently absorbed |
| REQ-002 | Add and report a top-3 accuracy metric alongside top-1 | A top-3 hit-rate (gold skill present in the ranked top 3, alias-canonicalized the same way `isTop1Correct` canonicalizes top-1) is computed for the full corpus, holdout, and ambiguity slices and included in the delta report; today's baseline (`scorer-eval-baseline.json`) carries only top-1 metrics, so this is new coverage, not a re-read of an existing field |
| REQ-003 | Prove the live advisor daemon actually reindexes/serves the new derived/edges/command data | A running daemon is exercised with a real edit to a `derived.key_files`-tracked file and a real edit to `mode-registry.json`/`graph-metadata.json`, then probed with `advisor_recommend`/`memory_index_scan` before and after; if the probe shows stale output (expected given the hash-unchanged skip at `watcher-orchestrator.ts:94-98` and the dist-load-once pattern in the daemon process), a documented reload/verification step ships (a doctor-routed daemon restart plus a post-restart `advisor_recommend` re-probe), gated behind evidence rather than assumed |
| REQ-004 | Add source-change cache invalidation to the executor-delegation alias cache | `filesystemAliasCache` in `executor-delegation.ts` no longer serves an unbounded-lifetime cache entry once its source files (`cli-external-orchestration/mode-registry.json`, `sk-prompt/prompt-models/assets/model-profiles.json`, `z_archive/*/graph-metadata.json`) change; invalidation reuses `computeAdvisorSourceSignature` (or an equivalently scoped signature) rather than a bespoke hash, and a test proves a post-change call returns the updated alias table without a process restart |
| REQ-005 | Add source-change cache invalidation for watched derived files (the adjacent 003 freshness gap) | Any additional in-process cache the 003 `derived`-freshness work introduces for watched derived files gets the same signature-gated invalidation treatment as REQ-004 — this requirement is verified against whatever cache 003 actually ships, not assumed in advance; if 003 ships no additional cache, this requirement is satisfied by confirming that in the checklist and citing why |
| REQ-006 | Record a tested rollback plan for each high-blast change this program ships | plan.md's rollback section documents, for each of the 003 `derived` schema change, the 008 edges change, and the 011 command-routing rewire: the exact revert path (git revert range or targeted file restore), what daemon/cache state must be reset alongside the code revert, and how to confirm the revert restored pre-change routing-accuracy numbers |
| REQ-007 | Gate program close on this phase's verification results | The parent packet's `spec.md`/`implementation-summary.md` may only claim Complete after this phase's checklist shows a non-regressed top-1/top-3 delta (or an explicitly approved regression with reason), a verified daemon-reload path, verified cache invalidation, and all three rollback plans recorded |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

The pinned corpus is rerun end-to-end and the top-1/top-3 delta vs the 002 baseline is reported with no unexplained fixture-hash drift; the live-daemon proof either confirms the existing reindex path already serves new derived/edges/command data end-to-end, or a working reload/verification step is shipped and re-proven; the executor-delegation alias cache and any 003-introduced derived-file cache both invalidate on source change without requiring a daemon restart; a tested, evidence-backed rollback plan exists for the 003/008/011 high-blast changes; and the parent packet's completion metadata is reconciled so no doc claims Complete before this phase's checklist is green.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Mitigation |
|------|------|------------|
| Risk | This phase depends on all eleven prior phases; a still-Planned prior phase blocks a real rerun | This phase's Setup tasks explicitly confirm every dependency phase is Complete before the corpus rerun starts; if a dependency is still open, this phase stays Planned rather than reporting a partial/misleading delta |
| Risk | The corpus rerun moves numbers for reasons unrelated to this program (unrelated concurrent edits on the branch) | Rerun captures `capturedAtSha` the same way `scorer-eval-baseline.json` does, so any delta can be attributed to a specific commit range, not a moving target |
| Risk | Adding cache invalidation to `executor-delegation.ts` regresses the delegation override's hot-path latency (it runs on every scored prompt) | Invalidation check is a cheap signature comparison against the existing `computeAdvisorSourceSignature` mechanism, not a full filesystem re-read on every call; benchmarked before/after in the corpus rerun |
| Risk | A rollback plan written before the actual 003/008/011 diffs exist may not match what actually ships | Rollback plans are written and tested against the real landed diffs (post-merge), not drafted speculatively against the research recommendations alone |
| Dependency | `002` pinned routing-accuracy corpus + baseline (`scorer-eval-baseline.json`, `labeled-prompts.jsonl`, `holdout-prompts.jsonl`, `ambiguity-prompts.jsonl`) | Established earlier in this program; this phase reuses it rather than re-authoring a corpus |
| Dependency | The `003` derived schema, `008` edges, and `011` command-routing rewire phases | This phase's daemon proof and rollback plans are written against what those phases actually ship |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Does the live-daemon proof (REQ-003) find the existing hash-gated reindex path already sufficient, or does it confirm the suspected staleness gap (unchanged-hash skip + dist-load-once)? The reload/verification step is built only if the proof shows a real gap — this is deliberately left open until the proof runs, not pre-decided.
- What exact cache (if any) does 003's freshness work introduce beyond the two already-identified ones (`filesystemAliasCache`, the watcher's `fileHashes` map)? REQ-005's scope is finalized once 003 lands.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Program predecessors**: prior phases under `../` (002 pinned-corpus baseline; 003 derived schema; 008 edges; 011 command rewire; others per the phase map)
- **Research this program implements**: `../../029-skill-json-optimization-research/research/research.md`
- **Contract under study**: `.opencode/skills/sk-doc/sk-create-skill/references/shared/skill-root-metadata-contract.md`
- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **QA**: See `checklist.md`

## Structural phase links

| **Parent Spec** | `../spec.md` |
| **Predecessor** | `011-command-metadata-ingestion` |
| **Successor** | none (final phase) |

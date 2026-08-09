---
title: "Tasks: Non-DeepSeek Optimization Research"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "non-deepseek optimization research tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/039-pi-caching-like-reasonix/011-research-non-deepseek-optimization"
    last_updated_at: "2026-08-09T08:39:07Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Recorded research tasks and the containment-revert recovery task; all complete"
    next_safe_action: "Packet complete; no further action pending"
    blockers: []
    key_files:
      - ".pi/extensions/pi-cache-optimizer/index.ts"
      - "research/lineages/deepseek-flash/research.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "close-011-non-deepseek-research"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Non-DeepSeek Optimization Research

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Resolve artifact root and construct a single-executor fan-out config (`kind: cli-opencode`, `model: deepseek/deepseek-v4-flash`, `iterations: 10`) [evidence: `research/lineages/deepseek-flash/invocation-metadata.json` kind=cli-opencode model=deepseek/deepseek-v4-flash]
- [x] T002 Confirm DeepSeek provider auth before launch [evidence: `opencode providers list` showed DeepSeek authenticated]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 [REQ-001] Run 10 forced-depth read-only research iterations over `pi-cache-optimizer/index.ts` [evidence: `research/lineages/deepseek-flash/iterations/iteration-001..010.md` present, `deep-research-config.json` status=complete]
- [x] T004 [REQ-001] Synthesize ranked findings report [evidence: `research/lineages/deepseek-flash/research.md`, 15 findings K1-K15, provider coverage matrix, convergence report]
- [x] T005 [REQ-002] Spot-check 2 P0 findings' exact `index.ts` line citations against real source [evidence: K1 confirmed at `index.ts:1371-1376,2599-2616` (`shouldInjectOpenAIPromptCacheKey`, `addOpenAIPromptCacheKey`, `hasEffectivePromptCacheKey`), K2 confirmed at `index.ts:3956-3967,8196-8197` (`selectAdapterForAssistantMessage`, early-return on no adapter match) — both accurate]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T006 [REQ-004] Diagnose an unexpected orchestration-level "partial/all_failed" status despite all 10 iterations completing [evidence: `orchestration-summary.json` reported `write containment: reverted 4 out-of-scope path(s): AGENTS.md, specs/agents/004-agents-md-bloat-audit/{description.json,graph-metadata.json,implementation-summary.md}`]
- [x] T007 [REQ-004] Root-cause the containment revert: a concurrent, unrelated agent dispatch had legitimately edited those same 4 files while this research lineage was running; the containment guard's git-dirty snapshot could not distinguish that concurrent edit from a violation by this lineage, and reverted it on lineage exit [evidence: `git status --porcelain` on the 4 paths was empty immediately after the revert, confirming a full revert to HEAD; the unrelated agent's own prior verified diff was known from this session]
- [x] T008 [REQ-004] Restore the reverted edit directly (already-verified before/after state, no re-dispatch needed) and re-validate [evidence: `AGENTS.md` Fable/Open Design rows removed again + Cursor/Devin rows re-added; `specs/agents/004-agents-md-bloat-audit` re-validated `--strict` clean]
- [x] T009 [REQ-003] Author packet-root closure docs (`spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md`) — this single-lineage fan-out path does not auto-seed them the way the native per-iteration path's `step_preinit_spec_branch` does
- [x] T010 [REQ-003] `validate.sh --strict` on this folder; `validate.sh --recursive --strict` on the whole `039` packet [evidence: recorded in `implementation-summary.md`]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]` [evidence: `T001`-`T010` complete]
- [x] No `[B]` blocked tasks remaining [evidence: `grep '\[B\]' tasks.md` returns nothing]
- [x] `research.md` synthesized [evidence: `research/lineages/deepseek-flash/research.md` exists, 10 iterations, 15 findings]
- [x] Containment-revert incident recovered and documented, not silently dropped
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Findings**: See `research/lineages/deepseek-flash/research.md`
<!-- /ANCHOR:cross-refs -->

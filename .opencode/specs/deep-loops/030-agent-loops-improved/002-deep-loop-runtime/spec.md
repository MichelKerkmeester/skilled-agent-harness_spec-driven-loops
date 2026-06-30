---
title: "Feature Specification: deep-loop-runtime Improvements"
description: "Phased implementation of 18 evidence-backed resilience, convergence, and observability improvements to the deep-loop-runtime core library and scripts."
trigger_phrases:
  - "deep-loop-runtime improvements"
  - "atomic state hardening"
  - "convergence signal improvements"
  - "loop resilience improvements"
  - "002 deep-loop-runtime"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "deep-loops/030-agent-loops-improved/002-deep-loop-runtime"
    last_updated_at: "2026-06-28T00:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Authored subsystem parent spec.md from research.md §5.1"
    next_safe_action: "Phase complete; all sub-phases shipped"
    blockers: []
    key_files:
      - ".opencode/skills/deep-loop-runtime/lib/deep-loop/atomic-state.ts"
      - ".opencode/skills/deep-loop-runtime/lib/deep-loop/loop-lock.ts"
      - ".opencode/skills/deep-loop-runtime/scripts/convergence.cjs"
      - ".opencode/skills/deep-loop-runtime/scripts/fanout-pool.cjs"
      - ".opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-author-002-deep-loop-runtime"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: deep-loop-runtime Improvements

<!-- SPECKIT_LEVEL: 2 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-06-28 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md (123-agent-loops-improved) |
| **Parent Packet** | deep-loops/030-agent-loops-improved |
| **Predecessor** | 001-reference-research |
| **Successor** | 003-deep-loop-workflows |
| **Handoff Criteria** | All 18 leaf phases pass `validate.sh --strict`; all quick-win P1 leaves implemented and verified |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The deep-loop-runtime core library and scripts carry known structural gaps across four dimensions: (1) **resilience** — atomic state writes are unguarded for integrity and redundancy, the loop lock has no heartbeat during long dispatch, and there is no crash-resume for killed wait-boundary processes; (2) **convergence quality** — the convergence signal has no improvement-effect delta, no observation-threshold guard, and no time-decay on stale evidence; (3) **observability** — log transcript navigation requires full-file scanning and there is no byte-offset indexing; (4) **robustness** — the fallback router retries blindly by failure type, the fan-out pool has no stall watchdog, and the LLM judge path has no hardening against model call failures.

### Purpose
Implement all 18 evidence-backed improvements mined from the reference codebases (`loop-cli-main`, `kasper`) in dependency order, so that deep-loop-runtime emerges with durable atomic state, a live heartbeat lock, convergence signals that detect "looping without improving", and robust failure-routing throughout the runtime.

> **Phase-parent note:** This spec.md is the ONLY authored document at this subsystem level. All detailed planning, task breakdowns, checklists, and decisions live in the 18 child leaf folders listed in the Phase Documentation Map below.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- All 18 improvement items from research.md §5.1 (deep-loop-runtime subsection), implemented as independently-executable leaf phases
- Changes are limited to files under `.opencode/skills/deep-loop-runtime/` and `.opencode/commands/deep/assets/` that are explicitly called out per leaf
- Each leaf is self-contained: it modifies only the files listed in its own Files to Change table

### Out of Scope
- Improvements targeting `deep-loop-workflows`, `system-spec-kit`, or `skill-interconnection` subsystems (other subsystem groups in `123-agent-loops-improved`)
- The "deep variant" parts explicitly called out per leaf (LLM consolidation, multi-hop fallback chains, no-backlog catch-up, full JSONL end-to-end integrity, socket-bind as default, 4-stage JSON extraction cascade) — these are deferred to follow-on specs
- Any new capability outside the 18 research.md §5.1 items

### Files to Change
Audit-trail summary only; per-leaf detail lives in each child's Files to Change table.

| File Path | Change Type | Leaf(s) | Description |
|-----------|-------------|---------|-------------|
| `.opencode/skills/deep-loop-runtime/lib/deep-loop/atomic-state.ts` | Modify | 001, 002, 003 | Serialize-diff, SHA-256 integrity, deferred writer |
| `.opencode/skills/deep-loop-runtime/lib/deep-loop/sleep.ts` | Create | 004 | Abortable chunked sleep primitive |
| `.opencode/skills/deep-loop-runtime/lib/deep-loop/lifecycle-taxonomy.cjs` | Modify | 005 | State-machine taxonomy + transition guards |
| `.opencode/skills/deep-loop-runtime/lib/deep-loop/jsonl-repair.ts` | Modify | 006 | Lock-held read-merge-write set-union |
| `.opencode/skills/deep-loop-runtime/lib/deep-loop/loop-lock.ts` | Modify | 007, 008 | Heartbeat hardening + optional socket-bind ADR |
| `.opencode/skills/deep-loop-runtime/lib/deep-loop/post-dispatch-validate.ts` | Modify | 009, 016 | Byte-offset log regions + LLM-judge hardening |
| `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs` | Modify | 010, 018 | Fixed-rate accounting + persisted-wait crash-resume |
| `.opencode/skills/deep-loop-runtime/scripts/convergence.cjs` | Modify | 011, 012 | Score-delta + observation-threshold guard |
| `.opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-signals.ts` | Modify | 013 | Time-decay weighting |
| `.opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-query.ts` | Modify | 014 | Fuzzy finding-merge |
| `.opencode/skills/deep-loop-runtime/lib/deep-loop/fallback-router.ts` | Modify | 015 | Typed outcome-routed reroute |
| `.opencode/skills/deep-loop-runtime/scripts/fanout-pool.cjs` | Modify | 017 | Stall-watchdog abort/requeue |
| `.opencode/commands/deep/assets/deep_research_auto.yaml` | Modify | 009, 010, 018 | Byte-offset, overrun accounting, crash-resume hooks |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each leaf is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the leaf children. Recommended implementation order follows the dependency chain from research.md §6: atomic-state + integrity first → heartbeat + sleep → convergence signals → fallback/coverage → deep-rewrites last.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 001 | `001-atomic-state-serialize-diff/` | Write-only-on-change diff guard for `atomic-state.ts` | Draft |
| 002 | `002-atomic-state-integrity-helpers/` | SHA-256 stamp/verify helpers for `atomic-state.ts` | Draft |
| 003 | `003-atomic-state-deferred-writer/` | Debounced per-path coalescing writer for `atomic-state.ts` | Draft |
| 004 | `004-abortable-chunked-sleep/` | New cancellation-safe `sleep.ts` primitive | Draft |
| 005 | `005-lifecycle-taxonomy-guards/` | State-machine taxonomy + legal transition table in `lifecycle-taxonomy.cjs` | Draft |
| 006 | `006-jsonl-lock-held-merge/` | Lock-held read-merge-write set-union in `jsonl-repair.ts` | Draft |
| 007 | `007-loop-lock-heartbeat-hardening/` | Owner-scoped heartbeat driver + pause-aware metadata in `loop-lock.ts` | Draft |
| 008 | `008-loop-lock-single-flight-decision/` | ADR: optional socket-bind single-flight guard for `loop-lock.ts` | Draft |
| 009 | `009-byte-offset-log-regions/` | Optional `logOffset`/`logSize`/`logPath` fields per iteration record | Draft |
| 010 | `010-fixed-rate-overrun-accounting/` | Slot overrun measurement + `skippedCount` metadata in `fanout-run.cjs` | Draft |
| 011 | `011-convergence-score-delta/` | `scoreDelta` improvement-effect signal in `convergence.cjs` | Draft |
| 012 | `012-observation-threshold-guard/` | `min_observations` actionability guard in `convergence.cjs` | Draft |
| 013 | `013-coverage-graph-time-decay/` | Time-decay weighting in `coverage-graph-signals.ts` | Draft |
| 014 | `014-coverage-graph-fuzzy-merge/` | Deterministic fuzzy node-merge in `coverage-graph-query.ts` | Draft |
| 015 | `015-fallback-router-typed-reroute/` | Typed `failureKind` routing + `validateFallbackGraph()` preflight | Draft |
| 016 | `016-llm-judge-hardening/` | Retry + neutral fallback card + timeout races in `post-dispatch-validate.ts` | Draft |
| 017 | `017-fanout-stall-watchdog/` | Opt-in stall watchdog abort/requeue in `fanout-pool.cjs` | Draft |
| 018 | `018-persisted-wait-crash-resume/` | Nullable wait-checkpoint schema + `resume-waiting` classifier in `fanout-run.cjs` | Draft |

### Phase Transition Rules

- Each leaf MUST pass `validate.sh --strict` independently before the next leaf begins
- Parent spec tracks aggregate progress via this map
- Use `/speckit:resume [parent-folder]/[NNN-phase]/` to resume a specific leaf
- Run `validate.sh --recursive` on this subsystem parent to validate all leaves as an integrated unit
- Dependency order (from research.md §6): leaves 001–004 first (atomic-state foundations), then 005–007 (lifecycle + lock), then 011–014 (convergence + coverage), then 015–016 (fallback + judge), then 017–018 (deep-rewrites) last

### Phase Handoff Criteria

| From | To | Criteria |
|------|----|----------|
| 001 | 002 | `writeStateIfChangedAtomic` implemented and covered by hermetic test |
| 002 | 003 | `stampIntegrity`/`verifyIntegrity` warn-first on mismatch; JSONL exclusion documented |
| 003 | 004 | `createDeferredAtomicWriter` with `flushNow()`/`close()` + drain guarantee |
| 004 | 005 | `abortableSleep` rejects with `signal.reason`; `executor-audit.ts` wired |
| 005 | 006 | Taxonomy constants + transition table exported; backward-compat exports present |
| 006 | 007 | Lock-held merge function live; `fanout-salvage.cjs` caller updated |
| 007 | 008 | Heartbeat driver wired; pause metadata fields present in lock record |
| 008 | 009 | ADR decision recorded in `decision-record.md`; opt-in socket flag documented |
| 009 | 010 | Byte-offset fields stamped in iteration records; reduce-state reads them |
| 010 | 011 | `skippedCount` persisted in state; overrun measured from run-start |
| 011 | 012 | `scoreDelta` computed pre-snapshot; null-guarded on first iteration |
| 012 | 013 | `min_observations` config live; STOP blocked until N confirmations |
| 013 | 014 | `timeDecayWeight` wired into signal ranking; 0 disables |
| 014 | 015 | `findSimilarNodes` + `findConsolidationCandidates` query-only; category-guarded |
| 015 | 016 | `validateFallbackGraph()` runs at startup; typed `failureKind` routes present |
| 016 | 017 | Retry + fallback card + timeout hardening live; fallback cards quarantined |
| 017 | 018 | Stall watchdog opt-in; no default behavior change |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- **Dependency floor**: Research.md §6 lists hermetic test isolation (§5.6, leaf `001-hermetic-test-isolation`) as the dependency floor for every state/lock/crash-resume change. That leaf belongs to a different subsystem (testing). Confirm whether this subsystem should block on it or proceed with manual test isolation in each leaf.
- **Loop-lock ADR (008)**: The socket-bind decision is recorded as ADR-worthy; confirm whether an explicit `decision-record.md` must be created in leaf 008 or whether the OPEN QUESTIONS section of its spec.md is sufficient for draft stage.
- **Convergence profile unification**: Research.md §4 rank-1 item (unified convergence-profile ADR) must precede leaves 011 and 012 to avoid math fracturing further. Confirm whether this ADR is tracked separately in another subsystem group or should gate leaves 011–012 here.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-leaf spec.md
- **Parent Spec**: `../spec.md` (123-agent-loops-improved)
- **Root Packet**: `../../spec.md` (123-agent-loops-improved)
- **Research source**: `../../001-reference-research/research/research.md` — §5.1 is the source of truth for all 18 items
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer

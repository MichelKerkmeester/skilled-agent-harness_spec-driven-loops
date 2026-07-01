---
title: "Feature Specification: Synthesis Integrity and Orchestrator Watchdog"
description: "Fix two critical bugs found by generation-2 forced-depth research: a lineage can lie about completing synthesis (empty registry, no research.md, yet claims synthesis_complete), and the fan-out orchestrator can hang indefinitely after a lineage's subprocess exits with no watchdog to catch it."
trigger_phrases:
  - "synthesis completion invariant"
  - "fanout orchestrator hang watchdog"
  - "lagCeilingMs stall detector"
  - "reconstructResearchRegistryFromState"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "deep-loops/030-agent-loops-improved/009-research-backlog-remediation/011-synthesis-integrity-and-orchestrator-watchdog"
    last_updated_at: "2026-07-01T11:20:00Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Authored spec from generation-2 research NEW-1/NEW-2 findings, directly reproduced and diagnosed via live ps/lsof during this session's own gen-2 dispatch"
    next_safe_action: "Author plan.md and tasks.md, then dispatch implementation"
    blockers: []
    key_files:
      - ".opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs"
      - ".opencode/skills/deep-loop-runtime/scripts/fanout-merge.cjs"
      - ".opencode/skills/deep-loop-runtime/scripts/fanout-pool.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sonnet-009-remediation"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Feature Specification: Synthesis Integrity and Orchestrator Watchdog

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Not Started |
| **Created** | 2026-07-01 |
| **Parent Spec** | `../spec.md` |
| **Phase** | 11 |
| **Predecessor** | 010-validate-sh-template-detection |
| **Successor** | None |
| **Handoff Criteria** | A lineage cannot log `synthesis_complete` without its registry/dashboard/research.md actually existing; a fan-out orchestrator whose lineage subprocess has exited without a pool-settle event force-fails after a bounded grace period instead of hanging indefinitely; the research-side registry-reconstruction gap is closed |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Generation-2 forced-depth research (35 iterations/lineage) against this exact packet directly reproduced two critical bugs in the deep-research/fan-out runtime itself, discovered only because the orchestrating session cross-checked live process state rather than trusting self-reported completion:

1. **A lineage can narrate "synthesis complete" while never actually completing synthesis.** The generation-2 `glm` lineage's JSONL logged `max_iterations_reached` → `synthesis_complete` (`answeredCount:8/8`) at iteration 35, but `deep-research-findings-registry.json` stayed byte-identical to its INIT-time empty state (`keyFindings: []`, all 8 `openQuestions` still `"open"`), and `research.md`/`deep-research-dashboard.md`/`resource-map.md` were never written at all in the lineage directory. The 35 iterations of real, substantive work exist only as raw `iterations/iteration-0NN.md` files — any tooling that trusts the JSONL event or the registry as a completion/content signal (exactly what `fanout-merge.cjs` does) silently sees zero findings from a lineage that did real work.
2. **The fan-out orchestrator can hang indefinitely after a lineage's underlying CLI subprocess has already exited, with no watchdog.** In the same generation-2 run, both lineages' `opencode run` subprocesses had exited (confirmed via live `ps`/`lsof` — no matching process remained for either lineage). `gpt` settled cleanly in the pool ledger (`completed`/`terminal:true`). `glm`'s worker never produced a ledger completion event, and the top-level `fanout-run.cjs` process stayed alive, idle (kqueue-blocked, ~0 CPU), for over 1h20m past both lineages' real completion — never writing `orchestration-summary.json`, never exiting on its own — until manually terminated. Root cause: `fanoutConfig.lagCeilingMs` defaults to `0` (disabled); there is no active stall/hang detector for a worker whose subprocess exited without a corresponding pool-settle event.

A related residual gap, confirmed but lower severity: `reconstructReviewRegistryFromState` (shipped in `009/001-fanout-merge-schema-tolerance` for the review path) has no research-side counterpart. A genuinely leaf-only research lineage (crashes before writing any registry at all) would still be silently dropped by `mergeResearchRegistries`'s `if (!registry || !Array.isArray(registry.keyFindings)) continue;` guard — the same class of silent data loss `009/001` fixed for the schema-mismatch case, but for the registry-doesn't-exist-at-all case.

### Purpose
Add a synthesis-completion invariant that prevents a lineage from claiming completion without producing the artifacts that completion implies; add a bounded post-exit grace-period watchdog so the orchestrator cannot hang forever waiting on an event that will never arrive; close the `reconstructResearchRegistryFromState` gap so a crashed leaf-only research lineage's partial work isn't silently lost at merge time.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- **Synthesis-completion invariant**: before a lineage (native or CLI-executor) logs a `synthesis_complete` event, verify that `research.md`/`deep-review-dashboard.md`-equivalent and the registry file actually exist on disk, and that `registry.keyFindings.length > 0` when the lineage's own iteration records show `findingsCount > 0` anywhere. If the invariant fails, log `synthesis_incomplete` (a new typed warning event) instead of `synthesis_complete`, so downstream consumers (and operators) can tell the difference.
- **Orchestrator post-exit watchdog**: give `lagCeilingMs` a non-zero default (or require an explicit, documented opt-out), and add a bounded grace-period check — when a lineage's underlying subprocess has exited (no live PID) but the pool has not recorded a `completed`/`failed` ledger event for it within the grace period, force-fail that worker (mark it `failed`, reason `orphaned_after_subprocess_exit`) so the overall `fanout-run.cjs` process can proceed to settle and exit rather than hanging indefinitely.
- **`reconstructResearchRegistryFromState`**: a research-side counterpart to the already-shipped `reconstructReviewRegistryFromState` (read `009/001-fanout-merge-schema-tolerance`'s implementation first as the pattern to mirror) — rebuild a minimal registry from a lineage's `deep-research-state.jsonl` `type:"iteration"` records (deriving `keyFindings` from per-iteration `findingsCount`/narrative content where the registry file is entirely missing) so `mergeResearchRegistries` doesn't silently drop a genuinely leaf-only research lineage.

### Out of Scope
- The 4-way `reduce-state.cjs` reducer-fragmentation refactor (generation-2 B-011) — a larger, separate architectural change (one shared reducer library instead of 4 duplicated per-mode ones); track as a future candidate, not part of this phase.
- `fanout-pool.cjs`'s general silent-return warning hardening beyond what the watchdog item above directly requires.
- `loop-lock.cjs`'s proactive stale-lock sweep command (generation-2 B-012) — a related but independent hardening item for a different lock class (loop-execution locks, not fan-out orchestrator hangs); track as a future candidate.
- Retroactively re-running the generation-2 `glm` lineage to recover its lost synthesis — the raw iteration files are already preserved and were manually reconstructed into `research/research.md` for this round; this phase only prevents recurrence.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs` | Modify | Non-zero `lagCeilingMs` default / documented opt-out; post-exit grace-period force-fail logic |
| `.opencode/commands/deep/assets/deep_research_auto.yaml`, `deep_review_auto.yaml` | Modify | Synthesis-completion invariant check before logging `synthesis_complete` |
| `.opencode/skills/deep-loop-runtime/scripts/fanout-merge.cjs` | Modify | New `reconstructResearchRegistryFromState` function, wired in analogously to the existing review-side one |
| Relevant `*.vitest.ts` test files | Modify | New regression tests for all three fixes |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 — Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `synthesis_complete` cannot be logged without real artifacts existing | New test: a simulated lineage state where the registry/research.md don't exist yet, attempting to log `synthesis_complete`, instead logs `synthesis_incomplete` |
| REQ-002 | A lineage whose subprocess exited without a pool-settle event is force-failed within a bounded grace period, not hung forever | New test: simulate a subprocess exit with no corresponding ledger event; assert the orchestrator force-fails that worker and the overall process still settles/exits within the grace period, not indefinitely |
| REQ-003 | `reconstructResearchRegistryFromState` exists and is wired into `mergeResearchRegistries` | New test: a lineage with a fully-missing registry file but a populated `deep-research-state.jsonl` still contributes its findings to the merged output, mirroring the existing review-side test for `reconstructReviewRegistryFromState` |

### P1 — Required (complete OR user-approved deferral)

None beyond P0 for this phase — all three items are P0 given their demonstrated real-world impact (a 1h20m+ hang and a fully-lost lineage's findings, both observed directly in production use this session).
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 3 new regression tests pass; existing fan-out test suite stays green (no regression to normal-completion paths).
- **SC-002**: Re-running the exact generation-2 scenario (a lineage whose subprocess exits without writing a registry) would now either force-fail cleanly within the grace period (watchdog) or have its partial work reconstructed (registry gap) — whichever applies — rather than silently hanging or silently losing data.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Behavior change | Non-zero `lagCeilingMs` default changes existing behavior for callers relying on the current disabled-by-default watchdog | Could force-fail a worker that was actually still legitimately working past the grace period in an edge case | Set the grace period generously (e.g. several minutes past confirmed subprocess exit, not past dispatch start) so it only triggers on the specific "subprocess is gone but ledger never updated" condition this bug demonstrated, not on genuinely slow-but-alive workers |
| Judgment call | Synthesis-completion invariant must not false-positive on a lineage that legitimately found zero findings | REQ-001's test explicitly covers the "genuinely zero findings, but registry/research.md DO exist" case as a should-still-pass scenario, distinct from the "artifacts don't exist at all" failure case |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Exact grace-period duration for the post-exit watchdog (REQ-002) — pick a conservative default during implementation (e.g. 2x the configured `progressHeartbeatSeconds`, or a flat 5 minutes) and document the reasoning; not spec'd precisely here since it's an implementation-detail tuning choice, not a design fork.
<!-- /ANCHOR:questions -->

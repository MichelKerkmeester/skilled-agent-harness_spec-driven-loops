---
title: "Feature Specification: Causal Relation-Coverage Reporting Honesty"
description: "The causal relation-coverage reporter advertises an 'autonomous-causal-relation-backfill' and tells callers to run memory_health({autoRepair}) to backfill relation coverage — but no such backfill is wired (autoRepair only does FTS rebuild + orphan cleanup; relation-coverage.ts is a pure reporter; lastBackfillAt is always null). Correct this metadata-vs-code drift so memory_causal_stats reports the truth: mark the job implemented:false / command:null and have the remediation hint describe the real mechanism (post-insert enrichment on save for 'supports'; explicit memory_causal_link for typed relations)."
trigger_phrases:
  - "causal relation backfill not implemented"
  - "relation coverage misleading hint"
  - "memory_causal_stats autorepair no-op"
  - "causal graph optimize stub"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/003-memory-and-causal-runtime/019-causal-relation-coverage-honesty"
    last_updated_at: "2026-06-04T09:45:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Corrected reporter (implemented:false, command:null, honest hint); tests green"
    next_safe_action: "Commit; deploy with #2 (daemon recycle)"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/causal/relation-coverage.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/tests/relation-coverage-unit.vitest.ts"
    completion_pct: 80
    open_questions: []
    answered_questions:
      - "Full autonomous relation-inference backfill (caused/contradicts) is a scoped future feature, not built here."
---
# Feature Specification: Causal Relation-Coverage Reporting Honesty

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | In Progress |
| **Created** | 2026-06-04 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`memory_causal_stats` reports a `relationCoverage` block whose `backfillJob.command` is `memory_health({ autoRepair: true, confirmed: true })` and whose `remediationHint` says *"Run … to backfill relation coverage; prioritize caused."* A code review of the 2026-06-04 "optimize causal graph" request found this is a **no-op**: `lib/causal/relation-coverage.ts` is a pure reporter (no edge writes), and the autoRepair handler (`memory-crud-health.ts`) only does FTS rebuild + orphaned-edge/vector cleanup — it never balances relations. `lastBackfillAt` is therefore permanently `null`. Running the advertised command changes nothing, which misleads any human or agent trying to raise coverage.

### Purpose
Make the reporter tell the truth. Stop advertising the non-existent backfill; describe the real mechanism instead.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `relation-coverage.ts`: add `backfillJob.implemented: false`; set `backfillJob.command: null`; rewrite `remediationHint` to describe the real mechanism ('supports' via post-insert enrichment on save (default-on); typed relations via explicit `memory_causal_link`).
- Unit + integration test coverage for the honest contract.

### Out of Scope
- Building the actual autonomous relation-inference backfill (semantic `caused`/`contradicts` inference). That is a substantial future feature; satisfying the `caused` ≥5% target genuinely requires it and was deliberately not rushed into the just-recovered causal subsystem.
- Changing the coverage targets or the link-coverage (60%) metric.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

- R1: `relationCoverage.backfillJob.implemented === false` and `command === null`.
- R2: When below target, `remediationHint` describes the real mechanism and does NOT contain `autoRepair` / does NOT instruct running `memory_health` to backfill.
- R3: When all relation targets are met, `remediationHint` is `null`; empty graph reports `no_edges`.
- R4: `backfillJob.name` stays `autonomous-causal-relation-backfill` (documents the intended-but-unbuilt job); existing `memory_causal_stats` consumers/tests stay green.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `relation-coverage-unit.vitest.ts` asserts implemented:false / command:null, honest below-target hint, null hint when met, no_edges when empty.
- **SC-002**: `causal-stats-output.vitest.ts` asserts implemented:false / command:null + hints contain no `autoRepair`; suite green.
- **SC-003**: Daemon TS build clean; deployed; `memory_causal_stats` shows the honest hint.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A consumer parsed `backfillJob.command` as a runnable string | Broken caller | Only `handlers/causal-graph.ts` consumes the state (surfaces `remediationHint`); `command` was never executed programmatically; type widened to `string \| null`. |
| Risk | Users still expect coverage to auto-rise to 60% | Unmet expectation | Hint now states the real mechanism; full inference backfill documented as a future feature. |
| Dependency | `memory_causal_link` (typed-relation creation path) | — | Unchanged; referenced by the honest hint. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

Resolved: the full autonomous relation-inference backfill (semantic `caused`/`contradicts`) is out of scope here and recorded as a future feature; this packet only removes the misleading no-op guidance. Deploys with #2's daemon recycle.
<!-- /ANCHOR:questions -->

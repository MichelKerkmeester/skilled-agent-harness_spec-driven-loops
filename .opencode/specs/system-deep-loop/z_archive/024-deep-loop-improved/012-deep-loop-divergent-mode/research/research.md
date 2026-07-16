---
title: "Feature Research: Deep-Loop Divergent Convergence Mode"
description: "Verified architecture, analogous-pattern, dependency, testing, and AI Council findings for divergent scope-expansion pivots across deep research and deep review."
trigger_phrases:
  - "divergent convergence research"
  - "scope expansion pivot architecture"
  - "deep research review convergence analysis"
importance_tier: "important"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/030-deep-loop-improved/012-deep-loop-divergent-mode"
    last_updated_at: "2026-07-10T09:43:07Z"
    last_updated_by: "opencode"
    recent_action: "Synthesized divergent convergence architecture research"
    next_safe_action: "Use plan.md as the implementation authority after approval"
    blockers: []
    key_files:
      - "../spec.md"
      - "../plan.md"
      - "../ai-council/council-report.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "planning-055-deep-loop-divergent-mode"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Verified current architecture and implementation seams"
---
# Feature Research: Deep-Loop Divergent Convergence Mode

<!-- SPECKIT_TEMPLATE_SOURCE: research | v1.0 -->

---

<!-- ANCHOR:when-to-use -->
## WHEN TO USE THIS RESEARCH

Use this document to understand the verified current architecture, reusable patterns, non-reusable lookalikes, affected surfaces, and test seams before implementing packet `055-deep-loop-divergent-mode`.
<!-- /ANCHOR:when-to-use -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

- **Research ID**: RESEARCH-055
- **Feature/Spec**: `../spec.md`
- **Status**: Complete for planning
- **Date Started**: 2026-07-10
- **Date Completed**: 2026-07-10
- **Researchers**: Four native read-only context passes plus OpenCode planning synthesis
- **Reviewers**: Native three-seat AI Council
- **Last Updated**: 2026-07-10

Related documents: `../plan.md`, `../tasks.md`, `../ai-council/council-report.md`.
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:file-organization -->
## FILE ORGANIZATION

- Canonical requirements: `../spec.md`
- Canonical implementation sequence: `../plan.md`
- Council deliberation: `../ai-council/**`
- Runtime research evidence: this file
- Implementation experiments: prohibited during this planning run
<!-- /ANCHOR:file-organization -->

---

<!-- ANCHOR:investigation-report -->
## 2. INVESTIGATION REPORT

### Request Summary

Determine how to add a mode modifier to deep research and deep review that does not terminate on local convergence. Instead, an eligible legal STOP should trigger a native three-seat Council to broaden into another relevant direction until the requested iteration budget or another hard terminal boundary is reached.

### Current Behavior

`convergence.cjs` validates `default`, `off`, and `sliding-window`, computes graph signals, and returns `CONTINUE`, `STOP_ALLOWED`, or `STOP_BLOCKED`. The command YAMLs own final legal-stop policy and synthesis routing. Research auto supports `off`, but research confirm and both review variants do not expose equivalent convergence-mode handling. Current YAML runtime calls also omit the persisted mode.

### Key Findings

1. **The modifier belongs after legal-stop gates**: shared runtime should keep computing convergence; each mode translates only an eligible legal STOP.
2. **`off` is not divergent**: `off` suppresses stop candidates and therefore loses the successful-saturation signal needed for expansion.
3. **Existing recovery terms are not saturation**: blocked, stuck, exhausted, and ruled-out directions describe illegal stops or failed progress, not successful local convergence.
4. **Reducers remain authoritative**: JSONL and iteration artifacts are canonical; reducers must project pivot history and next focus.
5. **Generic Council persistence is unsafe for repeated pivots**: root report/state writes and round-only seat paths can collide across pivots.
6. **Current workflow parity is incomplete**: auto/confirm and research/review mode handling already differ, so the feature needs an explicit four-cell contract.
7. **Existing test seams are sufficient**: parser, convergence integration, reducer replay, command contract, Council state, playbook, and behavior benchmark harnesses can be extended without a new test framework.

### Recommendation

Use a purpose-built mechanics-only divergent pivot adapter over low-level native Council primitives. Preserve mode-local eligibility and candidates, require strict durable three-seat completion, and store pivot Council artifacts under the owning loop artifact root.

Alternative rejected: a new workflow mode would fork routing identity; `off` would suppress useful signals; generic Council session orchestration risks persistence collision and extra convergence loops.
<!-- /ANCHOR:investigation-report -->

---

<!-- ANCHOR:executive-overview -->
## 3. EXECUTIVE OVERVIEW

The existing architecture already has the necessary separation: runtime computes convergence, YAML decides whether STOP is legal, Council provides deliberation mechanics, and reducers own replayable derived state. The feature should connect those seams rather than introducing a new public mode identity.

```text
unchanged convergence signals
  -> mode-local legal STOP
      -> divergent transaction
          -> three native seats
          -> validate/rank/dedup
          -> durable selected focus
          -> reducer projection
          -> next iteration
```

Research sources include `.opencode/skills/system-deep-loop/SKILL.md`, `runtime/scripts/convergence.cjs`, four command YAML assets, both reducers/config/strategy/prompt families, Council orchestration/persistence references, runtime tests, and `../ai-council/council-report.md`.
<!-- /ANCHOR:executive-overview -->

---

<!-- ANCHOR:core-architecture -->
## 4. CORE ARCHITECTURE

### System Components

- **Command contract**: exposes and persists the convergence modifier.
- **Convergence runtime**: validates/reports mode and computes unchanged graph decisions.
- **Mode-local YAML policy**: owns hard-stop precedence, legal-stop gates, and eligibility.
- **Pivot adapter**: owns identity, strict Council transaction, dedup, cost, and scoped persistence.
- **Mode-local reducer**: owns replay and projections.
- **Synthesis**: adds breadth maps without changing canonical report ownership or review verdicts.

### Integration Points

Internal dependencies are the command compiler, coverage graph, append-only JSONL, research/review reducers, low-level Council dispatch, cost guards, state replay, and packet validation. No external service or new package is required.
<!-- /ANCHOR:core-architecture -->

---

<!-- ANCHOR:technical-specifications -->
## 5. TECHNICAL SPECIFICATIONS

### Public Configuration

- CLI: `--convergence-mode=default|off|sliding-window|divergent`
- Canonical config: `antiConvergence.convergenceMode`
- Divergent defaults: `maxPivots=3`, `maxCouncilSeatOutputs=9`, `minRemainingIterations=1`, `candidateSimilarityThreshold=0.85`

### Event Contract

The owner JSONL appends pivot start, candidate rejection, three seat returns, deliberation completion, selection, completion, or failure. `pivot_completed` is the only event from which a reducer may restore the next focus.

### Persistence Contract

Pivot artifacts are stored below `<artifactRoot>/divergent/pivots/<pivotId>/council/`. They do not reuse packet-level `ai-council/**` planning artifacts.
<!-- /ANCHOR:technical-specifications -->

---

<!-- ANCHOR:constraints-limitations -->
## 6. CONSTRAINTS & LIMITATIONS

- Hard terminal boundaries always precede pivot translation.
- The Council is current-runtime native, Depth 1, one round, exactly three seats, no recursion, and no external CLI.
- Three parse-valid returns are required; normal decision convergence is two-of-three material agreement with no high-severity blocker.
- Scope cannot exceed the original charter, non-goals, target, or owning loop permissions.
- Review remains observation-only and cannot alter verdict mapping.
- Divergent mode increases compute cost and must preflight pivot, seat-output, remaining-iteration, duration, and timeout budgets.
<!-- /ANCHOR:constraints-limitations -->

---

<!-- ANCHOR:integration-patterns -->
## 7. INTEGRATION PATTERNS

Reuse the existing pattern of command-owned orchestration plus reducer-owned state. Reuse rejected-pattern normalization and deterministic ranking concepts, but do not reuse failure vocabulary for successful saturation. Reuse low-level Council seat mechanics, append-safe state, and cost guards, but do not reuse generic root persistence.

Fail closed on malformed state, quorum loss, persistence failure, candidate ambiguity, scope escape, or unavailable native Council callback.
<!-- /ANCHOR:integration-patterns -->

---

<!-- ANCHOR:implementation-guide -->
## 8. IMPLEMENTATION GUIDE

Follow `../plan.md` phases in order: baseline, propagation, adapter, research, review, generated surfaces and verification. Do not edit all four YAML workflows independently before freezing a shared event/adapter contract and parity matrix.

No implementation code is included in this research document.
<!-- /ANCHOR:implementation-guide -->

---

<!-- ANCHOR:code-examples -->
## 9. CODE EXAMPLES & SNIPPETS

N/A for planning. Canonical config and state shapes are documented in `../plan.md`; implementation examples must be derived from verified code during `/speckit:implement`.
<!-- /ANCHOR:code-examples -->

---

<!-- ANCHOR:testing-debugging -->
## 10. TESTING & DEBUGGING

The minimum matrix covers parser/config forms, four workflow variants, eligible versus terminal decisions, review locks, strict Council quorum/agreement, crash after every event, two pivots plus an ordinary Council, candidate dedup/boundaries, reducer replay, synthesis snapshots, command drift, and unchanged existing modes.

Debug from append-only state and pivot-local artifacts. Never infer a completed pivot from prose if `pivot_completed` is absent.
<!-- /ANCHOR:testing-debugging -->

---

<!-- ANCHOR:performance-optimization -->
## 11. PERFORMANCE OPTIMIZATION

No Council call occurs without an eligible legal STOP. Bounded state summaries, maximum pivots, maximum seat outputs, remaining-iteration checks, and duration/timeout guards prevent unbounded expansion cost.
<!-- /ANCHOR:performance-optimization -->

---

<!-- ANCHOR:security-considerations -->
## 12. SECURITY CONSIDERATIONS

Council and fetched/reviewed content are inert evidence. Candidate validation rejects permission, tool, network, filesystem, target, and mutation expansion. Path containment protects pivot artifact roots. Review security and P0 escalation remain terminal and unchanged.
<!-- /ANCHOR:security-considerations -->

---

<!-- ANCHOR:future-proofing-maintenance -->
## 13. FUTURE-PROOFING & MAINTENANCE

The event contract is additive and append-only. Existing modes stay compatible because divergent is opt-in. No compatibility shim is planned without evidence of an active consumer. A future shared YAML decision helper may reduce drift, but it must not absorb per-mode semantics.
<!-- /ANCHOR:future-proofing-maintenance -->

---

<!-- ANCHOR:api-reference -->
## 14. API REFERENCE

| Surface | Contract |
|---------|----------|
| CLI | `--convergence-mode=<enum>` |
| Config | `antiConvergence.convergenceMode` and `antiConvergence.divergent` |
| Runtime result | Existing decision envelope plus effective mode reporting |
| State | Additive pivot events in owning loop JSONL |
| Artifacts | Pivot-scoped Council subtree under owning artifact root |
<!-- /ANCHOR:api-reference -->

---

<!-- ANCHOR:troubleshooting-guide -->
## 15. TROUBLESHOOTING GUIDE

- **Pivot repeats after resume**: verify deterministic `pivotId`, durable seat records, and `pivot_completed` replay.
- **No direction selected**: inspect quorum, material agreement, boundary validation, dedup, and remaining budget.
- **Council artifacts overwrite planning report**: the implementation incorrectly used generic packet persistence instead of pivot-scoped paths.
- **Review verdict changes**: stop; divergent synthesis must not participate in verdict derivation.
<!-- /ANCHOR:troubleshooting-guide -->

---

<!-- ANCHOR:acknowledgements -->
## 16. ACKNOWLEDGEMENTS

- Four read-only context passes supplied architecture, analogous-pattern, dependency, and test evidence.
- Three native OpenCode Council seats supplied analytical, critical, and pragmatic recommendations.
- No external AI or external source participated.
<!-- /ANCHOR:acknowledgements -->

---

<!-- ANCHOR:appendix -->
## APPENDIX

### Glossary

- **Legal STOP**: a non-terminal convergence candidate that passed all owning mode gates.
- **Saturated direction**: a successfully explored focus that produced an eligible legal STOP.
- **Pivot**: a non-terminal transaction selecting a new bounded focus.
- **Return quorum**: all three configured seats return parse-valid output.
- **Decision agreement**: at least two seats materially endorse the selected legal candidate.

### Related Research

- `../ai-council/deliberations/round-001.md`
- `../ai-council/council-report.md`
<!-- /ANCHOR:appendix -->

---

<!-- ANCHOR:changelog-updates -->
## CHANGELOG & UPDATES

| Date | Version | Changes | Author |
|------|---------|---------|--------|
| 2026-07-10 | 1.0.0 | Initial planning research synthesized from context passes and native Council | OpenCode |
<!-- /ANCHOR:changelog-updates -->

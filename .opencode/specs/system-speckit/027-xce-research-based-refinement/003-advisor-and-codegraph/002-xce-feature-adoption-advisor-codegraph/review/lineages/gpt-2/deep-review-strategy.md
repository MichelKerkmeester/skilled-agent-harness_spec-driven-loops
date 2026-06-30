# Deep Review Strategy: gpt-2 Lineage

<!-- ANCHOR:topic -->
## Topic

Deep review of `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/018-xce-feature-adoption-advisor-codegraph` as a phase-parent spec folder plus implemented child-phase advisor and code-graph surfaces.
<!-- /ANCHOR:topic -->

<!-- ANCHOR:review-dimensions -->
## Review Dimensions

- [x] Correctness: Phase 009 resolver behavior and exact-match fallback semantics reviewed.
- [x] Security: provenance guard, default-off shadow calibration, tombstone gating, and trace payload surfaces reviewed.
- [x] Traceability: parent/child spec state, checked completion claims, and phase scope alignment reviewed.
- [x] Maintainability: source comment hygiene and review-scope drift reviewed.
<!-- /ANCHOR:review-dimensions -->

<!-- ANCHOR:completed-dimensions -->
## Completed Dimensions

| Iteration | Dimension | Verdict | Notes |
|-----------|-----------|---------|-------|
| 001 | correctness | CONDITIONAL | Found F002 against Phase 009 resolver scope. |
| 002 | security | PASS | No new P0/P1 security issues found in bounded pass. |
| 003 | traceability, maintainability | CONDITIONAL | Found F001 parent-state drift and F003 comment-hygiene advisory. |
<!-- /ANCHOR:completed-dimensions -->

<!-- ANCHOR:running-findings -->
## Running Findings

| Severity | Active | Finding IDs |
|----------|--------|-------------|
| P0 | 0 | - |
| P1 | 2 | F001, F002 |
| P2 | 1 | F003 |
<!-- /ANCHOR:running-findings -->

<!-- ANCHOR:what-worked -->
## What Worked

- Cross-checking phase child specs against implementation summaries exposed scope narrowing that tests alone would not flag.
- Grep over BM25 symbols confirmed there is no context-handler resolver integration outside `handlers/query.ts`.
<!-- /ANCHOR:what-worked -->

<!-- ANCHOR:what-failed -->
## What Failed

- Code Graph MCP tooling was unavailable in this runtime, so structural checks used Grep/Read fallback only.
- The parent packet lacks a resource-map.md, so resource-map coverage gate was not applicable.
<!-- /ANCHOR:what-failed -->

<!-- ANCHOR:exhausted-approaches -->
## Exhausted Approaches

- Searched `system-code-graph/mcp_server` for BM25/context integration and found resolver use only in `handlers/query.ts` and tests.
<!-- /ANCHOR:exhausted-approaches -->

<!-- ANCHOR:ruled-out-directions -->
## Ruled-Out Directions

- No finding recorded for exact-match behavior regression: query resolution still tries symbolId, fq_name, and name before BM25 suggestions.
- No P0 security finding recorded: reviewed opt-in persistence and provenance paths are gated by env/intent and did not show a direct exploit path in this pass.
<!-- /ANCHOR:ruled-out-directions -->

<!-- ANCHOR:next-focus -->
## Next Focus

Remediate or adjudicate F001 and F002. If Phase 009 intentionally narrowed scope, update `spec.md`/tasks to remove ambiguous/context-seed requirements; otherwise add implementation and tests for those paths.
<!-- /ANCHOR:next-focus -->

<!-- ANCHOR:known-context -->
## Known Context

- `resource-map.md not present. Skipping coverage gate`.
- Parent `graph-metadata.json` has `derived.status: planned` and `last_active_child_id: null` while child implementation summaries report completed work.
- Memory trigger lookup rejected the fanout session id as non-server-managed; review state uses the requested id only in local lineage artifacts.
<!-- /ANCHOR:known-context -->

<!-- ANCHOR:cross-reference-status -->
## Cross-Reference Status

| Protocol | Level | Status | Evidence | Notes |
|----------|-------|--------|----------|-------|
| spec_code | core | partial | F001, F002 | Parent scaffold-only claims and Phase 009 resolver scope are not reconciled with implementation. |
| checklist_evidence | core | partial | F002 | Checked Phase 009 completion evidence proves unresolved fallback, not the broader ambiguous/context-seed wording. |
| feature_catalog_code | overlay | partial | F001 | Parent feature catalog status remains planned despite child completion evidence. |
| playbook_capability | overlay | skipped | n/a | No playbook-specific artifact found in bounded pass. |
<!-- /ANCHOR:cross-reference-status -->

<!-- ANCHOR:files-under-review -->
## Files Under Review

| File | Coverage | Notes |
|------|----------|-------|
| `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/018-xce-feature-adoption-advisor-codegraph/spec.md` | reviewed | F001 parent-state drift. |
| `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/018-xce-feature-adoption-advisor-codegraph/graph-metadata.json` | reviewed | F001 stale metadata evidence. |
| `009-codegraph-bm25-symbol-resolver/spec.md` | reviewed | F002 scope evidence. |
| `009-codegraph-bm25-symbol-resolver/implementation-summary.md` | reviewed | F002 narrowing evidence. |
| `009-codegraph-bm25-symbol-resolver/tasks.md` | reviewed | F002 checklist evidence. |
| `.opencode/skills/system-code-graph/mcp_server/handlers/query.ts` | reviewed | F002 and F003 evidence. |
| `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-context.ts` | reviewed | F002 absence-of-integration evidence. |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/cross-skill-edges/apply-graph-metadata-patch.ts` | reviewed | Security pass. |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/feedback-calibration.ts` | reviewed | Security pass. |
<!-- /ANCHOR:files-under-review -->

<!-- ANCHOR:review-boundaries -->
## Review Boundaries

- Max iterations: 3.
- Artifact root bound directly to `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/018-xce-feature-adoption-advisor-codegraph/review/lineages/gpt-2` per fanout override.
- Writes restricted to the lineage artifact directory.
- Target files were read-only.
<!-- /ANCHOR:review-boundaries -->

## Non-Goals

- No code or spec remediation performed.
- No writes outside the lineage artifact directory.

## Stop Conditions

- Stopped at `config.maxIterations: 3` with all dimensions covered but active P1 findings remaining.

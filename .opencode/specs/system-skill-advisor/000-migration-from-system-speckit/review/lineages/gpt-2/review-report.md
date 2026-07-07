# Deep Review Report: gpt-2 Detached Lineage

## Executive Summary

Verdict: **CONDITIONAL**

The detached `gpt-2` lineage reached `maxIterations=20`. No P0 blocker was found. Two active P1 traceability findings remain because canonical packet surfaces disagree about whether the migration is complete or still awaiting review execution. Three P2 advisories remain for stale status/wording surfaces.

Scope: `.opencode/specs/system-skill-advisor/000-migration-from-system-speckit` plus parent track surfaces needed to verify the packet's current-state claims.

Counts: P0=0, P1=2, P2=3. `hasAdvisories=true`.

## Planning Trigger

Route to remediation planning or a focused doc-sync patch before declaring the packet fully closed. The remaining work is small but stateful: synchronize `plan.md`, continuity frontmatter, generated status, and track map wording with the completed implementation summary.

## Active Finding Registry

### F001 - P1 - plan.md still marks completed migration work as pending

Evidence: `plan.md` Definition of Done still has unchecked core items for moved folders, cross-reference rewrites, validation, and docs reconciliation [SOURCE: .opencode/specs/system-skill-advisor/000-migration-from-system-speckit/plan.md:61]. `tasks.md` says all criteria except deferred T031 are complete [SOURCE: .opencode/specs/system-skill-advisor/000-migration-from-system-speckit/tasks.md:119], and `implementation-summary.md` reports `completion_pct: 100` [SOURCE: .opencode/specs/system-skill-advisor/000-migration-from-system-speckit/implementation-summary.md:25].

Impact: resume/completion readers can incorrectly treat the migration as unfinished.

### F002 - P1 - frontmatter continuity still tells resume to dispatch a review loop

Evidence: canonical docs still say `next_safe_action: "Dispatch the /deep:review 20-iteration loop"` and `completion_pct: 0` [SOURCE: .opencode/specs/system-skill-advisor/000-migration-from-system-speckit/spec.md:17] [SOURCE: .opencode/specs/system-skill-advisor/000-migration-from-system-speckit/checklist.md:16] [SOURCE: .opencode/specs/system-skill-advisor/000-migration-from-system-speckit/decision-record.md:15]. `implementation-summary.md` says no action remains except deferred scoped indexing [SOURCE: .opencode/specs/system-skill-advisor/000-migration-from-system-speckit/implementation-summary.md:15].

Impact: continuity recovery can route future sessions back into an obsolete review loop.

### F003 - P2 - graph metadata status still says in_progress

Evidence: `graph-metadata.json` has `derived.status: "in_progress"` [SOURCE: .opencode/specs/system-skill-advisor/000-migration-from-system-speckit/graph-metadata.json:43], while `implementation-summary.md` says the packet is complete [SOURCE: .opencode/specs/system-skill-advisor/000-migration-from-system-speckit/implementation-summary.md:25].

### F004 - P2 - parent track phase map lists 000 as In Progress

Evidence: parent track phase map lists `000-migration-from-system-speckit/` as `In Progress` [SOURCE: .opencode/specs/system-skill-advisor/spec.md:95], while the tracking packet reports completion [SOURCE: .opencode/specs/system-skill-advisor/000-migration-from-system-speckit/implementation-summary.md:25].

### F005 - P2 - checklist says clean while documenting accepted non-zero errors

Evidence: `checklist.md` says `validate.sh --strict --recursive` is clean on `system-skill-advisor/` while the same line records `Errors: 2` accepted limitations [SOURCE: .opencode/specs/system-skill-advisor/000-migration-from-system-speckit/checklist.md:67]. `implementation-summary.md` uses clearer accepted-error wording [SOURCE: .opencode/specs/system-skill-advisor/000-migration-from-system-speckit/implementation-summary.md:91].

## Remediation Workstreams

1. Current-state synchronization: update `plan.md` DoD and phase checkboxes, or mark them historical if that is the intended convention.
2. Continuity synchronization: update frontmatter continuity in `spec.md`, `plan.md`, `checklist.md`, and `decision-record.md` to match `implementation-summary.md`.
3. Metadata/navigation polish: refresh `graph-metadata.json` status and parent track phase map row for `000`.
4. Verification wording polish: replace "clean" wording with "accepted known errors" where non-zero errors are intentionally tolerated.

## Spec Seed

If this becomes a follow-up spec, seed it as: "Synchronize current-state and continuity surfaces for `system-skill-advisor/000-migration-from-system-speckit` after completion, without altering migration content or moving additional folders."

## Plan Seed

- Read `implementation-summary.md` as the source of truth for final state.
- Patch stale checkboxes/status lines in `plan.md` and parent track `spec.md`.
- Patch `_memory.continuity` blocks to `completion_pct: 100` and `next_safe_action: None required; deferred scoped memory_index_scan remains`.
- Refresh `graph-metadata.json` through the project metadata tooling if allowed by the parent workflow.
- Re-run strict validation on the tracking packet.

## Traceability Status

| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | partial | hard | plan.md:61, implementation-summary.md:25 | Current-state surfaces disagree. |
| checklist_evidence | partial | hard | checklist.md:67, implementation-summary.md:91 | Evidence exists, but wording overstates clean validation. |
| feature_catalog_code | pass | advisory | context-index.md:16-40 | Migration bridge documents moved homes. |
| playbook_capability | not_applicable | advisory | N/A | No playbook capability target. |

## Deferred Items

- Scoped `memory_index_scan` remains deferred as already documented [SOURCE: .opencode/specs/system-skill-advisor/000-migration-from-system-speckit/tasks.md:110].
- Parent-track recursive validation warnings were observed but not escalated because the target packet itself validates with Errors: 0 / Warnings: 0, and broader parent debt is already documented.

## Audit Appendix

Stop reason: `maxIterationsReached`.

Iteration count: 20.

Dimension coverage: correctness, security, traceability, maintainability.

Convergence telemetry: new findings appeared in iterations 001, 004, and 007; iterations 008-020 were stabilization/replay passes with `newFindingsRatio=0.00`.

Validation evidence read during review: target packet strict validation reported Errors: 0 / Warnings: 0; recursive parent-track validation still reports accepted or pre-existing broader debt.

Memory trigger caveat: `memory_match_triggers` rejected the detached fan-out session id as non-server-managed, and retry without session id timed out. The lineage relied on disk artifacts and direct reads.

Final verdict: CONDITIONAL

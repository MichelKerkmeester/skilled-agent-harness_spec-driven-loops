# Deep Review Strategy — p017c006-opus

## Topic

Review of phase 006 `command-contract-structural`: the `/memory:search` deterministic arg-resolution header + salience inversion (O1). Fan-out lineage `p017c006-opus`, executor cli-claude-code / claude-opus-4-8, maxIterations=1.

## Review Dimensions

- [x] Correctness — verdict: one P1 facet (glob/metachar corruption) + one P2 (routing hijack)
- [x] Security — verdict: one P1 (outer-shell injection sink, operator-trusted input)
- [x] Traceability — verdict: spec_code partial; one P2 (unpopulated scaffolds + stale continuity)
- [x] Maintainability — verdict: covered via F002; no additional findings

## Completed Dimensions

| Dimension | Iteration | Verdict summary |
|-----------|-----------|-----------------|
| correctness | 1 | CONDITIONAL — F001 (glob facet), F003 advisory |
| security | 1 | CONDITIONAL — F001 injection sink, P1 (trusted input → not P0) |
| traceability | 1 | F002 P2; spec_code partial (no populated requirements) |
| maintainability | 1 | F002 P2 (doc completeness); no further findings |

## Running Findings

- P0: 0
- P1: 1 (F001)
- P2: 2 (F002, F003)
- Provisional verdict: CONDITIONAL

## What Worked

- Isolating the O1/006 diff via `git show eac1eb5ef8` separated phase-006 deliverables from the layered phase-007/O2 surface-parity content present in the working tree, keeping the review in scope.
- Tracing the shell header's root cause through the impl-summary's own word-split caveat (#7) surfaced the unaddressed sibling expansions (glob, command-substitution) from the same outer-shell phase.

## What Failed

- Live shell demonstration of glob/metachar corruption was sandbox-blocked; relied on established shell semantics + the impl-summary's documented raw-substitution behavior instead.

## Exhausted Approaches

- Live execute-rate A/B on Kimi/MiMo — out of scope for read-only review and is the packet's own documented follow-up.

## Ruled Out Directions

- Salience-inversion / no-ask gating logic: control flow §0→§2→§3/§4/§5 + presentation §1 is coherent; no finding.
- `"$*"` space-collapsing and inner double-quote escaping: cosmetic / correct; no finding.

## Next Focus

Single-iteration loop reached maxIterations. If continued: confirm the command-renderer's `$ARGUMENTS` substitution semantics (quoted vs raw) to lock F001 severity; decide whether F002 metadata cleanup is in-scope for 006 or deferred.

## Known Context

- Resource map: `resource-map.md not present. Skipping coverage gate`.
- Target is a Level 1 packet; authoritative record is `implementation-summary.md` (accurate, completion_pct 100).
- Working tree carries both O1 (006) and O2 (007) commits on the two command files; only O1 deliverables were in scope.

## Cross-Reference Status

### Core (hard)
- `spec_code`: partial — spec.md has no populated requirements; behavior traced to impl-summary + diff.
- `checklist_evidence`: N/A — Level 1, no checklist.md.

### Overlay (advisory)
- `feature_catalog_code`: N/A in scope.
- `playbook_capability`: N/A in scope.

## Files Under Review

| File | Coverage | Notes |
|------|----------|-------|
| `.opencode/commands/memory/search.md` | full | §0 header (F001), §4 routing (F003), §2/§3/§5 gating ruled-out |
| `.opencode/commands/memory/assets/search_presentation.txt` | full | §1 gating consistent; no finding |
| `006-…/spec.md` | full | unpopulated scaffold (F002) |
| `006-…/plan.md` | full | unpopulated scaffold (F002) |
| `006-…/tasks.md` | full | unpopulated scaffold (F002) |
| `006-…/implementation-summary.md` | full | accurate; authoritative record |

## Review Boundaries

- maxIterations: 1
- convergenceThreshold: 0.10
- severityThreshold: P2
- Target files READ-ONLY; no code modified.

## Non-Goals

- Phase 007/O2 surface-parity content (score mandate, surface-parity clause, named optional fields).
- Live model execute-rate measurement.

## Stop Conditions

- maxIterations (1) reached after a full-dimension converging pass.

# Deep Review Strategy: 028-governance-rollout

## Topic
Review of the `028-governance-rollout` phase folder: a Level 2 spec-folder that authors the governance and rollout layer (rollout sequence, four-beat migration runbook, safety model, measurement plan, NO-GO list) for the 005 data-quality program. The phase is in **PLANNED** status — the five governance deliverables are specified but NOT yet authored. The review scope is therefore the planning scaffold (spec.md, plan.md, tasks.md, checklist.md, implementation-summary.md) and its alignment to the parent research source and referenced external surfaces.

## Review Dimensions
- [ ] correctness — internal coherence of the planning docs, count arithmetic, edge logic
- [ ] security — NFR-S01 (no new write path / trust boundary), CI-never-auto-commits rationale
- [ ] traceability — spec_code + checklist_evidence; research seam citations; external reference accuracy
- [ ] maintainability — doc structure, grounding, cross-reference resolvability, convention adherence

## Completed Dimensions
_(none yet)_

## Running Findings
- P0: 0
- P1: 0
- P2: 0

## What Worked
_(populated per iteration)_

## What Failed
_(populated per iteration)_

## Exhausted Approaches
_(none)_

## Ruled-Out Directions
_(none yet)_

## Next Focus
Iteration 1: correctness — verify the seventeen-stage / seven-phase / five-edge / eighteen-NO-GO arithmetic is internally consistent and that the topological-sort claims hold against the cited research seams.

## Known Context
- Target is PLANNED: `implementation-summary.md` states "Nothing has shipped yet. This phase is PLANNED and scaffolded only." No governance deliverable exists. All checklist items `[ ]`, all tasks `[ ]`. This is an honest, non-contradictory completion state — there are no false completion claims to flag.
- Parent research source: `.opencode/specs/system-speckit/004-memory-search-intelligence/002-spec-data-quality/research/research.md` (one directory ABOVE the phase folder; the phase docs cite it as `research/research.md` which does not resolve relative to the phase folder).
- Verified research seams (read 2026-06-21): §5 governance layer = lines 104-118 ✓; Tier-D NO-GO table = lines 55-66 (10 items) ✓; novel NO-GO rewrites = lines 83-85 (3 strict NO-GO) ✓; INV-1/INV-2 = line 110 ✓.
- External reference checks: `legacy_grandfathered` present in validate.sh (3 hits) ✓; `validator-registry.json` exists ✓; `run-eval-v2.mjs` actually at `mcp_server/scripts/evals/` (plural) NOT the spec-cited `scripts/eval/` (singular); `computeAuthoredDocQuality` exists only in research + sibling 026 + this spec prose, NOT in shipped code (forward reference to sibling A1 work).
- resource-map.md not present at the spec folder. Skipping coverage gate.

## Cross-Reference Status
### Core (hard-gated)
- [ ] spec_code — normative spec claims vs shipped behavior / referenced surfaces
- [ ] checklist_evidence — `[x]` marks vs evidence (none checked; PLANNED)

### Overlay (advisory, scheduled if applicable)
- [ ] feature_catalog_code — N/A-likely (no catalog claim for this governance phase)
- [ ] playbook_capability — N/A-likely (no playbook scenario)

## Files Under Review
| File | Coverage | Notes |
|------|----------|-------|
| spec.md | pending | Level 2 spec, 5 REQs, 18-item NO-GO target |
| plan.md | pending | 5-doc build approach, affected surfaces |
| tasks.md | pending | T001-T012, all pending |
| checklist.md | pending | 12 P0 / 13 P1 / 1 P2, all unchecked |
| implementation-summary.md | pending | PLANNED status, honest |
| description.json | pending | metadata |
| graph-metadata.json | pending | status: draft |

## Review Boundaries
- maxIterations: 6
- convergenceThreshold: 0.10 (rollingStopThreshold 0.08)
- minStabilizationPasses: 1
- Target files are READ-ONLY. Observation only, no code/doc changes to the target.
- The five governance deliverables do not exist yet; findings about them are necessarily about the SPEC of them, not shipped content.

## Non-Goals
- Reviewing the eighteen sibling phase specs (out of this phase's scope).
- Auditing shipped governance-document content (none exists).
- Implementing fixes (review is report-only).

## Stop Conditions
- All 4 dimensions covered with ≥1 stabilization pass AND core traceability protocols run AND no active P0.
- OR maxIterations (6) reached.

# Deep Review Strategy — 007-output-surface-parity (lineage p017c007-opus)

## Topic
Review the shipped contract phase that makes `/memory:search` rendered output comparable across models and surfaces: one score (`similarity`), one scale (0–1), one name, two decimals, mandated on every surface, with named optional trailing fields. Target files: `.opencode/commands/memory/search.md` and `.opencode/commands/memory/assets/search_presentation.txt`. Committed at `254289251a`.

## Review Dimensions
- [x] Correctness — contract internal consistency, render math, exemption logic
- [x] Security — input handling / trust boundaries (markdown contract; pre-existing §0 shell only)
- [x] Traceability — spec_code + checklist_evidence vs shipped behavior and impl-summary citations
- [x] Maintainability — completion-metadata hygiene, doc scaffolding state

## Completed Dimensions
- [x] Correctness → PASS (router/asset mandates agree; render math `79.44/100→0.79` correct; empty-result exemption sound)
- [x] Security → PASS (N/A — markdown contract; no new executable surface; §0 `bash -c` arg join is prior O1 work, unchanged this phase)
- [x] Traceability → CONDITIONAL-LOCAL (P2): spec/plan/tasks are unfilled scaffolds; impl-summary citations verified accurate
- [x] Maintainability → PASS-with-advisory (P2): completion-metadata mismatch (graph-metadata Status=planned vs impl-summary 100%/committed)

## Running Findings
- P0: 0
- P1: 0
- P2: 2 (F001 traceability scaffold gap, F002 completion-metadata mismatch)
- Provisional verdict: PASS (hasAdvisories=true)

## What Worked
- Cross-file grep + direct read of both contract files confirmed each impl-summary claim with exact line evidence.
- Git log confirmed commit lineage (O1 structural → O2 contract) matching impl-summary's "built on prior committed phase".

## What Failed
- N/A (single-iteration fan-out lineage)

## Exhausted Approaches
- N/A

## Ruled-Out Directions
- Escalating the scaffold/metadata gaps to P1/CONDITIONAL: ruled out — the shipped deliverable (the contract) is correct, internally consistent, and validate.sh --strict passed per impl-summary; the gaps are documentation/metadata hygiene on a Level 1 contract-only packet, non-blocking for the deliverable.

## Next Focus
- None remaining (maxIterations=1 reached → synthesis). If continued: refill spec/plan/tasks from impl-summary and reconcile graph-metadata Status.

## Known Context
- Level 1 contract-only phase (markdown edits to 2 files). resource-map.md ABSENT at spec folder → `resource-map.md not present. Skipping coverage gate`.
- Phase 7 of 7 in 017-search-and-output-intelligence-implementation; predecessor 006-command-contract-structural (O1) owns §0 arg-resolution / salience inversion / startup gating (untouched here).

## Cross-Reference Status
### Core (hard)
- `spec_code`: PARTIAL — shipped contract behavior is real and verifiable, but spec.md carries no real REQ/SC to anchor normative claims (scaffold placeholders). impl-summary serves as the de-facto spec.
- `checklist_evidence`: N/A — Level 1, no checklist.md required/present.

### Overlay (advisory)
- `feature_catalog_code`: N/A — no catalog claim in scope.
- `playbook_capability`: N/A — no playbook scenario in scope.

## Files Under Review
| File | Coverage | State |
|------|----------|-------|
| `.opencode/commands/memory/search.md` | full | reviewed — mandates present, citations accurate |
| `.opencode/commands/memory/assets/search_presentation.txt` | full | reviewed — mandates present, render example consistent |
| spec.md / plan.md / tasks.md | full | reviewed — unfilled template scaffolds (F001) |
| graph-metadata.json / description.json | full | reviewed — completion-metadata mismatch (F002) |

## Review Boundaries
- maxIterations: 1 | convergenceThreshold: 0.10 | severityThreshold: P2
- Observation-only; target files read-only; no WebFetch; LEAF (no sub-dispatch).

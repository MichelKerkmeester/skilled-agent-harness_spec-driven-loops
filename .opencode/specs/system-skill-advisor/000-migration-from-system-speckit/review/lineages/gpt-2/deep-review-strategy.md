# Deep Review Strategy

## Topic
Review target: `.opencode/specs/system-skill-advisor/000-migration-from-system-speckit`.

## Review Dimensions
- [x] correctness
- [x] security
- [x] traceability
- [x] maintainability

## Completed Dimensions
- correctness: No current path/children evidence was found that contradicts the migration completion claim for sampled live JSON metadata.
- security: N/A for this spec-folder migration; no secrets, auth, or executable trust boundary was in scope.
- traceability: Active P1/P2 doc-state drift found across plan, continuity frontmatter, checklist, graph metadata, and track map.
- maintainability: Stale completion state raises resume/navigation risk but no runtime-code defect.

## Running Findings
- P0: 0
- P1: 2
- P2: 3

## What Worked
- Direct reads of canonical packet docs exposed contradictory current-state surfaces.
- Targeted Grep for old-path fragments found sampled hits only in historical manifest/provenance prose, not live JSON metadata.
- Strict validation confirmed the tracking folder itself passes with `Errors: 0` and `Warnings: 0`, while recursive parent-track validation still has broader accepted/pre-existing debt.

## What Failed
- Memory trigger lookup could not bind the detached fan-out session id because it is not a server-managed memory session; retry without session id timed out. The review therefore used file-based context only.
- Convergence was treated as telemetry only per `stopPolicy=max-iterations`; the loop continued through 20 passes.

## Exhausted Approaches
- Old-path sample search across `.md`, `.json`, and `.jsonl` under `.opencode/specs`.
- Root and packet metadata comparison between tracking docs, track root docs, and generated metadata.
- Strict validation on the target tracking folder and touched parent tracks.

## Ruled-Out Directions
- No finding was filed for historical references in the migration manifest or ADR because those intentionally describe source paths.
- No finding was filed for the deferred `memory_index_scan`; it is explicitly documented as a P2 deferral.
- No finding was filed for parent-track recursive warnings that are already documented as accepted or broader pre-existing debt.

## Next Focus
Synthesis complete. Remediation should reconcile the stale packet state surfaces before future resume or completion checks rely on this packet.

## Known Context
- `resource-map.md` is absent in the target packet; resource-map coverage gate is skipped.
- `tasks.md` and `implementation-summary.md` claim the migration is complete.
- `plan.md`, frontmatter in several docs, `graph-metadata.json`, and the track root phase map still expose stale in-progress or pre-review state.

## Cross-Reference Status
| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | partial | hard | `plan.md:61`, `implementation-summary.md:25` | Normative completion surfaces disagree. |
| checklist_evidence | partial | hard | `checklist.md:67`, `implementation-summary.md:91` | Checklist records accepted non-zero errors while labeling the check clean. |
| feature_catalog_code | pass | advisory | `context-index.md:16-40` | Migration bridge lists moved homes; sampled stale live JSON search did not find old-path hits. |
| playbook_capability | not_applicable | advisory | N/A | No playbook capability target in this spec-folder review. |

## Files Under Review
| File | Coverage | Notes |
|------|----------|-------|
| `spec.md` | reviewed | stale continuity and in-progress metadata |
| `plan.md` | reviewed | stale pending DoD and phase checkboxes |
| `tasks.md` | reviewed | completion baseline |
| `checklist.md` | reviewed | verification wording and evidence baseline |
| `decision-record.md` | reviewed | stale continuity frontmatter |
| `implementation-summary.md` | reviewed | completion baseline |
| `graph-metadata.json` | reviewed | stale status |
| `system-skill-advisor/spec.md` | reviewed | stale phase map for 000 |

## Review Boundaries
- Max iterations: 20.
- Stop policy: max-iterations.
- Artifact directory: `review/lineages/gpt-2`.
- Target files read-only; only lineage artifacts were written.

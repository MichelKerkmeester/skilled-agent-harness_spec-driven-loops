# Iteration 4: Maintainability and Handoff Safety

## Dispatcher

- Budget profile: verify
- Dimension: maintainability
- Prior active findings: F001-F003 (all P1)
- Search mode: graphless fallback using direct reads and exact packet-local searches

## Files Reviewed

- Phase 004 canonical documents: `004-retrieval-substrate/spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, and `implementation-summary.md`
- Phase 004 path contract: `004-retrieval-substrate/spec.md:104-112`, `tasks.md:79-140`, and `decision-record.md:131-135,183,230,277,324`
- Packet-wide malformed-marker and placeholder searches across canonical Markdown documents

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **Phase 004 canonical documents retain orphan transport closing tags** -- `.opencode/specs/sk-design/011-sk-design-styles-utilization/004-retrieval-substrate/spec.md:283-284` -- All six phase-004 canonical documents end with an unmatched `</content>` token, and `spec.md` also ends with unmatched `</invoke>`. Exact packet-wide search found no corresponding opening tags and no such residue in the other implementation phases. The strict spec validator accepts these opaque lines, so they persist as rendered noise and can be mistaken for document structure by downstream extraction.
   - Finding class: artifact-hygiene
   - Scope proof: exact searches covered every Markdown file under the phase parent and located all seven malformed tokens only in phase 004.
   - Affected surface hints: phase 004 Markdown rendering, anchor extraction, routed context ingestion
   - Recommendation: remove the seven orphan transport tags and add a narrow malformed-wrapper check to document validation.

2. **Phase 004 handoff truncates the task queue before two governance tasks** -- `.opencode/specs/sk-design/011-sk-design-styles-utilization/004-retrieval-substrate/implementation-summary.md:144-149` -- The implementation summary tells the next executor to implement T001-T028, while `tasks.md:139-140` defines T029 for one-ADR-per-module authority mapping and T030 for ADR promotion after validation. The summary separately mentions promotion but still presents the bounded task range as the implementation queue, making T029 easy to omit and leaving the handoff inconsistent with the authoritative task list.
   - Finding class: handoff-consistency
   - Scope proof: exact task-id search compared the only bounded T001-TNN handoff range with all task definitions in phase 004.
   - Affected surface hints: phase 004 resume handoff, ADR governance, task completion reconciliation
   - Recommendation: change the summary range to T001-T030 or avoid duplicating the task bounds and point to `tasks.md` as authoritative.

## Findings - Refreshed

- F001 remains P1: parent and completed research-child continuity still routes resume toward phase 001 instead of the phase-004 frontier.
- F002 remains P1: phase 006 still lacks an enforceable pre-prompt injection gate despite the upstream fixture requirement.
- F003 remains P1: six implementation checklist summary tables still disagree with their live P0/P1/P2 rows.

## Candidate Search Ledger

| ID | Bug class | Disposition | Evidence |
|----|-----------|-------------|----------|
| SL-008 | artifact_hygiene | finding F004 | phase 004 document endings and packet-wide exact search |
| SL-009 | queue_consistency | finding F005 | `implementation-summary.md:144-149`, `tasks.md:139-140` |
| SL-010 | path_precision | ruled out | `spec.md:104-112` and task file targets agree on proposed paths |
| SL-011 | authority_duplication | ruled out | plan summaries and ADR implementation paths preserve the same authority split |

## Edge Cases

- `TBD` verification dates in phases 009-010 are explicitly labeled planned-scaffold state, not unresolved implementation residue.
- Proposed engine paths do not exist yet by design; each is labeled NEW/proposed and is consistent across spec, plan, tasks, and ADRs.
- Repeated anti-slop and authority statements are deliberate invariant restatements, not conflicting definitions.

## Confirmed-Clean Surfaces

- Phase 004 proposed file paths are internally consistent across its specification, plan, task queue, and ADR implementation sections.
- T001-T030 form a complete dependency queue; the defect is limited to the duplicated bounded range in the handoff summary.
- No malformed transport markers were found in implementation phases 005-010.

## Next Focus

- Dimension: stabilization
- Focus area: replay every active finding against current evidence and search for adjacent variants without opening a new scope.
- Reason: all configured dimensions now have evidence; legal convergence requires consecutive iterations without new P0/P1 findings.
- Required evidence: active-finding replay, exact adjacent-variant searches, candidate coverage, and final core-protocol status.

## Verdict

F001-F003 remain active P1 findings. F004-F005 are new P2 maintainability findings. No new P0/P1 finding was introduced.

Review verdict: CONDITIONAL

---
title: "Decision Record: Edge-Confidence and Seeded-PPR Revisit Review Remediation"
description: "ADR for how flag-off reads should treat differentiated confidence metadata persisted by a prior flag-on scan (REQ-006 / finding 6 / Q-001)."
trigger_phrases:
  - "edge confidence review remediation decisions"
  - "rollback cleanliness adr"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/002-code-graph/011-edge-confidence-review-remediation"
    last_updated_at: "2026-07-01T17:09:48.000Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Resolved Q-001 and drafted ADR-001"
    next_safe_action: "Dispatch T001-T006 implementation"
    blockers: []
    key_files: ["decision-record.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-01-011-edge-confidence-review-remediation"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Q-001: flag-off reads must normalize/ignore persisted differentiated confidence, treating it as the legacy uniform tier. See ADR-001."
---
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
# Decision Record: Edge-Confidence and Seeded-PPR Revisit Review Remediation

<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Flag-off reads normalize persisted differentiated confidence, they do not trust it

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-01 |
| **Deciders** | User, Claude Sonnet 5 |

---

<!-- ANCHOR:adr-001-context -->
### Context

Finding 6 from the 20-iteration deep review (iteration 19) showed that once `SPECKIT_CODE_GRAPH_EDGE_CONFIDENCE_DIFFERENTIATION` has ever been enabled for a scan, the differentiated confidence values it wrote stay in the database. Flag-off ranking (`rankContextEdges`/`contextEdgeReliability`), trace output, and the blast-radius dependency filter all read `metadata.confidence`/`metadata.evidenceClass` unconditionally, with no check of the CURRENT flag state. Turning the flag back off does not restore the pre-flag-on ranking behavior for any edge that was touched by the flag-on scan. Iteration 19 also confirmed a related risk: because scans persist one file at a time, an interrupted flag-on scan can leave a genuinely mixed-state database (some files differentiated, some still legacy uniform).

### Constraints

- The packet's own stated goal, repeated across spec.md/plan.md/implementation-summary.md, is that both new flags are default-off and produce zero behavior change when off. That claim is currently false once a DB has ever been touched by a flag-on scan.
- No DB migration or backfill script exists or is planned for this remediation; whatever fix is chosen must work against existing rows without a schema change.
- The fix must not add meaningful cost to the flag-off read path, since `rankContextEdges` and the blast-radius filter run on every request.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: when `SPECKIT_CODE_GRAPH_EDGE_CONFIDENCE_DIFFERENTIATION` is off, every confidence/evidence-class consumer on the read path (`contextEdgeReliability`, the `why_included` trace formatter, the `code_graph_query` relationship classifier, and the scan-enrichment classifier) treats the edge as if it always carried the legacy uniform tier (`0.8/INFERRED/heuristic`), ignoring whatever is actually persisted in `metadata.confidence`/`metadata.evidenceClass`. The stored value is not read, not trusted, and not migrated -- it is simply irrelevant while the flag is off.

**How it works**: Each read-side consumer gains one cheap flag check (`isCodeGraphEdgeConfidenceDifferentiationEnabled()`) at the point it currently reads `metadata.confidence`/`metadata.evidenceClass`; when the flag is false, it substitutes the legacy constant instead of the persisted value. No write path changes, no migration, no backfill. A mixed-state DB (from an interrupted flag-on scan) is handled the same way: with the flag off, every edge reads as legacy uniform regardless of what got persisted; with the flag on, whatever was actually written is used as-is (this is the pre-existing, already-understood behavior for a mixed-state DB while the flag is on, unchanged by this ADR).
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Normalize at read time when flag is off (chosen)** | Delivers the packet's own stated "zero behavior change when off" guarantee unconditionally, no matter DB history; no migration needed; cheap (one flag check per read). | Read-side consumers must all be updated consistently, or the fix is incomplete (mitigated by the same consumer inventory this remediation already built for REQ-005). | 9/10 |
| Redefine the contract: persisted confidence is canonical once written, independent of the flag | No code change needed. | Directly contradicts the packet's own stated goal; leaves a real, silent trap for any operator who tries the flag once and turns it off, with no way to detect the residual effect short of a full reindex. | 2/10 |
| Add a migration/backfill step that rewrites differentiated confidence back to uniform when the flag is disabled | Would make the DB itself consistent with the flag state, not just reads. | Requires a new migration path this packet never scoped or tested; over-engineered for the actual problem (reads are the only thing that need to behave correctly); adds a write-side side effect to what should be a pure flag toggle. | 4/10 |

**Why this one**: It is the smallest change that makes the packet's own existing claim true, it needs no new migration machinery, and it composes cleanly with the consumer inventory REQ-005 already requires for the AMBIGUOUS-classification fix.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- "Both flags default-off, zero behavior change" becomes true in every case, not just for a DB that has never been touched by a flag-on scan.
- Operators can safely experiment with the flag on a scratch DB and turn it off with a real guarantee of returning to prior behavior.

**What it costs**:
- Every read-side confidence/evidence-class consumer needs the same flag check added consistently. Mitigation: the consumer inventory already required by REQ-005 covers the same call sites; extend it to also verify the new flag-off substitution at each site.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A consumer is missed, leaving one flag-off read path still trusting stale persisted confidence | H | Re-run the same scoped grep for `metadata.confidence` and `evidenceClass` used in iterations 18/19/20 of the review after implementation, confirm every hit is covered. |
| The added flag check measurably slows a hot ranking path | L | The check is a single boolean env read already used elsewhere in this same file; no new I/O or allocation. |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Finding 6 (iteration 19) is a confirmed, real defect against the packet's own stated contract. |
| 2 | **Beyond Local Maxima?** | PASS | Considered redefining the contract and a DB migration; both rejected with reasons above. |
| 3 | **Sufficient?** | PASS | Normalizing at every read site fully restores the byte-identical guarantee without needing a migration. |
| 4 | **Fits Goal?** | PASS | Directly delivers the packet's own already-stated goal rather than introducing a new one. |
| 5 | **Open Horizons?** | PASS | Does not preclude a future migration/backfill if one is ever wanted; this fix is read-side only and composes with one later if scope changes. |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-context.ts`: `contextEdgeReliability` and the `why_included` trace formatter gain a flag-off substitution for `metadata.confidence`/`evidenceClass`.
- `.opencode/skills/system-code-graph/mcp_server/handlers/query.ts`: relationship-output and blast-radius classifiers gain the same substitution.

**How to roll back**: Revert the specific diff in each of the two files above; the flag-off read path returns to its current (buggy) behavior of trusting persisted confidence unconditionally. No data changes to revert, since this fix never writes anything.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

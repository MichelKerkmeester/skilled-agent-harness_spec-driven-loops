---
title: "Decision Record: Phase 4: embedding-coverage-and-vector-shard-consistency"
description: "ADR-001: accepted single-vector truncation for oversized scan documents with explicit FTS/BM25 tail coverage; scan-path chunking is not activated."
trigger_phrases:
  - "chunking decision"
  - "vector shard consistency"
  - "safe-swap self-delete"
  - "single-vector truncation policy"
  - "scan path chunking"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/029-memory-search-intelligence/002-speckit-memory/041-fix-deep-dive-p0-p2-findings-for-mk-spec-memory/004-embedding-coverage-and-vector-shard-consistency"
    last_updated_at: "2026-07-04T17:51:11.401Z"
    last_updated_by: "markdown-agent"
    recent_action: "Accepted ADR-001 single-vector truncation policy with lexical tail coverage"
    next_safe_action: "Verify oversized-document tail retrieval through FTS/BM25 and keep scan-path chunking inactive"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "planning-016-004-embedding-coverage"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Decision Record: Phase 4: embedding-coverage-and-vector-shard-consistency

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Scan-path chunking vs documented single-vector truncation policy

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-03 |
| **Deciders** | Michel Kerkmeester |

---

<!-- ANCHOR:adr-001-context -->
### Context

We needed to decide what to do with the dormant chunking subsystem because the corpus it was built for never uses it. `indexChunkedMemoryFile` has exactly one caller (`memory-save.ts:2511`); the scan path that produced 99.96% of the 33,101-row corpus never chunks. The result: 39 docs larger than 50KB (max 193KB) are embedded as one truncated vector each, so their tails are intentionally not vector-searchable and remain retrievable through FTS/BM25 because scan indexing stores the full `content_text` in the lexical index.

The same subsystem carries a verified P0: the safe-swap update path deletes the chunk rows it just updated. Staging dedups to update-in-place (`vector-index-store.ts:1857-1873`, no parent filter), the orchestrator captures oldChildIds after staging, then finalize bulk-deletes them, so the doc loses its freshly written vector children while the mtime-skipped parent keeps only its 500-char summary and `embedding_status='partial'` (that parent state is by design per `chunking-orchestrator.ts:516`; the fix restores the children, it does not force the parent to 'success') (report §3 P0 #3, `chunking-orchestrator.ts:311, 488-553`; mechanism verified, dormant today). Any decision that keeps or expands chunking makes this bug live; even the policy-only branch leaves it reachable through re-saves of chunked saved memories.

### Constraints

- The embedder context window truncates single-vector embeddings; tail content of oversized docs cannot be reached by vector search without chunking.
- The scan path handles the whole 33k-row corpus; any per-file cost added there multiplies across every scan (phase 010 owns scan performance, so this phase must not regress it).
- Chunk rows multiply index rows for oversized docs; growth must be measured before activation, not estimated after.
- Program cross-cutting rule: behavior-changing work ships flag-gated when it needs A/B evidence; fixes to broken default behavior ship direct.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Keep scan indexing on a single-vector policy for oversized documents. The vector payload may represent only the embedded prefix, while the full document body remains stored in `content_text` and indexed into FTS/BM25 so tail-only terms stay lexically retrievable.

**How it works**: The scan path does not call `indexChunkedMemoryFile` for over-threshold documents. It stores one vector row per document and writes the complete document text into the lexical index. Searches for text beyond the embedded prefix depend on FTS/BM25, not vector recall. The safe-swap fix remains necessary for saved memories that already use chunked indexing, but chunked indexing is not wired into scan.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Single-vector truncation with lexical tail coverage (chosen)** | Zero scan-path fanout; matches the current corpus behavior; tail terms remain searchable through FTS/BM25; no dormant chunking activation risk | Tail-only semantic recall remains unavailable through vectors | 8/10 |
| Option A direct: wire chunking into the scan path now | Tails of the 39 docs become vector-searchable immediately; MPAB machinery finally earns its keep | Activates a dormant subsystem with a P0 history on the full corpus without cost data; chunk-row growth unmeasured | 6/10 |
| Option B direct: document the truncation policy only | Zero behavioral risk; honest docs in one afternoon | 39 doc tails stay vector-invisible; chunking machinery stays dead weight; still must fix the P0 for saved-memory re-saves | 5/10 |
| Do nothing | No effort | Fails the decomposition gate; keeps a verified P0 latent and 39 docs silently truncated | 1/10 |

**Why this one**: The live numbers say the truncation problem is real but small (39 docs), and lexical tail coverage already preserves retrieval for exact tail terms. Activating chunked scan indexing would expand row counts and revive dormant-path risk for a small corpus slice.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- The safe-swap update path stops deleting fresh chunk rows; re-saving a chunked memory becomes safe (previously skipped tests now run and pass).
- SC-003 closes honestly: tail-only semantic recall is not promised, and exact tail terms remain retrievable through FTS/BM25.
- Future chunking work inherits a fixed swap path instead of a landmine.

**What it costs**:
- Tail-only vector recall remains unavailable for oversized scan documents. Mitigation: document the policy and test lexical tail retrieval.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Users expect tail-only semantic vector recall for oversized scan documents | M | Policy states the limit and tests FTS/BM25 tail retrieval |
| Safe-swap fix changes update semantics for existing chunked saved memories | H | Adversarial re-save test plus un-skipped update-path suite before merge |
| Policy doc drifts from actual embedder window over time | L | Policy avoids hardcoded token counts and anchors on single-vector scan behavior |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Verified P0 mechanism (report §3 #3) plus 39 live truncated docs (ledger L9); the decomposition gate requires exactly this decision |
| 2 | **Beyond Local Maxima?** | PASS | Four options scored; direct-activation and policy-only both considered and rejected with reasons |
| 3 | **Sufficient?** | PASS | A bounded spike plus a flag is the smallest step that makes the decision reversible and evidence-based |
| 4 | **Fits Goal?** | PASS | SC-003 and REQ-005 are phase gates; the safe-swap fix is REQ-001, a phase blocker |
| 5 | **Open Horizons?** | PASS | Append-only staging keeps every future chunking path safe regardless of which branch wins |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- `mcp_server/handlers/chunking-orchestrator.ts` (:488-553): finalize deletes only oldChildIds minus newChildIds, or staging becomes append-only (T010).
- `mcp_server/lib/search/vector-index-store.ts` (:1857-1873): dedup lookup gains a parent filter (T011).
- Skipped chunked update-path tests un-skipped plus one adversarial re-save test (T012).
- Scan-path chunking remains inactive; today's only `indexChunkedMemoryFile` call site stays `memory-save.ts:2511`.
- Memory-system docs state the single-vector truncation policy and FTS/BM25 tail coverage guarantee.

**How to roll back**: Revert this policy doc/test change and reopen the chunking activation decision. No database restore is needed because scan-path chunking is not activated.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!--
Level 3 Decision Record (Addendum): One ADR per major decision.
Write in human voice: active, direct, specific. No em dashes, no hedging.
HVR rules: .opencode/skills/sk-doc/references/hvr_rules.md
-->

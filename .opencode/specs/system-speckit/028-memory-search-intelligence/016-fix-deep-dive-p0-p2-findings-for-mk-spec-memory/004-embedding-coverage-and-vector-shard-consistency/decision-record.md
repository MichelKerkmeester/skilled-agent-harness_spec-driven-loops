---
title: "Decision Record: Phase 4: embedding-coverage-and-vector-shard-consistency"
description: "ADR-001: wire chunked indexing into the scan path for oversized docs, or document the single-vector truncation policy; the safe-swap self-delete gets fixed under either option."
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
    packet_pointer: "system-speckit/028-memory-search-intelligence/016-fix-deep-dive-p0-p2-findings-for-mk-spec-memory/004-embedding-coverage-and-vector-shard-consistency"
    last_updated_at: "2026-07-03T10:05:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored ADR-001 decision frame with spike gate"
    next_safe_action: "Run the T009 spike, then flip ADR-001 to Accepted with evidence"
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
| **Status** | Proposed (flips to Accepted after the T009 spike; the safe-swap fix is unconditional and starts now) |
| **Date** | 2026-07-03 |
| **Deciders** | Michel Kerkmeester |

---

<!-- ANCHOR:adr-001-context -->
### Context

We needed to decide what to do with the dormant chunking subsystem because the corpus it was built for never uses it. `indexChunkedMemoryFile` has exactly one caller (`memory-save.ts:2511`); the scan path that produced 99.96% of the 33,101-row corpus never chunks. The result: 39 docs larger than 50KB (max 193KB) are embedded as one truncated vector each, so their tails are invisible to vector search and only FTS can reach them (ledger L9, live-verified).

The same subsystem carries a verified P0: the safe-swap update path deletes the chunk rows it just updated. Staging dedups to update-in-place (`vector-index-store.ts:1857-1873`, no parent filter), the orchestrator captures oldChildIds after staging, then finalize bulk-deletes them, leaving the parent 'partial' with a 500-char summary and mtime-skipped forever (report §3 P0 #3, `chunking-orchestrator.ts:311, 488-553`; mechanism verified, dormant today). Any decision that keeps or expands chunking makes this bug live; even the policy-only branch leaves it reachable through re-saves of chunked saved memories.

### Constraints

- The embedder context window truncates single-vector embeddings; tail content of oversized docs cannot be reached by vector search without chunking.
- The scan path handles the whole 33k-row corpus; any per-file cost added there multiplies across every scan (phase 010 owns scan performance, so this phase must not regress it).
- Chunk rows multiply index rows for oversized docs; growth must be measured before activation, not estimated after.
- Program cross-cutting rule: behavior-changing work ships flag-gated when it needs A/B evidence; fixes to broken default behavior ship direct.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Fix the safe-swap self-delete unconditionally first, then gate scan-path chunking activation on a bounded spike (T009) over the 39 oversized docs, and fall back to an explicit single-vector truncation policy with documented FTS-only tail coverage if the spike fails its cost budget.

**How it works**: T010-T012 land the safe-swap fix (append-only staging or oldChildIds = old minus new, plus a parent-aware dedup lookup) and un-skip the update-path tests before any activation question is asked. The T009 spike then measures chunk-row growth and scan-latency cost on the real 39-doc population; Option A wires `indexChunkedMemoryFile` into the scan path behind a flag with a >50KB threshold when the spike passes, Option B writes the truncation policy into the memory-system docs when it does not. Either branch flips this ADR to Accepted with the spike numbers attached (REQ-005, SC-003).
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Spike-gated activation with policy fallback (chosen)** | P0 fixed either way; decision made on measured cost, not guesses; flag keeps rollback trivial | Two possible end states to verify; spike costs a few hours | 8/10 |
| Option A direct: wire chunking into the scan path now | Tails of the 39 docs become vector-searchable immediately; MPAB machinery finally earns its keep | Activates a dormant subsystem with a P0 history on the full corpus without cost data; chunk-row growth unmeasured | 6/10 |
| Option B direct: document the truncation policy only | Zero behavioral risk; honest docs in one afternoon | 39 doc tails stay vector-invisible; chunking machinery stays dead weight; still must fix the P0 for saved-memory re-saves | 5/10 |
| Do nothing | No effort | Fails the decomposition gate; keeps a verified P0 latent and 39 docs silently truncated | 1/10 |

**Why this one**: The live numbers say the truncation problem is real but small (39 docs), so the activation question deserves measurement rather than conviction; the P0 fix is not optional under any branch, so it moves out of the decision entirely.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- The safe-swap update path stops deleting fresh chunk rows; re-saving a chunked memory becomes safe (previously skipped tests now run and pass).
- SC-003 closes honestly under either branch: tails searchable, or limits documented where users can read them.
- Future chunking work inherits a fixed swap path instead of a landmine.

**What it costs**:
- The spike delays the activation decision by a few hours. Mitigation: T009 runs in Phase 1 parallel to the verify-first battery.
- Option A adds flag-gated scan cost for oversized docs. Mitigation: >50KB threshold and phase-010 baseline comparison before the flag defaults on.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Spike underestimates chunk-row growth on future corpora | M | Flag stays off by default until phase-010 perf work confirms headroom |
| Safe-swap fix changes update semantics for existing chunked saved memories | H | Adversarial re-save test plus un-skipped update-path suite before merge |
| Option B policy doc drifts from actual embedder window over time | L | Policy doc cites the embedder identity work (REQ-008/009) rather than hardcoded token counts |
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
- Option A only: `indexChunkedMemoryFile` wired into the scan path behind a flag with a >50KB threshold; today's only call site stays `memory-save.ts:2511` until the flag flips (T023).
- Option B only: memory-system docs gain the single-vector truncation policy and FTS-only tail coverage statement (T023).

**How to roll back**: Turn the scan-path chunking flag off (Option A), then `git revert` the safe-swap and store commits; no DB restore is needed because chunk rows only exist where chunking actually ran, and the T001 snapshot plus health consistency check confirm the pre-phase state.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!--
Level 3 Decision Record (Addendum): One ADR per major decision.
Write in human voice: active, direct, specific. No em dashes, no hedging.
HVR rules: .opencode/skills/sk-doc/references/hvr_rules.md
-->

# Decision Record: libSQL Hybrid RAG Enablement

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skill/sk-documentation/references/hvr_rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Adapter-first migration with metrics-gated hybrid rollout

<!-- ANCHOR:adr-001-context -->
### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-02-21 |
| **Deciders** | Spec Kit maintainers, MCP platform maintainers |

---

### Context

We needed to decide whether to move from the current SQLite runtime directly to libSQL/Turso, or sequence migration through a compatibility layer first. The current runtime is built around local `better-sqlite3`, `sqlite-vec`, FTS5 triggers, and local checkpoint transaction flows, while libSQL/Turso introduces different protocol and consistency semantics. A direct cutover would increase blast radius without proving parity for retrieval quality and operational safety. [EVIDENCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-impl.ts:15`] [EVIDENCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-impl.ts:1602`] [EVIDENCE: `.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:313`] [EVIDENCE: `specs/003-system-spec-kit/140-sqlite-to-libsql/context/libsql-main/docs/HTTP_V2_SPEC.md:14`] [EVIDENCE: `specs/003-system-spec-kit/140-sqlite-to-libsql/context/libsql-main/docs/CONSISTENCY_MODEL.md:13`]

### Constraints

- Current MCP runtime has no remote endpoint/auth contract in package/runtime wiring. [EVIDENCE: `.opencode/skill/system-spec-kit/mcp_server/package.json:33`]
- Existing retrieval stack depends on SQLite-specific constructs (`vec0`, `vec_distance_cosine`, FTS5 BM25). [EVIDENCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-impl.ts:1602`] [EVIDENCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:90`]
- Rollback safety must be preserved through checkpoint semantics during migration. [EVIDENCE: `.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:313`]
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Keep `sqlite_local` as default now and implement an adapter-first migration path that gates hybrid rollout on explicit quality and reliability metrics.

**How it works**: We first introduce a `DatabaseAdapter` and capability profile while preserving current behavior. Then we run shadow-read parity, followed by dual-write canary, and only allow cutover when all P0 metrics pass. If any P0 gate fails, we roll back to the prior stable backend mode immediately.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Adapter-first phased migration (Chosen)** | Preserves current reliability while expanding compatibility options; supports reversible rollout | Adds short-term implementation complexity | 9/10 |
| Stay SQLite-only indefinitely | Lowest immediate risk and effort | Misses hybrid compatibility and future topology options | 6/10 |
| Immediate Turso hybrid rollout | Faster path to remote/replica capabilities | High correctness and operational risk without parity harness | 4/10 |
| Immediate full remote cutover | Maximum platform capability surface quickly | Highest blast radius and rollback risk | 2/10 |

**Why this one**: The chosen path gives us measurable proof before risk escalation. It captures libSQL upside without assuming compatibility where current evidence shows coupling and semantic differences.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Migration is reversible at every phase through explicit rollback gates.
- Retrieval quality and compatibility are validated with measurable thresholds instead of subjective checks.
- The team gains a clean backend boundary that supports future platform options.

**What it costs**:
- Additional adapter and telemetry work before any feature-visible backend switch. Mitigation: keep phase scope tight and timeboxed.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Adapter abstraction misses backend-specific behavior | H | Capability profile and backend conformance tests |
| Shadow parity appears good but canary reliability fails | H | Separate quality and reliability gates; do not skip canary |
| Cost/quota constraints block rollout mid-phase | M | Budget headroom policy and quota alerts before canary |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Decision is required before storage architecture work proceeds |
| 2 | **Beyond Local Maxima?** | PASS | Compared 4 options including immediate and deferred strategies |
| 3 | **Sufficient?** | PASS | Adapter-first is minimum structure needed for safe parity validation |
| 4 | **Fits Goal?** | PASS | Directly answers hybrid-RAG compatibility question with gates |
| 5 | **Open Horizons?** | PASS | Keeps local reliability while enabling hybrid and remote futures |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- Add backend abstraction and capability profile before any runtime backend switch.
- Add parity harness and canary reliability checks to release criteria.
- Keep rollback controller tied to checkpoint safety and backend mode flags.

**How to roll back**: Set backend mode to prior stable value, disable canary/shadow write paths, reconcile from authoritative checkpoint, rerun smoke + restore checks, and freeze phase advancement.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

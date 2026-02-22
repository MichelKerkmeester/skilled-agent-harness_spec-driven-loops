---
title: "Feature Specification: libSQL Hybrid RAG Enablement Assessment [140-sqlite-to-libsql/spec]"
description: "This spec reframes the current folder around one decision question: \"Does libsql improve our existing feature set and increase possibilities/compatibilities to reach a hybrid RA..."
trigger_phrases:
  - "feature"
  - "specification"
  - "libsql"
  - "hybrid"
  - "rag"
  - "spec"
  - "140"
  - "sqlite"
importance_tier: "important"
contextType: "decision"
---
# Feature Specification: libSQL Hybrid RAG Enablement Assessment

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

<!-- ANCHOR:executive-summary -->
## EXECUTIVE SUMMARY

This spec reframes the current folder around one decision question: "Does libsql improve our existing feature set and increase possibilities/compatibilities to reach a hybrid RAG fusion database?" The evidence shows "not for immediate cutover", but "yes for future capability expansion" if we execute an adapter-first, metrics-gated migration path.

**Key Decisions**: Keep `sqlite_local` as default now, adopt a `DatabaseAdapter` + `SearchCapabilityProfile` before any hybrid rollout

**Critical Dependencies**: Baseline retrieval quality benchmarks and restore-drill telemetry for current SQLite runtime
<!-- /ANCHOR:executive-summary -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P0 |
| **Status** | In Progress |
| **Created** | 2026-02-21 |
| **Branch** | `140-sqlite-to-libsql` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The current MCP memory runtime is tightly coupled to local SQLite primitives (`better-sqlite3`, `sqlite-vec`, FTS5 triggers, local PRAGMAs, local checkpoint transactions), so direct Turso/libSQL cutover would create correctness and reliability risk without an adapter boundary first. At the same time, libSQL provides compatibility and remote/replica capabilities that could unlock a hybrid RAG fusion architecture if compatibility and quality gates are passed. [EVIDENCE: `specs/003-system-spec-kit/140-sqlite-to-libsql/analysis-system-speckit-mcp-sqlite-vs-libsql.md:9`] [EVIDENCE: `specs/003-system-spec-kit/140-sqlite-to-libsql/analysis-system-speckit-mcp-sqlite-vs-libsql.md:13`] [EVIDENCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-impl.ts:15`] [EVIDENCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-impl.ts:1602`] [EVIDENCE: `.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:313`] [EVIDENCE: `specs/003-system-spec-kit/140-sqlite-to-libsql/context/libsql-main/README.md:126`] [EVIDENCE: `specs/003-system-spec-kit/140-sqlite-to-libsql/context/libsql-main/README.md:128`]

### Purpose
Deliver an evidence-backed decision framework that states when libSQL improves the feature set and when it does not, with explicit hybrid-RAG quality, compatibility, and reliability thresholds for migration phases.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Reframe this spec folder around the single decision question and measurable answer criteria.
- Define compatibility impacts across current memory/search/checkpoint features.
- Define phased migration strategy (adapter, shadow-read, canary, cutover) and rollback gates.
- Define hard success metrics for hybrid retrieval quality, compatibility, and operational reliability.
- Record explicit `UNKNOWN` items instead of assumptions.

### Out of Scope
- Production backend cutover execution - implementation is a separate phase.
- Rewriting MCP runtime code - this document is planning/decision scope only.
- Pricing procurement or contract decisions - tracked as dependency input, not solved here.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `specs/003-system-spec-kit/140-sqlite-to-libsql/spec.md` | Create | Canonical decision framing and acceptance criteria |
| `specs/003-system-spec-kit/140-sqlite-to-libsql/plan.md` | Create | Implementation strategy and phase dependencies |
| `specs/003-system-spec-kit/140-sqlite-to-libsql/tasks.md` | Create | Executable work breakdown and sequencing |
| `specs/003-system-spec-kit/140-sqlite-to-libsql/checklist.md` | Create | Verification protocol and migration quality gates |
| `specs/003-system-spec-kit/140-sqlite-to-libsql/decision-record.md` | Create | ADR for adapter-first migration posture |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Answer the primary question with an explicit decision posture by backend mode (`sqlite_local`, `libsql_local`, `turso_hybrid`, `turso_remote`) | Decision statement includes `now`, `next`, and `not-now` outcomes with evidence citations to local analysis and source files |
| REQ-002 | Produce compatibility map for core feature set | Compatibility table covers at least 8 capabilities (vector search, FTS5/BM25, checkpoint/restore, CLI flows, consistency model, protocol handling, migration semantics, auth/ops) with migration effort classification |
| REQ-003 | Define hybrid retrieval quality gates | Shadow-read metrics are explicit: Top-10 overlap >= 99%, Recall@10 delta <= 1.0%, nDCG@10 delta <= 0.02, zero critical relevance regressions in acceptance queries |
| REQ-004 | Define operational reliability gates and rollback rules | Reliability thresholds are explicit: 100% pass across 10 restore drills, 0 unresolved dual-write divergence incidents, rollback procedure documented per phase with trigger criteria |
| REQ-005 | Capture unresolved information explicitly | All unresolved assumptions are listed in `OPEN QUESTIONS` with `UNKNOWN:` prefix, owner, and unblock condition |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Define migration phases with objective gates | Plan includes phase entry/exit criteria for Adapter, Shadow Read, Dual Write Canary, and Cutover |
| REQ-007 | Define compatibility and observability instrumentation | Plan includes mandatory telemetry dimensions (latency, error class, consistency anomalies, divergence counters, restore outcomes) |
| REQ-008 | Define budget and quota guardrails | Checklist includes quota blocking and budget headroom checks with escalation actions |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Decision question is answered in one explicit statement with evidence for both benefits and limits.
- **SC-002**: Compatibility matrix covers >= 8 current capabilities with clear status (`portable now`, `adapter required`, `redesign required`).
- **SC-003**: Hybrid retrieval quality gates are measurable and testable before any production cutover (Top-10 overlap, Recall@10 delta, nDCG@10 delta).
- **SC-004**: Operational reliability gates are measurable (restore drill success rate, dual-write divergence count, rollback time objective).
- **SC-005**: `UNKNOWN` register exists and blocks unverified assumptions from being treated as facts.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Baseline SQLite quality benchmark corpus | Cannot evaluate parity without stable baseline | Freeze benchmark corpus and query set before adapter work starts |
| Dependency | libSQL protocol semantics (baton + stream lifecycle) | Retry/idempotency errors in hybrid mode | Add stream-state tests and explicit retry contract [EVIDENCE: `specs/003-system-spec-kit/140-sqlite-to-libsql/context/libsql-main/docs/HTTP_V2_SPEC.md:14`] |
| Dependency | Replica consistency behavior | Stale read risk in multi-process flows | Route correctness-sensitive reads to primary until monotonic behavior is proven [EVIDENCE: `specs/003-system-spec-kit/140-sqlite-to-libsql/context/libsql-main/docs/CONSISTENCY_MODEL.md:13`] |
| Risk | Vector SQL mismatch (`sqlite-vec` vs native vector APIs) | Retrieval quality drift | Capability profile + parity harness before canary [EVIDENCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-impl.ts:1602`] |
| Risk | Checkpoint restore behavior diverges in hybrid mode | Data safety regression | Keep local checkpoint authority until restore drills pass [EVIDENCE: `.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:313`] |
| Risk | Quota/cost surprise | Forced blocking during rollout | Budget headroom policy and alerting before phase escalation |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Adapter introduction must keep `sqlite_local` p95 query latency regression <= 10% versus frozen baseline.
- **NFR-P02**: `turso_hybrid` shadow mode may exceed local latency but must stay <= 1.5x local p95 on accepted benchmark set.

### Security
- **NFR-S01**: No auth token is stored in tracked files; runtime credentials are environment-only.
- **NFR-S02**: Remote write failures must fail closed in canary and cutover phases.

### Reliability
- **NFR-R01**: Restore drill success rate must be 100% for 10 consecutive drills before canary write enablement.
- **NFR-R02**: Rollback to prior backend mode must complete in <= 15 minutes from trigger.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

### Data Boundaries
- Empty corpus query: fallback retrieval still returns deterministic empty result, not error.
- Embedding dimension mismatch: write path rejects incompatible vectors and records telemetry [EVIDENCE: `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:551`].
- Mixed archived/non-archived memory records: parity checks must confirm filter behavior stays aligned.

### Error Scenarios
- HTTP baton invalidation or stream closure: retries must preserve idempotency and avoid double writes [EVIDENCE: `specs/003-system-spec-kit/140-sqlite-to-libsql/context/libsql-main/docs/HTTP_V2_SPEC.md:73`].
- Replica lag causing stale read in validation flow: guard via consistency mode policy and primary fallback [EVIDENCE: `specs/003-system-spec-kit/140-sqlite-to-libsql/context/libsql-main/docs/CONSISTENCY_MODEL.md:13`].
- Stateless HTTP transaction limitations in fallback endpoints: do not assume interactive transaction semantics [EVIDENCE: `specs/003-system-spec-kit/140-sqlite-to-libsql/context/libsql-main/docs/http_api.md:49`].
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 21/25 | Crosses storage, retrieval, consistency, and operations domains |
| Risk | 22/25 | Data integrity + retrieval quality + rollback safety |
| Research | 16/20 | Requires protocol and consistency interpretation plus benchmark design |
| Multi-Agent | 5/15 | Single-leaf execution for this documentation task |
| Coordination | 12/15 | Multiple phase gates and cross-team operational dependencies |
| **Total** | **76/100** | **Level 3** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:risk-matrix -->
## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Vector retrieval parity falls below threshold | H | M | Shadow-read parity harness, block canary until thresholds pass |
| R-002 | Replica consistency anomalies break correctness-sensitive reads | H | M | Primary-read policy for protected flows, anomaly counters |
| R-003 | Stream lifecycle failures cause partial write outcomes | H | M | Idempotency keys + retry policy + fail-closed writes |
| R-004 | Checkpoint restore semantics diverge in hybrid mode | H | L | Keep local checkpoint authority; run 10 restore drills per phase |
| R-005 | Cost and quota behavior invalidates rollout | M | M | Budget headroom policy + alerting + staged enablement |
<!-- /ANCHOR:risk-matrix -->

---

<!-- ANCHOR:user-stories -->
## 11. USER STORIES

### US-001: Decision Confidence (Priority: P0)

**As a** platform maintainer, **I want** a measurable answer to whether libSQL improves our current features and hybrid-RAG options, **so that** we avoid architectural churn based on assumptions.

**Acceptance Criteria**:
1. **Given** the current SQLite-coupled runtime, **When** I review this spec set, **Then** I can see explicit `now`, `next`, and `not-now` decisions with evidence.
2. **Given** the decision matrix, **When** a new backend option is considered, **Then** the phase gate requirements are clear before implementation begins.

---

### US-002: Retrieval Quality Protection (Priority: P0)

**As a** retrieval engineer, **I want** hard parity thresholds for shadow-read validation, **so that** hybrid migration does not degrade relevance.

**Acceptance Criteria**:
1. **Given** shadow-read results, **When** Top-10 overlap drops below 99%, **Then** rollout is blocked.
2. **Given** ranking metrics, **When** nDCG@10 delta exceeds 0.02, **Then** the phase remains in shadow mode.

---

### US-003: Operational Safety (Priority: P1)

**As an** on-call engineer, **I want** rollback triggers and restore drill requirements, **so that** I can recover quickly from migration failures.

**Acceptance Criteria**:
1. **Given** a Sev-2 storage incident or divergence alert, **When** trigger criteria are met, **Then** rollback to previous backend mode starts immediately.
2. **Given** rollback execution, **When** recovery completes, **Then** restore integrity checks show no unresolved data loss.

---

### US-004: Compatibility Expansion (Priority: P1)

**As a** product owner, **I want** a phased path from local SQLite to hybrid RAG storage modes, **so that** we can expand feature possibilities without unstable cutovers.

**Acceptance Criteria**:
1. **Given** migration phases, **When** each gate is met, **Then** only the next scoped backend mode is enabled.
2. **Given** an unmet gate, **When** a phase review occurs, **Then** advancement is denied and the blocker is logged as `UNKNOWN` or risk item.
<!-- /ANCHOR:user-stories -->

---

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

- UNKNOWN: Which exact hybrid-RAG benchmark corpus and acceptance query set should be frozen for parity testing?
- UNKNOWN: Which Turso/libSQL plan tier is approved for canary phase cost and quota testing?
- UNKNOWN: Do we require strict primary-only reads for all write-after-read flows, or only a protected subset?
- UNKNOWN: Which team owns ongoing stream-state telemetry SLOs after cutover?
- UNKNOWN: What is the minimum acceptable RTO for rollback in production environments beyond local development?
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`

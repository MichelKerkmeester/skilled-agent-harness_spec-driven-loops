<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

# Decision Record: System-Spec-Kit & MCP Memory Server — Comprehensive Remediation

> Architectural Decision Records covering audit methodology (historical) and remediation strategy (active).

**Spec Folder:** `098-feature-bug-documentation-audit`
**Parent:** `003-memory-and-spec-kit`
**Created:** 2026-02-09 (audit) | **Updated:** 2026-02-10 (remediation rewrite)

---

## Historical ADRs (Audit Phase)

### ADR-001: Use 20 Parallel Agents for Comprehensive Audit

**Status:** Accepted (Historical — Audit Phase, 2026-02-09)

**Context:** The system-spec-kit spans 664+ files across 7 architectural layers with 22 MCP tools. No single agent can hold the full codebase in context while performing deep analysis.

**Decision:** Decompose the audit into 20 specialized domains and execute all agents in parallel via the Task tool. Each agent received a focused domain with exclusive file scope and wrote findings to individual scratch/ files.

**Result:** 200+ issues found (10 P0, 18 P1, 60+ P2, 80+ Low). 12 non-functional features documented. 67.9% doc-code alignment measured. All 22 MCP tools audited with file:line evidence.

**Five Checks:** 5/5 PASS | **Alternatives:** Single agent (3/10), 5-agent (5/10), 10-agent (7/10), 20-agent chosen (9/10)

---

### ADR-002: Pattern C File-Based Output for Context Window Management

**Status:** Accepted (Historical — Audit Phase, 2026-02-09)

**Context:** 20 agents producing ~400 lines each = ~8,000 lines. Cannot fit in orchestrator context for synthesis.

**Decision:** Each agent writes to `scratch/agent-NN-domain.md`. Synthesis agent reads all 20 files incrementally.

**Result:** 21 persistent files produced. All available for future session reference. Human-readable markdown format.

**Five Checks:** 5/5 PASS | **Alternatives:** Return values (4/10), JSON (6/10), File-based chosen (9/10)

---

## Remediation ADRs (Active)

### ADR-003: Remediation Strategy — Fix-by-Workstream

**Status:** Accepted (2026-02-10)

| Field | Value |
|-------|-------|
| Deciders | Michel Kerkmeester (Maintainer) |
| Impact | All remediation work — determines execution structure |

#### Context

The 20-agent audit produced 200+ findings across diverse subsystems: checkpoint safety, vector search, causal graphs, trigger matching, decay scoring, documentation, templates, scripts. These need systematic remediation. The question: how to organize 38+ individual fixes?

#### Constraints

- P0 data loss/crash issues must be fixed first (user safety)
- Some fixes share files (e.g., checkpoints.ts has P0-02, P0-03, P0-10, P1-13, P1-14)
- Documentation can only be fixed after code is fixed (otherwise it misaligns again)
- 966-test regression suite must stay green throughout
- Fixes should be independently verifiable and deployable

#### Decision

Organize fixes into 5 workstreams by subsystem affinity, executed in 5 phases with safety-first sequencing:

| Workstream | Scope | Phase | Task Count |
|------------|-------|-------|------------|
| WS-1: Critical Safety | Data loss, crashes, DoS | Phase 1 (first) | 7 |
| WS-2: Non-Functional Features | Make documented features work | Phase 2 | 14 |
| WS-3: Architecture | Decay unification, modularization | Phase 3 | 6 |
| WS-4: Documentation | SKILL.md, schemas, templates | Phase 4 | 6 |
| WS-5: Scripts & Data | Shell fixes, data integrity | Phase 5 | 5 |

#### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Fix-by-workstream (Chosen)** | Coherent subsystem changes; testable per-group; safety-first | More phases; some cross-workstream coordination | 85/100 |
| Fix-by-severity (all P0, then P1) | Clear priority ordering | Mixes unrelated subsystems; harder to test in isolation | 60/100 |
| Fix-by-file (group by affected file) | Minimizes file touches | P0 fixes delayed if file has mostly P1 issues | 50/100 |
| Big-bang (fix everything at once) | Fast if it works | Impossible to verify; high regression risk; no rollback | 20/100 |

#### Five Checks

| Check | Result | Evidence |
|-------|--------|----------|
| 1. Necessary? | **PASS** | 200+ issues across 5+ subsystems require organized approach |
| 2. Beyond Local Maxima? | **PASS** | 4 alternatives evaluated with trade-offs |
| 3. Sufficient? | **PASS** | 5 workstreams cover all 38 tasks without over-decomposition |
| 4. Fits Goal? | **PASS** | Safety-first ordering addresses highest-risk issues immediately |
| 5. Open Horizons? | **PASS** | Each workstream ships independently; future work can extend |

#### Consequences

**Positive:** Safety secured before feature work; each phase independently verifiable; clear file ownership prevents conflicts; incremental delivery reduces risk.

**Negative:** Phases 1→2 sequential dependency adds calendar time; WS-4 (docs) must wait for code to stabilize.

---

### ADR-004: Decay System Unification — Adopt FSRS v4 as Canonical

**Status:** Accepted (2026-02-10) — Implemented during WS-3 remediation (spec 101)

| Field | Value |
|-------|-------|
| Audit Reference | P1-11, Agent 13 |
| Impact | All memory scoring behavior |

#### Context

Four independent decay mechanisms exist with no unification:

| System | Algorithm | Location | Use |
|--------|-----------|----------|-----|
| Exponential tier-based | `score * rate^(days/30)` | attention-decay.ts | Attention scoring |
| FSRS v4 power-law | `(1 + 0.235*t/S)^(-0.5)` | fsrs-scheduler.ts | Spaced repetition scheduling |
| Working memory linear | `score * 0.95` per minute | working-memory.ts | Short-term session decay |
| SQL half-life | `weight * 0.5^(days/halfLife)` | vector-index-impl.js | Search scoring |

This causes unpredictable scoring behavior depending on which code path is active.

#### Decision

Adopt **FSRS v4** as the canonical long-term memory decay algorithm. Retire exponential tier-based and SQL half-life systems. Keep working memory linear decay as a separate fast-decay layer (different time scale: minutes vs days).

**Rationale:** FSRS v4 has the strongest theoretical basis (spaced-repetition research by Piotr Wozniak, validated across millions of flashcard reviews). It's already implemented in the codebase. The power-law curve `(1 + 0.235*t/S)^(-0.5)` provides smooth, predictable decay without the cliff-edges of exponential or half-life models.

#### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| Keep all 4 (status quo) | No change risk | Unpredictable, untestable | 10/100 |
| Unify to exponential | Simple, familiar | No theoretical basis; cliff-edge decay | 40/100 |
| **Unify to FSRS v4 (Chosen)** | Research-backed; smooth curve; already implemented | Parameters tuned for flashcards, not memory search | 85/100 |
| Custom algorithm | Tailored to use case | Yet another system; no research backing; high risk | 30/100 |

#### Five Checks

| Check | Result | Evidence |
|-------|--------|----------|
| 1. Necessary? | **PASS** | 4 competing systems is actively harmful — scoring is unpredictable |
| 2. Beyond Local Maxima? | **PASS** | 4 options evaluated; FSRS has clear theoretical advantage |
| 3. Sufficient? | **PASS** | 2 systems (FSRS + working memory linear) cover both time scales |
| 4. Fits Goal? | **PASS** | Eliminates P1-11; scoring becomes testable and predictable |
| 5. Open Horizons? | **PASS** | FSRS parameters are tunable; can optimize for memory search use case later |

#### Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| FSRS parameters wrong for search | Scoring behavior changes | A/B comparison: run old + new models; compare rankings |
| Memories previously HOT become COLD | User-visible change | Gradual rollout; log score differences; tune stability parameter |
| Working memory interaction | Edge case conflicts | Keep working memory independent; clear boundary at "session" scope |

---

### ADR-005: Checkpoint Safety Pattern — Backup-Validate-Restore

**Status:** Accepted (2026-02-10) — Implemented during WS-1 remediation (spec 101)

| Field | Value |
|-------|-------|
| Audit Reference | P0-02, P0-03, P0-10 |
| Impact | Checkpoint restore safety |

#### Context

Three P0 issues cluster in the checkpoint system:
- **P0-02:** `clearExisting=true` deletes ALL data before restore attempt. Failed restore = total data loss.
- **P0-03:** After restore, BM25/trigger/vector indexes not refreshed. Restored data invisible until restart.
- **P0-10:** Checkpoint JSON deserialized and inserted without validation. Corrupt data injected into DB.

#### Decision

Implement a three-layer safety pattern:

1. **Backup:** Before any destructive operation, create automatic in-memory snapshot of current state
2. **Validate:** Deserialize checkpoint JSON and validate every row against memory_index schema BEFORE any DB mutation
3. **Restore in transaction:** Wrap DELETE + INSERT in SQLite transaction; rollback on any failure
4. **Rebuild indexes:** After successful transaction commit, rebuild BM25 index, trigger cache, and vector index

```
Restore Request
  → Create backup (in-memory snapshot)
  → Validate checkpoint JSON against schema
    → Invalid? REJECT with error, no DB changes
  → BEGIN TRANSACTION
    → DELETE existing (if clearExisting=true)
    → INSERT validated rows
    → Any error? ROLLBACK (backup state preserved)
  → COMMIT
  → Rebuild BM25 index
  → Rebuild trigger cache
  → Reload vector index
  → Verify search returns restored memories
```

#### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| Transaction only | Prevents partial deletes | Doesn't address validation or index rebuild | 50/100 |
| Backup only | Recovery possible | Manual recovery needed; doesn't prevent corruption | 40/100 |
| **Full safety pattern (Chosen)** | All three P0 vectors addressed | Slightly slower restore (backup + validation overhead) | 90/100 |
| Restore to temp tables, then swap | Atomic; old data preserved | Complex implementation; SQLite limitations | 70/100 |

#### Five Checks

| Check | Result | Evidence |
|-------|--------|----------|
| 1. Necessary? | **PASS** | P0-02 is irreversible data loss — highest-severity possible |
| 2. Beyond Local Maxima? | **PASS** | 4 alternatives evaluated; full pattern is only one addressing all 3 P0s |
| 3. Sufficient? | **PASS** | Three layers (backup, validate, transaction) cover all failure modes |
| 4. Fits Goal? | **PASS** | Directly eliminates P0-02, P0-03, P0-10 |
| 5. Open Horizons? | **PASS** | Schema validation is extensible for future fields; backup approach scales |

---

### ADR-006: Dead Parameter Resolution — Implement, Don't Remove

**Status:** Proposed (2026-02-10) — Applies during Phase 2

| Field | Value |
|-------|-------|
| Audit Reference | P1-05, P1-09, P1-10, P1-13 |
| Impact | 6+ MCP tool parameters |

#### Context

Six parameters are accepted by MCP tools but have zero effect on behavior:

| Parameter | Tool | Documented Behavior | Actual Behavior |
|-----------|------|-------------------|-----------------|
| turnNumber | memory_match_triggers | Affects decay calculation | Ignored |
| relations | memory_drift_why | Filters by relationship type | Validated but not applied |
| limit | checkpoint_list | Limits result count | Ignored |
| applyStateLimits | memory_search | Limits per-tier results | No limits defined |
| applyLengthPenalty | memory_search | Penalizes long memories | Never consumed |

#### Decision

**Implement** the documented behavior for each parameter rather than removing them.

**Rationale:** Each parameter was designed for a reason and documented in SKILL.md. Removing them is a breaking change for any existing caller that passes them. Implementing them fulfills the API contract that users have been reading. The effort to implement is comparable to the effort to remove + update all documentation.

#### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| Remove all dead parameters | Clean API; no misleading params | Breaking change; requires doc updates; loses intended design | 40/100 |
| **Implement all (Chosen)** | Fulfills API contract; no breaking change; matches docs | More implementation work; some designs may not match intent | 75/100 |
| Implement critical, remove trivial | Balanced approach | Ambiguous criteria for "critical" vs "trivial" | 70/100 |

#### Five Checks

| Check | Result | Evidence |
|-------|--------|----------|
| 1. Necessary? | **PASS** | Dead parameters mislead users and waste their effort configuring non-functional options |
| 2. Beyond Local Maxima? | **PASS** | 3 alternatives evaluated |
| 3. Sufficient? | **PASS** | Implementing matches documented contract |
| 4. Fits Goal? | **PASS** | Eliminates 5 P1 dead-code findings |
| 5. Open Horizons? | **PASS** | Implementations can be refined later without breaking the interface |

---

### ADR-007: Documentation Alignment — Case-by-Case Dual Strategy

**Status:** Proposed (2026-02-10) — Applies during Phase 4

| Field | Value |
|-------|-------|
| Audit Reference | 25 misalignments (67.9% alignment), Agent 16 |
| Impact | SKILL.md, all tool descriptions |

#### Context

25 documentation-code misalignments were found. The question: when documentation says one thing and code does another, which do you fix?

#### Decision

**Case-by-case with a dual strategy:**

| Category | Action | Example |
|----------|--------|---------|
| Feature SHOULD work (code is broken) | Fix the CODE to match docs | Tiered injection, archival, token budgets |
| Feature is MISREPRESENTED (docs are aspirational) | Fix the DOCS to be honest, then create separate enhancement spec | Cross-encoder → rename to keywordRerank |
| Feature is CORRECT but docs are wrong | Fix the DOCS | Constitutional memory boost vs forced-top |
| Feature is partially implemented | Fix the CODE to complete, then update DOCS | Working memory in checkpoints |

**Principle:** Never leave documentation that lies about what the code does. Either fix the code or fix the docs — but honesty is non-negotiable.

#### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| Always fix docs to match code | Fast; no code changes | Accepts broken features as "intended"; SKILL.md becomes weaker | 30/100 |
| Always fix code to match docs | Fulfills original design intent | Some doc claims are aspirational; high risk | 50/100 |
| **Case-by-case dual strategy (Chosen)** | Most nuanced; honest; fixes what should work | Requires judgment per misalignment | 85/100 |

#### Five Checks

| Check | Result | Evidence |
|-------|--------|----------|
| 1. Necessary? | **PASS** | 67.9% alignment means 1/3 of documentation is misleading |
| 2. Beyond Local Maxima? | **PASS** | 3 strategies evaluated |
| 3. Sufficient? | **PASS** | Dual strategy covers all misalignment types |
| 4. Fits Goal? | **PASS** | Target: ≥95% alignment post-remediation |
| 5. Open Horizons? | **PASS** | Enhancement specs for aspirational features preserve future intent |

---

### ADR-008: sqlite-vec Adoption for Vector Search

> **Note:** This ADR was authored during spec 102 (MCP Cleanup and Alignment) work but recorded here for historical continuity. See spec 102 for implementation context.

**Status:** Accepted (2026-02-10)

| Field | Value |
|-------|-------|
| Audit Reference | P1-07, OQ-03, REQ-305 |
| Deciders | Architecture review during spec 098 |
| Impact | Primary vector search backend for MCP memory server |

#### Context
The MCP memory server originally used full-table-scan with manual cosine distance calculation for vector search. As the memory database grows (projected 500-2000 memories), this approach doesn't scale. Audit finding P1-07 flagged this as an architectural concern, and OQ-03 posed the question: "Should sqlite-vec be adopted for primary vector search, or is full-table-scan acceptable at current scale?"

During T305 evaluation, sqlite-vec was found to be **already fully integrated** — the adoption decision had been made organically but never formally documented.

#### Constraints
1. Must work with existing better-sqlite3 database (no separate vector DB)
2. Must support dynamic embedding dimensions (768, 1024, 1536) based on provider
3. Must degrade gracefully when sqlite-vec native extension unavailable
4. Alpha-stage dependency acceptable given controlled deployment (single-user dev tool)
5. Must not break existing keyword/anchor search paths

#### Decision
**Adopt sqlite-vec v0.1.7-alpha.2** as the primary vector search backend, with comprehensive graceful degradation to keyword-only search.

Implementation details:
- **vec0 virtual table** (`vec_memories`) stores embeddings with dynamic dimensions
- **vec_distance_cosine()** replaces manual cosine calculation for vector search and multi-concept search
- **8+ guard points** check `sqlite_vec_available` flag throughout the codebase
- **Graceful fallback**: When sqlite-vec fails to load, all vector operations fall back to keyword search with console warnings
- **Integration scope**: vector-index-impl.js (~3,340 lines) is the primary integration file

#### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **sqlite-vec (chosen)** | Native SQLite extension, no separate DB, cosine distance built-in, dynamic dimensions | Alpha stage, platform-specific binaries (darwin-arm64, darwin-x64, linux-x64) | 82/100 |
| Full-table scan | Zero dependencies, works everywhere | O(n) on every search, no index benefit | 45/100 |
| Separate vector DB (Chroma, Pinecone) | Purpose-built, production-grade | Extra dependency, network latency, deployment complexity for dev tool | 35/100 |
| pgvector (PostgreSQL) | Battle-tested, production-grade | Requires PostgreSQL (overkill for local dev tool using SQLite) | 25/100 |

#### Five Checks

| Check | Result | Evidence |
|-------|--------|----------|
| 1. Necessary? | **PASS** | Full-table scan is O(n); sqlite-vec provides indexed cosine search. Scale from 500→2000+ memories justifies it |
| 2. Beyond Local Maxima? | **PASS** | vec0 virtual tables are the standard SQLite extension pattern; sqlite-vec is maintained by the asg017/sqlite-vec project |
| 3. Sufficient? | **PASS** | Provides cosine distance, dynamic dimensions, and integrates with existing SQLite — no additional infrastructure needed |
| 4. Fits Goal? | **PASS** | Directly enables fast semantic search, the core value proposition of the memory system |
| 5. Open Horizons? | **PASS** | If sqlite-vec is deprecated, graceful degradation already handles fallback; migration to another vector backend would only affect vector-index-impl.js |

#### Consequences / Risks

**Positive:**
- Indexed vector search instead of O(n) full-table scan
- Native SQLite integration (no external services)
- Dynamic dimension support (768/1024/1536)
- Comprehensive graceful degradation already implemented

**Negative:**
- Alpha-stage dependency (v0.1.7-alpha.2)
- Platform-specific native binaries required
- Single integration file (vector-index-impl.js) is large (~3,340 lines)

| Risk | Impact | Mitigation |
|------|--------|------------|
| Alpha API breaking changes | Medium | Pin version, graceful degradation handles unavailability |
| Platform binary unavailable | Low | Falls back to keyword-only search automatically |
| Extension load failure | Low | 8+ guard points ensure safe degradation |
| Performance regression in alpha | Low | Can revert to full-table scan by simply not loading extension |

---

## Session Decision Log (Remediation Phase)

| # | Timestamp | Decision Point | Decision | Confidence | Uncertainty | Evidence |
|---|-----------|---------------|----------|------------|-------------|----------|
| 1 | 2026-02-10 | Audit-to-remediation transformation | APPROVED | HIGH | 0.05 | 97% of findings remain valid; 0 functional bugs fixed by 099/100 |
| 2 | 2026-02-10 | Workstream organization (5 WS) | ACCEPTED | HIGH | 0.10 | ADR-003 — safety-first, subsystem-coherent grouping |
| 3 | 2026-02-10 | Phase ordering (safety first) | MANDATED | HIGH | 0.05 | P0 data loss risks must be eliminated before feature work |
| 4 | 2026-02-10 | Spec 099/100 as baseline | ACCEPTED | HIGH | 0.05 | 966 tests + 94% cast reduction = starting safety net |
| 5 | 2026-02-10 | FSRS v4 as canonical decay | PROPOSED | MEDIUM | 0.25 | ADR-004 — strongest theoretical basis; needs validation |
| 6 | 2026-02-10 | Checkpoint safety pattern | PROPOSED | HIGH | 0.10 | ADR-005 — backup-validate-restore addresses all 3 checkpoint P0s |
| 7 | 2026-02-10 | Dead params: implement don't remove | PROPOSED | MEDIUM | 0.20 | ADR-006 — fulfills API contract; no breaking changes |
| 8 | 2026-02-10 | Doc alignment: case-by-case | PROPOSED | HIGH | 0.10 | ADR-007 — honesty principle; fix code or fix docs, never lie |
| 9 | 2026-02-10 | Adopt sqlite-vec v0.1.7-alpha.2 as primary vector search backend | ACCEPTED | HIGH | 0.10 | ADR-008 — pre-existing integration formalized; indexed search needed for scale; graceful degradation mitigates alpha risk |

---

## RELATED DOCUMENTS

- **Specification:** See `spec.md` (39 requirements across 5 workstreams)
- **Implementation Plan:** See `plan.md` (phased execution strategy)
- **Task Breakdown:** See `tasks.md` (individual tasks per workstream)
- **Verification Checklist:** See `checklist.md` (per-fix verification)
- **Audit Evidence:** See `scratch/MASTER-ANALYSIS.md`

---

<!--
LEVEL 3+ DECISION RECORD
- v2.0: Preserves audit ADRs (001, 002) as historical
- Adds 5 remediation ADRs (003-007) with full Five Checks evaluation
- Session decision log for remediation phase
- All ADRs cross-reference audit findings by ID
-->

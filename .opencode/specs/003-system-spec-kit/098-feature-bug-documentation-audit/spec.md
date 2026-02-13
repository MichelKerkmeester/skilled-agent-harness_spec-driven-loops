<!-- SPECKIT_LEVEL: 3+ -->
# Feature Specification: System-Spec-Kit & MCP Memory Server — Comprehensive Remediation

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch + level3plus-govern | v2.2 -->

---

## EXECUTIVE SUMMARY

This specification defines the comprehensive remediation of 200+ issues discovered by a 20-agent parallel audit of the system-spec-kit skill and MCP memory server (spec 098 v1.x). The audit analyzed 664+ files, 22 MCP tools across 7 layers, and found 10 P0 critical issues (data loss, server crashes, infinite loops), 18 P1 high issues (broken features, dead code, race conditions), 12 completely non-functional features, 25 documentation-code misalignments (67.9% alignment rate), 14 parameter mismatches, 13 template defects, 5 architecture concerns, and 175 error handling issues across 64 files.

This spec transforms 098 from an audit report into an actionable remediation plan organized into 5 workstreams: Critical Safety (WS-1), Non-Functional Features (WS-2), Architecture Consolidation (WS-3), Documentation & Templates (WS-4), and Scripts & Data Integrity (WS-5). Every requirement traces to a specific audit finding. The target is zero P0 issues, zero P1 issues, documentation alignment ≥95%, and all 12 broken features restored to working state.

**Post-Audit Baseline (from specs 099/100):** 0 functional bugs fixed, 1 partially mitigated (P0-01 type safety), 966 regression tests added, 94% unsafe cast reduction. 97% of audit findings remain valid and unresolved.

**Key Decisions:** Workstream-based organization for parallel execution; safety-first sequencing (WS-1 before WS-2); documentation updates deferred until code stabilizes (WS-4 after WS-1/2/3).

**Critical Dependencies:** All workstreams depend on the 966-test regression suite (spec 100) remaining green throughout remediation.

---

## 1. METADATA

| Field | Value |
|-------|-------|
| **Version** | 2.0 |
| **Level** | 3+ |
| **Priority** | P0 (10 data loss / crash / DoS issues unresolved) |
| **Status** | Complete |
| **Created** | 2026-02-09 (audit), 2026-02-10 (remediation rewrite) |
| **Branch** | TBD (per workstream) |
| **Estimated LOC** | 2,500–4,000 (across all workstreams) |
| **Complexity Score** | 90/100 |
| **Audit Evidence** | `scratch/MASTER-ANALYSIS.md`, `scratch/agent-01-*.md` through `scratch/agent-20-*.md` |

---

## 2. PROBLEM & PURPOSE

### Problem Statement

The 20-agent audit (spec 098 v1.x) revealed that the system-spec-kit skill and MCP memory server contain 10 critical safety defects (data loss on checkpoint restore, server crashes from null dereferences and unprotected DB operations, infinite loops, silent file skipping), 18 high-severity broken features, and 12 documented capabilities that are completely non-functional in code. Documentation-to-code alignment stands at 67.9%, meaning one-third of SKILL.md claims do not match implementation reality. Subsequent remediation efforts (specs 099 and 100) improved code quality and added 966 tests but fixed zero functional bugs — the system remains in the state the audit described.

### Purpose

Systematically fix every P0 and P1 issue, restore all 12 non-functional features, align documentation with code to ≥95%, correct all parameter mismatches, repair template progressive enhancement, and resolve architectural concerns — while maintaining the 966-test regression suite at 100% pass rate throughout.

---

## 3. SCOPE

### In Scope

| Category | Item Count | Source |
|----------|-----------|--------|
| P0 Critical issues | 10 | Audit findings P0-01 through P0-10 |
| P1 High issues | 18 | Audit findings P1-01 through P1-18 |
| Broken/non-functional features | 12 | Audit §4 (Broken Features Summary) |
| Documentation-code misalignments | 25 | Audit §5 (67.9% alignment → target ≥95%) |
| Tool parameter mismatches | 14 across 8 tools | Audit §5, Agent 17 |
| Template defects | 13 (2 critical, 3 major) | Audit §8, Agent 18 |
| Architecture concerns | 5 systemic | Audit §7 |
| Error handling issues | 175 across 64 files (7 critical) | Audit §6, Agent 19 |

### Out of Scope

- **P2/LOW severity issues** — 60+ medium and 80+ low findings deferred to future spec
- **New features** — No new capabilities; this is fix-only
- **Performance benchmarks** — Audit noted performance concerns but measurement is separate work
- **Security penetration testing** — Surface-level security gaps addressed where they overlap with P0/P1
- **sqlite-vec migration** — Noted in P1-07 as architectural concern; full migration is a separate spec (may be referenced by WS-3 for design decisions)
- **UI/UX changes** — MCP tool interfaces preserved; no breaking API changes unless required for safety

### Files to Change (Estimated)

| Workstream | Primary Files | Change Type |
|------------|--------------|-------------|
| WS-1 | checkpoints.ts, confidence-tracker.ts, memory-index.ts, batch-processor.ts, vector-index-impl.js, 6+ getDb() call sites | Fix (safety) |
| WS-2 | memory-triggers.ts, causal-graph.ts, memory-search.ts, session-learning.ts, context handlers, working-memory.ts | Fix (features) |
| WS-3 | context-server.ts, attention-decay.ts, fsrs-scheduler.ts, working-memory.ts, vector-index-impl.js, shared/ duplicates | Refactor |
| WS-4 | SKILL.md, 22 tool inputSchemas, 70+ template files | Documentation |
| WS-5 | check-sections.sh, content-filter.ts, workflow.ts, 10 rule scripts | Fix (scripts) |

---

## 4. REQUIREMENTS

### WS-1: Critical Safety (P0 — Data Loss & Crash Prevention)

| ID | Requirement | Audit Ref | Severity | Effort | Acceptance Criteria |
|----|------------|-----------|----------|--------|---------------------|
| REQ-101 | Transaction-wrap checkpoint restore to prevent data loss | P0-02 | P0 | Medium | Restore wrapped in SQLite transaction; failed restore rolls back to pre-restore state; test: corrupt checkpoint → verify data intact |
| REQ-102 | Refresh BM25, trigger cache, and vector indexes after checkpoint restore | P0-03 | P0 | Medium | After restore, `memory_search` and `memory_match_triggers` return restored memories without server restart; test: restore → search → verify results |
| REQ-103 | Add try/catch to all 7 DB operations in confidence-tracker.ts | P0-06 | P0 | Low | Every database operation wrapped with graceful degradation (log error, return safe default); no unhandled exceptions; test: simulate DB lock → verify server continues |
| REQ-104 | Add null guards for all vectorIndex.getDb() call sites | P0-07 | P0 | Medium | All 6+ call sites check for null return; either throw descriptive error or degrade gracefully; test: call before DB init → verify no crash |
| REQ-105 | Validate batchSize > 0 in batch processor | P0-08 | P0 | Low | batchSize ≤ 0 throws immediately with descriptive error; test: batchSize=0 → verify throws, no infinite loop |
| REQ-106 | Move mtime update to after successful indexing | P0-09 | P0 | Low | `batchUpdateMtimes()` called only for files that successfully indexed; test: fail one file in batch → verify it is retried on next scan |
| REQ-107 | Validate checkpoint JSON against schema before restore | P0-10 | P0 | Medium | Deserialized checkpoint data validated against memory_index schema; invalid data rejected with descriptive error before any DB mutation; test: corrupt JSON → verify rejection |

### WS-2: Non-Functional Features (Make Documented Features Work)

| ID | Requirement | Audit Ref | Severity | Effort | Acceptance Criteria |
|----|------------|-----------|----------|--------|---------------------|
| REQ-201 | Fix tiered content injection to properly classify HOT/WARM/COLD | P0-01 | P0 | Low | `classifyTier()` receives actual stability/last_review/importance_tier data; memories classified into correct tiers based on real scores; test: verify HOT ≠ 100% of results |
| REQ-202 | Add `id` field to FlatEdge type and include in drift_why response | P0-04 | P0 | Low | `memory_drift_why` returns edge IDs; `memory_causal_unlink` can consume those IDs; test: create edge → drift_why → unlink with returned ID → verify deleted |
| REQ-203 | Apply relations filter to drift_why traversal query | P0-05 | P0 | Low | When `relations` parameter provided, only matching relationship types returned; test: create edges with different types → filter → verify only matching returned |
| REQ-204 | Implement or honestly document cross-encoder reranking | P1-01 | P1 | Low–Med | Either: (a) implement actual cross-encoder reranking, OR (b) rename parameter and update all documentation to accurately describe keyword overlap scoring; test: verify documentation matches behavior |
| REQ-205 | Implement token budget enforcement | P1-02 | P1 | High | Each layer's token budget (L1=2000, L2=1500, etc.) actively enforced with truncation; output demonstrably within budget; test: large result set → verify truncated to budget |
| REQ-206 | Make archival system functional — check is_archived in search | P1-03 | P1 | Low | Archived memories excluded from search results by default; test: archive memory → search → verify not returned |
| REQ-207 | Prevent INSERT OR REPLACE from destroying learning records | P1-04 | P1 | Low | Re-preflight for existing spec_folder + task_id either: (a) rejects with error citing existing record, OR (b) creates versioned record; test: complete learning cycle → re-preflight → verify original data preserved |
| REQ-208 | Remove or implement turnNumber in trigger matching | P1-05 | P1 | Low | Either: (a) implement turn-based decay using turnNumber, OR (b) remove parameter from interface and documentation; test: verify parameter either affects behavior or is gone |
| REQ-209 | Call setAttentionScore for matched memories in trigger handler | P1-06 | P1 | Medium | When `memory_match_triggers` returns results, matched memories are added to working memory via setAttentionScore; test: match trigger → verify working memory updated |
| REQ-210 | Define and enforce actual limits for applyStateLimits | P1-09 | P1 | Medium | Per-tier quantity limits defined (e.g., max 5 HOT, 10 WARM, 3 COLD); when `applyStateLimits=true`, results respect limits; test: 20 results → apply limits → verify count per tier |
| REQ-211 | Connect applyLengthPenalty to scoring path | P1-10 | P1 | Low | When `applyLengthPenalty=true`, long memories receive score penalty; test: two identical-relevance memories of different lengths → verify shorter scores higher |
| REQ-212 | Apply checkpoint limit parameter to query | P1-13 | P1 | Low | `checkpoint_list` with `limit=5` returns at most 5 results; test: create 10 checkpoints → list with limit=5 → verify 5 returned |
| REQ-213 | Restore working memory state during checkpoint restore | P1-14 | P1 | Medium | Checkpoint restore includes working memory data captured during checkpoint creation; test: set working memory → checkpoint → clear → restore → verify working memory restored |
| REQ-214 | Fix decay/delete race condition in working memory | P1-12 | P1 | Low | Floor threshold and delete threshold separated (e.g., floor=0.05, delete=0.01); test: memory at floor → verify not immediately deleted |

### WS-3: Architecture Consolidation

| ID | Requirement | Audit Ref | Severity | Effort | Acceptance Criteria |
|----|------------|-----------|----------|--------|---------------------|
| REQ-301 | Design unified decay strategy (resolve 4 competing systems) | P1-11 | P1 | High | Single documented decay model selected; unused implementations deprecated or removed; all decay paths use consistent formula; decision recorded in decision-record.md |
| REQ-302 | Implement automatic session cleanup | P1-16 | P1 | Medium | `cleanupOldSessions()` called on schedule or trigger (e.g., server startup, periodic timer); sessions older than threshold removed; test: create old sessions → trigger cleanup → verify removed |
| REQ-303 | Plan context-server.ts decomposition | Architecture §7.2 | P1 | High | context-server.ts (868 lines) decomposed into logical modules (tool registration, dispatch, config); each module <300 lines; all 22 tools continue to register and function; all tests pass |
| REQ-304 | Consolidate duplicate code between shared/ and mcp_server/lib/ | Architecture §7.3 | P1 | Medium | folder-scoring, path-security, and embeddings logic exist in single canonical location; duplicates removed; all imports updated; tests pass |
| REQ-305 | Evaluate sqlite-vec for primary search path | P1-07 | P1 | High | Feasibility assessment completed; if viable: implement vector-indexed search replacing full table scan; if not viable: document rationale; decision recorded |
| REQ-306 | Evaluate async embedding generation | P1-08 | P1 | Medium | Embedding generation does not block Node.js event loop; either: (a) run in worker thread, OR (b) use async pipeline; test: trigger embedding during concurrent request → verify second request not blocked |

### WS-4: Documentation & Templates

| ID | Requirement | Audit Ref | Severity | Effort | Acceptance Criteria |
|----|------------|-----------|----------|--------|---------------------|
| REQ-401 | Fix all 25 documentation-code misalignments | Audit §5 | P1 | High | SKILL.md updated for every misalignment; 3 critical (constitutional behavior, cross-encoder, token budgets) fixed first; alignment rate measured ≥95% post-fix |
| REQ-402 | Fix all 14 tool parameter mismatches across 8 tools | Audit §5, Agent 17 | P1 | Medium | Every inputSchema matches TypeScript interface; 5 type mismatches resolved (number\|string → consistent type); trackAccess either exposed to MCP or removed from handler |
| REQ-403 | Fix 13 template defects including progressive enhancement | Audit §8, Agent 18 | P1 | Medium | L3+ implementation-summary.md enhanced beyond L1; L3+ tasks.md includes L2/L3 addendum sections; L3+ checklist.md includes L3 architecture/risk sections; all templates validate progressive enhancement |
| REQ-404 | Rewrite SKILL.md to match post-remediation reality | Audit §5, Agent 03 | P1 | High | Every feature claim verified against code; broken path references fixed; LOC contradictions resolved; version consistency (v2.2 everywhere); quality score ≥9.0/10 |
| REQ-405 | Resolve version inconsistency (templates v2.0 vs SKILL.md v2.2) | Audit §8, Agent 18 | P1 | Low | Single consistent version number across all templates and SKILL.md |
| REQ-406 | Fix hardcoded project path in L3 README template | Audit §8, Agent 18 | P1 | Low | Remove anobel.com reference; use generic placeholder or relative path |

### WS-5: Scripts & Data Integrity

| ID | Requirement | Audit Ref | Severity | Effort | Acceptance Criteria |
|----|------------|-----------|----------|--------|---------------------|
| REQ-501 | Fix shell script numeric comparison crash on "3+" | P1-18 | P1 | Low | `check-sections.sh` handles "3+" level string correctly (strip non-numeric, parse as integer ≥3); test: run on L3+ spec folder → no crash |
| REQ-502 | Enable quality scoring in generate-context workflow | P1-17 | P1 | Medium | `qualityScore()` in content-filter.ts returns meaningful score (not default); workflow.ts quality check not skipped; test: low-quality content → verify flagged |
| REQ-503 | Fix learning stats SQL to respect filters | P1-15 | P1 | Low | `memory_get_learning_history` summary stats correctly apply sessionId and onlyComplete filters; test: query with filters → verify filtered stats match filtered records |
| REQ-504 | Resolve `set -euo pipefail` override in rule scripts | Audit §8, Agent 05 | P1 | Low | Rule scripts use consistent error handling with orchestrator (either all use same flags, or orchestrator documents expected behavior); test: rule script failure → verify orchestrator handles correctly |
| REQ-505 | Fix INSERT OR REPLACE for learning records (script side) | P1-04 | P1 | Low | Scripts that trigger preflight use safe insert that preserves existing records; coordinated with REQ-207 (server side) |

---

## 5. SUCCESS CRITERIA

### Quantitative Targets

| Metric | Current State | Target | Measurement Method |
|--------|--------------|--------|-------------------|
| P0 issues open | 10 | 0 | All P0-01 through P0-10 verified fixed with regression tests |
| P1 issues open | 18 | 0 | All P1-01 through P1-18 verified fixed with regression tests |
| Broken features | 12 | 0 | Each feature demonstrated working via automated test |
| Doc-code alignment | 67.9% (53/78) | ≥95% (≥74/78) | Re-run alignment audit (Agent 16 methodology) |
| Parameter mismatches | 14 across 8 tools | 0 | All 22 tools: inputSchema = TypeScript interface = SKILL.md |
| Template defects | 13 | 0 | All templates validate progressive enhancement |
| Regression test suite | 966 tests passing | 966+ tests passing | Full test suite green after every workstream |
| Error handling (critical) | 7 unprotected paths | 0 | All critical code paths wrapped with try/catch |

### Qualitative Targets

- **SC-Q01:** Checkpoint restore is safe — a failed restore never loses data
- **SC-Q02:** Server does not crash from any database error, null dereference, or configuration mistake
- **SC-Q03:** Every documented feature in SKILL.md either works as described or documentation accurately reflects actual behavior
- **SC-Q04:** A developer reading SKILL.md can trust that parameter descriptions match actual code behavior
- **SC-Q05:** Template progressive enhancement is continuous — L3+ templates contain all content from L1+L2+L3+L3+

---

## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Likelihood | Mitigation |
|------|------|--------|------------|------------|
| **Dependency** | 966-test regression suite (spec 100) | All workstreams depend on tests staying green | — | Run full suite after every change; revert if tests break |
| **Dependency** | P0-01 partial mitigation (spec 099) | Type safety improvements may interact with REQ-201 fix | — | Review 099 changes before implementing; build on improvements, don't revert |
| **Risk** | Checkpoint schema migration | REQ-107 (schema validation) may reject existing checkpoints | High/Low | Provide migration path for existing checkpoints; version checkpoint format |
| **Risk** | Breaking changes to MCP tool interfaces | REQ-402 (parameter fixes) may break existing callers | High/Medium | Prefer additive changes; deprecate rather than remove; document migration |
| **Risk** | Decay system unification (REQ-301) side effects | Changing decay model affects all scoring behavior | High/Medium | A/B comparison: run old and new models side-by-side, verify equivalent or better results |
| **Risk** | context-server.ts decomposition (REQ-303) regression | 868-line monolith refactor touches all 22 tools | High/Medium | Incremental extraction (one module at a time); test suite must pass after each extraction |
| **Risk** | Remediation scope creep | 200+ issues tempt "while we're here" fixes beyond P0/P1 | Medium/High | Strict scope lock to P0+P1+broken features+misalignments; P2/LOW deferred to future spec |
| **Risk** | Concurrent workstream conflicts | WS-1 and WS-2 may touch same files (e.g., checkpoints.ts) | Medium/Medium | Workstream sequencing: WS-1 completes on checkpoint files before WS-2 starts on them |
| **Risk** | Test suite gaps | 966 tests may not cover the specific code paths being fixed | Medium/Medium | Each fix must include its own regression test; gap analysis before starting |

---

## 7. NON-FUNCTIONAL REQUIREMENTS

### Backward Compatibility

- **NFR-BC01:** All 22 MCP tool interfaces maintain backward compatibility — existing callers must continue to work
- **NFR-BC02:** Existing checkpoint files remain restorable (with migration if schema validation added)
- **NFR-BC03:** Memory files created by current system remain readable after remediation
- **NFR-BC04:** AGENTS.md references to MCP tools and memory workflows remain valid

### Regression Safety

- **NFR-RS01:** 966-test regression suite passes at 100% after every individual change
- **NFR-RS02:** Each P0/P1 fix includes at least one new regression test specific to the fixed behavior
- **NFR-RS03:** TypeScript compilation (`tsc --noEmit`) remains clean (0 errors, strict mode) throughout

### Code Quality

- **NFR-CQ01:** No new `as any` type escapes introduced
- **NFR-CQ02:** No new unsafe type casts (spec 099 eliminated 94% — maintain or improve)
- **NFR-CQ03:** All new database operations wrapped in try/catch with graceful degradation
- **NFR-CQ04:** All new code follows existing patterns and conventions in the codebase

### Documentation Quality

- **NFR-DQ01:** Every code change reflected in corresponding documentation update
- **NFR-DQ02:** SKILL.md updated atomically with feature changes (no interim misalignment)
- **NFR-DQ03:** Template changes validated by the spec-kit validation script

---

## 8. EDGE CASES

### Checkpoint Migration (REQ-101, REQ-107)

- **EC-01:** Existing checkpoint created before schema validation — must still restore successfully (migration path or version-aware validation)
- **EC-02:** Checkpoint restore fails mid-transaction — verify rollback leaves database in exact pre-restore state (not empty, not partially restored)
- **EC-03:** Checkpoint created from one database schema version, restored to another — detect version mismatch, provide clear error message
- **EC-04:** Very large checkpoint (10,000+ memories) — restore within reasonable time, transaction doesn't timeout

### Concurrent Sessions (REQ-302, REQ-209)

- **EC-05:** Multiple MCP clients connected simultaneously — session cleanup must not remove active sessions
- **EC-06:** Working memory updates from trigger matching (REQ-209) concurrent with search operations — no race condition on shared working memory state
- **EC-07:** Session dedup and working memory use different parameter naming (`sessionId` vs `session_id`) — unified after fix or explicitly documented

### Schema Evolution (REQ-107, REQ-301)

- **EC-08:** Decay model unification changes scoring behavior — memories that were previously HOT may become WARM; checkpoint created under old model restored under new model must not produce corrupt scores
- **EC-09:** New validation schema rejects a field that exists in production data — provide clear migration guidance, not silent data loss

### Feature Interaction

- **EC-10:** Tiered injection (REQ-201) + token budgets (REQ-205) — both affect output size; must compose correctly (tier filtering happens before budget enforcement)
- **EC-11:** Archive system (REQ-206) + checkpoint restore (REQ-102) — restored memories include archived ones; archived status must be preserved and respected post-restore
- **EC-12:** Causal unlink (REQ-202) called with edge ID from a previous drift_why that is now stale — provide clear "edge not found" error rather than silent no-op

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Justification |
|-----------|-------|---------------|
| **Scope** | 23/25 | 28 P0/P1 issues, 12 broken features, 25 misalignments, 14 param mismatches, 13 template defects, 175 error handling issues, 5 architecture concerns — touches 100+ files across 5 workstreams |
| **Risk** | 20/25 | Data loss prevention (checkpoints), server crash prevention, backward compatibility required, decay model unification affects all scoring, 868-line monolith decomposition |
| **Technical Depth** | 18/20 | SQLite transactions, vector indexing, embedding pipelines, FSRS scheduling, BM25 indexing, concurrent session management, schema validation, progressive enhancement |
| **Coordination** | 15/15 | 5 workstreams with inter-dependencies; WS-1 must complete before WS-2 on shared files; WS-4 depends on WS-1/2/3 completion; regression suite gating on every change |
| **Verification** | 14/15 | 966 existing tests + new regression tests per fix; alignment re-audit required; template validation; checkpoint migration testing; decay model comparison |
| **Total** | **90/100** | **Level 3+ (Threshold: 80)** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Probability | Severity | Mitigation |
|---------|-------------|--------|-------------|----------|------------|
| R-001 | Checkpoint restore fix (REQ-101) introduces new data loss path | Critical | Low | HIGH | Transaction-based approach with explicit rollback test; backup-before-delete pattern |
| R-002 | Decay unification (REQ-301) changes search ranking for all users | High | Medium | HIGH | A/B comparison with logged output; phased rollout; feature flag |
| R-003 | context-server.ts decomposition (REQ-303) breaks tool registration | High | Medium | HIGH | One module extracted per PR; full test suite after each extraction |
| R-004 | Parameter type fixes (REQ-402) break existing MCP callers | High | Low | MEDIUM | Accept both old and new types during transition; deprecation warnings |
| R-005 | Token budget enforcement (REQ-205) truncates critical information | Medium | Medium | MEDIUM | Truncation preserves constitutional memories; priority-based truncation (not random) |
| R-006 | Scope creep from 200+ issue catalog | Medium | High | MEDIUM | Strict P0/P1 scope lock; P2/LOW tracked in separate spec; reviewer enforcement |
| R-007 | Working memory restore (REQ-213) conflicts with active sessions | Medium | Low | LOW | Restore clears active working memory with warning; documented behavior |
| R-008 | Template fixes break existing spec folders | Low | Low | LOW | Templates are generative (used to create new specs); existing specs unaffected |
| R-009 | Shell script fixes incompatible with Bash 3.2 (macOS default) | Medium | Medium | MEDIUM | Test on Bash 3.2 and 5.x; avoid Bash 4+ features |
| R-010 | Remediation takes longer than estimated due to hidden complexity | Medium | Medium | MEDIUM | Workstream-based delivery; WS-1 (safety) ships independently of WS-3 (architecture) |

---

## 11. USER STORIES

### US-001: Developer Fixing the Memory System (Priority: P0)

**As a** developer implementing remediation fixes, **I want** a clear mapping from every audit finding to a specific requirement with acceptance criteria, **so that** I can systematically work through fixes without guessing scope or priority.

**Acceptance Criteria:**
1. Given any P0 finding (P0-01 through P0-10), When I look up the corresponding REQ, Then I find the file location, fix description, and testable acceptance criteria
2. Given any P1 finding (P1-01 through P1-18), When I look up the corresponding REQ, Then I find the workstream assignment, effort estimate, and verification method
3. Given completion of a workstream, When I verify against success criteria, Then quantitative metrics are measurable without subjective judgment

### US-002: User Recovering from Checkpoint Data Loss (Priority: P0)

**As a** user who relies on checkpoint restore for memory backup, **I want** restore operations to never destroy my data even when they fail, **so that** I can use checkpoints with confidence.

**Acceptance Criteria:**
1. Given a valid checkpoint, When I restore with clearExisting=true, Then my memories are replaced atomically (all-or-nothing)
2. Given a corrupt checkpoint, When restore fails, Then my original data is completely intact (no partial deletion)
3. Given a successful restore, When I search immediately after, Then restored memories appear in results without requiring server restart

### US-003: Maintainer Trusting Documentation (Priority: P1)

**As a** future maintainer of the system-spec-kit, **I want** SKILL.md to accurately describe what the code actually does, **so that** I can make informed decisions without reading every source file.

**Acceptance Criteria:**
1. Given any feature claim in SKILL.md, When I check the corresponding code, Then behavior matches documentation ≥95% of the time
2. Given any MCP tool parameter description, When I check the inputSchema and TypeScript interface, Then all three match exactly
3. Given any template at Level N, When I compare to Level N-1, Then Level N contains all Level N-1 content plus additions (progressive enhancement verified)

### US-004: AI Agent Using Memory System (Priority: P1)

**As an** AI agent consuming MCP memory tools, **I want** every documented parameter to actually affect behavior, **so that** I can rely on the API contract without trial-and-error.

**Acceptance Criteria:**
1. Given `applyStateLimits=true`, When I search, Then result counts are actually limited per tier
2. Given `relations=["caused"]` in drift_why, When I query, Then only "caused" relationships are returned
3. Given `turnNumber=5` in match_triggers, When I query, Then it either affects decay scoring or the parameter doesn't exist in the interface

---

## 12. APPROVAL WORKFLOW

| Checkpoint | Approver | Status | Date | Notes |
|------------|----------|--------|------|-------|
| Spec Review (v2.0 remediation rewrite) | Maintainer | Pending | — | This document |
| WS-1 Design Review (Critical Safety) | Maintainer | Pending | — | Checkpoint restore transaction design |
| WS-2 Design Review (Feature Fixes) | Maintainer | Pending | — | Decay unification decision |
| WS-3 Design Review (Architecture) | Maintainer | Pending | — | context-server.ts decomposition plan |
| WS-1 Implementation Review | Maintainer | Pending | — | All P0 safety fixes |
| WS-2 Implementation Review | Maintainer | Pending | — | All feature restorations |
| WS-3 Implementation Review | Maintainer | Pending | — | Architecture changes |
| WS-4 Documentation Review | Maintainer | Pending | — | SKILL.md, templates, parameters |
| WS-5 Scripts Review | Maintainer | Pending | — | Shell/TS script fixes |
| Final Verification | Maintainer | Pending | — | All success criteria met, full test suite green |

---

## 13. COMPLIANCE CHECKPOINTS

### Safety Compliance

- [ ] All P0 data loss risks eliminated (REQ-101, REQ-106, REQ-107)
- [ ] All server crash paths protected (REQ-103, REQ-104, REQ-105)
- [ ] Checkpoint restore verified safe under failure conditions (EC-01 through EC-04)
- [ ] No unvalidated data injected into database (REQ-107)

### Code Compliance

- [ ] TypeScript strict mode compilation clean (0 errors) after all changes
- [ ] No new `as any` type escapes (NFR-CQ01)
- [ ] No new unsafe type casts (NFR-CQ02)
- [ ] All new DB operations have try/catch (NFR-CQ03)
- [ ] 966+ regression tests passing (NFR-RS01)

### Documentation Compliance

- [ ] SKILL.md alignment ≥95% (REQ-401)
- [ ] All 22 tool parameter schemas match code (REQ-402)
- [ ] All templates validate progressive enhancement (REQ-403)
- [ ] Version numbers consistent across all files (REQ-405)

### Process Compliance

- [ ] Every fix has corresponding regression test (NFR-RS02)
- [ ] Every requirement traces to audit finding ID
- [ ] Change log updated for each workstream completion
- [ ] Design reviews completed before implementation (approval workflow)

---

## 14. STAKEHOLDER MATRIX

| Stakeholder | Role | Interest Level | Communication | Responsibility |
|-------------|------|---------------|---------------|----------------|
| Maintainer | Engineering lead, sole approver | High | Direct review of all workstream PRs, design decisions | Approve spec, review designs, accept/reject fixes |
| Future Contributors | Development | Medium | Reference remediation spec before modifying system-spec-kit | Follow established patterns, don't re-introduce fixed bugs |
| AI Agents | Automated consumers of MCP tools | High | Rely on accurate tool documentation and predictable behavior | Consume fixed tools, validate behavior matches documentation |
| Spec-Kit Users | Create/maintain spec folders | Medium | Affected by template fixes (WS-4) and script fixes (WS-5) | Report any regressions in spec folder workflows |

---

## 15. CHANGE LOG

### v1.0 (2026-02-09) — Original Audit Spec
- Defined 20-agent audit scope across 4 workstreams
- Established Pattern C file-based output strategy
- Created requirements for 22 MCP tool coverage

### v1.1 (2026-02-09) — Audit Complete
- 20 agents completed, 200+ issues found (10 P0, 18 P1, 60+ P2, 80+ low)
- Documentation alignment measured at 67.9%
- Status: Complete (audit phase)

### v1.2 (2026-02-10) — Post-Audit Cross-Reference
- Cross-referenced findings against specs 099/100
- Result: 0 functional bugs fixed, 97% of findings remain valid
- Added `scratch/CROSS-REFERENCE-099-100.md`

### v2.0 (2026-02-10) — Remediation Rewrite (THIS VERSION)
- **COMPLETE REWRITE:** Transformed from audit report to remediation plan
- Organized 200+ findings into 5 workstreams (WS-1 through WS-5)
- Created 39 specific requirements (REQ-101 through REQ-505) with acceptance criteria
- Each requirement traces to audit finding ID (P0-xx, P1-xx, or section reference)
- Added quantitative success criteria (0 P0, 0 P1, ≥95% alignment, all features working)
- Added risk matrix, edge cases, complexity assessment, user stories
- Added approval workflow with per-workstream gates
- Estimated 2,500–4,000 LOC across all workstreams
- Complexity score: 90/100 (up from 85 — remediation is harder than audit)
- Status: Draft (pending maintainer approval)

---

## 16. OPEN QUESTIONS

| ID | Question | Context | Impact | Status |
|----|----------|---------|--------|--------|
| OQ-01 | Should the 4 competing decay systems be unified into a single model, or should one be designated primary with others deprecated? | REQ-301 — affects WS-3 architecture decisions and all scoring behavior | High — answer determines WS-3 scope and risk | Resolved — ADR-004 accepted FSRS v4 as canonical; implemented in spec 101 |
| OQ-02 | Should `rerank` parameter be renamed to `keywordRerank` (honesty) or should actual cross-encoder be implemented? | REQ-204 — affects WS-2 effort (Low vs High) and WS-4 documentation | Medium — naming vs implementation decision | Resolved — ADR-006 chose "implement don't remove"; rerank behavior implemented in spec 101 |
| OQ-03 | Should sqlite-vec be adopted for primary vector search, or is full-table-scan acceptable at current scale (~500-2000 memories)? | REQ-305 — affects WS-3 scope significantly | High — major implementation if yes | Resolved — ADR-008 accepted sqlite-vec v0.1.7-alpha.2; already integrated, formalized in spec 103 |
| OQ-04 | Should checkpoint format be versioned to support schema evolution? | REQ-107, EC-01, EC-03 — affects checkpoint migration strategy | Medium — determines if existing checkpoints need migration | Resolved — ADR-005 checkpoint safety pattern implemented in spec 101 (WS-1); schema validation added |
| OQ-05 | Should workstreams be executed sequentially (WS-1→2→3→4→5) or can some run in parallel? | Affects timeline and coordination complexity | Medium — parallel execution faster but riskier | Resolved — ADR-003 sequencing adopted; WS-1→WS-2→WS-3 sequential, WS-4/WS-5 after code stable; executed across specs 101–103 |
| OQ-06 | Should the 175 non-critical error handling issues (Agent 19) be included in scope or deferred? | Currently out of scope (only 7 critical in WS-1); 168 remaining are medium/low | Low — scope creep risk if included | Resolved — Deferred as recommended; only 7 critical paths addressed in WS-1 (spec 101); remaining tracked for future spec |
| OQ-07 | What is the target timeline for full remediation? | Affects workstream sizing and parallelization decisions | Medium — determines if phased delivery needed | Resolved — Remediation completed across specs 099–103 (2026-02-09 to 2026-02-10); phased delivery adopted per ADR-003 |

---

## 17. AUDIT EVIDENCE REFERENCE

All remediation requirements trace back to the comprehensive audit conducted under spec 098 v1.x. The following evidence artifacts are preserved in `scratch/`:

### Master Analysis

| Document | Description |
|----------|-------------|
| `scratch/MASTER-ANALYSIS.md` | Synthesized report of all 200+ findings with severity ratings, root causes, and fix recommendations |
| `scratch/CROSS-REFERENCE-099-100.md` | Post-audit analysis confirming 97% of findings remain valid after specs 099/100 |

### Individual Agent Reports

| Agent | Report File | Domain | Key Finding |
|-------|------------|--------|-------------|
| 01 | `scratch/agent-01-*.md` | File tree mapping | Duplicate code between shared/ and mcp_server/lib/ |
| 02 | `scratch/agent-02-*.md` | MCP server structure | Alpha deps, no build scripts, no devDependencies |
| 03 | `scratch/agent-03-*.md` | SKILL.md audit | 16 issues (2 critical: broken path, LOC contradiction) |
| 04 | `scratch/agent-04-*.md` | Server bootstrap | Monolithic context-server.ts (868 lines) |
| 05 | `scratch/agent-05-*.md` | Scripts analysis | 9 HIGH TS bugs, 5 CRITICAL shell bugs |
| 06 | `scratch/agent-06-*.md` | Vector search | Cross-encoder is keyword overlap; full table scan |
| 07 | `scratch/agent-07-*.md` | Memory save/index | Premature mtime update (P0-09) |
| 08 | `scratch/agent-08-*.md` | Trigger matching | Tiered injection non-functional (P0-01) |
| 09 | `scratch/agent-09-*.md` | Causal graph | drift_why→unlink broken (P0-04); relations filter decorative (P0-05) |
| 10 | `scratch/agent-10-*.md` | Checkpoint system | Data loss on failed restore (P0-02, P0-03) |
| 11 | `scratch/agent-11-*.md` | Learning system | INSERT OR REPLACE destroys records (P1-04) |
| 12 | `scratch/agent-12-*.md` | Session dedup | No unified lifecycle; cleanup never called (P1-16) |
| 13 | `scratch/agent-13-*.md` | Decay/scoring | 4 competing systems (P1-11); race condition (P1-12) |
| 14 | `scratch/agent-14-*.md` | Memory lifecycle | Archival system inert (P1-03) |
| 15 | `scratch/agent-15-*.md` | Context retrieval | Token budgets decorative (P1-02) |
| 16 | `scratch/agent-16-*.md` | Doc vs code features | 67.9% alignment; 3 critical misalignments |
| 17 | `scratch/agent-17-*.md` | Tool parameters | 14 mismatches across 8 tools |
| 18 | `scratch/agent-18-*.md` | Templates | 13 issues; L3+ progressive enhancement broken |
| 19 | `scratch/agent-19-*.md` | Error handling | 175 issues; 7 critical unprotected code paths |
| 20 | `scratch/agent-20-*.md` | TS compilation | Clean compilation; 1 advisory vulnerability |

### Traceability Matrix (Audit Finding → Requirement)

| Audit Finding | Requirement(s) | Workstream |
|--------------|----------------|------------|
| P0-01 | REQ-201 | WS-2 |
| P0-02 | REQ-101 | WS-1 |
| P0-03 | REQ-102 | WS-1 |
| P0-04 | REQ-202 | WS-2 |
| P0-05 | REQ-203 | WS-2 |
| P0-06 | REQ-103 | WS-1 |
| P0-07 | REQ-104 | WS-1 |
| P0-08 | REQ-105 | WS-1 |
| P0-09 | REQ-106 | WS-1 |
| P0-10 | REQ-107 | WS-1 |
| P1-01 | REQ-204 | WS-2 |
| P1-02 | REQ-205 | WS-2 |
| P1-03 | REQ-206 | WS-2 |
| P1-04 | REQ-207, REQ-505 | WS-2, WS-5 |
| P1-05 | REQ-208 | WS-2 |
| P1-06 | REQ-209 | WS-2 |
| P1-07 | REQ-305 | WS-3 |
| P1-08 | REQ-306 | WS-3 |
| P1-09 | REQ-210 | WS-2 |
| P1-10 | REQ-211 | WS-2 |
| P1-11 | REQ-301 | WS-3 |
| P1-12 | REQ-214 | WS-2 |
| P1-13 | REQ-212 | WS-2 |
| P1-14 | REQ-213 | WS-2 |
| P1-15 | REQ-503 | WS-5 |
| P1-16 | REQ-302 | WS-3 |
| P1-17 | REQ-502 | WS-5 |
| P1-18 | REQ-501 | WS-5 |
| 25 doc misalignments | REQ-401 | WS-4 |
| 14 param mismatches | REQ-402 | WS-4 |
| 13 template defects | REQ-403, REQ-405, REQ-406 | WS-4 |
| SKILL.md quality | REQ-404 | WS-4 |
| 4 competing decay systems | REQ-301 | WS-3 |
| Monolithic context-server.ts | REQ-303 | WS-3 |
| Duplicate code | REQ-304 | WS-3 |
| No session cleanup | REQ-302 | WS-3 |
| Full table scan search | REQ-305 | WS-3 |
| Shell script compatibility | REQ-501, REQ-504 | WS-5 |

---

## RELATED DOCUMENTS

- **Implementation Plan:** See `plan.md` (to be updated for remediation)
- **Task Breakdown:** See `tasks.md` (to be updated for remediation)
- **Verification Checklist:** See `checklist.md` (to be updated for remediation)
- **Decision Records:** See `decision-record.md` (to be updated for remediation)
- **Audit Master Analysis:** See `scratch/MASTER-ANALYSIS.md`
- **Audit Agent Reports:** See `scratch/agent-01-*.md` through `scratch/agent-20-*.md`
- **Post-Audit Cross-Reference:** See `scratch/CROSS-REFERENCE-099-100.md`
- **Prior Remediation Specs:** Spec 099 (memory-cleanup), Spec 100 (test-coverage)

---

<!--
LEVEL 3+ REMEDIATION SPEC (~500 lines)
- v2.0: Complete rewrite from audit report to remediation plan
- Core + L2 + L3 + L3+ addendums applied
- 39 requirements across 5 workstreams (WS-1 through WS-5)
- Full traceability: every requirement → audit finding → agent report
- Approval workflow with per-workstream gates
- Complexity: 90/100 (remediation harder than audit)
- Target: 0 P0, 0 P1, ≥95% alignment, all 12 features working
-->

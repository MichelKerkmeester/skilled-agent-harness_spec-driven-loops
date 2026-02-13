# Implementation Plan: System-Spec-Kit & MCP Memory Server — Comprehensive Remediation

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify + level3-arch + level3plus-govern | v2.2 -->

---

## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (strict mode), Node.js, JavaScript, Shell (Bash) |
| **Framework** | MCP Protocol (Model Context Protocol) over stdio transport |
| **Storage** | SQLite (better-sqlite3) + sqlite-vec 0.1.7-alpha.2 for vector storage |
| **Testing** | Custom test framework — 966 regression tests (spec 100) + 75 type-safety tests (spec 099) |
| **Baseline** | 97% of 200+ audit findings remain valid; 0 functional bugs fixed by specs 099/100 |

### Overview

This plan defines the phased approach to fix all P0 critical issues (10), P1 high issues (18), broken features (12), documentation misalignments (25), parameter mismatches (14), template defects (13), and architecture concerns (5) discovered by the 20-agent audit (spec 098 v1.x). Work is organized into 5 workstreams executed across 5 phases, with safety-first sequencing ensuring data loss and crash paths are eliminated before feature restoration begins.

**Guiding Principles:**
1. **Safety first** — Eliminate data loss and crash risks (WS-1) before anything else
2. **Red-green testing** — Every fix must have a test that FAILS before and PASSES after
3. **No regressions** — 966-test suite stays green after every individual change
4. **Incremental delivery** — Each workstream ships independently; no big-bang merge

---

## 2. QUALITY GATES

### Definition of Ready (per workstream)

- [ ] All relevant audit findings read and understood (scratch/MASTER-ANALYSIS.md + agent reports)
- [ ] Affected source files read and current behavior verified
- [ ] Fix approach designed with specific code changes identified
- [ ] Regression test plan written (which tests to add/modify)
- [ ] Risk assessment completed (breaking changes, migration needs)

### Definition of Done (per fix)

- [ ] Code change implemented
- [ ] New regression test written that would FAIL on the old code
- [ ] All 966+ existing tests still pass
- [ ] TypeScript compilation clean (`tsc --noEmit` — 0 errors, strict mode)
- [ ] No new `as any` or unsafe type casts introduced
- [ ] SKILL.md/documentation updated if behavior changed (WS-4 coordination)
- [ ] Fix verified against specific acceptance criteria from spec.md

---

## 3. ARCHITECTURE

### Remediation Pattern

Workstream-based incremental fixes with phase gating. Each workstream targets a coherent subsystem so changes compose cleanly and can be tested in isolation.

### Fix Strategy Per Category

| Category | Strategy | Example |
|----------|----------|---------|
| Data loss risk | Transaction wrapping + backup-before-delete | P0-02: Checkpoint restore |
| Server crash | Try/catch + null guards + input validation | P0-06, P0-07, P0-08 |
| Silent failure | Move validation/update to correct position | P0-09: mtime after indexing |
| Non-functional feature | Fix root cause (type cast, missing call, etc.) | P0-01: tiered injection |
| Dead code parameter | Implement documented behavior | P1-05: turnNumber |
| Doc-code mismatch | Fix docs if aspirational, fix code if broken | P1-01: cross-encoder |
| Architecture concern | Evaluate → Decide → Implement or document | P1-11: decay unification |

---

## 4. IMPLEMENTATION PHASES

### Phase 1: Critical Safety [WS-1] — Estimated 2-3 days

**Goal:** Eliminate all data loss paths and server crash risks.

| Task | Audit Ref | Files | Fix Approach | Effort | Risk |
|------|-----------|-------|-------------|--------|------|
| Transaction-wrap checkpoint restore | P0-02 | `checkpoints.ts` | Wrap clearExisting + restore in SQLite transaction; rollback on any failure | Medium | HIGH — test with corrupt checkpoint |
| Rebuild indexes after restore | P0-03 | `checkpoints.ts`, `vector-index-impl.js`, `bm25` module | Call BM25 rebuild, trigger cache refresh, vector index reload after successful restore | Medium | MEDIUM — verify all 3 index types |
| Error-protect confidence-tracker | P0-06 | `confidence-tracker.ts` | Add try/catch to all 7 DB operations; log error + return safe default | Low | LOW — straightforward wrapping |
| Null-guard getDb() calls | P0-07 | 6+ call sites across mcp_server/ | Add null check before every `getDb()` call; throw descriptive error or degrade | Medium | LOW — mechanical but many sites |
| Validate batchSize | P0-08 | `batch-processor.ts` | Add `if (batchSize <= 0) throw new Error(...)` at entry | Low | LOW — one-line fix |
| Move mtime after indexing | P0-09 | `memory-index.ts` | Move `batchUpdateMtimes()` call to after successful indexing; only update mtime for files that succeeded | Low | MEDIUM — verify incremental scan still works |
| Validate checkpoint JSON schema | P0-10 | `checkpoints.ts` | Define schema for memory_index rows; validate deserialized data before INSERT; reject invalid with descriptive error | Medium | MEDIUM — need migration path for old checkpoints |

**Phase Gate:** All 7 P0 safety issues verified fixed. Regression suite green. Checkpoint restore tested with: valid data, corrupt data, empty checkpoint, large checkpoint (1000+ memories).

### Phase 2: Feature Activation [WS-2] — Estimated 3-4 days

**Goal:** Make all 12 documented features actually work.

**Depends on:** Phase 1 complete (shared files: checkpoints.ts)

| Task | Audit Ref | Files | Fix Approach | Effort | Risk |
|------|-----------|-------|-------------|--------|------|
| Fix tiered content injection | P0-01 | `memory-triggers.ts` | Remove double type-cast; pass proper objects with stability/last_review/importance_tier to `classifyTier()` | Low | LOW — type fix |
| Add id to FlatEdge | P0-04 | `causal-graph.ts` | Add `id` field to FlatEdge type; populate from SQL edge_id | Low | LOW — additive |
| Apply relations filter | P0-05 | `causal-graph.ts` | Add WHERE clause to traversal query filtering by relation type when `relations` provided | Low | LOW — SQL addition |
| Resolve cross-encoder naming | P1-01 | SKILL.md, search handler | Rename to `keywordRerank` OR implement real cross-encoder. **Decision needed (OQ-02)** | Low-Med | LOW |
| Implement token budget enforcement | P1-02 | Context handlers, search handlers | Add truncation logic per layer; priority-based (constitutional first, then by score) | High | MEDIUM — affects output size |
| Activate archival in search | P1-03 | `memory-search.ts`, `vector-index-impl.js` | Add `WHERE is_archived = 0` (or equivalent) to search queries; respect flag | Low | LOW — SQL filter |
| Protect learning records | P1-04 | `session-learning.ts` | Replace INSERT OR REPLACE with INSERT; check for existing record first; error if exists | Low | LOW — logic change |
| Resolve turnNumber | P1-05 | `memory-triggers.ts` | Implement turn-based decay using turnNumber, OR remove from interface. **Lean: implement** | Low | LOW |
| Wire setAttentionScore | P1-06 | `memory-triggers.ts`, `working-memory.ts` | Call `setAttentionScore()` for matched memories after trigger match | Medium | MEDIUM — integration point |
| Define applyStateLimits | P1-09 | Search handler | Define per-tier limits (e.g., max 5 HOT, 10 WARM, 3 COLD); enforce when parameter is true | Medium | LOW |
| Connect applyLengthPenalty | P1-10 | Scoring module | Add length-based penalty factor when parameter is true | Low | LOW |
| Apply checkpoint limit | P1-13 | `checkpoints.ts` | Add `LIMIT ?` to checkpoint_list SQL query | Low | LOW — one-line |
| Restore working memory | P1-14 | `checkpoints.ts`, `working-memory.ts` | During restore, feed captured working memory data back into working memory module | Medium | MEDIUM |
| Fix decay/delete race | P1-12 | `working-memory.ts` | Separate floor threshold (0.05) from delete threshold (0.01) | Low | LOW |

**Phase Gate:** All 14 feature issues verified. Each feature has a test demonstrating it works. Regression suite green.

### Phase 3: Architecture Consolidation [WS-3] — Estimated 4-5 days

**Goal:** Resolve systemic architecture concerns.

**Depends on:** Phase 1 complete. Can overlap Phase 2 on non-shared files.

| Task | Audit Ref | Files | Fix Approach | Effort | Risk |
|------|-----------|-------|-------------|--------|------|
| Unify decay systems | P1-11 | `attention-decay.ts`, `fsrs-scheduler.ts`, `working-memory.ts`, `vector-index-impl.js` | Designate FSRS v4 as canonical long-term decay; keep working-memory linear for short-term; deprecate exponential and SQL half-life | High | HIGH — affects all scoring |
| Auto session cleanup | P1-16 | Session module, server bootstrap | Call `cleanupOldSessions()` on server startup + periodic timer (e.g., every 30 min); configurable threshold | Medium | LOW |
| Decompose context-server.ts | Arch §7.2 | `context-server.ts` → multiple modules | Extract tool registration, dispatch, config into separate files; each <300 lines; incremental (one module per PR) | High | HIGH — touches all 22 tools |
| Consolidate duplicates | Arch §7.3 | `shared/`, `mcp_server/lib/` | Identify canonical location for folder-scoring, path-security, embeddings; redirect imports; delete duplicates | Medium | MEDIUM |
| Evaluate sqlite-vec search | P1-07 | `vector-index-impl.js`, search handler | Feasibility study: Can sqlite-vec replace JS cosine similarity? Prototype + benchmark. **Decision needed (OQ-03)** | High | HIGH |
| Async embedding generation | P1-08 | Embedding module | Move embedding computation to worker thread or async pipeline; verify server remains responsive during indexing | Medium | MEDIUM |

**Phase Gate:** Decay system unified (or decision documented). context-server.ts modularized. Duplicate code consolidated. Session cleanup operational. Regression suite green.

### Phase 4: Documentation & Templates [WS-4] — Estimated 2 days

**Goal:** Align all documentation with post-remediation code reality.

**Depends on:** Phases 1-3 substantially complete (fixes documentation to match fixed code).

| Task | Audit Ref | Files | Fix Approach | Effort |
|------|-----------|-------|-------------|--------|
| Fix 25 doc-code misalignments | §5 | SKILL.md | Rewrite each misaligned section to match actual (fixed) code behavior | High |
| Fix 14 parameter mismatches | Agent 17 | 8 tool inputSchemas + SKILL.md | Align every inputSchema with TypeScript interface; resolve 5 type mismatches | Medium |
| Fix 13 template defects | Agent 18 | 70+ template files | Restore progressive enhancement chain for L3+ templates; fix missing addendum layers | Medium |
| Comprehensive SKILL.md rewrite | Agent 03 | SKILL.md | Fix broken path references, LOC contradictions, version numbers; target quality ≥9.0/10 | High |
| Version alignment | Agent 18 | Templates + SKILL.md | Unify version to v2.2 (or v3.0 post-remediation) across all files | Low |
| Fix L3 README path | Agent 18 | L3 README template | Remove hardcoded anobel.com reference; use generic placeholder | Low |

**Phase Gate:** Doc-code alignment re-audited at ≥95%. All 22 tool schemas match interfaces. Template progressive enhancement validated. Regression suite green.

### Phase 5: Scripts & Data Integrity [WS-5] — Estimated 2 days

**Goal:** Fix remaining script bugs and data integrity issues.

**Can run in parallel with Phase 4.**

| Task | Audit Ref | Files | Fix Approach | Effort |
|------|-----------|-------|-------------|--------|
| Fix shell numeric comparison | P1-18 | `check-sections.sh` | Strip non-numeric suffix from "3+" before integer comparison | Low |
| Enable quality scoring | P1-17 | `content-filter.ts`, `workflow.ts` | Make qualityScore() return real value; remove workflow skip | Medium |
| Fix learning stats SQL | P1-15 | `session-learning.ts` | Apply sessionId and onlyComplete filters to summary statistics query | Low |
| Align shell error handling | Agent 05 | 10 rule scripts | Standardize `set` flags between orchestrator and rule scripts | Low |
| Safe learning record insert | P1-04 | Scripts that call preflight | Coordinate with REQ-207 server-side fix | Low |

**Phase Gate:** All script tests pass. Shell scripts work on Bash 3.2 (macOS) and 5.x. Learning stats verified with filtered queries. Regression suite green.

---

## 5. TESTING STRATEGY

### Red-Green Protocol

Every fix follows this sequence:
1. **Write failing test** — Test that exercises the bug/broken behavior and FAILS on current code
2. **Implement fix** — Minimal code change to fix the issue
3. **Verify test passes** — The new test now PASSES
4. **Run full suite** — All 966+ existing tests still PASS
5. **Run tsc** — TypeScript compilation still clean

### Test Categories

| Category | Scope | Count (est.) | Tools |
|----------|-------|-------------|-------|
| Safety regression | P0 fixes: crash, data loss, infinite loop | ~20 new tests | Custom test framework |
| Feature activation | Each formerly-broken feature works | ~25 new tests | Custom test framework |
| Architecture | Decay unification, modular server | ~10 new tests | Custom test framework |
| Documentation | Parameter schemas match handlers | ~5 validation tests | Schema comparison |
| Integration | End-to-end: checkpoint → search → restore | ~5 new tests | Custom test framework |

### Critical Test Scenarios

| Scenario | Tests | Phase |
|----------|-------|-------|
| Corrupt checkpoint restore → data intact | Corrupt JSON, schema mismatch, truncated data | Phase 1 |
| getDb() before init → graceful error | Call sequence before DB ready | Phase 1 |
| batchSize=0 → immediate error, no loop | Input validation boundary | Phase 1 |
| Tiered injection → mixed HOT/WARM/COLD | Memories with different ages and stability | Phase 2 |
| drift_why → unlink with returned ID | Full workflow test | Phase 2 |
| Archival excludes from search | Archive → search → verify absent | Phase 2 |
| Decay produces consistent scores | Same input → same score regardless of code path | Phase 3 |
| Server handles concurrent requests during embedding | Non-blocking verification | Phase 3 |

---

## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 966-test regression suite (spec 100) | Internal | Green | Cannot verify no-regression guarantee |
| Type safety improvements (spec 099) | Internal | Green | P0-01 partial fix is foundation for REQ-201 |
| better-sqlite3 transaction support | External | Green | Required for P0-02 transaction wrapping |
| sqlite-vec 0.1.7-alpha.2 | External | Yellow | Alpha-stage; P1-07 evaluation depends on stability |
| transformers.js | External | Green | P1-08 async evaluation depends on API |
| Bash 3.2 (macOS default) | Platform | Green | P1-18 shell fixes must be compatible |

---

## 7. ROLLBACK PLAN

### Per-Phase Rollback

| Phase | Rollback Strategy | Risk Level |
|-------|-------------------|------------|
| Phase 1 (Safety) | Git revert per-commit; each fix is an independent commit | LOW — safety fixes are additive |
| Phase 2 (Features) | Git revert per-commit; feature flags if needed | LOW — features are independent |
| Phase 3 (Architecture) | Git revert per-module extraction; incremental approach limits blast radius | MEDIUM — modularization has wider impact |
| Phase 4 (Docs) | Git revert; documentation changes are isolated from code | LOW |
| Phase 5 (Scripts) | Git revert per-script fix | LOW |

### Emergency Rollback

If the regression suite breaks and the cause is unclear:
1. `git stash` current changes
2. Verify clean test run on previous commit
3. Binary search (`git bisect`) to find breaking commit
4. Revert specific breaking commit
5. Re-apply stashed changes minus the breaking commit

---

## L2: PHASE DEPENDENCIES

```
Phase 1 (Safety) ──────────► Phase 2 (Features) ──────► Phase 5 (Scripts)
     │                              │                         │
     │                              │                         ▼
     └──────────► Phase 3 (Architecture) ──────► Phase 4 (Docs) ──► DONE
                  (can overlap Phase 2 on
                   non-shared files)
```

| Phase | Depends On | Blocks | Can Overlap |
|-------|------------|--------|-------------|
| Phase 1: Safety | None | Phase 2, Phase 3 | — |
| Phase 2: Features | Phase 1 (shared: checkpoints.ts) | Phase 4, Phase 5 | Phase 3 (non-shared files) |
| Phase 3: Architecture | Phase 1 | Phase 4 | Phase 2 (non-shared files) |
| Phase 4: Docs | Phase 1, 2, 3 substantially complete | — | Phase 5 |
| Phase 5: Scripts | Phase 2 (REQ-207 coordination) | — | Phase 4 |

---

## L2: EFFORT ESTIMATION

| Phase | Workstream | Task Count | Effort Estimate | Complexity |
|-------|------------|-----------|-----------------|------------|
| Phase 1 | WS-1: Critical Safety | 7 tasks | 2-3 days | High (transactions, indexes) |
| Phase 2 | WS-2: Feature Activation | 14 tasks | 3-4 days | Medium (varied fix types) |
| Phase 3 | WS-3: Architecture | 6 tasks | 4-5 days | High (decay unification, modularization) |
| Phase 4 | WS-4: Documentation | 6 tasks | 2 days | Medium (many files, low risk) |
| Phase 5 | WS-5: Scripts/Data | 5 tasks | 2 days | Low-Medium |
| **Total** | **5 workstreams** | **38 tasks** | **~13-19 days** | **Overall: High** |

---

## L2: ENHANCED ROLLBACK

### Pre-Change Checklist (per fix)

- [ ] Current file state read and understood
- [ ] Git status clean (no uncommitted changes from other fixes)
- [ ] Failing test written and confirmed failing
- [ ] Fix approach reviewed against acceptance criteria
- [ ] Backup plan identified (which commit to revert to)

### High-Risk Change Protocol (Phase 1: Checkpoints, Phase 3: Decay)

1. Create feature branch: `fix/ws1-checkpoint-safety` or `fix/ws3-decay-unification`
2. Implement fix with atomic commits (one logical change per commit)
3. Run full test suite after each commit
4. PR review before merge (if multi-person team) or self-review checklist
5. Merge to main only after phase gate passes

### Data Safety (Phase 1 specifically)

Before modifying checkpoint restore logic:
1. Create test checkpoint from current production data
2. Verify restore works with OLD code
3. Apply fix
4. Verify restore works with NEW code on SAME checkpoint
5. Verify corrupt checkpoint is rejected safely

---

## L3: DEPENDENCY GRAPH

```
┌─────────────────────────────────────────────────────────┐
│                    Phase 1: Critical Safety (WS-1)       │
│                         2-3 days                         │
│  P0-02  P0-03  P0-06  P0-07  P0-08  P0-09  P0-10      │
│  [checkpoint]  [error protect]  [validate]               │
└────────────────┬──────────────────┬──────────────────────┘
                 │                  │
                 ▼                  ▼
┌────────────────────────┐  ┌────────────────────────────┐
│ Phase 2: Features      │  │ Phase 3: Architecture      │
│ (WS-2) 3-4 days       │  │ (WS-3) 4-5 days           │
│                        │  │                            │
│ P0-01 P0-04 P0-05     │  │ P1-07  P1-08  P1-11       │
│ P1-01→P1-06            │  │ P1-16  Monolith  Dedup    │
│ P1-09→P1-14            │  │                            │
│                        │  │ (can overlap Phase 2 on    │
│                        │  │  non-shared files)         │
└──────────┬─────────────┘  └──────────┬─────────────────┘
           │                           │
           ▼                           ▼
┌────────────────────────┐  ┌────────────────────────────┐
│ Phase 5: Scripts       │  │ Phase 4: Documentation     │
│ (WS-5) 2 days         │  │ (WS-4) 2 days             │
│                        │  │                            │
│ P1-15 P1-17 P1-18     │  │ SKILL.md rewrite           │
│ Shell fixes            │  │ 25 misalignments           │
│ Data integrity         │  │ 14 param mismatches        │
│                        │  │ 13 template fixes          │
└────────────────────────┘  └────────────────────────────┘
           │                           │
           └───────────┬───────────────┘
                       ▼
              ┌─────────────────┐
              │   SHIP: v2.0    │
              │   All P0 = 0   │
              │   All P1 = 0   │
              │   Alignment ≥95%│
              └─────────────────┘
```

---

## L3: CRITICAL PATH

1. **Phase 1** (2-3 days) → CRITICAL — all other phases blocked until safety secured
2. **Phase 2** (3-4 days) → CRITICAL — features must work before docs can describe them
3. **Phase 3** (4-5 days) → Can overlap Phase 2 — not on critical path if started early
4. **Phase 4** (2 days) → CRITICAL — must wait for code to stabilize
5. **Phase 5** (2 days) → Can overlap Phase 4 — not on critical path

**Critical Path Duration:** Phase 1 (3d) + Phase 2 (4d) + Phase 4 (2d) = **~9 days minimum**
**Total Duration (with parallelism):** ~13 days
**Total Duration (sequential):** ~19 days

---

## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1: Safety Secured | All P0 data loss and crash paths eliminated | 0 P0 safety issues; checkpoint restore safe under failure; 966+ tests green | Phase 1 end |
| M2: Features Work | All 12 broken features restored to working state | Each feature demonstrated via test; all dead parameters either work or removed | Phase 2 end |
| M3: Architecture Clean | Systemic concerns resolved | Unified decay model; modular server; no duplicate code; session cleanup active | Phase 3 end |
| M4: Docs Aligned | Documentation matches code reality | Alignment ≥95%; all schemas match; templates valid; SKILL.md quality ≥9.0/10 | Phase 4 end |
| M5: Ship | All remediation complete | 0 P0, 0 P1, all features working, docs aligned, scripts fixed, all tests green | Phase 5 end |

---

## L3: ARCHITECTURE DECISION REFERENCES

| ADR | Topic | Status | Document |
|-----|-------|--------|----------|
| ADR-001 | 20 Parallel Agents (Audit) | Accepted (Historical) | decision-record.md |
| ADR-002 | Pattern C File-Based Output (Audit) | Accepted (Historical) | decision-record.md |
| ADR-003 | Remediation Strategy: Fix-by-Workstream | Accepted | decision-record.md |
| ADR-004 | Decay System Unification | Proposed | decision-record.md |
| ADR-005 | Checkpoint Safety Pattern | Proposed | decision-record.md |
| ADR-006 | Dead Parameter Resolution | Proposed | decision-record.md |
| ADR-007 | Documentation Alignment Strategy | Proposed | decision-record.md |

---

## L3+: AI EXECUTION FRAMEWORK

### Workstream Assignment for AI Agents

| Workstream | Recommended Agent | Approach | Key Files |
|------------|------------------|----------|-----------|
| WS-1 | @general (single focused agent) | Sequential — each fix builds on previous safety improvements | checkpoints.ts, confidence-tracker.ts, batch-processor.ts, memory-index.ts |
| WS-2 | @general (can split across 2-3 agents) | Parallel where files don't overlap | memory-triggers.ts, causal-graph.ts, search handlers, working-memory.ts |
| WS-3 | @general (single agent for consistency) | Sequential — architecture decisions affect subsequent changes | context-server.ts, decay modules, shared/, session modules |
| WS-4 | @general (documentation-focused) | Parallel (SKILL.md, schemas, templates are independent) | SKILL.md, inputSchemas, template files |
| WS-5 | @general (single agent) | Sequential — small scope | Shell scripts, content-filter.ts, workflow.ts |

### Pre-Task Checklist (Remediation)

Before starting ANY fix:
1. [ ] Read the specific audit finding (MASTER-ANALYSIS.md section)
2. [ ] Read the affected source file(s) completely
3. [ ] Read the relevant agent report for full context
4. [ ] Verify the bug still exists (it should — 97% remain valid)
5. [ ] Write failing test that demonstrates the bug
6. [ ] Confirm failing test actually fails
7. [ ] Design minimal fix
8. [ ] Implement fix
9. [ ] Verify test now passes
10. [ ] Run full regression suite
11. [ ] Run tsc --noEmit
12. [ ] Update checklist.md with evidence

### Execution Rules

| Rule | Description |
|------|-------------|
| FIX-SCOPE | One fix per commit. Do not bundle unrelated fixes. |
| FIX-TEST | Every fix has a corresponding test. No exceptions. |
| FIX-VERIFY | Run full suite after every fix. Stop immediately if tests break. |
| FIX-DOC | Note documentation impact for WS-4 coordination. |
| FIX-EVIDENCE | Record file:line of change and test name in checklist.md. |
| FIX-MINIMAL | Smallest change that fixes the issue. No opportunistic refactoring. |

---

## L3+: WORKSTREAM COORDINATION

### File Ownership (Conflict Prevention)

| File | WS-1 | WS-2 | WS-3 | WS-4 | WS-5 |
|------|------|------|------|------|------|
| checkpoints.ts | PRIMARY | Secondary (after WS-1 done) | — | — | — |
| confidence-tracker.ts | PRIMARY | — | — | — | — |
| memory-triggers.ts | — | PRIMARY | — | — | — |
| causal-graph.ts | — | PRIMARY | — | — | — |
| context-server.ts | — | — | PRIMARY | — | — |
| vector-index-impl.js | — | — | PRIMARY | — | — |
| SKILL.md | — | — | — | PRIMARY | — |
| check-sections.sh | — | — | — | — | PRIMARY |

**Rule:** PRIMARY workstream has write access. Secondary workstreams wait until PRIMARY completes on that file.

### Sync Points

| Sync ID | Trigger | Gate |
|---------|---------|------|
| SYNC-R01 | Phase 1 complete | All P0 safety fixes verified → unlock Phase 2 and Phase 3 |
| SYNC-R02 | Phase 2 substantially complete | All feature fixes verified → unlock Phase 4 (documentation can describe real behavior) |
| SYNC-R03 | Phase 3 substantially complete | Architecture decisions finalized → unlock Phase 4 (documentation reflects final architecture) |
| SYNC-R04 | Phases 4+5 complete | All fixes done → final verification and ship |

---

## L3+: COMMUNICATION PLAN

### Status Reporting

After each fix, update tasks.md with:
```
- [x] T### [WS-X] Description — Evidence: [test name], [file:line changed]
```

After each phase, update checklist.md with:
```
- [x] CHK-### [P0] Description — Evidence: [specific verification evidence]
```

### Blocker Escalation

| Severity | Response Time | Action |
|----------|--------------|--------|
| Test suite breaks | Immediate | Revert last commit; investigate |
| Fix harder than expected | 30 min timebox | Re-assess approach; consider alternatives |
| Architectural question | Before implementing | Record in decision-record.md; resolve before code |
| Cross-workstream conflict | Before implementing | File ownership rules apply; coordinate or sequence |

### Open Question Resolution

| OQ | Topic | Needed Before | Decision Venue |
|----|-------|---------------|----------------|
| OQ-02 | Cross-encoder: rename vs implement | Phase 2 (P1-01) | ADR in decision-record.md |
| OQ-03 | sqlite-vec adoption | Phase 3 (P1-07) | ADR in decision-record.md |
| OQ-04 | Checkpoint format versioning | Phase 1 (P0-10) | ADR in decision-record.md |
| OQ-05 | Workstream parallelism | Phase 2 start | Maintainer decision |

---

## L3+: VERIFICATION PROTOCOL

### Per-Fix Verification

1. **Before fix:** Read audit finding → Read source → Write failing test → Confirm test fails
2. **After fix:** Run new test → Confirm passes → Run full suite → Confirm all pass → Run tsc → Confirm clean
3. **Document:** Update checklist.md with `[x]` and evidence string

### Per-Phase Verification

1. **Phase gate criteria met** (see each phase section above)
2. **Regression suite:** 966+ tests passing
3. **TypeScript:** 0 errors, strict mode
4. **No new unsafe casts:** grep for `as any` and `as unknown as` — count must not increase

### Final Verification (M5: Ship)

1. All P0 issues: 10/10 fixed and verified
2. All P1 issues: 18/18 fixed and verified
3. All broken features: 12/12 working
4. Doc-code alignment: re-audit ≥95%
5. Parameter accuracy: 22/22 tools match
6. Template validation: progressive enhancement verified
7. Full test suite: 966+ N new tests, all green
8. TypeScript: 0 errors
9. No new unsafe casts

---

## RELATED DOCUMENTS

- **Specification:** See `spec.md` (remediation scope and requirements)
- **Task Breakdown:** See `tasks.md` (individual tasks per workstream)
- **Verification Checklist:** See `checklist.md` (per-fix verification)
- **Decision Records:** See `decision-record.md` (ADRs for remediation strategy)
- **Audit Evidence:** See `scratch/MASTER-ANALYSIS.md` and individual agent reports
- **Post-Audit Status:** See `scratch/CROSS-REFERENCE-099-100.md`

---

<!--
LEVEL 3+ REMEDIATION PLAN (~400 lines)
- v2.0: Complete rewrite from audit methodology to remediation plan
- 5 phases across 5 workstreams with safety-first sequencing
- Red-green testing protocol for every fix
- Full AI execution framework with pre-task checklist
- File ownership matrix for conflict prevention
- ~13-19 days estimated across 38 tasks
-->

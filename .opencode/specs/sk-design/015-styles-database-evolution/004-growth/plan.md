---
title: "Implementation Plan: Growth Architecture (10x-100x Scale)"
description: "Phased implementation plan for Roadmap Phase 3 of the sk-design styles-database evolution: SQL-parameter correctness first, then a gated approximation contract, a last-resort Rust ANN, and a spec-memory-gated shared core."
trigger_phrases:
  - "growth architecture styles database 10x 100x scale"
  - "eligible-id sql parameter limit hnsw ann"
  - "approximate search contract exact fallback rust"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-design/015-styles-database-evolution/004-growth"
    last_updated_at: "2026-07-20T09:19:14Z"
    last_updated_by: "spec-author"
    recent_action: "Author 004-growth Level 2 spec-folder docs"
    next_safe_action: "Await measured 10x-100x corpus-growth pressure before starting Phase A (SQL-parameter"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/styles/_db/retrieval.mjs"
      - ".opencode/skills/sk-design/styles/_db/vectors.mjs"
      - ".opencode/specs/sk-design/015-styles-database-evolution/spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-author-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Growth Architecture (10x-100x Scale)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | JavaScript (Node ESM) |
| **Storage** | SQLite + FTS5 via `node:sqlite` |
| **Search** | Maintained HNSW/ANN (approximate) with exact re-score + exact fallback; custom Rust ANN only as a last resort |
| **Testing** | Recall verification, exact-fallback verification, byte-parity where the exact path is claimed |

### Overview
This phase sequences Growth Architecture (Roadmap Phase 3) behind a measured 10x-100x corpus-growth gate. It fixes the eligible-ID SQL-parameter shape first, a correctness bug and not a performance question, then introduces a maintained HNSW/ANN under an explicit approximation contract, reserves a custom Rust ANN for a proven capability gap only, and gates any shared cross-skill Rust core on spec-memory materializing as a real second consumer.

<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Predecessor phase `003-measured-native` exit evidence available
- [ ] Measured 10x-100x corpus-growth pressure confirmed (or explicitly not yet, in which case the gate stays closed)
- [ ] Source research (`013-styles-database-rust-opportunities`) findings on parameter limits and ANN tradeoffs reviewed

### Definition of Done
- [ ] SQL-parameter correctness fix lands before any ANN work
- [ ] Approximation contract documented and versioned separately from the exact path
- [ ] Shared-core scoping decision (spec-memory second consumer, or none) recorded

<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Phased, gated roadmap child: correctness-first sequencing ahead of approximate search.

### Key Components
- **Eligible-ID query builder** (`retrieval.mjs`): the SQL-parameter shape being fixed
- **Vector search boundary** (`vectors.mjs`): where exact and (future) approximate search meet
- **Approximation contract**: the versioned, opt-in ANN capability with exact re-score + exact fallback
- **Custom Rust ANN (last resort)**: considered only after a maintained ANN proves insufficient
- **Shared cross-skill Rust core (gated)**: requires spec-memory as a real second consumer

### Data Flow
At 10x-100x, broad queries widen the eligible-ID set toward SQLite's 32,766-parameter limit, so the parameter shape is fixed first for correctness. Only then does a filter-aware HNSW/ANN produce approximate candidates; an exact re-score refines them and an exact fallback backstops the result. All of it publishes as a separately-versioned capability behind the Phase 0 manifest, leaving the exact path intact.

<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

N/A — planning packet, not a bug fix. This phase does not touch `research_intent=fix_bug` surfaces. The reference-only future surfaces this phase will eventually touch are listed in `spec.md` §3 Files to Change.

<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Entry Gate
- [ ] Measured 10x-100x corpus-growth pressure confirmed. Nothing below this triggers Phase 3 work

### Phase A: SQL-Parameter Correctness Fix
- [ ] Characterize the eligible-ID parameter shape at ~25.4% eligibility vs. the 32,766-variable limit
- [ ] Fix the parameter shape: correctness, before any ANN work

### Phase B: Maintained HNSW/ANN Under the Approximation Contract
- [ ] Introduce a maintained HNSW/ANN with filter-aware recall
- [ ] Ship it as a separately-versioned capability with exact re-score
- [ ] Verify the exact fallback path

### Phase C: Custom Rust ANN (Last Resort)
- [ ] Confirm a maintained ANN is proven insufficient for a real capability gap before starting this phase
- [ ] Scope a custom Rust ANN only for that proven gap

### Phase D: Shared Cross-Skill Rust Core (Gated)
- [ ] Confirm spec-memory as a real, committed second consumer (system-code-graph excluded)
- [ ] Scope the shared core only if that condition holds

### Exit Gate
- [ ] SQL-parameter correctness fixed FIRST
- [ ] Any ANN ships under the approximation contract with exact fallback verified

<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Correctness | Eligible-ID SQL-parameter shape vs. the 32,766-variable limit | `node:sqlite`, targeted fixture at 100x scale |
| Recall | Filter-aware ANN recall vs. exact search | Recall verification harness (future) |
| Parity | Exact re-score + exact fallback vs. exact-only path | Byte-parity check where the exact path is claimed |

<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Predecessor phase `003-measured-native` | Internal | Planned | Native/Rust SLO evidence unavailable to gate this phase |
| Measured 10x-100x growth pressure | Internal | Not yet observed | Phase 3 does not trigger; all work stays out of scope |
| Maintained HNSW/ANN library | External | Not yet selected | REQ-002/003 cannot proceed |
| `spec-memory` as a second Rust consumer | Internal | Not yet committed | REQ-005 (shared core) stays out of scope |

<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: An approximate result is found to silently replace the exact path, or the SQL-parameter fix regresses correctness
- **Procedure**: Revert the offending change; the exact path remains the default until the approximation contract is re-verified

<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Entry Gate (measured growth) ──> Phase A (SQL-param fix)
                                        │
                                        v
                              Phase B (maintained ANN, approximation contract)
                                        │
                                        v
                         Phase C (custom Rust ANN, last resort, gated)
                                        │
                                        v
                  Phase D (shared cross-skill Rust core, gated on spec-memory)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Entry Gate | Measured 10x-100x growth pressure | Phase A |
| Phase A | Entry Gate | Phase B |
| Phase B | Phase A | Phase C |
| Phase C | Phase B (proven ANN gap) | Phase D |
| Phase D | spec-memory as a real second consumer | None |

<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|-------------------|
| Entry Gate | Low | Not yet applicable, gated on measured growth |
| Phase A (SQL-param fix) | Low-Medium | Small, targeted fix once triggered |
| Phase B (maintained ANN) | Medium-High | Larger, conditional on growth |
| Phase C (custom Rust ANN) | High | Last resort only, conditional on a proven gap |
| Phase D (shared Rust core) | Medium | Gated on spec-memory as a second consumer |
| **Total** | | **0 LOC this packet; all phases conditional on measured growth** |

<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Backup created (N/A — no runtime changes ship in this planning packet)
- [ ] Feature flag configured (N/A — the approximation contract itself is the versioned flag, once built)
- [ ] Monitoring alerts set (N/A — deferred to the phase that actually builds the ANN)

### Rollback Procedure
1. **Immediate**: N/A — planning packet, nothing deployed
2. **Revert code**: N/A — no code ships in this packet
3. **Verify rollback**: N/A
4. **Notify stakeholders**: N/A

### Data Reversal
- **Has data migrations?** No — planning packet only
- **Reversal procedure**: N/A

<!-- /ANCHOR:enhanced-rollback -->

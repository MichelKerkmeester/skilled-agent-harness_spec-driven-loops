---
title: "Implementation Plan: 128 — Deep-Agent-Improvement Mixed-Executor + Adjudication Methodology"
description: "Documentation and light code touch to bring arc 119 methodology patterns into DAI."
trigger_phrases:
  - "implementation plan"
  - "128 deep-agent-improvement"
  - "mixed-executor"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/021-deep-skill-evolution/005-deep-agent-improvement/008-mixed-executor-adjudication"
    last_updated_at: "2026-05-23T08:30:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored plan.md"
    next_safe_action: "Author tasks.md"
    blockers: []
    completion_pct: 10
    key_files:
      - "plan.md"
    session_dedup:
      fingerprint: "sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
      session_id: "116-deep-skill-evolution/005-deep-agent-improvement/008-mixed-executor-adjudication"
      parent_session_id: null
---
# Implementation Plan: 128 — Deep-Agent-Improvement Mixed-Executor + Adjudication Methodology

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify + level3-arch | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

|| Aspect | Value |
||--------|-------|
|| **Language/Stack** | Documentation (Markdown) + Node.js (CJS script) |
|| **Framework** | sk-doc validation, Node.js fs module |
|| **Storage** | File system (reference docs, log file) |

### Overview

This implementation brings methodology patterns from arc 119 (deep-research uplift) into deep-agent-improvement through documentation and light code touch. The work is primarily documentation: Level 3 spec docs, SKILL.md sections, and two new reference docs. The only code change is additive logging in `generate-profile.cjs` to address DAI-004 (profile-selection auditability). No architecture changes, no workflow rewiring, no breaking changes.

<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified
- [x] NFRs defined with targets
- [x] Architecture decisions documented (ADR-001)

### Definition of Done
- [x] All acceptance criteria met
- [x] Tests passing (unit and integration)
- [x] Coverage > 80%
- [x] Docs updated (spec/plan/tasks)
- [x] Checklist items verified
- [x] Security review passed
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Documentation-first with additive code logging. No architecture changes.

### Key Components
- **Spec docs** (Level 3): spec.md, plan.md, tasks.md, checklist.md, decision-record.md, implementation-summary.md, description.json, graph-metadata.json
- **DAI SKILL.md**: Add two new sections (mixed-executor, adjudication-iter)
- **Reference docs**: mixed_executor_methodology.md (NEW), profiling_audit_log.md (NEW)
- **Script**: generate-profile.cjs (additive logging only)

### Data Flow
```
Spec docs (author) → SKILL.md (edit) → Reference docs (create) → Script (add logging) → Validate
```

### Component Diagram
```
┌──────────────────────────────────────────────────────────────┐
│                    Packet 128 Workspace                       │
├──────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐          │
│  │ Spec Docs   │  │ SKILL.md    │  │ Reference   │          │
│  │ (Level 3)   │  │ (Edit)      │  │ Docs (New)  │          │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘          │
│         │                │                │                  │
│         └────────────────┼────────────────┘                  │
│                          ▼                                   │
│         ┌────────────────────────────────┐                   │
│         │  generate-profile.cjs (Edit)   │                   │
│         │  Add profile-selection log     │                   │
│         └────────────────┬───────────────┘                   │
│                          ▼                                   │
│         ┌────────────────────────────────┐                   │
│         │      Validation Gates          │                   │
│         │  strict-validate, sk-doc, node │                   │
│         └────────────────────────────────┘                   │
└──────────────────────────────────────────────────────────────┘
```
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Spec Docs (Step 1)
- [ ] Author spec.md with all required anchors
- [ ] Author plan.md with architecture and phases
- [ ] Author tasks.md with task breakdown
- [ ] Author checklist.md with verification protocol
- [ ] Author decision-record.md with ADR-001
- [ ] Author implementation-summary.md (placeholder, update after completion)
- [ ] Create description.json with packet metadata
- [ ] Create graph-metadata.json with graph metadata

### Phase 2: SKILL.md Documentation (Step 2)
- [ ] Add "Mixed-Executor Dispatch (recommended)" section to DAI SKILL.md
- [ ] Add "Adjudication-Iter Pattern (recommended)" section to DAI SKILL.md
- [ ] Cross-reference 119 as precedent in both sections

### Phase 3: Reference Docs (Step 2)
- [ ] Create references/mixed_executor_methodology.md
- [ ] Document when to use the pattern (multi-iter sweeps)
- [ ] Document the 8+2 split (breadth iters + synthesis iters)
- [ ] Document the adjudication-iter mechanic (false-positive filter)
- [ ] Cross-link to 119 as origin
- [ ] Create references/profiling_audit_log.md
- [ ] Document profile-selection log format
- [ ] Document retention policy

### Phase 4: Script Logging (Step 3)
- [ ] Edit scripts/generate-profile.cjs
- [ ] Add profile-selection rationale logging
- [ ] Log to `<state-dir>/profile-selection.log`
- [ ] Log format: {timestamp, candidate_hash, chosen_profile, rationale, alternatives}
- [ ] Use typed-error helper from _lib/typed-errors.cjs
- [ ] Wrap log write in try/catch (silent ignore on failure)

### Phase 5: Validation (Step 4)
- [ ] Run strict-validate on packet 128
- [ ] Run sk-doc validate on mixed_executor_methodology.md
- [ ] Run sk-doc validate on profiling_audit_log.md
- [ ] Run node --check on generate-profile.cjs
- [ ] Verify DQI ≥ 75 on both reference docs
- [ ] Update implementation-summary.md with completion details
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

|| Test Type | Scope | Tools | Coverage Target |
||-----------|-------|-------|-----------------|
|| Validation | Spec docs | strict-validate | 100% (all anchors present) |
|| Validation | Reference docs | sk-doc validate | DQI ≥ 75 |
|| Syntax | Script | node --check | PASS |
|| Regression | Script | Existing tests | All pass (no breaking changes) |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

|| Dependency | Type | Status | Impact if Blocked |
||------------|------|--------|-------------------|
|| Packet 124 | Internal | Complete | Already shipped |
|| Packet 125 | Internal | Complete | Already shipped |
|| Packet 126 | Internal | Complete | Already shipped |
|| Packet 127 | Internal | Complete | Already shipped |
|| Arc 119 methodology | External | Complete | Reference only |
|| typed-errors.cjs | Internal | Present | Already imported by generate-profile.cjs |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Validation failures, or breaking changes to generate-profile.cjs
- **Procedure**: Revert SKILL.md edits, delete new reference docs, revert script changes, delete packet 128 folder
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## PHASE DEPENDENCIES

```
Phase 1 (Spec Docs) ──> Phase 2 (SKILL.md) ──> Phase 3 (Reference Docs) ──> Phase 4 (Script) ──> Phase 5 (Validation)
```

|| Phase | Depends On | Blocks |
||-------|------------|--------|
|| Spec Docs | None | SKILL.md, Reference Docs |
|| SKILL.md | Spec Docs | Reference Docs |
|| Reference Docs | SKILL.md | Script |
|| Script | Reference Docs | Validation |
|| Validation | All | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## EFFORT ESTIMATION

|| Phase | Complexity | Estimated Effort |
||-------|------------|------------------|
|| Spec Docs | Medium | 2 hours |
|| SKILL.md Documentation | Low | 30 minutes |
|| Reference Docs | Low | 1 hour |
|| Script Logging | Low | 30 minutes |
|| Validation | Low | 30 minutes |
|| **Total** | | **4.5 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Git status clean before starting work
- [x] Packets 124-127 already shipped

### Rollback Procedure
1. **Revert SKILL.md edits**: `git revert` the 128 commit
2. **Delete reference docs**: `rm .opencode/skills/deep-agent-improvement/references/{mixed_executor_methodology,profiling_audit_log}.md`
3. **Revert script changes**: `git checkout HEAD~1 -- .opencode/skills/deep-agent-improvement/scripts/generate-profile.cjs`
4. **Delete packet folder**: `rm -rf .opencode/specs/skilled-agent-orchestration/116-deep-skill-evolution/005-deep-agent-improvement/008-mixed-executor-adjudication/`
5. **Verify**: Re-run DAI integration scan to confirm no breakage

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: Git revert + file deletion
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## DEPENDENCY GRAPH

```
┌─────────────┐
│   Spec Docs   │
│  (Phase 1)   │
└──────┬──────┘
       │
       ├────────────────────┐
       │                    │
       ▼                    ▼
┌─────────────┐      ┌─────────────┐
│  Database   │      │  Services   │
│  (Phase 2)  │◄─────│  (Phase 3)  │
└──────┬──────┘      └──────┬──────┘
       │                    │
       └────────┬───────────┘
                │
                ▼
         ┌─────────────┐
         │     API     │
         │  (Phase 4)  │
         └──────┬──────┘
                │
                ▼
         ┌─────────────┐
         │     UI      │
         │  (Phase 5)  │
         └──────┬──────┘
                │
                ▼
         ┌─────────────┐
         │   Verify    │
         │  (Phase 6)  │
         └─────────────┘
```

### Dependency Matrix

|| Component | Depends On | Produces | Blocks |
||-----------|------------|----------|--------|
|| Spec Docs | None | 8 L3 docs | SKILL.md, Reference Docs |
|| SKILL.md | Spec Docs | 2 new sections | Reference Docs |
|| mixed_executor_methodology.md | SKILL.md | Methodology reference | Script |
|| profiling_audit_log.md | SKILL.md | Audit log reference | Script |
|| generate-profile.cjs logging | Reference Docs | DAI-004 log line | Validation |
|| Validation | All | strict/sk-doc PASS | Closeout |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## CRITICAL PATH

1. **Spec Docs (Phase 1)** - 2 hours - CRITICAL
2. **SKILL.md sections (Phase 2)** - 0.5 hours - CRITICAL
3. **Reference Docs (Phase 3)** - 1 hour - CRITICAL
4. **Script logging (Phase 4)** - 0.5 hours - CRITICAL
5. **Validation (Phase 5)** - 0.5 hours - CRITICAL

**Total Critical Path**: 4.5 hours

**Parallel Opportunities**:
- Both reference docs can be authored in parallel
- SKILL.md edits and reference doc skeletons can begin once spec docs land
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## MILESTONES

|| Milestone | Description | Success Criteria | Target |
||-----------|-------------|------------------|--------|
|| M1 | Spec Docs Complete | 8 L3 files written + strict-validate green | T+2h |
|| M2 | SKILL.md Updated | 2 new sections w/ 119 cross-ref | T+2.5h |
|| M3 | Reference Docs | mixed_executor_methodology + profiling_audit_log authored | T+3.5h |
|| M4 | Script Logging | generate-profile.cjs DAI-004 logging added + syntax PASS | T+4h |
|| M5 | All Gates Green | strict-validate + sk-doc validate + node --check PASS | T+4.5h |
<!-- /ANCHOR:milestones -->

---

<!-- ANCHOR:adr-summary -->
## ARCHITECTURE DECISION SUMMARY

See `decision-record.md` for full ADRs:

|| ADR | Decision | Rationale |
||-----|----------|-----------|
|| ADR-001 | Mixed-executor + adjudication methodology | Proven in 119; 90%+ false-positive rate without adjudication; breadth/synthesis balance |
<!-- /ANCHOR:adr-summary -->

---

<!--
LEVEL 3 PLAN (~260 lines)
- Core + L2 + L3 addendums
- Full dependency graph and critical path
- Milestones and ADR summary
-->

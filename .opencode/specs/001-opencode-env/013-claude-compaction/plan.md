# Implementation Plan: Claude Code Compaction Resilience

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify + level3-arch | v2.2 -->

---

## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown (CLAUDE.md, MEMORY.md) |
| **Framework** | Claude Code CLI (system prompt injection) |
| **Storage** | Filesystem (project root + ~/.claude/projects/) |
| **Testing** | Manual behavioral verification (5-run protocol) |

### Overview
Implement compaction resilience by adding a ~20-line instruction section to CLAUDE.md and a 2-line reinforcement entry to MEMORY.md. The instructions use a "Stop and Confirm" pattern with CRITICAL/STOP markers to force Claude to pause, summarize state, and wait for user confirmation after any compaction event. This is a zero-code, instruction-only solution that works immediately with existing Claude Code infrastructure.

---

## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented (spec.md)
- [x] Success criteria measurable (SC-001 through SC-004)
- [x] Dependencies identified (research completed)
- [x] Architecture decisions documented (ADR-001 through ADR-003)

### Definition of Done
- [ ] CLAUDE.md compaction section written and verified (< 25 lines, < 500 tokens)
- [ ] MEMORY.md entry added
- [ ] 5-run behavioral test protocol passed
- [ ] All spec documents complete and cross-referenced

---

## 3. ARCHITECTURE

### Pattern
Instruction-based behavioral modification (system prompt engineering)

### Key Components
- **CLAUDE.md Section**: Primary behavioral anchor -- structured numbered instructions with CRITICAL/STOP markers that persist in the system prompt across compaction events
- **MEMORY.md Entry**: Secondary reinforcement pointer -- loads in system prompt auto-memory section, points back to CLAUDE.md for full instructions

### Data Flow
```
Compaction Event
    ↓
System Prompt Re-injected (CLAUDE.md + MEMORY.md auto-loaded)
    ↓
Model reads CRITICAL marker → STOP (no tools, no actions)
    ↓
Model re-reads CLAUDE.md → Summarizes state
    ↓
User confirms or corrects → Model proceeds
```

---

## 4. IMPLEMENTATION PHASES

### Phase 1: CLAUDE.md Section
- [ ] Draft the ~20-line "Context Compaction Behavior" section
- [ ] Verify section is under 25 lines and under 500 tokens
- [ ] Review for conflicts with existing CLAUDE.md content
- [ ] Insert section into CLAUDE.md at appropriate position

### Phase 2: MEMORY.md Entry
- [ ] Draft the 2-line "Compaction Recovery" entry
- [ ] Verify MEMORY.md is under 200-line limit after addition
- [ ] Insert entry into MEMORY.md

### Phase 3: Workflow Documentation
- [ ] Document manual /compact workflow (70% trigger threshold)
- [ ] Document multi-compaction session guidance (2+ → /clear)
- [ ] Document verification procedure for testing

### Phase 4: Verification Protocol
- [ ] Define 5-run behavioral test protocol
- [ ] Run test 1: Basic compaction → verify stop-and-confirm
- [ ] Run test 2: Compaction with behavioral constraint active
- [ ] Run test 3: Compaction mid-task with file modifications
- [ ] Run test 4: Second compaction in same session
- [ ] Run test 5: Manual /compact with focus instructions

### Phase 5: Execute & Verify
- [ ] Apply CLAUDE.md changes to production file
- [ ] Apply MEMORY.md changes
- [ ] Run verification protocol
- [ ] Update implementation-summary.md with results

---

## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Behavioral | Post-compaction stop-and-confirm | Manual Claude Code session |
| Content | Token count, line count | Token counter, wc -l |
| Integration | CLAUDE.md + MEMORY.md loading | Claude Code session start |
| Regression | Existing CLAUDE.md rules still work | Manual verification |

---

## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Research document | Internal | Green (complete) | Cannot draft instructions without community patterns |
| CLAUDE.md file access | Internal | Green | Cannot write primary instructions |
| MEMORY.md file access | Internal | Green | Cannot write secondary reinforcement |
| Claude Code CLI | External | Green | Cannot run behavioral tests |

---

## 7. ROLLBACK PLAN

- **Trigger**: CLAUDE.md section causes conflicts with existing instructions, or behavioral tests show negative impact
- **Procedure**: Remove the "Context Compaction Behavior" section from CLAUDE.md and the "Compaction Recovery" entry from MEMORY.md. Both are self-contained additions with no dependencies on other content.

---

## L2: PHASE DEPENDENCIES

```
Phase 1 (CLAUDE.md) ──────┐
                           ├──► Phase 3 (Workflow Docs) ──► Phase 4 (Verification)
Phase 2 (MEMORY.md) ──────┘                                        │
                                                                    ▼
                                                            Phase 5 (Execute)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Phase 1: CLAUDE.md Section | None | Phase 3, Phase 5 |
| Phase 2: MEMORY.md Entry | None | Phase 3, Phase 5 |
| Phase 3: Workflow Docs | Phase 1, Phase 2 | Phase 4 |
| Phase 4: Verification Protocol | Phase 3 | Phase 5 |
| Phase 5: Execute & Verify | Phase 1-4 | None |

---

## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Phase 1: CLAUDE.md Section | Low | 15 minutes |
| Phase 2: MEMORY.md Entry | Low | 5 minutes |
| Phase 3: Workflow Docs | Low | 15 minutes |
| Phase 4: Verification Protocol | Medium | 30 minutes |
| Phase 5: Execute & Verify | Medium | 30 minutes |
| **Total** | | **~1.5 hours** |

---

## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Backup current CLAUDE.md content
- [ ] Backup current MEMORY.md content
- [ ] Note current CLAUDE.md line count and token estimate

### Rollback Procedure
1. Remove "# Context Compaction Behavior" section from CLAUDE.md (lines are self-contained)
2. Remove "## Compaction Recovery" entry from MEMORY.md (2 lines)
3. Verify Claude Code session starts normally
4. Verify existing CLAUDE.md rules still function

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A -- pure text content changes, fully reversible

---

## L3: DEPENDENCY GRAPH

```
┌──────────────────┐     ┌──────────────────┐
│    Phase 1       │     │    Phase 2       │
│  CLAUDE.md Sect  │     │  MEMORY.md Entry │
└────────┬─────────┘     └────────┬─────────┘
         │                        │
         └──────────┬─────────────┘
                    ▼
         ┌──────────────────┐
         │    Phase 3       │
         │  Workflow Docs   │
         └────────┬─────────┘
                  ▼
         ┌──────────────────┐
         │    Phase 4       │
         │  Verification    │
         └────────┬─────────┘
                  ▼
         ┌──────────────────┐
         │    Phase 5       │
         │  Execute/Verify  │
         └──────────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| CLAUDE.md Section | Research | Primary instructions | Workflow Docs, Execute |
| MEMORY.md Entry | Research | Secondary pointer | Workflow Docs, Execute |
| Workflow Docs | CLAUDE.md, MEMORY.md | Usage guidance | Verification |
| Verification Protocol | Workflow Docs | Test plan | Execute |
| Execute & Verify | All above | Production deployment | None |

---

## L3: CRITICAL PATH

1. **Phase 1: CLAUDE.md Section** - 15 min - CRITICAL
2. **Phase 3: Workflow Docs** - 15 min - CRITICAL
3. **Phase 4: Verification Protocol** - 30 min - CRITICAL
4. **Phase 5: Execute & Verify** - 30 min - CRITICAL

**Total Critical Path**: ~1.5 hours

**Parallel Opportunities**:
- Phase 1 (CLAUDE.md) and Phase 2 (MEMORY.md) can run simultaneously
- Spec document creation is independent of implementation

---

## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Content Drafted | CLAUDE.md section + MEMORY.md entry written, reviewed | Phase 2 complete |
| M2 | Docs Complete | Workflow documentation and verification protocol ready | Phase 4 complete |
| M3 | Verified & Deployed | 5-run test protocol passed, production files updated | Phase 5 complete |

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: CLAUDE.md as Primary Location

**Status**: Accepted

**Context**: Need to decide where to place the compaction resilience instructions -- CLAUDE.md (system prompt, team-shareable) or MEMORY.md (auto-memory, per-user).

**Decision**: CLAUDE.md is the primary location; MEMORY.md serves as a secondary reinforcement pointer.

**Consequences**:
- CLAUDE.md loads in full with no line limit (vs MEMORY.md's 200-line cap)
- Instructions are team-shareable via git
- Adds ~500 tokens to every system prompt

**Alternatives Rejected**:
- MEMORY.md as primary: 200-line limit, per-user only, intended for factual recall not behavioral rules

### ADR-002: "Stop and Confirm" Pattern

**Status**: Accepted

**Context**: Need to choose between instruction-based mitigation (zero code) and hook-based automation (PreCompact/PostCompact scripts).

**Decision**: Use "Stop and Confirm" instruction pattern. Hooks deferred as future enhancement.

**Consequences**:
- 80% of benefit with 10% of complexity
- Works today, zero setup, portable across machines
- Relies on model compliance (not deterministic)

**Alternatives Rejected**:
- Hook-based: Complex, hooks API still evolving, overkill for initial mitigation

### ADR-003: Structured Numbered Format

**Status**: Accepted

**Context**: Need to choose the format for post-compaction instructions that maximizes model compliance when attention is degraded.

**Decision**: Use numbered imperative steps with CRITICAL/STOP markers.

**Consequences**:
- Highest salience format for degraded attention contexts
- Clear, unambiguous action sequence
- Easy for users to verify compliance

**Alternatives Rejected**:
- Narrative prose: Lower salience, ambiguous action boundaries

---

<!--
LEVEL 3 PLAN
- Core + L2 + L3 addendums
- Dependency graphs, milestones
- Architecture decision records
-->

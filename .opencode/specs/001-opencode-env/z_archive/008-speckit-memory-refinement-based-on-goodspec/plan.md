# Implementation Plan: System-Spec-Kit Improvements

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify + level3-arch + level3plus-govern | v2.0 -->

---

## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown, JavaScript, Bash |
| **Framework** | OpenCode command system, MCP tools |
| **Storage** | SQLite (memory index), File-based templates |
| **Testing** | Manual verification, validation scripts |

### Overview

This implementation adds 7 features to System-Spec-Kit in 4 waves: Foundation (gates + deviations), Visibility (status + waves), Change Management (amend + inline saves), and Knowledge Extraction (distiller). Each wave builds on the previous, with parallel execution within waves where possible.

---

## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified
- [x] Agent exploration complete (10 agents)
- [x] File locations identified

### Definition of Done
- [ ] All P0 requirements complete
- [ ] All P1 requirements complete OR deferred with approval
- [ ] Validation scripts pass
- [ ] Memory context saved
- [ ] ACCEPT GATE passed

---

## 3. ARCHITECTURE

### Pattern
**Additive Extension** - Extends existing patterns without breaking changes

### Key Components

| Component | Purpose | Files |
|-----------|---------|-------|
| **Contract Gates** | Explicit confirmation checkpoints | plan.md, complete.md, AGENTS.md |
| **Status Dashboard** | Unified state visibility | status.md, status-collector.js |
| **Deviation System** | Autonomy classification | AGENTS.md, templates/tasks.md |
| **Wave Execution** | Phased task organization | templates/tasks.md, check-wave-markers.sh |
| **Amend Command** | Formal scope changes | amend.md, templates/spec.md |
| **Inline Prefixes** | Frictionless memory saves | prefix-detector.js, trigger-matcher.js |
| **Distiller Agent** | Knowledge extraction | distiller.md, consolidation.js integration |

### Data Flow

```
User Action → Gate Check → Execute → Deviation Classification → Document
                                          ↓
                              Memory Save (explicit OR inline prefix)
                                          ↓
                              Distiller (post-completion)
```

---

## 4. IMPLEMENTATION PHASES

### Wave 1: Foundation (P0.1 + P1.3)
**Dependencies:** None
**Execution:** Parallel within wave
**Entry Criteria:** Spec confirmed
**Exit Criteria:** Gates integrated, deviation rules documented

| Task | Priority | File | Description |
|------|----------|------|-------------|
| T001 | P0 | `.opencode/command/spec_kit/plan.md` | Add SPECIFY GATE section after workflow diagram (~line 303) |
| T002 | P0 | `.opencode/command/spec_kit/complete.md` | Add ACCEPT GATE section after Step 14 (~line 405) |
| T003 | P0 | `.opencode/skill/system-spec-kit/references/validation/contract-gates.md` | Create full reference documentation |
| T004 | P1 | `AGENTS.md` | Add deviation rules after HALT CONDITIONS (after line 47) |
| T005 | P1 | `.opencode/skill/system-spec-kit/references/validation/deviation-rules.md` | Create deviation rules reference |
| T006 | P1 | `.opencode/skill/system-spec-kit/templates/level_1/tasks.md` | Add deviation log section |
| T007 | P1 | `.opencode/skill/system-spec-kit/templates/level_2/tasks.md` | Add deviation log section |
| T008 | P1 | `.opencode/skill/system-spec-kit/templates/level_3/tasks.md` | Add deviation log section |
| T009 | P1 | `.opencode/skill/system-spec-kit/templates/level_3+/tasks.md` | Add deviation log section |

**Wave Gate**: All W1 tasks must complete before W2

---

### Wave 2: Visibility (P0.2 + P1.4)
**Dependencies:** Wave 1 complete
**Execution:** Parallel within wave
**Entry Criteria:** Gates operational
**Exit Criteria:** Status command works, wave structure in templates

| Task | Priority | File | Description |
|------|----------|------|-------------|
| T010 | P0 | `.opencode/command/spec_kit/status.md` | Create status command with 4 views |
| T011 | P0 | `.opencode/skill/system-spec-kit/scripts/spec-folder/status-collector.js` | Create status data aggregation script |
| T012 | P1 | `.opencode/skill/system-spec-kit/templates/level_2/tasks.md` | Add wave structure (W1-W4) |
| T013 | P1 | `.opencode/skill/system-spec-kit/templates/level_3/tasks.md` | Add wave structure (W1-W4) |
| T014 | P1 | `.opencode/skill/system-spec-kit/templates/level_3+/tasks.md` | Add wave structure (W1-W4) |
| T015 | P1 | `.opencode/skill/system-spec-kit/references/workflows/wave-execution.md` | Create wave execution reference |
| T016 | P1 | `.opencode/skill/system-spec-kit/scripts/rules/check-wave-markers.sh` | Create wave validation script |

**Wave Gate**: All W2 tasks must complete before W3

---

### Wave 3: Change Management (P1.5 + P2.6)
**Dependencies:** Wave 2 complete
**Execution:** Parallel within wave
**Entry Criteria:** Status visible, waves operational
**Exit Criteria:** Amend command works, inline prefixes detect

| Task | Priority | File | Description |
|------|----------|------|-------------|
| T017 | P1 | `.opencode/command/spec_kit/amend.md` | Create amend command with impact analysis |
| T018 | P1 | `.opencode/skill/system-spec-kit/templates/level_1/spec.md` | Add amendments section |
| T019 | P1 | `.opencode/skill/system-spec-kit/templates/level_2/spec.md` | Add amendments section |
| T020 | P1 | `.opencode/skill/system-spec-kit/templates/level_3/spec.md` | Add amendments section |
| T021 | P1 | `.opencode/skill/system-spec-kit/templates/level_3+/spec.md` | Add amendments section |
| T022 | P2 | `.opencode/skill/system-spec-kit/mcp_server/lib/parsing/prefix-detector.js` | Create inline prefix detection |
| T023 | P2 | `.opencode/skill/system-spec-kit/references/memory/inline-prefixes.md` | Create inline prefixes reference |
| T024 | P2 | `AGENTS.md` | Add inline prefix documentation to message processing |
| T028 | P2 | `AGENTS.md` | Review for Goodspec pattern alignment (memory-first, UI patterns, coding lenses) |

**Wave Gate**: All W3 tasks must complete before W4

---

### Wave 4: Knowledge Extraction (P2.7)
**Dependencies:** Wave 3 complete
**Execution:** Sequential
**Entry Criteria:** Change management operational
**Exit Criteria:** Distiller agent functional

| Task | Priority | File | Description |
|------|----------|------|-------------|
| T025 | P2 | `.opencode/agent/distiller.md` | Create memory distiller agent definition |
| T026 | P2 | `.opencode/command/spec_kit/complete.md` | Add optional distillation trigger after Step 13 |
| T027 | P2 | `.opencode/command/memory/manage.md` | Add `/memory:distill` subcommand |

**Wave Gate**: Implementation complete → Verification

---

## 5. TESTING STRATEGY

| Test Type | Scope | Method |
|-----------|-------|--------|
| Unit | Prefix detection regex | Manual test with sample inputs |
| Integration | Gate flow | Walk through plan.md with gates |
| Manual | Status dashboard | Verify 4 views render correctly |
| Validation | Wave markers | Run check-wave-markers.sh on sample |
| End-to-End | Full workflow | Complete spec folder with all features |

---

## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| AGENTS.md | Internal | Green | Add deviation rules there |
| Command patterns | Internal | Green | Follow existing structure |
| Template system | Internal | Green | Extend with new sections |
| Memory MCP | Internal | Green | Prefix detection uses memory_save |
| Consolidation engine | Internal | Green | Distiller leverages existing |

---

## 7. ROLLBACK PLAN

### Trigger Conditions
- Gates cause user friction (multiple complaints)
- Validation scripts break existing workflows
- Memory corruption from prefix detection

### Rollback Procedure
1. Revert AGENTS.md changes
2. Revert command files
3. Remove new reference files
4. Restore original templates from git
5. Notify via memory context

---

## 8. PHASE DEPENDENCIES (L2)

```
W1 Foundation ──────────────────────┐
  ├─ T001 SPECIFY GATE             │
  ├─ T002 ACCEPT GATE              │
  ├─ T003 contract-gates.md        │
  ├─ T004 Deviation rules          ├──▶ W2 Visibility
  ├─ T005 deviation-rules.md       │
  └─ T006-T009 Template updates    │
                                   │
W2 Visibility ─────────────────────┤
  ├─ T010 Status command           │
  ├─ T011 status-collector.js      │
  ├─ T012-T014 Wave templates      ├──▶ W3 Change Mgmt
  ├─ T015 wave-execution.md        │
  └─ T016 check-wave-markers.sh    │
                                   │
W3 Change Management ──────────────┤
  ├─ T017 Amend command            │
  ├─ T018-T021 Amendments section  ├──▶ W4 Knowledge
  ├─ T022 prefix-detector.js       │
  ├─ T023 inline-prefixes.md       │
  └─ T024 AGENTS.md prefixes       │
                                   │
W4 Knowledge Extraction ───────────┘
  ├─ T025 distiller.md
  ├─ T026 Auto-trigger
  └─ T027 /memory:distill
```

---

## 9. CRITICAL PATH (L3)

The critical path for minimum viable delivery:

1. **T001** SPECIFY GATE in plan.md
2. **T002** ACCEPT GATE in complete.md
3. **T004** Deviation rules in AGENTS.md
4. **T010** Status command creation
5. **T012** Wave structure in templates

All other tasks can proceed in parallel around this core path.

---

## 10. MILESTONES (L3)

| Milestone | Target | Success Criteria |
|-----------|--------|------------------|
| **M1: Gates Live** | W1 Complete | User can "confirm" and "accept" |
| **M2: Visibility** | W2 Complete | `/spec_kit:status` shows dashboard |
| **M3: Full Feature** | W4 Complete | All 7 features operational |

---

## 11. AI EXECUTION FRAMEWORK (L3+)

### Tier 1: Sequential Tasks (Orchestrator Only)
- AGENTS.md modifications
- Command file structure decisions
- Gate integration verification

### Tier 2: Parallel Tasks (Coordinated Workers)
- Template updates (T006-T009, T012-T014, T018-T021)
- Reference documentation creation (T003, T005, T015, T023)

### Tier 3: Independent Tasks (Fire-and-Forget)
- Validation script creation (T016)
- Status collector script (T011)
- Prefix detector (T022)

---

## 12. WORKSTREAM COORDINATION (L3+)

| Workstream | Owner | Scope | Files |
|------------|-------|-------|-------|
| **W-A: Commands** | Primary | Command files | `.opencode/command/spec_kit/*.md` |
| **W-B: Templates** | Worker | Template updates | `.opencode/skill/system-spec-kit/templates/*` |
| **W-C: References** | Worker | Reference docs | `.opencode/skill/system-spec-kit/references/*` |
| **W-D: Scripts** | Worker | Validation/utility | `.opencode/skill/system-spec-kit/scripts/*` |

### SYNC Points

```
>>> SYNC-001: W1 Complete - Gates integrated <<<
>>> SYNC-002: W2 Complete - Status + Waves operational <<<
>>> SYNC-003: W3 Complete - Amend + Prefixes working <<<
>>> SYNC-004: W4 Complete - Distiller functional <<<
```

---

## 13. COMMUNICATION PLAN (L3+)

### Checkpoints
- After each wave: Summary of completed tasks
- On blockers: Immediate notification with options
- On completion: Full feature list with verification status

### Escalation Path
1. Attempt resolution (3 tries)
2. Document blocker in tasks.md
3. Present options to user
4. User decision drives next action

---

## 14. EFFORT ESTIMATION (L2)

| Wave | Tasks | Complexity | Estimated Effort |
|------|-------|------------|------------------|
| W1 Foundation | 9 | Medium | 2-3 hours |
| W2 Visibility | 7 | Medium-High | 3-4 hours |
| W3 Change Mgmt | 9 | Medium | 2-4 hours |
| W4 Knowledge | 3 | High | 2-3 hours |
| **TOTAL** | 28 | - | 9-14 hours |

---

## 15. RELATED DOCUMENTS

- [spec.md](./spec.md) - Feature specification
- [recommendations-report.md](./recommendations-report.md) - Detailed implementation specs
- [analysis-report.md](./analysis-report.md) - Goodspec comparison

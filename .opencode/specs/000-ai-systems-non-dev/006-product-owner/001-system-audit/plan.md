# Implementation Plan: Product Owner — DEPTH Energy Migration

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify + level3-arch | v2.2 -->

---

## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown (AI system prompt files) |
| **Framework** | DEPTH Energy Levels (v0.200 template) |
| **Storage** | File-based KB (`Product Owner/knowledge base/system/`) |
| **Testing** | Manual grep verification + cross-file audit |

### Overview

Migrate the Product Owner system from legacy rounds-based DEPTH to energy levels. The DEPTH Framework (v0.200) is already clean — the actual work targets the System Prompt (v0.956 → v1.000) and Interactive Mode (v0.320 → v0.400), which still contain extensive legacy references.

---

## 2. QUALITY GATES

### Definition of Ready

- [x] Problem statement clear and scope documented
- [x] Line-level bug inventory completed (see spec.md Section 9)
- [x] Copywriter DEPTH v0.200 available as migration template

### Definition of Done

- [ ] Zero rounds/RICCE/depth_rounds across all 3 files
- [ ] All 4 energy levels (Raw/Quick/Standard/Deep) consistent
- [ ] All CRITICAL/HIGH audit findings resolved
- [ ] Cross-file verification passes

---

## 3. ARCHITECTURE

### Pattern

Knowledge Base file alignment — 3 interdependent markdown files that must describe the same system.

### Key Components

- **DEPTH Framework v0.200**: Defines energy levels and cognitive techniques (already clean)
- **System Prompt v0.956**: Routing logic, rules, Quick Reference, pseudocode (needs migration)
- **Interactive Mode v0.320**: Command configs, state machine YAML (needs migration)

### Data Flow

```
DEPTH Framework (defines model) → System Prompt (implements routing) → Interactive Mode (exposes commands)
```

All three must agree on: energy levels, no rounds, no RICCE.

---

## 4. IMPLEMENTATION PHASES

### Phase 1: Deep System Audit

1. Read all Product Owner KB files (system, rules, context, voice, AGENTS.md)
2. Apply 21-category bug taxonomy
3. Produce audit report with severity ratings (CRITICAL/HIGH/MEDIUM/LOW)

**Phase Gate**: Audit report complete with severity ratings

### Phase 2: Cross-File Alignment (corrected targets)

**2a. System Prompt v0.956 → v1.000** (primary target — 16+ round refs, 5 RICCE refs):

| Action | Details |
|--------|---------|
| Remove round references | "10-round DEPTH", "Auto-scale to 1-5 rounds", "Rounds 1-2" through "Rounds 6-10", etc. (16+ occurrences) |
| Remove RICCE references | Rule 31/37, loading table, full RICCE Structure table, must-have validation (5 occurrences) |
| Rewrite Quick Reference (Section 4) | Replace rounds-based table with energy-level-aligned content |
| Fix pseudocode routing | Replace `depth_rounds` with `energy_level` in functions (lines 333, 388) |
| Fix checkbox syntax | Rule 27, line 71: `[]` → `[ ]` |
| Version bump | v0.956 → v1.000 |

**2b. Interactive Mode v0.320 → v0.400**:

| Action | Details |
|--------|---------|
| Remove depth_rounds | `depth_rounds: 10`, `depth_rounds: auto_scale_1_to_5` (5+ occurrences) |
| Replace "10 rounds" language | Use energy level references instead |
| Update state machine YAML | Reference energy levels, not rounds |
| Version bump | v0.320 → v0.400 |

**2c. DEPTH Framework v0.200 — Review Only**:

| Action | Details |
|--------|---------|
| Verify clean state | Confirm 0 rounds, 0 RICCE (already verified) |
| Version bump | Only if structural changes made during audit fixes |

**Phase Gate**: 3 files aligned, zero violations confirmed

### Phase 3: Audit Fix Implementation

1. Apply all CRITICAL findings from audit report
2. Apply all HIGH findings
3. Apply MEDIUM/LOW findings
4. Final verification sweep

**Phase Gate**: All fixes applied and verified

---

## 5. PRESERVE LIST (DO NOT change)

| Feature | Description | Why |
|---------|-------------|-----|
| 6-dimension self-rating | Completeness, Clarity, Actionability, Accuracy, Relevance, Mechanism Depth | Quality gate — replaces RICCE's role |
| 5 templates | Task, Bug, Story, Epic, Doc | Core Product Owner functionality |
| 7 voice patterns | Example patterns in voice rules | Human Voice Rules integration |
| BLOCKING export | Export protocol with sequential numbering | Critical workflow feature |
| Two-Layer Processing | Product Owner-specific processing | Unique to this system |
| "Raw" energy level | 4th level (Raw/Quick/Standard/Deep) | Product Owner-specific addition |

---

## L2: PHASE DEPENDENCIES

```
Phase 1 (Audit) ─────► Phase 2 (Alignment) ─────► Phase 3 (Fixes)
                            │
                       ┌────┼────┐
                       ▼    ▼    ▼
                      2a   2b   2c
                  (SysPrompt)(IntMode)(DEPTH)
                       │    │    │
                       └────┼────┘
                            ▼
                       Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Phase 1 (Audit) | None | Phase 2, Phase 3 |
| Phase 2a (System Prompt) | Phase 1 | Verification |
| Phase 2b (Interactive Mode) | Phase 1 | Verification |
| Phase 2c (DEPTH Review) | Phase 1 | Verification |
| Phase 3 (Fixes) | Phase 1, Phase 2 | None |

---

## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Phase 1 (Audit) | Medium | ~30 min |
| Phase 2a (System Prompt) | High | ~45 min |
| Phase 2b (Interactive Mode) | Medium | ~20 min |
| Phase 2c (DEPTH Review) | Low | ~5 min |
| Phase 3 (Fixes) | Medium | ~30 min |
| **Total** | | **~2 hours** |

---

## L3: DEPENDENCY GRAPH

```
┌──────────────┐
│   Phase 1    │
│    Audit     │
└──────┬───────┘
       │
  ┌────┼────────────┐
  ▼    ▼            ▼
┌────┐ ┌─────┐ ┌──────┐
│ 2a │ │ 2b  │ │  2c  │
│Sys │ │Int  │ │DEPTH │
│Prmt│ │Mode │ │Revw  │
└──┬─┘ └──┬──┘ └──┬───┘
   │      │       │
   └──────┼───────┘
          ▼
   ┌──────────────┐
   │  Verification │
   └──────┬───────┘
          ▼
   ┌──────────────┐
   │   Phase 3    │
   │  Audit Fixes │
   └──────────────┘
```

---

## L3: CRITICAL PATH

1. **Phase 1: Audit** — ~30 min — CRITICAL
2. **Phase 2a: System Prompt rewrite** — ~45 min — CRITICAL (most refs to remove)
3. **Phase 2 Verification** — ~10 min — CRITICAL
4. **Phase 3: Audit fixes** — ~30 min — CRITICAL

**Total Critical Path**: ~2 hours

**Parallel Opportunities**:
- Phase 2a, 2b, and 2c can run simultaneously after Phase 1
- MEDIUM/LOW fixes (Phase 3) can begin as soon as audit report is available

---

## L3: MILESTONES

| Milestone | Description | Success Criteria |
|-----------|-------------|------------------|
| M1 | Audit Complete | Severity-rated report with 21-category taxonomy |
| M2 | System Prompt Migrated | v1.000 with zero rounds/RICCE |
| M3 | Interactive Mode Migrated | v0.400 with zero depth_rounds |
| M4 | All Files Verified | Cross-file grep returns 0 violations |
| M5 | Audit Fixes Complete | All CRITICAL/HIGH resolved, MEDIUM/LOW addressed |

---

## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Copywriter DEPTH v0.200 | Internal | Green | Migration template unavailable — can still proceed with energy-level spec |

---

## 7. ROLLBACK PLAN

- **Trigger**: Migration breaks Product Owner system functionality
- **Procedure**: Revert to pre-migration file versions (v0.956, v0.320, v0.200)

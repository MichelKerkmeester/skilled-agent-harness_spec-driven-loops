---
title: "Implementation Plan: Phase 006 — Parent-Skill Canon Verification & Procedures Pattern Formalization"
description: "Executed Level 2 plan re-verifying sk-design against the canon parent-hub checker and deciding whether the procedures/ companion-directory pattern becomes sk-doc canon or stays sk-design-local."
trigger_phrases:
  - "implementation plan"
  - "parent-skill canon verification"
  - "sk-design canon re-verification"
  - "procedures pattern formalization"
importance_tier: "high"
contextType: "plan"
_memory:
  continuity:
    packet_pointer: "sk-design/009-sk-design-claude-parity/006-parent-skill-canon-verification"
    last_updated_at: "2026-07-06T00:00:00.000Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Executed the Phase 006 plan and accepted ADR-001."
    next_safe_action: "Use Phase 007 Path B: sk-design-local procedure-card template alignment."
---
# Implementation Plan: Phase 006 — Parent-Skill Canon Verification & Procedures Pattern Formalization

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Surface** | OpenCode `sk-design` parent-hub canon conformance and `sk-doc` canon documentation |
| **Primary Area** | `.opencode/skills/sk-design/**` (read-only) and `.opencode/skills/sk-doc/references/skill_creation/parent_skills_nested_packets.md` (read-only) |
| **Spec Level** | 2 |
| **Testing** | Fresh canon-checker run, registry/procedures inventory, canon-doc gap read, Rule-of-Three cross-hub check |
| **Mutation Policy** | Zero implementation-file mutations performed; all writes stayed inside this Phase 006 folder |

### Overview
This plan re-verified `sk-design`'s structural conformance to the canon parent-hub pattern with fresh, phase-owned evidence, and accepted ADR-001: the `procedures/` + `proceduresPath` pattern stays sk-design-local. No `sk-design`, `sk-doc`, or command file was edited by this phase.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Phase 006 documentation scope is explicit and confined to this folder. Evidence: `spec.md` scope names read-only audit targets and zero implementation edits.
- [x] Phase 005 documentation-level closure is read and cited. Evidence: Phase 005 `spec.md` line 47 is `Complete / Conditional Release Gate`; `release-report.md` §7 lines 137-140 state the CONDITIONAL verdict and operator-owned gaps.
- [x] Canon-checker location and invocation are confirmed. Evidence: `node .opencode/commands/doctor/scripts/parent-skill-check.cjs .opencode/skills/sk-design` ran with exit code 0.
- [x] `sk-doc` canon reference location is confirmed. Evidence: `.opencode/skills/sk-doc/references/skill_creation/parent_skills_nested_packets.md` §4 and §6 were read.

### Definition of Done
- [x] Fresh `parent-skill-check.cjs` run is recorded with full transcript and exit code.
- [x] `proceduresPath` consistency is confirmed across all five workflow modes.
- [x] Canon-doc gap in §4/§6 is confirmed by direct read.
- [x] Rule-of-Three cross-hub check is performed against `sk-code` and `deep-loop-workflows`.
- [x] ADR-001 is recorded in `decision-record.md` with a clear formalize-vs-local recommendation.
- [x] Phase 007 handoff criteria are stated explicitly.

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Read-only structural audit plus one documentation decision; no implementation architecture is introduced.

### Key Components
- **Canon Checker Runner**: Invokes `parent-skill-check.cjs` fresh against `.opencode/skills/sk-design`.
- **Registry/Procedures Auditor**: Reads `mode-registry.json` and inventories the six `procedures/` directories.
- **Canon-Doc Gap Reader**: Reads `parent_skills_nested_packets.md` §4 and §6.
- **Cross-Hub Rule-of-Three Check**: Inspects `sk-code` and `deep-loop-workflows` for the same companion-directory pattern.
- **ADR Recorder**: Writes the formalize-vs-local decision with alternatives and a Five Checks evaluation.

### Data Flow
1. Confirm Phase 005 documentation-level closure.
2. Run the canon checker fresh and capture full output and exit code.
3. Read `mode-registry.json` and inventory the `procedures/` directories.
4. Read `parent_skills_nested_packets.md` §4/§6 and confirm the canon-doc gap.
5. Check `sk-code` and `deep-loop-workflows` for the same pattern.
6. Record the ADR and the Phase 007 handoff criteria.

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Entry Gate and Current State Review
- [x] Verify Phase 005 documentation-level closure and the CONDITIONAL release verdict. Evidence: Phase 005 `spec.md` line 47 and `release-report.md` §7 lines 137-140.
- [x] Read the current `sk-design` hub files before auditing. Evidence: `SKILL.md`, `mode-registry.json`, `hub-router.json` read before the checker run.
- [x] Record any logic-sync conflict between this plan and current `sk-design`/`sk-doc` state. Evidence: `implementation-summary.md` records no logic-sync conflict.

### Phase 2: Canon Verification
- [x] Run `parent-skill-check.cjs` fresh against `.opencode/skills/sk-design` and capture the full transcript and exit code.
- [x] [P] Confirm `proceduresPath` presence and directory resolution for all five workflow modes in `mode-registry.json`.
- [x] [P] Inventory the six `procedures/` directories and their card counts.
- [x] Sample-check at least one card per owning mode against `procedure_card_schema.md`'s required fields.

### Phase 3: Canon-Doc Gap and Rule-of-Three Audit
- [x] Read `parent_skills_nested_packets.md` §4 (Three Hubs Extension Matrix) and confirm no `procedures/`/`proceduresPath` mention.
- [x] Read `parent_skills_nested_packets.md` §6 (Companion file policy) and confirm no `procedures/`/`proceduresPath` mention.
- [x] [P] Check the `sk-code` hub directory for any `procedures/` companion directory.
- [x] [P] Check the `deep-loop-workflows` hub directory for any `procedures/` companion directory.
- [x] Record the Rule-of-Three finding (adopted-by-N-hubs count).

### Phase 4: Decision and Handoff
- [x] Draft ADR-001 alternatives and a Five Checks evaluation in `decision-record.md`.
- [x] Record the formalize-vs-local recommendation and its reconsideration trigger.
- [x] State the Phase 007 handoff criteria explicitly in `spec.md` and `implementation-summary.md`.
- [x] Update `checklist.md` P0/P1 rows with evidence or an approved deferral.
- [x] Run strict spec validation for this phase folder after metadata regeneration.

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Spec validation | Phase docs structure and required metadata | `validate.sh --strict` |
| Entry gate review | Phase 005 documentation closure and CONDITIONAL verdict | Phase 005 `spec.md`, `release-report.md` |
| Canon checker | Structural conformance of `sk-design` to the parent-hub pattern | `parent-skill-check.cjs .opencode/skills/sk-design` |
| Registry/procedures audit | `proceduresPath` consistency and directory inventory | `mode-registry.json` read plus directory listing |
| Canon-doc gap review | Confirm §4/§6 omit `procedures/`/`proceduresPath` | Direct read of `parent_skills_nested_packets.md` |
| Rule-of-Three check | Cross-hub adoption evidence | Directory search across `.opencode/skills` |
| ADR review | Decision quality and consequences for Phase 007 | `decision-record.md` Five Checks evaluation |

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 005 documentation closure | Governance | Closed (CONDITIONAL release verdict; live/manual/browser gaps remain operator-owned) | Phase 006 audit and decision work unblocked regardless of the outstanding gaps |
| Current `sk-design` hub/registry/procedures state | Evidence | To be inspected at execution time | Verification evidence must reflect live state, not this plan's grounding |
| `parent_skills_nested_packets.md` §4/§6 | Evidence | To be read at execution time | Canon-doc gap claim depends on a fresh read |
| `sk-code` and `deep-loop-workflows` hub contents | Evidence | To be inspected at execution time | Rule-of-Three finding depends on a fresh cross-hub check |
| Phase 007 procedure-card template alignment | Follow-on | Deferred explicitly until this ADR is finalized | Phase 007 cannot scope its own template work without this decision |
| Strict spec validation | Documentation | Re-run after metadata regeneration | Result recorded once this phase executes |

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The canon checker reports a new FAIL not explained by this plan's grounding, or the ADR recommendation cannot be supported by evidence gathered during execution.
- **Procedure**: Stop; inspect `git diff` and `git status` first. This phase makes no implementation edits, so rollback is limited to revising this phase's own docs; preserve unrelated sibling-phase and parent-level dirty-tree state.

<!-- /ANCHOR:rollback -->
---

<!-- ANCHOR:l2-phase-deps -->
## L2: PHASE DEPENDENCIES

```text
Phase 005 Closure ──> Canon Verification ──> Canon-Doc + Rule-of-Three Audit ──> Decision and Handoff
       │                                                                              │
       └─────────────── blocks Phase 007 template-scope decision until evidenced ─────┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Phase 005 Closure | Phase 005 documentation and release-report evidence | All Phase 006 audit work |
| Canon Verification | Phase 005 Closure | Canon-Doc + Rule-of-Three Audit |
| Canon-Doc + Rule-of-Three Audit | Canon Verification, current canon-doc content | Decision and Handoff |
| Decision and Handoff | Canon-Doc + Rule-of-Three Audit | Phase 007 template-scope decision |

<!-- /ANCHOR:l2-phase-deps -->
---

<!-- ANCHOR:l2-effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Entry Gate and Current State Review | Low | 15-30 minutes |
| Canon Verification | Low | 20-40 minutes |
| Canon-Doc + Rule-of-Three Audit | Low | 20-40 minutes |
| Decision and Handoff | Medium | 30-60 minutes |
| **Total** | | **1.5-2.8 hours after Phase 005 closure** |

<!-- /ANCHOR:l2-effort -->
---

<!-- ANCHOR:l2-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-implementation Checklist
- [ ] Phase 005 documentation-level closure and CONDITIONAL verdict are read. Evidence target: Phase 005 `spec.md`, `release-report.md` §7.
- [ ] Current `sk-design` hub and `sk-doc` canon-doc files are read before audit claims are made. Evidence target: `SKILL.md`, `mode-registry.json`, `hub-router.json`, `parent_skills_nested_packets.md`.
- [ ] Zero-edit boundary is recorded before execution begins. Evidence target: `spec.md` Files to Change table lists only this phase folder's own docs and metadata.
- [ ] Non-destructive rollback path is named. Evidence target: rollback procedure starts with `git diff` and `git status` inspection.

### Rollback Procedure
1. **Immediate**: Stop the audit or decision-drafting step and preserve current worktree state.
2. **Document**: Record which check failed: canon checker FAIL, missing `proceduresPath`, canon-doc gap not confirmed, or Rule-of-Three evidence contradicting the plan.
3. **Preserve**: Avoid stash/reset/revert until unrelated work ownership is clear.
4. **Recover**: Revise only this phase's own docs after the finding is understood; no implementation file needs reverting since none was edited.
5. **Re-verify**: Re-run the canon checker and re-read the canon-doc sections before resuming.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: This is a documentation-and-decision-only phase; removing this phase folder fully reverses it. No `sk-design`, `sk-doc`, or command file needs reverting because none is edited by this phase.

<!-- /ANCHOR:l2-rollback -->

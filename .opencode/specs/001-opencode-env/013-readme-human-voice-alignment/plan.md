# Implementation Plan: README Human Voice Alignment

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown (prose editing) |
| **Framework** | .opencode/ public release repo |
| **Storage** | Git (file-level version control) |
| **Testing** | grep-based verification, manual spot-checks |

### Overview
Apply Human Voice Rules to ~77 README.md files across .opencode/, update the workflows-documentation skill to enforce HVR permanently, and establish anchor tag policy. Work proceeds in 6 waves: priority files first, then parallel batches of 4, then verification.

<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified (HVR rules available from Barter ecosystem)

### Definition of Done
- [ ] All ~77 README files pass HVR grep checks
- [ ] workflows-documentation skill updated with HVR section
- [ ] Anchor tags only in system-spec-kit/README.md
- [ ] Spec folder documentation complete

<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Batch Processing with Wave-Based Execution

### Key Components
- **HVR Rule Set**: The find-and-replace patterns, banned word list, punctuation rules
- **workflows-documentation skill**: Permanent home for HVR enforcement rules
- **Verification harness**: grep commands that confirm zero violations remain

### Data Flow
HVR rules (reference) -> Agent applies rules to README batch -> Commit per wave -> Verification grep pass confirms zero violations -> Next wave

<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Wave 1: Priority Files + Skill Update (CRITICAL PATH)
- [ ] Apply HVR to root .opencode/README.md (style reference for all others)
- [ ] Apply HVR to .opencode/skill/system-spec-kit/README.md (keep anchors)
- [ ] Apply HVR to .opencode/mcp_server/README.md (strip anchors)
- [ ] Update workflows-documentation SKILL.md with HVR enforcement section
- [ ] Update workflows-documentation references with HVR rules
- [ ] Commit Wave 1

### Wave 2: Skill READMEs Batch A (4 files per agent, parallelizable)
- [ ] Agent 1: workflows-code--web-dev, workflows-code--full-stack, workflows-code--opencode, workflows-documentation
- [ ] Agent 2: workflows-git, workflows-chrome-devtools, mcp-figma, mcp-code-mode
- [ ] Agent 3: system-spec-kit sub-READMEs (templates, scripts, etc.)
- [ ] Commit Wave 2

### Wave 3: Spec Kit Internal READMEs (4 files per agent, parallelizable)
- [ ] Agent 1: system-spec-kit/templates/*, system-spec-kit/scripts/*
- [ ] Agent 2: system-spec-kit/references/*, system-spec-kit/assets/*
- [ ] Commit Wave 3

### Wave 4: Agent and Command READMEs (4 files per agent, parallelizable)
- [ ] Agent 1: .opencode/agent/*.md READMEs (if any)
- [ ] Agent 2: .opencode/command/*.md READMEs (if any)
- [ ] Agent 3: Remaining .opencode/ top-level READMEs
- [ ] Commit Wave 4

### Wave 5: Remaining Files (mop-up)
- [ ] Process any README files not covered in Waves 1-4
- [ ] Commit Wave 5

### Wave 6: Verification
- [ ] Run grep checks for em dashes across all README files
- [ ] Run grep checks for semicolons (excluding code blocks)
- [ ] Run grep checks for banned words
- [ ] Run grep checks for Oxford commas
- [ ] Spot-check 5 random READMEs for natural voice
- [ ] Verify anchor tags only in system-spec-kit/README.md
- [ ] Final commit with any corrections

<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Automated | All README files: em dashes, semicolons, banned words | grep, rg (ripgrep) |
| Automated | Anchor tag policy | grep for anchor patterns |
| Manual | Voice quality, readability, meaning preservation | Human spot-check of 5 files |

<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| HVR reference rules | Internal | Green | Cannot proceed without rules |
| workflows-documentation skill | Internal | Green | Skill update blocked |
| Git access | Internal | Green | Cannot commit waves |

<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Significant meaning loss discovered after multiple waves
- **Procedure**: `git revert` the wave commit(s) that introduced errors, re-apply with corrections

<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Wave 1 (Priority + Skill) ──► Wave 2 (Skill READMEs A) ──┐
                                                          ├──► Wave 6 (Verify)
Wave 3 (Spec Kit Internal) ──► Wave 4 (Agents/Commands) ──┤
                                                          │
                              Wave 5 (Mop-up) ───────────┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Wave 1 | None | Waves 2-5 (sets style reference) |
| Wave 2 | Wave 1 | Wave 6 |
| Wave 3 | Wave 1 | Wave 6 |
| Wave 4 | Wave 1 | Wave 6 |
| Wave 5 | Wave 1 | Wave 6 |
| Wave 6 | Waves 2-5 | None (final) |

<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Wave 1 (Priority + Skill) | High | 2-3 hours |
| Wave 2 (Skill READMEs A) | Med | 1-2 hours |
| Wave 3 (Spec Kit Internal) | Med | 1-2 hours |
| Wave 4 (Agents/Commands) | Low | 1 hour |
| Wave 5 (Mop-up) | Low | 30 min |
| Wave 6 (Verification) | Med | 1-2 hours |
| **Total** | | **6-10 hours** |

<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Git branch created for HVR work
- [ ] Wave 1 committed before proceeding to Wave 2
- [ ] Each wave committed separately for granular rollback

### Rollback Procedure
1. Identify the wave that introduced the problem
2. `git revert <wave-commit-hash>` for that specific wave
3. Re-apply HVR to affected files with corrections
4. Re-run verification grep checks

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A (text-only changes, git revert sufficient)

<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌─────────────────────┐
│      Wave 1          │
│  Priority + Skill    │
│  (CRITICAL PATH)     │
└──────────┬──────────┘
           │
     ┌─────┼─────────────────┐
     │     │                 │
     ▼     ▼                 ▼
┌────────┐ ┌────────┐ ┌────────┐
│ Wave 2 │ │ Wave 3 │ │ Wave 4 │  (parallel after Wave 1)
│ Skills │ │ SpecKit│ │ Agents │
└───┬────┘ └───┬────┘ └───┬────┘
    │          │           │
    │     ┌────┘           │
    │     │  ┌─────────────┘
    ▼     ▼  ▼
   ┌──────────┐
   │  Wave 5  │
   │  Mop-up  │
   └────┬─────┘
        │
        ▼
   ┌──────────┐
   │  Wave 6  │
   │  Verify  │
   └──────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Wave 1 | HVR rules | Style reference, skill update | Waves 2-5 |
| Wave 2 | Wave 1 | Processed skill READMEs | Wave 6 |
| Wave 3 | Wave 1 | Processed spec kit READMEs | Wave 6 |
| Wave 4 | Wave 1 | Processed agent/command READMEs | Wave 6 |
| Wave 5 | Wave 1 | Remaining files processed | Wave 6 |
| Wave 6 | Waves 2-5 | Verified clean state | None |

<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Wave 1** - 2-3 hours - CRITICAL (sets style reference for all others)
2. **Wave 6** - 1-2 hours - CRITICAL (final verification gate)

**Total Critical Path**: 3-5 hours (Wave 1 + Wave 6)

**Parallel Opportunities**:
- Waves 2, 3, 4 can run simultaneously after Wave 1 completes
- Wave 5 can run in parallel with or after Waves 2-4
- Within each wave, 4-file batches can be dispatched to parallel agents

<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Wave 1 Complete | Root README + skill updated, style reference set | End of Wave 1 |
| M2 | All Waves Complete | All ~77 files processed | End of Wave 5 |
| M3 | Verified Clean | All grep checks pass, spot-check passed | End of Wave 6 |

<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Adopt HVR as Permanent Documentation Standard

**Status**: Proposed

**Context**: Documentation across .opencode/ uses inconsistent voice. AI-generated patterns are detectable and undermine credibility. The Barter ecosystem has proven HVR rules that produce natural prose.

**Decision**: Adopt HVR permanently in the workflows-documentation skill and apply retroactively to all existing READMEs.

**Consequences**:
- All future documentation follows one voice standard
- One-time cost of rewriting ~77 files (this project)

**Alternatives Rejected**:
- Per-file editing as needed: Too inconsistent, no enforcement mechanism
- See full ADR in `decision-record.md`

---

<!--
LEVEL 3 PLAN - README Human Voice Alignment
6-wave approach with parallel agent batches
Critical path: Wave 1 (priority) -> Wave 6 (verify)
-->

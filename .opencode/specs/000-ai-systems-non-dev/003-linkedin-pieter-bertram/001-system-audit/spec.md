<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: standard-v2 -->

# Spec: LinkedIn Ghostwriter System Audit — Pieter Bertram

## Metadata

| Field | Value |
|-------|-------|
| **Level** | L2 |
| **Priority** | P0 — Critical |
| **Status** | Audit Complete → Fixes Pending |
| **Created** | 2026-02-10 |
| **System** | `3. LinkedIn/Pieter Bertram/` |
| **Scope** | 12 knowledge base files, 20 exported posts, full architecture |

## Problem & Purpose

**Problem:** The Pieter Bertram LinkedIn ghostwriter system contains significant internal contradictions, broken routing logic, and a validation system that cannot enforce its own rules. While the voice and content quality are strong, the enforcement infrastructure has fractures that cause unpredictable behavior and allow rule violations to pass uncaught.

**Purpose:** Audit all system files to identify bugs, misalignments, contradictions, and gaps. Produce a prioritized fix plan.

## Scope

### In Scope
- System architecture files (AGENTS.md, System Prompt, Interactive Mode, DEPTH Framework)
- Voice definition files (Voice DNA, Platform Strategy)
- Rules & validation files (Content Standards, Quality Validators, Engagement, Human Voice Extensions)
- Context files (Personal, Industry Extensions, Brand Extensions)
- All 20 exported posts (validation accuracy check)
- CORINA questionnaire status

### Out of Scope
- Rewriting post content
- Platform Strategy algorithm updates
- New feature development
- Other LinkedIn profiles (only Pieter Bertram)

### Files Audited

| File | Version | Category |
|------|---------|----------|
| AGENTS.md | — | Entry Point |
| System - Prompt | v0.130 | System |
| System - Interactive Mode | v0.121 | System |
| Thinking - DEPTH Framework | v0.121 | System |
| Voice - DNA | v0.122 | Voice |
| Voice - Platform Strategy | v0.110 | Voice |
| Rules - Content Standards | v0.122 | Rules |
| Rules - Quality Validators | v0.122 | Rules |
| Rules - Engagement | v0.110 | Rules |
| Rules - Human Voice Extensions | v0.100 | Rules |
| Context - Personal | v0.110 | Context |
| Context - Industry Extensions | v0.100 | Context |
| Context - Brand Extensions | v0.100 | Context |
| Export posts [001]-[020] | — | Output |

## Requirements

### P0 — Blockers (Must Fix)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-01 | Canonicalize hard blocker list in single authoritative file | One master list in QV; DNA + HVE reference it, never duplicate |
| REQ-02 | Fix PRELOAD_GROUPS key names to match detect_mode() output | All 11 modes resolve to correct preload group |
| REQ-03 | Canonicalize Pieter Test to single version | One version in one file; other files reference, not redefine |
| REQ-04 | Canonicalize perspective minimums | One table of values per energy level in one file |
| REQ-05 | Add 3-item list detection to QV scoring | New rule: exactly 3-item constructions flagged as -2 deduction |

### P1 — Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-06 | Define missing state machine states ($engagement, $optimize) | Both states have actions, transitions, nextState defined |
| REQ-07 | Resolve "influencer" hard blocker vs Global Rule contradiction | Clear rule for when "influencer" is allowed |
| REQ-08 | Fix HVE precedence — extend only, never downgrade hard blockers | HVE loading condition updated; no hard blocker downgrades |
| REQ-09 | Fix $feature fallback chain (Context-Industry, not Context-Personal) | Fallback loads correct context file |
| REQ-10 | Synchronize formatting constraints (arrows, hashtags, emojis, CTAs) | Single reference table, all files consistent |

### P2 — Nice to Have

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-11 | Fix filename references (add "Extensions" suffix) | All references match actual filenames |
| REQ-12 | Fix section cross-reference (Section 3, not Section 4) | Interactive Mode points to correct section |
| REQ-13 | Resolve "founder" keyword routing collision | "founder journey" routes to $personal, not $feature |
| REQ-14 | Resolve competing cognitive frameworks (Sequential Thinking vs DEPTH) | Clear arbitration rule documented |
| REQ-15 | Fill CORINA questionnaire | Personal data collected from Pieter |

## Success Criteria

| ID | Criterion |
|----|-----------|
| SC-01 | Zero hard blocker contradictions between files |
| SC-02 | All 11 routing modes resolve to correct preload group |
| SC-03 | Single canonical Pieter Test referenced (not redefined) across files |
| SC-04 | Re-audit of 20 posts shows <20% 3-item list occurrence (down from 80%) |
| SC-05 | QV scoring accounts for ALL banned terms from DNA + HVE |

## Risks & Dependencies

| Risk | Impact | Mitigation |
|------|--------|------------|
| Hard blocker canonicalization may lose nuance | Medium | Review each term's context before consolidating |
| Routing fix may change output of existing commands | Medium | Test each command after fix |
| CORINA data collection depends on Pieter's availability | High | Can proceed with all technical fixes without it |

## L2: Non-Functional Requirements

| ID | Requirement |
|----|-------------|
| NFR-01 | All knowledge base files must maintain consistent version numbering after updates |
| NFR-02 | No single concept (hard blockers, energy levels, Pieter Test) defined in more than one file |
| NFR-03 | Cross-file references must use exact filenames |

## L2: Edge Cases

| Scenario | Expected Behavior |
|----------|-------------------|
| New hard blocker added to Voice DNA but not QV | Should be caught by NFR-02 (single source of truth) |
| $raw mode with perspective questions | System skips perspectives (0 required, no self-answering) |
| Post about Pieter's founder journey mentioning "founder" | Routes to $personal, not $feature |

## L2: Complexity Assessment

| Dimension | Score | Rationale |
|-----------|-------|-----------|
| Scope | 35/40 | 12+ files, cross-file dependencies, routing logic |
| Risk | 15/20 | Changes to routing affect all future output |
| Research | 8/10 | Full audit complete, findings documented |
| **Total** | **58/70** | High complexity |

## Open Questions

- ~~How many hard blockers total when DNA + QV + HVE are merged?~~ → Estimated 35-40 unique terms
- Should CORINA data collection block technical fixes? → No, proceed independently
- What is the desired 3-item list threshold (zero tolerance or percentage)? → TBD by system owner

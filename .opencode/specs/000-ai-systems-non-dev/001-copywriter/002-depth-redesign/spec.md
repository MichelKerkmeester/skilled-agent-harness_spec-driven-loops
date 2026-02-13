# Spec: DEPTH Framework Redesign

## Overview
Redesign the DEPTH thinking system from a round-based process (10 rounds) to a phase-based checklist with energy-level scaling (Quick/Standard/Deep). Remove RICCE validation framework (redundant with MEQT). Unify terminology across all three system files.

## Problem Statement
The Barter Copywriter system had three competing issues identified in the Phase 1 audit (spec 001):
1. **Bug #2:** "DEPTH rounds" meant 10 rounds in one file but 2-3 in another (3-5× variance)
2. **Bug #7:** 9 variations × 10 rounds = 90 cognitive rounds per tagline (impractical)
3. **Bug #8:** Two thinking frameworks competed: Sequential Thinking Protocol (AGENTS.md) + DEPTH (Framework file)

## Solution
- Replace round counts with energy levels: Quick (3 phases), Standard (5 phases), Deep (5 phases extended)
- Remove RICCE validation (absorbed into MEQT scoring)
- Make cognitive techniques optional toolkit instead of mandatory every time
- Perspectives analyzed per-brief, not per-variation
- Single source of truth for energy levels in DEPTH Framework, referenced by other files

## Scope

### In Scope
- DEPTH Framework file (v0.114 → v0.200)
- Interactive Mode file (v0.414 → v0.500)
- System Prompt file (v0.822 → v0.900)

### Out of Scope
- AGENTS.md Sequential Thinking Protocol removal (future work)
- Token Budget file updates (future work)
- MEQT + HVR scoring unification (future work)
- Cognitive load reduction (200+ rules → ≤30 core rules) (future work)

## Success Criteria
- [ ] Zero occurrences of "rounds" (as DEPTH rounds) across all three files
- [ ] Zero occurrences of "RICCE" across all three files
- [ ] Energy levels defined once in DEPTH v0.200, referenced in other files
- [ ] MEQT rubric canonical in System Prompt Section 6, only summarized elsewhere
- [ ] All three files internally consistent on terminology

# Plan: DEPTH Framework Redesign

## Architecture Decision
**DEPTH as a Checklist, Not a Process**

| Keep | Change | Remove |
|---|---|---|
| D-E-P-T-H phase concept | 10 rounds → 5-phase checklist | Sequential Thinking Protocol from AGENTS.md |
| Multi-perspective analysis | Perspectives per-brief, not per-variation | "Rounds" concept entirely |
| Cognitive techniques | Mandatory → Optional toolkit by energy level | RICCE validation (redundant) |
| MEQT scoring | Two-Layer Transparency → Proof through output metadata | 10-round mandate |
| Energy levels concept | Round counts → Energy levels (Quick/Standard/Deep) | |

## Energy Level Design

| Energy Level | Phases | Perspectives | Cognitive Techniques | Trigger |
|---|---|---|---|---|
| **Quick** | D → P → H | 1-2 recommended (not blocking) | None | `$quick` command |
| **Standard** | D → E → P → T → H | 3 minimum (BLOCKING), target 5 | Pick 1-2 relevant | Default for all modes |
| **Deep** | D(ext) → E → P → T → H | All 5 (BLOCKING) | All 4 applied | Explicit request or complex briefs |

## Implementation Order
1. DEPTH Framework v0.200 (source of truth for energy levels)
2. Interactive Mode v0.500 (references DEPTH v0.200)
3. System Prompt v0.900 (references DEPTH v0.200)
4. Cross-file verification (zero rounds/RICCE, consistent terminology)

## Cross-File Reference Architecture
- **DEPTH Framework v0.200**: Defines energy levels, phases, perspectives, cognitive techniques
- **Interactive Mode v0.500**: References DEPTH v0.200 for energy levels; owns conversation flows
- **System Prompt v0.900**: References DEPTH v0.200 for methodology; owns MEQT rubric (Section 6), routing logic, framework library

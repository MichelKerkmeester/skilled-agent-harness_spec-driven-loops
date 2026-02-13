# Decision Record: DEPTH Framework Redesign

## DR-001: Energy Levels Replace Rounds
- **Decision:** Replace round-based DEPTH processing (10 rounds standard, 1-5 quick) with energy-level scaling (Quick/Standard/Deep)
- **Rationale:** 10 rounds × 9 variations = 90 cognitive rounds per tagline was impractical. Energy levels map to phase subsets (3/5/5-extended) rather than iteration counts.
- **Alternatives Considered:**
  - A) Keep rounds but reduce count (e.g., 5 rounds) — Rejected: still conflates iteration with phase progression
  - B) Remove DEPTH entirely — Rejected: the phase structure (D-E-P-T-H) provides useful scaffolding
  - C) Energy levels (chosen) — Maps naturally to Quick=$quick, Standard=default, Deep=complex
- **Status:** Implemented

## DR-002: Remove RICCE Validation
- **Decision:** Remove RICCE as a separate validation framework
- **Rationale:** RICCE was redundant with MEQT scoring. Both validated quality gates. Having two scoring systems created confusion about which was canonical.
- **Alternative:** Keep RICCE as optional — Rejected: optional validation frameworks get ignored or create inconsistency
- **Status:** Implemented

## DR-003: Cognitive Techniques as Optional Toolkit
- **Decision:** Change cognitive techniques from mandatory-every-time to optional toolkit used when they add value
- **Rationale:** Forcing all 4 techniques on a simple tagline is overhead. Techniques should scale with energy level: none (Quick), 1-2 relevant (Standard), all 4 (Deep).
- **Status:** Implemented

## DR-004: Perspectives Per-Brief, Not Per-Variation
- **Decision:** Analyze perspectives once during Discover phase, then apply insights to all variations
- **Rationale:** Analyzing 5 perspectives × 9 variations = 45 perspective analyses was wasteful. Perspectives inform the brief understanding, not individual variation quality.
- **Status:** Implemented

## DR-005: Single Source of Truth for Energy Levels
- **Decision:** Define energy levels in DEPTH Framework v0.200 only. Other files reference, not redefine.
- **Rationale:** The v0.822 System Prompt and v0.414 Interactive Mode both defined their own DEPTH configurations, leading to the variance bug. Single source eliminates drift.
- **Status:** Implemented

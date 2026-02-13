# Plan: Prompt Improver

<!-- SPECKIT_LEVEL: 3 -->

---

## Approach

Two workstreams for the Prompt Improver system:

1. **Full system audit** — Deep audit using the 21-category bug taxonomy. Prompt Improver has never been audited. It has unique complexity: triple scoring (CLEAR/EVOKE/VISUAL), 8 prompt frameworks, visual/image/video creative modes, and the highest Interactive Mode depth_rounds count (14 references).

2. **DEPTH redesign** — Migrate from rounds-based DEPTH to energy levels. Remove 25 RICCE references and 19 round references. Replace 14 depth_rounds references in Interactive Mode. Align with Copywriter v0.200 template while preserving the rich prompt engineering toolset.

### Phase 1: Deep System Audit

1. Read all Prompt Improver KB files (system, rules, context, voice, AGENTS.md)
2. Apply 21-category bug taxonomy
3. Produce audit report with severity ratings

### Phase 2: DEPTH Redesign (3 files)

1. DEPTH Framework v0.131 → v0.200: Remove rounds (19 refs), remove RICCE (25 refs), energy levels, optional cognitive techniques
2. Interactive Mode v0.700 → v0.800: Remove depth_rounds (14 refs — most of any system), update command configs
3. System Prompt v0.982 → v1.000: Remove rounds (18 refs), RICCE (5 refs), update workflow

### Phase 3: Audit Fix Implementation

1. Apply all CRITICAL/HIGH fixes
2. Apply MEDIUM/LOW fixes
3. Verification sweep

### Preserve (DO NOT change)

- CLEAR (50pt) + EVOKE (50pt) + VISUAL (60/70pt) scoring systems
- 8 prompt frameworks (RCAF, COSTAR, TIDD-EC, CRAFT, RACE, CIDI, CRISPE, RISEN)
- Visual/Image/Video creative modes with refinement loops
- Component library gate (mandatory for `$vibe`)
- Format selection (Markdown, JSON, YAML)
- 20+ platform detection
- Downloadable files (not artifacts) export pattern
- Raw (0) / Standard (10) / Deep (10+) energy labels — adapt to Quick/Standard/Deep

---

## Dependencies

- Copywriter DEPTH v0.200 as template reference

---

## Estimated Effort

- Phase 1: ~30 min (read + audit)
- Phase 2: ~60 min (3 file rewrites — highest depth_rounds count)
- Phase 3: ~30 min (fix implementation + verification)

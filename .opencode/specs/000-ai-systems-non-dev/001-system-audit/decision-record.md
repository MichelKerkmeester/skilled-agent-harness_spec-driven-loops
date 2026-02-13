# Decision Record: Prompt Improver

<!-- SPECKIT_LEVEL: 3 -->

---

## ADR-001: Energy Level Label Mapping

**Context**: Prompt Improver uses custom energy labels: Raw (0 perspectives), Standard (10 techniques), Deep (10+ techniques). These don't map 1:1 to the standard Quick/Standard/Deep pattern.

**Decision**: Map Raw → Quick, Standard → Standard, Deep → Deep. Preserve the perspective/technique counts but use standardised energy labels.

**Rationale**: Consistent terminology across all systems while preserving system-specific behaviour. The numbers (0/10/10+) describe what happens at each level — the labels just need to be consistent.

**Status**: Proposed

---

## ADR-002: RICCE Replacement Strategy

**Context**: Prompt Improver has 25 RICCE references. The triple scoring system (CLEAR 50pt + EVOKE 50pt + VISUAL 60/70pt) already provides robust quality validation.

**Decision**: Remove all RICCE references. CLEAR/EVOKE/VISUAL scoring serves as the quality gate.

**Rationale**: Consistent with cross-system DEPTH redesign. Each system keeps its own scoring system.

**Status**: Proposed

---

## ADR-003: Interactive Mode depth_rounds Migration

**Context**: Interactive Mode v0.700 has 14 depth_rounds references — the highest of any system. These are deeply embedded in the conversation flow logic.

**Decision**: Replace all `depth_rounds` with `energy` parameter. Map numeric values to Quick/Standard/Deep.

**Rationale**: Follows the same pattern established in Copywriter Interactive Mode v0.500.

**Status**: Proposed

# Decision Record: Product Owner — DEPTH Energy Migration

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

---

## ADR-001: RICCE Replacement Strategy

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2025-02-11 |
| **Deciders** | System architect |

---

### Context

The Product Owner system uses RICCE validation in the System Prompt (5 references: rules 31/37, loading table, RICCE Structure table, must-have validation). RICCE is being removed system-wide as part of the DEPTH energy migration. The Product Owner already has a 6-dimension self-rating scoring system that serves a similar validation role.

### Constraints

- RICCE must be fully removed (cross-system decision)
- Quality validation must be preserved
- 6-dimension self-rating is already embedded in templates

---

### Decision

**Summary**: Remove all 5 RICCE references from the System Prompt. The 6-dimension self-rating scoring system (Completeness, Clarity, Actionability, Accuracy, Relevance, Mechanism Depth) serves as the quality gate, replacing RICCE's validation role.

**Details**: Each RICCE reference is replaced differently — rules are removed, the RICCE Structure table is deleted, and the loading table entry is updated to reference energy levels instead. The 6-dimension scoring already covers validation needs without RICCE.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Remove RICCE, keep 6-dim scoring** | Clean, already embedded, no new work | Loses RICCE-specific checks | 8/10 |
| Replace RICCE with new framework | Custom-fit validation | Unnecessary — 6-dim already works | 4/10 |
| Keep RICCE alongside energy levels | No validation gap | Contradicts system-wide migration | 2/10 |

**Why Chosen**: The 6-dimension self-rating is already deeply integrated into Product Owner templates and covers the same validation needs as RICCE. Adding a replacement framework would be unnecessary complexity.

---

### Consequences

**Positive**:
- Consistent with cross-system DEPTH migration pattern
- Simplifies system prompt — removes contradictory validation layer
- 6-dimension scoring is more specific to Product Owner's domain

**Negative**:
- RICCE's structured validation removed — Mitigation: 6-dimension scoring covers same ground

---

## ADR-002: Version Bump Convention

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2025-02-11 |
| **Deciders** | System architect |

---

### Context

The three Product Owner KB files need clear version bumps to mark the energy migration. Current versions: DEPTH Framework v0.200, Interactive Mode v0.320, System Prompt v0.956.

### Constraints

- Version bumps must be meaningful (not arbitrary)
- Must follow existing project conventions (incremental major bumps)

---

### Decision

**Summary**: System Prompt v0.956 → v1.000 (milestone), Interactive Mode v0.320 → v0.400, DEPTH Framework stays at v0.200 (already clean — version bump only if structural changes needed).

**Details**: The System Prompt reaching v1.000 marks it as a mature, fully redesigned system. Interactive Mode gets a standard minor bump. DEPTH Framework is already migrated, so no version change unless audit fixes require structural modifications.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **v1.000 / v0.400 / v0.200 (keep)** | Milestone meaning, minimal DEPTH change | None significant | 9/10 |
| Bump all three equally | Uniform versioning | Misleading — DEPTH wasn't changed | 5/10 |
| Semantic versioning | Industry standard | Overkill for KB files | 3/10 |

**Why Chosen**: Version numbers should reflect the magnitude of actual changes. System Prompt gets the biggest overhaul (16+ round refs, 5 RICCE refs removed), justifying v1.000. DEPTH Framework was already clean, so bumping it would misrepresent the work done.

---

## ADR-003: Spec Correction — Misdiagnosed Migration Targets

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2025-02-11 |
| **Deciders** | System architect |

---

### Context

The original spec (006-product-owner, first draft) described the DEPTH Framework as having 30 round references and 28 RICCE references, making it the "heaviest RICCE user" and the primary migration target. Detailed audit of actual file contents revealed this was incorrect:

| File | Claimed Round Refs | Actual Round Refs | Claimed RICCE Refs | Actual RICCE Refs |
|------|-------------------|-------------------|--------------------|--------------------|
| DEPTH Framework v0.200 | 30 | **0** | 28 | **0** |
| System Prompt v0.956 | 11 | **16+** | 5 | **5** |
| Interactive Mode v0.320 | 3 | **5+** | 0 | **0** |

The DEPTH Framework was already migrated to energy levels. The original spec misidentified the migration target.

### Constraints

- Spec must reflect actual file state, not assumed state
- Migration work must target files that actually need it
- Audit methodology must be line-level verifiable

---

### Decision

**Summary**: Correct the spec to identify System Prompt v0.956 and Interactive Mode v0.320 as the actual migration targets. DEPTH Framework v0.200 is confirmed clean and requires review only.

**Details**: All reference counts updated to match line-level audit of actual files. Tasks, checklist items, and plan phases corrected to target the right files. The DEPTH Framework goes from "primary target — most complex migration" to "review only — already clean."

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Correct spec, target actual legacy files** | Accurate, efficient work | Admits original error | 10/10 |
| Keep original targets, re-migrate DEPTH | No spec change needed | Wastes effort on clean file | 1/10 |

**Why Chosen**: Working from incorrect data wastes effort and risks introducing bugs into a file that's already clean. Correcting the spec ensures implementation targets the actual problems.

---

### Consequences

**Positive**:
- Implementation will target actual problems
- No wasted effort on already-clean DEPTH Framework
- More accurate reference counts enable verifiable grep checks

**Negative**:
- Spec rewrite required — Mitigation: Done in this commit

---

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Spec described wrong targets — implementation would have failed |
| 2 | **Beyond Local Maxima?** | PASS | Line-level audit of all 3 files verified actual state |
| 3 | **Sufficient?** | PASS | All 5 spec files corrected with verified reference counts |
| 4 | **Fits Goal?** | PASS | Directly enables correct DEPTH migration |
| 5 | **Open Horizons?** | PASS | Corrected spec supports future audit and implementation |

**Checks Summary**: 5/5 PASS

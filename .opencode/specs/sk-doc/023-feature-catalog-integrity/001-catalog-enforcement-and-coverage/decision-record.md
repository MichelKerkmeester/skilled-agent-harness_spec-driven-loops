---
title: "Decision Record: catalog enforcement and coverage"
description: "The four rulings both sibling phases depend on: the validator's covered set, what counts as a feature leaf, description-parity strictness, and whether mcp-code-mode owes a feature catalog."
trigger_phrases:
  - "catalog covered set ruling"
  - "feature leaf definition"
  - "description parity strictness"
  - "mcp-code-mode catalog applicability"
importance_tier: "high"
contextType: "planning"
parent: "sk-doc/023-feature-catalog-integrity/001-catalog-enforcement-and-coverage"
_memory:
  continuity:
    packet_pointer: "sk-doc/023-feature-catalog-integrity/001-catalog-enforcement-and-coverage"
    last_updated_at: "2026-07-31T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Recorded operator rulings and the scoped RC-007-07 strike"
    next_safe_action: "Reconcile packet receipts and strict validation"
    blockers:
      - "Known catalog backlog remains in the explicit WARN tier"
    key_files: []
    completion_pct: 0
    open_questions:
      - "Q1 mcp-code-mode applicability"
      - "Q2 description-parity strictness"
      - "Q8 discovery rule"
    answered_questions: []
---
# Decision Record: Catalog Enforcement and Coverage

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: The Four Catalog-Standard Rulings

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted with scoped deferrals |
| **Date** | 2026-07-30 |
| **Deciders** | Operator, plus the sk-doc feature-catalog standard owner |

---

<!-- ANCHOR:adr-001-context -->
### Context

Both sibling phases need answers before they can repair anything. `002` cannot apply a description-parity rule without
knowing its strictness, and it cannot reshape the advisor root entries in the right direction without it. `003` cannot
act on 94 orphan leaves in `system-spec-kit` without knowing what counts as a feature leaf. Neither can claim a
strict-clean result unless the validator covers their packages at all.

Two of the four are genuine ambiguities in the standard rather than defects in a catalog. The snippet template states
that leaf `title` matches the root H3, and that the OVERVIEW first paragraph is a one-liner matching the root
description while the second paragraph must not repeat the root verbatim. It does not state that leaf frontmatter
`description` equals the root Description. Five findings assume it does. Adopting that reading is an amendment to the
standard, not the repair of a breach, and the two must not be confused.

The covered-set question has a measured answer. Discovery keyed on `hub-router.json` produced 8 packages and 66 leaves
against a corpus of 26 packages and 804 leaves. The implemented presence-based discovery now sees all 26 catalog
packages, including `sk-git` and `system-spec-kit`; only the explicit runtime-data exclusion remains.

### Constraints

- The standard makes catalogs conditional, not mandatory. No skill root owes a catalog merely by existing, so the
  `mcp-code-mode` question cannot be answered by inventing an obligation.
- Widening bijection to all 26 packages surfaces 104 orphan leaves at once and 0 dangling links. Any ruling that turns
  bijection on everywhere at `fail` severity blocks the gate until `003` finishes.
- Literal description equality collides with the template's own instruction not to repeat the root verbatim in the leaf
  body.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: four rulings, recorded here once and cited by both siblings rather than re-argued in each.

**How it works**:

1. **Covered set.** Discovery switches from `hub-router.json` presence to `feature-catalog/` presence, with a ruled
   include/exclude map that records a reason for every exclusion. **OPERATOR-DECISION (Q8).**
2. **Feature-leaf definition.** A feature leaf is a file that documents one capability with its own SOURCE FILES table
   and is therefore owed a root entry. A category overview and a retirement record are not feature leaves and are
   excluded from bijection by classification, not by silence. Each of the 94 `system-spec-kit` orphans is classified
   under this definition rather than bulk-linked.
3. **Description parity.** `title` equality stays literal, because the standard already says so. Frontmatter
   `description` parity is normalized rather than literal, and the snippet template is amended to state the rule
   explicitly. **OPERATOR-DECISION (Q2).**
4. **`mcp-code-mode` applicability.** No catalog obligation is established at this HEAD. The alleged README/package
   defect is refuted: the README claim is already absent and the package.json premise is false. `RC-007-07` is struck
   with that rationale; no README or package change is made in this phase. Revisit if new evidence establishes a
   catalog obligation. **DEFERRED / NOT APPLICABLE AT HEAD (Q1).**
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Presence-based discovery plus normalized description parity** | Coverage tracks the corpus automatically; no churn across 804 leaves for zero reader benefit | Surfaces 104 orphans at once, so it needs staged severity | 8/10 |
| Add `sk-git` and `system-spec-kit` by name | Smallest change, immediate | Naming exceptions is exactly how the current gap was created; the closed set drifts from the corpus again | 4/10 |
| Literal frontmatter description equality | One rule, trivially checkable | Contradicts the template's own "do not repeat the root verbatim" instruction and churns every catalog | 3/10 |
| Bulk-link the 94 orphans | Turns bijection green immediately | Satisfies the checker and corrupts the inventory; a category overview is not a feature | 2/10 |
| Require a catalog for `mcp-code-mode` | Uniformity across skill roots | Invents an obligation the standard does not impose; the current README/package evidence does not establish the premise | 3/10 |

**Why this one**: presence-based discovery makes coverage a tested property instead of a maintained list, and the
normalized parity reading is what the template actually says rather than what five findings assumed it said.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Coverage goes from 8 packages and 66 leaves to the ruled set, and a test fails if a new catalog appears outside it.
- `sk-git` and `system-spec-kit` come inside the gate, which is where five and four findings respectively live.
- Both siblings get a single citable source for four questions instead of re-deciding them per lane.
- `RC-007-07` is closed by a strike rationale at HEAD, with no `mcp-code-mode` code or README change.

**What it costs**:
- 104 orphan-leaf violations arrive at once. Mitigation: staged per-package severity, `warn` on entry and `fail` on
  clean.
- 14 nested packet catalogs nobody audited get checked for the first time. Their current findings enter the explicit
  WARN tier only where the package is listed as known backlog; all other packages fail closed.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A ruling is made on stale evidence | H | T001 re-tests every figure at HEAD before the ruling is recorded, including the parity reading the synthesis disagreed with |
| Normalized parity is too loose to catch real divergence | M | Pair it with the literal title check, which is unambiguous, and review a sample of normalized-pass cases |
| The feature-leaf definition mis-classifies a real feature as an overview | M | `003` classifies each of the 94 individually with evidence rather than by pattern |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | 42 active findings exist because 92 percent of the leaf corpus has no automated check |
| 2 | **Beyond Local Maxima?** | PASS | Five alternatives weighed above, including the cheaper name-based option |
| 3 | **Sufficient?** | PASS | Four rulings are the minimum that unblocks both siblings; nothing broader is decided here |
| 4 | **Fits Goal?** | PASS | Both siblings are blocked on these four answers and on nothing else from this phase |
| 5 | **Open Horizons?** | PASS | Presence-based discovery keeps working as the corpus grows; a named list does not |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- `validate_catalog_package.py`: `expected_root_packages()` becomes presence-based; a severity map is added.
- `assets/feature-catalog-snippet-template.md`: states the description-parity rule explicitly.
- `assets/feature-catalog-template.md`: states the feature-leaf definition and roster-derived policy.
- `sk-create-feature-catalog/SKILL.md`: documents the covered set and the enforced rule roster.
- `sk-create-feature-catalog/scripts/fixtures/`: paired positive/negative inputs for the added rules.
- `sk-create-feature-catalog/scripts/tests/test_validator_fixtures.py`: fixture, coverage, staging, exit, and determinism tests.
- `mcp-code-mode` README and its scripts README: deliberately unchanged because `RC-007-07` is refuted at HEAD.

**How to roll back**: revert the discovery function to the previous `hub-router.json` form and delete the severity map;
the checks and fixtures are independent of the rulings and can stay. The template amendments revert as ordinary
documentation edits. No runtime behavior is involved.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

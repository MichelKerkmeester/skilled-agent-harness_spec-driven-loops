---
title: "Decision Record: Phase 17 bundleRules canonical shape"
description: "Decision record for the single bundleRules field vocabulary planned for parent-hub canon hardening."
trigger_phrases:
  - "phase 017 decision record"
  - "bundleRules canonical shape"
  - "parent hub router decision"
importance_tier: "high"
contextType: "implementation"
status: "Complete"
parent: "sk-code/017-sk-code-parent"
phase: "017"
_memory:
  continuity:
    packet_pointer: "sk-code/017-sk-code-parent/017-canon-hardening"
    last_updated_at: "2026-07-05T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Phase executed; bundleRules canon reconciled, STRICT 0/0"
    next_safe_action: "124 rollup"
---
# Decision Record: Phase 17 bundleRules canonical shape

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Use schema-style bundleRules fields with validator alias tolerance

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-05 |
| **Deciders** | Phase 017 implementer, operator review |

---

<!-- ANCHOR:adr-001-context -->
### Context

The parent-hub canon currently has three incompatible `bundleRules[]` field vocabularies. The template example uses `when`, `primary`, and `surfaces`; the schema reference uses `whenPrimary` and `includeSurfaces`; the validator currently reads `modes`, `primary`, and `evidence`. Master plan phase 017 identifies this as a canon-gap deliverable and requires additive/tolerant validator changes because `parent-skill-check.cjs` serves sk-code, sk-design, and deep-loop-workflows.

### Constraints

- The canonical shape must work for `surfaceBundle` and `orderedBundle` outcomes.
- The validator must not increase deep-loop-workflows' current strict failure count.
- The template and schema must teach the same shape that the validator enforces.
- Concrete hub rules may be optional; absent `bundleRules[]` must remain valid.

<!-- /ANCHOR:adr-001-context -->
---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Canonical `bundleRules[]` entries use `name`, `whenPrimary`, `includeSurfaces`, optional `whenAll`, and `outcome`.

**How it works**: `whenPrimary` names the primary workflow mode for a `surfaceBundle`; `includeSurfaces` lists read-only surface modes to attach; `whenAll` lists all required modes for workflow bundles such as `orderedBundle`; `outcome` names the router outcome. During migration, the validator should normalize legacy aliases (`primary`, `surfaces`, `evidence`, `modes`, and `when`) into the canonical model before checking that every referenced mode exists.

<!-- /ANCHOR:adr-001-decision -->
---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Schema-style fields: `whenPrimary`, `includeSurfaces`, optional `whenAll`** | Already documented in schema; clearly separates primary workflow from evidence surfaces; supports ordered bundles | Requires template update and validator normalization | 9/10 |
| Template-style fields: `when`, `primary`, `surfaces` | Short and easy to type; already present in scaffold template | `when` is unstructured prose and less validator-friendly; conflicts with schema | 5/10 |
| Validator-style fields: `modes`, `primary`, `evidence` | Validator already partially reads these fields | `evidence` is less aligned with the public surface-packet term; not documented in schema/template | 6/10 |
| Keep all three as peers | Lowest immediate implementation effort | Preserves the canon gap and makes future hub authors guess | 2/10 |

**Why this one**: The schema-style shape is the clearest public contract and maps directly to the two parent-hub outcomes that need rules: primary workflow plus surfaces, or all named workflow modes.

<!-- /ANCHOR:adr-001-alternatives -->
---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Hub authors get one copyable shape for `bundleRules[]` instead of three contradictory vocabularies.
- Validator checks can reason about workflow primacy and surface evidence without parsing prose conditions.
- sk-code and sk-design can later encode surfaceBundle rules declaratively without inventing local field names.

**What it costs**:
- Validator logic becomes slightly more complex because it must normalize migration aliases. Mitigation: keep the normalization local to check 5f and only validate referenced mode names.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Legacy hub-router files use old fields | Medium | Treat old fields as aliases during migration |
| Canon shape is applied too strictly before deep-loop aligns | High | Compare deep-loop strict failure count before and after |
| Concrete bundleRules are added before shape lands | Medium | Sequence template/schema/validator update first, then hub-specific rules |

<!-- /ANCHOR:adr-001-consequences -->
---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Master plan line 40 identifies conflicting field vocabularies as a phase 017 deliverable |
| 2 | **Beyond Local Maxima?** | PASS | Three existing shapes were compared before choosing one |
| 3 | **Sufficient?** | PASS | The chosen fields cover surface bundles and workflow bundles without adding a broader schema system |
| 4 | **Fits Goal?** | PASS | The program goal is parent-hub canon conformance across hubs |
| 5 | **Open Horizons?** | PASS | Alias tolerance lets current hubs migrate while phase 019 later promotes checks after all hubs pass |

**Checks Summary**: 5/5 PASS

<!-- /ANCHOR:adr-001-five-checks -->
---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- `parent_skill_hub_router_template.json` uses the canonical example fields.
- `parent_hub_router_schema.md` remains the explanatory source for the same canonical fields.
- `parent-skill-check.cjs` check 5f extracts mode references from canonical fields plus tolerated aliases.
- sk-code may encode concrete surface bundle rules only after the shape is aligned.

**How to roll back**: Revert the template/schema/validator edits from this phase, restore the prior check 5f field extraction, and rerun strict parent-skill-check for sk-code and deep-loop-workflows to confirm baseline behavior.

<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

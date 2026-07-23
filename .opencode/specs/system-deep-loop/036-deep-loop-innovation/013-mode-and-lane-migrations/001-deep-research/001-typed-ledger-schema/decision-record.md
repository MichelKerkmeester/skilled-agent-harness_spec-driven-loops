---
title: "Decision Record: Deep Research Ledger Field Discipline"
description: "Records the exhaustive semantic-kind classification, bounded token and prose shapes, and ASCII-only system-token decision for Deep Research ledger DATA fields."
trigger_phrases:
  - "deep research ledger field kinds"
  - "deep research reason code token"
  - "deep research policy version validation"
  - "deep research ASCII identifiers"
importance_tier: "high"
contextType: "implementation"
parent: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/001-deep-research/001-typed-ledger-schema"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/001-deep-research/001-typed-ledger-schema"
    last_updated_at: "2026-07-21T17:16:43Z"
    last_updated_by: "codex"
    recent_action: "Closed the locator selector non-blank invariant"
    next_safe_action: "Consume the closed event union without widening field shapes"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/deep-research-ledger-schema/deep-research-ledger-schema.ts"
      - ".opencode/skills/system-deep-loop/runtime/tests/unit/deep-research-ledger-schema.vitest.ts"
    completion_pct: 100
    open_questions:
      - "Should a later schema version enumerate admission reason codes after producer vocabulary stabilizes?"
    answered_questions:
      - "All DATA fields are assigned an explicit semantic validation kind"
      - "System-generated identifier, reference, version, and code tokens are ASCII-only"
---
# Decision Record: Deep Research Ledger Field Discipline

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Classify Every DATA Field by Semantic Kind

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-21 |
| **Deciders** | Deep Research typed-ledger schema owners |

---

<!-- ANCHOR:adr-001-context -->
### Context

The prior validator recognized selected reference fields through a hand-curated allowlist and accepted every other string through a 65,536-character free-string fallback. That let `reasonCode`, `admissionPolicyVersion`, `convergencePolicyVersion`, and the top-level next-focus `policyVersion` carry mutable prose even though their names and payload contracts describe stable codes or versions.

The defect was structural. Adding four more field names to the allowlist would leave the same failure mode available to the next identifier, reference, version, or code field.

### Constraints

- All 23 payloads must remain closed shapes and preserve their existing exported TypeScript contracts.
- The schema remains additive-dark and cannot change the shared envelope, authorized ledger, replay fingerprint, or mode contracts.
- Human explanation remains valid only in explicit `*Reason` fields; ledger identifiers and policy tokens cannot carry passages.
- Current producers do not define a complete enumeration for admission reason codes.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Derive every accepted DATA field set from one exhaustive semantic-rule table and validate through a closed kind dispatcher with no free-string fallback.

**How it works**: Each field is classified as a digest, identifier, reference, version, code, enum, ratio, count, boolean, timestamp, bounded prose, array, or one of the existing closed value-object shapes. Unknown and extra fields fail the exact-shape check. `reasonCode` is a code token capped at 128 ASCII characters because the current spec does not enumerate all producer values; this can become an enum only through a versioned contract ratification.

System-generated identifiers, references, versions, and codes use an ASCII-only token alphabet. No legitimate reference in the additive-dark contract is expected to contain non-ASCII text. Locator selectors remain a separate non-blank, single-line locator kind capped at 2,048 characters, while explicit reason prose is capped at 4,096 characters.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Exhaustive field-kind table** | One source defines accepted fields and validators; new fields fail until classified | The table is intentionally explicit and must be updated with schema changes | 9/10 |
| Extend the reference allowlist | Small patch | Repeats the defect and misses future lookalikes | 2/10 |
| Infer all kinds from suffixes | Less table data | Same field name can have different enums or nullability; ambiguous names silently receive the wrong rule | 5/10 |

**Why this one**: The exhaustive table makes omission fail closed and preserves per-occurrence enum and nullability differences without restoring a default string path.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- A valid all-stem fixture proves every current DATA field has an assigned rule because accepted field lists are derived from the rule table.
- `reasonCode` and every top-level policy-version field reject quoted passages before authorization and append.
- Source and passage locator selectors reject whitespace-only values before authorization and append.
- `status` is now occurrence-specific: iteration-start accepts only `started`, while iteration-completion accepts its six terminal observation states.

**What it costs**:
- New DATA fields require an explicit classification before any fixture can pass. Mitigation: treat that failure as the schema-review prompt it is intended to be.
- ASCII-only tokens reject internationalized display text. Mitigation: keep display text outside system identity fields and add a versioned token contract if a real producer requires Unicode.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A producer uses prose where the contract says code or version | M | Reject before append and ratify a new typed field instead of widening the token |
| Admission reason-code vocabulary diverges across producers | M | Keep the 128-character token boundary now; enumerate values in a later version once the vocabulary is stable |
| Ambiguous scalar names are misclassified | L | `tieBreakKey`, `invalidationScope`, `route`, and `mergeMode` are recorded as bounded code tokens; locator selectors use their own kind |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Full-pipeline probes accepted mutable passages in code and version fields before this change |
| 2 | **Beyond Local Maxima?** | PASS | The design replaces the allowlist mechanism instead of extending it |
| 3 | **Sufficient?** | PASS | One table plus one closed dispatcher covers all 23 payloads without changing exported types |
| 4 | **Fits Goal?** | PASS | The change is limited to the schema module, its test, and this leaf's evidence |
| 5 | **Open Horizons?** | PASS | New fields fail closed until their semantic kind is reviewed |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- `deep-research-ledger-schema.ts` replaces `DATA_FIELDS`, suffix heuristics, and `REFERENCE_ID_FIELDS` with `DATA_FIELD_RULES` and a closed semantic-kind validator.
- The targeted Vitest suite adds locator rejection, passage rejection, policy-version rejection, cross-kind completeness, and full-pipeline positive controls.

**How to roll back**: Revert the schema and test changes together. The module has no authoritative writer integration, so rollback does not migrate or rewrite stored state.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

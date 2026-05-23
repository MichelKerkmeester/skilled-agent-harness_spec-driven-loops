---
title: "Decision Record: 116/003 - Review-Depth Schema and Prompt Contract"
description: "ADR for introducing reviewDepthSchemaVersion v2 with applicability-driven enforcement."
trigger_phrases:
  - "116 review depth ADR"
  - "reviewDepthSchemaVersion decision"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/131-deep-skill-evolution/002-deep-review/003-complexity-schema-prompt-contract"
    last_updated_at: "2026-05-22T00:00:00Z"
    last_updated_by: "gpt-5.5"
    recent_action: "Accepted ADR-001 for reviewDepthSchemaVersion v2."
    next_safe_action: "Apply ADR-001 in phase 004 validator enforcement."
    blockers: []
---

# Decision Record: 116/003 - Review-Depth Schema and Prompt Contract

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Introduce reviewDepthSchemaVersion v2 with applicability-driven enforcement

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-05-22 |
| **Deciders** | GPT-5.5 via cli-codex |
| **Phase** | 116/003 |

<!-- ANCHOR:adr-001-context -->
### Context

Phase 001 found that `deep-review` validates discovered findings better than it proves candidate search before a finding exists. Phase 002 seeded fixture names for the next implementation slices: `reviewDepthSchemaVersion`, `reviewDepthApplicability`, `targetSelection`, `searchCoverage`, and `searchLedger`.

The contract has to support three pressures at once:

- Standard and complex reviews need strict proof of target selection, bug-class search, evidence refs, and clean/deferred/blocked dispositions.
- Trivial reviews should not be forced into heavyweight ledger output when scope proof shows the depth contract is unnecessary.
- Historical unversioned review packets must remain readable during rollout.

### Constraints

- Phase 003 may edit schema docs, prompt template text, and spec docs only.
- Phase D owns strict validator implementation.
- Phase E owns reducer/dashboard/report persistence.
- Phase F owns convergence and stop gates.
- Phase G owns coverage graph vocabulary.
- Legacy v1 records exist and must continue to parse.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**Summary**: Add a versioned v2 review-depth contract using `reviewDepthSchemaVersion: 2` as the discriminator and `reviewDepthApplicability` as the mechanism for strict, warning, or skipped depth enforcement.

**Details**: A v2 iteration record adds four top-level contract objects to the existing v1 iteration record:

- `reviewDepthApplicability`
- `targetSelection`
- `searchCoverage`
- `searchLedger[]`

Standard and complex scopes should emit v2 fields. Trivial scope may skip ledger rows only when `reviewDepthApplicability.scopeClass === 'trivial'` and `reviewDepthApplicability.enforcement === 'skip'`, with cited evidence in `reviewDepthApplicability.evidenceRefs`.

Absent or non-2 discriminator values remain legacy v1. Phase D can warn on legacy records without hard-failing historical packets.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Decision |
|--------|------|------|----------|
| Big-bang rename | Clean break from old shallow shape | No legacy migration path; breaks historical packet reading and dashboards | Rejected |
| Hard-fail v2 immediately | Strongest enforcement signal | Breaks read of historical packets and leaves no warning/advisory rollout | Rejected |
| Unversioned additive fields | Minimal prompt/schema churn | Coverage gates need a discriminator to know when strict depth proof applies | Rejected |
| Versioned v2 with applicability | Preserves legacy readability, supports strict standard/complex behavior, and gives trivial scopes a cited escape hatch | Requires later validator and reducer work to respect the discriminator | Accepted |

**Why Chosen**: The versioned shape is the only option that lets later phases enforce real search depth without punishing historical packets or trivial reviews.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**Positive**:

- Later validator work can strict-check only explicit v2 records.
- Standard and complex reviews get auditable target and search proof.
- Trivial reviews keep a documented exemption.
- Reducer/report/graph phases share stable names.

**Negative**:

- The prompt becomes slightly longer.
- Runtime behavior is unchanged until Phase D and later phases implement the contract.
- Agents may initially emit imperfect v2 rows until validator feedback is live.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Ledger rows become boilerplate | M | Require evidence refs, search actions, and exactly-one disposition-specific link. |
| Phase D over-enforces legacy records | H | Compatibility table states absent/non-2 is v1 legacy. |
| Graphless mode under-proves coverage | M | Require explicit `graphCoverageMode: 'graphless_fallback'` with direct evidence refs. |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| Check | Evaluation |
|-------|------------|
| **Clarity** | Clear: one discriminator controls v2 interpretation; top-level objects map to distinct review obligations. |
| **Systems** | Fits the phased architecture: prompt emits, validator enforces, reducer persists, gates consume, graph projects. |
| **Bias** | Avoids solving the symptom with iteration count alone; the contract records search proof before findings. |
| **Sustainability** | Versioning gives future schema migrations a pattern and reduces ambiguity in historical data. |
| **Scope/Value** | Small text/template phase unlocks high-value downstream enforcement while avoiding premature runtime changes. |
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**Affected Systems**:

- `state_format.md` gets the reference schema.
- `prompt_pack_iteration.md.tmpl` asks agents to emit the v2 fields.
- Phase 003 spec docs record the Level 3 contract and handoff.

**Rollback**: Revert the docs and prompt subsection from this phase. No production runtime behavior changes are involved.

<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---
title: "Decision Record: Create-Skill Template and Validator Alignment"
description: "Accepted decisions for two-state template authoring, the stage1-only initializer, the pure root-router contract library with stable codes, command workflow classification, defaultResource preservation, and protected-byte boundaries."
trigger_phrases:
  - "create skill alignment decision record"
  - "root router validator decision"
  - "stage1-only initializer decision"
  - "stable router code decision"
importance_tier: "critical"
contextType: "decision"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/015-router-unification-program/020-root-router-document-standard/002-create-skill-template-and-validator-alignment"
    last_updated_at: "2026-08-16T07:40:46.607Z"
    last_updated_by: "markdown-agent"
    recent_action: "Ratified all five Phase 002 tooling decisions against fixture and gate evidence."
    next_safe_action: "Phase 003 consumes ADR-101..105 as implementation authority."
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "decision-record.md"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Decision Record: Create-Skill Template and Validator Alignment

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

---

> **Ratification record**: ADR-101 through ADR-105 were ratified as **Accepted** on 2026-08-16 against the fixture, parity, and byte-identity gates. Evidence: `checklist.md` CHK-010..CHK-014, CHK-100..CHK-103, and the re-verified suites `root-router-contract.test.cjs`, `create-journey-proof.test.cjs`, `parent-skill-check-root-router.test.cjs`, `test_skill_parent_router_parity.py` (9 passed), and `test_create_skill_contract.py` (23 passed).

<!-- ANCHOR:adr-001 -->
## ADR-001: Keep the Detailed Tooling Decisions as the Normative Decision Set

<!-- ANCHOR:adr-001-context -->
### Context

The detailed decisions were authored as ADR-101 through ADR-105. The canonical Level-3 template also requires one stable first-decision index.
<!-- /ANCHOR:adr-001-context -->

<!-- ANCHOR:adr-001-decision -->
### Decision

ADR-101 through ADR-105 remain the normative tooling decisions. ADR-001 is their stable entry point and does not replace or duplicate their contracts.
<!-- /ANCHOR:adr-001-decision -->

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Outcome |
|--------|---------|
| Renumber the ratified decisions | Rejected because it would break existing task and checklist references |
| Add one stable index | Chosen because it preserves the ratified decision identities |
<!-- /ANCHOR:adr-001-alternatives -->

<!-- ANCHOR:adr-001-consequences -->
### Consequences

Readers enter through ADR-001 and follow ADR-101 through ADR-105 for the two-state router, initializer, validator, fallback, and protected-byte contracts.
<!-- /ANCHOR:adr-001-consequences -->

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks

The decision set is accepted only while stage1-only generation, active validation, command parity, protected-byte identity, and default-resource preservation remain green.
<!-- /ANCHOR:adr-001-five-checks -->

<!-- ANCHOR:adr-001-impl -->
### Implementation Notes

The implementation and tests cite the detailed ADR numbers; no source behavior depends on this documentation index.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-101 -->
## ADR-101: Root `ROUTER.md` Is the Two-State Stage-Two Control Document

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-08-15 |
| **Deciders** | Program owner, sk-create-skill maintainer |

### Context

Every class-H hub needs one root control document that declares whether it owns stage-two leaf selection. Tooling must author, validate, and migrate that document without making it a typed leaf, advisor identity, generated file, or class discriminator.

### Decision

**We chose**: `router_state: active` or `stage1-only` is required root frontmatter in every parent template, scaffold, and schema reference. Active owns non-empty equal-key maps. Packet-owned resources resolve to typed manifest pairs; explicitly declared `SHARED_CONTROL_RESOURCES` must be normalized contained `shared/...` paths used by the map and resolved on disk, and never project as typed leaves. Stage1-only owns no stage-two or shared-control content. All templates point to root `ROUTER.md`; no authoring surface instructs `shared/references/smart-routing.md` creation.

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| Two explicit states in root `ROUTER.md` | Deterministic authoring and validation | Requires template churn | 10/10 |
| Keep the legacy template as a second path | Minimal churn | Perpetuates the split Phase 001 froze | 3/10 |
| Infer state from map contents | No frontmatter field | Ambiguous malformed cases | 4/10 |

**Why this one**: It converts the ratified Phase 001 schema into authoring behavior before any live migration.
<!-- /ANCHOR:adr-101 -->

---

<!-- ANCHOR:adr-102 -->
## ADR-102: `stage1-only` Is the Generator Default; `active` Requires Authored Maps

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-08-15 |
| **Deciders** | Program owner, sk-create-skill maintainer |

### Context

`init_skill.py --kind parent` must always produce a compliant hub. Synthesizing leaf intents would make a leafless hub appear routed.

### Decision

**We chose**: `--kind parent` always emits one root `stage1-only` `ROUTER.md` with empty `INTENT_SIGNALS`, `RESOURCE_MAP`, and stage-two default, plus a root `SKILL.md` pointer and four-part version. The parent command reclassifies the hub `active` only after a concrete authored leaf map exists; it never generates placeholder paths or fake intents.

### Alternatives Considered

| Option | Benefit | Rejection Reason |
|--------|---------|------------------|
| Emit `active` with placeholder maps | One flow | Fabricates routing policy and hides author intent |
| Emit no router | Simplest | Non-compliant scaffolds for every leafless hub |
| Always emit leafless `stage1-only` | Genuinely valid default | Chosen |

### Consequences

Every generated parent hub is valid from the first write. Promotion is an authored act with typed, resolved leaves.
<!-- /ANCHOR:adr-102 -->

---

<!-- ANCHOR:adr-103 -->
## ADR-103: Pure Root-Router Contract Library with Stable Negative Codes

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-08-15 |
| **Deciders** | Program owner, routing maintainer |

### Context

The doctor, package gate, and command workflows must agree on failures without importing frozen replay scoring or duplicating it.

### Decision

**We chose**: Add `scripts/lib/root-router-contract.cjs` parsing only `router_state` and the machine-map shape, returning violations with the frozen codes RRC-001..RRC-008, delegating path identity to `lib/leaf-resource-contract.cjs`, and importing no frozen replay or scorer code. `parent-skill-check.cjs` and the parent path of `validate_skill_package.py` consume it and print the library codes. Unknown failures use `RRC-UNKNOWN` and exit non-zero.

### Alternatives Considered

| Option | Benefit | Rejection Reason |
|--------|---------|------------------|
| Reuse replay scoring for validation | One evaluator | Couples contract checks to frozen evaluation bytes |
| Duplicate checks in every consumer | No new file | Code and prose drift across consumers |
| One pure library plus the existing leaf contract | Single code table, no policy coupling | Chosen |

### Consequences

Negative fixtures assert exact codes; no fixture can pass for the wrong reason; replay and scorer bytes stay untouched.
<!-- /ANCHOR:adr-103 -->

---

<!-- ANCHOR:adr-104 -->
## ADR-104: Preserve `defaultResource`; No Universal Repoint

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-08-15 |
| **Deciders** | Program owner, route-gold reviewer |

### Context

A tooling alignment is not a fallback-policy change. Phase 001 froze per-hub default dispositions; only three hubs will later repoint literal legacy paths.

### Decision

**We chose**: Phase 002 adds no `hub-router.json` or stage-two default change. `defaultResource` is never required to point to `ROUTER.md`. The three literal legacy repoints (cli-external-orchestration, sk-design, system-deep-loop) and the sk-code self-reference amendment belong to Phase 003.

### Alternatives Considered

| Option | Benefit | Rejection Reason |
|--------|---------|------------------|
| Repoint all defaults to `ROUTER.md` in tooling | Uniform paths | Changes zero-signal behavior before adoption |
| Preserve every default and enforce only shape | Policy-neutral | Chosen; matches the Phase 001 matrix |
| Move defaults into the validator | Centralized | Validators must not own policy values |

### Consequences

The handoff gate can assert zero default deltas, and Phase 003 can compare real fallback behavior against the frozen matrix.
<!-- /ANCHOR:adr-104 -->

---

<!-- ANCHOR:adr-105 -->
## ADR-105: Leave the Class Discriminator and Frozen Replay Bytes Untouched

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-08-15 |
| **Deciders** | Program owner, benchmark maintainer |

### Context

`skill-root-metadata-contract.cjs` decides skill-class identity, and the replay/scorer trio owns evaluation. Neither may absorb router-state parsing.

### Decision

**We chose**: Keep `skill-root-metadata-contract.cjs` byte-identical; `references/shared/skill-root-metadata-contract.md` changes as documentation only. Keep `router-replay.cjs` and the scorer files byte-identical; root-first compatibility is proven by running existing replay bytes against the new active fixture, never by editing them.

### Alternatives Considered

| Option | Benefit | Rejection Reason |
|--------|---------|------------------|
| Add router-state to the discriminator | One identity check | Recreates the class-discriminator coupling Phase 001 forbade |
| Extend replay scoring for root parsing | Reuse | Changes protected evaluation bytes |
| Separate pure validator plus byte-proof | Contract fidelity | Chosen |

### Consequences

Byte-identity gates become part of the handoff, and replay behavior remains a frozen compatibility baseline.
<!-- /ANCHOR:adr-105 -->

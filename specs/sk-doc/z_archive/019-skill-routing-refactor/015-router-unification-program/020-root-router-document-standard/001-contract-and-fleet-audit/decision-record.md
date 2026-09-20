---
title: "Decision Record: Contract and Fleet Audit"
description: "Accepted decisions for root-router states, source authority, per-hub defaults, the sk-code self-reference exception, legacy-path classification, and protected scorer hashes."
trigger_phrases:
  - "root router decision record"
  - "router state decision"
  - "default resource decision"
  - "sk-code router exception"
importance_tier: "critical"
contextType: "decision"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/015-router-unification-program/020-root-router-document-standard/001-contract-and-fleet-audit"
    last_updated_at: "2026-08-16T07:40:46.607Z"
    last_updated_by: "markdown-agent"
    recent_action: "Ratified all five Phase 001 architecture decisions against the executed baseline."
    next_safe_action: "Phase 002 consumes ADR-001..005 as implementation authority."
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "decision-record.md"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Decision Record: Contract and Fleet Audit

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

---

> **Ratification record**: ADR-001 through ADR-005 were ratified as **Accepted** on 2026-08-16 against the executed read-only baseline. Evidence: `checklist.md` CHK-010..CHK-013, CHK-100..CHK-103, and the seven-hub machine-hash reproduction in `../003-seven-hub-root-adoption/scratch/checkpoints/*/checkpoint-close.md`.

<!-- ANCHOR:adr-001 -->
## ADR-001: Use Exactly Two Root-Router States

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-08-15 |
| **Deciders** | Program owner, routing maintainer |

---

<!-- ANCHOR:adr-001-context -->
### Context

Class-H hubs need one root control document whether or not they own a second-stage leaf map. A missing state or an open-ended state vocabulary would force generators and validators to infer behavior from map contents.

### Constraints

- Every class-H hub has one root `ROUTER.md`.
- Current seven hubs all have real second-stage leaf maps.
- Future simple hubs may rely only on stage-one mode routing.
- The root document must not become a typed leaf or advisor identity.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Accept only `router_state: active` and `router_state: stage1-only`.

**How it works**: Active requires non-empty equal-key intent and resource maps. Packet-owned paths resolve to on-disk typed manifest pairs. Explicit `SHARED_CONTROL_RESOURCES` are the narrow exception: they must use normalized contained `shared/...` paths, occur in `RESOURCE_MAP`, and resolve on disk, but never project as typed leaves. Stage1-only requires empty intent, resource, shared-control, and stage-two default collections and delegates routing to `hub-router.json` plus `mode-registry.json`. Both states require a root file, exact root `SKILL.md` pointer, four-part version, and no legacy router file.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Two explicit states** | Deterministic generation and validation; supports leafless hubs | Requires a state field | 10/10 |
| Infer state from map contents | Fewer frontmatter fields | Ambiguous malformed cases; poor error codes | 4/10 |
| Require active maps for every hub | Simplest validator | Forces fake leaves into simple hubs | 2/10 |

**Why this one**: Two states express the only two supported behaviors without inventing fake leaf intents or allowing implicit policy.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Generator output has a valid leafless state.
- Validators can fail unknown, malformed, and contradictory state deterministically.

**What it costs**:
- Existing hubs need frontmatter and root pointers. Mitigation: migrate serially with old/new receipts.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| State and maps diverge | H | Stable validator failures for active-empty and stage1-only-nonempty |
| A root router is treated as a leaf | H | Typed-pair checks reject `ROUTER.md` as a leaf resource |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Generators and validators need an explicit state. |
| 2 | **Beyond Local Maxima?** | PASS | Inference and active-only alternatives were evaluated. |
| 3 | **Sufficient?** | PASS | Two states cover hubs with and without leaf maps. |
| 4 | **Fits Goal?** | PASS | The program standardizes class-H root routers. |
| 5 | **Open Horizons?** | PASS | Future simple hubs can use stage1-only without fake policy. |

**Checks Summary**: 5/5 PASS for the proposed decision.
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- Phase 002 adds schema enforcement and stage1-only scaffolding.
- Phase 003 marks all seven current hubs active.

**How to roll back**: Before any live adoption, revert only the later validator, template, and hub changes as one policy-aligned set. Phase 001 itself changes no live router.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Preserve the Two-Stage Source-of-Truth Hierarchy

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-08-15 |
| **Deciders** | Program owner, routing maintainer |

### Context

Stage-one mode selection and stage-two leaf selection answer different questions. Combining them would duplicate packet identity, scoring, or leaf maps and would change replay behavior.

### Decision

**We chose**: `mode-registry.json` owns mode identity, `hub-router.json` owns stage-one selection and hub fallback, and active root `ROUTER.md` owns stage-two leaf selection. `leaf-manifest.json` owns typed membership, root `SKILL.md` points to the stages, validators enforce the contract, compiled files remain derived, and system-skill-advisor continues indexing only root `SKILL.md` plus root `graph-metadata.json`.

### Alternatives Considered

| Option | Benefit | Rejection Reason |
|--------|---------|------------------|
| Inline leaf maps in `SKILL.md` | One visible file | Duplicates machine policy and violates the hub contract |
| Move leaf maps into `hub-router.json` | One machine file | Conflates stage-one mode selection with stage-two leaf selection |
| Parse `ROUTER.md` in the advisor | More signals | Creates a second advisor identity surface and expands scope |

### Consequences

Root support remains additive and replay keeps root-first lookup after stage one resolves. Generated artifacts cannot redefine authored policy.
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: Preserve Per-Hub Default Semantics

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-08-15 |
| **Deciders** | Program owner, route-gold reviewer |

### Context

A location migration does not authorize a fallback-policy change. Only three stage-one default arrays literally name the legacy router.

### Decision

**We chose**: Repoint the literal legacy path to `ROUTER.md` only for cli-external-orchestration, sk-design, and system-deep-loop. Preserve sk-prompt, sk-doc, and sk-code stage-one defaults. Leave mcp-tooling unchanged. Record stage-two `DEFAULT_RESOURCE` independently.

### Alternatives Considered

| Option | Benefit | Rejection Reason |
|--------|---------|------------------|
| Point every default to `ROUTER.md` | Uniform paths | Changes zero-signal behavior and treats a control document as a universal fallback |
| Preserve every literal legacy path | No immediate behavior change | Leaves live defaults pointing at deleted files |
| Repoint only literal legacy entries | Minimal semantic delta | Chosen; exact path migration only |

### Consequences

Default behavior remains hub-specific and route-gold can compare real fallback semantics rather than an imposed fleet-wide default.
<!-- /ANCHOR:adr-003 -->

---

<!-- ANCHOR:adr-004 -->
## ADR-004: Remove the sk-code Router Self-Reference

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-08-15 |
| **Deciders** | Program owner, sk-code maintainer |

### Context

sk-code's stage-two `DEFAULT_RESOURCE` includes `references/smart-routing.md`. After migration, replacing that path with root `ROUTER.md` would make the control document behave like a typed packet leaf, which the leaf-resource contract does not allow. The same router also contains eight hub-shared `RESOURCE_MAP` paths and three hub-shared default resources whose old strings were relative to the legacy file's `shared/` directory. A root document cannot preserve those relative strings without resolving them to the wrong location, and cross-mode control references have no single honest packet owner.

### Decision

**We chose**: Remove `references/smart-routing.md` from sk-code's stage-two always-loaded preamble. Normalize the remaining hub-shared defaults and eight hub-shared map resources to explicit contained `shared/...` paths. Declare the eight mapped paths in `SHARED_CONTROL_RESOURCES`; validate their existence and use while excluding them from typed-leaf projection. Preserve `hub-router.json` default `shared/README.md`, update only live playbook or route-gold expectations that measure the resource set, and never add `ROUTER.md` or a fabricated packet owner to `leaf-manifest.json`.

### Alternatives Considered

| Option | Benefit | Rejection Reason |
|--------|---------|------------------|
| Replace self-reference with `ROUTER.md` | Similar resource count | Violates control-plane and typed-leaf boundaries |
| Keep the deleted legacy path | Machine bytes stay equal | Produces an unresolved live resource |
| Remove one self-reference | Clean identity and minimal measured delta | Chosen |

### Consequences

sk-code is an intentional machine-block delta: one router self-reference is removed, ten legacy-file-relative shared paths are normalized to `shared/...`, and the eight mapped shared controls are declared explicitly. Its old/new resource-set comparison must show no lost control resource other than the self-reference and no added router leaf.
<!-- /ANCHOR:adr-004 -->

---

<!-- ANCHOR:adr-005 -->
## ADR-005: Classify Old Paths and Pin Machine Bytes

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-08-15 |
| **Deciders** | Program owner, benchmark maintainer |

### Context

Broad replacement would rewrite history, mutate generated evidence by hand, or alter frozen compatibility code. Hash comparisons are useful only when byte boundaries are fixed.

### Decision

**We chose**: Classify each old-path occurrence as live contract, generated/current evidence, or immutable history. Treat legacy lookup strings in frozen replay as protected live compatibility exceptions. Hash the inner UTF-8 bytes of the machine-readable Python fence, excluding fence lines and its closing-line separator. Pin the frozen trio to the exact SHA-256 values in `spec.md`.

### Alternatives Considered

| Option | Benefit | Rejection Reason |
|--------|---------|------------------|
| Global search-and-replace | Fast | Destroys historical accuracy and protected compatibility |
| Hash full documents | Easy | Link and prose rebases would hide machine-policy preservation |
| Hash parsed JSON-like objects | Semantic comparison | Normalization loses byte-preservation evidence |
| Hash exact machine-fence bytes | Detects policy-byte drift and permits prose rebasing | Chosen |

### Consequences

Historical files remain accurate, generated/current evidence uses owner tooling, six hubs require machine-byte equality, and sk-code requires one explicitly adjudicated delta. A frozen digest mismatch triggers LOGIC-SYNC rather than a pin update.
<!-- /ANCHOR:adr-005 -->

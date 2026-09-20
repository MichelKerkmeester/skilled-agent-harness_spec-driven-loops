---
title: "Decision Record: Skill Root Metadata JSON Unification"
description: "Architecture decisions for the two-class skill-root metadata contract: the registry+router discriminator, description.json as hub-only, the per-class split on leaf-aliases generation, command-metadata as a scoped overlay, and sk-git's remediation as a defective standalone root."
trigger_phrases:
  - "skill root metadata decisions"
  - "why is description.json hub only"
  - "why are standalone aliases generated"
  - "registry router discriminator rationale"
importance_tier: "important"
contextType: "decision"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/021-skill-metadata-json-unification"
    last_updated_at: "2026-07-28T04:11:05Z"
    last_updated_by: "claude-code"
    recent_action: "Recorded six ADRs"
    next_safe_action: "None; decisions Accepted"
    blockers: []
    key_files:
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "021-skill-metadata-json-unification-build"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Standalone alias rows are a derivable identity projection; hub alias rows are authored relocations"
---
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- SPECKIT_LEVEL: 3 -->

# Decision Record: Skill Root Metadata JSON Unification

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Classify skill roots into two consumer-derived classes

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-27 |
| **Deciders** | Operator, implementer |
| **Source** | `research/lineages/sol-high-fast/research.md` §4 |
<!-- /ANCHOR:adr-001 -->

<!-- ANCHOR:adr-001-context -->
### Context

At packet authoring, twelve skill roots carried twelve distinct metadata shapes. No document stated which files a given root should have, so a maintainer could not distinguish conformance from drift without comparing against a sibling and guessing which sibling was right.

### Constraints

The operator's directive was uniformity: either every skill carries every possible file, or the file type does not exist. Resolved at ask-time to uniformity **per documented class**, because several observed differences are load-bearing rather than accidental.
<!-- /ANCHOR:adr-001-context -->

<!-- ANCHOR:adr-001-decision -->
### Decision

Two classes. **H** (packet hub) requires `graph-metadata.json`, `description.json`, `mode-registry.json`, `hub-router.json`, and a generated `leaf-manifest.json`. **S** (standalone routed-resource skill) requires `graph-metadata.json`, `leaf-manifest.config.json`, and generated `leaf-manifest.json` plus `leaf-aliases.json`.
<!-- /ANCHOR:adr-001-decision -->

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Alternative | Why rejected |
|---|---|
| Every root carries all eight files | Four of the eight have no consumer for the other class. A file nothing reads is noise that still has to be maintained. |
| Collapse to one universal file set by merging registry into config | The two express different things: a registry declares N modes with per-mode routing metadata, a config declares one. Merging would force every standalone root to carry an N-mode structure with N=1. |
| Leave presence per-skill and document the status quo | Documents the mess rather than fixing it, and gives no gate anything to enforce. |
<!-- /ANCHOR:adr-001-alternatives -->

<!-- ANCHOR:adr-001-consequences -->
### Consequences

Positive: every difference is now explainable by a written rule, and a gate can enforce presence. Negative: adding a genuinely new shape later means adding a class, not just a file.
<!-- /ANCHOR:adr-001-consequences -->

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Twelve roots carried twelve shapes and no document said which was correct; one root was genuinely broken |
| 2 | **Beyond Local Maxima?** | PASS | Three alternatives evaluated above, including the operator's literal "all eight everywhere" reading |
| 3 | **Sufficient?** | PASS | Two classes cover all twelve roots with no residue; a third class was considered for `sk-git` and rejected on evidence |
| 4 | **Fits Goal?** | PASS | The operator's directive was uniformity with no undocumented variance; this delivers exactly that |
| 5 | **Open Horizons?** | PASS | Adding a class is a bounded edit to one library that every consumer already reads |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

<!-- ANCHOR:adr-001-impl -->
### Implementation

`scripts/lib/skill-root-metadata-contract.cjs`, `REQUIRED_BY_CLASS` / `FORBIDDEN_BY_CLASS`.

---

## ADR-002: The registry+router pair is the class discriminator

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-27 |
| **Deciders** | Implementer |
| **Source** | `research.md` §4 |

### Context

Classification needs one signal. Candidates were the registry alone, the presence of nested packets, or the registry and router together.

### Constraints

The signal must exist before any tooling has run, or a freshly scaffolded root cannot be classified and therefore cannot be checked.

### Decision

A root is H when it declares **both** `mode-registry.json` and `hub-router.json`, S when it declares **neither**, and is rejected as unclassifiable when it declares exactly one. Classification consults no other file, and explicitly no generated file.

### Alternatives Considered

| Alternative | Why rejected |
|---|---|
| Registry alone | This is what `validate_skill_package.py` did, and it let a root with a registry but no router pass as a hub with its routing half missing. |
| Presence of nested packet directories | A directory layout is not a declaration; it drifts silently and cannot express intent. |
| Treat XOR as a third class | It is not a shape anyone intends. Admitting it would mean specifying a contract for a half-written declaration. |

### Consequences

The router and registry must land together in one change. That is already true in practice — the router's signal keys must name registry modes — so the constraint documents an existing coupling rather than adding one.

### Implementation

`classifyPresence()`; the XOR case also now fails `validate_skill_package.py` explicitly.

---

## ADR-003: `description.json` is required for hubs and forbidden for standalone roots

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-27 |
| **Deciders** | Operator, implementer |
| **Source** | `research.md` §8 |

### Context

Five roots shipped `graph-metadata.json` with no `description.json`, which read as the fleet's most obvious defect and as a contradiction of the root framework doc's "the advisor pair lives together" wording.

### Constraints

Backfilling identity prose onto four roots would change advisor lexical evidence if anything read it.

### Decision

`description.json` is required for H and **forbidden** for S. The five roots are not backfilled.

### Alternatives Considered

| Alternative | Why rejected |
|---|---|
| Backfill `description.json` onto all five | Research found no production advisor read of a skill-root `description.json`; the advisor ingests `graph-metadata.json`. The backfill would add prose no consumer consults, and a weak generic description is worse than absence because it still has to be maintained. |
| Make it optional everywhere | Optional is exactly the undocumented-variance state the operator ruled out. |

### Consequences

The "five skills are missing description.json" framing was wrong: four are conforming standalone roots and only `sk-git` was genuinely defective. Forbidding rather than merely not-requiring means a future well-meaning backfill fails the gate instead of landing silently.

### Implementation

`FORBIDDEN_BY_CLASS.S` includes `description.json`.

---

## ADR-004: Alias generation splits on class

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-27 |
| **Deciders** | Implementer |
| **Source** | Implementation evidence; refines `research.md` §9 |

### Context

The research concluded flatly that `leaf-aliases.json` must remain authored for every class, reasoning that neither the registry nor the config can express a workflowMode/resourceId/diskPath triple. The measurements below are ship-time evidence; `system-code-graph` was removed after packet authoring, so its row is not current fleet membership.

Measuring the committed files showed that conclusion holds for hubs and not for standalone roots:

| Root | Class | Rows | Identity map? |
|---|---|---:|---|
| `system-skill-advisor` | S | 103 | yes, 103/103 |
| `system-spec-kit` | S | 48 | yes, 48/48 |
| `system-code-graph` | S | 53 | yes, 53/53 |
| `mcp-code-mode` | S | 7 | yes, 7/7 |
| `sk-doc` | H | 6 | **no** — rows relocate into `shared/` |

### Constraints

A generator must never destroy authored information. `sk-doc`'s six rows map, for example, `assets/changelog-template.md → shared/assets/changelog-template.md`; nothing in the corpus implies them.

### Decision

`leaf-aliases.json` is **generated for S** as an identity projection over the manifest's leaves, and **authored for H**. Row order follows the manifest's sorted order so the bytes are reproducible.

### Alternatives Considered

| Alternative | Why rejected |
|---|---|
| Keep aliases authored everywhere, per the research verdict | For a single-mode root the triple degenerates to identity, so the file carries no information the manifest lacks. A hand-maintained identity list rots the moment a leaf lands — which is precisely the drift this packet exists to end. |
| Generate aliases for every class | Would silently overwrite the six real `sk-doc` relocations and break resolution for those resources. |
| Delete the file for S and have consumers infer identity | The resolver deliberately refuses to infer ownership; consumers read authored rows. Deriving the file preserves the consumer contract while removing the maintenance burden. |

### Consequences

`sk-git` needs exactly one authored metadata file (`leaf-manifest.config.json`); everything else derives. Two committed S alias files (`system-spec-kit`, `mcp-code-mode`) were reordered into manifest order — verified set-identical (48→48, 7→7 rows), and every consumer reads these rows as a set, never positionally.

This is a deliberate, evidence-backed deviation from the research report. Recorded here rather than silently applied.

### Implementation

`GENERATED_BY_CLASS`, `isGenerated(file, class)`, `buildAliasBytes()`, `checkDerivedAliases()`. Covered by `testFixDoesNotTouchHubAliases` and `testHubAliasesStayAuthored`.

---

## ADR-005: `command-metadata.json` stays a scoped overlay

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-27 |
| **Deciders** | Operator, implementer |
| **Source** | `research.md` §10 |

### Context

`sk-design` is the only root with `command-metadata.json`, while `sk-doc`, `system-deep-loop`, and `system-spec-kit` also own multiple commands. This read as an ungeneralized pilot.

### Constraints

Its four consumer surfaces do not enumerate roots: the design validator and its contract test derive the enclosing `sk-design` root, the benchmark test names `sk-design` directly, and the advisor command-binding test loops a fixed hub allowlist.

### Decision

Keep it scoped to `sk-design`, declared explicitly in `OVERLAY_FILES`. A copy on any other root fails the gate as `UNDECLARED_OVERLAY`.

### Alternatives Considered

| Alternative | Why rejected |
|---|---|
| Generalize to every command-owning root | Would produce files no consumer can find. Command ownership is already declared in mode registries. Generalizing first requires a shared schema and a root-enumerating consumer. |
| Delete it from `sk-design` | It has four live consumers and a working validator. |

### Consequences

The scope is now enforced rather than incidental. Widening it is a deliberate edit to one list, paired with a consumer that can discover N roots.

---

## ADR-006: `sk-git` is a defective standalone root, not a sparse class

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-27 |
| **Deciders** | Implementer |
| **Source** | `research.md` §4 |

### Context

`sk-git` carried only `graph-metadata.json` — the sparsest root in the fleet, and the only one that could plausibly have argued for a third class.

### Constraints

Its `references/`, `assets/`, `feature-catalog/`, and `manual-testing-playbook/` trees are a routed corpus selected by an in-`SKILL.md` router, which is exactly the standalone behaviour.

### Decision

Classify as S and remediate: author `leaf-manifest.config.json`, then generate the manifest (65 leaves) and the alias projection.

### Alternatives Considered

| Alternative | Why rejected |
|---|---|
| Define a third sparse class for it | Would ratify the drift. `sk-git` exhibits standalone routing behaviour and was simply missing its files. |
| Leave it unclassified and exempt | An exemption nothing can revoke is how the original drift persisted. |

### Consequences

`sk-git` now conforms; the active fleet is 11/11 on the post-ship audit dated 2026-07-28. `system-code-graph` was removed after packet authoring, so the ship-time 53/53 measurement above remains historical evidence. `sk-git`'s 65 corpus docs are addressable through the same leaf contract as every other routed skill. Its `scripts/` and `benchmark/` trees stay outside the leaf roots and are correctly excluded.
<!-- /ANCHOR:adr-001-impl -->

---

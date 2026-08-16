---
title: "Decision Record: Seven-Hub Root Adoption"
description: "Accepted decisions for serial root-router adoption, byte preservation except bounded sk-prompt and sk-code routing repairs, fallback preservation, gated legacy deletion, owner-tool regeneration, live-residue classification, and rollback."
trigger_phrases:
  - "root router adoption decision"
  - "machine block preservation decision"
  - "legacy deletion gate decision"
  - "sk-code delta decision"
importance_tier: "critical"
contextType: "decision"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/015-router-unification-program/020-root-router-document-standard/003-seven-hub-root-adoption"
    last_updated_at: "2026-08-16T07:40:46.607Z"
    last_updated_by: "markdown-agent"
    recent_action: "Ratified all nine Phase 003 adoption decisions against the executed checkpoints."
    next_safe_action: "Phase 004 consumes the seven checkpoint receipts and adjudicated maps."
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "decision-record.md"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Decision Record: Seven-Hub Root Adoption

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

---

> **Ratification record**: ADR-001 through ADR-009 were ratified as **Accepted** on 2026-08-16 against the executed checkpoint receipts. Evidence: `scratch/checkpoints/*/checkpoint-close.md`, `checklist.md` CHK-020..CHK-023 and CHK-120..CHK-123, and the fleet-wide residue scan (zero live legacy files; seven active root routers).

<!-- ANCHOR:adr-001 -->
## ADR-001: Run Adoption as Seven Serial Checkpoints with mcp-tooling First and sk-code Last

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-08-15 |
| **Deciders** | Program owner, routing maintainer |

---

<!-- ANCHOR:adr-001-context -->
### Context

Seven hubs must reach the same target shape, but they differ in maturity: mcp-tooling already ships a root router, four hubs need a byte-equal move, sk-prompt needs one stale-leaf replacement, and sk-code needs the approved root-location/shared-control repair. A fleet-wide sweep would mix the pilot proof, standard migrations, and bounded repairs in one unaccountable change.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Run exactly seven serial checkpoints in the fixed order: CP1 mcp-tooling golden/idempotent verification, CP2 cli-external-orchestration, CP3 sk-design, CP4 sk-prompt, CP5 sk-doc, CP6 system-deep-loop, CP7 sk-code last.

**How it works**: No hub starts before its predecessor's checkpoint receipt set passes. CP1 must be idempotent (zero changed paths). CP2-CP6 prove the byte-equal move mechanics. CP7 applies the single adjudicated delta last so a lone deviation never contaminates a byte-equal hub.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Serial checkpoints, pilot first, delta last** | Attributes failures, proves mechanics before exceptions | Longest wall-clock path | 10/10 |
| Fleet-wide parallel move | Fast | Unattributable failures; deltas and byte-equal moves mix | 3/10 |
| Delta hub first | Exercises the exception early | A contract drift would contaminate the simplest evidence | 4/10 |
| One checkpoint per phase child | Fine-grained packets | Violates the approved one-child plan and adds spec overhead | 2/10 |

**Why this one**: Serial checkpoints make every old/new comparison and gate receipt attributable to exactly one hub and preserve the plan's single-child topology.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Each checkpoint can be rolled back and re-run in isolation.
- The golden pilot proves the target shape before any live migration.

**What it costs**:
- Total phase duration is the sum of seven checkpoints. Mitigation: CP1 is short and each checkpoint reuses one procedure.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| An early hub failure blocks later hubs | M | Per-hub receipts isolate the failure; checkpoints are independently rerunnable |
| Checkpoint order drift | H | One fixed enumerator and a closing gate per checkpoint |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | A single serial order is the only way to attribute per-hub deltas and gates. |
| 2 | **Beyond Local Maxima?** | PASS | Parallel and exception-first alternatives were evaluated and rejected. |
| 3 | **Sufficient?** | PASS | Seven checkpoints cover the pilot, four byte-equal moves, and the two bounded routing repairs. |
| 4 | **Fits Goal?** | PASS | Matches the approved plan's serial hub adoption requirement. |
| 5 | **Open Horizons?** | PASS | Each checkpoint stays independently rerunnable for future hub additions. |

**Checks Summary**: 5/5 PASS for the proposed decision.
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- Phase 003 executes CP1 through CP7 with per-hub receipts in `scratch/checkpoints/`.

**How to roll back**: Restore the affected hub as one unit from its pre-state capture before any later checkpoint starts.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Preserve Policy Bytes Except Explicitly Adjudicated Routing Repairs

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-08-15 |
| **Deciders** | Program owner, sk-code maintainer |

### Context

The move relocates the stage-two router, not its policy. Four legacy hubs can preserve their machine fences byte-for-byte. sk-code requires a root-location repair: remove its router self-reference, normalize ten legacy-file-relative hub-shared paths to explicit `shared/...` paths, and declare the eight mapped paths as non-leaf shared controls. sk-prompt also carries a pre-existing route to `design-generation-patterns.md`, deleted by commit `80dce88a7db`; the closest live generic owner is `sk-prompt-improve/references/patterns-evaluation.md`. Root `ROUTER.md` remains a control-plane companion, not a leaf or advisor identity.

### Decision

**We chose**: Require old/new machine-fence SHA-256 equality for cli-external-orchestration, sk-design, sk-doc, and system-deep-loop. For sk-prompt, replace only the deleted design-pattern leaf with `sk-prompt-improve/references/patterns-evaluation.md` and require route-gold/canary adjudication. For sk-code, require the exact self-reference removal, ten `shared/...` normalizations, eight-entry `SHARED_CONTROL_RESOURCES` declaration, and no `ROUTER.md` or fabricated leaf pair. mcp-tooling bytes stay unchanged.

### Alternatives Considered

| Option | Benefit | Rejection Reason |
|--------|---------|------------------|
| Reformat the block during the move | Cleaner file | Changes policy bytes and breaks hash evidence |
| Move with no hash comparison | Faster | Cannot prove byte preservation |
| Apply the sk-code delta to every hub | Uniform | Changes five hubs' policy without approval |
| Rebase prose links inside the machine block | Link consistency | Alters machine policy bytes; links live in the prose surface |

### Consequences

Machine policy remains verifiable per hub. Four byte-equal comparisons plus mcp-tooling idempotence are the preservation evidence; sk-prompt and sk-code have bounded, pre-recorded routing-specific deltas whose route-gold and canaries must pass before expectation changes. Advisor boundaries stay intact because no `ROUTER.md` leaf pair or fabricated packet owner is introduced.
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: Rebase Document-Relative Links and Provenance for the Root Location

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-08-15 |
| **Deciders** | Program owner, route-gold reviewer |

### Context

Legacy router files resolve links relative to `shared/references/`. At the root, the same relative targets change meaning, so every document-relative link and provenance note must be rebased or they will dangle or mislabel authorship.

### Decision

**We chose**: Rebase document-relative links and provenance from the legacy depth to the root location without touching map semantics. Every rebased target must resolve on disk before the checkpoint closes. Rebase only the prose/document surface; machine-map paths keep their contract-qualified semantics and are validated by the root-router validator.

### Alternatives Considered

| Option | Benefit | Rejection Reason |
|--------|---------|------------------|
| Leave links as-is | No prose churn | Produces dangling targets at root depth |
| Absolute repo-relative links | Unambiguous | Brittle across worktrees and moves |
| Rewrite machine-map paths during rebase | One pass | Changes policy identity and violates the byte contract |

### Consequences

Human navigation and provenance stay correct at the new depth. Map semantics remain frozen, so replay and benchmark behavior is unchanged.
<!-- /ANCHOR:adr-003 -->

---

<!-- ANCHOR:adr-004 -->
## ADR-004: Preserve Zero-Signal Defaults and Repoint Only Literal Legacy Entries

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-08-15 |
| **Deciders** | Program owner, route-gold reviewer |

### Context

A location migration does not authorize fallback-policy change. The Phase 001 matrix fixes exactly three literal legacy entries for repointing; the other four hubs preserve their stage-one defaults.

### Decision

**We chose**: Replace the literal legacy `defaultResource` path with `ROUTER.md` only in cli-external-orchestration, sk-design, and system-deep-loop. Preserve sk-prompt's `sk-prompt-improve/SKILL.md`, sk-doc's `shared/references/quick-reference.md`, and sk-code's `shared/README.md` byte-for-byte. mcp-tooling stays unchanged. Stage-two `DEFAULT_RESOURCE` behavior is recorded independently and never infers stage-one semantics.

### Alternatives Considered

| Option | Benefit | Rejection Reason |
|--------|---------|------------------|
| Point every default at `ROUTER.md` | Uniform paths | Changes zero-signal behavior fleet-wide |
| Preserve every literal legacy default | No edit | Leaves live defaults pointing at deleted files |
| Repoint only literal legacy entries | Minimal semantic delta | Chosen; exact path migration only |

### Consequences

Fallback behavior remains hub-specific. Route-gold can compare real semantics instead of an imposed uniform default.
<!-- /ANCHOR:adr-004 -->

---

<!-- ANCHOR:adr-005 -->
## ADR-005: Delete Each Legacy File Only After Its Hub's Gates Pass

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-08-15 |
| **Deciders** | Program owner, routing maintainer |

### Context

Replay still recognizes legacy lookup strings as compatibility fallbacks, but a live legacy router file is dead weight once the root passes. Deleting all six at once would remove the fallback before any replacement is proven.

### Decision

**We chose**: Delete the legacy file only after that hub's root passes the root-router validator, parent doctor, package gate, replay/benchmark route-gold, and canary. Deletion is followed immediately by a live-source rescan. No legacy file is ever deleted while its hub's gates are open.

### Alternatives Considered

| Option | Benefit | Rejection Reason |
|--------|---------|------------------|
| Delete each legacy file after its gates | Proven, serial cleanup | Chosen |
| Keep all legacy files | Zero deletion risk | Leaves live files contradicting the active-only fleet state |
| Fleet-wide deletion after all gates | One operation | Unattributable and contrary to the serial contract |

### Consequences

Each deletion is attributable to a proven hub. The zero-live-legacy fleet state becomes the phase's exit evidence.
<!-- /ANCHOR:adr-005 -->

---

<!-- ANCHOR:adr-006 -->
## ADR-006: Align Versions and Changelogs Additively

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-08-15 |
| **Deciders** | Program owner, sk-doc maintainer |

### Context

Each hub carries a document version and a changelog. Rewriting history would destroy the record of what each version claimed when authored; omitting the change would leave the fleet versionless.

### Decision

**We chose**: Add release/version alignment and exactly one new changelog entry per adopted hub. Historical changelog lines, archived packets, and dated benchmark reports remain untouched. The new entry records the root-router adoption, the moved machine block hash, and the default disposition.

### Alternatives Considered

| Option | Benefit | Rejection Reason |
|--------|---------|------------------|
| Additive entry per hub | Preserves history and records the change | Chosen |
| Edit the latest entry in place | One line | Rewrites the record of the prior release |
| No changelog change | Zero churn | Leaves the fleet change undocumented |

### Consequences

Every hub's changelog head reflects the adoption while older entries stay immutable. The residue scan's immutable-history class is preserved.
<!-- /ANCHOR:adr-006 -->

---

<!-- ANCHOR:adr-007 -->
## ADR-007: Regenerate Derived Leaf Metadata Only Through Owner Tooling

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-08-15 |
| **Deciders** | Program owner, benchmark maintainer |

### Context

Derived metadata such as `leaf-manifest.json` is generated evidence. Hand-editing it would make generated artifacts look like authored policy and would break freshness and parity guarantees.

### Decision

**We chose**: Regenerate derived leaf metadata only through each hub's owning tool. Capture the exact delta, adjudicate it against the expected change (path relocations, no semantic map change), and close the checkpoint only after adjudication. Hand-edits and ad-hoc regeneration are forbidden.

### Alternatives Considered

| Option | Benefit | Rejection Reason |
|--------|---------|------------------|
| Owner-tool regeneration with delta inspection | Traceable derived state | Chosen |
| Hand-edit derived files | Fast | Breaks owner-tool freshness and hides drift |
| Skip regeneration | No delta | Leaves manifests referencing moved paths |

### Consequences

Generated evidence remains derivable and auditable. Phase 004 can compare manifest freshness without reconciling hand edits.
<!-- /ANCHOR:adr-007 -->

---

<!-- ANCHOR:adr-008 -->
## ADR-008: Classify Residue as Live, Immutable History, or Protected Compatibility

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-08-15 |
| **Deciders** | Program owner, route-gold reviewer |

### Context

Legacy path strings appear in three different truth regimes: live sources that must be cleaned, changelogs and dated reports that must not be touched, and frozen replay code whose compatibility strings must never change.

### Decision

**We chose**: Run a live-vs-history residue scan that classifies every match as resolved live match, immutable history, or protected replay fallback. Only classified immutable-history and protected-compatibility rows may remain; zero live matches is the phase exit condition. Exclusions are path-explicit and class-based, never broad grep suppression.

### Alternatives Considered

| Option | Benefit | Rejection Reason |
|--------|---------|------------------|
| Classified live-vs-history scan | Precise, auditable | Chosen |
| Global grep with blanket exclusions | Fast | Hides live matches and risks editing history |
| No scan | No effort | Cannot prove the zero-live-legacy exit gate |

### Consequences

The residue ledger becomes the evidence that all six deletions are complete and nothing live still names the legacy path.
<!-- /ANCHOR:adr-008 -->

---

<!-- ANCHOR:adr-009 -->
## ADR-009: Roll Back Each Hub as One Policy-Consistent Unit

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-08-15 |
| **Deciders** | Program owner, routing maintainer |

### Context

A router move touches several coupled surfaces: root `ROUTER.md`, `SKILL.md` and live docs, `hub-router.json` default, derived metadata, changelog head, and the legacy file. Restoring prose without its matching policy and manifest state recreates the dual-source and inconsistency failures the phase exists to eliminate.

### Decision

**We chose**: Roll back each hub as one unit using Git restoration of the worktree plus the retained compiled-route-sync rollback closure. Pre-state captures in `scratch/checkpoints/<hub>/before/` define the exact target. Never restore router prose alone, and never touch unrelated pre-existing work. The rollback closure is finalized only by Phase 004 after all fleet gates pass.

### Alternatives Considered

| Option | Benefit | Rejection Reason |
|--------|---------|------------------|
| Whole-hub Git plus closure rollback | Consistent state | Chosen |
| Restore only the router file | Fast | Leaves docs, defaults, and manifests inconsistent |
| Global revert to pre-phase HEAD | Simple | Destroys unrelated approved changes |

### Consequences

Every rollback reproduces the hub's exact pre-migration state, so the checkpoint can be re-run cleanly. Prose, policy, and derived state never diverge.
<!-- /ANCHOR:adr-009 -->

---
title: "Decision Record: Phase 016 sk-code content coherence and reference integrity"
description: "Decision records for phase 016 sk-code content coherence: ADR-001 metadata refresh (Accepted, realized via af1170c663) and ADR-002 hooks relocation (Superseded — 0 broken hooks refs, no live defect)."
trigger_phrases:
  - "sk-code metadata canon decision"
  - "sk-code hooks relocation decision"
  - "phase 016 decision record"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/124-sk-code-parent/016-sk-code-content-coherence"
    last_updated_at: "2026-07-05T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Phase closed by verification; sk-code STRICT 0/0"
    next_safe_action: "124 rollup"
---
# Decision Record: Phase 016 sk-code content coherence and reference integrity

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Refresh sk-code metadata as the canon two-axis reference

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-05 |
| **Deciders** | Operator, phase 016 implementer |
| **Outcome** | Realized via `af1170c663` — the metadata was already two-axis coherent (3d-canon/5f pass); the only stale remnant, 3 merger placeholder fields, was removed. |

---

<!-- ANCHOR:adr-001-context -->
### Context

The master plan says sk-code `description.json` and `graph-metadata.json` are the canon reference that other hubs copy. The audit identifies hub-root metadata as P1 stale because the prose does not fully reflect the current two-axis parent-hub model after the phase 013 surface-packet move.

### Constraints

- The metadata must describe the current model with mode-registry, hub-router, workflowMode, packetKind, three surface packets, and surfaceBundle language.
- Phase 017 may still settle shared canon vocabulary, so implementation must avoid locking in contradictory metadata wording.
- Realized: the only metadata edit was the `af1170c663` placeholder-field removal; the broader two-axis prose was already canonical.

<!-- /ANCHOR:adr-001-context -->
---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Refresh sk-code hub metadata as the canonical two-axis reference during phase 016 implementation.

**How it works**: The implementation will update `description.json` and `graph-metadata.json` so their advisor-facing and skill-graph prose name the workflow/surface axes, registry/router split, workflowMode, packetKind, the three surface packets, and surfaceBundle. The metadata refresh will run after any needed phase 017 vocabulary decision or use already-canonical terms that phase 017 will not contradict.

<!-- /ANCHOR:adr-001-decision -->
---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Refresh metadata in phase 016** | Keeps the headline sk-code coherence phase foundational and copyable | Must coordinate with phase 017 vocabulary | 9/10 |
| Defer metadata refresh to phase 019 | Avoids coordination with phase 017 | Leaves other hubs copying stale canon during intermediate work | 4/10 |
| Leave metadata unchanged because structural checks pass | No implementation effort | Preserves audit P1 and weakens sk-code as the reference example | 2/10 |

**Why this one**: The master plan explicitly labels the metadata refresh foundational, and phase 016 owns sk-code content coherence.

<!-- /ANCHOR:adr-001-alternatives -->
---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- sk-code becomes a current copyable reference for sk-design and deep-loop metadata work.
- Hub metadata aligns with the current filesystem and router model instead of stale flat-era wording.

**What it costs**:
- The implementation must coordinate with phase 017 canon vocabulary. Mitigation: verify phase 017 decision status before editing metadata.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Metadata vocabulary changes after refresh | Medium | Sequence refresh after phase 017 or use stable current canon terms |
| JSON prose becomes over-specific | Medium | Keep prose focused on durable two-axis concepts and current packet names |

<!-- /ANCHOR:adr-001-consequences -->
---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Master plan calls the metadata refresh foundational and audit flags hub-root P1 drift. |
| 2 | **Beyond Local Maxima?** | PASS | Alternatives considered deferral and no-op paths. |
| 3 | **Sufficient?** | PASS | Refreshing only hub metadata avoids unrelated canon edits. |
| 4 | **Fits Goal?** | PASS | The phase goal is sk-code content coherence and reference integrity. |
| 5 | **Open Horizons?** | PASS | Current canon metadata supports later sk-design, deep-loop, and phase 019 rollup work. |

**Checks Summary**: 5/5 PASS

<!-- /ANCHOR:adr-001-five-checks -->
---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- `.opencode/skills/sk-code/description.json` will describe the two-axis parent hub with current workflow and surface packet language.
- `.opencode/skills/sk-code/graph-metadata.json` will refresh causal summary and identity prose around the same model.

**How to roll back**: Revert the metadata file changes from the phase implementation diff, then re-run parent-skill-check strict to ensure the prior structural state is restored.

<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Relocate spec-kit hooks reference to system-spec-kit

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Superseded |
| **Date** | 2026-07-05 |
| **Deciders** | Operator, phase 016 implementer |
| **Outcome** | Superseded — the relocation was an audit-era ownership preference. sk-code carries 0 broken hooks references, so there was no live defect to fix; the move was not performed. |

---

<!-- ANCHOR:adr-002-context -->
### Context

The audit identifies exactly one substantive spec-kit document misfiled in the sk-code OpenCode surface packet: `.opencode/skills/sk-code/opencode/references/shared/hooks.md`. Its content describes Spec Kit MCP hook entrypoints, so system-spec-kit is the correct owner.

### Constraints

- The relocation must not become a broad content migration; only the single audited document is in scope.
- All live references must be repointed as part of the same implementation change.
- Outcome: the file was not moved; the relocation was superseded (0 broken hooks refs, no live defect).

<!-- /ANCHOR:adr-002-context -->
---

<!-- ANCHOR:adr-002-decision -->
### Decision

**We chose**: Move the misfiled hooks reference from the sk-code OpenCode surface packet into system-spec-kit references during phase 016 implementation.

**How it works**: The implementation will create the target system-spec-kit reference path, move the hooks document, remove or avoid leaving a live duplicate at the old sk-code path, and update every live reference to the new owner. Verification will include reference sweeps across sk-code and system-spec-kit.

<!-- /ANCHOR:adr-002-decision -->
---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Relocate to system-spec-kit and repoint** | Corrects ownership and closes the audit finding | Requires paired reference sweep | 9/10 |
| Keep the old file and add a pointer | Low movement risk | Keeps misfiled content live and duplicates ownership | 4/10 |
| Copy to system-spec-kit without removing old path | Avoids immediate breakage | Creates duplicate references and weakens source-of-truth ownership | 3/10 |

**Why this one**: The audit found one clear owner mismatch, and moving it to system-spec-kit fixes the source of truth instead of preserving drift.

<!-- /ANCHOR:adr-002-alternatives -->
---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**What improves**:
- Spec-kit hook documentation lives with the system that owns it.
- The OpenCode surface packet stops carrying a non-OpenCode spec-kit reference.

**What it costs**:
- Readers of the old path must be repointed. Mitigation: run a targeted reference sweep and link check.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Dangling links to old hooks path | Medium | Pair relocation with grep-based reference repoints and link checker |
| Duplicate hook docs diverge | Medium | Do not keep a live duplicate unless explicitly required as a temporary compatibility pointer |

<!-- /ANCHOR:adr-002-consequences -->
---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Audit flags one speckit-relocation finding and names the misfiled file. |
| 2 | **Beyond Local Maxima?** | PASS | Alternatives considered pointer-only and copy-with-duplicate paths. |
| 3 | **Sufficient?** | PASS | Moving exactly one document matches the audit's narrow finding. |
| 4 | **Fits Goal?** | PASS | Reference integrity includes source-of-truth ownership. |
| 5 | **Open Horizons?** | PASS | Correct ownership makes future spec-kit hook updates easier to find and maintain. |

**Checks Summary**: 5/5 PASS

<!-- /ANCHOR:adr-002-five-checks -->
---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**What changes**:
- `.opencode/skills/sk-code/opencode/references/shared/hooks.md` will stop being the live owner for Spec Kit MCP hook documentation.
- `.opencode/skills/system-spec-kit/references/` will receive the document in a suitable references location.
- Live links and plain-text references will point at the system-spec-kit owner.

**How to roll back**: Move the document back to the old sk-code path, restore old references from the phase diff, and rerun the sk-code and system-spec-kit link checks.

<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->

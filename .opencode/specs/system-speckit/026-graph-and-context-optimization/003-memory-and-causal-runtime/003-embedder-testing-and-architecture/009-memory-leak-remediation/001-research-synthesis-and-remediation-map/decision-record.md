---
title: "Decision Record: Research Synthesis and Remediation Map"
description: "Architecture decisions for consolidating original memory-leak research into phase 001 and deleting historical source packet folders."
trigger_phrases:
  - "phase 001 decision record"
  - "memory leak research consolidation adr"
  - "delete old research packets decision"
importance_tier: "important"
contextType: "decision"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/001-research-synthesis-and-remediation-map"
    last_updated_at: "2026-05-22T10:55:00Z"
    last_updated_by: "opencode"
    recent_action: "Recorded consolidation and deletion decisions for source research packets."
    next_safe_action: "Validate then delete old 020 and 024 packet folders."
    blockers: []
    key_files:
      - "decision-record.md"
      - "research/source-research/"
    session_dedup:
      fingerprint: "sha256:0101010101010101010101010101010101010101010101010101010101010101"
      session_id: "009-memory-leak-remediation-001"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Old source packet folders may be deleted after full archive recovery and validation."
---
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
# Decision Record: Research Synthesis and Remediation Map

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Phase-Local Research Archive

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-05-22 |
| **Deciders** | Operator, OpenCode |

---

### Context
<!-- ANCHOR:adr-001-context -->

Packets 020 and 024 produced the original memory-leak research, but remediation now lives under `009-memory-leak-remediation/001-research-synthesis-and-remediation-map`. The operator requested all original iterations, deltas, and related research files be recovered into the phase 001 `research/` directory before deleting the old packet folders.

### Constraints

- Preserve original packet slugs so provenance remains readable.
- Preserve iteration narratives, JSONL deltas, prompts/logs, state, dashboards, configs, findings registries, and packet root docs.
- Avoid duplicating research into multiple canonical locations.
- Keep later phases citing one local source archive.
<!-- /ANCHOR:adr-001-context -->

---

### Decision
<!-- ANCHOR:adr-001-decision -->

**Summary**: Store both original research archives under `001-research-synthesis-and-remediation-map/research/source-research/`.

**Details**: Each source packet keeps its original slug below `research/source-research/`. The original deep-research `research/` tree is stored as `research/source-research/<packet-slug>/research/`; packet-level docs are stored as `research/source-research/<packet-slug>/packet-docs/`.
<!-- /ANCHOR:adr-001-decision -->

---

### Alternatives Considered
<!-- ANCHOR:adr-001-alternatives -->

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| Phase-local archive | One canonical remediation evidence location; supports deleting old packets | Requires path updates | 9/10 |
| Keep old packets and link | Lowest churn | Violates operator deletion request; evidence split across three locations | 4/10 |
| Duplicate into phase 001 and keep old packets | Easy rollback | Creates two canonical-looking sources and stale future references | 5/10 |

**Why Chosen**: The phase-local archive satisfies the deletion request while keeping provenance and future phase citations simple.
<!-- /ANCHOR:adr-001-alternatives -->

---

### Consequences
<!-- ANCHOR:adr-001-consequences -->

**Positive**:
- Later phases cite one archive under the remediation arc.
- Old packet folders can be deleted without losing original research artifacts.
- Phase 001 becomes the Level 3 evidence-control packet for the arc.

**Negative**:
- Historical packet paths disappear from the filesystem.
- Some internal research artifact citations must be path-adjusted to the new archive location.

**Risks**:
| Risk | Impact | Mitigation |
|------|--------|------------|
| Missing artifact during move | H | Validate iteration/delta counts and preserve packet docs before deletion. |
| Stale path after deletion | M | Replace references with phase-local archive paths and validate parent packets. |
<!-- /ANCHOR:adr-001-consequences -->

---

### Five Checks
<!-- ANCHOR:adr-001-five-checks -->

| Check | Result |
|-------|--------|
| Simplicity | One phase-local archive is simpler than split evidence paths. |
| Performance | No runtime performance effect; docs-only reorganization. |
| Maintainability | Future phases cite one archive path. |
| Scope | Limited to spec docs and research artifacts. |
| Safety | Deletion is blocked until archive recovery and validation complete. |
<!-- /ANCHOR:adr-001-five-checks -->

---

### Implementation
<!-- ANCHOR:adr-001-impl -->

**Affected Systems**:
- Phase 001 spec docs and research archive.
- Parent arc metadata.
- Source stack child lists for deleted packets.

**Rollback**: Recreate the deleted old packet folders from `research/source-research/<packet-slug>/packet-docs/` and copy the corresponding `research/` archive back if historical path restoration is required.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Delete Old Source Packet Folders After Recovery

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-05-22 |
| **Deciders** | Operator, OpenCode |

---

### Context

The old packet folders are now historical containers. Keeping them after recovering the originals into phase 001 would leave stale or duplicate evidence surfaces.

### Constraints

- Do not delete before source archives and packet docs are present under phase 001.
- Update phase-parent child metadata so deleted folders are no longer active children.
- Preserve the old packet decision records, checklists, summaries, and resource map where present.

---

### Decision

**Summary**: Delete the old `020-cli-process-memory-leak-deep-research` and `024-cli-deep-research-memory-leak-audit` folders after validation confirms recovery.

**Details**: Parent stack metadata removes the deleted child IDs, and active-child pointers move back to existing siblings. The research archive remains under phase 001.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| Delete after recovery | Matches operator request; removes stale packets | Requires metadata cleanup | 9/10 |
| Archive with renamed old folders | Keeps old paths nearby | Still leaves extra packet directories outside the canonical arc | 5/10 |
| Leave pointers only | Easy navigation | Violates deletion request | 2/10 |

**Why Chosen**: Recovery plus deletion gives one canonical archive and avoids drift.

---

### Consequences

**Positive**:
- Reduces duplicate packet surfaces.
- Forces future remediation work through the `009` arc.

**Negative**:
- Existing manual bookmarks to the old folders will break.

**Risks**:
| Risk | Impact | Mitigation |
|------|--------|------------|
| Parent graph points to deleted child | M | Remove child IDs and validate affected parent folders after deletion. |

---

### Implementation

**Affected Systems**:
- `002-spec-memory-stack/graph-metadata.json`
- `002-spec-memory-stack/spec.md`
- `004-code-index-stack/graph-metadata.json`
- `009-memory-leak-remediation/001-research-synthesis-and-remediation-map/`

**Rollback**: Restore old packet folders from phase 001 archive and re-add their child IDs if a downstream tool requires historical packet paths.
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: Harness-First Runtime Remediation

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-05-22 |
| **Deciders** | Operator, OpenCode |

---

### Context

The recovered research distinguishes lifecycle correctness findings from unproven resident-memory growth. Runtime cleanup fixes need process ownership and telemetry evidence before they can safely terminate processes or claim memory improvement.

### Constraints

- No runtime cleanup path should kill unknown-owner or current-session processes.
- Adapter and sidecar memory severity remains benchmark-gated.
- CocoIndex remove-project cancel safety remains the first code-index runtime fix after harness readiness.

---

### Decision

**Summary**: Keep phase 002 as the next active phase and require telemetry/process verification before runtime remediation.

**Details**: Phase 001 owns synthesis and archive recovery only. Phase 002 must provide process/RSS/swap/sidecar verification gates used by phases 003-010.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| Harness first | Prevents unsafe cleanup and false memory claims | Delays direct fixes | 9/10 |
| Start with process sweep | Fast visible cleanup | High risk of killing expected daemons | 3/10 |
| Start with adapter memory work | Targets RSS concern | Research says growth is unproven | 4/10 |

**Why Chosen**: The source research consistently says correctness and lifecycle ownership outrank resident-memory optimization until measurements prove growth.

---

### Consequences

**Positive**:
- Later cleanup work has a measurable before/after gate.
- Destructive operations remain dry-run and exact-owner gated.

**Negative**:
- No immediate runtime memory relief is claimed by phase 001.

**Risks**:
| Risk | Impact | Mitigation |
|------|--------|------------|
| Harness scope grows too broad | M | Limit phase 002 to process, RSS, swap, sidecar, daemon, and dry-run fixtures named in the map. |

---

### Implementation

**Affected Systems**:
- Phase 002 harness plan.
- Later runtime phases 003-010.

**Rollback**: If phase 002 cannot establish reliable telemetry, later phases must remain docs-only or inventory-only until a smaller safe harness is accepted.
<!-- /ANCHOR:adr-003 -->

---
title: "Decision Record: Manual Testing Playbook Refresh"
description: "Decision record for the choices behind the manual testing playbook refresh: additive EX scenarios over restructuring, topic-affinity folder placement, and the correct front-proxy error-code framing (-32001 retryable-recycle vs -32002 fail-closed)."
trigger_phrases:
  - "manual testing playbook refresh decisions"
  - "additive EX scenarios vs restructure"
  - "frontproxy 32001 retryable vs 32002 failclosed framing"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/014-docs-and-stress-test-refresh/001-manual-testing-playbook-update"
    last_updated_at: "2026-06-02T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored EX-037..EX-042 playbook scenarios and wired the master index"
    next_safe_action: "None binding; six EX scenarios shipped and wired into the master index"
    blockers: []
    key_files:
      - "manual_testing_playbook/manual_testing_playbook.md"
      - "manual_testing_playbook/05--lifecycle/"
      - "manual_testing_playbook/04--maintenance/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "manual-testing-playbook-update-packet-setup"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Decision Record: Manual Testing Playbook Refresh

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Additive EX scenarios over restructuring the playbook

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-06-02 |
| **Deciders** | Operator, orchestrator |

---

<!-- ANCHOR:adr-001-context -->
### Context

The manual testing playbook stops at `EX-036` and predates the 013 memory-index-scan roadmap. Its `EX`/`PHASE`/`M` scenario IDs and `NN--category/` folder structure are load-bearing: the master index, the feature-catalog cross-reference index, and the automated-test cross-reference all key on them. We need coverage for six new shipped behaviors without disturbing that structure.

### Constraints

- Existing scenario IDs must not change; many tables reference them by ID.
- The split-document feature-file pattern must be preserved (master index = directory, feature file = execution contract).
- Every behavioral claim must be true against shipped code.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Add new `EX-037`..`EX-042` scenarios in the existing feature-file format, each linked from `## 7. EXISTING FEATURES`, and renumber or rewrite nothing.

**How it works**: Each new scenario gets one feature file under the topic-appropriate `NN--category/` folder and one master-index entry mirroring the validated `EX-014`/`EX-015` shape. The new IDs start above the existing maximum.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Additive EX scenarios (chosen)** | Preserves every existing ID and cross-reference; minimal blast radius | Two checkpoint scenarios share the `05--lifecycle` folder | 9/10 |
| New top-level "013 roadmap" section | Groups the new work together | Fragments checkpoint coverage away from the existing `05--lifecycle` block; new section type to maintain | 4/10 |
| Renumber to interleave by topic | Tidier ordering | Breaks every table that references existing EX IDs | 1/10 |

**Why this one**: Additivity keeps all existing references valid while still surfacing the new behaviors from the master index.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Operators can exercise checkpoint-v2, enrichment v30, index_scan refinements, the front-proxy, and sk-git worktrees from the playbook.
- No existing scenario, ID, or cross-reference changes.

**What it costs**:
- The `05--lifecycle` folder now holds two extra checkpoint scenarios. Mitigation: numbered filenames keep them ordered after the existing checkpoint block.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A claim drifts from shipped code | H | Read the source anchor before writing; cite the file path |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Six shipped behaviors have no human-run coverage. |
| 2 | **Beyond Local Maxima?** | PASS | New-section and renumber options considered and rejected. |
| 3 | **Sufficient?** | PASS | Additive EX files plus index entries deliver full coverage. |
| 4 | **Fits Goal?** | PASS | Refreshes the playbook to the shipped runtime. |
| 5 | **Open Horizons?** | PASS | The same pattern extends to future roadmap behaviors. |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- Six new feature files under `05--lifecycle/`, `04--maintenance/`, `14--pipeline-architecture/`, `16--tooling-and-scripts/`.
- Six `### EX-###` entries in `manual_testing_playbook.md` `## 7`.

**How to roll back**: Revert any feature file and its single index entry; nothing else is affected.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

## ADR-002: Topic-affinity folder placement for the new scenarios

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-06-02 |
| **Deciders** | Operator, orchestrator |

### Context

The playbook groups feature files into topical `NN--category/` folders. Each new scenario must land in the folder whose theme it matches so operators find it where they expect.

### Constraints

- Checkpoint scenarios already live in `05--lifecycle/`.
- Maintenance/index scenarios already live in `04--maintenance/`.
- Pipeline/runtime infra fits `14--pipeline-architecture/`; tooling/scripts fit `16--tooling-and-scripts/`.

### Decision

**We chose**: Place checkpoint-v2 round-trip and `.needs-rebuild` self-heal in `05--lifecycle/`; enrichment-v30 and index_scan in `04--maintenance/`; front-proxy in `14--pipeline-architecture/`; sk-git in `16--tooling-and-scripts/`.

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Topic-affinity placement (chosen)** | Scenarios sit with their kin; operators find them by theme | Six files spread across four folders | 9/10 |
| One new folder for all six | Co-located | Breaks topical grouping; orphans checkpoint scenarios from the existing checkpoint block | 3/10 |

**Why this one**: Topical grouping is the playbook's existing organizing principle; following it keeps discovery consistent.

### Consequences

**What improves**: Discovery matches the established mental model.

**What it costs**: The six new files are spread across four folders. Mitigation: each is linked from the single master-index block.

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Files must live somewhere; placement affects discovery. |
| 2 | **Beyond Local Maxima?** | PASS | Single-folder option rejected. |
| 3 | **Sufficient?** | PASS | Four folders cover all six themes. |
| 4 | **Fits Goal?** | PASS | Matches the playbook's topical structure. |
| 5 | **Open Horizons?** | PASS | New themes get new folders as needed. |

**Checks Summary**: 5/5 PASS

### Implementation

**What changes**: File placement as listed in spec.md Files to Change.

**How to roll back**: Move or delete an individual file; no shared state.

---

## ADR-003: Document `-32001` as live retryable-recycle, not removed

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-06-02 |
| **Deciders** | Operator, orchestrator |

### Context

The MCP front-proxy uses two JSON-RPC error codes with very different semantics. A careless refresh could state that `-32001` was removed, which is wrong and would mislead operators debugging a daemon recycle.

### Constraints

- `-32001` is the live `RETRYABLE_RECYCLE_ERROR` in `.opencode/bin/lib/launcher-session-proxy.cjs` (frozen object, retryable, surfaced when the backend recycles mid-call).
- `-32002` is the `PROTOCOL_MISMATCH_ERROR` (non-retryable; the reattach loop transitions to terminal `CLOSED`).
- Only the index vector-drain outage path stopped surfacing its own `-32001` class; the launcher's `-32001` is unchanged.

### Decision

**We chose**: The front-proxy scenario documents `-32001` as the live retryable-recycle code (transparent reconnect) and `-32002` as the terminal fail-closed protocol-mismatch code, citing `launcher-session-proxy.cjs`.

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Precise live-code framing (chosen)** | Accurate; matches shipped behavior | Requires reading the proxy source | 10/10 |
| State `-32001` was removed | Shorter | False; both codes are live with distinct semantics | 0/10 |

**Why this one**: Accuracy is mandatory; the source proves both codes are live.

### Consequences

**What improves**: Operators correctly distinguish a transparent recycle from a fail-closed protocol drift.

**What it costs**: Nothing; the framing is one extra sentence per code.

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Misstating the code would mislead debugging. |
| 2 | **Beyond Local Maxima?** | PASS | The "removed" framing was explicitly rejected. |
| 3 | **Sufficient?** | PASS | Two anchored sentences capture both semantics. |
| 4 | **Fits Goal?** | PASS | Accurate front-proxy coverage. |
| 5 | **Open Horizons?** | PASS | Future error codes follow the same anchored pattern. |

**Checks Summary**: 5/5 PASS

### Implementation

**What changes**: `14--pipeline-architecture/front-proxy-reconnect-and-backend-only.md` states both codes with their semantics, citing `launcher-session-proxy.cjs` lines 18-26 and 617-620.

**How to roll back**: Revert the feature file; no shared state.

---

<!--
Level 3 Decision Record: three ADRs, one per pressure-tested decision.
Human voice: active, direct, specific. HVR rules: .opencode/skills/sk-doc/references/hvr_rules.md
-->

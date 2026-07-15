---
title: "Decision Record: Feature Catalog Update for Checkpoint-v2, Front-Proxy, Schema History, and Error Codes"
description: "Decision record for the four choices behind the catalog update: expand-in-place for checkpoint v2, one new file per new capability, a single unified error-code reference, and documenting -32001 as still-live."
trigger_phrases:
  - "feature catalog update decisions"
  - "expand in place vs new file catalog"
  - "unified error code reference decision"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/003-memory-and-causal-runtime/014-docs-and-stress-test-refresh/002-feature-catalog-update"
    last_updated_at: "2026-06-02T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored and registered six feature-catalog deltas; packet validated"
    next_safe_action: "None binding; sibling 003-readme-cluster-update can link these files"
    blockers: []
    key_files:
      - "feature_catalog/feature_catalog.md"
      - "feature_catalog/lifecycle/checkpoint-creation-checkpointcreate.md"
      - "feature_catalog/pipeline-architecture/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "feature-catalog-update-packet-setup"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Decision Record: Feature Catalog Update for Checkpoint-v2, Front-Proxy, Schema History, and Error Codes

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Expand existing checkpoint files over forking v2-only files

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-06-02 |
| **Deciders** | Operator, orchestrator |

---

<!-- ANCHOR:adr-001-context -->
### Context

Checkpoint v2 is the same capability as v1 (`checkpoint_create` / `checkpoint_restore`) with an added selection branch: unscoped full-DB requests route to the `VACUUM INTO` file path, everything else stays on the v1 JSON BLOB. The catalog already has one file per tool (`038` create, `040` restore). The choice was whether to add the v2 behavior into those files or to fork new v2-only files.

### Constraints

- Operators discover a tool by its single catalog entry; fragmenting one tool across two files weakens discoverability.
- Both v1 and v2 must be represented so neither is misstated.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Expand `038` and `040` in place with the v2 path while preserving the v1 description.

**How it works**: Each file keeps its Overview / How It Works / Source Files structure and adds the v2 `VACUUM INTO` create path, schema v29 columns (`snapshot_format`/`snapshot_path`), `active_vec` shard-attach, the two-phase restore journal, and the `.needs-rebuild` sentinel as additional behavior under the same entry.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Expand in place (chosen)** | One discoverable entry per tool; v1 and v2 side by side | Files grow | 9/10 |
| Fork v2-only files | Smaller per-file diffs | Fragments one tool across two entries; weakens discoverability | 3/10 |

**Why this one**: A tool's catalog entry should be the single place an operator reads to understand its behavior; the v2 path is an extension of the same tool, not a new one.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- The checkpoint entries describe the full shipped behavior in one place.

**What it costs**:
- The two files grow modestly. Mitigation: the v2 content is scoped to the create/restore behavior only.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| v1 description diluted by v2 detail | L | Keep the v1 path clearly labeled and the v2 path as an additional section |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The shipped v2 path is undocumented. |
| 2 | **Beyond Local Maxima?** | PASS | Forking v2-only files considered and rejected. |
| 3 | **Sufficient?** | PASS | Expanding the two files covers create and restore. |
| 4 | **Fits Goal?** | PASS | Makes the v2 path discoverable from the canonical inventory. |
| 5 | **Open Horizons?** | PASS | Future formats extend the same entries. |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- `lifecycle/checkpoint-creation-checkpointcreate.md` and `checkpoint-restore-checkpointrestore.md` gain the v2 path.
- `feature_catalog.md` section 6 Lifecycle blocks are synced.

**How to roll back**: Revert the two file edits; the prior v1-only content returns with no runtime effect.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

## ADR-002: One new file per new capability

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-06-02 |
| **Deciders** | Operator, orchestrator |

### Context

The front-proxy, schema-version-history, and post-insert enrichment marker are capabilities with no existing catalog home. The choice was whether to graft them onto adjacent files or give each its own numbered file.

### Constraints

- The catalog convention is one capability per numbered file under `NN--category/`.
- Each file is registered in `feature_catalog.md` with a Description/How-It-Works/Source-Files block.

### Decision

**We chose**: Give each new capability its own numbered file in the next free slot of its category, then register it in the index.

**How it works**: The front-proxy lands in `pipeline-architecture/189`, the schema history and error-code reference in `bug-fixes-and-data-integrity/069` and `070`, the enrichment marker in `memory-quality-and-indexing/162`, and the sk-git convention in `tooling-and-scripts/241`.

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **One file per capability (chosen)** | Matches catalog convention; each capability independently discoverable | More files to register | 9/10 |
| Graft onto adjacent files | Fewer files | Buries distinct capabilities under unrelated entries | 3/10 |

**Why this one**: The catalog is organized one capability per file; new capabilities follow the same convention so discovery stays predictable.

### Consequences

**What improves**:
- Each capability is independently discoverable and registered.

**What it costs**:
- More index entries to maintain. Mitigation: registration is part of the same phase.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| New file unregistered | M | REQ-007 requires index registration for every new file |

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | These capabilities have no catalog home. |
| 2 | **Beyond Local Maxima?** | PASS | Grafting considered and rejected. |
| 3 | **Sufficient?** | PASS | One file each covers the capability. |
| 4 | **Fits Goal?** | PASS | Discoverable from the canonical inventory. |
| 5 | **Open Horizons?** | PASS | New capabilities follow the same path. |

**Checks Summary**: 5/5 PASS

### Implementation

**What changes**:
- New files `189`, `069`, `070`, `162`, `241`; index entries in `feature_catalog.md`.

**How to roll back**: Delete the new files and their index entries.

---

## ADR-003: A single unified error-code reference over per-code files

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-06-02 |
| **Deciders** | Operator, orchestrator |

### Context

`E429`, `-32001`, and `-32002` are mentioned in scattered places (the index-scan rate-limit, the launcher recycle path, the front-proxy protocol fail-closed). An operator debugging a failure has no single page that explains which codes are retryable.

### Constraints

- The codes span different subsystems (scan handler vs launcher proxy).
- The retry semantics must be stated precisely: `-32001` is still live and retryable; `-32002` is non-retryable.

### Decision

**We chose**: One unified error-code reference file (`bug-fixes-and-data-integrity/070`) that lists `E429`, `-32001`, and `-32002` with their retry semantics and source anchors.

**How it works**: The file unifies the scattered mentions into one table with code, meaning, retry semantics, and source file, so an operator reads one page.

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Unified reference (chosen)** | One page to disambiguate retry semantics; reduces scatter | Spans subsystems in one file | 9/10 |
| Per-code files | Strict one-capability-per-file purity | Three tiny files; no single disambiguation page | 4/10 |

**Why this one**: The operator question ("which of these is retryable?") is answered best by one page, not three.

### Consequences

**What improves**:
- Retry semantics are disambiguated in one place; the still-live `-32001` is not mistaken for removed.

**What it costs**:
- One file spans two subsystems. Mitigation: each row cites its own source anchor.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Stating `-32001` was removed (false) | H | The file documents `-32001` as the still-live launcher retryable recycle error; only the index vector-drain outage path stopped surfacing its own `-32001` class |

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The codes are scattered with no disambiguation page. |
| 2 | **Beyond Local Maxima?** | PASS | Per-code files considered and rejected. |
| 3 | **Sufficient?** | PASS | One table covers all three codes. |
| 4 | **Fits Goal?** | PASS | Answers the operator's retry-semantics question directly. |
| 5 | **Open Horizons?** | PASS | New codes append to the same table. |

**Checks Summary**: 5/5 PASS

### Implementation

**What changes**:
- New `bug-fixes-and-data-integrity/error-code-reference.md`; registered in the index.

**How to roll back**: Delete the file and its index entry.

---

## ADR-004: Document `-32001` as still-live and preserve the 36-tool count

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-06-02 |
| **Deciders** | Operator, orchestrator |

### Context

Two accuracy traps could turn this catalog update into a failure: claiming `-32001` was removed, and bumping the live mk-spec-memory tool count from 36 to 43. Both are wrong. `-32001` is still the launcher's `RETRYABLE_RECYCLE_ERROR`; only the index vector-drain outage path stopped surfacing its own `-32001` class. The live mk-spec-memory server registers exactly 36 tools; the 43 figure is the cross-server layer count in `layer-definitions.ts`.

### Constraints

- Wrong claims = failure for this packet.
- The fix is adding new behaviors, not changing the tool count.

### Decision

**We chose**: Document `-32001` precisely as still-live and retryable, and leave the README "36-tool" mk-spec-memory count unchanged; the catalog adds behaviors only.

**How it works**: The error-code file states the retry semantics of each code and notes that only the outage path stopped surfacing `-32001`. No tool-count number is changed anywhere in the catalog.

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Document precisely, preserve count (chosen)** | Accurate; avoids the two known traps | Requires care to phrase the outage-path nuance | 10/10 |
| Loosely state "-32001 removed" / bump to 43 | Shorter prose | Factually wrong; fails the packet | 0/10 |

**Why this one**: Accuracy is the gating requirement; both alternatives violate verified source anchors.

### Consequences

**What improves**:
- The catalog stays accurate against the runtime; operators are not misled about retry behavior or tool surface.

**What it costs**:
- Nothing material; one nuance sentence in the error-code file.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A later edit re-introduces the false claim | M | The invariant is restated in spec, plan, tasks, and checklist |

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The traps would fail the packet. |
| 2 | **Beyond Local Maxima?** | PASS | The loose-claim alternative is explicitly rejected. |
| 3 | **Sufficient?** | PASS | Precise phrasing plus a preserved count covers both traps. |
| 4 | **Fits Goal?** | PASS | Keeps the catalog accurate. |
| 5 | **Open Horizons?** | PASS | The accuracy discipline carries to future deltas. |

**Checks Summary**: 5/5 PASS

### Implementation

**What changes**:
- `error-code-reference.md` phrases `-32001` precisely; no tool-count change anywhere.

**How to roll back**: N/A — this is an accuracy constraint, not a reversible behavior.

---

<!--
Level 3 Decision Record: four ADRs, one per pressure-tested authoring decision.
Human voice: active, direct, specific. HVR rules: .opencode/skills/sk-doc/references/hvr_rules.md
-->

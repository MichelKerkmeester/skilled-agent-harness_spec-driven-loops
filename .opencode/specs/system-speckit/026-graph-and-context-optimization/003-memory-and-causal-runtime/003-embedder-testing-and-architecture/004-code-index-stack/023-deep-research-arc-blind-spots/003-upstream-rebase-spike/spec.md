---
title: "Feature Specification: 023F Upstream cocoindex-code Rebase Spike"
description: "Research and scoped implementation spike comparing the local cocoindex-code fork against upstream v0.2.33, closing upstream drift findings without a full rebase."
trigger_phrases:
  - "023F"
  - "upstream cocoindex-code"
  - "rebase spike"
  - "indexing_params"
  - "query_params"
importance_tier: "high"
contextType: "spec"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/004-code-index-stack/023-deep-research-arc-blind-spots/003-upstream-rebase-spike"
    last_updated_at: "2026-05-19T20:22:26Z"
    last_updated_by: "codex"
    recent_action: "Documented upstream drift spike"
    next_safe_action: "Commit intended 023F files once git metadata is writable"
    blockers: []
    key_files:
      - ".opencode/skills/mcp-coco-index/mcp_server/pyproject.toml"
      - ".opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/settings.py"
      - ".opencode/skills/mcp-coco-index/mcp_server/tests/test_settings_patterns.py"
    session_dedup:
      fingerprint: "sha256:292dfccdf6023af8a0396709a51671282ef798458b305bb6e16c21f069a9f37a"
      session_id: "023-deep-research-arc-blind-spots/003-upstream-rebase-spike"
      parent_session_id: null
    completion_pct: 95
    open_questions:
      - "Whether Phase B should import upstream embedder params before any custom prompt-policy work."
    answered_questions:
      - "Upstream v0.2.33 is the direct cocoindex-code target."
      - "Main SDK path python/cocoindex/code does not exist at HEAD."
---
# Feature Specification: 023F Upstream cocoindex-code Rebase Spike

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Review |
| **Created** | 2026-05-19 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The local `cocoindex-code` soft fork reports `0.2.3+spec-kit-fork.0.2.0` while upstream `cocoindex-code` has reached `v0.2.33`. The drift includes upstream embedder parameter APIs, a deliberate dimensions-knob removal, Svelte/Vue language coverage, daemon/client refactors, and dependency movement from prerelease CocoIndex SDK builds to stable `1.0.x`.

### Purpose
Close the upstream-drift findings with evidence, apply only cheap compatible wins, and hand 023A1/023A2/023A3 a phased rebase plan that avoids hardening the wrong abstraction.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Enumerate upstream `cocoindex-code` releases since `v0.2.3`.
- Compare local `cocoindex_code/` files against upstream HEAD.
- Classify deltas as `PRESERVE_LOCAL`, `MERGE_UPSTREAM`, `CONFLICT_RESOLVE`, or `OBSOLETE_LOCAL`.
- Apply scoped wins only when they are mechanical and verifiable.
- Write cross-packet impact for 023A1, 023A2, 023A3, and 023B.

### Out of Scope
- Full module rebase - this would touch daemon/client/index/query surfaces and local retrieval stack internals.
- Importing upstream `indexing_params/query_params` in this packet - it overlaps the upcoming 023A1 prompt-policy surface.
- CocoIndex SDK stable-version migration - this needs an isolated Phase A compatibility run.
- Other packets' implementation surfaces - 023E, 023C, and 023A* stay untouched.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/mcp-coco-index/mcp_server/pyproject.toml` | Modify | Pin `sentence-transformers==5.4.1` in the local extra. |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/settings.py` | Modify | Add upstream Svelte/Vue include patterns. |
| `.opencode/skills/mcp-coco-index/mcp_server/tests/test_settings_patterns.py` | Create | Regression coverage for Svelte/Vue defaults. |
| `.opencode/specs/.../023-deep-research-arc-blind-spots/003-upstream-rebase-spike/research/*.md` | Create | Upstream sweep, delta classification, rebase plan, dimensions impact, cross-packet handoff. |
| `.opencode/specs/.../023-deep-research-arc-blind-spots/003-upstream-rebase-spike/*.md` | Modify/Create | Level 2 packet docs and verification evidence. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Upstream release sweep | `research/upstream-sweep.md` lists every actual `cocoindex-code` release after `v0.2.3`, with date and relevant notes. |
| REQ-002 | Local/upstream delta classification | `research/delta-classification.md` classifies local files with upstream analogs and records local-only/upstream-only surfaces. |
| REQ-003 | Rebase decision plan | `research/rebase-plan.md` defines Phase A/B/C with surfaces, tests, risks, and rollback. |
| REQ-004 | Cross-packet handoff | `research/cross-packet-impact.md` maps impacts to 023A1, 023A2, 023A3, and 023B. |
| REQ-005 | Verification | Full local pytest, ruff, and strict spec validation run before completion claim. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Cheap upstream language win | Svelte/Vue include patterns are imported when safe and tested. |
| REQ-007 | MED-002-C closure | `sentence-transformers` is explicitly pinned in `pyproject.toml`. |
| REQ-008 | Dependency-bump decision | CocoIndex SDK bump is either verified and shipped or explicitly deferred with evidence. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Findings 002-C, 017-A, 017-B, 017-C, 017-D, 020-A, and 020-D have explicit closure notes.
- **SC-002**: No local full-rebase work is performed in 023F.
- **SC-003**: New local code changes are covered by targeted tests and full-suite verification.
- **SC-004**: Future packets can follow upstream `indexing_params/query_params` instead of inventing a parallel prompt-policy layer.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `cocoindex[litellm]` stable SDK | Local fork still pins `1.0.0a33`; upstream wants `>=1.0.6,<1.1.0`. | Defer SDK bump to Phase A compatibility packet unless full pytest passes after controlled install. |
| Risk | Prompt-policy duplication | Local design could duplicate upstream `indexing_params/query_params`. | Route 023A1 to upstream API import first. |
| Risk | Naive dimensions knob | Per-side dimensions would create incompatible index/query vectors. | Document `dimensions` as a rejected per-side key and keep any dimension change model-wide. |
| Risk | Local retrieval wins lost in rebase | Hybrid FTS/RRF, path-class boosts, Jina rerank, mirror dedup, and diagnostics are local-only. | Preserve these in Phase C unless upstream ships equivalent behavior. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Do not increase query/index runtime in 023F beyond the Svelte/Vue file-pattern expansion.
- **NFR-P02**: Do not add dependency resolution churn beyond the explicit `sentence-transformers` pin.

### Security
- **NFR-S01**: No secrets or credentials are written to spec docs or code.
- **NFR-S02**: Network evidence is limited to public GitHub/PyPI metadata.

### Reliability
- **NFR-R01**: Existing mcp-coco-index tests remain green after scoped wins.
- **NFR-R02**: Rollback requires only reverting three local mcp-coco-index files plus packet docs.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty upstream release gap: actual public releases jump from `v0.2.11` to `v0.2.22`; docs must not invent missing tags.
- Upstream analog missing: classify local-only and upstream-only surfaces separately.
- Stable SDK unavailable or incompatible: document as Phase A deferral, not a partial bump.

### Error Scenarios
- GitHub API path missing: `python/cocoindex/code` returns 404; fall back to the separate `cocoindex-code` repo.
- Sequential-thinking MCP cancellation: record manual planning checkpoint and proceed single-agent.
- Dirty worktree unrelated files: keep commit scope explicit.

### State Transitions
- Research to implementation: only cheap changes with tests may cross into implementation.
- 023F to 023A1: import upstream embedder params before adding custom policy.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 14/25 | Narrow code edits, broad research table. |
| Risk | 16/25 | Dependency/API drift affects future packets. |
| Research | 18/20 | Requires upstream release/API/test comparison. |
| **Total** | **48/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- Should Phase A attempt the CocoIndex SDK `>=1.0.6,<1.1.0` bump before 023A1 starts?
- Should Phase B vendor upstream `embedder_params.py` mostly intact or adapt its model into local `registered_embedders.py` first?
<!-- /ANCHOR:questions -->

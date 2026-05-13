---
title: "Decision Record - Complete CocoIndex MCP Fork"
description: "ADR for making complete upstream v0.2.33 cocoindex-code the local fork baseline while keeping transitive cocoindex engine vendoring out of Phase 001 unless explicitly expanded."
trigger_phrases:
  - "cocoindex complete fork adr"
  - "027 phase 001 decision"
importance_tier: "important"
contextType: "decision"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/013-cocoindex-complete-fork"
    last_updated_at: "2026-05-10T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Recorded fork strategy ADR"
    next_safe_action: "Confirm engine boundary and implement import manifest"
    blockers: []
    key_files: ["decision-record.md"]
    completion_pct: 0
---
# Decision Record: Complete CocoIndex MCP Fork

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Fork the Complete cocoindex-code MCP Wrapper at v0.2.33

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-05-10 |
| **Deciders** | User, Codex |

---

<!-- ANCHOR:adr-001-context -->
### Context

The current skill fork is stale and partial. It owns a flat subset of upstream 0.2.3 source plus spec-kit search patches, but upstream has advanced to v0.2.33 and now includes package layout, runtime helpers, Docker files, a skill, custom chunkers, embedder params, and a broader test suite. Later CocoIndex phases should not build on the old partial fork.

### Constraints

- The user asked for the entire MCP to be in the repo and under local control.
- The `cocoindex-code` MCP wrapper still depends on the separate `cocoindex` engine package.
- Existing spec-kit telemetry fields are already consumed by local docs and callers.
- Install and doctor scripts must continue to work from the skill path.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: make upstream `cocoindex-code` v0.2.33 the complete local MCP-wrapper fork baseline, then port spec-kit patches as an explicit local overlay.

**How it works**: `external/cocoindex-code-main` supplies the source baseline. The implementation imports the complete selected upstream surface into the skill fork root, updates scripts to install from local source, ports current patch behavior, and records all local changes in `NOTICE` and `CHANGELOG.md`. The transitive `cocoindex` engine is pinned/audited, not vendored in this phase unless the user expands scope.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Complete wrapper fork at v0.2.33** | Maximum local control of MCP wrapper; adopts upstream tests/docs/runtime helpers; clean future baseline | Requires careful patch port and script updates | 9/10 |
| Keep partial fork and backport selectively | Smallest immediate diff | Keeps drift and misses upstream test/runtime surfaces | 4/10 |
| Use PyPI upstream and monkey-patch locally | Fast install path | Opposite of total control; fragile import hooks | 2/10 |
| Vendor `cocoindex` engine too | Strongest total-control interpretation | Much larger engine fork and dependency blast radius | 5/10 for this phase |

**Why this one**: the complete wrapper fork directly satisfies the user's MCP-control goal while keeping the engine fork question visible instead of silently expanding scope.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Later CocoIndex phases target the current upstream wrapper API and local tests.
- Local scripts and docs can stop treating the fork as a tiny patch queue.
- Runtime helpers such as `_daemon_paths.py` become locally available for sandbox-safe daemon paths.

**What it costs**:
- Patch-port work is non-trivial. Mitigation: port each patch behind a named test.
- The fork carries more upstream files. Mitigation: maintain an import manifest and changelog.
- The `cocoindex` engine remains external. Mitigation: pin/audit now and create a follow-on only if required.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Search telemetry regression | H | Contract tests for every extended result field |
| Packaging breakage | H | Layout ADR plus install smoke |
| Scope creep into engine fork | M | Explicit out-of-scope boundary and user confirmation |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Current fork is 0.2.3-based while upstream is v0.2.33 |
| 2 | **Beyond Local Maxima?** | PASS | Compared partial fork, PyPI monkey-patch, complete wrapper fork, and engine vendoring |
| 3 | **Sufficient?** | PASS | Wrapper fork satisfies MCP ownership without unrelated engine vendoring |
| 4 | **Fits Goal?** | PASS | User explicitly asked for full MCP in repo and total control |
| 5 | **Open Horizons?** | PASS | Enables later intent/rerank/context phases on a current local baseline |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- `.opencode/skills/mcp-coco-index/mcp_server/` becomes the complete local fork root or points to one by explicit manifest.
- Current spec-kit patches are reapplied and tested on v0.2.33.
- Scripts and docs are updated for complete-fork ownership.

**How to roll back**: restore the previous `mcp_server` package tree and scripts from git, reinstall the editable package, and run old fork smoke checks. If index schema changed during the attempt, document whether reindex is needed before asking the user to reset indexes.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

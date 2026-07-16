---
title: "Spec: CocoIndex install hygiene pipx repair [template:level_1/spec.md]"
description: "Open repair packet split from completed diagnosis 005-cocoindex-install-hygiene; applies the pipx editable repair once operator-side pipx config allows writes."
trigger_phrases:
  - "cocoindex pipx repair"
  - "pipx editable cocoindex"
  - "cocoindex install hygiene repair"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/005-cross-cutting-quality/007-cocoindex-install-hygiene-pipx-repair"
    last_updated_at: "2026-05-21T10:16:26Z"
    last_updated_by: "codex"
    recent_action: "Scaffolded planned packet from deep-research cleanup dispatch"
    next_safe_action: "Repair pipx editable install after operator-side config is available"
    blockers: []
    completion_pct: 0
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Spec: CocoIndex install hygiene pipx repair

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P0 |
| **Status** | Planned |
| **Created** | 2026-05-21 |
| **Branch** | `main` |
| **Parent Arc** | `005-cross-cutting-quality` |
| **Predecessor** | `005-cross-cutting-quality/005-cocoindex-install-hygiene/` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The predecessor diagnosis confirmed that the pipx-installed `ccc` executable is stale/non-editable and missing newer modules, while the local venv points at the editable source. Repair was not applied because sandbox permissions blocked pipx log rotation and direct pip entry-point writes.

### Purpose

Split the open repair into its own planned packet so the completed diagnosis can stay complete while operator-side pipx config is fixed separately.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Run the editable pipx repair after operator-side pipx write access is available.
- Verify pipx `direct_url.json` reports editable source.
- Verify `ccc` imports modules missing in the stale pipx copy.
- Apply any harness or install-guide changes only after executable stack alignment is proven.

### Out of Scope

- Re-diagnosing the already documented stale pipx state unless repair evidence contradicts it.
- Changing the local MCP venv, which the predecessor confirmed already points at editable source.
- Bypassing operator-side filesystem permissions from this sandbox.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/mcp-coco-index/mcp_server/INSTALL_GUIDE.md` | Modify after repair | Document stale pipx troubleshooting only after real repair succeeds |
| `.opencode/skills/mcp-coco-index/mcp_server/benchmarks/` | Modify after repair | Harness hardening deferred by predecessor until pipx aligns |
| `/Users/michelkerkmeester/.local/pipx/venvs/cocoindex-code/` | Operator-side repair | Target pipx venv from predecessor diagnosis; outside repo/sandbox |
| `/Users/michelkerkmeester/.local/bin/ccc` | Verify | Executable should load editable repaired package |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Operator-side pipx blocker cleared before repair | pipx can create/rotate logs and update the `cocoindex-code` venv entry point without sandbox permission errors |
| REQ-002 | pipx install is editable | pipx `direct_url.json` contains `"editable": true` for the repo mcp_server path |
| REQ-003 | `ccc` loads current source modules | `importlib.util.find_spec` finds `cocoindex_code.reranker`, `fts_index`, `fusion`, and `registered_embedders` from the pipx executable environment |
| REQ-004 | Harness/docs changes gated on repair evidence | No install guide or benchmark claims imply success before `ccc` import/version checks pass |
| REQ-005 | Clean install/refresh state verified | Pipx install/refresh produces the clean state described in predecessor success criteria |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `~/.local/bin/ccc --version` runs from repaired editable pipx install.
- **SC-002**: pipx `direct_url.json` proves editable source linkage.
- **SC-003**: Missing CocoIndex modules import successfully from the pipx executable environment.
- **SC-004**: Harness and install guide updates reflect the proven repair path.

### Acceptance Scenarios

- **Given** operator-side pipx log and venv writes are permitted, **When** `pipx install --force --editable <mcp_server>` runs, **Then** pipx records an editable direct URL to the repo source
- **Given** the repaired pipx executable is on PATH, **When** module import checks run through that environment, **Then** the modules missing in the stale copy resolve successfully
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Blocker | pipx config/log paths remain outside writable sandbox roots | Repair cannot run in this agent session | Operator runs repair unsandboxed or adjusts pipx paths before implementation |
| Risk | Partial pipx repair updates metadata but not entry point | `ccc` still loads stale code | Require both direct_url and import checks before claiming success |
| Dependency | Predecessor diagnosis commands | Repair criteria come from prior evidence | Reuse implementation-summary checks verbatim where possible |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- What exact operator-side pipx config change will unblock logs and venv writes? This remains outside the repo and is intentionally a blocker.
<!-- /ANCHOR:questions -->

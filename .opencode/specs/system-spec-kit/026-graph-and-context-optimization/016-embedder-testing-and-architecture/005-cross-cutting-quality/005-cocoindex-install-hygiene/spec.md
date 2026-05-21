---
title: "016/005/005: CocoIndex install hygiene"
description: "Documents the pipx versus local editable install drift that made ccc from PATH load stale CocoIndex code, plus the intended editable-install fix and the current sandbox blocker."
trigger_phrases:
  - "016/005/005 cocoindex install hygiene"
  - "cocoindex pipx stale install"
  - "ccc editable install drift"
  - "pipx direct_url editable"
  - "hybrid rerank bench harness drift"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/005-cross-cutting-quality/005-cocoindex-install-hygiene"
    last_updated_at: "2026-05-18T18:47:20Z"
    last_updated_by: "codex"
    recent_action: "Verified pipx/local ccc drift and captured sandbox blocker for editable pipx repair"
    next_safe_action: "Retry pipx repair outside sandbox"
    blockers:
      - "pipx and direct pip repair both fail under workspace-write sandbox when modifying /Users/michelkerkmeester/.local/pipx"
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000005005"
      session_id: "016-005-005-cocoindex-install-hygiene"
      parent_session_id: null
    completion_pct: 35
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# 016/005/005: CocoIndex install hygiene

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|---|---|
| Level | 1 |
| Priority | P0 |
| Status | Complete (diagnosis only) |
| Created | 2026-05-18 |
| Branch | main |
| Parent | `../spec.md` (005-cross-cutting-quality) |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

`ccc` from a normal shell resolves to `/Users/michelkerkmeester/.local/bin/ccc`, which points into the pipx venv at `/Users/michelkerkmeester/.local/pipx/venvs/cocoindex-code/`. That pipx install is a non-editable copy of the local source and is missing recently shipped CocoIndex modules such as `reranker.py`, `fts_index.py`, `fusion.py`, and `registered_embedders.py`.

The production MCP path uses `.opencode/skills/mcp-coco-index/mcp_server/.venv/bin/ccc`, which is correctly editable-installed from the live local source. The bake-off harness used PATH `ccc`, so prior hybrid plus rerank benchmark runs may have measured the stale pipx stack instead of the production-truthful local venv stack.

### Purpose

Make every shell invocation of `ccc` load the same local source as the production MCP server, then pin the benchmark harness to the canonical local venv binary so future bake-offs cannot silently drift.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Verify the pipx versus local editable install diagnosis.
- Repair pipx so `direct_url.json` shows `{"editable": true}` and imports resolve to the local source tree.
- Harden the extended bake-off harness to prefer the local venv `ccc`.
- Document the stale pipx failure mode in `INSTALL_GUIDE.md`.
- Capture the blocker if the pipx repair cannot complete.

### Out of Scope

- Do not interrupt the running benchmark process.
- Do not modify `.opencode/skills/mcp-coco-index/mcp_server/.venv/`.
- Do not modify benchmark result folders or reports.
- Do not commit from this Codex dispatch.

### Files to Change

| File Path | Change Type | Description |
|---|---|---|
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/005-cross-cutting-quality/005-cocoindex-install-hygiene/` | Create | Blocker packet and verification record |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/004-code-index-stack/004-extended-bake-off/evidence/run-extended-bake-off-with-hybrid-rerank.sh` | Deferred | Should be patched only after pipx editable repair verifies cleanly |
| `.opencode/skills/mcp-coco-index/INSTALL_GUIDE.md` | Deferred | Should get stale pipx troubleshooting once repair verifies cleanly |
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|---|---|---|
| REQ-001 | Confirm `ccc` on PATH resolves to pipx | `which ccc` prints `/Users/michelkerkmeester/.local/bin/ccc` |
| REQ-002 | Confirm pipx install is stale and non-editable | pipx `direct_url.json` has `dir_info: {}` and import lookup cannot find `cocoindex_code.reranker` |
| REQ-003 | Confirm production local venv is editable | local venv `direct_url.json` has `{"editable": true}` |
| REQ-004 | Repair pipx editable install | `cocoindex_code.reranker` imports from the local source path and pipx `direct_url.json` has `{"editable": true}` |
| REQ-005 | If repair is diagnosis-only complete, stop scoped implementation | Leave harness and INSTALL_GUIDE unchanged; document the exact blocker in `implementation-summary.md` |

### P1 - Required after blocker clears

| ID | Requirement | Acceptance Criteria |
|---|---|---|
| REQ-006 | Harden benchmark harness binary resolution | Harness uses `CCC` and replaces PATH `ccc` calls with `"$CCC"` |
| REQ-007 | Document stale pipx troubleshooting | `INSTALL_GUIDE.md` explains symptom, cause, fix, and `direct_url.json` verification |
| REQ-008 | Validate the packet | `validate.sh <this-packet> --strict` exits 0 |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001:** `~/.local/bin/ccc` and the local venv `ccc` both load `cocoindex_code.reranker` from `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/reranker.py`.
- **SC-002:** pipx `direct_url.json` records an editable local install.
- **SC-003:** The extended bake-off harness prints the `ccc` binary it uses and does not depend on PATH for `reset`, `index`, or `search`.
- **SC-004:** The install guide gives a direct repair and verification path for stale pipx installs.
- **SC-005:** Until SC-001 and SC-002 pass, no harness or install guide changes are shipped.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|---|---|---|---|
| Dependency | Write access to `/Users/michelkerkmeester/.local/pipx` | Required to update pipx venv metadata and entry points | Run repair from an unsandboxed shell or grant write access, then re-run verification |
| Risk | Partial pip reinstall | Could leave pipx `ccc` broken if uninstall proceeds before failure | Verified after the failed attempt: `~/.local/bin/ccc --version` still works and pipx remains stale |
| Risk | Half-shipped harness/docs | Docs could claim the drift is fixed when pipx still loads stale code | This packet leaves harness and INSTALL_GUIDE unchanged until editable pipx verification passes |
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None. The next action is operational: run the editable pipx repair where `~/.local/pipx` is writable.
<!-- /ANCHOR:questions -->


Dispatch A scope reconciliation: this packet is complete for diagnosis only. The pipx repair is intentionally split to a separate follow-on packet scaffolded by Dispatch B; harness/guide edits shipped in commit `339387694a`.

---
title: "Plan: 016/005/005 CocoIndex install hygiene"
description: "Plan for repairing ccc install drift between pipx and the local editable CocoIndex source, with a guarded failure path when pipx cannot be modified."
trigger_phrases:
  - "016/005/005 plan"
  - "cocoindex install hygiene plan"
  - "pipx editable repair plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/005-cross-cutting-quality/005-cocoindex-install-hygiene"
    last_updated_at: "2026-05-18T18:47:20Z"
    last_updated_by: "codex"
    recent_action: "Captured repair plan and sandbox-blocked execution path"
    next_safe_action: "Retry pipx editable repair outside sandbox, then apply harness and install-guide hardening"
    blockers:
      - "No write permission to pipx logs or pipx venv entry point from this sandbox"
    key_files:
      - "spec.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000005005"
      session_id: "016-005-005-cocoindex-install-hygiene-plan"
      parent_session_id: "016-005-005-cocoindex-install-hygiene"
    completion_pct: 35
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Plan: 016/005/005 CocoIndex install hygiene

<!-- ANCHOR:summary -->
## 1. SUMMARY

The intended fix is narrow: make the pipx `cocoindex-code` environment editable-installed from `.opencode/skills/mcp-coco-index/mcp_server`, then make the extended bake-off harness prefer the production local venv `ccc` binary. The actual execution is currently blocked by sandbox permissions on `~/.local/pipx`, so this packet records the diagnosis and leaves harness/docs unchanged.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

| Gate | Criteria |
|---|---|
| Diagnosis | PATH `ccc` is pipx, pipx direct URL is non-editable, pipx modules are missing, local venv is editable |
| Repair | pipx `direct_url.json` has `{"editable": true}` and all four new modules import from the local source path |
| Harness hardening | All `ccc reset`, `ccc index`, and `ccc search` calls in the bake-off harness use `"$CCC"` |
| Docs | `INSTALL_GUIDE.md` has stale pipx troubleshooting with symptom, cause, fix, and verification |
| Failure guard | If repair cannot complete, only this blocker packet changes |
| Strict validate | This packet validates with zero strict errors or warnings |
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

```
normal shell
    |
    v
~/.local/bin/ccc
    |
    v
~/.local/pipx/venvs/cocoindex-code/
    |
    v
editable link to local source after repair
    |
    v
.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/
```

Production MCP already uses the local venv path directly:

```
.opencode/skills/mcp-coco-index/mcp_server/.venv/bin/ccc
```

The harness should prefer that production-truthful binary and fall back to PATH only when the local venv binary is missing.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase A - Verify drift
- Confirm PATH `ccc`.
- Inspect pipx and local `direct_url.json`.
- Confirm pipx package lacks `reranker.py`, `fts_index.py`, `fusion.py`, and `registered_embedders.py`.

### Phase B - Repair pipx
- Preferred command: `pipx install --force --editable /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/mcp-coco-index/mcp_server`.
- Fallback command: pipx venv Python `pip install --no-deps --force-reinstall --editable <path>`.
- Stop if the repair cannot modify pipx.

### Phase C - Harden callers after repair
- Patch the extended bake-off harness to resolve `CCC` near the top.
- Replace PATH `ccc` invocations in the harness with `"$CCC"`.
- Add stale pipx troubleshooting to `INSTALL_GUIDE.md`.

### Phase D - Verify and hand off
- Verify direct URL metadata and module imports.
- Run strict validation for this packet.
- Emit commit handoff paths without running `git add` or `git commit`.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test | What it verifies |
|---|---|
| `which ccc` | Shell still resolves through pipx |
| `cat .../direct_url.json` | Editable versus non-editable install state |
| pipx venv Python import check | `reranker`, `fts_index`, `fusion`, and `registered_embedders` load from local source |
| `~/.local/bin/ccc --version` | pipx entry point remains runnable |
| `validate.sh --strict` | Packet documentation is structurally valid |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|---|---|---|---|
| `/Users/michelkerkmeester/.local/pipx` write access | Local environment | Red in this sandbox | Cannot complete editable pipx repair |
| Local CocoIndex source | Repo source | Green | Source path exists and local venv already points at it |
| Running benchmark PID 75029 | Parallel process | Leave alone | No dependency; do not interrupt |
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

If the pipx repair succeeds but causes an unexpected CLI regression, reinstall the previous package state with pipx from an unsandboxed shell. For this blocked run, rollback is simply deleting this packet because no harness, guide, local venv, or benchmark artifact changed.
<!-- /ANCHOR:rollback -->

---
title: "Summary: 016/005/005 CocoIndex install hygiene"
description: "Verified the pipx/local CocoIndex install drift and documented the sandbox permission blocker that prevents completing the editable pipx repair in this dispatch."
trigger_phrases:
  - "016/005/005 summary"
  - "cocoindex install hygiene summary"
  - "pipx editable blocker"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/005-cross-cutting-quality/005-cocoindex-install-hygiene"
    last_updated_at: "2026-05-18T18:47:20Z"
    last_updated_by: "codex"
    recent_action: "Diagnosis confirmed; repair diagnosis-only complete"
    next_safe_action: "Run editable pipx repair outside sandbox, then apply harness and guide changes"
    blockers:
      - "pipx cannot rotate logs under /Users/michelkerkmeester/.local/pipx/logs or create /Users/michelkerkmeester/Library/Logs/pipx"
      - "direct pip repair cannot modify /Users/michelkerkmeester/.local/pipx/venvs/cocoindex-code/bin/ccc"
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000005005"
      session_id: "016-005-005-cocoindex-install-hygiene-summary"
      parent_session_id: "016-005-005-cocoindex-install-hygiene"
    completion_pct: 35
---
<!-- SPECKIT_TEMPLATE_SOURCE: implementation-summary-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Summary: 016/005/005 CocoIndex install hygiene

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|---|---|
| Status | BLOCKED - repair cannot write to pipx from this sandbox |
| Branch | main |
| Completed | No |
| Created | 2026-05-18 |
| Level | 1 |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:what-built -->
## 2. WHAT WAS BUILT

This run verified the install drift and created a blocker packet. It did not change the bake-off harness or `INSTALL_GUIDE.md`, because the pipx editable repair failed under sandbox permissions and the user explicitly asked to stop instead of half-shipping when that happens.

### Diagnosis Confirmed

The observed state matches the diagnosis:

| Check | Result |
|---|---|
| PATH `ccc` | `/Users/michelkerkmeester/.local/bin/ccc` |
| pipx `direct_url.json` before repair | `{"dir_info": {}, "url": "file:///Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/mcp-coco-index/mcp_server"}` |
| pipx package modules | Missing `reranker.py`, `fts_index.py`, `fusion.py`, and `registered_embedders.py` |
| local venv `direct_url.json` | `{"dir_info": {"editable": true}, "url": "file:///Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/mcp-coco-index/mcp_server"}` |

### Repair Diagnosis-only complete

The preferred pipx command failed before installation because pipx tried to rotate or create logs outside writable sandbox roots:

```text
PermissionError: [Errno 1] Operation not permitted: '/Users/michelkerkmeester/.local/pipx/logs/cmd_2026-03-18_08.57.06.log'
PermissionError: [Errno 1] Operation not permitted: '/Users/michelkerkmeester/Library/Logs/pipx'
```

The direct pip fallback inside the pipx venv also failed when it attempted to update the pipx entry point:

```text
ERROR: Could not install packages due to an OSError: [Errno 1] Operation not permitted: '/Users/michelkerkmeester/.local/pipx/venvs/cocoindex-code/bin/ccc'
```

After the failed attempts, pipx remained intact but stale:

| Check | Result |
|---|---|
| `~/.local/bin/ccc --version` | `0.2.3+spec-kit-fork.0.2.0` |
| pipx `direct_url.json` after attempts | Still `{"dir_info": {}, ...}` |
| `importlib.util.find_spec("cocoindex_code.reranker")` | `None` |
<!-- /ANCHOR:what-built -->

<!-- ANCHOR:how-delivered -->
## 3. HOW IT WAS DELIVERED

The repair was attempted in two ways: `pipx install --force --editable <mcp_server>` and direct pip inside the pipx venv with `--no-deps --force-reinstall --editable`. Both attempts were diagnosis-only complete by filesystem permissions outside the workspace, so implementation stopped before changing the harness or install guide.
<!-- /ANCHOR:how-delivered -->

<!-- ANCHOR:decisions -->
## 4. KEY DECISIONS

| Decision | Why |
|---|---|
| Stop after pipx repair failure | The user explicitly bound this failure path, and shipping harness/docs while pipx still loads stale code would encode a false completion claim |
| Use direct pip fallback after pipx logging failure | The first failure was pipx logging setup, not package resolution; direct pip was the narrowest equivalent way to try repairing the actual pipx venv |
| Leave local venv untouched | The production MCP venv already points at the local editable source and was explicitly out of scope |
<!-- /ANCHOR:decisions -->

<!-- ANCHOR:verification -->
## 5. VERIFICATION

| Check | Result |
|---|---|
| `which ccc` | PASS - `/Users/michelkerkmeester/.local/bin/ccc` |
| pipx direct URL before repair | PASS - non-editable `dir_info: {}` confirmed |
| pipx package module listing | PASS - new modules missing from pipx copy |
| local venv direct URL | PASS - editable local source confirmed |
| `pipx install --force --editable <mcp_server>` | FAIL - sandbox blocks pipx log paths |
| pipx venv direct pip fallback | FAIL - sandbox blocks pipx venv entry-point update |
| `~/.local/bin/ccc --version` after failed repair | PASS - pipx CLI still runnable |
| pipx `reranker` import after failed repair | FAIL as expected - stale pipx state remains |
<!-- /ANCHOR:verification -->

<!-- ANCHOR:limitations -->
## 6. KNOWN LIMITATIONS

1. **pipx remains non-editable.** Run the repair from an unsandboxed shell or with write access to `/Users/michelkerkmeester/.local/pipx`.
2. **Harness hardening is not applied.** Apply it only after pipx direct URL and module imports prove the executable stack is aligned.
3. **INSTALL_GUIDE.md is not amended.** Add stale pipx troubleshooting after the repair succeeds, so the guide does not imply a fix that is not active on this machine.
<!-- /ANCHOR:limitations -->


Dispatch A scope reconciliation: this packet is complete for diagnosis only. The pipx repair is intentionally split to a separate follow-on packet scaffolded by Dispatch B; harness/guide edits shipped in commit `339387694a`.

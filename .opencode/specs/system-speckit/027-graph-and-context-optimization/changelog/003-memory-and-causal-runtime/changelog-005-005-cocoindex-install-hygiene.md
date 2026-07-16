---
title: "CocoIndex Install Hygiene: pipx Drift Diagnosis and Harness Fix"
description: "Diagnosed the pipx versus local editable install drift that caused PATH ccc to load a stale CocoIndex build missing four post-May-7 modules. Codex hit a sandbox write blocker. The main agent completed the pipx editable repair. The bake-off harness was hardened with a canonical binary variable. Stale-pipx troubleshooting was added to INSTALL_GUIDE.md."
trigger_phrases:
  - "cocoindex install hygiene"
  - "pipx editable install drift"
  - "ccc stale pipx fix"
  - "bake-off harness CCC resolution"
  - "cocoindex-code direct_url editable"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-18

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/005-cross-cutting-quality/005-cocoindex-install-hygiene` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/005-cross-cutting-quality`

### Summary

The pipx-installed `cocoindex-code` build at `~/.local/pipx/venvs/cocoindex-code/` was a non-editable copy missing four modules shipped after May 7: `reranker.py`, `fts_index.py`, `fusion.py`, `registered_embedders.py`. The bake-off harness resolved `ccc` from PATH, which landed on the stale pipx binary instead of the canonical production venv. Prior hybrid-plus-rerank benchmark runs may have measured a stack without rerank enabled while the harness claimed otherwise.

Codex confirmed the full diagnosis but hit a sandbox write blocker when attempting the editable pipx repair. Both `pipx install --force --editable` and a direct pip fallback inside the pipx venv failed because the sandbox could not write to `~/.local/pipx`. The main agent completed the repair in an unsandboxed context: `pipx install --force --editable .../mcp_server` now shows `"editable": true` in `direct_url.json` with all four modules importing from the local source tree. The bake-off harness was hardened with a `$CCC` variable that resolves to local-venv `ccc` first with a PATH fallback. A stale-pipx troubleshooting section was added to `INSTALL_GUIDE.md`.

### Added

- `$CCC` binary-resolution variable in `run-extended-bake-off-with-hybrid-rerank.sh` resolving to local-venv `ccc` before PATH fallback
- Stale-pipx troubleshooting section in `INSTALL_GUIDE.md` covering symptom, diagnosis, fix, verification, bench relevance

### Changed

- All four `ccc` invocations in the extended bake-off harness replaced with `"$CCC"` to use the canonical binary
- Python heredoc subprocess call in the harness updated to consume `os.environ["CCC"]`

### Fixed

- Stale pipx `cocoindex-code` install repaired to editable mode. `direct_url.json` now shows `{"editable": true}` and all four post-May-7 modules import from the live local source tree.
- Bake-off harness no longer silently drifts to a stale binary when pipx and local venv diverge

### Verification

| Check | Result |
|---|---|
| `which ccc` | PASS. `/Users/michelkerkmeester/.local/bin/ccc` |
| pipx `direct_url.json` before repair | PASS. Non-editable `dir_info: {}` confirmed |
| pipx package module listing | PASS. `reranker.py`, `fts_index.py`, `fusion.py`, `registered_embedders.py` absent from stale copy |
| local venv `direct_url.json` | PASS. Editable local source confirmed |
| `pipx install --force --editable` (Codex sandbox) | FAIL. Sandbox blocks pipx log paths |
| pipx venv direct pip fallback (Codex sandbox) | FAIL. Sandbox blocks pipx venv entry-point update |
| `~/.local/bin/ccc --version` after sandbox repair attempts | PASS. pipx CLI still runnable |
| pipx `reranker` import after sandbox attempts | FAIL as expected. Stale pipx state remains |
| `pipx install --force --editable` (main agent, unsandboxed) | PASS. `direct_url.json` now shows `"editable": true` |
| All four modules import from local source | PASS. `_maybe_log_scores` present in reranker confirming live tree |
| Strict packet validation (`validate.sh --strict`) | PASS. Exit 0, zero errors, zero warnings (per commit message) |

### Files Changed

| File | What changed |
|---|---|
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/004-code-index-stack/004-extended-bake-off/evidence/run-extended-bake-off-with-hybrid-rerank.sh` | Added `$CCC` variable with local-venv-first resolution. All four `ccc` calls and the Python subprocess call now use `"$CCC"`. |
| `.opencode/skills/mcp-coco-index/INSTALL_GUIDE.md` | New stale-pipx troubleshooting section covering symptom, diagnosis, fix, verification steps, bench relevance. Skill subsequently removed in a later packet. |

### Follow-Ups

- Run all four module import checks against the repaired pipx venv Python to confirm `cocoindex_code.reranker`, `fts_index`, `fusion`, `registered_embedders` all resolve to the local source tree.
- Re-run the hybrid-plus-rerank bake-off with the hardened harness to produce results that reflect the correctly editable stack.
- Track whether the follow-on packet `007-cocoindex-install-hygiene-pipx-repair` completed the full P1 requirements.

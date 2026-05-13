# 014 Deep Review v3

**Commit reviewed:** d76f3b795  
**Iterations:** 10 (iter-030..039)  
**Comparison to v2:** 011 resolved source-default/model-note drift, but did not resolve launcher parity or the live GitHub PAT. It also introduced fresh 011 traceability drift: the committed packet docs still describe a pre-commit blocked/in-progress state.

## Resolved since v2

- `P2-V2-003-001` - RESOLVED. `.codex/config.toml` now names the EmbeddingGemma 768 DB path in comments/notes.
- `P2-V2-PARENT-002` - RESOLVED. Parent `graph-metadata.json` now points `derived.last_active_child_id` at 011.
- Source-default Qwen drift - RESOLVED. Memory defaults to `onnx-community/embeddinggemma-300m-ONNX`; CocoIndex defaults to `google/embeddinggemma-300m`; Qwen remains only in opt-in registries/historical docs.
- v1 stale CocoIndex P0s - STILL RESOLVED. No evidence found that the 009 search/indexing P0s regressed.

## Still-valid v2 findings (re-confirmed)

- `P0-V2-003-001` -> `P0-V3-LAUNCHER-001`: STILL_VALID. `.codex/config.toml:10-11` still launches `context-server.js` directly, not `.opencode/bin/spec-kit-memory-launcher.cjs`.
- `P0-V2-SEC-001` -> `P0-V3-SEC-001`: STILL_VALID. `.env:12` still contains a full GitHub PAT. Token value intentionally omitted.
- `P1-V2-005-001` -> `P1-V3-005-001`: STILL_VALID. hf-local DB/profile identity still excludes dtype.
- `P1-V2-007-001` -> `P1-V3-007-001`: STILL_VALID. Voyage guard still misses the `auto` path that resolves to Voyage before hf-local warning.
- `P1-V2-007-002`: STILL_VALID. `tcpdump-verify.sh` still uses `tcpdump -i any` on macOS.
- `P1-V2-009-002` -> `P1-V3-009-001`: STILL_VALID. Search-only mode still trusts client `project_root`.
- `P1-V2-009-004` -> `P1-V3-009-002`: STILL_VALID. `project_status` still reports zero chunks when the project is not loaded.
- `P1-V2-009-003`, `P1-V2-008-002`, `P1-V2-005-002`: STILL_VALID. Post-merge checks still miss language coverage, delegate to the non-portable tcpdump script, and allow transient fp32/q4 mixing.
- v2 doc/spec drift findings: STILL_VALID, now expanded by 011/parent/recipe drift.

## New v3 findings

- `P1-V3-011-001`: 011 continuity still says "in progress" and blocked on Codex write access after `.codex/config.toml` was committed.
- `P1-V3-011-002`: 011 blocker file asks for already-applied note edits instead of the remaining command-routing fix.
- `P1-V3-011-003`: 011 build/validation tasks remain unchecked while the commit message claims the cascade strict-validates.
- `P1-V3-PARENT-001`: parent `spec.md` phase map still omits phases 009-011, despite graph metadata being correct.
- `P1-V3-DOC-001`: `SETUP_A_RECIPE.md` still presents Setup A as an opt-in Qwen-era recipe with old defaults.
- `P1-V3-DOC-002` / `P1-V3-DOC-003`: 006 and 009 still describe Qwen3 as the baseline/query embedder.
- `P1-V3-DIM-001`: 002 docs still claim canonical EmbeddingGemma is 2560-dim, contradicting the post-011 768-dim default.
- `P1-V3-LAUNCHER-001`: Claude/Gemini configs also bypass the launcher while `.mcp.json` and `opencode.json` use it.

## Top-priority remediation recommendations

1. Rotate the GitHub PAT and update `.env` without copying the token into docs, review artifacts, or chat.
2. Fix launcher parity in a single runtime-config packet: Codex first, then Claude/Gemini for consistency.
3. Reconcile 011 + parent + recipe docs in one documentation packet: completion state, blocker text, phase map 001-011, current default story, Qwen opt-in boundaries, and validation evidence.
4. Fix dtype identity in a focused embedding-profile packet: add dtype to hf-local profile/DB key or enforce a new-DB reindex boundary on dtype flips.
5. Harden CocoIndex search/status security and reporting: project-root validation, search-only status counts, source-language coverage checks.
6. Fix Voyage egress verification separately: provider-resolution guard first, then portable tcpdump interface handling.

## Overall verdict

FAIL

The source-default unification landed, and the repo now defaults both surfaces to EmbeddingGemma in code. Release readiness is still blocked by the live GitHub PAT and the unresolved Codex launcher parity P0. The next risk tier is traceability: 011 and parent docs now mislead resume flows about what is blocked, what shipped, and which model is the current baseline.

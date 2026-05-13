---
title: "Feature Specification: 017 llama-cpp default flip"
description: "Attempted Memory MCP default flip from hf-local to llama-cpp with migration, runtime config cascade, and scale validation; final recommendation restores hf-local after the 1k probe returned MILD_DIVERGENCE."
trigger_phrases:
  - "017 llama cpp default flip"
  - "Memory MCP llama-cpp migration"
  - "restore hf-local default"
  - "llama-cpp 1k retrieval probe"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/014-local-embeddings-setup-a/017-llama-cpp-default-flip"
    last_updated_at: "2026-05-13T11:10:00Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Completed migration and validation; restored hf-local default after 1k probe missed EQUIVALENT"
    next_safe_action: "Keep auto mode on hf-local; use llama-cpp only with explicit EMBEDDINGS_PROVIDER=llama-cpp"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "implementation-summary.md"
      - "scratch/migration-run-results.json"
      - "scratch/probe-1k-results.json"
      - "scratch/bench-final-results.json"
      - "scratch/end-to-end-smoke.md"
    session_dedup:
      fingerprint: "sha256:0170170170170170170170170170170170170170170170170170170170170170"
      session_id: "017-llama-cpp-default-flip-2026-05-13"
      parent_session_id: "017-llama-cpp-default-flip-2026-05-13"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Gate 3 folder? -> User pre-answered this packet."
      - "Use subagents? -> Forbidden; SPAWN_AGENT_USED=no."
      - "Ship llama-cpp as auto default? -> No. 1k retrieval verdict was MILD_DIVERGENCE."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
# Feature Specification: 017 llama-cpp default flip

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-05-13 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Phase** | 17 |
| **Outcome** | **RESTORE_HF_LOCAL_DEFAULT** after 1k probe missed EQUIVALENT |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Packets 015 and 016 showed that `llama-cpp` is much faster than the current `hf-local` Memory MCP embedding backend and that the smaller 200-row retrieval probe was rank-equivalent. The remaining decision was whether to flip the automatic local default, migrate the live hf-local store, and cascade runtime config notes across Codex, Claude, Gemini, and OpenCode.

### Purpose
Perform the default-flip implementation and migration work, then hold the change to a larger 1000-row / 100-query retrieval probe before shipping. The decisive result was below the contract bar: recall@5 overlap was 0.926 and MRR relative delta was 0.000455, but Spearman top-10 was 0.816125 against the >=0.85 EQUIVALENT threshold. The automatic default was therefore restored to `hf-local`; `llama-cpp` remains explicit opt-in.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Factory default-resolution work for `llama-cpp` and rollback after validation.
- `LlamaCppProvider` profile slug normalization to `llama-cpp__unsloth-embeddinggemma-300m-gguf__768__q8`.
- Idempotent install helper for `node-llama-cpp@3.17.1` and the Q8_0 GGUF model.
- Idempotent migration helper from hf-local sqlite stores to llama-cpp sqlite stores.
- Live migration of the 2488-row hf-local store.
- Runtime note cascade across Codex, Claude, Gemini, and OpenCode configs.
- 1000-row / 100-query retrieval probe, final latency benchmark, and MCP-path smoke.
- Packet docs, parent metadata, and parent closing summary.

### Out of Scope
- Deleting the source hf-local sqlite.
- CocoIndex changes.
- Git operations.
- Shipping a llama-cpp auto default after the scale probe failed the EQUIVALENT bar.

### Files Changed

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/shared/embeddings/factory.ts` | Modify | Added llama-cpp probing path, then restored auto fallback to hf-local after validation |
| `.opencode/skills/system-spec-kit/shared/embeddings/providers/llama-cpp.ts` | Modify | Added loadability probe and slug-compatible profile metadata |
| `.opencode/skills/system-spec-kit/scripts/install-llama-cpp.sh` | Add | Idempotent dependency/model bootstrap helper |
| `.opencode/skills/system-spec-kit/scripts/migrate-embeddings-to-llama-cpp.ts` | Add | Explicit migration helper with sample validation |
| `.env.example` and runtime configs | Modify | Documented hf-local auto default and llama-cpp explicit opt-in |
| `.opencode/skills/system-spec-kit/mcp_server/README.md` | Modify | Documented optional llama-cpp path and final no-flip result |
| `scratch/` | Add | Pre-flight notes, migration runbook/results, rollback, probe, bench, and smoke evidence |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### Functional Requirements
- **REQ-001** Explicit `EMBEDDINGS_PROVIDER=llama-cpp` must remain functional.
- **REQ-002** Auto mode must keep cloud key precedence for Voyage and OpenAI.
- **REQ-003** Auto mode must not ship llama-cpp unless the larger retrieval probe returns EQUIVALENT.
- **REQ-004** Existing hf-local store must remain intact.
- **REQ-005** Migration must preserve rows and IDs while replacing vector blobs.
- **REQ-006** Migration must exit successfully only with zero validation mismatches.
- **REQ-007** Runtime config notes must describe the final default state truthfully.

### Non-Functional Requirements
- No archival files.
- No source sqlite deletion.
- No sub-agent delegation.
- No git staging, commit, or push.
- Validation evidence must use real numbers.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

1. Live migration writes 2488 llama-cpp rows with zero mismatches.
2. Final benchmark records both backends.
3. 1k retrieval probe determines whether the default flip ships.
4. MCP-path smoke confirms explicit llama-cpp can query the migrated store.
5. If the probe verdict is below EQUIVALENT, auto mode is restored to hf-local.
6. Packet strict validation exits 0.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Rank-order drift at larger scale | Faster backend could degrade retrieval | 1k/100-query probe gates the default |
| Risk | Vector store mixing | Wrong sqlite profile could corrupt search | Provider-specific slug with `q8` dtype |
| Risk | Long docs exceed llama context | Migration/probe failures | `maxTextLength=700` chunking |
| Risk | Native module portability | llama-cpp may not load on every host | Explicit install helper and opt-in provider |
| Dependency | GGUF model | Required for explicit llama-cpp | `install-llama-cpp.sh` verifies SHA-256 |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:complexity -->
## 7. COMPLEXITY

| Area | Complexity | Notes |
|------|------------|-------|
| Factory/default path | Medium | Default changed and then restored based on probe verdict |
| Migration helper | Medium | Copies schema, re-embeds rows, preserves IDs, validates vectors |
| Scale probe | Medium | 1000 docs, 100 queries, two providers, ranking metrics |
| Runtime cascade | Low | Config note updates only |
| Packet close-out | Medium | Must reconcile failed default flip with completed setup line |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:nfr -->
## 8. NON-FUNCTIONAL REQUIREMENTS

| Requirement | Target | Verification |
|-------------|--------|--------------|
| Migration integrity | 0 mismatches | `scratch/migration-run-results.json` |
| Retrieval quality gate | EQUIVALENT required to ship default | `scratch/probe-1k-results.json` |
| Speed evidence | Both p50s recorded | `scratch/bench-final-results.json` |
| Runtime smoke | PASS | `scratch/end-to-end-smoke.md` |
| Rollback | hf-local default restored | `resolveProvider()` and runtime notes |
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 9. EDGE CASES

- First migration attempts exposed two real edge cases: overly long content exceeded llama context, and `sqlite-vec` rowids required integer-safe binding. The final migration script handles both.
- A stale compiled shared package briefly created a `q8_0` llama-cpp sqlite; it was removed with `rm -f` and the packages were rebuilt.
- MCP-path smoke via direct handler skipped server DB initialization; final smoke used JSON-RPC over the Memory MCP launcher.
- Metal tensor API warnings appeared on this host, so llama-cpp ran with CPU fallback while still retaining the latency advantage.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

No packet-blocking questions remain. A future packet would need a rank-stability fix before reconsidering llama-cpp as the automatic local default.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:related-docs -->
## 11. RELATED DOCS

- Parent packet: `../spec.md`
- Provider benchmark predecessor: `../015-node-llama-cpp-evaluation/implementation-summary.md`
- Retrieval probe predecessor: `../016-llama-cpp-retrieval-quality-probe/implementation-summary.md`
- Evidence: `scratch/probe-1k-results.md`, `scratch/migration-runbook.md`, `scratch/rollback.md`
<!-- /ANCHOR:related-docs -->

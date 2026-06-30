---
title: "037 llama-cpp embedding worker deep-dive (+ minimal fix)"
description: "Confirm or falsify the contextSize:512 hypothesis behind the chronic embedding-worker null-return failures, then apply a minimal source-level fix. Diagnostic + minimal fix in one packet, plus a 3.15.1 vs 3.17.1 version probe."
trigger_phrases:
  - "037 llama-cpp embedding worker deep-dive"
  - "post-032 embedding worker context size"
  - "llama-cpp contextSize 512 bug"
  - "embedding null return GGUF Q8"
related_specs:
  - "022-local-llm-legacy-remediation"
  - "032-substrate-repair-followups"
  - "033-system-code-graph-import-path-cleanup"
  - "034-query-expansion-context-size"
  - "035-cocoindex-mcp-reliability"
  - "036-failed-embedding-cleanup-retry"
  - "038-embedding-error-propagation"
  - "039-token-aware-chunking"
  - "041-v-rule-cross-spec-overreach"
importance_tier: "important"
contextType: "spec"
status: "in_progress"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/001-local-embeddings-foundation/037-llama-cpp-embedding-worker-deep-dive"
    last_updated_at: "2026-05-14T14:30:00Z"
    last_updated_by: "main-agent"
    recent_action: "Authored spec from approved plan"
    next_safe_action: "Dispatch Phase 1 reproduction harness via cli-codex gpt-5.5 high fast"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/shared/embeddings/providers/llama-cpp.ts"
      - ".opencode/skills/system-spec-kit/shared/chunking.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/package.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000037"
      session_id: "037-llama-cpp-embedding-worker-deep-dive"
      parent_session_id: null
    completion_pct: 5
    open_questions: []
    answered_questions:
      - "Strict diagnostic vs minimal fix: minimal fix in same packet (user-confirmed)"
      - "3.17.1 version probe: include (user-confirmed)"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec | v2.2 -->
# Feature Specification: 037 llama-cpp embedding worker deep-dive

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. Metadata

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | In Progress |
| **Created** | 2026-05-14 |
| **Branch** | main (no feature branch — staying on main per user feedback) |
| **Parent Spec** | ../spec.md (014-local-embeddings-migration phase parent) |
| **Phase** | 37 of 37 |
| **Predecessor** | 032-substrate-repair-followups |
| **Successor** | None (036 + 034 unblock once this lands) |
| **Handoff Criteria** | embedding worker passes 4000-char save round-trip; vitest PASS; ADR-003 shipped |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. Problem & Purpose

### Problem Statement

032 surfaced a persistent root issue in the local llama-cpp embedding worker: `node-llama-cpp`'s `getEmbeddingFor()` returns `null` on substantive content. 214 historical failed embeddings sit in `memory_index` with `embedding_status='failed'`. Every save-heavy scenario in the 24-- query-intelligence suite (411–415) hits a circuit-breaker-open provider; scenario 401 saves successfully but search can't recall it because the expanded-query embedding also returns null.

Code inspection points to a hardcoded mismatch:

- `shared/embeddings/providers/llama-cpp.ts:216` sets `contextSize: 512` on `createEmbeddingContext`.
- `shared/chunking.ts:20` sets `MAX_TEXT_LENGTH = 8000` *characters* as the only truncation gate.
- EmbeddingGemma's SentencePiece tokenizer typically yields ~1.3 chars/token, so 8000 chars ≈ ~6000 tokens, an order of magnitude above the 512-token context window. Anything between ~700 and 8000 chars sails past the truncation gate and is fed whole to a 512-token context.

### Purpose

Confirm or falsify the hypothesis by experiment, ship a minimal corrective fix in the embedding worker, and produce ADR-003 documenting the contract change for future maintainers. Restore the substrate to a state where `memory_save` of arbitrary-length content succeeds and `memory_search` recall works for expanded queries.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. Scope

### In Scope

- Standalone reproduction harness at `.opencode/specs/_sandbox/37--llama-cpp-context-size/` exercising the llama-cpp provider directly across an 11-step size sweep.
- Comparative run under sandbox-installed `node-llama-cpp@^3.17.1` to isolate version drift from contextSize effects.
- Phase 3 written verdict: hypothesis CONFIRMED or FALSIFIED, committed before any code change.
- Minimal source-level patch to `shared/embeddings/providers/llama-cpp.ts` raising `contextSize` to model max (2048) and adding a token-count preflight that truncates over-budget inputs.
- New vitest `mcp_server/tests/llama-cpp-context-size.vitest.ts` with 3 focused cases.
- ADR-003 (`decision-record.md`) capturing the contract change + evidence chain.
- Live 4000-char round-trip + scenario 401/411 replay to confirm end-to-end fix.

### Out of Scope

- Replaying all 15 of the 24-- scenarios (deferred to 036).
- Cleaning the 214 historical failed embeddings (036).
- Patching `lib/search/embedding-expansion.ts:268` to bound combined queries (034).
- CocoIndex MCP -32001 reliability (035).
- system-code-graph import-path cleanup (033).
- Refactoring `MAX_TEXT_LENGTH` to a token-based constant.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/shared/embeddings/providers/llama-cpp.ts` | Modify | Raise `contextSize: 512` → `2048` (env-overridable); add token-count preflight in `generateEmbedding` |
| `.opencode/skills/system-spec-kit/mcp_server/tests/llama-cpp-context-size.vitest.ts` | Create | 3 focused tests covering the new contract |
| `.opencode/specs/_sandbox/37--llama-cpp-context-size/repro.mjs` | Create | Direct-provider repro harness |
| `.opencode/specs/_sandbox/37--llama-cpp-context-size/v3.17.1/repro.mjs` | Create | Same harness against sandbox-installed 3.17.1 |
| `.opencode/specs/_sandbox/37--llama-cpp-context-size/run-3.15.1.{jsonl,summary.tsv}` | Create | Raw + summary evidence |
| `.opencode/specs/_sandbox/37--llama-cpp-context-size/run-3.17.1.{jsonl,summary.tsv}` | Create | Raw + summary evidence |
| `.opencode/specs/_sandbox/37--llama-cpp-context-size/version-comparison.md` | Create | Side-by-side findings |
| `032/handover.md` | Modify | One-line follow-up status note when 037 ships |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. Requirements

### P0 — Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Reproduce the null-return failure under controlled conditions | `run-3.15.1.jsonl` contains at least one row where `result=null` for an input where `inputTokens > 512` |
| REQ-002 | Write a falsify-or-confirm verdict before any code change | `implementation-summary.md > Hypothesis verdict` contains explicit "CONFIRMED" or "FALSIFIED" verdict with timestamp BEFORE the source patch lands |
| REQ-003 | Apply minimal source-level fix to llama-cpp.ts | `contextSize` raised to 2048 (or env-overridable); token-count preflight added; vitest PASS |
| REQ-004 | Verify the fix via live round-trip | 4000-char ephemeral `memory_save` returns id with `embedding_status='success'`; `memory_search` recalls in top 3 with similarity > 0.5 |

### P1 — Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Run 3.15.1 vs 3.17.1 comparison | `version-comparison.md` produced; documents whether version bump alone changes the failure mode |
| REQ-006 | Ship ADR-003 documenting the contract change | `decision-record.md` records: rationale, alternatives, evidence file:line refs, env-override design |
| REQ-007 | Single-scenario replay of 401 + 411 | Both scenarios produce VERDICT (PASS or PARTIAL) in their evidence outputs |
| REQ-008 | `npm run build` exits 0 after the patch | Confirms 003-mcp-server-build-fix remains intact |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. Success Criteria

- **SC-001**: Substantive `memory_save` (≥3000 char body) succeeds end-to-end without hitting the circuit breaker.
- **SC-002**: `memory_health` reports `embeddingRetry.flapping=false` and `circuitBreakerOpen=false` after a 2-minute soak with 10 substantive saves.
- **SC-003**: 037's vitest PASSes 3/3.
- **SC-004**: ADR-003 is reviewable in isolation — a future maintainer can re-derive the fix from the document.
- **SC-005**: 032's blocked children (002, 004) become unblocked on rerun (verified via single-scenario replay).
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. Risks & Dependencies

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | The contextSize raise to 2048 might exceed EmbeddingGemma's actual runtime capacity | High | Phase 1 harness validates the model accepts 2048 before the patch lands; truncation preflight is a safety net |
| Risk | 3.17.1 sandbox install may pull native build deps the codex sandbox can't fetch | Medium | If `npm install` fails network-wise, document the failure in version-comparison.md and proceed with 3.15.1-only evidence |
| Risk | The hypothesis is wrong (e.g., real bug is tokenizer config, not contextSize) | Medium | Phase 3 is the gate — HALT before patch if Phase 1+2 show null returns at sizes well under 512 tokens |
| Dependency | `unsloth/embeddinggemma-300m-GGUF` model cached locally | Low | Already cached per 022 — verify in Phase 1 preflight |
| Dependency | codex sandbox `network_access=true` for 3.17.1 install | Medium | Pass `-c sandbox_workspace_write.network_access=true` to the Phase 2 codex dispatch |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NFRs (Level 2 addendum)

| NFR | Target | Verification |
|-----|--------|--------------|
| Embedding latency (768d, 4000-char input) | < 500ms p95 on local Metal backend | Phase 1 harness logs elapsedMs per size |
| Substrate stability under 10-save soak | 0 circuit breaker transitions | `memory_health` `circuitBreakerOpen` stays false |
| Backward compatibility | Existing 256-char saves continue to work | vitest case 1 |
| Truncation observability | console.warn when preflight truncates input | grep test stderr for warning |
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. Edge Cases (Level 2 addendum)

1. **Input exactly 512 tokens**: should produce a vector without truncation warning. Test boundary.
2. **Input 513 tokens**: preflight should kick in; truncate to last full sentence within budget; emit warning. Vector should still be produced.
3. **Input with 8 expansion terms**: simulates 401's failure path; expanded combinedQuery ~6000-8000 chars; preflight should normalize.
4. **Empty input**: pre-existing behavior — return null without invoking the model. Confirm not regressed.
5. **CJK or other multi-byte text**: char-based 8000 gate is too lenient for token-dense text; token preflight catches it.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:questions -->
## 9. Open Questions

- None at the start of Phase 1 — both pre-execution questions (strict-diagnostic vs minimal-fix; 3.17.1 probe yes/no) were resolved during planning.
- Any question that emerges from Phase 1/2 evidence will be documented in `implementation-summary.md > Open Questions` and escalated before Phase 4.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:complexity -->
## 10. Complexity (Level 2 addendum)

| Phase | Wall-clock estimate | Executor |
|-------|---------------------|----------|
| Phase 0 — scaffold | 5 min (done) | main agent |
| Phase 1 — repro 3.15.1 | 15 min | cli-codex gpt-5.5 high fast |
| Phase 2 — repro 3.17.1 | 15 min | cli-codex gpt-5.5 high fast |
| Phase 3 — falsify/confirm | 5 min | main agent |
| Phase 4 — minimal fix | 10 min | cli-codex gpt-5.5 high fast |
| Phase 5 — verify + ADR-003 | 15 min | main + 1 codex doc-write |
| **Total** | **~65 min wall-clock** | autonomous single-run |

**Complexity score**: Medium. Single-file source change, well-bounded harness, no DB migrations. Risk concentrated in the contextSize raise (mitigated by Phase 1 evidence gate).
<!-- /ANCHOR:complexity -->

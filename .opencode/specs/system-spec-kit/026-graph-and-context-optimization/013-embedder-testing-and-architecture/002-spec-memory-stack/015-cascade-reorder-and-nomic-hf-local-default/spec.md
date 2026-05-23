---
title: "Spec: 016/002/015 Local-First Cascade Reorder + Nomic hf-local Default (ADR-014)"
description: "Reorder auto-select provider cascade to Ollama → hf-local → OpenAI → Voyage (local-first). Change HF_LOCAL_MODEL fallback from BAAI/bge-base-en-v1.5 to nomic-ai/nomic-embed-text-v1.5 so new users with sentence-transformers get the same embedder as Ollama users. Update test, INSTALL_GUIDE, opencode.json/mcp.json env notes, all related READMEs, doctor commands, and write ADR-014."
trigger_phrases:
  - "adr-014 cascade reorder"
  - "local-first embedder cascade"
  - "hf-local nomic default"
  - "ollama tier 1 cascade"
  - "voyage tier 4 cascade"
  - "016/002/015 cascade reorder"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/002-spec-memory-stack/015-cascade-reorder-and-nomic-hf-local-default"
    last_updated_at: "2026-05-19T05:50:00Z"
    last_updated_by: "main_agent"
    recent_action: "Shipped ADR-014 cascade reorder + doc sweep"
    next_safe_action: "Main agent commits per Commit Handoff"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/shared/embeddings/auto-select.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/tests/embedder-auto-selection.vitest.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/INSTALL_GUIDE.md"
      - "opencode.json"
      - ".mcp.json"
      - ".opencode/commands/doctor/mcp.md"
      - ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/002-spec-memory-stack/004-spec-memory-embedder-bake-off/decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000002015"
      session_id: "016-002-015"
      parent_session_id: null
    completion_pct: 5
    open_questions: []
    answered_questions:
      - "Cascade order: Ollama (1) > hf-local (2) > OpenAI (3) > Voyage (4) — operator-confirmed local-first."
      - "hf-local fallback model: nomic-ai/nomic-embed-text-v1.5 (768d) — same as Ollama default for cascade consistency."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Spec: 016/002/015 Local-First Cascade Reorder + Nomic hf-local Default (ADR-014)

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|---|---|
| Status | Planned (one partial edit landed pre-scaffold) |
| Type | Code change + ADR + multi-doc sweep |
| Owner | Fresh Opus agent (dispatched by main) |
| Parent | `../spec.md` (002-spec-memory-stack) |
| Supersedes | ADR-013's cascade clause only (ADR-013 stands for the within-Ollama priority order) |
| Triggered by | Operator preference for local-first execution |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

ADR-013 made `nomic-embed-text-v1.5` the within-Ollama default. But the **outer cascade** still prefers cloud APIs (Voyage > OpenAI > Ollama > hf-local), which means:

1. A user with `VOYAGE_API_KEY` set silently gets Voyage even when they prefer local-first execution.
2. The `hf-local` fallback uses `BAAI/bge-base-en-v1.5` (768d) — different from the in-Ollama nomic default. New users without Ollama get a different embedder than users with Ollama, which fragments the production characteristic profile.

The operator's stated intent (2026-05-19) is **local-first** for the auto-bootstrap path: prefer Ollama when available, fall through to hf-local Nomic, only escalate to cloud APIs when nothing local works. Dispatch A records the remaining regression explicitly: explicit `EMBEDDINGS_PROVIDER=hf-local` paths outside the auto bootstrap were not migrated in this packet and may still default differently. Source-code fixes for explicit-provider parity belong to Dispatch C.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

In scope:
- **Code: cascade reorder** in `shared/embeddings/auto-select.ts` from `[voyage, openai, ollama, hf-local]` → `[ollama, hf-local, openai, voyage]`.
- **Code: HF_LOCAL_MODEL change** — `BAAI/bge-base-en-v1.5` → `nomic-ai/nomic-embed-text-v1.5`. (Partial: line already edited at scaffold time.)
- **Test fix** in `mcp_server/tests/embedder-auto-selection.vitest.ts:158` — the error-message-order assertion `/voyage:.*openai:.*ollama:.*hf-local:/i` must become `/ollama:.*hf-local:.*openai:.*voyage:/i`.
- **Doc sweep** in:
  - `mcp_server/INSTALL_GUIDE.md` (cascade documentation + new-user recommendation)
  - `opencode.json` env `_NOTE_3_PROVIDERS` + `_NOTE_4_EMBEDDINGS_PROVIDER`
  - `.mcp.json` same notes
  - `.opencode/commands/doctor/mcp.md` (any embedder probe documentation)
  - `.opencode/skills/system-spec-kit/README.md` (cascade explanation, if present)
  - `.opencode/skills/system-spec-kit/mcp_server/README.md`
  - `.opencode/skills/system-spec-kit/references/memory/embedder_architecture.md`
  - `.opencode/skills/system-spec-kit/references/memory/embedding_resilience.md`
  - `.opencode/skills/system-spec-kit/references/embedder-pluggability.md`
  - `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md` (any cascade language)
  - `004-spec-memory-embedder-bake-off/decision-record.md` — append ADR-014.
- **ADR-014 write** — supersedes ADR-013's cascade clause; full trade-off table + rollback path.

Out of scope:
- CocoIndex code-side cascade (different surface, not affected by ADR-014).
- ONNX packaging of nomic — if hf-local needs ONNX flavor of nomic instead of native PyTorch, that's a separate follow-on.
- Production re-validation under the new cascade — covered separately if regression appears.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| # | Requirement |
|---|---|
| R1 | `auto-select.ts` `sequence` array reordered to `[ollama, hf-local, openai, voyage]`. |
| R2 | `HF_LOCAL_MODEL` constant = `'nomic-ai/nomic-embed-text-v1.5'` (already partial-shipped). |
| R3 | `embedder-auto-selection.vitest.ts` order-assertion updated to new tier order. |
| R4 | `vitest --run tests/embedder-auto-selection.vitest.ts` passes. |
| R5 | `npm run typecheck` passes. |
| R6 | `npm run build` passes (dist rebuilt for runtime use). |
| R7 | All docs in §3 updated to reflect new cascade order. |
| R8 | ADR-014 appended to `decision-record.md` with the full trade-off table. |
| R9 | Strict-validate PASSED on this packet. |
| R10 | grep of legacy cascade phrasing (`voyage > openai > ollama` / `Voyage > OpenAI > Ollama` / `voyage.*openai.*ollama.*hf-local`) returns 0 hits across the documented scope. |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- All requirements satisfied per §4.
- Test suite green (at minimum: embedder-auto-selection + embedder-ollama + typecheck + build).
- Strict-validate PASSED on this packet.
- Implementation-summary written + Commit Handoff section listing every path touched.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:approach -->
## 6. APPROACH

Phase 1 — code change (~10 min):
1. Reorder `sequence` array in `auto-select.ts` lines 451-457.
2. Update `embedder-auto-selection.vitest.ts:158` regex assertion.
3. Run `npm run typecheck && npm run test:legacy && vitest --run tests/embedder-auto-selection.vitest.ts && npm run build`.

Phase 2 — doc sweep (~30 min):
1. Update INSTALL_GUIDE.md cascade docs.
2. Update opencode.json + .mcp.json env notes (both `_NOTE_3_PROVIDERS` and `_NOTE_4_EMBEDDINGS_PROVIDER` shipped in `mk-spec-memory` block).
3. Update doctor mcp.md (find embedder-cascade language).
4. Update READMEs (system-spec-kit + mcp_server).
5. Update reference docs (embedder_architecture.md, embedding_resilience.md, embedder-pluggability.md, ENV_REFERENCE.md).
6. Append ADR-014 to 016/002/004 decision-record.md.

Phase 3 — verify + commit:
1. Run strict-validate on this packet.
2. Run `grep -rn "voyage > openai > ollama\|Voyage > OpenAI > Ollama\|voyage.*openai.*ollama.*hf-local" .opencode/` — expect 0 hits.
3. Append Commit Handoff to implementation-summary.md.
4. Main agent commits.
<!-- /ANCHOR:approach -->

<!-- ANCHOR:risks -->
## 7. RISKS & DEPENDENCIES

Risks:
- **Existing operators with VOYAGE_API_KEY set** silently switch from Voyage to Ollama on next daemon restart. Mitigation: documented behavior change in ADR-014 + INSTALL_GUIDE; operator can force a specific provider via `EMBEDDINGS_PROVIDER=voyage`.
- **hf-local fallback may need ONNX flavor of nomic** instead of native PyTorch. If sentence-transformers can't load `nomic-ai/nomic-embed-text-v1.5` directly, the model selection needs a different HF identifier or ONNX path.
- **Test order regression** — the assertion at vitest.ts:158 enforces the specific error-message ordering. If the new order isn't reflected exactly, the test fails.

Dependencies:
- ADR-013 (already shipped, commit `847333a8f`).
- The 007 auto-embedder-selection packet (already shipped, commit `138d2e932`).
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 8. OPEN QUESTIONS

- None at scaffold time. Operator pre-answered both decisions (cascade order + hf-local default) via the 2026-05-19 directive.
<!-- /ANCHOR:questions -->

<!-- ANCHOR:cross-links -->
## 9. CROSS-LINKS

- **ADR being authored:** `../004-spec-memory-embedder-bake-off/decision-record.md` (append ADR-014)
- **ADR-013 (within-Ollama priority):** commit `847333a8f`
- **Auto-select code:** `.opencode/skills/system-spec-kit/shared/embeddings/auto-select.ts`
- **Test:** `.opencode/skills/system-spec-kit/mcp_server/tests/embedder-auto-selection.vitest.ts:158`
- **Sibling phase 007 (auto-embedder selection mechanism):** `../007-auto-embedder-selection-and-llama-cpp-purge/`
<!-- /ANCHOR:cross-links -->

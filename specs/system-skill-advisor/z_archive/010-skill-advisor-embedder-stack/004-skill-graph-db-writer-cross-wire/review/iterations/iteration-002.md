---
title: "Iter 2 — regression-risk (commit c0ec765f4 post-impl review)"
iter_number: 2
dimension: regression-risk
executor: cli-devin
model: swe-1.6
recipe: agent-config-deep-review-iter.json
review_target_commit: c0ec765f4
---

## 1. SCOPE READ

- `.opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts` — 1124 lines; read imports and refresh/load implementation.
- `.opencode/skills/system-skill-advisor/mcp_server/tests/skill-graph/refresh-roundtrip.vitest.ts` — 201 lines; read full new round-trip test file.
- `.opencode/skills/system-skill-advisor/mcp_server/lib/embedders/registry.ts` — 107 lines; read `getAdapter()` contract.
- `.opencode/skills/system-skill-advisor/mcp_server/lib/embedders/schema.ts` — 121 lines; read active pointer and vec table helpers.
- `.opencode/skills/system-skill-advisor/mcp_server/lib/embedders/adapter.ts` — 22 lines; read `EmbedderAdapter` interface.
- Additional caller trace: `.opencode/skills/system-skill-advisor/mcp_server/handlers/skill-graph/scan.ts` — 70 lines; read sole production `refreshSkillEmbeddings()` caller found by `rg`.
- Additional consumer trace: `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/semantic-shadow.ts` — 171 lines; read `loadSkillEmbeddings()` consumer found by `rg`.

## 2. regression-risk CLAIMS

1. `refreshSkillEmbeddings()` preserves the public return shape in both branches: `SkillEmbeddingRefreshResult` remains `{ embedded, skipped, failed, warnings }` at `.opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts:86-91`, and both helper paths return that shape at `.opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts:901` and `.opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts:972`.

2. The dispatcher branch condition is pointer-presence only: `refreshSkillEmbeddings()` calls `hasActiveEmbedderPointer(database)` and chooses adapter vs legacy at `.opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts:788-795`. `hasActiveEmbedderPointer()` only checks the active-name key, not a complete/valid name+dim pair, at `.opencode/skills/system-skill-advisor/mcp_server/lib/embedders/schema.ts:47-55`.

3. The only production caller found is `handleSkillGraphScan()`: it calls `indexSkillMetadata()`, then `refreshSkillEmbeddings(skillsRoot)`, then returns `okResponse({ ..., embeddings: embeddingRefresh })` at `.opencode/skills/system-skill-advisor/mcp_server/handlers/skill-graph/scan.ts:49-64`. This means refresh counter semantics are the externally visible regression surface.

4. Adapter-path successful/idempotent row handling mirrors legacy at a high level: both skip rows outside `skillDir`, clear/delete embeddings for empty descriptions, skip matching model/content-hash rows, and increment per-row failures with `EMBEDDING-FAILED` warnings at `.opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts:860-901` and `.opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts:932-972`.

5. The new tests cover both dispatch branches and adapter idempotency, but the adapter-unavailable test currently codifies warning-only behavior rather than failure-counter behavior: it seeds a skill, sets an unknown active pointer, calls `refreshSkillEmbeddings()`, and asserts `embedded=0` plus one warning without asserting any failed count at `.opencode/skills/system-skill-advisor/mcp_server/tests/skill-graph/refresh-roundtrip.vitest.ts:169-180`.

## 3. FINDINGS

### P0

None.

### P1

None.

### P2

- P2 — Adapter-unavailable path reports a successful zero-failure refresh even when rows need embeddings.
  - Reproduction evidence: the round-trip test seeds `sk-unknown`, indexes it, sets the active embedder to `definitely-not-a-real-embedder`, and calls `refreshSkillEmbeddings()` at `.opencode/skills/system-skill-advisor/mcp_server/tests/skill-graph/refresh-roundtrip.vitest.ts:169-175`.
  - Implementation evidence: when `getAdapter(active.name)` returns undefined, the adapter path returns `{ embedded: 0, skipped: 0, failed: 0, warnings: [...] }` immediately at `.opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts:806-815`; thrown adapter-construction errors do the same at `.opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts:817-824`.
  - Regression-risk evidence: the scan handler wraps the refresh result into an OK MCP response at `.opencode/skills/system-skill-advisor/mcp_server/handlers/skill-graph/scan.ts:60-64`, so callers see an apparently non-failing refresh despite no row being embedded.
  - Counter-semantics contrast: actual per-row embed failures increment `failed` and emit `EMBEDDING-FAILED` warnings in both branches at `.opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts:891-897` and `.opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts:962-968`. The adapter-unavailable early return bypasses that semantics and can mask an all-row outage as `failed: 0`.

## 4. FINDINGS COUNTS

P0: 0, P1: 0, P2: 1

## 5. GAPS FOR NEXT ITER

- Did not run tests; this iteration stayed read-only.
- Did not inspect the full commit diff beyond the scoped files and direct caller/consumer traces.
- Next iteration should check operational/docs drift around active pointer setup because README/INSTALL_GUIDE still appeared in `rg` results for `refreshSkillEmbeddings()` and pointer-swap guidance.
- A weaker robustness risk remains around `setActiveEmbedder(db, name, dim)` accepting mismatched names/dims, but current `rg` evidence showed only tests/docs invoking it, so it was not escalated as a separate regression-risk finding here.

## 6. JSONL DELTA ROW

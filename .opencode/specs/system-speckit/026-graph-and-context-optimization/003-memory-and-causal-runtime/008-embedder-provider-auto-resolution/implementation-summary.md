---
title: "Implementation Summary: Robust embedding-provider auto-resolution (ollama-first)"
description: "Research COMPLETE — root cause proven and portable fix ranked in research.md. Code fix deferred to a follow-on packet; interim ollama pin active separately."
trigger_phrases:
  - "embedder provider auto resolution implementation summary"
  - "research complete code fix deferred embedder"
  - "auto resolves hf-local root cause summary"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/008-embedder-provider-auto-resolution"
    last_updated_at: "2026-05-27T14:30:00Z"
    last_updated_by: "main_agent"
    recent_action: "research-complete-root-cause-proven-portable-fix-ranked-in-research-md"
    next_safe_action: "open-follow-on-packet-implement-bd-fix-then-revert-pin-to-auto"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/shared/embeddings/factory.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/embedders/schema.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000308"
      session_id: "embedder-auto-resolution-008"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Why resolveActiveOllamaEmbedder() returns null: sqlite3 PATH dependency, ENOENT swallowed to null"
      - "Most robust portable fix: (b) better-sqlite3 read + (d) generic active_embedder_provider resolution"
---
# Implementation Summary: Robust embedding-provider auto-resolution (ollama-first)

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 008-embedder-provider-auto-resolution |
| **Completed** | 2026-05-27 |
| **Level** | 1 |


<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:what-built -->
## What Was Built

This is a **deep-research packet**; the delivered "implementation" is the **research deliverable**, not a code change. The research is **COMPLETE**: `research/research.md` proves the root cause of `EMBEDDINGS_PROVIDER=auto` silently resolving to `hf-local` and delivers a ranked, portable fix recommendation, executed via cli-codex gpt-5.5 (high reasoning, read-only).

**Root cause (proven):** the factory's active-embedder detection reads SQLite metadata by shelling out to a bare `sqlite3` binary (`querySqliteScalar` at `factory.ts:284`) and returns null on ANY error including `ENOENT`. The daemon's inherited PATH lacks `sqlite3`, so every probe fails silently → `readActiveOllamaEmbedderFromDb()` (`factory.ts:352`) returns null → `resolveProvider()` (`factory.ts:609`) falls through past ollama to the `hf-local` fallback. The earlier package-root hypothesis was disproven — `resolveSpecKitPackageRoot()` works.

**Recommended fix (deferred to a follow-on packet):** (b) replace the `sqlite3` shell-out with a Node SQLite read (`better-sqlite3`, already a server dependency) + reuse `shared/paths.ts` db-dir resolution; AND (d) honor `active_embedder_provider` generically, building the shard path from provider/model/dim rather than the hardcoded ollama pattern. Then revert the interim `EMBEDDINGS_PROVIDER=ollama` pin (active separately) back to `auto` and verify.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `research/research.md` | Created | Deep-research deliverable: proven root cause + ranked portable fix + verification plan |
| `spec.md` | Created (pre-existing) | Research packet specification |
| `plan.md` | Created | Documents the planned-but-deferred (b)+(d) fix approach |
| `tasks.md` | Created | Research tasks (done) + deferred implementation tasks |
| `implementation-summary.md` | Created | This summary |


<!-- /ANCHOR:what-built -->
---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

This packet delivered a research artifact, not a code change. The investigation ran as a single-pass cli-codex gpt-5.5 (high reasoning, read-only) dispatch that verified every claim against the built `shared/dist/embeddings/factory.js`, the TS sources, the launcher, and the MCP configs. Confidence comes from research convergence: each root-cause and fix claim in `research/research.md` carries a decisive `file:line` citation, and the earlier package-root hypothesis was explicitly disproven rather than assumed. No code shipped here; the recommended (b)+(d) fix and its verification recipe are handed to a follow-on `/speckit:plan` + `/speckit:implement`.


<!-- /ANCHOR:how-delivered -->
---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Rationale |
|----------|-----------|
| Treat the research deliverable as this packet's "implementation" | This is a research packet; the code fix is explicitly out of scope and deferred to a follow-on `/speckit:plan` + `/speckit:implement` |
| Recommend (b)+(d) over (a)/(c) | (b) removes the actual root cause (sqlite3 PATH dependency); (d) removes the ollama-only assumption — both portable. (a)/(c) only address launch-context drift and still depend on `sqlite3` |
| Keep the interim `EMBEDDINGS_PROVIDER=ollama` pin (applied separately) | Valid stopgap — the explicit-override branch short-circuits before the broken probe; non-portable, so it is reverted only after the fix lands |
| Defer the code fix | Research-vs-implementation separation; the fix is a distinct packet with its own plan, tests, and verification |


<!-- /ANCHOR:decisions -->
---

<!-- ANCHOR:verification -->
## Verification

| Test Type | Status | Notes |
|-----------|--------|-------|
| Research convergence | Pass | Root cause proven with decisive `file:line` evidence; ranked portable fix delivered (`research/research.md` §4–§6) |
| Evidence citations | Pass | `factory.ts:284/352/417/609`, `shared/paths.ts:71`, `schema.ts:48`, `auto-select.ts:476`, `mk-spec-memory-launcher.cjs:343` cited and verified read-only |
| Code shipped | N/A | No code changed in this packet by design — the fix is deferred to a follow-on packet |


<!-- /ANCHOR:verification -->
---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **No code fix in this packet** — `auto` still resolves to `hf-local` on this host until the deferred (b)+(d) fix lands; the interim `EMBEDDINGS_PROVIDER=ollama` pin (applied separately) masks the symptom in the meantime.
2. **Interim pin is non-portable** — it hardcodes ollama and must be reverted to `auto` only after the follow-on fix ships and verifies.
3. **Silent-null anti-pattern persists** — `querySqliteScalar()` still swallows all errors to null; the follow-on fix should log probe failures or surface them in `memory_health`.
4. **Active-shard vs embed-provider mismatch risk** remains until fix (d)'s generic provider/shard resolution lands.

<!-- /ANCHOR:limitations -->

---

<!--
CORE TEMPLATE (~40 lines)
- Post-implementation documentation
- Created AFTER implementation completes
-->

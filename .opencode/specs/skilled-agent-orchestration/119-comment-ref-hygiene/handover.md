---
title: "Session Handover: MCP config alignment + embedding restart verification"
description: "Embedding restart verified (provider flipped to ollama); force re-embed reset applied; discovered daemon ignores tuned retry env; aligned 3 spec-kit MCP env blocks across all 7 configs to opencode.json canonical."
trigger_phrases:
  - "mcp config alignment handover"
  - "embedding restart verification handover"
  - "daemon env gap handover"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/119-comment-ref-hygiene"
    last_updated_at: "2026-05-28T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Verified embedding restart + reconcile; aligned 3 MCP env blocks across 7 configs; validated"
    next_safe_action: "Done — daemon-env gap fixed + backlog drained in 004 lane (2026-05-28, commit 845fe603d1)"
    blockers: []
    completion_pct: 100
---
# Session Handover Document

MCP config alignment (7 configs → one canonical) plus embedding restart verification and the discovery that the running daemon ignores the tuned retry env that the configs already hold.

<!-- SPECKIT_TEMPLATE_SOURCE: handover | v1.0 -->

---

<!-- ANCHOR:handover-summary -->
## 1. Handover Summary

- **From Session:** 2026-05-28 (claude-opus) — embedding verification → reconcile → MCP config alignment
- **To Session:** next session; the open follow-on is owned by the `004` embedding lane
- **Phase Completed:** VERIFICATION (embedding restart) + IMPLEMENTATION (config alignment, validated) + INVESTIGATION (daemon-env gap root-caused)
- **Handover Time:** 2026-05-28 · `split/028-code-graph-cocoindex` · config changes staged in working tree, NOT committed
<!-- /ANCHOR:handover-summary -->

---

<!-- ANCHOR:context-transfer -->
## 2. Context Transfer

### 2.1 Key Decisions Made
| Decision | Rationale | Impact |
|----------|-----------|--------|
| Force re-embed via `repairSuccessCoverage:true` | Operator chose it over letting the retry loop trickle | Reset 1646 success-missing-active-vector rows to retry; non-destructive |
| `opencode.json` is the canonical, not `.claude/mcp.json` | opencode.json is richest/most-current; aligning down to .claude would delete useful notes | All 7 configs aligned UP to opencode.json content |
| Config alignment ≠ behavior fix | Functional retry env was already identical everywhere; drift was `_NOTE_*` docs | Daemon runtime behavior unchanged by this work |
| Daemon-env gap handed to 004 lane | It touches the active embedding-investigation packets | Not patched here; documented below |

### 2.2 Blockers Encountered
| Blocker | Status | Resolution/Workaround |
|---------|--------|-----------------------|
| Running daemon ignores tuned `SPECKIT_RETRY_*` env (uses code defaults: cap 1000, batch 5, 5-min) though all configs hold tuned values | open | Launcher/lifecycle issue — env not reaching spawned daemon. 004 lane. |
| Standard `memory_embedding_reconcile` is a no-op post-restart | resolved | The stuck rows weren't vector-present-stale; used `repairSuccessCoverage:true` |
| mk-spec-memory MCP server disconnected mid-session (daemon died ~1–2GB RSS) | resolved | `/mcp` reconnect respawned it; provider stayed ollama |

### 2.3 Files Modified
| File | Change Summary | Status |
|------|----------------|--------|
| `opencode.json` | canonical base; added `_NOTE_8_FEATURE_FLAGS`; reordered CONTEXT_BUDGET | staged |
| `.claude/mcp.json`, `.gemini/settings.json` | aligned 3 server env blocks to canonical | staged |
| `.vscode/mcp.json`, `.devin/config.json` | replaced stale llama-cpp/Voyage notes + `_NOTE_AUTO_MIGRATION` with ADR-014 canonical | staged |
| `.codex/config.toml` | fixed duplicate `_NOTE_*_TOOLS` bug; normalized key order | staged |
| `.devin/config.local.json` (gitignored) | added missing `EMBEDDINGS_PROVIDER` + canonical notes; abs path preserved | edited (won't commit) |
| `119/implementation-summary.md` | follow-on log + continuity update | staged |
<!-- /ANCHOR:context-transfer -->

---

<!-- ANCHOR:next-session -->
## 3. For Next Session

### 3.1 Recommended Starting Point
- **File:** `.opencode/bin/mk-spec-memory-launcher.cjs` (env forwarding) + `shared/embeddings.ts:386` / `reindex.ts:441` (004-lane defects)
- **Context:** the configs are now aligned and correct; the remaining problem is purely that the daemon process doesn't receive/honor that env

### 3.2 Priority Tasks Remaining
1. **Root-cause the daemon-env gap:** compare the live daemon's environment (`ps eww <pid>`) against `.claude/mcp.json`'s `env` block. Determine whether the launcher bridges to a pre-existing daemon started without the env, or spawns the child with a sanitized env. Fix so `SPECKIT_RETRY_QUEUE_MAX_PENDING=300000`, `BATCH_SIZE=100`, `INTERVAL_MS=5000` actually reach the daemon.
2. **Then drain the backlog:** once the daemon honors the tuned env, the 1646 reset `retry` rows re-embed in minutes (no overflow-to-failed). Confirm via `memory_health()` (`embeddingRetry.queueDepth` → 0; breaker closed).
3. **004-lane code defects (from prior handover, still open):** `reindex.ts:441` pass `manifest.backend` to `setActiveEmbedder`; provider-singleton invalidation on active-pointer change (`shared/embeddings.ts:386`).

### 3.3 Critical Context to Load
- [ ] `_memory.continuity` in `implementation-summary.md` (canonical 119 state + config-alignment follow-on)
- [ ] This handover (config-alignment outcome + daemon-env gap)
- [ ] `retry-manager.ts` (pacing/retention: cap `MAX_RETRY_QUEUE_PENDING=1000`, batch 5, interval 5min defaults)
<!-- /ANCHOR:next-session -->

---

<!-- ANCHOR:validation-checklist -->
## 4. Validation Checklist

Before/after handover, verify:
- [x] Embedding provider flipped `hf-local` → `ollama`, healthy, circuit-breaker closed (this session)
- [x] All 7 configs: 3 spec-kit server env blocks byte-identical to opencode.json canonical (keys+values+order)
- [x] 6 JSON parse clean; `.codex/config.toml` parses (tomli) with no duplicate keys
- [x] `validate.sh --strict` on packet 119 PASSED (0 errors, 0 warnings)
- [x] RESOLVED (004 lane, 2026-05-28): daemon honors tuned retry env. Root cause was NOT launcher/lifecycle — it was a `context-server.ts` call-site override of the env-derived config. `ps eww` confirmed the env reaches the daemon.
- [x] RESOLVED (004 lane, 2026-05-28): embedding backlog drained to 0 retry/pending (28843 success; 22 genuine failures remain). Fix shipped in commit `845fe603d1`.
<!-- /ANCHOR:validation-checklist -->

---

<!-- ANCHOR:session-notes -->
## 5. Session Notes

**Embedding restart verified.** `memory_health()` confirmed `embeddingProvider.provider` flipped `hf-local` → `ollama` (`nomic-embed-text-v1.5`, 768d, healthy, breaker closed). The prior handover's restart prediction held.

**Reconcile reality.** The standard reconcile was a no-op post-restart (0 vector-present-stale rows). Operator chose `repairSuccessCoverage:true`, which reset 1646 `success`-but-missing-active-vector rows to `retry`. This is non-destructive (no vectors deleted; coverage can only improve). BUT the daemon's retry-manager runs code defaults (cap `MAX_RETRY_QUEUE_PENDING=1000`, batch 5, interval 5min): the retention sweep will mark ~657 overflow rows `failed` and the retained ~1000 drain over ~17h — UNLESS the daemon honors the tuned env.

**The core discovery.** Every config (`opencode.json`, `.claude/mcp.json`, `.codex/config.toml`, etc.) ALREADY holds the tuned env (cap 300000, batch 100, interval 5000, ~100yr max-age) — there was nothing to "tune." Yet the running daemon behaves with defaults. So the real gap is launcher/lifecycle (env not reaching the daemon), not config drift. Config alignment alone will not change runtime behavior.

**Config alignment shipped.** Aligned the 3 spec-kit MCP env blocks (`mk-spec-memory`, `mk_skill_advisor`, `mk_code_index`) to the `opencode.json` canonical across all 7 configs — now byte-identical (keys+values+order). Fixed: stale pre-ADR-014 llama-cpp/Voyage docs in `.vscode`/`.devin`; the `.codex` duplicate `_NOTE_*_TOOLS` bug; `.devin/config.local.json` missing `EMBEDDINGS_PROVIDER`; opencode.json missing `_NOTE_8`. Operator-confirmed note order: `_NOTE_CONTEXT_BUDGET` → `_NOTE_RETRY_TUNING` → `_NOTE_SOCKET`.

**Shared-tree discipline.** Repo under heavy concurrent multi-agent commits; the mk-spec-memory daemon died once (~1–2GB RSS) and code-graph MCP flapped. Scope every `git add`; nothing committed this session.
<!-- /ANCHOR:session-notes -->

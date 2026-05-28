---
title: "Session Handover: mk-spec-memory embedding restart + 119 close-out"
description: "Post-restart handover — verify the embedding provider repoints hf-local to ollama, plus 119 comment-hygiene + test-fix session state."
trigger_phrases:
  - "post restart handover"
  - "embedding provider restart"
  - "119 handover"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/119-comment-ref-hygiene"
    last_updated_at: "2026-05-28T08:10:00Z"
    last_updated_by: "claude-opus"
    recent_action: "embedding-mispoint-root-caused-119-shipped"
    next_safe_action: "restart-daemon-then-verify-provider-flips-to-ollama"
    blockers: ["embedding-provider-mispoint-pending-daemon-restart"]
    completion_pct: 90
---
# Session Handover Document

Post-restart handover for the mk-spec-memory embedding provider mispoint, plus close-out state for packet 119 (comment-ref hygiene + pre-existing test fixes).

<!-- SPECKIT_TEMPLATE_SOURCE: handover | v1.0 -->

---

<!-- ANCHOR:handover-summary -->
## 1. Handover Summary

- **From Session:** 2026-05-28 (claude-opus, packet 119 + embedding investigation)
- **To Session:** next session AFTER a full mk-spec-memory daemon restart
- **Phase Completed:** IMPLEMENTATION (119 shipped) + INVESTIGATION (embedding mispoint root-caused)
- **Handover Time:** 2026-05-28T08:10:00Z · Git `5431c0de48` on `split/028-code-graph-cocoindex`, in sync with `origin/main`, all work pushed
<!-- /ANCHOR:handover-summary -->

---

<!-- ANCHOR:context-transfer -->
## 2. Context Transfer

### 2.1 Key Decisions Made
| Decision | Rationale | Impact |
|----------|-----------|--------|
| Restart the daemon, not `/mcp` reconnect | Provider singleton does not retarget on reconnect (`shared/embeddings.ts:386`); launcher bridges to the existing lease holder (`mk-spec-memory-launcher.cjs:414`) | Only a full restart repoints hf-local to ollama |
| Embedding mispoint is SEPARATE from causal coverage | 28,472/28,504 rows embed fine; coverage (9.66%) is a causal-linking/backfill metric, not an embedding-failure one | A restart fixes the engine, NOT the coverage number |
| `[needs-owner]` code gaps left for the 004/006 lane | They touch the active embedding-investigation packets | Not patched here; documented below |
| spec-doc-structure validator left untouched | HIGH blast radius (feeds `memory-save` + `validate.sh`); the failure was fixture damage, not logic | Fixed the fixture instead |

### 2.2 Blockers Encountered
| Blocker | Status | Resolution/Workaround |
|---------|--------|-----------------------|
| Embedding provider mispoint (registry=ollama-ready, runtime=hf-local-unhealthy, circuit-breaker OPEN) | open | Needs full daemon restart (see §3) |
| Code graph went stale within seconds (concurrent multi-agent churn + post-commit hook) | open | Run `code_graph_scan` before any structural query; used Grep fallback |
| `codex auth status` subcommand invalid in installed version | resolved | OAuth confirmed via `~/.codex/auth.json` + codex ran successfully this session |

### 2.3 Files Modified
| File | Change Summary | Status |
|------|----------------|--------|
| `sk-code/references/**` + 12 echo sites | sk-code rule forbidding ephemeral refs in comments | complete (committed) |
| deep/system skills prod + test comments | ephemeral-ref cleanup (comments only) | complete (committed) |
| `shared/gate-3-classifier.ts` + test | speckit rename straggler + `:auto` broaden (`40183392bd`) | complete (dist rebuilt) |
| `scripts/.../valid-phase/spec.md` + `063.../implementation-summary.md` fixtures | restored packet-117-stripped anchors (`c6805196a7`, `4d9ff721c6`) | complete |
| `119/implementation-summary.md` | follow-on fixes log (8 fixed, 1 flagged) | complete |
<!-- /ANCHOR:context-transfer -->

---

<!-- ANCHOR:next-session -->
## 3. For Next Session

### 3.1 Recommended Starting Point
- **File:** run `memory_health()` first (no file) — verify embedding provider after restart
- **Context:** confirm the restart repointed the embedding engine before anything else

### 3.2 Priority Tasks Remaining
1. **Verify the restart worked:** `memory_health()` -> `embeddingProvider.provider` must flip `hf-local` to `ollama`, `healthy: true`, circuit-breaker not open. `embedder_list()` -> `ollama / nomic-embed-text-v1.5` stays active+ready. If still hf-local, the real daemon process was not killed (reconnect is not enough).
2. **Clear the ~32 stuck rows:** `memory_embedding_reconcile({ mode: "dry-run" })` (fail-closed); if correct, `{ mode: "apply" }`. Backlog is small: success 28,472 / retry 21 / failed 11.
3. **Hand `[needs-owner]` gaps to the 004/006 lane:** patch `reindex.ts:441` to pass `manifest.backend` to `setActiveEmbedder` (pointer saves name+dim, not provider); add provider-singleton invalidation on active-pointer change (`shared/embeddings.ts:386`).

### 3.3 Critical Context to Load
- [ ] `_memory.continuity` in `implementation-summary.md` (canonical 119 state; resume ladder reads here)
- [ ] Spec file: `spec.md` (119 comment-hygiene scope)
- [ ] This handover (embedding root cause + restart verification)
<!-- /ANCHOR:next-session -->

---

<!-- ANCHOR:validation-checklist -->
## 4. Validation Checklist

Before/after handover, verify:
- [x] All work committed + pushed (`5431c0de48`, in sync with `origin/main`)
- [x] `validate.sh --strict` on packet 119 PASSED (0 errors)
- [x] No breaking changes mid-implementation (all 8 fixed test files green in isolation)
- [ ] POST-RESTART: `memory_health()` shows provider flipped to ollama (the confirmation test)
- [ ] POST-RESTART: embedding backlog drained to 0 retry/failed via reconcile
<!-- /ANCHOR:validation-checklist -->

---

<!-- ANCHOR:session-notes -->
## 5. Session Notes

**Embedding root cause (codex gpt-5.5 high AI-council, 85% confidence).** Three reinforcing defects keep the runtime on the broken hf-local engine while `embedder_list` reports ollama: (1) the provider singleton never retargets after init (`shared/embeddings.ts:386`) and `/mcp` reconnect bridges to the existing lease holder (`mk-spec-memory-launcher.cjs:414`) — only a full restart repoints it; (2) reindex sets the active pointer with name+dim but no provider (`reindex.ts:441` -> `schema.ts:162` writes `''`), and `embedder_list` marks active by manifest name only (`embedder-list.ts:92`); (3) the retry loop is pinned to the failing runtime, opens after 5 failures, 120s cooldown -> flapping (`retry-manager.ts:391/422/713`). Empirical refinement (direct DB read): only ~32 rows are stuck (99.9% success), so impact is small and the prior `004` vector-status root cause is now stale.

**Do NOT conflate embedding with causal coverage.** Coverage (9.66% vs 60% target) is the causal-linking/backfill rate (1,968 edges / 28k memories), not embedding failure. The autonomous backfill raises it incrementally; a restart will not move it.

**Shared-tree discipline.** Repo is under heavy concurrent multi-agent commits to `main`. Never `git checkout`/revert files you did not author; scope every `git add`. Several foreign files (deep-ai-council, sk-git deletions, 030 packet, descriptions.json) were correctly left unstaged this session.

**119 scope reminder.** Comment-hygiene packet is COMPLETE (rule + prod/test cleanup, validate PASSED). The 8 test fixes were pre-existing failures found while validating; 3 traced to packet 117's anchor-comment strip damaging fixtures, 1 to packet 132's speckit rename. `retry-manager` T49 left flagged (self-deferred, needs DB fixtures, `004` lane).
<!-- /ANCHOR:session-notes -->

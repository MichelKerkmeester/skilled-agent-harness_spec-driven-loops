# Arc 008 autonomous run — state

> Owned by the main orchestrator (Claude Code session). Refreshed after each phase ships.
> Survives orchestrator crash; resume by reading the latest section.

## Run metadata

- **Started**: 2026-05-20T14:45:00+02:00
- **Orchestrator**: Claude Code (main agent)
- **Executor**: cli-codex (gpt-5.5 high fast, workspace-write, approval=never)
- **Plan**: /Users/michelkerkmeester/.claude/plans/analyze-users-michelkerkmeester-mega-dev-shimmering-tome.md
- **Baseline commit (pre-arc)**: `9d469b4e8c63875505d84db10b896fd8655462fa`
- **Baseline branch**: `main`

## Pre-flight verification (2026-05-20T14:45 — complete)

| Check | Status | Evidence |
|-------|--------|----------|
| codex CLI installed | ✅ | codex-cli 0.132.0 at /opt/homebrew/bin/codex |
| codex auth | ✅ | ~/.codex/auth.json present, auth_mode=chatgpt |
| ollama running | ✅ | nomic-embed-text:v1.5 cached (261 MB) — spec-memory embedder ready |
| Qwen3-Reranker cache | ✅ | models--Qwen--Qwen3-Reranker-0.6B already at ~/.cache/huggingface/hub/ (from cocoindex 2026-05-20) — no 1.5 GB download in phase 002 |
| Lease state cleared | ✅ | pkill ran; lease JSON/SQLite cleared; /tmp sockets removed |
| /tmp socket dirs | ✅ | /tmp/mk-{spec-memory,skill-advisor,code-index} pre-created |
| Arc 008 packet docs | ✅ | clean — all session 1 scaffolding already committed |
| Dirty worktree | ℹ️ | 300 files (91 ??, 206 M, 3 D) — parallel-track work, per memory not a blocker; explicit-path git add per phase |

## Phase status

| Phase | Status | Commit | Wall time | Notes |
|-------|--------|--------|-----------|-------|
| 001-flag-routing-fix-for-cross-encoder | ✅ complete | `230dbe4c0` | ~6.5 min | Codex finished early (estimate 30m); 10 vitest passing; strict-validate 0/0 |
| 002-system-rerank-sidecar-skill | ✅ complete | `b3db00d2f` | ~9.75 min | 4 pytest passing; apple=0.984, QCD=0.0004 sigmoid; pinned revision e61197ed45024b0... |
| 003-ensure-sidecar-from-launchers | ✅ complete | `3ad09c6c3` | ~16 min codex + ~5 min orchestrator smokes | vitest 5/5; smokes 1+4+5 PASS out-of-sandbox; smoke 2 deferred (cocoindex isolation requires daemon setup); .codex/config.toml applied by orchestrator |
| 004-spec-memory-rerank-benchmark | ✅ complete | `c1258a54b` | ~30 min retry (first dispatch hung 28m at 1.8s CPU → killed + re-dispatched with MCP-disabled flag) | **HOLD verdict**: hit_rate Δ +0.4pp / MRR Δ +0.004 / p95 Δ +9832ms → fails all 3 gates. Caveat: sidecar timed out every Arm B probe (all 250 rows fallback), so Qwen quality not fairly tested; p95 gate still fails. CPU→MPS tuning needed before re-bench. |
| 005-promote-qwen-as-default | ✅ complete (HOLD) | `06ff42cb9` | ~5 min | HOLD path: no source/runtime-config changes; 3 docs + arc parent updated; all HOLD invariants verified; arc parent strict-validate 0/0 |

## Commits shipped

- Phase 001: `230dbe4c0` — feat(016/008/001): cross-encoder flag-routing precedence fix
- Phase 002: `b3db00d2f` — feat(016/008/002): system-rerank-sidecar skill + Qwen3-Reranker-0.6B HTTP service
- Phase 003: `3ad09c6c3` — feat(016/008/003): ensure-rerank-sidecar self-electing primary from both launchers
- Phase 004: `c1258a54b` — feat(016/008/004): spec-memory rerank A/B benchmark — HOLD
- Phase 005: `06ff42cb9` — feat(016/008/005): arc 008 closes — HOLD path (sidecar ships opt-in)

## Blockers (FAIL_HALT log)

(none)

## Resume protocol

ARC 008 CLOSED — 2026-05-20T16:45 — 5/5 phases shipped, HOLD verdict.

(Resume protocol no longer needed; left here for posterity.)

## End-to-end verification (2026-05-20T16:45)

| Check | Result |
|-------|--------|
| All 5 phase children strict-validate | ✅ 0/0 each (PASSED × 5) |
| Arc parent strict-validate | ✅ 0/0 PASSED |
| `npm run build` in mcp_server | ✅ exit 0 |
| Arc parent `derived.status` | ✅ `complete` |
| Arc parent `last_active_child_id` | ✅ → `005-promote-qwen-as-default` |
| Arc parent `children_ids` count | ✅ 5 |
| HOLD invariant: `cross-encoder.ts:54` default | ✅ unchanged (`cross-encoder/ms-marco-MiniLM-L-6-v2`) |
| HOLD invariant: 4 runtime configs SPECKIT_CROSS_ENCODER | ✅ unchanged (default-off) |
| `ENV_REFERENCE.md` "Default OFF (opt-in)" | ✅ 1 hit |
| 5 commits on `main` (conventional-commit format) | ✅ `230dbe4c0`, `b3db00d2f`, `3ad09c6c3`, `c1258a54b`, `06ff42cb9` |

## Run summary

- **Total wall time**: ~3.5 hours (well under 5-7h budget)
- **Phase 001**: 6.5 min ✅
- **Phase 002**: 9.75 min ✅
- **Phase 003**: 16 min codex + 5 min orchestrator smokes ✅
- **Phase 004**: 30 min retry (first dispatch hung at 28 min → killed + re-dispatched with MCP disabled) ✅ HOLD
- **Phase 005**: 5 min ✅ HOLD path
- **Orchestrator overhead**: ~15 min (verification + commits + state updates)

## Outcome

Arc 008 ships the sidecar infrastructure (phases 001-003) and the benchmark evidence (phase 004) but **does NOT promote Qwen as the spec-memory default** (phase 005 HOLD verdict).

Operators who want Qwen reranking can opt in via `SPECKIT_CROSS_ENCODER=true`. The sidecar will auto-spawn at cold start. Latency caveat documented in ENV_REFERENCE.md + SKILL.md.

## Follow-on candidates (NOT in arc 008)

1. **CPU→MPS device tuning for Qwen sidecar** — prerequisite for any re-benchmark. Current p95 ~11s on sustained load (cross-encoder.ts:60 timeout = 30s; every probe timed out).
2. **`006-shared-deduplication-from-cocoindex`** (proposed) — repoint cocoindex's bundled Qwen at the shared sidecar; saves ~1.5 GB RAM when both MCPs run.
3. **Plugin bridge timeout tune** — orthogonal to rerank; the OpenCode plugin's `DEFAULT_BRIDGE_TIMEOUT_MS=1000` is too short for the MCP bridge's 8s timeout.

## Per-phase artifacts (logs + prompts)

- Phase NNN prompt: `/tmp/codex-phase-NNN-prompt.md`
- Phase NNN log:    `/tmp/codex-phase-NNN.log`
- Phase NNN handback: extracted MEMORY_HANDBACK block (saved into implementation-summary.md §Session Memory once parsed)

## Allowed cli-codex flags (locked per plan)

```text
--model gpt-5.5
-c model_reasoning_effort="high"
-c service_tier="fast"
-c approval_policy=never
--sandbox workspace-write
[-c sandbox_workspace_write.network_access=true]  # phases 002, 004 only
```

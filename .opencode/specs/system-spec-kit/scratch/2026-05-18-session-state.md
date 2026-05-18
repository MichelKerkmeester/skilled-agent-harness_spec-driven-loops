---
title: "Session state snapshot — 2026-05-18 ~19:50 UTC"
description: "Pre-compaction handover. Active background jobs, pending tasks, recent commits, key memory paths. POST-COMPACTION agent: read this FIRST."
trigger_phrases:
  - "resume 2026-05-18"
  - "post-compaction recovery"
  - "session state 2026-05-18"
  - "embedder migration session"
importance_tier: "important"
contextType: "general"
---

# Session State Snapshot — 2026-05-18 ~19:50 UTC

> **POST-COMPACTION AGENT: READ THIS FIRST.** Then read the documents in §2 in order. Do NOT take action until you've reconstructed state.

---

## 1. Mission

This session covers a long arc of MCP launcher concurrency work + an embedder migration that turned into a major memory-reduction win:

- **Arc 006 (`016/006-mcp-launcher-concurrency-arc`)** — fully closed across 8 phase children (001-008). All P0/P1/P2 findings reviewed and remediated through SWE-1.6 deep review + AI council + remediation packets.
- **Embedder migration** — discovered that ADR-012's jina-v3 production decision was half-shipped (vec_metadata flipped but factory.ts had no Ollama support). Wired it end-to-end in **commit `75b4391e3`** (phase `016/002/006-ollama-encode-path-wiring`). RSS dropped from **1080 MB → 246 MB (-70%)** on `context-server.js`.
- **Active follow-on (parallel session)**: `016/002/007-auto-embedder-selection-and-llama-cpp-purge` is being implemented RIGHT NOW by a separate cli-codex dispatch (PID 20832 — see §4).

---

## 2. Documents to read for full context (in order)

1. `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/006-mcp-launcher-concurrency-arc/spec.md` — phase parent for the launcher arc
2. `.../006-mcp-launcher-concurrency-arc/008-launcher-race-window-and-debug-log-hygiene/implementation-summary.md` — most recent arc-006 closeout
3. `.../002-spec-memory-stack/004-spec-memory-embedder-bake-off/decision-record.md` — ADR-012 production embedder decision
4. `.../002-spec-memory-stack/006-ollama-encode-path-wiring/implementation-summary.md` — the wiring that closed the half-migration
5. `.../002-spec-memory-stack/007-auto-embedder-selection-and-llama-cpp-purge/spec.md` — what's being implemented RIGHT NOW
6. `.../002-spec-memory-stack/005-context-server-memory-reduction-research/research/iterations/iteration-001.md` + `iteration-002.md` — the 2 completed deep-research iters
7. `.opencode/skills/system-spec-kit/references/memory/embedder_architecture.md` — canonical embedder architecture doc (sk-doc compliant; created in 006)

---

## 3. Recent commits on `main` (newest first)

```
bc8a196ca feat(016/002/007): scaffold auto-embedder-selection + llama-cpp purge packet  ← phase 007 just scaffolded by parallel session
75b4391e3 feat(016/002/006): wire OllamaAdapter into shared/embeddings factory — closes the half-migration  ← MINE this session
... [parallel-work commits intermixed]
0f5b5322c feat(006/008): close 2 P2 findings from 007 deep-review  ← MINE
... 
1644c6891 feat(006/006): close 6 P1+P2 from council  ← MINE earlier
65761c8fb feat(006/007): close skill-advisor zombie launcher root cause  ← MINE
bd8a90747 feat(006/005): close 13 P1 findings from deep-review  ← MINE
eca6e465b refactor(013→007): renumber ollama-and-bge-promotion-arc  ← MINE
7f4f5bfa4 refactor(012→006): renumber mcp-launcher-concurrency-arc  ← MINE
872b3be47 chore(deps): close 5 dependabot alerts  ← MINE
```

Full list: `git log -30 --oneline`. Local is in sync with origin/main as of the last push.

---

## 4. Background jobs running RIGHT NOW

### Job A — Deep-research 005 resume (MINE, dispatched ~19:46Z)

- **Driver PID**: `18513` (bash watchdog daemonized via python double-fork+setsid)
- **Codex worker PIDs**: `18551` (gtimeout wrapper), `18552` (codex exec)
- **Status when handover written**: iter 3/10 in flight (~3-5 min into a ~5-8 min iter at xhigh)
- **Iters already complete on disk**: 1, 2 (in `<phase 005>/research/iterations/iteration-001.md`, `iteration-002.md`)
- **Iters to go**: 3-10 (8 remaining)
- **Log**: `/tmp/deep-research-005-resume-dispatch-20260518-194615.log`
- **Driver script**: `/tmp/run-005-deep-research-resume.sh`
- **PID file**: `/tmp/deep-research-005-resume.pid`
- **Output dir**: `<phase 005>/research/iterations/`
- **Expected wall-clock**: ~40-65 min total for 8 iters

### Job B — Phase 007 implementation (PARALLEL session, dispatched by another agent ~19:45Z)

- **Codex PID**: `20832` (xhigh, fast, network-enabled)
- **Status**: end-to-end implementation of `016/002/007-auto-embedder-selection-and-llama-cpp-purge`
- **Scope**: precedence chain (Voyage → OpenAI → Ollama → hf-local → fail), purge llama-cpp surface (LlamaCppProvider, llama-cpp-availability.ts, embeddinggemma-300m manifest entry, node-llama-cpp from package.json)
- **Output**: 007 phase folder (already scaffolded in commit `bc8a196ca`) + factory.ts updates + new auto-select.ts + tests
- **DO NOT INTERFERE** — this is a parallel session's work; my role is to monitor not edit
- **Suspect log file**: not surfaced to me; can probe via `pgrep -fl 'codex exec.*xhigh.*007'`

### Job C — Embedder reindex (queued via MCP, running in Ollama)

- **Job ID**: `emb-swap-2026-05-18T19-38-28-209Z-53f34088`
- **Triggered by**: `mcp__mk-spec-memory__embedder_set({name: "jina-embeddings-v3"})`
- **Status when handover written**: `running`
- **Target**: re-encode all 9164 memory entries with jina-embeddings-v3 via Ollama → write to `vec_1024` table in `context-index__ollama__jina-embeddings-v3__1024.sqlite`
- **Probe progress**: `mcp__mk-spec-memory__embedder_status` (no jobId required; returns latest)

### Job D — Bench (PARALLEL session, NOT mine)

- **PID**: `96873` (per the parallel session's prompts)
- **Activity**: "4-candidate re-baseline indexing jina-code right now"
- **ETA**: 22-23h per the parallel session's notes
- **DO NOT INTERFERE** — totally separate concern (cocoindex-code bake-off, not spec-memory)

### Job E — MCP disconnect RCA (PARALLEL session, may have finished by now)

- **Codex PID was**: `11517` — investigating why `mk_code_index` and (previously) `mk-spec-memory` returned `-32000` after restart
- **Suspect root cause**: `code-graph/mcp_server/dist/index.js` is a 59-byte re-export shim → `import '../../dist/system-code-graph/mcp_server/index.js'` resolves to a file that may not exist
- **Output target**: `.../005-cross-cutting-quality/005-cocoindex-install-hygiene/scratch/mcp-disconnect-rca.md`
- **Verification command**: `pgrep -fl 'codex exec.*RCA'` — if gone, RCA is done; check the output md
- **POST-COMPACTION action**: read the RCA md if it exists; apply the recommended fix (read-only diagnosis only; main agent applies)

---

## 5. Scheduled wakeup

- **Fires at**: 21:56 (local time) / approximately 540s after handover write
- **Purpose**: report progress on Job A (deep-research) + Job E (MCP RCA), then apply MCP fix if RCA recommended one
- **Wakeup prompt verbatim**: "Status update: (1) deep-research 005 resume driver PID 18513 — report iters 3+/10 progress and new findings; (2) MCP disconnect RCA codex PID 11517 — check if it finished and report what it found, then apply the recommended fix if it's clear-cut."

---

## 6. User's last 3 instructions (verbatim)

1. **"do some pre-comapction prep so our tasks and mission last post compaction"** (current ask)
2. **"Focus on these two in parallel — mk_skill_advisor + mk_code_index MCPs disconnected; Phase 005 deep-research (context-server.js memory) — only iter 1+2 completed (2 of 10), killed during the jina investigation"**
3. **"skip" (re: dispatching cli-codex for auto-default embedder selection — user said skip)** ← BUT the parallel session went ahead and scaffolded phase 007 anyway via `bc8a196ca`. So 007 is being implemented despite the "skip" — possibly the user changed their mind via another session, or it's a different agent's interpretation.

---

## 7. Constraints + do-not list

- **Stay on `main`** — no feature branches. See memory `feedback_stay_on_main_no_feature_branches`.
- **DELETE not archive** — physical `rm -f`; never z_archive/.bak/.old. Memory `feedback_delete_not_archive_or_comment`.
- **No `git add -A`** without `git restore --staged .` first — explicit paths only. Memory `feedback_git_add_not_scope_strict`.
- **No `--no-verify`** on commits — hooks must pass.
- **Codex sandbox blocks `.git/index.lock`** — codex documents the explicit git-add list in `implementation-summary.md` "Commit Handoff" section, main agent commits on behalf. Memory `feedback_codex_git_index_lock_bounce`.
- **DO NOT** kill the running bench (PID 96873) — it's a 22-23h jina-code re-baseline; totally separate concern.
- **DO NOT** kill the parallel codex implementations (PIDs 18551/18552 = mine, 20832 = parallel session's phase 007 work) — let them finish.
- **DO NOT** touch `.opencode/.spec-kit/code-graph/database/` — code-graph daemon coordinates lease there.
- **DO NOT** delete the legacy `__llama-cpp__embeddinggemma__768.sqlite` (750 MB) until reindex Job C completes + new jina DB has 9164 rows.
- **`feedback_worktree_cleanliness_not_a_blocker`** — dirty worktree from parallel work is BASELINE state; never flag as concern.

---

## 8. Live system state checkpoints (for verification post-compaction)

```text
context-server.js — RSS dropped from 1080 MB → ~246 MB after commit 75b4391e3
  (verify with: ps -p $(pgrep -f context-server.js) -o pid,rss,command)

mk-spec-memory-launcher: PID 4790
mk-skill-advisor-launcher: PID 7711  
mk-code-index-launcher: PID 11634 (but MCP may still show -32000 — see Job E)
  (verify with: pgrep -fl 'mk-.*-launcher')

ollama list (should show 6 candidates from the 016/002/004 bake-off):
  jina-embeddings-v3, nomic-embed-text-v1.5, mxbai-embed-large, bge-m3, snowflake-arctic-embed2, bge-small-en-v1.5

ollama ps (should show jina hot from the recent embedder_set):
  hf.co/gaianet/jina-embeddings-v3-GGUF:Q4_K_M

Live DB:
  .opencode/skills/system-spec-kit/mcp_server/database/context-index__ollama__jina-embeddings-v3__1024.sqlite (new, ~12 MB pre-reindex; will grow to ~300-600 MB post-reindex)
  .opencode/skills/system-spec-kit/mcp_server/database/context-index__llama-cpp__unsloth-embeddinggemma-300m-gguf__768__q8.sqlite (LEGACY, 750 MB, rollback safety net; delete after Job C completes + verified)
```

---

## 9. Next safe action checklist (POST-COMPACTION)

1. **Re-read CLAUDE.md global** (post-compaction protocol).
2. **Read §2 documents** in this snapshot's reading order.
3. **Verify Job A is still alive**: `pgrep -fl 'run-005-deep-research-resume'`. If dead, restart from where iter files leave off (check `ls <phase 005>/research/iterations/`).
4. **Check if scheduled wakeup at 21:56 already fired** — look for its consequences (was a status report given?).
5. **Check Job B (phase 007 implementation)** — has it finished? Look for new commits matching `feat(016/002/007)` on main. If finished + needs commit handoff, find the implementation-summary.md and follow its Commit Handoff section.
6. **Check Job E (MCP RCA)** — if `.../005-cross-cutting-quality/005-cocoindex-install-hygiene/scratch/mcp-disconnect-rca.md` exists with diagnosis + fix, apply the fix.
7. **Job C reindex**: query `mcp__mk-spec-memory__embedder_status` — if `completed`, verify the new DB has ~9164 rows in `vec_1024`; once verified, delete the legacy 750 MB DB.
8. **Save memory** (`/memory:save` → `<phase 005>` or another active packet) to persist what's actually done.
9. **Push** any commits the main agent made on behalf of codex.

---

## 10. Key files modified this session

Source code:
- `.opencode/skills/system-spec-kit/shared/embeddings/factory.ts`
- `.opencode/skills/system-spec-kit/shared/embeddings/providers/ollama.ts` (NEW)
- `.opencode/skills/system-spec-kit/shared/embeddings/profile.ts`
- `.opencode/bin/mk-skill-advisor-launcher.cjs`
- `.opencode/bin/mk-code-index-launcher.cjs`
- `.opencode/bin/mk-spec-memory-launcher.cjs`
- `.opencode/skills/system-skill-advisor/mcp_server/lib/daemon/lease.ts`
- `.opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts`
- `.opencode/skills/system-skill-advisor/mcp_server/tests/launcher-lease.vitest.ts`
- `.opencode/skills/system-skill-advisor/mcp_server/tests/launcher-bootstrap.vitest.ts`
- `.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts`
- `.opencode/skills/system-spec-kit/mcp_server/tests/launcher-lease.vitest.ts`
- `.opencode/skills/system-spec-kit/mcp_server/tests/embedder-ollama.vitest.ts`

References:
- `.opencode/skills/system-spec-kit/references/memory/embedder_architecture.md` (NEW, sk-doc compliant)
- `.opencode/skills/system-spec-kit/references/memory/embedding_resilience.md`
- `.opencode/skills/system-spec-kit/SKILL.md`
- `.opencode/skills/system-spec-kit/shared/embeddings/providers/README.md`
- `.opencode/skills/system-skill-advisor/references/daemon-lease-contract.md`

Spec folders (entire packets):
- `016/006-mcp-launcher-concurrency-arc/005-lease-correctness-and-arc-traceability/`
- `016/006-mcp-launcher-concurrency-arc/006-lease-canonicalization-and-cleanup-ordering/`
- `016/006-mcp-launcher-concurrency-arc/007-skill-advisor-zombie-launcher-fix/`
- `016/006-mcp-launcher-concurrency-arc/008-launcher-race-window-and-debug-log-hygiene/`
- `016/002-spec-memory-stack/005-context-server-memory-reduction-research/` (NEW, in-progress; iters 1+2 done, 3-10 in flight)
- `016/002-spec-memory-stack/006-ollama-encode-path-wiring/` (NEW)
- `016/002-spec-memory-stack/007-auto-embedder-selection-and-llama-cpp-purge/` (NEW, scaffolded by parallel session, implementation in flight)

Renames:
- `016/012-mcp-launcher-concurrency-arc/` → `016/006-mcp-launcher-concurrency-arc/`
- `016/013-ollama-and-bge-promotion-arc/` → `016/007-ollama-and-bge-promotion-arc/`

---

## 11. Notes for the post-compaction agent

- The recurring 5-10 min wakeup loop the user wanted for "status updates" — keep that going via `ScheduleWakeup` until Job A finishes or the user says stop.
- If a wakeup fires and there's nothing meaningful to report yet, schedule the next one (don't spam status messages).
- The user may legitimately want a `/clear` if compaction count exceeds 2 — recommend it per CLAUDE.md guidance.
- Memory entry `project_006_launcher_concurrency_arc_complete.md` in `~/.claude/projects/.../memory/` already captures the arc 006 work; this session adds 005 + 006 + 007 of the spec-memory-stack arc on top.

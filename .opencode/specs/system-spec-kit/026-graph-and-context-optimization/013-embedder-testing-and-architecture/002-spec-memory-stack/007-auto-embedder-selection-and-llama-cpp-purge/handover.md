---
title: "Handover: 016/002/007 — pre-compaction state snapshot 2026-05-18 21:50 PM"
description: "Session handover capturing all in-flight work, recent commits, hard constraints, and the next safe action. Read this FIRST after any compaction event; do not assume the compaction summary's implied next steps."
trigger_phrases:
  - "016/002/007 handover"
  - "session handover 2026-05-18 evening"
  - "post-compaction recovery snapshot"
  - "embedder packet handover"
importance_tier: "important"
contextType: "handover"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/002-spec-memory-stack/007-auto-embedder-selection-and-llama-cpp-purge"
    last_updated_at: "2026-05-18T19:50:00Z"
    last_updated_by: "main_agent"
    recent_action: "Pre-compaction handover authored; 3 backgrounds in flight"
    next_safe_action: "Wait for cli-codex 007 (PID 20832) Commit Handoff; review + git add per its path list + commit"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000002007"
      session_id: "016-002-007-handover"
      parent_session_id: "016-002-007"
    completion_pct: 0
---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

This is the top recovery document for the active session as of **2026-05-18 21:50 PM local**. Three backgrounds are running:

1. **CocoIndex 4-candidate re-baseline bench** (PID 96873) — code-embedder re-bench against the corrected post-install-hygiene pipeline; ETA ~22:58 PM
2. **cli-codex MCP-disconnect RCA** (PID 11517) — read-only investigation into why mk_code_index + mk-spec-memory disconnected from Claude after the 75b4391e38 commit; will write `mcp-disconnect-rca.md` to the install-hygiene packet's scratch dir
3. **cli-codex 007 auto-embedder-selection + llama-cpp purge** (PID 20832, just dispatched) — end-to-end implementation of this packet; will return a Commit Handoff for main agent to apply

User has been adding 5-min cron status checks (`*/5 * * * *`, job ID `83ae8204`) since 21:00 PM. Cron prompt references stale paths from the prior single-candidate bench; the *meaning* is "give me a tight status of bench + parallel work + daemon state every 5 min".

**Next safe action for a fresh agent:** wait for cli-codex 007 to return; the Commit Handoff in `implementation-summary.md` will list exact paths for `git add` + commit. Do NOT manually re-implement the work — codex is mid-execution.
<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:active-backgrounds -->
## 2. ACTIVE BACKGROUNDS — PIDs + LOG PATHS

### Bench: 4-candidate code-embedder re-baseline
- **PID:** 96873 (bash) → PID 96947 (`ccc index`) → PID 75190 was prior daemon; check fresh on resume
- **Started:** 2026-05-18 21:18 PM
- **Log:** `/tmp/bench-rebaseline-1779131901.log` (find latest: `ls -t /tmp/bench-rebaseline-*.log | head -1`)
- **Candidates:** `jina-code → gemma → nomic-CodeRankEmbed → bge-code-v1` (4 sequential, ~25 min each)
- **Status at 21:50:** jina-code mid-indexing (candidate 1/4)
- **ETA:** ~22:58 PM full completion
- **Output:** CSV at `.opencode/specs/.../016/004/004-extended-bake-off/evidence/cocoindex-embedder-comparison-with-hybrid-rerank.csv` (1 row per candidate as they complete); per-probe JSONL at `cocoindex-embedder-comparison-with-hybrid-rerank.jsonl`
- **Decision packet:** when done, write the corrected `benchmark_report.md` + PROMOTE/HOLD decision in `016/007/003-bge-code-v1-confirmation-and-promote/`. Promote rule: bge-code-v1 wins by ≥2 pairs over next-best AND fails at <2 of probes 3/10/14/18.
- **Critical:** the bench launched with `PATH=local-venv-first` so its `ccc` resolves to the editable local-venv install (has `reranker.py` etc.). DO NOT kill it.

### cli-codex MCP-disconnect RCA
- **PID:** 11517
- **Started:** ~21:40 PM
- **Log:** `/tmp/codex-mcp-rca/output.log`
- **Output target:** `016/005-cross-cutting-quality/005-cocoindex-install-hygiene/scratch/mcp-disconnect-rca.md`
- **Read-only:** investigation only; no code changes
- **Status at 21:50:** ~10 min elapsed; reading launcher internals
- **What it's diagnosing:** `mk_code_index` and `mk-spec-memory` MCP servers returned `-32000` JSON-RPC errors at session reconnect. Hypothesis: stale dist build vs source after 75b4391e38, OR launcher zombie pattern not fixed (skill-advisor got the fix in 65761c8fb3 but spec-memory + code-index may not have).
- **When done:** main agent reviews `mcp-disconnect-rca.md` and applies the recommended fix (separately from the 007 packet)

### cli-codex 007 auto-embedder-selection (THE primary in-flight work)
- **PID:** 20832
- **Started:** 21:50 PM
- **Log:** `/tmp/codex-007-auto-embedder/output.log`
- **Sandbox:** workspace-write + `sandbox_workspace_write.network_access=true` (needs Voyage/OpenAI/Ollama probes)
- **Model:** gpt-5.5 xhigh fast
- **Scope:** see `spec.md` §3; in summary — implement 4-tier auto-select (Voyage > OpenAI > Ollama > hf-local), purge llama-cpp surface, persist to vec_metadata, write tests, update docs, emit Commit Handoff
- **Expected wall:** 30-60 min
- **When done:** main agent reads `implementation-summary.md` → `## Commit Handoff` section → `git restore --staged .` → `git add <exact paths>` → commit with the subject codex provided

### Other parallel codex tracks (NOT MINE — autonomous session work)
- PID 18551/18552: another `codex exec gpt-5.5 xhigh` from earlier; separate workstream. Leave alone.
<!-- /ANCHOR:active-backgrounds -->

---

<!-- ANCHOR:recent-commits -->
## 3. RECENT COMMITS — last ~6h on main

```
bc8a196ca feat(016/002/007): scaffold auto-embedder-selection + llama-cpp purge packet      ← just shipped (this packet's scaffold)
75b4391e3 feat(016/002/006): wire OllamaAdapter into shared/embeddings factory — closes the half-migration  ← predecessor; cut RSS 1080 → 246 MB
aef1a0a65 feat(016/004): scaffold 011-rerank-model-fit + 012-fixture-audit packets         ← research-only follow-on scaffolds
b9993c0f1 docs(016/004,016/007): scope-change 007/003 + erratum on May 18 baseline         ← rescoped 007/003 to 4-candidate re-baseline + flagged May 18 invalidation
95c7aacfe data(007/003): rerank score JSONL + pre-confirmation margin analysis             ← key finding: rerank-firing destroys May 18 11/18 → 10/18 with 4 unique-win flips
339387694 fix(016/005/005): cocoindex pipx install hygiene + harness CCC resolution         ← pipx editable + $CCC harness pin
9282c6e64 docs(016): note skill-local benchmark promotion across 4 bench-producing specs
a0f3e84d2 feat(016/007): rerank instrumentation + 001 research + 002 spec docs + sk-doc reference refocus
3770f3ed2 docs(016/002,016/013): rename to discoverable slugs + add benchmark-results.md   ← bake-off folder renamed
1a03fd5f9 feat(016/005/004): skill-local benchmarks/ format + first two adopters
```

013 was renumbered to 007 during the session — use `016/007/...` paths, NOT `016/013/...` (memory: paths corrected throughout).
<!-- /ANCHOR:recent-commits -->

---

<!-- ANCHOR:user-recent-directives -->
## 4. USER'S RECENT DIRECTIVES (verbatim preserved)

In order from oldest to most recent:

1. **"Work on Recommended next steps (revised) 1. Scrap the 3-run ... 2. Re-baseline all 4 candidates ... 3. Update 016/004/004 ... 4. Investigate rerank model fit 5. Optional fixture audit"** → DONE (steps 1, 3, 4, 5 shipped; step 2 = the bench in flight)

2. **"Create new phase / Delete all remnants of llama-cpp and make sure embeddinggemma-300 is not active by default anymore. ollama is always fallback. but we need a smart auto system, like check api key > voyage > ollama > hf local etc stuff like that / Utilize gpt 5.5 xhigh fast agents"** → 007 packet scaffolded; cli-codex gpt-5.5 xhigh fast dispatched PID 20832

3. **"do some pre-compaction prep so our tasks and mission last post compaction"** ← CURRENT TASK (this handover doc IS the prep)

### Hard constraints from this session (do NOT violate post-compaction)

- **Stay on main** — no feature branches (memory: `feedback_stay_on_main_no_feature_branches`)
- **Don't kill the bench** at PID 96873 — it's measuring the corrected pipeline
- **Don't delete the legacy `__llama-cpp__embeddinggemma__768.sqlite`** (~750 MB) automatically — codex documents the path; deletion is gated on operator confirmation
- **Don't physically delete the embeddinggemma GGUF in `~/.cache/`** — same, operator-gated
- **Don't touch the cocoindex-code skill** (different MCP) when working on 007 — strictly scoped to system-spec-kit
- **Codex sandbox blocks `.git/index.lock`** — codex emits Commit Handoff; main agent runs `git add` + `git commit`
- **Strict-scope commits** — always `git restore --staged .` before adding explicit paths (memory: `feedback_git_add_not_scope_strict`)
- **Use `_memory:save` with `generate-context.js`** for full saves (not raw `Write` to memory files)
- **DELETE not archive** for cleanup work (memory: `feedback_delete_not_archive_or_comment`)
- **Pipx editable required** — `pipx install --force --editable .../mcp_server` so `direct_url.json` shows `editable: true`
- **Bench harness `$CCC` variable** — resolves local-venv first, PATH fallback (per 016/005/005)
<!-- /ANCHOR:user-recent-directives -->

---

<!-- ANCHOR:active-packets-graph -->
## 5. ACTIVE PACKETS (cross-link map)

```
013-embedder-testing-and-architecture/
├── 002-spec-memory-stack/                    (TEXT side — Ollama + jina-v3 production per ADR-012)
│   ├── 004-spec-memory-embedder-bake-off/   (6-candidate bake-off shipped May 17; ADR-012 winner = jina-v3 + rescue)
│   ├── 006-ollama-encode-path-wiring/       (just shipped — wired OllamaProvider into factory; -834 MB RSS)
│   └── 007-auto-embedder-selection-and-llama-cpp-purge/   ← THIS PACKET, codex in flight
├── 004-code-index-stack/                     (CODE side — sbert backend, CocoIndex)
│   ├── 004-extended-bake-off/               (May 18 morning bench; 11/18 result INVALIDATED by reraking analysis — see Section 0 ERRATUM in benchmark-results.md)
│   ├── 011-rerank-model-fit-investigation/  (research-only scaffold; not started)
│   └── 012-fixture-audit-10-probes/          (research-only scaffold; not started)
├── 005-cross-cutting-quality/
│   ├── 004-skill-local-benchmarks-format/   (skill-local benchmarks/ format convention shipped)
│   └── 005-cocoindex-install-hygiene/       (pipx editable + harness $CCC pin shipped; scratch/ may receive MCP RCA from codex)
└── 007-ollama-and-bge-promotion/
    ├── 001-indexer-surface-investigation/   (research shipped)
    ├── 002-cocoindex-ollama-adapter/        (mostly shipped via overnight commit)
    ├── 003-bge-code-v1-confirmation-and-promote/   (rescoped to 4-cand re-baseline; bench in flight; will get corrected benchmark_report.md when bench done)
    └── 004-newer-text-embedders-survey/     (research-only; not started; bge-m3 already known-lost per ADR-007)
```

**Currently most-active threads:**
- 007 (this packet) — auto-select implementation in flight
- 007/003 — 4-candidate re-baseline bench in flight
- 005/005 scratch — MCP RCA in flight

**Stack distinction (do NOT confuse):**
- mk-spec-memory uses Ollama backend, `jina-embeddings-v3` (1024d, text-tuned)
- mcp-coco-index uses sentence-transformers (sbert) backend, currently `jina-embeddings-v2-base-code` (768d, code-tuned). Different "jina" model.
<!-- /ANCHOR:active-packets-graph -->

---

<!-- ANCHOR:cron-state -->
## 6. CRON STATE

- **Job ID:** `83ae8204`
- **Schedule:** `*/5 * * * *` (every 5 minutes)
- **Mode:** session-only (in-memory, dies with Claude session)
- **Auto-expires:** 7 days
- **Cancel:** `CronDelete(id='83ae8204')` if needed
- **Prompt body:** the cron's status-check prompt still references stale paths (`bench-instrumented-retry-*.log`, PID 51081 — that's the prior single-candidate bench, since killed). The cron's intent is healthy: "give me tight status of bench + parallel work + daemon state every 5 min". A fresh agent can substitute the actual file paths from §2 above when responding.
- **Stop condition for cron:** the user can ask to delete it explicitly, OR after the in-flight work all completes
<!-- /ANCHOR:cron-state -->

---

<!-- ANCHOR:next-safe-action -->
## 7. NEXT SAFE ACTION

**Wait + monitor.** Three threads are autonomous; check periodically (the 5-min cron does this):

1. When **PID 20832 (007 codex)** exits:
   - Read `/tmp/codex-007-auto-embedder/output.log` final report
   - Read `implementation-summary.md` → find `## Commit Handoff` section
   - `git restore --staged .` (strict scope)
   - `git add <paths from Commit Handoff>` exactly
   - `git commit -m "<subject from Commit Handoff>"`
   - Run the verification gates from spec.md §verification

2. When **PID 11517 (MCP RCA codex)** exits:
   - Read `mcp-disconnect-rca.md` in install-hygiene scratch/
   - Apply the recommended fix per its diagnosis
   - Commit separately (this is hygiene, not part of 007)

3. When **PID 96873 (bench)** exits ~22:58:
   - Read CSV — 4 rows, one per candidate
   - Write corrected `benchmark_report.md` in `016/007/003-bge-code-v1-confirmation-and-promote/`
   - Apply the new PROMOTE/HOLD rule per `007/003/spec.md` §3-6
   - If PROMOTE: edit `cocoindex_code/config.py:11` `_DEFAULT_MODEL` + registry + docs
   - Commit

Do NOT preempt these. If a fresh agent picks up post-compaction without prior context, the codex output logs + this handover are the authoritative state.
<!-- /ANCHOR:next-safe-action -->

---

<!-- ANCHOR:resume-commands -->
## 8. RESUME COMMANDS (for a fresh agent)

```bash
# Verify which backgrounds are still alive
ps -ef | grep -E "codex exec|run-extended-bake-off|ccc index" | grep -v grep

# Check 007 codex output
tail -50 /tmp/codex-007-auto-embedder/output.log

# Check MCP RCA codex output
tail -50 /tmp/codex-mcp-rca/output.log

# Check bench progress
tail -10 $(ls -t /tmp/bench-rebaseline-*.log | head -1)
cat .opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/004-code-index-stack/004-extended-bake-off/evidence/cocoindex-embedder-comparison-with-hybrid-rerank.csv

# Verify pipx is editable (post-install-hygiene fix)
cat /Users/michelkerkmeester/.local/pipx/venvs/cocoindex-code/lib/python3.11/site-packages/cocoindex_code-*.dist-info/direct_url.json
# Expected: {"dir_info": {"editable": true}, "url": "file://.../mcp_server"}

# Read this handover
cat .opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/002-spec-memory-stack/007-auto-embedder-selection-and-llama-cpp-purge/handover.md

# Run /spec_kit:resume to get the standard recovery flow
# OR proceed directly per Section 7 ("Next Safe Action")
```
<!-- /ANCHOR:resume-commands -->

---

<!-- ANCHOR:related -->
## 9. RELATED RESOURCES

- **Predecessor packet (just shipped):** `../006-ollama-encode-path-wiring/implementation-summary.md`
- **Production decision:** `../004-spec-memory-embedder-bake-off/decision-record.md` ADR-012
- **In-flight bench packet:** `../../007-ollama-and-bge-promotion/003-bge-code-v1-confirmation-and-promote/`
- **Pre-confirmation margin analysis** (the May 18 invalidation finding): `../../007-ollama-and-bge-promotion/003-bge-code-v1-confirmation-and-promote/pre-confirmation-margin-analysis.md`
- **Install hygiene fix** (made the bench production-truthful): `../../005-cross-cutting-quality/005-cocoindex-install-hygiene/`
- **Skill-local benchmark convention:** `../../005-cross-cutting-quality/004-skill-local-benchmarks-format/`
- **Risk analysis (rerank non-determinism, now upgraded to "structural failure"):** `../../004-code-index-stack/004-extended-bake-off/risk-analysis-rerank-nondeterminism.md`
- **Embedder architecture canonical doc:** `../../../../shared-or-skill-tree-equivalent` → look at `.opencode/skills/system-spec-kit/references/memory/embedder_architecture.md` (created in 006; 007 will update it)
<!-- /ANCHOR:related -->

---
title: "Implementation Plan: Robust embedding-provider auto-resolution (ollama-first)"
description: "Plan for the research deliverable plus the planned-but-deferred (b)+(d) code fix that makes EMBEDDINGS_PROVIDER=auto resolve the active local embedder portably."
trigger_phrases:
  - "embedder provider auto resolution plan"
  - "factory better-sqlite3 probe fix plan"
  - "active embedder provider generic resolution"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/008-embedder-provider-auto-resolution"
    last_updated_at: "2026-05-27T14:30:00Z"
    last_updated_by: "main_agent"
    recent_action: "authored-plan-for-research-deliverable-plus-deferred-bd-code-fix"
    next_safe_action: "open-follow-on-packet-to-implement-bd-fix-via-speckit-plan-implement"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/shared/embeddings/factory.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/embedders/schema.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000108"
      session_id: "embedder-auto-resolution-008"
      parent_session_id: null
    completion_pct: 60
    open_questions: []
    answered_questions:
      - "Exact reason resolveActiveOllamaEmbedder() returns null: sqlite3 PATH dependency in querySqliteScalar"
      - "Most robust portable fix: (b) better-sqlite3 read + (d) generic active_embedder_provider resolution"
---
# Implementation Plan: Robust embedding-provider auto-resolution (ollama-first)

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (Node.js, mk-spec-memory MCP server) |
| **Framework** | better-sqlite3 (existing server dependency), embeddings factory cascade |
| **Storage** | SQLite vector shards (`context-vectors__<provider>__<model>__<dim>.sqlite`) |
| **Testing** | Node test harness + a launch-context regression simulating a `sqlite3`-less PATH |

### Overview
This packet's delivered "implementation" is the **deep-research deliverable** (`research/research.md`): root cause proven with code citations and a ranked, portable fix recommendation. The code fix itself is **planned but NOT implemented here** — it is deferred to a follow-on `/speckit:plan` + `/speckit:implement` packet. The recommended approach is **(b)+(d)**: replace the factory's `sqlite3` shell-out metadata probe with a Node SQLite read via `better-sqlite3` (already a server dependency, reusing `shared/paths.ts` db-dir resolution), AND honor `active_embedder_provider` generically by building the shard path from provider/model/dim instead of the hardcoded ollama pattern. This removes the daemon `PATH` dependency (the proven root cause) and the ollama-only assumption while keeping the cascade portable for non-ollama hosts.


<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met (research deliverable: root cause proven + ranked portable fix)
- [x] Tests passing (if applicable) (N/A — no code shipped in this packet; verification = research convergence)
- [x] Docs updated (spec/plan/tasks)


<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Local-first provider cascade (`ollama → hf-local → openai → voyage`) resolved inside the embeddings factory at daemon startup.

### Key Components
- **`querySqliteScalar()` / `tableExistsInSqlite()`** (`factory.ts:284`): metadata probes — currently shell out to a bare `sqlite3` binary and swallow every error (including `ENOENT`) to `null`. This is the proven failure point.
- **`readActiveOllamaEmbedderFromDb()`** (`factory.ts:352`): consumes the probes; returns null when they fail.
- **`resolveActiveOllamaEmbedder()`** (`factory.ts:417`): ollama-preference resolver; null result skips ollama in the cascade.
- **`resolveProvider()`** (`factory.ts:609`): the cascade that falls through to the `hf-local` fallback when ollama resolves null.
- **`schema.ts`** (`mcp_server/lib/embedders/schema.ts:48`): home of `active_embedder_provider`, the generic provider signal fix (d) will honor.

### Data Flow (planned post-fix)
1. Daemon starts with `EMBEDDINGS_PROVIDER=auto`; no explicit override branch taken.
2. Factory resolves the canonical DB dir via `shared/paths.ts` (no `sqlite3` subprocess).
3. Active-provider metadata read with `better-sqlite3` (in-process, PATH-independent).
4. If `active_embedder_provider` is present, resolve that provider generically and construct the shard path from provider/model/dim.
5. Non-ollama hosts with no active provider still fall through the existing bootstrap cascade (`auto-select.ts:476`).
6. The interim `EMBEDDINGS_PROVIDER=ollama` config pin is reverted to `auto`.


<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Research (DONE in this packet)
- [x] Dispatch cli-codex gpt-5.5 high investigation (read-only)
- [x] Prove root cause with `file:line` evidence (sqlite3 PATH dependency → silent null)
- [x] Rank candidate fixes by robustness + portability; synthesize `research/research.md`

### Phase 2: Code Implementation (DEFERRED — follow-on packet, NOT done here)
- [ ] Swap factory metadata probes from `execFileSync('sqlite3', …)` to a `better-sqlite3` read (`factory.ts:284`), reusing `shared/paths.ts:71` db-dir resolution
- [ ] Add `active_embedder_provider`-aware generic resolution; build shard path from provider/model/dim (`schema.ts:48`, `factory.ts:385`)
- [ ] Add a regression test simulating a daemon `PATH` without `sqlite3`
- [ ] Revert the interim `EMBEDDINGS_PROVIDER=ollama` config pin to `auto` (launcher/MCP config)

### Phase 3: Verification (DEFERRED — follow-on packet)
- [ ] Launch with `EMBEDDINGS_PROVIDER=auto`, a `PATH` excluding `/usr/bin` (sqlite3 unreachable), and no `MEMORY_DB_PATH`/`SPEC_KIT_DB_DIR`
- [ ] Confirm `memory_health.embeddingProvider.provider === "ollama"`
- [ ] Confirm the active shard resolves to `context-vectors__ollama__nomic-embed-text-v1.5__768.sqlite`


<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Research convergence | Root cause proven + ranked portable fix with citations | cli-codex gpt-5.5 high (read-only), peer review of `research.md` |
| Regression (deferred) | Provider resolution with a `sqlite3`-less daemon PATH | Node test harness simulating restricted PATH |
| Integration (deferred) | `auto` resolves ollama end-to-end | `memory_health.embeddingProvider.provider` assertion + shard-path check |


<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `better-sqlite3` | External (already a server dep) | Green | Cannot remove the sqlite3 subprocess; root cause persists |
| `shared/paths.ts` db-dir resolution | Internal | Green | Cannot reuse canonical DB path resolution |
| `active_embedder_provider` (schema.ts) | Internal | Green | Cannot honor provider generically (fix d) |
| Follow-on `/speckit:plan` + `/speckit:implement` | Process | Pending | Code fix remains unshipped (by design for this research packet) |


<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The deferred (b)+(d) fix regresses provider resolution on any host, or breaks the cascade for non-ollama hosts.
- **Procedure**:
  1. Revert the follow-on implementation commits (factory.ts probe swap + generic resolution).
  2. Re-apply the interim `EMBEDDINGS_PROVIDER=ollama` config pin as the stopgap (it works because the explicit-override branch short-circuits before the broken probe).
  3. This research packet itself (research.md + spec/plan/tasks docs) requires no rollback — it ships no code.

<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->

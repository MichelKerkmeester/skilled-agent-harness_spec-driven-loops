---
title: "Feature Specification: Memory search Clusters 4-7 remediation [system-spec-kit/026-graph-and-context-optimization/003-continuity-memory-runtime/006-fix-memory-search-health-fallback-stability/spec]"
description: "Close the 13 P1/P2 defects catalogued by phase 005 (REQ-005..017) under Clusters 4-7: causal-stats output hygiene, state hygiene, folder discovery + channel health, quality fallback + edge growth. Add CocoIndex daemon health probe (REQ-012) to memory_health and formalize the 20-paraphrase intent-classifier stability corpus (REQ-016). Three Cluster 1-3 P0 fixes already shipped in 005."
trigger_phrases:
  - "memory search clusters 4-7 remediation"
  - "causal-stats output hygiene fix"
  - "memory state hygiene"
  - "folder discovery weak signal"
  - "quality fallback fts5 bm25 grep"
  - "intent classifier stability corpus"
  - "cocoindex daemon health probe"
  - "026/003/006 packet"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/001-continuity-memory-runtime/006-fix-memory-search-health-fallback-stability"
    last_updated_at: "2026-05-08T21:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Scaffolded Level 2 spec; 13 deferred reqs mapped to 4 clusters with file-path change surfaces"
    next_safe_action: "Complete remediation packet"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-causal-stats.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-context.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-health.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/intent-classifier.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/folder-discovery.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/query-router.ts"
      - ".opencode/commands/memory/search.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "memory-clusters-4-7-2026-05-08"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Feature Specification: Memory search Clusters 4-7 remediation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-05-08 |
| **Branch** | `main` |
| **Predecessor** | `005-memory-search-runtime-bugs/` (audit + Cluster 1-3 P0 fixes) |
| **Successor** | None planned |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Phase 005 audited `/memory:search` against the indexed-continuity runtime and catalogued 17 defects spanning retrieval, output rendering, and the causal-graph subcommand. Cluster 1 (truncation), Cluster 2 (intent classifier), and Cluster 3 (rendering vocabulary) shipped P0 fixes in-phase. The remaining 13 P1/P2 defects across Clusters 4-7 were deferred to a follow-up packet, alongside a deferred CocoIndex daemon health probe (REQ-012, contingent on the daemon being runnable) and the deferral of formalizing the 20-paraphrase stability corpus (REQ-016, currently informal at `intent-classifier.vitest.ts:T060`). The result today: memory search works, but operators see noisy causal-stats output, leaked stale state across calls, weak-signal folder bindings, missing 3-tier FTS fallback on quality drops, and silent CocoIndex daemon failures.

### Purpose

Close all 13 deferred P1/P2 defects systematically, surface CocoIndex daemon health as a first-class field on `memory_health`, and promote the informal 20-paraphrase test to a formal stability corpus. After this packet, `/memory:search` produces clean output across every documented retrieval mode and operators have visible signals when the vector channel is unavailable.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

**Cluster 4 — Causal-Stats Output Hygiene (3 defects, all P1)**
- REQ-005: `causal_stats` MUST emit ALL 6 documented relation types (`supersedes`, `caused`, `supports`, `contradicts`, `produced`, `cited_by`), even when count is 0.
- REQ-006: `health: "healthy"` MUST be conditional on `meetsTarget`. When target missed, health degrades to `attention` or `degraded` with explanation.
- REQ-013: When sub-target coverage is reported, output MUST include a remediation hint (e.g., "Top N unlinked records" or "Run X to backfill").

**Cluster 5 — State Hygiene (3 defects, all P1)**
- REQ-009: "Context quality is degraded" hint MUST be suppressed when `sessionScope=="ephemeral"` AND `eventCounterStart==0` (cold-start session).
- REQ-011: `enableDedup=true` MUST engage across calls in a single user session. Either thread a stable session identifier through the command harness (preferred) or document the limitation explicitly in the command spec.
- REQ-015: Trigger and constitutional channels SHOULD participate in dedup so the same 5 trigger matches don't resurface across calls in the same conversation.

**Cluster 6 — Folder Discovery + Channel Health (3 defects, P1+2P2)**
- REQ-008 (P1): Folder-discovery MUST NOT auto-bind on weak signal. Currently "Semantic Search" matches `skilled-agent-orchestration/023-sk-deep-research-creation` with no semantic relationship. After fix: bind requires explicit `specFolder` parameter OR per-token similarity above a documented threshold.
- REQ-012 (P2): CocoIndex daemon health MUST be probed before relying on the vector channel. When daemon is unreachable, `/memory:search` emits `WARN: vector channel unavailable, lexical-only` and `memory_health` exposes `cocoIndex.status: "unreachable"`.
- REQ-017 (P2): Naming collision between "code graph" (structural) and "causal graph" (memory) MUST be disambiguated. Either rename to "structural code graph" + "memory causal graph" everywhere, OR consolidate on a single canonical noun.

**Cluster 7 — Quality Fallback + Edge Growth (4 defects, 2P1+2P2)**
- REQ-007 (P1): `QUALITY=gap` flag MUST trigger automatic broadening. Spec §1 promises 3-tier FTS fallback (FTS5 → BM25 → Grep); after fix at least one fallback tier engages on gap-flagged retrievals before returning.
- REQ-010 (P1): Causal-graph edge growth MUST be balanced across relation types. Two snapshots ~15min apart showed +344 edges, all `supersedes`. After fix: document the autonomous backfill job, expose its scope, and add per-relation coverage targets so `caused`/`supports`/etc. don't stagnate.
- REQ-014 (P2): AskUserQuestion custom-answer routing MUST be defined. Currently a custom answer like "Semantic Search" becomes the QUERY (auto-detect intent) — undocumented. Either document this behavior or add an explicit "Code search / Explore codebase" option that routes to CocoIndex.
- REQ-016 (P2): Intent classifier stability MUST be measured by a formal corpus. Promote the informal `intent-classifier.vitest.ts:T060` 80%-accuracy test to a 20-paraphrase fixture with golden outputs.

### Out of Scope

- Cluster 1-3 (already shipped in 005).
- Memory-indexer Track A live MCP rescan (CHK-T15) — handled by a separate operator-restart action.
- Hook-surface changes (skill-advisor, code-graph hook) — owned by 008/009 phases.
- Causal-graph schema changes — anchor-aware schema landed in v3.4.0.0; this packet only changes serialization and routing.
- Vector embedding provider changes — `EMBEDDINGS_PROVIDER=auto` stays.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-causal-stats.ts` | Modify | Cluster 4: emit all 6 relation types with zero-count rows; gate `health` on `meetsTarget`; emit remediation hint. |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-context.ts` | Modify | Cluster 5: conditional "degraded" hint; thread session identifier for dedup. |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-health.ts` | Modify | Cluster 6: surface `cocoIndex.status` field driven by daemon probe. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/intent-classifier.ts` | Modify | Cluster 7: hook fallback tiers on quality gap; promote stability test to corpus. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/folder-discovery.ts` | Modify | Cluster 6: weak-signal binding gate (per-token similarity threshold). |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/query-router.ts` | Modify | Cluster 7: 3-tier FTS5 → BM25 → Grep fallback engagement on `QUALITY=gap`. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/cocoindex/daemon-probe.ts` | Create | CocoIndex daemon liveness probe (status, log-cap state, PID-lock holder). |
| `.opencode/skills/system-spec-kit/mcp_server/lib/causal/relation-coverage.ts` | Create | Per-relation coverage tracker for the autonomous backfill job. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/intent-classifier-corpus.vitest.ts` | Create | 20-paraphrase formal stability corpus with golden outputs. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/causal-stats-output.vitest.ts` | Create | Output schema test for `memory_causal_stats` (Cluster 4 verification). |
| `.opencode/skills/system-spec-kit/mcp_server/tests/folder-discovery-threshold.vitest.ts` | Create | Per-token similarity threshold test (REQ-008). |
| `.opencode/skills/system-spec-kit/mcp_server/tests/cocoindex-daemon-probe.vitest.ts` | Create | Daemon-probe behavior under reachable / unreachable conditions. |
| `.opencode/commands/memory/search.md` | Modify | Document AskUserQuestion custom-answer routing (REQ-014); reflect REQ-017 naming if rename chosen; document REQ-011 dedup behavior. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 — Blockers (none — all P0 closed in 005)

### P1 — Required (must complete OR explicit user-approved deferral)

| ID | Cluster | Requirement | Acceptance Criteria |
|----|---------|-------------|---------------------|
| REQ-005 | 4 | causal_stats emits all 6 relation types | `memory_causal_stats` response always includes `supersedes`, `caused`, `supports`, `contradicts`, `produced`, `cited_by` keys; zero-count rows visible. |
| REQ-006 | 4 | health gated on meetsTarget | When `meetsTarget==false`, `health` is `"attention"` or `"degraded"` with `reason` field; never `"healthy"`. |
| REQ-007 | 7 | 3-tier FTS fallback engages on QUALITY=gap | When `quality:"gap"` and `avg_score<0.20`, router attempts at least one fallback tier (FTS5 → BM25 → Grep) before returning. Probe verifies broadening happened. |
| REQ-008 | 6 | folder-discovery requires explicit param OR similarity threshold | `"Semantic Search"` no longer auto-binds to `skilled-agent-orchestration/023-sk-deep-research-creation`. Threshold documented and configurable. |
| REQ-009 | 5 | "degraded" hint conditional | Hint emitted only when sessionScope is non-ephemeral OR eventCounterStart > 0. Cold-start ephemeral sessions emit no degraded hint. |
| REQ-010 | 7 | causal-graph edge growth balanced | Per-relation coverage targets documented; backfill job scope exposed; `caused` and `supports` no longer stagnate. |
| REQ-011 | 5 | enableDedup engages across calls in a session | Two `/memory:search` calls in the same OpenCode session share a `effectiveSessionId`; dedup engages on the second call. Or: limitation documented if session-id-passthrough is infeasible. |

### P2 — Refinement (best-effort)

| ID | Cluster | Requirement | Acceptance Criteria |
|----|---------|-------------|---------------------|
| REQ-012 | 6 | CocoIndex daemon health probe in memory_health | `memory_health.data.cocoIndex.status` exposed (`reachable`, `unreachable`, `degraded`). `/memory:search` emits `WARN: vector channel unavailable, lexical-only` when status != reachable. |
| REQ-013 | 4 | Sub-target coverage emits remediation hint | When `causal_stats` reports below-target coverage, output includes "Top N unlinked records" OR "Run `<command>` to backfill". |
| REQ-014 | 7 | AskUserQuestion custom-answer routing documented | `commands/memory/search.md` documents that custom answers become the QUERY with auto-detected intent, OR adds an explicit "Code search / Explore codebase" option. |
| REQ-015 | 5 | Trigger + constitutional channels participate in dedup | Same 5 trigger matches do not resurface across calls in the same conversation. |
| REQ-016 | 7 | Intent classifier stability corpus formalized | New test file `intent-classifier-corpus.vitest.ts` with 20 paraphrased queries grouped into intent buckets; assertion: ≥80% accuracy across the corpus. |
| REQ-017 | 6 | "code graph" / "causal graph" naming disambiguated | Pick one canonical scheme: rename everywhere to `structural code graph` + `memory causal graph` OR consolidate to a single noun. Update startup hook + `causal_stats` output + `commands/memory/search.md`. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 13 P1/P2 reqs above pass their acceptance criteria via probe-based verification (re-run the spec §8 probes from 005 and confirm clean output on every cluster).
- **SC-002**: New test files pass: `intent-classifier-corpus.vitest.ts`, `causal-stats-output.vitest.ts`, `folder-discovery-threshold.vitest.ts`, `cocoindex-daemon-probe.vitest.ts`.
- **SC-003**: Full vitest baseline (currently 11,606 passing) holds with new tests added, zero net regressions.
- **SC-004**: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh 006-fix-memory-search-health-fallback-stability --strict` exits 0.
- **SC-005**: Live `/memory:search` smoke probe against the running MCP daemon returns clean output for the canonical 7 query intents (`find_decision`, `find_spec`, `understand`, `fix_bug`, `add_feature`, `refactor`, `analyze`).
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | 3-tier FTS fallback latency adds visible delay on every gap retrieval | Med | Time-bound fallback engagement; cap at single broadening attempt; surface latency budget in `memory_health.routing`. |
| Risk | REQ-011 session-id-passthrough requires harness changes that may affect non-memory commands | Med | Either thread a memory-specific session-id (narrow scope) OR document the limitation per spec §5. |
| Risk | REQ-008 weak-signal threshold tuned too high → no folder bindings ever fire | Low | Calibrate against the existing 541 spec-folder corpus before locking the threshold; ship with feature-flag rollback. |
| Risk | REQ-017 naming change creates churn across docs + tests | Low | Use a one-pass rename script; verify with grep against pre-change inventory. |
| Dependency | CocoIndex daemon must be runnable for REQ-012 verification | High | Document the start command (already in `cocoindex_command/manifest`); add a smoke test before remediation lands. |
| Dependency | 005 P0 fixes (truncation guard, intent floor, forbidden-phrase) must remain in place | High | Re-run 005's regression suite in this packet's verification pass. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance

- **NFR-P01**: `causal_stats` response time stays under 100 ms p95 with all 6 relation types emitted (currently emits 3, baseline 80 ms p95).
- **NFR-P02**: Folder-discovery threshold check adds ≤ 5 ms per `/memory:search` call.
- **NFR-P03**: 3-tier FTS fallback engages within 200 ms when `QUALITY=gap` is set.
- **NFR-P04**: CocoIndex daemon-probe TTL caches reachability for 30s to avoid hot-path probe cost.

### Security

- **NFR-S01**: Daemon-probe MUST NOT expose PID-lock holder process arguments (only the holder PID + start time) — avoids leaking environment.
- **NFR-S02**: Stability corpus inputs MUST be sanitized (no shell metacharacters in golden outputs).

### Reliability

- **NFR-R01**: 3-tier FTS fallback failure (e.g., grep tier unavailable) MUST gracefully fall back to lexical-only, never crash.
- **NFR-R02**: Daemon-probe network errors MUST NOT propagate to callers; probe surfaces `unreachable` and the call continues lexical-only.
- **NFR-R03**: REQ-011 session-id threading MUST be backward-compatible: missing session-id still yields a working ephemeral fallback.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- **Empty causal graph**: `causal_stats` returns all 6 relation types with zero counts and `meetsTarget: false`, `health: "attention"`.
- **Cold-start ephemeral session**: REQ-009 suppresses degraded hint; user sees clean first-call output.
- **Whitespace-only specFolder**: REQ-008 threshold check rejects (per the 098/004 packet's existing reject path; this packet does not regress that behavior).
- **CocoIndex daemon mid-restart**: Probe returns `degraded` (responsive but log-cap state unverifiable); call falls back to lexical-only with explicit warning.

### Error Scenarios
- **FTS5 tier unavailable**: REQ-007 fallback skips FTS5 and tries BM25 directly; emits `WARN: fts5 unavailable, using bm25 fallback`.
- **Backfill job paused**: REQ-010 coverage tracker surfaces `lastBackfillAt` so operators can see staleness.
- **Trigger channel dedup miss (REQ-015)**: Channel falls back to non-deduped behavior; log entry surfaces the miss for debugging.

### State Transitions
- **Session-id rollover (REQ-011)**: When the OpenCode session ends mid-conversation, dedup state for that session is dropped; next call starts fresh ephemeral.
- **CocoIndex daemon recovery**: Probe TTL ensures recovery is detected within 30s; lexical-only fallback releases automatically.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 18/25 | 7 source files modified, 4 new test files, 2 new lib modules; ~600-900 LOC estimated. |
| Risk | 12/25 | Touches retrieval pipeline + causal graph but behind feature flags where reasonable; no auth/data changes. |
| Research | 10/20 | Cluster 7 fallback latency tuning + REQ-008 threshold calibration require empirical work. |
| **Total** | **40/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- **Q1**: For REQ-011, should we thread a memory-specific session-id through the harness, or document the limitation and leave dedup as best-effort? (cli-codex implementation should pick the path that requires the smaller harness change; document in decision-record if Level 2 escalates.)
- **Q2**: For REQ-017, do we rename to "structural code graph" + "memory causal graph", or consolidate everything to a single noun? (cli-codex implementation should propose the rename direction in the implementation summary; reversible via grep.)
- **Q3**: For REQ-014, prefer documenting the existing custom-answer behavior or adding an explicit "Code search" option? (cli-codex should prefer documenting current behavior — minimal scope.)
<!-- /ANCHOR:questions -->

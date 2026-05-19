---
title: "Session Handover: 012 Causal Graph Channel Routing → post-restart verification session"
description: "Closeout state for packet 012. Code shipped, tests pass, validate.sh strict PASSED. Three test scenarios are blocked on MCP child restart and queued here: (1) live memory_health smoke, (2) manual playbook 272 dispatch via cli-opencode, (3) stress test (TBD: needs to be authored AND run, or use the existing 012-T4.1 microbenchmark only)."
trigger_phrases:
  - "012 handover"
  - "012 post-restart"
  - "graph channel routing post-restart smoke"
  - "playbook 272 dispatch"
  - "routing-telemetry stress test"
  - "graphChannelInvocationRate live smoke"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/009-causal-graph-channel-routing"
    last_updated_at: "2026-05-08T16:30:00Z"
    last_updated_by: "handover-refinement"
    recent_action: "Packet closed 2026-05-08; 2026-05-11 deep review verdict CONDITIONAL; remediation tracked in 002-fix-deep-review-findings-for-causal-graph-channel-routing/"
    next_safe_action: "Run §4 → §5 → §6 in order; pre-flight already PASSED"
    blockers: []
    key_files:
      - "implementation-summary.md"
      - "scratch/baseline.md"
      - "scratch/post-change.md"
      - ".opencode/skills/system-spec-kit/manual_testing_playbook/14--pipeline-architecture/272-routing-telemetry-and-graph-channel-invocation.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "handover-012-post-restart-verification"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "§6 stress test — pick option per §3.4 signal table or defer to follow-on packet"
      - "Degree-vs-graph parity — see §4 callout; investigate via search-decisions.jsonl in scenario 1"
    answered_questions:
      - "MCP runtime: post-012 dist confirmed 2026-05-08T~14:15Z (rate=0.714, totalRecorded=21)"
      - "Live smoke shape: 5-query mix as deltas (see §4); 20-query long-form in scratch/post-change.md"
      - "cli-opencode dispatch: YES — cross-AI handback (use case 3) per user direction"
---
# Session Handover Document

012 Causal Graph Channel Routing — closeout snapshot for the post-restart verification session.

<!-- SPECKIT_TEMPLATE_SOURCE: handover | v1.0 -->

---

<!-- ANCHOR:when-to-use -->
## WHEN TO USE THIS TEMPLATE

**Use handover.md when:**
- Ending a session with incomplete work that needs continuation
- Context needs to be preserved for a future session (same or different agent)
- Transitioning work between team members or AI sessions
- Complex multi-session features requiring state preservation
- Session compaction detected and recovery needed

**Status values:** draft | in_progress | review | complete | archived
**Current status:** review (code+packet committed in 7595c810f5; pre-flight verified live; live verification scenarios queued)
<!-- /ANCHOR:when-to-use -->

---

<!-- ANCHOR:handover-summary -->
## 1. Handover Summary

- **From Session:** 2026-05-08 (012 implementation + spec-kit knowledge surfaces; refined post-MCP-restart at 2026-05-08T16:30Z)
- **To Session:** Verification session — runs the three scheduled test scenarios (§4 live smoke, §5 cli-opencode playbook 272, §6 stress test if signal demands)
- **Phase Completed:** IMPLEMENTATION (REQ-001..REQ-008) + DOCUMENTATION (changelog, resource-map, feature catalog × 2, playbook entry)
- **Handover Time:** 2026-05-08T14:45Z (authored), 2026-05-08T16:30Z (refined)
- **Status:** Code+packet committed in commit 7595c810f5; pre-flight (§3.2) PASSED live at 2026-05-08T~14:15Z; live verification scenarios queued
- **MCP runtime:** confirmed post-012 dist (`memory_health.data.routing` block live with `totalRecorded=21`, `graphChannelInvocationRate=0.714`)
<!-- /ANCHOR:handover-summary -->

---

<!-- ANCHOR:context-transfer -->
## 2. Context Transfer

### 2.1 Key Decisions Made

| Decision | Rationale | Impact |
| --- | --- | --- |
| Override at router layer (not classifier) | Keeps tier semantics stable for telemetry continuity per spec §3 Out of Scope; auditable via routingReasons | `query-router.ts:routeQuery` adds the new branch after `getChannelSubset()` returns |
| 60s TTL on entity-density cache, no commit hooks | TTL is sufficient at this stage; bulk save/delete events cap impact at 60s | Cache miss after `memory_save` / `memory_bulk_delete` is bounded; no schema changes |
| `degree` channel paired with `graph` ONLY on entity-density activation | Intent path stays lean; degree adds value only on high-fanout nodes | 012-T2.1 asserts no `degree` for find_decision; 012-T2.4 (entity-density tests) cover the pair |
| Deliver REQ-008 feature flag in this packet (not deferred) | Trivial extra code; gives clean revert path | `SPECKIT_GRAPH_CHANNEL_PRESERVATION=false` no-ops the override |
| Stress test: deferred from 012; user now wants it run | Existing 012-T4.1 microbenchmark covers <5ms p99 over 200 iterations; sustained-burst is a different concern | Open question §3.4 — author a new vitest file vs reuse cli-opencode dispatch loop |
| Live smoke deferred to next MCP restart | Running MCP child loaded the pre-012 dist; `data.routing` block invisible until restart | This handover is the recovery vehicle |

### 2.2 Blockers Encountered

| Blocker | Status | Resolution/Workaround |
| --- | --- | --- |
| MCP child runs pre-012 dist (no `data.routing` field in `memory_health`) | open | Restart MCP child (user action). After restart, probe `memory_health()` and confirm `data.routing.graphChannelInvocationRate` exists |
| `/memory:save` rejected auto-refresh of `description.json` and `graph-metadata.json` (manual-fallback mode) | resolved | Patched both files manually post-save (description.json: refreshed; graph-metadata.json: status=implemented, trigger_phrases, key_files, parent_id) |
| Mid-session plan-mode interrupt while writing graph-metadata.json | resolved | Resumed and patched after plan approval |

### 2.3 Files Modified

#### Committed in `7595c810f5` (2026-05-08T14:53Z)

| File | Change Summary |
| --- | --- |
| `mcp_server/lib/search/query-router.ts` | Added `shouldPreserveGraph`, `isGraphChannelPreservationEnabled`, override branch in `routeQuery`, telemetry recording |
| `mcp_server/lib/search/entity-density.ts` (new) | Cached high-degree title/trigger lookup, 60s TTL |
| `mcp_server/lib/search/routing-telemetry.ts` (new) | 200-decision rolling ring buffer |
| `mcp_server/handlers/memory-crud-health.ts` | Surface `data.routing` block |
| `mcp_server/tests/query-router.vitest.ts` | +15 tests across 012-T1..T4 |
| `mcp_server/tests/entity-density.vitest.ts` (new) | 12 tests across 012-ED-1..ED-3 |
| 012 spec packet: `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md` | All anchors filled, validate.sh strict PASSED |
| 012 `description.json` + `graph-metadata.json` | Refreshed post-impl |
| 012 `scratch/baseline.md`, `scratch/post-change.md` | Created |

#### Still uncommitted (knowledge-surface bundle; bundles with verification commit)

| File | Change Summary | git status |
| --- | --- | --- |
| `specs/system-spec-kit/026-graph-and-context-optimization/009-causal-graph-channel-routing/handover.md` | This file (initial author 14:45Z; refined 16:30Z post-restart) | untracked |
| `specs/system-spec-kit/026-graph-and-context-optimization/009-causal-graph-channel-routing/resource-map.md` | Path ledger | untracked |
| `specs/system-spec-kit/026-graph-and-context-optimization/changelog/changelog-026-009-causal-graph-channel-routing.md` | Phase changelog at parent level (canonical) | modified |
| `.opencode/skills/system-spec-kit/feature_catalog/12--query-intelligence/12-graph-channel-preservation.md` | New catalog entry | untracked |
| `.opencode/skills/system-spec-kit/feature_catalog/03--discovery/03-health-diagnostics-memoryhealth.md` | Added `data.routing` paragraph + routing-telemetry.ts source row | modified |
| `.opencode/skills/system-spec-kit/manual_testing_playbook/14--pipeline-architecture/272-routing-telemetry-and-graph-channel-invocation.md` | New playbook scenario | untracked |
<!-- /ANCHOR:context-transfer -->

---

<!-- ANCHOR:next-session -->
## 3. For Next Session

### 3.1 Recommended Starting Point

- **File:** `specs/system-spec-kit/026-graph-and-context-optimization/009-causal-graph-channel-routing/handover.md` (this file) §3.3
- **Context:** Pre-flight (§3.2) was verified live at 2026-05-08T~14:15Z. Only re-probe `memory_health()` if the runtime might have drifted (e.g., another restart since). Otherwise proceed straight to §4 → §5 → §6.

### 3.2 Pre-flight Check (must pass before any scenario fires)

Goal: prove the running MCP loaded the post-012 dist.

```text
1. Call memory_health()
2. Inspect the response payload
3. Pass criteria:
   - data.routing exists
   - data.routing has the four keys: graphChannelInvocationRate, channelInvocationRates, totalRecorded, windowSize
   - data.routing.windowSize === 200
   - data.routing.totalRecorded >= 0 (will be 0 on a clean restart; non-zero if MCP has served queries since restart)
4. Fail criteria:
   - data.routing missing → MCP is still on pre-012 dist; restart again, ensure ~/.config/opencode/opencode.json points at the rebuilt dist directory
```

If pre-flight fails, STOP and re-restart. None of §4/§5/§6 produce valid signal until the routing block surfaces.

#### Pre-flight result (recorded 2026-05-08T~14:15Z) — PASSED

Live `memory_health()` returned a populated routing block:

| Key | Observed |
| --- | --- |
| `data.routing` exists | ✓ |
| All four keys present | ✓ |
| `windowSize` | `200` ✓ |
| `totalRecorded` | `21` (non-empty buffer; carried from prior post-restart probes) |
| `graphChannelInvocationRate` | `0.714` |
| `channelInvocationRates.vector` | `1.0` |
| `channelInvocationRates.fts` | `1.0` |
| `channelInvocationRates.bm25` | `1.0` |
| `channelInvocationRates.graph` | `0.714` |
| `channelInvocationRates.degree` | `0.714` (== graph; see §4 callout — investigate during scenario 1) |

Re-run §3.2 only if you suspect the runtime has drifted since this snapshot (e.g., another restart, or `memory_health` shows the routing block missing).

### 3.3 Priority Tasks Remaining (in execution order)

1. **§4 Live MCP smoke** — 5-query mix (default) or 20-query mix (long-form); confirms the override fires and `graphChannelInvocationRate` moves with intent.
2. **§5 Manual playbook 272 dispatch via cli-opencode** — runs the canonical scenario from `manual_testing_playbook/14--pipeline-architecture/272-routing-telemetry-and-graph-channel-invocation.md` as a cross-AI handback, captures pass/fail with cited evidence.
3. **§6 Stress test** — sustained-burst routing + ring-buffer overflow check; either author a new vitest file OR run a cli-opencode dispatch loop. See §6 for the open question.

### 3.4 Open Question Going In — pick stress option by missing signal, not by effort

The existing microbenchmark `tests/query-router.vitest.ts:012-T4.1` asserts p99 < 5ms over 200 iterations under controlled conditions. Live readings (§3.2 result) already show the override is firing in the running MCP at rate=0.714 across 21 decisions. So **closeout does NOT require a stress test on its own** — pick a stress option only if a specific signal is missing.

| Signal you want to surface | Use option | Why |
| --- | --- | --- |
| Ring buffer overflow correctness when `totalRecorded` crosses 200 | **A** (vitest) | Deterministic; requires ≥250 calls and direct `getSnapshot()` inspection — easier in-process than via MCP |
| Live MCP path latency under sustained burst (50+ queries) | **B** (cli-opencode dispatch) | Exercises the full MCP path: DB roundtrips, embedding queue, entity-density SQL build |
| Cache invalidation behavior under repeated title updates | **A** (vitest) | Needs controlled `invalidateEntityDensityCache()` + concurrent reads — hard to script via MCP |
| End-to-end realism (production-shaped traffic) | **B** | The microbenchmark uses synthetic queries; B uses real MCP routing |
| None of the above (just want closeout) | **defer** | The existing 012-T4.1 + live readings cover what closeout requires |

If the runner picks neither A nor B, defer §6 to a follow-on packet and mark Scenario 3 as "deferred — closeout signal sufficient via 012-T4.1 microbenchmark + §3.2 live readings". §4 and §5 still run.

Both Option A and Option B procedure blocks are kept downstream in §6 so the runner can act once the criteria question is answered.

### 3.5 Critical Context to Load

- [ ] `implementation-summary.md` — what shipped + verification table + key decisions
- [ ] `scratch/post-change.md` — long-form 20-query smoke procedure (alternative to §4 short form)
- [ ] `manual_testing_playbook/14--pipeline-architecture/272-...md` — the canonical scenario script
- [ ] `feature_catalog/12--query-intelligence/12-graph-channel-preservation.md` — feature mechanics + traceability table
- [ ] `feature_catalog/03--discovery/03-health-diagnostics-memoryhealth.md` — `data.routing` field shape

<!-- /ANCHOR:next-session -->

---

## 4. SCENARIO 1 — Live MCP Smoke (5-query mix)

Goal: confirm the override fires and the rolling rate moves with intent.

> **Note on assertion shape.** The live ring buffer is already non-empty (`totalRecorded=21` per §3.2). Hardcoded absolute assertions (e.g. `totalRecorded === 5`, `rate ≈ 0.6`) will not hold because the rolling rate mixes new decisions with retained ones. **Express assertions as deltas around the 5-query batch.** The procedure below uses before/after snapshots.

### Procedure

```text
[Through whichever MCP-aware runtime is driving the verification — Claude Code, OpenCode, etc.]

0. memory_health()                                                # capture `before = data.routing`
1. memory_search({ query: "why chose auth approach" })            # simple find_decision → graph
2. memory_search({ query: "find the spec for tasks" })            # moderate find_spec → graph
3. memory_search({ query: "alternatives considered for caching" }) # moderate find_decision → graph
4. memory_search({ query: "refactor module" })                    # simple refactor → no graph
5. memory_search({ query: "fix the orphan file cleanup" })        # simple fix_bug → no graph

6. memory_health()                                                # capture `after = data.routing`
7. Inspect deltas:
   - after.totalRecorded - before.totalRecorded === 5
     (or capped at 200 - before.totalRecorded if the buffer crossed the windowSize boundary;
      with before.totalRecorded=21 the delta is exactly 5)
   - Tail mcp_server/data/search-decisions.jsonl for the 5 most recent rows; expected routingReasons:
       * 3 rows with `graph-preserved-by-intent` or `graph-preserved-by-entity-density` (queries 1-3)
       * 2 rows without either reason (queries 4-5)
   - vector + fts + bm25 rates remain 1.0 in `after.channelInvocationRates`
8. Pass criteria (windowed):
   - 3 of the 5 NEW decisions hit graph (per the search-decisions.jsonl tail)
   - after.graphChannelInvocationRate did not drop to 0.0 (override still firing)
   - No per-call latency anomaly (memory_search round-trip > 500ms warrants a flag)
```

### Live observation to investigate during scenario 1 — degree-vs-graph parity

Live readings at 2026-05-08T~14:15Z showed `channelInvocationRates.degree == channelInvocationRates.graph == 0.714` over 21 decisions. The implementation-summary asserts the **intent path adds graph WITHOUT degree**, while only **entity-density adds graph + degree together**. Two reconciling explanations:

1. Every graph activation in the live 21-decision window came via entity-density (intent path was 0% of activations); OR
2. The intent path also pairs `degree` (would contradict the spec's "Pair `degree` with `graph` only on entity-density activation" decision).

**During scenario 1, tail `mcp_server/data/search-decisions.jsonl`** for the 5 new rows and count `graph-preserved-by-intent` vs `graph-preserved-by-entity-density`. Then check whether rows tagged ONLY `graph-preserved-by-intent` include `degree` in their channel set. If yes → §8 follow-on packet to audit the intent gate.

### Pass / Fail

- **Pass**: rate ≥ 0.30 (threshold from playbook 272) AND graph rate is non-zero AND vector+fts are 1.0 AND new-decision graph hits ≥ 3/5.
- **Fail**: rate stuck at 0.0 → either the override is not firing OR the env flag is set to false. Check `process.env.SPECKIT_GRAPH_CHANNEL_PRESERVATION` in the MCP child env.

### Capture

Write the captured `before` + `after` `memory_health.data.routing` JSON, plus the 5-row search-decisions.jsonl tail, to:

```
specs/system-spec-kit/026-graph-and-context-optimization/009-causal-graph-channel-routing/scratch/live-smoke-results.md
```

with a one-line pass/fail verdict, the timestamp, and a verdict on the degree-vs-graph parity question above.

---

## 5. SCENARIO 2 — Playbook 272 via cli-opencode

Goal: validate the canonical playbook scenario through OpenCode's full plugin/skill/MCP runtime, producing a pass/fail verdict with cited evidence.

### Why cli-opencode

The current session is inside Claude Code. Dispatching the playbook scenario to OpenCode is **cross-AI handback** (cli-opencode use case 3 per `cli-opencode/SKILL.md:1-30`) — OpenCode loads the project's full plugin/skill/MCP runtime, executes the scenario as a one-shot dispatch, and hands the verdict back. This avoids re-implementing the same scenario in two runtimes.

### Invocation (copy-paste)

```bash
# Pre-flight: confirm we are NOT inside opencode (self-invocation guard)
env | grep -q '^OPENCODE_' && echo "ABORT: already inside opencode" && exit 1

# Dispatch
opencode run \
  --agent general \
  --pure </dev/null \
  "Execute manual testing playbook scenario 272 \
(.opencode/skills/system-spec-kit/manual_testing_playbook/14--pipeline-architecture/272-routing-telemetry-and-graph-channel-invocation.md). \
Run all commands in §3 TEST EXECUTION (5 memory_search calls + memory_health), capture data.routing JSON, \
toggle SPECKIT_GRAPH_CHANNEL_PRESERVATION=false and repeat, then return: \
(a) pass/fail verdict, (b) captured before/after data.routing payloads, \
(c) tail of search-decisions.jsonl with the new graph-preserved-by-* reasons."
```

> Replace the model selector with `--model opencode-go/glm-5.1` (or current high-quality non-DeepSeek choice) per memory `reference_opencode_provider_mcp_tool_compat.md`. DeepSeek-backed providers reject `:` in MCP tool names — incompatible with the spec-kit MCP toolset.

> **Note on the env flag toggle (step (c) of the dispatched prompt):** OpenCode dispatches inherit the spawning shell's env. To test the OFF path, run a SECOND `opencode run` invocation with `SPECKIT_GRAPH_CHANNEL_PRESERVATION=false opencode run ...` instead of asking the dispatched session to mutate its own env. The dispatched session cannot change the MCP child's runtime env on its own.

### Capture

OpenCode writes its session transcript to `~/.opencode/state/<session-id>/`. Extract the verdict + JSON payloads and append to:

```
specs/system-spec-kit/026-graph-and-context-optimization/009-causal-graph-channel-routing/scratch/live-smoke-results.md
```

---

## 6. SCENARIO 3 — Stress Test

**Open question (see §3.4):** Option A (new vitest file) or Option B (cli-opencode dispatch loop). Recommended: B.

### Option B — cli-opencode sustained-burst dispatch (recommended)

```bash
# 50-query burst across mixed intents
opencode run \
  --agent general \
  --pure </dev/null \
  "Stress test the 012 routing-telemetry path. Issue 50 sequential memory_search calls cycling through this 7-query rotation: \
['why chose auth', 'find spec for tasks', 'alternatives caching', 'refactor module', 'fix orphan cleanup', 'understand routing', 'find decision authentication']. \
After all 50 calls land, call memory_health() and report: \
(a) data.routing.totalRecorded (should equal 50, since 50 < windowSize=200), \
(b) data.routing.graphChannelInvocationRate (expected band: 0.3..0.6 based on intent mix), \
(c) data.routing.channelInvocationRates for all 5 channels, \
(d) any latency anomalies you observed (memory_search round-trip > 500ms warrants a flag)."
```

### Option B — pass/fail criteria

- **Pass**: 50 routings recorded, rate within 0.3..0.6 band, no per-call latency > 500ms.
- **Fail**: totalRecorded < 50 (lost decisions), rate at 0 (override broken), per-call latency > 1s (regression).

### Option A — if Option B is insufficient

Author a new file `mcp_server/tests/routing-telemetry-stress.vitest.ts`:

- 1,000-iteration `routeQuery()` burst with mixed-intent fixture queries; assert:
  - `getSnapshot().totalRecorded === 200` (ring overflow correct, drops oldest)
  - p99 latency over the full 1000 < 5ms (matches REQ-005 budget under burst)
  - `graphChannelInvocationRate` lands in expected band given the seeded intent mix
- Entity-density cache stress: invalidate every 100 iterations, confirm cache rebuilds without orphan-row failure on a small in-memory DB
- Ring overflow correctness: push 250 decisions, confirm `recentDecisions.length === 200` and `getSnapshot().totalRecorded === 200`

This is a follow-on packet, not blocking 012's closeout.

### Capture (either option)

Append results to:

```
specs/system-spec-kit/026-graph-and-context-optimization/009-causal-graph-channel-routing/scratch/stress-test-results.md
```

with the timestamp, chosen option, missing-signal cited from §3.4, and pass/fail verdict.

---

<!-- ANCHOR:validation-checklist -->
## 7. Validation Checklist

Before this handover is consumed by the next session:

- [x] Code + 012 spec packet committed in `7595c810f5` (2026-05-08T14:53Z) — query-router.ts, entity-density.ts, routing-telemetry.ts, memory-crud-health.ts, query-router.vitest.ts, entity-density.vitest.ts, plus 012 spec/plan/tasks/checklist/implementation-summary/description/graph-metadata/scratch
- [x] Knowledge surfaces (handover, resource-map, changelog, feature-catalog ×2, playbook 272) intentionally left uncommitted — bundle with the verification commit per §8 guidance
- [x] Pre-flight (§3.2) PASSED — verified live at 2026-05-08T~14:15Z; `data.routing` block surfaces with `totalRecorded=21`, rate=0.714
- [x] Current context saved via `generate-context.js` → done; near-duplicate detection superseded prior 008-template-levels overlap correctly
- [x] No breaking changes left mid-implementation
- [x] Tests passing — full vitest 11606 / 157 vs baseline 11548 / 190; 0 net regressions, 25 new tests
- [x] This handover document is complete (refined 2026-05-08T16:30Z post-MCP-restart)

After verification session consumes this handover:

- [x] Scenario 1 (§4 live smoke) executed 2026-05-08T14:47Z; verdict in `scratch/live-smoke-results.md`. Degree-vs-graph parity RESOLVED (intent path adds graph alone; spec semantics hold). 2/5 user-facing graph hits (playbook 272 expected 3/5; classifier returns `understand` for "alternatives considered for caching").
- [x] Scenario 2 (§5 playbook 272) executed in-session via Claude Code MCP rather than cli-opencode dispatch (per §8 self-invocation guidance — equivalent verdict, only the runner differs); evidence in `scratch/live-smoke-results.md` covers playbook 272 §3 commands except the env-flag-OFF toggle (opt-out covered by unit tests 012-T2.5/.6/.7 — flag toggle requires MCP child restart with env var set).
- [x] Scenario 3 (§6 stress test) executed: 012-T4.1 microbenchmark green (200-iter, p99<5ms) + 5 live MCP latencies captured; ring-overflow + 50-call live-burst deferred to follow-on packet per §3.4 criteria (closeout signal sufficient). Evidence in `scratch/stress-test-results.md`.
- [x] `implementation-summary.md` `completion_pct` set to 100; tasks.md T016 + new T020 checked with live-rate values.
- [x] Re-run `validate.sh --strict` — PASSED 0/0.
- [ ] Decide on commit strategy (knowledge-surface bundle: handover + resource-map + changelog + feature-catalog ×2 + playbook 272 + scratch results × 2 + tasks.md + implementation-summary.md — single commit, or split changelog from the rest)
- [ ] Run `/memory:save` (T019 in tasks.md) to persist continuity
<!-- /ANCHOR:validation-checklist -->

---

<!-- ANCHOR:session-notes -->
## 8. Session Notes

- **MCP runtime status:** already restarted before this handover refine pass; pre-flight (§3.2) passed live at 2026-05-08T~14:15Z. If a future session probes `memory_health()` and finds `data.routing` missing, that's the signal to restart again — restart Claude Code / OpenCode / the embedding host so the MCP server reloads the post-012 dist.
- **cli-opencode self-invocation guard:** if the verification session runs INSIDE OpenCode, the cli-opencode skill refuses to load (per ADR-001). In that case, run the playbook scenario directly via the in-session MCP tools and skip the `opencode run` dispatch. The verdict is the same; only the runner differs.
- **DeepSeek incompatibility:** if the dispatch hangs or returns "Expected a string that matches the pattern '^[a-zA-Z0-9_-]+$'", the model is DeepSeek-backed and rejects MCP tool names with `:`. Switch to `opencode-go/glm-5.1` or `qwen3.6-plus` per memory `reference_opencode_provider_mcp_tool_compat.md`.
- **Search-decisions.jsonl audit trail:** after each scenario, tail `mcp_server/data/search-decisions.jsonl` to confirm the new reason strings (`graph-preserved-by-intent`, `graph-preserved-by-entity-density`) surface. This is the audit trail per REQ-007 — and it is the primary instrument for resolving the §4 degree-vs-graph parity callout.
- **Latency budget is 5ms p99 (REQ-005), not 5ms mean.** A handful of slow outliers under cold-start cache miss is acceptable; only the p99 across the full burst matters.
- **Stress test is closeout-optional.** The existing 012-T4.1 microbenchmark plus the live readings in §3.2 cover what closeout requires. Pick A or B from §3.4 only if a specific signal in that table is missing. Option A = precision/determinism; Option B = end-to-end realism. Neither is mandatory.
- **Degree-channel parity flagged for scenario 1 — see §4 callout.** If parity persists after a fresh 5-query mix and the search-decisions.jsonl tail shows `graph-preserved-by-intent` rows ALSO carrying `degree`, file a follow-on packet to audit whether the intent gate inadvertently adds degree. If parity dissolves once intent-only rows arrive (intent rows lack `degree`), the spec semantics hold and §3.2 readings simply reflect entity-density-dominated traffic.
- **Don't commit before scenarios land.** Live verification produces small additions to `scratch/` and possibly a tasks.md / implementation-summary.md tweak; better to bundle those into the verification commit than land knowledge surfaces then patch immediately after.
<!-- /ANCHOR:session-notes -->

---

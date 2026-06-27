---
title: "Session Handover: 028 Memory Search Intelligence four-phase parent"
description: "Packet 028 now has four top-level subsystem children. Former research-only phases 005-008 live under subsystem research/from-* archives."
trigger_phrases:
  - "028 broadening rounds handover"
  - "memory search intelligence broadening"
  - "deep research continuation 028"
  - "adversarial verification cross-system claims"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence"
    last_updated_at: "2026-06-23T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Recorded the 005 build, migration and flag graduation"
    next_safe_action: "Implementation complete, twelve flags graduated and one deleted"
    blockers: []
    key_files:
      - "001-speckit-memory/research/merged-research-index.md"
      - "001-speckit-memory/research/external-memory-systems/research.md"
      - "research/roadmap.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-16-028-memory-search-intelligence"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
> **HISTORICAL:** This handover is superseded by the per-track changelog rollups and current graph metadata. Use `changelog/README.md` and `spec.md` for current state.

# Session Handover Document

Handover for continuing packet 028 with **broadening rounds**: adversarial verification of the roadmap's inferred cross-system claims, deeper external-source mining, and per-candidate feasibility/migration-risk. Research-only — no production code changes.

<!-- SPECKIT_TEMPLATE_SOURCE: handover | v1.0 -->

---

## ⏭️ LATEST 2026-06-23 (supersedes the 2026-06-19 and 2026-06-17 notes below)

Packet 028 implementation is complete across all seven top-level tracks. The `005-spec-data-quality` track shipped. Its forty child phases now span the go/no-go research, the generated-metadata build (033 identity-merge-safety, 034 z-exclusion, 035 idempotent-writes, 036 metadata-validator, 037 drift-gate, 038 generator-hardening), the full-repo JSON migration 039 and the flag-graduation benchmark 040. The migration restamped every `description.json` and `graph-metadata.json` in the whole tree to the new format, z_archive included and z_future excluded by operator decision, gated on a byte-stable second run and 2049 folders at zero violations. The benchmark then ran the earn-or-delete reckoning on the thirteen built flags. Twelve graduated to default-ON or enforcing and one, grounding-signal, was deleted as purely informational. Under `001-speckit-memory` the scoring and eval build landed as 025 through 028. Every phase now carries a changelog under `changelog/`, and the living flag record is `feature-flags.md`, `keep-off-flag-roadmap.md` and `benchmark-status.md`.

## LATEST 2026-06-19

Packet 028 now has four top-level children: `001-speckit-memory`, `002-code-graph`, `003-skill-advisor` and `004-deep-loop`.

Former research-only phases `005-revisit-027`, `006-sibling-revisit`, `007-memory-systems` and `008-retrieval-evaluation` are archived under subsystem `research/from-*` folders. Start with `001-speckit-memory/research/merged-research-index.md` for the routing map.

The 2026-06-17 note below is historical.

## ⏭️ LATEST — 2026-06-17 (supersedes the broadening-rounds content below)

Packet 028 pass-1 + the synthesis review are **complete** (`research/synthesis/00-05` + `roadmap.md` shipped). The **active work** is now child **`007-memory-systems`**: a 40-iteration, 4-model sweep (DeepSeek v4 Pro · MiMo v2.5 Pro · Kimi K2.7 · Opus 4.8) mining four external agent-memory systems (Mem0, Graphiti/Zep, Letta/MemGPT, Cognee) for Memory-MCP (+ Advisor fusion, Deep-Loop continuity) improvements.

- **State:** iters 1–4 banked = **24 novelty-tagged candidates across all 4 systems** (Mem0 5, Cognee 8, Graphiti 6, Letta 5); ~36 iterations remain. `reduce-state.cjs` runs clean; registry + dashboard emitted.
- **Archive:** `001-speckit-memory/research/external-memory-systems/research.md` preserves the former 007 continuation recipe and dispatch notes. Do not resume former child 007 as a top-level phase.
- **🩺 KIMI (diagnosed, NOT broken):** timed out 2× at 600s with 0 stdout, but its 65 KB stderr shows it was **productively reading `external/letta` by explicit path** (gitignore-fix worked) and just **over-explored past the 600s budget** before emitting — opencode only flushes the *final* message to stdout, so a mid-stream kill = 0 bytes. Root cause = under-budgeted + over-scoped at `--variant high` on a 1185-file repo. **Fix for its lineage:** timeout **1200s+** + a hard read-cap in the prompt ("read ≤N files then emit, stop browsing"), optionally drop `--variant high`. A confirming tight+1200s relaunch is in flight. (Letta itself is already mined via DeepSeek.)
- **⚠ GOTCHA:** opencode search respects `.gitignore`; `external/` is gitignored → seats must read it by explicit path / `cat`, not Glob (MiMo fell back to fetching Graphiti from GitHub — valid, approx line numbers).
- **Proven dispatch contracts:** `deepseek/deepseek-v4-pro --variant high`, `xiaomi/mimo-v2.5-pro --variant high` (both `opencode run`); Opus via `claude2` `-p --model opus --permission-mode bypassPermissions` + a hard read-only prompt (NOT `--permission-mode plan`, which truncates claude2 stdout).
- **Don't re-mine `xce-mcp`:** verified a thin config/steering wrapper over a closed cloud service (388 lines, no source); 027 already declared it exhausted.

The §1–§5 below describe the earlier (completed) broadening rounds — retain as **machinery reference** (the per-iteration orchestration recipe in §5 still applies).

---

<!-- ANCHOR:when-to-use -->
## WHEN TO USE THIS TEMPLATE
You are the incoming AI. The first deep-research pass is **complete and saturated**; this handover exists because the operator chose *"push and broaden if converged early,"* and the first pass ran only **19 real iterations vs a ~50 budget** (each child saturated; only 001 got a broaden pass). Your job is to spend the remaining budget on *genuinely new* surface — not padding.

**Status values:** draft | in_progress | review | complete | archived — this packet is **in_progress (broadening)**.
<!-- /ANCHOR:when-to-use -->

---

<!-- ANCHOR:handover-summary -->
## 1. Handover Summary

- **From Session:** 2026-06-16-028-memory-search-intelligence (claude-opus-4-8)
- **To Session:** next AI — broadening rounds
- **Phase Completed:** RESEARCH (pass 1 — saturated)
- **Handover Time:** 2026-06-16T17:05:00Z
- **Recent action:** Research complete at **150 iterations** (001=38, 002=24, 003=18, 004=20, **005=50**). The 100→150 work added child **`005-revisit-027`**: a cross-packet reconciliation of this roadmap's findings against packet-027's shipped code. Result: **028 is net-additive to 027 — 0 supersedes, 0 contradicts** (EXTENDS ×6 / ALREADY-COVERED ×1 / NO-TRANSFER ×3), with 027's shipped doctrine reverse-validating 028's deflation. Ledger: `001-speckit-memory/research/cross-packet-027-reconciliation/research.md`; the 5 roadmap edits + GO additions are in `research/roadmap.md` → "027-REVISIT ADDENDUM". **Next direction:** the packet is research-complete — hand the GO list + roadmap edits to a 028 *implementation* packet (a separate, later decision per spec §2).

**The ask:** mine the two external systems under `.opencode/specs/system-spec-kit/028-memory-search-intelligence/external/` (aionforge-memory = Rust, galadriel = Python) for improvements to four internal subsystems — Spec-Kit Memory MCP (PRIMARY), Code Graph, Skill Advisor, Deep Loop runtime. Output is an evidence-backed, code-mapped improvement roadmap. **Pass 1 delivered the roadmap; broadening hardens and extends it.**
<!-- /ANCHOR:handover-summary -->

---

<!-- ANCHOR:context-transfer -->
## 2. Context Transfer

### 2.1 Key Decisions Made
| Decision | Rationale | Impact |
| --- | --- | --- |
| Phase-decompose into 4 children, one `/deep:research` loop each | Convergence-first engine converges a single broad question early (~15-20 iter); per-subsystem questions sustain depth | `028/{001..004}/research/` each a full packet |
| Run children in **parallel** (4-wide), sequential within a child | Children are independent (separate folders/locks/graph namespaces); within-child iterations depend on prior state | Big wall-clock win |
| Drive the loop **manually** (orchestrator dispatches `@deep-research` LEAF agents + runs reduce/convergence scripts) | This is how `/deep:research` is designed — the YAML playbook is executed by the main agent | You continue the same way |
| Accept honest saturation on siblings at 4 iters; broaden 001 only | newInfoRatio collapsed + all questions answered+ranked | **This is the gap you are filling** |

### 2.2 Blockers Encountered
**Blockers:** none open. All resolved during pass 1 (see Traps).

### 2.3 Files Modified / Created (all under `.opencode/specs/system-spec-kit/028-memory-search-intelligence/`)
**Key files:** `spec.md`, `research/roadmap.md`, `research/research.md`, `{001..004}/research/research.md`

| File | Change Summary | Status |
| --- | --- | --- |
| `spec.md` | Phase-parent control trio; continuity `completion_pct:100`; phase map Complete | complete |
| `description.json`, `graph-metadata.json` (parent + 4 children) | generated + backfilled | complete |
| `001-speckit-memory/` | 7 iterations → `research/research.md` (21 candidates) | complete |
| `002-code-graph/` | 4 iterations → `research/research.md` (~13) | complete |
| `003-skill-advisor/` | 4 iterations → `research/research.md` (9) | complete |
| `004-deep-loop/` | 4 iterations → `research/research.md` (11) | complete |
| `research/roadmap.md` (= `research/research.md` copy) | cross-cutting roadmap, 6 spine themes, ~54 candidates | complete |

### 2.4 Traps & Scar Tissue
| Trap / blast site | Activation condition | Load-bearing or defensive? | How to avoid re-paying it |
| --- | --- | --- | --- |
| **Per-agent ~10-min (600s) timeout** | An iteration agent asked to cover 3-4 questions of deep *design synthesis*, ×3 in parallel → API contention → socket-closed, **zero artifacts written** (externalized state stayed clean) | Load-bearing | Keep each iteration to **≤2 questions**, tell the agent "target 6-9 tool calls, finish in ~6-7 min." Tight scope finished in ~180-235s. |
| **Reducer hard-fails "Missing anchor section"** | A freshly-copied `deep_research_strategy.md` lacks the 7 `<!-- ANCHOR:* -->` markers (key-questions, answered-questions, what-worked, what-failed, exhausted-approaches, ruled-out-directions, next-focus) that `reduce-state.cjs` `replaceAnchorSection` requires | Load-bearing | The existing 4 child strategies ALREADY have the anchors (hand-patched). If you spin a NEW strategy, add all 7 anchor pairs. **NB: this IS roadmap finding 004-Q6 — the #1 ship-first FIX.** |
| **aionforge docs path** | Agents default to repo-root `external/` (gitignored/absent) and report "missing dependency" | Defensive | Always give the exact path: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/external/aionforge-memory-development/docs/` |
| **`completed-continue` lineage is DEFERRED** | Trying to `resume` a child whose `config.status=="complete"` | Load-bearing | To broaden, either (a) **manual append** — flip `config.status` back to `"in_progress"` and keep appending `iteration-N+1` (what this campaign did), or (b) `restart` lineage (archives packet, gen+1). Prefer (a). |
| **Standalone memory index = 2nd writer corruption** | Running `generate-context.js` Step 11.5 while the `mk-spec-memory` daemon holds the single-writer lock on `context-index.sqlite` | Load-bearing | It auto-SKIPS and tells you to finish via MCP: `memory_index_scan({ specFolder: "system-spec-kit/028-memory-search-intelligence" })`. Indexer only picks up `research/research.md` (not `roadmap.md`). |
| **generate-context.js schema** | `recent_context` as a string, or unknown `tags` field | Defensive | `recent_context` MUST be an array of strings; no `tags` field. |
<!-- /ANCHOR:context-transfer -->

---

<!-- ANCHOR:next-session -->
## 3. For Next Session

### 3.1 Recommended Starting Point
- **File:** `.opencode/specs/system-spec-kit/028-memory-search-intelligence/research/roadmap.md` (read it first — it is the spine you are hardening)
- **Next safe action:** Run a **Round A — adversarial verification** pass. The roadmap's most load-bearing claims are its cross-system reuse mappings, and the synthesizers marked them **inferred**. Verify them against live code BEFORE any new mining. Use the `deep-research` agent type, ≤2 claims per agent, parallel across subsystems.
- **Cold-read order:** 1. this `handover.md` → 2. `research/roadmap.md` → 3. the four `{NNN}/research/research.md` → 4. (only if continuing a child) that child's `research/deep-research-strategy.md` + last `iterations/iteration-NNN.md`.
- **Context:** This is research-only. Agents are LEAF (no sub-dispatch), produce 3 artifacts per iteration, propose candidates (never implement).

### 3.2 Priority Tasks Remaining (the broadening plan)
1. **Round A — Adversarial verification of inferred claims (highest value, do first).** Each is a hypothesis until the cited code is opened:
   - **Memory `fuseResultsMulti {bonusOverChannels}` is importable by Skill Advisor (003-C3) AND Code Graph (002-Q8).** Read the actual signature in `.opencode/skills/system-spec-kit/.../shared/algorithms/rrf-fusion.ts` and confirm `LaneMatch`/code-graph items map onto `RrfItem`. This underpins the whole determinism spine.
   - **003-C4 outcome→shadow-weight→shadow-recommendation is ONE wired path** (3 shadow features were seen separately: `advisor-validate.ts:502`, `feedback-calibration.ts:154`, `lane-registry.ts:71-74`). Trace a single runtime path or downgrade C4.
   - **002-Q1-C1 "low conflict-risk":** the cross-file CALLS resolver + `pruneDanglingEdges` interaction was never read end-to-end (the agent's own most-likely-wrong claim).
   - **004-D3 convergenceThreshold 0.03 re-baselining** is unmeasured; **001** k=40-vs-60 + convergence-bonus channel-interdependence + FSRS-reinforcement-preservation are unverified.
2. **Round B — Deeper external mining (genuinely new surface).** Pass 1 read only ~5 of aionforge's ~20 docs. UNREAD and promising: `capture.md`, `concurrent-merge.md`, `core-memory.md`, `audit-subgraph.md`, `agent-nudges.md`, `apple-container.md`, `trust-model.md`. And **galadriel was only deepened for 001** — mine `harness/` + `memory/` for 002/003/004.
3. **Round C — Per-candidate feasibility / migration-risk** for the top picks (what speaks the old contract; sequencing; the Code Graph `code-graph-db.ts` shared-transaction-boundary cluster).
4. **Re-synthesize:** after each round, run `reduce-state.cjs` per touched child, refresh each `research.md`, then refresh `research/roadmap.md` + `research/research.md`, then `memory_index_scan`.

### 3.3 Critical Context to Load
- [ ] Roadmap + 4 child reports (above).
- [ ] The machinery recipe in §5 (how to drive one iteration).
- [ ] Continuity: parent `spec.md` `_memory.continuity` (already `completion_pct:100` for pass 1 — set to a broadening value when you start).
<!-- /ANCHOR:next-session -->

---

<!-- ANCHOR:validation-checklist -->
## 4. Validation Checklist
Before YOUR handover (end of broadening):
- [ ] Each touched child `research/research.md` refreshed; `deep-research-state.jsonl` has one `type:iteration` record per new iteration with a terminal stop reason.
- [ ] `research/roadmap.md` + `research/research.md` re-synthesized; inferred claims re-tagged confirmed/refuted.
- [ ] `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/028-memory-search-intelligence --strict` → parent PASSED (children carry the research-packet FILE_EXISTS exemption).
- [ ] `memory_index_scan({ specFolder: "system-spec-kit/028-memory-search-intelligence" })` → 0 failed.
- [ ] Continuity updated (parent `spec.md` `_memory.continuity`) and this handover refreshed.
<!-- /ANCHOR:validation-checklist -->

---

<!-- ANCHOR:session-notes -->
## 5. Session Notes

**Headline findings to preserve (don't re-derive):**
- Dominant pattern = **PROMOTE-the-off-state-flag, not build-new** (Memory already has temporal edges `SUPERSEDES`/`CONTRADICTS`, idempotency receipts, deferred save — all flag-gated OFF; Skill Advisor has a shadow pipeline).
- **Determinism is the strongest unifying spine** (RRF byte-identical fusion + content-addressed IDs + decay-at-rank-time + stable serialization) and unlocks galadriel prompt-cache savings. Memory recall serialization (`lib/response/envelope.ts`) is bare `JSON.stringify` w/ clock-derived tiebreak; Skill Advisor fusion (`fusion.ts:366`) is a weighted SUM not RRF.
- **Live framework bug** (004-Q6, #1 ship-first FIX): the `deep_research_strategy.md` template ships without the ANCHOR markers `reduce-state.cjs` needs — self-corroborated by this campaign's own driver.
- Top-3 ship-first: 004 reducer-anchor FIX → Memory C2-C (query-class gating) → Memory C3-A (flip `SPECKIT_TEMPORAL_EDGES` on).

**THE MACHINERY — how to drive ONE iteration (manual orchestration):**
Per child, per iteration N (paths relative to repo root `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public`; `SF=.opencode/specs/system-spec-kit/028-memory-search-intelligence/<child>`):
1. (Once, to resume a complete child) flip `SF/research/deep-research-config.json` `status` → `"in_progress"`; acquire lock: `node .opencode/skills/deep-loop-runtime/scripts/loop-lock.cjs acquire --lock-path "$SF/research/.deep-research.lock" --packet-id "$SF"`.
2. Convergence gate: `node .opencode/skills/deep-loop-runtime/scripts/convergence.cjs --spec-folder "$SF" --loop-type research --session-id "<sessionId>"` (returns CONTINUE on empty graph — fine). Also: CONTINUE while `iteration_count < maxIterations` AND there are open questions.
3. Dispatch a `deep-research` LEAF agent (Agent tool, `subagent_type:"deep-research"`) with a TIGHT prompt: ≤2 questions, the exact aionforge docs path, "target 6-9 tool calls, finish ~6 min", and the OUTPUT CONTRACT (3 artifacts): `research/iterations/iteration-NNN.md`; append ONE `{"type":"iteration","iteration":N,"newInfoRatio":..,"status":"insight","focus":..,"answeredQuestions":[..],"findingsCount":..,"sessionId":..,"generation":1,"graphEvents":[..]}` line to `research/deep-research-state.jsonl`; `research/deltas/iter-NNN.jsonl`.
4. Reduce: `node .opencode/skills/deep-loop-workflows/deep-research/scripts/reduce-state.cjs "$SF"` (refreshes registry/dashboard/strategy machine-owned sections; REQUIRES the 7 strategy anchors).
5. Decide CONTINUE/STOP from the rolling newInfoRatio (threshold 0.02 for 001, 0.03 for siblings) + remaining questions. Run children in parallel (one agent each per round), reduce each after.
6. Synthesis: dispatch a `general-purpose` agent to read all `iterations/*.md` + strategy → (re)write `research/research.md`. Then append a `{"type":"event","event":"synthesis","stopReason":"converged",...}` line, set config `status:"complete"`, reduce, release lock.

**Parallelism rule:** up to 4 iteration-agents concurrently (one per child) is safe and fast; do NOT parallelize iterations *within* one child (each reads prior state). Keep parallel agents tightly scoped to avoid the 10-min timeout.

**Iteration ledger (pass 1):** 001 ratios 0.92→0.78→0.72→0.62→0.72→0.55→0.25 (7); 002 0.92→0.78→0.62→0.45 (4); 003 0.90→0.78→0.60→0.42 (4); 004 0.92→0.78→0.60→0.42 (4). Total 19.

**The plan file** for the whole effort: `/Users/michelkerkmeester/.claude-account2/plans/analyze-users-michelkerkmeester-mega-dev-iridescent-salamander.md`.
<!-- /ANCHOR:session-notes -->

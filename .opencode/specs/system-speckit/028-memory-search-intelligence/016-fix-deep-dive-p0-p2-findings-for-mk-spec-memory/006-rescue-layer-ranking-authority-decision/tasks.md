---
title: "Tasks: Phase 6: Rescue-Layer Ranking Authority Decision"
description: "Task breakdown: baseline + verify-first for the five load-bearing findings, Part 1 eval-production parity, Part 2 A/B/C rescue authority benchmark and decision, contract encoding, and baseline-delta verification."
trigger_phrases:
  - "rescue layer ranking authority"
  - "eval production parity"
  - "lexical grounding dominance"
  - "verify first tasks"
  - "ablation rebind fix"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/016-fix-deep-dive-p0-p2-findings-for-mk-spec-memory/006-rescue-layer-ranking-authority-decision"
    last_updated_at: "2026-07-03T12:00:00Z"
    last_updated_by: "planning-session"
    recent_action: "Authored task breakdown with verify-first and finding citations"
    next_safe_action: "Start T001 baseline capture; no code changes before T001-T008 complete"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "planning-006-rescue-layer-ranking-authority-decision"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 6: rescue-layer-ranking-authority-decision

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`

Finding citations live HERE in tasks.md metadata comments, never in code comments (comment-hygiene HARD BLOCK). 🟡 findings are agent-verified hypotheses: their verify-first task MUST pass before the corresponding fix task starts (finding-is-a-hypothesis rule).
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Capture vitest whole-gate baseline (full run, counts + failures recorded to scratch/baseline-vitest.txt) (mcp_server test suite)
  <!-- meta: baseline-before-delta program rule; no code change may precede this -->
- [ ] T002 Capture current eval + ablation output on 3 probe queries; label artifacts "pre-parity (legacy hybridSearch monolith)" (scratch/baseline-eval-legacy.md)
  <!-- meta: source=ledger Agent C CONTRACT (eval-reporting exercises legacy monolith); these numbers are the last of the legacy era, never compared across the parity boundary -->
- [ ] T003 [P] Pin the fixed benchmark query set + gold expectations: resume-style, packet-status, verbose-conceptual (zero-lexical), exact-token, and 026-class queries (scratch/benchmark-matrix.md)
  <!-- meta: source=phase-decomposition §006 "A/B via fixed query set + prod-mode completeRecall@3"; matrix axes from plan.md FIX ADDENDUM -->
- [ ] T004 🟡 VERIFY-FIRST: rescue overwrite mechanics: 0.03/0.78 blend at retrieval-rescue.ts:210, apply site stage2-fusion.ts:1425, default ON, validation multiplier :1470 runs after; pull 026 packet lineage for the original motivation (lib/search/rerank/retrieval-rescue.ts, lib/search/pipeline/stage2-fusion.ts)
  <!-- meta: source=report Chain D + ledger Agent G P1 (🟡); class=algorithmic; blocks T013-T015 -->
- [ ] T005 🟡 VERIFY-FIRST: eval harness exercises legacy hybridSearch() with its own co-activation + truncation, diverging from executePipeline composition (handlers/eval-reporting.ts, lib/search/hybrid-search.ts)
  <!-- meta: source=ledger Agent C CONTRACT + report §7 Wave-2 item 11; class=cross-consumer; blocks T009 -->
- [ ] T006 🟡 VERIFY-FIRST: ablation DB swap leaves graphSearchFn closure over closed startup connection after restore; rebindDatabaseConsumers reuses the ref; concurrent searches can hit the eval DB (handlers/eval-reporting.ts:138, core/db-state.ts)
  <!-- meta: source=report §3 P1 #25 + ledger Agent G P1 (🟡); class=class-of-bug (stale-binding after swap); blocks T010 -->
- [ ] T007 🟡 [P] VERIFY-FIRST: eval DB path resolution is cwd-dependent (run from repo root vs unrelated cwd, compare resolved paths) (handlers/eval-reporting.ts)
  <!-- meta: source=phase-decomposition §006 "eval DB path cwd dependence (G contract)"; class=path-handling; blocks T011 -->
- [ ] T008 🟡 [P] VERIFY-FIRST: composite-scoring + interference-scoring have zero production callers (only importer attention-decay.ts, itself dead); interference O(folder^2) Jaccard runs on the write path feeding a column nothing reads; memory-search.ts:711 hardcodes interferenceApplied:false (lib/scoring/composite-scoring.ts, lib/scoring/interference-scoring.ts, lib/cognitive/attention-decay.ts)
  <!-- meta: source=report §3 P1 #15 + ledger Agent C P1 (🟡); class=cross-consumer; blocks T018 -->
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T009 [B:T005] Part 1: route eval-reporting + ablation through executePipeline with prod-mode composition incl. render-floor K=3 truncation (handlers/eval-reporting.ts)
  <!-- meta: REQ-001; source=phase-decomposition §006 Task 1 + report §7 Wave-2 item 11; truncation law per ledger Agent A "prod render floor K=3 taxes retrieval candidates" -->
- [ ] T010 [B:T006] Part 1: fix ablation DB-swap restore so rebindDatabaseConsumers rebuilds graphSearchFn (no closed-connection closure; no concurrent reads of eval DB) (core/db-state.ts, handlers/eval-reporting.ts)
  <!-- meta: REQ-002; source=report §3 P1 #25 + ledger Agent G P1 -->
- [ ] T011 [B:T007] Part 1: resolve eval DB path against package/repo root, not cwd (handlers/eval-reporting.ts)
  <!-- meta: REQ-003; source=phase-decomposition §006 (G contract) -->
- [ ] T012 Part 1 gate: parity assertion test proving eval path == production executePipeline composition for the same query + config; add ablation round-trip test and two-cwd path test (mcp_server tests)
  <!-- meta: REQ-001/002/003 acceptance; permanent members of the vitest gate -->
- [ ] T013 [B:T004,T012] Part 2: implement flag-gated variants: B rescue as bounded additive delta / injected-rows-only; C rescue as floor only below a base-score threshold; defaults unchanged (lib/search/rerank/retrieval-rescue.ts, lib/search/pipeline/stage2-fusion.ts, search flags)
  <!-- meta: REQ-004 prerequisite; program rule: behavior-changing ranking work behind flags because 006 requires A/B -->
- [ ] T014 [B:T003,T013] Part 2: run the A/B/C benchmark on the parity harness; record per-variant prod-mode completeRecall@3 + deltas vs current default; record secondary MRR + latency (not gated); record corpus snapshot stats (scratch/benchmark-results.md)
  <!-- meta: REQ-004; success gate "decision-record with benchmark deltas" per phase-decomposition §006 -->
- [ ] T015 [B:T014] Part 2: decide per ADR-002 decision gates; flip ADR-002 Proposed -> Accepted with measured deltas; set production defaults to the accepted option; remove or document losing variant flags (decision-record.md, search flags)
  <!-- meta: REQ-005; the phase centerpiece -->
- [ ] T016 [B:T015] Encode the signal-ordering contract as a test: ranking-relevant steps run post-rescue or are folded into the accepted blend; assert documented tie policy on all-equal-overlap plateaus (mcp_server tests)
  <!-- meta: REQ-006; source=phase-decomposition §006 "encode signal-ordering contract in stage2 docs + a test asserting the contract" -->
- [ ] T017 [B:T015] Align stage2 docs with behavior: rewrite the 13-step header (stage2-fusion.ts:21, :1011) and pipeline/README.md to the accepted contract; update rescue-dominance tests to assert the accepted semantics (lib/search/pipeline/stage2-fusion.ts, lib/search/pipeline/README.md)
  <!-- meta: REQ-007; source=report Chain D "stage2's own architecture doc still presents the 13-step stack as the ranking authority" -->
- [ ] T018 [B:T008,T015] Dead-battery disposition per ADR-003: wire composite/interference/attention-decay into the accepted contract OR delete them and the O(folder^2) write-path interference refresh; cross-check phase 009/010 expectations before delete (lib/scoring/, lib/cognitive/attention-decay.ts)
  <!-- meta: REQ-008; source=report §3 P1 #15 + ledger Agent C P1 -->
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T019 Re-run the WHOLE vitest gate; report delta vs T001 baseline (counts, new failures, fixed failures) (scratch/delta-vitest.md)
  <!-- meta: REQ-009; baseline-before-delta program rule -->
- [ ] T020 Computed-but-discarded sweep across stage2: every surviving computed-but-unused signal carries an explicit doc note, or its computation is removed (lib/search/pipeline/stage2-fusion.ts)
  <!-- meta: REQ-010; success gate "no signal computed-but-discarded without an explicit doc note" -->
- [ ] T021 Run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <this-folder> --strict`; complete checklist.md with evidence; update implementation-summary.md with benchmark deltas and final state (this spec folder)
  <!-- meta: completion verification rule; SC-001..SC-005 -->
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:ai-protocol -->
## AI EXECUTION PROTOCOL

### Pre-Task Checklist
- [ ] spec.md §3 scope and §4 requirements read for the task at hand
- [ ] T001 baseline exists before ANY code change (baseline-before-delta)
- [ ] Blocking tasks (`[B:Txxx]`) confirmed complete before starting a dependent task
- [ ] For 🟡 tasks: verify-first evidence recorded before the paired fix task starts

### Execution Rules

| Rule | Requirement |
|------|-------------|
| TASK-SEQ | Execute in listed order; T004-T008 verify-first gate their fix tasks; T012 gates T013+ |
| TASK-SCOPE | Touch only files named in spec.md §3 Files to Change; adjacent bugs get logged for 007/010, not fixed here |
| TASK-EVIDENCE | Every completed task cites file:line, command output, or artifact path |
| TASK-FLAGS | Variants B/C stay flag-gated with unchanged defaults until ADR-002 is Accepted |

### Status Reporting Format
Report per task: `T### | done/blocked | evidence: <file:line, test name, or artifact path>` plus the vitest delta vs baseline at Phase 3.

### Blocked Task Protocol
Mark the task `[B]` with the blocker named inline, record it in `_memory.continuity.blockers`, and stop rather than improvise around a verify-first refutation. If implementation evidence contradicts the plan (e.g., a 🟡 finding is refuted), halt and route through a LOGIC-SYNC escalation instead of a silent workaround.
<!-- /ANCHOR:ai-protocol -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed (parity assertion, benchmark table recorded, ADR-002 Accepted, contract test green, doc alignment confirmed)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md` (FIX ADDENDUM: AFFECTED SURFACES owns the inventories and matrix axes)
- **Decision Record**: See `decision-record.md` (ADR-001 parity, ADR-002 authority centerpiece, ADR-003 contract + battery)
- **Research**: `../research/deep-dive-report.md`, `../research/findings-ledger.md`, `../research/phase-decomposition.md` (§006)
<!-- /ANCHOR:cross-refs -->

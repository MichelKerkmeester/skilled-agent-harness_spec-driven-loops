# Review Report: Packet 031-deep-loop-issues-with-gpt-opencode (glm-max lineage)

> **Lineage:** `fanout-glm-max-1782930580740-aqrcsz` | **Executor:** cli-opencode / zai-coding-plan/glm-5.2 | **Loop:** review, stopPolicy=max-iterations (10/10), convergenceThreshold=0 | **Target:** spec-folder `.opencode/specs/deep-loops/031-deep-loop-issues-with-gpt-opencode`

---

## 1. Executive Summary

| Field | Value |
|-------|-------|
| **Verdict** | **CONDITIONAL** |
| **Active P0** | 0 |
| **Active P1** | 3 (F001, F011, F012) |
| **Active P2** | 12 |
| **hasAdvisories** | true |
| **Stop reason** | maxIterationsReached (10/10) |
| **Dimension coverage** | 4/4 (correctness, security, traceability, maintainability) |
| **releaseReadinessState** | in-progress |

The packet's **substance is sound**: the FIX-5 closure decision is well-reasoned (phases 012/013), the route-proof validator and Mode-D fix are real and correctly attributed, the enforcement plugin is fail-open with no silent bypass, the benchmark's headline gate claims are precise and honest, and cross-runtime mirror parity holds. An explicit adversarial P0 hunt (iteration 9) found **no release-blocking correctness, security, or spec-contradiction issue**.

The **CONDITIONAL** verdict is driven entirely by documentation/metadata defects, not implementation defects. The three P1 findings cluster around one root cause: **derived/continuity metadata was not refreshed after the packet's final epochs and the flat-layout migration**, leaving broken navigation pointers (`packet_pointer`, `goal-prompt.md` citation, `last_active_child_id`, per-phase status) that contradict the canonical, correct phase map and the real filesystem. All implementations the metadata describes are real and verified.

---

## 2. Planning Trigger

**Routes to remediation planning** (`/speckit:plan` for fixes) — not a FAIL, because no P0 correctness/security failure exists; but not a PASS, because 3 active P1 findings are load-bearing navigation/metadata defects that should be resolved before the packet is treated as cleanly closed.

**Highest-leverage single action:** regenerate the packet's continuity/derived metadata via `generate-context.js` across the affected phases (002-006) and the root, which resolves F002, F004, F011, F012, F014, F015 in one pass. F001 (restore or de-cite `goal-prompt.md`) and F003 (stale "pending" prose) are surgical edits.

---

## 3. Active Finding Registry

### P1 — Required (3)

| ID | Title | Evidence | Dimension | First/Last |
|----|-------|----------|-----------|-----------|
| **F001** | Cited key_file `goal-prompt.md` missing from packet root | `spec.md:20,66`; `007/.../research.md:104` cites it as symptom-report source; `find` returns nothing; `graph-metadata.json:53-62` correctly omits it | traceability | 1/1 |
| **F011** | Phase 002 impl-summary obsolete nested numbering + broken packet_pointer | `002/impl-summary.md:12,15,16,23,43` → `.../001-deep-agent-router-and-orchestration/001-route-proof-validation` (not found); validator code is real (`post-dispatch-validate.ts:37,621`) | correctness/traceability | 6/6 |
| **F012** | Layout-migration drift systemic across phases 002-005 (broken nested packet_pointers) | `003/impl-summary.md:12`, `004/impl-summary.md:8`, `005/impl-summary.md:8` all → non-existent `001-.../00X` paths, off-by-one; phases 001+007-017 correct; `spec.md:74` declares flat | traceability | 7/7 |

### P2 — Suggestion (12)

| ID | Title | Evidence | Dimension |
|----|-------|----------|-----------|
| F002 | graph-metadata `last_active_child_id` stale (007 not 017) | `graph-metadata.json:137-138` vs `timeline.md:100-105` | traceability |
| F003 | spec.md prose calls phase 007 "(pending)" after Complete | `spec.md:66` vs `spec.md:84` | traceability |
| F004 | spec.md continuity key_files diverge from graph-metadata derived.key_files | `spec.md:20-25` vs `graph-metadata.json:53-62` | traceability |
| F005 | Phase 006 decision-record broken relative research path | `006/decision-record.md:11` (`../../research/research.md`); correct path in `006/spec.md:11,111` | correctness |
| F006 | Phase 006 fails `validate.sh --strict` (3 errors) in complete packet | validate.sh RESULT FAILED (missing impl-summary + 17 header + 15 anchor); `013/impl-summary.md:99` documents as accepted | correctness |
| F007 | Loop-guard state files accumulate unbounded, no expiry | `mk-deep-loop-guard.js:131-146` (writeLoopStateAtomic, no unlink on session end) | security |
| F008 | Guard blocking opt-in via env vars; default only warns | `mk-deep-loop-guard.js:233,246-250`; `spec.md:88` documents toggle | security |
| F009 | 017 checklist summary counts mismatch body (9/8/1 vs 12/10/1) | `017/checklist.md:123-125` vs body (grep: [P0]=12, [P1]=10, [P2]=1, [x]=23) | maintainability |
| F010 | Benchmark pass-count (7) doesn't reconcile with enumeration (8) or cell table | `012/benchmark-results.md:65-67` vs `:43-54` | correctness |
| F013 | prompt.md retains old Mode-D self-classification gate (documented residual) | `.opencode/commands/prompt.md:27-37`; `008/impl-summary.md:122` (limitation 3) | correctness |
| F014 | Phase 006 graph-metadata "planned" contradicts "Closed" decision-record/spec.md | `006/graph-metadata.json` vs `spec.md:83`; `006/decision-record.md:3` | traceability |
| F015 | Phase 014 graph-metadata "in_progress" contradicts spec.md "Complete" | `014/graph-metadata.json` vs `spec.md:91` (014 has impl-summary+checklist) | traceability |

---

## 4. Remediation Workstreams

**Lane A — Metadata refresh (resolves F002, F004, F011, F012, F014, F015; highest leverage)**
- Run `generate-context.js` across phases 002-006 and the packet root to regenerate `packet_pointer`, `session_id`, `last_active_child_id`, and per-phase `graph-metadata` status against the real flat layout and completion state.
- Order: refresh child phases first, then root, so derived rollups are consistent.

**Lane B — Missing-source / stale-prose (resolves F001, F003, F005)**
- F001: restore `goal-prompt.md` at packet root OR update `spec.md` continuity `key_files` (line 20) + prose (line 66) to remove the citation and record its disposition.
- F003: update `spec.md:66` "phase `007` (pending)" → reflect Complete.
- F005: fix `006/decision-record.md:11` relative path to `../001-deep-agent-router-and-orchestration/research/research.md`.

**Lane C — Validation/summary-count accuracy (resolves F006, F009, F010)**
- F006: add a closing `implementation-summary.md` to phase 006 (or formally exempt never-implemented decision-only phases in validate.sh).
- F009: correct `017/checklist.md:123-125` summary to 12/10/1.
- F010: correct `012/benchmark-results.md:65-67` pass count to match the enumeration/table.

**Lane D — Plugin advisories (resolves F007, F008, F013; lowest priority, P2)**
- F007: add max-file or session-end cleanup for `.loop-guard-state/`.
- F008: document the default-warn/opt-in-block distinction prominently.
- F013: apply the DISPATCH-CONTEXT CHECK migration to `.opencode/commands/prompt.md` (the documented residual from phase 008).

---

## 5. Spec Seed

Minimal spec delta implied by the findings (for a hypothetical remediation packet):
- Scope: refresh packet 031's continuity/derived metadata to match the flat layout and completion state; de-cite or restore `goal-prompt.md`; correct four stale prose/summary/count defects.
- Non-goals: re-litigate the FIX-5 closure (sound), re-run the benchmark (out of scope), change any implementation.
- Success criteria: `validate.sh --strict` passes on all child phases; `packet_pointer` fields resolve for every phase; graph-metadata status matches the phase map; no cited key_file is missing.

---

## 6. Plan Seed

Action-ready remediation tasks:
1. `T1` — Run `generate-context.js` on phases 002, 003, 004, 005, 006, 014 and the packet root (Lane A). Verify `packet_pointer` resolves for all 17 phases.
2. `T2` — Resolve `goal-prompt.md` (restore or de-cite in `spec.md:20,66`) (Lane B / F001).
3. `T3` — Fix `spec.md:66` "pending" → Complete; fix `006/decision-record.md:11` path (Lane B / F003, F005).
4. `T4` — Add 006 closing summary (or exempt decision-only phases); correct 017 checklist + 012 benchmark counts (Lane C / F006, F009, F010).
5. `T5` — (Optional, P2) prompt.md Mode-D migration + loop-guard state cleanup + enforcement doc (Lane D / F007, F008, F013).

---

## 7. Traceability Status

| Protocol | Level | Status | Evidence |
|----------|-------|--------|----------|
| `spec_code` | core/hard | **partial** | Implementations are real and verified (route-proof validator, Mode-D fix, plugin registry coupling). FAILS on documentation fidelity: cited key_file missing (F001), systemic broken packet_pointers (F011/F012). |
| `checklist_evidence` | core/hard | **partial** | 017 checklist: all 23 `[x]` items carry inline evidence (strong); summary count inaccurate (F009). 006 has no checklist (decision-only). |
| `feature_catalog_code` | overlay/advisory | **partial** | Plugin two-check design (mode mismatch + loop repeat) matches F050/catalog claims and 017's checklist; `resolveTargetIdentity` correctly fixes the `subagent_type="general"` no-op. Advisories F007/F008. |
| `agent_cross_runtime` | overlay/advisory | **pass** | deep.md (104/91-line) and ai-council.md divergence is intentional runtime-specific frontmatter (OpenCode `mode`/`permission` vs Claude `tools`); matches 010 decision-record rationale. |
| `playbook_capability` | overlay/advisory | notApplicable | No executable playbook scenarios in this spec-folder review's observation-only scope (DLR-052 is a manual-testing playbook, not executed here). |
| `skill_agent` | overlay/advisory | notApplicable | Target is a spec-folder packet, not a skill; deep-review agent parity checked indirectly via registry coupling (iter 3). |

**Unresolved gaps:** the `spec_code` partial is the load-bearing one — F001/F011/F012 mean the packet's own navigation/citation layer does not fully resolve, even though the implementations it points to do.

---

## 8. Deferred Items

- **F013** (prompt.md Mode-D residual): deferred — documented in phase 008 limitation 3; `/prompt` is not a deep-loop command so the original Mode-D misfire surface doesn't directly apply. Revisit if a `/prompt`-driven dispatch ever exhibits the false-positive block.
- **F007/F008** (plugin advisories): deferred — intentional/documented design; low blast radius on a local dev tool.
- **Benchmark timeout cells (not a finding)**: phase 012's 2 `timeout_latency` cells were not retried with a longer window; the benchmark itself flags this as a reasonable low-cost follow-up if a fully conclusive command-level signal is wanted for research/review modes.
- **Codex parity**: out of scope (pre-existing TOML-location blocker, carried from research; not a defect introduced by this packet).

---

## 9. Audit Appendix

### Iteration Table
| Run | Focus | Dim | New | Ratio | Verdict |
|-----|-------|-----|-----|-------|---------|
| 1 | Traceability: cited key_files & graph-metadata parity | D3 | 1P1+3P2 | 0.62 | CONDITIONAL |
| 2 | Correctness: decision-record rationale & completion metadata | D1 | 2P2 | 0.20 | PASS |
| 3 | Security: mk-deep-loop-guard plugin trust boundaries | D2 | 2P2 | 0.18 | PASS |
| 4 | Maintainability: mirror parity, checklist evidence | D4 | 1P2 | 0.09 | PASS |
| 5 | Benchmark measurement-claim precision | D1 | 1P2 | 0.08 | PASS |
| 6 | Phase 002 continuity metadata drift | D1/D3 | 1P1 | 0.45 | CONDITIONAL |
| 7 | Systemic layout-migration drift sweep | D3 | 1P1 | 0.40 | CONDITIONAL |
| 8 | Mode-D fix substance & prompt.md residual | D1 | 1P2 | 0.09 | PASS |
| 9 | Adversarial P0 hunt & status consistency | D1/D3 | 2P2 | 0.18 | PASS |
| 10 | Coverage verification & convergence telemetry | all | 0 | 0.00 | PASS |

### Convergence Signal Replay
- Run governed by `stopPolicy: max-iterations`, `convergenceThreshold: 0` (convergence telemetry-only). All 10 iterations executed; angles broadened (no early synthesis).
- Telemetry composite: dimension coverage 1.0 (4/4); last-2-iteration ratio average 0.09 ≈ rolling-stop threshold 0.08; would have signaled convergence around iteration 10 under a convergence policy — consistent with the max-iterations mandate to broaden angles rather than stop early.
- No P0 override ever triggered (newFindingsRatio never reached the 0.50 P0 floor; highest single-iteration ratio 0.62 was severity-weighted P1, not P0).

### Claim Adjudication Replay
- 3 P1 findings adjudicated (F001 iter 1, F011 iter 6, F012 iter 7); all packets present and complete with counterevidence sought + alternative explanations recorded. No P0 findings to adversarially replay.

### File Coverage Matrix (sampled)
| File | Dimensions | Findings |
|------|-----------|----------|
| spec.md | D1,D3,D4 | F001,F003,F004 |
| graph-metadata.json | D3 | F002 |
| 006/decision-record.md | D1 | F005 |
| 006/graph-metadata.json | D1,D3 | F006,F014 |
| 002/impl-summary.md | D1,D3 | F011 |
| 003/004/005 impl-summaries | D3 | F012 |
| mk-deep-loop-guard.js | D2 | F007,F008 |
| 017/checklist.md | D4 | F009 |
| 012/benchmark-results.md | D1 | F010 |
| prompt.md | D1 | F013 |
| 014/graph-metadata.json | D3 | F015 |

### Methodology Note
This was one fan-out lineage (glm-max) of a parallel review. Findings are evidence-backed with `file:line` citations and, where load-bearing, independently verified via direct command (`ls`, `grep`, `validate.sh`, `diff`). The packet's own research/audit lineage (phases 014/015) was observed but not re-executed (observation-only review). No file under review was modified.

---

<!-- ANCHOR:verdict -->
**Final verdict: CONDITIONAL** — 0 P0, 3 P1 (metadata/navigation defects, all from one refreshable root cause), 12 P2 advisories. Packet substance is sound; CONDITIONAL until the metadata-refresh + missing-source remediation (Lanes A–B) lands.
<!-- /ANCHOR:verdict -->

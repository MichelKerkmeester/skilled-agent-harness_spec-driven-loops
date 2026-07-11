---
title: "Implementation Plan: Phase 1: Conformance Deep-Research"
description: "Runs one 15-iteration, 3-model /deep:research investigation across commands, /doctor, agents, and cross-surface logic, producing a single ranked research.md synthesis that phases 002-006 consume."
trigger_phrases:
  - "conformance deep research plan"
  - "15 iteration 3 model runbook"
  - "001-conformance-deep-research plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/131-command-agent-conformance-audit/001-conformance-deep-research"
    last_updated_at: "2026-07-11T08:49:19Z"
    last_updated_by: "fable-5"
    recent_action: "Executed and closed the 3-batch deep-research runbook"
    next_safe_action: "Phase complete; findings consumed by phases 002-006"
    blockers: []
    key_files:
      - ".opencode/specs/skilled-agent-orchestration/131-command-agent-conformance-audit/001-conformance-deep-research/research/research.md"
      - ".opencode/specs/skilled-agent-orchestration/131-command-agent-conformance-audit/001-conformance-deep-research/research/deep-research-config.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "conformance-audit-132"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Provider --variant handling was resolved via REQ-005 smoke-tests before each batch (see spec.md OPEN QUESTIONS)"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 1: Conformance Deep-Research

<!-- SPECKIT_LEVEL: 1 -->
<!--
SELF-CHECK:
- Confirm the plan names the simplest viable approach, affected surfaces, and verification path.
- Match phases to the stated scope; remove setup theater that does not change the outcome.
FAILURE MODES:
- Over-planning, missing rollback, and treating assumptions as dependencies.
-->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | No source code authored; investigation-only phase running against the existing `.opencode/commands/**`, `/doctor`, and agent surfaces |
| **Framework** | `/deep:research` (`system-deep-loop` research mode), driven through `cli-opencode` with 3 rotated executor providers |
| **Storage** | Packet-local `research/` artifact tree: `deep-research-state.jsonl` (append-only iteration log), `iterations/*.md`, `deltas/*.jsonl`, `dispatch-receipts/`, and the final `research.md` synthesis |
| **Testing** | `grep -c '"type":"iteration"' research/deep-research-state.jsonl` iteration-count gate; per-provider smoke-test before each batch; `research.md` cross-checked against all 15 iteration narratives |

### Overview
This phase runs a single auto-resumed `/deep:research` investigation, 15 iterations total, rotated across 3 executor batches of 5 (GPT-5.6-Sol-Fast high, Sonnet-5 xhigh, GLM-5.2 max), over the same `--spec-folder`. It confirms and expands six seed findings across commands, `/doctor`, agents, and cross-surface logic, then synthesizes every confirmed defect into one ranked, file:line-cited `research.md` that phases 002-006 remediate from.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented (spec.md SS2-3)
- [x] Success criteria measurable (spec.md SS5, iteration-count + finding-coverage based)
- [x] Dependencies identified (spec.md SS6: 3 executor providers, `/deep:research` runtime)

### Definition of Done
- [x] All 15 iterations logged, spanning the 3-batch executor rotation (confirmed via `iterations/` and `deltas/`, 15 files each; 2 of 15 `deep-research-state.jsonl` records used a spaced `"type": "iteration"` key style that the literal REQ-001 grep misses by count — see implementation-summary.md Known Limitations)
- [x] `research.md` synthesis authored: 30 findings (5 P0 / 9 P1 / 16 P2) partitioned by surface, each with file:line + fix
- [x] Docs updated: spec.md Status -> Complete, implementation-summary.md authored
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
N/A (research/investigation phase, not application architecture). The loop follows `system-deep-loop`'s research-mode state machine: seed strategy -> per-iteration dispatch to the `deep-research` leaf agent -> delta + narrative capture -> re-seed -> synthesis.

### Key Components
- **`research/deep-research-config.json`**: the loop's live config; edited between batches (`executor.model`, `executor.reasoningEffort`, `maxIterations`, `minIterations`) while `topic` + `specFolder` stayed byte-identical so the lineage auto-resumed across all 15 iterations.
- **`research/deep-research-state.jsonl`**: append-only iteration/event log consumed by monitoring (`status.cjs`, dashboard tail, `/doctor deep-loop`).
- **`research/iterations/` + `research/deltas/`**: per-iteration investigation narratives and structured delta artifacts (15 each), the authoritative source the synthesis was built from.
- **`research/research.md`**: the final deliverable — ranked, surface-partitioned, file:line-cited findings.

### Data Flow
Each iteration dispatches the `deep-research` leaf agent against the same topic and spec folder; the agent reads the current strategy seed, investigates its assigned surface-emphasis angle, and writes an iteration narrative plus a structured delta. Between batches only the executor config changed, so the loop treated all 15 iterations as one continuous investigation. At close, all 15 narratives were read back and deduplicated/severity-calibrated into `research.md`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Not applicable — this is an investigation-only phase (`research_intent` is research, not `fix_bug`). Zero audited source files were modified; the only writes were to this child folder's own `research/` artifact tree (spec.md Scope Boundary).
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Deep-research runbook config seeded (`research/deep-research-config.json`, `research/deep-research-strategy.md`)
- [x] Batch 1 provider (GPT-5.6-Sol-Fast, high) smoke-tested before committing 5 iterations

### Phase 2: Core Investigation
- [x] Batch 1 (iters 1-5, GPT-5.6-Sol-Fast high): commands + doctor recon
- [x] Batch 2 (iters 6-10, Sonnet-5 xhigh): agent surface + deeper cross-surface pass
- [x] Batch 3 (iters 11-15, GLM-5.2 max): re-verification via direct `/doctor` execution + frontmatter deep-dive

### Phase 3: Verification
- [x] All six seed findings confirmed-or-corrected, plus new findings discovered per surface
- [x] `research.md` synthesis authored and cross-checked against all 15 iteration narratives
- [x] Documentation closed out (spec.md, implementation-summary.md)
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Structural | Iteration-count + lineage continuity | `grep -c '"type":"iteration"'`, `deep-research-dashboard.md` tail, `status.cjs` |
| Smoke | Per-provider `--variant` handling before each batch | One dispatch per model, reasoning-effort verified in the response |
| Cross-check | `research.md` claims vs source narratives | Manual read-back of all 15 `iterations/*.md` + `deltas/*.jsonl` against each finding |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `cli-opencode` reach for the 3 executor providers | External | Green | A batch cannot dispatch; mitigated by the pre-batch smoke-test (REQ-005) |
| `/deep:research` (`system-deep-loop`) runtime | Internal | Green | Loop cannot run; no observed issues across all 15 iterations |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: N/A — this phase wrote only packet-local research artifacts; no audited source file was touched, so there is nothing to roll back.
- **Procedure**: If the synthesis needed revision, re-run affected iterations or hand-edit `research.md`; no source-tree recovery is required.
<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->

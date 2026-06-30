---
title: "Feature Specification: Reusable, config-driven model-benchmark framework for deep-improvement"
description: "Phase parent: evolve the one-off prompt-framework benchmark rigs into ONE reusable, config/profile-driven, model/situation-agnostic benchmark framework that lives in the deep-improvement skill — researched (001), P0 MVP built (002), hardened through the P1 reliability tier (003), and given a hard-fixture capability-discrimination harness (004; the live M3-vs-MiMo verdict run is blocked by an opencode MCP dispatch hang and deferred with a documented re-run)."
trigger_phrases:
  - "127-reusable-model-benchmark-framework"
  - "phase parent"
  - "reusable benchmark framework"
  - "sweep-benchmark"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/102-reusable-model-benchmark-framework"
    last_updated_at: "2026-06-02T07:30:00Z"
    last_updated_by: "claude-opus"
    recent_action: "006 n=5 run shipped: M3 more reliable than MiMo (1.0 vs 0.891), reproduced across 004+006"
    next_safe_action: "Optional P2 only; framework + verdict complete across all 6 phases"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-127-parent"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Live OpenCode stream exposes token/cost usage (parsed + confirmed in 003)"
      - "Harder computational fixtures (005)? Saturated — both 1.0; difficulty alone does not separate them"
      - "Which is better, M3 or MiMo? M3 — reproduced across 004+006: M3 1.0/gate-eligible, MiMo ~0.89 with ~1-in-5 catastrophic fails"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT
  FORBIDDEN content (do NOT author at phase-parent level):
    - merge/migration/consolidation narratives (consolidate*, merged from, renamed from, collapsed, X→Y, reorganization history)
    - migrated from, ported from, originally in
    - heavy docs: plan.md, tasks.md, checklist.md, decision-record.md, implementation-summary.md — these belong in child phase folders only
  REQUIRED content (MUST author at phase-parent level):
    - Root purpose: what problem does this entire phased decomposition solve?
    - Sub-phase list: which child phase folders exist and what each one does
    - What needs done: the high-level outcome the phases work toward
-->

# Feature Specification: Reusable, config-driven model-benchmark framework for deep-improvement

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete (6 phases) — framework shipped; M3-vs-MiMo verdict certified (M3 more reliable, reproduced across 004+006) |
| **Created** | 2026-06-02 |
| **Branch** | `main` |
| **Parent Spec** | None (top-level packet in `skilled-agent-orchestration`) |
| **Parent Packet** | `skilled-agent-orchestration/z_archive/102-reusable-model-benchmark-framework` |
| **Predecessor** | `121-deep-agent-improvement-benchmark-mode` (Lane B), `126/004-mimo-prompt-framework-benchmark` (the lean one-off rig this generalizes) |
| **Successor** | None |
| **Handoff Criteria** | One profile benchmarks any model/situation by config (framework-bakeoff, model-vs-model, …); correctness is a gate so saturation cannot crown a winner; winner claims are CI/noise-floor gated; dispatch reports latency + nullable tokens/cost; the existing deep-improvement Lane B tests stay green throughout |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The repo's prompt-framework benchmarks are **one-off, model-specific rigs** (`120/003` MiniMax 7-fixture, `126/004` MiMo lean 2-fixture) that each re-implement fixtures + a dispatch wrapper + scoring. Packet `121` generalized *model-benchmark mode* into deep-improvement Lane B, but the prompt-framework bake-off, the fixture taxonomy, the multi-dimensional scoring, and the statistical rigor are **not yet a reusable framework** — every new model/technique/situation still needs new rig code. `126/004` also exposed **correctness-saturation** producing misleading "winners."

### Purpose
Build ONE reusable, **config/profile-driven**, model/situation-agnostic benchmark framework that lives in the `deep-improvement` skill — so benchmarking any model, prompt technique, reasoning level, or situation becomes a **profile**, not new code — built as an **additive extension of Lane B** (the existing tests stay green). Correctness is a **gate**, winner claims are **CI/noise-floor gated**, and a tiered fixture taxonomy fixes the saturation problem.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed design, planning, tasks, checklists, and implementation summaries live in the child phase folders below.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope (across phases)
- Research the design + roadmap (001).
- Build the P0 MVP: config-driven sweep (framework-bakeoff + model-vs-model by config), framework registry + slot renderer, correctness-gate, trustworthiness reporter (002).
- Harden through P1: paired-bootstrap-CI + noise-floor verdict, normalized dispatch envelope (latency + nullable tokens/cost + OpenCode JSON parsing), machine-readable provider capability fields, tiered fixture taxonomy, A–F modes operator guide (003).

### Out of Scope (P2 — roadmap)
- Mutation/hill-climb over framework axes; single-parent profile `extends`/overrides; per-executor cost parsers; capability-radar reducers; long-context/agentic fixture categories. (Documented in `001-design-research/research/research.md`.)

### Files to Change (aggregate — per-phase detail lives in child plans)
- New benchmark framework modules + data + profiles + fixtures + tests under `.opencode/skills/deep-improvement/scripts/model-benchmark/` and `.opencode/skills/sk-prompt/assets/`. The existing Lane B modules are extended additively or left untouched per phase.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder; all implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | 001-design-research/ | 10-iter deep-research (cli-codex gpt-5.5 high/fast) → the seam architecture, anti-saturation strategy, reuse-vs-net-new map, and the P0/P1/P2 roadmap | Complete |
| 2 | 002-p0-mvp-implementation/ | The P0 MVP: framework registry + slot renderer, profile validator, sweep matrix-expander (framework-bakeoff + model-vs-model by config, no mode branches), correctness-GATE, trustworthiness reporter (WINNER/TIE/INCONCLUSIVE), T3 fixtures, example profiles | Complete |
| 3 | 003-p1-reliability-and-dispatch/ | P1 reliability tier: paired-bootstrap-CI + noise-floor verdict, normalized dispatch envelope (latency + nullable tokens/cost + OpenCode JSON parsing), machine-readable capability fields, tiered fixture taxonomy, A–F modes operator guide | Complete |
| 4 | 004-capability-discrimination/ | Sweep cwd-isolation fix + hard partial-credit fixture pack (oracle-validated) + the live M3-vs-MiMo capability run (24 cells, 0 pollution): **M3 edges MiMo on reliability** — M3 perfectly consistent (gate-eligible), MiMo 0.898 from one 0.0 on roman-to-int. Verdict + caveats in the phase's `eval/synthesis.md` | Complete |
| 5 | 005-sharper-discrimination/ | Anti-saturation attempt (P2) via harder *computational* fixtures (semver-compare, normalize-path, int-to-words). De-risk gate result: all 3 SATURATED (both models 1.0) — harder compute doesn't separate them. Pivoted to validation (006). | Complete (negative result) |
| 6 | 006-strict-validation-fixtures/ | Validation-heavy fixtures (ipv4/date/semver-validate, invalid-dominant) + the n=5 run (40 cells, 0 pollution). Finding: **M3 more reliable** — M3 1.0 / gate-eligible (32/32 cells perfect across 004+006); MiMo 0.891 / gate-ineligible with a ~1-in-5 catastrophic-failure rate on hard validation. (The n=2 de-risk's "near-equivalent" read was a small-sample artifact, corrected at n=5.) Verdict in the phase's `eval/synthesis.md` | Complete |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before it is claimed complete.
- The framework is built ADDITIVELY: the existing deep-improvement Lane B vitest suite stays green at every phase.
- Use `/spec_kit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase.

### Phase Handoff Criteria

| From | To | Criteria |
|------|-----|----------|
| 001-design-research | 002-p0-mvp-implementation | `research.md` + P0 deltas available; design seams agreed |
| 002-p0-mvp-implementation | 003-p1-reliability-and-dispatch | MVP green (config-driven sweep + correctness gate + verdict); existing Lane B tests untouched |
| 003-p1-reliability-and-dispatch | 004-capability-discrimination | CI verdict + dispatch envelope + tiered fixtures shipped; vitest green |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- ~~Does the live OpenCode binary's event stream expose token/cost usage fields?~~ **Resolved (003):** yes — parsed and live-confirmed (39,395 in / 63 out on a real dispatch).
- Which P2 items (mutation/hill-climb, profile inheritance, capability radar, harder fixtures, OS-level dispatch kill, incremental result writes) are worth building? Open — 004 surfaced fixture saturation (3/4 at 1.0) and the dispatch-bounding gaps as the highest-value next targets.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: `001-design-research/`, `002-p0-mvp-implementation/`, `003-p1-reliability-and-dispatch/`, `004-capability-discrimination/`, `005-sharper-discrimination/`, `006-strict-validation-fixtures/`
- **Design + roadmap**: `001-design-research/research/research.md` + `research/deltas/deltas.jsonl`
- **Operator quickstart**: `.opencode/skills/deep-improvement/scripts/model-benchmark/SWEEP.md`
- **Graph Metadata**: `graph-metadata.json` (`derived.last_active_child_id` pointer)

---
title: "Phase Parent: GPT Reliability Fixes — Implement the 034 Recommendations"
description: "Implementation packet for the packet-034 research synthesis: land the ranked fix packages that make GPT executors use our commands, gates, workflows, agents, and routing correctly (like Claude does). Ten phases in dependency order — harness hardening, then the P0 Gate-3 precedence package (which unmasks the rest), then the P1 quick wins (render contract, dispatch receipts, progress records, routing offer), then the P2 structural work. Each phase names the 033 behavior-benchmark cells that must flip to accept it."
trigger_phrases:
  - "gpt reliability fixes"
  - "implement 034 recommendations"
  - "035 fixes"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "deep-loops/035-gpt-reliability-fixes"
    last_updated_at: "2026-07-03T13:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Phase-parent scaffolded with 10 phases mapped from the 034 synthesis"
    next_safe_action: "Execute phase 001 (benchmark harness hardening), then 002 (Gate-3 package)"
    blockers: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "035-parent-init"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Where does implementation live? A new packet (035), not 034 — 034 is research/closed and its synthesis explicitly hands off to an implementation packet."
      - "What order? Harness hardening first (trustworthy acceptance tests), then the P0 Gate-3 package (unmasks every other failure on shared cells), then P1 quick wins, then P2 structural — from the 034 independent ranking pass."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Phase Parent: GPT Reliability Fixes — Implement the 034 Recommendations

<!-- SPECKIT_LEVEL: phase -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | phase |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-03 |
| **Parent Packet** | None (top-level under deep-loops; implements 034-gpt-reliability-research) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

Packet 034 measured, diagnosed, and designed fixes for why GPT executors mis-use our systems where Claude succeeds: the systems are Claude-shaped — GPT executes the contract letter where Claude follows intent. This packet IMPLEMENTS the ranked fix packages from `../034-gpt-reliability-research/research/synthesis.md`. The 44 verified findings collapse into 13 fix packages, organized here into 10 phases in the synthesis's dependency order. Every phase closes a named set of findings and is accepted only when its 033 behavior-benchmark cells flip. Phase 001 hardens that acceptance harness first; phase 002 (the P0 Gate-3 package) lands next because the Gate-3 halts otherwise mask the failures the P1 phases fix on the same cells.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

**In scope:** implementing the fix packages across the executor-facing surfaces named per phase (root policy gates, command presentation/setup contracts, deep-loop workflow protocols + runtime, agent files, skill-advisor routing, hooks/injection, prompt-pack templates, mode registry, and the 033 benchmark instrument itself).

**Out of scope:** re-diagnosing (034 is closed); non-executor surfaces; landing all phases in one session — each phase ships and verifies independently.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

- **REQ-001**: Each phase implements exactly the findings named in its row of the PHASE DOCUMENTATION MAP; requirements live in each child `spec.md`.
- **REQ-002**: Dependency order is honored — 001 (harness) before any cell-flip claim; 002 (Gate-3) before the P1 phases are verified.
- **REQ-003**: The 033 behavior benchmark is the acceptance harness; each phase re-runs its cells (gpt-fast-med + gpt-fast-high) and keeps the Claude-native baseline leg green.
- **REQ-004**: Context/constraint findings F-003 and F-008, and the ranking-adjudication F-044, carry no code change and are recorded here, not phased.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

1. All 10 phases complete with their acceptance cells moved to the expected verdict and the baseline leg not regressed.
2. Every actionable 034 finding (41 of 44) is closed by exactly one phase; the 3 non-actionable findings are documented.
3. Full-packet strict validation clean at closeout.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Risk / Dependency | Handling |
|---|---|
| Regressing the Claude-native path | Baseline benchmark leg re-run and kept green after every phase |
| Ordering violated → masked failures | Gate-3 phase (002) gates verification of the P1 phases |
| Design drift from the 034 designs | The 034 iter-011/012/013/014 designs are the reference; verify quoted current-text before applying |
| Depends on 034 synthesis + designs | Committed and pushed (034 complete) |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Exact file targets per phase are fixed by the closed findings + the 034 design iterations; each phase's plan.md/tasks.md are authored at execution.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:phases -->
## 8. PHASE DOCUMENTATION MAP

Dependency-ordered. Effort and acceptance cells (033 behavior-benchmark ids) per phase.

| Phase | Status | Closes | Effort | Purpose · acceptance cells |
|-------|--------|--------|--------|----------------------------|
| [`001-benchmark-harness-hardening`](./001-benchmark-harness-hardening/spec.md) | Planned | F-014, F-025 | S | Make the 033 acceptance harness trustworthy BEFORE verifying fixes: detect rewritten fixture files (not just new ones), and remove the fixture-path token leak from the vague-ask prompts. Enables every later phase's cell-flip claims. |
| [`002-gate3-precedence`](./002-gate3-precedence/spec.md) | Planned | F-001, F-002, F-004, F-005, F-028, F-030, F-040 | M | **P0 — land first.** Autonomous-precedence bridge in the root gate + classifier `satisfiedBy`/`requiresGate3Prompt` API + 8-rule autonomous execution profile. Cells: RVB-008, RSB-008, ACB-004, IMB-004, IMB-005. |
| [`003-presentation-render`](./003-presentation-render/spec.md) | Planned | F-006, F-007, F-042 | S | Verbatim setup-render contract: START/END markers + "render only the marked block" + halt-render rule, mirrored across five commands. Cells: RVB-002, CXB-002, IMB-003 (D2). |
| [`004-dispatch-receipts`](./004-dispatch-receipts/spec.md) | Planned | F-010, F-011, F-012, F-013, F-041 | M | Unforgeable HMAC dispatch receipts written by the launch mechanism; validator requires them; route-proof fields become workflow-owned; CLI branches routed through the audited wrapper. Cells: RVB-007, RSB-005, RSB-007 (at medium effort). |
| [`005-progress-records`](./005-progress-records/spec.md) | Planned | F-015, F-016, F-017, F-018, F-031, F-043 | M | One shared additive `progress_record` JSONL type on real step transitions; council persists seats stepwise; context sweep settles as it goes. Cells: ACB-004, ACB-005, CXB-004; IMB-001-high partial credit. |
| [`006-routing-offer`](./006-routing-offer/spec.md) | Planned | F-023, F-024, F-026 | S-M | Sub-threshold "offer the workflow" path in Gate 2 + noun-gated phrase boosters for the natural phrasings + down-weight path-derived tokens. Cells: ACB-003, IMB-003, RSB-004. |
| [`007-agent-executor-contracts`](./007-agent-executor-contracts/spec.md) | Planned | F-019, F-020, F-021, F-022, F-039 | M | Top-of-file EXECUTOR CONTRACT block in the agent files; hoist Gate 3 + output templates out of the buried lower sections; codify the 7-rule GPT-safe authoring profile as a reference. Cross-class; prevents recurrence. |
| [`008-compiled-contract`](./008-compiled-contract/spec.md) | Planned | F-035, F-036, F-037, F-038, F-009 | L | Build-time compiled per-command execution contract (flatten the 14-file chain + 3-way setup authority into one artifact with a drift guard + typed refs) and a deterministic setup loader emitting one hydrated packet. Cross-class structural fix. |
| [`009-pacing-and-resume`](./009-pacing-and-resume/spec.md) | Planned | F-032, F-033, F-034 | L | Split the heaviest command into resumable sub-invocations; cache repeated prep; add a pacing contract and a conditional budget policy (extend visible-progress runs only, never stalls). Cell: IMB-001-high natural completion. |
| [`010-injection-slimming`](./010-injection-slimming/spec.md) | Planned | F-027, F-029 | S-M | Dedupe the double-injected root policy (symlinked, byte-identical); keep plugin briefs terse; defer command-irrelevant sections for autonomous runs. Reduces prompt salience competition across all GPT cells. |
<!-- /ANCHOR:phases -->

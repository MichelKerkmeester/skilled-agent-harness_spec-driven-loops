---
title: "Phase Parent: GPT Reliability Fixes — Unified Command-Contract Architecture"
description: "Implementation packet for the packet-034 research synthesis, restructured per the plan-review (58 verified gaps) into the unified command-contract architecture. Five phases in dependency order: acceptance + rollout foundation, the P0 Gate-3 precedence package with a concrete validator, the build-time compiled command contract (subsuming render + agent-contracts + compiled + injection), dispatch receipts + progress records, then retrofit + pacing + rollout completion. Each phase names the 033 behavior-benchmark cells that must flip to accept it, ships behind a per-command feature flag, and carries its plan-review gap-IDs in its risks."
trigger_phrases:
  - "gpt reliability fixes"
  - "implement 034 recommendations"
  - "035 fixes"
  - "command contract architecture"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/025-deep-loop-gpt-reliability/006-reliability-fixes"
    last_updated_at: "2026-07-03T16:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Restructured to unified command-contract architecture"
    next_safe_action: "Execute phase 001 (acceptance + rollout foundation), then 002 (Gate-3 + validator)"
    blockers: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "035-parent-restructure"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Where does implementation live? A new packet (035), not 034 — 034 is research/closed and its synthesis hands off to an implementation packet."
      - "Ten phases or the unified contract? The plan-review (GAP-58) found the plan fixed one defect in five fragments; the user approved collapsing them into one build-time compiled contract per command. Old→new mapping + full 58-gap absorption in context-index.md."
      - "What order? Foundation first (trustworthy harness + rollout kill-switch, both prerequisites for safe rewrites), then the P0 Gate-3 package with a real validator, then the compiled contract, then receipts + progress, then retrofit + pacing."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Phase Parent: GPT Reliability Fixes — Unified Command-Contract Architecture

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-03 |
| **Parent Packet** | None (top-level under deep-loops; implements 034-gpt-reliability-research) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

Packet 034 measured, diagnosed, and designed fixes for why GPT executors mis-use our systems where Claude succeeds: the systems are Claude-shaped — GPT executes the contract letter where Claude follows intent. This packet IMPLEMENTS those fixes. A 10-iteration plan-review (58 verified gaps, `plan-review/gap-synthesis.md`) found the original 10-phase plan fixed a single root defect — GPT can't reliably see a command's contract because it's distributed across ~14 files and weighted by file position — in five separate fragments, and shipped two blocker-class design holes plus a dropped rollout safety-belt. This packet therefore adopts the unified **command-contract architecture**: every command emits one build-time, self-contained, typed contract the executor reads first, with maintainers keeping the layered sources behind a drift guard. During execution the compiler (originally phases 003/005) proved research-sized and was carved into packet `036-command-contract-compiler`; **035 retains the three acute-fix phases** (001 acceptance + rollout core, 002 Gate-3 validator, 004 receipts + progress) that are implementable now, and 036 owns the structural compiler + retrofit + the deferred bridge/wiring. Old→new phase mapping and the full 58-gap absorption table are in `context-index.md`.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

**In scope:** implementing the fixes across the executor-facing surfaces (033 acceptance harness + rollout mechanism, root-policy Gate-3 + classifier + validator, the build-time command-contract compiler and its drift guard, dispatch-receipt + progress-record contracts, and the retrofit of the remaining commands + routing + pacing).

**Out of scope:** re-diagnosing (034 is closed); non-executor surfaces except where a phase names them; landing all phases in one session — each phase ships behind its feature flag and verifies independently against its named cells.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

- **REQ-001**: Each phase implements exactly the findings and plan-review gaps named in its child `spec.md`; the packet-wide gap→phase mapping is authoritative in `context-index.md`.
- **REQ-002**: Dependency order is honored — 001 (foundation: trustworthy harness + rollout mechanism) before any cell-flip claim or risky rewrite; 002 (Gate-3 + validator) before the contract phases are verified.
- **REQ-003**: The 033 behavior benchmark is the acceptance harness. Each phase re-runs its cells (gpt-fast-med + gpt-fast-high) with N≥3 for contested stall cells, records `primary_cause`/`secondary_cause` for any multi-cause cell, and keeps the Claude-native baseline leg green **except** for the documented non-green cells below. Latency claims compare the GPT leg against itself pre/post (D-007 host confound), never against the Claude host baseline.
- **REQ-004**: Every rewrite ships behind the phase-001 per-command feature flag with a byte-identical pre-035 fallback; a CI comparator gates promotion.
- **REQ-005**: Multi-cause cell ownership is fixed: ACB-004 med-halt → phase 002; ACB-004 high-stall → phase 004. The locked multi-cause list the runner may not collapse is {ACB-004, ACB-005, CXB-004}.
- **REQ-006**: Documented non-green baseline exceptions (GAP-05): ACB-005's council baseline includes a pre-existing confirm-halt/partial dimension — "baseline green" applies only to non-confirm cells.
- **REQ-007**: Non-actionable findings F-008 (constraint, addressed via the contract's confirm-render block) and F-044 (ranking process) carry no standalone phase. F-003 is reclassified actionable (phase 002).
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

1. All 3 acute-fix phases (001, 002, 004) complete with their acceptance cells at the expected verdict (N≥3 for contested stalls) and the baseline leg not regressed beyond the REQ-006 exceptions; the structural compiler/retrofit is tracked in 036.
2. Every actionable 034 finding (42, incl. reclassified F-003) is closed by exactly one phase; all 58 plan-review gaps are resolved per `context-index.md`.
3. Reliability improvements are scoped to the 32-scenario behavior-benchmark suite; no claim is made for prompts outside that set (GAP-40).
4. Full-packet strict validation clean at closeout.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Risk / Dependency | Handling |
|---|---|
| Regressing the Claude-native path | Per-command feature flag + byte-identical fallback (phase 001); CI comparator; baseline leg re-run each phase |
| Highest-blast-radius rewrites (Gate-3, contract compiler) with no kill switch | Rollout mechanism lands in phase 001 BEFORE 002 (GAP-47) |
| Source/compiled drift from the contract compiler | Drift-guard contract specified in phase 003 (GAP-55) |
| Two research-sized designs (contract compiler, pacing/resume) | Design-first REQs in phases 003 and 005; may spin into a 036 packet if they grow (GAP-53/54) |
| Per-phase concrete regression surfaces | Each child `spec.md` Risks table names its plan-review gap-IDs (GAP-50) |
| Depends on 034 synthesis + designs | Committed and pushed (034 complete) |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Phases 003 (contract compiler) and 005 (pacing/resume) have no 034 design iteration; their first REQ is design. If either exceeds an implementation phase's scope at design time, carve it into a sibling 036 design packet (GAP-53/54).
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:phases -->
## 8. PHASE DOCUMENTATION MAP

Dependency-ordered. Effort and acceptance cells (033 behavior-benchmark ids) per phase. Full old→new mapping and the 58-gap absorption table are in `context-index.md`.

| Phase | Status | Closes | Effort | Purpose · acceptance cells |
|-------|--------|--------|--------|----------------------------|
| [`001-acceptance-and-rollout-foundation`](./001-acceptance-and-rollout-foundation/spec.md) | Planned | F-014, F-025 + rollout mechanism | M | **Land first.** Make the 033 harness trustworthy (content-hash rewrite detection, path-free prompts, missing instrumentation, N≥3 for contested cells, full 32×3 re-score, stall-rate deltas, one non-GPT executor leg, CI baseline gate) AND build the rollout kill-switch (feature flag + byte-identical fallback + CI comparator + promotion rule). Enables every later cell-flip and makes the rewrites reversible. Cells: harness-internal + rollout smoke. |
| [`002-gate3-precedence-and-validator`](./002-gate3-precedence-and-validator/spec.md) | Planned | F-001, F-002, F-003, F-004, F-005, F-028, F-030, F-040 | L | **P0.** Autonomous-precedence bridge + a concrete `validateSpecFolderBinding()` the rule calls (GAP-16 blocker), enforced writeBoundary, prior_answer mode-gate, phase-parent resolution, `/doctor` precedence, `:confirm` vocab, child-agent propagation, and the 34-caller migration. High effort mandated + enforced. Cells: RVB-008, RSB-008, ACB-004-med, IMB-004, IMB-005. |
| [`003-dispatch-receipts-and-progress`](./003-dispatch-receipts-and-progress/spec.md) | Planned | F-010, F-011, F-012, F-013, F-015, F-016, F-017, F-031, F-041, F-043 | L | Engine-held HMAC receipts (key never leaves the engine process — GAP-23 blocker), pre-dispatch intent + post-dispatch completion countersign, atomic writes, route-field migration across 4 YAMLs, resumable key lifecycle, parent-owned receipt path; step-transition progress records with a work-anchored schema field, reducer allowlist, council stepwise writer. Embedded in the compiled contract. Cells: RVB-007, RSB-005, RSB-007, ACB-004-high, ACB-005, CXB-004; IMB-001-high partial. |
<!-- /ANCHOR:phases -->

> **Carved to 036:** the original phases 003 (command-contract compiler) and 005 (retrofit + pacing) were research-sized (design verdict + plan-review GAP-53/54) and moved to packet `036-command-contract-compiler`, together with the deferred `AGENTS.md` bridge and rollout emitter-wiring. 035 keeps the acute fixes (001, 002, 004). See `context-index.md`.

---

<!-- ANCHOR:related -->
## 9. RELATED DOCUMENTS

- `context-index.md` — restructure narration, old→new phase mapping, and the full 58-gap absorption table.
- `plan-review/gap-synthesis.md` + `plan-review/gap-registry.md` — the red-team that produced the restructure (58 verified gaps).
- `../034-gpt-reliability-research/research/` — the research packet (synthesis, findings-registry, design iterations 011-014) this packet implements.
<!-- /ANCHOR:related -->

---
title: "Tasks: P1 reliability tier — statistical rigor, dispatch envelope, capability + tiered fixtures"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "p1 reliability tasks"
  - "ci verdict dispatch envelope tasks"
  - "capability table tiered fixtures tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/127-reusable-model-benchmark-framework/003-p1-reliability-and-dispatch"
    last_updated_at: "2026-06-02T05:46:00Z"
    last_updated_by: "claude-opus"
    recent_action: "P1 reliability tier shipped (vitest 143); CI verdict + dispatch envelope + capability fields"
    next_safe_action: "Capability-discrimination follow-on (004) underway"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-127-003-tasks"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: P1 reliability tier — statistical rigor, dispatch envelope, capability + tiered fixtures

<!-- SPECKIT_LEVEL: 2 -->

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
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Add `bootstrapPairedDeltaCi` + `pairedWinRate` + `noiseFloorMad` to `lib/sweep-stats.cjs` (seeded resampling, Node stdlib, additive exports)
- [x] T002 Add `trustVerdictCI` to `lib/sweep-stats.cjs` — gate WINNER on N>=k AND margin>noiseFloor AND paired 90% CI excludes zero; else TIE('ci_overlaps_zero') / INCONCLUSIVE('insufficient_n') with reason
- [x] T003 Upgrade `lib/sweep-reporter.cjs` to compute the top-pair CI and use the gated verdict; `aggregate.json.verdict` carries `ci`/`n_samples`/`noise_floor`
- [x] T004 Add `tests/sweep-stats-ci.vitest.ts` (19); confirm WINNER<->TIE flips with separation; vitest 125 green (existing 56 + 19 + prior)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Extend `dispatch-model.cjs` with the normalized envelope (additive return fields: `latency_ms`/`executor`/`provider`/`model`/`variant`/`tokens_in`/`tokens_out`/`cost_usd`/`output`/`usage_parser_status`) — preserve every existing return key + `--agent` omission + `--variant` forwarding
- [x] T006 Add `parseOpencodeStream` to `dispatch-model.cjs` (OpenCode `--format json` event parser; tokens/cost null when absent, never fabricated); capture the envelope into rows in `sweep-benchmark.cjs`
- [x] T007 Add `tests/dispatch-envelope.vitest.ts` (18); vitest 143 green; run a real-dispatch smoke confirming the parser on a live stream (39,395 in / 63 out, cost 0) — close the research "usage unverified" caveat
- [x] T008 Add machine-readable `capability` objects (model_slug/default_variant/variant_flag/agent_policy/format_mode/quota_pool + honest variant_status) to `minimax-m3`/`minimax-2.7`/`mimo-v2.5-pro` in `sk-prompt/assets/model-profiles.json`
- [x] T009 Add tiered fixtures `t1-smoke-echo.json` + `t4-adversarial-tokenizer.json` (oracles validated through the real scorer); create `MODES.md` (six A-F modes as profile shapes); calibrate `default.json` `repeatabilityTolerance` 0 -> 0.03 with a calibration note
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Run `npx vitest run model-benchmark/tests/` -> 143 passed (original 56 Lane B + all sweep tests); confirm Lane B legacy behavior unchanged
- [x] T011 `node --check` on touched .cjs; `jq` on all touched/new JSON (model-profiles.json + both tiered fixtures jq-valid)
- [x] T012 `validate.sh --strict` on 003; reconcile spec.md Status -> Complete + continuity (completion_pct 100); note 004-capability-discrimination as the successor
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->

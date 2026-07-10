---
title: "Tasks: Comprehensive Deep Review — sk-design"
description: "Task ledger for the 20-iteration comprehensive deep review and remediation of sk-design."
trigger_phrases:
  - "sk-design comprehensive review tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-design/009-sk-design-claude-parity/027-comprehensive-deep-review"
    last_updated_at: "2026-07-09T09:10:00.000Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "All tasks complete, verified with real evidence"
    next_safe_action: "None — packet complete"
    blockers: []
    key_files:
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-design-009-027"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Comprehensive Deep Review — sk-design

<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

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

- [x] T001 Init review packet: config/state/strategy/findings-registry, coverage-graph seed, loop lock. `review_target_type=skill`, `maxIterations=20`, executor `cli-opencode`/`openai/gpt-5.5-fast`/`high`.
- [x] T002 Planned the 20-iteration area×dimension wave rotation (inventory + hub×4 + interface/foundations×4 + audit/motion×4 + transport+md-generator×4 + md-generator/cross-hub/synthesis×3) and documented it in `deep-review-strategy.md`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Iteration 1 (solo): inventory pass. Corrected the `design-md-generator` sampling baseline (172 in-scope files excluding node_modules, not 2847). 0 P0/1 P1.
- [x] T004 [P] Wave 1 (iters 2-5, 4 parallel, ~346s wall-clock): hub tier + hub-level cross-cutting dirs. 6 open findings cumulative (4 P1, 2 P2).
- [x] T005 [P] Wave 2 (iters 6-9, 4 parallel): `design-interface` + `design-foundations`. 14 open findings cumulative (6 P1, 8 P2) — includes the tool-surface-parity investigation resolving into P1-009-001.
- [x] T006 [P] Wave 3 (iters 10-13, 4 parallel): `design-audit` + `design-motion`. 22 open findings cumulative.
- [x] T007 [P] Wave 4 (iters 14-17, 4 parallel): `design-mcp-open-design` (combined) + `design-md-generator` backend (3 iterations, including the P1 output-boundary finding). 26 open findings cumulative, convergenceScore 0.92.
- [x] T008 [P] Wave 5 (iters 18-20, 3 parallel): `design-md-generator` remaining coverage + cross-hub routing consistency (re-verification, found the systemic command-metadata pattern) + final sk-doc template sweep. 20/20 iterations complete.
- [x] T009 Cross-checked the automated findings registry against the raw `deltas/iter-*.jsonl` (dispatched to a dedicated agent) — found and corrected the same reducer bug confirmed twice earlier this session: an ID-collision (`P1-002` reused by iterations 4 and 5) and 2 fabricated `SUMMARY-*` placeholders masking 3 real findings. Corrected authoritative count: 32 findings (15 P1, 17 P2), not the registry's claimed 30.
- [x] T010 [P] Dispatched 9 area-scoped parallel fix agents covering all 32 findings, followed by 8 independent adversarial verify agents (hub+changelog combined into 1 verify pass).
- [x] T011 Closed gaps verification surfaced: (a) 3 same-bug-class findings discovered mid-remediation by the original fix agents (design-interface/md-generator command-metadata omission, 2 more benchmark reports with the same PASS/P1 pattern, an unrelated `ai-fingerprint-registry-check.mjs` bug) — closed via a dedicated follow-up fix agent; (b) P2-014-001's residual 3rd affected file (`feature_catalog/02--reading/read-only-content.md`) caught by the verify agent — closed directly.
- [x] T012 No hash-tracked compiled command contracts were affected by this packet's fixes (that mechanism is specific to `system-deep-loop`'s YAML-compiled contracts, not applicable to `sk-design`).
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T013 Fresh `package_skill.py --check` on all 6 mode packets (5 clean PASS, `design-interface` PASS with 1 non-blocking word-count advisory) + `parent-skill-check.cjs` on the hub (12/12 hard invariants PASS, 0 warnings), post-remediation.
- [x] T014 Live adversarial verification in place of generic vitest re-runs for the 2 security fixes: P1-001 (`design-md-generator`) confirmed via a fresh out-of-boundary probe + full backend suite 134/134 passing + `tsc --noEmit` clean; P1-003-001 (`shared/proof_check.py`) confirmed via a fresh absolute-path + traversal-path adversarial test, both rejected fail-closed, legitimate path still passing. P2-018-001's crawl-boundary claim independently verified with a live headless-Chromium probe including lookalike-domain adversarial cases.
- [x] T015 Wrote `review-report.md` (9 sections, real evidence), findings registry reflects 0 open / 35 resolved (32 original + 3 discovered), wrote `implementation-summary.md` and `checklist.md`, ran `validate.sh --strict` on this packet.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`.
- [x] No `[B]` blocked tasks remaining.
- [x] `validate.sh --strict` exits 0 for this folder.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Precedent**: `../../../system-deep-loop/052-deep-loop-unification/007-comprehensive-deep-review/`
<!-- /ANCHOR:cross-refs -->

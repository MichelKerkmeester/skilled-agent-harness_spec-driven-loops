---
title: "Tasks: Phase 12: behavior-benchmark-capture"
description: "Task breakdown for the deep-alignment DAB baseline capture: framework registration, fixture provisioning, the serial 11-cell claude-cli capture, the resolver P0 fix, three-pass GPT skeptic verification, and baseline population."
trigger_phrases:
  - "deep-alignment benchmark capture tasks"
  - "DAB capture task list"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/032-deep-alignment-mode/012-behavior-benchmark-capture"
    last_updated_at: "2026-07-12T14:40:00Z"
    last_updated_by: "claude"
    recent_action: "All capture tasks executed and verified"
    next_safe_action: "Operator sign-off on the resolver commit"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/deep-alignment/behavior_benchmark/baselines/claude-baseline.md"
      - ".opencode/skills/system-spec-kit/shared/review-research-paths.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-012-behavior-benchmark-capture"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
status: "complete"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 12: behavior-benchmark-capture

<!-- SPECKIT_LEVEL: 1 -->

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

- [x] T001 Register `deep-alignment`/`alignment`/`DAB` in `shared/behavior-benchmark/framework.md`; run the runner test suite. Evidence: modes list + mode enum + prefix table carry the alignment entries; runner suite green.
- [x] T002 Build the fixture corpus + three lane-configs; rename the instance folder kebab→snake and rewrite its self-references. Evidence: `fx_001_alignment_target` on disk; 26 committed refs resolve; 4 self-referencing files rewritten.
- [x] T003 Verify fixture resolution. Evidence: `scoping.cjs` exit 0 for all 3 lane-configs; sk-doc `check` spawns `validate_document.py` and detects the seeded P0 (bug #1 fix live), exit 0.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Smoke DAB-001 → reproduce the step-1 crash → root-cause. Evidence: `TypeError … received undefined` at `review-research-paths.cjs:314`; `MODE_CONFIG_FILE` lacked `alignment`.
- [x] T005 Apply the minimal additive fix (`alignment` in `MODE_CONFIG_FILE`/`MODE_STATE_FILE` + JSDoc union). Evidence: `resolveArtifactRoot(target,'alignment')` resolves; `review`/`research` byte-identical to pre-fix (control run).
- [x] T006 Re-smoke DAB-001 to PASS. Evidence: classification=pass, LEAF dispatched @266s, findings P0×2/P1×1/P2×1 match fixture design, read-only integrity held; recorded in `claude-baseline.md` DAB-001 row (`tFirstDispatch` 266s, `tTerminal` 862s).
- [x] T007 Drive the serial 11-cell capture, cleaning `<fixture>/alignment` between cells; recompute per-cell budgets. Evidence: 11 `result.json` with real `tTerminal`; budgets recomputed via `max(3·tTerminal,180000)` cap 900000.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 [P] GPT fix-verify (`gpt-5.6-sol-fast`) on the resolver change. Evidence: COMMIT GO — filenames match consumers, child-phase resolves fully, maps module-private, no key-iteration.
- [x] T009 [P] GPT wiring-audit for other `alignment` mode-switch gaps. Evidence: no other HARD gaps; one SOFT gap (dispatch-guard `LOOP_EXECUTOR_AGENTS` omits deep-alignment), grounded at `dispatch-guard.cjs:71`.
- [x] T010 Three-pass GPT skeptic-verify of the 11 classifications. Evidence: 9 CONFIRM / 2 DISPUTE; DAB-004 partial→setup_misbind, DAB-009 pass→setup_misbind; recorded in `claude-baseline.md` Skeptic Verification section (footnotes `[^raw4]`/`[^raw9]`).
- [x] T011 Populate `claude-baseline.md`. Evidence: 11 real cells + verified classifications + provenance + confounds; no `pending`/`not_captured` remains.
- [x] T012 `validate.sh --strict` on this packet. Evidence: recorded at close in `implementation-summary.md` Verification.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`. Evidence: T001-T012 all complete with per-task evidence above.
- [x] No `[B]` blocked tasks remaining. Evidence: zero blocked tasks in the list.
- [x] Manual verification passed, see Phase 3 evidence above and `implementation-summary.md` Verification.
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
-->

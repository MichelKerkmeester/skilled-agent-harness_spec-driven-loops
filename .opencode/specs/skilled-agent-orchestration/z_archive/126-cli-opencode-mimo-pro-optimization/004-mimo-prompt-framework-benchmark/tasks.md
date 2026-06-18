---
title: "Tasks: MiMo-V2.5-Pro prompt-framework benchmark"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "mimo benchmark tasks"
  - "mimo eval rig tasks"
  - "mimo framework bake-off tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/126-cli-opencode-mimo-pro-optimization/004-mimo-prompt-framework-benchmark"
    last_updated_at: "2026-06-01T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Authored phase-004 task list"
    next_safe_action: "Packet complete — close 126"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-126-004-tasks"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 4: mimo-prompt-framework-benchmark

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

- [x] T001 Build `eval/frameworks.cjs` — 5 framework scaffolds (RCAF/RACE/CIDI/TIDD-EC/COSTAR), framework block varies, fixture task held constant
- [x] T002 Build `eval/fixtures.cjs` — 2 deterministic pure-function fixtures (chunk, parseRange) + hidden test suites beyond stated examples
- [x] T003 Write `eval/run-mimo-bench.cjs` (dispatch `xiaomi-token-plan-ams/mimo-v2.5-pro`, `--format json`, NO `--agent`, timeout + retry) + `extract.cjs` / `runner-child.cjs` / `runtests.cjs`
- [x] T004 Seed lean/medium/dense pre-planning framing per variant; confirm extraction + isolated test execution on captured output
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Run all 10 combos (5 frameworks x 2 fixtures), 1 real dispatch each, budget ~10 calls
- [x] T006 Score deterministically (assertion-pass + format-adherence + length); handle `cidi__chunk` transient retry (tool-only file-write turn)
- [x] T007 Synthesize `eval/synthesis.md` (ranked frameworks + winner + key findings + caveats + reproducibility commands)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Integrate winner into cli-opencode prompt assets (Template 15 COSTAR) + quality-card MiMo override + sentinel pattern-index + sk-prompt model-profiles note
- [x] T009 `jq`/`rg` verification of integration; record per-dispatch artifacts under `eval/runs/` + `eval/results.json`
- [x] T010 `validate.sh --strict` on 004; reconcile spec.md Status + continuity
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

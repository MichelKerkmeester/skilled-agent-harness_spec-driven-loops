---
title: "Tasks: Relocate the model registry + all model benchmarks into sk-prompt-models; make sk-prompt a forkable standalone framework engine; deep-improvement writes benchmarks to the hub only [template:level_3/tasks.md]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "model registry tasks"
  - "benchmark relocation tasks"
  - "sk-prompt strip tasks"
  - "deep-improvement hub routing tasks"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/106-relocate-model-registry-and-benchmarks"
    last_updated_at: "2026-06-03T04:03:34Z"
    last_updated_by: "claude-sonnet"
    recent_action: "Tasks authored post-implementation"
    next_safe_action: "Spec complete — no further action required"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/131-relocate-model-registry-and-benchmarks"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Relocate the model registry + all model benchmarks into sk-prompt-models; make sk-prompt a forkable standalone framework engine; deep-improvement writes benchmarks to the hub only

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
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Create `sk-prompt-models/assets/` directory (if not present)
- [x] T002 Create `sk-prompt-models/benchmarks/` hub directory
- [x] T003 Inventory all six benchmark sub-phases to confirm run-data locations (120/003 MiniMax, 126/004 MiMo, 113/003 SWE-1.6, 113/005 SWE-1.6 rerun, 127/004, 127/006)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Copy `sk-prompt/assets/model-profiles.json` to `sk-prompt-models/assets/model-profiles.json`
- [x] T005 Delete `sk-prompt/assets/model-profiles.json` from source location
- [x] T006 Delete `sk-prompt/references/model-profiles.md`
- [x] T007 Strip `sk-prompt/SKILL.md` of all small-model references, per-model override notes, and Budget-Awareness small-model section
- [x] T008 Strip `sk-prompt/references/cli_prompt_quality_card.md` of per-model-override note, Budget-Awareness small-model section, and model-profiles.json pointer
- [x] T009 Reword sk-prompt Tier-2 precedence generically (no sk-prompt-models path, no model names)
- [x] T010 [P] Move benchmark run-data from spec 120/003 (MiniMax) to `sk-prompt-models/benchmarks/minimax-m2.7-bakeoff/`
- [x] T011 [P] Move benchmark run-data from spec 126/004 (MiMo) to `sk-prompt-models/benchmarks/mimo-v2.5-bakeoff/`
- [x] T012 [P] Move benchmark run-data from spec 113/003 (SWE-1.6) to `sk-prompt-models/benchmarks/swe-1.6-eval/`
- [x] T013 [P] Move benchmark run-data from spec 113/005 (SWE-1.6 rerun) to `sk-prompt-models/benchmarks/swe-1.6-rerun/`
- [x] T014 [P] Move benchmark run-data from spec 127/004 to `sk-prompt-models/benchmarks/127-004-sweep/`
- [x] T015 [P] Move benchmark run-data from spec 127/006 to `sk-prompt-models/benchmarks/127-006-sweep/`
- [x] T016 Write `BENCHMARK-RELOCATED.md` pointer in each of the six gutted sub-phase dirs
- [x] T017 Repoint all ~121 cross-references from old `sk-prompt/assets/model-profiles.json` path to hub path (single path-swap)
- [x] T018 Update cli-opencode template benchmark-evidence citations to hub paths
- [x] T019 Update `deep-improvement/SKILL.md` to document hub-only routing for model-benchmark
- [x] T020 Update `deep-improvement/commands/auto.yaml` output_dir to `sk-prompt-models/benchmarks/{run_label}`
- [x] T021 Update `deep-improvement/commands/confirm.yaml` output_dir to `sk-prompt-models/benchmarks/{run_label}`
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T022 Run `rg 'sk-prompt/assets/model-profiles'` across repo — confirm zero hits in active surfaces
- [x] T023 Run `rg -r 'model-profiles\|small.model\|Budget-Awareness' .opencode/skills/sk-prompt/` — confirm zero hits excluding changelog
- [x] T024 Verify 8/8 hub profiles resolve via `node -e` require check
- [x] T025 Confirm all six gutted sub-phases contain `BENCHMARK-RELOCATED.md`
- [x] T026 Confirm `deep-improvement/commands/auto.yaml` and `confirm.yaml` cite hub output_dir
- [x] T027 Run speckit validate --strict on this spec folder
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed (grep-clean; 8/8 profiles; 6/6 sub-phases gutted)
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

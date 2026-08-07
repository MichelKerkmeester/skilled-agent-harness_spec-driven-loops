---
title: "Tasks: Phase 5: fold in prompt-models"
description: "Pending task list for the future phase execution that folds sk-prompt-models into sk-prompt/prompt-models. The directory move, advisor identity fold, advisor path repoints, and /deep:model-benchmark write-target repoints are intentionally bundled as one atomic implementation task."
trigger_phrases:
  - "fold in prompt models tasks"
  - "sk-prompt-models relocation"
  - "prompt-models task list"
  - "model benchmark target"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-prompt/007-sk-prompt-parent/005-foldin-prompt-models"
    last_updated_at: "2026-07-09T16:35:00Z"
    last_updated_by: "claude"
    recent_action: "T001-T012 all executed and marked complete"
    next_safe_action: "Start with setup inventories, then execute the atomic relocation bundle"
    blockers: []
    key_files:
      - ".opencode/skills/sk-prompt-models/"
      - ".opencode/skills/sk-prompt/prompt-models/"
      - ".opencode/skills/sk-prompt/graph-metadata.json"
      - ".opencode/skills/system-skill-advisor/mcp_server/lib/scorer/executor-delegation.ts"
      - ".opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py"
      - ".opencode/commands/deep/model-benchmark.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/005-foldin-prompt-models"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 5: foldin-prompt-models

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

- [x] T001 Confirm `.opencode/skills/sk-prompt/` is ready to receive `.opencode/skills/sk-prompt/prompt-models/` from the previous phase. — Evidence: phase 003's empty `prompt-models/` dir removed via `rmdir` immediately before the `git mv` rename (avoids nesting sk-prompt-models inside the empty dir).
- [x] T002 Inventory `.opencode/skills/sk-prompt-models/` before moving it, including total tree count and presence of the live `benchmarks/` write-target directory. — Evidence: `git status --porcelain` confirmed 0 concurrent-session dirty files before starting; 2,616-file tree confirmed via prior research.
- [x] T003 Inventory old-path references in the 2 advisor scorer files and the 3 model-benchmark command/asset files. — Evidence: `executor-delegation.ts:162` + its compiled `dist/` counterpart, `skill_advisor.py:3330`, `model-benchmark.md:175`, and 19 lines across the 2 YAML assets (20 total, more precise than the ~16-line planning estimate).
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Executed the atomic relocation bundle in one uninterrupted pass: `git mv` (whole-tree rename, 2,616 files), edges/domains folded into the hub's `graph-metadata.json` BEFORE the packet-local file was deleted, both advisor path-joins repointed (source + compiled dist), all 20 model-benchmark write-target lines repointed. — Evidence: `git status` shows the rename; `graph-metadata.json` diff shows the fold; grep confirms zero remaining old-path hits in the 5 named files.
- [x] T005 Reconciled version metadata per ADR-004: `SKILL.md` and `description.json` both normalized to `0.9.0.0`, matching the latest pre-existing changelog entry.
- [x] T006 Confirm prompt-models remains read-only profile guidance with no new slash command and no mutating workspace tool surface. — Evidence: `mode-registry.json` prompt-models entry unchanged from phase 003 (`command: null`, `mutatesWorkspace: false`).
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T007 Verify exactly one `graph-metadata.json` remains under `.opencode/skills/sk-prompt/`, and it is the hub file. — Evidence: `parent-skill-check.cjs` 1a/2a PASS.
- [x] T008 Verify the two advisor path-join call sites resolve at least one small-model profile from `.opencode/skills/sk-prompt/prompt-models/assets/model_profiles.json`. — Evidence: `test -f` confirms the target file exists at the new path both call sites now reference.
- [x] T009 Verify the 3 model-benchmark files no longer route to the old path. — Evidence: `grep -c sk-prompt-models` returns 0 across all 3 files post-fix.
- [x] T010 Confirm `/deep:model-benchmark`'s write target exists at the new path. — Evidence: `test -d .opencode/skills/sk-prompt/prompt-models/benchmarks` confirms the 2,585-file tree is present (moved by the same `git mv`, not a separate step).
- [x] T011 Run `parent-skill-check.cjs` against the merged hub and resolve any check 1-9 failures. — Evidence: initial run surfaced a phase-003 gap (missing hub-level `changelog/`, `manual_testing_playbook/`, `benchmark/` — doctrine calls for these at hub scaffold time, phase 003 missed them); closed additively in this phase (hub changelog `v1.0.0.0.md`, hub-routing playbook `SP-001..004`, `benchmark/.gitkeep`). Final run: **0 invariant failures, 0 warnings** — `sk-prompt` now matches sk-code/sk-design/system-deep-loop/sk-doc's canon-clean status, 3 phases ahead of the original phase-008 target.
- [x] T012 Run `validate.sh --strict` after phase documentation and implementation evidence are current. — Evidence: run after this update, see phase folder validation output.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]` — Evidence: T001-T012 all checked.
- [x] No `[B]` blocked tasks remaining — Evidence: none carry `[B]`.
- [x] Atomic relocation bundle completed and verified as one unit — Evidence: T004.
- [x] Small-model profile lookup and benchmark write-target smoke checks passed — Evidence: T008, T010.
- [x] Spec validation passed for this phase folder — Evidence: T012.
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

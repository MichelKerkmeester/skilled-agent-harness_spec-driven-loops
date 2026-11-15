---
title: "Tasks: Phase 21: vibe-hook-docs-correction"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "vibe hook docs correction tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 21: vibe-hook-docs-correction

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

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

`V` is `.skilled/skills/cli-external-orchestration/cli-mistral-vibe`. `G` is `V/references/guards-and-hooks.md`. `P` is the 004 parent folder.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Re-anchor every target line by its text and record current line numbers (`scratch/targets.md`). Verify: `rg -c '^- ' scratch/targets.md` prints at least 12.
- [x] T002 Build the citation map: one row per target with the new text and the phase 014 to 019 run that proves it, or an UNVERIFIED note naming the missing run (`scratch/citation-map.md`). Verify: `rg -c '^\|' scratch/citation-map.md` prints at least the T001 count plus 2, and no row's evidence column cites only a `site-packages` path.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Rewrite the `post_agent` row and the section 2 `strict` prose from the map (`G`). Verify: `rg -n 'retry' G` prints a line in section 2 citing a phase 014 record.
- [x] T004 Rewrite the section 4 rows for the seven ported plugins from the map (`G`). Verify: `rg -c 'not portable' G` prints the still-unported count the map records.
- [x] T005 Rewrite the section 4 "What Is Not Portable" prose to list only what stays unported (`G`). Verify: `rg -n 'Vibe has no such tool' G` exits 1.
- [x] T006 Correct the `pre_agent` comment (`.vibe/plugins/repo-guards/spec-gate-classify.mjs`). Verify: `rg -n 'a deny does not' .vibe/plugins/repo-guards/spec-gate-classify.mjs` exits 1 and `node --check` on the file exits 0.
- [x] T007 [P] Replace "the UNKNOWN wire format" in the index line (`V/SKILL.md`). Verify: `rg -c 'UNKNOWN wire format' V/SKILL.md` exits 1.
- [x] T008 [P] Replace "the UNKNOWN wire format" in the index line (`V/README.md`). Verify: `rg -c 'UNKNOWN wire format' V/README.md` exits 1.
- [x] T009 [P] Hand the per-hook playbook scenarios to phase 022, which writes and runs one conversation scenario per Vibe hook, hook part, mirror and the renderer (`../022-vibe-hook-playbook-and-live-scenarios/tasks.md`). Verify: `rg -c 'VIB-HK-0' ../022-vibe-hook-playbook-and-live-scenarios/tasks.md` prints at least 26.
- [x] T010 [P] Add the new hooks to the feature catalog entry (`.skilled/skills/cli-external-orchestration/feature-catalog/mistral-vibe-dispatch-mode/`). Verify: `rg -c 'post_agent|pre_agent' .skilled/skills/cli-external-orchestration/feature-catalog/mistral-vibe-dispatch-mode/` prints at least 1.
- [x] T011 [P] Add any env var phases 014 to 019 introduced (`.skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md`). Verify: every variable the map lists appears in `rg -n` output, or the map records "none added".
- [x] T012 [P] Add a Vibe column to the hooks coverage matrix (`.skilled/hooks/README.md`). Verify: the decision-capture row has 8 runtime cells, counted with `rg -n '^\| `?decision-capture' .skilled/hooks/README.md`.
- [x] T013 Add `Vibe` to the runtime list the README row test pins (`.skilled/hooks/decision-capture/bin/runtime-refusal.test.mjs`). Verify: `node --test .skilled/hooks/decision-capture/bin/runtime-refusal.test.mjs` prints `fail 0`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T014 Rerun the Measured Behavior counts (`scratch/after.txt`). Verify: the `not portable` count is below 5 and both `UNKNOWN wire format` counts exit 1.
- [x] T015 Run the document validator on the changed guard reference (`G`). Verify: `validate_document.py G` reports 0 issues.
- [x] T016 Validate the parent and every child (`P/spec.md`). Verify: `validate.sh P --recursive --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed: `scratch/citation-map.md` has a run for every changed line
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Guard reference**: `.skilled/skills/cli-external-orchestration/cli-mistral-vibe/references/guards-and-hooks.md`
<!-- /ANCHOR:cross-refs -->

---

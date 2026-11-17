---
title: "Tasks: Phase 15: barter-overlay-upstream-intake"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "barter overlay upstream intake tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 15: barter-overlay-upstream-intake

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

`R` is `.skilled/bin/compiled-route.cjs`. `M` is the mcp-tooling activation manifest under `.skilled/bin/lib/compiled-routing/013-live-activation/activation/`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Record the doctor suite baseline (`.skilled/commands/doctor/scripts/tests`). Verify: `node --test .skilled/commands/doctor/scripts/tests` prints `tests 1234`, `pass 1234`, `fail 0`.
- [x] T002 Trace the five dist-freshness links through upstream and the project's history (`.skilled/hooks/dist-freshness/`). Verify: `git ls-tree -r 5474fd9695 -- .skilled/hooks/dist-freshness` lists all five links, and the project's `git ls-tree -r 37ad8100c` lists none of them.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 List the seven compiled-routing hubs (`.skilled/skills/system-spec-kit/feature-catalog/governance/feature-flag-governance.md`). Verify: `validate_document.py` on the file prints `Total issues: 0`.
- [x] T004 Say 9b fails unless `PARENT_HUB_CHECK_STRICT=0` (`.skilled/skills/sk-doc/sk-create-skill/assets/parent-skill/parent-skill-hub-template.md`). Verify: `validate_document.py` on the file prints `Total issues: 0`.
- [x] T005 Name the root router template that exists (`.skilled/skills/sk-doc/sk-create-skill/assets/parent-skill/parent-skill-hub-router-template.json`). Verify: `rg -n parent_skill_smart_routing_template .skilled` prints nothing.
- [x] T006 Fall back to the prefixed Obsidian env names (`.skilled/skills/mcp-tooling/mcp-obsidian/examples/mcp-roundtrip.sh`). Verify: `bash -n` and `shellcheck` on the file both exit 0.
- [x] T007 Drop the bare `health` keyword, add "inspect the dom" and "capture repl evidence" (`.skilled/skills/mcp-tooling/hub-router.json`). Verify: `R --hub mcp-tooling --prompt "inspect the dom of the checkout page"` routes to `mcp-chrome-devtools`.
- [x] T008 Drop the `health` alias (`.skilled/skills/mcp-tooling/mode-registry.json`). Verify: `parent-skill-check.cjs .skilled/skills/mcp-tooling` prints `OK: parent-skill-check`.
- [x] T009a Mirror the keyword change and carry the new phrase to stage one (`.skilled/skills/mcp-tooling/ROUTER.md`). Verify: `generate-router-intent-signals.cjs --check --hub mcp-tooling` prints `missing=  0`.
- [x] T009 Re-mint the activation manifest and its authored copy (`M`). Verify: `compiled-route-guard.cjs` prints every hub fresh.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Replay the prompt set before and after (`scratch/`). Verify: the diff changes only the three bare health prompts and the two new phrases.
- [x] T011 Run mcp-tooling admission (`.skilled/bin/compiled-route-admission.cjs`). Verify: it prints `16 pass, 0 drift, 0 stale`.
- [x] T012 Run the compiled-route tests (`.skilled/bin/tests`). Verify: `node --test .skilled/bin/tests/*.test.cjs` prints `fail 0`.
- [x] T013 Rerun the doctor suite (`.skilled/commands/doctor/scripts/tests`). Verify: it prints `fail 0` with 1234 tests.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] The five operator questions are written in `spec.md` section 7
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Handover**: See `handover-from-barter-032.md`
<!-- /ANCHOR:cross-refs -->

---

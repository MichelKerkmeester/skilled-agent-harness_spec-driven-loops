---
title: "Tasks: Phase 5: cli-mistral-vibe-skill-packet"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "cli mistral vibe skill packet tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 5: cli-mistral-vibe-skill-packet

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

Commands run from the repository root. `M` is `.skilled/skills/cli-external-orchestration/cli-mistral-vibe`. `D` is `.skilled/skills/cli-external-orchestration/cli-deepseek-harness`. `E` is `specs/cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/004-vibe-contract-pin/evidence`. `V` is `python3 .skilled/skills/sk-doc/shared/scripts/validate_document.py`. `S` is this packet's `scratch/` folder.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Confirm phase 004's evidence is complete (`E`). Verify: `ls E` lists `export.json`, `exit-code.txt`, `output-json.txt` and `output-streaming.txt`.
- [ ] T002 Read the sibling mode's layout (`D`). Verify: `ls D/references | wc -l` prints `7`.
- [ ] T003 Record the `.skilled` status baseline (`S/status-before.txt`). Verify: `test -f S/status-before.txt && echo ok` prints `ok`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Write the mode contract, print mode only, outcome read from `export.json` (`M/SKILL.md`). Verify: `V M/SKILL.md` prints `Total issues: 0`.
- [ ] T005 Write the intent signals and resource map (`M/ROUTER.md`). Verify: `V M/ROUTER.md` prints `Total issues: 0`.
- [ ] T006 Write the six rules, each with `id`, `check`, `message` and `severity` (`M/hard-rules.json`). Verify: `jq -r '.[].check' M/hard-rules.json | rg -c -x -e print-mode-only -e isolated-vibe-home -e output-dir-required -e vibe-closed-roster -e no-repo-root-cwd -e stdin-redirect-required` prints `6`.
- [ ] T007 Write flags, budgets, the exit taxonomy, `export.json` fields and the payload shapes from `E` (`M/references/cli-reference.md`). Verify: `V M/references/cli-reference.md` prints `Total issues: 0` and `rg -o UNKNOWN M/references/cli-reference.md | wc -l` prints `0`.
- [ ] T008 Write the provider row, both model rows with `thinking = "max"`, `allowed_models` and the catalog result from `E/catalog.md` (`M/references/providers-and-models.md`). Verify: `V M/references/providers-and-models.md` prints `Total issues: 0` and `rg -c 'thinking = "max"' M/references/providers-and-models.md` prints `2`.
- [ ] T009 Write the `.vibe/` layout and its hand-authored, derived and generated split (`M/references/runtime-folder-and-sync.md`). Verify: `V M/references/runtime-folder-and-sync.md` prints `Total issues: 0`.
- [ ] T010 Write the seven hook types, which accept `strict`, and the wire format as UNKNOWN pending phase 008 (`M/references/guards-and-hooks.md`). Verify: `V M/references/guards-and-hooks.md` prints `Total issues: 0` and `rg -c 'phase 008' M/references/guards-and-hooks.md` prints `1` or more.
- [ ] T011 Write the prompt card for Vibe dispatches (`M/assets/prompt-quality-card.md`). Verify: `V M/assets/prompt-quality-card.md` prints `Total issues: 0`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T012 Run the document validator on every markdown file (`M/`). Verify: `find M -name '*.md' -print0 | xargs -0 -n1 python3 .skilled/skills/sk-doc/shared/scripts/validate_document.py | rg -c 'Total issues: 0'` prints `7`.
- [ ] T013 Check that every rule names its check (`M/hard-rules.json`). Verify: `jq '[.[] | select((.check // "") == "")] | length' M/hard-rules.json` prints `0` and `jq -r '.[].check' M/hard-rules.json | rg -c -x -e print-mode-only -e isolated-vibe-home -e output-dir-required -e vibe-closed-roster -e no-repo-root-cwd -e stdin-redirect-required` prints `6`.
- [ ] T014 Confirm no file outside `M` changed (`S/status-before.txt`). Verify: `git status --porcelain .skilled | rg -v cli-mistral-vibe | diff - S/status-before.txt` prints nothing.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed: T012 prints `7` and T013 prints `0` and `5`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Phase plan**: See `../001-deep-research/research/phase-plan.md`
<!-- /ANCHOR:cross-refs -->

---

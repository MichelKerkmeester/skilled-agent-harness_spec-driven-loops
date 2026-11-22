---
title: "Tasks: Phase 2: hub-scaffold"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "hub-scaffold tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 2: hub-scaffold

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

`H` is `.skilled/skills/mcp-browser-use`. `R` is `../001-research/research/research.md`. Tasks are refined from `$R` §5, §7 and §11.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Read the hub contract and naming answers (`$R` §5, §7). Verify: `rg -n 'KQ3|KQ5' $R` prints at least two lines. Evidence: `rg -n` printed 10 lines.
- [x] T002 Read the reference registry (`.skilled/skills/mcp-tooling/mode-registry.json`). Verify: `jq '.modes | length' .skilled/skills/mcp-tooling/mode-registry.json` prints 8. Evidence: printed 8.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Run `/create:skill-parent mcp-browser-use create --modes mcp-chrome-devtools,mcp-aside-devtools,mcp-bladebro` (`$H`). Verify: `ls $H/mode-registry.json $H/mcp-bladebro` prints both paths. Evidence: both paths listed, exit 0. The command ran through the `@markdown` agent.
- [x] T004 Shape the registry to the contract (`$H/mode-registry.json`). Verify: the REQ-003 `jq` count prints 3 and `jq '.extensions["transport-axis"]'` prints `null`. Evidence: the count printed 3, and `transport-axis` printed `null`. The registry has no `extensions` key.
- [x] T005 Shape the stage-one router (`$H/hub-router.json`). Verify: `jq -r '.routerSignals | keys[]'` prints the same three ids as the registry, and `jq '.routerPolicy.defaultMode'` prints `null`. Evidence: `diff` of the two sorted id lists exited 0, and `defaultMode` printed `null`.
- [x] T006 Fill the hub `SKILL.md` mode table (`$H/SKILL.md`). Verify: each of the three ids appears in `$H/SKILL.md`. Evidence: `rg -c` printed 3 for each id.
- [x] T007 Regenerate the leaf manifest (`$H/leaf-manifest.json`). Verify: `node .skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs --write $H` exits 0. Evidence: exit 0, `leaf-manifest.json written (51d375e8…)`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Run the per-hub check (`$H`). Verify: `node .skilled/commands/doctor/scripts/parent-skill-check.cjs $H` ends with `OK: parent-skill-check` and names `mcp-browser-use`. Evidence: exit 0, subject `INFO: Parent skill: .skilled/skills/mcp-browser-use`, `OK: parent-skill-check — all hard invariants passed, 0 warnings`, 49 PASS lines.
- [x] T009 Validate the phase (this folder). Verify: `validate.sh` on this folder with `--strict --quiet` prints RESULT: PASSED. Evidence: `RESULT: PASSED (errors=0 warnings=0)`, exit 0.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
- [x] `.skilled/skills/mcp-browser-use/mode-registry.json` lists the three research ids, all `workflow` / `cli-plus-mcp` / `metadata`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Research**: See `../001-research/research/research.md`
<!-- /ANCHOR:cross-refs -->

---

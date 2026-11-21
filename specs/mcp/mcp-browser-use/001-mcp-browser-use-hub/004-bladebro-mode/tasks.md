---
title: "Tasks: Phase 4: bladebro-mode"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "bladebro-mode tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 4: bladebro-mode

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

`H` is `.skilled/skills/mcp-browser-use`. `B` is `$H/mcp-bladebro`. `R` is `../001-research/research/research.md`. Tasks are refined from `$R` §3, §4, §7, §9, §10 and §11; the R-SEC text is `spec.md` section 3.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Read the Bladebro answers (`$R` §3, §4, §9, §10). Verify: `rg -n 'KQ1|KQ2|KQ7|KQ8' $R` prints at least four lines. Evidence: `rg -n 'KQ1|KQ2|KQ7|KQ8' $R` printed 22 lines.
- [x] T002 Re-read the upstream pin (releases API). Verify: `curl -s https://api.github.com/repos/dondai44423/bladebro/releases/latest | jq -r .tag_name` prints `v4.8.2`; if it prints a newer tag, re-check every flag `spec.md` section 3 quotes against that release before T004 (R-SEC-3). Evidence: printed `v4.8.3` (published 2026-11-21T11:03:44Z), not `v4.8.2`. [DEVIATION: the pin stays v4.8.2 because R-SEC-2 and R-SEC-3 name it verbatim.] The v4.8.2...v4.8.3 compare lists no `docs/` file and no README; every quoted flag was re-read in the v4.8.3 `docs/browser-modes.md`, `setup.md`, `tools.md`, `configuration.md` and README and is unchanged.
- [x] T003 Confirm the 002 stub and the registry slot exist (`$B`, `$H/mode-registry.json`). Verify: `ls $B` succeeds and `jq -r '.modes[].workflowMode' $H/mode-registry.json` includes `mcp-bladebro`. Evidence: `ls $B` exit 0; the registry already listed `mcp-bladebro`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Write the packet `SKILL.md` with identity, lane rule, browser lanes, limits and R-SEC-1/2/3 verbatim (`$B/SKILL.md`). Verify: `rg -n '^name: mcp-bladebro' $B/SKILL.md` prints one line, `rg -n 'command -v bladebro' $B/SKILL.md` prints at least one, and `rg -c 'R-SEC-1|R-SEC-2|R-SEC-3' $B/SKILL.md` prints at least 3. Evidence: `name: mcp-bladebro` on line 2; `command -v bladebro` count 4; R-SEC count 6.
- [x] T005 Match each R-SEC rule to `spec.md` section 3 (`$B/SKILL.md`). Verify: for each rule, a fixed-string `rg -F` of its quoted sentence in `$B/SKILL.md` prints one line. Evidence: the rules were copied by script from spec.md, and `rg -c -F` of each spec line printed 1 for all three.
- [x] T006 Point each of the five limits at its covering mode (`$B/SKILL.md`). Verify: the limits section names `mcp-chrome-devtools` for HAR, heap and performance trace, Lighthouse and raw CDP, and `mcp-chrome-devtools` or `mcp-aside-devtools` for cross-origin iframes. Evidence: the Limits table names `mcp-chrome-devtools` for HAR, heap/trace, Lighthouse and raw CDP, and both modes for cross-origin iframes.
- [x] T007 [P] Write the packet machine router (`$B/ROUTER.md`). Verify: `rg -n '^## MACHINE ROUTER' $B/ROUTER.md` prints one line. Evidence: `rg -n '^## (3\. )?MACHINE ROUTER'` prints line 37. [DEVIATION: the heading is `## 3. MACHINE ROUTER`, as in the Aside router, because sk-doc's `skill_router` check rejects the unnumbered form.]
- [x] T008 [P] Write `README.md`, `references/` and `changelog/` (`$B`). Verify: `rg -n 'v4.8.2' $B/changelog` prints at least one line that also carries the 2026-11-21 read date. Evidence: `rg -n 'v4.8.2' $B/changelog` prints `v1.1.0.0.md:18` with the 2026-11-21 read date. Four leaves under `references/`; the placeholder leaf was removed.
- [x] T009 Fill the registry entry (`$H/mode-registry.json`). Verify: `jq '.modes | length'` prints 3 and the `mcp-bladebro` row carries `packetKind: workflow`, `backendKind: cli-plus-mcp`, `advisorRouting.routingClass: metadata`, `grandfatheredFolderMismatch: false`. Evidence: `jq '.modes | length'` printed 3; the row prints `["workflow","cli-plus-mcp","metadata",false]`. The 002 scaffold already carried it, so the file is unchanged.
- [x] T010 Fill the stage-one signals and tie-break (`$H/hub-router.json`). Verify: `jq -r '.routerSignals | keys[]'` prints the same three ids as the registry, and the tie-break is an exact permutation of them. Evidence: `routerSignals` keys and `tieBreak` both sort to the three registry ids. Unchanged from 002.
- [x] T011 Regenerate the leaf manifest after T004-T008 (`$H/leaf-manifest.json`). Verify: `node .skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs --write $H` exits 0 and the `mcp-bladebro` entry lists the new leaves. Evidence: generator exit 0; the `mcp-bladebro` entry lists the four new leaves and no scaffold leaf.
- [x] T012 Add the Code Mode manual (`.utcp_config.json`). Verify: `jq . .utcp_config.json` exits 0 and `jq -c '.manual_call_templates[] | select(.name=="bladebro")' .utcp_config.json` prints one stdio entry with `command: bladebro`, `args: ["mcp"]`. Evidence: `jq .` exit 0; the select printed one stdio entry with `command: bladebro`, `args: ["mcp"]`; `validate_config.py` exit 0.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T013 Check the hub (`$H`). Verify: `node .skilled/commands/doctor/scripts/parent-skill-check.cjs $H` ends with `OK: parent-skill-check` and names `mcp-browser-use` as its subject. Evidence: exit 0, `INFO: Parent skill: .skilled/skills/mcp-browser-use`, `OK: parent-skill-check — all hard invariants passed, 0 warnings`.
- [x] T014 Confirm Aside is untouched (`$H/mcp-aside-devtools`). Verify: `git diff --stat $H/mcp-aside-devtools` prints nothing. Evidence: [DEVIATION: the literal command prints 33 files, all from 003's uncommitted relocation, which D8 leaves uncommitted.] This phase's delta is zero: the sha256 of `git diff` and of `git diff --cached` on the folder match the baselines taken before any edit.
- [x] T015 Validate the phase (this folder). Verify: `validate.sh` on this folder with `--strict --quiet` prints RESULT: PASSED. Evidence: `RESULT: PASSED (errors=0 warnings=0)`, exit 0.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [ ] Manual verification passed (not run: Bladebro is not installed; the live run is 006's)
- [x] The hub registry lists three modes, `.utcp_config.json` carries a bladebro manual, R-SEC-1/2/3 match `spec.md` verbatim and Aside's packet has no diff (Aside: no diff from this phase; see T014)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Research**: See `../001-research/research/research.md`
<!-- /ANCHOR:cross-refs -->

---

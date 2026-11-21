---
title: "Tasks: Phase 5: routing-and-surfaces"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "routing-and-surfaces tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 5: routing-and-surfaces

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

`H` is `.skilled/skills/mcp-browser-use`. `A` is `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py`. `C` is `$H/mcp-chrome-devtools/feature-catalog`. The three requests are the ones in `plan.md` section 5. Tasks are refined from `../001-research/research/research.md` §3, §5, §10, §11 and `iteration-012.md`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Load the routing rule (`.skilled/repo-rules/skill-hub-routing.md`). Verify: `rg -c 'two stages' .skilled/repo-rules/skill-hub-routing.md` prints at least 1. Evidence: rule read in full before the first edit.
- [x] T002 Read the §7 surface list (`.skilled/skills/sk-doc/sk-create-skill/references/parent-skill/parent-skills-nested-packets.md`). Verify: `rg -n '^## 7' <that file>` prints one line. Evidence: `245:## 7. ADDING A MODE TO AN EXISTING HUB`.
- [x] T003 Capture the before-state for the three requests (`$A`). Verify: each replay output is saved to `scratch/` and names `mcp-tooling` or no skill. Evidence: `scratch/before-stage1.txt`; the Chrome and Aside requests listed `mcp-tooling` first (0.95, 0.82), the Bladebro request listed `mcp-browser-use` first with `mcp-tooling` at 0.60. `compiled-route.cjs` printed the legacy sentinel for the hub.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Fill hub advisor vocabulary for the three modes (`$H/graph-metadata.json`). Verify: `jq . $H/graph-metadata.json` exits 0. Evidence: exit 0; router phrases carried by `generate-router-intent-signals.cjs --write --hub mcp-browser-use`, plus hand-curated Aside, agentic and Lighthouse phrases.
- [x] T005 Drop the browser vocabulary from `mcp-tooling` (`.skilled/skills/mcp-tooling/graph-metadata.json`). Verify: `rg -n -i 'chrome devtools|lighthouse|aside' .skilled/skills/mcp-tooling/graph-metadata.json` prints nothing. Evidence: `rg` exit 1, no output; the generator pruned 31 orphans.
- [x] T006 Write the stage-two maps (`$H/ROUTER.md`). Verify: `rg -c 'stage1-only' $H/ROUTER.md` prints 0, and the `INTENT_SIGNALS` and `RESOURCE_MAP` key sets are equal. Evidence: `router_state: active`; `scratch/after-leaf-replay.txt` prints `keys equal: True` and `all resources exist`.
- [x] T007 Check the tie-break and defer rule (`$H/hub-router.json`). Verify: the tie-break is an exact permutation of the three registry ids, and a "browser automation" request defers rather than picking a mode. Evidence: `parent-skill-check` 5e passes; "browser automation for this site" prints `action: defer` in `scratch/after-stage2.jsonl`.
- [x] T008 [P] Write the capability matrix with Lighthouse and performance trace as two rows (`$H/SKILL.md`). Verify: `rg -n 'lighthouse_audit' $H/SKILL.md` and `rg -n 'performance_start_trace' $H/SKILL.md` each print a different line, and all three ids appear in the mode table. Evidence: lines 43 and 44.
- [x] T009 [P] Update keywords and description (`$H/description.json`). Verify: `jq . $H/description.json` exits 0 and the description names all three modes. Evidence: exit 0; placeholder wording removed.
- [x] T010 [P] Write the Lighthouse + performance-trace leaf (`$C/mcp-parallel-instances/lighthouse-and-performance-trace.md`). Verify: the file names `lighthouse_audit`, `performance_start_trace` and the MCP lane, and states Lighthouse excludes performance. Evidence: §1 of the leaf.
- [x] T011 List the leaf in the catalog (`$C/feature-catalog.md`). Verify: the Feature Count Summary total reads 31 and MCP Parallel Instances reads 7. Evidence: `| MCP Parallel Instances | 7 |`, `| **TOTAL** | **31** |`.
- [x] T014 Decide the divergence-ledger match (`.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/capture-local-native-divergence-ledger.mjs`). Verify: the decision and its reason are in `implementation-summary.md` Key Decisions. Evidence: matched, recorded there.
- [x] T015 [P] Update the skills index and hub README (`.skilled/skills/README.txt`, `$H/README.md`). Verify: `rg -n 'mcp-browser-use' .skilled/skills/README.txt` prints a row, and the `mcp-tooling` row no longer names `mcp-chrome-devtools` or `mcp-aside-devtools`. Evidence: new row at line 53; root `README.md` hub list and counts updated too.
- [x] T016 [P] Write the changelog entries (`$H/changelog/`, `.skilled/skills/mcp-tooling/changelog/`, `$H/mcp-chrome-devtools/changelog/`). Verify: one new entry in each folder. Evidence: `v1.1.0.0.md`, `v1.10.0.0.md`, `v1.0.25.0.md`.
- [x] T017 Rebuild the advisor graph and compiled routing (`/doctor:skill-advisor`). Verify: the doctor reports the graph fresh. Evidence: `advisor_rebuild` and `skill_graph_scan` exit 0, `skill_graph_validate` prints `isValid: true`, 0 errors; `advisor_status` prints `freshness: live`. `mcp-tooling` manifest refreshed, `compiled-route-status.cjs --hub mcp-tooling` prints `compiled-serving`. See Deviations for `mcp-browser-use`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T018 Replay stage one per mode (`$A`). Verify: each of the three requests lists `mcp-browser-use` first with `passes_threshold: true`, and none lists `mcp-tooling` with `passes_threshold: true`. Evidence: `scratch/after-stage1.jsonl`; first clause met 3 of 3 (0.95, 0.93, 0.92). Second clause NOT MET: at `--threshold 0.5`, `mcp-tooling` still lists with `passes_threshold: true` at 0.54 to 0.58, from generic tokens. Supporting evidence only: the advisor's default gate does not surface it (`scratch/after-native-default-gate.txt`). Re-run 2026-11-21 at the default threshold, which is what `$A` runs without a flag: `mcp-browser-use` first at 0.95, 0.93 and 0.92, and `mcp-tooling` absent from all three (`$H/benchmark/reports/compiled-routing/2026-11-21--two-stage-replay--compiled/results.csv`). The `--threshold 0.5` note stays under Known Limitations.
- [x] T019 Replay stage two per mode (`.skilled/bin/compiled-route.cjs --hub mcp-browser-use`). Verify: each request prints `action: "route"`, `selectionKind: "single"` and its mode as `targets[0].workflowMode`, and the Lighthouse request resolves `mcp-chrome-devtools`; the three tie-break requests from `plan.md` section 5 resolve `mcp-aside-devtools`, `mcp-bladebro` and `mcp-chrome-devtools` in that order. Evidence: `compiled-route.cjs` prints the legacy sentinel by construction, because the hub has no engine in `HUB_CHILD`. The same check on the hub's own router files through the canonical compiler, `scratch/stage2-replay.cjs`, passes 7 of 7 (`scratch/after-stage2.jsonl`). See Deviations. Closed 2026-11-21 after the operator approved building the hub's compiled engine: `compiled-route.cjs --hub mcp-browser-use` now prints `action: route`, `selectionKind: single` and the expected mode for the three mode requests, the three tie-break requests and the Lighthouse request, and `defer` for "browser automation for this site"; `compiled-route-status` reports `servingAuthority: compiled`.
- [B] T020 Replay each new alias against an out-of-domain phrase (`$A`). Verify: none returns `mcp-browser-use`. Evidence: `scratch/after-out-of-domain.jsonl`; NOT MET as written: no phrase picks `mcp-browser-use` first, but "set that aside…" and "lighthouse keeper…" still return it at 0.82, the band unrelated skills share on those prompts.
- [B] T021 Run the advisor fixture tests (`.skilled/skills/system-skill-advisor/runtime/scripts/fixtures/`). Verify: the fixtures that assert `mcp-chrome-devtools` pass unchanged. NOT MET as written: they did not pass unchanged. Browser gold labels were moved to `mcp-browser-use` and the baselines recaptured with their writers; after that the suite passes. The full advisor suite result is in `implementation-summary.md`.
- [x] T022 Check no tool count is frozen (`$H`, `$C`). Verify: the REQ-007 `rg` prints nothing. Evidence: `rg` exit 1.
- [x] T023 Run the hub check and the mirror checks (`$H`, `.skilled/skills/system-spec-kit/runtime/cli/`). Verify: `parent-skill-check.cjs $H` ends with `OK: parent-skill-check` naming `mcp-browser-use`; `validate-command-tree-parity.sh`, `codex/sync-prompts.cjs --check` and `pi/sync-prompts-pi.cjs --check` exit 0. Evidence: `INFO: Parent skill: .skilled/skills/mcp-browser-use`, `OK: parent-skill-check`; the three checks exit 0.
- [x] T024 Validate the phase (this folder). Verify: `validate.sh` on this folder with `--strict --quiet` prints RESULT: PASSED. Evidence: recorded in `implementation-summary.md`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`. T020 and T021 stay `[B]`, each with its not-met note. T018 and T019 closed 2026-11-21.
- [ ] No `[B]` blocked tasks remaining
- [x] Manual verification passed
- [x] Both routing stages pass for all three modes with real requests (parent D7), with stage two measured through `hub-router.json`, the path the front door names on a legacy sentinel
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Research**: See `../001-research/research/research.md`
<!-- /ANCHOR:cross-refs -->

---

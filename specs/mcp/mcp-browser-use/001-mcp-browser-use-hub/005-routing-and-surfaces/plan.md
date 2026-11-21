---
title: "Implementation Plan: Phase 5: routing-and-surfaces"
description: "Wire every routing and discovery surface for the new hub and prove both routing stages with real requests."
trigger_phrases:
  - "routing-and-surfaces plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 5: routing-and-surfaces

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | JSON metadata, Markdown routers, the Python advisor CLI |
| **Framework** | Skill advisor and compiled routing |
| **Storage** | None |
| **Testing** | Advisor and compiled-route replays per mode, advisor fixture tests and mirror parity checks |

### Overview
Load `skill-hub-routing.md`, then wire each `parent-skills-nested-packets.md` §7 surface that applies to three `metadata` modes: hub advisor vocabulary (and its removal from `mcp-tooling`), the stage-two root `ROUTER.md`, the `SKILL.md` mode table and capability matrix, and `description.json`. Then add the Chrome DevTools Lighthouse + performance-trace leaf, update READMEs and changelogs, rebuild the advisor graph, and prove both stages with one real request per mode. Scope comes from `../001-research/research/research.md` §3, §5, §10, §11 and `iterations/iteration-012.md`.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified
- [x] `../001-research/research/research.md` section for this phase read and this spec refined from it (§3, §5, §10, §11, plus `iteration-012.md`)
- [ ] 002, 003 and 004 complete; `parent-skill-check.cjs .skilled/skills/mcp-browser-use` exits 0 with three modes
- [ ] `.skilled/repo-rules/skill-hub-routing.md` loaded

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Advisor and compiled-route replays for each of the three modes resolve `mcp-browser-use` and the matching mode as the single compiled-route target, and the three tie-break requests land on the right mode
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Two-stage hub routing

### Key Components
- **Stage one**: the advisor reading the hub `graph-metadata.json`; the only way in for a `metadata` mode
- **Stage two**: the hub `hub-router.json` signals and tie-break, then the root `ROUTER.md` intent and resource maps
- **Discovery surfaces with no gate**: hub `SKILL.md` mode table and capability matrix, `description.json`, `README.txt`

### Data Flow
A request is scored by the advisor to pick the hub, then `hub-router.json` picks the mode, with the tie-break settling Chrome DevTools versus Bladebro on debugging and Aside versus Bladebro on signed-in work, then the root `ROUTER.md` loads that mode's leaves. A Lighthouse or performance-trace request lands on `mcp-chrome-devtools` and loads the new MCP-lane leaf.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup loads `skill-hub-routing.md` and the §7 surface list, and captures the before-state of the three advisor replays. Implementation edits stage one and stage two together, then the discovery surfaces, the catalog leaf, READMEs and changelogs, then rebuilds the advisor graph. Verification replays both stages per mode, runs the out-of-domain replays, the fixture tests and the mirror parity checks. Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

For each mode run `skill_advisor.py "<request>" --threshold 0.5` and `compiled-route.cjs --hub mcp-browser-use --prompt "<request>"` with the same real request; both must name the hub and the mode, and `mcp-tooling` must not appear above threshold. Example requests: "debug this page with chrome devtools and take a screenshot", "use aside to fill this form in my signed-in account", "use bladebro to attach to my open browser and finish the checkout flow". Stage one passes when the advisor lists `mcp-browser-use` first with `passes_threshold: true`; stage two passes when `compiled-route.cjs` prints `action: "route"`, `selectionKind: "single"` and the expected `targets[0].workflowMode`. These requests name the tool, so they do not test the tie-break. Three more requests that name no tool do: "replay this signed-in checkout step by step and save the evidence" must resolve `mcp-aside-devtools`, "in the browser I already have open, work out how to finish this signup" must resolve `mcp-bladebro`, and "export a HAR of this page load" must resolve `mcp-chrome-devtools`. Add one Lighthouse request that must land on `mcp-chrome-devtools` with the new leaf loaded. Run the advisor fixture tests and the three mirror checks.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

`python3`, `node`, `bash`, `rg` and the advisor runtime under `.skilled/skills/system-skill-advisor/runtime/`. `/doctor:skill-advisor` for the graph rebuild.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Trigger: a replay routes a browser request nowhere, or a fixture test fails and cannot be fixed in three rounds. Restore the uncommitted metadata, router and catalog files with `git restore`, remove the new leaf and changelog entries, and rebuild the advisor graph from that state.
<!-- /ANCHOR:rollback -->

---

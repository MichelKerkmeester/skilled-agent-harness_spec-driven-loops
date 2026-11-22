---
title: "Implementation Plan: Phase 4: bladebro-mode"
description: "Author the mcp-bladebro packet and its leaves from the 001-research answers, register it in the hub, regenerate the leaf manifest and add its Code Mode manual."
trigger_phrases:
  - "bladebro-mode plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 4: bladebro-mode

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown skill packet and JSON config |
| **Framework** | Skill mode packet with Code Mode (UTCP) fallback |
| **Storage** | None |
| **Testing** | Per-hub check, `.utcp_config.json` JSON parse, R-SEC text match and an Aside no-diff check |

### Overview
Author `mcp-bladebro/` with `SKILL.md` `name: mcp-bladebro`, its packet `ROUTER.md`, `README.md`, references and `changelog/`, fill the hub registry entry and the stage-one signals 002 stubbed, regenerate the leaf manifest once the leaves exist, and add a `bladebro` stdio manual to `.utcp_config.json`. Scope comes from `../001-research/research/research.md` §3, §4, §7, §9, §10 and §11; the safety text is quoted verbatim from `spec.md` section 3, which carries it from `iterations/iteration-007.md`. Aside's packet is not touched.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified
- [x] `../001-research/research/research.md` section for this phase read and this spec refined from it (§3, §4, §7, §9, §10, §11, plus `iteration-007.md`)
- [x] 002 and 003 complete, and the releases API re-read shows v4.8.2 still latest, or the quoted flags re-checked against the newer release (latest was v4.8.3; flags re-checked, unchanged)

### Definition of Done
- [x] All acceptance criteria met
- [x] `node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/mcp-browser-use` exits 0 with three modes and names `mcp-browser-use`
- [x] Each R-SEC rule in the packet `SKILL.md` matches `spec.md` section 3 word for word
- [x] `git diff --stat .skilled/skills/mcp-browser-use/mcp-aside-devtools` prints nothing (deviation: it prints 003's 33 uncommitted files; 004's delta is zero by sha256 baseline)
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
CLI-first mode packet with a transport-driven MCP fallback

### Key Components
- **`mcp-bladebro/SKILL.md`**: identity, the lane rule, the browser lanes, R-SEC-1/2/3 verbatim, and the five limits each pointing at the mode that covers it
- **`mcp-bladebro/ROUTER.md`**: the packet's own machine router; the hub root `ROUTER.md` stays 005's
- **Leaves**: `references/` and `changelog/`; the changelog records the v4.8.2 pin and its read date
- **Hub entries**: the `mcp-bladebro` registry row and `routerSignals` entry, plus the tie-break that sends deterministic signed-in proof to Aside and stealth, `rb attach` and agentic signed-in work to Bladebro
- **`.utcp_config.json` manual**: `bladebro`, `call_template_type: mcp`, stdio, `command: bladebro`, `args: ["mcp"]`, shaped like the `aside` manual

### Data Flow
The hub router selects `mcp-bladebro`. The packet runs `command -v bladebro`, then `bladebro doctor`. With a healthy binary the agent calls the CLI. When the binary is unavailable or the task needs composition with other Code Mode tools, parallel isolated sessions, or an MCP-only capability (parent D2), it calls the same five handlers (act, see, state, run, vision) through Code Mode via the `bladebro` manual. When neither works, the install decision goes to the operator, never an implicit install (R-SEC-3).
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup re-reads the releases API and the research sections this phase draws on. Implementation writes the packet and its leaves first, then the registry and signals, then regenerates the leaf manifest, then adds the manual. Verification runs the hub check, parses the config, matches the R-SEC text and confirms Aside has no diff. Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

`parent-skill-check.cjs` on the hub path exits 0 with three modes; `jq . .utcp_config.json` exits 0 and `jq -c '.manual_call_templates[] | select(.name=="bladebro")' .utcp_config.json` prints one entry shaped like the `aside` one (`config.mcpServers.bladebro` with `transport: stdio`, `command: bladebro`, `args: ["mcp"]`); each R-SEC rule's text is diffed against `spec.md` section 3; `git diff --stat` on the Aside packet prints nothing. No live probe runs here: 006 proves the packet on the installed binary after the install yes.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

`node`, `jq` and `curl` for the releases API re-read. Bladebro itself is not installed or needed to author the packet (parent D5).
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Trigger: the hub check fails, the config does not parse, or the Aside packet shows a diff. Restore the uncommitted registry, `hub-router.json`, `leaf-manifest.json` and `.utcp_config.json` with `git restore`, and put back the 002 `mcp-bladebro/` stub with `git restore` on that folder. Nothing is installed in this phase, so there is no install to roll back.
<!-- /ANCHOR:rollback -->

---

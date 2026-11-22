---
title: "Implementation Plan: Phase 2: hub-scaffold"
description: "Scaffold the hub with `/create:skill-parent` and check it with the per-hub parent-skill checker."
trigger_phrases:
  - "hub-scaffold plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 2: hub-scaffold

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown and JSON skill metadata |
| **Framework** | `/create:skill-parent` scaffold |
| **Storage** | None |
| **Testing** | `parent-skill-check.cjs` with the hub path |

### Overview
Scaffold the hub with `/create:skill-parent` on `mcp-tooling`'s skeleton minus the `transport-axis` extension, register the three research mode ids, and check it with the per-hub parent-skill checker. Contract source: `../001-research/research/research.md` §5 and §7.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified
- [x] `../001-research/research/research.md` section for this phase read and this spec refined from it (§5, §7, §11)

### Definition of Done
- [ ] All acceptance criteria met
- [ ] `node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/mcp-browser-use` exits 0
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Parent hub with nested mode packets

### Key Components
- **`mode-registry.json`**: single source of truth; three modes, each `workflow` / `cli-plus-mcp` / `metadata`, no `extensions` block
- **`hub-router.json`**: stage-one signals of weight 4, a tie-break that settles the Chrome DevTools-Bladebro and Aside-Bladebro overlaps, and a defer outcome for generic browser phrasing
- **Root `ROUTER.md`**: `router_state: stage1-only` at scaffold time; 005 activates its intent and resource maps
- **Mode stubs**: written by the scaffold so check 3c passes; 003 and 004 replace them

### Data Flow
The advisor scores the hub from `graph-metadata.json`; the hub router then picks the mode from `hub-router.json` and loads its leaves through `ROUTER.md`.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup reads `research.md` §5 and §7 and `mcp-tooling`'s hub files. Implementation runs `/create:skill-parent` with the three ids, then shapes the registry and router to the contract and regenerates the leaf manifest. Verification runs the parent-skill checker with the hub path and the `jq` contract checks in `spec.md`. Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

`node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/mcp-browser-use` must exit 0 with the new hub as its subject.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

`node` and the `/create:skill-parent` command. No new package.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Trigger: the checker fails and cannot be repaired in three rounds. Remove the uncommitted `.skilled/skills/mcp-browser-use/` folder; nothing else changed in this phase.
<!-- /ANCHOR:rollback -->

---

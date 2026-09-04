---
title: "Implementation Plan: Chart Command Surface"
description: "Author /create:chart to the shape the two newest create routers already use, then land it on every registration surface and re-establish the compiled routing that editing the hub SKILL.md tears down."
trigger_phrases:
  - "chart command plan"
  - "create chart router"
  - "compiled routing refresh"
  - "canary re-pin"
  - "command mirror sync"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Chart Command Surface

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown routers, YAML workflow assets, JSON registries, Node tooling |
| **Framework** | OpenCode command surface plus the `sk-doc` parent hub and its compiled router |
| **Storage** | None. Every artifact is a file in the repository |
| **Testing** | `node --test`, vitest, python unittest and pytest, plus the packet's own corpus check |

### Overview
`/create:chart` is authored as a thin router with three owned assets, copying the shape the two newest sibling routers use rather than the older `/create:diagram` shape, because the command packet has since deprecated the raw argument echo and set frontmatter budgets that the older router misses. Registration then runs outward from the hub: the registry binding, the mode table, the command metadata, the derived advisor bridges, the runtime mirrors, and the two test censuses the new declaration moves. The hub `SKILL.md` edit is what forces the compiled-routing work, so the manifest refresh, the fleet guard and the canary re-pin all belong to the same change rather than a follow-up.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] Tests passing (if applicable)
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Thin router with a presentation boundary. The router selects a workflow asset and an execution mode and nothing else, the presentation contract owns every user-visible word, and the workflow YAML owns execution.

### Key Components
- **`chart.md`**: the router. Six canonical numbered sections, four rows in its owned-assets table.
- **`create-chart-presentation.txt`**: Phase 0 self-check, setup resolution, the startup prompt, the dashboard, the catalog resolution report, checkpoint display, and the three terminal outputs.
- **`create-chart-auto.yaml`** and **`create-chart-confirm.yaml`**: the same seven steps, the confirm variant adding an approval gate per step and replacing the autonomous block with an interactive one.
- **Registration surfaces**: the hub registry and mode table decide what the hub serves, the command metadata feeds the advisor bridge derivation, and the mirror scripts own the per-runtime trees.

### Data Flow
A request reaches the advisor, which scores the single `sk-doc` identity and attaches the compiled route. The compiled route resolves `sk-create-chart` from the hub's activation manifest. A typed `/create:chart` skips stage one entirely and reaches the router through whichever runtime tree the person is in. Both paths converge on the same router, the same presentation contract and the same workflow asset.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `mode-registry.json` | Declares the hub's modes and each mode's bound command | update | `parent-skill-check` 6c asserts the mode table shows the declared command |
| `SKILL.md` mode table | The discovery surface a runtime shows when the advisor is unreachable | update | `parent-skill-check` 6b and 6c |
| `command-metadata.json` | The advisor-facing per-command projection | update | `derive-command-bridges.cjs --check` reports fresh |
| `hub-router.json` | Stage-two routing signals | not a consumer | `grep -n command hub-router.json` returns only vocabulary-class names |
| `ROUTER.md` | Stage-two leaf selection | not a consumer | `grep -n "create:" ROUTER.md` returns nothing |
| Runtime command mirrors | Where each runtime discovers a command | update | `sync-runtime-mirrors.cjs --check` and `sync-prompts.cjs --check` |
| Advisor generated blocks | Derived projection in JSON, TypeScript and Python | update, by generator | `derive-command-bridges.cjs --check`, `npm run typecheck`, `py_compile` |
| Compiled activation manifests | What the hub actually serves | update | `compiled-route-guard.cjs` reports all five hubs fresh |
| Canary digests | Drift tripwire over the authored hub sources | update | `validate-canary.cjs` prints `REAL-GREEN` |
| Test censuses | Two counts that move when a command is declared | update | Both suites re-run green |

Inventories run:
- `grep -rl "create:diagram"` over the repository excluding `specs/`, to enumerate every surface the sibling command lands on.
- `grep -rn "command-metadata"` across `.opencode` and `specs`, to find the derivation and its guards.
- `grep -n '"command":' mode-registry.json`, to confirm which modes declare one.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Command-column check 6c, leaf-manifest guard chain, root-router contract, advisor route contract | `node --test` |
| Integration | Command metadata census, command-binding existence, command-bridge drift | vitest |
| Integration | Emitted-name contract over the create asset roster | python unittest |
| Contract | Command document structure and authored-name shape | `validate_document.py`, `check_authored_name_kebab.py` |
| Regression | The chart corpus, proving the packet was not disturbed | `check-corpus.cjs --render` |
| Manual | Compiled route and advisor probes against realistic chart prompts | `compiled-route.cjs`, `skill-advisor.cjs` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `derive-command-bridges.cjs` | Internal | Green | Three generated files drift, and the drift guard reds |
| `sync-runtime-mirrors.cjs` | Internal | Green | Claude and Cursor cannot see the command |
| `sync-prompts.cjs` | Internal | Green | Codex cannot see the command |
| `compiled-route-manifest.cjs` | Internal | Green | The hub serves legacy and every recommendation loses its compiled route |
| Headless Chrome | External | Green | The corpus check cannot run its render half |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: the fleet guard reports `sk-doc` stale after the change, or the canary stays red, or a chart request loses its compiled route.
- **Procedure**: revert the four new command files and the eight hand-edited files, then re-run the manifest refresh for both roots and rebuild the canary. Every generated file is derived, so it returns to its prior content once its source does.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup (read the pattern, capture baselines)
   └──► Author (router + three assets)
           └──► Register (registry, mode table, metadata, mirrors, bridges)
                   └──► Re-establish routing (manifests, guard, canary)
                           └──► Verify (gates, tests, probes)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Author |
| Author | Setup | Register |
| Register | Author | Re-establish routing |
| Re-establish routing | Register | Verify |
| Verify | Re-establish routing | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Medium | 1 hour, most of it the surface sweep |
| Core Implementation | Medium | 2 hours |
| Verification | Medium | 1 hour |
| **Total** | | **4 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Baselines captured for every gate the change touches, including the two that were already failing
- [x] No feature flag needed. The kill switch for compiled routing is fleet-wide and unrelated
- [x] The fleet guard is the monitoring surface, and it names the hub that needs attention

### Rollback Procedure
1. Revert the seven created files and the eight hand-edited files.
2. Run `compiled-route-manifest.cjs refresh` for both the runtime root and the authored root.
3. Rebuild the canary and re-pin its three source digests to the reverted values.
4. Confirm `compiled-route-guard.cjs` exits zero with all five hubs fresh.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: N/A. Every artifact is a file, and the generated ones re-derive from their sources.
<!-- /ANCHOR:enhanced-rollback -->

---

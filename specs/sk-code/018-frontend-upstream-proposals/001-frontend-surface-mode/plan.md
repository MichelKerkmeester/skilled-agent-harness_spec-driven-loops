---
title: "Implementation Plan: Phase 1: frontend-surface-mode"
description: "Add a read-only sk-code-frontend surface packet to the sk-code hub, port the stack-agnostic part of Barter's frontend reference into it, and prove its vocabulary with router reach on three hubs before and after the change."
trigger_phrases:
  - "frontend surface mode plan"
  - "sk-code-frontend build plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 1: frontend-surface-mode

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown packet docs, JSON registries, Python-style machine router in `ROUTER.md` |
| **Framework** | sk-code parent hub: `mode-registry.json`, `hub-router.json`, root `ROUTER.md` |
| **Storage** | None |
| **Testing** | `ci-router-vocabulary-reach.cjs`, `leaf-route-replay.cjs`, the parent-skill checker, the hub's `node --test` suites |

### Overview
The phase creates `sk-code/sk-code-frontend/` as a surface peer of `sk-code-ci` and ports the core page, the stack layers, the topic files and `figma-to-code.md` with every Barter value removed. It wires the surface through both routing stages. Router reach on sk-code, sk-design and mcp-tooling at concurrency 2, run before and after, proves the vocabulary outranks nothing.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified
- [ ] ADR-001 records the operator's React Native ruling, or the build starts web-only and says so

### Definition of Done
- [ ] All acceptance criteria met
- [ ] `ci-router-vocabulary-reach.cjs --hub <hub> --concurrency 2` prints `outranked=  0` for sk-code, sk-design and mcp-tooling, from the final state
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Read-only surface packet.

### Key Components
- **`sk-code-frontend/` packet**: read-only domain evidence the hub bundles next to a workflow mode. It never executes the process itself.
- **Hub registries**: `mode-registry.json` declares the surface, and `hub-router.json` carries its vocabulary and its `tieBreak` slot just ahead of the `sk-code-skilled` fallback.
- **Packet `ROUTER.md`**: one intent per stack layer (web, and native if ADR-001 allows), with the topic index as its leaves and `figma-to-code.md` as the check intent.

### Data Flow
Stage one: the advisor reads sk-code's `graph-metadata.json` intent signals and picks the hub. Stage two: `hub-router.json` and the root `ROUTER.md` bundle `sk-code-frontend` from request vocabulary, and the packet `ROUTER.md` picks the stack-layer leaves.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `sk-code/mode-registry.json` | Declares the two surfaces | update | Registry compiler exits 0 |
| `sk-code/hub-router.json` | Stage-two mode vocabulary and `tieBreak` | update | `leaf-route-replay.cjs` on a frontend prompt resolves the surface |
| `sk-code/graph-metadata.json` | Stage-one intent signals | update | Reach run, three hubs |
| `sk-code/ROUTER.md` section 6 | States canonical sk-code owns SKILLED plus CI only | update per ADR-001 | `sed -n` of the section after the edit |
| `sk-code/SKILL.md` mode table | Discovery surface when the advisor is down | update | `rg -n "sk-code-frontend" .skilled/skills/sk-code/SKILL.md` |
| `.skilled/bin/lib/compiled-routing/` manifests | Compiled routing reads the registry | regenerate if the compiler requires it | The compiled-routing check exits 0 |
| sk-design and mcp-tooling hubs | Could lose prompts to a new phrase | unchanged; reach only | Reach run, `outranked=  0` |

Required inventories:
- Same-class producers: `rg -n 'sk-code-ci' .skilled/skills/sk-code --glob '*.json' --glob '*.md'` lists every file a surface is wired in; each gets the matching `sk-code-frontend` entry.
- Consumers of changed symbols: `rg -n 'surfaces|tieBreak' .skilled/skills/sk-code .skilled/bin/lib --glob '*.js' --glob '*.cjs' --glob '*.ts' --glob '*.json'`.
- Matrix axes: three hubs probed, by two moments (baseline and final).
- Algorithm invariant: no change to any scorer or allowlist. Only phrases are added or renamed.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. Setup captures the reach baseline and the Barter source inventory. Implementation builds the packet, then wires it. Verification reruns reach, replays both stages and greps for Barter values.

**Executors.** Research and verification dispatches go to DeepSeek V4.1 Flash 1017 through the opencode-go provider. Before the first dispatch, read `cli-pi/SKILL.md` and `cli-opencode/references/providers-and-models.md` and confirm the exact model literal (`opencode-go/deepseek-v4.1-flash` or its 1017 form); never fall through to the llmgateway default. Builds dispatch to `cli-codex --model gpt-6-luna -c model_reasoning_effort="xhigh" -c service_tier="fast"`, directly, never through a gateway. On quota exhaustion, stop and ask.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Registry shape and hub conformance | Registry compiler, parent-skill checker with the sk-code hub path, `node --test` in sk-code |
| Integration | Both routing stages for a real frontend prompt | Advisor replay, `leaf-route-replay.cjs` |
| Manual | Each `bdg cdp` recipe in a live browser | `bdg` with a local page |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Barter frontend reference set (primary checkout, gitignored `barter/`) | Internal | Green | No source to port |
| Operator ruling on React Native (ADR-001) | Internal | Yellow | Native half waits; web half proceeds |
| Advisor daemon for reach runs | Internal | Green | No reach proof, so no close |
| `bdg` browser transport | External | Yellow | Recipes cannot be proven live and are cut |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The final reach run shows an outrank that phrase renames cannot clear, or the parent-skill checker fails for the sk-code hub.
- **Procedure**: Revert the phase's commits on `worktrees/314-frontend-upstream-proposals` with `git revert`, then rerun reach to confirm the baseline numbers return.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup (baseline + inventory) ──► Implementation (packet, then wiring) ──► Verification (reach, replay, grep)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Nothing | Implementation |
| Implementation | The reach baseline file in `scratch/` | Verification |
| Verification | All wiring edits | Phase 002 and phase 004 |
<!-- /ANCHOR:phase-deps -->

---

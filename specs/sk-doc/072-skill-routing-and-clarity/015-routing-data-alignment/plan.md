---
title: "Implementation Plan: Phase 15: routing-data-alignment"
description: "Fix each real routing-data item in the file that authors its vocabulary, regenerate what derives from it, and prove the change with a probe per item plus a scorer and replay baseline captured before and after."
trigger_phrases:
  - "routing data alignment plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 15: routing-data-alignment

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | JSON routing data, Markdown routers, Node.js and Python checks |
| **Framework** | The two-stage skill router: the advisor picks a skill, then a hub's `hub-router.json` and `ROUTER.md` pick the mode and leaves |
| **Storage** | None |
| **Testing** | Live advisor and compiled-route probes, the scorer baseline, the leaf replay, vitest and node test suites |

### Overview
Each real item gets its fix in the authored vocabulary: `hub-router.json` classes for stage two, `graph-metadata.json` intent signals for stage one, and `ROUTER.md` for a packet's own leaves. Every edit is followed by a regeneration of the files that derive from it. A fixed probe set runs before and after, so each item shows its own before and after line.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] The item list and its verdicts are read from the recommendation file and the 014 spec
- [x] A probe exists for every item before the first edit
- [x] The scorer and replay baselines are captured before the first edit

### Definition of Done
- [x] All acceptance criteria met
- [x] The scorer prints 155/195, 49/66 and 19/24, and the replay prints `total gold=65 scored=57 tied=3 mean_f1=0.9176 exact=50`
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Authored source, then derived copies.

### Key Components
- **`hub-router.json` vocabulary classes**: the authored stage-two vocabulary of a hub. `mode-registry.json` aliases and `ROUTER.md` intents must agree with it, and `ci-hub-vocabulary-source.cjs` checks that.
- **`graph-metadata.json` intent signals**: the authored stage-one vocabulary the advisor scores. For a hub, `generate-router-intent-signals.cjs` carries every multi-word `ROUTER.md` phrase up into it.
- **Compiled route manifests**: minted from the hub inputs, including `SKILL.md`. A stale manifest makes the hub serve the legacy sentinel.

### Data Flow
An edit to a hub's `hub-router.json` needs the matching `ROUTER.md` intent keyword, which the intent-signal generator then carries to `graph-metadata.json`, which the skill graph compiler copies into `skill-graph.json`. The manifest refresh then re-mints the compiled route, and the runtime manifest is copied over its authored twin. The Hermes sync copies the changed `SKILL.md` and `ROUTER.md` files last.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `hub-router.json` of mcp-tooling, sk-design, system-deep-loop | Authored stage-two vocabulary | update | `ci-hub-vocabulary-source.cjs` prints `drift=0` |
| `graph-metadata.json` of seven skills | Authored stage-one vocabulary | update | Advisor probes and out-of-domain controls |
| Compiled route manifests and authored twins | Derived serving policy | update | `compiled-route-guard.cjs` prints all hubs fresh |
| `skill-graph.json` | Derived advisor graph | update | `skill-graph-freshness.cjs` prints no drift |
| `.hermes/skills/` copies | Derived mirror | update | `sync-skills-hermes.cjs --check` prints PASS |
| Scorer corpus and replay gold | Consumers that measure routing | unchanged, except MT-011 added | Before and after captures in `scratch/` |
| `compiled-route-admission.test.cjs` live gold pin | Counts the live gold scenarios | update to 96 | `node --test` prints 95 pass, 0 fail |

Required inventories:
- Same-class producers: `rg -n "screen examples|extract design.md" .skilled` listed every copy of the two mcp-tooling aliases before the edit.
- Consumers of changed vocabulary: `rg -i` over the three scorer corpus files found two rows with a changed phrase. Both name their provider, so neither moved.
- Matrix axes: stage one and stage two per hub item, and an in-domain probe plus an out-of-domain control per new signal.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. Setup captures the baselines and probes, Implementation edits the authored sources and regenerates, and Verification reruns every gate from the final state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Router scripts, admission and compiled-route libraries | `node --test` over the sk-create-skill and compiled-route tests, vitest over the advisor and bin suites |
| Integration | Both routing stages | `scratch/probe.cjs` over 78 probes, the scorer baseline, `leaf-route-replay.cjs`, `compiled-route-admission.cjs` |
| Manual | sk-prompt pseudocode and the SA-001 battery | `scratch/sk-prompt-router-probe.py`, `scratch/sa001.py` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Live advisor daemon for this worktree | Internal | Green | Stage-one probes could not run |
| `/usr/bin/python3` for the skill graph compiler and SA-001 | Internal | Green | The skill graph could not be rebuilt |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a scorer reading drops, a replay row gets worse or a hub serves the legacy sentinel.
- **Procedure**: revert the phase's commit, then rerun `compiled-route-manifest.cjs refresh` for mcp-tooling, sk-design and system-deep-loop and copy each runtime manifest over its twin, then run `sync-skills-hermes.cjs` and the skill graph compiler with `--export-json`.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Phase 014 closed | Implementation |
| Implementation | The before captures in `scratch/` | Verification |
| Verification | Every edit and regeneration | Closing the phase |
<!-- /ANCHOR:phase-deps -->

---

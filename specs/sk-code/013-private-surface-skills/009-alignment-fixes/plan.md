---
title: "Implementation Plan: Alignment fixes for private-skill guards"
description: "Route both sk-code surface readers through the advisor's trusted-root helper, test the mirror orphan skip, add advisor vocabulary for private skill roots and replace two NUL bytes, proving each with a test that fails before the change."
trigger_phrases:
  - "alignment fixes plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Alignment fixes for private-skill guards

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | CommonJS and ESM JavaScript on Node 20.19 to 26, one shared CommonJS rule with a TypeScript wrapper |
| **Framework** | None |
| **Storage** | The advisor's untracked SQLite index, rebuilt with `advisor_rebuild` |
| **Testing** | `node --test`, vitest, the advisor regression and validate runs |

### Overview
The advisor's trusted-root rule moves into plain CommonJS, `private-skill-target.cjs`, which the `.ts` wraps and both readers require, so the rule has one copy that loads on every supported Node version. The orphan skip gets an exported seam and a node test. The advisor's vocabulary grows by five phrases and one topic, and the derived graph is regenerated. The NUL fix is a byte replacement checked by identical route gold.
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
- [x] `node --test` over the sk-code, plugin, inventory and mirror tests prints `fail 0`
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Shared helper reuse.

### Key Components
- **`private-skill-target.cjs`**: owns the trusted-root rule; `private-skill-target.ts` wraps it with types.
- **`router-replay-lib.cjs` and the plugin's `declaredSurfaces`**: the two readers that now call it through a lazy loader that fails closed.

### Data Flow
A reader lists the skills root with Dirents, keeps real directories, and for a `local-*` link asks the helper whether its real target sits inside a trusted root before reading its `graph-metadata.json`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `router-replay-lib.cjs` `outsideSurfaces` | Replay and quality-gate surface reader | update | `declared-surfaces-parity.test.cjs`, scratch repro |
| Plugin `declaredSurfaces` | Workspace surface hint | update | parity test, plugin vitest |
| `quality-gate.cjs` | Consumer of `declaredSurfaces` | unchanged | `quality-gate.test.cjs` passes |
| Plugin `advisorSourceSignature` | Cache-signature reader through `Dirent.isDirectory()` | unchanged | inventory SCREENED entry |

Required inventories:
- Same-class producers: the inventory test's detector over every tracked `.skilled` and `.opencode` source.
- Consumers of changed symbols: `rg -n "declaredSurfaces|router-replay-lib" .skilled .opencode` lists the parity test, verify-router-sync, the stage-two test and quality-gate.
- Matrix axes: link target (inside tree, declared root, outside) by helper state (loads, fails).
- Algorithm invariant: a `local-*` link is followed only when its realpath is a directory inside a trusted root.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. Setup captures the failing baselines, Implementation fixes one finding per task, Verification reruns every gate.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Both surface readers, `findOrphans` | `node --test`, vitest |
| Integration | The advisor probe, regression and validate runs; compiled-route tests | skill-advisor CLI, `node --test` |
| Manual | Fail-before runs against the HEAD sources | swapped copies kept under the scratchpad |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `tsc` `allowJs` emitting the `.cjs` into `dist` | Internal | Green | The built runtime cannot import the rule |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A trusted private surface stops reaching surface detection.
- **Procedure**: Revert the commit, then run `node .skilled/bin/skill-advisor.cjs advisor_rebuild --trusted --force true`.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Implementation |
| Implementation | Setup baselines | Verification |
| Verification | Implementation | Closure |
<!-- /ANCHOR:phase-deps -->

---

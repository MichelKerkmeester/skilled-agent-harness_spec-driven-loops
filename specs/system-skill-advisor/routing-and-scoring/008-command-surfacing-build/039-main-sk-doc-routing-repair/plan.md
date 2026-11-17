---
title: "Implementation Plan: Phase 39: main-sk-doc-routing-repair"
description: "Narrow the README intents main added to sk-doc so prompts that other skills own route as before, regenerate the intent signals, recompile the skill graph and rerun the gates."
trigger_phrases:
  - "main sk doc routing repair plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 39: main-sk-doc-routing-repair

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown router keyword lists, generated JSON |
| **Framework** | The sk-doc router intent signal generator, the skill graph compiler, Vitest in the advisor runtime |
| **Storage** | Gate files and the README probe output in this phase's `scratch/` |
| **Testing** | The seven inherited tests, full suite with the child flag unset and set, `FLOOR`, `EVAL`, the four stored sets rescored, the strict graph freshness check |

### Overview
Each README intent main added keeps its README word and loses the words other skills own. The named hook phrases keep only forms that pair the hook name with "readme" without a bare `git` or `hooks` token reaching the scorer alone, or are dropped where the general hook README phrases already cover the request. The runtime folder and hook mirror phrases are narrowed the same way. The intent that moved the holdout row and the ratchet row is found by removing one of main's new intents at a time and reading only the row id and expected skill. Then the intent signals are regenerated and the skill graph recompiled.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] The seven failures reproduced on the merged HEAD and on clean origin/main

### Definition of Done
- [ ] All acceptance criteria met
- [ ] The goal log records the fix and the criterion 2 recheck
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Data-only fix at the producer: the router keyword lists that feed the generated intent signals. No code, option, module or dependency.

### Key Components
- **`sk-doc/ROUTER.md`**: the `HOOK_README`, `RUNTIME_PLUGIN_README`, `RUNTIME_FOLDER` and root guide intents
- **`generate-router-intent-signals.cjs`**: writes `intent_signals_generated` from the router
- **`skill_graph_compiler.py`**: writes `skill-graph.json` from every skill's metadata

### Data Flow
ROUTER.md keywords, then the generated intent signals in `graph-metadata.json`, then the compiled graph and the scorer's projection.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| sk-doc README intents | Carry words other skills own | Narrowed | The seven tests and the README probes |
| `intent_signals_generated` | Mirrors the router | Regenerated | `--check` passes |
| `skill-graph.json` | Stale against sk-doc | Recompiled | Strict freshness exit 0 |
| sk-doc route manifest | Policy hash of the router | Re-minted by the commit hook | The hook's own check |

Required inventories:
- Same-class producers: every README intent main added in `fad83abd791`, `f6f242c1392` and `3dc90eb8e01` is checked, not only the git ones.
- Consumers of changed symbols: the scorer projection, the compiled graph and the route manifest.
- Matrix axes: the suite is run with the child flag unset and set.
- Algorithm invariant: a README request that names its target still reaches its template.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup records the failing tests and the before gates. Implementation narrows the intents, finds the holdout and ratchet cause by row id, regenerates and recompiles. Verification reruns the gates both ways, probes README requests through the CLI and logs the result. The ordered work is in `tasks.md`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | The seven inherited tests | Vitest |
| Integration | Full suite both ways, `FLOOR`, `EVAL`, the stored sets, strict graph freshness | Vitest, the capture scripts, the doctor freshness script |
| Manual | None. README requests are probed by the advisor CLI into a file | `skill-advisor.cjs` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| The merge commit `e91faf28b8c` | Internal | Green | Nothing to repair |
| The skill graph compiler | Internal | Green | The freshness row stays red |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a README request that no longer reaches its template, or a moved floor
- **Procedure**: revert the phase's commit, regenerate the intent signals and recompile the graph
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup (failing tests, before gates) | The merge committed | Implementation |
| Implementation (narrow, regenerate, recompile) | The before gates | Verification |
| Verification (gates, README probes, goal rows) | A green suite | Close-out |
<!-- /ANCHOR:phase-deps -->

---

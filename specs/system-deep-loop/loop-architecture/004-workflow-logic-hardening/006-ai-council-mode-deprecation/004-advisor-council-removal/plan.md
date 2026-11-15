---
title: "Implementation Plan: Phase 4: advisor-council-removal"
description: "Remove the council from the scorer maps, the tracked commands and the Python router, delete the council parity test, then regenerate the bridges and the skill graph. Prove it with the stage-one replay, the drift guard, both deep parity suites and the full advisor suite and typecheck against the start baseline."
trigger_phrases:
  - "advisor council removal plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 4: advisor-council-removal

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript and Python 3 in the advisor runtime, JSON generated files and corpora |
| **Framework** | None. `sk-code` governs the code edits. |
| **Storage** | None changed. |
| **Testing** | Vitest through `npm test` and `tsc` through `npm run typecheck` in `.skilled/skills/system-skill-advisor/runtime/`, `python3 -m py_compile` and `skill_advisor.py` replays |

### Overview
Remove the council from the scorer maps, the tracked commands and the Python router, delete the council parity test, then regenerate the bridges and the skill graph. Prove it with the stage-one replay, the drift guard, both deep parity suites and the full advisor suite and typecheck against the start baseline.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] `rg -l -F '| **Status** | Complete' ../003-runtime-council-removal/spec.md | wc -l` prints 1.
- [ ] `ls ../scratch/gate-baseline.md` prints the path, and the file holds the advisor suite counts at the start commit.

### Definition of Done
- [ ] Every row in `acceptance-criteria.md` is `Met`.
- [ ] `cd .skilled/skills/system-skill-advisor/runtime && npm test && npm run typecheck` exits 0 and `npx vitest run tests/routing-registry-drift-guard.vitest.ts` exits 0.
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-deep-loop/loop-architecture/004-workflow-logic-hardening/006-ai-council-mode-deprecation/004-advisor-council-removal --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Follow the registry. The advisor maps mirror the hub registry, so they drop the mode the registry dropped.

### Key Components
- **Scorer maps**: `aliases.ts` holds the `deep-ai-council` alias group and canonical map entry, `lanes/explicit.ts` the council anchors and `projection.ts` the `command-deep-ai-council` projection. All three are hand-edited.
- **Tracked commands**: `command-attach.ts` holds one hand-kept `/deep:ai-council` row and a `GENERATED MODE COMMANDS` block. The row is removed by hand and the block by `derive-command-bridges.cjs`.
- **Python router**: `skill_advisor.py` names the council in its router, bridges, lexical order and disambiguation text.
- **Generated files and corpora**: `command-bridges.generated.json`, `skill-graph.json` and the routing corpus follow their sources and are regenerated or recaptured, never hand-edited.

### Data Flow
After this child a council prompt scores no deep-loop mode in stage one. The advisor offers `/speckit:ai-council` through the tracked row child 001 added. Research and review prompts score their modes as before.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Owner of the shared contract: `system-deep-loop/mode-registry.json`. The contract that must not break is the research and review route through both stages and the divergent pivot's call into `multi-seat-dispatch.cjs`. Real callers this child changes, read on 2026-11-14:

- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/aliases.ts:23` and `:49`, `lanes/explicit.ts:141` to `:149`, `projection.ts:1128`, `command-attach.ts:37` and `:191`.
- `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:112`, `:303`, `:2848`, `:3440` to `:3571` and `:3627` to `:3632`.

Surfaces this child owns, from the inventory of 451 files saved to `../scratch/council-inventory-2026-11-14.txt`:

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `system-skill-advisor/` (22) | Projection maps, scorer lanes, command bridges, skill graph, fixtures, corpus prompts, parity tests | update and regenerate. Delete `routing-parity-deep-council.vitest.ts`. | Drift guard, `npm test`, corpus at unchanged thresholds |
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup confirms child 003 is Complete. Implementation edits the scorer maps, the tracked commands and the Python router, deletes the council parity test, then regenerates the bridges and the skill graph and recaptures the corpus baseline when its pins changed. Verification replays stage one, runs the advisor suite, typecheck and drift guard and validates this folder. `tasks.md` owns the ordered work.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | The whole advisor suite, including both deep parity suites | `npm test` and `npm run typecheck` in the advisor runtime, `python3 -m py_compile` on `skill_advisor.py` |
| Integration | Stage-one replay and the routing registry drift guard | `skill_advisor.py "<prompt>" --threshold 0.5`, `npx vitest run tests/routing-registry-drift-guard.vitest.ts`, the corpus scoring step of `routing-registry-drift.yml` run locally |
| Manual | Read the `advisor_recommend` output for the council prompt and confirm it offers `/speckit:ai-council` | `node .skilled/bin/skill-advisor.cjs advisor_recommend --json` with the council prompt |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Child 003 | Internal | Yellow: must be Complete first | Parity suites compare against a runtime that still has three loop types. |
| `derive-command-bridges.cjs` and the skill graph generator | Internal | Green | Generated files keep the council. |
| `sk-code` skill | Internal | Green | Code edits lose the quality floor. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a research or review prompt stops scoring its mode, or the corpus fails at the unchanged floors and cannot be repaired in this child.
- **Procedure**: `git revert <sha>` for each commit of this child restores the scorer maps, the tracked row, the Python router, the parity test and the corpus baseline. Then rerun `derive-command-bridges.cjs` and the skill graph generator, because generated files follow their sources.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Child 003 at Status Complete | Implementation |
| Implementation | Setup | Verification |
| Verification | Implementation | Child 005 |
<!-- /ANCHOR:phase-deps -->

---

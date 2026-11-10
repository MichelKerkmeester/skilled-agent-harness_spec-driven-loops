---
title: "Implementation Plan: Advisor phrase calibration: an exact declared multi-word phrase beats repeated generic one-word hits"
description: "Count a repeated single-word author phrase once per skill in the TypeScript explicit lane, and in the Python mirror skip a single-word SKILL.md keyword that repeats the skill's matched graph signal when another skill matched an exact multi-word signal holding it. Prove it with a fixture test on each side and an unchanged set of accuracy, parity and reach gates."
trigger_phrases:
  - "advisor phrase calibration plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Advisor phrase calibration: an exact declared multi-word phrase beats repeated generic one-word hits

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (advisor runtime), Python 3 (fallback scorer mirror) |
| **Framework** | None; in-process scorer lanes and a standalone Python harness |
| **Storage** | None changed; the scorer reads the skill-graph SQLite or the filesystem projection |
| **Testing** | Vitest, the standalone Python harness `tests/python/test_skill_advisor.py` |

### Overview
The explicit-author lane adds a phrase's specificity once for every field that declares it, so one bare word declared as a keyword and as an intent signal scores twice. The fix counts a repeated bare word once per skill in `lanes/explicit.ts` and leaves multi-word repeats alone, and in `skill_advisor.py` it drops a bare-word keyword hit that the graph-signal pass already scored for the same skill when a rival skill matched a multi-word signal holding that word. A fixture test on each side proves the hub with the exact phrase wins, and every accuracy, parity and reach gate is rerun against its pre-change baseline.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Cause confirmed from the scorer's lane breakdown on a fixture skill (spec.md, Measured Behavior)
- [x] Baselines captured before the change (tasks.md, Phase 1)
- [x] Dependencies identified: the runtime `dist/` rebuild before CLI-based gates

### Definition of Done
- [x] All acceptance criteria met
- [x] `npx vitest run tests/scorer/declared-phrase-specificity.vitest.ts` passes after and fails before
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Bare-word repeat collapse.

### Key Components
- **`runtime/lib/scorer/lanes/explicit.ts`**: the explicit-author lane; it now skips a bare word it already scored for the same skill.
- **`runtime/scripts/skill_advisor.py`**: the Python fallback scorer; `_apply_signal_boosts` returns the signals it matched, and the keyword pass skips a one-token repeat that is a word of a rival skill's matched multi-word signal.

### Data Flow
Prompt, then each lane scores every skill, then fusion weights and sums the lanes. The change sits inside the explicit lane's per-skill author loop, before the lane clamps a skill's total to 1, so fusion, confidence and ranking code are untouched.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `lanes/explicit.ts` author loop | Producer of `author:` evidence and score | update | fixture test, full vitest suite |
| `skill_advisor.py` keyword pass and `_apply_signal_boosts` | Producer of `(keyword)` and `(signal)` boosts | update | Python fixture test, Python suite |
| `fusion.ts`, `confidenceFor`, `hasExplicitWorkflowSignal` | Consumers of the explicit lane score and evidence | unchanged | parity, divergence and eval ratchets unchanged |
| `routing-accuracy/scorer-eval-baseline.json` | Ratchet baseline | unchanged | capture script prints the same metrics |
| doctor and router reach probes | Consumers of the full scorer | unchanged | both probes rerun from the worktree |

Required inventories:
- Same-class producers: `rg -n "author:|intentSignals, ...skill.keywords" .skilled/skills/system-skill-advisor/runtime/lib` lists the one author loop plus the slash-target list, which already dedups with a `Set`.
- Consumers of changed symbols: `_apply_signal_boosts` has one caller (`analyze_request`); its new return value is additive.
- Matrix axes: phrase declared in one field or two; bare word or multi-word phrase; one matched word or two distinct words; TypeScript or Python.
- Algorithm invariant: in TypeScript a bare word adds its specificity once per skill and a multi-word phrase once per declaring field; in Python a repeated bare-word keyword adds nothing when it is a word of a rival skill's matched multi-word signal.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. Setup confirms the cause and captures every baseline, Implementation lands the two collapses and their tests, and Verification reruns every gate and compares it with its baseline.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Explicit lane and full scorer on a three-skill fixture projection | Vitest |
| Unit | Python `analyze_request` on a three-skill temp skills root | Python harness |
| Integration | Corpus accuracy, parity and divergence ratchets, doctor and router reach | Vitest, capture script, reach probes |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Advisor runtime `dist/` build | Internal | Green | CLI-based gates would score with the old lane |
| Worktree skill-graph SQLite (gitignored) | Internal | Green | Graph-sensitive tests fail on a fresh worktree until it is indexed |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: any accuracy, parity or reach number drops after the change ships.
- **Procedure**: revert the commit that carries the two scorer edits, then rebuild the runtime with `npm --prefix .skilled/skills/system-skill-advisor/runtime run build`.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Nothing | Implementation, because baselines must predate the change |
| Implementation | Setup | Verification |
| Verification | Implementation and a rebuilt `dist/` | Closure |
<!-- /ANCHOR:phase-deps -->

---

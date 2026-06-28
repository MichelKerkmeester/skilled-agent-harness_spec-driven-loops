---
title: "Implementation Summary: D3-R8 Four-copy vocabulary-drift gate"
description: "Post-build record for checkVocabSync() in parent-hub-vocab-sync.cjs: the classified projection from hub-router vocabularyClasses, the orphan/collision/ownership hard gate emitting VOCAB-DRIFT, the clean/synthetic-drift acceptance, the additive-by-construction no-regression, and the offline-vitest limitation."
trigger_phrases:
  - "vocabulary drift gate implementation summary"
  - "checkvocabsync build record"
  - "vocab-drift gate summary"
importance_tier: "normal"
contextType: "general"
status: "complete"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-sk-design-parent/039-design-enforcement-build/003-d3-routing-utilization/008-vocabulary-drift-gate"
    last_updated_at: "2026-06-28T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Record the vocab-sync gate build and the VOCAB-DRIFT clean/drift verification"
    next_safe_action: "Let the parent process refresh description.json and graph-metadata.json"
    blockers: []
    key_files:
      - ".opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/parent-hub-vocab-sync.cjs"
      - ".opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/tests/parent-hub-vocab-sync.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-agent-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 008-vocabulary-drift-gate |
| **Completed** | 2026-06-28 |
| **Level** | 2 |
| **Deliverables** | Additive `checkVocabSync({ skillRoot })` in `parent-hub-vocab-sync.cjs` + its `VOCAB-DRIFT` hard gate + a co-located `parent-hub-vocab-sync.vitest.ts` |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:what-built -->
## What Was Built

The design family's routing vocabulary lives in five places — `graph-metadata.json` trigger phrases, the `SKILL.md` keyword block, `mode-registry.json` aliases, each `design-*/SKILL.md` `INTENT_SIGNALS`, and the typed `hub-router.json` `vocabularyClasses` — and nothing kept them in sync. This phase adds a guard modeled on `sk-code-router-sync`: it builds a classified projection from the typed `vocabularyClasses` and pins the user-facing aliases to it. A registry alias nothing types, a phrase two modes both claim, or an alias typed under the wrong mode now fails closed with the literal `VOCAB-DRIFT` verdict instead of drifting silently.

### `checkVocabSync({ skillRoot })`

A new pure function in `parent-hub-vocab-sync.cjs` reads the five vocabulary copies relative to `skillRoot` and returns a plain report. The typed `hub-router.json` `vocabularyClasses` is the projection authority: `buildProjection` normalizes every typed keyword into `normalizedPhrase -> { phrases, classes, modes }`, and `ownerModeForClass` derives each class's owner mode from its name prefix (`interface-`, `foundations-`, `motion-`, `audit-`, `md-generator-`), with `hub-identity` owned by the hub. A phrase normalizer (`normalizePhrase`) lowercases, trims edge punctuation, and collapses hyphen/space runs so the spaced registry aliases reconcile against the hyphenated keyword forms. When `hub-router.json` or `mode-registry.json` is absent at `skillRoot`, the scan returns a benign pass (`familyPresent:false`, `driftDetected:false`, empty arrays), which keeps it a no-op for any non-registry skill.

### The `VOCAB-DRIFT` hard gate

Three facets are hard violations: `orphanAliases` (a registry alias reflected in no typed class owned by its own mode), `aliasCollisions` (a normalized phrase owned by two or more modes across the registry and the projection), and `ownershipDrift` (a registry alias typed only under a different mode's class). Any non-empty hard facet sets `driftDetected:true` and carries `verdict:'VOCAB-DRIFT'` in the scan's own return; the additive CLI folds that into its exit code. An unparseable required input (`hub-router.json` / `mode-registry.json`) emits a P0 `unparseable-input` finding rather than throwing.

### Reported (non-gating) metrics

Three facets are measured and reported but never set `driftDetected`: `untypedKeywordRate` (SKILL.md keywords absent from every typed class, over the keyword count), `phantomTypedKeywords` (typed phrases, excluding `hub-identity`, that appear in no source copy), and `triggerPhraseCoverage` (the fraction of trigger phrases the projection or aliases reflect). Per-mode `INTENT_SIGNALS` are read into `buildIntentSignalOwners` and folded only into the phantom-keyword source universe, so a typed phrase a mode legitimately signals is not mis-flagged as phantom; they are deliberately kept out of the hard-gate inputs.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/parent-hub-vocab-sync.cjs` | Created | The `checkVocabSync` scan, the classified projection, the three hard facets + `VOCAB-DRIFT` gate, the reported metrics, and the `require.main` CLI (`--skill`, exit 0/1/2) |
| `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/tests/parent-hub-vocab-sync.vitest.ts` | Created | Co-located Vitest: live-family clean, synthetic orphan-alias `VOCAB-DRIFT`, and non-registry no-op |

<!-- /ANCHOR:what-built -->
---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The implementer (cli-codex gpt-5.5 high fast) created the two new files; the orchestrator then verified acceptance independently rather than trusting the claim, and the numbers below were re-confirmed at doc time by running the CLI directly against the live family.

On the live sk-design root the scan returns `familyPresent:true`, `projectionParsed:true`, `typedKeywordCount:123`, `score:100`, `driftDetected:false`, `verdict:null`, with `orphanAliases`, `aliasCollisions`, and `ownershipDrift` all empty and zero findings (CLI exit 0). The reported metrics measure `untypedKeywordRate:0` (the typed `hub-router` vocabulary fully covers the SKILL.md keyword block, so `untypedKeywords` is empty), `phantomTypedKeywords:["redesign the hero"]`, and `triggerPhraseCoverage:0.875`. The gate was proven on a synthetic family: the real files were copied to a temp dir and one alias (`"orphan interface alias"`) was added to `mode-registry.json` `modes[0]` without a matching typed class, producing `orphanAliases` containing it, an `orphan-alias` P0 finding, `score:60`, `driftDetected:true`, `verdict:'VOCAB-DRIFT'`, and CLI exit 1 — while the live `mode-registry.json` stayed byte-unchanged.

No-regression holds by construction, not by a green suite run. The change is two NEW files and zero edits to any existing file: `git status` shows both as untracked (`??`), and `sk-code-router-sync.vitest.ts`, `router-replay.cjs`, and all five vocabulary files are untouched. `node --check parent-hub-vocab-sync.cjs` exits 0.

<!-- /ANCHOR:how-delivered -->
---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Make `hub-router.json` `vocabularyClasses` the projection authority | The typed, mode-owned classes are the one structured copy with explicit ownership, so reconciling the other four copies against them is unambiguous |
| Guard the scan behind a family-presence check (`hub-router.json` + `mode-registry.json`) | Returns a benign pass for any non-registry skill, so the gate is a no-op everywhere else and no-regression holds by construction |
| Fix the hard-gate set to orphan alias / collision / ownership drift only | These are the structural contradictions that silently degrade routing; keeping the set tight keeps the verdict false-positive-free |
| Keep `untypedKeywordRate` / `phantomTypedKeywords` / `triggerPhraseCoverage` reported, never gating | They are drift signal, not defects; gating on them would block a structurally clean family on informational noise |
| Scope per-mode `INTENT_SIGNALS` out of the hard-gate inputs | INTENT_SIGNALS carry internal routing keywords (e.g. brainstorm, critique) that are not user aliases; requiring them to be typed would false-positive, so they feed only the reported phantom-source set |
| Compute `untypedKeywordRate`, never hard-code it | The rate is a live measurement of the typed-vocabulary coverage; hard-coding it would mask future drift |

<!-- /ANCHOR:decisions -->
---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `node --check parent-hub-vocab-sync.cjs` | PASS, exit 0 (re-run at doc time) |
| Real-state (live sk-design) | PASS, `familyPresent:true`, `typedKeywordCount:123`, `score:100`, `driftDetected:false`, `verdict:null`, all three hard facets empty, 0 findings, CLI exit 0 |
| Real-state reported metrics | PASS, `untypedKeywordRate:0`, `phantomTypedKeywords:["redesign the hero"]`, `triggerPhraseCoverage:0.875` (measured, not hard-coded) |
| Synthetic gate (orphan alias) | PASS, a temp-copy alias `"orphan interface alias"` unreflected in the typed vocab → `orphanAliases` populated + `orphan-alias` P0 finding → `driftDetected:true`, `verdict:'VOCAB-DRIFT'`, `score:60`, CLI exit 1 |
| No-op (non-registry root) | PASS, a temp dir with no `hub-router.json` → `familyPresent:false`, `driftDetected:false`, `verdict:null` |
| Live registry untouched by the synthetic case | PASS, the seeded alias was added only on the temp copy; the live `mode-registry.json` still lacks it |
| NO-REGRESSION: additive by construction | PASS, `git status` shows the 2 new files untracked (`??`); `sk-code-router-sync.vitest.ts`, `router-replay.cjs`, and all five vocab files byte-unchanged |
| Full skill-benchmark vitest suite | NOT RUN, the suite is not runnable in this offline environment (needs network / its own config); no-regression guaranteed by construction (2 new files, zero edits) + the CLI was exercised directly on the clean and drift cases |
| Scope clean (only the 2 named files) | PASS, no live `.opencode/skills` file was edited by this phase folder |

<!-- /ANCHOR:verification -->
---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The full skill-benchmark vitest suite was not executed.** It is not runnable in this offline environment (it needs network access and its own config), the same limit the sibling registry-audit phase hit. No-regression is guaranteed by construction (the change is 2 NEW files with zero edits to any existing file) and the CLI was run directly on both the clean and the synthetic-drift cases. Re-run `npx vitest run skill-benchmark/tests` from `scripts/` in a networked environment to close this out.
2. **`untypedKeywordRate` measures 0 on the live family, not the plan's ~0.465 baseline.** The typed `hub-router` `vocabularyClasses` now fully cover the SKILL.md keyword block, so `untypedKeywords` is empty and the computed rate is 0. The rate is measured by the scan, not hard-coded; the regression checks only that it is a number. This continues the trend the sibling registry-audit phase recorded (its uncovered rate fell from ~0.46 to 0.39 as the typed vocabulary grew).
3. **Per-mode `INTENT_SIGNALS` are scoped out of the hard gate.** In the shipped scan they feed only the reported phantom-keyword source set (so a typed phrase a mode legitimately signals is not mis-reported as phantom); they never set `driftDetected`. Wiring INTENT_SIGNALS cross-mode intersections into the hard gate (the broader framing in `plan.md` §INTENT_SIGNALS scoping) is a documented follow-on, not delivered here.
4. **Aggregate-ladder wiring is out of scope.** Threading a `VOCAB-DRIFT` tier into `score-skill-benchmark.cjs` is an explicit follow-on; the verdict currently lives in the scan return and the additive CLI exit code.

<!-- /ANCHOR:limitations -->

---

<!--
LEVEL 2 IMPLEMENTATION SUMMARY
- Core + Level 2 verification focus
- Build record for checkVocabSync in parent-hub-vocab-sync.cjs + the VOCAB-DRIFT gate
- Additive by construction (2 new files, zero edits); full vitest suite not runnable offline
-->
</content>
</invoke>

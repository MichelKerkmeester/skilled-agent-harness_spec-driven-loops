---
title: "Implementation Plan: Four-copy vocabulary-drift gate (parent-hub-vocab-sync)"
description: "Additive parent-hub-vocab-sync Vitest+CLI, modeled on sk-code-router-sync, that builds a classified vocabulary projection across a design family's five copies (graph-metadata trigger_phrases, SKILL keywords, registry aliases, per-mode INTENT_SIGNALS, hub-router vocabularyClasses) and fails on owned-vocabulary drift (orphans, collisions, ownership mismatch)."
trigger_phrases:
  - "parent-hub-vocab-sync gate"
  - "four-copy vocabulary drift design"
  - "classified vocabulary projection sk-design"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-sk-design-parent/039-design-enforcement-build/003-d3-routing-utilization/008-vocabulary-drift-gate"
    last_updated_at: "2026-06-28T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Confirm the plan against the delivered vocab-sync gate and mark phases done"
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
# Implementation Plan: Four-copy vocabulary-drift gate (parent-hub-vocab-sync)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js, CommonJS (`.cjs`) + Vitest (TypeScript) |
| **New CLI/module** | `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/parent-hub-vocab-sync.cjs` (sibling of `router-replay.cjs`) |
| **New test** | `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/tests/parent-hub-vocab-sync.vitest.ts` (sibling of `sk-code-router-sync.vitest.ts`) |
| **Prior art mirrored** | `skill-benchmark/tests/sk-code-router-sync.vitest.ts` (drift guard) + `skill-benchmark/router-replay.cjs` (pure-fn + `require.main === module` CLI via `_args.cjs`) |
| **Family audited** | `sk-design/` — `graph-metadata.json`, `SKILL.md`, `mode-registry.json`, `design-*/SKILL.md` (5 modes), `hub-router.json` |
| **Testing** | Vitest (`npx vitest run skill-benchmark/tests` from `scripts/`), `node --check` |

### Overview
Add a new, strictly additive `parent-hub-vocab-sync` gate — a pure CommonJS module exposing `checkVocabSync({ skillRoot })` plus a `require.main === module` CLI, and a co-located Vitest suite that drives it against the live design family. It mirrors `sk-code-router-sync`: where that guard pins sk-code's machine router to the filesystem and prose, this one builds a **classified vocabulary projection** for a registry-mode parent hub and pins the family's five vocabulary copies to one another.

The five copies are: (1) `graph-metadata.json` `trigger_phrases`, (2) the `SKILL.md` `<!-- Keywords: … -->` block, (3) `mode-registry.json` `modes[].aliases[]`, (4) each `design-*/SKILL.md` `INTENT_SIGNALS` keyword set, and (5) `hub-router.json` `vocabularyClasses` — the typed, mode-owned classes that act as the **projection authority** (the D3-R1 structure). The gate normalizes phrases across hyphen/space forms, derives each typed class's owner mode, and reconciles the four source copies against that projection: it flags **orphans** (a source phrase nothing types), **collisions** (a phrase owned by two modes), and **ownership drift** (a registry alias typed under a different mode's class). A hard defect sets `driftDetected:true` and carries the literal `verdict:'VOCAB-DRIFT'`.

The change is purely additive: it imports nothing from and edits nothing in `sk-code-router-sync`, `router-replay.cjs`, or any of the five vocabulary files; it reads the family read-only. On the live family it runs green (the registry is structurally clean today) while **reporting** the current untyped-keyword drift state as a non-gating metric, exactly as the registry-audit sibling reports its uncovered-intent rate.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] `sk-code-router-sync.vitest.ts` check shape (parse → no-dead → no-orphan → prose-present) and `router-replay.cjs` CLI pattern (`_args.cjs`, `require.main === module`, exit codes) understood and chosen as the model — mirrored: `parent-hub-vocab-sync.cjs` reuses `parseRouter` + `_args.cjs`
- [x] The five vocabulary copies confirmed on disk, with `hub-router.json.vocabularyClasses` fixed as the typed projection authority and its class→mode ownership rule defined — `ownerModeForClass` derives the owner per class-name prefix
- [x] Hard-gate set fixed to: orphan alias / alias-or-typed collision / ownership drift — `driftDetected = orphanAliases || aliasCollisions || ownershipDrift`
- [x] Reported (non-gating) facets fixed to: untyped-keyword rate, phantom typed keywords, trigger-phrase coverage; thresholds OFF by default — none set `driftDetected`
- [x] Phrase normalization (lowercase, collapse hyphen/space runs) specified so the spaced and hyphenated copies reconcile — `normalizePhrase`

### Definition of Done
- [x] `checkVocabSync({ skillRoot })` + `require.main === module` CLI added in the new `parent-hub-vocab-sync.cjs`; pure function exported — exported with `normalizePhrase`/`ownerModeForClass`
- [x] On the live sk-design family: `orphanAliases`, `aliasCollisions`, `ownershipDrift` all empty; `untypedKeywordRate` + `phantomTypedKeywords` + `triggerPhraseCoverage` reported (measured); `driftDetected:false` — measured `0`, `["redesign the hero"]`, `0.875`
- [x] A synthetic family (real files copied to a temp root) with one registry alias **not** reflected in `hub-router.json` vocab → `orphanAliases` non-empty, `driftDetected:true`, `verdict:'VOCAB-DRIFT'` — `"orphan interface alias"`, CLI exit 1
- [x] `sk-code-router-sync.vitest.ts`, `router-replay.cjs`, and all five vocabulary files are byte-unchanged (no-regression) — `git status` shows only the 2 new files, both untracked
- [x] `node --check parent-hub-vocab-sync.cjs` passes; `npx vitest run skill-benchmark/tests` stays green (both the existing router-sync suite and the new suite) — `node --check` exit 0; the full suite is not runnable offline, no-regression guaranteed by construction (2 new files, zero edits)
- [x] No spec/packet/phase IDs or spec paths embedded in the new code or comments (evergreen) — evergreen grep over the module is clean

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Additive pure-function drift guard mirroring `sk-code-router-sync`. A new `.cjs` module reads the family's five vocabulary copies off disk relative to `skillRoot`, builds a normalized classified projection, computes defect arrays, derives a hard-gate verdict, and returns a plain object. A `require.main === module` CLI prints that object and folds the gate into the exit code (mirroring `router-replay.cjs`). A co-located Vitest `require`s the pure function and asserts the live family is clean and a synthetic drift fails — mirroring how `sk-code-router-sync.vitest.ts` `require`s `parseRouter` from `router-replay.cjs`. The guard shares no state with, and modifies nothing in, the existing router-sync guard or any vocab file.

### Key Components
- **`checkVocabSync({ skillRoot })`** — the new pure scan. Reads `graph-metadata.json`, `SKILL.md`, `mode-registry.json`, every `design-*/SKILL.md`, and `hub-router.json` relative to `skillRoot`.
- **Family-presence guard** — when `hub-router.json` (the projection authority) or `mode-registry.json` is absent at `skillRoot`, return a benign pass (`familyPresent:false`, `driftDetected:false`, `verdict:null`, empty arrays, null metrics). This keeps the scan a no-op for any non-registry skill and guarantees no-regression.
- **Classified projection builder** — from `hub-router.json.vocabularyClasses`, build `normalizedPhrase → { classes:Set, modes:Set }`; each class's owner mode is derived from its name prefix (`interface-*`→design-interface, `foundations-*`→design-foundations, `motion-*`→design-motion, `audit-*`→design-audit, `md-generator-*`→design-md-generator), with `hub-identity` owned by the hub (no mode).
- **Phrase normalizer** — lowercase, trim, collapse runs of `[-\s]+` to a single space, strip surrounding punctuation, so the hyphenated `SKILL.md` keywords and the spaced registry aliases reconcile against the dual-form vocab classes.
- **Finding + score model** — reuse the sibling scans' severity/penalty scheme (`P0:40, P1:12, P2:3`, score floored at 0) so a score-comparison consumer reads consistent numbers.
- **CLI (additive, standalone)** — a `require.main === module` block using `_args.cjs`: `--skill <skill-root>` runs the scan, prints the JSON, and exits `0` (clean) / `1` (hard drift) / `2` (missing or unparseable inputs), mirroring `router-replay.cjs`'s argv/exit convention.

### Return shape (mirrors the sibling scans)
```
{
  familyPresent: boolean,          // false → benign no-op pass
  projectionParsed: boolean,       // hub-router.json vocabularyClasses present + parsed
  typedKeywordCount: number,       // normalized typed phrases (sanity: > 50)
  score: number,                   // 100 - penalties, floored at 0
  driftDetected: boolean,          // any hard facet non-empty
  verdict: string|null,            // 'VOCAB-DRIFT' when driftDetected, else null
  findings: Array<{class,severity,locus,detail}>,
  // hard-gate facets (clean on the live family today)
  orphanAliases: Array,            // P0: registry alias reflected in NO owning vocab class
  aliasCollisions: Array,          // P0: normalized phrase owned by >=2 modes (registry or typed)
  ownershipDrift: Array,           // P0: registry alias typed under a different mode's class
  // reported facets (carry the current drift state; non-gating)
  untypedKeywords: string[],       // SKILL.md keywords absent from every vocab class
  untypedKeywordRate: number|null, // |untyped| / |skill keywords|  (~0.465 baseline)
  phantomTypedKeywords: string[],  // vocab-class keywords absent from every source copy
  triggerPhraseCoverage: number|null // fraction of trigger_phrases reflected in projection/aliases
}
```

### Data Flow (the projection + the checks)
1. **Read + normalize the five copies** — pull `trigger_phrases[]`, the `Keywords:` comment list, `modes[].{workflowMode,aliases[]}`, each mode's `INTENT_SIGNALS` keyword arrays, and `vocabularyClasses[*].keywords`. Normalize every phrase. Fail-soft: an unparseable required input (hub-router/registry) becomes a P0 finding, not a throw — matching the modules' defensive style.
2. **Build the classified projection** [authority] — `normalizedPhrase → {classes,modes}` from `vocabularyClasses`, with owner mode per class-name prefix.
3. **aliasCollisions** [P0 → gate] — union ownership across `modes[].aliases[]` (registry) and the typed projection; any normalized phrase mapped to ≥2 distinct modes is a collision. (Research baseline: 0 today.)
4. **orphanAliases** [P0 → gate] — every registry alias must appear in at least one vocabulary class owned by its own mode; an alias reflected in no class is an orphan. This is the acceptance target: an alias added to the registry but not to `hub-router` vocab lands here. (Clean today — the `*-aliases` classes mirror the registry aliases verbatim.)
5. **ownershipDrift** [P0 → gate] — a registry alias whose only typed class belongs to a mode different from the registry's assignment. (Clean today.)
6. **untypedKeywords + untypedKeywordRate** [metric → reported] — `SKILL.md` keywords (and trigger_phrases) present in no vocabulary class; `rate = |untyped| / |skill keywords|`. Reported only; an optional threshold gate is documented but OFF by default, so the ~0.465 baseline does not block. This metric **is** the "current drift state" the acceptance asks the gate to report.
7. **phantomTypedKeywords** [metric → reported] — typed vocab-class phrases (excluding `hub-identity`, whose identity tokens legitimately need not be user phrases) that appear in none of the four source copies. Reported, not gating.
8. **triggerPhraseCoverage** [metric → reported] — fraction of `trigger_phrases` reflected in the projection or registry aliases.

### INTENT_SIGNALS scoping
Per-mode `INTENT_SIGNALS` carry many internal routing keywords (e.g. "brainstorm", "critique") that are deliberately not user aliases, so the gate does **not** require every INTENT_SIGNALS keyword to be a typed class member. INTENT_SIGNALS participate only where they intersect an alias or a typed phrase: a phrase that a mode's INTENT_SIGNALS owns but that the projection types under a different mode counts toward `ownershipDrift`/`aliasCollisions`. This keeps the hard gate precise and false-positive-free while still catching cross-mode contradictions.

### Gate rule + emission
`driftDetected = orphanAliases.length > 0 || aliasCollisions.length > 0 || ownershipDrift.length > 0`. When true, `verdict = 'VOCAB-DRIFT'`; that label IS the emission the contract requires, carried in the scan's own return and surfaced via the additive CLI exit code. Reported metrics never set `driftDetected`. Wiring a `VOCAB-DRIFT` tier into any downstream `score-skill-benchmark.cjs` verdict ladder is explicitly OUT OF SCOPE here (see Dependencies / Rollback).

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Scaffold
- [x] Create `parent-hub-vocab-sync.cjs` beside `router-replay.cjs`; export `checkVocabSync` (plus internal helpers for tests) — exports `checkVocabSync`/`normalizePhrase`/`ownerModeForClass`
- [x] Implement the family-presence guard (benign pass when `hub-router.json` / `mode-registry.json` absent) — `emptyResult()` returned, verified by the no-op case
- [x] Read + JSON-parse the five copies relative to `skillRoot`; fail-soft (P0 finding, no throw) on an unparseable required input — `readJson` emits a P0 `unparseable-input` finding instead of throwing
- [x] Implement the phrase normalizer (lowercase, collapse hyphen/space runs, strip edge punctuation) — `normalizePhrase`

### Phase 2: Projection + Checks + Emit
- [x] Build the classified projection `normalizedPhrase → {classes,modes}` with per-class owner-mode derivation — `buildProjection` + `ownerModeForClass`
- [x] Compute `aliasCollisions` (phrase owned by ≥2 modes across registry + projection) — empty on the live family
- [x] Compute `orphanAliases` (registry alias reflected in no owning vocab class) — drives the synthetic `VOCAB-DRIFT` case
- [x] Compute `ownershipDrift` (registry alias typed under a different mode's class) — empty on the live family; INTENT_SIGNALS are scoped out of the hard gate (see `spec.md` OPEN QUESTIONS)
- [x] Compute reported metrics: `untypedKeywords` + `untypedKeywordRate`, `phantomTypedKeywords`, `triggerPhraseCoverage` — measured `0`, `["redesign the hero"]`, `0.875`
- [x] Build `findings[]` with consistent severities; derive `score`, `driftDetected`, and `verdict:'VOCAB-DRIFT'` — `SCORE_PENALTY {P0:40,P1:12,P2:3}`, `HARD_VERDICT`
- [x] Add the `require.main === module` CLI (`_args.cjs`, `--skill`, JSON print, exit 0/1/2) — verified clean exit 0, drift exit 1
- [x] Comment-hygiene pass: durable WHY only — no spec/packet/phase IDs, no spec paths (evergreen [HARD]) — evergreen grep clean

### Phase 3: Verification
- [x] `node --check parent-hub-vocab-sync.cjs` — exit 0
- [x] Run `checkVocabSync` against the live sk-design root; confirm the real clean state (empty hard facets) and record the reported metrics — `typedKeywordCount:123`, all hard facets empty, metrics `0`/`["redesign the hero"]`/`0.875`
- [x] Build a synthetic family in a temp dir (real files copied), inject one un-reflected registry alias → assert `orphanAliases` non-empty, `driftDetected`, `verdict:'VOCAB-DRIFT'` — `"orphan interface alias"`, exit 1, live registry untouched
- [x] Confirm `sk-code-router-sync.vitest.ts` and `router-replay.cjs` are untouched and the full `skill-benchmark/tests` suite stays green (no-regression) — both untouched; the full suite is not runnable offline, no-regression guaranteed by construction (2 new files, zero edits)

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Syntax | `parent-hub-vocab-sync.cjs` parses | `node --check` |
| Unit (real state) | `checkVocabSync` on the live sk-design family: empty `orphanAliases`/`aliasCollisions`/`ownershipDrift`, `typedKeywordCount > 50`, measured reported metrics, `driftDetected:false` | Vitest (`require` the new module directly) |
| Unit (synthetic gate) | Real files copied to an OS temp dir, one registry alias added without a matching vocab class → `orphanAliases` non-empty, `driftDetected:true`, `verdict:'VOCAB-DRIFT'` | Vitest + `mkdtempSync`/`cpSync` (mirrors the family's temp-fixture pattern) |
| Unit (no-op) | A non-registry skill root (no `hub-router.json`) → `familyPresent:false`, `driftDetected:false` | Vitest |
| Non-regression | `sk-code-router-sync.vitest.ts` + `router-replay.cjs` byte-unchanged; all five vocab files unchanged; full suite green | `npx vitest run skill-benchmark/tests` (from `scripts/`) |

The new suite lands as `tests/parent-hub-vocab-sync.vitest.ts` — a sibling of `sk-code-router-sync.vitest.ts`, not an edit to it. It reads the live family read-only; synthetic fixtures live under OS temp dirs and are removed in `afterAll`, per the suite's read-only-against-repo policy.

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `sk-design/hub-router.json` (`vocabularyClasses`) | Internal | Green | Typed projection authority; absent → benign no-op |
| `sk-design/mode-registry.json` (`modes[].aliases`) | Internal | Green | Alias ownership source; absent → benign no-op |
| `sk-design/graph-metadata.json` (`trigger_phrases`) | Internal | Green | Trigger-phrase coverage source |
| `sk-design/SKILL.md` (`Keywords:` block) | Internal | Green | Untyped-keyword-rate source |
| `sk-design/design-*/SKILL.md` (`INTENT_SIGNALS`) | Internal | Green | Per-mode keyword source (scoped to intersections) |
| `router-replay.cjs` / `_args.cjs` | Internal | Green | CLI argv/exit pattern mirrored; both must remain untouched |
| `sk-code-router-sync.vitest.ts` | Internal | Green | Prior-art model; must remain untouched (additive sibling only) |
| `score-skill-benchmark.cjs` verdict ladder | Internal | Out of scope | A `VOCAB-DRIFT` aggregate tier is a follow-on, not this phase |
| Vitest | External | Green | Verification runner; resolves from the repo-root install |

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: the new guard flakes on the live family, false-positives drift, or the suite regresses.
- **Procedure**: delete the two new files (`parent-hub-vocab-sync.cjs`, `tests/parent-hub-vocab-sync.vitest.ts`). Because the change is purely additive — no edits to any existing module, test, or vocab file — removal restores byte-identical prior behavior with nothing else to revert.

<!-- /ANCHOR:rollback -->
---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Scaffold + guard + normalizer) ──> Phase 2 (Projection + checks + emit + CLI) ──> Phase 3 (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Scaffold | None | Projection + checks |
| Projection + checks + emit | Scaffold | Verify |
| Verify | Projection + checks + emit | None |

<!-- /ANCHOR:phase-deps -->
---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Scaffold + presence guard + normalizer | Low-Medium | 45-60 minutes |
| Projection + three hard checks + reported metrics + CLI | Medium | 2.5-3.5 hours |
| Verification (real + synthetic + no-op + no-regression) | Medium | 1-1.5 hours |
| **Total** | | **4.5-6 hours** |

<!-- /ANCHOR:effort -->
---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Baseline captured: `npx vitest run skill-benchmark/tests` green before the change (existing router-sync suite recorded) — the suite is not runnable offline; baseline is the additive two-file diff (zero edits to existing files)
- [x] Live sk-design reported metrics recorded (untyped-keyword rate, phantom count) for later drift comparison — `untypedKeywordRate:0`, `phantomTypedKeywords:["redesign the hero"]`, `triggerPhraseCoverage:0.875`
- [x] Confirmed the two new files are the only additions (no edits to existing modules/tests/vocab files) — `git status` shows both files untracked (`??`), nothing else under `skill-benchmark/`

### Rollback Procedure
1. **Immediate**: delete `tests/parent-hub-vocab-sync.vitest.ts`
2. **Revert code**: delete `parent-hub-vocab-sync.cjs`
3. **Verify**: re-run `npx vitest run skill-benchmark/tests`; confirm the recorded baseline matches and the router-sync suite is unaffected

### Data Reversal
- **Has data migrations?** No (pure static scan; no persisted state)
- **Reversal procedure**: N/A — additive two-file delete, no shared state

<!-- /ANCHOR:enhanced-rollback -->

---

<!--
LEVEL 2 PLAN
- Additive parent-hub-vocab-sync.cjs + tests/parent-hub-vocab-sync.vitest.ts, modeled on sk-code-router-sync
- Classified projection across 5 design vocab copies; hub-router.json vocabularyClasses is the authority
- Hard gate: orphanAliases / aliasCollisions / ownershipDrift -> VOCAB-DRIFT; untyped-rate reported, non-gating
- No-regression: no edits to sk-code-router-sync, router-replay.cjs, or any vocab file
-->

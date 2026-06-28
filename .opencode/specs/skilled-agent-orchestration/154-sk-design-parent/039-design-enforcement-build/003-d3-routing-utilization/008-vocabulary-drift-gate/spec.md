---
title: "D3-R8 — Four-copy vocabulary-drift gate"
description: "Add checkVocabSync({ skillRoot }) in parent-hub-vocab-sync.cjs that builds a classified projection from hub-router vocabularyClasses and reconciles the design family's five vocabulary copies, emitting VOCAB-DRIFT on an orphan alias, an alias collision, or ownership drift, while reporting untyped-keyword rate, phantom typed keywords, and trigger-phrase coverage."
trigger_phrases:
  - "d3-r8 vocabulary drift gate"
  - "parent hub vocab sync design build"
  - "vocab-drift hub gate"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-sk-design-parent/039-design-enforcement-build/003-d3-routing-utilization/008-vocabulary-drift-gate"
    last_updated_at: "2026-06-28T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Upgrade the spec to the Level 2 contract and mark the vocab-drift gate complete"
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
# D3-R8 — Four-copy vocabulary-drift gate

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Enforcement class** | enforceable |
| **Dimension** | D3 — Routing & Utilization |
| **Completed** | 2026-06-28 |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The design family's routing vocabulary lives in five places — `graph-metadata.json` trigger phrases, the `SKILL.md` keyword block, `mode-registry.json` aliases, each `design-*/SKILL.md` `INTENT_SIGNALS`, and the typed `hub-router.json` `vocabularyClasses` — with no gate keeping them in sync. A future edit can add a registry alias nothing types, give one phrase to two modes, or type an alias under the wrong mode, and the skill-benchmark would not notice. Drift in this vocabulary silently degrades routing.

### Purpose
Add a static guard, `checkVocabSync({ skillRoot })`, in a new `parent-hub-vocab-sync.cjs` (sibling of `router-replay.cjs`), modeled on `sk-code-router-sync`. It builds a classified projection from `hub-router.json` `vocabularyClasses` — the typed, mode-owned authority — and reconciles the registry aliases against it. It fails closed with the literal `verdict:'VOCAB-DRIFT'` on any hard structural defect (orphan alias, alias collision, or ownership drift) and reports three non-gating metrics (untyped-keyword rate, phantom typed keywords, trigger-phrase coverage). The scan is a benign no-op for any skill without a hub router, so the rest of the suite is unaffected.

<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- An additive `checkVocabSync({ skillRoot })` plus `normalizePhrase` / `ownerModeForClass` helpers, exported from a new `parent-hub-vocab-sync.cjs`
- A classified projection `normalizedPhrase -> { phrases, classes, modes }` from `hub-router.json` `vocabularyClasses`, with per-class owner-mode derivation
- Three hard facets: `orphanAliases` (P0), `aliasCollisions` (P0), `ownershipDrift` (P0) → `VOCAB-DRIFT`
- Three reported metrics: `untypedKeywordRate`, `phantomTypedKeywords`, `triggerPhraseCoverage` (non-gating)
- A family-presence guard returning a benign pass when `hub-router.json` or `mode-registry.json` is absent
- Fail-soft on an unparseable required input: a P0 `unparseable-input` finding, not a throw
- A `require.main === module` CLI (`--skill`, exit 0 clean / 1 drift / 2 missing-or-unparseable)
- A co-located Vitest (live-family clean, synthetic orphan-alias drift, non-registry no-op)

### Out of Scope
- Any edit to `sk-code-router-sync.vitest.ts`, `router-replay.cjs`, or any of the five vocabulary files (purely additive)
- Wiring a `VOCAB-DRIFT` verdict tier into `score-skill-benchmark.cjs` (explicit follow-on)
- Turning the `untypedKeywordRate` threshold gate ON (the metric ships reported, threshold OFF)
- Feeding per-mode `INTENT_SIGNALS` into the hard gate (they feed only the reported phantom-source set)

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/parent-hub-vocab-sync.cjs` | Create | `checkVocabSync` + the classified projection + the three hard facets + `VOCAB-DRIFT` gate + reported metrics + the `--skill` CLI |
| `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/tests/parent-hub-vocab-sync.vitest.ts` | Create | The co-located Vitest: clean live family, synthetic orphan-alias drift, non-registry no-op |

<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `checkVocabSync({ skillRoot })` added in `parent-hub-vocab-sync.cjs` and exported | The function exists, is listed in `module.exports`, and returns the documented report shape |
| REQ-002 | Healthy family passes | On the live sk-design root: `orphanAliases`, `aliasCollisions`, `ownershipDrift` all empty; `typedKeywordCount > 50`; `driftDetected:false`; metrics measured |
| REQ-003 | A hard structural defect emits `VOCAB-DRIFT` | A seeded orphan alias / collision / ownership drift sets `driftDetected:true` and `verdict:'VOCAB-DRIFT'` |
| REQ-004 | An unparseable required input fails soft, not throws | A missing/unparseable `hub-router.json` / `mode-registry.json` emits a P0 `unparseable-input` finding (CLI exit 2), no throw |
| REQ-005 | Purely additive | `sk-code-router-sync.vitest.ts`, `router-replay.cjs`, and all five vocabulary files are byte-unchanged |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Family-presence guard | A skill with no `hub-router.json` returns `familyPresent:false`, `driftDetected:false`, empty arrays |
| REQ-007 | Reported metrics non-gating | `untypedKeywordRate`, `phantomTypedKeywords`, `triggerPhraseCoverage` are measured but never set `driftDetected` |
| REQ-008 | Evergreen body | `parent-hub-vocab-sync.cjs` carries no spec/packet/phase IDs or `specs/` paths |

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `checkVocabSync` on the live sk-design root returns `familyPresent:true`, `typedKeywordCount:123`, `score:100`, `driftDetected:false`, `verdict:null`, all three hard facets empty, 0 findings (CLI exit 0).
- **SC-002**: A synthetic family (real files copied to a temp dir) with one registry alias unreflected in the typed vocab → `orphanAliases` populated + `orphan-alias` P0 finding → `driftDetected:true`, `verdict:'VOCAB-DRIFT'` (CLI exit 1).
- **SC-003**: A non-registry skill root (no `hub-router.json`) → `familyPresent:false`, `driftDetected:false`, `verdict:null`.
- **SC-004**: The reported metrics are measured on the live family: `untypedKeywordRate:0`, `phantomTypedKeywords:["redesign the hero"]`, `triggerPhraseCoverage:0.875` (computed, not hard-coded).
- **SC-005**: `node --check parent-hub-vocab-sync.cjs` exits 0; the change is 2 NEW files with zero edits to any existing file.

<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | The full skill-benchmark vitest suite is not runnable offline | No-regression cannot be proven by a green suite run | The change is additive by construction (2 new files, zero edits), so no-regression holds without the suite; the CLI was exercised directly on the clean and drift cases; re-run the suite in a networked environment to close out |
| Risk | `INTENT_SIGNALS` over-feed the gate and false-positive | Internal routing keywords (brainstorm, critique) get treated as user aliases | Scope INTENT_SIGNALS out of the hard gate; they feed only the reported phantom-source set |
| Risk | A new file changes existing scan numbers | Existing skills mis-score | The scan is a standalone new module that imports only `parseRouter`/`_args.cjs` read-only; it edits nothing and is a no-op for any non-registry skill |
| Risk | `untypedKeywordRate` drift blocks a clean family | False positive on an informational metric | Keep the metric reported with its threshold OFF; the measured `0` is recorded, not gated |
| Dependency | `hub-router.json` `vocabularyClasses` (sk-design) | Typed projection authority | Internal, green; absent → benign no-op |
| Dependency | `mode-registry.json`, `graph-metadata.json`, `SKILL.md`, `design-*/SKILL.md` | The other four vocabulary copies | Internal, green; read read-only |
| Dependency | `router-replay.cjs` / `_args.cjs` | CLI argv/exit pattern + `parseRouter` reused | Internal, green; both remain untouched |

<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Determinism
- **NFR-D01**: For a non-registry skill the scan returns a fixed benign pass (`familyPresent:false`, `score:100`, empty arrays); no existing scan output changes.

### Backward Compatibility
- **NFR-B01**: The change is a new module plus a new test; `router-replay.cjs`, `sk-code-router-sync.vitest.ts`, and the five vocabulary files keep their bytes, so every existing consumer is unaffected.

<!-- /ANCHOR:nfr -->
---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Family Boundaries
- **No family**: `hub-router.json` or `mode-registry.json` absent at `skillRoot` → benign pass, no gate.
- **Unparseable input**: a required input that will not JSON-parse → P0 `unparseable-input` finding + CLI exit 2 (no throw).

### Defect Boundaries
- **Orphan alias**: a registry alias reflected in no typed class owned by its own mode → P0, `VOCAB-DRIFT`.
- **Alias collision**: a normalized phrase owned by two or more modes across registry + projection → P0, `VOCAB-DRIFT`.
- **Ownership drift**: a registry alias typed only under a different mode's class → P0, `VOCAB-DRIFT`.
- **Phantom typed keyword only**: a typed phrase (e.g. `"redesign the hero"`) in no source copy lowers nothing and does NOT trip the gate; it is reported.

<!-- /ANCHOR:edge-cases -->
---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

- **Surface count**: One new `.cjs` module plus one new co-located Vitest; nothing existing is edited.
- **Risk concentration**: Regression risk is eliminated by construction — the module is standalone, additive, and a no-op for non-registry skills; the controlling guards are the additive two-file diff and the family-presence gate.

<!-- /ANCHOR:complexity -->
---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should the full skill-benchmark vitest suite gate completion? **RESOLVED: Not this phase; the suite is not runnable in this offline environment (network + own config). No-regression is guaranteed by construction (2 NEW files, zero edits to any existing file) and the CLI was run directly on the clean and drift cases. Re-run the suite in a networked environment to close out.**
- Should per-mode `INTENT_SIGNALS` feed the hard gate? **RESOLVED: No for this phase. INTENT_SIGNALS carry internal routing keywords (brainstorm, critique) that are not user aliases, so the shipped scan keeps them out of the hard-gate inputs to stay false-positive-free; they participate only in the reported phantom-keyword source set. Wiring their cross-mode intersections into `ownershipDrift`/`aliasCollisions` (the broader framing in `plan.md` §INTENT_SIGNALS scoping) is a documented follow-on.**
- Should `untypedKeywordRate` gate the build? **RESOLVED: No; the metric ships reported with its threshold OFF. The measured `0` (the typed vocab fully covers the SKILL.md keywords, vs the plan's ~0.465 baseline) is computed by the scan, not hard-coded, and is informational drift signal, not a defect.**

<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Implementation Summary**: See `implementation-summary.md`

---

<!--
LEVEL 2 SPEC
- Core + Level 2 verification focus
- Evidence: checkVocabSync in parent-hub-vocab-sync.cjs + the VOCAB-DRIFT gate; live family clean (typedKeywordCount 123, empty hard facets, exit 0) + synthetic orphan-alias VOCAB-DRIFT (exit 1)
- Limitation: full vitest suite not runnable offline; no-regression guaranteed by construction (2 new files, zero edits)
-->
</content>

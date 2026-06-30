---
title: "Implementation Plan: Command-surface projection layer (argumentGrammar + choreography[])"
description: "Additive recipe-field port onto the existing sk-design command-metadata SSOT plus its surface-check drift gate and the five /design:* wrappers, holding STATUS=PASS drift=0."
trigger_phrases:
  - "d6-r1 command recipe projection"
  - "command metadata design build"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/039-design-enforcement-build/006-d6-corpus-ports/001-command-recipe-projection"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Mark plan gates complete and rename phase-deps/effort/enhanced-rollback anchors"
    next_safe_action: "Let the parent refresh description.json and graph-metadata.json"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/command-metadata.json"
      - ".opencode/skills/sk-design/shared/scripts/design-command-surface-check.mjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-agent-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Command-surface projection layer (argumentGrammar + choreography[])

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Surface** | sk-design command projection layer (JSON SSOT + Node ESM checker + Markdown wrappers) |
| **SSOT file** | The existing sibling command-metadata JSON beside the mode registry |
| **Checker** | The existing design command surface-check ESM script (drift gate) |
| **Wrappers** | The five `/design:*` command markdown files |
| **Change shape** | Additive only — new recipe fields, new validators, new wrapper sections |

### Overview

The design corpus that motivates this phase treats commands as workflow recipes: a command is a verb that chains named skills together to do a complete job ("commands are workflows - verbs; the skills run underneath them"). The current sk-design command surface already carries most of the recipe (typed argument hint, output contract, pipeline, discriminator, register policy) from the earlier command-specificity build, and a 1:1 projection from each command to one `workflowMode` key is already enforced. What it does **not** yet carry is the two genuinely net-new recipe shapes the corpus isolated:

1. **`argumentGrammar`** — a typed argument grammar (positional + flags + a rendered form) that the flat `argumentHint` string only gestures at.
2. **`choreography[]`** — the ordered, named-skill chain the command runs underneath itself (hub then mode packet then references then optional build handoff).

This plan ports those two fields onto the existing SSOT, extends the existing surface-check to require and drift-gate them, and projects `choreography[]` into the five wrapper docs. Every step is additive and preserves the established `STATUS=PASS ... drift=0` baseline. The work is scoped tightly so the recipe **scorer cap** (sibling phase 002), the full **next-options handoff grammar** (sibling phase 007), and the broader **structural drift audit** (sibling phase 008) stay out of scope.

### Verified baseline (captured before any edit)

- `node .opencode/skills/sk-design/shared/scripts/design-command-surface-check.mjs` returns `STATUS=PASS STAGE=complete`, `METADATA commands=5 aliases=15 workflowModes=audit,foundations,interface,md-generator,motion`, `SUMMARY invalid=0 drift=0`, exit `0`.
- The SSOT already holds five records, one per `workflowMode` key; `ownerMode` is singular and the checker validates `ownerMode` matches a `workflowMode`.
- `outputContract`, `next`, `argumentHint`, `pipeline`, `discriminator`, `registerPolicy`, `taskProjections` already exist and are already enforced.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Spec deliverable read: add the recipe fields to the SSOT, project over the five `workflowMode` keys, generate/drift-gate the wrappers, keep the registry as identity — scope confirmed against spec §3
- [x] Baseline surface-check captured (`invalid=0 drift=0`, exit 0) — captured before any edit
- [x] Two logic-sync decisions resolved (see Dependencies): `ownerModes[]` rename and `nextOptions[]` ownership versus sibling phase 007 — resolved: `ownerMode` singular kept, `next[]` minimal kept
- [x] Net-new field shapes (`argumentGrammar`, `choreography[]`) agreed before editing the SSOT — shapes match §3

### Definition of Done
- [x] All five SSOT records carry valid `argumentGrammar` and `choreography[]`; no existing field removed or mutated — all five tagged additively
- [x] Surface-check requires and drift-gates both new fields; `argumentGrammar.render` equals `argumentHint` for every record — `validateArgumentGrammar` enforces the equality
- [x] All five wrappers carry a `CHOREOGRAPHY` section that matches the SSOT — `audit`/`foundations`/`interface`/`md-generator`/`motion`, drift=0
- [x] `design-command-surface-check.mjs` returns `STATUS=PASS ... invalid=0 drift=0`, exit 0 — orchestrator-verified, exit 0
- [x] `mode-registry.json` is byte-unchanged; routing artifacts untouched — `mode-registry.json`/`hub-router.json`/`score-skill-benchmark.cjs` untouched; hubRoute 23/5/0
- [x] No spec path, phase number, or artifact id embedded in any code comment (evergreen) — evergreen scan clean

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Single-source-of-truth projection with a deterministic drift gate. The SSOT JSON is authored by hand; the surface-check is the regen/drift hook that proves every wrapper equals the SSOT. No generator binary exists today and acceptance does not require one — the drift gate, not a generator, is the contract that "wrappers match metadata".

### Exact targets (named, verified on disk)

| Target | Class | What changes |
|--------|-------|--------------|
| The sibling command-metadata JSON (beside the mode registry) | EDIT — additive | Add `argumentGrammar` and `choreography[]` to each of the five records. Preserve every existing field. |
| The design command surface-check ESM script (under sk-design `shared/scripts/`) | EDIT — additive | Add both fields to the required-field set; add a metadata validator for each; add a wrapper-drift detector for `choreography[]`; assert `argumentGrammar.render === argumentHint`. |
| The five `/design:*` command markdown wrappers | EDIT — additive | Add one `## CHOREOGRAPHY` section per wrapper reflecting that command's `choreography[]`. Leave existing sections and frontmatter intact. |
| The mode registry JSON (beside the SSOT) | UNCHANGED — identity | Read-only reference. The registry stays identity-only per the spec; no edit. |

### Proposed field shapes (buildable contract)

`argumentGrammar` (typed, additive — does not replace `argumentHint`):

```
"argumentGrammar": {
  "positional": [{ "name": "target", "required": true, "kind": "design-target" }],
  "flags": [
    { "name": "--scope", "required": false, "takesValue": true, "kind": "scope" },
    { "name": "--score", "required": false, "takesValue": false, "kind": "boolean" }
  ],
  "render": "<target> [--scope] [--score]"
}
```

The checker asserts `argumentGrammar.render === argumentHint`, so the typed grammar, the flat hint, and the wrapper `argument-hint` frontmatter all stay in lockstep (this is why no new frontmatter is needed and drift stays 0).

`choreography[]` (ordered named-skill chain the recipe runs underneath the command):

```
"choreography": [
  { "order": 1, "skill": "sk-design", "resource": "<hub SKILL.md>", "action": "load the parent hub routing table and shared references" },
  { "order": 2, "skill": "<owner-mode packet>", "resource": "<mode SKILL.md>", "action": "load and apply the pinned mode contract" }
]
```

Each step names a real skill/packet that the wrapper already reads in its INSTRUCTIONS section, so the choreography is a typed restatement of the existing load order, not new behavior.

### Data flow
1. Implementer authors the two new fields per record in the SSOT.
2. Implementer extends the surface-check: required fields, validators, and the `choreography[]` wrapper-drift detector.
3. Implementer adds the `## CHOREOGRAPHY` section to each wrapper to match the SSOT.
4. Surface-check runs; drift must be 0 and metadata must be valid.

### Enforcement honesty (code-enforced vs advisory)
- **Code-enforced:** `argumentGrammar` present and well-formed; `render` equals `argumentHint`; `choreography[]` is a non-empty ordered array of real named skills/steps; each wrapper `CHOREOGRAPHY` section matches the SSOT (drift=0). All of this is structural and the surface-check bites on it.
- **Advisory:** whether the chosen choreography is the *right* sequence and whether it yields good design. Taste cannot be hashed; the gate proves the recipe is *declared and consistent*, never that it is well-judged.

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Schema + SSOT
- [x] Confirm the two logic-sync decisions (Dependencies) before touching the SSOT — `ownerMode` singular, `next[]` minimal
- [x] Add `argumentGrammar` to each of the five records; set `render` to exactly the existing `argumentHint` — done, render equals hint per record
- [x] Add `choreography[]` to each of the five records from the wrapper's existing load order — ordered `order`/`skill`/`resource`/`action` steps
- [x] Preserve every existing field; change nothing in the mode registry — additive only; registry untouched

### Phase 2: Surface-check enforcement
- [x] Add `argumentGrammar` and `choreography` to the required-field set — both required; a missing field reports INVALID
- [x] Add a metadata validator for `argumentGrammar` (positional/flags/render shape + `render === argumentHint`) — `validateArgumentGrammar` added
- [x] Add a metadata validator for `choreography[]` (non-empty ordered array; each step has order/skill/action; skill names are non-empty) — choreography validator added
- [x] Add a wrapper-drift detector that asserts each command's `CHOREOGRAPHY` section names every choreography step; register the new drift field in the drift-field set — CHOREOGRAPHY drift detector wired into the drift collector
- [x] Keep all comments evergreen — no spec path, phase id, or artifact number in the code — evergreen scan clean

### Phase 3: Wrapper projection + verification
- [x] Add a `## CHOREOGRAPHY` section to all five wrappers reflecting their `choreography[]` — `audit`/`foundations`/`interface`/`md-generator`/`motion`
- [x] Run the surface-check; resolve any drift until `invalid=0 drift=0`, exit 0 — `STATUS=PASS commands=5 invalid=0 drift=0`, exit 0
- [x] Confirm the mode registry is byte-unchanged and routing artifacts are untouched — registry/router/scorer untouched; hubRoute 23/5/0

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tool |
|-----------|-------|------|
| Schema validity | SSOT parses; five records; both new fields present and well-formed | `node design-command-surface-check.mjs` (metadata stage) |
| Projection 1:1 | Every `workflowMode` key resolves to exactly one recipe | surface-check metadata stage |
| Drift gate | Each wrapper `CHOREOGRAPHY` section matches the SSOT; `render` equals `argumentHint` | surface-check surface stage → `drift=0` |
| No-regression | Existing fields, registry identity, and prior passes all hold | re-run surface-check; diff the registry |
| Negative probe | Temporarily mismatch one choreography step and confirm the checker reports drift, then revert | surface-check (manual, in scratch only) |

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `ownerModes[]` vs `ownerMode` decision | Internal (logic-sync) | **Needs human confirm** | The spec build-outline lists `ownerModes[]` (plural); the SSOT and checker use `ownerMode` (singular) pervasively. Renaming is non-additive and breaks `drift=0` + the ownerMode→workflowMode validation. Recommendation: keep `ownerMode` singular; capture any multi-skill aspect inside `choreography[]`. Escalate the literal rename before adopting it. |
| `nextOptions[]` ownership | Internal (scope boundary) | **Needs human confirm** | The spec build-outline lists `nextOptions[]`; sibling phase 007 (`next-options-handoff-grammar`) owns the full handoff/STATUS grammar. Recommendation: keep the existing `next[]` as the minimal next-options here and defer the richer `nextOptions[]` + STATUS handoff grammar to 007 to avoid double-owning. |
| `outputContract` | Internal | Green (already present) | Listed in the recipe schema but already built and enforced; preserve as-is, no new work. |
| Surface-check stays the single drift gate | Internal | Green | The broader structural drift audit (route fixtures, generated-doc comparison) is sibling phase 008; do not pull it in. |
| Node runtime for the ESM checker | External | Green | Required to run the surface-check; no new packages. |

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger:** surface-check cannot reach `drift=0`, or an existing field/behavior regresses.
- **Procedure:** revert the SSOT, the surface-check, and the five wrappers to the pre-change state; re-run the surface-check to confirm the restored baseline (`invalid=0 drift=0`, exit 0). All three artifacts are plain text under version control, so revert is a clean checkout with no data migration.

<!-- /ANCHOR:rollback -->
---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Schema + SSOT) ──> Phase 2 (Surface-check) ──> Phase 3 (Wrappers + verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Schema + SSOT | Logic-sync decisions | Surface-check, Wrappers |
| Surface-check | Schema + SSOT | Wrappers verification |
| Wrappers + verify | Schema, Surface-check | None |

Order matters: if wrappers are edited before the checker knows the new fields, the run is not a meaningful drift gate; if the checker requires the fields before the SSOT carries them, the metadata stage fails closed.

<!-- /ANCHOR:phase-deps -->
---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Schema + SSOT (5 records × 2 fields) | Low-Medium | 1-1.5 hours |
| Surface-check (2 validators + 1 drift detector) | Medium | 1.5-2.5 hours |
| Wrappers (5 × CHOREOGRAPHY section) + verification | Low-Medium | 1-1.5 hours |
| **Total** | | **3.5-5.5 hours** |

<!-- /ANCHOR:effort -->
---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Baseline surface-check output captured (`invalid=0 drift=0`, exit 0) — captured before any edit
- [x] Mode registry hash recorded before edits to prove identity preservation — registry confirmed byte-unchanged after the work
- [x] Working tree clean except the three in-scope artifacts — change set limited to the SSOT, the surface-check, and the five wrappers

### Rollback Procedure
1. **Immediate:** restore the SSOT, the surface-check, and the five wrappers from the last clean state.
2. **Verify:** re-run the surface-check; confirm `invalid=0 drift=0`, exit 0.
3. **Confirm identity:** diff the mode registry against the recorded hash.

### Data Reversal
- **Has data migrations?** No — text-only artifacts under version control.
- **Reversal procedure:** plain revert; no database or generated-state to unwind.

<!-- /ANCHOR:enhanced-rollback -->

---

<!--
LEVEL 2 PLAN
- Additive recipe-field port onto an existing, passing command surface
- Preserves STATUS=PASS drift=0; registry stays identity-only
- Scope-locked against sibling phases 002 / 007 / 008
-->

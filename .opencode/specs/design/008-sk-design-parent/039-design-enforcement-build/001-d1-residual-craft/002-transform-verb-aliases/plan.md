---
title: "Implementation Plan: Transform-verb registry aliases + interface authoring lane"
description: "planning. Register five transform verbs as interface routing aliases with an audit-vs-interface tie-breaker, sync the router vocabulary, create the interface transform authoring lane, and add router-replay gold prompts reconciled with the command-layer task projections."
trigger_phrases:
  - "transform verb aliases plan"
  - "design transform routing build"
  - "interface transform application lane"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/039-design-enforcement-build/001-d1-residual-craft/002-transform-verb-aliases"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Marked plan phases complete after transform-verb routing passed acceptance"
    next_safe_action: "Run validate.sh --strict; let orchestrator regenerate description and graph metadata"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/mode-registry.json"
      - ".opencode/skills/sk-design/hub-router.json"
      - ".opencode/skills/sk-design/design-interface/references/design-process/transform_application.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-agent-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Router consumes hub-router.json vocabularyClasses, not registry aliases, so scope was amended to include it"
---
# Implementation Plan: Transform-verb registry aliases + interface authoring lane

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | JSON registry + Markdown reference + JSON router fixtures |
| **Framework** | sk-design parent hub routing (registry-backed mode resolution) |
| **Storage** | `sk-design/mode-registry.json`, `design-interface/references/design-process/`, skill-benchmark fixture corpus |
| **Testing** | `router-replay.cjs` over paired gold-prompt fixtures (deterministic) |

### Overview
The five transform verbs `bolder / quieter / distill / clarify / delight` have no parseable route into the sk-design hub: they are absent from every mode's registry alias set, so a bare natural-language transform request ("make this bolder") has no deterministic mode to resolve to, and there is no interface-mode authoring lane where such a request can land. This phase registers the five verbs as routing **aliases** on the `interface` mode, adds an audit-vs-interface tie-breaker (audit = "should it be" / interface = "make it"), creates the `transform_application.md` authoring lane, and adds router-replay gold prompts so each verb resolves deterministically with no alias collision.

This work is ADDITIVE only: every existing alias, mode, and the registry's current zero-collision property are preserved. It is the routing/craft-layer twin of the already-shipped command-layer task projections (see Architecture for the reconciliation), not a replacement for them.

**Scope amendment (Logic-Sync).** The plan originally named only `mode-registry.json`. During implementation the registry proved to be the source of truth, but the live hubRoute router consumes `hub-router.json`'s vocabulary classes, not the registry aliases. Editing the registry alone would have shipped a route that never fired. The scope was amended to add `hub-router.json` as a data-only vocabulary sync, with the registry held as the single source of truth and `parent-hub-vocab-sync.cjs` enforcing agreement. The four named targets are therefore `mode-registry.json`, `hub-router.json`, `transform_application.md` and the gold fixtures.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Verb set frozen to the five named by spec (`bolder/quieter/distill/clarify/delight`) — confirmed against spec, no verb added or dropped
- [x] Owner mode confirmed (`interface`) and tie-breaker direction confirmed (audit = "should it be" / interface = "make it") — recorded in `transformVerbRouting`
- [x] No-collision precondition confirmed: none of the five verbs already appears as an alias on any mode — drift guard reports 0 collisions
- [x] Reconciliation with the existing command-layer task projections stated (shared verbs must agree on owner mode) — D2 reconciliation holds, four shared verbs owned by interface

### Definition of Done
- [x] All five verbs present as `interface` aliases; registry still parses and has zero alias collisions — registry parses, 0 collisions
- [x] Tie-breaker block present and routes audit-framed transform requests to `audit` — `audit-transform-question` class in hub-router routes "should it be ..." to audit
- [x] `transform_application.md` authoring lane created with a lane per verb — five verb lanes plus shared contract and gold prompts
- [x] Router-replay over the gold prompts resolves every verb deterministically (interface arm) and every audit-framed arm to `audit` — hubRoute scorer routes all 10 arms correctly
- [x] Shipped artifacts are evergreen (no spec IDs, packet numbers, or research-finding IDs embedded) — evergreen grep over the four targets finds none

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Registry-backed hub routing. The sk-design parent hub resolves a mode by reading `mode-registry.json`; the router indexer consumes each mode's `aliases[]` array, lowercases the incoming prompt, and boundary-matches alias keywords to select a `workflowMode`. Transform-verb aliases plug into this existing mechanism — no new router engine is introduced.

### Key Components
- **Interface-mode alias block** — `sk-design/mode-registry.json` → the `interface` mode entry's `aliases[]` array. Append the five transform verbs here. This array is exactly what the router indexer reads to resolve a free-text prompt to the `interface` mode.
- **Transform tie-breaker block** — `sk-design/mode-registry.json`, an additive block that encodes the disambiguation `audit-framing ("should it be …") → audit` vs `interface-framing ("make it …") → interface`, so a transform verb co-occurring with an audit question reroutes to `audit` rather than defaulting to `interface`. The registry is the routing source the hub reads today; this keeps the alias set and its tie-breaker co-located for the forward migration noted below.
- **Interface transform authoring lane** — `sk-design/design-interface/references/design-process/transform_application.md` (NEW). The landing contract once `interface` is selected: one lane per verb (`bolder/quieter/distill/clarify/delight`) carrying a keep/remove ledger, a before/after frame, and the earned-moment + reduced-motion + opt-out guards; plus the prose statement of the tie-break rule and the gold-prompt list. Sits beside its siblings `design_principles.md`, `variation_diversity.md`, `real_ui_loop.md`.
- **Router-replay gold prompts** — paired fixtures under the skill-benchmark `sk-design/` fixture root, following the existing `*.public.json` (prompt) + `*.private.json` (`expected.workflowMode` / `routeOutcome` / `forbiddenWorkflowModes` / `minimalPairGroup`) shape. Per-verb alias prompts plus audit-vs-interface minimal pairs.

### Reconciliation with the command-layer task projections (the already-shipped sibling)
The command layer (`command-metadata.json`) already carries `taskProjections[]` on `/design:audit`, `/design:foundations`, and `/design:interface`, promoting transform verbs (`typeset/colorize` → foundations, `bolder/quieter/distill/delight` → interface, `harden/polish` → audit) as **command-visible task projections** reached through an explicit `/design:*` invocation. This phase's aliases are a **different layer with a different entry path** — they resolve a bare natural-language prompt through the hub router when no command is named — so there is no duplication: aliases and task projections are distinct fields in distinct files reached by distinct paths.

The contract this phase must hold is consistency, not separation:
- **Shared verbs agree on owner.** `bolder/quieter/distill/delight` are interface-owned in both layers; their alias resolution MUST land on `interface`, matching the command task-projection `ownerMode`.
- **`clarify` is alias-only for now.** It has no command task projection yet; that is intentional and consistent with the transform-lane proof-card direction (distill/clarify/delight are interface transform lanes). Alias-only is additive, not contradictory.
- **Foundations/audit transform verbs stay out of this alias set.** `typeset/colorize` (foundations) and `harden/polish` (audit) remain command-surface task projections only — this phase's tie-breaker is specifically audit↔interface, so the alias set is the interface-leaning "make it {bolder/quieter/distill/clarify/delight}" family, preserving the clean registry.

### Data Flow
1. Natural-language transform prompt arrives ("make this bolder").
2. Hub router lowercases the prompt and boundary-matches registry aliases.
3. A transform-verb alias matches → resolves the `interface` mode.
4. If the prompt carries audit framing ("should it be bolder") → the tie-breaker reroutes to `audit`.
5. Once `interface` is selected, `transform_application.md` is the landing contract for the request.
6. `router-replay` over the gold prompts asserts every verb resolves deterministically with no alias collision.

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup & Reconcile
- [x] Read `mode-registry.json` (interface mode) and `command-metadata.json` (interface `taskProjections`) — read both, captured baseline aliases and projections
- [x] Confirm the five-verb set and the interface owner; confirm `clarify` has no command projection — confirmed, `clarify` absent from command taskProjections
- [x] Confirm none of the five verbs collides with an existing alias on any mode — baseline collision count zero
- [x] Confirm `transform_application.md` is absent and the `design-process/` sibling set — confirmed absent, siblings noted

### Phase 2: Core Implementation
- [x] Append `bolder/quieter/distill/clarify/delight` to the `interface` mode `aliases[]` (preserve existing order/entries) — appended, prior aliases preserved
- [x] Add the additive audit-vs-interface tie-breaker block (audit = "should it be" / interface = "make it") — `transformVerbRouting` block added to registry, `audit-transform-question` class added to hub-router
- [x] Create `transform_application.md` with one lane per verb (keep/remove ledger, before/after, earned-moment + reduced-motion + opt-out) plus the tie-break rule and gold-prompt list — created with all five lanes and the shared contract
- [x] Author paired gold-prompt fixtures: one alias arm per verb (→ interface) and an audit-vs-interface minimal pair per verb sharing a `minimalPairGroup` — 20 fixtures, 10 arms, shared `minimalPairGroup` per verb

### Phase 3: Verification
- [x] Validate `mode-registry.json` parses as JSON — parses clean, `hub-router.json` also parses
- [x] Run `router-replay` over the gold prompts; every interface arm → `interface`, every audit arm → `audit` — hubRoute scorer routes all 10 arms correctly
- [x] Confirm zero alias collisions after the additions — drift guard reports 0 collisions
- [x] Confirm shared verbs resolve to the same owner as their command task projection — `bolder/quieter/distill/delight` owner interface in both layers
- [x] Confirm shipped artifacts carry no embedded IDs/paths (evergreen) — evergreen grep over the four targets finds none

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Structural | `mode-registry.json` parses; aliases unique across modes | JSON parse + collision scan |
| Routing | Each verb prompt resolves to `interface`; audit-framed arm resolves to `audit` | `router-replay.cjs` over gold fixtures |
| Reconciliation | Shared verbs' alias owner equals command task-projection `ownerMode` | Manual cross-check against `command-metadata.json` |
| Evergreen | No spec IDs / packet numbers / finding IDs in shipped artifacts | Static grep over changed files |

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `mode-registry.json` interface mode | Internal | Green | No alias home |
| `design-interface/references/design-process/` | Internal | Green | No authoring-lane home |
| `command-metadata.json` task projections | Internal | Green | Reconciliation cannot be verified |
| `router-replay.cjs` + skill-benchmark fixture root | Internal | Green | Acceptance cannot be proven deterministically |

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Router-replay shows a verb resolving to the wrong mode, an alias collision appears, or the registry fails to parse.
- **Procedure**: Revert the alias-array and tie-breaker additions in `mode-registry.json`, delete the new `transform_application.md`, and delete the new fixture pairs. All changes are additive, so reversal restores the prior zero-collision registry exactly.

<!-- /ANCHOR:rollback -->
---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup & Reconcile) ──> Phase 2 (Implementation) ──> Phase 3 (Verification)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup & Reconcile | None | Implementation |
| Implementation | Setup & Reconcile | Verification |
| Verification | Implementation | None |

<!-- /ANCHOR:phase-deps -->
---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup & Reconcile | Low | 30 minutes |
| Implementation (aliases + tie-breaker + lane + fixtures) | Medium | 2-3 hours |
| Verification (router-replay + collision + reconciliation) | Low | 1 hour |
| **Total** | | **3.5-4.5 hours** |

<!-- /ANCHOR:effort -->
---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Pre-change registry alias count and collision count recorded (baseline) — baseline captured, zero collisions
- [x] Feature flag configured (N/A - additive routing data) — N/A, routing data only
- [x] Confirm `transform_application.md` did not pre-exist (so deletion is safe on rollback) — confirmed absent before create

### Rollback Procedure
1. **Immediate**: Remove the five appended aliases and the tie-breaker block from `mode-registry.json`
2. **Revert files**: Delete the new `transform_application.md` and the new gold-prompt fixture pairs
3. **Verify**: `router-replay` returns to its pre-change result; alias collision count is back to zero
4. **Notify**: Note the revert in the phase implementation summary

### Data Reversal
- **Has data migrations?** No (routing config + reference doc + test fixtures only)
- **Reversal procedure**: Plain file revert/delete; no persisted state to unwind

<!-- /ANCHOR:enhanced-rollback -->

---

<!--
LEVEL 2 PLAN (~140 lines)
- Core + Level 2 addendum
- Phase dependencies and effort estimation
- Enhanced rollback procedure
-->

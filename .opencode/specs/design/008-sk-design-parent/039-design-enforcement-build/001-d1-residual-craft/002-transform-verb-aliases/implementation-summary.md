---
title: "Implementation Summary: Transform-Verb Hub Routing"
description: "Five transform verbs now route through the sk-design hub. make-it lands on interface to apply the change, should-it-be lands on audit to judge it, and a drift guard keeps registry, hub-router and command-metadata in agreement."
trigger_phrases:
  - "transform verb routing summary"
  - "make it should it be routing"
  - "transform verb hub-router implementation"
importance_tier: "normal"
contextType: "general"
status: "complete"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/039-design-enforcement-build/001-d1-residual-craft/002-transform-verb-aliases"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Routed 5 transform verbs; make-it to interface, should-it-be to audit; drift guard PASS"
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
      - "Router consumes hub-router.json vocabularyClasses, not registry aliases, so scope was amended to include hub-router.json as a data-only vocabulary sync"
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 002-transform-verb-aliases |
| **Completed** | 2026-06-29 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A bare transform request now has a deterministic route into the sk-design hub. Say "make it bolder" and the router lands on `interface` to apply the change. Say "should it be bolder" and it lands on `audit` to judge whether the change is warranted. Five verbs (bolder, quieter, distill, clarify, delight) carry this split, and a drift guard keeps the registry, the router vocabulary and the command layer in agreement. No taste claim is made here. The routing is proven, and a new interface lane guides how the transform gets applied once the request lands.

### Transform-verb routing

The five verbs were added in two places. `mode-registry.json` is the source of truth: the five verbs join the `interface` mode `aliases[]`, and a new `transformVerbRouting` block records the contract (`interfaceFrame: "make it"`, `auditFrame: "should it be"`, `aliasOnly: [clarify]`, `commandProjectionParity: [bolder, quieter, distill, delight]`, and `excludedAliases` naming foundations `typeset/colorize` and audit `harden/polish`). The live router reads `hub-router.json`, so the same five verbs were added to the interface vocabulary keywords there, plus a new `audit-transform-question` vocabulary class holding the "should it be ..." keywords. The registry authors the intent once. The router consumes a synced copy of it.

### Interface application lane

`design-interface/references/design-process/transform_application.md` is the landing contract once `interface` is selected. It opens with the routing rule (make-it to interface, should-it-be to audit), then a shared application contract every verb obeys: a keep ledger, a remove ledger, a before/after read, an earned-moment guard, a reduced-motion path and an opt-out clause that reroutes to audit or foundations when the transform would harm comprehension, accessibility or trust. Below that sits one lane per verb (bolder, quieter, distill, clarify, delight) with verb-specific keep/remove guidance, and a gold-prompt table anchoring the ten routes. The lane states plainly that the verb is a work request, not a user-facing slider.

### The ten gold arms

Twenty fixture files (ten logical arms, each a public prompt plus a private expectation) prove the split. Each verb gets an alias arm and an audit arm sharing a `minimalPairGroup`: "make it {verb}" expects `workflowMode: interface` with audit forbidden, and "should it be {verb}" expects `workflowMode: audit` with interface forbidden. The minimal pairs are what make the framing tie-break testable rather than asserted.

### Mid-phase scope amendment (Logic-Sync)

The original plan named only `mode-registry.json`. The implementer halted before finishing because the hubRoute router consumes `hub-router.json`'s `vocabularyClasses`, not the registry aliases, so editing the registry alone would have shipped a route that never fired. Rather than hand-roll a workaround, the implementer raised the conflict. The orchestrator amended the scope to add `hub-router.json` as a data-only vocabulary sync, with the registry held as the single source of truth and the `parent-hub-vocab-sync` guard enforcing agreement between them.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/sk-design/mode-registry.json` | Modified | Added the five transform verbs to the interface `aliases[]` plus a `transformVerbRouting` contract block |
| `.opencode/skills/sk-design/hub-router.json` | Modified | Added the five verbs to interface vocabulary and a new `audit-transform-question` vocabulary class |
| `.opencode/skills/sk-design/design-interface/references/design-process/transform_application.md` | Created | Interface landing lane: routing rule, shared application contract, per-verb lanes and gold prompts |
| `deep-loop-workflows/deep-improvement/assets/skill_benchmark/fixtures/sk-design/sk-design-transform-*` | Created | Twenty gold fixtures, ten arms: five alias arms to interface and five audit arms to audit, public/private pairs |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The implementer (cli-codex gpt-5.5 xhigh fast) authored the additions, then halted on the registry-vs-router conflict and surfaced it instead of working around it. The orchestrator amended the scope to include `hub-router.json` as a data-only vocabulary sync, then verified acceptance independently. The `parent-hub-vocab-sync.cjs` drift guard passed with zero orphan aliases, zero collisions and score 100 (`driftDetected=false`). The hubRoute scorer over the full sk-design corpus held its prior thirteen passing routes and added all ten new transform arms, for 23 pass, 5 known-gap, 0 regression. Both JSON files parse. The four shared verbs reconcile with the command-metadata task projections, and `clarify` is recorded as alias-only. Shipped artifacts were grepped for spec and packet identifiers to keep them evergreen.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| The five verbs land on interface, and audit takes the reroute via framing | "make it" is an application request and "should it be" is a judgment call, so the frame is the cleanest tie-break between the two modes |
| `clarify` is alias-only while the other four mirror command projections | `clarify` has no command task projection yet, and inventing one would create a contract the command layer never agreed to |
| Amended the scope to include `hub-router.json` mid-phase | The hubRoute router reads `hub-router.json` vocabulary classes, not registry aliases, so editing only the registry would have shipped a dead route |
| Registry stays the source of truth, hub-router holds the consumed copy | Authoring the verb set once keeps intent in one place, and the drift guard syncs the consumed copy rather than duplicating the decision |
| `typeset/colorize` and `harden/polish` stay out of this alias set | This phase's tie-break is audit versus interface only, so foundations and audit transform verbs remain command-surface projections to keep the registry clean |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `parent-hub-vocab-sync.cjs --skill .opencode/skills/sk-design` | PASS, `driftDetected=false`, 0 orphan aliases, 0 collisions, score 100 |
| hubRoute scorer over the full sk-design corpus | 23 pass / 5 known-gap / 0 regression, prior 13 held and all 10 new transform arms route correctly |
| "make it {verb}" and "should it be {verb}" across all five verbs | interface and audit respectively, deterministic across all ten arms |
| `mode-registry.json` and `hub-router.json` parse | Both parse clean as JSON |
| D2 reconciliation against `command-metadata.json` | `bolder/quieter/distill/delight` owner is `interface` in both layers, `clarify` confirmed alias-only |
| Evergreen and scope audit | No spec or packet IDs in shipped artifacts, change set is the four named targets only |
| Pre-existing sk-code finding (`guided-run.ts` TS module header) | Red at baseline, unrelated to this phase, out of scope, tracked separately |
| `validate.sh <folder> --strict` | Spec-doc rules clean, only the expected generated-metadata fingerprint residual remains for orchestrator regeneration |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Routing is proven, taste is not.** The router proves the make-it/should-it-be split. It does not judge whether a given transform was applied well. The lane guides application but cannot enforce craft.
2. **`clarify` is alias-only.** It routes from a bare prompt but has no command-surface projection yet. If a future phase adds a `/design:interface` clarify task, the `commandProjectionParity` list must grow with it.
3. **`hub-router.json` is the live consumer.** The registry is the source of truth, but the router reads `hub-router.json`. The `parent-hub-vocab-sync` guard is what stops the two from diverging. Remove the guard and they can drift silently.
4. **Generated metadata regenerates downstream.** `description.json` still reads Level 1 and `graph-metadata.json` carries a stale source fingerprint. The orchestrator regenerates both, so they are not hand-written here.
5. **A pre-existing unrelated finding stays red.** The sk-code `verify_alignment_drift.py` finding on a TS module header in `design-md-generator/backend/scripts/guided-run.ts` is red at baseline too. It is not caused by this phase and is tracked separately.
<!-- /ANCHOR:limitations -->

---

<!--
CORE TEMPLATE: Post-implementation documentation, created AFTER work completes.
Write in human voice: active, direct, specific. No em dashes, no hedging, no AI filler.
HVR rules: .opencode/skills/sk-doc/references/hvr_rules.md
-->

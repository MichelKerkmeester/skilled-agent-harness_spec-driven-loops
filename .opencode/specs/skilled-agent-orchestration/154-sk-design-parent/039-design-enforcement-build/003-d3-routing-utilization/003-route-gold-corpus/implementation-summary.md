---
title: "Implementation Summary: D3-R3 Standing route-gold corpus + minimal pairs"
description: "Post-build record for the four workflow-route fields on the private gold and the 18 sk-design fixture pairs: what was built, how it was verified, the 13-route / 5-standing-gap result, and the D3-R2 coupling. Honest framing: keyword/alias routing is deterministic; hint-free phrasing falls to silent-default [], which the corpus measures and the gated hubRoute scorer will gate on."
trigger_phrases:
  - "route gold corpus implementation summary"
  - "sk-design routing fixtures build record"
  - "hubroute corpus standing gap summary"
importance_tier: "normal"
contextType: "general"
status: "complete"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-sk-design-parent/039-design-enforcement-build/003-d3-routing-utilization/003-route-gold-corpus"
    last_updated_at: "2026-06-28T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Record the route-gold corpus build and the 13-route / 5-gap result"
    next_safe_action: "Let the parent process refresh description.json and graph-metadata.json"
    blockers: []
    key_files:
      - ".opencode/skills/deep-loop-workflows/deep-improvement/references/skill_benchmark/scenario_authoring.md"
      - ".opencode/skills/deep-loop-workflows/deep-improvement/assets/skill_benchmark/fixtures/sk-design/"
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
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 003-route-gold-corpus |
| **Completed** | 2026-06-28 |
| **Level** | 2 |
| **Deliverables** | Four workflow-route fields on the private gold + 18 sk-design fixture pairs (alias / holdout / adversarial minimal pairs) |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:what-built -->
## What Was Built

The gated `hubRoute` stage now has a standing gold corpus to score against, and that corpus is honest about where routing breaks. Before this phase there was no fixed set of hint-free prompts to measure sk-design routing, so near-miss bundle errors and silent-default `[]` outcomes were invisible. This phase adds a small workflow-route vocabulary to the private gold and 18 fixture pairs that pin down exactly which prompts route deterministically and which fall through.

### Workflow-route schema extension

The private `expected` block gained four additive fields: `workflowMode` (a string for `single`/`defer`, an ordered array for `orderedBundle`), `routeOutcome` (`single` | `orderedBundle` | `defer`), `forbiddenWorkflowModes` (modes that must never appear in the selected route), and `minimalPairGroup` (a shared id across the two arms of an adversarial pair, `null` when unpaired). The shape is documented additively in the fixture-authoring contract, including the rule that for router-scoring corpora the domain router keywords are allowed because they are the behavior under test, while identity tokens (skill id, mode names, resource basenames) stay banned.

### 18 sk-design fixture pairs

A new `fixtures/sk-design/` directory holds 18 public/private pairs across three tiers. Five alias fixtures cover one keyword per mode. Five hint-free holdouts phrase a real design task in domain language with no router keyword. Eight minimal-pair arms form four adversarial groups: redesign-vs-review, ui-build-vs-critique, tokens-single-vs-bundle, and menu-animate-vs-redesign. The pairs are the sharp instrument — they hold almost everything constant and flip one word, so a scorer can tell a correct mode change from a silent collapse.

### Honest routing result: 13 route, 5 standing gaps

Replaying every fixture through `router-replay.cjs` against the projected `hub-router.json`, 13 of 18 route to their `expected.workflowMode`: every alias fixture, every must-pass minimal-pair arm (for example `ui build`→interface vs `ui critique`→audit, and `design tokens from url`→`orderedBundle` [foundations, md-generator]), and the one holdout (`fix the visual hierarchy of the dashboard`→foundations) that happens to match a keyword. The remaining 5 are **intentional standing gaps** that route `[]`: the four hint-free holdouts (motion/interface/audit/md-generator) plus `redesign the menu`. These are not failures of this phase and they are not mislabeled as passing — each carries its correct-mode gold and an observed `[]` route, so the next-phase gated scorer (D3-R2) fails against them on purpose. This phase does NOT claim full routing coverage: keyword/alias routing is deterministic, but hint-free or arbitrarily phrased prompts fall to silent-default `[]`. That residual is exactly what the corpus measures.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/deep-loop-workflows/deep-improvement/references/skill_benchmark/scenario_authoring.md` | Modified | Documented the four workflow-route fields additively in the fixture-structure section (+17 lines), including the identity-scoped lint rule |
| `.opencode/skills/deep-loop-workflows/deep-improvement/assets/skill_benchmark/fixtures/sk-design/*.json` | Created | 18 public/private fixture pairs (36 files): 5 alias, 5 holdout, 8 minimal-pair arms |

<!-- /ANCHOR:what-built -->
---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The implementer (cli-codex gpt-5.5 high fast) extended the gold schema and authored the 18 fixture pairs, then the orchestrator verified routing INDEPENDENTLY rather than trusting the claim: every public prompt was replayed through `router-replay.cjs --skill .opencode/skills/sk-design` against `hub-router.json` and the selected intents were compared to each private `expected.workflowMode` / `routeOutcome`, with `forbiddenWorkflowModes` confirmed absent. The result was 13/18 routing to their expected mode (all five aliases, all four must-pass minimal pairs including the `single`-vs-`orderedBundle` token flip, and the foundations holdout) and 5/18 routing `[]` as gold-labeled standing gaps (the four hint-free holdouts plus `redesign the menu`). Contamination was checked with the exported `lintFixture` scoped to identity vocab only and reported clean. Scope stayed limited to `scenario_authoring.md` plus the new fixtures, and an evergreen scan over both found no spec/packet/phase IDs or `specs/` paths. The corpus is the standing input the D3-R2 gated `hubRoute` scorer consumes; that scorer is NOT built here, only the coupling is recorded.

<!-- /ANCHOR:how-delivered -->
---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Scope the contamination lint to identity tokens only (skill id + 5 mode names + resource basenames) | The full keyword vocab would ban the very alias keywords the router needs, making "routes correctly AND lint clean" unsatisfiable; domain keywords are the legitimate routing surface under test |
| Gold-label the 5 silent-default cases instead of dropping or "fixing" them | A correct-mode gold with an observed `[]` route gives the D3-R2 scorer a real baseline to fail against; mislabeling them as passing would hide the routing gap the research identified |
| Store `workflowMode` as an array only for `orderedBundle` | The token-source prompt legitimately routes to two ordered modes (foundations, md-generator); a single-string field cannot capture an ordered bundle |
| Keep the route fields in `*.private.json` only | They are scorer-only gold and must never cross the dispatch boundary into the public prompt |
| Do not widen `routerSignals` in this phase | Closing the hint-free holdouts is a separate, larger change; this phase measures the gap rather than papering over it |

<!-- /ANCHOR:decisions -->
---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Four route fields present in private gold with valid enums | PASS, `workflowMode`/`routeOutcome`/`forbiddenWorkflowModes`/`minimalPairGroup` carried in `*.private.json` only |
| Schema documented additively in `scenario_authoring.md` | PASS, fixture-structure section gained the route fields (+17 lines), scorer/router behavior unchanged |
| 18 fixture pairs authored under `fixtures/sk-design/` | PASS, 36 files (5 alias + 5 holdout + 8 minimal-pair arms) |
| ACCEPTANCE: alias fixtures route to their mode | PASS, interface/foundations/motion/audit/md-generator each land on `expected.workflowMode` |
| ACCEPTANCE: must-pass minimal pairs flip correctly | PASS, `redesign the ui`→interface vs `review the ui`→audit; `ui build`→interface vs `ui critique`→audit; `design tokens`→foundations single vs `design tokens from url`→orderedBundle[foundations,md-generator] |
| ACCEPTANCE: `forbiddenWorkflowModes` never selected | PASS, replay shows zero forbidden-mode intents across the corpus |
| STANDING GAP (recorded, not gated): 5 silent-defaults | PASS as gold, `redesign the menu` + 4 hint-free holdouts route `[]`; correct-mode gold retained, observed `[]` route recorded |
| Contamination lint (identity-scoped) | PASS, `lintFixture` returns `passed: true` for every public prompt |
| Scope clean | PASS, change set is `scenario_authoring.md` + the new `sk-design/` fixtures only; no scorer/router/live sk-design skill file touched |
| Evergreen scan (no spec/packet/phase IDs) | PASS, no identifiers or `specs/` paths in the fixtures or schema-doc edit |

<!-- /ANCHOR:verification -->
---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Hint-free phrasing is not routed.** Keyword/alias routing is deterministic, but the four hint-free holdouts and `redesign the menu` fall to silent-default `[]`. This is the advisory residual the research identified; the corpus measures it and the D3-R2 gated `hubRoute` scorer will gate on it. Do not read this phase as full routing coverage.
2. **Closing the holdouts is deferred.** A later phase widening `routerSignals` could route some of the hint-free holdouts; that change is out of scope here.
3. **The scorer is not built here.** This phase only stands up and gold-labels the corpus. The gated `hubRoute` stage that consumes it is the next phase (D3-R2); the coupling is recorded, not implemented.

<!-- /ANCHOR:limitations -->

---

<!--
LEVEL 2 IMPLEMENTATION SUMMARY
- Core + Level 2 verification focus
- Build record for the workflow-route schema extension and the 18 sk-design fixture pairs; 13 route to expected.workflowMode, 5 are gold-labeled standing gaps routing [] (four hint-free holdouts + "redesign the menu"); corpus consumed by the D3-R2 gated hubRoute scorer (not built here)
-->

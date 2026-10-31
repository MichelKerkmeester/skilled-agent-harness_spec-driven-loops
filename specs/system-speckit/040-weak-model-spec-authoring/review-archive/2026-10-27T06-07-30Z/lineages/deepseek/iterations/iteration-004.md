# Iteration 4: Maintainability - fill guidance, the card, and the guards that hold them

## Dimension

Maintainability. The per-section `<!-- FILL: ... -->` guidance added by phase 004, the authoring card added by phase 005, and the two guards that are supposed to stop either from drifting.

## Files Reviewed

- `.skilled/skills/system-spec-kit/templates/core/{spec,plan,tasks,implementation-summary}.md.tmpl`
- `.skilled/skills/system-spec-kit/templates/addons/*.tmpl` (fill-line counts)
- `.skilled/skills/system-spec-kit/references/workflows/spec-authoring-card.md:1-172`
- `.skilled/skills/system-spec-kit/references/workflows/spec-folder-authoring-checklist.md:1-74`
- `.skilled/skills/system-spec-kit/runtime/cli/tests/template-fill-guidance.vitest.ts:1-110`
- `.skilled/skills/system-spec-kit/runtime/cli/spec/check-example-drift.sh:1-44`
- `.skilled/skills/system-spec-kit/runtime/cli/spec/check-card-sync.sh:1-120`
- `specs/system-speckit/054-weak-model-spec-authoring/004-template-section-fill-guidance/{spec.md,acceptance-criteria.md,plan.md}`
- `specs/system-speckit/054-weak-model-spec-authoring/005-weak-model-authoring-card/{spec.md,acceptance-criteria.md}`

## Findings by Severity

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **The 61 addon fill lines have no regression guard** -- `.skilled/skills/system-spec-kit/runtime/cli/tests/template-fill-guidance.vitest.ts:49` -- The test loops the four core documents across four levels (16 renders) and asserts one FILL line per rendered section. The ten addon templates, which hold 61 of the 131 fill lines, are never rendered by the test, and `check-example-drift.sh` compares anchors and descriptions only (`check-example-drift.sh:29`). Phase 004's AC-002 proved the addon counts with a one-time `rg -c` row, so a later edit can remove or duplicate an addon fill line with the suite still green. The phase description's claim that "a golden render test plus a drift guard hold the result" covers the core only.
   Finding class: test-coverage-gap
   Scope proof: the test's `DOCS` loop and the drift guard's compare call were read directly; `rg -c '<!-- FILL: '` over the addon templates returns 3, 5, 5, 1, 4, 5, 20, 11, 4, 3, matching AC-002.
   Affected surface hints: fill-guidance test, example drift guard, ten addon templates
   Case: a later edit drops the fill line from `addons/research.md.tmpl`'s Method section; `Tests 16 passed (16)` and `EXAMPLE_DRIFT_OK` both still print.

2. **The card points at a long guide it never sends the reader to** -- `.skilled/skills/system-spec-kit/references/workflows/spec-authoring-card.md:18` -- The card says `references/templates/template-guide.md` is the long guide and to "Read it only when this card sends you there", but no later step names the guide or a condition that routes to it. The guide is 1,200 lines and remains in the router's `ON_DEMAND` list, so it is reachable by explicit request, but the card's sentence describes a route that does not exist and gives a weak model no rule for when the card is insufficient.
   Finding class: followability-gap
   Scope proof: the whole card was read; `rg -n 'template-guide'` returns only line 18. The router's `ON_DEMAND` entry was read in `SKILL.md`.
   Affected surface hints: authoring card, template guide, skill router ON_DEMAND tier
   Case: a model hits a section the card does not explain, looks for the promised pointer, finds none, and either stops or improvises instead of opening the guide.

## Traceability Checks

| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| `spec_code` | partial | hard | `004.../spec.md:91,145`; `template-fill-guidance.vitest.ts:49-53` | The addon requirement is implemented and counted once, but not held by a test. |
| `checklist_evidence` | pending | hard | - | Deferred to the checklist pass. |
| `skill_agent` | partial | advisory | `SKILL.md:173-290`; `spec-authoring-card.md:18` | The card is routed for four intents; the guide pointer is dangling. |
| `agent_cross_runtime` | pending | advisory | - | Audited later. |
| `feature_catalog_code` | partial | advisory | `versioned-placeholder-gate.md:36` | Same leaf as iteration 1. |
| `playbook_capability` | pending | advisory | - | Audited later. |

## Edge Cases

- The two core FILL lines without a good and weak example (`spec.md.tmpl:444`, `tasks.md.tmpl:115`) are planned exceptions: phase 004's applicability table marks B17 and B29 with `-` in both example columns, so they are not defects.
- The card is 172 lines against the 260-line guard, so the length bound holds.
- The checklist's single new line satisfies phase 005's REQ-004; it is not required to name the card, so its silence is not reported.
- The router's COMPLETE intent loads the checklist but not the card; phase 005 scoped the card to the four authoring intents, so this is by design rather than a gap.

## Confirmed-Clean Surfaces

- All 131 FILL lines end with a period, contain no value token, no `[NEEDS` marker and no `-->` sequence, matching the test's inner-text assertions.
- Every core `## ` section renders exactly one FILL line at every level the test covers, and the anchor counts match the pinned map.
- The card's commands exist and accept the flags it names: `recommend-level.sh --loc/--files`, `create.sh --skip-branch --with-goal --level --track --short-name`, and `validate.sh --strict`.
- `check-card-sync.sh` checks the card length, the four intents, the guide's on-demand-only placement, both inventory files and the checklist line; its claims match the code except for the "fails on the first disagreement" wording reported in the docs pass.

## Ruled Out

- A missing good/weak pair as a general defect: ruled out by phase 004's applicability table, which scopes the pair to sections where a contrast is meaningful.
- The card being too long: ruled out; 172 lines is under the 260-line guard.
- The checklist contradicting the card: ruled out; it sends readers to a rendered example or scaffold, matching the card's step 4.

## Next Focus

Iteration 5 - correctness - the fill-guidance and card content checked against the commands they name and the validator they promise: the scaffold's rendered section set per level, the `Verify:` task-line contract, and whether the card's acceptance commands actually prove what they claim.

Review verdict: PASS

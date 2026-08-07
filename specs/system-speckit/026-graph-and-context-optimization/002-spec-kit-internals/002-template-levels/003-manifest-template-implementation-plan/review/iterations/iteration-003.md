# Deep Review Iteration 003

## Dimension

template-rendering-correctness

## Files Reviewed

- `.opencode/skills/sk-code-review/references/review_core.md:23` — P1 severity baseline for correctness/spec-mismatch gate issues.
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/003-manifest-template-implementation-plan/tasks.md:77` — T-122 requires replacing `[capability]` with `[needed behavior]` in new manifest templates.
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/003-manifest-template-implementation-plan/tasks.md:78` — T-123 requires replacing phase-parent manifest wording with `Sub-phase list`.
- `.opencode/skills/system-spec-kit/templates/manifest/phase-parent.spec.md.tmpl:102` — the raw template exposes the `[YOUR_VALUE_HERE: PHASE_ROW]` placeholder consumed after rendering.
- `.opencode/skills/system-spec-kit/scripts/spec/create.sh:1117` — phase-parent template is rendered before create-time substitutions.
- `.opencode/skills/system-spec-kit/scripts/spec/create.sh:1123` — create-time scope rows still contain `child phase manifest`.
- `.opencode/skills/system-spec-kit/scripts/spec/create.sh:1149-1150` — create-time `_scope_rows` replace the rendered template placeholder.
- `.opencode/skills/system-spec-kit/scripts/tests/scaffold-golden-snapshots.vitest.ts:14-24` — snapshot normalization rewrites legacy leak strings before comparison.
- `.opencode/skills/system-spec-kit/scripts/tests/scaffold-golden-snapshots.vitest.ts:49-57` — phase-parent golden test renders the raw template directly and never executes create.sh substitutions.
- `.opencode/skills/system-spec-kit/scripts/tests/workflow-invariance.vitest.ts:45-60,93` — default scan roots exist, but prior iteration established broad public-root allowlisting; this pass used it as counterevidence context only.

## Findings by Severity (P0/P1/P2)

### P0

None.

### P1

#### DR-003-P1-001 — Golden scaffold snapshots miss create-time phase-parent rendering regressions

- **Claim:** Template-rendering golden coverage can pass while phase-parent scaffold output still contains the create-time private-vocabulary leak it is supposed to guard.
- **Evidence:** `scaffold-golden-snapshots.vitest.ts` renders `phase-parent.spec.md.tmpl` directly (`:49-57`) and normalizes legacy leak strings (`:14-24`). The real scaffold path renders the template first (`create.sh:1117`) and then injects `_scope_rows` containing `child phase manifest` (`create.sh:1123`) when replacing the placeholder (`create.sh:1149-1150`). T-122/T-123 require these leak classes to be removed from new manifest output (`tasks.md:77-78`).
- **Counterevidence sought:** Checked the phase-parent manifest template, create.sh create-time substitutions, scaffold golden test, and workflow-invariance scan roots. The template source now uses neutral wording, but create.sh reintroduces the banned wording after rendering and the golden test never exercises that generated output path.
- **Alternative explanation:** The normalization may have been a temporary migration bridge, but after the manifest templates became source of truth it masks the exact cleanup class T-122/T-123 require.
- **Final severity:** P1, because review_core classifies correctness/spec-mismatch gate issues as required fixes and this is a release-gating test false negative.
- **Confidence:** 0.90.
- **Downgrade trigger:** Downgrade only if another mandatory generated-scaffold snapshot runs create.sh for phase parents and fails on the create-time private-vocabulary leak before release.
- **Recommendation:** Add a golden/sentinel test that executes create.sh phase-parent scaffolding, or extracts and tests the post-render substitution function, then asserts the generated `spec.md` contains no private vocabulary. Remove the T-122/T-123 migration normalizations from the golden path once manifest templates are the source of truth.

### P2

None.

## Traceability Checks

| Protocol | Status | Notes |
|---|---|---|
| `template_rendering` | gap | Raw manifest rendering is covered, but create-time phase-parent substitutions are not covered by golden snapshots. |
| `spec_code` | gap | T-122/T-123 require new manifest outputs to remove legacy private vocabulary, while create.sh can reintroduce it after template rendering. |
| `checklist_evidence` | sampled | No applied/T-*.md files were present; sampled task requirements, template source, create.sh, golden tests, and workflow-invariance context. |
| `resource_map_coverage` | sampled | Covered manifest phase-parent template, resolver-consumed template path, create.sh generated scaffold path, and stale rendered-output coverage. |

## Verdict

CONDITIONAL. One new P1 test-coverage false negative remains in the template-rendering path. Combined with prior active P1s, PASS is not supportable for this dimension.

## Next Dimension

validator-coverage

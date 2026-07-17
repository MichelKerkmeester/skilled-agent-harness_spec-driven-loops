# Deep Review Iteration 001

## Dispatcher
- Mode: review
- Target agent: deep-review
- Session: `fanout-sol-1784207165086-152crx`
- Focus: correctness — renderer behavior, fluid CSS assumptions, fallback behavior, and regression proof
- Budget profile: `scan`

## Files Reviewed
- `.opencode/specs/sk-doc/016-create-diff-mode/010-fluid-responsive-report/spec.md`
- `.opencode/specs/sk-doc/016-create-diff-mode/010-fluid-responsive-report/plan.md`
- `.opencode/specs/sk-doc/016-create-diff-mode/010-fluid-responsive-report/tasks.md`
- `.opencode/skills/sk-doc/create-diff/scripts/create_diff.py`
- `.opencode/skills/sk-doc/create-diff/scripts/test_create_diff.py`
- `.opencode/skills/sk-code/code-review/references/review_core.md` (severity doctrine)

## Findings - New

### P0 Findings
None.

### P1 Findings
1. **The declared no-container-query fallback does not preserve the shipped fixed type sizes** -- `.opencode/skills/sk-doc/create-diff/scripts/create_diff.py:720` -- The fluid custom properties place `cqi` inside each `clamp()` preferred value (`--fs-0`, `--fs-code`, `--rhythm`, and `--text-caption`) and those variables feed inherited `font-size` declarations at lines 734, 737-738, 744, 750, 756, 762, 764, 771, 776, and 804. In an engine that does not understand `cqi`, custom properties retain the token stream, but each consuming declaration becomes invalid at computed-value time; the browser does not select a clamp bound. That contradicts the explicit fallback promise that unsupported container queries degrade to the previously shipped fixed sizes [SOURCE: `.opencode/specs/sk-doc/016-create-diff-mode/010-fluid-responsive-report/spec.md:137`] and NFR-R02 [SOURCE: `.opencode/specs/sk-doc/016-create-diff-mode/010-fluid-responsive-report/spec.md:153`]. The fixed `body` font at line 731 limits catastrophic breakage, but inherited 1rem and unset shorthand values are not the promised prior heading, caption, code, and rhythm sizes.
   - Finding class: algorithmic
   - Scope proof: Focused search found all four `cqi`-bearing declarations in `create_diff.py:720,724-725,727`; direct review found every fluid consumer in the same `_CSS` block and no `@supports` or fixed declaration preceding the variable-backed values.
   - Affected surface hints: `["no-container-query webviews", "headings and captions", "diff table type", "section rhythm"]`
   - content_hash: `94ef07822c8698c839181090e2818bd8e86fbadd0cff7e01a55f3e36a7bfb097`

```json
{"type":"claim-adjudication","claim":"Unsupported cqi makes the variable-backed consuming declarations invalid instead of selecting the clamp bounds, violating the specified fixed-size fallback.","evidenceRefs":[".opencode/skills/sk-doc/create-diff/scripts/create_diff.py:720-727",".opencode/skills/sk-doc/create-diff/scripts/create_diff.py:731-738",".opencode/specs/sk-doc/016-create-diff-mode/010-fluid-responsive-report/spec.md:137",".opencode/specs/sk-doc/016-create-diff-mode/010-fluid-responsive-report/spec.md:153"],"counterevidenceSought":"Checked for fixed fallback declarations, @supports guards, and containment by the fixed body font. The body rule prevents total loss of readable text, but it does not preserve the prior per-surface sizes or the font shorthand properties.","alternativeExplanation":"Modern Chromium IDE webviews support container query units, so the defect is confined to the explicitly promised unsupported-engine path.","finalSeverity":"P1","confidence":0.95,"downgradeTrigger":"Downgrade only if the fallback requirement is removed or engine-level evidence proves unsupported cqi inside these var()-substituted clamp() values resolves to the declared bounds."}
```

### P2 Findings
1. **The regression test can pass while the named container or one refinement is broken** -- `.opencode/skills/sk-doc/create-diff/scripts/test_create_diff.py:325` -- The test checks only three independent substrings: `container-type:inline-size`, any `@container report`, and `cqi` anywhere (lines 330-332). It would remain green if `container-name:report` were removed, leaving both named rules disconnected, or if either the narrow or wide refinement were deleted. The implementation currently contains the name and both blocks [SOURCE: `.opencode/skills/sk-doc/create-diff/scripts/create_diff.py:732`; `.opencode/skills/sk-doc/create-diff/scripts/create_diff.py:807-811`], so this is a regression-lock gap rather than an active renderer failure.
   - Finding class: matrix/evidence
   - Scope proof: Focused search found only `ReportInvariants::test_fluid_type_layer_is_container_keyed` asserting the fluid layer; running that test passes, and its three assertions do not cover `container-name:report` or both breakpoint signatures.
   - Affected surface hints: `["renderer regression suite", "named container wiring", "narrow and wide refinements"]`
   - content_hash: `14930c0a0f9f8d0515e40d023d7eaf2df6619f4a7d4175eb21720a25445facc0`

## Traceability Checks
- `spec_code`: partial/productive. REQ-001/REQ-004/NFR-R02 behavior was compared directly with `_CSS`; the unsupported-engine fallback contradicts the implementation mechanics.
- `checklist_evidence`: pending; not expanded during this correctness-only iteration.
- Regression execution: `python3 -m unittest test_create_diff.ReportInvariants.test_fluid_type_layer_is_container_keyed` ran 1 test and passed.

## Integration Evidence
- Producer reviewed: `.opencode/skills/sk-doc/create-diff/scripts/create_diff.py` embedded renderer CSS.
- Verification consumer reviewed: `.opencode/skills/sk-doc/create-diff/scripts/test_create_diff.py` `ReportInvariants` suite.
- Governing packet surface reviewed: `.opencode/specs/sk-doc/016-create-diff-mode/010-fluid-responsive-report/spec.md` fallback and regression requirements.

## Edge Cases
- Modern Chromium-based IDE webviews likely take the supported path; the P1 is specifically the packet's explicit unsupported-container-query fallback contract.
- Browser execution against a legacy engine was not available. The finding rests on CSS invalid-at-computed-value semantics plus direct declarations; severity can be downgraded under the stated trigger.
- Structural-impact analysis was not needed because the rendered prompt named the exact producer and test symbols; no code-graph claim is made.

## Confirmed-Clean Surfaces
- The active renderer establishes both `container-type:inline-size` and `container-name:report` and contains both declared narrow/wide `@container report` blocks.
- The side-by-side `min-width:60rem` scroll floor remains present at `create_diff.py:788`.
- The focused fluid-layer regression test passes in the current tree.

## Ruled Out
- No active failure was found in the supported container-query path from the inspected declarations.
- No P0 candidate was supported: the fallback defect is presentation-contract loss in an explicitly secondary compatibility path, not destructive or security-critical behavior.
- The test gap was not promoted to P1 because the current renderer wiring is correct and the implementation requirement deliberately asked for a small invariant test.

## Next Focus
- Dimension: security
- Focus area: renderer escaping, CSP preservation, hostile-content handling, and validator boundaries
- Reason: correctness is complete with one required fallback fix and one advisory test-lock improvement
- Rotation status: rotate to the first unchecked dimension
- Blocked/productive carry-forward: carry the productive direct producer/test/spec comparison; no blocked approach
- Required evidence: direct source and hostile-content-test citations, with counterevidence for any P0/P1

Review verdict: CONDITIONAL

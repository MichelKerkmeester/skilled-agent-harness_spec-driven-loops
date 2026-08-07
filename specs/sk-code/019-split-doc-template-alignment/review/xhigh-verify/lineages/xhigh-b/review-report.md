---
verdict: FAIL
hasAdvisories: false
activeP0: 0
activeP1: 4
activeP2: 1
stopReason: maxIterationsReached
releaseReadinessState: in-progress
sessionId: fanout-xhigh-b-1783915428096-y929h9
---

# Deep Review Report: sk-code Split-Doc Template Alignment xhigh-b

## Executive Summary

The detached four-iteration verification lineage reached the operator-mandated ceiling with all four dimensions covered. The main mechanical result remains strong: all 163 target files pass `validate_document.py`, use non-hyphenated basenames, carry the required metadata fields and four-part versions, and satisfy the mode-section, numbering, and terminal RELATED RESOURCES checks. Release readiness is nevertheless **FAIL** because four active P1 findings leave both hard traceability protocols failed. One P2 routing-metadata advisory is also active.

## Planning Trigger

Route to `/speckit:plan` for a bounded remediation. Two target documents violate the governing template contract, and two packet-level evidence defects prevent a strict complete-state claim. The P2 trigger-phrase issue can be fixed in the same small documentation pass but does not independently block release.

## Active Finding Registry

### F001 [P1] Rust interop reference places OVERVIEW after substantive content

- Dimension: correctness
- Evidence: `.opencode/skills/sk-code/code-opencode/references/rust/style_guide/interop_errors_and_parity.md:13-19`, `.opencode/skills/sk-code/code-opencode/references/rust/style_guide/interop_errors_and_parity.md:304-318`
- Authority: `.opencode/specs/sk-code/019-split-doc-template-alignment/spec.md:65-72`
- Impact: the numbered OVERVIEW exists but appears after the inherited guidance, directly violating R3's body-order contract.
- Finding class: instance-only
- Recommendation: move the OVERVIEW block directly after the H1 intro, then renumber/recheck without changing substantive guidance.

### F002 [P1] Third-party integration Purpose still duplicates its intro

- Dimension: correctness
- Evidence: `.opencode/skills/sk-code/code-webflow/references/implementation/third_party_integrations/overview_hls_and_lenis.md:14-23`
- Authority: `.opencode/skills/sk-doc/create-skill/assets/skill/skill_reference_template.md:58-87`
- Impact: the prior 21-file remediation missed one containment-level duplicate, so the packet's zero-duplicate claim remains false.
- Finding class: class-of-bug
- Recommendation: rewrite this Purpose as distinct detailed intent, then rerun normalized equality and containment checks across all 163 files.

### F003 [P1] Implementation summary still claims zero broken links for the whole hub

- Dimension: traceability
- Evidence: `.opencode/specs/sk-code/019-split-doc-template-alignment/implementation-summary.md:65-76`
- Counterevidence: `.opencode/specs/sk-code/019-split-doc-template-alignment/checklist.md:47-52`
- Impact: the summary acknowledges two unresolved hub-wide artifacts and then reports `whole hub | 0` in its verification table.
- Finding class: matrix/evidence
- Recommendation: scope the table row to links to/among renamed files, matching the checklist, or repair both hub-wide artifacts.

### F004 [P1] Complete packet fails strict validation

- Dimension: traceability
- Evidence: `.opencode/specs/sk-code/019-split-doc-template-alignment/checklist.md:23-25`, `.opencode/specs/sk-code/019-split-doc-template-alignment/checklist.md:31-82`
- Impact: live strict validation returns `RESULT: FAILED` with five warning classes, including 25 completed items without evidence, while the packet remains marked Complete.
- Finding class: matrix/evidence
- Recommendation: add command/result evidence and required priority/structure metadata, clear every strict warning, then reconcile complete-state metadata.

### F005 [P2] Asset README trigger phrase is not lowercase

- Dimension: maintainability
- Evidence: `.opencode/skills/sk-code/code-opencode/assets/scripts/README.md:1-10`
- Authority: `.opencode/skills/sk-doc/create-skill/assets/skill/skill_asset_template.md:125-175`
- Impact: one trigger phrase uses uppercase `README`; all trigger counts and metadata enums otherwise pass.
- Finding class: instance-only
- Recommendation: normalize the phrase to lowercase and rerun the 163-file metadata audit.

## Remediation Workstreams

1. Target-document conformance: repair F001 and F002, then rerun the corpus audit and all 163 validator invocations.
2. Packet evidence reconciliation: repair F003 and F004, rerun the 328-file link audit and strict packet validator, and update completion status only from fresh outputs.
3. Routing metadata polish: normalize F005 in the same documentation batch and rerun trigger count/shape validation.

## Spec Seed

- Keep R1-R5 unchanged; the findings are implementation/evidence defects, not reasons to weaken the approved contract.
- Clarify the completion evidence row as `links to/among renamed files` if the two explicitly excluded hub-wide artifacts remain out of scope.
- Add strict-validation evidence requirements for every completed checklist row before the packet can return to Complete.

## Plan Seed

1. Move the Rust OVERVIEW block ahead of substantive content and verify heading order.
2. Rewrite the remaining duplicate Purpose and rerun exact plus containment semantic checks.
3. Correct the implementation-summary link row to the approved narrowed scope.
4. Add checklist evidence and clear all five strict warning classes until `validate.sh --strict` exits zero.
5. Lowercase the single trigger phrase, rerun corpus/link/package/strict gates, and reconcile packet metadata.

## Traceability Status

| Protocol | Status | Result |
|---|---|---|
| `spec_code` | fail | R1/R2 and validator-facing mechanics pass; R3 is contradicted by F001/F002. |
| `checklist_evidence` | fail | The narrowed renamed-link result replays, but F003 and F004 invalidate complete-state evidence. |
| `feature_catalog_code` | not applicable | No feature-catalog capability claim exists in this documentation-only packet. |
| `playbook_capability` | not applicable | No executable playbook capability was introduced. |

Acceptance coverage remained advisory and disabled in the strict validator run. No source `resource-map.md` existed at initialization, so the conditional Resource Map Coverage Gate section is omitted.

## Deferred Items

- F005 is advisory and may be included in the bounded remediation batch.
- The known code-opencode/code-webflow `package_skill.py --check` surface-header failures reproduce without resource-document warnings and remain the packet's documented out-of-scope limitation.
- Spec Memory retrieval timed out twice. Packet docs and direct file evidence were used instead.
- Coverage-graph writes were skipped because the detached lineage was explicitly forbidden from touching paths outside its artifact root; v2 graphless fallback ledgers cover every required bug class.

## Audit Appendix

### Iteration Coverage

| Iteration | Dimension | New findings | Ratio | Iteration verdict |
|---:|---|---:|---:|---|
| 1 | correctness | 2 P1 | 1.0000 | CONDITIONAL |
| 2 | security | none | 0.0000 | PASS |
| 3 | traceability | 2 P1 | 0.5000 | CONDITIONAL |
| 4 | maintainability | 1 P2 | 0.0476 | PASS |

### Deterministic Evidence

- Corpus audit: 163 files total, code-opencode 65, code-webflow 95, code-quality 3.
- Structural matrix: zero hyphenated basenames, missing frontmatter fields, bad version shapes, missing H1/OVERVIEW/mode sections, content-numbering defects, misplaced RELATED RESOURCES sections, or validator failures.
- Semantic/ordering matrix: F001 and F002.
- Metadata matrix: F005 only; all trigger counts and metadata enums pass.
- Link audit: 328 tracked sk-code Markdown files, 583 relative Markdown links checked, two unresolved artifacts exactly matching the checklist's explicit exclusions.
- Package checks: code-quality PASS with two skill-level warnings; code-opencode and code-webflow fail only documented required-section surface-header checks.
- Strict packet validation: 0 errors, 5 warning classes, `RESULT: FAILED`.
- Scoped Git status: no target-surface or canonical-packet path changes from this detached review.

### Convergence Replay

Four canonical iteration records exist with ratios `1.0000, 0.0000, 0.5000, 0.0476`. The final two-run rolling average is `0.2738`, above the `0.08` stop threshold. The MAD noise floor is approximately `0.3707`, so the latest ratio votes STOP; dimension coverage reaches 100% on iteration 4 but has no additional stabilization-age pass. The composite telemetry score is therefore `0.25`, not a legal convergence stop. Synthesis proceeds only because `stopPolicy=max-iterations` makes iteration 4 an unconditional terminal ceiling. Failed quality gates and hard traceability protocols are preserved in the FAIL verdict.

### Replay Verdict

- JSONL parses cleanly and has one canonical iteration plus one claim-adjudication event per run.
- Every iteration has a non-empty narrative ending in exactly one canonical verdict line and a matching delta file.
- All four P1 findings have typed adjudication packets and direct file:line evidence.
- Candidate coverage and graphless fallback ledgers are complete with no search debt.

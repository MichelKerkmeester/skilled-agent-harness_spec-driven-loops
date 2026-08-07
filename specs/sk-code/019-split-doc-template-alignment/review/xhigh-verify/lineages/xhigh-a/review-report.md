# Deep Review Report: sk-code/019 Split-Doc Template Alignment

## Executive Summary

- **Verdict:** CONDITIONAL
- **Release-readiness state:** converged
- **Stop reason:** `maxIterationsReached`
- **Iterations:** 4/4
- **Dimension coverage:** 4/4
- **Active findings:** P0=0, P1=3, P2=1
- **hasAdvisories:** false

The 163-file corpus is broadly healthy: every file passes the generic document validator, every target carries the required frontmatter/version fields, no target filename remains hyphenated, and the delivery stayed documentation-only. Release remains conditional because two current files still violate R3's canonical reference structure/semantic contract and the completed Level 2 packet does not carry the evidence required for strict completion validation.

## Planning Trigger

`/speckit:plan` is required for F001-F003. F004 is advisory and should be reconciled in the same documentation pass.

Planning Packet:

```json
{
  "triggered": true,
  "verdict": "CONDITIONAL",
  "hasAdvisories": false,
  "activeFindings": [
    {
      "findingId": "F001",
      "severity": "P1",
      "title": "Rust reference never enters the required numbered OVERVIEW",
      "evidenceRefs": [
        ".opencode/skills/sk-code/code-opencode/references/rust/style_guide/interop_errors_and_parity.md:13-21",
        ".opencode/skills/sk-doc/create-skill/assets/skill/skill_reference_template.md:54-87"
      ]
    },
    {
      "findingId": "F002",
      "severity": "P1",
      "title": "Post-review Purpose de-duplication left one containment duplicate",
      "evidenceRefs": [
        ".opencode/skills/sk-code/code-webflow/references/implementation/third_party_integrations/overview_hls_and_lenis.md:14-25",
        ".opencode/specs/sk-code/019-split-doc-template-alignment/implementation-summary.md:65"
      ]
    },
    {
      "findingId": "F003",
      "severity": "P1",
      "title": "Completed rows do not carry the evidence their own protocol requires",
      "evidenceRefs": [
        ".opencode/specs/sk-code/019-split-doc-template-alignment/checklist.md:23-60",
        ".opencode/specs/sk-code/019-split-doc-template-alignment/tasks.md:23-54"
      ]
    },
    {
      "findingId": "F004",
      "severity": "P2",
      "title": "Implementation summary retains the withdrawn whole-hub zero-link claim",
      "evidenceRefs": [
        ".opencode/specs/sk-code/019-split-doc-template-alignment/implementation-summary.md:65-76",
        ".opencode/specs/sk-code/019-split-doc-template-alignment/checklist.md:47-52"
      ]
    }
  ],
  "remediationWorkstreams": [
    "Complete the two remaining R3 template-semantic repairs",
    "Attach reproducible evidence to completed Level 2 rows and restore strict validation",
    "Reconcile the implementation-summary link-scope label"
  ],
  "specSeed": [
    "Require semantic intro/Purpose distinction in addition to generic validator exit 0",
    "Require strict spec validation exit 0 before Complete"
  ],
  "planSeed": [
    "Repair F001 and F002, then rerun the 163-file semantic matrix",
    "Add command/artifact evidence for F003 and rerun strict validation",
    "Update the F004 verification-table label to renamed-file scope"
  ],
  "findingClasses": {
    "F001": "instance-only",
    "F002": "instance-only",
    "F003": "matrix/evidence",
    "F004": "matrix/evidence"
  },
  "affectedSurfacesSeed": [
    "code-opencode Rust references",
    "code-webflow third-party references",
    "spec completion evidence",
    "implementation-summary verification table"
  ],
  "fixCompletenessRequired": true
}
```

## Active Finding Registry

### F001 [P1] Rust reference never enters the required numbered OVERVIEW

- **Dimension:** correctness
- **File:** `.opencode/skills/sk-code/code-opencode/references/rust/style_guide/interop_errors_and_parity.md:13-21`
- **Evidence:** the file moves from H1/intro directly to `### Error Style`; the required `## 1. OVERVIEW`, Purpose, and When to Use are absent. R3 requires that structure [SOURCE: `.opencode/specs/sk-code/019-split-doc-template-alignment/spec.md:67-71`], and the canonical template defines it [SOURCE: `.opencode/skills/sk-doc/create-skill/assets/skill/skill_reference_template.md:54-87`].
- **Impact:** one of the declared 163 conformed files remains structurally non-conformant, while the generic validator provides a false clean signal.
- **Recommendation:** add the missing wrapper and renumber inherited content without changing substantive guidance.
- **Disposition:** active
- **Finding class:** instance-only
- **Scope proof:** one missing wrapper in the complete 163-file matrix.
- **Affected surface hints:** code-opencode Rust references, create-skill reference contract, document validator.

### F002 [P1] Post-review Purpose de-duplication left one containment duplicate

- **Dimension:** traceability
- **File:** `.opencode/skills/sk-code/code-webflow/references/implementation/third_party_integrations/overview_hls_and_lenis.md:14-25`
- **Evidence:** Purpose repeats the intro's core statement as a strict semantic subset, despite the template's explicit non-duplication rule [SOURCE: `.opencode/skills/sk-doc/create-skill/assets/skill/skill_reference_template.md:84-87`] and the zero-duplicate remediation claim [SOURCE: `.opencode/specs/sk-code/019-split-doc-template-alignment/implementation-summary.md:65`].
- **Impact:** the prior P1 remediation is incomplete and the current completion claim is false.
- **Recommendation:** give Purpose a topic-specific operational statement, then rerun normalized equality/containment across all 163 files.
- **Disposition:** active
- **Finding class:** instance-only
- **Scope proof:** exactly one remaining containment duplicate in the complete matrix.
- **Affected surface hints:** code-webflow third-party references, post-review remediation, semantic conformance checker.

### F003 [P1] Completed rows do not carry the evidence their own protocol requires

- **Dimension:** traceability
- **File:** `.opencode/specs/sk-code/019-split-doc-template-alignment/checklist.md:23-60`
- **Evidence:** the checklist says every item carries a command and result, but checked rows are bare assertions. `validate.sh --strict --verbose` enumerates 14 checklist and 11 task rows with `UNSPECIFIED` evidence and reports a missing concrete verification command/artifact in the implementation summary.
- **Impact:** the completed packet fails its mandatory strict completion gate, so its checked evidence cannot be audited from the packet.
- **Recommendation:** add concise command/artifact citations to every completed P0/P1 row and require strict exit 0 before Complete.
- **Disposition:** active
- **Finding class:** matrix/evidence
- **Scope proof:** the validator enumerated the full 25-row gap matrix [SOURCE: `.opencode/specs/sk-code/019-split-doc-template-alignment/tasks.md:23-54`].
- **Affected surface hints:** completion verification, checklist evidence, strict packet validation.

### F004 [P2] Implementation summary retains the withdrawn whole-hub zero-link claim

- **Dimension:** traceability
- **File:** `.opencode/specs/sk-code/019-split-doc-template-alignment/implementation-summary.md:65-76`
- **Evidence:** the decision narrative says the claim was narrowed, but the table still says `Broken relative .md links (whole hub) | 0`. The checklist correctly records two pre-existing/out-of-scope link-shaped artifacts [SOURCE: `.opencode/specs/sk-code/019-split-doc-template-alignment/checklist.md:47-52`].
- **Impact:** completion surfaces disagree, but the governing spec/checklist scope is already correct.
- **Recommendation:** use the checklist's renamed-file scope in the table.
- **Disposition:** active advisory
- **Finding class:** matrix/evidence
- **Scope proof:** fenced-code-aware scan of all 326 tracked `sk-code` Markdown files reproduced exactly the two exclusions.
- **Affected surface hints:** implementation summary, verification table, link-scope claim.

## Remediation Workstreams

1. **R3 closure:** repair F001 and F002, then rerun the full structural and semantic matrix over all 163 targets.
2. **Completion evidence:** attach reproducible evidence to the 25 checked rows, add a concrete verification artifact to the implementation summary, and rerun strict packet validation to exit 0.
3. **Summary consistency:** change F004's table label/result to renamed-file scope while preserving the two documented exclusions.

## Spec Seed

- Extend R5 to require semantic intro/Purpose distinction rather than relying exclusively on `validate_document.py`.
- Make strict Level 2 packet validation exit 0 an explicit completion criterion.
- Define checked-row evidence as command/artifact references adjacent to each completed task/checklist item.

## Plan Seed

1. Add a canonical OVERVIEW wrapper to the Rust interop reference and renumber the inherited sections.
2. Rewrite the one remaining duplicated Purpose paragraph without changing substantive content.
3. Run the 163-file generic validator, filename/frontmatter matrix, and normalized intro/Purpose matrix.
4. Add evidence citations to the 25 strict-validator rows and a concrete summary verification artifact.
5. Reconcile F004, rerun `validate.sh --strict --verbose`, and preserve exit-0 output as packet evidence.

## Traceability Status

| Protocol | Class | Status | Evidence |
|---|---|---|---|
| spec_code | hard | fail | F001/F002 contradict R3 |
| checklist_evidence | hard | fail | F003; F004 is a bounded stale summary claim |
| feature_catalog_code | advisory | N/A | No feature catalog is in target scope |
| playbook_capability | advisory | N/A | No playbook capability is claimed by the packet |

`AC_COVERAGE` is disabled by runtime policy; its advisory status does not change the verdict.

## Deferred Items

- F004 is advisory and should be corrected with the required documentation pass.
- The generic validator's all-H3 false-negative behavior may merit a separate validator hardening packet; this review only requires repairing the target file.
- The two pre-existing link-shaped artifacts are correctly excluded from this packet's renamed-file requirement.

## Dimension Expansion Map

- Saturated directions: frontmatter/version, snake_case filename, documentation-only security boundary, structure/semantic matrix, checklist-evidence matrix.
- Completed pivots: none.
- Failed pivots: none.
- Audited overrides: none.
- Council artifacts: none.
- Selected review directions: correctness, security, traceability, maintainability/stabilization.
- Remaining frontier: remediation verification only.

## Search Ledger

- **Search coverage:** 10 required bug classes; 5 produced findings and 5 were ruled out with cited fallback evidence.
- **Candidate coverage:** complete.
- **Search debt:** none.
- **Graph coverage mode:** `graphless_fallback`; database graph writes were skipped to preserve the explicit lineage-only write boundary.
- **Ruled out:** corpus-wide frontmatter/filename regression; executable, credential, or trust-boundary regression; additional same-class gap; P0 trajectory.
- **Clean proof:** 163/163 generic validation; 0 hyphenated stems; 13/13 scoped commits documentation-only; final replay found no new root cause.

## Audit Appendix

### Iteration Replay

| Iteration | Dimension | Ratio | New findings | Result |
|---:|---|---:|---|---|
| 1 | correctness | 1.00 | F001 | conditional |
| 2 | security | 0.00 | none | clean; F001 carried |
| 3 | traceability | 1.00 | F002-F004 | conditional |
| 4 | maintainability/stabilization | 0.00 | none | conditional; registry stable |

- Stop policy was `max-iterations`; convergence before iteration 4 was telemetry only.
- Final dimension coverage is 4/4 with one stabilization pass.
- The latest two-ratio rolling average is 0.50, so no false composite-convergence claim is made.
- The hard iteration ceiling permits synthesis while failed quality gates remain visible.

### Verification Evidence

| Check | Result |
|---|---|
| Target inventory | 163 files: code-opencode 65, code-webflow 95, code-quality 3 |
| Generic document validation | 163/163 exit 0 |
| Hyphenated target stems | 0 |
| Semantic structure matrix | 1 missing wrapper, 1 intro/Purpose containment duplicate |
| Scoped commit mutation types | 13/13 changed only `.md` or `.json` |
| Tracked `sk-code` Markdown link scan | 326 files, 2 pre-existing/out-of-scope link-shaped artifacts |
| Strict Level 2 packet validation | FAILED: 0 errors, 5 warnings, including 25 uncited completed rows |
| Iteration mechanical verifier | 4/4 pass |

### Adversarial Replay

- F001-F003 survived counterevidence review at P1.
- F004 stayed P2 because governing scope is correct and only the summary table is stale.
- No P0 candidate survived the shared security/correctness minimums.

### Artifact Boundary

The artifact root was bound directly from `config.fanout_lineage_artifact_dir`; `resolveArtifactRoot` was not executed. The canonical reducer CLI was not invoked because it has no lineage artifact-dir parameter and would resolve/write the spec's shared `review/` root. Equivalent registry/dashboard/resource-map synthesis was written only inside this detached lineage directory, and no save/staging step touched paths outside it.
